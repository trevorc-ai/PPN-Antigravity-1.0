# WO-050: Landing Page Redesign - DESIGNER DELIVERABLES

**Work Order ID:** WO-050  
**Phase:** 2_DESIGN (Complete)  
**Owner:** DESIGNER  
**Date Completed:** 2026-02-16  
**Estimated Implementation Time:** 10 hours (2 days)

---

## Executive Summary

This document contains all DESIGNER deliverables for WO-050 Phase 2 (Landing Page Redesign). All designs are based on MARKETER's research and recommendations, grounded in Voice of Customer (VoC) analysis.

**Key Deliverables:**
1. Landing Page Redesign Specification
2. "Alliance" Branding Integration (Visual Design)
3. Component Showcase Additions (2 new components)
4. Lead Magnet UI/UX Design
5. Mobile Responsiveness Specifications

---

## 1. LANDING PAGE REDESIGN SPECIFICATION

### Design Philosophy

**Objective:** Make the value proposition crystal clear in <30 seconds while maintaining the "Clinical Sci-Fi" aesthetic.

**Key Principles:**
1. **Clarity over Cleverness** - Direct, benefit-driven copy
2. **Show, Don't Tell** - Live component demos as proof
3. **Trust First** - Privacy and safety messaging prominent
4. **Progressive Disclosure** - Most important info above the fold

---

### Section-by-Section Design Specifications

#### **SECTION 1: Hero (Updated)**

**Current State:** Generic "Global Psychedelic Practitioner Network"  
**New State:** Benefit-driven with "Alliance" branding

**Visual Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  [Logo]                                    [Login] [Get Started]│
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                           │ │
│  │  Stop Practicing in Isolation.                           │ │
│  │  Join the Global Psychedelic Practitioner Alliance.      │ │
│  │  ─────────────────────────────────────────────────────   │ │
│  │                                                           │ │
│  │  The only platform that unifies safety surveillance,     │ │
│  │  outcomes tracking, and peer benchmarking—so you can     │ │
│  │  practice with confidence, not guesswork.                │ │
│  │                                                           │ │
│  │  Built for practitioners who refuse to compromise on     │ │
│  │  safety or evidence. Trusted by 840+ clinicians across   │ │
│  │  14 institutional sites.                                 │ │
│  │                                                           │ │
│  │  [Start Free Trial]  [Watch Demo (2 min)]                │ │
│  │                                                           │ │
│  │  ✓ No credit card required  ✓ Full access for 14 days   │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Typography:**
- **H1:** 72px (desktop), 48px (tablet), 36px (mobile)
  - Font: Inter Black
  - Color: `text-slate-300`
  - Line height: 0.9
  - "Alliance" in gradient: `text-gradient-primary`

- **Subheadline:** 24px (desktop), 20px (tablet), 18px (mobile)
  - Font: Inter Medium
  - Color: `text-slate-400`
  - Line height: 1.5

- **Supporting Copy:** 18px
  - Font: Inter Medium
  - Color: `text-slate-500`

**CTAs:**
- **Primary:** "Start Free Trial"
  - Size: `px-8 py-4`
  - Background: `bg-emerald-500 hover:bg-emerald-400`
  - Text: `text-slate-900 font-black text-lg`
  - Shadow: `shadow-lg shadow-emerald-500/20`
  - Transform: `hover:scale-105 transition-all`

- **Secondary:** "Watch Demo (2 min)"
  - Size: `px-6 py-4`
  - Border: `border-2 border-slate-600 hover:border-slate-500`
  - Text: `text-slate-300 font-semibold`

**Trust Indicators (Below CTAs):**
- Small checkmarks with text
- Font: 14px, `text-slate-500`
- Icons: `text-emerald-400`

---

#### **SECTION 2: Global Alliance (Moved Higher)**

**Current Position:** Line 261  
**New Position:** Immediately after Hero (Line 260)

**Visual Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  The Global Psychedelic Practitioner Alliance.                 │
│  Where Evidence Meets Experience.                              │
│  ─────────────────────────────────────────────────────────     │
│                                                                 │
│  PPN is not a social network. It's a professional alliance of  │
│  840+ licensed clinicians who share one goal: prove that       │
│  psychedelic therapy works—safely, consistently, and at scale. │
│                                                                 │
│  By pooling de-identified outcomes data across 14 institutional│
│  sites, we're building the evidence base that unlocks insurance│
│  coverage, reduces malpractice risk, and elevates the entire   │
│  field.                                                         │
│                                                                 │
│  You don't have to build this alone. Join the Alliance.        │
│                                                                 │
│  [Join the Alliance →]                                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Typography:**
- **H2:** 56px (desktop), 42px (tablet), 32px (mobile)
  - Font: Inter Black
  - Color: `text-slate-200`
  - "Alliance" in gradient: `text-gradient-purple`

