---
id: WO-NEWS-LAYOUT
status: 05_USER_REVIEW
priority: P2 (High)
category: Design / UX Refinement
owner: DESIGNER
created_date: 2026-02-16
failure_count: 0
estimated_effort: MEDIUM
---

# News Page Layout Refinement

## 1. THE GOAL

Refine the News (Intelligence Hub) page layout to improve visual hierarchy, balance, and professional polish while maintaining all existing functionality.

### Core Objectives:

- **Improve Visual Hierarchy:** Reduce competition between Regulatory Mosaic and Feature Article
- **Enhance Spacing & Balance:** Create consistent, breathing room throughout the page
- **Refine Typography:** Tone down overly bold elements to match clinical aesthetic
- **Polish Sidebar:** Create cohesive visual rhythm in sidebar widgets
- **Maintain Functionality:** All interactive elements and data remain unchanged

---

## 2. DESIGN SPECIFICATIONS

### A. **Spacing & Layout Improvements**

#### **Header Section (Lines 148-153)**
**CURRENT ISSUE:** Tight spacing between "Intelligence Hub" title and Regulatory Mosaic

**REFINEMENT:**
```tsx
// Add breathing room with mb-10 instead of default spacing
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
  <h1 className="text-5xl font-black tracking-tighter text-slate-200">
    Intelligence Hub
  </h1>
  <ConnectFeedButton />
</div>
```

#### **Regulatory Mosaic Container (Lines 156-162)**
**CURRENT ISSUE:** Mosaic sits too close to content below

**REFINEMENT:**
```tsx
// Increase bottom margin from mb-10 to mb-14 for better separation
<div className="mb-14">
  <RegulatoryMosaic
    onStateSelect={handleStateSelect}
    externalSelectedState={selectedStateFilter}
    showDetailPanel={false}
  />
</div>
```

---

### B. **Typography Refinements**

#### **Trending Topics Hashtags (Lines 247-256)**
**CURRENT ISSUE:** Ultra-bold, all-caps styling is too loud for clinical aesthetic

**REFINEMENT:**
```tsx
// Soften typography: reduce font-black to font-bold, remove uppercase
{['#Psilocybin', '#MDMA-Research', '#Neuroscience', '#PhaseIII', '#ReformBill', '#Ligands'].map(tag => (
  <button
    key={tag}
    onClick={() => setSearchQuery(tag.replace('#', ''))}
    className="px-4 py-2 bg-[#1c222d] border border-slate-800 rounded-full text-xs font-bold text-slate-400 hover:text-slate-200 hover:border-primary/50 transition-all tracking-wide"
  >
    {tag}
  </button>
))}
```

**CHANGES:**
- `font-black` → `font-bold` (softer weight)
- `uppercase` → removed (sentence case)
- `tracking-widest` → `tracking-wide` (less aggressive letter spacing)

---

### C. **Sidebar Widget Spacing**

#### **Weekly Briefing Section (Lines 260-283)**
**CURRENT ISSUE:** Inconsistent padding creates visual imbalance

**REFINEMENT:**
```tsx
// Standardize padding to p-10 for consistency with Portal Metrics
<section className="bg-[#1c222d]/60 border border-slate-800 rounded-[2.5rem] p-10 space-y-6 relative overflow-hidden group shadow-2xl">
  {/* ... existing content ... */}
</section>
```

**CHANGE:** `p-8` → `p-10` (matches Portal Metrics section)

#### **Portal Metrics Section (Lines 286-312)**
**CURRENT ISSUE:** Different padding from other sidebar widgets

**REFINEMENT:**
```tsx
// Increase padding from p-8 to p-10 for visual consistency
<section className="bg-[#1c222d]/30 border border-slate-800 rounded-[2.5rem] p-10 space-y-8">
  {/* ... existing content ... */}
</section>
```

**CHANGE:** `p-8` → `p-10`

---

### D. **Filter Bar Refinement**

#### **Filter Bar Container (Lines 186-222)**
**CURRENT ISSUE:** Filter bar could use slightly more breathing room

**REFINEMENT:**
```tsx
// Add top margin for better separation from Feature Article
<div className="flex flex-col sm:flex-row items-center gap-4 bg-[#1c222d]/40 border border-slate-800 p-2 rounded-2xl backdrop-blur-md mt-8">
  {/* ... existing filter controls ... */}
</div>
```

**CHANGE:** Add `mt-8` for top margin

---

### E. **News Feed Section Spacing**

#### **News Feed Header (Lines 224-228)**
**CURRENT ISSUE:** "News Feed" header spacing could be improved

**REFINEMENT:**
```tsx
<div className="space-y-6 pt-6">
  <div className="flex items-center gap-3">
    <div className="w-1 h-6 bg-primary rounded-full"></div>
    <h2 className="text-2xl font-black text-slate-200 tracking-tighter">News Feed</h2>
  </div>
  {/* ... news cards grid ... */}
</div>
```

**CHANGE:** `pt-4` → `pt-6` (better separation from filter bar)

