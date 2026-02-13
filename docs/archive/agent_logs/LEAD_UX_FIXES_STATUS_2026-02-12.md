# 🎯 LEAD: UX Critical Fixes - Status Report

**Date:** 2026-02-12 09:22 PST  
**Agent:** @LEAD  
**Status:** IN PROGRESS

---

## ✅ COMPLETED (Immediate Fixes)

### 1. **Protocol ROI Removed from Sidebar** ✅
- **File:** `src/components/Sidebar.tsx` Line 73
- **Action:** Commented out "Protocol ROI" link
- **Result:** Intelligence section now shows 4 items instead of 5

### 2. **"VA" (Vibe) Button Removed from TopHeader** ✅
- **File:** `src/components/TopHeader.tsx` Lines 200-208
- **Action:** Commented out Physics Demo button
- **Result:** TopHeader cleaned up, mystery button removed

---

## 🔍 INVESTIGATION REQUIRED

### 3. **Sidebar Navigation Broken**
**Issue:** "All sidebar links now seem to be pointing to the dashboard"

**Investigation:**
- Sidebar uses `<NavLink to={item.path}>` with correct paths
- Routes defined in `App.tsx` appear correct
- **Possible Causes:**
  1. Dashboard is default route catching all navigation
  2. NavLink `isActive` always returning true for dashboard
  3. Something in `App.tsx` routing intercepting navigation

**Next Step:** Need to test actual navigation behavior. The code looks correct.

**Question for User:** Are the links visually highlighted as if you're on Dashboard, or are they actually navigating to Dashboard when clicked?

---

### 4. **Dropdown Alphabetical Ordering**
**Scope:** All dropdowns across the app

**Files to Update:**
- `src/hooks/useReferenceData.ts` - Core data fetching hook
- `src/pages/ProtocolBuilder.tsx` - Substance, Indication, Route dropdowns
- `src/pages/DataExport.tsx` - Substance dropdown
- `src/pages/InteractionChecker.tsx` - Substance selectors

**Action Plan:**
```tsx
// Add .sort() to all reference data:
substances.sort((a, b) => a.substance_name.localeCompare(b.substance_name))
indications.sort((a, b) => a.indication_name.localeCompare(b.indication_name))
routes.sort((a, b) => a.route_name.localeCompare(b.route_name))
```

---

### 5. **ButtonGroup → Dropdown Strategy**
**Current ButtonGroups in Protocol Builder:**

| Field | Options | Recommendation |
|-------|---------|----------------|
| Sex/Gender | 2 (M/F) | ✅ KEEP ButtonGroup |
| Smoking Status | 3 (Current/Former/Never) | ✅ KEEP ButtonGroup |
| Route of Admin | ref_routes (unknown count) | ⚠️ **FLAG - Need table size** |
| Session Number | 1-10+ | ⚠️ **CONSIDER DROPDOWN** |
| Safety Event Type | ref_safety_events | ⚠️ **FLAG - Need table size** |

**Question for User:** Should I:
- **Option A:** Auto-convert ButtonGroups to dropdowns if ref table has >5 items
- **Option B:** Flag each case and get your approval first
- **Option C:** Set a different threshold (e.g., >7 items)

---

### 6. **Data Export Date Inputs**
**Issue:** Date inputs showing number spinners instead of clean date picker

**Current:** `<input type="date">` (native browser control)

**Solution:** Create custom `DateInput.tsx` component with:
- Format: `MM/DD/YYYY`
- Input masking (auto-insert slashes)
- Validation (prevent invalid dates)
- Clean styling to match app design

**Estimated Time:** 2 hours

---

### 7. **Zero Padding Issue**
**Need Clarification:** Which component has zero/incorrect padding?

**Possible Candidates from Screenshots:**
- Data Export form date fields
- Dashboard "Recommended Next Steps" section
- Recent Safety Events section

**Question:** Can you point me to the specific element?

---

### 8. **Full-Width Buttons → Horizontal Layout**
**Need Clarification:** "There are three buttons that are full width, which is a huge waste of space."

**Possible Locations:**
- Dashboard "Quick Actions" (currently 2x5 grid on desktop)
- Data Export page
- Protocol Builder page

**Question:** Which page has these 3 full-width buttons?

---

### 9. **GuidedTour.tsx Rebuild Plan**
**Status:** Ready to create enhancement spec for DESIGNER

**Proposed Enhancements:**
1. **More Tour Steps** - Cover Protocol Builder, Analytics, Data Export
2. **Skip/Complete Tracking** - Store in localStorage
3. **Contextual Tours** - Different tours per page
4. **Better Mobile Support** - Smarter positioning
5. **Interactive Elements** - Click-to-proceed, highlight interactions
6. **Video Integration** - Embed tutorial videos (optional)

**Next Step:** Create `DESIGNER_TASK_GUIDEDTOUR_ENHANCEMENT.md` with full spec

---

## ❓ QUESTIONS FOR USER (Priority Order)

1. **Sidebar Navigation:** Are links **visually highlighted** as Dashboard, or actually **navigating** to Dashboard?
2. **Full-Width Buttons:** Which page has the 3 buttons that need horizontal layout?
3. **Zero Padding:** Which element/component needs padding fixed?
4. **ButtonGroup Strategy:** Auto-convert if >5 items, or flag each case?

---

## 📋 NEXT STEPS (Pending Your Answers)

**Ready to Execute:**
- [ ] Fix sidebar navigation (once diagnosed)
- [ ] Alphabetize all dropdowns (1 hour)
- [ ] Create DateInput component (2 hours)
- [ ] Create DESIGNER GuidedTour spec (3 hours)

**Pending Clarification:**
- [ ] Fix zero padding issue
- [ ] Fix full-width buttons layout
- [ ] ButtonGroup migration decisions

---

**LEAD Status:** Awaiting user clarification on 4 questions above to proceed.

