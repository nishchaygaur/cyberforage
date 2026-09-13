"use client";

import { useState, useTransition } from "react";
import { Plus, Edit, Trash2, Menu, Save } from "lucide-react";
import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";
import { createNavAction, updateNavAction, deleteNavAction } from "@/app/admin/actions";
import { useRouter } from "next/navigation";

interface NavItem {
  id: string;
  label: string;
  url: string;
  location: "navbar" | "footer";
  is_external: boolean;
  enabled: boolean;
  display_order: number;
}

export function NavListClient({ initialItems }: { initialItems: any[] }) {
  const [items, setItems] = useState<NavItem[]>(initialItems);
  const [editingItem, setEditingItem] = useState<NavItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<NavItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [formState, setFormState] = useState<{
    label: string;
    url: string;
    location: "navbar" | "footer";
    is_external: boolean;
    display_order: number;
    enabled: boolean;
  }>({
    label: "",
    url: "/",
    location: "navbar",
    is_external: false,
    display_order: 0,
    enabled: true,
  });

  const handleOpenCreate = () => {
    setFormState({
      label: "",
      url: "/",
      location: "navbar",
      is_external: false,
      display_order: items.length + 1,
      enabled: true,
    });
    setIsCreating(true);
    setEditingItem(null);
  };

  const handleOpenEdit = (item: NavItem) => {
    setEditingItem(item);
    setFormState({
      label: item.label,
      url: item.url,
      location: item.location,
      is_external: item.is_external,
      display_order: item.display_order,
      enabled: item.enabled,
    });
    setIsCreating(false);
  };

  const handleToggleEnabled = (item: NavItem) => {
    const newEnabled = !item.enabled;
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, enabled: newEnabled } : i))
    );
    startTransition(async () => {
      try {
        const res = await updateNavAction(item.id, { enabled: newEnabled });
        if (res && !res.success) throw new Error(res.error || "Failed to update item.");
        router.refresh();
      } catch (err: any) {
        setErrorMessage(err.message || "Failed to update item.");
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
      if (editingItem) {
        const res = await updateNavAction(editingItem.id, formState);
        if (res && !res.success) throw new Error(res.error || "Failed to update item.");
        setItems((prev) =>
          prev.map((i) => (i.id === editingItem.id ? { ...i, ...formState } : i))
        );
      } else {
        const res = await createNavAction(formState);
        if (res && !res.success) throw new Error(res.error || "Failed to create item.");
        const created = res?.data;
        if (created) setItems((prev) => [...prev, created]);
      }
      setEditingItem(null);
      setIsCreating(false);
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to save navigation item.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await deleteNavAction(deleteTarget.id);
      if (res && !res.success) throw new Error(res.error || "Failed to delete item.");
      setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
      setDeleteTarget(null);
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to delete item.");
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
          Add Navigation Link
        </button>
      </div>

      {/* Editor Drawer */}
      {(isCreating || editingItem) && (
        <div className="p-6 rounded-2xl bg-[#081220] border border-cyan-400/20 shadow-[0_0_30px_rgba(6,182,212,0.1)] space-y-4">
          <h3 className="text-sm font-semibold text-white">
            {editingItem ? `Edit Link: ${editingItem.label}` : "New Navigation Link"}
          </h3>

          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1">Label Text</label>
              <input
                type="text"
                required
                value={formState.label}
                onChange={(e) => setFormState((p) => ({ ...p, label: e.target.value }))}
                placeholder="e.g. Research, Labs, Ecosystem"
                className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1">Placement Location</label>
              <select
                value={formState.location}
                onChange={(e) => setFormState((p) => ({ ...p, location: e.target.value as "navbar" | "footer" }))}
                className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50"
              >
                <option value="navbar" className="bg-[#081220]">Top Navbar</option>
                <option value="footer" className="bg-[#081220]">Footer Menu</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-white/70 mb-1">Target URL or Anchor</label>
              <input
                type="text"
                required
                value={formState.url}
                onChange={(e) => setFormState((p) => ({ ...p, url: e.target.value }))}
                placeholder="#research or /docs or https://..."
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

            <div className="flex items-center gap-6 pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formState.is_external}
                  onChange={(e) => setFormState((p) => ({ ...p, is_external: e.target.checked }))}
                  className="rounded border-white/20 bg-white/5 text-cyan-400 focus:ring-0"
                />
                <span className="text-xs text-white/90">External Link</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formState.enabled}
                  onChange={(e) => setFormState((p) => ({ ...p, enabled: e.target.checked }))}
                  className="rounded border-white/20 bg-white/5 text-cyan-400 focus:ring-0"
                />
                <span className="text-xs text-white/90">Visible</span>
              </label>
            </div>

            <div className="sm:col-span-2 flex justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  setEditingItem(null);
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

      {/* Table */}
      <div className="rounded-2xl border border-white/10 bg-[#081220]/60 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/80">
            <thead className="bg-white/[0.02] border-b border-white/10 text-xs font-semibold text-white/60 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Label</th>
                <th className="px-6 py-4">URL</th>
                <th className="px-6 py-4">Placement</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Order</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-white/40">
                    No navigation items configured.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <Menu className="w-4 h-4 text-cyan-400" />
                        {item.label}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-cyan-400/90">
                      {item.url}
                    </td>
                    <td className="px-6 py-4 text-xs capitalize text-white/60">
                      {item.location}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleEnabled(item)}
                        disabled={isPending}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                          item.enabled
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                            : "bg-white/5 text-white/40 border border-white/10 hover:bg-white/10"
                        }`}
                      >
                        {item.enabled ? "Visible" : "Hidden"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center text-white/50 text-xs font-mono">
                      {item.display_order}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-2 rounded-lg text-white/60 hover:text-cyan-400 hover:bg-cyan-400/10 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(item)}
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
        title="Delete Navigation Item"
        message={`Delete link "${deleteTarget?.label}"?`}
        confirmText="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
