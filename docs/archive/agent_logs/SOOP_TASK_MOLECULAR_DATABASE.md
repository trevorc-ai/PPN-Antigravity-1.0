# 🧬 SOOP TASK: MOLECULAR DATABASE INFRASTRUCTURE
## 3D Molecules, Receptors, Pharmacology & MEQ30

**Assigned To:** SOOP (Database & Backend Specialist)  
**Reviewed By:** INSPECTOR (QA & Validation)  
**Managed By:** LEAD  
**Date:** 2026-02-12 02:42 PST  
**Priority:** HIGH  
**Context:** Build comprehensive molecular database for all ref_substances

---

## 🎯 OBJECTIVE

Build a comprehensive molecular and pharmacological database that enables:
1. **3D Molecule Visualization** - Render accurate 3D structures for all substances
2. **Receptor Binding Profiles** - Show which receptors each substance binds to
3. **Mechanism of Action** - Explain how substances work at molecular level
4. **MEQ30 Integration** - Mystical Experience Questionnaire (30-item) tracking
5. **Pharmacokinetics** - Absorption, distribution, metabolism, excretion data

---

## 📋 DATABASE SCHEMA

### **Table 1: ref_molecules**
**Purpose:** Store 3D molecular structure data for all substances

```sql
CREATE TABLE ref_molecules (
  molecule_id BIGSERIAL PRIMARY KEY,
  substance_id BIGINT NOT NULL REFERENCES ref_substances(substance_id),
  
  -- Chemical identifiers
  iupac_name TEXT NOT NULL, -- International Union of Pure and Applied Chemistry name
  molecular_formula TEXT NOT NULL, -- e.g., "C12H17N2O4P" for psilocybin
  molecular_weight NUMERIC(10,2) NOT NULL, -- in g/mol
  smiles TEXT NOT NULL, -- Simplified Molecular Input Line Entry System
  inchi TEXT, -- International Chemical Identifier
  inchi_key TEXT, -- Hashed InChI for faster lookups
  
  -- 3D structure data
  pdb_data TEXT, -- Protein Data Bank format (3D coordinates)
  mol2_data TEXT, -- Tripos Mol2 format (alternative 3D format)
  sdf_data TEXT, -- Structure Data File format
  
  -- PubChem integration
  pubchem_cid BIGINT, -- PubChem Compound ID
  pubchem_url TEXT, -- Link to PubChem page
  
  -- Visual properties
  color_hex TEXT DEFAULT '#6366f1', -- Default color for 3D rendering
  glow_intensity NUMERIC(3,2) DEFAULT 0.5, -- 0.0 to 1.0
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_substance_molecule UNIQUE (substance_id)
);

-- Indexes
CREATE INDEX idx_molecules_substance ON ref_molecules(substance_id);
CREATE INDEX idx_molecules_pubchem ON ref_molecules(pubchem_cid);
CREATE INDEX idx_molecules_inchi_key ON ref_molecules(inchi_key);

-- RLS
ALTER TABLE ref_molecules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view molecules"
  ON ref_molecules FOR SELECT
  USING (true); -- Public data

CREATE POLICY "Only network_admin can modify molecules"
  ON ref_molecules FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_sites
      WHERE user_sites.user_id = auth.uid()
      AND user_sites.role = 'network_admin'
    )
  );
```

**INSPECTOR VALIDATION:**
- [ ] Verify SMILES strings are valid (use RDKit or similar)
- [ ] Verify molecular formulas match SMILES
- [ ] Verify molecular weights are accurate
- [ ] Verify PubChem CIDs are correct
- [ ] Test 3D structure rendering (PDB data)

---

### **Table 2: ref_receptors**
**Purpose:** Store receptor types that psychedelics bind to

