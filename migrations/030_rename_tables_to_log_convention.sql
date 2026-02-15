-- Migration: Rename all data tables to follow log_ convention
-- Date: 2026-02-15
-- Purpose: Enforce SQL best practice - all data tables must start with log_

-- CRITICAL: This migration renames 16 tables and updates all foreign key references
-- Run this AFTER backing up your database

BEGIN;

-- 1. Rename tables (order matters for foreign key dependencies)
ALTER TABLE IF EXISTS public.sites RENAME TO log_sites;
ALTER TABLE IF EXISTS public.patient_site_links RENAME TO log_patient_site_links;
ALTER TABLE IF EXISTS public.protocols RENAME TO log_protocols;
ALTER TABLE IF EXISTS public.user_sites RENAME TO log_user_sites;
ALTER TABLE IF EXISTS public.user_profiles RENAME TO log_user_profiles;
ALTER TABLE IF EXISTS public.user_subscriptions RENAME TO log_user_subscriptions;
ALTER TABLE IF EXISTS public.user_saved_views RENAME TO log_user_saved_views;
ALTER TABLE IF EXISTS public.user_protocol_preferences RENAME TO log_user_protocol_preferences;
ALTER TABLE IF EXISTS public.system_events RENAME TO log_system_events;
ALTER TABLE IF EXISTS public.subscriptions RENAME TO log_subscriptions;
ALTER TABLE IF EXISTS public.usage_metrics RENAME TO log_usage_metrics;
ALTER TABLE IF EXISTS public.insurance_policies RENAME TO log_insurance_policies;
ALTER TABLE IF EXISTS public.insurance_claims RENAME TO log_insurance_claims;
ALTER TABLE IF EXISTS public.data_export_requests RENAME TO log_data_export_requests;
ALTER TABLE IF EXISTS public.data_export_audit RENAME TO log_data_export_audit;
ALTER TABLE IF EXISTS public.data_import_jobs RENAME TO log_data_import_jobs;
ALTER TABLE IF EXISTS public.import_column_mappings RENAME TO log_import_column_mappings;
ALTER TABLE IF EXISTS public.feature_flags RENAME TO log_feature_flags;

-- 2. Update RLS policies (they reference table names)
-- Note: Policies are automatically renamed with tables in PostgreSQL

-- 3. Update indexes (they are automatically renamed with tables)

-- 4. Add comments for documentation
COMMENT ON TABLE public.log_sites IS 'Clinical sites/locations (renamed from sites)';
COMMENT ON TABLE public.log_user_sites IS 'User-site associations (renamed from user_sites)';
COMMENT ON TABLE public.log_user_profiles IS 'User profile data (renamed from user_profiles)';
COMMENT ON TABLE public.log_user_subscriptions IS 'User subscription records (renamed from user_subscriptions)';
COMMENT ON TABLE public.log_user_saved_views IS 'User saved view preferences (renamed from user_saved_views)';
COMMENT ON TABLE public.log_user_protocol_preferences IS 'User protocol preferences (renamed from user_protocol_preferences)';
COMMENT ON TABLE public.log_system_events IS 'System event log (renamed from system_events)';
COMMENT ON TABLE public.log_subscriptions IS 'Subscription records (renamed from subscriptions)';
COMMENT ON TABLE public.log_usage_metrics IS 'Usage metrics log (renamed from usage_metrics)';
COMMENT ON TABLE public.log_insurance_policies IS 'Insurance policy records (renamed from insurance_policies)';
COMMENT ON TABLE public.log_insurance_claims IS 'Insurance claim records (renamed from insurance_claims)';
COMMENT ON TABLE public.log_data_export_requests IS 'Data export request log (renamed from data_export_requests)';
COMMENT ON TABLE public.log_data_export_audit IS 'Data export audit trail (renamed from data_export_audit)';
COMMENT ON TABLE public.log_data_import_jobs IS 'Data import job log (renamed from data_import_jobs)';
COMMENT ON TABLE public.log_import_column_mappings IS 'Import column mapping records (renamed from import_column_mappings)';
COMMENT ON TABLE public.log_feature_flags IS 'Feature flag configuration (renamed from feature_flags)';

COMMIT;

-- Verification queries
SELECT 'Migration complete. Verify renamed tables:' AS status;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name LIKE 'log_%'
ORDER BY table_name;
