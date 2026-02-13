# 🎯 UX/UI Critical Fixes Plan - Data Export & Dashboard Overhaul

**Date:** 2026-02-12  
**Assigned To:** DESIGNER Agent  
**Priority:** P0 - Critical UX Issues  
**Estimated Time:** 6-8 hours

---

## 📋 ISSUE SUMMARY

You've identified 9 critical UX issues that need immediate attention:

1. **Dropdown Alphabetical Ordering** - All dropdowns should be alphabetically sorted unless there's a specific reason not to
2. **Button vs Dropdown Strategy** - Some ButtonGroups may need to convert to dropdowns if reference tables expand
3. **Data Export Date Inputs** - Currently using `type="date"` (number inputs visible), need structured date picker
4. **Zero Padding Issue** - Something visible in your screenshot needs fixing (need clarification)
5. **Hide Protocol ROI** - Remove from sidebar's Intelligence section
6. **Full-Width Buttons** - 3 buttons wasting space, should be 1/3 width horizontal layout  
7. **Broken Sidebar Navigation** - All links pointing to dashboard instead of their routes
8. **GuidedTour.tsx Rebuild** - Needs enhancement plan for DESIGNER
9. **Mystery "VA" Button** - In TopHeader, labeled "Vibe", routes to `/vibe-check` (Physics Demo page)

---

## 🔍 INVESTIGATION FINDINGS

### Issue 1: Dropdown Ordering
**Files to Check:**
- `src/pages/ProtocolBuilder.tsx` - All dropdowns
- `src/pages/DataExport.tsx` - Substance dropdown
- `src/pages/InteractionChecker.tsx` - Substance selectors
- `src/hooks/useReferenceData.ts` - Reference data fetching

**Current State:** Dropdowns are not alphabetically sorted  
**Action:** Add `.sort((a, b) => a.name.localeCompare(b.name))` to all reference data fetches

---

### Issue 2: ButtonGroup → Dropdown Migration Analysis
**Current ButtonGroups in ProtocolBuilder.tsx:**
1. **Sex/Gender** (2 options: Male, Female) → **KEEP as ButtonGroup** ✅
2. **Smoking Status** (3 options: Current, Former, Never) → **KEEP as ButtonGroup** ✅
3. **Route of Administration** (ref_routes table) → **⚠️ FLAG FOR REVIEW** - Could expand
4. **Session Number** (1-10+) → **⚠️ CONSIDER DROPDOWN** - Better UX for 10+ options
5. **Safety Event Type** (ref_safety_events) → **⚠️ FLAG FOR REVIEW** - Could expand

**Recommendation:**
- Routes: Check `ref_routes` table size. If >6 options, convert to dropdown.
- Session Number: Convert to dropdown (cleaner for 10+ sessions).
- Safety Events: Check `ref_safety_events` table size.

---

### Issue 3: Data Export Date Inputs
**File:** `src/pages/DataExport.tsx` Lines 196-208

**Current Code:**
```tsx
<input
  type="date"
  value={config.dateStart}
  onChange={(e) => setConfig({ ...config, dateStart: e.target.value })}
  className="w-full bg-[#0a0c10] border border-slate-800 rounded-xl px-4 py-3..."
/>
```

**Problem:** Native date picker shows spinners/number inputs on some browsers

**Solution Options:**
1. **Custom Date Component** - Build masked input with format: `MM/DD/YYYY`
2. **Library** - Use `react-datepicker` (adds dependency)
3. **Format Helper** - Keep type="date" but add explicit placeholder and min/max

**Recommendation:** Create custom `DateInput.tsx` component with input masking (no library).

---

### Issue 4: Zero Padding
**Need Clarification:** Which element has zero padding? Screenshot shows:
- Data Export Manager date inputs
- Dashboard "Recommended Next Steps" buttons  
- Recent Safety Events section

**Assumption:** You want consistent padding on the Export Manager form?

---

### Issue 5: Hide Protocol ROI
**File:** `src/components/Sidebar.tsx` Line 73

**Current Code:**
```tsx
{ label: "Protocol ROI", icon: "savings", path: "/deep-dives/protocol-efficiency" }
```

**Action:** Comment out or remove this line  
**Impact:** Link removed from Intelligence section

---

### Issue 6: Full-Width Buttons → Horizontal 1/3 Width
**Likely Location:** Dashboard "Quick Actions" section (Lines 303-338)

