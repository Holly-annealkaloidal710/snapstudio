/* eslint-disable */
// @ts-nocheck

import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

function buildDescription(orderId: string): string {
  return `FL${orderId.substring(0, 8).toUpperCase()}`;
}

function validateOrderData(order: any): boolean {
  return !!(
    order &&
    order.id &&
    order.user_id &&
    order.amount &&
    order.payment_id &&
    order.metadata
  );
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders })
  }

  let supabaseClient;
  let adminClient;
  let user;

  try {
    // Initialize clients
    supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );
    
    adminClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Authenticate user
    const authHeader = req.headers.get("Authorization") || "";
    if (!authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }), { 
        status: 401, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    const token = authHeader.substring(7);
    const { data: { user: authUser }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !authUser) {
      console.error('Authentication failed:', authError);
      return new Response(JSON.stringify({ error: "Unauthorized" }), { 
        status: 401, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }
    
    user = authUser;
    console.log(`Getting payment info for user: ${user.id}`);

    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      body = {}; // Default to empty object if no body
    }
    
    const requestedOrderId = body?.order_id;

    let order;
    
    if (requestedOrderId) {
      // Get specific order
      console.log(`Looking for specific order: ${requestedOrderId}`);
      const { data, error } = await adminClient
        .from("orders")
        .select("*")
        .eq("id", requestedOrderId)
        .eq("user_id", user.id) // Security: ensure user owns the order
        .maybeSingle();
        
      if (error) {
        console.error('Error fetching specific order:', error);
        return new Response(JSON.stringify({ error: "Database error" }), { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        });
      }
      
      order = data;
    } else {
      // Get most recent pending order
      console.log(`Looking for pending orders for user: ${user.id}`);
      const { data, error } = await adminClient
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
        
      if (error) {
        console.error('Error fetching pending orders:', error);
        return new Response(JSON.stringify({ error: "Database error" }), { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        });
      }
      
      order = data;
    }

    // No pending order found
    if (!order) {
      console.log(`No pending order found for user: ${user.id}`);
      return new Response(JSON.stringify({ pending: false }), { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    // Validate order status
    if (order.status !== "pending") {
      console.log(`Order ${order.id} is not pending (status: ${order.status})`);
      return new Response(JSON.stringify({ 
        pending: false, 
        status: order.status,
        message: `Order is ${order.status}` 
      }), { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    // Validate order data integrity
    if (!validateOrderData(order)) {
      console.error('Invalid order data structure:', order);
      return new Response(JSON.stringify({ error: "Invalid order data" }), { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    // Check if order is expired (24 hours)
    const orderAge = Date.now() - new Date(order.created_at).getTime();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    
    if (orderAge > maxAge) {
      console.log(`Order ${order.id} is expired (${Math.round(orderAge / (60 * 60 * 1000))} hours old)`);
      
      // Auto-expire the order
      await adminClient
        .from("orders")
        .update({ status: 'rejected' })
        .eq("id", order.id);
        
      return new Response(JSON.stringify({ 
        pending: false, 
        expired: true,
        message: "Order expired after 24 hours" 
      }), { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    // Get payment configuration
    const bankBin = Deno.env.get("SEPAY_BANK_BIN") || "970418";
    const beneficiary = order.payment_id; // Virtual account
    const bankName = "Ngân hàng TMCP Ngoại thương Việt Nam";
    const accountName = "FALAB APP";
    const description = buildDescription(order.id);
    const amount = Number(order.amount || 0);

    // Validate amount
    if (amount <= 0) {
      console.error(`Invalid order amount: ${amount}`);
      return new Response(JSON.stringify({ error: "Invalid order amount" }), { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    // Generate QR code URL with proper encoding
    const qrParams = new URLSearchParams({
      acc: beneficiary,
      bank: bankBin,
      amount: amount.toString(),
      des: description
    });
    const qrUrl = `https://qr.sepay.vn/img?${qrParams.toString()}`;

    console.log(`Returning payment info for order: ${order.id}, Amount: ${amount} VND`);

    // Return comprehensive payment information
    const response = {
      pending: true,
      orderId: order.id,
      amount,
      description,
      qrUrl,
      beneficiary,
      bankBin,
      bankName,
      accountName,
      // Plan information from metadata
      planName: order.metadata?.plan_name || order.item_id,
      billingPeriod: order.metadata?.billing_period || "monthly",
      points: order.metadata?.points || 0,
      priceUsd: order.metadata?.price_usd || 0,
      fxRate: order.metadata?.fx_rate || 26400,
      // Additional info
      createdAt: order.created_at,
      expiresAt: new Date(new Date(order.created_at).getTime() + maxAge).toISOString(),
      timeRemaining: Math.max(0, maxAge - orderAge)
    };

    return new Response(JSON.stringify(response), { 
      status: 200, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    console.error('Critical error in get-order-payment-info:', error);
    
    // Log context for debugging
    console.error('Error context:', {
      userId: user?.id || 'unknown',
      timestamp: new Date().toISOString(),
      error: message
    });
    
    return new Response(JSON.stringify({ 
      error: message,
      code: 'PAYMENT_INFO_ERROR',
      timestamp: new Date().toISOString()
    }), { 
      status: 500, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });
  }
})