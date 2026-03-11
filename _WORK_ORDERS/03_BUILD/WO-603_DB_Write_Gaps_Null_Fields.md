# WO-603 — DB Write Gaps: Null Fields After Full Session

**Status:** 03_BUILD
**Priority:** P1 — HIGH (data integrity — root cause of WO-598 NaN analytics)
**Author:** INSPECTOR → BUILDER
**Date:** 2026-03-10

---

## Overview

After two complete Wellness Journey sessions, multiple fields are NULL in the DB that should have been written. Fix these in order of priority — each fix is confined to a specific service function or form component. **Do not modify DB schema or RLS policies.**

---

## Fix 1 — Safety Screen: Missing `contraindication_verdict_id` and `ekg_rhythm_id`

**Covered by WO-596.** Fix that WO first. This item is a dependency.

---

## Fix 2 — Set & Setting: `intention_theme_ids` and `mindset_type_id` Always Empty

**Root Cause:** The Set & Setting form multi-select components are likely not wiring their selection state into the payload passed to the write function.

**Where to look:**
```
src/components/arc-of-care-forms/phase-1-preparation/
```
Search for the component that handles `intention_theme_ids` and `mindset_type_id` — find the `onSubmit` or save handler.

**Find the call to the write function** (search for `log_phase1_set_and_setting` in `src/services/clinicalLog.ts`). Confirm whether `intention_theme_ids` and `mindset_type_id` are included in the payload.

**Fix:** Ensure:
- `intention_theme_ids` is passed as an array of selected IDs (integers), not an empty array `[]`
- `mindset_type_id` is passed as the selected ID (integer) or `null` if not selected — never `undefined`

**Do NOT change the DB write function signature.** Only fix the form's payload construction.

---

## Fix 3 — Patient Profile: Duplicate Rows + `weight_range_id` NULL

**File:** `src/services/clinicalLog.ts`

Search for the function that writes to `log_patient_profiles` (search: `log_patient_profiles`). It uses `.insert()`. This creates duplicate rows if the practitioner navigates back and re-submits.

**Fix:** Change `.insert()` to `.upsert()` with `onConflict: 'patient_uuid'`:

```typescript
// CURRENT (approximate):
.from('log_patient_profiles').insert([payload])

// REPLACE WITH:
.from('log_patient_profiles')
.upsert([payload], { onConflict: 'patient_uuid', ignoreDuplicates: false })
```

**Also fix `weight_range_id`:** The function likely maps a weight label to a range ID via `ref_weight_ranges`. Confirm the mapping is working by checking `ref_weight_ranges` column names (`id`, `range_label`). The lookup in `MyProtocols.tsx` line 111 uses `.select('id, range_label')` — verify the write function uses the same column names.

---

## Fix 4 — Patient Indications: Duplicate Rows + `created_by` NULL

**File:** `src/services/clinicalLog.ts`

Search for the function that writes to `log_patient_indications`. Same issue as Fix 3 — uses `.insert()` instead of `.upsert()`.

**Fix A:** Change to `.upsert()` with `onConflict: 'patient_uuid,indication_id'`.

**Fix B:** Ensure `created_by` is set to `user.id` from `supabase.auth.getUser()`. The function likely fetches the user — verify it passes `user.id` as `created_by` (or equivalent column name — check actual column name in the table).

---

## Fix 5 — Baseline Assessments: PHQ-9, GAD-7, ACE, PCL-5 All NULL

**Root Cause:** The baseline form likely supports optional fields, but the save is only sending `expectancy_scale` and leaving the scored fields out of the payload when they're blank.

**Where to look:**
```
src/components/arc-of-care-forms/phase-1-preparation/
```
Search for the component that submits `log_baseline_assessments`. Find the `onSubmit` handler.

**Fix:** Include all assessment score fields in the insert payload even when `null`:

```typescript
{
  phq9_score: formValues.phq9 ?? null,
  gad7_score: formValues.gad7 ?? null,
  ace_score: formValues.ace ?? null,
  pcl5_score: formValues.pcl5 ?? null,
  expectancy_scale: formValues.expectancy ?? null,
  // ...all other fields
}
```

