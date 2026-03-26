/* eslint-disable */
// @ts-nocheck

import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const FL_REGEX = /fl([a-z0-9]{8})/i;

function* iterateStringsDeep(obj: unknown): Generator<string> {
  if (obj == null) return;
  if (typeof obj === "string") {
    yield obj;
    return;
  }
  if (Array.isArray(obj)) {
    for (const item of obj) {
      yield* iterateStringsDeep(item);
    }
    return;
  }
  if (typeof obj === "object") {
    for (const [, value] of Object.entries(obj as Record<string, unknown>)) {
      yield* iterateStringsDeep(value);
    }
  }
}

function findFLCode(payload: any): string | null {
  for (const s of iterateStringsDeep(payload)) {
    const match = s.match(FL_REGEX);
    if (match) {
      return match[0];
    }
  }
  return null;
}

function findVirtualAccount(payload: any): string | null {
  return payload?.subAccount?.trim() || payload?.virtualAccount?.trim() || null;
}

function findAmount(payload: any): number | null {
  const amount = payload?.amount ?? payload?.transAmount ?? payload?.value;
  if (typeof amount === 'number' && isFinite(amount)) return amount;
  if (typeof amount === 'string') {
    const num = parseFloat(amount);
    if (!isNaN(num)) return num;
  }
  return null;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKeySecret = Deno.env.get("SEPAY_WEBHOOK_API_KEY");
    if (!apiKeySecret) {
      console.error("[snapstudio-webhook] CRITICAL: SEPAY_WEBHOOK_API_KEY secret is not configured.");
      return new Response(JSON.stringify({ success: false, error: "Webhook API Key not configured." }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const authHeader = req.headers.get("Authorization");
    const incomingApiKey = authHeader?.startsWith("Apikey ") ? authHeader.substring(7) : null;

    if (incomingApiKey !== apiKeySecret) {
      console.error("[snapstudio-webhook] Authentication failed.");
      return new Response(JSON.stringify({ success: false, error: "Invalid API Key." }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const payload = await req.json();
    const supabase = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");

    const foundFL = findFLCode(payload);
    if (foundFL) {
      const suffix = (foundFL.match(FL_REGEX)?.[1] || "").toLowerCase();
      if (suffix) {
        const { data: order, error } = await supabase.rpc('get_pending_order_by_id_prefix', { _prefix: suffix }).maybeSingle();
        if (error) throw new Error(`DB query error (FL match): ${error.message}`);
        if (order?.id && order.status === "pending") {
          const { error: invokeError } = await supabase.functions.invoke("confirm-payment", { body: { order_id: order.id } });
          if (invokeError) {
            throw new Error(`Failed to invoke confirm-payment for order ${order.id}: ${invokeError.message}`);
          }
          return new Response(JSON.stringify({ success: true, matched: "transfer_content", order_id: order.id }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
      }
    }

    const va = findVirtualAccount(payload);
    const amount = findAmount(payload);
    if (va && amount) {
      const { data: orders, error } = await supabase.from("orders").select("id, status").eq("payment_id", va).eq("amount", amount).eq("status", "pending");
      if (error) throw new Error(`DB query error (VA match): ${error.message}`);
      if (orders?.length === 1) {
        const { error: invokeError } = await supabase.functions.invoke("confirm-payment", { body: { order_id: orders[0].id } });
        if (invokeError) {
          throw new Error(`Failed to invoke confirm-payment for order ${orders[0].id}: ${invokeError.message}`);
        }
        return new Response(JSON.stringify({ success: true, matched: "virtual_account", order_id: orders[0].id }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }

    return new Response(JSON.stringify({ success: true, message: "No unique matching order found" }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[snapstudio-webhook] CRITICAL ERROR:", message || err);
    return new Response(JSON.stringify({ success: false, error: message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});