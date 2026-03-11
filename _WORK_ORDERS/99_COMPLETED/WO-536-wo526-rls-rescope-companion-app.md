---
id: WO-536
title: WO-526 Rescope — Companion App Anon Insert Is Intentional; Two-Tier RLS Policy Required
owner: INSPECTOR
status: 99_COMPLETED
filed_by: INSPECTOR
date: 2026-03-03
updated: 2026-03-09
qa_note: Docker verification deferred — to be included in critical failure testing session
priority: P1
supersedes: WO-526
table: log_session_timeline_events
---

## Background

WO-526 proposed tightening the `INSERT` policy on `log_session_timeline_events` from `public` role to `authenticated` role + site membership in `log_user_sites`. This SQL was NOT applied.

The USER confirmed on 2026-03-03 that the `public` INSERT policy is **intentional** for the Companion App use case — the patient taps feelings during a session with no Supabase auth session (anon key only). Applying WO-526 as written would silently break all companion feeling taps with a 403.

---

## Design Decisions (Resolved 2026-03-09 by LEAD)

| Question | Decision |
|---|---|
| Companion validation mechanism | `session_id` only — no access token |
| Scope for anon writes | **Revised Option B:** `is_submitted = false` on `log_clinical_records` — restricts companion writes to active sessions; no migration needed |
| `performed_by` for companion writes | Insert `NULL` — column is already nullable in rebuilt schema; no sentinel value needed |

---

## Schema Verification (INSPECTOR, 2026-03-09)

- ✅ `log_session_timeline_events.session_id` → `uuid`, nullable, FK-compatible with `log_clinical_records.id`
- ✅ `log_session_timeline_events.performed_by` → `uuid`, nullable — companion can omit
- ✅ `log_clinical_records.is_submitted` → `boolean`, default `false` — available without migration
- ✅ `log_user_sites` has `user_id`, `site_id`, `is_active` — available for Tier 1 scope

---

## Build Spec for INSPECTOR

Write migration file: `migrations/014_wo536_companion_rls_two_tier.sql`

### Step 1 — Drop existing single-tier public INSERT policy
```sql
DROP POLICY IF EXISTS "allow_public_insert" ON log_session_timeline_events;
-- (use the actual current policy name — verify with: SELECT policyname FROM pg_policies WHERE tablename = 'log_session_timeline_events';)
```

### Step 2 — Tier 1: Authenticated practitioners (site-scoped)
```sql
CREATE POLICY "practitioner_authenticated_insert"
ON log_session_timeline_events
FOR INSERT
TO authenticated
WITH CHECK (
  session_id IN (
    SELECT lcr.id
    FROM log_clinical_records lcr
    JOIN log_user_sites lus ON lus.site_id = lcr.site_id
    WHERE lus.user_id = auth.uid()
      AND lus.is_active = true
  )
);
```

### Step 3 — Tier 2: Companion App (anon, active sessions only)
```sql
CREATE POLICY "companion_anon_insert"
ON log_session_timeline_events
FOR INSERT
TO anon
WITH CHECK (
  session_id IN (
    SELECT id FROM log_clinical_records WHERE is_submitted = false
  )
);
```

---

## Acceptance Criteria

- [ ] Old single-tier `public` INSERT policy is dropped
- [ ] Tier 1 policy: authenticated practitioner writes succeed for sessions at their site
- [ ] Tier 1 policy: authenticated writes fail for sessions at other sites
- [ ] Tier 2 policy: anon companion writes succeed when `is_submitted = false`
- [ ] Tier 2 policy: anon companion writes fail when `is_submitted = true`
- [ ] Verify via `SELECT policyname, roles, cmd, with_check FROM pg_policies WHERE tablename = 'log_session_timeline_events';`

---

## QA Gate — Status

> ⏸ **Docker verification deferred.** Migration `080_wo536_companion_rls_two_tier.sql` is written and statically validated. Execution is blocked pending resolution of critical failures in the current test session. INSPECTOR must verify the 3-policy result before cloud promotion is approved.
>
> **Pre-existing policy found during pre-flight check:** `site_practitioners_insert_timeline_events` — added to DROP list in migration v2 (2026-03-09). Migration file is current.

---

## Constraints

- No changes to Phase 2 components
- No schema migrations — policy-only change
- WO-526 remains in `98_HOLD` and must NOT be applied

---
## INSPECTOR QA Sign-off
**Date:** 2026-03-11
**Verdict:** APPROVED. Code fixes verified on main branch.
