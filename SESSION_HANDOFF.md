# SESSION_HANDOFF.md
**Last updated:** 2026-03-26 14:08 PDT | **Session focus:** Intelligence Layer Integration — protocol amendments, 7 new WOs (695–701), pg_cron MV refresh activated

## ⚡ START HERE — Commands Available Every Session

| Command | What it does |
|---|---|
| `/fast-track [one sentence]` | LEAD classifies, creates a ticket, and routes it. No pipeline knowledge required. |
| `/ppn-ui-standards [filename]` | Audits the named file for standards violations and fixes them in-place. |
| `/lead-pipeline-scan` | Full pipeline audit: surfaces all stuck tickets, backlogs, and next actions. |
| `/finalize_feature` | INSPECTOR-only: stage, commit, post push confirmation to user. |
| `/session-handoff` | LEAD updates this file at end of session. Run before signing off. |

> [!IMPORTANT]
> **DB-First Rule is now law.** `GLOBAL_CONSTITUTION.md §2` and `frontend-best-practices §6.3` both mandate that any `v_*` or `mv_*` view that exists MUST be used by the UI. Client-side recomputation of anything the DB already provides is a QA FAIL. Every analytical hook must have a `// Source: mv_*` comment.

> [!NOTE]
> `inspector-qa` v1.9 adds two new Phase 0 gates: **Data Completeness Gate** (zero-row handling, suppression thresholds, clinical disclaimers) and **Network Benchmark Gate** (site-vs-network surfaces blocked until ≥10 sites). These apply to ALL WOs with analytical output from now on.

---

## 🔴 Active / In-Flight

| Ticket | Stage | Notes |
|---|---|---|
| **WO-673** | `06_USER_REVIEW` → **PUSH PENDING** | Committed at `9085749`. User must reply `push` to deploy. |
| WO-658 | `06_USER_REVIEW` | MEQ-30 auto-advance UX — awaiting visual confirm |
| WO-666 | `06_USER_REVIEW` | Export shared components — awaiting visual confirm |
| WO-B6 | `06_USER_REVIEW` | Select Patient modal UI standards audit — awaiting visual confirm |
| **WO-695** | `01_TRIAGE` | **P0 — Route to PRODDY immediately.** Wire `protocol_id` to `updateDosingProtocol()`. Confirmed never written in clinicalLog.ts. |
| **WO-696** | `01_TRIAGE` | **P0 — Route to PRODDY immediately.** Mount CrisisLogger in live Phase 2. Confirmed Showcase-only today. |
| **WO-540** | `01_TRIAGE` | Mock Data Generator — scope updated to include protocol_id, safety events, day-7/30 assessments + deletion script. Route to PRODDY. |
| WO-661 | `04_BUILD` | SafetyCheckForm DB-driven observations |
| WO-665 | `04_BUILD` | Longitudinal Assessment persistence |
| WO-677–682 | `04_BUILD` | Analytics live-data wiring — MV sources updated this session |
| WO-687 | `04_BUILD` | useOutcomeScoring — ⚠️ must audit `mv_outcome_deltas_by_timepoint` before coding |
| WO-697 | `04_BUILD` | Dashboard KPI cards → `mv_site_dashboard_summary` |
| WO-698 | `04_BUILD` | PatientOutcomePanel → `mv_outcome_deltas_by_timepoint` |
| WO-699 | `04_BUILD` | insightEngine → `mv_clinician_work_queue` (after WO-697) |
| WO-700 | `04_BUILD` | Radar spoke unlock (after WO-677) |
| WO-701 | `04_BUILD` | Admin Data Quality Panel (after WO-695) |
| WO-668–672 | `05_QA` | Ibogaine clinical modules — awaiting INSPECTOR QA |
| WO-644, 685, 686 | `05_QA` | PDF audit + algorithm specs |

---

## ✅ Completed This Session (2026-03-26)

- **GLOBAL_CONSTITUTION.md §2** — Read Model Policy added (DB-First, Always). Re-locked at chmod 444.
- **frontend-best-practices SKILL.md §6.3** — MV-First Analytical Hook Decision Tree added. Mock-data migration queue updated with live status.
- **inspector-qa SKILL.md v1.9** — Data Completeness Gate + Network Benchmark Gate added to Phase 0. Clearance block template updated.
- **pg_cron MV refresh** — `refresh_ppn_additive_intelligence()` scheduled every 4 hours. `jobid: 1, active: true`. Idempotent SQL documented.
- **WO-695** created → 01_TRIAGE (protocol_id write on DosingProtocol save)
- **WO-696** created → 01_TRIAGE (CrisisLogger wired to live Phase 2)
- **WO-697** created → 04_BUILD (Dashboard KPI cards via mv_site_dashboard_summary)
- **WO-698** created → 04_BUILD (PatientOutcomePanel via mv_outcome_deltas_by_timepoint)
- **WO-699** created → 04_BUILD (insightEngine → mv_clinician_work_queue)
- **WO-700** created → 04_BUILD (ClinicPerformanceRadar spoke unlock, depends WO-677)
- **WO-701** created → 04_BUILD (Admin Data Quality Panel)
- **WO-540** advanced 90_BACKLOG → 01_TRIAGE, seed scope updated to intelligence-layer-complete
- **WO-677, 681** amended with preferred MV data sources
- **WO-687** amended with mandatory MV audit-first requirement
- **WO-539** moved to 98_HOLD (superseded by WO-697)
- **WO-514** identified as built+approved in push-hold — needs promotion to 99_COMPLETED
- All 7 WOs properly renumbered (were WO-NEW-* format, now WO-695–701)

