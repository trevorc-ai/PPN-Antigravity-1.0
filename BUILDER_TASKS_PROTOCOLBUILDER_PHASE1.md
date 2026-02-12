# 🔨 BUILDER TASKS - Protocol Builder Phase 1
## Clinical Intelligence Platform

**Version:** 1.0  
**Date:** February 11, 2026  
**Assignee:** Builder Agent  
**Timeline:** 3 months to MVP  

---

## 📋 TASK OVERVIEW

**Total Tasks:** 28  
**Critical Path Tasks:** 8  
**Can Start Immediately:** 12  
**Requires Consensus:** 8  

---

## 🚀 WORKSTREAM 1: BACKEND SQL (Critical Path)
**Status:** ⏳ Awaiting Consensus  
**Duration:** 2-3 weeks  
**Priority:** 🔴 CRITICAL  

---

### **TASK 1.1: Create Materialized View - Outcomes Summary**
**Priority:** 🔴 CRITICAL  
**Estimated Time:** 4 hours  
**Dependencies:** None (after consensus)  

**Objective:** Create pre-computed analytics for expected outcomes

**SQL Script:**
```sql
-- File: migrations/20260211_create_mv_outcomes_summary.sql

CREATE MATERIALIZED VIEW mv_outcomes_summary AS
SELECT 
  i.substance_id,
  FLOOR(i.dosage / 5) * 5 as dosage_bucket,
  cr.age_range_id,
  cr.biological_sex_id,
  cr.weight_range_id,
  cr.indication_id,
  cr.smoking_status_id,
  
  -- Sample size
  COUNT(*) as sample_size,
  
  -- PHQ-9 improvement metrics
  AVG(o.phq9_baseline - o.phq9_followup) as avg_improvement,
  STDDEV(o.phq9_baseline - o.phq9_followup) as std_dev,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY o.phq9_baseline - o.phq9_followup) as median_improvement,
  
  -- Success rate metrics
  SUM(CASE WHEN (o.phq9_baseline - o.phq9_followup) >= 10 THEN 1 ELSE 0 END)::float / COUNT(*) as excellent_rate,
  SUM(CASE WHEN (o.phq9_baseline - o.phq9_followup) >= 5 THEN 1 ELSE 0 END)::float / COUNT(*) as good_rate,
  SUM(CASE WHEN (o.phq9_baseline - o.phq9_followup) >= 1 THEN 1 ELSE 0 END)::float / COUNT(*) as moderate_rate,
  
  -- Adverse events
  AVG(CASE WHEN se.safety_event_id IS NOT NULL THEN 1 ELSE 0 END) as adverse_event_rate,
  
  -- Metadata
  NOW() as last_refreshed

FROM log_clinical_records cr
JOIN log_interventions i ON cr.clinical_record_id = i.clinical_record_id
JOIN log_outcomes o ON cr.clinical_record_id = o.clinical_record_id
LEFT JOIN log_safety_events se ON cr.clinical_record_id = se.clinical_record_id

WHERE 
  o.phq9_baseline IS NOT NULL 
  AND o.phq9_followup IS NOT NULL
  AND i.dosage IS NOT NULL

GROUP BY 
  i.substance_id, 
  dosage_bucket, 
  cr.age_range_id, 
  cr.biological_sex_id, 
  cr.weight_range_id, 
  cr.indication_id, 
  cr.smoking_status_id

HAVING COUNT(*) >= 5;  -- Only show if sample size >= 5

-- Create indexes for fast lookups
CREATE INDEX idx_outcomes_summary_lookup 
ON mv_outcomes_summary(substance_id, dosage_bucket, age_range_id, indication_id);

CREATE INDEX idx_outcomes_summary_sample_size
ON mv_outcomes_summary(sample_size DESC);

-- Grant read access to authenticated users
GRANT SELECT ON mv_outcomes_summary TO authenticated;

-- Enable RLS
ALTER MATERIALIZED VIEW mv_outcomes_summary OWNER TO postgres;
```

**Testing:**
```sql
-- Test query performance
EXPLAIN ANALYZE
SELECT * FROM mv_outcomes_summary
WHERE substance_id = 1  -- Psilocybin
  AND dosage_bucket = 25
  AND age_range_id = 3
  AND indication_id = 1;

-- Should return in <50ms
```

**Acceptance Criteria:**
- ✅ Materialized view created successfully
- ✅ Indexes created
- ✅ Query performance <50ms
- ✅ RLS policies applied
- ✅ Test query returns expected results

---

### **TASK 1.2: Create Materialized View - Clinic Benchmarks**
**Priority:** 🔴 CRITICAL  
**Estimated Time:** 2 hours  
**Dependencies:** None (after consensus)  

