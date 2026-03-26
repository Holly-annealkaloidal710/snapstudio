/* eslint-disable */
// @ts-nocheck

import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"
import { createCanvas, loadImage } from "https://deno.land/x/canvas@v1.4.1/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { imageId, imagePath } = await req.json();
    if (!imageId || !imagePath) {
      throw new Error("imageId and imagePath are required.");
    }

    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 1. Download the original image
    const { data: imageBlob, error: downloadError } = await adminClient.storage
      .from('generated-images')
      .download(imagePath);

    if (downloadError) throw new Error(`Failed to download image: ${downloadError.message}`);

    const imageBuffer = await imageBlob.arrayBuffer();
    const image = await loadImage(new Uint8Array(imageBuffer));

    // 2. Create canvas and add watermark
    const canvas = createCanvas(image.width(), image.height());
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);

    const watermarkText = 'SnapStudio.app';
    const fontSize = Math.max(image.width() * 0.03, 20);
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 2;
    
    const textMetrics = ctx.measureText(watermarkText);
    const x = image.width() - textMetrics.width - 20;
    const y = image.height() - 20;

    ctx.strokeText(watermarkText, x, y);
    ctx.fillText(watermarkText, x, y);

    // 3. Upload the watermarked image
    const watermarkedImageBuffer = canvas.toBuffer("image/png");
    const watermarkedPath = `watermarked/${imagePath}`;

    const { error: uploadError } = await adminClient.storage
      .from('generated-images')
      .upload(watermarkedPath, watermarkedImageBuffer, {
        contentType: 'image/png',
        upsert: true,
      });

    if (uploadError) throw new Error(`Failed to upload watermarked image: ${uploadError.message}`);

    // 4. Get public URL and update the database record
    const { data: publicUrlData } = adminClient.storage
      .from('generated-images')
      .getPublicUrl(watermarkedPath);

    const { error: updateError } = await adminClient
      .from('generated_images')
      .update({ watermarked_image_url: publicUrlData.publicUrl })
      .eq('id', imageId);

    if (updateError) throw new Error(`Failed to update database record: ${updateError.message}`);

    return new Response(JSON.stringify({ success: true, watermarkedUrl: publicUrlData.publicUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error('Watermark function error:', message);
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
})