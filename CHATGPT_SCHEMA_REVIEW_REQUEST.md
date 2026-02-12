# DATABASE SCHEMA REVIEW REQUEST (Updated with Prior ChatGPT Feedback)

I'm building a psychedelic therapy research portal using PostgreSQL (Supabase). Yesterday, ChatGPT reviewed my schema and identified critical issues. Today I'm proposing a migration to fix normalization issues, but I want to ensure I'm not creating NEW problems while fixing the old ones.

## CONTEXT

**Application:** Clinical research portal for psychedelic-assisted therapy  
**Database:** PostgreSQL 15 (Supabase)  
**Users:** Multi-tenant (multiple clinics/sites)  
**Data:** De-identified clinical records, safety tracking, drug interactions  
**Critical Constraint:** NO PHI/PII collection allowed

---

## YESTERDAY'S CHATGPT FEEDBACK (Key Points)

### ✅ What I'm Doing Right:
- Using coded reference sets (LOINC, SNOMED, RxNorm, UCUM)
- Normalized structure with thin log tables
- Foreign keys to reference tables

### 🔴 Critical Issues Identified:
1. **RLS policies are too permissive** - "allow all authenticated" breaks site isolation
2. **JSONB fields create PHI risk** - `log_interventions.demographics/protocol/context`
3. **Free-text fields create PHI risk** - `log_outcomes.interpretation`
4. **Type mismatches** - `event_id` is TEXT but should be BIGINT FK
5. **Incomplete reference tables** - `ref_safety_events` has no labels/codes

### 📋 Recommended Next Steps:
1. Fix RLS policies (site isolation)
2. Replace JSONB blobs with normalized tables
3. Expand reference sets (conditions, risk factors, comedication classes)
4. Add FHIR-aligned structure

---

## TODAY'S PROPOSED MIGRATION

I'm trying to fix issues #3, #4, and #5 from yesterday's feedback. **I want to make sure I'm not violating any of yesterday's recommendations.**

---

### Change 1: Fix Type Mismatch (Addresses Yesterday's Issue #4)

**Problem:** `system_events.site_id` is BIGINT but `sites.id` is UUID (foreign key fails)

**Proposed Fix:**
```sql
ALTER TABLE public.system_events 
ALTER COLUMN site_id TYPE UUID USING NULL;

ALTER TABLE public.system_events
ADD CONSTRAINT system_events_site_id_fkey 
FOREIGN KEY (site_id) REFERENCES public.sites(id) ON DELETE CASCADE;
```

**Questions:**
1. Is `USING NULL` acceptable, or should I try to preserve data?
2. Does this align with yesterday's recommendation to "standardize: pick UUID or BIGINT and stick with it"?

---

### Change 2: Normalize ref_knowledge_graph (Addresses Yesterday's Issue #4)

**Problem:** `ref_knowledge_graph` stores substance names as TEXT instead of foreign keys

**OLD (denormalized):**
```sql
CREATE TABLE ref_knowledge_graph (
  rule_id TEXT PRIMARY KEY,
  substance_a_id TEXT,           -- ❌ Should be BIGINT FK
  substance_b_id TEXT,           -- ❌ Should be BIGINT FK
  risk_level TEXT,               -- ❌ Should be INTEGER
  severity_grade TEXT,           -- ❌ Should be BIGINT FK
  alert_message TEXT
);
```

**NEW (normalized):**
```sql
CREATE TABLE ref_knowledge_graph (
  interaction_id BIGSERIAL PRIMARY KEY,
  substance_id BIGINT NOT NULL REFERENCES ref_substances(substance_id) ON DELETE CASCADE,
  interactor_substance_id BIGINT NOT NULL REFERENCES ref_substances(substance_id) ON DELETE CASCADE,
  severity_grade_id BIGINT NOT NULL REFERENCES ref_severity_grade(severity_grade_id) ON DELETE SET NULL,
  risk_level INTEGER NOT NULL CHECK (risk_level BETWEEN 1 AND 10),
  clinical_description TEXT NOT NULL,
  mechanism TEXT,
  evidence_source TEXT,
  source_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_substance_interaction UNIQUE (substance_id, interactor_substance_id)
);
```

**Questions:**
1. Does this align with yesterday's recommendation to "fix type mismatches"?
2. Is `clinical_description` and `mechanism` as TEXT acceptable, or does this create PHI risk?
3. Should I add SNOMED codes for interaction concepts, or is this structure sufficient?

---

### Change 3: Add Medications to ref_substances

**Problem:** Need to track drug-drug interactions, but medications aren't in `ref_substances`

**Proposed Approach:** Add medications to existing `ref_substances` table:
```sql
INSERT INTO ref_substances (substance_name, substance_class, rxnorm_cui) VALUES
('SSRIs', 'medication', NULL),           -- Class, not specific drug
('MAOIs', 'medication', NULL),           -- Class, not specific drug
('Lithium', 'medication', 448203),       -- RxNorm CUI for Lithium
('Benzodiazepines', 'medication', NULL), -- Class, not specific drug
('Alcohol', 'substance', NULL),
('Stimulants', 'medication', NULL),      -- Class, not specific drug
('QT-Prolonging Agents', 'medication', NULL);
```

**Alternative:** Create separate `ref_medications` or `ref_comedication_classes` table (as recommended yesterday)

**Questions:**
1. Yesterday's feedback recommended `ref_comedication_classes` - should I create a separate table instead?
2. Is storing medication **classes** (not specific drugs) acceptable for PHI safety?
3. Should I use RxNorm TTY (term type) to distinguish classes vs ingredients?

