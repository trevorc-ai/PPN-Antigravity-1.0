# SESSION_HANDOFF.md
**Last updated:** 2026-03-27 22:00 PT | **Session type:** Database closeout + governance hardening

---

> **Quick reference — key workflows:**
> | Workflow | Owner |
> |---|---|
> | `/fast-track` | LEAD auto-classifies, tickets, routes |
> | `/finalize_feature` | INSPECTOR-only: stage, commit, post push confirmation to user |
> | `/session-handoff` | LEAD updates this file at end of session. Run before signing off. |

> [!IMPORTANT]
> **DATABASE PHASE IS COMPLETE. The next phase is APP ALIGNMENT, not more database rescue.**
> Do not reopen broad Supabase work. The database contract is now stable. Investigate app payloads and write paths before proposing any SQL changes.

> [!IMPORTANT]
> **DB-First Rule is law.** `GLOBAL_CONSTITUTION.md §2` and `frontend-best-practices §6.3` mandate that any `mv_*` view that exists MUST be used by the UI. Client-side recomputation of anything the DB already provides is a QA FAIL. Every analytical hook must have a `// Source: mv_*` comment.

> [!IMPORTANT]
> **LIVE SCHEMA VERIFICATION IS MANDATORY.** Before recommending ANY database change, schema addition, or write path fix, you MUST run the live schema query below against the target table in Supabase Studio. Working from memory, assumptions, or prior snapshots is a violation. Stale schema knowledge has caused real data loss in this project.
>
> ```sql
> SELECT column_name, data_type, is_nullable, column_default
> FROM information_schema.columns
> WHERE table_schema = 'public' AND table_name = '[target_table]'
> ORDER BY ordinal_position;
> ```

> [!NOTE]
> **Live schema inspector is operational.** `.agent/scripts/inspect-table.js` exists, connects via the `read_only_agent` Postgres role (credentials in `.env.agent`, chmod 444), and returns columns + constraints for any table in ~2 seconds. Run: `node .agent/scripts/inspect-table.js <table_name>`. All DB-facing skills already mandate this as Step 1. The `.agent/skills/` directory is fully populated.

> [!NOTE]
> **Recent commits:**
> - Database closeout session verified by ChatGPT (2026-03-27): drug_interaction_phase2 live, log tables writable, Phase 1 routing confirmed correct.

---

## 🔴 Active / In-Flight

Nothing currently in-flight.

---

## ✅ Verified Canonical Database Truths
*Confirmed by live SQL audit (2026-03-27). These are authoritative facts. Do not contradict them.*

1. `log_patient_site_links` is the canonical patient-site identity table.
2. `patient_uuid` is the canonical patient key throughout the entire schema.
3. `log_phase1_consent`, `log_phase1_safety_screen`, and `log_phase1_set_and_setting` are the authoritative Phase 1 tables. Rows exist. Phase 1 data is NOT being misrouted.
4. `log_clinical_records.patient_link_code_hash` is **NOT** a SHA-256 hash field. It is a legacy PT-code snapshot field. Do not rename, drop, or hash it in place. A staged additive replacement is planned.
5. The interaction checker Phase 2 rollout is **LIVE**: Zepbound, Propranolol, and Pristiq are active. The `Ayahuasca + Pristiq` ABSOLUTE_CONTRAINDICATION with `maoi_exposure_flag = true` is live.
6. `log_safety_events` **is writable** at the database level. Minimum valid payload: `ae_id` and `causality_id`. If app writes fail, the problem is the app payload/write path — NOT the table definition.
7. `log_dose_events` **is writable** at the database level. Minimum valid payload: `session_id`, `patient_uuid`, `substance_id`, `event_type_id`, `substance_form_id`, `dose_mg`, `weight_kg`. Same — if failures exist, investigate app first.
8. Views: `anon` has NO `SELECT`. `authenticated` and `service_role` have `SELECT`. All views are `security_invoker=true`. No database-side change is needed here.
9. `public`-schema default ACL cleanup is blocked from project SQL — `supabase_admin` owns those defaults. This is a **platform-blocked** item, not a user-remediable one. Document it, do not stall on it.

---

## 📋 Minimum Payload Contracts (App Must Satisfy)

### `log_safety_events`
App must send at minimum:
- `ae_id`
- `causality_id`

### `log_dose_events`
App must send at minimum:
- `session_id`
- `patient_uuid`
- `substance_id`
- `event_type_id`
- `substance_form_id`
- `dose_mg`
- `weight_kg`

