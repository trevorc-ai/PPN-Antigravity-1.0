---
id: WO-696
title: "CrisisLogger Minimal UI — New PRODDY Proposal Required"
owner: PRODDY
status: 98_HOLD
priority: P0
created: 2026-03-26
hold_reason: "REDESIGN REQUIRED — Previous implementation obliterated the Dosing Session page layout. An adverse event capture UI must not restructure the most critical clinical screen. PRODDY must propose a minimal, non-intrusive pattern (likely a single dropdown or small trigger button). Must not add any persistent UI to the Dosing Session layout. Must not render if not actively in use. Previous files are REJECTED."
origin: "Intelligence Layer Integration Plan — Phase 0 Data Quality Activation"
pillar_supported: "1 — Safety Surveillance"
blocked_by: "WO-706 (CrisisLogger rendering bug must be resolved first); payload field discrepancy (ae_id / causality_id vs safety_event_type_id — run inspect-table.js log_safety_events before any new proposal)"
files_rejected:
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

---
- **Data from:** `WellnessJourney.tsx` session context (real `sessionId` + `siteId`); `ref_safety_event_types` (live ref lookup for `safety_event_type_id` — no free-text)
- **Data to:** `log_safety_events` (via `createSessionEvent()` on CrisisLogger submit); `mv_unresolved_safety_flags` (reflects new event after next MV refresh)
- **Theme:** Tailwind CSS, PPN design system — `CrisisLogger.tsx` hold-to-log gesture UI; mounted in `WellnessJourney.tsx` Phase 2 live section

---

## 🚨 INSPECTOR DB SAFETY ANNOTATION — 2026-03-27 (PAYLOAD DISCREPANCY — READ BEFORE BUILD)

**Source:** SESSION_HANDOFF.md Canonical Database Truths (verified 2026-03-27)

### Critical Discrepancy Found

This WO's Required Fix (step 3) states the payload should include `safety_event_type_id`. The **verified minimum payload contract** for `log_safety_events` from the ChatGPT DB audit is:

| Required Field | Notes |
|---|---|
| `ae_id` | Adverse event FK — this may correspond to what the WO calls `safety_event_type_id`, but the **column name must be confirmed** |
| `causality_id` | Causality assessment FK — **not mentioned anywhere in this WO's plan** |

**Neither `ae_id` nor `causality_id` appear in the current WO plan. The WO must be updated before build.**

### Mandatory Pre-Build Step
```bash
node .agent/scripts/inspect-table.js log_safety_events
```
Run this FIRST. Map the actual live NOT NULL column names to the WO's payload plan. Do not assume `safety_event_type_id` = `ae_id` without confirming.

### Dependency Flag
**WO-706** (`CrisisLogger-Not-Rendering.md`) is in `98_HOLD`. Confirm WO-706's hold reason is resolved before building WO-696. If CrisisLogger is not rendering, mounting it in `WellnessJourney.tsx` will not produce the expected result. Verify the component renders correctly in isolation first.

**STATUS: This WO requires PRODDY plan amendment and INSPECTOR re-clearance before going to BUILD.**
