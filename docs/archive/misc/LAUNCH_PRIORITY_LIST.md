# 🚀 LAUNCH PRIORITY LIST
**Date:** February 9, 2026 19:50 PST  
**Status:** LAUNCH MODE - HOSTING TONIGHT  
**Deadline:** ASAP (Domain + Hosting Connection)

---

## 🎯 **LAUNCH PHILOSOPHY**

**Rule #1:** Ship what works, fix what's broken, defer what's nice-to-have.  
**Rule #2:** No user should see a broken page or missing feature.  
**Rule #3:** Every public page must look intentional and polished.

---

## ✅ **WHAT'S READY TO SHIP (DO NOT TOUCH)**

### **Pages That Are 9/10 or Better:**
1. ✅ **Dashboard** - 10/10 (world-class, ship as-is)
2. ✅ **Login Page** - 9/10 (clean, secure feel)
3. ✅ **Landing Page Hero** - 9/10 (professional, clear value prop)
4. ✅ **About PPN Section** - 9/10 (clean, well-formatted)
5. ✅ **Regulatory Map** - 8/10 (functional, good enough for launch)
6. ✅ **Search Portal** - 8/10 (functional, needs minor polish)
7. ✅ **Substance Monograph** - 8/10 (functional, needs tooltips)

### **Components That Work:**
- ✅ GravityButton (magnetic cursor)
- ✅ BentoGrid (12-column system)
- ✅ Sidebar navigation
- ✅ ConnectFeedButton
- ✅ All analytics components

---

## 🔴 **CRITICAL BLOCKERS (MUST FIX BEFORE LAUNCH)**

### **Priority 1: Broken or Confusing Pages** ⏰ 60 minutes

#### **1.1 Landing Page - Problem/Solution Section**
**Current Issue:** Inconsistent colors, dummy chart, feels disconnected  
**Impact:** First impression page, users will see this  
**Fix Required:** Consistent text colors + remove dummy chart  
**Time:** 15 minutes  
**Complexity:** LOW

**Quick Fix:**
```tsx
// File: src/pages/Landing.tsx
// Lines 502-598

// Change ALL text to consistent slate-300:
className="text-slate-300" // (not slate-400 or slate-200)

// Remove or hide the dummy bar chart
// Replace with simple text or remove entirely
```

**Status:** ❌ BLOCKER

---

#### **1.2 Landing Page - Bento Box Visuals**
**Current Issue:** Cards have text but no visual previews  
**Impact:** Looks incomplete, "under construction" vibe  
**Fix Required:** Either add simple visuals OR simplify to text-only cards  
**Time:** 20 minutes  
**Complexity:** LOW

**Quick Fix Option A (Text-Only):**
```tsx
// Remove visual placeholders, make cards text-focused
// Add icons, remove "coming soon" feel
```

**Quick Fix Option B (Simple Visuals):**
```tsx
// Add placeholder icons or simple graphics
// Use Material Symbols icons as stand-ins
```

**Status:** ⚠️ IMPORTANT

---

#### **1.3 Search Portal - Search Input Visibility**
**Current Issue:** Typed text not visible, AI icon hidden  
**Impact:** Core functionality appears broken  
**Fix Required:** Fix input styling  
**Time:** 5 minutes  
**Complexity:** LOW

**Quick Fix:**
```tsx
// File: src/pages/SearchPortal.tsx
// Ensure input has proper text color and padding

className="w-full pl-12 pr-14 py-4 text-white placeholder-slate-500"
```

**Status:** ❌ BLOCKER

---

#### **1.4 Deep Dive Pages - Inconsistent Widths**
**Current Issue:** Pages have different max-widths, feels jarring  
**Impact:** Navigation between pages feels broken  
**Fix Required:** Standardize all to "wide" layout  
**Time:** 10 minutes  
**Complexity:** LOW

**Quick Fix:**
```tsx
// All deep dive pages should use:
<PageContainer width="wide" className="py-10">
```

**Status:** ⚠️ IMPORTANT

---

#### **1.5 Substance Monograph - Spider Graph Text**
**Current Issue:** Text too small (10px), unreadable  
**Impact:** Key feature looks broken  
**Fix Required:** Increase to 12px minimum  
**Time:** 2 minutes  
**Complexity:** LOW

**Quick Fix:**
```tsx
// File: src/pages/SubstanceMonograph.tsx
// Line 288

<PolarAngleAxis dataKey="subject" tick={{ fill: '#cbd5e1', fontSize: 12, fontWeight: 900 }} />
```

**Status:** ❌ BLOCKER

---

### **Priority 2: Missing Critical Features** ⏰ 30 minutes

#### **2.1 404 Page**
**Current Issue:** No 404 page exists  
**Impact:** Broken links show blank page  
**Fix Required:** Create simple 404 page  
**Time:** 10 minutes  
**Complexity:** LOW

**Quick Fix:**
```tsx
// Create src/pages/NotFound.tsx
// Simple page with "Page not found" + link to home
```

**Status:** ❌ BLOCKER

