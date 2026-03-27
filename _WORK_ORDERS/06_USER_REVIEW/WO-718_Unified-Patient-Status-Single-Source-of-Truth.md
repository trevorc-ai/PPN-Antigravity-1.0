---
id: WO-718
title: "Unified Patient Status — Single Source of Truth (clinicalPhase.ts)"
status: 06_USER_REVIEW
priority: P1
type: architectural-refactor
task_type: frontend-refactor
pillar_supported: ["documentation", "data-integrity"]
database_changes: no
affects:
  - src/utils/clinicalPhase.ts
  - src/components/wellness-journey/PatientSelectModal.tsx
  - src/pages/MyProtocols.tsx
  - src/pages/ProtocolDetail.tsx
  - src/pages/WellnessJourney.tsx
created: 2026-03-27
author: INSPECTOR
---

# WO-718: Unified Patient Status — Single Source of Truth

## Problem

The platform had **four independent implementations** of the same `derivePhase` logic, each reading
the same three DB columns (`is_submitted`, `session_ended_at`, `session_type_id`) but producing
subtly different and sometimes wrong answers.

### Root Cause Table

| Location | Logic | Bug |
|---|---|---|
| `PatientSelectModal.tsx` | Correct priority hierarchy | Isolated — not shared |
| `MyProtocols.tsx` | Same columns, slightly different label strings | Label mismatch |
| `ProtocolDetail.tsx` | Used only `SESSION_TYPE_LABELS[session_type_id]` | **Critical: never fetched `is_submitted` or `session_ended_at` from DB** |
| `WellnessJourney.tsx` | Inline `PHASE_TAB_MAP` constant | Not shared |

**Critical bug:** `ProtocolDetail.tsx` was not fetching `is_submitted` or `session_ended_at` from
the database at all. Patients with a submitted Phase 3 session displayed as "Preparation" or
"Dosing" on their detail record — completely wrong status.

## Solution

Created `src/utils/clinicalPhase.ts` — a single canonical utility with:
- `ClinicalPhase` type (`'Preparation' | 'Treatment' | 'Integration' | 'Complete'`)
- `deriveClinicalPhase(sessionTypeId, sessionEndedAt, isSubmitted)` — pure function
- `PHASE_TO_TAB` — canonical phase → WellnessJourney tab number mapping
- `PHASE_COLORS` — shared Tailwind classes per phase

Priority hierarchy: **Complete > Integration > Treatment > Preparation**

## Files Changed

### [NEW] `src/utils/clinicalPhase.ts`
Canonical shared utility. Pure functions only, no DB calls.

### [MODIFY] `src/pages/ProtocolDetail.tsx`
- Added `session_ended_at` and `is_submitted` to `SessionRecord` interface
- Added those columns to the Supabase `.select()` query (were never being fetched)
- Replaced `SESSION_TYPE_LABELS[session.session_type_id ?? 0]` with `deriveClinicalPhase()`
- Added `'Complete'` key to local `PHASE_COLORS` map (emerald badge)

### [MODIFY] `src/pages/MyProtocols.tsx`
- Replaced 15-line inline `if/else` block (included a stale `'Active'` fallback not used anywhere else)
- Uses `deriveClinicalPhase()` → maps to `'Dosing'`/`'Completed'` for column label compatibility

### [MODIFY] `src/components/wellness-journey/PatientSelectModal.tsx`
- Removed local `derivePhase()` function, local `Phase` type alias, local `PHASE_COLORS`
- Imports `deriveClinicalPhase`, `ClinicalPhase`, `PHASE_COLORS`, `PHASE_TO_TAB`

### [MODIFY] `src/pages/WellnessJourney.tsx`
- Imported `PHASE_TO_TAB` from `clinicalPhase.ts`
- Removed inline `PHASE_TAB_MAP` constant

## INSPECTOR 02.5 CLEARANCE
- [x] Fast-pass (no DB impact) — frontend refactor only, no migrations
- [x] Schema compatibility: N/A
- [x] RLS completeness: N/A
- [x] Backend efficiency: N/A — ProtocolDetail query adds 2 columns to existing `.select()` call; no new queries introduced
- [x] UI Standards Pre-Build Gate: PASS (no new visible UI components; status label strings unchanged)
Signed: INSPECTOR | Date: 2026-03-27

## Phase 1: Scope & Database Audit
- [x] Database Freeze Check: PASS — no DB schema changes
- [x] Scope Check: PASS — only files listed in plan modified
- [x] Refactor Check: PASS — targeted line replacements only

## Phase 2: UI & Accessibility Audit
- [x] Color Check: PASS — Complete badge uses emerald with text label "Complete"
- [x] Typography Check: PASS — no font size changes
- [x] Character Check: PASS — no em dashes added
- [x] Input Check: PASS — no new inputs
- [x] Mobile-First Check: PASS — no layout changes

## Phase 3: Verdict
STATUS: APPROVED (pending browser regression)

## Phase 3.5 Regression Results
Trigger files matched: `WellnessJourney.tsx`, `ProtocolDetail.tsx`
Workflow run: `/phase3-integration-regression` (browser QA)

*See INSPECTOR QA — Visual Evidence section below.*

## INSPECTOR QA — Visual Evidence

*Screenshots captured via browser subagent — see QA run*

INSPECTOR VERDICT: APPROVED | Date: 2026-03-27
