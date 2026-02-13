-- ============================================================================
-- REFERENCE TABLES VERIFICATION QUERY
-- ============================================================================
-- Purpose: Verify all reference tables are populated in Supabase
-- Run this in Supabase SQL Editor
-- ============================================================================

-- Check row counts for all reference tables
SELECT 'ref_substances' as table_name, COUNT(*) as row_count FROM public.ref_substances
UNION ALL SELECT 'ref_routes', COUNT(*) FROM public.ref_routes
UNION ALL SELECT 'ref_support_modality', COUNT(*) FROM public.ref_support_modality
UNION ALL SELECT 'ref_smoking_status', COUNT(*) FROM public.ref_smoking_status
UNION ALL SELECT 'ref_severity_grade', COUNT(*) FROM public.ref_severity_grade
UNION ALL SELECT 'ref_safety_events', COUNT(*) FROM public.ref_safety_events
UNION ALL SELECT 'ref_resolution_status', COUNT(*) FROM public.ref_resolution_status
UNION ALL SELECT 'ref_indications', COUNT(*) FROM public.ref_indications
UNION ALL SELECT 'ref_assessments', COUNT(*) FROM public.ref_assessments
UNION ALL SELECT 'ref_assessment_interval', COUNT(*) FROM public.ref_assessment_interval
UNION ALL SELECT 'ref_justification_codes', COUNT(*) FROM public.ref_justification_codes
UNION ALL SELECT 'ref_knowledge_graph', COUNT(*) FROM public.ref_knowledge_graph
UNION ALL SELECT 'ref_primary_adverse', COUNT(*) FROM public.ref_primary_adverse
UNION ALL SELECT 'ref_sources', COUNT(*) FROM public.ref_sources
ORDER BY table_name;

-- Check RLS is enabled
SELECT 
    schemaname, 
    tablename, 
    rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public' 
AND tablename LIKE 'ref_%'
ORDER BY tablename;

-- ============================================================================
-- EXPECTED RESULTS:
-- ============================================================================
-- ref_substances: 8 rows (Psilocybin, MDMA, Ketamine, LSD-25, 5-MeO-DMT, Ibogaine, Mescaline, Other)
-- ref_routes: 9 rows (Oral, IV, IM, Intranasal, Sublingual, Buccal, Rectal, SC, Other)
-- ref_support_modality: 5 rows (CBT, Somatic, Psychodynamic, IFS, None/Sitter)
-- ref_smoking_status: 4 rows (Non-Smoker, Former, Occasional, Daily)
-- ref_severity_grade: 5 rows (Grade 1-5)
-- ref_safety_events: 13 rows (Anxiety, Confusion, Dissociation, etc.)
-- ref_resolution_status: 3 rows (Resolved in Session, Post-Session, Unresolved)
-- ref_indications: 9 rows (MDD, TRD, PTSD, GAD, SAD, OCD, SUD, End-of-Life, Other)
-- 
-- RLS should be TRUE for all ref_* tables
-- ============================================================================
