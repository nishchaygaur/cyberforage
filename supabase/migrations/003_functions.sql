-- ==============================================================================
-- 003_functions.sql: Database Triggers & Automated Procedures
-- ==============================================================================

-- 1. Generic updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Apply updated_at triggers to all mutable tables
DROP TRIGGER IF EXISTS set_updated_at_profiles ON public.profiles;
CREATE TRIGGER set_updated_at_profiles BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_site_settings ON public.site_settings;
CREATE TRIGGER set_updated_at_site_settings BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_contact_information ON public.contact_information;
CREATE TRIGGER set_updated_at_contact_information BEFORE UPDATE ON public.contact_information FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_social_links ON public.social_links;
CREATE TRIGGER set_updated_at_social_links BEFORE UPDATE ON public.social_links FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_navigation_items ON public.navigation_items;
CREATE TRIGGER set_updated_at_navigation_items BEFORE UPDATE ON public.navigation_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_technologies ON public.technologies;
CREATE TRIGGER set_updated_at_technologies BEFORE UPDATE ON public.technologies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_projects ON public.projects;
CREATE TRIGGER set_updated_at_projects BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_research_articles ON public.research_articles;
CREATE TRIGGER set_updated_at_research_articles BEFORE UPDATE ON public.research_articles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_labs ON public.labs;
CREATE TRIGGER set_updated_at_labs BEFORE UPDATE ON public.labs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_exploration_items ON public.exploration_items;
CREATE TRIGGER set_updated_at_exploration_items BEFORE UPDATE ON public.exploration_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_seo_settings ON public.seo_settings;
CREATE TRIGGER set_updated_at_seo_settings BEFORE UPDATE ON public.seo_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_appearance_settings ON public.appearance_settings;
CREATE TRIGGER set_updated_at_appearance_settings BEFORE UPDATE ON public.appearance_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_media ON public.media;
CREATE TRIGGER set_updated_at_media BEFORE UPDATE ON public.media FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. Safe New User Trigger on auth.users (Always defaults to 'editor')
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
        'editor', -- SAFE DEFAULT: Never automatically super_admin
        true
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Last Super Admin Protection
CREATE OR REPLACE FUNCTION public.protect_last_super_admin()
RETURNS TRIGGER 
LANGUAGE plpgsql
AS $$
DECLARE
    super_admin_count INT;
BEGIN
    -- If updating or deleting a super_admin
    IF (TG_OP = 'DELETE' AND OLD.role = 'super_admin') OR 
       (TG_OP = 'UPDATE' AND OLD.role = 'super_admin' AND (NEW.role <> 'super_admin' OR NEW.is_active = false)) THEN
       
        SELECT count(*) INTO super_admin_count 
        FROM public.profiles 
        WHERE role = 'super_admin' AND is_active = true AND id <> OLD.id;
        
        IF super_admin_count = 0 THEN
            RAISE EXCEPTION 'Action aborted: Cannot delete, demote or deactivate the last active super_admin account.';
        END IF;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_last_super_admin ON public.profiles;
CREATE TRIGGER trg_protect_last_super_admin
    BEFORE UPDATE OR DELETE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.protect_last_super_admin();
