# FREEZE.md — Protected Files
# Pre-commit hook reads this file. Any file listed here will BLOCK a commit.
# To unfreeze: remove it from the list and commit this file first.
# Last updated: 2026-03-05 — LOCKDOWN MODE ACTIVE

# ── Dashboard & Search (frozen post WO-552/553 cleanup) ──
src/pages/Dashboard.tsx
src/pages/SimpleSearch.tsx
src/components/Footer.tsx

# ── My Protocols, Interaction Checker, Substance Library & Monograph (frozen 2026-03-06) ──
src/pages/MyProtocols.tsx
src/pages/InteractionChecker.tsx
src/pages/SubstanceCatalog.tsx
src/pages/SubstanceMonograph.tsx


# ── Governance (never touch without explicit authorization) ──
agent.yaml
GLOBAL_CONSTITUTION.md
MASTER_PLAN.md
FREEZE.md
handoff.sh

# ── Core CSS / Design System (stable — changes affect ALL pages) ──
src/index.css

# ── Safety Engine (clinically sensitive) ──
src/services/contraindicationEngine.ts

# ── Authentication Flow (recently stabilized) ──
src/contexts/AuthContext.tsx
src/pages/ResetPassword.tsx
src/pages/SecureGate.tsx

# ── Active Clinical Components (recently stabilized) ──
src/components/session/ActiveSessionsWidget.tsx
src/components/compass/BrainNetworkMap.tsx
# Phase1StepGuide.tsx — unfrozen 2026-03-06 for authorized mobile UX push

# ── Wellness Journey (frozen post-sprint WO-524/525/526/527/529) ──
src/components/wellness-journey/BehavioralChangeTracker.tsx
src/components/wellness-journey/CompletenessWidget.tsx
src/components/wellness-journey/ComplianceDocumentsPanel.tsx
src/components/wellness-journey/DeltaChart.tsx
src/components/wellness-journey/DemoDataBadge.tsx
src/components/wellness-journey/ExportButton.tsx
src/components/wellness-journey/FeedbackToast.tsx


src/components/wellness-journey/NeuroplasticityWindowBadge.tsx
src/components/wellness-journey/PatientOutcomePanel.tsx
src/components/wellness-journey/PatientProgressSummary.tsx
# PatientSelectModal.tsx — unfrozen 2026-03-06 for authorized mobile UX push

src/components/wellness-journey/PhaseIndicator.tsx
src/components/wellness-journey/PreparationPhase.tsx
# ProtocolConfiguratorModal.tsx — unfrozen 2026-03-06 for authorized mobile UX push
src/components/wellness-journey/QuickActionsMenu.tsx
src/components/wellness-journey/RiskEligibilityReport.tsx

src/components/wellness-journey/SlideOutPanel.tsx
src/components/wellness-journey/StructuredIntegrationSession.tsx

src/components/wellness-journey/WorkflowCards.tsx
src/components/wellness-journey/index.ts

# ── Environment & Secrets (never commit real keys) ──
# NOTE: .env files must also be listed in .gitignore
.env
.env.local
.env.staging

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