- **Tagline:** 32px
  - Font: Inter Medium
  - Color: `text-slate-400`

- **Body:** 18px
  - Font: Inter Medium
  - Color: `text-slate-400`
  - Line height: 1.6

- **CTA Line:** 20px
  - Font: Inter Bold
  - Color: `text-slate-300`

**Visual Design:**
- Background: Subtle gradient `from-slate-900/50 to-transparent`
- Border: `border-t border-b border-slate-800`
- Padding: `py-24 px-8`
- Glow effect: Purple gradient glow on hover

---

#### **SECTION 3: Trust Indicators (Enhanced)**

**Current State:** 4 trust badges  
**New State:** 4 trust badges + "Zero Patient Data Collection" emphasis

**Visual Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Trusted by Leading Research Institutions                      │
│  ─────────────────────────────────────────────────────────     │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  🔒      │  │  🔐      │  │  📊      │  │  🌐      │       │
│  │          │  │          │  │          │  │          │       │
│  │  HIPAA   │  │  End-to- │  │  12,482+ │  │  Multi-  │       │
│  │  Safe    │  │  End     │  │  De-ID   │  │  Site    │       │
│  │  Harbor  │  │  Encrypt │  │  Records │  │  Network │       │
│  │          │  │          │  │          │  │          │       │
│  │  Zero    │  │  TLS 1.3 │  │  Largest │  │  14 Sites│       │
│  │  Patient │  │  +       │  │  Outcomes│  │  4       │       │
│  │  IDs     │  │  AES-256 │  │  Database│  │  Countries│      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Card Design:**
- Background: `bg-slate-900/40`
- Border: `border border-slate-700`
- Padding: `p-6`
- Rounded: `rounded-2xl`
- Hover: `hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10`

**Typography:**
- **Icon:** 48px emoji or Lucide icon
- **Title:** 16px, `font-bold text-slate-200`
- **Subtitle:** 14px, `text-slate-400`
- **Detail:** 12px, `text-slate-500`

---

#### **SECTION 4: Unified Clinical Operations (Quantified)**

**Current State:** Generic pain point description  
**New State:** Quantified time savings

**Visual Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Is your clinical workflow fragmented?                         │
│  ─────────────────────────────────────────────────────────     │
│                                                                 │
│  IntakeQ for forms. Spruce for messaging. Spotify for music.   │
│  Excel for outcomes. A generic EHR for billing.                │
│                                                                 │
│  This fragmentation leads to administrative burnout and data   │
│  silos. Practitioners report spending 4-6 hours per week just  │
│  chasing forms and reconciling data across disconnected tools. │
│                                                                 │
│  PPN consolidates your clinical core into one unified flow.    │
│  Our Protocol Builder takes less than 2 minutes to complete—   │
│  saving you 200+ hours per year.                               │
│                                                                 │
│  That's time you can spend with patients, not paperwork.       │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                                                         │  │
│  │  [Visual: Before/After Workflow Diagram]               │  │
│  │                                                         │  │
│  │  BEFORE: 5 tools, 6 hours/week                         │  │
│  │  AFTER:  1 platform, <2 min/patient                    │  │
│  │                                                         │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Visual Design:**
- Highlight numbers in `text-emerald-400 font-black text-2xl`
- Use contrast: "4-6 hours/week" in red, "200+ hours saved" in green
- Before/After diagram with icons for each tool

---

#### **SECTION 5: Product Showcase (2 New Components Added)**

**Current State:** 3 components (Safety Risk Matrix, Clinic Radar, Patient Journey)  
**New State:** 5 components (add Regulatory Mosaic, Dosage Calculator)

**Updated Order:**
1. ✅ Safety Risk Matrix (Red glow, LEFT)
2. ✅ Clinic Performance Radar (Blue glow, RIGHT)
3. ✅ Patient Journey Snapshot (Green glow, LEFT)
4. ⭐ **NEW: Regulatory Mosaic** (Purple glow, RIGHT)
5. ⭐ **NEW: Dosage Calculator** (Amber glow, LEFT)

**Visual Pattern:**
```
LEFT (Red)     RIGHT (Blue)    LEFT (Green)   RIGHT (Purple)  LEFT (Amber)
[Safety]       [Radar]         [Journey]      [Regulatory]    [Dosage]
```

---

##### **NEW COMPONENT 1: Regulatory Mosaic**

