# 🎨 SUBSTANCE MONOGRAPH PAGE IMPROVEMENTS
**Date:** 2026-02-09 14:36 PST  
**Priority:** MEDIUM (Post-Presentation, Week 1)  
**Estimated Time:** 2-3 hours

---

## 📋 **ISSUES IDENTIFIED**

### **1. Hero Section - Wasted Vertical Space** 🔴 CRITICAL
**Location:** `src/pages/SubstanceMonograph.tsx` lines 140-233

**Current Layout:**
```
┌────────────────────────────────────────┐
│  [Text Content - Left]                 │
│  - Badges                              │
│  - Title                               │
│  - Chemical Name                       │
│  - Registry Access                     │
│                                        │
│  [Molecule Image - Stacked Below]      │
│  [Aggregate Efficacy - Stacked Below]  │
└────────────────────────────────────────┘
```

**Problem:**
- Molecule and Efficacy stacked vertically
- Pushes content below the fold
- Wastes horizontal space

**User Feedback:**
> "There's too much wasted space in the hero section, and that pushes everything else below the fold. I think if the molecule image and aggregate efficacy were horizontally aligned with the hero (with the efficacy on the right), this would look great."

---

### **2. Neural Synthesis Container Height Mismatch** 🟡
**Location:** `src/pages/SubstanceMonograph.tsx` line 334

**Current State:**
- Registry: `h-[420px]` (line 242 - implicit from flex-col)
- Affinity: `h-[420px]` (line 274 - explicit)
- Neural Synthesis: No fixed height (line 334)

**Problem:**
- Neural Synthesis doesn't match height of Affinity and Registry
- Bento boxes not aligned

**User Feedback:**
> "The neural synthesis container needs to match the height of the affinity and the registry so that all the bento boxes are aligned better."

---

### **3. Affinity Spider Graph - Text Too Small** 🔴 CRITICAL
**Location:** `src/pages/SubstanceMonograph.tsx` line 288

**Current Code:**
```tsx
<PolarAngleAxis 
  dataKey="subject" 
  tick={{ fill: '#475569', fontSize: 10, fontWeight: 900 }} 
/>
```

**Problem:**
- `fontSize: 10` (10px) is below 11px minimum
- Unreadable on 27" monitor

**User Feedback:**
> "Inside the 'affinity' container, the text inside the spider graph is so small, it's not readable."

---

### **4. Missing Tooltips** 🟡
**Location:** All containers on page

**Current State:**
- No tooltips on any containers
- User doesn't know what data means

**User Feedback:**
> "Every container on this page needs a tooltip."

**Containers Needing Tooltips:**
1. Registry (what is CAS, Mol. Weight, etc.)
2. Affinity (what is Ki Spec, receptor binding)
3. Clinical Velocity (what does this graph show)
4. Neural Synthesis (what does AI analysis do)
5. Clinical Archive (what are these files)

---

### **5. Clinical Velocity - Unclear Purpose** 🟡
**Location:** `src/pages/SubstanceMonograph.tsx` lines 298-328

**Current State:**
- Graph shows efficacy trend over time
- Subtext: "Efficacy validation trend across versions" (line 308)
- User doesn't understand what it means or how it helps

**User Feedback:**
> "The clinical velocity graph looks cool, but I have no idea what it says, and how that helps the user."

**DECISION NEEDED:** 
- Improve explanation?
- Add tooltip?
- Replace with different metric?

---

## 🎯 **IMPLEMENTATION PLAN**

### **PHASE 1: Hero Section Horizontal Layout** (60 minutes)

#### **Task 1.1: Restructure Hero Layout**

**BEFORE (lines 148-231):**
```tsx
<PageContainer className="relative z-10 py-12 sm:py-20 flex flex-col lg:flex-row items-center justify-between gap-16">
  {/* Left: Text Content */}
  <div className="space-y-8 text-center lg:text-left flex-1">
    {/* Badges, Title, Chemical Name, Registry Access */}
  </div>

  {/* Right: Molecule + Efficacy (Stacked Vertically) */}
  <div className="flex flex-col items-center lg:items-end gap-8 shrink-0">
    {/* Molecule Image */}
    {/* Aggregate Efficacy */}
  </div>
</PageContainer>
```

