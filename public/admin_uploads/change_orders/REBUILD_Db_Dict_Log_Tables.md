# PPN Database — Final State: `log_` Tables
*Post-migration · **v4 master spec** · March 2026 · Derived from `implementation_plan.md`*

**Column flags:** PK=Primary Key · NK=Nullable · UQ=Unique · CHK=Check Constraint

> ~~Strikethrough columns~~ are DROPPED by this migration. 🆕 marks new columns/tables.
> Array fields labelled **[INTENTIONAL]** or **[TEMP]** per Decision D4.

---

## IDENTITY & INFRASTRUCTURE

### `log_sites` 🟢 KEEP
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `site_id` | Site UUID | uuid | gen_random_uuid() | — | Y | N | Y | — |
| `site_name` | Clinic display name | text | — | — | N | N | N | — |
| `region` | Geographic region | text | — | — | N | Y | N | — |
| `site_type` | Clinic type descriptor | text | — | — | N | Y | N | — |
| `is_active` | Soft-delete flag | boolean | true | — | N | Y | N | — |
| `created_at` | Creation timestamp | timestamptz | now() | — | N | N | N | — |

**RLS:** All authenticated users can read. Admin-only write.

---

### `log_user_sites` 🟢 KEEP
*Maps auth user → site. Composite PK: `(user_id, site_id)`.*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `user_id` | Auth user UUID | uuid | — | auth.users | Y | N | N | — |
| `site_id` | Site | uuid | — | log_sites | Y | N | N | — |
| `role` | User role at site | text | — | — | N | N | N | — |
| `is_active` | Active link | boolean | true | — | N | Y | N | — |
| `created_at` | Creation timestamp | timestamptz | now() | — | N | Y | N | — |

**RLS:** Users read only their own row.

---

### `log_user_profiles` 🟢 KEEP
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `id` | Row UUID | uuid | gen_random_uuid() | — | Y | N | Y | — |
| `user_id` | Auth user UUID | uuid | — | auth.users | N | N | Y | — |
| `user_first_name` | First name | text | — | — | N | Y | N | — |
| `user_last_name` | Last name | text | — | — | N | Y | N | — |
| `role_id` | Role FK | integer | 3 | ref_user_roles | N | Y | N | — |
| `created_at` | Creation timestamp | timestamptz | now() | — | N | Y | N | — |

**RLS:** User reads/writes only their own row.

---

### `log_patient_site_links` 🟢 KEEP
*Canonical patient identity. Source of `patient_uuid`. UNIQUE `(site_id, patient_link_code)`.*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `id` | Surrogate PK | bigint | nextval(seq) | — | Y | N | N | — |
| `patient_uuid` | Canonical patient UUID | uuid | — | — | N | N | Y | — |
| `patient_link_code` | Practitioner reference (PT-XXXXXXXXXX) | text | — | — | N | N | N | — |
| `site_id` | Site this patient belongs to | uuid | — | log_sites | N | N | N | — |
| `transferred_from_site_id` | Prior site if transferred | uuid | — | log_sites | N | Y | N | — |
| `transfer_date` | Transfer timestamp | timestamptz | — | — | N | Y | N | — |
| `is_active` | Active patient flag | boolean | true | — | N | Y | N | — |
| `created_at` | Creation timestamp | timestamptz | now() | — | N | N | N | — |
| `updated_at` | Last update timestamp | timestamptz | now() | — | N | N | N | — |

**RLS:** Site members read/write their own site rows only.

---

## PHASE 0 — PATIENT PROFILE (NEW)

