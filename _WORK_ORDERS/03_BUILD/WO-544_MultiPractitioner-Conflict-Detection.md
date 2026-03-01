---
id: WO-544
title: Multi-Practitioner Concurrent Session Enforcement — RPC Gate + Opted-In Visibility
owner: INSPECTOR
status: 03_BUILD
reviewed_by: LEAD
approved_by: USER
approved_at: 2026-03-01
authored_by: CUE
priority: P1
created: 2026-03-01
failure_count: 0
tags: [multi-practitioner, concurrent-sessions, rpc, conflict-detection, clinic-model, rls, tier-gating]
---

## User Request (Verbatim)

> "Option 3: Opted-In Visibility (Recommended): this makes the most sense; This would require user being on the paid clinical/enterprise tier, not a solo practitioner, correct? / Approach A: Great explanation, thank you; agreed and approved. YES"

## Context (From LEAD Architecture — WO-542)

When two practitioners at the same clinic each attempt to start or write to a session for the same patient simultaneously, the current platform has no conflict detection. Both sessions would be created, resulting in split records, duplicate timers, and undetectable data corruption. Additionally, multi-practitioner session visibility requires a clear opt-in model tied to the clinic/paid tier.

## Summary

Implement the multi-practitioner concurrent session enforcement layer:

1. **RPC-Gated Session Start** — Atomic database function that checks for an existing active session and either blocks (with a conflict payload) or creates the new session in one indivisible operation
2. **Opted-In Visibility Toggle** — A per-session setting allowing the owning practitioner to share their session with clinic colleagues (Clinical/Enterprise tier only)
3. **Conflict Detection Modal** — UI modal surfaced when a practitioner attempts to start a session already in progress by a colleague

## Ratified Architecture (Approach A — Approved by USER 2026-03-01)

The database handles "check + create" as a single atomic operation via a Supabase RPC function: `check_and_claim_session(patient_hash, site_id, practitioner_uid)`.

**Function behavior:**
1. Query `log_clinical_records` for any row where `patient_link_code_hash = patient_hash AND site_id = site_id AND is_active = true`
2. If found → return a conflict payload: `{ conflict: true, owned_by: practitioner_uid, started_at: timestamp }`
3. If not found → INSERT the new session row with `is_active = true, created_by = practitioner_uid`, return `{ conflict: false, session_id: new_id }`

All steps execute in one DB transaction. No race conditions possible.

## Tier Gating

| Feature | Solo / Free | Clinical / Paid | Enterprise |
|---|---|---|---|
| RPC conflict detection | ✅ (protects solo user from accidental duplicates) | ✅ | ✅ |
| Opted-In session sharing toggle | ❌ | ✅ | ✅ |
| `site_admin` sees all sessions | ❌ | ✅ | ✅ |
| Cross-site analytics view | ❌ | ❌ | ✅ |

## Visibility Model (Option 3 — Opted-In)

- Sessions are **private by default** — not visible to any other practitioner
- The owning practitioner may toggle **"Share with clinic"** on any active session
- When shared, all practitioners at the same `site_id` can read that session
- `site_admin` role in `log_user_sites` can always read all sessions at their site regardless of sharing toggle
- No practitioner (including `site_admin`) may WRITE to another practitioner's session

## Schema Requirements (for INSPECTOR migration)

Per LEAD schema audit (WO-542):
- `log_clinical_records.created_by` currently exists but has no NOT NULL constraint and is not enforced as the session write-owner in RLS
- Required additive changes:
  - `session_shared BOOLEAN NOT NULL DEFAULT false` — the opted-in visibility flag
  - `is_active BOOLEAN NOT NULL DEFAULT false` — flag for conflict detection query (audit first: may already exist under this name)
  - RLS INSERT policy: `WITH CHECK (created_by = auth.uid())` on `log_clinical_records`
  - New Supabase RPC function: `check_and_claim_session(patient_hash TEXT, p_site_id BIGINT, practitioner_uid UUID)`

## UI Requirements

- **Conflict Modal:** When a practitioner is blocked by an active session, show a modal: "A session for this patient is already active, started by [Practitioner display name] at [HH:MM:SS ago]. You cannot start a second session until the active session is ended."
- **Share Toggle:** On the Wellness Journey session view (Clinical/Enterprise tier only), a toggle: "Share session with clinic." Default OFF.

