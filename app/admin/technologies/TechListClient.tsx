"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, Cpu } from "lucide-react";
import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";
import { updateTechAction, deleteTechAction } from "@/app/admin/actions";
import { useRouter } from "next/navigation";

interface Tech {
  id: string;
  name: string;
  category: string;
  description: string | null;
  icon: string | null;
  enabled: boolean;
  display_order: number;
}

export function TechListClient({ initialTechs }: { initialTechs: Tech[] }) {
  const [techs, setTechs] = useState<Tech[]>(initialTechs);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Tech | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const filtered = techs.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleEnabled = (tech: Tech) => {
    const newEnabled = !tech.enabled;
    setTechs((prev) =>
      prev.map((t) => (t.id === tech.id ? { ...t, enabled: newEnabled } : t))
    );
    startTransition(async () => {
      try {
        await updateTechAction(tech.id, { enabled: newEnabled });
        router.refresh();
      } catch (err: any) {
        setErrorMessage(err.message || "Failed to update technology status.");
        setTechs((prev) =>
          prev.map((t) => (t.id === tech.id ? { ...t, enabled: !newEnabled } : t))
        );
      }
    });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setErrorMessage("");
    try {
      await deleteTechAction(deleteTarget.id);
      setTechs((prev) => prev.filter((t) => t.id !== deleteTarget.id));
      setDeleteTarget(null);
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to delete technology.");
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
            placeholder="Search technologies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/50"
          />
        </div>

        <Link
          href="/admin/technologies/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-[#040810] font-semibold text-sm hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Technology
        </Link>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/10 bg-[#081220]/60 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/80">
            <thead className="bg-white/[0.02] border-b border-white/10 text-xs font-semibold text-white/60 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Technology</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Icon</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Order</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-white/40">
                    No technologies found.
                  </td>
                </tr>
              ) : (
                filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
                        {t.name}
                      </div>
                      {t.description && (
                        <div className="text-xs text-white/40 max-w-sm truncate mt-0.5">
                          {t.description}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-white/60 text-xs">
                      {t.category}
                    </td>
                    <td className="px-6 py-4 text-white/50 text-xs font-mono">
                      {t.icon || "—"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleEnabled(t)}
                        disabled={isPending}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                          t.enabled
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                            : "bg-white/5 text-white/40 border border-white/10 hover:bg-white/10"
                        }`}
                      >
                        {t.enabled ? "Active" : "Disabled"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center text-white/50 text-xs font-mono">
                      {t.display_order}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/technologies/${t.id}`}
                          className="p-2 rounded-lg text-white/60 hover:text-cyan-400 hover:bg-cyan-400/10 transition-colors"
                          title="Edit technology"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(t)}
                          className="p-2 rounded-lg text-white/60 hover:text-rose-400 hover:bg-rose-400/10 transition-colors"
                          title="Delete technology"
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
        title="Delete Technology"
        message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