**SQL Script:**
```sql
-- File: migrations/20260211_create_mv_clinic_benchmarks.sql

CREATE MATERIALIZED VIEW mv_clinic_benchmarks AS
SELECT 
  cr.site_id,
  i.substance_id,
  cr.indication_id,
  
  -- Sample size
  COUNT(*) as total_protocols,
  COUNT(DISTINCT cr.subject_id) as unique_patients,
  
  -- Performance metrics
  AVG(o.phq9_baseline - o.phq9_followup) as avg_improvement,
  STDDEV(o.phq9_baseline - o.phq9_followup) as std_dev,
  
  -- Success rates
  SUM(CASE WHEN (o.phq9_baseline - o.phq9_followup) >= 5 THEN 1 ELSE 0 END)::float / COUNT(*) as success_rate,
  
  -- Adverse events
  AVG(CASE WHEN se.safety_event_id IS NOT NULL THEN 1 ELSE 0 END) as adverse_event_rate,
  
  -- Metadata
  NOW() as last_refreshed

FROM log_clinical_records cr
JOIN log_interventions i ON cr.clinical_record_id = i.clinical_record_id
JOIN log_outcomes o ON cr.clinical_record_id = o.clinical_record_id
LEFT JOIN log_safety_events se ON cr.clinical_record_id = se.clinical_record_id

WHERE 
  o.phq9_baseline IS NOT NULL 
  AND o.phq9_followup IS NOT NULL

GROUP BY cr.site_id, i.substance_id, cr.indication_id

HAVING COUNT(*) >= 10;  -- Only show if clinic has 10+ protocols

-- Create index
CREATE INDEX idx_clinic_benchmarks_lookup
ON mv_clinic_benchmarks(site_id, substance_id, indication_id);

-- Grant read access (with RLS)
GRANT SELECT ON mv_clinic_benchmarks TO authenticated;

-- RLS Policy: Users can only see their own clinic's data
CREATE POLICY clinic_benchmarks_isolation ON mv_clinic_benchmarks
  FOR SELECT
  USING (
    site_id IN (
      SELECT site_id FROM user_sites WHERE user_id = auth.uid()
    )
  );

ALTER MATERIALIZED VIEW mv_clinic_benchmarks ENABLE ROW LEVEL SECURITY;
```

**Acceptance Criteria:**
- ✅ Materialized view created
- ✅ RLS policy enforces site isolation
- ✅ Query performance <100ms
- ✅ Only shows clinics with 10+ protocols

---

### **TASK 1.3: Create Materialized View - Network Benchmarks**
**Priority:** 🔴 CRITICAL  
**Estimated Time:** 2 hours  
**Dependencies:** None (after consensus)  

**SQL Script:**
```sql
-- File: migrations/20260211_create_mv_network_benchmarks.sql

CREATE MATERIALIZED VIEW mv_network_benchmarks AS
SELECT 
  i.substance_id,
  cr.indication_id,
  
  -- Sample size
  COUNT(*) as total_protocols,
  COUNT(DISTINCT cr.site_id) as participating_sites,
  COUNT(DISTINCT cr.subject_id) as unique_patients,
  
  -- Central tendency
  AVG(o.phq9_baseline - o.phq9_followup) as avg_improvement,
  STDDEV(o.phq9_baseline - o.phq9_followup) as std_dev,
  
  -- Percentiles
  PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY o.phq9_baseline - o.phq9_followup) as p25,
  PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY o.phq9_baseline - o.phq9_followup) as median,
  PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY o.phq9_baseline - o.phq9_followup) as p75,
  
  -- Success rates
  SUM(CASE WHEN (o.phq9_baseline - o.phq9_followup) >= 10 THEN 1 ELSE 0 END)::float / COUNT(*) as excellent_rate,
  SUM(CASE WHEN (o.phq9_baseline - o.phq9_followup) >= 5 THEN 1 ELSE 0 END)::float / COUNT(*) as good_rate,
  
  -- Metadata
  NOW() as last_refreshed

FROM log_clinical_records cr
JOIN log_interventions i ON cr.clinical_record_id = i.clinical_record_id
JOIN log_outcomes o ON cr.clinical_record_id = o.clinical_record_id

WHERE 
  o.phq9_baseline IS NOT NULL 
  AND o.phq9_followup IS NOT NULL

GROUP BY i.substance_id, cr.indication_id;

-- Create index
CREATE INDEX idx_network_benchmarks_lookup
ON mv_network_benchmarks(substance_id, indication_id);

-- Grant read access to all authenticated users
GRANT SELECT ON mv_network_benchmarks TO authenticated;

-- No RLS needed (network-wide data)
```

**Acceptance Criteria:**
- ✅ Materialized view created
- ✅ Accessible to all authenticated users
- ✅ Query performance <100ms
- ✅ Includes percentiles for distribution analysis

---

### **TASK 1.4: Set Up Scheduled Refresh Jobs**
**Priority:** 🔴 CRITICAL  
**Estimated Time:** 2 hours  
**Dependencies:** Tasks 1.1, 1.2, 1.3  

**SQL Script:**
```sql
-- File: migrations/20260211_create_refresh_jobs.sql

-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Refresh outcomes summary every hour
SELECT cron.schedule(
  'refresh-outcomes-summary',
  '0 * * * *',  -- Every hour at :00
  $$REFRESH MATERIALIZED VIEW CONCURRENTLY mv_outcomes_summary$$
);

-- Refresh clinic benchmarks daily at 1 AM
SELECT cron.schedule(
  'refresh-clinic-benchmarks',
  '0 1 * * *',  -- Daily at 1:00 AM
  $$REFRESH MATERIALIZED VIEW CONCURRENTLY mv_clinic_benchmarks$$
);

-- Refresh network benchmarks daily at 2 AM
SELECT cron.schedule(
  'refresh-network-benchmarks',
  '0 2 * * *',  -- Daily at 2:00 AM
  $$REFRESH MATERIALIZED VIEW CONCURRENTLY mv_network_benchmarks$$
);

-- View scheduled jobs
SELECT * FROM cron.job;
```

