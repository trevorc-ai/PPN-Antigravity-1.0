# 🗄️ SUBA TASK: CLINICAL INTELLIGENCE DATABASE SCHEMA

**Assigned To:** SUBA (Database Specialist)  
**Assigned By:** LEAD  
**Date:** 2026-02-11 16:45 PST  
**Priority:** P0 - CRITICAL  
**Estimated Effort:** 2-3 days  
**Status:** 🔴 NOT STARTED

---

## 📋 **TASK SUMMARY**

Design database schema and query patterns to support real-time clinical intelligence features: planned protocols, protocol comparisons, multi-substance support, and sub-second aggregation queries for live benchmarking.

---

## 🎯 **CONTEXT & STRATEGIC IMPORTANCE**

### **The Paradigm Shift:**

**OLD Database Model:**
> Store completed protocols after treatment (retroactive logging)

**NEW Database Model:**
> Store planned protocols BEFORE treatment, actual protocols AFTER treatment, enable real-time comparisons and predictive modeling

### **Why This Matters:**

**User's Vision:**
> "Allow practitioner to enter protocol in advance, then go back and update. Compare anticipated results to actual results. Use that as guide for next session."

**Technical Challenge:**
> Real-time aggregation queries must return in <1 second for live data visualization to work

---

## 🗄️ **NEW TABLES REQUIRED**

### **1. log_planned_protocols**
**Purpose:** Store protocols BEFORE treatment (planning mode)

**Schema:**
```sql
CREATE TABLE public.log_planned_protocols (
  -- Primary Key
  planned_protocol_id BIGSERIAL PRIMARY KEY,
  
  -- Foreign Keys
  site_id BIGINT NOT NULL REFERENCES public.sites(site_id),
  subject_id BIGINT NOT NULL, -- Links to subject within site
  created_by UUID NOT NULL REFERENCES auth.users(id),
  
  -- Patient Characteristics (for benchmarking queries)
  age_range TEXT, -- '36-45', '46-55', etc.
  weight_range TEXT, -- '61-70 kg', '71-80 kg', etc.
  biological_sex TEXT, -- 'Male', 'Female', 'Intersex'
  race_ethnicity TEXT[], -- Array: ['White', 'Hispanic/Latino']
  
  -- Primary Indication
  indication_id BIGINT REFERENCES public.ref_indications(indication_id),
  
  -- Concomitant Medications (for interaction alerts)
  concomitant_medication_ids BIGINT[], -- Array of ref_concomitant_medications IDs
  
  -- Planned Protocol Details
  substance_id BIGINT REFERENCES public.ref_substances(substance_id),
  dose_amount NUMERIC(10,2),
  dose_unit TEXT, -- 'mg', 'mg/kg', 'μg', etc.
  route_id BIGINT REFERENCES public.ref_routes(route_id),
  
  -- Multi-Substance Support (if combining substances)
  additional_substances JSONB, -- [{substance_id, dose_amount, dose_unit, route_id}]
  
  -- Session Context
  session_number INTEGER, -- 1, 2, 3, etc.
  session_type TEXT, -- 'preparation', 'dosing', 'integration'
  
  -- Support Structure
  support_modality_ids BIGINT[], -- Array of ref_support_modality IDs
  
  -- Predicted Outcomes (calculated by system)
  predicted_outcomes JSONB, -- {mew_30_probability: 0.65, phq9_remission_probability: 0.58}
  
  -- Receptor Impact (calculated by system)
  receptor_impact JSONB, -- {nmda: 0.80, ampa: 0.60, mtor: 0.40}
  
  -- Benchmarking Data (snapshot at time of planning)
  similar_patients_count INTEGER, -- N for benchmarking
  similar_patients_outcomes JSONB, -- Snapshot of outcomes distribution
  
  -- Status
  status TEXT DEFAULT 'planned', -- 'planned', 'completed', 'cancelled'
  
  -- Timestamps
  planned_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Audit Trail
  notes TEXT, -- Practitioner's notes on why this protocol was chosen
  
  -- Constraints
  CONSTRAINT valid_status CHECK (status IN ('planned', 'completed', 'cancelled'))
);

-- Indexes for fast queries
CREATE INDEX idx_planned_protocols_site ON public.log_planned_protocols(site_id);
CREATE INDEX idx_planned_protocols_subject ON public.log_planned_protocols(subject_id);
CREATE INDEX idx_planned_protocols_substance ON public.log_planned_protocols(substance_id);
CREATE INDEX idx_planned_protocols_indication ON public.log_planned_protocols(indication_id);
CREATE INDEX idx_planned_protocols_status ON public.log_planned_protocols(status);
CREATE INDEX idx_planned_protocols_created_at ON public.log_planned_protocols(planned_at);

-- Composite index for benchmarking queries
CREATE INDEX idx_planned_protocols_benchmarking ON public.log_planned_protocols(
  substance_id, 
  indication_id, 
  age_range, 
  weight_range
) WHERE status = 'completed';
```

