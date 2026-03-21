---
id: WO-B3
title: "Track B3 — Session Closeout: Wire endDosingSession + hasSafetyEvents"
track: B
priority: P2
status: 04_QA
completed_at: 2026-03-21
builder_notes: "hasSafetyEvents useMemo already correct from B0 work. Safety events row in SessionCloseoutView converted from non-interactive div to conditional button/div — onClick wired to setShowPostSessionTimeline(true) so practitioners can review events in the timeline accordion, accessibility attributes added (aria-label, aria-controls)."
author: ANTIGRAVITY (planning), BUILDER (execution)
depends_on: WO-B1, WO-B2
references:
  - STABILIZATION_BRIEF.md — Track B, B3
  - SessionCloseoutView.tsx
  - DosingSessionPhase.tsx (handleEndSession, handleSubmitAndClose)
affects:
  - src/components/wellness-journey/DosingSessionPhase.tsx
  - src/components/wellness-journey/SessionCloseoutView.tsx
verification: Full Phase 2 closeout flow verified manually
---

# WO-B3 — Session Closeout: Wire endDosingSession + hasSafetyEvents

## Current State (Confirmed by Code Review)

`handleEndSession` in `DosingSessionPhase.tsx` (lines 1001-1012) calls
`endDosingSession(resolvedSessionId)` and sets mode to 'post'. This is wired
and functional.

`handleSubmitAndClose` (lines 1078-1090) calls `createTimelineEvent` with
`session_completed` and then `onCompletePhase()`. This is also wired.

**The gap is `hasSafetyEvents`** — `SessionCloseoutView` receives this prop,
but in `DosingSessionPhase.tsx` this is derived as:

```typescript
const hasSafetyEvents = /* TODO: confirm derivation */ ;
```

**BUILDER must confirm:** Open `DosingSessionPhase.tsx` and search for
`hasSafetyEvents`. If it is hardcoded to `false` or not derived from the DB,
this is the bug — the Safety Events Review row in `SessionCloseoutView` will
always show "NO EVENTS" even when rescue protocol and adverse events were logged.

## What Must Be Built

### If hasSafetyEvents is hardcoded false:

Derive it from the eventLog or fetch from `log_safety_events`:

```typescript
// Option A: derive from local eventLog (fastest, no extra DB call):
const hasSafetyEvents = useMemo(() =>
    eventLog.some(ev =>
        ev.type === 'safety-and-adverse-event' ||
        ev.type === 'rescue-protocol' ||
        ev.type === 'safety_event'
    ),
[eventLog]);

// Option B: fetch from log_safety_events on mode='post'
// (more reliable, catches events logged in previous sessions or by other means)
```

Option A recommended for this sprint. Option B can be a follow-up.

### Review the Safety Events accordion in SessionCloseoutView

`SessionCloseoutView.tsx` lines 173-194: the Safety Events row shows but has no
onClick handler when `hasSafetyEvents` is true. It has `cursor-pointer` styling
but no action is bound. Consider:
- Navigating to the full session timeline (already collapsible in the same view)
- Opening a modal showing the filtered safety events

This is a UX gap but not a data integrity issue.

## Verification

1. Run a session with a Rescue Protocol event
2. End the session (mode → 'post')
3. Confirm "Review Safety Events" checklist row shows "REVIEW" (not "NO EVENTS")
4. Submit and Close — confirm `session_completed` timeline event is written
5. Run /phase2-session-regression checklist
