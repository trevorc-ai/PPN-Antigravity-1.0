---
id: WO-116
status: 02_DESIGN
owner: DESIGNER
failure_count: 0
created: 2026-02-19
updated: 2026-02-19
priority: HIGH
ticket_type: design + build
archived_parent_wos:
  - WO-004_Regulatory_Map_Consolidation (DESIGNER signed off 2026-02-18, BUILDER never executed)
pages_affected:
  - src/pages/Dashboard.tsx
  - src/pages/Analytics.tsx
  - src/pages/News.tsx
  - src/components/analytics/RegulatoryMosaic.tsx
  - src/components/ui/ConnectFeedButton.tsx
  - src/hooks/useSafetyBenchmark.ts
  - src/hooks/useAnalyticsData.ts
user_prompt_verbatim: |
  Dashboard has a massive component in the middle of the page now that wasn't requested; also all of the buttons and components on this page need to be activated. And I'd like to see some live data flowing through the dashboard to see what it really looks like.
  The integration of the news page and the regulatory map is a long-standing work order that was in the queue for a long time. Check the archives for the details. RSS feeds and API also need to be connected with filters. Designer has a new react map creator for an upgrade on the map mosaic. They connect.
  Your blog button is blue but probably should be green because it's different than other kinds of buttons, we also need to offer functionality for people to submit their blog or URL probably just via email or if there's some way we can have them uploaded RSS feed or something like that to automate it that would be better, but this isn't a mandatory feature.
  Analytics page has good components, they just need layout refinement and filters, and need to be connected to the database.
---

## LEAD ARCHITECTURE

Three parallel tracks, each spawning a BUILDER subtask. SOOP is deactivated — LEAD handles any SQL.
No new database tables required. Live data comes from existing hooks + Supabase queries.

---

## TRACK A — DASHBOARD: SHRINK MATRIX + WIRE ALL BUTTONS + LIVE DATA

### Problem Summary (from screenshot + user feedback)
The `SafetyRiskMatrix` (Pharmacovigilance Matrix) occupies ~40% of the Dashboard viewport — user did not request it was added here and it dominates the page. All Quick Action buttons navigate to routes but many underlying pages have no DB connection. KPI cards ("23 protocols", "71% success rate") are hardcoded strings.

### BUILDER Actions

**A1. Collapse the Safety Risk Matrix by default**
- Wrap `<SafetyRiskMatrix />` in a `<details>` element styled as a card
- Default: `open={false}` — shows only a summary strip: `"Pharmacovigilance Matrix — 2 interactions flagged. Click to expand."`
- Expand arrow on right side. `summary` element uses `text-sm font-bold text-slate-300`
- When protocols.length === 0, hide the section entirely (it already has this logic — enforce it)

**A2. Wire all Quick Action buttons to live routes**
- "LOG PROTOCOL" → `/wellness-journey` ✅ already wired
- "ANALYTICS" → `/analytics` ✅ already wired
- "CHECK INTERACTIONS" → `/interactions` — verify this route exists in App.tsx; if not, wire to `/deep-dives/molecular-pharmacology`
- "EXPORT DATA" → `/data-export` — verify route; if not yet built show a `toast("Coming soon")` notification
- "BENCHMARKS" → `/deep-dives/clinic-performance` ✅ already wired
- Network Activity cards (Total Protocols, Active Sites, Network Avg Success) — each has an `→` arrow that should navigate: Protocols → `/analytics`, Sites → `/news`, Success → `/analytics`

**A3. Live data in KPI cards**
Replace hardcoded values with data from `usePractitionerProtocols()` which is already imported:
- "Protocols Logged" value → `protocols.length` (already available)
- "Success Rate" → derive from protocols: count sessions with outcome PHQ-9 reduction ≥50%. If insufficient data, show `"—"` not `"71%"`
- "Safety Alerts" → query `log_safety_events` COUNT where `site_id = userSiteId AND is_resolved = false`. Wire via new `useSafetyAlertCount()` hook or inline useEffect.
- "Avg Session Time" → hardcoded until session timing is in DB. Display `"—"` for now, not `"4.2 hrs"`.
- Network Activity cards: Total Protocols → `protocols.length` of full network query, Active Sites → fetch COUNT from `log_sites`, Network Avg Success → derive or show `"—"`.

**A4. "Recommended Next Steps" — make content dynamic**
If `protocols.length === 0`: show onboarding steps (Log Protocol, Set up site, Complete first session).
If `alerts > 0`: Step 1 = "Review {n} safety alerts" (urgent).
Otherwise: show generic progress steps.
Leave placeholder logic as fallback if queries haven't resolved.