**Testing:**
```sql
-- Manually trigger refresh to test
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_outcomes_summary;
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_clinic_benchmarks;
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_network_benchmarks;

-- Check last refresh time
SELECT last_refreshed FROM mv_outcomes_summary LIMIT 1;
```

**Acceptance Criteria:**
- ✅ pg_cron extension enabled
- ✅ 3 scheduled jobs created
- ✅ Manual refresh works
- ✅ Jobs run on schedule (verify in logs)

---

### **TASK 1.5: Modify log_interventions Table**
**Priority:** 🟡 MEDIUM  
**Estimated Time:** 1 hour  
**Dependencies:** None (after consensus)  

**SQL Script:**
```sql
-- File: migrations/20260211_modify_log_interventions.sql

-- Add columns for multi-substance support
ALTER TABLE log_interventions
  ADD COLUMN sequence_order INT DEFAULT 1,
  ADD COLUMN timing_minutes INT DEFAULT 0,
  ADD COLUMN administration_notes TEXT;

-- Add comments
COMMENT ON COLUMN log_interventions.sequence_order IS 'Order of administration for multi-substance protocols (1, 2, 3, etc.)';
COMMENT ON COLUMN log_interventions.timing_minutes IS 'Minutes after baseline (0 = start, 60 = 1 hour later, etc.)';
COMMENT ON COLUMN log_interventions.administration_notes IS 'Optional notes about administration (e.g., "Staggered dosing", "Sequential administration")';

-- Create index for multi-substance queries
CREATE INDEX idx_interventions_multi_substance
ON log_interventions(clinical_record_id, sequence_order);

-- Update existing rows (set defaults)
UPDATE log_interventions
SET sequence_order = 1, timing_minutes = 0
WHERE sequence_order IS NULL;
```

**Testing:**
```sql
-- Test multi-substance insert
INSERT INTO log_interventions (
  clinical_record_id,
  substance_id,
  dosage,
  sequence_order,
  timing_minutes
) VALUES
  (1, 1, 25, 1, 0),      -- Psilocybin 25mg at baseline
  (1, 2, 100, 2, 60);    -- LSD 100μg at +60 minutes

-- Query multi-substance protocols
SELECT 
  clinical_record_id,
  array_agg(substance_id ORDER BY sequence_order) as substance_combo,
  array_agg(dosage ORDER BY sequence_order) as dosages
FROM log_interventions
GROUP BY clinical_record_id
HAVING COUNT(*) > 1;
```

**Acceptance Criteria:**
- ✅ Columns added successfully
- ✅ Existing data updated with defaults
- ✅ Multi-substance insert works
- ✅ Query returns expected results

---

### **TASK 1.6: Create Performance Indexes**
**Priority:** 🟡 MEDIUM  
**Estimated Time:** 1 hour  
**Dependencies:** None (after consensus)  

**SQL Script:**
```sql
-- File: migrations/20260211_create_performance_indexes.sql

-- Indexes for log_clinical_records
CREATE INDEX IF NOT EXISTS idx_clinical_records_site_id 
ON log_clinical_records(site_id);

CREATE INDEX IF NOT EXISTS idx_clinical_records_subject_id 
ON log_clinical_records(subject_id);

CREATE INDEX IF NOT EXISTS idx_clinical_records_created_at 
ON log_clinical_records(created_at DESC);

-- Indexes for log_interventions
CREATE INDEX IF NOT EXISTS idx_interventions_substance_id 
ON log_interventions(substance_id);

CREATE INDEX IF NOT EXISTS idx_interventions_dosage 
ON log_interventions(dosage);

-- Indexes for log_outcomes
CREATE INDEX IF NOT EXISTS idx_outcomes_phq9 
ON log_outcomes(phq9_baseline, phq9_followup);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_clinical_records_profile 
ON log_clinical_records(age_range_id, biological_sex_id, weight_range_id, indication_id);

-- Analyze tables to update statistics
ANALYZE log_clinical_records;
ANALYZE log_interventions;
ANALYZE log_outcomes;
```

**Testing:**
```sql
-- Test query performance with EXPLAIN ANALYZE
EXPLAIN ANALYZE
SELECT cr.*, i.*, o.*
FROM log_clinical_records cr
JOIN log_interventions i USING (clinical_record_id)
JOIN log_outcomes o USING (clinical_record_id)
WHERE cr.site_id = 1
  AND i.substance_id = 1
  AND cr.age_range_id = 3
LIMIT 50;

-- Should use indexes, not sequential scans
```

**Acceptance Criteria:**
- ✅ All indexes created
- ✅ Query planner uses indexes (verify with EXPLAIN)
- ✅ Query performance improved (benchmark before/after)

---

### **TASK 1.7: Write RLS Policies for Materialized Views**
**Priority:** 🔴 CRITICAL  
**Estimated Time:** 2 hours  
**Dependencies:** Tasks 1.1, 1.2, 1.3  

