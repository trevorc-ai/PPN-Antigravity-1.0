---
id: WO-556
title: "Companion App — Event Buttons Must Log to Phase 2 Ledger & Graph"
status: 03_BUILD
owner: BUILDER
created: 2026-03-01T19:54:27-08:00
failure_count: 0
priority: P1
authored_by: LEAD
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

- [ ] Clicking "Session Update" on companion app creates an entry visible in the Phase 2 event ledger within the same session
- [ ] Clicking "Rescue Protocol" on companion app creates a `safety_event` entry visible in ledger
- [ ] Clicking "Adverse Event" on companion app creates a `safety_event` entry visible in ledger
- [ ] All companion events appear on the Phase 2 vitals/event graph as pins (same as events logged from Phase 2 directly)
- [ ] Events dispatched from companion are persisted to `log_session_timeline_events` via `createTimelineEvent` (UUID guard applied — no write for demo sessions)
- [ ] Existing companion video and button layout is unchanged — pure wiring fix only
- [ ] No regressions in Phase 2 direct event logging after companion wiring is added
- [ ] TypeScript: `npx tsc --noEmit` = 0 errors

---

## BUILDER IMPLEMENTATION COMPLETE

*(BUILDER to fill in this section when done)*

---

## INSPECTOR QA

*(To be completed in 04_QA after BUILDER handoff)*
