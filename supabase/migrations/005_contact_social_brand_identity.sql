-- ==============================================================================
-- 005_contact_social_brand_identity.sql: Contact, Social Links & Brand Identity CMS
-- ==============================================================================

-- 1. Extend social_links with optional description
ALTER TABLE public.social_links
ADD COLUMN IF NOT EXISTS description TEXT;

-- 2. Extend contact_information with WhatsApp and custom modal copy
ALTER TABLE public.contact_information
ADD COLUMN IF NOT EXISTS whatsapp TEXT,
ADD COLUMN IF NOT EXISTS contact_modal_description TEXT;

-- 3. Extend site_settings with secondary Owner / Creator identity fields
ALTER TABLE public.site_settings
ADD COLUMN IF NOT EXISTS owner_name TEXT,
ADD COLUMN IF NOT EXISTS owner_title TEXT,
ADD COLUMN IF NOT EXISTS owner_description TEXT;

-- 4. Ensure index on social_links for fast ordering and enabled filtering
CREATE INDEX IF NOT EXISTS idx_social_links_order ON public.social_links(display_order ASC, enabled);

-- 5. Clean up any invalid or placeholder seeded social links (e.g. bare linkedin.com with no profile)
UPDATE public.social_links
SET enabled = false
WHERE (platform = 'linkedin' AND (url = 'https://linkedin.com' OR url = 'https://www.linkedin.com' OR url = 'https://linkedin.com/'));

-- 6. Verify and reassert RLS policies
DO $$
BEGIN
    -- Public SELECT for contact_information
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'contact_information' AND policyname = 'Public can view contact information'
    ) THEN
        CREATE POLICY "Public can view contact information" 
        ON public.contact_information FOR SELECT 
        TO anon, authenticated 
        USING (true);
    END IF;

    -- Public SELECT for enabled social_links
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'social_links' AND policyname = 'Public can view enabled social links'
    ) THEN
        CREATE POLICY "Public can view enabled social links" 
        ON public.social_links FOR SELECT 
        TO anon, authenticated 
        USING (enabled = true OR public.is_editor());
    END IF;

    -- Public SELECT for site_settings
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'site_settings' AND policyname = 'Public can view site settings'
    ) THEN
        CREATE POLICY "Public can view site settings" 
        ON public.site_settings FOR SELECT 
        TO anon, authenticated 
        USING (true);
    END IF;
END $$;
