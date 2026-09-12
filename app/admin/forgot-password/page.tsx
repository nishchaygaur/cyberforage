"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    const supabase = createClient();
    if (!supabase) {
      setErrorMsg("Database service not configured.");
      setIsLoading(false);
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });

    if (error) {
      setErrorMsg(error.message);
      setIsLoading(false);
      return;
    }

    setIsSubmitted(true);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#040812] flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-2xl bg-[#081220]/95 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-xl">
        <div className="flex flex-col items-center text-center mb-8">
          <BrandLogo size={36} />
          <h1 className="text-xl font-bold text-white mt-4">Reset Password</h1>
          <p className="text-xs text-slate-400 mt-1">
            Enter your administrative email to receive recovery instructions.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 mb-5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {isSubmitted ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-[#00F0C0]/10 border border-[#00F0C0]/20 flex items-center justify-center text-[#00F0C0] mx-auto mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-2">Check Your Email</h3>
            <p className="text-xs text-slate-300 mb-6 leading-relaxed">
              If an administrative account exists for <span className="text-[#00F0C0]">{email}</span>, password reset instructions have been dispatched.
            </p>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 text-xs text-[#00F0C0] hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Login</span>
            </Link>
          </div>
        ) : (
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg bg-[#00F0C0] hover:bg-[#00E5BE] text-[#04131E] font-semibold text-xs transition-colors disabled:opacity-50"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>

            <div className="text-center pt-2">
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to login</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
