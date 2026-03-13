# PPN Schema Snapshot
**Source:** Production Database (Supabase)
**Captured:** 2026-03-03
**Purpose:** Pre-SQL verification reference. Agents MUST check this file before producing any SQL that touches existing tables. If in doubt, query the live DB to confirm — this file is a snapshot, not a live view.

> **Maintenance:** Update this file whenever a migration adds or alters columns/tables/constraints. Run the snapshot query in Supabase SQL Editor and replace the relevant section.

---

## ⚠️ INSPECTOR FLAGS

| Flag | Table | Column | Issue |
|---|---|---|---|
| 🔴 WO-530B | `ref_assessment_scales` | `created_at` | `timestamp without time zone` — missed in WO-530 |
| 🔴 WO-530B | `ref_cancellation_reasons` | `created_at` | `timestamp without time zone` — missed in WO-530 |
| 🔴 WO-530B | `ref_clinical_observations` | `created_at` | `timestamp without time zone` — missed in WO-530 |
| 🔴 WO-530B | `ref_intervention_types` | `created_at` | `timestamp without time zone` — missed in WO-530 |
| 🔴 WO-530B | `ref_meddra_codes` | `created_at` | `timestamp without time zone` — missed in WO-530 |
| 🟡 PHI-WATCH | `log_user_profiles` | `user_first_name`, `user_last_name` | Free TEXT on practitioner identity — not patient PHI but monitor |
| 🟡 NOTE | `log_corrections` | `source_table`, `field_name`, `correction_reason` | TEXT columns — acceptable (audit trail, not clinical narrative) |
| 🟡 NOTE | `log_clinical_records` | `patient_link_code_hash` | TEXT — cryptographic hash only, approved exception |

---

## CHECK CONSTRAINTS

| Table | Constraint Name | Valid Values |
|---|---|---|
| `log_user_sites` | `user_sites_role_check` | `network_admin`, `site_admin`, `clinician`, `analyst`, `auditor` |

---

## GOVERNANCE TABLE

### `_schema_lock`
| column | type | nullable | default |
|---|---|---|---|
| locked_at | timestamptz | NO | now() |
| locked_by | text | YES | null |
| reason | text | YES | null |

---

## LOG TABLES

### `log_baseline_assessments`
| column | type | nullable | default |
|---|---|---|---|
| baseline_assessment_id | integer | NO | nextval(seq) |
| site_id | uuid | YES | null |
| assessment_date | timestamptz | NO | now() |
| phq9_score | integer | YES | null |
| gad7_score | integer | YES | null |
| ace_score | integer | YES | null |
| pcl5_score | integer | YES | null |
| expectancy_scale | integer | YES | null |
| resting_hrv | numeric | YES | null |
| resting_bp_systolic | integer | YES | null |
| resting_bp_diastolic | integer | YES | null |
| completed_by_user_id | uuid | YES | null |
| created_at | timestamptz | YES | now() |
| updated_at | timestamptz | YES | now() |
| patient_uuid | uuid | YES | null |
| psychospiritual_history_id | bigint | YES | null |
| created_by | uuid | YES | null |

### `log_baseline_observations`
| column | type | nullable | default |
|---|---|---|---|
| id | integer | NO | nextval(seq) |
| baseline_assessment_id | integer | YES | null |
| observation_id | integer | YES | null |
| created_at | timestamptz | YES | now() |

### `log_behavioral_changes`
| column | type | nullable | default |
|---|---|---|---|
| behavioral_change_id | integer | NO | nextval(seq) |
| session_id | uuid | YES | null |
| change_date | date | NO | null |
| is_positive | boolean | NO | null |
| logged_at | timestamptz | YES | now() |
| change_category | varchar | YES | null |
| change_type_ids | ARRAY | YES | null |
| impact_on_wellbeing | varchar | YES | null |
| confidence_sustaining | integer | YES | null |
| related_to_dosing | varchar | YES | null |
| patient_uuid | uuid | YES | null |
| created_at | timestamptz | YES | now() |
| created_by | uuid | YES | null |

