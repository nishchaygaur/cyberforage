import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/security";
import { Database } from "@/types/database";
import { logAuditEvent } from "./audit";
import { revalidatePath } from "next/cache";

export type SeoSettingsRow = Database["public"]["Tables"]["seo_settings"]["Row"];
export type SeoSettingsUpdate = Database["public"]["Tables"]["seo_settings"]["Update"];

export const DEFAULT_SEO_SETTINGS: SeoSettingsRow = {
  id: "default",
  meta_title: "Cyberforage — Explore. Build. Defend.",
  meta_description:
    "Cyberforage is a technology ecosystem exploring cybersecurity, security research, AI, intelligent automation and defensive engineering.",
  keywords: [
    "Cybersecurity",
    "Security Research",
    "AI",
    "Intelligent Automation",
    "Defensive Engineering",
    "SOC",
    "Threat Intelligence",
    "DFIR",
    "Open Source Security",
  ],
  og_title: "Cyberforage — Explore. Build. Defend.",
  og_description:
    "Cyberforage is a technology ecosystem exploring cybersecurity, security research, AI, intelligent automation and defensive engineering.",
  og_image_url: "/og-image.png",
  twitter_title: "Cyberforage — Explore. Build. Defend.",
  twitter_description:
    "Cyberforage is a technology ecosystem exploring cybersecurity, security research, AI, intelligent automation and defensive engineering.",
  canonical_url: "https://cyberforage.space",
  robots_index: true,
  robots_follow: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  updated_by: null,
};

export async function getSeoSettings(): Promise<SeoSettingsRow> {
  try {
    const supabase = await createClient();
    if (!supabase) return DEFAULT_SEO_SETTINGS;

    const { data } = await supabase.from("seo_settings").select("*").limit(1).maybeSingle();
    return data || DEFAULT_SEO_SETTINGS;
  } catch {
    return DEFAULT_SEO_SETTINGS;
  }
}

export async function updateSeoSettings(updates: SeoSettingsUpdate) {
  const admin = await requireAdmin();
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const current = await getSeoSettings();
  let result;

  const payload: SeoSettingsUpdate = {
    ...updates,
    updated_at: new Date().toISOString(),
    updated_by: admin.id,
  };

  if (current.id !== "default") {
    const { data, error } = await supabase
      .from("seo_settings")
      .update(payload)
      .eq("id", current.id)
      .select()
      .single();
    if (error) throw error;
    result = data;
  } else {
    const { data, error } = await supabase
      .from("seo_settings")
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    result = data;
  }

  await logAuditEvent({
    action: "update",
    entityType: "seo_settings",
    entityId: result.id,
    entityName: "SEO Settings",
    metadata: updates as Record<string, unknown>,
    userId: admin.id,
  });

  revalidatePath("/");
  return result;
}
