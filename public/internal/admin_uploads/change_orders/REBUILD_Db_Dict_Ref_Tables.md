# PPN Database — Final State: `ref_` & Other Tables
*Post-migration · **v4 master spec** · March 2026 · Derived from `implementation_plan.md`*

**Column flags:** PK=Primary Key · NK=Nullable · UQ=Unique · CHK=Check Constraint

> 🔵 CREATE = new table added by this migration · 🟢 KEEP = no changes needed

---

## SYSTEM TABLES

### `_schema_lock`
*Guards against concurrent migrations. Admin-only.*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `locked_at` | When lock was applied | timestamptz | now() | — | N | N | N | — |
| `locked_by` | Process that locked | text | — | — | N | Y | N | — |
| `reason` | Why locked | text | — | — | N | Y | N | — |

---

## NEW REFERENCE TABLES (CREATE)

### `ref_protocol_archetypes` 🔵 CREATE
*Treatment protocol styles used in patient profile setup.*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `id` | Surrogate PK | integer | identity | — | Y | N | N | — |
| `code` | Machine code (e.g. 'standard') | text | — | — | N | N | Y | — |
| `name` | Display label | text | — | — | N | N | N | — |

**Seed data:** standard, intensive, microdose, ceremonial, compassionate\_use

---

### `ref_intention_themes` 🔵 CREATE
*Pre-session intention/purpose themes. Multi-select on Set & Setting form.*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `id` | Surrogate PK | integer | identity | — | Y | N | N | — |
| `code` | Machine code | text | — | — | N | N | Y | — |
| `name` | Display label | text | — | — | N | N | N | — |

**Seed data:** grief, trauma, meaning, relationship, anxiety, depression, addiction, spiritual, creativity, acceptance, self\_compassion, end\_of\_life

---

### `ref_mindset_types` 🔵 CREATE
*Patient's pre-session psychological orientation.*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `id` | Surrogate PK | integer | identity | — | Y | N | N | — |
| `code` | Machine code | text | — | — | N | N | Y | — |
| `name` | Display label | text | — | — | N | N | N | — |

**Seed data:** optimistic, neutral, apprehensive, resolved, spiritual, scientific

---

### `ref_session_settings` 🔵 CREATE
*Physical/contextual setting of the dosing session.*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `id` | Surrogate PK | integer | identity | — | Y | N | N | — |
| `code` | Machine code | text | — | — | N | N | Y | — |
| `name` | Display label | text | — | — | N | N | N | — |

**Seed data:** clinic\_private, clinic\_group, home, ceremony, retreat, telehealth

---

> [!IMPORTANT]
> **`ref_timeline_event_types` is NOT created.** Per Decision D1, `ref_flow_event_types` is the canonical event vocabulary for `log_session_timeline_events.event_type_id`. A second event-type table would create the same fragmentation the ChatGPT review flagged. See `ref_flow_event_types` below.

---

### `ref_attendance_statuses` 🔵 CREATE
*Replaces boolean `attended` on `log_integration_sessions`.*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `id` | Surrogate PK | integer | identity | — | Y | N | N | — |
| `code` | Machine code | text | — | — | N | N | Y | — |
| `name` | Display label | text | — | — | N | N | N | — |

**Seed data:** attended, cancelled\_patient, cancelled\_provider, no\_show, rescheduled, partial

---

### `ref_consciousness_levels` 🔵 CREATE
*Replaces free-text `level_of_consciousness` on `log_session_vitals`.*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `id` | Surrogate PK | integer | identity | — | Y | N | N | — |
| `code` | Machine code | text | — | — | N | N | Y | — |
| `name` | Display label | text | — | — | N | N | N | — |

**Seed data:** alert, dreamy, deep\_trance, non\_responsive, agitated

---

### `ref_dosing_relatedness` 🔵 CREATE
*Reserved for future behavioral change tracking — classifies whether a change is related to the dosing session.*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `id` | Surrogate PK | integer | identity | — | Y | N | N | — |
| `code` | Machine code | text | — | — | N | N | Y | — |
| `name` | Display label | text | — | — | N | N | N | — |

