# PPN Portal — Master Plan for Database Reset and Rebuild
_Last revised: March 8, 2026_
_Format: Markdown handoff for a fresh chat_

## 1. Mission

This project will use a controlled reset of selected log tables rather than a patch-by-patch rescue.

The goal is to:
1. preserve the current organized UI where possible
2. rebuild the broken database layer underneath it
3. reconnect the UI to the corrected schema one workflow at a time
4. avoid major UI redesign
5. use the durable long-term model, not temporary patches

## 2. Source-of-truth hierarchy

Use this hierarchy in every future chat:

1. `REBUILD_SQL_Implementation_Plan_3-8-26.md` = authoritative master spec
2. `REBUILD_Db_Dict_Log_Tables.md` = final-state log table dictionary
3. `REBUILD_Db_Dict_Ref_Tables.md` = final-state reference table dictionary
4. `REBUILD_UI_Field_Map_to_SQL_3-8-26.md` = current UI-to-database mapping and wiring status

If a contradiction appears, the implementation plan wins.

## 3. Locked architectural decisions

### D1. Timeline event vocabulary
- `log_session_timeline_events.event_type_id`
- foreign key to `ref_flow_event_types`
- do not create `ref_timeline_event_types`

### D2. `log_user_sites` primary key
- composite primary key: `(user_id, site_id)`

### D3. Dosage naming
- `dosage_amount` on `log_clinical_records`
- `dose_mg` on `log_dose_events`

### D4. Array fields
- arrays are allowed only where explicitly labeled intentional or temporary
- they are a conscious compromise for UI fidelity
- they are not assumed to have per-element foreign-key enforcement

### D5. Event-system separation
- `log_patient_flow_events` = workflow milestones only
- `log_session_timeline_events` = live in-session ledger only
- these are not dual-purpose tables

## 4. Canonical identity model

### 4.1 Core IDs
- `user_id` comes from Supabase Auth
- `site_id` comes from `log_user_sites`
- `patient_uuid` is the canonical internal patient identifier
- `patient_link_code` is the human-visible PT-style code

### 4.2 Canonical patient source of truth
`log_patient_site_links` is the canonical patient identity bridge.

It must hold:
- `patient_uuid`
- `patient_link_code`
- `site_id`
- transfer and lifecycle fields as needed

Rules:
- one canonical patient UUID per patient-site pairing
- one readable patient code per site
- the pair is created together
- no child table may receive a readable patient code where a UUID is required

### 4.3 Session traceability
`log_clinical_records` stores both:
- `patient_uuid`
- readable patient code for traceability

But `log_clinical_records` is not the source of truth for patient identity.

## 5. Product strategy for this rebuild

This is not a front-end restart.

This is a UI-preserving backend rebuild.

Meaning:
1. keep the current screens and workflow structure
2. rebuild the selected broken log tables so they align to the UI
3. reconnect one screen flow at a time
4. temporarily defer features that are structurally wrong or intentionally out of scope

## 6. Table classification

### 6.1 Keep as-is or near-as-is
Keep these unless a specific defect is found:
- `log_sites`
- `log_user_sites`
- `log_user_profiles`
- `log_patient_site_links`
- `log_patient_flow_events`
- `log_session_timeline_events`
- `log_dose_events`
- `log_pulse_checks`
- `log_safety_events`
- `log_red_alerts`
- `log_corrections`
- `log_protocols`
- subscription, feature, usage, waitlist, and support infrastructure tables
- all `ref_*` tables unless explicitly modified by the master spec

### 6.2 Modify
Modify these per the master spec:
- `log_clinical_records`
- `log_session_vitals`
- `log_integration_sessions`
- `log_longitudinal_assessments`
- `log_baseline_assessments`
- `log_dose_events`

### 6.3 Create
Create these new log tables:
- `log_patient_profiles`
- `log_patient_indications`
- `log_patient_psychospiritual_history`
- `log_phase1_consent`
- `log_phase1_safety_screen`
- `log_phase1_set_and_setting`
- `log_phase3_meq30`

Create these new reference tables:
- `ref_intention_themes`
- `ref_mindset_types`
- `ref_session_settings`
- `ref_protocol_archetypes`
- `ref_attendance_statuses`
- `ref_consciousness_levels`
- `ref_dosing_relatedness`

### 6.4 Delete
Drop these entirely:
- `log_interventions`
- `log_outcomes`
- `log_session_observations`
- `log_baseline_observations`
- `log_consent`
- `log_safety_event_observations`

### 6.5 Defer
Do not reconnect these in the first rebuild path:
- `log_behavioral_changes`
- any UI features still depending on undefined vocabularies or free-text anti-patterns

## 7. Database rebuild principles

1. Preserve good reference data
2. Reset only selected broken log tables
3. Prefer rebuilding over incremental rescue where the current table design is wrong
4. Do not weaken relational rules just to make test cleanup easier
5. Do not add `ON DELETE CASCADE` casually to clinical log relationships
6. Use SQL, not the Supabase table editor, for structural changes
7. Use the same repeatable SQL approach in staging and production-like test environments

