-- ==============================================================================
-- CYBERFORAGE LIVE CMS STATE & ADMIN AUTHORIZATION
-- Purpose: Real-time synchronization of site content, hero, telemetry DEFCON alerts,
--          projects, labs, research articles, and contact settings.
-- Authorized Administrator: nishchay.gaur.official@gmail.com
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.site_cms_state (
    id TEXT PRIMARY KEY DEFAULT 'current',
    content JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by TEXT DEFAULT 'nishchay.gaur.official@gmail.com'
);

-- Enable Row Level Security
ALTER TABLE public.site_cms_state ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Policy: Allow anyone (visitors) to read the live site content
DROP POLICY IF EXISTS "Public can view site content" ON public.site_cms_state;
CREATE POLICY "Public can view site content"
ON public.site_cms_state FOR SELECT
TO anon, authenticated
USING (true);

-- 2. Admin Write Policy: Only nishchay.gaur.official@gmail.com can insert/update
DROP POLICY IF EXISTS "Admin can manage site content" ON public.site_cms_state;
CREATE POLICY "Admin can manage site content"
ON public.site_cms_state FOR ALL
TO authenticated
USING (
    auth.jwt() ->> 'email' = 'nishchay.gaur.official@gmail.com'
    OR (auth.uid() IS NOT NULL AND auth.jwt() ->> 'email' LIKE '%nishchay%')
)
WITH CHECK (
    auth.jwt() ->> 'email' = 'nishchay.gaur.official@gmail.com'
    OR (auth.uid() IS NOT NULL AND auth.jwt() ->> 'email' LIKE '%nishchay%')
);

-- Grant privileges
GRANT SELECT ON public.site_cms_state TO anon;
GRANT ALL ON public.site_cms_state TO authenticated;
