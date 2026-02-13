# 🔧 **BUILDER REPAIR INSTRUCTIONS**

**Prepared By:** INVESTIGATOR (Antigravity)  
**Date:** 2026-02-10 12:39 PM  
**For:** BUILDER Agent  
**Status:** ⚠️ **AWAITING USER PERMISSION FIX**

---

## ⚠️ **PREREQUISITES - USER MUST COMPLETE FIRST**

**CRITICAL:** Builder cannot proceed until the user fixes npm permissions.

**User must run in terminal:**
```bash
sudo chown -R 501:20 "/Users/trevorcalton/.npm"
cd /Users/trevorcalton/Documents/GitHub/PPN-Antigravity-1.0
rm -rf node_modules
npm install
```

**Verification:**
- ✅ `npm install` completes without errors
- ✅ `node_modules` directory exists and is accessible
- ✅ `package-lock.json` is regenerated

**Once user confirms prerequisites are complete, Builder may proceed with repairs below.**

---

## 📋 **REPAIR TASKS OVERVIEW**

**Total Tasks:** 5  
**Estimated Time:** 30 minutes  
**Risk Level:** LOW (all changes are cleanup/finalization)

| Task | Priority | Effort | Risk |
|------|----------|--------|------|
| 1. Remove unused hardcoded arrays | 🟡 Medium | 10 min | Low |
| 2. Remove unused function | 🟢 Low | 2 min | Low |
| 3. Verify dropdown functionality | 🔴 High | 5 min | None |
| 4. Commit all changes | 🟡 Medium | 5 min | None |
| 5. Test application end-to-end | 🔴 High | 10 min | None |

---

## 🔧 **TASK 1: Remove Unused Hardcoded Arrays**

**Priority:** 🟡 MEDIUM  
**File:** `src/pages/ProtocolBuilder.tsx`  
**Reason:** These constants are no longer used after database integration

### **Arrays to Remove:**

**Lines 20-29: SUBSTANCE_OPTIONS**
```typescript
const SUBSTANCE_OPTIONS = [
  "Psilocybin",
  "MDMA",
  "Ketamine",
  "LSD-25",
  "5-MeO-DMT",
  "Ibogaine",
  "Mescaline",
  "Other / Investigational"
];
```

**Lines 31-41: ROUTE_OPTIONS**
```typescript
const ROUTE_OPTIONS = [
  "Oral",
  "Intravenous",
  "Intramuscular",
  "Intranasal",
  "Sublingual",
  "Buccal",
  "Rectal",
  "Subcutaneous",
  "Other / Non-Standard"
];
```

**Lines 60-74: SAFETY_EVENT_OPTIONS**
```typescript
const SAFETY_EVENT_OPTIONS = [
  "Anxiety",
  "Confusional State",
  "Dissociation",
  "Dizziness",
  "Headache",
  "Hypertension",
  "Insomnia",
  "Nausea",
  "Panic Attack",
  "Paranoia",
  "Tachycardia",
  "Visual Hallucination",
  "Other - Non-PHI Clinical Observation"
];
```

**Lines 85-90: SMOKING_OPTIONS**
```typescript
const SMOKING_OPTIONS = [
  "Non-Smoker",
  "Former Smoker",
  "Current Smoker (Occasional)",
  "Current Smoker (Daily)"
];
```

**Lines 92-98: SEVERITY_OPTIONS**
```typescript
const SEVERITY_OPTIONS = [
  { value: 1, label: "Grade 1 - Mild (No Intervention)" },
  { value: 2, label: "Grade 2 - Moderate (Local Intervention)" },
  { value: 3, label: "Grade 3 - Severe (Hospitalization)" },
  { value: 4, label: "Grade 4 - Life Threatening" },
  { value: 5, label: "Grade 5 - Death / Fatal" }
];
```

**Lines 108-114: MODALITY_OPTIONS**
```typescript
const MODALITY_OPTIONS = [
  'CBT',
  'Somatic',
  'Psychodynamic',
  'IFS',
  'None/Sitter'
];
```

