---
owner: LEAD
status: 00_INBOX
authored_by: PRODDY
active_sprint: true
priority: P1
pillar_supported: "Pillar 1 — Safety Surveillance"
database_changes: no
files:
  - src/components/analytics/PatientJourneySnapshot.tsx
data_from: mv_patient_latest_status, mv_outcome_deltas_by_timepoint
data_to: read-only (no writes)
theme: existing component CSS, no layout changes
---

## PRODDY PRD

### 1. Problem Statement
`PatientJourneySnapshot` renders a patient treatment timeline mixed with `MOCK_JOURNEY_DATA` for the PHQ-9 decay line. `mv_patient_latest_status` and `mv_outcome_deltas_by_timepoint` are both live in production and provide this data accurately. Practitioners see a fake outcome trajectory overlaid on real session milestones — a GLOBAL_CONSTITUTION Kill-List violation ("analytics components using hardcoded or mock data once a real SQL view exists").

### 2. Target User + Job-To-Be-Done
A clinical supervisor needs to see a patient's real treatment trajectory — from preparation through integration — with accurate PHQ-9 decline data so they can make informed decisions about follow-up scheduling.

### 3. Success Metrics
1. `MOCK_JOURNEY_DATA` import removed from `PatientJourneySnapshot.tsx` — grep confirms no reference
2. PHQ-9 decay line renders from `mv_outcome_deltas_by_timepoint` with correct session milestones from `mv_patient_latest_status`
3. Zero-state (no patient data) renders a clean empty state, not a mock trajectory

### 4. Feature Scope
#### In Scope:
- Replace `MOCK_JOURNEY_DATA` with live reads from `mv_patient_latest_status` and `mv_outcome_deltas_by_timepoint`
- Add `// Source:` comments per DB-First policy
- Update zero/loading/error states to match real data

#### Out of Scope:
- Multi-patient view or filter controls
- Visual redesign of the snapshot timeline
- Write operations of any kind

### 5. Priority Tier
P1 — Mock data showing fake patient outcomes is a patient trust and safety risk.

### 6. Open Questions for LEAD
1. Does `mv_patient_latest_status` expose a `subject_identifier` (anonymous) or a UUID? Shape needs confirming before BUILDER starts.
2. Is the component expected to show a single patient or aggregate across the site?

---
## INSPECTOR Fast-Pass + BUILDER Completion (2026-03-27)
database_changes: no -- FAST-PASS eligible.
5-check UI Standards: PASS -- no new violations introduced.
Build completed. Moving to 06_USER_REVIEW.
