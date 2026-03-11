==== PRODDY ====
---
owner: BUILDER
status: 99_COMPLETED
authored_by: PRODDY
architected_by: LEAD
---

> [!NOTE]
> **LEAD Resolution: Conflict with WO-537 — Option B Selected**
> WO-585 ships as a **narrow, immediate beta welcome screen** scoped to this 10-person cohort. WO-537 remains in backlog as the future audience-segmented front door system (multi-market). These do not conflict: WO-585 is a single route for a single purpose; WO-537 is a broader marketing architecture. BUILDER must NOT merge them.

---

## LEAD Architecture Decisions

**Q1 — Benchmark count:** Hardcode as `"1,500+"` for V1. Dynamic DB query is overkill for this sprint; update the string manually when count changes materially.

**Q2 — Existing component:** The `Landing.tsx` hero section and `Phantom Shield` glassmorphism style are the closest references. BUILDER starts from scratch but inherits the design system tokens — no component reuse required.

**Q3 — Nav exclusion:** YES. `/beta-welcome` must be added as a **public route** in `App.tsx` (alongside `/landing`, `/about`, etc.) and must NOT appear in the authenticated sidebar navigation. No auth check required to render this page.

**Routing note:** App uses `HashRouter`. New route: `<Route path="/beta-welcome" element={<BetaWelcome />} />` in the Public Routes block. URL param: `?name=FirstName` read via `useSearchParams()`.

---

## PRODDY PRD

> **Work Order:** WO-585 — Beta Welcome Screen  
> **Authored by:** PRODDY  
> **Date:** 2026-03-09  
> **Status:** 99_COMPLETED

---

### 1. Problem Statement

When a beta invitee receives a magic link and enters the PPN Portal for the first time, they land cold — no orientation, no narrative, no emotional framing. Without a purpose-built entry screen, first impressions are determined by whatever page loads by default. For a small, high-stakes audience of 10 partners, advisors, and clinicians, a cold landing is a missed opportunity to establish credibility and set the right context before they explore.

---

### 2. Target User + Job-To-Be-Done

A beta invitee (partner, advisor, or clinician) needs to land on a page that immediately communicates exclusivity and orients them to what they're about to see so that they enter the analytics view primed for impact rather than confused about where they are.

---

### 3. Success Metrics

1. 100% of beta invitees (10/10) successfully navigate from the welcome screen to the analytics view within 30 seconds of landing, verified via session logs.
2. Zero support messages received citing confusion about where to go or what the platform is, across the full beta cohort.
3. Welcome screen renders fully in < 1.5 seconds on both mobile and desktop across 10 consecutive QA sessions.

---

### 4. Feature Scope

#### ✅ In Scope

- New route: `/beta-welcome` — a standalone, full-screen landing page requiring no authentication to render.
- Personalized greeting via URL query param: `?name=Trevor` → renders "Welcome, Trevor."
- A single stat callout: dynamic display of the current benchmark record count (e.g., "1,500+ anonymized clinical records. Growing daily.").
- Primary CTA button: **"Enter the Network"** → routes to `/analytics`.
- PPN branding, glassmorphism aesthetic, consistent with platform design system.
- Mobile responsive.

#### ❌ Out of Scope

- Authentication or session management — this screen is pre-auth.
- Role-based routing (all invitees go to analytics; no branching logic at this stage).
- Animated onboarding tours or multi-step walkthroughs.
- Persistent user preferences or state from this screen.
- A/B testing infrastructure.

---

### 5. Priority Tier

**[X] P1** — High value, ship this sprint  

**Reason:** Beta invitations go out within hours of benchmark data verification. The welcome screen must exist before any link is sent. A blank cold landing on first impression is unrecoverable for this cohort.

---

### 6. Open Questions for LEAD

1. Should the benchmark record count be hardcoded (e.g., "1,500+") or dynamically queried from the database on page load?
2. Is there an existing PPN glassmorphism hero/splash component we can adapt, or does BUILDER start from scratch?
3. Should the `/beta-welcome` route be excluded from the main nav so it doesn't appear in sidebar navigation for authenticated users?

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

==== PRODDY ====

---
## INSPECTOR QA Sign-off
**Date:** 2026-03-11
**Verdict:** APPROVED. Code fixes verified on main branch.
