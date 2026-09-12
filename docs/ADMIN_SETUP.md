# Cyberforage Admin Setup & Operator Guide

This guide describes how to provision the initial Super Admin account, manage team access, and use the administrative features of the Cyberforage CMS.

---

## 1. Creating Your First Super Admin Account

### Method A: Via Supabase Dashboard (Recommended)

1. Open your project in the [Supabase Dashboard](https://supabase.com).
2. Go to **Authentication** > **Users**.
3. Click **Add User** > **Create User**.
4. Enter your email and a strong password (minimum 12 characters).
5. Check **Auto Confirm User?** so the account is immediately verified.
6. Click **Create User**.
7. Now promote this account to `super_admin`. Open the **SQL Editor** and run:
   ```sql
   UPDATE public.profiles
   SET role = 'super_admin', is_active = true
   WHERE id = (SELECT id FROM auth.users WHERE email = 'your-email@example.com');
   ```

### Method B: Self-Registration & Promotion

1. Navigate to your deployed site: `https://cyberforage.space/admin/login` (or `http://localhost:3000/admin/login`).
2. New users created through the Supabase Auth system automatically receive a default `editor` profile row via the `handle_new_user()` trigger.
3. An existing Super Admin can navigate to `/admin/users` and elevate the user to `admin` or `super_admin`.

---

## 2. Accessing the Admin Dashboard

1. Navigate to:
   ```
   https://cyberforage.space/admin/login
   ```
2. Enter your credentials and click **Authenticate**.
3. Upon successful validation, you are redirected to `/admin`.
4. If an account is inactive (`is_active = false`), authentication is rejected with an explicit security notice.

---

## 3. Role-Based Access Control (RBAC) Matrix

Cyberforage implements 3 distinct administrative roles:

| Module / Operation | Super Admin | Admin | Editor |
|---|:---:|:---:|:---:|
| View Dashboard & Analytics | ✅ | ✅ | ✅ |
| Manage Projects (CRUD) | ✅ | ✅ | ✅ |
| Manage Research (CRUD) | ✅ | ✅ | ✅ |
| Manage Labs (CRUD) | ✅ | ✅ | ✅ |
| Manage Technologies (CRUD) | ✅ | ✅ | ✅ |
| Manage Exploration (CRUD) | ✅ | ✅ | ✅ |
| Upload & Delete Media Assets | ✅ | ✅ | ✅ |
| View & Triage Inquiries | ✅ | ✅ | ✅ |
| Delete Inquiries | ✅ | ✅ | ❌ |
| Update Site Brand & Settings | ✅ | ✅ | ❌ |
| Update Appearance Tokens | ✅ | ✅ | ❌ |
| Update SEO Metadata | ✅ | ✅ | ❌ |
| View Immutable Audit Logs | ✅ | ✅ | ❌ |
| User Role Promotion / Demotion | ✅ | ❌ | ❌ |
| Activate / Deactivate Accounts | ✅ | ❌ | ❌ |

---

## 4. Safety Guardrails & Emergency Recovery

- **Last Super Admin Lockout Protection**: The database enforces a trigger `prevent_last_super_admin_removal` that blocks deletion, deactivation, or demotion of the final active Super Admin.
- **Password Reset**: If an operator forgets their password, they can use `/admin/forgot-password` to receive a secure Supabase recovery link.
