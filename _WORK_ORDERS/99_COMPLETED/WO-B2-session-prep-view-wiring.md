---
id: WO-B2
title: "Track B2 — Session Prep View Wiring"
track: B
priority: P2
status: 02_TRIAGE
created: 2026-03-21
author: ANTIGRAVITY (planning), BUILDER (execution)
depends_on: WO-B1
references:
  - STABILIZATION_BRIEF.md
  - HANDOFF_2026-03-21.md
affects:
  - src/components/wellness-journey/SessionPrepView.tsx
  - src/pages/WellnessJourney.tsx
  - src/components/wellness-journey/DosingSessionPhase.tsx
verification: Full Phase 2 session start flow verified
---

# WO-B2 — Session Prep View Wiring

## Context

`SessionPrepView.tsx` was created as part of the Stabilization Sprint Track 2
component split but is **not wired** into the application routing/navigation
(per handoff Status B2 Not Started).

The component exists and receives props from `DosingSessionPhase` (confirmed in
`DosingSessionPhase.tsx` lines 1172-1194), so it IS rendered inside
`TreatmentPhase`. The "not wired" status in the handoff refers to a different
concern: `SessionPrepView` is not reachable as a standalone destination from
`WellnessJourney.tsx`. A practitioner returning to an in-progress session should
land on the correct sub-view (prep vs. live cockpit) without going through the
selection modal again.

## BUILDER Must Confirm

Before writing the implementation plan for this WO:

1. Open `src/components/wellness-journey/SessionPrepView.tsx` — confirm the
   component exists and its props interface matches what DosingSessionPhase passes
2. Open `src/pages/WellnessJourney.tsx` — confirm how the patient context and
   `adventure`/`journey` object is constructed after patient selection
3. Confirm whether the "Resume Active Cycle" vs "Begin New Treatment Cycle" UI
   distinction (per UI_UX_GUARDRAILS.md Section 6) is implemented in SessionPrepView

## Required Behavior

When a practitioner navigates to Wellness Journey with an active patient (`?patientUuid=`
set via WO-B1):

1. `WellnessJourney.tsx` checks `ActivePatientContext`
2. If patient has an active session (`activeSessions` from `ActiveSessionsContext`),
   route directly to the cockpit (`mode='live'` in DosingSessionPhase)
3. If patient has no active session but has a `log_clinical_records` row in
   preparation state, route to the SessionPrepView steps
4. If patient has no session at all, show Session Prep (first session)

The patient selection modal should ONLY appear when no `patientUuid` context exists.

## UI Acceptance Criteria (per UI_UX_GUARDRAILS.md)

A practitioner on the Prep View must be able to answer in under 2 seconds:
1. Which patient am I working on? → Patient name/ID visible
2. Which dose cycle? → Displayed
3. Which phase? → "Preparation" label visible
4. What happened last? → Last completed prep step shown
5. What is the next safe action? → "Start Dosing" (only if readiness met)

## Out of Scope

- "Begin New Treatment Cycle" action (separate WO, requires B2a schema changes)
- Status model disambiguation
