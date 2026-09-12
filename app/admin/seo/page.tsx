import { getSeoSettings } from "@/lib/data/seo";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SeoClient } from "./SeoClient";

export const dynamic = "force-dynamic";

export default async function AdminSeoPage() {
  let settings = null;
  let errorNotice = null;

  try {
    settings = await getSeoSettings();
  } catch (err: any) {
    errorNotice = err.message;
  }

  return (
    <AdminLayout>
      <AdminPageHeader
        title="SEO & OpenGraph Configuration"
        description="Optimize titles, search engine metadata, OpenGraph cards, and Twitter cards for social distribution."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "SEO Settings" },
        ]}
      />

      {errorNotice && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm">
          <span>{errorNotice}</span>
        </div>
      )}

      <SeoClient initialSettings={settings} />
    </AdminLayout>
  );
}
