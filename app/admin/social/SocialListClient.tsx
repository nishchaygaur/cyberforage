"use client";

import { useState, useTransition } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Globe,
  ExternalLink,
  Save,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";
import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";
import {
  createSocialAction,
  updateSocialAction,
  deleteSocialAction,
  reorderSocialAction,
} from "@/app/admin/actions";
import {
  SocialIcon,
  PLATFORM_PRESETS,
  getPlatformDefaults,
  validatePlatformUrl,
} from "@/components/ui/SocialIcon";
import { useRouter } from "next/navigation";

export interface SocialLinkItem {
  id: string;
  platform: string;
  label: string;
  url: string;
  icon: string | null;
  description: string | null;
  enabled: boolean;
  display_order: number;
}

const AVAILABLE_ICONS = [
  { key: "linkedin", label: "LinkedIn" },
  { key: "instagram", label: "Instagram" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "github", label: "GitHub" },
  { key: "x", label: "X / Twitter" },
  { key: "youtube", label: "YouTube" },
  { key: "telegram", label: "Telegram" },
  { key: "mail", label: "Mail / Email" },
  { key: "phone", label: "Phone" },
  { key: "globe", label: "Globe / Web" },
  { key: "link", label: "Link / Custom" },
];

export function SocialListClient({ initialLinks }: { initialLinks: SocialLinkItem[] }) {
  const [links, setLinks] = useState<SocialLinkItem[]>(initialLinks);
  const [editingLink, setEditingLink] = useState<SocialLinkItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SocialLinkItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [formState, setFormState] = useState({
    platform: "github",
    label: "GitHub",
    url: "",
    icon: "github",
    description: "",
    display_order: 1,
    enabled: true,
  });

  const [urlValidationNotice, setUrlValidationNotice] = useState<{
    valid: boolean;
    error?: string;
  }>({ valid: true });

  const handleOpenCreate = () => {
    const defaults = getPlatformDefaults("github");
    setFormState({
      platform: defaults.key,
      label: defaults.label,
      url: "",
      icon: defaults.icon,
      description: "",
      display_order: links.length + 1,
      enabled: true,
    });
    setUrlValidationNotice({ valid: true });
    setIsCreating(true);
    setEditingLink(null);
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleOpenEdit = (link: SocialLinkItem) => {
    setEditingLink(link);
    setFormState({
      platform: link.platform,
      label: link.label,
      url: link.url,
      icon: link.icon || link.platform || "custom",
      description: link.description || "",
      display_order: link.display_order,
      enabled: link.enabled,
    });
    const check = validatePlatformUrl(link.platform, link.url);
    setUrlValidationNotice({ valid: check.valid, error: check.error });
    setIsCreating(false);
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handlePlatformChange = (newPlatform: string) => {
    const defaults = getPlatformDefaults(newPlatform);
    setFormState((prev) => ({
      ...prev,
      platform: defaults.key,
      label: defaults.label,
      icon: defaults.icon,
      url: prev.url === "" || prev.url.startsWith("https://") && prev.url.length <= 8 ? "" : prev.url,
    }));
    if (formState.url) {
      const check = validatePlatformUrl(defaults.key, formState.url);
      setUrlValidationNotice({ valid: check.valid, error: check.error });
    }
  };

  const handleUrlChange = (newUrl: string) => {
    setFormState((prev) => ({ ...prev, url: newUrl }));
    if (newUrl.trim()) {
      const check = validatePlatformUrl(formState.platform, newUrl.trim());
      setUrlValidationNotice({ valid: check.valid, error: check.error });
    } else {
      setUrlValidationNotice({ valid: true });
    }
  };

  const handleToggleEnabled = (link: SocialLinkItem) => {
    const newEnabled = !link.enabled;
    setLinks((prev) =>
      prev.map((l) => (l.id === link.id ? { ...l, enabled: newEnabled } : l))
    );
    setSuccessMessage("");
    setErrorMessage("");

    startTransition(async () => {
      try {
        const res = await updateSocialAction(link.id, { enabled: newEnabled });
        if (!res.success) {
          setErrorMessage(res.error || "Failed to update link status.");
          // Rollback on error
          setLinks((prev) =>
            prev.map((l) => (l.id === link.id ? { ...l, enabled: !newEnabled } : l))
          );
          return;
        }
        setSuccessMessage(`Link "${link.label}" ${newEnabled ? "enabled" : "hidden"} successfully.`);
        router.refresh();
      } catch (err: any) {
        setErrorMessage(err.message || "Failed to update link status.");
        // Rollback on error
        setLinks((prev) =>
          prev.map((l) => (l.id === link.id ? { ...l, enabled: !newEnabled } : l))
        );
      }
    });
  };

  const handleMoveOrder = async (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === links.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const newLinks = [...links];
    const temp = newLinks[index];
    newLinks[index] = newLinks[targetIndex];
    newLinks[targetIndex] = temp;

    // Recalculate display_order
    const updated = newLinks.map((item, idx) => ({
      ...item,
      display_order: idx + 1,
    }));

    setLinks(updated);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const orderedIds = updated.map((item) => item.id);
      const res = await reorderSocialAction(orderedIds);
      if (!res.success) {
        setErrorMessage(res.error || "Failed to reorder links.");
        setLinks(links);
        return;
      }
      setSuccessMessage("Social links order saved.");
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to reorder links.");
      // Rollback
      setLinks(links);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.label.trim()) {
      setErrorMessage("Label is required.");
      return;
    }
    if (!formState.url.trim()) {
      setErrorMessage("Destination URL is required.");
      return;
    }

    const validation = validatePlatformUrl(formState.platform, formState.url.trim());
    if (!validation.valid) {
      setErrorMessage(validation.error || "Please provide a valid URL.");
      setUrlValidationNotice({ valid: false, error: validation.error });
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    const payload = {
      platform: formState.platform.toLowerCase().trim(),
      label: formState.label.trim(),
      url: validation.formattedUrl,
      icon: formState.icon || formState.platform,
      description: formState.description.trim() || null,
      enabled: formState.enabled,
      display_order: formState.display_order,
    };

    try {
      if (editingLink) {
        const res = await updateSocialAction(editingLink.id, payload);
        if (!res.success || !res.data) {
          setErrorMessage(res.error || "Failed to update social link.");
          return;
        }
        setLinks((prev) =>
          prev.map((l) => (l.id === editingLink.id ? { ...l, ...res.data } : l))
        );
        setSuccessMessage(`Social link "${payload.label}" updated successfully.`);
      } else {
        const res = await createSocialAction(payload);
        if (!res.success || !res.data) {
          setErrorMessage(res.error || "Failed to add social link.");
          return;
        }
        setLinks((prev) => [...prev, res.data!]);
        setSuccessMessage(`Social link "${payload.label}" added successfully.`);
      }
      setEditingLink(null);
      setIsCreating(false);
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to save social link.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await deleteSocialAction(deleteTarget.id);
      if (!res.success) {
        setErrorMessage(res.error || "Failed to delete link.");
        return;
      }
      setLinks((prev) => prev.filter((l) => l.id !== deleteTarget.id));
      setSuccessMessage(`Social link "${deleteTarget.label}" deleted.`);
      setDeleteTarget(null);
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to delete link.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
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

      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-white/50">
          Enabled entries are displayed in the public footer and navbar. Disabled entries are hidden.
        </p>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-[#040810] font-semibold text-sm hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Social Link
        </button>
      </div>

      {/* Editor Modal / Drawer */}
      {(isCreating || editingLink) && (
        <div className="p-6 rounded-2xl bg-[#071120] border border-cyan-400/30 shadow-[0_0_40px_rgba(0,240,192,0.1)] space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <SocialIcon platform={formState.platform} icon={formState.icon} className="w-4 h-4 text-cyan-400" />
              <span>{editingLink ? `Edit Link: ${editingLink.label}` : "Add New Social Link"}</span>
            </h3>
            <button
              onClick={() => {
                setEditingLink(null);
                setIsCreating(false);
              }}
              className="p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Platform Selector */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1">
                  Platform Preset
                </label>
                <select
                  value={formState.platform}
                  onChange={(e) => handlePlatformChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#040812] border border-white/15 text-white text-sm focus:outline-none focus:border-cyan-400/50"
                >
                  {PLATFORM_PRESETS.map((p) => (
                    <option key={p.key} value={p.key}>
                      {p.label}
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-white/40 mt-1 block">
                  {getPlatformDefaults(formState.platform).description}
                </span>
              </div>

              {/* Label */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1">
                  Display Label
                </label>
                <input
                  type="text"
                  required
                  value={formState.label}
                  onChange={(e) => setFormState((p) => ({ ...p, label: e.target.value }))}
                  placeholder="e.g. GitHub"
                  className="w-full px-3 py-2 rounded-xl bg-[#040812] border border-white/15 text-white text-sm focus:outline-none focus:border-cyan-400/50"
                />
                <span className="text-[11px] text-white/40 mt-1 block">
                  Text visible on hover or accessibility labels.
                </span>
              </div>

              {/* URL */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1">
                  Destination URL
                </label>
                <input
                  type="text"
                  required
                  value={formState.url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder={getPlatformDefaults(formState.platform).urlPlaceholder}
                  className={`w-full px-3 py-2 rounded-xl bg-[#040812] border text-white text-sm focus:outline-none ${
                    !urlValidationNotice.valid
                      ? "border-rose-500/70 focus:border-rose-400"
                      : "border-white/15 focus:border-cyan-400/50"
                  }`}
                />
                <div className="flex items-center justify-between mt-1 text-[11px]">
                  <span className="text-white/40">
                    Hint: {getPlatformDefaults(formState.platform).urlPrefixHint}
                  </span>
                  {!urlValidationNotice.valid && (
                    <span className="text-rose-400 font-medium">
                      {urlValidationNotice.error}
                    </span>
                  )}
                </div>
              </div>

              {/* Icon Selector */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1">
                  Icon
                </label>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-cyan-400">
                    <SocialIcon platform={formState.platform} icon={formState.icon} className="w-4 h-4" />
                  </div>
                  <select
                    value={formState.icon}
                    onChange={(e) => setFormState((p) => ({ ...p, icon: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-[#040812] border border-white/15 text-white text-sm focus:outline-none focus:border-cyan-400/50"
                  >
                    {AVAILABLE_ICONS.map((ic) => (
                      <option key={ic.key} value={ic.key}>
                        {ic.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Display Order */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formState.display_order}
                  onChange={(e) =>
                    setFormState((p) => ({
                      ...p,
                      display_order: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#040812] border border-white/15 text-white text-sm font-mono focus:outline-none focus:border-cyan-400/50"
                />
              </div>

              {/* Optional Description */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1">
                  Optional Description
                </label>
                <input
                  type="text"
                  value={formState.description}
                  onChange={(e) => setFormState((p) => ({ ...p, description: e.target.value }))}
                  placeholder="e.g. Official repository for cybersecurity tools"
                  className="w-full px-3 py-2 rounded-xl bg-[#040812] border border-white/15 text-white text-sm focus:outline-none focus:border-cyan-400/50"
                />
              </div>
            </div>

            {/* Visibility toggle & Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-white/10">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formState.enabled}
                  onChange={(e) => setFormState((p) => ({ ...p, enabled: e.target.checked }))}
                  className="rounded border-white/20 bg-white/5 text-cyan-400 focus:ring-0"
                />
                <span className="text-sm text-white/90">Visible on Public Site</span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingLink(null);
                    setIsCreating(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-white/5 text-white/70 text-xs hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-cyan-400 text-[#040810] font-semibold text-xs hover:bg-cyan-300 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  {isSubmitting ? "Saving..." : "Save Link"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Links List Table */}
      <div className="rounded-2xl border border-white/10 bg-[#081220]/60 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/80">
            <thead className="bg-white/[0.02] border-b border-white/10 text-xs font-mono uppercase tracking-wider text-white/60">
              <tr>
                <th className="px-6 py-4">Reorder</th>
                <th className="px-6 py-4">Platform & Label</th>
                <th className="px-6 py-4">Destination URL</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {links.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-white/40">
                    No social links configured yet. Click &quot;Add Social Link&quot; to begin.
                  </td>
                </tr>
              ) : (
                links.map((link, index) => (
                  <tr key={link.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Reorder Buttons */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveOrder(index, "up")}
                          disabled={index === 0}
                          aria-label="Move Up"
                          className="p-1 rounded bg-white/5 hover:bg-white/15 text-white/60 hover:text-white disabled:opacity-20 disabled:pointer-events-none transition-colors"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveOrder(index, "down")}
                          disabled={index === links.length - 1}
                          aria-label="Move Down"
                          className="p-1 rounded bg-white/5 hover:bg-white/15 text-white/60 hover:text-white disabled:opacity-20 disabled:pointer-events-none transition-colors"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono text-white/30 ml-1">
                          #{link.display_order}
                        </span>
                      </div>
                    </td>

                    {/* Platform & Label */}
                    <td className="px-6 py-4 font-semibold text-white">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-cyan-400">
                          <SocialIcon platform={link.platform} icon={link.icon} className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{link.label}</div>
                          <div className="text-[11px] font-mono text-white/40 capitalize">
                            {link.platform}
                            {link.description && ` • ${link.description}`}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* URL */}
                    <td className="px-6 py-4">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-cyan-400 hover:underline inline-flex items-center gap-1.5 truncate max-w-xs"
                      >
                        <span className="truncate">{link.url}</span>
                        <ExternalLink className="w-3 h-3 shrink-0 opacity-70" />
                      </a>
                    </td>

                    {/* Status Toggle */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleEnabled(link)}
                        disabled={isPending}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                          link.enabled
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                            : "bg-white/5 text-white/40 border border-white/10 hover:bg-white/10"
                        }`}
                      >
                        {link.enabled ? "Visible" : "Hidden"}
                      </button>
                    </td>

                    {/* Edit / Delete */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(link)}
                          aria-label={`Edit ${link.label}`}
                          className="p-1.5 rounded-lg text-white/60 hover:text-cyan-400 hover:bg-cyan-400/10 transition-colors cursor-pointer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(link)}
                          aria-label={`Delete ${link.label}`}
                          className="p-1.5 rounded-lg text-white/60 hover:text-rose-400 hover:bg-rose-400/10 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AdminConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Social Link"
        message={`Are you sure you want to delete "${deleteTarget?.label}"? This will remove the link from public navigation.`}
        confirmText={isDeleting ? "Deleting..." : "Delete Link"}
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