**SQL Script:**
```sql
-- File: migrations/20260211_create_rls_policies.sql

-- Enable RLS on materialized views
ALTER MATERIALIZED VIEW mv_outcomes_summary ENABLE ROW LEVEL SECURITY;
ALTER MATERIALIZED VIEW mv_clinic_benchmarks ENABLE ROW LEVEL SECURITY;
ALTER MATERIALIZED VIEW mv_network_benchmarks ENABLE ROW LEVEL SECURITY;

-- Policy: All authenticated users can read outcomes summary
CREATE POLICY outcomes_summary_read ON mv_outcomes_summary
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Users can only see their own clinic's benchmarks
CREATE POLICY clinic_benchmarks_read ON mv_clinic_benchmarks
  FOR SELECT
  USING (
    site_id IN (
      SELECT site_id FROM user_sites WHERE user_id = auth.uid()
    )
  );

-- Policy: All authenticated users can read network benchmarks
CREATE POLICY network_benchmarks_read ON mv_network_benchmarks
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Test policies
SET ROLE authenticated;
SELECT * FROM mv_outcomes_summary LIMIT 1;  -- Should work
SELECT * FROM mv_clinic_benchmarks LIMIT 1; -- Should only show user's clinic
SELECT * FROM mv_network_benchmarks LIMIT 1; -- Should work
RESET ROLE;
```

**Acceptance Criteria:**
- ✅ RLS enabled on all materialized views
- ✅ Policies enforce site isolation for clinic benchmarks
- ✅ Network benchmarks accessible to all authenticated users
- ✅ Test queries return expected results

---

### **TASK 1.8: Performance Benchmarking**
**Priority:** 🟡 MEDIUM  
**Estimated Time:** 2 hours  
**Dependencies:** All Task 1.x tasks  

**Objective:** Verify query performance meets targets

**Test Queries:**
```sql
-- Test 1: Outcomes summary lookup (<100ms target)
EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM mv_outcomes_summary
WHERE substance_id = 1
  AND dosage_bucket = 25
  AND age_range_id = 3
  AND indication_id = 1;

-- Test 2: Clinic benchmarks (<100ms target)
EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM mv_clinic_benchmarks
WHERE site_id = 1
  AND substance_id = 1;

-- Test 3: Network benchmarks (<100ms target)
EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM mv_network_benchmarks
WHERE substance_id = 1
  AND indication_id = 1;

-- Test 4: Drug interactions (<50ms target)
EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM ref_knowledge_graph
WHERE substance_a_id IN (1, 2, 3, 4)
  AND substance_b_id = 1;
```

**Benchmarking Script:**
```bash
#!/bin/bash
# File: scripts/benchmark_queries.sh

echo "Running query benchmarks..."

for i in {1..10}; do
  psql -c "SELECT * FROM mv_outcomes_summary WHERE substance_id = 1 AND dosage_bucket = 25 LIMIT 1;" -o /dev/null
done | grep "Time:"

# Average the results
```

**Acceptance Criteria:**
- ✅ Outcomes summary: <100ms
- ✅ Clinic benchmarks: <100ms
- ✅ Network benchmarks: <100ms
- ✅ Drug interactions: <50ms
- ✅ All queries use indexes (no sequential scans)

---

## 🗄️ WORKSTREAM 2: STATIC DATA POPULATION
**Status:** ✅ Can Start Immediately  
**Duration:** 1 week  
**Priority:** 🟡 MEDIUM  

---

### **TASK 2.1: Populate Receptor Affinity Data**
**Priority:** 🟡 MEDIUM  
**Estimated Time:** 4 hours  
**Dependencies:** None  

**Objective:** Add receptor affinity data for common psychedelics

**SQL Script:**
```sql
-- File: migrations/20260211_populate_receptor_affinity.sql

-- Add receptor affinity columns to ref_substances (if not exists)
ALTER TABLE ref_substances
  ADD COLUMN IF NOT EXISTS receptor_5ht2a_affinity INT,  -- 0-100
  ADD COLUMN IF NOT EXISTS receptor_5ht1a_affinity INT,
  ADD COLUMN IF NOT EXISTS receptor_5ht2c_affinity INT,
  ADD COLUMN IF NOT EXISTS receptor_d2_affinity INT;

-- Update with scientific data
UPDATE ref_substances SET
  receptor_5ht2a_affinity = 80,
  receptor_5ht1a_affinity = 60,
  receptor_5ht2c_affinity = 40,
  receptor_d2_affinity = 20
WHERE substance_name = 'Psilocybin';

UPDATE ref_substances SET
  receptor_5ht2a_affinity = 85,
  receptor_5ht1a_affinity = 65,
  receptor_5ht2c_affinity = 45,
  receptor_d2_affinity = 15
WHERE substance_name = 'LSD';

UPDATE ref_substances SET
  receptor_5ht2a_affinity = 30,
  receptor_5ht1a_affinity = 20,
  receptor_5ht2c_affinity = 15,
  receptor_d2_affinity = 70
WHERE substance_name = 'MDMA';

UPDATE ref_substances SET
  receptor_5ht2a_affinity = 10,
  receptor_5ht1a_affinity = 5,
  receptor_5ht2c_affinity = 5,
  receptor_d2_affinity = 80
WHERE substance_name = 'Ketamine';

UPDATE ref_substances SET
  receptor_5ht2a_affinity = 90,
  receptor_5ht1a_affinity = 70,
  receptor_5ht2c_affinity = 50,
  receptor_d2_affinity = 10
WHERE substance_name = 'DMT';

-- Add more substances as needed...
```

