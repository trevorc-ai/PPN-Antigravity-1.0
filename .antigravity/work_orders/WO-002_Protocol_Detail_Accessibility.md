STATUS: DEFERRED

> **⚠️ DEFERRED:** DESIGNER is currently working on a complete Protocol Detail redesign (bento box layout, 8 components, Title Case typography). This work order should be executed AFTER the redesign is complete to avoid duplicate work.
> 
> **Related:** DESIGNER handoff in conversation `e5446f39-13de-4e35-853b-08b74d5de42d`

---

# Work Order: Protocol Detail Accessibility Fixes

**WO Number:** WO-002  
**Created:** 2026-02-13  
**Priority:** P0 (Critical - Accessibility)  
**Assigned To:** BUILDER  
**Estimated Time:** 2-3 hours  
**Related:** BUILDER_COMMAND_016 (Chart Improvements)

---

## 📋 Problem Statement

**Current State:** Protocol Detail page has critical accessibility violations that prevent users with color vision deficiency from using the page effectively.

**User Impact:** Users cannot distinguish protocol status, interpret difficulty scores, or understand chart data without color vision.

**Goal:** Fix all WCAG AA violations to ensure the page is accessible to all users.

---

## 🎯 Requirements

### 1. Fix Font Sizes (30 min)

**Issue:** Multiple text elements below 12px minimum

**Locations:**
- Line 164: `text-[11px]` (substance label)
- Line 174: `text-[11px]` (primary mechanism)
- Line 360: `text-[11px]` (chart caption)

**Fix:**
```tsx
// Change all instances of text-[11px] to text-xs (12px)
className="text-xs font-black..." // Instead of text-[11px]
```

### 2. Add Status Icons (45 min)

**Issue:** Status badge uses color-only differentiation (line 124-128)

**Current:**
```tsx
<span className={`${record.status === 'Active' ? 
  'bg-primary/20 text-primary' : 
  'bg-slate-800 text-slate-400'
}`}>
  {record.status}
</span>
```

**Fix:**
```tsx
<span className={`flex items-center gap-2 ${record.status === 'Active' ? 
  'bg-primary/20 text-primary border-primary/30' : 
  'bg-slate-800 text-slate-400 border-slate-700'
}`}>
  <span className="material-symbols-outlined text-sm">
    {record.status === 'Active' ? 'radio_button_checked' : 'radio_button_unchecked'}
  </span>
  {record.status}
</span>
```

### 3. Add Difficulty Slider Labels (30 min)

**Issue:** Difficulty slider uses color-only gradient (lines 305-316)

**Current:** Only color gradient (green → yellow → red)

**Fix:** Add text labels at key points
```tsx
<div className="relative">
  <div className="h-4 w-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-600">
    {/* Marker */}
  </div>
  
  {/* Add intermediate labels */}
  <div className="absolute top-6 left-0 right-0 flex justify-between text-[10px] text-slate-600">
    <span>0</span>
    <span>2.5</span>
    <span>5</span>
    <span>7.5</span>
    <span>10</span>
  </div>
</div>
```

### 4. Add ARIA Labels to Charts (30 min)

**Issue:** Charts have no screen reader support

**Fix:** Add descriptive ARIA labels to all chart containers

```tsx
// Receptor Affinity Radar (line 179)
<div 
  role="img" 
  aria-label="Radar chart showing receptor binding affinity for 6 targets: 5-HT2A, 5-HT2B, D2, Adrenergic, SERT, and NMDA. Compares target substance to serotonin baseline."
  className="..."
>
  <ResponsiveContainer>...</ResponsiveContainer>
</div>

// Efficacy Trajectory (line 325)
<div 
  role="img" 
  aria-label="Area chart showing PHQ-9 depression scores over time. Lower scores indicate improvement. Remission threshold is 5 points."
  className="..."
>
  <ResponsiveContainer>...</ResponsiveContainer>
</div>
```

### 5. Fix Color Contrast (15 min)

**Issue:** `text-slate-500` fails WCAG AA (line 130)

**Fix:** Use `text-slate-400` or lighter for better contrast

```tsx
// Change
<p className="text-slate-500 text-sm">...</p>

// To
<p className="text-slate-400 text-sm">...</p>
```

---

## ✅ Success Criteria

- ✅ All text is ≥12px
- ✅ Status uses icon + text (not color-only)
- ✅ Difficulty slider has numeric labels
- ✅ All charts have ARIA labels
- ✅ All text meets WCAG AA contrast (4.5:1)

---

## 📝 Testing Checklist

- [ ] View page with grayscale filter (simulate CVD)
- [ ] Verify all status badges show icons
- [ ] Check difficulty slider has visible labels
- [ ] Use screen reader to verify chart descriptions
- [ ] Run axe DevTools accessibility audit

---

## 📊 Files to Modify

- `src/pages/ProtocolDetail.tsx` (lines 124-128, 164, 174, 305-316, 325, 360)

---

## 🚀 Implementation Notes

**Order:**
1. Font sizes (global find/replace)
2. Status icons (single component)
3. Difficulty labels (add div)
4. ARIA labels (wrap charts)
5. Contrast fixes (color adjustments)

**Testing:** After each change, verify with grayscale filter

---

## 📋 Change Log

| Date | Agent | Action | Status Change |
|------|-------|--------|---------------|
| 2026-02-13 | LEAD | Created work order | → BUILDER_READY |
| | | | |
