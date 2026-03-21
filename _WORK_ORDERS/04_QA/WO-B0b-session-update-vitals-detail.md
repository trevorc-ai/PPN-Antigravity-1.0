---
id: WO-B0b
title: "Track B0b — Enrich Timeline Entries with Vitals + Action Detail"
track: B
priority: P0
status: 04_QA
created: 2026-03-21
completed_at: 2026-03-21
author: ANTIGRAVITY (planning), BUILDER (execution)
builder_notes: "Injected HR and BP into sessionUpdateDesc in handleSaveUpdate (DosingSessionPhase.tsx lines 823-828); added ppn:session-event dispatch after vitals are emitted (lines 854+)."
depends_on: WO-B0
references:
  - STABILIZATION_BRIEF.md
  - HANDOFF_2026-03-21.md
affects:
  - src/components/wellness-journey/DosingSessionPhase.tsx
  - src/components/wellness-journey/SessionCockpitView.tsx
verification: /phase2-session-regression checklist
---

# WO-B0b — Enrich Timeline Entries with Vitals + Action Detail

## Problems

### FAIL 3: Session Update timeline entries show no vitals

`handleSaveUpdate()` in `DosingSessionPhase.tsx` already builds `sessionUpdateDesc`
from Affect / Responsiveness / Comfort / Note fields (lines 823-828). However,
it does NOT include HR or BP in that description. Vitals are written to
`log_session_vitals` separately but never surface in the timeline ledger text.

**Current description (line 828):**
```
"Affect: Calm · Responsiveness: Fully responsive · Monitoring closely"
```

**Required description:**
```
"Affect: Calm · Responsiveness: Fully responsive · HR: 72 bpm · BP: 120/80 · Monitoring closely"
```

Additionally, `handleSaveUpdate()` does NOT dispatch `ppn:session-event`, so the
cockpit timeline doesn't update in real-time (related to WO-B0 but the Session
Update path is in DosingSessionPhase, not SessionCockpitView).

### FAIL 5: P.Spoke / Music / Decision descriptions are generic prefixes

The chip descriptions (`action.desc`) are hardcoded to:
- `'Patient reported: '`
- `'Playlist changed to: '`
- `'Decision made: '`

There is no prompt for the practitioner to enter the specific detail before the
event is logged. The event is written to the DB immediately on tap with only the
prefix.

### FAIL 6: Adverse Event incorrect timestamp

The Adverse Event form writes `event_timestamp: new Date().toISOString()` but
this occurs at form-open time or form-save time — the WO must confirm the exact
execution path in `WellnessFormRouter.tsx` to determine whether the timestamp is
captured at the wrong moment.

---

## Fix 1 — Session Update: include vitals in description

**File:** `DosingSessionPhase.tsx` — `handleSaveUpdate()` (lines 820-837)

After the existing `descParts` assembly, append vitals if present:

```typescript
// After building descParts from affect/responsiveness/comfort/note:
const vitalsParts: string[] = [];
if (updateHR)              vitalsParts.push(`HR: ${updateHR} bpm`);
if (updateBPSys && updateBPDia) vitalsParts.push(`BP: ${updateBPSys}/${updateBPDia}`);
else if (updateBPSys)      vitalsParts.push(`BP Sys: ${updateBPSys}`);
// Insert vitals before the free-text note in the description
if (vitalsParts.length > 0) {
    // Place vitals after clinical selects but before free-text note
    const noteIdx = descParts.length > 0 && updateNote.trim()
        ? descParts.length - 1
        : descParts.length;
    descParts.splice(noteIdx, 0, ...vitalsParts);
}
const sessionUpdateDesc = descParts.join(' · ') || 'Session update logged';
```

**Also add ppn:session-event dispatch at end of handleSaveUpdate():**

```typescript
window.dispatchEvent(new CustomEvent('ppn:session-event', {
    detail: {
        type: 'session_update',
        label: sessionUpdateDesc,
        timestamp: new Date().toISOString(),
    }
}));
```

---

## Fix 2 — Quick-Action Chips: append user detail to description

**File:** `SessionCockpitView.tsx` — quick-action chip row (lines 477-501)

**Option A (preferred for safety):** On chip tap, open the Session Update panel
(already calls `openAndScrollToUpdatePanel()`) and let the practitioner use the
existing Session Note field to add context. The chip tap logs the event type
immediately with the prefix, and any detail is added via the Note field in Panel C.

This avoids adding an inline prompt to the chip row which would disrupt the
dark-room UI. Recommended approach for stabilization.

**Option B (full implementation):** Add a lightweight bottom-sheet prompt on chip
tap where the practitioner can type or select the detail before the event is
committed. This is larger scope and should be deferred to a follow-up WO.

> **Decision required from Trevor:** Option A (immediate, surgical) or Option B
> (full prompt, larger scope). Default to Option A for this stabilization sprint.

---

## Fix 3 — Adverse Event timestamp

**BUILDER must:**
1. Open `src/components/wellness-journey/WellnessFormRouter.tsx`
2. Find the `safety-and-adverse-event` form save handler
3. Confirm whether `event_timestamp` is captured at form-open or form-save
4. If captured at open: move timestamp capture to immediately inside the save handler
5. If captured at save: investigate timezone offset issue

The correct timestamp is `new Date().toISOString()` at the moment the
practitioner taps "Submit" on the Adverse Event form.

---

## Verification

1. Log a Session Update with HR=72, BP=120/80, Affect=Calm
2. Open timeline (after page refresh) — entry should show:
   `Affect: Calm · HR: 72 bpm · BP: 120/80`
3. Tap P.Spoke chip — entry should appear immediately in timeline
4. Log an Adverse Event — verify timestamp matches current wall-clock time
5. Run /phase2-session-regression checklist
