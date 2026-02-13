# 🛠️ BUILDER IMPLEMENTATION PLAN
**Date:** 2026-02-09 14:40 PST  
**Status:** Ready to Execute  
**Total Estimated Time:** 6-8 hours

---

## 📋 **OVERVIEW**

This document consolidates all pending tasks into a logical, dependency-ordered implementation plan. Tasks are grouped by:
1. **File dependencies** (create components before using them)
2. **Complexity** (simple fixes before complex refactors)
3. **Impact** (high-impact changes first)

---

## 🎯 **PHASE 1: FOUNDATION (Create Reusable Components)**
**Time:** 30 minutes  
**Why First:** Other tasks depend on these components

### **Task 1.1: Create InfoTooltip Component**
**File:** `src/components/ui/InfoTooltip.tsx` (NEW)  
**Time:** 15 minutes  
**Complexity:** LOW  
**Dependencies:** None

**Code:**
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

**Used By:**
- SubstanceMonograph.tsx (Phase 4)

---

### **Task 1.2: Verify GravityButton and BentoGrid Components Exist**
**Files:** 
- `src/components/GravityButton.tsx` ✅ EXISTS
- `src/components/layouts/BentoGrid.tsx` ✅ EXISTS

**Time:** 5 minutes  
**Action:** Verify components are working, no changes needed

---

## 🎯 **PHASE 2: QUICK WINS (Simple, High-Impact Fixes)**
**Time:** 60 minutes  
**Why Second:** Low risk, immediate visual improvements

### **Task 2.1: Landing Page - CTA Button Styling**
**File:** `src/pages/Landing.tsx`  
**Lines:** 194-202  
**Time:** 5 minutes  
**Complexity:** LOW  
**Impact:** HIGH

**Change:**
```tsx
// BEFORE:
<GravityButton
  onClick={() => navigate('/login')}
  className="flex-1"
>
  <div className="flex items-center justify-center gap-2">
    Access Portal
    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
  </div>
</GravityButton>

// AFTER:
<button
  onClick={() => navigate('/login')}
  className="flex-1 px-8 py-5 bg-primary hover:bg-blue-600 text-white text-[13px] font-black rounded-2xl uppercase tracking-[0.2em] transition-all shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
>
  Access Portal
  <ArrowRight className="w-4 h-4" />
</button>
```

---

### **Task 2.2: Landing Page - Problem/Solution Heading Size**
**File:** `src/pages/Landing.tsx`  
**Lines:** ~509, ~517  
**Time:** 3 minutes  
**Complexity:** LOW  
**Impact:** MEDIUM

**Change:**
```tsx
// Find both headings and change:
// FROM: className="text-4xl sm:text-6xl font-black tracking-tighter leading-none"
// TO:   className="text-3xl sm:text-5xl font-black tracking-tighter leading-none"
```

---

### **Task 2.3: Landing Page - Floating Molecule Animation**
**File:** `src/pages/Landing.tsx`  
**Lines:** ~240-280 (find molecule animation)  
**Time:** 8 minutes  
**Complexity:** LOW  
**Impact:** MEDIUM

**Change:**
```tsx
// Find molecule animation, change to:
animate={{
  y: [0, -20, 0, -15, 0],
  x: [0, 15, -10, 10, 0],
  rotate: [0, 2, -2, 1, 0],
}}
transition={{
  duration: 8,
  repeat: Infinity,
  ease: "easeInOut",
}}
```

---

### **Task 2.4: Landing Page - Gradient Keywords**
**File:** `src/pages/Landing.tsx`  
**Time:** 12 minutes  
**Complexity:** LOW  
**Impact:** HIGH

**Locations & Changes:**
```tsx
// Line ~151 (Hero headline):
"Unified <span className='text-gradient-primary inline-block'>Clinical Registry</span> for Psychedelic Medicine"

// Line ~509 (Problem heading):
"<span className='text-gradient-primary inline-block'>Generic Trials</span> Fail Specific Patients."

// Line ~517 (Solution heading):
"<span className='text-gradient-primary inline-block'>Structured Data.</span> Network Comparisons."

// Line ~604 (Bento/Interaction Checker heading):
"Clinical <span className='text-gradient-primary inline-block'>Intelligence</span> Infrastructure"

// Line ~720 (About PPN heading):
"About <span className='text-gradient-primary inline-block'>PPN</span>"
```