### `log_patient_profiles` 🔵 CREATE
*Demographic snapshot at intake. Immutable — amendments add new rows.*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `id` | Surrogate PK | bigint | identity | — | Y | N | N | — |
| `patient_uuid` | Canonical patient ID | uuid | — | log_patient_site_links(patient_uuid) | N | N | N | — |
| `site_id` | Originating site | uuid | — | log_sites | N | N | N | — |
| `sex_id` | Biological sex | integer | — | ref_sex | N | Y | N | — |
| `age_at_intake` | Age at first session | integer | — | — | N | Y | N | BETWEEN 18 AND 120 |
| `weight_range_id` | Weight bracket | integer | — | ref_weight_ranges | N | Y | N | — |
| `smoking_status_id` | Smoking/tobacco status | integer | — | ref_smoking_status | N | Y | N | — |
| `protocol_archetype_id` | Treatment archetype | integer | — | ref_protocol_archetypes | N | Y | N | — |
| `created_at` | Creation timestamp | timestamptz | now() | — | N | N | N | — |
| `created_by` | Practitioner user_id | uuid | — | auth.users | N | Y | N | — |

**RLS:** Site members read/write. Linked via `patient_uuid` → `log_patient_site_links`.

---

### `log_patient_indications` 🔵 CREATE
*Many-to-many: patient × diagnoses. Replaces single FK on `log_clinical_records`.*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `id` | Surrogate PK | bigint | identity | — | Y | N | N | — |
| `patient_uuid` | Canonical patient ID | uuid | — | log_patient_site_links(patient_uuid) | N | N | N | — |
| `indication_id` | Diagnosis/condition | bigint | — | ref_indications | N | N | N | — |
| `is_primary` | Primary vs. comorbid | boolean | false | — | N | N | N | — |
| `created_at` | Creation timestamp | timestamptz | now() | — | N | N | N | — |
| `created_by` | Practitioner user_id | uuid | — | auth.users | N | Y | N | — |

**RLS:** Site members via `patient_uuid` chain.

---

### `log_patient_psychospiritual_history` 🔵 CREATE
*Many-to-many: patient × psychospiritual history types.*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `id` | Surrogate PK | bigint | identity | — | Y | N | N | — |
| `patient_uuid` | Canonical patient ID | uuid | — | log_patient_site_links(patient_uuid) | N | N | N | — |
| `psychospiritual_history_type_id` | History type selected | integer | — | ref_psychospiritual_history_types | N | N | N | — |
| `created_at` | Creation timestamp | timestamptz | now() | — | N | N | N | — |

**RLS:** Site members via `patient_uuid` chain.

---

## PHASE 1 — PREPARATION

### `log_baseline_assessments` 🟢 KEEP
*Psychometric intake scores (PHQ-9, GAD-7, ACE, PCL-5, Expectancy).*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `baseline_assessment_id` | Surrogate PK | integer | nextval(seq) | — | Y | N | N | — |
| `patient_uuid` | Canonical patient ID | uuid | — | log_patient_site_links(patient_uuid) | N | Y | N | — |
| `site_id` | Site context | uuid | — | log_sites | N | Y | N | — |
| `assessment_date` | When screening was completed | timestamptz | now() | — | N | N | N | — |
| `phq9_score` | PHQ-9 Depression total | integer | — | — | N | Y | N | BETWEEN 0 AND 27 |
| `gad7_score` | GAD-7 Anxiety total | integer | — | — | N | Y | N | BETWEEN 0 AND 21 |
| `ace_score` | ACE Childhood Trauma total | integer | — | — | N | Y | N | BETWEEN 0 AND 10 |
| `pcl5_score` | PCL-5 PTSD total | integer | — | — | N | Y | N | BETWEEN 0 AND 80 |
| `expectancy_scale` | Treatment expectancy (0–10) | integer | — | — | N | Y | N | BETWEEN 0 AND 10 |
| `resting_hrv` | Baseline heart rate variability | numeric | — | — | N | Y | N | — |
| `resting_bp_systolic` | Baseline systolic BP | integer | — | — | N | Y | N | — |
| `resting_bp_diastolic` | Baseline diastolic BP | integer | — | — | N | Y | N | — |
| `completed_by_user_id` | Practitioner who completed | uuid | — | auth.users | N | Y | N | — |
| `created_by` | Row creator | uuid | — | auth.users | N | Y | N | — |
| `created_at` | Creation timestamp | timestamptz | now() | — | N | Y | N | — |
| `updated_at` | Last update | timestamptz | now() | — | N | Y | N | — |
| ~~`psychospiritual_history_id`~~ | *DROPPED → junction table* | — | — | — | — | — | — | — |