**Visual Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  [Badge: Regulatory Intelligence]                              │
│                                                                 │
│  Navigate the legal landscape with confidence.                 │
│  ─────────────────────────────────────────────────────────     │
│                                                                 │
│  Track real-time regulatory changes across 50+ jurisdictions.  │
│  Know exactly where psilocybin, MDMA, and ketamine are legal   │
│  for therapeutic use—before you expand your practice.          │
│                                                                 │
│  [View Live Demo →]                                             │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                                                         │  │
│  │  [RegulatoryMosaicDemo Component]                      │  │
│  │                                                         │  │
│  │  Interactive map showing legal status by jurisdiction  │  │
│  │  Color-coded: Green (legal), Yellow (decrim), Red (illegal)│
│  │                                                         │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Component Specs:**
- **Glow:** Purple (`shadow-purple-500/20`)
- **Alignment:** RIGHT
- **Badge Color:** `bg-purple-500/10 text-purple-300`
- **Heading:** "Navigate the legal landscape with confidence."
- **Description:** "Track real-time regulatory changes across 50+ jurisdictions..."

**Dummy Data:**
- Show US map with state-by-state legal status
- Highlight Oregon (green), Colorado (green), California (yellow)
- Show legend: Legal, Decriminalized, Illegal
- Add tooltip on hover: "Oregon: Psilocybin legal for therapeutic use (Measure 109)"

---

##### **NEW COMPONENT 2: Dosage Calculator (Lead Magnet)**

**Visual Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  [Badge: Free Tool - No Account Required]                      │
│                                                                 │
│  Calculate safe dosages in seconds.                            │
│  ─────────────────────────────────────────────────────────     │
│                                                                 │
│  Factor in body weight, tolerance, and substance potency to    │
│  recommend evidence-based dosing ranges. Free forever—no login │
│  required.                                                      │
│                                                                 │
│  [Try It Now (Free) →]                                          │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                                                         │  │
│  │  [DosageCalculatorDemo Component]                      │  │
│  │                                                         │  │
│  │  Input: Substance, Body Weight, Tolerance              │  │
│  │  Output: Recommended dose range (low/med/high)         │  │
│  │                                                         │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Component Specs:**
- **Glow:** Amber (`shadow-amber-500/20`)
- **Alignment:** LEFT
- **Badge Color:** `bg-amber-500/10 text-amber-300`
- **Badge Text:** "Free Tool - No Account Required"
- **Heading:** "Calculate safe dosages in seconds."
- **Description:** "Factor in body weight, tolerance, and substance potency..."
- **CTA:** "Try It Now (Free)" (more prominent than other CTAs)

**Dummy Data:**
- Substance: Psilocybin
- Body Weight: 70 kg
- Tolerance: None
- Output: 
  - Low: 1.5g
  - Medium: 2.5g
  - High: 3.5g
- Safety note: "Based on Stamets Stack protocol"

**Lead Magnet Strategy:**
- **No login required** for basic calculator
- **Upgrade prompt:** "Want to save your calculations? Create a free account."
- **Conversion funnel:** Free Tool → Email Capture → Free Trial → Paid

---

### Mobile Responsiveness Specifications

**Breakpoints:**
- **Mobile:** <768px
- **Tablet:** 768px - 1024px
- **Desktop:** >1024px

**Mobile Changes:**
1. **Hero:**
   - H1: 36px (down from 72px)
   - Stack CTAs vertically
   - Hide "Watch Demo" button (show only on tablet+)

2. **Global Alliance:**
   - H2: 32px (down from 56px)
   - Reduce padding: `py-12` (down from `py-24`)

3. **Trust Indicators:**
   - Stack cards vertically (1 column)
   - Reduce card padding: `p-4` (down from `p-6`)

4. **Product Showcase:**
   - All components stack vertically
   - Remove left/right alternation
   - Reduce glow effects (performance)

5. **Component Demos:**
   - Scale down to fit mobile viewport
   - Simplify interactions (tap instead of hover)

---

## 2. "ALLIANCE" BRANDING INTEGRATION

### Visual Design System

**Primary Branding Elements:**
1. **H1 (Hero):** "Global Psychedelic Practitioner Alliance"
2. **H2 (Alliance Section):** "The Global Psychedelic Practitioner Alliance. Where Evidence Meets Experience."
3. **Footer:** "The Psychedelic Practitioners Alliance (PPN)"
4. **Sidebar:** "PPN Alliance Portal" (future update)

**Color Palette for "Alliance" Branding:**
- **Primary Gradient:** Purple (`from-purple-500 to-pink-500`)
- **Accent:** Emerald (`text-emerald-400`)
- **Background:** Deep slate (`bg-slate-900`)

