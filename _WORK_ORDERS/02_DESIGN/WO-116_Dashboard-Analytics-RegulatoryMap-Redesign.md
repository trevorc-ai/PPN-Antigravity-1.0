---
id: WO-116
status: 02_DESIGN
owner: DESIGNER
failure_count: 0
created: 2026-02-19
priority: HIGH
ticket_type: design + build
pages_affected:
  - src/pages/Dashboard.tsx
  - src/pages/Analytics.tsx
  - src/pages/News.tsx
  - src/components/analytics/RegulatoryMosaic.tsx
user_prompt_verbatim: "@lead please assign a work order to have Designer improve the layout of the dashboard, fix the component on the Analytics page (not displaying properly), finish the integration of the Intelligence/News page RegulatoryMap upgrade."
---

## LEAD ARCHITECTURE

Three scoped tasks in one ticket. All are frontend/UI — no DB changes required.
SOOP is deactivated; LEAD handles SQL if needed (none required here).

---

## TASK 1 — Dashboard Layout Polish

### Problem (from screenshot)
The dashboard currently feels vertically cramped and has several cosmetic layout issues:
- **Recommended Next Steps** section uses small pill-list layout — items feel small and low-hierarchy
- **Clinic Performance Cards** have inconsistent border treatment (`border-indigo-500/30` hardcoded on all 4 regardless of status)
- **Safety Risk Assessment** section is dominant — takes ~40% of the screen — while being non-interactive for most users
- **Quick Actions** row is fine but the `bg-amber-500` on "Check Interactions" conflicts with the cool-blue design system (should match the others)
- **Network Activity** cards at the bottom are weak — the `bg-slate-500` icon color makes them look deactivated vs. the vivid KPI cards above
- Overall vertical rhythm: sections don't have enough visual separation — the page reads as one long blob

### DESIGNER Deliverables
1. **Recommended Next Steps**: upgrade from tight list to a `3-column card grid` — each step gets an icon, number badge, and a clear CTA arrow. Urgent items get a red accent border (not color-only — also add "⚠ Urgent" label text).
2. **Clinic Performance Cards**: standardize border treatment. Active/positive = `border-emerald-500/30`. Alert card (Safety Alerts) = `border-amber-500/30`. Neutral = `border-slate-700/50`. Remove the hardcoded `border-indigo-500/30` on all 4.
3. **Safety Risk Matrix**: reduce its visual weight. Wrap in a collapsible `<details>` or add a toggle. Default state: **collapsed** with a summary line showing "2 high-risk interactions detected". Expanded: shows full matrix. This prevents the matrix from dominating new users who haven't logged any protocols yet.
4. **Quick Actions**: the `bg-amber-500` hover on "Check Interactions" should be `bg-rose-500` to differentiate it as a safety/check action rather than an edit action. Update button text to "Interaction Checker".
5. **Network Activity Cards**: change icon color from `bg-slate-500` to themed colors: `bg-blue-500` for Protocols, `bg-emerald-500` for Sites, `bg-amber-500` for Success Rate.
6. **Section spacing**: add `border-t border-slate-800/60` between major sections to restore visual rhythm.
7. **Minimum font size audit**: all visible text ≥ 12px. No `text-xs` on primary content labels.

### Do NOT change
- Header ("Dashboard" h1) — intentional design
- CTA button ("Log New Session") — wired correctly
- The search bar section — correct as-is
- Route links on all cards

---

## TASK 2 — Analytics Page: Fix Non-Displaying Component

### Problem
The `SafetyBenchmark` component block (lines 162–221 in `Analytics.tsx`) is not displaying properly. From code inspection:

1. The component renders inside a conditional: `benchmark ? (<SafetyBenchmark />) : (empty state)`. If `useSafetyBenchmark()` returns `null` for `benchmark`, the entire section shows the empty state — even if live data exists.
2. Likely root cause: `useSafetyBenchmark` hook is querying `log_user_sites` (the old table name) or getting a `null` site_id because `fetchUserSite()` at line 31 also queries `log_user_sites`. If the current user has no row in that table yet, `siteId` stays null, `benchmark` stays null, and both sections show empty/loading states forever.
3. The `Analytics.tsx` also has a `style jsx global` block (line 317) that isn't valid in standard React — requires `styled-jsx` which is not in the dependency list.

### DESIGNER Deliverables

