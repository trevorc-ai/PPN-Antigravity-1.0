---
id: WO-723
title: "P0 — Session Timeline ledger: [ADD DOSE] appears twice (one empty), [ADVERSE EVENT] never appears"
owner: BUILDER
status: 04_BUILD
authored_by: LEAD (fast-track)
priority: P0
created: 2026-03-27
fast_track: true
origin: "User fast-track report with screenshot"
admin_visibility: no
admin_section: N/A
parked_context: ""
pillar_supported: Safety
task_type: bug-fix
files:
  - src/components/wellness-journey/DosingSessionPhase.tsx
  - src/components/wellness-journey/WellnessFormRouter.tsx
---

## Request

P0 — Two bugs in the Live Session Timeline ledger:
1. [ADD DOSE] appears twice — one is wrong/empty with no details, the other is correct
2. [ADVERSE EVENT] is not showing on the timeline at all

## LEAD Architecture

**Bug 1 (Duplicate ADD DOSE):** `DosingSessionPhase.tsx` `handleDosingSaved` fires `ppn:dose-registered` twice for additional dose — line 372 (placeholder, no label) then line 403 (rich dosingDesc label). Both create optimistic entries. Fix: remove the first placeholder dispatch, only fire after dosingDesc is computed.

**Bug 2 (Missing ADVERSE EVENT):** `WellnessFormRouter.tsx` `handleSafetyEventSave` — the observation log entries (loop lines 359–375) write to DB only, never dispatch `ppn:session-event`. The AE report dispatch (line 415) only fires when `data.event_type` is non-null. If the practitioner only fills Observation Log, no optimistic event is dispatched → nothing shows until DB refetch. Fix: dispatch `ppn:session-event` for each observation log entry immediately after the DB write.

**Pillar:** Safety — P0 because adverse event visibility is a live clinical safety record during a dosing session.

## Open Questions
- None — root causes confirmed via forensic read.
