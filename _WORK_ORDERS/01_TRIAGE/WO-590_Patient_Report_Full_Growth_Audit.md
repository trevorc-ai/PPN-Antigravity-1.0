---
id: WO-590
title: Full Growth Workflow Audit - /patient-report Page
owner: INSPECTOR
status: 01_TRIAGE
authored_by: PRODDY
priority: P1
created: 2026-03-09
type: GROWTH_AUDIT
workflows:
  - marketer-protocol
  - brandy-copywriter
  - seo-aio-specialist
  - ui-ux-auditor
  - proddy-review
  - marketing-qa-checklist
target_file: src/pages/PatientReport.tsx
target_route: /patient-report
---

## PRODDY PRD

> **Work Order:** WO-590 - Full Growth Workflow Audit - /patient-report Page
> **Authored by:** PRODDY
> **Date:** 2026-03-09
> **Status:** Draft - Pending LEAD review

---

### 1. Problem Statement
The `/patient-report` page is a patient-facing output and a potential conversion and trust-building surface. It has never been run through any of the six growth-order workflows. As a result, its copy, brand voice, SEO/AIO structure, accessibility, UX, and performance characteristics are untested against PPN standards. This creates risk of brand inconsistency, discoverability failure, and accessibility violations on a page patients will actually see.

---

### 2. Target User + Job-To-Be-Done
The INSPECTOR agent (running as Marketing QA lead) needs to run all six growth workflows against the `/patient-report` page so that Trevor receives a single consolidated audit report with prioritized, actionable fixes before the page is shown to any external user.

---

### 3. Success Metrics
1. All six workflow audits (marketer-protocol, brandy-copywriter, seo-aio-specialist, ui-ux-auditor, proddy-review, marketing-qa-checklist) produce a written Pass/Needs Refinement/Critical Failure status for the `/patient-report` page in a single consolidated report.
2. Any Critical Failure findings are each accompanied by an exact, actionable fix (specific line number or copy replacement) - not a general recommendation.
3. The consolidated report is delivered within one build session with zero follow-up clarification requests needed from Trevor.

---

### 4. Feature Scope

#### In Scope:
- Run all 6 growth-order workflows/skills against the `/patient-report` page and its source file (`src/pages/PatientReport.tsx` or equivalent):
  1. **proddy-review**: Does the page serve a clear product purpose aligned with MASTER_PLAN?
  2. **marketer-protocol**: Does the copy meet brand voice, empathy, 9th-grade rule, and zero-PHI standards?
  3. **brandy-copywriter**: Is the tone Clinical Sci-Fi? Are paragraphs mobile-optimized (max 3 sentences)?
  4. **seo-aio-specialist**: JSON-LD schema present? Correct H1->H2->H3 hierarchy? Entity clarity for AI search?
  5. **ui-ux-auditor (FLO)**: WCAG 2.1 AA compliance? 14px minimum text? Color-blindness safe? Glass Panel standard?
  6. **marketing-qa-checklist**: Title tag, meta description, CRO (CTA above fold), Lighthouse >=90, Axe-Core 0 critical, ASSET_LEDGER.md current?
- Deliver one consolidated audit report (not six separate documents) with findings ranked: Critical Failure > Needs Refinement > Pass
- Each finding includes the exact source location (file + line or UI element)

#### Out of Scope:
- Implementing any of the fixes identified (that is a separate BUILDER ticket)
- Auditing any other page or route beyond `/patient-report`
- Database or auth changes of any kind
- Creating a new page - this is an audit of the existing page only

---

### 5. Priority Tier

**[x] P1** - High value, ship this sprint

**Reason:** The `/patient-report` page is patient-facing and is currently visible at `http://localhost:3000/#/patient-report`. It surfaces PPN data to external users with zero brand, SEO, or accessibility vetting. This needs to be audited before any VIP or beta user accesses it. Running all 6 workflows in one pass also validates the full workflow chain described in WO-589.

---

### 6. Open Questions for LEAD
1. Is the source file for `/patient-report` at `src/pages/PatientReport.tsx`, or is it composed of multiple components that must each be audited separately?
2. Should the consolidated audit report be written to `_GROWTH_ORDERS/` or `_WORK_ORDERS/04_QA/` given this is a hybrid build+growth ticket?
3. If FLO's visual audit requires a live browser session, should FLO use the localhost:3000 instance currently visible in the browser, or wait for a production build?

---

### PRODDY Sign-Off Checklist

- [x] Problem Statement is <=100 words and contains no solution ideas
- [x] Job-To-Be-Done is a single sentence in the correct format
- [x] All 3 success metrics contain a measurable number or specific observable event
- [x] Out of Scope is populated (not empty)
- [x] Priority tier has a named reason
- [x] Open Questions list is <=5 items
- [x] Total PRD word count is <=600 words
- [x] No code, SQL, or schema written anywhere in this document
- [x] Frontmatter updated: `owner: LEAD`, `status: 00_INBOX`
- [x] Response wrapped in `==== PRODDY ====`

✅ WO-590 placed in 00_INBOX. LEAD action needed: confirm source file path and audit report destination, then route to INSPECTOR.

---

## LEAD ARCHITECTURE

**Routed by:** LEAD
**Route date:** 2026-03-09
**Owner:** INSPECTOR
**Route:** 01_TRIAGE -> 04_QA (INSPECTOR runs audit, no BUILDER step)

### Open Question Resolutions:
1. **Source file:** Confirmed — `src/pages/PatientReport.tsx` is a single file (verified by filesystem scan). INSPECTOR audits this file plus the live `/patient-report` route via browser.
2. **Audit report destination:** Write consolidated report to `_WORK_ORDERS/04_QA/WO-590_Patient_Report_Audit_Report.md`. This is a QA output, not a growth asset. Any follow-on fixes generate a new BUILDER ticket from 01_TRIAGE.
3. **FLO browser session:** Use the live `localhost:3000/#/patient-report` instance currently visible in the browser. Do NOT wait for production build.

### INSPECTOR Execution Order:
1. Read `src/pages/PatientReport.tsx` in full
2. Open `localhost:3000/#/patient-report` via browser tool
3. Run all 6 workflows serially, collect findings
4. Write ONE consolidated report to `_WORK_ORDERS/04_QA/WO-590_Patient_Report_Audit_Report.md`
5. Any fixes needed -> create new WO-591+ BUILDER ticket from 01_TRIAGE
