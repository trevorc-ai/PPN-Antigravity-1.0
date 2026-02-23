---
id: LEAD-HANDOFF
title: "LEAD Agent Handoff — Session 2026-02-23"
created: 2026-02-23T10:50 PST
previous_chat_reason: "Context window saturation — session too long"
git_branch: main
last_commit: ca34045
---

# LEAD Handoff — New Chat Orientation

---

## SECTION 0: YOUR ROLE AND OPENING INSTRUCTIONS

You are **LEAD — Lead Technical Architect, Scrum Master & Swarm Coordinator** for the
PPN Portal project. You are the master orchestrator. Nothing stalls on your watch.

**Read this entire document before responding to anything.**

When you are ready, open with:
> "LEAD online. I have the full project state in context from the previous session.
> Here's where we are and what's next."

Then present the Sprint Snapshot from Section 5.

---

## SECTION 1: PROJECT IDENTITY

- **Product:** PPN Portal — Psychedelic Practitioners Network
- **Purpose:** Clinical documentation platform for psychedelic therapy practitioners
- **Stack:** React 18 + TypeScript + Vite (frontend) | Supabase (PostgreSQL + RLS) + Auth (backend)
- **Styling:** Tailwind CSS + custom design tokens (dark theme, slate palette, amber accents)
- **Codebase root:** `/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/`
- **Dev server:** `npm run dev` (Vite, hot-reload — keep running, do not restart unless asked)
- **Git:** All work committed and pushed to remote `main` branch
- **Last confirmed commit:** `ca34045` — "docs(wo-405): add Section 0 handoff context for new SOOP chat agent"

---

## SECTION 2: IMMUTABLE RULES (Architecture Constitution)

These are non-negotiable. Any agent violating them is immediately stopped.

1. **Additive DB only.** `CREATE TABLE IF NOT EXISTS` and `ALTER TABLE ADD COLUMN IF NOT EXISTS` only. Never DROP, never ALTER COLUMN TYPE.
2. **RLS required.** Every new Supabase table needs `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;` immediately after creation.
3. **No PHI.** Patient reference in DB = `patient_link_code` (anonymized token). Never write `patient_id` or real names into any log/audit table payload.
4. **Zero free-text in patient-context forms.** All categorical inputs must be `<select>` backed by `ref_` tables, not `<input type="text">`. Exceptions require explicit LEAD sign-off in the work order.
5. **All Supabase write operations go through INSPECTOR (Step 5d).** Any ticket touching `.insert()`, `.upsert()`, `.update()`, `.delete()` on any Supabase table must be reviewed by INSPECTOR before merge. INSPECTOR runs a grep audit for string literals in FK columns.
6. **USER executes all SQL.** SOOP writes SQL. USER pastes it into Supabase SQL Editor. SOOP does not execute.
7. **Two-strike rule.** If a fix fails twice on the same ticket, STOP. Run `git restore .` and escalate to LEAD for new strategy.
8. **Artifact-first.** No code written without an approved `.md` plan or `.sql` schema in `_WORK_ORDERS/`.

---

## SECTION 3: AGENT GOVERNANCE CHANGES MADE THIS SESSION

These are already committed to `agent.yaml` and `GLOBAL_CONSTITUTION.md`. Do not revert.

### 3a. INSPECTOR Step 5d Added (agent.yaml)
INSPECTOR's checklist now has a mandatory **Supabase Write Operation Audit** step.
Every ticket touching a Supabase write must pass 4 rules:
- Rule 1: No `String()` conversions of integer IDs
- Rule 2: No string literals for categorical/type columns
- Rule 3: No PHI in audit log payloads
- Rule 4: `_id` columns must receive integers, not strings
INSPECTOR pastes grep evidence into the ticket before approval.

### 3b. GLOBAL_CONSTITUTION §2 Updated
Mandatory INSPECTOR gate for all write operations is now a constitutional rule, not just
an agent instruction. All agents read this on startup.

### 3c. Tier 1 / Tier 2 Workflow Policy (already in GLOBAL_CONSTITUTION)
- **Tier 1 (Free Zone):** Static HTML in `public/`, demo pages, landing copy. No work order needed.
- **Tier 2 (Ticket Required):** Anything in `src/`, Supabase queries, auth files, migrations.

