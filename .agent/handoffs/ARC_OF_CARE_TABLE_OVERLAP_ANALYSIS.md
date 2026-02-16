# Arc of Care vs Existing Tables - Cross-Reference Analysis

**Date:** 2026-02-16T05:39:19-08:00  
**Purpose:** Identify overlaps and opportunities to reuse existing tables

---

## 📊 EXISTING LOG_ TABLES

### Core Clinical Tables (000_init_core_tables.sql)
1. **log_clinical_records** - Main protocol/session data
   - Has: site_id, subject_id, substance_id, outcome_score
   - Used for: Protocol Builder submissions
   
2. **log_outcomes** - Outcome measures
   - Has: site_id, subject_id, outcome_measure, outcome_score, observed_at
   
3. **log_consent** - Consent tracking
   - Has: site_id, subject_id, consent_type, is_consented, verified_at
   
4. **log_interventions** - Treatment interventions
   - Has: site_id, subject_id, start_time, end_time, duration_minutes, notes
   
5. **log_safety_events** - Adverse events
   - Has: site_id, subject_id, severity_grade_id, event_description, resolution_status_id

### Additional Tables
6. **log_meq30** (011_add_source_and_meq30.sql) - MEQ-30 scores
7. **log_patient_flow_events** (001_patient_flow_foundation.sql) - Patient journey tracking
8. **log_sm_sessions** (022_shadow_market_schema.sql) - Shadow market sessions
9. **log_sm_doses** (022_shadow_market_schema.sql) - Shadow market doses
10. **log_sm_interventions** (022_shadow_market_schema.sql) - Shadow market interventions
11. **log_sm_risk_reports** (022_shadow_market_schema.sql) - Shadow market risk reports

---

## 🎯 ARC OF CARE TABLES (Proposed)

### Phase 1: Preparation
1. **log_baseline_assessments** - Pre-treatment assessments (PHQ-9, GAD-7, ACE, expectancy, HRV, BP)

### Phase 2: Dosing
2. **log_sessions** - Dosing sessions (substance, dosage, MEQ-30, EDI, CEQ)
3. **log_session_events** - Safety events and interventions during sessions
4. **log_session_vitals** - Real-time vital signs (HR, HRV, BP, SpO2)

### Phase 3: Integration
5. **log_pulse_checks** - Daily 2-question check-ins
6. **log_longitudinal_assessments** - Scheduled follow-up assessments (PHQ-9, WHOQOL, PSQI, C-SSRS)
7. **log_behavioral_changes** - Patient-reported life changes
8. **log_integration_sessions** - Therapy session attendance
9. **log_red_alerts** - Automated safety alerts

---

## 🔄 OVERLAP ANALYSIS

### ✅ CAN REUSE: log_clinical_records → log_sessions

**Current log_clinical_records has:**
- site_id, subject_id, substance_id ✅
- outcome_score ✅
- created_at, created_by ✅

**Arc of Care log_sessions needs:**
- site_id, patient_id, substance_id ✅ (rename subject_id → patient_id)
- session_number, session_date ❌ (need to add)
- dosage_mg, dosage_route, batch_number ❌ (need to add)
- dose_administered_at, onset_reported_at, peak_intensity_at, session_ended_at ❌ (need to add)
- meq30_score, edi_score, ceq_score ❌ (need to add)
- session_notes ❌ (need to add)
- guide_user_id ✅ (already have created_by)

**RECOMMENDATION:** 
- **EXTEND log_clinical_records** instead of creating log_sessions
- Add missing columns via ALTER TABLE
- This maintains backward compatibility with existing Protocol Builder

### ✅ CAN REUSE: log_safety_events → log_session_events

**Current log_safety_events has:**
- site_id, subject_id ✅
- severity_grade_id, event_description, resolution_status_id ✅
- occurred_at ✅

**Arc of Care log_session_events needs:**
- session_id (FK to log_sessions) ❌ (need to add)
- event_timestamp ✅ (already have occurred_at)
- event_type, meddra_code_id, intervention_type_id ❌ (need to add)
- is_resolved, resolved_at ✅ (already have resolution_status_id)

**RECOMMENDATION:**
- **EXTEND log_safety_events** instead of creating log_session_events
- Add session_id FK, event_type, meddra_code_id, intervention_type_id
- Rename occurred_at → event_timestamp for consistency

### ✅ CAN REUSE: log_interventions → (partial)

**Current log_interventions has:**
- site_id, subject_id ✅
- start_time, end_time, duration_minutes ✅
- notes ✅

**Arc of Care needs:**
- Intervention type (verbal, physical, chemical) ❌
- Link to specific session ❌

**RECOMMENDATION:**
- **EXTEND log_interventions** to add intervention_type_id and session_id
- Use for rescue protocol tracking

### ✅ CAN REUSE: log_outcomes → log_longitudinal_assessments

**Current log_outcomes has:**
- site_id, subject_id ✅
- outcome_measure, outcome_score ✅
- observed_at ✅

**Arc of Care log_longitudinal_assessments needs:**
- session_id (FK) ❌
- assessment_date ✅ (already have observed_at)
- days_post_session ❌ (can calculate)
- phq9_score, gad7_score, whoqol_score, psqi_score, cssrs_score ❌

