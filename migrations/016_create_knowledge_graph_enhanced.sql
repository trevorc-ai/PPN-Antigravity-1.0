-- ============================================================================
-- Migration 016: Create Enhanced Knowledge Graph for Drug Interactions
-- ============================================================================
-- Purpose: Enable drug interaction alerts in Protocol Builder
-- Date: 2026-02-13
-- Status: READY TO RUN
-- ============================================================================

-- 1. Create enhanced knowledge graph table (if not exists)
CREATE TABLE IF NOT EXISTS public.ref_drug_interactions (
  id BIGSERIAL PRIMARY KEY,
  substance_id BIGINT REFERENCES public.ref_substances(substance_id),
  medication_id BIGINT REFERENCES public.ref_medications(medication_id),
  interaction_severity TEXT CHECK (interaction_severity IN ('SEVERE', 'MODERATE', 'MILD')) NOT NULL,
  risk_description TEXT NOT NULL,
  clinical_recommendation TEXT NOT NULL,
  mechanism TEXT,
  pubmed_reference TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create indexes
CREATE INDEX IF NOT EXISTS idx_drug_interactions_lookup 
ON public.ref_drug_interactions(substance_id, medication_id);

CREATE INDEX IF NOT EXISTS idx_drug_interactions_severity 
ON public.ref_drug_interactions(interaction_severity);

-- 3. Add comments
COMMENT ON TABLE public.ref_drug_interactions IS 'Drug interaction data for psychedelic substances and concomitant medications';
COMMENT ON COLUMN public.ref_drug_interactions.interaction_severity IS 'Severity: SEVERE (contraindicated), MODERATE (caution), MILD (monitor)';
COMMENT ON COLUMN public.ref_drug_interactions.risk_description IS 'Description of the interaction risk';
COMMENT ON COLUMN public.ref_drug_interactions.clinical_recommendation IS 'Clinical guidance for practitioners';

-- 4. Enable RLS
ALTER TABLE public.ref_drug_interactions ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policy (read-only for authenticated users)
DROP POLICY IF EXISTS "Authenticated read" ON public.ref_drug_interactions;
CREATE POLICY "Authenticated read" ON public.ref_drug_interactions 
FOR SELECT USING (auth.role() = 'authenticated');

-- 6. Populate common drug interactions
-- Note: This is a starter set. Full population requires research.

-- Helper function to get IDs
CREATE OR REPLACE FUNCTION get_substance_id(name TEXT) RETURNS BIGINT AS $$
  SELECT substance_id FROM public.ref_substances WHERE substance_name ILIKE name LIMIT 1;
$$ LANGUAGE SQL STABLE;

CREATE OR REPLACE FUNCTION get_medication_id(name TEXT) RETURNS BIGINT AS $$
  SELECT medication_id FROM public.ref_medications WHERE medication_name ILIKE name LIMIT 1;
$$ LANGUAGE SQL STABLE;

-- Psilocybin interactions
INSERT INTO public.ref_drug_interactions (substance_id, medication_id, interaction_severity, risk_description, clinical_recommendation, mechanism, pubmed_reference)
VALUES
  -- SEVERE interactions
  (get_substance_id('Psilocybin'), get_medication_id('Lithium'), 'SEVERE', 
   'Serotonin syndrome and seizure risk', 
   'Contraindicated. Do not combine. If patient is on lithium, consider alternative treatment.',
   'Lithium potentiates serotonergic effects',
   'https://pubmed.ncbi.nlm.nih.gov/31109198/'),
  
  (get_substance_id('Psilocybin'), get_medication_id('Tramadol'), 'SEVERE',
   'Serotonin syndrome risk',
   'Contraindicated. Discontinue tramadol at least 7 days before treatment.',
   'Both increase serotonin levels',
   'https://pubmed.ncbi.nlm.nih.gov/28540594/'),
  
  -- MODERATE interactions
  (get_substance_id('Psilocybin'), get_medication_id('Sertraline'), 'MODERATE',
   'Reduced efficacy of psilocybin',
   'Consider tapering SSRI 2-4 weeks prior to treatment. Monitor for reduced therapeutic effect.',
   'SSRIs downregulate 5-HT2A receptors',
   'https://pubmed.ncbi.nlm.nih.gov/32628113/'),
  
  (get_substance_id('Psilocybin'), get_medication_id('Fluoxetine'), 'MODERATE',
   'Reduced efficacy of psilocybin',
   'Consider tapering SSRI 4-6 weeks prior (long half-life). Monitor for reduced effect.',
   'SSRIs downregulate 5-HT2A receptors',
   'https://pubmed.ncbi.nlm.nih.gov/32628113/'),
  
  (get_substance_id('Psilocybin'), get_medication_id('Escitalopram'), 'MODERATE',
   'Reduced efficacy of psilocybin',
   'Consider tapering SSRI 2-4 weeks prior to treatment.',
   'SSRIs downregulate 5-HT2A receptors',
   'https://pubmed.ncbi.nlm.nih.gov/32628113/'),
  
  -- MILD interactions
  (get_substance_id('Psilocybin'), get_medication_id('Bupropion'), 'MILD',
   'Potential for increased anxiety',
   'Monitor for increased anxiety or agitation. Generally safe to combine.',
   'Bupropion increases norepinephrine/dopamine',
   NULL);

-- MDMA interactions
INSERT INTO public.ref_drug_interactions (substance_id, medication_id, interaction_severity, risk_description, clinical_recommendation, mechanism, pubmed_reference)
VALUES
  -- SEVERE interactions
  (get_substance_id('MDMA'), get_medication_id('Sertraline'), 'SEVERE',
   'Serotonin syndrome risk',
   'Contraindicated. Discontinue SSRI at least 2 weeks before MDMA treatment.',
   'Both increase serotonin levels',
   'https://pubmed.ncbi.nlm.nih.gov/15784661/'),
  
  (get_substance_id('MDMA'), get_medication_id('Fluoxetine'), 'SEVERE',
   'Serotonin syndrome risk',
   'Contraindicated. Discontinue SSRI at least 4-6 weeks before MDMA (long half-life).',
   'Both increase serotonin levels',
   'https://pubmed.ncbi.nlm.nih.gov/15784661/'),
  
  (get_substance_id('MDMA'), get_medication_id('Venlafaxine'), 'SEVERE',
   'Serotonin syndrome risk',
   'Contraindicated. Discontinue SNRI at least 2 weeks before treatment.',
   'Both increase serotonin levels',
   'https://pubmed.ncbi.nlm.nih.gov/15784661/'),
  
  -- MODERATE interactions
  (get_substance_id('MDMA'), get_medication_id('Lithium'), 'MODERATE',
   'Increased risk of serotonin syndrome',
   'Use with extreme caution. Monitor closely for serotonin syndrome symptoms.',
   'Lithium potentiates serotonergic effects',
   NULL);

-- Ketamine interactions
INSERT INTO public.ref_drug_interactions (substance_id, medication_id, interaction_severity, risk_description, clinical_recommendation, mechanism, pubmed_reference)
VALUES
  -- MODERATE interactions
  (get_substance_id('Ketamine'), get_medication_id('Lamotrigine'), 'MODERATE',
   'Potential for increased dissociation',
   'Monitor for excessive dissociation. May need to reduce ketamine dose.',
   'Both affect glutamate signaling',
   NULL),
  
  (get_substance_id('Ketamine'), get_medication_id('Alprazolam'), 'MODERATE',
   'Respiratory depression risk',
   'Use with caution. Monitor respiratory function. Consider reducing benzodiazepine dose.',
   'Additive CNS depression',
   'https://pubmed.ncbi.nlm.nih.gov/29156509/'),
  
  (get_substance_id('Ketamine'), get_medication_id('Lorazepam'), 'MODERATE',
   'Respiratory depression risk',
   'Use with caution. Monitor respiratory function. Consider reducing benzodiazepine dose.',
   'Additive CNS depression',
   'https://pubmed.ncbi.nlm.nih.gov/29156509/'),
  
  -- MILD interactions
  (get_substance_id('Ketamine'), get_medication_id('Sertraline'), 'MILD',
   'Generally safe combination',
   'No significant interaction. Safe to combine for treatment-resistant depression.',
   'Different mechanisms of action',
   'https://pubmed.ncbi.nlm.nih.gov/31109198/');

-- LSD interactions (similar to psilocybin)
INSERT INTO public.ref_drug_interactions (substance_id, medication_id, interaction_severity, risk_description, clinical_recommendation, mechanism, pubmed_reference)
VALUES
  (get_substance_id('LSD'), get_medication_id('Lithium'), 'SEVERE',
   'Serotonin syndrome and seizure risk',
   'Contraindicated. Do not combine.',
   'Lithium potentiates serotonergic effects',
   NULL),
  
  (get_substance_id('LSD'), get_medication_id('Sertraline'), 'MODERATE',
   'Reduced efficacy of LSD',
   'Consider tapering SSRI 2-4 weeks prior to treatment.',
   'SSRIs downregulate 5-HT2A receptors',
   NULL);

-- 7. Verify data population
DO $$ 
DECLARE
  interaction_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO interaction_count
  FROM public.ref_drug_interactions;
  
  IF interaction_count >= 15 THEN
    RAISE NOTICE '✅ Migration 016: Populated % drug interactions.', interaction_count;
  ELSE
    RAISE WARNING '⚠️ Migration 016: Only populated % interactions. More research needed.', interaction_count;
  END IF;
END $$;

-- 8. Drop helper functions
DROP FUNCTION IF EXISTS get_substance_id(TEXT);
DROP FUNCTION IF EXISTS get_medication_id(TEXT);
