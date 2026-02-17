---
id: WO-063
status: 00_INBOX
priority: P2 (High)
category: Design System / UI Consistency
owner: PENDING_LEAD_ASSIGNMENT
failure_count: 0
created_date: 2026-02-16T16:24:38-08:00
---

# ORIGINAL USER REQUEST (VERBATIM)

"Notably, this is my preferred choice of background colors for all pages. Somehow through the design process, all of the other pages have turned to black. So I would like all pages to have this deep blue background instead of a black background.

IMPORTANT: Please ensure that this background stays the same and does not change, and then create a separate work order to have all other pages updated to have the same background.

Also note that the page wrapping is inconsistent throughout the site, and that will need to be addressed."

---

# User Request Summary

Update ALL pages in the application to use the deep blue gradient background from the Wellness Journey page, replacing the current black backgrounds. This is the intended design system standard.

---

## 🎯 CRITICAL CONTEXT

### Design System Correction

**CORRECT Background (Wellness Journey):**
```tsx
bg-gradient-to-b from-[#0a1628] via-[#0d1b2a] to-[#05070a]
```

**INCORRECT Backgrounds (Currently on other pages):**
```tsx
bg-[#0e1117]  // ❌ Too black - needs update
bg-[#080a0f]  // ❌ Too black - needs update
```

### User Intent

The deep blue gradient is the **intended design system**, not the black backgrounds. All pages should have a consistent, rich deep blue background that:
- Feels premium and professional
- Reduces eye strain compared to pure black
- Provides better contrast for UI elements
- Matches the clinical/medical aesthetic

---

## THE BLAST RADIUS (Authorized Target Area)

### Pages to Update

**MODIFY (Background Only):**
- `src/pages/Dashboard.tsx` - Currently uses `bg-[#0e1117]`
- `src/pages/MyProtocols.tsx` - Needs background update
- `src/pages/SubstanceMonograph.tsx` - Currently uses `bg-[#080a0f]`
- `src/pages/SearchPortal.tsx`
- `src/pages/Analytics.tsx`
- `src/pages/InteractionChecker.tsx`
- `src/pages/News.tsx`
- `src/pages/HelpCenter.tsx`
- `src/pages/Settings.tsx`
- `src/pages/ClinicianProfile.tsx`
- `src/pages/SubstanceCatalog.tsx`
- All other pages using black backgrounds

**PRESERVE:**
- Wellness Journey (`ArcOfCareGodView.tsx`) - Already correct
- All page functionality
- All component styling
- All layout structures

---

## ⚡ THE ELECTRIC FENCE (Strict "DO NOT TOUCH" Constraints)

**DO NOT:**
- Change the Wellness Journey background (it's already correct)
- Modify any component logic or functionality
- Change any other styling beyond background color
- Touch layout, spacing, or typography
- Modify any data fetching or state management

**MUST:**
- Only update background colors
- Maintain all existing page functionality
- Preserve all responsive behavior
- Test each page after update

---

## ✅ Acceptance Criteria

### Background Color Updates
- [ ] Dashboard uses deep blue gradient background
- [ ] MyProtocols uses deep blue gradient background
- [ ] SubstanceMonograph uses deep blue gradient background
- [ ] SearchPortal uses deep blue gradient background
- [ ] Analytics uses deep blue gradient background
- [ ] InteractionChecker uses deep blue gradient background
- [ ] News uses deep blue gradient background
- [ ] HelpCenter uses deep blue gradient background
- [ ] Settings uses deep blue gradient background
- [ ] ClinicianProfile uses deep blue gradient background
- [ ] SubstanceCatalog uses deep blue gradient background
- [ ] All other pages use deep blue gradient background

### Visual Consistency
- [ ] All pages have identical background gradient
- [ ] No pages use pure black backgrounds
- [ ] Gradient direction consistent (`bg-gradient-to-b`)
- [ ] Color stops consistent across all pages

### Functionality Preservation
- [ ] All pages load without errors
- [ ] All interactive elements work correctly
- [ ] No layout shifts or visual regressions
- [ ] Responsive behavior maintained

### Testing
- [ ] Test all pages in Chrome/Edge
- [ ] Test all pages in Firefox
- [ ] Test all pages in Safari
- [ ] Test at mobile (375px), tablet (768px), desktop (1024px, 1440px)
- [ ] No console errors

---

## 📝 MANDATORY COMPLIANCE

### DESIGN SYSTEM STANDARD

**Official Background Gradient:**
```tsx
bg-gradient-to-b from-[#0a1628] via-[#0d1b2a] to-[#05070a]
```

**Application:**
- Apply to root container of each page
- Usually on `<PageContainer>` or outermost `<div>`
- Combine with `min-h-screen` for full-page coverage

**Example (Dashboard):**
```tsx
// BEFORE
<PageContainer className="min-h-screen bg-[#0e1117] text-slate-300 flex flex-col gap-8">

// AFTER
<PageContainer className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d1b2a] to-[#05070a] text-slate-300 flex flex-col gap-8">
```

**Example (SubstanceMonograph):**
```tsx
// BEFORE
<div className="min-h-full bg-[#080a0f] animate-in fade-in duration-700 pb-20 overflow-x-hidden">

// AFTER
<div className="min-h-full bg-gradient-to-b from-[#0a1628] via-[#0d1b2a] to-[#05070a] animate-in fade-in duration-700 pb-20 overflow-x-hidden">
```

---

## 🚦 Status

**INBOX** - Awaiting LEAD architectural review

---

## 📋 Technical Implementation Notes

### Search Strategy

**Find all pages with black backgrounds:**
```bash
grep -r "bg-\[#0e1117\]" src/pages/
grep -r "bg-\[#080a0f\]" src/pages/
grep -r "bg-\[#0a0a0a\]" src/pages/
grep -r "bg-black" src/pages/
```

### Replace Strategy

**For each file found:**
1. Locate the root container (usually first `<div>` or `<PageContainer>`)
2. Find the background class (`bg-[#0e1117]` or similar)
3. Replace with: `bg-gradient-to-b from-[#0a1628] via-[#0d1b2a] to-[#05070a]`
4. Test the page visually
5. Check for any contrast issues with text/components

### Potential Issues

**Watch for:**
- Pages with custom dark overlays that might conflict
- Components with hardcoded black backgrounds that need adjustment
- Text contrast issues (unlikely, but check)
- Modal/overlay backgrounds (may need separate treatment)

---

## Dependencies

**Prerequisite:**
- None - this is a standalone visual update

**Related:**
- WO-056 (Wellness Journey UI Fixes) - Preserves the correct background

---

## Notes

This work order addresses a **design system correction**. The deep blue gradient is the intended standard, and all pages should match. This is a high-priority visual consistency fix that will significantly improve the overall aesthetic of the application.

The update is purely cosmetic and should not affect any functionality, but thorough testing is required to ensure no visual regressions.

---

## Estimated Complexity

**3/10** - Straightforward find-and-replace across multiple files, but requires careful testing of each page.

---

## Estimated Time

**60-90 minutes**
- Find all affected pages: 15 minutes
- Update backgrounds: 30 minutes (20+ pages)
- Visual testing: 30 minutes
- Regression testing: 15 minutes
