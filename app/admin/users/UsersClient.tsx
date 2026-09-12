"use client";

import { useState, useTransition } from "react";
import { Users, Shield, UserCheck, UserX, AlertTriangle, KeyRound } from "lucide-react";
import { updateUserRoleAction, toggleUserStatusAction } from "@/app/admin/actions";
import { UserRole } from "@/types/database";
import { useRouter } from "next/navigation";

interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export function UsersClient({
  initialUsers,
  currentUserRole,
}: {
  initialUsers: UserProfile[];
  currentUserRole: UserRole | null;
}) {
  const [users, setUsers] = useState<UserProfile[]>(initialUsers);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const isSuperAdmin = currentUserRole === "super_admin";

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    if (!isSuperAdmin) {
      setErrorMessage("Only Super Admins can alter role privileges.");
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");

    startTransition(async () => {
      try {
        await updateUserRoleAction(userId, newRole);
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
        setSuccessMessage("User role updated.");
        router.refresh();
      } catch (err: any) {
        setErrorMessage(err.message || "Failed to update user role.");
      }
    });
  };

  const handleToggleActive = (userId: string, currentActive: boolean) => {
    if (!isSuperAdmin) {
      setErrorMessage("Only Super Admins can modify account access state.");
      return;
    }

    const nextActive = !currentActive;
    setErrorMessage("");
    setSuccessMessage("");

    startTransition(async () => {
      try {
        await toggleUserStatusAction(userId, nextActive);
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, is_active: nextActive } : u))
        );
        setSuccessMessage(`User account ${nextActive ? "activated" : "deactivated"}.`);
        router.refresh();
      } catch (err: any) {
        setErrorMessage(err.message || "Failed to update account status.");
      }
    });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
          {successMessage}
        </div>
      )}

      {!isSuperAdmin && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
          Role elevation & account deactivation is restricted to Super Admins only.
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-[#081220]/60 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/80">
            <thead className="bg-white/[0.02] border-b border-white/10 text-xs font-semibold text-white/60 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Assigned Role</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-white/40">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 font-bold text-xs">
                          {user.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div>
                          <div className="font-semibold text-white">
                            {user.full_name || "Unnamed Operator"}
                          </div>
                          <div className="text-[11px] font-mono text-white/40 truncate max-w-xs">
                            {user.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {isSuperAdmin ? (
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                          disabled={isPending}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400/50"
                        >
                          <option value="super_admin" className="bg-[#081220]">Super Admin</option>
                          <option value="admin" className="bg-[#081220]">Admin</option>
                          <option value="editor" className="bg-[#081220]">Editor</option>
                        </select>
                      ) : (
                        <span className="capitalize text-xs text-white/80">{user.role}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          user.is_active
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        {user.is_active ? "Active" : "Deactivated"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-white/40 whitespace-nowrap">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {isSuperAdmin && (
                        <button
                          onClick={() => handleToggleActive(user.id, user.is_active)}
                          disabled={isPending}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                            user.is_active
                              ? "bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20"
                              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                          }`}
                        >
                          {user.is_active ? "Deactivate" : "Activate"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
