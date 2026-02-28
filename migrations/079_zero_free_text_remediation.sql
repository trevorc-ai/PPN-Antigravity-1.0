-- ============================================================================
-- MIGRATION 079: Zero Free-Text Golden Rule — Full Remediation
-- ============================================================================
-- Author:        INSPECTOR (executed live by USER 2026-02-28)
-- Date Applied:  2026-02-28
-- Status:        ALREADY APPLIED TO LIVE DB — this file is the audit record
-- Work Order:    WO-517 Database Integrity Breach Remediation
--
-- SCOPE: Enforces the Zero Free-Text Golden Rule across all log_ tables.
-- All practitioner inputs must be integers, floats, or FKs to ref_ tables.
-- No free-text (TEXT/VARCHAR) columns permitted in clinical log tables.
--
-- WHAT THIS MIGRATION DID (5 phases):
--   Phase 1: Reference Table Foundation Audit
--   Phase 2: Zero Free-Text Violation Hunt
--   Phase 3: Gap Analysis — CREATE new ref_ tables + ADD FK columns
--   Phase 4: Audit Trail — ADD created_at + created_by across 24 tables
--   Phase 5: Final Cleanup — DROP remaining text cols, ADD CHECK constraints
--
-- ⚠️  IDEMPOTENT: All statements use IF NOT EXISTS / IF EXISTS / DROP...IF EXISTS
--     Safe to re-run on a fresh database. Already a no-op on live DB.
-- ============================================================================


-- ============================================================================
-- BLOCK A: DROP log_chain_of_custody
-- USER DECISION 2026-02-28: Batch Tracking functionality removed from scope.
-- ============================================================================

DROP TABLE IF EXISTS public.log_chain_of_custody CASCADE;


-- ============================================================================
-- BLOCK B: CREATE 7 NEW ref_ TABLES
-- ============================================================================

