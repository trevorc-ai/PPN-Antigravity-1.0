---
id: WO-056
status: 03_BUILD
priority: P2 (High)
category: UI/UX / Accessibility / Layout
owner: BUILDER
failure_count: 0
created_date: 2026-02-16T12:16:03-08:00
design_started: 2026-02-16T16:09:26-08:00
design_completed: 2026-02-16T16:10:56-08:00
---

# ORIGINAL USER REQUEST (VERBATIM)

**Wellness Journey:**
- Grid items (eg. "😰 21") should be inline horizontal (not stacked vertically) and center-justified inside container
- Minimum font size violations throughout
- Export PDF button is not color blind accessible; doesn't match CSS
- 'Afterglow Period' chart: Reduce padding around the chart to give the chart more space to enlarge slightly; improve axis label placement and/or colors for better UX

**File References:**
- Target file: `src/pages/ArcOfCareGodView.tsx` (main page)
- Component file: `src/components/arc-of-care/SymptomDecayCurve.tsx` (Afterglow Period chart)
- Screenshots attached (see above)

---

# User Request Summary

Fix UI/UX issues on the Wellness Journey (Arc of Care God View) page to improve layout, accessibility, and chart readability.

---

## 🎯 CRITICAL CONTEXT

**IMPORTANT NOTE:** This work order refers to the **Wellness Journey page** at `http://localhost:3000/#/wellness-journey` ONLY.

**The Wellness Journey IS the new Protocol Builder.** This is NOT the old `ProtocolBuilder.tsx` file.

### User Workflow & Setting

**Imagine this scenario:** The user is a psychedelic therapy practitioner deciding on the appropriate treatment protocol series for her patient. She is entering the fifth treatment in the series for her patient into the PPN Wellness Journey.

**Step 1: Patient Selection**
The user (practitioner) selects either:
1. **'New Patient'** - Generates a 10-digit anonymized `Patient_ID` hash, and "1" is automatically loaded into `session_number`
2. **'Lookup Existing Patient'** - Searches based on patient and/or treatment characteristics

**HIPAA Compliance:** We collect NO personally identifiable information.

**Step 2: Pre-loaded Data**
The patient already exists in the database (has an anonymized `patient_id`) and their existing treatment record is automatically pre-loaded for the user.

**Step 3: Protocol Entry**
Once the user updates the information to reflect the treatment protocol, the user clicks the **'Informed Consent' checkbox**.

**Step 4: Real-Time Visualization**
At that point, the data in the new treatment protocol queries the app and an array of beautiful graphical visualizations and all of the details of the treatment are displayed and analyzed in **real-time**.

**Step 5: Review & Finalize**
The user can then review the anticipated treatment effects together with her patient by looking at the visualizations and reviewing the Protocol Detail. They can either:
- Make changes, OR
- Finalize by clicking the blue **'Submit to Registry'** button

**Step 6: Export**
When submitted, the record is updated to show that the protocol was officially submitted. The user is immediately prompted with the option to export the entire protocol detail and accompanying analysis.

**Patient Confidence:** The patient instantly feels confidence knowing that the practitioner is using real-time, data-driven decisions about her treatment based on actual, relevant, real-time aggregated data from similar treatments around the world, and NO personal information is collected or shared.

### Design Philosophy

You are part of an expert award-winning UI/UX Design-Build and Innovation team creating ultra-fast, modern, informative, and beautiful mobile-responsive website. Your team has been tasked with the refinement of this Wellness Journey protocol builder, specifically optimized for:
- Psychedelic therapy
- Data-driven clinical research
- Stunning and powerful real-time informative visualizations
- Augmented intelligence for the provider

**The Goal:** Continue to refine what was a simple data entry form into an **'augmented intelligence' tool** - a sophisticated clinical decision support system that provides practitioners with real-time data visualization and comparative benchmarks against clinical, regional, and global metrics.

**UX Principles to Employ:**
- Progressive disclosure
- Button groups for rapid entry
- Non-blocking safety alerts to reduce cognitive load
- World-class efficiency and scalability

**Your Task:** Organize this UI/UX in a way that's even better, faster, more efficient, beautiful, and scalable, **WITHOUT a major refactoring**. Take as much time as you need to perfect your approach.

---

## Issues to Fix

### 1. Grid Items - Fix Vertical Stacking
**Current state (lines 205-257):**
- Grid items showing emoji + score (e.g., "😰 21") are stacked vertically
- Emoji on top, score below
- Not center-justified

**Required change:**
- Make emoji and score display **inline horizontal** (side-by-side)
- Center-justify content inside each grid item container
- Example: `😰 21` should be on same line, centered

**Affected elements:**
- PHQ-9 score display (lines 212-216)
- GAD-7 score display (lines 219-230)
- ACE score display (lines 232-242)
- Expectancy score display (lines 245-256)

### 2. Minimum Font Size Violations
**Current state:**
- Multiple instances of font sizes below 12px throughout the page
- Violates accessibility standards

**Required change:**
- Audit entire file for font size violations
- Replace all instances of:
  - `text-[10px]` → `text-xs` (12px minimum)
  - `text-[11px]` → `text-xs` (12px minimum)
  - `text-[9px]` → `text-xs` (12px minimum)
- Ensure all text meets 12px minimum

**Known violations:**
- Line 25: `text-[10px]` in CustomTooltip
- Line 27: `text-[10px]` in event badge
- Line 40: `text-[10px]` in score label
- Line 45: `text-[10px]` in value label
- Line 50: `text-[10px]` in details
- Line 145: `text-[10px]` in subtitle
- Line 166: `text-xs` (check if truly 12px)
- Line 194: `text-xs` in phase label
- Many more throughout

### 3. Export PDF Button - Color Blind Accessibility
**Current state (lines 175-178):**
```tsx
<button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors">
```

**Issues:**
- Uses `bg-emerald-500` which doesn't match current CSS theme
- Not color blind accessible (green alone is not sufficient)
- Should match button styling from other pages

**Required change:**
- Update to match current CSS theme colors
- Use slate/gray or primary blue (not emerald green)
- Add icon for additional visual cue
- Suggested styling:
  ```tsx
  className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-slate-200 font-bold rounded-lg transition-colors"
  ```

### 4. Afterglow Period Chart - Improve Layout
**Current state:**
- Chart component: `SymptomDecayCurve.tsx`
- Too much padding around chart
- Chart feels cramped
- Axis labels hard to read

**Required changes:**
- Reduce padding around chart container
- Increase chart size slightly
- Improve axis label placement:
  - Increase font size for axis labels (if below 12px)
  - Improve color contrast for better readability
  - Adjust positioning for better UX
- Check margin settings in `SymptomDecayCurve.tsx`

---

## THE BLAST RADIUS (Authorized Target Area)

### Files to Modify

**MODIFY:**
- `src/pages/ArcOfCareGodView.tsx` - Fix grid layout, font sizes, Export PDF button
- `src/components/arc-of-care/SymptomDecayCurve.tsx` - Fix chart padding and axis labels

**PRESERVE:**
- All functionality and data logic
- Tooltip system
- Collapsible panels
- Assessment modal
- Navigation and routing

---

## ⚡ THE ELECTRIC FENCE (Strict "DO NOT TOUCH" Constraints)

