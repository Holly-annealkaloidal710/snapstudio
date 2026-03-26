/* eslint-disable */
// @ts-nocheck

import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type PlanInfo = {
  id: string
  name: string
  billing_period: 'monthly' | 'yearly'
  points: number // Monthly allocation
  price_usd: number
  description: string
  features: string[]
}

const USD_VND_RATE = Number(Deno.env.get('USD_VND_RATE') ?? '26400')

// Enhanced plan definitions with validation
const PLANS: Record<string, PlanInfo> = {
  // Monthly plans
  'starter_monthly': { 
    id: 'starter_monthly', 
    name: 'Starter', 
    billing_period: 'monthly', 
    points: 1200, 
    price_usd: 5,
    description: 'Perfect for small businesses and startups',
    features: ['1,200 points/month', '~10 image sets', 'All templates', 'HD downloads']
  },
  'pro_monthly': { 
    id: 'pro_monthly', 
    name: 'Pro', 
    billing_period: 'monthly', 
    points: 5000, 
    price_usd: 20,
    description: 'Most popular choice for growing businesses',
    features: ['5,000 points/month', '~41 image sets', 'Priority support', 'Advanced features']
  },
  'business_monthly': { 
    id: 'business_monthly', 
    name: 'Business', 
    billing_period: 'monthly', 
    points: 15000, 
    price_usd: 60,
    description: 'For established businesses with high volume needs',
    features: ['15,000 points/month', '~125 image sets', 'Team features', 'API access']
  },
  'enterprise_monthly': { 
    id: 'enterprise_monthly', 
    name: 'Enterprise', 
    billing_period: 'monthly', 
    points: 50000, 
    price_usd: 199,
    description: 'Complete solution for large enterprises',
    features: ['50,000 points/month', '~416 image sets', 'Dedicated support', 'Custom integrations']
  },
  
  // Yearly plans (17% discount)
  'starter_yearly': { 
    id: 'starter_yearly', 
    name: 'Starter Yearly', 
    billing_period: 'yearly', 
    points: 1200, 
    price_usd: 50,
    description: 'Annual starter plan with savings',
    features: ['1,200 points/month', 'Billed annually', '17% savings', 'All starter features']
  },
  'pro_yearly': { 
    id: 'pro_yearly', 
    name: 'Pro Yearly', 
    billing_period: 'yearly', 
    points: 5000, 
    price_usd: 200,
    description: 'Annual pro plan - best value',
    features: ['5,000 points/month', 'Billed annually', '17% savings', 'All pro features']
  },
  'business_yearly': { 
    id: 'business_yearly', 
    name: 'Business Yearly', 
    billing_period: 'yearly', 
    points: 15000, 
    price_usd: 600,
    description: 'Annual business plan with maximum savings',
    features: ['15,000 points/month', 'Billed annually', '17% savings', 'All business features']
  },
  'enterprise_yearly': { 
    id: 'enterprise_yearly', 
    name: 'Enterprise Yearly', 
    billing_period: 'yearly', 
    points: 50000, 
    price_usd: 1990,
    description: 'Annual enterprise solution',
    features: ['50,000 points/month', 'Billed annually', '17% savings', 'All enterprise features']
  },
}

function toVND(priceUsd: number, rate: number) {
  const raw = priceUsd * rate
  // Round to nearest 1,000 VND for cleaner display
  return Math.round(raw / 1000) * 1000
}

function validatePlanId(planId: string): PlanInfo | null {
  if (!planId || typeof planId !== 'string') {
    return null;
  }
  
  const plan = PLANS[planId];
  if (!plan) {
    return null;
  }
  
  // Additional validation
  if (!plan.name || !plan.price_usd || !plan.points) {
    console.error(`Invalid plan configuration for ${planId}:`, plan);
    return null;
  }
  
  return plan;
}

