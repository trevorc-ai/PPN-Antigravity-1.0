---
id: WO-655
title: "Extract handlePatientSelect logic into usePatientSession custom hook"
owner: LEAD
status: 02_TRIAGE
authored_by: LEAD (fast-track)
priority: P2
created: 2026-03-22
fast_track: false
origin: "Post-Denver refactor — identified during WO completedForms persistence fix"
defer_until: "After PsyCon Denver launch"
admin_visibility: no
admin_section: ""
parked_context: "WellnessJourney.tsx is 1,682 lines. handlePatientSelect (~270 lines, lines ~500–770) is the dominant contributor. It handles: new patient creation, existing patient resume, medication loading, demographics loading, localStorage key hygiene, phase promotion, and toast dispatch. Extracting to a hook reduces the page by ~250 lines and makes session logic independently testable. The page-level component architecture is otherwise correct — UI components are properly extracted into src/components/wellness-journey/."
files:
  - src/pages/WellnessJourney.tsx
  - src/hooks/usePatientSession.ts  # [NEW]
---

## Request

Extract the `handlePatientSelect` callback and its associated session-management logic from `WellnessJourney.tsx` into a new custom hook `usePatientSession.ts`. This reduces the page from ~1,680 lines to ~1,430 lines and makes the session creation/resume path independently testable.

## LEAD Architecture

### New file: `src/hooks/usePatientSession.ts`

Exports a single hook:

```ts
function usePatientSession(options: {
  addToast: (toast: ToastPayload) => void;
  navigate: NavigateFn;
  setGlobalActivePatient: (uuid: string, sessionId: string | null) => void;
}): {
  handlePatientSelect: (patientId: string, isNew: boolean, phase: string) => Promise<void>;
  setShowProtocolConfigurator: Dispatch<SetStateAction<boolean>>;
  journey: PatientJourney;
  setJourney: Dispatch<SetStateAction<PatientJourney>>;
  // ... other state the hook owns
}
```

All of the following move into the hook:
- `handlePatientSelect` callback (~270 lines)
- `journey` useState + its initializer
- `handleResume` callback
- `storedActiveSession` + `setStoredActiveSession`
- The "persist active session to localStorage" useEffect

### WellnessJourney.tsx after refactor

Calls `usePatientSession(...)` and destructures what it needs. Page becomes a pure coordinator of phase state, form state, and render logic.

## Acceptance Criteria

- [ ] `handlePatientSelect` behaviour is byte-for-byte identical (no logic changes)
- [ ] Phase 1, 2, 3 patient selection flows all pass regression
- [ ] "Resume session" card works correctly
- [ ] Deep-link `?sessionId=` hydration still works (it lives in a separate useEffect on `location.search` — do NOT move it into the hook)
- [ ] No new DB queries introduced
- [ ] `WellnessJourney.tsx` drops below 1,450 lines

## Risk Notes

`handlePatientSelect` is the most critical function in the application. Full Phase 2 session regression (`/phase2-session-regression`) is **mandatory** before merge. Do NOT bundle any logic changes with this refactor — pure extraction only.

## Open Questions

- [ ] Should `journey` useState move into the hook, or stay on the page? (Recommendation: move it — the hook owns session state. The page owns phase/form UI state.)