---

#### **2.2 Loading States**
**Current Issue:** No loading indicators on data-heavy pages  
**Impact:** Pages appear frozen during data fetch  
**Fix Required:** Add simple loading spinners  
**Time:** 15 minutes  
**Complexity:** LOW

**Quick Fix:**
```tsx
// Add to Dashboard, Analytics, Search Portal:
{isLoading ? <LoadingSpinner /> : <Content />}
```

**Status:** ⚠️ IMPORTANT

---

#### **2.3 Error Boundaries**
**Current Issue:** Errors crash entire app  
**Impact:** One broken component kills whole site  
**Fix Required:** Add React Error Boundary  
**Time:** 5 minutes  
**Complexity:** LOW

**Quick Fix:**
```tsx
// Wrap App.tsx in ErrorBoundary
// Show friendly error message instead of crash
```

**Status:** ⚠️ IMPORTANT

---

## 🟡 **IMPORTANT (SHOULD FIX BEFORE LAUNCH)**

### **Priority 3: Polish & Consistency** ⏰ 45 minutes

#### **3.1 Landing Page - CTA Button Consistency**
**Current Issue:** Buttons different sizes/styles  
**Impact:** Looks unprofessional  
**Time:** 5 minutes

#### **3.2 Landing Page - Gradient Keywords**
**Current Issue:** Missing gradients on key terms  
**Impact:** Less visual impact  
**Time:** 10 minutes

#### **3.3 Landing Page - Veterans PTSD Statement**
**Current Issue:** Missing commitment statement  
**Impact:** Missing key value prop  
**Time:** 10 minutes

#### **3.4 Search Portal - Layout Spacing**
**Current Issue:** Filters too close to results  
**Impact:** Feels cramped  
**Time:** 5 minutes

#### **3.5 Dashboard - Card Spacing**
**Current Issue:** Cards too close together  
**Impact:** Feels cluttered  
**Time:** 3 minutes

#### **3.6 Molecule Backgrounds**
**Current Issue:** Inconsistent backgrounds on molecule images  
**Impact:** Visual inconsistency  
**Time:** 5 minutes

#### **3.7 Naming Consistency**
**Current Issue:** "Patient Constellation" vs "Patient Outcomes Map"  
**Impact:** Confusing navigation  
**Time:** 7 minutes

---

## 🟢 **NICE-TO-HAVE (DEFER TO POST-LAUNCH)**

### **Priority 4: Future Enhancements** ⏰ Defer

#### **4.1 Substance Monograph - Horizontal Hero**
**Impact:** Better layout, but current works  
**Time:** 45 minutes  
**Status:** 🟢 DEFER

#### **4.2 Substance Monograph - Tooltips**
**Impact:** Better UX, but not critical  
**Time:** 30 minutes  
**Status:** 🟢 DEFER

#### **4.3 Deep Dive Layout Component**
**Impact:** DRY code, but current works  
**Time:** 20 minutes  
**Status:** 🟢 DEFER

#### **4.4 Logo Slider Supabase Connection**
**Impact:** Dynamic data, but static works  
**Time:** 2 hours  
**Status:** 🟢 DEFER

#### **4.5 Regulatory Map - Interactive Choropleth**
**Impact:** Amazing feature, but big lift  
**Time:** 2 weeks  
**Status:** 🟢 DEFER (Phase 2)

---

## 📊 **LAUNCH READINESS SCORECARD**

| Category | Current | Target | Status |
|----------|---------|--------|--------|
| **Critical Blockers** | 5 issues | 0 issues | 🔴 NOT READY |
| **Important Issues** | 7 issues | 0 issues | 🟡 NEEDS WORK |
| **Nice-to-Haves** | 5 issues | N/A | 🟢 ACCEPTABLE |
| **Overall Readiness** | 60% | 95%+ | 🔴 NOT READY |

---

## ⏰ **LAUNCH TIMELINE**

### **Phase 1: Critical Blockers (60 minutes)**
1. Fix Problem/Solution text colors (15 min)
2. Fix Bento Box visuals (20 min)
3. Fix Search input visibility (5 min)
4. Fix Deep Dive widths (10 min)
5. Fix Spider graph text (2 min)
6. Create 404 page (10 min)

**After Phase 1:** 85% launch-ready

---

### **Phase 2: Important Issues (45 minutes)**
1. CTA button consistency (5 min)
2. Gradient keywords (10 min)
3. Veterans PTSD statement (10 min)
4. Search layout spacing (5 min)
5. Dashboard spacing (3 min)
6. Molecule backgrounds (5 min)
7. Naming consistency (7 min)

**After Phase 2:** 95% launch-ready ✅

---

