-- =============================================================================
-- LOG TABLE AUDIT — v3 (Rebuilt Schema, 2026-03-09)
-- Source of truth: REBUILT_Schema_STAGING_3-8-26.md
-- Run each section independently in Supabase SQL Editor.
-- =============================================================================


-- ─────────────────────────────────────────────────────────────────────────────
-- SECTION 1: ROW COUNTS — all clinical log tables (schema-verified)
-- ─────────────────────────────────────────────────────────────────────────────

SELECT 'log_clinical_records'            AS table_name, COUNT(*) AS rows FROM public.log_clinical_records
UNION ALL SELECT 'log_patient_profiles',             COUNT(*) FROM public.log_patient_profiles
UNION ALL SELECT 'log_patient_indications',          COUNT(*) FROM public.log_patient_indications
UNION ALL SELECT 'log_patient_psychospiritual_history', COUNT(*) FROM public.log_patient_psychospiritual_history
UNION ALL SELECT 'log_phase1_consent',               COUNT(*) FROM public.log_phase1_consent
UNION ALL SELECT 'log_phase1_safety_screen',         COUNT(*) FROM public.log_phase1_safety_screen
UNION ALL SELECT 'log_phase1_set_and_setting',       COUNT(*) FROM public.log_phase1_set_and_setting
UNION ALL SELECT 'log_phase3_meq30',                 COUNT(*) FROM public.log_phase3_meq30
UNION ALL SELECT 'log_baseline_assessments',         COUNT(*) FROM public.log_baseline_assessments
UNION ALL SELECT 'log_dose_events',                  COUNT(*) FROM public.log_dose_events
UNION ALL SELECT 'log_integration_sessions',         COUNT(*) FROM public.log_integration_sessions
UNION ALL SELECT 'log_longitudinal_assessments',     COUNT(*) FROM public.log_longitudinal_assessments
UNION ALL SELECT 'log_patient_flow_events',          COUNT(*) FROM public.log_patient_flow_events
UNION ALL SELECT 'log_patient_site_links',           COUNT(*) FROM public.log_patient_site_links
UNION ALL SELECT 'log_pulse_checks',                 COUNT(*) FROM public.log_pulse_checks
UNION ALL SELECT 'log_red_alerts',                   COUNT(*) FROM public.log_red_alerts
UNION ALL SELECT 'log_safety_events',                COUNT(*) FROM public.log_safety_events
UNION ALL SELECT 'log_session_timeline_events',      COUNT(*) FROM public.log_session_timeline_events
UNION ALL SELECT 'log_session_vitals',               COUNT(*) FROM public.log_session_vitals
UNION ALL SELECT 'log_behavioral_changes',           COUNT(*) FROM public.log_behavioral_changes
ORDER BY rows DESC;


-- ─────────────────────────────────────────────────────────────────────────────
-- SECTION 2: log_clinical_records — NULL RATE
-- NOTE: patient demographics (sex, age, weight, smoking) moved to log_patient_profiles.
--       indication moved to log_patient_indications.
--       New cols in rebuilt schema: patient_uuid, session_setting_id, mindset_type_id.
-- ─────────────────────────────────────────────────────────────────────────────

WITH base AS (SELECT COUNT(*) AS total FROM public.log_clinical_records)
SELECT col, base.total, null_count,
    ROUND(null_count::numeric / NULLIF(base.total, 0) * 100, 1) AS null_pct,
    CASE
        WHEN ROUND(null_count::numeric / NULLIF(base.total, 0) * 100, 1) = 100 THEN '🔴 NOT WIRED'
        WHEN ROUND(null_count::numeric / NULLIF(base.total, 0) * 100, 1) >= 50  THEN '🟡 PARTIAL'
        ELSE '🟢 OK'
    END AS status
