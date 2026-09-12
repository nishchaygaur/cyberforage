import { getSiteSettings } from "@/lib/data/site";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SettingsClient } from "./SettingsClient";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  let settings = null;
  let errorNotice = null;

  try {
    settings = await getSiteSettings();
  } catch (err: any) {
    errorNotice = err.message;
  }

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Site Settings"
        description="Configure brand name, public tagline, announcement banner, and maintenance mode."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Settings" },
        ]}
      />

      {errorNotice && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm">
          <span>{errorNotice}</span>
        </div>
      )}

      <SettingsClient initialSettings={settings} />
    </AdminLayout>
  );
}