**Seed data:** directly\_related, probably\_related, possibly\_related, unrelated, unknown

---

## EXISTING REFERENCE TABLES (KEEP)

### `ref_alert_types` 🟢
*Red alert categories.*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `alert_type_id` | Surrogate PK | bigint | — | — | Y | N | N | — |
| `alert_code` | Machine code | text | — | — | N | N | N | — |
| `alert_label` | Display label | text | — | — | N | N | N | — |
| `alert_category` | Alert grouping | text | — | — | N | N | N | — |
| `is_active` | Active flag | boolean | true | — | N | N | N | — |
| `created_at` | Creation timestamp | timestamptz | now() | — | N | N | N | — |

---

### `ref_assessment_scales` 🟢
*Clinical assessment scale registry (PHQ-9, GAD-7, CEQ, etc.).*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `assessment_scale_id` | Surrogate PK | integer | nextval(seq) | — | Y | N | N | — |
| `scale_code` | Code (e.g. 'PHQ9') | varchar | — | — | N | N | N | — |
| `scale_name` | Full name | varchar | — | — | N | N | N | — |
| `scale_description` | Description | text | — | — | N | Y | N | — |
| `min_score` | Minimum possible score | integer | — | — | N | N | N | — |
| `max_score` | Maximum possible score | integer | — | — | N | N | N | — |
| `loinc_code` | LOINC code | varchar | — | — | N | Y | N | — |
| `snomed_code` | SNOMED code | varchar | — | — | N | Y | N | — |
| `scoring_interpretation` | Score ranges / meanings | jsonb | — | — | N | Y | N | — |
| `is_active` | Active flag | boolean | true | — | N | Y | N | — |
| `created_at` | Creation timestamp | timestamptz | now() | — | N | Y | N | — |

---

### `ref_behavioral_change_types` 🟢
*Types of behavioral changes observed post-session.*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `change_type_id` | Surrogate PK | integer | nextval(seq) | — | Y | N | N | — |
| `change_type_code` | Machine code | varchar | — | — | N | N | N | — |
| `change_type_label` | Display label | varchar | — | — | N | N | N | — |
| `category` | Grouping category | varchar | — | — | N | N | N | — |
| `is_active` | Active flag | boolean | true | — | N | Y | N | — |

---

### `ref_benchmark_cohorts` 🟢
*Published clinical trial cohort data for benchmarking.*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `id` | UUID PK | uuid | gen_random_uuid() | — | Y | N | Y | — |
| `cohort_name` | Cohort display name | text | — | — | N | N | N | — |
| `source_citation` | Research citation | text | — | — | N | N | N | — |
| `modality` | Treatment modality | text | — | — | N | N | N | — |
| `condition` | Target condition | text | — | — | N | N | N | — |
| `setting` | Treatment setting | text | — | — | N | Y | N | — |
| `n_participants` | Sample size | integer | — | — | N | N | N | — |
| `country` | Country of study | text | — | — | N | Y | N | — |
| `instrument` | Assessment instrument | text | — | — | N | N | N | — |
| `baseline_mean` | Baseline score mean | numeric | — | — | N | Y | N | — |
| `baseline_sd` | Baseline score SD | numeric | — | — | N | Y | N | — |
| `endpoint_mean` | Endpoint score mean | numeric | — | — | N | Y | N | — |
| `endpoint_sd` | Endpoint score SD | numeric | — | — | N | Y | N | — |
| `followup_weeks` | Follow-up duration | integer | — | — | N | Y | N | — |
| `response_rate_pct` | Response rate % | numeric | — | — | N | Y | N | — |
| `remission_rate_pct` | Remission rate % | numeric | — | — | N | Y | N | — |
| `effect_size_hedges_g` | Hedges' g effect size | numeric | — | — | N | Y | N | — |
| `adverse_event_rate_pct` | AE rate % | numeric | — | — | N | Y | N | — |
| `data_freely_usable` | Open data flag | boolean | true | — | N | N | N | — |
| `license` | Data license | text | — | — | N | Y | N | — |
| `notes` | Additional notes | text | — | — | N | Y | N | — |
| `created_at` | Creation timestamp | timestamptz | now() | — | N | N | N | — |

