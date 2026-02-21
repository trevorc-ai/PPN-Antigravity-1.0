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

-- DMT — Source: Nichols 2016, BindingDB
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

-- Esketamine — Source: Zanos et al. 2018, FDA label (S-enantiomer ~2x potency vs racemic)
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

-- Ayahuasca — DMT component Ki values; harmine = MAO-A inhibition (pharmacodynamic)
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
    RAISE NOTICE '✅ Migration 016c: All 3 substances added. Catalog now at 10.';
  ELSE
    RAISE WARNING '⚠️ Migration 016c: Expected 3, found %', new_count;
  END IF;
END $$;
