id: WO-685
title: "Create PPN Algorithm Specification documents for top 5 existing engines"
owner: LEAD
status: 05_QA
priority: P1
created: 2026-03-24
completed_at: 2026-03-25
builder_notes: "Created docs/algorithm-specs/ directory with 5 algorithm spec docs: AE_NOTIFY_GRADE3PLUS_V1.md, OUTCOME_RESPONSE_PHQ9_V1.md, RELEASE_READY_PSILOCYBIN_V1.md, CONTRAINDICATION_IBOGAINE_V1.md, BENCH_SAFETY_RATE_V1.md. All 13-section template complete per intelligence gap audit spec."
origin: "Intelligence Gap Audit — Tier 3 (no page refactoring required)"
files:
  - docs/algorithm-specs/ (NEW directory)
  - docs/algorithm-specs/AE_NOTIFY_GRADE3PLUS_V1.md
  - docs/algorithm-specs/OUTCOME_RESPONSE_PHQ9_V1.md
  - docs/algorithm-specs/RELEASE_READY_PSILOCYBIN_V1.md
  - docs/algorithm-specs/CONTRAINDICATION_IBOGAINE_V1.md
  - docs/algorithm-specs/BENCH_SAFETY_RATE_V1.md
---
## Problem
PPN computes important clinical conclusions (AE grading, response/remission, release readiness, contraindication logic, safety benchmarks) but has no formal documentation of how those conclusions are reached. This means:
- Regulators and IRBs cannot audit the logic
- Different implementations may compute the same thing differently
- When the logic changes, there's no version history

## Required Output
Create a `docs/algorithm-specs/` directory at project root. Write a spec document for each of the 5 existing engines using the PPN Algorithm Specification Template (documented in the Intelligence Gap Audit and the ChatGPT research document).

Each spec must cover:
1. Algorithm identity (ID, class, status, version, owner)
2. Business and clinical purpose
3. Algorithm type (rule_engine | scoring_engine | state_engine | etc.)
4. Input contract (required fields, source tables, validation rules)
5. Plain-English logic summary
6. Formal pseudo-logic
7. Thresholds and controlled vocabulary
8. Confidence level (deterministic | rule_based | estimated | provisional)
9. Missing data handling
10. Override policy
11. Report surfaces (where in UI/reports this output appears)
12. Limitations statement
13. Change log

## Priority Order
1. `AE_NOTIFY_GRADE3PLUS_V1` — regulatory notification (highest liability)
2. `OUTCOME_RESPONSE_PHQ9_V1` — response/remission scoring
3. `RELEASE_READY_PSILOCYBIN_V1` — transport readiness
4. `CONTRAINDICATION_IBOGAINE_V1` — safety gate (document what WO-673 is implementing)
5. `BENCH_SAFETY_RATE_V1` — AE rate benchmark calculation

## Note
This WO requires NO code changes. Pure documentation. LEAD can draft these directly.
