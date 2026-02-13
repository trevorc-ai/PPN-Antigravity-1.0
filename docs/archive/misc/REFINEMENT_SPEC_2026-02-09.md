# 🎨 LANDING PAGE & PORTAL REFINEMENTS
**Date:** 2026-02-09 14:22 PST  
**Priority:** HIGH (Pre-Presentation Polish)  
**Estimated Time:** 45-60 minutes

---

## 📋 **LANDING PAGE REFINEMENTS**

### **1. CTA Button Styling** 🔴 CRITICAL
**Location:** `src/pages/Landing.tsx` lines ~194-209

**Current State:**
- "Access Portal" button uses GravityButton (glassmorphic, different size)
- "Request Access" button is standard (slate background)
- Buttons are different sizes and styles

**Required Changes:**
```tsx
// BEFORE (lines 194-202):
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

**Effect:**
- Both buttons same size (px-8 py-5)
- "Access Portal" is blue (bg-primary)
- "Request Access" stays slate/secondary
- Consistent styling

---

### **2. Floating Molecule Animation** 🟡 MEDIUM
**Location:** `src/pages/Landing.tsx` lines ~240-280 (Ketamine molecule section)

**Current Issue:**
- Molecule bounces in tiny box
- Animation feels constrained

**Required Changes:**
```tsx
// Find the molecule animation section (around line 250)
// CURRENT animation probably looks like:
animate={{
  y: [0, -10, 0],
  x: [0, 5, 0],
}}
transition={{
  duration: 3,
  repeat: Infinity,
}}

// CHANGE TO (larger, slower movement):
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

**Effect:**
- Larger movement range (20px vertical, 15px horizontal)
- Slower animation (8 seconds vs 3 seconds)
- Adds subtle rotation (2 degrees)
- Feels more organic, less "bouncy box"

---

### **3. Problem/Solution Heading Size** 🟡 MEDIUM
**Location:** `src/pages/Landing.tsx` lines ~509, ~517

**Current State:**
```tsx
// Line 509 (Problem heading):
<h2 className="text-4xl sm:text-6xl font-black tracking-tighter leading-none">
  Generic Trials Fail <br /> Specific Patients.
</h2>

// Line 517 (Solution heading):
<h2 className="text-4xl sm:text-6xl font-black tracking-tighter leading-none">
  Structured Data. <br />Network Comparisons.
</h2>
```

**Required Changes:**
```tsx
// CHANGE BOTH TO (match other section headings):
<h2 className="text-3xl sm:text-5xl font-black tracking-tighter leading-none">
  Generic Trials Fail <br /> Specific Patients.
</h2>

<h2 className="text-3xl sm:text-5xl font-black tracking-tighter leading-none">
  Structured Data. <br />Network Comparisons.
</h2>
```

**Effect:**
- Reduces from text-6xl → text-5xl (desktop)
- Reduces from text-4xl → text-3xl (mobile)
- Matches "Clinical Intelligence Infrastructure" heading size

---

### **4. Clinical Intelligence Infrastructure Section** 🔴 CRITICAL DECISION

**Location:** `src/pages/Landing.tsx` lines 600-711 (Bento Box Features)

**User Request:**
> "Unless you have an idea for it that you want to implement right away. One idea I have was to put the interaction checker on this page."

**DESIGNER RECOMMENDATION:**

**OPTION A: Replace with Interaction Checker** ⭐ RECOMMENDED
- Free tool = lead magnet
- High value for practitioners
- Demonstrates platform capability
- Can be used without login

**Implementation:**
```tsx
{/* SECTION: Free Interaction Checker */}
<section className="py-32 px-6 relative z-10">
  <div className="max-w-7xl mx-auto space-y-12">
    <div className="text-center space-y-4">
      <h2 className="text-3xl sm:text-5xl font-black tracking-tighter">
        <span className="text-gradient-primary">Free</span> Drug Interaction Checker
      </h2>
      <p className="text-[12px] text-slate-500 font-black uppercase tracking-[0.4em]">
        Evidence-Based Safety Tool for Psychedelic Therapy
      </p>
    </div>

    {/* Embed InteractionChecker component here */}
    <div className="max-w-4xl mx-auto">
      <InteractionChecker standalone={true} />
    </div>

    <div className="text-center">
      <p className="text-sm text-slate-400 max-w-2xl mx-auto">
        This tool checks for known contraindications and drug-drug interactions based on peer-reviewed pharmacology data. 
        <span className="text-primary font-bold"> Sign up for full access</span> to safety surveillance, outcome tracking, and network benchmarks.
      </p>
    </div>
  </div>
</section>
```