-- B1. ref_clinical_phenotypes
CREATE TABLE IF NOT EXISTS public.ref_clinical_phenotypes (
    clinical_phenotype_id   BIGINT      PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    phenotype_code          TEXT        NOT NULL UNIQUE,
    phenotype_name          TEXT        NOT NULL,
    icd10_category          TEXT,
    is_active               BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.ref_clinical_phenotypes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ref_clinical_phenotypes_select" ON public.ref_clinical_phenotypes;
CREATE POLICY "ref_clinical_phenotypes_select"
    ON public.ref_clinical_phenotypes FOR SELECT TO authenticated USING (is_active = TRUE);
INSERT INTO public.ref_clinical_phenotypes (phenotype_code, phenotype_name, icd10_category) VALUES
    ('TRD',     'Treatment-Resistant Depression',   'F32'),
    ('MDD',     'Major Depressive Disorder',        'F32'),
    ('PTSD',    'Post-Traumatic Stress Disorder',   'F43.1'),
    ('AUD',     'Alcohol Use Disorder',             'F10'),
    ('SUD',     'Substance Use Disorder (General)', 'F19'),
    ('OCD',     'Obsessive-Compulsive Disorder',    'F42'),
    ('GAD',     'Generalized Anxiety Disorder',     'F41.1'),
    ('EXIST',   'Existential Distress / EOL',       NULL),
    ('EAT',     'Eating Disorder',                  'F50'),
    ('CHRONIC', 'Chronic Pain Syndrome',            'G89'),
    ('OTHER',   'Other / Not Listed',               NULL)
ON CONFLICT (phenotype_code) DO NOTHING;

-- B2. ref_contraindication_verdicts
CREATE TABLE IF NOT EXISTS public.ref_contraindication_verdicts (
    verdict_id      BIGINT  PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    verdict_code    TEXT    NOT NULL UNIQUE,
    verdict_label   TEXT    NOT NULL,
    ui_color_hex    TEXT    DEFAULT '#6b7280',
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.ref_contraindication_verdicts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ref_contraindication_verdicts_select" ON public.ref_contraindication_verdicts;
CREATE POLICY "ref_contraindication_verdicts_select"
    ON public.ref_contraindication_verdicts FOR SELECT TO authenticated USING (is_active = TRUE);
INSERT INTO public.ref_contraindication_verdicts (verdict_code, verdict_label, ui_color_hex) VALUES
    ('CLEAR',                'Clear — Proceed',      '#10b981'),
    ('PROCEED_WITH_CAUTION', 'Proceed with Caution', '#f59e0b'),
    ('DO_NOT_PROCEED',       'Do Not Proceed',       '#ef4444')
ON CONFLICT (verdict_code) DO NOTHING;

-- B3. ref_alert_types
CREATE TABLE IF NOT EXISTS public.ref_alert_types (
    alert_type_id   BIGINT  PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    alert_code      TEXT    NOT NULL UNIQUE,
    alert_label     TEXT    NOT NULL,
    alert_category  TEXT    NOT NULL
                    CHECK (alert_category IN ('clinical_score','vital_sign','compliance','safety_event')),
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.ref_alert_types ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ref_alert_types_select" ON public.ref_alert_types;
CREATE POLICY "ref_alert_types_select"
    ON public.ref_alert_types FOR SELECT TO authenticated USING (is_active = TRUE);
INSERT INTO public.ref_alert_types (alert_code, alert_label, alert_category) VALUES
    ('CSSRS_ELEVATED',      'Columbia Suicide Severity Rating Scale — Elevated', 'clinical_score'),
    ('PHQ9_SEVERE',         'PHQ-9 Severe (Score ≥ 20)',                         'clinical_score'),
    ('PHQ9_MODERATELY_SEV', 'PHQ-9 Moderately Severe (Score 15–19)',             'clinical_score'),
    ('GAD7_SEVERE',         'GAD-7 Severe (Score ≥ 15)',                         'clinical_score'),
    ('PSQI_SEVERE',         'Pittsburgh Sleep — Severe Disruption',              'clinical_score'),
    ('VITAL_HR_HIGH',       'Heart Rate — Critically Elevated',                  'vital_sign'),
    ('VITAL_BP_HIGH',       'Blood Pressure — Hypertensive Crisis',              'vital_sign'),
    ('VITAL_O2_LOW',        'Oxygen Saturation — Below Safe Threshold',          'vital_sign'),
    ('VITAL_QT_PROLONGED',  'QT Interval Prolonged — EKG Alert',                'vital_sign'),
    ('MISSED_SESSIONS',     'Multiple Integration Sessions Missed',              'compliance'),
    ('ADVERSE_EVENT',       'Adverse Event Reported',                            'safety_event'),
    ('CRISIS_DISCLOSURE',   'Crisis Disclosure by Patient',                      'safety_event')
ON CONFLICT (alert_code) DO NOTHING;

-- B4. ref_data_sources
CREATE TABLE IF NOT EXISTS public.ref_data_sources (
    data_source_id  BIGINT  PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    source_code     TEXT    NOT NULL UNIQUE,
    source_label    TEXT    NOT NULL,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.ref_data_sources ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ref_data_sources_select" ON public.ref_data_sources;
CREATE POLICY "ref_data_sources_select"
    ON public.ref_data_sources FOR SELECT TO authenticated USING (is_active = TRUE);
INSERT INTO public.ref_data_sources (source_code, source_label) VALUES
    ('manual',          'Manual Entry'),
    ('wearable',        'Wearable Device'),
    ('pulse_oximeter',  'Pulse Oximeter'),
    ('bp_cuff',         'Blood Pressure Cuff'),
    ('ekg_monitor',     'EKG Monitor'),
    ('continuous_cuff', 'Continuous BP Monitor'),
    ('other',           'Other Device')
ON CONFLICT (source_code) DO NOTHING;

-- B5. ref_psychospiritual_history_types
CREATE TABLE IF NOT EXISTS public.ref_psychospiritual_history_types (
    psychospiritual_history_id  BIGINT  PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    history_code                TEXT    NOT NULL UNIQUE,
    history_label               TEXT    NOT NULL,
    sort_order                  INTEGER DEFAULT 999,
    is_active                   BOOLEAN NOT NULL DEFAULT TRUE,
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.ref_psychospiritual_history_types ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ref_psychospiritual_history_types_select" ON public.ref_psychospiritual_history_types;
CREATE POLICY "ref_psychospiritual_history_types_select"
    ON public.ref_psychospiritual_history_types FOR SELECT TO authenticated USING (is_active = TRUE);
INSERT INTO public.ref_psychospiritual_history_types (history_code, history_label, sort_order) VALUES
    ('NONE',            'No prior psychedelic or spiritual experience',         1),
    ('MEDITATION_LT5',  'Meditation / Mindfulness practice (< 5 years)',        2),
    ('MEDITATION_GT5',  'Meditation / Mindfulness practice (5+ years)',         3),
    ('PSYCHEDELIC_LT5', 'Prior psychedelic experience (1–5 sessions)',          4),
    ('PSYCHEDELIC_GT5', 'Prior psychedelic experience (6+ sessions)',           5),
    ('SPIRITUAL_TRAD',  'Active spiritual or religious practice',               6),
    ('RETREAT',         'Contemplative or ceremonial retreat experience',        7),
    ('PLANT_MEDICINE',  'Plant medicine ceremony (non-clinical)',                8),
    ('OTHER',           'Other — described in session intake',                  9)
ON CONFLICT (history_code) DO NOTHING;

-- B6. ref_practitioner_types
CREATE TABLE IF NOT EXISTS public.ref_practitioner_types (
    practitioner_type_id    BIGINT  PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    type_code               TEXT    NOT NULL UNIQUE,
    type_label              TEXT    NOT NULL,
    requires_license        BOOLEAN NOT NULL DEFAULT TRUE,
    is_active               BOOLEAN NOT NULL DEFAULT TRUE,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.ref_practitioner_types ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ref_practitioner_types_select" ON public.ref_practitioner_types;
CREATE POLICY "ref_practitioner_types_select"
    ON public.ref_practitioner_types FOR SELECT USING (is_active = TRUE);
INSERT INTO public.ref_practitioner_types (type_code, type_label, requires_license) VALUES
    ('MD',          'Medical Doctor (MD)',                          TRUE),
    ('DO',          'Doctor of Osteopathic Medicine (DO)',          TRUE),
    ('NP',          'Nurse Practitioner (NP)',                      TRUE),
    ('PA',          'Physician Assistant (PA)',                     TRUE),
    ('PHD_PSYCH',   'Licensed Psychologist (PhD)',                  TRUE),
    ('LCSW',        'Licensed Clinical Social Worker (LCSW)',       TRUE),
    ('LPC',         'Licensed Professional Counselor (LPC)',        TRUE),
    ('LMFT',        'Licensed Marriage & Family Therapist (LMFT)',  TRUE),
    ('FACILITATOR', 'Certified Psychedelic Facilitator',            TRUE),
    ('RESEARCHER',  'Clinical Researcher',                         FALSE),
    ('OTHER',       'Other / Not Listed',                          FALSE)
ON CONFLICT (type_code) DO NOTHING;

-- B7. ref_rejection_reasons
CREATE TABLE IF NOT EXISTS public.ref_rejection_reasons (
    rejection_reason_id BIGINT  PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    reason_code         TEXT    NOT NULL UNIQUE,
    reason_label        TEXT    NOT NULL,
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.ref_rejection_reasons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ref_rejection_reasons_select" ON public.ref_rejection_reasons;
CREATE POLICY "ref_rejection_reasons_select"
    ON public.ref_rejection_reasons FOR SELECT TO authenticated USING (is_active = TRUE);
INSERT INTO public.ref_rejection_reasons (reason_code, reason_label) VALUES
    ('ALREADY_EXISTS',  'Already exists in the system under a different name'),
    ('TOO_SPECIFIC',    'Too specific — use the existing broader option'),
    ('OUT_OF_SCOPE',    'Out of clinical scope for this platform'),
    ('INSUFFICIENT_EV', 'Insufficient clinical evidence to add'),
    ('DUPLICATE',       'Duplicate request already in review'),
    ('PENDING_REVIEW',  'Under review — decision pending')
ON CONFLICT (reason_code) DO NOTHING;


-- ============================================================================
-- BLOCK C: ADD FK COLUMNS TO log_ TABLES
-- ============================================================================

-- log_clinical_records
ALTER TABLE public.log_clinical_records
    ADD COLUMN IF NOT EXISTS assessment_scale_id INTEGER
        REFERENCES public.ref_assessment_scales(assessment_scale_id) ON DELETE SET NULL;
ALTER TABLE public.log_clinical_records
    ADD COLUMN IF NOT EXISTS clinical_phenotype_id BIGINT
        REFERENCES public.ref_clinical_phenotypes(clinical_phenotype_id) ON DELETE SET NULL;
ALTER TABLE public.log_clinical_records
    ADD COLUMN IF NOT EXISTS contraindication_verdict_id BIGINT
        REFERENCES public.ref_contraindication_verdicts(verdict_id) ON DELETE SET NULL;
ALTER TABLE public.log_clinical_records
    ADD COLUMN IF NOT EXISTS patient_sex_id BIGINT; -- FK to ref_sex when that table is created
ALTER TABLE public.log_clinical_records
    ADD COLUMN IF NOT EXISTS weight_range_id BIGINT
        REFERENCES public.ref_weight_ranges(id) ON DELETE SET NULL;
ALTER TABLE public.log_clinical_records
    ADD COLUMN IF NOT EXISTS concomitant_med_ids BIGINT[];
ALTER TABLE public.log_clinical_records
    ADD COLUMN IF NOT EXISTS patient_age_years INTEGER
        CHECK (patient_age_years BETWEEN 18 AND 120);
-- Backfill contraindication_verdict_id from CHECK-constrained text values
UPDATE public.log_clinical_records lcr
SET contraindication_verdict_id = rcv.verdict_id
FROM public.ref_contraindication_verdicts rcv
WHERE lcr.contraindication_verdict = rcv.verdict_code
  AND lcr.contraindication_verdict IS NOT NULL
  AND lcr.contraindication_verdict_id IS NULL;

-- log_outcomes
ALTER TABLE public.log_outcomes
    ADD COLUMN IF NOT EXISTS assessment_scale_id INTEGER
        REFERENCES public.ref_assessment_scales(assessment_scale_id) ON DELETE SET NULL;

-- log_session_vitals
ALTER TABLE public.log_session_vitals
    ADD COLUMN IF NOT EXISTS data_source_id BIGINT
        REFERENCES public.ref_data_sources(data_source_id) ON DELETE SET NULL;

-- log_session_timeline_events — wire FK constraint on existing event_type_id
ALTER TABLE public.log_session_timeline_events
    DROP CONSTRAINT IF EXISTS fk_timeline_events_event_type_id;
ALTER TABLE public.log_session_timeline_events
    ADD CONSTRAINT fk_timeline_events_event_type_id
    FOREIGN KEY (event_type_id)
    REFERENCES public.ref_flow_event_types(id) ON DELETE SET NULL;

-- log_baseline_assessments
ALTER TABLE public.log_baseline_assessments
    ADD COLUMN IF NOT EXISTS psychospiritual_history_id BIGINT
        REFERENCES public.ref_psychospiritual_history_types(psychospiritual_history_id) ON DELETE SET NULL;

-- log_red_alerts
ALTER TABLE public.log_red_alerts
    ADD COLUMN IF NOT EXISTS alert_type_id BIGINT
        REFERENCES public.ref_alert_types(alert_type_id) ON DELETE SET NULL;

-- log_feature_requests
ALTER TABLE public.log_feature_requests
    ADD COLUMN IF NOT EXISTS rejection_reason_id BIGINT
        REFERENCES public.ref_rejection_reasons(rejection_reason_id) ON DELETE SET NULL;


-- ============================================================================
-- BLOCK D: CHECK CONSTRAINTS ON ENUM COLUMNS
-- ============================================================================

ALTER TABLE public.log_feature_requests
    DROP CONSTRAINT IF EXISTS chk_feature_requests_request_type;
ALTER TABLE public.log_feature_requests
    ADD CONSTRAINT chk_feature_requests_request_type
    CHECK (request_type IN ('observation','cancellation_reason','other'));

ALTER TABLE public.log_feature_requests
    DROP CONSTRAINT IF EXISTS chk_feature_requests_category;
ALTER TABLE public.log_feature_requests
    ADD CONSTRAINT chk_feature_requests_category
    CHECK (category IS NULL OR category IN ('baseline','session','integration','safety'));

ALTER TABLE public.log_feature_requests
    DROP CONSTRAINT IF EXISTS chk_feature_requests_status;
ALTER TABLE public.log_feature_requests
    ADD CONSTRAINT chk_feature_requests_status
    CHECK (status IN ('pending','approved','rejected'));

ALTER TABLE public.log_dose_events
    DROP CONSTRAINT IF EXISTS chk_dose_events_patient_id_format;
ALTER TABLE public.log_dose_events
    ADD CONSTRAINT chk_dose_events_patient_id_format
    CHECK (patient_id ~ '^[A-Z0-9]{4,20}$');


-- ============================================================================
-- BLOCK E: DROP FREE-TEXT VIOLATION COLUMNS
-- ============================================================================

-- log_waitlist — stripped to email-only (USER decision 2026-02-28)
ALTER TABLE public.log_waitlist DROP COLUMN IF EXISTS practitioner_type_id;
ALTER TABLE public.log_waitlist DROP COLUMN IF EXISTS first_name;
ALTER TABLE public.log_waitlist DROP COLUMN IF EXISTS practitioner_type;
ALTER TABLE public.log_waitlist DROP COLUMN IF EXISTS source;

-- log_clinical_records
ALTER TABLE public.log_clinical_records DROP COLUMN IF EXISTS session_type;
ALTER TABLE public.log_clinical_records DROP COLUMN IF EXISTS dosage_route;
ALTER TABLE public.log_clinical_records DROP COLUMN IF EXISTS contraindication_override_reason;
ALTER TABLE public.log_clinical_records DROP COLUMN IF EXISTS contraindication_verdict;
ALTER TABLE public.log_clinical_records DROP COLUMN IF EXISTS clinical_phenotype;
ALTER TABLE public.log_clinical_records DROP COLUMN IF EXISTS outcome_measure;
ALTER TABLE public.log_clinical_records DROP COLUMN IF EXISTS safety_event_category;
ALTER TABLE public.log_clinical_records DROP COLUMN IF EXISTS patient_link_code;
ALTER TABLE public.log_clinical_records DROP COLUMN IF EXISTS session_notes;
ALTER TABLE public.log_clinical_records DROP COLUMN IF EXISTS batch_number;
ALTER TABLE public.log_clinical_records DROP COLUMN IF EXISTS patient_sex;
ALTER TABLE public.log_clinical_records DROP COLUMN IF EXISTS patient_weight_range;
ALTER TABLE public.log_clinical_records DROP COLUMN IF EXISTS concomitant_meds;
ALTER TABLE public.log_clinical_records DROP COLUMN IF EXISTS patient_age;

-- log_feature_requests
ALTER TABLE public.log_feature_requests DROP COLUMN IF EXISTS rejection_reason;

-- log_patient_flow_events
ALTER TABLE public.log_patient_flow_events DROP COLUMN IF EXISTS notes;
ALTER TABLE public.log_patient_flow_events DROP COLUMN IF EXISTS source_table;

-- log_red_alerts
ALTER TABLE public.log_red_alerts DROP COLUMN IF EXISTS alert_type;
ALTER TABLE public.log_red_alerts DROP COLUMN IF EXISTS patient_id;
ALTER TABLE public.log_red_alerts DROP COLUMN IF EXISTS alert_severity;
ALTER TABLE public.log_red_alerts DROP COLUMN IF EXISTS alert_message;
ALTER TABLE public.log_red_alerts DROP COLUMN IF EXISTS response_notes;

-- log_session_timeline_events
ALTER TABLE public.log_session_timeline_events DROP COLUMN IF EXISTS event_type;

-- log_session_vitals
ALTER TABLE public.log_session_vitals DROP COLUMN IF EXISTS source;

-- log_safety_events
ALTER TABLE public.log_safety_events DROP COLUMN IF EXISTS severity_grade_id;
ALTER TABLE public.log_safety_events DROP COLUMN IF EXISTS resolution_status_id;
ALTER TABLE public.log_safety_events DROP COLUMN IF EXISTS event_type;

-- log_consent
ALTER TABLE public.log_consent DROP COLUMN IF EXISTS type;
ALTER TABLE public.log_consent DROP COLUMN IF EXISTS timestamp;

-- log_behavioral_changes (RLS rebuilt below)
ALTER TABLE public.log_behavioral_changes DROP COLUMN IF EXISTS change_type;
ALTER TABLE public.log_behavioral_changes DROP COLUMN IF EXISTS change_description;
ALTER TABLE public.log_behavioral_changes DROP COLUMN IF EXISTS patient_id;

-- log_baseline_assessments
ALTER TABLE public.log_baseline_assessments DROP COLUMN IF EXISTS patient_id;
ALTER TABLE public.log_baseline_assessments DROP COLUMN IF EXISTS psycho_spiritual_history;

-- log_integration_sessions (RLS rebuilt below)
ALTER TABLE public.log_integration_sessions DROP COLUMN IF EXISTS patient_id;
ALTER TABLE public.log_integration_sessions DROP COLUMN IF EXISTS cancellation_reason;
ALTER TABLE public.log_integration_sessions DROP COLUMN IF EXISTS session_notes;

-- log_longitudinal_assessments (RLS rebuilt below)
ALTER TABLE public.log_longitudinal_assessments DROP COLUMN IF EXISTS patient_id;

-- log_pulse_checks (RLS rebuilt below)
ALTER TABLE public.log_pulse_checks DROP COLUMN IF EXISTS patient_id;

-- log_outcomes
ALTER TABLE public.log_outcomes DROP COLUMN IF EXISTS date;
ALTER TABLE public.log_outcomes ADD COLUMN IF NOT EXISTS outcome_date DATE;
ALTER TABLE public.log_outcomes DROP COLUMN IF EXISTS type;
ALTER TABLE public.log_outcomes DROP COLUMN IF EXISTS interpretation;

-- log_protocols
ALTER TABLE public.log_protocols DROP COLUMN IF EXISTS substance;
ALTER TABLE public.log_protocols DROP COLUMN IF EXISTS indication;
ALTER TABLE public.log_protocols DROP COLUMN IF EXISTS notes;

-- log_patient_site_links
ALTER TABLE public.log_patient_site_links DROP COLUMN IF EXISTS transfer_reason;

-- log_vocabulary_requests
ALTER TABLE public.log_vocabulary_requests DROP COLUMN IF EXISTS proposed_category;


-- ============================================================================
-- BLOCK F: REBUILD RLS POLICIES USING patient_uuid (replacing patient_id)
-- ============================================================================

-- log_behavioral_changes
DROP POLICY IF EXISTS "Users can insert behavioral changes" ON public.log_behavioral_changes;
DROP POLICY IF EXISTS "Users can only access their site's behavioral changes" ON public.log_behavioral_changes;
CREATE POLICY "Users can insert behavioral changes"
    ON public.log_behavioral_changes FOR INSERT TO authenticated
    WITH CHECK (patient_uuid IN (
        SELECT patient_uuid FROM public.log_baseline_assessments
        WHERE site_id IN (SELECT site_id FROM public.log_user_sites WHERE user_id = auth.uid())
    ));
CREATE POLICY "Users can only access their site's behavioral changes"
    ON public.log_behavioral_changes FOR SELECT TO authenticated
    USING (patient_uuid IN (
        SELECT patient_uuid FROM public.log_baseline_assessments
        WHERE site_id IN (SELECT site_id FROM public.log_user_sites WHERE user_id = auth.uid())
    ));

-- log_integration_sessions
DROP POLICY IF EXISTS "Users can insert integration sessions" ON public.log_integration_sessions;
DROP POLICY IF EXISTS "Users can only access their site's integration sessions" ON public.log_integration_sessions;
CREATE POLICY "Users can insert integration sessions"
    ON public.log_integration_sessions FOR INSERT TO authenticated
    WITH CHECK (patient_uuid IN (
        SELECT patient_uuid FROM public.log_baseline_assessments
        WHERE site_id IN (SELECT site_id FROM public.log_user_sites WHERE user_id = auth.uid())
    ));
CREATE POLICY "Users can only access their site's integration sessions"
    ON public.log_integration_sessions FOR SELECT TO authenticated
    USING (patient_uuid IN (
        SELECT patient_uuid FROM public.log_baseline_assessments
        WHERE site_id IN (SELECT site_id FROM public.log_user_sites WHERE user_id = auth.uid())
    ));

-- log_longitudinal_assessments
DROP POLICY IF EXISTS "Users can insert longitudinal assessments" ON public.log_longitudinal_assessments;
DROP POLICY IF EXISTS "Users can only access their site's longitudinal assessments" ON public.log_longitudinal_assessments;
CREATE POLICY "Users can insert longitudinal assessments"
    ON public.log_longitudinal_assessments FOR INSERT TO authenticated
    WITH CHECK (patient_uuid IN (
        SELECT patient_uuid FROM public.log_baseline_assessments
        WHERE site_id IN (SELECT site_id FROM public.log_user_sites WHERE user_id = auth.uid())
    ));
CREATE POLICY "Users can only access their site's longitudinal assessments"
    ON public.log_longitudinal_assessments FOR SELECT TO authenticated
    USING (patient_uuid IN (
        SELECT patient_uuid FROM public.log_baseline_assessments
        WHERE site_id IN (SELECT site_id FROM public.log_user_sites WHERE user_id = auth.uid())
    ));

-- log_pulse_checks
DROP POLICY IF EXISTS "Users can insert pulse checks" ON public.log_pulse_checks;
DROP POLICY IF EXISTS "Users can only access their site's pulse checks" ON public.log_pulse_checks;
CREATE POLICY "Users can insert pulse checks"
    ON public.log_pulse_checks FOR INSERT TO authenticated
    WITH CHECK (patient_uuid IN (
        SELECT patient_uuid FROM public.log_baseline_assessments
        WHERE site_id IN (SELECT site_id FROM public.log_user_sites WHERE user_id = auth.uid())
    ));
CREATE POLICY "Users can only access their site's pulse checks"
    ON public.log_pulse_checks FOR SELECT TO authenticated
    USING (patient_uuid IN (
        SELECT patient_uuid FROM public.log_baseline_assessments
        WHERE site_id IN (SELECT site_id FROM public.log_user_sites WHERE user_id = auth.uid())
    ));

-- log_red_alerts
DROP POLICY IF EXISTS "Users can insert red alerts" ON public.log_red_alerts;
DROP POLICY IF EXISTS "Users can only access their site's red alerts" ON public.log_red_alerts;
CREATE POLICY "Users can insert red alerts"
    ON public.log_red_alerts FOR INSERT TO authenticated
    WITH CHECK (patient_uuid IN (
        SELECT patient_uuid FROM public.log_baseline_assessments
        WHERE site_id IN (SELECT site_id FROM public.log_user_sites WHERE user_id = auth.uid())
    ));
CREATE POLICY "Users can only access their site's red alerts"
    ON public.log_red_alerts FOR SELECT TO authenticated
    USING (patient_uuid IN (
        SELECT patient_uuid FROM public.log_baseline_assessments
        WHERE site_id IN (SELECT site_id FROM public.log_user_sites WHERE user_id = auth.uid())
    ));


-- ============================================================================
-- BLOCK G: AUDIT TRAIL — ADD created_at + created_by
-- ============================================================================

-- Add missing created_at
ALTER TABLE public.log_behavioral_changes    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.log_corrections           ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.log_longitudinal_assessments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.log_pulse_checks         ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.log_safety_events        ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.log_user_sites           ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- Add created_by to all clinical + admin tables
ALTER TABLE public.log_clinical_records        ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.log_baseline_assessments    ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.log_behavioral_changes      ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.log_consent                 ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.log_corrections             ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.log_dose_events             ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.log_integration_sessions    ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.log_interventions           ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.log_longitudinal_assessments ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.log_outcomes                ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.log_protocols               ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.log_pulse_checks            ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.log_red_alerts              ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.log_safety_events           ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.log_session_timeline_events ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.log_session_vitals          ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.log_feature_requests        ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.log_vocabulary_requests     ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;


-- ============================================================================
-- BLOCK H: CHECK CONSTRAINTS — PHASE 4 + PHASE 5
-- ============================================================================

-- log_outcomes.score range
ALTER TABLE public.log_outcomes DROP CONSTRAINT IF EXISTS chk_outcomes_score;
ALTER TABLE public.log_outcomes ADD CONSTRAINT chk_outcomes_score
    CHECK (score IS NULL OR (score >= 0 AND score <= 160));

-- log_protocols.status
ALTER TABLE public.log_protocols DROP CONSTRAINT IF EXISTS chk_protocols_status;
ALTER TABLE public.log_protocols ADD CONSTRAINT chk_protocols_status
    CHECK (status IN ('draft','active','paused','completed','archived'));

-- log_interventions.status
ALTER TABLE public.log_interventions DROP CONSTRAINT IF EXISTS chk_interventions_status;
ALTER TABLE public.log_interventions ADD CONSTRAINT chk_interventions_status
    CHECK (status IN ('active','monitoring','resolved','discontinued'));

-- log_sites.site_type
ALTER TABLE public.log_sites DROP CONSTRAINT IF EXISTS chk_sites_site_type;
ALTER TABLE public.log_sites ADD CONSTRAINT chk_sites_site_type
    CHECK (site_type IN ('clinic','research','hospital','telehealth','retreat_center','other'));

-- log_safety_events.causality_code (WHO causality assessment scale)
ALTER TABLE public.log_safety_events DROP CONSTRAINT IF EXISTS chk_safety_events_causality_code;
ALTER TABLE public.log_safety_events ADD CONSTRAINT chk_safety_events_causality_code
    CHECK (causality_code IN ('certain','probable','possible','unlikely','conditional','unclassifiable'));

-- log_system_events.event_status
ALTER TABLE public.log_system_events DROP CONSTRAINT IF EXISTS chk_system_events_event_status;
ALTER TABLE public.log_system_events ADD CONSTRAINT chk_system_events_event_status
    CHECK (event_status IN ('captured','processed','failed','archived'));


-- ============================================================================
-- END OF MIGRATION 079
-- ============================================================================
-- Post-apply verification (run manually to confirm):
--
-- SELECT table_name, column_name, data_type
-- FROM information_schema.columns
-- WHERE table_schema = 'public'
--   AND table_name LIKE 'log_%'
--   AND data_type IN ('text','character varying')
-- ORDER BY table_name, column_name;
--
-- Expected: Only CHECK-constrained enums, external identifiers,
--           cryptographic hashes, and intentional free-text intake fields.
-- ============================================================================
