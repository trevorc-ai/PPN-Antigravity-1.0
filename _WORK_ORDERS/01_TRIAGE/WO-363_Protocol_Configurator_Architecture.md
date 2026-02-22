---
status: 01_TRIAGE
owner: LEAD
failure_count: 0
---

# ARCHITECTURE PLAN: Dynamic Protocol Configurator

## Executive Summary
Convert the static "Wellness Journey" into a dynamic, protocol-driven experience where clinicians/guides can select the archetype of their session at intake. The UI, calculation engines, and export logic will adaptively strip away unused features to minimize cognitive load and prevent "slide-out fatigue".

## 1. UI/UX: The Configurator Interface
**Consideration:** We need a frictionless way to ask the user how they want to run the session without overwhelming them with 20 checkboxes.
**Approach:** 
Interrupt the user *before* Phase 1 begins with a "Session Setup" Modal. Present three primary Archetypes:
1.  **Clinical / Medical Protocol:** (Strict) Auto-selects Vitals, PHQ-9 baselines, structured safety checks.
2.  **Wellness / Ceremonial Protocol:** (Lightweight) Hides Vitals/Clinical Baselines. Keeps Timeline Narrative, Set/Setting, and Integration logs.
3.  **Custom Configuration:** Opens an advanced menu of toggles for granular control.

## 2. State Management: The Protocol Context
**Consideration:** The choice made in the setup modal must dictate the rendering of components across all three subsequent phases.
**Approach:** 
Introduce a `SessionConfig` state object at the root of `WellnessJourney.tsx`. 
```typescript
interface SessionConfig {
    protocolType: 'clinical' | 'ceremonial' | 'custom';
    enabledFeatures: string[]; // e.g., ['vitals', 'phq9', 'meq30', 'safety-check']
}
```
Pass this configuration down to Phase 1, 2, and 3 components.

## 3. Component Rendering: Pruning the UI
**Consideration:** We must completely remove unselected items from the DOM, rather than just disabling or graying them out.
**Approach:** 
Wrap the rendering of every `WorkflowActionCard` in a boolean check against the `enabledFeatures` array.
*Example:* `{config.enabledFeatures.includes('vitals') && <WorkflowActionCard formId="session-vitals" />}`
This guarantees the UI aggressively shrinks to perfectly fit the chosen workflow.

## 4. The Readiness Engine: Dynamic Gating
**Consideration:** Phase 1 requires 5 completed "gates" to unlock Phase 2. If a user disabled the "Baseline Assessment" gate during setup, they will be permanently locked at 80% readiness (4/5 gates).
**Approach:** 
Refactor `calculateBenchmarkReadiness()` to accept the `SessionConfig`. 
If a gate is exempt by protocol, it is dropped from the denominator. Instead of `score = (completed / 5) * 100`, it becomes `score = (completed / 4) * 100`. The user can still hit 100% readiness legally.

## 5. The Outcomes Panel: Handling Missing Data
**Consideration:** Phase 3 includes a massive ComposedChart (Recharts) that graphs PHQ-9 symptom trajectories. If the ceremonial protocol disables PHQ-9 tracking, the math `(current - baseline) / baseline` will result in `NaN` and crash the dashboard loop.
**Approach:** 
Build an elegant "Zero-State Empty Shield" for `PatientOutcomePanel.tsx`. 
Add an early return: `if (!config.enabledFeatures.includes('phq9')) return <EmptyStateMessage />`. 
This states: "Clinical outcome tracking was disabled for this session protocol" instead of a broken chart.

## 6. The PDF Exporter: Handling Missing Variables
**Consideration:** The Discharge Summary generation code hardcodes text blocks like `Baseline: ${data.baseline.phq9}`.
**Approach:** 
Implement conditional block rendering within `downloadDischargeSummary()`. If `config.protocolType === 'ceremonial'`, the PDF renderer outputs "Vitals: Not applicable for this protocol" rather than "Vitals: undefined/undefined".
