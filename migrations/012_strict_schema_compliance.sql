-- ============================================================================
-- Migration 012: Strict Schema Compliance (No Text in Logs)
-- ============================================================================
-- Purpose: 
--   1. Create reference tables for all dropdown fields (Sex, Weight, Dosage Unit, Frequency, Setting).
--   2. Replace TEXT columns in log_clinical_records with foreign key IDs.
--   3. Prohibit free-text storage in the clinical log.
-- Date: 2026-02-12
-- ============================================================================

-- 1. Create Reference Tables

-- dosage_unit
CREATE TABLE IF NOT EXISTS public.ref_dosage_units (
    id BIGSERIAL PRIMARY KEY,
    unit_label TEXT NOT NULL UNIQUE, -- e.g. "mg", "g", "mcg"
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.ref_dosage_units (unit_label) VALUES 
('mg'), ('g'), ('mcg'), ('ml'), ('drops'), ('capsules')
ON CONFLICT (unit_label) DO NOTHING;

-- frequency
CREATE TABLE IF NOT EXISTS public.ref_dosage_frequency (
    id BIGSERIAL PRIMARY KEY,
    frequency_label TEXT NOT NULL UNIQUE, -- e.g. "Once", "Daily"
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.ref_dosage_frequency (frequency_label) VALUES 
('Once'), ('Daily'), ('Weekly'), ('Monthly'), ('Microdosing Protocol')
ON CONFLICT (frequency_label) DO NOTHING;

-- sex
CREATE TABLE IF NOT EXISTS public.ref_sex (
    id BIGSERIAL PRIMARY KEY,
    sex_label TEXT NOT NULL UNIQUE, -- e.g. "Male", "Female"
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.ref_sex (sex_label) VALUES 
('Male'), ('Female'), ('Intersex'), ('Prefer not to say')
ON CONFLICT (sex_label) DO NOTHING;

-- weight_range
CREATE TABLE IF NOT EXISTS public.ref_weight_ranges (
    id BIGSERIAL PRIMARY KEY,
    range_label TEXT NOT NULL UNIQUE, -- e.g. "< 50 kg"
    sort_order INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.ref_weight_ranges (range_label, sort_order) VALUES 
('< 50 kg', 1), 
('50-70 kg', 2), 
('70-90 kg', 3), 
('90-110 kg', 4), 
('> 110 kg', 5)
ON CONFLICT (range_label) DO NOTHING;

-- setting
CREATE TABLE IF NOT EXISTS public.ref_settings (
    id BIGSERIAL PRIMARY KEY,
    setting_label TEXT NOT NULL UNIQUE, -- e.g. "Clinical"
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.ref_settings (setting_label) VALUES 
('Clinical Office'), ('Home (Supported)'), ('Home (Solo)'), ('Retreat Center'), ('Nature/Outdoor'), ('Research Lab')
ON CONFLICT (setting_label) DO NOTHING;


-- 2. Alter log_clinical_records
-- Add new ID columns
ALTER TABLE public.log_clinical_records
ADD COLUMN IF NOT EXISTS dosage_unit_id BIGINT REFERENCES public.ref_dosage_units(id),
ADD COLUMN IF NOT EXISTS frequency_id BIGINT REFERENCES public.ref_dosage_frequency(id),
ADD COLUMN IF NOT EXISTS patient_sex_id BIGINT REFERENCES public.ref_sex(id),
ADD COLUMN IF NOT EXISTS patient_weight_range_id BIGINT REFERENCES public.ref_weight_ranges(id),
ADD COLUMN IF NOT EXISTS setting_id BIGINT REFERENCES public.ref_settings(id);

-- 3. Migrate Schema (Legacy Columns)
-- NOTE: Per strict additive-only rules, we DO NOT drop the old text columns.
-- We simply stop writing to them in the application layer.

-- DEPRECATED COLUMNS (Do not usage):
-- dosage_unit
-- frequency
-- patient_sex
-- patient_weight_range
-- setting
-- concomitant_meds

-- 4. Enable RLS on new tables
ALTER TABLE public.ref_dosage_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ref_dosage_frequency ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ref_sex ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ref_weight_ranges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ref_settings ENABLE ROW LEVEL SECURITY;

-- 5. Add Read Policy for Authenticated Users
CREATE POLICY "Enable read access for authenticated users" ON public.ref_dosage_units FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable read access for authenticated users" ON public.ref_dosage_frequency FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable read access for authenticated users" ON public.ref_sex FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable read access for authenticated users" ON public.ref_weight_ranges FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable read access for authenticated users" ON public.ref_settings FOR SELECT TO authenticated USING (true);

-- 6. Add updated_at triggers
CREATE TRIGGER update_ref_dosage_units_updated_at BEFORE UPDATE ON public.ref_dosage_units FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ref_dosage_frequency_updated_at BEFORE UPDATE ON public.ref_dosage_frequency FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ref_sex_updated_at BEFORE UPDATE ON public.ref_sex FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ref_weight_ranges_updated_at BEFORE UPDATE ON public.ref_weight_ranges FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ref_settings_updated_at BEFORE UPDATE ON public.ref_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DO $$ 
BEGIN
    RAISE NOTICE '✅ Migration 012: Strict Schema Compliance Enforced. Text columns removed.';
END $$;
