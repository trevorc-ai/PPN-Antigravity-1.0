# Designer: Search Portal UX Improvements

**Status:** In Progress  
**Priority:** P1 - Critical UX Issues  
**Estimated Time:** 2 hours remaining

---

## 🎯 Issues Identified

### ✅ **COMPLETED: Typography Cleanup**
- **Problem**: Excessive ALL CAPS text ruins readability
- **Solution**: Removed `uppercase` class from 30+ instances
- **Impact**: Much more readable, professional appearance

**Changed Elements:**
- Section headers (Matched Substances, Patient Registry, etc.)
- Button labels (View All, Reset, etc.)
- Filter labels and options
- Card subtitles and metadata
- Empty state messages

---

## 🚧 **IN PROGRESS: Floating Molecules**

### Current Problem:
Molecules appear in "boxes within boxes":
1. **Outer box**: Section containers with borders (`border-b border-white/5`)
2. **Inner boxes**: Cards with heavy backgrounds (`bg-slate-900/40`)
3. **Result**: Claustrophobic, boxy appearance

### Target Design:
Molecules should **float freely** on the page:
- No visible section containers
- Lighter card backgrounds (or transparent with just borders)
- Single horizontal slider for all molecule types
- Seamless, airy layout

---

## 📋 **NEXT STEPS**

### 1. Remove Section Container Styling (15 min)
**File:** `SearchPortal.tsx` lines 686-745

**Current:**
```tsx
<div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
  <SectionHeader
    title="Matched Substances"
    icon="biotech"
    count={substanceResults.length}
    onSeeAll={() => handleCategoryChange('Substances')}
  />
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {/* Cards */}
  </div>
</div>
```

**Target:**
- Remove `SectionHeader` component (or make it invisible/floating)
- Remove section dividers
- Consolidate all three sections (Substances, Patients, Clinicians) into ONE container

### 2. Lighten Card Backgrounds (10 min)
**Current:** `bg-slate-900/40`  
**Options:**
- **A**: `bg-transparent` (just borders and shadows)
- **B**: `bg-slate-950/20` (very subtle)
- **C**: `bg-gradient-to-br from-slate-900/20 to-transparent` (modern gradient)

### 3. Implement Horizontal Slider (45 min)
**Goal:** All molecules in ONE scrollable container

**Layout:**
```
[← Scroll →]
┌─────────┬─────────┬─────────┬─────────┬─────────┐
│ Ketamine│  MDMA   │Psilocybin│ Patient │Clinician│
│ (Sub)   │ (Sub)   │  (Sub)   │  (Pat)  │  (Clin) │
└─────────┴─────────┴─────────┴─────────┴─────────┘
```

**Implementation:**
- Single `<div className="flex gap-4 overflow-x-auto snap-x">` container
- Mix all result types (substances, patients, clinicians)
- Add scroll snap for smooth navigation
- Add subtle scroll indicators

### 4. Protocol Modal Width Fix (5 min)
**Current:** `max-w-5xl` (1280px) - too wide, 1/4 empty  
**Fix:** Change to `max-w-4xl` (896px)

**File:** `ProtocolBuilder.tsx` line 1036

---

## 🎨 **Design Principles**

1. **Floating, Not Boxed**: Elements should feel weightless
2. **Readable, Not Shouty**: Sentence case > ALL CAPS
3. **Unified, Not Fragmented**: One container > multiple sections
4. **Scannable, Not Dense**: Whitespace is good

---

## ⏱️ **Time Estimate**

| Task | Time | Status |
|------|------|--------|
| Typography cleanup | 30 min | ✅ Done |
| Remove section styling | 15 min | ⏳ Next |
| Lighten card backgrounds | 10 min | ⏳ Pending |
| Implement slider | 45 min | ⏳ Pending |
| Protocol modal width | 5 min | ⏳ Pending |
| **Total** | **1h 45min** | **30% Complete** |

---

## 🔍 **Testing Checklist**

After implementation:
- [ ] No ALL CAPS text visible (except intentional badges)
- [ ] Molecules appear to float (no heavy boxes)
- [ ] Horizontal scroll works smoothly
- [ ] All three types (substances, patients, clinicians) in one view
- [ ] Protocol modal fits content without empty space
- [ ] Mobile responsive (cards stack or scroll)

---

**Last Updated:** 2026-02-12 03:20 PST  
**Next Action:** Remove section container styling and consolidate into slider
