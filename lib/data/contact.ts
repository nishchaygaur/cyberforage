import { createClient } from "@/lib/supabase/server";
import { Database, ContactSubmissionStatus } from "@/types/database";
import { logAuditEvent } from "./audit";
import { revalidatePath } from "next/cache";

export type ContactInfoRow = Database["public"]["Tables"]["contact_information"]["Row"];
export type ContactInfoUpdate = Database["public"]["Tables"]["contact_information"]["Update"];
export type ContactSubmissionRow = Database["public"]["Tables"]["contact_submissions"]["Row"];

export async function getContactInfo(): Promise<ContactInfoRow | null> {
  try {
    const supabase = await createClient();
    if (!supabase) return null;

    const { data } = await supabase.from("contact_information").select("*").limit(1).maybeSingle();
    return data;
  } catch {
    return null;
  }
}

export async function updateContactInfo(updates: ContactInfoUpdate) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const current = await getContactInfo();
  let result;

  if (current) {
    const { data, error } = await supabase
      .from("contact_information")
      .update(updates)
      .eq("id", current.id)
      .select()
      .single();
    if (error) throw error;
    result = data;
  } else {
    const { data, error } = await supabase
      .from("contact_information")
      .insert(updates)
      .select()
      .single();
    if (error) throw error;
    result = data;
  }

  await logAuditEvent({
    action: "update",
    entityType: "contact_information",
    entityId: result.id,
    entityName: "Contact Details",
    metadata: updates as Record<string, unknown>,
  });

  revalidatePath("/");
  return result;
}

export async function submitContactForm(submission: {
  name?: string;
  email: string;
  subject?: string;
  message: string;
}) {
  const supabase = await createClient();
  if (!supabase) {
    return { success: false, error: "Database communication service unavailable." };
  }

  if (!submission.email || !submission.email.includes("@")) {
    return { success: false, error: "Valid email address is required." };
  }
  if (!submission.message || submission.message.trim().length === 0) {
    return { success: false, error: "Message content cannot be empty." };
  }

  const { data, error } = await supabase
    .from("contact_submissions")
    .insert({
      name: submission.name?.trim() || null,
      email: submission.email.trim(),
      subject: submission.subject?.trim() || null,
      message: submission.message.trim(),
      status: "new",
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function getContactSubmissions(filters?: {
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const limit = filters?.limit || 50;
  const offset = filters?.offset || 0;

  let query = supabase
    .from("contact_submissions")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (filters?.status && filters.status !== "all") {
    query = query.eq("status", filters.status as ContactSubmissionStatus);
  }
  if (filters?.search) {
    query = query.or(`email.ilike.%${filters.search}%,name.ilike.%${filters.search}%,message.ilike.%${filters.search}%`);
  }

  const { data, count, error } = await query;
  if (error) throw error;
  return { submissions: data || [], total: count || 0 };
}

export async function updateSubmissionStatus(id: string, status: ContactSubmissionStatus) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data, error } = await supabase
    .from("contact_submissions")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteSubmission(id: string) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
  if (error) throw error;
  return { success: true };
}
