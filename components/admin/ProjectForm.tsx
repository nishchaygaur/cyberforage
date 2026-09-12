"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Eye, Sparkles } from "lucide-react";
import { createProjectAction, updateProjectAction } from "@/app/admin/actions";
import { ProjectStatus } from "@/types/database";

interface ProjectFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export function ProjectForm({ initialData, isEdit = false }: ProjectFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const initialTags = initialData?.project_tags
    ? initialData.project_tags.map((t: any) => (typeof t === "string" ? t : t.tag)).join(", ")
    : "";

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    short_description: initialData?.short_description || "",
    full_description: initialData?.full_description || "",
    category: initialData?.category || "Infrastructure",
    status: (initialData?.status as ProjectStatus) || "active",
    featured: initialData?.featured || false,
    published: initialData?.published !== undefined ? initialData.published : true,
    project_url: initialData?.project_url || "",
    github_url: initialData?.github_url || "",
    documentation_url: initialData?.documentation_url || "",
    demo_url: initialData?.demo_url || "",
    image_url: initialData?.image_url || "",
    icon: initialData?.icon || "",
    accent_color: initialData?.accent_color || "cyan",
    year: initialData?.year || new Date().getFullYear().toString(),
    display_order: initialData?.display_order || 0,
    tagsInput: initialTags,
  });

  const handleTitleChange = (val: string) => {
    setFormData((prev) => {
      const updates: any = { title: val };
      if (!isEdit && (!prev.slug || prev.slug === slugify(prev.title))) {
        updates.slug = slugify(val);
      }
      return { ...prev, ...updates };
    });
  };

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.slug.trim() || !formData.short_description.trim()) {
      setErrorMessage("Please fill in the required fields (Title, Slug, Short Description).");
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
      short_description: formData.short_description.trim(),
      full_description: formData.full_description.trim() || null,
      category: formData.category.trim() || null,
      status: formData.status,
      featured: formData.featured,
      published: formData.published,
      project_url: formData.project_url.trim() || null,
      github_url: formData.github_url.trim() || null,
      documentation_url: formData.documentation_url.trim() || null,
      demo_url: formData.demo_url.trim() || null,
      image_url: formData.image_url.trim() || null,
      icon: formData.icon.trim() || null,
      accent_color: formData.accent_color,
      year: formData.year.trim() || null,
      display_order: Number(formData.display_order) || 0,
    };

    try {
      if (isEdit) {
        await updateProjectAction(initialData.id, payload, tagsArray);
      } else {
        await createProjectAction(payload, tagsArray);
      }
      router.push("/admin/projects");
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to save project. Ensure database is connected.");
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

      {/* Top action bar */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
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
            {isSubmitting ? "Saving..." : isEdit ? "Update Project" : "Create Project"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main details (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-[#081220]/60 border border-white/10 backdrop-blur-sm space-y-5">
            <h3 className="text-base font-semibold text-white">General Information</h3>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">
                Project Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Sentinels of the Deep"
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
                  placeholder="sentinels-of-the-deep"
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
                  placeholder="e.g. Infrastructure, Intelligence"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">
                Short Description (Subtitle / Summary) <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={2}
                required
                value={formData.short_description}
                onChange={(e) => setFormData((p) => ({ ...p, short_description: e.target.value }))}
                placeholder="Autonomous subsea sensor array telemetry security mesh..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">
                Full Description (Markdown or extended text)
              </label>
              <textarea
                rows={5}
                value={formData.full_description}
                onChange={(e) => setFormData((p) => ({ ...p, full_description: e.target.value }))}
                placeholder="In-depth project architecture, mission parameters, cryptographic details..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/50"
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
                placeholder="Cryptography, Rust, WASM, Zero-Trust"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/50"
              />
            </div>
          </div>

          {/* Links and URLs */}
          <div className="p-6 rounded-2xl bg-[#081220]/60 border border-white/10 backdrop-blur-sm space-y-4">
            <h3 className="text-base font-semibold text-white">External Links & Resources</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1.5">
                  Project / Live URL
                </label>
                <input
                  type="url"
                  value={formData.project_url}
                  onChange={(e) => setFormData((p) => ({ ...p, project_url: e.target.value }))}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1.5">
                  GitHub Repository URL
                </label>
                <input
                  type="url"
                  value={formData.github_url}
                  onChange={(e) => setFormData((p) => ({ ...p, github_url: e.target.value }))}
                  placeholder="https://github.com/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1.5">
                  Documentation URL
                </label>
                <input
                  type="url"
                  value={formData.documentation_url}
                  onChange={(e) => setFormData((p) => ({ ...p, documentation_url: e.target.value }))}
                  placeholder="https://docs...."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1.5">
                  Demo URL
                </label>
                <input
                  type="url"
                  value={formData.demo_url}
                  onChange={(e) => setFormData((p) => ({ ...p, demo_url: e.target.value }))}
                  placeholder="https://demo...."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar settings (Right col) */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#081220]/60 border border-white/10 backdrop-blur-sm space-y-4">
            <h3 className="text-base font-semibold text-white">Publishing & Attributes</h3>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">
                Development Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value as ProjectStatus }))}
                className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50"
              >
                <option value="planning" className="bg-[#081220]">Planning</option>
                <option value="in_development" className="bg-[#081220]">In Development</option>
                <option value="active" className="bg-[#081220]">Active</option>
                <option value="completed" className="bg-[#081220]">Completed</option>
                <option value="archived" className="bg-[#081220]">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">
                Accent Color Theme
              </label>
              <select
                value={formData.accent_color}
                onChange={(e) => setFormData((p) => ({ ...p, accent_color: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50"
              >
                <option value="cyan" className="bg-[#081220]">Cyan (Default)</option>
                <option value="purple" className="bg-[#081220]">Purple</option>
                <option value="rose" className="bg-[#081220]">Rose</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">
                Release / Launch Year
              </label>
              <input
                type="text"
                value={formData.year}
                onChange={(e) => setFormData((p) => ({ ...p, year: e.target.value }))}
                placeholder="2024"
                className="w-full px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">
                Display Order Priority
              </label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData((p) => ({ ...p, display_order: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-cyan-400/50"
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
                <span className="text-sm text-white/90">Feature on Homepage</span>
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
