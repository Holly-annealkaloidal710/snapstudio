/* eslint-disable */
// @ts-nocheck

import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type OrderRow = {
  user_id: string
  status: string
  item_id: string
  metadata: any
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { order_id } = await req.json();
    if (!order_id) {
      throw new Error("order_id is required.");
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: order, error: fetchError } = await supabaseAdmin
      .from('orders')
      .select('user_id, status, item_id, metadata')
      .eq('id', order_id)
      .single();

    if (fetchError || !order) {
      throw new Error(`Order ${order_id} not found. ${fetchError?.message}`);
    }

    if (order.status !== 'pending') {
      return new Response(JSON.stringify({ success: true, message: `Order already processed (status: ${order.status}).` }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Mark order completed
    await supabaseAdmin
      .from('orders')
      .update({ status: 'completed' })
      .eq('id', order_id);

    const points = Number(order.metadata?.points ?? 0)
    const planName = String(order.metadata?.plan_name ?? order.item_id)
    const billingPeriod = String(order.metadata?.billing_period ?? 'monthly')
    const priceUsd = Number(order.metadata?.price_usd ?? 0)
    const fxRate = Number(order.metadata?.fx_rate ?? 0)
    const priceVnd = Number(order.metadata?.price_vnd_display ?? 0)

    const pointsToGiveNow = points;

    // Fetch current balance
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('points_balance')
      .eq('id', order.user_id)
      .single();

    const current = Number(profile?.points_balance ?? 0)
    const next = current + (Number.isFinite(pointsToGiveNow) ? pointsToGiveNow : 0)

    // Update balance
    await supabaseAdmin
      .from('profiles')
      .update({ points_balance: next })
      .eq('id', order.user_id);

    // Subscription tracking
    if (billingPeriod === 'yearly') {
      const now = new Date().toISOString();
      const subscriptionEnd = new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000).toISOString();

      await supabaseAdmin
        .from('profiles')
        .update({ 
          subscription_plan: order.item_id.includes('enterprise') ? 'enterprise' : 
                           order.item_id.includes('business') ? 'business' :
                           order.item_id.includes('pro') ? 'pro' : 'starter',
          subscription_starts_at: now,
          subscription_expires_at: subscriptionEnd
        })
        .eq('id', order.user_id);
    } else {
      const now = new Date().toISOString();
      const subscriptionEnd = new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();

      await supabaseAdmin
        .from('profiles')
        .update({ 
          subscription_plan: order.item_id.includes('enterprise') ? 'enterprise' : 
                           order.item_id.includes('business') ? 'business' :
                           order.item_id.includes('pro') ? 'pro' : 'starter',
          subscription_starts_at: now,
          subscription_expires_at: subscriptionEnd
        })
        .eq('id', order.user_id);
    }

    // Ledger entry (purchase)
    await supabaseAdmin
      .from('points_ledger')
      .insert({
        user_id: order.user_id,
        delta: pointsToGiveNow,
        reason: billingPeriod === 'yearly' ? 'yearly_subscription_first_month' : 'monthly_subscription',
        related_id: order_id,
        metadata: {
          plan_name: planName,
          item_id: order.item_id,
          billing_period: billingPeriod,
          price_usd: priceUsd,
          fx_rate: fxRate,
          price_vnd: priceVnd,
          monthly_points: points,
          is_first_payment: true
        }
      });

    // Notify user
    const notificationContent = billingPeriod === 'yearly' 
      ? `Đăng ký thành công gói ${planName} (Yearly)! Nhận ${pointsToGiveNow} pts tháng này, ${points} pts/tháng trong 12 tháng.`
      : `Đăng ký thành công gói ${planName}! Nhận ${pointsToGiveNow} pts cho tháng này.`;

    await supabaseAdmin
      .from('notifications')
      .insert({
        user_id: order.user_id,
        type: 'payment_success',
        content: notificationContent,
        link_to: '/dashboard/billing'
      });

    return new Response(JSON.stringify({ 
      success: true, 
      message: `User ${order.user_id} credited ${pointsToGiveNow} pts for ${billingPeriod} plan.`,
      billing_period: billingPeriod,
      points_given: pointsToGiveNow,
      monthly_allocation: points
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
})