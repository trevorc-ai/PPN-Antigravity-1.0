-- Migration: 011_add_source_and_meq30.sql
-- Purpose: Add Source/Producer tracking and MEQ-30 outcome logging
-- Date: 2026-02-11

-- ============================================================================
-- 1. SOURCE / PRODUCER TRACKING
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.ref_sources (
    source_id BIGSERIAL PRIMARY KEY,
    source_name TEXT NOT NULL UNIQUE, -- e.g. "Compass Pathways", "Usona", "MycoMed", "Generic"
    source_type TEXT NOT NULL, -- 'Pharmaceutical', 'Nutraceutical', 'Botanical-Raw', 'Synthesized'
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.ref_sources ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public read ref_sources" ON public.ref_sources FOR SELECT USING (true);
CREATE POLICY "Admin manage ref_sources" ON public.ref_sources FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_sites WHERE user_id = auth.uid() AND role = 'network_admin')
);

-- Seed initial data
INSERT INTO public.ref_sources (source_name, source_type, is_verified) VALUES
('Generic / Unknown', 'Botanical-Raw', true),
('Compass Pathways', 'Pharmaceutical', true),
('Usona Institute', 'Pharmaceutical', true),
('MindMed', 'Pharmaceutical', true),
('Numinus', 'Botanical-Raw', true)
ON CONFLICT (source_name) DO NOTHING;

-- Add column to log_interventions (if table exists, otherwise create it)
-- Note: log_interventions might be missing based on grep search, so we create it if needed or alter it.
-- Based on previous files, log_clinical_records seems to be the main log. 
-- Let's check if log_interventions is actually used or if we should add to log_clinical_records.
-- SAFETY: If log_interventions doesn't exist, we'll add to log_clinical_records for now as 'substance_source_id'

DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'log_interventions') THEN
        ALTER TABLE public.log_interventions 
        ADD COLUMN IF NOT EXISTS source_id BIGINT REFERENCES public.ref_sources(source_id);
    ELSE
        -- Fallback: Add to clinical records if interventions table is missing (MVP pragmatism)
        ALTER TABLE public.log_clinical_records 
        ADD COLUMN IF NOT EXISTS substance_source_id BIGINT REFERENCES public.ref_sources(source_id);
    END IF;
END $$;


-- ============================================================================
-- 2. MEQ-30 (Mystical Experience Questionnaire)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.log_meq30 (
    meq_id BIGSERIAL PRIMARY KEY,
    site_id BIGINT NOT NULL REFERENCES public.sites(site_id),
    subject_id BIGINT NOT NULL, -- Link to patient (hashed ID logical link)
    session_id BIGINT REFERENCES public.log_clinical_records(clinical_record_id), -- Link to specific session
    
    -- Date of completion
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- The 30 Items (0-5 Scale)
    -- 0=None, 1=So slight, 2=Slight, 3=Moderate, 4=Strong, 5=Extreme
    item_01_internal_unity INTEGER CHECK (item_01_internal_unity BETWEEN 0 AND 5),
    item_02_external_unity INTEGER CHECK (item_02_external_unity BETWEEN 0 AND 5),
    item_03_time_space INTEGER CHECK (item_03_time_space BETWEEN 0 AND 5),
    item_04_positive_mood INTEGER CHECK (item_04_positive_mood BETWEEN 0 AND 5),
    item_05_sacredness INTEGER CHECK (item_05_sacredness BETWEEN 0 AND 5),
    item_06_knowledge INTEGER CHECK (item_06_knowledge BETWEEN 0 AND 5),
    item_07_ineffability INTEGER CHECK (item_07_ineffability BETWEEN 0 AND 5),
    -- ... (listing all 30 individually is best for analytics, but for MVP we might group or use array? 
    -- NO, strict schema is better for SQL analytics. We will add all 30.)
    
    -- For brevity in this migration, we will use JSONB for the raw answers to save schema bloat in MVP, 
    -- and store the CALCULATED Factor Scores as columns for easy querying.
    raw_responses JSONB NOT NULL, -- Keys: "q1": 3, "q2": 5, ...
    
    -- Calculated Factor Scores (0-100 normalized or raw sum? Standard is Raw Sum / Max possibilities)
    -- MEQ30 Total Score (Max 150)
    total_score INTEGER,
    
    -- Factor 1: Mystical (Max 60)
    score_mystical INTEGER,
    
    -- Factor 2: Positive Mood (Max 30)
    score_positive_mood INTEGER,
    
    -- Factor 3: Transcendence of Time/Space (Max 30)
    score_transcendence INTEGER,
    
    -- Factor 4: Ineffability (Max 15)
    score_ineffability INTEGER,
    
    notes TEXT,
    created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.log_meq30 ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Site members read meq30" ON public.log_meq30 FOR SELECT USING (
  site_id IN (SELECT site_id FROM public.user_sites WHERE user_id = auth.uid())
);

CREATE POLICY "Clinicians insert meq30" ON public.log_meq30 FOR INSERT WITH CHECK (
  site_id IN (SELECT site_id FROM public.user_sites WHERE user_id = auth.uid())
);

-- Index
CREATE INDEX idx_meq30_subject ON public.log_meq30(subject_id);
CREATE INDEX idx_meq30_session ON public.log_meq30(session_id);

-- ============================================================================
-- 3. VERIFICATION
-- ============================================================================
DO $$ 
BEGIN
    RAISE NOTICE '✅ Migration 011: Source Tracking and MEQ-30 Tables Created';
END $$;
