# Supabase Setup + ProtocolBuilder Enhancement Plan
**Date:** 2026-02-09  
**Purpose:** Complete Supabase setup verification + Designer instructions for ProtocolBuilder modal enhancement  
**Status:** READY TO EXECUTE

---

## PART 1: SUPABASE SETUP STATUS ✅

### Current State Analysis:

**✅ ALREADY CREATED (From Previous Sessions):**
1. `schema.sql` - Base tables (regulatory_states, news, profiles, etc.)
2. `migrations/001_patient_flow_foundation.sql` - Patient flow tables + views
3. `backend/sync_schema.sql` - Ghost tables fix (flow events)

**⚠️ NEEDS VERIFICATION:**
- Have these migrations been run in Supabase?
- Are all tables actually created in the database?

---

## STEP 1: Verify Supabase Setup (Run These Queries)

### Query 1: Check What Tables Exist

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

**Expected Tables (Minimum):**
- `sites`
- `user_sites`
- `profiles`
- `ref_flow_event_types`
- `ref_substances`
- `ref_routes`
- `ref_support_modality`
- `log_patient_flow_events`
- `regulatory_states`
- `news`

### Query 2: Check RLS Status

```sql
SELECT 
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

**Expected:** All tables should have `rls_enabled = true`

### Query 3: Check Reference Data

```sql
-- Check flow event types
SELECT COUNT(*) as event_types FROM public.ref_flow_event_types;
-- Expected: 9-11 rows

-- Check substances (if table exists)
SELECT COUNT(*) as substances FROM public.ref_substances;
-- Expected: 5+ rows

-- Check routes (if table exists)
SELECT COUNT(*) as routes FROM public.ref_routes;
-- Expected: 5+ rows
```

---

## STEP 2: Run Missing Migrations (If Needed)

### If Tables Are Missing, Run These In Order:

#### Migration 1: Base Schema
**File:** `schema.sql`  
**Run in:** Supabase SQL Editor  
**What it creates:** regulatory_states, news, profiles, ref_pharmacology, etc.

#### Migration 2: Patient Flow Foundation
**File:** `migrations/001_patient_flow_foundation.sql`  
**Run in:** Supabase SQL Editor  
**What it creates:** 
- ref_flow_event_types
- log_patient_flow_events
- v_flow_stage_counts (view)
- v_flow_time_to_next_step (view)
- v_followup_compliance (view)
- user_saved_views
- Helper functions

#### Migration 3: Demo Data (Optional)
**File:** `migrations/002_seed_demo_data_v2.2.sql`  
**Run in:** Supabase SQL Editor  
**What it creates:** 60 demo patients, 200+ flow events

---

## STEP 3: Create Missing Reference Tables

### These tables are referenced in ProtocolBuilder but don't exist yet:

```sql
-- ============================================================================
-- MISSING REFERENCE TABLES FOR PROTOCOLBUILDER
-- ============================================================================

