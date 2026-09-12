"use client";

import React, { useState } from "react";
import { Mail, Phone, Globe, MapPin, Shield, MessageSquare, ExternalLink, User } from "lucide-react";
import { WhatsAppIcon, SocialIcon } from "@/components/ui/SocialIcon";
import { ContactInfoRow } from "@/lib/data/contact";
import { SocialRow } from "@/lib/data/social";
import { SiteSettingsRow } from "@/lib/data/site";
import { ContactModal } from "./ContactModal";

interface ContactCardProps {
  contactInfo?: ContactInfoRow | null;
  socialLinks?: SocialRow[];
  siteSettings?: SiteSettingsRow | null;
  className?: string;
}

export const ContactCard: React.FC<ContactCardProps> = ({
  contactInfo,
  socialLinks = [],
  siteSettings,
  className = "",
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const displayName =
    contactInfo?.display_name ||
    siteSettings?.owner_name ||
    siteSettings?.site_name ||
    "Cyberforage";

  const titleOrRole =
    siteSettings?.owner_title ||
    siteSettings?.tagline ||
    "Security & Technology Ecosystem";

  const description =
    contactInfo?.description ||
    siteSettings?.short_description ||
    "Communication channel for research collaborations, security projects, and ecosystem inquiries.";

  return (
    <>
      <div
        className={`relative rounded-2xl bg-[#081220]/90 border border-white/[0.08] hover:border-[#00F0C0]/30 backdrop-blur-md p-6 sm:p-8 shadow-xl transition-all duration-300 ${className}`}
      >
        {/* Glow ambient accent */}
        <div
          className="absolute -top-12 -right-12 w-48 h-48 bg-[#00F0C0]/[0.06] blur-[60px] rounded-full pointer-events-none"
          aria-hidden="true"
        />

        {/* Profile / Identity Header (GitHub Style) */}
        <div className="flex items-start gap-4 mb-6 relative z-10">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#061528] to-[#0a2340] border border-[#00F0C0]/30 flex items-center justify-center text-[#00F0C0] shadow-[0_0_20px_rgba(0,240,192,0.15)] flex-shrink-0">
              <Shield className="w-8 h-8" />
            </div>
            <div
              className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#081220] shadow-[0_0_8px_rgba(16,185,129,0.8)]"
              title="Verified Secure Channel"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight truncate">
                {displayName}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-[#00F0C0]/10 border border-[#00F0C0]/30 text-[10px] font-mono text-[#00E5BE] uppercase tracking-wider">
                Active
              </span>
            </div>
            <p className="text-xs sm:text-sm font-mono text-[#00E5BE] mt-0.5 truncate">
              {titleOrRole}
            </p>
          </div>
        </div>

        {/* Bio / Description */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 relative z-10 font-normal">
          {description}
        </p>

        {/* Direct Channels (GitHub-style metadata list) */}
        <div className="space-y-2.5 mb-6 relative z-10 pt-4 border-t border-white/[0.06] text-xs font-mono">
          {contactInfo?.location && (
            <div className="flex items-center gap-2.5 text-slate-300">
              <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>{contactInfo.location}</span>
            </div>
          )}

          {contactInfo?.email && (
            <div className="flex items-center gap-2.5 text-slate-300">
              <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <a
                href={`mailto:${contactInfo.email}`}
                className="text-cyan-300 hover:text-white hover:underline transition-colors truncate"
              >
                {contactInfo.email}
              </a>
            </div>
          )}

          {contactInfo?.phone && (
            <div className="flex items-center gap-2.5 text-slate-300">
              <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <a
                href={
                  contactInfo.phone.startsWith("tel:")
                    ? contactInfo.phone
                    : `tel:${contactInfo.phone.replace(/\s+/g, "")}`
                }
                className="hover:text-white transition-colors"
              >
                {contactInfo.phone}
              </a>
            </div>
          )}

          {contactInfo?.whatsapp && (
            <div className="flex items-center gap-2.5 text-slate-300">
              <WhatsAppIcon className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <a
                href={contactInfo.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 transition-colors inline-flex items-center gap-1"
              >
                <span>Direct WhatsApp</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {contactInfo?.website && (
            <div className="flex items-center gap-2.5 text-slate-300">
              <Globe className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <a
                href={contactInfo.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-white transition-colors truncate inline-flex items-center gap-1"
              >
                <span>{contactInfo.website.replace(/^https?:\/\//, "")}</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </div>
          )}
        </div>

        {/* Social Accounts Row */}
        {socialLinks.length > 0 && (
          <div className="mb-6 relative z-10 pt-4 border-t border-white/[0.06]">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2.5 block">
              Connected Networks
            </span>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.id || link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-[#00F0C0]/10 border border-white/[0.08] hover:border-[#00F0C0]/40 text-xs font-mono text-slate-300 hover:text-white transition-all group"
                  title={link.label}
                >
                  <SocialIcon platform={link.platform} icon={link.icon} className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* CTA Button */}
        <div className="relative z-10 pt-2">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#00E5BE] hover:bg-[#00F0C0] text-[#04131E] font-semibold text-sm transition-all duration-200 shadow-[0_0_20px_rgba(0,229,190,0.3)] hover:shadow-[0_0_25px_rgba(0,240,192,0.45)] cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Send Transmission</span>
          </button>
        </div>
      </div>

      <ContactModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        contactInfo={contactInfo}
      />
    </>
  );
};
