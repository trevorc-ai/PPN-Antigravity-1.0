---
id: WO-696
title: "Wire CrisisLogger into live Phase 2 dosing session workflow"
owner: PRODDY
status: 01_TRIAGE
priority: P0
created: 2026-03-26
origin: "Intelligence Layer Integration Plan — Phase 0 Data Quality Activation"
pillar_supported: "1 — Safety Surveillance"
sequence_note: "Ship after WO-695 has soaked. Independent of WO-695 technically, but deploy second for cleaner regression isolation. Safety event data will not flow until this lands."
files:
  - src/pages/WellnessJourney.tsx
  - src/components/session/CrisisLogger.tsx
---

## Problem

`CrisisLogger.tsx` exists and its write path (`createSessionEvent()` → `log_safety_events`) is
fully functional. However, a grep confirms it is **only rendered in `ComponentShowcase.tsx`** —
not in the live Phase 2 dosing session.

The only production safety event writes happen via the rescue protocol path in
`WellnessFormRouter.tsx` (lines 334, 380, 430). Routine adverse events (nausea, anxiety spike,
dissociation, vitals concern) during a live session have no UI capture surface.

**Impact:** `log_safety_events` remains empty for all real sessions. `mv_unresolved_safety_flags`,
`mv_site_safety_benchmarks`, and `mv_clinician_work_queue` safety columns all return zero.
Safety surveillance (Pillar 1) is blind to real clinical events.

## Required Fix

1. Audit `CrisisLogger.tsx` — confirm no Showcase-only hard dependencies (mock session IDs, etc.)
2. Mount `CrisisLogger` inside the live Phase 2 section of `WellnessJourney.tsx`, passing the
   real `sessionId` and `siteId` from session context
3. Confirm the component's submit handler calls `createSessionEvent()` with the correct payload
   (session_id, site_id, safety_event_type_id via live ref lookup — no free-text)

## Success Criteria

- CrisisLogger is accessible during a live Phase 2 session
- Submitting an event creates a row in `log_safety_events` with correct `session_id` and `site_id`
- `mv_unresolved_safety_flags` reflects the new event after next MV refresh
- ComponentShowcase continues to render CrisisLogger independently (no regression)

## INSPECTOR Pre-Build Note

Write-path mount — requires PRODDY plan and INSPECTOR clearance before build.
No schema change. No new DB objects. Pure UI wiring.
