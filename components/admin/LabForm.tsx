"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { createLabAction, updateLabAction } from "@/app/admin/actions";
import { LabStatus } from "@/types/database";

interface LabFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export function LabForm({ initialData, isEdit = false }: LabFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    category: initialData?.category || "Security",
    description: initialData?.description || "",
    icon: initialData?.icon || "shield",
    status: (initialData?.status as LabStatus) || "available",
    accent_color: initialData?.accent_color || "cyan",
    display_order: initialData?.display_order || 0,
    published: initialData?.published !== undefined ? initialData.published : true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMessage("Please enter a Lab Name.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const payload = {
      name: formData.name.trim(),
      category: formData.category.trim() || null,
      description: formData.description.trim() || null,
      icon: formData.icon,
      status: formData.status,
      accent_color: formData.accent_color,
      display_order: Number(formData.display_order) || 0,
      published: formData.published,
    };

    try {
      if (isEdit) {
        await updateLabAction(initialData.id, payload);
      } else {
        await createLabAction(payload);
      }
      router.push("/admin/labs");
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to save lab.");
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
          href="/admin/labs"
          className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Labs
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-[#040810] font-semibold text-sm hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSubmitting ? "Saving..." : isEdit ? "Update Lab" : "Create Lab"}
        </button>
      </div>

      <div className="p-6 rounded-2xl bg-[#081220]/60 border border-white/10 backdrop-blur-sm space-y-5">
        <div>
          <label className="block text-xs font-medium text-white/70 mb-1.5">
            Lab Name <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
            placeholder="e.g. Reverse Engineering Sandbox"
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/50"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">
              Category
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
              placeholder="e.g. Firmware Security, Malware Analysis"
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">
              Icon Type
            </label>
            <select
              value={formData.icon}
              onChange={(e) => setFormData((p) => ({ ...p, icon: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50"
            >
              <option value="shield" className="bg-[#081220]">Shield</option>
              <option value="cube" className="bg-[#081220]">Cube</option>
              <option value="search" className="bg-[#081220]">Search</option>
              <option value="bug" className="bg-[#081220]">Bug</option>
              <option value="network" className="bg-[#081220]">Network</option>
            </select>
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
            placeholder="Detailed description of simulation parameters or environment capabilities..."
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/50"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value as LabStatus }))}
              className="w-full px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50"
            >
              <option value="available" className="bg-[#081220]">Available</option>
              <option value="coming_soon" className="bg-[#081220]">Coming Soon</option>
              <option value="in_development" className="bg-[#081220]">In Development</option>
              <option value="archived" className="bg-[#081220]">Archived</option>
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
              checked={formData.published}
              onChange={(e) => setFormData((p) => ({ ...p, published: e.target.checked }))}
              className="rounded border-white/20 bg-white/5 text-cyan-400 focus:ring-0 focus:ring-offset-0"
            />
            <span className="text-sm text-white/90">Publish to Public Site</span>
          </label>
        </div>
      </div>
    </form>
  );
}
