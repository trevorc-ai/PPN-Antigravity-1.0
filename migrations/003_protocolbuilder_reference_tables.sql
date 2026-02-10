-- ============================================================================
-- Migration 003: ProtocolBuilder Reference Tables
-- ============================================================================
-- Purpose: Create all reference tables needed for ProtocolBuilder modal
-- Date: 2026-02-09
-- Status: READY TO RUN
-- ============================================================================

-- 1. Substances Table
CREATE TABLE IF NOT EXISTS public.ref_substances (
    substance_id BIGSERIAL PRIMARY KEY,
    substance_name TEXT NOT NULL UNIQUE,
    rxnorm_cui BIGINT,  -- RxNorm Concept Unique Identifier
    substance_class TEXT,  -- 'psychedelic', 'dissociative', 'empathogen', etc.
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed substances from ProtocolBuilder
INSERT INTO public.ref_substances (substance_name, substance_class) VALUES
('Psilocybin', 'psychedelic'),
('MDMA', 'empathogen'),
('Ketamine', 'dissociative'),
('LSD-25', 'psychedelic'),
('5-MeO-DMT', 'psychedelic'),
('Ibogaine', 'psychedelic'),
('Mescaline', 'psychedelic'),
('Other / Investigational', 'other')
ON CONFLICT (substance_name) DO NOTHING;

-- 2. Routes Table
CREATE TABLE IF NOT EXISTS public.ref_routes (
    route_id BIGSERIAL PRIMARY KEY,
    route_name TEXT NOT NULL UNIQUE,
    route_code TEXT,  -- SNOMED CT code
    route_label TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed routes from ProtocolBuilder
INSERT INTO public.ref_routes (route_name, route_label) VALUES
('Oral', 'Oral'),
('Intravenous', 'IV'),
('Intramuscular', 'IM'),
('Intranasal', 'Intranasal'),
('Sublingual', 'Sublingual'),
('Buccal', 'Buccal'),
('Rectal', 'Rectal'),
('Subcutaneous', 'SC'),
('Other / Non-Standard', 'Other')
ON CONFLICT (route_name) DO NOTHING;

-- 3. Support Modalities Table
CREATE TABLE IF NOT EXISTS public.ref_support_modality (
    modality_id BIGSERIAL PRIMARY KEY,
    modality_name TEXT NOT NULL UNIQUE,
    modality_code TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed modalities from ProtocolBuilder
INSERT INTO public.ref_support_modality (modality_name, description) VALUES
('CBT', 'Cognitive Behavioral Therapy'),
('Somatic', 'Somatic Experiencing'),
('Psychodynamic', 'Psychodynamic Therapy'),
('IFS', 'Internal Family Systems'),
('None/Sitter', 'No therapeutic modality, sitter only')
ON CONFLICT (modality_name) DO NOTHING;

-- 4. Smoking Status Reference
CREATE TABLE IF NOT EXISTS public.ref_smoking_status (
    smoking_status_id BIGSERIAL PRIMARY KEY,
    status_name TEXT NOT NULL UNIQUE,
    status_code TEXT,  -- SNOMED CT code
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.ref_smoking_status (status_name) VALUES
('Non-Smoker'),
('Former Smoker'),
('Current Smoker (Occasional)'),
('Current Smoker (Daily)')
ON CONFLICT (status_name) DO NOTHING;

-- 5. Severity Grades (CTCAE)
CREATE TABLE IF NOT EXISTS public.ref_severity_grade (
    severity_grade_id BIGSERIAL PRIMARY KEY,
    grade_value INTEGER NOT NULL UNIQUE,
    grade_label TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.ref_severity_grade (grade_value, grade_label, description) VALUES
(1, 'Grade 1 - Mild', 'No intervention required'),
(2, 'Grade 2 - Moderate', 'Local intervention required'),
(3, 'Grade 3 - Severe', 'Hospitalization required'),
(4, 'Grade 4 - Life Threatening', 'Urgent intervention required'),
(5, 'Grade 5 - Death', 'Fatal outcome')
ON CONFLICT (grade_value) DO NOTHING;

-- 6. Safety Event Types
CREATE TABLE IF NOT EXISTS public.ref_safety_events (
    safety_event_id BIGSERIAL PRIMARY KEY,
    event_name TEXT NOT NULL UNIQUE,
    event_code TEXT,  -- MedDRA code (if available)
    event_category TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.ref_safety_events (event_name, event_category) VALUES
('Anxiety', 'psychological'),
('Confusional State', 'cognitive'),
('Dissociation', 'psychological'),
('Dizziness', 'neurological'),
('Headache', 'neurological'),
('Hypertension', 'cardiovascular'),
('Insomnia', 'sleep'),
('Nausea', 'gastrointestinal'),
('Panic Attack', 'psychological'),
('Paranoia', 'psychological'),
('Tachycardia', 'cardiovascular'),
('Visual Hallucination', 'perceptual'),
('Other - Non-PHI Clinical Observation', 'other')
ON CONFLICT (event_name) DO NOTHING;

-- 7. Resolution Status
CREATE TABLE IF NOT EXISTS public.ref_resolution_status (
    resolution_status_id BIGSERIAL PRIMARY KEY,
    status_name TEXT NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.ref_resolution_status (status_name) VALUES
('Resolved in Session'),
('Resolved Post-Session'),
('Unresolved/Lingering')
ON CONFLICT (status_name) DO NOTHING;

-- 8. Indications (Primary Conditions)
CREATE TABLE IF NOT EXISTS public.ref_indications (
    indication_id BIGSERIAL PRIMARY KEY,
    indication_name TEXT NOT NULL UNIQUE,
    snomed_code TEXT,  -- SNOMED CT code
    icd10_code TEXT,   -- ICD-10 code
    indication_category TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.ref_indications (indication_name, indication_category) VALUES
('Major Depressive Disorder (MDD)', 'mood'),
('Treatment-Resistant Depression (TRD)', 'mood'),
('Post-Traumatic Stress Disorder (PTSD)', 'trauma'),
('Generalized Anxiety Disorder (GAD)', 'anxiety'),
('Social Anxiety Disorder', 'anxiety'),
('Obsessive-Compulsive Disorder (OCD)', 'anxiety'),
('Substance Use Disorder', 'addiction'),
('End-of-Life Distress', 'palliative'),
('Other / Investigational', 'other')
ON CONFLICT (indication_name) DO NOTHING;

-- ============================================================================
-- ENABLE RLS ON ALL REFERENCE TABLES
-- ============================================================================

ALTER TABLE public.ref_substances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ref_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ref_support_modality ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ref_smoking_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ref_severity_grade ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ref_safety_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ref_resolution_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ref_indications ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES: Read for authenticated, Write for network_admin only
-- ============================================================================

-- Substances
CREATE POLICY "ref_substances_read" ON public.ref_substances FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "ref_substances_write" ON public.ref_substances FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_sites WHERE user_id = auth.uid() AND role = 'network_admin')
);

-- Routes
CREATE POLICY "ref_routes_read" ON public.ref_routes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "ref_routes_write" ON public.ref_routes FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_sites WHERE user_id = auth.uid() AND role = 'network_admin')
);

-- Support Modality
CREATE POLICY "ref_support_modality_read" ON public.ref_support_modality FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "ref_support_modality_write" ON public.ref_support_modality FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_sites WHERE user_id = auth.uid() AND role = 'network_admin')
);

-- Smoking Status
CREATE POLICY "ref_smoking_status_read" ON public.ref_smoking_status FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "ref_smoking_status_write" ON public.ref_smoking_status FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_sites WHERE user_id = auth.uid() AND role = 'network_admin')
);

