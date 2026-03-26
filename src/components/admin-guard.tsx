"use client";

import { ReactNode, useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/integrations/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const supabase = createSupabaseBrowserClient();

export function AdminGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.replace('/login?next=/admin');
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('subscription_plan')
          .eq('id', user.id)
          .single();

        if (error || !profile || profile.subscription_plan !== 'admin') {
          router.replace('/dashboard');
          return;
        }

        setIsAdmin(true);
      } catch (error) {
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="ml-4 text-lg">Đang kiểm tra quyền truy cập...</p>
      </div>
    );
  }

  if (isAdmin) {
    return <>{children}</>;
  }

  return null;
}