**A5. Remove hardcoded mock percentile badge**
`ClinicPerformanceCard` for Success Rate shows `"62nd percentile"` hardcoded. Remove or replace with `"Calculating..."` when real benchmarks aren't available.

---

## TRACK B — ANALYTICS: LAYOUT + FILTERS + DB CONNECTION

### Problems
1. Charts 3 (MolecularPharmacology) and 4 (MetabolicRiskGauge) both have `xl:col-span-2` — they should sit side-by-side at desktop. Remove `xl:col-span-2` from charts 3 and 4 only.
2. `SafetyBenchmark` renders in an empty state when `useSafetyBenchmark()` returns null (user has < 10 sessions). Add a **labeled demo-mode banner**: `"[DEMO] Showing illustrative data. Log 10+ sessions to unlock live benchmarks."` Use `text-amber-400` + amber border. Keep the chart rendering with example data so the page doesn't look broken.
3. `style jsx global` block at lines 317–333 is not standard React — move print styles to `index.css` under `@media print {}`.
4. Sticky filter bar (lines 224–249) has only molecule + date selects. Add a third filter: **Outcome Type** (`All | PHQ-9 | GAD-7 | MEQ-30`). Wire all three filters to the `useAnalyticsData(siteId)` hook by passing filter state as params.
5. The `useAnalyticsData` hook likely returns `activeProtocols`, `patientAlerts`, `networkEfficiency`, `riskScore` — verify these are fetching live from Supabase and not returning mock fallbacks. If mocks, replace with real queries against `log_clinical_records` and `log_safety_events`.

### BUILDER Actions
- Remove `xl:col-span-2` from charts 3 + 4
- Add demo-mode banner to SafetyBenchmark empty state
- Move `style jsx global` print CSS → `index.css`
- Add Outcome Type filter to sticky bar
- Pass filter state to `useAnalyticsData` hook
- Audit hook for mock data and replace with live Supabase counts

---

## TRACK C — INTELLIGENCE/NEWS + REGULATORY MAP (WO-004 COMPLETION)

### Archive Context (WO-004, DESIGNER signed off 2026-02-18)
WO-004 had a full DESIGNER brief: consolidate `/regulatory` route into the News page as a tabbed view. The DESIGNER delivered: tab navigation spec, routing redirect spec (`/regulatory` → `/news?tab=regulatory`), sidebar cleanup, and accessibility spec. The BUILDER never executed it. That work is now superseded by a simpler, better integration (mosaic already embedded in News.tsx) — but the following features from WO-004 were **never built**:
- URL-param tab switching (`?tab=news` | `?tab=regulatory`)
- Inline detail panel in News context
- Route redirect from `/regulatory`
- RSS feed connection with filters

### BUILDER Actions — C1: Current Mosaic Integration Finish

The RegulatoryMosaic is already embedded in News.tsx (lines 155–162) with `showDetailPanel={false}`. The integration is 80% done. Complete it:

1. **Add section header** above `<RegulatoryMosaic>` in News.tsx:
   ```tsx
   <div className="mb-4">
     <h2 className="text-2xl font-black" style={{ color: '#A8B5D1' }}>🗺 Regulatory Landscape</h2>
     <p className="text-sm text-slate-400">Click any state to filter news articles below</p>
   </div>
   ```

2. **Enable the detail panel**: Change `showDetailPanel={false}` → `showDetailPanel={true}`. The panel is already built in `RegulatoryMosaic.tsx` (lines 136–198) — it just needs to be un-suppressed.

3. **Scroll-to-feed after state select**: Add `id="news-feed"` to the `<div className="space-y-6 pt-6">` at line 224. In `handleStateSelect`, add after the setters:
   ```ts
   setTimeout(() => document.getElementById('news-feed')?.scrollIntoView({ behavior: 'smooth' }), 100);
   ```

4. **Filter count in indicator** (line 169): Change to `"Showing {filteredNews.length} articles for: {searchQuery}"`

5. **Bug fix in RegulatoryMosaic.tsx line 29**: `ny` key should be `NY` (lowercase bug causing NY state to not match correctly):
   ```ts
   NY: { code: 'NY', name: 'New York', ... }
   ```

### BUILDER Actions — C2: React Map Upgrade (DESIGNER to spec first)

DESIGNER: The user mentioned they have a **new React map creator** for upgrading the mosaic from the current grid view to an actual US state map. 

**DESIGNER deliverable needed:** Spec out the upgrade path:
- Does the new map use `react-simple-maps`, `d3-geo`, `@visx/geo`, or custom SVG? Confirm with user.
- The new map needs to accept the same props as current `RegulatoryMosaic`: `onStateSelect`, `highlightedStates`, `externalSelectedState`, `showDetailPanel`
- States should be colored by regulatory status (same 4-status color scheme as current grid)
- On hover: tooltip with state name + status
- On click: same `handleStateClick` behavior
- The detail panel (right sidebar showing selected state details) should remain unchanged
- Accessibility: keyboard navigable states, ARIA labels per state

