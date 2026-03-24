---
name: ppn-ui-standards
description: MANDATORY CSS, Tailwind, Accessibility, Color Blindness, and Printability rules for the PPN Portal platform and all public-facing deliverables.
---

# PPN UI Standards

> **MANDATORY** - Read every rule before writing any UI code. These rules protect our color-blind lead designer and clinical users.

---

## Quick Reference (Read This First)

For fast builds, this summary covers the most common violations. Use the full rules below only when you need to verify an edge case.

| Rule | Requirement |
|---|---|
| **Omni-Channel** | **MANDATORY. Every component must handle Mobile / Tablet `md:` / Desktop `lg:` / Print `print:` in one pass. See Rule 0.** |
| **Mobile-first** | **MANDATORY. Write mobile layout first. Desktop is an enhancement via `md:` / `lg:` prefixes. No hardcoded px widths on layout containers.** |
| Em dash | BANNED everywhere. Replace with colon or comma. |
| Font | `Inter` only. `Roboto Mono` for code/labels. `JetBrains Mono` and `Courier New` are banned. |
| Font floor | `text-sm` (14px) on desktop/tablet. `text-xs` only with responsive prefix (`text-xs md:text-sm`) for mobile, tooltips, and print footers. Never bare `text-xs` on desktop. |
| Color alone | NEVER. Every color state needs an icon AND text label. |
| Contrast | 4.5:1 for body text. 3:1 for large text and icons (WCAG AA). |
| Phase colors | Indigo (Phase 1), Amber (Phase 2), Teal (Phase 3). No others. |
| Screenshot source | `Marketing-Screenshots/webp/` only. Case-sensitive. |
| Print background | White `#ffffff` or near-white `#f8f9fc`. No dark fills. |
| Print modifiers | Components with dark bg MUST include `print:bg-white print:text-slate-900` directly in `className`. |
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

<omni-channel-rules>

## Rule 0: The Omni-Channel Component Matrix

> **Every UI component must be engineered to adapt to all 4 states in a single build pass using Tailwind utilities. Do NOT design for one context and patch the others afterwards.**

| Context | Tailwind Prefix | Key Layout Rules |
|---|---|---|
| **Mobile (default)** | *(no prefix)* | `flex-col`, bottom navigation, `text-xs` floor (with `md:text-sm` upgrade), 44px touch targets (`min-h-[44px]`) |
| **Tablet (`md:`)** | `md:` | `md:grid-cols-2`, restore top/side nav (no bottom-sheet), `md:text-sm` floor, 44px touch targets preserved |
| **Desktop (`lg:`)** | `lg:` | `lg:grid-cols-3` or more, hover states (`hover:scale-105`), standard Deep Slate aesthetics (`bg-slate-950`) |
| **Print (`print:`)** | `print:` | White backgrounds (`print:bg-white`), black text (`print:text-slate-900`), hidden navigation (`print:hidden`), `print:break-inside-avoid` |

**Tablet-specific rules (agents often miss these):**
- Do NOT use bottom-sheet navigation for tablets. Use top or side navigation.
- Switch from single-column mobile layouts to 2-column grids: `grid-cols-1 md:grid-cols-2`.
- Touch targets remain 44px minimum at `md:` breakpoint.
- Restore inline nav bars that were collapsed for mobile.

**Print-specific rule:**
Every component using dark bg classes MUST include `print:` overrides in its `className` directly. Example:
```tsx
className="bg-slate-950 print:bg-white text-slate-50 print:text-slate-900"
```
Do NOT rely solely on a global `@media print` CSS block to fix dark HTML classes.

</omni-channel-rules>

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

**The smallest allowed font size on desktop and tablet is `text-sm` (14px).**

- On desktop and tablet: `text-sm` minimum. Bare `text-xs` is **forbidden**.
- On mobile (no prefix), tooltips, and print footers: `text-xs` is permitted **only when paired with a responsive upgrade**:
  ```
  text-xs md:text-sm
  ```
- Never use bare `text-xs` as the sole class on any element that renders on desktop or tablet.

**Responsive pattern (correct):**
```tsx
<span className="text-xs md:text-sm text-slate-400">Session date</span>
```

**Forbidden:**
```tsx
<span className="text-xs text-slate-400">Session date</span>  {/* bare text-xs — FAIL */}
```

