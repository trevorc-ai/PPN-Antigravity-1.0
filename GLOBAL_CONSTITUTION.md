# 🌍 THE GLOBAL CONSTITUTION (Universal Project Rules)
**STATUS: IMMUTABLE** | **AUTHORITY: SYSTEM OVERRIDE**

This document supersedes all other instructions. All agents MUST abide by these protocols to ensure a secure, scalable, and accessible environment.

## 1. 🚨 ACCESSIBILITY & IDENTITY PROTOCOLS (MANDATORY)
[CONTEXT: The CEO has a color vision deficiency. You must format your output to be universally accessible.]
*   **Identify Yourself:** Begin and end EVERY response with `==== [YOUR AGENT NAME] ====`.
*   **Visual Design (DESIGNER/BUILDER):** Enforce WCAG 2.2 AA standards. Minimum font size must be 12px. Use visual textures, patterns, and icons alongside colors in all UI components.

## 2. DATABASE & DATA ARCHITECTURE (MANDATORY — ALL AGENTS)

*   **Zero Free-Text Absolute Rule:** log_ tables may ONLY contain:
    INTEGER/BIGINT FKs to ref_ tables, UUIDs, numeric measurements,
    timestamps, CHECK-constrained enum VARCHAR, cryptographic hashes,
    machine identifiers, and Stripe external IDs.
    No free-text (TEXT/VARCHAR) clinical narrative columns — ever.

*   **USER IS THE SOLE DATABASE OPERATOR:**
    Agents may NOT write or execute ANY SQL that modifies database
    structure or data. This includes:
      - DDL: CREATE TABLE, ALTER TABLE, DROP TABLE/COLUMN, CREATE POLICY
      - DML: INSERT, UPDATE, DELETE via SQL
      - Migration files (.sql) — agents do NOT author these
    Agents that output raw SQL to the chat for USER review are permitted.
    Agents that create .sql files or attempt to execute them are in violation.

*   **Agent DB Permissions (READ + APP-LAYER WRITE ONLY):**
    - SELECT queries (diagnostics, audits, verification) → ALLOWED
    - INSERT/UPDATE via React/Supabase client (application code) → BUILDER ALLOWED
    - Any SQL file creation → FORBIDDEN
    - Any Supabase MCP or direct DB connection → FORBIDDEN

*   **Additive Schema Policy (USER-enforced):**
    The USER manually applies all schema changes via the Supabase SQL Editor.
    When a schema change is needed, agents output the SQL block in chat
    for USER review — labeled clearly with expected result and pre-flight queries.
    The USER runs it, pastes the result, and the agent verifies.

*   **RLS is Mandatory:** Row Level Security must be ON for every public table.
    All application writes are site-scoped via log_user_sites.


## 3. ⚙️ THE SILENT CONVEYOR BELT WORKFLOW (ALL AGENTS)
[CONTEXT: We operate on a silent, file-based Kanban system.]
*   **Artifact-First:** Write code only after a `.md` plan or `.sql` schema is documented and approved.
*   **Silent Handoffs:** Do not tag other agents in the chat. When your task is complete, update the `owner` and `status` in the ticket's YAML frontmatter.
*   **Execute the Handoff Script:** Run `./handoff.sh [filepath] [next_folder] [next_agent]` in the terminal to move the file and log your status. Silently terminate your turn immediately after.
*   **The Two-Strike Debugging Rule:** If you attempt to fix a bug and fail twice, you must STOP. Revert to the last working state via `git restore .` and request a new Tree-of-Thoughts strategy from LEAD.

## 4. 🌿 BRANCH DISCIPLINE POLICY (ALL AGENTS)

**Main-Only Development.** All code changes are committed directly to `main`. No feature branches may be created without explicit LEAD approval documented in a Work Order.

**No Stashing.** Agents must never use `git stash`. Stashed changes are orphaned, accumulate pre-deletion state, and cause content reversion when popped.

**Recovery Commits Are Forbidden.** Any commit containing "restore", "recovery", "FULL EXTRACTION", or similar language that reverts intentional deletions is a critical violation. If something appears broken after a merge, use `git revert` on the specific commit — never restore from an older state.

