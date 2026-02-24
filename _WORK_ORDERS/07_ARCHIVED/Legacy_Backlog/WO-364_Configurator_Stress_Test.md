---
status: 00_INBOX
owner: PENDING
failure_count: 0
---

# 1. USER INTENT
The user wants to completely vet, stress-test, and anticipate all downstream consequences before we implement the "Protocol Configurator" (which hides features based on Archetype). We need to clearly outline the next steps and all other considerations to keep the architecture "airtight".

# LEAD ARCHITECTURE
This requires a deep dive into every single system that reads from or aggregates data collected in the Wellness Journey. Hiding a form is easy. Breaking a downstream system because it expected data from that form is the real risk.

Systems to audit:
1. Database Schema (`log_clinical_records`, `log_adverse_events`, etc.)
2. Readiness Engines (`benchmarkReadinessCalculator.ts`)
3. Risk Engines (`useRiskDetection.ts`, `riskCalculator.ts`)
4. Data Visualization (`PatientOutcomePanel.tsx`, `PulseCheckWidget.tsx`, `SymptomDecayCurve.tsx`)
5. Export/Reporting (`dischargeSummary.ts`, `pdfGenerator.ts`, `reportGenerator.ts`)
6. Navigation Logic (`WellnessJourney.tsx` state locks, `QuickActionsMenu.tsx`)

We need a comprehensive Stress Test Matrix detailing: What happens if [Feature] is disabled?
