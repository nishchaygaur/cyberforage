"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Shield, User } from "lucide-react";

interface AdminHeaderProps {
  userName?: string;
  userRole?: string;
  onOpenMobileSidebar: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  userName = "Admin User",
  userRole = "editor",
  onOpenMobileSidebar,
}) => {
  const pathname = usePathname();

  // Generate breadcrumbs from pathname
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = segments.map((seg, idx) => {
    const href = "/" + segments.slice(0, idx + 1).join("/");
    const label = seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " ");
    return { label, href, isLast: idx === segments.length - 1 };
  });

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-rose-500/15 text-rose-300 border-rose-500/30";
      case "admin":
        return "bg-[#00F0C0]/15 text-[#00F0C0] border-[#00F0C0]/30";
      default:
        return "bg-blue-500/15 text-blue-300 border-blue-500/30";
    }
  };

  return (
    <header className="h-16 bg-[#050B14]/80 backdrop-blur-md border-b border-white/[0.08] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          aria-label="Open sidebar"
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05]"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb path */}
        <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-xs">
          <Link href="/admin" className="text-slate-400 hover:text-white transition-colors">
            Admin
          </Link>
          {breadcrumbs.slice(1).map((b) => (
            <React.Fragment key={b.href}>
              <span className="text-slate-600">/</span>
              {b.isLast ? (
                <span className="text-slate-200 font-medium">{b.label}</span>
              ) : (
                <Link href={b.href} className="text-slate-400 hover:text-white transition-colors">
                  {b.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* User Status Badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
          <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
            <User className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-medium text-slate-200 leading-tight">
              {userName}
            </span>
            <span
              className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded border self-start mt-0.5 ${getRoleBadgeStyle(
                userRole
              )}`}
            >
              {userRole.replace("_", " ")}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
