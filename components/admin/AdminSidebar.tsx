"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderGit2,
  BookOpen,
  FlaskConical,
  Cpu,
  Compass,
  Settings,
  Mail,
  Share2,
  Menu,
  Palette,
  Search,
  Image as ImageIcon,
  History,
  ExternalLink,
  LogOut,
  X,
  Inbox,
  Shield,
} from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";

interface NavGroup {
  title: string;
  items: {
    label: string;
    href: string;
    icon: React.ElementType;
  }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "Projects", href: "/admin/projects", icon: FolderGit2 },
      { label: "Research", href: "/admin/research", icon: BookOpen },
      { label: "Labs", href: "/admin/labs", icon: FlaskConical },
      { label: "Technologies", href: "/admin/technologies", icon: Cpu },
      { label: "Exploration", href: "/admin/exploration", icon: Compass },
    ],
  },
  {
    title: "Site & Comms",
    items: [
      { label: "Site Settings", href: "/admin/settings", icon: Settings },
      { label: "Contact Info", href: "/admin/contact", icon: Mail },
      { label: "Inquiries", href: "/admin/contact-submissions", icon: Inbox },
      { label: "Social Links", href: "/admin/social", icon: Share2 },
      { label: "Navigation", href: "/admin/navigation", icon: Menu },
      { label: "Appearance", href: "/admin/appearance", icon: Palette },
      { label: "SEO Settings", href: "/admin/seo", icon: Search },
      { label: "Media Library", href: "/admin/media", icon: ImageIcon },
    ],
  },
  {
    title: "Administration",
    items: [
      { label: "Audit Logs", href: "/admin/activity", icon: History },
    ],
  },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isOpen,
  onClose,
  onLogout,
}) => {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#050B14] border-r border-white/[0.08] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-white/[0.08] flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2.5">
            <BrandLogo size={24} />
            <div className="flex flex-col">
              <span className="font-bold tracking-wider text-sm text-white">
                CYBER<span className="text-[#00F0C0]">FORAGE</span>
              </span>
              <span className="text-[9px] font-mono tracking-widest text-[#00E5BE]/80 uppercase">
                CONTROL PANEL
              </span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white p-1"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {NAV_GROUPS.map((group) => {
            const visibleItems = group.items;

            if (visibleItems.length === 0) return null;

            return (
              <div key={group.title}>
                <div className="px-3 mb-2 text-[10px] font-mono tracking-widest uppercase text-slate-500 font-semibold">
                  {group.title}
                </div>
                <div className="space-y-0.5">
                  {visibleItems.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      item.href === "/admin"
                        ? pathname === "/admin"
                        : pathname.startsWith(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          isActive
                            ? "bg-[#00F0C0]/10 text-[#00F0C0] font-semibold border border-[#00F0C0]/20 shadow-[0_0_15px_rgba(0,240,192,0.1)]"
                            : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? "text-[#00F0C0]" : "text-slate-400"}`} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-white/[0.08] space-y-1">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-[#00F0C0] hover:bg-white/[0.04] transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <ExternalLink className="w-4 h-4 text-slate-400" />
              <span>Public Site</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Live ↗</span>
          </Link>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
