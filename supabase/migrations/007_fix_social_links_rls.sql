-- ==============================================================================
-- 007_fix_social_links_rls.sql: Fix Social Links RLS and Single Admin Policies
-- ==============================================================================

-- 1. Ensure RLS is enabled on social_links
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies on public.social_links to remove stale RBAC restrictions
DROP POLICY IF EXISTS "Public can view enabled social links" ON public.social_links;
DROP POLICY IF EXISTS "Admins can manage social links" ON public.social_links;
DROP POLICY IF EXISTS "Admin can manage social links" ON public.social_links;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.social_links;

-- 3. Clean Single-Admin Policies for social_links
-- Public SELECT policy:
-- Anonymous visitors can only select enabled social links.
-- Authenticated administrator (auth.uid() IS NOT NULL) can select ALL social links (enabled and disabled).
CREATE POLICY "Public can view enabled social links"
ON public.social_links FOR SELECT
TO anon, authenticated
USING (enabled = true OR auth.uid() IS NOT NULL);

-- Admin Management Policy:
-- Authenticated administrator can perform INSERT, UPDATE, and DELETE.
CREATE POLICY "Admin can manage social links"
ON public.social_links FOR ALL
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- 4. Update legacy helper functions to return true for any authenticated user
-- This ensures any legacy functions or triggers will not block administrative operations
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN auth.uid() IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_editor()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN auth.uid() IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
