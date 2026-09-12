import { createClient } from "@/lib/supabase/server";
import { verifyAdmin } from "@/lib/supabase/security";
import { SOCIAL_LINKS } from "@/lib/constants/siteData";
import { Database } from "@/types/database";
import { logAuditEvent } from "./audit";
import { revalidatePath } from "next/cache";
import { validatePlatformUrl } from "@/components/ui/SocialIcon";

export type SocialRow = Database["public"]["Tables"]["social_links"]["Row"];
export type SocialInsert = Database["public"]["Tables"]["social_links"]["Insert"];
export type SocialUpdate = Database["public"]["Tables"]["social_links"]["Update"];

export const DEFAULT_PUBLIC_SOCIALS: SocialRow[] = [
  {
    id: "default-github",
    platform: "github",
    label: "GitHub",
    url: SOCIAL_LINKS.github,
    icon: "github",
    description: "Open-source repositories and tools",
    enabled: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

/**
 * Public retrieval: returns only enabled social links, sorted by display_order.
 * If Supabase is unconfigured or empty, safely falls back to known static defaults
 * with no fake personal data.
 */
export async function getPublicSocialLinks(): Promise<SocialRow[]> {
  try {
    const supabase = await createClient();
    if (!supabase) return DEFAULT_PUBLIC_SOCIALS;

    const { data: links, error } = await supabase
      .from("social_links")
      .select("*")
      .eq("enabled", true)
      .order("display_order", { ascending: true });

    if (error || !links || links.length === 0) {
      return DEFAULT_PUBLIC_SOCIALS;
    }

    // Filter out any legacy placeholders that might have been seeded (e.g. bare domain linkedin.com)
    return links.filter((link) => {
      if (link.platform === "linkedin" && (link.url === "https://linkedin.com" || link.url === "https://www.linkedin.com" || link.url === "https://linkedin.com/")) {
        return false;
      }
      return true;
    });
  } catch {
    return DEFAULT_PUBLIC_SOCIALS;
  }
}

/**
 * Backward compatibility helper for components querying key-value map.
 */
export async function getSocialLinks(): Promise<{ github: string; linkedin?: string }> {
  const publicLinks = await getPublicSocialLinks();
  const map: Record<string, string> = {};
  publicLinks.forEach((l) => {
    map[l.platform.toLowerCase()] = l.url;
  });

  return {
    github: map.github || SOCIAL_LINKS.github,
    ...(map.linkedin ? { linkedin: map.linkedin } : {}),
  };
}

/**
 * Admin retrieval: returns all links (enabled and disabled) sorted by display_order.
 */
export async function getAllSocialLinks(): Promise<SocialRow[]> {
  await verifyAdmin();
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
  const admin = await verifyAdmin();
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  if (!link.label || !link.label.trim()) {
    throw new Error("Label is required.");
  }
  if (!link.url || !link.url.trim()) {
    throw new Error("URL is required.");
  }

  // Validate and format URL according to platform rules
  const val = validatePlatformUrl(link.platform, link.url.trim());
  if (!val.valid) {
    throw new Error(val.error || "Invalid URL for selected platform.");
  }

  const payload: SocialInsert = {
    ...link,
    label: link.label.trim(),
    platform: (link.platform || "custom").toLowerCase().trim(),
    url: val.formattedUrl,
    icon: (link.icon || link.platform || "custom").toLowerCase().trim(),
    description: link.description?.trim() || null,
    enabled: link.enabled !== undefined ? link.enabled : true,
    display_order: link.display_order ?? 0,
  };

  const { data, error } = await supabase
    .from("social_links")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;

  await logAuditEvent({
    action: "create",
    entityType: "social_link",
    entityId: data.id,
    entityName: data.label,
    metadata: payload as Record<string, unknown>,
    userId: admin.user.id,
  });

  revalidatePath("/");
  revalidatePath("/admin/social");
  return data;
}

export async function updateSocialLink(id: string, updates: SocialUpdate) {
  const admin = await verifyAdmin();
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const payload: SocialUpdate = { ...updates };

  if (updates.label !== undefined) {
    if (!updates.label.trim()) throw new Error("Label cannot be empty.");
    payload.label = updates.label.trim();
  }

  if (updates.url !== undefined) {
    if (!updates.url.trim()) throw new Error("URL cannot be empty.");
    const plat = updates.platform || "custom";
    const val = validatePlatformUrl(plat, updates.url.trim());
    if (!val.valid) {
      throw new Error(val.error || "Invalid URL for selected platform.");
    }
    payload.url = val.formattedUrl;
  }

  if (updates.platform !== undefined) {
    payload.platform = updates.platform.toLowerCase().trim();
  }

  if (updates.icon !== undefined) {
    payload.icon = updates.icon ? updates.icon.toLowerCase().trim() : null;
  }

  if (updates.description !== undefined) {
    payload.description = updates.description ? updates.description.trim() : null;
  }

  payload.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("social_links")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  await logAuditEvent({
    action: "update",
    entityType: "social_link",
    entityId: id,
    entityName: data.label,
    metadata: payload as Record<string, unknown>,
    userId: admin.user.id,
  });

  revalidatePath("/");
  revalidatePath("/admin/social");
  return data;
}

export async function deleteSocialLink(id: string) {
  const admin = await verifyAdmin();
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data: item } = await supabase
    .from("social_links")
    .select("label")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("social_links").delete().eq("id", id);
  if (error) throw error;

  await logAuditEvent({
    action: "delete",
    entityType: "social_link",
    entityId: id,
    entityName: item?.label || id,
    userId: admin.user.id,
  });

  revalidatePath("/");
  revalidatePath("/admin/social");
  return { success: true };
}

/**
 * Reorder social links in bulk by accepting an ordered array of IDs.
 */
export async function reorderSocialLinks(orderedIds: string[]) {
  const admin = await verifyAdmin();
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
    return { success: true };
  }

  // Update display_order for each ID
  const updates = orderedIds.map((id, index) =>
    supabase
      .from("social_links")
      .update({ display_order: index + 1, updated_at: new Date().toISOString() })
      .eq("id", id)
  );

  await Promise.all(updates);

  await logAuditEvent({
    action: "update",
    entityType: "social_link",
    entityName: "Social Links Reordered",
    metadata: { order: orderedIds },
    userId: admin.user.id,
  });

  revalidatePath("/");
  revalidatePath("/admin/social");
  return { success: true };
}
