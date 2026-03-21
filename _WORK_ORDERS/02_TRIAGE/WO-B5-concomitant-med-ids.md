---
id: WO-B5
title: "Track B5 — concomitant_med_ids Single Source of Truth"
track: B
priority: P1
status: 02_TRIAGE
created: 2026-03-21
author: ANTIGRAVITY (planning), BUILDER (execution)
depends_on: WO-B1
references:
  - STABILIZATION_BRIEF.md — Track B, B5
  - PIPELINE_TRIAGE_2026-03-21.md (WO-640 B1 dependency)
  - WellnessFormRouter.tsx (handleSafetyCheckSave, line 677: concomitant_med_ids: [])
affects:
  - src/components/wellness-journey/WellnessFormRouter.tsx
  - src/services/clinicalLog.ts
verification: Phase 1 Safety Check saves → verify medications in DB
---

# WO-B5 — concomitant_med_ids Single Source of Truth

## Context

Per `PIPELINE_TRIAGE_2026-03-21.md`, `concomitant_med_ids` was removed from
`StructuredSafetyCheckData` as part of the Track A prerequisite fix (WO-640 B1).

The current state in `WellnessFormRouter.tsx` line 677:
```typescript
concomitant_med_ids: [],  // field removed from form; DB DEFAULT '{}' applies
```

Medication data is currently:
- Read from `localStorage` key `ppn_patient_medications_names` (display strings)
- Written by `BaselineAssessmentWizard` / `DosingSessionPhase` patient select
- The `contraindicationEngine` reads from this key and works correctly

**The gap:** the DB column `concomitant_med_ids` (FK array → `ref_medications`)
is never populated for new sessions. Historical sessions have `{}` (empty array).
This means medication data in the DB is incomplete for clinical reporting.

## Schema Status — CONFIRMED 2026-03-21

`log_phase1_safety_screen.concomitant_med_ids` **exists** as `int4[]` (integer array).

Current state: all rows show `{}` (empty array) — the column is never populated
because `WellnessFormRouter.tsx` hardcodes `concomitant_med_ids: []`.

The fix path is confirmed: medication display names must be resolved to
`ref_medications.id` integer FKs before writing to this column.

## Proposed Fix (if column exists)

In `handleSafetyCheckSave` (WellnessFormRouter.tsx), after reading `medNames`:

```typescript
// Resolve display names → ref_medications.id FKs
import { resolveMedicationIds } from '../../services/clinicalLog';
const medIds = await resolveMedicationIds(medNames); // new function needed in clinicalLog.ts
```

Then pass `medIds` to `createSafetyScreen` as `concomitant_med_ids`.

`resolveMedicationIds` would:
```typescript
// Look up each medication name in ref_medications
const { data } = await supabase
    .from('ref_medications')
    .select('id, medication_name')
    .in('medication_name', names);
return data?.map(r => r.id) ?? [];
```

## Scope Note

This WO is P1 (medium priority) — it affects data completeness for reporting
but does NOT affect the clinical session flow or safety decisions (the
contraindication engine runs from localStorage display names, not DB IDs).
It can proceed in parallel with B1-B4 once the schema question is answered.

## Verification

1. Complete Phase 1 Safety Check with known medications
2. Query `log_phase1_safety_screen` for the session row
3. Confirm `concomitant_med_ids` is populated (not `{}`)
4. Confirm contraindication engine still runs correctly after the change
