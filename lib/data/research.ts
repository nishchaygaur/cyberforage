import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/security";
import { ARTICLE_PREVIEWS, ArticlePreview } from "@/lib/constants/siteData";
import { Database } from "@/types/database";
import { logAuditEvent } from "./audit";
import { revalidatePath } from "next/cache";

export type ResearchRow = Database["public"]["Tables"]["research_articles"]["Row"];
export type ResearchInsert = Database["public"]["Tables"]["research_articles"]["Insert"];
export type ResearchUpdate = Database["public"]["Tables"]["research_articles"]["Update"];

export async function getPublishedArticles(): Promise<ArticlePreview[]> {
  try {
    const supabase = await createClient();
    if (!supabase) return ARTICLE_PREVIEWS;

    const { data: articles, error } = await supabase
      .from("research_articles")
      .select("*")
      .eq("published", true)
      .order("publication_date", { ascending: false });

    if (error || !articles || articles.length === 0) {
      return ARTICLE_PREVIEWS;
    }

    return articles.map((a, idx) => ({
      category: a.category || "Security Research",
      title: a.title,
      description: a.excerpt,
      date: a.publication_date
        ? new Date(a.publication_date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "Recent",
      imageType: (idx % 3 === 0 ? "phishing" : idx % 3 === 1 ? "stealer" : "llm") as "phishing" | "stealer" | "llm",
    }));
  } catch {
    return ARTICLE_PREVIEWS;
  }
}

export async function getPublishedResearchRows(): Promise<ResearchRow[]> {
  try {
    const supabase = await createClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("research_articles")
      .select("*, research_tags(tag)")
      .eq("published", true)
      .order("publication_date", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("getPublishedResearchRows error:", err);
    return [];
  }
}

export async function getAllArticles(filters?: { search?: string; published?: boolean }) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  let query = supabase
    .from("research_articles")
    .select("*, research_tags(tag)", { count: "exact" })
    .order("created_at", { ascending: false });

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,excerpt.ilike.%${filters.search}%`);
  }
  if (typeof filters?.published === "boolean") {
    query = query.eq("published", filters.published);
  }

  const { data, count, error } = await query;
  if (error) throw error;
  return { articles: data || [], total: count || 0 };
}

export async function getArticleById(id: string) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data, error } = await supabase
    .from("research_articles")
    .select("*, research_tags(tag)")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createArticle(article: ResearchInsert, tags: string[] = []) {
  await requireAdmin();
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data, error } = await supabase
    .from("research_articles")
    .insert(article)
    .select()
    .single();

  if (error) throw error;

  if (tags.length > 0 && data) {
    const tagRows = tags.map((tag) => ({ article_id: data.id, tag: tag.trim() }));
    await supabase.from("research_tags").insert(tagRows);
  }

  await logAuditEvent({
    action: "create",
    entityType: "research_article",
    entityId: data.id,
    entityName: data.title,
    metadata: { slug: data.slug, published: data.published },
  });

  revalidatePath("/");
  revalidatePath("/research");
  return data;
}

export async function updateArticle(id: string, updates: ResearchUpdate, tags?: string[]) {
  await requireAdmin();
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data, error } = await supabase
    .from("research_articles")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  if (tags !== undefined) {
    await supabase.from("research_tags").delete().eq("article_id", id);
    if (tags.length > 0) {
      const tagRows = tags.map((tag) => ({ article_id: id, tag: tag.trim() }));
      await supabase.from("research_tags").insert(tagRows);
    }
  }

  await logAuditEvent({
    action: "update",
    entityType: "research_article",
    entityId: id,
    entityName: data.title,
    metadata: updates as Record<string, unknown>,
  });

  revalidatePath("/");
  revalidatePath("/research");
  return data;
}

export async function deleteArticle(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data: article } = await supabase.from("research_articles").select("title").eq("id", id).single();

  const { error } = await supabase.from("research_articles").delete().eq("id", id);
  if (error) throw error;

  await logAuditEvent({
    action: "delete",
    entityType: "research_article",
    entityId: id,
    entityName: article?.title || id,
  });

  revalidatePath("/");
  revalidatePath("/research");
  return { success: true };
}
