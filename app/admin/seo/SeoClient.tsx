"use client";

import { useState } from "react";
import { Save, Search, Share2, Twitter } from "lucide-react";
import { updateSeoAction } from "@/app/admin/actions";
import { useRouter } from "next/navigation";

export function SeoClient({ initialSettings }: { initialSettings: any }) {
  const initialKeywords = Array.isArray(initialSettings?.keywords)
    ? initialSettings.keywords.join(", ")
    : "cybersecurity, autonomous security, sovereign infrastructure, cryptography";

  const [formData, setFormData] = useState({
    meta_title:
      initialSettings?.meta_title || "CYBERFORAGE | Advanced Autonomous Security Systems",
    meta_description:
      initialSettings?.meta_description ||
      "Autonomous cybersecurity research, sovereign infrastructure, and distributed defense architectures.",
    keywordsInput: initialKeywords,
    og_title:
      initialSettings?.og_title || "CYBERFORAGE | Advanced Autonomous Security Systems",
    og_description:
      initialSettings?.og_description ||
      "Autonomous cybersecurity research, sovereign infrastructure, and distributed defense architectures.",
    og_image_url: initialSettings?.og_image_url || "/og-image.png",
    twitter_handle: initialSettings?.twitter_handle || "@cyberforage",
    canonical_url: initialSettings?.canonical_url || "https://cyberforage.space",
    robots_indexing:
      initialSettings?.robots_indexing !== undefined ? initialSettings.robots_indexing : true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    const keywordsArray = formData.keywordsInput
      .split(",")
      .map((k: string) => k.trim())
      .filter(Boolean);

    const payload = {
      meta_title: formData.meta_title.trim(),
      meta_description: formData.meta_description.trim(),
      keywords: keywordsArray,
      og_title: formData.og_title.trim() || null,
      og_description: formData.og_description.trim() || null,
      og_image_url: formData.og_image_url.trim() || null,
      twitter_handle: formData.twitter_handle.trim() || null,
      canonical_url: formData.canonical_url.trim() || null,
      robots_indexing: formData.robots_indexing,
    };

    try {
      await updateSeoAction(payload);
      setSuccessMessage("SEO metadata updated successfully.");
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to update SEO settings.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          {errorMessage}
        </div>
      )}

      {/* Search Engine Meta */}
      <div className="p-6 rounded-2xl bg-[#081220]/60 border border-white/10 backdrop-blur-sm space-y-5">
        <h3 className="text-base font-semibold text-white flex items-center gap-2">
          <Search className="w-4 h-4 text-cyan-400" />
          Search Engine Metadata (Google, Bing)
        </h3>

        <div>
          <label className="block text-xs font-medium text-white/70 mb-1.5">
            Meta Title
          </label>
          <input
            type="text"
            required
            value={formData.meta_title}
            onChange={(e) => setFormData((p) => ({ ...p, meta_title: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-white/70 mb-1.5">
            Meta Description
          </label>
          <textarea
            rows={3}
            required
            value={formData.meta_description}
            onChange={(e) => setFormData((p) => ({ ...p, meta_description: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-white/70 mb-1.5">
            Keywords (comma separated)
          </label>
          <input
            type="text"
            value={formData.keywordsInput}
            onChange={(e) => setFormData((p) => ({ ...p, keywordsInput: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">
              Canonical URL
            </label>
            <input
              type="url"
              value={formData.canonical_url}
              onChange={(e) => setFormData((p) => ({ ...p, canonical_url: e.target.value }))}
              placeholder="https://cyberforage.space"
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50"
            />
          </div>

          <div className="flex items-center pt-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.robots_indexing}
                onChange={(e) => setFormData((p) => ({ ...p, robots_indexing: e.target.checked }))}
                className="rounded border-white/20 bg-white/5 text-cyan-400 focus:ring-0"
              />
              <span className="text-sm text-white/90">Allow Robots Indexing</span>
            </label>
          </div>
        </div>
      </div>

      {/* OpenGraph & Social Sharing */}
      <div className="p-6 rounded-2xl bg-[#081220]/60 border border-white/10 backdrop-blur-sm space-y-5">
        <h3 className="text-base font-semibold text-white flex items-center gap-2">
          <Share2 className="w-4 h-4 text-cyan-400" />
          OpenGraph & Social Preview Cards
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">
              OG Title
            </label>
            <input
              type="text"
              value={formData.og_title}
              onChange={(e) => setFormData((p) => ({ ...p, og_title: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5 flex items-center gap-1.5">
              <Twitter className="w-3.5 h-3.5 text-cyan-400" />
              Twitter / X Handle
            </label>
            <input
              type="text"
              value={formData.twitter_handle}
              onChange={(e) => setFormData((p) => ({ ...p, twitter_handle: e.target.value }))}
              placeholder="@cyberforage"
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-white/70 mb-1.5">
            OG Description
          </label>
          <textarea
            rows={2}
            value={formData.og_description}
            onChange={(e) => setFormData((p) => ({ ...p, og_description: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-white/70 mb-1.5">
            OG Share Image URL
          </label>
          <input
            type="text"
            value={formData.og_image_url}
            onChange={(e) => setFormData((p) => ({ ...p, og_image_url: e.target.value }))}
            placeholder="https://... or /og-image.png"
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-[#040810] font-semibold text-sm hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSubmitting ? "Saving..." : "Save SEO Settings"}
        </button>
      </div>
    </form>
  );
}
