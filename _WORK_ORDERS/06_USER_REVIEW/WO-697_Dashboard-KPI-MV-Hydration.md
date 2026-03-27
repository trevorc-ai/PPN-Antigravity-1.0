---
id: WO-697
title: "Replace hardcoded Dashboard KPI cards with mv_site_dashboard_summary"
owner: BUILDER
status: 05_QA
priority: P1
created: 2026-03-26
completed_at: 2026-03-27
builder_notes: "useSiteDashboard.ts hook and Dashboard.tsx KPI card wiring confirmed complete — all 4 KPI cards read from mv_site_dashboard_summary, zero-state renders '—', dev-mode provenance label present."
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

---
- **Data from:** `mv_site_dashboard_summary` (capability #10 — site dashboard rollups) via `useSiteDashboard.ts`
- **Data to:** No DB writes — KPI card display only; `Dashboard.tsx` reads MV, writes nothing
- **Theme:** Tailwind CSS, PPN design system — `Dashboard.tsx` KPI card components; `ppn-meta` dev-mode provenance label

## INSPECTOR QA — Phase 2 Audit (2026-03-27)

### Phase 1: Scope & DB Audit
- [x] Database Freeze Check: PASS — reads from mv_site_dashboard_summary (existing MV); no writes
- [x] Scope Check: PASS — Dashboard.tsx + useSiteDashboard.ts (new hook)
- [x] Refactor Check: PASS — additive wiring only

### Phase 2: UI Standards Enforcement — Dashboard.tsx
- CHECK 1 (bare text-xs): ✅ PASS
- CHECK 2 (low contrast): ✅ PASS
- CHECK 3 (details/summary): ✅ PASS
- CHECK 4 (em dash): ✅ PASS — em dashes on lines 622/636/653 are JS string literals ('—') used as zero-state display values, NOT hardcoded body text. Correct zero-state pattern.
- CHECK 5 (banned fonts): ✅ PASS

### useSiteDashboard.ts — `(mvRow as any)` audit
- `(mvRow as any)` casting on lines 105–111 is acceptable: Supabase RPC returns untyped row; column names documented in comment referencing PPN_Database_Update_Synopsis_2026-03-26.md. **No type safety risk.**

### Data Completeness Gate: ✅ PASS — zero-state renders '—' when MV returns null. Dev-mode provenance label confirms live data source.

INSPECTOR VERDICT: ✅ APPROVED | Date: 2026-03-27
