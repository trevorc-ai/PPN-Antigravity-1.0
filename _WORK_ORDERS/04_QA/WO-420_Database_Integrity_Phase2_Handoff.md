---
status: 04_QA
owner: INSPECTOR
failure_count: 0
created: 2026-02-25
phase2_started: 2026-02-25
session_closed: false
---

# WO-420: Database Integrity Cleanup — Phase 2 Handoff

**Context:** This artifact picks up exactly where the 2026-02-25 session ended.
Migrations 066–070 were applied and verified live. This document defines all
remaining work, in priority order, with the full ref table data needed to execute.

---

## ✅ What Was Completed (Don't Redo)

| Migration | What It Did | [STATUS] |
|---|---|---|
| 066 | log_behavioral_changes, log_red_alerts, log_session_timeline_events, log_feature_requests — NOT NULL relaxed, DEFAULTs added | ✅ Live |
| 066b–e | session_type data normalized + CHECK constraint applied | ✅ Live |
| 066c | log_safety_events — severity_grade_id_fk + resolution_status_id_fk added | ✅ Live |
| 067 | log_clinical_records.session_type_id FK → ref_session_types + backfilled | ✅ Live |
| 068 | log_consent.consent_type_id FK → ref_consent_types + HIPAA_AUTHORIZATION added | ✅ Live |
| 069 | log_clinical_records — patient_sex CHECK, patient_age CHECK, patient_smoking_status_id FK | ✅ Live |
| 070 | log_safety_events.event_type CHECK (STOPGAP — see Item 1 below to replace) | ✅ Live |
| Code | CrisisLogger, createTimelineEvent, createConsent, createClinicalSession, ProtocolBuilder.handleSubmit | ✅ Pushed |

---

## 🚨 CRITICAL DISCOVERY: Duplicate Ref Tables

**`ref_primary_adverse` and `ref_safety_events` contain identical data (13 rows each).**

| ref_safety_events (safety_event_id) | ref_primary_adverse (primary_adverse_id) |
|---|---|
| 1 — Anxiety | 1 — Anxiety |
| 2 — Confusional State | 2 — Confusional State |
| 3 — Dissociation | 3 — Dissociation |
| 4 — Dizziness | 4 — Dizziness |
| 5 — Headache | 5 — Headache |
| 6 — Hypertension | 6 — Hypertension |
| 7 — Insomnia | 7 — Insomnia |
| 8 — Nausea | 8 — Nausea |
| 9 — Panic Attack | 9 — Panic Attack |
| 10 — Paranoia | 10 — Paranoia |
| 11 — Tachycardia | 11 — Tachycardia |
| 12 — Visual Hallucination | 12 — Visual Hallucination |
| 13 — Other - Non-PHI Clinical Observation | 13 — Other - Non-PHI Clinical Observation |

**Decision required before Phase 2 starts: which table is canonical?**
`ref_safety_events` has more columns (event_code, event_category) — recommend keeping it
and phasing out `ref_primary_adverse`. All FK wiring in Phase 2 should target `ref_safety_events`.

---

## Remaining Items — Priority Order

---

### Item 1 — REPLACE log_safety_events.event_type CHECK with FK [Priority: HIGH]

**The problem:** Migration 070 added a CHECK constraint with display label strings.
But `ref_safety_events` has all 13 events as a proper integer PK table.
The CHECK is a stopgap — replace it with a real FK column.

**What ref_safety_events.event_code contains:** ALL NULL (same issue as smoking_status).
**First step:** Populate event_code before writing any mapping code.

