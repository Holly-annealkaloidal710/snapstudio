/* eslint-disable */
// @ts-nocheck

import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { user } = await req.json()
    if (!user) {
      throw new Error("User not found in request body")
    }

    // Create a Supabase client with the service role key to query user profiles
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch the user's profile to check their subscription_plan (role)
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('subscription_plan')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error(`Error fetching profile for user ${user.id}:`, error.message)
      // If profile is not found or there's an error, default to not being an admin
      return new Response(JSON.stringify({ session: { ...user, app_metadata: { claims_admin: false } } }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    const isAdmin = profile?.subscription_plan === 'admin'

    // The payload to be returned, adding the custom claim to app_metadata
    const responsePayload = {
      session: {
        ...user,
        app_metadata: {
          ...user.app_metadata,
          claims_admin: isAdmin,
        },
      },
    }

    return new Response(JSON.stringify(responsePayload), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.error('Custom claims function error:', message)
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})