---

### **Task 2.5: Landing Page - Veterans PTSD Statement**
**File:** `src/pages/Landing.tsx`  
**Location:** After About PPN paragraphs (after line ~730)  
**Time:** 10 minutes  
**Complexity:** LOW  
**Impact:** HIGH

**Add:**
```tsx
{/* After About PPN paragraphs, add: */}
<div className="mt-8 p-6 bg-indigo-600/10 border-2 border-indigo-500/20 rounded-2xl">
  <div className="flex items-start gap-4">
    <div className="p-3 bg-indigo-500/20 rounded-xl">
      <span className="material-symbols-outlined text-2xl text-indigo-400">military_tech</span>
    </div>
    <div>
      <h4 className="text-lg font-black text-white mb-2">Supporting Our Veterans</h4>
      <p className="text-sm text-slate-300 leading-relaxed">
        We are committed to supporting <span className="text-gradient-primary font-bold inline-block">veterans with PTSD</span> through 
        evidence-based psychedelic therapy research. A portion of our network's de-identified data contributes to 
        VA-partnered studies on MDMA-assisted therapy and psilocybin for treatment-resistant PTSD.
      </p>
    </div>
  </div>
</div>
```

---

### **Task 2.6: Search Portal - Search Box Input Fixes**
**File:** `src/pages/SearchPortal.tsx`  
**Lines:** ~200-250 (search input)  
**Time:** 12 minutes  
**Complexity:** MEDIUM  
**Impact:** HIGH

**Replace search input section with:**
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

---

### **Task 2.7: Search Portal - Layout Spacing**
**File:** `src/pages/SearchPortal.tsx`  
**Time:** 5 minutes  
**Complexity:** LOW  
**Impact:** MEDIUM

**Find main layout grid, change:**
```tsx
// FROM:
<div className="grid grid-cols-[250px_1fr] gap-6">

// TO:
<div className="grid grid-cols-[280px_1fr] gap-12 max-w-[1600px] mx-auto px-6">
  <aside className="sticky top-24 h-fit">
    {/* Filters */}
  </aside>
  <main>
    {/* Results */}
  </main>
</div>
```

---

### **Task 2.8: Molecule Background Consistency**
**Files:** 
- `src/pages/SearchPortal.tsx` (substance cards)
- `src/pages/SubstanceMonograph.tsx` (if needed)

**Time:** 5 minutes  
**Complexity:** LOW  
**Impact:** MEDIUM

**Find molecule image containers, wrap with:**
```tsx
<div className="w-full h-full bg-black/80 rounded-full p-4 flex items-center justify-center">
  <img src={`/molecules/${substance}.png`} className="w-full h-full object-contain" />
</div>
```

---

## 🎯 **PHASE 3: NAMING & CONSISTENCY (File Renames & Route Updates)**
**Time:** 45 minutes  
**Why Third:** Requires careful coordination of multiple files

### **Task 3.1: Rename Patient Galaxy/Constellation → Patient Outcomes Map**
**Files to Update:** 7 files  
**Time:** 20 minutes  
**Complexity:** MEDIUM  
**Impact:** HIGH

**Step 1: Rename File**
```bash
mv src/pages/deep-dives/PatientConstellationPage.tsx \
   src/pages/deep-dives/PatientOutcomesMapPage.tsx
```

**Step 2: Update Component Name (in renamed file)**
```tsx
// Change function name:
const PatientOutcomesMap: React.FC = () => {
  // ...
};
export default PatientOutcomesMap;
```

**Step 3: Update Page Title (line 25)**
```tsx
<h1 className="text-5xl font-black tracking-tighter mb-2">Patient Outcomes Map</h1>
```

