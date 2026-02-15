-- Migration 020: Create User Profiles Table (MINIMAL + ROLE)
-- Date: 2026-02-15
-- Purpose: Minimal table with role-based access control
-- Note: Email and password are in auth.users (Supabase Auth)

-- Create user roles reference table
CREATE TABLE IF NOT EXISTS public.ref_user_roles (
    id SERIAL PRIMARY KEY,
    role_name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed user roles
INSERT INTO public.ref_user_roles (role_name, description) VALUES
    ('admin', 'System administrator with full access'),
    ('partner', 'Partner organization with elevated privileges'),
    ('user', 'Standard user with basic access')
ON CONFLICT (role_name) DO NOTHING;

-- Create user profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    role_id INTEGER NOT NULL DEFAULT 3 REFERENCES ref_user_roles(id), -- Default to 'user'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Enable RLS on both tables
ALTER TABLE public.ref_user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Everyone can read roles (reference data)
CREATE POLICY "Anyone can read user roles"
    ON public.ref_user_roles
    FOR SELECT
    TO authenticated
    USING (true);

-- RLS Policy: Users can only access their own profile
CREATE POLICY "Users can manage own profile"
    ON public.user_profiles
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX idx_user_profiles_role_id ON public.user_profiles(role_id);

-- Comments
COMMENT ON TABLE public.ref_user_roles IS 'Reference table for user role types (admin, partner, user)';
COMMENT ON TABLE public.user_profiles IS 'User profiles with role-based access - email/password in auth.users';
