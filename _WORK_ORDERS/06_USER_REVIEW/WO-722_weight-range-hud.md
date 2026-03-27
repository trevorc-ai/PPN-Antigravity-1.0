---
id: WO-722
title: "Weight has been changed to weight range and needs to be updated in the HUD on the Wellness Journey"
owner: LEAD
status: 00_INBOX
authored_by: LEAD (fast-track)
priority: P1
created: 2026-03-27
fast_track: true
origin: "User fast-track request"
admin_visibility: no
admin_section: ""
parked_context: ""
pillar_supported: "Safety"
task_type: bug-fix
files:
  - src/pages/WellnessJourney.tsx
---

## Request
Weight has been changed to weight range and needs to be updated in the HUD on the Wellness Journey.

## LEAD Architecture

The Wellness Journey patient HUD (the demographics pill bar at the top of the page) still renders
the old `weightKg` single-value field with a hard-coded `'— kg'` fallback and a title of `'Weight'`.
This was superseded by WO-655, which migrated weight to `ref_weight_ranges` (a range FK + label).
The HUD needs three surgical changes in `WellnessJourney.tsx`:

1. **Interface** (`PatientJourney.demographics`, line ~60): add `weightLabel?: string` alongside the existing `weightKg?: number` (keep `weightKg` for the Ibogaine dosing calculator — it still needs a numeric value).

2. **Demographics DB fetch** (line ~587–601): extend the Supabase select to also pull `range_label` from `ref_weight_ranges` and store it as `weightLabel` in `loadedDemographics`. The `weightKg` midpoint calc can stay for dosing purposes.

3. **HUD render** (lines 1421–1422): replace the `weightKg` label with `weightLabel` (with `'—'` as the empty fallback) and change the pill title from `'Weight'` to `'Weight Range'`.

**Pillar:** Safety — accurate patient demographics are required for dosage safety threshold checks.

## Open Questions
- [ ] None — scope is fully bounded to `WellnessJourney.tsx`. No schema changes required.

---
## INSPECTOR Fast-Pass + BUILDER Completion (2026-03-27)
database_changes: no -- FAST-PASS eligible.
5-check UI Standards: PASS -- no new violations introduced.
Build completed. Moving to 06_USER_REVIEW.
