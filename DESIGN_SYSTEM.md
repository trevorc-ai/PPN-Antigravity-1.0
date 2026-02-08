# PPN Portal Design System
**Version:** 1.0.0  
**Last Updated:** February 8, 2026  
**Status:** 🟡 In Review

---

## Table of Contents
1. [Overview](#overview)
2. [Layout System](#layout-system)
3. [Spacing & Rhythm](#spacing--rhythm)
4. [Color System](#color-system)
5. [Typography](#typography)
6. [Component Standards](#component-standards)
7. [Page Templates](#page-templates)
8. [Implementation Guide](#implementation-guide)
9. [Migration Checklist](#migration-checklist)

---

## Overview

### Design Philosophy
The PPN Portal design system is built on three core principles:

1. **Consistency** - Predictable patterns across all pages
2. **Clarity** - Information hierarchy that guides the eye
3. **Clinical Precision** - Professional aesthetic suitable for medical practitioners

### Design Tokens
All design decisions are based on a token system for easy maintenance and theming.

---

## Layout System

### Container Width Standards

We use a **3-tier width system** based on content type:

#### Tier 1: Default Content Width
**Token:** `max-w-7xl` (1280px)  
**Use Case:** Standard application pages with mixed content  
**Padding:** `px-6 sm:px-8 lg:px-12`

**Pages:**
- Dashboard
- Analytics
- News
- Settings
- Notifications
- ClinicianDirectory
- ClinicianProfile
- SubstanceCatalog
- All Deep Dive pages

**Rationale:** 1280px provides optimal reading width while maximizing screen real estate on modern displays (1440px+). Matches industry standards (GitHub, Stripe, Linear).

---

#### Tier 2: Wide Data Layout
**Token:** `max-w-[1600px]`  
**Use Case:** Data-heavy interfaces with tables, complex forms, or multi-column layouts  
**Padding:** `px-6 sm:px-8 lg:px-12`

**Pages:**
- ProtocolBuilder (complex multi-step form)
- SearchPortal (data tables + filters)
- IngestionHub (upload interface + preview)
- ProtocolDetail (comprehensive protocol view)
- InteractionChecker (drug matrix + details)

**Rationale:** Maximizes horizontal space for data visualization without causing excessive eye travel. Prevents horizontal scrolling on ultrawide monitors.

---

#### Tier 3: Focused Reading Width
**Token:** `max-w-4xl` (896px)  
**Use Case:** Text-heavy, single-column content optimized for reading  
**Padding:** `px-6 sm:px-8`

**Pages:**
- HelpFAQ
- About page (body sections)
- ContributionModel (body sections)
- Documentation pages

**Rationale:** 60-80 characters per line is optimal for reading comprehension. Reduces eye strain and improves focus.

---

#### Special Case: Landing Page
**Mixed Widths:**
- Hero section: `max-w-7xl`
- Feature sections: `max-w-7xl`
- Text blocks: `max-w-4xl` (nested within sections)
- Footer: `max-w-7xl`

**Rationale:** Creates visual hierarchy and rhythm through varying content widths.

---

### Current State Audit

| Page | Current Width | Target Width | Status |
|------|---------------|--------------|--------|
| Dashboard | `max-w-7xl` | `max-w-7xl` | ✅ Correct |
| Analytics | None | `max-w-7xl` | ⚠️ Needs fix |
| Landing | Mixed | Mixed | ✅ Correct |
| ProtocolBuilder | `max-w-[1600px]` | `max-w-[1600px]` | ✅ Correct |
| SearchPortal | `max-w-[1600px]` | `max-w-[1600px]` | ✅ Correct |
| IngestionHub | `max-w-[1600px]` | `max-w-[1600px]` | ✅ Correct |
| ProtocolDetail | `max-w-[1800px]` | `max-w-[1600px]` | ⚠️ Reduce width |
| InteractionChecker | `max-w-[1200px]` | `max-w-[1600px]` | ⚠️ Increase width |
| Notifications | `max-w-[1400px]` | `max-w-7xl` | ⚠️ Standardize |
| HelpFAQ | `max-w-4xl` | `max-w-4xl` | ✅ Correct |
| About | `max-w-7xl` | `max-w-7xl` | ✅ Correct |
| SubstanceCatalog | None (full) | `max-w-7xl` | ⚠️ Add container |
| ClinicianProfile | `max-w-7xl` | `max-w-7xl` | ✅ Correct |

**Summary:** 7 pages need width adjustments

---

## Spacing & Rhythm

### Vertical Spacing Scale

Use a consistent vertical spacing scale across all pages:

| Token | Value | Use Case |
|-------|-------|----------|
| `space-y-4` | 1rem (16px) | Tight groupings (form fields, list items) |
| `space-y-6` | 1.5rem (24px) | Related content blocks |
| `space-y-8` | 2rem (32px) | **Default section spacing** |
| `space-y-12` | 3rem (48px) | Major section breaks |
| `space-y-16` | 4rem (64px) | Page-level divisions |
| `space-y-20` | 5rem (80px) | Hero/feature sections |
| `space-y-32` | 8rem (128px) | Landing page sections |

**Current Issues:**
- Inconsistent use of `space-y-6`, `space-y-10`, `space-y-24`
- Recommendation: Standardize to scale above

---

### Horizontal Padding

| Breakpoint | Padding | Token |
|------------|---------|-------|
| Mobile (< 640px) | 24px | `px-6` |
| Tablet (640px+) | 32px | `sm:px-8` |
| Desktop (1024px+) | 48px | `lg:px-12` |

**Standard Pattern:**
```tsx
className="px-6 sm:px-8 lg:px-12"
```

**Current Issues:**
- Some pages use `px-4`, `px-10` (non-standard)
- Recommendation: Migrate all to standard pattern

---

### Component Spacing

| Component Type | Gap/Padding | Token |
|----------------|-------------|-------|
| Card grids | 24px | `gap-6` |
| Form fields | 12px | `space-y-3` |
| Button groups | 16px | `gap-4` |
| Navigation items | 8px | `space-y-2` |
| Stat pills | 16px | `gap-4` |

---

## Color System

### Background Colors

#### Primary Backgrounds
| Name | Hex | Usage | Token |
|------|-----|-------|-------|
| App Background | `#0e1117` | Main app canvas | `bg-[#0e1117]` |
| Page Background | `#05070a` | Landing/marketing pages | `bg-[#05070a]` |
| Card Background | `#0f1218` | Elevated cards/panels | `bg-[#0f1218]` |
| Input Background | `#0a0c10` | Form inputs, modals | `bg-[#0a0c10]` |
| Subtle Background | `#0b0e14` | Sections, containers | `bg-[#0b0e14]` |

#### Semantic Backgrounds
| Name | Hex | Usage |
|------|-----|-------|
| Dark Overlay | `#020408` | Modals, overlays |
| Hover State | `#111827` | Interactive hover |
| Border Dark | `#1e293b` | Borders (slate-800) |

**Current Issues:**
- 15+ unique hex values used inconsistently
- Recommendation: Consolidate to 5 core background colors

---

### Accent Colors

| Name | Tailwind | Hex | Usage |
|------|----------|-----|-------|
| Primary (Blue) | `primary` / `blue-500` | `#2b74f3` | CTAs, links, focus states |
| Clinical Green | `emerald-500` | `#10b981` | Success, safety indicators |
| Warning Amber | `amber-500` | `#f59e0b` | Warnings, regulatory alerts |
| Danger Red | `red-500` / `rose-500` | `#ef4444` | Errors, critical alerts |
| Info Indigo | `indigo-500` | `#6366f1` | Information, secondary actions |

---

### Text Colors

| Name | Tailwind | Usage |
|------|----------|-------|
| Primary Text | `text-white` | Headlines, important text |
| Secondary Text | `text-slate-400` | Body text, descriptions |
| Tertiary Text | `text-slate-500` | Metadata, captions |
| Disabled Text | `text-slate-600` | Disabled states |
| Muted Text | `text-slate-700` | Footnotes |

---

### Border Colors

| Name | Tailwind | Usage |
|------|----------|-------|
| Default Border | `border-slate-800` | Standard borders |
| Subtle Border | `border-slate-800/50` | Dividers |
| Hover Border | `border-slate-700` | Interactive hover |
| Focus Border | `border-primary` | Focus states |

---

## Typography

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

### Type Scale

| Element | Size | Weight | Line Height | Token |
|---------|------|--------|-------------|-------|
| H1 (Page Title) | 48px (3rem) | 900 (Black) | 0.9 | `text-5xl font-black tracking-tighter` |
| H2 (Section) | 36px (2.25rem) | 900 (Black) | 1.1 | `text-4xl font-black tracking-tight` |
| H3 (Subsection) | 24px (1.5rem) | 900 (Black) | 1.2 | `text-2xl font-black tracking-tight` |
| H4 (Card Title) | 18px (1.125rem) | 800 (Extra Bold) | 1.3 | `text-lg font-black` |
| Body Large | 18px (1.125rem) | 500 (Medium) | 1.6 | `text-lg font-medium` |
| Body Default | 16px (1rem) | 500 (Medium) | 1.5 | `text-base font-medium` |
| Body Small | 14px (0.875rem) | 500 (Medium) | 1.4 | `text-sm font-medium` |
| Caption | 12px (0.75rem) | 700 (Bold) | 1.3 | `text-xs font-bold` |
| Overline | 11px (0.6875rem) | 900 (Black) | 1.2 | `text-[11px] font-black uppercase tracking-widest` |

### Font Weights
- **Black (900):** Headlines, labels, emphasis
- **Bold (700):** Subheadings, buttons
- **Medium (500):** Body text, descriptions
- **Regular (400):** Rarely used

**Recommendation:** Standardize to Black/Bold/Medium only

---

### Letter Spacing

| Use Case | Token |
|----------|-------|
| Headlines | `tracking-tighter` (-0.05em) |
| Subheadings | `tracking-tight` (-0.025em) |
| Body | Default (0) |
| Labels/Buttons | `tracking-widest` (0.1em) |
| Overlines | `tracking-[0.3em]` |

---

## Component Standards

### Cards

#### Standard Card
```tsx
className="bg-[#0f1218] border border-slate-800 rounded-3xl p-6 hover:border-slate-600 transition-all"
```

**Variants:**
- **Small:** `p-4 rounded-2xl`
- **Medium:** `p-6 rounded-3xl` (default)
- **Large:** `p-8 rounded-[3rem]`

**Height Standards:**
- Dashboard cards: `h-[200px]`
- Analytics components: `h-[500px]`
- Stat pills: `h-auto` (content-driven)

---

### Buttons

#### Primary Button
```tsx
className="px-8 py-4 bg-primary hover:bg-blue-600 text-white text-[12px] font-black rounded-xl uppercase tracking-[0.2em] transition-all shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95"
```

#### Secondary Button
```tsx
className="px-6 py-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white text-xs font-bold rounded-xl uppercase tracking-widest transition-all"
```

#### Danger Button
```tsx
className="px-6 py-3 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-xl uppercase tracking-widest transition-all"
```

**Size Standards:**
- Small: `px-4 py-2 text-xs`
- Medium: `px-6 py-3 text-xs` (default)
- Large: `px-8 py-4 text-[12px]`

---

### Form Inputs

#### Text Input
```tsx
className="w-full px-5 py-4 bg-slate-900/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-colors font-medium"
```

#### Select Dropdown
```tsx
className="w-full bg-[#05070a] border border-slate-800 rounded-xl h-12 px-4 text-xs font-black text-white focus:ring-1 focus:ring-primary appearance-none cursor-pointer hover:border-slate-700 transition-all"
```

**Height Standard:** `h-12` (48px) for all form inputs

---

### Badges & Pills

#### Status Badge
```tsx
className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400 uppercase tracking-wide"
```

**Color Variants:**
- Success: `emerald-500`
- Warning: `amber-500`
- Error: `red-500`
- Info: `indigo-500`
- Neutral: `slate-500`

---

### Modals

#### Standard Modal
```tsx
className="w-full max-w-5xl bg-[#0f172a] border border-white/10 rounded-[2.5rem] shadow-[0_0_50px_-12px_rgba(43,116,243,0.5)] ring-2 ring-primary/40 overflow-hidden"
```

**Size Standards:**
- Small: `max-w-md` (448px)
- Medium: `max-w-2xl` (672px)
- Large: `max-w-5xl` (1024px)
- Extra Large: `max-w-7xl` (1280px)

---

## Page Templates

### Template 1: Standard Content Page
**Use:** Dashboard, Analytics, News, Settings

```tsx
<div className="p-8 min-h-screen bg-[#05070a] text-white">
  <div className="max-w-7xl mx-auto space-y-8">
    {/* Header */}
    <div className="border-b border-slate-800 pb-8">
      <h1 className="text-5xl font-black tracking-tighter">Page Title</h1>
    </div>
    
    {/* Content */}
    <div className="space-y-8">
      {/* Sections */}
    </div>
  </div>
</div>
```

---

### Template 2: Data-Heavy Page
**Use:** ProtocolBuilder, SearchPortal, IngestionHub

```tsx
<div className="p-6 sm:p-10 min-h-screen bg-[#05070a]">
  <div className="max-w-[1600px] mx-auto space-y-8">
    {/* Header */}
    <div className="flex justify-between items-end border-b border-slate-800 pb-6">
      <h1 className="text-4xl font-black">Page Title</h1>
      <div className="flex gap-4">
        {/* Actions */}
      </div>
    </div>
    
    {/* Content */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Data components */}
    </div>
  </div>
</div>
```

---

### Template 3: Reading Page
**Use:** HelpFAQ, About, Documentation

```tsx
<div className="min-h-screen bg-[#05070a] text-slate-100 py-20">
  <div className="max-w-4xl mx-auto px-6 sm:px-8 space-y-12">
    {/* Header */}
    <div className="text-center space-y-4">
      <h1 className="text-5xl font-black">Page Title</h1>
      <p className="text-xl text-slate-400">Subtitle</p>
    </div>
    
    {/* Content */}
    <div className="prose prose-invert max-w-none">
      {/* Article content */}
    </div>
  </div>
</div>
```

---

## Implementation Guide

### Phase 1: Create Reusable Components

#### 1. PageContainer Component
```tsx
// src/components/layouts/PageContainer.tsx
interface PageContainerProps {
  children: React.ReactNode;
  width?: 'default' | 'wide' | 'narrow' | 'full';
  padding?: 'default' | 'compact' | 'spacious';
  className?: string;
}

export const PageContainer = ({ 
  children, 
  width = 'default',
  padding = 'default',
  className = '' 
}: PageContainerProps) => {
  const widthClasses = {
    default: 'max-w-7xl',
    wide: 'max-w-[1600px]',
    narrow: 'max-w-4xl',
    full: 'max-w-none'
  };

  const paddingClasses = {
    compact: 'px-6 sm:px-8',
    default: 'px-6 sm:px-8 lg:px-12',
    spacious: 'px-8 sm:px-12 lg:px-16'
  };

  return (
    <div className={`${widthClasses[width]} ${paddingClasses[padding]} mx-auto ${className}`}>
      {children}
    </div>
  );
};
```

#### 2. Section Component
```tsx
// src/components/layouts/Section.tsx
interface SectionProps {
  children: React.ReactNode;
  spacing?: 'tight' | 'default' | 'spacious';
  className?: string;
}

export const Section = ({ 
  children, 
  spacing = 'default',
  className = '' 
}: SectionProps) => {
  const spacingClasses = {
    tight: 'space-y-6',
    default: 'space-y-8',
    spacious: 'space-y-12'
  };

  return (
    <div className={`${spacingClasses[spacing]} ${className}`}>
      {children}
    </div>
  );
};
```

---

### Phase 2: Update Pages

#### Priority Order
1. **High Impact** (most visible inconsistencies)
   - Analytics (add max-width)
   - ProtocolDetail (reduce from 1800px to 1600px)
   - Notifications (standardize to 1280px)
   - InteractionChecker (increase to 1600px)

2. **Medium Impact**
   - SubstanceCatalog (add container)
   - Deep dive pages (standardize spacing)

3. **Low Impact** (already mostly correct)
   - Dashboard (minor spacing tweaks)
   - Landing (preserve intentional variation)

---

### Phase 3: Consolidate Colors

#### Create Color Constants
```tsx
// src/constants/colors.ts
export const BACKGROUNDS = {
  app: '#0e1117',
  page: '#05070a',
  card: '#0f1218',
  input: '#0a0c10',
  section: '#0b0e14',
  overlay: '#020408',
} as const;

export const BORDERS = {
  default: 'border-slate-800',
  subtle: 'border-slate-800/50',
  hover: 'border-slate-700',
  focus: 'border-primary',
} as const;
```

#### Replace Inline Hex Values
```tsx
// Before
<div className="bg-[#0f1218] border border-slate-800">

// After
<div className="bg-card border border-default">
```

---

## Migration Checklist

### Pre-Migration
- [ ] Review this design system document with team
- [ ] Get approval on width standards
- [ ] Get approval on color consolidation
- [ ] Create `PageContainer` component
- [ ] Create `Section` component
- [ ] Test components in isolation

### Page-by-Page Migration

#### High Priority
- [ ] Analytics.tsx - Add `max-w-7xl` container
- [ ] ProtocolDetail.tsx - Change to `max-w-[1600px]`
- [ ] Notifications.tsx - Change to `max-w-7xl`
- [ ] InteractionChecker.tsx - Change to `max-w-[1600px]`

#### Medium Priority
- [ ] SubstanceCatalog.tsx - Add `max-w-7xl` container
- [ ] Dashboard.tsx - Standardize spacing to `space-y-8`
- [ ] All Deep Dive pages - Audit and standardize

#### Low Priority
- [ ] Update all pages to use `PageContainer` component
- [ ] Replace inline hex colors with constants
- [ ] Standardize button sizes
- [ ] Standardize card padding

### Post-Migration
- [ ] Visual QA on all pages
- [ ] Responsive testing (mobile, tablet, desktop, ultrawide)
- [ ] Update component library documentation
- [ ] Create Figma/design file with standards

---

## Responsive Breakpoints

### Standard Breakpoints (Tailwind)
| Name | Min Width | Usage |
|------|-----------|-------|
| `sm` | 640px | Tablet portrait |
| `md` | 768px | Tablet landscape |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Large desktop |
| `2xl` | 1536px | Ultrawide |

### Grid Patterns
```tsx
// Standard 2-column responsive grid
className="grid grid-cols-1 md:grid-cols-2 gap-6"

// Standard 3-column responsive grid
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"

// Dashboard card grid
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
```

---

## Animation Standards

### Transitions
```tsx
// Standard hover transition
className="transition-all duration-300"

// Color transition only
className="transition-colors duration-200"

// Transform transition
className="transition-transform duration-300"
```

### Hover Effects
```tsx
// Card hover
className="hover:border-slate-600 hover:-translate-y-1 hover:shadow-2xl"

// Button hover
className="hover:scale-[1.02] active:scale-95"

// Link hover
className="hover:text-primary transition-colors"
```

### Page Entry Animations
```tsx
className="animate-in fade-in duration-700"
className="animate-in slide-in-from-bottom-4 duration-700"
```

---

## Accessibility Standards

### Focus States
All interactive elements must have visible focus states:
```tsx
className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-slate-900"
```

### Color Contrast
- Text on dark backgrounds: Minimum AA contrast (4.5:1)
- Primary text: `text-white` on `bg-[#0e1117]` ✅ 15.3:1
- Secondary text: `text-slate-400` on `bg-[#0e1117]` ✅ 7.2:1

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Tab order must be logical
- Skip links for main content

---

## Testing Checklist

### Visual Regression
- [ ] Desktop (1920x1080)
- [ ] Laptop (1440x900)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)
- [ ] Ultrawide (2560x1440)

### Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Accessibility Testing
- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] Color contrast validation
- [ ] Focus indicator visibility

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-02-08 | Initial design system documentation |

---

## Questions & Feedback

For questions or suggestions about this design system:
- Create an issue in the project repository
- Contact the design team
- Propose changes via pull request

**Document Owner:** Antigravity AI  
**Last Review:** February 8, 2026
