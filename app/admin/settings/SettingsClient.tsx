"use client";

import { useState } from "react";
import { Save, Globe, AlertTriangle, Bell, Shield } from "lucide-react";
import { updateSiteSettingsAction } from "@/app/admin/actions";
import { useRouter } from "next/navigation";

export function SettingsClient({ initialSettings }: { initialSettings: any }) {
  const [formData, setFormData] = useState({
    site_name: initialSettings?.site_name || "CYBERFORAGE",
    tagline: initialSettings?.tagline || "Advanced Autonomous Security Systems",
    short_description:
      initialSettings?.short_description ||
      "Pioneering autonomous cybersecurity research, sovereign infrastructure, and distributed defense architectures.",
    long_description: initialSettings?.long_description || "",
    contact_email: initialSettings?.contact_email || "contact@cyberforage.space",
    maintenance_mode: initialSettings?.maintenance_mode || false,
    announcement_banner_enabled: initialSettings?.announcement_banner_enabled || false,
    announcement_banner_text: initialSettings?.announcement_banner_text || "",
    copyright_text:
      initialSettings?.copyright_text || "© 2025 CYBERFORAGE. All rights reserved.",
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

    try {
      await updateSiteSettingsAction(formData);
      setSuccessMessage("Site settings updated successfully.");
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to update site settings.");
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

      {/* Brand Identity */}
      <div className="p-6 rounded-2xl bg-[#081220]/60 border border-white/10 backdrop-blur-sm space-y-5">
        <h3 className="text-base font-semibold text-white flex items-center gap-2">
          <Globe className="w-4 h-4 text-cyan-400" />
          Brand & Global Identity
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">
              Site Brand Name
            </label>
            <input
              type="text"
              required
              value={formData.site_name}
              onChange={(e) => setFormData((p) => ({ ...p, site_name: e.target.value }))}
              placeholder="CYBERFORAGE"
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">
              Tagline
            </label>
            <input
              type="text"
              required
              value={formData.tagline}
              onChange={(e) => setFormData((p) => ({ ...p, tagline: e.target.value }))}
              placeholder="Advanced Autonomous Security Systems"
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-white/70 mb-1.5">
            Short Description (Hero and Meta)
          </label>
          <textarea
            rows={2}
            value={formData.short_description}
            onChange={(e) => setFormData((p) => ({ ...p, short_description: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/50"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-white/70 mb-1.5">
            Footer Copyright Notice
          </label>
          <input
            type="text"
            value={formData.copyright_text}
            onChange={(e) => setFormData((p) => ({ ...p, copyright_text: e.target.value }))}
            placeholder="© 2025 CYBERFORAGE. All rights reserved."
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/50"
          />
        </div>
      </div>

      {/* Broadcast Banner */}
      <div className="p-6 rounded-2xl bg-[#081220]/60 border border-white/10 backdrop-blur-sm space-y-5">
        <h3 className="text-base font-semibold text-white flex items-center gap-2">
          <Bell className="w-4 h-4 text-cyan-400" />
          Broadcast Announcement Banner
        </h3>

        <div>
          <label className="flex items-center gap-3 cursor-pointer mb-3">
            <input
              type="checkbox"
              checked={formData.announcement_banner_enabled}
              onChange={(e) =>
                setFormData((p) => ({ ...p, announcement_banner_enabled: e.target.checked }))
              }
              className="rounded border-white/20 bg-white/5 text-cyan-400 focus:ring-0 focus:ring-offset-0"
            />
            <span className="text-sm text-white/90">Enable Public Top Banner</span>
          </label>
        </div>

        {formData.announcement_banner_enabled && (
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">
              Banner Announcement Text
            </label>
            <input
              type="text"
              value={formData.announcement_banner_text}
              onChange={(e) =>
                setFormData((p) => ({ ...p, announcement_banner_text: e.target.value }))
              }
              placeholder="e.g. New Research Advisory: Post-Quantum Migration Guide Released"
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/50"
            />
          </div>
        )}
      </div>

      {/* Maintenance */}
      <div className="p-6 rounded-2xl bg-[#081220]/60 border border-white/10 backdrop-blur-sm space-y-4">
        <h3 className="text-base font-semibold text-white flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          System Maintenance Guard
        </h3>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.maintenance_mode}
            onChange={(e) => setFormData((p) => ({ ...p, maintenance_mode: e.target.checked }))}
            className="rounded border-white/20 bg-white/5 text-amber-400 focus:ring-0 focus:ring-offset-0"
          />
          <div>
            <span className="text-sm font-medium text-white/90 block">
              Enable Maintenance Mode
            </span>
            <span className="text-xs text-white/40 block">
              Displays maintenance placeholder to unauthenticated visitors while keeping Admin accessible.
            </span>
          </div>
        </label>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-[#040810] font-semibold text-sm hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSubmitting ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </form>
  );
}
