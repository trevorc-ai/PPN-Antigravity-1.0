-- ============================================================================
-- Migration 022: Shadow Market Defense Schema
-- ============================================================================
-- Purpose: Create zero-knowledge harm reduction logging system
-- Work Order: WO_002
-- Date: 2026-02-14
-- Agent: SOOP
-- ============================================================================
-- SECURITY ARCHITECTURE:
--   - Zero PII storage (only hashes and UUIDs)
--   - Strict RLS on all tables
--   - Blind vetting via hash-based RPC
--   - User isolation via auth.uid()
-- ============================================================================

-- ============================================================================
-- SECTION 1: REFERENCE TABLES (Public Read-Only)
-- ============================================================================

-- 1.1 Substances Catalog
CREATE TABLE IF NOT EXISTS public.ref_sm_substances (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    default_potency_factor NUMERIC(4,2) DEFAULT 1.0,
    safety_tier CHAR(1) CHECK (safety_tier IN ('A', 'B', 'C')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.ref_sm_substances IS 'Shadow Market: Substance catalog with potency factors';
COMMENT ON COLUMN public.ref_sm_substances.default_potency_factor IS 'Multiplier for dose normalization (1.0 = baseline)';
COMMENT ON COLUMN public.ref_sm_substances.safety_tier IS 'A=Low Risk, B=Moderate Risk, C=High Risk';

-- 1.2 Intervention Types
CREATE TABLE IF NOT EXISTS public.ref_sm_interventions (
    id SERIAL PRIMARY KEY,
    label TEXT NOT NULL UNIQUE,
    ui_color_hex TEXT DEFAULT '#6b7280',
    risk_weight INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.ref_sm_interventions IS 'Shadow Market: Intervention types for crisis logging';
COMMENT ON COLUMN public.ref_sm_interventions.risk_weight IS 'Higher weight = more serious intervention';

-- 1.3 Risk Flag Taxonomy
CREATE TABLE IF NOT EXISTS public.ref_sm_risk_flags (
    id SERIAL PRIMARY KEY,
    label TEXT NOT NULL UNIQUE,
    severity_level INTEGER CHECK (severity_level BETWEEN 1 AND 5),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.ref_sm_risk_flags IS 'Shadow Market: Risk flag categories for blind vetting';
COMMENT ON COLUMN public.ref_sm_risk_flags.severity_level IS '1=Low, 5=Critical';

-- ============================================================================
-- SECTION 2: LOG TABLES (Private, User-Isolated)
-- ============================================================================

-- 2.1 Session Metadata
CREATE TABLE IF NOT EXISTS public.log_sm_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    client_blind_hash TEXT NOT NULL,
    protocol_id UUID,
    jurisdiction_code INTEGER,
    is_duress_mode BOOLEAN DEFAULT FALSE,
    start_time TIMESTAMPTZ DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.log_sm_sessions IS 'Shadow Market: Session metadata with blind client hashing';
COMMENT ON COLUMN public.log_sm_sessions.client_blind_hash IS 'SHA-256 hash of client identifier (phone number)';
COMMENT ON COLUMN public.log_sm_sessions.is_duress_mode IS 'Panic flag if practitioner is under threat';
COMMENT ON COLUMN public.log_sm_sessions.jurisdiction_code IS 'Numeric code for legal jurisdiction (no text)';

-- 2.2 Dosage Records
CREATE TABLE IF NOT EXISTS public.log_sm_doses (
    id BIGSERIAL PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES public.log_sm_sessions(id) ON DELETE CASCADE,
    substance_id INTEGER NOT NULL REFERENCES public.ref_sm_substances(id),
    dosage_amount NUMERIC(10,3) NOT NULL,
    dosage_unit_id BIGINT REFERENCES public.ref_dosage_units(id),
    potency_modifier NUMERIC(3,2) DEFAULT 1.0 CHECK (potency_modifier BETWEEN 0.1 AND 5.0),
    effective_dose_mg NUMERIC(10,2) GENERATED ALWAYS AS (
        dosage_amount * potency_modifier * 1000
    ) STORED,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.log_sm_doses IS 'Shadow Market: Dosage records with auto-calculated effective dose';
COMMENT ON COLUMN public.log_sm_doses.dosage_amount IS 'Numeric value (use with dosage_unit_id)';
COMMENT ON COLUMN public.log_sm_doses.potency_modifier IS 'User-adjusted potency (0.5x - 3.0x slider)';
COMMENT ON COLUMN public.log_sm_doses.effective_dose_mg IS 'Auto-calculated: dosage_amount * potency_modifier * 1000';

-- 2.3 Intervention Timeline
CREATE TABLE IF NOT EXISTS public.log_sm_interventions (
    id BIGSERIAL PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES public.log_sm_sessions(id) ON DELETE CASCADE,
    intervention_id INTEGER NOT NULL REFERENCES public.ref_sm_interventions(id),
    seconds_since_start INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.log_sm_interventions IS 'Shadow Market: Timestamped intervention events';
COMMENT ON COLUMN public.log_sm_interventions.seconds_since_start IS 'Elapsed time from session start (T+00:00:00)';

-- 2.4 Anonymous Risk Reports
CREATE TABLE IF NOT EXISTS public.log_sm_risk_reports (
    id BIGSERIAL PRIMARY KEY,
    target_client_hash TEXT NOT NULL,
    flag_type_id INTEGER NOT NULL REFERENCES public.ref_sm_risk_flags(id),
    reported_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.log_sm_risk_reports IS 'Shadow Market: Anonymous risk flags for blind vetting';
COMMENT ON COLUMN public.log_sm_risk_reports.target_client_hash IS 'SHA-256 hash of flagged client identifier';
COMMENT ON COLUMN public.log_sm_risk_reports.reported_by IS 'Reporter user_id (nullable for anonymity)';

-- ============================================================================
-- SECTION 3: ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- 3.1 Enable RLS on All Tables
ALTER TABLE public.ref_sm_substances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ref_sm_interventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ref_sm_risk_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.log_sm_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.log_sm_doses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.log_sm_interventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.log_sm_risk_reports ENABLE ROW LEVEL SECURITY;

-- 3.2 Reference Tables: Public Read Access
CREATE POLICY "Public read access" ON public.ref_sm_substances
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Public read access" ON public.ref_sm_interventions
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Public read access" ON public.ref_sm_risk_flags
    FOR SELECT TO authenticated USING (true);

-- 3.3 Log Tables: User Isolation Policies
CREATE POLICY "Users manage own sessions" ON public.log_sm_sessions
    FOR ALL TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users manage own doses" ON public.log_sm_doses
    FOR ALL TO authenticated USING (
        session_id IN (
            SELECT id FROM public.log_sm_sessions WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users manage own interventions" ON public.log_sm_interventions
    FOR ALL TO authenticated USING (
        session_id IN (
            SELECT id FROM public.log_sm_sessions WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users manage own risk reports" ON public.log_sm_risk_reports
    FOR ALL TO authenticated USING (reported_by = auth.uid());

-- 3.4 Risk Reports: Anonymous Read Access (via RPC only)
-- Note: Direct SELECT is blocked. Use check_client_risk() RPC function.

-- ============================================================================
-- SECTION 4: RPC FUNCTION - BLIND VETTING
-- ============================================================================

CREATE OR REPLACE FUNCTION public.check_client_risk(client_hash TEXT)
RETURNS TABLE(risk_count BIGINT) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT COUNT(*)::BIGINT
    FROM public.log_sm_risk_reports
    WHERE target_client_hash = client_hash;
END;
$$;

COMMENT ON FUNCTION public.check_client_risk IS 'Shadow Market: Returns count of risk flags for hashed client ID (zero-knowledge)';

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.check_client_risk(TEXT) TO authenticated;

-- ============================================================================
-- SECTION 5: INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_sm_sessions_user_id 
    ON public.log_sm_sessions(user_id);

CREATE INDEX IF NOT EXISTS idx_sm_sessions_client_hash 
    ON public.log_sm_sessions(client_blind_hash);

CREATE INDEX IF NOT EXISTS idx_sm_doses_session_id 
    ON public.log_sm_doses(session_id);

CREATE INDEX IF NOT EXISTS idx_sm_doses_substance_id 
    ON public.log_sm_doses(substance_id);

CREATE INDEX IF NOT EXISTS idx_sm_interventions_session_id 
    ON public.log_sm_interventions(session_id);

CREATE INDEX IF NOT EXISTS idx_sm_risk_reports_hash 
    ON public.log_sm_risk_reports(target_client_hash);

-- ============================================================================
-- SECTION 6: SEED DATA - REFERENCE TABLES
-- ============================================================================

-- 6.1 Seed Substances
INSERT INTO public.ref_sm_substances (name, default_potency_factor, safety_tier) VALUES
    ('Psilocybin Mushrooms', 1.0, 'A'),
    ('MDMA', 1.2, 'B'),
    ('LSD', 1.5, 'A'),
    ('Ketamine', 0.8, 'B'),
    ('Ayahuasca', 1.3, 'C'),
    ('5-MeO-DMT', 2.0, 'C'),
    ('Mescaline', 1.1, 'A'),
    ('2C-B', 1.4, 'B'),
    ('Cannabis (High THC)', 0.5, 'A'),
    ('Ibogaine', 1.8, 'C')
ON CONFLICT (name) DO NOTHING;

-- 6.2 Seed Interventions
INSERT INTO public.ref_sm_interventions (id, label, ui_color_hex, risk_weight) VALUES
    (1, 'Vital Signs Normal', '#22c55e', 0),
    (2, 'Verbal Support', '#f59e0b', 2),
    (3, 'Physical Assist', '#f97316', 5),
    (4, 'Chemical Intervention', '#ef4444', 10)
ON CONFLICT (id) DO UPDATE SET
    label = EXCLUDED.label,
    ui_color_hex = EXCLUDED.ui_color_hex,
    risk_weight = EXCLUDED.risk_weight;

-- 6.3 Seed Risk Flags
INSERT INTO public.ref_sm_risk_flags (label, severity_level) VALUES
    ('History of Violence', 5),
    ('Substance Abuse', 4),
    ('Psychiatric Hospitalization', 4),
    ('Medication Non-Compliance', 3),
    ('Missed Appointments', 2),
    ('Payment Issues', 1),
    ('Boundary Violations', 4),
    ('Threatening Behavior', 5),
    ('Self-Harm Risk', 5),
    ('Legal Issues', 3)
ON CONFLICT (label) DO NOTHING;

-- ============================================================================
-- SECTION 7: UPDATED_AT TRIGGERS
-- ============================================================================

CREATE TRIGGER update_ref_sm_substances_updated_at 
    BEFORE UPDATE ON public.ref_sm_substances 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ref_sm_interventions_updated_at 
    BEFORE UPDATE ON public.ref_sm_interventions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ref_sm_risk_flags_updated_at 
    BEFORE UPDATE ON public.ref_sm_risk_flags 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_log_sm_sessions_updated_at 
    BEFORE UPDATE ON public.log_sm_sessions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

DO $$ 
BEGIN
    RAISE NOTICE '✅ Migration 022: Shadow Market Defense Schema Created';
    RAISE NOTICE '   - 3 Reference Tables (substances, interventions, risk_flags)';
    RAISE NOTICE '   - 4 Log Tables (sessions, doses, interventions, risk_reports)';
    RAISE NOTICE '   - RLS Enabled on All Tables';
    RAISE NOTICE '   - check_client_risk() RPC Function Created';
    RAISE NOTICE '   - Seed Data Loaded';
END $$;
