# 🔧 POST-LAUNCH POLISH BATCH
**Date:** February 9, 2026 21:01 PST  
**Purpose:** UI/UX refinements across Dashboard, Research Portal, Substance Monograph, and Patient Constellation  
**Priority:** Medium - Post-launch polish

---

## 📋 **ISSUES TO FIX**

### **1. Dashboard: Remove ConnectorFeed Button** ⏰ 2 min
### **2. Research Portal: Smart Filters Formatting** ⏰ 15 min
### **3. Research Portal: Search Box Rectangle Bug** ⏰ 5 min
### **4. Research Portal: Button Consistency** ⏰ 10 min
### **5. Research Portal: Fix Subheading** ⏰ 2 min
### **6. Substance Monograph: Align Hero Horizontally** ⏰ 20 min
### **7. Patient Constellation: Fix Axis Text** ⏰ 15 min
### **8. Molecular Bridge: Add Missing Substance Buttons** ⏰ 10 min
### **9. Molecular Bridge: Replace 3D Placeholder** ⏰ 15 min

**Total Time:** ~94 minutes

---

## 🔴 **ISSUE #1: Remove ConnectorFeed Button from Dashboard**

**File:** `src/pages/Dashboard.tsx`

**Current:** Line 86 shows `<ConnectFeedButton />`

**Action:** Remove this component entirely

**Change:**

```typescript
// BEFORE (lines 82-88):
{/* Header Actions */}
<div className="flex items-center gap-4">
  <ConnectFeedButton />
</div>

// AFTER:
{/* Header Actions */}
<div className="flex items-center gap-4">
  {/* ConnectFeed removed - not needed for MVP */}
</div>
```

**Or simply delete lines 82-88 entirely if no other header actions are needed.**

**Test:**
- [ ] Dashboard loads without ConnectFeed button
- [ ] No console errors
- [ ] Header looks clean

---

## 🔵 **ISSUE #2: Research Portal - Smart Filters Formatting**

**File:** `src/pages/SearchPortal.tsx`

**Problem:** Smart filters container needs better formatting/spacing

**Solution:** Add proper container styling and spacing

**Find the Smart Filters section and update:**

```tsx
{/* Smart Filters Container */}
<div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 space-y-4">
  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">
    Smart Filters
  </h3>
  
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {/* Filter chips/buttons here */}
  </div>
</div>
```

**Ensure:**
- Consistent padding: `p-6`
- Proper spacing between filters: `gap-4`
- Clear visual hierarchy with heading
- Rounded corners: `rounded-3xl`

---

## 🔵 **ISSUE #3: Research Portal - Search Box Rectangle Bug**

**File:** `src/pages/SearchPortal.tsx`

**Problem:** Search box turns into rectangle when clicked (focus state)

**Solution:** Ensure border-radius is maintained on focus

**Find the search input and update:**

```tsx
<input
  type="text"
  placeholder="Search by substance, protocol, or patient ID..."
  className="
    w-full px-6 py-4 
    bg-slate-950 
    border-2 border-slate-700 
    rounded-2xl 
    text-white 
    placeholder:text-slate-500
    focus:outline-none 
    focus:border-primary/50 
    focus:rounded-2xl
    transition-all
  "
/>
```

**Key fix:** Add `focus:rounded-2xl` to maintain border radius on focus

**Test:**
- [ ] Search box maintains rounded corners when clicked
- [ ] Border color changes on focus
- [ ] No visual glitches

---

## 🔵 **ISSUE #4: Research Portal - Button Consistency**

**File:** `src/pages/SearchPortal.tsx`

**Problem:** Filter toggle and search button are not consistent

**Solution:** Apply `.btn-primary` class (from earlier) to all action buttons

**Find these buttons and standardize:**

```tsx
{/* Filter Toggle Button */}
<button className="btn-primary">
  <span className="material-symbols-outlined">filter_list</span>
  Filters
</button>

{/* Search Button */}
<button className="btn-primary">
  <span className="material-symbols-outlined">search</span>
  Search
</button>

{/* Advanced Search Button (if exists) */}
<button className="px-8 py-5 bg-transparent border-2 border-primary text-primary hover:bg-primary/10 text-sm font-black rounded-2xl uppercase tracking-[0.2em] transition-all flex items-center gap-2">
  <span className="material-symbols-outlined">tune</span>
  Advanced
</button>
```

