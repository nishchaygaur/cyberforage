import { getAppearanceSettings } from "@/lib/data/site";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AppearanceClient } from "./AppearanceClient";

export const dynamic = "force-dynamic";

export default async function AdminAppearancePage() {
  let settings = null;
  let errorNotice = null;

  try {
    settings = await getAppearanceSettings();
  } catch (err: any) {
    errorNotice = err.message;
  }

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Appearance & Design Tokens"
        description="Fine-tune colors, Canvas globe lighting, card surfaces, and UI accent styling."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Appearance" },
        ]}
      />

      {errorNotice && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm">
          <span>{errorNotice}</span>
        </div>
      )}

      <AppearanceClient initialSettings={settings} />
    </AdminLayout>
  );
}
