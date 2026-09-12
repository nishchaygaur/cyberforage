import { getAllLabs } from "@/lib/data/labs";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { LabsListClient } from "./LabsListClient";

export const dynamic = "force-dynamic";

export default async function AdminLabsPage() {
  let labs: any[] = [];
  let errorNotice: string | null = null;

  try {
    const result = await getAllLabs();
    labs = result.labs;
  } catch (err: any) {
    errorNotice = err.message || "Could not load labs from database.";
  }

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Cyberforage Labs"
        description="Configure interactive testing environments, reverse engineering labs, and simulation modules."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Labs" },
        ]}
      />

      {errorNotice && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm">
          <span>{errorNotice}</span>
        </div>
      )}

      <LabsListClient initialLabs={labs} />
    </AdminLayout>
  );
}
