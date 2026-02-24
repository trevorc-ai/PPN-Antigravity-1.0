-- ============================================================================
-- Migration: 20260219_vocabulary_requests.sql  (WO-202)
-- Purpose:   log_vocabulary_requests table — governance infrastructure for
--            controlled-vocabulary gap tracking.
--
-- EPHEMERAL TEXT FIELDS: proposed_label and clinical_rationale are deleted
-- by the application layer when status → 'approved'. The advisory_notes
-- field is permanent (curator decision record).
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.log_vocabulary_requests (
    request_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id             UUID REFERENCES public.log_sites(site_id),
    requesting_user     UUID REFERENCES auth.users(id),
    target_ref_table    TEXT NOT NULL,     -- which ref_ table should receive this concept
    proposed_label      TEXT NOT NULL,     -- EPHEMERAL: cleared after ref_ conversion
    proposed_category   TEXT,              -- optional grouping within the ref_ table
    clinical_rationale  TEXT,              -- EPHEMERAL: cleared after ref_ conversion
    status              TEXT NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending','under_review','approved','rejected')),
    request_count       INTEGER DEFAULT 1, -- increments when multiple sites request same concept
    requesting_sites    UUID[],            -- tracks which sites have requested this concept
    advisory_notes      TEXT,              -- curator's decision notes (kept permanently)
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at         TIMESTAMPTZ,
    converted_to_ref_id BIGINT             -- set when approved and added to ref_ table
);

-- GIN index on requesting_sites for fast multi-site analytics
CREATE INDEX IF NOT EXISTS idx_gin_requesting_sites
    ON public.log_vocabulary_requests USING GIN (requesting_sites);

-- B-tree index on status for governance dashboard queries
CREATE INDEX IF NOT EXISTS idx_vocab_requests_status
    ON public.log_vocabulary_requests (status);

-- B-tree index on target_ref_table to filter by vocabulary domain
CREATE INDEX IF NOT EXISTS idx_vocab_requests_ref_table
    ON public.log_vocabulary_requests (target_ref_table);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.log_vocabulary_requests ENABLE ROW LEVEL SECURITY;

-- Idempotency guards
DROP POLICY IF EXISTS "vocab_requests_practitioner_insert" ON public.log_vocabulary_requests;
DROP POLICY IF EXISTS "vocab_requests_site_select"         ON public.log_vocabulary_requests;
DROP POLICY IF EXISTS "vocab_requests_own_select"          ON public.log_vocabulary_requests;

-- Practitioners: INSERT their own requests only
CREATE POLICY "vocab_requests_practitioner_insert"
    ON public.log_vocabulary_requests
    FOR INSERT
    TO authenticated
    WITH CHECK (requesting_user = auth.uid());

-- Site admins: SELECT requests from their own site
CREATE POLICY "vocab_requests_site_select"
    ON public.log_vocabulary_requests
    FOR SELECT
    TO authenticated
    USING (
        site_id IN (
            SELECT lus.site_id
            FROM public.log_user_sites lus
            WHERE lus.user_id = auth.uid()
        )
    );

-- Practitioners: SELECT their own requests (in case they want to track status)
CREATE POLICY "vocab_requests_own_select"
    ON public.log_vocabulary_requests
    FOR SELECT
    TO authenticated
    USING (requesting_user = auth.uid());


-- Verify
SELECT 'log_vocabulary_requests created' AS status,
       COUNT(*) AS row_count
FROM public.log_vocabulary_requests;
