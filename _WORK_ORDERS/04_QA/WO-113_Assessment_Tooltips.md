---
work_order_id: WO-113
title: Assessment Tooltips & Citations
type: FEATURE
category: Frontend / UX
priority: P3 (Medium)
status: 04_QA
created: 2026-02-18T08:30:00-08:00
requested_by: USER (Visual Audit)
owner: INSPECTOR
failure_count: 0
triage_status: PENDING
---

# Work Order: Add Tooltips & Citations to Assessment
## 📌 USER INTENT
"Also, this form needs tool tips and would be great to let the providers know that this uses MHQ scoring or whatever the source is."

## 🎯 THE GOAL
Enhance the Patient Assessment Form (`/#/assessment`) with educational tooltips and explicit citations for the psychometric scales used (e.g., MEQ-30, EDI, MHQ).

## 🛠 RELEASE CRITERIA
- [ ] **Tooltips:** Add your `AdvancedTooltip` component to each question or section header explaining *why* we ask this.
- [ ] **Citations:** Add a footer or sub-header: "Based on the [Scale Name] (Author, Year)."
- [ ] **Provider Context:** Ensure providers see this context clearly.

---
## 📝 NOTES
29. - **Location:** `src/pages/Assessment.tsx`

## BUILDER IMPLEMENTATION NOTES (2026-02-18)

### Files Modified:
- `src/config/meq30-short.config.ts`: Added tooltips/citations.
- `src/config/edi-brief.config.ts`: Added tooltips/citations.
- `src/config/ceq-brief.config.ts`: Added tooltips/citations.

### Implementation Decisions:
- Added clinical rationale tooltips and academic citations (Barrett et al., Nour et al.) to all "Quick Mode" assessments.
- `AssessmentForm.tsx` already supports these props, so no component changes were needed.

### Status: ✅ COMPLETE — Moving to 04_QA