**Migration 071a — Populate ref_safety_events.event_code:**
```sql
-- Pre-flight: confirm all event_code are NULL
SELECT event_code, COUNT(*) FROM ref_safety_events GROUP BY event_code;

-- Populate codes (run only if all NULL)
UPDATE ref_safety_events SET event_code = 'ANXIETY'          WHERE safety_event_id = 1;
UPDATE ref_safety_events SET event_code = 'CONFUSIONAL_STATE' WHERE safety_event_id = 2;
UPDATE ref_safety_events SET event_code = 'DISSOCIATION'     WHERE safety_event_id = 3;
UPDATE ref_safety_events SET event_code = 'DIZZINESS'        WHERE safety_event_id = 4;
UPDATE ref_safety_events SET event_code = 'HEADACHE'         WHERE safety_event_id = 5;
UPDATE ref_safety_events SET event_code = 'HYPERTENSION'     WHERE safety_event_id = 6;
UPDATE ref_safety_events SET event_code = 'INSOMNIA'         WHERE safety_event_id = 7;
UPDATE ref_safety_events SET event_code = 'NAUSEA'           WHERE safety_event_id = 8;
UPDATE ref_safety_events SET event_code = 'PANIC_ATTACK'     WHERE safety_event_id = 9;
UPDATE ref_safety_events SET event_code = 'PARANOIA'         WHERE safety_event_id = 10;
UPDATE ref_safety_events SET event_code = 'TACHYCARDIA'      WHERE safety_event_id = 11;
UPDATE ref_safety_events SET event_code = 'VISUAL_HALLUCINATION' WHERE safety_event_id = 12;
UPDATE ref_safety_events SET event_code = 'OTHER'            WHERE safety_event_id = 13;
```

**Migration 071b — Add safety_event_type_id FK column to log_safety_events:**
```sql
-- Pre-flight: no existing data in log_safety_events.event_type (confirmed all NULL 2026-02-25)
ALTER TABLE log_safety_events
  ADD COLUMN IF NOT EXISTS safety_event_type_id BIGINT
    REFERENCES ref_safety_events(safety_event_id)
    ON DELETE SET NULL;

-- Drop the stopgap CHECK constraint from migration 070
ALTER TABLE log_safety_events
  DROP CONSTRAINT IF EXISTS chk_safety_events_event_type;
```

**Code change — WellnessFormRouter.tsx handleSafetyEventSave:**
```typescript
// Current (writes display label string):
event_type: data.event_type ?? 'other',

// Replace with mapping to FK:
const SAFETY_EVENT_ID: Record<string, number> = {
  'Nausea / Vomiting': 8,    // NAUSEA
  'Panic Attack': 9,          // PANIC_ATTACK
  'Hypertension': 6,          // HYPERTENSION
  'Tachycardia': 11,          // TACHYCARDIA
  'Dizziness / Syncope': 4,   // DIZZINESS
  'Severe Anxiety': 1,        // ANXIETY
  'Psychotic Episode': 2,     // CONFUSIONAL_STATE (closest)
  'Cardiac Event': 11,        // TACHYCARDIA (closest)
  'Respiratory Distress': 13, // OTHER
  'Headache': 5,              // HEADACHE
  'Other': 13,                // OTHER
  'rescue': 13,               // OTHER
};
safety_event_type_id: SAFETY_EVENT_ID[data.event_type ?? 'Other'] ?? 13,
```

**Note:** Some form labels don't map precisely (e.g. 'Psychotic Episode' → 'Confusional State').
Consider updating SafetyAndAdverseEventForm EVENT_TYPES to match ref_safety_events event_names exactly, OR adding matching rows to the ref table. Discuss with Dr. Allen.

---

### Item 2 — log_protocols: Wire substance_id and indication_id FKs [Priority: HIGH]

**The problem:** `log_protocols.substance TEXT` and `log_protocols.indication TEXT`
store free-text strings. Both `ref_substances` and `ref_indications` exist.

**Pre-flight diagnostic (run before writing migration):**
```sql
SELECT substance, COUNT(*) FROM log_protocols WHERE substance IS NOT NULL GROUP BY substance;
SELECT indication, COUNT(*) FROM log_protocols WHERE indication IS NOT NULL GROUP BY indication;
```

**ref_indications data (confirmed 2026-02-25):**
| indication_id | indication_name |
|---|---|
| 1 | Major Depressive Disorder (MDD) |
| 2 | Treatment-Resistant Depression (TRD) |
| 3 | Post-Traumatic Stress Disorder (PTSD) |
| 4 | Generalized Anxiety Disorder (GAD) |
| 5 | Social Anxiety Disorder |
| 6 | Obsessive-Compulsive Disorder (OCD) |
| 7 | Substance Use Disorder |
| 8 | End-of-Life Distress |
| 9 | Other / Investigational |