**RLS:** Site members read/write their site's rows.

---

### `log_phase1_consent` 🔵 CREATE
*Replaces `log_consent`. Multi-type consent per session.*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `id` | Surrogate PK | bigint | identity | — | Y | N | N | — |
| `patient_uuid` | Canonical patient ID | uuid | — | log_patient_site_links(patient_uuid) | N | N | N | — |
| `session_id` | Associated dosing session | uuid | — | log_clinical_records | N | Y | N | — |
| `site_id` | Site context | uuid | — | log_sites | N | N | N | — |
| `consent_type_ids` | Consent types confirmed **[INTENTIONAL]** | integer[] | '{}' | ref_consent_types | N | N | N | — |
| `consented_at` | Consent timestamp | timestamptz | now() | — | N | N | N | — |
| `consented_by` | Verifying practitioner | uuid | — | auth.users | N | Y | N | — |

**RLS:** Site members read/write.

---

### `log_phase1_safety_screen` 🔵 CREATE
*Pre-session contraindication screening. One row per session.*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `id` | Surrogate PK | bigint | identity | — | Y | N | N | — |
| `patient_uuid` | Canonical patient ID | uuid | — | log_patient_site_links(patient_uuid) | N | N | N | — |
| `session_id` | Associated dosing session | uuid | — | log_clinical_records | N | Y | N | — |
| `site_id` | Site context | uuid | — | log_sites | N | N | N | — |
| `contraindication_verdict_id` | Go/no-go verdict | integer | — | ref_contraindication_verdicts | N | Y | N | — |
| `ekg_rhythm_id` | EKG finding | integer | — | ref_ekg_rhythms | N | Y | N | — |
| `concomitant_med_ids` | Medications at screening **[TEMP — consolidate to clinical_records in next sprint]** | integer[] | '{}' | ref_medications | N | Y | N | — |
| `screened_at` | Screening timestamp | timestamptz | now() | — | N | N | N | — |
| `screened_by` | Practitioner user_id | uuid | — | auth.users | N | Y | N | — |

**RLS:** Site members read/write.

---

### `log_phase1_set_and_setting` 🔵 CREATE
*Intention themes, mindset, session setting, treatment expectancy.*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `id` | Surrogate PK | bigint | identity | — | Y | N | N | — |
| `patient_uuid` | Canonical patient ID | uuid | — | log_patient_site_links(patient_uuid) | N | N | N | — |
| `session_id` | Associated dosing session | uuid | — | log_clinical_records | N | Y | N | — |
| `site_id` | Site context | uuid | — | log_sites | N | N | N | — |
| `intention_theme_ids` | Selected intentions **[INTENTIONAL]** | integer[] | '{}' | ref_intention_themes | N | Y | N | — |
| `mindset_type_id` | Pre-session mindset | integer | — | ref_mindset_types | N | Y | N | — |
| `session_setting_id` | Physical/contextual setting | integer | — | ref_session_settings | N | Y | N | — |
| `treatment_expectancy` | Patient expectancy (0–10) | integer | — | — | N | Y | N | BETWEEN 0 AND 10 |
| `recorded_at` | Entry timestamp | timestamptz | now() | — | N | N | N | — |

**RLS:** Site members read/write.

---

## PHASE 2 — DOSING SESSION

### `log_clinical_records` 🟡 MODIFY
*Primary session record. `id` is the anchor FK for all Phase 2 child tables.*
**ADD:** `session_setting_id`, `mindset_type_id`, `intention_theme_ids` · **DROP:** `indication_id`

| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `id` | Session UUID — FK anchor | uuid | gen_random_uuid() | — | Y | N | Y | — |
| `patient_uuid` | Canonical patient ID | uuid | — | log_patient_site_links(patient_uuid) | N | N | N | — |
| `patient_link_code_hash` | Practitioner patient reference | text | — | — | N | Y | N | — |
| `site_id` | Site context | uuid | — | log_sites | N | Y | N | — |
| `practitioner_id` | Lead practitioner | uuid | — | auth.users | N | N | N | — |
| `guide_user_id` | Co-guide/assistant | uuid | — | auth.users | N | Y | N | — |
| `created_by` | Row creator | uuid | — | auth.users | N | Y | N | — |
| `session_date` | Date of session | date | — | — | N | Y | N | — |
| `session_type_id` | Session type | integer | — | ref_session_types | N | Y | N | — |
| `session_setting_id` | 🆕 Physical/contextual setting | integer | — | ref_session_settings | N | Y | N | — |
| `mindset_type_id` | 🆕 Pre-session mindset | integer | — | ref_mindset_types | N | Y | N | — |
| `intention_theme_ids` | 🆕 Intention themes **[INTENTIONAL]** | integer[] | '{}' | ref_intention_themes | N | Y | N | — |
| `substance_id` | Substance administered | integer | — | ref_substances | N | Y | N | — |
| `dosage_amount` | Protocol dose amount (D3: session-level aggregate) | numeric | — | — | N | Y | N | — |
| `route_id` | Route of administration | bigint | — | ref_routes | N | Y | N | — |
| `protocol_id` | Protocol FK (integer) | integer | — | — | N | Y | N | — |
| `protocol_template_id` | Protocol UUID reference | uuid | — | log_protocols | N | Y | N | — |
| `weight_range_id` | Patient weight at this session | bigint | — | ref_weight_ranges | N | Y | N | — |
| `patient_age_years` | Patient age snapshot | integer | — | — | N | Y | N | — |
| `patient_sex_id` | Patient sex snapshot | bigint | — | ref_sex | N | Y | N | — |
| `patient_smoking_status_id` | Smoking status snapshot | bigint | — | ref_smoking_status | N | Y | N | — |
| `concomitant_med_ids` | Current medications **[INTENTIONAL]** | bigint[] | — | ref_medications | N | Y | N | — |
| `support_modality_ids` | Support modalities used **[INTENTIONAL]** | bigint[] | — | ref_support_modality | N | Y | N | — |
| `session_number` | Sequential session count | integer | — | — | N | Y | N | — |
| `baseline_phq9_score` | PHQ-9 at baseline (denorm.) | integer | — | — | N | Y | N | — |
| `psychological_difficulty_score` | Difficulty score (0–10) | integer | — | — | N | Y | N | BETWEEN 0 AND 10 |
| `outcome_score` | Overall outcome score | integer | — | — | N | Y | N | — |
| `severity_rating` | Session severity | integer | 0 | — | N | Y | N | — |
| `contraindication_verdict_id` | CIE result | bigint | — | ref_contraindication_verdicts | N | Y | N | — |
| `contraindication_assessed_at` | CIE run timestamp | timestamptz | — | — | N | Y | N | — |
| `severity_grade_id` | CTCAE grade | bigint | — | ref_severity_grade | N | Y | N | — |
| `resolution_status_id` | Session resolution | bigint | — | ref_resolution_status | N | Y | N | — |
| `safety_event_id` | Primary safety event FK | bigint | — | — | N | Y | N | — |
| `meq30_score` | MEQ-30 total (denorm. for query) | integer | — | — | N | Y | N | BETWEEN 0 AND 150 |
| `meq30_completed_at` | MEQ-30 timestamp | timestamptz | — | — | N | Y | N | — |
| `ceq_score` | CEQ score | integer | — | — | N | Y | N | — |
| `ceq_completed_at` | CEQ timestamp | timestamptz | — | — | N | Y | N | — |
| `edi_score` | EDI score | integer | — | — | N | Y | N | — |
| `edi_completed_at` | EDI timestamp | timestamptz | — | — | N | Y | N | — |
| `dose_administered_at` | First dose timestamp | timestamptz | — | — | N | Y | N | — |
| `onset_reported_at` | Onset timestamp | timestamptz | — | — | N | Y | N | — |
| `peak_intensity_at` | Peak timestamp | timestamptz | — | — | N | Y | N | — |
| `session_started_at` | Session start | timestamptz | — | — | N | Y | N | — |
| `session_ended_at` | Session end | timestamptz | — | — | N | Y | N | — |
| `is_submitted` | Final submission flag | boolean | false | — | N | Y | N | — |
| `submitted_at` | Submission timestamp | timestamptz | — | — | N | Y | N | — |
| `justification_code_id` | Clinical justification | bigint | — | ref_justification_codes | N | Y | N | — |
| `assessment_scale_id` | Primary outcome scale | integer | — | ref_assessment_scales | N | Y | N | — |
| `clinical_phenotype_id` | Clinical phenotype | bigint | — | ref_clinical_phenotypes | N | Y | N | — |
| `created_at` | Creation timestamp | timestamptz | utc now() | — | N | N | N | — |
| ~~`indication_id`~~ | *DROPPED → `log_patient_indications`* | — | — | — | — | — | — | — |

