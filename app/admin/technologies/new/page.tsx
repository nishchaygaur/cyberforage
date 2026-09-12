import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { TechForm } from "@/components/admin/TechForm";

export default function NewTechPage() {
  return (
    <AdminLayout>
      <AdminPageHeader
        title="New Technology"
        description="Add a new framework, tool, or cryptographic library to the Cyberforage stack."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Technologies", href: "/admin/technologies" },
          { label: "New Technology" },
        ]}
      />

      <TechForm />
    </AdminLayout>
  );
}
