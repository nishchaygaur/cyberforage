import { getContactSubmissions } from "@/lib/data/contact";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SubmissionsClient } from "./SubmissionsClient";

export const dynamic = "force-dynamic";

export default async function AdminContactSubmissionsPage() {
  let submissions: any[] = [];
  let errorNotice: string | null = null;

  try {
    const result = await getContactSubmissions();
    submissions = result.submissions;
  } catch (err: any) {
    errorNotice = err.message || "Could not load contact submissions.";
  }

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Incoming Inquiries & Submissions"
        description="Review, triage, reply to, and audit contact and advisory requests submitted through the portal."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Contact Settings", href: "/admin/contact" },
          { label: "Submissions" },
        ]}
      />

      {errorNotice && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm">
          <span>{errorNotice}</span>
        </div>
      )}

      <SubmissionsClient initialSubmissions={submissions} />
    </AdminLayout>
  );
}
