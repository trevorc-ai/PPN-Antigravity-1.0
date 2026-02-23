---
id: WO-403
title: "Phase 3 Layout Cleanup — Section Order, Spacing, Visual Hierarchy"
status: 03_BUILD
owner: BUILDER
created: 2026-02-22
created_by: LEAD
failure_count: 0
priority: P2
tags: [layout, phase3, integration, ux, cleanup, spacing, visual-hierarchy]
depends_on: [WO-401 FlipCard, WO-402 real data wiring]
parent: null
user_prompt: |
  "Clean up the page. I think we just need to clean up the page and keep testing
  with actual data until we have confidence everything is working properly."
---

# WO-403: Phase 3 Integration Page — Layout Cleanup

**Owner: BUILDER**
**Priority: P2 — Do after WO-401 and WO-402 so we clean what's final**

---

## LEAD ARCHITECTURE

### Issues to fix (from screenshot review)

#### 1. Section ordering — Neuroplasticity Badge is buried
Current order:
1. PatientOutcomePanel (takes ~40% of viewport)
2. Neuroplasticity Badge
3. Symptom Decay
4. ...

The badge is the most time-sensitive piece of clinical information on the page.
It tells the clinician whether the plasticity window is open and how urgently
integration needs to happen. It must be **the first thing they see.**

**New order:**
1. Neuroplasticity Window Badge ← FIRST (already renders at top after WO-241, verify it stays)
2. PHQ-9 Progress Summary KPI strip (3 big numbers: baseline → current → % change)
3. PatientOutcomePanel (longitudinal charts)
4. Symptom Decay Curve
5. Daily Pulse + 7-day trend
6. 3-column row: Compliance / Key Outcomes / Smart Insight
7. Action row: Progress Summary + Discharge Summary

#### 2. PatientOutcomePanel height
Currently takes full width with no height cap. On common laptop viewports (1280px)
this pushes everything else below the fold. Cap at `max-h-[480px]` with
`overflow-y-auto` inside the component, or collapse it behind a "▾ Show Outcome Charts"
accordion by default.

**Recommendation:** Default collapsed with a one-line summary ribbon visible:
```
📊 Longitudinal Outcomes   PHQ-9: 22 → 9 (59% improvement)   [Expand ▾]
```

#### 3. 3-column row spacing
The Compliance / Key Outcomes / Smart Insight columns have inconsistent heights
on viewport widths < 1024px. They stack awkwardly. Fix:
- `grid-cols-1 md:grid-cols-3` with `items-start` (not `items-stretch`)
- Each card has its own natural height — no forced equal height

#### 4. Action button row
The two buttons (Generate Progress Summary + Complete Journey) should be:
- Full-width stacked on mobile
- Side-by-side equal width on ≥ sm
- This was implemented in WO-304 but verify it renders correctly at 390px

#### 5. Remove visual redundancy
- The "Smart Insight" card has an `Activity` icon watermark at 5% opacity in the corner — this competes visually with the text at small sizes. Remove the watermark, the text is the value.
- Section header labels that duplicate what's in the card titles (e.g. "Phase 3 — Early Follow-up") can be removed since the Phase tab already contextualises

#### 6. Demo data badges (when WO-402 ships)
Ensure each panel with a `[DEMO DATA]` badge displays it in a **consistent position** —
top-right corner of the card header, amber, dismissible. Not inline with the content.

---

## SPECIFIC CODE CHANGES

### `IntegrationPhase.tsx`
- Move `NeuroplasticityWindowBadge` to remain at top (verify it stays first after all additions)
- Add PHQ-9 KPI strip (compact 3-stat row) immediately below the badge
- Wrap `PatientOutcomePanel` in a collapsible `<AccordionPanel>` — default collapsed
- Remove the large `Activity` icon watermark from the Smart Insight card
- Standardise all section header `<h3>` levels to use `text-xl font-bold` consistently

### PHQ-9 KPI strip (new inline component, ~20 lines)
```tsx
// Renders between badge and PatientOutcomePanel
<div className="grid grid-cols-3 gap-4">
  <KpiBlock label="Baseline PHQ-9" value={baselinePhq9} unit="/27" color="slate" />
  <KpiBlock label="Current PHQ-9"  value={currentPhq9}  unit="/27" color="indigo" />
  <KpiBlock label="Improvement"    value={`${pctImprovement}%`} color="emerald" />
</div>
```
Each `KpiBlock` is a **FlipCard** target from WO-401.

---

## ACCEPTANCE CRITERIA

- [ ] Neuroplasticity Badge is the first visible element in Phase 3 scrollview
- [ ] PHQ-9 KPI 3-stat strip renders immediately below badge
- [ ] PatientOutcomePanel is collapsed by default with 1-line summary visible
- [ ] Accordion expand/collapse works smoothly (CSS max-height transition)
- [ ] All three columns (Compliance / Outcomes / Insight) are `items-start` not stretched
- [ ] Smart Insight card watermark icon removed
- [ ] Action button row is side-by-side on ≥ sm, stacked on mobile
- [ ] All section header sizes consistent — `text-xl font-bold`
- [ ] Fonts ≥ 12px throughout
- [ ] No horizontal scroll at 390px viewport width
- [ ] Page renders without blank sections at 1280px, 1440px, 2560px (ultrawide)

## ROUTING
BUILDER → INSPECTOR
