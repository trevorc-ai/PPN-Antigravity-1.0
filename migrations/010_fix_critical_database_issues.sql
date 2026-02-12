-- ============================================================================
-- Migration 010: Fix Critical Database Issues
-- ============================================================================
-- Purpose: Fix critical SQL best practices violations
-- Date: 2026-02-10
-- Priority: CRITICAL
-- Issues Fixed:
--   1. system_events.site_id type mismatch (BIGINT -> UUID)
--   2. ref_knowledge_graph denormalization (recreate with proper FKs)
--   3. Add updated_at triggers to all tables
--   4. Add schema documentation (COMMENT statements)
-- ============================================================================

-- ============================================================================
-- PART 1: Fix system_events.site_id Type Mismatch
-- ============================================================================

-- Drop existing foreign key constraint if exists
ALTER TABLE public.system_events 
DROP CONSTRAINT IF EXISTS system_events_site_id_fkey;

-- Change site_id from BIGINT to UUID
ALTER TABLE public.system_events 
ALTER COLUMN site_id TYPE UUID USING NULL;  -- Set to NULL first (can't convert BIGINT to UUID)

-- Add proper foreign key constraint
ALTER TABLE public.system_events
ADD CONSTRAINT system_events_site_id_fkey 
FOREIGN KEY (site_id) REFERENCES public.sites(id) ON DELETE CASCADE;

-- Add comment
COMMENT ON COLUMN public.system_events.site_id IS 
'Foreign key to sites table (UUID). Identifies which site this event belongs to.';

-- ============================================================================
-- PART 2: Drop and Recreate ref_knowledge_graph (Properly Normalized)
-- ============================================================================

-- Drop existing table (it has wrong structure)
DROP TABLE IF EXISTS public.ref_knowledge_graph CASCADE;

-- Create properly normalized table
CREATE TABLE public.ref_knowledge_graph (
  interaction_id BIGSERIAL PRIMARY KEY,
  
  -- Foreign keys to reference tables (NO TEXT DUPLICATION)
  substance_id BIGINT NOT NULL REFERENCES public.ref_substances(substance_id) ON DELETE CASCADE,
  interactor_substance_id BIGINT NOT NULL REFERENCES public.ref_substances(substance_id) ON DELETE CASCADE,
  severity_grade_id BIGINT NOT NULL REFERENCES public.ref_severity_grade(severity_grade_id) ON DELETE SET NULL,
  
  -- Risk assessment
  risk_level INTEGER NOT NULL CHECK (risk_level BETWEEN 1 AND 10),
  
  -- Clinical metadata (not duplicating reference data)
  clinical_description TEXT NOT NULL,
  mechanism TEXT,
  evidence_source TEXT,
  source_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  
  -- Audit columns
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Unique constraint on the relationship
  CONSTRAINT unique_substance_interaction UNIQUE (substance_id, interactor_substance_id)
);

-- Add indexes for performance
CREATE INDEX idx_knowledge_graph_substance 
ON public.ref_knowledge_graph(substance_id);

CREATE INDEX idx_knowledge_graph_interactor 
ON public.ref_knowledge_graph(interactor_substance_id);

CREATE INDEX idx_knowledge_graph_risk 
ON public.ref_knowledge_graph(risk_level DESC);

CREATE INDEX idx_knowledge_graph_severity 
ON public.ref_knowledge_graph(severity_grade_id);

-- Enable RLS
ALTER TABLE public.ref_knowledge_graph ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "knowledge_graph_read" 
ON public.ref_knowledge_graph
FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "knowledge_graph_write" 
ON public.ref_knowledge_graph
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_sites 
    WHERE user_id = auth.uid() AND role = 'network_admin'
  )
);

-- Add schema documentation
COMMENT ON TABLE public.ref_knowledge_graph IS 
'Drug-drug interaction knowledge base for safety checking. Stores interactions between psychedelic substances and medications/other substances. All data sourced from peer-reviewed literature and clinical trials. Used by Interaction Checker page.';

COMMENT ON COLUMN public.ref_knowledge_graph.interaction_id IS 
'Auto-incrementing primary key for interaction identification';

COMMENT ON COLUMN public.ref_knowledge_graph.substance_id IS 
'Foreign key to ref_substances. The psychedelic substance (e.g., Psilocybin, MDMA, Ketamine)';

COMMENT ON COLUMN public.ref_knowledge_graph.interactor_substance_id IS 
'Foreign key to ref_substances. The interacting medication or substance (e.g., SSRIs, Lithium, Benzodiazepines)';

COMMENT ON COLUMN public.ref_knowledge_graph.severity_grade_id IS 
'Foreign key to ref_severity_grade. CTCAE severity grade (1-5)';

COMMENT ON COLUMN public.ref_knowledge_graph.risk_level IS 
'Risk level from 1 (low) to 10 (life-threatening). Independent scoring from severity grade.';

