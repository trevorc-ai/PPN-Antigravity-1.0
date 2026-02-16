-- ============================================
-- QUERY TO CHECK ACTUAL COLUMN NAMES
-- ============================================
-- Run this first to see what columns exist in each table
-- ============================================

-- Check log_sites columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'log_sites'
ORDER BY ordinal_position;

-- Check log_user_sites columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'log_user_sites'
ORDER BY ordinal_position;

-- Check log_protocols columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'log_protocols'
ORDER BY ordinal_position;

-- Check log_patient_site_links columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'log_patient_site_links'
ORDER BY ordinal_position;
