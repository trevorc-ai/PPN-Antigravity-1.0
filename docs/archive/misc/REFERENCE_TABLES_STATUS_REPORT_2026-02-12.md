# REFERENCE TABLES STATUS & ACTION PLAN
**Date:** 2026-02-12 09:13 PST  
**Status:** ⚠️ **TABLES EXIST BUT NOT BEING USED**  
**Priority:** P1 - SAFETY & DATA INTEGRITY

---

## 📊 CURRENT STATUS

### **Database Schema: ✅ COMPLETE**

Reference tables exist in Supabase (from migration 003):
1. `ref_substances` (8 rows expected)
2. `ref_routes` (9 rows expected)
3. `ref_support_modality` (5 rows expected)
4. `ref_smoking_status` (4 rows expected)
5. `ref_severity_grade` (5 rows expected)
6. `ref_safety_events` (13 rows expected)
7. `ref_resolution_status` (3 rows expected)
8. `ref_indications` (9 rows expected)

Additional reference tables (from other migrations):
9. `ref_assessments`
10. `ref_assessment_interval`
11. `ref_justification_codes`
12. `ref_knowledge_graph`
13. `ref_primary_adverse`
14. `ref_sources`

**RLS:** ✅ Enabled on all ref_* tables  
**Policies:** ✅ Read for authenticated, write for network_admin only

---

### **Frontend Hook: ✅ EXISTS BUT NOT USED**

**File:** `src/hooks/useReferenceData.ts`

**What It Does:**
- Fetches all 8 core reference tables from Supabase
- Returns data + loading + error states
- Uses Promise.all for parallel fetching
- Properly orders results

**Problem:** ❌ NOT IMPORTED ANYWHERE

---

### **ProtocolBuilder: ❌ USING HARDCODED CONSTANTS**

**Current Implementation:**
```typescript
// Lines 28-48 in ProtocolBuilder.tsx
const SUBSTANCE_OPTIONS = [
  "Psilocybin",
  "MDMA",
  "Ketamine",
  // ... hardcoded array
];

const ROUTE_OPTIONS = [
  "Oral",
  "Intravenous",
  // ... hardcoded array
];
```

**Issue:** ProtocolBuilder does NOT use `useReferenceData()` hook.

