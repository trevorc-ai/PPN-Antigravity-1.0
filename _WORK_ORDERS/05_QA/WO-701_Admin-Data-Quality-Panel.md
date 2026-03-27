---
id: WO-701
title: "Admin Data Quality Panel — site-level documentation and protocol completeness dashboard"
owner: BUILDER
status: 04_BUILD
priority: P1
created: 2026-03-26
origin: "Intelligence Layer Integration Plan — Recommendation #6"
pillar_supported: "3 — QA and Governance, 1 — Safety Surveillance"
audience: site_admin role only
sequence_note: "Build after WO-695 lands. The panel is most informative when protocol_id is being captured — otherwise it just shows 0% across the board. Can build before WO-696 but will not reflect safety events until WO-696 ships."
files:
  - src/components/admin/DataQualityPanel.tsx (NEW)
  - src/hooks/useSiteDataQuality.ts (NEW)
---

## Problem
Site admins and supervisors have no visibility into why their intelligence layer surfaces
show "Insufficient data." There is no mechanism to help them understand:
- How many sessions have `protocol_id` populated vs. null
- How many sessions have at least one `log_safety_events` row
- What percentage of follow-up windows were completed
- Per-session documentation completeness scores

Without this visibility, practitioners cannot improve what they cannot see, and the
intelligence layer remains empty for lack of behavioral change.

## Required Fix

### 1. Create `src/hooks/useSiteDataQuality.ts`
```ts
// Source: mv_site_documentation_summary (capability #6 — documentation completeness)
// Source: mv_site_followup_compliance (capability #5 — follow-up compliance measurable)
// Zero-state: renders "No session data yet" if site has 0 sessions
```
Queries:
- `mv_site_documentation_summary` → overall completeness %, session count, missing field breakdown
- `mv_site_followup_compliance` → % windows completed by day-1/3/7/14/30
- Direct count from `log_clinical_records` WHERE `protocol_id IS NULL` for this site
- Direct count from `log_safety_events` joined on sessions for this site (confirm > 0)

### 2. Create `src/components/admin/DataQualityPanel.tsx`
A single card visible only to users with site admin role. Contains:

**Row 1 — Intelligence Layer Readiness**
| Metric | Value | Status |
|---|---|---|
| Sessions with Protocol ID | N / Total | 🔴 / 🟡 / ✅ |
| Sessions with Safety Events | N / Total | 🔴 / 🟡 / ✅ |
| Follow-up Windows Completed | X% | 🔴 / 🟡 / ✅ |
| Avg Documentation Score | X% | 🔴 / 🟡 / ✅ |

**Status thresholds:**
- 🔴 = <30%   |   🟡 = 30–79%   |   ✅ = ≥80%

**Row 2 — Per-session completeness list** (collapsible, paginated)
- Uses `mv_documentation_completeness` — one row per session
- Columns: Subject ID, Session Date, Completeness %, Missing fields

**Row 3 — Data quality improvement prompt**
If ANY metric is 🔴: render a ppn-body callout:
> "Complete session records activate the clinical intelligence layer —
>  priority queue, trajectory tracking, and outcome benchmarks."

### 3. Render location
Mount in the Admin Dashboard (or a dedicated `/admin/data-quality` route if cleaner).
Visible only when `user.role === 'site_admin'`.

## Success Criteria
- Panel renders with real values from `mv_site_documentation_summary`
- Protocol ID gap and safety event gap are visibly surfaced to admins
- Zero-state: "No session data yet" (not empty / not broken)
- `grep -r "hardcoded\|MOCK_\|synthetic" src/components/admin/DataQualityPanel.tsx` → 0 results
- Role-gated: non-admin users cannot see this component

## INSPECTOR 03_REVIEW CLEARANCE: FAST-PASS
No DB impact. Read-only MV + direct count queries. Cleared for build.
Signed: INSPECTOR | Date: 2026-03-26

---
- **Data from:** `mv_site_documentation_summary` (capability #6), `mv_site_followup_compliance` (capability #5), direct count from `log_clinical_records` (`protocol_id IS NULL`), `log_safety_events` joined on sessions; `mv_documentation_completeness` (per-session list)
- **Data to:** No DB writes — admin-only read panel; `DataQualityPanel.tsx` displays site health metrics
- **Theme:** Tailwind CSS, PPN design system — `DataQualityPanel.tsx` (new), `useSiteDataQuality.ts` (new); role-gated (`site_admin` only)
