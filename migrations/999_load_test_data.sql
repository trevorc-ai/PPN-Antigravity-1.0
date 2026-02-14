-- ============================================
-- TEST DATA LOADING SCRIPT
-- ============================================
-- Purpose: Load comprehensive test data for Protocol Builder testing
-- Created: 2026-02-13
-- Author: SOOP
-- 
-- REMOVAL: See cleanup script at bottom of file
-- ============================================

BEGIN;

-- ============================================
-- 1. CREATE TEST USER
-- ============================================
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

-- ============================================
-- 2. CREATE TEST SITE
-- ============================================
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

-- ============================================
-- 3. LINK TEST USER TO TEST SITE
-- ============================================
INSERT INTO user_sites (user_id, site_id, role, created_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  999,
  'clinician',
  NOW()
)
ON CONFLICT (user_id, site_id) DO NOTHING;

-- ============================================
-- 4. LOAD TEST PATIENTS (30 patients with demographic variety)
-- ============================================
INSERT INTO patients (subject_id, age_range, sex, site_id, created_at)
VALUES
  -- Age 18-25
  ('TEST-PT-001', '18-25', 'Female', 999, NOW()),
  ('TEST-PT-002', '18-25', 'Male', 999, NOW()),
  ('TEST-PT-003', '18-25', 'Non-binary', 999, NOW()),
  
  -- Age 26-40
  ('TEST-PT-004', '26-40', 'Female', 999, NOW()),
  ('TEST-PT-005', '26-40', 'Male', 999, NOW()),
  ('TEST-PT-006', '26-40', 'Non-binary', 999, NOW()),
  ('TEST-PT-007', '26-40', 'Female', 999, NOW()),
  ('TEST-PT-008', '26-40', 'Male', 999, NOW()),
  ('TEST-PT-009', '26-40', 'Female', 999, NOW()),
  ('TEST-PT-010', '26-40', 'Male', 999, NOW()),
  
  -- Age 41-60
  ('TEST-PT-011', '41-60', 'Female', 999, NOW()),
  ('TEST-PT-012', '41-60', 'Male', 999, NOW()),
  ('TEST-PT-013', '41-60', 'Female', 999, NOW()),
  ('TEST-PT-014', '41-60', 'Male', 999, NOW()),
  ('TEST-PT-015', '41-60', 'Non-binary', 999, NOW()),
  ('TEST-PT-016', '41-60', 'Female', 999, NOW()),
  ('TEST-PT-017', '41-60', 'Male', 999, NOW()),
  ('TEST-PT-018', '41-60', 'Female', 999, NOW()),
  
  -- Age 60+
  ('TEST-PT-019', '60+', 'Female', 999, NOW()),
  ('TEST-PT-020', '60+', 'Male', 999, NOW()),
  ('TEST-PT-021', '60+', 'Female', 999, NOW()),
  ('TEST-PT-022', '60+', 'Male', 999, NOW()),
  ('TEST-PT-023', '60+', 'Female', 999, NOW()),
  
  -- Additional patients for variety
  ('TEST-PT-024', '26-40', 'Female', 999, NOW()),
  ('TEST-PT-025', '41-60', 'Male', 999, NOW()),
  ('TEST-PT-026', '18-25', 'Female', 999, NOW()),
  ('TEST-PT-027', '26-40', 'Male', 999, NOW()),
  ('TEST-PT-028', '41-60', 'Female', 999, NOW()),
  ('TEST-PT-029', '60+', 'Male', 999, NOW()),
  ('TEST-PT-030', '26-40', 'Non-binary', 999, NOW())
ON CONFLICT (subject_id) DO NOTHING;

-- ============================================
-- 5. LOAD TEST PROTOCOLS (30 protocols with full variety)
-- ============================================

-- PSILOCYBIN PROTOCOLS (8 protocols)
-- Protocol 1: Psilocybin for MDD - Excellent outcome (Remission)
INSERT INTO protocols (
  protocol_id, subject_id, substance_id, indication_id, dosage_mg, route_id, frequency_id,
  session_date, phq9_baseline, phq9_post, adverse_events, created_by, site_id, created_at
)
VALUES (
  gen_random_uuid(),
  'TEST-PT-001',
  (SELECT substance_id FROM ref_substances WHERE substance_name = 'Psilocybin'),
  (SELECT indication_id FROM ref_indications WHERE indication_name = 'Major Depressive Disorder'),
  25.0,
  (SELECT route_id FROM ref_routes WHERE route_name = 'Oral (capsule)'),
  (SELECT frequency_id FROM ref_frequencies WHERE frequency_name = 'Single session'),
  NOW() - INTERVAL '30 days',
  18, -- Baseline: Moderate-severe depression
  3,  -- Post: Minimal depression - REMISSION!
  NULL,
  '00000000-0000-0000-0000-000000000001',
  999,
  NOW() - INTERVAL '30 days'
);