**Step 4: Update Subheading (line 26-28)**
```tsx
<p className="text-slate-400 text-xl sm:text-2xl font-medium max-w-4xl leading-relaxed">
  See how patients respond to treatment. Each dot is one patient. Find patterns in who gets better and why.
</p>
```

**Step 5: Update Sidebar** (`src/components/Sidebar.tsx` line 69)
```tsx
{ label: "Patient Outcomes Map", icon: "hub", path: "/deep-dives/patient-outcomes-map" }
```

**Step 6: Update Component Heading** (`src/components/analytics/PatientConstellation.tsx` line 248)
```tsx
<h3 className="text-lg font-black text-white tracking-tight">Outcomes Analysis</h3>
```

**Step 7: Update Analytics Page** (`src/pages/Analytics.tsx` line 120)
```tsx
Patient Outcomes Map
```

**Step 8: Update Dashboard Card** (`src/pages/Dashboard.tsx` line ~116)
```tsx
title="Patient Outcomes Map"
```

**Step 9: Update Route** (`src/App.tsx`)
```tsx
// Find and update:
<Route path="/deep-dives/patient-outcomes-map" element={<PatientOutcomesMapPage />} />

// Update import:
import PatientOutcomesMapPage from './pages/deep-dives/PatientOutcomesMapPage';
```

---

### **Task 3.2: Rename Pharmacology Lab → Molecular Pharmacology**
**Files to Update:** 2 files  
**Time:** 5 minutes  
**Complexity:** LOW  
**Impact:** LOW

**Step 1: Update Sidebar** (`src/components/Sidebar.tsx`)
```tsx
{ label: "Molecular Pharmacology", icon: "biotech", path: "/deep-dives/molecular-pharmacology" }
```

**Step 2: Update Dashboard Card** (`src/pages/Dashboard.tsx`)
```tsx
title="Molecular Pharmacology"
```

---

## 🎯 **PHASE 4: DEEP DIVE PAGES (Layout Standardization)**
**Time:** 90 minutes  
**Why Fourth:** Repetitive changes across multiple files

### **Task 4.1: Create Shared Deep Dive Layout Template**
**File:** `src/components/layouts/DeepDiveLayout.tsx` (NEW)  
**Time:** 20 minutes  
**Complexity:** MEDIUM  
**Impact:** HIGH

**Code:**
```tsx
import React, { ReactNode } from 'react';
import { PageContainer } from './PageContainer';
import { Section } from './Section';
import ConnectFeedButton from '../ui/ConnectFeedButton';

interface DeepDiveLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  headerAction?: ReactNode;
}

export const DeepDiveLayout: React.FC<DeepDiveLayoutProps> = ({
  title,
  description,
  children,
  headerAction
}) => {
  return (
    <div className="min-h-screen bg-[#05070a] text-white flex flex-col">
      {/* Page Header */}
      <div className="border-b border-slate-900 bg-[#0B0E14] w-full">
        <PageContainer width="wide" className="py-8 sm:py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-5xl sm:text-6xl font-black tracking-tighter text-white mb-2">
                {title}
              </h1>
              <p className="text-slate-300 text-lg sm:text-xl font-medium max-w-5xl leading-relaxed">
                {description}
              </p>
            </div>
            <div>
              {headerAction || <ConnectFeedButton />}
            </div>
          </div>
        </PageContainer>
      </div>

      {/* Content Area */}
      <PageContainer width="wide" className="flex-1 py-10">
        <Section spacing="spacious">
          {children}
        </Section>
      </PageContainer>
    </div>
  );
};
```

---

### **Task 4.2: Update Deep Dive Pages to Use DeepDiveLayout**
**Files:** 5 files  
**Time:** 50 minutes (10 min each)  
**Complexity:** MEDIUM  
**Impact:** HIGH

**Pages to Update:**
1. `src/pages/deep-dives/PatientOutcomesMapPage.tsx`
2. `src/pages/deep-dives/MolecularPharmacologyPage.tsx`
3. `src/pages/deep-dives/ProtocolEfficiencyPage.tsx`
4. `src/pages/deep-dives/ClinicPerformancePage.tsx`
5. `src/pages/deep-dives/SafetySurveillancePage.tsx`

