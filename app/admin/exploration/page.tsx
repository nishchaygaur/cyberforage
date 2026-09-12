import { getAllExplorationItems } from "@/lib/data/exploration";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ExplorationListClient } from "./ExplorationListClient";

export const dynamic = "force-dynamic";

export default async function AdminExplorationPage() {
  let items: any[] = [];
  let errorNotice: string | null = null;

  try {
    const result = await getAllExplorationItems();
    items = result.items;
  } catch (err: any) {
    errorNotice = err.message || "Could not load exploration items from database.";
  }

  return (
    <AdminLayout>
      <AdminPageHeader
        title="What We Explore"
        description="Configure focus areas, research horizons, and tactical themes on the homepage."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Exploration" },
        ]}
      />

      {errorNotice && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm">
          <span>{errorNotice}</span>
        </div>
      )}

      <ExplorationListClient initialItems={items} />
    </AdminLayout>
  );
}
