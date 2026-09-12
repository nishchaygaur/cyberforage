import { createClient } from "@/lib/supabase/server";
import { Database, UserRole } from "@/types/database";
import { logAuditEvent } from "./audit";

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export async function getAllUsers(filters?: { role?: string; search?: string }) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  // Verify caller is super_admin
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) throw new Error("Unauthorized");

  const { data: callerProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", authData.user.id)
    .single();

  if (callerProfile?.role !== "super_admin") {
    throw new Error("Forbidden: Super Admin access required.");
  }

  let query = supabase
    .from("profiles")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (filters?.role && filters.role !== "all") {
    query = query.eq("role", filters.role as UserRole);
  }
  if (filters?.search) {
    query = query.or(`full_name.ilike.%${filters.search}%`);
  }

  const { data, count, error } = await query;
  if (error) throw error;
  return { users: data || [], total: count || 0 };
}

export async function updateUserRole(targetUserId: string, newRole: UserRole) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) throw new Error("Unauthorized");

  // Verify caller
  const { data: callerProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", authData.user.id)
    .single();

  if (callerProfile?.role !== "super_admin") {
    throw new Error("Forbidden: Only Super Admins can update roles.");
  }

  // Prevent demoting the last active super admin
  const { data: targetProfile } = await supabase
    .from("profiles")
    .select("role, full_name, is_active")
    .eq("id", targetUserId)
    .single();

  if (targetProfile?.role === "super_admin" && newRole !== "super_admin") {
    const { count } = await supabase
      .from("profiles")
      .select("id", { count: "exact" })
      .eq("role", "super_admin")
      .eq("is_active", true);

    if ((count || 0) <= 1) {
      throw new Error("Operation blocked: Cannot demote the last active Super Admin.");
    }
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({ role: newRole })
    .eq("id", targetUserId)
    .select()
    .single();

  if (error) throw error;

  await logAuditEvent({
    action: "role_change",
    entityType: "profile",
    entityId: targetUserId,
    entityName: targetProfile?.full_name || targetUserId,
    metadata: { old_role: targetProfile?.role, new_role: newRole },
  });

  return data;
}

export async function getCurrentUserProfile() {
  try {
    const supabase = await createClient();
    if (!supabase) return null;
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) return null;
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authData.user.id)
      .single();
    return profile || null;
  } catch {
    return null;
  }
}

export async function toggleUserActive(targetUserId: string, is_active: boolean) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) throw new Error("Unauthorized");

  const { data: callerProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", authData.user.id)
    .single();

  if (callerProfile?.role !== "super_admin") {
    throw new Error("Forbidden: Only Super Admins can deactivate users.");
  }

  const { data: targetProfile } = await supabase
    .from("profiles")
    .select("role, full_name, is_active")
    .eq("id", targetUserId)
    .single();

  if (targetProfile?.role === "super_admin" && !is_active) {
    const { count } = await supabase
      .from("profiles")
      .select("id", { count: "exact" })
      .eq("role", "super_admin")
      .eq("is_active", true);

    if ((count || 0) <= 1) {
      throw new Error("Operation blocked: Cannot deactivate the last active Super Admin.");
    }
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({ is_active })
    .eq("id", targetUserId)
    .select()
    .single();

  if (error) throw error;

  await logAuditEvent({
    action: "update",
    entityType: "profile",
    entityId: targetUserId,
    entityName: targetProfile?.full_name || targetUserId,
    metadata: { is_active },
  });

  return data;
}
