==== PRODDY ====
---
owner: LEAD
status: 00_INBOX
authored_by: PRODDY
priority: P1
created: 2026-03-06
---

## PRODDY PRD

> **Work Order:** WO-559 — Public Promotional Landing Page (ppn.app)
> **Authored by:** PRODDY  
> **Date:** 2026-03-06
> **Status:** Draft → Pending LEAD review  

---

### 1. Problem Statement

Currently, the PPN Portal lacks a unified, public-facing marketing presence to explain the platform's value to prospective practitioners, clinics, and partners. The existing showcase and partner preview HTML files are disconnected and lack a centralized narrative. Without a single, high-converting public landing page (e.g., resolving to the proposed ppn.app domain), it is difficult to promote the platform's Zero-PHI architecture, clinical intelligence, and network benefits to a broader audience, limiting organic growth and referral conversions.

---

### 2. Target User + Job-To-Be-Done

A prospective psychedelic therapy practitioner needs to quickly understand the core value, privacy guarantees, and clinical benefits of the PPN Portal so that they can confidently sign up for a 14-day free trial or beta access.

---

### 3. Success Metrics

1. The public landing page achieves a minimum 5% conversion rate from unique visitor to free trial/beta signup within the first 30 days of launch.
2. Core Web Vitals (specifically Largest Contentful Paint) clock in at under 1.5 seconds on mobile devices to prevent bounce-outs before the value proposition renders.
3. 100% of the core messaging and interactive elements from the existing `public/` HTML showcase assets are successfully consolidated or connected to the new unified landing experience.

---

### 4. Feature Scope

#### ✅ In Scope

- A responsive, public-facing landing page acting as the main "front door" to the PPN Portal.
- High-converting Hero section with a clear value proposition and primary CTA ("Start 14-Day Free Trial").
- Feature highlight sections integrating concepts from the existing showcase files (Zero-PHI Phantom Shield, Interaction Checker, Search Portal, Benchmark Dashboard).
- Social proof, trust badges (Clinical-grade, Zero-PHI), and an objection-handling FAQ section.
- Proper SEO-friendly meta tags and semantic HTML structure to drive organic discovery.

#### ❌ Out of Scope

- Marketing email campaign automation or external CRM integrations.
- Changes or feature additions to the internal authenticated PPN Portal application.
- Complex multi-page marketing sites (this is a single, hard-hitting landing page).

---

### 5. Priority Tier

**[x] P1** — High value, ship this sprint  

**Reason:** The product has reached a level of maturity where network growth is the primary driver of value. Without a unified public "front door" to promote the platform to all audiences and capture leads, the network effect cannot scale.

---

### 6. Open Questions for LEAD

1. Should this landing page be built within the existing React SPA (and served conditionally via public routing), or as a entirely separate repository/framework (e.g., Next.js) for optimal SEO?
2. Should the existing `html` showcase files in `/public` be directly rewritten into React components for this landing page, or linked/iframed as standalone interactive demos?
3. Are we explicitly deploying this to the `ppn.app` domain immediately, thus requiring DNS and SSL routing setup in the build phase?
4. Do we need a lightweight capture form (e.g., "Join Waitlist" / "Request Beta") or direct integration into the existing authentication sign-up flow?

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
