-- ============================================================================
-- Migration 018: Protocol Intelligence Infrastructure
-- ============================================================================
-- Purpose: Enable Protocol Builder Auto-Fill and Adverse Event Risk Prediction
-- Date: 2026-02-13
-- Status: READY TO RUN
-- Dependencies: Requires log_clinical_records, ref_substances, ref_indications
-- ============================================================================

-- ============================================================================
-- PART 1: PRACTITIONER PREFERENCE LEARNING (AUTO-FILL)
-- ============================================================================

-- Table to store learned practitioner preferences
CREATE TABLE IF NOT EXISTS public.user_protocol_preferences (
  preference_id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL, -- References auth.users(id)
  site_id BIGINT NOT NULL REFERENCES public.sites(site_id),
  substance_id BIGINT REFERENCES public.ref_substances(substance_id),
  indication_id BIGINT REFERENCES public.ref_indications(indication_id),
  
  -- Learned preferences
  preferred_route_id BIGINT REFERENCES public.ref_routes(route_id),
  preferred_dosage_mg NUMERIC(8,2),
  preferred_support_modalities BIGINT[], -- Array of modality IDs
  preferred_prep_hours INTEGER,
  preferred_integration_hours INTEGER,
  
  -- Usage tracking
  times_used INTEGER DEFAULT 1,
  last_used_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure one preference per user-substance-indication combo
  UNIQUE(user_id, substance_id, indication_id)
);

-- Indexes for fast lookup during Protocol Builder
CREATE INDEX IF NOT EXISTS idx_user_prefs_user 
ON public.user_protocol_preferences(user_id);

CREATE INDEX IF NOT EXISTS idx_user_prefs_substance 
ON public.user_protocol_preferences(substance_id, indication_id);

-- Enable RLS
ALTER TABLE public.user_protocol_preferences ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own preferences
CREATE POLICY "users_own_preferences" 
ON public.user_protocol_preferences
FOR ALL
USING (user_id = auth.uid());

-- Function to update preferences after protocol submission
CREATE OR REPLACE FUNCTION public.update_practitioner_preferences()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update if protocol was actually submitted
  IF NEW.submitted_at IS NOT NULL THEN
    INSERT INTO public.user_protocol_preferences (
      user_id, site_id, substance_id, indication_id,
      preferred_route_id, preferred_dosage_mg,
      preferred_support_modalities, preferred_prep_hours, preferred_integration_hours
    ) VALUES (
      NEW.created_by, NEW.site_id, NEW.substance_id, NEW.indication_id,
      NEW.route_id, NEW.dosage_mg,
      NEW.support_modality_ids, NEW.prep_hours, NEW.integration_hours
    )
    ON CONFLICT (user_id, substance_id, indication_id)
    DO UPDATE SET
      preferred_route_id = NEW.route_id,
      preferred_dosage_mg = NEW.dosage_mg,
      preferred_support_modalities = NEW.support_modality_ids,
      preferred_prep_hours = NEW.prep_hours,
      preferred_integration_hours = NEW.integration_hours,
      times_used = user_protocol_preferences.times_used + 1,
      last_used_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-update preferences
CREATE TRIGGER trigger_update_practitioner_preferences
AFTER INSERT OR UPDATE ON public.log_clinical_records
FOR EACH ROW
EXECUTE FUNCTION public.update_practitioner_preferences();

-- ============================================================================
-- PART 2: ADVERSE EVENT RISK PREDICTION
-- ============================================================================

-- Materialized view for baseline adverse event rates
CREATE MATERIALIZED VIEW IF NOT EXISTS public.mv_adverse_event_rates AS
SELECT 
  substance_id,
  indication_id,
  patient_age,
  patient_sex,
  COUNT(DISTINCT subject_id) as total_patients,
  COUNT(DISTINCT CASE 
    WHEN EXISTS (
      SELECT 1 FROM public.log_safety_events lse 
      WHERE lse.subject_id = lcr.subject_id 
      AND lse.site_id = lcr.site_id
    ) THEN subject_id 
  END) as patients_with_ae,
  (COUNT(DISTINCT CASE 
    WHEN EXISTS (
      SELECT 1 FROM public.log_safety_events lse 
      WHERE lse.subject_id = lcr.subject_id 
      AND lse.site_id = lcr.site_id
    ) THEN subject_id 
  END)::FLOAT / NULLIF(COUNT(DISTINCT subject_id), 0)::FLOAT) * 100 as baseline_risk_pct,
  NOW() as last_updated
