| table_name                        | column_name                    | data_type                | is_nullable | column_default                                                                   |
| --------------------------------- | ------------------------------ | ------------------------ | ----------- | -------------------------------------------------------------------------------- |
| _schema_lock                      | locked_at                      | timestamp with time zone | NO          | now()                                                                            |
| _schema_lock                      | locked_by                      | text                     | YES         | null                                                                             |
| _schema_lock                      | reason                         | text                     | YES         | null                                                                             |
| log_baseline_assessments          | baseline_assessment_id         | integer                  | NO          | nextval('log_baseline_assessments_baseline_assessment_id_seq'::regclass)         |
| log_baseline_assessments          | site_id                        | uuid                     | YES         | null                                                                             |
| log_baseline_assessments          | assessment_date                | timestamp with time zone | NO          | now()                                                                            |
| log_baseline_assessments          | phq9_score                     | integer                  | YES         | null                                                                             |
| log_baseline_assessments          | gad7_score                     | integer                  | YES         | null                                                                             |
| log_baseline_assessments          | ace_score                      | integer                  | YES         | null                                                                             |
| log_baseline_assessments          | pcl5_score                     | integer                  | YES         | null                                                                             |
| log_baseline_assessments          | expectancy_scale               | integer                  | YES         | null                                                                             |
| log_baseline_assessments          | resting_hrv                    | numeric                  | YES         | null                                                                             |
| log_baseline_assessments          | resting_bp_systolic            | integer                  | YES         | null                                                                             |
| log_baseline_assessments          | resting_bp_diastolic           | integer                  | YES         | null                                                                             |
| log_baseline_assessments          | completed_by_user_id           | uuid                     | YES         | null                                                                             |
| log_baseline_assessments          | created_at                     | timestamp with time zone | YES         | now()                                                                            |
| log_baseline_assessments          | updated_at                     | timestamp with time zone | YES         | now()                                                                            |
| log_baseline_assessments          | patient_uuid                   | uuid                     | YES         | null                                                                             |
| log_baseline_assessments          | psychospiritual_history_id     | bigint                   | YES         | null                                                                             |
| log_baseline_assessments          | created_by                     | uuid                     | YES         | null                                                                             |
| log_baseline_observations         | id                             | integer                  | NO          | nextval('log_baseline_observations_id_seq'::regclass)                            |
| log_baseline_observations         | baseline_assessment_id         | integer                  | YES         | null                                                                             |
| log_baseline_observations         | observation_id                 | integer                  | YES         | null                                                                             |
| log_baseline_observations         | created_at                     | timestamp with time zone | YES         | now()                                                                            |
| log_behavioral_changes            | behavioral_change_id           | integer                  | NO          | nextval('log_behavioral_changes_behavioral_change_id_seq'::regclass)             |
| log_behavioral_changes            | session_id                     | uuid                     | YES         | null                                                                             |
| log_behavioral_changes            | change_date                    | date                     | NO          | null                                                                             |
| log_behavioral_changes            | is_positive                    | boolean                  | NO          | null                                                                             |
| log_behavioral_changes            | logged_at                      | timestamp with time zone | YES         | now()                                                                            |
| log_behavioral_changes            | change_category                | character varying        | YES         | null                                                                             |
| log_behavioral_changes            | change_type_ids                | ARRAY                    | YES         | null                                                                             |
| log_behavioral_changes            | impact_on_wellbeing            | character varying        | YES         | null                                                                             |
| log_behavioral_changes            | confidence_sustaining          | integer                  | YES         | null                                                                             |
| log_behavioral_changes            | related_to_dosing              | character varying        | YES         | null                                                                             |
| log_behavioral_changes            | patient_uuid                   | uuid                     | YES         | null                                                                             |
| log_behavioral_changes            | created_at                     | timestamp with time zone | YES         | now()                                                                            |
| log_behavioral_changes            | created_by                     | uuid                     | YES         | null                                                                             |
| log_clinical_records              | id                             | uuid                     | NO          | gen_random_uuid()                                                                |
| log_clinical_records              | created_at                     | timestamp with time zone | NO          | timezone('utc'::text, now())                                                     |
| log_clinical_records              | practitioner_id                | uuid                     | NO          | null                                                                             |
| log_clinical_records              | substance_id                   | integer                  | YES         | null                                                                             |
| log_clinical_records              | protocol_id                    | integer                  | YES         | null                                                                             |
| log_clinical_records              | dosage_amount                  | numeric                  | YES         | null                                                                             |
| log_clinical_records              | outcome_score                  | integer                  | YES         | null                                                                             |
| log_clinical_records              | severity_rating                | integer                  | YES         | 0                                                                                |
| log_clinical_records              | site_id                        | uuid                     | YES         | null                                                                             |
| log_clinical_records              | indication_id                  | bigint                   | YES         | null                                                                             |
| log_clinical_records              | session_number                 | integer                  | YES         | null                                                                             |
| log_clinical_records              | session_date                   | date                     | YES         | null                                                                             |
| log_clinical_records              | protocol_template_id           | uuid                     | YES         | null                                                                             |
| log_clinical_records              | support_modality_ids           | ARRAY                    | YES         | null                                                                             |
| log_clinical_records              | patient_smoking_status_id      | bigint                   | YES         | null                                                                             |
| log_clinical_records              | baseline_phq9_score            | integer                  | YES         | null                                                                             |
| log_clinical_records              | psychological_difficulty_score | integer                  | YES         | null                                                                             |
| log_clinical_records              | route_id                       | bigint                   | YES         | null                                                                             |
| log_clinical_records              | safety_event_id                | bigint                   | YES         | null                                                                             |
| log_clinical_records              | severity_grade_id              | bigint                   | YES         | null                                                                             |
| log_clinical_records              | resolution_status_id           | bigint                   | YES         | null                                                                             |
| log_clinical_records              | is_submitted                   | boolean                  | YES         | false                                                                            |
| log_clinical_records              | submitted_at                   | timestamp with time zone | YES         | null                                                                             |
| log_clinical_records              | dosage_mg                      | numeric                  | YES         | null                                                                             |
| log_clinical_records              | dose_administered_at           | timestamp with time zone | YES         | null                                                                             |
| log_clinical_records              | onset_reported_at              | timestamp with time zone | YES         | null                                                                             |
| log_clinical_records              | peak_intensity_at              | timestamp with time zone | YES         | null                                                                             |
| log_clinical_records              | session_ended_at               | timestamp with time zone | YES         | null                                                                             |
| log_clinical_records              | meq30_score                    | integer                  | YES         | null                                                                             |
| log_clinical_records              | meq30_completed_at             | timestamp with time zone | YES         | null                                                                             |
| log_clinical_records              | edi_score                      | integer                  | YES         | null                                                                             |
| log_clinical_records              | edi_completed_at               | timestamp with time zone | YES         | null                                                                             |
| log_clinical_records              | ceq_score                      | integer                  | YES         | null                                                                             |
| log_clinical_records              | ceq_completed_at               | timestamp with time zone | YES         | null                                                                             |
| log_clinical_records              | guide_user_id                  | uuid                     | YES         | null                                                                             |
| log_clinical_records              | contraindication_assessed_at   | timestamp with time zone | YES         | null                                                                             |
| log_clinical_records              | session_type_id                | integer                  | YES         | null                                                                             |
| log_clinical_records              | justification_code_id          | bigint                   | YES         | null                                                                             |
| log_clinical_records              | assessment_scale_id            | integer                  | YES         | null                                                                             |
| log_clinical_records              | clinical_phenotype_id          | bigint                   | YES         | null                                                                             |
| log_clinical_records              | contraindication_verdict_id    | bigint                   | YES         | null                                                                             |
| log_clinical_records              | patient_sex_id                 | bigint                   | YES         | null                                                                             |
| log_clinical_records              | weight_range_id                | bigint                   | YES         | null                                                                             |
| log_clinical_records              | concomitant_med_ids            | ARRAY                    | YES         | null                                                                             |
| log_clinical_records              | patient_age_years              | integer                  | YES         | null                                                                             |
| log_clinical_records              | created_by                     | uuid                     | YES         | null                                                                             |
| log_clinical_records              | patient_link_code_hash         | text                     | YES         | null                                                                             |
| log_clinical_records              | session_started_at             | timestamp with time zone | YES         | null                                                                             |
| log_clinical_records              | patient_uuid                   | uuid                     | NO          | null                                                                             |
| log_consent                       | id                             | bigint                   | NO          | null                                                                             |
| log_consent                       | created_at                     | timestamp with time zone | NO          | timezone('utc'::text, now())                                                     |
| log_consent                       | record_id                      | bigint                   | YES         | null                                                                             |
| log_consent                       | verified                       | boolean                  | YES         | null                                                                             |
| log_consent                       | site_id                        | uuid                     | YES         | null                                                                             |
| log_consent                       | verified_at                    | timestamp with time zone | YES         | null                                                                             |
| log_consent                       | consent_type_id                | integer                  | YES         | null                                                                             |
| log_consent                       | created_by                     | uuid                     | YES         | null                                                                             |
| log_corrections                   | correction_id                  | uuid                     | NO          | gen_random_uuid()                                                                |
| log_corrections                   | source_table                   | text                     | NO          | null                                                                             |
| log_corrections                   | source_row_id                  | uuid                     | NO          | null                                                                             |
| log_corrections                   | field_name                     | text                     | NO          | null                                                                             |
| log_corrections                   | old_value_json                 | jsonb                    | YES         | null                                                                             |
| log_corrections                   | new_value_json                 | jsonb                    | NO          | null                                                                             |
| log_corrections                   | correction_type                | text                     | NO          | null                                                                             |
| log_corrections                   | correction_reason              | text                     | NO          | null                                                                             |
| log_corrections                   | corrected_by                   | uuid                     | YES         | null                                                                             |
| log_corrections                   | site_id                        | uuid                     | YES         | null                                                                             |
| log_corrections                   | corrected_at                   | timestamp with time zone | YES         | now()                                                                            |
| log_corrections                   | approved_by                    | uuid                     | YES         | null                                                                             |
| log_corrections                   | approved_at                    | timestamp with time zone | YES         | null                                                                             |
| log_corrections                   | created_at                     | timestamp with time zone | YES         | now()                                                                            |
| log_corrections                   | created_by                     | uuid                     | YES         | null                                                                             |
| log_dose_events                   | id                             | bigint                   | NO          | nextval('log_dose_events_id_seq'::regclass)                                      |
| log_dose_events                   | session_id                     | uuid                     | NO          | null                                                                             |
| log_dose_events                   | patient_id                     | character varying        | NO          | null                                                                             |
| log_dose_events                   | substance_id                   | bigint                   | NO          | null                                                                             |
| log_dose_events                   | dose_mg                        | numeric                  | NO          | null                                                                             |
| log_dose_events                   | weight_kg                      | numeric                  | NO          | null                                                                             |
| log_dose_events                   | dose_mg_per_kg                 | numeric                  | YES         | null                                                                             |
| log_dose_events                   | cumulative_mg                  | numeric                  | YES         | null                                                                             |
| log_dose_events                   | cumulative_mg_per_kg           | numeric                  | YES         | null                                                                             |
| log_dose_events                   | event_type                     | character varying        | NO          | 'booster'::character varying                                                     |
| log_dose_events                   | administered_at                | timestamp with time zone | NO          | now()                                                                            |
| log_dose_events                   | created_at                     | timestamp with time zone | NO          | now()                                                                            |
| log_dose_events                   | substance_type                 | character varying        | NO          | 'HCl'::character varying                                                         |
| log_dose_events                   | created_by                     | uuid                     | YES         | null                                                                             |
| log_feature_flags                 | id                             | bigint                   | NO          | nextval('feature_flags_id_seq'::regclass)                                        |
| log_feature_flags                 | flag_name                      | text                     | NO          | null                                                                             |
| log_feature_flags                 | description                    | text                     | YES         | null                                                                             |
| log_feature_flags                 | enabled_for_all                | boolean                  | YES         | false                                                                            |
| log_feature_flags                 | enabled_site_ids               | ARRAY                    | YES         | '{}'::uuid[]                                                                     |
| log_feature_flags                 | enabled_user_ids               | ARRAY                    | YES         | '{}'::uuid[]                                                                     |
| log_feature_flags                 | enabled_tiers                  | ARRAY                    | YES         | '{}'::text[]                                                                     |
| log_feature_flags                 | created_at                     | timestamp with time zone | NO          | now()                                                                            |
| log_feature_flags                 | updated_at                     | timestamp with time zone | NO          | now()                                                                            |
| log_feature_flags                 | created_by                     | uuid                     | YES         | null                                                                             |
| log_feature_requests              | request_id                     | integer                  | NO          | nextval('log_feature_requests_request_id_seq'::regclass)                         |
| log_feature_requests              | user_id                        | uuid                     | YES         | null                                                                             |
| log_feature_requests              | site_id                        | uuid                     | YES         | null                                                                             |
| log_feature_requests              | request_type                   | character varying        | NO          | 'vocabulary_request'::character varying                                          |
| log_feature_requests              | requested_text                 | text                     | NO          | ''::text                                                                         |
| log_feature_requests              | category                       | character varying        | YES         | null                                                                             |
| log_feature_requests              | status                         | character varying        | YES         | 'pending'::character varying                                                     |
| log_feature_requests              | reviewed_by                    | uuid                     | YES         | null                                                                             |
| log_feature_requests              | reviewed_at                    | timestamp with time zone | YES         | null                                                                             |
| log_feature_requests              | created_at                     | timestamp with time zone | YES         | now()                                                                            |
| log_feature_requests              | rejection_reason_id            | bigint                   | YES         | null                                                                             |
| log_feature_requests              | created_by                     | uuid                     | YES         | null                                                                             |
| log_integration_sessions          | integration_session_id         | integer                  | NO          | nextval('log_integration_sessions_integration_session_id_seq'::regclass)         |
| log_integration_sessions          | dosing_session_id              | uuid                     | YES         | null                                                                             |
| log_integration_sessions          | integration_session_number     | integer                  | NO          | null                                                                             |
| log_integration_sessions          | session_date                   | date                     | NO          | null                                                                             |
| log_integration_sessions          | session_duration_minutes       | integer                  | YES         | null                                                                             |
| log_integration_sessions          | therapist_user_id              | uuid                     | YES         | null                                                                             |
| log_integration_sessions          | attended                       | boolean                  | YES         | true                                                                             |
| log_integration_sessions          | created_at                     | timestamp with time zone | YES         | now()                                                                            |
| log_integration_sessions          | cancellation_reason_id         | integer                  | YES         | null                                                                             |
| log_integration_sessions          | insight_integration_rating     | integer                  | YES         | null                                                                             |
| log_integration_sessions          | emotional_processing_rating    | integer                  | YES         | null                                                                             |
| log_integration_sessions          | behavioral_application_rating  | integer                  | YES         | null                                                                             |
| log_integration_sessions          | engagement_level_rating        | integer                  | YES         | null                                                                             |
| log_integration_sessions          | session_focus_ids              | ARRAY                    | YES         | null                                                                             |
| log_integration_sessions          | homework_assigned_ids          | ARRAY                    | YES         | null                                                                             |
| log_integration_sessions          | therapist_observation_ids      | ARRAY                    | YES         | null                                                                             |
| log_integration_sessions          | patient_uuid                   | uuid                     | YES         | null                                                                             |
| log_integration_sessions          | created_by                     | uuid                     | YES         | null                                                                             |
| log_interventions                 | id                             | bigint                   | NO          | null                                                                             |
| log_interventions                 | created_at                     | timestamp with time zone | NO          | timezone('utc'::text, now())                                                     |
| log_interventions                 | site_id                        | uuid                     | YES         | null                                                                             |
| log_interventions                 | status                         | text                     | YES         | null                                                                             |
| log_interventions                 | demographics                   | jsonb                    | YES         | null                                                                             |
| log_interventions                 | protocol                       | jsonb                    | YES         | null                                                                             |
| log_interventions                 | context                        | jsonb                    | YES         | null                                                                             |
| log_interventions                 | safety_events                  | jsonb                    | YES         | null                                                                             |
| log_interventions                 | substance_id                   | bigint                   | YES         | null                                                                             |
| log_interventions                 | support_modality_ids           | ARRAY                    | YES         | '{}'::bigint[]                                                                   |
| log_interventions                 | session_id                     | uuid                     | YES         | null                                                                             |
| log_interventions                 | intervention_type_id           | integer                  | YES         | null                                                                             |
| log_interventions                 | created_by                     | uuid                     | YES         | null                                                                             |
| log_longitudinal_assessments      | longitudinal_assessment_id     | integer                  | NO          | nextval('log_longitudinal_assessments_longitudinal_assessment_id_seq'::regclass) |
| log_longitudinal_assessments      | session_id                     | uuid                     | YES         | null                                                                             |
| log_longitudinal_assessments      | assessment_date                | date                     | NO          | null                                                                             |
| log_longitudinal_assessments      | days_post_session              | integer                  | YES         | null                                                                             |
| log_longitudinal_assessments      | phq9_score                     | integer                  | YES         | null                                                                             |
| log_longitudinal_assessments      | gad7_score                     | integer                  | YES         | null                                                                             |
| log_longitudinal_assessments      | whoqol_score                   | integer                  | YES         | null                                                                             |
| log_longitudinal_assessments      | psqi_score                     | integer                  | YES         | null                                                                             |
| log_longitudinal_assessments      | cssrs_score                    | integer                  | YES         | null                                                                             |
| log_longitudinal_assessments      | completed_at                   | timestamp with time zone | YES         | now()                                                                            |
| log_longitudinal_assessments      | patient_uuid                   | uuid                     | YES         | null                                                                             |
| log_longitudinal_assessments      | created_at                     | timestamp with time zone | YES         | now()                                                                            |
| log_longitudinal_assessments      | created_by                     | uuid                     | YES         | null                                                                             |
| log_outcomes                      | id                             | bigint                   | NO          | null                                                                             |
| log_outcomes                      | created_at                     | timestamp with time zone | NO          | timezone('utc'::text, now())                                                     |
| log_outcomes                      | record_id                      | bigint                   | YES         | null                                                                             |
| log_outcomes                      | score                          | integer                  | YES         | null                                                                             |
| log_outcomes                      | site_id                        | uuid                     | YES         | null                                                                             |
| log_outcomes                      | observed_at                    | timestamp with time zone | YES         | null                                                                             |
| log_outcomes                      | assessment_scale_id            | integer                  | YES         | null                                                                             |
| log_outcomes                      | created_by                     | uuid                     | YES         | null                                                                             |
| log_outcomes                      | outcome_date                   | date                     | YES         | null                                                                             |
| log_patient_flow_events           | id                             | uuid                     | NO          | uuid_generate_v4()                                                               |
| log_patient_flow_events           | site_id                        | uuid                     | NO          | null                                                                             |
| log_patient_flow_events           | practitioner_id                | uuid                     | YES         | null                                                                             |
| log_patient_flow_events           | patient_link_code_hash         | text                     | NO          | null                                                                             |
| log_patient_flow_events           | event_type_id                  | bigint                   | NO          | null                                                                             |
| log_patient_flow_events           | event_at                       | timestamp with time zone | NO          | null                                                                             |
| log_patient_flow_events           | protocol_id                    | uuid                     | YES         | null                                                                             |
| log_patient_flow_events           | substance_id                   | bigint                   | YES         | null                                                                             |
| log_patient_flow_events           | route_id                       | bigint                   | YES         | null                                                                             |
| log_patient_flow_events           | support_modality_ids           | ARRAY                    | YES         | null                                                                             |
| log_patient_flow_events           | source_id                      | uuid                     | YES         | null                                                                             |
| log_patient_flow_events           | created_at                     | timestamp with time zone | YES         | now()                                                                            |
| log_patient_flow_events           | created_by                     | uuid                     | YES         | null                                                                             |
| log_patient_flow_events           | updated_at                     | timestamp with time zone | YES         | now()                                                                            |
| log_patient_flow_events           | justification_id               | bigint                   | YES         | null                                                                             |
| log_patient_site_links            | id                             | bigint                   | NO          | nextval('patient_site_links_id_seq'::regclass)                                   |
| log_patient_site_links            | patient_link_code              | text                     | NO          | null                                                                             |
| log_patient_site_links            | site_id                        | uuid                     | NO          | null                                                                             |
| log_patient_site_links            | transferred_from_site_id       | uuid                     | YES         | null                                                                             |
| log_patient_site_links            | transfer_date                  | timestamp with time zone | YES         | null                                                                             |
| log_patient_site_links            | is_active                      | boolean                  | YES         | true                                                                             |
| log_patient_site_links            | created_at                     | timestamp with time zone | NO          | now()                                                                            |
| log_patient_site_links            | updated_at                     | timestamp with time zone | NO          | now()                                                                            |
| log_patient_site_links            | patient_uuid                   | uuid                     | NO          | null                                                                             |
| log_protocols                     | id                             | uuid                     | NO          | gen_random_uuid()                                                                |
| log_protocols                     | user_id                        | uuid                     | YES         | null                                                                             |
| log_protocols                     | created_at                     | timestamp with time zone | YES         | now()                                                                            |
| log_protocols                     | updated_at                     | timestamp with time zone | YES         | now()                                                                            |
| log_protocols                     | name                           | text                     | NO          | null                                                                             |
| log_protocols                     | status                         | text                     | YES         | 'draft'::text                                                                    |
| log_protocols                     | dosing_schedule                | jsonb                    | YES         | null                                                                             |
| log_protocols                     | safety_criteria                | jsonb                    | YES         | null                                                                             |
| log_protocols                     | outcome_measures               | jsonb                    | YES         | null                                                                             |
| log_protocols                     | protocol_rationale_id          | bigint                   | YES         | null                                                                             |
| log_protocols                     | substance_id                   | bigint                   | YES         | null                                                                             |
| log_protocols                     | indication_id                  | bigint                   | YES         | null                                                                             |
| log_protocols                     | created_by                     | uuid                     | YES         | null                                                                             |
| log_pulse_checks                  | pulse_check_id                 | integer                  | NO          | nextval('log_pulse_checks_pulse_check_id_seq'::regclass)                         |
| log_pulse_checks                  | session_id                     | uuid                     | YES         | null                                                                             |
| log_pulse_checks                  | check_date                     | date                     | NO          | CURRENT_DATE                                                                     |
| log_pulse_checks                  | connection_level               | integer                  | YES         | null                                                                             |
| log_pulse_checks                  | sleep_quality                  | integer                  | YES         | null                                                                             |
| log_pulse_checks                  | mood_level                     | integer                  | YES         | null                                                                             |
| log_pulse_checks                  | anxiety_level                  | integer                  | YES         | null                                                                             |
| log_pulse_checks                  | completed_at                   | timestamp with time zone | YES         | now()                                                                            |
| log_pulse_checks                  | patient_uuid                   | uuid                     | YES         | null                                                                             |
| log_pulse_checks                  | created_at                     | timestamp with time zone | YES         | now()                                                                            |
| log_pulse_checks                  | created_by                     | uuid                     | YES         | null                                                                             |
| log_red_alerts                    | red_alert_id                   | integer                  | NO          | nextval('log_red_alerts_red_alert_id_seq'::regclass)                             |
| log_red_alerts                    | alert_triggered_at             | timestamp with time zone | NO          | now()                                                                            |
| log_red_alerts                    | trigger_value                  | jsonb                    | YES         | null                                                                             |
| log_red_alerts                    | is_acknowledged                | boolean                  | YES         | false                                                                            |
| log_red_alerts                    | acknowledged_by_user_id        | uuid                     | YES         | null                                                                             |
| log_red_alerts                    | acknowledged_at                | timestamp with time zone | YES         | null                                                                             |
| log_red_alerts                    | is_resolved                    | boolean                  | YES         | false                                                                            |
| log_red_alerts                    | resolved_at                    | timestamp with time zone | YES         | null                                                                             |
| log_red_alerts                    | created_at                     | timestamp with time zone | YES         | now()                                                                            |
| log_red_alerts                    | crisis_event_type_id           | integer                  | YES         | null                                                                             |
| log_red_alerts                    | severity_grade_fk              | bigint                   | YES         | null                                                                             |
| log_red_alerts                    | patient_uuid                   | uuid                     | YES         | null                                                                             |
| log_red_alerts                    | severity_grade_id              | bigint                   | YES         | null                                                                             |
| log_red_alerts                    | alert_type_id                  | bigint                   | YES         | null                                                                             |
| log_red_alerts                    | created_by                     | uuid                     | YES         | null                                                                             |
| log_safety_event_observations     | id                             | integer                  | NO          | nextval('log_safety_event_observations_id_seq'::regclass)                        |
| log_safety_event_observations     | safety_event_id                | text                     | YES         | null                                                                             |
| log_safety_event_observations     | observation_id                 | integer                  | YES         | null                                                                             |
| log_safety_event_observations     | created_at                     | timestamp with time zone | YES         | now()                                                                            |
| log_safety_events                 | ae_id                          | text                     | NO          | null                                                                             |
| log_safety_events                 | exposure_id                    | text                     | YES         | null                                                                             |
| log_safety_events                 | event_id                       | text                     | YES         | null                                                                             |
| log_safety_events                 | causality_code                 | text                     | YES         | null                                                                             |
| log_safety_events                 | site_id                        | uuid                     | YES         | null                                                                             |
| log_safety_events                 | session_id                     | uuid                     | YES         | null                                                                             |
| log_safety_events                 | meddra_code_id                 | integer                  | YES         | null                                                                             |
| log_safety_events                 | intervention_type_id           | integer                  | YES         | null                                                                             |
| log_safety_events                 | is_resolved                    | boolean                  | YES         | false                                                                            |
| log_safety_events                 | resolved_at                    | timestamp with time zone | YES         | null                                                                             |
| log_safety_events                 | logged_by_user_id              | uuid                     | YES         | null                                                                             |
| log_safety_events                 | report_pdf_url                 | text                     | YES         | null                                                                             |
| log_safety_events                 | report_generated_at            | timestamp with time zone | YES         | null                                                                             |
| log_safety_events                 | ctcae_grade                    | smallint                 | YES         | null                                                                             |
| log_safety_events                 | severity_grade_id_fk           | bigint                   | YES         | null                                                                             |
| log_safety_events                 | resolution_status_id_fk        | bigint                   | YES         | null                                                                             |
| log_safety_events                 | safety_event_type_id           | bigint                   | YES         | null                                                                             |
| log_safety_events                 | created_at                     | timestamp with time zone | YES         | now()                                                                            |
| log_safety_events                 | created_by                     | uuid                     | YES         | null                                                                             |
| log_session_observations          | id                             | integer                  | NO          | nextval('log_session_observations_id_seq'::regclass)                             |
| log_session_observations          | session_id                     | uuid                     | YES         | null                                                                             |
| log_session_observations          | observation_id                 | integer                  | YES         | null                                                                             |
| log_session_observations          | created_at                     | timestamp with time zone | YES         | now()                                                                            |
| log_session_timeline_events       | timeline_event_id              | uuid                     | NO          | gen_random_uuid()                                                                |
| log_session_timeline_events       | session_id                     | uuid                     | YES         | null                                                                             |
| log_session_timeline_events       | event_timestamp                | timestamp with time zone | NO          | null                                                                             |
| log_session_timeline_events       | event_type_id                  | integer                  | YES         | null                                                                             |
| log_session_timeline_events       | performed_by                   | uuid                     | YES         | null                                                                             |
| log_session_timeline_events       | metadata                       | jsonb                    | YES         | null                                                                             |
| log_session_timeline_events       | created_at                     | timestamp with time zone | YES         | now()                                                                            |
| log_session_timeline_events       | created_by                     | uuid                     | YES         | null                                                                             |
| log_session_vitals                | session_vital_id               | integer                  | NO          | nextval('log_session_vitals_session_vital_id_seq'::regclass)                     |
| log_session_vitals                | session_id                     | uuid                     | YES         | null                                                                             |
| log_session_vitals                | recorded_at                    | timestamp with time zone | NO          | null                                                                             |
| log_session_vitals                | heart_rate                     | integer                  | YES         | null                                                                             |
| log_session_vitals                | hrv                            | numeric                  | YES         | null                                                                             |
| log_session_vitals                | bp_systolic                    | integer                  | YES         | null                                                                             |
| log_session_vitals                | bp_diastolic                   | integer                  | YES         | null                                                                             |
| log_session_vitals                | oxygen_saturation              | integer                  | YES         | null                                                                             |
| log_session_vitals                | device_id                      | character varying        | YES         | null                                                                             |
| log_session_vitals                | created_at                     | timestamp with time zone | YES         | now()                                                                            |
| log_session_vitals                | respiratory_rate               | integer                  | YES         | null                                                                             |
| log_session_vitals                | temperature                    | numeric                  | YES         | null                                                                             |
| log_session_vitals                | diaphoresis_score              | integer                  | YES         | null                                                                             |
| log_session_vitals                | level_of_consciousness         | character varying        | YES         | null                                                                             |
| log_session_vitals                | data_source_id                 | bigint                   | YES         | null                                                                             |
| log_session_vitals                | created_by                     | uuid                     | YES         | null                                                                             |
| log_sites                         | site_id                        | uuid                     | NO          | gen_random_uuid()                                                                |
| log_sites                         | site_name                      | text                     | NO          | null                                                                             |
| log_sites                         | region                         | text                     | YES         | null                                                                             |
| log_sites                         | created_at                     | timestamp with time zone | NO          | now()                                                                            |
| log_sites                         | is_active                      | boolean                  | YES         | true                                                                             |
| log_sites                         | site_type                      | text                     | YES         | null                                                                             |
| log_subscriptions                 | id                             | uuid                     | NO          | gen_random_uuid()                                                                |
| log_subscriptions                 | site_id                        | uuid                     | NO          | null                                                                             |
| log_subscriptions                 | stripe_customer_id             | text                     | YES         | null                                                                             |
| log_subscriptions                 | stripe_subscription_id         | text                     | YES         | null                                                                             |
| log_subscriptions                 | stripe_price_id                | text                     | YES         | null                                                                             |
| log_subscriptions                 | tier                           | text                     | NO          | null                                                                             |
| log_subscriptions                 | status                         | text                     | NO          | null                                                                             |
| log_subscriptions                 | current_period_start           | timestamp with time zone | YES         | null                                                                             |
| log_subscriptions                 | current_period_end             | timestamp with time zone | YES         | null                                                                             |
| log_subscriptions                 | trial_end                      | timestamp with time zone | YES         | null                                                                             |
| log_subscriptions                 | canceled_at                    | timestamp with time zone | YES         | null                                                                             |
| log_subscriptions                 | max_users                      | integer                  | YES         | null                                                                             |
| log_subscriptions                 | max_sites                      | integer                  | YES         | null                                                                             |
| log_subscriptions                 | max_records_per_month          | integer                  | YES         | null                                                                             |
| log_subscriptions                 | created_at                     | timestamp with time zone | NO          | now()                                                                            |
| log_subscriptions                 | updated_at                     | timestamp with time zone | NO          | now()                                                                            |
| log_system_events                 | event_id                       | bigint                   | NO          | nextval('system_events_event_id_seq'::regclass)                                  |
| log_system_events                 | actor_id                       | uuid                     | YES         | null                                                                             |
| log_system_events                 | event_type                     | text                     | NO          | null                                                                             |
| log_system_events                 | event_details                  | jsonb                    | YES         | null                                                                             |
| log_system_events                 | event_status                   | text                     | YES         | null                                                                             |
| log_system_events                 | created_at                     | timestamp with time zone | NO          | now()                                                                            |
| log_system_events                 | ledger_hash                    | text                     | YES         | null                                                                             |
| log_system_events                 | site_id                        | uuid                     | YES         | null                                                                             |
| log_system_events                 | action_type_id                 | integer                  | YES         | null                                                                             |
| log_usage_metrics                 | id                             | bigint                   | NO          | nextval('usage_metrics_id_seq'::regclass)                                        |
| log_usage_metrics                 | site_id                        | uuid                     | NO          | null                                                                             |
| log_usage_metrics                 | metric_type                    | text                     | NO          | null                                                                             |
| log_usage_metrics                 | count                          | integer                  | NO          | 0                                                                                |
| log_usage_metrics                 | period_start                   | date                     | NO          | null                                                                             |
| log_usage_metrics                 | period_end                     | date                     | NO          | null                                                                             |
| log_usage_metrics                 | created_at                     | timestamp with time zone | NO          | now()                                                                            |
| log_user_profiles                 | id                             | uuid                     | NO          | gen_random_uuid()                                                                |
| log_user_profiles                 | user_id                        | uuid                     | NO          | null                                                                             |
| log_user_profiles                 | created_at                     | timestamp with time zone | YES         | now()                                                                            |
| log_user_profiles                 | role_id                        | integer                  | YES         | 3                                                                                |
| log_user_profiles                 | user_first_name                | text                     | YES         | null                                                                             |
| log_user_profiles                 | user_last_name                 | text                     | YES         | null                                                                             |
| log_user_saved_views              | id                             | uuid                     | NO          | uuid_generate_v4()                                                               |
| log_user_saved_views              | user_id                        | uuid                     | NO          | null                                                                             |
| log_user_saved_views              | view_name                      | text                     | NO          | null                                                                             |
| log_user_saved_views              | deep_dive_page                 | text                     | NO          | null                                                                             |
| log_user_saved_views              | filter_state                   | jsonb                    | NO          | null                                                                             |
| log_user_saved_views              | is_default                     | boolean                  | YES         | false                                                                            |
| log_user_saved_views              | created_at                     | timestamp with time zone | YES         | now()                                                                            |
| log_user_saved_views              | updated_at                     | timestamp with time zone | YES         | now()                                                                            |
| log_user_sites                    | user_id                        | uuid                     | NO          | null                                                                             |
| log_user_sites                    | site_id                        | uuid                     | NO          | null                                                                             |
| log_user_sites                    | role                           | text                     | NO          | null                                                                             |
| log_user_sites                    | is_active                      | boolean                  | YES         | true                                                                             |
| log_user_sites                    | created_at                     | timestamp with time zone | YES         | now()                                                                            |
| log_user_subscriptions            | id                             | uuid                     | NO          | uuid_generate_v4()                                                               |
| log_user_subscriptions            | user_id                        | uuid                     | NO          | null                                                                             |
| log_user_subscriptions            | stripe_customer_id             | text                     | NO          | null                                                                             |
| log_user_subscriptions            | stripe_subscription_id         | text                     | NO          | null                                                                             |
| log_user_subscriptions            | tier                           | text                     | NO          | null                                                                             |
| log_user_subscriptions            | status                         | text                     | NO          | null                                                                             |
| log_user_subscriptions            | trial_end                      | timestamp with time zone | YES         | null                                                                             |
| log_user_subscriptions            | current_period_end             | timestamp with time zone | NO          | null                                                                             |
| log_user_subscriptions            | cancel_at_period_end           | boolean                  | YES         | false                                                                            |
| log_user_subscriptions            | created_at                     | timestamp with time zone | YES         | now()                                                                            |
| log_user_subscriptions            | updated_at                     | timestamp with time zone | YES         | now()                                                                            |
| log_vocabulary_requests           | request_id                     | uuid                     | NO          | gen_random_uuid()                                                                |
| log_vocabulary_requests           | site_id                        | uuid                     | YES         | null                                                                             |
| log_vocabulary_requests           | requesting_user                | uuid                     | YES         | null                                                                             |
| log_vocabulary_requests           | target_ref_table               | text                     | NO          | null                                                                             |
| log_vocabulary_requests           | proposed_label                 | text                     | NO          | null                                                                             |
| log_vocabulary_requests           | clinical_rationale             | text                     | YES         | null                                                                             |
| log_vocabulary_requests           | status                         | text                     | NO          | 'pending'::text                                                                  |
| log_vocabulary_requests           | request_count                  | integer                  | YES         | 1                                                                                |
| log_vocabulary_requests           | requesting_sites               | ARRAY                    | YES         | null                                                                             |
| log_vocabulary_requests           | advisory_notes                 | text                     | YES         | null                                                                             |
| log_vocabulary_requests           | created_at                     | timestamp with time zone | YES         | now()                                                                            |
| log_vocabulary_requests           | reviewed_at                    | timestamp with time zone | YES         | null                                                                             |
| log_vocabulary_requests           | converted_to_ref_id            | bigint                   | YES         | null                                                                             |
| log_vocabulary_requests           | created_by                     | uuid                     | YES         | null                                                                             |
| log_waitlist                      | id                             | uuid                     | NO          | gen_random_uuid()                                                                |
| log_waitlist                      | created_at                     | timestamp with time zone | YES         | now()                                                                            |
| log_waitlist                      | email                          | text                     | NO          | null                                                                             |
| ref_alert_types                   | alert_type_id                  | bigint                   | NO          | null                                                                             |
| ref_alert_types                   | alert_code                     | text                     | NO          | null                                                                             |
| ref_alert_types                   | alert_label                    | text                     | NO          | null                                                                             |
| ref_alert_types                   | alert_category                 | text                     | NO          | null                                                                             |
| ref_alert_types                   | is_active                      | boolean                  | NO          | true                                                                             |
| ref_alert_types                   | created_at                     | timestamp with time zone | NO          | now()                                                                            |
| ref_assessment_interval           | assessment_interval_id         | bigint                   | NO          | null                                                                             |
| ref_assessment_interval           | assessment_interval            | text                     | YES         | null                                                                             |
| ref_assessment_scales             | assessment_scale_id            | integer                  | NO          | nextval('ref_assessment_scales_assessment_scale_id_seq'::regclass)               |
| ref_assessment_scales             | scale_code                     | character varying        | NO          | null                                                                             |
| ref_assessment_scales             | scale_name                     | character varying        | NO          | null                                                                             |
| ref_assessment_scales             | scale_description              | text                     | YES         | null                                                                             |
| ref_assessment_scales             | min_score                      | integer                  | NO          | null                                                                             |
| ref_assessment_scales             | max_score                      | integer                  | NO          | null                                                                             |
| ref_assessment_scales             | loinc_code                     | character varying        | YES         | null                                                                             |
| ref_assessment_scales             | snomed_code                    | character varying        | YES         | null                                                                             |
| ref_assessment_scales             | scoring_interpretation         | jsonb                    | YES         | null                                                                             |
| ref_assessment_scales             | is_active                      | boolean                  | YES         | true                                                                             |
| ref_assessment_scales             | created_at                     | timestamp with time zone | YES         | now()                                                                            |
| ref_assessments                   | assessment_id                  | bigint                   | NO          | null                                                                             |
| ref_assessments                   | test_short_name                | text                     | YES         | null                                                                             |
| ref_assessments                   | loinc_code                     | text                     | YES         | null                                                                             |
| ref_assessments                   | definition                     | text                     | YES         | null                                                                             |
| ref_behavioral_change_types       | change_type_id                 | integer                  | NO          | nextval('ref_behavioral_change_types_change_type_id_seq'::regclass)              |
| ref_behavioral_change_types       | change_type_code               | character varying        | NO          | null                                                                             |
| ref_behavioral_change_types       | change_type_label              | character varying        | NO          | null                                                                             |
| ref_behavioral_change_types       | category                       | character varying        | NO          | null                                                                             |
| ref_behavioral_change_types       | is_active                      | boolean                  | YES         | true                                                                             |
| ref_benchmark_cohorts             | id                             | uuid                     | NO          | gen_random_uuid()                                                                |
| ref_benchmark_cohorts             | cohort_name                    | text                     | NO          | null                                                                             |
| ref_benchmark_cohorts             | source_citation                | text                     | NO          | null                                                                             |
| ref_benchmark_cohorts             | modality                       | text                     | NO          | null                                                                             |
| ref_benchmark_cohorts             | condition                      | text                     | NO          | null                                                                             |
| ref_benchmark_cohorts             | setting                        | text                     | YES         | null                                                                             |
| ref_benchmark_cohorts             | n_participants                 | integer                  | NO          | null                                                                             |
| ref_benchmark_cohorts             | country                        | text                     | YES         | null                                                                             |
| ref_benchmark_cohorts             | instrument                     | text                     | NO          | null                                                                             |
| ref_benchmark_cohorts             | baseline_mean                  | numeric                  | YES         | null                                                                             |
| ref_benchmark_cohorts             | baseline_sd                    | numeric                  | YES         | null                                                                             |
| ref_benchmark_cohorts             | endpoint_mean                  | numeric                  | YES         | null                                                                             |
| ref_benchmark_cohorts             | endpoint_sd                    | numeric                  | YES         | null                                                                             |
| ref_benchmark_cohorts             | followup_weeks                 | integer                  | YES         | null                                                                             |
| ref_benchmark_cohorts             | response_rate_pct              | numeric                  | YES         | null                                                                             |
| ref_benchmark_cohorts             | remission_rate_pct             | numeric                  | YES         | null                                                                             |
| ref_benchmark_cohorts             | effect_size_hedges_g           | numeric                  | YES         | null                                                                             |
| ref_benchmark_cohorts             | adverse_event_rate_pct         | numeric                  | YES         | null                                                                             |
| ref_benchmark_cohorts             | data_freely_usable             | boolean                  | NO          | true                                                                             |
| ref_benchmark_cohorts             | license                        | text                     | YES         | null                                                                             |
| ref_benchmark_cohorts             | notes                          | text                     | YES         | null                                                                             |
| ref_benchmark_cohorts             | created_at                     | timestamp with time zone | NO          | now()                                                                            |
| ref_benchmark_trials              | id                             | uuid                     | NO          | gen_random_uuid()                                                                |
| ref_benchmark_trials              | nct_id                         | text                     | NO          | null                                                                             |
| ref_benchmark_trials              | title                          | text                     | NO          | null                                                                             |
| ref_benchmark_trials              | phase                          | text                     | YES         | null                                                                             |
| ref_benchmark_trials              | status                         | text                     | YES         | null                                                                             |
| ref_benchmark_trials              | modality                       | text                     | NO          | null                                                                             |
| ref_benchmark_trials              | conditions                     | ARRAY                    | YES         | null                                                                             |
| ref_benchmark_trials              | country                        | text                     | YES         | null                                                                             |
| ref_benchmark_trials              | enrollment_actual              | integer                  | YES         | null                                                                             |
| ref_benchmark_trials              | start_date                     | date                     | YES         | null                                                                             |
| ref_benchmark_trials              | completion_date                | date                     | YES         | null                                                                             |
| ref_benchmark_trials              | primary_outcome_measure        | text                     | YES         | null                                                                             |
| ref_benchmark_trials              | source                         | text                     | NO          | 'clinicaltrials.gov'::text                                                       |
| ref_benchmark_trials              | created_at                     | timestamp with time zone | NO          | now()                                                                            |
| ref_cancellation_reasons          | cancellation_reason_id         | integer                  | NO          | nextval('ref_cancellation_reasons_cancellation_reason_id_seq'::regclass)         |
| ref_cancellation_reasons          | reason_code                    | character varying        | NO          | null                                                                             |
| ref_cancellation_reasons          | reason_text                    | text                     | NO          | null                                                                             |
| ref_cancellation_reasons          | is_active                      | boolean                  | YES         | true                                                                             |
| ref_cancellation_reasons          | created_at                     | timestamp with time zone | YES         | now()                                                                            |
| ref_clinical_interactions         | interaction_id                 | bigint                   | NO          | nextval('ref_clinical_interactions_interaction_id_seq'::regclass)                |
| ref_clinical_interactions         | substance_name                 | text                     | NO          | null                                                                             |
| ref_clinical_interactions         | interactor_name                | text                     | NO          | null                                                                             |
| ref_clinical_interactions         | interactor_category            | text                     | YES         | null                                                                             |
| ref_clinical_interactions         | risk_level                     | integer                  | NO          | null                                                                             |
| ref_clinical_interactions         | severity_grade                 | text                     | NO          | null                                                                             |
| ref_clinical_interactions         | clinical_description           | text                     | NO          | null                                                                             |
| ref_clinical_interactions         | mechanism                      | text                     | YES         | null                                                                             |
| ref_clinical_interactions         | evidence_source                | text                     | YES         | null                                                                             |
| ref_clinical_interactions         | source_url                     | text                     | YES         | null                                                                             |
| ref_clinical_interactions         | is_verified                    | boolean                  | YES         | false                                                                            |
| ref_clinical_interactions         | created_at                     | timestamp with time zone | NO          | now()                                                                            |
| ref_clinical_observations         | observation_id                 | integer                  | NO          | nextval('ref_clinical_observations_observation_id_seq'::regclass)                |
| ref_clinical_observations         | observation_code               | character varying        | NO          | null                                                                             |
| ref_clinical_observations         | observation_text               | text                     | NO          | null                                                                             |
| ref_clinical_observations         | category                       | character varying        | NO          | null                                                                             |
| ref_clinical_observations         | is_active                      | boolean                  | YES         | true                                                                             |
| ref_clinical_observations         | created_at                     | timestamp with time zone | YES         | now()                                                                            |
| ref_clinical_observations         | sort_order                     | integer                  | NO          | 0                                                                                |
| ref_clinical_phenotypes           | clinical_phenotype_id          | bigint                   | NO          | null                                                                             |
| ref_clinical_phenotypes           | phenotype_code                 | text                     | NO          | null                                                                             |
| ref_clinical_phenotypes           | phenotype_name                 | text                     | NO          | null                                                                             |
| ref_clinical_phenotypes           | icd10_category                 | text                     | YES         | null                                                                             |
| ref_clinical_phenotypes           | is_active                      | boolean                  | NO          | true                                                                             |
| ref_clinical_phenotypes           | created_at                     | timestamp with time zone | NO          | now()                                                                            |
| ref_consent_types                 | id                             | integer                  | NO          | nextval('ref_consent_types_id_seq'::regclass)                                    |
| ref_consent_types                 | consent_code                   | character varying        | NO          | null                                                                             |
| ref_consent_types                 | label                          | character varying        | NO          | null                                                                             |
| ref_consent_types                 | is_active                      | boolean                  | NO          | true                                                                             |
| ref_contraindication_verdicts     | verdict_id                     | bigint                   | NO          | null                                                                             |
| ref_contraindication_verdicts     | verdict_code                   | text                     | NO          | null                                                                             |
| ref_contraindication_verdicts     | verdict_label                  | text                     | NO          | null                                                                             |
| ref_contraindication_verdicts     | ui_color_hex                   | text                     | YES         | '#6b7280'::text                                                                  |
| ref_contraindication_verdicts     | is_active                      | boolean                  | NO          | true                                                                             |
| ref_contraindication_verdicts     | created_at                     | timestamp with time zone | NO          | now()                                                                            |
| ref_crisis_event_types            | id                             | integer                  | NO          | nextval('ref_crisis_event_types_id_seq'::regclass)                               |
| ref_crisis_event_types            | event_code                     | character varying        | NO          | null                                                                             |
| ref_crisis_event_types            | label                          | character varying        | NO          | null                                                                             |
| ref_crisis_event_types            | severity_tier                  | smallint                 | NO          | 1                                                                                |
| ref_crisis_event_types            | is_active                      | boolean                  | NO          | true                                                                             |
| ref_crisis_event_types            | created_at                     | timestamp with time zone | YES         | now()                                                                            |
| ref_data_sources                  | data_source_id                 | bigint                   | NO          | null                                                                             |
| ref_data_sources                  | source_code                    | text                     | NO          | null                                                                             |
| ref_data_sources                  | source_label                   | text                     | NO          | null                                                                             |
| ref_data_sources                  | is_active                      | boolean                  | NO          | true                                                                             |
| ref_data_sources                  | created_at                     | timestamp with time zone | NO          | now()                                                                            |
| ref_ekg_rhythms                   | id                             | integer                  | NO          | nextval('ref_ekg_rhythms_id_seq'::regclass)                                      |
| ref_ekg_rhythms                   | code                           | character varying        | NO          | null                                                                             |
| ref_ekg_rhythms                   | label                          | character varying        | NO          | null                                                                             |
| ref_ekg_rhythms                   | severity_tier                  | character varying        | NO          | 'monitor'::character varying                                                     |
| ref_ekg_rhythms                   | is_active                      | boolean                  | NO          | true                                                                             |
| ref_ekg_rhythms                   | valid_from                     | date                     | NO          | CURRENT_DATE                                                                     |
| ref_ekg_rhythms                   | valid_to                       | date                     | YES         | null                                                                             |
| ref_flow_event_types              | id                             | bigint                   | NO          | nextval('ref_flow_event_types_id_seq'::regclass)                                 |
| ref_flow_event_types              | event_type_code                | text                     | NO          | null                                                                             |
| ref_flow_event_types              | event_type_label               | text                     | NO          | null                                                                             |
| ref_flow_event_types              | event_category                 | text                     | NO          | null                                                                             |
| ref_flow_event_types              | stage_order                    | integer                  | YES         | null                                                                             |
| ref_flow_event_types              | is_active                      | boolean                  | YES         | true                                                                             |
| ref_flow_event_types              | description                    | text                     | YES         | null                                                                             |
| ref_flow_event_types              | created_at                     | timestamp with time zone | YES         | now()                                                                            |
| ref_homework_types                | homework_type_id               | integer                  | NO          | nextval('ref_homework_types_homework_type_id_seq'::regclass)                     |
| ref_homework_types                | homework_code                  | character varying        | NO          | null                                                                             |
| ref_homework_types                | homework_label                 | character varying        | NO          | null                                                                             |
| ref_homework_types                | is_active                      | boolean                  | YES         | true                                                                             |
| ref_indications                   | indication_id                  | bigint                   | NO          | nextval('ref_indications_indication_id_seq'::regclass)                           |
| ref_indications                   | indication_name                | text                     | NO          | null                                                                             |
| ref_indications                   | snomed_code                    | text                     | YES         | null                                                                             |
| ref_indications                   | icd10_code                     | text                     | YES         | null                                                                             |
| ref_indications                   | indication_category            | text                     | YES         | null                                                                             |
| ref_indications                   | is_active                      | boolean                  | YES         | true                                                                             |
| ref_indications                   | created_at                     | timestamp with time zone | YES         | now()                                                                            |
| ref_intervention_types            | intervention_type_id           | integer                  | NO          | nextval('ref_intervention_types_intervention_type_id_seq'::regclass)             |
| ref_intervention_types            | intervention_code              | character varying        | NO          | null                                                                             |
| ref_intervention_types            | intervention_name              | character varying        | NO          | null                                                                             |
| ref_intervention_types            | intervention_category          | character varying        | YES         | null                                                                             |
| ref_intervention_types            | description                    | text                     | YES         | null                                                                             |
| ref_intervention_types            | requires_documentation         | boolean                  | YES         | true                                                                             |
| ref_intervention_types            | is_active                      | boolean                  | YES         | true                                                                             |
| ref_intervention_types            | created_at                     | timestamp with time zone | YES         | now()                                                                            |
| ref_justification_codes           | justification_id               | bigint                   | NO          | null                                                                             |
| ref_justification_codes           | reason_text                    | text                     | YES         | null                                                                             |
| ref_knowledge_graph               | rule_id                        | text                     | NO          | null                                                                             |
| ref_knowledge_graph               | substance_a_id                 | text                     | YES         | null                                                                             |
| ref_knowledge_graph               | substance_b_id                 | text                     | YES         | null                                                                             |
| ref_knowledge_graph               | condition_code                 | text                     | YES         | null                                                                             |
| ref_knowledge_graph               | risk_level                     | text                     | YES         | null                                                                             |
| ref_knowledge_graph               | alert_message                  | text                     | YES         | null                                                                             |
| ref_meddra_codes                  | meddra_code_id                 | integer                  | NO          | nextval('ref_meddra_codes_meddra_code_id_seq'::regclass)                         |
| ref_meddra_codes                  | meddra_code                    | character varying        | NO          | null                                                                             |
| ref_meddra_codes                  | preferred_term                 | character varying        | NO          | null                                                                             |
| ref_meddra_codes                  | system_organ_class             | character varying        | YES         | null                                                                             |
| ref_meddra_codes                  | severity_level                 | character varying        | YES         | null                                                                             |
| ref_meddra_codes                  | description                    | text                     | YES         | null                                                                             |
| ref_meddra_codes                  | is_active                      | boolean                  | YES         | true                                                                             |
| ref_meddra_codes                  | created_at                     | timestamp with time zone | YES         | now()                                                                            |
| ref_medications                   | medication_id                  | bigint                   | NO          | nextval('ref_medications_medication_id_seq'::regclass)                           |
| ref_medications                   | medication_name                | text                     | NO          | null                                                                             |
| ref_medications                   | medication_category            | character varying        | YES         | null                                                                             |
| ref_medications                   | is_active                      | boolean                  | YES         | true                                                                             |
| ref_medications                   | rxnorm_cui                     | character varying        | YES         | null                                                                             |
| ref_medications                   | created_at                     | timestamp with time zone | NO          | now()                                                                            |
| ref_population_baselines          | id                             | uuid                     | NO          | gen_random_uuid()                                                                |
| ref_population_baselines          | source                         | text                     | NO          | null                                                                             |
| ref_population_baselines          | year                           | integer                  | NO          | null                                                                             |
| ref_population_baselines          | region                         | text                     | NO          | null                                                                             |
| ref_population_baselines          | condition                      | text                     | YES         | null                                                                             |
| ref_population_baselines          | substance                      | text                     | YES         | null                                                                             |
| ref_population_baselines          | demographic_group              | text                     | YES         | null                                                                             |
| ref_population_baselines          | n_episodes                     | integer                  | YES         | null                                                                             |
| ref_population_baselines          | avg_age                        | numeric                  | YES         | null                                                                             |
| ref_population_baselines          | pct_female                     | numeric                  | YES         | null                                                                             |
| ref_population_baselines          | avg_prior_treatments           | numeric                  | YES         | null                                                                             |
| ref_population_baselines          | avg_los_days                   | numeric                  | YES         | null                                                                             |
| ref_population_baselines          | pct_completed_treatment        | numeric                  | YES         | null                                                                             |
| ref_population_baselines          | created_at                     | timestamp with time zone | NO          | now()                                                                            |
| ref_practitioner_types            | practitioner_type_id           | bigint                   | NO          | null                                                                             |
| ref_practitioner_types            | type_code                      | text                     | NO          | null                                                                             |
| ref_practitioner_types            | type_label                     | text                     | NO          | null                                                                             |
| ref_practitioner_types            | requires_license               | boolean                  | NO          | true                                                                             |
| ref_practitioner_types            | is_active                      | boolean                  | NO          | true                                                                             |
| ref_practitioner_types            | created_at                     | timestamp with time zone | NO          | now()                                                                            |
| ref_practitioners                 | practitioner_id                | bigint                   | NO          | null                                                                             |
| ref_practitioners                 | display_name                   | text                     | NO          | null                                                                             |
| ref_practitioners                 | role                           | text                     | NO          | null                                                                             |
| ref_practitioners                 | location_city                  | text                     | NO          | null                                                                             |
| ref_practitioners                 | location_country               | text                     | NO          | 'United States'::text                                                            |
| ref_practitioners                 | license_type                   | text                     | YES         | null                                                                             |
| ref_practitioners                 | modalities                     | ARRAY                    | YES         | null                                                                             |
| ref_practitioners                 | accepting_clients              | boolean                  | NO          | true                                                                             |
| ref_practitioners                 | verified                       | boolean                  | NO          | false                                                                            |
| ref_practitioners                 | verification_level             | text                     | NO          | 'L1'::text                                                                       |
| ref_practitioners                 | profile_url                    | text                     | YES         | null                                                                             |
| ref_practitioners                 | image_url                      | text                     | YES         | null                                                                             |
| ref_practitioners                 | is_active                      | boolean                  | NO          | true                                                                             |
| ref_practitioners                 | sort_order                     | integer                  | NO          | 0                                                                                |
| ref_practitioners                 | created_at                     | timestamp with time zone | NO          | now()                                                                            |
| ref_primary_adverse               | primary_adverse_id             | bigint                   | NO          | null                                                                             |
| ref_primary_adverse               | primary_adverse                | text                     | YES         | null                                                                             |
| ref_psychospiritual_history_types | psychospiritual_history_id     | bigint                   | NO          | null                                                                             |
| ref_psychospiritual_history_types | history_code                   | text                     | NO          | null                                                                             |
| ref_psychospiritual_history_types | history_label                  | text                     | NO          | null                                                                             |
| ref_psychospiritual_history_types | sort_order                     | integer                  | YES         | 999                                                                              |
| ref_psychospiritual_history_types | is_active                      | boolean                  | NO          | true                                                                             |
| ref_psychospiritual_history_types | created_at                     | timestamp with time zone | NO          | now()                                                                            |
| ref_rejection_reasons             | rejection_reason_id            | bigint                   | NO          | null                                                                             |
| ref_rejection_reasons             | reason_code                    | text                     | NO          | null                                                                             |
| ref_rejection_reasons             | reason_label                   | text                     | NO          | null                                                                             |
| ref_rejection_reasons             | is_active                      | boolean                  | NO          | true                                                                             |
| ref_rejection_reasons             | created_at                     | timestamp with time zone | NO          | now()                                                                            |
| ref_resolution_status             | resolution_status_id           | bigint                   | NO          | nextval('ref_resolution_status_resolution_status_id_seq'::regclass)              |
| ref_resolution_status             | status_name                    | text                     | NO          | null                                                                             |
| ref_resolution_status             | description                    | text                     | YES         | null                                                                             |
| ref_resolution_status             | is_active                      | boolean                  | YES         | true                                                                             |
| ref_resolution_status             | created_at                     | timestamp with time zone | YES         | now()                                                                            |
| ref_routes                        | route_id                       | bigint                   | NO          | nextval('ref_routes_route_id_seq'::regclass)                                     |
| ref_routes                        | route_name                     | text                     | NO          | null                                                                             |
| ref_routes                        | route_code                     | text                     | YES         | null                                                                             |
| ref_routes                        | route_label                    | text                     | YES         | null                                                                             |
| ref_routes                        | is_active                      | boolean                  | YES         | true                                                                             |
| ref_routes                        | created_at                     | timestamp with time zone | YES         | now()                                                                            |
| ref_safety_events                 | safety_event_id                | bigint                   | NO          | nextval('ref_safety_events_safety_event_id_seq'::regclass)                       |
| ref_safety_events                 | event_name                     | text                     | NO          | null                                                                             |
| ref_safety_events                 | event_code                     | text                     | YES         | null                                                                             |
| ref_safety_events                 | event_category                 | text                     | YES         | null                                                                             |
| ref_safety_events                 | is_active                      | boolean                  | YES         | true                                                                             |
| ref_safety_events                 | created_at                     | timestamp with time zone | YES         | now()                                                                            |
| ref_session_focus_areas           | focus_area_id                  | integer                  | NO          | nextval('ref_session_focus_areas_focus_area_id_seq'::regclass)                   |
| ref_session_focus_areas           | focus_code                     | character varying        | NO          | null                                                                             |
| ref_session_focus_areas           | focus_label                    | character varying        | NO          | null                                                                             |
| ref_session_focus_areas           | is_active                      | boolean                  | YES         | true                                                                             |
| ref_session_types                 | id                             | integer                  | NO          | nextval('ref_session_types_id_seq'::regclass)                                    |
| ref_session_types                 | session_code                   | character varying        | NO          | null                                                                             |
| ref_session_types                 | session_label                  | character varying        | NO          | null                                                                             |
| ref_session_types                 | is_active                      | boolean                  | NO          | true                                                                             |
| ref_session_types                 | created_at                     | timestamp with time zone | YES         | now()                                                                            |
| ref_severity_grade                | severity_grade_id              | bigint                   | NO          | nextval('ref_severity_grade_severity_grade_id_seq'::regclass)                    |
| ref_severity_grade                | grade_value                    | integer                  | NO          | null                                                                             |
| ref_severity_grade                | grade_label                    | text                     | NO          | null                                                                             |
| ref_severity_grade                | description                    | text                     | YES         | null                                                                             |
| ref_severity_grade                | is_active                      | boolean                  | YES         | true                                                                             |
| ref_severity_grade                | created_at                     | timestamp with time zone | YES         | now()                                                                            |
| ref_sex                           | sex_id                         | bigint                   | NO          | null                                                                             |
| ref_sex                           | sex_code                       | text                     | NO          | null                                                                             |
| ref_sex                           | sex_label                      | text                     | NO          | null                                                                             |
| ref_sex                           | sort_order                     | integer                  | NO          | 999                                                                              |
| ref_sex                           | is_active                      | boolean                  | NO          | true                                                                             |
| ref_sex                           | created_at                     | timestamp with time zone | NO          | now()                                                                            |
| ref_smoking_status                | smoking_status_id              | bigint                   | NO          | nextval('ref_smoking_status_smoking_status_id_seq'::regclass)                    |
| ref_smoking_status                | status_name                    | text                     | NO          | null                                                                             |
| ref_smoking_status                | status_code                    | text                     | YES         | null                                                                             |
| ref_smoking_status                | is_active                      | boolean                  | YES         | true                                                                             |
| ref_smoking_status                | created_at                     | timestamp with time zone | YES         | now()                                                                            |
| ref_substances                    | substance_id                   | bigint                   | NO          | nextval('ref_substances_substance_id_seq'::regclass)                             |
| ref_substances                    | substance_name                 | text                     | NO          | null                                                                             |
| ref_substances                    | rxnorm_cui                     | bigint                   | YES         | null                                                                             |
| ref_substances                    | substance_class                | text                     | YES         | null                                                                             |
| ref_substances                    | is_active                      | boolean                  | YES         | true                                                                             |
| ref_substances                    | created_at                     | timestamp with time zone | YES         | now()                                                                            |
| ref_substances                    | receptor_5ht2a_ki              | numeric                  | YES         | null                                                                             |
| ref_substances                    | receptor_5ht1a_ki              | numeric                  | YES         | null                                                                             |
| ref_substances                    | receptor_5ht2c_ki              | numeric                  | YES         | null                                                                             |
| ref_substances                    | receptor_d2_ki                 | numeric                  | YES         | null                                                                             |
| ref_substances                    | receptor_sert_ki               | numeric                  | YES         | null                                                                             |
| ref_substances                    | receptor_nmda_ki               | numeric                  | YES         | null                                                                             |
| ref_substances                    | primary_mechanism              | text                     | YES         | null                                                                             |
| ref_support_modality              | modality_id                    | bigint                   | NO          | nextval('ref_support_modality_modality_id_seq'::regclass)                        |
| ref_support_modality              | modality_name                  | text                     | NO          | null                                                                             |
| ref_support_modality              | modality_code                  | text                     | YES         | null                                                                             |
| ref_support_modality              | description                    | text                     | YES         | null                                                                             |
| ref_support_modality              | is_active                      | boolean                  | YES         | true                                                                             |
| ref_support_modality              | created_at                     | timestamp with time zone | YES         | now()                                                                            |
| ref_system_action_types           | id                             | integer                  | NO          | nextval('ref_system_action_types_id_seq'::regclass)                              |
| ref_system_action_types           | action_code                    | character varying        | NO          | null                                                                             |
| ref_system_action_types           | label                          | character varying        | NO          | null                                                                             |
| ref_system_action_types           | is_active                      | boolean                  | NO          | true                                                                             |
| ref_therapist_observations        | observation_type_id            | integer                  | NO          | nextval('ref_therapist_observations_observation_type_id_seq'::regclass)          |
| ref_therapist_observations        | observation_code               | character varying        | NO          | null                                                                             |
| ref_therapist_observations        | observation_label              | character varying        | NO          | null                                                                             |
| ref_therapist_observations        | is_active                      | boolean                  | YES         | true                                                                             |
| ref_user_roles                    | id                             | integer                  | NO          | nextval('ref_user_roles_id_seq'::regclass)                                       |
| ref_user_roles                    | role_name                      | text                     | NO          | null                                                                             |
| ref_user_roles                    | created_at                     | timestamp with time zone | YES         | now()                                                                            |
| ref_weight_ranges                 | id                             | bigint                   | NO          | nextval('ref_weight_ranges_id_seq'::regclass)                                    |
| ref_weight_ranges                 | range_label                    | text                     | NO          | null                                                                             |
| ref_weight_ranges                 | kg_low                         | numeric                  | NO          | null                                                                             |
| ref_weight_ranges                 | kg_high                        | numeric                  | NO          | null                                                                             |
| ref_weight_ranges                 | sort_order                     | integer                  | NO          | null                                                                             |
| ref_weight_ranges                 | is_active                      | boolean                  | NO          | true                                                                             |
| ref_weight_ranges                 | created_at                     | timestamp with time zone | NO          | now()                                                                            |
| ref_weight_ranges                 | updated_at                     | timestamp with time zone | NO          | now()                                                                            |