import { getAllArticles } from "@/lib/data/research";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ResearchListClient } from "./ResearchListClient";

export const dynamic = "force-dynamic";

export default async function AdminResearchPage() {
  let articles: any[] = [];
  let errorNotice: string | null = null;

  try {
    const result = await getAllArticles();
    articles = result.articles;
  } catch (err: any) {
    errorNotice = err.message || "Could not load research articles from database.";
  }

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Research & Articles"
        description="Manage intelligence reports, threat analysis papers, and cryptographic publications."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Research" },
        ]}
      />

      {errorNotice && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm">
          <span>{errorNotice}</span>
        </div>
      )}

      <ResearchListClient initialArticles={articles} />
    </AdminLayout>
  );
}
