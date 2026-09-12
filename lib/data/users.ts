import { createClient } from "@/lib/supabase/server";
import { Database } from "@/types/database";

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

/**
 * Retrieves the currently authenticated administrator's profile.
 */
export async function getCurrentUserProfile(): Promise<ProfileRow | null> {
  try {
    const supabase = await createClient();
    if (!supabase) return null;
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) return null;
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authData.user.id)
      .single();
    return profile || null;
  } catch {
    return null;
  }
}
