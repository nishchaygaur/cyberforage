import { createClient } from "@/lib/supabase/server";
import { UserRole } from "@/types/database";

export interface AdminSession {
  user: {
    id: string;
    email?: string;
  };
  profile: {
    role: UserRole;
    full_name: string | null;
    is_active: boolean;
  };
}

/**
 * Server-side authorization check.
 * Verifies that the active session belongs to an authenticated user with
 * active status and 'admin' or 'super_admin' role.
 */
export async function verifyAdmin(): Promise<AdminSession> {
  const supabase = await createClient();
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData?.user) {
    throw new Error("Unauthorized: Authentication required to perform administrative action.");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, is_active, full_name")
    .eq("id", authData.user.id)
    .maybeSingle();

  if (profileError || !profile) {
    throw new Error("Forbidden: Profile record not found or inaccessible.");
  }

  if (!profile.is_active) {
    throw new Error("Forbidden: Account has been deactivated.");
  }

  const allowedRoles: UserRole[] = ["admin", "super_admin"];
  if (!allowedRoles.includes(profile.role)) {
    throw new Error("Forbidden: Insufficient privileges. Administrator access required.");
  }

  return {
    user: authData.user,
    profile,
  };
}