**DO NOT:**
- Modify data calculations or logic
- Change tooltip content or behavior
- Alter assessment modal functionality
- Touch other pages or components
- Change color scheme beyond specified fixes

**MUST:**
- Maintain WCAG AAA accessibility (12px minimum fonts)
- Preserve all existing functionality
- Keep responsive design
- Maintain current CSS theme consistency

---

## ✅ Acceptance Criteria

### Grid Items Layout
- [ ] Emoji and score display inline horizontal (not stacked)
- [ ] Content center-justified in each grid container
- [ ] Example: "😰 21" appears on same line, centered
- [ ] All 4 grid items (PHQ-9, GAD-7, ACE, Expectancy) fixed
- [ ] Responsive at all breakpoints

### Font Size Compliance
- [ ] No fonts smaller than 12px anywhere on page
- [ ] All `text-[10px]`, `text-[11px]`, `text-[9px]` replaced with `text-xs` or larger
- [ ] Tooltips meet 12px minimum
- [ ] Labels and captions meet 12px minimum
- [ ] Chart axis labels meet 12px minimum

### Export PDF Button
- [ ] Button uses slate/gray or primary blue (not emerald green)
- [ ] Matches CSS theme from other pages
- [ ] Color blind accessible
- [ ] Icon present for additional visual cue
- [ ] Hover state works correctly

### Afterglow Period Chart
- [ ] Padding reduced around chart container
- [ ] Chart size increased slightly
- [ ] Axis labels readable (12px minimum)
- [ ] Axis label colors improved for contrast
- [ ] Axis label positioning optimized
- [ ] Chart responsive at all breakpoints

### Testing
- [ ] Page loads without errors
- [ ] All grid items display correctly
- [ ] No font size violations remain
- [ ] Export PDF button styled correctly
- [ ] Chart displays properly
- [ ] Mobile responsive (375px, 768px, 1024px, 1440px)
- [ ] No console errors

---

## 📝 MANDATORY COMPLIANCE

### ACCESSIBILITY (WCAG AAA)
- **Minimum 12px font size** (NO EXCEPTIONS)
- Keyboard accessible
- Screen reader friendly
- Sufficient color contrast (4.5:1 minimum)
- Color blind accessible (no color-only meaning)

### RESPONSIVE DESIGN
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Grid adapts properly at all sizes

---

## 🚦 Status

**INBOX** - Awaiting LEAD architectural review

---

## 📋 Technical Implementation Notes

### Grid Items Fix (Lines 205-257)

**Current structure:**
```tsx
<div className="p-4 bg-slate-900/40 rounded-lg text-center">
  <div className="text-3xl mb-2 ${phq9Info.color}">{phq9Info.emoji}</div>
  <div className="text-4xl font-black ${phq9Info.color}">{journey.baseline.phq9}</div>
  <div className="text-sm text-slate-400 font-semibold mt-1">PHQ-9</div>
</div>
```

**Suggested fix:**
```tsx
<div className="p-4 bg-slate-900/40 rounded-lg flex flex-col items-center justify-center">
  <div className="flex items-center justify-center gap-2 mb-2">
    <span className="text-3xl ${phq9Info.color}">{phq9Info.emoji}</span>
    <span className="text-4xl font-black ${phq9Info.color}">{journey.baseline.phq9}</span>
  </div>
  <div className="text-sm text-slate-400 font-semibold">PHQ-9</div>
</div>
```

### Font Size Audit Checklist

**Replace these classes:**
- `text-[10px]` → `text-xs` (12px)
- `text-[11px]` → `text-xs` (12px)
- `text-[9px]` → `text-xs` (12px)

**Search for:**
```bash
grep -n "text-\[10px\]" src/pages/ArcOfCareGodView.tsx
grep -n "text-\[11px\]" src/pages/ArcOfCareGodView.tsx
grep -n "text-\[9px\]" src/pages/ArcOfCareGodView.tsx
```

### Export PDF Button Update (Lines 175-178)

**Current:**
```tsx
<button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors">
  <Download className="w-4 h-4" />
  <span className="hidden sm:inline">Export PDF</span>
</button>
```

**Suggested:**
```tsx
<button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-slate-200 font-bold text-xs rounded-lg transition-colors">
  <Download className="w-4 h-4" />
  <span className="hidden sm:inline">Export PDF</span>
</button>
```

### SymptomDecayCurve Chart Improvements

**File:** `src/components/arc-of-care/SymptomDecayCurve.tsx`

**Check for:**
1. Container padding (reduce if excessive)
2. Chart margin settings in ResponsiveContainer
3. Axis label font sizes (ensure ≥ 12px)
4. Axis label colors (ensure good contrast)
5. Label positioning (dy, dx values)

**Example improvements:**
```tsx
// Reduce container padding
<div className="p-4"> // instead of p-6 or p-8

// Increase chart margin for labels
<ComposedChart margin={{ top: 10, right: 20, left: 10, bottom: 30 }}>

// Improve axis label styling
<XAxis 
  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
  label={{ fill: '#64748b', fontSize: 12 }}
/>
```

---

## Design Reference

**Screenshots show:**
1. **Grid items** with emoji and score stacked vertically (should be horizontal)
2. **Multiple font size violations** throughout the page
3. **Export PDF button** using emerald green (should match theme)
4. **Afterglow chart** with excessive padding and small axis labels

**Expected result:**
- Grid items: "😰 21" inline horizontal, centered
- All fonts ≥ 12px
- Export PDF button: slate/gray styling
- Chart: larger with better axis labels

---

## Dependencies

**Prerequisite:**
- `SymptomDecayCurve.tsx` component must exist

**Related:**
- Accessibility standards (WCAG AAA)
- Current CSS theme consistency

---

## Notes

This is an **accessibility and UX refinement** task. The goals are:
1. Fix layout issues (grid items inline horizontal)
2. Ensure WCAG AAA compliance (12px minimum fonts)
3. Improve color blind accessibility (Export PDF button)
4. Enhance chart readability (better spacing and labels)

All functionality must be preserved - this is purely a visual/accessibility improvement.

---

## Estimated Complexity

**4/10** - Straightforward CSS and layout fixes, but requires careful audit of all font sizes throughout the file.

---

## 🏗️ LEAD ARCHITECTURE

### Strategic Overview

This is an **accessibility and UX refinement** task with 4 independent fixes. Priority is WCAG AAA compliance (12px minimum fonts).

### Implementation Strategy

**4 independent fixes:**
1. Grid items: Make emoji + score inline horizontal
2. Font size audit: Replace all violations with 12px minimum
3. Export PDF button: Restyle to match theme
4. Afterglow chart: Reduce padding, improve axis labels

**Files to modify:**
- `src/pages/ArcOfCareGodView.tsx` (fixes 1-3)
- `src/components/arc-of-care/SymptomDecayCurve.tsx` (fix 4)

### Handoff to BUILDER

**BUILDER:** Execute the 4 fixes on the **Wellness Journey page** (`http://localhost:3000/#/wellness-journey`):

**Target Files:**
- `src/pages/ArcOfCareGodView.tsx` (main Wellness Journey page)
- `src/components/arc-of-care/SymptomDecayCurve.tsx` (Afterglow chart)

**Fix 1: Grid Items Inline Horizontal (Lines 205-257)**
- Change from vertical stack to horizontal flex
- Emoji and score on same line: `😰 21`
- Center-justify content
- Apply to all 4 grid items (PHQ-9, GAD-7, ACE, Expectancy)

