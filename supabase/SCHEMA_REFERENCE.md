# PPN Database Schema Reference
<!-- AUTO-GENERATED FROM LIVE SUPABASE EXPORT — 2026-03-01 -->
<!-- DO NOT HAND-EDIT. Re-export from Supabase SQL Editor to update. -->

> **MANDATORY FOR ALL AGENTS:** Before writing ANY `supabase.from(table).select/insert/update`,
> look up the exact column names in this file. Never guess. Schema mismatches cause silent
> 400 errors and broken UI.

---

## 🔑 PATIENT IDENTIFIER CONVENTIONS

> This is the #1 source of bugs. Read carefully.

| Table | Patient Column | Type | Notes |
|-------|---------------|------|-------|
| `log_clinical_records` | `patient_link_code_hash` | `text` | Synthetic Subject_ID (e.g. PT-JYCLKFAPDD) |
| `log_patient_flow_events` | `patient_link_code_hash` | `text NOT NULL` | Same hash |
| `log_patient_site_links` | `patient_link_code` | `text NOT NULL` | Plain code (not hashed) |
| `log_dose_events` | `patient_id` | `varchar(20) NOT NULL` | Only table using patient_id |
| `log_baseline_assessments` | `patient_uuid` | `uuid` | UUID, NOT the text code |
| `log_longitudinal_assessments` | `patient_uuid` | `uuid` | UUID, NOT the text code |
| `log_behavioral_changes` | `patient_uuid` | `uuid` | UUID, NOT the text code |
| `log_integration_sessions` | `patient_uuid` | `uuid` | UUID, NOT the text code |
| `log_pulse_checks` | `patient_uuid` | `uuid` | UUID, NOT the text code |
| `log_red_alerts` | `patient_uuid` | `uuid` | UUID, NOT the text code |

---

## 📋 COMPLETE TABLE SCHEMAS

### log_clinical_records (47 columns)
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | uuid | NOT NULL | gen_random_uuid() |
| `created_at` | timestamptz | NOT NULL | timezone('utc', now()) |
| `practitioner_id` | uuid | NOT NULL | — |
| `substance_id` | integer | YES | — |
| `protocol_id` | integer | YES | — |
| `dosage_amount` | numeric | YES | — |
| `outcome_score` | integer | YES | — |
| `severity_rating` | integer | YES | 0 |
| `site_id` | uuid | YES | — |
| `indication_id` | bigint | YES | — |
| `session_number` | integer | YES | — |
| `session_date` | date | YES | — |
| `protocol_template_id` | uuid | YES | — |
| `support_modality_ids` | ARRAY | YES | — |
| `patient_smoking_status_id` | bigint | YES | — |
| `baseline_phq9_score` | integer | YES | — |
| `psychological_difficulty_score` | integer | YES | — |
| `route_id` | bigint | YES | — |
| `safety_event_id` | bigint | YES | — |
| `severity_grade_id` | bigint | YES | — |
| `resolution_status_id` | bigint | YES | — |
| `is_submitted` | boolean | YES | false |
| `submitted_at` | timestamptz | YES | — |
| `dosage_mg` | numeric | YES | — |
| `dose_administered_at` | timestamp | YES | — |
| `onset_reported_at` | timestamp | YES | — |
| `peak_intensity_at` | timestamp | YES | — |
| `session_ended_at` | timestamp | YES | — |
| `meq30_score` | integer | YES | — |
| `meq30_completed_at` | timestamp | YES | — |
| `edi_score` | integer | YES | — |
| `edi_completed_at` | timestamp | YES | — |
| `ceq_score` | integer | YES | — |
| `ceq_completed_at` | timestamp | YES | — |
| `guide_user_id` | uuid | YES | — |
| `contraindication_assessed_at` | timestamptz | YES | — |
| `session_type_id` | integer | YES | — |
| `justification_code_id` | bigint | YES | — |
| `assessment_scale_id` | integer | YES | — |
| `clinical_phenotype_id` | bigint | YES | — |
| `contraindication_verdict_id` | bigint | YES | — |
| `patient_sex_id` | bigint | YES | — |
| `weight_range_id` | bigint | YES | — |
| `concomitant_med_ids` | ARRAY | YES | — |
| `patient_age_years` | integer | YES | — |
| `created_by` | uuid | YES | — |
| `patient_link_code_hash` | text | YES | — |

