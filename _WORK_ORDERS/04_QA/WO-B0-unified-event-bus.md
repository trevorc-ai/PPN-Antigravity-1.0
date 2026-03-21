---
id: WO-B0
title: "Track B0 — Unified Session Event Bus"
track: B
priority: P0
status: 04_QA
created: 2026-03-21
completed_at: 2026-03-21
author: ANTIGRAVITY (planning), BUILDER (execution)
builder_notes: "Added ppn:session-event dispatch to QUICK_ACTIONS chip handler in SessionCockpitView.tsx (lines 481+); added ppn:dose-registered dispatch to Rescue Protocol button onClick in SessionPrepView.tsx (lines 515+)."
references:
  - STABILIZATION_BRIEF.md
  - HANDOFF_2026-03-21.md
  - UI_UX_GUARDRAILS.md
affects:
  - src/components/wellness-journey/SessionCockpitView.tsx
  - src/components/wellness-journey/DosingSessionPhase.tsx
verification: /phase2-session-regression checklist
---

# WO-B0 — Unified Session Event Bus

## Problem

The mobile cockpit's quick-action chips (P.Spoke / Music / Decision) and the
Rescue Protocol handler write to the DB but **never dispatch `ppn:session-event`**
to the event bus. `LiveSessionTimeline` listens for this event to update its
local state immediately. Without the dispatch, new events only appear after a
full browser refresh.

**Confirmed root cause — `SessionCockpitView.tsx` lines 477-501:**

```typescript
// Quick-action chip onClick (current broken code):
onClick={() => {
    const sid = journey.sessionId ?? journey.session?.sessionId;
    if (sid) {
        createTimelineEvent({ ... metadata: { event_description: action.desc } })
          .catch(...);
    }
    openAndScrollToUpdatePanel(); // ← NO ppn:session-event dispatch ❌
}}
```

The DB write fires but the event bus is never notified. `LiveSessionTimeline`
(which has `hideActions={true}` in cockpit Panel B) never hears about it.

## What FAILS Without This Fix

- FAIL 2: New events do not appear in cockpit timeline without page refresh
- FAIL 5: Observation / Music / Decision — generic `action.desc` only, no detail

## Surgical Fix

### File 1: `SessionCockpitView.tsx` — Quick-action chips (lines 477-501)

After the `createTimelineEvent` call in each chip's `onClick`, add:

```typescript
// After the DB write:
const eventTimestamp = new Date().toISOString();
window.dispatchEvent(new CustomEvent('ppn:session-event', {
    detail: {
        type: action.type,
        label: action.desc,   // same string shown in the DB write
        timestamp: eventTimestamp,
    }
}));
```

**Note on FAIL 5:** The chips currently pass `action.desc` as the description
(e.g. `'Patient reported: '`, `'Playlist changed to: '`). This is a hardcoded
prefix with no user-entered content appended. The fix for FAIL 5 requires the
chip to prompt for additional detail — but that is a separate UX flow (WO-B0b
scope or follow-up). For this WO, the fix is the event bus dispatch only,
using `action.desc` as the label. The detail problem is documented in WO-B0b.

### File 2: `DosingSessionPhase.tsx` — Rescue Protocol handler

> **BUILDER must locate the Rescue Protocol handler** in `SessionPrepView.tsx`
> (extracted from DosingSessionPhase as part of the component split). When
> Rescue Protocol writes to the DB, add:

```typescript
window.dispatchEvent(new CustomEvent('ppn:session-event', {
    detail: {
        type: 'rescue-protocol',
        label: 'Rescue Protocol initiated',
        timestamp: new Date().toISOString(),
    }
}));
```

Also dispatch `ppn:dose-registered` so the optimistic entry appears immediately:

```typescript
window.dispatchEvent(new CustomEvent('ppn:dose-registered', {
    detail: {
        type: 'rescue-protocol',
        label: 'Rescue Protocol initiated',
        elapsedSec: getElapsedSec(),
    }
}));
```

## Verification

1. Start a live session in the cockpit (mobile view)
2. Tap P.Spoke — entry should appear in Panel B timeline **immediately**, no refresh
3. Tap Music — entry should appear immediately
4. Tap Decision — entry should appear immediately
5. Trigger Rescue Protocol — entry should appear immediately
6. Verify all entries also persist after page refresh (DB write confirmed)

## Out of Scope for This WO

- Detail appending to P.Spoke / Music / Decision (WO-B0b)
- Adverse Event timestamp fix (WO-B0b)
- Vitals chart blank (WO-B0c)
