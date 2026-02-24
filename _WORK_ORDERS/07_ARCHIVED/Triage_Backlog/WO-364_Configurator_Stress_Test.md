---
status: 01_TRIAGE
owner: SOOP
failure_count: 0
---

## 1. SOOP & INSPECTOR COMPREHENSIVE VETTING & STRESS TEST
The user requested an "airtight" impact analysis of the downstream consequences before we hide forms via the Protocol Configurator. We analyzed the entire dependency tree.

### A. The "Vitals Logging" Form Removed (Phase 2)
*   **Database Schema (`log_session_vitals`)**: SAFE. It's an independent, additive table. 0 rows inserted = 0 errors.
*   **Risk Engine (`useRiskDetection.ts`)**: SAFE. `data.vitals` is optional. Missing vitals return `[]` anomalies.
*   **PDF Exporter (`dischargeSummary.ts`)**: VULNERABLE. The exporter attempts to write "Max BP:" based on a raw array. If empty, it prints `undefined` or crashes trying to read `[0]`.
    *   **Fix:** Add `if (!vitals || vitals.length === 0) return 'Vitals not monitored';`

### B. The "Mental Health Screening" Form Removed (Phase 1/3)
*   **Benchmark Readiness (`benchmarkReadinessCalculator.ts`)**: CRITICAL FAILURE. The engine hard-requires `hasBaselineAssessment` to pass Phase 1 gating.
    *   **Fix:** The Readiness Score denominator must dynamically shrink from 5 gates to 4 gates if the config drops clinical baselines.
*   **Risk Engine (`useRiskDetection.ts`)**: SAFE. The logic checks `if (data.baseline)` and returns empty arrays if naturally missing.
*   **Patient Outcome Visualization (`PatientOutcomePanel.tsx`)**: CRITICAL FAILURE. Relies on `(currentScore - baselineScore) / baselineScore`. If `baselineScore` is undefined/null, JS throws `NaN` and the Recharts component breaks. The chart attempts to draw a line from `undefined` to `undefined`.
    *   **Fix:** The entire outcome panel must be wrapped in `if (config.protocol === 'ceremonial' || !config.includes('phq9'))`, rendering a graceful "Clinical Tracking Disabled" empty state instead.

### C. The "Structured Safety Form" Removed
*   **Pre-Dosing Safety Lock (`PreparationPhase.tsx`)**: VULNERABLE. The preparation phase visually checks if `sessionGoals` contains the string `"Safety Check"`. If it never gets fired, the UI will look incomplete.
*   **PDF Exporter**: VULNERABLE. Will attempt to grab CSSRS (Suicidality) scores.

## 2. SYSTEM ARCHITECTURE & STATE MANAGEMENT
If we hide an action button, we actually have to do three completely different things simultaneously:
1.  **Hide the UI Button:** Wrap the `WorkflowActionCard` in a `config.includes('form_id')` check.
2.  **Exempt the Logic Gate:** Tell the `BenchmarkReadiness` function to divide by `-1` fewer requirements.
3.  **Graceful Degradation of Widgets:** Tell the dashboards (Charts/Risk Panels) to render a designated 'Empty State Message' rather than expecting data arrays.

## 3. NEXT STEPS TO PROCEED AIRTIGHT
We cannot do this via a giant, confusing Redux store. We need a clean **Context Provider**.

1.  **Step 1: The Protocol Setting Store**
    Create `src/contexts/ProtocolContext.tsx`. This holds `protocolType` ("clinical", "ceremonial") and `enabledFeatures: string[]`.

2.  **Step 2: Shielding the Vulnerabilities (The "Blast Radius")**
    *Fix the 3 broken systems first.*
    *   Update `benchmarkReadinessCalculator.ts` to accept `enabledFeatures`.
    *   Update `PatientOutcomePanel.tsx` to return an `<EmptyState />` if PHQ-9 tracking isn't enabled.
    *   Update `downloadDischargeSummary()` to inject fallback strings for missing arrays.

3.  **Step 3: Building the UI Gates**
    Update `WellnessJourney.tsx` to conditionally render the `WorkflowActionCards`.

4.  **Step 4: The Configurator Modal**
    Build `ProtocolConfiguratorModal.tsx` that pops up ONCE when you first enter Phase 1, writes the settings to the local context, and vanishes.

I will reply to the user.