### `log_clinical_records`
> **Key table.** Active session = `is_submitted = false AND session_ended_at IS NULL AND dose_administered_at IS NOT NULL`. Timer start = `dose_administered_at`.
> **WO-592 applied 2026-03-10:** `session_status` column live in production — filters `.neq('session_status', 'draft')` are active in all analytics hooks.

| column | type | nullable | default |
|---|---|---|---|
| id | uuid | NO | gen_random_uuid() |
| created_at | timestamptz | NO | timezone('utc', now()) |
| practitioner_id | uuid | NO | null |
| substance_id | integer | YES | null |
| protocol_id | integer | YES | null |
| dosage_amount | numeric | YES | null |
| outcome_score | integer | YES | null |
| severity_rating | integer | YES | 0 |
| site_id | uuid | YES | null |
| indication_id | bigint | YES | null |
| session_number | integer | YES | null |
| session_date | date | YES | null |
| protocol_template_id | uuid | YES | null |
| support_modality_ids | ARRAY | YES | null |
| patient_smoking_status_id | bigint | YES | null |
| baseline_phq9_score | integer | YES | null |
| psychological_difficulty_score | integer | YES | null |
| route_id | bigint | YES | null |
| safety_event_id | bigint | YES | null |
| severity_grade_id | bigint | YES | null |
| resolution_status_id | bigint | YES | null |
| is_submitted | boolean | YES | false |
| submitted_at | timestamptz | YES | null |
| dosage_mg | numeric | YES | null |
| dose_administered_at | timestamptz | YES | null |
| onset_reported_at | timestamptz | YES | null |
| peak_intensity_at | timestamptz | YES | null |
| session_ended_at | timestamptz | YES | null |
| meq30_score | integer | YES | null |
| meq30_completed_at | timestamptz | YES | null |
| edi_score | integer | YES | null |
| edi_completed_at | timestamptz | YES | null |
| ceq_score | integer | YES | null |
| ceq_completed_at | timestamptz | YES | null |
| guide_user_id | uuid | YES | null |
| contraindication_assessed_at | timestamptz | YES | null |
| session_type_id | integer | YES | null |
| justification_code_id | bigint | YES | null |
| assessment_scale_id | integer | YES | null |
| clinical_phenotype_id | bigint | YES | null |
| contraindication_verdict_id | bigint | YES | null |
| patient_sex_id | bigint | YES | null |
| weight_range_id | bigint | YES | null |
| concomitant_med_ids | ARRAY | YES | null |
| patient_age_years | integer | YES | null |
| created_by | uuid | YES | null |
| patient_link_code_hash | text | YES | null |
| session_status | text | NO | 'draft' | ✅ WO-592 — valid: 'draft', 'active', 'completed'. Analytics queries must filter `!= 'draft'`. |

### `log_consent`
| column | type | nullable | default |
|---|---|---|---|
| id | bigint | NO | null |
| created_at | timestamptz | NO | timezone('utc', now()) |
| record_id | bigint | YES | null |
| verified | boolean | YES | null |
| site_id | uuid | YES | null |
| verified_at | timestamptz | YES | null |
| consent_type_id | integer | YES | null |
| created_by | uuid | YES | null |

### `log_corrections`
| column | type | nullable | default |
|---|---|---|---|
| correction_id | uuid | NO | gen_random_uuid() |
| source_table | text | NO | null |
| source_row_id | uuid | NO | null |
| field_name | text | NO | null |
| old_value_json | jsonb | YES | null |
| new_value_json | jsonb | NO | null |
| correction_type | text | NO | null |
| correction_reason | text | NO | null |
| corrected_by | uuid | YES | null |
| site_id | uuid | YES | null |
| corrected_at | timestamptz | YES | now() |
| approved_by | uuid | YES | null |
| approved_at | timestamptz | YES | null |
| created_at | timestamptz | YES | now() |
| created_by | uuid | YES | null |

