# SESSION_HANDOFF.md
**Last updated:** 2026-03-27 02:13 PT | **Session length:** Long (multi-topic: DB hardening, advanced views, WO pipeline triage, data lineage annotation, commit + push)

---

> **Quick reference — key workflows:**
> | Workflow | Owner |
> |---|---|
> | `/fast-track` | LEAD auto-classifies, tickets, routes |
> | `/finalize_feature` | INSPECTOR-only: stage, commit, post push confirmation to user |
> | `/session-handoff` | LEAD updates this file at end of session. Run before signing off. |

> [!IMPORTANT]
> **DB-First Rule is now law.** `GLOBAL_CONSTITUTION.md §2` and `frontend-best-practices §6.3` both mandate that any `v_*` or `mv_*` view that exists MUST be used by the UI. Client-side recomputation of anything the DB already provides is a QA FAIL. Every analytical hook must have a `// Source: mv_*` comment.

> [!NOTE]
> **Work Order Metadata Standard — NOW ENFORCED.** All active and future WOs must include three lines at the bottom:
> - `Data from:` [source tables / MVs / local state]
> - `Data to:` [write targets — log_* tables, fields, or "read-only"]
> - `Theme:` [CSS framework and key components]
> All 27 active WOs were annotated and pushed this session (commit `ffac140`).

> [!NOTE]
> `inspector-qa` v1.9 adds two new Phase 0 gates: **Data Completeness Gate** (zero-row handling, suppression thresholds, clinical disclaimers) and **Network Benchmark Gate** (site-vs-network surfaces blocked until ≥10 sites). These apply to ALL WOs with analytical output from now on.

---

## 🔴 Active / In-Flight

| Ticket | Stage | Notes |
|---|---|---|
| **WO-695** | `06_USER_REVIEW` | **P0** — Wire `protocol_id` to `updateDosingProtocol()`. Intelligence layer blocked without this. |
| **WO-696** | `06_USER_REVIEW` | **P0** — Mount CrisisLogger in live Phase 2. Safety surveillance is blind without this. |
| WO-661 | `04_BUILD` | SafetyCheckForm DB-driven observations — UI standards violations pending fix |
| WO-665 | `04_BUILD` | Longitudinal Assessment persistence |
| WO-706 | `04_BUILD` | CrisisLogger not rendering on mobile |
| WO-687 | `05_QA` | useOutcomeScoring — must audit `mv_outcome_deltas_by_timepoint` before coding |
| WO-697 | `05_QA` | Dashboard KPI cards → `mv_site_dashboard_summary` |
| WO-698 | `05_QA` | PatientOutcomePanel → `mv_outcome_deltas_by_timepoint` |
| WO-699 | `05_QA` | insightEngine → `mv_clinician_work_queue` (after WO-697) |
| WO-701 | `05_QA` | Admin Data Quality Panel (after WO-695) |
| WO-705 | `05_QA` | Drug Interaction Library — Zepbound/Propranolol/Pristiq (30 records + migration) |
| WO-668–672 | `06_USER_REVIEW` | Ibogaine clinical modules — INSPECTOR QA complete, awaiting user visual confirm |
| WO-677–682 | `06_USER_REVIEW` | Analytics live-data wiring — MV sources confirmed |
| WO-707 | `02_TRIAGE` | Post-session vitals chart blank |
| WO-708 | `02_TRIAGE` | Timeline color mismatch post-session |
| WO-703 | `02_TRIAGE` | PsyCon Sharing Toolkit PWA |
| WO-654 | `03_REVIEW` | Waitlist overhaul / Denver launch |
| WO-694 | `03_REVIEW` | Phase 2 vitals + timeline bugs |
| WO-B6 | `03_REVIEW` | Vitals chart baseline seeding |

---

## ✅ Completed This Session (2026-03-27)

- **WO Metadata Annotation** — Appended `Data from / Data to / Theme` to all 27 active work orders (00_INBOX → 06_USER_REVIEW). 32 files committed + pushed (`ffac140`).
- **Advanced Views / DB Hardening** — (prior sessions this day) intelligence layer MVs created, DB-first policy enforced, useOutcomeScoring hook, dashboard KPI wiring WOs routed.
- **WO-704** (Tablet Search Bar Dedup) — Previously committed `307f796`.

---

## 🟡 Needs User Decision

