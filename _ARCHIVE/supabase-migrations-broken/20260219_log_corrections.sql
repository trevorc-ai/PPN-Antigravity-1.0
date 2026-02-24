-- ============================================================================
-- Migration: 20260219_log_corrections.sql  (WO-211)
-- Purpose:   Audit-safe amendment mechanism. Practitioners can correct errors
--            without modifying original rows. "Additive-only" principle.
--
-- Design:
--   - Creates log_corrections table pointing to source rows
--   - Records old_value_json → new_value_json diffs per field
--   - Requires correction_reason (10-500 chars, enforced by CHECK)
--   - Supports approval workflow (approved_by / approved_at)
--   - RLS: site-scoped INSERT + SELECT
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.log_corrections (
    correction_id      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    source_table       TEXT        NOT NULL,   -- e.g. 'log_behavioral_changes'
    source_row_id      UUID        NOT NULL,   -- the row being corrected
    field_name         TEXT        NOT NULL,   -- which field was wrong
    old_value_json     JSONB,                  -- original value (null if late entry)
    new_value_json     JSONB       NOT NULL,   -- corrected value
    correction_type    TEXT        NOT NULL
                       CHECK (correction_type IN (
                           'data_entry_error',
                           'late_entry',
                           'amendment',
                           'withdrawal'
                       )),
    correction_reason  TEXT        NOT NULL
                       CHECK (length(correction_reason) BETWEEN 10 AND 500),
    corrected_by       UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
    site_id            UUID        REFERENCES public.log_sites(site_id),
    corrected_at       TIMESTAMPTZ DEFAULT NOW(),
    approved_by        UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
    approved_at        TIMESTAMPTZ
);

-- Fast lookup: "show me all corrections for this specific row"
CREATE INDEX IF NOT EXISTS idx_corrections_source_row
    ON public.log_corrections (source_table, source_row_id);

-- Site-level audit queries: "corrections at Portland Clinic, last 30 days"
CREATE INDEX IF NOT EXISTS idx_corrections_site_time
    ON public.log_corrections (site_id, corrected_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.log_corrections ENABLE ROW LEVEL SECURITY;

-- Idempotency guards (DROP POLICY IF EXISTS before each CREATE POLICY)
DROP POLICY IF EXISTS "corrections_site_insert" ON public.log_corrections;
DROP POLICY IF EXISTS "corrections_site_select" ON public.log_corrections;

-- Site staff INSERT: they can only correct their own site's records
-- and must be the corrected_by person
CREATE POLICY "corrections_site_insert"
    ON public.log_corrections
    FOR INSERT
    TO authenticated
    WITH CHECK (
        corrected_by = auth.uid()
        AND site_id IN (
            SELECT lus.site_id
            FROM public.log_user_sites lus
            WHERE lus.user_id = auth.uid()
        )
    );

-- Site staff SELECT: view corrections for their own site
CREATE POLICY "corrections_site_select"
    ON public.log_corrections
    FOR SELECT
    TO authenticated
    USING (
        site_id IN (
            SELECT lus.site_id
            FROM public.log_user_sites lus
            WHERE lus.user_id = auth.uid()
        )
    );

-- Verify
SELECT 'log_corrections created' AS status,
       COUNT(*)                  AS row_count
FROM public.log_corrections;
