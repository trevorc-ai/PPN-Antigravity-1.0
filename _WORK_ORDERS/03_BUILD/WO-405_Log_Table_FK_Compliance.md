---
id: WO-405
title: "Log Table Data Architecture Audit + FK Compliance Fix"
status: 03_BUILD
owner: SOOP
created: 2026-02-23
created_by: LEAD
failure_count: 0
priority: P0
tags: [database, data-governance, fk-compliance, log-tables, architecture-constitution]
user_prompt: |
  "I noticed that some queries are writing data directly to log tables, rather than writing
  reference codes. Everything written to a log table should be pulled from a reference table —
  we are not directly writing anything from the outside onto a log table."
---

# WO-405: Log Table Data Architecture Audit + FK Compliance Fix

## LEAD ARCHITECTURE

This document is the forensic result of a codebase audit of every `.insert()` call against
`log_` tables in `src/`. It identifies violations, classifies them by severity, and gives
SOOP a precise remediation plan.

**The Rule (Architecture Constitution §2):**
> Every value written to a log_ table must either be:
> 1. A numeric FK pointing to a row in a ref_ table, OR
> 2. A measured scalar (score, count, timestamp, boolean, numeric vital), OR
> 3. A UUID (user/session/site reference)
>
> Direct string values that represent _categories_ or _types_ are NEVER acceptable.

---

## AUDIT FINDINGS BY FILE

### 🔴 CRITICAL VIOLATIONS (Direct strings written as categorical data)

---

#### VIOLATION 1: `AdverseEventLogger.tsx` — `log_adverse_events`
**File:** `src/components/safety/AdverseEventLogger.tsx` line 75
**Severity:** CRITICAL — category strings written directly

```typescript
// CURRENT (WRONG):
alert_type: String(form.event_type_id),         // ❌ Converts integer FK to a STRING
alert_message: form.alert_message_id ? String(form.alert_message_id) : null,   // ❌ Same
response_notes: form.response_notes_id ? String(form.response_notes_id) : null, // ❌ Same
```

The form correctly collects integer IDs (`event_type_id: number`, `alert_message_id: number`,
`response_notes_id: number`) but the insert CONVERTS them to strings using `String()`.
The database is receiving `"1"` as text, not `1` as a foreign key integer.

**Fix Required:**
```typescript
// CORRECT:
alert_type_id: form.event_type_id,          // integer FK to ref_event_types
alert_message_id: form.alert_message_id,    // integer FK to ref_alert_messages
response_notes_id: form.response_notes_id,  // integer FK to ref_response_options
// REMOVE: alert_type (text), alert_message (text), response_notes (text)
```

**Also Required:** Verify `log_adverse_events` schema has integer columns `alert_type_id`,
`alert_message_id`, `response_notes_id`. If they exist as TEXT, SOOP must add new INTEGER
FK columns (additive only — cannot alter existing columns).

---

#### VIOLATION 2: `CrisisLogger.tsx` — `log_adverse_events`
**File:** `src/components/session/CrisisLogger.tsx` line 118
**Severity:** CRITICAL — EventType enum string written directly as `alert_type`

```typescript
// CURRENT (WRONG):
alert_type: eventType,  // ❌ Writing string 'VITAL_SIGNS_ELEVATED', 'TRIP_KILLER_BENZO' etc.
alert_severity: ['EMERGENCY_SERVICES_CALLED', ...].includes(eventType) ? 'severe' : 'mild', // ❌ String
```

The `EVENT_BUTTONS` array has numeric-adjacent structure but the insert writes the
enum string key directly. Both `alert_type` and `alert_severity` are string literals.

**Fix Required:**
1. SOOP must confirm whether `ref_crisis_event_types` (or similar) exists in the live DB
2. If it exists: map EventType enum → integer ID before insert
3. If it does not exist: SOOP must create the ref_ table first, then BUILDER can fix the
   insert to write the FK integer
4. `alert_severity`: create `ref_severity_levels` if it doesn't exist (mild=1, moderate=2,
   severe=3). Insert integer FK, not text.

---

