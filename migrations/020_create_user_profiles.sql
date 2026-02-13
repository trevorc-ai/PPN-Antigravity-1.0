-- Migration 020: Create User Profiles Table (SIMPLIFIED)
-- Date: 2026-02-13
-- Purpose: User profile management with minimal fields (no liability risk)

-- User Profiles Table (SIMPLIFIED - No PII/License Data)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Basic Information (REQUIRED)
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    
    -- Display Preferences (OPTIONAL)
    display_name TEXT,  -- e.g., "Dr. Smith" or "Sarah" - user's choice
    
    -- Professional Context (OPTIONAL, NO VERIFICATION)
    specialty TEXT,  -- Self-reported, no verification
    organization_name TEXT,  -- Self-reported
    
    -- Role & Permissions (RBAC)
    role_tier TEXT NOT NULL DEFAULT 'solo_practitioner'
        CHECK (role_tier IN (
            'super_admin',
            'partner',
            'pilot_free',
            'pilot_paid',
            'solo_practitioner',
            'clinic_admin'
        )),
    
    -- Subscription Management
    subscription_status TEXT DEFAULT 'inactive'
        CHECK (subscription_status IN (
            'active',
            'trialing',
            'past_due',
            'canceled',
            'inactive',
            'lifetime_free'
        )),
    subscription_tier TEXT
        CHECK (subscription_tier IN (
            'solo',
            'clinic_5',
            'clinic_10',
            'clinic_25',
            'clinic_50',
            'enterprise'
        )),
    pilot_expires_at TIMESTAMPTZ,
    protocol_limit INTEGER,
    
    -- Stripe Integration
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    
    -- Settings
    is_profile_complete BOOLEAN DEFAULT FALSE,
    
    -- Feature Flags
    features JSONB DEFAULT '{}',
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read own profile"
    ON public.user_profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
    ON public.user_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
    ON public.user_profiles FOR UPDATE
    USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX idx_user_profiles_role_tier ON public.user_profiles(role_tier);
CREATE INDEX idx_user_profiles_subscription_status ON public.user_profiles(subscription_status);
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE public.user_profiles IS 'User profile data with minimal fields (no license/credential liability)';
COMMENT ON COLUMN public.user_profiles.display_name IS 'Optional: How user wants to be addressed (e.g., "Dr. Smith" or "Sarah")';
COMMENT ON COLUMN public.user_profiles.specialty IS 'Optional: Self-reported specialty, no verification required';
COMMENT ON COLUMN public.user_profiles.organization_name IS 'Optional: Self-reported organization name';
