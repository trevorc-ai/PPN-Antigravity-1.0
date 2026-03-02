---
id: WO-560
title: "New Patient Setup — Age & Weight Input Validation"
status: 03_BUILD
owner: BUILDER
created: 2026-03-01T20:12:47-08:00
failure_count: 0
priority: P2
authored_by: LEAD
source: "User notes 2026-03-01 live testing session"
---

## LEAD ARCHITECTURE

### Context

The New Patient Setup modal currently accepts any value for Age and Weight with no input validation. A practitioner could accidentally enter an invalid age (e.g., 5, 0, 999) or an impossible weight. These fields feed into clinical analytics and segment comparisons — bad input corrupts downstream data.

### Architecture Decisions

1. **Age constraint:** Integer only, range 18–120 inclusive.
   - Input type: `number`, `min={18}`, `max={120}`, `step={1}`
   - On blur / on submit: reject non-integers, reject values outside 18–120
   - Error message (inline, beneath field): `"Age must be a whole number between 18 and 120"`
   - Do not accept decimals — round or reject on blur

2. **Weight constraint:** Reasonable clinical range.
   - Unit: check current implementation — if lbs: range 66–660 lbs (30–300 kg equivalent). If kg: range 30–300 kg.
   - Input type: `number`, appropriate `min`/`max` per unit, `step={0.1}` (allow one decimal for kg)
   - Error message: `"Please enter a valid weight"` with the unit and range shown
   - Confirm which unit is in use before setting constraint — do not assume

3. **Zero PHI principle:** These are stored as numeric values against `subject_id` FK — no names involved. Validation is purely range-based.

4. **Front-end only** — no schema change required. Validation lives in the modal component. BUILDER does NOT add DB CHECK constraints here (that is a SOOP/migration scope task if required later).

5. **Submit button:** Disable the "Next" / "Save" button if either validation error is active.

### Files Likely Touched

- Patient setup modal component (find via `grep -rn "New Patient\|newPatient\|PatientSetup" src/`)

---

## Acceptance Criteria

- [ ] Age field rejects non-integer values (decimals, letters, symbols)
- [ ] Age field rejects values below 18 — shows inline error: `"Age must be between 18 and 120"`
- [ ] Age field rejects values above 120 — shows same inline error
- [ ] Weight field rejects values below clinical minimum (confirm unit: lbs or kg)
- [ ] Weight field rejects values above clinical maximum
- [ ] Weight field shows inline error when invalid
- [ ] "Next" / "Save" button is disabled while either field has an active validation error
- [ ] Valid inputs (e.g., age 35, weight 165 lbs) submit without error
- [ ] No regressions in the rest of the new patient setup modal flow
- [ ] No schema changes — front-end validation only

---

## BUILDER IMPLEMENTATION COMPLETE

*(BUILDER to fill in this section when done)*

---

## INSPECTOR QA

*(To be completed in 04_QA after BUILDER handoff)*