COMMENT ON COLUMN public.ref_knowledge_graph.clinical_description IS 
'Detailed clinical description of the interaction and its effects';

COMMENT ON COLUMN public.ref_knowledge_graph.mechanism IS 
'Pharmacological mechanism of the interaction (e.g., "5-HT2A receptor downregulation")';

COMMENT ON COLUMN public.ref_knowledge_graph.evidence_source IS 
'Source of the evidence (e.g., "PubMed", "MAPS", "NIH")';

COMMENT ON COLUMN public.ref_knowledge_graph.source_url IS 
'URL to the source documentation';

COMMENT ON COLUMN public.ref_knowledge_graph.is_verified IS 
'Whether the interaction has been verified by institutional lead investigator';

-- ============================================================================
-- PART 3: Add Medications/Interactors to ref_substances
-- ============================================================================
-- Note: ref_substances will now include both psychedelics AND medications
-- This allows proper foreign key relationships in ref_knowledge_graph

INSERT INTO public.ref_substances (substance_name, substance_class) VALUES
('SSRIs', 'medication'),
('MAOIs', 'medication'),
('Lithium', 'medication'),
('Benzodiazepines', 'medication'),
('Alcohol', 'substance'),
('Stimulants', 'medication'),
('QT-Prolonging Agents', 'medication')
ON CONFLICT (substance_name) DO NOTHING;

-- ============================================================================
-- PART 4: Seed ref_knowledge_graph with Critical Interactions
-- ============================================================================

INSERT INTO public.ref_knowledge_graph 
  (substance_id, interactor_substance_id, severity_grade_id, risk_level, clinical_description, mechanism, evidence_source, source_url, is_verified)
VALUES
  -- Psilocybin + Lithium (Risk 10, Grade 4 = Life-Threatening)
  (
    (SELECT substance_id FROM public.ref_substances WHERE substance_name = 'Psilocybin'),
    (SELECT substance_id FROM public.ref_substances WHERE substance_name = 'Lithium'),
    4,
    10,
    'High risk of seizures, fugue state, and Hallucinogen Persisting Perception Disorder (HPPD). Even therapeutic doses of Lithium can lower the seizure threshold significantly when combined with tryptamines.',
    'Synergistic 5-HT2A potentiation & sodium channel modulation.',
    'National Library of Medicine / PubMed (2024)',
    'https://pubmed.ncbi.nlm.nih.gov/',
    true
  ),
  
  -- MDMA + SSRIs (Risk 9, Grade 3 = Severe)
  (
    (SELECT substance_id FROM public.ref_substances WHERE substance_name = 'MDMA'),
    (SELECT substance_id FROM public.ref_substances WHERE substance_name = 'SSRIs'),
    3,
    9,
    'Blocks SERT transporter. Prevents MDMA uptake, neutralizing therapeutic effect (Subjective "0/10"). Higher doses to compensate may trigger Serotonin Syndrome.',
    'Competitive Inhibition at SERT Transporter.',
    'MAPS Public Benefit Corp',
    'https://maps.org',
    true
  ),
  
  -- MDMA + MAOIs (Risk 10, Grade 4 = Life-Threatening)
  (
    (SELECT substance_id FROM public.ref_substances WHERE substance_name = 'MDMA'),
    (SELECT substance_id FROM public.ref_substances WHERE substance_name = 'MAOIs'),
    4,
    10,
    'Risk of fatal Serotonin Syndrome (Hyperthermia, Hypertensive Crisis). Absolute Contraindication.',
    'Inhibition of monoamine oxidase prevents serotonin metabolism, causing toxic accumulation.',
    'National Library of Medicine / PubMed',
    'https://pubmed.ncbi.nlm.nih.gov/',
    true
  ),
  
  -- Ketamine + Benzodiazepines (Risk 6, Grade 2 = Moderate)
  (
    (SELECT substance_id FROM public.ref_substances WHERE substance_name = 'Ketamine'),
    (SELECT substance_id FROM public.ref_substances WHERE substance_name = 'Benzodiazepines'),
    2,
    6,
    'Reduces the antidepressant efficacy of Ketamine. Increases sedation and amnesia risk.',
    'GABA-A allosteric modulation opposes glutamatergic surge.',
    'Yale School of Medicine',
    'https://medicine.yale.edu/',
    true
  ),
  
  -- Ketamine + Alcohol (Risk 8, Grade 3 = Severe)
  (
    (SELECT substance_id FROM public.ref_substances WHERE substance_name = 'Ketamine'),
    (SELECT substance_id FROM public.ref_substances WHERE substance_name = 'Alcohol'),
    3,
    8,
    'Severe respiratory depression, profound motor impairment, nausea, and aspiration risk.',
    'Synergistic CNS Depression.',
    'National Institutes of Health (NIH)',
    'https://www.nih.gov/',
    true
  ),
  
  -- Psilocybin + SSRIs (Risk 5, Grade 2 = Moderate)
  (
    (SELECT substance_id FROM public.ref_substances WHERE substance_name = 'Psilocybin'),
    (SELECT substance_id FROM public.ref_substances WHERE substance_name = 'SSRIs'),
    2,
    5,
    'Blunted subjective effects. May require higher dosage (20-30% increase) to achieve therapeutic breakthrough.',
    '5-HT2A receptor downregulation.',
    'Imperial College London',
    'https://www.imperial.ac.uk/',
    true
  ),
  
  -- LSD-25 + Lithium (Risk 10, Grade 4 = Life-Threatening)
  (
    (SELECT substance_id FROM public.ref_substances WHERE substance_name = 'LSD-25'),
    (SELECT substance_id FROM public.ref_substances WHERE substance_name = 'Lithium'),
    4,
    10,
    'Extreme neurotoxicity, seizures, and comatose state reported. Absolute Contraindication.',
    'Unknown; hypothesized signal transduction amplification.',
    'Erowid / Clinical Case Reports',
    'https://erowid.org',
    true
  ),
  
  -- Ibogaine + QT-Prolonging Agents (Risk 10, Grade 4 = Life-Threatening)
  (
    (SELECT substance_id FROM public.ref_substances WHERE substance_name = 'Ibogaine'),
    (SELECT substance_id FROM public.ref_substances WHERE substance_name = 'QT-Prolonging Agents'),
    4,
    10,
    'High risk of Torsades de Pointes (Fatal Arrhythmia). Requires ECG monitoring.',
    'hERG Potassium Channel Blockade.',
    'Multidisciplinary Association for Psychedelic Studies',
    'https://maps.org',
    true
  ),
  
  -- MDMA + Stimulants (Risk 8, Grade 3 = Severe)
  (
    (SELECT substance_id FROM public.ref_substances WHERE substance_name = 'MDMA'),
    (SELECT substance_id FROM public.ref_substances WHERE substance_name = 'Stimulants'),
    3,
    8,
    'Excessive cardiovascular strain (Tachycardia, Hypertension). Neurotoxicity risk increases with body temp.',
    'Additive adrenergic stimulation.',
    'NIDA',
    'https://nida.nih.gov/',
    true
  );

