# WO-596 — Contraindication Check Not Blocking Incompatible Substances

**Status:** 03_BUILD
**Priority:** P0 — CRITICAL SAFETY
**Author:** INSPECTOR → BUILDER
**Date:** 2026-03-10

---

## Root Cause (Confirmed)

`createSafetyScreen()` in `src/services/clinicalLog.ts` (line 970) correctly accepts and writes `contraindication_verdict_id` — **but the form component calling it passes `null`.**

In `src/components/arc-of-care-forms/ongoing-safety/StructuredSafetyCheckForm.tsx` (exact lines TBD by BUILDER — search for `createSafetyScreen`), the `contraindication_verdict_id` field is either:
1. Not evaluated from the medication list before calling `createSafetyScreen()`, OR
2. Always passed as `null` / `undefined`

The DB confirms this: all `log_phase1_safety_screen` rows have `contraindication_verdict_id = NULL` and `contraindications_confirmed = []`.

Additionally, there is **zero cross-reference logic** in Phase 2 between the patient's recorded medications (`log_phase1_safety_screen.concomitant_med_ids`) and the selected substance in Phase 2 (`DosingProtocolForm.tsx`).

---

## Two Required Fixes

### Fix A — Write `contraindication_verdict_id` in Safety Screen Form

**File:** `src/components/arc-of-care-forms/ongoing-safety/StructuredSafetyCheckForm.tsx`

Search for the call to `createSafetyScreen(...)`. Before calling it, evaluate whether any selected `concomitant_med_ids` contain known contraindicated medications. Set `contraindication_verdict_id` based on the result using `ref_contraindication_verdicts`:

| Verdict | Description |
|---|---|
| Look it up from `ref_contraindication_verdicts` | Use `.select('verdict_id, verdict_label')` to find the correct IDs |

Fetch `ref_contraindication_verdicts` at form load time. Do **not** hardcode IDs.

Also ensure `contraindications_confirmed` is populated as a non-empty array when contraindication checkboxes are checked.

**Do NOT change the `createSafetyScreen()` function signature in `clinicalLog.ts`.**

### Fix B — Add Contraindication Warning in Phase 2 Substance Selection

**File:** `src/components/arc-of-care-forms/phase-2-dosing/DosingProtocolForm.tsx`

When the practitioner selects a substance (the `substance_id` dropdown), immediately after selection:

1. Fetch the patient's `concomitant_med_ids` from `log_phase1_safety_screen` for the current session:
```typescript
const { data } = await supabase
  .from('log_phase1_safety_screen')
  .select('concomitant_med_ids')
  .eq('session_id', sessionId)
  .maybeSingle();
```

2. Cross-reference: Lithium (`medication_id` — look up from `ref_medications` by name) is contraindicated with any serotonergic substance (psilocybin, MDMA, LSD). Until a proper `ref_contraindications` join table exists, use a hardcoded map:

```typescript
// TEMPORARY contraindication map — replace when ref_contraindications table is built
const CONTRAINDICATION_MAP: Record<number, number[]> = {
  // substance_id → list of contraindicated medication_ids
  // Look these up from ref_substances and ref_medications at runtime
};
```

**How to build the map:** Do a one-time query to find:
- Lithium's medication_id: `SELECT medication_id FROM ref_medications WHERE ILIKE medication_name '%lithium%'`
- Psilocybin, MDMA, LSD substance IDs: `SELECT substance_id FROM ref_substances WHERE substance_name ILIKE ANY(...)`

3. If a contraindication match is found, display a warning modal **before** the substance selection is committed to state. The warning must:
   - Name the specific medication and the specific substance
   - Require an explicit "I acknowledge this contraindication" checkbox before proceeding
   - Not silently block — practitioner must be able to override with acknowledgment

**Show the warning as a modal, not an inline toast.** Do not use `alert()`.

---

## Files to Modify

| File | Change |
|---|---|
| `src/components/arc-of-care-forms/ongoing-safety/StructuredSafetyCheckForm.tsx` | Write `contraindication_verdict_id` and `contraindications_confirmed` correctly |
| `src/components/arc-of-care-forms/phase-2-dosing/DosingProtocolForm.tsx` | Add medication cross-reference on substance selection |

## Do NOT Touch

- `src/services/clinicalLog.ts` `createSafetyScreen()` function signature
- `src/pages/ProtocolDetail.tsx`
- `src/pages/MyProtocols.tsx`
- Any RLS policies or DB schema (no migrations needed for this fix)

---

## Acceptance Criteria

- [ ] After Phase 1 Safety Screen is saved, `log_phase1_safety_screen.contraindication_verdict_id` is NOT NULL
- [ ] After Phase 1 Safety Screen is saved, `log_phase1_safety_screen.contraindications_confirmed` reflects actual checkbox state
- [ ] Selecting Psilocybin (or any serotonergic substance) when Lithium is in `concomitant_med_ids` triggers a visible warning modal before committing the selection
- [ ] Warning modal names the specific drug conflict
- [ ] Practitioner can override with explicit acknowledgment checkbox
- [ ] No changes to DB schema, RLS, or any file not listed above
