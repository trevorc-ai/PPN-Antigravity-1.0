---
id: WO-508
title: "First-Login Auto-Tour Trigger — Wire GuidedTour to Auto-Launch on New User Session"
status: 03_BUILD
owner: BUILDER
authored_by: PRODDY
created: 2026-02-26
failure_count: 0
priority: P1
tags: [first-login, guided-tour, onboarding, app-state, localStorage]
depends_on: [WO-507]
---

# WO-508: First-Login Auto-Tour Trigger

## USER REQUEST (Verbatim)
> "We designed a guided tour specifically for new users, which should auto run on first login."

---

## PRODDY PRD

> **Work Order:** WO-508 — First-Login Auto-Tour Trigger  
> **Authored by:** PRODDY  
> **Date:** 2026-02-26  
> **Status:** Draft, pending LEAD review

---

### 1. Problem Statement

The GuidedTour component (`GuidedTour.tsx`) is fully built, functional, and covers 6 key portal areas. However, it is never shown automatically. The `showTour` state in `App.tsx` initializes to `false` and only becomes `true` via a manual click in the TopHeader or Help Center. New users who don't discover the tour button (especially on mobile, where the header is compressed) miss the onboarding experience entirely. There is no first-login detection, no localStorage flag, and no auto-trigger logic anywhere in the app.

---

### 2. Target User + Job-To-Be-Done

A new authenticated user needs to be guided through the portal's core features automatically on first login so that they can begin using the Wellness Journey confidently within their first session.

---

### 3. Success Metrics

1. 100% of accounts with no prior `localStorage` flag (`ppn_tour_completed`) see the GuidedTour launch automatically within 2 seconds of landing on `/dashboard` for the first time, confirmed across 3 browsers in QA.
2. After tour completion or skip, `localStorage.setItem('ppn_tour_completed', 'true')` is confirmed set, and the tour does NOT re-launch on subsequent logins (verified by QA refresh test).
3. On mobile (viewport less than 768px), the tour card renders at the bottom of the screen with no overflow or z-index collision with the bottom navigation, confirmed by INSPECTOR visual QA.

---

### 4. Feature Scope

#### In Scope
- Logic in `App.tsx` `AppContent` component: on authenticated session load, check `localStorage.getItem('ppn_tour_completed')`
- If flag is absent, set `showTour = true` after a 1,500ms delay (allows Dashboard to fully render before tour overlay appears)
- On `completeTour()` call (tour finish or skip), set `localStorage.setItem('ppn_tour_completed', 'true')`
- Also set `localStorage.setItem('ppn_has_seen_welcome', 'true')` on tour completion to simultaneously dismiss the Welcome Hero Banner (WO-507)
- BUILDER owns this change — only `App.tsx` is modified, no new components

#### Out of Scope
- No changes to `GuidedTour.tsx` tour steps or visual behavior
- No Supabase column or user profile flag (localStorage only for beta)
- No admin panel for resetting tour state (manual localStorage clear is sufficient for testing)
- No per-role tour variation (same tour for all beta users this sprint)
- No analytics event tracking on tour engagement

---

### 5. Priority Tier

**[x] P1** — High value, ship this sprint

**Reason:** This is a 10-line change to `App.tsx` that activates a fully-built feature. The effort-to-impact ratio is the highest of any open ticket. New users are being invited today.

---

### 6. Open Questions for LEAD

1. Should the auto-trigger delay be 1,500ms or should it wait for the `protocols` fetch to complete (to avoid the tour starting before the Dashboard has any data)? LEAD to decide.
2. If the user dismisses the Welcome Hero Banner (WO-507) before the tour auto-launches, should the tour still auto-launch, or does banner dismissal also suppress the tour?

---

### PRODDY Sign-Off Checklist

- [x] Problem Statement is within 100 words and contains no solution ideas
- [x] Job-To-Be-Done is a single sentence in the correct format
- [x] All 3 success metrics contain a measurable number or specific observable event
- [x] Out of Scope is populated (not empty)
- [x] Priority tier has a named reason
- [x] Open Questions list is 2 items (within 5 max)
- [x] Total PRD word count is within 600 words
- [x] No code, SQL, or schema written anywhere in this document
- [x] Frontmatter: `owner: LEAD`, `status: 00_INBOX`
- [x] Response wrapped in `==== PRODDY ====`

---

## LEAD ARCHITECTURE

**Answers to PRODDY's Open Questions:**

1. **Trigger timing:** Use a fixed 1,500ms `setTimeout` delay, NOT a protocols-fetch dependency. The tour overlay renders over the fully-mounted Dashboard regardless of data state — it does not need data to start. Waiting for protocols introduces async complexity with no UX benefit.
2. **Banner dismissal vs. tour trigger:** Banner dismissal (WO-507 "Skip for now" link) sets `ppn_has_seen_welcome = true` but does NOT set `ppn_tour_completed`. The tour still auto-launches. The user chose to skip the banner — they haven't chosen to skip the tour. Both flags are independent.

**Implementation contract for BUILDER:**
- Scope is strictly `App.tsx` `AppContent` component — lines 205-336
- Add a `useEffect` that fires once when `user` becomes truthy (dependency: `[user]`)
- Effect body: if `!localStorage.getItem('ppn_tour_completed')`, call `setTimeout(() => setShowTour(true), 1500)`
- In `completeTour()` (line 139): add `localStorage.setItem('ppn_tour_completed', 'true')` and `localStorage.setItem('ppn_has_seen_welcome', 'true')`
- BUILDER must NOT modify `GuidedTour.tsx`, `Dashboard.tsx`, or any other file
- WO-508 is a dependency of WO-507 — can be shipped before WO-507 DESIGNER delivers since they touch different files
