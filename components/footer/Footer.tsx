import React from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { NAV_ITEMS, SOCIAL_LINKS } from "@/lib/constants/siteData";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { SiteSettingsRow } from "@/lib/data/site";
import { SocialRow, DEFAULT_PUBLIC_SOCIALS } from "@/lib/data/social";

interface FooterProps {
  siteSettings?: SiteSettingsRow | null;
  socialLinks?: SocialRow[];
}

export const Footer: React.FC<FooterProps> = ({ siteSettings, socialLinks }) => {
  const footerLinks = NAV_ITEMS.filter((item) => item.label !== "Home");
  const socials = (socialLinks && socialLinks.length > 0) ? socialLinks : DEFAULT_PUBLIC_SOCIALS;

  return (
    <footer className="relative bg-[#030712] border-t border-white/[0.06] pt-12 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Row: Brand, Nav Links, Socials */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10">
          {/* Brand Logo */}
          <Link href="#home" className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00F0C0] rounded">
            <BrandLogo />
          </Link>

          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2" aria-label="Footer Navigation">
            {footerLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-xs sm:text-sm text-slate-400 hover:text-white transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Social Links from CMS */}
          <div className="flex items-center space-x-3">
            {socials.map((link) => (
              <a
                key={link.id || link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label || `Cyberforage on ${link.platform}`}
                title={link.label}
                className="p-1.5 text-slate-400 hover:text-[#00F0C0] transition-colors"
              >
                <SocialIcon platform={link.platform} icon={link.icon} className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Row: Tagline, Owner Identity, and Copyright */}
        <div className="border-t border-white/[0.04] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-300">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1">
            <p className="tracking-wide">{siteSettings?.tagline || "Explore. Build. Defend."}</p>
            {siteSettings?.owner_name && (
              <span className="text-slate-400 text-[11px]">
                • Led by <span className="text-slate-200">{siteSettings.owner_name}</span>
                {siteSettings.owner_title ? ` (${siteSettings.owner_title})` : ""}
              </span>
            )}
          </div>
          <p>{siteSettings?.copyright_text || "© 2026 Cyberforage. All rights reserved."}</p>
        </div>
      </div>
    </footer>
  );
};
