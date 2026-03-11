---
id: WO-532
title: Post-Session Assessments — Skip & Previous Navigation Buttons Dead
owner: LEAD
status: 99_COMPLETED
filed_by: INSPECTOR
date: 2026-03-03
priority: P1
files:
  - src/components/wellness-journey/DosingSessionPhase.tsx
  - src/pages/AdaptiveAssessmentPage.tsx
---

## INSPECTOR Audit Finding

> **Work Order:** WO-532 — Post-Session Assessment Navigation: Skip & Previous Buttons Dead
> **Filed by:** INSPECTOR (sourced from live QA session, 2026-03-03)
> **Priority:** P1

---

### Problem Statement

After clicking "End Session" and entering the Phase 2 post-session closeout view, two navigation elements do not function:

1. **"Skip this assessment" link** — does nothing on click. The post-session assessment modal remains open with no way to dismiss without completing.
2. **"Previous" button** — does nothing on click. Cannot navigate back within the assessment flow.

Additionally: **post-session assessments appear to be mandatory with no option to skip.** The user flagged that this should be at the practitioner's discretion — the skip mechanism should be functional, not a dead link.

---

### Success Metrics

1. Clicking "Skip this assessment" closes the assessment modal and returns to the Phase 2 closeout view — confirmed by INSPECTOR browser test.
2. Clicking "Previous" navigates back one step within the assessment — confirmed by INSPECTOR browser test.
3. Practitioner can complete Phase 2 closeout without completing post-session assessments — confirmed by INSPECTOR browser test.

---

### Open Questions for LEAD

1. Should "Skip" be labeled differently to be clinically clear that skipping means the assessment will not be recorded? (e.g., "Skip for now")
2. Should skipping be logged as an event in `log_session_timeline_events` for audit trail purposes?

---

### Constraints

- Surgical only — touch only the button/link wiring
- No schema changes
- Do not change assessment content or scoring logic

---
## INSPECTOR QA Sign-off
**Date:** 2026-03-11
**Verdict:** APPROVED. Code fixes verified on main branch.
