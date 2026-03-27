---
wo: WO-718
title: DB-First Wellness Journey Routing — Single Source of Truth Refactor
status: 02_TRIAGE
priority: P0
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

---

## LEAD Architecture Constraints — Scope Guard (2026-03-27)

### Surgical Targets Only

`WellnessJourney.tsx` is 1,763 lines and orchestrates all 3 clinical phases. BUILDER must treat this as a **microsurgical operation** — touch only the 3 useEffect hooks and the modal show/hide logic. No other changes.

| Target | Location | Change |
|---|---|---|
| `readStoredSession()` / useEffect line 227 | Line 142–230 | Downgrade from identity source to **timer-only fallback**. Keep reading `patientId`/`sessionId` from stored session for the Phase 2 timer display ONLY. Do NOT use it to determine phase or show/hide modal. |
| `activePatientUuid` auto-load useEffect | Lines 241–345 | **DB already wins here** — this hook already queries `log_clinical_records`. The only fix: remove the `if (stored?.patientUuid === activePatientUuid) return` early-exit on line 245 — it silently skips DB re-query when localStorage has a stale entry for the same UUID. |
| `showPatientModal` initial state | Lines 192–209 | Add a 4th bypass condition: if `activePatientUuid` is set in context at mount time, set `showPatientModal = false` immediately (no wait for URL params). |
| `ppn_session_mode_*` / `ppn_session_start_*` | Lines 287–294 | **DO NOT REMOVE.** These localStorage keys power the Phase 2 live session timer and `TreatmentPhase` sub-component. They are NOT the identity bug — they are session state only. |
| `ACTIVE_SESSION_KEY` | Line 138 | **DO NOT REMOVE the key.** Only remove it as an authoritative identity source. It may still be used to show the "Resume session" card in `PatientSelectModal` (display-only use). |

### Regression Risk — HIGH

Files affected by this WO trigger **both** regression workflows:
- `WellnessJourney.tsx` → `/phase2-session-regression` (all 4 scenarios)
- `WellnessJourney.tsx` → `/phase3-integration-regression` (all 4 scenarios)

**INSPECTOR must run both before any commit.**

### ActivePatientContext.tsx

- **NOT frozen** — may be audited
- **Read-only audit only** — BUILDER may read but should NOT modify unless `activePatientUuid` fails to propagate correctly into the auto-load hook

### Hard Constraints for BUILDER

1. **Do NOT touch** any Phase 1/2/3 form components
2. **Do NOT change** the `journey` state shape (`PatientJourney` interface)
3. **Do NOT remove** `ACTIVE_SESSION_KEY` — only demote it from identity source
4. **Do NOT alter** `ppn_session_mode_*` or `ppn_session_start_*` key reads/writes
5. **maximum 3 useEffect hooks touched** — if scope expands beyond that, STOP and file a scope amendment
6. **Additive only** — add DB-first guard; do not delete existing else-branches without INSPECTOR sign-off

### LEAD Priority Verdict

This is a **P0 data integrity bug**. Every navigation path that does not use a fresh URL param silently falls back to stale localStorage — practitioners may see the wrong patient's phase state. Route to INSPECTOR for Phase 0 pre-build review immediately.

LEAD signed | Date: 2026-03-27

---

## INSPECTOR Phase 0 — Fast-Pass Clearance (2026-03-27)

**DB change check:** `database_changes: no` — FAST-PASS eligible.

**UI Standards Gate — WellnessJourney.tsx:**
- CHECK 1 (bare text-xs): Pre-existing on lines 1353/1373/1490/1716 — not in WO-718 scope. BUILDER-added lines contain no new text-xs.
- CHECK 2 (low contrast): ✅ PASS
- CHECK 3 (details/summary): ✅ PASS
- CHECK 4 (em dash): Pre-existing on lines 336/1348–1349/1425 — string literals and toast messages, not rendered body text violations. No new em-dashes introduced.
- CHECK 5 (banned fonts): ✅ PASS

**Freeze check:** WellnessJourney.tsx — NOT frozen. ✅

INSPECTOR FAST-PASS CLEARED | Date: 2026-03-27

---

## BUILDER Completion Notes (2026-03-27)

**Changes applied — WellnessJourney.tsx only:**

**Fix 1 — showPatientModal initializer (~line 202):**
Added 4th bypass condition: `if (activePatientUuid && UUID_RE_LOCAL.test(activePatientUuid)) return false;`
Prevents modal from flashing open when activePatientUuid is already in context (sidebar nav, Protocol Detail back button, any in-app navigation). DB auto-load useEffect resolves phase immediately.

**Fix 2 — activePatientUuid auto-load useEffect (~line 245):**
Removed: `const stored = readStoredSession(); if (stored?.patientUuid === activePatientUuid) return;`
This stale localStorage early-exit was short-circuiting the DB query when localStorage had a prior entry for the same UUID — the root cause of all path-dependent phase state inconsistencies.

**Not touched:** `ppn_session_mode_*`, `ppn_session_start_*`, `ACTIVE_SESSION_KEY`, Phase 1/2/3 forms, journey state shape, ActivePatientContext.tsx.

**Post-fix verification:**
- Fix 1 present: ✅ `grep "WO-718: Skip modal"` matches line 202
- Fix 2 removed: ✅ Executable guard gone — only comment referencing old code remains
- All 5 UI standards checks: ✅ PASS (no new violations introduced)
- Lines changed: ~6 lines removed, ~8 lines added — surgical

**Regression gate required:** `/phase2-session-regression` + `/phase3-integration-regression` — USER must run live session tests.