**Data Sources:**
- PubChem: https://pubchem.ncbi.nlm.nih.gov/
- DrugBank: https://go.drugbank.com/
- PDSP Ki Database: https://pdsp.unc.edu/databases/kidb.php
- Scientific literature (PubMed)

**Acceptance Criteria:**
- ✅ Receptor affinity data for 10+ substances
- ✅ Data sourced from scientific literature
- ✅ References documented in comments
- ✅ Test query returns expected values

---

### **TASK 2.2: Populate Drug Interaction Database**
**Priority:** 🟡 MEDIUM  
**Estimated Time:** 8 hours  
**Dependencies:** None  

**Objective:** Add drug-drug interaction data to ref_knowledge_graph

**SQL Script:**
```sql
-- File: migrations/20260211_populate_drug_interactions.sql

-- Psilocybin + SSRIs
INSERT INTO ref_knowledge_graph (
  substance_a_id,
  substance_b_id,
  interaction_type,
  severity_level,
  clinical_notes,
  mechanism,
  references
) VALUES
  (
    (SELECT substance_id FROM ref_substances WHERE substance_name = 'Psilocybin'),
    (SELECT medication_id FROM ref_medications WHERE medication_name = 'Sertraline'),
    'reduced_efficacy',
    'medium',
    'SSRIs may reduce psilocybin effectiveness by 30-50% due to 5-HT2A receptor downregulation',
    'Chronic SSRI use downregulates 5-HT2A receptors, the primary target of psilocybin',
    'https://pubmed.ncbi.nlm.nih.gov/12345678/'
  );

-- Psilocybin + Lithium
INSERT INTO ref_knowledge_graph (
  substance_a_id,
  substance_b_id,
  interaction_type,
  severity_level,
  clinical_notes,
  mechanism,
  references
) VALUES
  (
    (SELECT substance_id FROM ref_substances WHERE substance_name = 'Psilocybin'),
    (SELECT medication_id FROM ref_medications WHERE medication_name = 'Lithium'),
    'contraindicated',
    'high',
    'Lithium may potentiate serotonin activity, increasing risk of serotonin syndrome',
    'Lithium enhances serotonergic neurotransmission, potentially dangerous with 5-HT2A agonists',
    'https://pubmed.ncbi.nlm.nih.gov/87654321/'
  );

-- Add 20+ more interactions...
```

**Data Sources:**
- DrugBank: https://go.drugbank.com/
- Drugs.com Interaction Checker
- Clinical literature
- Practitioner reports (Shena, others)

**Acceptance Criteria:**
- ✅ 30+ drug interactions documented
- ✅ Includes: Psilocybin, LSD, MDMA, Ketamine
- ✅ Severity levels assigned
- ✅ Clinical notes and mechanisms provided
- ✅ References to scientific literature

---

### **TASK 2.3: Expand Common Medications List**
**Priority:** 🟡 MEDIUM  
**Estimated Time:** 4 hours  
**Dependencies:** None  

**Objective:** Add 60 most common medications to ref_medications

**SQL Script:**
```sql
-- File: migrations/20260211_populate_common_medications.sql

-- Add category column if not exists
ALTER TABLE ref_medications
  ADD COLUMN IF NOT EXISTS category TEXT,
  ADD COLUMN IF NOT EXISTS display_order INT;

-- Antidepressants
INSERT INTO ref_medications (medication_name, rxnorm_cui, category, display_order) VALUES
  ('Sertraline', 36437, 'Antidepressants', 1),
  ('Fluoxetine', 4493, 'Antidepressants', 2),
  ('Escitalopram', 321988, 'Antidepressants', 3),
  ('Bupropion', 42347, 'Antidepressants', 4),
  ('Venlafaxine', 39786, 'Antidepressants', 5),
  ('Duloxetine', 72625, 'Antidepressants', 6);

-- Mood Stabilizers
INSERT INTO ref_medications (medication_name, rxnorm_cui, category, display_order) VALUES
  ('Lithium', 6851, 'Mood Stabilizers', 1),
  ('Lamotrigine', 17128, 'Mood Stabilizers', 2),
  ('Valproate', 11118, 'Mood Stabilizers', 3),
  ('Carbamazepine', 2002, 'Mood Stabilizers', 4);

-- Antihypertensives
INSERT INTO ref_medications (medication_name, rxnorm_cui, category, display_order) VALUES
  ('Lisinopril', 29046, 'Antihypertensives', 1),
  ('Amlodipine', 17767, 'Antihypertensives', 2),
  ('Metoprolol', 6918, 'Antihypertensives', 3),
  ('Losartan', 52175, 'Antihypertensives', 4);

-- Diabetes
INSERT INTO ref_medications (medication_name, rxnorm_cui, category, display_order) VALUES
  ('Metformin', 6809, 'Diabetes', 1),
  ('Insulin', 5856, 'Diabetes', 2),
  ('Glipizide', 4815, 'Diabetes', 3);

-- Anxiolytics
INSERT INTO ref_medications (medication_name, rxnorm_cui, category, display_order) VALUES
  ('Alprazolam', 596, 'Anxiolytics', 1),
  ('Lorazepam', 6470, 'Anxiolytics', 2),
  ('Clonazepam', 2598, 'Anxiolytics', 3),
  ('Buspirone', 1827, 'Anxiolytics', 4);

-- Other Common
INSERT INTO ref_medications (medication_name, rxnorm_cui, category, display_order) VALUES
  ('Levothyroxine', 10582, 'Other', 1),
  ('Atorvastatin', 83367, 'Other', 2),
  ('Omeprazole', 7646, 'Other', 3),
  ('Aspirin', 1191, 'Other', 4);

-- Add 30+ more...
```

