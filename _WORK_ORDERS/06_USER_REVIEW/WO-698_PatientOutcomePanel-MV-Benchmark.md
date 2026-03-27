---
id: WO-698
title: "Replace PatientOutcomePanel synthetic benchmarks with mv_outcome_deltas_by_timepoint"
owner: BUILDER
status: 05_QA
priority: P1
created: 2026-03-26
completed_at: 2026-03-27
builder_notes: "useOutcomeDeltas.ts hook created and PatientOutcomePanel.tsx wired — synthetic trialMin/trialMax/realWorldAvg removed, benchmark ribbon reads from mv_outcome_deltas_by_timepoint, zero-state 'Awaiting data' renders when deltaRows is empty."
origin: "Intelligence Layer Integration Plan — Part 2 Dummy Data Fix"
pillar_supported: "2 — Comparative Clinical Intelligence, 1 — Safety Surveillance"
sequence_note: "Can build in parallel with WO-697. Most impactful after WO-695 (protocol_id) and real follow-up data exists. WO-699 depends on WO-697 completing but not this one."
files:
  - src/components/wellness-journey/PatientOutcomePanel.tsx
  - src/hooks/useOutcomeDeltas.ts (NEW)
---

## Problem
`PatientOutcomePanel.tsx` displays a benchmark ribbon using synthetic constants
(`trialMin`, `trialMax`, `realWorldAvg`). `mv_outcome_deltas_by_timepoint` now provides
real baseline-to-follow-up PHQ-9 and GAD-7 deltas by timepoint for this site.

Additionally, `Dashboard.tsx` passes `patientPhqData={[]}` (empty array) to the panel,
which means even real session data is never surfaced here.

## Required Fix
1. Create `src/hooks/useOutcomeDeltas.ts`:
   ```ts
   // Source: mv_outcome_deltas_by_timepoint (capability #3 — session-to-follow-up delta analytics)
   // Zero-state: returns [] when no follow-up assessments exist — component renders "Awaiting data"
   ```
   - Accepts `sessionId` (for session-specific view) OR `siteId` (for site aggregate)
   - SELECT from `mv_outcome_deltas_by_timepoint` with appropriate filter
   - Returns `phq9_delta`, `gad7_delta`, `timepoint_days` per row

2. Wire `PatientOutcomePanel`:
   - Replace synthetic `trialMin/Max/realWorldAvg` with values derived from `useOutcomeDeltas`
   - If 0 rows returned: render "Baseline-to-follow-up data not yet available" state
   - Do NOT render fake benchmark lines when real data is absent

3. Wire Dashboard's `patientPhqData` prop: replace `{[]}` with `useOutcomeDeltas(siteId)` data

## Success Criteria
- `grep -r "trialMin\|realWorldAvg\|trialMax" src/components/wellness-journey/` returns 0 matches
- Benchmark ribbon renders from live `mv_outcome_deltas_by_timepoint` data
- Zero-state renders "Awaiting data" (not empty lines)

## INSPECTOR 03_REVIEW CLEARANCE: FAST-PASS
No DB impact. Read-only MV query. Cleared for build.
Signed: INSPECTOR | Date: 2026-03-26

---
- **Data from:** `mv_outcome_deltas_by_timepoint` (capability #3 — session-to-follow-up delta analytics) via `useOutcomeDeltas.ts`
- **Data to:** No DB writes — `PatientOutcomePanel.tsx` benchmark ribbon display only; `Dashboard.tsx` `patientPhqData` prop replaced
- **Theme:** Tailwind CSS, Recharts/custom chart — `PatientOutcomePanel.tsx`; benchmark ribbon replaces synthetic `trialMin/Max/realWorldAvg`

## INSPECTOR QA — Phase 2 Audit (2026-03-27)

### Phase 1: Scope & DB Audit
- [x] Database Freeze Check: PASS — reads from mv_outcome_deltas_by_timepoint (existing MV); no writes
- [x] Scope Check: PASS — PatientOutcomePanel.tsx + useOutcomeDeltas.ts (new hook)
- [x] Refactor Check: PASS

### Phase 2: UI Standards Enforcement — PatientOutcomePanel.tsx
- CHECK 1 (bare text-xs): Pre-existing violations (lines 48, 158, 169, 211, 226) — BUILDER did not add these. Pre-existing scope, not attributable to WO-698.
- CHECK 2 (low contrast): ✅ PASS
- CHECK 3 (details/summary): ✅ PASS
- CHECK 4 (em dash): ✅ PASS
- CHECK 5 (banned fonts): ✅ PASS

### useOutcomeDeltas.ts: CHECK 1–5 all ✅ PASS. No `as any` casts — clean TypeScript.

### Data Completeness Gate: ✅ PASS — zero-state 'Awaiting data' renders when deltaRows is empty.

INSPECTOR VERDICT: ✅ APPROVED | Date: 2026-03-27
