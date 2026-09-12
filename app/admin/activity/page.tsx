import { getAuditLogs } from "@/lib/data/audit";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ActivityClient } from "./ActivityClient";

export const dynamic = "force-dynamic";

export default async function AdminActivityPage() {
  let logs: any[] = [];
  let errorNotice: string | null = null;

  try {
    const result = await getAuditLogs({ limit: 100 });
    logs = result.logs;
  } catch (err: any) {
    errorNotice = err.message;
  }

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Audit Logs & Activity Trail"
        description="Immutable record of administrative operations, content mutations, and security events."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Activity" },
        ]}
      />

      {errorNotice && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm">
          <span>{errorNotice}</span>
        </div>
      )}

      <ActivityClient initialLogs={logs} />
    </AdminLayout>
  );
}
