STATUS: BUILDER_READY

> **✅ SOOP WORK COMPLETE:** Migration 015 successfully added receptor affinity data to `ref_substances` table (not a separate table as originally specified). All 8 substances have Ki values for 6 receptors. Ready for frontend integration.
> 
> **LEAD APPROVAL:** ✅ APPROVED for BUILDER implementation (2026-02-14)
> 
> **Note:** SOOP's implementation differs from original spec - receptor data was added as columns to `ref_substances` rather than a separate `ref_receptor_affinity` table. This is a better design (fewer joins, faster queries). BUILDER should follow SOOP's handoff document for implementation details.

---

# Work Order: Receptor Affinity Database Integration

**WO Number:** WO-003  
**Created:** 2026-02-13  
**Priority:** P0 (Critical - Data Integrity)  
**Assigned To:** SOOP → BUILDER  
**Estimated Time:** 4-6 hours total (SOOP: 2-3 hrs, BUILDER: 2-3 hrs)  
**Related:** Protocol Detail Page Audit

---

## 📋 Problem Statement

**Current State:** Receptor affinity data in Protocol Detail page is **hardcoded** in the component (lines 181-188), not pulled from the database.

**Code Evidence:**
```tsx
// ProtocolDetail.tsx lines 181-188
<RadarChart data={[
  { subject: '5-HT2A (Psych)', A: 120, B: 100 },
  { subject: '5-HT2B (Cardio)', A: record.protocol.substance === 'MDMA' ? 110 : 40, B: 90 },
  // ❌ Hardcoded conditional logic for MDMA/Ketamine only
]}>
```

**Impact:**
- Inaccurate data for non-MDMA/Ketamine substances
- Maintenance nightmare (update code for each new substance)
- Violates "zero-text-entry" policy (data should be in DB)
- Cannot scale to 100+ substances

**Goal:** Replace hardcoded data with database-driven receptor affinity values from `ref_receptor_affinity` table.

---

## 🎯 Phase 1: SOOP (Database Schema & Query)

### Task 1.1: Verify/Create `ref_receptor_affinity` Table (1 hr)

**Check if table exists:**
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'ref_receptor_affinity';
```

**If table doesn't exist, create it:**
```sql
CREATE TABLE ref_receptor_affinity (
  id SERIAL PRIMARY KEY,
  substance_id INTEGER NOT NULL REFERENCES ref_substances(id),
  receptor_target VARCHAR(50) NOT NULL,
  receptor_display_name VARCHAR(100) NOT NULL,
  affinity_ki_nm DECIMAL(10, 2), -- Binding affinity in nanomolar (nM)
  affinity_relative INTEGER, -- Relative scale (0-150) for radar chart
  mechanism VARCHAR(50), -- 'agonist', 'antagonist', 'partial_agonist'
  safety_relevance VARCHAR(20), -- 'psychedelic', 'cardiotoxic', 'dopaminergic', etc.
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_receptor_substance ON ref_receptor_affinity(substance_id);
CREATE INDEX idx_receptor_target ON ref_receptor_affinity(receptor_target);

-- RLS Policy
ALTER TABLE ref_receptor_affinity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON ref_receptor_affinity FOR SELECT USING (true);
```

### Task 1.2: Populate Reference Data (1 hr)

**Insert baseline serotonin data:**
```sql
-- Assuming serotonin has substance_id = 1 (adjust as needed)
INSERT INTO ref_receptor_affinity (substance_id, receptor_target, receptor_display_name, affinity_relative, mechanism, safety_relevance) VALUES
(1, '5HT2A', '5-HT2A (Psych)', 100, 'agonist', 'psychedelic'),
(1, '5HT2B', '5-HT2B (Cardio)', 90, 'agonist', 'cardiotoxic'),
(1, 'D2', 'D2 (Dopamine)', 110, 'antagonist', 'dopaminergic'),
(1, 'ADRENERGIC', 'Adrenergic (HR)', 90, 'agonist', 'cardiovascular'),
(1, 'SERT', 'SERT', 85, 'inhibitor', 'neurotransmitter'),
(1, 'NMDA', 'NMDA', 50, 'antagonist', 'dissociative');
```

**Insert MDMA data:**
```sql
-- Assuming MDMA has substance_id = 2
INSERT INTO ref_receptor_affinity (substance_id, receptor_target, receptor_display_name, affinity_relative, mechanism, safety_relevance) VALUES
(2, '5HT2A', '5-HT2A (Psych)', 120, 'agonist', 'psychedelic'),
(2, '5HT2B', '5-HT2B (Cardio)', 110, 'agonist', 'cardiotoxic'), -- Higher cardio risk
(2, 'D2', 'D2 (Dopamine)', 80, 'agonist', 'dopaminergic'),
(2, 'ADRENERGIC', 'Adrenergic (HR)', 95, 'agonist', 'cardiovascular'),
(2, 'SERT', 'SERT', 140, 'inhibitor', 'neurotransmitter'), -- Strong SERT inhibition
(2, 'NMDA', 'NMDA', 20, 'antagonist', 'dissociative');
```

**Insert Psilocybin, Ketamine, LSD, etc.** (user to provide data or use literature values)

### Task 1.3: Create Query Function (30 min)

**Create optimized query:**
```sql
-- Function to get receptor affinity for a substance
CREATE OR REPLACE FUNCTION get_receptor_affinity(p_substance_id INTEGER)
RETURNS TABLE (
  receptor_target VARCHAR,
  receptor_display_name VARCHAR,
  target_affinity INTEGER,
  baseline_affinity INTEGER,
  mechanism VARCHAR,
  safety_relevance VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    target.receptor_target,
    target.receptor_display_name,
    target.affinity_relative AS target_affinity,
    baseline.affinity_relative AS baseline_affinity,
    target.mechanism,
    target.safety_relevance
  FROM ref_receptor_affinity target
  LEFT JOIN ref_receptor_affinity baseline 
    ON target.receptor_target = baseline.receptor_target 
    AND baseline.substance_id = 1 -- Serotonin baseline
  WHERE target.substance_id = p_substance_id
  ORDER BY target.receptor_target;
END;
$$ LANGUAGE plpgsql;
```

**Test query:**
```sql
SELECT * FROM get_receptor_affinity(2); -- MDMA
```

---

## 🎯 Phase 2: BUILDER (Frontend Integration)

### Task 2.1: Create Supabase Query Hook (1 hr)

**Create new file:** `src/hooks/useReceptorAffinity.ts`

```tsx
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

interface ReceptorAffinityData {
  receptor_target: string;
  receptor_display_name: string;
  target_affinity: number;
  baseline_affinity: number;
  mechanism: string;
  safety_relevance: string;
}

export const useReceptorAffinity = (substanceId: number) => {
  const [data, setData] = useState<ReceptorAffinityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: affinityData, error: fetchError } = await supabase
          .rpc('get_receptor_affinity', { p_substance_id: substanceId });

        if (fetchError) throw fetchError;
        setData(affinityData || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    if (substanceId) {
      fetchData();
    }
  }, [substanceId]);

  return { data, loading, error };
};
```

### Task 2.2: Update ProtocolDetail.tsx (1 hr)

**Replace hardcoded data with hook:**

```tsx
// Add import
import { useReceptorAffinity } from '../hooks/useReceptorAffinity';