-- Protocol 2: Psilocybin for PTSD - Good outcome
INSERT INTO protocols (
  protocol_id, subject_id, substance_id, indication_id, dosage_mg, route_id, frequency_id,
  session_date, phq9_baseline, phq9_post, adverse_events, created_by, site_id, created_at
)
VALUES (
  gen_random_uuid(),
  'TEST-PT-002',
  (SELECT substance_id FROM ref_substances WHERE substance_name = 'Psilocybin'),
  (SELECT indication_id FROM ref_indications WHERE indication_name = 'Post-Traumatic Stress Disorder'),
  30.0,
  (SELECT route_id FROM ref_routes WHERE route_name = 'Oral (capsule)'),
  (SELECT frequency_id FROM ref_frequencies WHERE frequency_name = 'Weekly'),
  NOW() - INTERVAL '25 days',
  20,
  8,
  NULL,
  '00000000-0000-0000-0000-000000000001',
  999,
  NOW() - INTERVAL '25 days'
);

-- Protocol 3: Psilocybin for GAD - Moderate outcome
INSERT INTO protocols (
  protocol_id, subject_id, substance_id, indication_id, dosage_mg, route_id, frequency_id,
  session_date, phq9_baseline, phq9_post, adverse_events, created_by, site_id, created_at
)
VALUES (
  gen_random_uuid(),
  'TEST-PT-003',
  (SELECT substance_id FROM ref_substances WHERE substance_name = 'Psilocybin'),
  (SELECT indication_id FROM ref_indications WHERE indication_name = 'Generalized Anxiety Disorder'),
  15.0, -- Low dose
  (SELECT route_id FROM ref_routes WHERE route_name = 'Oral (liquid)'),
  (SELECT frequency_id FROM ref_frequencies WHERE frequency_name = 'Bi-weekly'),
  NOW() - INTERVAL '20 days',
  15,
  10,
  NULL,
  '00000000-0000-0000-0000-000000000001',
  999,
  NOW() - INTERVAL '20 days'
);

-- Protocol 4: Psilocybin for OCD - Poor outcome (no improvement)
INSERT INTO protocols (
  protocol_id, subject_id, substance_id, indication_id, dosage_mg, route_id, frequency_id,
  session_date, phq9_baseline, phq9_post, adverse_events, created_by, site_id, created_at
)
VALUES (
  gen_random_uuid(),
  'TEST-PT-004',
  (SELECT substance_id FROM ref_substances WHERE substance_name = 'Psilocybin'),
  (SELECT indication_id FROM ref_indications WHERE indication_name = 'Obsessive-Compulsive Disorder'),
  20.0,
  (SELECT route_id FROM ref_routes WHERE route_name = 'Oral (capsule)'),
  (SELECT frequency_id FROM ref_frequencies WHERE frequency_name = 'Single session'),
  NOW() - INTERVAL '15 days',
  16,
  15, -- Minimal improvement
  NULL,
  '00000000-0000-0000-0000-000000000001',
  999,
  NOW() - INTERVAL '15 days'
);

-- Protocol 5: Psilocybin for TRD - Excellent outcome
INSERT INTO protocols (
  protocol_id, subject_id, substance_id, indication_id, dosage_mg, route_id, frequency_id,
  session_date, phq9_baseline, phq9_post, adverse_events, created_by, site_id, created_at
)
VALUES (
  gen_random_uuid(),
  'TEST-PT-005',
  (SELECT substance_id FROM ref_substances WHERE substance_name = 'Psilocybin'),
  (SELECT indication_id FROM ref_indications WHERE indication_name = 'Treatment-Resistant Depression'),
  35.0, -- High dose
  (SELECT route_id FROM ref_routes WHERE route_name = 'Oral (capsule)'),
  (SELECT frequency_id FROM ref_frequencies WHERE frequency_name = 'Weekly'),
  NOW() - INTERVAL '10 days',
  22, -- Severe depression
  4,  -- Minimal - REMISSION!
  NULL,
  '00000000-0000-0000-0000-000000000001',
  999,
  NOW() - INTERVAL '10 days'
);