---

### **2. log_protocol_comparisons**
**Purpose:** Link planned protocols to actual protocols, enable comparison analytics

**Schema:**
```sql
CREATE TABLE public.log_protocol_comparisons (
  -- Primary Key
  comparison_id BIGSERIAL PRIMARY KEY,
  
  -- Foreign Keys
  planned_protocol_id BIGINT NOT NULL REFERENCES public.log_planned_protocols(planned_protocol_id),
  actual_protocol_id BIGINT NOT NULL REFERENCES public.log_clinical_records(clinical_record_id),
  
  -- Deviation Tracking
  protocol_deviations JSONB, -- [{field: 'dose_amount', planned: 0.5, actual: 0.65, reason: 'Patient requested'}]
  
  -- Outcome Comparison
  predicted_outcomes JSONB, -- From planned protocol
  actual_outcomes JSONB, -- From actual protocol
  outcome_accuracy JSONB, -- {mew_30: {predicted: 0.65, actual: 0.72, error: 0.07}}
  
  -- Learning Signals
  prediction_error NUMERIC(5,2), -- Overall prediction error (for model improvement)
  
  -- Timestamps
  compared_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT unique_comparison UNIQUE(planned_protocol_id, actual_protocol_id)
);

-- Indexes
CREATE INDEX idx_comparisons_planned ON public.log_protocol_comparisons(planned_protocol_id);
CREATE INDEX idx_comparisons_actual ON public.log_protocol_comparisons(actual_protocol_id);
CREATE INDEX idx_comparisons_error ON public.log_protocol_comparisons(prediction_error);
```

---

### **3. Update log_clinical_records**
**Purpose:** Link actual protocols to planned protocols

**Migration:**
```sql
-- Add foreign key to planned protocol
ALTER TABLE public.log_clinical_records
ADD COLUMN planned_protocol_id BIGINT REFERENCES public.log_planned_protocols(planned_protocol_id);

-- Add index
CREATE INDEX idx_clinical_records_planned ON public.log_clinical_records(planned_protocol_id);
```

---

## 🚀 **REAL-TIME AGGREGATION QUERIES**

### **Query 1: Similar Patients Outcomes**
**Purpose:** Show outcomes for patients with similar characteristics

**Requirements:**
- Must return in <1 second
- Minimum N=10 for display (small-cell suppression)
- Filter by: substance, indication, age range, weight range

**SQL Pattern:**
```sql
-- Get similar patients outcomes
WITH similar_patients AS (
  SELECT 
    lp.planned_protocol_id,
    lp.substance_id,
    lp.indication_id,
    lp.age_range,
    lp.weight_range,
    lo.phq9_baseline,
    lo.phq9_4week,
    lo.mew_30_total_score,
    CASE 
      WHEN lo.phq9_4week < 5 THEN 'remission'
      WHEN (lo.phq9_baseline - lo.phq9_4week) / lo.phq9_baseline >= 0.5 THEN 'significant'
      WHEN (lo.phq9_baseline - lo.phq9_4week) / lo.phq9_baseline >= 0.25 THEN 'moderate'
      ELSE 'minimal'
    END AS outcome_category
  FROM public.log_planned_protocols lp
  JOIN public.log_clinical_records lcr ON lp.planned_protocol_id = lcr.planned_protocol_id
  JOIN public.log_outcomes lo ON lcr.clinical_record_id = lo.clinical_record_id
  WHERE 
    lp.substance_id = $1 -- User's selected substance
    AND lp.indication_id = $2 -- User's selected indication
    AND lp.age_range = $3 -- User's selected age range
    AND lp.weight_range = $4 -- User's selected weight range
    AND lp.status = 'completed'
    AND lo.phq9_4week IS NOT NULL -- Has outcome data
)
SELECT 
  COUNT(*) AS total_count,
  outcome_category,
  COUNT(*) * 100.0 / SUM(COUNT(*)) OVER () AS percentage
FROM similar_patients
GROUP BY outcome_category
HAVING COUNT(*) >= 10; -- Small-cell suppression

-- Expected result:
-- total_count | outcome_category | percentage
-- 127         | significant      | 68.0
-- 127         | moderate         | 24.0
-- 127         | minimal          | 8.0
```

