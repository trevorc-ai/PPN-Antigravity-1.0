# 🚀 BATCH 3: NAMING & CONSISTENCY
**Time Estimate:** 45 minutes  
**Risk Level:** MEDIUM (route changes)  
**Files to Modify:** 6 files (1 rename)  
**Impact:** HIGH - Consistent naming across app

---

## 📋 **WHAT THIS BATCH DOES**

This batch fixes naming inconsistencies across the application:

✅ Renames "Patient Galaxy/Constellation" → "Patient Outcomes Map"  
✅ Renames "Pharmacology Lab" → "Molecular Pharmacology"  
✅ Updates all navigation links  
✅ Updates all routes  

---

## ⚠️ **CRITICAL: DO STEPS IN ORDER**

**This batch requires careful coordination. Follow steps exactly as written.**

---

## 🎯 **TASK LIST (2 MAIN TASKS, 11 STEPS)**

### **TASK 3.1: Rename Patient Galaxy/Constellation → Patient Outcomes Map**
**Files:** 6 files + 1 file rename  
**Time:** 35 minutes  
**Complexity:** MEDIUM

---

#### **STEP 1: Rename the File**
**Action:** Rename the page file

**OLD:** `src/pages/deep-dives/PatientConstellationPage.tsx`  
**NEW:** `src/pages/deep-dives/PatientOutcomesMapPage.tsx`

**Command (if using terminal):**
```bash
mv src/pages/deep-dives/PatientConstellationPage.tsx \
   src/pages/deep-dives/PatientOutcomesMapPage.tsx
```

---

#### **STEP 2: Update Component Name in Renamed File**
**File:** `src/pages/deep-dives/PatientOutcomesMapPage.tsx` (the file you just renamed)  
**Time:** 2 minutes

**BEFORE:**
```tsx
const PatientConstellation: React.FC = () => {
  // ...
};

export default PatientConstellation;
```

**AFTER:**
```tsx
const PatientOutcomesMap: React.FC = () => {
  // ...
};

export default PatientOutcomesMap;
```

---

#### **STEP 3: Update Page Title**
**File:** `src/pages/deep-dives/PatientOutcomesMapPage.tsx`  
**Line:** ~25

**BEFORE:**
```tsx
<h1 className="text-5xl font-black tracking-tighter mb-2">Patient Constellation</h1>
```

**AFTER:**
```tsx
<h1 className="text-5xl font-black tracking-tighter mb-2">Patient Outcomes Map</h1>
```

---

#### **STEP 4: Update Page Subheading**
**File:** `src/pages/deep-dives/PatientOutcomesMapPage.tsx`  
**Lines:** ~26-28

**BEFORE:**
```tsx
<p className="text-slate-400 text-xl sm:text-2xl font-medium max-w-4xl leading-relaxed">
  This chart maps patient outcomes based on their treatment resistance and symptom severity. Each dot represents a patient, allowing you to see patterns in how different people respond to treatments.
</p>
```

**AFTER:**
```tsx
<p className="text-slate-400 text-xl sm:text-2xl font-medium max-w-4xl leading-relaxed">
  See how patients respond to treatment. Each dot is one patient. Find patterns in who gets better and why.
</p>
```

---

#### **STEP 5: Update Sidebar**
**File:** `src/components/Sidebar.tsx`  
**Line:** ~69

**BEFORE:**
```tsx
{ label: "Patient Galaxy", icon: "hub", path: "/deep-dives/patient-constellation" }
```

**AFTER:**
```tsx
{ label: "Patient Outcomes Map", icon: "hub", path: "/deep-dives/patient-outcomes-map" }
```

---

#### **STEP 6: Update Component Heading**
**File:** `src/components/analytics/PatientConstellation.tsx`  
**Line:** ~248

**BEFORE:**
```tsx
<h3 className="text-lg font-black text-white tracking-tight">Patient Galaxy Analysis</h3>
```

**AFTER:**
```tsx
<h3 className="text-lg font-black text-white tracking-tight">Outcomes Analysis</h3>
```

---

#### **STEP 7: Update Analytics Page**
**File:** `src/pages/Analytics.tsx`  
**Line:** ~120

**Find the text "Patient Galaxy" and change to:**
```tsx
Patient Outcomes Map
```

---

#### **STEP 8: Update Dashboard Card**
**File:** `src/pages/Dashboard.tsx`  
**Line:** ~116 (look for InsightCard with "Patient Constellation" or "Patient Galaxy")

**BEFORE:**
```tsx
title="Patient Constellation"
// or
title="Patient Galaxy"
```

**AFTER:**
```tsx
title="Patient Outcomes Map"
```

---

#### **STEP 9: Update Route in App.tsx**
**File:** `src/App.tsx`  
**Time:** 5 minutes

**Find the route definition (look for "/deep-dives/patient-constellation"):**

**BEFORE:**
```tsx
import PatientConstellationPage from './pages/deep-dives/PatientConstellationPage';

// ... later in routes:
<Route path="/deep-dives/patient-constellation" element={<PatientConstellationPage />} />
```

