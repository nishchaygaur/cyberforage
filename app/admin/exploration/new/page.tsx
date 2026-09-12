import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ExplorationForm } from "@/components/admin/ExplorationForm";

export default function NewExplorationPage() {
  return (
    <AdminLayout>
      <AdminPageHeader
        title="New Exploration Area"
        description="Add a research focus area to the 'What We Explore' section."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Exploration", href: "/admin/exploration" },
          { label: "New Area" },
        ]}
      />

      <ExplorationForm />
    </AdminLayout>
  );
}
