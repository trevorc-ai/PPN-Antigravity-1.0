---
id: WO-057
status: 00_INBOX
priority: P1 (Critical)
category: Bug / Layout / Navigation
owner: PENDING_LEAD_ASSIGNMENT
failure_count: 0
created_date: 2026-02-16T12:52:43-08:00
---

# ORIGINAL USER REQUEST (VERBATIM)

**Sidebar:**
- Updating the Sidebar changed the interaction with the page wrappers, so now it is overlapping the breadcrumbs and all pages;
- Sidebar appears to be vertically 'full justified' so the spacing between items increases when we remove links; should have a standard spacing between link items
- Remove 'Wellness journey' link; this is accessible from the My Protocols Page.
- Remove 'Analytics' link

**File References:**
- Target file: `src/components/Sidebar.tsx`
- Related: Page wrapper/layout components
- Screenshot attached (see above)

---

# User Request Summary

Fix critical Sidebar layout issues causing page overlap and improve navigation structure by removing redundant links.

## Issues to Fix

### 1. Sidebar Overlapping Pages (CRITICAL)
**Current state:**
- Sidebar is overlapping breadcrumbs and page content
- Recent Sidebar update broke interaction with page wrappers
- Z-index or positioning issue

**Required change:**
- Fix Sidebar positioning to not overlap page content
- Ensure proper spacing between Sidebar and main content
- Check page wrapper components for layout conflicts
- Verify z-index layering is correct

**Files to check:**
- `src/components/Sidebar.tsx` (line 72-74: positioning classes)
- Page wrapper/layout components
- Any recent changes to Sidebar that affected layout

### 2. Vertical Spacing Issue
**Current state (line 96-136):**
- Navigation uses `space-y-6` for sections
- Items use `space-y-1` within sections
- When links are removed, spacing increases (appears "full justified")
- Spacing should be consistent regardless of number of items

**Required change:**
- Fix vertical spacing to be standard/fixed
- Remove any `justify-between` or flex-grow behavior
- Use consistent gap spacing that doesn't change when items are removed
- Suggested: Use fixed `gap-6` for sections, `gap-1` for items

### 3. Remove 'Wellness Journey' Link
**Current state (line 33):**
```tsx
{ label: 'Wellness Journey', icon: 'healing', path: '/wellness-journey' },
```

**Required change:**
- Delete this entire line from the `Clinical Tools` section
- Wellness Journey is accessible from My Protocols page
- Update: If `Clinical Tools` section becomes too small, consider merging with another section

### 4. Remove 'Analytics' Link
**Current state (line 27):**
```tsx
{ label: 'Analytics', icon: 'analytics', path: '/analytics' },
```

**Required change:**
- Delete this entire line from the `Core` section
- Update: If `Core` section only has Dashboard left, consider renaming or merging

---

## THE BLAST RADIUS (Authorized Target Area)

### Files to Modify

**MODIFY:**
- `src/components/Sidebar.tsx` - Fix positioning, spacing, remove links
- `src/components/MobileSidebar.tsx` - Apply same changes for consistency
- Page wrapper/layout components (if needed for overlap fix)

**INVESTIGATE:**
- Recent Sidebar changes that caused overlap
- Page container/wrapper components
- Z-index hierarchy

**PRESERVE:**
- Sidebar functionality (open/close, mobile overlay)
- Active state styling
- Icon system
- Footer status indicator

---

## ⚡ THE ELECTRIC FENCE (Strict "DO NOT TOUCH" Constraints)

**DO NOT:**
- Change Sidebar visual design (colors, styling)
- Modify active state behavior
- Touch routing logic
- Change icon system
- Alter mobile overlay functionality

**MUST:**
- Fix overlap issue completely
- Maintain consistent spacing
- Preserve all remaining navigation links
- Keep responsive behavior working

---

## ✅ Acceptance Criteria

### Overlap Fix (CRITICAL)
- [ ] Sidebar does NOT overlap breadcrumbs
- [ ] Sidebar does NOT overlap page content
- [ ] Proper spacing between Sidebar and main content area
- [ ] Z-index layering correct
- [ ] Works on all pages (Dashboard, Catalog, News, etc.)
- [ ] Works at all breakpoints (mobile, tablet, desktop)

### Spacing Fix
- [ ] Vertical spacing between sections is consistent
- [ ] Spacing does NOT increase when links are removed
- [ ] No "full justified" behavior
- [ ] Standard gap spacing applied
- [ ] Looks balanced with fewer links

### Link Removal
- [ ] 'Wellness Journey' link removed from Clinical Tools section
- [ ] 'Analytics' link removed from Core section
- [ ] Navigation still functional for remaining links
- [ ] No broken routes or dead links
- [ ] Sections reorganized if needed (e.g., if Core only has Dashboard)

### Testing
- [ ] Sidebar opens/closes correctly
- [ ] Mobile overlay works
- [ ] Active states work for all remaining links
- [ ] No overlap on any page
- [ ] Responsive at all breakpoints (375px, 768px, 1024px, 1440px)
- [ ] No console errors
- [ ] MobileSidebar matches desktop Sidebar