-- Protocol 6: Psilocybin for MDD - With ADVERSE EVENT
INSERT INTO protocols (
  protocol_id, subject_id, substance_id, indication_id, dosage_mg, route_id, frequency_id,
  session_date, phq9_baseline, phq9_post, adverse_events, created_by, site_id, created_at
)
VALUES (
  gen_random_uuid(),
  'TEST-PT-006',
  (SELECT substance_id FROM ref_substances WHERE substance_name = 'Psilocybin'),
  (SELECT indication_id FROM ref_indications WHERE indication_name = 'Major Depressive Disorder'),
  40.0, -- Very high dose
  (SELECT route_id FROM ref_routes WHERE route_name = 'Oral (capsule)'),
  (SELECT frequency_id FROM ref_frequencies WHERE frequency_name = 'Single session'),
  NOW() - INTERVAL '7 days',
  19,
  12,
  'Severe nausea and vomiting during session. Patient experienced prolonged anxiety for 48 hours post-session.',
  '00000000-0000-0000-0000-000000000001',
  999,
  NOW() - INTERVAL '7 days'
);

-- Protocol 7: Psilocybin for GAD - Recent (last 3 days)
INSERT INTO protocols (
  protocol_id, subject_id, substance_id, indication_id, dosage_mg, route_id, frequency_id,
  session_date, phq9_baseline, phq9_post, adverse_events, created_by, site_id, created_at
)
VALUES (
  gen_random_uuid(),
  'TEST-PT-007',
  (SELECT substance_id FROM ref_substances WHERE substance_name = 'Psilocybin'),
  (SELECT indication_id FROM ref_indications WHERE indication_name = 'Generalized Anxiety Disorder'),
  28.0,
  (SELECT route_id FROM ref_routes WHERE route_name = 'Oral (liquid)'),
  (SELECT frequency_id FROM ref_frequencies WHERE frequency_name = 'Monthly'),
  NOW() - INTERVAL '3 days',
  17,
  6,
  NULL,
  '00000000-0000-0000-0000-000000000001',
  999,
  NOW() - INTERVAL '3 days'
);

-- Protocol 8: Psilocybin for PTSD - Old (90 days ago)
INSERT INTO protocols (
  protocol_id, subject_id, substance_id, indication_id, dosage_mg, route_id, frequency_id,
  session_date, phq9_baseline, phq9_post, adverse_events, created_by, site_id, created_at
)
VALUES (
  gen_random_uuid(),
  'TEST-PT-008',
  (SELECT substance_id FROM ref_substances WHERE substance_name = 'Psilocybin'),
  (SELECT indication_id FROM ref_indications WHERE indication_name = 'Post-Traumatic Stress Disorder'),
  32.0,
  (SELECT route_id FROM ref_routes WHERE route_name = 'Oral (capsule)'),
  (SELECT frequency_id FROM ref_frequencies WHERE frequency_name = 'Bi-weekly'),
  NOW() - INTERVAL '90 days',
  21,
  7,
  NULL,
  '00000000-0000-0000-0000-000000000001',
  999,
  NOW() - INTERVAL '90 days'
);

-- MDMA PROTOCOLS (8 protocols)
-- Protocol 9: MDMA for PTSD - Excellent outcome
INSERT INTO protocols (
  protocol_id, subject_id, substance_id, indication_id, dosage_mg, route_id, frequency_id,
  session_date, phq9_baseline, phq9_post, adverse_events, created_by, site_id, created_at
)
VALUES (
  gen_random_uuid(),
  'TEST-PT-009',
  (SELECT substance_id FROM ref_substances WHERE substance_name = 'MDMA'),
  (SELECT indication_id FROM ref_indications WHERE indication_name = 'Post-Traumatic Stress Disorder'),
  120.0,
  (SELECT route_id FROM ref_routes WHERE route_name = 'Oral (capsule)'),
  (SELECT frequency_id FROM ref_frequencies WHERE frequency_name = 'Monthly'),
  NOW() - INTERVAL '28 days',
  23, -- Severe PTSD
  5,  -- Minimal - REMISSION!
  NULL,
  '00000000-0000-0000-0000-000000000001',
  999,
  NOW() - INTERVAL '28 days'
);

-- Protocol 10: MDMA for MDD - Good outcome
INSERT INTO protocols (
  protocol_id, subject_id, substance_id, indication_id, dosage_mg, route_id, frequency_id,
  session_date, phq9_baseline, phq9_post, adverse_events, created_by, site_id, created_at
)
VALUES (
  gen_random_uuid(),
  'TEST-PT-010',
  (SELECT substance_id FROM ref_substances WHERE substance_name = 'MDMA'),
  (SELECT indication_id FROM ref_indications WHERE indication_name = 'Major Depressive Disorder'),
  100.0,
  (SELECT route_id FROM ref_routes WHERE route_name = 'Oral (capsule)'),
  (SELECT frequency_id FROM ref_frequencies WHERE frequency_name = 'Weekly'),
  NOW() - INTERVAL '22 days',
  18,
  9,
  NULL,
  '00000000-0000-0000-0000-000000000001',
  999,
  NOW() - INTERVAL '22 days'
);

