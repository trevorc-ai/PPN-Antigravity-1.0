# 🔍 **PROTOCOL BUILDER DROPDOWN AUDIT & REPAIR PLAN**

**Date:** 2026-02-10 12:13 PM  
**File:** `src/pages/ProtocolBuilder.tsx`  
**Objective:** Connect ALL dropdowns to Supabase reference tables

---

## 📊 **CURRENT STATE vs REQUIRED STATE**

| Dropdown Field | Current Status | Supabase Table | Action Required |
|----------------|----------------|----------------|-----------------|
| **Substance** | ❌ Hardcoded array | `ref_substances` | ✅ Connect to DB |
| **Route** | ❌ Hardcoded array | `ref_routes` | ✅ Connect to DB |
| **Frequency** | ❌ Hardcoded array | ❓ No ref table | ⚠️ Create table or keep hardcoded |
| **Unit** | ❌ Hardcoded array | ❓ No ref table | ⚠️ Keep hardcoded (medical standard) |
| **Safety Events** | ❌ Hardcoded array | `ref_safety_events` | ✅ Connect to DB |
| **Sex** | ❌ Hardcoded array | ❓ No ref table | ⚠️ Keep hardcoded (demographic standard) |
| **Race** | ❌ Hardcoded array | ❓ No ref table | ⚠️ Keep hardcoded (demographic standard) |
| **Smoking Status** | ❌ Hardcoded array | `ref_smoking_status` | ✅ Connect to DB |
| **Severity** | ❌ Hardcoded array | `ref_severity_grade` | ✅ Connect to DB |
| **Setting** | ❌ Hardcoded array | ❓ No ref table | ⚠️ Keep hardcoded (clinic-specific) |
| **Modality** | ❌ Hardcoded array | `ref_support_modality` | ✅ Connect to DB |
| **Resolution Status** | ❌ Hardcoded array | `ref_resolution_status` | ✅ Connect to DB |
| **Age** | ✅ Generated (18-90) | N/A | ✅ Keep as-is |
| **Weight Ranges** | ✅ Generated | N/A | ✅ Keep as-is |

---

## ✅ **DROPDOWNS TO CONNECT (7 total)**

### **1. Substance** → `ref_substances`
**Current:**
```typescript
const SUBSTANCE_OPTIONS = [
  "Psilocybin",
  "MDMA",
  "Ketamine",
  // ... hardcoded list
];
```

**Required:**
```typescript
const [substances, setSubstances] = useState<Array<{substance_id: number, substance_name: string}>>([]);

useEffect(() => {
  const fetchSubstances = async () => {
    const { data } = await supabase
      .from('ref_substances')
      .select('substance_id, substance_name')
      .eq('is_active', true)
      .order('substance_name');
    if (data) setSubstances(data);
  };
  fetchSubstances();
}, []);
```

---

### **2. Route** → `ref_routes`
**Current:** Hardcoded array  
**Required:** Fetch from `ref_routes` table

---

### **3. Safety Events** → `ref_safety_events`
**Current:** Hardcoded array  
**Required:** Fetch from `ref_safety_events` table

---

### **4. Smoking Status** → `ref_smoking_status`
**Current:** Hardcoded array  
**Required:** Fetch from `ref_smoking_status` table

---

### **5. Severity** → `ref_severity_grade`
**Current:** Hardcoded array  
**Required:** Fetch from `ref_severity_grade` table

---

### **6. Modality** → `ref_support_modality`
**Current:** Hardcoded array  
**Required:** Fetch from `ref_support_modality` table

---

### **7. Resolution Status** → `ref_resolution_status`
**Current:** Hardcoded array  
**Required:** Fetch from `ref_resolution_status` table

---

## ⚠️ **DROPDOWNS TO KEEP HARDCODED (5 total)**

### **1. Frequency**
**Reason:** Medical dosing standard (q.d., b.i.d., etc.)  
**Decision:** Keep hardcoded unless user requests ref table

### **2. Unit**
**Reason:** Medical measurement standard (mg, mcg, ml)  
**Decision:** Keep hardcoded

### **3. Sex**
**Reason:** Demographic standard (Male, Female, Intersex, Unknown)  
**Decision:** Keep hardcoded

### **4. Race**
**Reason:** Demographic standard with OMB codes  
**Decision:** Keep hardcoded (already has proper codes)

### **5. Setting**
**Reason:** Clinic-specific, may vary by site  
**Decision:** Keep hardcoded unless user requests ref table

---

## 🔧 **IMPLEMENTATION PLAN**

### **Step 1: Create useReferenceData Hook** (Already exists!)
Check if `src/hooks/useReferenceData.ts` exists and what it provides.

### **Step 2: Update ProtocolBuilder.tsx**
Replace hardcoded arrays with database fetches for the 7 identified dropdowns.

### **Step 3: Update Form State**
Store IDs instead of text labels for database-driven dropdowns.

### **Step 4: Update Submit Handler**
Ensure IDs are saved to `log_clinical_records` instead of text values.

---

## 📝 **NEXT ACTIONS**

1. ✅ Check if `useReferenceData` hook exists
2. ✅ Implement database connections for 7 dropdowns
3. ✅ Update form state to use IDs
4. ✅ Update submit handler
5. ✅ Test all dropdowns populate correctly

---

**Audit Completed:** 2026-02-10 12:13 PM  
**Status:** Ready for implementation
