# Database Schema Analysis: Research Alignment Assessment

**Analysis Date:** February 8, 2026  
**Analyst:** Antigravity AI  
**Scope:** Supabase schema vs. practitioner-focused research notes

---

## Executive Summary

**Overall Alignment Score: 3.5/10** ⚠️

Your current Supabase schema is optimized for **visualization dashboards** (regulatory tracking, news feeds, performance metrics) but has **critical gaps** for the practitioner-grade clinical dataset described in your research notes. The schema lacks FHIR-aligned structures and patient-level clinical data capture.

---

## Current Schema Inventory

### ✅ **Existing Tables**
1. `regulatory_states` - State-level psychedelic regulation tracking
2. `news` - Intelligence feed for regulatory/clinical updates
3. `profiles` - User/practitioner profiles
4. `log_clinical_performance` - Aggregated clinic metrics
5. `ref_pharmacology` - Receptor binding data (Ki values)
6. `ref_protocol_financials` - Protocol cost/revenue models
7. `ref_metabolic_rules` - Metabolizer safety rules
8. `view_patient_clusters` - View referencing `log_clinical_records` (table not defined in provided schema)

### ❌ **Referenced but Undefined**
- `log_clinical_records` (referenced in view, but CREATE statement missing)
- `log_outcomes` (mentioned in comments)
- `log_safety_events` (mentioned in comments)
- `log_interventions` (mentioned in comments)
- `ref_substances` (referenced by foreign key in `ref_pharmacology`)

---

## Gap Analysis by Research Bucket

### **Bucket 1: Patient Baseline (De-identified, PHI-safe)**

| Research Requirement | Current Schema | Status | Gap Severity |
|---------------------|----------------|--------|--------------|
| Age at treatment (age band) | ❌ Missing | **CRITICAL** | 🔴 High |
| Biological sex / gender identity | ❌ Missing | **CRITICAL** | 🔴 High |
| Region / setting type | ❌ Missing | **CRITICAL** | 🔴 High |
| Prior psychedelic exposure | ❌ Missing | **CRITICAL** | 🔴 High |
| Prior adverse reactions | ❌ Missing | **CRITICAL** | 🔴 High |
| Baseline symptom severity | ❌ Missing | **CRITICAL** | 🔴 High |

**Recommendation:**
```sql
CREATE TABLE public.patient_baseline (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_link_code TEXT UNIQUE NOT NULL, -- De-identified patient ID
    age_band TEXT CHECK (age_band IN ('18-24', '25-34', '35-44', '45-54', '55-64', '65+')),
    biological_sex TEXT CHECK (biological_sex IN ('male', 'female', 'other', 'declined')),
    gender_identity TEXT,
    region_state TEXT, -- State/province level only
    setting_type TEXT CHECK (setting_type IN ('urban', 'suburban', 'rural')),
    prior_psychedelic_exposure TEXT CHECK (prior_psychedelic_exposure IN ('none', 'past', 'recent')),
    prior_adverse_reactions BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
```

---

### **Bucket 2: Conditions and Clinical Risks**

| Research Requirement | Current Schema | Status | Gap Severity |
|---------------------|----------------|--------|--------------|
| Primary condition (SNOMED CT coded) | ❌ Missing | **CRITICAL** | 🔴 High |
| Comorbid behavioral health conditions | ❌ Missing | **CRITICAL** | 🔴 High |
| Relevant medical conditions | ❌ Missing | **CRITICAL** | 🔴 High |
| Risk factors for treatment planning | ❌ Missing | **CRITICAL** | 🔴 High |

**Recommendation:**
```sql
CREATE TABLE public.patient_conditions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_link_code TEXT REFERENCES public.patient_baseline(patient_link_code),
    condition_type TEXT CHECK (condition_type IN ('primary', 'comorbid_behavioral', 'medical', 'risk_factor')),
    snomed_code TEXT, -- SNOMED CT code
    condition_name TEXT NOT NULL,
    severity TEXT CHECK (severity IN ('mild', 'moderate', 'severe')),
    onset_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
```

---

### **Bucket 3: Concurrent Medications and Substances**

| Research Requirement | Current Schema | Status | Gap Severity |
|---------------------|----------------|--------|--------------|
| Current medication list (RxNorm coded) | ❌ Missing | **CRITICAL** | 🔴 High |
| Recent medication changes | ❌ Missing | **CRITICAL** | 🔴 High |
| Substance use context | ❌ Missing | **CRITICAL** | 🔴 High |

**Recommendation:**
```sql
CREATE TABLE public.patient_medications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_link_code TEXT REFERENCES public.patient_baseline(patient_link_code),
    rxnorm_code TEXT, -- RxNorm normalized drug code
    medication_name TEXT NOT NULL,
    dosage_value NUMERIC,
    dosage_unit TEXT, -- UCUM units
    frequency TEXT,
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT TRUE,
    medication_type TEXT CHECK (medication_type IN ('prescription', 'otc', 'supplement')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
```

---

### **Bucket 4: Protocol Definition (Reusable "Recipe")**