```sql
CREATE TABLE ref_receptors (
  receptor_id BIGSERIAL PRIMARY KEY,
  
  -- Receptor identification
  receptor_name TEXT NOT NULL UNIQUE, -- e.g., "5-HT2A", "D2", "NMDA"
  receptor_full_name TEXT NOT NULL, -- e.g., "Serotonin 2A Receptor"
  receptor_family TEXT NOT NULL, -- e.g., "Serotonin", "Dopamine", "Glutamate"
  
  -- Classification
  receptor_type TEXT NOT NULL CHECK (receptor_type IN (
    'GPCR', -- G-protein coupled receptor
    'ion_channel', -- Ion channel
    'enzyme', -- Enzyme
    'transporter', -- Neurotransmitter transporter
    'other'
  )),
  
  -- Function
  primary_function TEXT, -- e.g., "Mood regulation, perception"
  brain_regions TEXT[], -- e.g., ["prefrontal cortex", "amygdala", "hippocampus"]
  
  -- Visual properties (for receptor binding diagram)
  color_hex TEXT DEFAULT '#10b981', -- Green for receptors
  icon_name TEXT, -- e.g., "receptor-5ht2a"
  
  -- External links
  uniprot_id TEXT, -- UniProt protein database ID
  genecards_url TEXT, -- Link to GeneCards
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_receptors_name ON ref_receptors(receptor_name);
CREATE INDEX idx_receptors_family ON ref_receptors(receptor_family);

-- RLS
ALTER TABLE ref_receptors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view receptors"
  ON ref_receptors FOR SELECT
  USING (true);

CREATE POLICY "Only network_admin can modify receptors"
  ON ref_receptors FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_sites
      WHERE user_sites.user_id = auth.uid()
      AND user_sites.role = 'network_admin'
    )
  );
```

**INSPECTOR VALIDATION:**
- [ ] Verify receptor names are standard nomenclature
- [ ] Verify receptor families are correct
- [ ] Verify UniProt IDs are valid
- [ ] Test receptor type classification

---

### **Table 3: ref_receptor_binding**
**Purpose:** Map substances to receptors with binding affinity data

```sql
CREATE TABLE ref_receptor_binding (
  binding_id BIGSERIAL PRIMARY KEY,
  substance_id BIGINT NOT NULL REFERENCES ref_substances(substance_id),
  receptor_id BIGINT NOT NULL REFERENCES ref_receptors(receptor_id),
  
  -- Binding affinity
  ki_value NUMERIC(10,2), -- Inhibition constant (nM) - lower = stronger binding
  ki_unit TEXT DEFAULT 'nM', -- nanomolar
  
  -- Binding type
  binding_type TEXT NOT NULL CHECK (binding_type IN (
    'agonist', -- Activates receptor
    'partial_agonist', -- Partially activates receptor
    'antagonist', -- Blocks receptor
    'inverse_agonist', -- Reduces baseline receptor activity
    'allosteric_modulator' -- Modulates receptor indirectly
  )),
  
  -- Efficacy
  efficacy_percent NUMERIC(5,2), -- 0-100% (for agonists/partial agonists)
  
  -- Clinical relevance
  clinical_significance TEXT CHECK (clinical_significance IN (
    'primary', -- Main mechanism of action
    'secondary', -- Contributing mechanism
    'minor', -- Minimal clinical impact
    'unknown'
  )),
  
  -- Evidence
  evidence_level TEXT CHECK (evidence_level IN (
    'high', -- Multiple peer-reviewed studies
    'moderate', -- Some peer-reviewed studies
    'low', -- Limited evidence
    'theoretical' -- Predicted but not confirmed
  )),
  
  -- Sources
  pubmed_ids TEXT[], -- Array of PubMed IDs
  source_url TEXT, -- Link to primary source
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_substance_receptor UNIQUE (substance_id, receptor_id)
);

-- Indexes
CREATE INDEX idx_binding_substance ON ref_receptor_binding(substance_id);
CREATE INDEX idx_binding_receptor ON ref_receptor_binding(receptor_id);
CREATE INDEX idx_binding_significance ON ref_receptor_binding(clinical_significance);

-- RLS
ALTER TABLE ref_receptor_binding ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view receptor binding"
  ON ref_receptor_binding FOR SELECT
  USING (true);

CREATE POLICY "Only network_admin can modify receptor binding"
  ON ref_receptor_binding FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_sites
      WHERE user_sites.user_id = auth.uid()
      AND user_sites.role = 'network_admin'
    )
  );
```

