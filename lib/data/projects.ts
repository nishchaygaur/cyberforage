import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/security";
import { FEATURED_PROJECTS, ProjectData } from "@/lib/constants/siteData";
import { Database, ProjectStatus } from "@/types/database";
import { logAuditEvent } from "./audit";
import { revalidatePath } from "next/cache";

export type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
export type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
export type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"];

export async function getPublishedProjects(): Promise<ProjectData[]> {
  try {
    const supabase = await createClient();
    if (!supabase) return FEATURED_PROJECTS;

    const { data: projects, error } = await supabase
      .from("projects")
      .select("*, project_tags(tag)")
      .eq("published", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching published projects:", error);
      return FEATURED_PROJECTS;
    }

    if (!projects || projects.length === 0) {
      return [];
    }

    return projects.map((p) => {
      let projectUrl = p.project_url;
      if (!projectUrl) {
        if (p.title?.toLowerCase().includes("cyberforage") || p.title?.toLowerCase().includes("cyberforge") || p.slug === "cyberforge") {
          projectUrl = "https://cyberforage.space";
        } else if (p.title?.toLowerCase().includes("pdf malware") || p.slug?.includes("audit.cyberforage.space")) {
          projectUrl = "https://audit.cyberforage.space";
        }
      }

      return {
        id: p.slug || p.id,
        slug: p.slug,
        title: p.title,
        subtitle: p.short_description,
        description: p.full_description || p.short_description,
        accent: (p.accent_color as "cyan" | "purple" | "rose") || "cyan",
        tags: p.project_tags ? p.project_tags.map((t: { tag: string }) => t.tag) : [],
        project_url: projectUrl,
        demo_url: p.demo_url,
        github_url: p.github_url,
        documentation_url: p.documentation_url,
        featured: p.featured,
        published: p.published,
        category: p.category,
        status: p.status,
        icon: p.icon,
        year: p.year,
      };
    });
  } catch (err) {
    console.error("Failed to get published projects:", err);
    return FEATURED_PROJECTS;
  }
}

export async function getPublishedProjectRows(): Promise<ProjectRow[]> {
  try {
    const supabase = await createClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("projects")
      .select("*, project_tags(tag)")
      .eq("published", true)
      .order("display_order", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("getPublishedProjectRows error:", err);
    return [];
  }
}

export async function getAllProjects(filters?: {
  search?: string;
  status?: string;
  published?: boolean;
}) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  let query = supabase
    .from("projects")
    .select("*, project_tags(tag)", { count: "exact" })
    .order("display_order", { ascending: true });

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,short_description.ilike.%${filters.search}%`);
  }
  if (filters?.status && filters.status !== "all") {
    query = query.eq("status", filters.status as ProjectStatus);
  }
  if (typeof filters?.published === "boolean") {
    query = query.eq("published", filters.published);
  }

  const { data, count, error } = await query;
  if (error) throw error;
  return { projects: data || [], total: count || 0 };
}

export async function getProjectById(id: string) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data, error } = await supabase
    .from("projects")
    .select("*, project_tags(tag)")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createProject(project: ProjectInsert, tags: string[] = []) {
  await requireAdmin();
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data, error } = await supabase
    .from("projects")
    .insert(project)
    .select()
    .single();

  if (error) throw error;

  if (tags.length > 0 && data) {
    const tagRows = tags.map((tag) => ({ project_id: data.id, tag: tag.trim() }));
    await supabase.from("project_tags").insert(tagRows);
  }

  await logAuditEvent({
    action: "create",
    entityType: "project",
    entityId: data.id,
    entityName: data.title,
    metadata: { slug: data.slug, published: data.published },
  });

  revalidatePath("/");
  revalidatePath("/projects");
  return data;
}

export async function updateProject(id: string, updates: ProjectUpdate, tags?: string[]) {
  await requireAdmin();
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data, error } = await supabase
    .from("projects")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  if (tags !== undefined) {
    await supabase.from("project_tags").delete().eq("project_id", id);
    if (tags.length > 0) {
      const tagRows = tags.map((tag) => ({ project_id: id, tag: tag.trim() }));
      await supabase.from("project_tags").insert(tagRows);
    }
  }

  await logAuditEvent({
    action: "update",
    entityType: "project",
    entityId: id,
    entityName: data.title,
    metadata: updates as Record<string, unknown>,
  });

  revalidatePath("/");
  revalidatePath("/projects");
  return data;
}

export async function deleteProject(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data: project } = await supabase.from("projects").select("title").eq("id", id).single();

  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;

  await logAuditEvent({
    action: "delete",
    entityType: "project",
    entityId: id,
    entityName: project?.title || id,
  });

  revalidatePath("/");
  revalidatePath("/projects");
  return { success: true };
}

export async function togglePublishProject(id: string, published: boolean) {
  return updateProject(id, { published });
}