### `log_dose_events`
| column | type | nullable | default |
|---|---|---|---|
| id | bigint | NO | nextval(seq) |
| session_id | uuid | NO | null |
| patient_id | varchar | NO | null |
| substance_id | bigint | NO | null |
| dose_mg | numeric | NO | null |
| weight_kg | numeric | NO | null |
| dose_mg_per_kg | numeric | YES | null |
| cumulative_mg | numeric | YES | null |
| cumulative_mg_per_kg | numeric | YES | null |
| event_type | varchar | NO | 'booster' |
| administered_at | timestamptz | NO | now() |
| created_at | timestamptz | NO | now() |
| substance_type | varchar | NO | 'HCl' |
| created_by | uuid | YES | null |

### `log_feature_flags`
| column | type | nullable | default |
|---|---|---|---|
| id | bigint | NO | nextval(seq) |
| flag_name | text | NO | null |
| description | text | YES | null |
| enabled_for_all | boolean | YES | false |
| enabled_site_ids | ARRAY | YES | '{}' |
| enabled_user_ids | ARRAY | YES | '{}' |
| enabled_tiers | ARRAY | YES | '{}' |
| created_at | timestamptz | NO | now() |
| updated_at | timestamptz | NO | now() |
| created_by | uuid | YES | null |

### `log_feature_requests`
| column | type | nullable | default |
|---|---|---|---|
| request_id | integer | NO | nextval(seq) |
| user_id | uuid | YES | null |
| site_id | uuid | YES | null |
| request_type | varchar | NO | 'vocabulary_request' |
| requested_text | text | NO | '' |
| category | varchar | YES | null |
| status | varchar | YES | 'pending' |
| reviewed_by | uuid | YES | null |
| reviewed_at | timestamptz | YES | null |
| created_at | timestamptz | YES | now() |
| rejection_reason_id | bigint | YES | null |
| created_by | uuid | YES | null |

### `log_integration_sessions`
| column | type | nullable | default |
|---|---|---|---|
| integration_session_id | integer | NO | nextval(seq) |
| dosing_session_id | uuid | YES | null |
| integration_session_number | integer | NO | null |
| session_date | date | NO | null |
| session_duration_minutes | integer | YES | null |
| therapist_user_id | uuid | YES | null |
| attended | boolean | YES | true |
| created_at | timestamptz | YES | now() |
| cancellation_reason_id | integer | YES | null |
| insight_integration_rating | integer | YES | null |
| emotional_processing_rating | integer | YES | null |
| behavioral_application_rating | integer | YES | null |
| engagement_level_rating | integer | YES | null |
| session_focus_ids | ARRAY | YES | null |
| homework_assigned_ids | ARRAY | YES | null |
| therapist_observation_ids | ARRAY | YES | null |
| patient_uuid | uuid | YES | null |
| created_by | uuid | YES | null |

### `log_interventions`
| column | type | nullable | default |
|---|---|---|---|
| id | bigint | NO | null |
| created_at | timestamptz | NO | timezone('utc', now()) |
| site_id | uuid | YES | null |
| status | text | YES | null |
| demographics | jsonb | YES | null |
| protocol | jsonb | YES | null |
| context | jsonb | YES | null |
| safety_events | jsonb | YES | null |
| substance_id | bigint | YES | null |
| support_modality_ids | ARRAY | YES | '{}' |
| session_id | uuid | YES | null |
| intervention_type_id | integer | YES | null |
| created_by | uuid | YES | null |

### `log_longitudinal_assessments`
| column | type | nullable | default |
|---|---|---|---|
| longitudinal_assessment_id | integer | NO | nextval(seq) |
| session_id | uuid | YES | null |
| assessment_date | date | NO | null |
| days_post_session | integer | YES | null |
| phq9_score | integer | YES | null |
| gad7_score | integer | YES | null |
| whoqol_score | integer | YES | null |
| psqi_score | integer | YES | null |
| cssrs_score | integer | YES | null |
| completed_at | timestamptz | YES | now() |
| patient_uuid | uuid | YES | null |
| created_at | timestamptz | YES | now() |
| created_by | uuid | YES | null |

