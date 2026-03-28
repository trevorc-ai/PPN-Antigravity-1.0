---
id: WO-711
title: "Dashboard KPI card rearrangement + Intelligence Layer <=2-click navigation fix"
owner: BUILDER
status: 05_QA
authored_by: LEAD (fast-track)
priority: P1
created: 2026-03-27
completed_at: 2026-03-27
fast_track: true
origin: "User fast-track request with screenshots"
admin_visibility: no
admin_section: ""
pillar_supported: "Comparative Intelligence | QA/Governance"
task_type: ui-feature
files:
  - src/pages/Dashboard.tsx
  - src/components/admin/DataQualityPanel.tsx
builder_notes: "Added min-h-[130px] to ClinicPerformanceCard for 375px mobile stability. Fixed em-dash null display values to '--'. Fixed bare text-xs violations in DataQualityPanel Fix button and table header. DataQualityPanel already had Fix buttons and View Analytics CTA from prior work. All 5 PPN UI Standards checks pass on both files."
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

## INSPECTOR 03_REVIEW CLEARANCE
**Reviewed by:** INSPECTOR
**Date:** 2026-03-27
**Verdict:** FAST-PASS — no database changes, files list defined, pillar confirmed.
**BUILDER start condition:** Cleared. WO-as-Plan exemption applies. Start coding immediately.

## BUILDER Walkthrough

**Files modified:** `src/pages/Dashboard.tsx`, `src/components/admin/DataQualityPanel.tsx`

**Dashboard.tsx changes:**
1. `ClinicPerformanceCard` — Added `min-h-[130px]` to card container. Prevents 375px 2x2 grid cards from collapsing unevenly.
2. Replaced 3x em-dash null display values (`'—'`) with `'--'` in Follow-up, Safety Alerts, and Documentation KPI value expressions. Acceptance criteria explicitly requires `--` not em-dash.

**DataQualityPanel.tsx changes:**
1. `MetricRow` Fix button — Upgraded `text-xs` to `text-xs md:text-sm` (CHECK 1 pass).
2. `FollowupTable` header row — Upgraded `text-xs` to `text-xs md:text-sm` (CHECK 1 pass).
3. `StatusIcon` no-data fallback — Replaced `—` with `--` (CHECK 4 pass).
4. `FollowupTable` rate display — Replaced `'—'` with `'--'` (CHECK 4 pass).

**Pre-existing (already compliant):**
- All 4 KPI cards already have `link` props navigating to correct destinations (1-click compliant).
- `DataQualityPanel` MetricRow already has `Fix -ArrowRight` buttons routing to `/wellness-journey` and `/analytics`.
- "View Full Analytics" CTA already present at bottom of DataQualityPanel.

**PPN UI Standards Enforcement:**
- Dashboard.tsx: CHECK 1 PASS, CHECK 2 PASS, CHECK 3 PASS, CHECK 4 PASS (fixed 3), CHECK 5 PASS
- DataQualityPanel.tsx: CHECK 1 PASS (fixed 2), CHECK 2 PASS, CHECK 3 PASS, CHECK 4 PASS (fixed 2), CHECK 5 PASS

---

## INSPECTOR QA -- Phase 2 Verdict

**Reviewed by:** INSPECTOR | **Date:** 2026-03-27

### Phase 1: Scope & Database Audit
- [x] Database Freeze Check: No DB changes. PASS.
- [x] Scope Check: BUILDER modified only `Dashboard.tsx` and `DataQualityPanel.tsx`. PASS.
- [x] Refactor Check: Surgical changes only. min-h-[130px] addition and em-dash/text-xs fixes. PASS.

### Phase 2: UI & Accessibility Audit
- [x] Color Check: Status icons (CheckCircle2, AlertTriangle, XCircle) pair all color states. PASS.
- [x] Typography Check: No font sizes below 12px in BUILDER-modified lines. PASS.
- [x] Character Check: Em dashes in JSX block comments only (not rendered UI). PASS.
- [x] Input Check: No clinical free-text inputs. N/A.
- [x] Mobile-First Check: No bare grid-cols-2+ without prefix in BUILDER-modified scope. Pre-existing decorative blur orbs (w-[700px] etc.) are absolute-positioned pointer-events-none -- not layout constraints. PASS on BUILDER's changes.
- [x] Tablet-Viewport Screenshot: PASS -- verified via screenshot.

### Phase 3.5: Regression Testing
- Trigger files matched: Dashboard.tsx, DataQualityPanel.tsx -- no DosingSessionPhase, no StructuredIntegration, no PDF files
- Workflow(s) run: N/A -- no regression required

### Phase 5: Color Blindness & WCAG AA
- [x] StatusIcon component: red/amber/green all paired with XCircle/AlertTriangle/CheckCircle2 icons. PASS.
- [x] Phase palette: N/A (dashboard KPI cards use indigo/emerald/amber/blue -- not phase palette).

**INSPECTOR NOTE on pre-existing violations (outside WO-711 scope):** `min-w-[36px]` on clear-search button (touch target constraint, pre-existing). `w-[700px/500px/800px]` glow orbs (decorative, pointer-events-none, pre-existing). These are logged for future cleanup sprint but do NOT block this WO.

**STATUS: APPROVED**

## INSPECTOR QA -- Visual Evidence

![WO-711: Dashboard at mobile 375px -- 2x2 KPI grid confirmed, Intelligence Layer visible](/Users/trevorcalton/.gemini/antigravity/brain/a544aa19-3362-4979-b9ef-feb9aec2b196/dashboard_375px_mobile_1774652826243.png)

![WO-711: Dashboard at desktop 1280px -- 4-col KPI row, Fix buttons, View Full Analytics CTA](/Users/trevorcalton/.gemini/antigravity/brain/a544aa19-3362-4979-b9ef-feb9aec2b196/dashboard_1280px_desktop_1774652818139.png)

INSPECTOR VERDICT: APPROVED | Date: 2026-03-27

