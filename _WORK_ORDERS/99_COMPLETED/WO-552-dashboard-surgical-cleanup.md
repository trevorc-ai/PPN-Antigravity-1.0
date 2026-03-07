# WO-552 — Dashboard Surgical Cleanup

**Priority:** P1 — UI Polish
**Scope:** src/pages/Dashboard.tsx, src/components/Footer.tsx
**Type:** DELETE / HIDE — no new features, no DB changes

## Tasks

| # | Action | Target |
|---|--------|--------|
| 1 | DELETE | Name personalization — greeting becomes "Good evening." (no name suffix) |
| 2 | DELETE | Entire "Suggested Next Steps" section + 3 NextStepItem children |
| 3 | HIDE | Entire "Network Activity" section (hidden class, not removed) |
| 4 | CONDENSE | Footer — collapse 3-column grid to single compact bar |

## Constraints
- SURGICAL ONLY
- No other changes to Dashboard layout
- Footer condense = copyright left, compliance badges + policy links right, single row
- Network Activity = hidden not deleted