1. **WO-695 / WO-696** — P0 tickets in `06_USER_REVIEW`. Require PRODDY plan before BUILDER can start.
2. **WO-668–672** — Ibogaine modules in `06_USER_REVIEW`. Awaiting visual confirmation to move to `99_COMPLETED`.
3. **Three missing MVs** — `mv_open_risk_queue`, `mv_site_monthly_quality`, `mv_benchmark_by_subgroup` do not exist. WOs 678, 679 + ConfidenceCone are blocked. Decision: Create / Remap / Defer.
4. **"Beta-ready" definition** — No criteria defined. Recommend a 5-item definition before next partner onboarding.
5. **WO-553 conflict risk** — Touches same `WellnessJourney.tsx` as WO-696. Review before either ships.

---

## 🔵 Pipeline State

| Queue | Count | Key Tickets |
|---|---|---|
| `00_INBOX` | **1** | WO-710 (Treatment Indications DB) |
| `02_TRIAGE` | **6** | WO-540, WO-670, WO-703, WO-704, WO-707, WO-708 |
| `03_REVIEW` | **3** | WO-654, WO-694, WO-B6 |
| `04_BUILD` | **3** | WO-661, WO-665, WO-706 |
| `05_QA` | **6** | WO-687, WO-697, WO-698, WO-699, WO-701, WO-705 |
| `06_USER_REVIEW` | **13** | WO-695, WO-696, WO-668–672, WO-677–682 |
| `98_HOLD` | **44** | WO-553 (conflict risk with WO-696) |
| `99_COMPLETED` | **119** | Includes WO-704, WO-709 |

---

## ⚪ Next Recommended Actions

1. **PRODDY → WO-695 plan** — Highest-leverage item. Nothing in the intelligence layer works without `protocol_id`. Spec → INSPECTOR → BUILDER.
2. **PRODDY → WO-696 plan** — Safety surveillance is blind. Spec → INSPECTOR → BUILDER.
3. **User visual confirm WO-668–672** — Ibogaine modules are QA-cleared. One visual sign-off moves 4 tickets to `99_COMPLETED`.

---

## 📋 Protocol Changes Made This Session

- **Work Order Metadata Standard established** — All active and future WOs must include `Data from / Data to / Theme` footer. Applied retroactively to all 27 active WOs (2026-03-27).

---

## Key Clinical Context (Do Not Lose)

- **Dr. Allen** — 600+ Ibogaine sessions, paper in preparation on QTc thresholds. His numbers override standard references on this platform.
- **QTc thresholds (FINAL):** Green <490 / Amber 490 / Orange 500+ / Red advisory 550+ — **NO hard block at any level**
- **Substance types:** Ibogaine HCL and TPA (Total Plant Alkaloid) are co-equal primary substances — not alternatives
- **No ibogaine + ketamine mixing** in Dr. Allen's protocol
- **Assessments are elective** — no assessment is a hard gate on Phase 2 entry, per Dr. Allen
- **Ataxia grading:** 0 / +1 / +2 / +3 ordinal scale used alongside SARA
- **cumulative_mg_kg** — STORED column in `log_dose_events` (per LEAD amendment 2026-03-26 — overrides original "don't store" note)

---

## 🔒 Locked Decisions

- Additive-only schema (no DROP, RENAME, ALTER TYPE)
- Zero-PHI (Subject_ID only in clinical tables)
- RLS on all log_* tables
- `log_/ref_/v_/mv_` four-layer naming convention
- No mock data made permanent once a real `mv_*` view exists
- **2026-03-26:** If a `v_*` or `mv_*` view exists, the UI MUST read from it — client-side recomputation is a QA FAIL (Read Model Policy)
- **2026-03-26:** Network comparison surfaces (site-vs-network) must be feature-flagged off until ≥10 contributing sites
- **2026-03-26:** Beta suppression threshold = n<5 with "Early data — results will strengthen" label (production: n<20)
- **2026-03-26:** Clinical disclaimers (response/remission/trajectory) are mandatory: "Algorithm-derived — verify with clinical judgment"
- **2026-03-26:** pg_cron MV refresh: `0 */4 * * *` — jobid 1, active, do not change without LEAD sign-off
- **2026-03-27:** All active and future _WORK_ORDERS must include `Data from / Data to / Theme` footer lines