**Risk:**
- Data drift (database changes don't reflect in UI)
- No single source of truth
- Network admins can't add new substances/routes dynamically
- Violates user rule: "ONLY store dropdown selections as IDs"

---

## 🚨 CRITICAL ISSUE

**ProtocolBuilder** currently stores **LABELS** (e.g., "Psilocybin") instead of **IDs** (e.g., `substance_id = 1`).

**User Rule Violation:**
> "ProtocolBuilder must store dropdown selections using IDs (like substance_id) everywhere, not text labels."

**Current Protocol Builder Form Data:**
```typescript
const [formData, setFormData] = useState({
  substance: '',  // ❌ STORES LABEL, NOT ID
  route: '',      // ❌ STORES LABEL, NOT ID
  // ...
});
```

**Should Be:**
```typescript
const [formData, setFormData] = useState({
  substance_id: null,  // ✅ STORES ID
  route_id: null,      // ✅ STORES ID
  // ...
});
```

---

## ✅ ACTION PLAN

### **Step 1: Verify Database Population**
**Action:** Run verification query in Supabase SQL Editor

**Query:** `VERIFY_REFERENCE_TABLES.sql` (created)

**Expected Results:**
```
table_name              | row_count
------------------------|-----------
ref_substances          | 8
ref_routes              | 9
ref_support_modality    | 5
ref_smoking_status      | 4
ref_severity_grade      | 5
ref_safety_events       | 13
ref_resolution_status   | 3
ref_indications         | 9
```

**If row_count = 0:** Run migration `003_protocolbuilder_reference_tables.sql`

---

### **Step 2: Integrate useReferenceData Hook into ProtocolBuilder**
**Action:** Modify `ProtocolBuilder.tsx` to use hook

**Changes Required:**
1. Import hook:
   ```typescript
   import { useReferenceData } from '../hooks/useReferenceData';
   ```

2. Call hook in component:
   ```typescript
   const refData = useReferenceData();
   ```

3. Replace hardcoded constants with hook data:
   ```typescript
   // OLD
   const SUBSTANCE_OPTIONS = ["Psilocybin", ...];
   
   // NEW
   const substanceOptions = refData.substances.map(s => ({
     id: s.substance_id,
     name: s.substance_name
   }));
   ```

4. Update form state to use IDs:
   ```typescript
   const [formData, setFormData] = useState({
     substance_id: null,  // Changed from 'substance'
     route_id: null,      // Changed from 'route'
     indication_id: null,
     smoking_status_id: null,
     // ...
   });
   ```

5. Update submission handler to use IDs

**Effort:** 2-3 hours  
**Complexity:** 6/10

---

### **Step 3: Update ButtonGroup Components**
**Action:** Ensure ButtonGroup works with ID-based data

**Current ButtonGroup Usage:**
```typescript
<ButtonGroup
  options={SUBSTANCE_OPTIONS}  // Array of strings
  value={formData.substance}
  onChange={(val) => setFormData({...formData, substance: val})}
/>
```

**Updated Usage:**
```typescript
<ButtonGroup
  options={refData.substances.map(s => s.substance_name)}
  value={refData.substances.find(s => s.substance_id === formData.substance_id)?.substance_name}
  onChange={(name) => {
    const selected = refData.substances.find(s => s.substance_name === name);
    setFormData({...formData, substance_id: selected?.substance_id});
  }}
/>
```

**OR** (Better - extend ButtonGroup to handle objects):
```typescript
<ButtonGroup
  options={refData.substances}
  labelKey="substance_name"
  valueKey="substance_id"
  value={formData.substance_id}
  onChange={(id) => setFormData({...formData, substance_id: id})}
/>
```

**Effort:** 1-2 hours  
**Complexity:** 4/10

---

### **Step 4: Update Supabase Submission**
**Action:** Ensure `log_clinical_records` insert uses IDs

**Current Supabase Insert (BROKEN):**
```typescript
await supabase.from('log_clinical_records').insert({
  substance: formData.substance,  // ❌ String
  route: formData.route,          // ❌ String
  // ...
});
```

**Fixed Supabase Insert:**
```typescript
await supabase.from('log_clinical_records').insert({
  substance_id: formData.substance_id,  // ✅ BIGINT foreign key
  route_id: formData.route_id,          // ✅ BIGINT foreign key
  // ...
});
```

**Verification:** Check `log_clinical_records` schema to confirm column names

**Effort:** 30 minutes  
**Complexity:** 3/10

---

### **Step 5: Test Reference Data Loading**
**Action:** Verify hook loads data correctly

**Test Cases:**
1. ✅ Hook fetches all 8 tables without errors
2. ✅ Data populates dropdowns correctly
3. ✅ Loading state works (show spinner  while fetching)
4. ✅ Error handling works (show error message if Supabase fails)
5. ✅ Form submission uses IDs, not labels
6. ✅ Database stores IDs in `log_clinical_records`

**Verification:**
```sql
-- Check submitted protocol uses IDs
SELECT 
  substance_id,  -- Should be BIGINT (1, 2, 3...)
  route_id,      -- NOT text ("Psilocybin", "Oral"...)
  indication_id
FROM log_clinical_records
ORDER BY created_at DESC
LIMIT 5;
```

**Effort:** 1 hour  
**Complexity:** 2/10

---

## 📊 TOTAL EFFORT ESTIMATE

| Step | Task | Effort | Priority |
|------|------|--------|----------|
| 1 | Verify DB population | 10 min | P0 |
| 2 | Integrate useReferenceData hook | 2-3 hrs | P0 |
| 3 | Update ButtonGroup components | 1-2 hrs | P1 |
| 4 | Fix Supabase submission | 30 min | P0 |
| 5 | Test & verify | 1 hr | P0 |
| **TOTAL** | **Complete integration** | **5-7 hours** | **P0** |

---

## 🎯 SUCCESS CRITERIA

**Before:**
- ❌ ProtocolBuilder uses hardcoded constants
- ❌ Form stores labels (strings)
- ❌ Database gets text instead of IDs
- ❌ Network admins can't add new substances

**After:**
- ✅ ProtocolBuilder uses `useReferenceData()` hook
- ✅ Form stores IDs (BIGINT foreign keys)
- ✅ Database receives proper foreign key references
- ✅ Network admins can add substances via Supabase → UI updates automatically
- ✅ Single source of truth (database)
- ✅ Compliance with user rules

---

## 🚀 IMMEDIATE NEXT STEPS

**Step 1 (10 minutes):**
1. Open Supabase SQL Editor
2. Run `VERIFY_REFERENCE_TABLES.sql`
3. Confirm all 8 core tables have expected row counts
4. If any table is empty, run migration 003

**Step 2 (User Decision Required):**
**Question:** Do you want me to:
- **Option A:** Integrate `useReferenceData()` hook into ProtocolBuilder now (5-7 hours)?
- **Option B:** Proceed with mobile bug fixes first, defer reference data integration?

**Recommendation:** Option B (mobile fixes first, reference data integration after demo).

**Rationale:**
- Mobile fixes are P0 (blocking demo)
- Reference data integration is P1 (important but not blocking)
- Current hardcoded constants work for demo
- After demo, switch to ID-based implementation

---

**Status Report Complete:** 2026-02-12 09:13 PST  
**Created By:** LEAD (Antigravity)  
**Ready For:** User decision on prioritization 🚀