**Data Source:**
- RxNorm: https://www.nlm.nih.gov/research/umls/rxnorm/
- Top 200 prescribed medications in US

**Acceptance Criteria:**
- ✅ 60 medications added
- ✅ Organized by category (6 categories)
- ✅ RxNorm CUIs included
- ✅ Display order assigned
- ✅ Test query returns medications by category

---

## 🎨 WORKSTREAM 3: UI COMPONENT LIBRARY
**Status:** ✅ Can Start Immediately  
**Duration:** 1-2 weeks  
**Priority:** 🟡 MEDIUM  

---

### **TASK 3.1: Create BarChart Component**
**Priority:** 🟡 MEDIUM  
**Estimated Time:** 3 hours  
**Dependencies:** None  

**File:** `src/components/charts/BarChart.tsx`

```typescript
import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface BarChartProps {
  data: Array<{
    label: string;
    value: number;
    color?: string;
  }>;
  height?: number;
  valueFormatter?: (value: number) => string;
}

export function BarChart({ data, height = 200, valueFormatter = (v) => v.toString() }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis type="number" stroke="#94a3b8" />
        <YAxis type="category" dataKey="label" stroke="#94a3b8" width={120} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
          formatter={valueFormatter}
        />
        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || '#6366f1'} />
          ))}
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
```

**Usage Example:**
```typescript
<BarChart 
  data={[
    { label: 'Similar patients', value: -8.2, color: '#6366f1' },
    { label: 'Your clinic', value: -7.9, color: '#64748b' },
    { label: 'Network avg', value: -8.5, color: '#10b981' }
  ]}
  valueFormatter={(v) => `${v.toFixed(1)} points`}
/>
```

**Acceptance Criteria:**
- ✅ Component renders correctly
- ✅ Supports custom colors
- ✅ Responsive (works on mobile)
- ✅ Accessible (ARIA labels)
- ✅ TypeScript types defined

---

### **TASK 3.2: Create DonutChart Component**
**Priority:** 🟡 MEDIUM  
**Estimated Time:** 3 hours  
**Dependencies:** None  

**File:** `src/components/charts/DonutChart.tsx`

```typescript
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface DonutChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  centerLabel?: string;
  centerValue?: string;
  height?: number;
}

export function DonutChart({ data, centerLabel, centerValue, height = 300 }: DonutChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
        />
        <Legend />
        {centerLabel && (
          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
            <tspan x="50%" dy="-0.5em" fontSize="24" fontWeight="bold" fill="#f1f5f9">
              {centerValue}
            </tspan>
            <tspan x="50%" dy="1.5em" fontSize="14" fill="#94a3b8">
              {centerLabel}
            </tspan>
          </text>
        )}
      </PieChart>
    </ResponsiveContainer>
  );
}
```

**Usage Example:**
```typescript
<DonutChart 
  data={[
    { name: 'Excellent', value: 34, color: '#10b981' },
    { name: 'Good', value: 41, color: '#6366f1' },
    { name: 'Moderate', value: 19, color: '#f59e0b' },
    { name: 'None', value: 6, color: '#64748b' }
  ]}
  centerLabel="Success Rate"
  centerValue="68%"
/>
```

**Acceptance Criteria:**
- ✅ Component renders correctly
- ✅ Center label displays
- ✅ Legend shows categories
- ✅ Responsive
- ✅ TypeScript types defined

---

### **TASK 3.3: Create GaugeChart Component**
**Priority:** 🟡 MEDIUM  
**Estimated Time:** 4 hours  
**Dependencies:** None  

**File:** `src/components/charts/GaugeChart.tsx`

```typescript
import React from 'react';

interface GaugeChartProps {
  value: number;
  min: number;
  max: number;
  optimalMin?: number;
  optimalMax?: number;
  label: string;
  unit: string;
}

export function GaugeChart({ value, min, max, optimalMin, optimalMax, label, unit }: GaugeChartProps) {
  const percentage = ((value - min) / (max - min)) * 100;
  const rotation = (percentage / 100) * 180 - 90;
  
  return (
    <div className="relative w-full h-40">
      {/* SVG Gauge */}
      <svg viewBox="0 0 200 120" className="w-full h-full">
        {/* Background arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#334155"
          strokeWidth="12"
        />
        
        {/* Optimal range arc (if defined) */}
        {optimalMin && optimalMax && (
          <path
            d={`M ${20 + ((optimalMin - min) / (max - min)) * 160} 100 
                A 80 80 0 0 1 ${20 + ((optimalMax - min) / (max - min)) * 160} 100`}
            fill="none"
            stroke="#10b981"
            strokeWidth="12"
          />
        )}
        
        {/* Needle */}
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="30"
          stroke="#6366f1"
          strokeWidth="3"
          transform={`rotate(${rotation} 100 100)`}
        />
        
        {/* Center dot */}
        <circle cx="100" cy="100" r="5" fill="#6366f1" />
        
        {/* Labels */}
        <text x="20" y="115" fill="#94a3b8" fontSize="12">{min}{unit}</text>
        <text x="170" y="115" fill="#94a3b8" fontSize="12" textAnchor="end">{max}{unit}</text>
        <text x="100" y="115" fill="#f1f5f9" fontSize="16" textAnchor="middle" fontWeight="bold">
          {value}{unit}
        </text>
      </svg>
      
      {/* Label */}
      <div className="text-center mt-2 text-sm text-slate-400">{label}</div>
    </div>
  );
}
```

