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
