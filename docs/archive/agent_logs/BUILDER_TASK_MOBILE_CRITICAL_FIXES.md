# 🔧 BUILDER TASK: Mobile Critical Fixes

**From:** DESIGNER  
**To:** BUILDER  
**Date:** 2026-02-12 06:14 PST  
**Priority:** 🔴 CRITICAL  
**Estimated Time:** 7 hours  
**Type:** Bug Fixes - Mobile Responsiveness

---

## 🎯 **OBJECTIVE**

Fix 4 critical mobile UX issues that cause horizontal scrolling and layout breakage on iPhone SE (375px viewport).

**Success Criteria:**
- [ ] No horizontal scroll on any page (375px viewport)
- [ ] All inputs fit within viewport
- [ ] Top bar shows ≤3 icons on mobile
- [ ] Protocol Builder form works on mobile
- [ ] Lighthouse mobile score >90

---

## 📋 **TASK BREAKDOWN**

### **TASK 1: Fix Global Input Overflows** 🔴
**Priority:** CRITICAL  
**Time:** 2 hours  
**Complexity:** 3/10 (Simple CSS fix)

#### **Problem:**
Search inputs on Help, Practitioners, and Interaction Checker pages overflow viewport, causing horizontal page scroll.

#### **Root Cause:**
Fixed widths or unconstrained inputs without `max-width: 100%`

#### **Solution:**
Add global mobile CSS rule to constrain all inputs.

#### **Files to Edit:**
1. `src/index.css`

#### **Implementation:**

**Step 1:** Open `src/index.css`

**Step 2:** Add mobile input constraints at the end of the file:

```css
/* ============================================
   MOBILE INPUT CONSTRAINTS
   ============================================ */

/* Prevent input overflow on mobile devices */
@media (max-width: 768px) {
  /* All text inputs */
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

  /* Ensure parent containers don't force overflow */
  .search-container,
  .input-wrapper,
  form > div {
    max-width: 100%;
    overflow: hidden;
  }

  /* Fix for absolute positioned elements */
  button[class*="absolute"] {
    position: relative !important;
  }
}
```

**Step 3:** Test on these pages (375px viewport):
- [ ] Help & FAQ - Search input
- [ ] Practitioners - Search input
- [ ] Interaction Checker - Dropdowns
- [ ] Research Portal - Search bar

#### **Acceptance Criteria:**
- [ ] All inputs fit within 375px viewport
- [ ] No horizontal scroll on any page
- [ ] Inputs remain functional (can type, submit)
- [ ] Desktop layout unaffected

---

### **TASK 2: Fix Protocol Builder Mobile Layout** 🔴
**Priority:** CRITICAL  
**Time:** 3 hours  
**Complexity:** 7/10 (Requires component refactoring)

#### **Problem:**
Protocol Builder form fields overflow viewport on mobile, causing horizontal scroll and poor UX.

#### **Root Cause:**
- Fixed-width form fields
- ButtonGroup not used for radio-style inputs
- Horizontal layout on narrow screens

#### **Solution:**
1. Use existing ButtonGroup component (already mobile-responsive)
2. Remove all fixed widths
3. Stack form fields vertically on mobile

#### **Files to Edit:**
1. `src/components/ProtocolBuilder.tsx`

#### **Implementation:**

**Step 1:** Import ButtonGroup component (if not already imported)

```typescript
import ButtonGroup from './ButtonGroup';
```

**Step 2:** Replace radio button groups with ButtonGroup

**BEFORE (Example - Biological Sex):**
```tsx
<div className="flex gap-4">
  <button className="px-4 py-2 border">Male</button>
  <button className="px-4 py-2 border">Female</button>
  <button className="px-4 py-2 border">Intersex</button>
  <button className="px-4 py-2 border">Unknown</button>
</div>
```

**AFTER:**
```tsx
<ButtonGroup
  options={[
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'intersex', label: 'Intersex' },
    { value: 'unknown', label: 'Unknown' }
  ]}
  value={formData.biological_sex}
  onChange={(value) => setFormData({ ...formData, biological_sex: value })}
  name="biological_sex"
/>
```

**Step 3:** Apply to all radio-style inputs:
- Biological Sex
- Smoking Status
- Severity Grade
- Resolution Status
- Any other multi-choice fields

**Step 4:** Remove fixed widths from all inputs

**Find and replace:**
```tsx
// BEFORE
<input className="w-64 px-4 py-2" />
<select className="w-48 px-4 py-2" />

// AFTER
<input className="w-full px-4 py-2" />
<select className="w-full px-4 py-2" />
```