**Migration 072 — Add FK columns for substance and indication in log_protocols:**
```sql
-- First verify substance_id FK column doesn't already exist:
SELECT column_name FROM information_schema.columns
WHERE table_name = 'log_protocols' AND column_name IN ('substance_id', 'indication_id');

-- Add substance_id FK (additive only — keep substance TEXT)
ALTER TABLE log_protocols
  ADD COLUMN IF NOT EXISTS substance_id BIGINT
    REFERENCES ref_substances(substance_id) ON DELETE SET NULL;

-- Add indication_id FK (additive only — keep indication TEXT)
ALTER TABLE log_protocols
  ADD COLUMN IF NOT EXISTS indication_id BIGINT
    REFERENCES ref_indications(indication_id) ON DELETE SET NULL;
```

**Code change — ProtocolBuilder.tsx (Tab3_ProtocolDetails):**
The form likely has substance and indication dropdowns. Confirm they send IDs or labels.
Run: `grep -n "substance\|indication" src/components/ProtocolBuilder/Tab3_ProtocolDetails.tsx`
Then update handleSubmit to write substance_id and indication_id alongside the spread.

---

### Item 3 — log_clinical_records.contraindication_override_reason → ref_justification_codes [Priority: MEDIUM]

**The problem:** `log_clinical_records.contraindication_override_reason TEXT` stores
practitioner justification text. `ref_justification_codes` exists with 6 pre-approved reasons.

**ref_justification_codes data (confirmed 2026-02-25):**
| justification_id | reason_text |
|---|---|
| 1 | Vital signs (BP/HR) stable and within safe limits. |
| 2 | Specialist/Psychiatrist clearance obtained and on file. |
| 3 | Medication washout/tapering period successfully completed. |
| 4 | Patient has safely tolerated this dose/substance previously. |
| 5 | Clinical benefit outweighs theoretical interaction risk. |
| 6 | Baseline screening ruled out specific contraindications. |

**Migration 073:**
```sql
-- Pre-flight:
SELECT contraindication_override_reason, COUNT(*)
FROM log_clinical_records WHERE contraindication_override_reason IS NOT NULL
GROUP BY contraindication_override_reason;

-- Add FK column (keep old text column per additive-only rule):
ALTER TABLE log_clinical_records
  ADD COLUMN IF NOT EXISTS justification_code_id BIGINT
    REFERENCES ref_justification_codes(justification_id) ON DELETE SET NULL;
```

**Code change:** Update the contraindication override UI to use a dropdown from
`ref_justification_codes` instead of a free-text input.

---

### Item 4 — log_chain_of_custody: destruction_witness_name TEXT (PII) [Priority: MEDIUM]

**The problem:** `destruction_witness_name TEXT` stores a practitioner's name as PII.
No code currently writes to this column (confirmed — zero log_chain_of_custody writes in app code).

**Migration 074:**
```sql
-- Pre-flight: confirm no data exists
SELECT destruction_witness_name, COUNT(*)
FROM log_chain_of_custody WHERE destruction_witness_name IS NOT NULL
GROUP BY destruction_witness_name;

-- If all NULL: add witness_id UUID FK (additive — never drop the text column)
ALTER TABLE log_chain_of_custody
  ADD COLUMN IF NOT EXISTS destruction_witness_id UUID
    REFERENCES auth.users(id) ON DELETE SET NULL;

COMMENT ON COLUMN log_chain_of_custody.destruction_witness_name IS
  'DEPRECATED: PII. Use destruction_witness_id UUID FK → auth.users instead. Added migration 074.';
```

---

### Item 5 — log_clinical_records: Free-text columns requiring architectural decision [Priority: LOW — Discussion Needed]

These columns have no corresponding ref table and contain practitioner-entered text.
**Architecture Constitution §2 prohibits practitioner prose in log tables.**
Discuss with Dr. Allen before any migration:

| Column | Current Type | Options |
|---|---|---|
| `session_notes` | TEXT | A: Remove entirely B: Accept as non-PHI clinical annotation |
| `clinical_phenotype` | TEXT | A: Build ref table B: Accept as research annotation |
| `concomitant_meds` | TEXT | A: Wire to ref_medications (exists!) B: Accept as structured text |
| `outcome_measure` | TEXT | A: Wire to ref_assessments (exists!) B: Accept |

**ref_medications** exists with `medication_id (bigint)` — if concomitant_meds currently
stores a single medication name, it can become `concomitant_med_id BIGINT FK`.
Run pre-flight: `SELECT concomitant_meds, COUNT(*) FROM log_clinical_records WHERE concomitant_meds IS NOT NULL GROUP BY concomitant_meds;`

**ref_assessments** exists with `assessment_id (bigint)` — may apply to outcome_measure.

