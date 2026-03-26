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
  return mode === 'solo' || mode === 'fast' ? 0.039 : 0.0195;
}

function pointsPerImage(mode: string): number {
  return mode === 'solo' || mode === 'fast' ? 30 : 10;
}

interface GenerateSoloRequest {
  prompt: string;
  images: { data: string; mimeType: string }[];
  mode?: 'fast' | 'solo';
  isPublic?: boolean;
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

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('Unauthorized')

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { prompt, images, mode = 'solo', isPublic = true }: GenerateSoloRequest = await req.json()
    if (!prompt || !images || images.length === 0) throw new Error('Missing prompt or images')

    const SOLO_COST_POINTS = pointsPerImage(mode);

    // Atomic deduction
    const { data: ok, error: spendErr } = await supabaseClient.rpc('spend_points', {
      _user_id: user.id,
      _amount: SOLO_COST_POINTS,
      _reason: 'spend_generation',
      _metadata: { mode }
    })
    if (spendErr) throw new Error('Failed to check user balance')
    if (!ok) throw new Error('Insufficient points')

    const MODEL_ID = 'gemini-2.5-flash-image-preview'
    const GEN_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent`

    const parts = [{ text: prompt }, ...images.map(img => ({ inlineData: { mimeType: img.mimeType, data: img.data } }))]
    const body = { contents: [{ role: "user", parts }] }

    const resp = await fetch(GEN_URL, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': Deno.env.get('GEMINI_API_KEY') ?? '' }, body: JSON.stringify(body) })
    if (!resp.ok) throw new Error(`Gemini API error: ${resp.statusText}`)

    const json = await resp.json()
    const usageMetadata = json.usageMetadata || {}
    const promptTokens = usageMetadata.promptTokenCount || 0
    const candidatesTokens = usageMetadata.candidatesTokenCount || 0
    const totalTokens = promptTokens + candidatesTokens

    const imageDataBase64 = json?.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData)?.inlineData?.data
    if (!imageDataBase64) throw new Error('No image returned')

    const bytes = base64ToUint8Array(imageDataBase64)
    const path = `${user.id}/solo/${Date.now()}.png`
    const { error: uploadError } = await adminClient.storage.from('generated-images').upload(path, bytes, { contentType: 'image/png' })
    if (uploadError) throw uploadError

    const { data: pub } = adminClient.storage.from('generated-images').getPublicUrl(path)
    const publicUrl = pub.publicUrl

    const costUsd = unitPrice(mode)
    const costVnd = Math.round(costUsd * EXCHANGE_RATE)
    const pointsSpent = SOLO_COST_POINTS

    await adminClient.from('renders').insert({
      user_id: user.id, mode, images_generated: 1, prompt_tokens: promptTokens, candidates_tokens: candidatesTokens, total_tokens: totalTokens,
      unit_price_usd: costUsd, cost_usd: costUsd, cost_vnd: costVnd, points_spent: pointsSpent, prompt_used: prompt.substring(0, 500), metadata: { custom_prompt: true }
    })
    
    const { data: currentProfile } = await adminClient.from('profiles').select('images_generated').eq('id', user.id).single();

    await adminClient.from('profiles').update({
      images_generated: (currentProfile?.images_generated || 0) + 1
    }).eq('id', user.id);

    // Watermark for public solo
    if (isPublic) {
      adminClient.functions.invoke('add-watermark', {
        body: { imageId: null, imagePath: path } // optional: if want to update DB with watermarked_image_url for solo entries with a DB row
      }).catch(() => {})
    }

    return new Response(JSON.stringify({ success: true, imageUrl: publicUrl, prompt, pointsDeducted: pointsSpent, costUsd: costUsd.toFixed(4), tokensUsed: totalTokens }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})