**Ensure all buttons have:**
- Same height: `py-5`
- Same padding: `px-8`
- Same border radius: `rounded-2xl`
- Same font: `text-sm font-black uppercase tracking-[0.2em]`

---

## 🔵 **ISSUE #5: Research Portal - Fix Subheading**

**File:** `src/pages/SearchPortal.tsx`

**Current:** "Unified Clinical Registry" (incorrect)

**New:** Descriptive and instructive subheading

**Change:**

```tsx
// BEFORE:
<p className="text-slate-400 text-lg">
  Unified Clinical Registry
</p>

// AFTER:
<p className="text-slate-400 text-lg font-medium">
  Search and analyze de-identified treatment protocols across the global network
</p>
```

**Alternative options:**
- "Query de-identified protocols, outcomes, and safety data"
- "Access aggregated clinical insights from 14 institutional sites"
- "Search protocols by substance, modality, or outcome measure"

**Test:**
- [ ] Subheading is descriptive
- [ ] Subheading is instructive
- [ ] Matches brand voice

---

## 🟠 **ISSUE #6: Substance Monograph - Align Hero Horizontally**

**File:** `src/pages/SubstanceMonograph.tsx`

**Problem:** Hero section (left) not aligned with two boxes (right)

**Current Structure:**
```
┌─────────────────┐  ┌──────┐
│                 │  │ Box1 │
│  Hero (tall)    │  ├──────┤
│                 │  │ Box2 │
└─────────────────┘  └──────┘
```

**Desired Structure:**
```
┌─────────────────┬──────┐
│                 │ Box1 │
│  Hero (aligned) ├──────┤
│                 │ Box2 │
└─────────────────┴──────┘
```

**Solution:** Use CSS Grid with equal row heights

**Find the hero section and update:**

```tsx
{/* Hero Section */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
  
  {/* Left: Main Hero */}
  <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between">
    {/* Substance name, chemical formula, badges, etc. */}
    <div>
      <h1 className="text-5xl font-black text-white mb-4">
        {substance.name}
      </h1>
      <p className="text-slate-400 text-lg mb-6">
        {substance.chemicalFormula}
      </p>
      {/* Badges */}
    </div>
    
    {/* Registry Access buttons at bottom */}
    <div className="flex gap-4 mt-8">
      {/* Buttons here */}
    </div>
  </div>

  {/* Right: Two Stacked Boxes */}
  <div className="flex flex-col gap-6">
    {/* Box 1: Structural Data */}
    <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 flex-1">
      {/* 3D molecule or structural formula */}
    </div>
    
    {/* Box 2: Aggregate Efficacy */}
    <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 flex-1">
      {/* Efficacy score */}
    </div>
  </div>
</div>
```

**Key changes:**
- Use `grid-cols-3` (hero takes 2 cols, boxes take 1 col)
- Add `items-stretch` to make all items same height
- Use `flex-1` on stacked boxes to split height evenly
- Add `justify-between` to hero to push buttons to bottom

**Test:**
- [ ] Hero and boxes are same total height
- [ ] Boxes stack evenly on right
- [ ] Responsive on mobile (stacks vertically)
- [ ] No overflow or clipping

---

## 🟠 **ISSUE #7: Patient Constellation - Fix Axis Text**

**File:** `src/components/analytics/PatientGalaxyAnalysis.tsx` (or wherever this chart is)

**Problem:** Text on axis and below chart is unreadable

**Solution:** Increase font size, improve contrast, add proper formatting

**Find the Recharts configuration and update:**

