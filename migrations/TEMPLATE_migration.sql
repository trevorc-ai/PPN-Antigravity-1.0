-- ============================================
-- MIGRATION TEMPLATE
-- ============================================
-- Migration Number: XXX
-- Date: YYYY-MM-DD
-- Author: [Your Name]
-- Purpose: [Brief description of changes]
-- Affected Tables: [List tables being modified]
-- ============================================

-- ============================================
-- SECTION 1: CREATE NEW REFERENCE TABLES
-- ============================================

-- Example: Create a new reference table for dropdowns
CREATE TABLE IF NOT EXISTS ref_example_category (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  category_name TEXT NOT NULL UNIQUE,
  category_description TEXT,
  display_order INT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies (read: all authenticated, write: network_admin only)
ALTER TABLE ref_example_category ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ref_example_category_read"
ON ref_example_category FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "ref_example_category_write"
ON ref_example_category FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_sites
    WHERE user_sites.user_id = auth.uid()
    AND user_sites.role = 'network_admin'
  )
);

-- ============================================
-- SECTION 2: ADD COLUMNS TO EXISTING TABLES
-- ============================================

-- Example: Add new columns to log table
ALTER TABLE log_interventions
ADD COLUMN IF NOT EXISTS example_field_1 TEXT,
ADD COLUMN IF NOT EXISTS example_field_2 NUMERIC,
ADD COLUMN IF NOT EXISTS example_category_id BIGINT REFERENCES ref_example_category(id);

-- Add indexes for foreign keys (improves query performance)
CREATE INDEX IF NOT EXISTS idx_log_interventions_example_category
ON log_interventions(example_category_id);

-- ============================================
-- SECTION 3: SEED REFERENCE DATA
-- ============================================

-- Insert initial values for new reference table
INSERT INTO ref_example_category (category_name, category_description, display_order)
VALUES
  ('Category 1', 'Description for category 1', 1),
  ('Category 2', 'Description for category 2', 2),
  ('Category 3', 'Description for category 3', 3)
ON CONFLICT (category_name) DO NOTHING;

-- ============================================
-- SECTION 4: UPDATE EXISTING DATA (if needed)
-- ============================================

-- Example: Set default values for existing rows
-- UPDATE log_interventions
-- SET example_field_1 = 'default_value'
-- WHERE example_field_1 IS NULL;

-- ============================================
-- SECTION 5: VERIFICATION QUERIES
-- ============================================

-- Verify new columns exist
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'log_interventions'
AND column_name IN ('example_field_1', 'example_field_2', 'example_category_id');

-- Verify reference data was seeded
SELECT COUNT(*) as category_count FROM ref_example_category;

-- Verify RLS policies exist
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename = 'ref_example_category';

-- ============================================
-- SECTION 6: ROLLBACK SCRIPT (for emergencies)
-- ============================================

-- UNCOMMENT AND RUN ONLY IF YOU NEED TO ROLLBACK:

-- DROP TABLE IF EXISTS ref_example_category CASCADE;
-- ALTER TABLE log_interventions DROP COLUMN IF EXISTS example_field_1;
-- ALTER TABLE log_interventions DROP COLUMN IF EXISTS example_field_2;
-- ALTER TABLE log_interventions DROP COLUMN IF EXISTS example_category_id;

-- ============================================
-- END OF MIGRATION
-- ============================================
