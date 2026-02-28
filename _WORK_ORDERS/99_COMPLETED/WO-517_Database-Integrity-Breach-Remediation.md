---
id: WO-517
status: 00_INBOX
owner: LEAD
priority: P0-CRITICAL
failure_count: 0
created: 2026-02-27
tags: [database, integrity, governance, security, P0, ALL-WORK-HALTED]
blocks: ALL
---

# ⛔ WO-517: Database Integrity Breach — Identification, Remediation & Mechanical Safeguards

> **EMERGENCY DIRECTIVE — ISSUED BY: USER**
> **Date Issued:** 2026-02-27T11:59:07-08:00
> **ALL other work orders are SUSPENDED until this ticket reaches 05_USER_REVIEW.**

---

## User Directive (Verbatim)

> "The integrity of our database has been compromised AGAIN: Log files were inappropriately written to
> directly by Builder, rather than logging reference codes. Effective immediately, Pause all other
> work orders. Cue, create work order 517 to: 1) identify which tables in Supabase were written to
> directly, 2) restore data integrity by cleaning up the 'dirty' data, and 3) institute mechanical
> safeguards to ensure 100% ongoing data integrity and prevent direct writing to log tables EVER again.
> NOTE: All agents are forbidden from ever modifying a database table; Only inspector is allowed to
> write SQL queries, and only user is allowed to modify data tables."

---

## 🚨 PIPELINE FREEZE — EFFECTIVE IMMEDIATELY

The following work orders are SUSPENDED and must be moved to `98_HOLD` before any other work proceeds.
CUE/LEAD must execute these `mv` commands immediately:

```bash
# Move all active tickets to HOLD
mv _WORK_ORDERS/03_BUILD/WO-501_Critical-Mobile-Interaction-Regressions.md _WORK_ORDERS/98_HOLD/
mv _WORK_ORDERS/03_BUILD/WO-507_Mobile-UI-Overflow-Bugs.md _WORK_ORDERS/98_HOLD/
mv _WORK_ORDERS/03_BUILD/WO-508_Landing-Page-Performance-Code-Splitting.md _WORK_ORDERS/98_HOLD/
mv _WORK_ORDERS/03_BUILD/WO-513_Landing-Page-Bundle-Performance.md _WORK_ORDERS/98_HOLD/
mv _WORK_ORDERS/04_QA/WO-514_MyProtocols-Fake-Data-Fix.md _WORK_ORDERS/98_HOLD/
mv _WORK_ORDERS/00_INBOX/WO-515_Analytics-NaN-Network-Efficiency-Fix.md _WORK_ORDERS/98_HOLD/
mv _WORK_ORDERS/00_INBOX/WO-516_InteractionChecker-Remove-Dropdown-Search.md _WORK_ORDERS/98_HOLD/
```

No agent may pick up any suspended ticket until USER explicitly lifts the freeze.

---

## Background & Root Cause Summary

A forensic scan of `src/` conducted 2026-02-27 reveals that **BUILDER wrote directly into Supabase
`log_` tables using string literals and free-text values** instead of integer foreign key IDs derived
from reference tables — in direct violation of:
- `agent.yaml` §CORE ENGINEERING RULES Rule 4 (ZERO PHI/PII)
- `agent.yaml` §INSPECTOR Step 5c (Supabase Write Audit)
- `agent.yaml` §BUILDER Rule 6f (NEVER author SQL migration files)
- The global NEVER rule: `NEVER INSERT data into any log_ table for any reason`

This is the **second confirmed breach**. The two-strike pattern requires process escalation, not
just a fix.

---

## Forensic Evidence: Confirmed Dirty Writes

The following files contain `.insert()` calls that target `log_` tables **directly from component
code**, bypassing the `clinicalLog.ts` service layer or writing string literals instead of FK IDs.
Each is documented with file path, line number, and the specific violation.

### 🔴 VIOLATION 1 — `user_feedback` table (non-`log_` but unschemaed direct write)
**File:** `src/components/FeedbackCard.tsx` — Line 95–101
```
supabase.from('user_feedback').insert({ type, message: message.trim()... })
```
**Violations:**
- `type` is a raw string literal (`'bug'`, `'feature'`, `'comment'`) — not an FK to any `ref_` table.
- `message` is **free-text** written directly to an application table — violates Zero-Freetext rule.
- Table `user_feedback` has no confirmed migration in `migrations/`. May be unschemaed.

