"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { createTechAction, updateTechAction } from "@/app/admin/actions";

interface TechFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export function TechForm({ initialData, isEdit = false }: TechFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    category: initialData?.category || "Cryptographic Primitives",
    description: initialData?.description || "",
    icon: initialData?.icon || "",
    website_url: initialData?.website_url || "",
    github_url: initialData?.github_url || "",
    display_order: initialData?.display_order || 0,
    enabled: initialData?.enabled !== undefined ? initialData.enabled : true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.category.trim()) {
      setErrorMessage("Please enter both Name and Category.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const payload = {
      name: formData.name.trim(),
      category: formData.category.trim(),
      description: formData.description.trim() || null,
      icon: formData.icon.trim() || null,
      website_url: formData.website_url.trim() || null,
      github_url: formData.github_url.trim() || null,
      display_order: Number(formData.display_order) || 0,
      enabled: formData.enabled,
    };

    try {
      const res = isEdit
        ? await updateTechAction(initialData.id, payload)
        : await createTechAction(payload);

      if (!res.success) {
        setErrorMessage(res.error || "Failed to save technology.");
        setIsSubmitting(false);
        return;
      }

      router.push("/admin/technologies");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to save technology.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          {errorMessage}
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        <Link
          href="/admin/technologies"
          className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Technologies
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-[#040810] font-semibold text-sm hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSubmitting ? "Saving..." : isEdit ? "Update Technology" : "Create Technology"}
        </button>
      </div>

      <div className="p-6 rounded-2xl bg-[#081220]/60 border border-white/10 backdrop-blur-sm space-y-5">
        <div>
          <label className="block text-xs font-medium text-white/70 mb-1.5">
            Technology / Tool Name <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
            placeholder="e.g. Post-Quantum Cryptography"
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/50"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">
              Category <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.category}
              onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
              placeholder="e.g. Cryptographic Primitives, Offensive Tooling"
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">
              Icon Identifier
            </label>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) => setFormData((p) => ({ ...p, icon: e.target.value }))}
              placeholder="e.g. cpu, terminal, lock"
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-white/70 mb-1.5">
            Description
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
            placeholder="Technical details of algorithms, libraries, or protocols used..."
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/50"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">
              Website URL
            </label>
            <input
              type="url"
              value={formData.website_url}
              onChange={(e) => setFormData((p) => ({ ...p, website_url: e.target.value }))}
              placeholder="https://..."
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">
              GitHub URL
            </label>
            <input
              type="url"
              value={formData.github_url}
              onChange={(e) => setFormData((p) => ({ ...p, github_url: e.target.value }))}
              placeholder="https://github.com/..."
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">
              Display Order
            </label>
            <input
              type="number"
              value={formData.display_order}
              onChange={(e) => setFormData((p) => ({ ...p, display_order: parseInt(e.target.value) || 0 }))}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-cyan-400/50"
            />
          </div>
        </div>

        <div className="pt-2 border-t border-white/10">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.enabled}
              onChange={(e) => setFormData((p) => ({ ...p, enabled: e.target.checked }))}
              className="rounded border-white/20 bg-white/5 text-cyan-400 focus:ring-0 focus:ring-offset-0"
            />
            <span className="text-sm text-white/90">Enabled (Visible in Stack)</span>
          </label>
        </div>
      </div>
    </form>
  );
}