Proposed component name: `RegulatoryMap` (replacing `RegulatoryMosaic` for the interactive map; keep mosaic as fallback)

### BUILDER Actions — C3: RSS Feed + API Connection

Current state: `NEWS_ARTICLES` in `src/constants` is a static array. The page needs real feeds.

**RSS Integration approach** (no backend required — use a CORS proxy):
- Use `https://api.rss2json.com/v1/api.json?rss_url=<RSS_URL>` as a free RSS-to-JSON bridge
- Seed with 3 relevant RSS feeds:
  - `https://maps.googleapis.com/...` — (placeholder, get actual URLs)
  - Psychedelic Alpha: `https://psychedelicalpha.com/feed`
  - MAPS: `https://maps.org/feed/`
  - Erowid: skip (not appropriate for clinical context)
  - Use: `https://clinicaltrials.gov/api/rss` for trials feed
- Create `src/hooks/useNewsFeed.ts` that fetches from 2–3 RSS sources, maps to `NewsArticle` shape, merges with `NEWS_ARTICLES` constants (constants act as fallback if fetch fails)
- Filter the merged array by `category`, `sentiment`, `searchQuery` (existing logic)

**ConnectFeedButton fix**: 
- Change from `bg-indigo-500` (blue) to `bg-emerald-600 hover:bg-emerald-500` (green) — it's a content submission action, not a navigation action
- Add `onClick` handler that opens a mailto link: `mailto:feeds@ppn.com?subject=RSS Feed Submission&body=My blog/feed URL: ` OR opens a small inline modal with instructions
- Non-mandatory: if the user wants RSS auto-submission, build a simple form that POSTs to a Supabase edge function or just sends an email. Keep as Phase 2.

### BUILDER Actions — C4: Blog/Feed Submission (Non-Mandatory, Phase 2)

If bandwidth allows:
- Add a "Submit Your Feed" modal triggered by ConnectFeedButton
- Fields: Feed URL (text input), Contact Email, Brief description (textarea — this is non-PHI, UI context only)
- On submit: `mailto:` fallback OR POST to `/api/submit-feed` edge function
- Mark with "PHASE 2 — Optional" comment in code

---

## ACCEPTANCE CRITERIA (INSPECTOR checklist)

### Dashboard
- [ ] Pharmacovigilance Matrix collapsed by default, expandable
- [ ] `protocols.length` drives "Protocols Logged" KPI (not hardcoded "23")
- [ ] "Safety Alerts" value comes from live DB query or shows `"—"` with label
- [ ] All 5 Quick Action buttons navigate to correct routes or show toast if unbuilt
- [ ] Network Activity cards link on arrow click
- [ ] No hardcoded mock percentiles displayed as real data

### Analytics
- [ ] Charts 3 + 4 render side-by-side at xl breakpoint
- [ ] SafetyBenchmark shows demo-mode banner when `benchmark === null`
- [ ] Print styles moved to `index.css`
- [ ] Outcome Type filter added to sticky bar
- [ ] `useAnalyticsData` returns live data (not mocked zeros)

### Intelligence/News
- [ ] Section header "🗺 Regulatory Landscape" above mosaic
- [ ] `showDetailPanel={true}` — detail panel visible when state selected
- [ ] State click scrolls to `#news-feed`
- [ ] Filter count shows `filteredNews.length`
- [ ] `NY` key bug fixed in `RegulatoryMosaic.tsx`
- [ ] `ConnectFeedButton` is green, not blue
- [ ] `useNewsFeed` hook fetches from at least 1 live RSS source with constants fallback

### Global
- [ ] No new TS errors in `src/`
- [ ] All fonts ≥ 12px
- [ ] No color-only status signals
- [ ] No PHI/free-text inputs introduced

---

## ROUTING REMINDER (from WO-004)
- Add redirect: `<Route path="/regulatory" element={<Navigate to="/news" replace />} />`  
- Sidebar: confirm "Regulatory Map" nav item is already removed (WO-004 said to remove it — verify)

## FILES TO INSPECT BEFORE EDITING
- `src/hooks/useAnalyticsData.ts` — check for mock data
- `src/hooks/useSafetyBenchmark.ts` — check query + null handling  
- `src/App.tsx` — check `/interactions` and `/data-export` routes exist
- `src/components/layouts/Sidebar.tsx` — check if Regulatory Map nav item still present
