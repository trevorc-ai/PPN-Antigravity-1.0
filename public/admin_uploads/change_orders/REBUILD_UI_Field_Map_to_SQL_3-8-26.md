# PPN Wellness Journey — UI Field Map
*Every input → its database home · **v4 — Aligned to locked master spec***

**Status legend:**
- ✅ Wired — field is currently saved to the database
- ⚠️ Partial — form saves but column is wrong type or missing
- ❌ Not wired — UI shows but no DB write exists
- 🆕 New — requires new table/column per implementation plan v4

> [!IMPORTANT]
> This map must match the locked master spec in `implementation_plan.md`. If a contradiction exists between this file and the master spec, **the master spec wins.**

> Form IDs are the `WellnessFormId` strings from `WellnessFormRouter.tsx`.

---

## Patient Setup (Pre-Journey)

| UI Label | Input Type | Target Table | Target Column | Column Type | Status |
|---|---|---|---|---|---|
| Patient Link Code | Generated (auto) | `log_patient_site_links` | `patient_link_code` | text | ✅ |
| Patient UUID | Generated (auto) | `log_patient_site_links` | `patient_uuid` | uuid | ✅ |
| Sex | Dropdown | `log_patient_profiles` | `sex_id` | int FK → ref_sex | 🆕 |
| Age at Intake | Number input | `log_patient_profiles` | `age_at_intake` | integer | 🆕 |
| Weight Range | Dropdown | `log_patient_profiles` | `weight_range_id` | int FK → ref_weight_ranges | 🆕 (auto-populated per session from log_clinical_records) |
| Primary Indication | Multi-select | `log_patient_indications` | `indication_id` | int FK → ref_indications | 🆕 (was single FK on log_clinical_records) |
| Is Primary Indication | Toggle | `log_patient_indications` | `is_primary` | boolean | 🆕 |
| Smoking Status | Dropdown | `log_patient_profiles` | `smoking_status_id` | int FK → ref_smoking_status | 🆕 |
| Protocol Archetype | Dropdown | `log_patient_profiles` | `protocol_archetype_id` | int FK → ref_protocol_archetypes | 🆕 |
| Psychospiritual History | Multi-select | `log_patient_psychospiritual_history` | `psychospiritual_history_type_id` | int FK | 🆕 |

---

## PHASE 1: PREPARATION

### Form: `consent`
*`log_phase1_consent`*

| UI Label | Input Type | Target Column | Column Type | Status |
|---|---|---|---|---|
| Consent checklist items | Multi-checkbox | `consent_type_ids` | integer[] FK → ref_consent_types | 🆕 (was log_consent, now log_phase1_consent) |
| Consent timestamp | Auto-captured | `consented_at` | timestamptz | 🆕 |

---

### Form: `structured-safety`
*`log_phase1_safety_screen`*

| UI Label | Input Type | Target Column | Column Type | Status |
|---|---|---|---|---|
| Contraindication verdict | Dropdown | `contraindication_verdict_id` | int FK → ref_contraindication_verdicts | 🆕 |
| EKG Rhythm | Dropdown | `ekg_rhythm_id` | int FK → ref_ekg_rhythms | 🆕 |
| Concomitant medications | Multi-select | `concomitant_med_ids` | integer[] FK → ref_medications | 🆕 |
| Completion timestamp | Auto-captured | `screened_at` | timestamptz | ⚠️ (currently only a timeline event; no dedicated row) |

---

### Form: `set-and-setting`
*`log_phase1_set_and_setting`*

| UI Label | Input Type | Target Column | Column Type | Status |
|---|---|---|---|---|
| Intention themes | Multi-select | `intention_theme_ids` | integer[] FK → ref_intention_themes | 🆕 |
| Mindset / Expectation | Dropdown | `mindset_type_id` | int FK → ref_mindset_types | 🆕 |
| Session setting (location) | Dropdown | `session_setting_id` | int FK → ref_session_settings | 🆕 |
| Treatment expectancy (0–10) | Slider | `treatment_expectancy` | integer | ⚠️ (goes to log_baseline_assessments.expectancy_scale — needs to also go here) |

---

### Form: `mental-health`
*`log_baseline_assessments`*

| UI Label | Input Type | Target Column | Column Type | Status |
|---|---|---|---|---|
| PHQ-9 score | Wizard (9 items→sum) | `phq9_score` | integer 0–27 | ✅ |
| GAD-7 score | Wizard (7 items→sum) | `gad7_score` | integer 0–21 | ✅ |
| ACE score | Wizard (10 items→sum) | `ace_score` | integer 0–10 | ✅ |
| Treatment expectancy | Slider | `expectancy_scale` | integer | ✅ |
| PCL-5 score | Wizard (20 items→sum) | *(no column yet)* | — | ❌ (localStorage only) |

---