**Typography:**
- Font: Inter Black for "Alliance"
- Size: 72px (Hero), 56px (Section), 24px (Footer)
- Gradient: `text-gradient-purple` class

**Visual Hierarchy:**
```
HERO (Most Prominent)
  ↓
ALLIANCE SECTION (Second Most Prominent)
  ↓
FOOTER (Subtle Reminder)
```

---

## 3. LEAD MAGNET UI/UX DESIGN

### Free-Tier Dosage Calculator

**Design Philosophy:**
- **Frictionless:** No login required
- **Valuable:** Provides real utility immediately
- **Trustworthy:** Clear safety disclaimers
- **Conversion-Optimized:** Subtle upgrade prompts

**UI Components:**

#### **Input Form:**
```tsx
<div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8">
  <h3 className="text-2xl font-black text-white mb-6">Dosage Calculator</h3>
  
  {/* Substance Selection */}
  <div className="mb-6">
    <label className="text-sm font-semibold text-slate-300 mb-2 block">
      Select Substance
    </label>
    <select className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-300">
      <option>Psilocybin</option>
      <option>MDMA</option>
      <option>Ketamine</option>
      <option>LSD</option>
    </select>
  </div>
  
  {/* Body Weight Input */}
  <div className="mb-6">
    <label className="text-sm font-semibold text-slate-300 mb-2 block">
      Body Weight (kg)
    </label>
    <input 
      type="number" 
      placeholder="70"
      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-300"
    />
  </div>
  
  {/* Tolerance Selection */}
  <div className="mb-6">
    <label className="text-sm font-semibold text-slate-300 mb-2 block">
      Tolerance Level
    </label>
    <div className="grid grid-cols-3 gap-3">
      <button className="px-4 py-3 bg-emerald-500/20 border-2 border-emerald-500 rounded-xl text-emerald-300 font-semibold">
        None
      </button>
      <button className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-400">
        Low
      </button>
      <button className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-400">
        High
      </button>
    </div>
  </div>
  
  {/* Calculate Button */}
  <button className="w-full px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black text-lg rounded-xl shadow-lg shadow-emerald-500/20 transform hover:scale-105 transition-all">
    Calculate Dosage
  </button>
</div>
```

#### **Output Display:**
```tsx
<div className="bg-gradient-to-br from-emerald-500/10 via-blue-500/10 to-purple-500/10 border-2 border-emerald-500/20 rounded-3xl p-8 mt-6">
  <h4 className="text-xl font-black text-white mb-4">Recommended Dosage Range</h4>
  
  {/* Dosage Range */}
  <div className="grid grid-cols-3 gap-4 mb-6">
    <div className="bg-slate-900/60 rounded-xl p-4 text-center">
      <div className="text-xs text-slate-400 mb-1">Low</div>
      <div className="text-3xl font-black text-emerald-400">1.5g</div>
      <div className="text-xs text-slate-500 mt-1">Threshold</div>
    </div>
    <div className="bg-slate-900/60 rounded-xl p-4 text-center border-2 border-emerald-500">
      <div className="text-xs text-slate-400 mb-1">Medium</div>
      <div className="text-3xl font-black text-emerald-400">2.5g</div>
      <div className="text-xs text-slate-500 mt-1">Recommended</div>
    </div>
    <div className="bg-slate-900/60 rounded-xl p-4 text-center">
      <div className="text-xs text-slate-400 mb-1">High</div>
      <div className="text-3xl font-black text-emerald-400">3.5g</div>
      <div className="text-xs text-slate-500 mt-1">Heroic</div>
    </div>
  </div>
  
  {/* Safety Note */}
  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6">
    <div className="flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-semibold text-amber-300 mb-1">Safety Note</p>
        <p className="text-xs text-slate-400">
          This calculator provides general guidance based on the Stamets Stack protocol. 
          Always consult with a licensed healthcare provider before administering any substance.
        </p>
      </div>
    </div>
  </div>
  
  {/* Upgrade Prompt (Subtle) */}
  <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-700">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold text-slate-300">Want to save your calculations?</p>
        <p className="text-xs text-slate-500">Create a free account to track dosing history</p>
      </div>
      <button className="px-4 py-2 bg-emerald-500/20 border border-emerald-500 text-emerald-300 font-semibold text-sm rounded-lg hover:bg-emerald-500/30 transition-colors">
        Sign Up Free
      </button>
    </div>
  </div>
</div>
```

