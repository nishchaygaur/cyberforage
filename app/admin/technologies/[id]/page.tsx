import { getTechnologyById } from "@/lib/data/technologies";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { TechForm } from "@/components/admin/TechForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: { id: string };
}

export default async function EditTechPage({ params }: Props) {
  let tech = null;
  let errorMsg = null;

  try {
    tech = await getTechnologyById(params.id);
  } catch (err: any) {
    errorMsg = err.message || "Could not load technology.";
  }

  if (!tech) {
    return (
      <AdminLayout>
        <div className="p-8 max-w-xl mx-auto text-center space-y-4">
          <h2 className="text-xl font-bold text-white">Technology Not Found</h2>
          <p className="text-sm text-white/50">{errorMsg || "The requested item could not be loaded."}</p>
          <Link
            href="/admin/technologies"
            className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Technologies
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminPageHeader
        title={`Edit: ${tech.name}`}
        description="Update technology metadata, category, and display order."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Technologies", href: "/admin/technologies" },
          { label: tech.name },
        ]}
      />

      <TechForm initialData={tech} isEdit />
    </AdminLayout>
  );
}