FROM base, (
    SELECT 'substance_id'            AS col, COUNT(*) FILTER (WHERE substance_id IS NULL)            AS null_count FROM public.log_clinical_records
    UNION ALL SELECT 'session_type_id',           COUNT(*) FILTER (WHERE session_type_id IS NULL)           FROM public.log_clinical_records
    UNION ALL SELECT 'patient_uuid',              COUNT(*) FILTER (WHERE patient_uuid IS NULL)              FROM public.log_clinical_records
    UNION ALL SELECT 'patient_link_code_hash',    COUNT(*) FILTER (WHERE patient_link_code_hash IS NULL)    FROM public.log_clinical_records
    UNION ALL SELECT 'site_id',                   COUNT(*) FILTER (WHERE site_id IS NULL)                   FROM public.log_clinical_records
    UNION ALL SELECT 'session_number',            COUNT(*) FILTER (WHERE session_number IS NULL)            FROM public.log_clinical_records
    UNION ALL SELECT 'dosage_mg',                 COUNT(*) FILTER (WHERE dosage_mg IS NULL)                 FROM public.log_clinical_records
    UNION ALL SELECT 'dose_administered_at',      COUNT(*) FILTER (WHERE dose_administered_at IS NULL)      FROM public.log_clinical_records
    UNION ALL SELECT 'session_ended_at',          COUNT(*) FILTER (WHERE session_ended_at IS NULL)          FROM public.log_clinical_records
    UNION ALL SELECT 'session_setting_id',        COUNT(*) FILTER (WHERE session_setting_id IS NULL)        FROM public.log_clinical_records
    UNION ALL SELECT 'mindset_type_id',           COUNT(*) FILTER (WHERE mindset_type_id IS NULL)           FROM public.log_clinical_records
    UNION ALL SELECT 'route_id',                  COUNT(*) FILTER (WHERE route_id IS NULL)                  FROM public.log_clinical_records
    UNION ALL SELECT 'baseline_phq9_score',       COUNT(*) FILTER (WHERE baseline_phq9_score IS NULL)       FROM public.log_clinical_records
    UNION ALL SELECT 'meq30_score',               COUNT(*) FILTER (WHERE meq30_score IS NULL)               FROM public.log_clinical_records
    UNION ALL SELECT 'is_submitted',              COUNT(*) FILTER (WHERE is_submitted IS NULL)              FROM public.log_clinical_records
) t
ORDER BY null_pct DESC, col;


-- ─────────────────────────────────────────────────────────────────────────────
-- SECTION 3: log_patient_profiles — NULL RATE
-- This is where New Patient Setup form data should land (sex, age, weight, smoking).
-- ─────────────────────────────────────────────────────────────────────────────

WITH base AS (SELECT COUNT(*) AS total FROM public.log_patient_profiles)
SELECT col, base.total, null_count,
    ROUND(null_count::numeric / NULLIF(base.total, 0) * 100, 1) AS null_pct,
    CASE
        WHEN ROUND(null_count::numeric / NULLIF(base.total, 0) * 100, 1) = 100 THEN '🔴 NOT WIRED'
        WHEN ROUND(null_count::numeric / NULLIF(base.total, 0) * 100, 1) >= 50  THEN '🟡 PARTIAL'
        ELSE '🟢 OK'
    END AS status
FROM base, (
    SELECT 'sex_id'                AS col, COUNT(*) FILTER (WHERE sex_id IS NULL)                AS null_count FROM public.log_patient_profiles
    UNION ALL SELECT 'age_at_intake',            COUNT(*) FILTER (WHERE age_at_intake IS NULL)            FROM public.log_patient_profiles
    UNION ALL SELECT 'weight_range_id',          COUNT(*) FILTER (WHERE weight_range_id IS NULL)          FROM public.log_patient_profiles
    UNION ALL SELECT 'smoking_status_id',        COUNT(*) FILTER (WHERE smoking_status_id IS NULL)        FROM public.log_patient_profiles
    UNION ALL SELECT 'protocol_archetype_id',    COUNT(*) FILTER (WHERE protocol_archetype_id IS NULL)    FROM public.log_patient_profiles
    UNION ALL SELECT 'site_id',                  COUNT(*) FILTER (WHERE site_id IS NULL)                  FROM public.log_patient_profiles
) t
ORDER BY null_pct DESC, col;


-- ─────────────────────────────────────────────────────────────────────────────
-- SECTION 4: Phase 1 sub-tables — are they getting rows at all?
-- Each session in Phase 1 should have exactly one row in each of these.
-- ─────────────────────────────────────────────────────────────────────────────

