/* eslint-disable */
// @ts-nocheck

import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// This function should be called monthly via cron job
// It allocates monthly points to users with active yearly subscriptions

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get all users with active yearly subscriptions
    const now = new Date().toISOString();
    
    const { data: activeSubscribers, error: fetchError } = await supabaseAdmin
      .from('profiles')
      .select('id, subscription_plan, subscription_starts_at, subscription_expires_at, points_balance')
      .not('subscription_expires_at', 'is', null)
      .gt('subscription_expires_at', now) // Still active
      .not('subscription_starts_at', 'is', null);

    if (fetchError) {
      throw new Error(`Error fetching subscribers: ${fetchError.message}`);
    }

    if (!activeSubscribers || activeSubscribers.length === 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'No active subscribers found',
        processed: 0 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Define monthly points for each plan
    const planPoints: Record<string, number> = {
      'starter': 120,
      'pro': 500,
      'business': 1500,
      'enterprise': 5000
    };

    let processed = 0;
    const results = [];

    for (const subscriber of activeSubscribers) {
      try {
        // Check if this is a yearly subscription (duration > 40 days)
        const startDate = new Date(subscriber.subscription_starts_at);
        const endDate = new Date(subscriber.subscription_expires_at);
        const durationDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
        
        if (durationDays < 40) {
          // This is likely a monthly subscription, skip
          continue;
        }

        // Check if we already allocated points this month
        const thisMonth = new Date();
        const monthStart = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1).toISOString();
        const monthEnd = new Date(thisMonth.getFullYear(), thisMonth.getMonth() + 1, 0, 23, 59, 59).toISOString();

        const { data: existingAllocation } = await supabaseAdmin
          .from('points_ledger')
          .select('id')
          .eq('user_id', subscriber.id)
          .eq('reason', 'monthly_allocation')
          .gte('created_at', monthStart)
          .lte('created_at', monthEnd)
          .limit(1);

        if (existingAllocation && existingAllocation.length > 0) {
          // Already allocated this month
          continue;
        }

        // Get monthly points for this plan
        const monthlyPoints = planPoints[subscriber.subscription_plan] || 0;
        if (monthlyPoints === 0) {
          continue;
        }

        // Update user's points balance
        const newBalance = (subscriber.points_balance || 0) + monthlyPoints;
        
        await supabaseAdmin
          .from('profiles')
          .update({ points_balance: newBalance })
          .eq('id', subscriber.id);

        // Record in ledger
        await supabaseAdmin
          .from('points_ledger')
          .insert({
            user_id: subscriber.id,
            delta: monthlyPoints,
            reason: 'monthly_allocation',
            related_id: null,
            metadata: {
              plan: subscriber.subscription_plan,
              allocation_month: thisMonth.toISOString().substring(0, 7), // YYYY-MM
              previous_balance: subscriber.points_balance || 0,
              new_balance: newBalance
            }
          });

        // Send notification
        await supabaseAdmin
          .from('notifications')
          .insert({
            user_id: subscriber.id,
            type: 'points_allocated',
            content: `Đã cấp ${monthlyPoints} điểm cho tháng ${thisMonth.getMonth() + 1}/${thisMonth.getFullYear()}. Số dư hiện tại: ${newBalance} pts.`,
            link_to: '/dashboard/billing'
          });

        processed++;
        results.push({
          user_id: subscriber.id,
          plan: subscriber.subscription_plan,
          points_allocated: monthlyPoints,
          new_balance: newBalance
        });

      } catch (error) {
        console.error(`Error processing user ${subscriber.id}:`, error);
        results.push({
          user_id: subscriber.id,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Monthly allocation completed. Processed ${processed} users.`,
      processed,
      total_subscribers: activeSubscribers.length,
      results
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error('Monthly allocation error:', message);
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
})