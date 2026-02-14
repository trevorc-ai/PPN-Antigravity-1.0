# Command #007: Execute Test Data Migration

**Date Issued:** Feb 13, 2026, 5:50 PM PST  
**Issued By:** LEAD (on behalf of User)  
**Assigned To:** SOOP  
**Priority:** P1 - IMMEDIATE EXECUTION  
**Estimated Time:** 5 minutes

---

## DIRECTIVE

Execute the test data migration `migrations/999_load_test_data.sql` in Supabase Dashboard.

**User's Question:** "How do I view test data?" - The migration exists but hasn't been executed yet.

---

## TASK

1. **Check if migration already executed:**
   - Query: `SELECT COUNT(*) FROM protocols WHERE created_by = '00000000-0000-0000-0000-000000000001';`
   - If count > 0, migration already executed → Report status
   - If count = 0, proceed to step 2

2. **Execute migration:**
   - Open Supabase Dashboard → SQL Editor
   - Copy contents of `migrations/999_load_test_data.sql`
   - Click "Run"
   - Verify: 30 protocols created

3. **Verify results:**
   - Check My Protocols page shows 30 protocols
   - Verify variety: 4 substances, 5 indications, all dosages
   - Confirm 3 adverse events visible

---

## DELIVERABLE

Report back with:
- ✅ Migration executed successfully (or already executed)
- ✅ Protocol count: 30
- ✅ Screenshot of My Protocols page showing test data

---

## NEXT TASK (QUEUED)

After completion, immediately proceed to Command #008: RLS Audit

**DO NOT WAIT FOR APPROVAL - EXECUTE IMMEDIATELY**
