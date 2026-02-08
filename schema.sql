-- 1. Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create 'regulatory_states' table
CREATE TABLE IF NOT EXISTS public.regulatory_states (
    id TEXT PRIMARY KEY, -- 'OR', 'WA', etc.
    name TEXT NOT NULL,
    status TEXT NOT NULL,
    license_info TEXT,
    key_form TEXT,
    form_url TEXT,
    news_count INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Create 'news' table (for Intelligence Feed)
CREATE TABLE IF NOT EXISTS public.news (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    summary TEXT,
    source TEXT,
    url TEXT,
    image_url TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    category TEXT, -- 'Regulation', 'Clinical', 'Network', etc.
    sentiment TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative')),
    is_partner BOOLEAN DEFAULT FALSE,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Create 'profiles' table (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'practitioner', -- 'admin', 'researcher', 'practitioner'
    organization TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.regulatory_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS Policies

-- Regulatory States: Everyone can read, only Service Role can write (for now)
CREATE POLICY "Public read access for regulatory_states" 
ON public.regulatory_states FOR SELECT 
USING (true);

-- News: Everyone can read
CREATE POLICY "Public read access for news" 
ON public.news FOR SELECT 
USING (true);

-- Profiles: Users can read all profiles, but only update their own
CREATE POLICY "Public read access for profiles" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);


-- 7. Clinical Intelligence Tables

-- 7. Clinical Intelligence Tables (Reconciled with Existing Schema)

-- B. Clinic Performance Radar
-- Uses existing 'log_outcomes' and 'log_safety_events' via a View or new aggregation table if performance is key.
-- For now, we keep 'log_clinical_performance' as a cache table, or we can create a VIEW.
-- Let's create a VIEW to aggregate from existing data if possible, but for the "Network Average" we might need a dedicated store.
CREATE TABLE IF NOT EXISTS public.log_clinical_performance (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    site_id UUID, -- Maps to existing site_id in logs
    metric_label TEXT NOT NULL,
    clinic_score INTEGER CHECK (clinic_score BETWEEN 0 AND 100),
    network_avg INTEGER CHECK (network_avg BETWEEN 0 AND 100),
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- C. Patient Constellation (outcomes)
-- Mapped to existing 'log_clinical_records'
-- We just need a VIEW to make fetching for the scatter plot easy.
CREATE OR REPLACE VIEW view_patient_clusters AS
SELECT 
    lcr.patient_link_code,
    -- Calculate Resistance (simplified example using outcome_score as proxy if needed, or join with other data)
    -- Assuming dosage_amount or other fields might correlate to resistance for now
    -- Or we might need to alter the table to add specific resistance fields if they don't exist
    lcr.outcome_score as current_score_proxy,
    lcr.substance_id,
    lcr.site_id
FROM public.log_clinical_records lcr;

-- D. Molecular Bridge (Pharmacology)
-- 'ref_substances' exists, but 'ref_pharmacology' (Ki values) does not seem to.
CREATE TABLE IF NOT EXISTS public.ref_pharmacology (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    substance_id BIGINT REFERENCES public.ref_substances(substance_id), -- Linked to existing ref_substances
    receptor_name TEXT NOT NULL,
    affinity_value NUMERIC, -- Ki value
    clinical_implication TEXT,
    risk_note TEXT
);

-- E. Protocol Efficiency (Financials)
-- 'log_interventions' has duration info (maybe in context jsonb).
-- We need a ref table for the financial models.
CREATE TABLE IF NOT EXISTS public.ref_protocol_financials (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    protocol_name TEXT NOT NULL,
    avg_duration_minutes INTEGER,
    base_cost NUMERIC,
    avg_revenue NUMERIC,
    currency TEXT DEFAULT 'USD'
);

-- F. Metabolic Safety Rules (for the Gauge)
-- New concept, new table.
CREATE TABLE IF NOT EXISTS public.ref_metabolic_rules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    substance_name TEXT, -- Could link to ref_substances.substance_name
    metabolizer_status TEXT, -- 'Poor', 'Normal', 'Ultra-Rapid'
    risk_level TEXT, -- 'High', 'Moderate', 'Low'
    recommendation TEXT,
    mechanism TEXT
);

-- Enable RLS for new tables
ALTER TABLE public.log_clinical_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ref_pharmacology ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ref_protocol_financials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ref_metabolic_rules ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public read refs" ON public.ref_pharmacology FOR SELECT USING (true);
CREATE POLICY "Public read financials" ON public.ref_protocol_financials FOR SELECT USING (true);
CREATE POLICY "Public read metabolic" ON public.ref_metabolic_rules FOR SELECT USING (true);

