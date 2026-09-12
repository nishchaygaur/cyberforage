"use client";

import { useState } from "react";
import {
  Save,
  Mail,
  MapPin,
  Globe,
  Phone,
  MessageSquare,
  FileText,
  User,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { updateContactInfoAction } from "@/app/admin/actions";
import { validatePlatformUrl, WhatsAppIcon } from "@/components/ui/SocialIcon";
import { useRouter } from "next/navigation";

export interface ContactInfoFormData {
  display_name: string;
  email: string;
  phone: string;
  whatsapp: string;
  location: string;
  website: string;
  description: string;
  contact_modal_description: string;
}

export function ContactInfoClient({ initialInfo }: { initialInfo: any }) {
  const [formData, setFormData] = useState<ContactInfoFormData>({
    display_name: initialInfo?.display_name || "Cyberforage",
    email: initialInfo?.email || "",
    phone: initialInfo?.phone || "",
    whatsapp: initialInfo?.whatsapp || "",
    location: initialInfo?.location || "",
    website: initialInfo?.website || "https://cyberforage.space",
    description:
      initialInfo?.description ||
      "Communication channel for research collaborations, security projects, and ecosystem inquiries.",
    contact_modal_description:
      initialInfo?.contact_modal_description ||
      "Have an idea, research collaboration, or security project? Connect with the Cyberforage ecosystem.",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleValidation = (): string | null => {
    if (formData.email.trim()) {
      const v = validatePlatformUrl("email", formData.email.trim());
      if (!v.valid) return v.error || "Please enter a valid email address.";
    }

    if (formData.phone.trim()) {
      const v = validatePlatformUrl("phone", formData.phone.trim());
      if (!v.valid) return v.error || "Please enter a valid telephone number.";
    }

    if (formData.whatsapp.trim()) {
      const v = validatePlatformUrl("whatsapp", formData.whatsapp.trim());
      if (!v.valid) return v.error || "Please enter a valid WhatsApp link (e.g. https://wa.me/...) or country code + number.";
    }

    if (formData.website.trim()) {
      const v = validatePlatformUrl("website", formData.website.trim());
      if (!v.valid) return v.error || "Please enter a valid website URL.";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    const validationError = handleValidation();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      // Clean up inputs (empty strings converted to null)
      const payload = {
        display_name: formData.display_name.trim() || null,
        email: formData.email.trim() || null,
        phone: formData.phone.trim() || null,
        whatsapp: formData.whatsapp.trim() || null,
        location: formData.location.trim() || null,
        website: formData.website.trim() || null,
        description: formData.description.trim() || null,
        contact_modal_description: formData.contact_modal_description.trim() || null,
      };

      const res = await updateContactInfoAction(payload);
      if (res && !res.success) throw new Error(res.error || "Failed to update contact information.");
      setSuccessMessage("Contact information updated successfully.");
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to update contact information.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Contact Identity & Channels */}
        <div className="p-6 rounded-2xl bg-[#081220]/60 border border-white/10 backdrop-blur-sm space-y-6">
          <div className="border-b border-white/[0.06] pb-4">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-400" />
              Primary Contact Identity
            </h3>
            <p className="text-xs text-white/50 mt-1">
              Public communication channels used for ecosystem inquiries, collaborations, and direct messaging.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Display Name */}
            <div>
              <label className="block text-xs font-mono tracking-wider uppercase text-white/70 mb-1.5">
                Name / Display Name
              </label>
              <input
                type="text"
                value={formData.display_name}
                onChange={(e) => setFormData((p) => ({ ...p, display_name: e.target.value }))}
                placeholder="Cyberforage"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-cyan-400/50"
              />
              <span className="text-[11px] text-white/40 mt-1 block">
                Primary entity or team name shown on contact forms.
              </span>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-mono tracking-wider uppercase text-white/70 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                Email Address
              </label>
              <input
                type="text"
                value={formData.email}
                onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                placeholder="contact@cyberforage.space"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-cyan-400/50"
              />
              <span className="text-[11px] text-white/40 mt-1 block">
                Leave empty to hide. Automatically generates secure mailto links.
              </span>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-mono tracking-wider uppercase text-white/70 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-cyan-400" />
                Phone Number
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                placeholder="+1 (555) 019-2834"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-cyan-400/50"
              />
              <span className="text-[11px] text-white/40 mt-1 block">
                Leave empty to hide. Supports tel: links without inventing phone numbers.
              </span>
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block text-xs font-mono tracking-wider uppercase text-white/70 mb-1.5 flex items-center gap-1.5">
                <WhatsAppIcon className="w-3.5 h-3.5 text-[#00F0C0]" />
                WhatsApp (URL or Number)
              </label>
              <input
                type="text"
                value={formData.whatsapp}
                onChange={(e) => setFormData((p) => ({ ...p, whatsapp: e.target.value }))}
                placeholder="https://wa.me/15550192834"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-cyan-400/50"
              />
              <span className="text-[11px] text-white/40 mt-1 block">
                Format: <code className="text-cyan-300">https://wa.me/&lt;number&gt;</code>. Validated before saving.
              </span>
            </div>

            {/* Operational Location */}
            <div>
              <label className="block text-xs font-mono tracking-wider uppercase text-white/70 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))}
                placeholder="Distributed / Remote"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-cyan-400/50"
              />
              <span className="text-[11px] text-white/40 mt-1 block">
                Physical or operational location (optional).
              </span>
            </div>

            {/* Website */}
            <div>
              <label className="block text-xs font-mono tracking-wider uppercase text-white/70 mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                Website URL
              </label>
              <input
                type="text"
                value={formData.website}
                onChange={(e) => setFormData((p) => ({ ...p, website: e.target.value }))}
                placeholder="https://cyberforage.space"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-cyan-400/50"
              />
              <span className="text-[11px] text-white/40 mt-1 block">
                Primary website or portal address.
              </span>
            </div>
          </div>
        </div>

        {/* Descriptions & Copywriting */}
        <div className="p-6 rounded-2xl bg-[#081220]/60 border border-white/10 backdrop-blur-sm space-y-6">
          <div className="border-b border-white/[0.06] pb-4">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              Contact Descriptions & Modal Copy
            </h3>
            <p className="text-xs text-white/50 mt-1">
              Customize the explanatory copy on contact surfaces and the public contact modal.
            </p>
          </div>

          <div>
            <label className="block text-xs font-mono tracking-wider uppercase text-white/70 mb-1.5">
              Short Description (Contact Overview)
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              placeholder="Communication channel for research collaborations, security projects, and ecosystem inquiries."
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-cyan-400/50 resize-none"
            />
            <span className="text-[11px] text-white/40 mt-1 block">
              General contact blurb used across communication sections.
            </span>
          </div>

          <div>
            <label className="block text-xs font-mono tracking-wider uppercase text-white/70 mb-1.5 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
              Contact Modal Description
            </label>
            <textarea
              rows={2}
              value={formData.contact_modal_description}
              onChange={(e) =>
                setFormData((p) => ({ ...p, contact_modal_description: e.target.value }))
              }
              placeholder="Have an idea, research collaboration, or security project? Connect with the Cyberforage ecosystem."
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-cyan-400/50 resize-none"
            />
            <span className="text-[11px] text-white/40 mt-1 block">
              Displayed directly inside the public &quot;Get in touch&quot; / Transmission modal dialog.
            </span>
          </div>
        </div>

        {/* Live Public Preview Card */}
        <div className="p-6 rounded-2xl bg-[#050B14] border border-cyan-400/20 shadow-[0_0_30px_rgba(0,240,192,0.05)] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono tracking-widest text-[#00E5BE] uppercase">
              LIVE PREVIEW • PUBLIC CONTACT COORDINATES
            </span>
            <span className="text-xs text-white/40">Only non-empty fields render</span>
          </div>

          <div className="rounded-xl bg-[#081220] border border-white/[0.08] p-5 space-y-4">
            <div>
              <h4 className="text-lg font-bold text-white tracking-tight">
                {formData.display_name || "Cyberforage"}
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {formData.description || "No description provided."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono">
              {formData.email ? (
                <div className="flex items-center gap-2 text-slate-300">
                  <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">{formData.email}</span>
                </div>
              ) : (
                <div className="text-white/20 italic flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-white/20" />
                  <span>Email: Hidden (No value)</span>
                </div>
              )}

              {formData.phone ? (
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">{formData.phone}</span>
                </div>
              ) : (
                <div className="text-white/20 italic flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-white/20" />
                  <span>Phone: Hidden (No value)</span>
                </div>
              )}

              {formData.whatsapp ? (
                <div className="flex items-center gap-2 text-slate-300">
                  <WhatsAppIcon className="w-3.5 h-3.5 text-[#00F0C0] shrink-0" />
                  <span className="truncate text-[#00F0C0]">{formData.whatsapp}</span>
                </div>
              ) : (
                <div className="text-white/20 italic flex items-center gap-2">
                  <WhatsAppIcon className="w-3.5 h-3.5 text-white/20" />
                  <span>WhatsApp: Hidden (No value)</span>
                </div>
              )}

              {formData.location ? (
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">{formData.location}</span>
                </div>
              ) : null}

              {formData.website ? (
                <div className="flex items-center gap-2 text-slate-300">
                  <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <a
                    href={formData.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:underline flex items-center gap-1 truncate"
                  >
                    {formData.website}
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              ) : null}
            </div>

            {formData.contact_modal_description && (
              <div className="pt-2 border-t border-white/[0.04]">
                <span className="text-[10px] text-white/40 uppercase tracking-wider block mb-1">
                  Modal Subtext
                </span>
                <p className="text-xs text-slate-400 italic">
                  &quot;{formData.contact_modal_description}&quot;
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-[#040810] font-semibold text-sm hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? "Saving Coordinates..." : "Save Contact Information"}
          </button>
        </div>
      </form>
    </div>
  );
}
