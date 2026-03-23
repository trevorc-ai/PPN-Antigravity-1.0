---
owner: BUILDER
status: 00_INBOX
authored_by: INSPECTOR
priority: P1
track: A
track_item: A3
stabilization_brief: STABILIZATION_BRIEF.md v1.2
created: 2026-03-21
depends_on: WO-A2 (must be complete and stable before this begins)
---

# WO-A3: Fix Session Timeline and State Bleeding Between Dosing Sessions

## Context

When a practitioner selects an existing patient who has completed a prior dosing session and attempts to start a new one, the Live Session Timeline on the cockpit shows timeline events from the previous session. Additionally, localStorage state from the prior session can carry over, causing `DosingSessionPhase` to launch in the wrong mode.

**Root cause (confirmed from code inspection — two distinct issues):**

### Issue A — Optimistic timeline events from prior session leak into new session view
In `WellnessJourney.tsx`, `handlePatientSelect` resumes the latest `log_clinical_records` row (`ORDER BY created_at DESC LIMIT 1`). If the new session hasn't been properly isolated yet, the `sessionId` from the resumed record is the prior session's ID. `LiveSessionTimeline.tsx` then fetches events keyed to that old `sessionId`, and the prior session's events appear.

**Contributing factor:** `handlePatientSelect` deliberately avoids clearing `localStorage` keys for `live` mode (to support multi-patient use). This means `ppn_session_mode_<oldSessionId>` can persist, and `DosingSessionPhase.tsx` may read it and initialize in `live` mode for the old session.

### Issue B — `ppn_session_mode_*` localStorage keys not isolated per new session
When a truly new `log_clinical_records` row hasn't been created yet (because the app hasn't reached the "Start New Session" action), the component falls back to the old session's ID, reads the old mode key, and resumes as if the old session is still live.

---

## Scope

**Files to modify:**
- `src/pages/WellnessJourney.tsx` — `handlePatientSelect` function and new-session initialization logic
- `src/components/wellness-journey/DosingSessionPhase.tsx` — localStorage recovery guard for mode initialization

**Files examined but NOT modified:**
- `src/components/wellness-journey/LiveSessionTimeline.tsx` — reads from `sessionId` prop correctly; no change needed if sessionId is corrected upstream
- `src/services/clinicalLog.ts` — read-only reference for session query structure

---

## Implementation Specification

### Step 1 — Pre-Flight: Map the full localStorage key lifecycle

BUILDER must first run:
```bash
grep -n "ppn_session_mode\|ppn_session_start\|handlePatientSelect\|localStorage" \
  src/pages/WellnessJourney.tsx \
  src/components/wellness-journey/DosingSessionPhase.tsx
```

Produce a list of every `localStorage.setItem` and `localStorage.getItem` call for session-scoped keys. Map which keys are tied to which session UUID. This is the pre-flight for Step 2.

### Step 2 — WellnessJourney.tsx: Distinguish "resume" from "new session" in handlePatientSelect

The `handlePatientSelect` function must differentiate between:
1. **Resume case:** Patient has an active `log_clinical_records` row with `session_ended_at IS NULL` and `dose_administered_at IS NOT NULL` — a session is genuinely in progress
2. **New session case:** Patient has no active session, or the latest record is fully completed — the next action is to start a new cycle

For the **new session case**, the function must:
- NOT carry forward the previous session's `sessionId` as the active context
- Set a distinct "awaiting new session" state (no `sessionId` until a new `log_clinical_records` row is explicitly created)
- Clear only the prior session's mode localStorage keys (`ppn_session_mode_<priorSessionId>`, `ppn_session_start_<priorSessionId>`) — leave other patient keys intact

For the **resume case** (genuine in-progress session):
- Behavior remains unchanged — resume is correct

### Step 3 — DosingSessionPhase.tsx: Tighten the mode recovery guard

The `useEffect` that reads `ppn_session_mode_<sessionId>` from localStorage must include an additional guard:

```tsx
// Before reading localStorage mode, verify the sessionId belongs to an active (not completed) session
// If session_ended_at is set on the record, treat as post-session — do not restore 'live' mode
```

This prevents the component from restoring `live` mode for a session that has already ended.

### Step 4 — Verify LiveSessionTimeline isolation

After Steps 2-3, confirm `LiveSessionTimeline` receives the correct (new/null) `sessionId` after patient selection in the new-session case. The timeline should render empty (or with an appropriate empty state per UI_UX_GUARDRAILS.md) until the new session is explicitly started.

---

## Constraints (from STABILIZATION_BRIEF.md)

- **Two files only** (`WellnessJourney.tsx`, `DosingSessionPhase.tsx`).
- **Do NOT touch `LiveSessionTimeline.tsx`** unless the sessionId fix proves insufficient and requires a plan amendment.
- **Multi-patient support must remain intact.** Clearing localStorage keys for one session must not affect other concurrently active sessions. Test with two active patients before confirming.
- **No schema changes.** The fix is entirely in frontend state management.
- **Two-strike rule applies.** If a multi-patient regression occurs, STOP immediately.
- **RULE 7 enforced.** No Tailwind or layout changes in scope.

---

## Edge Cases to Verify (from EC table in STABILIZATION_BRIEF.md Section 6)

| Case | Expected Behavior After Fix |
|---|---|
| EC-1: Cycle opened but never dosed | Patient selection shows "awaiting new session" state, no prior session timeline events |
| EC-2: Integration never closed | If resuming a patient with `integration_open`, correct phase should show — NOT a new session prompt |
| Active session (genuine resume) | All resume behavior unchanged. Timer continues. Timeline shows correct events. |
| Two patients simultaneously active | Switching between them shows correct timeline and state for each |

---

## Acceptance Criteria

1. Select a patient who has a completed prior dosing session. The cockpit loads without showing any timeline events from the prior session.
2. The session mode initializes as `pre` (not `live`) when there is no active session for the patient.
3. Select a patient who has a **genuinely active** dosing session (timer running). The cockpit resumes correctly in `live` mode with the correct timeline.
4. With two patients simultaneously active, switching between them shows the correct timeline and mode for each.
5. No localStorage keys from Session A appear when viewing Session B's cockpit.

---

## Verification

1. Create or identify a patient with one completed dosing session
2. Navigate to Wellness Journey → select that patient → confirm cockpit loads with empty timeline and `pre` mode
3. Create or identify a patient with an *active* (live) session → confirm correct resume behavior
4. If multi-patient access is available: have two active sessions; switch between them; confirm each shows correct state
5. Inspector to run `localStorage` inspection in browser dev tools (Application → Local Storage) and confirm key isolation

**Route:** BUILDER → INSPECTOR (must run multi-patient regression per above) → user sign-off before commit.