> ⚠️ `session_type` (varchar) does NOT exist. Use `session_type_id` (FK → ref_session_types).

---

### log_baseline_assessments (17 columns)
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `baseline_assessment_id` | integer | NOT NULL | nextval(seq) |
| `site_id` | uuid | YES | — |
| `assessment_date` | timestamp | NOT NULL | now() |
| `phq9_score` | integer | YES | — |
| `gad7_score` | integer | YES | — |
| `ace_score` | integer | YES | — |
| `pcl5_score` | integer | YES | — |
| `expectancy_scale` | integer | YES | — |
| `resting_hrv` | numeric | YES | — |
| `resting_bp_systolic` | integer | YES | — |
| `resting_bp_diastolic` | integer | YES | — |
| `completed_by_user_id` | uuid | YES | — |
| `created_at` | timestamp | YES | now() |
| `updated_at` | timestamp | YES | now() |
| `patient_uuid` | uuid | YES | — |
| `psychospiritual_history_id` | bigint | YES | — |
| `created_by` | uuid | YES | — |

> ⚠️ `patient_id` does NOT exist. Use `patient_uuid` (UUID type, not text code).

---

### log_longitudinal_assessments (9 columns)
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `longitudinal_assessment_id` | integer | NOT NULL | nextval(seq) |
| `session_id` | uuid | YES | — |
| `assessment_date` | date | NOT NULL | — |
| `days_post_session` | integer | YES | — |
| `phq9_score` | integer | YES | — |
| `gad7_score` | integer | YES | — |
| `whoqol_score` | integer | YES | — |
| `psqi_score` | integer | YES | — |
| `cssrs_score` | integer | YES | — |
| `completed_at` | timestamp | YES | now() |
| `patient_uuid` | uuid | YES | — |
| `created_at` | timestamptz | YES | now() |
| `created_by` | uuid | YES | — |

> ⚠️ `patient_id` does NOT exist. Use `patient_uuid`.

---

### log_dose_events (15 columns)
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | bigint | NOT NULL | nextval(seq) |
| `session_id` | uuid | NOT NULL | — |
| `patient_id` | varchar(20) | NOT NULL | — |
| `substance_id` | bigint | NOT NULL | — |
| `dose_mg` | numeric | NOT NULL | — |
| `weight_kg` | numeric | NOT NULL | — |
| `dose_mg_per_kg` | numeric | YES | — |
| `cumulative_mg` | numeric | YES | — |
| `cumulative_mg_per_kg` | numeric | YES | — |
| `event_type` | varchar(10) | NOT NULL | 'booster' |
| `administered_at` | timestamp | NOT NULL | now() |
| `created_at` | timestamp | NOT NULL | now() |
| `substance_type` | varchar(10) | NOT NULL | 'HCl' |
| `created_by` | uuid | YES | — |

> ✅ `patient_id` IS correct here (varchar 20).

---

### log_safety_events (14 columns)
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `ae_id` | text | NOT NULL | — |
| `exposure_id` | text | YES | — |
| `event_id` | text | YES | — |
| `causality_code` | text | YES | — |
| `site_id` | uuid | YES | — |
| `session_id` | uuid | YES | — |
| `meddra_code_id` | integer | YES | — |
| `intervention_type_id` | integer | YES | — |
| `is_resolved` | boolean | YES | false |
| `resolved_at` | timestamp | YES | — |
| `logged_by_user_id` | uuid | YES | — |
| `report_pdf_url` | text | YES | — |
| `report_generated_at` | timestamptz | YES | — |
| `ctcae_grade` | smallint | YES | — |
| `severity_grade_id_fk` | bigint | YES | — |
| `resolution_status_id_fk` | bigint | YES | — |
| `safety_event_type_id` | bigint | YES | — |
| `created_at` | timestamptz | YES | now() |
| `created_by` | uuid | YES | — |

