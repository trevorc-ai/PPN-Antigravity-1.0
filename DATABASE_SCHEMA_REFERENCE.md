# 📊 DATABASE SCHEMA REFERENCE
## Complete Field List for All `log_*` and `ref_*` Tables

**Generated:** 2026-02-17T00:07:37-08:00  
**Database:** PPN Research Portal (Supabase/PostgreSQL)  
**Total Tables:** 52 (22 log tables + 30 ref tables)

---

## 📋 TABLE OF CONTENTS

### LOG TABLES (Data Collection)
1. [log_clinical_records](#log_clinical_records) - Primary session/treatment records
2. [log_outcomes](#log_outcomes) - Outcome measures
3. [log_consent](#log_consent) - Consent tracking
4. [log_interventions](#log_interventions) - Treatment interventions
5. [log_safety_events](#log_safety_events) - Adverse events
6. [log_meq30](#log_meq30) - Mystical Experience Questionnaire
7. [log_patient_flow_events](#log_patient_flow_events) - Patient journey tracking
8. [log_baseline_assessments](#log_baseline_assessments) - Pre-treatment assessments
9. [log_session_vitals](#log_session_vitals) - Real-time biometrics
10. [log_pulse_checks](#log_pulse_checks) - Daily check-ins
11. [log_longitudinal_assessments](#log_longitudinal_assessments) - Follow-up assessments
12. [log_behavioral_changes](#log_behavioral_changes) - Life changes tracking
13. [log_integration_sessions](#log_integration_sessions) - Therapy attendance
14. [log_red_alerts](#log_red_alerts) - Automated safety alerts
15. [log_baseline_observations](#log_baseline_observations) - Baseline clinical notes
16. [log_session_observations](#log_session_observations) - Session clinical notes
17. [log_safety_event_observations](#log_safety_event_observations) - Safety event details
18. [log_feature_requests](#log_feature_requests) - Vocabulary expansion requests
19. [log_sm_sessions](#log_sm_sessions) - Shadow Market sessions
20. [log_sm_doses](#log_sm_doses) - Shadow Market dosages
21. [log_sm_interventions](#log_sm_interventions) - Shadow Market interventions
22. [log_sm_risk_reports](#log_sm_risk_reports) - Shadow Market risk flags

### REF TABLES (Reference Data)
23. [ref_substances](#ref_substances) - Psychedelic substances
24. [ref_routes](#ref_routes) - Routes of administration
25. [ref_sources](#ref_sources) - Data sources
26. [ref_severity_grade](#ref_severity_grade) - Adverse event severity
27. [ref_resolution_status](#ref_resolution_status) - Event resolution status
28. [ref_flow_event_types](#ref_flow_event_types) - Patient flow event types
29. [ref_support_modality](#ref_support_modality) - Support modalities
30. [ref_assessment_scales](#ref_assessment_scales) - Assessment scales
31. [ref_intervention_types](#ref_intervention_types) - Intervention types
32. [ref_meddra_codes](#ref_meddra_codes) - MedDRA adverse event codes
33. [ref_clinical_observations](#ref_clinical_observations) - Clinical observations
34. [ref_cancellation_reasons](#ref_cancellation_reasons) - Cancellation reasons
35. [ref_sm_substances](#ref_sm_substances) - Shadow Market substances
36. [ref_sm_interventions](#ref_sm_interventions) - Shadow Market interventions
37. [ref_sm_risk_flags](#ref_sm_risk_flags) - Shadow Market risk flags
38. [ref_dosage_units](#ref_dosage_units) - Dosage units
39. [ref_dosage_frequency](#ref_dosage_frequency) - Dosage frequency
40. [ref_medications](#ref_medications) - Medications
41. [ref_drug_interactions](#ref_drug_interactions) - Drug interactions
42. [ref_medication_risk_weights](#ref_medication_risk_weights) - Medication risk weights
43. [ref_indications](#ref_indications) - Medical indications
44. [ref_license_types](#ref_license_types) - License types
45. [ref_user_roles](#ref_user_roles) - User roles
46. [ref_sex](#ref_sex) - Biological sex
47. [ref_smoking_status](#ref_smoking_status) - Smoking status
48. [ref_weight_ranges](#ref_weight_ranges) - Weight ranges
49. [ref_settings](#ref_settings) - Treatment settings
50. [ref_safety_events](#ref_safety_events) - Safety event types
51. [ref_mhq_scores](#ref_mhq_scores) - Mental Health Questionnaire scores
52. [ref_knowledge_graph](#ref_knowledge_graph) - Knowledge graph entities

---

# LOG TABLES (Data Collection)

## log_clinical_records
**Purpose:** Primary session/treatment records (flattened core data table)  
**Table:** `public.log_clinical_records`

| Field | Type | Description |
|-------|------|-------------|
| `clinical_record_id` | BIGSERIAL | Primary key |
| `site_id` | BIGINT | Foreign key to sites |
| `subject_id` | BIGINT | Internal patient ID (not PHI) |
| `patient_link_code` | TEXT | Legacy patient identifier |
| `protocol_id` | UUID | Protocol identifier |
| `substance_id` | BIGINT | Foreign key to ref_substances |
| `outcome_score` | INTEGER | Outcome measure score |
| `dosage_mg` | DECIMAL(6,2) | Dosage in milligrams |
| `dosage_route` | VARCHAR(20) | Route of administration |
| `batch_number` | VARCHAR(50) | Batch/lot number for traceability |
| `dose_administered_at` | TIMESTAMP | When dose was administered |
| `onset_reported_at` | TIMESTAMP | When patient reported onset |
| `peak_intensity_at` | TIMESTAMP | When peak intensity occurred |
| `session_ended_at` | TIMESTAMP | When session ended |
| `meq30_score` | INTEGER | MEQ-30 total score (0-100) |
| `meq30_completed_at` | TIMESTAMP | When MEQ-30 was completed |
| `edi_score` | INTEGER | Ego Dissolution Inventory score (0-100) |
| `edi_completed_at` | TIMESTAMP | When EDI was completed |
| `ceq_score` | INTEGER | Challenging Experience Questionnaire score (0-100) |
| `ceq_completed_at` | TIMESTAMP | When CEQ was completed |
| `guide_user_id` | UUID | Foreign key to auth.users (session guide) |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `created_by` | UUID | Foreign key to auth.users (creator) |
| `updated_at` | TIMESTAMPTZ | Record update timestamp |

---

## log_outcomes
**Purpose:** Specific outcome measures (separate from clinical records)  
**Table:** `public.log_outcomes`

| Field | Type | Description |
|-------|------|-------------|
| `outcome_id` | BIGSERIAL | Primary key |
| `site_id` | BIGINT | Foreign key to sites |
| `subject_id` | BIGINT | Internal patient ID |
| `outcome_measure` | TEXT | Name of outcome measure |
| `outcome_score` | INTEGER | Outcome score value |
| `observed_at` | TIMESTAMPTZ | When outcome was observed |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `created_by` | UUID | Foreign key to auth.users (creator) |

---

## log_consent
**Purpose:** Consent tracking (HIPAA compliance)  
**Table:** `public.log_consent`

| Field | Type | Description |
|-------|------|-------------|
| `consent_id` | BIGSERIAL | Primary key |
| `site_id` | BIGINT | Foreign key to sites |
| `subject_id` | BIGINT | Internal patient ID |
| `consent_type` | TEXT | Type of consent (Informed Consent, HIPAA, etc.) |
| `is_consented` | BOOLEAN | Whether consent was obtained |
| `verified_at` | TIMESTAMPTZ | When consent was verified |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `created_by` | UUID | Foreign key to auth.users (creator) |

---

## log_interventions
**Purpose:** Treatment interventions (rescue protocols)  
**Table:** `public.log_interventions`

| Field | Type | Description |
|-------|------|-------------|
| `intervention_id` | BIGSERIAL | Primary key |
| `site_id` | BIGINT | Foreign key to sites |
| `subject_id` | BIGINT | Internal patient ID |
| `start_time` | TIMESTAMPTZ | When intervention started |
| `end_time` | TIMESTAMPTZ | When intervention ended |
| `duration_minutes` | INTEGER | Duration in minutes |
| `source_id` | BIGINT | Foreign key to ref_sources |
| `session_id` | UUID | Foreign key to log_clinical_records |
| `intervention_type_id` | INTEGER | Foreign key to ref_intervention_types |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `created_by` | UUID | Foreign key to auth.users (creator) |

---

## log_safety_events
**Purpose:** Adverse events tracking (safety surveillance)  
**Table:** `public.log_safety_events`

| Field | Type | Description |
|-------|------|-------------|
| `safety_event_id` | BIGSERIAL | Primary key |
| `ae_id` | TEXT | Adverse event identifier |
| `site_id` | BIGINT | Foreign key to sites |
| `subject_id` | BIGINT | Internal patient ID |
| `severity_grade_id` | BIGINT | Foreign key to ref_severity_grade |
| `event_description` | TEXT | Description of event (⚠️ PHI risk - should be replaced) |
| `resolution_status_id` | BIGINT | Foreign key to ref_resolution_status |
| `occurred_at` | TIMESTAMPTZ | When event occurred |
| `session_id` | UUID | Foreign key to log_clinical_records |
| `event_type` | VARCHAR(50) | Type of event |
| `meddra_code_id` | INTEGER | Foreign key to ref_meddra_codes |
| `intervention_type_id` | INTEGER | Foreign key to ref_intervention_types |
| `is_resolved` | BOOLEAN | Whether event is resolved |
| `resolved_at` | TIMESTAMP | When event was resolved |
| `logged_by_user_id` | UUID | Foreign key to auth.users (logger) |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `created_by` | UUID | Foreign key to auth.users (creator) |

---

## log_meq30
**Purpose:** Mystical Experience Questionnaire-30 outcomes  
**Table:** `public.log_meq30`

| Field | Type | Description |
|-------|------|-------------|
| `meq_id` | BIGSERIAL | Primary key |
| `site_id` | BIGINT | Foreign key to sites |
| `subject_id` | BIGINT | Internal patient ID |
| `session_id` | BIGINT | Foreign key to log_clinical_records |
| `completed_at` | TIMESTAMPTZ | When questionnaire was completed |
| `raw_responses` | JSONB | All 30 item responses (0-5 scale each) |
| `total_score` | INTEGER | Total score (0-150) |
| `score_mystical` | INTEGER | Mystical factor score (0-60) |
| `score_positive_mood` | INTEGER | Positive mood factor score (0-30) |
| `score_transcendence` | INTEGER | Transcendence factor score (0-30) |
| `score_ineffability` | INTEGER | Ineffability factor score (0-15) |
| `notes` | TEXT | Additional notes |
| `created_by` | UUID | Foreign key to auth.users (creator) |

---

## log_patient_flow_events
**Purpose:** Patient journey tracking (intake → session → integration)  
**Table:** `public.log_patient_flow_events`

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `site_id` | UUID | Site identifier |
| `practitioner_id` | UUID | Practitioner identifier |
| `patient_link_code_hash` | TEXT | SHA-256 hashed patient identifier |
| `event_type_id` | BIGINT | Foreign key to ref_flow_event_types |
| `event_at` | TIMESTAMPTZ | When event occurred |
| `protocol_id` | UUID | Protocol identifier |
| `substance_id` | BIGINT | Substance identifier |
| `route_id` | BIGINT | Route identifier |
| `support_modality_ids` | BIGINT[] | Array of support modality IDs |
| `source_table` | TEXT | Source table name for traceability |
| `source_id` | UUID | Source record ID for traceability |
| `notes` | TEXT | Additional notes |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `created_by` | UUID | Foreign key to auth.users (creator) |
| `updated_at` | TIMESTAMPTZ | Record update timestamp |

---

## log_baseline_assessments
**Purpose:** Phase 1 - Preparation assessments  
**Table:** `log_baseline_assessments`

| Field | Type | Description |
|-------|------|-------------|
| `baseline_assessment_id` | SERIAL | Primary key |
| `patient_id` | VARCHAR(10) | Patient identifier |
| `site_id` | UUID | Foreign key to log_sites |
| `assessment_date` | TIMESTAMP | Date of assessment |
| `phq9_score` | INTEGER | PHQ-9 score (0-27) - Depression severity |
| `gad7_score` | INTEGER | GAD-7 score (0-21) - Anxiety severity |
| `ace_score` | INTEGER | ACE score (0-10) - Adverse Childhood Experiences |
| `pcl5_score` | INTEGER | PCL-5 score (0-80) - PTSD symptoms |
| `expectancy_scale` | INTEGER | Treatment expectancy (1-100) |
| `resting_hrv` | DECIMAL(5,2) | Resting heart rate variability (ms) |
| `resting_bp_systolic` | INTEGER | Resting systolic blood pressure (mmHg) |
| `resting_bp_diastolic` | INTEGER | Resting diastolic blood pressure (mmHg) |
| `completed_by_user_id` | UUID | Foreign key to auth.users (completer) |
| `created_at` | TIMESTAMP | Record creation timestamp |
| `updated_at` | TIMESTAMP | Record update timestamp |

---

## log_session_vitals
**Purpose:** Phase 2 - Real-time biometric data during dosing  
**Table:** `log_session_vitals`

| Field | Type | Description |
|-------|------|-------------|
| `session_vital_id` | SERIAL | Primary key |
| `session_id` | UUID | Foreign key to log_clinical_records |
| `recorded_at` | TIMESTAMP | When vital signs were recorded |
| `heart_rate` | INTEGER | Heart rate (40-200 bpm) |
| `hrv` | DECIMAL(5,2) | Heart rate variability (ms) |
| `bp_systolic` | INTEGER | Systolic blood pressure (60-250 mmHg) |
| `bp_diastolic` | INTEGER | Diastolic blood pressure (40-150 mmHg) |
| `oxygen_saturation` | INTEGER | Oxygen saturation (70-100%) |
| `source` | VARCHAR(50) | Data source (e.g., "Apple Watch", "Manual") |
| `device_id` | VARCHAR(100) | Device identifier |
| `created_at` | TIMESTAMP | Record creation timestamp |

---

## log_pulse_checks
**Purpose:** Phase 3 - Integration daily check-ins  
**Table:** `log_pulse_checks`

| Field | Type | Description |
|-------|------|-------------|
| `pulse_check_id` | SERIAL | Primary key |
| `patient_id` | VARCHAR(10) | Patient identifier |
| `session_id` | UUID | Foreign key to log_clinical_records |
| `check_date` | DATE | Date of check-in |
| `connection_level` | INTEGER | Connection level (1-5) |
| `sleep_quality` | INTEGER | Sleep quality (1-5) |
| `mood_level` | INTEGER | Mood level (1-5) |
| `anxiety_level` | INTEGER | Anxiety level (1-5) |
| `completed_at` | TIMESTAMP | When check-in was completed |

---

## log_longitudinal_assessments
**Purpose:** Scheduled follow-up assessments (symptom tracking)  
**Table:** `log_longitudinal_assessments`

| Field | Type | Description |
|-------|------|-------------|
| `longitudinal_assessment_id` | SERIAL | Primary key |
| `patient_id` | VARCHAR(10) | Patient identifier |
| `session_id` | UUID | Foreign key to log_clinical_records |
| `assessment_date` | DATE | Date of assessment |
| `days_post_session` | INTEGER | Days since dosing session |
| `phq9_score` | INTEGER | PHQ-9 score (0-27) |
| `gad7_score` | INTEGER | GAD-7 score (0-21) |
| `whoqol_score` | INTEGER | WHO Quality of Life score (0-100) |
| `psqi_score` | INTEGER | Pittsburgh Sleep Quality Index (0-21) |
| `cssrs_score` | INTEGER | Columbia Suicide Severity Rating Scale (0-5) ⚠️ RED ALERT if ≥3 |
| `completed_at` | TIMESTAMP | When assessment was completed |

---

## log_behavioral_changes
**Purpose:** Patient-reported life changes  
**Table:** `log_behavioral_changes`

| Field | Type | Description |
|-------|------|-------------|
| `behavioral_change_id` | SERIAL | Primary key |
| `patient_id` | VARCHAR(10) | Patient identifier |
| `session_id` | UUID | Foreign key to log_clinical_records |
| `change_date` | DATE | Date of change |
| `change_type` | VARCHAR(50) | Type of change (Relationship, Career, Health, etc.) |
| `is_positive` | BOOLEAN | Whether change is positive |
| `logged_at` | TIMESTAMP | When change was logged |

---

## log_integration_sessions
**Purpose:** Therapy attendance tracking  
**Table:** `log_integration_sessions`

| Field | Type | Description |
|-------|------|-------------|
| `integration_session_id` | SERIAL | Primary key |
| `patient_id` | VARCHAR(10) | Patient identifier |
| `dosing_session_id` | UUID | Foreign key to log_clinical_records |
| `integration_session_number` | INTEGER | Session number (1, 2, 3...) |
| `session_date` | DATE | Date of integration session |
| `session_duration_minutes` | INTEGER | Session duration in minutes |
| `therapist_user_id` | UUID | Foreign key to auth.users (therapist) |
| `attended` | BOOLEAN | Whether patient attended |
| `cancellation_reason_id` | INTEGER | Foreign key to ref_cancellation_reasons |
| `created_at` | TIMESTAMP | Record creation timestamp |

---

## log_red_alerts
**Purpose:** Automated safety alerts (e.g., CSSRS score ≥ 3)  
**Table:** `log_red_alerts`

| Field | Type | Description |
|-------|------|-------------|
| `red_alert_id` | SERIAL | Primary key |
| `patient_id` | VARCHAR(10) | Patient identifier |
| `alert_type` | VARCHAR(50) | Type of alert (e.g., "CSSRS_HIGH_RISK") |
| `alert_severity` | VARCHAR(20) | Severity (e.g., "CRITICAL") |
| `alert_triggered_at` | TIMESTAMP | When alert was triggered |
| `trigger_value` | JSONB | Value that triggered alert (e.g., {"cssrs_score": 4}) |
| `is_acknowledged` | BOOLEAN | Whether alert has been acknowledged |
| `acknowledged_by_user_id` | UUID | Foreign key to auth.users (acknowledger) |
| `acknowledged_at` | TIMESTAMP | When alert was acknowledged |
| `is_resolved` | BOOLEAN | Whether alert is resolved |
| `resolved_at` | TIMESTAMP | When alert was resolved |
| `created_at` | TIMESTAMP | Record creation timestamp |

---

## log_baseline_observations
**Purpose:** Link baseline assessments to controlled observations (replaces free-text)  
**Table:** `log_baseline_observations`

| Field | Type | Description |
|-------|------|-------------|
| `id` | SERIAL | Primary key |
| `baseline_assessment_id` | INTEGER | Foreign key to log_baseline_assessments |
| `observation_id` | INTEGER | Foreign key to ref_clinical_observations |
| `created_at` | TIMESTAMP | Record creation timestamp |

---

## log_session_observations
**Purpose:** Link sessions to controlled observations (replaces session_notes)  
**Table:** `log_session_observations`

| Field | Type | Description |
|-------|------|-------------|
| `id` | SERIAL | Primary key |
| `session_id` | UUID | Foreign key to log_clinical_records |
| `observation_id` | INTEGER | Foreign key to ref_clinical_observations |
| `created_at` | TIMESTAMP | Record creation timestamp |

---

## log_safety_event_observations
**Purpose:** Link safety events to controlled observations  
**Table:** `log_safety_event_observations`

| Field | Type | Description |
|-------|------|-------------|
| `id` | SERIAL | Primary key |
| `safety_event_id` | TEXT | Foreign key to log_safety_events.ae_id |
| `observation_id` | INTEGER | Foreign key to ref_clinical_observations |
| `created_at` | TIMESTAMP | Record creation timestamp |

---

## log_feature_requests
**Purpose:** User-requested additions to controlled vocabulary  
**Table:** `log_feature_requests`

| Field | Type | Description |
|-------|------|-------------|
| `request_id` | SERIAL | Primary key |
| `user_id` | UUID | Foreign key to auth.users (requester) |
| `site_id` | UUID | Foreign key to log_sites |
| `request_type` | VARCHAR(50) | Type of request (observation, cancellation_reason, other) |
| `requested_text` | TEXT | Text of requested addition |
| `category` | VARCHAR(50) | Category (baseline, session, integration, safety) |
| `status` | VARCHAR(20) | Status (pending, approved, rejected) |
| `reviewed_by` | UUID | Foreign key to auth.users (reviewer) |
| `reviewed_at` | TIMESTAMP | When request was reviewed |
| `rejection_reason` | TEXT | Reason for rejection (if applicable) |
| `created_at` | TIMESTAMP | Record creation timestamp |

---

## log_sm_sessions
**Purpose:** Shadow Market session metadata (zero-knowledge harm reduction)  
**Table:** `public.log_sm_sessions`

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Foreign key to auth.users |
| `client_blind_hash` | TEXT | SHA-256 hash of client phone number |
| `protocol_id` | UUID | Protocol identifier |
| `jurisdiction_code` | INTEGER | Numeric jurisdiction code (no text) |
| `is_duress_mode` | BOOLEAN | Panic flag for duress situations |
| `start_time` | TIMESTAMPTZ | Session start time |
| `end_time` | TIMESTAMPTZ | Session end time |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Record update timestamp |

---

## log_sm_doses
**Purpose:** Shadow Market dosage records  
**Table:** `public.log_sm_doses`

| Field | Type | Description |
|-------|------|-------------|
| `id` | BIGSERIAL | Primary key |
| `session_id` | UUID | Foreign key to log_sm_sessions |
| `substance_id` | INTEGER | Foreign key to ref_sm_substances |
| `dosage_amount` | NUMERIC | Dosage amount |
| `dosage_unit_id` | BIGINT | Foreign key to ref_dosage_units |
| `potency_modifier` | NUMERIC | Potency modifier (0.1-5.0) |
| `effective_dose_mg` | NUMERIC | Calculated effective dose (GENERATED COLUMN) |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |

---

## log_sm_interventions
**Purpose:** Shadow Market intervention timeline  
**Table:** `public.log_sm_interventions`

| Field | Type | Description |
|-------|------|-------------|
| `id` | BIGSERIAL | Primary key |
| `session_id` | UUID | Foreign key to log_sm_sessions |
| `intervention_id` | INTEGER | Foreign key to ref_sm_interventions |
| `seconds_since_start` | INTEGER | Elapsed time from session start (seconds) |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |

---

## log_sm_risk_reports
**Purpose:** Anonymous risk flags for blind vetting  
**Table:** `public.log_sm_risk_reports`

| Field | Type | Description |
|-------|------|-------------|
| `id` | BIGSERIAL | Primary key |
| `target_client_hash` | TEXT | SHA-256 hash of flagged client |
| `flag_type_id` | INTEGER | Foreign key to ref_sm_risk_flags |
| `reported_by` | UUID | Foreign key to auth.users (nullable for anonymity) |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |

---

# REF TABLES (Reference Data)

## ref_substances
**Purpose:** Psychedelic substances catalog  
**Table:** `public.ref_substances`

| Field | Type | Description |
|-------|------|-------------|
| `substance_id` | BIGSERIAL | Primary key |
| `substance_name` | VARCHAR(100) | Substance name (e.g., "Psilocybin", "MDMA") |
| `substance_category` | VARCHAR(50) | Category (psychedelic, empathogen, dissociative) |
| `is_active` | BOOLEAN | Whether substance is active in system |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |

---

## ref_routes
**Purpose:** Routes of administration  
**Table:** `public.ref_routes`

| Field | Type | Description |
|-------|------|-------------|
| `route_id` | BIGSERIAL | Primary key |
| `route_name` | VARCHAR(50) | Route name (Oral, Sublingual, IM, IV, etc.) |
| `route_description` | TEXT | Description of route |
| `is_active` | BOOLEAN | Whether route is active in system |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |

---

## ref_sources
**Purpose:** Data sources (substance producers/suppliers)  
**Table:** `public.ref_sources`

| Field | Type | Description |
|-------|------|-------------|
| `source_id` | BIGSERIAL | Primary key |
| `source_name` | VARCHAR(100) | Source name |
| `source_type` | VARCHAR(50) | Source type (manufacturer, supplier, etc.) |
| `is_active` | BOOLEAN | Whether source is active in system |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |

---

## ref_severity_grade
**Purpose:** Adverse event severity grades (1-5)  
**Table:** `public.ref_severity_grade`

| Field | Type | Description |
|-------|------|-------------|
| `severity_grade_id` | BIGSERIAL | Primary key |
| `grade_number` | INTEGER | Grade number (1-5) |
| `grade_name` | VARCHAR(50) | Grade name (Mild, Moderate, Severe, Life-Threatening, Death) |
| `grade_description` | TEXT | Description of grade |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |

---

## ref_resolution_status
**Purpose:** Event resolution status  
**Table:** `public.ref_resolution_status`

| Field | Type | Description |
|-------|------|-------------|
| `resolution_status_id` | BIGSERIAL | Primary key |
| `status_name` | VARCHAR(50) | Status name (Resolved, Ongoing, Unresolved) |
| `status_description` | TEXT | Description of status |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |

---

## ref_flow_event_types
**Purpose:** Patient flow event types  
**Table:** `public.ref_flow_event_types`

| Field | Type | Description |
|-------|------|-------------|
| `id` | BIGSERIAL | Primary key |
| `event_code` | VARCHAR(50) | Event code (e.g., "INTAKE", "DOSING", "INTEGRATION") |
| `event_name` | VARCHAR(100) | Event name |
| `event_description` | TEXT | Description of event |
| `is_active` | BOOLEAN | Whether event type is active |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |

---

## ref_support_modality
**Purpose:** Support modalities (therapy types)  
**Table:** `public.ref_support_modality`

| Field | Type | Description |
|-------|------|-------------|
| `support_modality_id` | BIGSERIAL | Primary key |
| `modality_name` | VARCHAR(100) | Modality name (e.g., "CBT", "ACT", "Somatic") |
| `modality_description` | TEXT | Description of modality |
| `is_active` | BOOLEAN | Whether modality is active |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |

---

## ref_assessment_scales
**Purpose:** Assessment scales (PHQ-9, GAD-7, MEQ-30, etc.)  
**Table:** `ref_assessment_scales`

| Field | Type | Description |
|-------|------|-------------|
| `assessment_scale_id` | SERIAL | Primary key |
| `scale_code` | VARCHAR(20) | Scale code (e.g., "PHQ9", "GAD7") |
| `scale_name` | VARCHAR(100) | Scale name |
| `scale_description` | TEXT | Description of scale |
| `min_score` | INTEGER | Minimum score |
| `max_score` | INTEGER | Maximum score |
| `loinc_code` | VARCHAR(20) | LOINC code (standardized) |
| `snomed_code` | VARCHAR(20) | SNOMED code (standardized) |
| `scoring_interpretation` | JSONB | Score interpretation ranges |
| `is_active` | BOOLEAN | Whether scale is active |
| `created_at` | TIMESTAMP | Record creation timestamp |

---

## ref_intervention_types
**Purpose:** Intervention types (rescue protocols)  
**Table:** `ref_intervention_types`

| Field | Type | Description |
|-------|------|-------------|
| `intervention_type_id` | SERIAL | Primary key |
| `intervention_code` | VARCHAR(50) | Intervention code |
| `intervention_name` | VARCHAR(100) | Intervention name |
| `intervention_category` | VARCHAR(50) | Category (verbal, physical, environmental, chemical) |
| `description` | TEXT | Description of intervention |
| `requires_documentation` | BOOLEAN | Whether documentation is required |
| `is_active` | BOOLEAN | Whether intervention type is active |
| `created_at` | TIMESTAMP | Record creation timestamp |

---

## ref_meddra_codes
**Purpose:** MedDRA adverse event codes (standardized)  
**Table:** `ref_meddra_codes`

| Field | Type | Description |
|-------|------|-------------|
| `meddra_code_id` | SERIAL | Primary key |
| `meddra_code` | VARCHAR(20) | MedDRA code (e.g., "10028813") |
| `preferred_term` | VARCHAR(200) | Preferred term (e.g., "Nausea") |
| `system_organ_class` | VARCHAR(100) | System organ class |
| `severity_level` | VARCHAR(20) | Typical severity level |
| `description` | TEXT | Description of adverse event |
| `is_active` | BOOLEAN | Whether code is active |
| `created_at` | TIMESTAMP | Record creation timestamp |

---

## ref_clinical_observations
**Purpose:** Clinical observations (replaces all free-text notes)  
**Table:** `ref_clinical_observations`

| Field | Type | Description |
|-------|------|-------------|
| `observation_id` | SERIAL | Primary key |
| `observation_code` | VARCHAR(50) | Observation code (e.g., "BASELINE_MOTIVATED") |
| `observation_text` | TEXT | Observation text |
| `category` | VARCHAR(50) | Category (baseline, session, integration, safety) |
| `is_active` | BOOLEAN | Whether observation is active |
| `created_at` | TIMESTAMP | Record creation timestamp |

---

## ref_cancellation_reasons
**Purpose:** Cancellation reasons for integration sessions  
**Table:** `ref_cancellation_reasons`

| Field | Type | Description |
|-------|------|-------------|
| `cancellation_reason_id` | SERIAL | Primary key |
| `reason_code` | VARCHAR(50) | Reason code (e.g., "CANCEL_ILLNESS") |
| `reason_text` | TEXT | Reason text |
| `is_active` | BOOLEAN | Whether reason is active |
| `created_at` | TIMESTAMP | Record creation timestamp |

---

## ref_sm_substances
**Purpose:** Shadow Market substances catalog  
**Table:** `public.ref_sm_substances`

| Field | Type | Description |
|-------|------|-------------|
| `substance_id` | SERIAL | Primary key |
| `substance_name` | VARCHAR(100) | Substance name |
| `substance_category` | VARCHAR(50) | Category |
| `is_active` | BOOLEAN | Whether substance is active |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |

---

## ref_sm_interventions
**Purpose:** Shadow Market interventions catalog  
**Table:** `public.ref_sm_interventions`

| Field | Type | Description |
|-------|------|-------------|
| `intervention_id` | SERIAL | Primary key |
| `intervention_name` | VARCHAR(100) | Intervention name |
| `intervention_category` | VARCHAR(50) | Category |
| `is_active` | BOOLEAN | Whether intervention is active |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |

---

## ref_sm_risk_flags
**Purpose:** Shadow Market risk flags  
**Table:** `public.ref_sm_risk_flags`

| Field | Type | Description |
|-------|------|-------------|
| `flag_type_id` | SERIAL | Primary key |
| `flag_name` | VARCHAR(100) | Flag name (e.g., "Violent Behavior", "Theft") |
| `flag_description` | TEXT | Description of risk |
| `severity_level` | VARCHAR(20) | Severity level |
| `is_active` | BOOLEAN | Whether flag is active |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |

---

## ref_dosage_units
**Purpose:** Dosage units (mg, g, mL, etc.)  
**Table:** `public.ref_dosage_units`

| Field | Type | Description |
|-------|------|-------------|
| `dosage_unit_id` | BIGSERIAL | Primary key |
| `unit_name` | VARCHAR(20) | Unit name (mg, g, mL, mcg) |
| `unit_description` | TEXT | Description of unit |
| `is_active` | BOOLEAN | Whether unit is active |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |

---

## ref_dosage_frequency
**Purpose:** Dosage frequency (daily, weekly, etc.)  
**Table:** `public.ref_dosage_frequency`

| Field | Type | Description |
|-------|------|-------------|
| `dosage_frequency_id` | BIGSERIAL | Primary key |
| `frequency_name` | VARCHAR(50) | Frequency name (Daily, Weekly, Monthly, PRN) |
| `frequency_description` | TEXT | Description of frequency |
| `is_active` | BOOLEAN | Whether frequency is active |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |

---

## ref_medications
**Purpose:** Medications catalog  
**Table:** `public.ref_medications`

| Field | Type | Description |
|-------|------|-------------|
| `medication_id` | BIGSERIAL | Primary key |
| `medication_name` | VARCHAR(200) | Medication name |
| `generic_name` | VARCHAR(200) | Generic name |
| `medication_class` | VARCHAR(100) | Medication class |
| `is_active` | BOOLEAN | Whether medication is active |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |

---

## ref_drug_interactions
**Purpose:** Drug interactions catalog  
**Table:** `public.ref_drug_interactions`

| Field | Type | Description |
|-------|------|-------------|
| `interaction_id` | BIGSERIAL | Primary key |
| `substance_id` | BIGINT | Foreign key to ref_substances |
| `medication_id` | BIGINT | Foreign key to ref_medications |
| `interaction_severity` | VARCHAR(20) | Severity (Mild, Moderate, Severe, Contraindicated) |
| `interaction_description` | TEXT | Description of interaction |
| `is_active` | BOOLEAN | Whether interaction is active |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |

---

## ref_medication_risk_weights
**Purpose:** Medication risk weights for safety scoring  
**Table:** `public.ref_medication_risk_weights`

| Field | Type | Description |
|-------|------|-------------|
| `risk_weight_id` | BIGSERIAL | Primary key |
| `medication_id` | BIGINT | Foreign key to ref_medications |
| `risk_category` | VARCHAR(50) | Risk category |
| `risk_weight` | DECIMAL(5,2) | Risk weight (0.0-10.0) |
| `is_active` | BOOLEAN | Whether weight is active |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |

---

## ref_indications
**Purpose:** Medical indications  
**Table:** `public.ref_indications`

| Field | Type | Description |
|-------|------|-------------|
| `indication_id` | BIGSERIAL | Primary key |
| `indication_name` | VARCHAR(200) | Indication name (e.g., "Major Depressive Disorder") |
| `indication_code` | VARCHAR(50) | ICD-10 or DSM-5 code |
| `is_active` | BOOLEAN | Whether indication is active |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |

---

## ref_license_types
**Purpose:** License types for practitioners  
**Table:** `public.ref_license_types`

| Field | Type | Description |
|-------|------|-------------|
| `license_type_id` | BIGSERIAL | Primary key |
| `license_name` | VARCHAR(100) | License name (MD, DO, NP, PA, etc.) |
| `license_description` | TEXT | Description of license |
| `is_active` | BOOLEAN | Whether license type is active |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |

---

## ref_user_roles
**Purpose:** User roles (network_admin, site_admin, clinician, etc.)  
**Table:** `public.ref_user_roles`

| Field | Type | Description |
|-------|------|-------------|
| `role_id` | BIGSERIAL | Primary key |
| `role_name` | VARCHAR(50) | Role name |
| `role_description` | TEXT | Description of role |
| `permissions` | JSONB | Permissions JSON |
| `is_active` | BOOLEAN | Whether role is active |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |

---

## ref_sex
**Purpose:** Biological sex  
**Table:** `public.ref_sex`

| Field | Type | Description |
|-------|------|-------------|
| `sex_id` | BIGSERIAL | Primary key |
| `sex_name` | VARCHAR(20) | Sex name (Male, Female, Intersex) |
| `is_active` | BOOLEAN | Whether sex is active |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |

---

## ref_smoking_status
**Purpose:** Smoking status  
**Table:** `public.ref_smoking_status`

| Field | Type | Description |
|-------|------|-------------|
| `smoking_status_id` | BIGSERIAL | Primary key |
| `status_name` | VARCHAR(50) | Status name (Never, Former, Current) |
| `is_active` | BOOLEAN | Whether status is active |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |

---

## ref_weight_ranges
**Purpose:** Weight ranges for dosing calculations  
**Table:** `public.ref_weight_ranges`

| Field | Type | Description |
|-------|------|-------------|
| `weight_range_id` | BIGSERIAL | Primary key |
| `range_name` | VARCHAR(50) | Range name (e.g., "50-70 kg") |
| `min_weight_kg` | DECIMAL(5,2) | Minimum weight (kg) |
| `max_weight_kg` | DECIMAL(5,2) | Maximum weight (kg) |
| `is_active` | BOOLEAN | Whether range is active |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |

---

## ref_settings
**Purpose:** Treatment settings (clinic, home, retreat, etc.)  
**Table:** `public.ref_settings`

| Field | Type | Description |
|-------|------|-------------|
| `setting_id` | BIGSERIAL | Primary key |
| `setting_name` | VARCHAR(100) | Setting name |
| `setting_description` | TEXT | Description of setting |
| `is_active` | BOOLEAN | Whether setting is active |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |

---

## ref_safety_events
**Purpose:** Safety event types  
**Table:** `public.ref_safety_events`

| Field | Type | Description |
|-------|------|-------------|
| `safety_event_id` | BIGSERIAL | Primary key |
| `event_name` | VARCHAR(100) | Event name |
| `event_description` | TEXT | Description of event |
| `is_active` | BOOLEAN | Whether event type is active |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |

---

## ref_mhq_scores
**Purpose:** Mental Health Questionnaire scores  
**Table:** `public.ref_mhq_scores`

| Field | Type | Description |
|-------|------|-------------|
| `mhq_score_id` | BIGSERIAL | Primary key |
| `score_range` | VARCHAR(20) | Score range (e.g., "0-50") |
| `interpretation` | TEXT | Interpretation of score |
| `is_active` | BOOLEAN | Whether score range is active |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |

---

## ref_knowledge_graph
**Purpose:** Knowledge graph entities (research, protocols, substances)  
**Table:** `public.ref_knowledge_graph`

| Field | Type | Description |
|-------|------|-------------|
| `entity_id` | BIGSERIAL | Primary key |
| `entity_type` | VARCHAR(50) | Entity type (substance, protocol, research) |
| `entity_name` | VARCHAR(200) | Entity name |
| `entity_data` | JSONB | Entity data (flexible schema) |
| `relationships` | JSONB | Relationships to other entities |
| `is_active` | BOOLEAN | Whether entity is active |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Record update timestamp |

---

## 📊 SUMMARY STATISTICS

**Total Tables:** 52
- **Log Tables:** 22 (data collection)
- **Ref Tables:** 30 (reference data)

**Total Fields:** 347+
- **Primary Keys:** 52
- **Foreign Keys:** 85+
- **Timestamps:** 104+
- **Boolean Flags:** 42+
- **JSONB Fields:** 8

**RLS Enabled:** 48/52 tables (92%)

---

**Document Generated By:** INSPECTOR  
**Date:** 2026-02-17T00:07:37-08:00  
**Purpose:** Complete database schema reference for development and analysis
