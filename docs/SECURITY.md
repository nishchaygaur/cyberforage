# Cyberforage Security Architecture & Posture

Cyberforage implements a rigorous defense-in-depth security model designed to resist unauthorized access, privilege escalation, data leakage, and administrative lockouts.

---

## 1. Security Architecture Layers

```
[ Incoming Request ]
         │
         ▼
[ Edge Middleware ] ──────────────► Validates session cookie, checks JWT, rejects invalid requests
         │
         ▼
[ Server Components & Actions ] ──► Server-side session verification & role enforcement
         │
         ▼
[ Supabase PostgreSQL RLS ] ──────► Database-level constraint: checks auth.uid() & public.profiles.role
         │
         ▼
[ Append-Only Audit Log ] ────────► Logs actor, timestamp, action, entity, and state mutation payload
```

---

## 2. Key Separation & Secret Management

- **Public Key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)**:
  - Safe for client and browser execution.
  - Grants read-only access to published content.
  - Can only perform mutations if the user is authenticated AND permitted by RLS policies.
- **Service Role Key (`SUPABASE_SERVICE_ROLE_KEY`)**:
  - **NEVER** exposed on the client or in browser bundles.
  - Used strictly in server-only scripts, migrations, or automated background tasks.
  - Kept in server environment variables on Vercel.

---

## 3. Defense-in-Depth RLS Policies

Every table in the PostgreSQL database has Row Level Security explicitly enabled:

1. **Public Read**:
   - `projects`: `published = true`
   - `research_articles`: `published = true`
   - `labs`: `published = true`
   - `technologies`: `enabled = true`
   - `exploration_items`: `enabled = true`
   - `social_links`: `enabled = true`
   - `navigation_items`: `enabled = true`
   - `site_settings`: `true`
   - `contact_information`: `enabled = true`

2. **Mutation Restrictions**:
   - Only accounts with active sessions (`auth.uid() IS NOT NULL`), `is_active = true`, and sufficient role (`editor`, `admin`, or `super_admin`) can insert, update, or delete records.

3. **Append-Only Audit Logs**:
   - Audit logs allow `INSERT` operations only.
   - `UPDATE` and `DELETE` on `audit_logs` are strictly denied for all roles, preserving audit trail integrity.

---

## 4. Anti-Lockout Safeguards

To prevent catastrophic operational lockout where an organization loses all Super Admin accounts:
- Database trigger `protect_last_super_admin()` checks every `UPDATE` or `DELETE` on `public.profiles`.
- If an operation would leave fewer than 1 active Super Admin, the transaction is immediately aborted with a PostgreSQL exception:
  ```
  Operation blocked: Cannot delete or demote the last remaining active Super Admin.
  ```

---

## 5. Web Search Engine & Bot Defense

- `/app/robots.ts` explicitly disallows crawling of `/admin/` and `/admin/*`.
- `/app/admin/layout.tsx` injects `<meta name="robots" content="noindex, nofollow" />` across all administrative views.