---

### log_session_vitals (12 columns)
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `session_vital_id` | integer | NOT NULL | nextval(seq) |
| `session_id` | uuid | YES | — |
| `recorded_at` | timestamp | NOT NULL | — |
| `heart_rate` | integer | YES | — |
| `hrv` | numeric | YES | — |
| `bp_systolic` | integer | YES | — |
| `bp_diastolic` | integer | YES | — |
| `oxygen_saturation` | integer | YES | — |
| `device_id` | varchar(100) | YES | — |
| `created_at` | timestamp | YES | now() |
| `respiratory_rate` | integer | YES | — |
| `temperature` | numeric | YES | — |
| `diaphoresis_score` | integer | YES | — |
| `level_of_consciousness` | varchar(20) | YES | — |
| `data_source_id` | bigint | YES | — |
| `created_by` | uuid | YES | — |

---

### log_behavioral_changes (10 columns)
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `behavioral_change_id` | integer | NOT NULL | nextval(seq) |
| `session_id` | uuid | YES | — |
| `change_date` | date | NOT NULL | — |
| `is_positive` | boolean | NOT NULL | — |
| `logged_at` | timestamp | YES | now() |
| `change_category` | varchar(50) | YES | — |
| `change_type_ids` | ARRAY | YES | — |
| `impact_on_wellbeing` | varchar(30) | YES | — |
| `confidence_sustaining` | integer | YES | — |
| `related_to_dosing` | varchar(30) | YES | — |
| `patient_uuid` | uuid | YES | — |
| `created_at` | timestamptz | YES | now() |
| `created_by` | uuid | YES | — |

> ⚠️ `patient_id` does NOT exist. Use `patient_uuid`.

---

### log_consent (8 columns)
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | bigint | NOT NULL | — |
| `created_at` | timestamptz | NOT NULL | timezone('utc', now()) |
| `record_id` | bigint | YES | — |
| `verified` | boolean | YES | — |
| `site_id` | uuid | YES | — |
| `verified_at` | timestamptz | YES | — |
| `consent_type_id` | integer | YES | — |
| `created_by` | uuid | YES | — |

---

### log_integration_sessions (14 columns)
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `integration_session_id` | integer | NOT NULL | nextval(seq) |
| `dosing_session_id` | uuid | YES | — |
| `integration_session_number` | integer | NOT NULL | — |
| `session_date` | date | NOT NULL | — |
| `session_duration_minutes` | integer | YES | — |
| `therapist_user_id` | uuid | YES | — |
| `attended` | boolean | YES | true |
| `created_at` | timestamp | YES | now() |
| `cancellation_reason_id` | integer | YES | — |
| `insight_integration_rating` | integer | YES | — |
| `emotional_processing_rating` | integer | YES | — |
| `behavioral_application_rating` | integer | YES | — |
| `engagement_level_rating` | integer | YES | — |
| `session_focus_ids` | ARRAY | YES | — |
| `homework_assigned_ids` | ARRAY | YES | — |
| `therapist_observation_ids` | ARRAY | YES | — |
| `patient_uuid` | uuid | YES | — |
| `created_by` | uuid | YES | — |

> ⚠️ `patient_id` does NOT exist. Use `patient_uuid`.

---

