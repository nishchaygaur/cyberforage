"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Plus, Search, Filter, Edit, Trash2, Star, BookOpen, Clock } from "lucide-react";
import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";
import { togglePublishResearchAction, deleteResearchAction, updateResearchAction } from "@/app/admin/actions";
import { useRouter } from "next/navigation";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string | null;
  category: string | null;
  publication_date: string | null;
  reading_time: string | null;
  featured: boolean;
  published: boolean;
  research_tags?: { tag: string }[];
}

export function ResearchListClient({ initialArticles }: { initialArticles: Article[] }) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const categories = Array.from(new Set(articles.map((a) => a.category).filter(Boolean)));

  const filtered = articles.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === "all" || a.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleTogglePublish = (article: Article) => {
    const newPublished = !article.published;
    setArticles((prev) =>
      prev.map((a) => (a.id === article.id ? { ...a, published: newPublished } : a))
    );
    startTransition(async () => {
      try {
        await togglePublishResearchAction(article.id, newPublished);
        router.refresh();
      } catch (err: any) {
        setErrorMessage(err.message || "Failed to update article status.");
        setArticles((prev) =>
          prev.map((a) => (a.id === article.id ? { ...a, published: !newPublished } : a))
        );
      }
    });
  };

  const handleToggleFeatured = (article: Article) => {
    const newFeatured = !article.featured;
    setArticles((prev) =>
      prev.map((a) => (a.id === article.id ? { ...a, featured: newFeatured } : a))
    );
    startTransition(async () => {
      try {
        await updateResearchAction(article.id, { featured: newFeatured });
        router.refresh();
      } catch (err: any) {
        setErrorMessage(err.message || "Failed to update featured flag.");
        setArticles((prev) =>
          prev.map((a) => (a.id === article.id ? { ...a, featured: !newFeatured } : a))
        );
      }
    });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setErrorMessage("");
    try {
      await deleteResearchAction(deleteTarget.id);
      setArticles((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      setDeleteTarget(null);
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to delete article.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          {errorMessage}
        </div>
      )}

      {/* Action bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search research & papers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/50"
            />
          </div>

          {categories.length > 0 && (
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-white/40" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50"
              >
                <option value="all" className="bg-[#081220]">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c!} className="bg-[#081220]">
                    {c}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <Link
          href="/admin/research/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-[#040810] font-semibold text-sm hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Article
        </Link>
      </div>

      {/* Articles Table */}
      <div className="rounded-2xl border border-white/10 bg-[#081220]/60 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/80">
            <thead className="bg-white/[0.02] border-b border-white/10 text-xs font-semibold text-white/60 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Title & Excerpt</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Date / Read Time</th>
                <th className="px-6 py-4 text-center">Featured</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-white/40">
                    No articles found.
                  </td>
                </tr>
              ) : (
                filtered.map((article) => (
                  <tr key={article.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-white flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
                          {article.title}
                          {article.featured && (
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          )}
                        </div>
                        <div className="text-xs text-white/40 truncate max-w-sm mt-0.5">
                          {article.excerpt}
                        </div>
                        {article.research_tags && article.research_tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {article.research_tags.slice(0, 3).map((t, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 rounded text-[10px] bg-white/[0.04] text-purple-300/80 border border-purple-400/10"
                              >
                                {t.tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white/60 text-xs">
                      {article.category || "Research"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-white/70">{article.publication_date || "—"}</div>
                      {article.reading_time && (
                        <div className="text-[11px] text-white/40 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {article.reading_time}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(article)}
                        disabled={isPending}
                        className={`p-1.5 rounded-lg transition-colors ${
                          article.featured
                            ? "text-amber-400 hover:bg-amber-400/10"
                            : "text-white/20 hover:text-white/60 hover:bg-white/5"
                        }`}
                        title={article.featured ? "Unmark featured" : "Mark as featured"}
                      >
                        <Star className={`w-4 h-4 ${article.featured ? "fill-current" : ""}`} />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleTogglePublish(article)}
                        disabled={isPending}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                          article.published
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                            : "bg-white/5 text-white/40 border border-white/10 hover:bg-white/10"
                        }`}
                      >
                        {article.published ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/research/${article.id}`}
                          className="p-2 rounded-lg text-white/60 hover:text-cyan-400 hover:bg-cyan-400/10 transition-colors"
                          title="Edit article"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(article)}
                          className="p-2 rounded-lg text-white/60 hover:text-rose-400 hover:bg-rose-400/10 transition-colors"
                          title="Delete article"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AdminConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Article"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