**Performance Optimization:**
- Use composite index: `idx_planned_protocols_benchmarking`
- Materialized view for common queries (refresh every 5 minutes)
- Cache results for 60 seconds (acceptable staleness)

---

### **Query 2: Most Common Protocols**
**Purpose:** Show what other practitioners are doing for similar patients

**SQL Pattern:**
```sql
SELECT 
  lp.substance_id,
  rs.substance_name,
  lp.dose_amount,
  lp.dose_unit,
  lp.route_id,
  rr.route_name,
  COUNT(*) AS usage_count,
  COUNT(*) * 100.0 / SUM(COUNT(*)) OVER () AS percentage
FROM public.log_planned_protocols lp
JOIN public.ref_substances rs ON lp.substance_id = rs.substance_id
JOIN public.ref_routes rr ON lp.route_id = rr.route_id
WHERE 
  lp.indication_id = $1
  AND lp.age_range = $2
  AND lp.status = 'completed'
GROUP BY lp.substance_id, rs.substance_name, lp.dose_amount, lp.dose_unit, lp.route_id, rr.route_name
HAVING COUNT(*) >= 10
ORDER BY usage_count DESC
LIMIT 5;

-- Expected result:
-- substance_name | dose_amount | dose_unit | route_name | usage_count | percentage
-- Ketamine       | 0.5         | mg/kg     | IV         | 53          | 42.0
-- Ketamine       | 0.75        | mg/kg     | IV         | 39          | 31.0
-- Ketamine       | 1.0         | mg/kg     | IV         | 23          | 18.0
```

---

### **Query 3: Network Benchmarks (Your Clinic vs Network)**
**Purpose:** Show how clinic performs compared to network

**SQL Pattern:**
```sql
-- Your clinic's success rate
WITH your_clinic AS (
  SELECT 
    COUNT(*) FILTER (WHERE outcome_category = 'significant') * 100.0 / COUNT(*) AS success_rate,
    COUNT(*) AS n_count
  FROM (
    SELECT 
      CASE 
        WHEN (lo.phq9_baseline - lo.phq9_4week) / lo.phq9_baseline >= 0.5 THEN 'significant'
        ELSE 'other'
      END AS outcome_category
    FROM public.log_planned_protocols lp
    JOIN public.log_clinical_records lcr ON lp.planned_protocol_id = lcr.planned_protocol_id
    JOIN public.log_outcomes lo ON lcr.clinical_record_id = lo.clinical_record_id
    WHERE 
      lp.site_id = $1 -- User's site
      AND lp.substance_id = $2
      AND lp.status = 'completed'
      AND lo.phq9_4week IS NOT NULL
  ) clinic_outcomes
),
network_avg AS (
  SELECT 
    COUNT(*) FILTER (WHERE outcome_category = 'significant') * 100.0 / COUNT(*) AS success_rate,
    COUNT(*) AS n_count
  FROM (
    SELECT 
      CASE 
        WHEN (lo.phq9_baseline - lo.phq9_4week) / lo.phq9_baseline >= 0.5 THEN 'significant'
        ELSE 'other'
      END AS outcome_category
    FROM public.log_planned_protocols lp
    JOIN public.log_clinical_records lcr ON lp.planned_protocol_id = lcr.planned_protocol_id
    JOIN public.log_outcomes lo ON lcr.clinical_record_id = lo.clinical_record_id
    WHERE 
      lp.substance_id = $2
      AND lp.status = 'completed'
      AND lo.phq9_4week IS NOT NULL
  ) network_outcomes
)
SELECT 
  yc.success_rate AS your_clinic_rate,
  yc.n_count AS your_clinic_n,
  na.success_rate AS network_rate,
  na.n_count AS network_n,
  CASE 
    WHEN yc.success_rate > na.success_rate THEN 'above'
    WHEN yc.success_rate < na.success_rate THEN 'below'
    ELSE 'average'
  END AS performance
FROM your_clinic yc, network_avg na;

-- Expected result:
-- your_clinic_rate | your_clinic_n | network_rate | network_n | performance
-- 72.0             | 45            | 68.0         | 1247      | above
```