**OPTION B: Keep Bento Grid, Add Visuals Later**
- Defer to post-presentation
- Focus on other refinements now

**DECISION NEEDED:** Which option? (Recommend Option A if InteractionChecker component exists)

---

### **5. Veterans PTSD Statement** 🟢 LOW (High Impact)

**Location:** `src/pages/Landing.tsx` - Add to About PPN section (after line 730)

**Required Addition:**
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
        We are committed to supporting <span className="text-gradient-primary font-bold">veterans with PTSD</span> through 
        evidence-based psychedelic therapy research. A portion of our network's de-identified data contributes to 
        VA-partnered studies on MDMA-assisted therapy and psilocybin for treatment-resistant PTSD.
      </p>
    </div>
  </div>
</div>
```

**Effect:**
- Prominent placement in About section
- Military badge icon (color-blind accessible)
- Gradient on "veterans with PTSD"
- Connects to research mission

---

### **6. Gradient Text on Keywords** 🟡 MEDIUM

**Location:** Throughout `src/pages/Landing.tsx`

**Current Gradients:**
- "Safety" (line 374) - already has gradient ✅
- "Portal" in footer - already has gradient ✅

**Add Gradients To:**

```tsx
// Line ~151 (Hero headline):
BEFORE: "Unified Clinical Registry for Psychedelic Medicine"
AFTER:  "Unified <span className='text-gradient-primary inline-block'>Clinical Registry</span> for Psychedelic Medicine"

// Line ~509 (Problem heading):
BEFORE: "Generic Trials Fail Specific Patients."
AFTER:  "<span className='text-gradient-primary inline-block'>Generic Trials</span> Fail Specific Patients."

// Line ~517 (Solution heading):
BEFORE: "Structured Data. Network Comparisons."
AFTER:  "<span className='text-gradient-primary inline-block'>Structured Data.</span> Network Comparisons."

// Line ~604 (Bento/Interaction Checker heading):
BEFORE: "Clinical Intelligence Infrastructure"
AFTER:  "Clinical <span className='text-gradient-primary inline-block'>Intelligence</span> Infrastructure"

// Line ~720 (About PPN heading):
BEFORE: "About PPN"
AFTER:  "About <span className='text-gradient-primary inline-block'>PPN</span>"
```

**Important:** Always add `inline-block` to prevent text clipping (learned from "Safety" bug)

---

## 📋 **RESEARCH PORTAL REFINEMENTS**

### **7. Molecule Background Consistency** 🟡 MEDIUM

**Issue:** Molecules have different backgrounds on different pages
- Substances page: black backgrounds (faint circle)
- Research portal: gray backgrounds

**Location:** 
- `src/pages/SearchPortal.tsx` (substance cards)
- `src/pages/SubstanceMonograph.tsx` (molecule display)

**Required Changes:**
```tsx
// Find molecule image containers in SearchPortal.tsx
// CURRENT (probably):
<img src={`/molecules/${substance}.png`} className="w-full h-full object-contain" />

// CHANGE TO:
<div className="w-full h-full bg-black/80 rounded-full p-4 flex items-center justify-center">
  <img src={`/molecules/${substance}.png`} className="w-full h-full object-contain" />
</div>
```

**Effect:**
- Consistent black circular backgrounds
- Matches Substances page aesthetic
- Better contrast for molecules

---

### **8. Search Box Input Issues** 🔴 CRITICAL

**Location:** `src/pages/SearchPortal.tsx` lines ~200-250 (search input)

**Issues:**
1. Entire box lights up on focus (should be subtle)
2. Typed text hides behind placeholder
3. AI sparkle icon not visible

**Current Code (approximate):**
```tsx
<input
  type="text"
  placeholder="Search protocols, adverse events, Ketamine + Neural Cognition..."
  className="w-full bg-slate-900/50 border-2 border-slate-700 focus:border-primary ..."