---

### `ref_benchmark_trials` 🟢
*ClinicalTrials.gov trial metadata for benchmarking.*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `id` | UUID PK | uuid | gen_random_uuid() | — | Y | N | Y | — |
| `nct_id` | ClinicalTrials.gov ID | text | — | — | N | N | N | — |
| `title` | Trial title | text | — | — | N | N | N | — |
| `phase` | Trial phase | text | — | — | N | Y | N | — |
| `status` | Trial status | text | — | — | N | Y | N | — |
| `modality` | Treatment modality | text | — | — | N | N | N | — |
| `conditions` | Target conditions | ARRAY | — | — | N | Y | N | — |
| `country` | Country | text | — | — | N | Y | N | — |
| `enrollment_actual` | Actual enrollment | integer | — | — | N | Y | N | — |
| `start_date` | Start date | date | — | — | N | Y | N | — |
| `completion_date` | Completion date | date | — | — | N | Y | N | — |
| `primary_outcome_measure` | Primary endpoint | text | — | — | N | Y | N | — |
| `source` | Data source | text | 'clinicaltrials.gov' | — | N | N | N | — |
| `created_at` | Creation timestamp | timestamptz | now() | — | N | N | N | — |

---

### `ref_cancellation_reasons` 🟢
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `cancellation_reason_id` | Surrogate PK | integer | nextval(seq) | — | Y | N | N | — |
| `reason_code` | Machine code | varchar | — | — | N | N | N | — |
| `reason_text` | Display label | text | — | — | N | N | N | — |
| `is_active` | Active flag | boolean | true | — | N | Y | N | — |
| `created_at` | Creation timestamp | timestamptz | now() | — | N | Y | N | — |

---

### `ref_clinical_interactions` 🟢
*Drug-drug and drug-condition interaction rules for the contraindication engine.*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `interaction_id` | Surrogate PK | bigint | nextval(seq) | — | Y | N | N | — |
| `substance_name` | Primary substance | text | — | — | N | N | N | — |
| `interactor_name` | Interacting substance/condition | text | — | — | N | N | N | — |
| `interactor_category` | Category of interactor | text | — | — | N | Y | N | — |
| `risk_level` | Numeric risk level | integer | — | — | N | N | N | — |
| `severity_grade` | Severity description | text | — | — | N | N | N | — |
| `clinical_description` | Clinical detail | text | — | — | N | N | N | — |
| `mechanism` | Pharmacological mechanism | text | — | — | N | Y | N | — |
| `evidence_source` | Source of evidence | text | — | — | N | Y | N | — |
| `source_url` | Reference URL | text | — | — | N | Y | N | — |
| `is_verified` | Clinically verified | boolean | false | — | N | Y | N | — |
| `created_at` | Creation timestamp | timestamptz | now() | — | N | N | N | — |

---

### `ref_clinical_observations` 🟢
*Structured observation tags for session documentation.*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `observation_id` | Surrogate PK | integer | nextval(seq) | — | Y | N | N | — |
| `observation_code` | Machine code | varchar | — | — | N | N | N | — |
| `observation_text` | Display label | text | — | — | N | N | N | — |
| `category` | Observation grouping | varchar | — | — | N | N | N | — |
| `sort_order` | Display sort order | integer | 0 | — | N | N | N | — |
| `is_active` | Active flag | boolean | true | — | N | Y | N | — |
| `created_at` | Creation timestamp | timestamptz | now() | — | N | Y | N | — |

---

### `ref_clinical_phenotypes` 🟢
*Clinical phenotype classifications for session records.*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `clinical_phenotype_id` | Surrogate PK | bigint | — | — | Y | N | N | — |
| `phenotype_code` | Machine code | text | — | — | N | N | N | — |
| `phenotype_name` | Display name | text | — | — | N | N | N | — |
| `icd10_category` | ICD-10 grouping | text | — | — | N | Y | N | — |
| `is_active` | Active flag | boolean | true | — | N | N | N | — |
| `created_at` | Creation timestamp | timestamptz | now() | — | N | N | N | — |

---

