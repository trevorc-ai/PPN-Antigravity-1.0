---
id: WO-575
title: "Landing Page — Full Mobile Optimization Sprint"
owner: LEAD
status: 99_COMPLETED
authored_by: PRODDY
priority: P1
target_file: src/pages/Landing.tsx
date: 2026-03-06
---

==== PRODDY ====

## PRODDY PRD

> **Work Order:** WO-575 — Landing Page Full Mobile Optimization Sprint
> **Authored by:** PRODDY
> **Date:** 2026-03-06
> **Status:** 99_COMPLETED

---

### 1. Problem Statement

The public landing page (`Landing.tsx`) renders poorly on mobile devices and loads slowly. The Frankenstein Stack sticky-scroll graphic has required manual hotfixes three times, indicating a structural layout problem, not a one-off bug. The page uses heavy framer-motion parallax, `useScroll` transforms, three live demo chart components, and a StarField canvas — none of which are deferred or conditionally disabled on low-capability devices. No copy, headings, or graphic content may change.

---

### 2. Target User + Job-To-Be-Done

A prospective practitioner visiting the landing page on a mobile device needs to experience a fast, smooth, visually complete page so that they form a positive first impression and click "Join the Waitlist."

---

### 3. Success Metrics

1. Vercel Lighthouse mobile performance score reaches ≥ 80 on the production landing page URL within one deploy of this ticket shipping.
2. The Frankenstein Stack sticky graphic renders without clipping or compression at viewport widths 375px, 390px, and 430px across 5 consecutive manual QA passes with zero layout failures.
3. First Contentful Paint (FCP) on a throttled mobile connection (Slow 4G) drops below 3.0 seconds, measured in Chrome DevTools.

---

### 4. Feature Scope

#### ✅ In Scope

- **Performance:** Lazy-load the three demo chart components (`SafetyRiskMatrixDemo`, `ClinicRadarDemo`, `PatientJourneyDemo`) using `React.lazy` + `Suspense` with a pulse skeleton fallback — these are below the fold and should not block initial render.
- **Performance:** Conditionally disable the `useScroll` + `useTransform` parallax on the Frankenstein Stack section for `prefers-reduced-motion` and on viewport widths below `lg` (`< 1024px`), where sticky-scroll has no scroll track and causes the rendering failures.
- **Performance:** Audit StarField canvas render loop — cap frame rate on mobile (`devicePixelRatio <= 1`) or replace with a static CSS star gradient on small viewports.
- **Touch targets:** Apply the `/optimize-mobile` workflow Thumb-Zone pass to the Hero CTA buttons and nav bar Sign In button — verify `min-h-[44px]` compliance.
- **Kinetic transitions:** Add `transition-all duration-300 ease-in-out` to the marquee section pills and any `hover:` states that currently snap instantly.
- **Frankenstein Stack structural fix:** Replace `sticky` + `useTransform` on the right graphic column with a standard `relative` block on mobile (`lg:sticky`). This eliminates the scroll-track dependency that causes the three-peat clipping bug.

#### ❌ Out of Scope

- No changes to heading text, body copy, taglines, or CTAs.
- No changes to the graphic's visual design (icons, colors, card layout, brain node).
- No changes to the chart data or demo component logic.
- No new sections, features, or analytics added to the page.
- No changes to `StarField.tsx` logic beyond a mobile cap — do not redesign the component.
- No changes to any other page that imports `Landing.tsx` components.

---

### 5. Priority Tier

**[x] P1** — High value, ship this sprint

**Reason:** The landing page is the primary conversion surface for the waitlist and the first page shown during demos. Three hotfixes on the same component in one sprint is a signal of structural debt, not a cosmetic issue. The slow mobile load time directly reduces conversion probability on mobile-first prospects.

---

### 6. Open Questions for LEAD

1. Should `StarField` be fully disabled on mobile (replaced with a static CSS gradient) or just frame-rate capped? The canvas may contribute meaningfully to the premium feel even on mobile.
2. Is `React.lazy` safe to use for the three demo components, or is there a bundler constraint that requires a different code-splitting approach?
3. The `/optimize-mobile` workflow requires a BUILDER handoff snippet per section — should BUILDER produce one combined `SURGICAL_PLAN.md` for the full page, or one snippet per section?

---

### PRODDY Sign-Off Checklist

- [x] Problem Statement is ≤100 words and contains no solution ideas
- [x] Job-To-Be-Done is a single sentence in the correct format
- [x] All 3 success metrics contain a measurable number or specific observable event
- [x] Out of Scope is populated (not empty)
- [x] Priority tier has a named reason
- [x] Open Questions list is ≤5 items (3 listed)
- [x] Total PRD word count is ≤600 words
- [x] No code, SQL, or schema written anywhere in this document
- [x] Frontmatter updated: `owner: LEAD`, `status: 00_INBOX`
- [x] Response wrapped in `==== PRODDY ====`

==== PRODDY ====

---
## INSPECTOR QA Sign-off
**Date:** 2026-03-11
**Verdict:** APPROVED. Code fixes verified on main branch.
