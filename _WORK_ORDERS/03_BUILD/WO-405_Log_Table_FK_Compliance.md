---
id: WO-405
title: "Log Table FK Compliance — Full Schema Audit & Remediation Plan"
status: 03_BUILD
owner: SOOP
created: 2026-02-23
updated: 2026-02-23T10:46 PST
created_by: LEAD
failure_count: 0
priority: P0
tags: [database, data-governance, fk-compliance, log-tables, architecture-constitution, schema-audit]
user_prompt: |
  "I noticed that some queries are writing data directly to log tables, rather than writing
  reference codes. Everything written to a log table should be pulled from a reference table.
  Also, there are data fields in the log tables now that need to be cleaned out because they
  have data written directly to them, rather than reference codes. Where does this fall in
  the workflow? Are we wiping all test data and rebuilding? And how does the baseline data
  that ANALYST researched play in?"
governance_questions_pending: true
governance_answers_received: false
---

# WO-405: Log Table FK Compliance — Full Schema Audit & Remediation Plan

---

## SECTION 0: HANDOFF CONTEXT (Read First — New Agent Orientation)

### Project Identity
- **Product:** PPN Portal — Psychedelic Practitioners Network
- **Stack:** React + TypeScript + Vite (frontend) | Supabase (PostgreSQL backend) | Row Level Security enabled
- **Codebase root:** `/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/`
- **Dev server:** `npm run dev` (running, hot-reload active)
- **Git:** All work committed to `main` branch, pushed to remote

### Your Role in This Chat
You are **SOOP — Senior SQL Database Architect**. Your only job in this chat is:
1. Collect USER answers to the three governance questions (Section 4)
2. Finalize the Wave 1 SQL based on those answers
3. Hand the final SQL to USER to execute in Supabase
4. You do NOT execute SQL yourself. USER runs it.
5. After USER confirms Wave 1 success, draft Wave 2 SQL and repeat.

### Immutable Rules (Architecture Constitution — violations = immediate STOP)
1. **Additive migrations only.** Never use `DROP TABLE`, `DROP COLUMN`, `ALTER COLUMN TYPE`. Only `CREATE TABLE IF NOT EXISTS` and `ALTER TABLE ADD COLUMN IF NOT EXISTS`.
2. **RLS required.** Every new table must have `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;` immediately after creation.
3. **snake_case only.** All table names and column names in lowercase snake_case.
4. **No PHI in log payloads.** Never write `patient_id` or any real identifier into JSONB blobs or audit log fields. Patient reference = `patient_link_code` (anonymized token).
5. **You write. USER executes.** Post SQL as a code block. USER pastes it into Supabase SQL Editor and reports the result back to you.

### Critical FK Reference Map (verified from live schema 2026-02-23)
These are the EXACT primary key column names from the live ref_ tables. Use these — not guesses:

| Ref Table | PK Column Name | PK Type |
|-----------|---------------|---------|
| `ref_severity_grade` | `severity_grade_id` | BIGINT |
| `ref_resolution_status` | `resolution_status_id` | BIGINT |
| `ref_substances` | `substance_id` | BIGINT |
| `ref_routes` | `route_id` | BIGINT |
| `ref_indications` | `indication_id` | BIGINT |
| `ref_safety_events` | `safety_event_id` | BIGINT |
| `ref_user_roles` | `id` | INTEGER |
| `ref_intervention_types` | `intervention_type_id` | INTEGER |
| `ref_meddra_codes` | `meddra_code_id` | INTEGER |
| `ref_behavioral_change_types` | `change_type_id` | INTEGER |
| `ref_cancellation_reasons` | `cancellation_reason_id` | INTEGER |
| `ref_flow_event_types` | `id` | BIGINT |

