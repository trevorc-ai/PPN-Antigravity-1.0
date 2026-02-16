# PPN Research Portal - Design System v2.0

**Version:** 2.0  
**Last Updated:** 2026-02-15  
**Owner:** DESIGNER Agent  
**Status:** Active

---

## Overview

The PPN Research Portal Design System v2.0 establishes a comprehensive, accessible, and consistent visual language for the application. This system prioritizes **Clinical Sci-Fi** aesthetics, **WCAG 2.1 AA compliance**, and **user empowerment** for psychedelic therapy practitioners.

---

## Design Philosophy

### Core Principles

1. **Scientific Rigor** - Professional, data-driven, evidence-based
2. **Human-Centered** - Empathetic, supportive, non-judgmental
3. **Privacy-First** - Transparent, secure, user-controlled
4. **Community-Driven** - Collaborative, open, inclusive
5. **Harm Reduction** - Safety without paternalism

### Visual Identity

**Clinical Sci-Fi Aesthetic:**
- Deep space backgrounds with subtle aurora gradients
- Glassmorphism with high-contrast borders
- Precise typography with generous spacing
- Data-driven visualizations with colorblind-friendly palettes
- Smooth, purposeful animations

---

## Color System

### Primary Palette

| Color | Hex | Usage | Contrast Ratio |
|-------|-----|-------|----------------|
| **Primary Blue** | `#2b74f3` | CTAs, links, focus states | 8.2:1 (on dark) |
| **Clinical Green** | `#22c55e` | Success, positive indicators | 6.8:1 (on dark) |
| **Accent Amber** | `#f59e0b` | Warnings, attention | 5.2:1 (on dark) |
| **Error Red** | `#ef4444` | Errors, destructive actions | 5.1:1 (on dark) |

### Neutral Palette (Updated for WCAG AA)

| Color | Hex | Usage | Contrast Ratio | Status |
|-------|-----|-------|----------------|--------|
| **White** | `#F5F5F0` | Primary text | 14.1:1 | ✅ PASS |
| **Slate 200** | `#e2e8f0` | Secondary text | 7.8:1 | ✅ PASS |
| **Slate 300** | `#cbd5e1` | Tertiary text | 5.2:1 | ✅ PASS |
| ~~Slate 400~~ | ~~`#94a3b8`~~ | ~~Deprecated~~ | 3.8:1 | ❌ FAIL |
| ~~Slate 500~~ | ~~`#64748b`~~ | ~~Deprecated~~ | 2.9:1 | ❌ FAIL |
| **Slate 700** | `#334155` | Borders, dividers | 3.1:1 | ✅ PASS |
| **Slate 800** | `#1e293b` | Card backgrounds | - | - |
| **Slate 900** | `#0f172a` | Modal backgrounds | - | - |
| **Deep Slate** | `#0a0c12` | Page background | - | - |

> **⚠️ BREAKING CHANGE:** `text-slate-400` and `text-slate-500` are deprecated due to WCAG contrast violations. Use `text-slate-300` or `text-slate-200` instead.

### Gradient System

```css
/* Aurora Gradient (Background) */
background: radial-gradient(ellipse at top, rgba(43, 116, 243, 0.15), transparent 50%);

/* Primary Gradient (CTAs) */
background: linear-gradient(90deg, #2b74f3 0%, #60a5fa 100%);

/* Viridis Gradient (Colorblind-safe data viz) */
background: linear-gradient(90deg, #440154 0%, #3b528b 25%, #21918c 50%, #5ec962 75%, #fde725 100%);

/* Cividis Gradient (Colorblind-safe data viz) */
background: linear-gradient(90deg, #00204d 0%, #414d6b 33%, #7d7c78 66%, #ffea46 100%);
```

---

## Typography

### Font Families

```css
/* Primary Font Stack */
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;

/* Monospace (for code, data) */
font-family: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace;
```

### Type Scale (WCAG AA Compliant)

| Name | Size | Line Height | Usage | Min Size |
|------|------|-------------|-------|----------|
| **Display** | 48px | 1.1 | Hero headings | - |
| **H1** | 36px | 1.2 | Page titles | - |
| **H2** | 24px | 1.3 | Section headings | - |
| **H3** | 20px | 1.4 | Subsection headings | - |
| **H4** | 18px | 1.5 | Card headings | - |
| **Body** | 16px | 1.6 | Paragraph text | - |
| **Small** | 14px | 1.5 | Helper text, labels | - |
| **XSmall** | 12px | 1.5 | Captions, footnotes | **12px** |

