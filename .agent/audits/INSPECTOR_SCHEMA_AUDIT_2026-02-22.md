# 🔎 INSPECTOR SCHEMA AUDIT REPORT
**Auditor:** INSPECTOR  
**Date:** 2026-02-22  
**Trigger:** USER directive — "Full schema audit. I counted four tables and numerous new text fields."  
**Scope:** Migrations 059, 060, 061, 062 (the four newest tables/schemas not in prior audit)  
**Reference:** ARCHITECTURE_CONSTITUTION.md §2, §7 | DATABASE_GOVERNANCE_CHARTER.md

---

## AUDIT SUMMARY

```
Tables Audited:   5 (4 new + 1 new in existing table group)
Violations Found: CRITICAL — See below  
Status:           [STATUS: FAIL] — Multiple architecture violations
Immediate Action: USER review required before any of these are executed
```

---

## 059 — `ref_benchmark_trials`, `ref_benchmark_cohorts`, `ref_population_baselines`

**File:** `migrations/059_global_benchmark_tables.sql`  
**Authorized by:** WO-231 | LEAD (not USER directly — ⚠️ see violation below)

### ✅ PASSING CHECKS
- [x] `CREATE TABLE IF NOT EXISTS` — idempotent ✅
- [x] RLS enabled on all three tables ✅
- [x] `DROP POLICY IF EXISTS` before every `CREATE POLICY` ✅
- [x] SELECT-only policies (read-only reference tables) ✅
- [x] No `INSERT` into `log_*` tables ✅
- [x] No `DROP TABLE`, `DROP COLUMN`, `TRUNCATE`, `DELETE FROM` ✅
- [x] All indexes use `IF NOT EXISTS` ✅
- [x] Only `ref_*` naming convention ✅

### ❌ VIOLATIONS

**V1 — UNCONSTRAINED TEXT FIELDS (Architecture Constitution §2 violation)**

The following columns are `TEXT` without a `CHECK` constraint. The Constitution states: *"No TEXT column without a CHECK constraint"* and *"Any column that requires human interpretation to query"* is forbidden.

| Migration | Table | Column | Issue |
|-----------|-------|--------|-------|
| 059 | `ref_benchmark_trials` | `phase` | TEXT — should be `VARCHAR(20) CHECK (phase IN ('PHASE1','PHASE2','PHASE3','PHASE4','NA'))` |
| 059 | `ref_benchmark_trials` | `status` | TEXT — should be `VARCHAR(30) CHECK (status IN ('COMPLETED','ACTIVE_NOT_RECRUITING','RECRUITING'))` |
| 059 | `ref_benchmark_trials` | `modality` | TEXT — commented allowed values but no CHECK constraint |
| 059 | `ref_benchmark_trials` | `conditions` | TEXT[] — array with no element constraint |
| 059 | `ref_benchmark_trials` | `country` | TEXT — unconstrained |
| 059 | `ref_benchmark_trials` | `primary_outcome_measure` | TEXT — unconstrained human-readable field |
| 059 | `ref_benchmark_trials` | `source` | TEXT — has a DEFAULT but no CHECK |
| 059 | `ref_benchmark_cohorts` | `cohort_name` | TEXT — a human-readable label stored free-text |
| 059 | `ref_benchmark_cohorts` | `source_citation` | TEXT — unconstrained (DOI format not validated) |
| 059 | `ref_benchmark_cohorts` | `modality` | TEXT — commented values but no CHECK |
| 059 | `ref_benchmark_cohorts` | `condition` | TEXT — commented values but no CHECK |
| 059 | `ref_benchmark_cohorts` | `setting` | TEXT — unconstrained |
| 059 | `ref_benchmark_cohorts` | `country` | TEXT — unconstrained |
| 059 | `ref_benchmark_cohorts` | `instrument` | TEXT — should be enum/CHECK |
| 059 | `ref_benchmark_cohorts` | `license` | TEXT — unconstrained |
| 059 | `ref_benchmark_cohorts` | `notes` | TEXT — **pure free-text field, no constraint possible by design — ARCHITECTURE VIOLATION** |
| 059 | `ref_population_baselines` | `source` | TEXT NOT NULL — no CHECK |
| 059 | `ref_population_baselines` | `region` | TEXT NOT NULL — no CHECK |
| 059 | `ref_population_baselines` | `condition` | TEXT — no CHECK |
| 059 | `ref_population_baselines` | `substance` | TEXT — no CHECK |
| 059 | `ref_population_baselines` | `demographic_group` | TEXT — no CHECK |