### `log_outcomes`
| column | type | nullable | default |
|---|---|---|---|
| id | bigint | NO | null |
| created_at | timestamptz | NO | timezone('utc', now()) |
| record_id | bigint | YES | null |
| score | integer | YES | null |
| site_id | uuid | YES | null |
| observed_at | timestamptz | YES | null |
| assessment_scale_id | integer | YES | null |
| created_by | uuid | YES | null |
| outcome_date | date | YES | null |

### `log_patient_flow_events`
| column | type | nullable | default |
|---|---|---|---|
| id | uuid | NO | uuid_generate_v4() |
| site_id | uuid | NO | null |
| practitioner_id | uuid | YES | null |
| patient_link_code_hash | text | NO | null |
| event_type_id | bigint | NO | null |
| event_at | timestamptz | NO | null |
| protocol_id | uuid | YES | null |
| substance_id | bigint | YES | null |
| route_id | bigint | YES | null |
| support_modality_ids | ARRAY | YES | null |
| source_id | uuid | YES | null |
| created_at | timestamptz | YES | now() |
| created_by | uuid | YES | null |
| updated_at | timestamptz | YES | now() |
| justification_id | bigint | YES | null |

### `log_patient_site_links`
| column | type | nullable | default |
|---|---|---|---|
| id | bigint | NO | nextval(seq) |
| patient_link_code | text | NO | null |
| site_id | uuid | NO | null |
| transferred_from_site_id | uuid | YES | null |
| transfer_date | timestamptz | YES | null |
| is_active | boolean | YES | true |
| created_at | timestamptz | NO | now() |
| updated_at | timestamptz | NO | now() |

### `log_protocols`
| column | type | nullable | default |
|---|---|---|---|
| id | uuid | NO | gen_random_uuid() |
| user_id | uuid | YES | null |
| created_at | timestamptz | YES | now() |
| updated_at | timestamptz | YES | now() |
| name | text | NO | null |
| status | text | YES | 'draft' |
| dosing_schedule | jsonb | YES | null |
| safety_criteria | jsonb | YES | null |
| outcome_measures | jsonb | YES | null |
| protocol_rationale_id | bigint | YES | null |
| substance_id | bigint | YES | null |
| indication_id | bigint | YES | null |
| created_by | uuid | YES | null |

### `log_pulse_checks`
| column | type | nullable | default |
|---|---|---|---|
| pulse_check_id | integer | NO | nextval(seq) |
| session_id | uuid | YES | null |
| check_date | date | NO | CURRENT_DATE |
| connection_level | integer | YES | null |
| sleep_quality | integer | YES | null |
| mood_level | integer | YES | null |
| anxiety_level | integer | YES | null |
| completed_at | timestamptz | YES | now() |
| patient_uuid | uuid | YES | null |
| created_at | timestamptz | YES | now() |
| created_by | uuid | YES | null |

### `log_red_alerts`
| column | type | nullable | default |
|---|---|---|---|
| red_alert_id | integer | NO | nextval(seq) |
| alert_triggered_at | timestamptz | NO | now() |
| trigger_value | jsonb | YES | null |
| is_acknowledged | boolean | YES | false |
| acknowledged_by_user_id | uuid | YES | null |
| acknowledged_at | timestamptz | YES | null |
| is_resolved | boolean | YES | false |
| resolved_at | timestamptz | YES | null |
| created_at | timestamptz | YES | now() |
| crisis_event_type_id | integer | YES | null |
| severity_grade_fk | bigint | YES | null |
| patient_uuid | uuid | YES | null |
| severity_grade_id | bigint | YES | null |
| alert_type_id | bigint | YES | null |
| created_by | uuid | YES | null |

### `log_safety_event_observations`
| column | type | nullable | default |
|---|---|---|---|
| id | integer | NO | nextval(seq) |
| safety_event_id | text | YES | null |
| observation_id | integer | YES | null |
| created_at | timestamptz | YES | now() |

