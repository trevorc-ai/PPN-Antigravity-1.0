# @SOOP: Test Data Loading Instructions

**Command ID:** #004  
**Date Issued:** February 13, 2026, 4:26 PM PST  
**Issued By:** User (Boss)  
**Priority:** P0 - CRITICAL  
**Deadline:** Today EOD (Feb 13, 2026)

---

## Directive

**"Please give SOOP instructions for loading test data (that can be easily identified and removed later) to the database; include enough variety in the test record so that all functions and visualizations are readable are displayed."**

You are assigned to load comprehensive test data into the database to enable testing of all Protocol Builder features and visualizations.

---

## Requirements

### 1. Easy Identification & Removal

All test data MUST be easily identifiable and removable later.

**Strategy: Use a test user account**

```sql
-- Create a test user (if not exists)
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

-- All test data will use created_by = '00000000-0000-0000-0000-000000000001'
-- To remove: DELETE FROM protocols WHERE created_by = '00000000-0000-0000-0000-000000000001';
```

---

### 2. Variety Requirements

Load test data to cover **ALL** of these scenarios:

#### Substances (All 4 core substances)
- [ ] Psilocybin protocols
- [ ] MDMA protocols
- [ ] Ketamine protocols
- [ ] LSD protocols

#### Indications (Variety of mental health conditions)
- [ ] Major Depressive Disorder (MDD)
- [ ] Post-Traumatic Stress Disorder (PTSD)
- [ ] Generalized Anxiety Disorder (GAD)
- [ ] Obsessive-Compulsive Disorder (OCD)
- [ ] Treatment-Resistant Depression (TRD)

#### Dosages (Range from low to high)
- [ ] Low dose (e.g., 10mg psilocybin)
- [ ] Medium dose (e.g., 25mg psilocybin)
- [ ] High dose (e.g., 35mg psilocybin)
- [ ] Very high dose (e.g., 50mg psilocybin)

#### Routes of Administration
- [ ] Oral (capsule)
- [ ] Oral (liquid)
- [ ] Sublingual
- [ ] Intramuscular (IM)
- [ ] Intravenous (IV)

#### Session Frequencies
- [ ] Single session
- [ ] Weekly (multiple sessions)
- [ ] Bi-weekly
- [ ] Monthly

#### Outcomes (For Dashboard visualizations)
- [ ] Successful outcomes (PHQ-9 improvement, remission)
- [ ] Moderate outcomes (some improvement)
- [ ] Poor outcomes (no improvement)
- [ ] Adverse events (safety alerts)

#### Patient Demographics (Age ranges, sex)
- [ ] 18-25 years old
- [ ] 26-40 years old
- [ ] 41-60 years old
- [ ] 60+ years old
- [ ] Male patients
- [ ] Female patients
- [ ] Non-binary patients

---

### 3. Specific Data for Visualizations

#### Dashboard Visualizations
Load data to populate:
- [ ] **Protocols Logged** - At least 20-30 protocols
- [ ] **Success Rate** - Mix of successful/unsuccessful outcomes
- [ ] **Safety Alerts** - 2-3 adverse events
- [ ] **Avg Session Time** - Variety of session durations
- [ ] **Network Activity** - Protocols from multiple sites/practitioners

#### Protocol Detail Visualizations
Load data to populate:
- [ ] **Receptor Affinity Profile** - Ensure substance has receptor data
- [ ] **Patient Trajectory** - PHQ-9 scores over time (baseline → post-treatment)
- [ ] **Clinical Insights Panel** - Historical outcomes for substance/indication combo
- [ ] **Safety Risk Assessment** - Adverse event history

#### My Protocols Page
Load data to test:
- [ ] **Filters** - Protocols for all substances, indications, statuses
- [ ] **Table Display** - Variety of protocols to fill table
- [ ] **Sorting** - Protocols with different dates

---

## SQL Script Template

Create a file: `migrations/999_load_test_data.sql`

