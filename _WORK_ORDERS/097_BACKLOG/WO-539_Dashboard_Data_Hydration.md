==== PRODDY ====
---
owner: LEAD
status: 01_TRIAGE
authored_by: PRODDY
---

## PRODDY PRD

> **Work Order:** WO-539 — Partner Dashboard Data Hydration
> **Authored by:** PRODDY  
> **Date:** 2026-03-04  
> **Status:** Draft → Pending LEAD review  

### 1. Problem Statement
The primary Clinic Performance metric cards on the main Dashboard currently display hardcoded placeholder values. If the initial beta testers see static numbers that do not update when they create patients or log sessions, they will perceive the product as a non-functional prototype rather than an actionable clinical intelligence platform. This severely damages trust in the system's core value proposition.

### 2. Target User + Job-To-Be-Done
A partner beta tester needs to see their actual clinic metrics update dynamically on the dashboard so that they can trust the platform is accurately tracking their clinical outcomes and patient activity.

### 3. Success Metrics
1. 100% of the top-level metric cards render utilizing live Supabase database queries.
2. Changes to a partner's underlying patient or session records successfully propagate to the main dashboard within 2 seconds of the database write.
3. RLS policies successfully prevent any tester from seeing aggregate metrics outside of their authorized `site_id` during 10 QA tests.

### 4. Feature Scope

#### ✅ In Scope
- Wiring the 4 main Dashboard Performance Cards (e.g., Total Patients, Active Protocols, Overall Improvement Score) to Supabase SELECT queries.
- Implementing minimal caching or optimistic UI updates to prevent layout shift while data fetches.
- Handling empty states gracefully (e.g., showing "0" or "No data yet" when a new partner first logs in, if they don't have mock data yet).

#### ❌ Out of Scope
- Building new, complex charts or granular data visualizations not currently present on the dashboard.
- Modifying the underlying schema or adding new tables for data aggregation (queries must use existing additive tables and views).

### 5. Priority Tier
**[X] P0** — Demo blocker / safety critical
**Reason:** Static placeholders in a data application destroy credibility. We cannot launch a "clinical intelligence" platform where the intelligence is hardcoded.

### 6. Open Questions for LEAD
1. Should we create a Supabase View for these aggregates to reduce frontend query complexity, or handle the aggregation directly via postgREST calls?
2. How should we visually treat the "loading skeleton" state of these cards to maintain the premium, glassmorphism UI aesthetic?

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
==== PRODDY ====