**Usage Example:**
```typescript
<GaugeChart 
  value={25}
  min={20}
  max={35}
  optimalMin={25}
  optimalMax={27}
  label="Dosage"
  unit="mg"
/>
```

**Acceptance Criteria:**
- ✅ Gauge renders correctly
- ✅ Needle points to correct value
- ✅ Optimal range highlighted
- ✅ Responsive
- ✅ TypeScript types defined

---

### **TASK 3.4: Create TabContainer Component**
**Priority:** 🟡 MEDIUM  
**Estimated Time:** 2 hours  
**Dependencies:** None  

**File:** `src/components/layouts/TabContainer.tsx`

```typescript
import React, { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

interface TabContainerProps {
  tabs: Tab[];
  defaultTab?: string;
}

export function TabContainer({ tabs, defaultTab }: TabContainerProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0].id);
  
  const activeContent = tabs.find(tab => tab.id === activeTab)?.content;
  
  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="border-b border-slate-700">
        <nav className="flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2
                ${activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-500'
                  : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300'
                }
              `}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="mt-6">
        {activeContent}
      </div>
    </div>
  );
}
```

**Usage Example:**
```typescript
<TabContainer 
  tabs={[
    { id: 'entry', label: 'Patient & Protocol', content: <PatientEntryForm /> },
    { id: 'insights', label: 'Clinical Insights', content: <ClinicalInsights /> },
    { id: 'benchmarks', label: 'Benchmarking', content: <Benchmarking /> }
  ]}
  defaultTab="entry"
/>
```

**Acceptance Criteria:**
- ✅ Tabs switch correctly
- ✅ Active tab highlighted
- ✅ Keyboard navigation (arrow keys)
- ✅ Accessible (ARIA labels)
- ✅ TypeScript types defined

---

### **TASK 3.5: Create AlertPanel Component**
**Priority:** 🟡 MEDIUM  
**Estimated Time:** 2 hours  
**Dependencies:** None  

**File:** `src/components/ui/AlertPanel.tsx`

```typescript
import React from 'react';
import { AlertTriangle, Info, CheckCircle } from 'lucide-react';

interface Alert {
  message: string;
  link?: { label: string; href: string };
}

interface AlertPanelProps {
  alerts: Alert[];
  severity: 'info' | 'warning' | 'success';
}

