---
work_order_id: WO_002
title: Init Shadow Market Schema (Ref & Log Tables)
type: DATABASE
category: Database
priority: HIGH
status: COMPLETE
created: 2026-02-14T18:57:19-08:00
reviewed_by: LEAD
reviewed_at: 2026-02-14T19:07:27-08:00
completed_by: SOOP
completed_at: 2026-02-14T21:30:00-08:00
requested_by: PPN Admin
assigned_to: SOOP
estimated_complexity: 7/10
failure_count: 0
---

# Work Order: Init Shadow Market Schema (Ref & Log Tables)

## 🎯 THE GOAL

Execute a SQL migration in Supabase to create the "Shadow Market Defense" schema.
You must create **7 tables** (3 Reference, 4 Log) and enable strict Row Level Security (RLS).

### Reference Tables (Public Read-Only)

1. **ref_substances**
   - `id` (int, primary key)
   - `name` (text)
   - `default_potency_factor` (numeric)
   - `safety_tier` (char)

2. **ref_interventions**
   - `id` (int, primary key)
   - `label` (text)
   - `ui_color_hex` (text)
   - `risk_weight` (int)

3. **ref_risk_flags**
   - `id` (int, primary key)
   - `label` (text)
   - `severity_level` (int)

### Log Tables (Private User-Only)

4. **log_sessions**
   - `id` (uuid, primary key)
   - `user_id` (uuid, foreign key to auth.users)
   - `client_blind_hash` (text)
   - `jurisdiction_code` (int)
   - `is_duress_mode` (bool)

5. **log_doses**
   - `id` (bigint, primary key)
   - `session_id` (uuid, foreign key to log_sessions)
   - `substance_id` (int, foreign key to ref_substances)
   - `weight_grams` (numeric)
   - `potency_modifier` (numeric)
   - `effective_dose_mg` (generated column)

6. **log_interventions**
   - `id` (bigint, primary key)
   - `session_id` (uuid, foreign key to log_sessions)
   - `intervention_id` (int, foreign key to ref_interventions)
   - `seconds_since_start` (int)

7. **log_risk_reports**
   - `id` (bigint, primary key)
   - `target_client_hash` (text)
   - `flag_type_id` (int, foreign key to ref_risk_flags)

### Security Requirements

- **Enable RLS on all tables**
- **Create Policies:** `auth.uid() = user_id` for all `log_*` tables
- **Create RPC function:** `check_client_risk(client_hash)` to count risk flags without revealing rows

---

## 🎯 THE BLAST RADIUS (Authorized Target Area)

You are ONLY allowed to modify the following specific files/areas:

- `supabase/migrations/` - Create a new migration file (e.g., `XXX_shadow_market_schema.sql`)
- `supabase/seed.sql` - Add initial data for `ref_substances` and `ref_interventions`

---

## ⚡ THE ELECTRIC FENCE (Strict "DO NOT TOUCH" Constraints)

**DO NOT:**
- Add any TEXT or VARCHAR columns to the `log_*` tables (other than UUIDs/Hashes)
- Disable RLS on any table
- Store any PII (names, emails, notes) in the database
- Modify existing migration files
- Touch any application code (src/, components/, pages/)
- Modify existing tables or schemas

**MUST:**
- Ensure all foreign keys cascade delete where appropriate
- Follow existing migration naming conventions
- Test RLS policies before marking complete

---

## ✅ Acceptance Criteria

- [ ] Migration file created with proper naming convention
- [ ] All 7 tables created with correct schema
- [ ] RLS enabled on all 7 tables
- [ ] RLS policies created for all `log_*` tables (user_id check)
- [ ] RPC function `check_client_risk(client_hash)` created and tested
- [ ] Seed data added for `ref_substances` and `ref_interventions`
- [ ] All foreign keys have proper cascade delete rules
- [ ] Migration runs successfully without errors
- [ ] No TEXT/VARCHAR columns in log tables (except UUIDs/hashes)
- [ ] Zero PII stored anywhere in schema

---

## 🧪 Testing Requirements

- [ ] Run migration in local Supabase instance
- [ ] Verify RLS policies block unauthorized access
- [ ] Test `check_client_risk()` RPC function
- [ ] Verify foreign key cascades work correctly
- [ ] Confirm seed data loads properly

---

## 📝 MANDATORY COMPLIANCE

### ACCESSIBILITY
N/A (Database task)

### SECURITY
**Zero-Knowledge Architecture**
- No plain-text user data
- No PII storage (names, emails, notes)
- RLS enforced on all tables
- User isolation via `auth.uid()` policies

---

## 🚦 Status

**INBOX** - Ready for SOOP assignment

---

## Workflow

1. ⏳ CUE creates work order → **CURRENT STEP**
2. ⏳ SOOP reviews and accepts
3. ⏳ SOOP creates migration file
4. ⏳ SOOP tests migration locally
5. ⏳ SOOP creates seed data
6. ⏳ User approves and deploys to production

---

## 📋 Notes

- This is **Prompt 1: The Foundation** - must be completed before other Shadow Market features
- Migration should be idempotent (safe to run multiple times)
- Consider adding created_at/updated_at timestamps to log tables
- Ensure proper indexing on foreign keys for performance
