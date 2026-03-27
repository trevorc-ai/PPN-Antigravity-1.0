---
wo: WO-718
title: DB-First Wellness Journey Routing — Single Source of Truth Refactor
status: TRIAGE
priority: P1
phase: ARCHITECTURE
filed: 2026-03-27
filed_by: LEAD
theme: Clinical Workflow Integrity
---

# WO-718 — DB-First Wellness Journey Routing

## Problem

The Wellness Journey component (`WellnessJourney.tsx`) uses three competing
sources of truth in inconsistent priority order, depending on navigation path:

| Priority | Source | Trust Level |
|---|---|---|
| 1 (current) | `localStorage` | ❌ Stale, path-dependent |
| 2 (current) | URL params | ✓ Correct when deep-linked |
| 3 (current) | Database | ✓ Always correct |

This causes **path-dependent inconsistencies**: the same patient shows different
phase state depending on whether the practitioner enters via the sidebar, Protocol
Detail back button, a direct URL, or after Phase 3 close. Local state diverges
from the DB after any non-standard navigation.

## Root Cause

`localStorage` was used as a fast-path to avoid DB round-trips. Over time it
became treated as the authoritative source for session identity and phase
determination — which it should never be. The DB is immutable and always correct.

## Proposed Fix

### Rule 1 — DB wins for phase determination
When `patientUuid` is known, **always** re-query the DB to determine the current
phase. LocalStorage may only be consulted for the session-start timestamp (live
dosing timer) — never for `sessionId` identity or phase state.

### Rule 2 — Bypass the patient modal when patientUuid is already in context
The patient select modal should only appear when there is truly no patient context:
- No `patientUuid` in URL params
- No `patientUuid` in `ActivePatientContext`
- No `patientUuid` in React journey state

If any of the above is set, skip the modal and load directly from DB.

### Rule 3 — Clean slate on new treatment cycle
When "Begin New Preparation" is clicked from Phase 3 complete state, persist the
`patientUuid` but issue a DB query to confirm no open session exists. Clear only
session-level localStorage keys (`ppn_session_mode_*`, `ppn_session_start_*`).
Do NOT use `setJourney(sessionId: undefined)` as a signal — always verify with DB.

## Files to Modify

| File | Change |
|---|---|
| `src/pages/WellnessJourney.tsx` | Refactor 2 auto-load `useEffect` hooks to DB-first; modal show/hide logic; remove localStorage as session identity signal |
| `src/contexts/ActivePatientContext.tsx` | Audit: ensure patientUuid propagates into journey auto-load when set |

## Out of Scope

- Phase 1/2/3 form components (no changes)
- Database schema (no changes)
- Protocol Detail page (no changes)

## Verification Plan

Test all 4 entry paths to Wellness Journey and confirm identical phase state:
1. Sidebar → Wellness Journey (modal shown ✓)
2. Protocol Detail → Back → Wellness Journey (no modal, direct load)
3. Direct URL with `?patient=uuid` (no modal, direct load)
4. After Phase 3 → Begin New Preparation (Phase 1, fresh DB-driven state)

Regression: `/phase2-session-regression` and `/phase3-integration-regression` workflows.

---
**Data from:** `log_clinical_records` (`is_submitted`, `session_ended_at`, `session_type_id`)
**Data to:** `WellnessJourney.tsx` phase routing state
**Theme:** Session Continuity / Clinical Workflow Integrity
