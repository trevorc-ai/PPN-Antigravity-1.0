-- 005_add_ids_to_clinical_records.sql
-- (Revised) Create log_clinical_records table with all necessary ID columns for the Redesign

-- Ensure the table exists with the correct schema
CREATE TABLE IF NOT EXISTS public.log_clinical_records (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    site_id UUID, -- To be populated from user context
    patient_id TEXT NOT NULL, -- Subject ID / Hash
    
    -- Clinical Data IDs (The "Task 6" Requirement)
    indication_id BIGINT REFERENCES public.ref_indications(indication_id),
    protocol_template_id TEXT,
    session_number INTEGER DEFAULT 1,
    session_date DATE DEFAULT CURRENT_DATE,
    substance_id BIGINT REFERENCES public.ref_substances(substance_id),
    route_id BIGINT REFERENCES public.ref_routes(route_id),
    modality_id BIGINT REFERENCES public.ref_support_modality(modality_id),
    smoking_status_id BIGINT REFERENCES public.ref_smoking_status(smoking_status_id),
    resolution_status_id BIGINT REFERENCES public.ref_resolution_status(resolution_status_id),
    severity_grade_id BIGINT REFERENCES public.ref_severity_grade(severity_grade_id),
    safety_event_id BIGINT REFERENCES public.ref_safety_events(safety_event_id),
    concomitant_med_ids BIGINT[],
    
    -- Measures & Legacy Data
    dosage NUMERIC,
    dosage_unit TEXT,
    frequency TEXT,
    phq9_score INTEGER,
    difficulty_score INTEGER,
    verified_consent BOOLEAN DEFAULT FALSE,
    prep_hours NUMERIC,
    integration_hours NUMERIC,
    setting TEXT,
    
    notes JSONB, -- For structured backup
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS
ALTER TABLE public.log_clinical_records ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can insert own records" ON public.log_clinical_records
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view records from their site" ON public.log_clinical_records
    FOR SELECT TO authenticated
    USING (
        site_id IN (
            SELECT site_id FROM public.user_sites WHERE user_id = auth.uid()
        )
        OR user_id = auth.uid()
    );
