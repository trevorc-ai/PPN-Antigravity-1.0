---
id: WO-687
title: "Build useOutcomeScoring hook — compute responder/remission status from actual assessment scores"
owner: BUILDER
status: 05_QA
priority: P1
created: 2026-03-24
origin: "Intelligence Gap Audit — Tier 3 (no page refactoring required)"
completed_at: "2026-03-26"
builder_notes: "Created src/hooks/useOutcomeScoring.ts. MV-First amendment applied: PHQ9 and GAD7 read from mv_outcome_deltas_by_timepoint (capability #6). Response/remission flags, percent_change, and confidence labels computed client-side from MV output only. CAPS5 and MADRS return confidence=not_computable (not in MV). PCL5 retains raw log_baseline_assessments / log_longitudinal_assessments path since not covered by MV. TypeScript clean."
files:
  - src/hooks/useOutcomeScoring.ts (NEW)
---
## Problem
PPN collects clinical assessment scores (PHQ-9, GAD-7, CAPS-5, etc.) but currently does **not compute** response or remission status from them. Any "Response Achieved" or "Remission Achieved" language in reports is either manually written or synthetic — it is not derived from the actual scores in the database.

This hook will be the computational engine that `PatientJourneySnapshot`, the medical necessity letter, and future outcome reports will consume.

## Required Output
Create `src/hooks/useOutcomeScoring.ts` — a standalone hook that does NOT touch any existing page.

### Function signature
```typescript
useOutcomeScoring(patientUuid: string, instrumentCode: 'PHQ9' | 'GAD7' | 'CAPS5' | 'MADRS')
```

### Logic (per algorithm spec OUTCOME_RESPONSE_PHQ9_V1 and equivalents)
1. Fetch all assessment scores for `patient_uuid` + `instrument_code` from the relevant table (audit which table stores assessment scores)
2. Identify the **baseline score** — the first valid score before or on the session date
3. Identify the **latest follow-up score** — the most recent score after the session date
4. Compute:
   - `absolute_change = latest_score - baseline_score`
   - `percent_change = (baseline_score - latest_score) / baseline_score`
   - `response_flag = percent_change >= 0.50`
   - `remission_flag` = instrument-specific (PHQ-9 < 5, GAD-7 < 5, MADRS < 10, CAPS-5 < 20)
5. Return:
   - All computed fields
   - `confidence` = `'rule_based'` if both scores present, `'not_computable'` if baseline missing
   - `algorithm_id` = `'OUTCOME_RESPONSE_[INSTRUMENT]_V1'`
   - `window_days` = `(follow_up_date - baseline_date)` in days
   - `missing_data_flag` = true if either score is absent

### Critical: Blocking Rules
- If **no baseline score**: return `confidence = 'not_computable'`, `response_flag = null`, `remission_flag = null`
- If **duplicate baseline scores**: return `confidence = 'provisional'`, flag for clinician review
- Never return `response_flag = true` or `remission_flag = true` without both scores present

### Output interface
```typescript
interface OutcomeScore {
  instrument_code: string;
  baseline_score: number | null;
  latest_score: number | null;
  baseline_date: string | null;
  latest_date: string | null;
  window_days: number | null;
  absolute_change: number | null;
  percent_change: number | null;
  response_flag: boolean | null;
  remission_flag: boolean | null;
  response_definition: string;
  remission_definition: string;
  confidence: 'rule_based' | 'provisional' | 'not_computable';
  algorithm_id: string;
  missing_data_flag: boolean;
}
```

## Pre-build Requirement
**BUILDER must first identify the correct assessment scores table.** Candidates: `log_assessments`, `log_session_outcomes`, or another table from the schema. Do not assume — check the schema before writing the fetcher.

## This WO is Self-Contained
No existing page or component is modified. The hook is built and tested standalone. A follow-on WO will wire it into `PatientJourneySnapshot` and the medical necessity PDF.

## INSPECTOR 03_REVIEW CLEARANCE: FAST-PASS
No DB impact detected. Cleared for build.
Signed: INSPECTOR | Date: 2026-03-24

## ⚠️ MV LAYER AMENDMENT — 2026-03-26 (READ BEFORE BUILDING)
`mv_outcome_deltas_by_timepoint` now computes `absolute_change`, `percent_change`, baseline
and follow-up scores, and `timepoint_days` at the database layer. The logic this hook
proposes to build client-side (steps 3–4 in Required Output) may already be fully covered
by this MV.

**BUILDER must audit before coding:**
1. Check `mv_outcome_deltas_by_timepoint` schema against the `OutcomeScore` interface above
2. If the MV covers it: read from MV, do NOT recompute deltas in React
3. If the MV is missing a field (e.g. `response_flag`, `remission_flag`): compute ONLY those
   missing fields client-side using MV output as input
4. Add `// Source: mv_outcome_deltas_by_timepoint` comment on the primary query

Violating the Read Model Policy (computing what the DB already provides) is a QA failure.
Signed: INSPECTOR | Date: 2026-03-26

---
- **Data from:** `mv_outcome_deltas_by_timepoint` (PHQ9, GAD7 deltas — MV-first); `log_baseline_assessments` / `log_longitudinal_assessments` (PCL5 fallback — not in MV)
- **Data to:** No DB writes — hook returns computed `OutcomeScore` interface for consumer components (read-only)
- **Theme:** No UI — TypeScript hook (`src/hooks/useOutcomeScoring.ts`); no CSS