---

## 3. VISUAL COMPARISON

### **Before:**
- Tight spacing creates visual crowding
- Bold typography competes for attention
- Inconsistent sidebar widget padding
- Regulatory Mosaic feels cramped

### **After:**
- Generous breathing room throughout
- Softer typography maintains clinical professionalism
- Consistent sidebar rhythm (all p-10)
- Clear visual hierarchy: Header → Mosaic → Feature → Feed

---

## 4. ACCESSIBILITY COMPLIANCE

✅ **All refinements maintain WCAG 2.1 AA compliance:**
- Minimum 12px fonts preserved
- Color contrast ratios unchanged
- Dual-mode state indicators intact
- Keyboard navigation unaffected

---

## 5. IMPLEMENTATION CHECKLIST

### Phase 1: Spacing Refinements
- [ ] Add `mb-10` to header section
- [ ] Increase Regulatory Mosaic bottom margin to `mb-14`
- [ ] Add `mt-8` to filter bar
- [ ] Change News Feed `pt-4` to `pt-6`

### Phase 2: Typography Refinements
- [ ] Soften Trending Topics hashtags (font-bold, tracking-wide, no uppercase)

### Phase 3: Sidebar Consistency
- [ ] Standardize Weekly Briefing padding to `p-10`
- [ ] Standardize Portal Metrics padding to `p-10`

### Phase 4: Testing & Verification
- [ ] Visual review at 1920px, 1440px, 1024px, 768px viewports
- [ ] Verify spacing consistency across all sections
- [ ] Confirm sidebar widgets have uniform rhythm
- [ ] Test all interactive elements (filters, search, state selection)

---

## 6. DELIVERABLES

1. **Updated News.tsx** with all spacing and typography refinements
2. **Before/After Screenshots** showing layout improvements
3. **Responsive Testing Report** confirming refinements work across viewports

---

## 7. SUCCESS CRITERIA

- [ ] Visual hierarchy clearly guides eye from Header → Mosaic → Feature → Feed
- [ ] Consistent spacing creates professional, breathing layout
- [ ] Typography feels cohesive with Clinical Sci-Fi aesthetic
- [ ] Sidebar widgets have uniform visual rhythm
- [ ] All functionality preserved (filtering, search, state selection)
- [ ] Responsive design maintained across all viewports
- [ ] WCAG 2.1 AA compliance maintained
- [ ] No console errors or warnings

---

## 8. NOTES

**Design Philosophy:**
These refinements follow the principle of "less is more" — creating visual breathing room and toning down aggressive typography to let the content shine. The goal is a polished, professional layout that feels premium without being overwhelming.

**User Impact:**
Users will experience a more balanced, easier-to-scan page that maintains the Clinical Sci-Fi aesthetic while feeling more refined and professional.

---

## INSPECTOR APPROVED: ✅ PASSED

**QA Inspection Date:** 2026-02-16  
**Inspector:** INSPECTOR  
**Status:** APPROVED FOR USER REVIEW

### Verification Summary

All mandatory checks **PASSED**:

#### ✅ Accessibility Compliance (WCAG 2.1 AA)
- **Font Sizes:** All text elements ≥ 12px (site-wide scan confirmed)
- **Color Indicators:** Regulatory Mosaic uses dual-mode indicators (color + text labels)
- **Interactive Elements:** All buttons, links, and filters have proper hover states
- **Console Errors:** No functional errors detected

#### ✅ Implementation Verification
**Spacing Refinements:**
- Header to Mosaic: `mb-10` ✓ (Line 148)
- Regulatory Mosaic: `mb-14` ✓ (Line 156)
- Filter bar: `mt-8` ✓ (Line 186)
- News Feed: `pt-6` ✓ (Line 224)

**Typography Refinements:**
- Trending Topics: `font-bold` (not font-black) ✓ (Line 251)
- Letter spacing: `tracking-wide` (not tracking-widest) ✓ (Line 251)
- Case: Sentence case (no uppercase) ✓ (Line 251)

**Sidebar Consistency:**
- Weekly Briefing: `p-10` ✓ (Line 260)
- Portal Metrics: `p-10` ✓ (Line 286)

#### ✅ Functional Testing
- Search functionality: Working
- Filter buttons (Most Recent/Most Cited): Working
- Category filter: Working
- Trending hashtag clicks: Working
- Regulatory Mosaic state selection: Working
- Responsive layout: Adapts properly at all viewports

#### ✅ Security & Data Integrity
- No PHI/PII exposure
- No free-text logging (N/A for this feature)
- RLS policies not affected

### Failure Count: 0

**RECOMMENDATION:** Move to `05_USER_REVIEW` for final approval.

---

**Screenshots Captured:**
- `news_qa_top_1771275584813.png` - Header, Regulatory Mosaic, Trending Topics
- `news_qa_middle_1771275595849.png` - Feature Article, Filter Bar, News Feed
- `news_qa_sidebar_1771275621345.png` - Portal Metrics, Source Context
