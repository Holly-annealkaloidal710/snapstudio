"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { getSupabaseClient } from '@/integrations/supabase/client';
import { isDemoMode, DEMO_USER, DEMO_PROFILE } from '@/lib/demo-mode';
import type { User, SupabaseClient, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

interface Profile {
  id: string;
  points_balance: number;
  full_name: string | null;
  email: string | null;
  subscription_plan: string;
  subscription_expires_at: string | null;
  subscription_starts_at: string | null;
  images_generated: number;
  images_limit: number;
  created_at: string;
  updated_at: string;
  avatar_url?: string | null;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  supabase: SupabaseClient;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [supabase] = useState(() => getSupabaseClient());
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();

  const loadProfile = useCallback(async (currentUser: User) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (error) {
        console.error('Profile load error:', error.message);
        setProfile(null);
      } else {
        setProfile(data as Profile);
      }
    } catch (error) {
      console.error('Exception in loadProfile:', error);
      setProfile(null);
    }
  }, [supabase]);

  useEffect(() => {
    if (initialized) return;

    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Demo mode: use mock user and profile immediately
        if (isDemoMode()) {
          if (mounted) {
            setUser(DEMO_USER as any);
            setProfile(DEMO_PROFILE as Profile);
            setLoading(false);
            setInitialized(true);
          }
          return;
        }

        const { data: { session }, error } = await supabase.auth.getSession();

        if (!mounted) return;

        if (error) {
          console.error('Initial session error:', error);
          setUser(null);
          setProfile(null);
        } else if (session?.user) {
          setUser(session.user);
          await loadProfile(session.user);
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        if (mounted) {
          console.error('Exception getting initial session:', error);
          setUser(null);
          setProfile(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    initializeAuth();

    // Skip auth listener in demo mode
    if (isDemoMode()) {
      return;
    }

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (!mounted) return;

        console.log('Auth state change:', event);

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          const currentUser = session?.user || null;
          setUser(currentUser);

          if (currentUser) {
            await loadProfile(currentUser);
          } else {
            setProfile(null);
          }
        }

        if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
        }

        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, loadProfile, initialized]);

  const refreshProfile = useCallback(async () => {
    if (isDemoMode()) return;
    if (user) {
      await loadProfile(user);
    }
  }, [user, loadProfile]);

  const value = { user, profile, loading, supabase, refreshProfile };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