---

## 🟡 Needs User Decision

1. **WO-673 — PUSH** — Reply `push` to deploy commit `9085749`.
2. **WO-658 / WO-666 / WO-B6** — Three in `06_USER_REVIEW` awaiting visual confirmation.
3. **WO-514** — Built and INSPECTOR-approved. In push-hold (local commit only). Promote to 99_COMPLETED once main branch confirmed current.
4. **Three missing MVs** — `mv_open_risk_queue`, `mv_site_monthly_quality`, `mv_benchmark_by_subgroup` do not exist. Three WOs (678, 679, ConfidenceCone) are blocked. PRODDY decision: Create / Remap / Defer.
5. **"Beta-ready" definition** — No criteria defined yet. Everything competes equally without it. Recommend a 5-item definition before next partner onboarding.
6. **Part 4 WOs (P1–P4)** — Clinician Work Queue, Follow-up Compliance Matrix, Documentation Completeness Panel, Trajectory Badge — no WOs exist yet. PRODDY needed.
7. **WO-553 conflict risk** — Touches same `WellnessJourney.tsx` as WO-696. Review before either ships.

---

## 🔵 Pipeline State

| Queue | Count | Key Tickets |
|---|---|---|
| `01_TRIAGE` | **3** | WO-695 (P0), WO-696 (P0), WO-540 — all need PRODDY |
| `04_BUILD` | **14** | WO-697, 698 (start here, highest visible impact) |
| `05_QA` | **5** | WO-644, 668, 669, 671, 672 |
| `06_USER_REVIEW` | **3** | WO-658, 666, B6 — pipeline paused |
| `98_HOLD` | ~44 | WO-553 (conflict risk with WO-696) |

---

## ⚪ Next Recommended Actions

1. **PRODDY → WO-695 plan** — Highest-leverage item in the platform. Nothing in the intelligence layer works without `protocol_id`. Write the spec, route to INSPECTOR, then BUILDER.
2. **PRODDY → WO-696 plan** — Safety surveillance is blind without this. Write the spec.
3. **USER → reply `push`** on WO-673 (commit `9085749`) and review WO-658/666/B6 in `06_USER_REVIEW`.

---

## 📋 Protocol Changes Made This Session

| File | Version | Change |
|---|---|---|
| `GLOBAL_CONSTITUTION.md` | 2026-03-26 | Read Model Policy added to §2 (DB-First, Always — MANDATORY ALL AGENTS) |
| `frontend-best-practices/SKILL.md` | 2026-03-26 | §6.3 MV-First Analytical Hook Decision Tree added; mock-data migration queue updated |
| `inspector-qa/SKILL.md` | v1.9 | Data Completeness Gate + Network Benchmark Gate added to Phase 0. Clearance block updated. |

---

## Key Clinical Context (Do Not Lose)

- **Dr. Allen** — 600+ Ibogaine sessions, paper in preparation on QTc thresholds. His numbers override standard references on this platform.
- **QTc thresholds (FINAL):** Green <490 / Amber 490 / Orange 500+ / Red advisory 550+ — **NO hard block at any level**
- **Substance types:** Ibogaine HCL and TPA (Total Plant Alkaloid) are co-equal primary substances — not alternatives
- **No ibogaine + ketamine mixing** in Dr. Allen's protocol
- **Assessments are elective** — no assessment is a hard gate on Phase 2 entry, per Dr. Allen
- **Ataxia grading:** 0 / +1 / +2 / +3 ordinal scale used alongside SARA
- **mg/kg running total:** Real-time per-dose cumulative calculation — computed client-side, not stored in DB

---

## 🔒 Locked Decisions

- Additive-only schema (no DROP, RENAME, ALTER TYPE)
- Zero-PHI (Subject_ID only in clinical tables)
- RLS on all log_* tables
- `log_/ref_/v_/mv_` four-layer naming convention
- No mock data made permanent once a real `mv_*` view exists
- **NEW 2026-03-26:** If a `v_*` or `mv_*` view exists, the UI MUST read from it — client-side recomputation is a QA FAIL (Read Model Policy)
- **NEW 2026-03-26:** Network comparison surfaces (site-vs-network) must be feature-flagged off until ≥10 contributing sites
- **NEW 2026-03-26:** Beta suppression threshold = n<5 with "Early data — results will strengthen" label (production: n<20)
- **NEW 2026-03-26:** Clinical disclaimers (response/remission/trajectory) are mandatory: "Algorithm-derived — verify with clinical judgment"
- pg_cron MV refresh: `0 */4 * * *` — jobid 1, active, do not change without LEAD sign-off