**AFTER:**
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
        
        {/* Tooltip Icon */}
        <div className="absolute top-4 right-4 group/tooltip">
          <span className="material-symbols-outlined text-slate-600 hover:text-primary text-lg cursor-help">info</span>
          <div className="absolute top-8 right-0 w-64 p-4 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-50">
            <p className="text-xs text-slate-300 leading-relaxed">
              Aggregate efficacy score based on meta-analysis of clinical trials. Higher scores indicate stronger evidence for therapeutic benefit.
            </p>
          </div>
        </div>

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

**Changes:**
- 12-column grid layout (5-4-3 split)
- Text content: 5 columns (left)
- Molecule: 4 columns (center)
- Efficacy: 3 columns (right)
- All horizontally aligned
- Reduces vertical height by ~40%
- Adds tooltip to Efficacy

---

### **PHASE 2: Container Height Alignment** (15 minutes)

#### **Task 2.1: Match Neural Synthesis Height**

**Location:** Line 334

**BEFORE:**
```tsx
<section className="bg-indigo-600/5 border border-indigo-500/20 rounded-[2.5rem] p-8 shadow-2xl flex flex-col group/synthesis relative overflow-hidden">
```

**AFTER:**
```tsx
<section className="bg-indigo-600/5 border border-indigo-500/20 rounded-[2.5rem] p-8 shadow-2xl h-[420px] flex flex-col group/synthesis relative overflow-hidden">
```

**Effect:**
- Neural Synthesis matches Affinity and Registry height
- All bento boxes aligned

---

### **PHASE 3: Fix Affinity Text Size** (10 minutes)

#### **Task 3.1: Increase Spider Graph Font Size**

**Location:** Line 288

**BEFORE:**
```tsx
<PolarAngleAxis 
  dataKey="subject" 
  tick={{ fill: '#475569', fontSize: 10, fontWeight: 900 }} 
/>
```

**AFTER:**
```tsx
<PolarAngleAxis 
  dataKey="subject" 
  tick={{ fill: '#cbd5e1', fontSize: 12, fontWeight: 900 }} 
/>
```

**Changes:**
- `fontSize: 10` → `fontSize: 12` (meets 11px minimum)
- `fill: '#475569'` → `fill: '#cbd5e1'` (lighter color for better contrast)

---

### **PHASE 4: Add Tooltips to All Containers** (45 minutes)

#### **Task 4.1: Create Reusable Tooltip Component**

**New File:** `src/components/ui/InfoTooltip.tsx`

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

---

#### **Task 4.2: Add Tooltips to Each Container**

**Tooltip Content:**

```tsx
const TOOLTIPS = {
  registry: "Basic pharmacological properties including molecular weight, chemical formula, drug classification, and pharmacokinetic parameters.",
  
  affinity: "Receptor binding affinity (Ki values) showing how strongly this substance binds to different brain receptors. Higher values indicate stronger binding.",
  
  clinicalVelocity: "Historical efficacy trend showing how confidence in this substance's therapeutic benefit has evolved through clinical trials and real-world evidence. Upward trends indicate growing evidence base.",
  
  neuralSynthesis: "AI-powered analysis that searches recent clinical literature (2024-2025) to synthesize the latest research findings, regulatory changes, and breakthrough discoveries.",
  
  clinicalArchive: "Authorized institutional uploads including protocol documents, safety reports, and outcome data from verified clinical sites."
};
```

**Implementation:**

```tsx
// Registry Container (line 243):
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

// Affinity Container (line 275):
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

// Clinical Velocity Container (line 300):
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

// Neural Synthesis Container (line 338):
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

// Clinical Archive Container (line 380):
<div className="flex items-center justify-between mb-6">
  <div className="space-y-1">
    <h3 className="text-[13px] font-black text-slate-200 tracking-[0.2em] uppercase">Clinical Archive</h3>
    <p className="text-[11px] text-slate-600 font-black uppercase tracking-widest">Authorized Site Uploads</p>
  </div>
  <InfoTooltip content={TOOLTIPS.clinicalArchive} position="left" />
</div>
```

---

## 📊 **BEFORE/AFTER COMPARISON**

### **Hero Section:**

**BEFORE:**
```
┌────────────────────────────────────────┐
│  Text Content (Full Width)             │
│  - Badges, Title, Chemical Name        │
│  - Registry Access                     │
│                                        │
│  ┌──────────────┐                      │
│  │  Molecule    │                      │
│  │  Image       │                      │
│  └──────────────┘                      │
│                                        │
│  ┌──────────────┐                      │
│  │  Aggregate   │                      │
│  │  Efficacy    │                      │
│  └──────────────┘                      │
│                                        │
│  [Content Below Fold]                  │
└────────────────────────────────────────┘
```

