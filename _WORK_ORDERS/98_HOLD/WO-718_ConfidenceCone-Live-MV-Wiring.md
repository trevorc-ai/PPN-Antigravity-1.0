---
owner: LEAD
status: 98_HOLD
authored_by: PRODDY
active_sprint: true
priority: P1
pillar_supported: "Pillar 2 — Comparative Clinical Intelligence"
database_changes: no
files:
  - src/components/analytics/ConfidenceCone.tsx
data_from: mv_site_outcome_benchmarks, mv_patient_trajectory_summary
data_to: read-only (no writes)
theme: existing component CSS, no layout changes
---

## PRODDY PRD

### 1. Problem Statement
`ConfidenceCone` renders an outcome forecast with uncertainty bands using `MOCK_TRAJECTORY_DATA` imported from `analyticsData` constants. `mv_site_outcome_benchmarks` and `mv_patient_trajectory_summary` are live in production and provide real site-level outcome trajectories with variance. The component violates the GLOBAL_CONSTITUTION Kill-List — mock data where a real SQL view exists.

### 2. Target User + Job-To-Be-Done
A clinic director needs to see a statistically honest forecast of probable patient outcome ranges based on their own clinic's real historical data so they can set realistic expectations with patients and staff.

### 3. Success Metrics
1. `MOCK_TRAJECTORY_DATA` import removed — grep confirms no constant import from `analyticsData`
2. Cone renders with real variance bands from `mv_site_outcome_benchmarks`
3. Zero-state (insufficient sessions) shows a clean suppression banner — not a fake cone

### 4. Feature Scope
#### In Scope:
- Replace `MOCK_TRAJECTORY_DATA` with live reads from `mv_site_outcome_benchmarks`
- Add session-count threshold check (suppression logic if n < minimum)
- Add `// Source:` comments per DB-First policy

#### Out of Scope:
- Multi-substance filter controls
- Redesigning the cone shape or animation
- Network-level comparison (separate ticket)

### 5. Priority Tier
P1 — Displaying a fabricated confidence cone as if it represents real clinical data undermines practitioner trust.

### 6. Open Questions for LEAD
1. What columns does `mv_site_outcome_benchmarks` expose — specifically mean, p10, p90 fields needed for the cone bands?
2. What is the minimum n required before the cone is statistically valid? LEAD + INSPECTOR to define suppression threshold.

## INSPECTOR 03_REVIEW CLEARANCE
**Reviewed by:** INSPECTOR
**Date:** 2026-03-27
**Verdict:** FAST-PASS — no database changes, files list defined, pillar confirmed.
**BUILDER start condition:** Cleared. WO-as-Plan exemption applies. Start coding immediately.

## BUILDER BLOCK — 2026-03-27

**Reason:** `mv_site_outcome_benchmarks` and `mv_patient_trajectory_summary` do not exist in the Supabase migrations. Grepped all migration files — zero matches. Cannot replace `MOCK_TRAJECTORY_DATA` with a live hook until these MVs are created and deployed. Moving to `98_HOLD`. LEAD must either (a) create these MVs in a new migration, or (b) wire ConfidenceCone to an existing MV with similar schema (`mv_site_dashboard_summary`, `mv_patient_trajectory_summary`). No code changes made to `ConfidenceCone.tsx`.
