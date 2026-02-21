---
id: WO-308
title: "Network Intelligence Page — Multi-Clinic Comparison Dashboard"
status: 01_TRIAGE
owner: LEAD
created: 2026-02-21
created_by: ANALYST + PRODDY
failure_count: 0
priority: P3
tags: [analytics, network, multi-clinic, comparison, league-table, heatmap, enterprise]
depends_on: [WO-302, WO-303, WO-231, minimum 3 active sites with ≥5 patients each]
parent: null
pricing_tier: Network (premium tier — gates this feature behind upgrade)
user_prompt: |
  ANALYST: Network Intelligence is the layer that doesn't yet exist in the UI.
  PRODDY: "The analytics tiers ARE the pricing tiers. Network Intelligence unlocks 
  the Network pricing tier. A clinic director who can see their whole network's 
  Protocol Heatmap would never leave PPN."
---

# WO-308: Network Intelligence Page — Multi-Clinic Comparison Dashboard

**Owner: LEAD → DESIGNER → BUILDER**
**Priority: P3 — Unlocks Network pricing tier; requires ≥3 active sites**
**Route: `/network-intelligence` (gated behind Network subscription tier)**

---

## PRODDY STRATEGIC BRIEF

### Revenue Architecture This Unlocks
Network Intelligence is the feature that converts PPN from a per-practitioner tool to a per-organization contract. A group practice administrator, DSO, or research consortium who sees that their 4 clinics can be compared, benchmarked, and optimized from a single dashboard will sign a multi-seat, multi-year contract. This is 10× the revenue of individual practitioners.

### Access Gate
- **Solo / Practice tier:** This route redirects to an upgrade page
- **Network tier+:** Full access
- Show a "preview/locked" state for Practice tier users with blurred cards and "Upgrade to Network" CTA

### Privacy Rule (CRITICAL)
Until ≥3 sites AND ≥5 patients per site in the network, show ONLY the global benchmark comparison (no cross-clinic comparison). Individual site data remains invisible to other sites at all times. Only aggregate, tagged data (Site A, Site B) is shared — never site names or practitioner names without explicit opt-in.

---

## PAGE STRUCTURE: `/network-intelligence`

### Header
```
NETWORK INTELLIGENCE
Multi-site outcomes comparison · {N} sites · {N} practitioners · {N} sessions
[Network tier badge] · Last updated: {date}
```

---

### Panel 1: Network KPI Ribbon
4 cards:
- **Network Response Rate:** Avg across all sites (vs. global benchmark)
- **Top Performing Site:** Site ID with highest response rate this quarter
- **Network AE Rate:** Aggregate vs. PPN network average
- **Documentation Health:** Avg completeness score across network

---

### Panel 2: `ClinicLeagueTable`
**What it answers:** "Which clinic in my network is performing best?"

**Visual:** Lollipop chart — horizontal
- Each lollipop: one site (labeled "Site A", "Site B", etc. — anonymized by default)
- X-axis: Response rate (%)
- Reference line: Network average (solid line)
- Reference line: Published benchmark (dashed line)
- Bubble size: N patients at that site
- Color: Above average = violet, at average = slate, below average = amber (text label alongside)

**Tooltip:**
```
Site B
Response Rate: 71% [STATUS: PASS — Above Average]
N: 43 patients · 67 sessions
Modality mix: Psilocybin 59% / Ketamine 41%
vs. Network Average: +14 percentage points
```

**k-anonymity:** Only show sites with N ≥ 5 patients

---

### Panel 3: `NetworkProtocolHeatmap`
**What it answers:** "Which protocol works best across which conditions in our network?"

Rows = Conditions (PTSD, MDD, TRD, AUD, etc.)
Columns = Modalities (Psilocybin, MDMA, Ketamine, Esketamine)
Cell = Network-wide response rate for that modality × condition combination
Color = Diverging violet↔amber (colorblind-safe)

**Network data only shown for cells with N ≥ 5 across all sites combined**
**At launch (few sites):** Show published benchmark data in empty cells with [EXTERNAL BENCHMARK] label

