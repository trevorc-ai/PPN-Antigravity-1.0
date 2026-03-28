---
id: WO-714
title: "Connect Analytics critical intelligence KPIs to live SQL materialized views"
owner: BUILDER
status: 02_TRIAGE
authored_by: LEAD (fast-track)
priority: P1
created: 2026-03-27
fast_track: true
origin: "User fast-track request"
admin_visibility: no
admin_section: ""
pillar_supported: "Comparative Intelligence | Benchmarking"
task_type: sql-view | ui-analytics
files:
  - src/pages/Analytics.tsx
  - src/hooks/useAnalyticsData.ts
  - src/components/analytics/InsightFeedPanel.tsx
---

## Request

Connect critical intelligence on Analytics page to SQL materialized views.

## LEAD Architecture

Current state of `useAnalyticsData.ts`:
- `activeProtocols` → queries `protocols` table directly (not from MV) ⚠️
- `patientAlerts` → queries `protocols` table directly ⚠️
- `networkEfficiency` → hardcoded `0` or derived client-side ⚠️
- `riskScore` → derived client-side from protocol count ⚠️

Target state (Read Model Policy — all MVs must be used if they exist):
| KPI | Current source | Target source |
|---|---|---|
| Active Protocols | `protocols` table | `mv_site_dashboard_summary.active_protocol_count` |
| Patient Alerts | `protocols` table | `mv_unresolved_safety_flags` count |
| Network Efficiency | Hardcoded | `mv_site_dashboard_summary.followup_completion_rate` (proxy) |
| Risk Score | Client-side | `mv_site_dashboard_summary.unresolved_safety_count` → Low/Med/High threshold |

**Migration plan for `useAnalyticsData.ts`:**
1. Add Supabase query to `mv_site_dashboard_summary` (already used by `useSiteDashboard` — consider sharing the hook or accepting the MV data as prop to avoid double-fetch)
2. Replace each hardcoded/direct-table field with corresponding MV column
3. Add `// Source: mv_*` comment at each field
4. Keep existing interface signature — no breaking changes to `analytics.activeProtocols` etc.

**InsightFeedPanel:** Currently receives raw `siteId` and issues its own queries. Confirm whether it reads from `mv_clinician_work_queue` (WO-699 target). If not, that is the source for the feed items.

**⚠️ IMPORTANT:** Do NOT double-fetch `mv_site_dashboard_summary`. If `useSiteDashboard` already fetches it, `useAnalyticsData` should accept data from that hook or import from a shared cache rather than issuing a second query.

## Acceptance Criteria

- [ ] `activeProtocols`, `patientAlerts`, `networkEfficiency`, `riskScore` all sourced from `mv_site_dashboard_summary` or `mv_unresolved_safety_flags`
- [ ] No double-fetch of the same materialized view
- [ ] `// Source: mv_*` comment at every MV consumption point
- [ ] KPI cards show real numbers for the test account (8 protocols → should show 8 active)
- [ ] Risk Score shows "Low" / "Med" / "High" from threshold, not "Unknown"
- [ ] InsightFeedPanel confirmed reading from `mv_clinician_work_queue` (or WO-699 dependency noted)

## Dependencies

- Requires WO-697 (Dashboard KPI MV Hydration) logic pattern to be reusable
- WO-699 (InsightEngine MV Redirect) should be completed before this

## Open Questions

- [ ] Should `useAnalyticsData` be deprecated in favor of `useSiteDashboard` once all fields overlap? Or kept as a separate analytics-scoped hook?

---
- **Data from:** `mv_site_dashboard_summary` (active_protocol_count, followup_completion_rate, unresolved_safety_count, documentation_completeness_pct); `mv_unresolved_safety_flags` (count); `mv_clinician_work_queue` (InsightFeedPanel)
- **Data to:** No DB writes — hook returns read-only KPI data to `Analytics.tsx`
- **Theme:** No UI changes — `useAnalyticsData.ts` hook internals only; `kpiStats` array in `Analytics.tsx` receives updated values