### `ref_consent_types` 🟢
*Types of consent to be confirmed in the consent form.*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `id` | Surrogate PK | integer | nextval(seq) | — | Y | N | N | — |
| `consent_code` | Machine code | varchar | — | — | N | N | N | — |
| `label` | Display label | varchar | — | — | N | N | N | — |
| `is_active` | Active flag | boolean | true | — | N | N | N | — |

---

### `ref_contraindication_verdicts` 🟢
*Possible outcomes from the contraindication engine.*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `verdict_id` | Surrogate PK | bigint | — | — | Y | N | N | — |
| `verdict_code` | Machine code (e.g. 'GREEN') | text | — | — | N | N | N | — |
| `verdict_label` | Display label | text | — | — | N | N | N | — |
| `ui_color_hex` | Badge color | text | '#6b7280' | — | N | Y | N | — |
| `is_active` | Active flag | boolean | true | — | N | N | N | — |
| `created_at` | Creation timestamp | timestamptz | now() | — | N | N | N | — |

---

### `ref_crisis_event_types` 🟢
*Crisis classifications for red alerts.*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `id` | Surrogate PK | integer | nextval(seq) | — | Y | N | N | — |
| `event_code` | Machine code | varchar | — | — | N | N | N | — |
| `label` | Display label | varchar | — | — | N | N | N | — |
| `severity_tier` | Crisis severity (1–3) | smallint | 1 | — | N | N | N | BETWEEN 1 AND 3 |
| `is_active` | Active flag | boolean | true | — | N | N | N | — |
| `created_at` | Creation timestamp | timestamptz | now() | — | N | Y | N | — |

---

### `ref_data_sources` 🟢
*Data entry source classification (device vs. manual).*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `data_source_id` | Surrogate PK | bigint | — | — | Y | N | N | — |
| `source_code` | Machine code | text | — | — | N | N | N | — |
| `source_label` | Display label | text | — | — | N | N | N | — |
| `is_active` | Active flag | boolean | true | — | N | N | N | — |
| `created_at` | Creation timestamp | timestamptz | now() | — | N | N | N | — |

---

### `ref_ekg_rhythms` 🟢
*EKG rhythm findings for safety screening.*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `id` | Surrogate PK | integer | nextval(seq) | — | Y | N | N | — |
| `code` | Machine code | varchar | — | — | N | N | N | — |
| `label` | Display label | varchar | — | — | N | N | N | — |
| `severity_tier` | Clinical severity | varchar | 'monitor' | — | N | N | N | — |
| `is_active` | Active flag | boolean | true | — | N | N | N | — |
| `valid_from` | Effective start date | date | CURRENT_DATE | — | N | N | N | — |
| `valid_to` | Effective end date | date | — | — | N | Y | N | — |

---

### `ref_flow_event_types` 🟢 KEEP
*Canonical vocabulary for `log_session_timeline_events.event_type_id`. This is the **single authoritative event type table** per Decision D1. `ref_timeline_event_types` was NOT created.*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `id` | Surrogate PK | bigint | nextval(seq) | — | Y | N | N | — |
| `event_type_code` | Machine code | text | — | — | N | N | Y | — |
| `event_type_label` | Display label | text | — | — | N | N | N | — |
| `event_category` | Event grouping | text | — | — | N | N | N | — |
| `stage_order` | Sequence order in journey | integer | — | — | N | Y | N | — |
| `description` | Clinical description | text | — | — | N | Y | N | — |
| `is_active` | Active flag | boolean | true | — | N | Y | N | — |
| `created_at` | Creation timestamp | timestamptz | now() | — | N | Y | N | — |

---

### `ref_homework_types` 🟢
*Integration homework assignments.*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `homework_type_id` | Surrogate PK | integer | nextval(seq) | — | Y | N | N | — |
| `homework_code` | Machine code | varchar | — | — | N | N | N | — |
| `homework_label` | Display label | varchar | — | — | N | N | N | — |
| `is_active` | Active flag | boolean | true | — | N | Y | N | — |

---

