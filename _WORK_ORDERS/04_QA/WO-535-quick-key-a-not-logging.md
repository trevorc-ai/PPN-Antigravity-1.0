---
id: WO-535
title: Quick Key A — Adverse Event Shortcut Not Logging to Graph or Ledger
owner: LEAD
status: 03_BUILD
filed_by: INSPECTOR
date: 2026-03-03
priority: P2
files:
  - src/components/wellness-journey/DosingSessionPhase.tsx
---

## INSPECTOR Audit Finding

> **Work Order:** WO-535 — Quick Key A: Adverse Event Shortcut Broken
> **Filed by:** INSPECTOR (sourced from live QA session, 2026-03-03)
> **Priority:** P2

---

### Problem Statement

The "A" keyboard shortcut in the Phase 2 live session opens the Safety & Adverse Event slide-out form. However, **it logs to neither the graph nor the ledger** — whereas the "Adverse Event" button (same form, mouse click) logs to the graph but not the ledger (the ledger part now fixed by BUG-529-03).

The discrepancy suggests Quick Key A and the Adverse Event button follow different code paths, and Quick Key A's path is missing the graph event pin that the button path produces.

---

### Root Cause (Suspected)

In `DosingSessionPhase.tsx`, the keyboard handler for `'a'` calls `onOpenForm('safety-and-adverse-event')` directly. This opens the slide-out, but may not emit a `ppn:session-event` CustomEvent to stamp the graph pin at key-press time — unlike the button path which may dispatch this event on click.

BUILDER must trace both paths (button click → form open vs. keyboard shortcut → form open) and confirm where the event pin is emitted differently.

---

### Success Metrics

1. Pressing "A" during a live session and submitting the adverse event form produces both a graph event pin and a ledger entry in `LiveSessionTimeline` — confirmed by INSPECTOR browser test.
2. Behavior is identical to the mouse-click button path.

---

### Constraints

- Surgical only — touch only the keyboard handler in `DosingSessionPhase.tsx`
- Do not modify the form or slide-out rendering
- No schema changes
