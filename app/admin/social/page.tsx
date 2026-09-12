import { getAllSocialLinks } from "@/lib/data/social";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SocialListClient } from "./SocialListClient";

export const dynamic = "force-dynamic";

export default async function AdminSocialPage() {
  let links: any[] = [];
  let errorNotice: string | null = null;

  try {
    links = await getAllSocialLinks();
  } catch (err: any) {
    errorNotice = err.message;
  }

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Social & Sovereign Links"
        description="Manage external links in navbar and footer (GitHub, X/Twitter, Discord, Telegram, etc.)."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Social Links" },
        ]}
      />

      {errorNotice && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm">
          <span>{errorNotice}</span>
        </div>
      )}

      <SocialListClient initialLinks={links} />
    </AdminLayout>
  );
}
