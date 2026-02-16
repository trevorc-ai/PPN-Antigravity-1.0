-- ============================================
-- MINIMAL RLS POLICIES - WORKING VERSION
-- ============================================
-- Based on actual table structure from screenshot
-- ============================================

-- STEP 1: Enable RLS on all renamed tables
ALTER TABLE log_user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE log_user_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE log_sites ENABLE ROW LEVEL SECURITY;

-- STEP 2: Create minimal policies for login to work

-- log_user_profiles: Users can access their own profile
DROP POLICY IF EXISTS "user_profiles_select" ON log_user_profiles;
CREATE POLICY "user_profiles_select" ON log_user_profiles
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_profiles_insert" ON log_user_profiles;
CREATE POLICY "user_profiles_insert" ON log_user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_profiles_update" ON log_user_profiles;
CREATE POLICY "user_profiles_update" ON log_user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- log_user_sites: Users can access their site assignments
DROP POLICY IF EXISTS "user_sites_all" ON log_user_sites;
CREATE POLICY "user_sites_all" ON log_user_sites
    FOR ALL USING (auth.uid() = user_id);

-- log_sites: Users can view sites (simplified - no site filtering for now)
DROP POLICY IF EXISTS "sites_select" ON log_sites;
CREATE POLICY "sites_select" ON log_sites
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- ============================================
-- VERIFICATION
-- ============================================
SELECT 
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('log_user_profiles', 'log_user_sites', 'log_sites')
ORDER BY tablename;
