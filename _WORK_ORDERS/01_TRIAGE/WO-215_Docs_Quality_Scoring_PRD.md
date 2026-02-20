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

---

## PRODDY PRD (2026-02-19)

### 1. Scoring Formula

Each session contributes up to 100 points. Score is calculated per session, then averaged across all sessions in the rolling 30-day window for the site-level health card.

| Dimension | Points | Trigger |
|---|---|---|
| Vitals complete | 20 | All vitals fields present at session log time |
| Baseline assessment | 30 | PHQ-9, GAD-7, or MEQ-30 recorded before Session 1 |
| 30-day longitudinal follow-up | 15 | Follow-up assessment recorded within 45 days of session |
| 60-day longitudinal follow-up | 10 | Follow-up recorded within 75 days |
| 90-day longitudinal follow-up | 10 | Follow-up recorded within 105 days |
| Integration session documented | 15 | At least one post-session integration note recorded |

**Total: 100 points per session.**

**Baseline rationale:** Weighted highest (30 pts) because it is the irreplaceable anchor for longitudinal comparison. A site that never captures baselines produces data that cannot be benchmarked or published. This is the most common quality gap.

**Minimum N to show score:** 5 sessions in the rolling window. Below 5, show "Insufficient data" rather than a misleading score.

### 2. Display Tiers

| Score | Label | UI State |
|---|---|---|
| 85-100 | Excellent | Full ring, no prompt |
| 70-84 | Good | Ring with small gap, tooltip: "Keep going" |
| 50-69 | Needs Attention | Partial ring, in-app prompt |
| Below 50 | Critical Gap | Alert state, prompt with specific gap type |

Prompt language (non-shaming): "3 sessions are missing 30-day follow-up assessments." Never: "You failed to complete follow-ups."

### 3. Gamification Guardrails

- Score only documentation completeness. Never score outcomes, recovery, or clinical results.
- Never show patient-level data in any gamification display.
- Never create leaderboards comparing practitioners by name.
- The network comparison view ("Your site: 94% / Alliance average: 81%") is available only to site admins, not to individual practitioners.
- Gap descriptions describe sessions, not people: "3 sessions missing integration note" not "Dr. Smith missed 3 notes."

### 4. Data Model (for SOOP)

**Recommended approach:** Materialized view, not a side table. Keep the source of truth in `log_clinical_records`. Compute scores as a view.

```sql
-- View: documentation_quality_scores
-- Computes a per-session score and a rolling 30-day site average
-- No new columns needed on log_clinical_records
-- SOOP to implement as materialized view with 24h refresh
```

Fields SOOP must compute per session:
- `session_score` INTEGER (0-100)
- `vitals_complete` BOOLEAN
- `baseline_assessed` BOOLEAN
- `has_30d_followup` BOOLEAN
- `has_60d_followup` BOOLEAN
- `has_90d_followup` BOOLEAN
- `has_integration_note` BOOLEAN

Site-level rollup (30-day window):
- `site_avg_score` DECIMAL
- `session_count_in_window` INTEGER
- `gap_counts` JSONB (e.g., `{"missing_baseline": 4, "missing_30d": 7}`)

**Recalculation:** Every 24 hours via Supabase cron job. Not real-time (performance constraint).
**k-anonymity guard:** Site score shown only if `session_count_in_window >= 5`.

### 5. Advisory Board Badge

Sites with confirmed Advisory Board membership get an "Alliance Advisory" marker on their documentation quality card.

**Visual:** A small badge icon next to the site name on the health card. Shield or star shape — DESIGNER to confirm.
**Label text:** "Alliance Advisory Member"
**Privileges unlocked:** Early access to new `ref_` vocabulary before general release (7-day preview window).
**Storage:** `log_sites.is_advisory_member BOOLEAN` column — SOOP adds via additive migration.

### Handoff Directives

**DESIGNER:** Design the completion ring UI (Apple Watch style, personal view), the site health card (admin view), and the gap prompt messages. Reference the guardrails in Section 3. Minimum font size 12px. No color-only state indicators.

**ANALYST:** Write the SQL scoring queries using the field definitions in Section 4. Apply k-anonymity guard (N>=5). Network comparison query must aggregate, not expose site-level identity to other sites.

**SOOP:** Implement as materialized view with 24h refresh. Add `is_advisory_member` boolean to `log_sites` via additive migration. No DROP commands.

**BUILDER:** Expose `getDocumentationQualityScore(siteId)` and `getSiteHealthCard(siteId)` in `analytics.ts`. Connect to DESIGNER's ring component.

**Owner:** DESIGNER (for UI specs) | **Status:** 02_DESIGN
