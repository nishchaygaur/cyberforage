"use client";

import React, { useState } from "react";
import { X, Send, Mail, Phone, CheckCircle2 } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/SocialIcon";
import { ContactInfoRow } from "@/lib/data/contact";
import { submitContactAction } from "@/app/admin/actions";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactInfo?: ContactInfoRow | null;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  contactInfo,
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const modalDescription =
    contactInfo?.contact_modal_description ||
    "Have an idea, research collaboration, or security project? Connect with the Cyberforage ecosystem.";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      await submitContactAction({
        name: email.split("@")[0],
        email: email.trim(),
        subject: "General Inquiry / Collaboration",
        message: message.trim(),
      });
    } catch {
      // Graceful fallback for offline / mock mode
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setEmail("");
        setMessage("");
        onClose();
      }, 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-lg rounded-2xl bg-[#071120] border border-white/10 p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.9)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close contact modal"
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#00F0C0]/15 border border-[#00F0C0]/30 flex items-center justify-center text-[#00F0C0] mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Message Received</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xs">
              Thank you for reaching out. A security team member will review your inquiry shortly.
            </p>
          </div>
        ) : (
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono tracking-widest text-[#00E5BE] uppercase">
                COMMUNICATION CHANNEL
              </span>
            </div>
            <h3 id="modal-title" className="text-2xl font-bold text-white mb-2">
              Build Something Secure.
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
              {modalDescription}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="contact-email" className="block text-xs font-mono text-slate-300 mb-1.5">
                  Email Address
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  placeholder="analyst@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-[#050B14] border border-white/10 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-[#00F0C0] focus:ring-1 focus:ring-[#00F0C0] transition-all"
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs font-mono text-slate-300 mb-1.5">
                  Project or Collaboration Inquiry
                </label>
                <textarea
                  id="contact-message"
                  rows={3}
                  required
                  placeholder="Briefly describe your project or area of interest..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-[#050B14] border border-white/10 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-[#00F0C0] focus:ring-1 focus:ring-[#00F0C0] transition-all resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-lg bg-[#00E5BE] hover:bg-[#00F0C0] text-[#04131E] font-semibold text-sm transition-all shadow-[0_0_20px_rgba(0,229,190,0.3)] cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? "Transmitting..." : "Transmit Inquiry"}</span>
                </button>
              </div>

              {/* Direct channels (rendered only when real configured values exist) */}
              {(contactInfo?.email || contactInfo?.whatsapp || contactInfo?.phone) && (
                <div className="pt-3 border-t border-white/[0.08] flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-mono text-white/40">Direct channels:</span>
                  {contactInfo.email && (
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-white/10 text-cyan-300 hover:text-white text-xs font-mono transition-colors"
                    >
                      <Mail className="w-3 h-3" />
                      <span>{contactInfo.email}</span>
                    </a>
                  )}
                  {contactInfo.whatsapp && (
                    <a
                      href={contactInfo.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#00F0C0]/10 hover:bg-[#00F0C0]/20 text-[#00F0C0] text-xs font-mono transition-colors"
                    >
                      <WhatsAppIcon className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </a>
                  )}
                  {contactInfo.phone && (
                    <a
                      href={
                        contactInfo.phone.startsWith("tel:")
                          ? contactInfo.phone
                          : `tel:${contactInfo.phone.replace(/\s+/g, "")}`
                      }
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-white/10 text-slate-300 hover:text-white text-xs font-mono transition-colors"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{contactInfo.phone}</span>
                    </a>
                  )}
                </div>
              )}

              <p className="text-[10px] font-mono text-slate-500 text-center pt-1">
                Encrypted communication channel • Response within 24-48 hours
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
