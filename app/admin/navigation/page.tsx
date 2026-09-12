import { getAllNavigationItems } from "@/lib/data/navigation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { NavListClient } from "./NavListClient";

export const dynamic = "force-dynamic";

export default async function AdminNavigationPage() {
  let items: any[] = [];
  let errorNotice: string | null = null;

  try {
    items = await getAllNavigationItems();
  } catch (err: any) {
    errorNotice = err.message;
  }

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Navigation & Menus"
        description="Configure header navigation links and footer navigation menu structures."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Navigation" },
        ]}
      />

      {errorNotice && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm">
          <span>{errorNotice}</span>
        </div>
      )}

      <NavListClient initialItems={items} />
    </AdminLayout>
  );
}