-- 1. Substances Table
CREATE TABLE IF NOT EXISTS public.ref_substances (
    substance_id BIGSERIAL PRIMARY KEY,
    substance_name TEXT NOT NULL UNIQUE,
    rxnorm_cui BIGINT,  -- RxNorm Concept Unique Identifier
    substance_class TEXT,  -- 'psychedelic', 'dissociative', 'empathogen', etc.
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed substances from ProtocolBuilder
INSERT INTO public.ref_substances (substance_name, substance_class) VALUES
('Psilocybin', 'psychedelic'),
('MDMA', 'empathogen'),
('Ketamine', 'dissociative'),
('LSD-25', 'psychedelic'),
('5-MeO-DMT', 'psychedelic'),
('Ibogaine', 'psychedelic'),
('Mescaline', 'psychedelic'),
('Other / Investigational', 'other')
ON CONFLICT (substance_name) DO NOTHING;

-- 2. Routes Table
CREATE TABLE IF NOT EXISTS public.ref_routes (
    route_id BIGSERIAL PRIMARY KEY,
    route_name TEXT NOT NULL UNIQUE,
    route_code TEXT,  -- SNOMED CT code
    route_label TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed routes from ProtocolBuilder
INSERT INTO public.ref_routes (route_name, route_label) VALUES
('Oral', 'Oral'),
('Intravenous', 'IV'),
('Intramuscular', 'IM'),
('Intranasal', 'Intranasal'),
('Sublingual', 'Sublingual'),
('Buccal', 'Buccal'),
('Rectal', 'Rectal'),
('Subcutaneous', 'SC'),
('Other / Non-Standard', 'Other')
ON CONFLICT (route_name) DO NOTHING;

-- 3. Support Modalities Table
CREATE TABLE IF NOT EXISTS public.ref_support_modality (
    modality_id BIGSERIAL PRIMARY KEY,
    modality_name TEXT NOT NULL UNIQUE,
    modality_code TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed modalities from ProtocolBuilder
INSERT INTO public.ref_support_modality (modality_name, description) VALUES
('CBT', 'Cognitive Behavioral Therapy'),
('Somatic', 'Somatic Experiencing'),
('Psychodynamic', 'Psychodynamic Therapy'),
('IFS', 'Internal Family Systems'),
('None/Sitter', 'No therapeutic modality, sitter only')
ON CONFLICT (modality_name) DO NOTHING;

-- 4. Smoking Status Reference
CREATE TABLE IF NOT EXISTS public.ref_smoking_status (
    smoking_status_id BIGSERIAL PRIMARY KEY,
    status_name TEXT NOT NULL UNIQUE,
    status_code TEXT,  -- SNOMED CT code
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.ref_smoking_status (status_name) VALUES
('Non-Smoker'),
('Former Smoker'),
('Current Smoker (Occasional)'),
('Current Smoker (Daily)')
ON CONFLICT (status_name) DO NOTHING;

-- 5. Severity Grades (CTCAE)
CREATE TABLE IF NOT EXISTS public.ref_severity_grade (
    severity_grade_id BIGSERIAL PRIMARY KEY,
    grade_value INTEGER NOT NULL UNIQUE,
    grade_label TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.ref_severity_grade (grade_value, grade_label, description) VALUES
(1, 'Grade 1 - Mild', 'No intervention required'),
(2, 'Grade 2 - Moderate', 'Local intervention required'),
(3, 'Grade 3 - Severe', 'Hospitalization required'),
(4, 'Grade 4 - Life Threatening', 'Urgent intervention required'),
(5, 'Grade 5 - Death', 'Fatal outcome')
ON CONFLICT (grade_value) DO NOTHING;

-- 6. Safety Event Types
CREATE TABLE IF NOT EXISTS public.ref_safety_events (
    safety_event_id BIGSERIAL PRIMARY KEY,
    event_name TEXT NOT NULL UNIQUE,
    event_code TEXT,  -- MedDRA code (if available)
    event_category TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.ref_safety_events (event_name, event_category) VALUES
('Anxiety', 'psychological'),
('Confusional State', 'cognitive'),
('Dissociation', 'psychological'),
('Dizziness', 'neurological'),
('Headache', 'neurological'),
('Hypertension', 'cardiovascular'),
('Insomnia', 'sleep'),
('Nausea', 'gastrointestinal'),
('Panic Attack', 'psychological'),
('Paranoia', 'psychological'),
('Tachycardia', 'cardiovascular'),
('Visual Hallucination', 'perceptual'),
('Other - Non-PHI Clinical Observation', 'other')
ON CONFLICT (event_name) DO NOTHING;

-- 7. Resolution Status
CREATE TABLE IF NOT EXISTS public.ref_resolution_status (
    resolution_status_id BIGSERIAL PRIMARY KEY,
    status_name TEXT NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.ref_resolution_status (status_name) VALUES
('Resolved in Session'),
('Resolved Post-Session'),
('Unresolved/Lingering')
ON CONFLICT (status_name) DO NOTHING;

-- 8. Indications (Primary Conditions)
CREATE TABLE IF NOT EXISTS public.ref_indications (
    indication_id BIGSERIAL PRIMARY KEY,
    indication_name TEXT NOT NULL UNIQUE,
    snomed_code TEXT,  -- SNOMED CT code
    icd10_code TEXT,   -- ICD-10 code
    indication_category TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.ref_indications (indication_name, indication_category) VALUES
('Major Depressive Disorder (MDD)', 'mood'),
('Treatment-Resistant Depression (TRD)', 'mood'),
('Post-Traumatic Stress Disorder (PTSD)', 'trauma'),
('Generalized Anxiety Disorder (GAD)', 'anxiety'),
('Social Anxiety Disorder', 'anxiety'),
('Obsessive-Compulsive Disorder (OCD)', 'anxiety'),
('Substance Use Disorder', 'addiction'),
('End-of-Life Distress', 'palliative'),
('Other / Investigational', 'other')
ON CONFLICT (indication_name) DO NOTHING;

-- ============================================================================
-- ENABLE RLS ON ALL REFERENCE TABLES
-- ============================================================================

ALTER TABLE public.ref_substances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ref_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ref_support_modality ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ref_smoking_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ref_severity_grade ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ref_safety_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ref_resolution_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ref_indications ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES: Read for authenticated, Write for network_admin only
-- ============================================================================

-- Substances
CREATE POLICY "ref_substances_read" ON public.ref_substances FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "ref_substances_write" ON public.ref_substances FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_sites WHERE user_id = auth.uid() AND role = 'network_admin')
);

-- Routes
CREATE POLICY "ref_routes_read" ON public.ref_routes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "ref_routes_write" ON public.ref_routes FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_sites WHERE user_id = auth.uid() AND role = 'network_admin')
);

-- Support Modality
CREATE POLICY "ref_support_modality_read" ON public.ref_support_modality FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "ref_support_modality_write" ON public.ref_support_modality FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_sites WHERE user_id = auth.uid() AND role = 'network_admin')
);

-- Smoking Status
CREATE POLICY "ref_smoking_status_read" ON public.ref_smoking_status FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "ref_smoking_status_write" ON public.ref_smoking_status FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_sites WHERE user_id = auth.uid() AND role = 'network_admin')
);

