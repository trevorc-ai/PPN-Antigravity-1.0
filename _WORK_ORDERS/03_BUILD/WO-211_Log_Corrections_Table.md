---
id: WO-211
title: "SOOP: log_corrections Table — Additive Amendment Mechanism"
status: 03_BUILD
owner: SOOP
priority: P0
created: 2026-02-19
failure_count: 0
ref_tables_affected: none
depends_on: Turning_Point.md directive
---

## MANDATE (from Turning_Point.md)

> INSPECTOR: "A log_corrections table that points to a source row and records what was changed and when — without modifying the original row — is mandatory before clinical launch."

Additive-only means we never change history, but we need a way to annotate it.

## SOOP DELIVERABLE

Write `supabase/migrations/20260219_log_corrections.sql`:

```sql
CREATE TABLE IF NOT EXISTS public.log_corrections (
    correction_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_table       TEXT NOT NULL,          -- 'log_behavioral_changes', 'log_pulse_checks', etc.
    source_row_id      UUID NOT NULL,          -- the row being corrected
    field_name         TEXT NOT NULL,          -- which field was wrong
    old_value_json     JSONB,                  -- what it was (null if late entry)
    new_value_json     JSONB NOT NULL,         -- what it should be
    correction_type    TEXT NOT NULL CHECK (correction_type IN (
                           'data_entry_error', 'late_entry', 'amendment', 'withdrawal'
                       )),
    correction_reason  TEXT NOT NULL           -- one sentence, required
                       CHECK (length(correction_reason) BETWEEN 10 AND 500),
    corrected_by       UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    site_id            UUID REFERENCES public.log_sites(site_id),
    corrected_at       TIMESTAMPTZ DEFAULT NOW(),
    approved_by        UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    approved_at        TIMESTAMPTZ
);

-- Index for fast lookups by source row
CREATE INDEX IF NOT EXISTS idx_corrections_source
    ON public.log_corrections (source_table, source_row_id);

-- Index for site-level audit queries
CREATE INDEX IF NOT EXISTS idx_corrections_site
    ON public.log_corrections (site_id, corrected_at DESC);

ALTER TABLE public.log_corrections ENABLE ROW LEVEL SECURITY;

-- Site staff can INSERT corrections for their site
CREATE POLICY "corrections_site_insert"
    ON public.log_corrections FOR INSERT TO authenticated
    WITH CHECK (
        corrected_by = auth.uid()
        AND site_id IN (
            SELECT lus.site_id FROM public.log_user_sites lus
            WHERE lus.user_id = auth.uid()
        )
    );

-- Site staff can SELECT corrections for their site
CREATE POLICY "corrections_site_select"
    ON public.log_corrections FOR SELECT TO authenticated
    USING (
        site_id IN (
            SELECT lus.site_id FROM public.log_user_sites lus
            WHERE lus.user_id = auth.uid()
        )
    );
```

## Acceptance Criteria

- [ ] `log_corrections` table created with all columns
- [ ] CHECK constraint on `correction_type` values
- [ ] `correction_reason` CHECK: 10-500 chars
- [ ] 2 indexes: source_row lookup + site audit
- [ ] RLS: authenticated users may only INSERT/SELECT their own site's corrections
- [ ] Migration is idempotent (CREATE TABLE IF NOT EXISTS, CREATE INDEX IF NOT EXISTS)
