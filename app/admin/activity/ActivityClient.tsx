"use client";

import { useState } from "react";
import { Search, Filter, History, Code, Shield, User, Clock } from "lucide-react";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";

interface AuditLog {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  entity_name: string | null;
  metadata: any;
  created_at: string;
  user_id: string | null;
  profiles?: {
    full_name: string | null;
    role: string;
  } | null;
}

export function ActivityClient({ initialLogs }: { initialLogs: AuditLog[] }) {
  const [logs] = useState<AuditLog[]>(initialLogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [entityFilter, setEntityFilter] = useState("all");
  const [inspectLog, setInspectLog] = useState<AuditLog | null>(null);

  const actions = Array.from(new Set(logs.map((l) => l.action)));
  const entities = Array.from(new Set(logs.map((l) => l.entity_type)));

  const filtered = logs.filter((l) => {
    const matchesSearch =
      (l.entity_name && l.entity_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (l.entity_type && l.entity_type.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (l.profiles?.full_name && l.profiles.full_name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesAction = actionFilter === "all" || l.action === actionFilter;
    const matchesEntity = entityFilter === "all" || l.entity_type === entityFilter;
    return matchesSearch && matchesAction && matchesEntity;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search audit trail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/50"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-white/40" />
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50"
            >
              <option value="all" className="bg-[#081220]">All Actions</option>
              {actions.map((a) => (
                <option key={a} value={a} className="bg-[#081220] capitalize">
                  {a}
                </option>
              ))}
            </select>

            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50"
            >
              <option value="all" className="bg-[#081220]">All Entities</option>
              {entities.map((e) => (
                <option key={e} value={e} className="bg-[#081220]">
                  {e}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-xs text-white/40">
          Recorded Events: <span className="text-white font-mono">{logs.length}</span>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-2xl border border-white/10 bg-[#081220]/60 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/80">
            <thead className="bg-white/[0.02] border-b border-white/10 text-xs font-semibold text-white/60 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Entity</th>
                <th className="px-6 py-4">Actor</th>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-white/40">
                    No activity logs found.
                  </td>
                </tr>
              ) : (
                filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider font-mono ${
                          log.action === "delete"
                            ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            : log.action === "create"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : log.action === "publish"
                            ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                            : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">
                        {log.entity_name || log.entity_id || "—"}
                      </div>
                      <div className="text-xs text-white/40 font-mono">
                        {log.entity_type}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-white/90">
                        {log.profiles?.full_name || "System / Operator"}
                      </div>
                      {log.profiles?.role && (
                        <div className="text-[10px] text-cyan-400 font-mono capitalize">
                          {log.profiles.role}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-white/50 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setInspectLog(log)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white/70 hover:text-white transition-colors"
                      >
                        <Code className="w-3.5 h-3.5 text-cyan-400" />
                        Payload
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Metadata Inspector Modal */}
      {inspectLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-[#081220] border border-white/15 p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-cyan-400 font-mono uppercase tracking-wider">
                  Audit Record
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {inspectLog.action.toUpperCase()} : {inspectLog.entity_name || inspectLog.entity_type}
                </h3>
              </div>
              <button
                onClick={() => setInspectLog(null)}
                className="text-white/40 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-white/40 block">Entity Type:</span>
                <span className="text-white font-mono">{inspectLog.entity_type}</span>
              </div>
              <div>
                <span className="text-white/40 block">Entity ID:</span>
                <span className="text-white font-mono truncate block">{inspectLog.entity_id || "—"}</span>
              </div>
              <div>
                <span className="text-white/40 block">Actor:</span>
                <span className="text-white">{inspectLog.profiles?.full_name || inspectLog.user_id || "System"}</span>
              </div>
              <div>
                <span className="text-white/40 block">Timestamp:</span>
                <span className="text-white">{new Date(inspectLog.created_at).toLocaleString()}</span>
              </div>
            </div>

            <div>
              <span className="text-xs text-white/50 block mb-1 font-mono">
                Metadata Mutation Payload:
              </span>
              <pre className="p-4 rounded-xl bg-black/60 border border-white/10 text-cyan-300 font-mono text-xs overflow-x-auto max-h-64 leading-relaxed">
                {JSON.stringify(inspectLog.metadata, null, 2) || "{}"}
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setInspectLog(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