### `log_safety_events`
| column | type | nullable | default |
|---|---|---|---|
| ae_id | text | NO | null |
| exposure_id | text | YES | null |
| event_id | text | YES | null |
| causality_code | text | YES | null |
| site_id | uuid | YES | null |
| session_id | uuid | YES | null |
| meddra_code_id | integer | YES | null |
| intervention_type_id | integer | YES | null |
| is_resolved | boolean | YES | false |
| resolved_at | timestamptz | YES | null |
| logged_by_user_id | uuid | YES | null |
| report_pdf_url | text | YES | null |
| report_generated_at | timestamptz | YES | null |
| ctcae_grade | smallint | YES | null |
| severity_grade_id_fk | bigint | YES | null |
| resolution_status_id_fk | bigint | YES | null |
| safety_event_type_id | bigint | YES | null |
| created_at | timestamptz | YES | now() |
| created_by | uuid | YES | null |

### `log_session_observations`
| column | type | nullable | default |
|---|---|---|---|
| id | integer | NO | nextval(seq) |
| session_id | uuid | YES | null |
| observation_id | integer | YES | null |
| created_at | timestamptz | YES | now() |

### `log_session_timeline_events`
> **RLS:** INSERT policy currently `{public}` — fix pending WO-526 (after WO-527 enrolls ≥1 row).

| column | type | nullable | default |
|---|---|---|---|
| timeline_event_id | uuid | NO | gen_random_uuid() |
| session_id | uuid | YES | null |
| event_timestamp | timestamptz | NO | null |
| event_type_id | integer | YES | null |
| performed_by | uuid | YES | null |
| metadata | jsonb | YES | null |
| created_at | timestamptz | YES | now() |
| created_by | uuid | YES | null |

### `log_session_vitals`
| column | type | nullable | default |
|---|---|---|---|
| session_vital_id | integer | NO | nextval(seq) |
| session_id | uuid | YES | null |
| recorded_at | timestamptz | NO | null |
| heart_rate | integer | YES | null |
| hrv | numeric | YES | null |
| bp_systolic | integer | YES | null |
| bp_diastolic | integer | YES | null |
| oxygen_saturation | integer | YES | null |
| device_id | varchar | YES | null |
| created_at | timestamptz | YES | now() |
| respiratory_rate | integer | YES | null |
| temperature | numeric | YES | null |
| diaphoresis_score | integer | YES | null |
| level_of_consciousness | varchar | YES | null |
| data_source_id | bigint | YES | null |
| created_by | uuid | YES | null |

### `log_sites`
| column | type | nullable | default |
|---|---|---|---|
| site_id | uuid | NO | gen_random_uuid() |
| site_name | text | NO | null |
| region | text | YES | null |
| created_at | timestamptz | NO | now() |
| is_active | boolean | YES | true |
| site_type | text | YES | null |

### `log_subscriptions`
| column | type | nullable | default |
|---|---|---|---|
| id | uuid | NO | gen_random_uuid() |
| site_id | uuid | NO | null |
| stripe_customer_id | text | YES | null |
| stripe_subscription_id | text | YES | null |
| stripe_price_id | text | YES | null |
| tier | text | NO | null |
| status | text | NO | null |
| current_period_start | timestamptz | YES | null |
| current_period_end | timestamptz | YES | null |
| trial_end | timestamptz | YES | null |
| canceled_at | timestamptz | YES | null |
| max_users | integer | YES | null |
| max_sites | integer | YES | null |
| max_records_per_month | integer | YES | null |
| created_at | timestamptz | NO | now() |
| updated_at | timestamptz | NO | now() |

### `log_system_events`
| column | type | nullable | default |
|---|---|---|---|
| event_id | bigint | NO | nextval(seq) |
| actor_id | uuid | YES | null |
| event_type | text | NO | null |
| event_details | jsonb | YES | null |
| event_status | text | YES | null |
| created_at | timestamptz | NO | now() |
| ledger_hash | text | YES | null |
| site_id | uuid | YES | null |
| action_type_id | integer | YES | null |

### `log_usage_metrics`
| column | type | nullable | default |
|---|---|---|---|
| id | bigint | NO | nextval(seq) |
| site_id | uuid | NO | null |
| metric_type | text | NO | null |
| count | integer | NO | 0 |
| period_start | date | NO | null |
| period_end | date | NO | null |
| created_at | timestamptz | NO | now() |

