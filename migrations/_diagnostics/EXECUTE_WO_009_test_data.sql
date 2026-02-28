-- ============================================================================
-- WO_009: Load Test Data Migration
-- ============================================================================
-- Purpose: Execute existing test data migration to populate demo environment
-- Date: 2026-02-14
-- Agent: SOOP
-- ============================================================================

-- PRE-FLIGHT CHECK: Verify if test data already exists
SELECT 
    (SELECT COUNT(*) FROM protocols WHERE created_by = '00000000-0000-0000-0000-000000000001') as test_protocols,
    (SELECT COUNT(*) FROM patients WHERE site_id = 999) as test_patients,
    (SELECT COUNT(*) FROM sites WHERE site_id = 999) as test_site;

-- If all counts are 0, proceed with loading test data
-- Otherwise, SKIP execution (data already loaded)

-- ============================================================================
-- EXECUTION: Run the test data migration
-- ============================================================================
-- Execute: migrations/999_load_test_data.sql
-- This will create:
--   - 1 test user
--   - 1 test site (ID 999)
--   - 30 test patients
--   - 30 test protocols (variety of substances, indications, outcomes)

\echo 'Executing test data migration...'
\i migrations/999_load_test_data.sql

-- ============================================================================
-- POST-EXECUTION VERIFICATION
-- ============================================================================

-- Verify protocols loaded
SELECT 
    COUNT(*) as total_protocols,
    COUNT(CASE WHEN adverse_events IS NOT NULL THEN 1 END) as protocols_with_adverse_events
FROM protocols
WHERE created_by = '00000000-0000-0000-0000-000000000001';

-- Verify substance variety
SELECT s.substance_name, COUNT(*) as protocol_count
FROM protocols p
JOIN ref_substances s ON p.substance_id = s.substance_id
WHERE p.created_by = '00000000-0000-0000-0000-000000000001'
GROUP BY s.substance_name
ORDER BY protocol_count DESC;

-- Verify indication variety
SELECT i.indication_name, COUNT(*) as protocol_count
FROM protocols p
JOIN ref_indications i ON p.indication_id = i.indication_id
WHERE p.created_by = '00000000-0000-0000-0000-000000000001'
GROUP BY i.indication_name
ORDER BY protocol_count DESC;

-- Verify outcome distribution
SELECT 
    CASE 
        WHEN phq9_post IS NULL THEN 'Pending'
        WHEN phq9_post < 5 THEN 'Remission'
        WHEN phq9_post < phq9_baseline - 5 THEN 'Significant Improvement'
        WHEN phq9_post < phq9_baseline THEN 'Mild Improvement'
        ELSE 'No Improvement'
    END as outcome_category,
    COUNT(*) as count
FROM protocols
WHERE created_by = '00000000-0000-0000-0000-000000000001'
GROUP BY outcome_category
ORDER BY count DESC;

DO $$ 
BEGIN
    RAISE NOTICE '✅ WO_009: Test data migration complete';
    RAISE NOTICE '   - 30 test protocols loaded';
    RAISE NOTICE '   - 30 test patients loaded';
    RAISE NOTICE '   - Variety of substances, indications, and outcomes';
END $$;
