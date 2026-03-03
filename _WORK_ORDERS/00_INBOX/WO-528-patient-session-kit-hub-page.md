---
id: WO-528
title: Patient Session Kit — Token-Gated Patient Hub Page
owner: LEAD
status: 01_TRIAGE
filed_by: PRODDY
date: 2026-03-03
priority: P2
new_route: /patient/:token
new_table: session_share_config (or extend wellness_sessions — LEAD decision)
---

==== PRODDY ====

## PRODDY PRD

> **Work Order:** WO-528 — Patient Session Kit: Token-Gated Patient Hub
> **Authored by:** PRODDY
> **Date:** 2026-03-03
> **Status:** Draft → Pending LEAD review

---

### 1. Problem Statement

The platform currently has no unified patient-facing entry point. `PatientReport.tsx` (post-session) exists as a standalone page. `PatientCompanionPage.tsx` (during dosing) is auth-locked behind the practitioner login. There is no pre-session patient-facing module. Practitioners have no way to selectively activate and share these tools with a patient via a single link — they must either give a patient full app access or share nothing. Dr. Allen's use case requires sharing the right tools at any moment: before the patient arrives, in the waiting room, or after treatment.

---

### 2. Target User + Job-To-Be-Done

A practitioner needs to generate and share a single mobile-optimized URL with their patient so that the patient can access the correct phase-appropriate tools — without logging in and without seeing any other patient's data or practitioner interface.

---

### 3. Success Metrics

1. A practitioner can toggle 1–3 modules on/off and tap "Copy Link" in under 10 seconds — confirmed by timed usability test.
2. The patient URL loads on a 375px mobile viewport within 3 seconds and renders only the activated modules — confirmed by browser test.
3. The patient URL schema contains zero PHI — confirmed by INSPECTOR URL inspection (must resolve only to `Subject_ID` + `session_id`).

---

### 4. Feature Scope

#### ✅ In Scope

**Patient hub page** (`/patient/:token`):
- Renders only the modules the practitioner activated, in phase order: Pre-Session → During → Post-Session
- Mobile-first layout (375–430px primary canvas, 44px minimum tap targets)
- No login required — token is the key
- If a module is not activated, it is absent (not hidden, not greyed out)

**Practitioner "Share with Patient" panel** (inside session detail view):
- 3 toggle switches: Pre-Session, During Session, Post-Session
- "Copy Link" button that generates the shareable `/patient/:token` URL
- No notes field
- Practitioner can update toggles at any time; patient link reflects current state

**Module sources (existing components, no rebuild):**
- Pre-Session: stripped patient-safe intake / set & setting (new, lightweight)
- During Session: `PatientCompanionPage.tsx` extracted as token-gated
- Post-Session: `PatientReport.tsx` as-is

#### ❌ Out of Scope
- Patient login or account creation
- Patient ability to modify module visibility
- Any changes to the practitioner analytics dashboard
- Any changes to `WellnessJourney.tsx` or `DosingSessionPhase.tsx`
- Session data written by the patient appearing in the practitioner's clinical record without review

---

### 5. Priority Tier

**[x] P2** — Next sprint, after P1 fixes ship

**Reason:** Two of three modules are already built (`PatientReport.tsx`, `PatientCompanionPage.tsx`). The practitioner toggle UI is a net-new but small surface. The schema decision (new table vs. JSONB extension) is the main blocker requiring LEAD input.

---

### 6. Open Questions for LEAD

1. Should `session_share_config` be a new table, or a JSONB column added to `log_clinical_records` (e.g. `patient_share_config JSONB`)? New table is cleaner; JSONB is fewer migrations.
2. What is the token format? Proposed: a 32-character random token stored in the share config row — NOT the raw `session_id` UUID — to prevent session enumeration.
3. Should the Pre-Session module store intake responses to `log_baseline_assessments`, or to a new `log_patient_self_report` table to keep patient-submitted data separate from practitioner-entered data?
4. Token expiry: should links have an expiration date, or remain valid indefinitely until the practitioner deactivates?

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

## ✅ USER Decisions — 2026-03-03 (All Open Questions Resolved)

**Q11 — Storage decision:** New `log_patient_self_report` table required.
- `log_baseline_assessments` is NOT appropriate — it is practitioner-entered clinical scores (PHQ-9, GAD-7, ACE, PCL-5) with `completed_by_user_id` (practitioner UUID). Pre-session patient self-report is different in nature, author, and schema shape.
- BUILDER must design new table schema and propose SQL for USER review before any migration runs.

**Q12 — Token format:** 32-char random token (crypto.randomBytes). NOT the raw `session_id`.
- `patient_link_code_hash` column already exists on `log_clinical_records` and can store this hash.

**Q13 — Pre-session intake:** Same as Q11 — new `log_patient_self_report` table.

**Q14 — Token expiry:** 90 days.

**WO-528 is gated on Sprint 5 (after WO-529 completes).** DESIGN may begin in Sprint 5 prep.
