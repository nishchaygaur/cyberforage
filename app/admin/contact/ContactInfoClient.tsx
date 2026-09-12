"use client";

import { useState } from "react";
import { Save, Mail, MapPin, Clock, ShieldCheck, Key } from "lucide-react";
import { updateContactInfoAction } from "@/app/admin/actions";
import { useRouter } from "next/navigation";

export function ContactInfoClient({ initialInfo }: { initialInfo: any }) {
  const [formData, setFormData] = useState({
    email: initialInfo?.email || "contact@cyberforage.space",
    location: initialInfo?.location || "Zurich, Switzerland",
    status_badge: initialInfo?.status_badge || "Operational",
    status_badge_subtext: initialInfo?.status_badge_subtext || "Available for Select Engagements",
    response_time: initialInfo?.response_time || "Within 24 Hours",
    consultation_title: initialInfo?.consultation_title || "Confidential Advisory",
    consultation_description:
      initialInfo?.consultation_description ||
      "Direct channel for sovereign, enterprise, and high-assurance consultation.",
    pgp_key: initialInfo?.pgp_key || "",
    enabled: initialInfo?.enabled !== undefined ? initialInfo.enabled : true,
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
      await updateContactInfoAction(formData);
      setSuccessMessage("Contact information updated successfully.");
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to update contact information.");
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

      <div className="p-6 rounded-2xl bg-[#081220]/60 border border-white/10 backdrop-blur-sm space-y-6">
        <h3 className="text-base font-semibold text-white flex items-center gap-2">
          <Mail className="w-4 h-4 text-cyan-400" />
          Primary Communication Coordinates
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">
              Contact Email Address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
              placeholder="contact@cyberforage.space"
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">
              Physical / Operational Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))}
              placeholder="Zurich, Switzerland"
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">
              Status Badge Label
            </label>
            <input
              type="text"
              value={formData.status_badge}
              onChange={(e) => setFormData((p) => ({ ...p, status_badge: e.target.value }))}
              placeholder="Operational"
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">
              Status Badge Subtext / Availability
            </label>
            <input
              type="text"
              value={formData.status_badge_subtext}
              onChange={(e) => setFormData((p) => ({ ...p, status_badge_subtext: e.target.value }))}
              placeholder="Available for Select Engagements"
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-white/70 mb-1.5">
            Expected SLA / Response Time
          </label>
          <input
            type="text"
            value={formData.response_time}
            onChange={(e) => setFormData((p) => ({ ...p, response_time: e.target.value }))}
            placeholder="Within 24 Hours"
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/50"
          />
        </div>
      </div>

      {/* Advisory modal text */}
      <div className="p-6 rounded-2xl bg-[#081220]/60 border border-white/10 backdrop-blur-sm space-y-6">
        <h3 className="text-base font-semibold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          Modal Copy & PGP Cryptographic Key
        </h3>

        <div>
          <label className="block text-xs font-medium text-white/70 mb-1.5">
            Consultation Modal Title
          </label>
          <input
            type="text"
            value={formData.consultation_title}
            onChange={(e) => setFormData((p) => ({ ...p, consultation_title: e.target.value }))}
            placeholder="Confidential Advisory"
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/50"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-white/70 mb-1.5">
            Consultation Modal Description
          </label>
          <textarea
            rows={2}
            value={formData.consultation_description}
            onChange={(e) => setFormData((p) => ({ ...p, consultation_description: e.target.value }))}
            placeholder="Direct channel for sovereign, enterprise, and high-assurance consultation."
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/50"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-white/70 mb-1.5 flex items-center gap-2">
            <Key className="w-3.5 h-3.5 text-cyan-400" />
            PGP Public Key Block (Armored)
          </label>
          <textarea
            rows={6}
            value={formData.pgp_key}
            onChange={(e) => setFormData((p) => ({ ...p, pgp_key: e.target.value }))}
            placeholder="-----BEGIN PGP PUBLIC KEY BLOCK-----&#10;...&#10;-----END PGP PUBLIC KEY BLOCK-----"
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-xs font-mono focus:outline-none focus:border-cyan-400/50"
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
          {isSubmitting ? "Saving..." : "Save Contact Settings"}
        </button>
      </div>
    </form>
  );
}