---

## Rule 2b: Typography — Banned Fonts

**No serif fonts allowed anywhere in the platform or documents.**

| Font | Status |
|---|---|
| `Inter` | Required — primary typeface |
| `Roboto Mono` | Approved — only monospace font allowed |
| `JetBrains Mono` | Banned |
| `Courier New` | Banned (serif monospace) |
| Any other serif | Banned |

- `--mono` variable must be: `'Roboto Mono', ui-monospace, monospace`

---

## Rule 3: Clinical Aesthetic

| Element | Required style |
|---|---|
| **Backgrounds** | Deep Slate only: `#020408` or `bg-slate-950`. Never flat black. |
| **Panels / containers** | `bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-[2rem] p-6` |
| **Form inputs** | No free-text `<textarea>` inputs. Use structured selects or defined fields. |

---

<cockpit-rules>

## Rule 3b: Cockpit Mode (In-Session Clinical UI)

> **Cockpit Mode applies ONLY to screens used during an active live clinical session (e.g., Crisis Logger, Vitals Monitor). This is the authoritative definition — auditors check against this rule, they do not define it.**

| Element | Required style |
|---|---|
| **Background** | True Black `#000000` (CSS var: `--bg-cockpit: #000000`). Never Deep Slate in Cockpit context. |
| **Text** | Amber `#FFB300` for standard readouts. Red `#FF5252` for critical alerts only. |
| **Rationale** | Preserves practitioner night vision (dilated pupils) during low-light sessions. |
| **Touch targets** | Minimum `min-h-[80px]` for critical action buttons. Require long-press interactions to prevent accidental taps. |
| **Scope** | Crisis Logger, Vitals, and any UI component active during a live session. Does NOT apply to documentation or reporting screens. |

INSPECTOR checks Cockpit Mode compliance by reading `<cockpit-rules>` from this file. The `ui-ux-auditor.md` workflow references this block and does not re-define these values.

</cockpit-rules>

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

<print-rules>

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

### In-Component Print Modifiers (MANDATORY)

Every React/TSX component that uses dark bg classes AND may appear in a print or PDF context MUST include Tailwind `print:` modifier overrides directly in the component `className`. Do NOT rely solely on a global `@media print` block.

```tsx
// CORRECT — print: modifiers co-located with the dark classes
<div className="bg-slate-950 print:bg-white text-slate-50 print:text-slate-900 border border-white/10 print:border-slate-200">

// WRONG — dark class without a print: override
<div className="bg-slate-950 text-slate-50">
```

Hide interactive elements in print:
```tsx
<nav className="print:hidden">...</nav>
<button className="print:hidden">Export PDF</button>
```

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
- [ ] Every dark-bg component has `print:bg-white print:text-slate-900` in its `className`

</print-rules>

---

<accessibility-rules>

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

</accessibility-rules>

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

<mobile-rules>

## Rule 8: Mobile-First Mandate

> **This rule exists because practitioners will QR-scan ppnportal.net from a phone at trade shows, and because clinical staff use tablets at point-of-care. Desktop-first layouts that are "made responsive later" always produce rework. Mobile is the primary canvas.**

### 8a: Layout Construction Order (Mandatory)

| Step | Rule |
|---|---|
| **1. Write mobile first** | All layout, spacing, and typography classes must be written for the smallest screen first (no prefix = mobile). |
| **2. Add tablet enhancement** | Use `md:` responsive prefix to upgrade for tablet (768px+). Restore nav, switch to 2-column grids. |
| **3. Add desktop enhancement** | Use `lg:` responsive prefix to upgrade for desktop (1024px+). Add hover states, 3+ column grids. |
| **4. No hardcoded widths on containers** | Never use `w-[640px]`, `min-w-[500px]`, or any fixed-px width on layout containers. Use `max-w-*` with `mx-auto` for centering. |
| **5. No `hover:`-only interactions** | Any interaction designed as `hover:` must also work on `tap`. Use `active:` and `focus:` states as the fallback. |

### 8b: Mandatory Responsive Patterns

