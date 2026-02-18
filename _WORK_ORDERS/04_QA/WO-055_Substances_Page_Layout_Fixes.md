---
id: WO-055
status: 03_BUILD
priority: P2 (High)
category: UI/UX / Layout Improvements
owner: INSPECTOR
failure_count: 0
created_date: 2026-02-16T11:56:42-08:00
completed_date: 2026-02-16T14:15:00-08:00
---

# ORIGINAL USER REQUEST (VERBATIM)

**Substances page:**
- Delete "analytics Quick Insights... STABLE" from right side panel; move lower elements up, top block should align with the tops of the substance cards
- Substance cards repeater container is off balance to the left. Examine the page container and overall layout of all containers; Reset so the page has a dynamic page layout, card widths, etc., for a cleaner and more balanced professional layout consistent with other pages
- Change Filter buttons color; Filter buttons should never be the same style as navigation buttons

**File Reference:**
- Target file: `src/pages/SubstanceCatalog.tsx`
- Screenshots attached (see above)

---

# User Request Summary

Fix layout issues on the Substances page to improve visual balance and consistency with other pages.

## Issues to Fix

### 1. Right Sidebar - Remove "Quick Insights" Section
**Current state:**
- Right sidebar has "Quick Insights" section with:
  - Analytics icon + heading
  - "Global Research Trends" chart
  - "Substance Class: TRYPTAMINES" info
  - "Total Studies" and "Clinical ROI" cards

**Required change:**
- Delete entire "Quick Insights" section (lines 146-197)
- Move "Drug Safety Matrix" section up to align with top of substance cards
- Remove spacing gap between sections

### 2. Main Content - Fix Card Container Balance
**Current state:**
- Substance cards appear off-balance to the left
- Container widths not optimized
- Layout inconsistent with other pages

**Required change:**
- Examine and fix:
  - Page container max-width and padding
  - Grid layout for substance cards
  - Overall flex layout balance
- Ensure dynamic, responsive layout
- Match layout patterns from other pages (e.g., My Protocols, Analytics)

### 3. Filter Buttons - Change Styling
**Current state:**
- Filter buttons use same primary blue style as navigation buttons
- Active filter: `bg-primary border-primary` with blue glow
- Inactive filter: `bg-slate-900 border-slate-800`

**Required change:**
- Filter buttons should have distinct styling from navigation
- Suggested approach:
  - Active: Use slate/gray with accent border (not primary blue)
  - Inactive: Lighter slate background
  - Remove blue glow effect
  - Keep rounded-full shape and uppercase text

---

## THE BLAST RADIUS (Authorized Target Area)

### Files to Modify

**MODIFY:**
- `src/pages/SubstanceCatalog.tsx` - Fix layout, remove Quick Insights, restyle filters

**PRESERVE:**
- Substance card design and functionality
- Drug Safety Matrix functionality
- Search and filter logic
- Navigation and routing

---

## ⚡ THE ELECTRIC FENCE (Strict "DO NOT TOUCH" Constraints)

**DO NOT:**
- Modify substance card content or structure
- Change Drug Safety Matrix functionality
- Alter filter logic (only styling)
- Touch other pages or components
- Change data fetching or constants

**MUST:**
- Maintain accessibility standards
- Keep responsive design
- Preserve all existing functionality
- Match current CSS theme and color palette

---

## ✅ Acceptance Criteria

### Right Sidebar Cleanup
- [ ] "Quick Insights" section completely removed (lines 146-197)
- [ ] "Drug Safety Matrix" section moved up
- [ ] Top of sidebar aligns with top of substance cards
- [ ] No extra spacing gaps
- [ ] Sidebar maintains proper sticky behavior

### Layout Balance
- [ ] Substance cards grid properly centered
- [ ] Page container width optimized
- [ ] Layout consistent with other pages
- [ ] Responsive at all breakpoints (mobile, tablet, desktop)
- [ ] No horizontal scroll or overflow issues

### Filter Button Styling
- [ ] Filter buttons no longer use primary blue
- [ ] Active filter has distinct, non-navigation styling
- [ ] Inactive filter has subtle background
- [ ] Buttons maintain rounded-full shape
- [ ] Uppercase text and tracking preserved
- [ ] Hover states work correctly

### Testing
- [ ] Page loads without errors
- [ ] Filters work correctly
- [ ] Layout balanced on desktop (1920px, 1440px, 1280px)
- [ ] Layout balanced on tablet (768px)
- [ ] Layout balanced on mobile (375px)
- [ ] No console errors
- [ ] Sidebar scrolls independently if needed

---

## 📝 MANDATORY COMPLIANCE

### ACCESSIBILITY
- Minimum 12px font size
- Keyboard accessible filter buttons
- Screen reader friendly
- Sufficient color contrast
- Focus states visible

### RESPONSIVE DESIGN
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Grid adapts: 1 col mobile, 2 cols tablet, 3 cols desktop

---

## 🚦 Status

**INBOX** - Awaiting LEAD architectural review

---

## 📋 Technical Implementation Notes

### Section to Remove (Lines 146-197)