**RLS:** Site members read/write their site's rows.

---

### `log_dose_events` 🟡 MODIFY
*One row per dose (initial + boosters).* **ADD:** `patient_uuid`
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `id` | Surrogate PK | bigint | nextval(seq) | — | Y | N | N | — |
| `session_id` | Parent session | uuid | — | log_clinical_records | N | N | N | — |
| `patient_uuid` | 🆕 Canonical patient ID (analytics) | uuid | — | log_patient_site_links(patient_uuid) | N | Y | N | — |
| `patient_id` | Legacy string reference | varchar | — | — | N | N | N | — |
| `substance_id` | Substance administered | bigint | — | ref_substances | N | N | N | — |
| `substance_type` | Salt form (e.g. HCl) | varchar | 'HCl' | — | N | N | N | — |
| `dose_mg` | Dose in mg | numeric | — | — | N | N | N | — |
| `weight_kg` | Patient weight at this dose | numeric | — | — | N | N | N | — |
| `dose_mg_per_kg` | Weight-adjusted dose | numeric | — | — | N | Y | N | — |
| `cumulative_mg` | Running total mg | numeric | — | — | N | Y | N | — |
| `cumulative_mg_per_kg` | Running weight-adjusted total | numeric | — | — | N | Y | N | — |
| `event_type` | 'initial' or 'booster' | varchar | 'booster' | — | N | N | N | — |
| `administered_at` | Administration timestamp | timestamptz | now() | — | N | N | N | — |
| `created_by` | Practitioner user_id | uuid | — | auth.users | N | Y | N | — |
| `created_at` | Creation timestamp | timestamptz | now() | — | N | N | N | — |

---

### `log_session_vitals` 🟡 MODIFY
*Periodic vitals during session.* **ADD:** `consciousness_level_id` · **DROP:** `level_of_consciousness`
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `session_vital_id` | Surrogate PK | integer | nextval(seq) | — | Y | N | N | — |
| `session_id` | Parent session | uuid | — | log_clinical_records | N | Y | N | — |
| `recorded_at` | When vitals taken | timestamptz | — | — | N | N | N | — |
| `heart_rate` | Heart rate (bpm) | integer | — | — | N | Y | N | — |
| `hrv` | Heart rate variability (ms) | numeric | — | — | N | Y | N | — |
| `bp_systolic` | Systolic BP (mmHg) | integer | — | — | N | Y | N | — |
| `bp_diastolic` | Diastolic BP (mmHg) | integer | — | — | N | Y | N | — |
| `oxygen_saturation` | SpO2 % | integer | — | — | N | Y | N | BETWEEN 0 AND 100 |
| `respiratory_rate` | Breaths per minute | integer | — | — | N | Y | N | — |
| `temperature` | Temperature (°F) | numeric | — | — | N | Y | N | — |
| `diaphoresis_score` | Sweating severity (0–4) | integer | — | — | N | Y | N | BETWEEN 0 AND 4 |
| `consciousness_level_id` | 🆕 Level of consciousness FK | integer | — | ref_consciousness_levels | N | Y | N | — |
| `device_id` | Wearable/device ID | varchar | — | — | N | Y | N | — |
| `data_source_id` | Manual vs. device source | bigint | — | ref_data_sources | N | Y | N | — |
| `created_by` | Row creator | uuid | — | auth.users | N | Y | N | — |
| `created_at` | Creation timestamp | timestamptz | now() | — | N | Y | N | — |
| ~~`level_of_consciousness`~~ | *DROPPED — was free-text* | — | — | — | — | — | — | — |