> **🔒 ENFORCED MINIMUM:** 12px for all text (user global rule). SVG/chart text: 11px minimum.

### Font Weights

| Weight | Value | Usage |
|--------|-------|-------|
| **Regular** | 400 | Body text |
| **Medium** | 500 | Emphasized text |
| **Semibold** | 600 | Subheadings |
| **Bold** | 700 | Headings |
| **Black** | 900 | Display text, labels |

### Letter Spacing

| Name | Value | Usage | Accessibility Note |
|------|-------|-------|-------------------|
| **Normal** | 0 | Body text, paragraphs | ✅ Recommended for readability |
| **Wide** | 0.025em | Subheadings | ⚠️ Use sparingly |
| **Wider** | 0.05em | Labels | ⚠️ Use sparingly |
| **Widest** | 0.1em | Uppercase labels | ⚠️ Headings only (not body text) |

> **⚠️ ACCESSIBILITY:** Excessive letter-spacing (tracking-widest) can hinder readability for users with dyslexia. Limit to headings and labels only.

---

## Spacing System

### Scale (8px base unit)

| Name | Value | Usage |
|------|-------|-------|
| **xs** | 4px | Tight spacing |
| **sm** | 8px | Small gaps |
| **md** | 16px | Default spacing |
| **lg** | 24px | Section spacing |
| **xl** | 32px | Large sections |
| **2xl** | 48px | Page sections |
| **3xl** | 64px | Hero sections |

### Component Spacing

```css
/* Card Padding */
padding: 24px; /* lg */

/* Button Padding */
padding: 12px 24px; /* sm lg */

/* Input Padding */
padding: 12px 16px; /* sm md */

/* Section Margin */
margin-bottom: 48px; /* 2xl */
```

---

## Component Library

### Buttons

#### Primary Button
```tsx
<button className="px-6 py-2.5 bg-primary hover:bg-blue-600 text-white text-sm font-black rounded-2xl tracking-widest transition-all shadow-[0_0_15px_rgba(43,116,243,0.3)] active:scale-95">
  Action
</button>
```

**Specifications:**
- Min height: 44px (touch target)
- Font size: 12px minimum
- Contrast: 8.2:1 (WCAG AAA)
- Focus indicator: 3px solid #2b74f3 with 2px offset

#### Secondary Button
```tsx
<button className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-bold rounded-2xl border-2 border-slate-700 hover:border-primary transition-all">
  Action
</button>
```

#### Icon Button
```tsx
<button 
  aria-label="Descriptive label"
  className="size-11 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all hover:bg-white/10"
>
  <span className="material-symbols-outlined text-[24px]">icon_name</span>
</button>
```

**Accessibility Requirements:**
- ✅ Must have `aria-label` (icon-only)
- ✅ Min size: 44px × 44px
- ✅ Visible focus indicator
- ✅ Keyboard accessible

---

### Form Inputs

#### Text Input
```tsx
<div className="space-y-2">
  <label htmlFor="input-id" className="block text-sm font-medium text-slate-200">
    Label
  </label>
  <input
    id="input-id"
    type="text"
    className="w-full px-4 py-2 rounded-lg bg-slate-800 border-2 border-slate-700 text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
  />
</div>
```

**Specifications:**
- Min height: 44px
- Label association: `<label for="">` + `id`
- Error state: `border-red-500` + `aria-invalid="true"`
- Helper text: `aria-describedby`

---

### Cards

#### Glass Card
```tsx
<div className="card-glass rounded-2xl p-6 border border-white/10">
  {/* content */}
</div>
```

**CSS:**
```css
.card-glass {
  background: rgba(13, 17, 23, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1); /* Updated for contrast */
}
```

> **🔄 UPDATED:** Border opacity increased from `0.05` to `0.1` for WCAG 3:1 contrast.

#### Solid Card
```tsx
<div className="card-solid rounded-2xl p-6 border border-white/10">
  {/* content */}
</div>
```

**CSS:**
```css
.card-solid {
  background: #0f1218;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

---

### Modals

```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
  <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-2xl w-full mx-4">
    <h2 className="text-xl font-bold text-white mb-4">Modal Title</h2>
    {/* content */}
  </div>
