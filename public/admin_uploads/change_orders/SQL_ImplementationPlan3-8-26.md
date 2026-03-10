# PPN Wellness Journey — Database Schema Plan (v3)
*Incorporates all user directives from March 2026 review*

---

## Part 1: UUID Creation — How the Core IDs Work

> [!IMPORTANT]
> This traces exactly when, where, and how the three primary UUIDs are created.

### `user_id`
- **Created by:** Supabase Auth on account signup (server-side)
- **Where stored:** `auth.users.id` (Supabase internal; never in a `public` table directly)
- **How used:** `supabase.auth.getSession()` in `identity.ts` → extracts `session.user.id`
- **Then mapped to a site:** `log_user_sites (user_id, site_id)` — this is how a practitioner is linked to a clinic

### `site_id`
- **Created by:** Supabase (admin-provisioned) via `gen_random_uuid()` at row creation in `log_sites`
- **Where stored:** `log_sites.site_id` (UUID, primary key)
- **How resolved at runtime:** `getCurrentSiteId()` in `identity.ts` → queries `log_user_sites WHERE user_id = ?` → returns first matching `site_id`
- **Note:** A user can belong to multiple sites; the code currently takes the first match (limit 1)

### `patient_uuid`
- **Created by:** `crypto.randomUUID()` in the browser (client-side) inside `getOrCreateCanonicalPatientUuid()` in `identity.ts`
- **When:** On the first time a `(patient_link_code, site_id)` pair is encountered — typically when the practitioner selects or creates a patient in the Wellness Journey
- **Where stored:** `log_patient_site_links.patient_uuid` (NOT NULL)
- **How used:** All subsequent `log_` table writes use this UUID as the patient FK
- **Lifecycle:** The `patient_link_code` (format `PT-XXXXXXXXXX`) is the human-visible anonymous code; `patient_uuid` is the internal database FK — they are always linked via `log_patient_site_links`

---

## Part 2: Feature Kill List (Scope Reduction)

> [!CAUTION]
> The following features/columns are being **removed** to reduce risk and project scope. Since there is no valid or usable live data in either environment, this is safe to execute as a clean rebuild.

### Tables to DELETE (drop entirely)
| Table | Reason |
|---|---|
| `log_interventions` | JSONB blob store — anti-pattern, superseded by `log_safety_events` |
| `log_outcomes` | Superseded by `log_longitudinal_assessments` |
| `log_session_observations` | Bare junction (session_id + observation_id only) — no metadata |
| `log_baseline_observations` | Same — bare junction with no utility |
| `log_consent` | Will be replaced by clean `log_phase1_consent` |

### Tables to KEEP as-is (no changes)
| Table | Notes |
|---|---|
| `log_patient_site_links` | Identity bridge — correct and in use |
| `log_session_vitals` | Solid structure, minor additions only |
| `log_session_timeline_events` | Good structure |
| `log_dose_events` | Handles multi-dose correctly |
| `log_pulse_checks` | Complete |
| `log_safety_events` | Complete |
| `log_red_alerts` | Complete |
| `log_correction` | Audit trail — keep |
| All `ref_` tables | All kept unless specifically listed in kill list |

### Columns to DROP from existing tables
| Table | Columns to Drop | Reason |
|---|---|---|
| `log_behavioral_changes` | `change_category`, `impact_on_wellbeing`, `related_to_dosing` | Free-text — violates no-free-text rule |
| `log_session_vitals` | `level_of_consciousness` (varchar) | Replace with FK; original was free-text |
| `log_clinical_records` | `demographics` (if exists as jsonb) | Anti-pattern, moved to `log_patient_profiles` |
| `log_integration_sessions` | `attended` (boolean) | Replaced by `attendance_status_id` FK |

### Features to DROP (not implement)
| Feature | Decision |
|---|---|
| **`log_behavioral_changes`** | **DROPPED for now.** The free-text fields cannot be reliably converted to FK references without a robust reference vocabulary. Recommend re-introducing in a future sprint with a proper `ref_behavioral_domains` table and a clear UI for it. |
| **MEQ-30 per-item logging** | Keep only the total score in `log_phase3_meq30`. No per-item table. |
| **EKG rhythm FK** | Keep `ref_ekg_rhythms` but make the link on `log_phase1_safety_screen` only (not on vitals). Reduces complexity. |
| **`log_longitudinal_assessments` — WHOQOL, PSQI** | **Dropped.** Keep PHQ-9, GAD-7, and C-SSRS only (the three core safety-relevant scales). WHOQOL and PSQI are nice-to-have. |
| **`ref_assessment_interval`** | Dropped — intervals are better captured as a `days_post_session` integer already on the table. |

---

## Part 3: Assessment Scale Decision

> **You asked: "Do we really need all of these?"**
>
> **No.** Here is the tiered recommendation:

| Scale | Keep? | Reason |
|---|---|---|
| **PHQ-9** | ✅ Core | Standard depression screener — mandatory |
| **GAD-7** | ✅ Core | Standard anxiety screener — mandatory |
| **C-SSRS** (cssrs_score) | ✅ Core | Suicide risk — safety mandatory |
| ACE | ⚠️ Keep at baseline only | One-time intake screen, not repeated |
| Expectancy scale | ⚠️ Keep at baseline only | Baseline only |
| WHOQOL | ❌ Drop | Nice-to-have; adds burden with minimal clinical utility at this stage |
| PSQI (sleep) | ❌ Drop | Nice-to-have; covered indirectly by `sleep_quality` in pulse checks |
| MEQ-30 | ✅ Keep as total score | Core mystical experience outcome measure |

---

## Part 4: Multi-Indication Solution

> **You asked: "Sometimes patients are treated for more than one diagnosis — how do we handle this?"**