-- Protocol 11: MDMA for GAD - Moderate outcome
INSERT INTO protocols (
  protocol_id, subject_id, substance_id, indication_id, dosage_mg, route_id, frequency_id,
  session_date, phq9_baseline, phq9_post, adverse_events, created_by, site_id, created_at
)
VALUES (
  gen_random_uuid(),
  'TEST-PT-011',
  (SELECT substance_id FROM ref_substances WHERE substance_name = 'MDMA'),
  (SELECT indication_id FROM ref_indications WHERE indication_name = 'Generalized Anxiety Disorder'),
  80.0, -- Lower dose
  (SELECT route_id FROM ref_routes WHERE route_name = 'Oral (liquid)'),
  (SELECT frequency_id FROM ref_frequencies WHERE frequency_name = 'Bi-weekly'),
  NOW() - INTERVAL '18 days',
  14,
  11,
  NULL,
  '00000000-0000-0000-0000-000000000001',
  999,
  NOW() - INTERVAL '18 days'
);

-- Protocol 12: MDMA for PTSD - With ADVERSE EVENT
INSERT INTO protocols (
  protocol_id, subject_id, substance_id, indication_id, dosage_mg, route_id, frequency_id,
  session_date, phq9_baseline, phq9_post, adverse_events, created_by, site_id, created_at
)
VALUES (
  gen_random_uuid(),
  'TEST-PT-012',
  (SELECT substance_id FROM ref_substances WHERE substance_name = 'MDMA'),
  (SELECT indication_id FROM ref_indications WHERE indication_name = 'Post-Traumatic Stress Disorder'),
  140.0, -- High dose
  (SELECT route_id FROM ref_routes WHERE route_name = 'Oral (capsule)'),
  (SELECT frequency_id FROM ref_frequencies WHERE frequency_name = 'Single session'),
  NOW() - INTERVAL '12 days',
  20,
  13,
  'Patient experienced tachycardia (HR 140 bpm) during session. Resolved with supportive care. Mild jaw clenching reported.',
  '00000000-0000-0000-0000-000000000001',
  999,
  NOW() - INTERVAL '12 days'
);

-- Protocol 13: MDMA for OCD - Poor outcome
INSERT INTO protocols (
  protocol_id, subject_id, substance_id, indication_id, dosage_mg, route_id, frequency_id,
  session_date, phq9_baseline, phq9_post, adverse_events, created_by, site_id, created_at
)
VALUES (
  gen_random_uuid(),
  'TEST-PT-013',
  (SELECT substance_id FROM ref_substances WHERE substance_name = 'MDMA'),
  (SELECT indication_id FROM ref_indications WHERE indication_name = 'Obsessive-Compulsive Disorder'),
  110.0,
  (SELECT route_id FROM ref_routes WHERE route_name = 'Oral (capsule)'),
  (SELECT frequency_id FROM ref_frequencies WHERE frequency_name = 'Weekly'),
  NOW() - INTERVAL '8 days',
  17,
  16, -- Minimal improvement
  NULL,
  '00000000-0000-0000-0000-000000000001',
  999,
  NOW() - INTERVAL '8 days'
);

-- Protocol 14: MDMA for TRD - Good outcome
INSERT INTO protocols (
  protocol_id, subject_id, substance_id, indication_id, dosage_mg, route_id, frequency_id,
  session_date, phq9_baseline, phq9_post, adverse_events, created_by, site_id, created_at
)
VALUES (
  gen_random_uuid(),
  'TEST-PT-014',
  (SELECT substance_id FROM ref_substances WHERE substance_name = 'MDMA'),
  (SELECT indication_id FROM ref_indications WHERE indication_name = 'Treatment-Resistant Depression'),
  125.0,
  (SELECT route_id FROM ref_routes WHERE route_name = 'Oral (capsule)'),
  (SELECT frequency_id FROM ref_frequencies WHERE frequency_name = 'Monthly'),
  NOW() - INTERVAL '5 days',
  21,
  8,
  NULL,
  '00000000-0000-0000-0000-000000000001',
  999,
  NOW() - INTERVAL '5 days'
);

-- Protocol 15: MDMA for PTSD - Recent (yesterday)
INSERT INTO protocols (
  protocol_id, subject_id, substance_id, indication_id, dosage_mg, route_id, frequency_id,
  session_date, phq9_baseline, phq9_post, adverse_events, created_by, site_id, created_at
)
VALUES (
  gen_random_uuid(),
  'TEST-PT-015',
  (SELECT substance_id FROM ref_substances WHERE substance_name = 'MDMA'),
  (SELECT indication_id FROM ref_indications WHERE indication_name = 'Post-Traumatic Stress Disorder'),
  115.0,
  (SELECT route_id FROM ref_routes WHERE route_name = 'Oral (capsule)'),
  (SELECT frequency_id FROM ref_frequencies WHERE frequency_name = 'Bi-weekly'),
  NOW() - INTERVAL '1 day',
  19,
  7,
  NULL,
  '00000000-0000-0000-0000-000000000001',
  999,
  NOW() - INTERVAL '1 day'
);