### `ref_indications` 🟢
*Diagnoses and treatment conditions. FK source for `log_patient_indications`.*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `indication_id` | Surrogate PK | bigint | nextval(seq) | — | Y | N | N | — |
| `indication_name` | Display name | text | — | — | N | N | N | — |
| `snomed_code` | SNOMED CT code | text | — | — | N | Y | N | — |
| `icd10_code` | ICD-10 code | text | — | — | N | Y | N | — |
| `indication_category` | Category grouping | text | — | — | N | Y | N | — |
| `is_active` | Active flag | boolean | true | — | N | Y | N | — |
| `created_at` | Creation timestamp | timestamptz | now() | — | N | Y | N | — |

---

### `ref_intervention_types` 🟢
*Clinical interventions used during safety events.*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `intervention_type_id` | Surrogate PK | integer | nextval(seq) | — | Y | N | N | — |
| `intervention_code` | Machine code | varchar | — | — | N | N | N | — |
| `intervention_name` | Display name | varchar | — | — | N | N | N | — |
| `intervention_category` | Category | varchar | — | — | N | Y | N | — |
| `description` | Clinical description | text | — | — | N | Y | N | — |
| `requires_documentation` | Requires notes flag | boolean | true | — | N | Y | N | — |
| `is_active` | Active flag | boolean | true | — | N | Y | N | — |
| `created_at` | Creation timestamp | timestamptz | now() | — | N | Y | N | — |

---

### `ref_justification_codes` 🟢
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `justification_id` | Surrogate PK | bigint | — | — | Y | N | N | — |
| `reason_text` | Justification description | text | — | — | N | Y | N | — |

---

### `ref_knowledge_graph` 🟢
*Substance interaction rules for the contraindication engine.*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `rule_id` | Rule identifier | text | — | — | Y | N | Y | — |
| `substance_a_id` | Primary substance ID | text | — | — | N | Y | N | — |
| `substance_b_id` | Interacting substance ID | text | — | — | N | Y | N | — |
| `condition_code` | Applicable condition | text | — | — | N | Y | N | — |
| `risk_level` | Risk classification | text | — | — | N | Y | N | — |
| `alert_message` | UI alert message | text | — | — | N | Y | N | — |

---

### `ref_meddra_codes` 🟢
*MedDRA adverse event classification codes.*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `meddra_code_id` | Surrogate PK | integer | nextval(seq) | — | Y | N | N | — |
| `meddra_code` | MedDRA code | varchar | — | — | N | N | N | — |
| `preferred_term` | Preferred term | varchar | — | — | N | N | N | — |
| `system_organ_class` | SOC grouping | varchar | — | — | N | Y | N | — |
| `severity_level` | Severity level | varchar | — | — | N | Y | N | — |
| `description` | Description | text | — | — | N | Y | N | — |
| `is_active` | Active flag | boolean | true | — | N | Y | N | — |
| `created_at` | Creation timestamp | timestamptz | now() | — | N | Y | N | — |

---

### `ref_medications` 🟢
*Concomitant medication vocabulary.*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `medication_id` | Surrogate PK | bigint | nextval(seq) | — | Y | N | N | — |
| `medication_name` | Drug name | text | — | — | N | N | N | — |
| `medication_category` | Drug class | varchar | — | — | N | Y | N | — |
| `rxnorm_cui` | RxNorm identifier | varchar | — | — | N | Y | N | — |
| `is_active` | Active flag | boolean | true | — | N | Y | N | — |
| `created_at` | Creation timestamp | timestamptz | now() | — | N | N | N | — |

---

### `ref_population_baselines` 🟢
*Population-level baseline statistics for global benchmarking.*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `id` | UUID PK | uuid | gen_random_uuid() | — | Y | N | Y | — |
| `source` | Data source | text | — | — | N | N | N | — |
| `year` | Publication year | integer | — | — | N | N | N | — |
| `region` | Geographic region | text | — | — | N | N | N | — |
| `condition` | Condition/indication | text | — | — | N | Y | N | — |
| `substance` | Substance used | text | — | — | N | Y | N | — |
| `demographic_group` | Demographic segment | text | — | — | N | Y | N | — |
| `n_episodes` | Episode count | integer | — | — | N | Y | N | — |
| `avg_age` | Mean age | numeric | — | — | N | Y | N | — |
| `pct_female` | % female | numeric | — | — | N | Y | N | — |
| `avg_prior_treatments` | Mean prior treatments | numeric | — | — | N | Y | N | — |
| `avg_los_days` | Mean length of stay | numeric | — | — | N | Y | N | — |
| `pct_completed_treatment` | Completion rate % | numeric | — | — | N | Y | N | — |
| `created_at` | Creation timestamp | timestamptz | now() | — | N | N | N | — |