---

## SECTION 4: WORK ORDER STATUS BOARD

### ✅ COMPLETE — No further action
| WO | Title | Notes |
|----|-------|-------|
| WO-404 | Roomba Cleanup Sprint | Dead routes removed, UI-ONLY comments added, dead navigate() calls fixed. All committed. |

### 🔴 IN PROGRESS — Active / Blocked
| WO | Title | Status | Blocker |
|----|-------|--------|---------|
| WO-405 | Log Table FK Compliance | 03_BUILD / SOOP | **USER must answer 3 governance questions.** SOOP has been split into its own chat. Full artifact at `_WORK_ORDERS/03_BUILD/WO-405_Log_Table_FK_Compliance.md`. DO NOT touch this WO in this chat — let the SOOP chat handle it. |

### 🟡 QUEUED — Ready to start when WO-405 progresses
| WO | Title | Owner | Notes |
|----|-------|-------|-------|
| WO-403 | Global Command Palette (⌘K) | DESIGNER → BUILDER | Design spec needed. Spec is in `_WORK_ORDERS/0403_Command_Palette.md`. DESIGNER starts this. |
| WO-402 | Phase 3 Data Wiring | BUILDER | Integration phase real data writes. Starts after WO-405 code fixes confirmed. |
| WO-231 | Baseline Data Seeding Pipeline | ANALYST + SOOP | Two streams: (A) ref_ table vocabulary seed, (B) benchmark aggregate tables. Starts after WO-405 Wave 1 migrations complete and data reset done. |

### 📋 BACKLOG — Planned, not yet ticketed
- Clinician profile / Edit Profile flow (currently routes to `/settings` as a placeholder)
- MEQ30 DB write (UI complete, DB write commented out)
- `log_behavioral_changes` ghost column cleanup (Wave 3 of WO-405)
- `log_consent.timestamp` type cleanup (Wave 3 of WO-405)

---

## SECTION 5: SPRINT SNAPSHOT (Current State as of 2026-02-23 10:50 PST)

```
PARALLEL TRACK A — Database (SOOP chat)
  WO-405 Wave 1: USER answers Q1/Q2/Q3 → SOOP finalizes SQL → USER executes → BUILDER fixes code
  WO-405 Wave 2: After Wave 1 confirmed — log_safety_events, log_chain_of_custody, log_protocols
  WO-405 Wave 3: Before beta — log_user_sites, log_consent, ghost columns

PARALLEL TRACK B — Features (this chat)
  WO-403: Command Palette — DESIGNER spec → BUILDER build → INSPECTOR
  WO-402: Phase 3 data wiring — BUILDER

AFTER BOTH TRACKS CONVERGE:
  WO-231: ANALYST seeds ref_ tables + designs benchmark data model
  DATA RESET: USER runs TRUNCATE script from WO-405 Section 9
  DOCTOR DEMO: Dr. Jason Allen + Dr. Shena Vanderpoeg
```

---

## SECTION 6: KEY TECHNICAL CONTEXT

### What Was Audited This Session
A forensic scan of every column in every `log_` and `ref_` table in the live Supabase DB
revealed that violations are **much broader than the initial 3 files** previously identified.

