/* eslint-disable */
// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    )

    // Auth check: only admin
    const authHeader = req.headers.get("Authorization") || ""
    const token = authHeader.replace("Bearer ", "")
    const { data: userRes } = await supabaseAdmin.auth.getUser(token)
    if (!userRes?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } })
    }

    const userId = userRes.user.id
    const { data: prof } = await supabaseAdmin
      .from("profiles")
      .select("subscription_plan")
      .eq("id", userId)
      .single()

    if (prof?.subscription_plan !== "admin") {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } })
    }

    const { days = 30, mode = "all" } = await req.json().catch(() => ({ days: 30, mode: "all" }))
    const modeFilter = mode === "all" ? null : mode

    // Use RPC for daily profit report (function is SECURITY DEFINER in DB)
    const { data: reports, error: rpcErr } = await supabaseAdmin.rpc("get_daily_profit_report", {
      days_back: Number(days),
      mode_filter: modeFilter,
    })
    if (rpcErr) {
      throw new Error(`RPC error: ${rpcErr.message}`)
    }

    // Recent render logs (include profile emails)
    const { data: renders, error: rendersErr } = await supabaseAdmin
      .from("renders")
      .select("id, user_id, mode, images_generated, total_tokens, cost_vnd, points_spent, created_at")
      .order("created_at", { ascending: false })
      .limit(50)

    if (rendersErr) {
      throw new Error(`Renders load error: ${rendersErr.message}`)
    }

    const userIds = Array.from(new Set((renders || []).map((r) => r.user_id)))
    let profileMap: Record<string, { email: string | null }> = {}

    if (userIds.length > 0) {
      const { data: profileList } = await supabaseAdmin
        .from("profiles")
        .select("id, email")
        .in("id", userIds)

      profileMap = Object.fromEntries((profileList || []).map((p) => [p.id, { email: p.email }]))
    }

    const logs = (renders || []).map((r) => ({
      ...r,
      profiles: { email: profileMap[r.user_id]?.email ?? null },
    }))

    return new Response(JSON.stringify({ dailyReports: reports || [], renderLogs: logs }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    })
  }
})