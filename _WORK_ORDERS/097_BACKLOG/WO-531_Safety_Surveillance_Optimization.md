---
owner: LEAD
status: 00_INBOX
authored_by: PRODDY
---

## PRODDY PRD

> **Work Order:** WO-531 — Safety Surveillance Optimization & Integration  
> **Authored by:** PRODDY  
> **Date:** 2026-03-04  
> **Status:** Draft → Pending LEAD review  

---

### 1. Problem Statement
The Safety Surveillance Matrix is currently a stunning but static marketing page trapped in the "Deep Dives" section. Clinic directors and network administrators currently lack a centralized, real-time dashboard to monitor adverse events, severity distributions, and protocol risks across patients, forcing them to manually review individual session logs to spot critical safety trends.

---

### 2. Target User + Job-To-Be-Done
A clinic director needs to visualize network-wide adverse events and risk matrices in real-time so that they can quickly identify unsafe protocols or substance contraindications before they escalate.

---

### 3. Success Metrics

1. The Safety Surveillance page renders within < 2s when populated with live data from the adverse events table.
2. Heatmap cells and donut segments correctly filter the "Recent Safety Events" table below it in 100% of interactions.
3. Zero crashes when filtering the dashboard by specific date ranges or substances across 20 consecutive QA sessions.

---

### 4. Feature Scope

#### ✅ In Scope
- Move `SafetySurveillancePage.tsx` from `/deep-dives` to `/safety-surveillance` (Protected Tier 3 route).
- Add "Safety Surveillance" to the Sidebar navigation (grouped with Interactions & Audit Logs).
- Replace hardcoded React arrays (`heatmapData`, `recentEvents`, `severityDistribution`) with live Supabase subscriptions/queries.
- Add interactive top-level filters (Date Range, Substance, Clinic Location).
- Make heatmap cells and donut chart segments clickable to filter the data table below.

#### ❌ Out of Scope
- Creating new adverse event input forms or submission workflows.
- Predicting future adverse events via ML/AI.
- PDF/CSV data exports (to be handled by WO-571 Export Center).

---

### 5. Priority Tier

**[x] P1** — High value, ship this sprint  

**Reason:** The UI is already built and highly polished. Connecting it to real data immediately unlocks the "Global Benchmark Intelligence" narrative and delivers critical clinical value to practitioners in the current demo cycle.

---

### 6. Open Questions for LEAD

1. Should the data model query a single unified `safety_events` table, or dynamically aggregate from `session_logs` and `daily_pulse` submissions?
2. What Row Level Security (RLS) policies are needed to ensure clinic directors see anonymized aggregate data for the network, but unmasked data for their own clinic?
3. Specifically, where in the Sidebar hierarchy is the best home for this? (Proposed: under the Core 'Audit Logs' section as 'Safety Intelligence').

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