**Template for Each:**
```tsx
import React from 'react';
import { DeepDiveLayout } from '../../components/layouts/DeepDiveLayout';
import [ComponentName] from '../../components/analytics/[ComponentName]';

const [PageName]: React.FC = () => {
  return (
    <DeepDiveLayout
      title="[Page Title]"
      description="[Simplified 9th grade description]"
    >
      <div className="mt-8">
        <[ComponentName] />
      </div>
    </DeepDiveLayout>
  );
};

export default [PageName];
```

**Simplified Descriptions (9th Grade Reading Level):**

```tsx
// Patient Outcomes Map
description="See how patients respond to treatment. Each dot is one patient. Find patterns in who gets better and why."

// Molecular Pharmacology
description="Learn how psychedelic drugs work in the brain. See which receptors they bind to and what effects they cause."

// Protocol Efficiency
description="Compare treatment costs and results. Find which protocols give the best outcomes for your budget."

// Clinic Performance
description="See how your clinic compares to others. Track patient retention, safety scores, and treatment success."

// Safety Surveillance
description="Monitor adverse events in real-time. Get alerts when safety patterns emerge across the network."
```

---

### **Task 4.3: Update Dashboard Layout Spacing**
**File:** `src/pages/Dashboard.tsx`  
**Line:** 95  
**Time:** 3 minutes  
**Complexity:** LOW  
**Impact:** LOW

**Change:**
```tsx
// FROM:
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// TO:
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1800px] mx-auto">
```

---

## 🎯 **PHASE 5: SUBSTANCE MONOGRAPH (Complex Layout Refactor)**
**Time:** 120 minutes  
**Why Fifth:** Most complex changes, requires careful testing

### **Task 5.1: Restructure Hero Section (Horizontal Layout)**
**File:** `src/pages/SubstanceMonograph.tsx`  
**Lines:** 148-231  
**Time:** 45 minutes  
**Complexity:** HIGH  
**Impact:** HIGH

**Replace entire hero section with:**
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

---

### **Task 5.2: Add Tooltips to Containers**
**File:** `src/pages/SubstanceMonograph.tsx`  
**Time:** 30 minutes  
**Complexity:** MEDIUM  
**Impact:** HIGH

**Step 1: Import InfoTooltip**
```tsx
import { InfoTooltip } from '../components/ui/InfoTooltip';
```

**Step 2: Define Tooltip Content**
```tsx
const TOOLTIPS = {
  registry: "Basic pharmacological properties including molecular weight, chemical formula, drug classification, and pharmacokinetic parameters.",
  affinity: "Receptor binding affinity (Ki values) showing how strongly this substance binds to different brain receptors. Higher values indicate stronger binding.",
  clinicalVelocity: "Historical efficacy trend showing how confidence in this substance's therapeutic benefit has evolved through clinical trials and real-world evidence. Upward trends indicate growing evidence base.",
  neuralSynthesis: "AI-powered analysis that searches recent clinical literature (2024-2025) to synthesize the latest research findings, regulatory changes, and breakthrough discoveries.",
  clinicalArchive: "Authorized institutional uploads including protocol documents, safety reports, and outcome data from verified clinical sites."
};
```

**Step 3: Add Tooltips to Each Container**
```tsx
// Registry (line 243):
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

// Affinity (line 275):
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

// Clinical Velocity (line 300):
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

// Neural Synthesis (line 338):
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

// Clinical Archive (line 380):
<div className="flex items-center justify-between mb-6">
  <div className="space-y-1">
    <h3 className="text-[13px] font-black text-slate-200 tracking-[0.2em] uppercase">Clinical Archive</h3>
    <p className="text-[11px] text-slate-600 font-black uppercase tracking-widest">Authorized Site Uploads</p>
  </div>
  <InfoTooltip content={TOOLTIPS.clinicalArchive} position="left" />
</div>
```

---

### **Task 5.3: Fix Container Heights**
**File:** `src/pages/SubstanceMonograph.tsx`  
**Time:** 5 minutes  
**Complexity:** LOW  
**Impact:** MEDIUM