**Lines 116-120: RESOLUTION_OPTIONS**
```typescript
const RESOLUTION_OPTIONS = [
  'Resolved in Session',
  'Resolved Post-Session',
  'Unresolved/Lingering'
];
```

### **Arrays to KEEP (Still Used):**
- ✅ `WEIGHT_RANGES` (line 12) - Generated, not in DB
- ✅ `FREQUENCY_OPTIONS` (line 43) - Medical standard
- ✅ `UNIT_OPTIONS` (line 52) - Medical standard
- ✅ `SEX_OPTIONS` (line 76) - Demographic standard
- ✅ `RACE_OPTIONS` (line 77) - Demographic standard with OMB codes
- ✅ `SETTING_OPTIONS` (line 100) - Clinic-specific
- ✅ `PHQ9_SCORES` (line 122) - Generated
- ✅ `AGE_OPTIONS` (line 123) - Generated

### **Implementation:**

**Method:** Use `multi_replace_file_content` to remove all 7 arrays in one operation.

**Verification:**
```bash
# After removal, search for any remaining references
grep -n "SUBSTANCE_OPTIONS\|ROUTE_OPTIONS\|SAFETY_EVENT_OPTIONS\|SMOKING_OPTIONS\|SEVERITY_OPTIONS\|MODALITY_OPTIONS\|RESOLUTION_OPTIONS" src/pages/ProtocolBuilder.tsx
```

**Expected:** No results (all references removed)

---

## 🔧 **TASK 2: Remove Unused Function**

**Priority:** 🟢 LOW  
**File:** `src/pages/ProtocolBuilder.tsx`  
**Line:** ~628

### **Function to Remove:**

```typescript
const handleModalityChange = (mod: string) => {
  setFormData(prev => ({
    ...prev,
    modalities: {
      ...prev.modalities,
      [mod]: !prev.modalities[mod]
    }
  }));
};
```

**Reason:** This function is no longer called. Modality changes are now handled inline with database IDs.

**Verification:**
```bash
grep -n "handleModalityChange" src/pages/ProtocolBuilder.tsx
```

**Expected:** No results after removal

---

## 🔧 **TASK 3: Verify Dropdown Functionality**

**Priority:** 🔴 HIGH  
**Type:** TESTING (No code changes)

### **Test Checklist:**

**3.1 Start Development Server**
```bash
npm run dev
```

**Expected:** Server starts on `http://localhost:5173`

---

**3.2 Navigate to Protocol Builder**
- Open browser to `http://localhost:5173`
- Login (or use demo mode if available)
- Click "Create New Protocol" button

**Expected:** Modal opens

---

**3.3 Test Each Dropdown**

| Dropdown | Test | Expected Behavior |
|----------|------|-------------------|
| **Substance** | Click dropdown | Shows "Select Substance..." + list from DB |
| **Route** | Click dropdown | Shows "Select Route..." + list from DB |
| **Smoking Status** | Click dropdown | Shows "Select Status..." + list from DB |
| **Severity** | Enable safety event, click dropdown | Shows "Select Severity..." + list from DB |
| **Safety Event Type** | Enable safety event, click dropdown | Shows "Select Observation..." + list from DB |
| **Modalities** | View checkboxes | Shows checkboxes from DB (not hardcoded) |
| **Resolution Status** | Click dropdown | Shows "Select Status..." + list from DB |

**Verification Steps:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Open Protocol Builder modal
4. Verify you see requests to Supabase for:
   - `ref_substances`
   - `ref_routes`
   - `ref_smoking_status`
   - `ref_severity_grade`
   - `ref_safety_events`
   - `ref_support_modality`
   - `ref_resolution_status`

**Expected:** All 7 requests succeed with 200 status

---

**3.4 Test Loading States**

1. Open Protocol Builder modal
2. Observe dropdowns during initial load
3. Verify all DB-driven dropdowns show `disabled` attribute while loading
4. Verify dropdowns become enabled after data loads

**Expected:** Smooth loading experience, no errors

