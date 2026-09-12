import { getProjectById } from "@/lib/data/projects";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProjectForm } from "@/components/admin/ProjectForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: { id: string };
}

export default async function EditProjectPage({ params }: Props) {
  let project = null;
  let errorMsg = null;

  try {
    project = await getProjectById(params.id);
  } catch (err: any) {
    errorMsg = err.message || "Could not load project.";
  }

  if (!project) {
    return (
      <AdminLayout>
        <div className="p-8 max-w-xl mx-auto text-center space-y-4">
          <h2 className="text-xl font-bold text-white">Project Not Found</h2>
          <p className="text-sm text-white/50">{errorMsg || "The requested project could not be loaded."}</p>
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminPageHeader
        title={`Edit: ${project.title}`}
        description="Update project details, release tags, links, and status."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Projects", href: "/admin/projects" },
          { label: project.title },
        ]}
      />

      <ProjectForm initialData={project} isEdit />
    </AdminLayout>
  );
}
