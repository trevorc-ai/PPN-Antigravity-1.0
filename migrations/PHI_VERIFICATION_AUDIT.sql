-- ============================================================================
-- PHI/PII VERIFICATION AUDIT
-- ============================================================================
-- Purpose: Verify NO PHI/PII data exists in database
-- Author: SOOP
-- Date: 2026-02-15
-- Work Order: WO_042
-- ============================================================================

-- SECTION 1: Check for PHI Column Names (CRITICAL)
-- ============================================================================
SELECT 
    '❌ CRITICAL: PHI Column Detected' as status,
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND column_name IN (
    'patient_name', 'first_name', 'last_name', 'full_name',
    'dob', 'date_of_birth', 'birth_date',
    'ssn', 'social_security',
    'mrn', 'medical_record_number',
    'email', 'patient_email',
    'phone', 'phone_number', 'mobile',
    'address', 'street_address', 'home_address',
    'zip', 'zipcode', 'postal_code',
    'city', 'state', 'country'
  )
ORDER BY table_name, column_name;

-- SECTION 2: Verify Subject ID is UUID (Not Patient Names)
-- ============================================================================
SELECT 
    CASE 
        WHEN data_type = 'uuid' THEN '✅ Correct: UUID'
        ELSE '❌ WRONG: Not UUID'
    END as status,
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND column_name IN ('subject_id', 'patient_id', 'client_id')
ORDER BY table_name;

-- SECTION 3: Check for Free-Text Fields in Patient/Session Tables
-- ============================================================================
SELECT 
    '⚠️  WARNING: Free-text field in sensitive table' as status,
    table_name,
    column_name,
    data_type,
    character_maximum_length
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN (
    'log_clinical_records',
    'log_outcomes',
    'log_consent',
    'log_interventions',
    'log_safety_events',
    'log_sessions',
    'log_doses',
    'log_patient_flow_events'
  )
  AND data_type IN ('text', 'varchar', 'character varying')
  AND column_name NOT IN (
    -- Allowed text fields (controlled values, IDs, hashes)
    'id', 'session_id', 'protocol_id', 'site_id', 'user_id',
    'subject_id', 'client_blind_hash', 'target_client_hash',
    'submission_status', 'event_code', 'stage_name',
    'created_at', 'updated_at'
  )
ORDER BY table_name, column_name;

-- SECTION 4: Verify All Reference Tables Use Controlled Values
-- ============================================================================
SELECT 
    '✅ Reference Table' as status,
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns c WHERE c.table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_name LIKE 'ref_%'
ORDER BY table_name;

-- SECTION 5: Check Foreign Key Constraints (Ensure Controlled Values)
-- ============================================================================
SELECT 
    '✅ Foreign Key Constraint' as status,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS references_table,
    ccu.column_name AS references_column
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
  AND tc.table_name LIKE 'log_%'
ORDER BY tc.table_name, kcu.column_name;

-- SECTION 6: Verify user_profiles Table (Only Practitioner Data)
-- ============================================================================
SELECT 
    '⚠️  REVIEW: user_profiles columns' as status,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'user_profiles'
ORDER BY ordinal_position;

-- SECTION 7: Summary Report
-- ============================================================================
DO $$
DECLARE
    v_phi_columns INTEGER;
    v_free_text_fields INTEGER;
    v_ref_tables INTEGER;
    v_log_tables INTEGER;
BEGIN
    -- Count PHI columns
    SELECT COUNT(*) INTO v_phi_columns
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND column_name IN (
        'patient_name', 'first_name', 'last_name', 'full_name',
        'dob', 'date_of_birth', 'birth_date',
        'ssn', 'social_security',
        'mrn', 'medical_record_number',
        'email', 'patient_email',
        'phone', 'phone_number', 'mobile',
        'address', 'street_address', 'home_address',
        'zip', 'zipcode', 'postal_code'
      );
    
    -- Count free-text fields in log tables
    SELECT COUNT(*) INTO v_free_text_fields
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name LIKE 'log_%'
      AND data_type IN ('text', 'varchar', 'character varying')
      AND column_name NOT IN (
        'id', 'session_id', 'protocol_id', 'site_id', 'user_id',
        'subject_id', 'client_blind_hash', 'target_client_hash',
        'submission_status', 'event_code', 'stage_name'
      );
    
    -- Count reference tables
    SELECT COUNT(*) INTO v_ref_tables
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name LIKE 'ref_%';
    
    -- Count log tables
    SELECT COUNT(*) INTO v_log_tables
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name LIKE 'log_%';
    
    RAISE NOTICE '=== PHI/PII VERIFICATION SUMMARY ===';
    RAISE NOTICE 'PHI columns detected: %', v_phi_columns;
    RAISE NOTICE 'Free-text fields in log tables: %', v_free_text_fields;
    RAISE NOTICE 'Reference tables (controlled values): %', v_ref_tables;
    RAISE NOTICE 'Log tables (patient data): %', v_log_tables;
    RAISE NOTICE '';
    
    IF v_phi_columns > 0 THEN
        RAISE WARNING '❌ CRITICAL: % PHI columns detected - MUST BE REMOVED', v_phi_columns;
    ELSE
        RAISE NOTICE '✅ No PHI columns detected';
    END IF;
    
    IF v_free_text_fields > 0 THEN
        RAISE WARNING '⚠️  WARNING: % free-text fields in log tables - REVIEW REQUIRED', v_free_text_fields;
    ELSE
        RAISE NOTICE '✅ No free-text fields in log tables';
    END IF;
    
    IF v_phi_columns = 0 AND v_free_text_fields = 0 THEN
        RAISE NOTICE '';
        RAISE NOTICE '✅✅✅ DATABASE IS PHI-COMPLIANT ✅✅✅';
    END IF;
END $$;