-- Protocol 16: MDMA for MDD - Old (60 days)
INSERT INTO protocols (
  protocol_id, subject_id, substance_id, indication_id, dosage_mg, route_id, frequency_id,
  session_date, phq9_baseline, phq9_post, adverse_events, created_by, site_id, created_at
)
VALUES (
  gen_random_uuid(),
  'TEST-PT-016',
  (SELECT substance_id FROM ref_substances WHERE substance_name = 'MDMA'),
  (SELECT indication_id FROM ref_indications WHERE indication_name = 'Major Depressive Disorder'),
  105.0,
  (SELECT route_id FROM ref_routes WHERE route_name = 'Oral (liquid)'),
  (SELECT frequency_id FROM ref_frequencies WHERE frequency_name = 'Weekly'),
  NOW() - INTERVAL '60 days',
  16,
  6,
  NULL,
  '00000000-0000-0000-0000-000000000001',
  999,
  NOW() - INTERVAL '60 days'
);

-- KETAMINE PROTOCOLS (7 protocols)
-- Protocol 17: Ketamine for TRD - Excellent outcome
INSERT INTO protocols (
  protocol_id, subject_id, substance_id, indication_id, dosage_mg, route_id, frequency_id,
  session_date, phq9_baseline, phq9_post, adverse_events, created_by, site_id, created_at
)
VALUES (
  gen_random_uuid(),
  'TEST-PT-017',
  (SELECT substance_id FROM ref_substances WHERE substance_name = 'Ketamine'),
  (SELECT indication_id FROM ref_indications WHERE indication_name = 'Treatment-Resistant Depression'),
  0.5, -- mg/kg dosing (converted to mg for 70kg patient = 35mg)
  (SELECT route_id FROM ref_routes WHERE route_name = 'Intravenous (IV)'),
  (SELECT frequency_id FROM ref_frequencies WHERE frequency_name = 'Weekly'),
  NOW() - INTERVAL '26 days',
  24, -- Severe TRD
  4,  -- REMISSION!
  NULL,
  '00000000-0000-0000-0000-000000000001',
  999,
  NOW() - INTERVAL '26 days'
);

-- Protocol 18: Ketamine for MDD - Good outcome
INSERT INTO protocols (
  protocol_id, subject_id, substance_id, indication_id, dosage_mg, route_id, frequency_id,
  session_date, phq9_baseline, phq9_post, adverse_events, created_by, site_id, created_at
)
VALUES (
  gen_random_uuid(),
  'TEST-PT-018',
  (SELECT substance_id FROM ref_substances WHERE substance_name = 'Ketamine'),
  (SELECT indication_id FROM ref_indications WHERE indication_name = 'Major Depressive Disorder'),
  40.0,
  (SELECT route_id FROM ref_routes WHERE route_name = 'Intramuscular (IM)'),
  (SELECT frequency_id FROM ref_frequencies WHERE frequency_name = 'Bi-weekly'),
  NOW() - INTERVAL '19 days',
  17,
  8,
  NULL,
  '00000000-0000-0000-0000-000000000001',
  999,
  NOW() - INTERVAL '19 days'
);

-- Protocol 19: Ketamine for GAD - Moderate outcome
INSERT INTO protocols (
  protocol_id, subject_id, substance_id, indication_id, dosage_mg, route_id, frequency_id,
  session_date, phq9_baseline, phq9_post, adverse_events, created_by, site_id, created_at
)
VALUES (
  gen_random_uuid(),
  'TEST-PT-019',
  (SELECT substance_id FROM ref_substances WHERE substance_name = 'Ketamine'),
  (SELECT indication_id FROM ref_indications WHERE indication_name = 'Generalized Anxiety Disorder'),
  30.0,
  (SELECT route_id FROM ref_routes WHERE route_name = 'Sublingual'),
  (SELECT frequency_id FROM ref_frequencies WHERE frequency_name = 'Weekly'),
  NOW() - INTERVAL '14 days',
  15,
  11,
  NULL,
  '00000000-0000-0000-0000-000000000001',
  999,
  NOW() - INTERVAL '14 days'
);