---

### Panel 4: `OutlierClinicSpotlight`
**What it answers:** "Which site should I be paying attention to — in either direction?"

Rule-based spotlight cards (similar to InsightFeedPanel logic):
- [SIGNAL] Site with response rate ≥1.5 SD above network average
- [REVIEW] Site with AE rate ≥2× network average
- [REVIEW] Site with documentation completeness < 50%
- [OPPORTUNITY] Site with high response rate in one modality but not using it at scale

---

### Panel 5: `NetworkAttritionComparator`
**What it answers:** "Where in the pipeline are we losing patients across sites?"

Side-by-side population funnels (one per site, anonymized):
- Enrolled → Baseline → Dosing → Integration → Follow-up → Responded → Remitted
- Highlight which stage shows the biggest variance across sites

---

### Panel 6: Network Intelligence Report Export
Button: "Export Network Report (PDF)"
- Generates a multi-page PDF summary of all Network Intelligence panels
- Branded with PPN + organization logo
- Suitable for board presentation, grant reporting, investor due diligence
- Connects to the existing PDF export architecture (WO-76c15c34 reference)

---

## LOCKED STATE (Practice tier — preview)
For non-Network users:
- Show all panels with blurred content (CSS `filter: blur(8px)`)
- Overlay card: "This is a Network tier feature. Upgrade to compare your clinics, identify your strongest protocols, and generate network-wide intelligence reports."
- CTA: "Upgrade to Network" → routes to pricing/upgrade page

---

## TECHNICAL IMPLEMENTATION

### New Route: `src/pages/NetworkIntelligence.tsx`
### New Components:
- `src/components/analytics/ClinicLeagueTable.tsx`
- `src/components/analytics/NetworkProtocolHeatmap.tsx`
- `src/components/analytics/OutlierClinicSpotlight.tsx`
- `src/components/analytics/NetworkAttritionComparator.tsx`

### New Service Functions: `src/services/networkAnalytics.ts`
```typescript
// All functions require multi-site access (gated at API level)
getNetworkKPIs(organizationId: string): Promise<NetworkKPIs>
getClinicLeagueTable(organizationId: string): Promise<ClinicMetric[]>
getNetworkProtocolHeatmap(organizationId: string): Promise<HeatmapCell[][]>
getNetworkAttrition(organizationId: string): Promise<FunnelData[]>
```

### RLS Policy
- Network data queries require `organization_id` matching authenticated user's org
- Cross-site comparisons use anonymized `site_id` labels — never clinic names in query results
- Service role key required for cross-site aggregations (not anon key)

---

## ACTIVATION GATE
Build this feature but **do not activate the route** until:
- [ ] ≥3 paying sites are live on PPN
- [ ] Each site has ≥10 sessions logged
- [ ] Privacy policy updated to include multi-site data sharing disclosure
- [ ] USER confirmed data sharing consent obtained from each participating site

## ACCEPTANCE CRITERIA
- [ ] Route `/network-intelligence` renders correctly
- [ ] Solo/Practice tier users see locked/blurred preview state with upgrade CTA
- [ ] ClinicLeagueTable shows lollipop chart with site anonymization
- [ ] NetworkProtocolHeatmap shows correct aggregation with [EXTERNAL BENCHMARK] in empty cells
- [ ] OutlierClinicSpotlight cards use [STATUS] text labels, no color-only
- [ ] All panels enforce k-anonymity (N ≥ 5 per site)
- [ ] PDF export generates multi-page report
- [ ] Fonts ≥ 12px
- [ ] Mobile: panels stack vertically, charts scroll horizontally
- [ ] Activation gate check runs before rendering any real data

## ROUTING
LEAD → DESIGNER → BUILDER → INSPECTOR → PRODDY (pricing tier gate review)

## PRICING NOTE FROM PRODDY
This feature IS the Network pricing tier. Price accordingly: $X/mo per additional site, or flat organization contract. The upgrade trigger is the moment a Practice-tier user has 2+ practitioners and wants to compare them. Build the locked preview state beautifully — it should make them want to upgrade immediately.