```tsx
<ResponsiveContainer width="100%" height={400}>
  <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
    
    {/* X-Axis */}
    <XAxis
      dataKey="x"
      type="number"
      name="Treatment Resistance Score"
      label={{
        value: 'Treatment Resistance Score',
        position: 'bottom',
        offset: 40,
        style: {
          fill: '#94a3b8', // slate-400
          fontSize: 14,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }
      }}
      tick={{
        fill: '#64748b', // slate-500
        fontSize: 12,
        fontWeight: 600
      }}
      axisLine={{ stroke: '#334155', strokeWidth: 2 }}
      tickLine={{ stroke: '#334155' }}
    />

    {/* Y-Axis */}
    <YAxis
      dataKey="y"
      type="number"
      name="Remission Duration (weeks)"
      label={{
        value: 'Remission Duration (weeks)',
        angle: -90,
        position: 'left',
        offset: 40,
        style: {
          fill: '#94a3b8', // slate-400
          fontSize: 14,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }
      }}
      tick={{
        fill: '#64748b', // slate-500
        fontSize: 12,
        fontWeight: 600
      }}
      axisLine={{ stroke: '#334155', strokeWidth: 2 }}
      tickLine={{ stroke: '#334155' }}
    />

    {/* Tooltip */}
    <Tooltip
      contentStyle={{
        backgroundColor: '#0f172a',
        border: '2px solid #334155',
        borderRadius: '12px',
        fontSize: '13px',
        fontWeight: 600
      }}
      labelStyle={{
        color: '#e2e8f0',
        fontWeight: 700
      }}
    />

    {/* Scatter */}
    <Scatter
      data={data}
      fill="#3b82f6"
      shape="circle"
    />
  </ScatterChart>
</ResponsiveContainer>
```

**Key fixes:**
- Axis labels: `fontSize: 14`, `fontWeight: 700`
- Tick labels: `fontSize: 12`, `fontWeight: 600`
- Color: `#94a3b8` (slate-400) for labels, `#64748b` (slate-500) for ticks
- Increased bottom/left margins for label space
- Uppercase + letter-spacing for professional look

**Test:**
- [ ] All axis text is readable
- [ ] Labels are properly positioned
- [ ] No text overlap
- [ ] Tooltip is readable

---

## 🟣 **ISSUE #8: Molecular Bridge - Add Missing Substance Buttons**

**File:** `src/components/analytics/MolecularBridge.tsx` (or wherever this component is)

**Current:** 4 buttons (Psilocybin, MDMA, LSD, Ketamine)

**Add:** 3 more buttons for complete catalog (7 total)

**Substances in catalog:**
1. Psilocybin ✅
2. MDMA ✅
3. LSD ✅
4. Ketamine ✅
5. **Ayahuasca** (add)
6. **DMT** (add)
7. **Mescaline** (add)

**Sorted alphabetically:**
1. Ayahuasca
2. DMT
3. Ketamine
4. LSD
5. MDMA
6. Mescaline
7. Psilocybin

**Update button array:**

```tsx
const substances = [
  { name: 'Ayahuasca', color: 'bg-amber-500', active: false },
  { name: 'DMT', color: 'bg-rose-500', active: false },
  { name: 'Ketamine', color: 'bg-slate-500', active: false },
  { name: 'LSD', color: 'bg-purple-500', active: false },
  { name: 'MDMA', color: 'bg-pink-500', active: false },
  { name: 'Mescaline', color: 'bg-emerald-500', active: false },
  { name: 'Psilocybin', color: 'bg-indigo-500', active: true } // default active
];

// Render buttons:
<div className="flex flex-wrap gap-3">
  {substances.map(sub => (
    <button
      key={sub.name}
      onClick={() => setActiveSubstance(sub.name)}
      className={`
        px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider
        transition-all
        ${activeSubstance === sub.name 
          ? `${sub.color} text-white shadow-lg scale-105` 
          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
        }
      `}
    >
      {sub.name}
    </button>
  ))}
</div>
```

**Test:**
- [ ] All 7 substances have buttons
- [ ] Buttons are sorted alphabetically
- [ ] Active state works correctly
- [ ] Clicking changes the graph data

---

## 🟣 **ISSUE #9: Molecular Bridge - Replace 3D Placeholder**

**File:** `src/components/analytics/MolecularBridge.tsx`

**Problem:** "3D" text is a placeholder for 3D molecule visualization

**Current:** Just text "3D"

**Solutions (in order of preference):**

### **Option A: Use Mol* Viewer (Recommended)** ⭐

**Install:**
```bash
npm install molstar
```

**Implementation:**
```tsx
import { createPluginUI } from 'molstar/lib/mol-plugin-ui';
import 'molstar/lib/mol-plugin-ui/skin/light.scss';

const MoleculeViewer = ({ pdbId }: { pdbId: string }) => {
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewerRef.current) {
      const plugin = createPluginUI(viewerRef.current, {
        layoutIsExpanded: false,
        layoutShowControls: false,
        layoutShowRemoteState: false,
        layoutShowSequence: false,
        layoutShowLog: false,
        layoutShowLeftPanel: false,
        viewportShowExpand: false,
        viewportShowSelectionMode: false,
        viewportShowAnimation: false
      });

      // Load structure
      plugin.loadStructureFromUrl(`https://files.rcsb.org/download/${pdbId}.pdb`, 'pdb');
    }
  }, [pdbId]);

  return <div ref={viewerRef} className="w-full h-full" />;
};
```

### **Option B: Use 3Dmol.js (Simpler)** ⭐⭐

**Install:**
```bash
npm install 3dmol
```

**Implementation:**
```tsx
import $3Dmol from '3dmol';