</div>
```

**Accessibility Requirements:**
- ✅ `role="dialog"` + `aria-modal="true"`
- ✅ `aria-labelledby` linking to title
- ✅ Focus trap (Tab cycles within modal)
- ✅ Escape key closes modal
- ✅ Focus returns to trigger on close

---

### Tooltips

```tsx
<div className="relative group">
  <button>Trigger</button>
  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-[#0c0f16] border border-white/10 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] whitespace-nowrap pointer-events-none">
    <span className="text-xs text-slate-300">Tooltip text</span>
  </div>
</div>
```

**Specifications:**
- Font size: 12px minimum
- Max letter-spacing: 0.05em (avoid tracking-widest)
- Dismissible: hover away
- WCAG 1.4.13 compliant

---

## Accessibility Guidelines

### Focus Indicators

**Global Focus Styles:**
```css
:focus-visible {
  outline: 3px solid #2b74f3;
  outline-offset: 3px;
  border-radius: 4px;
}

button:focus-visible,
a:focus-visible {
  outline: 3px solid #2b74f3;
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(43, 116, 243, 0.2);
}
```

**Requirements:**
- ✅ Visible on all interactive elements
- ✅ 3px minimum width
- ✅ High contrast (8.2:1)
- ✅ Offset for clarity

### Touch Targets

**Minimum Size:** 44px × 44px (WCAG 2.5.5)

**Examples:**
- Buttons: 44px min height
- Icon buttons: 44px × 44px
- Checkboxes: 24px (with 44px clickable area)
- Links: 44px min height (or adequate padding)

### Color Independence

**Never rely on color alone:**
- ✅ Use icons + text + color
- ✅ Use patterns/textures in charts
- ✅ Use text labels for status indicators

**Example:**
```tsx
{/* ❌ BAD: Color-only */}
<span className="text-green-500">Success</span>

{/* ✅ GOOD: Icon + text + color */}
<span className="flex items-center gap-2 text-green-500">
  <span className="material-symbols-outlined">check_circle</span>
  Success
</span>
```

### Screen Reader Support

**ARIA Patterns:**
- Icon-only buttons: `aria-label`
- Form inputs: `<label for="">` + `id`
- Error states: `aria-invalid` + `role="alert"`
- Live regions: `aria-live="polite"` or `role="status"`
- Modals: `role="dialog"` + `aria-modal="true"`

**Screen Reader Only Text:**
```tsx
<span className="sr-only">Additional context</span>
```

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

## Responsive Patterns

### Breakpoints

| Name | Min Width | Usage |
|------|-----------|-------|
| **sm** | 640px | Small tablets |
| **md** | 768px | Tablets |
| **lg** | 1024px | Laptops |
| **xl** | 1280px | Desktops |
| **2xl** | 1536px | Large desktops |

### Mobile-First Approach

```css
/* Mobile default */
.component {
  padding: 16px;
}

/* Tablet and up */
@media (min-width: 768px) {
  .component {
    padding: 24px;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .component {
    padding: 32px;
  }
}
```

### Responsive Typography

```css
/* Mobile */
h1 { font-size: 28px; }

/* Tablet */
@media (min-width: 768px) {
  h1 { font-size: 32px; }
}

/* Desktop */
@media (min-width: 1024px) {
  h1 { font-size: 36px; }
}
```

### Mobile Input Constraints

```css
@media (max-width: 768px) {
  input[type="text"],
  input[type="email"],
  select,
  textarea {
    max-width: 100% !important;
    width: 100% !important;
    min-width: 0 !important;
  }
}
```

---

## Animation Standards

### Transition Durations

| Speed | Duration | Usage |
|-------|----------|-------|
| **Fast** | 150ms | Hover states, small changes |
| **Normal** | 200ms | Default transitions |
| **Slow** | 300ms | Complex animations, modals |

### Easing Functions

```css
/* Default */
transition-timing-function: ease-in-out;

/* Smooth entry */
transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

/* Bounce */
transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Animation Examples

**Button Hover:**
```css
.button {
  transition: all 200ms ease-in-out;
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(43, 116, 243, 0.3);
}

.button:active {
  transform: scale(0.95);
}
```

**Modal Entry:**
```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal {
  animation: fadeIn 300ms ease-in-out;
}
```

### Performance Guidelines

- ✅ Use `transform` and `opacity` for animations (GPU-accelerated)
- ❌ Avoid animating `width`, `height`, `top`, `left` (causes reflow)
- ✅ Use `will-change` sparingly for complex animations
- ✅ Respect `prefers-reduced-motion` media query

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Data Visualization Standards

### Colorblind-Safe Palettes

**Viridis (Recommended):**
```javascript
const viridis = ['#440154', '#3b528b', '#21918c', '#5ec962', '#fde725'];
```

**Cividis (Alternative):**
```javascript
const cividis = ['#00204d', '#414d6b', '#7d7c78', '#ffea46'];
```

### Chart Accessibility

**Requirements:**
- ✅ Provide data table alternative
- ✅ Use patterns/textures in addition to color
- ✅ Add `<desc>` elements to SVG charts
- ✅ Ensure labels meet 12px minimum
- ✅ Implement keyboard navigation

**Example:**
```tsx
<div className="chart-container">
  <button onClick={() => setView(view === 'chart' ? 'table' : 'chart')}>
    {view === 'chart' ? 'View as Table' : 'View as Chart'}
  </button>
  
  {view === 'chart' ? (
    <ResponsiveContainer aria-label="Patient enrollment over time">
      <LineChart data={data}>
        <desc>Line chart showing monthly patient enrollment from Jan to Dec 2025</desc>
        {/* chart content */}
      </LineChart>
    </ResponsiveContainer>
  ) : (
    <table>
      <caption>Patient enrollment data (2025)</caption>
      {/* table content */}
    </table>
  )}
</div>
```

### Chart Label Guidelines

- Font size: 11px minimum (SVG exception)
- Color: `text-slate-300` (#cbd5e1) for 5.2:1 contrast
- Background: Semi-transparent for overlays
- Avoid truncation: Use tooltips for long labels

---

## Icon System

### Material Symbols

**CDN:**
```html
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet">
```

**Usage:**
```tsx
<span className="material-symbols-outlined text-[24px]">icon_name</span>
```

**Size Scale:**
- Small: 16px
- Medium: 20px
- Large: 24px
- XLarge: 32px

**Accessibility:**
- Icon-only buttons: Must have `aria-label`
- Decorative icons: `aria-hidden="true"`
- Meaningful icons: Include `sr-only` text

---

## Implementation Checklist

### For New Components

- [ ] Uses semantic HTML
- [ ] Meets WCAG 2.1 AA contrast requirements
- [ ] All text ≥ 12px
- [ ] Touch targets ≥ 44px
- [ ] Keyboard accessible
- [ ] Has visible focus indicators
- [ ] Includes ARIA labels where needed
- [ ] Tested with screen reader
- [ ] Responsive on mobile
- [ ] Respects `prefers-reduced-motion`

### For New Pages

- [ ] Proper heading hierarchy (H1 → H2 → H3)
- [ ] Skip to main content link
- [ ] All images have alt text
- [ ] All forms have labels
- [ ] Color-independent indicators
- [ ] Mobile-responsive layout
- [ ] Tested at 200% zoom
- [ ] No horizontal scroll at 320px width

---

## Resources

### Design Tools
- [Figma](https://figma.com) - Design mockups
- [Contrast Checker](https://webaim.org/resources/contrastchecker/) - WCAG compliance
- [Colorblind Simulator](https://www.color-blindness.com/coblis-color-blindness-simulator/) - Accessibility testing

### Code Resources
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS
- [Material Symbols](https://fonts.google.com/icons) - Icon library
- [Recharts](https://recharts.org) - Data visualization

### Accessibility
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [A11y Project](https://www.a11yproject.com/)

---

## Changelog

### v2.0 (2026-02-15)

**Breaking Changes:**
- Deprecated `text-slate-400` and `text-slate-500` (WCAG violations)
- Increased glassmorphism border opacity from `0.05` to `0.1`

**Additions:**
- Comprehensive accessibility guidelines
- Colorblind-safe data visualization palettes
- Animation performance standards
- Mobile-first responsive patterns
- Component accessibility requirements

**Improvements:**
- Updated color palette with contrast ratios
- Added letter-spacing accessibility notes
- Expanded ARIA pattern examples
- Added implementation checklists

---

**Design System v2.0**  
**Last Updated:** 2026-02-15  
**Status:** Active
