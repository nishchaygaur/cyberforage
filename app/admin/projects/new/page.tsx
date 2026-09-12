import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProjectForm } from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <AdminLayout>
      <AdminPageHeader
        title="New Project"
        description="Create and configure a new project in the Cyberforage ecosystem."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Projects", href: "/admin/projects" },
          { label: "New Project" },
        ]}
      />

      <ProjectForm />
    </AdminLayout>
  );
}