function generateOrderDescription(orderId: string): string {
  // Create a shorter, more user-friendly description
  return `FL${orderId.substring(0, 8).toUpperCase()}`;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  let adminClient;
  let user;
  
  try {
    // Initialize Supabase admin client
    adminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Authenticate user
    const authHeader = req.headers.get('Authorization') || ''
    if (!authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Missing or invalid authorization header' }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    const token = authHeader.substring(7);
    const { data: { user: authUser }, error: authError } = await adminClient.auth.getUser(token);
    
    if (authError || !authUser) {
      console.error('Authentication failed:', authError);
      return new Response(JSON.stringify({ error: 'Unauthorized - invalid token' }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
    
    user = authUser;
    console.log(`Processing order creation for user: ${user.id}`);

    // Parse and validate request body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      return new Response(JSON.stringify({ error: 'Invalid JSON in request body' }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    const planId = body?.planId;
    
    // Validate plan
    const plan = validatePlanId(planId);
    if (!plan) {
      console.error(`Invalid plan ID received: ${planId}`);
      return new Response(JSON.stringify({ 
        error: `Invalid plan ID: ${planId}. Available plans: ${Object.keys(PLANS).join(', ')}` 
      }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    console.log(`Creating order for plan: ${plan.name} (${plan.billing_period})`);

    // Calculate pricing
    const rate = USD_VND_RATE;
    const amountVnd = toVND(plan.price_usd, rate);
    
    if (amountVnd <= 0) {
      return new Response(JSON.stringify({ error: 'Invalid amount calculated' }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    // Cancel any existing pending orders for this user
    try {
      const { error: cancelError } = await adminClient
        .from('orders')
        .update({ status: 'rejected' })
        .match({ user_id: user.id, status: 'pending' });
      
      if (cancelError) {
        console.warn('Warning: Could not cancel existing pending orders:', cancelError);
        // Don't fail the request for this
      }
    } catch (cancelError) {
      console.warn('Warning: Error canceling existing orders:', cancelError);
    }

    // Get payment configuration from environment
    const bankBin = Deno.env.get("SEPAY_BANK_BIN") || "970418"; // Default: Vietcombank
    const bankVA = Deno.env.get("SEPAY_BANK_VA");
    
    if (!bankVA) {
      console.error('SEPAY_BANK_VA environment variable not configured');
      return new Response(JSON.stringify({ error: 'Payment system configuration error' }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    const bankName = "Ngân hàng TMCP Ngoại thương Việt Nam";
    const accountName = "FALAB APP";
    const paymentMethod = 'sepay_va';
    const beneficiary = bankVA;

    // Create order in database
    const orderData = {
      user_id: user.id,
      order_type: 'subscription',
      item_id: planId,
      amount: amountVnd,
      currency: 'VND',
      status: 'pending',
      payment_method: paymentMethod,
      payment_id: beneficiary,
      metadata: {
        plan_id: plan.id,
        plan_name: plan.name,
        billing_period: plan.billing_period,
        points: plan.points,
        price_usd: plan.price_usd,
        fx_rate: rate,
        price_vnd_display: amountVnd,
        features: plan.features,
        description: plan.description,
        created_via: 'web_app',
        user_agent: req.headers.get('user-agent') || 'unknown'
      }
    };

    const { data: newOrder, error: orderError } = await adminClient
      .from('orders')
      .insert(orderData)
      .select('id')
      .single();

    if (orderError || !newOrder) {
      console.error('Database error creating order:', orderError);
      return new Response(JSON.stringify({ 
        error: `Could not create order: ${orderError?.message || 'Unknown database error'}` 
      }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    const orderId = newOrder.id;
    const description = generateOrderDescription(orderId);
    
    // Generate QR code URL with proper encoding
    const qrParams = new URLSearchParams({
      acc: beneficiary,
      bank: bankBin,
      amount: amountVnd.toString(),
      des: description
    });
    const qrUrl = `https://qr.sepay.vn/img?${qrParams.toString()}`;

    console.log(`Order created successfully: ${orderId}, Amount: ${amountVnd} VND`);

    // Return comprehensive order information
    const response = {
      success: true,
      orderId,
      amount: amountVnd,
      description,
      qrUrl,
      beneficiary,
      bankBin,
      bankName,
      accountName,
      // Plan information
      planId: plan.id,
      planName: plan.name,
      billingPeriod: plan.billing_period,
      points: plan.points,
      priceUsd: plan.price_usd,
      fxRate: rate,
      priceVnd: amountVnd,
      // Additional metadata
      features: plan.features,
      planDescription: plan.description,
      // Timestamps
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    console.error('Critical error in order creation:', error);
    
    // Log additional context for debugging
    console.error('Error context:', {
      userId: user?.id || 'unknown',
      timestamp: new Date().toISOString(),
      error: message
    });
    
    return new Response(JSON.stringify({ 
      error: message,
      code: 'ORDER_CREATION_FAILED',
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
})