**INSPECTOR VALIDATION:**
- [ ] Verify Ki values are from peer-reviewed sources
- [ ] Verify binding types are correct (agonist vs. antagonist)
- [ ] Verify clinical significance matches literature
- [ ] Verify PubMed IDs are valid

---

### **Table 4: ref_meq30_questions**
**Purpose:** Store Mystical Experience Questionnaire (30-item) questions

```sql
CREATE TABLE ref_meq30_questions (
  question_id BIGSERIAL PRIMARY KEY,
  
  -- Question details
  question_number INTEGER NOT NULL UNIQUE CHECK (question_number BETWEEN 1 AND 30),
  question_text TEXT NOT NULL,
  
  -- Subscale classification
  subscale TEXT NOT NULL CHECK (subscale IN (
    'mystical', -- Mystical experience (7 items)
    'positive_mood', -- Positive mood (6 items)
    'transcendence', -- Transcendence of time and space (6 items)
    'ineffability', -- Ineffability and paradoxicality (6 items)
    'negative', -- Negative experiences (5 items)
  )),
  
  -- Scoring
  reverse_scored BOOLEAN DEFAULT false, -- Some items are reverse-scored
  
  -- Response scale (0-5)
  scale_0_label TEXT DEFAULT 'None; not at all',
  scale_1_label TEXT DEFAULT 'So slight cannot decide',
  scale_2_label TEXT DEFAULT 'Slight',
  scale_3_label TEXT DEFAULT 'Moderate',
  scale_4_label TEXT DEFAULT 'Strong (equivalent in degree to any previous strong experience)',
  scale_5_label TEXT DEFAULT 'Extreme (more than ever before in my life)',
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_meq30_subscale ON ref_meq30_questions(subscale);

-- RLS
ALTER TABLE ref_meq30_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view MEQ30 questions"
  ON ref_meq30_questions FOR SELECT
  USING (true);

CREATE POLICY "Only network_admin can modify MEQ30 questions"
  ON ref_meq30_questions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_sites
      WHERE user_sites.user_id = auth.uid()
      AND user_sites.role = 'network_admin'
    )
  );
```

**INSPECTOR VALIDATION:**
- [ ] Verify all 30 questions are present
- [ ] Verify subscale assignments match published MEQ30
- [ ] Verify reverse-scored items are correct
- [ ] Verify scale labels match published MEQ30

---

### **Table 5: log_meq30_responses**
**Purpose:** Store patient responses to MEQ30 questionnaire

```sql
CREATE TABLE log_meq30_responses (
  response_id BIGSERIAL PRIMARY KEY,
  clinical_record_id BIGINT NOT NULL REFERENCES log_clinical_records(id),
  site_id BIGINT NOT NULL REFERENCES sites(site_id),
  
  -- Timing
  assessment_timepoint TEXT NOT NULL CHECK (assessment_timepoint IN (
    'baseline', -- Before session
    'immediate', -- Immediately after session (within 24 hours)
    'followup_1week', -- 1 week post-session
    'followup_1month', -- 1 month post-session
    'followup_3month', -- 3 months post-session
    'followup_6month' -- 6 months post-session
  )),
  
  -- Responses (JSONB for flexibility)
  responses JSONB NOT NULL, -- { "1": 4, "2": 5, "3": 3, ... }
  
  -- Calculated scores
  total_score INTEGER, -- Sum of all items (0-150)
  mystical_score NUMERIC(5,2), -- Mystical subscale (0-35)
  positive_mood_score NUMERIC(5,2), -- Positive mood subscale (0-30)
  transcendence_score NUMERIC(5,2), -- Transcendence subscale (0-30)
  ineffability_score NUMERIC(5,2), -- Ineffability subscale (0-30)
  negative_score NUMERIC(5,2), -- Negative experiences subscale (0-25)
  
  -- Metadata
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_record_timepoint UNIQUE (clinical_record_id, assessment_timepoint)
);

-- Indexes
CREATE INDEX idx_meq30_responses_record ON log_meq30_responses(clinical_record_id);
CREATE INDEX idx_meq30_responses_site ON log_meq30_responses(site_id);
CREATE INDEX idx_meq30_responses_timepoint ON log_meq30_responses(assessment_timepoint);

-- RLS
ALTER TABLE log_meq30_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their site's MEQ30 responses"
  ON log_meq30_responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_sites
      WHERE user_sites.site_id = log_meq30_responses.site_id
      AND user_sites.user_id = auth.uid()
    )
  );

CREATE POLICY "Clinicians can insert MEQ30 responses"
  ON log_meq30_responses FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_sites
      WHERE user_sites.site_id = log_meq30_responses.site_id
      AND user_sites.user_id = auth.uid()
      AND user_sites.role IN ('clinician', 'site_admin', 'network_admin')
    )
  );
```