-- 4a: Sessions vs Phase 1 sub-table coverage
SELECT
    'log_clinical_records'          AS table_name,
    COUNT(*)                        AS session_count
FROM public.log_clinical_records
WHERE patient_link_code_hash NOT LIKE 'TEST-%'

UNION ALL SELECT 'log_phase1_consent (linked)', COUNT(DISTINCT session_id)
FROM public.log_phase1_consent

UNION ALL SELECT 'log_phase1_safety_screen (linked)', COUNT(DISTINCT session_id)
FROM public.log_phase1_safety_screen

UNION ALL SELECT 'log_phase1_set_and_setting (linked)', COUNT(DISTINCT session_id)
FROM public.log_phase1_set_and_setting

UNION ALL SELECT 'log_patient_profiles (all)', COUNT(*)
FROM public.log_patient_profiles

UNION ALL SELECT 'log_patient_indications (rows)', COUNT(*)
FROM public.log_patient_indications;

-- 4b: Phase 1 consent — null rate
WITH base AS (SELECT COUNT(*) AS total FROM public.log_phase1_consent)
SELECT col, base.total, null_count,
    ROUND(null_count::numeric / NULLIF(base.total, 0) * 100, 1) AS null_pct
FROM base, (
    SELECT 'session_id'      AS col, COUNT(*) FILTER (WHERE session_id IS NULL)      AS null_count FROM public.log_phase1_consent
    UNION ALL SELECT 'consent_type_ids',  COUNT(*) FILTER (WHERE consent_type_ids = '{}' OR consent_type_ids IS NULL) FROM public.log_phase1_consent
) t;

-- 4c: Phase 1 set and setting — null rate
WITH base AS (SELECT COUNT(*) AS total FROM public.log_phase1_set_and_setting)
SELECT col, base.total, null_count,
    ROUND(null_count::numeric / NULLIF(base.total, 0) * 100, 1) AS null_pct
FROM base, (
    SELECT 'session_id'          AS col, COUNT(*) FILTER (WHERE session_id IS NULL)          AS null_count FROM public.log_phase1_set_and_setting
    UNION ALL SELECT 'mindset_type_id',      COUNT(*) FILTER (WHERE mindset_type_id IS NULL)      FROM public.log_phase1_set_and_setting
    UNION ALL SELECT 'session_setting_id',   COUNT(*) FILTER (WHERE session_setting_id IS NULL)   FROM public.log_phase1_set_and_setting
    UNION ALL SELECT 'intention_theme_ids',  COUNT(*) FILTER (WHERE intention_theme_ids = '{}')   FROM public.log_phase1_set_and_setting
) t;


-- ─────────────────────────────────────────────────────────────────────────────
-- SECTION 5: FK INTEGRITY — correct ref table names from rebuilt schema
-- ─────────────────────────────────────────────────────────────────────────────

-- 5a. substance_id in log_clinical_records → ref_substances
SELECT 'lcr.substance_id → ref_substances'          AS check_name,
    COUNT(*)                                         AS total,
    COUNT(lcr.substance_id)                          AS has_fk,
    COUNT(rs.substance_id)                           AS valid_match,
    COUNT(lcr.substance_id) - COUNT(rs.substance_id) AS orphaned
FROM public.log_clinical_records lcr
LEFT JOIN public.ref_substances rs ON rs.substance_id = lcr.substance_id

UNION ALL

-- 5b. session_type_id → ref_session_types
SELECT 'lcr.session_type_id → ref_session_types',
    COUNT(*), COUNT(lcr.session_type_id), COUNT(rst.id), COUNT(lcr.session_type_id) - COUNT(rst.id)
FROM public.log_clinical_records lcr
LEFT JOIN public.ref_session_types rst ON rst.id = lcr.session_type_id

UNION ALL

-- 5c. route_id → ref_routes
SELECT 'lcr.route_id → ref_routes',
    COUNT(*), COUNT(lcr.route_id), COUNT(rr.route_id), COUNT(lcr.route_id) - COUNT(rr.route_id)
FROM public.log_clinical_records lcr
LEFT JOIN public.ref_routes rr ON rr.route_id = lcr.route_id

UNION ALL

