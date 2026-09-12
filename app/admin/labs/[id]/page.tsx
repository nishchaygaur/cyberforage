import { getLabById } from "@/lib/data/labs";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { LabForm } from "@/components/admin/LabForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: { id: string };
}

export default async function EditLabPage({ params }: Props) {
  let lab = null;
  let errorMsg = null;

  try {
    lab = await getLabById(params.id);
  } catch (err: any) {
    errorMsg = err.message || "Could not load lab.";
  }

  if (!lab) {
    return (
      <AdminLayout>
        <div className="p-8 max-w-xl mx-auto text-center space-y-4">
          <h2 className="text-xl font-bold text-white">Lab Not Found</h2>
          <p className="text-sm text-white/50">{errorMsg || "The requested lab could not be loaded."}</p>
          <Link
            href="/admin/labs"
            className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Labs
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminPageHeader
        title={`Edit: ${lab.name}`}
        description="Update lab properties, category, icon, and status."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Labs", href: "/admin/labs" },
          { label: lab.name },
        ]}
      />

      <LabForm initialData={lab} isEdit />
    </AdminLayout>
  );
}
