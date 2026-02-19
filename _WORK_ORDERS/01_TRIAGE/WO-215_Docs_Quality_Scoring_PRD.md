---
id: WO-215
title: "PRODDY: Documentation Quality Scoring PRD — Clinical Gamification System"
status: 01_TRIAGE
owner: PRODDY
priority: P1
created: 2026-02-19
failure_count: 0
ref_tables_affected: none (new views/computed columns)
depends_on: Turning_Point.md — PRODDY mandate
---

## MANDATE (from Turning_Point.md)

> PRODDY: "Documentation quality gamification is a retention and network effect engine. Score only: 'Did you document the things you were supposed to document?' Outcome data is for the ANALYST. Documentation quality is for the game."

> DESIGNER: "Completion rings (like Apple Watch activity rings) — visual, personal, non-comparative by default. Incomplete rings show the gap type: '3 sessions missing follow-up.'"

## PRODDY DELIVERABLE: PRD

Write the complete PRD for the documentation quality scoring system:

### 1. Scoring Dimensions (define weights)

For each session logged, a site earns points across 4 dimensions. PRODDY must define the exact weights and point values based on clinical importance:

| Dimension | Proposed | Notes |
|-----------|----------|-------|
| Vitals complete | ? | Were all vitals logged during session? |
| Baseline assessment completed | ? | Before session 1? |
| Longitudinal follow-up completed | ? | 30-day, 60-day, 90-day assessments |
| Integration session documented | ? | Post-session integration record |

**PRODDY must define:** weights, thresholds, score calculation formula

### 2. Display Levels

Define the site-level documentation score tiers:
- What % = "Excellent"?
- What % = "Good"?
- What % = "Needs attention" (triggers prompt, not shaming)?

### 3. Practitioner vs. Admin Views

- **Practitioner view:** Personal completion ring for THIS session (not comparative)
- **Admin view:** Site monthly documentation health card with trend arrow
- **Network view:** "Your site: 94% / Network average: 81%" — available to admin only

### 4. Gamification Guardrails (clinical setting rules)

- **NEVER score outcomes** — only documentation completeness
- **NEVER show patient-level data** in gamification displays
- **NEVER create competitive leaderboards** (professional context)
- Only show gaps, never individual blame: "3 sessions missing follow-up" not "Dr. Smith missed 3"

### 5. Data Model Requirements (for SOOP)

Define what tables/views SOOP needs to build:
- Is this a materialized view? A side table? A computed query?
- How often is it recalculated?
- What is the minimum N for a score to be shown? (Suggested: N≥5 sessions)

### 6. Feature Gate: Advisory Board Badge

Advisory board member sites get an "Advisory Member" marker on their documentation quality card.
Define: what does this badge look like? What privileges does it unlock?

## HANDOFF CHAIN

After PRODDY PRD is complete:
1. DESIGNER → designs completion ring UI, site health card, admin view
2. ANALYST → writes the SQL scoring queries with k-anonymity guard
3. BUILDER → exposes scoring via analytics.ts service, hooks up to UI

## Acceptance Criteria

- [ ] Scoring formula defined with exact weights
- [ ] Display tiers defined with thresholds
- [ ] Gamification guardrails documented
- [ ] Data model requirements written for SOOP
- [ ] Advisory board badge spec included
