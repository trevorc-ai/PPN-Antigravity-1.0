---
id: WO-401
title: "FlipCard & DataDrawer — Inline Data Reveal with 3D Animation"
status: 03_BUILD
owner: BUILDER
created: 2026-02-22
created_by: LEAD
failure_count: 0
priority: P1
tags: [ux, animation, data-reveal, phase3, integration, flip-card, recharts]
depends_on: []
parent: null
user_prompt: |
  "I'm realizing the one thing we need is to give the user the option to display
  the data without having to export a report. Can we enable the user to click to
  see the high-level numerical results of the queries? I'm picturing a 'flip over'
  animation or expanding table, or something even more impressive?"
---

# WO-401: FlipCard & DataDrawer — Inline Data Reveal

**Owner: BUILDER**
**Priority: P1 — Core UX gap: clinicians can only see data via export today**

---

## LEAD ARCHITECTURE

Two complementary patterns — use the right one per context:

### Pattern A: `FlipCard` — CSS 3D Y-axis flip
**Use for:** Compact KPI stat blocks (PHQ-9 improvement, session scores, compliance %)

- Front face: existing visual (chart sparkline, big number, badge)
- Back face: raw data table — label / value / benchmark rows
- Trigger: click a discrete "📊" icon button in the card's top-right corner
  (NOT the whole card — prevents accidental flips during reading)
- Animation: `rotateY(180deg)` over 400ms, `transform-style: preserve-3d`
- Reset: same icon button (now shows "◀ Back") on the reverse face

### Pattern B: `DataDrawer` — slide-down table below chart
**Use for:** Full-width chart panels (Symptom Decay, PatientOutcomePanel, Benchmark Ribbon)

- Charts are too wide to flip cleanly without distortion
- A drawer that expands below the chart (animated `max-height` 0 → auto) shows the
  underlying data points in a clean table
- Trigger: "📊 Show Data" button in the chart header toolbar (aligns with CSV export button)
- Dismiss: same button toggles closed

---

## COMPONENT SPECIFICATION

### `src/components/ui/FlipCard.tsx`

```tsx
interface FlipCardProps {
  front: React.ReactNode;      // chart / big number / visual
  backRows: Array<{
    label: string;
    value: string | number;
    note?: string;             // optional benchmark or source annotation
  }>;
  backTitle?: string;          // defaults to "Raw Data"
  className?: string;
}
```

**Visual spec — back face:**
```
┌─────────────────────────────────────────┐
│  📊 Raw Query Results        [◀ Back]   │
├─────────────────────────────────────────┤
│  PHQ-9 Baseline Score         22        │
│  PHQ-9 at Week 6               9        │
│  Absolute Reduction           13 pts    │
│  % Score Change               59%       │
│  Clinical Response Threshold  ≥ 5 pts   │
│  [STATUS: ACHIEVED]           ✓         │
│  Data source: log_longitudinal_assessments
└─────────────────────────────────────────┘
```

- Background: dark `bg-slate-900` matching app theme
- Row alternation: subtle `odd:bg-slate-800/30`
- Value column: `font-mono font-bold text-emerald-300` for numbers
- Note column: `text-slate-500 text-xs`
- "Data source:" footer row in monospace slate-600

### `src/components/ui/DataDrawer.tsx`

```tsx
interface DataDrawerProps {
  rows: Array<{
    label: string;
    value: string | number;
    unit?: string;
    source?: string;
  }>;
  title?: string;
  isOpen: boolean;
  onToggle: () => void;
}
```

Trigger button to embed in chart headers:
```tsx
<DataDrawerToggle isOpen={isOpen} onToggle={onToggle} />
// Renders: [📊 Show Data ▾] or [📊 Hide Data ▴]
```

---

## IMPLEMENTATION TARGETS

Wire the new components into these specific locations in Phase 3:

| Target | Pattern | Data rows to expose |
|---|---|---|
| PatientOutcomePanel top stat block | FlipCard | Baseline PHQ-9, endpoint PHQ-9, % change, Hedges' g vs benchmark, n= |
| Symptom Decay Curve chart | DataDrawer | Each (day, phq9) data point + benchmark threshold line |
| Compliance stat blocks (pulse, PHQ-9, sessions) | FlipCard | Raw counts (e.g. "12 of 15 days checked") + streak/gap data |
| Neuroplasticity Badge (Phase 3 header) | FlipCard | Session date, days elapsed, days remaining, window close date |

---

## CSS ANIMATION (to add to `index.css`)

```css
/* FlipCard 3D container */
.flip-card-container {
  perspective: 1000px;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}

.flip-card-inner.is-flipped {
  transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.flip-card-back {
  transform: rotateY(180deg);
}

/* DataDrawer slide animation */
.data-drawer {
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.data-drawer.is-open {
  max-height: 500px; /* large enough for any data table */
}
```

---

## ACCEPTANCE CRITERIA

- [ ] FlipCard flips on icon button click — NOT on card click (prevents accidental triggers)
- [ ] Back face shows correct raw data rows with label/value/note layout
- [ ] FlipCard back face has a "◀ Back" button that restores front face
- [ ] DataDrawer slides smoothly (no jump) with `max-height` transition
- [ ] DataDrawer toggle button in chart toolbar — "📊 Show Data ▾" / "📊 Hide Data ▴"
- [ ] Both components work with mock data (graceful until real DB data lands)
- [ ] No layout disruption when FlipCard is in default (front) state
- [ ] Font sizes ≥ 12px throughout back face
- [ ] Keyboard accessible — Enter/Space triggers flip/drawer toggle
- [ ] No horizontal overflow on mobile (data table allows word-wrap)
- [ ] Animation is smooth at 60fps — no jank

## ROUTING
BUILDER → INSPECTOR
