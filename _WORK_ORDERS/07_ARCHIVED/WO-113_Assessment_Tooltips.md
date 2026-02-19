---
work_order_id: WO-113
title: Assessment Tooltips & Citations
type: FEATURE
category: Frontend / UX
priority: P3 (Medium)
status: 05_USER_REVIEW
created: 2026-02-18T08:30:00-08:00
requested_by: USER (Visual Audit)
owner: USER
failure_count: 0
triage_status: APPROVED
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

---

## ✅ [STATUS: PASS] - INSPECTOR APPROVED

**Approved by:** INSPECTOR  
**Date:** 2026-02-18T22:36:00-08:00  
**failure_count:** 0

**Verification Evidence:**
- `grep -n "tooltip\|citation" src/components/arc-of-care/AssessmentForm.tsx` → `tooltip?: string` (line 22), `citation?: string` (line 23), rendered at lines 213-228 ✅
- `grep -rn "tooltip\|citation" src/config/meq30-short.config.ts` → tooltip + citation present on all 5 questions ✅
- `grep -rn "tooltip\|citation" src/config/edi-brief.config.ts` → tooltip + citation present ✅
- `grep -rn "tooltip\|citation" src/config/ceq-brief.config.ts` → tooltip + citation (Barrett et al.) present ✅
- Font audit: No `text-[10px]`/`text-[11px]` violations ✅
- PHI check: No free-text patient data ✅

**Audit Results:**
- Tooltips implemented and wired to `AdvancedTooltip` component ✅
- Citations rendered as `Ref: citation` on each question ✅
- Provider context: citations visible inline on assessment ✅
- All AC items met ✅

**Moved to `_WORK_ORDERS/05_USER_REVIEW/`**
