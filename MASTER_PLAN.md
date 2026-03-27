# PPN Portal - Master Plan

**Version:** 5.1.0
**Last Updated:** February 24, 2026
**Status:** MVP Development Phase
**Location:** `/MASTER_PLAN.md` (Project Root)

> **⚠️ SINGLE SOURCE OF TRUTH**: All agents must reference this document for immediate high-level project state context. It is strictly minimized to save Gemini API tokens.
> **Read next:** `/RELEASE_STATUS.md` — current beta tester roster, active sprint tickets, and known UX gaps. LEAD keeps it current after every completed session.

## 🎯 Current Mission
Build the Practice Operating System for Psychedelic Therapy - unifying safety, outcomes, and compliance into a secure platform trusted worldwide.

## 📊 Current Status
- **Core App Framework:** React, Vite, Tailwind CSS, Supabase.
- **Agent Governance:** We use a highly strict multi-agent silent Kanban system governed by `_WORK_ORDERS`.
- **Primary Design Directive:** WCAG 2.1 AA accessibility. No color-only meaning. Strict mathematical layouts and rich glassmorphism UI/UX.
- **Database Architecture:** Absolute zero-PHI. Idempotent, additive SQL only via the `.agent/skills/migration-manager/SKILL.md` protocols. RLS is mandatory for all schemas.

## 👥 The 8-Agent Swarm

2. **LEAD (Coordinator)** - Monitors `00_INBOX` and instantiates Work Orders with exact templates, defines the initial technical architecture, Routes tickets exactly by strict `agent.yaml` logic.
3. **PRODDY (Product Strategy)** - Generates PRD roadmaps. Output MUST be validated by `/proddy-review`.
4. **DESIGNER** - UI/UX Architecture. Constrained by `/accessibility-checker`.
5. **BUILDER (Implementation)** - Writes React/TS code. Strict no-lazy-code rule. Wraps operations in Try/Catch.
6. **INSPECTOR (QA Gatekeeper & DB Analyst)** — Final quality authority.
   Read-only database access: runs SELECT diagnostics, schema audits,
   and verification queries. Outputs SQL blocks to chat for USER execution.
   Does NOT write migration files. Does NOT execute SQL.
   Approves or rejects all BUILDER output before USER_REVIEW handoff.


## 🚨 Critical Protocols
1. **The Silent Conveyor Belt:** Work smoothly moves through `00_INBOX → 01_DESIGN → 02_TRIAGE → 03_REVIEW → 04_BUILD → 05_QA → 06_USER_REVIEW → 99_COMPLETED` via bash `mv` commands entirely through YAML frontmatter states.
2. **Identity & Accessibility First:** Always start/end with `==== [AGENT NAME] ====`. 
3. **Artifact-First:** No code is written before a plan exists.

## 🚧 Active System Blockers
- Scaling the application for public beta while ruthlessly defending the schema from PHI/PII leakage.

*(Note: Old operational roadmaps and strategy brainstorming artifacts have been archived to save LLM context window space).*

---

## 🏛 Pillar State *(updated 2026-03-27 — verified against live DB)*

Pillars are concurrent. All five are valid build targets. This section declares where **active infrastructure gaps exist** so agents can prioritize within pillars and flag zero-pillar work.

> **15 materialized views confirmed live in Supabase as of 2026-03-27.** All previous "DB gap" entries were outdated. The database layer is substantially complete. Current gaps are **UI wiring gaps only** — the MVs exist, the components are not yet reading from them.

**Live MVs confirmed:** `mv_clinician_work_queue`, `mv_documentation_completeness`, `mv_followup_window_compliance`, `mv_network_outcome_benchmarks`, `mv_network_safety_benchmarks`, `mv_outcome_deltas_by_timepoint`, `mv_patient_latest_status`, `mv_patient_trajectory_summary`, `mv_protocol_outcome_rollup`, `mv_site_dashboard_summary`, `mv_site_documentation_summary`, `mv_site_followup_compliance`, `mv_site_outcome_benchmarks`, `mv_site_safety_benchmarks`, `mv_unresolved_safety_flags`

| Pillar | Status | Real Gap (verified 2026-03-27) |
|--------|--------|-------------------------------|
| 1 — Safety Surveillance | 🟡 **UI Gap** | MVs exist. `SafetyRiskMatrix` queries raw `log_safety_events` instead of `mv_unresolved_safety_flags`. `PatientJourneySnapshot` still uses `MOCK_JOURNEY_DATA` instead of `mv_patient_latest_status`. WO-716, WO-717 filed. |
| 2 — Comparative Intelligence | 🟡 **UI Gap** | `mv_site_outcome_benchmarks` + `mv_network_outcome_benchmarks` exist. `ConfidenceCone` + `PatientConstellation` still on mock. WO-718, WO-720 filed. |
| 3 — QA / Governance | 🟡 **UI Gap** | `mv_protocol_outcome_rollup` exists. `ProtocolEfficiency` still on mock data. `PatientFlowSankey` still needs `mv_site_monthly_quality` (not yet built — only remaining true DB gap). WO-719 filed. |
| 4 — Network Benchmarking | 🟡 **Nearly Ready** | `mv_network_outcome_benchmarks` + `mv_network_safety_benchmarks` exist. Data seeding pipeline still blocked on ref_ naming + FK corrections. `GlobalBenchmarkIntelligence` claims live — verify. |
| 5 — Research Infrastructure | ⚪ Not started | No analytical export views exist yet. |

**Near-term must-wins:** Wire 5 analytics components off mock data (WO-716–720). All MVs exist — this is a UI wiring sprint, not a DB sprint. Then ship Analytics Hub (WO-721).

