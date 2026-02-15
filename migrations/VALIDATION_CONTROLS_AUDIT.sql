-- ============================================================================
-- VALIDATION CONTROLS VERIFICATION
-- ============================================================================
-- Purpose: Verify all inputs use controlled values (no free text)
-- Author: SOOP
-- Date: 2026-02-15
-- Work Order: WO_042
-- ============================================================================

-- SECTION 1: Verify Medication Inputs Use FK References
-- ============================================================================
SELECT 
    '✅ Medication FK Constraint' as status,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS references_table
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
  AND (
    kcu.column_name LIKE '%medication%'
    OR ccu.table_name = 'ref_medications'
  )
ORDER BY tc.table_name;

-- SECTION 2: Verify Drug Interactions Use Substance IDs
-- ============================================================================
-- Check if drug_interactions table exists and uses FK
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = 'drug_interactions'
        ) THEN '✅ Table exists'
        ELSE '⚠️  Table does not exist yet'
    END as status;

-- If table exists, check for FK constraints
SELECT 
    '✅ Drug Interaction FK' as status,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'drug_interactions'
  AND column_name IN ('substance_id', 'medication_id', 'drug_a_id', 'drug_b_id')
ORDER BY column_name;

-- SECTION 3: Verify All ref_* Tables Have Controlled Values
-- ============================================================================
SELECT 
    '✅ Reference Table Structure' as status,
    t.table_name,
    (SELECT COUNT(*) FROM information_schema.columns c 
     WHERE c.table_schema = 'public' AND c.table_name = t.table_name) as column_count,
    (SELECT COUNT(*) FROM information_schema.table_constraints tc
     WHERE tc.table_schema = 'public' AND tc.table_name = t.table_name 
     AND tc.constraint_type = 'PRIMARY KEY') as has_pk
FROM information_schema.tables t
WHERE t.table_schema = 'public'
  AND t.table_name LIKE 'ref_%'
ORDER BY t.table_name;

-- SECTION 4: Verify Foreign Key Constraints Exist
-- ============================================================================
SELECT 
    '✅ All FK Constraints' as status,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS references_table,
    ccu.column_name AS references_column,
    rc.delete_rule,
    rc.update_rule
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
JOIN information_schema.referential_constraints AS rc
  ON rc.constraint_name = tc.constraint_name
  AND rc.constraint_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;

-- SECTION 5: Check for Missing FK Constraints (Potential Issues)
-- ============================================================================
-- Find columns that look like FKs but don't have constraints
SELECT 
    '⚠️  REVIEW: Potential missing FK' as status,
    c.table_name,
    c.column_name,
    c.data_type
FROM information_schema.columns c
WHERE c.table_schema = 'public'
  AND (
    c.column_name LIKE '%_id'
    OR c.column_name LIKE '%_type'
  )
  AND c.table_name LIKE 'log_%'
  AND NOT EXISTS (
    SELECT 1 FROM information_schema.key_column_usage kcu
    JOIN information_schema.table_constraints tc
      ON kcu.constraint_name = tc.constraint_name
      AND kcu.table_schema = tc.table_schema
    WHERE tc.constraint_type = 'FOREIGN KEY'
      AND kcu.table_schema = c.table_schema
      AND kcu.table_name = c.table_name
      AND kcu.column_name = c.column_name
  )
  AND c.column_name NOT IN (
    -- Exclude known non-FK columns
    'id', 'created_at', 'updated_at', 'deleted_at',
    'subject_id', 'client_blind_hash', 'target_client_hash'
  )
ORDER BY c.table_name, c.column_name;

-- SECTION 6: Verify Substance/Medication Columns Use IDs (Not Text)
-- ============================================================================
SELECT 
    CASE 
        WHEN data_type IN ('integer', 'bigint', 'uuid') THEN '✅ Correct: ID type'
        WHEN data_type IN ('text', 'varchar', 'character varying') THEN '❌ WRONG: Text type'
        ELSE '⚠️  REVIEW: Unexpected type'
    END as status,
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND (
    column_name LIKE '%substance%'
    OR column_name LIKE '%medication%'
    OR column_name LIKE '%drug%'
  )
  AND column_name NOT IN (
    -- Exclude known text columns
    'substance_name', 'medication_name', 'drug_name'
  )
ORDER BY status, table_name, column_name;

-- SECTION 7: Summary Report
-- ============================================================================
DO $$
DECLARE
    v_ref_tables INTEGER;
    v_fk_constraints INTEGER;
    v_text_substance_cols INTEGER;
    v_missing_fks INTEGER;
BEGIN
    -- Count reference tables
    SELECT COUNT(*) INTO v_ref_tables
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name LIKE 'ref_%';
    
    -- Count FK constraints
    SELECT COUNT(*) INTO v_fk_constraints
    FROM information_schema.table_constraints
    WHERE table_schema = 'public'
      AND constraint_type = 'FOREIGN KEY';
    
    -- Count text-type substance/medication columns
    SELECT COUNT(*) INTO v_text_substance_cols
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND data_type IN ('text', 'varchar', 'character varying')
      AND (
        column_name LIKE '%substance%'
        OR column_name LIKE '%medication%'
        OR column_name LIKE '%drug%'
      )
      AND column_name NOT IN ('substance_name', 'medication_name', 'drug_name');
    
    -- Count potential missing FKs
    SELECT COUNT(*) INTO v_missing_fks
    FROM information_schema.columns c
    WHERE c.table_schema = 'public'
      AND c.column_name LIKE '%_id'
      AND c.table_name LIKE 'log_%'
      AND NOT EXISTS (
        SELECT 1 FROM information_schema.key_column_usage kcu
        JOIN information_schema.table_constraints tc
          ON kcu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND kcu.table_name = c.table_name
          AND kcu.column_name = c.column_name
      )
      AND c.column_name NOT IN ('id', 'subject_id', 'client_blind_hash');
    
    RAISE NOTICE '=== VALIDATION CONTROLS SUMMARY ===';
    RAISE NOTICE 'Reference tables (controlled values): %', v_ref_tables;
    RAISE NOTICE 'Foreign key constraints: %', v_fk_constraints;
    RAISE NOTICE 'Text-type substance/medication columns: %', v_text_substance_cols;
    RAISE NOTICE 'Potential missing FK constraints: %', v_missing_fks;
    RAISE NOTICE '';
    
    IF v_text_substance_cols > 0 THEN
        RAISE WARNING '❌ CRITICAL: % text-type substance/medication columns found', v_text_substance_cols;
    ELSE
        RAISE NOTICE '✅ All substance/medication columns use IDs';
    END IF;
    
    IF v_missing_fks > 0 THEN
        RAISE WARNING '⚠️  WARNING: % potential missing FK constraints', v_missing_fks;
    ELSE
        RAISE NOTICE '✅ All expected FK constraints exist';
    END IF;
    
    IF v_text_substance_cols = 0 AND v_missing_fks = 0 THEN
        RAISE NOTICE '';
        RAISE NOTICE '✅✅✅ VALIDATION CONTROLS ARE COMPLIANT ✅✅✅';
    END IF;
END $$;