**INSPECTOR VALIDATION:**
- [ ] Verify responses are 0-5 for each question
- [ ] Verify total score calculation (sum of all items)
- [ ] Verify subscale score calculations
- [ ] Verify reverse-scored items are handled correctly
- [ ] Test RLS: users can only see their site's responses

---

### **Table 6: ref_pharmacokinetics**
**Purpose:** Store ADME (Absorption, Distribution, Metabolism, Excretion) data

```sql
CREATE TABLE ref_pharmacokinetics (
  pk_id BIGSERIAL PRIMARY KEY,
  substance_id BIGINT NOT NULL REFERENCES ref_substances(substance_id),
  route_id BIGINT NOT NULL REFERENCES ref_routes(route_id),
  
  -- Absorption
  bioavailability_percent NUMERIC(5,2), -- % of dose that reaches systemic circulation
  tmax_minutes INTEGER, -- Time to peak plasma concentration (minutes)
  
  -- Distribution
  volume_distribution_l_kg NUMERIC(10,2), -- Volume of distribution (L/kg)
  protein_binding_percent NUMERIC(5,2), -- % bound to plasma proteins
  crosses_bbb BOOLEAN DEFAULT true, -- Crosses blood-brain barrier?
  
  -- Metabolism
  primary_metabolite TEXT, -- e.g., "psilocin" for psilocybin
  metabolic_pathway TEXT, -- e.g., "dephosphorylation by alkaline phosphatase"
  cyp_enzymes TEXT[], -- Cytochrome P450 enzymes involved
  
  -- Excretion
  half_life_minutes INTEGER, -- Elimination half-life (minutes)
  clearance_ml_min_kg NUMERIC(10,2), -- Clearance rate (mL/min/kg)
  excretion_route TEXT, -- e.g., "renal (65%), fecal (35%)"
  
  -- Onset and duration
  onset_minutes INTEGER, -- Time to onset of effects
  peak_minutes INTEGER, -- Time to peak effects
  duration_minutes INTEGER, -- Total duration of effects
  
  -- Sources
  pubmed_ids TEXT[],
  source_url TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_substance_route_pk UNIQUE (substance_id, route_id)
);

-- Indexes
CREATE INDEX idx_pk_substance ON ref_pharmacokinetics(substance_id);
CREATE INDEX idx_pk_route ON ref_pharmacokinetics(route_id);

-- RLS
ALTER TABLE ref_pharmacokinetics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view pharmacokinetics"
  ON ref_pharmacokinetics FOR SELECT
  USING (true);

CREATE POLICY "Only network_admin can modify pharmacokinetics"
  ON ref_pharmacokinetics FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_sites
      WHERE user_sites.user_id = auth.uid()
      AND user_sites.role = 'network_admin'
    )
  );
```

**INSPECTOR VALIDATION:**
- [ ] Verify bioavailability is 0-100%
- [ ] Verify half-life values match literature
- [ ] Verify onset/peak/duration are consistent
- [ ] Verify CYP enzyme interactions are accurate

---

## 📊 SEED DATA

### **Seed Data 1: Psilocybin Molecule**

