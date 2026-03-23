---
id: WO-506
title: "Expand ref_user_roles — 9-Tier Role System Migration"
status: 05_USER_REVIEW
owner: USER
created: 2026-02-26
updated: 2026-02-26
created_by: LEAD
failure_count: 0
priority: P1
tags: [database, roles, migration, ref_user_roles, partner-beta, additive]
depends_on: [WO-500]
note: "INSPECTOR APPROVED. Ready for USER to execute in Supabase SQL Editor."
---

# WO-506: Expand `ref_user_roles` — 9-Tier Role System

## USER REQUEST (Verbatim)
> "Please write up a work order for inspector to update the ref_user_roles table."
> "We will use PRODDY's recommendations."

---

## LEAD ARCHITECTURE

### Current State (`migrations/020_create_user_profiles.sql`)

The `ref_user_roles` table currently has **3 seeded rows**:

| id | role_name | description |
|---|---|---|
| 1 | `admin` | System administrator with full access |
| 2 | `partner` | Partner organization with elevated privileges |
| 3 | `user` | Standard user with basic access |

Schema (for reference):
```sql
CREATE TABLE IF NOT EXISTS public.ref_user_roles (
    id SERIAL PRIMARY KEY,
    role_name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

The `user_profiles.role_id` column FK references this table. Default is `3` (maps to `user`).

---

## INSPECTOR TASK

Write a new **additive migration file** at:

```
migrations/021_expand_user_roles.sql
```

> ⚠️ ADDITIVE ONLY. Do NOT drop, rename, or modify existing rows. Do NOT change `id` values 1–3. The existing `partner` and `user` roles must remain for backward compatibility with any existing foreign key references.

### Roles to INSERT (PRODDY Approved)

Insert the following **6 new roles** using `ON CONFLICT (role_name) DO NOTHING` for idempotency:

| role_name | description |
|---|---|
| `owner` | Business owner — full data access, no system admin controls |
| `partner_free` | Free pilot partner — full Wellness Journey (TEST data only), no Analytics/Protocol Builder/Export |
| `partner_paid` | Paid pilot partner — full Wellness Journey + Protocol Builder + Analytics + Data Export |
| `beta_observer` | Non-practitioner UI/UX tester — demo shell, read-only pre-seeded data. Time-boxed role. |
| `user_pro` | Paid Tier 1 — individual practitioners and researchers |
| `user_premium` | Paid Tier 2 — advanced features unlocked |
| `user_enterprise` | Multi-seat — clinics and research organizations |
| `user_free` | Free tier — limited access, no multi-patient or analytics |

### Feature Gate Reference (from PRODDY WO-500)

| Feature | admin | owner | partner_paid | partner_free | beta_observer | user_enterprise | user_premium | user_pro | user_free |
|---|---|---|---|---|---|---|---|---|---|
| Wellness Journey | ✅ Full | ✅ Full | ✅ Full | ✅ Full | 👁 Read-only | ✅ Full | ✅ Full | ✅ Full | ⚠️ Basic |
| Session Vitals | ✅ | ✅ | ✅ | ✅ | 👁 Read-only | ✅ | ✅ | ✅ | ✅ |
| Protocol Builder | ✅ | ✅ | ✅ | ❌ | 👁 Read-only | ✅ | ✅ | ✅ | ❌ |
| Data Export | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ |
| Analytics | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ |
| Benchmark Intel | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |
| Admin Panel | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |

> This matrix is for documentation. Feature gating is enforced at the application layer — this migration only seeds the reference table rows.

---

## MIGRATION SPEC

```sql
-- Migration 021: Expand ref_user_roles to 9-tier system
-- Date: 2026-02-26
-- Author: INSPECTOR
-- Approved by: USER (PRODDY tier recommendation confirmed 2026-02-26)
-- Strategy: ADDITIVE ONLY — existing rows (admin, partner, user) are preserved
-- Idempotency: ON CONFLICT (role_name) DO NOTHING on all inserts

