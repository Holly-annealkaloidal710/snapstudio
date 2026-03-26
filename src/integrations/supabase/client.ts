import { createBrowserClient } from '@supabase/ssr'
import { isDemoMode } from '@/lib/demo-mode'
import { createMockSupabaseClient } from './mock-client'

export function createSupabaseBrowserClient() {
  if (isDemoMode()) {
    return createMockSupabaseClient() as any;
  }
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Create a singleton instance for consistent usage
let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseClient() {
  if (!supabaseInstance) {
    if (isDemoMode()) {
      supabaseInstance = createMockSupabaseClient() as any;
    } else {
      supabaseInstance = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
    }
  }
  return supabaseInstance;
}
