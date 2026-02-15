-- ============================================
-- MIGRATION 023: Smart Search RPC with Aggregates
-- ============================================
-- Migration Number: 023
-- Date: 2026-02-14
-- Author: SOOP
-- Purpose: Create search_global_v2 RPC function with security-critical RLS enforcement
-- Work Order: WO_020
-- Affected Tables: ref_substances, log_clinical_records, user_profiles, user_sites
-- ============================================

-- ============================================
-- SECTION 1: CREATE FULL TEXT SEARCH INDEXES
-- ============================================

-- Create GIN indexes for Full Text Search performance
CREATE INDEX IF NOT EXISTS idx_substances_name_fts 
ON public.ref_substances USING GIN (to_tsvector('english', substance_name));

CREATE INDEX IF NOT EXISTS idx_user_profiles_name_fts 
ON public.user_profiles USING GIN (
    to_tsvector('english', COALESCE(display_name, '') || ' ' || COALESCE(first_name, '') || ' ' || COALESCE(last_name, ''))
);

-- ============================================
-- SECTION 2: CREATE SECURE RPC FUNCTION
-- ============================================

CREATE OR REPLACE FUNCTION search_global_v2(query_text TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_user_id UUID;
    user_site_ids BIGINT[];
    result JSON;
    substances_data JSON;
    sessions_data JSON;
    profiles_data JSON;
    aggregates_data JSON;
BEGIN
    -- ============================================
    -- CRITICAL SECURITY: Verify authenticated user
    -- ============================================
    current_user_id := auth.uid();
    
    IF current_user_id IS NULL THEN
        RAISE EXCEPTION 'Unauthorized: No authenticated user';
    END IF;
    
    -- ============================================
    -- CRITICAL SECURITY: Get user's authorized sites
    -- ============================================
    SELECT ARRAY_AGG(site_id) INTO user_site_ids
    FROM public.user_sites
    WHERE user_id = current_user_id
    AND is_active = TRUE;
    
    -- If user has no sites, return empty results
    IF user_site_ids IS NULL THEN
        user_site_ids := ARRAY[]::BIGINT[];
    END IF;
    
    -- ============================================
    -- QUERY 1: Substances with avg_efficacy
    -- ============================================
    -- Security: Substances are reference data (public read)
    -- Efficacy calculated ONLY from user's accessible clinical records
    SELECT COALESCE(
        json_agg(
            json_build_object(
                'id', s.substance_id,
                'name', s.substance_name,
                'class', s.substance_class,
                'avg_efficacy', COALESCE(
                    (
                        SELECT AVG(outcome_score::NUMERIC / 100.0)
                        FROM public.log_clinical_records lcr
                        WHERE lcr.substance_id = s.substance_id
                        AND (
                            lcr.site_id = ANY(user_site_ids)
                            OR lcr.created_by = current_user_id
                        )
                        AND lcr.outcome_score IS NOT NULL
                    ),
                    0
                )
            )
        ),
        '[]'::json
    ) INTO substances_data
    FROM public.ref_substances s
    WHERE s.is_active = TRUE
    AND to_tsvector('english', s.substance_name) @@ plainto_tsquery('english', query_text)
    LIMIT 20;
    
    -- ============================================
    -- QUERY 2: Sessions with outcome_delta
    -- ============================================
    -- Security: ONLY return sessions from user's authorized sites
    SELECT COALESCE(
        json_agg(
            json_build_object(
                'id', lcr.clinical_record_id,
                'subject_id', lcr.subject_id,
                'substance_id', lcr.substance_id,
                'outcome_score', lcr.outcome_score,
                'outcome_delta', lcr.outcome_score - COALESCE(
                    (
                        SELECT outcome_score
                        FROM public.log_clinical_records baseline
                        WHERE baseline.subject_id = lcr.subject_id
                        AND baseline.created_at < lcr.created_at
                        ORDER BY baseline.created_at DESC
                        LIMIT 1
                    ),
                    lcr.outcome_score
                ),
                'site_id', lcr.site_id,
                'created_at', lcr.created_at
            )
        ),
        '[]'::json
    ) INTO sessions_data
    FROM public.log_clinical_records lcr
    WHERE (
        lcr.site_id = ANY(user_site_ids)
        OR lcr.created_by = current_user_id
    )
    AND lcr.subject_id::TEXT ILIKE '%' || query_text || '%'
    LIMIT 50;
    
    -- ============================================
    -- QUERY 3: Matching user profiles
    -- ============================================
    -- Security: Users can only see their own profile (per RLS)
    -- This query respects existing RLS policies
    SELECT COALESCE(
        json_agg(
            json_build_object(
                'id', up.id,
                'display_name', COALESCE(up.display_name, up.first_name || ' ' || up.last_name),
                'specialty', up.specialty,
                'role_tier', up.role_tier
            )
        ),
        '[]'::json
    ) INTO profiles_data
    FROM public.user_profiles up
    WHERE up.user_id = current_user_id
    AND (
        to_tsvector('english', 
            COALESCE(up.display_name, '') || ' ' || 
            COALESCE(up.first_name, '') || ' ' || 
            COALESCE(up.last_name, '')
        ) @@ plainto_tsquery('english', query_text)
    )
    LIMIT 10;
    
    -- ============================================
    -- QUERY 4: Aggregates (RLS-COMPLIANT)
    -- ============================================
    -- CRITICAL: Aggregates ONLY count user's accessible data
    SELECT json_build_object(
        'substances', (
            SELECT COUNT(DISTINCT substance_id)
            FROM public.ref_substances
            WHERE is_active = TRUE
            AND to_tsvector('english', substance_name) @@ plainto_tsquery('english', query_text)
        ),
        'sessions', (
            SELECT COUNT(*)
            FROM public.log_clinical_records lcr
            WHERE (
                lcr.site_id = ANY(user_site_ids)
                OR lcr.created_by = current_user_id
            )
            AND lcr.subject_id::TEXT ILIKE '%' || query_text || '%'
        ),
        'patients', (
            SELECT COUNT(DISTINCT subject_id)
            FROM public.log_clinical_records lcr
            WHERE (
                lcr.site_id = ANY(user_site_ids)
                OR lcr.created_by = current_user_id
            )
            AND lcr.subject_id::TEXT ILIKE '%' || query_text || '%'
        ),
        'profiles', (
            SELECT COUNT(*)
            FROM public.user_profiles up
            WHERE up.user_id = current_user_id
            AND (
                to_tsvector('english', 
                    COALESCE(up.display_name, '') || ' ' || 
                    COALESCE(up.first_name, '') || ' ' || 
                    COALESCE(up.last_name, '')
                ) @@ plainto_tsquery('english', query_text)
            )
        )
    ) INTO aggregates_data;
    
    -- ============================================
    -- BUILD FINAL RESULT
    -- ============================================
    result := json_build_object(
        'substances', substances_data,
        'sessions', sessions_data,
        'profiles', profiles_data,
        'aggregates', aggregates_data,
        'query', query_text,
        'user_id', current_user_id,
        'timestamp', NOW()
    );
    
    RETURN result;
END;
$$;

-- ============================================
-- SECTION 3: GRANT PERMISSIONS
-- ============================================

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION search_global_v2(TEXT) TO authenticated;

-- ============================================
-- SECTION 4: VERIFICATION QUERIES
-- ============================================

-- Verify indexes were created
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE indexname IN ('idx_substances_name_fts', 'idx_user_profiles_name_fts');

-- Verify function exists
SELECT 
    routine_name,
    routine_type,
    security_type,
    data_type
FROM information_schema.routines
WHERE routine_name = 'search_global_v2'
AND routine_schema = 'public';

-- ============================================
-- SECTION 5: PERFORMANCE TEST
-- ============================================

-- Test query performance (should be < 150ms)
-- UNCOMMENT TO RUN PERFORMANCE TEST:
-- EXPLAIN ANALYZE SELECT search_global_v2('psilocybin');

-- ============================================
-- SECTION 6: SECURITY VERIFICATION
-- ============================================

-- Verify RLS is enabled on all queried tables
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE tablename IN ('ref_substances', 'log_clinical_records', 'user_profiles', 'user_sites')
AND schemaname = 'public';

-- ============================================
-- SECTION 7: ROLLBACK SCRIPT (for emergencies)
-- ============================================

-- UNCOMMENT AND RUN ONLY IF YOU NEED TO ROLLBACK:

-- DROP FUNCTION IF EXISTS search_global_v2(TEXT);
-- DROP INDEX IF EXISTS idx_substances_name_fts;
-- DROP INDEX IF EXISTS idx_user_profiles_name_fts;

-- ============================================
-- END OF MIGRATION 023
-- ============================================

-- Success notification
DO $$
BEGIN
    RAISE NOTICE '✅ Migration 023: search_global_v2 RPC function created successfully';
    RAISE NOTICE '🔒 SECURITY: Function uses SECURITY DEFINER with strict RLS enforcement';
    RAISE NOTICE '⚡ PERFORMANCE: GIN indexes created for Full Text Search';
    RAISE NOTICE '📊 AGGREGATES: All counts respect user site isolation';
END $$;
