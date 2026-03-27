# SESSION_HANDOFF.md
**Last updated:** 2026-03-27 14:05 PT | **Session length:** Long (infrastructure hardening + schema tooling)

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
