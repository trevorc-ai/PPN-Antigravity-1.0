-- migration: 20260224_remediate_schema_sys_to_log.sql

-- 1. Create the correctly named log table
CREATE TABLE IF NOT EXISTS log_waitlist (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now(),
    first_name text NOT NULL,
    email text UNIQUE NOT NULL,
    practitioner_type text NOT NULL,
    source text DEFAULT 'landing_page'::text
);
ALTER TABLE log_waitlist ENABLE ROW LEVEL SECURITY;

-- 2. Enforce the correct RLS Policies
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON log_waitlist;
CREATE POLICY "Enable insert for authenticated users only" ON log_waitlist FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Enable read access for all users" ON log_waitlist;
CREATE POLICY "Enable read access for all users" ON log_waitlist FOR SELECT USING (true);

-- 3. Clone existing data from academy_waitlist (safe, additive)
INSERT INTO log_waitlist (id, created_at, first_name, email, practitioner_type, source)
SELECT id, created_at, first_name, email, practitioner_type, source
FROM academy_waitlist
ON CONFLICT (email) DO NOTHING;

-- 4. PHI: UUID Fix (Phase 1 Additive)
-- Add explicit UUID typed columns with IF NOT EXISTS
ALTER TABLE log_baseline_assessments ADD COLUMN IF NOT EXISTS patient_uuid uuid;
ALTER TABLE log_behavioral_changes ADD COLUMN IF NOT EXISTS patient_uuid uuid;
ALTER TABLE log_integration_sessions ADD COLUMN IF NOT EXISTS patient_uuid uuid;
ALTER TABLE log_longitudinal_assessments ADD COLUMN IF NOT EXISTS patient_uuid uuid;
ALTER TABLE log_pulse_checks ADD COLUMN IF NOT EXISTS patient_uuid uuid;
ALTER TABLE log_red_alerts ADD COLUMN IF NOT EXISTS patient_uuid uuid;

-- Optional: Best-effort data mirror for valid uuids saved as text
UPDATE log_baseline_assessments SET patient_uuid = NULLIF(patient_id, '')::uuid WHERE patient_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';
UPDATE log_behavioral_changes SET patient_uuid = NULLIF(patient_id, '')::uuid WHERE patient_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';
UPDATE log_integration_sessions SET patient_uuid = NULLIF(patient_id, '')::uuid WHERE patient_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';
UPDATE log_longitudinal_assessments SET patient_uuid = NULLIF(patient_id, '')::uuid WHERE patient_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';
UPDATE log_pulse_checks SET patient_uuid = NULLIF(patient_id, '')::uuid WHERE patient_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';
UPDATE log_red_alerts SET patient_uuid = NULLIF(patient_id, '')::uuid WHERE patient_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

-- 5. Data Integrity: Enforce Enum/Ref Over Free Text Logs
ALTER TABLE log_patient_flow_events ADD COLUMN IF NOT EXISTS justification_id bigint REFERENCES ref_justification_codes(justification_id);
ALTER TABLE log_protocols ADD COLUMN IF NOT EXISTS protocol_rationale_id bigint REFERENCES ref_justification_codes(justification_id);

-- Note: In Phase 2 (after frontend transition is live) we will drop 'notes', 'patient_id', and 'academy_waitlist' entirely.
