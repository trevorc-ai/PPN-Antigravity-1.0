---
name: ppn-ui-standards
description: MANDATORY CSS, Tailwind, Accessibility, Color Blindness, and Printability rules for the PPN Portal platform and all public-facing deliverables.
---

# PPN UI Standards

> **MANDATORY** - Read every rule before writing any UI code. These rules protect our color-blind lead designer and clinical users.

---

## Quick Reference (Read This First)

For fast builds, this 10-line summary covers the most common violations. Use the full rules below only when you need to verify an edge case.

| Rule | Requirement |
|---|---|
| Em dash | BANNED everywhere. Replace with colon or comma. |
| Font | `Inter` only. `Roboto Mono` for code/labels. `JetBrains Mono` and `Courier New` are banned. |
| Font floor | 12px screen minimum. 9pt (12px) print minimum. |
| Color alone | NEVER. Every color state needs an icon AND text label. |
| Contrast | 4.5:1 for body text. 3:1 for large text and icons (WCAG AA). |
| Phase colors | Indigo (Phase 1), Amber (Phase 2), Teal (Phase 3). No others. |
| Screenshot source | `Marketing-Screenshots/webp/` only. Case-sensitive. |
| Print background | White `#ffffff` or near-white `#f8f9fc`. No dark fills. |
| Print setup | `@page { size: letter; margin: 0.6in; }` + `@media print` block. |
| Wordmark | PPN Portal wordmark required in header of every outreach document. |

---

## Brand Name Reference

| Term | Usage |
|---|---|
| **PPN Portal** | The company and product name. Use this everywhere. |
| Psychedelic Practitioner Network | The peer-network feature set - planned for a future phase. **Do not use as the company name.** |
| PPN | Acceptable shorthand in informal or space-constrained contexts. |

---

## Rule 1: Color-Blindness Mandate

**Never use color alone to convey meaning.**

Every color indicator MUST be paired with either a Lucide React icon OR explicit text.

| OK | NOT OK |
|---|---|
| `<AlertTriangle /> text-red-500` | `text-red-500` alone |
| `<CheckCircle /> text-green-500` | `bg-green-500` alone |

---

## Rule 2: Minimum Font Size

**The smallest allowed font size is `text-sm` (14px on desktop; 12px on mobile).**

- `text-xs` is strictly forbidden throughout the entire application.


---

## Rule 2b: Typography — Banned Fonts

**No serif fonts allowed anywhere in the platform or documents.**

| Font | Status |
|---|---|
| `Inter` | ✓ Required — primary typeface |
| `Roboto Mono` | ✓ Approved — only monospace font allowed |
| `JetBrains Mono` | ✗ Banned |
| `Courier New` | ✗ Banned (serif monospace) |
| Any other serif | ✗ Banned |

- `--mono` variable must be: `'Roboto Mono', ui-monospace, monospace`

---

## Rule 3: Clinical Aesthetic

| Element | Required style |
|---|---|
| **Backgrounds** | Deep Slate only: `#020408` or `bg-slate-950`. Never flat black. |
| **Panels / containers** | `bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-[2rem] p-6` |
| **Form inputs** | No free-text `<textarea>` inputs. Use structured selects or defined fields. |

---

## Rule 4: Em Dash Ban

**The em dash character (—) is forbidden. A hyphen acting as an em dash (` - `) is equally forbidden in body text.**

- **In body text:** replace with comma+space `, ` only.
- **In headings or labels:** a standard hyphen `-` is acceptable.

| Context | Wrong | Correct |
|---|---|---|
| Body text | `operate and document - without fear` | `operate and document, without fear` |
| Body text | `a liability gap - and most` | `a liability gap, and most` |
| Heading/label | `Zero-Knowledge by Design` | `Zero-Knowledge by Design` (fine) |

---

## Rule 5: Print & PDF Context

**Rules 1-7 apply to screen/application UI. For any printable or PDF-exported document, apply these overrides AND complete the setup checklist below before writing a single line of CSS.**

| Element | Required style |
|---|---|
| **Page size** | `letter` (US Letter, 8.5x11in). Never A4. Landscape: `letter landscape`. |
| **Margins** | `@page { size: letter; margin: 0.6in; }` + `@media screen { body { padding: 0.6in; } }` |
| **Backgrounds** | White (`#ffffff`) or near-white (`#f8f9fc`) only. No solid dark fills on the page. |
| **Table headers** | Light accent tint (`#ede9ff`) with indigo text (`#3730a3`). No dark fills. |
| **Font size** | Minimum 9pt (12px) body copy. Minimum 7pt (9px) captions and footers only. |
| **Page breaks** | Add `break-inside: avoid` to any multi-column flex or grid block to prevent splits. |
| **Color indicators** | Rule 1 and Rule 6 still apply: icon or text label required alongside any color. |
| **Header** | PPN Portal wordmark (`ppn_portal_wordmark.png`) required on every printable document. |
| **Footer** | Document title, date, page number, and `© PPN Portal · ppnportal.net · Confidential` on every page. |
| **Sticky header** | `position: sticky; top: 0;` on site headers. Remove in `@media print`. |

### Print Pre-flight Checklist (BUILDER must complete before committing any printable file)

