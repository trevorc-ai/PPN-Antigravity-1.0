# Migration 021: Common Medications Flag

## Status: ✅ Ready for Execution

### What This Migration Does
Adds an `is_common` boolean column to the `ref_medications` table and marks the 12 most clinically relevant medications for display in the Protocol Builder's "Most Common" section.

### Selected Medications (Top 12)
Based on clinical prevalence in psychedelic therapy patient populations:

**SSRIs (3)**
- Sertraline (Zoloft) - Most prescribed antidepressant
- Escitalopram (Lexapro) - Very common
- Fluoxetine (Prozac) - Classic antidepressant

**Other Antidepressants (2)**
- Bupropion (Wellbutrin) - NDRI, fewer interactions
- Venlafaxine (Effexor) - SNRI for depression/anxiety

**Benzodiazepines (3)**
- Alprazolam (Xanax) - Very common for anxiety
- Lorazepam (Ativan) - Common for anxiety
- Clonazepam (Klonopin) - Common for anxiety/panic

**Mood Stabilizers (2)**
- Lamotrigine (Lamictal) - Common for bipolar
- Lithium - Gold standard for bipolar

**Atypical Antipsychotic (1)**
- Quetiapine (Seroquel) - Common off-label use

**Stimulant (1)**
- Amphetamine/Dextroamphetamine (Adderall) - Very common for ADHD

### How to Execute

#### Option 1: Supabase Dashboard (Recommended)
1. Go to: https://supabase.com/dashboard/project/rxwsthatjhnixqsthegf/sql
2. Open the SQL Editor
3. Copy and paste the contents of `migrations/021_add_common_medications_flag.sql`
4. Click "Run"

#### Option 2: Command Line (if psql is installed)
```bash
psql "postgresql://postgres.rxwsthatjhnixqsthegf:${SUPABASE_DB_PASSWORD}@aws-0-us-west-1.pooler.supabase.com:6543/postgres" -f migrations/021_add_common_medications_flag.sql
```

### Verification Query
After running the migration, verify with:
```sql
SELECT medication_name, is_common 
FROM public.ref_medications 
WHERE is_common = true 
ORDER BY medication_name;
```

You should see exactly 12 medications marked as common.

### Impact
- ✅ Fixes empty "Most Common" section in Protocol Builder Tab 2
- ✅ Improves UX by surfacing the most frequently prescribed medications
- ✅ Adds index for faster filtering by `is_common` flag

### Files Modified
- `migrations/021_add_common_medications_flag.sql` (NEW)

---

**Note:** Due to environment permission issues with node_modules, this migration could not be auto-executed. Please run manually using one of the options above.