-- 5d. sex_id in log_patient_profiles → ref_sex  (NOT ref_sex_categories)
SELECT 'lpp.sex_id → ref_sex',
    COUNT(*), COUNT(lpp.sex_id), COUNT(rs.sex_id), COUNT(lpp.sex_id) - COUNT(rs.sex_id)
FROM public.log_patient_profiles lpp
LEFT JOIN public.ref_sex rs ON rs.sex_id = lpp.sex_id

UNION ALL

-- 5e. smoking_status_id → ref_smoking_status  (NOT ref_smoking_statuses)
SELECT 'lpp.smoking_status_id → ref_smoking_status',
    COUNT(*), COUNT(lpp.smoking_status_id), COUNT(rss.smoking_status_id), COUNT(lpp.smoking_status_id) - COUNT(rss.smoking_status_id)
FROM public.log_patient_profiles lpp
LEFT JOIN public.ref_smoking_status rss ON rss.smoking_status_id = lpp.smoking_status_id

UNION ALL

-- 5f. weight_range_id → ref_weight_ranges
SELECT 'lpp.weight_range_id → ref_weight_ranges',
    COUNT(*), COUNT(lpp.weight_range_id), COUNT(rwr.id), COUNT(lpp.weight_range_id) - COUNT(rwr.id)
FROM public.log_patient_profiles lpp
LEFT JOIN public.ref_weight_ranges rwr ON rwr.id = lpp.weight_range_id

UNION ALL

-- 5g. indication_id in log_patient_indications → ref_indications
SELECT 'lpi.indication_id → ref_indications',
    COUNT(*), COUNT(lpi.indication_id), COUNT(ri.indication_id), COUNT(lpi.indication_id) - COUNT(ri.indication_id)
FROM public.log_patient_indications lpi
LEFT JOIN public.ref_indications ri ON ri.indication_id = lpi.indication_id

UNION ALL

-- 5h. substance_id in log_dose_events → ref_substances
SELECT 'lde.substance_id → ref_substances',
    COUNT(*), COUNT(lde.substance_id), COUNT(rs.substance_id), COUNT(lde.substance_id) - COUNT(rs.substance_id)
FROM public.log_dose_events lde
LEFT JOIN public.ref_substances rs ON rs.substance_id = lde.substance_id;


-- ─────────────────────────────────────────────────────────────────────────────
-- SECTION 6: LAST 10 REAL SESSIONS — row-level spot check
-- ─────────────────────────────────────────────────────────────────────────────

SELECT
    LEFT(lcr.id::text, 8)                   AS session_id,
    lcr.created_at::date                    AS date,
    LEFT(lcr.patient_link_code_hash, 12)    AS patient,
    lcr.session_type_id,
    lcr.substance_id,
    lcr.patient_uuid IS NOT NULL            AS has_patient_uuid,
    lpp.sex_id,
    lpp.age_at_intake,
    lpp.weight_range_id,
    lpp.smoking_status_id,
    (SELECT COUNT(*) FROM public.log_patient_indications lpi
        WHERE lpi.patient_uuid = lcr.patient_uuid) AS indication_count,
    lcr.dose_administered_at IS NOT NULL    AS dosing_started,
    lcr.is_submitted
FROM public.log_clinical_records lcr
LEFT JOIN public.log_patient_profiles lpp ON lpp.patient_uuid = lcr.patient_uuid
WHERE lcr.patient_link_code_hash NOT LIKE 'TEST-%'
ORDER BY lcr.created_at DESC
LIMIT 10;


-- =============================================================================
-- READING GUIDE
-- Section 1: Zero rows = feature never triggered in QA yet.
-- Section 2: 🔴 NOT WIRED = column never written from UI service layer.
-- Section 3: If sex_id/age/weight/smoking are 🔴, ProtocolConfiguratorModal
--            is not calling the log_patient_profiles insert.
-- Section 4: If phase1 sub-tables have 0 rows but lcr has rows,
--            consent/safety/set&setting save paths are broken.
-- Section 5: orphaned > 0 = FK stored but ref row missing (data integrity gap).
--            has_fk = 0 = service layer never writes the FK at all.
-- Section 6: Row-level joins to see exactly what's populated per session.
-- =============================================================================