**AFTER:**
```
┌────────────────────────────────────────────────────────┐
│  ┌──────────┬──────────────┬──────────────┐            │
│  │ Text     │  Molecule    │  Aggregate   │            │
│  │ Content  │  Image       │  Efficacy    │            │
│  │ (5 cols) │  (4 cols)    │  (3 cols)    │            │
│  │          │              │              │            │
│  │ Badges   │  ┌────────┐  │  85.0%       │            │
│  │ Title    │  │        │  │  ████████░░  │            │
│  │ Chem     │  │ [Mol]  │  │              │            │
│  │ Registry │  │        │  │  [Tooltip]   │            │
│  │          │  └────────┘  │              │            │
│  └──────────┴──────────────┴──────────────┘            │
│                                                         │
│  [Content Now Above Fold]                              │
└─────────────────────────────────────────────────────────┘
```

**Savings:** ~300-400px vertical space

---

### **Container Heights:**

**BEFORE:**
```
┌──────────┬──────────┬──────────┐
│ Registry │ Affinity │ Neural   │
│ 420px    │ 420px    │ Auto     │
│          │          │ (varies) │
│          │          │          │
│          │          │          │
└──────────┴──────────┴──────────┘
           ↑ Misaligned
```

**AFTER:**
```
┌──────────┬──────────┬──────────┐
│ Registry │ Affinity │ Neural   │
│ 420px    │ 420px    │ 420px    │
│          │          │          │
│          │          │          │
│          │          │          │
└──────────┴──────────┴──────────┘
           ↑ Perfectly aligned
```

---

## 🧪 **TESTING CHECKLIST**

### **Hero Section:**
- [ ] Text, Molecule, and Efficacy horizontally aligned on desktop
- [ ] Layout stacks properly on mobile (text → molecule → efficacy)
- [ ] Content appears above fold on 1920x1080 monitor
- [ ] Efficacy tooltip appears on hover

### **Container Heights:**
- [ ] Registry, Affinity, and Neural Synthesis all 420px tall
- [ ] All bento boxes align perfectly in grid

### **Text Sizes:**
- [ ] Spider graph labels readable from 24" distance
- [ ] No text smaller than 11px anywhere
- [ ] Lighter color improves contrast

### **Tooltips:**
- [ ] All 5 containers have info icon
- [ ] Tooltips appear on hover
- [ ] Tooltips positioned correctly (don't overflow)
- [ ] Tooltip content is helpful and clear

### **Clinical Velocity:**
- [ ] Tooltip explains what graph shows
- [ ] Subtext clarified
- [ ] User understands purpose

---

## 📦 **BUILDER INSTRUCTIONS**

### **Implementation Order:**

**CRITICAL (Do First - 75 minutes):**
1. ✅ Restructure hero section (12-column grid, 5-4-3 layout)
2. ✅ Create InfoTooltip component
3. ✅ Add tooltips to all 5 containers

**HIGH (Do Second - 25 minutes):**
4. ✅ Match Neural Synthesis height to 420px
5. ✅ Increase spider graph font size to 12px

**Testing (30 minutes):**
6. ✅ Test responsive behavior
7. ✅ Test tooltip positioning
8. ✅ Verify text readability

---

## 🚨 **PRESERVATION RULES**

⚠️ **DO NOT CHANGE:**
- Container styling (colors, borders, shadows)
- Data visualization logic
- AI synthesis functionality
- Safety interactions section

⚠️ **ONLY MODIFY:**
- Hero section layout (vertical → horizontal)
- Container heights (add h-[420px] to Neural Synthesis)
- Spider graph font size (10px → 12px)
- Add tooltips (new InfoTooltip components)

---

**Total Estimated Time:** 2-3 hours  
**Priority:** Week 1 Post-Presentation  
**Impact:** HIGH (improves usability, accessibility, and information density)

---

📝 **UPDATE FOR `_agent_status.md`**

## 3. BUILDER QUEUE (Post-Presentation, Week 1)

**Substance Monograph Improvements:**
- [ ] Restructure hero section (12-column grid: text 5, molecule 4, efficacy 3)
- [ ] Create InfoTooltip component (reusable)
- [ ] Add tooltips to all 5 containers (Registry, Affinity, Velocity, Synthesis, Archive)
- [ ] Match Neural Synthesis height to 420px (align with Registry + Affinity)
- [ ] Increase spider graph font size (10px → 12px, improve contrast)
- [ ] Test responsive behavior and tooltip positioning
