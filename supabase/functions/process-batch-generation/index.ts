/* eslint-disable */
// @ts-nocheck

import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const EXCHANGE_RATE = 26400;

function unitPrice(mode: string): number {
  return mode === 'slow' || mode === 'batch' ? 0.0195 : 0.039;
}

function pointsPerImage(mode: string): number {
  return mode === 'slow' || mode === 'batch' ? 10 : 30;
}

function base64ToUint8Array(base64: string) {
  const binary = atob(base64)
  const len = binary.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

function safeMime(m?: string) {
  if (!m) return 'image/png'
  if (m.startsWith('image/')) return m
  return 'image/png'
}

function mimeToExt(m: string) {
  if (m === 'image/jpeg' || m === 'image/jpg') return '.jpg'
  if (m === 'image/webp') return '.webp'
  return '.png'
}

serve(async (req: Request) => {
  try {
    const { 
      projectId, 
      userId, 
      originalImageBase64, 
      originalImageMimeType, 
      productName, 
      customKeywords, 
      industry, 
      mode = 'batch', 
      isPublic = true,
      batchConfig = { display: 3, model: 3, social: 3, seeding: 3 }
    } = await req.json();

    if (!projectId || !userId || !originalImageBase64 || !productName || !industry) {
      throw new Error("Missing required parameters for background processing.");
    }

    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY') ?? '';

    const inputMime = safeMime(originalImageMimeType);
    const inputExt = mimeToExt(inputMime);

    // Dynamically fetch templates based on batchConfig
    let templates = [];
    const templatePromises = [];

    for (const [category, count] of Object.entries(batchConfig)) {
      if (count > 0) {
        const promise = adminClient
          .from('prompt_templates')
          .select('*')
          .eq('is_active', true)
          .eq('industry', industry)
          .eq('category', category)
          .limit(count);
        templatePromises.push(promise);
      }
    }

    const results = await Promise.all(templatePromises);
    for (const result of results) {
      if (result.error) throw new Error(`Failed to load templates: ${result.error.message}`);
      if (result.data) templates.push(...result.data);
    }

    // Fallback to 'other' industry if not enough templates
    const needed = 12 - templates.length;
    if (needed > 0 && industry !== 'other') {
      const fallbackPromises = [];
      for (const [category, count] of Object.entries(batchConfig)) {
        const currentCount = templates.filter(t => t.category === category).length;
        const neededForCategory = count - currentCount;
        if (neededForCategory > 0) {
          const promise = adminClient
            .from('prompt_templates')
            .select('*')
            .eq('is_active', true)
            .eq('industry', 'other')
            .eq('category', category)
            .limit(neededForCategory);
          fallbackPromises.push(promise);
        }
      }
      const fallbackResults = await Promise.all(fallbackPromises);
      for (const result of fallbackResults) {
        if (result.error) console.error(`Fallback template error: ${result.error.message}`);
        if (result.data) templates.push(...result.data);
      }
    }

    if (templates.length !== 12) {
      throw new Error(`Could not fetch exactly 12 templates. Found ${templates.length}.`);
    }

    const MODEL_ID = 'gemini-2.5-flash-image-preview';
    const GEN_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent`;

    let totalPromptTokens = 0, totalCandidatesTokens = 0, totalImagesGenerated = 0;

    for (const template of templates as any[]) {
      let prompt = template.prompt_template.replace('{product}', productName);
      if (customKeywords) prompt += `, ${customKeywords}`;

      const body = { contents: [{ role: "user", parts: [{ text: prompt }, { inlineData: { mimeType: inputMime, data: originalImageBase64 } }] }] };

      try {
        const resp = await fetch(GEN_URL, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_API_KEY }, body: JSON.stringify(body) });
        if (!resp.ok) throw new Error(`Gemini API error: ${resp.statusText}`);
        
        const json = await resp.json();
        const usageMetadata = json.usageMetadata || {};
        totalPromptTokens += usageMetadata.promptTokenCount || 0;
        totalCandidatesTokens += usageMetadata.candidatesTokenCount || 0;

        const imageDataBase64 = json?.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData)?.inlineData?.data;
        if (!imageDataBase64) throw new Error('No image returned');

        const bytes = base64ToUint8Array(imageDataBase64);
        const path = `${userId}/${projectId}/${Date.now()}-${template.name.toLowerCase().replace(/\s+/g, '-')}${inputExt}`;
        const { error: uploadError } = await adminClient.storage.from('generated-images').upload(path, bytes, { contentType: inputMime });
        if (uploadError) throw uploadError;

        const { data: pub } = adminClient.storage.from('generated-images').getPublicUrl(path);
        
        const { data: newImageRecord, error: insertError } = await adminClient
          .from('generated_images')
          .insert({ 
            project_id: projectId, 
            user_id: userId, 
            image_type: template.category, 
            style_name: template.id, 
            title: template.name, 
            description: template.description, 
            image_url: pub.publicUrl, 
            prompt_used: prompt, 
            is_public: isPublic,
            industry: industry
          })
          .select('id')
          .single();

        if (insertError) throw insertError;
        
        totalImagesGenerated++;

        if (newImageRecord) {
          // Watermark (if public)
          if (isPublic) {
            adminClient.functions.invoke('add-watermark', {
              body: {
                imageId: newImageRecord.id,
                imagePath: path
              }
            }).catch(err => console.error(`Failed to invoke watermark for image ${newImageRecord.id}:`, err));
          }
          
          // Thumbnail creation (for all images)
          adminClient.functions.invoke('create-thumbnail', {
            body: {
              imageId: newImageRecord.id,
              imagePath: path
            }
          }).catch(err => console.error(`Failed to invoke thumbnail creation for image ${newImageRecord.id}:`, err));
        }

      } catch (e) {
        console.error(`Error generating image with template ${template.name}:`, e.message);
      }
    }

    const totalTokens = totalPromptTokens + totalCandidatesTokens;
    const unitPriceUsd = unitPrice(mode);
    const costUsd = totalImagesGenerated * unitPriceUsd;
    const costVnd = Math.round(costUsd * EXCHANGE_RATE);
    const pointsSpent = 120; // points were already deducted up-front

    await adminClient.from('renders').insert({ 
      user_id: userId, 
      mode, 
      images_generated: totalImagesGenerated, 
      prompt_tokens: totalPromptTokens, 
      candidates_tokens: totalCandidatesTokens, 
      total_tokens: totalTokens, 
      unit_price_usd: unitPriceUsd, 
      cost_usd: costUsd, 
      cost_vnd: costVnd, 
      points_spent: pointsSpent, 
      prompt_used: `${productName} - batch (${industry})`, 
      metadata: { projectId, industry, templatesUsed: templates.length, errors: 12 - totalImagesGenerated, batchConfig } 
    });

    await adminClient.from('projects').update({ status: totalImagesGenerated > 0 ? 'completed' : 'failed' }).eq('id', projectId);
    
    const { data: currentProfile } = await adminClient.from('profiles').select('images_generated').eq('id', userId).single();

    await adminClient.from('profiles').update({
      images_generated: (currentProfile?.images_generated || 0) + totalImagesGenerated
    }).eq('id', userId);

    return new Response(JSON.stringify({ success: true, generated: totalImagesGenerated }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Background generation error:', error);
    try {
      const { projectId } = await req.json().catch(() => ({}));
      if (projectId) {
        const adminClient = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );
        await adminClient.from('projects').update({ status: 'failed' }).eq('id', projectId);
      }
    } catch (e) {}
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});