### **Phase 3: Final Checks (15 minutes)**
1. Test all navigation links
2. Test on mobile (iPhone)
3. Test on desktop (27" monitor)
4. Check for console errors
5. Verify no PHI/PII visible

**After Phase 3:** 100% launch-ready 🚀

---

## 🎯 **RECOMMENDED LAUNCH STRATEGY**

### **Option A: Fix Critical + Important (2 hours)** ⭐ RECOMMENDED
**Timeline:**
- 7:50 PM - 8:50 PM: Phase 1 (Critical Blockers)
- 8:50 PM - 9:35 PM: Phase 2 (Important Issues)
- 9:35 PM - 9:50 PM: Phase 3 (Final Checks)
- 9:50 PM: **LAUNCH** 🚀

**Result:** 95% polished, ready for public

---

### **Option B: Fix Critical Only (1 hour)**
**Timeline:**
- 7:50 PM - 8:50 PM: Phase 1 (Critical Blockers)
- 8:50 PM - 9:05 PM: Phase 3 (Final Checks)
- 9:05 PM: **LAUNCH** 🚀

**Result:** 85% polished, functional but rough edges

---

### **Option C: Ship As-Is (0 hours)** ⚠️ NOT RECOMMENDED
**Timeline:**
- 7:50 PM: **LAUNCH** 🚀

**Result:** 60% polished, visible issues, risky

---

## 🛠️ **IMPLEMENTATION BATCHES**

### **BATCH 1: CRITICAL FIXES (60 min)** 🔴
**Files to modify:** 5 files  
**Risk:** LOW  
**Impact:** HIGH

1. `src/pages/Landing.tsx` (Problem/Solution + Bento)
2. `src/pages/SearchPortal.tsx` (Input visibility)
3. `src/pages/deep-dives/*.tsx` (5 files - width consistency)
4. `src/pages/SubstanceMonograph.tsx` (Spider graph)
5. `src/pages/NotFound.tsx` (NEW - 404 page)

---

### **BATCH 2: POLISH (45 min)** 🟡
**Files to modify:** 7 files  
**Risk:** LOW  
**Impact:** MEDIUM

1. `src/pages/Landing.tsx` (CTA, gradients, Veterans)
2. `src/pages/SearchPortal.tsx` (Spacing)
3. `src/pages/Dashboard.tsx` (Spacing)
4. `src/components/Sidebar.tsx` (Naming)
5. `src/App.tsx` (Routes)

---

## 📋 **BUILDER INSTRUCTIONS**

### **To Execute Batch 1 (Critical):**
```bash
# 1. Open BUILDER_IMPLEMENTATION_PLAN.md
# 2. Execute ONLY these tasks:
#    - Task 2.1 (Landing CTA) - SKIP, defer to Batch 2
#    - Task 2.2 (Landing headings) - INCLUDE
#    - Task 2.6 (Search input) - INCLUDE
#    - Task 4.2 (Deep Dive widths) - INCLUDE
#    - Task 5.4 (Spider graph) - INCLUDE
#    - NEW: Create 404 page
# 3. Test after each task
# 4. Report completion
```

### **To Execute Batch 2 (Polish):**
```bash
# 1. Execute remaining tasks from BUILDER_IMPLEMENTATION_PLAN.md
# 2. Focus on visual consistency
# 3. Test thoroughly
# 4. Report completion
```

---

## ✅ **LAUNCH CHECKLIST**

### **Pre-Launch (Must Complete):**
- [ ] All Critical Blockers fixed (Batch 1)
- [ ] All Important Issues fixed (Batch 2)
- [ ] 404 page created
- [ ] Loading states added
- [ ] Error boundaries added
- [ ] Mobile tested (iPhone)
- [ ] Desktop tested (27")
- [ ] No console errors
- [ ] No PHI/PII visible
- [ ] All navigation links work

### **Launch (Deployment):**
- [ ] Build production bundle (`npm run build`)
- [ ] Test production build locally
- [ ] Connect to hosting (Vercel/Netlify)
- [ ] Connect custom domain
- [ ] Test live site
- [ ] Monitor for errors

### **Post-Launch (Week 1):**
- [ ] Substance Monograph horizontal hero
- [ ] Substance Monograph tooltips
- [ ] Deep Dive layout component
- [ ] Logo Slider Supabase connection
- [ ] Analytics tracking setup

---

## 🚨 **CRITICAL REMINDERS**

1. **DO NOT** touch Dashboard (it's perfect)
2. **DO NOT** touch Login page (it's great)
3. **DO NOT** add new features (only fix broken ones)
4. **DO NOT** refactor working code (ship, then improve)
5. **DO** test after every change
6. **DO** commit after every task
7. **DO** keep changes minimal

---

## 📞 **DECISION NEEDED**

**Which launch strategy do you want?**

**Option A:** Fix Critical + Important (2 hours) → 95% polished ⭐ RECOMMENDED  
**Option B:** Fix Critical Only (1 hour) → 85% polished  
**Option C:** Ship As-Is (0 hours) → 60% polished ⚠️ RISKY

**Please confirm:**
1. Which option? (A, B, or C)
2. Target launch time? (e.g., "10 PM tonight")
3. Any pages to exclude from public? (e.g., hide Analytics until ready)

---

**Once you confirm, I'll create the exact implementation batches for Builder to execute.** 🚀
