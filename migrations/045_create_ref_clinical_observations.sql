-- ============================================
-- MIGRATION 045: Create ref_clinical_observations
-- ============================================
-- Migration Number: 045
-- Date: 2026-02-19
-- Author: SOOP
-- Purpose: Create and seed the ref_clinical_observations table.
--          This table provides controlled vocabulary for the ObservationSelector
--          component, allowing PHI-safe structured clinical note entry across
--          all four Arc of Care categories.
-- Affected Tables: ref_clinical_observations (new)
-- Ticket: WO-042 (PHI compliance - ObservationSelector)
-- ============================================

-- ============================================
-- SECTION 1: CREATE TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.ref_clinical_observations (
    observation_id  BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    observation_code TEXT NOT NULL UNIQUE,     -- Short machine code, e.g. 'BASE_HIGH_EXPECTANCY'
    observation_text TEXT NOT NULL,            -- Display text shown to practitioners
    category        TEXT NOT NULL              -- 'baseline' | 'session' | 'integration' | 'safety'
                    CHECK (category IN ('baseline', 'session', 'integration', 'safety')),
    is_active       BOOLEAN NOT NULL DEFAULT true,
    sort_order      INT      NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for the primary query pattern: filter by category + is_active
CREATE INDEX IF NOT EXISTS idx_ref_clinical_obs_category
    ON public.ref_clinical_observations (category, is_active);

-- ============================================
-- SECTION 2: ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.ref_clinical_observations ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read observations (it's a reference table)
CREATE POLICY "ref_clinical_observations_read"
    ON public.ref_clinical_observations
    FOR SELECT
    TO authenticated
    USING (true);

-- Only network admins can modify the vocabulary
CREATE POLICY "ref_clinical_observations_admin_write"
    ON public.ref_clinical_observations
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_sites
            WHERE user_sites.user_id = auth.uid()
              AND user_sites.role = 'network_admin'
        )
    );

-- ============================================
-- SECTION 3: SEED — BASELINE OBSERVATIONS
-- ============================================
-- Used in Phase 1 Preparation (BaselineObservationsForm, ArcOfCareDemo)

INSERT INTO public.ref_clinical_observations
    (observation_code, observation_text, category, sort_order)
VALUES
    -- Expectancy & mindset
    ('BASE_HIGH_EXPECTANCY',        'Patient reports high confidence in therapeutic outcome',       'baseline', 10),
    ('BASE_AMBIVALENT_EXPECTANCY',  'Patient expresses ambivalence about treatment efficacy',       'baseline', 11),
    ('BASE_FEAR_LOSING_CONTROL',    'Patient expresses fear of losing control during session',     'baseline', 12),
    ('BASE_SPIRITUAL_OPENNESS',     'Patient demonstrates openness to spiritual/transpersonal experience', 'baseline', 13),
    ('BASE_PRIOR_PSYCHEDELIC_EXP',  'Prior psychedelic experience reported — positive context',    'baseline', 14),
    ('BASE_PRIOR_DIFFICULT_EXP',    'Prior psychedelic experience reported — challenging context', 'baseline', 15),

    -- Trauma & history
    ('BASE_CHILDHOOD_TRAUMA_DISC',  'Childhood trauma disclosed in intake',                        'baseline', 20),
    ('BASE_RECENT_LOSS',            'Recent significant loss or grief reported',                   'baseline', 21),
    ('BASE_ONGOING_STRESSOR',       'Significant ongoing life stressor identified',                'baseline', 22),
    ('BASE_SOCIAL_SUPPORT_STRONG',  'Strong social support system in place',                      'baseline', 23),
    ('BASE_SOCIAL_ISOLATION',       'Social isolation reported — limited support network',         'baseline', 24),

    -- Physical & clinical
    ('BASE_SLEEP_ADEQUATE',         'Adequate sleep reported in days prior to session',            'baseline', 30),
    ('BASE_SLEEP_DISRUPTED',        'Sleep disruption reported in days prior to session',          'baseline', 31),
    ('BASE_SUBSTANCE_FREE_30D',     'Patient confirms substance-free period ≥30 days',             'baseline', 32),
    ('BASE_CAFFEINE_DAY_OF',        'Caffeine use day-of-session reported',                        'baseline', 33),
    ('BASE_MEDICATION_STABLE',      'Psychiatric medication regimen stable ≥6 weeks',              'baseline', 34),
    ('BASE_FASTING_CONFIRMED',      'Patient confirms fasting period as instructed',               'baseline', 35),

    -- Setting readiness
    ('BASE_INTENTIONS_CLEAR',       'Patient has articulated clear and meaningful intentions',     'baseline', 40),
    ('BASE_INTENTIONS_VAGUE',       'Patient unable to articulate clear intentions',               'baseline', 41),
    ('BASE_INTEGRATION_PLAN',       'Post-session integration plan established',                  'baseline', 42),
    ('BASE_ESCORT_CONFIRMED',       'Designated escort/support person confirmed for post-session', 'baseline', 43)