-- Severity Grade
CREATE POLICY "ref_severity_grade_read" ON public.ref_severity_grade FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "ref_severity_grade_write" ON public.ref_severity_grade FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_sites WHERE user_id = auth.uid() AND role = 'network_admin')
);

-- Safety Events
CREATE POLICY "ref_safety_events_read" ON public.ref_safety_events FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "ref_safety_events_write" ON public.ref_safety_events FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_sites WHERE user_id = auth.uid() AND role = 'network_admin')
);

-- Resolution Status
CREATE POLICY "ref_resolution_status_read" ON public.ref_resolution_status FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "ref_resolution_status_write" ON public.ref_resolution_status FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_sites WHERE user_id = auth.uid() AND role = 'network_admin')
);

-- Indications
CREATE POLICY "ref_indications_read" ON public.ref_indications FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "ref_indications_write" ON public.ref_indications FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_sites WHERE user_id = auth.uid() AND role = 'network_admin')
);
```

---

## PART 2: DESIGNER INSTRUCTIONS FOR PROTOCOLBUILDER MODAL

### 🎨 TASK: Convert Hardcoded Dropdowns to Database-Driven

**Context:** ProtocolBuilder currently uses hardcoded arrays (SUBSTANCE_OPTIONS, ROUTE_OPTIONS, etc.). We need to convert these to fetch from Supabase reference tables.

---

### CRITICAL CONSTRAINTS (NON-NEGOTIABLE):

1. **NO VISUAL CHANGES** - Do not change fonts, sizes, colors, spacing, layout
2. **NO FREE-TEXT INPUTS** - All inputs must be dropdowns or structured selections
3. **STORE IDS, NOT LABELS** - Always store `substance_id`, not "Psilocybin"
4. **MAINTAIN EXISTING UX** - Same accordion behavior, same tooltips, same flow
5. **QUICK & EASY** - Minimize clicks, maximize defaults

---

### FIELDS TO CONVERT (From Hardcoded to Database):

| Current Hardcoded Array | Target Reference Table | Store As | Priority |
|------------------------|----------------------|----------|----------|
| `SUBSTANCE_OPTIONS` | `ref_substances` | `substance_id` (bigint) | 🔴 **HIGH** |
| `ROUTE_OPTIONS` | `ref_routes` | `route_id` (bigint) | 🔴 **HIGH** |
| `MODALITY_OPTIONS` | `ref_support_modality` | `support_modality_ids` (bigint[]) | 🔴 **HIGH** |
| `SMOKING_OPTIONS` | `ref_smoking_status` | `smoking_status_id` (bigint) | 🟡 **MEDIUM** |
| `SEVERITY_OPTIONS` | `ref_severity_grade` | `severity_grade_id` (bigint) | 🟡 **MEDIUM** |
| `SAFETY_EVENT_OPTIONS` | `ref_safety_events` | `safety_event_id` (bigint) | 🟡 **MEDIUM** |
| `RESOLUTION_OPTIONS` | `ref_resolution_status` | `resolution_status_id` (bigint) | 🟡 **MEDIUM** |

---

### NEW FIELDS TO ADD (From PROTOCOLBUILDER_DATA_MAPPING.md):

#### 1. **Primary Indication** (NEW)
- **Section:** Patient Demographics (after Smoking Status)
- **Type:** Dropdown (single select)
- **Data Source:** `ref_indications`
- **Store As:** `indication_id` (bigint)
- **Required:** Yes
- **Default:** None (force selection)
- **Label:** "Primary Indication"
- **Tooltip:** "What condition is being treated in this protocol?"

#### 2. **Session Number** (NEW)
- **Section:** Protocol Parameters (after Frequency)
- **Type:** Dropdown (single select)
- **Options:** Hardcoded for now (1-6+, Follow-up Only)
- **Store As:** `session_number` (integer)
- **Required:** Yes
- **Default:** 1
- **Label:** "Session Number"
- **Tooltip:** "Track which session this is in the patient's treatment journey."

#### 3. **Session Date** (NEW)
- **Section:** Clinical Outcomes & Safety (at top, before Psychological Difficulty)
- **Type:** Date picker
- **Store As:** `session_date` (date)
- **Required:** Yes
- **Default:** Today
- **Label:** "Session Date"
- **Tooltip:** "When did this session occur? Used for timeline analytics."
- **Privacy Note:** Display small text: "Date is stored as days-from-baseline for privacy."

#### 4. **Protocol Template** (NEW - Optional)
- **Section:** Protocol Parameters (at top, before Substance Compound)
- **Type:** Dropdown (single select)
- **Options:** Hardcoded for MVP ("Create New", "Standard Psilocybin 25mg", etc.)
- **Store As:** `protocol_template_id` (uuid, nullable)
- **Required:** No
- **Default:** null
- **Label:** "Protocol Template (Optional)"
- **Tooltip:** "Link this session to a reusable protocol template, or create a new one."

---

### IMPLEMENTATION PATTERN:

#### Example: Converting Substance Dropdown

**BEFORE (Hardcoded):**
```typescript
const SUBSTANCE_OPTIONS = [
  "Psilocybin",
  "MDMA",
  "Ketamine",
  // ...
];

