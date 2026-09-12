import { getArticleById } from "@/lib/data/research";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ResearchForm } from "@/components/admin/ResearchForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: { id: string };
}

export default async function EditResearchPage({ params }: Props) {
  let article = null;
  let errorMsg = null;

  try {
    article = await getArticleById(params.id);
  } catch (err: any) {
    errorMsg = err.message || "Could not load article.";
  }

  if (!article) {
    return (
      <AdminLayout>
        <div className="p-8 max-w-xl mx-auto text-center space-y-4">
          <h2 className="text-xl font-bold text-white">Article Not Found</h2>
          <p className="text-sm text-white/50">{errorMsg || "The requested article could not be loaded."}</p>
          <Link
            href="/admin/research"
            className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Research
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminPageHeader
        title={`Edit: ${article.title}`}
        description="Update article contents, metadata, publication status, and tags."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Research", href: "/admin/research" },
          { label: article.title },
        ]}
      />

      <ResearchForm initialData={article} isEdit />
    </AdminLayout>
  );
}
