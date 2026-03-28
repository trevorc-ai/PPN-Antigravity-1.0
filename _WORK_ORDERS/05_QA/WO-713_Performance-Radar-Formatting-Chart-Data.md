---
id: WO-713
title: "Performance Radar — formatting cleanup and chart data accuracy"
owner: BUILDER
status: 04_BUILD
authored_by: LEAD (fast-track)
priority: P2
created: 2026-03-27
fast_track: true
origin: "User fast-track request with screenshots"
admin_visibility: no
admin_section: ""
pillar_supported: "Comparative Intelligence | Benchmarking"
task_type: ui-analytics
files:
  - src/components/analytics/ClinicPerformanceRadar.tsx
  - src/hooks/useClinicBenchmarks.ts
---

## Request

Formatting and chart data on Performance Radar needs improvement.

## Screenshots Context

- **Mobile screenshot shows:** "Clinic Performance" heading inside the accordion, then a warning callout: *"Efficacy & Adherence spokes are suppressed — awaiting assessment score pipeline."* Then "Based on 24 sessions · Live data" footer. The radar chart itself is barely visible — nearly all whitespace.
- **Problems:** (1) Suppression notice consumes most of the card with minimal chart; (2) the available spokes (Safety, Documentation, Follow-up) should still render even while Efficacy/Adherence are suppressed; (3) chart proportions are off on mobile; (4) "Clinic Performance" label duplicated (in `MobileAccordion` title AND inside the card header).

## LEAD Architecture

**Suppression callout sizing:** Reduce the suppression warning from a full-height panel to a slim inline banner (`rounded-lg px-3 py-2 text-sm`) at the bottom of the chart. The chart should render with available spokes regardless of suppression state.

**Duplicate label:** Remove the inner `<h3>Clinic Performance</h3>` header from `ClinicPerformanceRadar.tsx` — it's already shown in `MobileAccordion title="Performance Radar"`. On desktop, keep the panel header.

**Radar chart proportions:**
- Set `aspect` or fixed `height` on `ResponsiveContainer` to `aspect={1}` (square) rather than free-height. This prevents the empty vertical band that appears on mobile.
- Ensure all non-suppressed spokes (Safety, Documentation, Follow-up, Protocol Adherence) have real values from `useClinicBenchmarks()` before defaulting to 0.

**Zero-state handling:** When all spokes return 0 (no benchmark data), show a concise "No benchmark data yet — log more sessions" message instead of an empty radar polygon.

**Data accuracy:** `useClinicBenchmarks.ts` currently returns safety/documentation/followup scores. Confirm these map correctly to radar spokes in component. Log a `// Source: mv_site_safety_benchmarks` comment at each consumption point.

## Acceptance Criteria

- [ ] Radar chart renders at correct aspect ratio on mobile (no tall blank area)
- [ ] Suppression notice is a slim inline banner, not a full panel
- [ ] Available spokes render with live data even when Efficacy/Adherence are suppressed
- [ ] No duplicate "Clinic Performance" / "Performance Radar" label on mobile
- [ ] Zero-state shows honest "no data" message, not an empty polygon
- [ ] `// Source: mv_site_*` comments present in `useClinicBenchmarks.ts` hook

---
- **Data from:** `useClinicBenchmarks.ts` → `mv_site_safety_benchmarks`, `mv_documentation_completeness`, `mv_site_followup_compliance`
- **Data to:** No DB writes — display-only radar chart
- **Theme:** Tailwind CSS; Recharts `RadarChart` + `ResponsiveContainer` in `ClinicPerformanceRadar.tsx`; `useClinicBenchmarks.ts` hook

## INSPECTOR 03_REVIEW CLEARANCE
**Reviewed by:** INSPECTOR
**Date:** 2026-03-27
**Verdict:** FAST-PASS — no database changes, files list defined, pillar confirmed.
**BUILDER start condition:** Cleared. WO-as-Plan exemption applies. Start coding immediately.

---

## INSPECTOR QA Hold -- 2026-03-27

**Reviewed by:** INSPECTOR | **Date:** 2026-03-27

**Situation:** `src/components/analytics/ClinicPerformanceRadar.tsx` was committed in commit `611d533`, so BUILDER did work on this file. However, NO BUILDER Walkthrough block was appended to this ticket.

**Preliminary grep results:**
- CHECK 1 (text-xs): PASS.
- CHECK 4 (em dash): PASS.
- CHECK 3 (details/summary): PASS.
- CHECK 5 (banned fonts): PASS.

**Action Required:** BUILDER must append walkthrough confirming: suppression banner was slimmed to inline, duplicate label removed, aspect ratio fix applied, zero-state handling added, `// Source: mv_site_*` comments added. Provide 5-check self-cert then re-surface to `05_QA`.