```tsx
// DELETE THIS ENTIRE BLOCK:
<div className="space-y-8">
  <div className="flex items-center gap-4">
    <span className="material-symbols-outlined text-accent-amber font-black text-3xl">analytics</span>
    <h2 className="text-sm font-black text-slate-200 tracking-[0.25em] uppercase">Quick Insights</h2>
  </div>

  {/* Global Research Trends chart */}
  {/* Substance Class info */}
  {/* Total Studies + Clinical ROI cards */}
</div>
```

### Filter Button Styling Update

**Current (lines 122-132):**
```tsx
className={`px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest transition-all border ${
  activeFilter === filter
    ? 'bg-primary border-primary text-slate-300 shadow-[0_0_20px_rgba(43,116,243,0.3)]'
    : 'bg-slate-900 border-slate-800 text-slate-3000 hover:text-slate-200'
}`}
```

**Suggested new styling:**
```tsx
className={`px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest transition-all border ${
  activeFilter === filter
    ? 'bg-slate-700 border-slate-600 text-slate-200'
    : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-300'
}`}
```

### Layout Container Review

**Current main container (line 114-116):**
```tsx
<div className="min-h-full flex flex-col lg:flex-row bg-[#080a10] animate-in fade-in duration-700">
  <div className="flex-1 overflow-y-auto custom-scrollbar">
    <PageContainer className="!max-w-7xl p-6 sm:p-10 lg:p-12 space-y-12">
```

**Potential improvements:**
- Check if `!max-w-7xl` is causing left-bias
- Review padding values for balance
- Consider matching container patterns from other pages
- Ensure grid centering with `mx-auto` if needed

### Sidebar Alignment (Line 145)

**Current:**
```tsx
<aside className="w-full lg:w-[440px] border-l border-slate-800/60 bg-[#0a0c10] p-10 lg:sticky lg:top-0 h-full overflow-y-auto custom-scrollbar flex flex-col gap-12 backdrop-blur-xl shrink-0">
```

**After removing Quick Insights:**
- First element should be "Drug Safety Matrix" (line 199)
- Reduce `gap-12` to `gap-8` if needed
- Ensure top padding aligns with substance cards

---

## Design Reference

**Screenshots show:**
1. **Right sidebar** with "Quick Insights" section (to be removed)
2. **Filter buttons** using primary blue styling (to be changed)
3. **Substance cards** appearing left-biased (to be centered)

**Expected result:**
- Sidebar starts with "Drug Safety Matrix"
- Filter buttons use slate/gray styling
- Substance cards grid properly centered
- Layout balanced and professional

---

## Dependencies

None - This is a standalone UI improvement.

---

## Notes

This is a **layout refinement and visual consistency** task. The goal is to:
1. Remove unnecessary "Quick Insights" section to reduce visual clutter
2. Fix container balance for a more professional, centered layout
3. Differentiate filter buttons from navigation buttons for better UX

All functionality must be preserved - this is purely a visual/layout improvement.

---

## 🏗️ LEAD ARCHITECTURE

### Strategic Overview

This is a **straightforward layout and styling refinement** task based on clear user instructions. All changes are CSS/layout only - no logic modifications.

### Implementation Strategy

**3 independent fixes:**
1. Remove "Quick Insights" section from sidebar
2. Fix substance cards grid balance
3. Restyle filter buttons

**Estimated Complexity:** Medium (3-4 sections to modify)

### Handoff to BUILDER

**BUILDER:** Execute the 3 fixes described in the user's verbatim instructions:

**Fix 1: Remove Quick Insights (Lines 146-197)**
- Delete entire section
- Move "Drug Safety Matrix" up
- Align top of sidebar with top of substance cards

**Fix 2: Fix Grid Balance**
- Review page container (`!max-w-7xl` may be causing left-bias)
- Ensure substance cards grid is centered with `mx-auto` if needed
- Match container patterns from other pages
- Test responsive layout at all breakpoints

**Fix 3: Restyle Filter Buttons (Lines 122-132)**
- Replace primary blue with slate/gray
- Active: `bg-slate-700 border-slate-600 text-slate-200`
- Inactive: `bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-800`
- Remove blue glow effect

**Testing:**
- [ ] Quick Insights removed, sidebar aligned
- [ ] Cards grid centered and balanced
- [ ] Filter buttons styled distinctly from navigation
- [ ] Responsive at all breakpoints
- [ ] No console errors

**When complete:** Move to `04_QA`

**Estimated Time:** 45-60 minutes

---

**LEAD STATUS:** ✅ Architecture complete. Routed to BUILDER for implementation.

---

## [STATUS: FAIL] - INSPECTOR REJECTION

**Rejected by:** INSPECTOR (Mass Audit — User Override)
**Date:** 2026-02-18T00:53:13-08:00
**failure_count:** incremented

**Reason for Rejection:**
Frontmatter shows status: 04_QA — ticket was never formally approved by INSPECTOR. No INSPECTOR PASS section present. BUILDER must re-submit through proper QA channel.

**Required Actions for BUILDER:**
1. Review the rejection reason above carefully
2. Complete all outstanding implementation work
3. Add a proper BUILDER IMPLEMENTATION COMPLETE section with evidence
4. Re-submit to 04_QA when done

**Route:** Back to 03_BUILD → BUILDER