```sql
INSERT INTO ref_molecules (
  substance_id,
  iupac_name,
  molecular_formula,
  molecular_weight,
  smiles,
  inchi,
  inchi_key,
  pubchem_cid,
  pubchem_url,
  color_hex,
  glow_intensity
) VALUES (
  (SELECT substance_id FROM ref_substances WHERE substance_name = 'Psilocybin'),
  '3-[2-(dimethylamino)ethyl]-1H-indol-4-yl dihydrogen phosphate',
  'C12H17N2O4P',
  284.25,
  'CN(C)CCc1c[nH]c2c1cccc2OP(O)(O)=O',
  'InChI=1S/C12H17N2O4P/c1-14(2)6-5-9-8-13-10-3-4-11(12(9)10)18-19(15,16)17/h3-4,8,13H,5-6H2,1-2H3,(H2,15,16,17)',
  'LSQODMMGCFXVRY-UHFFFAOYSA-N',
  10624,
  'https://pubchem.ncbi.nlm.nih.gov/compound/10624',
  '#8b5cf6', -- Purple
  0.7
);
```

---

### **Seed Data 2: Key Receptors**

```sql
INSERT INTO ref_receptors (receptor_name, receptor_full_name, receptor_family, receptor_type, primary_function, brain_regions, color_hex) VALUES
('5-HT2A', 'Serotonin 2A Receptor', 'Serotonin', 'GPCR', 'Perception, mood, cognition', ARRAY['prefrontal cortex', 'visual cortex', 'amygdala'], '#10b981'),
('5-HT1A', 'Serotonin 1A Receptor', 'Serotonin', 'GPCR', 'Anxiety regulation, mood', ARRAY['hippocampus', 'raphe nuclei', 'amygdala'], '#3b82f6'),
('5-HT2C', 'Serotonin 2C Receptor', 'Serotonin', 'GPCR', 'Appetite, mood, anxiety', ARRAY['hypothalamus', 'choroid plexus'], '#8b5cf6'),
('D2', 'Dopamine D2 Receptor', 'Dopamine', 'GPCR', 'Motivation, reward, movement', ARRAY['striatum', 'nucleus accumbens'], '#f59e0b'),
('NMDA', 'N-methyl-D-aspartate Receptor', 'Glutamate', 'ion_channel', 'Learning, memory, synaptic plasticity', ARRAY['hippocampus', 'cortex'], '#ef4444'),
('SERT', 'Serotonin Transporter', 'Serotonin', 'transporter', 'Serotonin reuptake', ARRAY['raphe nuclei', 'cortex'], '#06b6d4');
```

---

### **Seed Data 3: Psilocybin Receptor Binding**

```sql
INSERT INTO ref_receptor_binding (substance_id, receptor_id, ki_value, binding_type, efficacy_percent, clinical_significance, evidence_level, pubmed_ids) VALUES
(
  (SELECT substance_id FROM ref_substances WHERE substance_name = 'Psilocybin'),
  (SELECT receptor_id FROM ref_receptors WHERE receptor_name = '5-HT2A'),
  6.0, -- Ki = 6 nM (psilocin, active metabolite)
  'agonist',
  85.0, -- 85% efficacy
  'primary',
  'high',
  ARRAY['10611634', '11157079', '30282963']
),
(
  (SELECT substance_id FROM ref_substances WHERE substance_name = 'Psilocybin'),
  (SELECT receptor_id FROM ref_receptors WHERE receptor_name = '5-HT1A'),
  120.0, -- Ki = 120 nM
  'agonist',
  60.0,
  'secondary',
  'high',
  ARRAY['10611634']
),
(
  (SELECT substance_id FROM ref_substances WHERE substance_name = 'Psilocybin'),
  (SELECT receptor_id FROM ref_receptors WHERE receptor_name = '5-HT2C'),
  11.0, -- Ki = 11 nM
  'agonist',
  70.0,
  'secondary',
  'moderate',
  ARRAY['10611634']
);
```

---

### **Seed Data 4: MEQ30 Questions (Sample)**

```sql
INSERT INTO ref_meq30_questions (question_number, question_text, subscale, reverse_scored) VALUES
(1, 'Loss of your usual sense of time', 'transcendence', false),
(2, 'Experience of amazement', 'mystical', false),
(3, 'Sense that the experience cannot be described adequately in words', 'ineffability', false),
(4, 'Gain of insightful knowledge experienced at an intuitive level', 'mystical', false),
(5, 'Feeling that you experienced eternity or infinity', 'transcendence', false),
(6, 'Experience of oneness or unity with objects and/or persons perceived in your surroundings', 'mystical', false),
(7, 'Loss of your usual sense of space', 'transcendence', false),
(8, 'Feelings of tenderness and gentleness', 'positive_mood', false),
(9, 'Certainty of encounter with ultimate reality', 'mystical', false),
(10, 'Feeling that you could not do justice to your experience by describing it in words', 'ineffability', false);
-- ... (20 more questions)
```

