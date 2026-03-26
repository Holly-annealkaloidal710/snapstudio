import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createSupabaseServerClient } from '@/integrations/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (!code) {
    // Redirect to an error page if the auth code is missing
    console.error('Auth callback error: No code provided.');
    return NextResponse.redirect(`${origin}/auth/auth-code-error?message=Missing authorization code`)
  }

  const cookieStore = cookies()
  const supabase = createSupabaseServerClient(cookieStore)

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (!error) {
    // On successful authentication, redirect the user
    return NextResponse.redirect(`${origin}${next}`)
  }

  // On failure, log the error and redirect to an error page
  console.error('Supabase auth callback error:', error.message);
  return NextResponse.redirect(`${origin}/auth/auth-code-error?message=Could not exchange code for session`)
}