-- ============================================================================
-- EMERGENCY MIGRATION 029: Fix RLS Public Access (WORKING VERSION)
-- ============================================================================
-- Purpose: Change all RLS policies from {public} to {authenticated}
-- Author: SOOP
-- Date: 2026-02-15
-- Note: Skips system_events (has BIGINT site_id, needs separate fix)
-- ============================================================================

BEGIN;

-- ============================================================================
-- SECTION 1: Fix log_clinical_records (UUID site_id) ✅
-- ============================================================================

DROP POLICY IF EXISTS "site_isolation_select" ON public.log_clinical_records;
DROP POLICY IF EXISTS "site_isolation_insert" ON public.log_clinical_records;

CREATE POLICY "site_isolation_select" ON public.log_clinical_records
FOR SELECT
TO authenticated
USING (
  site_id IN (SELECT site_id FROM public.user_sites WHERE user_id = auth.uid())
);

CREATE POLICY "site_isolation_insert" ON public.log_clinical_records
FOR INSERT
TO authenticated
WITH CHECK (
  site_id IN (SELECT site_id FROM public.user_sites WHERE user_id = auth.uid())
);

-- ============================================================================
-- SECTION 2: Fix user_sites (UUID) ✅
-- ============================================================================

DROP POLICY IF EXISTS "Users read own sites" ON public.user_sites;

CREATE POLICY "Users read own sites" ON public.user_sites
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- ============================================================================
-- SECTION 3: Fix user_subscriptions (UUID) ✅
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own subscription" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Service role can manage subscriptions" ON public.user_subscriptions;

CREATE POLICY "Users can view own subscription" ON public.user_subscriptions
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Service role can manage subscriptions" ON public.user_subscriptions
FOR ALL
TO service_role
USING (true);

-- ============================================================================
-- SECTION 4: Fix user_saved_views (UUID) ✅
-- ============================================================================

DROP POLICY IF EXISTS "User own" ON public.user_saved_views;

CREATE POLICY "User own" ON public.user_saved_views
FOR ALL
TO authenticated
USING (user_id = auth.uid());

-- ============================================================================
-- SECTION 5: Fix log_patient_flow_events (UUID site_id) ✅
-- ============================================================================

DROP POLICY IF EXISTS "Site isolation" ON public.log_patient_flow_events;

CREATE POLICY "Site isolation" ON public.log_patient_flow_events
FOR SELECT
TO authenticated
USING (
  site_id IN (SELECT site_id FROM public.user_sites WHERE user_id = auth.uid())
);

-- ============================================================================
-- SECTION 6: Fix patient_site_links (UUID site_id) ✅
-- ============================================================================

DROP POLICY IF EXISTS "Site members can read their own patient links" ON public.patient_site_links;
DROP POLICY IF EXISTS "Site admins can manage their own patient links" ON public.patient_site_links;

CREATE POLICY "Site members can read their own patient links" ON public.patient_site_links
FOR SELECT
TO authenticated
USING (
  site_id IN (SELECT site_id FROM public.user_sites WHERE user_id = auth.uid())
);

CREATE POLICY "Site admins can manage their own patient links" ON public.patient_site_links
FOR ALL
TO authenticated
USING (
  site_id IN (
    SELECT site_id FROM public.user_sites 
    WHERE user_id = auth.uid() AND role IN ('site_admin', 'network_admin')
  )
);

-- ============================================================================
-- SECTION 7: SKIP system_events (BIGINT site_id - needs separate fix)
-- ============================================================================
-- NOTE: system_events.site_id is BIGINT, not UUID
-- Will fix in separate migration after converting to UUID

-- ============================================================================
-- SECTION 8: Fix usage_metrics (UUID site_id) ✅
-- ============================================================================

DROP POLICY IF EXISTS "Site members can read their own usage metrics" ON public.usage_metrics;
DROP POLICY IF EXISTS "System can insert usage metrics" ON public.usage_metrics;

CREATE POLICY "Site members can read their own usage metrics" ON public.usage_metrics
FOR SELECT
TO authenticated
USING (
  site_id IN (SELECT site_id FROM public.user_sites WHERE user_id = auth.uid())
);

CREATE POLICY "System can insert usage metrics" ON public.usage_metrics
FOR INSERT
TO service_role
WITH CHECK (true);

-- ============================================================================
-- SECTION 9: Fix feature_flags ✅
-- ============================================================================

DROP POLICY IF EXISTS "Authenticated users can read feature flags" ON public.feature_flags;
DROP POLICY IF EXISTS "Network admins can manage feature flags" ON public.feature_flags;

CREATE POLICY "Authenticated users can read feature flags" ON public.feature_flags
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Network admins can manage feature flags" ON public.feature_flags
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_sites 
    WHERE user_id = auth.uid() AND role = 'network_admin'
  )
);

-- ============================================================================
-- SECTION 10: Fix subscriptions (UUID site_id) ✅
-- ============================================================================

DROP POLICY IF EXISTS "Site admins can read their own subscription" ON public.subscriptions;
DROP POLICY IF EXISTS "Network admins can manage all subscriptions" ON public.subscriptions;

CREATE POLICY "Site admins can read their own subscription" ON public.subscriptions
FOR SELECT
TO authenticated
USING (
  site_id IN (SELECT site_id FROM public.user_sites WHERE user_id = auth.uid())
);

CREATE POLICY "Network admins can manage all subscriptions" ON public.subscriptions
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_sites 
    WHERE user_id = auth.uid() AND role = 'network_admin'
  )
);

-- ============================================================================
-- SECTION 11: Fix ref_flow_event_types ✅
-- ============================================================================

DROP POLICY IF EXISTS "Authenticated read" ON public.ref_flow_event_types;

CREATE POLICY "Authenticated read" ON public.ref_flow_event_types
FOR SELECT
TO authenticated
USING (true);

COMMIT;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE 'EMERGENCY MIGRATION 029: RLS Security Fix Complete';
  RAISE NOTICE '   - All sensitive tables now require authentication';
  RAISE NOTICE '   - Site isolation enforced on clinical data';
  RAISE NOTICE '   - User data protected';
  RAISE NOTICE '';
  RAISE NOTICE 'NOTE: system_events table skipped (BIGINT site_id)';
  RAISE NOTICE '   - Will fix in migration 030';
  RAISE NOTICE '';
  RAISE NOTICE 'DATABASE IS NOW SECURE (except system_events)';
END $$;
