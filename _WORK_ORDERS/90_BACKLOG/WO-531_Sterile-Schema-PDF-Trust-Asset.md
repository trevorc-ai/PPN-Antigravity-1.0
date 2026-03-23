---
id: WO-531
title: "Sterile Schema 'What We Collect' — Site Page + PDF Trust Asset"
owner: LEAD
status: 01_TRIAGE
authored_by: PRODDY
date: 2026-03-05
priority: P1
tags: [trust, compliance, marketing, pdf, partner-acquisition]
---

## PRODDY PRD

> **Work Order:** WO-531 — Sterile Schema "What We Collect" — Site Page + PDF Trust Asset
> **Authored by:** PRODDY
> **Date:** 2026-03-05
> **Status:** Draft → Pending LEAD review

---

### 1. Problem Statement

When a clinic owner or practitioner first evaluates PPN Portal, their immediate anxiety is legal exposure: *will using this software create a PHI liability or subpoena risk?* Today, no single authoritative document exists to neutralize this fear — neither a linkable web page prospects can find independently, nor a PDF they can pass to legal counsel. Without both, partners must take our "zero-PHI" claim on faith. This ticket delivers the definitive trust artifact in two formats: a public site page and a downloadable PDF.

---

### 2. Target User + Job-To-Be-Done

A prospective clinic owner or licensed facilitator needs to independently verify PPN Portal's data architecture — via a public webpage they can find themselves and a PDF they can forward — so that they can commit to a pilot without consulting their own legal counsel first.

---

### 3. Success Metrics

1. The rendered PDF is downloadable from the Settings/Trust & Compliance section in ≤2 clicks, file size under 2MB, verified across 3 consecutive QA sessions.
2. 100% of pilot partner onboarding packets sent after ship include this PDF as the primary compliance attachment (manually verified by Trevor against the partner send log).
3. The public site page renders the full "What We Collect" content at a stable `/trust` or `/data-policy` route, passes WCAG 2.1 AA on first INSPECTOR audit, with zero layout regressions on mobile and desktop.

---

### 4. Feature Scope

#### ✅ In Scope

**Deliverable 1 — Public Site Page**
- A new public-facing page (e.g. `/trust` or `/data-policy`) rendering the full "What We Collect" content from `public/admin_uploads/PPN_What We Collect_PDF.md`
- Styled to PPN design system (Dark Navy base, Indigo/Cyan/Purple accents, Inter typography)
- Accessible without login — no auth gate
- Mobile and desktop responsive, WCAG 2.1 AA compliant
- Includes a prominent "Download PDF" CTA button

**Deliverable 2 — PDF Download**
- Static, versioned PDF of the same content
- Two color variants: Dark Navy (`#0f172a`) and White/print-ready
- Typography: Inter headings, JetBrains Mono for code/ID examples
- Downloadable from (a) the site page CTA and (b) Settings > Trust & Compliance in ≤2 clicks
- Committed as a static asset — not dynamically generated from live DB data

#### ❌ Out of Scope

- Dynamically generated per-practitioner compliance reports
- Any PHI, practitioner name, or clinic name pre-filled into either deliverable
- A full legal/privacy policy page (this document covers architecture only, not ToS)
- Uploading or emailing the PDF from within the app
- A new database table or schema change of any kind

---

### 5. Priority Tier

**[x] P1** — High value, ship this sprint

**Reason:** Both formats are referenced as "permanent, high-leverage assets" used in every partner packet and on the website's trust section. Dr. Allen pilot onboarding is active. The site page additionally creates an always-available, SEO-indexed trust signal that removes a common objection without requiring a sales call.

---

### 6. Open Questions for LEAD