---

## 🧠 **RECEPTOR IMPACT CALCULATION**

### **Reference Table: ref_receptor_targets**
**Purpose:** Store receptor affinity data for each substance

**Schema:**
```sql
CREATE TABLE public.ref_receptor_targets (
  receptor_target_id BIGSERIAL PRIMARY KEY,
  substance_id BIGINT NOT NULL REFERENCES public.ref_substances(substance_id),
  receptor_name TEXT NOT NULL, -- 'NMDA', 'AMPA', 'mTOR', '5-HT2A', etc.
  receptor_type TEXT, -- 'antagonist', 'agonist', 'modulator'
  affinity_level NUMERIC(3,2), -- 0.0 to 1.0 (0.80 = 80% affinity)
  dose_dependent BOOLEAN DEFAULT FALSE, -- Does affinity change with dose?
  dose_response_curve JSONB, -- {low: 0.4, medium: 0.6, high: 0.8}
  
  -- Metadata
  source TEXT, -- 'PDSP Ki Database', 'Published literature', etc.
  confidence TEXT, -- 'high', 'medium', 'low'
  
  CONSTRAINT unique_substance_receptor UNIQUE(substance_id, receptor_name)
);

-- Seed data example
INSERT INTO public.ref_receptor_targets (substance_id, receptor_name, receptor_type, affinity_level, confidence, source) VALUES
(1, 'NMDA', 'antagonist', 0.80, 'high', 'PDSP Ki Database'),
(1, 'AMPA', 'modulator', 0.60, 'medium', 'Published literature'),
(1, 'mTOR', 'activator', 0.40, 'medium', 'Preclinical studies'),
(1, 'HCN1', 'inhibitor', 0.30, 'low', 'Emerging research');
```

**Query Pattern:**
```sql
-- Get receptor impact for planned protocol
SELECT 
  rrt.receptor_name,
  rrt.receptor_type,
  rrt.affinity_level,
  rrt.confidence
FROM public.ref_receptor_targets rrt
WHERE rrt.substance_id = $1 -- User's selected substance
ORDER BY rrt.affinity_level DESC;

-- Expected result:
-- receptor_name | receptor_type | affinity_level | confidence
-- NMDA          | antagonist    | 0.80           | high
-- AMPA          | modulator     | 0.60           | medium
-- mTOR          | activator     | 0.40           | medium
-- HCN1          | inhibitor     | 0.30           | low
```

---

## ⚠️ **DRUG INTERACTION ALERTS**

### **Reference Table: ref_drug_interactions**
**Purpose:** Store known interactions between substances and concomitant medications

**Schema:**
```sql
CREATE TABLE public.ref_drug_interactions (
  interaction_id BIGSERIAL PRIMARY KEY,
  substance_id BIGINT NOT NULL REFERENCES public.ref_substances(substance_id),
  concomitant_medication_id BIGINT NOT NULL REFERENCES public.ref_concomitant_medications(concomitant_medication_id),
  
  -- Interaction Details
  interaction_type TEXT, -- 'reduces_efficacy', 'increases_risk', 'contraindicated'
  severity TEXT, -- 'mild', 'moderate', 'severe'
  mechanism TEXT, -- 'GABA-A agonism', 'CYP450 inhibition', etc.
  
  -- Clinical Guidance
  recommendation TEXT, -- 'Consider holding 24h before treatment'
  alternative TEXT, -- 'Lower benzo dose day-of'
  
  -- Evidence
  evidence_level TEXT, -- 'strong', 'moderate', 'weak'
  source TEXT, -- 'Clinical trials', 'Case reports', etc.
  
  -- Population Data
  affected_percentage NUMERIC(5,2), -- 23.0 = 23% of patients affected
  
  CONSTRAINT unique_interaction UNIQUE(substance_id, concomitant_medication_id)
);

-- Seed data example
INSERT INTO public.ref_drug_interactions (
  substance_id, 
  concomitant_medication_id, 
  interaction_type, 
  severity, 
  mechanism, 
  recommendation, 
  alternative, 
  evidence_level, 
  affected_percentage
) VALUES (
  1, -- Ketamine
  5, -- Benzodiazepines
  'reduces_efficacy',
  'moderate',
  'GABA-A agonism may blunt ketamine response',
  'Consider holding benzodiazepines 24h before treatment',
  'Lower benzo dose on day of treatment',
  'moderate',
  23.0
);
```