-- Severity Grade
CREATE POLICY "ref_severity_grade_read" ON public.ref_severity_grade FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "ref_severity_grade_write" ON public.ref_severity_grade FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_sites WHERE user_id = auth.uid() AND role = 'network_admin')
);

-- Safety Events
CREATE POLICY "ref_safety_events_read" ON public.ref_safety_events FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "ref_safety_events_write" ON public.ref_safety_events FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_sites WHERE user_id = auth.uid() AND role = 'network_admin')
);

-- Resolution Status
CREATE POLICY "ref_resolution_status_read" ON public.ref_resolution_status FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "ref_resolution_status_write" ON public.ref_resolution_status FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_sites WHERE user_id = auth.uid() AND role = 'network_admin')
);

-- Indications
CREATE POLICY "ref_indications_read" ON public.ref_indications FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "ref_indications_write" ON public.ref_indications FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_sites WHERE user_id = auth.uid() AND role = 'network_admin')
);

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Count rows in each table
SELECT 'ref_substances' as table_name, COUNT(*) as row_count FROM public.ref_substances
UNION ALL SELECT 'ref_routes', COUNT(*) FROM public.ref_routes
UNION ALL SELECT 'ref_support_modality', COUNT(*) FROM public.ref_support_modality
UNION ALL SELECT 'ref_smoking_status', COUNT(*) FROM public.ref_smoking_status
UNION ALL SELECT 'ref_severity_grade', COUNT(*) FROM public.ref_severity_grade
UNION ALL SELECT 'ref_safety_events', COUNT(*) FROM public.ref_safety_events
UNION ALL SELECT 'ref_resolution_status', COUNT(*) FROM public.ref_resolution_status
UNION ALL SELECT 'ref_indications', COUNT(*) FROM public.ref_indications;

-- ============================================================================
-- END OF MIGRATION 003
-- ============================================================================

RAISE NOTICE '✅ Migration 003: ProtocolBuilder Reference Tables completed successfully';
