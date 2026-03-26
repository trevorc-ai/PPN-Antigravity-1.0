---
id: WO-678
title: "Connect SafetyBenchmark and SafetyRiskMatrix to live log_safety_events data"
owner: BUILDER
status: 04_BUILD
priority: P1
created: 2026-03-24
origin: "Intelligence Gap Audit — Tier 2"
files:
  - src/components/analytics/SafetyBenchmark.tsx
  - src/components/analytics/SafetyRiskMatrix.tsx
  - src/hooks/useSafetyBenchmark.ts
---
## Problem
`SafetyBenchmark` and `SafetyRiskMatrix` render safety comparisons and risk matrices. Neither component appears to query `log_safety_events` against the practitioner's own site data. We have the data — AE type, grade, session, resolution status — but it is not being used.

## Required Fix
1. Audit the current `useSafetyBenchmark` hook (already exists per `Analytics.tsx` usage) — verify whether it actually queries `log_safety_events` or renders static/mock values
2. If `useSafetyBenchmark` is mock: rewrite it using the same self-contained pattern as `useAnalyticsData` (post-WO-675)
3. `SafetyRiskMatrix`: connect to live `log_safety_events` data — AE grade on X axis, AE type on Y axis, bubble size = count of occurrences for this site
4. `SafetyBenchmark`: show site AE rate vs. published literature benchmarks from `benchmark_cohorts` (the source used by `GlobalBenchmarkIntelligence`)
5. Apply minimum-n suppression: if fewer than 10 AE events, show "Insufficient adverse event data" state

## Success Criteria
- Risk matrix bubbles reflect actual events from `log_safety_events` for this site
- AE rate shown in `SafetyBenchmark` matches the AE rate calculated in `useAnalyticsData`
- No disconnected values — every number has a traceable DB source

## INSPECTOR 03_REVIEW CLEARANCE: FAST-PASS
No DB impact detected. Cleared for build.
Signed: INSPECTOR | Date: 2026-03-24
