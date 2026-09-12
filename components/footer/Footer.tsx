import React from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { NAV_ITEMS, SOCIAL_LINKS } from "@/lib/constants/siteData";
import { Github, Linkedin } from "lucide-react";

export const Footer: React.FC = () => {
  const footerLinks = NAV_ITEMS.filter((item) => item.label !== "Home");

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

          {/* Social Links */}
          <div className="flex items-center space-x-4">
            <a
              href={SOCIAL_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Cyberforage on GitHub"
              className="p-1.5 text-slate-400 hover:text-[#00F0C0] transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={SOCIAL_LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Cyberforage on LinkedIn"
              className="p-1.5 text-slate-400 hover:text-[#00F0C0] transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Bottom Row: Tagline and Copyright */}
        <div className="border-t border-white/[0.04] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-300">
          <p className="tracking-wide">Explore. Build. Defend.</p>
          <p>© 2026 Cyberforage. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