### Current Status at Time of Handoff (2026-02-23 10:48 PST)
- [x] Full schema audit complete (all log_ and ref_ tables — see sections below)
- [x] Violations categorized by severity (Sections 1, 2, 3)
- [x] Wave 1 SQL drafted (Section 8) — **DRAFT ONLY, not finalized**
- [ ] **BLOCKED:** Three governance questions (Section 4) not yet answered by USER
- [ ] Wave 1 SQL not yet finalized or executed
- [ ] Data reset not yet run
- [ ] BUILDER code fixes not yet written

### What to Do First in This Chat
Open by saying: "I have the full WO-405 schema audit in context. Before I finalize the Wave 1 SQL,
I need your answers to 3 governance questions about free-text columns. Ready when you are."
Then present Q1, Q2, Q3 from Section 4 clearly, one at a time.

---

## CONTEXT

This WO captures the complete forensic output of SOOP's pre-flight schema analysis conducted
2026-02-23. SOOP reviewed **every column in every log_ and ref_ table** before proposing any SQL.
**No SQL will be finalized until governance questions in Section 4 are answered by USER.**

**Live Schema Snapshot Date:** 2026-02-23

---

## SECTION 1: CRITICAL VIOLATIONS — Ref tables exist but text is still being written

> These require ZERO new tables. The infrastructure exists. Code is just not using it.
> Each entry needs: (a) additive FK integer column added, and (b) code fixed to write FK.

| Table | Violating Column | Current Type | Correct Approach | Ref Table (Already Exists) |
|-------|-----------------|-------------|-----------------|---------------------------|
| `log_safety_events` | `severity_grade_id` | **TEXT** ❌ | Add `severity_grade_fk INTEGER` → `ref_severity_grade.severity_grade_id` | `ref_severity_grade` ✅ |
| `log_safety_events` | `resolution_status_id` | **TEXT** ❌ | Add `resolution_status_fk INTEGER` → `ref_resolution_status.resolution_status_id` | `ref_resolution_status` ✅ |
| `log_chain_of_custody` | `substance` | TEXT NOT NULL ❌ | Add `substance_id BIGINT` → `ref_substances.substance_id` | `ref_substances` ✅ |
| `log_chain_of_custody` | `route` | TEXT ❌ | Add `route_id BIGINT` → `ref_routes.route_id` | `ref_routes` ✅ |
| `log_clinical_records` | `dosage_route` | VARCHAR ❌ | Column is ghost — `route_id BIGINT` already exists on same table. Stop writing `dosage_route`. | `ref_routes` ✅ |
| `log_clinical_records` | `safety_event_category` | VARCHAR ❌ | Add `safety_event_id BIGINT` (already exists on table as bigint) — stop writing text column | `ref_safety_events` ✅ |
| `log_protocols` | `substance` | TEXT NOT NULL ❌ | Add `substance_id BIGINT` → `ref_substances.substance_id` | `ref_substances` ✅ |
| `log_protocols` | `indication` | TEXT ❌ | Add `indication_id BIGINT` → `ref_indications.indication_id` | `ref_indications` ✅ |
| `log_red_alerts` | `alert_severity` | VARCHAR NOT NULL ❌ | Add `severity_grade_id BIGINT` → `ref_severity_grade.severity_grade_id` | `ref_severity_grade` ✅ |
| `log_user_sites` | `role` | TEXT NOT NULL ❌ | Add `role_id INTEGER` → `ref_user_roles.id` | `ref_user_roles` ✅ |

**Note on `log_safety_events` IDs:** `ae_id`, `exposure_id`, `event_id` are all TEXT type primary
key / reference IDs. These cannot be changed in place. The code writes `crypto.randomUUID()` as
a string into the text PK — this works but is non-standard. **Leave as-is.** Flag for future
schema redesign only.

---

## SECTION 2: MISSING REF TABLES — Must create before FK columns can reference them

> These 4 tables do not exist. They must be created + seeded before the FK columns are added.

### 2a. `ref_session_types` ❌ MISSING
**Used by:** `log_clinical_records.session_type` (VARCHAR NOT NULL)  
**Required rows (minimum seed):**

