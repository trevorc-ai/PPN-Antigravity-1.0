# Builder Task: Search Portal Filter Data Integration

**Priority:** P2 - Data Quality Issue  
**Type:** Backend Data Plumbing  
**Estimated Time:** 30 minutes  
**Assigned To:** Builder

---

## 🎯 **Problem Statement**

The Search Portal (`SearchPortal.tsx`) is using **hardcoded filter options** instead of pulling from database `ref_*` tables. This creates data inconsistency and maintenance issues.

### **Current State (Hardcoded):**
```typescript
// Line 19-21 in SearchPortal.tsx
const SETTING_OPTIONS = ['All', 'Clinical (Medical)', 'Home (Supervised)', 'Retreat Center'];
const SUBSTANCE_OPTIONS = ['All', ...SUBSTANCES.map(s => s.name)];
const EFFICACY_OPTIONS = ['Any', '>5pts PHQ-9', '>10pts PHQ-9'];
```

### **Expected State (Database-Driven):**
Filters should pull from:
- `ref_settings` (if exists) OR create new table
- `ref_substances` (already exists, used in ProtocolBuilder)
- Efficacy options can remain hardcoded (they're calculation thresholds, not data)

---

## 📋 **Tasks**

### ✅ **Step 1: Verify Reference Tables**
Check if these tables exist:
- [ ] `ref_substances` ✅ (confirmed in `useReferenceData.ts`)
- [ ] `ref_settings` ❓ (need to verify or create)

### ✅ **Step 2: Import useReferenceData Hook**
**File:** `SearchPortal.tsx`

Add at top:
```typescript
import { useReferenceData } from '../hooks/useReferenceData';
```

Inside component:
```typescript
const { substances, loading, error } = useReferenceData();
```

### ✅ **Step 3: Replace Hardcoded Constants**

**Before:**
```typescript
const SUBSTANCE_OPTIONS = ['All', ...SUBSTANCES.map(s => s.name)];
```

**After:**
```typescript
const SUBSTANCE_OPTIONS = useMemo(() => {
  return ['All', ...substances.map(s => s.substance_name)];
}, [substances]);
```

### ✅ **Step 4: Handle Settings Filter**

**Option A:** If `ref_settings` table exists, use it  
**Option B:** If not, create migration:

```sql
-- supabase/migrations/YYYYMMDDHHMMSS_create_ref_settings.sql
CREATE TABLE IF NOT EXISTS public.ref_settings (
  setting_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  setting_name TEXT NOT NULL UNIQUE,
  setting_description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default values
INSERT INTO public.ref_settings (setting_name, setting_description) VALUES
  ('Clinical (Medical)', 'Medical clinic or hospital setting'),
  ('Home (Supervised)', 'Home-based with professional supervision'),
  ('Retreat Center', 'Dedicated retreat or ceremonial center');

-- RLS Policy
ALTER TABLE public.ref_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ref_settings_read" ON public.ref_settings
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "ref_settings_write" ON public.ref_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_sites
      WHERE user_sites.user_id = auth.uid()
      AND user_sites.role = 'network_admin'
    )
  );
```

### ✅ **Step 5: Update useReferenceData Hook**

Add `settings` to the hook:
```typescript
export interface ReferenceData {
    substances: any[];
    routes: any[];
    indications: any[];
    modalities: any[];
    smokingStatus: any[];
    severityGrades: any[];
    safetyEvents: any[];
    resolutionStatus: any[];
    settings: any[]; // NEW
    loading: boolean;
    error: any;
}
```

Fetch settings:
```typescript
const [settingsRes] = await Promise.all([
  // ... existing fetches
  supabase.from('ref_settings').select('*').order('setting_name')
]);

setData({
  // ... existing data
  settings: settingsRes.data || [],
  // ...
});
```

### ✅ **Step 6: Update SearchPortal Component**

```typescript
const { substances, settings, loading } = useReferenceData();

const SETTING_OPTIONS = useMemo(() => {
  return ['All', ...settings.map(s => s.setting_name)];
}, [settings]);

const SUBSTANCE_OPTIONS = useMemo(() => {
  return ['All', ...substances.map(s => s.substance_name)];
}, [substances]);
```

---

## 🧪 **Testing Checklist**

- [ ] Search filters load from database
- [ ] "All" option still works correctly
- [ ] Filter selections update results properly
- [ ] No console errors
- [ ] Loading state handled gracefully
- [ ] Empty state handled if no ref data

---

## 📝 **Notes**

- **DO NOT** change any visual styling (Designer owns that)
- **DO NOT** modify filter UI components
- **ONLY** replace data sources from constants to database
- Keep existing filter logic intact

---

## 🔗 **Related Files**

- `/src/pages/SearchPortal.tsx` (lines 19-21, 572-604)
- `/src/hooks/useReferenceData.ts`
- `/src/constants.ts` (SUBSTANCES constant)
- `/supabase/migrations/` (if creating ref_settings)

---

**Status:** Ready for Builder  
**Blocked By:** None  
**Blocks:** None  
**Last Updated:** 2026-02-12 03:23 PST