**Query Pattern:**
```sql
-- Check for interactions
SELECT 
  rdi.interaction_type,
  rdi.severity,
  rdi.mechanism,
  rdi.recommendation,
  rdi.alternative,
  rdi.affected_percentage,
  rcm.medication_name
FROM public.ref_drug_interactions rdi
JOIN public.ref_concomitant_medications rcm ON rdi.concomitant_medication_id = rcm.concomitant_medication_id
WHERE 
  rdi.substance_id = $1 -- User's selected substance
  AND rdi.concomitant_medication_id = ANY($2) -- User's selected concomitant meds (array)
ORDER BY 
  CASE rdi.severity 
    WHEN 'severe' THEN 1 
    WHEN 'moderate' THEN 2 
    WHEN 'mild' THEN 3 
  END;
```

---

## 🔄 **MULTI-SUBSTANCE PROTOCOL SUPPORT**

### **Approach: JSONB Array in log_planned_protocols**

**Why JSONB:**
- Flexible (can store 1-10 substances)
- Fast queries with GIN indexes
- Avoids complex junction tables

**Schema (already in log_planned_protocols):**
```sql
additional_substances JSONB
-- Example value:
-- [
--   {substance_id: 2, dose_amount: 100, dose_unit: 'μg', route_id: 3},
--   {substance_id: 3, dose_amount: 50, dose_unit: 'mg', route_id: 1}
-- ]
```

**Query Pattern:**
```sql
-- Find protocols using multiple substances
SELECT 
  lp.planned_protocol_id,
  lp.substance_id AS primary_substance,
  lp.additional_substances,
  COUNT(*) OVER () AS total_multi_substance_protocols
FROM public.log_planned_protocols lp
WHERE 
  lp.additional_substances IS NOT NULL
  AND jsonb_array_length(lp.additional_substances) > 0
  AND lp.status = 'completed';
```

**GIN Index for Fast JSONB Queries:**
```sql
CREATE INDEX idx_planned_protocols_additional_substances 
ON public.log_planned_protocols USING GIN (additional_substances);
```

---

## 📊 **PERFORMANCE OPTIMIZATION STRATEGY**

### **1. Materialized Views for Common Queries**

**Create materialized view for similar patients outcomes:**
```sql
CREATE MATERIALIZED VIEW mv_similar_patients_outcomes AS
SELECT 
  lp.substance_id,
  lp.indication_id,
  lp.age_range,
  lp.weight_range,
  COUNT(*) AS total_count,
  COUNT(*) FILTER (WHERE outcome_category = 'significant') AS significant_count,
  COUNT(*) FILTER (WHERE outcome_category = 'moderate') AS moderate_count,
  COUNT(*) FILTER (WHERE outcome_category = 'minimal') AS minimal_count,
  AVG(lo.phq9_baseline - lo.phq9_4week) AS avg_phq9_improvement
FROM public.log_planned_protocols lp
JOIN public.log_clinical_records lcr ON lp.planned_protocol_id = lcr.planned_protocol_id
JOIN public.log_outcomes lo ON lcr.clinical_record_id = lo.clinical_record_id
CROSS JOIN LATERAL (
  SELECT 
    CASE 
      WHEN (lo.phq9_baseline - lo.phq9_4week) / lo.phq9_baseline >= 0.5 THEN 'significant'
      WHEN (lo.phq9_baseline - lo.phq9_4week) / lo.phq9_baseline >= 0.25 THEN 'moderate'
      ELSE 'minimal'
    END AS outcome_category
) oc
WHERE 
  lp.status = 'completed'
  AND lo.phq9_4week IS NOT NULL
GROUP BY lp.substance_id, lp.indication_id, lp.age_range, lp.weight_range
HAVING COUNT(*) >= 10;

-- Refresh every 5 minutes
CREATE INDEX idx_mv_similar_patients ON mv_similar_patients_outcomes(substance_id, indication_id, age_range, weight_range);
```