**Branch Hygiene Enforcement (LEAD):**
- On every `/lead-pipeline-scan`, run `git branch` and list any branch other than `main`.
- For each unauthorized branch found, report it to the USER and **request explicit approval before deleting**: "Found stale branch `<name>`. Approve deletion? (yes/no)"
- Only after USER approves: `git branch -D <branch-name>`
- Any agent found creating an unauthorized branch: set WO to `98_HOLD`, alert USER.

*Rationale: 16 stale branches and 7 stale stashes were identified as the root cause of dozens of intentional deletions being undone. This policy prevents recurrence.*

## 5. 🔒 ZERO-UNAUTHORIZED-CHANGES POLICY (ALL AGENTS — IMMUTABLE)

**NO agent may make ANY deletion, addition, or change — to code, UI, data, copy,
logic, routing, styling, or configuration — without the USER's express written approval.**

### What Requires Approval (Everything)
- Adding, removing, or renaming any file, component, route, or function
- Changing any button label, navigation target, or user-facing copy
- Changing any business logic, state management, or data flow
- Adding any feature, CTA, flow, or UI element not explicitly requested
- "Improving", "cleaning up", or "refactoring" anything not listed in the approved scope
- Fixing a bug adjacent to the requested bug if not explicitly approved

### The Required Artefact Gate
Before writing a SINGLE LINE of code, every agent MUST:
1. Create an `implementation_plan.md` in the task's brain directory
2. Present it to the USER via `notify_user` with `BlockedOnUser: true`
3. Receive explicit written approval ("approved", "go", "yes", or equivalent) in chat
4. Only then enter EXECUTION mode

### Violations
Any agent that writes code, modifies files, or changes behaviour without an approved
plan is considered a **rogue agent**. The USER will:
- Roll back all changes via `git revert`
- Flag the incident in the Work Order as a governance violation
- Require a full re-plan before the work is re-attempted

*Rationale: Rogue agents making unauthorized UI and logic changes have repeatedly
introduced illogical flows, contradicted clinical workflow requirements, and eroded
practitioner trust in the platform. This rule is non-negotiable.*

---

## Section 6 — STRATEGIC OPERATING LAYER
*Version 1.0 | 2026-03-25 | Amendment authority: USER only*

### North Star
PPN Portal is the structured intelligence layer for psychedelic treatment programs — turning longitudinal clinical data into operational decisions. Every task must strengthen at least one of the five pillars below. Work that strengthens none is kill-list work. Stop and surface to the USER before proceeding.

### The Five Pillars *(concurrent — not sequential)*
| # | Pillar | Operational Value |
|---|--------|------------------|
| 1 | **Safety Surveillance** | Daily risk detection, escalation triggers, adverse event tracking |
| 2 | **Comparative Clinical Intelligence** | Cross-protocol and cross-patient outcome comparison |
| 3 | **QA and Governance** | Every treatment documented, completed, zero untracked dropouts |
| 4 | **Network Benchmarking** | Structured, like-for-like peer network comparisons |
| 5 | **Research Infrastructure** | Data structured for academic and regulatory submissions |

### Hierarchy of Truth *(higher items override lower)*
1. Locked strategy — North Star, pillars, non-negotiables, kill-list
2. Confirmed architecture — LEAD + USER approved decisions
3. Active workflows and skills
4. The current task request
5. Agent creativity

### Kill-List — Do Not Build
- Analytics components using hardcoded or mock data (once a real SQL view exists)
- AI-generated clinical summaries on mock, weak, or unvalidated data
- Free-text fields where a structured FK reference to a `ref_` table should exist
- One-off site customizations that destroy cross-site standardization
- Cosmetic dashboards with no `v_` or `mv_` SQL backing
- Any feature that cannot be mapped to at least one of the five pillars

### Operational Detail — Where to Find It
Agents: the "how" lives in skills and workflows, not here. Reference at the moment of decision:
- **Decision filter (5 questions before any task):** `/request-triage` workflow
- **Analytical layer rules** (`log_`/`ref_`/`v_`/`mv_`, suppression, mock data sunset): `migration-manager` skill, `frontend-best-practices` §6
- **No-reopening and no-fake-certainty discipline:** `proddy-protocol`, `inspector-qa` Phase 0
- **Pillar classification gate:** `inspector-qa` Phase 0, WO template `pillar_supported` field

---
*Section 6 added 2026-03-25 per INSPECTOR SQL-Layers alignment audit. Amendment requires USER authorization.*
