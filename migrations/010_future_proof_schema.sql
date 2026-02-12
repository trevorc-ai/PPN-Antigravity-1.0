-- ============================================================================
-- MIGRATION: Future-Proof Schema Additions
-- ============================================================================
-- Purpose: Add critical tables and columns to minimize downstream changes
-- Date: 2026-02-11
-- Author: LEAD Architect
-- Priority: P0 - Must run before launch
-- ============================================================================

-- ============================================================================
-- PART 1: Add Missing Columns to log_clinical_records
-- ============================================================================
-- These columns exist in schema but weren't being populated by Protocol Builder

-- Add session_type (required field, was missing)
ALTER TABLE public.log_clinical_records
ADD COLUMN IF NOT EXISTS session_type VARCHAR(50);

-- Backfill existing records with default value
UPDATE public.log_clinical_records
SET session_type = 'Dosing Session'
WHERE session_type IS NULL;

-- Make it NOT NULL going forward
ALTER TABLE public.log_clinical_records
ALTER COLUMN session_type SET NOT NULL;

-- Add protocol_id (different from protocol_template_id)
ALTER TABLE public.log_clinical_records
ADD COLUMN IF NOT EXISTS protocol_id BIGINT;

-- Add outcome_measure (e.g., "PHQ-9", "GAD-7")
ALTER TABLE public.log_clinical_records
ADD COLUMN IF NOT EXISTS outcome_measure VARCHAR(100);

-- Add safety_event_category (e.g., "Cardiovascular", "Psychiatric")
ALTER TABLE public.log_clinical_records
ADD COLUMN IF NOT EXISTS safety_event_category VARCHAR(100);

-- Add clinical_phenotype (e.g., "Treatment-Resistant Depression")
ALTER TABLE public.log_clinical_records
ADD COLUMN IF NOT EXISTS clinical_phenotype TEXT;

COMMENT ON COLUMN public.log_clinical_records.session_type IS 'Type of session: Preparation, Dosing, Integration, Follow-up';
COMMENT ON COLUMN public.log_clinical_records.protocol_id IS 'FK to protocols table (future). Different from protocol_template_id.';
COMMENT ON COLUMN public.log_clinical_records.outcome_measure IS 'Assessment tool used (e.g., PHQ-9, GAD-7, MADRS)';
COMMENT ON COLUMN public.log_clinical_records.safety_event_category IS 'Category of adverse event if applicable';
COMMENT ON COLUMN public.log_clinical_records.clinical_phenotype IS 'Clinical presentation or diagnosis subtype';

-- ============================================================================
-- PART 2: Subscription Management Tables (Stripe Integration)
-- ============================================================================

-- Subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  
  -- Stripe Integration
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT,
  
  -- Subscription Details
  tier TEXT NOT NULL CHECK (tier IN ('solo', 'clinic', 'network', 'research', 'custom')),
  status TEXT NOT NULL CHECK (status IN ('active', 'trialing', 'past_due', 'canceled', 'incomplete')),
  
  -- Billing Periods
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  
  -- Limits (based on tier)
  max_users INTEGER,
  max_sites INTEGER,
  max_records_per_month INTEGER,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  UNIQUE(site_id)
);

COMMENT ON TABLE public.subscriptions IS 'Subscription and billing information for sites';
COMMENT ON COLUMN public.subscriptions.tier IS 'Subscription tier: solo ($99), clinic ($299), network ($999), research (custom)';
COMMENT ON COLUMN public.subscriptions.status IS 'Stripe subscription status';

-- Usage Metrics table (for metered billing and analytics)
CREATE TABLE IF NOT EXISTS public.usage_metrics (
  id BIGSERIAL PRIMARY KEY,
  site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  
  -- Metric Details
  metric_type TEXT NOT NULL CHECK (metric_type IN ('records_created', 'users_active', 'api_calls', 'exports', 'storage_mb')),
  count INTEGER NOT NULL DEFAULT 0,
  
  -- Time Period
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  UNIQUE(site_id, metric_type, period_start, period_end)
);