---

### `ref_practitioner_types` 🟢
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `practitioner_type_id` | Surrogate PK | bigint | — | — | Y | N | N | — |
| `type_code` | Machine code | text | — | — | N | N | N | — |
| `type_label` | Display label | text | — | — | N | N | N | — |
| `requires_license` | License required flag | boolean | true | — | N | N | N | — |
| `is_active` | Active flag | boolean | true | — | N | N | N | — |
| `created_at` | Creation timestamp | timestamptz | now() | — | N | N | N | — |

---

### `ref_practitioners` 🟢
*Public practitioner directory for network intelligence.*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `practitioner_id` | Surrogate PK | bigint | — | — | Y | N | N | — |
| `display_name` | Public display name | text | — | — | N | N | N | — |
| `role` | Clinical role | text | — | — | N | N | N | — |
| `location_city` | City | text | — | — | N | N | N | — |
| `location_country` | Country | text | 'United States' | — | N | N | N | — |
| `license_type` | License type | text | — | — | N | Y | N | — |
| `modalities` | Modalities offered | ARRAY | — | — | N | Y | N | — |
| `accepting_clients` | Accepting new clients | boolean | true | — | N | N | N | — |
| `verified` | Identity verified | boolean | false | — | N | N | N | — |
| `verification_level` | Verification tier | text | 'L1' | — | N | N | N | — |
| `profile_url` | Profile page URL | text | — | — | N | Y | N | — |
| `image_url` | Avatar URL | text | — | — | N | Y | N | — |
| `is_active` | Active listing | boolean | true | — | N | N | N | — |
| `sort_order` | Display sort | integer | 0 | — | N | N | N | — |
| `created_at` | Creation timestamp | timestamptz | now() | — | N | N | N | — |

---

### `ref_psychospiritual_history_types` 🟢
*Vocabulary for patient psychospiritual history. FK for `log_patient_psychospiritual_history`.*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `psychospiritual_history_id` | Surrogate PK | bigint | — | — | Y | N | N | — |
| `history_code` | Machine code | text | — | — | N | N | N | — |
| `history_label` | Display label | text | — | — | N | N | N | — |
| `sort_order` | Display sort | integer | 999 | — | N | Y | N | — |
| `is_active` | Active flag | boolean | true | — | N | N | N | — |
| `created_at` | Creation timestamp | timestamptz | now() | — | N | N | N | — |

---

### `ref_rejection_reasons` 🟢
*Reasons for rejecting vocabulary requests.*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `rejection_reason_id` | Surrogate PK | bigint | — | — | Y | N | N | — |
| `reason_code` | Machine code | text | — | — | N | N | N | — |
| `reason_label` | Display label | text | — | — | N | N | N | — |
| `is_active` | Active flag | boolean | true | — | N | N | N | — |
| `created_at` | Creation timestamp | timestamptz | now() | — | N | N | N | — |

---

### `ref_resolution_status` 🟢
*How a safety event was resolved.*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `resolution_status_id` | Surrogate PK | bigint | nextval(seq) | — | Y | N | N | — |
| `status_name` | Display name | text | — | — | N | N | N | — |
| `description` | Description | text | — | — | N | Y | N | — |
| `is_active` | Active flag | boolean | true | — | N | Y | N | — |
| `created_at` | Creation timestamp | timestamptz | now() | — | N | Y | N | — |

---