---

### Change 4: Add updated_at Triggers

**Proposed:**
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ref_substances_updated_at
BEFORE UPDATE ON ref_substances
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

**Question:** Is this standard PostgreSQL practice?

---

### Change 5: Seed Drug Interactions

**Proposed:**
```sql
INSERT INTO ref_knowledge_graph 
  (substance_id, interactor_substance_id, severity_grade_id, risk_level, clinical_description, mechanism, evidence_source, source_url, is_verified)
VALUES
  (
    (SELECT substance_id FROM ref_substances WHERE substance_name = 'Psilocybin'),
    (SELECT substance_id FROM ref_substances WHERE substance_name = 'Lithium'),
    4,  -- Grade 4 = Life-Threatening (from ref_severity_grade)
    10,
    'High risk of seizures, fugue state, and HPPD. Even therapeutic doses of Lithium can lower the seizure threshold significantly when combined with tryptamines.',
    'Synergistic 5-HT2A potentiation & sodium channel modulation.',
    'National Library of Medicine / PubMed (2024)',
    'https://pubmed.ncbi.nlm.nih.gov/',
    true
  );
  -- ... 8 more interactions
```

**Questions:**
1. Is storing clinical descriptions as TEXT a PHI risk? (It's reference data, not patient data)
2. Should I add SNOMED codes for interaction mechanisms?
3. Is SELECT subquery in INSERT efficient for ~100-500 interactions?

---

## CRITICAL QUESTIONS (In Light of Yesterday's Feedback)

### 1. RLS Policies (Yesterday's Issue #1)
**My current migration does NOT fix RLS policies.** Should I:
- Fix RLS in this migration (add site isolation)?
- Create a separate migration for RLS fixes?
- What's the correct RLS policy pattern for `ref_knowledge_graph`?

### 2. JSONB Fields (Yesterday's Issue #2)
**My current migration does NOT address JSONB blobs in `log_interventions`.** Should I:
- Tackle this in a separate migration?
- Create normalized tables (`log_exposures`, `log_context_factors`) now?
- What's the priority order?

### 3. Reference Table Expansion (Yesterday's Recommendation)
Yesterday's feedback recommended adding:
- `ref_conditions` (SNOMED)
- `ref_risk_factors` (SNOMED)
- `ref_comedication_classes` (RxNorm-derived)
- `ref_ae_event_concepts` (SNOMED)
- `ref_ae_severity` (HL7 FHIR)
- `ref_ae_seriousness` (HL7 FHIR)
- `ref_ae_causality_assessment` (HL7 FHIR)

**Should I add these in this migration, or separate migrations?**

### 4. Type Standardization (Yesterday's Recommendation)
Yesterday's feedback said "pick UUID or BIGINT and stick with it."

**Current state:**
- Core tables (`sites`, `log_clinical_records`): UUID
- Reference tables (`ref_substances`, `ref_routes`): BIGSERIAL

**Is this mixed approach acceptable, or should I standardize everything to UUID?**

---

## SPECIFIC QUESTIONS FOR THIS MIGRATION

1. **Type conversion:** Best way to convert `site_id` from BIGINT to UUID when existing data can't be converted?

2. **Normalization:** Does my normalized `ref_knowledge_graph` structure follow PostgreSQL best practices AND yesterday's recommendations?

3. **Medication Classes vs Specific Drugs:** Should medications be:
   - Option A: In `ref_substances` as classes (SSRIs, MAOIs)
   - Option B: In separate `ref_comedication_classes` table
   - Option C: In `ref_substances` as specific drugs with RxNorm CUIs

4. **PHI Risk:** Does storing `clinical_description` and `mechanism` as TEXT in `ref_knowledge_graph` create PHI risk? (It's reference data, not patient data)

5. **Foreign Key Actions:** When should I use `ON DELETE CASCADE` vs `ON DELETE SET NULL`?

6. **Unique Constraints:** How do I prevent both (A,B) and (B,A) from being inserted as separate rows?

7. **Migration Safety:** Is DROP/CREATE safe for `ref_knowledge_graph`, or should I try to preserve existing data?

8. **RLS Priority:** Should I fix RLS policies in this migration, or separate migration?

---

## ADDITIONAL CONTEXT

**Current Schema:**
- 18 tables total
- Multi-tenant with RLS (but policies are too permissive per yesterday's feedback)
- Reference tables use BIGSERIAL primary keys
- Core tables use UUID primary keys
- All tables have `created_at`, most have `updated_at`

**Data Volume (Expected):**
- `ref_substances`: ~20 rows
- `ref_knowledge_graph`: ~100-500 interactions
- `log_clinical_records`: ~10,000-100,000 rows

**PostgreSQL Version:** 15 (Supabase)

**Yesterday's Key Warnings:**
1. "Do not import 'all of SNOMED' or 'all of LOINC' - build curated subsets"
2. "If you keep JSONB blobs, clinicians will eventually paste PHI into them"
3. "Fix RLS before real data volume grows"

---

## WHAT I NEED FROM YOU

Please review this migration plan and tell me:

1. **Does this migration align with yesterday's recommendations?**
2. **Am I creating any NEW problems while fixing old ones?**
3. **Should I split this into multiple migrations?** (e.g., normalization first, then RLS, then reference expansion)
4. **What's the correct priority order?**
   - Fix type mismatches?
   - Fix RLS policies?
   - Normalize tables?
   - Expand reference sets?
5. **Any red flags or "don't do this" patterns?**

Thank you!
