---
status: 03_BUILD
owner: SOOP
failure_count: 0
priority: HIGH
created: 2026-02-20
sprint: 0
blocked_by: none — run before WO-245a and WO-245b
---

# WO-245e: Add 3 New Substances to ref_substances (Science-Based Catalog Expansion)

## Context
USER approved a 10-substance catalog based on clinical and scientific authority, not the existing database. Three substances with image assets already in `public/molecules/` are missing from `ref_substances`. This migration adds them additively.

## SOOP Task — Write `migrations/016c_add_missing_substances.sql`

```sql
-- ============================================================================
-- Migration 016c: Add DMT, Esketamine, Ayahuasca to ref_substances
-- Additive only. No DROP. No type changes. RLS remains ON.
-- Science-based catalog expansion — USER approved 2026-02-20
-- ============================================================================

INSERT INTO public.ref_substances (substance_name, substance_class)
VALUES
  ('DMT', 'psychedelic'),
  ('Esketamine', 'dissociative'),
  ('Ayahuasca', 'psychedelic')
ON CONFLICT (substance_name) DO NOTHING;

-- Add receptor affinity columns for new substances
-- (columns already exist from migration 015)

-- DMT (N,N-Dimethyltryptamine) — Source: Nichols 2016, BindingDB
UPDATE public.ref_substances
SET
  receptor_5ht2a_ki  = 150.0,
  receptor_5ht1a_ki  = 12.0,
  receptor_5ht2c_ki  = 60.0,
  receptor_d2_ki     = 10000.0,
  receptor_sert_ki   = 10000.0,
  receptor_nmda_ki   = 10000.0,
  primary_mechanism  = '5-HT2A/1A Agonism'
WHERE substance_name = 'DMT';

-- Esketamine (S-Ketamine / Spravato) — Source: Zanos et al. 2018, FDA label
-- More potent than racemic ketamine at NMDA (~2x). Ki ~250 nM for S-enantiomer.
UPDATE public.ref_substances
SET
  receptor_5ht2a_ki  = 10000.0,
  receptor_5ht1a_ki  = 10000.0,
  receptor_5ht2c_ki  = 10000.0,
  receptor_d2_ki     = 10000.0,
  receptor_sert_ki   = 10000.0,
  receptor_nmda_ki   = 250.0,
  primary_mechanism  = 'NMDA Antagonism (S-enantiomer, 2x potency vs racemic)'
WHERE substance_name = 'Esketamine';

-- Ayahuasca — DMT component drives 5-HT2A; harmine adds MAOI (MAO-A inhibition)
-- Ki values represent DMT component. MAOI effect is pharmacodynamic, not receptor-level.
UPDATE public.ref_substances
SET
  receptor_5ht2a_ki  = 150.0,
  receptor_5ht1a_ki  = 12.0,
  receptor_5ht2c_ki  = 60.0,
  receptor_d2_ki     = 10000.0,
  receptor_sert_ki   = 10000.0,
  receptor_nmda_ki   = 10000.0,
  primary_mechanism  = 'DMT 5-HT2A Agonism + β-Carboline MAO-A Inhibition'
WHERE substance_name = 'Ayahuasca';

-- Verification
DO $$
DECLARE
  new_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO new_count
  FROM public.ref_substances
  WHERE substance_name IN ('DMT', 'Esketamine', 'Ayahuasca');

  IF new_count = 3 THEN
    RAISE NOTICE '✅ Migration 016c: All 3 substances added. Total catalog now at 10.';
  ELSE
    RAISE WARNING '⚠️ Migration 016c: Expected 3 new substances, found %', new_count;
  END IF;
END $$;
```

## Acceptance Criteria
```
[ ] Migration file exists at migrations/016c_add_missing_substances.sql
[ ] No DROP, ALTER TYPE, or destructive commands present
[ ] ON CONFLICT DO NOTHING prevents duplicate errors
[ ] RLS remains ON (verify: \d+ ref_substances shows RLS enabled)
[ ] Ki values populated for all 3 new substances
[ ] Verification block runs without WARNING
```

## After SOOP completes → hand off to WO-245b BUILDER