Never omit a column from the payload — always send `null` explicitly so the write is complete.

---

## Fix 6 — Session Timeline Events: `performed_by` NULL

**File:** `src/services/clinicalLog.ts`

Search for the function that writes to `log_session_timeline_events`. Confirm whether `performed_by` is included in the insert payload. If it's not being set:

```typescript
const { data: { user } } = await supabase.auth.getUser();
// Add to insert payload:
performed_by: user?.id ?? null,
```

**Do NOT change the table schema.** Only fix the payload.

---

## Fix 7 — `log_clinical_records`: `protocol_id`, `dosage_amount`, `outcome_score` NULL

These columns on the parent session record are not required to be set at session creation — they are set later via `updateDosingProtocol()` in `clinicalLog.ts`. **These NULLs are expected** for sessions where Phase 2 was not completed. No fix needed here — they will populate when the dosing form is submitted.

Exception: If `outcome_score` was submitted in Phase 3 and is still NULL, investigate the Phase 3 closeout write path separately.

---

## Do NOT Touch

- DB schema (no migrations)
- RLS policies
- `src/pages/ProtocolDetail.tsx`
- `src/pages/MyProtocols.tsx`
- `src/services/clinicalLog.ts` function signatures (only fix payload values inside them)
- Any analytics or visualization components

---

## Acceptance Criteria

- [ ] After a complete Phase 1, `log_phase1_set_and_setting.intention_theme_ids` is a non-empty array if selections were made
- [ ] After a complete Phase 1, `log_phase1_set_and_setting.mindset_type_id` is NOT NULL if selection was made
- [ ] No duplicate rows in `log_patient_profiles` for the same `patient_uuid`
- [ ] No duplicate rows in `log_patient_indications` for the same `(patient_uuid, indication_id)`
- [ ] `log_patient_profiles.weight_range_id` is NOT NULL after weight is entered
- [ ] `log_patient_indications.created_by` is NOT NULL
- [ ] `log_baseline_assessments.phq9_score` is NOT NULL after PHQ-9 is filled in
- [ ] `log_session_timeline_events.performed_by` is NOT NULL
- [ ] All fixes verified by running this query after a test session and confirming 0 nulls in the listed columns:

```sql
SELECT 'set_and_setting' AS tbl,
       COUNT(*) FILTER (WHERE intention_theme_ids = '{}') AS empty_themes,
       COUNT(*) FILTER (WHERE mindset_type_id IS NULL) AS null_mindset
FROM log_phase1_set_and_setting
UNION ALL
SELECT 'baseline', 
       COUNT(*) FILTER (WHERE phq9_score IS NULL),
       COUNT(*) FILTER (WHERE gad7_score IS NULL)
FROM log_baseline_assessments;
```

---

## LEAD ARCHITECTURE

**Routed by:** LEAD
**Route date:** 2026-03-10
**Owner:** BUILDER (Fixes 2, 3, 4, 5, 6) + SOOP (Fix 1 via WO-596 dependency)
**Priority:** P1 — Data integrity, root cause of WO-598 NaN analytics

### Routing Decision:
This ticket is correctly scoped. No schema changes — all fixes are payload/query corrections.

**BUILDER execution order:**
1. Confirm WO-596 (Fix 1: `contraindication_verdict_id`) is complete first
2. Fix 3 then Fix 4 (patient profile + indications upsert) — these eliminate duplicate rows
3. Fix 2 (set & setting theme/mindset IDs) — form payload wiring
4. Fix 5 (baseline assessment null scores)
5. Fix 6 (`performed_by` on timeline events)
6. Fix 7 is NO-OP — expected nulls, skip

**BUILDER must NOT touch:** DB schema, RLS, `src/pages/ProtocolDetail.tsx`, `src/pages/MyProtocols.tsx` (frozen), function signatures.

**After all fixes:** Run the verification SQL provided in the ticket's Acceptance Criteria section against production.

**Dependency:** WO-592 introduces `session_status` column — SOOP must apply that migration before BUILDER adds any `session_status` filters.

