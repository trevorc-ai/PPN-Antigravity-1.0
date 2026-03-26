---
id: WO-687
title: "Build useOutcomeScoring hook — compute responder/remission status from actual assessment scores"
owner: BUILDER
status: 00_INBOX
priority: P1
created: 2026-03-24
origin: "Intelligence Gap Audit — Tier 3 (no page refactoring required)"
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
