---
id: WO-538
title: MEQ-30 — Keyboard Scroll & Scrollbar UX Issues
owner: LEAD
status: 03_BUILD
filed_by: PRODDY
date: 2026-03-03
priority: P3
files:
  - src/components/arc-of-care-forms/phase-1-preparation/MEQ30QuestionnaireForm.tsx
depends_on: WO-531
---

## PRODDY PRD

> **Work Order:** WO-538 — MEQ-30: Keyboard Scroll & Scrollbar UX
> **Filed by:** PRODDY (sourced from live QA session observation, 2026-03-03)
> **Priority:** P3 — UX polish
> **Note:** Depends on WO-531 (dead buttons). Apply after WO-531 ships so both touch the same file.

---

### Problem Statement

Two UX issues observed during MEQ-30 completion via keyboard:

1. **Keyboard auto-select scroll:** When navigating MEQ-30 with Tab + number keypad, the auto-selection of answer options advances correctly, but the **viewport does not scroll** to keep the active question visible. The practitioner must manually scroll to follow their position in the form.

2. **Scrollbar brightness:** The form's scrollbar is visually too bright and interferes with the dark-mode UI/UX aesthetic.

---

### Success Metrics

1. When a question's answer is auto-selected via keyboard, the question scrolls into view within the visible area — confirmed by INSPECTOR keyboard navigation test.
2. The scrollbar style is consistent with the PPN dark-mode palette (subdued, non-distracting) — confirmed by INSPECTOR visual inspection.

---

### Constraints

- Surgical only — touch only scroll behavior and scrollbar CSS in MEQ-30 component
- No changes to question content, scoring logic, or form data model
- Must be applied after WO-531 so file touches don't conflict