### `ref_routes` 🟢
*Routes of administration (oral, IV, IM, etc.).*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `route_id` | Surrogate PK | bigint | nextval(seq) | — | Y | N | N | — |
| `route_name` | Full name | text | — | — | N | N | N | — |
| `route_code` | Machine code | text | — | — | N | Y | N | — |
| `route_label` | Display label | text | — | — | N | Y | N | — |
| `is_active` | Active flag | boolean | true | — | N | Y | N | — |
| `created_at` | Creation timestamp | timestamptz | now() | — | N | Y | N | — |

---

### `ref_safety_events` 🟢
*Adverse event type vocabulary.*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `safety_event_id` | Surrogate PK | bigint | nextval(seq) | — | Y | N | N | — |
| `event_name` | Display name | text | — | — | N | N | N | — |
| `event_code` | Machine code | text | — | — | N | Y | N | — |
| `event_category` | Category grouping | text | — | — | N | Y | N | — |
| `is_active` | Active flag | boolean | true | — | N | Y | N | — |
| `created_at` | Creation timestamp | timestamptz | now() | — | N | Y | N | — |

---

### `ref_session_focus_areas` 🟢
*Topics addressed during integration sessions.*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `focus_area_id` | Surrogate PK | integer | nextval(seq) | — | Y | N | N | — |
| `focus_code` | Machine code | varchar | — | — | N | N | N | — |
| `focus_label` | Display label | varchar | — | — | N | N | N | — |
| `is_active` | Active flag | boolean | true | — | N | Y | N | — |

---

### `ref_session_types` 🟢
*Session format types (individual, group, etc.).*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `id` | Surrogate PK | integer | nextval(seq) | — | Y | N | N | — |
| `session_code` | Machine code | varchar | — | — | N | N | N | — |
| `session_label` | Display label | varchar | — | — | N | N | N | — |
| `is_active` | Active flag | boolean | true | — | N | N | N | — |
| `created_at` | Creation timestamp | timestamptz | now() | — | N | Y | N | — |

---

### `ref_severity_grade` 🟢
*CTCAE severity grades (1–5).*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `severity_grade_id` | Surrogate PK | bigint | nextval(seq) | — | Y | N | N | — |
| `grade_value` | Numeric grade (1–5) | integer | — | — | N | N | N | BETWEEN 1 AND 5 |
| `grade_label` | Display label | text | — | — | N | N | N | — |
| `description` | Clinical description | text | — | — | N | Y | N | — |
| `is_active` | Active flag | boolean | true | — | N | Y | N | — |
| `created_at` | Creation timestamp | timestamptz | now() | — | N | Y | N | — |

---

### `ref_sex` 🟢
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `sex_id` | Surrogate PK | bigint | — | — | Y | N | N | — |
| `sex_code` | Machine code | text | — | — | N | N | N | — |
| `sex_label` | Display label | text | — | — | N | N | N | — |
| `sort_order` | Display sort | integer | 999 | — | N | N | N | — |
| `is_active` | Active flag | boolean | true | — | N | N | N | — |
| `created_at` | Creation timestamp | timestamptz | now() | — | N | N | N | — |

---

### `ref_smoking_status` 🟢
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `smoking_status_id` | Surrogate PK | bigint | nextval(seq) | — | Y | N | N | — |
| `status_name` | Display name | text | — | — | N | N | N | — |
| `status_code` | Machine code | text | — | — | N | Y | N | — |
| `is_active` | Active flag | boolean | true | — | N | Y | N | — |
| `created_at` | Creation timestamp | timestamptz | now() | — | N | Y | N | — |

---

### `ref_substances` 🟢
*Psychedelic and other substances with pharmacological receptor binding data.*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `substance_id` | Surrogate PK | bigint | nextval(seq) | — | Y | N | N | — |
| `substance_name` | Display name | text | — | — | N | N | N | — |
| `rxnorm_cui` | RxNorm code | bigint | — | — | N | Y | N | — |
| `substance_class` | Chemical class | text | — | — | N | Y | N | — |
| `primary_mechanism` | Primary mechanism of action | text | — | — | N | Y | N | — |
| `receptor_5ht2a_ki` | 5-HT2A binding affinity | numeric | — | — | N | Y | N | — |
| `receptor_5ht1a_ki` | 5-HT1A binding affinity | numeric | — | — | N | Y | N | — |
| `receptor_5ht2c_ki` | 5-HT2C binding affinity | numeric | — | — | N | Y | N | — |
| `receptor_d2_ki` | D2 binding affinity | numeric | — | — | N | Y | N | — |
| `receptor_sert_ki` | SERT binding affinity | numeric | — | — | N | Y | N | — |
| `receptor_nmda_ki` | NMDA binding affinity | numeric | — | — | N | Y | N | — |
| `is_active` | Active flag | boolean | true | — | N | Y | N | — |
| `created_at` | Creation timestamp | timestamptz | now() | — | N | Y | N | — |

