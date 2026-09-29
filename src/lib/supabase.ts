import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { SiteContent } from '../context/SiteContentContext';

// Target Administrator Credentials
export const AUTHORIZED_ADMIN_EMAIL = 'nishchay.gaur.official@gmail.com';
const FALLBACK_ADMIN_PASS = 'Siddhi@123';

// Vite & Vercel environment variables with production fallbacks
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://wmepoddjisyaizpwnppi.supabase.co';

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable_VTi5BXTTap4jNh7txrTJ5A_m7vffTa7';

let supabaseInstance: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project-id')) {
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
    supabaseInstance = null;
  }
}

export const getSupabaseClient = (): SupabaseClient | null => {
  return supabaseInstance;
};

export const isSupabaseConfigured = (): boolean => {
  return supabaseInstance !== null;
};

export interface AdminAuthResult {
  success: boolean;
  error?: string;
  isSupabaseAuth?: boolean;
  email?: string;
  token?: string;
}

/**
 * Authenticates admin session strictly for nishchay.gaur.official@gmail.com.
 * If Supabase is connected, utilizes Supabase Auth (signInWithPassword).
 * If Supabase is not yet configured, uses verified master administrator credentials.
 */
export async function authenticateAdmin(emailInput: string, passwordInput: string): Promise<AdminAuthResult> {
  const cleanEmail = emailInput.trim().toLowerCase();
  const cleanPassword = passwordInput.trim();

  // Strict check: only nishchay.gaur.official@gmail.com is permitted
  if (cleanEmail !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
    return {
      success: false,
      error: 'Access Denied: Email address is not authorized for administrator access.',
    };
  }

  // 1. If Supabase is connected, attempt Supabase Auth
  if (supabaseInstance) {
    try {
      const { data, error } = await supabaseInstance.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword,
      });

      if (!error && data?.user) {
        if (data.user.email?.toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
          const sessionToken = data.session?.access_token || `sb_session_${Date.now()}`;
          return {
            success: true,
            isSupabaseAuth: true,
            email: data.user.email,
            token: sessionToken,
          };
        } else {
          await supabaseInstance.auth.signOut();
          return {
            success: false,
            error: 'Forbidden: Authenticated user is not recognized as the master administrator.',
          };
        }
      }

      // If Supabase user does not exist in Auth table yet or credentials mismatch in Supabase:
      // Check if credentials match the designated master admin credentials
      if (cleanPassword === FALLBACK_ADMIN_PASS) {
        // Attempt to auto-register / seed this admin user into Supabase Auth if needed
        try {
          const { data: signUpData } = await supabaseInstance.auth.signUp({
            email: cleanEmail,
            password: cleanPassword,
          });
          if (signUpData?.user) {
            return {
              success: true,
              isSupabaseAuth: true,
              email: cleanEmail,
              token: signUpData.session?.access_token || `sb_session_${Date.now()}`,
            };
          }
        } catch {
          // Ignore registration error and continue
        }

        return {
          success: true,
          isSupabaseAuth: true,
          email: cleanEmail,
          token: `sb_admin_${Date.now()}`,
        };
      }

      return {
        success: false,
        error: error?.message || 'Access Denied: Invalid security password.',
      };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Authentication service error';
      console.warn('Supabase Auth error, checking fallback admin credentials:', errMsg);
    }
  }

  // 2. Fallback / Direct verification: Only nishchay.gaur.official@gmail.com + Siddhi@123
  if (cleanPassword === FALLBACK_ADMIN_PASS) {
    const localToken = `cf_admin_token_${Math.random().toString(36).substring(2)}_${Date.now().toString(36)}`;
    return {
      success: true,
      isSupabaseAuth: false,
      token: localToken,
    };
  }

  return {
    success: false,
    error: 'Access Denied: Invalid administrator password.',
  };
}

/**
 * Signs out the administrator and terminates Supabase session if active.
 */
export async function logoutAdmin(): Promise<void> {
  if (supabaseInstance) {
    try {
      await supabaseInstance.auth.signOut();
    } catch (err) {
      console.warn('Error during Supabase signout:', err);
    }
  }
}

/**
 * Loads remote CMS content from Supabase if configured.
 */
export async function loadContentFromSupabase(): Promise<Partial<SiteContent> | null> {
  if (!supabaseInstance) return null;

  try {
    const { data, error } = await supabaseInstance
      .from('site_cms_state')
      .select('content')
      .eq('id', 'current')
      .single();

    if (error) {
      // Table might not exist yet; gracefully fallback
      return null;
    }

    if (data?.content) {
      return data.content as Partial<SiteContent>;
    }
  } catch (err) {
    console.warn('Error fetching content from Supabase:', err);
  }

  return null;
}

/**
 * Saves CMS content to Supabase database.
 */
export async function saveContentToSupabase(content: SiteContent): Promise<{ success: boolean; error?: string }> {
  if (!supabaseInstance) {
    return { success: false, error: 'Supabase client is not initialized. Please verify VITE_SUPABASE_ANON_KEY in environment variables.' };
  }

  try {
    // 1. Ensure we have an active authenticated Supabase session to satisfy RLS write policies
    const { data: sessionData } = await supabaseInstance.auth.getSession();
    const currentSession = sessionData?.session;

    if (!currentSession || currentSession.user?.email?.toLowerCase() !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
      const { data: authData, error: authError } = await supabaseInstance.auth.signInWithPassword({
        email: AUTHORIZED_ADMIN_EMAIL,
        password: FALLBACK_ADMIN_PASS,
      });

      if (authError || !authData?.session) {
        return {
          success: false,
          error: `Authentication required: ${authError?.message || 'Failed to authenticate admin session with Supabase.'}`,
        };
      }
    }

    // 2. Commit CMS state to Supabase PostgreSQL table
    const { error } = await supabaseInstance
      .from('site_cms_state')
      .upsert({
        id: 'current',
        content,
        updated_at: new Date().toISOString(),
        updated_by: AUTHORIZED_ADMIN_EMAIL,
      });

    if (error) {
      console.error('Supabase RLS/Database write error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Database error';
    console.error('Supabase save error:', err);
    return { success: false, error: message };
  }
}
