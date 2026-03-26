import { getSupabaseClient } from '@/integrations/supabase/client';

interface EdgeFunctionOptions {
  body?: any;
  headers?: Record<string, string>;
}

interface EdgeFunctionResponse<T = any> {
  data: T | null;
  error: Error | null;
}

export class EdgeFunctionClient {
  static async invoke<T = any>(
    functionName: string, 
    options: EdgeFunctionOptions = {}
  ): Promise<EdgeFunctionResponse<T>> {
    const supabase = getSupabaseClient();
    try {
      // Ensure we have a valid session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        return {
          data: null,
          error: new Error('Session error: ' + sessionError.message)
        };
      }

      if (!session) {
        return {
          data: null,
          error: new Error('Not authenticated')
        };
      }

      const { data, error } = await supabase.functions.invoke(functionName, {
        body: options.body,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
          ...options.headers
        }
      });

      if (error) {
        let errorMessage = error.message || 'Unknown error';
        if (error.context?.status) {
          errorMessage = `HTTP ${error.context.status}: ${errorMessage}`;
        }
        if (error.context?.status === 401 || error.context?.status === 403) {
          // Try to refresh session and retry once
          const { error: refreshError } = await supabase.auth.refreshSession();
          if (!refreshError) {
            const { data: retryData, error: retryError } = await supabase.functions.invoke(functionName, {
              body: options.body,
              headers: {
                'Content-Type': 'application/json',
                ...options.headers
              }
            });
            
            if (!retryError) {
              return { data: retryData, error: null };
            }
          }
          errorMessage = 'Authentication failed. Please try logging in again.';
        }
        return { data: null, error: new Error(errorMessage) };
      }

      return { data, error: null };

    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Unexpected error')
      };
    }
  }

  static async invokeGeneration<T = any>(
    functionName: string,
    requiredPoints: number,
    body: any
  ): Promise<EdgeFunctionResponse<T>> {
    const supabase = getSupabaseClient();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { data: null, error: new Error('User not authenticated') };
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('points_balance')
        .eq('id', user.id)
        .single();

      if (!profile || (profile.points_balance || 0) < requiredPoints) {
        return {
          data: null,
          error: new Error(`Insufficient points. Need ${requiredPoints}, have ${profile?.points_balance || 0}`)
        };
      }

      return await this.invoke<T>(functionName, { body });

    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Generation failed')
      };
    }
  }

  static async isAuthenticated(): Promise<boolean> {
    const supabase = getSupabaseClient();
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return !!session?.user;
    } catch {
      return false;
    }
  }
}