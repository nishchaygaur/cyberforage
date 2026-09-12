# Cyberforage Production Deployment Guide

This guide describes how to deploy Cyberforage to production on Vercel, connect the Supabase backend, and bind the custom domain `https://cyberforage.space`.

---

## 1. Prerequisites Checklist

Before deploying, ensure you have:
1. Created a Supabase project and executed the 4 migration scripts in `supabase/migrations/`.
2. Created the `cyberforage-media` storage bucket in Supabase.
3. Created your initial `super_admin` account.
4. Access to your Vercel project (`cyberforage`).

---

## 2. Configure Environment Variables on Vercel

In your Vercel Project Dashboard:
1. Go to **Settings** > **Environment Variables**.
2. Add the following keys for **Production**, **Preview**, and **Development**:

| Variable Name | Description | Scope |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL (`https://...supabase.co`) | Client & Server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Anon Public Key | Client & Server |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase Service Role Secret Key | Server Only |
| `NEXT_PUBLIC_SITE_URL` | `https://cyberforage.space` | Client & Server |

---

## 3. Deploy via Git

Push the repository changes to the `main` branch on GitHub:

```bash
git add .
git commit -m "feat(cms): complete production admin and database integration"
git push origin main
```

Vercel will automatically detect the commit, run `npm run build`, and deploy the production release.

---

## 4. Post-Deployment Verification

1. **Verify Public Homepage**:
   - Navigate to `https://cyberforage.space`.
   - Confirm layout, typography, 3D Canvas globe, animations, and dark luxury aesthetic are pristine.
   - Verify that all project, lab, research, and technology cards load.

2. **Verify Admin Portal**:
   - Navigate to `https://cyberforage.space/admin/login`.
   - Log in with your Super Admin credentials.
   - Confirm dashboard metrics, project table, research table, and audit trail load without errors.

3. **Verify Security Controls**:
   - Open an incognito browser window and navigate directly to `https://cyberforage.space/admin`.
   - Confirm immediate redirect to `/admin/login`.
   - Test `https://cyberforage.space/robots.txt` to confirm `/admin/` is disallowed.
