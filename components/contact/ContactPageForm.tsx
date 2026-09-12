"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Shield } from "lucide-react";
import { submitContactAction } from "@/app/admin/actions";

export const ContactPageForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) {
      setErrorMsg("Please provide both your email and message.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await submitContactAction({
        name: name.trim() || email.split("@")[0],
        email: email.trim(),
        subject: subject.trim() || "Website Contact Submission",
        message: message.trim(),
      });

      if (res.success) {
        setSubmitted(true);
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        setErrorMsg(res.error || "Failed to transmit message. Please try again.");
      }
    } catch {
      setErrorMsg("Network error transmitting message. Please try again or reach out directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-[#071220]/90 border border-white/[0.08] backdrop-blur-md">
      <div className="flex items-center gap-2 mb-2">
        <Shield className="w-4 h-4 text-[#00F0C0]" />
        <span className="text-xs font-mono tracking-wider text-[#00E5BE] uppercase">
          SECURE TRANSMISSION
        </span>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Send a Direct Message</h3>
      <p className="text-xs text-slate-300 mb-6 font-normal">
        Have a security collaboration, research opportunity, or general inquiry? Send a message directly into our inbox.
      </p>

      {submitted ? (
        <div className="py-12 text-center rounded-xl bg-[#00F0C0]/5 border border-[#00F0C0]/20 p-6 space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#00F0C0]/15 flex items-center justify-center mx-auto text-[#00F0C0]">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-white">Transmission Received</h4>
          <p className="text-xs text-slate-300 max-w-sm mx-auto">
            Your message has been securely submitted to Cyberforage. We will review and respond shortly.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-3 px-4 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 transition-colors"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-xs font-mono text-slate-300 mb-1.5">
                Name (Optional)
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full px-3.5 py-2 rounded-xl bg-[#040914] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F0C0] transition-colors"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-mono text-slate-300 mb-1.5">
                Email Address <span className="text-[#00F0C0]">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@domain.com"
                className="w-full px-3.5 py-2 rounded-xl bg-[#040914] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F0C0] transition-colors"
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-xs font-mono text-slate-300 mb-1.5">
              Subject
            </label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Research Collaboration / Project Inquiry"
              className="w-full px-3.5 py-2 rounded-xl bg-[#040914] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F0C0] transition-colors"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-xs font-mono text-slate-300 mb-1.5">
              Message <span className="text-[#00F0C0]">*</span>
            </label>
            <textarea
              id="message"
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Detail your inquiry, project scope, or feedback..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#040914] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F0C0] transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#00F0C0] hover:bg-[#00F0C0]/90 text-black text-xs font-bold transition-all shadow-[0_0_20px_rgba(0,240,192,0.3)] hover:shadow-[0_0_25px_rgba(0,240,192,0.5)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? "Transmitting..." : "Send Message"}</span>
          </button>
        </form>
      )}
    </div>
  );
};