---

### **Seed Data 5: Psilocybin Pharmacokinetics (Oral)**

```sql
INSERT INTO ref_pharmacokinetics (
  substance_id,
  route_id,
  bioavailability_percent,
  tmax_minutes,
  volume_distribution_l_kg,
  protein_binding_percent,
  crosses_bbb,
  primary_metabolite,
  metabolic_pathway,
  half_life_minutes,
  onset_minutes,
  peak_minutes,
  duration_minutes,
  pubmed_ids
) VALUES (
  (SELECT substance_id FROM ref_substances WHERE substance_name = 'Psilocybin'),
  (SELECT route_id FROM ref_routes WHERE route_name = 'Oral'),
  50.0, -- 50% bioavailability
  105, -- Tmax = 105 minutes (1.75 hours)
  0.4, -- Vd = 0.4 L/kg
  NULL, -- Protein binding not well characterized
  true, -- Crosses BBB
  'Psilocin',
  'Dephosphorylation by alkaline phosphatase',
  163, -- Half-life = 163 minutes (2.7 hours)
  20, -- Onset = 20-40 minutes
  90, -- Peak = 90-120 minutes
  360, -- Duration = 4-6 hours
  ARRAY['11157079', '12404608', '30282963']
);
```

---

## 🔍 QUERY FUNCTIONS

### **Function 1: Get Molecule 3D Data**

