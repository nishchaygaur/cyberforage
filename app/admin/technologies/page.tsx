import { getAllTechnologies } from "@/lib/data/technologies";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { TechListClient } from "./TechListClient";

export const dynamic = "force-dynamic";

export default async function AdminTechnologiesPage() {
  let techs: any[] = [];
  let errorNotice: string | null = null;

  try {
    const result = await getAllTechnologies();
    techs = result.technologies;
  } catch (err: any) {
    errorNotice = err.message || "Could not load technologies from database.";
  }

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Technologies"
        description="Manage security frameworks, cryptographic primitives, and core stack components."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Technologies" },
        ]}
      />

      {errorNotice && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm">
          <span>{errorNotice}</span>
        </div>
      )}

      <TechListClient initialTechs={techs} />
    </AdminLayout>
  );
}