ON CONFLICT (observation_code) DO NOTHING;

-- ============================================
-- SECTION 4: SEED — SESSION OBSERVATIONS
-- ============================================
-- Used in Phase 2 Dosing (SessionObservationsForm)

INSERT INTO public.ref_clinical_observations
    (observation_code, observation_text, category, sort_order)
VALUES
    -- Phenomenological
    ('SESS_VISUAL_PHENOMENA',       'Visual phenomena reported (geometric, naturalistic)',         'session', 10),
    ('SESS_EMOTIONAL_RELEASE',      'Significant emotional release observed',                     'session', 11),
    ('SESS_INSIGHT_REPORTED',       'Meaningful psychological insight reported by patient',        'session', 12),
    ('SESS_MYSTICAL_QUALITY',       'Patient reports experience with mystical/transcendent quality', 'session', 13),
    ('SESS_CHALLENGING_PERIOD',     'Challenging period encountered — patient required reassurance', 'session', 14),
    ('SESS_DIFFICULT_MATERIAL',     'Difficult psychological material surfaced (trauma-adjacent)', 'session', 15),
    ('SESS_SOMATIC_ACTIVITY',       'Notable somatic activity (tremor, temperature change, etc.)', 'session', 16),

    -- Behavioral
    ('SESS_CALM_COOPERATIVE',       'Patient calm and cooperative throughout session',             'session', 20),
    ('SESS_AGITATED_MANAGED',       'Agitation observed, managed with grounding techniques',      'session', 21),
    ('SESS_VERBALLY_ACTIVE',        'Patient verbally active — narrating experience',             'session', 22),
    ('SESS_SILENT_INTERNAL',        'Patient predominantly silent, appeared internally focused',  'session', 23),
    ('SESS_EYE_CONTACT_MAINTAINED', 'Patient maintained periodic appropriate eye contact',        'session', 24),

    -- Clinical
    ('SESS_VITALS_STABLE',          'Vital signs stable throughout session within normal range',  'session', 30),
    ('SESS_BP_ELEVATED_TRANSIENT',  'Transient blood pressure elevation — self-resolved',         'session', 31),
    ('SESS_NAUSEA_NOTED',           'Nausea noted — patient managed without intervention',        'session', 32),
    ('SESS_NAUSEA_EMESIS',          'Nausea with emesis — patient recovered comfortably',         'session', 33),
    ('SESS_HEADACHE_NOTED',         'Headache noted during or immediately post-session',          'session', 34),
    ('SESS_REDOSING_ADMINISTERED',  'Supplemental dose administered per protocol',               'session', 35),
    ('SESS_NO_ADVERSE_EVENTS',      'No adverse events observed during session',                 'session', 36),

    -- Closure
    ('SESS_COMPLETE_RETURN',        'Complete return to baseline at session close',               'session', 40),
    ('SESS_PARTIAL_INTEGRATION',    'Some residual altered states at close — resolved within 1hr', 'session', 41),
    ('SESS_AFTERGLOW_POSITIVE',     'Patient reports positive afterglow at session close',        'session', 42),
    ('SESS_IMMEDIATE_INSIGHTS',     'Patient articulated immediate insights at close',            'session', 43)

ON CONFLICT (observation_code) DO NOTHING;

-- ============================================
-- SECTION 5: SEED — INTEGRATION OBSERVATIONS
-- ============================================
-- Used in Phase 3 Integration (StructuredIntegrationSessionForm)

INSERT INTO public.ref_clinical_observations
    (observation_code, observation_text, category, sort_order)
