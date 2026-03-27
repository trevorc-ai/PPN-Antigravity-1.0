---
description: /analysis-first — Mandatory analysis gate before any analytics or SQL-layer work. Prevents agents from writing SQL views or analytics components without first confirming the live schema, naming contract, and data shape.
---

# /analysis-first — Pre-Build Analysis Gate

> **Run before any task that involves:** SQL views (`v_`/`mv_`), migrations, analytics components, or anything that reads from or writes to `log_*` / `ref_*` tables.
>
> Purpose: Confirm what actually exists in the live schema before writing a single line of SQL or React. Prevents FK violations, misnamed tables, and mock-data proliferation.

---

## Phase 1 — Live Schema Verification

Before writing any SQL or components, confirm the schema live. **Always query the live database using the agent tool.**

### Step 1.1 — Run the Inspect Tool

Run the following command in your terminal for EACH table you need to interact with:
```bash
node .agent/scripts/inspect-table.js <table_name>
```
*Example: `node .agent/scripts/inspect-table.js log_clinical_records`*

### Step 1.2 — Confirm Output
The script will return the exact columns, data types, nullability, and foreign key constraints for the table.
- **Verify PKs:** Named PKs (e.g., `substance_id`, `severity_grade_id`) are the norm here — NOT generic `id`. Confirm before writing `REFERENCES`.
- **Verify FKs:** Guarantee the columns you are joining on actually exist.

**ASSUMED until confirmed with a live result. Do NOT write SQL or components before running this script.**

---

## Phase 2 — Four-Layer Architecture Contract

Every SQL object must be named and placed in the correct layer. Confirm your object belongs to one of:

| Layer | Prefix | Purpose | Example |
|-------|--------|---------|---------|
| Operational | `log_` | Append-only clinical records | `log_episodes_of_care` |
| Reference | `ref_` | Structured lookup tables | `ref_substances`, `ref_severity_grades` |
| Analytical View | `v_` | Real-time join / aggregation | `v_patient_episode_summary` |
| Materialized Benchmark | `mv_` | Pre-computed, refreshed on schedule | `mv_open_risk_queue`, `mv_site_monthly_quality` |

**Do NOT create an object without assigning it a layer.** Naming convention violations are INSPECTOR rejections.

---

## Phase 3 — Data Shape Confirmation

Before writing a `v_` or `mv_` view, answer:

1. What columns does the consuming component need?
2. Do all source columns exist in the confirmed live schema (Step 1.2)?
3. Are all FK joins to `ref_` tables confirmed to exist (Step 1.1)?
4. What is the aggregation grain? (per patient / per site / per episode / per date)
5. Does any comparison group risk having fewer than n=5 records? If yes, include suppression logic:

```sql
-- Suppression pattern: hide groups below n=5
HAVING COUNT(DISTINCT subject_id) >= 5
```

---

## Phase 4 — Mock Data Sunset Check

If the consuming component currently uses a `MOCK_*` constant from `src/constants/analyticsData.ts`:

- [ ] State explicitly: "This view replaces `MOCK_[CONSTANT_NAME]` in `[Component].tsx`"
- [ ] The WO for this view must include updating the component to read from the live view
- [ ] INSPECTOR will reject any WO where the view is created but the component is not migrated

---

## Phase 5 — Analysis Output Block

Before handing off to BUILDER, produce this block and include it in the WO:

```
ANALYSIS-FIRST GATE — [Date]
Target view/table: [name]
Layer: log_ / ref_ / v_ / mv_
Source tables confirmed (live query): YES / NO [paste result]
Column names confirmed: YES / NO
RLS confirmed: YES / NO
Suppression rule needed: YES / NO [if yes, which groups?]
Mock data replaced: [MOCK_CONSTANT_NAME] in [Component.tsx] / N/A
Pre-conditions met: YES / BLOCKED — [reason]
```

**Do NOT hand off to BUILDER if Pre-conditions = BLOCKED.**

---
*Created 2026-03-25 per INSPECTOR SQL-Layers alignment audit.*
