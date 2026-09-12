"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { createResearchAction, updateResearchAction } from "@/app/admin/actions";

interface ResearchFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export function ResearchForm({ initialData, isEdit = false }: ResearchFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const initialTags = initialData?.research_tags
    ? initialData.research_tags.map((t: any) => (typeof t === "string" ? t : t.tag)).join(", ")
    : "";

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    author: initialData?.author || "Cyberforage Intelligence",
    category: initialData?.category || "Threat Intelligence",
    publication_date: initialData?.publication_date || new Date().toISOString().split("T")[0],
    reading_time: initialData?.reading_time || "5 min read",
    cover_image_url: initialData?.cover_image_url || "",
    external_url: initialData?.external_url || "",
    featured: initialData?.featured || false,
    published: initialData?.published !== undefined ? initialData.published : true,
    tagsInput: initialTags,
  });

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (val: string) => {
    setFormData((prev) => {
      const updates: any = { title: val };
      if (!isEdit && (!prev.slug || prev.slug === slugify(prev.title))) {
        updates.slug = slugify(val);
      }
      return { ...prev, ...updates };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.slug.trim() || !formData.excerpt.trim()) {
      setErrorMessage("Please fill in Title, Slug, and Excerpt.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const tagsArray = formData.tagsInput
      .split(",")
      .map((t: string) => t.trim())
      .filter(Boolean);

    const payload = {
      title: formData.title.trim(),
      slug: formData.slug.trim(),
      excerpt: formData.excerpt.trim(),
      content: formData.content.trim() || null,
      author: formData.author.trim() || null,
      category: formData.category.trim() || null,
      publication_date: formData.publication_date.trim() || null,
      reading_time: formData.reading_time.trim() || null,
      cover_image_url: formData.cover_image_url.trim() || null,
      external_url: formData.external_url.trim() || null,
      featured: formData.featured,
      published: formData.published,
    };

    try {
      const res = isEdit
        ? await updateResearchAction(initialData.id, payload, tagsArray)
        : await createResearchAction(payload, tagsArray);

      if (!res.success) {
        setErrorMessage(res.error || "Failed to save article.");
        setIsSubmitting(false);
        return;
      }

      router.push("/admin/research");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to save article.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          {errorMessage}
        </div>
      )}

      {/* Action Header */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/admin/research"
          className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Research
        </Link>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setFormData((p) => ({ ...p, published: !p.published }))}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
              formData.published
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-white/5 text-white/50 border-white/10"
            }`}
          >
            {formData.published ? "Status: Published" : "Status: Draft"}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-[#040810] font-semibold text-sm hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? "Saving..." : isEdit ? "Update Article" : "Create Article"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-[#081220]/60 border border-white/10 backdrop-blur-sm space-y-5">
            <h3 className="text-base font-semibold text-white">Article Content</h3>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">
                Article Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Memory Safety Vulnerabilities in Embedded C2 Nodes"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1.5">
                  URL Slug <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))}
                  placeholder="memory-safety-vulnerabilities"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-sm font-mono focus:outline-none focus:border-cyan-400/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1.5">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                  placeholder="Threat Intelligence, Cryptography, Zero-Day"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">
                Executive Summary / Excerpt <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={formData.excerpt}
                onChange={(e) => setFormData((p) => ({ ...p, excerpt: e.target.value }))}
                placeholder="Brief abstract describing key vulnerabilities, exploit vectors, and mitigations..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">
                Full Paper Content (Markdown supported)
              </label>
              <textarea
                rows={10}
                value={formData.content}
                onChange={(e) => setFormData((p) => ({ ...p, content: e.target.value }))}
                placeholder="# Introduction&#10;&#10;Technical findings and deep methodology breakdown..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-sm font-mono focus:outline-none focus:border-cyan-400/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={formData.tagsInput}
                onChange={(e) => setFormData((p) => ({ ...p, tagsInput: e.target.value }))}
                placeholder="Exploitation, Rust, LLVM, Firmware"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/50"
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#081220]/60 border border-white/10 backdrop-blur-sm space-y-4">
            <h3 className="text-base font-semibold text-white">Metadata & Links</h3>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">
                Author
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData((p) => ({ ...p, author: e.target.value }))}
                placeholder="Cyberforage Intelligence"
                className="w-full px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">
                Publication Date
              </label>
              <input
                type="text"
                value={formData.publication_date}
                onChange={(e) => setFormData((p) => ({ ...p, publication_date: e.target.value }))}
                placeholder="e.g. March 2025 or 2025-03-15"
                className="w-full px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">
                Estimated Reading Time
              </label>
              <input
                type="text"
                value={formData.reading_time}
                onChange={(e) => setFormData((p) => ({ ...p, reading_time: e.target.value }))}
                placeholder="6 min read"
                className="w-full px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">
                External Publication URL (if published on arXiv/external)
              </label>
              <input
                type="url"
                value={formData.external_url}
                onChange={(e) => setFormData((p) => ({ ...p, external_url: e.target.value }))}
                placeholder="https://..."
                className="w-full px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50"
              />
            </div>

            <div className="pt-2 border-t border-white/10 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData((p) => ({ ...p, featured: e.target.checked }))}
                  className="rounded border-white/20 bg-white/5 text-cyan-400 focus:ring-0 focus:ring-offset-0"
                />
                <span className="text-sm text-white/90">Feature on Research Section</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData((p) => ({ ...p, published: e.target.checked }))}
                  className="rounded border-white/20 bg-white/5 text-cyan-400 focus:ring-0 focus:ring-offset-0"
                />
                <span className="text-sm text-white/90">Publish to Public Site</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