---

### `log_session_timeline_events` 🟢 KEEP
*Granular **in-session ledger only**. `event_type_id` → FK to `ref_flow_event_types`. Not dual-purpose — workflow milestones go in `log_patient_flow_events`. No schema changes needed. (Decision D1, D5)*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `timeline_event_id` | Event UUID | uuid | gen_random_uuid() | — | Y | N | Y | — |
| `session_id` | Parent session | uuid | — | log_clinical_records | N | Y | N | — |
| `event_timestamp` | When event occurred | timestamptz | — | — | N | N | N | — |
| `event_type_id` | Event type FK | integer | — | ref_flow_event_types | N | Y | N | — |
| `performed_by` | Practitioner who recorded | uuid | — | auth.users | N | Y | N | — |
| `metadata` | Supplemental text (non-queryable) | jsonb | — | — | N | Y | N | — |
| `created_by` | Row creator | uuid | — | auth.users | N | Y | N | — |
| `created_at` | Creation timestamp | timestamptz | now() | — | N | Y | N | — |

---

### `log_safety_events` 🟢 KEEP
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `ae_id` | Adverse event text ID | text | — | — | Y | N | Y | — |
| `session_id` | Parent session | uuid | — | log_clinical_records | N | Y | N | — |
| `site_id` | Site context | uuid | — | log_sites | N | Y | N | — |
| `safety_event_type_id` | Event type FK | bigint | — | ref_safety_events | N | Y | N | — |
| `severity_grade_id_fk` | CTCAE severity grade | bigint | — | ref_severity_grade | N | Y | N | — |
| `resolution_status_id_fk` | Resolution status | bigint | — | ref_resolution_status | N | Y | N | — |
| `meddra_code_id` | MedDRA classification | integer | — | ref_meddra_codes | N | Y | N | — |
| `intervention_type_id` | Intervention taken | integer | — | ref_intervention_types | N | Y | N | — |
| `ctcae_grade` | CTCAE numeric grade | smallint | — | — | N | Y | N | BETWEEN 1 AND 5 |
| `is_resolved` | Resolved before session end | boolean | false | — | N | Y | N | — |
| `resolved_at` | Resolution timestamp | timestamptz | — | — | N | Y | N | — |
| `logged_by_user_id` | Practitioner who logged | uuid | — | auth.users | N | Y | N | — |
| `report_pdf_url` | Generated PDF URL | text | — | — | N | Y | N | — |
| `report_generated_at` | PDF generation timestamp | timestamptz | — | — | N | Y | N | — |
| `causality_code` | Causality classification | text | — | — | N | Y | N | — |
| `created_by` | Row creator | uuid | — | auth.users | N | Y | N | — |
| `created_at` | Creation timestamp | timestamptz | now() | — | N | Y | N | — |

---

### `log_red_alerts` 🟢 KEEP
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `red_alert_id` | Surrogate PK | integer | nextval(seq) | — | Y | N | N | — |
| `patient_uuid` | Canonical patient ID | uuid | — | log_patient_site_links(patient_uuid) | N | Y | N | — |
| `crisis_event_type_id` | Crisis type FK | integer | — | ref_crisis_event_types | N | Y | N | — |
| `alert_type_id` | Alert category | bigint | — | ref_alert_types | N | Y | N | — |
| `severity_grade_id` | Severity grade | bigint | — | ref_severity_grade | N | Y | N | — |
| `trigger_value` | Alert trigger data | jsonb | — | — | N | Y | N | — |
| `is_acknowledged` | Acknowledged flag | boolean | false | — | N | Y | N | — |
| `acknowledged_by_user_id` | Acknowledging practitioner | uuid | — | auth.users | N | Y | N | — |
| `acknowledged_at` | Acknowledgment timestamp | timestamptz | — | — | N | Y | N | — |
| `is_resolved` | Resolved flag | boolean | false | — | N | Y | N | — |
| `resolved_at` | Resolution timestamp | timestamptz | — | — | N | Y | N | — |
| `alert_triggered_at` | When alert fired | timestamptz | now() | — | N | N | N | — |
| `created_by` | Row creator | uuid | — | auth.users | N | Y | N | — |
| `created_at` | Creation timestamp | timestamptz | now() | — | N | Y | N | — |

