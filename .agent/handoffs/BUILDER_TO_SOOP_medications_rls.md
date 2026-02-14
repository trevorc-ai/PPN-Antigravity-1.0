# BUILDER → SOOP: Fix ref_medications RLS Policies

**From:** BUILDER  
**To:** SOOP (via LEAD)  
**Date:** Feb 13, 2026, 4:43 PM PST  
**Priority:** 🔴 CRITICAL - Blocking Protocol Builder V3 completion

---

## Issue Summary

Migration `021_add_common_medications_flag.sql` ran successfully and added the `is_common` column to `ref_medications` table. However, the **frontend cannot access the table** - Supabase REST API returns **404 Not Found**.

**Error in Browser Console:**
```
GET https://rxwsthatjhnixqsthegf.supabase.co/rest/v1/ref_medications?select=*&order=is_common.desc%2Cmedication_name.asc
→ 404 (Not Found)
```

**Impact:** The "Most Common" medications section in Protocol Builder is empty, preventing users from quickly selecting the top 12 medications.

---

## Root Cause Analysis

**Hypothesis:** The `ref_medications` table has Row Level Security (RLS) enabled but **no policies** allowing `SELECT` access for `authenticated` or `anon` roles.

**Evidence:**
- Other reference tables (`ref_substances`, `ref_indications`) work fine
- Migration executed successfully (confirmed by user)
- 404 error indicates table is not exposed to API, not a data issue

---

## Required Actions

### 1. Verify RLS Status

Run this diagnostic query:
```sql
SELECT 
    tablename, 
    rowsecurity,
    (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'ref_medications') as policy_count
FROM pg_tables 
WHERE tablename = 'ref_medications' AND schemaname = 'public';
```

**Expected Result:**
- `rowsecurity` = `true` (RLS is ON)
- `policy_count` = `0` or very low (missing policies)

---

### 2. Add RLS Policies

If RLS is enabled but policies are missing, run:

```sql
-- Allow authenticated users to read medications
CREATE POLICY "Allow authenticated users to read medications"
ON public.ref_medications
FOR SELECT
TO authenticated
USING (true);

-- Allow anonymous users to read medications (for public access)
CREATE POLICY "Allow anonymous users to read medications"
ON public.ref_medications
FOR SELECT
TO anon
USING (true);
```

---

### 3. Verify API Exposure

After adding policies, verify the table is accessible:

```sql
-- Test query (should return 12 rows with is_common = true)
SELECT medication_name, is_common 
FROM public.ref_medications 
WHERE is_common = true 
ORDER BY medication_name;
```

**Expected Result:** 12 medications:
1. Alprazolam (Xanax)
2. Amphetamine/Dextroamphetamine (Adderall)
3. Bupropion (Wellbutrin)
4. Clonazepam (Klonopin)
5. Escitalopram (Lexapro)
6. Fluoxetine (Prozac)
7. Lamotrigine (Lamictal)
8. Lithium
9. Lorazepam (Ativan)
10. Quetiapine (Seroquel)
11. Sertraline (Zoloft)
12. Venlafaxine (Effexor)

---

### 4. Test API Endpoint

After fixing RLS, test the Supabase REST API endpoint directly:

```bash
curl "https://rxwsthatjhnixqsthegf.supabase.co/rest/v1/ref_medications?select=*&is_common=eq.true" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

**Expected:** Should return JSON array with 12 medications, not 404.

---

## Verification Steps

Once SOOP confirms the fix:

1. **BUILDER will refresh Protocol Builder page**
2. **Verify "Most Common" section shows 12 medication buttons**
3. **Test medication selection (buttons turn teal with checkmarks)**
4. **Update walkthrough.md with final verification**
5. **Mark Protocol Builder V3 as 100% complete**

---

## Additional Context

**Related Files:**
- Migration: [021_add_common_medications_flag.sql](file:///Users/trevorcalton/Desktop/PPN-Antigravity-1.0/migrations/021_add_common_medications_flag.sql)
- Frontend Component: [Tab2_Medications.tsx](file:///Users/trevorcalton/Desktop/PPN-Antigravity-1.0/src/components/ProtocolBuilder/Tab2_Medications.tsx)
- Browser Verification: [medication_selector_empty screenshot](file:///Users/trevorcalton/.gemini/antigravity/brain/411129a8-9b85-454c-b3d0-2f9db36c0a18/medication_selector_empty_1771028518817.png)

**Timeline:**
- Migration ran: Feb 13, 4:17 PM PST
- Issue discovered: Feb 13, 4:20 PM PST
- Handoff created: Feb 13, 4:43 PM PST
- **Target resolution:** Feb 13, 5:00 PM PST (17 min)

---

## Questions for SOOP

1. Are there existing RLS policies on other `ref_*` tables we should mirror?
2. Should we create a migration file for these RLS policies, or apply them manually?
3. Are there any other reference tables missing RLS policies?

---

**Status:** 🔴 WAITING FOR SOOP

**Next Step:** SOOP to run diagnostic query and apply RLS policies, then confirm fix.
