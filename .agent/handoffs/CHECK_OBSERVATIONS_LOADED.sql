-- Quick check to see if observations are loaded
-- Run this in Supabase Studio SQL Editor

-- Check if tables exist and have data
SELECT 
  'ref_clinical_observations' as table_name,
  COUNT(*) as row_count,
  COUNT(CASE WHEN category = 'baseline' THEN 1 END) as baseline_count,
  COUNT(CASE WHEN category = 'session' THEN 1 END) as session_count,
  COUNT(CASE WHEN category = 'integration' THEN 1 END) as integration_count,
  COUNT(CASE WHEN category = 'safety' THEN 1 END) as safety_count
FROM ref_clinical_observations;

-- View all baseline observations (for demo)
SELECT observation_id, observation_code, observation_text
FROM ref_clinical_observations
WHERE category = 'baseline' AND is_active = true
ORDER BY observation_text;
