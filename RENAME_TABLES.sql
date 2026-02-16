-- ============================================
-- RENAME TABLES TO ADD log_ PREFIX
-- ============================================
-- Execute these commands in Supabase SQL Editor
-- ============================================

-- 1. Rename patient_site_links to log_patient_site_links
ALTER TABLE patient_site_links RENAME TO log_patient_site_links;

-- 2. Rename protocols to log_protocols
ALTER TABLE protocols RENAME TO log_protocols;

-- 3. Rename sites to log_sites
ALTER TABLE sites RENAME TO log_sites;

-- 4. Rename subscriptions to log_subscriptions
ALTER TABLE subscriptions RENAME TO log_subscriptions;

-- 5. Rename system_events to log_system_events
ALTER TABLE system_events RENAME TO log_system_events;

-- 6. Rename usage_metrics to log_usage_metrics
ALTER TABLE usage_metrics RENAME TO log_usage_metrics;

-- 7. Rename user_profiles to log_user_profiles
ALTER TABLE user_profiles RENAME TO log_user_profiles;

-- 8. Rename user_saved_views to log_user_saved_views
ALTER TABLE user_saved_views RENAME TO log_user_saved_views;

-- 9. Rename user_sites to log_user_sites
ALTER TABLE user_sites RENAME TO log_user_sites;

-- 10. Rename user_subscriptions to log_user_subscriptions
ALTER TABLE user_subscriptions RENAME TO log_user_subscriptions;

-- 11. Rename feature_flags to log_feature_flags
ALTER TABLE feature_flags RENAME TO log_feature_flags;

-- ============================================
-- VERIFICATION QUERY
-- ============================================
-- Run this after renaming to verify all tables have log_ prefix:
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename NOT LIKE 'ref_%'
  AND tablename NOT LIKE 'log_%'
  AND tablename NOT LIKE '_%'
ORDER BY tablename;
-- This should return 0 rows if all tables are correctly named
