# 🎨 DASHBOARD & DEEP DIVE PAGES LAYOUT IMPROVEMENTS
**Date:** 2026-02-09 14:30 PST  
**Priority:** MEDIUM (Post-Presentation, Week 1)  
**Estimated Time:** 2-3 hours

---

## 📋 **ISSUES IDENTIFIED**

### **1. Dashboard Page - Crowded Layout** 🟡
**Location:** `src/pages/Dashboard.tsx`

**Current State:**
- Uses `PageContainer` with default width
- 3-column grid on desktop (lg:grid-cols-3)
- Cards feel cramped
- Less breathing room than other pages

**User Feedback:**
> "The layout on this page is crowded compared to the other pages and I think it could be improved."

---

### **2. Deep Dive Pages - Inconsistent Widths** 🔴 CRITICAL
**Location:** All files in `src/pages/deep-dives/`

**Current State:**
- **Regulatory Map:** Uses `width="wide"` (correct, looks best) ✅
- **Patient Constellation:** Uses default width (too narrow) ❌
- **Molecular Pharmacology:** Uses default width (too narrow) ❌
- **Protocol Efficiency:** Uses default width (too narrow) ❌
- **Clinic Performance:** Uses default width (too narrow) ❌

**User Feedback:**
> "The regulatory map is dynamic so it resizes, so I think that's actually the best layout of the five. Expanding the layout of the other intelligence pages would give us more room to work with and potentially even get rid of the double scrolls."

---

### **3. Subheading Width & Readability** 🟡
**Location:** All deep dive pages (lines ~20-28)