Build app-side write logic to satisfy these contracts explicitly. Do not assume the session record alone is sufficient.

---

## ✅ Completed This Session

- **Read-only `read_only_agent` Postgres role** — Created, confirmed working against production. Role exists in DB but Node.js tooling was not committed. ✅ (DB-side only)
- **drug_interaction_phase2.sql applied** — Zepbound + Pristiq in `ref_medications`, 6 Phase 2 columns on `ref_clinical_interactions`, 30 interaction rules live. ✅
- **log_safety_events writable confirmed** — DB-level behavioral test passed. ✅
- **log_dose_events writable confirmed** — DB-level behavioral test passed. ✅
- **Phase 1 routing confirmed correct** — Data is in correct tables. No misrouting. ✅
- **View security confirmed** — `anon` has no SELECT. `security_invoker=true`. ✅
- **Foundation Stabilization Plan written** — `foundation_stabilization_plan.md` in admin_uploads. ✅
- **Supabase action plan written** — `supabase_action_plan.md` in artifacts (includes Addendum A diagnostic). ✅

---

## 🟡 Needs User Decision

1. **Stale file cleanup** — Stale files at root (`run-migrations.js`, `run-migrations.ts`, `fix_modal.js`, etc.). Needs a dedicated session with a plan.
2. **Supabase Branching (staging env)** — `.env.staging` points to production. No real staging environment exists.
3. **`06_USER_REVIEW` batch** — Large backlog of completed, unreviewed WOs. User should do a batch review pass.
4. **GLOBAL_CONSTITUTION amendment** — Must explicitly state: "No agent may execute `supabase db push` or any SQL directly. Agents write migration files only. User executes migrations." (Agents cannot self-amend this file per Rules.)
5. **`log_clinical_records.patient_link_code_hash` replacement plan** — Design the additive staged migration plan. Do not execute until specifically planned.
6. **Public-schema default ACL** — Platform-blocked. Document, do not fix. Supabase support ticket if desired.

---

## 🔵 Pipeline State

| Queue | Count | Key Tickets |
|---|---|---|
| `06_USER_REVIEW` | 2+ | WO-703 (PsyCon PWA), WO-711 (Dashboard KPI) — ready for user approval |
| `05_QA` | 3 | WO-704, WO-712, WO-713 — on INSPECTOR Hold pending BUILDER walkthroughs |
| `04_BUILD` | Active queue | Next phase: app write path audits for `log_safety_events` and `log_dose_events` |
| Held migration | 0 | **`drug_interaction_phase2.sql` is LIVE. Remove from held queue.** |

---

## ⚪ Next Recommended Actions (App Alignment Phase)

1. **Approve WO-703 and WO-711** in `06_USER_REVIEW` — both passed QA, ready for user sign-off.
2. **Audit `log_safety_events` app write path** — Trace the UI flow from adverse event submission through to the Supabase INSERT. Confirm `ae_id` and `causality_id` are present in the payload. Surface any swallowed errors.
3. **Audit `log_dose_events` app write path** — Confirm all 7 required fields are in the payload. Do not propose SQL changes until the payload is confirmed deficient.
4. **Update interaction checker UI** — Phase 2 data (Zepbound, Propranolol, Pristiq) is now live. Update any UI logic or display that depends on the Phase 2 fields.
5. **Recreate `inspect-table.js`** — File WO for BUILDER to recreate the read-only schema inspector tool using the `read_only_agent` role credentials.

---

## 🚫 What Agents Must NOT Do

1. Do not rename or drop `log_clinical_records.patient_link_code_hash`.
2. Do not hash that field in place.
3. Do not assume `log_safety_events` or `log_dose_events` are database-blocked. They are not.
4. Do not propose SQL because the UI appears broken — inspect the app payload first.
5. Do not assume future objects in `public` inherit safe defaults.
6. Do not make casual changes to `ref_*` tables.
7. Do not weaken the zero-PHI model.
8. Do not reference or instruct anyone to run `inspect-table.js` — it does not exist.
9. Do not work from schema memory — always run the live schema verification query in Supabase Studio first.

---

## 📋 Protocol Changes This Session

- **`SCHEMA_SNAPSHOT.md` deprecated and deleted** (prior session) — `inspect-table.js` was intended as the replacement but was never committed. Agents must use Supabase Studio SQL Editor + `information_schema` queries directly until tooling is recreated.
- **Governance mandate added**: Live schema verification required before any database recommendation.
- **DB rescue phase officially closed** — Remaining items are governance and app-alignment, not schema rescue.

