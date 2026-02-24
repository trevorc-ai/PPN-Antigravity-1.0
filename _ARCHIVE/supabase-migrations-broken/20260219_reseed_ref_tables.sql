-- ============================================================================
-- Migration: 20260219_reseed_ref_tables.sql  (WO-200)
-- Purpose:   Sync ref_ table seed data to match form component constants.
--            Column names verified against live schema via information_schema.
--
-- SAFE TO RE-RUN: Uses INSERT … ON CONFLICT DO UPDATE.
-- Does NOT drop tables. Does NOT alter log_ table data.
--
-- Live schema audit findings (19 Feb 2026):
--   ref_session_focus_areas     → no category col; has focus_code
--   ref_homework_types          → no frequency/category; has homework_code
--   ref_therapist_observations  → PK is observation_type_id; no category
--   ref_behavioral_change_types → label is change_type_label; allowed
--                                  categories: relationship, substance_use,
--                                  exercise, work, hobby, self_care
--   ref_clinical_observations   → text col is observation_text; no form_context
-- ============================================================================

BEGIN;

-- 1. ref_session_focus_areas
INSERT INTO ref_session_focus_areas (focus_area_id, focus_code, focus_label, is_active) VALUES
  (1,  'PROCESS_DOSING',       'Processing Dosing Experience',    true),
  (2,  'RELATIONSHIP',         'Relationship Insights',           true),
  (3,  'CAREER_PURPOSE',       'Career & Purpose Exploration',    true),
  (4,  'GRIEF_LOSS',           'Grief & Loss Processing',         true),
  (5,  'TRAUMA_INTEGRATION',   'Trauma Integration',              true),
  (6,  'BEHAVIORAL_CHANGE',    'Behavioral Change Planning',      true),
  (7,  'RELAPSE_PREVENTION',   'Relapse Prevention',              true),
  (8,  'SPIRITUAL',            'Spiritual & Existential Themes',  true),
  (9,  'MILITARY_TRAUMA',      'Military Trauma Processing',      true),
  (10, 'MORAL_INJURY',         'Moral Injury Work',               true),
  (11, 'HYPERVIGILANCE_NS',    'Hypervigilance & Nervous System', true),
  (12, 'REINTEGRATION',        'Reintegration Planning',          true)
ON CONFLICT (focus_area_id) DO UPDATE
  SET focus_code  = EXCLUDED.focus_code,
      focus_label = EXCLUDED.focus_label,
      is_active   = EXCLUDED.is_active;

-- 2. ref_homework_types
INSERT INTO ref_homework_types (homework_type_id, homework_code, homework_label, is_active) VALUES
  (1,  'DAILY_JOURNALING',     'Daily Journaling',               true),
  (2,  'MEDITATION',           'Meditation Practice',            true),
  (3,  'GRATITUDE_LIST',       'Gratitude List',                 true),
  (4,  'NATURE_WALKS',         'Nature Walks',                   true),
  (5,  'FAMILY_RECONNECT',     'Reconnect with Family Member',   true),
  (6,  'CREATIVE_EXPRESSION',  'Creative Expression Activity',   true),
  (7,  'BREATHWORK',           'Breathwork Practice',            true),
  (8,  'VALUES_CLARIFICATION', 'Values Clarification Exercise',  true),
  (9,  'GROUNDING',            'Grounding Technique Practice',   true),
  (10, 'PEER_SUPPORT',         'Peer Support Check-in',          true),
  (11, 'BODY_SCAN',            'Body Scan Exercise',             true),
  (12, 'SAFE_PLACE_VIZ',       'Safe Place Visualization',       true)
ON CONFLICT (homework_type_id) DO UPDATE
  SET homework_code  = EXCLUDED.homework_code,
      homework_label = EXCLUDED.homework_label,
      is_active      = EXCLUDED.is_active;

-- 3. ref_therapist_observations (PK = observation_type_id)
INSERT INTO ref_therapist_observations (observation_type_id, observation_code, observation_label, is_active) VALUES
  (1,  'THERAPEUTIC_ALLIANCE',    'Strong therapeutic alliance',          true),
  (2,  'EMOTIONAL_OPENNESS',      'Increased emotional openness',         true),
  (3,  'RESISTANCE',              'Resistance to processing',             true),
  (4,  'SOMATIC_ACTIVATION',      'Somatic activation present',           true),
  (5,  'SPIRITUAL_TRANSPERSONAL', 'Spiritual/transpersonal content',      true),
  (6,  'CLEAR_INSIGHT',           'Clear insight articulated',            true),
  (7,  'GRIEF_PROCESSING',        'Grief processing active',              true),
  (8,  'RELATIONAL_PATTERNS',     'Relational patterns emerging',         true),
  (9,  'TRAUMA_MATERIAL',         'Significant trauma material surfaced', true),
  (10, 'AVOIDANCE',               'Avoidance behavior noted',             true),
  (11, 'POSITIVE_BEHAVIORAL',     'Positive behavior rehearsal',          true),
  (12, 'DISSOCIATIVE',            'Dissociative episodes observed',       true),
  (13, 'HYPERAROUSAL',            'Hyperarousal / startle response',      true),
  (14, 'MORAL_INJURY',            'Moral injury material surfaced',       true),
  (15, 'COMBAT_MEMORY',           'Combat memory integration',            true)