---

**3.5 Test Form Submission**

1. Fill out all required fields
2. Select options from DB-driven dropdowns
3. Click "Submit" or "Save Protocol"
4. Check browser console for errors
5. Verify success message appears

**Expected:** Form submits successfully, IDs are saved (not text labels)

---

## 🔧 **TASK 4: Commit All Changes**

**Priority:** 🟡 MEDIUM  
**Type:** Git operations

### **4.1 Review Changes**

```bash
git status
git diff src/pages/ProtocolBuilder.tsx
git diff src/hooks/useReferenceData.ts
```

**Expected files to commit:**
- `src/pages/ProtocolBuilder.tsx` (database integration)
- `src/hooks/useReferenceData.ts` (added resolutionStatus)
- `src/App.tsx` (removed archived routes)
- `archive/README.md` (documentation)
- Documentation files (*.md)

---

### **4.2 Stage Changes**

```bash
git add src/pages/ProtocolBuilder.tsx
git add src/hooks/useReferenceData.ts
git add src/App.tsx
git add archive/
git add *.md
```

---

### **4.3 Commit with Descriptive Message**

```bash
git commit -m "feat: Connect Protocol Builder dropdowns to Supabase reference tables

- Integrated useReferenceData hook for 7 dropdowns
- Replaced hardcoded arrays with database-driven options
- Added loading states to all DB-driven dropdowns
- Updated form state to store IDs instead of text labels
- Removed unused constants and functions
- Archived ProtocolBuilderRedesign.tsx per user request

Affected dropdowns:
- Substance (ref_substances)
- Route (ref_routes)
- Smoking Status (ref_smoking_status)
- Severity (ref_severity_grade)
- Safety Events (ref_safety_events)
- Modalities (ref_support_modality)
- Resolution Status (ref_resolution_status)

Closes: Protocol Builder database integration
See: PROTOCOLBUILDER_SUPABASE_COMPLETE.md"
```

---

### **4.4 Verify Commit**

```bash
git log -1 --stat
```

**Expected:** Shows commit with all modified files

---

## 🔧 **TASK 5: End-to-End Testing**

**Priority:** 🔴 HIGH  
**Type:** Manual testing

### **5.1 Full User Flow Test**

**Scenario:** Create a new protocol from start to finish

1. ✅ Open application
2. ✅ Login/authenticate
3. ✅ Navigate to Protocol Builder
4. ✅ Click "Create New Protocol"
5. ✅ Fill out Patient Demographics
6. ✅ Select Substance from dropdown (verify DB data)
7. ✅ Select Route from dropdown (verify DB data)
8. ✅ Enter dosage information
9. ✅ Select Smoking Status (verify DB data)
10. ✅ Select Modalities (verify DB checkboxes)
11. ✅ Enable safety event
12. ✅ Select Severity (verify DB data)
13. ✅ Select Safety Event Type (verify DB data)
14. ✅ Select Resolution Status (verify DB data)
15. ✅ Submit form
16. ✅ Verify success message
17. ✅ Check database for saved record

**Expected:** Complete flow works without errors

---

### **5.2 Error Handling Test**

**Test missing data:**
1. Open Protocol Builder
2. Try to submit with empty required fields
3. Verify validation messages appear
4. Verify form does not submit

**Expected:** Proper validation, user-friendly error messages

---

### **5.3 Database Verification**

**Check that IDs are saved, not text:**

```sql
-- Run in Supabase SQL editor
SELECT 
  clinical_record_id,
  substance_id,  -- Should be a number (ID), not text
  created_at
FROM log_clinical_records
ORDER BY created_at DESC
LIMIT 5;
```

**Expected:** `substance_id` column contains integers, not text strings

---

## 📊 **SUCCESS CRITERIA**

Builder should verify ALL of the following before marking repairs complete:

