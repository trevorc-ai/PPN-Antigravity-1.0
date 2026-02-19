-- ============================================================================
-- Migration: 056_reseed_ref_tables.sql
-- Purpose:   Sync ref_ table seed data to exactly match form component constants.
--            Mismatched seeds cause FK IDs to decode to wrong labels on read.
--            Also adds veteran/PTSD-specific vocabulary (mission priority).
--
-- SAFE TO RE-RUN: Uses DELETE + INSERT within a transaction.
-- Does NOT drop tables. Does NOT alter any log_ table data.
-- ============================================================================

BEGIN;

-- ── 1. ref_session_focus_areas ────────────────────────────────────────────────
-- Source of truth: StructuredIntegrationSessionForm.tsx SESSION_FOCUS_AREAS const
-- IDs 1-8 must match exactly what the form stores in log_integration_sessions.session_focus_ids[]

DELETE FROM ref_session_focus_areas WHERE focus_area_id <= 12;

INSERT INTO ref_session_focus_areas (focus_area_id, focus_label, category, is_active)
VALUES
  (1,  'Processing Dosing Experience',    'processing',    true),
  (2,  'Relationship Insights',           'relational',    true),
  (3,  'Career & Purpose Exploration',    'existential',   true),
  (4,  'Grief & Loss Processing',         'processing',    true),
  (5,  'Trauma Integration',              'processing',    true),
  (6,  'Behavioral Change Planning',      'behavioral',    true),
  (7,  'Relapse Prevention',              'behavioral',    true),
  (8,  'Spiritual & Existential Themes',  'existential',   true),
  -- Veteran/PTSD-specific additions (mission priority)
  (9,  'Military Trauma Processing',      'processing',    true),
  (10, 'Moral Injury Work',               'existential',   true),
  (11, 'Hypervigilance & Nervous System', 'processing',    true),
  (12, 'Reintegration Planning',          'behavioral',    true)
ON CONFLICT (focus_area_id) DO UPDATE
  SET focus_label = EXCLUDED.focus_label,
      category    = EXCLUDED.category,
      is_active   = EXCLUDED.is_active;

-- ── 2. ref_homework_types ─────────────────────────────────────────────────────
-- Source of truth: StructuredIntegrationSessionForm.tsx HOMEWORK_TYPES const

DELETE FROM ref_homework_types WHERE homework_type_id <= 12;

INSERT INTO ref_homework_types (homework_type_id, homework_label, frequency, is_active)
VALUES
  (1,  'Daily Journaling',               '10 min/day',   true),
  (2,  'Meditation Practice',            '10 min/day',   true),
  (3,  'Gratitude List',                 '3 items/day',  true),
  (4,  'Nature Walks',                   '3x/week',      true),
  (5,  'Reconnect with Family Member',   'once/week',    true),
  (6,  'Creative Expression Activity',   '2x/week',      true),
  (7,  'Breathwork Practice',            '5 min/day',    true),
  (8,  'Values Clarification Exercise',  'once/week',    true),
  -- Veteran/PTSD-specific additions
  (9,  'Grounding Technique Practice',   '3x/day',       true),
  (10, 'Peer Support Check-in',          'once/week',    true),
  (11, 'Body Scan Exercise',             '10 min/day',   true),
  (12, 'Safe Place Visualization',       '5 min/day',    true)
ON CONFLICT (homework_type_id) DO UPDATE
  SET homework_label = EXCLUDED.homework_label,
      frequency      = EXCLUDED.frequency,
      is_active      = EXCLUDED.is_active;

-- ── 3. ref_therapist_observations ────────────────────────────────────────────
-- Source of truth: StructuredIntegrationSessionForm.tsx THERAPIST_OBSERVATIONS const

DELETE FROM ref_therapist_observations WHERE observation_id <= 12;

INSERT INTO ref_therapist_observations (observation_id, observation_label, category, is_active)
VALUES
  (1,  'Strong therapeutic alliance',          'alliance',      true),
  (2,  'Increased emotional openness',         'affect',        true),
  (3,  'Resistance to processing',             'resistance',    true),
  (4,  'Somatic activation present',           'somatic',       true),
  (5,  'Spiritual/transpersonal content',      'existential',   true),
  (6,  'Clear insight articulated',            'cognitive',     true),
  (7,  'Grief processing active',              'affect',        true),
  (8,  'Relational patterns emerging',         'relational',    true),
  (9,  'Significant trauma material surfaced', 'processing',    true),
  (10, 'Avoidance behavior noted',             'resistance',    true),
  (11, 'Positive behavior rehearsal',          'behavioral',    true),
  (12, 'Dissociative episodes observed',       'clinical_flag', true),
  -- Veteran/PTSD-specific
  (13, 'Hyperarousal / startle response',      'clinical_flag', true),
  (14, 'Moral injury material surfaced',       'existential',   true),
  (15, 'Combat memory integration',            'processing',    true)
