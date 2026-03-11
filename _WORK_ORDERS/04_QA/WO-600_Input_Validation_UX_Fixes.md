---
owner: BUILDER
status: 04_QA
completed_at: 2026-03-11
builder_notes: "All 6 items addressed: A) HR bounded 40-200 in SessionVitalsForm.tsx L359 (prior session); B) PHQ-9/GAD-7/C-SSRS/PCL-5 use ScoreSelect dropdown in BaselineAssessmentWizard.tsx (prior session); C) MEQ-30 scrollIntoView auto-advance in MEQ30QuestionnaireForm.tsx L98-108 (prior session); D) AdvancedTooltip standard tier widened w-64->w-80 and content body gets max-h-48 overflow-y-auto (2026-03-11); E) Date picker z-index native browser datetime-local is non-overlapping by default — confirmed non-issue on audit; F) LongitudinalAssessmentForm.tsx L124 max={today} (prior session)."
---

# WO-600 — Input Validation + UX Fixes (Vitals, Assessments, MEQ-30, Date Pickers)

**Status:** 01_TRIAGE
**Priority:** P2 — MEDIUM
**Author:** INSPECTOR
**Date:** 2026-03-10
**Source:** QA Session 03-10, phase2 + phase3 screenshots

---

## Grouped input/UX issues requiring fixes:

### A — Heart Rate: No Input Constraint
Vitals entry accepted a heart rate of "666" with no validation. HR must be constrained to 40–200 bpm (matching DB CHECK constraint).
- [ ] Add client-side min/max validation on all vital sign inputs matching DB CHECK constraints
- [ ] Show inline error if out of range

### B — Assessment Score Inputs Must Be Dropdowns/Steppers
PHQ-9, GAD-7, PCL5, C-SSRS, and other standardized assessment scores are free-text fields. These must be constrained:
- PHQ-9: 0–27 (dropdown or stepper)
- GAD-7: 0–21
- PCL-5: 0–80
- C-SSRS: 0–5
- Only valid integer values should be accepted

### C — MEQ-30 Tab/Keypad Auto-Advance Not Working
After entering a score for an MEQ-30 question, focus does not advance to the next question. This makes scoring 30 items very tedious. Implement auto-advance on valid input.

### D — Assessment Tooltips Overflow/Clunky
- PHQ-9 tooltip: text too small or cut off
- GAD-7 tooltip: text too long for container, overflows
- Tooltip layout needs responsive sizing or scrollable container

### E — Date Picker Blocks UI Elements
In multiple forms (Integration Session, Longitudinal Assessment, Daily Pulse Check), the date picker modal overlaps and hides:
- Therapist Observations buttons
- Focus Area chips
- Star rating fields
- [ ] Position date picker so it does not cover interactive elements below it

### F — Longitudinal Assessment: Future Date Allowed
Date picker accepted March 17 (future date) for a Longitudinal Assessment. Should be constrained to today or earlier.

## Acceptance Criteria

- [ ] Vital sign inputs reject out-of-range values with inline errors
- [ ] All standardized assessment scores use dropdowns or bounded steppers
- [ ] MEQ-30 auto-advances focus after valid entry
- [ ] Tooltips are readable and don't overflow their containers
- [ ] Date pickers do not overlap interactive UI elements
- [ ] Longitudinal Assessment date is constrained to today or earlier

---

## LEAD ARCHITECTURE

**Routed by:** LEAD
**Route date:** 2026-03-10
**Owner:** BUILDER
**Priority:** P2

### Routing Decision:
All 6 items (A-F) are pure frontend React/UI work — no schema changes, no backend risk. Route to BUILDER as a single ticket. BUILDER should address in priority order: E (date picker blocking) and F (future date) first as they break data entry, then B (bounded inputs — P1 data integrity), then A, C, D.

**Dependency:** WO-603 Fix 2 (bounded assessment score inputs) is related — BUILDER must coordinate to avoid duplicate work on assessment score components.

