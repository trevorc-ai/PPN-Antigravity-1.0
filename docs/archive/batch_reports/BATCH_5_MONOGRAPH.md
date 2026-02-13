# 🚀 BATCH 5: SUBSTANCE MONOGRAPH
**Time Estimate:** 120 minutes  
**Risk Level:** MEDIUM-HIGH (complex layout refactor)  
**Files to Modify:** 1 file (many changes)  
**Impact:** HIGH - Dramatic improvement to information density

---

## 📋 **WHAT THIS BATCH DOES**

This batch refactors the Substance Monograph page for better layout and usability:

✅ Restructures hero section (horizontal: text-molecule-efficacy)  
✅ Adds tooltips to all 5 containers  
✅ Fixes container heights (all 420px)  
✅ Increases spider graph text size (12px, readable)  

---

## ⚠️ **DEPENDENCIES**

**This batch requires:**
- ✅ InfoTooltip component (created in Batch 1)

**If you haven't completed Batch 1, do that first!**

---

## 🎯 **TASK LIST (4 TASKS)**

### **TASK 5.1: Restructure Hero Section (Horizontal Layout)**
**File:** `src/pages/SubstanceMonograph.tsx`  
**Time:** 45 minutes  
**Complexity:** HIGH

**Find the hero section (lines 148-231, inside the first PageContainer).**

**Replace the ENTIRE hero PageContainer section with:**

```tsx
<PageContainer width="wide" className="relative z-10 py-12">
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
    
    {/* LEFT: Text Content (Span 5) */}
    <div className="lg:col-span-5 space-y-6">
      {/* Badges */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="px-4 py-1.5 bg-primary/20 text-primary border border-primary/30 rounded-full text-sm font-black uppercase tracking-[0.2em]">
          {sub.phase}
        </span>
        <span className="px-4 py-1.5 bg-slate-900/80 text-slate-400 border border-slate-800 rounded-full text-sm font-black uppercase tracking-[0.2em]">
          {sub.schedule}
        </span>
        <div className="flex items-center gap-2 px-4 py-1.5 bg-clinical-green/10 text-clinical-green border border-clinical-green/20 rounded-full text-sm font-black uppercase tracking-[0.2em]">
          <span className="size-2 bg-clinical-green rounded-full animate-pulse"></span>
          Clinical Dossier
        </div>
      </div>

      {/* Title */}
      <div className="space-y-3">
        <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tighter leading-[0.9]">
          {sub.name}
        </h1>
        <p className="text-lg sm:text-xl font-bold text-slate-500 font-mono tracking-tight leading-relaxed">
          {sub.chemicalName}
        </p>
      </div>

      {/* Registry Access */}
      <div className="flex items-center gap-6 pt-4">
        <div className="flex items-center gap-4">
          <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.2em]">Registry Access</p>
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="size-10 rounded-full bg-slate-900 border-2 border-[#05070a] flex items-center justify-center shadow-xl">
                <span className="material-symbols-outlined text-slate-500 text-sm">shield_with_heart</span>
              </div>
            ))}
          </div>
        </div>
        <div className="h-10 w-px bg-white/5"></div>
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest leading-tight">
          <span className="text-white">Live Search Enriched</span><br/>Institutional Research Node
        </p>
      </div>
    </div>

    {/* CENTER: Molecule Image (Span 4) */}
    <div className="lg:col-span-4 flex items-center justify-center">
      <div className="relative group">
        <div className="absolute -inset-4 bg-primary/20 rounded-[3.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="relative size-72 bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 shadow-2xl flex items-center justify-center overflow-hidden transition-transform duration-700 group-hover:scale-[1.02]">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
          <img
            src={sub.imageUrl}
            alt={`${sub.name} Structure`}
            className="w-full h-full object-contain mix-blend-screen opacity-80 group-hover:opacity-100 transition-opacity duration-700 transform group-hover:scale-110"
          />
          
          {/* Micro-labels */}
          <div className="absolute top-6 left-6 flex flex-col gap-0.5">
            <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest leading-none">Structural</span>
            <span className="text-[11px] font-black text-primary uppercase tracking-widest leading-none">0x{id?.slice(-4)}</span>
          </div>
          <div className="absolute bottom-6 right-6 flex flex-col items-end gap-0.5">
            <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest leading-none">Verified</span>
            <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest leading-none">{sub.formula}</span>
          </div>
        </div>
      </div>
    </div>

    {/* RIGHT: Aggregate Efficacy (Span 3) */}
    <div className="lg:col-span-3 flex items-center">
      <div className="w-full bg-slate-900/60 backdrop-blur-3xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl relative group overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-10 transition-opacity"></div>
        
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-black text-slate-500 uppercase tracking-widest">Aggregate Efficacy</p>
          <span className="text-sm font-mono text-clinical-green font-black">NODE_SIGMA</span>
        </div>
        <div className="flex items-baseline gap-2 mb-6">
          <span className="text-5xl font-black text-white tracking-tighter">{(sub.efficacy * 100).toFixed(1)}</span>
          <span className="text-2xl font-black text-clinical-green tracking-tighter">%</span>
        </div>
        <div className="w-full bg-slate-800/50 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-clinical-green shadow-[0_0_12px_#53d22d] transition-all duration-1000 ease-out"
            style={{ width: `${sub.efficacy * 100}%` }}
          ></div>
        </div>
      </div>
    </div>

  </div>
</PageContainer>
```

