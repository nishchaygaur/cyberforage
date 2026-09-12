"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { createExplorationAction, updateExplorationAction } from "@/app/admin/actions";

interface ExplorationFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export function ExplorationForm({ initialData, isEdit = false }: ExplorationFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    icon: initialData?.icon || "compass",
    accent_color: initialData?.accent_color || "cyan",
    display_order: initialData?.display_order || 0,
    enabled: initialData?.enabled !== undefined ? initialData.enabled : true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      setErrorMessage("Please enter both Title and Description.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      icon: formData.icon.trim() || null,
      accent_color: formData.accent_color,
      display_order: Number(formData.display_order) || 0,
      enabled: formData.enabled,
    };

    try {
      const res = isEdit
        ? await updateExplorationAction(initialData.id, payload)
        : await createExplorationAction(payload);

      if (!res.success) {
        setErrorMessage(res.error || "Failed to save exploration area.");
        setIsSubmitting(false);
        return;
      }

      router.push("/admin/exploration");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to save exploration area.");
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
          href="/admin/exploration"
          className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Exploration
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-[#040810] font-semibold text-sm hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSubmitting ? "Saving..." : isEdit ? "Update Area" : "Create Area"}
        </button>
      </div>

      <div className="p-6 rounded-2xl bg-[#081220]/60 border border-white/10 backdrop-blur-sm space-y-5">
        <div>
          <label className="block text-xs font-medium text-white/70 mb-1.5">
            Exploration Area Title <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
            placeholder="e.g. Distributed Consensus Under Adversarial Conditions"
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/50"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-white/70 mb-1.5">
            Description <span className="text-rose-400">*</span>
          </label>
          <textarea
            rows={4}
            required
            value={formData.description}
            onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
            placeholder="Key research questions, investigation objectives, and scope..."
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/50"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">
              Accent Color
            </label>
            <select
              value={formData.accent_color}
              onChange={(e) => setFormData((p) => ({ ...p, accent_color: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50"
            >
              <option value="cyan" className="bg-[#081220]">Cyan</option>
              <option value="purple" className="bg-[#081220]">Purple</option>
              <option value="rose" className="bg-[#081220]">Rose</option>
            </select>
          </div>

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
            <span className="text-sm text-white/90">Enabled (Visible in Explore Section)</span>
          </label>
        </div>
      </div>
    </form>
  );
}
