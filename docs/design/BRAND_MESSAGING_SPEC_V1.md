# Brand Messaging Update & Legal Disclaimer Specification

**Created:** 2026-02-15  
**Owner:** DESIGNER Agent  
**Status:** Ready for BUILDER Implementation  
**Work Order:** WO_BRAND_MESSAGING_LEGAL_DISCLAIMER

---

## Overview

This specification defines the implementation requirements for the new brand tagline and mandatory legal safety disclosures across all public-facing and internal portal surfaces.

---

## 1. Brand Tagline Implementation

### New Tagline
**"Augmented intelligence for the global psychedelic wellness community."**

### Placement Locations

#### A. Landing Page Hero Section
**File:** `/src/pages/Landing.tsx`

**Location:** Below the main headline, above the CTA buttons

**Styling:**
```tsx
<p className="text-lg md:text-xl text-slate-300 font-medium tracking-wide max-w-3xl mx-auto leading-relaxed">
  Augmented intelligence for the global psychedelic wellness community.
</p>
```

**Specifications:**
- Font size: 18px mobile, 20px desktop (lg/xl)
- Color: Slate 300 (#cbd5e1) for 5.2:1 contrast
- Font weight: 500 (Medium)
- Letter-spacing: 0.025em (tracking-wide)
- Max width: 768px (max-w-3xl)
- Line height: 1.75 (leading-relaxed)
- Alignment: Center

#### B. Sidebar Header
**File:** `/src/components/Sidebar.tsx`

**Location:** Below the PPN logo, above the navigation menu

**Styling:**
```tsx
<p className="text-xs text-slate-400 font-medium tracking-wider uppercase px-4 mt-2">
  Augmented Intelligence
</p>
```

**Specifications:**
- Font size: 12px (text-xs)
- Color: Slate 400 (#94a3b8) - **NOTE:** May need to update to Slate 300 per accessibility audit
- Font weight: 500 (Medium)
- Letter-spacing: 0.05em (tracking-wider)
- Text transform: Uppercase
- Padding: 16px horizontal
- Margin top: 8px

**Accessibility Note:**
- Consider using abbreviated version "Augmented Intelligence" for space constraints
- Ensure minimum 12px font size (already met)
- If using Slate 400, update to Slate 300 per WO_041 accessibility findings

---

## 2. Legal Disclaimer Implementation

### Disclaimer Text
**"This is for informational purposes only. For medical advice or diagnosis, consult a professional."**

### Placement Locations

#### A. Global Footer
**File:** `/src/components/Footer.tsx`

**Location:** Bottom of footer, above copyright notice

**Styling:**
```tsx
<div className="mt-8 pt-6 border-t border-white/10">
  <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg max-w-4xl mx-auto">
    <span className="material-symbols-outlined text-amber-500 text-xl flex-shrink-0">warning</span>
    <p className="text-sm text-slate-300 leading-relaxed">
      <strong className="text-amber-400 font-semibold">Medical Disclaimer:</strong> This is for informational purposes only. For medical advice or diagnosis, consult a professional.
    </p>
  </div>
</div>
```

**Specifications:**
- Background: Amber 500 at 10% opacity (bg-amber-500/10)
- Border: Amber 500 at 30% opacity (border-amber-500/30)
- Border radius: 8px (rounded-lg)
- Padding: 16px (p-4)
- Max width: 896px (max-w-4xl)
- Icon: ⚠️ warning (Material Symbols)
- Icon color: Amber 500 (#f59e0b)
- Text size: 14px (text-sm)
- Text color: Slate 300 (#cbd5e1)
- Label color: Amber 400 (#fbbf24)
- Font weight: 600 (semibold) for label

#### B. Safety Matrix Component
**File:** `/src/components/clinical/SafetyMatrix.tsx` (if exists) or `/src/pages/InteractionChecker.tsx`

**Location:** Above the safety matrix results, below the search input

**Styling:**
```tsx
{/* Display after search is performed, before results */}
{hasResults && (
  <div className="mb-6 flex items-start gap-3 p-4 bg-amber-500/10 border-l-4 border-amber-500 rounded-r-lg">
    <span className="material-symbols-outlined text-amber-500 text-xl flex-shrink-0">warning</span>
    <div>
      <p className="text-sm font-semibold text-amber-400 mb-1">Medical Disclaimer</p>
      <p className="text-xs text-slate-300 leading-relaxed">
        This is for informational purposes only. For medical advice or diagnosis, consult a professional.
      </p>
    </div>
  </div>
)}
```

**Specifications:**
- Background: Amber 500 at 10% opacity
- Left border: 4px solid Amber 500 (border-l-4)
- Border radius: Right side only (rounded-r-lg)
- Padding: 16px
- Margin bottom: 24px (mb-6)
- Icon: ⚠️ warning
- Icon size: 20px (text-xl)
- Title size: 12px (text-xs)
- Title color: Amber 400
- Title weight: 600 (semibold)
- Body size: 12px (text-xs)
- Body color: Slate 300
- Display condition: Only show when results are present

#### C. Interaction Checker Component
**File:** `/src/pages/InteractionChecker.tsx`

**Location:** Same as Safety Matrix - above results, below search input

**Styling:** Same as Safety Matrix specification above

**Display Logic:**
```tsx
{interactions.length > 0 && (
  <div className="mb-6 flex items-start gap-3 p-4 bg-amber-500/10 border-l-4 border-amber-500 rounded-r-lg">
    {/* Same disclaimer content as Safety Matrix */}
  </div>
)}
```

---

## 3. Typography Standards

### Tagline Typography
- **Font Family:** System font stack (inherits from body)
- **Font Size:** 18-20px (responsive)
- **Font Weight:** 500 (Medium)
- **Letter Spacing:** 0.025em (tracking-wide)
- **Line Height:** 1.75 (leading-relaxed)
- **Color:** Slate 300 (#cbd5e1)

### Disclaimer Typography
- **Font Family:** System font stack (inherits from body)
- **Font Size:** 12-14px (depending on context)
- **Font Weight:** 400 (Regular), 600 (Semibold for labels)
- **Letter Spacing:** Normal
- **Line Height:** 1.625 (leading-relaxed)
- **Color:** Slate 300 (#cbd5e1) for body, Amber 400 (#fbbf24) for labels

---

## 4. Accessibility Requirements

### Tagline Accessibility
- ✅ Minimum 14px font size (18px used)
- ✅ 5.2:1 contrast ratio (Slate 300 on Deep Slate)
- ✅ Screen reader accessible (no special attributes needed)
- ✅ Responsive across all viewport sizes

### Disclaimer Accessibility
- ✅ Minimum 12px font size (12-14px used)
- ✅ Icon + text (not color-only)
- ✅ ⚠️ warning icon for visual emphasis
- ✅ "Medical Disclaimer" label for screen readers
- ✅ High contrast (Amber 400/500 on dark background)
- ✅ Does not block functional buttons
- ✅ Keyboard accessible (no interactive elements)

### Color Contrast Verification
| Element | Foreground | Background | Ratio | Status |
|---------|------------|------------|-------|--------|
| Tagline (Landing) | #cbd5e1 | #020408 | 5.2:1 | ✅ PASS |
| Tagline (Sidebar) | #cbd5e1 | #0a0c12 | 5.2:1 | ✅ PASS |
| Disclaimer Label | #fbbf24 | #020408 | 5.8:1 | ✅ PASS |
| Disclaimer Body | #cbd5e1 | #020408 | 5.2:1 | ✅ PASS |
| Warning Icon | #f59e0b | #020408 | 5.2:1 | ✅ PASS |

---

## 5. Implementation Checklist

### Tagline Implementation
- [ ] Update Landing Page Hero section (`Landing.tsx`)
  - [ ] Add tagline below main headline
  - [ ] Apply specified styling
  - [ ] Test responsive behavior (mobile/tablet/desktop)
  - [ ] Verify 18px minimum font size on mobile

- [ ] Update Sidebar Header (`Sidebar.tsx`)
  - [ ] Add tagline below PPN logo
  - [ ] Use abbreviated version if needed
  - [ ] Apply specified styling
  - [ ] Consider updating to Slate 300 per accessibility audit

### Disclaimer Implementation
- [ ] Update Footer (`Footer.tsx`)
  - [ ] Add disclaimer section above copyright
  - [ ] Include ⚠️ warning icon
  - [ ] Apply Aurora-Slate border styling
  - [ ] Test on all pages

- [ ] Update Safety Matrix/Interaction Checker
  - [ ] Locate correct component file(s)
  - [ ] Add disclaimer above results
  - [ ] Conditional display (only when results present)
  - [ ] Include ⚠️ warning icon
  - [ ] Apply left-border styling

### Quality Assurance
- [ ] Test all placements across viewport sizes
- [ ] Verify disclaimer does not block functional buttons
- [ ] Test screen reader accessibility (NVDA/VoiceOver)
- [ ] Confirm disclaimer appears for both Free and Paid tiers
- [ ] Validate no clinical logic or data schemas were modified
- [ ] Ensure Deep Slate background and Aurora gradients remain unchanged
- [ ] Run Lighthouse accessibility audit (target: 90+)

---

## 6. Visual Examples

### Landing Page Tagline Placement
```
┌─────────────────────────────────────────┐
│                                         │
│     PPN RESEARCH PORTAL                 │
│     [Logo]                              │
│                                         │
│     Empowering Practitioners with       │
│     Evidence-Based Psychedelic Care     │
│                                         │
│     Augmented intelligence for the      │ ← NEW TAGLINE
│     global psychedelic wellness         │
│     community.                          │
│                                         │
│     [Access Portal] [Learn More]        │
│                                         │
└─────────────────────────────────────────┘
```

### Footer Disclaimer Placement
```
┌─────────────────────────────────────────┐
│  [Footer Navigation Links]              │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ ⚠️ Medical Disclaimer: This is    │  │ ← NEW DISCLAIMER
│  │ for informational purposes only.  │  │
│  │ For medical advice or diagnosis,  │  │
│  │ consult a professional.           │  │
│  └───────────────────────────────────┘  │
│                                         │
│  © 2026 PPN Research Portal             │
└─────────────────────────────────────────┘
```

### Safety Matrix Disclaimer Placement
```
┌─────────────────────────────────────────┐
│  Drug Interaction Checker               │
│                                         │
│  [Search Input]  [Check Interactions]   │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ ⚠️ Medical Disclaimer             │  │ ← NEW DISCLAIMER
│  │ This is for informational         │  │
│  │ purposes only. For medical        │  │
│  │ advice or diagnosis, consult a    │  │
│  │ professional.                     │  │
│  └───────────────────────────────────┘  │
│                                         │
│  [Interaction Results Table]            │
└─────────────────────────────────────────┘
```

---

## 7. Component Code Examples

### Landing Page Tagline
```tsx
// In Landing.tsx, within the hero section
<div className="text-center max-w-5xl mx-auto px-6">
  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
    Empowering Practitioners with Evidence-Based Psychedelic Care
  </h1>
  
  {/* NEW TAGLINE */}
  <p className="text-lg md:text-xl text-slate-300 font-medium tracking-wide max-w-3xl mx-auto leading-relaxed mb-8">
    Augmented intelligence for the global psychedelic wellness community.
  </p>
  
  <div className="flex gap-4 justify-center">
    <button>Access Portal</button>
    <button>Learn More</button>
  </div>
</div>
```

### Sidebar Tagline
```tsx
// In Sidebar.tsx, below the logo
<div className="p-4 border-b border-white/5">
  <div className="flex items-center gap-3 mb-2">
    <PPNLogo />
    <span className="text-xl font-black text-white">PPN</span>
  </div>
  
  {/* NEW TAGLINE */}
  <p className="text-xs text-slate-300 font-medium tracking-wider uppercase mt-2">
    Augmented Intelligence
  </p>
</div>
```

### Footer Disclaimer
```tsx
// In Footer.tsx, above copyright section
<footer className="bg-slate-900 border-t border-white/5 py-12">
  <div className="max-w-7xl mx-auto px-6">
    {/* Footer navigation links */}
    
    {/* NEW DISCLAIMER */}
    <div className="mt-8 pt-6 border-t border-white/10">
      <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg max-w-4xl mx-auto">
        <span className="material-symbols-outlined text-amber-500 text-xl flex-shrink-0">
          warning
        </span>
        <p className="text-sm text-slate-300 leading-relaxed">
          <strong className="text-amber-400 font-semibold">Medical Disclaimer:</strong> This is for informational purposes only. For medical advice or diagnosis, consult a professional.
        </p>
      </div>
    </div>
    
    {/* Copyright */}
    <p className="text-center text-slate-500 text-sm mt-6">
      © 2026 PPN Research Portal. All rights reserved.
    </p>
  </div>
</footer>
```

### Safety Matrix/Interaction Checker Disclaimer
```tsx
// In InteractionChecker.tsx or SafetyMatrix component
{interactions.length > 0 && (
  <div className="mb-6 flex items-start gap-3 p-4 bg-amber-500/10 border-l-4 border-amber-500 rounded-r-lg">
    <span className="material-symbols-outlined text-amber-500 text-xl flex-shrink-0">
      warning
    </span>
    <div>
      <p className="text-sm font-semibold text-amber-400 mb-1">
        Medical Disclaimer
      </p>
      <p className="text-xs text-slate-300 leading-relaxed">
        This is for informational purposes only. For medical advice or diagnosis, consult a professional.
      </p>
    </div>
  </div>
)}
```

---

## 8. Testing Requirements

### Visual Testing
- [ ] Tagline appears correctly on Landing page (desktop, tablet, mobile)
- [ ] Tagline appears correctly in Sidebar (desktop, tablet, mobile)
- [ ] Disclaimer appears in Footer on all pages
- [ ] Disclaimer appears in Safety Matrix when results are shown
- [ ] Disclaimer appears in Interaction Checker when results are shown
- [ ] All styling matches specifications (colors, spacing, typography)

### Accessibility Testing
- [ ] Screen reader announces tagline correctly
- [ ] Screen reader announces disclaimer with "Medical Disclaimer" label
- [ ] Warning icon is announced to screen readers
- [ ] All text meets 12px minimum font size
- [ ] All text meets 4.5:1 contrast ratio minimum
- [ ] Keyboard navigation not affected by disclaimer placement

### Functional Testing
- [ ] Disclaimer does not block "Check Interactions" button
- [ ] Disclaimer does not block "Log Protocol" button
- [ ] Disclaimer does not interfere with scrolling
- [ ] Disclaimer appears for Free tier users
- [ ] Disclaimer appears for Paid tier users
- [ ] No console errors or warnings

### Cross-Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

---

## 9. Notes for BUILDER

### Implementation Order
1. **Start with Footer** - Easiest to implement and test
2. **Then Landing Page** - High visibility, important to get right
3. **Then Sidebar** - May need layout adjustments
4. **Finally Clinical Components** - Requires conditional logic

### Potential Issues to Watch For
- **Sidebar space constraints:** May need to abbreviate tagline
- **Clinical component files:** May need to locate correct file paths
- **Conditional display logic:** Ensure disclaimer only shows when results are present
- **Button blocking:** Test that disclaimer doesn't cover interactive elements

### Color Update Consideration
Per WO_041 accessibility audit findings, `text-slate-400` is deprecated due to contrast violations. Consider using `text-slate-300` instead for the sidebar tagline.

---

## 10. Success Criteria

### Tagline
- ✅ Appears on Landing Page Hero section
- ✅ Appears in Sidebar header
- ✅ Uses Clinical Sci-Fi typography (14px+ minimum)
- ✅ Responsive across all viewport sizes
- ✅ Screen reader accessible

### Disclaimer
- ✅ Appears in Footer on all pages
- ✅ Appears in Safety Matrix when results are shown
- ✅ Appears in Interaction Checker when results are shown
- ✅ Styled with Aurora-Slate border and ⚠️ icon
- ✅ Text is 12px+ and screen reader accessible
- ✅ Does not block functional buttons
- ✅ Visible to both Free and Paid tier users

### Compliance
- ✅ No clinical logic, schemas, or brand colors modified
- ✅ Deep Slate background and Aurora gradients unchanged
- ✅ All accessibility requirements met
- ✅ All testing requirements passed

---

**Brand Messaging Specification v1.0**  
**Status:** Ready for BUILDER Implementation  
**Created:** 2026-02-15  
**Designer:** DESIGNER Agent