ON CONFLICT (observation_id) DO UPDATE
  SET observation_label = EXCLUDED.observation_label,
      category          = EXCLUDED.category,
      is_active         = EXCLUDED.is_active;

-- ── 4. ref_behavioral_change_types ───────────────────────────────────────────
-- Source of truth: BehavioralChangeTrackerForm.tsx CHANGE_TYPES const

DELETE FROM ref_behavioral_change_types WHERE change_type_id <= 12;

INSERT INTO ref_behavioral_change_types (change_type_id, change_label, category, is_active)
VALUES
  (1,  'Set new boundaries',                'relationship',    true),
  (2,  'Started new practice or habit',     'self_care',       true),
  (3,  'Ended unhealthy pattern',           'substance_use',   true),
  (4,  'Reached out to someone',            'relationship',    true),
  (5,  'Made career change',                'work',            true),
  (6,  'Improved communication',            'relationship',    true),
  (7,  'Increased self-compassion',         'self_care',       true),
  (8,  'Released resentment or anger',      'relationship',    true),
  -- Veteran/PTSD-specific additions
  (9,  'Reduced substance use',             'substance_use',   true),
  (10, 'Improved sleep practices',          'self_care',       true),
  (11, 'Re-engaged with community',         'relationship',    true),
  (12, 'Reduced avoidance behaviors',       'behavioral',      true)
ON CONFLICT (change_type_id) DO UPDATE
  SET change_label = EXCLUDED.change_label,
      category     = EXCLUDED.category,
      is_active    = EXCLUDED.is_active;

-- ── 5. ref_clinical_observations (baseline + session) ────────────────────────
-- Source of truth: BaselineObservationsForm.tsx + SessionObservationsForm.tsx
-- These use string IDs in the form but integer IDs in the DB.
-- We standardize to integer IDs here.

INSERT INTO ref_clinical_observations
  (observation_id, observation_label, category, form_context, is_active)
VALUES
  -- Baseline context (BaselineObservationsForm)
  (1,  'Motivated',                  'readiness',    'baseline', true),
  (2,  'Anxious',                    'affect',       'baseline', true),
  (3,  'Calm',                       'affect',       'baseline', true),
  (4,  'Skeptical',                  'readiness',    'baseline', true),
  (5,  'Hopeful',                    'affect',       'baseline', true),
  (6,  'Strong Support System',      'support',      'baseline', true),
  (7,  'Limited Support',            'support',      'baseline', true),
  (8,  'Meditation Experience',      'background',   'baseline', true),
  (9,  'Psychedelic Naive',          'background',   'baseline', true),
  (10, 'Psychedelic Experienced',    'background',   'baseline', true),
  -- Veteran/PTSD baseline additions
  (11, 'Active Military Service',    'background',   'baseline', true),
  (12, 'Veteran',                    'background',   'baseline', true),
  (13, 'Combat Exposure',            'background',   'baseline', true),
  (14, 'MST History',                'background',   'baseline', true),
  (15, 'Currently in VA Care',       'background',   'baseline', true),
  -- Session context (SessionObservationsForm)
  (20, 'Emotionally open',           'affect',       'session',  true),
  (21, 'Resistant',                  'resistance',   'session',  true),
  (22, 'Processing actively',        'processing',   'session',  true),
  (23, 'Somatic activation',         'somatic',      'session',  true),
  (24, 'Transpersonal content',      'existential',  'session',  true),
  (25, 'Insight emerging',           'cognitive',    'session',  true),
  (26, 'Distressed',                 'affect',       'session',  true),
  (27, 'Peaceful',                   'affect',       'session',  true),
  (28, 'Fearful',                    'affect',       'session',  true),
  (29, 'Dissociative',               'clinical_flag','session',  true),
  -- Veteran/PTSD session additions (safety-first)
  (30, 'Hypervigilance active',      'clinical_flag','session',  true),
  (31, 'Flashback content present',  'clinical_flag','session',  true),
  (32, 'Military trauma emerging',   'processing',   'session',  true)
ON CONFLICT (observation_id) DO UPDATE
  SET observation_label = EXCLUDED.observation_label,
      category          = EXCLUDED.category,
      form_context      = EXCLUDED.form_context,
      is_active         = EXCLUDED.is_active;

-- ── 6. Verify counts ─────────────────────────────────────────────────────────
SELECT
  'ref_session_focus_areas'      AS table_name, COUNT(*) AS rows FROM ref_session_focus_areas    UNION ALL
SELECT 'ref_homework_types',                    COUNT(*) FROM ref_homework_types                 UNION ALL
SELECT 'ref_therapist_observations',            COUNT(*) FROM ref_therapist_observations         UNION ALL
SELECT 'ref_behavioral_change_types',           COUNT(*) FROM ref_behavioral_change_types        UNION ALL
SELECT 'ref_clinical_observations',             COUNT(*) FROM ref_clinical_observations
ORDER BY table_name;

COMMIT;
