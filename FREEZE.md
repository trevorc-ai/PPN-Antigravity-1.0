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

# ── Add files here when approaching a milestone ──
# Uncomment to protect:
# src/pages/InteractionChecker.tsx
# src/components/wellness-journey/DosingSessionPhase.tsx
# src/components/wellness-journey/LiveSessionTimeline.tsx
