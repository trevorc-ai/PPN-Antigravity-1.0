---
id: WO-B4
title: "Track B4 — Resume Session from ActiveSessionsContext"
track: B
priority: P3
status: 02_TRIAGE
created: 2026-03-21
author: ANTIGRAVITY (planning), BUILDER (execution)
depends_on: WO-B1, WO-B3
references:
  - STABILIZATION_BRIEF.md — Track B, B4
  - DosingSessionPhase.tsx (handleRestoreSession, lines 983-993)
  - ActiveSessionsContext (confirmed wired in App.tsx per Track A)
verification: Manual navigation test — header timer chip → Wellness Journey → cockpit active
---

# WO-B4 — Resume Session from ActiveSessionsContext

## Current State (Confirmed by Code Review)

`handleRestoreSession` in `DosingSessionPhase.tsx` (lines 983-993) is already
implemented — it:
1. Sets mode to 'live' via `setMode`
2. Sets `SESSION_KEY` in localStorage to 'live'
3. Reads `startedAt` from `activeSessions` and writes `SESSION_START_KEY`

The stuck-session recovery UI is also in place (`isStuckInPre` detection).

**The remaining gap** is the navigation layer: when a practitioner taps a
timer chip in the header (which exists per Track A commits), they need to
land directly in the live cockpit view FOR THAT SESSION without going through
the patient selection modal.

## BUILDER Must Confirm

Before implementing:

1. Open `src/components/layout/Header.tsx` (or equivalent) — confirm where
   the timer chip renders and what `onClick` it fires
2. Confirm whether the chip navigates to `/wellness-journey?patientUuid=X` or
   just to `/wellness-journey` (without patientUuid context)
3. Confirm whether `ActiveSessionsContext` exposes the `patientUuid` per session

If the chip already passes `?patientUuid=` (via WO-B1), this WO may be
partially complete after B1 is done. BUILDER to verify.

## Required Behavior

Header timer chip → click → navigate to `/wellness-journey?patientUuid={uuid}`
→ `WellnessJourney` reads `activePatientUuid` from `ActivePatientContext`
→ skips patient selection modal
→ `DosingSessionPhase` detects active session in `activeSessions`
→ mode = 'live' (cockpit opens automatically)

The practitioner should land in the live cockpit in under 2 seconds with no
modal or redirect required.

## Constraints

- Do NOT create new active session on navigation — only resume the existing one
- If the patientUuid from the URL does not resolve to an active session,
  fall through to the patient selection modal (safe default)

## Verification

1. Start an active session
2. Navigate away from Wellness Journey
3. Observe timer chip in header
4. Tap chip → land in live cockpit on the correct session
5. Verify no patient selection modal appears
6. Run /phase2-session-regression checklist
