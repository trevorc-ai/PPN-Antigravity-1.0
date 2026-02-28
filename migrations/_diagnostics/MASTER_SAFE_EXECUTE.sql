-- ============================================================================
-- MASTER SAFE EXECUTION SCRIPT
-- ============================================================================
-- Purpose: Execute all safe migrations in one go (Common Meds + Test Data)
-- Created: 2026-02-14
-- Author: SOOP
-- 
-- INSTRUCTIONS:
-- 1. Copy ALL content below
-- 2. Go to Supabase Dashboard -> SQL Editor
-- 3. Paste and Run
-- ============================================================================

BEGIN;

-- ============================================================================
-- PART 1: MIGRATION 021 (Add is_common flag to medications)
-- ============================================================================

-- Add is_common column
ALTER TABLE public.ref_medications 
ADD COLUMN IF NOT EXISTS is_common BOOLEAN DEFAULT false;

-- Mark the top 12 most commonly prescribed psychiatric/psychedelic-adjacent medications
UPDATE public.ref_medications
SET is_common = true
WHERE medication_name IN (
    'Sertraline (Zoloft)',
    'Escitalopram (Lexapro)',
    'Fluoxetine (Prozac)',
    'Bupropion (Wellbutrin)',
    'Venlafaxine (Effexor)',
    'Alprazolam (Xanax)',
    'Lorazepam (Ativan)',
    'Clonazepam (Klonopin)',
    'Quetiapine (Seroquel)',
    'Lamotrigine (Lamictal)',
    'Lithium',
    'Amphetamine/Dextroamphetamine (Adderall)'
);

-- Create index for faster filtering
CREATE INDEX IF NOT EXISTS idx_medications_is_common 
ON public.ref_medications(is_common) 
WHERE is_common = true;


-- ============================================================================
-- PART 2: MIGRATION 999 (Load Test Data)
-- ============================================================================

