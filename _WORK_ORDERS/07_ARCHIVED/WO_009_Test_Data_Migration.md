---
work_order_id: WO_009
title: Execute Test Data Migration
type: DATABASE
category: Database
priority: LOW
status: ARCHIVED
created: 2026-02-14T21:40:26-08:00
reviewed_by: LEAD
reviewed_at: 2026-02-14T22:41:56-08:00
requested_by: PPN Admin
assigned_to: SOOP
estimated_complexity: 2/10
failure_count: 0
archived_date: 2026-02-15T17:08:24-08:00
archived_reason: Schema mismatch - references non-existent tables (protocols, patients, subjects). Superseded by 002_seed_demo_data_v2.2.sql which matches current schema (log_protocols, system-generated IDs).
---

# Work Order: Execute Test Data Migration

## 🎯 THE GOAL

Execute the existing test data migration file to populate the database for the demo.

1. **Verify** if `migrations/999_load_test_data.sql` has been run
2. **If not**, execute the SQL to load protocols, subjects, and session data
3. **Verify** data visibility in the protocols table

---

## 🎯 THE BLAST RADIUS (Authorized Target Area)

You are ONLY allowed to modify the following specific files/areas:

- Supabase SQL Editor / Query Runner
- `migrations/999_load_test_data.sql` (Read-only execution)

---

## ⚡ THE ELECTRIC FENCE (Strict "DO NOT TOUCH" Constraints)

**DO NOT:**
- Modify the structure of existing tables
- Delete existing production data (if any)
- Run this migration if the test data already exists (Count > 0)
- Modify the migration file itself
- Touch any application code

**MUST:**
- Check if data already exists before running
- Verify test data contains no real PII
- Confirm successful execution

---

## ✅ Acceptance Criteria

- [ ] Check if test data already exists in database
- [ ] If no data exists, execute `999_load_test_data.sql`
- [ ] Verify protocols table has test data
- [ ] Verify subjects table has test data
- [ ] Verify session data is visible
- [ ] Confirm no real PII in test data
- [ ] Document execution results

---

## 🧪 Testing Requirements

- [ ] Query protocols table to verify data loaded
- [ ] Count rows in key tables
- [ ] Verify foreign key relationships intact
- [ ] Confirm RLS policies don't block test data visibility

---

## 📝 MANDATORY COMPLIANCE

### ACCESSIBILITY
N/A (Database task)

### SECURITY
- **Ensure test data does not contain real PII**
- No real names, emails, or identifiable information
- Use synthetic/anonymized data only

---

## 🚦 Status

**INBOX** - Ready for SOOP assignment

---

## 📋 Technical Notes

### Pre-Execution Check
```sql
-- Check if test data already exists
SELECT COUNT(*) FROM protocols;
SELECT COUNT(*) FROM subjects;

-- Only proceed if counts are 0
```

### Execution Steps
1. Open Supabase SQL Editor
2. Load `migrations/999_load_test_data.sql`
3. Review SQL for any PII
4. Execute migration
5. Verify data loaded successfully

### Post-Execution Verification
```sql
-- Verify protocols loaded
SELECT id, protocol_name FROM protocols LIMIT 5;

-- Verify subjects loaded
SELECT id, subject_id FROM subjects LIMIT 5;

-- Check row counts
SELECT 
  (SELECT COUNT(*) FROM protocols) as protocol_count,
  (SELECT COUNT(*) FROM subjects) as subject_count;
```

---

## Dependencies

None - This is a standalone database task.

---

## 🔍 SOOP REVIEW (2026-02-15T01:19:00-08:00)

**Reviewed By:** SOOP  
**Status:** ⚠️ **SCHEMA MISMATCH DETECTED**

### Critical Issue

The test data migration file `999_load_test_data.sql` references tables that **do not exist** in our current schema:

**File References:**
- `protocols` table
- `patients` table
- `subjects` table

**Actual Schema:**
- `log_protocols` (from Protocol Builder migrations)
- No standalone `patients` table (we use `subject_id` in log tables)
- No standalone `subjects` table

### Impact

This migration **cannot be executed** without either:
1. Rewriting the test data to match current schema
2. Creating the missing tables (not recommended - breaks schema consistency)
3. Marking this work order as obsolete

### Recommendation

**INSPECTOR should review and decide:**
- Should WO_009 be rewritten to match current schema?
- Should WO_009 be marked as obsolete/archived?
- Is there a different test data strategy needed?

**SOOP VERDICT:** Cannot proceed with execution until schema alignment is resolved.
