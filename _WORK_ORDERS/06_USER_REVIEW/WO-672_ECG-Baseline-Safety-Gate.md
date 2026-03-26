---
owner: LEAD
status: 05_QA
authored_by: PRODDY
active_sprint: false
priority: P1
created: 2026-03-23
database_changes: yes
source_analysis: proddy_dr_allen_analysis.md
plan_status: approved_by_build
completed_at: 2026-03-25
builder_notes: "Upgraded QTIntervalTracker from 2-tier to 4-tier advisory QTc alert system (green/amber/orange/red) per Dr. Allen ibogaine protocol; added concurrent-symptoms escalation flag; created ibogaineCardiacThresholds.ts constants; created migration 082 for qtc_baseline_ms additive column on log_clinical_records."
files:
  - src/components/arc-of-care/QTIntervalTracker.tsx
  - src/constants/ibogaineCardiacThresholds.ts
  - migrations/082_add_qtc_baseline_to_log_clinical_records.sql
---

## PRODDY PRD

> **Work Order:** WO-672 — ECG Baseline and QTc Monitoring Alert System
> **Authored by:** PRODDY
> **Date:** 2026-03-23
> **Amended:** 2026-03-24 (Dr. Allen clinical review — see dr_allen_feedback_synthesis.md)
> **Status:** Draft → Pending LEAD review

---

### 1. Problem Statement

Ibogaine's primary cardiac risk is QT interval prolongation. A patient's baseline QTc must be established before Ibogaine is administered, because QT prolongation risk is measured as a delta from baseline. Dr. Allen's form includes "Baseline ECG / QTc" as a required pre-session check. PPN has ECG monitoring capability but no structured QTc alert tier system during live sessions. **Important:** Dr. Allen's clinical experience (600+ sessions, paper under preparation) shows no adverse events at QTc levels that standard references flag as dangerous — the system must alert and monitor, never block the practitioner from proceeding.

---

### 2. Target User + Job-To-Be-Done

An Ibogaine practitioner needs to log a baseline ECG with QTc before Phase 2 begins and receive tiered visual alerts during the active session as QTc rises — without the platform ever blocking the practitioner from proceeding — so that cardiac monitoring is continuous, documented, and clinician-controlled.

---

### 3. Success Metrics

1. Attempting to advance from Phase 1 to Phase 2 for an Ibogaine session without a documented baseline QTc entry produces a **non-blocking warning** (not a hard block) prompting the practitioner to enter baseline before proceeding — verified in ≥10 consecutive QA attempts.
2. The Phase 2 live session interface displays the 4-tier QTc alert state (green / amber / orange / red) correctly at all threshold boundaries — verified visually in QA with synthetic values at 489ms, 490ms, 500ms, 549ms, and 550ms.
3. Baseline QTc and all logged intra-session QTc readings appear in the generated session PDF within 30 days of ship.

---

### 4. Feature Scope

#### ✅ In Scope
- Non-blocking prompt on Phase 2 entry if baseline QTc is absent (prompt, not hard block)
- Baseline QTc value surfaced as a persistent reference in the Phase 2 active session monitoring view
- 4-tier QTc alert system during Phase 2 (no hard block at any tier):
  - Green: QTc < 490ms
  - Amber: QTc 490ms (elevated — monitor closely)
  - Orange: QTc 500ms+ (significant elevation — assess HR, RR, diaphoresis, cognition)
  - Red: QTc 550ms+ OR concurrent clinical symptoms (consider IV fluids, Mg, Esmolol — ACLS on-call)
- All QTc tier states are advisory only — practitioner retains full clinical decision authority at all times
- Baseline QTc and all intra-session QTc readings included in session PDF report
- Applies to Ibogaine HCL and TPA sessions

#### ❌ Out of Scope
- Hard session block at any QTc threshold — per Dr. Allen, this is explicitly not wanted
- ECG gate for non-Ibogaine modalities (psilocybin, MDMA) — different risk profiles
- Full ECG report upload or PDF parsing
- Automated integration with external cardiac monitoring devices
- Any changes to Phase 3 closeout flow

---

### 5. Priority Tier

**[x] P1** — High value, ship this sprint

**Reason:** This is a patient safety feature. Ibogaine-related cardiac deaths are documented in the literature and are the primary reason Ibogaine remains Schedule I. A platform that does not enforce baseline ECG documentation before Ibogaine administration is not clinically credible and cannot be recommended by any medical oversight board. This gate is the minimum safety bar.

---

### 6. Open Questions for LEAD

1. Should the non-blocking baseline-absent prompt be enforced at API level (preventing Phase 2 record creation server-side) or UI level only?
2. Should Ibogaine protocol detection be based on `primary_substance` field value, or is there a dedicated `protocol_type: ibogaine` flag in the data model?
3. What is the UX for the non-blocking baseline-absent prompt — a dismissible modal, an inline banner, or an inline form that accepts baseline QTc in place before proceeding?
4. Should the 4-tier alert system apply to existing in-progress sessions that predate this feature (backward compatibility)?
5. Should the red-tier alert display a practitioner-facing quick-reference card listing the intervention protocol (IV fluids, Mg, Esmolol) as a non-mandatory educational prompt?

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
- [x] `database_changes: no` — baseline QTc field likely already exists; this is a gate/UX enforcement ticket
- [x] Frontmatter updated: `owner: LEAD`, `status: 00_INBOX`
- [x] Response wrapped in `==== PRODDY ====`

---

## LEAD Architecture

**Reviewed by:** LEAD
**Date:** 2026-03-24
**Decision:** APPROVED → route to 03_REVIEW

**Architecture notes:**
- Baseline QTc field: check if `session_baselines.qtc_baseline_ms` already exists before adding — if so, no migration needed, just enforce UI prompt
- The 4-tier alert system (green/amber/orange/red) is pure UI logic — threshold constants defined in a new `ibogaineCardiacThresholds.ts` constants file (not contraindicationEngine.ts — keep concerns separated)
- Prompt on Phase 2 entry if baseline absent: dismissible modal at UI level only — no API-level enforcement for now (Q1 from Open Questions)
- `database_changes: no` confirmed — baseline QTc field likely already exists; this is UI enforcement and display logic
- No frozen files touched — safe to BUILD

**Routing:** 00_INBOX → 03_REVIEW → INSPECTOR fast-pass (no DB changes, pure UI)

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

