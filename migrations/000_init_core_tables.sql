-- ============================================================================
-- INIT CORE TABLES - GHOST TABLE FIX (Builder)
-- ============================================================================
-- Purpose: Create missing core tables identified by Investigator.
-- These tables are referenced by backend/main.py and subsequent migrations.
-- Note: Reference tables (ref_*) are handled in Migration 003.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. SITES (referenced by main.py health check & Sync)
CREATE TABLE IF NOT EXISTS public.sites (
    site_id BIGSERIAL PRIMARY KEY,
    site_name TEXT NOT NULL,
    site_code TEXT UNIQUE, -- 001 patches this
    is_active BOOLEAN DEFAULT TRUE, -- 001 patches this
    region TEXT, -- 001 patches this
    site_type TEXT, -- 001 patches this
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USER_SITES (referenced by Sync RLS policies)
CREATE TABLE IF NOT EXISTS public.user_sites (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    site_id BIGINT NOT NULL REFERENCES public.sites(site_id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('network_admin', 'site_admin', 'clinician', 'analyst', 'auditor')), -- 001 patches this
    is_active BOOLEAN DEFAULT TRUE, -- 001 patches this
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. LOG_CLINICAL_RECORDS (Core Data Table - Flattened)
CREATE TABLE IF NOT EXISTS public.log_clinical_records (
    clinical_record_id BIGSERIAL PRIMARY KEY,
    site_id BIGINT REFERENCES public.sites(site_id),
    subject_id BIGINT, -- Internal ID
    patient_link_code TEXT, -- Legacy
    protocol_id UUID, -- Legacy or Link
    substance_id BIGINT, -- Will be FK'd to ref_substances in 005 or logical
    
    -- Outcome Scores
    outcome_score INTEGER,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. LOG_OUTCOMES (Specific Outcome Measures)
CREATE TABLE IF NOT EXISTS public.log_outcomes (
    outcome_id BIGSERIAL PRIMARY KEY,
    site_id BIGINT REFERENCES public.sites(site_id),
    subject_id BIGINT,
    outcome_measure TEXT,
    outcome_score INTEGER,
    observed_at TIMESTAMPTZ, -- 001 patches this
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- 5. LOG_CONSENT (Consent Tracking)
CREATE TABLE IF NOT EXISTS public.log_consent (
    consent_id BIGSERIAL PRIMARY KEY,
    site_id BIGINT REFERENCES public.sites(site_id),
    subject_id BIGINT,
    consent_type TEXT,
    is_consented BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMPTZ, -- 001 patches this
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- 6. LOG_INTERVENTIONS (Treatments)
CREATE TABLE IF NOT EXISTS public.log_interventions (
    intervention_id BIGSERIAL PRIMARY KEY,
    site_id BIGINT REFERENCES public.sites(site_id),
    subject_id BIGINT,
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    duration_minutes INTEGER,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- 7. LOG_SAFETY_EVENTS (Adverse Events)
CREATE TABLE IF NOT EXISTS public.log_safety_events (
    safety_event_id BIGSERIAL PRIMARY KEY,
    site_id BIGINT REFERENCES public.sites(site_id),
    subject_id BIGINT,
    severity_grade_id BIGINT, -- Link to ref_severity_grade
    event_description TEXT,
    resolution_status_id BIGINT,
    occurred_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.log_clinical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.log_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.log_consent ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.log_interventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.log_safety_events ENABLE ROW LEVEL SECURITY;

-- Basic Read Policies (Foundation)
CREATE POLICY "Public read sites" ON public.sites FOR SELECT USING (true);
CREATE POLICY "Users read own sites" ON public.user_sites FOR SELECT USING (user_id = auth.uid());

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_sites_user_id ON public.user_sites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sites_site_id ON public.user_sites(site_id);
CREATE INDEX IF NOT EXISTS idx_clinical_records_substance ON public.log_clinical_records(substance_id);
