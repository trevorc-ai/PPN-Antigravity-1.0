# 🚀 BATCH 2: SEARCH PORTAL + DASHBOARD
**Time Estimate:** 30 minutes  
**Risk Level:** LOW  
**Files to Modify:** 2 files  
**Impact:** MEDIUM - Functional improvements

---

## 📋 **WHAT THIS BATCH DOES**

This batch improves the Search Portal and Dashboard with functional and visual enhancements:

✅ Fixes search box input (text visible, AI icon visible)  
✅ Improves portal layout spacing (filters closer to results)  
✅ Adds black backgrounds to molecule images  
✅ Improves Dashboard card spacing  

---

## 🎯 **TASK LIST (4 TASKS)**

### **TASK 2.1: Search Portal - Fix Search Box Input**
**File:** `src/pages/SearchPortal.tsx`  
**Time:** 12 minutes  
**Complexity:** MEDIUM

**Find the search input section (around lines 200-250, look for the search input field).**

**Replace the entire search input section with:**

```tsx
<div className="relative w-full">
  {/* AI Sparkle Icon (LEFT side) */}
  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
    <span className="material-symbols-outlined text-primary text-xl">auto_awesome</span>
  </div>

  {/* Search Input */}
  <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Search protocols, adverse events, Ketamine + Neural Cognition..."
    className="
      w-full pl-12 pr-14 py-4
      bg-slate-900/50 border-2 border-slate-700 rounded-2xl
      text-white placeholder-slate-500
      focus:outline-none focus:border-primary/50 focus:bg-slate-900/70
      transition-all duration-300
    "
  />

  {/* Search Button (RIGHT side) */}
  <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary rounded-xl hover:bg-blue-600 transition-colors">
    <span className="material-symbols-outlined text-white">search</span>
  </button>
</div>
```

**Why:** 
- AI sparkle icon now visible on left
- Typed text no longer hidden by placeholder
- Subtle focus effect (border only, not whole box)
- Search button on right side

---

### **TASK 2.2: Search Portal - Improve Layout Spacing**
**File:** `src/pages/SearchPortal.tsx`  
**Time:** 5 minutes  
**Complexity:** LOW

**Find the main layout grid (look for the grid that contains filters and results).**

**BEFORE:**
```tsx
<div className="grid grid-cols-[250px_1fr] gap-6">
  <aside>
    {/* Filters */}
  </aside>
  <main>
    {/* Results */}
  </main>
</div>
```

**AFTER:**
```tsx
<div className="grid grid-cols-[280px_1fr] gap-12 max-w-[1600px] mx-auto px-6">
  <aside className="sticky top-24 h-fit">
    {/* Filters */}
  </aside>
  <main>
    {/* Results */}
  </main>
</div>
```

**Changes:**
- Sidebar width: `250px` → `280px` (wider)
- Gap: `gap-6` → `gap-12` (more space between filters and results)
- Add `max-w-[1600px] mx-auto px-6` (prevent over-stretching on ultra-wide)
- Add `sticky top-24 h-fit` to sidebar (filters stay visible on scroll)

---

### **TASK 2.3: Search Portal - Black Molecule Backgrounds**
**File:** `src/pages/SearchPortal.tsx`  
**Time:** 5 minutes  
**Complexity:** LOW

**Find molecule image containers in the substance cards.**

**Look for image tags like:**
```tsx
<img src={`/molecules/${substance}.png`} className="..." />
```

**Wrap each molecule image with a black circular background:**

**BEFORE:**
```tsx
<img src={`/molecules/${substance}.png`} className="w-full h-full object-contain" />
```

**AFTER:**
```tsx
<div className="w-full h-full bg-black/80 rounded-full p-4 flex items-center justify-center">
  <img src={`/molecules/${substance}.png`} className="w-full h-full object-contain" />
</div>
```

**Why:** Consistent with Substances page styling.

**Note:** You may need to do this in multiple places (search results, featured substances, etc.)

---

### **TASK 2.4: Dashboard - Improve Card Spacing**
**File:** `src/pages/Dashboard.tsx`  
**Time:** 3 minutes  
**Complexity:** LOW

**Find the Deep Dive Launchpad grid (around line 95).**

**BEFORE:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* InsightCards */}
</div>
```

**AFTER:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1800px] mx-auto">
  {/* InsightCards */}
</div>
```

**Changes:**
- Gap: `gap-6` → `gap-8` (more breathing room)
- Add `max-w-[1800px] mx-auto` (prevent over-stretching)

---

## ✅ **TESTING CHECKLIST**

After completing all tasks, test the following:

### **Search Portal Checks:**
- [ ] AI sparkle icon visible on LEFT side of search box
- [ ] Can type in search box (text is visible, not hidden)
- [ ] Focus border is subtle (primary/50, not full glow)
- [ ] Search button visible on RIGHT side
- [ ] Search button works (triggers search)
- [ ] Filters are wider (280px instead of 250px)
- [ ] Gap between filters and results is larger (gap-12)
- [ ] Filters stick to top when scrolling
- [ ] Content doesn't over-stretch on ultra-wide monitors
- [ ] Molecule images have black circular backgrounds

### **Dashboard Checks:**
- [ ] Cards have more spacing between them (gap-8)
- [ ] Cards don't over-stretch on ultra-wide monitors
- [ ] Grid still responsive (1 col mobile, 2 col tablet, 3 col desktop)

### **Functional Checks:**
- [ ] Search functionality still works
- [ ] Filter functionality still works
- [ ] Dashboard cards still clickable
- [ ] No console errors

### **Responsive Checks:**
- [ ] Mobile (375px): Layout stacks properly
- [ ] Tablet (768px): 2-column grid works
- [ ] Desktop (1920px): 3-column grid works
- [ ] Ultra-wide (2560px): Max-width prevents over-stretching

---

## 🐛 **COMMON ISSUES & FIXES**

### **Issue 1: AI icon not visible**
**Fix:** Make sure the icon div has `z-10` and is positioned absolutely with `left-4`

### **Issue 2: Typed text still hidden**
**Fix:** Make sure input has `text-white` class and `pl-12` for left padding

### **Issue 3: Search button overlaps text**
**Fix:** Make sure input has `pr-14` for right padding

### **Issue 4: Filters not sticky**
**Fix:** Make sure sidebar has `sticky top-24 h-fit` classes

### **Issue 5: Molecule backgrounds not showing**
**Fix:** Make sure you wrapped the `<img>` tag, not replaced it

---

## 📊 **PROGRESS TRACKER**

```
BATCH 2 PROGRESS:

Search Portal:
[  ] Task 2.1: Fix search box input
[  ] Task 2.2: Improve layout spacing
[  ] Task 2.3: Black molecule backgrounds

Dashboard:
[  ] Task 2.4: Improve card spacing

TOTAL: 0/4 tasks complete (0%)
```

---

## 🎯 **SUCCESS CRITERIA**

**Batch 2 is complete when:**
1. ✅ Search box shows AI icon on left
2. ✅ Typed text is visible (not hidden)
3. ✅ Focus effect is subtle
4. ✅ Filters closer to results (gap-12)
5. ✅ Filters sticky on scroll
6. ✅ Molecules have black backgrounds
7. ✅ Dashboard cards have more spacing
8. ✅ No console errors
9. ✅ All tests pass

---

**Estimated Time:** 30 minutes  
**When complete, move to Batch 3!**