-- Protocol 20: Ketamine for PTSD - With ADVERSE EVENT
INSERT INTO protocols (
  protocol_id, subject_id, substance_id, indication_id, dosage_mg, route_id, frequency_id,
  session_date, phq9_baseline, phq9_post, adverse_events, created_by, site_id, created_at
)
VALUES (
  gen_random_uuid(),
  'TEST-PT-020',
  (SELECT substance_id FROM ref_substances WHERE substance_name = 'Ketamine'),
  (SELECT indication_id FROM ref_indications WHERE indication_name = 'Post-Traumatic Stress Disorder'),
  50.0, -- Higher dose
  (SELECT route_id FROM ref_routes WHERE route_name = 'Intravenous (IV)'),
  (SELECT frequency_id FROM ref_frequencies WHERE frequency_name = 'Single session'),
  NOW() - INTERVAL '9 days',
  22,
  14,
  'Patient experienced dissociation and brief hypertension (BP 160/95). Monitored closely, resolved within 2 hours.',
  '00000000-0000-0000-0000-000000000001',
  999,
  NOW() - INTERVAL '9 days'
);

-- Protocol 21: Ketamine for OCD - Poor outcome
INSERT INTO protocols (
  protocol_id, subject_id, substance_id, indication_id, dosage_mg, route_id, frequency_id,
  session_date, phq9_baseline, phq9_post, adverse_events, created_by, site_id, created_at
)
VALUES (
  gen_random_uuid(),
  'TEST-PT-021',
  (SELECT substance_id FROM ref_substances WHERE substance_name = 'Ketamine'),
  (SELECT indication_id FROM ref_indications WHERE indication_name = 'Obsessive-Compulsive Disorder'),
  35.0,
  (SELECT route_id FROM ref_routes WHERE route_name = 'Intramuscular (IM)'),
  (SELECT frequency_id FROM ref_frequencies WHERE frequency_name = 'Weekly'),
  NOW() - INTERVAL '6 days',
  18,
  17, -- Minimal improvement
  NULL,
  '00000000-0000-0000-0000-000000000001',
  999,
  NOW() - INTERVAL '6 days'
);

-- Protocol 22: Ketamine for TRD - Recent (2 days ago)
INSERT INTO protocols (
  protocol_id, subject_id, substance_id, indication_id, dosage_mg, route_id, frequency_id,
  session_date, phq9_baseline, phq9_post, adverse_events, created_by, site_id, created_at
)
VALUES (
  gen_random_uuid(),
  'TEST-PT-022',
  (SELECT substance_id FROM ref_substances WHERE substance_name = 'Ketamine'),
  (SELECT indication_id FROM ref_indications WHERE indication_name = 'Treatment-Resistant Depression'),
  42.0,
  (SELECT route_id FROM ref_routes WHERE route_name = 'Intravenous (IV)'),
  (SELECT frequency_id FROM ref_frequencies WHERE frequency_name = 'Bi-weekly'),
  NOW() - INTERVAL '2 days',
  20,
  7,
  NULL,
  '00000000-0000-0000-0000-000000000001',
  999,
  NOW() - INTERVAL '2 days'
);

-- Protocol 23: Ketamine for MDD - Old (75 days)
INSERT INTO protocols (
  protocol_id, subject_id, substance_id, indication_id, dosage_mg, route_id, frequency_id,
  session_date, phq9_baseline, phq9_post, adverse_events, created_by, site_id, created_at
)
VALUES (
  gen_random_uuid(),
  'TEST-PT-023',
  (SELECT substance_id FROM ref_substances WHERE substance_name = 'Ketamine'),
  (SELECT indication_id FROM ref_indications WHERE indication_name = 'Major Depressive Disorder'),
  38.0,
  (SELECT route_id FROM ref_routes WHERE route_name = 'Sublingual'),
  (SELECT frequency_id FROM ref_frequencies WHERE frequency_name = 'Monthly'),
  NOW() - INTERVAL '75 days',
  19,
  9,
  NULL,
  '00000000-0000-0000-0000-000000000001',
  999,
  NOW() - INTERVAL '75 days'
);

-- LSD PROTOCOLS (7 protocols)
-- Protocol 24: LSD for MDD - Excellent outcome
INSERT INTO protocols (
  protocol_id, subject_id, substance_id, indication_id, dosage_mg, route_id, frequency_id,
  session_date, phq9_baseline, phq9_post, adverse_events, created_by, site_id, created_at
)
VALUES (
  gen_random_uuid(),
  'TEST-PT-024',
  (SELECT substance_id FROM ref_substances WHERE substance_name = 'LSD'),
  (SELECT indication_id FROM ref_indications WHERE indication_name = 'Major Depressive Disorder'),
  200.0, -- micrograms
  (SELECT route_id FROM ref_routes WHERE route_name = 'Sublingual'),
  (SELECT frequency_id FROM ref_frequencies WHERE frequency_name = 'Monthly'),
  NOW() - INTERVAL '24 days',
  21,
  5, -- REMISSION!
  NULL,
  '00000000-0000-0000-0000-000000000001',
  999,
  NOW() - INTERVAL '24 days'
);