## PHASE 2: DOSING SESSION

### Form: `dosing-protocol`
*`log_clinical_records` (UPDATE on existing session row)*

| UI Label | Input Type | Target Column | Column Type | Status |
|---|---|---|---|---|
| Substance | Dropdown | `substance_id` | int FK → ref_substances | ✅ |
| Dosage amount | Number input | `dosage_amount` | numeric | ✅ (column is `dosage_amount` in live DB — not `dosage`) |
| Route of administration | Dropdown | `route_id` | int FK → ref_routes | ✅ |
| Session date | Date picker | `session_date` | date | ✅ |
| Session setting | Dropdown | `session_setting_id` | int FK → ref_session_settings | 🆕 |
| Mindset pre-session | Dropdown | `mindset_type_id` | int FK → ref_mindset_types | 🆕 |
| Intention themes | Multi-select | `intention_theme_ids` | integer[] | 🆕 |
| Weight (current session) | Dropdown | `weight_range_id` | int FK → ref_weight_ranges | ✅ (auto-populated from prior session) |
| Concomitant medications | Multi-select | `concomitant_med_ids` | integer[] FK → ref_medications | ✅ |

### Re-dose / Additional Dose
*`log_dose_events` (INSERT per booster)*

| UI Label | Input Type | Target Column | Column Type | Status |
|---|---|---|---|---|
| Substance (booster) | Dropdown | `substance_id` | int FK → ref_substances | ✅ |
| Booster dosage | Number input | `dose_mg` | numeric | ✅ (D3: column is `dose_mg` on `log_dose_events` — not `dosage`) |
| Route | Dropdown | `route_id` | int FK | ✅ |
| Administered at | Auto-timestamp | `administered_at` | timestamptz | ✅ |

---

### Form: `session-vitals`
*`log_session_vitals` (one row per reading)*

| UI Label | Input Type | Target Column | Column Type | Status |
|---|---|---|---|---|
| Heart rate (bpm) | Number input | `heart_rate` | integer | ✅ |
| HRV (ms) | Number input | `hrv` | integer | ✅ |
| BP Systolic (mmHg) | Number input | `bp_systolic` | integer | ✅ |
| BP Diastolic (mmHg) | Number input | `bp_diastolic` | integer | ✅ |
| SpO2 (%) | Number input | `oxygen_saturation` | numeric | ✅ |
| Respiratory rate | Number input | `respiratory_rate` | integer | ✅ |
| Temperature (°F) | Number input | `temperature` | numeric | ✅ |
| Diaphoresis | Dropdown/Scale | `diaphoresis_score` | integer | ✅ |
| Level of consciousness | Dropdown | `consciousness_level_id` | int FK → ref_consciousness_levels | 🆕 (was free-text `level_of_consciousness` — DROP) |
| Recorded at | Auto-timestamp | `recorded_at` | timestamptz | ✅ |

---

### Form: `session-timeline`
*`log_session_timeline_events` (one row per event)*

| UI Label | Input Type | Target Column | Column Type | Status |
|---|---|---|---|---|
| Event type | Dropdown | `event_type_id` | integer FK → ref_flow_event_types | ✅ (D1: column is already `event_type_id integer` in live DB; `ref_flow_event_types` is the canonical vocab table — NOT `ref_timeline_event_types`) |
| Event timestamp | DateTime picker | `event_timestamp` | timestamptz | ✅ |
| Performed by | Text / User select | `performed_by` | uuid | ✅ |
| Event description | – | `metadata.event_description` | jsonb | ⚠️ (metadata blob — acceptable for non-queryable text only) |

---

### Form: `session-observations`
*`log_phase2_session_observations`* ← currently no dedicated DB write

| UI Label | Input Type | Target Column | Column Type | Status |
|---|---|---|---|---|
| Observation tags | Multi-select | *(no table exists)* | — | ❌ Not wired — `handleSessionObservationsSave` is a stub |

---

### Form: `safety-and-adverse-event`
*`log_safety_events`*

| UI Label | Input Type | Target Column | Column Type | Status |
|---|---|---|---|---|
| Event type | Dropdown | `event_type_id` | int FK → ref_safety_events | ⚠️ (mapped via label lookup, not direct FK from form) |
| Severity grade | Dropdown | `severity_grade_id` | int FK → ref_severity_grade | ✅ |
| Resolved | Toggle | `is_resolved` | boolean | ✅ |
| MedDRA code | Lookup | `meddra_code_id` | int FK → ref_meddra_codes | ❌ Not wired in UI yet |

---

### Form: `rescue-protocol`
*`log_safety_events` (INSERT — **not** a timeline event)*

> [!IMPORTANT]
> Rescue protocol is a **safety event**, not a session timeline event. The UI handler `handleRescueProtocolSave` must write to `log_safety_events`, not `log_session_timeline_events`. This is a P1 bug.

