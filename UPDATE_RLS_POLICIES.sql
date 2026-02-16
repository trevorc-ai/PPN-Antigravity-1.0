-- ============================================
-- UPDATE RLS POLICIES FOR RENAMED TABLES
-- ============================================
-- After renaming tables, RLS policies still reference old names
-- This script recreates all RLS policies with correct table names
-- ============================================

-- STEP 1: Drop old policies (they reference old table names)
-- ============================================

-- Drop policies for log_user_profiles (formerly user_profiles)
DROP POLICY IF EXISTS "Users can view their own profile" ON log_user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON log_user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON log_user_profiles;

-- Drop policies for log_user_sites (formerly user_sites)
DROP POLICY IF EXISTS "Users can view their own sites" ON log_user_sites;
DROP POLICY IF EXISTS "Users can manage their own sites" ON log_user_sites;

-- Drop policies for log_sites (formerly sites)
DROP POLICY IF EXISTS "Users can view sites they belong to" ON log_sites;
DROP POLICY IF EXISTS "Site admins can manage their sites" ON log_sites;

-- Drop policies for log_protocols (formerly protocols)
DROP POLICY IF EXISTS "Users can view protocols from their sites" ON log_protocols;
DROP POLICY IF EXISTS "Users can create protocols" ON log_protocols;
DROP POLICY IF EXISTS "Users can update their own protocols" ON log_protocols;

-- Drop policies for log_system_events (formerly system_events)
DROP POLICY IF EXISTS "Users can view system events" ON log_system_events;

-- Drop policies for log_usage_metrics (formerly usage_metrics)
DROP POLICY IF EXISTS "Users can view their own usage metrics" ON log_usage_metrics;

-- Drop policies for log_user_saved_views (formerly user_saved_views)
DROP POLICY IF EXISTS "Users can manage their own saved views" ON log_user_saved_views;

-- Drop policies for log_user_subscriptions (formerly user_subscriptions)
DROP POLICY IF EXISTS "Users can manage their own subscriptions" ON log_user_subscriptions;

-- Drop policies for log_feature_flags (formerly feature_flags)
DROP POLICY IF EXISTS "Users can view feature flags" ON log_feature_flags;

-- Drop policies for log_patient_site_links (formerly patient_site_links)
DROP POLICY IF EXISTS "Users can view patient links for their sites" ON log_patient_site_links;


-- STEP 2: Recreate policies with correct table names
-- ============================================

-- RLS for log_user_profiles
ALTER TABLE log_user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
ON log_user_profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON log_user_profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON log_user_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS for log_user_sites
ALTER TABLE log_user_sites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sites"
ON log_user_sites FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own sites"
ON log_user_sites FOR ALL
USING (auth.uid() = user_id);

-- RLS for log_sites
ALTER TABLE log_sites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view sites they belong to"
ON log_sites FOR SELECT
USING (
    site_id IN (
        SELECT site_id FROM log_user_sites WHERE user_id = auth.uid()
    )
);

-- RLS for log_protocols
ALTER TABLE log_protocols ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view protocols from their sites"
ON log_protocols FOR SELECT
USING (
    site_id IN (
        SELECT site_id FROM log_user_sites WHERE user_id = auth.uid()
    )
    OR created_by = auth.uid()
);

CREATE POLICY "Users can create protocols"
ON log_protocols FOR INSERT
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own protocols"
ON log_protocols FOR UPDATE
USING (auth.uid() = created_by);

-- RLS for log_system_events
ALTER TABLE log_system_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view system events"
ON log_system_events FOR SELECT
USING (auth.uid() IS NOT NULL);

-- RLS for log_usage_metrics
ALTER TABLE log_usage_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own usage metrics"
ON log_usage_metrics FOR SELECT
USING (auth.uid() = user_id);

-- RLS for log_user_saved_views
ALTER TABLE log_user_saved_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own saved views"
ON log_user_saved_views FOR ALL
USING (auth.uid() = user_id);

-- RLS for log_user_subscriptions
ALTER TABLE log_user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own subscriptions"
ON log_user_subscriptions FOR ALL
USING (auth.uid() = user_id);

-- RLS for log_feature_flags
ALTER TABLE log_feature_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view feature flags"
ON log_feature_flags FOR SELECT
USING (auth.uid() IS NOT NULL);

-- RLS for log_patient_site_links
ALTER TABLE log_patient_site_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view patient links for their sites"
ON log_patient_site_links FOR SELECT
USING (
    site_id IN (
        SELECT site_id FROM log_user_sites WHERE user_id = auth.uid()
    )
);

-- ============================================
-- VERIFICATION QUERY
-- ============================================
-- Check that all renamed tables have RLS enabled:
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename LIKE 'log_%'
ORDER BY tablename;
