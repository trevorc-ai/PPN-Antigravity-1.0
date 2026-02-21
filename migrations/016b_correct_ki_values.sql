-- ============================================================================
-- Migration 016b: Correct Ki Values in ref_substances
-- Additive UPDATE statements only. No DROP. No ALTER TYPE. RLS remains ON.
-- Values verified against: Nichols 2016 (Pharmacological Reviews),
-- Rickli et al. 2016 (Neuropharmacology), PDSP Ki Database (archived),
-- Zanos et al. 2016 (Nature), Popik et al. 1995
-- USER approved 2026-02-20
-- ============================================================================

-- Psilocybin/Psilocin — 5-HT2A: 6.0 → 28 nM (Rickli et al. 2016)
UPDATE public.ref_substances
SET receptor_5ht2a_ki = 28.0
WHERE substance_name ILIKE '%psilocybin%' OR substance_name ILIKE '%psilocin%';

-- MDMA — SERT: 500 → 240 nM (Nichols 2004); 5-HT2A: → >10000 nM (PDSP)
UPDATE public.ref_substances
SET
  receptor_sert_ki   = 240.0,
  receptor_5ht2a_ki  = 10000.0
WHERE substance_name ILIKE '%mdma%' OR substance_name ILIKE '%ecstasy%';

-- LSD-25 — 5-HT2A: 2.0 → 2.9 nM (Nichols 2016 Pharmacological Reviews)
UPDATE public.ref_substances
SET receptor_5ht2a_ki = 2.9
WHERE substance_name ILIKE '%lsd%';

-- Mescaline — 5-HT2A: 1000 → 3000 nM (low potency phenethylamine, Nichols 2016)
UPDATE public.ref_substances
SET receptor_5ht2a_ki = 3000.0
WHERE substance_name ILIKE '%mescaline%';

-- 5-MeO-DMT — 5-HT2A: 10 → 295 nM; 5-HT1A confirmed 2.1 nM (PDSP)
-- Critical: 5-HT1A is the PRIMARY target for 5-MeO-DMT, not 5-HT2A
UPDATE public.ref_substances
SET
  receptor_5ht2a_ki = 295.0,
  receptor_5ht1a_ki = 2.1
WHERE substance_name ILIKE '%5-meo%' OR substance_name ILIKE '%5meo%';

-- Ibogaine — 5-HT2A: 100 → 700 nM (Popik et al. 1995)
UPDATE public.ref_substances
SET receptor_5ht2a_ki = 700.0
WHERE substance_name ILIKE '%ibogaine%';

-- Ketamine — NMDA 500 nM confirmed ✅ No change needed
-- (keeping this comment as audit trail of verification)

-- DMT — 5-HT2A: 150 nM, 5-HT1A: 12 nM (Nichols 2016 / BindingDB)
UPDATE public.ref_substances
SET
  receptor_5ht2a_ki = 150.0,
  receptor_5ht1a_ki = 12.0
WHERE substance_name ILIKE '%dmt%'
  AND substance_name NOT ILIKE '%5-meo%'
  AND substance_name NOT ILIKE '%methoxy%'
  AND substance_name NOT ILIKE '%ayahuasca%';

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Show corrected values for audit trail
SELECT
  substance_name,
  receptor_5ht2a_ki,
  receptor_5ht1a_ki,
  receptor_sert_ki,
  receptor_nmda_ki,
  primary_mechanism
FROM public.ref_substances
WHERE substance_name IN (
  'Psilocybin', 'MDMA', 'Ketamine', 'LSD-25',
  '5-MeO-DMT', 'Ibogaine', 'Mescaline', 'DMT',
  'Esketamine', 'Ayahuasca'
)
ORDER BY substance_name;

DO $$
BEGIN
  RAISE NOTICE '✅ Migration 016b: Ki value corrections applied. Run SELECT above to verify.';
END $$;