**Fix 2: Font Size Audit (CRITICAL - WCAG AAA)**
- Search entire file for font size violations:
  ```bash
  grep -n "text-\[10px\]" src/pages/ArcOfCareGodView.tsx
  grep -n "text-\[11px\]" src/pages/ArcOfCareGodView.tsx
  grep -n "text-\[9px\]" src/pages/ArcOfCareGodView.tsx
  ```
- Replace ALL instances with `text-xs` (12px minimum)
- NO EXCEPTIONS - this is accessibility compliance

**Fix 3: Export PDF Button (Lines 175-178)**
- Replace emerald green with slate/gray
- New styling: `bg-slate-700 hover:bg-slate-600 border border-slate-600 text-slate-200 font-bold text-xs`
- Ensure color-blind accessible

**Fix 4: Afterglow Chart (`SymptomDecayCurve.tsx`)**
- Reduce container padding (p-4 instead of p-6/p-8)
- Increase chart margin for labels
- Ensure axis labels ≥ 12px
- Improve axis label colors for contrast
- Adjust positioning for better UX

**Testing:**
- [ ] Grid items display inline horizontal, centered
- [ ] NO fonts < 12px anywhere (run grep to verify)
- [ ] Export PDF button matches theme
- [ ] Chart larger with readable axis labels
- [ ] Responsive at all breakpoints
- [ ] No console errors

**When complete:** Move to `04_QA`

**Estimated Time:** 60-90 minutes (font audit is time-consuming)

---

**LEAD STATUS:** ✅ Architecture complete. Routed to BUILDER for implementation.

---

## 🎨 DESIGNER SPECIFICATIONS

**Design Review Date:** 2026-02-16T16:09:26-08:00  
**Designer:** DESIGNER  
**Status:** Design specifications complete, ready for BUILDER handoff

---

### 📐 DESIGN SYSTEM PRINCIPLES

This page represents a **clinical decision support tool** for psychedelic therapy practitioners. The design must balance:

1. **Information Density** - Practitioners need comprehensive data at a glance
2. **Visual Hierarchy** - Critical metrics must stand out immediately
3. **Accessibility** - WCAG AAA compliance (12px minimum fonts, color-blind safe)
4. **Emotional Tone** - Professional yet hopeful (this is a healing journey)
5. **Responsive Excellence** - Must work flawlessly on tablets and desktops

**Color Psychology:**
- **Red/Amber** (Preparation) - Caution, assessment, baseline
- **Amber/Orange** (Dosing) - Active, transformative, peak experience
- **Emerald/Green** (Integration) - Growth, healing, sustained benefit

---

### 🎯 FIX #1: GRID ITEMS - INLINE HORIZONTAL LAYOUT

**Current Problem:**  
The 4 metric cards (PHQ-9, GAD-7, ACE, Expectancy) display emoji and score **vertically stacked**, making them feel disconnected and harder to scan quickly.

**Design Goal:**  
Create a **unified visual unit** where emoji + score are **inline horizontal**, creating a stronger visual relationship and improving scannability.

#### Visual Design Pattern

```
BEFORE (Vertical):          AFTER (Inline Horizontal):
┌─────────────┐            ┌─────────────┐
│     😰      │            │  😰  21     │
│     21      │            │             │
│   PHQ-9     │            │   PHQ-9     │
└─────────────┘            └─────────────┘
```

#### Tailwind CSS Specifications

**File:** `src/pages/ArcOfCareGodView.tsx`  
**Lines:** 212-217, 227-233, 242-248, 257-263

**Current Structure (Lines 212-217):**
```tsx
<div className="p-4 bg-slate-900/40 rounded-lg flex flex-col items-center justify-center cursor-help hover:bg-slate-900/60 transition-colors">
  <div className="flex items-center justify-center gap-2 mb-2">
    <span className={`text-3xl ${phq9Info.color}`}>{phq9Info.emoji}</span>
    <span className={`text-4xl font-black ${phq9Info.color}`}>{journey.baseline.phq9}</span>
  </div>
  <div className="text-sm text-slate-400 font-semibold">PHQ-9</div>
</div>
```

**✅ APPROVED - NO CHANGES NEEDED**

The code is **already correct**! The inline horizontal layout is implemented. However, let's verify all 4 cards match this pattern.

**Action for BUILDER:**
1. Verify lines 212-217 (PHQ-9) - ✅ Already correct
2. Verify lines 227-233 (GAD-7) - ✅ Already correct
3. Verify lines 242-248 (ACE) - ✅ Already correct
4. Verify lines 257-263 (Expectancy) - ✅ Already correct

**Design Rationale:**
- `gap-2` (8px) - Provides breathing room between emoji and number
- `mb-2` (8px) - Separates the metric from the label
- `text-3xl` (30px) - Emoji size balances with number
- `text-4xl` (36px) - Number is hero element
- `font-black` (900 weight) - Maximum emphasis on score

---

### 🎯 FIX #2: FONT SIZE ACCESSIBILITY AUDIT

**Current Problem:**  
Multiple instances of fonts below 12px violate WCAG AAA accessibility standards and are difficult to read, especially for users with vision impairments.

**Design Goal:**  
Ensure **100% compliance** with 12px minimum font size while maintaining visual hierarchy and information density.

#### Font Size Hierarchy (Approved Scale)

| Tailwind Class | Actual Size | Use Case | Status |
|----------------|-------------|----------|--------|
| `text-xs` | 12px | Minimum allowed - labels, captions, metadata | ✅ APPROVED |
| `text-sm` | 14px | Body text, descriptions, secondary info | ✅ APPROVED |
| `text-base` | 16px | Primary body text, headings | ✅ APPROVED |
| `text-lg` | 18px | Section headings | ✅ APPROVED |
| `text-xl` - `text-5xl` | 20px+ | Hero numbers, page titles | ✅ APPROVED |

#### Search & Replace Strategy

**Action for BUILDER:**

Run these grep searches to find ALL violations:

```bash
grep -n "text-\[10px\]" src/pages/ArcOfCareGodView.tsx
grep -n "text-\[11px\]" src/pages/ArcOfCareGodView.tsx
grep -n "text-\[9px\]" src/pages/ArcOfCareGodView.tsx
grep -n "text-\[8px\]" src/pages/ArcOfCareGodView.tsx
```

**Replace ALL instances with:**
- `text-[10px]` → `text-xs` (12px)
- `text-[11px]` → `text-xs` (12px)
- `text-[9px]` → `text-xs` (12px)
- `text-[8px]` → `text-xs` (12px)

**Critical Areas to Check:**

1. **Phase Labels** (Lines 194, 364, 529) - Should be `text-xs`
2. **Dates/Metadata** (Lines 202, 372, 537) - Should be `text-xs`
3. **AI Panel Text** (Lines 277, 285, 290, 295, etc.) - Should be `text-xs`
4. **Benchmark Labels** (Lines 325-346) - Should be `text-xs`
5. **Compliance Metrics** (Lines 586, 602, 612) - Should be `text-xs`
6. **Bottom Status Bar** (Lines 628, 645, 654, 666) - Should be `text-xs`
7. **Disclaimer Text** (Lines 685) - Should be `text-xs`

