"use client";

import { useState, useTransition } from "react";
import { Search, Filter, Mail, Trash2, Eye, Calendar, Building, CheckCircle, Clock } from "lucide-react";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";
import { updateSubmissionStatusAction, deleteSubmissionAction } from "@/app/admin/actions";
import { ContactSubmissionStatus } from "@/types/database";
import { useRouter } from "next/navigation";

interface Submission {
  id: string;
  name: string;
  email: string;
  organization: string | null;
  subject: string | null;
  message: string;
  status: ContactSubmissionStatus;
  created_at: string;
  ip_address?: string | null;
  user_agent?: string | null;
}

export function SubmissionsClient({ initialSubmissions }: { initialSubmissions: Submission[] }) {
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeMessage, setActiveMessage] = useState<Submission | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Submission | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const filtered = submissions.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.organization && s.organization.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (sub: Submission, newStatus: ContactSubmissionStatus) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === sub.id ? { ...s, status: newStatus } : s))
    );
    if (activeMessage && activeMessage.id === sub.id) {
      setActiveMessage({ ...activeMessage, status: newStatus });
    }
    startTransition(async () => {
      try {
        const res = await updateSubmissionStatusAction(sub.id, newStatus);
        if (res && !res.success) throw new Error(res.error || "Failed to update submission status.");
        router.refresh();
      } catch (err: any) {
        setErrorMessage(err.message || "Failed to update submission status.");
      }
    });
  };

  const handleView = (sub: Submission) => {
    setActiveMessage(sub);
    // Auto-mark as read if newly opened
    if (sub.status === "new") {
      handleStatusChange(sub, "read");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setErrorMessage("");
    try {
      const res = await deleteSubmissionAction(deleteTarget.id);
      if (res && !res.success) throw new Error(res.error || "Failed to delete submission.");
      setSubmissions((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      if (activeMessage?.id === deleteTarget.id) {
        setActiveMessage(null);
      }
      setDeleteTarget(null);
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to delete submission.");
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

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search incoming inquiries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/50"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-white/40" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50"
            >
              <option value="all" className="bg-[#081220]">All Statuses</option>
              <option value="new" className="bg-[#081220]">New Inquiries</option>
              <option value="read" className="bg-[#081220]">Read</option>
              <option value="replied" className="bg-[#081220]">Replied</option>
              <option value="archived" className="bg-[#081220]">Archived</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-white/50 self-center">
          Total Submissions: <span className="text-white font-mono">{submissions.length}</span>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/10 bg-[#081220]/60 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/80">
            <thead className="bg-white/[0.02] border-b border-white/10 text-xs font-semibold text-white/60 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Sender & Org</th>
                <th className="px-6 py-4">Subject & Preview</th>
                <th className="px-6 py-4">Received</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-white/40">
                    No submissions found.
                  </td>
                </tr>
              ) : (
                filtered.map((sub) => (
                  <tr
                    key={sub.id}
                    className={`hover:bg-white/[0.02] transition-colors ${
                      sub.status === "new" ? "bg-cyan-500/[0.03]" : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-white flex items-center gap-2">
                        {sub.name}
                        {sub.status === "new" && (
                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        )}
                      </div>
                      <div className="text-xs text-white/50">{sub.email}</div>
                      {sub.organization && (
                        <div className="text-[11px] text-white/40 flex items-center gap-1 mt-0.5">
                          <Building className="w-3 h-3" />
                          {sub.organization}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {sub.subject && (
                        <div className="font-medium text-white/90 text-xs mb-0.5 truncate max-w-sm">
                          {sub.subject}
                        </div>
                      )}
                      <div className="text-xs text-white/40 truncate max-w-md">
                        {sub.message}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-white/50 whitespace-nowrap">
                      {new Date(sub.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <select
                        value={sub.status}
                        onChange={(e) =>
                          handleStatusChange(sub, e.target.value as ContactSubmissionStatus)
                        }
                        className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400/50"
                      >
                        <option value="new" className="bg-[#081220]">New</option>
                        <option value="read" className="bg-[#081220]">Read</option>
                        <option value="replied" className="bg-[#081220]">Replied</option>
                        <option value="archived" className="bg-[#081220]">Archived</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleView(sub)}
                          className="p-2 rounded-lg text-white/60 hover:text-cyan-400 hover:bg-cyan-400/10 transition-colors"
                          title="View Message"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(sub)}
                          className="p-2 rounded-lg text-white/60 hover:text-rose-400 hover:bg-rose-400/10 transition-colors"
                          title="Delete Submission"
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

      {/* Message Detail Modal */}
      {activeMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-[#081220] border border-white/15 p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-cyan-400 font-mono">
                  Inquiry Details
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  {activeMessage.subject || "No Subject"}
                </h3>
              </div>
              <button
                onClick={() => setActiveMessage(null)}
                className="text-white/40 hover:text-white transition-colors text-lg"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
              <div>
                <span className="text-white/40 block">From</span>
                <span className="text-white font-medium">{activeMessage.name}</span>
                <a
                  href={`mailto:${activeMessage.email}`}
                  className="text-cyan-400 block hover:underline mt-0.5"
                >
                  {activeMessage.email}
                </a>
              </div>
              <div>
                <span className="text-white/40 block">Organization</span>
                <span className="text-white">{activeMessage.organization || "Independent / Unspecified"}</span>
              </div>
              <div>
                <span className="text-white/40 block">Received</span>
                <span className="text-white">
                  {new Date(activeMessage.created_at).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-white/40 block">Current Status</span>
                <span className="text-white capitalize">{activeMessage.status}</span>
              </div>
            </div>

            <div>
              <span className="text-xs text-white/50 block mb-2 font-medium">Message Body:</span>
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-white/90 text-sm whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                {activeMessage.message}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <a
                href={`mailto:${activeMessage.email}?subject=Re: ${encodeURIComponent(
                  activeMessage.subject || "Cyberforage Advisory"
                )}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold hover:bg-cyan-500/20 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                Reply via Email
              </a>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStatusChange(activeMessage, "replied")}
                  className="px-3 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs hover:bg-emerald-500/20 transition-colors"
                >
                  Mark Replied
                </button>
                <button
                  onClick={() => setActiveMessage(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-white/70 text-xs hover:bg-white/10 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <AdminConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Inquiry"
        message={`Delete inquiry from "${deleteTarget?.name}"? This record will be permanently purged.`}
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