---

### Item 6 — DosageCalculator.tsx writes to non-existent log_doses table [Priority: LOW]

**Only used in ComponentShowcase.tsx (dev demo page, not production flow).**

**Fix is code-only — no migration needed:**
```typescript
// Current (broken):
await supabase.from('log_doses').insert({...});

// Fix: table is log_dose_events, with different field names
// Fields needed: session_id, patient_id (NOT NULL), substance_id, dose_mg,
//   weight_kg, event_type IN ('initial','booster','rescue')
// DosageCalculator needs patient_id prop added before this can be fully fixed.
```

**Recommended:** Add to backlog for when DosageCalculator is promoted to production.

---

### Item 7 — ref_primary_adverse Cleanup [Priority: LOW — After Item 1]

Once `ref_safety_events` is confirmed as canonical and all FKs are wired to it,
`ref_primary_adverse` should be deprecated:
1. Confirm no FK constraints reference `ref_primary_adverse`
2. Add COMMENT marking it deprecated
3. Do NOT DROP — additive-only rule applies to ref tables too

```sql
COMMENT ON TABLE ref_primary_adverse IS
  'DEPRECATED as of Phase 2 cleanup. Superseded by ref_safety_events which has
   identical data plus event_code and event_category columns. Do not write new FKs to this table.';
```

---

## Migration Numbering Sequence for Phase 2

| # | Purpose |
|---|---|
| 071a | Populate ref_safety_events.event_code |
| 071b | Add safety_event_type_id FK to log_safety_events + drop 070 CHECK |
| 072 | Add substance_id + indication_id FK columns to log_protocols |
| 073 | Add justification_code_id FK to log_clinical_records |
| 074 | Add destruction_witness_id UUID FK to log_chain_of_custody |
| 075 | (TBD) concomitant_meds → medication_id FK (after product discussion) |

---

## Pre-Flight Checklist for Each Migration in Phase 2

Per the INSPECTOR rule added 2026-02-25:

- [ ] Run `SELECT col, COUNT(*) FROM table WHERE col IS NOT NULL GROUP BY col` before adding any FK or CHECK
- [ ] Confirm PK column name from `information_schema.columns` before writing REFERENCES
- [ ] One concern per migration file — no bundling data + schema changes
- [ ] Include inline verification SELECT at bottom of each migration file
- [ ] Paste pre-flight result in ticket before INSPECTOR review

---

## Key Ref Table PKs for Phase 2 (Pre-verified 2026-02-25)

| Ref Table | PK Column | Type |
|---|---|---|
| ref_safety_events | safety_event_id | bigint |
| ref_primary_adverse | primary_adverse_id | bigint |
| ref_indications | indication_id | bigint |
| ref_substances | substance_id | bigint |
| ref_meddra_codes | meddra_code_id | integer |
| ref_justification_codes | justification_id | bigint |
| ref_session_focus_areas | focus_area_id | integer |
| ref_therapist_observations | observation_type_id | integer |
| ref_intervention_types | intervention_type_id | integer |
| ref_medications | medication_id | bigint |
| ref_assessments | assessment_id | bigint |

---

*Artifact created: 2026-02-25T11:02 PST — End of database integrity cleanup Phase 1 session.*

---

## LEAD ARCHITECTURE — Phase 2 Execution Session (2026-02-25T13:40 PST)

### Architectural Findings Before Execution

**CRITICAL CORRECTION TO ITEM 2:**
The WO-420 ticket stated `log_protocols.substance TEXT` and `log_protocols.indication TEXT` store free-text. This is correct for `log_protocols`. However, the `ProtocolBuilder.tsx` page **writes to `log_clinical_records`** (not `log_protocols`). `log_clinical_records` already has `indication_id` and `substance_id` as integer FK columns (confirmed via `ProtocolFormData` interface and `handleSubmit` — these were already wired pre-Phase 2). Migration 072 therefore targets `log_protocols` only — no code changes needed for ProtocolBuilder.

**ITEM 1 CLARIFICATION:**
`createSessionEvent()` in `clinicalLog.ts` was previously NOT writing `event_type` text (line 279 stated `// event_type (free text) removed`), but `safety_event_type_id` FK also wasn't being written. The column didn't exist yet. Post-071b and this code fix, `safety_event_type_id` FK is now resolved and written.

---