FROM public.log_clinical_records lcr
WHERE submitted_at IS NOT NULL
GROUP BY substance_id, indication_id, patient_age, patient_sex
HAVING COUNT(DISTINCT subject_id) >= 10; -- Minimum sample size

-- Index for fast lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_ae_rates_pk 
ON public.mv_adverse_event_rates(substance_id, indication_id, patient_age, patient_sex);

-- Table for medication risk weights
CREATE TABLE IF NOT EXISTS public.ref_medication_risk_weights (
  medication_id BIGINT PRIMARY KEY REFERENCES public.ref_medications(medication_id),
  risk_weight NUMERIC(4,1) DEFAULT 1.0, -- 1.0 = low risk, 10.0 = critical risk
  requires_washout BOOLEAN DEFAULT FALSE,
  washout_duration_days INTEGER,
  interacts_with_cyp450 BOOLEAN DEFAULT FALSE,
  cyp450_enzyme TEXT, -- '2D6', '3A4', etc.
  risk_rationale TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed critical medication risk weights
INSERT INTO public.ref_medication_risk_weights (medication_id, risk_weight, requires_washout, washout_duration_days, risk_rationale)
SELECT medication_id, 10.0, TRUE, 14, 'CRITICAL: Seizure risk with psychedelics'
FROM public.ref_medications
WHERE medication_name ILIKE '%lithium%'
ON CONFLICT (medication_id) DO NOTHING;

INSERT INTO public.ref_medication_risk_weights (medication_id, risk_weight, requires_washout, washout_duration_days, risk_rationale)
SELECT medication_id, 8.0, TRUE, 14, 'HIGH: Serotonin syndrome risk with MDMA'
FROM public.ref_medications
WHERE medication_name ILIKE '%sertraline%' 
   OR medication_name ILIKE '%fluoxetine%'
   OR medication_name ILIKE '%escitalopram%'
   OR medication_name ILIKE '%venlafaxine%'
ON CONFLICT (medication_id) DO NOTHING;

INSERT INTO public.ref_medication_risk_weights (medication_id, risk_weight, risk_rationale)
SELECT medication_id, 2.0, 'LOW: Minimal interaction risk'
FROM public.ref_medications
WHERE medication_name ILIKE '%bupropion%'
   OR medication_name ILIKE '%mirtazapine%'
ON CONFLICT (medication_id) DO NOTHING;

-- Enable RLS
ALTER TABLE public.ref_medication_risk_weights ENABLE ROW LEVEL SECURITY;

-- Policy: All authenticated users can read
CREATE POLICY "authenticated_read_med_risk" 
ON public.ref_medication_risk_weights
FOR SELECT
USING (auth.role() = 'authenticated');

-- Function to calculate adverse event risk score
CREATE OR REPLACE FUNCTION public.calculate_adverse_event_risk(
  p_substance_id BIGINT,
  p_indication_id BIGINT,
  p_patient_age TEXT,
  p_patient_sex TEXT,
  p_dosage_mg NUMERIC,
  p_concomitant_med_ids BIGINT[]
) RETURNS TABLE(
  risk_score NUMERIC,
  risk_category TEXT,
  risk_factors JSONB,
  baseline_risk_pct NUMERIC,
  recommendation TEXT
) AS $$
DECLARE
  v_baseline_risk NUMERIC := 0;
  v_risk_score NUMERIC := 0;
  v_risk_factors JSONB := '[]'::JSONB;
  v_age_modifier NUMERIC := 0;
  v_dosage_modifier NUMERIC := 0;
  v_med_modifier NUMERIC := 0;
  v_risk_category TEXT;
  v_recommendation TEXT;
  v_median_dosage NUMERIC;
  v_p75_dosage NUMERIC;
BEGIN
  -- Get baseline risk from historical data
  SELECT COALESCE(baseline_risk_pct, 5.0) -- Default 5% if no data
  INTO v_baseline_risk
  FROM public.mv_adverse_event_rates
  WHERE substance_id = p_substance_id
    AND indication_id = p_indication_id
    AND patient_age = p_patient_age
    AND patient_sex = p_patient_sex
  LIMIT 1;
  
  -- Start with baseline
  v_risk_score := v_baseline_risk;
  
  -- Age modifier (65+ higher risk)
  IF p_patient_age IN ('65-74', '75+') THEN
    v_age_modifier := 10;
    v_risk_score := v_risk_score + v_age_modifier;
    v_risk_factors := v_risk_factors || jsonb_build_object(
      'factor', 'Age 65+',
      'points', v_age_modifier,
      'rationale', 'Increased cardiovascular risk'
    );
  END IF;
  
  -- Dosage modifier (high dosage = higher risk)
  SELECT 
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY dosage_mg),
    PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY dosage_mg)
  INTO v_median_dosage, v_p75_dosage
  FROM public.log_clinical_records
  WHERE substance_id = p_substance_id
    AND dosage_mg IS NOT NULL;
  
  IF p_dosage_mg > v_p75_dosage THEN
    v_dosage_modifier := 8;
    v_risk_score := v_risk_score + v_dosage_modifier;
    v_risk_factors := v_risk_factors || jsonb_build_object(
      'factor', 'High dosage (>75th percentile)',
      'points', v_dosage_modifier,
      'rationale', 'Above typical therapeutic range'
    );
  END IF;
  
  -- Medication interaction modifier
  IF p_concomitant_med_ids IS NOT NULL AND array_length(p_concomitant_med_ids, 1) > 0 THEN
    SELECT COALESCE(SUM(risk_weight), 0)
    INTO v_med_modifier
    FROM public.ref_medication_risk_weights
    WHERE medication_id = ANY(p_concomitant_med_ids);
    
    v_risk_score := v_risk_score + v_med_modifier;
    
    -- Add high-risk medications to risk factors
    FOR rec IN 
      SELECT medication_name, risk_weight, risk_rationale
      FROM public.ref_medication_risk_weights mrw
      JOIN public.ref_medications rm ON mrw.medication_id = rm.medication_id
      WHERE mrw.medication_id = ANY(p_concomitant_med_ids)
        AND risk_weight >= 5.0
    LOOP
      v_risk_factors := v_risk_factors || jsonb_build_object(
        'factor', 'Concomitant: ' || rec.medication_name,
        'points', rec.risk_weight,
        'rationale', rec.risk_rationale
      );
    END LOOP;
  END IF;
  
  -- Determine risk category
  IF v_risk_score < 15 THEN
    v_risk_category := 'Low';
    v_recommendation := 'Safe to proceed with standard monitoring protocol';
  ELSIF v_risk_score < 30 THEN
    v_risk_category := 'Moderate';
    v_recommendation := 'Proceed with enhanced monitoring. Consider dosage reduction.';
  ELSIF v_risk_score < 50 THEN
    v_risk_category := 'High';
    v_recommendation := 'Consult medical director. Enhanced safety protocols required.';
  ELSE
    v_risk_category := 'Very High';
    v_recommendation := 'CAUTION: Consider alternative protocol or medication washout period.';
  END IF;
  
  RETURN QUERY SELECT 
    v_risk_score,
    v_risk_category,
    v_risk_factors,
    v_baseline_risk,
    v_recommendation;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- PART 3: REFRESH FUNCTIONS
