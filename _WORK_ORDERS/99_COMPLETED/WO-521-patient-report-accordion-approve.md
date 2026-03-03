---
id: WO-521
title: PatientReport Accordion — INSPECTOR Formal Approval (post WO-520 remediation)
owner: LEAD
status: 01_TRIAGE
filed_by: INSPECTOR
date: 2026-03-03
priority: P1
file: src/pages/PatientReport.tsx
route: /patient-report
depends_on: WO-520
---

==== INSPECTOR ====

## INSPECTOR QA Sign-Off Ticket

> **Work Order:** WO-521 — PatientReport Accordion Change: Formal Approval Gate  
> **Filed by:** INSPECTOR  
> **Date:** 2026-03-03  
> **Depends on:** WO-520 (must be completed first)  
> **Status:** Blocked on WO-520  

---

### Context

The `Accordion` component was added to `PatientReport.tsx` without prior user approval (see PRODDY audit). 11 of 13 QA checks passed. Two violations were filed under WO-520. Once WO-520 is completed and verified, this ticket provides the final formal INSPECTOR sign-off checklist to fully approve the accordion change for merge/commit.

---

### Final QA Checklist (run after WO-520 is deployed)

**Structural:**
- [ ] `type="button"` present on all accordion `<button>` elements
- [ ] `+` / `−` glyph visible on each accordion in both collapsed and expanded states
- [ ] `aria-expanded` updates correctly on toggle
- [ ] No new imports or external dependencies added to `PatientReport.tsx`

**Functional — preview mode (`/patient-report?session=preview`):**
- [ ] Zone 1 "About Your Baseline" collapsed on load → expands to show reflection text + Rumi quote
- [ ] Zone 2 feeling pills visible without interaction; "What These Feelings Mean" collapsed on load
- [ ] Zone 3 sliders and check-in button fully unaffected
- [ ] Zone 4 absent (correct — conditional on session data)
- [ ] Zone 5 PEMS grid visible; "Integration Journal Prompts" and "Your Integration Roadmap" collapsed on load

**Functional — real session (`/patient-report?session=<valid-uuid>`):**
- [ ] PHQ-9 stat block renders outside accordion when `phq9Change` is present
- [ ] Zone 4 renders when session has `red_flags` or `safety_note`; 988 crisis card renders ABOVE accordion
- [ ] Zone 4 practitioner accordion opens by default (`defaultOpen={true}`)
- [ ] Integration attendance renders in Zone 5 when `integrationSessionsAttended > 0`

**Regression:**
- [ ] Print layout (`@media print`) — no accordion interference
- [ ] Mobile viewport (375px) — all accordion buttons full-width, minimum 44px tap target
- [ ] TypeScript: zero errors on `PatientReport.tsx`

---

### INSPECTOR Sign-Off

Upon all boxes checked: **change is approved for commit** and WO-521 moves to `99_COMPLETED`.

==== INSPECTOR ====