### 🔴 VIOLATION 2 — `log_feature_requests` — free text written directly
**File 1:** `src/pages/ClinicianDirectory.tsx` — Line 232
**File 2:** `src/components/common/RefTableRequestModal.tsx` — Line 36
**File 3:** `src/components/common/RequestNewOptionModal.tsx` — Line 52–61
```
supabase.from('log_feature_requests').insert({ requested_text: requestText.trim(), status: 'pending', ... })
```
**Violations:**
- `requested_text` is **free-text entered by user** — a log table cannot hold free text per ZERO PHI/PII rule.
- `request_type`, `status` are raw string literals — not FK IDs.
- `category` is also a raw string — not a ref FK.

### 🔴 VIOLATION 3 — `log_system_events` — string literal action type
**File:** `src/services/exportService.ts` — Line 158–166
```
supabase.from('log_system_events').insert({ action_type_id: refRow?.id ?? null, details: { ... } })
```
**Status:** PARTIALLY COMPLIANT. `action_type_id` correctly uses FK lookup. However:
- `details` JSONB blob contains `export_type: actionCode` — a string inside a log payload.
- This is a grey-zone that must be evaluated. The string is a controlled code, not free user input.
- **Recommend**: INSPECTOR to determine if `details.export_type` violates Rule 2.

### 🟡 VIOLATION 4 — `DosageCalculator.tsx` — direct log_ write from component (bypasses service layer)
**File:** `src/components/session/DosageCalculator.tsx` — Lines 101–115
```
supabase.from('log_dose_events').insert({ event_type: eventType, ... })
```
**Violations:**
- Direct `.insert()` from a UI component — **this write should route through `clinicalLog.ts`**.
- `event_type` is a string literal (`'initial'`, `'booster'`) — should be an FK to a `ref_` table.
- `substance_type` is a string (`'HCl'`, `'TPA'`) — should be an FK to `ref_substance_types`.
- Note: WO-422 (held) was supposed to govern this table but the table was built independent of it.

### 🟡 VIOLATION 5 — `CrisisLogger.tsx` — direct log_ write from component (partially compliant)
**File:** `src/components/session/CrisisLogger.tsx` — Lines 133–143
```
supabase.from('log_red_alerts').insert({ crisis_event_type_id: refRow?.id, severity_grade_id: ..., trigger_value: { seconds_since_ingestion: seconds } })
```
**Status:** `crisis_event_type_id` and `severity_grade_id` correctly use FK IDs. However:
- Write is made directly from a UI component — not routed through `clinicalLog.ts`.
- `trigger_value` JSONB contains `seconds_since_ingestion` — a numeric value that is acceptable.
- **Action**: Route write through service layer. JSONB payload is borderline acceptable.

### ✅ COMPLIANT — `clinicalLog.ts` (service layer)
**File:** `src/services/clinicalLog.ts` — All functions
All functions in this file correctly use integer FK IDs and route through the service layer.
No violations. This is the **gold standard** that all other writes must conform to.

### ✅ COMPLIANT — `log_waitlist` writes
**Files:** `src/pages/Waitlist.tsx`, `src/pages/Academy.tsx`, `src/components/modals/WaitlistModal.tsx`
These are public-facing intake tables, not clinical log tables. Acceptable as-is pending schema review.

---

## Scope of This Work Order

This ticket has **three sequenced tasks**. They must be executed in order. Each has a distinct owner.

---

### TASK A — Identify: Live Schema + Dirty Data Audit
**Owner: INSPECTOR (SQL only)**
**Output: SQL query set for USER to execute in Supabase SQL Editor**

INSPECTOR must write a SQL diagnostic script that:
1. Confirms which `log_` tables have rows containing string literals in columns that should be FK IDs.
2. Identifies any rows in `log_feature_requests` where `requested_text` is non-null (free text present).
3. Identifies any rows in `user_feedback` where `message` is non-null.
4. Counts rows in `log_dose_events` where `event_type` is a string literal vs. NULL.
5. Reports row counts so USER can assess the scope of contamination before any deletions occur.

> ⚠️ INSPECTOR writes the SQL. USER executes it. INSPECTOR does NOT execute against the live DB.

---

### TASK B — Remediate: Clean the Dirty Data
**Owner: INSPECTOR (SQL only) → USER (execution)**
**Prerequisite: Task A output reviewed and approved by USER**

Based on Task A results, INSPECTOR will write remediation SQL that:
1. For `log_feature_requests`: Deletes or nullifies `requested_text`, `request_type`, `category`,
   and `status` string literals in all rows. These columns should hold FK IDs only.
   - If a clean FK mapping cannot be established, rows must be deleted.
