# SOOP Handoff - Protocol Builder Database Requirements

**From:** LEAD  
**To:** SOOP  
**Date:** Feb 13, 2026, 3:44 AM  
**Priority:** HIGH - Feb 15 Demo Deadline

---

## Executive Summary

USER has approved DESIGNER's **full Clinical Decision Support System** for Protocol Builder. This requires significant database work including materialized views, receptor affinity data, and drug interaction tables.

**Timeline:** 2 days until Feb 15 demo (11:15 AM)

**Your Deliverables:**
1. Schema validation and migrations
2. Materialized views for real-time analytics
3. Receptor affinity data population
4. Drug interaction data population
5. Performance optimization

---

## Design Documents (Review Required)

**DESIGNER's Complete Specifications:**
1. [final_design_spec.md](file:///Users/trevorcalton/.gemini/antigravity/brain/2992a0bd-f2e2-4986-ac75-583e85c925f4/final_design_spec.md) - Complete design with 3 mockups
2. [implementation_plan.md](file:///Users/trevorcalton/.gemini/antigravity/brain/2992a0bd-f2e2-4986-ac75-583e85c925f4/implementation_plan.md) - Database architecture
3. [LEAD_REVIEW_REQUEST.md](file:///Users/trevorcalton/.gemini/antigravity/brain/2992a0bd-f2e2-4986-ac75-583e85c925f4/LEAD_REVIEW_REQUEST.md) - Database questions

---

## Database Requirements

### 1. Patient Lookup Query

**Requirement:** Search existing patients by characteristics (NO PHI)

**Search Fields:**
- `age_range` (e.g., '36-45')
- `biological_sex` (Male, Female, Intersex, Unknown)
- `weight_range` (e.g., '71-80kg')
- `indication_id` (FK to ref_indications)
- `substance_id` (FK to ref_substances)
- `session_date` (filter by recency)

**Proposed Query:**
```sql
SELECT 
  subject_id,
  age_range,
  biological_sex,
  weight_range,
  indication_id,
  substance_id,
  session_date,
  session_number,
  COUNT(*) OVER (PARTITION BY subject_id) as total_sessions
FROM log_clinical_records
WHERE 
  age_range = $1
  AND biological_sex = $2
  AND weight_range = $3
  AND indication_id = $4
  AND substance_id = $5
  AND session_date >= NOW() - INTERVAL '30 days'
ORDER BY session_date DESC
LIMIT 50;
```

**Tasks:**
- [ ] Verify all search fields exist in `log_clinical_records`
- [ ] Create index on `(subject_id, session_date)` for performance
- [ ] Test query with sample data
- [ ] Verify performance (< 100ms)

---

### 2. Session Auto-Increment

**Requirement:** Duplicate last record and auto-increment `session_number`

**Proposed Logic:**
```sql
-- Step 1: Get last session number
SELECT MAX(session_number) 
FROM log_clinical_records 
WHERE subject_id = $1;

-- Step 2: Insert new record with session_number + 1
INSERT INTO log_clinical_records (
  subject_id,
  session_number,
  age_range,
  biological_sex,
  weight_range,
  -- ... all other fields from last record
  submitted_at  -- NULL until user clicks "Submit to Registry"
)
SELECT 
  subject_id,
  MAX(session_number) + 1,
  age_range,
  biological_sex,
  weight_range,
  -- ... all other fields
  NULL as submitted_at
FROM log_clinical_records
WHERE subject_id = $1
GROUP BY subject_id, age_range, biological_sex, weight_range /* ... */;
```

**Tasks:**
- [ ] Confirm `session_number` field exists (add if missing)
- [ ] Test duplicate record logic
- [ ] Verify all fields are copied correctly
- [ ] Add constraint: `session_number` must be unique per `subject_id`

---

### 3. Submission Status Tracking

**Requirement:** Track draft vs. submitted protocols

**Proposed Field:**
- `submitted_at` (TIMESTAMPTZ, nullable)
  - `NULL` = Draft (not yet submitted)
  - `TIMESTAMP` = Submitted to registry (official record)

**Tasks:**
- [ ] Confirm `submitted_at` field exists (add if missing)
- [ ] Update RLS policies to allow drafts
- [ ] Test draft → submitted workflow

---

### 4. Materialized Views for Analytics

**Requirement:** Real-time analytics in Clinical Insights panel

#### a) `mv_outcomes_summary`
```sql
CREATE MATERIALIZED VIEW mv_outcomes_summary AS
SELECT 
  indication_id,
  substance_id,
  age_range,
  biological_sex,
  weight_range,
  COUNT(*) as total_sessions,
  AVG(phq9_post - phq9_baseline) as avg_improvement,
  COUNT(CASE WHEN phq9_post < 5 THEN 1 END)::float / COUNT(*)::float as remission_rate,
  STDDEV(phq9_post - phq9_baseline) as std_dev,
  MIN(phq9_post - phq9_baseline) as min_improvement,
  MAX(phq9_post - phq9_baseline) as max_improvement
FROM log_clinical_records
WHERE submitted_at IS NOT NULL
GROUP BY indication_id, substance_id, age_range, biological_sex, weight_range;

CREATE INDEX idx_mv_outcomes_lookup ON mv_outcomes_summary(indication_id, substance_id, age_range, biological_sex, weight_range);
```

#### b) `mv_clinic_benchmarks`
```sql
CREATE MATERIALIZED VIEW mv_clinic_benchmarks AS
SELECT 
  site_id,
  substance_id,
  indication_id,
  COUNT(*) as total_sessions,
  AVG(phq9_post - phq9_baseline) as avg_improvement,
  COUNT(CASE WHEN phq9_post < 5 THEN 1 END)::float / COUNT(*)::float as remission_rate
FROM log_clinical_records
WHERE submitted_at IS NOT NULL
GROUP BY site_id, substance_id, indication_id;

CREATE INDEX idx_mv_clinic_lookup ON mv_clinic_benchmarks(site_id, substance_id, indication_id);
```

#### c) `mv_network_benchmarks`
```sql
CREATE MATERIALIZED VIEW mv_network_benchmarks AS
SELECT 
  substance_id,
  indication_id,
  COUNT(*) as total_sessions,
  AVG(phq9_post - phq9_baseline) as avg_improvement,
  COUNT(CASE WHEN phq9_post < 5 THEN 1 END)::float / COUNT(*)::float as remission_rate
FROM log_clinical_records
WHERE submitted_at IS NOT NULL
GROUP BY substance_id, indication_id;

CREATE INDEX idx_mv_network_lookup ON mv_network_benchmarks(substance_id, indication_id);
```

**Refresh Strategy:**
```sql
-- Set up pg_cron for automatic refresh (hourly)
SELECT cron.schedule('refresh_outcomes_summary', '0 * * * *', 
  'REFRESH MATERIALIZED VIEW CONCURRENTLY mv_outcomes_summary');
SELECT cron.schedule('refresh_clinic_benchmarks', '0 * * * *', 
  'REFRESH MATERIALIZED VIEW CONCURRENTLY mv_clinic_benchmarks');
SELECT cron.schedule('refresh_network_benchmarks', '0 * * * *', 
  'REFRESH MATERIALIZED VIEW CONCURRENTLY mv_network_benchmarks');
```

**Tasks:**
- [ ] Create all 3 materialized views
- [ ] Create indexes for fast lookups
- [ ] Set up pg_cron for hourly refresh
- [ ] Test query performance (< 50ms)
- [ ] Verify data accuracy with sample data

---

### 5. Receptor Affinity Data

**Requirement:** Enhance `ref_substances` with receptor binding data

**Proposed Schema:**
```sql
ALTER TABLE ref_substances
ADD COLUMN receptor_5ht2a_ki NUMERIC,  -- Ki affinity in nM
ADD COLUMN receptor_5ht1a_ki NUMERIC,
ADD COLUMN receptor_5ht2c_ki NUMERIC,
ADD COLUMN receptor_d2_ki NUMERIC,
ADD COLUMN receptor_sert_ki NUMERIC,
ADD COLUMN receptor_nmda_ki NUMERIC,
ADD COLUMN primary_mechanism TEXT;

COMMENT ON COLUMN ref_substances.receptor_5ht2a_ki IS 'Ki affinity for 5-HT2A receptor (nM)';
COMMENT ON COLUMN ref_substances.primary_mechanism IS 'Primary mechanism of action (e.g., 5-HT2A Agonism)';
```

**Data Population (Example for Psilocybin):**
```sql
UPDATE ref_substances
SET 
  receptor_5ht2a_ki = 6.0,
  receptor_5ht1a_ki = 150.0,
  receptor_5ht2c_ki = 20.0,
  receptor_d2_ki = 5000.0,
  receptor_sert_ki = 1000.0,
  receptor_nmda_ki = 10000.0,
  primary_mechanism = '5-HT2A Agonism'
WHERE substance_name = 'Psilocybin';
```

**Data Sources:**
- **PDSP Ki Database:** https://pdsp.unc.edu/databases/kidb.php
- **PubChem:** https://pubchem.ncbi.nlm.nih.gov/
- **DrugBank:** https://go.drugbank.com/

**Tasks:**
- [ ] Add receptor affinity columns to `ref_substances`
- [ ] Research and populate data for all 8 substances (Psilocybin, MDMA, Ketamine, LSD-25, 5-MeO-DMT, Ibogaine, Mescaline, Other)
- [ ] Add comments to columns
- [ ] Verify data accuracy with scientific literature

---

### 6. Drug Interaction Data

**Requirement:** Display drug interactions with severity indicators

**Proposed Schema:**
```sql
CREATE TABLE IF NOT EXISTS ref_knowledge_graph (
  id SERIAL PRIMARY KEY,
  substance_id INT REFERENCES ref_substances(substance_id),
  medication_id INT REFERENCES ref_medications(medication_id),
  interaction_severity TEXT CHECK (interaction_severity IN ('SEVERE', 'MODERATE', 'MILD')),
  risk_description TEXT,
  clinical_recommendation TEXT,
  pubmed_reference TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_knowledge_graph_lookup ON ref_knowledge_graph(substance_id, medication_id);
```

**Example Data:**
```sql
INSERT INTO ref_knowledge_graph (substance_id, medication_id, interaction_severity, risk_description, clinical_recommendation, pubmed_reference)
VALUES 
  (
    (SELECT substance_id FROM ref_substances WHERE substance_name = 'Psilocybin'),
    (SELECT medication_id FROM ref_medications WHERE medication_name = 'Lithium'),
    'MODERATE',
    'Serotonin syndrome risk',
    'Monitor closely, consider dose reduction',
    'https://pubmed.ncbi.nlm.nih.gov/12345678/'
  ),
  (
    (SELECT substance_id FROM ref_substances WHERE substance_name = 'Psilocybin'),
    (SELECT medication_id FROM ref_medications WHERE medication_name = 'Sertraline (Zoloft)'),
    'MILD',
    'Reduced efficacy of psilocybin',
    'Consider tapering SSRI 2 weeks prior',
    'https://pubmed.ncbi.nlm.nih.gov/87654321/'
  );
```

**Data Sources:**
- **DrugBank:** https://go.drugbank.com/
- **FDA Drug Interactions:** https://www.fda.gov/drugs/drug-interactions-labeling
- **Clinical literature:** PubMed

**Tasks:**
- [ ] Create `ref_knowledge_graph` table
- [ ] Create index for fast lookups
- [ ] Research and populate interactions for all 8 substances × 60 medications (480 combinations)
- [ ] Prioritize common/high-risk interactions first
- [ ] Add RLS policies

---

## Performance Requirements

**Query Performance Targets:**
- Patient lookup: < 100ms
- Materialized view queries: < 50ms
- Drug interaction lookup: < 50ms
- Receptor affinity lookup: < 10ms (simple SELECT)

**Optimization Strategies:**
- [ ] Create indexes on all foreign keys
- [ ] Create composite indexes for multi-column lookups
- [ ] Use EXPLAIN ANALYZE to verify query plans
- [ ] Consider partitioning `log_clinical_records` by date if > 100k rows

---

## RLS Policies

**Required Policies:**
- [ ] Authenticated users can query all reference tables
- [ ] Authenticated users can query materialized views
- [ ] Authenticated users can insert into `log_clinical_records`
- [ ] Authenticated users can update `submitted_at` field
- [ ] Users can only see their own drafts (`submitted_at IS NULL`)
- [ ] Users can see all submitted records (`submitted_at IS NOT NULL`)

---

## Migration Plan

**Recommended Order:**
1. **Migration 013:** Add `submitted_at` and `session_number` fields
2. **Migration 014:** Add receptor affinity columns to `ref_substances`
3. **Migration 015:** Create `ref_knowledge_graph` table
4. **Migration 016:** Create materialized views
5. **Migration 017:** Populate receptor affinity data
6. **Migration 018:** Populate drug interaction data
7. **Migration 019:** Set up pg_cron for materialized view refresh

**Estimated Time:**
- Migrations 013-016: 2-3 hours
- Data population (017-018): 4-6 hours
- Testing & optimization: 2-3 hours
- **Total: 8-12 hours**

---

## Testing Checklist

- [ ] Patient lookup returns correct results
- [ ] Session auto-increment works correctly
- [ ] Draft → submitted workflow works
- [ ] Materialized views return accurate data
- [ ] Receptor affinity data displays correctly
- [ ] Drug interaction alerts trigger correctly
- [ ] All queries meet performance targets
- [ ] RLS policies enforce correct access control

---

## Rollback Plan

**If issues arise:**
1. Each migration should be reversible
2. Keep backup of production data
3. Test all migrations in dev environment first
4. Have rollback scripts ready

---

## Next Steps

1. **Review DESIGNER's specifications** (links at top)
2. **Create migrations 013-019**
3. **Populate receptor affinity data** (research required)
4. **Populate drug interaction data** (research required)
5. **Test all queries and verify performance**
6. **Report back to LEAD when complete**

**Estimated Completion:** Feb 14, 5:00 PM (allows 18 hours for BUILDER implementation)

---

## Questions for LEAD

- [ ] Should we use pg_cron or manual refresh for materialized views?
- [ ] What's the priority order for drug interaction data population?
- [ ] Should we create a separate task for data population or include in migrations?
- [ ] Are there any existing receptor affinity or drug interaction data sources we should use?

**Awaiting SOOP confirmation to proceed.**
