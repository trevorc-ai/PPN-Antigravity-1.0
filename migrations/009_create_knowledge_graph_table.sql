-- Migration: 009_create_knowledge_graph_table.sql
-- Purpose: Create ref_knowledge_graph table for Interaction Checker
-- Date: 2026-02-10
-- Priority: CRITICAL (Safety-Critical Feature)

-- ============================================================================
-- KNOWLEDGE GRAPH TABLE
-- ============================================================================
-- Purpose: Store drug-drug interaction rules for safety checking
-- Business Context: Safety-critical feature for clinical decision support
-- Data Source: Peer-reviewed literature, clinical trials, practitioner observations
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.ref_knowledge_graph (
  interaction_id BIGSERIAL PRIMARY KEY,
  substance_id BIGINT REFERENCES public.ref_substances(substance_id) ON DELETE CASCADE,
  substance_name TEXT NOT NULL,
  interactor_name TEXT NOT NULL,
  interactor_category TEXT, -- e.g., 'SSRI', 'MAOI', 'Benzodiazepine', 'Mood Stabilizer'
  risk_level INTEGER NOT NULL CHECK (risk_level BETWEEN 1 AND 10),
  severity_grade TEXT NOT NULL CHECK (severity_grade IN ('Low', 'Moderate', 'High', 'Life-Threatening')),
  clinical_description TEXT NOT NULL,
  mechanism TEXT,
  evidence_source TEXT,
  source_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Unique constraint: One interaction per substance-interactor pair
  CONSTRAINT unique_interaction UNIQUE (substance_name, interactor_name)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Primary query pattern: Search by substance name
CREATE INDEX idx_knowledge_graph_substance 
ON public.ref_knowledge_graph(substance_name);

-- Secondary query pattern: Search by interactor name
CREATE INDEX idx_knowledge_graph_interactor 
ON public.ref_knowledge_graph(interactor_name);

-- Tertiary query pattern: Filter by risk level
CREATE INDEX idx_knowledge_graph_risk 
ON public.ref_knowledge_graph(risk_level DESC);

-- Query pattern: Filter by category
CREATE INDEX idx_knowledge_graph_category 
ON public.ref_knowledge_graph(interactor_category) 
WHERE interactor_category IS NOT NULL;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE public.ref_knowledge_graph ENABLE ROW LEVEL SECURITY;

-- Policy: All authenticated users can read (reference data)
CREATE POLICY "authenticated_users_read_knowledge_graph" 
ON public.ref_knowledge_graph
FOR SELECT
USING (auth.role() = 'authenticated');

-- Policy: Only network_admin can write
CREATE POLICY "network_admin_write_knowledge_graph" 
ON public.ref_knowledge_graph
FOR ALL
USING (
  EXISTS (
    SELECT 1 
    FROM public.user_sites
    WHERE user_id = auth.uid()
    AND role = 'network_admin'
  )
);

-- ============================================================================
-- TRIGGER: Auto-update updated_at timestamp
-- ============================================================================

CREATE OR REPLACE FUNCTION update_knowledge_graph_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_knowledge_graph_timestamp
BEFORE UPDATE ON public.ref_knowledge_graph
FOR EACH ROW
EXECUTE FUNCTION update_knowledge_graph_timestamp();

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE public.ref_knowledge_graph IS 
'Drug-drug interaction knowledge base for safety checking. Data sourced from peer-reviewed literature and clinical trials.';

COMMENT ON COLUMN public.ref_knowledge_graph.interaction_id IS 
'Auto-incrementing primary key for interaction identification';

COMMENT ON COLUMN public.ref_knowledge_graph.substance_id IS 
'Foreign key to ref_substances table';

COMMENT ON COLUMN public.ref_knowledge_graph.substance_name IS 
'Name of the psychedelic substance (e.g., Psilocybin, MDMA, Ketamine)';

COMMENT ON COLUMN public.ref_knowledge_graph.interactor_name IS 
'Name of the interacting medication or condition (e.g., Lithium, SSRIs)';

COMMENT ON COLUMN public.ref_knowledge_graph.interactor_category IS 
'Category of the interactor (e.g., SSRI, MAOI, Benzodiazepine)';

COMMENT ON COLUMN public.ref_knowledge_graph.risk_level IS 
'Risk level from 1 (low) to 10 (life-threatening)';

COMMENT ON COLUMN public.ref_knowledge_graph.severity_grade IS 
'Severity classification: Low, Moderate, High, Life-Threatening';

COMMENT ON COLUMN public.ref_knowledge_graph.clinical_description IS 
'Detailed clinical description of the interaction and its effects';

COMMENT ON COLUMN public.ref_knowledge_graph.mechanism IS 
'Pharmacological mechanism of the interaction';

COMMENT ON COLUMN public.ref_knowledge_graph.evidence_source IS 
'Source of the evidence (e.g., PubMed, MAPS, NIH)';

COMMENT ON COLUMN public.ref_knowledge_graph.source_url IS 
'URL to the source documentation';

COMMENT ON COLUMN public.ref_knowledge_graph.is_verified IS 
'Whether the interaction has been verified by institutional lead investigator';

-- ============================================================================
-- SEED INITIAL DATA (from hardcoded INTERACTION_RULES)
-- ============================================================================

INSERT INTO public.ref_knowledge_graph 
  (substance_name, interactor_name, interactor_category, risk_level, severity_grade, clinical_description, mechanism, evidence_source, source_url, is_verified)
VALUES
  -- RULE-001
  ('Psilocybin', 'Lithium', 'Mood Stabilizer', 10, 'Life-Threatening', 
   'High risk of seizures, fugue state, and Hallucinogen Persisting Perception Disorder (HPPD). Even therapeutic doses of Lithium can lower the seizure threshold significantly when combined with tryptamines.',
   'Synergistic 5-HT2A potentiation & sodium channel modulation.',
   'National Library of Medicine / PubMed (2024)',
   'https://pubmed.ncbi.nlm.nih.gov/',
   true),
   
  -- RULE-002
  ('MDMA', 'SSRIs', 'Antidepressant (SSRI)', 9, 'High',
   'Blocks SERT transporter. Prevents MDMA uptake, neutralizing therapeutic effect (Subjective "0/10"). Higher doses to compensate may trigger Serotonin Syndrome.',
   'Competitive Inhibition at SERT Transporter.',
   'MAPS Public Benefit Corp',
   'https://maps.org',
   true),
   
  -- RULE-003
  ('MDMA', 'MAOIs', 'Antidepressant (MAOI)', 10, 'Life-Threatening',
   'Risk of fatal Serotonin Syndrome (Hyperthermia, Hypertensive Crisis). Absolute Contraindication.',
   'Inhibition of monoamine oxidase prevents serotonin metabolism, causing toxic accumulation.',
   'National Library of Medicine / PubMed',
   'https://pubmed.ncbi.nlm.nih.gov/',
   true),
   
  -- RULE-004
  ('Ketamine', 'Benzodiazepines', 'Anxiolytic', 6, 'Moderate',
   'Reduces the antidepressant efficacy of Ketamine. Increases sedation and amnesia risk.',
   'GABA-A allosteric modulation opposes glutamatergic surge.',
   'Yale School of Medicine',
   'https://medicine.yale.edu/',
   true),
   
  -- RULE-005
  ('Ketamine', 'Alcohol', 'CNS Depressant', 8, 'High',
   'Severe respiratory depression, profound motor impairment, nausea, and aspiration risk.',
   'Synergistic CNS Depression.',
   'National Institutes of Health (NIH)',
   'https://www.nih.gov/',
   true),
   
  -- RULE-006
  ('Psilocybin', 'SSRIs', 'Antidepressant (SSRI)', 5, 'Moderate',
   'Blunted subjective effects. May require higher dosage (20-30% increase) to achieve therapeutic breakthrough.',
   '5-HT2A receptor downregulation.',
   'Imperial College London',
   'https://www.imperial.ac.uk/',
   true),
   
  -- RULE-007
  ('LSD-25', 'Lithium', 'Mood Stabilizer', 10, 'Life-Threatening',
   'Extreme neurotoxicity, seizures, and comatose state reported. Absolute Contraindication.',
   'Unknown; hypothesized signal transduction amplification.',
   'Erowid / Clinical Case Reports',
   'https://erowid.org',
   true),
   
  -- RULE-008
  ('Ayahuasca', 'SSRIs', 'Antidepressant (SSRI)', 10, 'Life-Threatening',
   'Serotonin Syndrome risk due to MAOI content (Harmala alkaloids) in Ayahuasca.',
   'MAO-A Inhibition + Reuptake Blockade.',
   'ICEERS Safety Guide',
   'https://www.iceers.org/',
   true),
   
  -- RULE-009
  ('Ibogaine', 'QT-Prolonging Agents', 'Cardiac', 10, 'Life-Threatening',
   'High risk of Torsades de Pointes (Fatal Arrhythmia). Requires ECG monitoring.',
   'hERG Potassium Channel Blockade.',
   'Multidisciplinary Association for Psychedelic Studies',
   'https://maps.org',
   true),
   
  -- RULE-010
  ('MDMA', 'Stimulants', 'Stimulant', 8, 'High',
   'Excessive cardiovascular strain (Tachycardia, Hypertension). Neurotoxicity risk increases with body temp.',
   'Additive adrenergic stimulation.',
   'NIDA',
   'https://nida.nih.gov/',
   true)
ON CONFLICT (substance_name, interactor_name) DO NOTHING;

-- ============================================================================
-- VERIFICATION QUERY
-- ============================================================================

-- Run this to verify the table was created successfully:
-- SELECT 
--   interaction_id,
--   substance_name,
--   interactor_name,
--   risk_level,
--   severity_grade
-- FROM public.ref_knowledge_graph
-- ORDER BY risk_level DESC
-- LIMIT 10;
