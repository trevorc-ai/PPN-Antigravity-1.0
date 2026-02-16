---
id: WO-056
status: 03_BUILD
priority: P2 (High)
category: UI/UX / Accessibility / Layout
owner: BUILDER
failure_count: 0
created_date: 2026-02-16T12:16:03-08:00
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

**BUILDER:** Execute the 4 fixes described in the user's verbatim instructions:

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
