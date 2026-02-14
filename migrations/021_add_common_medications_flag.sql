-- 021_add_common_medications_flag.sql
-- Add is_common flag to ref_medications and mark the top 12 most commonly prescribed medications
-- for display in the Protocol Builder "Most Common" section

-- Add is_common column
ALTER TABLE public.ref_medications 
ADD COLUMN IF NOT EXISTS is_common BOOLEAN DEFAULT false;

-- Mark the top 12 most commonly prescribed psychiatric/psychedelic-adjacent medications
-- Based on clinical prevalence in psychedelic therapy patient populations
UPDATE public.ref_medications
SET is_common = true
WHERE medication_name IN (
    'Sertraline (Zoloft)',           -- SSRI - Most prescribed antidepressant
    'Escitalopram (Lexapro)',        -- SSRI - Very common
    'Fluoxetine (Prozac)',           -- SSRI - Classic antidepressant
    'Bupropion (Wellbutrin)',        -- NDRI - Common, fewer interactions
    'Venlafaxine (Effexor)',         -- SNRI - Common for depression/anxiety
    'Alprazolam (Xanax)',            -- Benzodiazepine - Very common for anxiety
    'Lorazepam (Ativan)',            -- Benzodiazepine - Common for anxiety
    'Clonazepam (Klonopin)',         -- Benzodiazepine - Common for anxiety/panic
    'Quetiapine (Seroquel)',         -- Atypical antipsychotic - Common off-label use
    'Lamotrigine (Lamictal)',        -- Mood stabilizer - Common for bipolar
    'Lithium',                       -- Mood stabilizer - Gold standard for bipolar
    'Amphetamine/Dextroamphetamine (Adderall)' -- Stimulant - Very common for ADHD
);

-- Create index for faster filtering by is_common
CREATE INDEX IF NOT EXISTS idx_medications_is_common 
ON public.ref_medications(is_common) 
WHERE is_common = true;

-- Verification query (commented out, for manual testing)
-- SELECT medication_name, is_common 
-- FROM public.ref_medications 
-- WHERE is_common = true 
-- ORDER BY medication_name;