### `log_user_profiles`
> 🟡 `user_first_name` and `user_last_name` are practitioner identity fields (not patient PHI). Monitor for scope creep.

| column | type | nullable | default |
|---|---|---|---|
| id | uuid | NO | gen_random_uuid() |
| user_id | uuid | NO | null |
| created_at | timestamptz | YES | now() |
| role_id | integer | YES | 3 |
| user_first_name | text | YES | null |
| user_last_name | text | YES | null |

### `log_user_saved_views`
| column | type | nullable | default |
|---|---|---|---|
| id | uuid | NO | uuid_generate_v4() |
| user_id | uuid | NO | null |
| view_name | text | NO | null |
| deep_dive_page | text | NO | null |
| filter_state | jsonb | NO | null |
| is_default | boolean | YES | false |
| created_at | timestamptz | YES | now() |
| updated_at | timestamptz | YES | now() |

### `log_user_sites`
> **Constraint:** `user_sites_role_check` — valid roles: `network_admin`, `site_admin`, `clinician`, `analyst`, `auditor`
> **Current enrolled rows:** 0 (as of 2026-03-03). WO-527 must ship before WO-526.

| column | type | nullable | default |
|---|---|---|---|
| user_id | uuid | NO | null |
| site_id | uuid | NO | null |
| role | text | NO | null |
| is_active | boolean | YES | true |
| created_at | timestamptz | YES | now() |

### `log_user_subscriptions`
| column | type | nullable | default |
|---|---|---|---|
| id | uuid | NO | uuid_generate_v4() |
| user_id | uuid | NO | null |
| stripe_customer_id | text | NO | null |
| stripe_subscription_id | text | NO | null |
| tier | text | NO | null |
| status | text | NO | null |
| trial_end | timestamptz | YES | null |
| current_period_end | timestamptz | NO | null |
| cancel_at_period_end | boolean | YES | false |
| created_at | timestamptz | YES | null |
| updated_at | timestamptz | YES | null |

### `log_vocabulary_requests`
| column | type | nullable | default |
|---|---|---|---|
| request_id | uuid | NO | gen_random_uuid() |
| site_id | uuid | YES | null |
| requesting_user | uuid | YES | null |
| target_ref_table | text | NO | null |
| proposed_label | text | NO | null |
| clinical_rationale | text | YES | null |
| status | text | NO | 'pending' |
| request_count | integer | YES | 1 |
| requesting_sites | ARRAY | YES | null |
| advisory_notes | text | YES | null |
| created_at | timestamptz | YES | now() |
| reviewed_at | timestamptz | YES | null |
| converted_to_ref_id | bigint | YES | null |
| created_by | uuid | YES | null |

### `log_waitlist`
| column | type | nullable | default |
|---|---|---|---|
| id | uuid | NO | gen_random_uuid() |
| created_at | timestamptz | YES | now() |
| email | text | NO | null |

---

## REFERENCE TABLES

### `ref_alert_types`
| column | type |
|---|---|
| alert_type_id | bigint PK |
| alert_code | text |
| alert_label | text |
| alert_category | text |
| is_active | boolean |
| created_at | timestamptz |

### `ref_assessment_interval`
| column | type |
|---|---|
| assessment_interval_id | bigint PK |
| assessment_interval | text |

### `ref_assessment_scales`
> 🔴 `created_at` is `timestamp without time zone` — WO-530B pending

| column | type |
|---|---|
| assessment_scale_id | integer PK |
| scale_code | varchar |
| scale_name | varchar |
| scale_description | text |
| min_score | integer |
| max_score | integer |
| loinc_code | varchar |
| snomed_code | varchar |
| scoring_interpretation | jsonb |
| is_active | boolean |
| created_at | **timestamp (no tz)** |

### `ref_assessments`
| column | type |
|---|---|
| assessment_id | bigint PK |
| test_short_name | text |
| loinc_code | text |
| definition | text |

### `ref_behavioral_change_types`
| column | type |
|---|---|
| change_type_id | integer PK |
| change_type_code | varchar |
| change_type_label | varchar |
| category | varchar |
| is_active | boolean |