### log_patient_flow_events (13 columns)
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | uuid | NOT NULL | uuid_generate_v4() |
| `site_id` | uuid | NOT NULL | — |
| `practitioner_id` | uuid | YES | — |
| `patient_link_code_hash` | text | NOT NULL | — |
| `event_type_id` | bigint | NOT NULL | — |
| `event_at` | timestamptz | NOT NULL | — |
| `protocol_id` | uuid | YES | — |
| `substance_id` | bigint | YES | — |
| `route_id` | bigint | YES | — |
| `support_modality_ids` | ARRAY | YES | — |
| `source_id` | uuid | YES | — |
| `created_at` | timestamptz | YES | now() |
| `created_by` | uuid | YES | — |
| `updated_at` | timestamptz | YES | now() |
| `justification_id` | bigint | YES | — |

---

### log_patient_site_links (7 columns)
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | bigint | NOT NULL | nextval(seq) |
| `patient_link_code` | text | NOT NULL | — |
| `site_id` | uuid | NOT NULL | — |
| `transferred_from_site_id` | uuid | YES | — |
| `transfer_date` | timestamptz | YES | — |
| `is_active` | boolean | YES | true |
| `created_at` | timestamptz | NOT NULL | now() |
| `updated_at` | timestamptz | NOT NULL | now() |

---

### log_user_sites (5 columns)
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `user_id` | uuid | NOT NULL | — |
| `site_id` | uuid | NOT NULL | — |
| `role` | text | NOT NULL | — |
| `is_active` | boolean | YES | true |
| `created_at` | timestamptz | YES | now() |

---

### log_protocols (13 columns)
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | uuid | NOT NULL | gen_random_uuid() |
| `user_id` | uuid | YES | — |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `name` | text | NOT NULL | — |
| `status` | text | YES | 'draft' |
| `dosing_schedule` | jsonb | YES | — |
| `safety_criteria` | jsonb | YES | — |
| `outcome_measures` | jsonb | YES | — |
| `protocol_rationale_id` | bigint | YES | — |
| `substance_id` | bigint | YES | — |
| `indication_id` | bigint | YES | — |
| `created_by` | uuid | YES | — |

---

## 📚 REFERENCE TABLES (FK targets)

| Table | PK Column | Label Column | Notes |
|-------|-----------|--------------|-------|
| `ref_session_types` | `id` | `session_label` | 1=Preparation, etc. |
| `ref_substances` | `substance_id` | `substance_name` | |
| `ref_indications` | `indication_id` | `indication_name` | |
| `ref_sex` | `sex_id` | `sex_label` | |
| `ref_smoking_status` | `smoking_status_id` | `status_name` | |
| `ref_weight_ranges` | `id` | `range_label` | |
| `ref_routes` | `route_id` | `route_name` | |
| `ref_severity_grade` | `severity_grade_id` | `grade_label` | |
| `ref_resolution_status` | `resolution_status_id` | `status_name` | |
| `ref_consent_types` | `id` | `label` | |
| `ref_clinical_observations` | `observation_id` | `observation_text` | |
| `ref_support_modality` | `modality_id` | `modality_name` | |
| `ref_assessment_scales` | `assessment_scale_id` | `scale_name` | |
| `ref_clinical_phenotypes` | `clinical_phenotype_id` | `phenotype_name` | |
| `ref_contraindication_verdicts` | `verdict_id` | `verdict_label` | |

---

## ❌ KNOWN INVALID COLUMN NAMES (DO NOT USE)

| Column Name | Table | Correct Alternative |
|-------------|-------|---------------------|
| `patient_id` | log_baseline_assessments | `patient_uuid` (must be UUID) |
| `patient_id` | log_longitudinal_assessments | `patient_uuid` |
| `patient_id` | log_behavioral_changes | `patient_uuid` |
| `patient_id` | log_integration_sessions | `patient_uuid` |
| `patient_id` | log_pulse_checks | `patient_uuid` |
| `patient_link_code` | log_clinical_records | `patient_link_code_hash` |
| `session_type` | log_clinical_records | `session_type_id` (integer FK) |