# 🔨 BUILDER TO-DO LIST
**Role:** Implementation, Code Changes  
**Date:** 2026-02-10  
**Context:** Landing page layout crowding fixes  
**Prerequisites:** Investigator analysis complete

---

## Implementation Phases

### 🔴 **Phase 1: Quick Wins (15 minutes)**
*Low-risk, high-impact changes*

- [ ] **Fix Mission Section Padding**
  - **File:** `src/pages/Landing.tsx`
  - **Line:** ~647
  - **Change:** `py-40` → `py-32`
  - **Test:** Verify section doesn't feel cramped
  ```tsx
  // BEFORE
  <section className="py-40 px-6 relative z-10">
  
  // AFTER
  <section className="py-32 px-6 relative z-10">
  ```

- [ ] **Increase Trust Badge Spacing**
  - **File:** `src/pages/Landing.tsx`
  - **Line:** ~408
  - **Change:** `gap-8` → `gap-12`
  - **Test:** Badges have breathing room
  ```tsx
  // BEFORE
  <div className="grid grid-cols-2 md:grid-cols-3 gap-8 items-center relative z-10">
  
  // AFTER
  <div className="grid grid-cols-2 md:grid-cols-3 gap-12 items-center relative z-10">
  ```

- [ ] **Restore Trust Indicators Header** *(if approved by Investigator)*
  - **File:** `src/pages/Landing.tsx`
  - **Line:** ~407 (before badges grid)
  - **Change:** Add header with increased spacing
  - **Test:** Context is clear, spacing feels balanced
  ```tsx
  // ADD THIS
  <p className="text-center text-sm text-slate-500 font-bold uppercase tracking-widest mb-12 relative z-10">
    Trusted by Leading Research Institutions
  </p>
  ```

- [ ] **Fix Footer Padding**
  - **File:** `src/pages/Landing.tsx`
  - **Line:** ~990
  - **Change:** `pt-32 pb-20` → `py-32`
  - **Test:** Footer feels complete, not cut off
  ```tsx
  // BEFORE
  <footer className="pt-32 pb-20 px-6 bg-[#05070a] border-t border-slate-900 relative z-10">
  
  // AFTER
  <footer className="py-32 px-6 bg-[#05070a] border-t border-slate-900 relative z-10">
  ```

**Commit Message:** `fix: improve landing page section spacing consistency`

---

### 🟡 **Phase 2: Spacing Improvements (20 minutes)**
*Moderate-risk, improves breathing room*

- [ ] **Increase Hero Internal Spacing**
  - **File:** `src/pages/Landing.tsx`
  - **Line:** ~260 (hero text column)
  - **Change:** `space-y-10` → `space-y-12`
  - **Test:** Elements don't feel cramped
  ```tsx
  // BEFORE
  <div className="flex flex-col items-center text-center lg:items-start lg:text-left space-y-10">
  
  // AFTER
  <div className="flex flex-col items-center text-center lg:items-start lg:text-left space-y-12">
  ```

- [ ] **Increase Hero Column Gap**
  - **File:** `src/pages/Landing.tsx`
  - **Line:** ~258 (hero grid)
  - **Change:** `gap-12` → `gap-16`
  - **Test:** Text and molecule have adequate separation
  ```tsx
  // BEFORE
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
  
  // AFTER
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
  ```

- [ ] **Increase Showcase Section Gaps**
  - **File:** `src/pages/Landing.tsx`
  - **Lines:** ~520, ~580, ~640 (all product showcase grids)
  - **Change:** `gap-12` → `gap-16 lg:gap-20`
  - **Test:** Demos and text have breathing room
  ```tsx
  // BEFORE
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
  
  // AFTER
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
  ```

- [ ] **Increase Showcase Text Spacing**
  - **File:** `src/pages/Landing.tsx`
  - **Lines:** ~530, ~590, ~650 (showcase text columns)
  - **Change:** `space-y-6` → `space-y-8`
  - **Test:** Headings, descriptions, CTAs feel balanced
  ```tsx
  // BEFORE
  <div className="space-y-6 order-1 lg:order-2">
  
  // AFTER
  <div className="space-y-8 order-1 lg:order-2">
  ```

