---
id: WO-557
title: "Post-Session Assessment Persistence & Review Safety Events Unlock"
status: 03_BUILD
owner: BUILDER
created: 2026-03-01T19:54:27-08:00
failure_count: 0
priority: P1
authored_by: LEAD
source: "Phase2_3_Testing_Transcript.md lines 71, 109, 207-213"
---

## LEAD ARCHITECTURE

### Context

Two related P1 failures confirmed in live testing:

**Failure B — Assessment data does not persist:**
After completing the full post-session assessment flow (Quick Experience Check → Ego Dissolution → Emotional Experience → MEQ-30), returning to Phase 2 shows "Post Session Assessments" as incomplete/unchecked. Phase 3 components remain blank. No assessment data carries forward. This means all practitioner work in the assessment flow is silently lost.

**Failure C — "Review Safety Events" never becomes active:**
The "Review Safety Events" checkbox in the Phase 2 HUD remains permanently grayed/locked regardless of whether adverse events or rescue protocols were logged during the session. The practitioner can never satisfy this completion requirement, meaning Phase 2 can technically never be "fully complete" by the HUD's own definition.

### Architecture Decisions

**Failure B — Assessment persistence:**

1. **Identify the current write path.** BUILDER reads the assessment flow components to find where completion is recorded. The `assessmentCompleted` boolean likely lives in React state and is never written to localStorage, Supabase, or any persistent store.

2. **Fix: Write completion flag to localStorage on assessment flow completion.** Key: `ppn:assessments_complete:{sessionId}`. Value: `{ completedAt: ISO timestamp, assessments: ['qec', 'ego', 'emotional', 'meq30'] }`.

3. **Fix: Phase 2 HUD reads from localStorage.** The "Post Session Assessments ✅" chip in `DosingSessionPhase.tsx` should read from this localStorage key (with sessionId scope) rather than from in-component React state that is lost on unmount.

4. **Phase 3 data connection:** Phase 3 components are blank because they depend on `usePhase3Data` which queries Supabase. If assessment results are not being written to Supabase, Phase 3 will always be empty. BUILDER must confirm whether PHQ-9/GAD-7 scores from Longitudinal Assessment, MEQ-30 scores, and emotional experience data are being written to any Supabase table on form save. If not — this is the root cause and must be wired (scoped to what exists in the forms' `onSave` handlers).

5. **Do not rewrite assessment components.** WO-549 handles UX refactoring. This ticket handles data persistence only. BUILDER works within existing form `onSave` callbacks — no layout changes.

**Failure C — Review Safety Events unlock:**

6. **Read the current guard condition.** Find where `reviewSafetyEventsCompleted` (or equivalent flag) is set in `DosingSessionPhase.tsx`. It is likely gated on a condition that is never satisfied — e.g., checking a Supabase query that returns no results because events were never written (pre-WO-547 state).

7. **Fix: Post-WO-547, the unlock condition should check `log_session_timeline_events` for any `safety_event` entries for `session_id`.** BUILDER queries this table via `usePhase3Data` or direct service call and sets `reviewSafetyEventsCompleted = true` if count > 0.

8. **Fallback for sessions with no safety events:** If no safety events exist, "Review Safety Events" should auto-complete (vacuously true — nothing to review). Currently it appears permanently locked even for sessions with zero safety events.

### Files Likely Touched

- `src/components/wellness-journey/DosingSessionPhase.tsx` — fix assessment completion read path + Review Safety Events unlock condition
- Post-session assessment flow components (read `onSave` handlers only — no layout changes)
- `src/services/clinicalLog.ts` or equivalent — confirm/fix assessment data write path to Supabase
- `src/hooks/usePhase3Data.ts` — confirm it re-queries on mount and picks up newly written data

---

## Acceptance Criteria

- [ ] Completing all post-session assessments sets a persistent completion record (localStorage keyed by sessionId)
- [ ] After completing assessments and returning to Phase 2 view, "Post Session Assessments" shows as ✅ complete — not blank
- [ ] Phase 3 data loads correctly after assessments complete — at minimum, PHQ-9 and GAD-7 scores appear in Phase 3 if entered in the Longitudinal Assessment form
- [ ] "Review Safety Events" unlocks (becomes checkable) when at least one safety event (`safety_event` type) exists in `log_session_timeline_events` for the session
- [ ] "Review Safety Events" auto-completes (does not block Phase 2 completion) when zero safety events exist for the session
- [ ] After unlocking, checking "Review Safety Events" works and contributes to Phase 2 completion state
- [ ] Phase 2 HUD completion state (Post Session Assessments ✅ + Review Safety Events ✅) survives page refresh — not lost on remount
- [ ] No regressions in assessment flow UX (WO-549 in-progress — coordinate, do not duplicate changes)
- [ ] TypeScript: `npx tsc --noEmit` = 0 errors

---

## BUILDER IMPLEMENTATION COMPLETE

*(BUILDER to fill in this section when done)*

---

## INSPECTOR QA

*(To be completed in 04_QA after BUILDER handoff)*