| UI Label | Input Type | Target Table | Target Column | Column Type | Status |
|---|---|---|---|---|---|
| Intervention type | Dropdown | `log_safety_events` | `intervention_type_id` | integer FK → ref_intervention_types | ❌ Bug: currently writes to timeline event_type_id with hardcoded 'rescue' |
| Safety event type | Auto-set | `log_safety_events` | `safety_event_type_id` | bigint FK → ref_safety_events | ❌ Not wired |
| Notes | – | `log_safety_events` | `metadata` / `causality_code` | text | ❌ Not stored |

---

## PHASE 3: INTEGRATION

### Form: `daily-pulse`
*`log_pulse_checks`*

| UI Label | Input Type | Target Column | Column Type | Status |
|---|---|---|---|---|
| Check-in date | Date picker | `check_date` | date | ✅ |
| Connection level (1–5) | Slider | `connection_level` | integer | ✅ |
| Sleep quality (1–5) | Slider | `sleep_quality` | integer | ✅ |
| Mood level (1–5) | Slider | `mood_level` | integer | ✅ |
| Anxiety level (1–5) | Slider | `anxiety_level` | integer | ✅ |

---

### Form: `meq30`
*`log_phase3_meq30`* (🆕 new table)

| UI Label | Input Type | Target Column | Column Type | Status |
|---|---|---|---|---|
| MEQ-30 (30 Likert items) | 30× 5-point scale | `meq30_score` | integer (sum) | ⚠️ (currently stored only in timeline event metadata — needs dedicated table) |

---

### Form: `structured-integration`
*`log_integration_sessions`*

| UI Label | Input Type | Target Column | Column Type | Status |
|---|---|---|---|---|
| Session number | Number input | `integration_session_number` | integer | ✅ |
| Session date | Date picker | `session_date` | date | ✅ |
| Duration (minutes) | Number input | `session_duration_minutes` | integer | ✅ |
| Attendance status | Dropdown | `attendance_status_id` | int FK → ref_attendance_statuses | 🆕 (was boolean `attended` — DROP) |
| Insight integration rating (1–5) | Slider | `insight_integration_rating` | integer | ✅ |
| Emotional processing rating (1–5) | Slider | `emotional_processing_rating` | integer | ✅ |
| Behavioral application rating (1–5) | Slider | `behavioral_application_rating` | integer | ✅ |
| Engagement level rating (1–5) | Slider | `engagement_level_rating` | integer | ✅ |
| Session focus areas | Multi-select | `session_focus_ids` | integer[] FK → ref_session_focus_areas | ✅ |
| Homework assigned | Multi-select | `homework_assigned_ids` | integer[] FK → ref_homework_types | ✅ |
| Therapist observations | Multi-select | `therapist_observation_ids` | integer[] FK → ref_therapist_observations | ✅ |

---

### Form: `behavioral-tracker`
*`log_behavioral_changes`* (⚠️ **table is deferred/dropped from scope**)

| UI Label | Input Type | Target Column | Column Type | Status |
|---|---|---|---|---|
| Change date | Date picker | *(deferred)* | — | ❌ Table dropped from scope |
| Change types | Multi-select | *(deferred)* | — | ❌ |
| Confidence sustaining (1–5) | Slider | *(deferred)* | — | ❌ |
| Impact on wellbeing | Dropdown | *(deferred)* | — | ❌ |

> **Note:** This form is fully built in the UI and currently writes to `log_behavioral_changes`, but that table has free-text columns that violate the no-free-text rule. The table is being deferred until a proper `ref_behavioral_domains` vocabulary is designed in a future sprint.

---

### Form: `longitudinal-assessment`
*`log_longitudinal_assessments`*

| UI Label | Input Type | Target Column | Column Type | Status |
|---|---|---|---|---|
| Assessment date | Date picker | `assessment_date` | date | ✅ |
| Days post-session | Number input | `days_post_session` | integer | ✅ |
| PHQ-9 score | Wizard/Number | `phq9_score` | integer | ✅ |
| GAD-7 score | Wizard/Number | `gad7_score` | integer | ✅ |
| C-SSRS score | Wizard/Number | `cssrs_score` | integer | ✅ |
| WHOQOL score | *(dropped)* | ~~`whoqol_score`~~ | — | ❌ Column dropped from scope |
| PSQI score | *(dropped)* | ~~`psqi_score`~~ | — | ❌ Column dropped from scope |

---

## Summary: Wiring Status Counts

| Status | Count |
|---|---|
| ✅ Fully wired | ~28 fields |
| ⚠️ Partial / wrong type | ~8 fields |
| 🆕 Needs new table/column | ~20 fields |
| ❌ Not wired or dropped | ~10 fields |

> Priority order for wiring: 🆕 new (schema first) → ⚠️ partial fixes → ❌ new features
