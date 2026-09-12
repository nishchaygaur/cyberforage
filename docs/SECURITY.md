# Cyberforage Security Architecture & Posture

Cyberforage implements a streamlined, defense-in-depth security model built around a single-administrator design, eliminating attack surface associated with multi-tenant role escalations and multi-role hierarchies.

---

## 1. Security Architecture Layers

```
[ Incoming Request ]
         │
         ▼
[ Edge Middleware ] ──────────────► Validates session cookie, checks JWT, checks optional ADMIN_USER_ID
         │
         ▼
[ Server Components & Actions ] ──► Server-side requireAdmin() session validation & UUID allowlist enforcement
         │
         ▼
[ Supabase PostgreSQL RLS ] ──────► Database-level constraint: TO authenticated USING (auth.uid() IS NOT NULL)
         │
         ▼
[ Append-Only Audit Log ] ────────► Immutable record of all administrative operations & state mutations
```

---

## 2. Key Separation & Secret Management

- **Public Key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)**:
  - Safe for client and browser execution.
  - Grants read-only access to published/enabled content.
  - Can only perform mutations if the user is authenticated as the administrator (or submitting to `contact_submissions`).
- **Service Role Key (`SUPABASE_SERVICE_ROLE_KEY`)**:
  - **NEVER** exposed on the client or in browser bundles.
  - Used strictly in server-only scripts, migrations, or automated background tasks.
  - Kept in server environment variables.
- **Admin Identity Pinning (`ADMIN_USER_ID`)**:
  - Optional server-side environment variable.
  - Never exposed to the client (no `NEXT_PUBLIC_` prefix).
  - Pins CMS administration strictly to the administrator's Supabase Auth UUID.

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
   - `contact_information`: `true`

2. **Public Insert**:
   - `contact_submissions`: anonymous visitors can insert inquiries.

3. **Administrator CRUD**:
   - Gated to authenticated sessions: `TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL)`.
   - Anonymous requests cannot mutate any CMS table.

4. **Append-Only Audit Logs**:
   - Audit logs allow `INSERT` operations only.
   - `UPDATE` and `DELETE` on `audit_logs` are strictly denied, preserving audit trail integrity.

---

## 4. Web Search Engine & Bot Defense

- `/app/robots.ts` explicitly disallows crawling of `/admin/` and `/admin/*`.
- `<meta name="robots" content="noindex, nofollow" />` is enforced across all administrative views.

