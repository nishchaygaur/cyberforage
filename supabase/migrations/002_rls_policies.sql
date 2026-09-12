-- ==============================================================================
-- 002_rls_policies.sql: Row Level Security (RLS) & Role-Based Access Control (RBAC)
-- ==============================================================================

-- 1. Helper Functions (SECURITY DEFINER to avoid recursion)
CREATE OR REPLACE FUNCTION public.get_user_role(p_user_id UUID)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT role FROM public.profiles WHERE id = p_user_id AND is_active = true;
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'super_admin' AND is_active = true
    );
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role IN ('admin', 'super_admin') AND is_active = true
    );
$$;

CREATE OR REPLACE FUNCTION public.is_editor()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role IN ('editor', 'admin', 'super_admin') AND is_active = true
    );
$$;

-- 2. Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_information ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.labs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exploration_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appearance_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- PROFILES POLICIES
-- ==============================================================================
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
TO authenticated 
USING (id = auth.uid() OR public.is_admin());

CREATE POLICY "Super admin can manage all profiles" 
ON public.profiles FOR ALL 
TO authenticated 
USING (public.is_super_admin())
WITH CHECK (public.is_super_admin());

CREATE POLICY "Users can update own basic profile (no role self-promotion)"
ON public.profiles FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (
    id = auth.uid() 
    AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
);

-- ==============================================================================
-- SITE SETTINGS POLICIES
-- ==============================================================================
CREATE POLICY "Public can view site settings" 
ON public.site_settings FOR SELECT 
TO anon, authenticated 
USING (true);

CREATE POLICY "Admins can update site settings" 
ON public.site_settings FOR ALL 
TO authenticated 
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ==============================================================================
-- CONTACT INFORMATION POLICIES
-- ==============================================================================
CREATE POLICY "Public can view contact information" 
ON public.contact_information FOR SELECT 
TO anon, authenticated 
USING (true);

CREATE POLICY "Admins can manage contact information" 
ON public.contact_information FOR ALL 
TO authenticated 
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ==============================================================================
-- CONTACT SUBMISSIONS POLICIES
-- ==============================================================================
CREATE POLICY "Public can insert contact submissions" 
ON public.contact_submissions FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

CREATE POLICY "Admins can view and manage contact submissions" 
ON public.contact_submissions FOR ALL 
TO authenticated 
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ==============================================================================
-- SOCIAL LINKS & NAVIGATION POLICIES
-- ==============================================================================
CREATE POLICY "Public can view enabled social links" 
ON public.social_links FOR SELECT 
TO anon, authenticated 
USING (enabled = true OR public.is_editor());

CREATE POLICY "Admins can manage social links" 
ON public.social_links FOR ALL 
TO authenticated 
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Public can view enabled navigation items" 
ON public.navigation_items FOR SELECT 
TO anon, authenticated 
USING (enabled = true OR public.is_editor());

CREATE POLICY "Admins can manage navigation items" 
ON public.navigation_items FOR ALL 
TO authenticated 
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ==============================================================================
-- TECHNOLOGIES POLICIES
-- ==============================================================================
CREATE POLICY "Public can view enabled technologies" 
ON public.technologies FOR SELECT 
TO anon, authenticated 
USING (enabled = true OR public.is_editor());

CREATE POLICY "Editors can insert/update technologies" 
ON public.technologies FOR INSERT 
TO authenticated 
WITH CHECK (public.is_editor());

CREATE POLICY "Editors can update technologies" 
ON public.technologies FOR UPDATE 
TO authenticated 
USING (public.is_editor())
WITH CHECK (public.is_editor());

CREATE POLICY "Admins can delete technologies" 
ON public.technologies FOR DELETE 
TO authenticated 
USING (public.is_admin());

-- ==============================================================================
-- PROJECTS POLICIES
-- ==============================================================================
CREATE POLICY "Public can view published projects" 
ON public.projects FOR SELECT 
TO anon, authenticated 
USING (published = true OR public.is_editor());

CREATE POLICY "Editors can insert projects" 
ON public.projects FOR INSERT 
TO authenticated 
WITH CHECK (public.is_editor());

CREATE POLICY "Editors can update projects" 
ON public.projects FOR UPDATE 
TO authenticated 
USING (public.is_editor())
WITH CHECK (public.is_editor());

CREATE POLICY "Admins can delete projects" 
ON public.projects FOR DELETE 
TO authenticated 
USING (public.is_admin());

-- Project Junctions / Tags
CREATE POLICY "Public view project_technologies" 
ON public.project_technologies FOR SELECT 
TO anon, authenticated 
USING (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND (p.published = true OR public.is_editor())));

CREATE POLICY "Editors manage project_technologies" 
ON public.project_technologies FOR ALL 
TO authenticated 
USING (public.is_editor())
WITH CHECK (public.is_editor());

