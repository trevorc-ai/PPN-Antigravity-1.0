-- ============================================================================
-- PPN Research Portal - Missing Tables Schema Sync
-- ============================================================================
-- This file creates the "ghost tables" identified by the Investigator:
-- 1. log_patient_flow_events - Patient journey tracking
-- 2. ref_flow_event_types - Reference data for flow event classifications
-- ============================================================================

-- Reference Table: Flow Event Types
-- Used to classify different types of patient flow events in the care journey
CREATE TABLE IF NOT EXISTS public.ref_flow_event_types (
    event_type_id BIGSERIAL PRIMARY KEY,
    event_type_name TEXT NOT NULL UNIQUE,
    event_category TEXT,  -- e.g., 'screening', 'treatment', 'followup', 'completion'
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policy for ref_flow_event_types
ALTER TABLE public.ref_flow_event_types ENABLE ROW LEVEL SECURITY;

-- Policy: All authenticated users can read
CREATE POLICY "ref_flow_event_types_read_policy"
ON public.ref_flow_event_types
FOR SELECT
TO authenticated
USING (true);

-- Policy: Only network_admin can write
CREATE POLICY "ref_flow_event_types_write_policy"
ON public.ref_flow_event_types
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_sites
        WHERE user_sites.user_id = auth.uid()
        AND user_sites.role = 'network_admin'
    )
);

-- Log Table: Patient Flow Events
-- Tracks patient journey events (screening, enrollment, sessions, completion, dropout)
CREATE TABLE IF NOT EXISTS public.log_patient_flow_events (
    flow_event_id BIGSERIAL PRIMARY KEY,
    site_id BIGINT NOT NULL REFERENCES public.sites(site_id) ON DELETE CASCADE,
    subject_id BIGINT NOT NULL,  -- Internal study ID (not PHI)
    event_type_id BIGINT NOT NULL REFERENCES public.ref_flow_event_types(event_type_id),
    event_date DATE NOT NULL,
    session_number INTEGER,  -- For treatment session events
    notes TEXT,  -- Structured notes only (NO free-text PHI)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id)
);

-- Add RLS policy for log_patient_flow_events
ALTER TABLE public.log_patient_flow_events ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own site's flow events
CREATE POLICY "log_patient_flow_events_read_policy"
ON public.log_patient_flow_events
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_sites
        WHERE user_sites.user_id = auth.uid()
        AND user_sites.site_id = log_patient_flow_events.site_id
    )
);

-- Policy: Clinicians and site_admins can insert/update for their site
CREATE POLICY "log_patient_flow_events_write_policy"
ON public.log_patient_flow_events
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_sites
        WHERE user_sites.user_id = auth.uid()
        AND user_sites.site_id = log_patient_flow_events.site_id
        AND user_sites.role IN ('clinician', 'site_admin', 'network_admin')
    )
);

CREATE POLICY "log_patient_flow_events_update_policy"
ON public.log_patient_flow_events
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_sites
        WHERE user_sites.user_id = auth.uid()
        AND user_sites.site_id = log_patient_flow_events.site_id
        AND user_sites.role IN ('clinician', 'site_admin', 'network_admin')
    )
);

-- Policy: Only network_admin can delete (for test data cleanup only)
CREATE POLICY "log_patient_flow_events_delete_policy"
ON public.log_patient_flow_events
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_sites
        WHERE user_sites.user_id = auth.uid()
        AND user_sites.role = 'network_admin'
    )
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_flow_events_site_id ON public.log_patient_flow_events(site_id);
CREATE INDEX IF NOT EXISTS idx_flow_events_subject_id ON public.log_patient_flow_events(subject_id);
CREATE INDEX IF NOT EXISTS idx_flow_events_event_type ON public.log_patient_flow_events(event_type_id);
CREATE INDEX IF NOT EXISTS idx_flow_events_event_date ON public.log_patient_flow_events(event_date);

-- ============================================================================
-- SEED DATA: Flow Event Types
-- ============================================================================

INSERT INTO public.ref_flow_event_types (event_type_name, event_category, description, display_order) VALUES
('Initial Screening', 'screening', 'Patient completes initial screening assessment', 1),
('Eligibility Confirmed', 'screening', 'Patient confirmed eligible for study enrollment', 2),
('Informed Consent', 'enrollment', 'Patient provides informed consent', 3),
('Baseline Assessment', 'enrollment', 'Baseline clinical assessment completed', 4),
('Treatment Session', 'treatment', 'Patient receives treatment intervention', 5),
('Follow-up Visit', 'followup', 'Scheduled follow-up assessment', 6),
('Adverse Event', 'safety', 'Safety event reported', 7),
('Protocol Deviation', 'safety', 'Deviation from study protocol documented', 8),
('Study Completion', 'completion', 'Patient successfully completes study', 9),
('Early Termination', 'completion', 'Patient discontinues study early', 10),
('Lost to Follow-up', 'completion', 'Patient lost to follow-up', 11)
ON CONFLICT (event_type_name) DO NOTHING;

-- ============================================================================
-- UPDATE TRIGGER: Auto-update timestamps
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ref_flow_event_types_updated_at
BEFORE UPDATE ON public.ref_flow_event_types
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_log_patient_flow_events_updated_at
BEFORE UPDATE ON public.log_patient_flow_events
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Verify tables exist
SELECT 'ref_flow_event_types' as table_name, COUNT(*) as row_count FROM public.ref_flow_event_types
UNION ALL
SELECT 'log_patient_flow_events', COUNT(*) FROM public.log_patient_flow_events;

-- End of schema sync
