---
status: 06_COMPLETE
owner: USER
failure_count: 0
priority: HIGH
created: 2026-02-21
type: DATABASE_MIGRATION_REVIEW
---

# WO-247: INSPECTOR Migration Review + Supabase Walkthrough

## INSPECTOR Mandate
SOOP has written two database migrations. INSPECTOR must:
1. Audit each migration against the database integrity policy
2. Confirm no destructive commands exist
3. Prepare a clear, step-by-step walkthrough for USER to execute each migration in the Supabase SQL Editor
4. Present to USER for manual execution — INSPECTOR does NOT run these

---

## MIGRATION 1 OF 2: `migrations/016c_add_missing_substances.sql`
**Purpose:** Add DMT, Esketamine, and Ayahuasca to `ref_substances` with Ki values
**Risk Level:** LOW — additive inserts + updates, `ON CONFLICT DO NOTHING` prevents duplicates

### INSPECTOR SQL Audit — 016c

```sql
-- ✅ SAFE: Additive INSERT with conflict guard
INSERT INTO public.ref_substances (substance_name, substance_class)
VALUES
  ('DMT', 'psychedelic'),
  ('Esketamine', 'dissociative'),
  ('Ayahuasca', 'psychedelic')
ON CONFLICT (substance_name) DO NOTHING;

-- ✅ SAFE: UPDATE by name match, using ILIKE wildcard
-- ⚠️ VERIFY: confirm ref_substances has receptor_* Ki columns before running
--   (these were added by migration 015 — if 015 ran successfully, columns exist)
UPDATE public.ref_substances SET receptor_5ht2a_ki = 150.0, ... WHERE substance_name = 'DMT';
UPDATE public.ref_substances SET receptor_nmda_ki = 250.0, ... WHERE substance_name = 'Esketamine';
UPDATE public.ref_substances SET receptor_5ht2a_ki = 150.0, ... WHERE substance_name = 'Ayahuasca';

-- ✅ SAFE: DO block for notification only — no data modification
DO $$ BEGIN RAISE NOTICE ...; END $$;
```

**INSPECTOR VERDICT — 016c:** [STATUS: PASS] ✅
- No DROP, TRUNCATE, or ALTER TYPE
- No RLS policy changes
- ON CONFLICT guard prevents duplicate key errors
- Ki columns assumed present (migration 015 dependency — verify first)

---

## MIGRATION 2 OF 2: `migrations/016b_correct_ki_values.sql`
**Purpose:** Correct Ki values for 7 existing substances using literature-verified data
**Risk Level:** LOW-MEDIUM — updates existing rows, no schema changes

### INSPECTOR SQL Audit — 016b

```sql
-- ✅ SAFE: Named substance updates with ILIKE wildcard
UPDATE public.ref_substances SET receptor_5ht2a_ki = 28.0
WHERE substance_name ILIKE '%psilocybin%' OR substance_name ILIKE '%psilocin%';
-- ⚠️ NOTE: ILIKE '%psilocybin%' will match any row containing "psilocybin"
-- In a clean DB with only 'Psilocybin' in the name, this is safe.

UPDATE public.ref_substances SET receptor_sert_ki = 240.0, receptor_5ht2a_ki = 10000.0
WHERE substance_name ILIKE '%mdma%' OR substance_name ILIKE '%ecstasy%';

-- ... (all remaining UPDATEs follow same safe pattern)

-- ✅ SAFE: SELECT verification query — read-only
SELECT substance_name, receptor_5ht2a_ki, ... FROM public.ref_substances WHERE ...;

-- ✅ SAFE: DO block notification only
DO $$ BEGIN RAISE NOTICE ...; END $$;
```

**INSPECTOR VERDICT — 016b:** [STATUS: PASS] ✅
- No DROP, TRUNCATE, or ALTER TYPE
- No RLS changes
- All UPDATEs are targeted by substance name
- ILIKE wildcards are safe given the known clean substance names in this DB
- Verification SELECT included — results visible after run

---

## SUPABASE EXECUTION WALKTHROUGH

> 📋 Walk the USER through this step by step. USER runs each query manually.
> Do NOT run anything automatically. Confirm each step with USER before proceeding.

---

### PRE-FLIGHT CHECK (Run this first, before any migration)

**Step 0A — Verify migration 015 ran (Ki columns must exist):**

Go to your Supabase project → **SQL Editor** → paste and run:

```sql
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'ref_substances'
  AND column_name LIKE 'receptor_%'
ORDER BY column_name;
```

**Expected result:** You should see columns: `receptor_5ht1a_ki`, `receptor_5ht2a_ki`, `receptor_5ht2c_ki`, `receptor_d2_ki`, `receptor_nmda_ki`, `receptor_sert_ki`

- ✅ If you see 6+ columns: migration 015 ran. Proceed to Step 1.
- ❌ If you see 0 columns: migration 015 did not run. STOP — alert LEAD before proceeding.

---

**Step 0B — Snapshot current state (for rollback reference):**

```sql
SELECT substance_name, substance_class, receptor_5ht2a_ki, receptor_nmda_ki, receptor_sert_ki
FROM public.ref_substances
ORDER BY substance_name;
```

**Save or screenshot this output.** It is your before-state. If anything goes wrong, this is what you're restoring to.

---

### MIGRATION 1: Run 016c (Add 3 New Substances)

**Step 1 — Open SQL Editor in Supabase dashboard**

Go to: [Your Supabase Project] → Left sidebar → **SQL Editor** → **New query**

**Step 2 — Paste the full contents of `migrations/016c_add_missing_substances.sql`**

The file is at: `/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/migrations/016c_add_missing_substances.sql`

Open it in any text editor, select all, copy, paste into Supabase SQL Editor.

**Step 3 — Run it**

Click **Run** (or Cmd+Enter).

**Step 4 — Verify the result**

You should see in the output:
```
NOTICE: ✅ Migration 016c: All 3 substances added. Catalog now at 10.
```

If you see a WARNING instead, stop and report the exact message.

**Step 5 — Confirm the rows exist:**

```sql
SELECT substance_name, substance_class, receptor_nmda_ki, primary_mechanism
FROM public.ref_substances
WHERE substance_name IN ('DMT', 'Esketamine', 'Ayahuasca')
ORDER BY substance_name;
```

Expected: 3 rows returned, each with Ki values and a `primary_mechanism` value.

---

### MIGRATION 2: Run 016b (Correct Ki Values)

**Step 6 — New query in SQL Editor**

Click **New query** to open a fresh editor tab.

**Step 7 — Paste the full contents of `migrations/016b_correct_ki_values.sql`**

File at: `/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/migrations/016b_correct_ki_values.sql`

**Step 8 — Run it**

Click **Run** (or Cmd+Enter).

**Step 9 — Review the verification SELECT output**

The migration ends with a SELECT statement that shows you the corrected values for all 10 substances. Review this table and confirm:

| Substance | receptor_5ht2a_ki | receptor_sert_ki | receptor_nmda_ki |
|-----------|------------------|-----------------|-----------------|
| Psilocybin | 28.0 | 10000.0 | 10000.0 |
| MDMA | 10000.0 | 240.0 | 10000.0 |
| LSD-25 | 2.9 | 10000.0 | 10000.0 |
| Ketamine | 10000.0 | 10000.0 | 500.0 |
| Esketamine | 10000.0 | 10000.0 | 250.0 |
| Mescaline | 3000.0 | 10000.0 | 10000.0 |
| 5-MeO-DMT | 295.0 | 10000.0 | 10000.0 |
| Ibogaine | 700.0 | 10000.0 | 10000.0 |
| DMT | 150.0 | 10000.0 | 10000.0 |
| Ayahuasca | 150.0 | 10000.0 | 10000.0 |

If any row shows unexpected values, report the discrepancy before proceeding.

---

### POST-MIGRATION CONFIRMATION

**Step 10 — Final state check:**

```sql
SELECT
  substance_name,
  substance_class,
  receptor_5ht2a_ki,
  receptor_5ht1a_ki,
  receptor_sert_ki,
  receptor_nmda_ki,
  primary_mechanism
FROM public.ref_substances
WHERE is_active = true
ORDER BY substance_name;
```

You should see **10 named substances** (excluding 'Other / Investigational') with Ki values populated.

✅ **Both migrations complete. Report results to LEAD.**

---

## WHAT COMES NEXT (After USER confirms migrations ran)

1. DESIGNER presents mockups for USER approval (WO-246)
2. USER approves mockups
3. BUILDER commences Sprint 1 implementation (WO-245a, WO-245c)
4. BUILDER commences Sprint 2 — Ki radar wired to corrected DB data (WO-245b)

## [STATUS: PASS] - INSPECTOR APPROVED
