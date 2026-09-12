# Supabase Setup Guide for Cyberforage

This document provides complete instructions for setting up the PostgreSQL database, Authentication, Row Level Security (RLS), and Storage bucket for Cyberforage using Supabase.

---

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and log in or create an account.
2. Click **New Project** in your dashboard.
3. Select your preferred Organization, enter a project name (e.g. `cyberforage-production`), and set a strong database password.
4. Choose a region close to your primary audience (e.g., `eu-central-1` Zurich/Frankfurt or `us-east-1`).
5. Wait for the project to finish provisioning (~1-2 minutes).

---

## 2. Execute Database Migrations

The migrations are located in the repository under `supabase/migrations/`. Execute them in the exact order shown below in the **Supabase SQL Editor**:

1. Open **SQL Editor** from the left navigation in your Supabase dashboard.
2. Click **New Query**.
3. Copy and run the contents of each file in order:

### Migration 1: Schema & Tables
- **File**: `supabase/migrations/001_initial_schema.sql`
- **What it does**: Creates all 18 tables with UUID primary keys, foreign keys, timestamps, and indexes:
  - `profiles`
  - `site_settings`
  - `contact_information`
  - `contact_submissions`
  - `social_links`
  - `navigation_items`
  - `projects`, `project_technologies`, `project_tags`
  - `research_articles`, `research_tags`
  - `labs`
  - `technologies`
  - `exploration_items`
  - `seo_settings`
  - `appearance_settings`
  - `media`
  - `audit_logs`

### Migration 2: Row Level Security (RLS)
- **File**: `supabase/migrations/002_rls_policies.sql`
- **What it does**: Enables RLS on all 18 tables, defines security helper functions (`get_user_role()`, `is_super_admin()`, `is_admin()`, `is_editor()`), allows public read on published records, restricts admin mutations based on RBAC, and creates append-only audit policies.

### Migration 3: Automated Triggers & Guardrails
- **File**: `supabase/migrations/003_functions.sql`
- **What it does**: Sets up automated `updated_at` triggers, sets up `handle_new_user()` trigger for new Supabase Auth registrations, and installs the `protect_last_super_admin()` safety trigger to prevent accidental lockout.

### Migration 4: Canonical Seed Data
- **File**: `supabase/migrations/004_seed_data.sql`
- **What it does**: Populates initial database rows with canonical data matching the live public Cyberforage website.

### Migration 5: Contact & Social Management
- **File**: `supabase/migrations/005_contact_social_schema.sql`
- **What it does**: Extends contact information, social links, and owner branding fields.

### Migration 6: Single Administrator Architecture
- **File**: `supabase/migrations/006_remove_rbac_single_admin.sql`
- **What it does**: Removes the multi-role RBAC system, drops obsolete lockout triggers, simplifies security functions, and refreshes RLS policies to grant full CRUD to the authenticated administrator.

---

## 3. Storage Bucket Configuration

1. In the Supabase Dashboard, navigate to **Storage**.
2. Click **New Bucket**.
3. Set the bucket name to:
   ```
   cyberforage-media
   ```
4. Toggle **Public bucket** to **ON** (so public portfolio assets and preview images can be resolved via CDN).
5. Set the maximum upload file size to `5 MB`.
6. Under Allowed MIME types, specify:
   ```
   image/png, image/jpeg, image/webp, image/svg+xml
   ```
7. Click **Save**.

---

## 4. Retrieve API Credentials

1. In the Supabase Dashboard, navigate to **Project Settings** > **API**.
2. Copy the following keys:
   - **Project URL**: (e.g. `https://your-project.supabase.co`)
   - **anon / public key**: (used on client & server)
   - **service_role key**: (SECRET: never commit or expose on client)

---

## 5. Environment Variables Configuration

Create a file named `.env.local` in your project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Single Administrator User UUID (Optional but recommended)
ADMIN_USER_ID=your-admin-user-uuid

# Optional Site URL
NEXT_PUBLIC_SITE_URL=https://cyberforage.space
```

> **CRITICAL SECURITY NOTE**: Never commit `.env.local` or `.env` to Git. Ensure `.gitignore` includes all `.env*` files except `.env.example`.
