-- ============================================
-- SIMPLIFIED RLS POLICIES FOR RENAMED TABLES
-- ============================================
-- This script creates minimal RLS policies for renamed tables
-- Uses actual column names from the schema
-- ============================================

-- STEP 1: Enable RLS on all renamed tables
-- ============================================
ALTER TABLE log_user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE log_user_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE log_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE log_protocols ENABLE ROW LEVEL SECURITY;
ALTER TABLE log_system_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE log_usage_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE log_user_saved_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE log_user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE log_feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE log_patient_site_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE log_subscriptions ENABLE ROW LEVEL SECURITY;

-- STEP 2: Drop ALL existing policies (clean slate)
-- ============================================
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT schemaname, tablename, policyname
        FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename LIKE 'log_%'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
            r.policyname, r.schemaname, r.tablename);
        RAISE NOTICE 'Dropped policy % on %.%', r.policyname, r.schemaname, r.tablename;
    END LOOP;
END $$;

-- STEP 3: Create minimal RLS policies
-- ============================================

-- log_user_profiles: Users can only see/edit their own profile
CREATE POLICY "user_profiles_select" ON log_user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "user_profiles_update" ON log_user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "user_profiles_insert" ON log_user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- log_user_sites: Users can only see their own site assignments
CREATE POLICY "user_sites_all" ON log_user_sites
    FOR ALL USING (auth.uid() = user_id);

-- log_sites: Users can view sites they're assigned to
CREATE POLICY "sites_select" ON log_sites
    FOR SELECT USING (
        site_id IN (
            SELECT site_id FROM log_user_sites WHERE user_id = auth.uid()
        )
    );

-- log_protocols: Users can view/edit protocols from their sites or created by them
CREATE POLICY "protocols_select" ON log_protocols
    FOR SELECT USING (
        site_id IN (
            SELECT site_id FROM log_user_sites WHERE user_id = auth.uid()
        )
        OR created_by = auth.uid()
    );

CREATE POLICY "protocols_insert" ON log_protocols
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "protocols_update" ON log_protocols
    FOR UPDATE USING (auth.uid() = created_by);

-- log_system_events: All authenticated users can view
CREATE POLICY "system_events_select" ON log_system_events
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- log_usage_metrics: Users can only see their own metrics
CREATE POLICY "usage_metrics_select" ON log_usage_metrics
    FOR SELECT USING (auth.uid() = user_id);

-- log_user_saved_views: Users can manage their own saved views
CREATE POLICY "user_saved_views_all" ON log_user_saved_views
    FOR ALL USING (auth.uid() = user_id);

-- log_user_subscriptions: Users can manage their own subscriptions
CREATE POLICY "user_subscriptions_all" ON log_user_subscriptions
    FOR ALL USING (auth.uid() = user_id);

-- log_feature_flags: All authenticated users can view
CREATE POLICY "feature_flags_select" ON log_feature_flags
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- log_patient_site_links: Users can view links for their assigned sites
CREATE POLICY "patient_site_links_select" ON log_patient_site_links
    FOR SELECT USING (
        site_id IN (
            SELECT site_id FROM log_user_sites WHERE user_id = auth.uid()
        )
    );

-- log_subscriptions: Users can view their own subscriptions
CREATE POLICY "subscriptions_select" ON log_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- VERIFICATION
-- ============================================
-- Check RLS is enabled on all log_ tables
SELECT 
    tablename,
    rowsecurity as rls_enabled,
    (SELECT COUNT(*) FROM pg_policies WHERE tablename = t.tablename) as policy_count
FROM pg_tables t
WHERE schemaname = 'public'
  AND tablename LIKE 'log_%'
ORDER BY tablename;
