"use client";

import { useState, useTransition } from "react";
import { Plus, Edit, Trash2, Globe, ExternalLink, Save } from "lucide-react";
import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";
import {
  createSocialAction,
  updateSocialAction,
  deleteSocialAction,
} from "@/app/admin/actions";
import { useRouter } from "next/navigation";

interface SocialLink {
  id: string;
  platform: string;
  label: string;
  url: string;
  icon: string | null;
  enabled: boolean;
  display_order: number;
}

export function SocialListClient({ initialLinks }: { initialLinks: SocialLink[] }) {
  const [links, setLinks] = useState<SocialLink[]>(initialLinks);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SocialLink | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [formState, setFormState] = useState({
    platform: "github",
    label: "GitHub",
    url: "https://github.com/...",
    icon: "github",
    display_order: 0,
    enabled: true,
  });

  const handleOpenCreate = () => {
    setFormState({
      platform: "github",
      label: "",
      url: "https://",
      icon: "github",
      display_order: links.length + 1,
      enabled: true,
    });
    setIsCreating(true);
    setEditingLink(null);
  };

  const handleOpenEdit = (link: SocialLink) => {
    setEditingLink(link);
    setFormState({
      platform: link.platform,
      label: link.label,
      url: link.url,
      icon: link.icon || "",
      display_order: link.display_order,
      enabled: link.enabled,
    });
    setIsCreating(false);
  };

  const handleToggleEnabled = (link: SocialLink) => {
    const newEnabled = !link.enabled;
    setLinks((prev) =>
      prev.map((l) => (l.id === link.id ? { ...l, enabled: newEnabled } : l))
    );
    startTransition(async () => {
      try {
        await updateSocialAction(link.id, { enabled: newEnabled });
        router.refresh();
      } catch (err: any) {
        setErrorMessage(err.message || "Failed to update link.");
      }
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.label.trim() || !formState.url.trim()) {
      setErrorMessage("Please enter both Label and URL.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      if (editingLink) {
        await updateSocialAction(editingLink.id, formState);
        setLinks((prev) =>
          prev.map((l) => (l.id === editingLink.id ? { ...l, ...formState } : l))
        );
      } else {
        const created = await createSocialAction(formState);
        if (created) setLinks((prev) => [...prev, created]);
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
    try {
      await deleteSocialAction(deleteTarget.id);
      setLinks((prev) => prev.filter((l) => l.id !== deleteTarget.id));
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
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          {errorMessage}
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-[#040810] font-semibold text-sm hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Social Link
        </button>
      </div>

      {/* Editor Modal / Drawer */}
      {(isCreating || editingLink) && (
        <div className="p-6 rounded-2xl bg-[#081220] border border-cyan-400/20 shadow-[0_0_30px_rgba(6,182,212,0.1)] space-y-4">
          <h3 className="text-sm font-semibold text-white">
            {editingLink ? `Edit Link: ${editingLink.label}` : "New Social Link"}
          </h3>

          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1">Platform</label>
              <input
                type="text"
                required
                value={formState.platform}
                onChange={(e) => setFormState((p) => ({ ...p, platform: e.target.value }))}
                placeholder="e.g. github, twitter, discord"
                className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1">Label Text</label>
              <input
                type="text"
                required
                value={formState.label}
                onChange={(e) => setFormState((p) => ({ ...p, label: e.target.value }))}
                placeholder="e.g. GitHub"
                className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-white/70 mb-1">Destination URL</label>
              <input
                type="url"
                required
                value={formState.url}
                onChange={(e) => setFormState((p) => ({ ...p, url: e.target.value }))}
                placeholder="https://github.com/..."
                className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1">Display Order</label>
              <input
                type="number"
                value={formState.display_order}
                onChange={(e) =>
                  setFormState((p) => ({ ...p, display_order: parseInt(e.target.value) || 0 }))
                }
                className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-cyan-400/50"
              />
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formState.enabled}
                  onChange={(e) => setFormState((p) => ({ ...p, enabled: e.target.checked }))}
                  className="rounded border-white/20 bg-white/5 text-cyan-400 focus:ring-0"
                />
                <span className="text-sm text-white/90">Visible on Site</span>
              </label>
            </div>

            <div className="sm:col-span-2 flex justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  setEditingLink(null);
                  setIsCreating(false);
                }}
                className="px-4 py-2 rounded-xl bg-white/5 text-white/70 text-xs hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-cyan-400 text-[#040810] font-semibold text-xs hover:bg-cyan-300 transition-colors disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                {isSubmitting ? "Saving..." : "Save Link"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Links List */}
      <div className="rounded-2xl border border-white/10 bg-[#081220]/60 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/80">
            <thead className="bg-white/[0.02] border-b border-white/10 text-xs font-semibold text-white/60 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Platform & Label</th>
                <th className="px-6 py-4">URL</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Order</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {links.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-white/40">
                    No social links configured.
                  </td>
                </tr>
              ) : (
                links.map((link) => (
                  <tr key={link.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-cyan-400" />
                        {link.label}
                      </div>
                      <div className="text-xs text-white/40 capitalize">{link.platform}</div>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-cyan-400 hover:underline flex items-center gap-1 truncate max-w-xs"
                      >
                        {link.url}
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleEnabled(link)}
                        disabled={isPending}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                          link.enabled
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                            : "bg-white/5 text-white/40 border border-white/10 hover:bg-white/10"
                        }`}
                      >
                        {link.enabled ? "Enabled" : "Hidden"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center text-white/50 text-xs font-mono">
                      {link.display_order}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(link)}
                          className="p-2 rounded-lg text-white/60 hover:text-cyan-400 hover:bg-cyan-400/10 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(link)}
                          className="p-2 rounded-lg text-white/60 hover:text-rose-400 hover:bg-rose-400/10 transition-colors"
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
        message={`Delete link "${deleteTarget?.label}"?`}
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
