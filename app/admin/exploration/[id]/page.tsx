import { getExplorationItemById } from "@/lib/data/exploration";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ExplorationForm } from "@/components/admin/ExplorationForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: { id: string };
}

export default async function EditExplorationPage({ params }: Props) {
  let item = null;
  let errorMsg = null;

  try {
    item = await getExplorationItemById(params.id);
  } catch (err: any) {
    errorMsg = err.message || "Could not load exploration item.";
  }

  if (!item) {
    return (
      <AdminLayout>
        <div className="p-8 max-w-xl mx-auto text-center space-y-4">
          <h2 className="text-xl font-bold text-white">Item Not Found</h2>
          <p className="text-sm text-white/50">{errorMsg || "The requested item could not be loaded."}</p>
          <Link
            href="/admin/exploration"
            className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Exploration
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminPageHeader
        title={`Edit: ${item.title}`}
        description="Update exploration area description, accent, and visibility."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Exploration", href: "/admin/exploration" },
          { label: item.title },
        ]}
      />

      <ExplorationForm initialData={item} isEdit />
    </AdminLayout>
  );
}
