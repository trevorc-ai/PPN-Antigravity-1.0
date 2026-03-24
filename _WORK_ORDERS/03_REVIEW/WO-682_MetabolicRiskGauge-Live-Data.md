---
id: WO-682
title: "Connect MetabolicRiskGauge to live vitals data or remove if no data source exists"
owner: BUILDER
status: 00_INBOX
priority: P2
created: 2026-03-24
origin: "Intelligence Gap Audit — Tier 2"
files:
  - src/components/analytics/MetabolicRiskGauge.tsx
---
## Problem
`MetabolicRiskGauge` renders a risk gauge. It is unclear whether it queries `log_session_vitals` for real cardiovascular/metabolic risk data, or renders a static threshold visualization with no live data behind it.

## Required Fix
1. **Audit first** — confirm current data source
2. **If a real vitals table exists** (`log_session_vitals`): query the most recent vitals for each active patient and compute a risk score based on BP, HR, and known risk factors from intake
3. **If no vitals table or insufficient data**: render an honest zero-state: "Vitals data not yet available for risk calculation"
4. Do NOT render a synthetic gauge value under any circumstance

## Success Criteria
- Gauge either shows a value derived from real vitals data, or shows a clear "insufficient data" zero-state
- No synthetic risk numbers

## INSPECTOR 03_REVIEW CLEARANCE: FAST-PASS
No DB impact detected. Cleared for build.
Signed: INSPECTOR | Date: 2026-03-24
