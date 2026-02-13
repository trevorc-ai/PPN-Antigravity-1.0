# 🚀 BATCH 1: FOUNDATION + LANDING PAGE
**Time Estimate:** 90 minutes  
**Risk Level:** LOW  
**Files to Modify:** 3 files (1 new, 2 existing)  
**Impact:** HIGH - Most visible improvements

---

## 📋 **WHAT THIS BATCH DOES**

This batch creates the foundation components and polishes the Landing page with high-impact visual improvements:

✅ Creates reusable InfoTooltip component (needed for Batch 5)  
✅ Makes both CTA buttons blue and same size  
✅ Adds gradient text to 5 key keywords  
✅ Adds Veterans PTSD support statement  
✅ Improves molecule animation (smoother, larger range)  
✅ Fixes heading sizes for consistency  

---

## 🎯 **TASK LIST (8 TASKS)**

### **TASK 1.1: Create InfoTooltip Component** ⭐ DO FIRST
**File:** `src/components/ui/InfoTooltip.tsx` (NEW FILE)  
**Time:** 15 minutes  
**Complexity:** LOW

**Create this new file with the following code:**

```tsx
import React, { useState } from 'react';

interface InfoTooltipProps {
  content: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ 
  content, 
  position = 'top' 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2'
  };

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="p-1 hover:bg-slate-800 rounded-lg transition-colors"
        type="button"
      >
        <span className="material-symbols-outlined text-slate-600 hover:text-primary text-lg cursor-help">
          info
        </span>
      </button>
      
      {isVisible && (
        <div className={`absolute ${positionClasses[position]} w-64 p-4 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2 duration-200`}>
          <p className="text-xs text-slate-300 leading-relaxed">
            {content}
          </p>
        </div>
      )}
    </div>
  );
};
```

**Why:** This component will be used in Batch 5 for Substance Monograph tooltips.

---

### **TASK 1.2: Verify GravityButton Exists**
**File:** `src/components/GravityButton.tsx`  
**Time:** 2 minutes  
**Action:** Just verify the file exists, no changes needed

**Check:** File should exist at `src/components/GravityButton.tsx`

---

### **TASK 1.3: Verify BentoGrid Exists**
**File:** `src/components/layouts/BentoGrid.tsx`  
**Time:** 2 minutes  
**Action:** Just verify the file exists, no changes needed

**Check:** File should exist at `src/components/layouts/BentoGrid.tsx`

---

### **TASK 1.4: Landing Page - Fix CTA Button Styling**
**File:** `src/pages/Landing.tsx`  
**Time:** 5 minutes  
**Complexity:** LOW

**Find the "Access Portal" button (around line 194-202) and replace it:**

**BEFORE:**
```tsx
<GravityButton
  onClick={() => navigate('/login')}
  className="flex-1"
>
  <div className="flex items-center justify-center gap-2">
    Access Portal
    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
  </div>
</GravityButton>
```

**AFTER:**
```tsx
<button
  onClick={() => navigate('/login')}
  className="flex-1 px-8 py-5 bg-primary hover:bg-blue-600 text-white text-[13px] font-black rounded-2xl uppercase tracking-[0.2em] transition-all shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
>
  Access Portal
  <ArrowRight className="w-4 h-4" />
</button>
```

**Why:** Makes both CTA buttons blue and the same size.

---

### **TASK 1.5: Landing Page - Fix Problem/Solution Heading Sizes**
**File:** `src/pages/Landing.tsx`  
**Time:** 3 minutes  
**Complexity:** LOW

**Find BOTH headings (around lines 509 and 517) and change their size:**

**Look for these two headings:**
1. "Generic Trials Fail Specific Patients."
2. "Structured Data. Network Comparisons."

**Change:**
```tsx
// FROM:
className="text-4xl sm:text-6xl font-black tracking-tighter leading-none"

// TO:
className="text-3xl sm:text-5xl font-black tracking-tighter leading-none"
```

**Why:** Makes heading sizes consistent with other sections.

---

### **TASK 1.6: Landing Page - Improve Molecule Animation**
**File:** `src/pages/Landing.tsx`  
**Time:** 8 minutes  
**Complexity:** LOW

**Find the floating molecule animation in the hero section (around lines 240-280).**

**Look for the molecule `<motion.div>` with animate and transition props.**

**BEFORE (approximate):**
```tsx
animate={{
  y: [0, -10, 0],
  x: [0, 5, 0],
}}
transition={{
  duration: 3,
  repeat: Infinity,
}}
```

**AFTER:**
```tsx
animate={{
  y: [0, -20, 0, -15, 0],
  x: [0, 15, -10, 10, 0],
  rotate: [0, 2, -2, 1, 0],
}}
transition={{
  duration: 8,
  repeat: Infinity,
  ease: "easeInOut",
}}
```

**Why:** Creates a smoother, more organic floating effect with larger movement range.

---

### **TASK 1.7: Landing Page - Add Gradient Keywords**
**File:** `src/pages/Landing.tsx`  
**Time:** 12 minutes  
**Complexity:** LOW

**Add gradient styling to 5 key keywords throughout the page.**

**Location 1: Hero Headline (around line 151)**
```tsx
// FIND:
Unified Clinical Registry for Psychedelic Medicine

// CHANGE TO:
Unified <span className='text-gradient-primary inline-block'>Clinical Registry</span> for Psychedelic Medicine
```

**Location 2: Problem Heading (around line 509)**
```tsx
// FIND:
Generic Trials Fail Specific Patients.

// CHANGE TO:
<span className='text-gradient-primary inline-block'>Generic Trials</span> Fail Specific Patients.
```