---

## PHASE 3 — INTEGRATION

### `log_integration_sessions` 🟡 MODIFY
**ADD:** `attendance_status_id` · **DROP:** `attended`, `whoqol_score`, `psqi_score`
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `integration_session_id` | Surrogate PK | integer | nextval(seq) | — | Y | N | N | — |
| `patient_uuid` | Canonical patient ID | uuid | — | log_patient_site_links(patient_uuid) | N | Y | N | — |
| `dosing_session_id` | Parent dosing session | uuid | — | log_clinical_records | N | Y | N | — |
| `therapist_user_id` | Integration therapist | uuid | — | auth.users | N | Y | N | — |
| `integration_session_number` | Sequential count for patient | integer | — | — | N | N | N | — |
| `session_date` | Session date | date | — | — | N | N | N | — |
| `session_duration_minutes` | Length in minutes | integer | — | — | N | Y | N | — |
| `attendance_status_id` | 🆕 Attendance outcome FK | integer | — | ref_attendance_statuses | N | Y | N | — |
| `cancellation_reason_id` | If cancelled — reason | integer | — | ref_cancellation_reasons | N | Y | N | — |
| `insight_integration_rating` | Practitioner rating (1–5) | integer | — | — | N | Y | N | BETWEEN 1 AND 5 |
| `emotional_processing_rating` | Practitioner rating (1–5) | integer | — | — | N | Y | N | BETWEEN 1 AND 5 |
| `behavioral_application_rating` | Practitioner rating (1–5) | integer | — | — | N | Y | N | BETWEEN 1 AND 5 |
| `engagement_level_rating` | Practitioner rating (1–5) | integer | — | — | N | Y | N | BETWEEN 1 AND 5 |
| `session_focus_ids` | Topics addressed **[INTENTIONAL]** | integer[] | — | ref_session_focus_areas | N | Y | N | — |
| `homework_assigned_ids` | Assignments given **[INTENTIONAL]** | integer[] | — | ref_homework_types | N | Y | N | — |
| `therapist_observation_ids` | Clinical observations **[INTENTIONAL]** | integer[] | — | ref_therapist_observations | N | Y | N | — |
| `created_by` | Row creator | uuid | — | auth.users | N | Y | N | — |
| `created_at` | Creation timestamp | timestamptz | now() | — | N | Y | N | — |
| ~~`attended`~~ | *DROPPED → `attendance_status_id`* | — | — | — | — | — | — | — |
| ~~`whoqol_score`~~ | *DROPPED — out of scope* | — | — | — | — | — | — | — |
| ~~`psqi_score`~~ | *DROPPED — out of scope* | — | — | — | — | — | — | — |

---

### `log_longitudinal_assessments` 🟡 MODIFY
**DROP:** `whoqol_score`, `psqi_score`
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `longitudinal_assessment_id` | Surrogate PK | integer | nextval(seq) | — | Y | N | N | — |
| `patient_uuid` | Canonical patient ID | uuid | — | log_patient_site_links(patient_uuid) | N | Y | N | — |
| `session_id` | Source dosing session | uuid | — | log_clinical_records | N | Y | N | — |
| `assessment_date` | Assessment date | date | — | — | N | N | N | — |
| `days_post_session` | Days since dosing | integer | — | — | N | Y | N | — |
| `phq9_score` | PHQ-9 re-assessment | integer | — | — | N | Y | N | BETWEEN 0 AND 27 |
| `gad7_score` | GAD-7 re-assessment | integer | — | — | N | Y | N | BETWEEN 0 AND 21 |
| `cssrs_score` | C-SSRS suicidality | integer | — | — | N | Y | N | BETWEEN 0 AND 6 |
| `completed_at` | Completion timestamp | timestamptz | now() | — | N | Y | N | — |
| `created_by` | Row creator | uuid | — | auth.users | N | Y | N | — |
| `created_at` | Creation timestamp | timestamptz | now() | — | N | Y | N | — |
| ~~`whoqol_score`~~ | *DROPPED* | — | — | — | — | — | — | — |
| ~~`psqi_score`~~ | *DROPPED* | — | — | — | — | — | — | — |

