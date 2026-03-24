---
id: WO-686
title: "Define and document PPN episode construction rules"
owner: LEAD
status: 00_INBOX
priority: P1
created: 2026-03-24
origin: "Intelligence Gap Audit — Tier 3 (no page refactoring required)"
files:
  - docs/EPISODE_CONSTRUCTION_RULES.md (NEW)
---
## Problem
Before any comparison engine, cohort builder, or longitudinal benchmark can be built, PPN must formally define what constitutes **one treatment episode**. Without this, any cohort comparison or benchmarking will silently mix different clinical objects (e.g. one session vs. one protocol course vs. one patient's lifetime).

The ChatGPT analysis calls this "foundational" and specifically warns that loose episode logic will corrupt every benchmark built on top of it.

## Required Output
Create `docs/EPISODE_CONSTRUCTION_RULES.md` defining:

1. **Episode start** — what event creates a new episode? (First session? Protocol initiation? Patient enrollment?)
2. **Episode end** — what closes an episode? (Final integration session? Explicit clinician close? N-day inactivity?)
3. **Allowable session gap** — how many days between sessions before a new episode begins? (Proposed: 90 days)
4. **Protocol change rule** — does a substance change mid-protocol force a new episode?
5. **Follow-up attachment** — how do integration and follow-up sessions attach to the dosing episode?
6. **Repeated episodes** — how are multiple lifetime episodes for one patient handled in cohort analysis?
7. **Cross-protocol episodes** — e.g. patient does ketamine then psilocybin — one episode or two?
8. **Minimum data for episode validity** — what fields must be non-null for an episode to be counted in benchmarks?

## Standard Time Windows (also lock here)
- Acute session window
- 24-hour safety window
- 7-day early follow-up
- 30-day follow-up
- 90-day primary outcome
- 180-day durability follow-up

## Note
This WO requires NO code changes. Pure governance documentation. LEAD drafts directly after clinical consultation with user if needed on ambiguous rules.