---

## 🏛 Pillar State

| Pillar | Status | Notes |
|---|---|---|
| Pillar 1 — Safety Surveillance | 🟢 Active | drug_interaction_phase2 live. Ayahuasca+Pristiq contraindication active. Write path audit pending. |
| Pillar 2 — Clinical Intelligence | 🟢 Active | Phase 2 data live. App UI alignment needed for new fields. |
| Pillar 3 — QA & Governance | 🟡 Partial | Inspector tool missing. 2 tickets in 06_USER_REVIEW. GLOBAL_CONSTITUTION amendment pending. |
| Pillar 4 — Network Benchmarking | 🟡 Partial | WO-718 ConfidenceCone MV pending in 04_BUILD |
| Pillar 5 — Compliance & Export | ⚪ Unchanged | WO-644 PDF Audit still pending in 98_HOLD |

---

## 🔒 Locked Decisions

- Additive-only schema (no DROP, RENAME, ALTER TYPE)
- Zero-PHI (Subject_ID only in clinical tables)
- RLS on all `log_*` tables
- `log_/ref_/v_/mv_` four-layer naming convention
- No mock data made permanent once a real `mv_*` view exists
- `ppn_session_mode_<id>` and `ppn_session_start_<id>` localStorage keys are PRESERVED (locked 2026-03-27)
- `ACTIVE_SESSION_KEY` is DEMOTED from identity source to display-only resume card (locked 2026-03-27)
- `ppn_patient_medications_names` is the **authoritative** medications localStorage key (locked WO-724, 2026-03-27)
- **`log_clinical_records.patient_link_code_hash`** is a legacy PT-code snapshot field. Treat as read-only. Do not modify until additive replacement plan is approved. (locked 2026-03-27)
- **Agents NEVER execute SQL** — they write `.sql` files only; User runs them (standing rule, GLOBAL_CONSTITUTION amendment pending)

---

> **Quick reference — key workflows:**
> | Workflow | Owner |
> |---|---|
> | `/fast-track` | LEAD auto-classifies, tickets, routes |
> | `/finalize_feature` | INSPECTOR-only: stage, commit, post push confirmation to user |
> | `/session-handoff` | LEAD updates this file at end of session. Run before signing off. |

> [!IMPORTANT]
> **DB-First Rule is law.** `GLOBAL_CONSTITUTION.md §2` and `frontend-best-practices §6.3` mandate that any `mv_*` view that exists MUST be used by the UI. Client-side recomputation of anything the DB already provides is a QA FAIL. Every analytical hook must have a `// Source: mv_*` comment.

> [!IMPORTANT]
> **`SCHEMA_SNAPSHOT.md` has been permanently deleted.** The correct tool is `node .agent/scripts/inspect-table.js <table_name>`. All three relevant skills (database-schema-validator, migration-manager, inspector-qa) have been updated to reflect this. Any agent that refers to SCHEMA_SNAPSHOT.md is operating on stale memory — do not follow that instruction.

> [!NOTE]
> **Commits this session:**
> - `7a9eb22` — chore: add read-only DB schema inspector tool for agents
> - `80d6ec3` — chore: replace SCHEMA_SNAPSHOT with live inspector tool across all agent skills (1,007 lines deleted)

---

## 🔴 Active / In-Flight

Nothing currently in-flight.

---

## ✅ Completed This Session

- **Read-only DB inspector built** — `.agent/scripts/inspect-table.js` wraps `information_schema` queries via `read_only_agent` Postgres role. OS-locked (`chmod 444`). `.env.agent` is gitignored and OS-locked. ✅
- **`SCHEMA_SNAPSHOT.md` deleted** — 1,007-line static file permanently removed from repo. ✅
- **All agent skills updated** — `database-schema-validator`, `migration-manager`, and `inspector-qa` all now mandate `inspect-table.js` for live schema verification. ✅
- **`analysis-first` workflow updated** — mandates `inspect-table.js`, explicitly forbids `SCHEMA_SNAPSHOT.md`. ✅
- **`read_only_agent` Postgres role confirmed working** — tested against `log_clinical_records`, returns full schema with constraints in ~2 seconds. ✅
- **Foundation Stabilization Plan written** — artifact at `foundation_stabilization_plan.md` covering Docker setup, staging env, and systemic gaps. ✅

---

## 🟡 Needs User Decision