**Step 5:** Add responsive grid for form layout

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Form fields */}
</div>
```

**Step 6:** Ensure accordions work on mobile

```tsx
<div className="space-y-4">
  {/* Each accordion section */}
  <div className="border border-slate-700 rounded-xl overflow-hidden">
    <button
      className="w-full px-4 py-3 flex items-center justify-between"
      onClick={() => toggleSection('demographics')}
    >
      <span className="text-sm font-bold uppercase">Patient Demographics</span>
      <span className="material-symbols-outlined">
        {openSections.demographics ? 'expand_less' : 'expand_more'}
      </span>
    </button>
    {openSections.demographics && (
      <div className="p-4 space-y-4">
        {/* Form fields */}
      </div>
    )}
  </div>
</div>
```

#### **Acceptance Criteria:**
- [ ] All form fields fit within 375px viewport
- [ ] ButtonGroup components stack vertically on mobile
- [ ] No horizontal scroll
- [ ] Form submission works
- [ ] Accordions expand/collapse smoothly
- [ ] Desktop layout unaffected (2-column grid on md+)

---

### **TASK 3: Simplify Mobile Top Bar** 🔴
**Priority:** HIGH  
**Time:** 2 hours  
**Complexity:** 5/10 (Conditional rendering)

#### **Problem:**
Top bar shows 7 icons on 375px screen, causing overcrowding and small tap targets.

**Current icons:**
1. Menu (hamburger)
2. Tour
3. Search
4. Alerts
5. Help
6. Vibe
7. Profile

#### **Solution:**
Show only essential icons on mobile (Menu, Alerts, Profile). Move others to sidebar.

#### **Files to Edit:**
1. `src/components/Header.tsx` (or equivalent top bar component)
2. `src/components/Sidebar.tsx` (add secondary actions)

#### **Implementation:**

**Step 1:** Find the Header/TopBar component

Look for file containing the top navigation icons. Likely:
- `src/components/Header.tsx`
- `src/components/TopBar.tsx`
- `src/components/Layout.tsx`

**Step 2:** Add responsive icon visibility

```tsx
{/* Mobile: Show only essential icons */}
<div className="flex items-center gap-2 lg:hidden">
  {/* Menu - Always visible on mobile */}
  <button
    onClick={onMenuClick}
    className="p-2 text-slate-400 hover:text-white"
    aria-label="Open menu"
  >
    <span className="material-symbols-outlined">menu</span>
  </button>

  {/* Alerts - Essential */}
  <button
    className="p-2 text-slate-400 hover:text-white relative"
    aria-label="Alerts"
  >
    <span className="material-symbols-outlined">notifications</span>
    {alertCount > 0 && (
      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
    )}
  </button>

  {/* Profile - Essential */}
  <button
    className="p-2 text-slate-400 hover:text-white"
    aria-label="Profile"
  >
    <span className="material-symbols-outlined">account_circle</span>
  </button>
</div>

{/* Desktop: Show all icons */}
<div className="hidden lg:flex items-center gap-2">
  <button className="p-2">
    <span className="material-symbols-outlined">tour</span>
  </button>
  <button className="p-2">
    <span className="material-symbols-outlined">search</span>
  </button>
  <button className="p-2">
    <span className="material-symbols-outlined">notifications</span>
  </button>
  <button className="p-2">
    <span className="material-symbols-outlined">help_center</span>
  </button>
  <button className="p-2">
    <span className="material-symbols-outlined">psychology</span>
  </button>
  <button className="p-2">
    <span className="material-symbols-outlined">account_circle</span>
  </button>
