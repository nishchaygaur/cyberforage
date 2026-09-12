"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, Compass } from "lucide-react";
import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";
import { updateExplorationAction, deleteExplorationAction } from "@/app/admin/actions";
import { useRouter } from "next/navigation";

interface ExplorationItem {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  accent_color: string;
  enabled: boolean;
  display_order: number;
}

export function ExplorationListClient({ initialItems }: { initialItems: ExplorationItem[] }) {
  const [items, setItems] = useState<ExplorationItem[]>(initialItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<ExplorationItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const filtered = items.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleEnabled = (item: ExplorationItem) => {
    const newEnabled = !item.enabled;
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, enabled: newEnabled } : i))
    );
    startTransition(async () => {
      try {
        await updateExplorationAction(item.id, { enabled: newEnabled });
        router.refresh();
      } catch (err: any) {
        setErrorMessage(err.message || "Failed to update item status.");
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, enabled: !newEnabled } : i))
        );
      }
    });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setErrorMessage("");
    try {
      await deleteExplorationAction(deleteTarget.id);
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
    <div className="space-y-6">
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          {errorMessage}
        </div>
      )}

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search exploration areas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/50"
          />
        </div>

        <Link
          href="/admin/exploration/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-[#040810] font-semibold text-sm hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Exploration Area
        </Link>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/10 bg-[#081220]/60 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/80">
            <thead className="bg-white/[0.02] border-b border-white/10 text-xs font-semibold text-white/60 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Area / Title</th>
                <th className="px-6 py-4">Accent</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Order</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-white/40">
                    No exploration areas found.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <Compass className="w-4 h-4 text-cyan-400 shrink-0" />
                        {item.title}
                      </div>
                      <div className="text-xs text-white/40 max-w-md truncate mt-0.5">
                        {item.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white/60 text-xs capitalize">
                      <span className={`px-2 py-0.5 rounded text-[11px] ${
                        item.accent_color === "purple"
                          ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                          : item.accent_color === "rose"
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                      }`}>
                        {item.accent_color}
                      </span>
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
                        {item.enabled ? "Active" : "Disabled"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center text-white/50 text-xs font-mono">
                      {item.display_order}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/exploration/${item.id}`}
                          className="p-2 rounded-lg text-white/60 hover:text-cyan-400 hover:bg-cyan-400/10 transition-colors"
                          title="Edit area"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(item)}
                          className="p-2 rounded-lg text-white/60 hover:text-rose-400 hover:bg-rose-400/10 transition-colors"
                          title="Delete area"
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
        title="Delete Exploration Area"
        message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