| Research Requirement | Current Schema | Status | Gap Severity |
|---------------------|----------------|--------|--------------|
| Substance/medication concept | ⚠️ Partial (`ref_substances` referenced but undefined) | **MAJOR** | 🟡 Medium |
| Route and method | ❌ Missing | **CRITICAL** | 🔴 High |
| Target dose range | ⚠️ Partial (`ref_protocol_financials` has avg duration) | **MAJOR** | 🟡 Medium |
| Planned sessions, cadence, escalation | ❌ Missing | **CRITICAL** | 🔴 High |
| Preparation/integration plan | ❌ Missing | **CRITICAL** | 🔴 High |
| Monitoring plan | ❌ Missing | **CRITICAL** | 🔴 High |
| Stop conditions/escalation pathways | ❌ Missing | **CRITICAL** | 🔴 High |

**Recommendation:**
```sql
CREATE TABLE public.protocol_definitions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    protocol_name TEXT NOT NULL,
    substance_id BIGINT REFERENCES public.ref_substances(substance_id),
    route TEXT CHECK (route IN ('oral', 'sublingual', 'IV', 'IM', 'intranasal')),
    method TEXT, -- e.g., "capsule", "lozenge", "infusion"
    target_dose_min NUMERIC,
    target_dose_max NUMERIC,
    dose_unit TEXT, -- UCUM units
    planned_sessions INTEGER,
    session_cadence_days INTEGER,
    preparation_sessions INTEGER,
    integration_sessions INTEGER,
    monitoring_plan JSONB, -- Structured: {vitals_frequency, instruments, intervals}
    escalation_rules JSONB, -- Structured: {stop_conditions, dose_adjustment_triggers}
    evidence_level TEXT CHECK (evidence_level IN ('peer_reviewed', 'preprint', 'conference', 'clinic_internal', 'anecdotal')),
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
```

---

### **Bucket 5: Session Delivery, Set/Setting, Monitoring**

| Research Requirement | Current Schema | Status | Gap Severity |
|---------------------|----------------|--------|--------------|
| Date relative to baseline | ❌ Missing | **CRITICAL** | 🔴 High |
| Actual administered dose | ❌ Missing | **CRITICAL** | 🔴 High |
| Route, method, formulation | ❌ Missing | **CRITICAL** | 🔴 High |
| Setting variables (individual/group, location, facilitators) | ❌ Missing | **CRITICAL** | 🔴 High |
| Vitals and observations at intervals | ❌ Missing | **CRITICAL** | 🔴 High |
| Patient-reported intensity/distress | ❌ Missing | **CRITICAL** | 🔴 High |
| Integration actions completed | ❌ Missing | **CRITICAL** | 🔴 High |

**Recommendation:**
```sql
CREATE TABLE public.session_records (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_link_code TEXT REFERENCES public.patient_baseline(patient_link_code),
    protocol_id UUID REFERENCES public.protocol_definitions(id),
    session_number INTEGER,
    days_from_baseline INTEGER, -- Privacy-preserving relative date
    administered_dose NUMERIC,
    dose_unit TEXT, -- UCUM
    route TEXT,
    method TEXT,
    formulation TEXT,
    setting_type TEXT CHECK (setting_type IN ('individual', 'group')),
    location_type TEXT CHECK (location_type IN ('in_clinic', 'supervised_other')),
    facilitator_roles JSONB, -- Array of role types present
    vitals_recorded JSONB, -- {time_offset_min, hr, bp_sys, bp_dia, spo2}
    intensity_ratings JSONB, -- {time_offset_min, intensity_0_10, distress_0_10}
    integration_completed BOOLEAN,
    integration_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
```

---

### **Bucket 6: Outcomes, Patient-Reported Measures, Adverse Events**

| Research Requirement | Current Schema | Status | Gap Severity |
|---------------------|----------------|--------|--------------|
| Standard symptom measures (LOINC coded) | ⚠️ Partial (`log_clinical_records` view references `outcome_score`) | **MAJOR** | 🟡 Medium |
| Function and QoL measures | ❌ Missing | **CRITICAL** | 🔴 High |
| Goal attainment | ❌ Missing | **CRITICAL** | 🔴 High |
| Dropout and reason | ❌ Missing | **CRITICAL** | 🔴 High |
| Adverse events (linked to context) | ⚠️ Partial (`log_safety_events` mentioned but undefined) | **MAJOR** | 🟡 Medium |

