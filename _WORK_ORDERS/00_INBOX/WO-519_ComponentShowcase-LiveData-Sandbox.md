---
id: WO-519
title: Component Showcase — Live Data Connection & Sandbox Mode
owner: LEAD
status: 00_INBOX
authored_by: PRODDY
priority: P1
created: 2026-02-28
---

## PRODDY PRD

> **Work Order:** WO-519 — Component Showcase — Live Data Connection & Sandbox Mode
> **Authored by:** PRODDY
> **Date:** 2026-02-28
> **Status:** Draft → Pending LEAD review

---

### 1. Problem Statement

The Component Showcase (`/component-showcase`) exists as a scrollable gallery of every built component, but all components currently render with hardcoded mock data. This means it cannot be used to verify real-world behavior, catch data-shape mismatches, or validate components before promotion to production pages. Practitioners and developers have no sandboxed environment to inspect live components against real Supabase data without touching production UI.

---

### 2. Target User + Job-To-Be-Done

A developer or practitioner-admin needs to view every platform component rendering against live, practitioner-scoped data so that they can validate behavior, catch regressions, and refine components before deploying them to production pages.

---

### 3. Success Metrics

1. Every analytics component in the Showcase renders with data sourced from Supabase (not hardcoded) within 3 seconds of page load, verified across 3 consecutive QA sessions.
2. All data displayed in the Showcase is filtered to the authenticated practitioner's `site_id` — zero cross-practitioner data leakage confirmed via QA spot-check with two separate test accounts.
3. A practitioner-admin navigating to `/component-showcase` can identify the live data source for any component (via a visible label, badge, or tooltip) without reading source code — verified by user review in ≤ 1 session.

---

### 4. Feature Scope

#### ✅ In Scope

- Connect the following component groups in `ComponentShowcase.tsx` to live Supabase read queries, scoped by the authenticated user's `site_id`:
  - **Analytics section**: ClinicPerformanceRadar, PatientConstellation, ProtocolEfficiency, MetabolicRiskGauge, SafetyBenchmark, GlobalBenchmarkIntelligence, InsightFeedPanel.
  - **Deep-Dives section**: SafetyRiskMatrix, PatientFlowSankey, ReceptorBindingHeatmap, RegulatoryWeather, PatientJourneySnapshot.
  - **Session section**: DosageCalculator and CrisisLogger receive the authenticated user's most recent real session ID instead of the hardcoded `'test-session-123'`.
- Add a **"LIVE DATA"** badge (green) or **"MOCK"** badge (amber) next to each component's title so it's immediately clear which data source is active.
- Add a top-bar **filter strip** to the Showcase page: practitioner can filter the view by date range and substance type without affecting any production page.
- The Showcase page must remain **read-only** — no writes to any Supabase table from this page.
- All Supabase queries in the Showcase must use the existing `useSupabaseClient` / `useSession` auth patterns — no new auth flows.

#### ❌ Out of Scope

- Connecting `BlindVetting` or `ProfileEdit` to live data — these are self-contained and do not consume session/analytics data.
- Adding new Supabase tables, columns, or RLS policies — all queries must work against the existing schema.
- Any changes to the components themselves (their internal data-fetching logic or rendering) — data is passed via props from the Showcase page only.
- HiddenComponentsShowcase (`/hidden-components`) — separate page, separate ticket if needed.
- Production deployment of a "sandbox mode" toggle to end-users — this page is dev/admin access only.

---

### 5. Priority Tier

**[x] P1** — High value, ship this sprint

**Reason:** This doubles as a QA tool and eliminates the current risk of shipping components that look correct in mock but break on real data shapes. Given the active pilot with Dr. Allen, having a live sandbox accelerates safe iteration without touching the guarded wellness journey or protocol builder files.

---

### 6. Open Questions for LEAD

1. Should the Showcase page be gated behind an `admin` or `developer` role check, or is practitioner-level auth sufficient to view it?
2. Components like `GlobalBenchmarkIntelligence` and `RegulatoryWeather` may pull from external/seeded benchmark tables rather than per-practitioner data — should they display global aggregate data (no `site_id` filter) or be suppressed if no real data exists yet?
3. For `PatientJourneySnapshot` and `ConfidenceCone`, which Supabase table or view should drive the data? LEAD must confirm the source before BUILDER queries them.
4. Should the date range filter in the top bar persist across page reloads (localStorage), or reset on every visit?

*No additional open questions at this time.*

---

### PRODDY Sign-Off Checklist

- [x] Problem Statement is ≤100 words and contains no solution ideas
- [x] Job-To-Be-Done is a single sentence in the correct format
- [x] All 3 success metrics contain a measurable number or specific observable event
- [x] Out of Scope is populated (not empty)
- [x] Priority tier has a named reason (not just "seems important")
- [x] Open Questions list is ≤5 items
- [x] Total PRD word count is ≤600 words
- [x] No code, SQL, or schema written anywhere in this document
- [x] Frontmatter updated: `owner: LEAD`, `status: 00_INBOX`
- [x] Response wrapped in `==== PRODDY ====`