- [ ] **Increase About Section Paragraph Spacing**
  - **File:** `src/pages/Landing.tsx`
  - **Line:** ~920
  - **Change:** `space-y-6` → `space-y-8`
  - **Test:** Long-form content is readable
  ```tsx
  // BEFORE
  <div className="space-y-6">
  
  // AFTER
  <div className="space-y-8">
  ```

**Commit Message:** `feat: increase spacing for better breathing room`

---

### 🟢 **Phase 3: Component Sizing (30 minutes)**
*Higher-risk, requires visual testing*

- [ ] **Reduce Hero Molecule Size**
  - **File:** `src/pages/Landing.tsx`
  - **Line:** ~295
  - **Change:** `w-[400px] lg:w-[600px]` → `w-[350px] lg:w-[500px]`
  - **Test:** Molecule doesn't overpower text, still impressive
  ```tsx
  // BEFORE
  <div className="w-[400px] lg:w-[600px] h-[400px] lg:h-[600px]">
  
  // AFTER
  <div className="w-[350px] lg:w-[500px] h-[350px] lg:h-[500px]">
  ```

- [ ] **Constrain Demo Components**
  - **File:** `src/pages/Landing.tsx`
  - **Lines:** ~525, ~585, ~645 (demo wrappers)
  - **Change:** Add `max-w-xl` constraint
  - **Test:** Demos feel integrated, not overwhelming
  ```tsx
  // BEFORE
  <div className="relative group order-2 lg:order-1">
  
  // AFTER
  <div className="relative group order-2 lg:order-1 max-w-xl mx-auto lg:mx-0">
  ```

- [ ] **Reduce Hero H1 Size**
  - **File:** `src/pages/Landing.tsx`
  - **Line:** ~270
  - **Change:** `text-5xl sm:text-7xl lg:text-8xl` → `text-5xl sm:text-6xl lg:text-7xl`
  - **Test:** Still impactful but not overwhelming
  ```tsx
  // BEFORE
  <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-none text-slate-200">
  
  // AFTER
  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-none text-slate-200">
  ```

- [ ] **Reduce Section H2 Sizes**
  - **File:** `src/pages/Landing.tsx`
  - **Lines:** Multiple (search for `text-4xl sm:text-6xl`)
  - **Change:** `text-4xl sm:text-6xl` → `text-3xl sm:text-5xl`
  - **Test:** Better hierarchy, less competition with hero
  ```tsx
  // BEFORE
  <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-200 leading-tight">
  
  // AFTER
  <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-200 leading-tight">
  ```

- [ ] **Smooth Network Container Padding**
  - **File:** `src/pages/Landing.tsx`
  - **Line:** ~355
  - **Change:** `p-10 sm:p-20` → `p-12 sm:p-16 lg:p-20`
  - **Test:** Better mobile experience, smoother progression
  ```tsx
  // BEFORE
  <div className="bg-slate-900/20 border border-slate-800 rounded-[4rem] p-10 sm:p-20">
  
  // AFTER
  <div className="bg-slate-900/20 border border-slate-800 rounded-[4rem] p-12 sm:p-16 lg:p-20">
  ```

- [ ] **Increase Stats Card Padding**
  - **File:** `src/pages/Landing.tsx`
  - **Line:** ~710
  - **Change:** `p-8 sm:p-12` → `p-10 sm:p-14 lg:p-16`
  - **Test:** Stats don't feel cramped
  ```tsx
  // BEFORE
  <div className="bg-[#111418]/60 border border-slate-800 rounded-[3rem] p-8 sm:p-12">
  
  // AFTER
  <div className="bg-[#111418]/60 border border-slate-800 rounded-[3rem] p-10 sm:p-14 lg:p-16">
  ```

- [ ] **Increase Stat Box Spacing**
  - **File:** `src/pages/Landing.tsx`
  - **Line:** ~712
  - **Change:** `gap-6` → `gap-8`
  - **Test:** Individual stats have breathing room
  ```tsx
  // BEFORE
  <div className="grid grid-cols-2 gap-6">
  
  // AFTER
  <div className="grid grid-cols-2 gap-8">
  ```

**Commit Message:** `refactor: optimize component sizing and typography scale`

---

### ⚪ **Phase 4: Optional Enhancements (30 minutes)**
*Nice-to-have, implement if time allows*