**Recommendation:**
```sql
CREATE TABLE public.patient_outcomes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_link_code TEXT REFERENCES public.patient_baseline(patient_link_code),
    session_id UUID REFERENCES public.session_records(id),
    measurement_type TEXT CHECK (measurement_type IN ('baseline', 'follow_up', 'endpoint')),
    days_from_baseline INTEGER,
    loinc_code TEXT, -- e.g., PHQ-9 total score LOINC code
    instrument_name TEXT, -- e.g., "PHQ-9", "GAD-7", "CAPS-5"
    score_value NUMERIC,
    functional_domain TEXT, -- e.g., "sleep", "relationships", "work_capacity"
    functional_improvement TEXT CHECK (functional_improvement IN ('improved', 'stable', 'worsened')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE public.patient_goals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_link_code TEXT REFERENCES public.patient_baseline(patient_link_code),
    goal_description TEXT NOT NULL,
    target_date DATE,
    attainment_status TEXT CHECK (attainment_status IN ('not_started', 'in_progress', 'achieved', 'abandoned')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE public.adverse_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_link_code TEXT REFERENCES public.patient_baseline(patient_link_code),
    session_id UUID REFERENCES public.session_records(id),
    event_type TEXT NOT NULL,
    severity TEXT CHECK (severity IN ('mild', 'moderate', 'severe', 'life_threatening')),
    onset_time_offset_min INTEGER, -- Minutes from session start
    resolution_time_offset_min INTEGER,
    intervention_required BOOLEAN,
    intervention_description TEXT,
    causality_assessment TEXT CHECK (causality_assessment IN ('definite', 'probable', 'possible', 'unlikely', 'unrelated')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
```

---

## Missing FHIR Alignment

Your research notes emphasize FHIR resource alignment, but **none of your current tables map to FHIR structures**:

| FHIR Resource | Research Purpose | Current Schema Equivalent | Status |
|---------------|------------------|---------------------------|--------|
| `Condition` | Diagnoses/problems | ❌ None | Missing |
| `Observation` | Measurements, assessments | ⚠️ Partial (view only) | Incomplete |
| `CarePlan` | Patient-specific plan | ❌ None | Missing |
| `PlanDefinition` | Reusable protocol template | ⚠️ Partial (`ref_protocol_financials`) | Incomplete |
| `MedicationRequest` | Ordered medication | ❌ None | Missing |
| `MedicationAdministration` | Actually administered | ❌ None | Missing |
| `Procedure` | Performed actions (therapy, counseling) | ❌ None | Missing |
| `Questionnaire` | Structured forms | ❌ None | Missing |
| `QuestionnaireResponse` | Form responses | ❌ None | Missing |
| `AdverseEvent` | Harm/near-harm events | ⚠️ Mentioned but undefined | Incomplete |
| `Consent` | Permission for data use | ❌ None | Missing |
| `Goal` | Patient-defined goals | ❌ None | Missing |
| `RiskAssessment` | Predictive risk tooling | ❌ None | Missing |

---

## What Your Current Schema **Does** Support

✅ **Regulatory intelligence** (state tracking, news aggregation)  
✅ **Practitioner profiles** (basic user management)  
✅ **Pharmacology reference data** (receptor binding, metabolizer rules)  
✅ **Financial modeling** (protocol cost/revenue)  
✅ **Performance dashboards** (aggregated clinic metrics)

---

## What Your Current Schema **Cannot** Support

❌ **Patient trajectory timelines** (no session-level data)  
❌ **Cohort comparisons** (no baseline demographics, conditions, or comorbidities)  
❌ **Practice-pattern benchmarking** (no preparation/integration intensity tracking)  
❌ **Safety heatmaps** (no adverse event linkage to setting variables)  
❌ **Missingness and quality flags** (no protocol documentation tracking)  
❌ **FHIR-compatible data exchange** (no resource-aligned structures)  
❌ **OMOP CDM analytics** (no standardized exposure/outcome/covariate modeling)

---

## Priority Recommendations

### **Phase 1: Foundation (Weeks 1-2)**
1. Create `patient_baseline` table with de-identified demographics
2. Create `patient_conditions` table with SNOMED CT coding
3. Create `patient_medications` table with RxNorm coding
4. Define missing reference table: `ref_substances`

### **Phase 2: Protocol & Session Capture (Weeks 3-4)**
5. Expand `protocol_definitions` with FHIR `PlanDefinition` alignment
6. Create `session_records` table for set/setting/monitoring data
7. Create `adverse_events` table with session linkage

### **Phase 3: Outcomes & Analytics (Weeks 5-6)**
8. Create `patient_outcomes` table with LOINC-coded instruments
9. Create `patient_goals` table for goal attainment tracking
10. Build views for cohort analytics and trajectory timelines

### **Phase 4: Standards Alignment (Weeks 7-8)**
11. Add FHIR resource ID mappings to all clinical tables
12. Implement OMOP CDM concept mappings for analytics
13. Add evidence level and provenance tracking to protocols

---

## Conclusion

Your current schema is **dashboard-ready but not research-ready**. To support the practitioner-grade dataset described in your research notes, you need to:

1. **Add 10+ new tables** for patient-level clinical data
2. **Align with FHIR resources** for interoperability
3. **Implement standard terminologies** (SNOMED CT, RxNorm, LOINC, UCUM)
4. **Track provenance and evidence levels** for protocols
5. **Enable cohort analytics** through proper baseline/outcome capture

**Estimated effort:** 6-8 weeks for full implementation with proper testing and RLS policies.

Would you like me to generate the complete SQL migration script for Phase 1?
