# WO-603 — DB Write Gaps: Null Fields After Full Session

**Status:** 01_TRIAGE
**Priority:** P1 — HIGH (data integrity)
**Author:** INSPECTOR
**Date:** 2026-03-10
**Source:** QA Session 03-10, screenshots-database-after-second-turn-03-10

---

## Problem

After two complete Wellness Journey sessions, DB analysis reveals multiple fields that should have been written but are NULL. These gaps will silently degrade analytics and reporting quality.

## Confirmed NULL Fields by Table

| Table | Null Fields | Impact |
|---|---|---|
| `log_phase1_safety_screen` | `contraindication_verdict_id`, `ekg_rhythm_id`, `contraindications_confirmed` = `[]` | Contraindication check has no data to check against |
| `log_phase1_set_and_setting` | `intention_theme_ids` = `[]`, `mindset_type_id` = NULL | Set & setting form not writing multi-select values |
| `log_clinical_records` | `protocol_id`, `dosage_amount`, `outcome_score` all NULL | Dosing data not fully writing to parent record |
| `log_session_timeline_events` | `performed_by` = NULL for all 34 rows | No practitioner linkage on timeline events |
| `log_patient_profiles` | `weight_range_id` = NULL; duplicate rows for same `patient_uuid` | Weight not saving; duplicate profiles being created |
| `log_patient_indications` | `created_by` = NULL; duplicate entries per patient | Indication form creates duplicates on re-entry |
| `log_user_profiles` | `first_name`, `last_name` = NULL for one user | Practitioner profile incomplete |
| `log_baseline_assessments` | PHQ9, GAD7, ACE, PCL5 all NULL despite expectancy having values | Baseline form only partially writing |

## Priority Fixes

1. **Safety Screen write path** — `contraindication_verdict_id` must be set (needed for WO-596 fix)
2. **Set & Setting multi-select** — `intention_theme_ids` and `mindset_type_id` must write correctly
3. **Duplicate profile prevention** — `log_patient_profiles` must upsert, not insert, per `patient_uuid`
4. **Baseline assessment completeness** — all scored fields must write when form is submitted

## Acceptance Criteria

- [ ] After a complete session, all fields listed above are populated in the DB
- [ ] No duplicate rows in `log_patient_profiles` or `log_patient_indications` for the same patient
- [ ] `performed_by` is set on all timeline events
- [ ] DB audit query (from WO-594 Step 8) remains green after these fixes