- [ ] `@page { size: letter; margin: 0.6in; }` is present
- [ ] `@media print` block hides all nav, sticky headers, and tab controls
- [ ] Background is `#ffffff` or `#f8f9fc` — no dark fills
- [ ] All images have explicit `width` and `max-height` to prevent overflow across page break
- [ ] `break-inside: avoid` applied to all exhibit cards, tables, and multi-column grids
- [ ] PPN wordmark is visible in the header
- [ ] Footer contains document title, date, and legal line on every page
- [ ] Fonts are loaded from Google Fonts `@import` at the top of the `<style>` block (not assumed from the app bundle)
- [ ] All text passes 4.5:1 contrast ratio on white background (Rule 6)
- [ ] No em dashes in any rendered text (Rule 4)

---

## Rule 6: Color Blindness — Explicit Protections

> This rule exists because the lead designer is color blind. It is non-negotiable.

### 6a: WCAG AA Contrast Ratios (mandatory for all UI and documents)

| Text type | Minimum contrast ratio | Test against |
|---|---|---|
| Body text (< 18px) | **4.5:1** | Background color |
| Large text (18px+ or 14px bold) | **3:1** | Background color |
| UI components and icons | **3:1** | Adjacent background |

Use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) or `grep` for inline low-contrast hardcoded values.

### 6b: Banned Color Combinations

The following pairs are FORBIDDEN as the sole differentiator between two states because they are indistinguishable to the most common forms of color blindness (deuteranopia, protanopia):

| Banned pair | Why | Required fix |
|---|---|---|
| Red vs. Green | Deuteranopia / protanopia (red-green blindness, 8% of males) | Pair with icon: `<AlertTriangle />` (error) vs `<CheckCircle />` (success) |
| Teal vs. Purple | Tritanopia (blue-yellow blindness) | Pair with shape or label text |
| Orange vs. Red | Deuteranopia confusion | Use different icons and labels |
| Light gray vs. White | Low contrast — invisible to low vision users | Minimum 3:1 contrast ratio required |

### 6c: PPN Phase Palette — Verified Safe Assignments

| Phase | Color | Token | Colorblind-safe because |
|---|---|---|---|
| Phase 1 | Indigo | `#7c6ff7` | Distinguishable from amber and teal by luminance |
| Phase 2 | Amber | `#f59e0b` | High luminance yellow — safe across all types |
| Phase 3 | Teal | `#0d9488` | Paired with shape labels in all uses — never used alone |
| Error / Warning | Red | `#ef4444` | Always paired with `<AlertTriangle />` icon |
| Success | Green | `#22c55e` | Always paired with `<CheckCircle />` icon |

### 6d: Accessibility Check — Run for Every Public-Facing File

```bash
# Quick contrast check: find any hardcoded low-contrast gray text
grep -n "text-gray-[1-4]00\|color: #[89a-f]" <file>
# Must return empty or be justified with a contrast ratio annotation in a comment
```

If any element relies on color alone to communicate state (error, warning, success, active, inactive), it is an automatic INSPECTOR rejection.

---

## Rule 7: Public-Facing Polish Standards

**Every file in `public/outreach/`, every PDF export, and every client-facing document MUST meet all of the following before INSPECTOR approval:**

### 7a: Branding
- PPN Portal wordmark (`public/assets/ppn_portal_wordmark.png`) present in header
- Accent color is indigo-only (`#7c6ff7` / `#5b52d4`) — no ad hoc palette additions
- No competitor logos, stock icons, or unvetted brand assets
- Brand name is always "PPN Portal" — never "PPN" alone as a standalone brand reference in client-facing copy

### 7b: Typography Consistency
- `Inter` is the only body font. Loaded from Google Fonts `@import` in the `<style>` block
- `Roboto Mono` is the only monospace font. Used only for code, IDs, and technical terms
- Heading hierarchy must be strict: one `<h1>` per page, `<h2>` for section titles, `<h3>` for card titles
- No mixed font weights on the same line unless one is a `<strong>` or `<em>` emphasis

### 7c: Layout and Spacing
- All client-facing documents use the standard PPN card grid (1fr 1fr or 1fr 1fr 1fr with 28px gap)
- No orphaned single-column cards when 2 or more cards exist — use `grid-template-columns: repeat(auto-fit, minmax(320px, 1fr))`
- Padding inside cards: 20px minimum
- Section padding: 52px top / 80px bottom for print, 40px / 56px for screen

### 7d: Contact and Legal
- Every public-facing document footer must include: `info@ppnportal.net` and `© [year] PPN Portal · ppnportal.net · Confidential and Proprietary`
- No placeholder contact information (e.g., `contact@example.com`) may appear in any committed file

---

## Changelog

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | 2026-02-23 | INSPECTOR | Initial standards established |
| 1.1 | 2026-03-21 | LEAD | Added Rule 6 (color blindness explicit: WCAG AA, banned pairs, phase palette verification), expanded Rule 5 (print pre-flight checklist, header/footer requirements), added Rule 7 (public-facing polish: branding, typography, layout, legal footer), updated description |
| 1.2 | 2026-03-22 | PRODDY | Confirmed `JetBrains Mono` banned (already in Rule 2b table). Updated Quick Reference row to explicitly surface the ban. |