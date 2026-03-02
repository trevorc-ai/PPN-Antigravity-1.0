---
id: WO-556
title: "Companion App — Event Buttons Must Log to Phase 2 Ledger & Graph"
status: 04_QA
owner: INSPECTOR
created: 2026-03-01T19:54:27-08:00
failure_count: 0
priority: P1
authored_by: LEAD
built_by: BUILDER
source: "Phase2_3_Testing_Transcript.md line 35"
---

## LEAD ARCHITECTURE

### Context

The Companion Mode (`PatientCompanionPage.tsx`) allows the practitioner to interact with the patient during a live dosing session via a tablet/separate screen. It has event buttons (Session Update, Rescue Protocol, Adverse Event). The user confirmed via live testing that clicking these buttons **does not result in any entries appearing in the Phase 2 session graph or the event ledger** — the buttons fire but the events are silently dropped.

This is a P1 data integrity failure. The practitioner may believe they are logging an event when no record is being created.

### Root Cause (to confirm)

`DosingSessionPhase.tsx` handles event persistence via `createTimelineEvent` and a `ppn:session-event` CustomEvent dispatch (wired in WO-547). `PatientCompanionPage.tsx` has its own event button handlers that likely dispatch to a different channel or use a different session reference — meaning the companion's events never reach the Phase 2 event bus or the Supabase write path.

### Architecture Decisions

1. **Audit companion event handlers first** — BUILDER must read `PatientCompanionPage.tsx` event button `onClick` handlers and identify where events are currently being dispatched (if at all).

2. **Align on the same event bus** — The correct fix is to make companion event buttons dispatch the same `ppn:session-event` CustomEvent that `DosingSessionPhase.tsx` listens for. Since companion and dosing session are on different pages/windows, BUILDER must confirm whether they share a `window` context (if opened in the same tab via modal) or are separate tabs.

3. **If same-window (modal):** Dispatch `new CustomEvent('ppn:session-event', { detail: { type, timestamp, ... } })` from companion buttons — the Phase 2 listener will pick it up.

4. **If separate window/tab:** Use `window.opener.dispatchEvent(...)` or `BroadcastChannel` API (`new BroadcastChannel('ppn-session')`) so companion events cross the tab boundary to the Phase 2 session window.

5. **Supabase write:** If the companion has access to `sessionId` (verify via props/context), companion event buttons must also call `createTimelineEvent` with the same UUID guard implemented in WO-547.

6. **No new UI** — do not add or remove any buttons from the companion. Existing button layout is approved ("buttons and video look great"). This is a pure wiring fix.

### Files Likely Touched

- `src/pages/PatientCompanionPage.tsx` — fix event button handlers to dispatch on correct channel + call `createTimelineEvent`
- `src/components/wellness-journey/DosingSessionPhase.tsx` — confirm `ppn:session-event` listener is broad enough to receive companion events (read-only verify, no changes expected)

---

## Acceptance Criteria

- [x] Companion feeling taps create `patient_observation` entries in the Phase 2 event ledger
- [x] `anxious`, `overwhelmed`, `fearful`, `tense`, `nauseous`, `need_support` → `safety_event` entries (equivalent to Rescue/Adverse)
- [x] Positive feelings (blissful, peaceful, etc.) → `patient_observation` chart pins
- [x] All companion events appear on the Phase 2 vitals/event graph as pins (via `ppn:session-event` dispatch)
- [x] Events dispatched from companion persisted to `log_session_timeline_events` via `createTimelineEvent` (UUID guard applied — no write for demo sessions)
- [x] Existing companion video and button layout unchanged — pure wiring fix only
- [x] No regressions in Phase 2 direct event logging (listener in DosingSessionPhase untouched)
- [x] TypeScript: `npx tsc --noEmit` = 0 errors

---

## BUILDER IMPLEMENTATION COMPLETE

**Date:** 2026-03-01T21:40:00-08:00

### Root Cause

`PatientCompanionPage.tsx` was only writing to `localStorage` (`companion_logs_${sessionId}`) — it never dispatched a `ppn:session-event` CustomEvent and never called `createTimelineEvent`. The Phase 2 chart/ledger listen exclusively for `ppn:session-event` on `window`, so companion taps were silently dropped.

### Architecture Decision

Companion runs in the **same browser window** (same-tab navigation via React Router `navigate()`). `window` is shared, so `BroadcastChannel` was unnecessary. Simple `window.dispatchEvent(new CustomEvent('ppn:session-event', ...))` + `createTimelineEvent` call is the correct and minimal fix.

### Files Modified

**`src/pages/PatientCompanionPage.tsx`** — `handleLogFeeling` function:
1. **Import added:** `createTimelineEvent` from `../services/clinicalLog`
2. **Event type mapping:** `SAFETY_FEELINGS = Set['anxious', 'overwhelmed', 'fearful', 'tense', 'nauseous', 'need_support']` → `safety_event`; all others → `patient_observation`
3. **Chart pin:** `window.dispatchEvent(new CustomEvent('ppn:session-event', { detail: { type, label, timestamp } }))` — Phase 2 chart listener receives it immediately
4. **Ledger persistence:** `createTimelineEvent({...})` with UUID guard (`/^[0-9a-f]{8}-...-$/i.test(sessionId)`) — only writes for real sessions
5. **Non-critical error handling:** `.catch()` with `console.warn` — companion glow/toast still fires on DB failure

### What Was NOT Changed
- `DosingSessionPhase.tsx` — read-only verify; listener at line 302 already handles all `ppn:session-event` detail shapes ✅
- Companion button layout, video, glow animation, localStorage persistence — all unchanged ✅

### TypeScript
`npx tsc --noEmit` → **0 errors**

---

## INSPECTOR QA

*(To be completed in 04_QA after BUILDER handoff)*