<select value={formData.substance} onChange={...}>
  {SUBSTANCE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
</select>
```

**AFTER (Database-Driven):**
```typescript
const [substances, setSubstances] = useState<any[]>([]);

useEffect(() => {
  const fetchSubstances = async () => {
    const { data } = await supabase
      .from('ref_substances')
      .select('substance_id, substance_name')
      .eq('is_active', true)
      .order('substance_name');
    setSubstances(data || []);
  };
  fetchSubstances();
}, []);

<select 
  value={formData.substance_id}  // Store ID, not name
  onChange={(e) => setFormData({...formData, substance_id: parseInt(e.target.value)})}
>
  <option value="">Select Substance...</option>
  {substances.map(s => (
    <option key={s.substance_id} value={s.substance_id}>
      {s.substance_name}
    </option>
  ))}
</select>
```

---

### WHAT THIS UNLOCKS (For Future Analytics):

#### With These Changes, You Can Now Build:

1. **Substance-Specific Analytics**
   - Filter all charts by substance
   - Compare outcomes across substances
   - Dose-response curves per substance

2. **Route-Based Comparisons**
   - Oral vs IV vs IM effectiveness
   - Route-specific safety profiles
   - Bioavailability analysis

3. **Modality Effectiveness**
   - Which therapeutic modalities work best
   - Modality combinations analysis
   - Support intensity vs outcomes

4. **Indication-Specific Outcomes**
   - Depression vs PTSD vs Anxiety outcomes
   - Indication-specific drop-off rates
   - Condition-specific safety profiles

5. **Session Progression Tracking**
   - Patient journey timelines
   - Session-to-session improvement
   - Optimal session count analysis

6. **Safety Surveillance**
   - Adverse event rates by substance/route/dose
   - Severity distribution analysis
   - Resolution time tracking

7. **Cross-Site Benchmarking**
   - Your site vs network median
   - Percentile rankings
   - Best practice identification

---

### VISUAL PLACEMENT GUIDE:

```
SECTION: Patient Demographics
├── Subject Birth Reference (existing)
├── Age (existing)
├── Biological Sex (existing)
├── Smoking Status (existing → convert to ref_smoking_status)
├── Race/Ethnicity (existing)
├── Weight Range (existing)
└── 🆕 PRIMARY INDICATION (new - ref_indications)

SECTION: Protocol Parameters
├── 🆕 PROTOCOL TEMPLATE (new - optional, hardcoded for MVP)
├── Substance Compound (existing → convert to ref_substances)
├── Administration Route (existing → convert to ref_routes)
├── Standardized Dosage (existing - keep as-is)
├── Frequency (existing - keep as-is)
└── 🆕 SESSION NUMBER (new - hardcoded for MVP)

SECTION: Therapeutic Context
├── Setting (existing - keep as-is)
├── Prep Hours (existing - keep as-is)
├── Integration Hours (existing - keep as-is)
├── Support Modality (existing → convert to ref_support_modality, multi-select)
└── Concomitant Meds (existing - keep as-is)

SECTION: Clinical Outcomes & Safety
├── 🆕 SESSION DATE (new - date picker)
├── Psychological Difficulty (existing - keep as-is)
├── Baseline PHQ-9 Score (existing - keep as-is)
├── Resolution Status (existing → convert to ref_resolution_status)
├── Adverse Events Toggle (existing - keep as-is)
├── Severity (existing → convert to ref_severity_grade)
├── Primary Clinical Observation (existing → convert to ref_safety_events)
└── Consent Verified (existing - keep as-is)
```

---

### FORM DATA STATE UPDATES:

**BEFORE:**
```typescript
const [formData, setFormData] = useState({
  substance: SUBSTANCE_OPTIONS[0],  // String
  route: ROUTE_OPTIONS[0],          // String
  // ...
});
```

**AFTER:**
```typescript
const [formData, setFormData] = useState({
  substance_id: null,                    // bigint (FK)
  route_id: null,                        // bigint (FK)
  support_modality_ids: [],              // bigint[] (array of FKs)
  smoking_status_id: null,               // bigint (FK)
  severity_grade_id: null,               // bigint (FK)
  safety_event_id: null,                 // bigint (FK)
  resolution_status_id: null,            // bigint (FK)
  indication_id: null,                   // bigint (FK) - NEW
  session_number: 1,                     // integer - NEW
  session_date: new Date().toISOString().split('T')[0],  // date - NEW
  protocol_template_id: null,            // uuid - NEW
  // ... existing fields ...
});
```

---

### VALIDATION UPDATES:

```typescript
const isFormValid = useMemo(() => {
  return (
    formData.substance_id !== null &&      // Changed from substance !== ''
    formData.route_id !== null &&          // Changed from route !== ''
    formData.indication_id !== null &&     // NEW - required
    formData.session_number !== null &&    // NEW - required
    formData.session_date !== '' &&        // NEW - required
    formData.dosage.trim() !== '' &&
    formData.consentVerified === true
    // ... other validations ...
  );
}, [formData]);
```

---

## PART 3: BUILDER TASKS (After Designer Completes)

### Task 1: Wire New Fields to Supabase

Update `handleSubmit` function to store IDs instead of labels:

```typescript
const handleSubmit = async () => {
  // ... existing code ...
  
  const protocolPayload = {
    user_id: user.id,
    name: `${substanceName} Protocol - ${formData.patientInput || 'New'}`,
    substance_id: formData.substance_id,           // Store ID
    indication_id: formData.indication_id,         // Store ID
    status: 'active',
    dosing_schedule: {
      dosage: formData.dosage,
      dosageUnit: formData.dosageUnit,
      frequency: formData.frequency,
      route_id: formData.route_id                  // Store ID
    },
    safety_criteria: formData.hasSafetyEvent ? {
      event_id: formData.safety_event_id,          // Store ID
      severity_grade_id: formData.severity_grade_id, // Store ID
      resolution_status_id: formData.resolution_status_id // Store ID
    } : null,
    session_metadata: {
      session_number: formData.session_number,
      session_date: formData.session_date,
      protocol_template_id: formData.protocol_template_id
    },
    // ... rest of payload ...
  };
  
  // ... existing insert code ...
};
```

---

## SUMMARY: WHAT HAPPENS NEXT

### ✅ IMMEDIATE (This Session):
1. **YOU:** Run Supabase verification queries (Part 1)
2. **YOU:** Run missing reference table creation script (Step 3)
3. **DESIGNER:** Convert hardcoded dropdowns to database-driven (Part 2)
4. **DESIGNER:** Add 4 new fields (indication, session number, session date, protocol template)

### ⏸️ AFTER DESIGNER COMPLETES:
5. **BUILDER:** Wire new fields to `formData` state
6. **BUILDER:** Update `handleSubmit` to store IDs
7. **BUILDER:** Update validation logic
8. **BUILDER:** Test end-to-end flow

### 🚀 UNLOCKED CAPABILITIES:
- Substance-specific analytics
- Route-based comparisons
- Modality effectiveness tracking
- Indication-specific outcomes
- Session progression analysis
- Safety surveillance
- Cross-site benchmarking

---

**STATUS: READY FOR EXECUTION** ✅

**Next Action:** Run Supabase verification queries, then pass Part 2 to DESIGNER agent.