| id | session_code | session_label |
|----|-------------|---------------|
| 1 | `PREPARATION` | Preparation Session |
| 2 | `DOSING` | Dosing Session |
| 3 | `INTEGRATION` | Integration Session |
| 4 | `BASELINE` | Baseline Assessment |
| 5 | `FOLLOW_UP` | Follow-Up Session |
| 6 | `SCREENING` | Screening Visit |

---

### 2b. `ref_crisis_event_types` ❌ MISSING
**Used by:** `log_red_alerts.alert_type` (VARCHAR NOT NULL), `CrisisLogger.tsx` EventType enum  
**Required rows — must match CrisisLogger EventType enum exactly:**

| id | event_code | label | severity_tier |
|----|-----------|-------|--------------|
| 1 | `DOSE_ADMINISTERED` | Dose Administered | 1 |
| 2 | `VITAL_SIGNS_NORMAL` | Vital Signs Normal | 1 |
| 3 | `VITAL_SIGNS_ELEVATED` | Vital Signs Elevated | 2 |
| 4 | `VERBAL_DEESCALATION` | Verbal De-escalation Applied | 2 |
| 5 | `PHYSICAL_COMFORT` | Physical Comfort Provided | 1 |
| 6 | `MUSIC_ADJUSTMENT` | Music Adjusted | 1 |
| 7 | `LIGHTING_ADJUSTMENT` | Lighting Adjusted | 1 |
| 8 | `HYDRATION_PROVIDED` | Hydration Provided | 1 |
| 9 | `TRIP_KILLER_BENZO` | Rescue Med: Benzodiazepine | 3 |
| 10 | `TRIP_KILLER_ANTIPSYCHOTIC` | Rescue Med: Antipsychotic | 3 |
| 11 | `EMERGENCY_CONTACT_NOTIFIED` | Emergency Contact Notified | 2 |
| 12 | `EMERGENCY_SERVICES_CALLED` | Emergency Services Called (911) | 3 |
| 13 | `SESSION_TERMINATED_EARLY` | Session Terminated Early | 3 |

---

### 2c. `ref_system_action_types` ❌ MISSING
**Used by:** `log_system_events.event_type` (TEXT NOT NULL)  
**Required rows (minimum seed):**

| id | action_code | label |
|----|-----------|-------|
| 1 | `data_export` | Full Data Export |
| 2 | `patient_export` | Patient-Specific Export |
| 3 | `session_export` | Session Export |
| 4 | `audit_view` | Audit Log Viewed |
| 5 | `settings_change` | Settings Modified |
| 6 | `login` | User Login |
| 7 | `logout` | User Logout |

---

### 2d. `ref_consent_types` ❌ MISSING
**Used by:** `log_consent.type` (TEXT nullable)  
**Required rows (minimum seed):**

| id | consent_code | label |
|----|-------------|-------|
| 1 | `INFORMED_CONSENT` | Informed Consent |
| 2 | `DATA_USE` | Data Use Agreement |
| 3 | `PHOTO_VIDEO` | Photo/Video Consent |
| 4 | `RESEARCH_PARTICIPATION` | Research Participation |
| 5 | `EMERGENCY_CONTACT` | Emergency Contact Authorization |

---

## SECTION 3: GOVERNANCE DECISION REQUIRED — Free-text clinical narrative columns

> SOOP will NOT write SQL for these until USER answers Q1 in Section 4.
> These columns hold open-ended clinical text in log_ tables — Architecture Constitution violation.

### 3a. `log_clinical_records.session_notes` — TEXT, nullable
- Column exists in DB schema
- Unknown if currently being written from app
- **Options:** (A) Never write from app — UI-ONLY display only | (B) Deprecate — replace with `ref_` structured observations FK array | (C) Keep as audit text — add governance exception comment

### 3b. `log_clinical_records.contraindication_override_reason` — TEXT, nullable
- Column exists in DB schema
- `RiskEligibilityReport.tsx` textarea had UI-ONLY comment added — but DB column exists
- **Critical question:** Is this column currently being persisted? If yes, it is an active violation.
- **Options:** Same A/B/C as above

