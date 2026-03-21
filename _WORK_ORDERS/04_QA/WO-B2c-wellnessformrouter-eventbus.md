---
id: WO-B2c
title: "Track B2c — WellnessFormRouter: Add ppn:session-event Dispatches + Fix Rescue Protocol Event Code"
track: B
priority: P0
status: 04_QA
created: 2026-03-21
completed_at: 2026-03-21
author: ANTIGRAVITY (planning), BUILDER (execution)
builder_notes: "Fixed rescue protocol event_type_code from 'session_completed' to 'safety_event' (WellnessFormRouter line 441). Added ppn:session-event dispatches to handleSafetyEventSave and handleRescueProtocolSave; extracted timestamp/desc vars for dispatch reuse."
depends_on: WO-B0
references:
  - STABILIZATION_BRIEF.md
  - WellnessFormRouter.tsx (lines 329-453)
  - refFlowEventTypes.ts (19 valid codes, confirmed)
affects:
  - src/components/wellness-journey/WellnessFormRouter.tsx
  - src/services/refFlowEventTypes.ts (read-only — DO NOT MODIFY)
verification: /phase2-session-regression checklist
---

# WO-B2c — WellnessFormRouter: Event Bus Dispatches + Rescue Protocol Event Code Fix

## Background

This WO was identified during the holistic blast radius review on 2026-03-21.
It is a **P0 blocker** that was missed in the initial Track B planning.

## Problem 1 — Missing ppn:session-event Dispatches (FAIL 2, 4, 5, 6)

`WellnessFormRouter.tsx` handles form saves for ALL Phase 2 clinical actions
(Safety/AE, Rescue Protocol). These handlers write to the DB but **never dispatch
`ppn:session-event` to the event bus**. This means:

- Safety & Adverse Event saves → no real-time timeline update (FAIL 6 partial)
- Rescue Protocol saves → no real-time timeline update (FAIL 4 partial)

The event bus dispatches for these two paths MUST be added to
`WellnessFormRouter.tsx` handlers, not just to `SessionCockpitView.tsx`.

### Fix — Add dispatch to `handleSafetyEventSave` (lines 329-411)

At the end of the `handleSafetyEventSave` function, after the DB write:

```typescript
// After the timeline stamp write:
const aeLabel = aeParts.join(' · ');
window.dispatchEvent(new CustomEvent('ppn:session-event', {
    detail: {
        type: 'safety-and-adverse-event',
        label: aeLabel || 'Adverse Event logged',
        timestamp: data.occurred_at
            ? new Date(data.occurred_at).toISOString()
            : new Date().toISOString(),
    }
}));
```

### Fix — Add dispatch to `handleRescueProtocolSave` (lines 413-453)

At the end of the successful rescue protocol save:

```typescript
// After the timeline stamp write:
window.dispatchEvent(new CustomEvent('ppn:session-event', {
    detail: {
        type: 'rescue-protocol',
        label: rescueParts.join(' · '),
        timestamp: data.start_time ?? new Date().toISOString(),
    }
}));
// Also dispatch ppn:dose-registered for the optimistic entry:
window.dispatchEvent(new CustomEvent('ppn:dose-registered', {
    detail: {
        type: 'rescue-protocol',
        label: rescueParts.join(' · '),
        elapsedSec: 0, // BUILDER: calculate from start_time if available
    }
}));
```

---

## Problem 2 — Rescue Protocol Uses Wrong event_type_code (DB Data Integrity)

**File:** `WellnessFormRouter.tsx` line 441

```typescript
// Current (WRONG):
event_type_code: 'session_completed', // closest valid DB code for rescue entries
```

`session_completed` is semantically incorrect for rescue protocol entries.
It causes rescue events to appear as session end markers in the timeline ledger.

**Root cause:** `rescue_protocol_administered` does not exist in
`ref_flow_event_types` (confirmed via `refFlowEventTypes.ts` — only 19 codes).

### Fix Options (in order of preference)

**Option A — Use `safety_event` code (preferred, no schema change needed):**

```typescript
// BUILDER: change line 441 from:
event_type_code: 'session_completed',
// to:
event_type_code: 'safety_event',
```

`safety_event` is a valid code and semantically correct (rescue protocol IS a
safety intervention). `LiveSessionTimeline.tsx` already maps `'rescue-protocol'`
as a display type via `EVENT_CONFIG`, but the DB code `safety_event` is valid.
The `event_description` in `metadata` makes the specific intervention clear.

**Option B — Add `rescue_protocol_administered` to `ref_flow_event_types` table (schema change):**

> [!IMPORTANT]
> This requires a DB migration per `/schema-change-policy` and `/migration-execution-protocol`.
> Do NOT execute this inline. If selected, create a separate schema WO.

Option A is recommended for this sprint. Option B can be addressed in a follow-up
schema cleanup WO (track: Stabilization Phase C).

---

## Verification

1. During a live session, trigger the Rescue Protocol form
2. Submit the form
3. Timeline Panel B should update **immediately** with the rescue entry
4. The timeline entry should show the rescue intervention details (not just "session completed")
5. After page refresh, the entry should still appear with correct description
6. Trigger Adverse Event form → submit → verify same immediate update
7. Run /phase2-session-regression checklist

## Scope Note

This WO touches only `WellnessFormRouter.tsx`. The BUILDER must NOT touch
`refFlowEventTypes.ts` (read-only for this WO) or the DB migration files.