-- ============================================================================

CREATE OR REPLACE FUNCTION public.refresh_adverse_event_rates()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_adverse_event_rates;
  RAISE NOTICE 'Refreshed mv_adverse_event_rates at %', NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- PART 4: COMMENTS
-- ============================================================================

COMMENT ON TABLE public.user_protocol_preferences IS 
  'Learned practitioner preferences for Protocol Builder auto-fill feature';

COMMENT ON TABLE public.ref_medication_risk_weights IS 
  'Risk weights for concomitant medications used in adverse event prediction';

COMMENT ON MATERIALIZED VIEW public.mv_adverse_event_rates IS 
  'Historical adverse event rates by substance, indication, age, and sex';

COMMENT ON FUNCTION public.calculate_adverse_event_risk IS 
  'Calculates real-time adverse event risk score for Protocol Builder';

-- ============================================================================
-- VERIFICATION
-- ============================================================================

DO $$ 
DECLARE
  prefs_count INTEGER;
  rates_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO prefs_count FROM public.user_protocol_preferences;
  SELECT COUNT(*) INTO rates_count FROM public.mv_adverse_event_rates;
  
  RAISE NOTICE '✅ Migration 018: Protocol Intelligence Infrastructure';
  RAISE NOTICE '   - user_protocol_preferences: % rows', prefs_count;
  RAISE NOTICE '   - mv_adverse_event_rates: % rows', rates_count;
  RAISE NOTICE '   - Risk calculation function: READY';
  RAISE NOTICE '   - Auto-fill trigger: ACTIVE';
END $$;
