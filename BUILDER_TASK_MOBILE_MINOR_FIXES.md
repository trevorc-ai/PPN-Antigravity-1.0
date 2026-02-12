# 🔧 BUILDER TASK: Mobile Minor Fixes (Phase 2)

**From:** DESIGNER  
**To:** BUILDER  
**Date:** 2026-02-12 06:29 PST  
**Priority:** 🟡 MEDIUM  
**Estimated Time:** 3 hours  
**Type:** Enhancement - Mobile Polish

---

## 🎯 **OBJECTIVE**

Fix 7 minor mobile UX issues to achieve 86% of pages working perfectly on mobile.

**Success Criteria:**
- [ ] Tables scroll in containers (not page-level)
- [ ] SMILES strings wrap properly
- [ ] Charts fit within viewport
- [ ] No minor layout issues on any page
- [ ] Lighthouse mobile score >95

---

## 📋 **TASK BREAKDOWN**

### **TASK 4: Fix Table Scroll Containers** 🟡
**Priority:** MEDIUM  
**Time:** 1 hour  
**Complexity:** 3/10 (Simple wrapper addition)

#### **Problem:**
Data tables on Safety Surveillance page trigger page-level horizontal scroll instead of scrolling within a container.

#### **Affected Pages:**
- Safety Surveillance
- Any page with data tables

#### **Solution:**
Wrap all tables in `overflow-x-auto` containers.

#### **Files to Edit:**
1. `src/pages/SafetySurveillance.tsx` (or equivalent)
2. Any other pages with tables

#### **Implementation:**

**Step 1:** Find all `<table>` elements

**Step 2:** Wrap each table in a scroll container

**BEFORE:**
```tsx
<table className="min-w-full">
  <thead>
    <tr>
      <th>Event ID</th>
      <th>Severity</th>
      <th>Description</th>
      <th>Resolution</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {/* Table rows */}
  </tbody>
</table>
```

**AFTER:**
```tsx
<div className="overflow-x-auto max-w-full -mx-4 px-4 md:mx-0 md:px-0">
  <table className="min-w-full">
    <thead>
      <tr>
        <th className="px-4 py-3 text-left text-sm font-bold">Event ID</th>
        <th className="px-4 py-3 text-left text-sm font-bold">Severity</th>
        <th className="px-4 py-3 text-left text-sm font-bold">Description</th>
        <th className="px-4 py-3 text-left text-sm font-bold">Resolution</th>
        <th className="px-4 py-3 text-left text-sm font-bold">Actions</th>
      </tr>
    </thead>
    <tbody>
      {/* Table rows */}
    </tbody>
  </table>
</div>
```

**Key CSS Classes:**
- `overflow-x-auto` - Enables horizontal scroll within container
- `max-w-full` - Prevents container from exceeding viewport
- `-mx-4 px-4` - Negative margin + padding for edge-to-edge scroll on mobile
- `md:mx-0 md:px-0` - Remove on desktop

**Step 3:** Add scroll indicator (optional but recommended)

```tsx
<div className="relative">
  <div className="overflow-x-auto max-w-full -mx-4 px-4 md:mx-0 md:px-0 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
    <table className="min-w-full">
      {/* Table content */}
    </table>
  </div>
  {/* Scroll hint for mobile */}
  <div className="md:hidden text-center text-xs text-slate-500 mt-2">
    ← Scroll to see more →
  </div>
</div>
```

**Step 4:** Add custom scrollbar styles to `src/index.css`

```css
/* Custom scrollbar for tables */
.scrollbar-thin {
  scrollbar-width: thin;
}

.scrollbar-thumb-slate-700::-webkit-scrollbar-thumb {
  background-color: #334155;
  border-radius: 4px;
}

.scrollbar-track-slate-900::-webkit-scrollbar-track {
  background-color: #0f172a;
}

.scrollbar-thin::-webkit-scrollbar {
  height: 6px;
}
```

#### **Acceptance Criteria:**
- [ ] Tables scroll horizontally within container
- [ ] Page does not scroll horizontally
- [ ] Scroll indicator visible on mobile
- [ ] Desktop layout unaffected
- [ ] Smooth scrolling experience

---

### **TASK 5: Fix Text Wrapping (SMILES Strings)** 🟡
**Priority:** MEDIUM  
**Time:** 1 hour  
**Complexity:** 2/10 (CSS only)

#### **Problem:**
Long SMILES strings on Molecular DB page overflow viewport without wrapping.

**Example:**
```
CN(C)CCc1c[nH]c2ccc(OP(=O)(O)O)cc12
```

#### **Affected Pages:**
- Molecular DB (Molecular Pharmacology)
- Any page displaying chemical formulas or long strings