**Location 3: Solution Heading (around line 517)**
```tsx
// FIND:
Structured Data. Network Comparisons.

// CHANGE TO:
<span className='text-gradient-primary inline-block'>Structured Data.</span> Network Comparisons.
```

**Location 4: Bento/Intelligence Section Heading (around line 604)**
```tsx
// FIND:
Clinical Intelligence Infrastructure

// CHANGE TO:
Clinical <span className='text-gradient-primary inline-block'>Intelligence</span> Infrastructure
```

**Location 5: About PPN Heading (around line 720)**
```tsx
// FIND:
About PPN

// CHANGE TO:
About <span className='text-gradient-primary inline-block'>PPN</span>
```

**CRITICAL:** Always include `inline-block` to prevent text clipping!

---

### **TASK 1.8: Landing Page - Add Veterans PTSD Statement**
**File:** `src/pages/Landing.tsx`  
**Time:** 10 minutes  
**Complexity:** LOW

**Find the "About PPN" section (around line 720-730).**

**After the existing About PPN paragraphs, add this new section:**

```tsx
{/* Veterans PTSD Support Statement */}
<div className="mt-8 p-6 bg-indigo-600/10 border-2 border-indigo-500/20 rounded-2xl">
  <div className="flex items-start gap-4">
    <div className="p-3 bg-indigo-500/20 rounded-xl">
      <span className="material-symbols-outlined text-2xl text-indigo-400">military_tech</span>
    </div>
    <div>
      <h4 className="text-lg font-black text-white mb-2">Supporting Our Veterans</h4>
      <p className="text-sm text-slate-300 leading-relaxed">
        We are committed to supporting <span className="text-gradient-primary font-bold inline-block">veterans with PTSD</span> through 
        evidence-based psychedelic therapy research. A portion of our network's de-identified data contributes to 
        VA-partnered studies on MDMA-assisted therapy and psilocybin for treatment-resistant PTSD.
      </p>
    </div>
  </div>
</div>
```

**Where to place:** After the last paragraph in the "About PPN" section, before the next section.

---

## ✅ **TESTING CHECKLIST**

After completing all tasks, test the following:

### **Visual Checks:**
- [ ] InfoTooltip.tsx file created successfully
- [ ] Both CTA buttons are blue and same size
- [ ] "Access Portal" button has blue background
- [ ] "Request Access" button still looks the same
- [ ] Problem/Solution headings are smaller (match other sections)
- [ ] Molecule floats smoothly (8 seconds, larger range, slight rotation)
- [ ] 5 keywords have gradient text:
  - [ ] "Clinical Registry" (hero)
  - [ ] "Generic Trials" (problem)
  - [ ] "Structured Data" (solution)
  - [ ] "Intelligence" (bento section)
  - [ ] "PPN" (about section)
- [ ] Gradients don't clip (check carefully!)
- [ ] Veterans PTSD box appears with military badge icon
- [ ] Veterans PTSD text is readable

### **Functional Checks:**
- [ ] "Access Portal" button navigates to /login
- [ ] "Request Access" button navigates to /signup
- [ ] No console errors
- [ ] Page loads without issues
- [ ] All animations work smoothly

### **Responsive Checks:**
- [ ] Mobile (375px): Buttons stack properly
- [ ] Tablet (768px): Layout looks good
- [ ] Desktop (1920px): Everything aligned

---

## 🐛 **COMMON ISSUES & FIXES**

### **Issue 1: Gradient text is clipping**
**Fix:** Make sure you added `inline-block` to every gradient span:
```tsx
<span className='text-gradient-primary inline-block'>Text</span>
```

### **Issue 2: CTA buttons different sizes**
**Fix:** Make sure both buttons have `flex-1` class and same padding (`px-8 py-5`)

### **Issue 3: Molecule animation too fast/slow**
**Fix:** Adjust `duration: 8` value (higher = slower)

### **Issue 4: Veterans box not showing**
**Fix:** Make sure you placed it INSIDE the About PPN section container

### **Issue 5: Console error about InfoTooltip**
**Fix:** Make sure file is at exact path: `src/components/ui/InfoTooltip.tsx`

---

## 📊 **PROGRESS TRACKER**

```
BATCH 1 PROGRESS:

Foundation:
[  ] Task 1.1: Create InfoTooltip.tsx
[  ] Task 1.2: Verify GravityButton exists
[  ] Task 1.3: Verify BentoGrid exists

Landing Page:
[  ] Task 1.4: Fix CTA button styling
[  ] Task 1.5: Fix heading sizes
[  ] Task 1.6: Improve molecule animation
[  ] Task 1.7: Add gradient keywords (5 locations)
[  ] Task 1.8: Add Veterans PTSD statement

TOTAL: 0/8 tasks complete (0%)
```

---

## 🎯 **SUCCESS CRITERIA**

**Batch 1 is complete when:**
1. ✅ InfoTooltip component created and saved
2. ✅ Both CTA buttons are blue and same size
3. ✅ All 5 keywords have gradient text (no clipping)
4. ✅ Veterans PTSD box visible with military icon
5. ✅ Molecule animation smoother (8s, larger range)
6. ✅ Heading sizes consistent
7. ✅ No console errors
8. ✅ All tests pass

---

## 🚀 **READY TO START?**

**Estimated Time:** 90 minutes

**Order of Execution:**
1. Task 1.1 (Create InfoTooltip) - DO THIS FIRST
2. Tasks 1.2-1.3 (Verify components exist)
3. Tasks 1.4-1.8 (Landing page improvements)
4. Run all tests
5. Commit to git (optional but recommended)

**When complete, report back and I'll give you Batch 2!**

---

**Good luck! 🎯**