-- Protocol 25: LSD for GAD - Good outcome
INSERT INTO protocols (
  protocol_id, subject_id, indication_id, dosage_mg, route_id, frequency_id,
  session_date, phq9_baseline, phq9_post, adverse_events, created_by, site_id, created_at
)
VALUES (
  gen_random_uuid(),
  'TEST-PT-025',
  (SELECT substance_id FROM ref_substances WHERE substance_name = 'LSD'),
  (SELECT indication_id FROM ref_indications WHERE indication_name = 'Generalized Anxiety Disorder'),
  150.0,
  (SELECT route_id FROM ref_routes WHERE route_name = 'Oral (liquid)'),
  (SELECT frequency_id FROM ref_frequencies WHERE frequency_name = 'Bi-weekly'),
  NOW() - INTERVAL '16 days',
  16,
  8,
  NULL,
  '00000000-0000-0000-0000-000000000001',
  999,
  NOW() - INTERVAL '16 days'
);

-- Protocol 26: LSD for PTSD - Moderate outcome
INSERT INTO protocols (
  protocol_id, subject_id, substance_id, indication_id, dosage_mg, route_id, frequency_id,
  session_date, phq9_baseline, phq9_post, adverse_events, created_by, site_id, created_at
)
VALUES (
  gen_random_uuid(),
  'TEST-PT-026',
  (SELECT substance_id FROM ref_substances WHERE substance_name = 'LSD'),
  (SELECT indication_id FROM ref_indications WHERE indication_name = 'Post-Traumatic Stress Disorder'),
  100.0, -- Lower dose
  (SELECT route_id FROM ref_routes WHERE route_name = 'Sublingual'),
  (SELECT frequency_id FROM ref_frequencies WHERE frequency_name = 'Weekly'),
  NOW() - INTERVAL '11 days',
  18,
  13,
  NULL,
  '00000000-0000-0000-0000-000000000001',
  999,
  NOW() - INTERVAL '11 days'
);

-- Protocol 27: LSD for OCD - Poor outcome
INSERT INTO protocols (
  protocol_id, subject_id, substance_id, indication_id, dosage_mg, route_id, frequency_id,
  session_date, phq9_baseline, phq9_post, adverse_events, created_by, site_id, created_at
)
VALUES (
  gen_random_uuid(),
  'TEST-PT-027',
  (SELECT substance_id FROM ref_substances WHERE substance_name = 'LSD'),
  (SELECT indication_id FROM ref_indications WHERE indication_name = 'Obsessive-Compulsive Disorder'),
  175.0,
  (SELECT route_id FROM ref_routes WHERE route_name = 'Oral (liquid)'),
  (SELECT frequency_id FROM ref_frequencies WHERE frequency_name = 'Single session'),
  NOW() - INTERVAL '7 days',
  19,
  18, -- Minimal improvement
  NULL,
  '00000000-0000-0000-0000-000000000001',
  999,
  NOW() - INTERVAL '7 days'
);

-- Protocol 28: LSD for TRD - Good outcome
INSERT INTO protocols (
  protocol_id, subject_id, substance_id, indication_id, dosage_mg, route_id, frequency_id,
  session_date, phq9_baseline, phq9_post, adverse_events, created_by, site_id, created_at
)
VALUES (
  gen_random_uuid(),
  'TEST-PT-028',
  (SELECT substance_id FROM ref_substances WHERE substance_name = 'LSD'),
  (SELECT indication_id FROM ref_indications WHERE indication_name = 'Treatment-Resistant Depression'),
  225.0,
  (SELECT route_id FROM ref_routes WHERE route_name = 'Sublingual'),
  (SELECT frequency_id FROM ref_frequencies WHERE frequency_name = 'Monthly'),
  NOW() - INTERVAL '4 days',
  23,
  9,
  NULL,
  '00000000-0000-0000-0000-000000000001',
  999,
  NOW() - INTERVAL '4 days'
);

