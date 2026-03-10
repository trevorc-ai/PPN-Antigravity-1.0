---
id: WO-582
title: Post-Session Fixes Bundle — Assessment Scores, PCL-5 Dropdown, Tab Order
owner: LEAD
status: 00_INBOX
priority: P1
created: 2026-03-09
source: Jason-Trevor Meeting 2026-03-09
---

## PRODDY PRD

> **Work Order:** WO-582 — Post-Session Fixes Bundle  
> **Authored by:** INSPECTOR (expedited from meeting action items)  
> **Date:** 2026-03-09  
> **Status:** Draft → Pending LEAD review  

---

### 1. Problem Statement

Three related defects cluster around the post-session assessment flow:  
(1) The "Assessment Complete" page displays raw score numbers which may negatively impact patient morale if a patient sees them.  
(2) The PCL-5 total score input uses a 0–80 stepper (number input) while all comparable assessment fields use dropdowns — creating an inconsistent UX.  
(3) The Quick Experience Check has broken tab-order on number inputs and a non-focusable "Complete Assessment" button, making keyboard-only navigation impossible.

---

### 2. Target User + Job-To-Be-Done

The practitioner needs to complete post-session assessments quickly and accurately using keyboard navigation, and the patient-visible "Assessment Complete" screen needs to present only affirming content so patients are not discouraged by raw clinical scores.

---

### 3. Success Metrics

1. The "Assessment Complete" page shows zero numerical score values — only a completion confirmation message and practitioner-only score appears in the admin view.
2. The PCL-5 input renders as a `<select>` dropdown with options 0–80 in 1-point increments, consistent with other assessment fields.
3. Tab order through the Quick Experience Check is sequential (field 1 → 2 → … → Complete button) with no skipped or out-of-order focus stops — verified by keyboard-only test.

---

### 4. Feature Scope

#### ✅ In Scope

- **Score removal:** Remove score display from the patient-facing "Assessment Complete" view in `WellnessFormRouter.tsx`. Scores remain available in the practitioner clinical record view only.
- **PCL-5 input change:** Replace the `type="number"` stepper for PCL-5 total score with a `<select>` dropdown in the relevant form component.
- **Tab order fix:** Audit and correct `tabIndex` values on all Quick Experience Check inputs and the "Complete Assessment" button. The button must be keyboard-focusable (`tabIndex` ≥ 0, no `tabIndex={-1}`).
- **"Previous" button:** Ensure the "Previous" navigation button in multi-step assessment forms is keyboard accessible.

#### ❌ Out of Scope

- Redesigning the clinical scoring logic or thresholds
- Adding new assessment instruments
- Score display in practitioner-facing views (keep as-is)

---

### 5. Priority Tier

**[x] P1** — High value, ship this sprint  

**Reason:** Score visibility on the "Assessment Complete" page is a patient-morale risk that can be flagged by clinical advisors. Tab order is a WCAG 2.1 Level A accessibility requirement (Success Criterion 2.4.3).

---

### 6. Open Questions for LEAD

1. Should the practitioner see scores in the same session view, or only in the session report PDF? This determines where the score display is conditionally gated.
2. Is PCL-5 always an integer 0–80, or does the clinical team need fractional input?

---

### PRODDY Sign-Off Checklist

- [x] Problem Statement is ≤100 words and contains no solution ideas
- [x] Job-To-Be-Done is a single sentence in the correct format
- [x] All 3 success metrics contain a measurable number or specific observable event
- [x] Out of Scope is populated
- [x] Priority tier has a named reason
- [x] Open Questions list is ≤5 items
- [x] No code, SQL, or schema written anywhere in this document