#### **Solution:**
Add word-break CSS to allow wrapping of long strings.

#### **Files to Edit:**
1. `src/pages/MolecularPharmacology.tsx` (or equivalent)

#### **Implementation:**

**Step 1:** Find SMILES string display elements

**Step 2:** Add word-break classes

**BEFORE:**
```tsx
<div className="text-sm text-slate-400">
  <span className="font-mono">{substance.smiles}</span>
</div>
```

**AFTER:**
```tsx
<div className="text-sm text-slate-400">
  <span className="font-mono break-all max-w-full inline-block">
    {substance.smiles}
  </span>
</div>
```

**Alternative (for better readability):**
```tsx
<div className="text-sm text-slate-400">
  <div className="font-mono text-xs break-all bg-slate-800/50 p-2 rounded border border-slate-700">
    {substance.smiles}
  </div>
</div>
```

**Step 3:** Apply to all long text fields

Common candidates:
- SMILES strings
- InChI keys
- Long URLs
- Chemical formulas
- Error messages

**CSS Classes to Use:**
- `break-all` - Break anywhere (for technical strings)
- `break-words` - Break at word boundaries (for readable text)
- `overflow-wrap-anywhere` - Modern alternative

**Step 4:** Add truncation for very long strings (optional)

```tsx
<div className="relative group">
  <div className="font-mono text-xs break-all line-clamp-2 bg-slate-800/50 p-2 rounded border border-slate-700">
    {substance.smiles}
  </div>
  <button
    onClick={() => setExpanded(!expanded)}
    className="text-xs text-indigo-400 hover:text-indigo-300 mt-1"
  >
    {expanded ? 'Show less' : 'Show more'}
  </button>
</div>
```

#### **Acceptance Criteria:**
- [ ] SMILES strings wrap within viewport
- [ ] No horizontal overflow
- [ ] Text remains readable
- [ ] Monospace font preserved
- [ ] Desktop layout unaffected

---

### **TASK 6: Fix Chart Containers** 🟡
**Priority:** MEDIUM  
**Time:** 1 hour  
**Complexity:** 4/10 (Recharts configuration)

#### **Problem:**
Charts on Patient Galaxy and other pages slightly exceed viewport width on narrow screens.

#### **Affected Pages:**
- Patient Galaxy (Patient Constellation)
- Clinical Radar
- Protocol ROI
- Any page with Recharts components

#### **Solution:**
Ensure all chart containers have proper responsive wrappers.

#### **Files to Edit:**
1. `src/pages/PatientConstellation.tsx`
2. `src/pages/ClinicPerformance.tsx`
3. `src/pages/ProtocolEfficiency.tsx`
4. Any chart components

#### **Implementation:**

**Step 1:** Find all `<ResponsiveContainer>` components

**Step 2:** Wrap in max-width container

**BEFORE:**
```tsx
<ResponsiveContainer width="100%" height={400}>
  <ScatterChart data={data}>
    {/* Chart config */}
  </ScatterChart>
</ResponsiveContainer>
```

**AFTER:**
```tsx
<div className="w-full max-w-full overflow-hidden">
  <ResponsiveContainer width="100%" height={400}>
    <ScatterChart data={data}>
      {/* Chart config */}
    </ScatterChart>
  </ResponsiveContainer>
</div>
```

**Step 3:** Add responsive height for mobile

```tsx
<div className="w-full max-w-full overflow-hidden">
  <ResponsiveContainer 
    width="100%" 
    height={window.innerWidth < 768 ? 300 : 400}
  >
    <ScatterChart data={data}>
      {/* Chart config */}
    </ScatterChart>
  </ResponsiveContainer>
</div>
```

**Better approach with Tailwind:**
```tsx
<div className="w-full max-w-full overflow-hidden h-[300px] md:h-[400px]">
  <ResponsiveContainer width="100%" height="100%">
    <ScatterChart data={data}>
      {/* Chart config */}
    </ScatterChart>
  </ResponsiveContainer>
</div>
```

**Step 4:** Adjust chart margins for mobile

```tsx
<ScatterChart 
  data={data}
  margin={{
    top: 20,
    right: window.innerWidth < 768 ? 10 : 30,
    bottom: 20,
    left: window.innerWidth < 768 ? 0 : 20
  }}
>
  {/* Chart config */}
</ScatterChart>
```

**Step 5:** Make legends responsive

```tsx
<Legend 
  wrapperStyle={{
    fontSize: '12px',
    paddingTop: '10px'
  }}
  layout={window.innerWidth < 768 ? 'horizontal' : 'vertical'}
  align={window.innerWidth < 768 ? 'center' : 'right'}
/>
```

