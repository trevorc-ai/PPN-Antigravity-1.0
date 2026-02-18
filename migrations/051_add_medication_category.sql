-- =====================================================
-- Migration: 051_add_medication_category.sql
-- Purpose: Add medication_category to ref_medications
--          and back-fill all 35 existing rows.
--          Enables Interaction Checker to use live DB
--          instead of hardcoded constants (WO-096).
-- Strategy: Additive only. Idempotent. Safe to re-run.
-- =====================================================

-- Step 1: Add category column
ALTER TABLE public.ref_medications
  ADD COLUMN IF NOT EXISTS medication_category VARCHAR(50);

-- Step 2: Back-fill all 35 existing rows by category

UPDATE public.ref_medications SET medication_category = 'SSRI/SNRI'
WHERE medication_name IN (
  'Fluoxetine (Prozac)',
  'Sertraline (Zoloft)',
  'Citalopram (Celexa)',
  'Escitalopram (Lexapro)',
  'Paroxetine (Paxil)',
  'Venlafaxine (Effexor)',
  'Duloxetine (Cymbalta)'
);

UPDATE public.ref_medications SET medication_category = 'MAOI'
WHERE medication_name IN (
  'Phenelzine (Nardil)',
  'Tranylcypromine (Parnate)',
  'Selegiline (Emsam)'
);

UPDATE public.ref_medications SET medication_category = 'Mood Stabilizer'
WHERE medication_name IN (
  'Lithium',
  'Valproate (Depakote)',
  'Lamotrigine (Lamictal)',
  'Carbamazepine (Tegretol)'
);

UPDATE public.ref_medications SET medication_category = 'Benzodiazepine'
WHERE medication_name IN (
  'Alprazolam (Xanax)',
  'Clonazepam (Klonopin)',
  'Diazepam (Valium)',
  'Lorazepam (Ativan)'
);

UPDATE public.ref_medications SET medication_category = 'Antipsychotic'
WHERE medication_name IN (
  'Quetiapine (Seroquel)',
  'Olanzapine (Zyprexa)',
  'Risperidone (Risperdal)',
  'Aripiprazole (Abilify)'
);

UPDATE public.ref_medications SET medication_category = 'Stimulant'
WHERE medication_name IN (
  'Amphetamine/Dextroamphetamine (Adderall)',
  'Methylphenidate (Ritalin)',
  'Lisdexamfetamine (Vyvanse)',
  'Modafinil (Provigil)'
);

UPDATE public.ref_medications SET medication_category = 'Cardiovascular'
WHERE medication_name IN (
  'Propranolol',
  'Atenolol',
  'Atorvastatin',
  'Simvastatin',
  'Lisinopril'
);

UPDATE public.ref_medications SET medication_category = 'Other Somatic'
WHERE medication_name IN (
  'Levothyroxine',
  'Metformin',
  'Omeprazole'
);

UPDATE public.ref_medications SET medication_category = 'Other Psychiatric'
WHERE medication_name IN (
  'Bupropion (Wellbutrin)',
  'Trazodone',
  'Buspirone',
  'Gabapentin',
  'Pregabalin (Lyrica)'
);

-- Step 3: Index for fast category filtering
CREATE INDEX IF NOT EXISTS idx_medications_category
  ON public.ref_medications(medication_category);

-- Step 4: Verification query (run manually to confirm)
-- SELECT medication_category, COUNT(*), array_agg(medication_name ORDER BY medication_name)
-- FROM public.ref_medications
-- GROUP BY medication_category
-- ORDER BY medication_category;

-- =====================================================
-- Expected result: 35 rows across 9 categories
--   SSRI/SNRI: 7
--   MAOI: 3
--   Mood Stabilizer: 4
--   Benzodiazepine: 4
--   Antipsychotic: 4
--   Stimulant: 4
--   Cardiovascular: 5
--   Other Somatic: 3
--   Other Psychiatric: 5
-- =====================================================
