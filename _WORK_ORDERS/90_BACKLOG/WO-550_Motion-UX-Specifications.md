---
owner: LEAD
status: 00_INBOX
authored_by: PRODDY
---

==== PRODDY ====

## PRODDY PRD

> **Work Order:** WO-550 — Motion UX Specifications (2026 UI)
> **Authored by:** PRODDY  
> **Date:** 2026-03-05  
> **Status:** Draft → Pending LEAD review  

---

### 1. Problem Statement
The current PPN portal feels static and disconnected, causing high cognitive load. Practitioners lack immediate tactile feedback on critical actions, and data-loading states use anxiety-inducing spinners rather than context-aware progressive disclosure. Without fluid z-axis depth and liquid motion, the 2026 UI redesign feels like a flat document rather than an intelligent, responsive clinical tool, reducing user trust and engagement.

---

### 2. Target User + Job-To-Be-Done
A licensed practitioner needs fluid, predictive system feedback when navigating the portal so that they can process clinical insights without perceived latency or cognitive friction.

---

### 3. Success Metrics
1. Interaction latency (time from click to visual feedback) measures < 50ms across all primary CTAs.
2. 100% of data-loading states use sequential skeleton shimmers instead of circular spinners.
3. 100% of spatial transitions automatically disable into 150ms opacity fades when `prefers-reduced-motion` is detected by the OS.

---

### 4. Feature Scope

#### ✅ In Scope
- Hover/Click logic for primary CTAs (liquid expansion, 250ms max duration, spring easing).
- Spatial depth transitions (z-axis scaling) between Landing, Search, Welcome, Dashboard, and Analytics views.
- Context-aware sequential skeleton shimmers for data-heavy components (e.g., Analytics Bento Grid).
- Accessible fallbacks (opacity cross-fades) for users with reduced motion.
*(Detailed animation specs attached in external `motion_ux_specs.md` artifact to maintain PRD length limits).*

#### ❌ Out of Scope
- Rebuilding the underlying Supabase data fetching logic or altering the React component data structures.
- Writing the CSS/Framer Motion implementation code (BUILDER owns execution).
- Designing new static UI layouts.

---

### 5. Priority Tier

**[X] P1** — High value, ship this sprint  

**Reason:** The new 2026 visual concepts require motion to achieve their intended "weightless" aesthetic; static implementation will fundamentally undermine the redesign's core value and architectural intent.

---

### 6. Open Questions for LEAD

1. Should we standardize on Framer Motion or pure CSS keyframes with Tailwind `animate-*` classes for the z-axis depth transitions?
2. Do we have a global context provider set up to detect `prefers-reduced-motion` across all components, or should we rely on Tailwind `motion-reduce:` modifiers?
3. Should transition states block user input completely, or allow interruptible animations for power users?

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