**For the non-displaying `SafetyBenchmark`:**
- Check `src/hooks/useSafetyBenchmark.ts` and identify what query it uses
- If it fails due to missing site data, add a **graceful degraded state** that shows the component with mock/demo data when `benchmark === null` and `benchmarkLoading === false`
- The degraded state should display a banner: `"Showing demo data — log 10+ sessions to unlock your live benchmark"` with `[STATUS: INFO]` label text (not color-only)

**For the `style jsx global` syntax error:**
- Replace with a standard `<style>` tag or move print styles to `index.css` under a `@media print` block

**Layout fix:**
- The 5 chart components (ClinicPerformanceRadar, PatientConstellation, MolecularPharmacology, MetabolicRiskGauge, ProtocolEfficiency) all use `xl:col-span-2` making them full-width. Charts 3 and 4 (Molecular Bridge, Genomic Safety) are spec'd to be side-by-side at xl breakpoint. The grid parent is `xl:grid-cols-2` but both charts are `col-span-2` which overrides the intent. Fix: Charts 3 and 4 should NOT have `xl:col-span-2`.

---

## TASK 3 — Intelligence/News Page: Finish RegulatoryMosaic Integration

### Current State
`News.tsx` lines 155–162 already import and render `<RegulatoryMosaic>` with:
```tsx
<RegulatoryMosaic
  onStateSelect={handleStateSelect}
  externalSelectedState={selectedStateFilter}
  showDetailPanel={false}
/>
```
The handler `handleStateSelect` works — it maps state codes to names and sets the search query. The state filter indicator (lines 165–181) is wired correctly.

### Problem
The integration is 80% done but has three gaps:
1. **`showDetailPanel={false}`** — the detail panel is suppressed, but the UX intent was to show it *below* the mosaic on the same page (not in a modal). The panel should slide in beneath the map when a state is clicked.
2. **No visual connection** between the RegulatoryMosaic and the news feed below — when a state is selected, the news articles below filter but there's no animated/visual transition indicating the connection (e.g., a highlight, a count badge, a scroll).
3. **The `RegulatoryMosaic` is missing a section header** — it sits inside the feed with no label explaining what it is. New users don't know what the color-coded US map means.

### DESIGNER Deliverables
1. **Add section header** above `<RegulatoryMosaic>`:
   ```
   🗺 Regulatory Landscape   [subtitle: Click any state to filter news]
   ```
   Header should use the `text-2xl font-black` style with the standard page color `#A8B5D1`. Subtitle in `text-sm text-slate-400`.

2. **Enable the detail panel inline**: Change `showDetailPanel={false}` to `showDetailPanel={true}`. Inspect `RegulatoryMosaic.tsx` — if the detail panel is already built, just enable it. If it's missing, add a compact info strip below the map that shows:
   - State name + regulatory status label (Approved / Decriminalized / Prohibited)
   - A "View N articles" count badge that reflects `filteredNews.length` after selection

3. **Add a scroll-to-feed animation**: After `handleStateSelect` fires, call:
   ```ts
   document.getElementById('news-feed')?.scrollIntoView({ behavior: 'smooth' });
   ```
   Add `id="news-feed"` to the `<div className="space-y-6 pt-6">` at line 224.

4. **Add result count to filter indicator** (line 165–181): Change the text from:
   `"Showing news for: {searchQuery}"` → `"Showing {filteredNews.length} articles for: {searchQuery}"`

---

## Acceptance Criteria (INSPECTOR will verify all)
- [ ] `text-xs` not used on primary content labels (font ≥ 12px everywhere)
- [ ] No color-only status signals — all status differences also have text labels
- [ ] Dashboard layout improvements visible without scrolling (hero section cleaner)
- [ ] Analytics `SafetyBenchmark` either renders live data OR a labeled demo-mode fallback
- [ ] Analytics charts 3+4 render side-by-side at desktop width
- [ ] Intelligence page has RegulatoryMosaic section header
- [ ] State click on map scrolls to and filters the news feed
- [ ] `filteredNews.length` count shown in filter indicator
- [ ] No new TypeScript errors in `src/`
- [ ] No free-text PHI inputs introduced

## Files to Modify
- `src/pages/Dashboard.tsx`
- `src/pages/Analytics.tsx`
- `src/pages/News.tsx`
- `src/components/analytics/RegulatoryMosaic.tsx` (inspect before editing)
- `src/hooks/useSafetyBenchmark.ts` (inspect before editing)

## HANDOFF NOTE TO BUILDER
DESIGNER should produce a design brief + spec. BUILDER implements.
If tasks are self-contained enough, DESIGNER may implement directly and route to INSPECTOR.