**AFTER:**
```tsx
import PatientOutcomesMapPage from './pages/deep-dives/PatientOutcomesMapPage';

// ... later in routes:
<Route path="/deep-dives/patient-outcomes-map" element={<PatientOutcomesMapPage />} />
```

**CRITICAL:** Update BOTH the import AND the route path!

---

### **TASK 3.2: Rename Pharmacology Lab → Molecular Pharmacology**
**Files:** 2 files  
**Time:** 5 minutes  
**Complexity:** LOW

---

#### **STEP 10: Update Sidebar**
**File:** `src/components/Sidebar.tsx`  
**Line:** Look for "Pharmacology Lab"

**BEFORE:**
```tsx
{ label: "Pharmacology Lab", icon: "biotech", path: "/deep-dives/molecular-pharmacology" }
```

**AFTER:**
```tsx
{ label: "Molecular Pharmacology", icon: "biotech", path: "/deep-dives/molecular-pharmacology" }
```

**Note:** Only the label changes, path stays the same!

---

#### **STEP 11: Update Dashboard Card**
**File:** `src/pages/Dashboard.tsx`  
**Line:** Look for InsightCard with "Pharmacology Lab"

**BEFORE:**
```tsx
title="Pharmacology Lab"
```

**AFTER:**
```tsx
title="Molecular Pharmacology"
```

---

## ✅ **TESTING CHECKLIST**

**CRITICAL: Test ALL navigation links!**

### **Patient Outcomes Map Checks:**
- [ ] Sidebar link says "Patient Outcomes Map"
- [ ] Sidebar link goes to `/deep-dives/patient-outcomes-map`
- [ ] Page loads without 404 error
- [ ] Page title says "Patient Outcomes Map"
- [ ] Page subheading is simplified (9th grade level)
- [ ] Dashboard card says "Patient Outcomes Map"
- [ ] Dashboard card link works (no 404)
- [ ] Analytics page says "Patient Outcomes Map"
- [ ] Component heading says "Outcomes Analysis"

### **Molecular Pharmacology Checks:**
- [ ] Sidebar link says "Molecular Pharmacology"
- [ ] Sidebar link goes to `/deep-dives/molecular-pharmacology`
- [ ] Page loads without 404 error
- [ ] Dashboard card says "Molecular Pharmacology"
- [ ] Dashboard card link works (no 404)

### **General Checks:**
- [ ] No console errors
- [ ] No 404 errors anywhere
- [ ] All navigation works
- [ ] All routes resolve correctly

### **Responsive Checks:**
- [ ] Mobile: Sidebar navigation works
- [ ] Desktop: All links work

---

## 🐛 **COMMON ISSUES & FIXES**

### **Issue 1: 404 error on Patient Outcomes Map**
**Likely Cause:** Route path not updated in App.tsx  
**Fix:** Make sure you changed BOTH:
1. Import: `PatientOutcomesMapPage`
2. Route path: `/deep-dives/patient-outcomes-map`

### **Issue 2: "Cannot find module" error**
**Likely Cause:** File not renamed or import not updated  
**Fix:** 
1. Verify file is at: `src/pages/deep-dives/PatientOutcomesMapPage.tsx`
2. Verify import in App.tsx matches filename exactly

### **Issue 3: Old name still showing somewhere**
**Likely Cause:** Missed a location  
**Fix:** Search entire codebase for:
- "Patient Galaxy"
- "Patient Constellation"
- "Pharmacology Lab"

### **Issue 4: Link works but shows old name**
**Likely Cause:** Updated route but not the label  
**Fix:** Check Sidebar.tsx, Dashboard.tsx, Analytics.tsx for old labels

---

## 📊 **PROGRESS TRACKER**

```
BATCH 3 PROGRESS:

Patient Outcomes Map Rename:
[  ] Step 1: Rename file
[  ] Step 2: Update component name
[  ] Step 3: Update page title
[  ] Step 4: Update page subheading
[  ] Step 5: Update Sidebar
[  ] Step 6: Update component heading
[  ] Step 7: Update Analytics page
[  ] Step 8: Update Dashboard card
[  ] Step 9: Update App.tsx route

Molecular Pharmacology Rename:
[  ] Step 10: Update Sidebar
[  ] Step 11: Update Dashboard card

TOTAL: 0/11 steps complete (0%)
```

---

## 🎯 **SUCCESS CRITERIA**

**Batch 3 is complete when:**
1. ✅ File renamed to `PatientOutcomesMapPage.tsx`
2. ✅ "Patient Outcomes Map" appears in 5 locations:
   - Sidebar
   - Page title
   - Dashboard card
   - Analytics page
   - Component heading (as "Outcomes Analysis")
3. ✅ "Molecular Pharmacology" appears in 2 locations:
   - Sidebar
   - Dashboard card
4. ✅ All links work (no 404s)
5. ✅ All routes resolve correctly
6. ✅ No console errors
7. ✅ All tests pass

---

## ⚠️ **BEFORE YOU START**

**Recommended:** Commit your work from Batches 1-2 before starting this batch. Route changes can be tricky, and you want to be able to rollback if needed.

**Command:**
```bash
git add .
git commit -m "Batches 1-2: Foundation and Portal improvements"
```

---

**Estimated Time:** 45 minutes  
**When complete, move to Batch 4!**