- [ ] **Reduce Demo Glow Intensity**
  - **File:** `src/pages/Landing.tsx`
  - **Lines:** ~527, ~587, ~647 (glow divs)
  - **Change:** Reduce opacity values
  - **Test:** Glows enhance, don't distract
  ```tsx
  // BEFORE
  <div className="absolute -inset-4 bg-red-500/10 rounded-[4rem] blur-3xl opacity-20 group-hover:opacity-40">
  
  // AFTER
  <div className="absolute -inset-4 bg-red-500/10 rounded-[4rem] blur-3xl opacity-10 group-hover:opacity-20">
  ```

- [ ] **Increase How It Works Step Gap**
  - **File:** `src/pages/Landing.tsx`
  - **Line:** ~460
  - **Change:** Remove `lg:gap-8`, use consistent `gap-12`
  - **Test:** Desktop layout has adequate spacing
  ```tsx
  // BEFORE
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
  
  // AFTER
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
  ```

- [ ] **Increase Callout Box Padding**
  - **File:** `src/pages/Landing.tsx`
  - **Line:** ~935
  - **Change:** `p-6` → `p-8`
  - **Test:** Veterans callout feels important
  ```tsx
  // BEFORE
  <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-6">
  
  // AFTER
  <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-8">
  ```

**Commit Message:** `polish: reduce visual noise and enhance readability`

---

## Testing Checklist

After each phase, verify:

- [ ] **Visual Regression**
  - Take screenshots before/after
  - Compare at 375px, 768px, 1024px, 1440px, 1920px
  - Ensure no layout breaks

- [ ] **Scroll Behavior**
  - Smooth scroll still works
  - Parallax effects intact
  - No jank or CLS issues

- [ ] **Responsive Breakpoints**
  - Mobile (375px): No horizontal scroll
  - Tablet (768px): Proper column stacking
  - Desktop (1440px): Optimal spacing
  - Wide (1920px): Content doesn't feel lost

- [ ] **Typography Hierarchy**
  - H1 > H2 > H3 clear distinction
  - Body text readable at all sizes
  - No font size violations (<10px)

- [ ] **Component Rendering**
  - Demos load correctly
  - Images don't break
  - Icons display properly
  - Animations trigger

- [ ] **Accessibility**
  - Keyboard navigation works
  - Focus states visible
  - Screen reader announces sections
  - Touch targets adequate (44×44px minimum)

- [ ] **Performance**
  - Lighthouse score >90
  - CLS <0.1
  - No console errors
  - Fast page load

---

## Rollback Plan

If changes cause issues:

```bash
# Revert last commit
git revert HEAD

# Or reset to previous commit
git reset --hard HEAD~1

# Or restore specific file
git checkout HEAD~1 -- src/pages/Landing.tsx
```

**Backup:** Create branch before starting
```bash
git checkout -b layout-fixes-backup
git checkout main
git checkout -b layout-fixes
```

---

## Files to Modify

| File | Lines to Change | Estimated Time |
|------|----------------|----------------|
| `src/pages/Landing.tsx` | ~20 locations | 60 minutes |
| `src/index.css` | 0 (no CSS changes) | 0 minutes |

**Total Estimated Time:** 60-90 minutes (including testing)

---

## Success Criteria

✅ **Visual:**
- Sections have consistent breathing room
- Demos don't dominate text
- Typography hierarchy is clear
- No cramped or cluttered areas

✅ **Technical:**
- No layout breaks at any breakpoint
- No accessibility regressions
- Performance metrics maintained
- Code is clean and maintainable

✅ **User Experience:**
- Page feels spacious, not crowded
- Content is easy to scan
- CTAs are prominent
- Professional, premium appearance

---

## Post-Implementation

- [ ] **Update Documentation**
  - Document new spacing standards in `LANDING_SPACING_ANALYSIS.md`
  - Add to design system docs (if exists)

- [ ] **Create PR**
  - Title: "Improve landing page layout and spacing"
  - Description: Link to analysis docs
  - Screenshots: Before/after comparisons

- [ ] **Request Review**
  - Tag Investigator for validation
  - Tag Designer for visual approval
  - Tag QA for testing

- [ ] **Monitor Metrics**
  - Track bounce rate changes
  - Monitor scroll depth
  - Check CTA click rates
  - Gather user feedback

---

**Ready to build once Investigator analysis is complete.**