2. For `user_feedback`: Evaluate whether this table should exist at all. If it is undocumented
   (no migration file), USER to decide: (a) drop it, or (b) legitimize it with a proper migration.
3. For `log_dose_events`: Evaluate `event_type` string literal rows. Map to `ref_` IDs if possible;
   delete if no mapping exists.
4. Runs a final integrity check confirming all FK columns in `log_` tables contain only integers.

> ⚠️ ALL remediation SQL is authored by INSPECTOR and executed ONLY by USER via Supabase SQL Editor.
> BUILDER is FORBIDDEN from touching any `.sql` file or any database table entry.

---

### TASK C — Safeguards: Mechanical Prevention of Future Violations
**Owner: INSPECTOR (SQL policy) + BUILDER (code guardrails) — sequenced, not concurrent**
**Prerequisite: Task B completed and verified by USER**

#### C1 — Database-Level Constraints (INSPECTOR writes SQL, USER executes)
INSPECTOR must author a migration that:
1. Adds `CHECK` constraints to `log_feature_requests` preventing `requested_text`, `request_type`,
   `category`, and `status` from accepting unconstrained string literals. These columns must be
   converted to FK integer columns or dropped (additive DB rule: add the FK column, leave old column).
2. Adds `CHECK` constraints or drops string columns from `log_dose_events.event_type` —
   replace with `event_type_id INTEGER REFERENCES ref_dose_event_types(id)`.
3. If `user_feedback.message` (free-text) exists and the table is to be retained, adds a
   `message_type_id INTEGER REFERENCES ref_feedback_types(id)` column and constraints preventing
   raw freetext from being the sole payload.
4. Adds `NOT NULL` constraints on all `_id` FK columns that are currently nullable but should not be.

#### C2 — Code Guardrails (BUILDER implements, INSPECTOR reviews)
After INSPECTOR completes C1 and USER executes migrations, BUILDER must:
1. Remove all direct `.insert()` calls to `log_` tables from UI components:
   - `DosageCalculator.tsx` → route through `clinicalLog.ts::createDoseEvent()` (new function)
   - `CrisisLogger.tsx` → route through `clinicalLog.ts::createRedAlert()` (new function — it
     already resolves FKs correctly, just needs service layer isolation)
2. Remove `FeedbackCard.tsx` direct write to `user_feedback` pending USER decision on table fate.
3. Remove `RequestNewOptionModal.tsx` and `RefTableRequestModal.tsx` free-text writes to
   `log_feature_requests`. Replace with a read-only "request submitted" UI that routes to an
   external feedback mechanism (e.g., email link or Discord) — no DB write until schema is clean.
4. Add a JSDoc comment to every `.insert()` call in `clinicalLog.ts`:
   ```
   // ✅ INSPECTOR-APPROVED WRITE — All values are FK IDs from ref_ tables. Zero free text.
   ```
5. Add a new top-of-file banner to `clinicalLog.ts`:
   ```
   // ⛔ SERVICE LAYER BOUNDARY — ALL log_ table writes MUST go through this file.
   // Direct supabase.from('log_*').insert() in UI components is a P0 governance violation.
   ```

#### C3 — agent.yaml rule hardening (USER only — no agents touch agent.yaml)
After Tasks A, B, C1, C2 are complete, USER must manually add to `agent.yaml` BUILDER instructions:
> **BUILDER ONLY/NEVER ADDENDUM (to be added by USER to agent.yaml after WO-517 closure):**
> - `ONLY write to log_ tables via functions exported from src/services/clinicalLog.ts`.
> - `NEVER call supabase.from('log_*').insert() directly in a UI component or page`.
> - `NEVER write a string literal into a column ending in _type, _status, or _category`.
> - `NEVER write user-entered text into any log_ table under any label`.

---

## Success Criteria (All must be met before ticket closes)

1. **[INSPECTOR]** Diagnostic SQL executed by USER with zero errors. Row counts documented.
2. **[INSPECTOR + USER]** All dirty data in `log_feature_requests`, `user_feedback`, `log_dose_events`
   is either cleaned (FK IDs substituted) or deleted. USER confirms.
3. **[INSPECTOR]** Constraint migration executed and confirmed live in Supabase. No string literals
   can be inserted into FK columns without a DB error.
