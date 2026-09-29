-- ==============================================================================
-- 006_remove_rbac_single_admin.sql: Remove RBAC & Simplify to Single Administrator
-- ==============================================================================

-- 1. Drop obsolete RBAC triggers & functions
DROP TRIGGER IF EXISTS trg_protect_last_super_admin ON public.profiles;
DROP FUNCTION IF EXISTS public.protect_last_super_admin();

-- 2. Make profiles.role constraint optional/nullable (preserving column for zero-downtime compatibility)
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ALTER COLUMN role DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'admin';

-- 3. Update handle_new_user trigger function to remove editor default
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url, role, is_active)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'avatar_url',
        'admin',
        true
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        avatar_url = EXCLUDED.avatar_url,
        updated_at = now();
    RETURN NEW;
END;
$$;

-- 4. Replace security helper functions with single-admin checks (true when authenticated)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT auth.uid() IS NOT NULL;
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT auth.uid() IS NOT NULL;
$$;

CREATE OR REPLACE FUNCTION public.is_editor()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT auth.uid() IS NOT NULL;
$$;

CREATE OR REPLACE FUNCTION public.get_user_role(p_user_id UUID)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT 'admin'::TEXT;
$$;

-- 5. Drop existing role-based policies and replace with single-admin RLS policies

-- PROFILES
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Super admin can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own basic profile (no role self-promotion)" ON public.profiles;

CREATE POLICY "Authenticated admin can view profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated admin can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

CREATE POLICY "Authenticated admin can manage profiles"
ON public.profiles FOR ALL
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- SITE SETTINGS
DROP POLICY IF EXISTS "Public can view site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can update site settings" ON public.site_settings;

CREATE POLICY "Public can view site settings"
ON public.site_settings FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admin can manage site settings"
ON public.site_settings FOR ALL
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- CONTACT INFORMATION
DROP POLICY IF EXISTS "Public can view contact information" ON public.contact_information;
DROP POLICY IF EXISTS "Admins can manage contact information" ON public.contact_information;

CREATE POLICY "Public can view contact information"
ON public.contact_information FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admin can manage contact information"
ON public.contact_information FOR ALL
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- CONTACT SUBMISSIONS
DROP POLICY IF EXISTS "Public can insert contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can view and manage contact submissions" ON public.contact_submissions;

CREATE POLICY "Public can insert contact submissions"
ON public.contact_submissions FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admin can manage contact submissions"
ON public.contact_submissions FOR ALL
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- SOCIAL LINKS
DROP POLICY IF EXISTS "Public can view enabled social links" ON public.social_links;
DROP POLICY IF EXISTS "Admins can manage social links" ON public.social_links;

CREATE POLICY "Public can view enabled social links"
ON public.social_links FOR SELECT
TO anon, authenticated
USING (enabled = true OR auth.uid() IS NOT NULL);

CREATE POLICY "Admin can manage social links"
ON public.social_links FOR ALL
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- NAVIGATION ITEMS
DROP POLICY IF EXISTS "Public can view enabled navigation items" ON public.navigation_items;
DROP POLICY IF EXISTS "Admins can manage navigation items" ON public.navigation_items;

CREATE POLICY "Public can view enabled navigation items"
ON public.navigation_items FOR SELECT
TO anon, authenticated
USING (enabled = true OR auth.uid() IS NOT NULL);

CREATE POLICY "Admin can manage navigation items"
ON public.navigation_items FOR ALL
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- TECHNOLOGIES
DROP POLICY IF EXISTS "Public can view enabled technologies" ON public.technologies;
DROP POLICY IF EXISTS "Editors can insert/update technologies" ON public.technologies;
DROP POLICY IF EXISTS "Editors can update technologies" ON public.technologies;
DROP POLICY IF EXISTS "Admins can delete technologies" ON public.technologies;

CREATE POLICY "Public can view enabled technologies"
ON public.technologies FOR SELECT
TO anon, authenticated
USING (enabled = true OR auth.uid() IS NOT NULL);

CREATE POLICY "Admin can manage technologies"
ON public.technologies FOR ALL
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- PROJECTS
DROP POLICY IF EXISTS "Public can view published projects" ON public.projects;
DROP POLICY IF EXISTS "Editors can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Editors can update projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can delete projects" ON public.projects;

CREATE POLICY "Public can view published projects"
ON public.projects FOR SELECT
TO anon, authenticated
USING (published = true OR auth.uid() IS NOT NULL);

