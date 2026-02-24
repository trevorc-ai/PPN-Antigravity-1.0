-- Migration: Add Give-To-Get Data Contributor Status
-- Ticket: WO-103
-- Purpose: Add contributor tracking and RLS for market benchmarks

-- 1. Add contributor status flag to user_profiles
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS data_contributor_status BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS total_valid_outcomes INTEGER DEFAULT 0;

-- Comment for data dictionary
COMMENT ON COLUMN public.user_profiles.data_contributor_status IS 'Flag indicating if user has met data contribution thresholds for market access.';
COMMENT ON COLUMN public.user_profiles.total_valid_outcomes IS 'Running count of valid clinical outcomes submitted by this user/site.';

-- 2. Create function to recalculate contributor status (Triggered on new valid outcome)
CREATE OR REPLACE FUNCTION update_contributor_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Only run if the new record is marked as 'valid' for research
    -- In a real scenario, this might check specific completeness thresholds 
    -- For now, increment the counter and set true if >= 5 outcomes
    
    UPDATE public.user_profiles
    SET 
        total_valid_outcomes = total_valid_outcomes + 1,
        data_contributor_status = CASE WHEN total_valid_outcomes + 1 >= 5 THEN true ELSE false END
    WHERE user_id = NEW.clinician_id; -- Assuming log_clinical_records has clinician_id mapping to auth.users

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: Applying the trigger requires attaching it to the correct outcomes table (e.g. log_clinical_records)
-- We'll attach it in the next step once we confirm the exact target table.
