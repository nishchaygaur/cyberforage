import { createClient } from "@/lib/supabase/server";
import { Database, AuditAction } from "@/types/database";

export interface LogAuditParams {
  action: AuditAction;
  entityType: string;
  entityId?: string | null;
  entityName?: string | null;
  metadata?: Record<string, unknown> | null;
  userId?: string | null;
}

export async function logAuditEvent(params: LogAuditParams) {
  const supabase = await createClient();
  if (!supabase) return { error: "Supabase unconfigured" };

  try {
    let resolvedUserId = params.userId;
    if (!resolvedUserId) {
      const { data: authData } = await supabase.auth.getUser();
      resolvedUserId = authData?.user?.id || null;
    }

    const { error } = await supabase.from("audit_logs").insert({
      action: params.action,
      entity_type: params.entityType,
      entity_id: params.entityId || null,
      entity_name: params.entityName || null,
      metadata: (params.metadata || {}) as Database["public"]["Tables"]["audit_logs"]["Insert"]["metadata"],
      user_id: resolvedUserId,
    });

    if (error) {
      console.error("Failed to insert audit log:", error.message);
      return { error: error.message };
    }
    return { success: true };
  } catch (err) {
    console.error("Audit logging exception:", err);
    return { error: "Unexpected audit logging error" };
  }
}

export async function getAuditLogs(filters?: {
  limit?: number;
  offset?: number;
  action?: string;
  entityType?: string;
}) {
  const supabase = await createClient();
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const limit = filters?.limit || 50;
  const offset = filters?.offset || 0;

  let query = supabase
    .from("audit_logs")
    .select("*, profiles:user_id(full_name, role)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (filters?.action && filters.action !== "all") {
    query = query.eq("action", filters.action as AuditAction);
  }
  if (filters?.entityType && filters.entityType !== "all") {
    query = query.eq("entity_type", filters.entityType);
  }

  const { data, count, error } = await query;
  if (error) throw error;

  return { logs: data || [], total: count || 0 };
}