**RECOMMENDATION:**
- **EXTEND log_outcomes** to add session_id and specific score columns
- OR keep separate for clarity (Arc of Care has specific assessment types)

### ❌ CANNOT REUSE: Need New Tables

These Arc of Care tables have no existing equivalent:
1. **log_baseline_assessments** - Pre-treatment data (PHQ-9, GAD-7, ACE, expectancy, HRV, BP)
2. **log_session_vitals** - Real-time biometric data (HR, HRV, BP, SpO2)
3. **log_pulse_checks** - Daily 2-question check-ins (connection, sleep)
4. **log_behavioral_changes** - Patient-reported life changes
5. **log_integration_sessions** - Therapy attendance tracking
6. **log_red_alerts** - Automated safety alerts

---

## 💡 STREAMLINED APPROACH

### Option A: Extend Existing Tables (Recommended)

**Advantages:**
- ✅ Maintains backward compatibility with Protocol Builder
- ✅ Reduces total table count (9 → 5 new tables)
- ✅ Reuses existing RLS policies
- ✅ Simpler database schema

**Changes Required:**

1. **ALTER log_clinical_records** (becomes log_sessions)
   ```sql
   ALTER TABLE log_clinical_records
     ADD COLUMN session_number INTEGER,
     ADD COLUMN session_date TIMESTAMP,
     ADD COLUMN dosage_mg DECIMAL(6,2),
     ADD COLUMN dosage_route VARCHAR(20),
     ADD COLUMN batch_number VARCHAR(50),
     ADD COLUMN dose_administered_at TIMESTAMP,
     ADD COLUMN onset_reported_at TIMESTAMP,
     ADD COLUMN peak_intensity_at TIMESTAMP,
     ADD COLUMN session_ended_at TIMESTAMP,
     ADD COLUMN meq30_score INTEGER CHECK (meq30_score BETWEEN 0 AND 100),
     ADD COLUMN edi_score INTEGER CHECK (edi_score BETWEEN 0 AND 100),
     ADD COLUMN ceq_score INTEGER CHECK (ceq_score BETWEEN 0 AND 100),
     ADD COLUMN session_notes TEXT,
     ADD COLUMN guide_user_id UUID REFERENCES auth.users(id);
   ```

2. **ALTER log_safety_events** (becomes log_session_events)
   ```sql
   ALTER TABLE log_safety_events
     ADD COLUMN session_id BIGINT REFERENCES log_clinical_records(clinical_record_id),
     ADD COLUMN event_type VARCHAR(50),
     ADD COLUMN meddra_code_id INTEGER REFERENCES ref_meddra_codes(id),
     ADD COLUMN intervention_type_id INTEGER REFERENCES ref_intervention_types(id),
     ADD COLUMN is_resolved BOOLEAN DEFAULT false,
     ADD COLUMN resolved_at TIMESTAMP;
   ```

3. **ALTER log_interventions**
   ```sql
   ALTER TABLE log_interventions
     ADD COLUMN session_id BIGINT REFERENCES log_clinical_records(clinical_record_id),
     ADD COLUMN intervention_type_id INTEGER REFERENCES ref_intervention_types(id);
   ```

4. **CREATE 5 new tables:**
   - log_baseline_assessments
   - log_session_vitals
   - log_pulse_checks
   - log_behavioral_changes (or extend log_outcomes?)
   - log_integration_sessions
   - log_red_alerts

**Total: 4 ALTER TABLE + 5 CREATE TABLE = 9 operations**

### Option B: Create All New Tables (Original Plan)

**Advantages:**
- ✅ Clean separation of Arc of Care data
- ✅ No risk of breaking existing Protocol Builder
- ✅ Easier to understand schema

**Disadvantages:**
- ❌ More tables to maintain (20 total vs 11 total)
- ❌ Duplicate data structures
- ❌ More RLS policies to manage

**Total: 3 CREATE ref_* + 9 CREATE log_* = 12 operations**

---

## 🎯 INSPECTOR RECOMMENDATION

**Go with Option A: Extend Existing Tables**

**Why:**
1. log_clinical_records is already your "sessions" table - just add Arc of Care fields
2. log_safety_events is already tracking adverse events - just add session linkage
3. Reduces total table count from 20 → 14 tables
4. Maintains backward compatibility
5. Simpler to maintain long-term

**Migration Strategy:**
1. Add 3 new ref_ tables (assessment_scales, intervention_types, meddra_codes)
2. ALTER 3 existing log_ tables (clinical_records, safety_events, interventions)
3. CREATE 6 new log_ tables (baseline_assessments, session_vitals, pulse_checks, behavioral_changes, integration_sessions, red_alerts)

**Total: 3 ref_ + 3 ALTER + 6 CREATE = 12 operations (vs 20 CREATE in original plan)**

---

## 📋 NEXT STEPS

**Would you like me to:**
1. Create a streamlined migration using Option A (extend existing tables)?
2. Keep the original migration (Option B - all new tables)?
3. Create both versions so you can choose?

Let me know your preference!

---

**END OF ANALYSIS**
