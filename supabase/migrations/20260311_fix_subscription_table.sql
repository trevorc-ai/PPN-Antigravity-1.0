-- ============================================================================
-- Migration: 20260311_fix_subscription_table.sql
-- Purpose: 
--   1. Add cancel_at_period_end column to log_subscriptions (missing from schema)
--   2. Add RLS read policy so app can query log_subscriptions via site join
--   3. Drop orphaned log_user_saved_views (0 rows, no app references, no migration file)
-- Pre-flight: All 4 verification queries passed 2026-03-11
-- ============================================================================

-- ============================================================================
-- PART 1: Extend log_subscriptions with missing column
-- ============================================================================

ALTER TABLE public.log_subscriptions
  ADD COLUMN IF NOT EXISTS cancel_at_period_end BOOLEAN DEFAULT false;

COMMENT ON COLUMN public.log_subscriptions.cancel_at_period_end 
  IS 'Whether Stripe will cancel the subscription at the end of current_period_end';

-- ============================================================================
-- PART 2: RLS policy — users can read their own site subscription
-- Join path: auth.uid() → log_user_sites.user_id → site_id → log_subscriptions.site_id
-- ============================================================================

DROP POLICY IF EXISTS "Users can read own site subscription" ON public.log_subscriptions;
CREATE POLICY "Users can read own site subscription"
  ON public.log_subscriptions
  FOR SELECT
  TO authenticated
  USING (
    site_id IN (
      SELECT site_id 
      FROM public.log_user_sites
      WHERE user_id = auth.uid()
    )
  );

-- Service role can manage all subscriptions (for Stripe webhook writes)
DROP POLICY IF EXISTS "Service role manages all subscriptions" ON public.log_subscriptions;
CREATE POLICY "Service role manages all subscriptions"
  ON public.log_subscriptions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- PART 3: Drop orphaned table
-- Confirmed: 0 rows, no migration file, no src/ references
-- Was intended for custom partner demo pages — feature was never built
-- ============================================================================

DROP TABLE IF EXISTS public.log_user_saved_views CASCADE;

-- ============================================================================
-- VERIFICATION (run after applying migration)
-- ============================================================================
-- 1. Confirm cancel_at_period_end was added:
--    SELECT column_name FROM information_schema.columns 
--    WHERE table_name = 'log_subscriptions' AND column_name = 'cancel_at_period_end';
--
-- 2. Confirm log_user_saved_views is gone:
--    SELECT to_regclass('public.log_user_saved_views');
--    Expected: NULL
--
-- 3. Confirm RLS policy exists:
--    SELECT policyname FROM pg_policies 
--    WHERE tablename = 'log_subscriptions';
-- ============================================================================
