---
owner: LEAD
status: 00_INBOX
authored_by: PRODDY
active_sprint: true
priority: P1
pillar_supported: "Pillar 2 — Comparative Clinical Intelligence"
database_changes: no
files:
  - src/components/analytics/PatientConstellation.tsx
data_from: mv_patient_trajectory_summary
data_to: read-only (no writes)
theme: existing component CSS, no layout changes
---

## PRODDY PRD

### 1. Problem Statement
`PatientConstellation` (Patient Galaxy scatter chart) has zero Supabase calls — the entire component is driven by static in-component data with no database reads at all. `mv_patient_trajectory_summary` is live and provides per-patient trajectory data suitable for clustering. Practitioners see a galaxy of fictional patients, not their real cohort. This is the most complete example of a Kill-List violation in the analytics layer.

### 2. Target User + Job-To-Be-Done
A clinical director needs to see how their real patient cohort clusters by outcome trajectory so they can identify which patient profiles respond best to which protocols.

### 3. Success Metrics
1. Zero hardcoded bubble data in `PatientConstellation.tsx` — INSPECTOR grep confirms no static patient arrays
2. Scatter chart renders real patient trajectory data from `mv_patient_trajectory_summary`
3. k-anonymity suppression: chart shows zero-state if fewer than 5 distinct patients are in the view (privacy policy)

### 4. Feature Scope
#### In Scope:
- Add Supabase hook reading from `mv_patient_trajectory_summary`
- Map `trajectory_state` and outcome score fields to scatter plot axes
- k-anonymity gate: suppress chart if n < 5 patients
- Add `// Source: mv_patient_trajectory_summary` per DB-First policy

#### Out of Scope:
- 3D clustering or WebGL rendering
- Cross-site patient comparisons
- Adding filter controls to the scatter chart (separate ticket)

### 5. Priority Tier
P1 — Showing fabricated patient clusters as if they are the practitioner's real patient cohort is a fundamental trust violation.

### 6. Open Questions for LEAD
1. What axes does LEAD recommend for the scatter plot from `mv_patient_trajectory_summary` columns — outcome score delta vs. session count?
2. The existing component has a `data` prop — should BUILDER remove it or keep it as an override for the demo/showcase pages?
