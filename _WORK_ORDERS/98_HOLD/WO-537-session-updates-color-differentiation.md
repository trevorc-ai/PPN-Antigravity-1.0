---
id: WO-537
title: Session Updates Container — Color Differentiation Between Event Types
owner: LEAD
status: 98_HOLD
filed_by: PRODDY
date: 2026-03-03
priority: P3
files:
  - src/components/wellness-journey/DosingSessionPhase.tsx
---

## PRODDY PRD

> **Work Order:** WO-537 — Session Updates: Event Type Color Differentiation
> **Filed by:** PRODDY (sourced from live QA session observation, 2026-03-03)
> **Priority:** P3 — UX polish, next sprint

---

### Problem Statement

The "Session Updates" container in the Phase 2 live session view renders all entries with identical visual styling regardless of event type. When multiple update types are logged (vitals only, affect/observations, notes), the practitioner cannot quickly distinguish between them at a glance.

As noted in QA: *"lack of color differentiation means it is not easy to make a distinction between event types."*

The Live Session Timeline above it (fixed by BUG-529-02) uses colored `[TYPE]` badges effectively. The Session Updates section needs a similar visual hierarchy.

---

### Target User + Job-To-Be-Done

A practitioner logging multiple session updates during a live dosing session needs to distinguish vitals-only entries from affect/observation entries from note-only entries at a glance, without reading each entry in full.

---

### Success Metrics

1. Each Session Update entry displays a color-coded left border or badge indicating its primary log type (vitals / observations / note) — confirmed by INSPECTOR visual inspection.
2. The update does not break the chip layout (HR · BP values remain readable) — confirmed by INSPECTOR.

---

### Constraints

- Surgical CSS/class changes only inside the Session Updates rendering block in `DosingSessionPhase.tsx`
- No changes to data model or localStorage format
- Must pass FREEZE check (DosingSessionPhase.tsx was unfrozen for BUG-529-06; re-check freeze status before building)
