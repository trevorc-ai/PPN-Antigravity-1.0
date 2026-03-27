---
id: WO-711
title: "Dashboard KPI card rearrangement + Intelligence Layer ≤2-click navigation fix"
owner: BUILDER
status: 02_TRIAGE
authored_by: LEAD (fast-track)
priority: P1
created: 2026-03-27
fast_track: true
origin: "User fast-track request with screenshots"
admin_visibility: no
admin_section: ""
pillar_supported: "Comparative Intelligence | QA/Governance"
task_type: ui-feature
files:
  - src/pages/Dashboard.tsx
  - src/components/admin/DataQualityPanel.tsx
---

> [!IMPORTANT]
> **SCOPE LOCK — User directive 2026-03-27:** ONLY the two items below are in scope. No other changes to `Dashboard.tsx`. No layout restructuring, no new sections, no new components.

## Request

All views (mobile, tablet, desktop) for top four KPI components need rearranging or improvement. Intelligence Layer is a DEAD END — everything should be easily linked (≤2 clicks from any metric).

## Screenshots Context

- **Mobile (375px):** 4 KPI cards rendering in a single horizontal row, cutting off the 4th card. Users cannot see "Documentation" without scrolling horizontally. The 2×2 grid prop exists in code (`grid-cols-2 md:grid-cols-4`) but the card widths appear to be ignoring it — likely a min-width issue on the card container.
- **Intelligence Layer panel:** Shows `Sessions with Protocol ID: 0/33`, `Sessions with Safety Events: 0/33`, Follow-up and Documentation rows, plus `FOLLOW-UP WINDOW COMPLIANCE` accordion. No actionable deep-link on any row. User lands here and has no way to navigate to fix items.

## LEAD Architecture

**KPI Card Grid Fix:** The `ClinicPerformanceCard` has no explicit min-width constraint. On narrow screens the 4-col grid collapses mid-way. Mobile layout should lock to `grid-cols-2` with a consistent card height (`min-h-[130px]`). The existing `link` prop drives `navigate(link)` on click — ensure all 4 cards have link targets set for 1-click navigation.

**Card tap targets — add links:**
- Protocols Logged → `/wellness-journey`
- Follow-up Completion → `/analytics`
- Safety Alerts → `/analytics` (scroll to safety section)
- Documentation → `/analytics` (scroll to radar)

**Intelligence Layer dead-end fix:** `DataQualityPanel.tsx` rows are display-only. Each metric row needs a `→ Fix` button that routes directly to the relevant page. Proposed mapping:
| Row | Link destination |
|---|---|
| Sessions with Protocol ID | `/wellness-journey` (select patient, open session, set protocol) |
| Sessions with Safety Events | `/wellness-journey` |
| Follow-up Windows | `/wellness-journey` |
| Avg Documentation Score | `/analytics` |

Also add a "View Full Analytics →" link at the bottom of the panel (1 click to full Intelligence view).

**Pillar:** Comparative Intelligence | QA/Governance

## Acceptance Criteria

- [ ] All 4 KPI cards visible on 375px without horizontal scroll
- [ ] All 4 cards are tappable and navigate to correct destination (≤1 click)
- [ ] Every metric row in DataQualityPanel has a working deep-link button
- [ ] "View Full Analytics →" CTA at bottom of Intelligence panel
- [ ] Desktop layout unchanged (4-col, 1 row)
- [ ] No bare `text-xs` (use `text-sm`), no em-dash characters (use `--` or `N/A`)
- [ ] Regression: Phase 2 session route unaffected

## Open Questions

- [ ] Should Safety Alerts card link to `/analytics#safety` with an anchor or just `/analytics`?
- [ ] Should the "Fix" buttons in DataQualityPanel open in a modal or navigate away?

---
- **Data from:** `useSiteDashboard()` → `mv_site_dashboard_summary`; `usePractitionerProtocols()` → `protocols` table; `DataQualityPanel` → `mv_site_documentation_summary`, `mv_site_followup_compliance`
- **Data to:** No DB writes — navigation wiring only; `DataQualityPanel.tsx` deep-link buttons (read-only panel)
- **Theme:** Tailwind CSS, `grid-cols-2 md:grid-cols-4` grid in `Dashboard.tsx`; `ClinicPerformanceCard` component; `DataQualityPanel.tsx`