---

### `ref_support_modality` 🟢
*Support modalities used alongside dosing (music, bodywork, etc.).*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `modality_id` | Surrogate PK | bigint | nextval(seq) | — | Y | N | N | — |
| `modality_name` | Display name | text | — | — | N | N | N | — |
| `modality_code` | Machine code | text | — | — | N | Y | N | — |
| `description` | Description | text | — | — | N | Y | N | — |
| `is_active` | Active flag | boolean | true | — | N | Y | N | — |
| `created_at` | Creation timestamp | timestamptz | now() | — | N | Y | N | — |

---

### `ref_system_action_types` 🟢
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `id` | Surrogate PK | integer | nextval(seq) | — | Y | N | N | — |
| `action_code` | Machine code | varchar | — | — | N | N | N | — |
| `label` | Display label | varchar | — | — | N | N | N | — |
| `is_active` | Active flag | boolean | true | — | N | N | N | — |

---

### `ref_therapist_observations` 🟢
*Structured observation tags for integration sessions.*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `observation_type_id` | Surrogate PK | integer | nextval(seq) | — | Y | N | N | — |
| `observation_code` | Machine code | varchar | — | — | N | N | N | — |
| `observation_label` | Display label | varchar | — | — | N | N | N | — |
| `is_active` | Active flag | boolean | true | — | N | Y | N | — |

---

### `ref_user_roles` 🟢
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `id` | Surrogate PK | integer | nextval(seq) | — | Y | N | N | — |
| `role_name` | Role display name | text | — | — | N | N | N | — |
| `created_at` | Creation timestamp | timestamptz | now() | — | N | Y | N | — |

---

### `ref_weight_ranges` 🟢
*Weight bracket vocabulary. Auto-populated from most recent session.*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `id` | Surrogate PK | bigint | nextval(seq) | — | Y | N | N | — |
| `range_label` | Display label (e.g. "60–75 kg") | text | — | — | N | N | N | — |
| `kg_low` | Lower bound in kg | numeric | — | — | N | N | N | — |
| `kg_high` | Upper bound in kg | numeric | — | — | N | N | N | — |
| `sort_order` | Display sort | integer | — | — | N | N | N | — |
| `is_active` | Active flag | boolean | true | — | N | N | N | — |
| `created_at` | Creation timestamp | timestamptz | now() | — | N | N | N | — |
| `updated_at` | Last update | timestamptz | now() | — | N | N | N | — |

---

### `ref_assessments` 🟢
*Assessment test registry (supplementary to ref_assessment_scales).*
| Column | Description | Type | Default | FK | PK | NK | UQ | CHK |
|---|---|---|---|---|---|---|---|---|
| `assessment_id` | Surrogate PK | bigint | — | — | Y | N | N | — |
| `test_short_name` | Short name | text | — | — | N | Y | N | — |
| `loinc_code` | LOINC code | text | — | — | N | Y | N | — |
| `definition` | Full definition | text | — | — | N | Y | N | — |

---

## DELETED / DEPRECATED REFERENCE TABLES

| Table | Status | Reason |
|---|---|---|
| `ref_assessment_interval` | 🔴 DEPRECATED | No log table uses this FK; intervals captured as `days_post_session` integer |
| `ref_primary_adverse` | 🔴 DEPRECATED | Superseded by `ref_safety_events` + `ref_meddra_codes` |
| `ref_timeline_event_types` | ⚠️ NOT CREATED (Decision D1) | Would duplicate `ref_flow_event_types`. The existing table is canonical. |
