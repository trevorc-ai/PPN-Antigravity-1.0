---
# ⚠️ NO REFACTORING: Analytics — targeted CSS/layout fixes only. Do NOT restructure components, rename hooks, move files, or change any data-fetching logic. Only change the minimum lines needed to fix mobile layout. See also: `public/internal/admin_uploads/research/ChatGPT-Algorithm-and-Analytics-3-23-26.md` for future analytics direction (do not implement in this WO).
id: WO-712
title: "Analytics page mobile UX overhaul — 2×2 fixed KPI grid, reduce wasted space, improve density"
owner: BUILDER
status: 04_BUILD
authored_by: LEAD (fast-track)
priority: P1
created: 2026-03-27
fast_track: true
origin: "User fast-track request with screenshots"
admin_visibility: no
admin_section: ""
pillar_supported: "Comparative Intelligence"
task_type: ui-feature
files:
  - src/pages/Analytics.tsx
  - src/components/analytics/ClinicPerformanceRadar.tsx
---

## Request

Analytics top row should stay 2×2 on mobile (DOUBLE SCROLL). The whole page is a waste of space on mobile. Bad UX.

## Screenshots Context

- **KPI cards:** Currently rendered as horizontal carousel (`flex overflow-x-auto`) with `w-[85vw] snap-center` forcing each card to 85% viewport width — one card visible at a time, requiring horizontal swipe to see all 4. User wants **2×2 fixed grid** (vertical scroll down page, not horizontal carousel).
- **Performance Radar on mobile:** `MobileAccordion` wraps the radar but the internal container has `minWidth: 600px` forcing horizontal scroll. The accordion shows title + suppression notice with almost no chart. Huge wasted vertical space.
- **Page-level waste:** Filter controls, InsightFeedPanel, and empty MobileAccordion panels consume most of the mobile viewport before any real data is visible.

## LEAD Architecture

**KPI Grid fix:**
Change `Analytics.tsx` line 155 from the horizontal flex carousel to a proper 2×2 grid on mobile:
```
// FROM:
flex overflow-x-auto gap-4 pb-4 md:grid md:grid-cols-2 lg:grid-cols-4 w-full scrollbar-hide

// TO:
grid grid-cols-2 gap-3 lg:grid-cols-4
```
Remove `shrink-0 w-[85vw] snap-center` from the card wrapper — cards should fill their grid cell naturally. Keep `md:w-auto md:shrink-1` for tablet/desktop safety.

**Performance Radar on mobile:**
- Reduce `minHeight` from `520px` → `360px` on mobile (scale with `md:min-h-[520px]`)
- Remove the inner `minWidth: 600px` wrapper on mobile (allow chart to reflow at narrower size); only apply `minWidth: 600px` at `md+`
- The `ClinicPerformanceRadar` component itself uses Recharts `ResponsiveContainer` so it will naturally adapt if the outer constraint is removed

**Density improvements:**
- Collapse `InsightFeedPanel` behind a `MobileAccordion` on mobile (`defaultOpen={false}`) — it's empty for most users right now
- Move filter controls (`Chart Filters` block) to be collapsible on mobile (already has `flex-col xl:flex-row` but is always visible — add `md:flex` hidden on mobile behind a filter toggle)
- Reduce `Section` vertical padding on mobile from `space-y-8` to `space-y-4` on mobile

## Acceptance Criteria

- [ ] KPI cards render in 2×2 grid on 375px — no horizontal scroll on top row
- [ ] All 4 KPI values visible on first viewport without swipe
- [ ] Performance Radar renders at ≤375px width without requiring horizontal scroll
- [ ] InsightFeedPanel hidden by default on mobile (collapsed accordion)
- [ ] Filter controls accessible but not blocking content on mobile
- [ ] Desktop layout unchanged (4-col KPI, full radar, open InsightFeed)
- [ ] Print layout unaffected (no regressions to `print:grid-cols-4`)

## Open Questions

- [ ] Should "DOUBLE SCROLL" mean: horizontal scroll within each chart component is still allowed, but the page-level layout scrolls vertically only? Assuming yes.

---
- **Data from:** `useAnalyticsData()` → `analytics.activeProtocols`, `analytics.patientAlerts`, `analytics.networkEfficiency`, `analytics.riskScore` (from `mv_site_dashboard_summary` via hook); `ClinicPerformanceRadar` → `useClinicBenchmarks()` → `mv_site_safety_benchmarks`
- **Data to:** No DB writes — layout-only changes
- **Theme:** Tailwind CSS in `Analytics.tsx`; `grid-cols-2` mobile fix; `MobileAccordion` component; Recharts `ResponsiveContainer` in `ClinicPerformanceRadar.tsx`

## INSPECTOR 03_REVIEW CLEARANCE
**Reviewed by:** INSPECTOR
**Date:** 2026-03-27
**Verdict:** FAST-PASS — no database changes, files list defined, pillar confirmed.
**BUILDER start condition:** Cleared. WO-as-Plan exemption applies. Start coding immediately.
