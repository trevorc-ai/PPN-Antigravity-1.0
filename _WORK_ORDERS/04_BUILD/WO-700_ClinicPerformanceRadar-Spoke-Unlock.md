---
id: WO-700
title: "Unlock suppressed ClinicPerformanceRadar spokes using mv_followup_window_compliance + mv_documentation_completeness"
owner: BUILDER
status: 04_BUILD
priority: P2
created: 2026-03-26
origin: "Intelligence Layer Integration Plan — Part 3 Analytics Streamlining"
pillar_supported: "3 — QA and Governance, 2 — Comparative Clinical Intelligence"
files:
  - src/components/analytics/ClinicPerformanceRadar.tsx
  - src/hooks/useClinicBenchmarks.ts
depends_on: "WO-677 (must complete and ship first — this WO unlocks suppressed spokes from that build)"
sequence_note: "Do not attempt until WO-677 is in 99_COMPLETED. Natural follow-on to WO-677. Can run in parallel with WO-699."
---

## Problem
WO-677 wires the `ClinicPerformanceRadar` to live data but explicitly suppresses the
**Efficacy** and **Adherence** spokes until assessment data pipelines are live. Those
pipelines are now live via `mv_followup_window_compliance` (adherence) and
`mv_documentation_completeness` (data quality/completeness). These spokes can be unlocked.

## Required Fix
After WO-677 completes, add to `useClinicBenchmarks.ts`:

```ts
// Source: mv_followup_window_compliance (capability #5 — follow-up compliance as measurable workflow)
// Adherence spoke = pct_windows_completed (site aggregate)

// Source: mv_documentation_completeness (capability #6 — documentation completeness scoring)
// Data Quality spoke = avg completeness_pct across site sessions
```

1. Adherence spoke: query `mv_followup_window_compliance` → `AVG(pct_completed)` for site
2. Data Quality spoke (rename from "Compliance"): query `mv_documentation_completeness` → `AVG(completeness_pct)` for site
3. Update hover tooltips for each spoke with source definition
4. Apply minimum-n suppression: if fewer than 5 eligible windows, show "Insufficient data"

## Success Criteria
- Adherence and Data Quality spokes render live values (not suppression state)
- Tooltip definitions reference the MV source
- Both spokes return gracefully to suppressed state if 0 rows returned

## INSPECTOR 03_REVIEW CLEARANCE: FAST-PASS
No DB impact. Read-only MV query. Depends on WO-677. Cleared for build after WO-677.
Signed: INSPECTOR | Date: 2026-03-26