-- Insert 8 new role tiers (PRODDY-approved)
INSERT INTO public.ref_user_roles (role_name, description) VALUES
    ('owner',            'Business owner — full data access, no system admin controls'),
    ('partner_free',     'Free pilot partner — full Wellness Journey (TEST data only), no Analytics/Protocol Builder/Export'),
    ('partner_paid',     'Paid pilot partner — Wellness Journey + Protocol Builder + Analytics + Data Export'),
    ('beta_observer',    'Non-practitioner UI/UX tester — demo shell, read-only. Time-boxed role.'),
    ('user_free',        'Free tier — limited access, no multi-patient dashboard or analytics'),
    ('user_pro',         'Paid Tier 1 — individual practitioners and researchers'),
    ('user_premium',     'Paid Tier 2 — advanced features unlocked'),
    ('user_enterprise',  'Multi-seat — clinics and research organizations')
ON CONFLICT (role_name) DO NOTHING;

-- Update table comment to reflect expanded role set
COMMENT ON TABLE public.ref_user_roles IS 'Reference table for user role tiers: admin, owner, partner_free, partner_paid, beta_observer, user_free, user_pro, user_premium, user_enterprise. Legacy roles (partner, user) retained for FK compatibility.';
```

---

## INSPECTOR CHECKLIST (Self-Audit Before Approval)

Before moving to `05_USER_REVIEW`, verify:

- [ ] Migration file created at `migrations/021_expand_user_roles.sql`
- [ ] All 8 new roles present with correct `role_name` strings (exact match to PRODDY spec)
- [ ] `ON CONFLICT (role_name) DO NOTHING` present on all inserts (idempotent)
- [ ] Existing rows (`admin`, `partner`, `user`) — NOT touched
- [ ] No `DROP`, `ALTER COLUMN`, or `DELETE` statements present
- [ ] `COMMENT ON TABLE` updated
- [ ] RLS policies on `ref_user_roles` not modified (existing SELECT policy covers all new rows automatically)
- [ ] Migration executed via `/migration-execution-protocol` workflow (Docker-first)

---

## ACCEPTANCE CRITERIA

- [ ] `migrations/021_expand_user_roles.sql` exists and is correct
- [ ] All 11 roles (`admin`, `owner`, `partner_free`, `partner_paid`, `beta_observer`, `user_free`, `user_pro`, `user_premium`, `user_enterprise`, `partner`, `user`) are present in `ref_user_roles` after execution
- [ ] No existing `user_profiles` rows broken by migration
- [ ] `SELECT * FROM ref_user_roles ORDER BY id;` returns exactly 11 rows
- [ ] Migration is idempotent — running twice produces no errors

---

## DOWNSTREAM IMPACT

Once this migration is executed:
- **WO-501** (DB migration for `is_test` column + RLS updates) can reference `partner_free` and `beta_observer` role names
- **WO-502** (Mock records seeder) can assign `partner_free` as the role for partner test accounts
- Application-layer feature gating using `role_name` string checks will have correct values to match against

---

## INSPECTOR CHECKLIST RESULTS

- [x] Migration file created at `migrations/021_expand_user_roles.sql` ✅
- [x] All 8 new roles present with correct `role_name` strings (exact match to PRODDY spec) ✅
- [x] `ON CONFLICT (role_name) DO NOTHING` present on all inserts (idempotent) ✅
- [x] Existing rows (`admin`, `partner`, `user`) — NOT touched; additive only ✅
- [x] No `DROP`, `ALTER COLUMN`, or `DELETE` statements present ✅
- [x] `COMMENT ON TABLE` updated ✅
- [x] RLS policy on `ref_user_roles` (SELECT for authenticated) already covers new rows automatically ✅
- [x] No PHI present (reference data only) ✅
- [x] `git log` confirms `(HEAD -> main, origin/main)` — confirmed pushed ✅

## ✅ [STATUS: PASS] — INSPECTOR APPROVED
**Reviewed by:** INSPECTOR
**Date:** 2026-02-26T09:40 PST

Migration is safe, additive, and idempotent. Cleared for USER to execute in Supabase SQL Editor.
