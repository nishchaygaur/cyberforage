# Supabase Setup Guide for Cyberforage

This document provides quick instructions for connecting your Supabase database and setting up the master administrator account for Cyberforage.

---

## 1. Authorized Administrator Account
- **Master Admin Email**: `nishchay.gaur.official@gmail.com`
- **Master Admin Password**: `Siddhi@123`

---

## 2. Retrieve Your Supabase API Credentials
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Select your Cyberforage project.
3. In the left navigation, click on **Project Settings** (gear icon) -> **API**.
4. Copy the following two values:
   - **Project URL** (e.g. `https://xyzabcdefghijkl.supabase.co`)
   - **anon / public key** (the long string starting with `eyJhbGciOi...`)

---

## 3. Configure Environment Variables

### In Local Development
Create a `.env` file in the project root:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_ADMIN_EMAIL=nishchay.gaur.official@gmail.com
```

### In Vercel (Production Deployment)
1. Go to [https://vercel.com/nishchay-gaurs-projects/cyberforage/settings/environment-variables](https://vercel.com/nishchay-gaurs-projects/cyberforage/settings/environment-variables).
2. Add the two environment variables:
   - `VITE_SUPABASE_URL` = (your Supabase URL)
   - `VITE_SUPABASE_ANON_KEY` = (your Supabase anon key)
3. Trigger a redeploy (or push any commit) so Vercel injects the environment variables into the build.

---

## 4. Execute the Database Migration
In your Supabase Dashboard:
1. Navigate to **SQL Editor** in the left sidebar.
2. Click **New Query**.
3. Paste the contents of `supabase/migrations/008_admin_content_sync.sql` and click **Run**.
4. This creates the `public.site_cms_state` table and locks down editing strictly to `nishchay.gaur.official@gmail.com`.

---

## 5. Create or Verify the Admin User in Supabase Auth (Optional)
If you wish to manage the user directly in Supabase Auth:
1. Navigate to **Authentication** -> **Users**.
2. Click **Add User** -> **Create User**.
3. Enter:
   - **Email**: `nishchay.gaur.official@gmail.com`
   - **Password**: `Siddhi@123`
   - Check **Auto Confirm Email**.
4. Click **Create User**.
*(Note: If not created in Supabase Auth, the system will seamlessly verify your master credentials and sync safely).*
