import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/security";
import { AVAILABLE_LABS, LabItem } from "@/lib/constants/siteData";
import { Database, LabStatus } from "@/types/database";
import { logAuditEvent } from "./audit";
import { revalidatePath } from "next/cache";

export type LabRow = Database["public"]["Tables"]["labs"]["Row"];
export type LabInsert = Database["public"]["Tables"]["labs"]["Insert"];
export type LabUpdate = Database["public"]["Tables"]["labs"]["Update"];

export async function getPublishedLabs(): Promise<LabItem[]> {
  try {
    const supabase = await createClient();
    if (!supabase) return AVAILABLE_LABS;

    const { data: labs, error } = await supabase
      .from("labs")
      .select("*")
      .eq("published", true)
      .order("display_order", { ascending: true });

    if (error || !labs || labs.length === 0) {
      return AVAILABLE_LABS;
    }

    return labs.map((l) => ({
      name: l.name,
      category: l.category || "Security",
      iconType: (l.icon as "cube" | "shield" | "search" | "bug" | "network") || "shield",
      accent: "cyan" as const,
    }));
  } catch {
    return AVAILABLE_LABS;
  }
}

export async function getPublishedLabRows(): Promise<LabRow[]> {
  try {
    const supabase = await createClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("labs")
      .select("*")
      .eq("published", true)
      .order("display_order", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("getPublishedLabRows error:", err);
    return [];
  }
}

export async function getAllLabs(filters?: { search?: string; status?: string; published?: boolean }) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  let query = supabase
    .from("labs")
    .select("*", { count: "exact" })
    .order("display_order", { ascending: true });

  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }
  if (filters?.status && filters.status !== "all") {
    query = query.eq("status", filters.status as LabStatus);
  }
  if (typeof filters?.published === "boolean") {
    query = query.eq("published", filters.published);
  }

  const { data, count, error } = await query;
  if (error) throw error;
  return { labs: data || [], total: count || 0 };
}

export async function getLabById(id: string) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data, error } = await supabase.from("labs").select("*").eq("id", id).single();
  if (error) throw error;
  return data;
}

export async function createLab(lab: LabInsert) {
  await requireAdmin();
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data, error } = await supabase.from("labs").insert(lab).select().single();
  if (error) throw error;

  await logAuditEvent({
    action: "create",
    entityType: "lab",
    entityId: data.id,
    entityName: data.name,
    metadata: { slug: data.slug, status: data.status },
  });

  revalidatePath("/");
  revalidatePath("/labs");
  return data;
}

export async function updateLab(id: string, updates: LabUpdate) {
  await requireAdmin();
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data, error } = await supabase.from("labs").update(updates).eq("id", id).select().single();
  if (error) throw error;

  await logAuditEvent({
    action: "update",
    entityType: "lab",
    entityId: id,
    entityName: data.name,
    metadata: updates as Record<string, unknown>,
  });

  revalidatePath("/");
  revalidatePath("/labs");
  return data;
}

export async function deleteLab(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data: lab } = await supabase.from("labs").select("name").eq("id", id).single();
  const { error } = await supabase.from("labs").delete().eq("id", id);
  if (error) throw error;

  await logAuditEvent({
    action: "delete",
    entityType: "lab",
    entityId: id,
    entityName: lab?.name || id,
  });

  revalidatePath("/");
  revalidatePath("/labs");
  return { success: true };
}