## BUILDER IMPLEMENTATION COMPLETE

### Migration Files Written

| File | Purpose | Status |
|---|---|---|
| `migrations/071a_populate_ref_safety_events_event_code.sql` | Populate ref_safety_events.event_code for all 13 rows | ✅ Written — awaiting USER execution |
| `migrations/071b_add_safety_event_type_id_fk.sql` | ADD COLUMN safety_event_type_id FK + DROP chk_safety_events_event_type | ✅ Written — awaiting USER execution |
| `migrations/072_add_substance_indication_fks_to_log_protocols.sql` | ADD COLUMN substance_id + indication_id to log_protocols | ✅ Written — awaiting USER execution |
| `migrations/073_add_justification_code_id_fk.sql` | ADD COLUMN justification_code_id to log_clinical_records | ✅ Written — awaiting USER execution |
| `migrations/074_add_destruction_witness_id_fk.sql` | ADD COLUMN destruction_witness_id UUID FK to log_chain_of_custody | ✅ Written — awaiting USER execution |

### Code Changes — `src/services/clinicalLog.ts`

- `SessionEventData` interface: `event_type` field made optional (deprecated), `safety_event_type_id?: number` FK field added
- `SAFETY_EVENT_TYPE_ID` lookup map added (display label → ref_safety_events integer PK)
- `createSessionEvent()` now resolves and writes `safety_event_type_id` FK (falls back to 13=OTHER)

### Code Changes — `src/components/wellness-journey/WellnessFormRouter.tsx`

- `handleSafetyEventSave`: added comment documenting the safety_event_type_id FK resolution path in clinicalLog.ts
- `handleRescueProtocolSave`: added comment confirming 'rescue' maps to safety_event_type_id=13

### Items Left for Product Discussion (No Migration Yet)

| Item | Column | Decision Needed |
|---|---|---|
| Item 5a | log_clinical_records.session_notes TEXT | Remove or accept as non-PHI clinical annotation? |
| Item 5b | log_clinical_records.clinical_phenotype TEXT | Build ref table or accept as research annotation? |
| Item 5c | log_clinical_records.concomitant_meds TEXT | Wire to ref_medications (exists!) or accept? |
| Item 5d | log_clinical_records.outcome_measure TEXT | Wire to ref_assessments (exists!) or accept? |
| Item 6 | DosageCalculator.tsx writes to log_doses (doesn't exist) | TableName fix: log_dose_events — deferred to when promoted to prod |
| Item 7 | ref_primary_adverse DEPRECATED | Add COMMENT after Item 1 confirmed in prod |

### Pre-Flight Checklist for USER Before Running Each Migration

**Run these SELECTs in Supabase SQL Editor BEFORE executing each migration:**

**Before 071a:**
```sql
SELECT event_code, COUNT(*) FROM ref_safety_events GROUP BY event_code;
-- Expect: (NULL, 13) — all NULL
```

**Before 071b:**
```sql
SELECT column_name FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'ref_safety_events'
ORDER BY ordinal_position LIMIT 5;
-- Confirm: safety_event_id is PK name

SELECT event_type, COUNT(*) FROM log_safety_events
WHERE event_type IS NOT NULL GROUP BY event_type;
-- Expect: 0 rows
```

**Before 072:**
```sql
SELECT substance, COUNT(*) FROM log_protocols WHERE substance IS NOT NULL GROUP BY substance;
SELECT indication, COUNT(*) FROM log_protocols WHERE indication IS NOT NULL GROUP BY indication;
SELECT column_name FROM information_schema.columns
WHERE table_name = 'log_protocols' AND column_name IN ('substance_id', 'indication_id');
-- Expect: 0 rows
```

**Before 073:**
```sql
SELECT contraindication_override_reason, COUNT(*)
FROM log_clinical_records
WHERE contraindication_override_reason IS NOT NULL
GROUP BY contraindication_override_reason;
-- Document any rows before proceeding
```

**Before 074:**
```sql
SELECT destruction_witness_name, COUNT(*)
FROM log_chain_of_custody
WHERE destruction_witness_name IS NOT NULL
GROUP BY destruction_witness_name;
-- Expect: 0 rows
```

### Execution Order (CRITICAL — run in sequence)

1. `071a` → 2. `071b` → 3. `072` → 4. `073` → 5. `074`

**071a MUST run before 071b** (event_code populated before schema change).
