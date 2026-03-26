import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { type cookies } from 'next/headers'
import { isDemoMode } from '@/lib/demo-mode'
import { createMockSupabaseClient } from './mock-client'

export function createSupabaseServerClient(cookieStorePromise: ReturnType<typeof cookies>) {
  if (isDemoMode()) {
    return createMockSupabaseClient() as any;
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookieStore = await cookieStorePromise;
          return cookieStore.get(name)?.value
        },
        async set(name: string, value: string, options: CookieOptions) {
          try {
            const cookieStore = await cookieStorePromise;
            cookieStore.set(name, value, options)
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        async remove(name: string, options: CookieOptions) {
          try {
            const cookieStore = await cookieStorePromise;
            cookieStore.set(name, '', options)
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
