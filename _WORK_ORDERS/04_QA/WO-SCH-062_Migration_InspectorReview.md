---
id: WO-SCH-062
title: "Schema Migration 062 — Wellness Output Engine (WO-309 + WO-313)"
status: 04_QA
owner: INSPECTOR
created: 2026-02-21
created_by: LEAD
failure_count: 0
priority: P0_CRITICAL
tags: [schema, migration, additive-only, rls, chain-of-custody, contraindication]
migration_file: migrations/062_wellness_output_engine_schema.sql
depends_on: [WO-309, WO-313]
blocks: [WO-309, WO-313]
---

# WO-SCH-062: Schema Migration 062 — INSPECTOR Review

## INSPECTOR: This ticket is routed to you BEFORE execution.
## The migration file exists at: `migrations/062_wellness_output_engine_schema.sql`
## DO NOT execute — review only. USER executes in Supabase dashboard.

---

## What This Migration Does

### Section A — WO-309: Additive columns on existing tables

**Table: `log_clinical_records`** — adds 3 columns:
- `contraindication_verdict TEXT` CHECK IN ('CLEAR','PROCEED_WITH_CAUTION','DO_NOT_PROCEED')
- `contraindication_override_reason TEXT` — stored when provider proceeds despite relative flags
- `contraindication_assessed_at TIMESTAMPTZ`

**Table: `log_safety_events`** — adds 3 columns:
- `report_pdf_url TEXT` — URL of auto-generated AE incident report PDF
- `report_generated_at TIMESTAMPTZ`
- `ctcae_grade SMALLINT` CHECK BETWEEN 1 AND 5

### Section B — WO-313: New table

**New table: `log_chain_of_custody`**
- Tracks controlled substance receipt → administration → waste destruction
- 3 RLS policies (SELECT / INSERT / UPDATE — intentionally NO DELETE)
- 4 indexes: site_id, session_id, session_date DESC, substance

---

## INSPECTOR Audit Checklist

### Additive-Only Policy Compliance
- [ ] Zero `DROP TABLE` statements
- [ ] Zero `DROP COLUMN` statements
- [ ] Zero `ALTER COLUMN ... TYPE` statements
- [ ] All columns use `ADD COLUMN IF NOT EXISTS`
- [ ] New table uses `CREATE TABLE IF NOT EXISTS`

### RLS Compliance
- [ ] `log_chain_of_custody` has `ENABLE ROW LEVEL SECURITY`
- [ ] 3 site-scoped RLS policies exist (SELECT, INSERT, UPDATE)
- [ ] No DELETE policy — intentional (chain of custody records are immutable)
- [ ] RLS policies reference `user_profiles.site_id` via `auth.uid()` — confirm `user_profiles` table exists with a `site_id` column and `user_id` column

### Naming Conventions
- [ ] Table name uses `log_` prefix (runtime/transactional data) ✓
- [ ] All column names are snake_case ✓
- [ ] No column name conflicts with existing `log_clinical_records` or `log_safety_events` columns

### Constraint Safety
- [ ] `contraindication_verdict` CHECK constraint is limited to 3 valid values
- [ ] `ctcae_grade` CHECK is BETWEEN 1 AND 5 (CTCAE v5.0 range)
- [ ] `route` CHECK limits to 6 valid values (prevents free-text junk data)
- [ ] No NOT NULL constraints on optional fields (all optional columns are nullable)

### PHI / PII Compliance
- [ ] `log_chain_of_custody.patient_link_code` is the correct Subject_ID field — NOT a real patient name or DOB
- [ ] No email, SSN, DOB, or full name columns exist on new table
- [ ] Column comments document the privacy intent for `patient_link_code`

### Pre-flight Live Schema Check
INSPECTOR: Before approving, confirm these tables exist in live Supabase:
- [ ] `public.log_clinical_records` — migration adds columns to this
- [ ] `public.log_safety_events` — migration adds columns to this
- [ ] `public.user_profiles` — referenced in RLS policies (must have `user_id` + `site_id` columns)

Verification queries are included at the bottom of the migration file (Section C, V1–V5).
Run these AFTER migration executes to confirm success.

### Trigger Safety
- [ ] `set_updated_at()` function uses `CREATE OR REPLACE` — safe to re-run
- [ ] Trigger uses `DROP TRIGGER IF EXISTS` before `CREATE TRIGGER` — idempotent

---

## INSPECTOR Decision

### If PASS:
- Update frontmatter: `status: 05_USER_REVIEW`, `owner: USER`
- Move ticket to `_WORK_ORDERS/05_USER_REVIEW/`
- Note: USER must execute `migrations/062_wellness_output_engine_schema.sql` in Supabase SQL editor
- After USER confirms execution, BUILDER can proceed with WO-309 and WO-313

### If FAIL:
- Increment `failure_count`
- Append `## [STATUS: FAIL] - INSPECTOR REJECTION` with specific SQL line numbers
- Update `owner: LEAD`, move to `_WORK_ORDERS/01_TRIAGE/`
- Do NOT route to SOOP — LEAD will re-architect

---

## Notes for USER Execution

When executing in Supabase SQL editor:
1. Run the entire file as one transaction
2. Check for the DO $$ block output — if it raises EXCEPTION, a parent table is missing
3. Run the V1–V5 verification queries after to confirm success
4. Report back row counts to confirm 3 / 3 / 1 / 3 / 4+ as documented
