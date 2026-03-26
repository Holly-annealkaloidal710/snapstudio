"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { LogIn, Mail, Lock, Loader2, Chrome, AlertCircle } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { getURL } from "@/lib/helpers";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageInner />
    </Suspense>
  );
}

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/dashboard";
  const error = searchParams.get("error");
  const { user, profile, loading: authLoading, supabase } = useAuth();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!authLoading && user && profile) {
      router.replace(nextPath);
    }
  }, [user, profile, authLoading, router, nextPath]);

  useEffect(() => {
    if (error === 'auth_callback_error') {
      toast.error('Lỗi xác thực. Vui lòng thử lại.');
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Vui lòng nhập email và mật khẩu");
      return;
    }
    
    setBusy(true);
    
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ 
          email: email.trim(), 
          password 
        });
        
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            throw new Error('Email hoặc mật khẩu không đúng');
          } else if (error.message.includes('Email not confirmed')) {
            throw new Error('Vui lòng xác nhận email trước khi đăng nhập');
          } else {
            throw error;
          }
        }
        
        toast.success("Đăng nhập thành công!");
        // Let useEffect handle redirect
      } else {
        const { data, error } = await supabase.auth.signUp({ 
          email: email.trim(), 
          password,
          options: { 
            data: { 
              full_name: email.split('@')[0] 
            }
          }
        });
        
        if (error) {
          if (error.message.includes('User already registered')) {
            throw new Error('Email này đã được đăng ký. Vui lòng đăng nhập.');
          } else if (error.message.includes('Password should be at least')) {
            throw new Error('Mật khẩu phải có ít nhất 6 ký tự');
          } else {
            throw error;
          }
        }
        
        if (data.session) {
          toast.success("Đăng ký thành công!");
          // Let useEffect handle redirect
        } else {
          toast.success("Đăng ký thành công! Vui lòng kiểm tra email để xác nhận.");
          setBusy(false);
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra");
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setBusy(true);
    
    try {
      const redirectUrl = `${getURL()}auth/callback?next=${encodeURIComponent(nextPath)}`;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { 
          redirectTo: redirectUrl
        },
      });
      
      if (error) {
        toast.error("Lỗi đăng nhập Google: " + error.message);
        setBusy(false);
      }
    } catch (error: any) {
      toast.error("Lỗi đăng nhập Google");
      setBusy(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang kiểm tra đăng nhập...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <LogIn className="w-5 h-5" />
            {mode === "login" ? "Đăng nhập" : "Đăng ký"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Có lỗi xảy ra trong quá trình xác thực. Vui lòng thử lại.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-2">
            <Button 
              type="button" 
              variant={mode === "login" ? "default" : "outline"} 
              onClick={() => setMode("login")} 
              disabled={busy} 
              size="sm"
            >
              Đăng nhập
            </Button>
            <Button 
              type="button" 
              variant={mode === "signup" ? "default" : "outline"} 
              onClick={() => setMode("signup")} 
              disabled={busy} 
              size="sm"
            >
              Đăng ký
            </Button>
          </div>

          <Button 
            type="button" 
            variant="outline" 
            className="w-full" 
            onClick={handleGoogle} 
            disabled={busy}
          >
            <Chrome className="w-4 h-4 mr-2" />
            {mode === "login" ? "Đăng nhập" : "Đăng ký"} với Google
          </Button>

          <div className="relative">
            <Separator />
            <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-white px-3 text-xs text-gray-500">
              Hoặc dùng email
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@example.com" 
                  className="pl-9" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  disabled={busy} 
                  autoComplete="email" 
                  required 
                />
              </div>
            </div>
            <div>
              <Label htmlFor="password">Mật khẩu</Label>
              <div className="relative mt-1">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-9" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  disabled={busy} 
                  autoComplete={mode === "login" ? "current-password" : "new-password"} 
                  required 
                />
              </div>
            </div>
            <Button className="w-full" type="submit" disabled={busy}>
              {busy ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                mode === "login" ? "Đăng nhập" : "Đăng ký"
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-gray-500">
            Bằng cách tiếp tục, bạn đồng ý với Điều khoản & Chính sách bảo mật.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}