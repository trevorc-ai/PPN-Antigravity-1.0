# Command #007: Test Data Migration Status

## Quick Check

**Run this query in Supabase Dashboard to check status:**

```sql
-- Check if test data already loaded
SELECT COUNT(*) as test_protocol_count
FROM protocols
WHERE created_by = '00000000-0000-0000-0000-000000000001';
```

**Expected Results:**
- **If count = 0:** Test data NOT loaded → Execute `migrations/999_load_test_data.sql`
- **If count = 30:** Test data ALREADY loaded → Skip execution

---

## If Test Data NOT Loaded (count = 0)

### Execute Migration

1. Go to: https://supabase.com/dashboard/project/rxwsthatjhnixqsthegf/sql
2. Copy entire contents of `migrations/999_load_test_data.sql`
3. Click "Run"
4. Verify: Should see "30 rows inserted" or similar success message

### Verification Queries

After execution, run these to verify:

```sql
-- 1. Count protocols (should be 30)
SELECT COUNT(*) FROM protocols WHERE created_by = '00000000-0000-0000-0000-000000000001';

-- 2. Verify substance variety (should show 4 substances)
SELECT s.substance_name, COUNT(*) as count
FROM protocols p
JOIN ref_substances s ON p.substance_id = s.substance_id
WHERE p.created_by = '00000000-0000-0000-0000-000000000001'
GROUP BY s.substance_name
ORDER BY s.substance_name;

-- 3. Verify adverse events (should be 3)
SELECT COUNT(*) FROM protocols 
WHERE created_by = '00000000-0000-0000-0000-000000000001'
AND adverse_events IS NOT NULL;

-- 4. Verify date range
SELECT 
  MIN(session_date) as earliest,
  MAX(session_date) as latest,
  COUNT(*) as total
FROM protocols
WHERE created_by = '00000000-0000-0000-0000-000000000001';
```

---

## If Test Data ALREADY Loaded (count = 30)

✅ **Status:** Test data migration already executed  
✅ **Protocol Count:** 30  
✅ **Test User ID:** `00000000-0000-0000-0000-000000000001`

**No action needed.** Proceed to Command #008 (RLS Audit).

---

## View Test Data in UI

After test data is loaded:

1. Go to **My Protocols** page
2. You should see 30 test protocols
3. Filter by substance to verify variety:
   - Psilocybin: 8 protocols
   - MDMA: 8 protocols
   - Ketamine: 7 protocols
   - LSD: 7 protocols

---

## Cleanup (When Testing Complete)

To remove all test data:

```sql
BEGIN;
DELETE FROM protocols WHERE created_by = '00000000-0000-0000-0000-000000000001';
DELETE FROM patients WHERE site_id = 999;
DELETE FROM user_sites WHERE site_id = 999;
DELETE FROM sites WHERE site_id = 999;
DELETE FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000001';
COMMIT;
```

---

**Next:** Proceed to Command #008 (RLS Audit)