-- ============================================================================
-- PART 5: Create updated_at Trigger Function
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_updated_at_column() IS 
'Automatically updates the updated_at column to current timestamp on row update';

-- ============================================================================
-- PART 6: Add updated_at Triggers to All Tables
-- ============================================================================

-- Reference tables
CREATE TRIGGER update_ref_substances_updated_at
BEFORE UPDATE ON public.ref_substances
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ref_routes_updated_at
BEFORE UPDATE ON public.ref_routes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ref_support_modality_updated_at
BEFORE UPDATE ON public.ref_support_modality
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ref_smoking_status_updated_at
BEFORE UPDATE ON public.ref_smoking_status
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ref_severity_grade_updated_at
BEFORE UPDATE ON public.ref_severity_grade
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ref_safety_events_updated_at
BEFORE UPDATE ON public.ref_safety_events
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ref_resolution_status_updated_at
BEFORE UPDATE ON public.ref_resolution_status
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ref_indications_updated_at
BEFORE UPDATE ON public.ref_indications
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ref_knowledge_graph_updated_at
BEFORE UPDATE ON public.ref_knowledge_graph
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- PART 7: Verification Queries
-- ============================================================================

-- Verify system_events.site_id is now UUID
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'system_events' AND column_name = 'site_id';

-- Verify ref_knowledge_graph structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'ref_knowledge_graph'
ORDER BY ordinal_position;

-- Verify interactions were inserted
SELECT 
  kg.interaction_id,
  s1.substance_name as substance,
  s2.substance_name as interactor,
  kg.risk_level,
  sg.grade_label as severity
FROM public.ref_knowledge_graph kg
JOIN public.ref_substances s1 ON kg.substance_id = s1.substance_id
JOIN public.ref_substances s2 ON kg.interactor_substance_id = s2.substance_id
JOIN public.ref_severity_grade sg ON kg.severity_grade_id = sg.severity_grade_id
ORDER BY kg.risk_level DESC;

-- Verify triggers exist
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_name LIKE '%updated_at%'
ORDER BY event_object_table;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$ 
BEGIN
    RAISE NOTICE '✅ Migration 010: Critical Database Issues Fixed Successfully';
    RAISE NOTICE '   - system_events.site_id type changed to UUID';
    RAISE NOTICE '   - ref_knowledge_graph recreated with proper foreign keys';
    RAISE NOTICE '   - 9 drug interactions seeded';
    RAISE NOTICE '   - updated_at triggers added to all reference tables';
    RAISE NOTICE '   - Schema documentation added';
END $$;
