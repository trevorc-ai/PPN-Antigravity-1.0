---
id: WO-226
title: "SOOP: Create ref_medications Table"
status: 05_USER_REVIEW
owner: USER
priority: HIGH
created: 2026-02-19
failure_count: 0
ref_tables_affected: ref_medications (new)
depends_on: none
---

# WO-226: Create ref_medications Table

## Context

The Interaction Checker's Secondary Agent (Medication) dropdown fetches from `ref_medications`.
This table does **not exist** in the live database (confirmed via live schema query 2026-02-19).
Migration `004_create_medications_table.sql` was written as an intention but was never executed.

The Interaction Checker component already has the correct query wired:
```typescript
supabase.from('ref_medications')
  .select('medication_id, medication_name, medication_category')
  .eq('is_active', true)
```

This table must exist and be seeded before that dropdown can populate.

---

## SOOP Pre-Flight Required

Before writing SQL, SOOP must confirm the following via live Supabase query:

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'ref_medications';
```

Expected: 0 rows (table does not exist). Paste result in implementation notes.

---

## Work: Single Migration

**File:** `migrations/060_create_ref_medications.sql`

### Schema

```sql
-- =====================================================
-- Migration: 060_create_ref_medications.sql
-- Purpose: Create ref_medications with medication_category
--          for Interaction Checker Secondary Agent dropdown.
-- Strategy: Additive only. Idempotent. Safe to re-run.
-- Live schema verified: 2026-02-19
-- =====================================================

CREATE TABLE IF NOT EXISTS public.ref_medications (
  medication_id   BIGSERIAL PRIMARY KEY,
  medication_name TEXT NOT NULL UNIQUE,
  medication_category VARCHAR(50),
  is_active       BOOLEAN DEFAULT true,
  rxnorm_cui      VARCHAR(20),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.ref_medications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ref_medications_read" ON public.ref_medications;
CREATE POLICY "ref_medications_read" ON public.ref_medications
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "ref_medications_admin_write" ON public.ref_medications;
CREATE POLICY "ref_medications_admin_write" ON public.ref_medications
  FOR INSERT WITH CHECK (auth.role() = 'service_role');
```

### Seed Data (35 medications across 9 clinical categories)

```sql
INSERT INTO public.ref_medications (medication_name, medication_category) VALUES
  -- SSRI/SNRI
  ('Fluoxetine (Prozac)', 'SSRI/SNRI'),
  ('Sertraline (Zoloft)', 'SSRI/SNRI'),
  ('Citalopram (Celexa)', 'SSRI/SNRI'),
  ('Escitalopram (Lexapro)', 'SSRI/SNRI'),
  ('Paroxetine (Paxil)', 'SSRI/SNRI'),
  ('Venlafaxine (Effexor)', 'SSRI/SNRI'),
  ('Duloxetine (Cymbalta)', 'SSRI/SNRI'),
  -- MAOI
  ('Phenelzine (Nardil)', 'MAOI'),
  ('Tranylcypromine (Parnate)', 'MAOI'),
  ('Selegiline (Emsam)', 'MAOI'),
  -- Mood Stabilizer
  ('Lithium', 'Mood Stabilizer'),
  ('Valproate (Depakote)', 'Mood Stabilizer'),
  ('Lamotrigine (Lamictal)', 'Mood Stabilizer'),
  ('Carbamazepine (Tegretol)', 'Mood Stabilizer'),
  -- Benzodiazepine
  ('Alprazolam (Xanax)', 'Benzodiazepine'),
  ('Clonazepam (Klonopin)', 'Benzodiazepine'),
  ('Diazepam (Valium)', 'Benzodiazepine'),
  ('Lorazepam (Ativan)', 'Benzodiazepine'),
  -- Antipsychotic
  ('Quetiapine (Seroquel)', 'Antipsychotic'),
  ('Olanzapine (Zyprexa)', 'Antipsychotic'),
  ('Risperidone (Risperdal)', 'Antipsychotic'),
  ('Aripiprazole (Abilify)', 'Antipsychotic'),
  -- Stimulant
  ('Amphetamine/Dextroamphetamine (Adderall)', 'Stimulant'),
  ('Methylphenidate (Ritalin)', 'Stimulant'),
  ('Lisdexamfetamine (Vyvanse)', 'Stimulant'),
  ('Modafinil (Provigil)', 'Stimulant'),
  -- Cardiovascular
  ('Propranolol', 'Cardiovascular'),
  ('Atenolol', 'Cardiovascular'),
  ('Atorvastatin', 'Cardiovascular'),
  ('Simvastatin', 'Cardiovascular'),
  ('Lisinopril', 'Cardiovascular'),
  -- Other Somatic
  ('Levothyroxine', 'Other Somatic'),
  ('Metformin', 'Other Somatic'),
  ('Omeprazole', 'Other Somatic'),
  -- Other Psychiatric
  ('Bupropion (Wellbutrin)', 'Other Psychiatric'),
  ('Trazodone', 'Other Psychiatric'),
  ('Buspirone', 'Other Psychiatric'),
  ('Gabapentin', 'Other Psychiatric'),
  ('Pregabalin (Lyrica)', 'Other Psychiatric')
ON CONFLICT (medication_name) DO UPDATE SET
  medication_category = EXCLUDED.medication_category;

CREATE INDEX IF NOT EXISTS idx_medications_category
  ON public.ref_medications(medication_category);

CREATE INDEX IF NOT EXISTS idx_medications_active
  ON public.ref_medications(is_active);
```

### Verification Query (run after migration)

```sql
SELECT medication_category, COUNT(*) as count
FROM public.ref_medications
GROUP BY medication_category
ORDER BY medication_category;
-- Expected: 9 categories, 39 total rows
```

---

## Acceptance Criteria

- [ ] `ref_medications` table created with RLS enabled
- [ ] SELECT policy exists for authenticated users
- [ ] 39 rows inserted across 9 categories
- [ ] `medication_category` column populated on all rows
- [ ] Indexes created on `medication_category` and `is_active`
- [ ] Migration is idempotent (safe to re-run: ON CONFLICT DO UPDATE)

## Notes

- This table feeds the InteractionChecker Secondary Agent dropdown directly
- Also used by Tab2_Medications.tsx in Protocol Builder (shared ref table)
- Adding new medications in future = INSERT a row to this table. No code deploy.
- BUILDER does not need to change any code — component is already wired correctly
