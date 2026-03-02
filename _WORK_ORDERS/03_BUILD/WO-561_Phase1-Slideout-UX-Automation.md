---
id: WO-561
title: "Phase 1 Mental Health Screening — Auto-Open Dropdowns on Toggle"
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

The Phase 1 Mental Health Screening slide-out has three toggle+dropdown interaction patterns that each require 2–3 extra clicks to reach the dropdown after toggling on. The user has identified a UX optimization: **when a toggle is enabled, automatically open the most relevant dropdown** without requiring a separate click. This saves 3 clicks per interaction and makes the form significantly faster to complete in a clinical setting.

### Architecture Decisions

Three specific auto-open behaviors to implement:

**1. Prior Adverse Events toggle → auto-open event type dropdown**
- When the "Prior Adverse Events" toggle is switched ON, the primary clinical observation dropdown (or event type dropdown) should automatically open/expand
- When the toggle is switched OFF, the dropdown closes and clears its selection

**2. Primary Clinical Observation selected → auto-open Severity dropdown**
- When the practitioner selects a value from the primary clinical observation dropdown, that dropdown closes AND the severity dropdown immediately opens
- This chains the two most common sequential selections into a smooth single-flow interaction
- Severity dropdown should close naturally when a severity value is selected

**3. Concomitant Medications toggle → auto-open medication list**
- When the "Concomitant Medications" toggle is switched ON, the medication list/search dropdown automatically opens
- When toggle is switched OFF, medication list closes and clears

### Implementation

- These are purely `useEffect` or `onChange` handler changes — when the trigger condition is met, call the dropdown's `open` state setter or programmatically focus + open the next control
- BUILDER must identify the exact component structure (controlled dropdowns, comboboxes, or selects) to implement the auto-open correctly
- No new UI elements — existing dropdowns, existing toggles, just wired more intelligently
- Auto-open must not fire on initial page load — only on user-initiated toggle change

### Files Likely Touched

- Phase 1 Mental Health Screening slide-out component (find via `grep -rn "MentalHealth\|mentalHealth\|adverse.*event\|AdverseEvent\|concomitant" src/components/`)

---

## Acceptance Criteria

- [ ] Toggling "Prior Adverse Events" ON automatically opens the primary clinical observation dropdown (no extra click needed)
- [ ] Toggling "Prior Adverse Events" OFF closes the dropdown and clears its value
- [ ] Selecting a value in the primary clinical observation dropdown automatically closes it and opens the severity dropdown
- [ ] Selecting a severity value closes the severity dropdown naturally
- [ ] Toggling "Concomitant Medications" ON automatically opens / expands the medication list
- [ ] Toggling "Concomitant Medications" OFF closes and clears the medication list
- [ ] Auto-open does NOT fire on initial form load — only on user toggle interaction
- [ ] All existing save/submit behavior is unaffected
- [ ] No regressions in Mental Health Screening form submission
- [ ] Keyboard navigation still works correctly through all dropdowns

---

## BUILDER IMPLEMENTATION COMPLETE

*(BUILDER to fill in this section when done)*

---

## INSPECTOR QA

*(To be completed in 04_QA after BUILDER handoff)*