#### VIOLATION 3: `exportService.ts` — `log_system_events`  
**File:** `src/services/exportService.ts` line 141
**Severity:** MEDIUM — JSON blob with freeform keys and string values written directly

```typescript
// CURRENT (WRONG):
await supabase.from('log_system_events').insert({
    action: 'data_export',                       // ❌ string literal
    details: {                                    // ❌ JSONB freeform blob
        export_type: exportType,                  // ❌ string
        table_count: tableCount,                  // ✅ numeric — acceptable
        patient_id: patientId,                    // 🟡 potential PHI if real ID
        timestamp: new Date().toISOString()        // ✅ timestamp — acceptable
    }
});
```

**Fix Required:**
- `action`: should be `action_type_id` (integer FK to `ref_system_action_types`)
- `export_type`: should be `export_type_id` (integer FK to `ref_export_types`)
- Remove `patient_id` from audit log payload — this is PHI exposure risk
- SOOP to confirm `log_system_events` schema and whether `ref_system_action_types` exists

---

### 🟡 ALREADY FIXED in `clinicalLog.ts` (No Action Required — Reference Only)

The `clinicalLog.ts` service layer demonstrates the CORRECT pattern. Previous violations
have already been removed with explanatory comments. This is the reference implementation:

```typescript
// CORRECT PATTERN (from clinicalLog.ts):
// ✅ session_type removed — requires ref_session_types FK (ID only, no free text)
// ✅ event_type (free text) removed — use meddra_code_id FK instead
// ✅ change_category removed — requires ref_behavioral_categories FK
// ✅ change_type_ids: data.change_type_ids,  ← integer array FK ✅
// ✅ observation_id: obs_id,  ← integer FK ✅
```

IMPORTANT: Some columns in `clinicalLog.ts` reference FK tables that may not yet exist
in the live database (e.g., `ref_flow_event_types`, `ref_behavioral_change_types`,
`ref_clinical_observations`). These will cause insert failures until ref_ tables are seeded.

---

### ✅ COMPLIANT INSERTS (No Action Required)

| File | Table | Why Compliant |
|------|-------|---------------|
| `clinicalLog.ts` — `createBaselineAssessment` | `log_baseline_assessments` | All numerics (scores), UUIDs, FK arrays only |
| `clinicalLog.ts` — `createSessionVital` | `log_session_vitals` | All numerics (vitals), timestamps, UUIDs |
| `clinicalLog.ts` — `createPulseCheck` | `log_pulse_checks` | All numerics (1-5 scales), dates, UUIDs |
| `clinicalLog.ts` — `createIntegrationSession` | `log_integration_sessions` | FK integer arrays (`session_focus_ids[]`), boolean, numeric ratings |
| `clinicalLog.ts` — `createSessionObservation` | `log_session_observations` | Integer FK pair only |
| `clinicalLog.ts` — `createBehavioralChange` | `log_behavioral_changes` | Integer FK arrays, boolean, numeric |
| `DosageCalculator.tsx` | `log_doses` | `substance_id` (integer FK), numerics only ✅ |
| `clinicalLog.ts` — `createConsent` | `log_consent` | Boolean + timestamp + site UUID only |
| `clinicalLog.ts` — `createSessionEvent` | `log_safety_events` | FK integers only (`meddra_code_id`, `intervention_type_id`) |

---

## SOOP REMEDIATION PLAN

### Step 1: Live Schema Pre-Flight (MANDATORY BEFORE WRITING SQL)

Ask USER to run in Supabase SQL Editor:

```sql
-- 1. Get full log_adverse_events schema
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'log_adverse_events'
ORDER BY ordinal_position;

-- 2. Get full log_system_events schema
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'log_system_events'
ORDER BY ordinal_position;

-- 3. Check which ref_ tables currently exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name LIKE 'ref_%'
ORDER BY table_name;
```

Do NOT proceed until you have these results.

---

### Step 2: Migrations to Write (after pre-flight confirms what exists)

**Migration A: Create missing ref_ tables**