VALUES
    -- Processing
    ('INTG_INSIGHT_INTEGRATING',    'Patient actively integrating session insights',              'integration', 10),
    ('INTG_INSIGHT_FADING',         'Session insights reported as fading or hard to access',     'integration', 11),
    ('INTG_REVISITING_MATERIAL',    'Patient revisiting difficult material from session',         'integration', 12),
    ('INTG_NARRATIVE_SHIFTING',     'Meaningful shift in patient self-narrative observed',       'integration', 13),
    ('INTG_DIFFICULT_INTEGRATION',  'Difficulty integrating challenging session experiences',    'integration', 14),

    -- Behavior and lifestyle
    ('INTG_SLEEP_IMPROVED',         'Patient reports sleep quality improvement',                 'integration', 20),
    ('INTG_SLEEP_DISRUPTED',        'Sleep disruption reported during integration period',       'integration', 21),
    ('INTG_SUBSTANCE_REDUCED',      'Reduction in substance use reported since session',         'integration', 22),
    ('INTG_SOCIAL_ENGAGEMENT_UP',   'Increased social engagement and connection reported',       'integration', 23),
    ('INTG_NEW_PRACTICE_STARTED',   'Patient initiated new wellness practice (meditation, journaling, etc.)', 'integration', 24),
    ('INTG_CREATIVE_ACTIVITY',      'Increased creative activity or artistic expression reported', 'integration', 25),

    -- Clinical
    ('INTG_MOOD_IMPROVED',          'Sustained mood improvement observed since session',         'integration', 30),
    ('INTG_ANXIETY_REDUCED',        'Reduction in anxiety symptoms reported',                   'integration', 31),
    ('INTG_PHOBIAS_REDUCED',        'Reduction in phobic response reported',                    'integration', 32),
    ('INTG_GRIEF_PROCESSING',       'Active grief processing noted — progressing constructively', 'integration', 33),
    ('INTG_RELATIONSHIP_WORK',      'Patient reporting meaningful relationship work underway',   'integration', 34),
    ('INTG_PROFESSIONAL_SUPPORT',   'Patient engaged with additional professional support',      'integration', 35),
    ('INTG_NO_CONCERNS',            'No integration concerns identified at this session',        'integration', 36)

ON CONFLICT (observation_code) DO NOTHING;

-- ============================================
-- SECTION 6: SEED — SAFETY OBSERVATIONS
-- ============================================
-- Used in Ongoing Safety (StructuredSafetyCheckForm)

INSERT INTO public.ref_clinical_observations
    (observation_code, observation_text, category, sort_order)
VALUES
    -- Protective factors
    ('SAFE_PROTECTIVE_FACTORS',     'Protective factors confirmed and documented',               'safety', 10),
    ('SAFE_SAFETY_PLAN_REVIEWED',   'Safety plan reviewed and updated with patient',             'safety', 11),
    ('SAFE_SUPPORT_NETWORK_ACTIVE', 'Active support network engaged and aware of treatment',    'safety', 12),
    ('SAFE_CRISIS_RESOURCES_GIVEN', 'Crisis resources provided and acknowledged',               'safety', 13),

    -- Risk flags
    ('SAFE_SI_PASSIVE_IDEATION',    'Passive suicidal ideation reported — no intent or plan',   'safety', 20),
    ('SAFE_SI_ACTIVE_IDEATION',     'Active suicidal ideation reported — escalation required',  'safety', 21),
    ('SAFE_SELF_HARM_DISCLOSED',    'Non-suicidal self-harm behavior disclosed',                'safety', 22),
    ('SAFE_SUBSTANCE_RELAPSE',      'Substance relapse reported since last contact',            'safety', 23),
    ('SAFE_MEDICATION_NONCOMPLIANT','Psychiatric medication non-compliance reported',            'safety', 24),
    ('SAFE_PSYCHOTIC_SX',           'Psychotic symptoms observed or reported',                  'safety', 25),
    ('SAFE_DISSOCIATIVE_SX',        'Dissociative symptoms reported — monitoring increased',    'safety', 26),

    -- Actions
    ('SAFE_HOSPITALIZATION_DISC',   'Hospitalization discussed and declined by patient',        'safety', 30),
    ('SAFE_EMERGENCY_CONTACT_NOTIF','Emergency contact notified per protocol',                  'safety', 31),
    ('SAFE_PSYCHIATRY_REFERRAL',    'Referral to psychiatry initiated',                         'safety', 32),
    ('SAFE_CLINICIAN_CONSULT',      'Peer clinician consultation conducted',                    'safety', 33),
    ('SAFE_CHECK_IN_FREQ_INCREASED','Check-in frequency increased from standard schedule',      'safety', 34),
    ('SAFE_NO_SAFETY_CONCERNS',     'No safety concerns identified at this check',              'safety', 40)

ON CONFLICT (observation_code) DO NOTHING;

-- ============================================
-- SECTION 7: VERIFICATION
-- ============================================

SELECT
    category,
    COUNT(*) AS observation_count
FROM public.ref_clinical_observations
WHERE is_active = true
GROUP BY category
ORDER BY category;

-- Expected output:
-- baseline     | 21
-- integration  | 17
-- safety       | 16
-- session      | 22

-- ============================================
-- END OF MIGRATION 045
-- ============================================