### 3c. `log_behavioral_changes.change_description` — TEXT, NOT NULL
- NOT NULL means something IS writing this column
- `change_type_ids ARRAY` (the correct FK pattern) already exists alongside it
- **Likely:** Legacy code path still writing the text column in parallel with the new FK array
- **Options:** (A) Set NOT NULL constraint to nullable via additive nullable column | (B) Find write path and stop it

### 3d. `log_behavioral_changes.change_type` — VARCHAR, NOT NULL
- Ghost column — `change_type_ids ARRAY` is the correct replacement already on the table
- NOT NULL means something is writing it
- **Action needed:** Identify write path, stop writing to text column

### 3e. `log_consent.timestamp` — TEXT, nullable
- Type is TEXT, not a timestamp
- `verified_at TIMESTAMP WITH TIME ZONE` already exists on same table (correct column)
- **Action:** Stop writing to `timestamp` text column. Use `verified_at` only.

---

## SECTION 4: GOVERNANCE QUESTIONS — USER MUST ANSWER BEFORE SQL IS WRITTEN

**Q1 — Free-text narrative columns (3a, 3b, 3c, 3d above):**
Choose for each:
- (A) `UI-ONLY — never persisted to DB going forward. Code will be updated to stop all writes.`
- (B) `Replace with structured FK alternative from existing ref_ table.`
- (C) `Governance exception — keep as-is with documented rationale.`

> USER RESPONSE: _________________________

**Q2 — Migration wave approach:**
SOOP recommends 3 waves to reduce risk. Confirm:
- Wave 1 (P0 — do now): Create 4 missing ref_ tables + seed + add FK columns to `log_red_alerts` + fix CrisisLogger + AdverseEventLogger + exportService code
- Wave 2 (P1 — next sprint): Fix `log_safety_events` FK type mismatch, `log_chain_of_custody`, `log_clinical_records` ghost columns, `log_protocols`
- Wave 3 (P2 — before beta): `log_user_sites.role`, `log_consent`, remaining ghost column cleanup

> USER RESPONSE: _________________________

**Q3 — Data reset (TRUNCATE):**
Given violations span 15+ clinical log tables, confirm SOOP should write a TRUNCATE script for:

**Tables to TRUNCATE (test data only — all clinical records):**
```
log_baseline_assessments, log_baseline_observations, log_behavioral_changes,
log_chain_of_custody, log_clinical_records, log_consent, log_integration_sessions,
log_interventions, log_longitudinal_assessments, log_outcomes, log_patient_flow_events,
log_protocols, log_pulse_checks, log_red_alerts, log_safety_events,
log_safety_event_observations, log_session_observations, log_session_timeline_events,
log_session_vitals, log_system_events
```

**Tables to KEEP (do NOT truncate):**
```
ref_* (all reference tables — never wipe)
log_sites (clinic registrations)
log_user_profiles (user accounts)
log_user_sites (user-site membership)
log_subscriptions, log_user_subscriptions (billing)
log_feature_flags (config)
log_vocabulary_requests (governance inbox)
log_corrections (audit trail)
```

> USER RESPONSE: _________________________

---

## SECTION 5: ANALYST BASELINE DATA — Where It Fits

ANALYST's public research outcomes data divides into two separate streams:

**Stream A — Reference Vocabulary Seed Data**
- Substance names, mechanisms, receptor data → seeds already-existing `ref_substances` table
- MedDRA codes → seeds `ref_meddra_codes` table
- Indication vocabulary → seeds `ref_indications` table
- This is Sprint A data seeding pipeline (WO-231)
- Goes in AFTER Wave 1 migrations, AFTER data reset
- ANALYST + SOOP execute this together

**Stream B — Global Benchmark Outcomes Data**
- Published aggregate outcomes from psychedelic therapy studies
- Population norms for PHQ9, GAD7, MEQ30
- Does NOT go into log_ tables
- Goes into separate `benchmark_*` tables (to be scoped in WO-231)
- Is the data layer for Global Benchmark Intelligence analytics panel
- ANALYST designs query; SOOP creates tables; goes in after ref_ seeding complete

