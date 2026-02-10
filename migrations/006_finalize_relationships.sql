-- ============================================================================
-- MIGRATION 006: Finalize Database Relationships (FKs)
-- ============================================================================
-- Purpose: Add Foreign Key constraints to log_clinical_records for join queries.
-- This enables Supabase to perform nested selects (e.g. fetch substance name).
-- ============================================================================

-- 1. Link log_clinical_records.substance_id -> ref_substances.substance_id
DO $$
BEGIN
    -- Check if ref_substances exists (it should from 003)
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ref_substances') THEN
        
        -- Add FK if it doesn't exist
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'fk_clinical_records_substance'
        ) THEN
            ALTER TABLE public.log_clinical_records 
            ADD CONSTRAINT fk_clinical_records_substance 
            FOREIGN KEY (substance_id) 
            REFERENCES public.ref_substances(substance_id);
            
            RAISE NOTICE '✅ Added fk_clinical_records_substance';
        END IF;

    ELSE
        RAISE WARNING '⚠️ ref_substances table missing. Skipping FK creation.';
    END IF;
END $$;

-- 2. Link log_clinical_records.site_id -> sites.site_id
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sites') THEN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'fk_clinical_records_site'
        ) THEN
            ALTER TABLE public.log_clinical_records 
            ADD CONSTRAINT fk_clinical_records_site 
            FOREIGN KEY (site_id) 
            REFERENCES public.sites(site_id);
            RAISE NOTICE '✅ Added fk_clinical_records_site';
        END IF;
    END IF;
END $$;
