-- WO-363: Add Protocol Configurator Support to Session Tables
-- Adds immutable archetype routing and feature toggles to prevent frontend state loss

-- Add columns to log_clinical_records
ALTER TABLE log_clinical_records
ADD COLUMN IF NOT EXISTS protocol_archetype text DEFAULT 'clinical',
ADD COLUMN IF NOT EXISTS enabled_features jsonb DEFAULT '[]'::jsonb;

-- Add comment explaining usage
COMMENT ON COLUMN log_clinical_records.protocol_archetype IS 'The selected protocol (clinical, ceremonial, custom) that dictates the required data logic gating.';
COMMENT ON COLUMN log_clinical_records.enabled_features IS 'A JSON array of specific workflow identifiers that are allowed to render and be evaluated for this session.';
