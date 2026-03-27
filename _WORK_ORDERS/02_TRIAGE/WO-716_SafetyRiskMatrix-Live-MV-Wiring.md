---
owner: LEAD
status: 00_INBOX
authored_by: PRODDY
active_sprint: true
priority: P0
pillar_supported: "Pillar 1 — Safety Surveillance"
database_changes: no
files:
  - src/components/analytics/SafetyRiskMatrix.tsx
data_from: mv_unresolved_safety_flags
data_to: read-only (no writes)
theme: existing component CSS, no layout changes
---

## PRODDY PRD

### 1. Problem Statement
`SafetyRiskMatrix` renders a risk grid (likelihood × severity) by querying raw `log_safety_events` directly, performing client-side aggregation. `mv_unresolved_safety_flags` already computes this at the DB layer and is live in production. The component is violating the GLOBAL_CONSTITUTION Read Model Policy — client-side recomputation when a MV exists. Practitioners see stale, non-aggregated risk data derived from a raw join, not real-time prioritized safety flags.

### 2. Target User + Job-To-Be-Done
A licensed psychedelic facilitator needs to see an accurate, ranked view of currently unresolved safety flags so they can triage patient risk before the next session.

### 3. Success Metrics
1. `SafetyRiskMatrix` zero-state renders correctly when `mv_unresolved_safety_flags` returns 0 rows
2. All client-side aggregation code removed from `SafetyRiskMatrix.tsx` — INSPECTOR grep confirms no `log_safety_events` direct join
3. Component renders without console errors on the live portal within 2 QA sessions

### 4. Feature Scope
#### In Scope:
- Replace `log_safety_events` direct query with `mv_unresolved_safety_flags` read
- Add `// Source: mv_unresolved_safety_flags` comment per DB-First policy
- Update loading/error/zero-state UI to match real MV shape

#### Out of Scope:
- Layout or visual redesign of the risk matrix grid
- Adding new filter controls
- Any write operations

### 5. Priority Tier
P1 — Safety Surveillance is Pillar 1. Component is actively misrepresenting patient risk status to practitioners.

### 6. Open Questions for LEAD
1. What columns does `mv_unresolved_safety_flags` expose? LEAD should run a `SELECT * LIMIT 1` to confirm shape before BUILDER starts.
2. Should the component apply a site-scoping filter on `site_id` or does the MV already enforce RLS?
