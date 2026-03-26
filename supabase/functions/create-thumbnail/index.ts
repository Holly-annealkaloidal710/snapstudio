/* eslint-disable */
// @ts-nocheck

import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"
import { Image } from "https://deno.land/x/imagescript@1.2.15/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const THUMBNAIL_WIDTH = 512;

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
    const image = await Image.decode(imageBuffer);

    // 2. Resize the image
    image.resize(THUMBNAIL_WIDTH, Image.RESIZE_AUTO);
    const thumbnailBuffer = await image.encode(0.8); // Encode to JPEG with 80% quality

    // 3. Upload the thumbnail image
    const thumbnailPath = `thumbnails/${imagePath.replace(/\.[^/.]+$/, "")}.jpg`;

    const { error: uploadError } = await adminClient.storage
      .from('generated-images')
      .upload(thumbnailPath, thumbnailBuffer, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (uploadError) throw new Error(`Failed to upload thumbnail: ${uploadError.message}`);

    // 4. Get public URL and update the database record
    const { data: publicUrlData } = adminClient.storage
      .from('generated-images')
      .getPublicUrl(thumbnailPath);

    const { error: updateError } = await adminClient
      .from('generated_images')
      .update({ thumbnail_url: publicUrlData.publicUrl })
      .eq('id', imageId);

    if (updateError) throw new Error(`Failed to update database with thumbnail URL: ${updateError.message}`);

    return new Response(JSON.stringify({ success: true, thumbnailUrl: publicUrlData.publicUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error('Create thumbnail function error:', message);
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
})