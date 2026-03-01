---
id: WO-525
title: "Clinical Intelligence Page — Full Refinement Pass"
owner: LEAD
status: 00_INBOX
authored_by: CUE
priority: P1
created: 2026-02-28
failure_count: 0
tags: [analytics, ui-polish, layout, charts, benchmark, patient-galaxy, performance-radar, export]
---

# WO-525: Clinical Intelligence Page — Full Refinement Pass

## Source
Direct user work order delivered to CUE, 2026-02-28.

---

## ⚠️ CUE INTEGRITY FLAG

CUE made a direct unauthorized edit to `src/pages/Analytics.tsx` during intake (protocol violation).  
**Before BUILDER touches any file, LEAD must run:**  
```
git diff src/pages/Analytics.tsx
git checkout src/pages/Analytics.tsx   # revert if not approved
```  
CUE's draft edit moved the KPI ribbon and Safety Performance into one unified section, moved Export Report to bottom, and reordered Global Benchmark Intelligence to the bottom. LEAD should review the diff and decide whether to adopt, discard, or revise the approach before BUILDER proceeds.

---

## User-Reported Issues (verbatim)

1. **KPI card misalignment** — "Active Protocols", "Patient Alerts", "Network Efficiency", and "Risk Score" containers are not aligned horizontally; probably being affected by the "Safety Performance" div just below, which could be converted to one full-width line or moved into the container below.
2. **Export Report button placement** — Move "Export Report" button to the bottom of the page.
3. **Export/Print PDF output** — PDF output needs formatting (currently dumps the dark UI as-is).
4. **Benchmark Comparison chart** — "Events per 100 sessions" bar chart needs filters, axis labels, legend, data display options.
5. **Global Benchmark Intelligence placement** — Cognitive overload. "Effect Sizes by Study — Global Benchmarks" is too compressed vertically. This entire container belongs at the bottom (below practitioner-specific clinical analytics) if not on another page entirely. User is open to suggestions — **ask PRODDY for recommendation before implementing.**
6. **Performance Radar** — Too much white space and a double scroll; needs more filter options, more informative info, legend, metrics.
7. **Patient Galaxy** — No filters, no legend, no data display instructions, layout needs refinement, and needs color accessibility check.

---

## PRODDY Consultation Required (Item 5)

Before BUILDER addresses item 5 (GBI placement), PRODDY must produce a brief placement recommendation. Options to evaluate:
- A) Keep on same page, move to bottom (below Performance Radar + Patient Galaxy)
- B) Move to a dedicated sub-page accessible via a tab or link from Clinical Intelligence
- C) Collapse into an expandable accordion at the bottom

PRODDY should weigh: cognitive load, practitioner workflow order (own data first, benchmarks second), and the density of the GBI component.

---

## Scope of Work — Per Issue

### Issue 1: KPI Alignment
- **File:** `src/pages/Analytics.tsx`
- **Fix:** The 4 KPI cards must all have equal height. The "Safety Performance" section heading below must either (a) be absorbed into the top of the safety panel card itself as an inline header, or (b) moved so it no longer creates a visual gap between the KPI row and the safety content. The `grid-cols-2 md:grid-cols-4` grid must produce 4 equal columns at `md` and above.

### Issue 2: Export Report Button Placement
- **File:** `src/pages/Analytics.tsx`
- **Fix:** Remove or demote the top-right Export Report button. Add a prominent "Export PDF Report" call-to-action at the very bottom of the page (above the footer), styled as a full-width or centered card with a description. Optionally retain a small icon-only shortcut in the header for power users.

### Issue 3: Print/PDF Formatting
- **Files:** `src/pages/Analytics.tsx` (print styles) + any relevant component files
- **Fix:** When `window.print()` is triggered, the output must render as a clean white-background document. Requirements:
  - White background throughout
  - Dark text on all section titles and values (`#1e293b` or similar)
  - Chart backgrounds set to white or `#f8fafc`
  - Remove all glassmorphic dark panel backgrounds
  - Print header showing: Report title, practitioner email, generated date
  - Print footer: "CONFIDENTIAL — For Clinical Use Only"
  - `@page` margin: at least 1.5cm, A4 portrait

### Issue 4: Benchmark Comparison Chart (SafetyBenchmark.tsx)
- **File:** `src/components/analytics/SafetyBenchmark.tsx`
- **Fix the NaN% bug** — `deltaVsNetwork` renders `NaN%` when both rates are 0. Guard: if `networkRate === 0`, display `"N/A"` instead of a division result.
- **Add axis label** to X-axis: "Events per 100 sessions" (currently missing)
- **Add a legend** below or beside the chart distinguishing "Your Node" (emerald) from "Network Avg" (slate) with color swatches
- **Add display options** — toggle between "Bar" (current) and "Gauge" or "Number" display (P2 if too complex; at minimum improve the existing chart labels)
- **Filters context note** — If the parent page's substance/date filters are passed down as props, SafetyBenchmark should display the active filter in a subtitle (e.g. "Filtered: Ketamine · Last 30 days")