**Changes:**
```tsx
// Line 242 (Registry) - Add explicit height:
<section className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-6 backdrop-blur-3xl shadow-2xl h-[420px] flex flex-col group/registry">

// Line 274 (Affinity) - Already has h-[420px] ✅

// Line 334 (Neural Synthesis) - Add height:
<section className="bg-indigo-600/5 border border-indigo-500/20 rounded-[2.5rem] p-8 shadow-2xl h-[420px] flex flex-col group/synthesis relative overflow-hidden">
```

---

### **Task 5.4: Fix Spider Graph Text Size**
**File:** `src/pages/SubstanceMonograph.tsx`  
**Line:** 288  
**Time:** 3 minutes  
**Complexity:** LOW  
**Impact:** HIGH

**Change:**
```tsx
// FROM:
<PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 10, fontWeight: 900 }} />

// TO:
<PolarAngleAxis dataKey="subject" tick={{ fill: '#cbd5e1', fontSize: 12, fontWeight: 900 }} />
```

---

## 🎯 **PHASE 6: TESTING & VALIDATION**
**Time:** 60 minutes  
**Why Last:** Verify everything works together

### **Task 6.1: Visual Regression Testing**
**Time:** 20 minutes

**Checklist:**
- [ ] Landing page: CTA buttons same size, blue primary button
- [ ] Landing page: Molecule floats smoothly (8s, larger range)
- [ ] Landing page: Gradients on 5 keywords, no clipping
- [ ] Landing page: Veterans PTSD statement visible
- [ ] Search Portal: Text visible in search box, AI icon visible
- [ ] Search Portal: Filters closer to results (gap-12)
- [ ] Search Portal: Molecules have black backgrounds
- [ ] Deep Dive pages: All same width (wide)
- [ ] Deep Dive pages: Subheadings larger, simpler copy
- [ ] Dashboard: Cards have more spacing (gap-8)
- [ ] Substance Monograph: Hero horizontal (text-molecule-efficacy)
- [ ] Substance Monograph: All containers 420px tall
- [ ] Substance Monograph: Spider graph text readable (12px)
- [ ] Substance Monograph: All 5 tooltips work

---

### **Task 6.2: Accessibility Testing**
**Time:** 15 minutes

**Checklist:**
- [ ] No text smaller than 11px anywhere
- [ ] All tooltips keyboard accessible
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Gradients don't clip (inline-block on all)
- [ ] Zoom to 150% - all text still readable

---

### **Task 6.3: Responsive Testing**
**Time:** 15 minutes

**Breakpoints to Test:**
- [ ] Mobile (375px): All layouts stack properly
- [ ] Tablet (768px): Grids adjust correctly
- [ ] Desktop (1920px): Content doesn't over-stretch
- [ ] Ultra-wide (2560px): Max-width constraints work

---

### **Task 6.4: Route & Navigation Testing**
**Time:** 10 minutes

**Checklist:**
- [ ] "Patient Outcomes Map" link works in Sidebar
- [ ] "Patient Outcomes Map" link works in Dashboard
- [ ] "Patient Outcomes Map" link works in Analytics
- [ ] "Molecular Pharmacology" link works in Sidebar
- [ ] "Molecular Pharmacology" link works in Dashboard
- [ ] No 404 errors on any renamed routes

---

## 📊 **IMPLEMENTATION SUMMARY**

### **By Phase:**
| Phase | Tasks | Time | Complexity | Impact |
|-------|-------|------|------------|--------|
| 1. Foundation | 2 | 30 min | LOW | HIGH |
| 2. Quick Wins | 8 | 60 min | LOW-MED | HIGH |
| 3. Naming | 2 | 45 min | MEDIUM | HIGH |
| 4. Deep Dives | 3 | 90 min | MEDIUM | HIGH |
| 5. Monograph | 4 | 120 min | HIGH | HIGH |
| 6. Testing | 4 | 60 min | LOW | CRITICAL |
| **TOTAL** | **23** | **6-7 hrs** | **VARIED** | **HIGH** |

