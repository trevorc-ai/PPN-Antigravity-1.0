# PPN Portal — Master Plan for Cursor UI and Reconnection Work
_Last revised: March 8, 2026_
_Format: Markdown handoff for a fresh chat_

## 1. Mission

Cursor is not being asked to redesign the product.

Cursor is being used to:
1. preserve the current organized UI
2. reconnect it to the corrected database
3. remove ghost or misleading save behavior
4. implement changes one vertical slice at a time
5. avoid autonomous schema invention

## 2. Absolute rules for Cursor

1. Do not redesign the UI unless explicitly instructed
2. Do not invent new database fields or tables
3. Do not write migrations unless explicitly instructed
4. The implementation plan is the authoritative spec
5. The UI field map must match the master spec
6. If a field is not supported by the locked schema, fail clearly or mark it deferred
7. No readable patient code may ever be sent into a UUID column
8. Do not hardcode numeric reference IDs unless the database spec explicitly requires it
9. Use existing screens and workflows where possible
10. Reconnect one flow at a time

## 3. Source-of-truth hierarchy for Cursor

1. `REBUILD_SQL_Implementation_Plan_3-8-26.md`
2. `REBUILD_UI_Field_Map_to_SQL_3-8-26.md`
3. `REBUILD_Db_Dict_Log_Tables.md`
4. `REBUILD_Db_Dict_Ref_Tables.md`

If anything conflicts, the implementation plan wins.

## 4. UI preservation principle

The front end is not being restarted.

The job is:
- keep the current screens
- keep the current routing and screen organization where possible
- reconnect data writes and reads to the corrected schema
- disable only the features that are structurally deferred or intentionally out of scope

## 5. Core application model Cursor must follow

### 5.1 Identity
- `patient_link_code` is the readable PT-style code shown in the UI
- `patient_uuid` is the canonical internal patient key
- `site_id` comes from authenticated practitioner site membership
- `log_patient_site_links` is the source of truth for patient identity

### 5.2 Session
- `log_clinical_records` is the parent session row
- session creation happens only after the canonical patient is created or resolved

### 5.3 Event systems
- workflow milestones go to `log_patient_flow_events`
- live session actions go to `log_session_timeline_events`
- do not blur those together

### 5.4 Dosage naming
- `dosage_amount` on `log_clinical_records`
- `dose_mg` on `log_dose_events`

## 6. Development sequence for Cursor

Cursor should be used in this order.

### Phase 0 — Prep
1. remove or isolate old drifted assumptions in service files
2. centralize shared DB contract types
3. add temporary debug logging around each write path
4. do not modify unrelated UI

### Phase 1 — Identity and patient selection
Goal: the UI can select or create a patient correctly.

Required work:
1. implement or use a canonical helper that resolves or creates:
   - `patient_link_code`
   - `site_id`
   - `patient_uuid`
2. ensure New Patient flow creates or resolves the canonical patient first
3. ensure Existing Patient flow resolves the canonical patient correctly
4. store both readable patient code and `patient_uuid` in journey state/context

Acceptance criteria:
- selecting a patient produces a stable `patient_uuid`
- no form downstream needs to guess or invent patient identity

### Phase 2 — Session creation
Goal: the parent session row is created cleanly.

Required work:
1. update `createClinicalSession`
2. ensure the insert payload is minimal and schema-accurate
3. include:
   - `patient_uuid`
   - readable patient code
   - `site_id`
   - `practitioner_id`
   - `session_date`
4. remove non-schema legacy fields
5. fail clearly if required site or patient identity is missing

Acceptance criteria:
- `log_clinical_records` receives a valid new row
- no outdated payload fields are sent

### Phase 3 — Phase 1 Preparation
Goal: all core preparation forms save to the correct tables.

#### 3.1 Consent
Target: `log_phase1_consent`

#### 3.2 Safety screen
Target: `log_phase1_safety_screen`

#### 3.3 Set and setting
Target: `log_phase1_set_and_setting`

#### 3.4 Mental health / baseline
Target: `log_baseline_assessments`

Rules:
- PCL-5 must not remain local-only if the spec says it belongs in baseline
- if a field is deferred, the UI must say so clearly
- do not mark a form complete when a required write failed

Acceptance criteria:
- each Phase 1 form writes to its correct table
- completion logic reflects real persistence

### Phase 4 — Phase 2 Dosing Session
Goal: live session UI writes to the corrected session tables.