### Issue 5: Global Benchmark Intelligence Placement
- **File:** `src/pages/Analytics.tsx` + potentially routing
- **BLOCKER:** PRODDY recommendation required first. Do not move until PRODDY deliverable is attached to this ticket.
- Once PRODDY decides: implement the chosen placement. The GBI section should appear **after** the practitioner-specific analytics (Performance Radar, Patient Galaxy).

### Issue 6: Performance Radar (ClinicPerformanceRadar.tsx)
- **File:** `src/components/analytics/ClinicPerformanceRadar.tsx`
- **White space fix** — The right-side insights panel currently overflows into a nested scroll (`max-h-[400px] overflow-y-auto`). Remove the nested scroll — let the card expand naturally to fit content, or show all 3 insights without overflow.
- **Double scroll fix** — The parent `GlassmorphicCard` has a fixed `min-h-[520px]` but the inner radar div has `min-h-[300px]`. These competing height constraints create a scroll within a scroll. Resolve by letting content height drive the card height.
- **More filters** — Add the following filter toggles to the header controls:
  - Substance filter (All / Psilocybin / MDMA / Ketamine) — currently only Quarter/Year toggle exists
  - Comparison mode: "vs Network Avg" (current) / "vs Top 10%"
- **Legend** — The Recharts `<Legend>` already exists but needs better visual styling. Ensure "My Clinic" (indigo) and "Network Avg" (slate dashed) are clearly labeled with consistent icon colors.
- **Metric definitions** — Each insight card in the right panel already has a text description. Ensure these descriptions are visible without scroll. Increase the card height or reduce the layout constraint so all 3 cards show simultaneously.
- **Node ID** — Remove the hardcoded "Node ID: 8821-X" from the bottom of the insights panel. Replace with a dynamic label from the practitioner's actual site (if available) or remove entirely.

### Issue 7: Patient Galaxy (PatientConstellation.tsx)
- **File:** `src/components/analytics/PatientConstellation.tsx`
- **Filters** — Add a filter row above the chart with:
  - Outcome filter: All / Remission / Partial / Non-Responder / Active
  - Protocol filter: All / IM Ketamine / Psilocybin / MDMA-AT / Oral Ketamine
  - Cluster toggle: Show/Hide each cluster type (Current Patient / Responders / Cohort)
- **Legend** — Add a persistent legend panel (not just the info popover) showing:
  - Color/shape per cluster: Current Patient (pulsing indigo), Responder (emerald), Cohort (slate)
  - X-axis definition: "Treatment Resistance Score"
  - Y-axis definition: "Symptom Severity (PHQ-9)"
- **Data display instructions** — Convert the existing info popover (ℹ️ button) into a permanently visible legend panel on the right side of the chart, or include a one-line instructional bar below the chart title: "Click any node to view patient protocol details."
- **Color accessibility** — All cluster nodes currently share the same fill (`#818cf8`), differentiated only by `fillOpacity`. This fails WCAG contrast requirements for colorblind users. Fix:
  - Current Patient: `#6366f1` (indigo) with a 6px ring/pulse animation
  - Responder: `#10b981` (emerald)
  - Cohort: `#64748b` (slate)
  - Each must be distinguishable without relying on opacity alone. Add shape differentiation if possible (e.g. asterisk vs circle vs square via custom dot)
- **Layout refinement** — The chart container is currently `h-[400px] sm:h-[500px]` with a fixed border. Let the parent `GlassmorphicCard` handle the container border. Remove the duplicate internal `bg-[#0f1218] border border-slate-800` wrapper since `hideHeader` mode wraps it in a `GlassmorphicCard` already.

---

## Acceptance Criteria

- [ ] All 4 KPI cards align horizontally at `md` breakpoint and above
- [ ] "Safety Performance" label appears inside its own panel, not as a standalone floating heading
- [ ] Export Report button is at the bottom of the page in a descriptive callout
- [ ] Print output shows white background, dark text, no dark backgrounds
- [ ] Benchmark chart shows axis label, legend, and no NaN display
- [ ] Global Benchmark Intelligence is placed per PRODDY recommendation
- [ ] Performance Radar has no nested scroll and renders at natural height
- [ ] Performance Radar adds substance filter and comparison mode controls
- [ ] Patient Galaxy: all cluster dots have distinct colors (indigo / emerald / slate)
- [ ] Patient Galaxy: persistent legend + axis labels visible without clicking info button
- [ ] Patient Galaxy: filter row renders above chart (outcome, protocol, cluster)
- [ ] INSPECTOR sign-off required before LEAD closes ticket
