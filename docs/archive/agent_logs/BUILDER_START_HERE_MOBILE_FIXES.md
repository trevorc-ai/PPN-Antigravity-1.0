# 🔨 BUILDER: Mobile Fixes - Ready to Start

**From:** DESIGNER  
**To:** BUILDER  
**Date:** 2026-02-12 06:29 PST  
**Status:** 🟢 READY TO START  
**Priority:** 🔴 CRITICAL

---

## 📋 **QUICK START**

You have **2 task documents** ready for implementation:

1. **BUILDER_TASK_MOBILE_CRITICAL_FIXES.md** (Phase 1 - CRITICAL)
   - 3 tasks, 7 hours estimated
   - Fixes 4 major mobile issues
   - **START HERE**

2. **BUILDER_TASK_MOBILE_MINOR_FIXES.md** (Phase 2 - MEDIUM)
   - 3 tasks, 3 hours estimated
   - Fixes 7 minor mobile issues
   - **Do after Phase 1**

---

## 🎯 **PHASE 1: CRITICAL FIXES (START NOW)**

### **Task 1: Fix Global Input Overflows** ⏱️ 2 hours
**File:** `src/index.css`

**What to do:**
Add this CSS at the end of the file:

```css
/* ============================================
   MOBILE INPUT CONSTRAINTS
   ============================================ */

@media (max-width: 768px) {
  input[type="text"],
  input[type="search"],
  input[type="email"],
  input[type="password"],
  input[type="tel"],
  input[type="url"],
  select,
  textarea {
    max-width: 100% !important;
    width: 100% !important;
    min-width: 0 !important;
  }

  .search-container,
  .input-wrapper,
  form > div {
    max-width: 100%;
    overflow: hidden;
  }

  button[class*="absolute"] {
    position: relative !important;
  }
}
```

**Test:**
- Open http://localhost:3000/#/help (375px viewport)
- Verify search input fits in viewport
- Test on Practitioners, Interaction Checker pages

---

### **Task 2: Fix Protocol Builder** ⏱️ 3 hours
**File:** `src/components/ProtocolBuilder.tsx`

**What to do:**
1. Import ButtonGroup: `import ButtonGroup from './ButtonGroup';`
2. Replace all radio button groups with ButtonGroup component
3. Change all `w-64`, `w-48` to `w-full`
4. Use responsive grid: `grid grid-cols-1 md:grid-cols-2 gap-6`

**Example:**
```tsx
// BEFORE
<div className="flex gap-4">
  <button className="px-4 py-2 border">Male</button>
  <button className="px-4 py-2 border">Female</button>
</div>

// AFTER
<ButtonGroup
  options={[
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' }
  ]}
  value={formData.biological_sex}
  onChange={(value) => setFormData({ ...formData, biological_sex: value })}
  name="biological_sex"
/>
```

**Test:**
- Open http://localhost:3000/#/builder (375px viewport)
- Verify no horizontal scroll
- Test form submission

---

### **Task 3: Simplify Top Bar** ⏱️ 2 hours
**File:** `src/components/Header.tsx` (or equivalent)

**What to do:**
Show only 3 icons on mobile (Menu, Alerts, Profile)

```tsx
{/* Mobile: 3 icons only */}
<div className="flex items-center gap-2 lg:hidden">
  <button><span className="material-symbols-outlined">menu</span></button>
  <button><span className="material-symbols-outlined">notifications</span></button>
  <button><span className="material-symbols-outlined">account_circle</span></button>
</div>

{/* Desktop: All 7 icons */}
<div className="hidden lg:flex items-center gap-2">
  {/* All icons */}
</div>
```

**Test:**
- Check all pages on 375px viewport
- Verify mobile shows 3 icons
- Verify desktop shows 7 icons

---

## ✅ **ACCEPTANCE CRITERIA (Phase 1)**

After completing all 3 tasks:
- [ ] No horizontal scroll on any page (375px viewport)
- [ ] All inputs fit within viewport
- [ ] Protocol Builder form works on mobile
- [ ] Top bar shows ≤3 icons on mobile
- [ ] Desktop layout unaffected
- [ ] Lighthouse mobile score >90

---

## 🧪 **TESTING PROCEDURE**

### **1. Set Mobile Viewport:**
```
1. Open Chrome DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Select "iPhone SE" or set to 375px × 667px
```

### **2. Test These Pages:**
- [ ] http://localhost:3000/#/help
- [ ] http://localhost:3000/#/clinicians
- [ ] http://localhost:3000/#/interactions
- [ ] http://localhost:3000/#/builder
- [ ] http://localhost:3000/#/dashboard

### **3. For Each Page, Verify:**
- [ ] No horizontal scroll (scroll bar should not appear)
- [ ] All content visible
- [ ] All buttons tappable
- [ ] Forms work correctly

