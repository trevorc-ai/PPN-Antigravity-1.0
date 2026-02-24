---
id: WO-414
status: 01_TRIAGE
owner: SOOP
priority: P0
failure_count: 0
created: 2026-02-24
tags: [database, schema, refactor, forensic-audit, compliance, soop, inspector]
---

## LEAD ARCHITECTURE
- **Routing:** Route to `03_BUILD` securely wrapped in the hands of `owner: SOOP` for audit, then immediately to `owner: INSPECTOR` in `04_QA`. Finally, must block in `05_USER_REVIEW` for the CEO to approve the update plan.
- **Context:** The database schema has suffered from rapid MVP iteration (e.g., the `academy_waitlist` table name violating zero-feature-name policies). The CEO demands an absolute airtight, 100% compliant, locked-down database. There must not be the slightest hint of sloppy management, as this schema will be presented to medical advisors and legal counsel.
- **Objective:** SOOP will perform a 100% full forensic table-by-table, field-by-field audit of the entire Supabase database. He will generate a comprehensive "Update Plan" document detailing exactly what violates the Architecture Constitution and the exact additive SQL migrations needed to reach 100% compliance. 

# WO-414: Comprehensive Database Forensic Audit & Schema Lockdown

## User Command (verbatim)
"Please modify that work order for soop to include a 100% full forensic table by table, field by field audit of the entire database, have it forwarded to inspector for review, and an update plan presented to me. If I have to present a copy of the database outputs tomorrow to Dr. Jason Allen, or an attorney, or anyone else, I don't want even the slightest hint of anything other than an absolute solid, tightly locked down, 100% compliant database."

## Step 1: SOOP - Forensic Audit (Table-by-Table)
Perform a rigorous analysis of the live schema (or the schema representations in our codebase) to identify:
1. **Naming Convention Violations:** Any table named after a specific feature (like `academy_waitlist`) rather than generic system functions (e.g., `sys_waitlist`).
2. **Data Integrity Violations:** Any free-text fields where an enum or `ref_` foreign key should exist.
3. **PHI/PII Violations:** Ensure Absolute Zero PHI compliance. Patient IDs must be UUIDs, no free-text clinical notes in shared analytical tables.
4. **Boolean/Log Violations:** Ensure all longitudinal/state-change data is stored in `Log_` tables (insert-only) rather than updated in place.
5. **Security/RLS:** Verify every single application table has Row Level Security (RLS) enabled and tightly scoped policies.

## Step 2: SOOP - The Update Plan
Write a detailed report inside this ticket (`## FINAL UPDATE PLAN FOR CEO APPROVED REVIEW`) that outlines:
- Tables to be safely migrated/renamed (additive migrations only, NO destructive drops without a dual-phase rollout).
- Columns to be typed from `text` to `uuid` Foreign Keys.
- The exact SQL migration script needed to execute the fixes.

## Step 3: INSPECTOR - Strict Review
INSPECTOR must audit SOOP's proposed plan against the **Database Architecture Constitution** (`/schema-change-policy`). If the plan has missing indexes, destructive drops, or misses the `academy_waitlist` fix, REJECT IT.

## Step 4: CEO Approval
Once INSPECTOR passes the SQL and the Plan, the ticket routes to `05_USER_REVIEW`. NO SQL is to be executed against the live Supabase project until the CEO explicitly signs off on the Update Plan.