// Inside ProtocolDetail component
const { data: receptorData, loading: receptorLoading } = useReceptorAffinity(record.protocol.substance_id);

// Transform data for Recharts
const radarChartData = receptorData.map(item => ({
  subject: item.receptor_display_name,
  A: item.target_affinity,
  B: item.baseline_affinity,
  fullMark: 150
}));

// Update RadarChart (line 181)
<RadarChart data={radarChartData}>
  {/* ... */}
</RadarChart>
```

### Task 2.3: Add Loading & Error States (30 min)

```tsx
{receptorLoading ? (
  <div className="h-[300px] bg-slate-900/30 rounded-3xl animate-pulse" />
) : receptorData.length === 0 ? (
  <div className="h-[300px] flex items-center justify-center text-slate-500">
    <span>No receptor affinity data available for this substance</span>
  </div>
) : (
  <RadarChart data={radarChartData}>
    {/* ... */}
  </RadarChart>
)}
```

---

## ✅ Success Criteria

**SOOP:**
- ✅ `ref_receptor_affinity` table created with proper schema
- ✅ Baseline data for serotonin inserted
- ✅ Data for MDMA, Psilocybin, Ketamine inserted
- ✅ `get_receptor_affinity()` function created and tested
- ✅ RLS policy enabled

**BUILDER:**
- ✅ `useReceptorAffinity` hook created
- ✅ ProtocolDetail.tsx updated to use hook
- ✅ Loading and error states implemented
- ✅ Radar chart displays database data correctly
- ✅ No hardcoded affinity values remain

---

## 📝 Testing Checklist

**SOOP:**
- [ ] Query returns correct data for MDMA (substance_id = 2)
- [ ] Query returns correct data for Psilocybin
- [ ] Query handles missing substance gracefully (empty result)
- [ ] RLS policy allows public read access

**BUILDER:**
- [ ] Radar chart displays for MDMA protocol
- [ ] Radar chart displays for Psilocybin protocol
- [ ] Loading state shows during data fetch
- [ ] Error state shows if query fails
- [ ] "No data" message shows for substances without affinity data

---

## 📊 Files to Create/Modify

**SOOP:**
- `migrations/XXX_create_receptor_affinity.sql` (new)
- `migrations/XXX_populate_receptor_affinity.sql` (new)

**BUILDER:**
- `src/hooks/useReceptorAffinity.ts` (new)
- `src/pages/ProtocolDetail.tsx` (modify lines 181-200)

---

## 🚀 Implementation Order

1. **SOOP:** Create table and populate data (2-3 hrs)
2. **SOOP:** Update work order with migration file paths
3. **SOOP:** Set status to `STATUS: LEAD_REVIEW`
4. **LEAD:** Review and approve (set to `STATUS: BUILDER_READY`)
5. **BUILDER:** Create hook and integrate (2-3 hrs)
6. **BUILDER:** Test and verify
7. **BUILDER:** Update work order with verification evidence
8. **BUILDER:** Set status to `STATUS: COMPLETED_NOTIFY_USER`

---

## 📋 Change Log

| Date | Agent | Action | Status Change |
|------|-------|--------|---------------|
| 2026-02-13 | LEAD | Created work order | → SOOP_PENDING |
| | | | |
