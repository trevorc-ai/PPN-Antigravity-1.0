# Search Portal Filter Audit: Buttons vs Database Tables

**Date:** 2026-02-12  
**Status:** ⚠️ MISMATCH DETECTED  
**Priority:** P2 - Data Quality

---

## 📊 **Filter Comparison**

### **1. SUBSTANCE Filter**

**UI Buttons (SearchPortal.tsx line 20):**
```typescript
const SUBSTANCE_OPTIONS = ['All', ...SUBSTANCES.map(s => s.name)];
```

**Database Table (ref_substances):**
Lines 20-28 in `003_protocolbuilder_reference_tables.sql`:
```sql
INSERT INTO public.ref_substances (substance_name, substance_class) VALUES
('Psilocybin', 'psychedelic'),
('MDMA', 'empathogen'),
('Ketamine', 'dissociative'),
('LSD-25', 'psychedelic'),
('5-MeO-DMT', 'psychedelic'),
('Ibogaine', 'psychedelic'),
('Mescaline', 'psychedelic'),
('Other / Investigational', 'other')
```

**Count:**
- ✅ **Database:** 8 substances
- ❓ **UI Buttons:** Unknown (depends on SUBSTANCES constant)

**Action Required:** Replace hardcoded SUBSTANCES constant with `ref_substances` query

---

### **2. SETTING Filter**

**UI Buttons (SearchPortal.tsx line 19):**
```typescript
const SETTING_OPTIONS = ['All', 'Clinical (Medical)', 'Home (Supervised)', 'Retreat Center'];
```

**Database Table:**
- ❌ **NO `ref_settings` TABLE EXISTS**

**Count:**
- **UI Buttons:** 4 options (including "All")
- **Database:** 0 (table doesn't exist)

**Action Required:** 
- **Option A:** Create `ref_settings` table with these 3 values
- **Option B:** Keep hardcoded (acceptable if these are stable categories)

---

### **3. EFFICACY Filter**

**UI Buttons (SearchPortal.tsx line 21):**
```typescript
const EFFICACY_OPTIONS = ['Any', '>5pts PHQ-9', '>10pts PHQ-9'];
```

**Database Table:**
- ❌ **NO `ref_efficacy` TABLE EXISTS**

**Count:**
- **UI Buttons:** 3 options
- **Database:** N/A (these are calculation thresholds, not reference data)

**Action Required:** 
- ✅ **Keep hardcoded** - These are business logic thresholds, not data

---

## 🎯 **Recommended Actions**

### **Priority 1: Fix Substance Filter**
**File:** `SearchPortal.tsx`

**Current (Hardcoded):**
```typescript
import { SUBSTANCES } from '../constants';
const SUBSTANCE_OPTIONS = ['All', ...SUBSTANCES.map(s => s.name)];
```

**Target (Database-Driven):**
```typescript
import { useReferenceData } from '../hooks/useReferenceData';

const { substances, loading } = useReferenceData();

const SUBSTANCE_OPTIONS = useMemo(() => {
  return ['All', ...substances.map(s => s.substance_name)];
}, [substances]);
```

**Expected Count Match:**
- Database: 8 substances
- UI: Should show 9 options (8 + "All")

---

### **Priority 2: Decide on Settings Filter**

**Option A: Create ref_settings table**
```sql
CREATE TABLE IF NOT EXISTS public.ref_settings (
  setting_id BIGSERIAL PRIMARY KEY,
  setting_name TEXT NOT NULL UNIQUE,
  setting_description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.ref_settings (setting_name, setting_description) VALUES
('Clinical (Medical)', 'Medical clinic or hospital setting'),
('Home (Supervised)', 'Home-based with professional supervision'),
('Retreat Center', 'Dedicated retreat or ceremonial center');
```

**Option B: Keep hardcoded (recommended)**
- These are stable, unlikely to change
- Not worth database overhead for 3 static values
- Keep as-is

---

### **Priority 3: Keep Efficacy Hardcoded**
✅ **No action needed** - These are business logic thresholds

---

## 📋 **Verification Checklist**

After implementing fixes:

- [ ] Substance filter shows 9 options (8 substances + "All")
- [ ] Substance names match database exactly:
  - [ ] Psilocybin
  - [ ] MDMA
  - [ ] Ketamine
  - [ ] LSD-25
  - [ ] 5-MeO-DMT
  - [ ] Ibogaine
  - [ ] Mescaline
  - [ ] Other / Investigational
- [ ] Setting filter shows 4 options (3 settings + "All")
- [ ] Efficacy filter shows 3 options (unchanged)
- [ ] Filter selections still work correctly
- [ ] No console errors

---

## 🔍 **Current State Summary**

| Filter | UI Count | DB Count | Status | Action |
|--------|----------|----------|--------|--------|
| **Substances** | Unknown | 8 | ⚠️ Mismatch | Replace with DB query |
| **Settings** | 4 (3 + All) | 0 | ⚠️ No table | Keep hardcoded OR create table |
| **Efficacy** | 3 | N/A | ✅ OK | Keep hardcoded (business logic) |

---

**Next Step:** Builder to implement substance filter database integration  
**Blocked By:** None  
**Estimated Time:** 20 minutes