4. **[BUILDER]** Zero direct `supabase.from('log_*').insert()` calls exist outside `clinicalLog.ts`.
   INSPECTOR verifies with grep.
5. **[INSPECTOR]** Final grep audit confirms: `grep -rn "supabase.from('log_" src/ | grep ".insert("` 
   returns ONLY results inside `src/services/clinicalLog.ts`.
6. **[USER]** agent.yaml BUILDER ONLY/NEVER addendum added manually by USER.

---

## Governance Addendum — Agent Authority Matrix (Effective Immediately)

This is a standing rule addition, not subject to ticket completion. Effective now:

| Action | CUE | LEAD | PRODDY | BUILDER | INSPECTOR | USER |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Write SQL migrations | ❌ | ❌ | ❌ | ❌ | ✅ ONLY | ❌ |
| Execute SQL on live DB | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ ONLY |
| Modify data in any table | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ ONLY |
| Call `.insert()` on `log_*` | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Call functions in `clinicalLog.ts` | ❌ | ❌ | ❌ | ✅ via service | ✅ audit | ✅ |
| Add columns/tables | ❌ | ❌ | ❌ | ❌ | ✅ SQL only | ✅ execute |
| Modify `agent.yaml` | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ ONLY |

---

## PRODDY PRD

> **Work Order:** WO-517 — Database Integrity Breach Remediation
> **Authored by:** CUE / USER Directive
> **Date:** 2026-02-27
> **Status:** P0 Emergency — bypasses standard PRD queue

---

### 1. Problem Statement

Builder wrote string literals and free-text values directly into `log_` tables from UI components,
bypassing the `clinicalLog.ts` service layer and integer FK constraints. The affected tables include
`log_feature_requests`, `log_dose_events`, `user_feedback`, and `CrisisLogger`'s `log_red_alerts`.
This is the second confirmed breach. Without constraints, the database is structurally compromised and
analytics built on FK integrity will silently fail or produce corrupted outputs.

### 2. Target User + Job-To-Be-Done

**INSPECTOR** needs to identify, remediate, and mechanically prevent all direct log-table writes with
string literals so that every row in every `log_` table is guaranteed to contain only integer FK IDs
from `ref_` tables — making analytics correct and the DB audit-proof.

### 3. Success Metrics

1. `grep -rn "supabase.from('log_" src/ | grep ".insert("` returns ONLY lines inside `clinicalLog.ts`.
2. Supabase reports zero constraint violations on all `log_` tables after migration execution by USER.
3. `log_feature_requests.requested_text`, `log_dose_events.event_type` contain zero free-text rows.

### 4. Feature Scope

#### ✅ In Scope
- Forensic SQL audit of all `log_` tables for string-literal contamination
- Remediation SQL to clean or delete dirty rows (USER executes, INSPECTOR authors)
- DB-level `CHECK` constraints and FK column additions to make dirty writes impossible
- Code refactor to route all log writes through `clinicalLog.ts`
- `agent.yaml` addendum by USER

#### ❌ Out of Scope
- Any new features or UI improvements
- Changes to `ref_` tables that are currently clean
- Any modification to `log_clinical_records`, `log_session_vitals`, `log_safety_events` (already FK-compliant)
- Changes to waitlist tables (separate governance tier)

### 5. Priority Tier

**[X] P0** — Demo blocker / safety critical

**Reason:** The database is the foundation of all clinical analytics. String literals in FK columns
silently break benchmark comparisons, cohort matching, and outcome aggregations. A second breach
with no mechanical guardrail means a third breach is inevitable.

### 6. Open Questions for LEAD

1. Should `user_feedback` be dropped entirely, or legitimized with a proper migration and schema?
2. Should `log_feature_requests.requested_text` be nullified in place (leaving the row) or should
   affected rows be fully deleted? USER must decide before INSPECTOR writes remediation SQL.
3. Should `DosageCalculator.tsx` be frozen after the refactor to prevent future BUILDER edits?

---

## INSPECTOR Sign-Off Checklist (to be completed at ticket close)

- [ ] Task A: Diagnostic SQL authored, executed by USER, results pasted in ticket
- [ ] Task B: Remediation SQL authored, executed by USER, results pasted in ticket
- [ ] Task C1: Constraint migration authored, executed by USER, confirmed live
- [ ] Task C2: BUILDER grep audit passes — zero direct log_ inserts outside clinicalLog.ts
- [ ] Task C3: USER confirms agent.yaml addendum added
- [ ] Pipeline freeze lifted by USER only
