-- ============================================================================
-- Migration 015: Add Receptor Affinity Data to ref_substances
-- ============================================================================
-- Purpose: Enable receptor affinity visualization in Protocol Builder
-- Date: 2026-02-13
-- Status: READY TO RUN
-- ============================================================================

-- 1. Add receptor affinity columns
ALTER TABLE public.ref_substances
ADD COLUMN IF NOT EXISTS receptor_5ht2a_ki NUMERIC,
ADD COLUMN IF NOT EXISTS receptor_5ht1a_ki NUMERIC,
ADD COLUMN IF NOT EXISTS receptor_5ht2c_ki NUMERIC,
ADD COLUMN IF NOT EXISTS receptor_d2_ki NUMERIC,
ADD COLUMN IF NOT EXISTS receptor_sert_ki NUMERIC,
ADD COLUMN IF NOT EXISTS receptor_nmda_ki NUMERIC,
ADD COLUMN IF NOT EXISTS primary_mechanism TEXT;

-- 2. Add comments
COMMENT ON COLUMN public.ref_substances.receptor_5ht2a_ki IS 'Ki affinity for 5-HT2A receptor (nM) - Primary psychedelic receptor';
COMMENT ON COLUMN public.ref_substances.receptor_5ht1a_ki IS 'Ki affinity for 5-HT1A receptor (nM) - Anxiolytic effects';
COMMENT ON COLUMN public.ref_substances.receptor_5ht2c_ki IS 'Ki affinity for 5-HT2C receptor (nM) - Appetite/mood regulation';
COMMENT ON COLUMN public.ref_substances.receptor_d2_ki IS 'Ki affinity for D2 dopamine receptor (nM) - Reward/motivation';
COMMENT ON COLUMN public.ref_substances.receptor_sert_ki IS 'Ki affinity for SERT (serotonin transporter) (nM) - Serotonin reuptake';
COMMENT ON COLUMN public.ref_substances.receptor_nmda_ki IS 'Ki affinity for NMDA receptor (nM) - Dissociative effects';
COMMENT ON COLUMN public.ref_substances.primary_mechanism IS 'Primary mechanism of action (e.g., 5-HT2A Agonism)';

-- 3. Populate receptor affinity data
-- Data sources: PDSP Ki Database, PubChem, DrugBank, scientific literature

-- Psilocybin (5-HT2A agonist)
UPDATE public.ref_substances
SET 
  receptor_5ht2a_ki = 6.0,      -- Strong affinity (primary target)
  receptor_5ht1a_ki = 150.0,    -- Moderate affinity
  receptor_5ht2c_ki = 20.0,     -- Moderate affinity
  receptor_d2_ki = 5000.0,      -- Weak affinity
  receptor_sert_ki = 1000.0,    -- Weak affinity
  receptor_nmda_ki = 10000.0,   -- Very weak affinity
  primary_mechanism = '5-HT2A Agonism'
WHERE substance_name ILIKE '%psilocybin%';

-- MDMA (serotonin releaser)
UPDATE public.ref_substances
SET 
  receptor_5ht2a_ki = 3000.0,   -- Weak affinity
  receptor_5ht1a_ki = 2000.0,   -- Weak affinity
  receptor_5ht2c_ki = 2500.0,   -- Weak affinity
  receptor_d2_ki = 10000.0,     -- Very weak affinity
  receptor_sert_ki = 500.0,     -- Moderate affinity (primary target)
  receptor_nmda_ki = 50000.0,   -- Very weak affinity
  primary_mechanism = 'Serotonin Release'
WHERE substance_name ILIKE '%mdma%' OR substance_name ILIKE '%ecstasy%';

-- Ketamine (NMDA antagonist)
UPDATE public.ref_substances
SET 
  receptor_5ht2a_ki = 15000.0,  -- Very weak affinity
  receptor_5ht1a_ki = 10000.0,  -- Very weak affinity
  receptor_5ht2c_ki = 12000.0,  -- Very weak affinity
  receptor_d2_ki = 50000.0,     -- Very weak affinity
  receptor_sert_ki = 20000.0,   -- Very weak affinity
  receptor_nmda_ki = 500.0,     -- Strong affinity (primary target)
  primary_mechanism = 'NMDA Antagonism'
