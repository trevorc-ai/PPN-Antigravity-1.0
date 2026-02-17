# WO-067: Site-Wide Text Brightness Reduction

**Work Order ID:** WO-067  
**Priority:** P1 (High)  
**Category:** Accessibility / UX / Design System  
**Owner:** DESIGNER  
**Created:** 2026-02-16  
**Status:** 00_INBOX

---

## Problem Statement

**User Feedback:** "I'm still seeing tons of bright white text, which is really hard on the eyes."

**Root Cause:** Inconsistent use of text colors across the site, with many instances of overly bright text (`text-white`, `text-slate-100`, `text-slate-300`).

**Impact:** Eye strain, poor accessibility, inconsistent design system.

---

## Design Standard (NEW RULE)

**Maximum Text Brightness:** `text-slate-200`

**Recommended Text Color Hierarchy:**
- **Primary Headings (H1):** `text-slate-200` (maximum brightness)
- **Secondary Headings (H2, H3):** `text-slate-300` → **CHANGE TO** `text-slate-400`
- **Body Text:** `text-slate-400` or `text-slate-500`
- **Secondary Text:** `text-slate-500` or `text-slate-600`
- **Muted Text:** `text-slate-600` or `text-slate-700`

**Colors to Replace:**
- ❌ `text-white` → ✅ `text-slate-200`
- ❌ `text-slate-100` → ✅ `text-slate-200`
- ❌ `text-slate-300` → ✅ `text-slate-400` or `text-slate-500`

---

## Scope Analysis

**Total Files Affected:** 50+ files  
**Total Instances:** 900+ occurrences

**Most Affected Files:**
1. `ProtocolDetail.tsx` - 40+ instances
2. `About.tsx` - 30+ instances
3. `AdaptiveAssessmentPage.tsx` - 20+ instances
4. `Landing.tsx` - 50+ instances
5. All component files

---

## Implementation Strategy

### **Phase 1: Create Global CSS Rule (1 hour)**

Add to `index.css`:
```css
/* Maximum text brightness enforcement */
.text-white {
  @apply text-slate-200 !important;
}

/* Soften slate-300 to slate-400 */
.text-slate-300 {
  @apply text-slate-400 !important;
}
```

**Pros:**
- Instant site-wide fix
- No code changes required
- Easy to revert

**Cons:**
- Overrides existing styles
- Doesn't fix semantic issues

---

### **Phase 2: Manual Replacement (8-10 hours)**

Use find-and-replace to update all files:

**Replacements:**
1. `text-white` → `text-slate-200`
2. `text-slate-100` → `text-slate-200`
3. `text-slate-300` → `text-slate-400` (for headings)
4. `text-slate-300` → `text-slate-500` (for body text)

**Files to Update:**
- All `.tsx` and `.jsx` files in `src/`
- Focus on pages first, then components

---

### **Phase 3: Design System Documentation (2 hours)**

Create `DESIGN_SYSTEM.md`:
- Text color hierarchy
- Usage guidelines
- Examples
- Accessibility notes

---

## Recommended Approach

**Option A: Quick Fix (Phase 1 only)**
- Add CSS override to `index.css`
- Instant site-wide fix
- Time: 1 hour

**Option B: Proper Fix (Phase 1 + Phase 2)**
- Add CSS override for immediate relief
- Gradually replace instances file-by-file
- Time: 10-12 hours

**Option C: Complete Fix (All Phases)**
- CSS override + manual replacement + documentation
- Time: 12-14 hours

---

## Acceptance Criteria

- [ ] No instances of `text-white` in codebase
- [ ] No instances of `text-slate-100` in codebase
- [ ] Minimal instances of `text-slate-300` (only for specific use cases)
- [ ] Maximum text brightness is `text-slate-200`
- [ ] Design system documentation created
- [ ] User confirms text is easier on eyes

---

## Success Metrics

**Before:**
- 900+ instances of overly bright text
- Inconsistent text color usage
- User reports eye strain

**After:**
- 0 instances of `text-white` or `text-slate-100`
- <50 instances of `text-slate-300` (specific use cases only)
- Consistent text color hierarchy
- User confirms improved readability

---

## Estimated Time

- **Phase 1 (CSS Override):** 1 hour
- **Phase 2 (Manual Replacement):** 8-10 hours
- **Phase 3 (Documentation):** 2 hours
- **Total:** 11-13 hours

---

## Dependencies

- None (can start immediately)

---

## Notes

This is a **site-wide accessibility improvement** that will make the application significantly easier on the eyes. The CSS override provides immediate relief while we work on the proper fix.

**Recommendation:** Start with Phase 1 (CSS override) for immediate user relief, then proceed with Phase 2 (manual replacement) over the next few days.

---

**DESIGNER SIGN-OFF:** Ready for LEAD review and prioritization.