-- 1. Create Test User
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'test.data@ppn-test.local',
  crypt('TestPassword123!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. Create Test Site
INSERT INTO sites (site_id, site_name, city, state, country, created_at)
VALUES (
  999,
  'TEST SITE - DO NOT USE',
  'Test City',
  'CA',
  'USA',
  NOW()
)
ON CONFLICT (site_id) DO NOTHING;

-- 3. Link Test User
INSERT INTO user_sites (user_id, site_id, role, created_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  999,
  'clinician',
  NOW()
)
ON CONFLICT (user_id, site_id) DO NOTHING;

-- 4. Load Test Patients
INSERT INTO patients (subject_id, age_range, sex, site_id, created_at)
VALUES
  ('TEST-PT-001', '18-25', 'Female', 999, NOW()),
  ('TEST-PT-002', '18-25', 'Male', 999, NOW()),
  ('TEST-PT-003', '18-25', 'Non-binary', 999, NOW()),
  ('TEST-PT-004', '26-40', 'Female', 999, NOW()),
  ('TEST-PT-005', '26-40', 'Male', 999, NOW()),
  ('TEST-PT-006', '26-40', 'Non-binary', 999, NOW()),
  ('TEST-PT-007', '26-40', 'Female', 999, NOW()),
  ('TEST-PT-008', '26-40', 'Male', 999, NOW()),
  ('TEST-PT-009', '26-40', 'Female', 999, NOW()),
  ('TEST-PT-010', '26-40', 'Male', 999, NOW()),
  ('TEST-PT-011', '41-60', 'Female', 999, NOW()),
  ('TEST-PT-012', '41-60', 'Male', 999, NOW()),
  ('TEST-PT-013', '41-60', 'Female', 999, NOW()),
  ('TEST-PT-014', '41-60', 'Male', 999, NOW()),
  ('TEST-PT-015', '41-60', 'Non-binary', 999, NOW()),
  ('TEST-PT-016', '41-60', 'Female', 999, NOW()),
  ('TEST-PT-017', '41-60', 'Male', 999, NOW()),
  ('TEST-PT-018', '41-60', 'Female', 999, NOW()),
  ('TEST-PT-019', '60+', 'Female', 999, NOW()),
  ('TEST-PT-020', '60+', 'Male', 999, NOW()),
  ('TEST-PT-021', '60+', 'Female', 999, NOW()),
  ('TEST-PT-022', '60+', 'Male', 999, NOW()),
  ('TEST-PT-023', '60+', 'Female', 999, NOW()),
  ('TEST-PT-024', '26-40', 'Female', 999, NOW()),
  ('TEST-PT-025', '41-60', 'Male', 999, NOW()),
  ('TEST-PT-026', '18-25', 'Female', 999, NOW()),
  ('TEST-PT-027', '26-40', 'Male', 999, NOW()),
  ('TEST-PT-028', '41-60', 'Female', 999, NOW()),
  ('TEST-PT-029', '60+', 'Male', 999, NOW()),
  ('TEST-PT-030', '26-40', 'Non-binary', 999, NOW())
ON CONFLICT (subject_id) DO NOTHING;

-- 5. Load Test Protocols
-- (Abbreviated insert for clarity - using a selection of protocols to ensure variety)

-- Psilocybin / MDD / Remission
INSERT INTO protocols (protocol_id, subject_id, substance_id, indication_id, dosage_mg, route_id, frequency_id, session_date, phq9_baseline, phq9_post, created_by, site_id, created_at)
VALUES (gen_random_uuid(), 'TEST-PT-001', (SELECT substance_id FROM ref_substances WHERE substance_name = 'Psilocybin'), (SELECT indication_id FROM ref_indications WHERE indication_name = 'Major Depressive Disorder'), 25.0, (SELECT route_id FROM ref_routes WHERE route_name = 'Oral (capsule)'), (SELECT frequency_id FROM ref_frequencies WHERE frequency_name = 'Single session'), NOW() - INTERVAL '30 days', 18, 3, '00000000-0000-0000-0000-000000000001', 999, NOW() - INTERVAL '30 days');

-- MDMA / PTSD / Remission
INSERT INTO protocols (protocol_id, subject_id, substance_id, indication_id, dosage_mg, route_id, frequency_id, session_date, phq9_baseline, phq9_post, created_by, site_id, created_at)
VALUES (gen_random_uuid(), 'TEST-PT-009', (SELECT substance_id FROM ref_substances WHERE substance_name = 'MDMA'), (SELECT indication_id FROM ref_indications WHERE indication_name = 'Post-Traumatic Stress Disorder'), 120.0, (SELECT route_id FROM ref_routes WHERE route_name = 'Oral (capsule)'), (SELECT frequency_id FROM ref_frequencies WHERE frequency_name = 'Monthly'), NOW() - INTERVAL '28 days', 23, 5, '00000000-0000-0000-0000-000000000001', 999, NOW() - INTERVAL '28 days');

-- Ketamine / TRD / Remission (IV)
INSERT INTO protocols (protocol_id, subject_id, substance_id, indication_id, dosage_mg, route_id, frequency_id, session_date, phq9_baseline, phq9_post, created_by, site_id, created_at)
VALUES (gen_random_uuid(), 'TEST-PT-017', (SELECT substance_id FROM ref_substances WHERE substance_name = 'Ketamine'), (SELECT indication_id FROM ref_indications WHERE indication_name = 'Treatment-Resistant Depression'), 35.0, (SELECT route_id FROM ref_routes WHERE route_name = 'Intravenous (IV)'), (SELECT frequency_id FROM ref_frequencies WHERE frequency_name = 'Weekly'), NOW() - INTERVAL '26 days', 24, 4, '00000000-0000-0000-0000-000000000001', 999, NOW() - INTERVAL '26 days');

-- LSD / MDD / Remission
INSERT INTO protocols (protocol_id, subject_id, substance_id, indication_id, dosage_mg, route_id, frequency_id, session_date, phq9_baseline, phq9_post, created_by, site_id, created_at)
VALUES (gen_random_uuid(), 'TEST-PT-024', (SELECT substance_id FROM ref_substances WHERE substance_name = 'LSD'), (SELECT indication_id FROM ref_indications WHERE indication_name = 'Major Depressive Disorder'), 200.0, (SELECT route_id FROM ref_routes WHERE route_name = 'Sublingual'), (SELECT frequency_id FROM ref_frequencies WHERE frequency_name = 'Monthly'), NOW() - INTERVAL '24 days', 21, 5, '00000000-0000-0000-0000-000000000001', 999, NOW() - INTERVAL '24 days');

-- Adverse Event Protocol
INSERT INTO protocols (protocol_id, subject_id, substance_id, indication_id, dosage_mg, route_id, frequency_id, session_date, phq9_baseline, phq9_post, adverse_events, created_by, site_id, created_at)
VALUES (gen_random_uuid(), 'TEST-PT-020', (SELECT substance_id FROM ref_substances WHERE substance_name = 'Ketamine'), (SELECT indication_id FROM ref_indications WHERE indication_name = 'Post-Traumatic Stress Disorder'), 50.0, (SELECT route_id FROM ref_routes WHERE route_name = 'Intravenous (IV)'), (SELECT frequency_id FROM ref_frequencies WHERE frequency_name = 'Single session'), NOW() - INTERVAL '9 days', 22, 14, 'Patient experienced dissociation and brief hypertension (BP 160/95). Monitored closely, resolved within 2 hours.', '00000000-0000-0000-0000-000000000001', 999, NOW() - INTERVAL '9 days');

COMMIT;
