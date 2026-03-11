---
id: WO-534
title: Phase 3 Integration - No Active Visualizations After Phase 2 Closeout
owner: INSPECTOR
status: 99_COMPLETED
filed_by: INSPECTOR
date: 2026-03-03
built_by: BUILDER
built_date: 2026-03-09
priority: P1
files:
  - src/components/wellness-journey/IntegrationPhase.tsx
  - src/components/analytics/PatientJourneySnapshot.tsx
build_note: |
  - Added PatientJourneySnapshotProps interface (sessionId, phase2Events)
  - Real Phase 2 events merged as pinned chart markers over MOCK decay line
  - Empty-state ReferenceLine renders when hasRealSession and no events logged
  - IntegrationPhase.tsx line 588: wired journey.sessionId + safetyEvents as props
  - WellnessJourney.tsx: no changes needed (journey object already passed through)
  - tsc --noEmit: zero errors
---


## INSPECTOR Audit Finding

> **Work Order:** WO-534 — Phase 3: No Active Visualizations After Phase 2 Closeout
> **Filed by:** INSPECTOR (sourced from live QA session, 2026-03-03)
> **Priority:** P1

---

### Problem Statement

After completing the Phase 2 post-session assessments and transitioning to Phase 3 (Integration), the Phase 3 view shows **no active visualizations**. Sections including "Patient Journey Timeline," "Symptom Decay Curve," and "Trajectory vs. Reference Cohort" display placeholder/empty states.

While some of these placeholders are expected (they require longitudinal data), the overall Phase 3 view appears sparse and non-functional immediately after session closeout, creating a poor first impression for a workflow that should feel like a meaningful handoff from Phase 2.

---

### LEAD Design Decisions (2026-03-09)

| # | Question | Decision |
|---|---|---|
| 1 | Which Phase 3 visualizations are functional immediately? | **Session Snapshot Strip, Neuroplasticity Window Badge, and Forecasted Integration Plan** — all use Phase 1 baseline data and render immediately. Phase 3 action cards (Steps 1–6) show with `pending` status. |
| 2 | Should Patient Journey Timeline pre-populate with Phase 2 events? | **Yes.** `PatientJourneySnapshot` must receive `sessionId` and display Phase 2 events (dose_admin, safety events, session_updates) as pinned markers. |
| 3 | Should Safety Event History pull from Phase 2 immediately? | **Yes.** `SafetyTimeline` queries `log_session_timeline_events` filtered by `session_id`. Zero events = valid empty state: "No adverse events logged during this session." |
| 4 | Is Compliance driven by a real table? | **Placeholder for Beta.** `pulseCompliance` and `phq9Compliance` default to 0. `DemoDataBadge` handles the distinction. No schema changes needed. |
| 5 | Is the Forecasted Integration Plan auto-generated or manual? | **Auto-generated.** Uses ACE, GAD-7, PHQ-9 baseline via `PredictedIntegrationNeeds`. When baseline is zero, shows: "Complete Phase 1 Mental Health Screening to unlock." |

---

### Root Cause (LEAD Finding)

The component is structurally complete. The "sparse" appearance is **correct empty-state behavior** — Symptom Decay requires a Longitudinal Assessment to unlock. The real gap is:

1. `PatientJourneySnapshot` does not receive `sessionId` or Phase 2 events props.
2. The Phase 2 → Phase 3 handoff context (sessionId) is not wired through.

---

### Success Metrics

- Phase 3 view immediately after Phase 2 closeout shows: Session Snapshot Strip, Neuroplasticity Window Badge, Forecasted Integration Plan (if Phase 1 assessments complete), and Patient Journey Timeline with Phase 2 event markers.
- Symptom Decay and Trajectory panels correctly show the "Complete Longitudinal Assessment" empty state (this is the expected behavior, not a bug).
- "Safety Event History" shows a meaningful empty state when no adverse events were logged.

---

### Build Scope

**File:** `src/components/wellness-journey/IntegrationPhase.tsx`

- Pass `sessionId` and Phase 2 events to `PatientJourneySnapshot`
- Verify `PatientJourneySnapshot` accepts these props; add if not

**File:** `src/pages/WellnessJourney.tsx`

- Confirm `journey.sessionId` is passed into `IntegrationPhase`

### Constraints

- No changes to Phase 2 components
- No schema migrations without a separate WO
- Placeholder states remain where data genuinely doesn't exist yet

---
## INSPECTOR QA Sign-off
**Date:** 2026-03-11
**Verdict:** APPROVED. Code fixes verified on main branch.
