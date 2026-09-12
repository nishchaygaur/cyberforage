import { createClient } from "@/lib/supabase/server";

export interface AdminUser {
  id: string;
  email?: string;
  full_name?: string | null;
  user: {
    id: string;
    email?: string;
  };
  profile?: {
    full_name: string | null;
    is_active: boolean;
  };
}

export type AdminSession = AdminUser;

/**
 * Server-side administrator verification helper.
 * 1. Verifies that the active session belongs to an authenticated Supabase user.
 * 2. If ADMIN_USER_ID is configured in the environment, verifies that the user's UUID matches.
 * 3. Returns the authenticated administrator user.
 * 4. Throws 401 Unauthorized or 403 Forbidden otherwise.
 */
export async function requireAdmin(): Promise<AdminUser> {
  const supabase = await createClient();
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData?.user) {
    throw new Error("Unauthorized: Authentication required to perform administrative action.");
  }

  const user = authData.user;
  const configuredAdminId = process.env.ADMIN_USER_ID?.trim();

  if (configuredAdminId && user.id !== configuredAdminId) {
    throw new Error("Forbidden: Access restricted to configured administrator.");
  }

  const fullName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "Administrator";

  return {
    id: user.id,
    email: user.email,
    full_name: fullName,
    user: {
      id: user.id,
      email: user.email,
    },
    profile: {
      full_name: fullName,
      is_active: true,
    },
  };
}

/**
 * Alias for backward compatibility with existing callers.
 */
export const verifyAdmin = requireAdmin;

