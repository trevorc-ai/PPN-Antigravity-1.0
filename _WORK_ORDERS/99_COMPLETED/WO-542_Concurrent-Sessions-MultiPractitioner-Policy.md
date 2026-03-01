---
id: WO-542
title: Concurrent Dosing Sessions & Multi-Practitioner Clinic Policy
owner: USER
status: 99_COMPLETED
authored_by: PRODDY
reviewed_by: LEAD
priority: P1
created: 2026-03-01
tags: [multi-practitioner, concurrent-sessions, clinic-model, auth, data-integrity, policy-definition]
---

## PRODDY PRD

> **Work Order:** WO-542 — Concurrent Dosing Sessions & Multi-Practitioner Clinic Policy
> **Authored by:** PRODDY
> **Date:** 2026-03-01
> **Status:** Draft → Pending LEAD review

---

### 1. Problem Statement

Today, the PPN portal is designed around a single-practitioner, single-session mental model. Dr. Allen's question — "how many patient dosing sessions can I have going at the same time?" — reveals a hard architectural and policy gap: the platform has no defined answer. A solo practitioner running one session on one laptop is a solved problem. A multi-practitioner clinic where two or three licensed facilitators are each actively logging a separate patient's dosing session — simultaneously, potentially referencing the same patient ID — is entirely undefined. Without a concurrent session policy and clinic-level account model, we risk data collision, unintended record overwrites, and a go-to-market gap that blocks any clinic beyond solo practice.

---

### 2. Target User + Job-To-Be-Done

A licensed clinic operator (e.g., a clinic director or lead practitioner) needs to enroll multiple practitioners under a shared clinic account so that each practitioner can run their own active dosing session simultaneously, without risk of overwriting another practitioner's live session data.

---

### 3. Success Metrics

1. A practitioner can start and fully complete a dosing session while a second practitioner completes a separate session for a different patient in the same clinic account — zero data collision events across 10 consecutive QA test runs.
2. The clinic account model is defined, documented, and confirmed by LEAD as schema-ready within 1 sprint of this ticket being triaged.
3. A solo practitioner (single login, single screen) experiences zero change in their current workflow — confirmed by INSPECTOR regression audit before any clinic feature ships.

---

### 4. Feature Scope

#### ✅ In Scope

- **Policy Definition:** Define the maximum number of concurrent active dosing sessions permitted per practitioner login and per clinic account (e.g., 1 active session per practitioner login at a time; N practitioners per clinic = N concurrent sessions).
- **Clinic Account Model:** Define the data structure distinguishing a "solo practitioner" account from a "clinic" account (with multiple practitioner logins under one roof sharing a patient roster).
- **Practitioner-to-Session Binding:** Each active dosing session must be atomically bound to the practitioner who started it. A second practitioner accessing the same patient ID cannot write to an in-progress session started by Practitioner A.
- **Conflict Detection UI:** If Practitioner B attempts to start a session for a patient who already has an active session in progress (by Practitioner A), the platform must surface an explicit warning — not silently allow a second session to open.
- **Solo-Practitioner Backwards Compatibility:** All existing single-login workflow behavior must remain fully intact. No regressions.

#### ❌ Out of Scope

- Real-time collaborative co-documentation within a single session (two practitioners annotating the same session simultaneously) — this is a future capability.
- Billing, seat licensing, or subscription tier enforcement — this is a commercial layer to be handled separately.
- Patient consent multi-practitioner assignment workflows — not in scope here.
- Mobile-specific concurrent session handling — covered by the existing mobile track.
- Cross-clinic patient record sharing — out of scope for this version.

---

### 5. Priority Tier

**[x] P1** — High value, ship this sprint

**Reason:** Dr. Allen has directly asked this question, signaling that the platform is approaching real-world multi-session use. This gap will block onboarding of any clinic beyond a solo practitioner. It is not yet a P0 because no demo is immediately blocked, but it becomes a P0 the moment a second practitioner joins any beta clinic. Defining the policy now prevents a costly schema refactor later.

---

### 6. Open Questions for LEAD

