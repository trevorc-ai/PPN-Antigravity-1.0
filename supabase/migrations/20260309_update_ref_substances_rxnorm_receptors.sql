-- ===========================================================================
-- Migration: 20260309_update_ref_substances_rxnorm_receptors.sql
-- Purpose:   Enrich ref_substances with verified RxNorm CUIs and receptor
--            binding affinity Ki values (nM) from peer-reviewed literature.
--
-- Sources:
--   RxNorm CUIs:   RxNav REST API (rxnav.nlm.nih.gov) — live-verified 2026-03-09
--   Receptor Ki:   NIMH PDSP Ki Database; Roth et al. (2002) Nat Rev Drug Discov;
--                  Nichols (2016) Pharmacol Rev; Glennon (2010) AAPS J;
--                  Cameron et al. (2019) ACS Chem Neurosci (ketamine)
--
-- RxNorm status:
--   Ketamine  → RxCUI 6130  (FDA-approved, in RxNorm)
--   All others → NULL (Schedule I / no approved NDA / not indexed by NLM)
--
-- Ki units: nanomolar (nM). NULL = not tested or data unavailable.
-- Lower Ki = higher receptor affinity.
--
-- Safety: UPDATE by substance_name only. No drops, no type changes.
-- ===========================================================================

-- ── Psilocybin ──────────────────────────────────────────────────────────────
-- Ki values reflect psilocin (active dephosphorylated metabolite).
-- Source: NIMH PDSP; Halberstadt & Geyer (2011) Neuropharm.
UPDATE public.ref_substances SET
    rxnorm_cui        = NULL,           -- Not in RxNorm (Schedule I, no NDA)
    receptor_5ht2a_ki = 6.0,            -- nM — primary agonist target
    receptor_5ht1a_ki = 190.0,          -- nM
    receptor_5ht2c_ki = 25.0,           -- nM
    receptor_d2_ki    = NULL,           -- No meaningful D2 affinity
    receptor_sert_ki  = NULL,           -- No meaningful SERT affinity
    receptor_nmda_ki  = NULL
WHERE substance_name = 'Psilocybin';

-- ── MDMA ────────────────────────────────────────────────────────────────────
-- Source: Steele et al. (1994) J Pharmacol Exp Ther; NIMH PDSP.
UPDATE public.ref_substances SET
    rxnorm_cui        = NULL,           -- Not in RxNorm (FDA rejected 2024)
    receptor_5ht2a_ki = 150.0,          -- nM — modest 5-HT2A activity
    receptor_5ht1a_ki = 2400.0,         -- nM
    receptor_5ht2c_ki = 200.0,          -- nM
    receptor_d2_ki    = 1350.0,         -- nM
    receptor_sert_ki  = 34.0,           -- nM — primary mechanism (monoamine release)
    receptor_nmda_ki  = NULL
WHERE substance_name = 'MDMA';

-- ── Ketamine ────────────────────────────────────────────────────────────────
-- Source: Zanos et al. (2016) Nature; NIMH PDSP.
UPDATE public.ref_substances SET
    rxnorm_cui        = 6130,           -- VERIFIED via RxNav API 2026-03-09
    receptor_5ht2a_ki = 400.0,          -- nM — weak 5-HT2A activity
    receptor_5ht1a_ki = NULL,
    receptor_5ht2c_ki = NULL,
    receptor_d2_ki    = NULL,
    receptor_sert_ki  = 2000.0,         -- nM — weak SERT activity
    receptor_nmda_ki  = 500.0           -- nM — primary mechanism (open-channel block)
WHERE substance_name = 'Ketamine';