### `ref_benchmark_cohorts` / `ref_benchmark_trials`
*Research reference data — read-only, no RLS required.*

### `ref_cancellation_reasons`
> 🔴 `created_at` is `timestamp without time zone` — WO-530B pending

| column | type |
|---|---|
| cancellation_reason_id | integer PK |
| reason_code | varchar |
| reason_text | text |
| is_active | boolean |
| created_at | **timestamp (no tz)** |

### `ref_clinical_interactions`
| column | type |
|---|---|
| interaction_id | bigint PK |
| substance_name | text |
| interactor_name | text |
| interactor_category | text |
| risk_level | integer |
| severity_grade | text |
| clinical_description | text |
| mechanism | text |
| evidence_source | text |
| source_url | text |
| is_verified | boolean |
| created_at | timestamptz |

### `ref_clinical_observations`
> 🔴 `created_at` is `timestamp without time zone` — WO-530B pending

| column | type |
|---|---|
| observation_id | integer PK |
| observation_code | varchar |
| observation_text | text |
| category | varchar |
| is_active | boolean |
| created_at | **timestamp (no tz)** |
| sort_order | integer |

### `ref_clinical_phenotypes`
| column | type |
|---|---|
| clinical_phenotype_id | bigint PK |
| phenotype_code | text |
| phenotype_name | text |
| icd10_category | text |
| is_active | boolean |
| created_at | timestamptz |

### `ref_consent_types`
| column | type |
|---|---|
| id | integer PK |
| consent_code | varchar |
| label | varchar |
| is_active | boolean |

### `ref_contraindication_verdicts`
| column | type |
|---|---|
| verdict_id | bigint PK |
| verdict_code | text |
| verdict_label | text |
| ui_color_hex | text |
| is_active | boolean |
| created_at | timestamptz |

### `ref_crisis_event_types`
| column | type |
|---|---|
| id | integer PK |
| event_code | varchar |
| label | varchar |
| severity_tier | smallint |
| is_active | boolean |
| created_at | timestamptz |

### `ref_data_sources`
| column | type |
|---|---|
| data_source_id | bigint PK |
| source_code | text |
| source_label | text |
| is_active | boolean |
| created_at | timestamptz |

### `ref_ekg_rhythms`
| column | type |
|---|---|
| id | integer PK |
| code | varchar |
| label | varchar |
| severity_tier | varchar |
| is_active | boolean |
| valid_from | date |
| valid_to | date |

### `ref_flow_event_types`
| column | type |
|---|---|
| id | bigint PK |
| event_type_code | text |
| event_type_label | text |
| event_category | text |
| stage_order | integer |
| is_active | boolean |
| description | text |
| created_at | timestamptz |

### `ref_homework_types`, `ref_session_focus_areas`, `ref_therapist_observations`
*Standard lookup tables — code + label + is_active pattern.*

### `ref_indications`
| column | type |
|---|---|
| indication_id | bigint PK |
| indication_name | text |
| snomed_code | text |
| icd10_code | text |
| indication_category | text |
| is_active | boolean |
| created_at | timestamptz |

### `ref_intervention_types`
> 🔴 `created_at` is `timestamp without time zone` — WO-530B pending

| column | type |
|---|---|
| intervention_type_id | integer PK |
| intervention_code | varchar |
| intervention_name | varchar |
| intervention_category | varchar |
| description | text |
| requires_documentation | boolean |
| is_active | boolean |
| created_at | **timestamp (no tz)** |

### `ref_justification_codes`
| column | type |
|---|---|
| justification_id | bigint PK |
| reason_text | text |

### `ref_knowledge_graph`
| column | type |
|---|---|
| rule_id | text PK |
| substance_a_id | text |
| substance_b_id | text |
| condition_code | text |
| risk_level | text |
| alert_message | text |

### `ref_meddra_codes`
> 🔴 `created_at` is `timestamp without time zone` — WO-530B pending

| column | type |
|---|---|
| meddra_code_id | integer PK |
| meddra_code | varchar |
| preferred_term | varchar |
| system_organ_class | varchar |
| severity_level | varchar |
| description | text |
| is_active | boolean |
| created_at | **timestamp (no tz)** |

