import { createClient } from "@/lib/supabase/server";
import { SOCIAL_LINKS } from "@/lib/constants/siteData";
import { Database } from "@/types/database";
import { logAuditEvent } from "./audit";
import { revalidatePath } from "next/cache";

export type SocialRow = Database["public"]["Tables"]["social_links"]["Row"];
export type SocialInsert = Database["public"]["Tables"]["social_links"]["Insert"];
export type SocialUpdate = Database["public"]["Tables"]["social_links"]["Update"];

export async function getSocialLinks(): Promise<{ github: string; linkedin: string }> {
  try {
    const supabase = await createClient();
    if (!supabase) return SOCIAL_LINKS;

    const { data: links, error } = await supabase
      .from("social_links")
      .select("*")
      .eq("enabled", true)
      .order("display_order", { ascending: true });

    if (error || !links || links.length === 0) {
      return SOCIAL_LINKS;
    }

    const map: Record<string, string> = {};
    links.forEach((l) => {
      map[l.platform.toLowerCase()] = l.url;
    });

    return {
      github: map.github || SOCIAL_LINKS.github,
      linkedin: map.linkedin || SOCIAL_LINKS.linkedin,
    };
  } catch {
    return SOCIAL_LINKS;
  }
}

export async function getAllSocialLinks() {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data, error } = await supabase
    .from("social_links")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function createSocialLink(link: SocialInsert) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data, error } = await supabase.from("social_links").insert(link).select().single();
  if (error) throw error;

  await logAuditEvent({
    action: "create",
    entityType: "social_link",
    entityId: data.id,
    entityName: data.label,
  });

  revalidatePath("/");
  return data;
}

export async function updateSocialLink(id: string, updates: SocialUpdate) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data, error } = await supabase.from("social_links").update(updates).eq("id", id).select().single();
  if (error) throw error;

  await logAuditEvent({
    action: "update",
    entityType: "social_link",
    entityId: id,
    entityName: data.label,
    metadata: updates as Record<string, unknown>,
  });

  revalidatePath("/");
  return data;
}

export async function deleteSocialLink(id: string) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data: item } = await supabase.from("social_links").select("label").eq("id", id).single();
  const { error } = await supabase.from("social_links").delete().eq("id", id);
  if (error) throw error;

  await logAuditEvent({
    action: "delete",
    entityType: "social_link",
    entityId: id,
    entityName: item?.label || id,
  });

  revalidatePath("/");
  return { success: true };
}