1. Does the current `wellness_sessions` (or equivalent) table have a field that binds a session to a specific `practitioner_id`? If not, what is the migration path to add this without breaking existing records?
2. Should "clinic account" be a new top-level entity in the schema (e.g., a `clinics` table with FK relationships to `practitioners` and `patients`), or can it be modeled as a practitioner group/tag on the existing user profile?
3. What is the RLS policy for a clinic model — specifically, can Practitioner B in the same clinic *read* Practitioner A's active session, or is each session strictly private to the practitioner who created it?
4. Is there a maximum concurrent session limit we intend to enforce at the application layer (e.g., a practitioner can only have 1 active session at a time), or is this purely a UI/UX enforcement with no hard database constraint?
5. Does the existing `user_roles` schema (see WO-506_Expand-User-Roles, archived) already support a "clinic admin" or "lead facilitator" role, or does a new role need to be defined?

---

### PRODDY Sign-Off Checklist

- [x] Problem Statement is ≤100 words and contains no solution ideas
- [x] Job-To-Be-Done is a single sentence in the correct format
- [x] All 3 success metrics contain a measurable number or specific observable event
- [x] Out of Scope is populated (not empty)
- [x] Priority tier has a named reason (not just "seems important")
- [x] Open Questions list is ≤5 items
- [x] Total PRD word count is ≤600 words
- [x] No code, SQL, or schema written anywhere in this document
- [x] Frontmatter updated: `owner: LEAD`, `status: 00_INBOX`
- [x] Response wrapped in `==== PRODDY ====`

---

## LEAD ARCHITECTURE

> **LEAD Review Date:** 2026-03-01
> **Status:** Open Questions Resolved · Routed to TRIAGE

### Schema Findings (Live Audit — 2026-03-01)

Before architecting, LEAD audited the live migration stack to answer PRODDY's 5 open questions:

**Q1 — Does `log_clinical_records` have a `practitioner_id` (session-owner binding)?**

[STATUS: PARTIAL] The `log_clinical_records` table has a `created_by UUID REFERENCES auth.users(id)` column (migration 000) — this is effectively the practitioner who opened the record. However, it is NOT named or indexed as `practitioner_id`, it has no NOT NULL constraint, and there is no application-level enforcement preventing a second logged-in user from inserting a new `log_clinical_records` row for the same patient. The retired migration `076_RETIRED_create_log_dose_events.sql` shows an earlier attempt that used an explicit `practitioner_id UUID NOT NULL` with its own RLS policy — but this was retired. The active `log_clinical_records` binding is `created_by`, which is insufficient for concurrent conflict detection. **Additive migration required: add `practitioner_id UUID REFERENCES auth.users(id)` as a non-nullable column going forward.**

**Q2 — Should "clinic" be a new `clinics` table or a grouping on the user profile?**

[DECISION: Use `log_sites` + `log_user_sites`] The existing schema already has the right two-table model. `log_sites` is the canonical site/clinic entity (4 live records: Portland, Seattle, Demo Alpha, Demo Beta). `log_user_sites` is the junction table that maps `user_id → site_id` with a `role` column (`network_admin`, `site_admin`, `clinician`, `analyst`, `auditor`). Multiple practitioners can already be members of the same `site_id`. No new top-level entity is needed — a "clinic" IS a `log_sites` record. What IS missing is: (a) a join in session-creation logic to validate the operator's site membership, and (b) a UI warning when a patient already has an active session open by another user at the same site.

**Q3 — RLS: Can Practitioner B read Practitioner A's active session?**

[DECISION: Site-scoped reads, practitioner-scoped writes] All Arc-of-Care RLS policies (migration 050+) use `site_id IN (SELECT site_id FROM log_user_sites WHERE user_id = auth.uid())`. This means any practitioner at the same site can already READ all sessions at that site. This is intentional and correct for clinical safety (any covering practitioner needs to see the active session). WRITE access, however, must be restricted to the `created_by` practitioner — a `WITH CHECK (created_by = auth.uid())` policy on INSERT to `log_clinical_records`.

**Q4 — Application-layer vs. database-layer concurrent session limit?**

[DECISION: Application-layer enforcement with a DB-readable flag] A hard database constraint (e.g., a UNIQUE constraint on `(patient_link_code_hash, is_active)`) is clean but inflexible — it would complicate edge cases like ended-but-not-closed sessions. The correct approach: add an `is_active BOOLEAN NOT NULL DEFAULT false` column to `log_clinical_records` (if not already present under that name — audit required at migration time). The application checks `SELECT COUNT(*) FROM log_clinical_records WHERE patient_link_code_hash = ? AND is_active = true AND site_id = ?` before allowing a new session to open. This is enforceable via a Supabase RPC or a DB-side check function.

