==== PRODDY ====
---
owner: LEAD
status: 01_TRIAGE
authored_by: PRODDY
---

## PRODDY PRD

> **Work Order:** WO-588 — Phantom Shield Mobile Optimization & Cognitive Load Reduction
> **Authored by:** PRODDY
> **Date:** 2026-03-09
> **Status:** Draft → Pending LEAD review

---

### 1. Problem Statement

`/public/phantom-shield.html` is a high-stakes partner-facing document currently viewed on mobile (confirmed viewport: 500×757px, page height: 5,864px — over 11× scroll depth). The page fails on two dimensions: (1) it renders with desktop-only multi-column grids and a fixed 48px/40px container padding that causes horizontal overflow and text cramming at mobile widths, and (2) it is wall-to-wall dense prose across every section, causing severe cognitive overload with no visual relief. Practitioners receiving a share link open this on their phone and encounter an impenetrable block of text. This directly undermines conversion.

---

### 2. Target User + Job-To-Be-Done

A prospective practitioner partner, receiving a Phantom Shield share link on their mobile device, needs to quickly grasp the value and trust the product so that they can decide whether to request access without having to read a dense document.

---

### 3. Success Metrics

1. Page renders without horizontal scroll at 375px viewport width (iPhone SE baseline).
2. All tap targets (feature cards, footer links) meet the 44×44px minimum touch target standard.
3. A new reviewer can identify all 7 protection layers within 60 seconds of arrival on mobile — validated by internal usability test with 3 participants.

---

### 4. Feature Scope

#### ✅ In Scope — Track A: Mobile Responsiveness

- **Container padding:** Reduce from `48px 40px` to `24px 16px` at ≤ 640px breakpoint.
- **Header layout:** Stack `.header` to `flex-direction: column` on mobile; move `.header-meta` below brand wordmark; reduce `.brand-name` from 42px to 28px.
- **Problem Options grid:** Change `.problem-options` from 3-column to single-column stack on mobile.
- **Features grid:** Change `.features-grid` from 2-column to single-column on mobile; remove `.feature-card.span-2` full-width override at mobile (already single column).
- **Protection Matrix table:** Convert `.matrix-table` to a card-stack layout on mobile (`display: block` per row, with labeled pseudo-element headers) to eliminate horizontal scroll on the 3-column table.
- **Reframe section:** Reduce padding from `40px` to `24px 20px` on mobile; scale `.reframe-headline` from 28px to 22px.
- **Footer:** Stack `.footer` grid from 2-column to single-column, left-aligned, on mobile.
- **Quote block:** Reduce padding from `28px 32px` to `20px 18px` on mobile.

#### ✅ In Scope — Track B: Cognitive Load Reduction via Mini-Graphics

Insert small, inline SVG icon-panels or illustrated micro-graphics at 5–6 strategic breakpoints within the page to visually chunk content and provide breathing room. These are NOT decorative; each graphic must communicate a concept at a glance:

| Location | Graphic Concept | Format |
|---|---|---|
| Between Problem Options and Features header | **"3 paths" visual** — branching icon showing Option A/B/C outcomes | Inline SVG strip |
| Before Zero-PHI card | **Data vault icon panel** — schema diagram showing Subject_ID replacing a name field | Inline SVG mini-card |
| Before Blind Vetting card | **Hash flow diagram** — phone number → hash function → network check → ✓/✗ | Inline SVG flow strip |
| Before Potency Normalizer card | **Dose math diagram** — `3g × 1.4 potency modifier = 2.1g effective` | Inline SVG equation panel |
| Before Crisis Logger card | **Timeline mockup** — 3-row timestamp log with large tap buttons at right | Inline SVG mini-UI mockup |
| Above Protection Matrix table | **Shield layers diagram** — concentric shield rings labeled with the 7 features | Inline SVG diagram |

- All graphics must use the existing CSS custom properties (`--blue-primary`, `--cyan`, `--amber`, `--bg-card`, `--border`) — no new color values.
- Graphics are purely SVG/HTML — no external image files, no `<img>` tags, no base64.
- Each graphic is contained in a `.visual-break` wrapper with `margin: 28px 0` and no border on mobile.

#### ❌ Out of Scope

- Rewriting or restructuring the copy/content itself — text is approved.
- Adding interactive JavaScript behavior (animations, accordions, carousels).
- Fetching or displaying live data from the PPN backend.
- Changes to the print stylesheet (`@media print`).

---

### 5. Priority Tier

**[X] P1** — High value, ship this sprint

**Reason:** This page is actively being shared via the `trevor-showcase.html` share tool (WO-536) and opens on mobile by default. A broken mobile experience undermines the entire partner acquisition funnel. The cognitive load problem compounds this — even practitioners who arrive on desktop abandon dense text pages. Both fixes are pure HTML/CSS with no backend risk.

---

### 6. Implementation Notes for BUILDER

- All changes are **within `/public/phantom-shield.html`** in the `<style>` block and HTML structure. No React, no TypeScript, no Supabase.
- Add all mobile overrides under a single `@media (max-width: 640px)` block appended at the end of the existing `<style>` block — do not scatter overrides inline.
- Use the **surgical standards** skill before modifying any existing CSS rule.
- The Protection Matrix table card-stack pattern should use `::before` pseudo-elements with `content: attr(data-label)` — requires adding `data-label` attributes to each `<td>`.
- SVG mini-graphics should be wrapped in `<div class="visual-break" aria-hidden="true">` — they are decorative context, not primary content.

---

### 7. Open Questions for LEAD

1. Should the inline SVG graphics be authored manually in this WO or should BUILDER have discretion on the visual design within the color system constraints?
2. Is there a maximum page-weight budget (KB) we need to stay under for the share-link mobile load time?

---

### PRODDY Sign-Off Checklist

- [x] Problem Statement is ≤100 words and contains no solution ideas
- [x] Job-To-Be-Done is a single sentence in the correct format
- [x] All 3 success metrics contain a measurable number or specific observable event
- [x] Out of Scope is populated (not empty)
- [x] Priority tier has a named reason (not just "seems important")
- [x] Open Questions list is ≤5 items
- [x] Total PRD word count is ≤600 words (body content)
- [x] No code, SQL, or schema written anywhere in this document
- [x] Frontmatter updated: `owner: LEAD`, `status: 01_TRIAGE`
- [x] Response wrapped in `==== PRODDY ====`
==== PRODDY ====

## LEAD ARCHITECTURE

**Routed by:** LEAD
**Route date:** 2026-03-10
**Owner:** BUILDER
**Route:** 01_TRIAGE → 03_BUILD

### Open Question Resolutions:
1. **SVG graphic discretion:** BUILDER has full discretion on SVG visual design within the color system constraints defined in Section 4 (Track B). PRODDY does not need to pre-approve individual SVG artwork — only the conceptual labels matter.
2. **Page weight budget:** No hard budget, but target sub-200KB total page weight. All SVGs are inline — no HTTP requests. This is fine.

### Implementation Notes Confirmed:
- All changes in `/public/phantom-shield.html` only (style block + HTML)
- Single `@media (max-width: 640px)` block appended to end of `<style>` tag
- Protection Matrix card-stack: use `::before` + `data-label` attributes
- SVG graphics in `<div class="visual-break" aria-hidden="true">` wrappers
- Read `frontend-surgical-standards` SKILL before modifying any CSS

