---
id: WO-527
title: Multi-Practitioner Notes — Practitioner Enrollment UI (log_user_sites)
owner: LEAD
status: 02_DESIGN_READY
filed_by: PRODDY
date: 2026-03-03
priority: P1
table: log_user_sites
blocks: WO-525, WO-526
---

==== PRODDY ====

## PRODDY PRD

> **Work Order:** WO-527 — Practitioner Enrollment: `log_user_sites`
> **Authored by:** PRODDY
> **Date:** 2026-03-03
> **Status:** Draft → Pending LEAD review

> ⚠️ **Blocks WO-525 and WO-526.** The `log_user_sites` table is confirmed empty (0 records, verified via Supabase Table Editor 2026-03-03). Until practitioners are enrolled at a site, the multi-practitioner RLS policy (WO-526) will block all writes, and multi-practitioner testing (WO-525) is impossible.

---

### 1. Problem Statement

`log_user_sites` has the correct schema (`user_id`, `site_id`, `role`, `is_active`, `created_at`) and the correct RLS policies (`user_sites_select`, `user_sites_write_network_admin`, `Users read own sites`). However, the table is empty — no practitioner is enrolled at any site. Without these records, the site-scoped RLS policies on `log_clinical_records` and `log_session_timeline_events` cannot authorize secondary practitioners to access a session. Multi-practitioner collaboration is architecturally blocked at the data level until enrollment exists.

---

### 2. Target User + Job-To-Be-Done

A lead practitioner needs to enroll themselves and their assisting practitioners at their clinic site so that all enrolled practitioners can access and contribute to any active dosing session at that site.

---

### 3. Success Metrics

1. After completing the enrollment flow, a `log_user_sites` row exists for each enrolled practitioner with correct `user_id`, `site_id`, `role`, and `is_active = true` — confirmed via Supabase Table Editor.
2. An enrolled secondary practitioner can open a session created by the lead practitioner and see the `DosingSessionPhase` without a permission error — confirmed by test login.
3. A non-enrolled user attempting the same action is blocked by RLS — confirmed by test login with a user not in `log_user_sites`.

---

### 4. Feature Scope

#### ✅ In Scope
- A "Site Team" management UI within the existing `Settings` page (no new route required)
- Lead practitioner can search for another user by email → add them to `log_user_sites` for their site with a role of `practitioner`
- Lead practitioner can set `is_active = false` to deactivate a team member (no DELETE — additive only per DB rules)
- Display current enrolled team members in a list with their `role` and `is_active` status

#### ❌ Out of Scope
- Creating new user accounts (enrollment only — the target practitioner must already have a PPN account)
- Changing session ownership (`practitioner_id` on `log_clinical_records` is not modified)
- Modifying `log_user_sites` RLS policies (already in place, INSPECTOR confirmed)
- Any changes outside `Settings.tsx` and `clinicalLog.ts` service layer

---

### 5. Priority Tier

**[x] P1** — Ship this sprint

**Reason:** This is the prerequisite for all multi-practitioner collaboration features (WO-525, WO-526). Without it, Dr. Allen's request cannot be fulfilled at all. Table is confirmed empty today.

---

### 6. Open Questions for LEAD

1. What `role` values are valid in `log_user_sites.role` (TEXT column)? Proposed: `'lead_practitioner'`, `'practitioner'`, `'observer'` — confirm or correct.
2. Should the enrollment UI be on the existing `/settings` page, or on a new practitioner-profile page?
3. Can any authenticated user enroll others, or only users who themselves have `user_sites_write_network_admin` policy access?

---

### PRODDY Sign-Off Checklist

- [x] Problem Statement ≤100 words, no solution ideas
- [x] Job-To-Be-Done single sentence, correct format
- [x] All 3 metrics measurable
- [x] Out of Scope populated
- [x] Priority tier named reason
- [x] Open Questions ≤5 items
- [x] Word count ≤600
- [x] No code, SQL, or schema written
- [x] Frontmatter: `owner: LEAD`, `status: 01_TRIAGE`

==== PRODDY ====

---

## ✅ INSPECTOR Sign-Off — 2026-03-03

**Status: CLEARED FOR BUILD (with pre-build gates)**

### Confirmed Schema State
- `log_user_sites` columns: `user_id` (uuid), `site_id` (uuid), `role` (text), `is_active` (boolean), `created_at` (timestamptz)
- Existing CHECK constraint: `user_sites_role_check` → valid values: `network_admin`, `site_admin`, `clinician`, `analyst`, `auditor`
- **Current enrolled rows: 0**

### USER Decisions (Resolved)
- **Role vocabulary:** Use existing constraint values. `site_admin` = lead practitioner, `clinician` = assisting practitioner, `analyst` = observer. Do NOT add a new CHECK constraint.
- **Who can enroll:** TBD pending WO-531 (MFA research). For now, admin-level users only.

### Pre-Build Mandatory Steps
1. Run pre-build schema query to confirm constraint is still present:
   ```sql
   SELECT conname, pg_get_constraintdef(oid) FROM pg_constraint
   WHERE conrelid = 'public.log_user_sites'::regclass AND contype = 'c';
   ```
2. Confirm `log_user_sites` still has 0 rows before UI is built
3. WO-526 must NOT be applied until this WO ships and ≥1 row exists

### Post-Build Mandatory Steps
- After enrollment UI ships, verify ≥1 active row before handing off to WO-526
- Reference `supabase/SCHEMA_SNAPSHOT.md` for full column list

==== INSPECTOR ====
