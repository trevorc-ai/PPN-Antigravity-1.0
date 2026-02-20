---
id: WO-096
status: 03_BUILD
priority: P2 (High)
category: Architecture
audience: Provider-Facing
owner: USER
failure_count: 0
lead_routed: 2026-02-17T22:21:00-08:00
---

# Migrate Interaction Checker to Live ref_substances + ref_medications Tables

## User Request (verbatim)

> "Then we should populate the ref_ table so it logs the medications, because that is also used in the protocol logs and that ref table will inevitably grow over time."

---

## Context & Audit Findings (Pre-Ticket Research by CUE)

### Current State (Problem)

`InteractionChecker.tsx` uses **two hardcoded arrays** from `src/constants.ts`:

| Dropdown | Current Source | Should Be |
|---|---|---|
| Primary Agent (Psychedelic) | `PSYCHEDELICS` constant (7 items, line 8) | `ref_substances` (live, growable) |
| Secondary Agent (Medication) | `MEDICATIONS_LIST` constant (35 items, line 262) | `ref_medications` (live, growable) |

**Why this is a problem:**
- Adding a new substance or medication requires a code deploy, not a DB insert
- `ref_medications` is already used by `Tab2_Medications.tsx` in Protocol Builder — the two sources will diverge over time
- `ref_substances` is already used everywhere else in the app

### Existing Infrastructure (Already Done — No New Tables Needed)

| Table | Migration | Status | Columns |
|---|---|---|---|
| `ref_medications` | `004_create_medications_table.sql` | ✅ Live | `medication_id`, `medication_name`, `is_common`, `rxnorm_cui`, `is_active` |
| `ref_medications.is_common` | `021_add_common_medications_flag.sql` | ✅ Live | 12 medications flagged as common |
| `ref_substances` | Pre-existing | ✅ Live | `substance_id`, `substance_name` |

### What's Missing

`ref_medications` lacks a `medication_category` column. This is needed so the Interaction Checker can display medications grouped by class (SSRIs, MAOIs, Benzodiazepines, etc.) — matching the current UX grouping in the hardcoded constant.

---

## Work: Two Parts

### Part A: SQL Migration (SOOP)

**File:** `migrations/051_add_medication_category.sql`

Add `medication_category` column to `ref_medications` and back-fill all 35 existing rows with their correct category:

```sql
ALTER TABLE public.ref_medications
  ADD COLUMN IF NOT EXISTS medication_category VARCHAR(50);

UPDATE public.ref_medications SET medication_category = 'SSRI/SNRI' 
WHERE medication_name IN ('Fluoxetine (Prozac)', 'Sertraline (Zoloft)', 'Citalopram (Celexa)', 
  'Escitalopram (Lexapro)', 'Paroxetine (Paxil)', 'Venlafaxine (Effexor)', 'Duloxetine (Cymbalta)');

UPDATE public.ref_medications SET medication_category = 'MAOI'
WHERE medication_name IN ('Phenelzine (Nardil)', 'Tranylcypromine (Parnate)', 'Selegiline (Emsam)');

UPDATE public.ref_medications SET medication_category = 'Mood Stabilizer'
WHERE medication_name IN ('Lithium', 'Valproate (Depakote)', 'Lamotrigine (Lamictal)', 'Carbamazepine (Tegretol)');

UPDATE public.ref_medications SET medication_category = 'Benzodiazepine'
WHERE medication_name IN ('Alprazolam (Xanax)', 'Clonazepam (Klonopin)', 'Diazepam (Valium)', 'Lorazepam (Ativan)');

UPDATE public.ref_medications SET medication_category = 'Antipsychotic'
WHERE medication_name IN ('Quetiapine (Seroquel)', 'Olanzapine (Zyprexa)', 'Risperidone (Risperdal)', 'Aripiprazole (Abilify)');

UPDATE public.ref_medications SET medication_category = 'Stimulant'
WHERE medication_name IN ('Amphetamine/Dextroamphetamine (Adderall)', 'Methylphenidate (Ritalin)', 
  'Lisdexamfetamine (Vyvanse)', 'Modafinil (Provigil)');

UPDATE public.ref_medications SET medication_category = 'Cardiovascular'
WHERE medication_name IN ('Propranolol', 'Atenolol', 'Atorvastatin', 'Simvastatin', 'Lisinopril');

UPDATE public.ref_medications SET medication_category = 'Other Somatic'
WHERE medication_name IN ('Levothyroxine', 'Metformin', 'Omeprazole');

UPDATE public.ref_medications SET medication_category = 'Other Psychiatric'
WHERE medication_name IN ('Bupropion (Wellbutrin)', 'Trazodone', 'Buspirone', 
  'Gabapentin', 'Pregabalin (Lyrica)');

CREATE INDEX IF NOT EXISTS idx_medications_category 
  ON public.ref_medications(medication_category);
```

### Part B: Component Refactor (BUILDER)

**File:** `src/pages/InteractionChecker.tsx`

Replace the two hardcoded arrays with live Supabase queries:

#### Primary Agent dropdown
- **Remove:** `const PSYCHEDELICS = [...]` (line 8) and its import from constants
- **Add:** `useEffect` to fetch `ref_substances` ordered by `substance_name`
- **State:** `const [substances, setSubstances] = useState<{substance_id: number, substance_name: string}[]>([])`
- **Query:** `.from('ref_substances').select('substance_id, substance_name').order('substance_name')`
- **Render:** Map `substances` array into `<option>` elements

#### Secondary Agent dropdown
- **Remove:** `MEDICATIONS_LIST` import from constants
- **Add:** fetch from `ref_medications` ordered by `medication_category, medication_name`
- **State:** `const [medications, setMedications] = useState<{medication_id: number, medication_name: string, medication_category: string}[]>([])`
- **Query:** `.from('ref_medications').select('medication_id, medication_name, medication_category').eq('is_active', true).order('medication_category').order('medication_name')`
- **Render:** Group by `medication_category` using `<optgroup label={category}>` for better UX

#### Interaction lookup
- The existing `ref_knowledge_graph` query (lines 38–43) uses `substance_name` and `interactor_name` string fields — **no change needed** there. The selected values from the new dropdowns will still be strings.

#### Keep
- `INTERACTION_RULES` constant (used as local fallback) — **do not remove**
- All existing result display logic — **no change**

---

## Acceptance Criteria

- [ ] `ref_medications.medication_category` column exists and all 35 rows back-filled
- [ ] Interaction Checker Primary Agent dropdown fetches from `ref_substances` (alphabetical)
- [ ] Interaction Checker Secondary Agent dropdown fetches from `ref_medications` (grouped by category, alpha within group)
- [ ] `<optgroup>` labels used for medication categories in Secondary Agent dropdown
- [ ] Adding a new row to `ref_medications` or `ref_substances` in Supabase is immediately reflected in the dropdown — no code deploy needed
- [ ] Existing interaction lookup logic (`ref_knowledge_graph`) still works correctly
- [ ] `MEDICATIONS_LIST` constant removed from `InteractionChecker.tsx` (but kept in `constants.ts` for now — do not delete the constant file)
- [ ] Loading state shown while fetching (spinner or disabled select)

## Technical Notes

- **Order of operations:** SOOP runs Part A (SQL) first. BUILDER runs Part B after confirming `medication_category` column exists.
- `ref_substances` already has `substance_name` — the existing `PSYCHEDELICS` list is a subset. After migration, all substances in the DB will appear (may be more than 7).
- The `interactor_name` field in `ref_knowledge_graph` stores the medication name as a plain string — it must match `ref_medications.medication_name` exactly for the lookup to work. Verify this is consistent.

## Estimated Effort

**Total:** 1 day
- Part A (SQL migration): 0.25 days (SOOP)
- Part B (Component refactor): 0.5 days (BUILDER)
- Smoke test + verify lookup still works: 0.25 days

## Files to Touch

1. `migrations/051_add_medication_category.sql` — NEW (SQL executed by USER)
2. `src/pages/InteractionChecker.tsx` — refactor dropdowns (BUILDER)

---

## LEAD ARCHITECTURE NOTE (2026-02-17 22:21 PST)

### Execution Sequence:
1. **USER** → Run `migrations/051_add_medication_category.sql` in Supabase SQL Editor (SQL already INSPECTOR-approved ✅)
2. **BUILDER** → After USER confirms migration ran, execute Part B: refactor `InteractionChecker.tsx` dropdowns
3. **INSPECTOR** → QA audit of Part B component changes

**Note:** WO-095 (Alphabetical Sort) is a prerequisite quick-fix that BUILDER should complete first (0.5 day). WO-096 Part B builds on the same file.

## [STATUS: PASS] - INSPECTOR SQL AUDIT — migration 051

**Audited by:** INSPECTOR  
**Date:** 2026-02-17  
**File:** `migrations/051_add_medication_category.sql`

### SQL Audit Checklist

| Check | Result | Notes |
|---|---|---|
| No banned commands (DROP, RENAME, ALTER TYPE, TRUNCATE) | ✅ PASS | grep returned no matches |
| All statements idempotent | ✅ PASS | `ADD COLUMN IF NOT EXISTS`, `CREATE INDEX IF NOT EXISTS` |
| UPDATE statements safe to re-run | ✅ PASS | `SET medication_category = X WHERE medication_name IN (...)` — idempotent |
| All 35 seed medications covered | ✅ PASS | `comm` cross-check: zero medications from `004` missing from `051` |
| No new tables created | ✅ PASS | Only `ALTER TABLE` + `UPDATE` + `CREATE INDEX` |
| No new RLS policies needed | ✅ PASS | Existing `ref_medications` RLS from `004` covers new column automatically |
| No FK references to verify | ✅ N/A | No foreign keys added |
| Category count correct | ✅ PASS | 9 categories × correct member counts = 35 total rows |

### ✅ SQL cleared for execution

**Run in Supabase SQL Editor:**  
`migrations/051_add_medication_category.sql`

After execution, BUILDER proceeds with Part B (component refactor).
