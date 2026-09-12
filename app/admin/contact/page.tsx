import { getContactInfo } from "@/lib/data/contact";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ContactInfoClient } from "./ContactInfoClient";
import Link from "next/link";
import { Inbox } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminContactPage() {
  let info = null;
  let errorNotice = null;

  try {
    info = await getContactInfo();
  } catch (err: any) {
    errorNotice = err.message;
  }

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <AdminPageHeader
          title="Contact & Advisory Coordinates"
          description="Configure public contact email, location, response SLA, and PGP encryption keys."
          breadcrumbs={[
            { label: "Admin", href: "/admin" },
            { label: "Contact Settings" },
          ]}
        />

        <Link
          href="/admin/contact-submissions"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white/90 text-sm hover:border-cyan-400/40 hover:text-white transition-all shrink-0"
        >
          <Inbox className="w-4 h-4 text-cyan-400" />
          View Incoming Submissions
        </Link>
      </div>

      {errorNotice && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm">
          <span>{errorNotice}</span>
        </div>
      )}

      <ContactInfoClient initialInfo={info} />
    </AdminLayout>
  );
}