### **4. Run Lighthouse Audit:**
```
1. Open DevTools > Lighthouse tab
2. Select "Mobile" device
3. Click "Analyze page load"
4. Target score: >90
```

---

## 🚨 **COMMON ISSUES & SOLUTIONS**

### **Issue: Desktop layout breaks**
**Solution:** Use responsive classes
```tsx
// ❌ BAD
<div className="w-full">

// ✅ GOOD
<div className="w-full md:w-64">
```

### **Issue: Inputs still overflow**
**Solution:** Check for inline styles
```tsx
// ❌ BAD
<input style={{ width: '500px' }} />

// ✅ GOOD
<input className="w-full" />
```

### **Issue: ButtonGroup not found**
**Solution:** Check import path
```tsx
import ButtonGroup from './ButtonGroup';
// or
import ButtonGroup from '@/components/ButtonGroup';
```

---

## 📊 **PROGRESS TRACKING**

### **Current State (Before Fixes):**
- ❌ 4 pages with major issues (28%)
- ⚠️ 7 pages with minor issues (50%)
- ✅ 3 pages working well (21%)

### **Target (After Phase 1):**
- ❌ 0 pages with major issues (0%)
- ⚠️ 7 pages with minor issues (50%)
- ✅ 7 pages working well (50%)

### **Final Target (After Phase 2):**
- ❌ 0 pages with major issues (0%)
- ⚠️ 2 pages with minor issues (14%)
- ✅ 12 pages working well (86%)

---

## 📁 **FILES YOU'LL EDIT**

### **Phase 1 (Critical):**
1. ✅ `src/index.css`
2. ✅ `src/components/ProtocolBuilder.tsx`
3. ✅ `src/components/Header.tsx`

### **Phase 2 (Minor):**
4. ⏸️ `src/pages/SafetySurveillance.tsx`
5. ⏸️ `src/pages/MolecularPharmacology.tsx`
6. ⏸️ `src/pages/PatientConstellation.tsx`

---

## 💬 **QUESTIONS?**

**Before starting, confirm:**

1. **Can you find these files?**
   - [ ] `src/index.css`
   - [ ] `src/components/ProtocolBuilder.tsx`
   - [ ] `src/components/Header.tsx`
   - [ ] `src/components/ButtonGroup.tsx`

2. **Do you have access to mobile testing?**
   - [ ] Chrome DevTools device mode
   - [ ] Real mobile device (optional)

3. **Estimated time?**
   - DESIGNER estimate: 7 hours (Phase 1)
   - Your estimate: _____ hours

**If you have questions or blockers, ask DESIGNER immediately.**

---

## 🎯 **IMPLEMENTATION ORDER**

**Recommended sequence:**

1. ✅ **Task 1** (Global CSS) - Start here, easiest
2. ✅ **Task 3** (Top Bar) - Medium difficulty
3. ✅ **Task 2** (Protocol Builder) - Most complex, do last

**Why this order?**
- Task 1 fixes 4 pages immediately with minimal risk
- Task 3 is independent and improves overall UX
- Task 2 benefits from Tasks 1 & 3 being complete

---

## 📝 **COMMIT MESSAGES**

Use these commit messages:

```bash
git commit -m "fix(mobile): add global input constraints for mobile viewport"
git commit -m "fix(mobile): simplify top bar to 3 icons on mobile"
git commit -m "fix(mobile): make Protocol Builder responsive with ButtonGroup"
```

---

## 🔍 **FINAL VERIFICATION**

After all tasks complete:

```bash
# 1. Test all 14 pages on 375px viewport
# 2. Verify no horizontal scroll anywhere
# 3. Run Lighthouse mobile audit (target >90)
# 4. Test on real device if available
# 5. Commit changes with proper messages
# 6. Notify DESIGNER for review
```

---

## ✅ **WHEN YOU'RE DONE**

**Notify DESIGNER with:**
1. ✅ All tasks completed
2. 📊 Lighthouse mobile score
3. 🐛 Any issues encountered
4. ⏱️ Actual time spent
5. 📸 Screenshots of before/after (optional)

**DESIGNER will then:**
- Review all changes
- Test on multiple devices
- Verify no regressions
- Approve for merge

---

**Ready to Start:** 2026-02-12 06:29 PST  
**Estimated Completion:** 2026-02-14 (end of week)  
**Priority:** 🔴 CRITICAL - Blocks mobile launch  
**Owner:** BUILDER  
**Reviewer:** DESIGNER

---

## 🚀 **LET'S GO!**

You have everything you need to start:
- ✅ Detailed task specs
- ✅ Code examples
- ✅ Testing procedures
- ✅ Acceptance criteria
- ✅ Troubleshooting guide

**Start with Task 1 (Global CSS) and work your way through!**

Good luck! 🎉