**Current Code:**
```tsx
<div className="grid grid-cols-2 md:grid-cols-5 gap-4">
  <button className="flex flex-col items-center...">...</button>
  <button className="flex flex-col items-center...">...</button>
  ...
</div>
```

**Problem:** Not identified yet. Need screenshot or specific page reference.

**Assumption:** Some page has 3 full-width buttons stacked vertically that should be horizontal.

**Question:** Which page has the 3 full-width buttons? Dashboard? Data Export? Protocol Builder?

---

### Issue 7: Broken Sidebar Navigation
**File:** `src/components/Sidebar.tsx` Lines 224-254

**Current Code:**
```tsx
<NavLink
  to={item.path}
  onClick={() => {
    if (window.innerWidth < 1024) onClose();
  }}
  className={({ isActive }) => `group relative flex items-center...`}
>
```

**Diagnosis:** NavLink paths appear correct. Issue may be:
1. **React Router issue** - HashRouter vs BrowserRouter mismatch
2. **onClick interference** - Event preventing navigation
3. **isActive logic** - Always returning true for dashboard

**Action:** Debug `NavLink` behavior and check if `HashRouter` is interfering.

---

### Issue 8: GuidedTour.tsx Enhancement
**File:** `src/components/GuidedTour.tsx` (205 lines)

**Current State:** Basic 5-step tour with:
- Live Telemetry
- Command Center (Sidebar)
- Global Registry
- Safety Signals (Notifications)
- Clinical Support (Help)

**Enhancement Ideas:**
1. **More Interactive** - Hover effects, click-to-proceed
2. **User Preferences** - Skip tour option persisted to localStorage
3. **Contextual Tours** - Different tours for different pages (Protocol Builder, Analytics, etc.)
4. **Video Embeds** - Short tutorial videos in tour cards
5. **Progress Tracking** - Track which steps user has completed
6. **Better Positioning** - Smarter collision detection for small screens

**Recommendation:** Create full enhancement spec for DESIGNER with mockups.

---

### Issue 9: "VA" Button (Vibe Button)
**File:** `src/components/TopHeader.tsx` Lines 200-208

**Current Code:**
```tsx
<NavIconButton
  icon="science"
  label="Vibe"
  tooltip="Physics Demo"
  onClick={() => navigate('/vibe-check')}
/>
```

**Destination:** `/vibe-check` → `PhysicsDemo.tsx` → "Antigravity Physics Engine" page

**Options:**
1. **Remove Button** - Remove from TopHeader (clean up header)
2. **Move to Settings** - Add as easter egg in Settings page
3. **Rename** - Change label/tooltip to be clearer
4. **Keep Hidden** - Only show in development mode

**Question:** Do you want to **remove** this button entirely, or **move** it somewhere else?

---

## 🛠️ PROPOSED ACTIONS

### **Priority 1: Critical Fixes (Today)**
- [ ] **Fix Sidebar Navigation** - Debug NavLink routing (30 min)
- [ ] **Hide Protocol ROI** - Remove from sidebar (5 min)
- [ ] **Remove/Move Vibe Button** - Clean up TopHeader (10 min)

### **Priority 2: UX Improvements (Tomorrow)**
- [ ] **Data Export Date Inputs** - Create custom DateInput component (2 hours)
- [ ] **Alphabetize Dropdowns** - Sort all reference data (1 hour)
- [ ] **ButtonGroup Analysis** - Review ref tables, flag for user decision (30 min)

### **Priority 3: Designer Enhancement (This Week)**
- [ ] **GuidedTour Enhancement Plan** - Create spec doc for DESIGNER (3 hours)
- [ ] **Full-Width Buttons Fix** - Identify page and fix layout (30 min)
- [ ] **Zero Padding Fix** - Clarify and fix (30 min)

---

## ❓ QUESTIONS FOR USER

Before I proceed, I need clarification on:

1. **Zero Padding:** Which component/page has the zero padding issue? (Screenshot reference?)
2. **Full-Width Buttons:** Which page has the 3 full-width buttons that should be horizontal?
3. **Vibe Button:** Remove entirely, or move to Settings/Help page?
4. **ButtonGroup Migration:** Should I auto-convert if ref table >5 items, or flag each case for you?

---

## 🎨 DESIGNER HANDOFF (Separate Task)

I will create a **separate task file** for DESIGNER:
- **GuidedTour Enhancement Spec**
- **Mockups for improved tour UX**
- **Mobile-responsive tour positioning**
- **Contextual tour system architecture**

---

**Ready to Execute:** Waiting for user clarification on questions 1-4 above.