const MoleculeViewer = ({ pdbId }: { pdbId: string }) => {
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewerRef.current) {
      const viewer = $3Dmol.createViewer(viewerRef.current, {
        backgroundColor: 'black'
      });

      // Fetch and display molecule
      $3Dmol.download(`pdb:${pdbId}`, viewer, {}, () => {
        viewer.setStyle({}, { stick: { colorscheme: 'Jmol' } });
        viewer.zoomTo();
        viewer.render();
      });
    }
  }, [pdbId]);

  return <div ref={viewerRef} className="w-full h-full" />;
};
```

### **Option C: Use Static SVG (Fastest MVP)** ⭐⭐⭐

**No install needed, use existing molecule images:**

```tsx
<div className="relative w-full h-full bg-slate-950 rounded-2xl p-6 flex items-center justify-center overflow-hidden">
  {/* Background glow */}
  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-3xl"></div>
  
  {/* Molecule image */}
  <img
    src={`/molecules/${activeSubstance.toLowerCase()}.svg`}
    alt={`${activeSubstance} molecular structure`}
    className="relative z-10 w-full h-full object-contain opacity-80 hover:opacity-100 transition-opacity"
  />
  
  {/* Label */}
  <div className="absolute top-4 right-4 px-3 py-1 bg-slate-900/80 border border-slate-700 rounded-lg backdrop-blur-sm">
    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
      Structural
    </p>
    <p className="text-xs font-mono text-indigo-400">
      C₁₂H₁₇N₂O₄P
    </p>
  </div>
</div>
```

**Recommendation:** Use **Option C** for MVP (fastest), then upgrade to **Option B** (3Dmol.js) post-launch for interactive 3D.

**Test:**
- [ ] Molecule visualization displays
- [ ] Changes when substance button clicked
- [ ] Looks professional (not placeholder)
- [ ] Loads quickly

---

## ✅ **TESTING CHECKLIST**

After all fixes:

### **Dashboard:**
- [ ] ConnectFeed button removed
- [ ] No console errors
- [ ] Header looks clean

### **Research Portal:**
- [ ] Smart filters formatted properly
- [ ] Search box maintains rounded corners on focus
- [ ] All buttons consistent size/style
- [ ] Subheading is descriptive and instructive

### **Substance Monograph:**
- [ ] Hero and boxes aligned horizontally
- [ ] Same total height
- [ ] Responsive on mobile

### **Patient Constellation:**
- [ ] Axis text readable
- [ ] Labels properly positioned
- [ ] No text overlap

### **Molecular Bridge:**
- [ ] All 7 substance buttons present
- [ ] Buttons sorted alphabetically
- [ ] 3D placeholder replaced with molecule viz
- [ ] Visualization changes with button clicks

---

## 📊 **SUMMARY**

**Total Issues:** 9  
**Total Time:** ~94 minutes  
**Priority:** Medium (post-launch polish)  
**Risk:** Low (all cosmetic/UX improvements)

**Files to modify:**
1. `src/pages/Dashboard.tsx`
2. `src/pages/SearchPortal.tsx`
3. `src/pages/SubstanceMonograph.tsx`
4. `src/components/analytics/PatientGalaxyAnalysis.tsx`
5. `src/components/analytics/MolecularBridge.tsx`

---

## 📋 **CLINICIAN PAGES STATUS**

**Checked:**
- ✅ `src/pages/ClinicianDirectory.tsx` - EXISTS (339 lines, complete)
- ✅ `src/pages/ClinicianProfile.tsx` - EXISTS (464 lines, complete)

**Features:**
- Practitioner cards with status indicators
- Messaging drawer with AI draft assistance
- Profile management with credentials
- Update credentials modal

**Verdict:** Clinician pages are **COMPLETE** - no work needed! 🎉

---

**Ready to create implementation batches for Builder?** 🚀