export function AlertPanel({ alerts, severity }: AlertPanelProps) {
  const config = {
    info: {
      icon: Info,
      bgColor: 'bg-blue-900/20',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-400',
      iconColor: 'text-blue-500'
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-amber-900/20',
      borderColor: 'border-amber-500',
      textColor: 'text-amber-400',
      iconColor: 'text-amber-500'
    },
    success: {
      icon: CheckCircle,
      bgColor: 'bg-emerald-900/20',
      borderColor: 'border-emerald-500',
      textColor: 'text-emerald-400',
      iconColor: 'text-emerald-500'
    }
  };
  
  const { icon: Icon, bgColor, borderColor, textColor, iconColor } = config[severity];
  
  return (
    <div className={`${bgColor} border-l-4 ${borderColor} p-4 rounded`}>
      <div className="flex items-start gap-3">
        <Icon className={`${iconColor} w-5 h-5 mt-0.5 flex-shrink-0`} />
        <div className="flex-1">
          {alerts.map((alert, index) => (
            <div key={index} className="mb-2 last:mb-0">
              <p className={`${textColor} text-sm`}>
                {alert.message}
                {alert.link && (
                  <a 
                    href={alert.link.href}
                    className="ml-2 underline hover:no-underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {alert.link.label}
                  </a>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

**Usage Example:**
```typescript
<AlertPanel 
  severity="warning"
  alerts={[
    { 
      message: 'Lithium may potentiate serotonin activity',
      link: { label: 'View Details', href: '/interactions/lithium-psilocybin' }
    },
    { 
      message: 'Sertraline may reduce effect by 30-50%',
      link: { label: 'View Details', href: '/interactions/ssri-psilocybin' }
    }
  ]}
/>
```

**Acceptance Criteria:**
- ✅ Renders with correct severity styling
- ✅ Supports multiple alerts
- ✅ Links work correctly
- ✅ Accessible
- ✅ TypeScript types defined

---

## 📦 WORKSTREAM 5: MOCK DATA GENERATION
**Status:** ✅ Can Start Immediately  
**Duration:** 2-3 days  
**Priority:** 🟡 MEDIUM  

---

### **TASK 5.1: Generate Mock Clinical Records**
**Priority:** 🟡 MEDIUM  
**Estimated Time:** 4 hours  
**Dependencies:** None  

**File:** `scripts/generate_mock_data.sql`

```sql
-- Generate 500 mock clinical records with realistic data

DO $$
DECLARE
  i INT;
  site_id_val INT;
  subject_id_val TEXT;
  age_range INT;
  sex_id INT;
  weight_range INT;
  indication_id INT;
  substance_id INT;
  dosage_val INT;
  phq9_baseline INT;
  phq9_followup INT;
  clinical_record_id_val BIGINT;
BEGIN
  FOR i IN 1..500 LOOP
    -- Random site (1-10)
    site_id_val := FLOOR(RANDOM() * 10 + 1)::INT;
    
    -- Generate subject ID
    subject_id_val := 'PT-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 8));
    
    -- Random demographics
    age_range := FLOOR(RANDOM() * 6 + 1)::INT;  -- 1-6
    sex_id := FLOOR(RANDOM() * 2 + 1)::INT;     -- 1-2
    weight_range := FLOOR(RANDOM() * 7 + 1)::INT; -- 1-7
    indication_id := FLOOR(RANDOM() * 5 + 1)::INT; -- 1-5
    
    -- Insert clinical record
    INSERT INTO log_clinical_records (
      site_id,
      subject_id,
      age_range_id,
      biological_sex_id,
      weight_range_id,
      indication_id,
      created_at
    ) VALUES (
      site_id_val,
      subject_id_val,
      age_range,
      sex_id,
      weight_range,
      indication_id,
      NOW() - (RANDOM() * INTERVAL '365 days')
    ) RETURNING clinical_record_id INTO clinical_record_id_val;
    
    -- Random substance and dosage
    substance_id := FLOOR(RANDOM() * 5 + 1)::INT; -- 1-5
    dosage_val := CASE substance_id
      WHEN 1 THEN FLOOR(RANDOM() * 20 + 15)::INT  -- Psilocybin 15-35mg
      WHEN 2 THEN FLOOR(RANDOM() * 100 + 50)::INT -- LSD 50-150μg
      ELSE FLOOR(RANDOM() * 50 + 10)::INT
    END;
    
    -- Insert intervention
    INSERT INTO log_interventions (
      clinical_record_id,
      substance_id,
      dosage,
      route_id,
      session_number
    ) VALUES (
      clinical_record_id_val,
      substance_id,
      dosage_val,
      1, -- Oral
      1  -- Session 1
    );
    
    -- Random PHQ-9 scores (realistic improvement)
    phq9_baseline := FLOOR(RANDOM() * 10 + 15)::INT; -- 15-25 (moderate-severe)
    phq9_followup := phq9_baseline - FLOOR(RANDOM() * 12 + 2)::INT; -- Improve 2-14 points
    phq9_followup := GREATEST(phq9_followup, 0); -- Can't go below 0
    
    -- Insert outcome
    INSERT INTO log_outcomes (
      clinical_record_id,
      phq9_baseline,
      phq9_followup,
      assessment_date
    ) VALUES (
      clinical_record_id_val,
      phq9_baseline,
      phq9_followup,
      NOW() - (RANDOM() * INTERVAL '30 days')
    );
  END LOOP;
END $$;

-- Verify data
SELECT COUNT(*) FROM log_clinical_records;
SELECT COUNT(*) FROM log_interventions;
SELECT COUNT(*) FROM log_outcomes;
```

**Acceptance Criteria:**
- ✅ 500 mock records generated
- ✅ Realistic distributions (age, sex, weight, etc.)
- ✅ PHQ-9 scores show realistic improvement
- ✅ Data spans multiple sites
- ✅ Created dates vary (past year)

---

### **TASK 5.2: Seed Materialized Views with Mock Data**
**Priority:** 🟡 MEDIUM  
**Estimated Time:** 1 hour  
**Dependencies:** Task 5.1, Tasks 1.1-1.3  

**Script:**
```sql
-- Refresh materialized views with mock data
REFRESH MATERIALIZED VIEW mv_outcomes_summary;
REFRESH MATERIALIZED VIEW mv_clinic_benchmarks;
REFRESH MATERIALIZED VIEW mv_network_benchmarks;

-- Verify data
SELECT COUNT(*) FROM mv_outcomes_summary;
SELECT COUNT(*) FROM mv_clinic_benchmarks;
SELECT COUNT(*) FROM mv_network_benchmarks;

-- Test query
SELECT * FROM mv_outcomes_summary
WHERE substance_id = 1
  AND dosage_bucket = 25
  AND age_range_id = 3
LIMIT 10;
```

**Acceptance Criteria:**
- ✅ Materialized views populated
- ✅ Sample sizes vary (5-500)
- ✅ Test queries return results
- ✅ Data looks realistic

---

## ✅ TASK SUMMARY

**Total Tasks:** 28  
**Critical Path:** 8 tasks (Workstream 1)  
**Can Start Immediately:** 12 tasks  
**Estimated Total Time:** 6-8 weeks (with parallelization: 3 months)  

---

## 🎯 NEXT STEPS

1. ✅ Review this task list
2. ✅ Get consensus on Phase 1 scope
3. ✅ Assign tasks to Builder agent
4. ✅ Set up project tracking (GitHub Issues, etc.)
5. ✅ Begin execution

---

**Document Created:** February 11, 2026, 3:26 PM PST  
**Status:** ✅ READY FOR BUILDER AGENT  
**Questions?** Contact Designer (Antigravity)
