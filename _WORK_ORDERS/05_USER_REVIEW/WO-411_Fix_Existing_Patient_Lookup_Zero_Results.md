---
id: WO-411
status: 03_BUILD
owner: BUILDER
priority: CRITICAL — DEMO BLOCKER
failure_count: 0
created: 2026-02-23
source: User-reported bug during live testing (screenshot provided)
demo_deadline: Dr. Allen demo (target Wednesday 2/25/26)
---

# WO-411 — Fix: Existing Patient Lookup Returns Zero Results

## BUG REPORT
**User reports:** Clicking "Existing Patient" on the Patient Select Modal returns zero results.
**Screenshot confirms:** "0 of 0 patients" / "0 patients on record · Live data" / "No patients found for this site"

This is a **DEMO BLOCKER** — without existing patient lookup, it's impossible to demonstrate the returning patient / follow-up session flow for Dr. Allen.

---

## LEAD DIAGNOSIS

### The Query Chain (as coded in `PatientSelectModal.tsx` + `identity.ts`)

```
1. getCurrentSiteId() 
   → supabase.auth.getSession()            # get current user.id
   → log_user_sites WHERE user_id = X      # find their site_id
   → returns: site_id UUID or NULL

2. fetchPatients()
   → log_clinical_records WHERE site_id = [result above]
   → groups by patient_link_code
   → populates the modal list
```

### Root Cause — 3 Possible Failure Points (BUILDER must check all three)

#### Failure Point A — `log_user_sites` has no row for this user (MOST LIKELY)
`getCurrentSiteId()` returns `null` when no site membership exists. Looking at the code in `PatientSelectModal.tsx` lines 104–106:

```typescript
if (siteId) {
    query = query.eq('site_id', siteId);
}
```

If `siteId` is `null`, the `.eq()` filter is skipped — meaning the query runs **without** a `site_id` filter. This should return ALL records... unless `log_clinical_records` itself is empty, OR the RLS policy blocks cross-site reads regardless.

**Check:** Does the current logged-in user have a row in `log_user_sites`? Run this in Supabase SQL editor:
```sql
SELECT * FROM log_user_sites WHERE user_id = auth.uid();
```
If no results: the user has no site. Either seed one, or fix the registration flow.

#### Failure Point B — `log_clinical_records` has no data with a valid `patient_link_code`
Patients may have been created via new patient flow but the `patient_link_code` column was never written (NULL), or the session was abandoned before being saved.

**Check:**
```sql
SELECT patient_link_code, site_id, session_date, session_type 
FROM log_clinical_records 
ORDER BY session_date DESC 
LIMIT 20;
```
If empty: no sessions have ever been successfully committed to `log_clinical_records`.

#### Failure Point C — RLS Policy on `log_clinical_records` blocking the read
Even if data exists, if the RLS SELECT policy requires `site_id = (SELECT site_id FROM log_user_sites WHERE user_id = auth.uid())`, and no `log_user_sites` row exists, RLS will silently return 0 rows.

**Check:**
```sql
SELECT COUNT(*) FROM log_clinical_records;
```
Then disable RLS temporarily in SQL editor (NOT in production — for diagnosis only):
```sql
SET LOCAL row_security = off;
SELECT COUNT(*) FROM log_clinical_records;
```
If the second query returns more rows: RLS is the blocker.

---

## FIX STRATEGY

### Priority 1 — Ensure `log_user_sites` has a row for the logged-in practitioner

If `getCurrentSiteId()` is returning null because the user has no site assignment, the fix is:

**Option A (Preferred — Graceful Fallback):** If no site is found in `log_user_sites`, auto-assign the user to a default site on first login. This should already exist in the registration/onboarding flow. If it doesn't, create it:

```typescript
// In identity.ts or auth callback — after confirming no site exists:
const defaultSiteId = crypto.randomUUID(); // or a pre-seeded site UUID
await supabase.from('log_user_sites').insert({ 
  user_id: userId, 
  site_id: defaultSiteId,
  role: 'practitioner'  // or whatever the role column is called
});
```

**Option B (Quick Fix for Demo):** Seed a row directly in Supabase for the test user:
```sql
INSERT INTO log_user_sites (user_id, site_id) 
VALUES (
  '[your-auth-uid]',   -- get from: SELECT auth.uid()
  gen_random_uuid()    -- or use an existing site_id
);
```

### Priority 2 — Verify `log_clinical_records` actually has committed rows

If Failure Point B is confirmed (no data): this means sessions created during testing were never successfully saved. This is likely the RLS violation bug from the previous sprint (WO-Wellness-Journey bugfix session on 2/23/26).

**If records are missing:** BUILDER must create a test patient record manually in Supabase to unblock the demo:
```sql
INSERT INTO log_clinical_records 
  (patient_link_code, site_id, session_date, session_type, session_number)
VALUES 
  ('PT-DEMO000001', '[the site_id from log_user_sites]', CURRENT_DATE, 'preparation', 1),
  ('PT-DEMO000002', '[the site_id from log_user_sites]', CURRENT_DATE - 7, 'treatment', 1);
```

### Priority 3 — Add Diagnostic Logging to `fetchPatients()`

Add console output so the next time this happens, the cause is immediately visible:

```typescript
const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
        const siteId = await getCurrentSiteId();
        console.log('[PatientSelectModal] Resolved siteId:', siteId);  // ADD THIS
        
        let query = supabase
            .from('log_clinical_records')
            .select('patient_link_code, session_date, session_type, session_number, ref_substances(substance_name)')
            .order('session_date', { ascending: false });

        if (siteId) {
            query = query.eq('site_id', siteId);
            console.log('[PatientSelectModal] Filtering by site_id:', siteId);  // ADD THIS
        } else {
            console.warn('[PatientSelectModal] No siteId — fetching all records (no site filter)');  // ADD THIS
        }

        const { data, error: qErr } = await query;
        console.log('[PatientSelectModal] Query result:', { rowCount: data?.length, error: qErr });  // ADD THIS
        
        if (qErr) throw qErr;
        // ... rest of existing code
```

### Priority 4 — Improve the Empty State UX

The current empty state message "No patients found for this site" gives no actionable guidance. For demo robustness:

```tsx
{patients.length === 0 ? (
    <div className="text-center py-8">
        <p className="text-slate-400 text-sm">No patient records found for this account.</p>
        <p className="text-slate-500 text-xs mt-2">
            Start by creating a <strong className="text-indigo-400">New Patient</strong> session from the previous screen.
        </p>
    </div>
) : 'No patients match these filters'}
```

---

## ACCEPTANCE CRITERIA
- [ ] Existing Patient view loads and displays records for the logged-in user
- [ ] Console logs confirm: site_id resolved, query row count > 0
- [ ] If no records exist, empty state gives actionable guidance ("Start with New Patient")
- [ ] New patients created via the New Patient flow appear in Existing Patient list within the same session

## FILES TO TOUCH
- `src/services/identity.ts` — add fallback site creation if none exists
- `src/components/wellness-journey/PatientSelectModal.tsx` — add diagnostic logging + improved empty state
- Supabase Dashboard — potentially seed a `log_user_sites` row and test records manually

## HANDOFF
When done: update `status: 04_QA`, `owner: INSPECTOR`, move to `_WORK_ORDERS/04_QA/`.
