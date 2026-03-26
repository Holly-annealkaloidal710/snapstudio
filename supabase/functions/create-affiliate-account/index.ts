/* eslint-disable */
// @ts-nocheck

import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'FL';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
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

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token)
    
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    // Check if user already has an affiliate account
    const { data: existingAffiliate, error: checkError } = await supabaseAdmin
      .from('affiliates')
      .select('id, referral_code')
      .eq('user_id', user.id)
      .single()

    if (existingAffiliate) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Affiliate account already exists',
        referral_code: existingAffiliate.referral_code 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    // Generate unique referral code
    let referralCode = generateReferralCode()
    let attempts = 0
    const maxAttempts = 10

    while (attempts < maxAttempts) {
      const { data: existing } = await supabaseAdmin
        .from('affiliates')
        .select('id')
        .eq('referral_code', referralCode)
        .single()

      if (!existing) break // Code is unique
      
      referralCode = generateReferralCode()
      attempts++
    }

    if (attempts >= maxAttempts) {
      throw new Error('Could not generate unique referral code')
    }

    // Create affiliate account
    const { data: newAffiliate, error: createError } = await supabaseAdmin
      .from('affiliates')
      .insert({
        user_id: user.id,
        referral_code: referralCode,
        is_active: true,
        commission_rate: 0.10, // 10%
        total_earnings: 0,
        total_referrals: 0
      })
      .select()
      .single()

    if (createError) {
      throw new Error(`Failed to create affiliate account: ${createError.message}`)
    }

    // Send welcome notification
    await supabaseAdmin
      .from('notifications')
      .insert({
        user_id: user.id,
        type: 'affiliate_welcome',
        content: `Chào mừng bạn trở thành CTV SnapStudio! Mã giới thiệu của bạn: ${referralCode}. Hoa hồng 10% cho mọi đơn hàng thành công.`,
        link_to: '/dashboard/affiliate'
      })

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Affiliate account created successfully',
      affiliate: newAffiliate
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.error('Create affiliate error:', message)
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})