**Refresh Strategy:**
```sql
-- Cron job or pg_cron extension
SELECT cron.schedule('refresh-similar-patients', '*/5 * * * *', 'REFRESH MATERIALIZED VIEW CONCURRENTLY mv_similar_patients_outcomes');
```

---

### **2. Query Result Caching**

**Application-level caching:**
- Cache similar patients outcomes for 60 seconds
- Cache network benchmarks for 5 minutes
- Cache receptor impact for 24 hours (rarely changes)

**Redis Cache Pattern:**
```typescript
// Pseudocode
const cacheKey = `similar_patients:${substance_id}:${indication_id}:${age_range}:${weight_range}`;
const cached = await redis.get(cacheKey);

if (cached) {
  return JSON.parse(cached);
}

const result = await db.query(similarPatientsQuery);
await redis.setex(cacheKey, 60, JSON.stringify(result)); // 60 second TTL
return result;
```

---

### **3. Database Connection Pooling**

**Supabase Pooler Configuration:**
- Use transaction mode for read queries
- Pool size: 20-50 connections
- Timeout: 5 seconds

---

## ✅ **ACCEPTANCE CRITERIA**

### **Schema Design:**
- [ ] `log_planned_protocols` table created
- [ ] `log_protocol_comparisons` table created
- [ ] `log_clinical_records` updated with `planned_protocol_id`
- [ ] `ref_receptor_targets` table created
- [ ] `ref_drug_interactions` table created
- [ ] All indexes created
- [ ] All constraints enforced

### **Query Performance:**
- [ ] Similar patients query returns in <1 second
- [ ] Most common protocols query returns in <1 second
- [ ] Network benchmarks query returns in <1 second
- [ ] Receptor impact query returns in <500ms
- [ ] Drug interaction query returns in <500ms

### **Data Integrity:**
- [ ] RLS policies applied to all new tables
- [ ] Foreign key constraints enforced
- [ ] Small-cell suppression (N≥10) in all aggregation queries
- [ ] No PHI in any table

### **Multi-Substance Support:**
- [ ] JSONB array stores multiple substances
- [ ] GIN index for fast JSONB queries
- [ ] Query pattern handles 1-10 substances

---

## 🚫 **OUT OF SCOPE**

**Do NOT implement these (future phases):**
- ❌ Predictive modeling algorithms (Phase 3)
- ❌ Machine learning integration (Phase 3)
- ❌ Advanced analytics dashboards (Phase 4)
- ❌ Data export functionality (Phase 4)

---

## 📚 **REFERENCE MATERIALS**

### **Read These First:**
1. `PARADIGM_SHIFT_CLINICAL_INTELLIGENCE.md` - Strategic context
2. `.agent/skills/migration-manager/SKILL.md` - Migration workflow
3. `.agent/skills/query-optimizer/SKILL.md` - Query optimization
4. `supabase/migrations/` - Existing schema

### **Existing Tables to Reference:**
- `log_clinical_records` - Actual protocols
- `log_outcomes` - Outcome measures
- `ref_substances` - Substance reference data
- `ref_indications` - Indication reference data

---

## 🎯 **DEFINITION OF DONE**

- [ ] Read all reference materials
- [ ] Design all table schemas
- [ ] Write all SQL queries
- [ ] Create performance optimization plan
- [ ] Write migration script
- [ ] Test queries with sample data
- [ ] Verify query performance (<1 sec)
- [ ] Get LEAD approval
- [ ] Hand off to INSPECTOR for review

---

## 📞 **HANDOFF TO SUBA**

**LEAD:** This is the database foundation for our clinical intelligence platform.

**Why:** Real-time data visualization only works if queries are FAST (<1 second).

**Your Mission:** Design a schema that enables sub-second aggregation queries for live benchmarking.

**Key Principle:** Optimize for read performance (queries) over write performance (inserts). Practitioners will query 100x more than they insert.

**Timeline:** 2-3 days for schema design + query patterns. Migration script can follow.

**Questions?** Ask LEAD anytime.

**Ready to build the engine?** 🚀

---

**Task Created:** 2026-02-11 16:45 PST  
**Assigned To:** SUBA  
**Status:** 🔴 AWAITING START  
**Next Step:** SUBA designs schema, then hands to INSPECTOR