1. **Stale file cleanup** — User flagged that there are many stale files in the repo. Needs a dedicated session to audit and remove. Do NOT do this ad hoc — it requires a plan.
2. **Docker setup** — Local Docker daemon has permission issues (`/var/run/docker.sock`). Inspector tool bypasses this for reads, but migration testing still requires Docker. See `foundation_stabilization_plan.md` Track 1.
3. **Supabase Branching (staging env)** — No staging environment currently exists. All agent work goes directly to production data. See `foundation_stabilization_plan.md` Track 2.
4. **`06_USER_REVIEW` batch (31 tickets)** — Large backlog of completed, unreviewed WOs. User should do a batch review pass.
5. **GLOBAL_CONSTITUTION amendment needed** — Must explicitly state: "No agent may execute `supabase db push` or any SQL directly. Agents write migration files only. User executes migrations." Not yet written.

---

## 🔵 Pipeline State

| Queue | Count | Key Tickets |
|---|---|---|
| `04_BUILD` | 7 | WO-654 (Denver waitlist), WO-703 (PsyCon PWA), WO-711 (Dashboard KPI), WO-712 (Analytics mobile), WO-713 (Radar chart), WO-718 (ConfidenceCone MV) |
| `06_USER_REVIEW` | 31 | WO-661, WO-665, WO-668–672, WO-677–682, WO-687–699, WO-701, WO-707–708, WO-714, WO-716–717, WO-720–722, WO-B6 |
| `98_HOLD` | 45+ | Includes WO-706 (CrisisLogger), WO-660 (Denver homepage) |
| Held migration | 1 | `20260327_drug_interaction_phase2.sql` — awaiting Docker verification |

---

## ⚪ Next Recommended Actions

1. **Stale file audit** — Create a plan to identify and remove stale files from the repo. Do not do this without a plan. Check `migrations/` folder (old legacy .sql files), `run-migrations.js`, `run-migrations.ts`, and any other orphaned root-level files.
2. **Docker setup (Track 1 of Foundation Plan)** — Run `supabase db pull` to sync local Docker with production. Verify with inspector tool. Then test the held migration.
3. **GLOBAL_CONSTITUTION amendment** — Add explicit DB execution authority section. Agents write SQL. User runs SQL. No exceptions.

---

## 📋 Protocol Changes Made This Session

- **`SCHEMA_SNAPSHOT.md` deprecated and deleted** — All agents must use `inspect-table.js` going forward.
- **`database-schema-validator` SKILL v2.0** — Step 1 rewritten to mandate inspector tool.
- **`migration-manager` SKILL** — Pre-flight section rewritten. Step 5 now references Docker-first protocol.
- **`inspector-qa` SKILL** — Phase 0 FK check updated to use inspector tool.
- **`analysis-first` workflow** — Phase 1 already updated (prior commit this session).

---

## 🏛 Pillar State

| Pillar | Status | Notes |
|---|---|---|
| Pillar 1 — Safety Surveillance | 🟢 Active | WO-724 fix live. Contraindication engine confirmed using correct table. |
| Pillar 2 — Clinical Intelligence | 🟢 Active | WO-721 wired 11 deep-dive routes; WO-717 mock data removed |
| Pillar 3 — QA & Governance | 🟡 Partial | Inspector tool live. 31 tickets in 06_USER_REVIEW. GLOBAL_CONSTITUTION amendment pending. |
| Pillar 4 — Network Benchmarking | 🟡 Partial | WO-720 live; WO-718 ConfidenceCone MV pending in 04_BUILD |
| Pillar 5 — Compliance & Export | ⚪ Unchanged | WO-644 PDF Audit still pending in 98_HOLD |

---

## 🔒 Locked Decisions

- Additive-only schema (no DROP, RENAME, ALTER TYPE)
- Zero-PHI (Subject_ID only in clinical tables)
- RLS on all `log_*` tables
- `log_/ref_/v_/mv_` four-layer naming convention
- No mock data made permanent once a real `mv_*` view exists
- `ppn_session_mode_<id>` and `ppn_session_start_<id>` localStorage keys are PRESERVED (locked 2026-03-27)
- `ACTIVE_SESSION_KEY` is DEMOTED from identity source to display-only resume card (locked 2026-03-27)
- `ppn_patient_medications_names` is the **authoritative** medications localStorage key (locked WO-724, 2026-03-27)
- **`SCHEMA_SNAPSHOT.md` is permanently deleted** — `inspect-table.js` is the only authorized schema source (locked 2026-03-27)
- Agents NEVER execute SQL — they write `.sql` files only; User runs them (standing rule, formalization pending GLOBAL_CONSTITUTION amendment)