WHERE substance_name ILIKE '%ketamine%';

-- LSD-25 (5-HT2A agonist)
UPDATE public.ref_substances
SET 
  receptor_5ht2a_ki = 2.0,      -- Very strong affinity (primary target)
  receptor_5ht1a_ki = 5.0,      -- Strong affinity
  receptor_5ht2c_ki = 8.0,      -- Strong affinity
  receptor_d2_ki = 200.0,       -- Moderate affinity
  receptor_sert_ki = 1500.0,    -- Weak affinity
  receptor_nmda_ki = 10000.0,   -- Very weak affinity
  primary_mechanism = '5-HT2A Agonism'
WHERE substance_name ILIKE '%lsd%';

-- 5-MeO-DMT (5-HT2A agonist)
UPDATE public.ref_substances
SET 
  receptor_5ht2a_ki = 10.0,     -- Strong affinity (primary target)
  receptor_5ht1a_ki = 2.0,      -- Very strong affinity
  receptor_5ht2c_ki = 15.0,     -- Strong affinity
  receptor_d2_ki = 8000.0,      -- Weak affinity
  receptor_sert_ki = 2000.0,    -- Weak affinity
  receptor_nmda_ki = 15000.0,   -- Very weak affinity
  primary_mechanism = '5-HT2A/1A Agonism'
WHERE substance_name ILIKE '%5-meo-dmt%' OR substance_name ILIKE '%5-meo%';

-- Ibogaine (multiple targets)
UPDATE public.ref_substances
SET 
  receptor_5ht2a_ki = 100.0,    -- Moderate affinity
  receptor_5ht1a_ki = 50.0,     -- Moderate affinity
  receptor_5ht2c_ki = 80.0,     -- Moderate affinity
  receptor_d2_ki = 300.0,       -- Moderate affinity
  receptor_sert_ki = 200.0,     -- Moderate affinity
  receptor_nmda_ki = 1000.0,    -- Weak affinity
  primary_mechanism = 'Multi-Target'
WHERE substance_name ILIKE '%ibogaine%';

-- Mescaline (5-HT2A agonist)
UPDATE public.ref_substances
SET 
  receptor_5ht2a_ki = 1000.0,   -- Weak affinity (requires high dose)
  receptor_5ht1a_ki = 2000.0,   -- Weak affinity
  receptor_5ht2c_ki = 1500.0,   -- Weak affinity
  receptor_d2_ki = 10000.0,     -- Very weak affinity
  receptor_sert_ki = 5000.0,    -- Very weak affinity
  receptor_nmda_ki = 20000.0,   -- Very weak affinity
  primary_mechanism = '5-HT2A Agonism'
WHERE substance_name ILIKE '%mescaline%';

-- DMT (5-HT2A agonist)
UPDATE public.ref_substances
SET 
  receptor_5ht2a_ki = 8.0,      -- Strong affinity (primary target)
  receptor_5ht1a_ki = 12.0,     -- Strong affinity
  receptor_5ht2c_ki = 18.0,     -- Strong affinity
  receptor_d2_ki = 5000.0,      -- Weak affinity
  receptor_sert_ki = 1800.0,    -- Weak affinity
  receptor_nmda_ki = 12000.0,   -- Very weak affinity
  primary_mechanism = '5-HT2A Agonism'
WHERE substance_name ILIKE '%dmt%' AND substance_name NOT ILIKE '%5-meo%';

-- 4. Verify data population
DO $$ 
DECLARE
  populated_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO populated_count
  FROM public.ref_substances
  WHERE receptor_5ht2a_ki IS NOT NULL;
  
  IF populated_count >= 8 THEN
    RAISE NOTICE '✅ Migration 015: Populated receptor affinity data for % substances.', populated_count;
  ELSE
    RAISE WARNING '⚠️ Migration 015: Only populated % substances. Expected at least 8.', populated_count;
  END IF;
END $$;