---

## SECTION 6: CODE FIXES REQUIRED (BUILDER — after Wave 1 migrations confirmed)

### Fix 1: `CrisisLogger.tsx`
- Look up `ref_crisis_event_types.id` by `event_code` before insert
- Write `crisis_event_type_id` integer FK to `log_red_alerts`
- Remove string literal `alert_type` write
- Map severity (tier 3 = severe, tier 2 = moderate, tier 1 = mild) → `severity_grade_id` FK

### Fix 2: `AdverseEventLogger.tsx`
- Remove ALL `String()` wrappers from integer IDs
- Field mapping: `alert_type_id` (not `alert_type: String(...)`)
- Field mapping: `alert_message_id` (not `alert_message: String(...)`)
- Field mapping: `response_notes_id` (not `response_notes: String(...)`)

### Fix 3: `exportService.ts`
- Add `action_type_id` FK lookup before insert to `log_system_events`
- Remove `patient_id` from `event_details` JSONB payload
- Stop writing `event_type` string — write `event_type_id` FK instead

---

## SECTION 7: ADDITIONAL SCHEMA OBSERVATIONS (Non-blocking, for future reference)

1. **`log_clinical_records` is bloated.** 100+ columns on one table. This is a God Table anti-pattern.
   Long-term: consider decomposing into `log_dosing_sessions`, `log_session_assessments`,
   `log_session_notes` (separate, append-only). Not for this sprint — document only.

2. **`log_behavioral_changes` has both old and new schema on the same table.**
   Old: `change_type` VARCHAR + `change_description` TEXT + `change_category` VARCHAR
   New: `change_type_ids ARRAY` + `confidence_sustaining` INTEGER
   The old columns appear to be legacy from two previous migration passes.

3. **`log_interventions.demographics`, `.protocol`, `.context`, `.safety_events`** are all JSONB
   freeform blobs. Unknown what's being written into them. SOOP to flag for investigation
   in Wave 2 pre-flight.

4. **`log_patient_flow_events.notes`** — TEXT nullable. Appears to be a session note field
   on the patient flow event. Needs governance decision (same as Q1).

5. **`log_session_timeline_events`** already has BOTH:
   - `event_type` VARCHAR NOT NULL (ghost text column)
   - `event_type_id` INTEGER nullable (correct FK column)
   Code should stop writing to `event_type` immediately. No migration needed — FK column exists.

---

## SECTION 8: WAVE 1 MIGRATION SQL (Draft — pending governance answers)

> Status: DRAFT — will be finalized after Q1, Q2, Q3 answers received from USER.
> USER executes this in Supabase SQL Editor. SOOP does not execute.

