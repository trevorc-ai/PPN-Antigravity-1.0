---
id: WO-577
title: Session State — End vs. Close-Out + Sidebar Resume Fix
owner: BUILDER
status: 99_COMPLETED
priority: P0
created: 2026-03-09
source: Jason-Trevor Meeting 2026-03-09
---

## PRODDY PRD

> **Work Order:** WO-577 — Session State: End vs. Close-Out + Sidebar Resume Fix  
> **Authored by:** INSPECTOR (expedited from meeting action items)  
> **Date:** 2026-03-09  
> **Status:** 99_COMPLETED

---

### 1. Problem Statement

The Wellness Journey currently has one "end session" action that conflates two distinct clinical steps: ending the dosing phase (Phase 2) and closing the session entirely (end of Phase 3). Practitioners need both controls. Additionally, navigating to the Wellness Journey via the sidebar after a session is already open creates a new session instead of resuming the existing one. This means session data is split across multiple session records.

---

### 2. Target User + Job-To-Be-Done

The practitioner needs to transition a patient from Phase 2 to Phase 3 and then from Phase 3 to session-complete as two separate, explicit actions so that the session record reflects the correct clinical arc and no session data is orphaned.

---

### 3. Success Metrics

1. Clicking "End Session" stops the Phase 2 timer and moves the session state to Phase 3 without closing the Wellness Journey view.
2. Clicking "Close Out Session" (Phase 3 action) marks the session as complete — this is the only action that closes the Wellness Journey for the day.
3. Navigating to an in-progress session via the sidebar resumes the existing session (same `session_id`) in 100% of cases; no new session record is created.

---

### 4. Feature Scope

#### ✅ In Scope

- Add two distinct session-end controls:
  - **"End Dosing Session"** — stops Phase 2 timer, transitions session state to Phase 3, keeps the Wellness Journey open.
  - **"Close Out Session"** — final action at end of Phase 3; marks `wellness_sessions.status = 'complete'`; closes or deactivates the Wellness Journey view.
- Audit all sidebar navigation entry points to the Wellness Journey and ensure they detect an in-progress `session_id` and resume it rather than creating a new one.
- Fix the session state machine so that returning to an in-progress session (by any access point) consistently resumes the correct phase and timer state.

#### ❌ Out of Scope

- Redesign of the Phase 2 or Phase 3 UI layout
- Any changes to session data model columns (additive columns only, if needed, per schema policy)
- Auto-timeout / auto-close of abandoned sessions

---

### 5. Priority Tier

**[x] P0** — Demo blocker / safety critical  

**Reason:** Creating duplicate session records for the same clinical session is a data integrity violation. This was observed live during the Jason-Trevor meeting walkthrough.

---

### 6. Open Questions for LEAD

1. What column in `wellness_sessions` tracks current phase state? Is there a `status` or `current_phase` column?
2. Should the sidebar detect an in-progress session by the most recent `wellness_sessions` record for the selected patient, or via a separate session context store?
3. Is there an existing session context provider (`SessionContext`, `WellnessJourneyContext`, etc.) that should hold the active `session_id` globally?

---

### PRODDY Sign-Off Checklist

- [x] Problem Statement is ≤100 words and contains no solution ideas
- [x] Job-To-Be-Done is a single sentence in the correct format
- [x] All 3 success metrics contain a measurable number or specific observable event
- [x] Out of Scope is populated
- [x] Priority tier has a named reason
- [x] Open Questions list is ≤5 items
- [x] No code, SQL, or schema written anywhere in this document

---

## LEAD ARCHITECTURE

**Reviewed:** 2026-03-09 | **Routed to:** BUILDER → `03_BUILD`

### Open Questions — Resolved

**Q1: What column tracks current phase state?**
→ There is no `current_phase` or `status` column in `log_clinical_records`. Phase state is **entirely managed in React via `localStorage`** (`ACTIVE_SESSION_KEY` in `WellnessJourney.tsx` stores `{ patientId, sessionId, patientUuid, activePhase, savedAt }`). For "End Dosing Session" (Phase 2 → 3 transition), BUILDER must update `log_clinical_records.session_ended_at` to `now()` as the durable signal that Phase 2 is complete. No new column is needed for Phase 2 end; `session_ended_at` is already in the schema.
→ For "Close Out Session" (final), `is_submitted = true` and `submitted_at = now()` are the correct flags to write on the `log_clinical_records` row. These columns exist.

