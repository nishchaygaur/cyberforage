import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/security";
import { EXPLORATION_DOMAINS, ExplorationDomain } from "@/lib/constants/siteData";
import { Database } from "@/types/database";
import { logAuditEvent } from "./audit";
import { revalidatePath } from "next/cache";

export type ExplorationRow = Database["public"]["Tables"]["exploration_items"]["Row"];
export type ExplorationInsert = Database["public"]["Tables"]["exploration_items"]["Insert"];
export type ExplorationUpdate = Database["public"]["Tables"]["exploration_items"]["Update"];

export async function getExplorationItems(): Promise<ExplorationDomain[]> {
  try {
    const supabase = await createClient();
    if (!supabase) return EXPLORATION_DOMAINS;

    const { data: items, error } = await supabase
      .from("exploration_items")
      .select("*")
      .eq("published", true)
      .order("display_order", { ascending: true });

    if (error || !items || items.length === 0) {
      return EXPLORATION_DOMAINS;
    }

    return items.map((item) => ({
      title: item.title,
      description: item.description,
      icon: (item.icon as ExplorationDomain["icon"]) || "shield",
      accentColor: item.accent || "border-cyan-500/30 text-[#00F0C0]",
    }));
  } catch {
    return EXPLORATION_DOMAINS;
  }
}

export async function getAllExplorationItems(filters?: { search?: string; published?: boolean }) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  let query = supabase
    .from("exploration_items")
    .select("*", { count: "exact" })
    .order("display_order", { ascending: true });

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }
  if (typeof filters?.published === "boolean") {
    query = query.eq("published", filters.published);
  }

  const { data, count, error } = await query;
  if (error) throw error;
  return { items: data || [], total: count || 0 };
}

export async function getExplorationItemById(id: string) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data, error } = await supabase.from("exploration_items").select("*").eq("id", id).single();
  if (error) throw error;
  return data;
}

export async function createExplorationItem(item: ExplorationInsert) {
  await requireAdmin();
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data, error } = await supabase.from("exploration_items").insert(item).select().single();
  if (error) throw error;

  await logAuditEvent({
    action: "create",
    entityType: "exploration_item",
    entityId: data.id,
    entityName: data.title,
  });

  revalidatePath("/");
  return data;
}

export async function updateExplorationItem(id: string, updates: ExplorationUpdate) {
  await requireAdmin();
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data, error } = await supabase.from("exploration_items").update(updates).eq("id", id).select().single();
  if (error) throw error;

  await logAuditEvent({
    action: "update",
    entityType: "exploration_item",
    entityId: id,
    entityName: data.title,
    metadata: updates as Record<string, unknown>,
  });

  revalidatePath("/");
  return data;
}

export async function deleteExplorationItem(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data: item } = await supabase.from("exploration_items").select("title").eq("id", id).single();
  const { error } = await supabase.from("exploration_items").delete().eq("id", id);
  if (error) throw error;

  await logAuditEvent({
    action: "delete",
    entityType: "exploration_item",
    entityId: id,
    entityName: item?.title || id,
  });

  revalidatePath("/");
  return { success: true };
}
