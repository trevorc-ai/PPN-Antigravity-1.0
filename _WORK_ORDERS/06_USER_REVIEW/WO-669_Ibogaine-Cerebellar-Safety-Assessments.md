---
owner: LEAD
status: 06_USER_REVIEW
authored_by: PRODDY
active_sprint: false
priority: P1
created: 2026-03-23
database_changes: yes
source_analysis: proddy_dr_allen_analysis.md
plan_status: approved_by_build
completed_at: 2026-03-25
builder_notes: "Created IbogaineCerebellarAssessmentForm.tsx (SARA/FTN/HKS opt-in cards with pre/mid/post timing) and migration 084 (log_ibogaine_cerebellar_assessments with full RLS)."
files:
  - src/components/arc-of-care-forms/phase-1-preparation/IbogaineCerebellarAssessmentForm.tsx
  - migrations/084_ibogaine_cerebellar_assessment_tables.sql
---

## PRODDY PRD

> **Work Order:** WO-669 — Ibogaine Cerebellar Safety Assessment (SARA / FTN / HKS + Ataxia Grading)
> **Authored by:** PRODDY
> **Date:** 2026-03-23
> **Amended:** 2026-03-24 (Dr. Allen clinical review — see dr_allen_feedback_synthesis.md)
> **Status:** Draft → Pending LEAD review

---

### 1. Problem Statement

Ibogaine is directly toxic to the cerebellum at high doses — a clinical fact that the standard of care addresses with three at-bedside neurological assessments: SARA (Scale for Assessment and Rating of Ataxia), Finger-to-Nose (FTN), and Heel-Knee-Shin (HKS). Dr. Allen's session log includes all three as pre-session safety checks. PPN has no equivalent structured neuro-safety assessment. Practitioners conducting high-dose Ibogaine sessions have no platform-supported way to document these findings, creating a clinical and liability gap.

---

### 2. Target User + Job-To-Be-Done

An Ibogaine practitioner needs to administer and document SARA, FTN, and HKS cerebellar function assessments before and after a high-dose Ibogaine session so that neurological safety can be established at baseline and compared against any post-session deficit.

---

### 3. Success Metrics

1. SARA, FTN pass/fail, HKS pass/fail, and ataxia severity grade (0/+1/+2/+3) all render as structured assessment fields in the Phase 1 intake form for Ibogaine sessions — verified in ≥3 consecutive QA sessions.
2. SARA total score (0–40) stores as a structured integer; FTN and HKS store as boolean pass/fail; ataxia grade stores as a structured 4-point ordinal integer (0, 1, 2, 3) — confirmed by INSPECTOR schema review.
3. A post-session neurological assessment option (using the same SARA/FTN/HKS/ataxia fields) is accessible in the Phase 3 closeout flow within 30 days of ship.

---

### 4. Feature Scope

#### ✅ In Scope
- SARA: 8-item structured scale (score 0–40), conditionally rendered for Ibogaine sessions in Phase 1
- FTN (Finger-to-Nose): Binary pass/fail with optional severity note (structured dropdown, not free text)
- HKS (Heel-Knee-Shin): Binary pass/fail with optional severity note (structured dropdown, not free text)
- Ataxia severity grading: structured 4-point ordinal scale (0 = none / +1 = mild / +2 = moderate / +3 = severe) — administered alongside SARA, confirmed by Dr. Allen as his current clinical practice
- Pre-session baseline capture (Phase 1) and post-session comparison capture (Phase 3 closeout) for all fields
- All values stored as structured fields — no free text

#### ❌ Out of Scope
- Intra-session cerebellar monitoring (continuous during active session) — separate ticket if needed
- SARA for non-Ibogaine modalities
- Video recording of neurological exams
- Any changes to Phase 2 (active session) monitoring interface

---

### 5. Priority Tier

**[x] P1** — High value, ship this sprint

**Reason:** Ibogaine is a Schedule I substance being administered at doses up to 25 mg/kg — among the highest-risk therapeutic protocols in the space. Cerebellar neurotoxicity is a documented dose-dependent risk. This is a patient safety documentation gap, not a UX enhancement. Clinician adoption depends on the platform matching their safety standard of care.

---

### 6. Open Questions for LEAD

1. Should SARA be a gate (required before session start) or advisory (logged but not blocking)?
2. Does the SARA form need to be localized/translated for international clinic partners who may use alternative scoring conventions?
3. Should post-session SARA scores be displayed alongside pre-session baseline in the session summary (delta view)?
4. Where do SARA/FTN/HKS results surface in the patient PDF report — pre-session assessment section or a dedicated neuro-safety section?
5. Are SARA/FTN/HKS scores needed in the Global Benchmark analytics layer, or are they session-only documentation fields?

---

### PRODDY Sign-Off Checklist

- [x] Problem Statement is ≤100 words and contains no solution ideas
- [x] Job-To-Be-Done is a single sentence in the correct format
- [x] All 3 success metrics contain a measurable number or specific observable event
- [x] Out of Scope is populated (not empty)
- [x] Priority tier has a named reason
- [x] Open Questions list is ≤5 items
- [x] Total PRD word count is ≤600 words
- [x] No code, SQL, or schema written anywhere in this document
- [x] `database_changes: yes` — new assessment score fields required
- [x] Frontmatter updated: `owner: LEAD`, `status: 00_INBOX`
- [x] Response wrapped in `==== PRODDY ====`

---

## LEAD Architecture

**Reviewed by:** LEAD
**Date:** 2026-03-24
**Decision:** APPROVED → route to 03_REVIEW

**Architecture notes:**
- SARA (0-40 integer), FTN (boolean), HKS (boolean), ataxia grade (0-3 integer) — all additive columns
- Ataxia grading is a new field confirmed by Dr. Allen — store as `ataxia_grade` tinyint (0-3) in `session_assessments` or extended `session_baselines`
- Pre-session and post-session records distinguished by `timing` enum (`pre | post`) — same pattern as WO-668
- Conditional on `session_type = ibogaine` — same pattern as WO-668
- No frozen files touched — safe to BUILD

**Routing:** 00_INBOX → 03_REVIEW → INSPECTOR fast-pass (pure UI + additive DB)

---

## INSPECTOR 03_REVIEW CLEARANCE

**Reviewed by:** INSPECTOR
**Date:** 2026-03-24
**Verdict:** PRE-CLEARED — awaiting 04_BUILD WIP slot

**Schema review:**
- All changes are additive (new columns / new table rows only) ✅
- No existing columns dropped or modified ✅
- No frozen files in `files:` list ✅
- RLS: new assessment tables must inherit session-level RLS policy — BUILDER to confirm before schema PR

**Code review:**
- Pure UI forms + new integer DB columns — no complex state mutations
- Conditional rendering on `session_type = ibogaine` — existing pattern, low risk

**Pre-clearance condition:** Move to 04_BUILD immediately when a WIP slot opens. No further INSPECTOR review needed at that point — this clearance is valid for the current sprint.


---
- **Data from:** Pre-session safety check context (ibogaine session gate); no reference table read — values are structured ordinal/boolean inputs
- **Data to:** `log_ibogaine_cerebellar_assessments` (migration 084) — SARA integer (0–40), FTN/HKS boolean, `ataxia_grade` ordinal (0–3), `timing` enum (pre/post)
- **Theme:** Tailwind CSS, PPN design system — `IbogaineCerebellarAssessmentForm.tsx`; opt-in card pattern, Phase 1 intake flow