-- ── LSD ─────────────────────────────────────────────────────────────────────
-- Source: Nichols (2016) Pharmacol Rev; Wacker et al. (2017) Cell.
UPDATE public.ref_substances SET
    rxnorm_cui        = NULL,           -- Not in RxNorm (Schedule I)
    receptor_5ht2a_ki = 1.1,            -- nM — extremely high affinity
    receptor_5ht1a_ki = 30.0,           -- nM
    receptor_5ht2c_ki = 2.8,            -- nM
    receptor_d2_ki    = 95.0,           -- nM — notable D2 activity
    receptor_sert_ki  = 100.0,          -- nM
    receptor_nmda_ki  = NULL
WHERE substance_name = 'LSD';

-- ── 5-MeO-DMT ───────────────────────────────────────────────────────────────
-- Source: Krebs-Thomson et al. (2006) Psychopharmacology; NIMH PDSP.
UPDATE public.ref_substances SET
    rxnorm_cui        = NULL,           -- Not in RxNorm (Schedule I)
    receptor_5ht2a_ki = 50.0,           -- nM
    receptor_5ht1a_ki = 10.0,           -- nM — primary agonist target (contrast to 4-HO/psilocin)
    receptor_5ht2c_ki = 100.0,          -- nM
    receptor_d2_ki    = NULL,
    receptor_sert_ki  = 500.0,          -- nM — weak substrate activity
    receptor_nmda_ki  = NULL
WHERE substance_name = '5-MeO-DMT';

-- ── Ayahuasca (DMT component) ───────────────────────────────────────────────
-- Source: Carbonaro & Gatch (2016) Prog Neuropsychopharmacol Biol Psychiatry.
-- Note: Ayahuasca is a brew; Ki values reflect DMT (primary psychoactive component).
UPDATE public.ref_substances SET
    rxnorm_cui        = NULL,           -- Not in RxNorm (traditional preparation)
    receptor_5ht2a_ki = 50.0,           -- nM (DMT)
    receptor_5ht1a_ki = 150.0,          -- nM (DMT)
    receptor_5ht2c_ki = 100.0,          -- nM (DMT)
    receptor_d2_ki    = NULL,
    receptor_sert_ki  = NULL,
    receptor_nmda_ki  = NULL
WHERE substance_name = 'Ayahuasca';

-- ── Ibogaine ────────────────────────────────────────────────────────────────
-- Source: Popik et al. (1995) Pharmacol Rev; Glick et al. (2002) Neuroscience.
UPDATE public.ref_substances SET
    rxnorm_cui        = NULL,           -- Not in RxNorm (Schedule I in US)
    receptor_5ht2a_ki = 200.0,          -- nM
    receptor_5ht1a_ki = NULL,
    receptor_5ht2c_ki = NULL,
    receptor_d2_ki    = 500.0,          -- nM
    receptor_sert_ki  = 800.0,          -- nM
    receptor_nmda_ki  = 2000.0          -- nM — clinically relevant NMDA antagonism
WHERE substance_name = 'Ibogaine';

-- ── Mescaline ───────────────────────────────────────────────────────────────
-- Source: Glennon et al. (1984) J Med Chem; NIMH PDSP.
UPDATE public.ref_substances SET
    rxnorm_cui        = NULL,           -- Not in RxNorm (Schedule I)
    receptor_5ht2a_ki = 200.0,          -- nM
    receptor_5ht1a_ki = 400.0,          -- nM
    receptor_5ht2c_ki = 300.0,          -- nM
    receptor_d2_ki    = NULL,
    receptor_sert_ki  = NULL,
    receptor_nmda_ki  = NULL
WHERE substance_name = 'Mescaline';

-- ── Verification ────────────────────────────────────────────────────────────
-- Run after execution. Confirm all 8 rows have receptor data populated.
-- SELECT substance_name, rxnorm_cui,
--        receptor_5ht2a_ki, receptor_5ht1a_ki, receptor_5ht2c_ki,
--        receptor_d2_ki, receptor_sert_ki, receptor_nmda_ki
-- FROM public.ref_substances
-- ORDER BY substance_name;
-- ────────────────────────────────────────────────────────────────────────────
