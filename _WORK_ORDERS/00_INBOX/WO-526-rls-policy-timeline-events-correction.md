---
id: WO-526
title: Multi-Practitioner Notes — RLS Policy Correction (log_session_timeline_events)
owner: LEAD
status: 01_TRIAGE
filed_by: INSPECTOR
date: 2026-03-03
priority: P1
table: log_session_timeline_events
apply_method: Supabase SQL editor — apply simultaneously to staging + production
depends_on: WO-527
inspector_status: APPROVED
---

==== INSPECTOR ====

## INSPECTOR Schema Finding & Remediation

> **Work Order:** WO-526 — RLS Policy Correction: `log_session_timeline_events`
> **Filed by:** INSPECTOR
> **Date:** 2026-03-03

> ⚠️ **Requires `/migration-execution-protocol` workflow. No exceptions.**
> ⚠️ **Depends on WO-527.** `log_user_sites` table is currently empty. The new INSERT policy references this table. Enroll practitioners in WO-527 before testing this policy.

---

### Dashboard Finding (INSPECTOR Confirmed)

From the Supabase dashboard screenshot provided 2026-03-03:

| Policy Name | Command | Applied To |
|---|---|---|
| Users can insert timeline events | INSERT | **public** |
| Users can select their site timeline events | SELECT | public |

**The INSERT policy is applied to the `public` role — not `authenticated`.** This means any user, including unauthenticated users, can INSERT into `log_session_timeline_events`. This is an active security misconfiguration. It does not currently cause data corruption (the app only calls this endpoint from authenticated sessions), but it is not compliant with the Zero-PHI security posture.

---

### Required Change

Apply the following SQL in the **Supabase SQL editor** simultaneously to staging and production:

```sql
-- WO-526: Fix over-permissive INSERT policy on log_session_timeline_events
-- Apply to BOTH staging and production simultaneously.
-- Safe to run: drop is scoped to the specific named policy only.

-- Step 1: Remove the existing public INSERT policy
DROP POLICY IF EXISTS "Users can insert timeline events" ON public.log_session_timeline_events;

-- Step 2: Create new site-scoped authenticated INSERT policy
CREATE POLICY "site_practitioners_insert_timeline_events"
  ON public.log_session_timeline_events
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IN (
      SELECT lus.user_id
      FROM public.log_user_sites lus
      INNER JOIN public.log_clinical_records lcr ON lcr.site_id = lus.site_id
      WHERE lcr.id = session_id
        AND lus.is_active = true
    )
  );
```

> ⚠️ **Depends on WO-527 data.** `log_user_sites` is currently empty. After applying this SQL, no inserts will succeed until practitioners are enrolled in `log_user_sites`. Apply WO-527 enrollments at the same time.

This allows any practitioner with `is_active = true` in `log_user_sites` at the same site as the session to write — and blocks all unauthenticated or cross-site writes.

---

### Constraints

- ADDITIVE POLICY ONLY — drop the existing `public` INSERT policy, add the new `authenticated` + site-scoped policy
- Do NOT modify the SELECT policy ("Users can select their site timeline events") — review it first to confirm it already uses site-scoping, but do not change it without a separate WO
- Migration must follow `/migration-execution-protocol` — Docker-first, staging before production
- INSPECTOR must re-verify the policy in dashboard after migration

---

### INSPECTOR Sign-Off Conditions

- [ ] Old `public` INSERT policy removed
- [ ] New `authenticated` + site-scoped INSERT policy active in dashboard
- [ ] Insert attempt from unauthenticated context returns 403 (tested via curl or Supabase API explorer)
- [ ] Authenticated practitioner with matching `log_user_sites` entry can insert successfully
- [ ] Authenticated practitioner WITHOUT a `log_user_sites` entry at that site is blocked

==== INSPECTOR ====

---

## ✅ INSPECTOR Live DB Audit — 2026-03-03

**Status: CLEARED — but HARD GATED on WO-527 enrollment**

### Confirmed Current Policy State
```
policyname: "Users can insert timeline events"
cmd: INSERT
roles: {public}   ← VULNERABILITY CONFIRMED
```
This policy must NOT be applied until WO-527 has shipped and `log_user_sites` has ≥1 active row.
Applying this fix with 0 enrolled users would permanently block all timeline writes with no recovery path.

### Mandatory Pre-Apply Check
Run before executing ANY SQL for this WO:
```sql
SELECT COUNT(*) FROM public.log_user_sites WHERE is_active = true;
-- Must return > 0. If 0, STOP. Do not proceed.
```

### Session-Resolved: Status Update
- `status` updated to `00_INBOX_GATED` — move to `01_TRIAGE` only after WO-527 closes