**The big picture:**
- 10 tables writing text strings where FK integers should be used
- 4 ref_ tables missing entirely (ref_session_types, ref_crisis_event_types, ref_system_action_types, ref_consent_types)
- 5 free-text clinical narrative columns needing governance decisions
- `log_clinical_records` has 100+ columns (God Table anti-pattern — document only, don't fix yet)
- Full details: `_WORK_ORDERS/03_BUILD/WO-405_Log_Table_FK_Compliance.md`

### Files Fixed This Session (committed, do not re-fix)
- `src/App.tsx` — dead routes removed (`/search`, `/billing`, `/forms-showcase`)
- `src/pages/Notifications.tsx` — dead `navigate('/clinicians')` → `/wellness-journey`
- `src/pages/ClinicianProfile.tsx` — dead `/clinicians` → `/dashboard`, `/profile/edit` → `/settings`
- `src/pages/About.tsx` — dead `/advanced-search` → `/dashboard`
- Multiple files — UI-ONLY governance comments added to text inputs in patient forms
- `GLOBAL_CONSTITUTION.md` — Tier 1/Tier 2 policy + INSPECTOR write gate rule added
- `agent.yaml` — INSPECTOR Step 5d added

### Live Ref Table PK Map (from live Supabase schema)
| Ref Table | PK Column | Type |
|-----------|----------|------|
| `ref_severity_grade` | `severity_grade_id` | BIGINT |
| `ref_resolution_status` | `resolution_status_id` | BIGINT |
| `ref_substances` | `substance_id` | BIGINT |
| `ref_routes` | `route_id` | BIGINT |
| `ref_indications` | `indication_id` | BIGINT |
| `ref_safety_events` | `safety_event_id` | BIGINT |
| `ref_user_roles` | `id` | INTEGER |
| `ref_intervention_types` | `intervention_type_id` | INTEGER |
| `ref_meddra_codes` | `meddra_code_id` | INTEGER |
| `ref_flow_event_types` | `id` | BIGINT |

### Data Reset Plan (Pending USER confirmation in SOOP chat)
Before any real patient data enters the system, 20 clinical log tables will be TRUNCATEd.
The TRUNCATE script is in `_WORK_ORDERS/03_BUILD/WO-405_Log_Table_FK_Compliance.md` Section 9.
`ref_*` tables, `log_sites`, `log_user_profiles`, `log_user_sites`, subscriptions are NEVER wiped.

---

## SECTION 7: DOCTOR DEMO STATUS

**Target:** Dr. Jason Allen + Dr. Shena Vanderpoeg  
**Full checklist:** `_WORK_ORDERS/READINESS_CHECKLIST_2026-02-23.md`

### Ready Now ✅
- Auth (login, signup, password reset)
- Phase 1 full (consent, baseline assessment, risk eligibility, gating logic)
- Phase 2 full (dosing protocol, vitals, gating logic)
- Substance Library (monographs, interaction checker, molecular viz)
- Analytics (8 deep dive pages, global benchmark panel)
- Help Center (8 articles, guided tour)
- Patient Companion page (16-video grid)

### P0 Bugs (Fix before demo)
1. `CrisisLogger.tsx` — writes string to `log_red_alerts.alert_type` instead of FK integer
2. `AdverseEventLogger.tsx` — `String(form.event_type_id)` converts integer to text before insert
3. `exportService.ts` — writes `patient_id` into `log_system_events.event_details` JSONB (PHI risk)
All three fixes are in WO-405 Section 6 and will be implemented by BUILDER after Wave 1 migrations.

### Demo Script
Full 15-minute doctor demo script is at `_WORK_ORDERS/READINESS_CHECKLIST_2026-02-23.md`

---

## SECTION 8: BUSINESS CONTEXT

- **Design Partners Being Approached:** Singularism (Jason Sienknecht), Dr. Jason Allen, Dr. Shena Vanderpoeg
- **Pricing for Design Partners:** $299/mo (Founding Partner rate, locked for 12 months)
- **Outreach materials:** `_WORK_ORDERS/BUSINESS_DOCS/` — Singularism outreach message, demo script, Design Partner Agreement draft, one-pager
- **PRODDY brief:** `_WORK_ORDERS/PRODDY_Singularism_Brief_2026-02-23.md` — full monetization strategy and Singularism pitch

---

## SECTION 9: KNOWN ENVIRONMENTAL ISSUE (Do Not Waste Time On)

`tsc --noEmit` fails with `EPERM: operation not permitted` on `node_modules` due to a macOS
file permission issue on this machine. This is environmental, not a code bug. The dev server
(`npm run dev`) runs fine. Do not attempt to fix this — it does not block development.

---

## SECTION 10: PROMPT FOR THE NEW LEAD CHAT

Copy and paste this to start your new session:

```
You are LEAD, the Lead Technical Architect and Scrum Master for the PPN Portal project.

Read this file in full before saying anything:
/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/_WORK_ORDERS/LEAD_HANDOFF_2026-02-23.md

Start with Section 0 for your opening instructions.

Note: WO-405 (database FK compliance) is being handled in a separate SOOP chat.
Do not duplicate that work. Focus this chat on WO-403 (Command Palette) and WO-402
(Phase 3 data wiring), and anything else the USER brings.
```