### `ref_medications`
| column | type |
|---|---|
| medication_id | bigint PK |
| medication_name | text |
| medication_category | varchar |
| is_active | boolean |
| rxnorm_cui | varchar |
| created_at | timestamptz |

### `ref_population_baselines`
*Research reference data — read-only. See benchmark intelligence layer.*

### `ref_practitioner_types` / `ref_practitioners`
*Practitioner directory reference data.*

### `ref_routes`
| column | type |
|---|---|
| route_id | bigint PK |
| route_name | text |
| route_code | text |
| route_label | text |
| is_active | boolean |
| created_at | timestamptz |

### `ref_safety_events`
| column | type |
|---|---|
| safety_event_id | bigint PK |
| event_name | text |
| event_code | text |
| event_category | text |
| is_active | boolean |
| created_at | timestamptz |

### `ref_session_types`
| column | type |
|---|---|
| id | integer PK |
| session_code | varchar |
| session_label | varchar |
| is_active | boolean |
| created_at | timestamptz |

### `ref_severity_grade`
| column | type |
|---|---|
| severity_grade_id | bigint PK |
| grade_value | integer |
| grade_label | text |
| description | text |
| is_active | boolean |
| created_at | timestamptz |

### `ref_sex`
| column | type |
|---|---|
| sex_id | bigint PK |
| sex_code | text |
| sex_label | text |
| sort_order | integer |
| is_active | boolean |
| created_at | timestamptz |

### `ref_smoking_status`
| column | type |
|---|---|
| smoking_status_id | bigint PK |
| status_name | text |
| status_code | text |
| is_active | boolean |
| created_at | timestamptz |

### `ref_substances`
| column | type |
|---|---|
| substance_id | bigint PK |
| substance_name | text |
| rxnorm_cui | bigint |
| substance_class | text |
| is_active | boolean |
| created_at | timestamptz |
| receptor_5ht2a_ki | numeric |
| receptor_5ht1a_ki | numeric |
| receptor_5ht2c_ki | numeric |
| receptor_d2_ki | numeric |
| receptor_sert_ki | numeric |
| receptor_nmda_ki | numeric |
| primary_mechanism | text |

### `ref_support_modality`
| column | type |
|---|---|
| modality_id | bigint PK |
| modality_name | text |
| modality_code | text |
| description | text |
| is_active | boolean |
| created_at | timestamptz |

### `ref_system_action_types`
| column | type |
|---|---|
| id | integer PK |
| action_code | varchar |
| label | varchar |
| is_active | boolean |

### `ref_user_roles`
> Platform subscription/access roles. NOT clinical site roles. Do not use for `log_user_sites.role`.

| id | role_name |
|---|---|
| 1 | admin |
| 2 | partner |
| 3 | user |
| 4 | owner |
| 5 | partner_free |
| 6 | partner_paid |
| 7 | beta_observer |
| 8 | user_free |
| 9 | user_pro |
| 10 | user_premium |
| 11 | user_enterprise |

### `ref_weight_ranges`
| column | type |
|---|---|
| id | bigint PK |
| range_label | text |
| kg_low | numeric |
| kg_high | numeric |
| sort_order | integer |
| is_active | boolean |
| created_at | timestamptz |
| updated_at | timestamptz |

---

## WO-530B PENDING MIGRATION (ref_ tables)

5 `ref_` tables were missed in the WO-530 log_ migration. Apply to staging then production:

```sql
-- WO-530B: Fix remaining timestamp without time zone in ref_ tables
ALTER TABLE public.ref_assessment_scales
  ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC';

ALTER TABLE public.ref_cancellation_reasons
  ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC';

ALTER TABLE public.ref_clinical_observations
  ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC';

ALTER TABLE public.ref_intervention_types
  ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC';

ALTER TABLE public.ref_meddra_codes
  ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC';

-- Verification (expected: 0 rows)
SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND data_type = 'timestamp without time zone'
ORDER BY table_name, column_name;
```
