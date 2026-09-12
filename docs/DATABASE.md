# Cyberforage Database Schema & Architecture

The Cyberforage database is a PostgreSQL 15+ database managed via Supabase, with comprehensive Row Level Security (RLS) and cryptographic integrity controls.

---

## 1. Schema Diagram & Relationships

```
auth.users (Supabase Auth)
     │
     └── 1:1 ── profiles (role, is_active, full_name, avatar_url)
                   │
                   ├── 1:N ── audit_logs (actor)
                   ├── 1:N ── projects (created_by, updated_by)
                   │             ├── 1:N ── project_tags
                   │             └── 1:N ── project_technologies ── N:1 ── technologies
                   ├── 1:N ── research_articles (created_by, updated_by)
                   │             └── 1:N ── research_tags
                   └── 1:N ── media (uploaded_by)
```

---

## 2. Table Directory

### 1. `profiles`
- **Purpose**: Extends `auth.users` with application-specific RBAC attributes.
- **Key Columns**: `id` (UUID, references `auth.users`), `full_name`, `avatar_url`, `role` (`super_admin`, `admin`, `editor`), `is_active` (boolean).

### 2. `site_settings`
- **Purpose**: Global site settings, broadcast announcement banners, and emergency maintenance guard.
- **Key Columns**: `id`, `site_name`, `tagline`, `short_description`, `long_description`, `maintenance_mode`, `announcement_banner_enabled`, `announcement_banner_text`, `copyright_text`.

### 3. `contact_information`
- **Purpose**: Public communication coordinates, status badge, response time SLA, and armored PGP public key.
- **Key Columns**: `id`, `email`, `location`, `status_badge`, `status_badge_subtext`, `response_time`, `consultation_title`, `consultation_description`, `pgp_key`.

### 4. `contact_submissions`
- **Purpose**: Stored inquiries submitted via the confidential consultation channel.
- **Key Columns**: `id`, `name`, `email`, `organization`, `subject`, `message`, `status` (`new`, `read`, `replied`, `archived`), `ip_address`, `user_agent`.

### 5. `social_links`
- **Purpose**: External links rendered in header and footer.
- **Key Columns**: `id`, `platform`, `label`, `url`, `icon`, `enabled`, `display_order`.

### 6. `navigation_items`
- **Purpose**: Header navbar and footer menu items.
- **Key Columns**: `id`, `location` (`navbar`, `footer`), `label`, `url`, `is_external`, `enabled`, `display_order`.

### 7. `projects` & `project_tags`
- **Purpose**: Portfolio projects, research prototypes, and security tooling.
- **Key Columns**: `id`, `title`, `slug` (unique), `short_description`, `full_description`, `category`, `status` (`planning`, `in_development`, `active`, `completed`, `archived`), `featured`, `published`, `accent_color`, `display_order`.

### 8. `research_articles` & `research_tags`
- **Purpose**: Threat advisories, technical papers, and vulnerability analysis.
- **Key Columns**: `id`, `title`, `slug` (unique), `excerpt`, `content`, `author`, `publication_date`, `reading_time`, `featured`, `published`.

### 9. `labs`
- **Purpose**: Hands-on security testing environments and cyber range simulations.
- **Key Columns**: `id`, `name`, `category`, `description`, `icon`, `status` (`available`, `coming_soon`, `in_development`, `archived`), `published`, `display_order`.

### 10. `technologies`
- **Purpose**: Core technologies and cryptographic primitives in the Cyberforage stack.
- **Key Columns**: `id`, `name`, `category`, `description`, `icon`, `enabled`, `display_order`.

### 11. `exploration_items`
- **Purpose**: Focus domains displayed in the "What We Explore" section.
- **Key Columns**: `id`, `title`, `description`, `accent_color`, `icon`, `enabled`, `display_order`.

### 12. `seo_settings`
- **Purpose**: Search engine and OpenGraph social metadata.
- **Key Columns**: `id`, `meta_title`, `meta_description`, `keywords`, `og_title`, `og_description`, `og_image_url`, `twitter_handle`, `canonical_url`, `robots_indexing`.

### 13. `appearance_settings`
- **Purpose**: Design tokens, Canvas globe lighting, and color themes.
- **Key Columns**: `id`, `primary_accent`, `secondary_accent`, `background_color`, `text_color`, `card_background`, `globe_color`, `glow_color`.

### 14. `media`
- **Purpose**: Uploaded image assets tracked in the `cyberforage-media` storage bucket.
- **Key Columns**: `id`, `file_name`, `storage_path`, `public_url`, `mime_type`, `file_size`, `alt_text`, `uploaded_by`.

### 15. `audit_logs`
- **Purpose**: Append-only log of all administrative operations.
- **Key Columns**: `id`, `user_id`, `action` (`create`, `update`, `delete`, `publish`, `login`, etc.), `entity_type`, `entity_id`, `entity_name`, `metadata` (JSONB), `created_at`.