**Key Changes:**
- 12-column grid (5-4-3 split)
- Text content on left (5 columns)
- Molecule in center (4 columns)
- Efficacy on right (3 columns)
- All horizontally aligned
- Saves 300-400px vertical space

---

### **TASK 5.2: Add Tooltips to All Containers**
**File:** `src/pages/SubstanceMonograph.tsx`  
**Time:** 30 minutes  
**Complexity:** MEDIUM

---

#### **STEP 1: Import InfoTooltip**
**Add to imports at top of file:**

```tsx
import { InfoTooltip } from '../components/ui/InfoTooltip';
```

---

#### **STEP 2: Define Tooltip Content**
**Add this constant after the imports, before the component:**

```tsx
const TOOLTIPS = {
  registry: "Basic pharmacological properties including molecular weight, chemical formula, drug classification, and pharmacokinetic parameters.",
  affinity: "Receptor binding affinity (Ki values) showing how strongly this substance binds to different brain receptors. Higher values indicate stronger binding.",
  clinicalVelocity: "Historical efficacy trend showing how confidence in this substance's therapeutic benefit has evolved through clinical trials and real-world evidence. Upward trends indicate growing evidence base.",
  neuralSynthesis: "AI-powered analysis that searches recent clinical literature (2024-2025) to synthesize the latest research findings, regulatory changes, and breakthrough discoveries.",
  clinicalArchive: "Authorized institutional uploads including protocol documents, safety reports, and outcome data from verified clinical sites."
};
```

---

#### **STEP 3: Add Tooltip to Registry Container**
**Find the Registry header (around line 243):**

**BEFORE:**
```tsx
<div className="flex items-center justify-between mb-6">
  <h3 className="text-[13px] font-black text-slate-200 tracking-[0.2em] flex items-center gap-3">
    <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
      <span className="material-symbols-outlined text-lg">science</span>
    </div>
    Registry
  </h3>
  <span className="text-[11px] font-mono text-slate-600 font-black tracking-widest">MOD_0x{id?.slice(-4)}</span>
</div>
```

**AFTER:**
```tsx
<div className="flex items-center justify-between mb-6">
  <h3 className="text-[13px] font-black text-slate-200 tracking-[0.2em] flex items-center gap-3">
    <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
      <span className="material-symbols-outlined text-lg">science</span>
    </div>
    Registry
  </h3>
  <div className="flex items-center gap-2">
    <InfoTooltip content={TOOLTIPS.registry} position="left" />
    <span className="text-[11px] font-mono text-slate-600 font-black tracking-widest">MOD_0x{id?.slice(-4)}</span>
  </div>
</div>
```

---

#### **STEP 4: Add Tooltip to Affinity Container**
**Find the Affinity header (around line 275):**

**BEFORE:**
```tsx
<div className="flex items-center justify-between mb-4">
  <h3 className="text-[13px] font-black text-slate-200 tracking-[0.2em] flex items-center gap-3">
    <div className="size-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
      <span className="material-symbols-outlined text-lg">hexagon</span>
    </div>
    Affinity
  </h3>
  <div className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-[11px] font-black uppercase tracking-widest">Ki Spec</div>
</div>
```

**AFTER:**
```tsx
<div className="flex items-center justify-between mb-4">
  <h3 className="text-[13px] font-black text-slate-200 tracking-[0.2em] flex items-center gap-3">
    <div className="size-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
      <span className="material-symbols-outlined text-lg">hexagon</span>
    </div>
    Affinity
  </h3>
  <div className="flex items-center gap-2">
    <InfoTooltip content={TOOLTIPS.affinity} position="left" />
    <div className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-[11px] font-black uppercase tracking-widest">Ki Spec</div>
  </div>
</div>
```

---

#### **STEP 5: Add Tooltip to Clinical Velocity Container**
**Find the Clinical Velocity header (around line 300):**

