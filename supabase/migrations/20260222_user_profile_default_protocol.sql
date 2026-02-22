-- WO-363: Add Default Protocol Saving to Clinician Profiles
-- Allows practitioners to save their preferred archetype permanently

ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS default_protocol_archetype text DEFAULT 'clinical',
ADD COLUMN IF NOT EXISTS default_enabled_features jsonb DEFAULT '[]'::jsonb;

COMMENT ON COLUMN user_profiles.default_protocol_archetype IS 'The practitioner''s default preferred protocol archetype to load automatically for new sessions.';
COMMENT ON COLUMN user_profiles.default_enabled_features IS 'The practitioner''s default enabled features JSON array for new sessions.';