COMMENT ON TABLE public.usage_metrics IS 'Track usage for billing and analytics';
COMMENT ON COLUMN public.usage_metrics.metric_type IS 'Type of usage being tracked';

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_site_id ON public.subscriptions(site_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer ON public.subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_usage_metrics_site_period ON public.usage_metrics(site_id, period_start, period_end);

-- ============================================================================
-- PART 3: Feature Flags (Gradual Rollout & A/B Testing)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.feature_flags (
  id BIGSERIAL PRIMARY KEY,
  
  -- Flag Identity
  flag_name TEXT UNIQUE NOT NULL,
  description TEXT,
  
  -- Enablement Rules
  enabled_for_all BOOLEAN DEFAULT FALSE,
  enabled_site_ids UUID[] DEFAULT '{}',
  enabled_user_ids UUID[] DEFAULT '{}',
  enabled_tiers TEXT[] DEFAULT '{}', -- e.g., ['network', 'research']
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

COMMENT ON TABLE public.feature_flags IS 'Feature flags for gradual rollouts and A/B testing';
COMMENT ON COLUMN public.feature_flags.flag_name IS 'Unique identifier for the feature (e.g., "bulk_upload", "emr_integration")';
COMMENT ON COLUMN public.feature_flags.enabled_for_all IS 'If true, feature is enabled for everyone';
COMMENT ON COLUMN public.feature_flags.enabled_site_ids IS 'Array of site IDs with access to this feature';
COMMENT ON COLUMN public.feature_flags.enabled_user_ids IS 'Array of user IDs with access to this feature';
COMMENT ON COLUMN public.feature_flags.enabled_tiers IS 'Array of subscription tiers with access (e.g., ["network", "research"])';

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_feature_flags_name ON public.feature_flags(flag_name);

-- ============================================================================
-- PART 4: Patient Site Links (Multi-Site Patient Transfers)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.patient_site_links (
  id BIGSERIAL PRIMARY KEY,
  
  -- Patient & Site
  patient_link_code TEXT NOT NULL,
  site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  
  -- Transfer Tracking
  transferred_from_site_id UUID REFERENCES public.sites(id),
  transfer_date TIMESTAMP WITH TIME ZONE,
  transfer_reason TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  UNIQUE(patient_link_code, site_id)
);

COMMENT ON TABLE public.patient_site_links IS 'Track which patients belong to which sites, including transfers';
COMMENT ON COLUMN public.patient_site_links.patient_link_code IS 'De-identified patient ID (matches log_clinical_records.patient_link_code)';
COMMENT ON COLUMN public.patient_site_links.transferred_from_site_id IS 'Original site if patient was transferred';

-- Index for lookups
CREATE INDEX IF NOT EXISTS idx_patient_site_links_patient ON public.patient_site_links(patient_link_code);
CREATE INDEX IF NOT EXISTS idx_patient_site_links_site ON public.patient_site_links(site_id);

-- ============================================================================
-- PART 5: RLS Policies for New Tables
-- ============================================================================

-- Subscriptions: Site admins can read their own, network admins can read all
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Site admins can read their own subscription"
  ON public.subscriptions
  FOR SELECT
  USING (
    site_id IN (
      SELECT site_id FROM public.user_sites WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Network admins can manage all subscriptions"
  ON public.subscriptions
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_sites
      WHERE user_id = auth.uid() AND role = 'network_admin'
    )
  );

-- Usage Metrics: Site members can read their own
ALTER TABLE public.usage_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Site members can read their own usage metrics"
  ON public.usage_metrics
  FOR SELECT
  USING (
    site_id IN (
      SELECT site_id FROM public.user_sites WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert usage metrics"
  ON public.usage_metrics
  FOR INSERT
  WITH CHECK (true); -- Allow system inserts (via service role)

-- Feature Flags: All authenticated users can read
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read feature flags"
  ON public.feature_flags
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Network admins can manage feature flags"
  ON public.feature_flags
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_sites
      WHERE user_id = auth.uid() AND role = 'network_admin'
    )
  );

-- Patient Site Links: Site members can read their own
ALTER TABLE public.patient_site_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Site members can read their own patient links"
  ON public.patient_site_links
  FOR SELECT
  USING (
    site_id IN (
      SELECT site_id FROM public.user_sites WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Site admins can manage their own patient links"
  ON public.patient_site_links
  FOR ALL
  USING (
    site_id IN (
      SELECT site_id FROM public.user_sites 
      WHERE user_id = auth.uid() AND role IN ('site_admin', 'network_admin')
    )
  );

-- ============================================================================
-- PART 6: Seed Initial Feature Flags
-- ============================================================================

INSERT INTO public.feature_flags (flag_name, description, enabled_for_all)
VALUES
  ('bulk_upload', 'CSV bulk upload for historical data', FALSE),
  ('emr_integration', 'EMR integration (Epic, Cerner)', FALSE),
  ('api_access', 'Programmatic API access', FALSE),
  ('network_benchmarking', 'Compare outcomes across network', FALSE),
  ('white_label', 'Custom branding for enterprise', FALSE)
ON CONFLICT (flag_name) DO NOTHING;

-- ============================================================================
-- PART 7: Helper Functions
-- ============================================================================

-- Function to check if a feature is enabled for a user
CREATE OR REPLACE FUNCTION public.is_feature_enabled(
  p_flag_name TEXT,
  p_user_id UUID DEFAULT auth.uid(),
  p_site_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_flag RECORD;
  v_user_tier TEXT;
BEGIN
  -- Get feature flag
  SELECT * INTO v_flag
  FROM public.feature_flags
  WHERE flag_name = p_flag_name;
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Check if enabled for all
  IF v_flag.enabled_for_all THEN
    RETURN TRUE;
  END IF;
  
  -- Check if user is in enabled list
  IF p_user_id = ANY(v_flag.enabled_user_ids) THEN
    RETURN TRUE;
  END IF;
  
  -- Check if site is in enabled list
  IF p_site_id IS NOT NULL AND p_site_id = ANY(v_flag.enabled_site_ids) THEN
    RETURN TRUE;
  END IF;
  
  -- Check if user's tier is enabled
  IF array_length(v_flag.enabled_tiers, 1) > 0 THEN
    SELECT s.tier INTO v_user_tier
    FROM public.subscriptions s
    JOIN public.user_sites us ON us.site_id = s.site_id
    WHERE us.user_id = p_user_id
    LIMIT 1;
    
    IF v_user_tier = ANY(v_flag.enabled_tiers) THEN
      RETURN TRUE;
    END IF;
  END IF;
  
  RETURN FALSE;
END;
$$;

COMMENT ON FUNCTION public.is_feature_enabled IS 'Check if a feature flag is enabled for a user/site';

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Run these after migration to verify success:

-- 1. Check new columns exist
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'log_clinical_records'
  AND column_name IN ('session_type', 'protocol_id', 'outcome_measure', 'safety_event_category', 'clinical_phenotype')
ORDER BY column_name;

-- 2. Check new tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('subscriptions', 'usage_metrics', 'feature_flags', 'patient_site_links')
ORDER BY table_name;

-- 3. Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('subscriptions', 'usage_metrics', 'feature_flags', 'patient_site_links');

-- 4. Check feature flags seeded
SELECT flag_name, enabled_for_all
FROM public.feature_flags
ORDER BY flag_name;

-- ============================================================================
-- ROLLBACK (if needed)
-- ============================================================================
-- CAUTION: Only run if migration fails and you need to revert

/*
-- Drop new tables
DROP TABLE IF EXISTS public.patient_site_links CASCADE;
DROP TABLE IF EXISTS public.feature_flags CASCADE;
DROP TABLE IF EXISTS public.usage_metrics CASCADE;
DROP TABLE IF EXISTS public.subscriptions CASCADE;

-- Drop new columns (CAUTION: This deletes data!)
ALTER TABLE public.log_clinical_records DROP COLUMN IF EXISTS session_type;
ALTER TABLE public.log_clinical_records DROP COLUMN IF EXISTS protocol_id;
ALTER TABLE public.log_clinical_records DROP COLUMN IF EXISTS outcome_measure;
ALTER TABLE public.log_clinical_records DROP COLUMN IF EXISTS safety_event_category;
ALTER TABLE public.log_clinical_records DROP COLUMN IF EXISTS clinical_phenotype;

-- Drop helper function
DROP FUNCTION IF EXISTS public.is_feature_enabled;
*/

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
