-- Add Student and Other to license types reference table
-- This migration creates the ref_license_types table if it doesn't exist
-- and ensures Student and Other options are available

CREATE TABLE IF NOT EXISTS public.ref_license_types (
  license_type_id BIGSERIAL PRIMARY KEY,
  license_code TEXT NOT NULL UNIQUE,
  license_name TEXT NOT NULL,
  display_order INTEGER DEFAULT 999,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.ref_license_types ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Read for authenticated users
CREATE POLICY "Allow authenticated read on ref_license_types"
  ON public.ref_license_types
  FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policy: Write for network_admin only
CREATE POLICY "Allow network_admin write on ref_license_types"
  ON public.ref_license_types
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_sites
      WHERE user_sites.user_id = auth.uid()
      AND user_sites.role = 'network_admin'
    )
  );

-- Insert license types (if not already present)
INSERT INTO public.ref_license_types (license_code, license_name, display_order)
VALUES
  ('MD', 'MD / DO', 1),
  ('NP', 'Nurse Practitioner', 2),
  ('PA', 'Physician Assistant', 3),
  ('PhD', 'PhD / PsyD', 4),
  ('LCSW', 'LCSW / LPC', 5),
  ('RN', 'Registered Nurse', 6),
  ('Student', 'Student', 7),
  ('Other', 'Other', 8)
ON CONFLICT (license_code) DO NOTHING;