CREATE POLICY "Admin can manage projects"
ON public.projects FOR ALL
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- PROJECT TECHNOLOGIES & TAGS
DROP POLICY IF EXISTS "Public view project_technologies" ON public.project_technologies;
DROP POLICY IF EXISTS "Editors manage project_technologies" ON public.project_technologies;
DROP POLICY IF EXISTS "Public view project_tags" ON public.project_tags;
DROP POLICY IF EXISTS "Editors manage project_tags" ON public.project_tags;

CREATE POLICY "Public view project_technologies"
ON public.project_technologies FOR SELECT
TO anon, authenticated
USING (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND (p.published = true OR auth.uid() IS NOT NULL)));

CREATE POLICY "Admin manage project_technologies"
ON public.project_technologies FOR ALL
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Public view project_tags"
ON public.project_tags FOR SELECT
TO anon, authenticated
USING (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND (p.published = true OR auth.uid() IS NOT NULL)));

CREATE POLICY "Admin manage project_tags"
ON public.project_tags FOR ALL
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- RESEARCH ARTICLES
DROP POLICY IF EXISTS "Public can view published research" ON public.research_articles;
DROP POLICY IF EXISTS "Editors can insert research" ON public.research_articles;
DROP POLICY IF EXISTS "Editors can update research" ON public.research_articles;
DROP POLICY IF EXISTS "Admins can delete research" ON public.research_articles;

CREATE POLICY "Public can view published research"
ON public.research_articles FOR SELECT
TO anon, authenticated
USING (published = true OR auth.uid() IS NOT NULL);

CREATE POLICY "Admin can manage research"
ON public.research_articles FOR ALL
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- RESEARCH TAGS
DROP POLICY IF EXISTS "Public view research_tags" ON public.research_tags;
DROP POLICY IF EXISTS "Editors manage research_tags" ON public.research_tags;

CREATE POLICY "Public view research_tags"
ON public.research_tags FOR SELECT
TO anon, authenticated
USING (EXISTS (SELECT 1 FROM public.research_articles a WHERE a.id = article_id AND (a.published = true OR auth.uid() IS NOT NULL)));

CREATE POLICY "Admin manage research_tags"
ON public.research_tags FOR ALL
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- LABS
DROP POLICY IF EXISTS "Public can view published labs" ON public.labs;
DROP POLICY IF EXISTS "Editors can insert labs" ON public.labs;
DROP POLICY IF EXISTS "Editors can update labs" ON public.labs;
DROP POLICY IF EXISTS "Admins can delete labs" ON public.labs;

CREATE POLICY "Public can view published labs"
ON public.labs FOR SELECT
TO anon, authenticated
USING (published = true OR auth.uid() IS NOT NULL);

CREATE POLICY "Admin can manage labs"
ON public.labs FOR ALL
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- EXPLORATION ITEMS
DROP POLICY IF EXISTS "Public can view published exploration items" ON public.exploration_items;
DROP POLICY IF EXISTS "Editors can insert exploration items" ON public.exploration_items;
DROP POLICY IF EXISTS "Editors can update exploration items" ON public.exploration_items;
DROP POLICY IF EXISTS "Admins can delete exploration items" ON public.exploration_items;

CREATE POLICY "Public can view published exploration items"
ON public.exploration_items FOR SELECT
TO anon, authenticated
USING (published = true OR auth.uid() IS NOT NULL);

CREATE POLICY "Admin can manage exploration items"
ON public.exploration_items FOR ALL
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- SEO SETTINGS
DROP POLICY IF EXISTS "Public can view seo settings" ON public.seo_settings;
DROP POLICY IF EXISTS "Admins can update seo settings" ON public.seo_settings;

CREATE POLICY "Public can view seo settings"
ON public.seo_settings FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admin can manage seo settings"
ON public.seo_settings FOR ALL
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- APPEARANCE SETTINGS
DROP POLICY IF EXISTS "Public can view appearance settings" ON public.appearance_settings;
DROP POLICY IF EXISTS "Admins can update appearance settings" ON public.appearance_settings;

CREATE POLICY "Public can view appearance settings"
ON public.appearance_settings FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admin can manage appearance settings"
ON public.appearance_settings FOR ALL
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- MEDIA
DROP POLICY IF EXISTS "Public can view media" ON public.media;
DROP POLICY IF EXISTS "Editors can upload media" ON public.media;
DROP POLICY IF EXISTS "Editors can update media metadata" ON public.media;
DROP POLICY IF EXISTS "Admins can delete media" ON public.media;

CREATE POLICY "Public can view media"
ON public.media FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admin can manage media"
ON public.media FOR ALL
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- AUDIT LOGS
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Authenticated users can insert audit logs" ON public.audit_logs;

CREATE POLICY "Admin can view audit logs"
ON public.audit_logs FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin can insert audit logs"
ON public.audit_logs FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);
