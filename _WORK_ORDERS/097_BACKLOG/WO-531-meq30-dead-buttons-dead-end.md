---
id: WO-531
title: MEQ-30 — Previous & Complete Assessment Buttons Dead (DEAD END)
owner: LEAD
status: 01_TRIAGE
filed_by: INSPECTOR
date: 2026-03-03
priority: P0
caution: DEAD END — practitioner cannot exit MEQ-30 form without scrolling to use X button
files:
  - src/components/arc-of-care-forms/phase-1-preparation/MEQ30QuestionnaireForm.tsx
---

## INSPECTOR Audit Finding

> **Work Order:** WO-531 — MEQ-30: Previous & Complete Assessment Buttons Dead
> **Filed by:** INSPECTOR (sourced from live QA session, 2026-03-03)
> **Priority:** P0 — active dead end in post-session workflow

---

### Problem Statement

During post-session Phase 2 closeout, when the practitioner opens the MEQ-30 questionnaire:

1. **"Previous" button** — does nothing on click. No navigation occurs.
2. **"Complete Assessment" button** — does nothing on click. No navigation occurs, form is not submitted.

Result: the practitioner is **trapped** in the MEQ-30 form with no functional exit path. The only escape is scrolling back to the top and using the **X** button, which is not discoverable. This is an active dead end in the clinical workflow.

---

### Additional Findings (same QA pass)

- When navigating with Tab + number keypad, auto-selection of answers works, but **the screen does not scroll** to follow the selected question. The active question goes off-screen.
- The **scrollbar is too bright** and visually interferes with the form UI/UX.

> These secondary items are in scope for the same fix pass if they do not add risk. Otherwise file separately.

---

### Root Cause (Suspected)

`MEQ30QuestionnaireForm.tsx` likely has `onComplete` / `onBack` props that are either:
- Not wired (passed as `undefined`) from `WellnessFormRouter.tsx`, or
- Wired but their handlers have no effect due to a missing state transition in the parent.

`WellnessFormRouter.tsx` renders: `<MEQ30QuestionnaireForm onSave={handleMEQ30Save} onComplete={onComplete} onBack={onClose ?? onComplete} onExit={onExit ?? onClose ?? onComplete} />`

BUILDER must confirm `onComplete` and `onBack` are correctly wired to the form's button click handlers inside `MEQ30QuestionnaireForm`.

---

### Success Metrics

1. Clicking "Complete Assessment" submits the form and closes the panel — confirmed by INSPECTOR browser test.
2. Clicking "Previous" navigates back to the prior form step — confirmed by INSPECTOR browser test.
3. Tab + number keypad auto-selection causes the viewport to scroll to the active question — confirmed by INSPECTOR browser test.

---

### Constraints

- Surgical only — touch only the button wiring in `MEQ30QuestionnaireForm.tsx`
- No changes to `WellnessFormRouter.tsx` unless INSPECTOR confirms the wiring is broken there
- No schema changes
