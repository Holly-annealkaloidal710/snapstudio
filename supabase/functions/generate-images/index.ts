/* eslint-disable */
// @ts-nocheck

import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    // Get user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    const requestBody = await req.json().catch(() => ({}))
    const { 
      productName, 
      originalImageBase64, 
      originalImageMimeType, 
      projectId, 
      customKeywords, 
      industry, 
      mode = 'batch', 
      isPublic = true,
      batchConfig
    } = requestBody

    // Validate required fields
    if (!productName?.trim()) {
      return new Response(JSON.stringify({ error: 'Product name is required' }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }
    if (!originalImageBase64) {
      return new Response(JSON.stringify({ error: 'Image data is required' }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }
    if (!projectId) {
      return new Response(JSON.stringify({ error: 'Project ID is required' }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }
    if (!industry) {
      return new Response(JSON.stringify({ error: 'Industry is required' }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    // Atomic deduction via RPC
    const BATCH_COST_POINTS = 120;
    const { data: ok, error: spendErr } = await supabaseClient.rpc('spend_points', {
      _user_id: user.id,
      _amount: BATCH_COST_POINTS,
      _reason: 'spend_generation',
      _metadata: { mode, projectId }
    })
    if (spendErr) {
      console.error('spend_points error:', spendErr)
      return new Response(JSON.stringify({ error: 'Failed to check user balance' }), { 
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }
    if (!ok) {
      return new Response(JSON.stringify({ error: 'Insufficient points' }), { 
        status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    // Update project status to 'processing'
    const { error: updateError } = await supabaseClient
      .from('projects')
      .update({ status: 'processing' })
      .eq('id', projectId)

    if (updateError) {
      console.error('Error updating project status:', updateError)
    }

    // Invoke background processor (fire-and-forget)
    supabaseClient.functions.invoke('process-batch-generation', {
      body: {
        projectId,
        userId: user.id,
        originalImageBase64,
        originalImageMimeType: originalImageMimeType || 'image/png',
        productName: productName.trim(),
        customKeywords: customKeywords?.trim() || '',
        industry,
        mode,
        isPublic,
        batchConfig
      }
    }).catch(error => {
      console.error('Background processing error:', error)
    })

    // Return immediately to the client
    return new Response(JSON.stringify({ 
      success: true, 
      message: "Image generation process started in the background." 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error starting generation job:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ error: message }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })
  }
})