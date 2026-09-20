"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { NAV_ITEMS, NavItem } from "@/lib/constants/siteData";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { SocialRow } from "@/lib/data/social";
import { useTheme, ThemeMode } from "@/components/theme/ThemeProvider";
import { Sun, Moon, Monitor, Check, Menu, X } from "lucide-react";

interface NavbarProps {
  socialLinks?: SocialRow[];
  navItems?: NavItem[];
}

const THEME_OPTIONS: Array<{
  mode: ThemeMode;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { mode: "dark", label: "Dark", icon: Moon },
  { mode: "light", label: "Light", icon: Sun },
  { mode: "system", label: "System", icon: Monitor },
];

export const Navbar: React.FC<NavbarProps> = ({ socialLinks, navItems }) => {
  const pathname = usePathname();
  const navList = navItems && navItems.length > 0 ? navItems : NAV_ITEMS;
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close theme dropdown on outside click or Escape key
  useEffect(() => {
    if (!themeDropdownOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setThemeDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setThemeDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [themeDropdownOpen]);

  // Pick top enabled link for the nav bar action icon (favoring GitHub if available)
  const primarySocial =
    socialLinks?.find((l) => l.platform.toLowerCase() === "github" && l.enabled !== false) ||
    socialLinks?.find((l) => l.enabled !== false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
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
        <Link href="/" className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00F0C0] rounded">
          <BrandLogo />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2" aria-label="Main Navigation">
          {navList.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.label}
                href={item.href}
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
              </Link>
            );
          })}
        </nav>

        {/* Right Action Icons */}
        <div className="hidden md:flex items-center space-x-4">
          
{/* n8n Access Button */}
<a
  href="https://n8n.cyberforage.space"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center gap-2 rounded-lg border border-[#00F0C0]/30 bg-[#00F0C0]/5 px-3 py-2 text-xs font-semibold text-[#00F0C0] transition-colors hover:border-[#00F0C0] hover:bg-[#00F0C0]/10"
>
  <span className="h-1.5 w-1.5 rounded-full bg-[#00F0C0] shadow-[0_0_8px_#00F0C0]" />
  Request n8n Access
</a>
          {primarySocial && (
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
          )}

          {/* Theme Switcher */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              aria-label="Display Settings"
              aria-haspopup="true"
              aria-expanded={themeDropdownOpen}
              className="p-1.5 text-slate-400 hover:text-[#00F0C0] hover:bg-white/5 rounded-lg transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00F0C0]"
              onClick={() => setThemeDropdownOpen((prev) => !prev)}
            >
              {!mounted ? (
                <Sun className="w-4 h-4" />
              ) : theme === "light" ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : theme === "dark" ? (
                <Moon className="w-4 h-4 text-[#00F0C0]" />
              ) : (
                <Monitor className="w-4 h-4 text-slate-300" />
              )}
            </button>

            {themeDropdownOpen && (
              <div
                role="menu"
                aria-label="Theme selection"
                className="absolute right-0 mt-2 w-36 rounded-xl bg-[#081220] border border-white/10 py-1.5 shadow-xl shadow-black/50 z-50 animate-in fade-in zoom-in-95 duration-100"
              >
                {THEME_OPTIONS.map(({ mode, label, icon: Icon }) => {
                  const isSelected = mounted && theme === mode;
                  return (
                    <button
                      key={mode}
                      role="menuitem"
                      type="button"
                      onClick={() => {
                        setTheme(mode);
                        setThemeDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium transition-colors ${
                        isSelected
                          ? "text-[#00F0C0] bg-[#00F0C0]/10"
                          : "text-slate-300 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5" />
                        {label}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#00F0C0]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Action Icons & Hamburger Button */}
        <div className="flex md:hidden items-center space-x-1.5">
          {primarySocial && (
            <a
              href={primarySocial.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={primarySocial.label || "Social"}
              className="p-1.5 text-slate-400 hover:text-white"
            >
              <SocialIcon platform={primarySocial.platform} icon={primarySocial.icon} className="w-4 h-4" />
            </a>
          )}
          <button
            type="button"
            aria-label="Display Settings"
            onClick={() => {
              if (theme === "dark") setTheme("light");
              else if (theme === "light") setTheme("system");
              else setTheme("dark");
            }}
            className="p-1.5 text-slate-400 hover:text-[#00F0C0] hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
          >
            {!mounted ? (
              <Sun className="w-4 h-4" />
            ) : theme === "light" ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : theme === "dark" ? (
              <Moon className="w-4 h-4 text-[#00F0C0]" />
            ) : (
              <Monitor className="w-4 h-4 text-slate-300" />
            )}
          </button>
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
          {navList.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                  isActive
                    ? "text-[#00F0C0] bg-[#00F0C0]/10 border-l-2 border-[#00F0C0]"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          
<a
  href="https://n8n.cyberforage.space"
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => setMobileMenuOpen(false)}
  className="block rounded-lg border border-[#00F0C0]/30 bg-[#00F0C0]/5 px-3 py-2.5 text-base font-medium text-[#00F0C0] transition-colors hover:bg-[#00F0C0]/10"
>
  <span className="mr-2">●</span>
  Request n8n Access
</a>
          {/* Mobile Theme Selector */}
          <div className="pt-4 mt-3 border-t border-white/[0.08]">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2 px-3">
              Theme
            </div>
            <div className="grid grid-cols-3 gap-2 px-3">
              {THEME_OPTIONS.map(({ mode, label, icon: Icon }) => {
                const isSelected = mounted && theme === mode;
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setTheme(mode)}
                    className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-[#00F0C0]/15 text-[#00F0C0] border border-[#00F0C0]/40 shadow-sm"
                        : "text-slate-400 hover:text-white bg-white/[0.03] border border-white/[0.06]"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