```sql
CREATE OR REPLACE FUNCTION get_molecule_3d_data(p_substance_id BIGINT)
RETURNS TABLE (
  substance_name TEXT,
  molecular_formula TEXT,
  pdb_data TEXT,
  color_hex TEXT,
  glow_intensity NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.substance_name,
    m.molecular_formula,
    m.pdb_data,
    m.color_hex,
    m.glow_intensity
  FROM ref_molecules m
  JOIN ref_substances s ON s.substance_id = m.substance_id
  WHERE m.substance_id = p_substance_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

### **Function 2: Get Receptor Binding Profile**

```sql
CREATE OR REPLACE FUNCTION get_receptor_binding_profile(p_substance_id BIGINT)
RETURNS TABLE (
  receptor_name TEXT,
  receptor_full_name TEXT,
  binding_type TEXT,
  ki_value NUMERIC,
  clinical_significance TEXT,
  evidence_level TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    r.receptor_name,
    r.receptor_full_name,
    rb.binding_type,
    rb.ki_value,
    rb.clinical_significance,
    rb.evidence_level
  FROM ref_receptor_binding rb
  JOIN ref_receptors r ON r.receptor_id = rb.receptor_id
  WHERE rb.substance_id = p_substance_id
  ORDER BY rb.clinical_significance DESC, rb.ki_value ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

### **Function 3: Calculate MEQ30 Scores**

```sql
CREATE OR REPLACE FUNCTION calculate_meq30_scores(p_responses JSONB)
RETURNS TABLE (
  total_score INTEGER,
  mystical_score NUMERIC,
  positive_mood_score NUMERIC,
  transcendence_score NUMERIC,
  ineffability_score NUMERIC,
  negative_score NUMERIC
) AS $$
DECLARE
  v_total INTEGER := 0;
  v_mystical NUMERIC := 0;
  v_positive_mood NUMERIC := 0;
  v_transcendence NUMERIC := 0;
  v_ineffability NUMERIC := 0;
  v_negative NUMERIC := 0;
  v_question RECORD;
BEGIN
  -- Calculate scores for each subscale
  FOR v_question IN 
    SELECT question_number, subscale, reverse_scored
    FROM ref_meq30_questions
  LOOP
    DECLARE
      v_response INTEGER := (p_responses->>v_question.question_number::TEXT)::INTEGER;
      v_score INTEGER;
    BEGIN
      -- Handle reverse scoring
      IF v_question.reverse_scored THEN
        v_score := 5 - v_response;
      ELSE
        v_score := v_response;
      END IF;
      
      -- Add to total
      v_total := v_total + v_score;
      
      -- Add to subscale
      CASE v_question.subscale
        WHEN 'mystical' THEN v_mystical := v_mystical + v_score;
        WHEN 'positive_mood' THEN v_positive_mood := v_positive_mood + v_score;
        WHEN 'transcendence' THEN v_transcendence := v_transcendence + v_score;
        WHEN 'ineffability' THEN v_ineffability := v_ineffability + v_score;
        WHEN 'negative' THEN v_negative := v_negative + v_score;
      END CASE;
    END;
  END LOOP;
  
  RETURN QUERY SELECT 
    v_total,
    v_mystical,
    v_positive_mood,
    v_transcendence,
    v_ineffability,
    v_negative;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## ✅ IMPLEMENTATION CHECKLIST

### **Phase 1: Core Tables (6 hours)**
- [ ] Create `ref_molecules` table
- [ ] Create `ref_receptors` table
- [ ] Create `ref_receptor_binding` table
- [ ] Add RLS policies to all tables
- [ ] Create indexes for performance
- [ ] Test with sample data

### **Phase 2: MEQ30 Tables (4 hours)**
- [ ] Create `ref_meq30_questions` table
- [ ] Create `log_meq30_responses` table
- [ ] Seed all 30 MEQ30 questions
- [ ] Test MEQ30 score calculation
- [ ] Verify subscale assignments

### **Phase 3: Pharmacokinetics (3 hours)**
- [ ] Create `ref_pharmacokinetics` table
- [ ] Seed PK data for top 5 substances
- [ ] Test PK queries
- [ ] Verify data accuracy

### **Phase 4: Seed Data (8 hours)**
- [ ] Seed molecules for all ref_substances
- [ ] Seed receptor binding data
- [ ] Seed pharmacokinetics data
- [ ] Verify PubChem integration
- [ ] Verify 3D structure data

### **Phase 5: Query Functions (3 hours)**
- [ ] Implement `get_molecule_3d_data()`
- [ ] Implement `get_receptor_binding_profile()`
- [ ] Implement `calculate_meq30_scores()`
- [ ] Test all functions
- [ ] Optimize for performance

**Total Estimated Time:** 24 hours

---

## 📊 DATA SOURCES

### **Molecular Structure Data:**
- **PubChem:** https://pubchem.ncbi.nlm.nih.gov/
- **ChEMBL:** https://www.ebi.ac.uk/chembl/
- **DrugBank:** https://go.drugbank.com/

### **Receptor Binding Data:**
- **PDSP Ki Database:** https://pdsp.unc.edu/databases/kidb.php
- **PubMed:** https://pubmed.ncbi.nlm.nih.gov/
- **Nichols et al. (2016):** Pharmacological Reviews

### **MEQ30:**
- **Barrett et al. (2015):** "Validation of the revised Mystical Experience Questionnaire"
- **PubMed ID:** 26010084

### **Pharmacokinetics:**
- **Passie et al. (2002):** "The pharmacology of psilocybin"
- **Brown et al. (2017):** "Pharmacokinetics of escalating doses of oral psilocybin"

---

## 🎯 STRATEGIC VALUE

### **Feature Enablement:**

**1. 3D Molecule Viewer**
- Show accurate 3D structure for each substance
- Rotate, zoom, highlight functional groups
- Educational value for practitioners

**2. Receptor Binding Diagram**
- Visual representation of how substance binds to receptors
- Color-coded by clinical significance
- Helps explain mechanism of action

**3. MEQ30 Integration**
- Track mystical experiences over time
- Correlate MEQ30 scores with outcomes
- Network benchmarking of mystical experiences

**4. Personalized Dosing**
- Use pharmacokinetics to predict onset/peak/duration
- Adjust for route of administration
- Warn about drug interactions based on CYP enzymes

---

**Status:** 🟡 ASSIGNED - Awaiting SOOP acknowledgment  
**Priority:** 🔴 HIGH - Enables advanced features  
**Next:** SOOP implements schema, INSPECTOR validates data accuracy 🧬
