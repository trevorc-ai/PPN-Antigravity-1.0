---
owner: PRODDY
status: 01_TRIAGE
authored_by: LEAD
priority: P1
---

# WO-553 — Wellness Journey: Navigation-Away Causes Loss of Session State

## Problem Statement

When a practitioner navigates away from any screen in the Wellness Journey (e.g., clicking the sidebar, pressing browser Back, or reloading the page), the in-memory React state held by `WellnessJourney.tsx` is destroyed. On return, the page re-mounts and shows the **Patient Selection modal from scratch** — the practitioner must re-select the patient, re-enter the phase, and in many cases repeat steps they already completed.

This is a critical clinical workflow failure. During an active Phase 2 dosing session especially, a practitioner **must not** be forced to restart if they accidentally navigate away.

## Affected State

| State Variable | Type | Currently Persisted? |
|---|---|---|
| `journey.patientId` | `string` | ❌ No — lost on navigate |
| `journey.sessionId` | `string (UUID)` | ❌ No — lost on navigate |
| `journey.patientUuid` | `string` | ❌ No — lost on navigate |
| `activePhase` | `1 \| 2 \| 3` | ❌ No — resets to 1 |
| `completedPhases` | `number[]` | ✅ Yes — `ppn_wellness_completed_phases` |
| `completedForms` | `Set<string>` | ❌ No — lost on navigate |
| `journey.demographics` | `object` | ✅ Partial — `ppn_patient_intake` |
| `journey.session.substance` | `string` | ✅ Partial — `ppn_dosing_protocol` |
| `mode` (Phase 2 live/pre/post) | `string` | ✅ Yes — `ppn_session_mode_<id>` |

## Impact

- **Phase 1 (Preparation):** Practitioner completes 3 of 5 forms, navigates to a patient's existing record, returns — all form progress is gone.
- **Phase 2 (Live Session):** Practitioner navigating to a drug interaction reference or checking the safety events page causes complete session UI reset. Session timer survives (localStorage), but the entire Phase 2 UI resets to "pre-session" if `sessionId` is not in state.
- **Phase 3 (Integration):** Integration Compass link is lost; practitioner must re-select patient and re-enter Phase 3.

## Root Cause

`WellnessJourneyInternal` stores `journey` (patientId, sessionId, patientUuid), `activePhase`, and `completedForms` exclusively in React state with no localStorage hydration on mount. The `handlePatientSelect` callback sets these values after the Patient Selection modal — but on a fresh mount (navigate-away + return), the modal re-appears and the callback is never re-invoked.

## Acceptance Criteria

- **AC-1:** Navigating away from the Wellness Journey and returning within the same browser session restores the practitioner to the correct phase, with the correct patient ID, session ID, and completed-forms progress — without showing the Patient Selection modal again.
- **AC-2:** `journey.patientId`, `journey.sessionId`, and `activePhase` are persisted to `localStorage` under a named key (`ppn_active_journey`) on every update and hydrated on mount.
- **AC-3:** `completedForms` is serialized to localStorage as an array and restored as a `Set` on mount.
- **AC-4:** If no active journey is found in localStorage (first visit, or after a deliberate patient dismissal), the Patient Selection modal appears as before — this is the correct cold-start behavior.
- **AC-5:** A practitioner can explicitly reset the session (e.g., "New Patient" button) to clear localStorage and start fresh.
- **AC-6:** Zero PHI stored in localStorage. Only `patientId` (the non-PII hash code) and `sessionId` (UUID) are permitted. No names, no clinical values, no assessment scores.

## Open Questions for LEAD

1. **Expiry:** Should the persisted journey state have a TTL (e.g., 12 hours)? After a TTL, the Patient Selection modal should reappear. Recommended: yes, 12-hour TTL using a `ppn_active_journey_ts` timestamp key.
2. **Multi-patient:** If the practitioner deliberately opens a second Wellness Journey tab for a different patient, should the second tab overwrite the first patient's resume state? Recommended: use `ppn_active_journey_<tabId>` with `sessionStorage` for tab isolation.

## Proposed Storage Key

```
localStorage key: ppn_active_journey
Value: {
  patientId: string,
  sessionId: string,
  patientUuid?: string,
  activePhase: 1 | 2 | 3,
  completedForms: string[],
  savedAt: number  // Date.now() for TTL check
}
```

## Impacted Files

- `src/pages/WellnessJourney.tsx` — primary change: persist + hydrate journey state
- No schema changes required (all localStorage-only)

## Notes

- The Phase 2 session mode (`ppn_session_mode_<sessionId>`) already survives navigation — this WO only needs to ensure the UI correctly resumes from that state rather than prompting for patient selection again.
- `ppn_wellness_completed_phases` already persists phase lock state correctly; this WO should align with that existing pattern.