```sql
-- ============================================================
-- WAVE 1 MIGRATION — WO-405
-- Run ONLY after USER confirms governance answers in Section 4
-- Run ONLY in this order
-- ============================================================

-- Step 1: Create ref_session_types
CREATE TABLE IF NOT EXISTS ref_session_types (
    id SERIAL PRIMARY KEY,
    session_code VARCHAR(40) NOT NULL UNIQUE,
    session_label VARCHAR(120) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE ref_session_types ENABLE ROW LEVEL SECURITY;
INSERT INTO ref_session_types (session_code, session_label) VALUES
('PREPARATION',   'Preparation Session'),
('DOSING',        'Dosing Session'),
('INTEGRATION',   'Integration Session'),
('BASELINE',      'Baseline Assessment'),
('FOLLOW_UP',     'Follow-Up Session'),
('SCREENING',     'Screening Visit')
ON CONFLICT (session_code) DO NOTHING;

-- Step 2: Create ref_crisis_event_types
CREATE TABLE IF NOT EXISTS ref_crisis_event_types (
    id SERIAL PRIMARY KEY,
    event_code VARCHAR(60) NOT NULL UNIQUE,
    label VARCHAR(120) NOT NULL,
    severity_tier SMALLINT NOT NULL DEFAULT 1 CHECK (severity_tier BETWEEN 1 AND 3),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE ref_crisis_event_types ENABLE ROW LEVEL SECURITY;
INSERT INTO ref_crisis_event_types (event_code, label, severity_tier) VALUES
('DOSE_ADMINISTERED',           'Dose Administered',              1),
('VITAL_SIGNS_NORMAL',          'Vital Signs Normal',             1),
('VITAL_SIGNS_ELEVATED',        'Vital Signs Elevated',           2),
('VERBAL_DEESCALATION',         'Verbal De-escalation Applied',   2),
('PHYSICAL_COMFORT',            'Physical Comfort Provided',      1),
('MUSIC_ADJUSTMENT',            'Music Adjusted',                 1),
('LIGHTING_ADJUSTMENT',         'Lighting Adjusted',              1),
('HYDRATION_PROVIDED',          'Hydration Provided',             1),
('TRIP_KILLER_BENZO',           'Rescue Med: Benzodiazepine',     3),
('TRIP_KILLER_ANTIPSYCHOTIC',   'Rescue Med: Antipsychotic',      3),
('EMERGENCY_CONTACT_NOTIFIED',  'Emergency Contact Notified',     2),
('EMERGENCY_SERVICES_CALLED',   'Emergency Services Called (911)',3),
('SESSION_TERMINATED_EARLY',    'Session Terminated Early',       3)
ON CONFLICT (event_code) DO NOTHING;

-- Step 3: Create ref_system_action_types
CREATE TABLE IF NOT EXISTS ref_system_action_types (
    id SERIAL PRIMARY KEY,
    action_code VARCHAR(60) NOT NULL UNIQUE,
    label VARCHAR(120) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);
ALTER TABLE ref_system_action_types ENABLE ROW LEVEL SECURITY;
INSERT INTO ref_system_action_types (action_code, label) VALUES
('data_export',    'Full Data Export'),
('patient_export', 'Patient-Specific Export'),
('session_export', 'Session Export'),
('audit_view',     'Audit Log Viewed'),
('settings_change','Settings Modified'),
('login',          'User Login'),
('logout',         'User Logout')
ON CONFLICT (action_code) DO NOTHING;

-- Step 4: Create ref_consent_types
CREATE TABLE IF NOT EXISTS ref_consent_types (
    id SERIAL PRIMARY KEY,
    consent_code VARCHAR(60) NOT NULL UNIQUE,
    label VARCHAR(120) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);
ALTER TABLE ref_consent_types ENABLE ROW LEVEL SECURITY;
INSERT INTO ref_consent_types (consent_code, label) VALUES
('INFORMED_CONSENT',        'Informed Consent'),
('DATA_USE',                'Data Use Agreement'),
('PHOTO_VIDEO',             'Photo/Video Consent'),
('RESEARCH_PARTICIPATION',  'Research Participation'),
('EMERGENCY_CONTACT',       'Emergency Contact Authorization')
ON CONFLICT (consent_code) DO NOTHING;

-- Step 5: Add FK columns to log_red_alerts (additive only)
ALTER TABLE log_red_alerts
    ADD COLUMN IF NOT EXISTS crisis_event_type_id INTEGER REFERENCES ref_crisis_event_types(id),
    ADD COLUMN IF NOT EXISTS severity_grade_fk     BIGINT REFERENCES ref_severity_grade(severity_grade_id);

-- Step 6: Add FK column to log_system_events (additive only)
ALTER TABLE log_system_events
    ADD COLUMN IF NOT EXISTS action_type_id INTEGER REFERENCES ref_system_action_types(id);

-- Step 7: Add FK column to log_clinical_records for session_type (additive only)
ALTER TABLE log_clinical_records
    ADD COLUMN IF NOT EXISTS session_type_id INTEGER REFERENCES ref_session_types(id);

-- Step 8: Add FK column to log_consent for type (additive only)
ALTER TABLE log_consent
    ADD COLUMN IF NOT EXISTS consent_type_id INTEGER REFERENCES ref_consent_types(id);

-- ============================================================
-- END OF WAVE 1
-- Confirm success before proceeding to Wave 2
-- ============================================================
```

