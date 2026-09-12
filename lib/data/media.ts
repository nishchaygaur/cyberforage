import { createClient } from "@/lib/supabase/server";
import { Database } from "@/types/database";
import { logAuditEvent } from "./audit";

export type MediaRow = Database["public"]["Tables"]["media"]["Row"];

export const BUCKET_NAME = "cyberforage-media";
export const ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
];
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function getAllMedia(filters?: { search?: string }) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  let query = supabase
    .from("media")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (filters?.search) {
    query = query.or(`file_name.ilike.%${filters.search}%,alt_text.ilike.%${filters.search}%`);
  }

  const { data, count, error } = await query;
  if (error) throw error;
  return { media: data || [], total: count || 0 };
}

export async function uploadMediaFile(formData: FormData) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const file = formData.get("file") as File | null;
  const altText = (formData.get("altText") as string) || "";
  const description = (formData.get("description") as string) || "";
  const usage = (formData.get("usage") as string) || "";

  if (!file) {
    throw new Error("No file provided for upload.");
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error(`Unsupported file type: ${file.type}. Allowed types: PNG, JPEG, WEBP, SVG.`);
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(`File exceeds maximum size limit of 5MB.`);
  }

  // Generate safe storage path
  const sanitizedName = file.name.toLowerCase().replace(/[^a-z0-9.-]/g, "_");
  const fileExt = sanitizedName.split(".").pop();
  const uniqueKey = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const storagePath = `uploads/${uniqueKey}`;

  // Upload to Supabase Storage
  const fileBuffer = await file.arrayBuffer();
  const { error: storageError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, fileBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (storageError) {
    throw new Error(`Storage upload failed: ${storageError.message}`);
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(storagePath);

  const publicUrl = publicUrlData.publicUrl;

  // Insert DB reference
  const { data: mediaRow, error: dbError } = await supabase
    .from("media")
    .insert({
      file_name: file.name,
      storage_path: storagePath,
      public_url: publicUrl,
      mime_type: file.type,
      file_size: file.size,
      alt_text: altText,
      description: description,
      usage: usage,
    })
    .select()
    .single();

  if (dbError) {
    // Attempt rollback storage
    await supabase.storage.from(BUCKET_NAME).remove([storagePath]);
    throw new Error(`Failed to save media metadata: ${dbError.message}`);
  }

  await logAuditEvent({
    action: "media_upload",
    entityType: "media",
    entityId: mediaRow.id,
    entityName: file.name,
    metadata: { size: file.size, mime: file.type, storagePath },
  });

  return mediaRow;
}

export async function deleteMediaFile(id: string) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data: mediaRow, error: fetchError } = await supabase
    .from("media")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !mediaRow) throw new Error("Media not found.");

  // Delete from storage
  await supabase.storage.from(BUCKET_NAME).remove([mediaRow.storage_path]);

  // Delete from db
  const { error: dbError } = await supabase.from("media").delete().eq("id", id);
  if (dbError) throw dbError;

  await logAuditEvent({
    action: "media_delete",
    entityType: "media",
    entityId: id,
    entityName: mediaRow.file_name,
  });

  return { success: true };
}