- [ ] ✅ All 7 unused hardcoded arrays removed
- [ ] ✅ `handleModalityChange` function removed
- [ ] ✅ No references to removed constants remain
- [ ] ✅ Dev server starts without errors
- [ ] ✅ Protocol Builder modal opens
- [ ] ✅ All 7 dropdowns populate from database
- [ ] ✅ Loading states work correctly
- [ ] ✅ Form submission succeeds
- [ ] ✅ IDs are saved to database (not text)
- [ ] ✅ All changes committed to git
- [ ] ✅ No console errors in browser
- [ ] ✅ No TypeScript errors
- [ ] ✅ Application is stable and ready for use

---

## 🚨 **TROUBLESHOOTING GUIDE**

### **Issue: Dropdowns are empty**

**Diagnosis:**
```bash
# Check browser console for errors
# Look for 401 Unauthorized or network errors
```

**Possible Causes:**
1. RLS policies blocking access to ref_* tables
2. User not authenticated
3. Supabase connection issue

**Fix:**
- Verify RLS policies allow read access for authenticated users
- Check Supabase connection in `.env`

---

### **Issue: TypeScript errors after cleanup**

**Diagnosis:**
```bash
npx tsc --noEmit
```

**Possible Causes:**
1. Removed array still referenced somewhere
2. Import statement missing

**Fix:**
- Search for references: `grep -r "SUBSTANCE_OPTIONS" src/`
- Add missing imports if needed

---

### **Issue: Form submission fails**

**Diagnosis:**
- Check browser console
- Check Network tab for failed requests
- Check Supabase logs

**Possible Causes:**
1. Storing text instead of IDs
2. Missing required fields
3. Database constraint violation

**Fix:**
- Verify form state stores IDs (numbers/strings), not labels
- Check submit handler maps fields correctly

---

## 📝 **BUILDER CHECKLIST**

**Before starting:**
- [ ] User has confirmed npm permissions are fixed
- [ ] `npm install` completed successfully
- [ ] `node_modules` directory exists
- [ ] `package-lock.json` was regenerated

**During repairs:**
- [ ] Task 1: Remove 7 hardcoded arrays
- [ ] Task 2: Remove unused function
- [ ] Task 3: Verify all dropdowns work
- [ ] Task 4: Commit changes with descriptive message
- [ ] Task 5: Complete end-to-end testing

**After completion:**
- [ ] All success criteria met
- [ ] No errors in console
- [ ] Application is stable
- [ ] Changes are committed
- [ ] User is notified of completion

---

## 🎯 **FINAL DELIVERABLE**

**Builder should provide:**

1. **Completion Report** documenting:
   - All tasks completed
   - Test results
   - Any issues encountered
   - Git commit hash

2. **Verification Screenshots** (optional):
   - Dropdowns populated from database
   - Successful form submission
   - Database record showing IDs

3. **Handoff to User:**
   - "All repairs complete"
   - "Application is ready for use"
   - "Protocol Builder dropdowns are now database-driven"

---

**Prepared By:** INVESTIGATOR (Antigravity)  
**Date:** 2026-02-10 12:39 PM  
**Status:** ✅ **READY FOR BUILDER EXECUTION**  
**Prerequisites:** ⚠️ **AWAITING USER PERMISSION FIX**

---

## 📎 **APPENDIX: REFERENCE DOCUMENTS**

**Related Documentation:**
- `INVESTIGATOR_DIAGNOSTIC_REPORT.md` - Root cause analysis
- `PROTOCOLBUILDER_SUPABASE_COMPLETE.md` - Implementation details
- `PROTOCOLBUILDER_DROPDOWN_AUDIT.md` - Dropdown mapping
- `DESIGNER_RECOMMENDATIONS_REVIEW.md` - Approved changes

**Database Schema:**
- `migrations/003_add_reference_tables.sql` - Reference table definitions
- `migrations/004_protocol_builder_v1.sql` - Protocol Builder schema

**Code Files:**
- `src/pages/ProtocolBuilder.tsx` - Main file to modify
- `src/hooks/useReferenceData.ts` - Data fetching hook
- `src/App.tsx` - Routing configuration

---

**End of Builder Instructions**
