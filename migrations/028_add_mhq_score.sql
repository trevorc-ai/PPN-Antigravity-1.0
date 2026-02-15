-- ============================================================================
-- Migration 028: Add MHQ (Mental Health Quotient) Score Reference Table
-- ============================================================================
-- Purpose: Add MHQ score tracking to clinical records
-- Author: SOOP
-- Date: 2026-02-15
-- Authorization: Trevor (admin) requested this addition
-- ============================================================================

-- 1. Create MHQ Score Reference Table
CREATE TABLE IF NOT EXISTS public.ref_mhq_scores (
    mhq_score_id BIGSERIAL PRIMARY KEY,
    score_range TEXT NOT NULL UNIQUE,
    score_min INTEGER NOT NULL,
    score_max INTEGER NOT NULL,
    interpretation TEXT,
    severity_level TEXT CHECK (severity_level IN ('Minimal', 'Mild', 'Moderate', 'Severe', 'Very Severe')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Seed MHQ Score Ranges (based on standard MHQ scoring)
-- MHQ scores typically range from -100 to +200
INSERT INTO public.ref_mhq_scores (score_range, score_min, score_max, interpretation, severity_level)
VALUES
    ('Very Poor (-100 to -1)', -100, -1, 'Significant mental health challenges', 'Very Severe'),
    ('Poor (0 to 49)', 0, 49, 'Below average mental health', 'Severe'),
    ('Fair (50 to 99)', 50, 99, 'Moderate mental health concerns', 'Moderate'),
    ('Good (100 to 149)', 100, 149, 'Average mental health', 'Mild'),
    ('Very Good (150 to 200)', 150, 200, 'Excellent mental health', 'Minimal')
ON CONFLICT (score_range) DO NOTHING;

-- 3. Add MHQ score columns to log_clinical_records
ALTER TABLE public.log_clinical_records
ADD COLUMN IF NOT EXISTS baseline_mhq_score INTEGER,
ADD COLUMN IF NOT EXISTS mhq_post INTEGER,
ADD COLUMN IF NOT EXISTS mhq_score_id BIGINT REFERENCES public.ref_mhq_scores(mhq_score_id);

-- 4. Create index for performance
CREATE INDEX IF NOT EXISTS idx_clinical_records_mhq ON public.log_clinical_records(mhq_score_id);
CREATE INDEX IF NOT EXISTS idx_clinical_records_baseline_mhq ON public.log_clinical_records(baseline_mhq_score);

-- 5. Enable RLS on reference table
ALTER TABLE public.ref_mhq_scores ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies (read-only for authenticated users)
CREATE POLICY "authenticated_read_mhq_scores"
ON public.ref_mhq_scores
FOR SELECT
TO authenticated
USING (true);

-- Admin-only write access
CREATE POLICY "admin_write_mhq_scores"
ON public.ref_mhq_scores
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.user_sites
        WHERE user_sites.user_id = auth.uid()
        AND user_sites.role = 'network_admin'
    )
);

-- 7. Add comments
COMMENT ON TABLE public.ref_mhq_scores IS 'Mental Health Quotient (MHQ) score ranges and interpretations';
COMMENT ON COLUMN public.log_clinical_records.baseline_mhq_score IS 'MHQ score at baseline (before treatment)';
COMMENT ON COLUMN public.log_clinical_records.mhq_post IS 'MHQ score post-treatment';
COMMENT ON COLUMN public.log_clinical_records.mhq_score_id IS 'Foreign key to ref_mhq_scores for categorization';

-- 8. Verification
SELECT 
    'ref_mhq_scores' as table_name,
    COUNT(*) as score_ranges
FROM public.ref_mhq_scores;

SELECT 
    column_name,
    data_type
FROM information_schema.columns
WHERE table_name = 'log_clinical_records'
    AND column_name LIKE '%mhq%'
ORDER BY column_name;

DO $$
BEGIN
    RAISE NOTICE '✅ Migration 028: MHQ Score Reference Table Created';
    RAISE NOTICE '   - ref_mhq_scores table: 5 score ranges';
    RAISE NOTICE '   - Added baseline_mhq_score to log_clinical_records';
    RAISE NOTICE '   - Added mhq_post to log_clinical_records';
    RAISE NOTICE '   - Added mhq_score_id foreign key';
    RAISE NOTICE '   - RLS enabled with authenticated read access';
END $$;
