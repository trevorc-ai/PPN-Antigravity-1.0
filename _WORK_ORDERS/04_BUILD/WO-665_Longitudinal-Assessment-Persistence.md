---
id: WO-665
title: "Longitudinal Assessment scores do not persist after Save — scores reset to blank on re-open"
owner: LEAD
status: 00_INBOX
authored_by: INSPECTOR (regression catch from WO-664)
priority: P1
created: 2026-03-23
fast_track: false
origin: "Phase 3.5 regression Scenario 2 — WO-664 regression run"
admin_visibility: no
admin_section: ""
parked_context: "Flagged during WO-664 INSPECTOR QA. Pre-existing bug — not introduced by WO-664."
files:
  - src/components/wellness-journey/WellnessFormRouter.tsx
  - src/components/arc-of-care-forms/phase-3-integration/LongitudinalAssessmentForm.tsx
---

## Request

Longitudinal Assessment scores (PHQ-9, GAD-7, WHOQOL, PSQI, C-SSRS) reset to blank default when the form is re-opened after saving. Data is being written on save but not loaded back as `initialData` when the form mounts.

## LEAD Architecture

Root cause is in `WellnessFormRouter.tsx` line 849: `LongitudinalAssessmentForm` is rendered with no `initialData` prop. The form's local state initializes from `initialData` on mount — with none provided, it always starts blank. Fix requires:
1. In `WellnessFormRouter`, query the Supabase `log_longitudinal_assessments` table for the most recent record for the current patient/session
2. Pass those values as `initialData` to `LongitudinalAssessmentForm`
3. The form already accepts `initialData?: LongitudinalAssessmentData` — no changes needed to the form itself

## Open Questions
- [ ] Confirm the table name: `log_longitudinal_assessments` — BUILDER must verify with `\dt` or live schema before writing query
- [ ] Is there one record per session, or one per patient? Determine the correct scoping key (session_id vs patient_uuid)

## INSPECTOR 03_REVIEW CLEARANCE: FAST-PASS
No DB impact detected. Cleared for build.
Signed: INSPECTOR | Date: 2026-03-24
