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

    // Auth check: only admin allowed
    const authHeader = req.headers.get("Authorization") || ""
    const token = authHeader.replace("Bearer ", "")
    const { data: userRes, error: userErr } = await supabaseAdmin.auth.getUser(token)
    if (userErr || !userRes?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } })
    }

    const userId = userRes.user.id
    const { data: prof, error: profErr } = await supabaseAdmin
      .from("profiles")
      .select("subscription_plan")
      .eq("id", userId)
      .single()

    if (profErr || prof?.subscription_plan !== "admin") {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } })
    }

    const { days = 30 } = await req.json().catch(() => ({ days: 30 }))
    const now = new Date()
    const startDateIso = new Date(now.getTime() - Number(days) * 24 * 60 * 60 * 1000).toISOString()

    // Load raw data (users, images, renders) in the given window
    const [{ data: users }, { data: images }, { data: renders }] = await Promise.all([
      supabaseAdmin.from("profiles").select("created_at, subscription_plan").gte("created_at", startDateIso),
      supabaseAdmin.from("generated_images").select("created_at, image_type").gte("created_at", startDateIso),
      supabaseAdmin.from("renders").select("created_at, cost_vnd").gte("created_at", startDateIso),
    ])

    // Build daily users
    const dailyUsers: { date: string; users: number }[] = []
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const dateKey = d.toISOString().substring(0, 10) // UTC day key, consistent with previous charts
      const count = (users || []).filter((u) => (u.created_at || "").startsWith(dateKey)).length
      dailyUsers.push({
        date: d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }),
        users: count,
      })
    }

    // Build daily images
    const dailyImages: { date: string; images: number }[] = []
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const dateKey = d.toISOString().substring(0, 10)
      const count = (images || []).filter((img) => (img.created_at || "").startsWith(dateKey)).length
      dailyImages.push({
        date: d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }),
        images: count,
      })
    }

    // Build daily cost (VND) from renders
    const dailyCost: { date: string; cost_vnd: number }[] = []
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const dateKey = d.toISOString().substring(0, 10)
      const cost = (renders || [])
        .filter((r) => (r.created_at || "").startsWith(dateKey))
        .reduce((sum, r) => sum + Number(r.cost_vnd || 0), 0)
      dailyCost.push({
        date: d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }),
        cost_vnd: cost,
      })
    }

    const totalCostVnd = (renders || []).reduce((s, r) => s + Number(r.cost_vnd || 0), 0)

    // Images by type
    const typeTotals = {
      display: (images || []).filter((i) => i.image_type === "display").length,
      model: (images || []).filter((i) => i.image_type === "model").length,
      social: (images || []).filter((i) => i.image_type === "social").length,
      seeding: (images || []).filter((i) => i.image_type === "seeding").length,
    }
    const imagesByType = [
      { name: "Display", value: typeTotals.display, color: "#3B82F6" },
      { name: "Model", value: typeTotals.model, color: "#10B981" },
      { name: "Social", value: typeTotals.social, color: "#F59E0B" },
      { name: "Seeding", value: typeTotals.seeding, color: "#8B5CF6" },
    ]

    // Users by plan (overall)
    const { data: allUsers } = await supabaseAdmin.from("profiles").select("subscription_plan")
    const planCount = {
      free: (allUsers || []).filter((u) => u.subscription_plan === "free").length,
      starter: (allUsers || []).filter((u) => u.subscription_plan === "starter").length,
      pro: (allUsers || []).filter((u) => u.subscription_plan === "pro").length,
      business: (allUsers || []).filter((u) => u.subscription_plan === "business").length,
      enterprise: (allUsers || []).filter((u) => u.subscription_plan === "enterprise").length,
    }
    const usersByPlan = [
      { name: "Free", value: planCount.free, color: "#6B7280" },
      { name: "Starter", value: planCount.starter, color: "#F59E0B" },
      { name: "Pro", value: planCount.pro, color: "#3B82F6" },
      { name: "Business", value: planCount.business, color: "#8B5CF6" },
      { name: "Enterprise", value: planCount.enterprise, color: "#1F2937" },
    ]

    return new Response(
      JSON.stringify({
        dailyUsers,
        dailyImages,
        dailyCost,
        totalCostVnd,
        imagesByType,
        usersByPlan,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    })
  }
})