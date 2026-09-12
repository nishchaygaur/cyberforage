"use client";

import { useState } from "react";
import { Save, Globe, AlertTriangle, Bell, UserCheck, Shield } from "lucide-react";
import { updateSiteSettingsAction } from "@/app/admin/actions";
import { useRouter } from "next/navigation";

export function SettingsClient({ initialSettings }: { initialSettings: any }) {
  const [formData, setFormData] = useState({
    // Brand Identity Section
    site_name: initialSettings?.site_name || "CYBERFORAGE",
    tagline: initialSettings?.tagline || "Explore. Build. Defend.",
    owner_name: initialSettings?.owner_name || "",
    owner_title: initialSettings?.owner_title || "",
    owner_description: initialSettings?.owner_description || "",

    // Site overview & announcements
    short_description:
      initialSettings?.short_description ||
      "A technology ecosystem for cybersecurity, security research, intelligent automation and defensive engineering.",
    long_description: initialSettings?.long_description || "",
    maintenance_mode: initialSettings?.maintenance_mode || false,
    announcement_banner_enabled: initialSettings?.announcement_banner_enabled || false,
    announcement_banner_text: initialSettings?.announcement_banner_text || "",
    copyright_text:
      initialSettings?.copyright_text || "© 2026 Cyberforage. All rights reserved.",
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
      const payload = {
        site_name: formData.site_name.trim() || "CYBERFORAGE",
        tagline: formData.tagline.trim() || "Explore. Build. Defend.",
        owner_name: formData.owner_name.trim() || null,
        owner_title: formData.owner_title.trim() || null,
        owner_description: formData.owner_description.trim() || null,
        short_description: formData.short_description.trim() || null,
        long_description: formData.long_description.trim() || null,
        copyright_text: formData.copyright_text.trim() || "© 2026 Cyberforage. All rights reserved.",
        maintenance_mode: formData.maintenance_mode,
        announcement_banner_enabled: formData.announcement_banner_enabled,
        announcement_banner_text: formData.announcement_banner_text.trim() || null,
      };

      const res = await updateSiteSettingsAction(payload);
      if (res && !res.success) throw new Error(res.error || "Failed to update site settings.");
      setSuccessMessage("Site settings and brand identity updated successfully.");
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

      {/* SECTION: BRAND IDENTITY */}
      <div className="p-6 rounded-2xl bg-[#081220]/60 border border-white/10 backdrop-blur-sm space-y-6">
        <div className="border-b border-white/[0.06] pb-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            BRAND IDENTITY
          </h3>
          <p className="text-xs text-white/50 mt-1">
            Configure primary brand values and secondary creator/owner identity. The brand remains Cyberforage, with creator info as secondary attribution.
          </p>
        </div>

        {/* Primary Brand Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
              Brand Name
            </label>
            <input
              type="text"
              required
              value={formData.site_name}
              onChange={(e) => setFormData((p) => ({ ...p, site_name: e.target.value }))}
              placeholder="CYBERFORAGE"
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/50"
            />
            <span className="text-[11px] text-white/40 mt-1 block">
              Default: <code className="text-cyan-300">CYBERFORAGE</code>
            </span>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
              Tagline
            </label>
            <input
              type="text"
              required
              value={formData.tagline}
              onChange={(e) => setFormData((p) => ({ ...p, tagline: e.target.value }))}
              placeholder="Explore. Build. Defend."
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/50"
            />
            <span className="text-[11px] text-white/40 mt-1 block">
              Default: <code className="text-cyan-300">Explore. Build. Defend.</code>
            </span>
          </div>
        </div>

        {/* Secondary Creator / Owner Identity */}
        <div className="pt-4 border-t border-white/[0.06] space-y-4">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
              Owner / Creator Secondary Identity
            </span>
          </div>
          <p className="text-xs text-white/50">
            Configure the creator name, title, and bio to display secondary attribution on the public website (About section, Footer, Contact modal, and metadata). Leave empty to omit without showing fake placeholders.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
                Owner / Creator Name
              </label>
              <input
                type="text"
                value={formData.owner_name}
                onChange={(e) => setFormData((p) => ({ ...p, owner_name: e.target.value }))}
                placeholder="e.g. Nishchay Gaur"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/50"
              />
              <span className="text-[11px] text-white/40 mt-1 block">
                Displayed as secondary identity attribution when set.
              </span>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
                Owner / Creator Title
              </label>
              <input
                type="text"
                value={formData.owner_title}
                onChange={(e) => setFormData((p) => ({ ...p, owner_title: e.target.value }))}
                placeholder="e.g. Founder & Security Researcher"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/50"
              />
              <span className="text-[11px] text-white/40 mt-1 block">
                Professional role or designation.
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
              Owner / Creator Description
            </label>
            <textarea
              rows={2}
              value={formData.owner_description}
              onChange={(e) => setFormData((p) => ({ ...p, owner_description: e.target.value }))}
              placeholder="e.g. Security practitioner and software developer focused on defensive engineering and automation."
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/50 resize-none"
            />
            <span className="text-[11px] text-white/40 mt-1 block">
              Optional personal bio/statement.
            </span>
          </div>
        </div>

        {/* Global descriptions */}
        <div className="pt-4 border-t border-white/[0.06] space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
              Short Description (Hero and Meta)
            </label>
            <textarea
              rows={2}
              value={formData.short_description}
              onChange={(e) => setFormData((p) => ({ ...p, short_description: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/50 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
              Footer Copyright Notice
            </label>
            <input
              type="text"
              value={formData.copyright_text}
              onChange={(e) => setFormData((p) => ({ ...p, copyright_text: e.target.value }))}
              placeholder="© 2026 Cyberforage. All rights reserved."
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/50"
            />
          </div>
        </div>
      </div>

      {/* Broadcast Announcement Banner */}
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
            <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
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

      {/* Maintenance Guard */}
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
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-[#040810] font-semibold text-sm hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all disabled:opacity-50 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          {isSubmitting ? "Saving Settings..." : "Save Settings"}
        </button>
      </div>
    </form>
  );
}