## 8. Controlled reset strategy

Because existing data is broken test data and not trusted, the reset should be deliberate.

### 8.1 Before reset
- confirm the selected tables to reset
- confirm that reference tables and auth/site membership tables are preserved
- confirm there is no real production data that must be migrated

### 8.2 Reset approach
- delete child rows before parent rows, or
- use a targeted `TRUNCATE ... CASCADE` only in a disposable test environment

Do not change foreign-key delete behavior just because test cleanup is inconvenient.

## 9. Pre-migration gates

Do not run migrations until these are true:

### Gate 1. The implementation plan is final
The implementation plan must remain the single authoritative spec.

### Gate 2. UI field map matches the master spec
The UI field map must be aligned to:
- `event_type_id` and `ref_flow_event_types`
- `dosage_amount` vs `dose_mg`
- correct safety-event field naming
- all currently deferred or local-only fields clearly labeled

### Gate 3. FK type audit is complete
Every log-table foreign-key column type must exactly match the referenced reference-table key type.

Watch for:
- `integer` vs `bigint`
- `uuid` vs text
- any old `varchar` or mislabeled code columns

### Gate 4. Verification queries are updated
Verification rules must match the actual migration plan.

## 10. Migration phases

### Phase A — Freeze and backup
1. freeze schema work outside this plan
2. export or save current DDL for reference
3. preserve the current UI codebase
4. preserve the final planning docs

### Phase B — Controlled reset of selected log tables
Reset only the selected disposable broken log tables in dependency-safe order.

### Phase C — Identity layer
Confirm and enforce:
- `log_patient_site_links` as canonical patient identity
- unique patient UUID
- unique `(site_id, patient_link_code)`
- correct site-level RLS

### Phase D — Patient profile layer
Create:
- `log_patient_profiles`
- `log_patient_indications`
- `log_patient_psychospiritual_history`

### Phase E — Session layer
Modify `log_clinical_records` so it supports:
- `patient_uuid`
- readable code for traceability
- `session_setting_id`
- `mindset_type_id`
- `intention_theme_ids`
- `dosage_amount`
- removal of deprecated or replaced fields

### Phase F — Phase 1 tables
Create or modify:
- `log_baseline_assessments`
- `log_phase1_consent`
- `log_phase1_safety_screen`
- `log_phase1_set_and_setting`

### Phase G — Phase 2 tables
Confirm or modify:
- `log_session_vitals`
- `log_session_timeline_events`
- `log_dose_events`
- `log_safety_events`

### Phase H — Phase 3 tables
Create or modify:
- `log_integration_sessions`
- `log_longitudinal_assessments`
- `log_phase3_meq30`

### Phase I — Verification
Run schema verification, FK verification, RLS verification, and UI-path smoke tests.

## 11. Key field rules

### 11.1 `patient_uuid`
- canonical internal FK
- source of truth lives in `log_patient_site_links`
- not unique on `log_clinical_records`
- should be indexed on session-linked tables

### 11.2 readable patient code
- human-facing only
- stored for traceability where needed
- never sent into UUID columns

### 11.3 session identity
- `log_clinical_records` is the session parent
- child tables attach to either `session_id`, `patient_uuid`, or both, per the spec

### 11.4 event systems
- milestone events and live-session events stay separate

## 12. Performance and long-term sustainability

### 12.1 High-volume logs
For large session and monitoring tables:
- treat them as append-only logs
- use summary views or materialized views later for dashboards
- index only what is actually queried
- avoid unnecessary JSON for core analytical fields

### 12.2 Recommended indexing focus
Expect to index:
- `patient_uuid`
- `session_id`
- `site_id`
- `event_timestamp`
- `recorded_at`
- combinations such as `(patient_uuid, session_date)` where justified

### 12.3 Do not optimize prematurely
Do not partition tables yet unless real scale justifies it later.
But do make sure all time-series tables have timestamps and clean keys.

## 13. Acceptance criteria for database rebuild

The database rebuild is not done until:

1. patient identity is canonical and stable
2. session creation writes correctly
3. Phase 1 data writes correctly
4. Phase 2 vitals and timeline writes correctly
5. child tables no longer mix patient code with patient UUID
6. workflow milestones and live session events are separated cleanly
7. UI field map matches actual schema
8. no known ghost-save flows remain in the critical path

## 14. Fresh-chat starter note

Use this summary when opening a new chat:

We are doing a UI-preserving controlled reset of selected log tables for the PPN Portal Wellness Journey module. The implementation plan file is the authoritative spec. `log_patient_site_links` is the canonical patient identity table. `log_clinical_records` is the session table and stores both `patient_uuid` and readable patient code for traceability, but is not the source of truth for patient identity. `log_patient_flow_events` stores workflow milestones only. `log_session_timeline_events` stores live in-session ledger events only. Timeline uses `event_type_id` to `ref_flow_event_types`. `log_user_sites` uses composite PK `(user_id, site_id)`. Dosage naming is `dosage_amount` on `log_clinical_records` and `dose_mg` on `log_dose_events`. Preserve the current organized UI where possible and rebuild the database underneath it.