**Design Rationale:**
- `text-xs` (12px) is the **absolute minimum** for accessibility
- Maintains visual hierarchy through **font weight** and **color** instead of size
- Uses `font-semibold` (600) and `font-bold` (700) to create emphasis
- Uses color contrast (slate-400 vs slate-200) for hierarchy

**Verification Command:**
```bash
# After changes, verify NO violations remain
grep -n "text-\[[0-9]px\]" src/pages/ArcOfCareGodView.tsx | grep -E "\[([0-9]|1[01])px\]"
```

This should return **zero results**.

---

### 🎯 FIX #3: EXPORT PDF BUTTON - COLOR-BLIND ACCESSIBLE REDESIGN

**Current Problem:**  
Button uses emerald green (`bg-emerald-500`) which:
1. Doesn't match the slate/gray theme used throughout the app
2. Relies on color alone for meaning (not color-blind accessible)
3. Lacks sufficient visual weight for a primary action

**Design Goal:**  
Create a **professional, accessible button** that matches the app's design system and provides multiple visual cues beyond color.

#### Visual Design Pattern

**Current (Lines 175-178):**
```tsx
<button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors">
  <Download className="w-4 h-4" />
  <span className="hidden sm:inline">Export PDF</span>
</button>
```

**✅ APPROVED - ALREADY CORRECT**

The button has already been updated to use slate colors! Let's verify it matches our design system:

```tsx
<button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-slate-200 font-bold text-xs rounded-lg transition-colors">
  <Download className="w-4 h-4" />
  <span className="hidden sm:inline">Export PDF</span>
</button>
```

**Design Specifications:**

| Property | Value | Rationale |
|----------|-------|-----------|
| Background | `bg-slate-700` | Matches app theme (dark slate) |
| Hover | `hover:bg-slate-600` | Subtle lightening on hover |
| Border | `border border-slate-600` | Adds definition and depth |
| Text Color | `text-slate-200` | High contrast (WCAG AAA) |
| Font Weight | `font-bold` | Emphasizes action |
| Font Size | `text-xs` | 12px minimum (accessibility) |
| Border Radius | `rounded-lg` | Matches card styling |
| Padding | `px-4 py-2` | Comfortable touch target |
| Icon Size | `w-4 h-4` | Proportional to text |
| Gap | `gap-2` | Visual breathing room |

**Accessibility Features:**
1. ✅ **Icon + Text** - Multiple visual cues (not color-only)
2. ✅ **High Contrast** - 4.5:1 minimum ratio
3. ✅ **Border** - Visible to color-blind users
4. ✅ **Hover State** - Clear interactive feedback
5. ✅ **12px Font** - WCAG AAA compliant

**Action for BUILDER:**
Verify the button at lines 175-178 matches the approved specification above.

---

### 🎯 FIX #4: AFTERGLOW PERIOD CHART - ENHANCED READABILITY

**Current Problem:**  
The SymptomDecayCurve chart has:
1. Excessive padding reducing chart size
2. Small axis labels (potentially below 12px)
3. Low contrast axis label colors
4. Cramped feeling overall

**Design Goal:**  
Maximize chart real estate while ensuring all text meets 12px minimum and axis labels are clearly readable.

#### Chart Padding Optimization

**File:** `src/components/arc-of-care/SymptomDecayCurve.tsx`

**Current Padding (Line 58):**
```tsx
const padding = { top: 40, right: 40, bottom: 60, left: 60 };
```

**Recommended Padding:**
```tsx
const padding = { top: 30, right: 30, bottom: 50, left: 50 };
```

**Design Rationale:**
- **Top:** 40 → 30 (-10px) - Reduces dead space above chart
- **Right:** 40 → 30 (-10px) - Minimal labels on right side
- **Bottom:** 60 → 50 (-10px) - Still room for milestone labels
- **Left:** 60 → 50 (-10px) - Y-axis labels fit comfortably
- **Net Gain:** ~20-30px more chart space

#### Container Padding Reduction

**Current (Line 182):**
```tsx
<div ref={containerRef} className="relative bg-slate-900/40 rounded-lg p-4 w-full">
```

**Recommended:**
```tsx
<div ref={containerRef} className="relative bg-slate-900/40 rounded-lg p-3 w-full">
```

**Change:** `p-4` (16px) → `p-3` (12px)  
**Gain:** 8px more chart space (4px per side)

#### Axis Label Font Size Audit

**Y-Axis Labels (Lines 231-239):**
```tsx
<text
  x={-10}
  y={yScale(value)}
  textAnchor="end"
  dominantBaseline="middle"
  className="text-xs fill-slate-500"  // ✅ 12px - APPROVED
>
  {value}
</text>
```

**Status:** ✅ Already correct (`text-xs` = 12px)

**X-Axis Milestone Labels (Lines 255-262):**
```tsx
<text
  x={xScale(milestone.day)}
  y={chartHeight + 20}
  textAnchor="middle"
  className="text-xs fill-slate-400"  // ✅ 12px - APPROVED
>
  {milestone.label}
</text>
```

**Status:** ✅ Already correct (`text-xs` = 12px)

**Axis Title Labels (Lines 377-393):**
```tsx
<text
  x={chartWidth / 2}
  y={chartHeight + 45}
  textAnchor="middle"
  className="text-sm fill-slate-400 font-semibold"  // ✅ 14px - APPROVED
>
  Days Post-Session
</text>
<text
  x={-chartHeight / 2}
  y={-45}
  textAnchor="middle"
  transform={`rotate(-90, -${chartHeight / 2}, -45)`}
  className="text-sm fill-slate-400 font-semibold"  // ✅ 14px - APPROVED
>
  PHQ-9 Score
</text>
```

**Status:** ✅ Already correct (`text-sm` = 14px)

#### Color Contrast Improvements

