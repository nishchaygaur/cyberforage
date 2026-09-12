import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/security";
import { NAV_ITEMS, NavItem } from "@/lib/constants/siteData";
import { Database } from "@/types/database";
import { logAuditEvent } from "./audit";
import { revalidatePath } from "next/cache";

export type NavigationRow = Database["public"]["Tables"]["navigation_items"]["Row"];
export type NavigationInsert = Database["public"]["Tables"]["navigation_items"]["Insert"];
export type NavigationUpdate = Database["public"]["Tables"]["navigation_items"]["Update"];

export async function getNavigationItems(location: "navbar" | "footer" = "navbar"): Promise<NavItem[]> {
  try {
    const supabase = await createClient();
    if (!supabase) return NAV_ITEMS;

    const { data: items, error } = await supabase
      .from("navigation_items")
      .select("*")
      .eq("location", location)
      .eq("enabled", true)
      .order("display_order", { ascending: true });

    if (error || !items || items.length === 0) {
      return NAV_ITEMS;
    }

    return items.map((item) => ({
      label: item.label,
      href: item.url,
    }));
  } catch {
    return NAV_ITEMS;
  }
}

export async function getAllNavigationItems(location?: "navbar" | "footer") {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  let query = supabase
    .from("navigation_items")
    .select("*")
    .order("location", { ascending: true })
    .order("display_order", { ascending: true });

  if (location) {
    query = query.eq("location", location);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function createNavigationItem(item: NavigationInsert) {
  await requireAdmin();
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data, error } = await supabase.from("navigation_items").insert(item).select().single();
  if (error) throw error;

  await logAuditEvent({
    action: "create",
    entityType: "navigation_item",
    entityId: data.id,
    entityName: `${data.location}:${data.label}`,
  });

  revalidatePath("/");
  return data;
}

export async function updateNavigationItem(id: string, updates: NavigationUpdate) {
  await requireAdmin();
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data, error } = await supabase.from("navigation_items").update(updates).eq("id", id).select().single();
  if (error) throw error;

  await logAuditEvent({
    action: "update",
    entityType: "navigation_item",
    entityId: id,
    entityName: data.label,
    metadata: updates as Record<string, unknown>,
  });

  revalidatePath("/");
  return data;
}

export async function deleteNavigationItem(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data: item } = await supabase.from("navigation_items").select("label, location").eq("id", id).single();
  const { error } = await supabase.from("navigation_items").delete().eq("id", id);
  if (error) throw error;

  await logAuditEvent({
    action: "delete",
    entityType: "navigation_item",
    entityId: id,
    entityName: item?.label || id,
  });

  revalidatePath("/");
  return { success: true };
}