## Backwards Compatibility

- Solo practitioner workflow must be 100% unchanged
- All existing `log_clinical_records` rows are unaffected (new columns are additive with safe defaults)
- No existing RLS SELECT policies are modified

## Out of Scope

- Billing/subscription enforcement infrastructure
- Real-time co-documentation (two practitioners annotating the same session simultaneously)
- Cross-clinic patient record sharing
- Patient consent multi-practitioner assignment
- Live session indicator UI (see WO-543)

---

## PRODDY PRD

> **Work Order:** WO-544 — Multi-Practitioner Concurrent Session Enforcement
> **Authored by:** PRODDY
> **Date:** 2026-03-01
> **Status:** Draft → Pending LEAD review

---

### 1. Problem Statement

When two practitioners at the same clinic simultaneously attempt to open a dosing session for the same patient, today's platform silently creates two separate records. There is no conflict check, no warning, and no write ownership. The result is split session logs, duplicate running timers, and irrecoverable data corruption for that patient visit. Additionally, there is no mechanism for practitioners to optionally share session visibility with colleagues, which is a blocker for any multi-practitioner clinic onboarding.

---

### 2. Target User + Job-To-Be-Done

A licensed clinic practitioner needs to start a dosing session with atomic confidence that no duplicate record will be created, and to optionally share that session's visibility with a clinical colleague, so that the clinic can operate as a coordinated team without data integrity risk.

---

### 3. Success Metrics

1. Zero duplicate active session records created for the same patient across 20 consecutive QA test runs simulating two practitioners clicking "Start Session" simultaneously.
2. A conflict modal appears within 1 second of a blocked session-start attempt, displaying the owning practitioner and elapsed session time, in 100% of QA test cases.
3. A solo practitioner's existing session-start workflow shows zero change in behavior or timing, confirmed by INSPECTOR regression audit before ship.

---

### 4. Feature Scope

#### In Scope

- **RPC-Gated Session Start (Approach A, USER-approved 2026-03-01):** A Supabase DB function `check_and_claim_session` that atomically checks for an existing active session and either returns a conflict payload or inserts the new session, in a single DB transaction.
- **Conflict Detection Modal:** When a session start is blocked, a modal displays: who owns the active session and how long it has been running. The practitioner cannot proceed until the existing session ends.
- **Opted-In Session Sharing Toggle (Clinical/Enterprise tier only):** A per-session setting on the Wellness Journey view allowing the owning practitioner to make their session visible to all practitioners at the same site.
- **Clinic Admin Override:** A `site_admin` role in `log_user_sites` can always read all sessions at their site, regardless of the sharing toggle, for clinical safety coverage.
- **Write Isolation:** Only the practitioner who created a session (`created_by = auth.uid()`) may write to it. Colleagues who gain read access via sharing cannot modify the record.
- **Additive Schema Changes:** `is_active` flag and `session_shared` flag on `log_clinical_records`. RLS INSERT policy enforcement. All additive, no existing rows affected.
- **Backwards Compatibility:** Solo practitioner workflow is 100% unchanged.

#### Out of Scope

- Billing infrastructure or subscription enforcement
- Real-time co-documentation within a single session
- Cross-clinic patient record sharing
- Patient consent multi-practitioner workflows
- Push notifications on session conflict events
- Live session indicator UI (see WO-543)

---

### 5. Priority Tier

**[x] P1** — High value, ship this sprint

**Reason:** The multi-practitioner data collision risk is an active patient safety and data integrity gap. It becomes a P0 the moment a second practitioner joins any beta clinic account. The RPC architecture was fully designed and USER-approved in WO-542, making this a direct implementation handoff with no unknowns remaining at the product level.

---

### 6. Open Questions for LEAD

1. The conflict modal must display the owning practitioner's name. Does the current schema expose a `display_name` or similar field for `auth.uid()` lookups without PHI risk, or should the modal show "another practitioner at your clinic" as the fallback?
2. When the owning practitioner's session ends, should the system automatically notify blocked practitioners (e.g., a toast: "Session for this patient has ended — you may now start a new session"), or is a manual retry sufficient?
3. Is the `is_active` flag additive (new column) or does it already exist on `log_clinical_records` under a different name? LEAD schema audit in WO-542 noted it may exist — INSPECTOR must confirm before migration is authored.

