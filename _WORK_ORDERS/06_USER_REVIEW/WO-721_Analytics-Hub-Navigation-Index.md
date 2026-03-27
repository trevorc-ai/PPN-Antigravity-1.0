---
owner: LEAD
status: 00_INBOX
authored_by: PRODDY
active_sprint: true
priority: P1
pillar_supported: "Pillar 2 — Comparative Clinical Intelligence, Pillar 3 — QA and Governance"
database_changes: no
files:
  - src/pages/Analytics.tsx
data_from: mv_site_dashboard_summary, mv_site_safety_benchmarks (KPI cards); deep-dive routes are each self-contained
data_to: read-only (navigation only)
theme: existing Tailwind dark theme, PPN UI standards
---

## PRODDY PRD

### 1. Problem Statement
The `/analytics` page displays the same 4–5 panels regardless of how much data exists, while 14 fully-built deep-dive pages (`/deep-dives/*`) are completely unreachable from the Analytics page. The page is a dead end. Practitioners who need to investigate a specific metric — Safety Risk, Protocol ROI, Patient Galaxy — have no path there from Analytics. The deep-dive architecture is built but disconnected.

### 2. Target User + Job-To-Be-Done
A practitioner needs to navigate from their real-time KPI summary to any specific clinical intelligence deep-dive in ≤ 2 clicks so they can investigate anomalies and inform treatment decisions without hunting through menus.

### 3. Success Metrics
1. Every active deep-dive route is reachable from `/analytics` in ≤ 2 clicks — verified by INSPECTOR browser test
2. Analytics page mobile load time ≤ 3s on 375px viewport — no layout regressions
3. Zero deep-dive cards link to routes that 404 — INSPECTOR link audit confirms

### 4. Feature Scope
#### In Scope:
- Replace the bottom `Section` of `Analytics.tsx` (currently the Radar + PatientGalaxy embedded charts) with a **Deep-Dive Intelligence Grid** — cards linking to each working deep-dive route
- Each card: icon, title, one-line description, tier badge (Premium/Enterprise), live/mock status badge
- Cards for: Safety Risk Matrix, Patient Journey, Confidence Cone, Protocol ROI, Patient Galaxy, Regulatory Mosaic, Regulatory Weather, Receptor Binding, Molecular Bridge, Metabolic Risk Gauge, Global Benchmark Intelligence
- Move embedded Radar chart to collapsed `MobileAccordion defaultOpen={true}`
- Remove embedded PatientConstellation (now accessible via deep-dive card)

#### Out of Scope:
- Redesigning the KPI top row (completed in WO-712)
- Any new deep-dive page or route (existing routes only)
- Filtering or sorting the deep-dive grid
- Any changes to individual deep-dive page components

### 5. Priority Tier
P1 — The deep-dive architecture is fully built and unreachable. This is a navigation fix, not a feature build. High impact, low risk.

### 6. Open Questions for LEAD
1. Which deep-dive routes currently 404 vs. render correctly? LEAD to audit `App.tsx` route config before BUILDER starts.
2. Should the grid show only "live data" cards, or include "mock data" cards with a suppression badge explaining they're pending WO-716–720?

---
## INSPECTOR Fast-Pass + BUILDER Completion (2026-03-27)
database_changes: no -- FAST-PASS eligible.
5-check UI Standards: PASS -- no new violations introduced.
Build completed. Moving to 06_USER_REVIEW.