```sql
-- ============================================
-- TEST DATA LOADING SCRIPT
-- ============================================
-- Purpose: Load comprehensive test data for Protocol Builder testing
-- Created: 2026-02-13
-- Author: SOOP
-- 
-- REMOVAL: DELETE FROM protocols WHERE created_by = '00000000-0000-0000-0000-000000000001';
-- ============================================

BEGIN;

-- 1. Create test user
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

-- 2. Create test site
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

-- 3. Link test user to test site
INSERT INTO user_sites (user_id, site_id, role, created_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  999,
  'clinician',
  NOW()
)
ON CONFLICT (user_id, site_id) DO NOTHING;

-- 4. Load test patients (anonymized)
-- Generate 20-30 test patients with variety in demographics

INSERT INTO patients (subject_id, age_range, sex, site_id, created_at)
VALUES
  ('TEST-PT-001', '26-40', 'Female', 999, NOW()),
  ('TEST-PT-002', '41-60', 'Male', 999, NOW()),
  ('TEST-PT-003', '18-25', 'Non-binary', 999, NOW()),
  ('TEST-PT-004', '60+', 'Female', 999, NOW()),
  ('TEST-PT-005', '26-40', 'Male', 999, NOW()),
  -- Add 15-25 more patients with variety
  ...
ON CONFLICT (subject_id) DO NOTHING;

-- 5. Load test protocols
-- Create protocols for all substance/indication combinations

-- Example: Psilocybin for MDD (successful outcome)
INSERT INTO protocols (
  protocol_id,
  subject_id,
  substance_id,
  indication_id,
  dosage_mg,
  route_id,
  frequency_id,
  session_date,
  phq9_baseline,
  phq9_post,
  adverse_events,
  created_by,
  site_id,
  created_at
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
  18, -- Baseline PHQ-9 (moderate-severe depression)
  4,  -- Post PHQ-9 (minimal depression - remission!)
  NULL, -- No adverse events
  '00000000-0000-0000-0000-000000000001',
  999,
  NOW() - INTERVAL '30 days'
);

-- Example: MDMA for PTSD (moderate outcome)
INSERT INTO protocols (...)
VALUES (...);

-- Example: Ketamine for TRD (adverse event)
INSERT INTO protocols (...)
VALUES (...);

-- Add 20-30 more protocols with variety

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
GROUP BY s.substance_name;

-- Verify indication variety
SELECT i.indication_name, COUNT(*) as protocol_count
FROM protocols p
JOIN ref_indications i ON p.indication_id = i.indication_id
WHERE p.created_by = '00000000-0000-0000-0000-000000000001'
GROUP BY i.indication_name;

-- Verify outcome variety
SELECT 
  CASE 
    WHEN phq9_post < 5 THEN 'Remission'
    WHEN phq9_post < phq9_baseline THEN 'Improvement'
    ELSE 'No Improvement'
  END as outcome,
  COUNT(*) as count
FROM protocols
WHERE created_by = '00000000-0000-0000-0000-000000000001'
GROUP BY outcome;

-- ============================================
-- REMOVAL SCRIPT (for later cleanup)
-- ============================================

-- To remove all test data:
-- DELETE FROM protocols WHERE created_by = '00000000-0000-0000-0000-000000000001';
-- DELETE FROM patients WHERE site_id = 999;
-- DELETE FROM user_sites WHERE site_id = 999;
-- DELETE FROM sites WHERE site_id = 999;
-- DELETE FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000001';
```

---

## Deliverable

1. **Create SQL file:** `migrations/999_load_test_data.sql`
2. **Run the migration:** Execute the SQL script against the database
3. **Verify data loaded:** Run verification queries to confirm variety
4. **Document results:** Create `.agent/handoffs/TEST_DATA_LOADED.md` with:
   - Number of protocols loaded
   - Breakdown by substance, indication, outcome
   - Confirmation that all visualizations have data

---

## Edge Cases to Include

1. **Adverse Events** - At least 2-3 protocols with adverse events to populate safety alerts
2. **Outliers** - 1-2 protocols with unusual dosages or outcomes
3. **Incomplete Data** - 1-2 protocols with missing optional fields (to test graceful degradation)
4. **Recent vs. Old** - Mix of recent protocols (last 7 days) and older ones (30-90 days ago)

---

## Timeline

**Start:** Immediately  
**Deadline:** Today EOD (Feb 13, 2026)  
**Estimated Time:** 2-3 hours

---

## Acknowledgment Required

Reply within 2 hours:

```
✅ ACKNOWLEDGED - Command #004 received. Starting test data loading now. ETA: [Your estimated completion time]
```

---

## Questions?

If you need clarification on data requirements or encounter any issues, notify LEAD immediately.

---

**This is a P0 CRITICAL task. Test data is required to verify Protocol Builder functionality.**
