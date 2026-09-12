-- ==============================================================================
-- 001_initial_schema.sql: Core Database Schema for Cyberforage
-- ==============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Profiles Table (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('super_admin', 'admin', 'editor')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Site Settings Table (Single active global configuration)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_name TEXT NOT NULL DEFAULT 'Cyberforage',
    tagline TEXT NOT NULL DEFAULT 'Explore. Build. Defend.',
    short_description TEXT,
    long_description TEXT,
    logo_url TEXT,
    favicon_url TEXT,
    footer_text TEXT,
    copyright_text TEXT DEFAULT '© 2026 Cyberforage. All rights reserved.',
    primary_accent TEXT NOT NULL DEFAULT '#00F0C0',
    secondary_accent TEXT NOT NULL DEFAULT '#A855F7',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 3. Contact Information Table
CREATE TABLE IF NOT EXISTS public.contact_information (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    display_name TEXT,
    email TEXT,
    phone TEXT,
    location TEXT,
    website TEXT,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 4. Contact Submissions Table (Inbound messages from public contact modal)
CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Social Links Table
CREATE TABLE IF NOT EXISTS public.social_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform TEXT NOT NULL,
    label TEXT NOT NULL,
    url TEXT NOT NULL,
    icon TEXT,
    enabled BOOLEAN NOT NULL DEFAULT true,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Navigation Items Table
CREATE TABLE IF NOT EXISTS public.navigation_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location TEXT NOT NULL CHECK (location IN ('navbar', 'footer')),
    label TEXT NOT NULL,
    url TEXT NOT NULL,
    is_external BOOLEAN NOT NULL DEFAULT false,
    enabled BOOLEAN NOT NULL DEFAULT true,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Technologies Table (Used as lookup and standalone catalog)
CREATE TABLE IF NOT EXISTS public.technologies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT,
    description TEXT,
    icon TEXT,
    website_url TEXT,
    github_url TEXT,
    enabled BOOLEAN NOT NULL DEFAULT true,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_description TEXT NOT NULL,
    full_description TEXT,
    category TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('planning', 'in_development', 'active', 'completed', 'archived')),
    featured BOOLEAN NOT NULL DEFAULT false,
    published BOOLEAN NOT NULL DEFAULT false,
    project_url TEXT,
    github_url TEXT,
    documentation_url TEXT,
    demo_url TEXT,
    image_url TEXT,
    icon TEXT,
    accent_color TEXT DEFAULT 'cyan',
    year TEXT,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 9. Project Technologies Junction Table
CREATE TABLE IF NOT EXISTS public.project_technologies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    technology_id UUID NOT NULL REFERENCES public.technologies(id) ON DELETE CASCADE,
    UNIQUE(project_id, technology_id)
);

-- 10. Project Tags Table
CREATE TABLE IF NOT EXISTS public.project_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    tag TEXT NOT NULL,
    UNIQUE(project_id, tag)
);

-- 11. Research Articles Table
CREATE TABLE IF NOT EXISTS public.research_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT NOT NULL,
    content TEXT,
    author TEXT,
    publication_date DATE,
    category TEXT,
    cover_image_url TEXT,
    external_url TEXT,
    reading_time TEXT,
    featured BOOLEAN NOT NULL DEFAULT false,
    published BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 12. Research Tags Table
CREATE TABLE IF NOT EXISTS public.research_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID NOT NULL REFERENCES public.research_articles(id) ON DELETE CASCADE,
    tag TEXT NOT NULL,
    UNIQUE(article_id, tag)
);

-- 13. Labs Table
CREATE TABLE IF NOT EXISTS public.labs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('coming_soon', 'available', 'in_development', 'archived')),
    difficulty TEXT,
    category TEXT,
    url TEXT,
    github_url TEXT,
    documentation_url TEXT,
    image_url TEXT,
    icon TEXT,
    featured BOOLEAN NOT NULL DEFAULT false,
    published BOOLEAN NOT NULL DEFAULT false,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 14. Exploration Items Table
CREATE TABLE IF NOT EXISTS public.exploration_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    accent TEXT,
    link TEXT,
    published BOOLEAN NOT NULL DEFAULT true,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 15. SEO Settings Table
CREATE TABLE IF NOT EXISTS public.seo_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meta_title TEXT,
    meta_description TEXT,
    keywords TEXT[],
    og_title TEXT,
    og_description TEXT,
    og_image_url TEXT,
    twitter_title TEXT,
    twitter_description TEXT,
    canonical_url TEXT,
    robots_index BOOLEAN NOT NULL DEFAULT true,
    robots_follow BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 16. Appearance Settings Table
CREATE TABLE IF NOT EXISTS public.appearance_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    primary_accent TEXT NOT NULL DEFAULT '#00F0C0',
    secondary_accent TEXT NOT NULL DEFAULT '#A855F7',
    background_color TEXT NOT NULL DEFAULT '#040812',
    text_color TEXT NOT NULL DEFAULT '#F8FAFC',
    card_background TEXT NOT NULL DEFAULT '#081220',
    border_color TEXT NOT NULL DEFAULT 'rgba(255,255,255,0.08)',
    glow_intensity TEXT NOT NULL DEFAULT 'medium',
    border_radius TEXT NOT NULL DEFAULT 'rounded-xl',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 17. Media Table (Supabase Storage reference tracking)
CREATE TABLE IF NOT EXISTS public.media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name TEXT NOT NULL,
    storage_path TEXT NOT NULL UNIQUE,
    public_url TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    alt_text TEXT,
    description TEXT,
    usage TEXT,
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 18. Audit Logs Table (Append-only)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete', 'publish', 'unpublish', 'login', 'logout', 'role_change', 'media_upload', 'media_delete')),
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    entity_name TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- INDEXES FOR OPTIMAL QUERY PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_published ON public.projects(published);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_display_order ON public.projects(display_order);

CREATE INDEX IF NOT EXISTS idx_research_slug ON public.research_articles(slug);
CREATE INDEX IF NOT EXISTS idx_research_published ON public.research_articles(published);
CREATE INDEX IF NOT EXISTS idx_research_pub_date ON public.research_articles(publication_date);

CREATE INDEX IF NOT EXISTS idx_labs_slug ON public.labs(slug);
CREATE INDEX IF NOT EXISTS idx_labs_published ON public.labs(published);
CREATE INDEX IF NOT EXISTS idx_labs_display_order ON public.labs(display_order);

CREATE INDEX IF NOT EXISTS idx_technologies_enabled ON public.technologies(enabled);
CREATE INDEX IF NOT EXISTS idx_technologies_display_order ON public.technologies(display_order);

CREATE INDEX IF NOT EXISTS idx_exploration_published ON public.exploration_items(published);
CREATE INDEX IF NOT EXISTS idx_exploration_display_order ON public.exploration_items(display_order);

CREATE INDEX IF NOT EXISTS idx_navigation_lookup ON public.navigation_items(location, enabled, display_order);
CREATE INDEX IF NOT EXISTS idx_social_links_lookup ON public.social_links(enabled, display_order);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_type ON public.audit_logs(entity_type);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON public.contact_submissions(status, created_at DESC);