**Wave 2 SQL (Pending — Wave 1 must complete first):**
- `log_safety_events`: add `severity_grade_fk BIGINT`, `resolution_status_fk BIGINT`
- `log_chain_of_custody`: add `substance_id BIGINT`, `route_id BIGINT`
- `log_protocols`: add `substance_id BIGINT`, `indication_id BIGINT`
- `log_user_sites`: add `role_id INTEGER`

**Wave 3 SQL (Pending — after Wave 2):**
- Remaining ghost column cleanup
- `log_consent.timestamp` deprecation

---

## SECTION 9: DATA RESET SCRIPT (Draft — pending Q3 answer)

```sql
-- ============================================================
-- CLINICAL TEST DATA RESET — WO-405
-- Run ONLY after: Wave 1 migrations complete + BUILDER code fixes deployed
-- Run ONLY after: USER confirms Q3 in Section 4
-- This is a ONE-TIME pre-production clean slate
-- ref_ tables are explicitly excluded
-- ============================================================

TRUNCATE TABLE
    log_baseline_assessments,
    log_baseline_observations,
    log_behavioral_changes,
    log_chain_of_custody,
    log_clinical_records,
    log_consent,
    log_integration_sessions,
    log_interventions,
    log_longitudinal_assessments,
    log_outcomes,
    log_patient_flow_events,
    log_protocols,
    log_pulse_checks,
    log_red_alerts,
    log_safety_events,
    log_safety_event_observations,
    log_session_observations,
    log_session_timeline_events,
    log_session_vitals,
    log_system_events
CASCADE;

-- Verify: all tables should now return 0 rows
SELECT 'log_clinical_records' as tbl, COUNT(*) FROM log_clinical_records
UNION ALL
SELECT 'log_session_vitals', COUNT(*) FROM log_session_vitals
UNION ALL
SELECT 'log_red_alerts', COUNT(*) FROM log_red_alerts
UNION ALL
SELECT 'log_safety_events', COUNT(*) FROM log_safety_events;
```

---

## SECTION 10: SEQUENCE TO PRODUCTION-READY DATA

```
TODAY        USER answers Q1/Q2/Q3 in Section 4
TODAY        SOOP finalizes Wave 1 SQL (30 min) → USER executes in Supabase
TODAY        BUILDER fixes code: CrisisLogger + AdverseEventLogger + exportService (1 hr)
TODAY        INSPECTOR Step 5d audit on all 3 BUILDER files
TODAY        USER runs DATA RESET script in Supabase

THIS WEEK    Sprint A: ANALYST seeds ref_substances, ref_meddra_codes, ref_indications
THIS WEEK    Sprint A: ANALYST designs benchmark data model for WO-231
THIS WEEK    SOOP Wave 2 migrations
NEXT WEEK    SOOP Wave 3 cleanup
NEXT WEEK    Doctor demo with live clean data
```

---

## ACCEPTANCE CRITERIA

- [ ] USER governance answers received (Q1, Q2, Q3)
- [ ] Wave 1 migrations executed and confirmed
- [ ] 4 new ref_ tables created and seeded
- [ ] 6 FK columns added to log_ tables
- [ ] BUILDER fixes deployed and INSPECTOR Step 5d passed
- [ ] Data reset script executed; all 20 tables return 0 rows
- [ ] New test session created end-to-end — all writes use integer FKs
- [ ] Roomba re-run — free-text violations count = 0 for clinical tables

## ROUTING

SOOP (schema) → USER (execute SQL) → BUILDER (code fixes) → INSPECTOR (5d audit) → USER (data reset) → ANALYST (seed data)