```sql
-- ref_crisis_event_types: Maps CrisisLogger EventType enum → integer IDs
CREATE TABLE IF NOT EXISTS ref_crisis_event_types (
    id SERIAL PRIMARY KEY,
    event_code VARCHAR(60) NOT NULL UNIQUE,  -- e.g., 'VITAL_SIGNS_ELEVATED'
    label VARCHAR(120) NOT NULL,
    severity_tier SMALLINT NOT NULL DEFAULT 1 CHECK (severity_tier BETWEEN 1 AND 3),
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);
ALTER TABLE ref_crisis_event_types ENABLE ROW LEVEL SECURITY;

-- Seed with all EventType enum values from CrisisLogger
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

-- ref_severity_levels
CREATE TABLE IF NOT EXISTS ref_severity_levels (
    id SERIAL PRIMARY KEY,
    severity_code VARCHAR(20) NOT NULL UNIQUE,
    label VARCHAR(60) NOT NULL,
    sort_order SMALLINT NOT NULL
);
ALTER TABLE ref_severity_levels ENABLE ROW LEVEL SECURITY;

INSERT INTO ref_severity_levels (severity_code, label, sort_order) VALUES
('mild',     'Mild',     1),
('moderate', 'Moderate', 2),
('severe',   'Severe',   3)
ON CONFLICT (severity_code) DO NOTHING;

-- ref_system_action_types (for exportService audit log)
CREATE TABLE IF NOT EXISTS ref_system_action_types (
    id SERIAL PRIMARY KEY,
    action_code VARCHAR(60) NOT NULL UNIQUE,
    label VARCHAR(120) NOT NULL
);
ALTER TABLE ref_system_action_types ENABLE ROW LEVEL SECURITY;

INSERT INTO ref_system_action_types (action_code, label) VALUES
('data_export',          'Full Data Export'),
('patient_export',       'Patient-Specific Export'),
('session_export',       'Session Export'),
('audit_view',           'Audit Log Viewed'),
('settings_change',      'Settings Modified')
ON CONFLICT (action_code) DO NOTHING;
```

**Migration B: Add FK columns to log_adverse_events (additive — never alter existing)**

```sql
-- Only add these IF the columns don't already exist
ALTER TABLE log_adverse_events
    ADD COLUMN IF NOT EXISTS crisis_event_type_id INTEGER REFERENCES ref_crisis_event_types(id),
    ADD COLUMN IF NOT EXISTS severity_level_id     INTEGER REFERENCES ref_severity_levels(id);
```

**Migration C: Add FK columns to log_system_events (additive)**

```sql
ALTER TABLE log_system_events
    ADD COLUMN IF NOT EXISTS action_type_id INTEGER REFERENCES ref_system_action_types(id);
```

---

### Step 3: BUILDER Code Fixes (After migrations confirmed executed)

BUILDER (separate ticket) must:

1. **`CrisisLogger.tsx`**: Look up `crisis_event_type_id` by `event_code` before insert.
   Map severity string → `severity_level_id`. Remove `alert_type` and `alert_severity` text fields.

2. **`AdverseEventLogger.tsx`**: Remove `String()` conversions. Write integer FKs directly.
   Change field names to `alert_type_id`, `alert_message_id`, `response_notes_id`.

3. **`exportService.ts`**: Add `action_type_id` lookup before insert. Remove `patient_id`
   from audit payload. Remove freeform `details` JSONB if schema allows.

---

## ACCEPTANCE CRITERIA

- [ ] SOOP pre-flight results pasted into this ticket
- [ ] `ref_crisis_event_types` table created and seeded with all 13 crisis event codes
- [ ] `ref_severity_levels` seeded (mild, moderate, severe)
- [ ] `ref_system_action_types` seeded
- [ ] `log_adverse_events.crisis_event_type_id` and `severity_level_id` columns added
- [ ] `log_system_events.action_type_id` column added
- [ ] INSPECTOR runs live grep to confirm no `.insert()` on log_ tables writes string literals
  for fields that should be FK integers
- [ ] Roomba free-text audit re-run — count holds at 0 red violations

## ROUTING
SOOP → INSPECTOR → USER (SQL execution) → BUILDER (code fix) → INSPECTOR