---

## 📝 MANDATORY COMPLIANCE

### ACCESSIBILITY
- Keyboard navigation works
- Focus states visible
- Screen reader friendly
- ARIA labels correct

### RESPONSIVE DESIGN
- Mobile overlay functional
- Sidebar slides in/out smoothly
- No horizontal scroll
- Touch-friendly on mobile

---

## 🚦 Status

**INBOX** - Awaiting LEAD architectural review

---

## 📋 Technical Implementation Notes

### Overlap Fix Investigation

**Current Sidebar positioning (line 72-74):**
```tsx
<aside
  className={`fixed top-0 left-0 h-full bg-[#0a0e1a] border-r border-slate-800 z-50 transition-transform duration-300 ${
    isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
  } w-64 flex flex-col`}
>
```

**Potential issues:**
- `z-50` may be conflicting with page content z-index
- `fixed` positioning may need adjustment
- Page wrappers may not account for Sidebar width

**Check page wrappers for:**
- Missing `ml-64` (margin-left) on desktop to account for Sidebar width
- Missing `lg:ml-64` for responsive behavior
- Z-index conflicts

**Suggested fix for page wrapper:**
```tsx
<main className="lg:ml-64 min-h-screen p-6">
  {/* page content */}
</main>
```

### Spacing Fix

**Current navigation structure (line 96-136):**
```tsx
<nav className="flex-1 overflow-y-auto p-4 space-y-6">
  {navSections.map((section) => (
    <div key={section.title}>
      <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 px-3">
        {section.title}
      </h3>
      <ul className="space-y-1">
        {/* items */}
      </ul>
    </div>
  ))}
</nav>
```

**Issue:** `flex-1` may be causing full-height justification

**Suggested fix:**
```tsx
<nav className="overflow-y-auto p-4">
  <div className="space-y-6">
    {navSections.map((section) => (
      <div key={section.title}>
        {/* section content */}
      </div>
    ))}
  </div>
</nav>
```

Remove `flex-1` from nav, wrap sections in a div with `space-y-6`.

### Link Removal

**Remove line 27 (Analytics):**
```tsx
// DELETE THIS LINE:
{ label: 'Analytics', icon: 'analytics', path: '/analytics' },
```

**Remove line 33 (Wellness Journey):**
```tsx
// DELETE THIS LINE:
{ label: 'Wellness Journey', icon: 'healing', path: '/wellness-journey' },
```

**After removal, Core section will have:**
- Dashboard only

**After removal, Clinical Tools section will have:**
- My Protocols
- Interaction Checker

**Consider:** Merging Core into Clinical Tools if desired, or renaming Core to "Home" or "Overview".

### Updated navSections Structure

```tsx
const navSections: NavSection[] = [
  {
    title: 'Core',
    items: [
      { label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
      // Analytics removed
    ],
  },
  {
    title: 'Clinical Tools',
    items: [
      // Wellness Journey removed
      { label: 'My Protocols', icon: 'assignment', path: '/protocols' },
      { label: 'Interaction Checker', icon: 'warning', path: '/interactions' },
    ],
  },
  {
    title: 'Knowledge Base',
    items: [
      { label: 'Substance Catalog', icon: 'science', path: '/catalog' },
      { label: 'Intelligence Hub', icon: 'newspaper', path: '/news' },
    ],
  },
  {
    title: 'Network',
    items: [
      { label: 'Clinician Directory', icon: 'people', path: '/clinicians' },
      { label: 'Audit Logs', icon: 'history', path: '/audit' },
    ],
  },
  {
    title: 'Support',
    items: [
      { label: 'Help & FAQ', icon: 'help', path: '/help' },
    ],
  },
];
```

### Font Size Fix (Line 84, 142)

**Current violations:**
- Line 84: `text-[9px]` → Should be `text-xs` (12px minimum)
- Line 142: `text-[10px]` → Should be `text-xs` (12px minimum)

---

## Design Reference

**Screenshot shows:**
- Sidebar overlapping page content (breadcrumbs visible behind Sidebar)
- Navigation links including "Analytics" and "Wellness Journey"
- Vertical spacing that may be expanding

**Expected result:**
- Sidebar does NOT overlap page content
- Proper margin on main content area
- Consistent vertical spacing
- No "Analytics" or "Wellness Journey" links
- Balanced navigation structure

---

## Dependencies

**Prerequisite:**
- Identify recent Sidebar changes that caused overlap
- Identify page wrapper/layout components

**Related:**
- All pages that use the Sidebar
- MobileSidebar component (should match changes)

---

## Notes

This is a **critical bug fix** combined with navigation cleanup. The overlap issue is blocking proper use of the application and must be fixed immediately.

**Priority order:**
1. Fix overlap issue (CRITICAL)
2. Fix spacing behavior
3. Remove redundant links
4. Fix font size violations

All functionality must be preserved - focus on fixing the layout and cleaning up navigation.

---

## Estimated Complexity

**6/10** - Overlap fix may require investigating page wrapper components and recent changes. Spacing and link removal are straightforward.