**BEFORE:**
```tsx
<div className="flex items-center justify-between mb-6">
  <div className="space-y-1">
    <h3 className="text-[13px] font-black text-slate-200 tracking-[0.2em] flex items-center gap-3">
      <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
        <span className="material-symbols-outlined text-lg">trending_up</span>
      </div>
      Clinical Velocity
    </h3>
    <p className="text-[11px] text-slate-600 font-black uppercase tracking-[0.2em] ml-11">Efficacy validation trend across versions</p>
  </div>
</div>
```

**AFTER:**
```tsx
<div className="flex items-center justify-between mb-6">
  <div className="space-y-1">
    <h3 className="text-[13px] font-black text-slate-200 tracking-[0.2em] flex items-center gap-3">
      <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
        <span className="material-symbols-outlined text-lg">trending_up</span>
      </div>
      Clinical Velocity
    </h3>
    <p className="text-[11px] text-slate-600 font-black uppercase tracking-[0.2em] ml-11">Efficacy validation trend across versions</p>
  </div>
  <InfoTooltip content={TOOLTIPS.clinicalVelocity} position="left" />
</div>
```

---

#### **STEP 6: Add Tooltip to Neural Synthesis Container**
**Find the Neural Synthesis header (around line 338):**

**BEFORE:**
```tsx
<div className="flex items-center gap-4 mb-8 relative z-10">
  <div className="size-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
    <span className="material-symbols-outlined text-2xl animate-pulse">auto_awesome</span>
  </div>
  <div>
    <h3 className="text-[14px] font-black text-indigo-300 uppercase tracking-[0.2em]">Neural Synthesis</h3>
    <p className="text-[11px] font-mono text-indigo-500/60 uppercase tracking-widest">Node_4.2 Analysis</p>
  </div>
</div>
```

**AFTER:**
```tsx
<div className="flex items-center gap-4 mb-8 relative z-10">
  <div className="size-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
    <span className="material-symbols-outlined text-2xl animate-pulse">auto_awesome</span>
  </div>
  <div className="flex-1">
    <h3 className="text-[14px] font-black text-indigo-300 uppercase tracking-[0.2em]">Neural Synthesis</h3>
    <p className="text-[11px] font-mono text-indigo-500/60 uppercase tracking-widest">Node_4.2 Analysis</p>
  </div>
  <InfoTooltip content={TOOLTIPS.neuralSynthesis} position="left" />
</div>
```

---

#### **STEP 7: Add Tooltip to Clinical Archive Container**
**Find the Clinical Archive header (around line 380):**

**BEFORE:**
```tsx
<div className="space-y-1">
  <h3 className="text-[13px] font-black text-slate-200 tracking-[0.2em] uppercase">Clinical Archive</h3>
  <p className="text-[11px] text-slate-600 font-black uppercase tracking-widest">Authorized Site Uploads</p>
</div>
```

**AFTER:**
```tsx
<div className="flex items-center justify-between mb-6">
  <div className="space-y-1">
    <h3 className="text-[13px] font-black text-slate-200 tracking-[0.2em] uppercase">Clinical Archive</h3>
    <p className="text-[11px] text-slate-600 font-black uppercase tracking-widest">Authorized Site Uploads</p>
  </div>
  <InfoTooltip content={TOOLTIPS.clinicalArchive} position="left" />
</div>
```

---

### **TASK 5.3: Fix Container Heights**
**File:** `src/pages/SubstanceMonograph.tsx`  
**Time:** 5 minutes  
**Complexity:** LOW

**Find and update these 3 containers:**

#### **Registry Container (line ~242):**
**Add `h-[420px]` to className:**

**BEFORE:**
```tsx
<section className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-6 backdrop-blur-3xl shadow-2xl flex flex-col group/registry">
```

**AFTER:**
```tsx
<section className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-6 backdrop-blur-3xl shadow-2xl h-[420px] flex flex-col group/registry">
```

---

#### **Affinity Container (line ~274):**
**Should already have `h-[420px]` - verify it's there:**

```tsx
<section className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-6 backdrop-blur-3xl shadow-2xl h-[420px] flex flex-col group/radar">
```

---

#### **Neural Synthesis Container (line ~334):**
**Add `h-[420px]` to className:**

**BEFORE:**
```tsx
<section className="bg-indigo-600/5 border border-indigo-500/20 rounded-[2.5rem] p-8 shadow-2xl flex flex-col group/synthesis relative overflow-hidden">
```

**AFTER:**
```tsx
<section className="bg-indigo-600/5 border border-indigo-500/20 rounded-[2.5rem] p-8 shadow-2xl h-[420px] flex flex-col group/synthesis relative overflow-hidden">
```

---

### **TASK 5.4: Fix Spider Graph Text Size**
**File:** `src/pages/SubstanceMonograph.tsx`  
**Time:** 3 minutes  
**Complexity:** LOW

**Find the PolarAngleAxis component (line ~288):**

**BEFORE:**
```tsx
<PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 10, fontWeight: 900 }} />
```

