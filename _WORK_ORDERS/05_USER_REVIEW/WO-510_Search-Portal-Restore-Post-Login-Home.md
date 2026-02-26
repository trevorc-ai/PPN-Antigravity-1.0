---
id: WO-510
title: "Search Portal Restore — Post-Login Home with Inline Results Bridge"
status: 03_BUILD
owner: BUILDER
authored_by: PRODDY
created: 2026-02-26
failure_count: 0
priority: P0
tags: [search, post-login, landing, onboarding, navigation, ux]
depends_on: [WO-507, WO-508]
---

# WO-510: Search Portal Restore

## USER REQUEST (Verbatim)
> "The starting point was always the search portal. I agree with you, as long as we don't make it technically complicated to implement this. The application is already sophisticated enough, so let's keep it simple. My vision is, at the most, a simple search portal that returns a combination of the neural engine and maybe links to the other pages. I think that's a great bridge to the other pages too because then the user doesn't have to make very many decisions."

---

## PRODDY PRD

> **Work Order:** WO-510 — Search Portal Restore  
> **Authored by:** PRODDY  
> **Date:** 2026-02-26  
> **Status:** Draft, pending LEAD review

---

### 1. Problem Statement

New users land on `/dashboard` after login, a metrics-heavy cockpit that assumes prior context and data. There is no clear first action, especially on mobile. The original search portal, which served as the post-login home and gave users an immediate, obvious entry point into the clinical database, was removed when its results page became unusable. The search interface itself was never the problem. Without a clear front door, beta testers must navigate before they can explore, adding friction before any value is delivered.

---

### 2. Target User + Job-To-Be-Done

A new or returning authenticated user needs a single, obvious starting point after login so that they can immediately begin finding clinical information without navigating a complex dashboard first.

---

### 3. Success Metrics

1. 100% of authenticated users land on `/search` as their first post-login page, confirmed by QA across desktop and mobile viewports, with zero redirects to `/dashboard` on fresh login.
2. A user typing any query into the search bar sees at least 3 relevant page links as inline results within 200ms, with no network request required (client-side routing only).
3. The WelcomeHeroBanner (WO-507) renders correctly above the search bar on first login and is absent on all subsequent visits, confirmed by localStorage flag check in QA.

---

### 4. Feature Scope

#### In Scope
- Change the authenticated default route in `App.tsx` from `/dashboard` to `/search`
- Rebuild `SimpleSearch.tsx` as a clean, production-quality page, removing placeholder stats and dead `/advanced-search` route references
- Inline search results: as the user types, show a list of relevant internal page links below the search bar, matched client-side by keyword against a curated map of pages (Substance Catalog, Interaction Checker, Wellness Journey, Analytics, Protocol Builder, Help)
- Results presentation: simple, scannable cards, each with a page name, one-line description, and a navigate arrow, no separate results page required
- Quick-link chips below the search bar remain: Interaction Checker, Wellness Journey, Substance Catalog, Analytics, these replace the current placeholder links
- WelcomeHeroBanner (WO-507) mounts at the top of `/search` on first login, not on `/dashboard`
- Mobile: full-width search bar, stacked chips, banner above, no sidebar dependence
- The Dashboard remains reachable via sidebar nav, it is no longer the post-login default

#### Out of Scope
- No backend search API, no Supabase query, no AI/LLM integration this sprint (client-side keyword routing only)
- No `/advanced-search` results page rebuild (separate backlog ticket)
- No changes to the Dashboard layout or its metric cards
- No changes to the Sidebar navigation order
- No search history, saved searches, or autocomplete from user data

---

### 5. Priority Tier

**[x] P0** — Demo blocker / first impression critical

**Reason:** Beta testers are being invited now. Jason has his invite. Every new login lands on the wrong page. This is the first thing a tester sees after clicking the magic link, and it currently communicates nothing about what PPN does or how to use it. This is a P0 first-impression failure during an active beta window, not a deferred polish item.

---

### 6. Open Questions for LEAD

1. The current `SimpleSearch.tsx` navigates to `/advanced-search?q=...` on submit, which does not exist as a clean page. Should BUILDER replace that navigation with a filtered scroll-to-results within the same page, or route to the most relevant page based on keyword matching?
2. Should the `/dashboard` route redirect existing bookmarks and direct links, or simply no longer be the default without changing the route itself?
3. WO-507 banner is currently partially built targeting `Dashboard.tsx`. Does BUILDER update `Dashboard.tsx` to remove banner wiring, and add it to `SimpleSearch.tsx` instead, or is WO-507 scope fully redirected to the search page?

---

### PRODDY Sign-Off Checklist

- [x] Problem Statement is within 100 words and contains no solution ideas
- [x] Job-To-Be-Done is a single sentence in the correct format
- [x] All 3 success metrics contain a measurable number or specific observable event
- [x] Out of Scope is populated (not empty)
- [x] Priority tier has a named reason with explicit evidence of active beta risk
- [x] Open Questions list is 3 items (within 5 max)
- [x] Total PRD word count is within 600 words
- [x] No code, SQL, or schema written anywhere in this document
- [x] Frontmatter: `owner: LEAD`, `status: 00_INBOX`
- [x] Response wrapped in `==== PRODDY ====`

---

## LEAD ARCHITECTURE

**Answers to PRODDY's Open Questions:**

1. **Search action:** No separate page. Results render inline below the search bar as the user types. Client-side keyword map routes each query to the single best-match page on Enter or result-click. No network request. Keyword map is a static array defined inside `SimpleSearch.tsx` and covers: substances (Catalog/Monograph), interactions, wellness/patient, analytics/reporting, protocol, and help.
2. **Dashboard route:** `/dashboard` route is unchanged. Only `App.tsx` line 237 changes: `<Navigate to="/dashboard" replace />` becomes `<Navigate to="/search" replace />`. Existing bookmarks and sidebar links to `/dashboard` continue to work.
3. **WO-507 banner relocation:** `WelcomeHeroBanner.tsx` is already built and correct. BUILDER imports and mounts it at the top of `SimpleSearch.tsx` using the same localStorage flag (`ppn_has_seen_welcome`). The partial Dashboard.tsx wiring BUILDER started is never completed, nothing to undo. WO-507 is now effectively merged into WO-510 scope.

**Full BUILDER implementation contract:**
- Files modified: `App.tsx` (1 line), `SimpleSearch.tsx` (full rebuild)
- Files NOT modified: `Dashboard.tsx`, `GuidedTour.tsx`, `TopHeader.tsx`, `WelcomeHeroBanner.tsx`
- `SimpleSearch.tsx` structure: WelcomeHeroBanner (conditional) > Search bar > Inline results (appear on type) > Quick-link chips > No stats row (remove placeholder numbers)
- Quick-link chips: Interaction Checker (`/interactions`), Wellness Journey (`/wellness-journey`), Substance Catalog (`/catalog`), Clinical Analytics (`/analytics`)
- Keyword routing map minimum entries: ketamine, psilocybin, mdma, ibogaine, interaction, contraindication, patient, session, protocol, analytics, report, help, settings
- `onStartTour` prop on WelcomeHeroBanner must call `setShowTour(true)` — requires tour state lifted or a callback prop passed down from the App-level. BUILDER to confirm how `setShowTour` is accessible from within `SimpleSearch.tsx` given it lives in `ProtectedLayout`. If not directly accessible, add an `onStartTour` prop to `SimpleSearch` component and wire it through the route.
