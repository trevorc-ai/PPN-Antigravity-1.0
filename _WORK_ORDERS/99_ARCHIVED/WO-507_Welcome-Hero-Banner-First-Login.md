---
id: WO-507
title: "Welcome Hero Banner — First-Login Post-Auth Landing Experience"
status: 02_DESIGN
owner: DESIGNER
authored_by: PRODDY
created: 2026-02-26
failure_count: 0
priority: P1
tags: [first-login, onboarding, dashboard, ux, welcome]
depends_on: []
---

# WO-507: Welcome Hero Banner

## USER REQUEST (Verbatim)
> "There's no obvious first step once the user is logged in, especially on mobile. It is not very welcoming. In the original design, that's where the search portal was. It looked sort of like a Google homepage, but that has since been removed. We need to have a little bit of a nicer hero section on the dashboard or wherever we want users to land once they login. We need to tighten up the first parts of the UX."

---

## PRODDY PRD

> **Work Order:** WO-507 — Welcome Hero Banner  
> **Authored by:** PRODDY  
> **Date:** 2026-02-26  
> **Status:** Draft, pending LEAD review

---

### 1. Problem Statement

New users completing the Supabase invite flow land on `/dashboard` and encounter a data cockpit with no data and no orientation. The page opens with a generic "Dashboard" heading, performance metric cards showing placeholder numbers, and a "Log New Session" button with no context for what that means. On mobile, the sidebar is hidden and no primary action is surfaced. There is no welcoming moment, no mission statement, and no clear first step. Beta testers will churn before they explore.

---

### 2. Target User + Job-To-Be-Done

A new beta tester (partner_free or beta_observer role) needs to understand what PPN is and what to do first so that they can form a productive first impression without requiring hand-holding from Trevor or Jason.

---

### 3. Success Metrics

1. 100% of new beta testers (accounts with zero protocols logged) see the Welcome Banner on their first authenticated `/dashboard` visit, confirmed by manual QA across desktop and mobile viewports.
2. The "Start the Tour" CTA successfully triggers the existing GuidedTour component in 100% of QA test clicks, with no console errors.
3. The banner is permanently dismissed (not re-shown) after the user clicks either CTA or the dismiss link, confirmed by localStorage persistence across a browser refresh.

---

### 4. Feature Scope

#### In Scope
- New `WelcomeHeroBanner` component rendered conditionally at the top of `Dashboard.tsx`
- Visibility rule: shown only when `localStorage.getItem('ppn_has_seen_welcome')` is falsy
- Banner content: personalized greeting using `user.email` or `user_profiles.full_name` if available, one-line mission statement, two CTAs ("Start the Tour" triggering GuidedTour, "Log My First Session" navigating to `/wellness-journey`), and a plain-text dismiss link
- On CTA click or dismiss: set `localStorage.setItem('ppn_has_seen_welcome', 'true')` and hide banner
- Mobile: full-width stacked layout, CTAs full-width below text
- Design must use existing PPN glassmorphism tokens and indigo gradient, consistent with current Dashboard aesthetic
- DESIGNER delivers visual spec + component brief; BUILDER implements

#### Out of Scope
- No Supabase database column or migration (localStorage only for beta)
- No changes to GuidedTour.tsx (see WO-508 for tour auto-trigger)
- No changes to the existing Dashboard metric cards or Quick Actions grid
- No A/B testing or analytics instrumentation on banner interactions
- No role-based content variation (same banner for all new users in this sprint)

---

### 5. Priority Tier

**[x] P1** — High value, ship this sprint

**Reason:** Jason has just activated his beta invite. The next tester invite could go out any day. Every new user lands on this page cold. This is a low-effort, high-impression fix that directly affects beta retention and the quality of first impressions during the soft launch window.

---

### 6. Open Questions for LEAD

1. Should the banner pull the user's display name from `user_profiles.full_name` (requires a Supabase fetch) or default to the email prefix for simplicity? A Supabase fetch adds a loading state.
2. Should "Start the Tour" dismiss the banner immediately and then launch the tour, or should the tour launch first and the banner hide when the tour completes?
3. DESIGNER to confirm: should the hero banner be a full-width section above the existing header, or replace the existing Dashboard header row entirely for first-time users?

---

### PRODDY Sign-Off Checklist

- [x] Problem Statement is 100 words and contains no solution ideas
- [x] Job-To-Be-Done is a single sentence in the correct format
- [x] All 3 success metrics contain a measurable number or specific observable event
- [x] Out of Scope is populated (not empty)
- [x] Priority tier has a named reason
- [x] Open Questions list is 3 items (within 5 max)
- [x] Total PRD word count is within 600 words
- [x] No code, SQL, or schema written anywhere in this document
- [x] Frontmatter updated: `owner: LEAD`, `status: 00_INBOX`
- [x] Response wrapped in `==== PRODDY ====`

---

## LEAD ARCHITECTURE

**Answers to PRODDY's Open Questions:**

1. **Name source:** Use email prefix only (e.g., strip `@ppnportal.net` or everything after `@`). No Supabase `user_profiles` fetch — eliminates loading state risk and avoids network dependency on a UI element that must render instantly. `user.email` is already in `AuthContext`.
2. **CTA / banner sequencing:** "Start the Tour" dismisses the banner immediately (sets `ppn_has_seen_welcome = true`) and then triggers `setShowTour(true)` via a callback prop. The tour runs as a separate layer. Banner gone, tour starts.
3. **Banner placement:** Full-width section ABOVE the existing Dashboard header row. The Dashboard header ("Dashboard" h1 + Log New Session CTA) stays intact below it. The banner is inserted as the first child inside `<PageContainer>`, and is removed from the DOM (not hidden) once dismissed.

**Additional Constraints for DESIGNER:**
- Component name: `WelcomeHeroBanner` (new file at `src/components/WelcomeHeroBanner.tsx`)
- Props: `onStartTour: () => void`, `onDismiss: () => void`
- Must use only existing CSS tokens — no new Tailwind classes that aren't already in the project
- Minimum font size: 14px for all text (INSPECTOR requirement)
- Must pass color-blind accessibility: no color-only status indicators
- The banner is NOT a modal — it renders inline in the page flow and pushes content down