**Recommendation: Junction table.** One patient, many indications.

```sql
-- New table
CREATE TABLE log_patient_indications (
  id             bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  patient_uuid   uuid NOT NULL REFERENCES log_patient_site_links(patient_uuid),
  indication_id  bigint NOT NULL REFERENCES ref_indications(indication_id),
  is_primary     boolean NOT NULL DEFAULT false,  -- one per patient should be true
  created_at     timestamptz NOT NULL DEFAULT now(),
  created_by     uuid
);
```

- Drop the single `indication_id` column from `log_clinical_records` (it's session-level, wrong place)
- UI: multi-select on patient profile setup; one toggle for "primary diagnosis"

---

## Part 5: Weight Auto-Population

> **"Some practitioners weigh patients before every session; other weigh them once."**

**Solution: Weight is always on `log_clinical_records` (session-level), but auto-populated from the most recent prior session for the same patient.**

- `log_clinical_records.weight_range_id` ← FK to `ref_weight_ranges` — **stays as-is**
- Service layer reads last `weight_range_id` for this `patient_uuid` and pre-fills the form field
- Practitioner can override before confirming the session
- This avoids a separate `log_patient_profiles.weight_range_id` + session-level duplication

---

## Part 6: Table Classification (KEEP / MODIFY / CREATE / DELETE)

### DELETE
- `log_interventions`
- `log_outcomes`
- `log_session_observations`
- `log_baseline_observations`
- `log_consent` (replaced by `log_phase1_consent`)
- `log_behavioral_changes` (deferred, see kill list)

### KEEP (no schema changes)
- `log_patient_site_links`, `log_session_vitals`, `log_session_timeline_events`
- `log_dose_events`, `log_pulse_checks`, `log_safety_events`, `log_red_alerts`
- `log_sites`, `log_user_sites`, `log_user_profiles`, `log_corrections`
- All `ref_` tables (except those being added)

### MODIFY (targeted column changes)
| Table | Action |
|---|---|
| `log_clinical_records` | DROP `indication_id`; ADD `session_setting_id INT FK`; ADD `mindset_type_id INT FK`; ADD `intention_theme_ids INT[]` |
| `log_session_vitals` | DROP `level_of_consciousness` varchar; ADD `consciousness_level_id BIGINT FK` |
| `log_integration_sessions` | DROP `attended boolean`; ADD `attendance_status_id INT FK`; DROP WHOQOL/PSQI cols if present |
| `log_longitudinal_assessments` | DROP `whoqol_score`, `psqi_score`; keep `phq9_score`, `gad7_score`, `cssrs_score` |
| `log_baseline_assessments` | DROP single `psychospiritual_history_id`; add junction table instead |
| `log_dose_events` | ADD `patient_uuid uuid` |

### CREATE (new tables)
**Reference tables (8):**
1. `ref_intention_themes` — preparation intention categories
2. `ref_mindset_types` — expectation/mindset options pre-session
3. `ref_session_settings` — physical setting (clinic, home, ceremony, retreat)
4. `ref_protocol_archetypes` — protocol labels for patient profile
5. `ref_timeline_event_types` — standardized vocabulary for session events
6. `ref_attendance_statuses` — attended / cancelled / no-show / rescheduled
7. `ref_consciousness_levels` — FK replacement for free-text LOC
8. `ref_dosing_relatedness` — structured options for "related to session?"

**Log tables (6):**
1. `log_patient_profiles` — demographics snapshot per patient
2. `log_patient_indications` — patient×indication junction (multi-diagnosis support)
3. `log_patient_psychospiritual_history` — patient×history_type junction
4. `log_phase1_consent` — consent checklist per session (replaces `log_consent`)
5. `log_phase1_safety_screen` — contraindication screening per session
6. `log_phase3_meq30` — MEQ-30 total score per session (includes `patient_uuid`, `session_id`)

---

## Part 7: Migration File Structure

```
migrations/
  055_drop_deprecated_tables.sql       -- DROP log_interventions, log_outcomes, etc.
  056_drop_and_patch_columns.sql       -- DROP free-text cols; ADD FK columns; ADD new cols
  057_new_ref_tables.sql               -- 8 new ref_ tables with seed data
  058_new_log_tables.sql               -- 6 new log_ tables
  059_rls_and_indexes.sql              -- RLS policies + GIN indexes
```

> [!WARNING]
> Migration 055 (DROP tables) must run first. All subsequent migrations assume the schema is clean. Run `database-schema-validator` before executing each file.

---

## Verification Plan

### Pre-execution
- Run `database-schema-validator` skill on every `.sql` file
- Check all FK references point to tables that will exist after the migrations in sequence

### Post-execution SQL checks
```sql
-- Confirm patient_uuid FK integrity
SELECT COUNT(*) FROM log_patient_profiles p
LEFT JOIN log_patient_site_links l ON p.patient_uuid = l.patient_uuid
WHERE l.patient_uuid IS NULL;  -- must return 0

-- Confirm no free-text columns remain in log_ tables
SELECT table_name, column_name, data_type FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name LIKE 'log_%'
  AND data_type = 'character varying'
  AND column_name NOT IN ('patient_link_code_hash', 'device_id', 'event_type');
```

### UI walkthrough (post-migration)
1. Select/create patient → verify `log_patient_site_links` + `log_patient_profiles` rows
2. Add 2 indications → verify 2 rows in `log_patient_indications`
3. Complete Phase 1 → verify `log_phase1_consent` + `log_phase1_safety_screen` rows
4. Log dosing session + 1 re-dose → verify 2 rows in `log_dose_events` for same session
5. Submit MEQ-30 → verify `log_phase3_meq30` row
6. Log integration session attendance as "No-show" → verify `attendance_status_id` FK resolves
