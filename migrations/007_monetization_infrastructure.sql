-- ============================================================================
-- MIGRATION: 007_monetization_infrastructure.sql
-- Description: Add subscription management, insurance policies, and data export tracking
-- Date: 2026-02-10
-- Author: Designer Agent (Antigravity)
-- ============================================================================

-- ============================================================================
-- REVENUE STREAM 1: CLINIC COMMANDER (B2B SaaS Subscriptions)
-- ============================================================================

CREATE TABLE IF NOT EXISTS subscriptions (
  subscription_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id BIGINT REFERENCES sites(site_id) ON DELETE CASCADE,
  tier TEXT NOT NULL CHECK (tier IN ('starter', 'professional', 'enterprise')),
  status TEXT NOT NULL CHECK (status IN ('active', 'past_due', 'canceled', 'trialing')),
  mrr DECIMAL(10,2) NOT NULL, -- Monthly recurring revenue
  billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'annual')),
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  current_period_start TIMESTAMP NOT NULL,
  current_period_end TIMESTAMP NOT NULL,
  trial_end TIMESTAMP,
  canceled_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_site ON subscriptions(site_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_stripe ON subscriptions(stripe_subscription_id);

COMMENT ON TABLE subscriptions IS 'Clinic Commander subscription management';
COMMENT ON COLUMN subscriptions.mrr IS 'Monthly Recurring Revenue in USD';
COMMENT ON COLUMN subscriptions.tier IS 'Subscription tier: starter ($500), professional ($1200), enterprise ($2000)';

-- Usage tracking for metered billing
CREATE TABLE IF NOT EXISTS usage_metrics (
  metric_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES subscriptions(subscription_id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL, -- 'clinicians', 'locations', 'api_calls', 'storage_gb'
  value INTEGER NOT NULL,
  billing_period_start DATE NOT NULL,
  billing_period_end DATE NOT NULL,
  recorded_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_usage_metrics_subscription ON usage_metrics(subscription_id);
CREATE INDEX idx_usage_metrics_period ON usage_metrics(billing_period_start, billing_period_end);

COMMENT ON TABLE usage_metrics IS 'Track usage for metered billing and overage charges';

-- ============================================================================
-- REVENUE STREAM 2: RISK MANAGEMENT ENGINE (Insurance Policies)
-- ============================================================================

CREATE TABLE IF NOT EXISTS insurance_policies (
  policy_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  coverage_level TEXT NOT NULL CHECK (coverage_level IN ('basic', 'standard', 'premium')),
  status TEXT NOT NULL CHECK (status IN ('active', 'lapsed', 'pending', 'canceled')),
  premium_amount DECIMAL(10,2) NOT NULL, -- Monthly premium in USD
  coverage_limit BIGINT NOT NULL, -- Coverage limit in USD (e.g., 1000000 for $1M)
  policy_start_date DATE NOT NULL,
  policy_end_date DATE NOT NULL,
  underwriter TEXT, -- Partner insurance company name
  policy_number TEXT UNIQUE NOT NULL,
  compliance_score INTEGER CHECK (compliance_score BETWEEN 0 AND 100), -- % of sessions using Protocol Builder
  last_compliance_check TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_insurance_policies_user ON insurance_policies(user_id);
CREATE INDEX idx_insurance_policies_status ON insurance_policies(status);
CREATE INDEX idx_insurance_policies_policy_number ON insurance_policies(policy_number);

COMMENT ON TABLE insurance_policies IS 'Malpractice insurance policies for PPN members';
COMMENT ON COLUMN insurance_policies.compliance_score IS 'Percentage of sessions using Protocol Builder (required for coverage)';

-- Insurance claims tracking
CREATE TABLE IF NOT EXISTS insurance_claims (
  claim_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id UUID REFERENCES insurance_policies(policy_id) ON DELETE CASCADE,
  incident_date DATE NOT NULL,
  claim_amount DECIMAL(12,2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('filed', 'under_review', 'approved', 'denied', 'settled')),
  resolution_date DATE,
  settlement_amount DECIMAL(12,2),
  notes TEXT,
  adjuster_name TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_insurance_claims_policy ON insurance_claims(policy_id);
CREATE INDEX idx_insurance_claims_status ON insurance_claims(status);
CREATE INDEX idx_insurance_claims_incident_date ON insurance_claims(incident_date);

COMMENT ON TABLE insurance_claims IS 'Insurance claims filed by policyholders';

-- ============================================================================
-- REVENUE STREAM 3: WISDOM TRUST (Data Export Requests)
-- ============================================================================

CREATE TABLE IF NOT EXISTS data_export_requests (
  request_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_organization TEXT NOT NULL,
  buyer_contact_email TEXT NOT NULL,
  dataset_type TEXT NOT NULL CHECK (dataset_type IN ('snapshot', 'longitudinal', 'custom', 'annual_license')),
  indication_filter TEXT[], -- Array of indication names (e.g., ['Depression', 'PTSD'])
  substance_filter TEXT[], -- Array of substance names
  date_range_start DATE,
  date_range_end DATE,
  min_record_count INTEGER NOT NULL DEFAULT 1000,
  price DECIMAL(12,2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'delivered', 'canceled')),
  dua_signed BOOLEAN DEFAULT FALSE, -- Data Use Agreement signed
  dua_signed_date DATE,
  irb_approval_number TEXT,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP,
  delivered_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_data_export_requests_status ON data_export_requests(status);
CREATE INDEX idx_data_export_requests_buyer ON data_export_requests(buyer_organization);

COMMENT ON TABLE data_export_requests IS 'Wisdom Trust data export requests from pharma/researchers';
COMMENT ON COLUMN data_export_requests.dua_signed IS 'Data Use Agreement must be signed before delivery';

-- Audit trail for data exports (HIPAA compliance)
CREATE TABLE IF NOT EXISTS data_export_audit (
  audit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES data_export_requests(request_id) ON DELETE CASCADE,
  records_exported INTEGER NOT NULL,
  export_date TIMESTAMP NOT NULL DEFAULT NOW(),
  exported_by UUID REFERENCES auth.users(id),
  file_hash TEXT NOT NULL, -- SHA-256 hash of exported file
  file_size_bytes BIGINT,
  export_format TEXT CHECK (export_format IN ('csv', 'json', 'parquet')),
  de_identification_method TEXT, -- e.g., 'HIPAA Expert Determination'
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_data_export_audit_request ON data_export_audit(request_id);
CREATE INDEX idx_data_export_audit_date ON data_export_audit(export_date);

COMMENT ON TABLE data_export_audit IS 'Audit trail for all data exports (HIPAA compliance)';

-- ============================================================================
-- BULK DATA UPLOAD INFRASTRUCTURE
-- ============================================================================

CREATE TABLE IF NOT EXISTS data_import_jobs (
  job_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  site_id BIGINT REFERENCES sites(site_id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  file_format TEXT CHECK (file_format IN ('csv', 'xlsx')),
  total_rows INTEGER,
  rows_imported INTEGER DEFAULT 0,
  rows_skipped INTEGER DEFAULT 0,
  rows_errored INTEGER DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  error_log JSONB, -- Array of {row: number, error: string}
  column_mappings JSONB, -- {"Patient ID": "subject_id", "Drug": "substance_id"}
  duplicate_strategy TEXT CHECK (duplicate_strategy IN ('skip', 'update', 'import')),
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_data_import_jobs_user ON data_import_jobs(user_id);
CREATE INDEX idx_data_import_jobs_site ON data_import_jobs(site_id);
CREATE INDEX idx_data_import_jobs_status ON data_import_jobs(status);

COMMENT ON TABLE data_import_jobs IS 'Bulk data upload job tracking';

-- Saved column mappings for reuse
CREATE TABLE IF NOT EXISTS import_column_mappings (
  mapping_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mapping_name TEXT NOT NULL,
  column_map JSONB NOT NULL, -- {"Patient ID": "subject_id", "Drug": "substance_id"}
  file_format TEXT CHECK (file_format IN ('csv', 'xlsx')),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_import_column_mappings_user ON import_column_mappings(user_id);

COMMENT ON TABLE import_column_mappings IS 'Saved column mappings for bulk import reuse';

-- ============================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Subscriptions: Site admins can view their own, network admins can view all
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY subscriptions_select_policy ON subscriptions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_sites
      WHERE user_sites.user_id = auth.uid()
        AND user_sites.site_id = subscriptions.site_id
        AND user_sites.role IN ('site_admin', 'network_admin')
    )
  );

CREATE POLICY subscriptions_insert_policy ON subscriptions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_sites
      WHERE user_sites.user_id = auth.uid()
        AND user_sites.role = 'network_admin'
    )
  );

-- Insurance policies: Users can view their own, network admins can view all
ALTER TABLE insurance_policies ENABLE ROW LEVEL SECURITY;

CREATE POLICY insurance_policies_select_policy ON insurance_policies
  FOR SELECT
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM user_sites
      WHERE user_sites.user_id = auth.uid()
        AND user_sites.role = 'network_admin'
    )
  );

-- Data export requests: Network admins only
ALTER TABLE data_export_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY data_export_requests_select_policy ON data_export_requests
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_sites
      WHERE user_sites.user_id = auth.uid()
        AND user_sites.role = 'network_admin'
    )
  );

-- Data import jobs: Users can view their own
ALTER TABLE data_import_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY data_import_jobs_select_policy ON data_import_jobs
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY data_import_jobs_insert_policy ON data_import_jobs
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to calculate compliance score for insurance policies
CREATE OR REPLACE FUNCTION calculate_compliance_score(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  total_sessions INTEGER;
  protocol_builder_sessions INTEGER;
  score INTEGER;
BEGIN
  -- Count total sessions by this user
  SELECT COUNT(*) INTO total_sessions
  FROM log_clinical_records
  WHERE user_id = p_user_id
    AND session_date >= CURRENT_DATE - INTERVAL '90 days';
  
  -- Count sessions using Protocol Builder (has auto_filled flag or time_to_complete)
  SELECT COUNT(*) INTO protocol_builder_sessions
  FROM log_clinical_records
  WHERE user_id = p_user_id
    AND session_date >= CURRENT_DATE - INTERVAL '90 days'
    AND (auto_filled = TRUE OR time_to_complete IS NOT NULL);
  
  -- Calculate percentage
  IF total_sessions = 0 THEN
    RETURN 0;
  ELSE
    score := ROUND((protocol_builder_sessions::DECIMAL / total_sessions::DECIMAL) * 100);
    RETURN score;
  END IF;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION calculate_compliance_score IS 'Calculate Protocol Builder usage % for insurance compliance';

-- Trigger to update subscription updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_insurance_policies_updated_at
  BEFORE UPDATE ON insurance_policies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SEED DATA (for testing)
-- ============================================================================

-- Example subscription (commented out for production)
-- INSERT INTO subscriptions (site_id, tier, status, mrr, billing_cycle, current_period_start, current_period_end)
-- VALUES (1, 'professional', 'active', 1200.00, 'monthly', NOW(), NOW() + INTERVAL '1 month');

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Log migration
INSERT INTO schema_migrations (version, applied_at)
VALUES ('007_monetization_infrastructure', NOW())
ON CONFLICT (version) DO NOTHING;
