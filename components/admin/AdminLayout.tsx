"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { createClient } from "@/lib/supabase/client";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [userName, setUserName] = useState<string>("Admin");
  const [userRole, setUserRole] = useState<string>("editor");
  const router = useRouter();
  const pathname = usePathname();

  // Auth pages don't use the standard admin dashboard layout
  const isAuthPage = [
    "/admin/login",
    "/admin/forgot-password",
    "/admin/reset-password",
  ].some((route) => pathname.startsWith(route));

  useEffect(() => {
    if (isAuthPage) return;

    const supabase = createClient();
    if (!supabase) return;

    async function loadUserData() {
      if (!supabase) return;
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, role")
          .eq("id", user.id)
          .single();

        if (profile) {
          setUserName(profile.full_name || user.email?.split("@")[0] || "Admin");
          setUserRole(profile.role);
        }
      }
    }

    loadUserData();
  }, [isAuthPage]);

  const handleLogout = async () => {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push("/admin/login");
  };

  if (isAuthPage) {
    return <div className="min-h-screen bg-[#040812] text-white">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#040812] text-slate-100 flex">
      {/* Sidebar */}
      <AdminSidebar
        userRole={userRole}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <AdminHeader
          userName={userName}
          userRole={userRole}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
