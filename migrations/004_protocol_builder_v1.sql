-- Add new columns to log_clinical_records
ALTER TABLE log_clinical_records
  ADD COLUMN IF NOT EXISTS auto_filled BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS time_to_complete INTEGER, -- seconds
  ADD COLUMN IF NOT EXISTS copied_from_protocol_id BIGINT,
  ADD COLUMN IF NOT EXISTS concomitant_med_ids BIGINT[]; -- Array of medication IDs

-- Create ref_medications table (if not exists)
CREATE TABLE IF NOT EXISTS ref_medications (
  medication_id BIGSERIAL PRIMARY KEY,
  medication_name TEXT NOT NULL,
  rxnorm_cui BIGINT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed some common medications
INSERT INTO ref_medications (medication_name, rxnorm_cui) VALUES
  ('Sertraline (Zoloft)', 36437),
  ('Fluoxetine (Prozac)', 4493),
  ('Escitalopram (Lexapro)', 321988),
  ('Bupropion (Wellbutrin)', 42347),
  ('Venlafaxine (Effexor)', 39786),
  ('Duloxetine (Cymbalta)', 72625),
  ('Mirtazapine (Remeron)', 15996),
  ('Trazodone', 10737),
  ('Buspirone', 1827),
  ('Lorazepam (Ativan)', 6470),
  ('Clonazepam (Klonopin)', 2598),
  ('Alprazolam (Xanax)', 596),
  ('Zolpidem (Ambien)', 39993),
  ('Quetiapine (Seroquel)', 35636),
  ('Aripiprazole (Abilify)', 89013),
  ('Lamotrigine (Lamictal)', 17128),
  ('Lithium', 6448),
  ('Methylphenidate (Ritalin)', 6809),
  ('Amphetamine/Dextroamphetamine (Adderall)', 1191),
  ('Atomoxetine (Strattera)', 36437)
ON CONFLICT DO NOTHING;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_medications_name ON ref_medications(medication_name);