</div>
```

**Step 3:** Add secondary actions to mobile sidebar (OPTIONAL)

If you want to keep Tour, Search, Help, Vibe accessible on mobile, add them to the sidebar:

In `src/components/Sidebar.tsx`, add a new section:

```tsx
{
  title: 'Quick Actions',
  items: [
    { label: 'Start Tour', icon: 'tour', path: '/tour' },
    { label: 'Search', icon: 'search', path: '/advanced-search' },
    { label: 'Help Center', icon: 'help_center', path: '/help' },
    { label: 'Vibe Check', icon: 'psychology', path: '/vibe' },
  ]
}
```

#### **Acceptance Criteria:**
- [ ] Mobile top bar shows ≤3 icons
- [ ] All icons have ≥44px tap targets
- [ ] Desktop shows all 7 icons
- [ ] No layout shift between mobile/desktop
- [ ] Icons remain functional

---

## 🧪 **TESTING CHECKLIST**

### **After Each Task:**
1. **Visual Test:**
   - [ ] Open browser DevTools
   - [ ] Set viewport to 375px × 667px (iPhone SE)
   - [ ] Navigate to affected pages
   - [ ] Verify no horizontal scroll
   - [ ] Check all interactive elements work

2. **Device Test (if possible):**
   - [ ] Test on real iPhone SE or Android (360px)
   - [ ] Verify touch targets are easy to tap
   - [ ] Check scrolling is smooth

3. **Lighthouse Test:**
   - [ ] Run Lighthouse mobile audit
   - [ ] Target score: >90
   - [ ] Fix any accessibility issues

### **Final QA (All Tasks Complete):**
- [ ] Test all 14 pages on 375px viewport
- [ ] No horizontal scroll on any page
- [ ] All forms submit successfully
- [ ] Sidebar works on all pages
- [ ] Desktop layout unaffected
- [ ] No console errors

---

## 📊 **BEFORE/AFTER METRICS**

### **Before Fixes:**
- ❌ 4 pages with major issues (28%)
- ⚠️ 7 pages with minor issues (50%)
- ✅ 3 pages working well (21%)
- Lighthouse mobile: ~70

### **Target After Fixes:**
- ❌ 0 pages with major issues (0%)
- ⚠️ 2 pages with minor issues (14%)
- ✅ 12 pages working well (86%)
- Lighthouse mobile: >90

---

## 🚨 **COMMON PITFALLS TO AVOID**

### **1. Using `!important` Unnecessarily**
❌ **BAD:**
```css
.my-input {
  width: 100% !important;
  max-width: 100% !important;
}
```

✅ **GOOD:**
```css
/* Only use !important for global overrides */
@media (max-width: 768px) {
  input[type="text"] {
    max-width: 100% !important; /* OK - overriding inline styles */
  }
}
```

### **2. Breaking Desktop Layout**
❌ **BAD:**
```tsx
<div className="w-full"> {/* Always full width */}
```

✅ **GOOD:**
```tsx
<div className="w-full md:w-64"> {/* Full on mobile, fixed on desktop */}
```

### **3. Forgetting Touch Targets**
❌ **BAD:**
```tsx
<button className="p-1"> {/* Too small */}
```

✅ **GOOD:**
```tsx
<button className="p-2 min-h-[44px] min-w-[44px]"> {/* 44px minimum */}
```

---

## 📁 **FILES TO EDIT (Summary)**

1. ✅ `src/index.css` - Global input constraints
2. ✅ `src/components/ProtocolBuilder.tsx` - Form layout
3. ✅ `src/components/Header.tsx` - Top bar simplification
4. ⚠️ `src/components/Sidebar.tsx` - Optional: Add quick actions

---

## 🎯 **ACCEPTANCE CRITERIA (FINAL)**

### **Must Have:**
- [ ] All 3 tasks completed
- [ ] No horizontal scroll on any page (375px)
- [ ] All inputs fit within viewport
- [ ] Protocol Builder form works on mobile
- [ ] Top bar shows ≤3 icons on mobile
- [ ] No regressions on desktop
- [ ] All tests passing

### **Nice to Have:**
- [ ] Lighthouse mobile score >95
- [ ] Smooth animations on mobile
- [ ] Quick actions in mobile sidebar

### **Stop Conditions:**
- [ ] If desktop layout breaks, revert and reassess
- [ ] If any forms stop working, fix immediately
- [ ] If performance degrades, optimize

---

## 📝 **IMPLEMENTATION ORDER**

**Recommended sequence:**

1. **Start with Task 1** (Global Input Overflows)
   - Easiest, highest impact
   - Fixes 4 pages immediately
   - Low risk of breaking things

2. **Then Task 3** (Top Bar)
   - Medium difficulty
   - Improves overall mobile UX
   - Independent of other tasks

3. **Finally Task 2** (Protocol Builder)
   - Most complex
   - Requires careful testing
   - Benefits from Tasks 1 & 3 being done

---

## 🔍 **VERIFICATION STEPS**

### **After Task 1:**
```bash
# Open browser
# Set viewport to 375px
# Test these pages:
- http://localhost:3000/#/help
- http://localhost:3000/#/clinicians
- http://localhost:3000/#/interactions
- http://localhost:3000/#/advanced-search

# Verify:
- No horizontal scroll
- Search inputs fit in viewport
- Can type and submit
```

### **After Task 2:**
```bash
# Test Protocol Builder
- http://localhost:3000/#/builder

# Verify:
- All form fields visible
- ButtonGroups stack vertically
- Can fill out and submit form
- Accordions work
```

### **After Task 3:**
```bash
# Test top bar on all pages
# Verify:
- Mobile shows 3 icons
- Desktop shows 7 icons
- All icons functional
- No layout shift
```

---

## 💬 **QUESTIONS FOR BUILDER**

Before starting, confirm:

1. **Do you have access to ButtonGroup component?**
   - Location: `src/components/ButtonGroup.tsx`
   - If not, let DESIGNER know

2. **What is the Header component file name?**
   - Need to know exact file to edit for Task 3

3. **Are there any existing mobile breakpoints?**
   - Check if `md:`, `lg:` breakpoints are already in use

4. **Estimated time to complete all 3 tasks?**
   - DESIGNER estimate: 7 hours
   - Your estimate: _____

---

**Task Created:** 2026-02-12 06:14 PST  
**Owner:** BUILDER  
**Reviewer:** DESIGNER (will verify after completion)  
**Deadline:** End of week (2026-02-14)  
**Priority:** 🔴 CRITICAL - Blocks mobile launch
