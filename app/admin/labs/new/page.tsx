import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { LabForm } from "@/components/admin/LabForm";

export default function NewLabPage() {
  return (
    <AdminLayout>
      <AdminPageHeader
        title="New Lab"
        description="Add a new testing lab or simulation environment to Cyberforage."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Labs", href: "/admin/labs" },
          { label: "New Lab" },
        ]}
      />

      <LabForm />
    </AdminLayout>
  );
}