**Conversion Strategy:**
1. **Free Access:** Full calculator, no login
2. **Value Add:** "Save calculations" prompt after first use
3. **Email Capture:** Optional account creation
4. **Upgrade Path:** "Unlock Drug Interaction Checker" (paid feature)

---

## 4. ACCESSIBILITY SPECIFICATIONS

### WCAG 2.2 AA Compliance

**Font Sizes:**
- Minimum: 14px (all body text)
- Preferred: 16px-18px
- Headings: 24px-72px

**Contrast Ratios:**
- Body text: 4.5:1 minimum
- Headings: 3:1 minimum
- Interactive elements: 4.5:1 minimum

**Keyboard Navigation:**
- All CTAs focusable
- Tab order follows visual hierarchy
- Focus indicators: `focus:ring-4 focus:ring-emerald-500/50`

**Screen Reader Support:**
- ARIA labels on all interactive elements
- Alt text on all images
- Semantic HTML (h1, h2, h3, nav, main, footer)

**Color Blindness:**
- No color-only meaning
- Icons + text for all indicators
- High contrast mode support

---

## 5. IMPLEMENTATION CHECKLIST FOR BUILDER

### Phase 1: Hero & Alliance Sections (3 hours)
- [ ] Update Hero H1 to "Global Psychedelic Practitioner Alliance"
- [ ] Update Hero subheadline with benefit-driven copy
- [ ] Add quantified trust indicators (840+ clinicians, 14 sites)
- [ ] Update CTAs ("Start Free Trial", "Watch Demo")
- [ ] Move Global Alliance section to line 260 (after Hero)
- [ ] Update Alliance section copy with "Where Evidence Meets Experience"
- [ ] Add purple gradient glow effect to Alliance section

### Phase 2: Trust Indicators & Unified Operations (2 hours)
- [ ] Enhance trust indicator cards with "Zero Patient IDs" emphasis
- [ ] Add hover effects to trust cards
- [ ] Update Unified Operations section with quantified time savings
- [ ] Add Before/After workflow diagram

### Phase 3: Component Showcase Additions (3 hours)
- [ ] Add Regulatory Mosaic component (purple glow, RIGHT)
- [ ] Add Dosage Calculator component (amber glow, LEFT)
- [ ] Ensure alternating left/right pattern
- [ ] Test all component demos on mobile

### Phase 4: Lead Magnet Implementation (2 hours)
- [ ] Build Dosage Calculator UI (input form + output display)
- [ ] Add safety disclaimers
- [ ] Add subtle upgrade prompt
- [ ] Test conversion funnel (Free → Email Capture → Sign Up)

### Phase 5: Mobile Responsiveness (2 hours)
- [ ] Test all sections on mobile (375px)
- [ ] Stack components vertically on mobile
- [ ] Reduce font sizes for mobile
- [ ] Test CTAs on mobile (tap targets 44px minimum)

### Phase 6: Accessibility & QA (2 hours)
- [ ] Run accessibility audit (Lighthouse, axe)
- [ ] Test keyboard navigation
- [ ] Test screen reader compatibility
- [ ] Verify contrast ratios
- [ ] Test on color blindness simulator

---

## 6. SUCCESS METRICS

**Before (Current State):**
- Time to understand value prop: ~45 seconds
- Bounce rate: Unknown
- Free trial signups: Unknown
- Lead magnet conversions: 0 (no lead magnets)

**After (Target State):**
- Time to understand value prop: <30 seconds
- Bounce rate: <40%
- Free trial signups: +25% (from clearer CTAs)
- Lead magnet conversions: 30% (Dosage Calculator → Email Capture)

---

## 7. DESIGNER SIGN-OFF

**Status:** ✅ **COMPLETE** - Ready for BUILDER implementation

**Deliverables:**
1. ✅ Landing Page Redesign Specification (Section-by-section)
2. ✅ "Alliance" Branding Integration (Visual design system)
3. ✅ Component Showcase Additions (Regulatory Mosaic, Dosage Calculator)
4. ✅ Lead Magnet UI/UX Design (Dosage Calculator)
5. ✅ Mobile Responsiveness Specifications
6. ✅ Accessibility Specifications (WCAG 2.2 AA)
7. ✅ Implementation Checklist for BUILDER

**Estimated Implementation Time:** 10 hours (2 days)

**Next Steps:**
1. BUILDER implements landing page updates
2. BUILDER creates Regulatory Mosaic and Dosage Calculator components
3. BUILDER tests mobile responsiveness
4. INSPECTOR QA review
5. Deploy to production

---

**DESIGNER:** All designs are grounded in MARKETER's VoC research and align with the "Clinical Sci-Fi" brand aesthetic. Ready for BUILDER implementation.
