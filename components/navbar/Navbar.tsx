"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { NAV_ITEMS, SOCIAL_LINKS } from "@/lib/constants/siteData";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { SocialRow } from "@/lib/data/social";
import { Sun, Menu, X } from "lucide-react";

interface NavbarProps {
  socialLinks?: SocialRow[];
}

export const Navbar: React.FC<NavbarProps> = ({ socialLinks }) => {
  const [activeItem, setActiveItem] = useState("Home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Pick top enabled link for the nav bar action icon (favoring GitHub if available)
  const primarySocial =
    socialLinks?.find((l) => l.platform.toLowerCase() === "github") ||
    socialLinks?.[0] || {
      platform: "github",
      icon: "github",
      label: "GitHub",
      url: SOCIAL_LINKS.github,
    };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Simple section detection on scroll
      const sections = NAV_ITEMS.map((item) => item.href.replace("#", "")).filter(
        (id) => id && id !== "home"
      );

      const scrollPos = window.scrollY + 200;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          const matched = NAV_ITEMS.find((item) => item.href === `#${sections[i]}`);
          if (matched) {
            setActiveItem(matched.label);
            return;
          }
        }
      }
      if (window.scrollY < 300) {
        setActiveItem("Home");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#040812]/90 backdrop-blur-md border-b border-white/[0.07] py-3.5 shadow-lg shadow-black/40"
          : "bg-[#040812]/70 backdrop-blur-sm border-b border-white/[0.04] py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="#home" className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00F0C0] rounded">
          <BrandLogo />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2" aria-label="Main Navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = activeItem === item.label;
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setActiveItem(item.label)}
                className={`relative px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-[#00F0C0]"
                    : "text-slate-400 hover:text-slate-100"
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    className="absolute -bottom-1 left-3 right-3 h-[2px] bg-[#00F0C0] rounded-full shadow-[0_0_8px_#00F0C0]"
                    aria-hidden="true"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right Action Icons */}
        <div className="hidden md:flex items-center space-x-4">
          <a
            href={primarySocial.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={primarySocial.label || "Cyberforage Social"}
            title={primarySocial.label}
            className="p-1.5 text-slate-400 hover:text-[#00F0C0] hover:bg-white/5 rounded-lg transition-colors"
          >
            <SocialIcon platform={primarySocial.platform} icon={primarySocial.icon} className="w-4 h-4" />
          </a>
          <button
            type="button"
            aria-label="Display Settings"
            className="p-1.5 text-slate-400 hover:text-[#00F0C0] hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            onClick={() => {}}
          >
            <Sun className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center space-x-2">
          <a
            href={primarySocial.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={primarySocial.label || "Social"}
            className="p-1.5 text-slate-400 hover:text-white"
          >
            <SocialIcon platform={primarySocial.platform} icon={primarySocial.icon} className="w-4 h-4" />
          </a>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 text-slate-400 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00F0C0] rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/[0.08] bg-[#050B14]/98 backdrop-blur-xl px-4 pt-3 pb-6 space-y-1">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => {
                setActiveItem(item.label);
                setMobileMenuOpen(false);
              }}
              className={`block px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                activeItem === item.label
                  ? "text-[#00F0C0] bg-[#00F0C0]/10 border-l-2 border-[#00F0C0]"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};
