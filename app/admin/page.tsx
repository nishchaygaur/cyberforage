import React from "react";
import Link from "next/link";
import {
  FolderGit2,
  BookOpen,
  FlaskConical,
  Cpu,
  CheckCircle2,
  FileEdit,
  Image as ImageIcon,
  Users,
  Plus,
  ArrowRight,
  ShieldAlert,
  Activity,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AdminCard } from "@/components/admin/AdminCard";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  let counts = {
    projects: 0,
    publishedProjects: 0,
    draftProjects: 0,
    articles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    labs: 0,
    technologies: 0,
    media: 0,
    users: 0,
  };

  let recentLogs: Array<{
    id: string;
    action: string;
    entity_type: string;
    entity_name: string | null;
    created_at: string;
    user_id: string | null;
  }> = [];

  let isUnconfigured = false;

  if (!supabase) {
    isUnconfigured = true;
  } else {
    try {
      const [
        { count: projCount },
        { count: pubProjCount },
        { count: artCount },
        { count: pubArtCount },
        { count: labCount },
        { count: techCount },
        { count: mediaCount },
        { count: userCount },
        { data: logs },
      ] = await Promise.all([
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("projects").select("id", { count: "exact", head: true }).eq("published", true),
        supabase.from("research_articles").select("id", { count: "exact", head: true }),
        supabase.from("research_articles").select("id", { count: "exact", head: true }).eq("published", true),
        supabase.from("labs").select("id", { count: "exact", head: true }),
        supabase.from("technologies").select("id", { count: "exact", head: true }),
        supabase.from("media").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(6),
      ]);

      counts = {
        projects: projCount || 0,
        publishedProjects: pubProjCount || 0,
        draftProjects: (projCount || 0) - (pubProjCount || 0),
        articles: artCount || 0,
        publishedArticles: pubArtCount || 0,
        draftArticles: (artCount || 0) - (pubArtCount || 0),
        labs: labCount || 0,
        technologies: techCount || 0,
        media: mediaCount || 0,
        users: userCount || 0,
      };

      recentLogs = (logs as typeof recentLogs) || [];
    } catch {
      isUnconfigured = true;
    }
  }

  const statCards = [
    {
      title: "Projects",
      value: counts.projects,
      subtitle: `${counts.publishedProjects} Published / ${counts.draftProjects} Draft`,
      icon: FolderGit2,
      color: "text-[#00F0C0]",
      href: "/admin/projects",
    },
    {
      title: "Research",
      value: counts.articles,
      subtitle: `${counts.publishedArticles} Published / ${counts.draftArticles} Draft`,
      icon: BookOpen,
      color: "text-purple-400",
      href: "/admin/research",
    },
    {
      title: "Labs",
      value: counts.labs,
      subtitle: "Hands-on Environments",
      icon: FlaskConical,
      color: "text-cyan-400",
      href: "/admin/labs",
    },
    {
      title: "Technologies",
      value: counts.technologies,
      subtitle: "Active Technology Tiles",
      icon: Cpu,
      color: "text-emerald-400",
      href: "/admin/technologies",
    },
    {
      title: "Published Total",
      value: counts.publishedProjects + counts.publishedArticles,
      subtitle: "Live Content Assets",
      icon: CheckCircle2,
      color: "text-teal-400",
      href: "/admin/projects",
    },
    {
      title: "Draft Total",
      value: counts.draftProjects + counts.draftArticles,
      subtitle: "In-Progress Items",
      icon: FileEdit,
      color: "text-amber-400",
      href: "/admin/projects",
    },
    {
      title: "Media Library",
      value: counts.media,
      subtitle: "Stored Storage Assets",
      icon: ImageIcon,
      color: "text-sky-400",
      href: "/admin/media",
    },
    {
      title: "Users",
      value: counts.users,
      subtitle: "Console Operators",
      icon: Users,
      color: "text-indigo-400",
      href: "/admin/users",
    },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Command Center Overview"
        description="Real-time telemetry, operational assets, and system activity across the Cyberforage ecosystem."
        action={
          <div className="flex items-center gap-2">
            <Link
              href="/admin/projects/new"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#00F0C0] hover:bg-[#00E5BE] text-[#04131E] font-semibold text-xs transition-colors shadow-[0_0_15px_rgba(0,240,192,0.25)]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Project</span>
            </Link>
          </div>
        }
      />

      {isUnconfigured && (
        <div className="p-5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 flex-shrink-0 text-amber-400" />
          <div>
            <span className="font-semibold block mb-1">
              Supabase Project Connection Notice
            </span>
            <span>
              The database environment variables (NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY) are unconfigured. The public site continues serving static default assets with 100% fidelity. Configure your Supabase credentials to activate live database telemetry and management.
            </span>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.title} href={card.href} className="block group">
              <AdminCard className="group-hover:border-[#00F0C0]/30 transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium">
                      {card.title}
                    </span>
                    <div className="text-3xl font-extrabold text-white mt-1.5 tracking-tight font-mono">
                      {card.value}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2">{card.subtitle}</p>
                  </div>
                  <div className={`p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] ${card.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              </AdminCard>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions & Recent Activity Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions (1 col) */}
        <AdminCard title="Quick Actions" description="Direct creation shortcuts">
          <div className="space-y-2">
            {[
              { label: "Create New Project", href: "/admin/projects/new", icon: Plus },
              { label: "Draft Research Article", href: "/admin/research/new", icon: BookOpen },
              { label: "Add Security Lab", href: "/admin/labs/new", icon: FlaskConical },
              { label: "Upload Media File", href: "/admin/media", icon: ImageIcon },
              { label: "Update Contact Channel", href: "/admin/contact", icon: ArrowRight },
            ].map((action) => {
              const ActionIcon = action.icon;
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-black/30 border border-white/[0.05] hover:border-[#00F0C0]/40 hover:bg-[#00F0C0]/5 transition-all text-xs text-slate-200 group"
                >
                  <span className="font-medium group-hover:text-white">{action.label}</span>
                  <ActionIcon className="w-4 h-4 text-slate-500 group-hover:text-[#00F0C0] transition-colors" />
                </Link>
              );
            })}
          </div>
        </AdminCard>

        {/* Recent Audit Activity (2 cols) */}
        <div className="lg:col-span-2">
          <AdminCard
            title="Recent Activity"
            description="Immutable audit log of administrative mutations"
            headerAction={
              <Link
                href="/admin/activity"
                className="text-xs text-[#00F0C0] hover:underline inline-flex items-center gap-1 font-medium"
              >
                <span>View Full Audit Log</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            }
          >
            {recentLogs.length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                <Activity className="w-8 h-8 mx-auto text-slate-600 mb-2 stroke-[1.5]" />
                <p className="text-xs">No recent audit log entries recorded yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {recentLogs.map((log) => (
                  <div
                    key={log.id}
                    className="py-3 flex items-center justify-between gap-4 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <AdminStatusBadge status={log.action} />
                      <div>
                        <span className="text-slate-200 font-medium">
                          {log.entity_name || log.entity_type}
                        </span>
                        <span className="text-slate-500 text-[11px] ml-2">
                          ({log.entity_type})
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">
                      {new Date(log.created_at).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </AdminCard>
        </div>
      </div>
    </div>
  );
}