**Step 6:** Create reusable chart wrapper component (optional)

```tsx
// src/components/ChartWrapper.tsx
interface ChartWrapperProps {
  children: React.ReactNode;
  height?: number;
  mobileHeight?: number;
}

export const ChartWrapper: React.FC<ChartWrapperProps> = ({ 
  children, 
  height = 400,
  mobileHeight = 300 
}) => {
  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className={`h-[${mobileHeight}px] md:h-[${height}px]`}>
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Usage:
<ChartWrapper height={400} mobileHeight={300}>
  <ScatterChart data={data}>
    {/* Chart config */}
  </ScatterChart>
</ChartWrapper>
```

#### **Acceptance Criteria:**
- [ ] All charts fit within viewport
- [ ] No horizontal overflow
- [ ] Charts remain interactive
- [ ] Legends readable on mobile
- [ ] Smooth responsive behavior
- [ ] Desktop layout unaffected

---

## 🧪 **TESTING CHECKLIST**

### **After Task 4 (Tables):**
- [ ] Open Safety Surveillance page
- [ ] Set viewport to 375px
- [ ] Verify table scrolls horizontally within container
- [ ] Verify page does not scroll horizontally
- [ ] Check scroll indicator appears
- [ ] Test on real mobile device

### **After Task 5 (Text Wrapping):**
- [ ] Open Molecular DB page
- [ ] Set viewport to 375px
- [ ] Verify SMILES strings wrap
- [ ] Verify no horizontal overflow
- [ ] Check text remains readable
- [ ] Test with longest SMILES string

### **After Task 6 (Charts):**
- [ ] Open Patient Galaxy page
- [ ] Set viewport to 375px
- [ ] Verify chart fits within viewport
- [ ] Verify chart remains interactive
- [ ] Check legend is readable
- [ ] Test all chart pages

---

## 📊 **PROGRESS TRACKING**

### **After Phase 1 (Critical Fixes):**
- ❌ 0 pages with major issues (0%) ← Target achieved
- ⚠️ 7 pages with minor issues (50%)
- ✅ 7 pages working well (50%)

### **After Phase 2 (Minor Fixes):**
- ❌ 0 pages with major issues (0%)
- ⚠️ 2 pages with minor issues (14%) ← Target
- ✅ 12 pages working well (86%) ← Target

---

## 🎯 **FINAL ACCEPTANCE CRITERIA**

### **All Tasks Complete:**
- [ ] No horizontal scroll on any page (375px)
- [ ] All tables in scroll containers
- [ ] All long text wraps properly
- [ ] All charts fit within viewport
- [ ] Lighthouse mobile score >95
- [ ] No regressions on desktop
- [ ] All 14 pages tested and verified

### **Quality Metrics:**
- [ ] Mobile usability: 100/100
- [ ] Accessibility: 100/100
- [ ] Performance: >90
- [ ] Best Practices: 100/100

---

## 📝 **IMPLEMENTATION ORDER**

**Recommended sequence:**

1. **Task 4** (Tables) - Easiest, clear pattern
2. **Task 5** (Text) - Simple CSS changes
3. **Task 6** (Charts) - Most complex, benefits from other fixes

**Total Time:** 3 hours (1 hour each)

---

## 🔍 **VERIFICATION SCRIPT**

After all tasks complete, run this verification:

```bash
# 1. Set viewport to 375px in DevTools

# 2. Test each affected page:
echo "Testing tables..."
open http://localhost:3000/#/deep-dives/safety-surveillance

echo "Testing text wrapping..."
open http://localhost:3000/#/deep-dives/molecular-pharmacology

echo "Testing charts..."
open http://localhost:3000/#/deep-dives/patient-constellation
open http://localhost:3000/#/deep-dives/clinic-performance
open http://localhost:3000/#/deep-dives/protocol-efficiency

# 3. For each page, verify:
# - No horizontal scroll
# - Content fits in viewport
# - Interactive elements work
# - Desktop layout unaffected

# 4. Run Lighthouse audit
# Target: Mobile score >95
```

---

## 💬 **QUESTIONS FOR BUILDER**

1. **Are you using Recharts for all charts?**
   - If using different library, let DESIGNER know

2. **Do you have a ChartWrapper component already?**
   - If yes, we can enhance it instead of creating new

3. **Estimated time for Phase 2?**
   - DESIGNER estimate: 3 hours
   - Your estimate: _____

---

**Task Created:** 2026-02-12 06:29 PST  
**Owner:** BUILDER  
**Reviewer:** DESIGNER  
**Deadline:** After Phase 1 completion  
**Priority:** 🟡 MEDIUM - Polish for mobile launch