---

### **By File:**
| File | Tasks | Time |
|------|-------|------|
| InfoTooltip.tsx (NEW) | 1 | 15 min |
| DeepDiveLayout.tsx (NEW) | 1 | 20 min |
| Landing.tsx | 5 | 38 min |
| SearchPortal.tsx | 3 | 22 min |
| SubstanceMonograph.tsx | 4 | 83 min |
| PatientOutcomesMapPage.tsx | 2 | 30 min |
| MolecularPharmacologyPage.tsx | 1 | 10 min |
| ProtocolEfficiencyPage.tsx | 1 | 10 min |
| ClinicPerformancePage.tsx | 1 | 10 min |
| SafetySurveillancePage.tsx | 1 | 10 min |
| Dashboard.tsx | 2 | 8 min |
| Sidebar.tsx | 2 | 5 min |
| Analytics.tsx | 1 | 2 min |
| App.tsx | 1 | 5 min |
| PatientConstellation.tsx | 1 | 2 min |
| **TOTAL** | **27** | **270 min** |

---

## 🚨 **CRITICAL NOTES FOR BUILDER**

### **Order Matters:**
1. ✅ **Create components FIRST** (Phase 1) - Other tasks depend on them
2. ✅ **Quick wins SECOND** (Phase 2) - Low risk, immediate feedback
3. ✅ **Renames THIRD** (Phase 3) - Requires coordination across files
4. ✅ **Deep dives FOURTH** (Phase 4) - Repetitive but straightforward
5. ✅ **Monograph FIFTH** (Phase 5) - Most complex, needs focus
6. ✅ **Test LAST** (Phase 6) - Verify everything works together

### **Common Pitfalls:**
- ❌ Don't skip Phase 1 (components must exist first)
- ❌ Don't rename files before updating routes (causes 404s)
- ❌ Don't forget `inline-block` on gradients (causes clipping)
- ❌ Don't use text smaller than 11px (accessibility violation)
- ❌ Don't skip testing (catch issues early)

### **Success Criteria:**
- ✅ All pages load without errors
- ✅ All routes work (no 404s)
- ✅ All text readable (min 11px)
- ✅ All tooltips functional
- ✅ All layouts responsive
- ✅ All naming consistent

---

## 📝 **BUILDER CHECKLIST**

Print this and check off as you go:

```
PHASE 1: FOUNDATION
[ ] Create InfoTooltip.tsx
[ ] Verify GravityButton exists
[ ] Verify BentoGrid exists

PHASE 2: QUICK WINS
[ ] Landing - CTA button styling
[ ] Landing - Problem/Solution heading size
[ ] Landing - Molecule animation
[ ] Landing - Gradient keywords (5 locations)
[ ] Landing - Veterans PTSD statement
[ ] Search Portal - Search box fixes
[ ] Search Portal - Layout spacing
[ ] Search Portal - Molecule backgrounds

PHASE 3: NAMING
[ ] Rename Patient Constellation → Outcomes Map (9 files)
[ ] Rename Pharmacology Lab → Molecular Pharmacology (2 files)

PHASE 4: DEEP DIVES
[ ] Create DeepDiveLayout.tsx
[ ] Update PatientOutcomesMapPage
[ ] Update MolecularPharmacologyPage
[ ] Update ProtocolEfficiencyPage
[ ] Update ClinicPerformancePage
[ ] Update SafetySurveillancePage
[ ] Update Dashboard spacing

PHASE 5: MONOGRAPH
[ ] Restructure hero section (horizontal)
[ ] Add tooltips (5 containers)
[ ] Fix container heights (3 containers)
[ ] Fix spider graph text size

PHASE 6: TESTING
[ ] Visual regression (14 items)
[ ] Accessibility (5 items)
[ ] Responsive (4 breakpoints)
[ ] Routes & navigation (6 items)
```

---

**READY TO BUILD! 🚀**

All tasks are organized, dependencies are clear, and success criteria are defined. Follow the phases in order for the smoothest implementation.