---

### `log_pulse_checks` 🟢 KEEP
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `pulse_check_id` | Surrogate PK | integer | nextval(seq) | — | Y | N | N | — |
| `patient_uuid` | Canonical patient ID | uuid | — | log_patient_site_links(patient_uuid) | N | Y | N | — |
| `session_id` | Source dosing session | uuid | — | log_clinical_records | N | Y | N | — |
| `check_date` | Date of check-in | date | CURRENT_DATE | — | N | N | N | — |
| `connection_level` | Sense of connection (1–5) | integer | — | — | N | Y | N | BETWEEN 1 AND 5 |
| `sleep_quality` | Sleep quality (1–5) | integer | — | — | N | Y | N | BETWEEN 1 AND 5 |
| `mood_level` | Mood level (1–5) | integer | — | — | N | Y | N | BETWEEN 1 AND 5 |
| `anxiety_level` | Anxiety level (1–5) | integer | — | — | N | Y | N | BETWEEN 1 AND 5 |
| `completed_at` | Entry timestamp | timestamptz | now() | — | N | Y | N | — |
| `created_by` | Row creator | uuid | — | auth.users | N | Y | N | — |
| `created_at` | Creation timestamp | timestamptz | now() | — | N | Y | N | — |

---

### `log_phase3_meq30` 🔵 CREATE
*Authoritative MEQ-30 score record. Denorm copy kept in `log_clinical_records.meq30_score` for fast queries.*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `id` | Surrogate PK | bigint | identity | — | Y | N | N | — |
| `patient_uuid` | Canonical patient ID | uuid | — | log_patient_site_links(patient_uuid) | N | N | N | — |
| `session_id` | Source dosing session | uuid | — | log_clinical_records | N | N | N | — |
| `meq30_score` | Sum of 30 responses (0–150) | integer | — | — | N | N | N | BETWEEN 0 AND 150 |
| `recorded_at` | Entry timestamp | timestamptz | now() | — | N | N | N | — |

---

## PLATFORM / OPS TABLES (Unchanged)

### `log_corrections` 🟢 KEEP — Immutable audit trail for field-level corrections
### `log_protocols` 🟢 KEEP — Practitioner-authored protocol templates
### `log_subscriptions` 🟢 KEEP — Stripe billing per site
### `log_user_subscriptions` 🟢 KEEP — Stripe billing per user
### `log_system_events` 🟢 KEEP — System-level audit log
### `log_usage_metrics` 🟢 KEEP — Per-site usage counters
### `log_feature_flags` 🟢 KEEP — Feature toggle registry
### `log_feature_requests` 🟢 KEEP — Practitioner feature requests
### `log_vocabulary_requests` 🟢 KEEP — New ref term requests
### `log_patient_flow_events` 🟢 KEEP — Patient workflow milestones
### `log_user_saved_views` 🟢 KEEP — Analytics filter presets
### `log_waitlist` 🟢 KEEP — Pre-launch signup emails

---

## DELETED TABLES

| Table | Reason |
|---|---|
| `log_consent` | Replaced by `log_phase1_consent` |
| `log_interventions` | JSONB blobs; superseded by `log_safety_events` |
| `log_outcomes` | Superseded by `log_longitudinal_assessments` |
| `log_session_observations` | Stubbed junction with no data |
| `log_baseline_observations` | Stubbed junction with no data |
| `log_safety_event_observations` | Orphaned junction; use `log_safety_events` instead |
| `log_behavioral_changes` | ⚠️ Deferred — has free-text `varchar` columns (change_category, impact_on_wellbeing, related_to_dosing). Requires `ref_behavioral_domains` vocabulary before it can be rebuilt cleanly. Existing `ref_behavioral_change_types` table is retained. |