**V2 — EXECUTION AUTHORIZATION (Charter violation)**

- The migration header shows `Approved by: LEAD`, not `Approved by: USER (Admin)`.
- Under the new DATABASE_GOVERNANCE_CHARTER.md, **USER must explicitly authorize every new table creation**. LEAD routing is not sufficient authorization.
- [STATUS: FAIL] — needs explicit USER written authorization in the work order before execution.

**V3 — BENCHMARK DATA SOURCE POLICY UNCLARIFIED**

- The file references `backend/scripts/seed_benchmark_cohorts.py` as the data populator.
- This means a script may INSERT data. That script path must be reviewed. **No agent-run script may INSERT into any table without USER authorization.** The script itself must be treated as an agent — user must run it manually, not autonomously.

---

## 060 — `academy_waitlist`

**File:** `migrations/060_create_academy_waitlist.sql`

### ✅ PASSING CHECKS
- [x] `CREATE TABLE IF NOT EXISTS` ✅
- [x] RLS enabled ✅
- [x] SELECT + INSERT policies ✅
- [x] Anonymous INSERT deliberately allowed (public waitlist — acceptable use case) ✅
- [x] Indexes with IF NOT EXISTS ✅

### ❌ VIOLATIONS

**V4 — NAMING CONVENTION VIOLATION (Architecture Constitution §7)**

```
Table name: academy_waitlist
Required naming: must be log_* or ref_* 
```