**AFTER:**
```tsx
<PolarAngleAxis dataKey="subject" tick={{ fill: '#cbd5e1', fontSize: 12, fontWeight: 900 }} />
```

**Changes:**
- `fontSize: 10` → `fontSize: 12` (meets 11px minimum)
- `fill: '#475569'` → `fill: '#cbd5e1'` (lighter color, better contrast)

---

## ✅ **TESTING CHECKLIST**

After completing all tasks, test the following:

### **Hero Section Checks:**
- [ ] Text, Molecule, and Efficacy horizontally aligned on desktop
- [ ] Text content on left (5 columns)
- [ ] Molecule in center (4 columns)
- [ ] Efficacy on right (3 columns)
- [ ] Layout stacks properly on mobile (text → molecule → efficacy)
- [ ] Content appears above fold on 1920x1080 monitor
- [ ] Saves ~300-400px vertical space

### **Tooltip Checks:**
- [ ] Registry has info icon (tooltip works)
- [ ] Affinity has info icon (tooltip works)
- [ ] Clinical Velocity has info icon (tooltip works)
- [ ] Neural Synthesis has info icon (tooltip works)
- [ ] Clinical Archive has info icon (tooltip works)
- [ ] All tooltips appear on hover
- [ ] All tooltips positioned correctly (don't overflow)
- [ ] All tooltip content is helpful and clear

### **Container Height Checks:**
- [ ] Registry is 420px tall
- [ ] Affinity is 420px tall
- [ ] Neural Synthesis is 420px tall
- [ ] All three containers align perfectly in grid

### **Spider Graph Checks:**
- [ ] Text is readable from 24" distance on 27" monitor
- [ ] Font size is 12px (not 10px)
- [ ] Color is lighter (#cbd5e1, not #475569)
- [ ] Labels don't overlap

### **Functional Checks:**
- [ ] All containers render correctly
- [ ] AI synthesis button works
- [ ] Clinical archive links work
- [ ] Safety interactions display correctly
- [ ] No console errors

### **Responsive Checks:**
- [ ] Mobile (375px): Hero stacks vertically
- [ ] Tablet (768px): Layout adjusts properly
- [ ] Desktop (1920px): Hero horizontal, all aligned
- [ ] Ultra-wide (2560px): Content doesn't over-stretch

---

## 🐛 **COMMON ISSUES & FIXES**

### **Issue 1: Hero section not horizontal**
**Fix:** Make sure you replaced the ENTIRE PageContainer section, not just parts of it

### **Issue 2: Tooltips not showing**
**Fix:** 
1. Verify InfoTooltip imported correctly
2. Verify TOOLTIPS constant defined before component
3. Check console for errors

### **Issue 3: Containers different heights**
**Fix:** Make sure all 3 containers have `h-[420px]` in className

### **Issue 4: Spider graph text still small**
**Fix:** Make sure you changed `fontSize: 10` to `fontSize: 12`

### **Issue 5: Layout breaks on mobile**
**Fix:** Make sure grid has `grid-cols-1 lg:grid-cols-12` (stacks on mobile)

---

## 📊 **PROGRESS TRACKER**

```
BATCH 5 PROGRESS:

Hero Section:
[  ] Task 5.1: Restructure hero (horizontal layout)

Tooltips:
[  ] Task 5.2: Add tooltips to 5 containers
  [  ] Step 1: Import InfoTooltip
  [  ] Step 2: Define TOOLTIPS constant
  [  ] Step 3: Registry tooltip
  [  ] Step 4: Affinity tooltip
  [  ] Step 5: Clinical Velocity tooltip
  [  ] Step 6: Neural Synthesis tooltip
  [  ] Step 7: Clinical Archive tooltip

Container Heights:
[  ] Task 5.3: Fix heights (3 containers)

Spider Graph:
[  ] Task 5.4: Fix text size (12px)

TOTAL: 0/4 tasks complete (0%)
```

---

## 🎯 **SUCCESS CRITERIA**

**Batch 5 is complete when:**
1. ✅ Hero section horizontal (text-molecule-efficacy)
2. ✅ All 5 containers have tooltips
3. ✅ All tooltips work on hover
4. ✅ Registry, Affinity, Neural Synthesis all 420px tall
5. ✅ Spider graph text is 12px (readable)
6. ✅ Content appears above fold
7. ✅ Layout responsive (stacks on mobile)
8. ✅ No console errors
9. ✅ All tests pass

---

## 🎉 **FINAL BATCH!**

**Estimated Time:** 120 minutes

**When complete:**
1. Test thoroughly (use checklist above)
2. Test on multiple screen sizes
3. Test all tooltips
4. Commit to git
5. Celebrate! 🎉

**You've completed all 5 batches!**

---

**Good luck with the final push!** 🚀
