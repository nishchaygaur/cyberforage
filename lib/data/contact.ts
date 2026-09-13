import { createClient } from "@/lib/supabase/server";
import { verifyAdmin } from "@/lib/supabase/security";
import { Database, ContactSubmissionStatus } from "@/types/database";
import { logAuditEvent } from "./audit";
import { revalidatePath } from "next/cache";
import { validatePlatformUrl } from "@/components/ui/SocialIcon";

export type ContactInfoRow = Database["public"]["Tables"]["contact_information"]["Row"];
export type ContactInfoUpdate = Database["public"]["Tables"]["contact_information"]["Update"];
export type ContactSubmissionRow = Database["public"]["Tables"]["contact_submissions"]["Row"];

export const DEFAULT_CONTACT_INFO: ContactInfoRow = {
  id: "default",
  display_name: "Cyberforage",
  email: null,
  phone: null,
  whatsapp: null,
  location: null,
  website: "https://cyberforage.space",
  description: "Communication channel for research collaborations, security projects, and ecosystem inquiries.",
  contact_modal_description: "Have an idea, research collaboration, or security project? Connect with the Cyberforage ecosystem.",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  updated_by: null,
};

export async function getContactInfo(): Promise<ContactInfoRow | null> {
  try {
    const supabase = await createClient();
    if (!supabase) return DEFAULT_CONTACT_INFO;

    const { data, error } = await supabase
      .from("contact_information")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error || !data) return DEFAULT_CONTACT_INFO;
    return data;
  } catch {
    return DEFAULT_CONTACT_INFO;
  }
}

export async function updateContactInfo(updates: ContactInfoUpdate) {
  const admin = await verifyAdmin();
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  // Validation
  if (updates.email && updates.email.trim()) {
    const emailVal = validatePlatformUrl("email", updates.email.trim());
    if (!emailVal.valid) {
      throw new Error(emailVal.error || "Invalid email address format.");
    }
  }

  if (updates.phone && updates.phone.trim()) {
    const phoneVal = validatePlatformUrl("phone", updates.phone.trim());
    if (!phoneVal.valid) {
      throw new Error(phoneVal.error || "Invalid phone number format.");
    }
  }

  if (updates.whatsapp && updates.whatsapp.trim()) {
    const waVal = validatePlatformUrl("whatsapp", updates.whatsapp.trim());
    if (!waVal.valid) {
      throw new Error(waVal.error || "Invalid WhatsApp URL or number.");
    }
    updates.whatsapp = waVal.formattedUrl;
  }

  if (updates.website && updates.website.trim()) {
    const webVal = validatePlatformUrl("website", updates.website.trim());
    if (!webVal.valid) {
      throw new Error(webVal.error || "Invalid website URL format.");
    }
    updates.website = webVal.formattedUrl;
  }

  const payload = {
    ...updates,
    updated_at: new Date().toISOString(),
    updated_by: admin.user.id,
  };

  const current = await getContactInfo();
  let result: ContactInfoRow;

  if (current && current.id !== "default") {
    const { data, error } = await supabase
      .from("contact_information")
      .update(payload)
      .eq("id", current.id)
      .select()
      .single();
    if (error) throw error;
    result = data;
  } else {
    const { data, error } = await supabase
      .from("contact_information")
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    result = data;
  }

  await logAuditEvent({
    action: "update",
    entityType: "contact_information",
    entityId: result.id,
    entityName: result.display_name || "Contact Details",
    metadata: updates as Record<string, unknown>,
    userId: admin.user.id,
  });

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/admin/contact");
  return result;
}

export async function submitContactForm(submission: {
  name?: string | null;
  email: string;
  subject?: string | null;
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

  const { error } = await supabase
    .from("contact_submissions")
    .insert({
      name: submission.name?.trim() || null,
      email: submission.email.trim(),
      subject: submission.subject?.trim() || null,
      message: submission.message.trim(),
      status: "new",
    });

  if (error) {
    console.error("Error inserting contact submission:", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });
    return { success: false, error: error.message || "Failed to submit contact message." };
  }

  revalidatePath("/admin/contact-submissions");
  revalidatePath("/admin");

  return { success: true };
}

export async function getContactSubmissions(filters?: {
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  await verifyAdmin();
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
    const term = filters.search.trim();
    if (term) {
      query = query.or(`email.ilike.%${term}%,name.ilike.%${term}%,message.ilike.%${term}%`);
    }
  }

  const { data, count, error } = await query;
  if (error) {
    console.error("getContactSubmissions error:", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });
    throw error;
  }
  return { submissions: data || [], total: count || 0 };
}

export async function updateSubmissionStatus(id: string, status: ContactSubmissionStatus) {
  const admin = await verifyAdmin();
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data, error } = await supabase
    .from("contact_submissions")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("updateSubmissionStatus error:", error);
    throw error;
  }

  await logAuditEvent({
    action: "update",
    entityType: "contact_submission",
    entityId: id,
    entityName: `Submission from ${data.email}`,
    metadata: { status },
    userId: admin.user.id,
  });

  revalidatePath("/admin/contact-submissions");
  revalidatePath("/admin");

  return data;
}

export async function deleteSubmission(id: string) {
  const admin = await verifyAdmin();
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data: item } = await supabase
    .from("contact_submissions")
    .select("email")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
  if (error) {
    console.error("deleteSubmission error:", error);
    throw error;
  }

  await logAuditEvent({
    action: "delete",
    entityType: "contact_submission",
    entityId: id,
    entityName: item?.email ? `Submission from ${item.email}` : id,
    userId: admin.user.id,
  });

  revalidatePath("/admin/contact-submissions");
  revalidatePath("/admin");

  return { success: true };
}