ON CONFLICT (observation_type_id) DO UPDATE
  SET observation_code  = EXCLUDED.observation_code,
      observation_label = EXCLUDED.observation_label,
      is_active         = EXCLUDED.is_active;

-- 4. ref_behavioral_change_types
-- allowed categories: relationship | substance_use | exercise | work | hobby | self_care
INSERT INTO ref_behavioral_change_types (change_type_id, change_type_code, change_type_label, category, is_active) VALUES
  (1,  'NEW_BOUNDARIES',       'Set new boundaries',                'relationship',  true),
  (2,  'NEW_PRACTICE',         'Started new practice or habit',     'self_care',     true),
  (3,  'ENDED_PATTERN',        'Ended unhealthy pattern',           'substance_use', true),
  (4,  'REACHED_OUT',          'Reached out to someone',            'relationship',  true),
  (5,  'CAREER_CHANGE',        'Made career change',                'work',          true),
  (6,  'COMMUNICATION',        'Improved communication',            'relationship',  true),
  (7,  'SELF_COMPASSION',      'Increased self-compassion',         'self_care',     true),
  (8,  'RELEASED_RESENTMENT',  'Released resentment or anger',      'relationship',  true),
  (9,  'REDUCED_SUBSTANCE',    'Reduced substance use',             'substance_use', true),
  (10, 'SLEEP_PRACTICES',      'Improved sleep practices',          'self_care',     true),
  (11, 'COMMUNITY_REENGAGED',  'Re-engaged with community',         'relationship',  true),
  (12, 'REDUCED_AVOIDANCE',    'Reduced avoidance behaviors',       'self_care',     true)
ON CONFLICT (change_type_id) DO UPDATE
  SET change_type_code  = EXCLUDED.change_type_code,
      change_type_label = EXCLUDED.change_type_label,
      category          = EXCLUDED.category,
      is_active         = EXCLUDED.is_active;

-- 5. ref_clinical_observations (text col = observation_text; no form_context)
INSERT INTO ref_clinical_observations (observation_id, observation_code, observation_text, category, is_active) VALUES
  -- Baseline
  (1,  'MOTIVATED',           'Motivated',                  'readiness',    true),
  (2,  'ANXIOUS',             'Anxious',                    'affect',       true),
  (3,  'CALM',                'Calm',                       'affect',       true),
  (4,  'SKEPTICAL',           'Skeptical',                  'readiness',    true),
  (5,  'HOPEFUL',             'Hopeful',                    'affect',       true),
  (6,  'STRONG_SUPPORT',      'Strong Support System',      'support',      true),
  (7,  'LIMITED_SUPPORT',     'Limited Support',            'support',      true),
  (8,  'MEDITATION_EXP',      'Meditation Experience',      'background',   true),
  (9,  'PSYCHEDELIC_NAIVE',   'Psychedelic Naive',          'background',   true),
  (10, 'PSYCHEDELIC_EXP',     'Psychedelic Experienced',    'background',   true),
  (11, 'ACTIVE_MILITARY',     'Active Military Service',    'background',   true),
  (12, 'VETERAN',             'Veteran',                    'background',   true),
  (13, 'COMBAT_EXPOSURE',     'Combat Exposure',            'background',   true),
  (14, 'MST_HISTORY',         'MST History',                'background',   true),
  (15, 'VA_CARE',             'Currently in VA Care',       'background',   true),
  -- Session
  (20, 'EMOTIONALLY_OPEN',    'Emotionally open',           'affect',       true),
  (21, 'RESISTANT',           'Resistant',                  'resistance',   true),
  (22, 'PROCESSING_ACTIVELY', 'Processing actively',        'processing',   true),
  (23, 'SOMATIC_ACTIVATION',  'Somatic activation',         'somatic',      true),
  (24, 'TRANSPERSONAL',       'Transpersonal content',      'existential',  true),
  (25, 'INSIGHT_EMERGING',    'Insight emerging',           'cognitive',    true),
  (26, 'DISTRESSED',          'Distressed',                 'affect',       true),
  (27, 'PEACEFUL',            'Peaceful',                   'affect',       true),
  (28, 'FEARFUL',             'Fearful',                    'affect',       true),
  (29, 'DISSOCIATIVE',        'Dissociative',               'clinical_flag',true),
  (30, 'HYPERVIGILANCE',      'Hypervigilance active',      'clinical_flag',true),
  (31, 'FLASHBACK',           'Flashback content present',  'clinical_flag',true),
  (32, 'MILITARY_TRAUMA',     'Military trauma emerging',   'processing',   true)
ON CONFLICT (observation_id) DO UPDATE
  SET observation_code = EXCLUDED.observation_code,
      observation_text = EXCLUDED.observation_text,
      category         = EXCLUDED.category,
      is_active        = EXCLUDED.is_active;

COMMIT;