**Current Issues:**
1. **Width:** Subheading uses `max-w-4xl` (only takes up portion of page width)
2. **Size:** Text is `text-xl sm:text-2xl` (too small for 27" monitor)
3. **Readability:** Copy needs to be simplified to 9th grade reading level

**User Feedback:**
> "On all five intelligence pages the subheading only takes up a portion of the width of the page. It looks a little indecisive. Either way, I would like to enlarge the size of that text, analyze the copy to make sure it's simple, understandable, and repeatable by anyone who reads it who has a ninth grade reading level or higher."

---

### **4. Patient Constellation Naming** 🔴 CRITICAL
**Location:** Multiple files

**Current Inconsistencies:**
- **Sidebar:** "Patient Galaxy" (`src/components/Sidebar.tsx` line 69)
- **Page Heading:** "Patient Constellation" (`src/pages/deep-dives/PatientConstellationPage.tsx` line 25)
- **Component Heading:** "Patient Galaxy Analysis" (`src/components/analytics/PatientConstellation.tsx` line 248)
- **Analytics Page:** "Patient Galaxy" (`src/pages/Analytics.tsx` line 120)

**User Feedback:**
> "The menu item says patient galaxy, as does the heading inside the component. I don't really like either of these names, because they are not medical terms."

**DECISION NEEDED:** What should the name be?
- ❌ "Patient Galaxy" (not medical)
- ❌ "Patient Constellation" (not medical)
- ✅ **RECOMMENDED:** "Patient Outcomes Map" or "Treatment Response Patterns"

---

### **5. Patient Constellation Text Size** 🔴 CRITICAL
**Location:** `src/components/analytics/PatientConstellation.tsx`

**User Feedback:**
> "Inside the component, the text is too small to read, so I have no idea what it says unless I zoom in my screen to 150%, and I'm on a 27 inch monitor."

**ACCESSIBILITY VIOLATION:** Text below 11px minimum

---

### **6. Molecular Pharmacology Naming Mismatch** 🟡
**Location:** Sidebar vs Page

**Current State:**
- **Sidebar:** "Pharmacology Lab" (`src/components/Sidebar.tsx`)
- **Page Heading:** "Molecular Pharmacology" (`src/pages/deep-dives/MolecularPharmacologyPage.tsx` line 12)

**User Feedback:**
> "Molecular pharmacology (doesn't match the sidebar name)"

**DECISION:** Should be consistent. Recommend "Molecular Pharmacology" everywhere (more professional).

---

## 🎯 **IMPLEMENTATION PLAN**

### **PHASE 1: Layout Standardization** (45 minutes)

#### **Task 1.1: Standardize Deep Dive Page Width**
**Apply to ALL deep dive pages:**

```tsx
// BEFORE (most pages):
<PageContainer className="py-8">
  <Section>
    {/* Content */}
  </Section>
</PageContainer>

// AFTER (match Regulatory Map):
<div className="min-h-screen bg-[#05070a] text-white flex flex-col">
  {/* Page Header */}
  <div className="border-b border-slate-900 bg-[#0B0E14] w-full">
    <PageContainer width="wide" className="py-8 sm:py-12">
      {/* Header content */}
    </PageContainer>
  </div>

  {/* Content Area */}
  <PageContainer width="wide" className="flex-1 py-10">
    <Section spacing="spacious">
      {/* Main content */}
    </Section>
  </PageContainer>
</div>
```

**Files to Update:**
1. `src/pages/deep-dives/PatientConstellationPage.tsx`
2. `src/pages/deep-dives/MolecularPharmacologyPage.tsx`
3. `src/pages/deep-dives/ProtocolEfficiencyPage.tsx`
4. `src/pages/deep-dives/ClinicPerformancePage.tsx`
5. `src/pages/deep-dives/SafetySurveillancePage.tsx` (if not already wide)

**Effect:**
- ✅ Consistent width across all deep dive pages
- ✅ Matches Regulatory Map (the "best layout")
- ✅ Eliminates double scrolls
- ✅ More room for content

---

#### **Task 1.2: Improve Dashboard Layout**
**Location:** `src/pages/Dashboard.tsx` line 95

```tsx
// BEFORE:
<Section className="flex-1 mt-8">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {/* InsightCards */}
  </div>
</Section>

// AFTER:
<Section className="flex-1 mt-8">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1800px] mx-auto">
    {/* InsightCards */}
  </div>
</Section>
```

**Changes:**
- Increase gap from `gap-6` to `gap-8` (more breathing room)
- Add `max-w-[1800px] mx-auto` (prevent over-stretching on ultra-wide monitors)

---

### **PHASE 2: Subheading Improvements** (30 minutes)

#### **Task 2.1: Increase Subheading Size & Width**
**Apply to ALL deep dive pages:**

```tsx
// BEFORE:
<p className="text-slate-400 text-xl sm:text-2xl font-medium max-w-4xl leading-relaxed">
  {/* Description */}
</p>

// AFTER:
<p className="text-slate-300 text-lg sm:text-xl font-medium max-w-5xl leading-relaxed">
  {/* Simplified description */}
</p>
```

**Changes:**
- Reduce size: `text-xl sm:text-2xl` → `text-lg sm:text-xl` (more readable at distance)
- Increase width: `max-w-4xl` → `max-w-5xl` (uses more of available space)
- Lighten color: `text-slate-400` → `text-slate-300` (better contrast)

---

#### **Task 2.2: Simplify Subheading Copy (9th Grade Reading Level)**

**Current vs Simplified:**

| Page | Current Copy | Simplified Copy (9th Grade) |
|------|--------------|----------------------------|
| **Regulatory Map** | "This map shows the current legal status of psychedelic substances across different regions. It tracks approval phases and policy changes to help you navigate the regulatory landscape." | "See which psychedelic treatments are legal in each state. Track approval status and policy changes." |
| **Patient Constellation** | "This chart maps patient outcomes based on their treatment resistance and symptom severity. Each dot represents a patient, allowing you to see patterns in how different people respond to treatments." | "See how patients respond to treatment. Each dot is one patient. Find patterns in who gets better and why." |
| **Molecular Pharmacology** | "This section details the chemical structure and biological effects of substances. It explains how molecules interact with the brain's receptors to produce therapeutic effects." | "Learn how psychedelic drugs work in the brain. See which receptors they bind to and what effects they cause." |
| **Protocol Efficiency** | (Need to see current) | "Compare treatment costs and results. Find which protocols give the best outcomes for your budget." |
| **Clinic Performance** | (Need to see current) | "See how your clinic compares to others. Track patient retention, safety scores, and treatment success." |

**Readability Tools Used:**
- Hemingway Editor (Grade 9 target)
- Short sentences (15 words or less)
- Active voice
- Common words (no jargon)

---

### **PHASE 3: Naming Consistency** (20 minutes)

#### **Task 3.1: Rename "Patient Galaxy/Constellation"**

**RECOMMENDATION:** "Patient Outcomes Map"

**Rationale:**
- ✅ Medical/clinical term
- ✅ Describes what it shows (outcomes)
- ✅ Clear purpose (mapping)
- ✅ Professional

**Files to Update:**

```tsx
// 1. Sidebar (src/components/Sidebar.tsx line 69):
BEFORE: { label: "Patient Galaxy", icon: "hub", path: "/deep-dives/patient-constellation" }
AFTER:  { label: "Patient Outcomes Map", icon: "hub", path: "/deep-dives/patient-outcomes-map" }

// 2. Page Title (src/pages/deep-dives/PatientConstellationPage.tsx line 25):
BEFORE: <h1>Patient Constellation</h1>
AFTER:  <h1>Patient Outcomes Map</h1>

// 3. Component Heading (src/components/analytics/PatientConstellation.tsx line 248):
BEFORE: <h3>Patient Galaxy Analysis</h3>
AFTER:  <h3>Outcomes Analysis</h3>

// 4. Analytics Page (src/pages/Analytics.tsx line 120):
BEFORE: Patient Galaxy
AFTER:  Patient Outcomes Map

// 5. Dashboard Card (src/pages/Dashboard.tsx line 116):
BEFORE: title="Patient Constellation"
AFTER:  title="Patient Outcomes Map"
```

**File Rename:**
```bash
mv src/pages/deep-dives/PatientConstellationPage.tsx \
   src/pages/deep-dives/PatientOutcomesMapPage.tsx
```

**Route Update (src/App.tsx):**
```tsx
BEFORE: <Route path="/deep-dives/patient-constellation" element={<PatientConstellationPage />} />
AFTER:  <Route path="/deep-dives/patient-outcomes-map" element={<PatientOutcomesMapPage />} />
```

---

#### **Task 3.2: Rename "Pharmacology Lab" → "Molecular Pharmacology"**

**Files to Update:**

```tsx
// Sidebar (src/components/Sidebar.tsx):
BEFORE: { label: "Pharmacology Lab", icon: "biotech", path: "/deep-dives/molecular-pharmacology" }
AFTER:  { label: "Molecular Pharmacology", icon: "biotech", path: "/deep-dives/molecular-pharmacology" }

// Dashboard Card (src/pages/Dashboard.tsx):
BEFORE: title="Pharmacology Lab"
AFTER:  title="Molecular Pharmacology"
```

---

### **PHASE 4: Text Size Accessibility** (45 minutes)

#### **Task 4.1: Audit Patient Outcomes Map Component**
**Location:** `src/components/analytics/PatientConstellation.tsx`

**Find and fix ALL text below 11px:**

```tsx
// BEFORE (example violations):
className="text-[9px]"  // ❌ TOO SMALL
className="text-[10px]" // ❌ TOO SMALL

// AFTER:
className="text-[11px]"  // ✅ MINIMUM
className="text-xs"      // ✅ 12px
```

**Specific Areas to Check:**
1. Chart axis labels
2. Legend text
3. Tooltip text
4. Table cell text
5. Badge text

**Testing:**
- View on 27" monitor at 100% zoom
- Text should be readable from 24" distance
- If not readable, increase to `text-sm` (14px)

---

## 📦 **BUILDER INSTRUCTIONS**

### **Implementation Order:**

**CRITICAL (Do First - 60 minutes):**
1. ✅ Standardize deep dive page widths (Task 1.1)
2. ✅ Rename Patient Galaxy/Constellation → Patient Outcomes Map (Task 3.1)
3. ✅ Fix text size violations in Patient Outcomes Map component (Task 4.1)

**HIGH (Do Second - 45 minutes):**
4. ✅ Improve subheading size & width (Task 2.1)
5. ✅ Simplify subheading copy (Task 2.2)
6. ✅ Rename Pharmacology Lab → Molecular Pharmacology (Task 3.2)

**MEDIUM (Do Third - 15 minutes):**
7. ✅ Improve Dashboard layout spacing (Task 1.2)

---

## 🧪 **TESTING CHECKLIST**

### **Layout Tests:**
- [ ] All deep dive pages have same width (match Regulatory Map)
- [ ] No double scrollbars on any deep dive page
- [ ] Dashboard cards have more breathing room
- [ ] Content doesn't stretch too wide on ultra-wide monitors

### **Text Tests:**
- [ ] All subheadings readable from 24" distance on 27" monitor
- [ ] All subheadings use max-w-5xl (wider than before)
- [ ] All copy is 9th grade reading level (Hemingway test)
- [ ] No text smaller than 11px anywhere

### **Naming Tests:**
- [ ] "Patient Outcomes Map" appears in:
  - Sidebar
  - Page title
  - Component heading
  - Analytics page
  - Dashboard card
- [ ] "Molecular Pharmacology" appears in:
  - Sidebar
  - Dashboard card
  - Page title (already correct)
- [ ] All routes work (no 404s after renames)

### **Accessibility Tests:**
- [ ] Zoom to 150% - all text still readable
- [ ] Color contrast meets WCAG AA (4.5:1 minimum)
- [ ] No font size violations (min 11px)

---

## 📊 **BEFORE/AFTER COMPARISON**

### **Deep Dive Pages:**

**BEFORE:**
```
┌────────────────────────────────────────────┐
│  [Narrow Container]                        │
│  ┌──────────────────────────────────┐      │
│  │  Content (cramped)               │      │
│  │  [Horizontal scroll if wide]     │      │
│  └──────────────────────────────────┘      │
│                                            │
└────────────────────────────────────────────┘
```

**AFTER:**
```
┌────────────────────────────────────────────────────────────┐
│  [Wide Container - Full Width]                             │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Content (spacious, no horizontal scroll)          │    │
│  │                                                     │    │
│  └────────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────┘
```

---

### **Subheadings:**

**BEFORE:**
```
┌────────────────────────────────────────────────────────────┐
│  Molecular Pharmacology                                    │
│  ┌──────────────────────────────────────┐                  │
│  │ This section details the chemical    │ [Too narrow]     │
│  │ structure and biological effects...  │ [Too complex]    │
│  └──────────────────────────────────────┘ [Too small]      │
└────────────────────────────────────────────────────────────┘
```

**AFTER:**
```
┌────────────────────────────────────────────────────────────┐
│  Molecular Pharmacology                                    │
│  ┌──────────────────────────────────────────────────┐      │
│  │ Learn how psychedelic drugs work in the brain.  │      │
│  │ See which receptors they bind to and what       │      │
│  │ effects they cause.                             │      │
│  └──────────────────────────────────────────────────┘      │
│  [Wider] [Simpler] [Larger]                                │
└────────────────────────────────────────────────────────────┘
```

---

## 🚨 **PRESERVATION RULES**

⚠️ **DO NOT CHANGE:**
- Regulatory Map layout (it's already correct)
- Component functionality (only fix text sizes)
- Color schemes
- Icon choices

⚠️ **ONLY MODIFY:**
- Page container widths
- Subheading text & styling
- Component/page names
- Text sizes (increase only, never decrease)

---

## 📝 **SIMPLIFIED COPY REFERENCE**

Use these exact descriptions (9th grade reading level):

```tsx
// Regulatory Map
"See which psychedelic treatments are legal in each state. Track approval status and policy changes."

// Patient Outcomes Map
"See how patients respond to treatment. Each dot is one patient. Find patterns in who gets better and why."

// Molecular Pharmacology
"Learn how psychedelic drugs work in the brain. See which receptors they bind to and what effects they cause."

// Protocol Efficiency
"Compare treatment costs and results. Find which protocols give the best outcomes for your budget."

// Clinic Performance
"See how your clinic compares to others. Track patient retention, safety scores, and treatment success."

// Safety Surveillance
"Monitor adverse events in real-time. Get alerts when safety patterns emerge across the network."
```

---

**Total Estimated Time:** 2-3 hours  
**Priority:** Week 1 Post-Presentation  
**Impact:** HIGH (improves usability across 5+ pages)

---

📝 **UPDATE FOR `_agent_status.md`**

## 3. BUILDER QUEUE (Post-Presentation, Week 1)

**Dashboard & Deep Dive Layout Improvements:**
- [ ] Standardize all deep dive pages to `width="wide"` (match Regulatory Map)
- [ ] Rename "Patient Galaxy/Constellation" → "Patient Outcomes Map" (all files)
- [ ] Rename "Pharmacology Lab" → "Molecular Pharmacology" (Sidebar + Dashboard)
- [ ] Increase subheading size & width (text-lg sm:text-xl, max-w-5xl)
- [ ] Simplify all subheading copy (9th grade reading level)
- [ ] Fix text size violations in Patient Outcomes Map component (min 11px)
- [ ] Improve Dashboard spacing (gap-8, max-w-[1800px])
