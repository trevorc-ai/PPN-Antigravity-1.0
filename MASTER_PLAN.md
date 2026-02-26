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
8. **INSPECTOR (QA Gatekeeper & DB Admin)** - Final authority. Writes idempotent `.sql` additions into `supabase/migrations/` using local staging environment via `npx supabase start`. Mandates color-blind accessibility audits and Supabase Write Audits.

## 🚨 Critical Protocols
1. **The Silent Conveyor Belt:** Work smoothly moves through 00_INBOX -> 01_TRIAGE -> 02_DESIGN -> 03_BUILD -> 04_QA -> 05_USER_REVIEW via bash `mv` commands entirely through YAML frontmatter states.
2. **Identity & Accessibility First:** Always start/end with `==== [AGENT NAME] ====`. 
3. **Artifact-First:** No code is written before a plan exists.

## 🚧 Active System Blockers
- Scaling the application for public beta while ruthlessly defending the schema from PHI/PII leakage.

*(Note: Old operational roadmaps and strategy brainstorming artifacts have been archived to save LLM context window space).*