---

### PRODDY Sign-Off Checklist

- [x] Problem Statement is <=100 words and contains no solution ideas
- [x] Job-To-Be-Done is a single sentence in the correct format
- [x] All 3 success metrics contain a measurable number or specific observable event
- [x] Out of Scope is populated (not empty)
- [x] Priority tier has a named reason (not just "seems important")
- [x] Open Questions list is <=5 items
- [x] Total PRD word count is <=600 words
- [x] No code, SQL, or schema written anywhere in this document
- [x] Frontmatter updated: `owner: LEAD`, `status: 01_TRIAGE`
- [x] Response wrapped in `==== PRODDY ====`

---

## LEAD ARCHITECTURE

> **LEAD Review Date:** 2026-03-01
> **Status:** Open Questions Resolved

### Schema Findings (WO-544 Open Questions)

**Q1 — How do we display the owning practitioner in the conflict modal without PHI risk?**

[DECISION: Use `user_profiles.display_name` via FK on `created_by`]
`user_profiles` table (migration 020) has `user_id UUID` + `display_name TEXT`. The `log_clinical_records.created_by` column is a `UUID REFERENCES auth.users(id)`. The RPC function can JOIN `user_profiles` on `created_by = user_id` and return `display_name` as part of the conflict payload. This is not PHI — `display_name` is a practitioner identity field, not patient data. Safe to surface in the conflict modal. Fallback: if `display_name` is NULL, the modal reads "another practitioner at your clinic."

**Q2 — Auto-notify blocked practitioners when a session ends, or manual retry?**

[DECISION: Manual retry for MVP — toast notification deferred to follow-on]
Auto-notification requires a Supabase Realtime subscription or polling, which adds complexity and scope beyond this ticket. For MVP: the conflict modal includes a "Check Again" button that re-calls the RPC and clears the modal if the session has ended. This is fast to build, safe, and gives the practitioner immediate agency. Realtime push notification is a P2 enhancement for a future ticket.

**Q3 — Does `is_active` already exist on `log_clinical_records`?**

[STATUS: NO — but `session_ended_at` is the correct predicate]
Migration 050 added `session_ended_at TIMESTAMP` to `log_clinical_records`. No `is_active` boolean column exists. The correct conflict-detection predicate is `session_ended_at IS NULL AND session_type_id = 2` (active dosing sessions). The WO-544 RPC must use this predicate, not `is_active = true`. Additionally, `session_shared BOOLEAN NOT NULL DEFAULT false` IS a new additive column that does NOT exist and requires a migration.

**Updated Schema Requirements:**
- `session_shared BOOLEAN NOT NULL DEFAULT false` — NEW column on `log_clinical_records` (additive migration required)
- `session_ended_at IS NULL` — use as conflict predicate (column already exists, no migration needed)
- RPC function: `check_and_claim_session(patient_hash TEXT, p_site_id UUID, practitioner_uid UUID)` — NEW DB function
- RLS INSERT policy: `WITH CHECK (created_by = auth.uid())` on `log_clinical_records` — NEW policy, additive

### Architecture Decision

**Approach: SECURITY DEFINER RPC + ONE additive migration**

The RPC function runs as SECURITY DEFINER, allowing it to read and insert across RLS boundaries atomically. The migration adds only `session_shared` and the RPC function. The INSERT RLS policy is additive.

**Files to be modified:**
1. `migrations/080_concurrent_session_enforcement.sql` — NEW: adds `session_shared` column + `check_and_claim_session` RPC + INSERT RLS policy
2. `src/hooks/useStartSession.ts` (or wherever session creation is called) — MODIFY: replace direct `.insert()` with RPC call
3. `src/components/session/ConflictModal.tsx` — NEW: conflict detection modal with "Check Again" button
4. `src/components/wellness-journey/SessionSharingToggle.tsx` — NEW: Clinical tier only, opt-in toggle on Wellness Journey header
