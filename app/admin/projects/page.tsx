import { getAllProjects } from "@/lib/data/projects";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProjectListClient } from "./ProjectListClient";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  let projects: any[] = [];
  let errorNotice: string | null = null;

  try {
    const result = await getAllProjects();
    projects = result.projects;
  } catch (err: any) {
    errorNotice = err.message || "Could not connect to database.";
  }

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Projects"
        description="Manage your cybersecurity portfolio projects, featured flags, tags, and visibility."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Projects" },
        ]}
      />

      {errorNotice && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm flex items-center justify-between">
          <span>{errorNotice} Ensure Supabase environment variables are configured.</span>
        </div>
      )}

      <ProjectListClient initialProjects={projects} />
    </AdminLayout>
  );
}