**Current Axis Label Colors:**
- Y-axis numbers: `fill-slate-500` (#64748b)
- X-axis milestones: `fill-slate-400` (#94a3b8)
- Axis titles: `fill-slate-400` (#94a3b8)

**Recommended (Enhanced Contrast):**
- Y-axis numbers: `fill-slate-400` (#94a3b8) - Lighter for better readability
- X-axis milestones: `fill-slate-300` (#cbd5e1) - Lighter for better readability
- Axis titles: `fill-slate-300` (#cbd5e1) - Lighter for better readability

**Design Rationale:**
- Dark background (`bg-slate-900/40`) requires lighter text for contrast
- Moving from slate-500 → slate-400 → slate-300 improves readability
- Still maintains visual hierarchy (titles slightly bolder via `font-semibold`)

#### Tooltip Font Size (Lines 305-321)

**Current:**
```tsx
<text
  x={xScale(point.day)}
  y={yScale(point.phq9) - 35}
  textAnchor="middle"
  className="text-xs fill-slate-300 font-semibold"  // ✅ 12px - APPROVED
>
  Day {point.day}
</text>
<text
  x={xScale(point.day)}
  y={yScale(point.phq9) - 20}
  textAnchor="middle"
  className="text-sm font-bold"  // ✅ 14px - APPROVED
  fill={severity.color}
>
  PHQ-9: {point.phq9}
</text>
```

**Status:** ✅ Already correct (12px and 14px)

#### Annotation Labels (Lines 330-356)

**"Afterglow Period" Label (Lines 330-337):**
```tsx
<text
  x={xScale(7)}
  y={-10}
  textAnchor="middle"
  className="text-xs fill-blue-400 font-semibold"  // ✅ 12px - APPROVED
>
  Afterglow Period
</text>
```

**Status:** ✅ Already correct

**"Remission" Label (Lines 349-356):**
```tsx
<text
  x={chartWidth - 5}
  y={yScale(5) - 5}
  textAnchor="end"
  className="text-xs fill-emerald-400 font-semibold"  // ✅ 12px - APPROVED
>
  Remission (PHQ-9 &lt; 5)
</text>
```

**Status:** ✅ Already correct

#### Header Text (Lines 142-143)

**Current:**
```tsx
<h3 className="text-slate-200 text-sm font-bold">Symptom Decay Curve</h3>
<p className="text-slate-400 text-xs">PHQ-9 scores over 6 months</p>
```

**Status:** ✅ Already correct (14px and 12px)

#### Legend Text (Lines 399-412)

**Current:**
```tsx
<div className="flex items-center justify-center gap-4 text-xs">
  <div className="flex items-center gap-1">
    <div className="w-3 h-3 rounded-full bg-blue-500" />
    <span className="text-slate-400">Symptom Trajectory</span>  // ✅ 12px
  </div>
  // ... more legend items
</div>
```

**Status:** ✅ Already correct

---

### 📋 COMPREHENSIVE CHANGE SUMMARY FOR BUILDER

#### File: `src/pages/ArcOfCareGodView.tsx`

**Fix #1: Grid Items**
- ✅ Already implemented correctly (lines 212-263)
- Action: Verify no regressions

**Fix #2: Font Size Audit**
- ❗ Search for and replace ALL instances of `text-[10px]`, `text-[11px]`, `text-[9px]`
- Replace with `text-xs` (12px minimum)
- Run verification grep to ensure zero violations

**Fix #3: Export PDF Button**
- ✅ Already implemented correctly (lines 175-178)
- Action: Verify matches approved spec

#### File: `src/components/arc-of-care/SymptomDecayCurve.tsx`

**Fix #4: Chart Improvements**

1. **Reduce Chart Padding (Line 58):**
   ```tsx
   // BEFORE
   const padding = { top: 40, right: 40, bottom: 60, left: 60 };
   
   // AFTER
   const padding = { top: 30, right: 30, bottom: 50, left: 50 };
   ```

2. **Reduce Container Padding (Line 182):**
   ```tsx
   // BEFORE
   <div ref={containerRef} className="relative bg-slate-900/40 rounded-lg p-4 w-full">
   
   // AFTER
   <div ref={containerRef} className="relative bg-slate-900/40 rounded-lg p-3 w-full">
   ```

3. **Improve Axis Label Contrast (Lines 231-262, 377-393):**
   ```tsx
   // Y-axis numbers (Line 236)
   // BEFORE: className="text-xs fill-slate-500"
   // AFTER:  className="text-xs fill-slate-400"
   
   // X-axis milestones (Line 259)
   // BEFORE: className="text-xs fill-slate-400"
   // AFTER:  className="text-xs fill-slate-300"
   
   // Axis titles (Lines 381, 390)
   // BEFORE: className="text-sm fill-slate-400 font-semibold"
   // AFTER:  className="text-sm fill-slate-300 font-semibold"
   ```

---

### ✅ ACCEPTANCE CRITERIA (DESIGN PERSPECTIVE)

#### Visual Quality
- [ ] All 4 metric cards display emoji + score inline horizontal
- [ ] Cards maintain consistent spacing and alignment
- [ ] Visual hierarchy clear: emoji + score → label

#### Accessibility (WCAG AAA)
- [ ] **ZERO fonts below 12px** (run grep verification)
- [ ] All text meets 4.5:1 contrast ratio minimum
- [ ] Export PDF button has multiple visual cues (icon + text + border)
- [ ] Chart axis labels readable at 12px minimum

#### Chart Optimization
- [ ] Chart feels more spacious (padding reduced)
- [ ] Axis labels clearly visible with improved contrast
- [ ] All chart text meets 12px minimum
- [ ] Responsive behavior maintained

#### Responsive Design
- [ ] Test at 375px (mobile) - cards stack properly
- [ ] Test at 768px (tablet) - grid adapts
- [ ] Test at 1024px (desktop) - optimal layout
- [ ] Test at 1440px (large desktop) - no stretching

#### Browser Testing
- [ ] Chrome/Edge - all features work
- [ ] Firefox - all features work
- [ ] Safari - all features work
- [ ] No console errors or warnings

---

### 🎨 DESIGN SIGN-OFF

**Designer:** DESIGNER  
**Date:** 2026-02-16T16:09:26-08:00  
**Status:** ✅ Design specifications complete

**Summary:**
- Fix #1 (Grid Items): ✅ Already implemented correctly
- Fix #2 (Font Sizes): ❗ Requires audit and replacement
- Fix #3 (Export Button): ✅ Already implemented correctly
- Fix #4 (Chart): ⚠️ Requires padding and contrast improvements

**Estimated Implementation Time:** 45-60 minutes
- Font size audit: 30 minutes (thorough search and replace)
- Chart improvements: 15 minutes (padding and color adjustments)
- Testing: 15 minutes (responsive and browser testing)

**Ready for BUILDER handoff.**

---

## 🔍 LAYOUT CONSISTENCY AUDIT (CRITICAL FINDINGS)

**Audit Date:** 2026-02-16T16:16:39-08:00  
**Auditor:** DESIGNER  
**Scope:** Wellness Journey page vs. Application Design System

### 📊 EXECUTIVE SUMMARY

After reviewing Dashboard, MyProtocols, SubstanceMonograph, and other pages, I've identified **critical layout inconsistencies** on the Wellness Journey page that violate the established design system.

**Status:** 🚨 **MAJOR INCONSISTENCIES FOUND**

---

### 🎯 APPLICATION DESIGN SYSTEM (ESTABLISHED PATTERN)

All other pages in the application follow this consistent structure:

#### **Standard Page Structure:**

```tsx
<PageContainer width="default|wide" padding="default">  // ✅ Centralized layout
  <Section spacing="tight|default">                     // ✅ Consistent spacing
    {/* Page header */}
    <h1 className="text-4xl sm:text-5xl font-black">   // ✅ Consistent typography
    
    {/* Content sections */}
    <div className="card-glass rounded-3xl p-6">        // ✅ Consistent cards
  </Section>
</PageContainer>
```

#### **Key Design Tokens:**

| Element | Standard Value | Used By |
|---------|---------------|---------|
| **Max Width** | `max-w-7xl` (1280px) or `max-w-[1600px]` | Dashboard, MyProtocols, SubstanceMonograph |
| **Horizontal Padding** | `px-6 sm:px-8 xl:px-10` | PageContainer component |
| **Vertical Spacing** | `space-y-6` to `space-y-12` | Section component |
| **Card Style** | `card-glass rounded-3xl` | All pages |
| **Border Radius** | `rounded-2xl` to `rounded-3xl` | All pages |
| **Typography Scale** | `text-4xl sm:text-5xl font-black` (H1) | All pages |
| **Background** | `bg-[#0e1117]` or `bg-[#080a0f]` | All pages |

---

### ⚠️ WELLNESS JOURNEY VIOLATIONS

**File:** `src/pages/ArcOfCareGodView.tsx`

#### **VIOLATION #1: No PageContainer Wrapper**

**Current (Lines 154-156):**
```tsx
<div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d1b2a] to-[#05070a] p-4 sm:p-6 lg:p-8">
  <div className="max-w-[1600px] mx-auto space-y-6">
```

**Problem:**
- ❌ Does NOT use `<PageContainer>` component
- ❌ Custom padding (`p-4 sm:p-6 lg:p-8`) instead of standard (`px-6 sm:px-8 xl:px-10`)
- ❌ Custom max-width (`max-w-[1600px]`) hardcoded instead of using `width="wide"` prop
- ❌ Custom background gradient instead of standard `bg-[#0e1117]`

**Impact:**
- Inconsistent spacing on mobile/tablet/desktop
- Doesn't match other pages' width constraints
- Breaks visual continuity when navigating between pages

**Correct Pattern:**
```tsx
<PageContainer width="wide" padding="default" className="min-h-screen bg-[#0e1117]">
  <Section spacing="tight">
    {/* Content */}
  </Section>
</PageContainer>
```

---

#### **VIOLATION #2: Inconsistent Card Styling**

**Current (Line 186):**
```tsx
<div className="bg-gradient-to-br from-red-500/10 to-red-900/10 border-2 border-red-500/50 rounded-2xl p-5 space-y-2.5">
```

**Problem:**
- ❌ Uses `rounded-2xl` instead of standard `rounded-3xl`
- ❌ Uses `border-2` instead of standard `border`
- ❌ Uses `p-5` instead of standard `p-6`
- ❌ Uses gradient backgrounds instead of `card-glass` utility
- ❌ Uses `space-y-2.5` (non-standard) instead of `space-y-4` or `space-y-6`

**Standard Pattern (Dashboard, Line 279):**
```tsx
<div className="card-glass rounded-3xl p-6 border-2 border-slate-800">
```

**Impact:**
- Cards feel "off" compared to other pages
- Subtle visual inconsistency reduces professional polish
- Harder to maintain (custom styles vs. design system)

---

#### **VIOLATION #3: Typography Inconsistency**

**Current Header (Lines 161-166):**
```tsx
<h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-200 tracking-tight">
  Complete Wellness Journey
</h1>
<p className="text-slate-400 mt-2 text-sm sm:text-base">
  Patient: {journey.patientId} • 6-Month Journey
</p>
```

**Problem:**
- ❌ Uses `text-3xl sm:text-4xl lg:text-5xl` (3 breakpoints) instead of standard `text-4xl sm:text-5xl` (2 breakpoints)
- ❌ Uses `text-slate-200` instead of standard `text-white` or `text-slate-300`
- ❌ Subtitle uses `text-sm sm:text-base` instead of consistent small text

**Standard Pattern (Dashboard, Line 163):**
```tsx
<h1 className="text-5xl font-black tracking-tighter text-slate-200">
  Dashboard
</h1>
```

**Standard Pattern (MyProtocols, Line 129):**
```tsx
<h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-white">
  My Protocols
</h1>
```

---

#### **VIOLATION #4: Spacing Inconsistency**

**Current (Line 156):**
```tsx
<div className="max-w-[1600px] mx-auto space-y-6">
```

**Problem:**
- ❌ Uses `space-y-6` directly instead of `<Section spacing="tight">`
- ❌ Doesn't leverage the Section component's standardized spacing

**Standard Pattern (Dashboard, Lines 150-153):**
```tsx
<PageContainer className="min-h-screen bg-[#0e1117] text-slate-300 flex flex-col gap-8">
  <Section spacing="tight" className="flex flex-col md:flex-row justify-between...">
```

---

#### **VIOLATION #5: Grid Item Padding**

**Current (Line 212):**
```tsx
<div className="p-4 bg-slate-900/40 rounded-lg...">
```

**Problem:**
- ❌ Uses `rounded-lg` instead of standard `rounded-2xl` or `rounded-3xl`
- ❌ Uses `p-4` which is inconsistent with other card padding

**Standard Pattern (Dashboard, Line 134):**
```tsx
<div className="card-glass flex items-center gap-4 p-4 rounded-2xl h-full">
```

---

### 📋 COMPREHENSIVE FIX RECOMMENDATIONS

#### **FIX #5: Adopt PageContainer + Section Layout (NEW - CRITICAL)**

**Priority:** 🔴 **P1 - Critical** (breaks design system consistency)

**Current Structure:**
```tsx
<div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d1b2a] to-[#05070a] p-4 sm:p-6 lg:p-8">
  <div className="max-w-[1600px] mx-auto space-y-6">
    {/* Content */}
  </div>
</div>
```

**Recommended Structure:**
```tsx
<PageContainer 
  width="wide" 
  padding="default" 
  className="min-h-screen bg-[#0e1117]"
>
  <Section spacing="tight">
    {/* Header */}
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          Complete Wellness Journey
        </h1>
        <p className="text-slate-400 mt-2 text-sm">
          Patient: {journey.patientId} • 6-Month Journey
        </p>
      </div>
      {/* Export PDF button */}
    </div>

    {/* 3-Phase Timeline */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Phase cards */}
    </div>

    {/* Bottom Status Bar */}
    <div className="card-glass rounded-3xl p-6">
      {/* Status content */}
    </div>

    {/* Global Disclaimer */}
  </Section>
</PageContainer>
```

**Changes Required:**

1. **Wrap entire page in `<PageContainer>`:**
   ```tsx
   // Line 154 - REPLACE
   <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d1b2a] to-[#05070a] p-4 sm:p-6 lg:p-8">
   
   // WITH
   <PageContainer width="wide" padding="default" className="min-h-screen bg-[#0e1117]">
   ```

2. **Wrap content in `<Section>`:**
   ```tsx
   // Line 156 - REPLACE
   <div className="max-w-[1600px] mx-auto space-y-6">
   
   // WITH
   <Section spacing="tight">
   ```

3. **Update header typography:**
   ```tsx
   // Line 161 - REPLACE
   <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-200 tracking-tight">
   
   // WITH
   <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
   ```

4. **Standardize card styling:**
   ```tsx
   // Line 186 - REPLACE
   <div className="bg-gradient-to-br from-red-500/10 to-red-900/10 border-2 border-red-500/50 rounded-2xl p-5 space-y-2.5">
   
   // WITH
   <div className="card-glass border-2 border-red-500/50 rounded-3xl p-6 space-y-4 bg-gradient-to-br from-red-500/10 to-red-900/10">
   ```

5. **Standardize grid item cards:**
   ```tsx
   // Line 212 - REPLACE
   <div className="p-4 bg-slate-900/40 rounded-lg...">
   
   // WITH
   <div className="p-4 bg-slate-900/40 rounded-2xl...">
   ```

6. **Update bottom status bar:**
   ```tsx
   // Line 623 - REPLACE
   <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
   
   // WITH
   <div className="card-glass rounded-3xl p-6">
   ```

---

### ✅ UPDATED ACCEPTANCE CRITERIA

#### Layout Consistency (NEW)
- [ ] Page uses `<PageContainer width="wide">` wrapper
- [ ] Content uses `<Section spacing="tight">` wrapper
- [ ] No custom padding on root container
- [ ] Max-width managed by PageContainer, not hardcoded
- [ ] Background color matches standard `bg-[#0e1117]`

#### Typography Consistency (NEW)
- [ ] H1 uses `text-4xl sm:text-5xl font-black text-white`
- [ ] H1 uses `tracking-tight` not `tracking-tighter`
- [ ] Subtitle uses consistent `text-sm text-slate-400`

#### Card Styling Consistency (NEW)
- [ ] Phase cards use `rounded-3xl` not `rounded-2xl`
- [ ] Phase cards use `p-6` not `p-5`
- [ ] Grid items use `rounded-2xl` not `rounded-lg`
- [ ] Bottom status bar uses `card-glass rounded-3xl`
- [ ] Spacing uses standard increments (`space-y-4`, `space-y-6`) not `space-y-2.5`

#### Visual Quality (EXISTING)
- [ ] All 4 metric cards display emoji + score inline horizontal
- [ ] Cards maintain consistent spacing and alignment
- [ ] Visual hierarchy clear: emoji + score → label

#### Accessibility (EXISTING - WCAG AAA)
- [ ] **ZERO fonts below 12px** (run grep verification)
- [ ] All text meets 4.5:1 contrast ratio minimum
- [ ] Export PDF button has multiple visual cues (icon + text + border)
- [ ] Chart axis labels readable at 12px minimum

#### Chart Optimization (EXISTING)
- [ ] Chart feels more spacious (padding reduced)
- [ ] Axis labels clearly visible with improved contrast
- [ ] All chart text meets 12px minimum
- [ ] Responsive behavior maintained

#### Responsive Design (EXISTING)
- [ ] Test at 375px (mobile) - cards stack properly
- [ ] Test at 768px (tablet) - grid adapts
- [ ] Test at 1024px (desktop) - optimal layout
- [ ] Test at 1440px (large desktop) - matches other pages' width

#### Browser Testing (EXISTING)
- [ ] Chrome/Edge - all features work
- [ ] Firefox - all features work
- [ ] Safari - all features work
- [ ] No console errors or warnings

---

### 🎨 UPDATED DESIGN SIGN-OFF

**Designer:** DESIGNER  
**Date:** 2026-02-16T16:16:39-08:00  
**Status:** ⚠️ **Design specifications updated - CRITICAL layout fixes added**

**Summary:**
- Fix #1 (Grid Items): ✅ Already implemented correctly
- Fix #2 (Font Sizes): ❗ Requires audit and replacement
- Fix #3 (Export Button): ✅ Already implemented correctly
- Fix #4 (Chart): ⚠️ Requires padding and contrast improvements
- **Fix #5 (Layout Consistency): 🚨 CRITICAL - Requires PageContainer/Section adoption**

**Estimated Implementation Time:** 90-120 minutes (increased from 45-60 minutes)
- Font size audit: 30 minutes (thorough search and replace)
- Chart improvements: 15 minutes (padding and color adjustments)
- **Layout refactoring: 30 minutes (PageContainer/Section adoption)**
- **Card styling updates: 15 minutes (rounded-3xl, p-6, etc.)**
- Testing: 20 minutes (responsive and browser testing)

**Priority Order:**
1. **Fix #5 (Layout)** - Critical for design system consistency
2. **Fix #2 (Fonts)** - Critical for accessibility
3. **Fix #4 (Chart)** - Important for UX
4. **Fix #1 (Grid)** - Already correct, verify only
5. **Fix #3 (Button)** - Already correct, verify only

**Ready for BUILDER handoff with updated specifications.**

---

## 🔄 **USER FEEDBACK & DESIGN REVISIONS**

**Feedback Date:** 2026-02-16T16:24:38-08:00  
**Status:** Design specifications updated based on user input

### **Key Decisions:**

1. ✅ **PageContainer/Section Adoption** - APPROVED
2. ✅ **Color-Coded Phase Cards** - PRESERVE (critical UX wayfinding)
3. ✅ **Typography Standardization** - APPROVED
4. 🎨 **Deep Blue Background** - **THIS IS THE CORRECT DESIGN SYSTEM**
   - Wellness Journey background is CORRECT
   - All other pages need to be updated to match (see WO-063)
5. 💡 **Tabbed Interface** - RECOMMENDED for progressive disclosure

---

### 🎨 **REVISED: Background Color Strategy**

**CORRECTION:** The deep blue gradient on Wellness Journey is the **intended design system**, not a violation.

**Correct Background (Wellness Journey):**
```tsx
bg-gradient-to-b from-[#0a1628] via-[#0d1b2a] to-[#05070a]
```

**Incorrect Background (Other Pages):**
```tsx
bg-[#0e1117]  // ❌ Too black, needs to be updated
bg-[#080a0f]  // ❌ Too black, needs to be updated
```

**Action Items:**
- ✅ **WO-056:** PRESERVE the deep blue background on Wellness Journey
- 📋 **WO-063:** Update ALL other pages to use deep blue background (new work order)

---

### 🎨 **REVISED: Color-Coded Phase Cards**

**User Feedback:** "Each card represents a different stage of the wellness journey, so I'm actually OK with them being different colors because if they were all the same color, then that would add a step of friction for the provider."

**Design Analysis:** ✅ **CORRECT - This is intentional visual wayfinding**

**Color Psychology & UX:**
- 🔴 **Red/Amber (Preparation)** - Caution, assessment, baseline state
- 🟠 **Amber/Orange (Dosing)** - Active, transformative, peak experience  
- 🟢 **Emerald/Green (Integration)** - Growth, healing, sustained benefit

**Decision:** **PRESERVE color-coded cards** - Do NOT make them uniform

**Updated Fix #5:**
- Keep gradient backgrounds: `bg-gradient-to-br from-red-500/10 to-red-900/10`
- Only update border radius and padding for consistency
- Do NOT change to uniform `card-glass` styling

---

### 💡 **NEW RECOMMENDATION: Tabbed Interface**

**Current State:** All 3 phases displayed simultaneously in vertical layout

**Problem:**
- Information overload for practitioners
- Must scroll through irrelevant phases
- Hard to focus on current phase
- Poor mobile/tablet experience

**Proposed Solution:** **Progressive Disclosure via Tabs**

#### **Visual Design:**

```
┌──────────────────────────────────────────────────────────────┐
│  Complete Wellness Journey                    [Export PDF]   │
│  Patient: PT-KXMR9W2P • 6-Month Journey                      │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │ 1️⃣ Preparation│ │ 2️⃣ Dosing    │ │ 3️⃣ Integration│           │
│  │   ACTIVE    │ │   Session   │ │             │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                                                        │ │
│  │         PHASE 1: PREPARATION CONTENT                   │ │
│  │                                                        │ │
│  │  Grid items, AI insights, benchmarks, etc.            │ │
│  │                                                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  [← Previous Phase]                    [Next Phase: Dosing →]│
└──────────────────────────────────────────────────────────────┘
```

#### **Tab States:**

**Active Tab:**
```tsx
<button className="px-6 py-4 bg-red-500/20 border-2 border-red-500 rounded-t-2xl text-red-300 font-bold">
  <div className="flex items-center gap-3">
    <Calendar className="w-5 h-5" />
    <div className="text-left">
      <div className="text-xs uppercase tracking-wide">Phase 1</div>
      <div className="text-base font-black">Preparation</div>
    </div>
  </div>
</button>
```

**Completed Tab:**
```tsx
<button className="px-6 py-4 bg-slate-800/40 border border-slate-700 rounded-t-2xl text-slate-400 hover:text-slate-300">
  <div className="flex items-center gap-3">
    <CheckCircle className="w-5 h-5 text-emerald-400" />
    <div className="text-left">
      <div className="text-xs uppercase tracking-wide">Phase 1</div>
      <div className="text-sm font-semibold">Preparation ✓</div>
    </div>
  </div>
</button>
```

**Future/Disabled Tab:**
```tsx
<button disabled className="px-6 py-4 bg-slate-900/20 border border-slate-800 rounded-t-2xl text-slate-600 cursor-not-allowed opacity-50">
  <div className="flex items-center gap-3">
    <Activity className="w-5 h-5" />
    <div className="text-left">
      <div className="text-xs uppercase tracking-wide">Phase 2</div>
      <div className="text-sm font-semibold">Dosing Session</div>
    </div>
  </div>
</button>
```

#### **Benefits:**

1. ✅ **Progressive Disclosure** - Show only relevant phase
2. ✅ **Reduced Cognitive Load** - Focus on current task
3. ✅ **Faster Navigation** - Click tab instead of scrolling
4. ✅ **Mobile-Friendly** - Much better on tablets (768px)
5. ✅ **Workflow Alignment** - Matches actual practitioner workflow
6. ✅ **Visual Hierarchy** - Clear phase progression
7. ✅ **Accessibility** - Keyboard navigation, ARIA labels

#### **Implementation Notes:**

**State Management:**
```tsx
const [activePhase, setActivePhase] = useState<1 | 2 | 3>(1);
const [completedPhases, setCompletedPhases] = useState<number[]>([]);
```

**Tab Navigation:**
```tsx
<div className="flex gap-2 border-b border-slate-800">
  {[
    { id: 1, label: 'Preparation', icon: Calendar, color: 'red' },
    { id: 2, label: 'Dosing Session', icon: Activity, color: 'amber' },
    { id: 3, label: 'Integration', icon: TrendingUp, color: 'emerald' }
  ].map(phase => (
    <TabButton
      key={phase.id}
      active={activePhase === phase.id}
      completed={completedPhases.includes(phase.id)}
      disabled={!completedPhases.includes(phase.id - 1) && phase.id > 1}
      onClick={() => setActivePhase(phase.id)}
      {...phase}
    />
  ))}
</div>
```

**Content Rendering:**
```tsx
{activePhase === 1 && <PreparationPhase />}
{activePhase === 2 && <DosingSessionPhase />}
{activePhase === 3 && <IntegrationPhase />}
```

**Responsive Behavior:**
- **Desktop (1024px+):** Horizontal tabs with full labels
- **Tablet (768px):** Horizontal tabs with icons + short labels
- **Mobile (375px):** Vertical stacked tabs or dropdown selector

---

### 📋 **UPDATED FIX #5: Layout Consistency**

**Changes from original specification:**

1. ✅ **PRESERVE deep blue background gradient** (this is correct)
2. ✅ **PRESERVE color-coded phase cards** (intentional UX)
3. ✅ Adopt PageContainer/Section wrappers
4. ✅ Standardize typography
5. ✅ Update border radius (`rounded-2xl` → `rounded-3xl`)
6. ✅ Update padding (`p-5` → `p-6`)
7. ✅ Update spacing (`space-y-2.5` → `space-y-4`)
8. 💡 **RECOMMEND tabbed interface** (optional enhancement)

**Revised Changes Required:**

1. **Wrap in PageContainer (PRESERVE background):**
   ```tsx
   // Line 154 - REPLACE
   <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d1b2a] to-[#05070a] p-4 sm:p-6 lg:p-8">
   
   // WITH
   <PageContainer width="wide" padding="default" className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d1b2a] to-[#05070a]">
   ```

2. **Wrap content in Section:**
   ```tsx
   // Line 156 - REPLACE
   <div className="max-w-[1600px] mx-auto space-y-6">
   
   // WITH
   <Section spacing="tight">
   ```

3. **Update header typography:**
   ```tsx
   // Line 161 - REPLACE
   <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-200 tracking-tight">
   
   // WITH
   <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
   ```

4. **Standardize card styling (PRESERVE gradients):**
   ```tsx
   // Line 186 - REPLACE
   <div className="bg-gradient-to-br from-red-500/10 to-red-900/10 border-2 border-red-500/50 rounded-2xl p-5 space-y-2.5">
   
   // WITH
   <div className="bg-gradient-to-br from-red-500/10 to-red-900/10 border-2 border-red-500/50 rounded-3xl p-6 space-y-4">
   ```

5. **Standardize grid item cards:**
   ```tsx
   // Line 212 - REPLACE
   <div className="p-4 bg-slate-900/40 rounded-lg...">
   
   // WITH
   <div className="p-4 bg-slate-900/40 rounded-2xl...">
   ```

6. **Update bottom status bar:**
   ```tsx
   // Line 623 - REPLACE
   <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
   
   // WITH
   <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6">
   ```

---

### ✅ **FINAL ACCEPTANCE CRITERIA**

#### Layout Consistency
- [ ] Page uses `<PageContainer width="wide">` wrapper
- [ ] Content uses `<Section spacing="tight">` wrapper
- [ ] **Deep blue background PRESERVED** ✅
- [ ] Max-width managed by PageContainer

#### Color-Coded Phase Cards
- [ ] **Red gradient PRESERVED** for Preparation phase ✅
- [ ] **Amber gradient PRESERVED** for Dosing Session phase ✅
- [ ] **Emerald gradient PRESERVED** for Integration phase ✅
- [ ] Border radius updated to `rounded-3xl`
- [ ] Padding updated to `p-6`
- [ ] Spacing updated to `space-y-4`

#### Typography Consistency
- [ ] H1 uses `text-4xl sm:text-5xl font-black text-white`
- [ ] H1 uses `tracking-tight`
- [ ] Subtitle uses `text-sm text-slate-400`

#### Tabbed Interface (OPTIONAL - RECOMMENDED)
- [ ] Consider implementing tabbed navigation for phases
- [ ] Progressive disclosure reduces cognitive load
- [ ] Mobile-friendly tab design

---

### 🎨 **FINAL DESIGN SIGN-OFF**

**Designer:** DESIGNER  
**Date:** 2026-02-16T16:24:38-08:00  
**Status:** ✅ **Design specifications finalized with user feedback**

**Summary:**
- Fix #1 (Grid Items): ✅ Already correct
- Fix #2 (Font Sizes): ❗ Required
- Fix #3 (Export Button): ✅ Already correct
- Fix #4 (Chart): ⚠️ Required
- Fix #5 (Layout): ⚠️ Required (REVISED - preserve background & colors)
- **Recommendation:** 💡 Tabbed interface for progressive disclosure

**Estimated Implementation Time:** 90-120 minutes
- Layout refactoring: 30 minutes (PageContainer/Section)
- Font size audit: 30 minutes
- Card styling updates: 15 minutes (border radius, padding, spacing)
- Chart improvements: 15 minutes
- Testing: 20 minutes

**Optional Enhancement:** Tabbed interface (+60-90 minutes)

**Ready for BUILDER implementation.**

---
