-- =====================================================
-- Arc of Care PHI Compliance - Deployment Verification
-- Run these queries in Supabase Studio to verify deployment
-- =====================================================

-- STEP 1: Verify new tables were created
SELECT table_name, 
       (SELECT COUNT(*) FROM information_schema.columns 
        WHERE columns.table_name = tables.table_name) as column_count
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'ref_clinical_observations',
    'ref_cancellation_reasons',
    'log_baseline_observations',
    'log_session_observations',
    'log_safety_event_observations',
    'log_feature_requests'
  )
ORDER BY table_name;

-- Expected: 6 tables

-- =====================================================

-- STEP 2: Verify seed data was loaded
SELECT 'ref_clinical_observations' as table_name, COUNT(*) as row_count 
FROM ref_clinical_observations
UNION ALL
SELECT 'ref_cancellation_reasons', COUNT(*) 
FROM ref_cancellation_reasons;

-- Expected:
-- ref_clinical_observations: 37 rows
-- ref_cancellation_reasons: 10 rows

-- =====================================================

-- STEP 3: Verify free-text columns were removed
SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN (
    'log_baseline_assessments',
    'log_clinical_records',
    'log_integration_sessions',
    'log_red_alerts'
  )
  AND column_name IN (
    'psycho_spiritual_history',
    'session_notes',
    'notes',
    'cancellation_reason',
    'alert_message',
    'response_notes'
  );

-- Expected: 0 rows (all free-text columns removed)

-- =====================================================

-- STEP 4: View sample observations by category
SELECT category, COUNT(*) as observation_count
FROM ref_clinical_observations
WHERE is_active = true
GROUP BY category
ORDER BY category;

-- Expected:
-- baseline: ~10 observations
-- integration: ~8 observations
-- safety: ~9 observations
-- session: ~10 observations

-- =====================================================

-- STEP 5: View all baseline observations (for demo)
SELECT observation_id, observation_code, observation_text
FROM ref_clinical_observations
WHERE category = 'baseline' AND is_active = true
ORDER BY observation_text;

-- =====================================================
