---
id: WO-697
title: "Replace hardcoded Dashboard KPI cards with mv_site_dashboard_summary"
owner: BUILDER
status: 04_BUILD
priority: P1
created: 2026-03-26
origin: "Intelligence Layer Integration Plan — Part 2 Dummy Data Fix"
pillar_supported: "3 — QA and Governance, 4 — Network Benchmarking"
files:
  - src/pages/Dashboard.tsx
  - src/hooks/useSiteDashboard.ts (NEW)
supersedes: WO-539 (Dashboard Data Hydration — same problem, now has MV target)
sequence_note: "Can build in parallel with WO-698. More valuable after WO-695 lands (protocol_id populates the MV). WO-699 depends on this completing first."
---

## Problem
The main Dashboard Clinic Performance cards display hardcoded values (`71%`, `2 alerts`, `4.2 hrs`).
`mv_site_dashboard_summary` now provides all required fields in a single row per site:
follow-up completion rate, documentation completeness, outcome deltas, improving/worsening rates,
and safety counts.

## Required Fix
1. Create `src/hooks/useSiteDashboard.ts`:
   ```ts
   // Source: mv_site_dashboard_summary (capability #10 — site dashboard rollups)
   // Zero-state: returns null when site has no data — render "No data yet" gracefully
   ```
   - Resolves `site_id` via existing `getCurrentSiteId()` pattern
   - SELECT `*` from `mv_site_dashboard_summary` WHERE `site_id = $siteId`
   - Returns null (not error) if 0 rows — new sites have no data yet

2. Wire the four KPI cards in `Dashboard.tsx` to the hook output:
   - Follow-up completion rate → `followup_completion_rate`
   - Safety alerts → `unresolved_safety_count`
   - Documentation completeness → `documentation_completeness_pct`
   - Improving patients → `improving_count` / `total_sessions_with_outcomes`

3. Each card must show a visible data-provenance label: `ppn-meta` text reading
   `"Live · mv_site_dashboard_summary"` in dev mode (behind `import.meta.env.DEV` flag)

4. Zero-state: if `useSiteDashboard` returns null, render `"—"` in each card, not `0`

## Success Criteria
- No hardcoded numbers in Dashboard KPI cards
- Cards update when underlying session data changes (after next MV refresh)
- Zero-state renders gracefully for new sites
- `grep -r "71%" src/pages/Dashboard.tsx` returns 0 matches

## INSPECTOR 03_REVIEW CLEARANCE: FAST-PASS
No DB impact. Read-only MV query. Cleared for build.
Signed: INSPECTOR | Date: 2026-03-26