/>
```

**Required Changes:**
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

**Fixes:**
1. ✅ Subtle focus (border-primary/50, not full glow)
2. ✅ Text visible (proper z-index, no placeholder overlap)
3. ✅ AI sparkle visible (absolute positioned, z-10)
4. ✅ Proper padding (pl-12 for icon space)

---

### **9. Portal Layout Spacing** 🟡 MEDIUM

**Location:** `src/pages/SearchPortal.tsx` - Main layout grid

**Issue:** Filters hug sidebar, far from search results

**Current Layout (approximate):**
```tsx
<div className="grid grid-cols-[250px_1fr] gap-6">
  <aside>{/* Filters */}</aside>
  <main>{/* Results */}</main>
</div>
```

**Required Changes:**
```tsx
<div className="grid grid-cols-[280px_1fr] gap-12 max-w-[1600px] mx-auto px-6">
  <aside className="sticky top-24 h-fit">
    {/* Filters */}
  </aside>
  <main>
    {/* Results */}
  </main>
</div>
```

**Changes:**
- Wider sidebar (250px → 280px)
- Larger gap (gap-6 → gap-12)
- Max width container (1600px)
- Sticky filters (stays visible on scroll)

---

## 🎯 **IMPLEMENTATION PRIORITY**

### **CRITICAL (Do First - 20 minutes):**
1. ✅ CTA button styling (blue, same size)
2. ✅ Search box input fixes (text visibility, icon)
3. ✅ Problem/Solution heading size

### **HIGH (Do Second - 20 minutes):**
4. ✅ Gradient text on keywords
5. ✅ Veterans PTSD statement
6. ✅ Molecule background consistency

### **MEDIUM (Do Third - 15 minutes):**
7. ✅ Floating molecule animation
8. ✅ Portal layout spacing

### **DECISION NEEDED:**
9. ⏸️ Clinical Intelligence section - Replace with Interaction Checker? (Y/N)

---

## 📦 **BUILDER INSTRUCTIONS**

### **Files to Modify:**
1. `src/pages/Landing.tsx` (items 1-6)
2. `src/pages/SearchPortal.tsx` (items 7-9)
3. `src/pages/SubstanceMonograph.tsx` (item 7, if needed)

### **Components Needed:**
- `InteractionChecker` (if replacing Bento section)
- No new components otherwise

### **Testing Checklist:**
- [ ] Both CTA buttons same size and blue primary button visible
- [ ] Molecule floats smoothly (8s duration, larger range)
- [ ] Problem/Solution headings match other sections
- [ ] Gradients applied to all keywords (no clipping)
- [ ] Veterans PTSD statement visible in About section
- [ ] Search box: text visible, icon visible, subtle focus
- [ ] Molecules have black backgrounds on all pages
- [ ] Portal filters closer to results (gap-12)

---

## 🚨 **PRESERVATION RULES**

⚠️ **DO NOT CHANGE:**
- Hero eyebrow (already correct)
- Starry background (already correct)
- About PPN paragraphs (already correct)
- Logo slider z-index (already fixed)
- Any other sections not mentioned

⚠️ **ONLY MODIFY:**
- Items 1-9 listed above
- No other changes

---

**Estimated Total Time:** 55 minutes  
**Presentation in:** ~45 minutes  
**Recommendation:** Implement items 1-8 now, defer item 9 (Interaction Checker) to post-presentation

---

📝 **UPDATE FOR `_agent_status.md`**

## 3. BUILDER QUEUE (Pre-Presentation Polish)
- [ ] **Landing - CTA Button Styling** (blue, same size)
- [ ] **Landing - Molecule Animation** (larger range, slower)
- [ ] **Landing - Heading Sizes** (Problem/Solution to text-5xl)
- [ ] **Landing - Gradient Keywords** (5 locations)
- [ ] **Landing - Veterans PTSD Statement** (About section)
- [ ] **Portal - Search Box Fixes** (text visibility, icon, focus)
- [ ] **Portal - Molecule Backgrounds** (black circles)
- [ ] **Portal - Layout Spacing** (gap-12, max-width)
- [ ] **DECISION: Replace Bento with Interaction Checker?** (Y/N)