#### 4.1 Dosing protocol
Target:
- update `log_clinical_records`
- use `dosage_amount`

#### 4.2 Additional dose / booster
Target:
- `log_dose_events`
- use `dose_mg`

#### 4.3 Session vitals
Target:
- `log_session_vitals`
- use `consciousness_level_id`, not old free text

#### 4.4 Session timeline
Target:
- `log_session_timeline_events`
- use `event_type_id`
- vocabulary comes from `ref_flow_event_types`
- do not hardcode invented codes or guessed numeric IDs

#### 4.5 Safety and adverse events
Target:
- `log_safety_events`
- use correct FK field names from the spec
- do not confuse safety event fields with timeline event fields

Acceptance criteria:
- all Phase 2 core forms save successfully
- timeline and safety events are not mixed
- booster dose writes use `dose_mg`

### Phase 5 — Phase 3 Integration and follow-up
Goal: reconnect the approved Phase 3 tables without reviving deferred complexity.

Targets:
- `log_integration_sessions`
- `log_longitudinal_assessments`
- `log_phase3_meq30`

Rules:
- only reconnect what the master spec says is in scope
- do not revive deferred tables or free-text anti-patterns

Acceptance criteria:
- Phase 3 writes use `patient_uuid`
- no readable patient code is sent into UUID columns

### Phase 6 — Ghost-save cleanup
Goal: no critical UI element claims to save data unless it actually persists.

Actions:
1. find save flows that are local-only or stubbed
2. relabel, disable, or defer them
3. prevent fake completion states
4. make user-facing error messaging clear and plain-English

## 7. Required service-layer cleanup

Cursor should centralize and standardize:
1. identity resolution helpers
2. session creation service
3. Phase 1 write services
4. Phase 2 write services
5. shared DB type contracts
6. read-model field names to match the rebuilt schema

## 8. Read/write contract rules

### 8.1 Never do these
- never send readable patient code into a UUID field
- never send non-schema fields to Supabase
- never hardcode reference IDs unless explicitly approved
- never silently omit critical identity linkage and still claim success

### 8.2 Always do these
- validate required identity inputs before insert
- log final payloads and full Supabase errors during rebuild
- fail clearly when a required FK cannot be resolved
- keep user-facing wording plain

## 9. Deferred UI features

These can stay visible only if clearly deferred or disabled:
- behavioral changes
- speculative observation tables
- any form whose table is intentionally deferred
- any feature still depending on undefined reference vocabularies

Do not let deferred features appear fully functional.

## 10. Suggested execution order for Cursor chats

This is the order to use in fresh chats:

1. identity + patient selection
2. parent session creation
3. Phase 1 forms
4. Phase 2 dosing protocol
5. Phase 2 vitals
6. Phase 2 timeline
7. Phase 2 safety events
8. Phase 3 integration and follow-up
9. ghost-save cleanup and completion-state cleanup

## 11. Acceptance checklist

The UI reconnection work is not done until:

1. patient creation or resolution works
2. session creation works
3. Phase 1 forms save to the correct tables
4. Phase 2 vitals and timeline save correctly
5. dose events use the correct naming
6. safety events use the correct table and fields
7. Phase 3 forms use `patient_uuid`
8. completion states reflect real persistence
9. deferred features are clearly marked
10. no critical console errors remain in the repaired flows

## 12. Fresh-chat starter note

Use this summary when opening a new Cursor-related chat:

We are preserving the current organized UI and reconnecting it to the corrected PPN Portal database. Do not redesign the product. The implementation plan is the authoritative spec. `log_patient_site_links` is the canonical patient identity bridge. `log_clinical_records` is the session parent table. Workflow milestones go to `log_patient_flow_events`. Live in-session ledger events go to `log_session_timeline_events` using `event_type_id` to `ref_flow_event_types`. Dosage naming is `dosage_amount` on `log_clinical_records` and `dose_mg` on `log_dose_events`. New and existing patient flows must resolve a canonical `patient_uuid` before session creation. No readable patient code may ever be sent into a UUID column. Reconnect one screen flow at a time, add debug logging during rebuild, and do not invent schema changes.

## 13. Optional prompt discipline for future chats

When using a fresh chat with Cursor or ChatGPT, use this format:

1. objective
2. source-of-truth files
3. exact scope boundary
4. do-not-touch list
5. success criteria
6. requested output format

This keeps the work surgical and prevents drift.