**Q2: How should the sidebar detect an in-progress session?**
→ Use `ACTIVE_SESSION_KEY` in localStorage (already implemented and persisted by `WellnessJourney.tsx`). The bug is that sidebar navigation routes to `/wellness-journey` without any special params, causing `WellnessJourney` to re-mount and display the `PatientSelectModal`. The fix: `WellnessJourneyInternal` already reads `readStoredSession()` on mount and skips the modal if a valid in-progress session is found. The sidebar bug is that a separate code path (not via the `readStoredSession` guard) re-shows the modal or creates a new session. BUILDER must audit every navigation call to `/wellness-journey` and confirm they all rely on the existing guard — no new session creation if `ACTIVE_SESSION_KEY` exists and `session_id` matches.

**Q3: Is there an existing session context provider?**
→ No dedicated session context exists. Session state is passed as props from `WellnessJourneyInternal` via the `journey` state object. **Do not create a new context provider for this WO.** The localStorage-based `ACTIVE_SESSION_KEY` is the correct single source of truth. BUILDER should ensure it is updated atomically whenever `activePhase` changes.

### Architecture Decisions

**Two distinct end controls:**
1. **"End Dosing Session" button** (shown in Phase 2): Calls `supabase.from('log_clinical_records').update({ session_ended_at: now() }).eq('id', sessionId)`, then calls `completeCurrentPhase()` to advance `activePhase` to 3. Stops the Phase 2 timer. Does NOT close the Wellness Journey.
2. **"Close Out Session" button** (shown in Phase 3): Calls `supabase.from('log_clinical_records').update({ is_submitted: true, submitted_at: now() }).eq('id', sessionId)`, clears `ACTIVE_SESSION_KEY` from localStorage, then navigates away or shows a "Session Complete" screen.

**Sidebar resume fix (surgical):**
- The `PatientSelectModal` already has a "Resume" card that calls `handleResume()`. The root issue is that the modal shows at all when a valid in-progress session exists.
- BUILDER must verify the `_initialStoredSession` check at line 179 of `WellnessJourney.tsx`. If the stored session is valid (`readStoredSession()` returns non-null), `showPatientModal` initializes to `false` — meaning the modal should NOT show. Trace the specific code path that bypasses this guard when navigating from the sidebar.
- If sidebar navigation unmounts and remounts `WellnessJourney` (e.g. key changes in React Router), the localStorage guard will still fire. If it still creates a new session, the bug is in `handlePatientSelect` being called by an auto-trigger somewhere in the modal or routing. BUILDER must find and remove that auto-trigger.

**No schema changes required** for this WO.

---

### ⛔ SURGICAL SCOPE — DO NOT EXCEED

BUILDER is authorized to touch **only** the following:

| File | Permitted Change |
|------|-----------------|
| `DosingSessionPhase.tsx` | Add \"End Dosing Session\" button in Phase 2 view; on click: update `log_clinical_records.session_ended_at`, call `completeCurrentPhase()` |
| `WellnessJourney.tsx` | Add \"Close Out Session\" logic in Phase 3 view; on confirm: update `log_clinical_records.is_submitted + submitted_at`, clear `ACTIVE_SESSION_KEY`, navigate away. Audit sidebar navigation guard — trace the code path that shows `PatientSelectModal` despite a valid stored session |
| `clinicalLog.ts` | Add `endDosingSession(sessionId)` and `closeOutSession(sessionId)` helper functions if they do not exist |

**PROHIBITED without a new LEAD-approved WO:**
- Redesigning Phase 2 or Phase 3 UI layout
- Adding new columns to any table
- Creating a new SessionContext provider
- Auto-timeout or auto-close logic for abandoned sessions
- Touching any file not listed above

---
## INSPECTOR QA Sign-off
**Date:** 2026-03-11
**Verdict:** APPROVED. Code fixes verified on main branch.
