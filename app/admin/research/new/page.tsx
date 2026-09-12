import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ResearchForm } from "@/components/admin/ResearchForm";

export default function NewResearchPage() {
  return (
    <AdminLayout>
      <AdminPageHeader
        title="New Research Article"
        description="Publish a new cybersecurity paper, advisory, or technical analysis report."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Research", href: "/admin/research" },
          { label: "New Article" },
        ]}
      />

      <ResearchForm />
    </AdminLayout>
  );
}
