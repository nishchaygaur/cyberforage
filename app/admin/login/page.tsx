"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, AlertCircle, ArrowRight, Shield } from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/admin";
  const errorParam = searchParams.get("error");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const supabase = createClient();
      if (!supabase) {
        setErrorMsg(
          "Supabase environment variables are missing. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
        );
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // Verify profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_active")
          .eq("id", data.user.id)
          .single();

        if (profile && !profile.is_active) {
          await supabase.auth.signOut();
          setErrorMsg("Your account has been deactivated. Please contact an administrator.");
          setIsLoading(false);
          return;
        }

        router.push(redirectPath);
        router.refresh();
      }
    } catch {
      setErrorMsg("An unexpected authentication error occurred.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-2xl bg-[#081220]/95 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-xl">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center mb-8">
        <BrandLogo size={42} />
        <h1 className="text-xl font-bold tracking-tight text-white mt-4">
          CYBER<span className="text-[#00F0C0]">FORAGE</span>
        </h1>
        <p className="text-xs font-mono tracking-widest text-[#00E5BE]/80 uppercase mt-1">
          CONTROL PANEL AUTHENTICATION
        </p>
      </div>

      {/* URL Parameter Error Banners */}
      {errorParam === "unconfigured" && (
        <div className="p-3.5 mb-5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            Database environment variables are not yet configured. Please set credentials in your environment.
          </span>
        </div>
      )}

      {errorParam === "forbidden" && (
        <div className="p-3.5 mb-5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>You do not have administrative privileges to access this console.</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 mb-5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-slate-300 block mb-1.5">
            Admin Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@cyberforage.space"
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F0C0]/50 transition-colors"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-slate-300">
              Password
            </label>
            <Link
              href="/admin/forgot-password"
              className="text-[11px] text-[#00F0C0] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F0C0]/50 transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center justify-between py-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded bg-black/40 border-white/10 text-[#00F0C0] focus:ring-0"
            />
            <span className="text-xs text-slate-400">Remember session</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#00F0C0] hover:bg-[#00E5BE] text-[#04131E] font-semibold text-xs transition-all duration-200 shadow-[0_0_20px_rgba(0,240,192,0.3)] disabled:opacity-50"
        >
          <span>{isLoading ? "Authenticating..." : "Sign In to Console"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Security Footer Note */}
      <div className="mt-8 pt-6 border-t border-white/[0.06] text-center">
        <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
          <Shield className="w-3 h-3 text-[#00F0C0]" />
          <span>Restricted Administrative System</span>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#040812] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#00F0C0]/[0.03] blur-[120px] rounded-full pointer-events-none"
        aria-hidden="true"
      />
      <Suspense
        fallback={
          <div className="w-full max-w-md p-8 rounded-2xl bg-[#081220]/90 border border-white/10 text-center text-xs text-slate-400">
            Loading authentication console...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
