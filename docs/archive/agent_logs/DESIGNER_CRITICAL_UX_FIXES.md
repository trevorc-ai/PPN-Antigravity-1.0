# CRITICAL UX Fixes - Immediate Action Required

**Priority:** P0 - BLOCKING ISSUES  
**Date:** 2026-02-12 03:29 PST  
**Status:** 🚨 IN PROGRESS

---

## 🚨 **Issue 1: Minimum Font Size Violations (CRITICAL)**

### **Problem:**
- **75+ instances** of text smaller than 10pt (8px, 9px, 10px)
- Violates accessibility guidelines (WCAG 2.1 AA requires 12pt minimum for body text)
- Violates user's explicit "minimum font size" rule

### **Current State:**
`index.css` has enforcement rule (lines 150-158) but it's **not working** because:
1. Uses escaped class names (`.text-\\[10px\\]`) which don't match actual Tailwind classes
2. `!important` is being overridden by inline styles or more specific selectors
3. Doesn't catch all variants (text-[8px], text-[9px])

### **Files Affected (Top Violators):**
1. `InteractionChecker.tsx` - 17 violations
2. `ProtocolBuilder.tsx` - 8 violations  
3. `SearchPortal.tsx` - 4 violations
4. `SafetyRiskMatrix.tsx` - 10 violations
5. `SignUp.tsx` - 6 violations
6. `Dashboard.tsx` - 3 violations

### **Fix Strategy:**

**Option A: Global CSS Override (Fastest)**
```css
/* Replace lines 150-165 in index.css */
*[class*="text-[8px]"],
*[class*="text-[9px]"],
*[class*="text-[10px]"],
.text-xs {
  font-size: max(12px, 1em) !important;
  line-height: 1.5 !important;
}

/* Chart/SVG exception */
svg text,
svg tspan {
  font-size: 11px !important;
}
```

**Option B: Find & Replace (Most Thorough)**
- Replace all `text-[8px]` → `text-xs` (12px)
- Replace all `text-[9px]` → `text-xs` (12px)
- Replace all `text-[10px]` → `text-xs` (12px)
- Update Tailwind config to set `text-xs` minimum to 12px

### **Recommended Action:**
✅ **Use Option A immediately** (5 min fix)  
Then schedule Option B for next sprint (proper cleanup)

---

## 🚨 **Issue 2: Molecule Bobbing Animation (NAUSEATING)**

### **Problem:**
- Molecule graphics on Landing page are "bobbing back and forth"
- Creates motion sickness / distraction
- Unprofessional appearance

### **Location:**
Looking at the screenshots, the molecule appears on:
- `Landing.tsx` (hero section)
- Possibly using CSS transform/translate animation

### **Current Animation:**
Need to find the keyframes - likely in:
- `Landing.tsx` inline styles
- `index.css` @keyframes
- Tailwind `animate-` utility

### **Fix:**
```css
/* Remove or replace with subtle rotation */
@keyframes molecule-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-molecule {
  animation: molecule-rotate 60s linear infinite;
  /* Slow, smooth rotation instead of bobbing */
}
```

**Action Required:**
1. Find the molecule animation class
2. Replace with subtle rotation OR remove entirely
3. Test on Landing page

---

## 🚨 **Issue 3: Substances Page - Excessive Padding & Card Detail**

### **Problem:**
From screenshot analysis:
- Too much horizontal padding (wasted space)
- Cards may lack important details
- Grid layout could be denser

### **Current State (Need to Verify):**
```typescript
// Likely in SubstanceCatalog.tsx or similar
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-12">
  {/* Cards */}
</div>
```

### **Proposed Fix:**
```typescript
// Reduce padding, increase density
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-6">
  {/* Cards with more detail */}
</div>
```

### **Card Detail Improvements:**
Add to substance cards:
- **RxNorm CUI** (if available)
- **Schedule** (DEA classification)
- **Primary indication** (most common use)
- **Efficacy range** (e.g., "78-92% response rate")

**Action Required:**
1. View `SubstanceCatalog.tsx` or equivalent
2. Reduce container padding from `px-12` to `px-6`
3. Add 4th column on xl screens
4. Enhance card content with clinical metadata

---

## 📋 **Implementation Checklist**

### **Phase 1: Emergency Fixes (30 min)**
- [ ] Fix font size violations (Option A - CSS override)
- [ ] Remove/fix molecule bobbing animation
- [ ] Reduce Substances page padding

### **Phase 2: Proper Cleanup (2 hours)**
- [ ] Replace all text-[8-10px] with proper Tailwind classes
- [ ] Update Tailwind config for minimum font sizes
- [ ] Enhance substance card details
- [ ] Add 4-column grid for xl screens

### **Phase 3: Verification (15 min)**
- [ ] Visual inspection of all pages
- [ ] Accessibility audit (font sizes)
- [ ] Animation smoothness check
- [ ] Substances page layout review

---

## 🎯 **Success Criteria**

1. ✅ **No text smaller than 12px** anywhere in the app
2. ✅ **No nauseating animations** (smooth, subtle only)
3. ✅ **Substances page uses screen space efficiently**
4. ✅ **Cards show meaningful clinical data**

---

**Next Steps:**
1. Apply CSS font size override (index.css)
2. Find and fix molecule animation
3. Audit Substances page layout
4. Report back with screenshots

**Status:** Ready for implementation  
**Estimated Time:** 45 minutes total