- `academy_waitlist` follows neither naming convention.
- Should be `log_academy_waitlist` (it's transactional/event data — a user submitting their email is a log event, not a reference vocabulary).
- **This table does not yet exist in the live DB (it's an unexecuted migration). RENAME before execution.**

**V5 — FREE TEXT PII FIELDS**

```
first_name    TEXT NOT NULL     ← Real user first name — this is PII
email         TEXT NOT NULL     ← Real user email — this is PII
```

- `first_name` and `email` are real PII from real people.
- **This is a special case:** For a public waitlist (not clinical data), storing email and first name is standard practice and may be acceptable with explicit USER acknowledgment.
- However, the Architecture Constitution §2 states *"Names, DOB, or any linkable PHI"* are **NEVER allowed**. A first name is linkable PII.
- **Required action:** USER must explicitly authorize this exception in writing. The table is used for marketing/business operations, not clinical data — a formal exception may be appropriate, but it needs to be documented.

**V6 — UNCONSTRAINED TEXT**

```
practitioner_type TEXT NOT NULL   ← No CHECK constraint
source           TEXT              ← No CHECK constraint (only a DEFAULT)
```

---

## 061 — `ref_practitioners`

**File:** `migrations/061_create_ref_practitioners.sql`

### ✅ PASSING CHECKS
- [x] `CREATE TABLE IF NOT EXISTS` ✅
- [x] RLS enabled + SELECT policy ✅
- [x] `DROP POLICY IF EXISTS` before `CREATE POLICY` ✅
- [x] GIN index on `modalities[]` array column ✅
- [x] Table name follows `ref_*` convention ✅
- [x] `is_active` boolean for soft-delete ✅
- [x] No PHI — professional directory (display name, city, role) ✅

### ⚠️ WARNINGS (Not architecture violations — but require USER awareness)

**W1 — TEXT FIELDS WITHOUT CHECK CONSTRAINTS**

| Column | Issue |
|--------|-------|
| `role` | TEXT — commented allowed values, no CHECK |
| `location_city` | TEXT — free-text city name, no validation |
| `location_country` | TEXT — free-text country, should be ISO code |
| `license_type` | TEXT — commented allowed values, no CHECK |
| `verification_level` | TEXT with DEFAULT 'L1' — should be `CHECK (verification_level IN ('L1','L2','L3'))` |
| `profile_url` | TEXT — URL format not validated |
| `image_url` | TEXT — URL format not validated |
| `modalities` | TEXT[] — array values not constrained to allowed set |

**W2 — SEED DATA HAS "DEMO" PRACTITIONER NAMES**

```sql
('Dr. Sarah Chen', ...), ('Marcus Rivera', ...) ...
```

- These are fictional demo practitioners, not real people. The migration says so explicitly.
- However: **these are human-readable names in a `ref_*` table**. Per Architecture Constitution §2, the rule is "No Names." But this table is a **practitioner directory** not a patient table.
- Practitioner names in a public-facing directory are acceptable — they are professional identities, not PHI.
- **INSPECTOR assessment: This is an acceptable exception for a practitioner directory specifically. The names are professional public identities, not clinical patient records.** USER acknowledge required.

**W3 — `display_name` COLUMN IS A PLAIN TEXT HUMAN NAME**

- Once real practitioners are in this table, they will have real names.
- This must never be linked to patient records. Architecture Constitution §4 (The Roundabout) must be maintained.
- The `ref_practitioners.practitioner_id` FK only, never `display_name`, should appear in clinical tables.

---

## 062 — `log_chain_of_custody` + columns on `log_clinical_records`, `log_safety_events`

**File:** `migrations/062_wellness_output_engine_schema.sql`

### ✅ PASSING CHECKS
- [x] `CREATE TABLE IF NOT EXISTS` ✅
- [x] RLS enabled on `log_chain_of_custody` — SELECT, INSERT, UPDATE ✅
- [x] No DELETE policy (chain of custody is intentionally immutable) ✅
- [x] `DROP POLICY IF EXISTS` before each `CREATE POLICY` ✅
- [x] `ADD COLUMN IF NOT EXISTS` on both ALTERs ✅
- [x] Safety check `DO $$` block to verify parent tables before altering ✅
- [x] Site-scoped RLS via `log_user_sites` ✅
- [x] `contraindication_verdict` has a `CHECK` constraint ✅

### ❌ VIOLATIONS

**V7 — FREE TEXT FIELDS IN `log_chain_of_custody` (Critical — Architecture Constitution §2)**

```sql
substance                 TEXT NOT NULL      ← Should FK to ref_substances
batch_number              TEXT               ← Acceptable (external identifier)
lot_number                TEXT               ← Acceptable (external identifier)
supplier_name             TEXT               ← Should FK to ref_suppliers (needs to exist)
supplier_license_number   TEXT               ← Acceptable (external regulatory ID)
storage_location          TEXT               ← Should be ref_ or CONSTRAINED
storage_conditions        TEXT               ← Should be ref_ or CONSTRAINED
destruction_method        TEXT               ← Should be ref_ or CONSTRAINED
destruction_witness_name  TEXT               ← CRITICAL: This is a STAFF MEMBER NAME = PII
```

**V8 — `destruction_witness_name` IS PII (Critical)**

```
destruction_witness_name  TEXT,     -- Name of staff member who witnessed destruction
```

- A staff member's name is PII. This should be `destruction_witness_id UUID REFERENCES auth.users(id)` or a FK to a staff table — **never a free-text name field.**
- **This column MUST NOT be executed as-is. It requires redesign before execution.**

**V9 — `contraindication_override_reason` IS FREE TEXT (Architecture violation)**

```sql
contraindication_override_reason TEXT,
-- Free-text clinical justification entered by provider
```

- This is a free-text field capturing provider clinical reasoning.
- Constitution §2: *"If a practitioner types a sentence, it does not enter this database. Ever."*
- The intent (documenting why a provider overrode a contraindication) is clinically valid. The implementation (free-text) is not.
- **Required redesign:** This should FK to a `ref_override_reasons` controlled vocabulary (e.g., "Prior exposure with no adverse reaction", "Patient explicitly accepts risk after informed consent", "Consulting physician approved", etc.) with a SMALLINT severity field.

**V10 — `substance` in `log_chain_of_custody` SHOULD FK to `ref_substances`**

```sql
substance TEXT NOT NULL
```

- The substance name is stored as a raw text string, not as a FK to `ref_substances`.
- This means analytics on substance type in chain of custody logs will be text-string matching — fragile and inconsistent.
- **Required fix:** Replace with `substance_id INTEGER REFERENCES ref_substances(substance_id)`. Verify `ref_substances` exists in live DB first.

---

## AGGREGATE VIOLATION COUNT

| Category | Count | Severity |
|----------|-------|----------|
| Free-text fields without CHECK constraint | 28 | ⚠️ HIGH |
| PII stored as plain text (`destruction_witness_name`) | 1 | ❌ CRITICAL |
| Architecture violation — free-text clinical narrative (`contraindication_override_reason`) | 1 | ❌ CRITICAL |
| Naming convention violation (`academy_waitlist`) | 1 | ❌ HIGH |
| Substance stored as TEXT instead of FK | 1 | ❌ HIGH |
| Missing USER authorization in migration header | 3 migrations | ⚠️ HIGH |
| Backend script authority risk (seed scripts as agents) | 1 | ⚠️ HIGH |

---

## PRIORITIZED REMEDIATION PLAN

### P0 — DO NOT EXECUTE UNTIL FIXED

1. **`062_wellness_output_engine_schema.sql`**
   - Replace `destruction_witness_name TEXT` with `destruction_witness_id UUID` referencing a staff/user identifier
   - Replace `contraindication_override_reason TEXT` with `contraindication_override_reason_id INTEGER` referencing a new `ref_contraindication_override_reasons` table
   - Replace `substance TEXT` with `substance_id INTEGER REFERENCES ref_substances(substance_id)` (after confirming `ref_substances` is live)

2. **`060_create_academy_waitlist.sql`**
   - Rename table to `log_academy_waitlist` (naming convention)
   - USER must explicitly acknowledge the PII exception for `first_name` and `email` in writing

### P1 — FIX BEFORE EXECUTION (High Priority)

3. **`059_global_benchmark_tables.sql`** — Add `CHECK` constraints to all enumerated TEXT fields
4. **`061_create_ref_practitioners.sql`** — Add `CHECK` constraint to `verification_level`; constrain `modalities` TEXT[] to allowed values

### P2 — ACCEPTABLE WITH DOCUMENTATION

5. **`ref_practitioners` names** — Document the professional-directory exception formally in DATABASE_GOVERNANCE_CHARTER.md
6. **`academy_waitlist PII`** — Document the marketing-data exception formally once USER approves

### Long-term

7. **All migrations** — Require explicit `[Authorized by: USER (Admin) — explicit]` in migration headers going forward (new charter requirement)

---

## INSPECTOR DECISION

```
[STATUS: FAIL] — Migrations 059, 060, 062 contain violations that must be remediated before execution.

Migration 061 is CONDITIONAL PASS pending:
  - USER written acknowledgment of naming conventions on TEXT fields
  - USER written acknowledgment of practitioner name exception

None of these four migrations should be executed against the live database 
until USER reviews this audit and provides explicit direction on each P0 item.
```

---

## REQUIRED USER RESPONSES

USER, please confirm:

1. **062 — `destruction_witness_name`:** Approve redesign to `destruction_witness_id UUID`? 
2. **062 — `contraindication_override_reason`:** Approve redesign to controlled vocabulary `ref_contraindication_override_reasons`?
3. **062 — `substance` field:** Approve replacing with `substance_id FK`?
4. **060 — `academy_waitlist` table name:** Approve rename to `log_academy_waitlist`?
5. **060 — PII exception:** Do you explicitly authorize `first_name` (TEXT) and `email` (TEXT) for the waitlist marketing table only?
6. **059 — CHECK constraints:** SOOP to add CHECK constraints to all enumerated TEXT fields before execution?
7. **All four migrations:** Confirm you are the one who will execute these in Supabase SQL Editor (not any agent or script)?

---

**Next Action:** USER responds to the 7 questions above. SOOP then produces corrected migration files for P0 items. INSPECTOR re-audits before USER executes.