-- Protocol 29: LSD for MDD - Recent (today)
INSERT INTO protocols (
  protocol_id, subject_id, substance_id, indication_id, dosage_mg, route_id, frequency_id,
  session_date, phq9_baseline, phq9_post, adverse_events, created_by, site_id, created_at
)
VALUES (
  gen_random_uuid(),
  'TEST-PT-029',
  (SELECT substance_id FROM ref_substances WHERE substance_name = 'LSD'),
  (SELECT indication_id FROM ref_indications WHERE indication_name = 'Major Depressive Disorder'),
  180.0,
  (SELECT route_id FROM ref_routes WHERE route_name = 'Oral (liquid)'),
  (SELECT frequency_id FROM ref_frequencies WHERE frequency_name = 'Weekly'),
  NOW(),
  20,
  NULL, -- No post-treatment score yet (session just completed)
  NULL,
  '00000000-0000-0000-0000-000000000001',
  999,
  NOW()
);

-- Protocol 30: LSD for GAD - Old (85 days)
INSERT INTO protocols (
  protocol_id, subject_id, substance_id, indication_id, dosage_mg, route_id, frequency_id,
  session_date, phq9_baseline, phq9_post, adverse_events, created_by, site_id, created_at
)
VALUES (
  gen_random_uuid(),
  'TEST-PT-030',
  (SELECT substance_id FROM ref_substances WHERE substance_name = 'LSD'),
  (SELECT indication_id FROM ref_indications WHERE indication_name = 'Generalized Anxiety Disorder'),
  160.0,
  (SELECT route_id FROM ref_routes WHERE route_name = 'Sublingual'),
  (SELECT frequency_id FROM ref_frequencies WHERE frequency_name = 'Bi-weekly'),
  NOW() - INTERVAL '85 days',
  14,
  7,
  NULL,
  '00000000-0000-0000-0000-000000000001',
  999,
  NOW() - INTERVAL '85 days'
);

COMMIT;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Count test protocols
SELECT COUNT(*) as test_protocol_count
FROM protocols
WHERE created_by = '00000000-0000-0000-0000-000000000001';

-- Verify substance variety
SELECT s.substance_name, COUNT(*) as protocol_count
FROM protocols p
JOIN ref_substances s ON p.substance_id = s.substance_id
WHERE p.created_by = '00000000-0000-0000-0000-000000000001'
GROUP BY s.substance_name
ORDER BY s.substance_name;

-- Verify indication variety
SELECT i.indication_name, COUNT(*) as protocol_count
FROM protocols p
JOIN ref_indications i ON p.indication_id = i.indication_id
WHERE p.created_by = '00000000-0000-0000-0000-000000000001'
GROUP BY i.indication_name
ORDER BY i.indication_name;

-- Verify outcome variety
SELECT 
  CASE 
    WHEN phq9_post IS NULL THEN 'Pending'
    WHEN phq9_post < 5 THEN 'Remission'
    WHEN phq9_post < phq9_baseline - 5 THEN 'Significant Improvement'
    WHEN phq9_post < phq9_baseline THEN 'Mild Improvement'
    ELSE 'No Improvement'
  END as outcome,
  COUNT(*) as count
FROM protocols
WHERE created_by = '00000000-0000-0000-0000-000000000001'
GROUP BY outcome
ORDER BY outcome;

-- Verify adverse events
SELECT COUNT(*) as adverse_event_count
FROM protocols
WHERE created_by = '00000000-0000-0000-0000-000000000001'
AND adverse_events IS NOT NULL;

-- Verify route variety
SELECT r.route_name, COUNT(*) as protocol_count
FROM protocols p
JOIN ref_routes r ON p.route_id = r.route_id
WHERE p.created_by = '00000000-0000-0000-0000-000000000001'
GROUP BY r.route_name
ORDER BY r.route_name;

-- Verify frequency variety
SELECT f.frequency_name, COUNT(*) as protocol_count
FROM protocols p
JOIN ref_frequencies f ON p.frequency_id = f.frequency_id
WHERE p.created_by = '00000000-0000-0000-0000-000000000001'
GROUP BY f.frequency_name
ORDER BY f.frequency_name;

-- Verify date range
SELECT 
  MIN(session_date) as earliest_session,
  MAX(session_date) as latest_session,
  COUNT(*) as total_protocols
FROM protocols
WHERE created_by = '00000000-0000-0000-0000-000000000001';

-- ============================================
-- CLEANUP SCRIPT (Run this to remove all test data)
-- ============================================

/*
BEGIN;

DELETE FROM protocols WHERE created_by = '00000000-0000-0000-0000-000000000001';
DELETE FROM patients WHERE site_id = 999;
DELETE FROM user_sites WHERE site_id = 999;
DELETE FROM sites WHERE site_id = 999;
DELETE FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000001';

COMMIT;

-- Verify cleanup
SELECT COUNT(*) FROM protocols WHERE created_by = '00000000-0000-0000-0000-000000000001'; -- Should be 0
SELECT COUNT(*) FROM patients WHERE site_id = 999; -- Should be 0
SELECT COUNT(*) FROM sites WHERE site_id = 999; -- Should be 0
*/
