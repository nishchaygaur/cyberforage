import { createClient } from "@/lib/supabase/server";
import { TECHNOLOGIES, TechItem } from "@/lib/constants/siteData";
import { Database } from "@/types/database";
import { logAuditEvent } from "./audit";
import { revalidatePath } from "next/cache";

export type TechRow = Database["public"]["Tables"]["technologies"]["Row"];
export type TechInsert = Database["public"]["Tables"]["technologies"]["Insert"];
export type TechUpdate = Database["public"]["Tables"]["technologies"]["Update"];

export async function getEnabledTechnologies(): Promise<TechItem[]> {
  try {
    const supabase = await createClient();
    if (!supabase) return TECHNOLOGIES;

    const { data: techs, error } = await supabase
      .from("technologies")
      .select("*")
      .eq("enabled", true)
      .order("display_order", { ascending: true });

    if (error || !techs || techs.length === 0) {
      return TECHNOLOGIES;
    }

    return techs.map((t) => ({
      name: t.name,
      category: t.category,
    }));
  } catch {
    return TECHNOLOGIES;
  }
}

export async function getAllTechnologies(filters?: { search?: string; enabled?: boolean }) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  let query = supabase
    .from("technologies")
    .select("*", { count: "exact" })
    .order("display_order", { ascending: true });

  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,category.ilike.%${filters.search}%`);
  }
  if (typeof filters?.enabled === "boolean") {
    query = query.eq("enabled", filters.enabled);
  }

  const { data, count, error } = await query;
  if (error) throw error;
  return { technologies: data || [], total: count || 0 };
}

export async function getTechnologyById(id: string) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data, error } = await supabase.from("technologies").select("*").eq("id", id).single();
  if (error) throw error;
  return data;
}

export async function createTechnology(tech: TechInsert) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data, error } = await supabase.from("technologies").insert(tech).select().single();
  if (error) throw error;

  await logAuditEvent({
    action: "create",
    entityType: "technology",
    entityId: data.id,
    entityName: data.name,
  });

  revalidatePath("/");
  return data;
}

export async function updateTechnology(id: string, updates: TechUpdate) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data, error } = await supabase.from("technologies").update(updates).eq("id", id).select().single();
  if (error) throw error;

  await logAuditEvent({
    action: "update",
    entityType: "technology",
    entityId: id,
    entityName: data.name,
    metadata: updates as Record<string, unknown>,
  });

  revalidatePath("/");
  return data;
}

export async function deleteTechnology(id: string) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data: tech } = await supabase.from("technologies").select("name").eq("id", id).single();
  const { error } = await supabase.from("technologies").delete().eq("id", id);
  if (error) throw error;

  await logAuditEvent({
    action: "delete",
    entityType: "technology",
    entityId: id,
    entityName: tech?.name || id,
  });

  revalidatePath("/");
  return { success: true };
}
