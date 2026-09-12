# Cyberforage Admin Setup & Operator Guide

This guide describes how to provision and configure the single Administrator account for the Cyberforage CMS.

---

## 1. Single Administrator Model

Cyberforage uses a single-administrator architecture:
- There is exactly **one** administrator.
- There is no role hierarchy (`super_admin`, `admin`, `editor`), no user management UI, and no public registration.
- The authenticated administrator has complete CRUD control across all CMS sections (Projects, Research, Labs, Technologies, Exploration, Site Settings, Contact Info, Social Links, Inquiries, Navigation, Appearance, SEO, Media Library, and Audit Logs).

---

## 2. Provisioning the Administrator Account

### Step 1: Create Account in Supabase Dashboard
1. Open your project in the [Supabase Dashboard](https://supabase.com).
2. Navigate to **Authentication** > **Users**.
3. Click **Add User** > **Create User**.
4. Enter your email and a secure password.
5. Check **Auto Confirm User?** so the account is immediately verified.
6. Click **Create User**.
7. Copy the generated User ID (UUID).

### Step 2: (Recommended) Configure `ADMIN_USER_ID`
To cryptographically lock the CMS to this specific user ID, add the UUID to your environment variables (e.g. in `.env.local` or Vercel Environment Variables):
```env
ADMIN_USER_ID=your-admin-user-uuid
```
- If set: only this specific authenticated Supabase user is granted administrative access. Any other authenticated Supabase account will be rejected with `Forbidden`.
- If unset (local development): any authenticated user session created through Supabase Auth has administrative access.

---

## 3. Accessing the Admin Dashboard

1. Navigate to:
   ```
   https://cyberforage.space/admin/login
   ```
   *(or `http://localhost:3000/admin/login` in development)*
2. Enter your administrator email and password, then click **Sign In**.
3. Upon successful validation, you are redirected directly to the Command Center (`/admin`).

---

## 4. Emergency Recovery & Password Reset

- **Password Reset**: If you forget your password, use the **Forgot Password?** link on `/admin/login` or trigger a password reset email directly from the Supabase Dashboard.
- **Account Rotation**: To rotate your admin account, create a new user in the Supabase Dashboard and update the `ADMIN_USER_ID` environment variable with the new user UUID.

