---
id: WO-728
title: "Substance & Medication Dropdown Standardization Audit"
owner: LEAD
status: 00_INBOX
priority: P0
created: 2026-03-27
pillar_supported: "1 — Safety Surveillance, 2 — Comparative Clinical Intelligence"
task_type: "data-integrity-audit"
database_changes: no
origin: "User escalation 2026-03-27 — multiple dropdowns listing substances/medications do not match ref_medications reference table. Confirmed systemic."
---

## Problem Statement

Multiple dropdowns across the app list substances, drugs, and medications with hardcoded, inconsistent, or mismatched options that do not reflect the live `ref_medications` reference table. This creates:

1. **Data integrity failures** — A practitioner selecting "Psilocybin" in one dropdown and "psilocybin mushrooms" in another writes different `substance_id` FK values (or fails to write a valid FK at all), destroying cross-session and cross-site comparability.
2. **Clinical accuracy risk** — If a hardcoded list omits a medication that is in `ref_medications`, the practitioner cannot document it — a silent clinical record gap.
3. **Duplication of truth** — Every hardcoded list is a maintenance liability. When `ref_medications` is updated (e.g., Zepbound and Pristiq added in Phase 2), hardcoded lists do not update.

This is a **P0 data integrity issue**, not a UX preference.

---

## Required Audit Scope

### Step 1 — Live Schema Verification (Mandatory First Step)
```bash
node .agent/scripts/inspect-table.js ref_medications
```
Output the full list of medications currently in `ref_medications` (all `medication_name` values where `is_active = true`). This is the canonical source of truth. Every dropdown in the app must match this list exactly.

### Step 2 — Grep All Dropdowns Across src/
```bash
grep -rn "substance\|medication\|drug\|ref_med" src/ --include="*.tsx" --include="*.ts" | grep -i "select\|option\|choice\|enum\|hardcoded\|list\|array" | grep -v "node_modules"
```

### Step 3 — Categorize Each Dropdown Found
For each dropdown or select element that lists substances/medications, classify as:

| Category | Description | Required Fix |
|---|---|---|
| **LIVE** | Sources from `ref_medications` Supabase query | ✅ No action |
| **HARDCODED** | Uses a static array or enum defined in the component | ❌ Must be replaced with live query |
| **PARTIAL** | queries DB but filters to a subset not matching `ref_medications` | ⚠️ Audit the filter logic |
| **MISMATCH** | Options exist in component but not in `ref_medications` | ❌ Reconcile with DB |

### Step 4 — Produce a Single Inventory Table
BUILDER must produce a complete table:

| Component File | Dropdown Purpose | Category | Fix Required |
|---|---|---|---|
| … | … | … | … |

### Step 5 — Remediate All HARDCODED and MISMATCH Items
For each offending component:
- Replace hardcoded array with a `useEffect` + Supabase query to `ref_medications` filtered by `is_active = true`
- Use `medication_id` as the option value (FK), `medication_name` as the label
- Do NOT invent new medication names — if a substance is missing from `ref_medications`, file a separate WO to add it via the correct migration process
- Do NOT ship partial lists — if the query returns 0 results, show an error state, not a fallback hardcoded list

---

## Success Criteria

1. Zero hardcoded substance/medication option lists remain in `src/` — every dropdown populates from a live `ref_medications` query.
2. All `substance_id` / `medication_id` FK writes across the app reference valid `ref_medications.medication_id` values.
3. A complete inventory table is produced and attached to this WO.
4. If any substance required by a clinical workflow is missing from `ref_medications`, a migration WO is filed (do not hardcode as a workaround).

---

## Constraints

- **ADDITIVE ONLY** — Do not rename or remove any existing `ref_medications` entries.
- **Zero-PHI** — This is reference data only; no patient data is involved.
- **No new DB columns** — This is an app-side fix. The database contract is correct; the app is the problem.
- **Inspector first** — Run `inspect-table.js ref_medications` before writing a single line of code.

---

## INSPECTOR Pre-Build Note

This WO is P0 and blocks the accuracy of multiple analytics views (`mv_protocol_outcome_rollup`, `mv_site_safety_benchmarks`, others) that depend on correct FK values being written by the UI. Expedite through triage.
