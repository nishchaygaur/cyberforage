import { createClient } from "@/lib/supabase/server";
import { Database } from "@/types/database";
import { logAuditEvent } from "./audit";
import { revalidatePath } from "next/cache";

export type SiteSettingsRow = Database["public"]["Tables"]["site_settings"]["Row"];
export type SiteSettingsUpdate = Database["public"]["Tables"]["site_settings"]["Update"];
export type AppearanceRow = Database["public"]["Tables"]["appearance_settings"]["Row"];
export type AppearanceUpdate = Database["public"]["Tables"]["appearance_settings"]["Update"];

export const DEFAULT_SITE_SETTINGS: SiteSettingsRow = {
  id: "default",
  site_name: "Cyberforage",
  tagline: "Explore. Build. Defend.",
  short_description: "A technology ecosystem for cybersecurity, security research, intelligent automation and defensive engineering.",
  long_description: "Cyberforage is an independent technology and security platform bringing together security research, defensive engineering, AI automation, and hands-on laboratory environments into a unified ecosystem.",
  logo_url: "/favicon.svg",
  favicon_url: "/favicon.svg",
  footer_text: "Explore. Build. Defend.",
  copyright_text: "© 2026 Cyberforage. All rights reserved.",
  primary_accent: "#00F0C0",
  secondary_accent: "#A855F7",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  updated_by: null,
};

export async function getSiteSettings(): Promise<SiteSettingsRow> {
  try {
    const supabase = await createClient();
    if (!supabase) return DEFAULT_SITE_SETTINGS;

    const { data } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();
    return data || DEFAULT_SITE_SETTINGS;
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function updateSiteSettings(updates: SiteSettingsUpdate) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const current = await getSiteSettings();
  let result;

  if (current.id !== "default") {
    const { data, error } = await supabase
      .from("site_settings")
      .update(updates)
      .eq("id", current.id)
      .select()
      .single();
    if (error) throw error;
    result = data;
  } else {
    const { data, error } = await supabase
      .from("site_settings")
      .insert(updates)
      .select()
      .single();
    if (error) throw error;
    result = data;
  }

  await logAuditEvent({
    action: "update",
    entityType: "site_settings",
    entityId: result.id,
    entityName: "Site Settings",
    metadata: updates as Record<string, unknown>,
  });

  revalidatePath("/");
  return result;
}

export async function getAppearanceSettings(): Promise<AppearanceRow | null> {
  try {
    const supabase = await createClient();
    if (!supabase) return null;

    const { data } = await supabase.from("appearance_settings").select("*").limit(1).maybeSingle();
    return data;
  } catch {
    return null;
  }
}

export async function updateAppearanceSettings(updates: AppearanceUpdate) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const current = await getAppearanceSettings();
  let result;

  if (current) {
    const { data, error } = await supabase
      .from("appearance_settings")
      .update(updates)
      .eq("id", current.id)
      .select()
      .single();
    if (error) throw error;
    result = data;
  } else {
    const { data, error } = await supabase
      .from("appearance_settings")
      .insert(updates)
      .select()
      .single();
    if (error) throw error;
    result = data;
  }

  await logAuditEvent({
    action: "update",
    entityType: "appearance_settings",
    entityId: result.id,
    entityName: "Appearance Tokens",
    metadata: updates as Record<string, unknown>,
  });

  revalidatePath("/");
  return result;
}