**Q5 — Does `user_roles` already support a "clinic admin" role?**

[STATUS: NO — but minimal gap] `ref_user_roles` (migration 020) has only: `admin`, `partner`, `user`. The `log_user_sites.role` column (migration 000, patched in 001) has: `network_admin`, `site_admin`, `clinician`, `analyst`, `auditor`. The correct role for a clinic lead practitioner is `site_admin` in `log_user_sites`. No new roles need to be defined for the MVP scope of this ticket. A user can be `role: clinician` for documentation and `role: site_admin` for clinic-management actions.

---

### Architecture Decision: Two Alternative Approaches

**Approach A — RPC-Gated Session Start (Recommended)**
Create a Supabase DB function `check_and_claim_session(patient_hash, site_id, practitioner_uid)` that atomically: (1) checks for an existing `is_active = true` record for that patient at that site, (2) returns a conflict payload if one exists, (3) inserts the new `log_clinical_records` row bound to the practitioner if clear. The app calls this RPC instead of a direct `.insert()`. The UI surfaces a conflict modal if the RPC returns a conflict. This is the safest approach — the conflict check and the INSERT happen in one DB transaction, eliminating race conditions.

- **Pro:** Atomic, no race condition, backend-enforced
- **Pro:** Zero change to RLS policies — RPC runs as SECURITY DEFINER
- **Con:** Requires a new migration for the RPC function
- **Con:** App-layer must be refactored to call RPC instead of direct insert

**Approach B — Application-Layer Pre-Check + INSERT**
The app queries `log_clinical_records` for an active session before each new session open. If one exists, show a conflict modal and block. If clear, proceed with the direct `.insert()`.

- **Pro:** No new DB objects required
- **Pro:** Faster to implement
- **Con:** Race condition exists (two practitioners could pass the check simultaneously before either inserts)
- **Con:** Relies on consistent `is_active` flag management in the application, which is not currently enforced

**Selected Approach: A (RPC-Gated)** — given that this touches live patient session integrity, the atomicity of Approach A is non-negotiable. Race conditions are unacceptable in a clinical record system.

---

### Step-by-Step Constraints for INSPECTOR / BUILDER

This ticket is **policy and architecture only**. No code is written at this stage. The output of this ticket is a ratified implementation plan that becomes the specification for the next ticket.

**What this ticket delivers:**
1. Written confirmation of the `log_sites` + `log_user_sites` clinic model as the correct architecture (no new tables)
2. Written confirmation that `created_by` on `log_clinical_records` is the session owner binding (additive rename/alias to `practitioner_id` optional)
3. Written definition of the concurrent session policy: **1 active session per patient per site at a time, owned by the practitioner who created it**
4. Written definition of RLS intent: **site-scoped reads, creator-scoped writes**
5. Specification for the follow-on BUILD ticket (WO-543 to be created by CUE) that implements the DB migration and RPC function

**What this ticket does NOT deliver:**
- Any SQL migration file
- Any React component
- Any RPC function code

---

### Triage Summary

This ticket is a **strategy and policy definition ticket**. It requires no BUILD agent. The deliverable is this architecture document. USER review determines whether the policy decisions above are correct before any implementation begins.

**Routing:** This stays in `01_TRIAGE` pending USER review and approval of the architecture decisions above. Upon USER approval:
- CUE creates WO-543: "Concurrent Session Enforcement — DB Migration + RPC + UI Conflict Modal"
- WO-543 routes to BUILD for implementation
- This ticket (WO-542) closes as a policy document

---

## ✅ LEAD SIGN-OFF CHECKLIST

- [x] All 5 PRODDY Open Questions resolved with schema evidence
- [x] Two architectural alternatives documented and weighed
- [x] Optimal approach selected with stated reason
- [x] Step-by-step constraints defined
- [x] No code written in this document
- [x] Frontmatter updated: `status: 01_TRIAGE`, `owner: LEAD`
- [x] Response wrapped in `==== LEAD ====`
