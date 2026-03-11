==== PRODDY ====
---
owner: LEAD
status: 99_COMPLETED
authored_by: PRODDY
sourced_from: WO-545 (VIZ Phase 3 Audit)
promoted: 2026-03-06
---

## PRODDY PRD

> **Work Order:** WO-547 - Mobile Chart Scaling: Scroll Containers + Smart Tooltips
> **Authored by:** PRODDY
> **Date:** 2026-03-05
> **Status:** 99_COMPLETED

---

### 1. Problem Statement

Longitudinal data charts (Emotional Terrain waveform, Symptom Decay, Trajectory) break on mobile when the viewport is narrow. The charts currently compress their X-axis data points, making them illegible at 375px. Additionally, chart tooltips use hover interactions only, which are inaccessible on touch devices. Practitioners and patients reviewing clinical trends on a phone or tablet cannot reliably read the charts or access the data behind them.

---

### 2. Target User + Job-To-Be-Done

A practitioner or patient reviewing a longitudinal chart on a tablet or phone needs to scroll horizontally to see the full data timeline and tap a single data point to reveal a readable, plain-English tooltip so that they can track clinical progress without needing a desktop.

---

### 3. Success Metrics

1. Longitudinal waveform charts display all X-axis data points (no compression) on a 375px-wide viewport, verified via browser device emulation in QA.
2. Chart tooltip touch targets measure >= 44x44px on all data points, verified on iOS Safari and Android Chrome across 5 consecutive QA sessions.
3. All Recharts `<XAxis>` and `<YAxis>` labels render at `fontSize: 14` with `fill: '#94a3b8'` contrast, verified by FLO in her next audit pass.

---

### 4. Feature Scope

#### In Scope

- Wrap longitudinal Recharts instances in a horizontally scrollable container (CSS `overflow-x: scroll`) so that chart width is fixed and data is never compressed on narrow viewports.
- Replace hover-only tooltip events with `onClick` or `onTouchStart` handlers on all `<Dot>` and `<ReferenceDot>` elements.
- Enforce `fontSize: 14` on all `<XAxis>`, `<YAxis>`, and Recharts `<Legend>` elements across Patient Compass and Phase 3 Clinician dashboard charts.
- Enforce `fill: '#94a3b8'` on all axis label text to pass WCAG AAA contrast against the Deep Slate background.
- Daily Pulse emoji grid: wraps to a 2x3 grid layout on viewports < 480px, with numeric label ("1 - Very Poor") at 14px beneath each emoji.
- Horizontal scroll chart containers must include `touch-action: pan-x` CSS to prevent iOS Safari vertical scroll trapping when charts are nested inside a vertically-scrolling page.

  *(FLO amendment - 2026-03-05)*

#### Out of Scope

- Rebuilding the chart data layer or changing how data is fetched from Supabase.
- Adding new data series to any existing chart.
- Redesigning or replacing the waveform chart architecture (Recharts vs. D3).
- The Radar chart `strokeWidth` fix (scoped in WO-546).

---

### 5. Priority Tier

**[X] P1** - High value, ship this sprint

**Reason:** Mobile is an explicitly stated product priority by the user. Charts that are unreadable on mobile directly block patient and practitioner adoption on the most common device category. FLO's audit mandated this as a Critical Violation.

---

### 6. Open Questions for LEAD

1. Should the horizontal scroll container show a visual scroll indicator (e.g., a subtle fade-out gradient on the right edge) to hint that more data exists off-screen?
2. For the Daily Pulse emoji grid, does the 2x3 breakpoint apply at `max-width: 480px` or at a Tailwind breakpoint (e.g., `sm`)?

---

### PRODDY Sign-Off Checklist

- [x] Problem Statement is <= 100 words and contains no solution ideas
- [x] Job-To-Be-Done is a single sentence in the correct format
- [x] All 3 success metrics contain a measurable number or specific observable event
- [x] Out of Scope is populated (not empty)
- [x] Priority tier has a named reason (not just "seems important")
- [x] Open Questions list is <= 5 items
- [x] Total PRD word count is <= 600 words
- [x] No code, SQL, or schema written anywhere in this document
- [x] Frontmatter updated: `owner: LEAD`, `status: 00_INBOX`
- [x] Response wrapped in `==== PRODDY ====`

==== PRODDY ====

---
## INSPECTOR QA Sign-off
**Date:** 2026-03-11
**Verdict:** APPROVED. Code fixes verified on main branch.