CREATE POLICY "Public view project_tags" 
ON public.project_tags FOR SELECT 
TO anon, authenticated 
USING (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND (p.published = true OR public.is_editor())));

CREATE POLICY "Editors manage project_tags" 
ON public.project_tags FOR ALL 
TO authenticated 
USING (public.is_editor())
WITH CHECK (public.is_editor());

-- ==============================================================================
-- RESEARCH ARTICLES POLICIES
-- ==============================================================================
CREATE POLICY "Public can view published research" 
ON public.research_articles FOR SELECT 
TO anon, authenticated 
USING (published = true OR public.is_editor());

CREATE POLICY "Editors can insert research" 
ON public.research_articles FOR INSERT 
TO authenticated 
WITH CHECK (public.is_editor());

CREATE POLICY "Editors can update research" 
ON public.research_articles FOR UPDATE 
TO authenticated 
USING (public.is_editor())
WITH CHECK (public.is_editor());

CREATE POLICY "Admins can delete research" 
ON public.research_articles FOR DELETE 
TO authenticated 
USING (public.is_admin());

CREATE POLICY "Public view research_tags" 
ON public.research_tags FOR SELECT 
TO anon, authenticated 
USING (EXISTS (SELECT 1 FROM public.research_articles r WHERE r.id = article_id AND (r.published = true OR public.is_editor())));

CREATE POLICY "Editors manage research_tags" 
ON public.research_tags FOR ALL 
TO authenticated 
USING (public.is_editor())
WITH CHECK (public.is_editor());

-- ==============================================================================
-- LABS POLICIES
-- ==============================================================================
CREATE POLICY "Public can view published labs" 
ON public.labs FOR SELECT 
TO anon, authenticated 
USING (published = true OR public.is_editor());

CREATE POLICY "Editors can insert labs" 
ON public.labs FOR INSERT 
TO authenticated 
WITH CHECK (public.is_editor());

CREATE POLICY "Editors can update labs" 
ON public.labs FOR UPDATE 
TO authenticated 
USING (public.is_editor())
WITH CHECK (public.is_editor());

CREATE POLICY "Admins can delete labs" 
ON public.labs FOR DELETE 
TO authenticated 
USING (public.is_admin());

-- ==============================================================================
-- EXPLORATION ITEMS POLICIES
-- ==============================================================================
CREATE POLICY "Public can view published exploration items" 
ON public.exploration_items FOR SELECT 
TO anon, authenticated 
USING (published = true OR public.is_editor());

CREATE POLICY "Editors can insert exploration items" 
ON public.exploration_items FOR INSERT 
TO authenticated 
WITH CHECK (public.is_editor());

CREATE POLICY "Editors can update exploration items" 
ON public.exploration_items FOR UPDATE 
TO authenticated 
USING (public.is_editor())
WITH CHECK (public.is_editor());

CREATE POLICY "Admins can delete exploration items" 
ON public.exploration_items FOR DELETE 
TO authenticated 
USING (public.is_admin());

-- ==============================================================================
-- SEO & APPEARANCE POLICIES
-- ==============================================================================
CREATE POLICY "Public can view seo settings" 
ON public.seo_settings FOR SELECT 
TO anon, authenticated 
USING (true);

CREATE POLICY "Admins can manage seo settings" 
ON public.seo_settings FOR ALL 
TO authenticated 
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Public can view appearance settings" 
ON public.appearance_settings FOR SELECT 
TO anon, authenticated 
USING (true);

CREATE POLICY "Admins can manage appearance settings" 
ON public.appearance_settings FOR ALL 
TO authenticated 
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ==============================================================================
-- MEDIA POLICIES
-- ==============================================================================
CREATE POLICY "Public can view media references" 
ON public.media FOR SELECT 
TO anon, authenticated 
USING (true);

CREATE POLICY "Editors can upload media" 
ON public.media FOR INSERT 
TO authenticated 
WITH CHECK (public.is_editor());

CREATE POLICY "Editors can update media metadata" 
ON public.media FOR UPDATE 
TO authenticated 
USING (public.is_editor())
WITH CHECK (public.is_editor());

CREATE POLICY "Admins can delete media" 
ON public.media FOR DELETE 
TO authenticated 
USING (public.is_admin());

-- ==============================================================================
-- AUDIT LOGS POLICIES (Append-only)
-- ==============================================================================
CREATE POLICY "Authenticated users can write audit logs" 
ON public.audit_logs FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL OR public.is_editor());

CREATE POLICY "Super admins can view audit logs" 
ON public.audit_logs FOR SELECT 
TO authenticated 
USING (public.is_super_admin());

-- (Notice: NO UPDATE or DELETE policy exists for public.audit_logs, enforcing append-only immutability!)