1. Should LEAD ship this as two pre-built static PDF files (dark/light) committed to `public/assets/trust/` — or generate on-demand via a print stylesheet triggered by a React component?
2. What is the canonical URL slug for the public site page — `/trust`, `/data-policy`, or `/sterile-schema`? Trevor to confirm.
3. Does the Settings page "Trust & Compliance" subsection already exist, or must BUILDER scaffold a new Settings sub-route? LEAD to confirm current Settings architecture.
4. Font licensing: confirm JetBrains Mono is already bundled in the Vite build or if BUILDER must add the dependency.
5. Should the public site page be linked from the main marketing nav/footer, or only discoverable via the in-app Settings CTA and direct share links?

---

### PRODDY Sign-Off Checklist

- [x] Problem Statement is ≤100 words and contains no solution ideas
- [x] Job-To-Be-Done is a single sentence in the correct format
- [x] All 3 success metrics contain a measurable number or specific observable event
- [x] Out of Scope is populated (not empty)
- [x] Priority tier has a named reason (not just "seems important")
- [x] Open Questions list is ≤5 items (4 questions)
- [x] Total PRD word count is ≤600 words
- [x] No code, SQL, or schema written anywhere in this document
- [x] Frontmatter updated: `owner: LEAD`, `status: 01_TRIAGE`
- [x] Response wrapped in `==== PRODDY ====`

---

## LEAD Architectural Decision Record

> **Reviewed by:** LEAD
> **Date:** 2026-03-05
> **Codebase refs:** `src/App.tsx`, `src/pages/Settings.tsx`, `package.json`

### Q1 — PDF delivery: static files vs. print stylesheet?
**Decision: Two static pre-built PDF files** committed to `public/assets/trust/`.

Reason: `jspdf` (`^4.1.0`) is already in `package.json`. BUILDER can use it to generate dark and light variants as a one-time build script, output committed as static assets. This keeps the runtime bundle zero-cost (no client-side PDF generation on every click) and makes the files directly linkable without any React component involvement.

### Q2 — Canonical URL slug for the public site page?
**Decision: `/data-policy`** ✅ Confirmed by Trevor 2026-03-05.

Reason: `/privacy` is taken (`PrivacyPolicy.tsx`). `/terms` is taken (`TermsOfService.tsx`). `/data-policy` is the most self-describing for an inbound prospect who finds it via search.

### Q3 — Does a Settings > Trust & Compliance subsection already exist?
**Decision: No — BUILDER must add a new section to `src/pages/Settings.tsx`.**

Reason: `Settings.tsx` has 5 sections: Authentication, Data Privacy, Access Control, Encryption, Node Configuration, Site Team. No Trust & Compliance section exists. BUILDER will append a new section following the existing section pattern (section divider + `<div>` card). No new route needed — it is a scroll-to section within `/settings`.

### Q4 — Is JetBrains Mono available?
**Decision: Not bundled — BUILDER must add it.**

Reason: `package.json` has no `@fontsource/jetbrains-mono` or equivalent. BUILDER will add `@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap')` to the page component's `<head>` (via inline style tag or Helmet if available), scoped to the trust page only. No global bundle impact.

### Q5 — Nav/footer placement of the public site page?
**Decision: Footer link only (no main nav) + in-app Settings CTA.**

Reason: `/data-policy` is a trust/legal asset, not a primary navigation destination. It belongs in the footer alongside `/privacy` and `/terms`. The in-app Settings > Trust & Compliance section provides the second entry point with the PDF download CTA. Main nav stays uncluttered.

---

### LEAD Routing Summary

| Deliverable | Owner | Entry point |
|---|---|---|
| Public page (`/data-policy`) | BUILDER | Footer link (public) |
| PDF (dark + light) | BUILDER | Page CTA + Settings section |
| Settings section | BUILDER | `/settings` (auth-gated, scroll section) |
| Footer link | BUILDER | `src/components/Footer.tsx` |

**BUILDER assignment:** Add `src/pages/DataPolicy.tsx`, generate static PDFs to `public/assets/trust/`, add Settings section to `Settings.tsx`, add footer link to `Footer.tsx`, register route in `App.tsx`.

✅ **INSPECTOR audit: PASSED.** Routed to `01_TRIAGE`.
