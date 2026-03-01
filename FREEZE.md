# FREEZE.md — Protected Files
# Pre-commit hook reads this file. Any file listed here will BLOCK a commit.
# To unfreeze: remove it from the list and commit this file first.
# Last updated: 2026-02-26

# ── Governance (never touch without explicit authorization) ──
agent.yaml

# ── Core CSS / Design System (stable — changes affect ALL pages) ──
src/index.css

# ── Safety Engine (clinically sensitive) ──
src/services/contraindicationEngine.ts

# ── Authentication Flow (recently stabilized) ──
src/contexts/AuthContext.tsx
src/pages/ResetPassword.tsx

# ── Protocols & Pilot Path ──
src/pages/MyProtocols.tsx

# ── Wellness Journey (pilot path — do not touch) ──
src/components/wellness-journey/DosingSessionPhase.tsx
src/components/wellness-journey/LiveSessionTimeline.tsx
src/components/wellness-journey/WellnessFormRouter.tsx
src/components/wellness-journey/SlideOutPanel.tsx



# ── Add files here when approaching a milestone ──
# Uncomment to protect:
# src/pages/InteractionChecker.tsx
# src/components/wellness-journey/DosingSessionPhase.tsx
# src/components/wellness-journey/LiveSessionTimeline.tsx

## Housecleaning Standard
Files eligible for daily archive (move OUT of project, NOT delete):
- _WORK_ORDERS/99_COMPLETED/ — any ticket older than 7 days
- docs/ — any .md file not referenced in 7 days
- public/admin_uploads/ — any file not referenced by src/ code
- migrations/ — any SQL file prefixed 999_ (test/seed files)

Files NEVER eligible for housecleaning (active):
- src/ — all source code
- migrations/ (except 999_ prefix)
- _WORK_ORDERS/00_INBOX through 05_USER_REVIEW/
- FREEZE.md, agent.yaml, GLOBAL_CONSTITUTION.md

## Milestone Freeze Protocol
When a page or component is declared "demo-ready":
1. Add its file path to the protected list above
2. No agent ticket may modify that file until YOU manually remove it from this list
3. INSPECTOR rejects any ticket touching a frozen file — no exceptions

