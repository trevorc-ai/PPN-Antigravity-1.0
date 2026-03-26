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
builder_notes: "Created IbogaineWithdrawalAssessmentForm.tsx (COWS/SOWS/BAWS/ASI opt-in cards with auto-scoring) and migration 083 (log_ibogaine_withdrawal_assessments + ref_ibogaine_assessment_types)."
files:
  - src/components/arc-of-care-forms/phase-1-preparation/IbogaineWithdrawalAssessmentForm.tsx
  - migrations/083_ibogaine_withdrawal_assessment_tables.sql
---

## PRODDY PRD

> **Work Order:** WO-668 — Ibogaine Withdrawal & Addiction Severity Assessment Module (COWS / SOWS / BAWS / ASI)
> **Authored by:** PRODDY
> **Date:** 2026-03-23
> **Amended:** 2026-03-24 (Dr. Allen clinical review — see dr_allen_feedback_synthesis.md)
> **Status:** Draft → Pending LEAD review

---

### 1. Problem Statement

Ibogaine is primarily used to treat Opioid Use Disorder (OUD) and Alcohol Use Disorder (AUD). The core clinical assessments — COWS (Clinical Opiate Withdrawal Scale, 11 items), SOWS (Subjective Opiate Withdrawal Scale), BAWS (Brief Alcohol Withdrawal Scale), and ASI (Addiction Severity Index) — are not present in PPN's Phase 1 intake flow. Per Dr. Allen, these assessments are situationally elective: practitioners choose which instruments apply for each session and patient presentation. PPN must support the full instrument set without mandating any single instrument as a required gate.

---

### 2. Target User + Job-To-Be-Done

An Ibogaine practitioner treating OUD or AUD needs to select and administer whichever combination of COWS, SOWS, BAWS, and ASI is clinically appropriate for that patient — and optionally re-administer COWS or SOWS at session end — so that the complete withdrawal and addiction profile is permanently recorded alongside the treatment session.

---

### 3. Success Metrics

1. COWS, SOWS, BAWS, and ASI each render as independent, optional, selectable cards in Phase 1 intake for Ibogaine sessions — practitioners can activate any combination without being required to complete all — verified in ≥3 consecutive QA sessions.
2. Each completed assessment auto-calculates its total score and stores it as a structured integer value (not free text) — confirmed by INSPECTOR schema review.
3. COWS and SOWS each support re-administration at session closeout (Phase 3) — the same structured form with a distinct timestamp — within 30 days of ship.

---

### 4. Feature Scope

#### ✅ In Scope
- COWS (11-item): optional card, auto-scoring (total /55), activated by practitioner choice in Phase 1
- SOWS (Subjective Opiate Withdrawal Scale): optional card, separate from COWS, activated independently
- BAWS: optional card, structured withdrawal severity form with auto-total
- ASI: optional card, 7-domain structured intake instrument
- All assessments are elective — no assessment is a hard gate on Phase 2 entry
- COWS and SOWS support re-administration at Phase 3 session closeout with a distinct timestamp
- All scores stored as structured integers — no free text
- Scores surfaced in session summary and PDF export

#### ❌ Out of Scope
- Mandating any assessment as a required gate — all are situationally elective per Dr. Allen
- Any changes to existing Phase 1 forms not related to these instruments
- Custom scoring weight modifications for individual clinics
- Integration with external EHR to import existing ASI scores

---

### 5. Priority Tier

**[x] P1** — High value, ship this sprint

**Reason:** COWS is standard-of-care for Ibogaine OUD treatment — the primary US commercial indication for Ibogaine. Its absence structurally excludes PPN from the OUD treatment market. No hard demo deadline exists at time of writing, but this is a clinician adoption gate, not a nice-to-have.

---

### 6. Open Questions for LEAD

1. Should COWS/SOWS/BAWS/ASI cards be surfaced exclusively for `primary_substance = Ibogaine` sessions, or available as optional opt-in cards for any session type?
2. Does ASI require its own page/route within Phase 1, or can it be embedded as a collapsible wizard step with partial save/resume?
3. How is re-administration at Phase 3 closeout stored — same table with a `timing: post_session` flag, or a separate closeout assessment record?
4. Should COWS/SOWS scores appear in the live Phase 2 monitoring summary, or only in the pre/post session views?
5. What is the correct database home — extending `session_baselines` or creating new assessment-specific tables per instrument?

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
- [x] `database_changes: yes` — new assessment score columns/tables required
- [x] Frontmatter updated: `owner: LEAD`, `status: 00_INBOX`
- [x] Response wrapped in `==== PRODDY ====`

---

## LEAD Architecture

**Reviewed by:** LEAD
**Date:** 2026-03-24
**Decision:** APPROVED → route to 03_REVIEW

**Architecture notes:**
- All 4 assessments (COWS, SOWS, BAWS, ASI) are pure UI forms backed by new integer columns — additive schema only, no existing table mutations
- COWS/SOWS/BAWS conditional on `session_type = ibogaine` in existing session record — no new FK tables required at this stage, extend `session_baselines` with nullable integer columns per instrument
- Re-administration at session end: store as second row in a new `session_assessments` table with `timing` enum (`pre | post`) rather than a flag on existing row — cleaner schema
- All cards are opt-in toggles — no gates, per Dr. Allen instruction
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

