# FREEZE.md — Do Not Touch List
# Last updated: 2026-03-11
#
# PURPOSE: This file tells agents which files are off-limits.
# Any file listed here must NOT be modified without your explicit instruction.
# To unfreeze a file: remove it from this list, save, then proceed.
#
# NOTE: The pre-commit hook (enforcement) is currently disabled.
# This file acts as agent guidance — INSPECTOR will reject any work order
# that touches a frozen file, even without the hook active.

# ── Core App Shell (stable — changes affect every page) ──────────────────────
src/index.css
src/App.tsx

# ── Dashboard & Search (frozen post WO-552/553) ───────────────────────────────
src/pages/Dashboard.tsx
src/pages/SimpleSearch.tsx
src/components/Footer.tsx

# ── Protocol Builder (frozen 2026-03-06) ──────────────────────────────────────
src/pages/MyProtocols.tsx
src/pages/InteractionChecker.tsx
src/pages/SubstanceCatalog.tsx
src/pages/SubstanceMonograph.tsx

# ── Wellness Journey (frozen post-sprint WO-524–529) ─────────────────────────
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
src/components/wellness-journey/PatientSelectModal.tsx
src/components/wellness-journey/Phase1StepGuide.tsx
src/components/wellness-journey/PhaseIndicator.tsx
src/components/wellness-journey/PreparationPhase.tsx
src/components/wellness-journey/ProtocolConfiguratorModal.tsx
src/components/wellness-journey/QuickActionsMenu.tsx
src/components/wellness-journey/RiskEligibilityReport.tsx
src/components/wellness-journey/SlideOutPanel.tsx
src/components/wellness-journey/StructuredIntegrationSession.tsx
src/components/wellness-journey/WorkflowCards.tsx
src/components/wellness-journey/index.ts

# ── Phase 2 — Dosing Session (frozen 2026-03-11) ────────────────────────────
src/components/wellness-journey/DosingSessionPhase.tsx
src/components/arc-of-care-forms/phase-2-dosing/DosingProtocolForm.tsx
src/components/arc-of-care-forms/phase-2-dosing/RescueProtocolForm.tsx
src/components/arc-of-care-forms/phase-2-dosing/SafetyAndAdverseEventForm.tsx
src/components/arc-of-care-forms/phase-2-dosing/SessionObservationsForm.tsx
src/components/arc-of-care-forms/phase-2-dosing/SessionTimelineForm.tsx
src/components/arc-of-care-forms/phase-2-dosing/SessionVitalsForm.tsx

# ── Clinical Components (recently stabilized) ─────────────────────────────────
src/components/session/ActiveSessionsWidget.tsx
src/components/compass/BrainNetworkMap.tsx
src/services/contraindicationEngine.ts

# ── Authentication (stable — do not touch without explicit authorization) ──────
src/contexts/AuthContext.tsx
src/pages/ResetPassword.tsx
src/pages/SecureGate.tsx

# ── Governance (never touch — these define how the system works) ──────────────
agent.yaml
GLOBAL_CONSTITUTION.md
MASTER_PLAN.md
FREEZE.md
handoff.sh

# ── Secrets (never commit — managed via .gitignore) ───────────────────────────
.env
.env.local
.env.staging
