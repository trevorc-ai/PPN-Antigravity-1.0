---
id: WO-532
title: "Google-Style Search Portal — Post-Login Home + Sidebar Placement"
status: 01_TRIAGE
owner: LEAD
authored_by: PRODDY
created: 2026-03-01T01:31:00-08:00
failure_count: 0
priority: P1
source_spec: WO-510 (archived)
tags: [search, post-login, landing, navigation, ux, sidebar]
---

## User Request (Verbatim)

> "https://ppnportal.net/#/search is the starting point at login, but doesn't have the 'Google-style' search portal as discussed in a previous work order, per Proddy specs. Also needs a link on the Sidebar."
>
> Follow-up: "Put 'Search' at the Top spot above Dashboard"

---

## PRODDY PRD

> **Work Order:** WO-532 — Google-Style Search Portal (updated from WO-510 archived spec)
> **Authored by:** PRODDY
> **Date:** 2026-03-01
> **Source:** WO-510 PRODDY PRD + LEAD architecture (archived) + new sidebar requirement

---

### 1. Problem Statement

The `/search` route is the authenticated post-login landing page, but it renders no search UI. Users arrive to a blank or placeholder experience with no obvious first action. The original Google-style search portal was specified in WO-510 and partially routed but never built. The result is that every authenticated user, including active beta testers, lands with no clear entry point and no navigation shortcut in the sidebar. First impressions are permanently damaged for anyone who has already logged in.

---

### 2. Target User + Job-To-Be-Done

A returning or new authenticated practitioner needs an immediate, obvious starting point after login so that they can find any part of the platform within one keystroke, without opening the sidebar or guessing at navigation.

---

### 3. Success Metrics

1. 100% of authenticated users who navigate to `/search` see a rendered search bar, quick-link chips, and inline results on type — confirmed across desktop and mobile in QA.
2. Typing any of the 13 keyword-map terms produces at least one inline result card within 200ms, with zero network requests (client-side only), confirmed via browser DevTools Network tab in QA.
3. "Search" nav item appears at position #1 in the sidebar (above Dashboard) and is active/highlighted when the user is on `/search`, confirmed by visual QA screenshot.

---

### 4. Feature Scope

#### In Scope
- **`SimpleSearch.tsx` full rebuild** per WO-510 LEAD architecture: WelcomeHeroBanner (conditional, first-login only) → centered search bar → inline results (appear as user types, client-side keyword map) → quick-link chips
- **Inline results:** Each result is a card with page name, one-line description, and navigate arrow. No separate results page. On Enter or click, route to the best-match page
- **Keyword map minimum entries** (per WO-510 LEAD): ketamine, psilocybin, mdma, ibogaine, interaction, contraindication, patient, session, protocol, analytics, report, help, settings
- **Quick-link chips** (per WO-510 LEAD): Interaction Checker (`/interactions`), Wellness Journey (`/wellness-journey`), Substance Catalog (`/catalog`), Clinical Analytics (`/analytics`)
- **Sidebar nav item:** Add "Search" as the top item in the sidebar nav, above Dashboard, using the existing nav item pattern. Icon: `Search` (lucide). Route: `/search`
- **Remove placeholder stats row** from current `SimpleSearch.tsx` if present

#### Out of Scope
- No backend search API, Supabase query, or AI/LLM integration
- No `/advanced-search` results page
- No changes to `Dashboard.tsx` layout or metric cards
- No search history, saved searches, or autocomplete from user data
- No changes to `App.tsx` default route (route is already `/search` per user confirmation)

---

### 5. Priority Tier

**P1** — High value, ship this sprint. The `/search` route is already the post-login default per the user. It simply renders nothing useful. Every active beta tester hits a blank page as their home screen. This is not a deferred polish item; it is a live first-impression failure during active beta.

---

### 6. Open Questions for LEAD

1. `WelcomeHeroBanner` — WO-507 was archived. Is `WelcomeHeroBanner.tsx` still present and functional in `src/`? If not, should BUILDER skip it entirely or stub a simple first-login greeting?
2. The `onStartTour` prop on WelcomeHeroBanner requires tour state from `ProtectedLayout`. Confirm whether BUILDER should add an `onStartTour` prop to `SimpleSearch` and wire it through the route, or omit tour wiring entirely for this ticket.
3. Which sidebar file owns the nav item list? (`Sidebar.tsx`, `Navigation.tsx`, or other — LEAD to confirm exact filename before routing to BUILDER.)

---

### PRODDY Sign-Off Checklist

- [x] Problem Statement is within 100 words and contains no solution ideas
- [x] Job-To-Be-Done is a single sentence in the correct format
- [x] All 3 success metrics contain a measurable number or specific observable event
- [x] Out of Scope is populated with 5 explicit exclusions
- [x] Priority tier has a named reason with explicit evidence of active beta risk
- [x] Open Questions list is 3 items (within 5 max)
- [x] Total PRD word count is within 600 words
- [x] No code, SQL, or schema written anywhere in this document
- [x] Frontmatter: `owner: LEAD`, `status: 01_TRIAGE`
- [x] Compatible with WO-510 archived LEAD architecture decisions
- [x] New sidebar requirement incorporated as in-scope item

---

✅ WO-532 updated in `00_INBOX`. LEAD action needed: answer 3 Open Questions, confirm sidebar file, then route to BUILD.

==== PRODDY ====