| Pattern | Wrong | Correct |
|---|---|---|
| Grid layout | `grid-cols-3` (breaks on mobile) | `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` |
| Two-column split | `flex` with `w-1/2` children | `flex flex-col md:flex-row` with `w-full md:w-1/2` |
| Chart/data containers | `<div style="width: 700px">` | `<ResponsiveContainer width="100%">` or `w-full` |
| Pricing / comparison table | Side-by-side columns | Stacked cards on mobile, `md:` grid |
| Nav / header items | Always visible inline | `hidden md:flex` with a mobile hamburger or collapsed menu |
| Button width | `px-8` inline button | `w-full sm:w-auto` |
| Touch targets | `h-8` (32px) | `h-12` (48px minimum) for any tappable element |
| Tablet navigation | Bottom-sheet nav | Top or side nav bar at `md:` breakpoint |

### 8c: Pre-Commit Mobile Check (BUILDER must run before every handoff)

```bash
# Check for hardcoded pixel widths on layout containers
grep -n 'w-\[.*px\]\|min-w-\[.*px\]\|style.*width.*px' <file> | grep -v 'max-w-'
# Must return empty or be justified with a comment

# Check for grid-cols without mobile-first pattern
grep -n 'grid-cols-[2-9]\b' <file> | grep -v 'md:\|lg:\|sm:'
# Any match = likely missing mobile breakpoint — verify manually
```

### 8d: INSPECTOR Mobile Gate (Phase 2 addition — see inspector-qa-script)

- Every `.tsx`, `.html`, or `.css` file with visible layout must pass the mobile-first check before INSPECTOR approves.
- INSPECTOR must take a **375px mobile screenshot** (iPhone SE) for every Growth Order and public-facing screen before issuing Phase 4/5 approval.
- INSPECTOR must also take a **768px tablet screenshot** (iPad Mini) to verify 2-column grid layout and top/side navigation are present at the `md:` breakpoint.

</mobile-rules>

---

## Semantic Token Registry

CSS custom property naming conventions for use in component styles. These names are the canonical reference — use them in comments and code reviews when flagging color violations.

| Token | Value | Context |
|---|---|---|
| `--bg-clinical` | `#020408` | Standard Deep Slate app background |
| `--bg-cockpit` | `#000000` | True Black for in-session clinical UI only |
| `--accent-phase-1` | `#7c6ff7` | Phase 1 Indigo |
| `--accent-phase-2` | `#f59e0b` | Phase 2 Amber |
| `--accent-phase-3` | `#0d9488` | Phase 3 Teal |
| `--accent-brand` | `#7c6ff7` | Primary brand indigo (same as Phase 1) |
| `--accent-brand-dark` | `#5b52d4` | Brand indigo pressed/hover state |

---

## Changelog

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | 2026-02-23 | INSPECTOR | Initial standards established |
| 1.1 | 2026-03-21 | LEAD | Added Rule 6 (color blindness explicit: WCAG AA, banned pairs, phase palette verification), expanded Rule 5 (print pre-flight checklist, header/footer requirements), added Rule 7 (public-facing polish: branding, typography, layout, legal footer), updated description |
| 1.2 | 2026-03-22 | PRODDY | Confirmed `JetBrains Mono` banned (already in Rule 2b table). Updated Quick Reference row to explicitly surface the ban. |
| 1.3 | 2026-03-23 | LEAD | Added Rule 8: Mobile-First Mandate. Root cause fix for recurring rework. Establishes mobile as the primary layout canvas. Adds 8a (construction order), 8b (responsive patterns), 8c (BUILDER pre-commit grep checks), 8d (INSPECTOR mobile gate). Added Mobile-First row to Quick Reference table. |
| 1.4 | 2026-03-23 | LEAD | **Omni-Channel Architecture.** Added Rule 0 (Omni-Channel Component Matrix: Mobile/Tablet/Desktop/Print). Fixed Rule 2 font-size contradiction (bare `text-xs` banned on desktop; `text-xs md:text-sm` allowed for mobile/tooltip/print). Migrated Cockpit Mode to Rule 3b (authoritative definition, removed from `ui-ux-auditor.md`). Added in-component `print:` modifier mandate to Rule 5. Expanded 8a + 8b for explicit tablet (`md:`) rules. Added Semantic Token Registry. Wrapped Rules 0, 3b, 5, 6, 8 in XML context-fence tags for agent focus. |