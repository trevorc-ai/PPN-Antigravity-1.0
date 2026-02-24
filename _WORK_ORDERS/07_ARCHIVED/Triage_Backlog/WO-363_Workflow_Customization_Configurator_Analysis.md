---
status: 01_TRIAGE
owner: PRODDY
failure_count: 0
---

## 1. USER INTENT
The user wants to allow the clinician/guide to customize the UI by selecting which features/forms they intend to use at the beginning of a session (e.g., hiding vitals for religious/non-clinical use cases, or hiding specific assessments). This avoids a "one-size-fits-all" UI and further combats "slide-out fatigue" and visual clutter.
The user requested three perspectives (Analyst, Builder, Inspector) and recommendations on how to proceed.

## 2. ANALYST: Core Product & Workflow Perspective
**Assessment:** The psychedelic space is historically fragmented. You have highly clinical models (ketamine clinics requiring strict SpO2/BP monitoring) and purely ceremonial/facilitator models (where a BP cuff breaks the "set and setting"). Forcing the latter to look at empty Vitals panels causes frustration; forcing the former to *remember* to click Vitals risks malpractice.
**Recommendations:**
1.  **Protocol-Driven UI, Not Just "Toggles":** Instead of a checklist of 15 random toggles, use "Archetypes" or "Protocols" during Phase 1 onboarding.
    *   *Medical Model:* Auto-enables Vitals, SpO2, PHQ-9, AI Risk Engine.
    *   *Facilitator/Ceremonial Model:* Disables Vitals, focuses on Timeline Note, Preparation, Integration, MEQ-30.
    *   *Custom:* Let them toggle manually.
2.  **Less is More:** If a feature isn't selected, it shouldn't just be "grayed out"—it should completely vanish from the DOM to save screen real-estate.

## 3. BUILDER: Component & State Perspective
**Assessment:** Our `WorkflowActionCard` components are already abstracted, making dynamic rendering easy. However, we need a robust state object to manage the configuration.
**Recommendations:**
1.  **Configuration Context/Store:** Create a `ProtocolConfig` object passed into `WellnessJourney` (or via Context) that defines `enabledFeatures: string[]`.
2.  **Dynamic Rendering:** Wrap the `WorkflowActionCard` renders in simple booleans:
    `{config.features.includes('vitals') && <WorkflowActionCard type="vitals" ... />}`
3.  **UI for Configuration:** Build a simple modal or the first step of Phase 1 to define this config. "Before we begin, how are you running this session?"

## 4. INSPECTOR: Database & Data Integrity Perspective
**Assessment:** If we start hiding forms, we must ensure our backend aggregates (like Benchmark Readiness or Risk Engines) don't violently crash expecting data that was intentionally omitted.
**Recommendations:**
1.  **Nullable by Default:** Ensure Supabase tables remain relaxed on constraints for optional metrics. `blood_pressure` must allow `NULL`.
2.  **Smart Aggregations:** The `BenchmarkReadiness` calculator currently expects 4 strict gates (Consent, Assessment, Observation, Protocol). If a ceremonial guide skips "Assessment" (PHQ-9), the system must "Pass" them regardless. The gating logic must become *context-aware* based on the `ProtocolConfig`.
3.  **Discharge Summary Fallbacks:** The PDF exporter must gracefully handle missing sections. "Vitals: Not recorded (Protocol: Ceremonial)".

## 💡 SYNTHESIS & RECOMMENDATION

**The Strategy: "The Protocol Engine"**

We should not build a 50-checkbox settings page. We should build a **"Protocol Selector"** at the very beginning of a new patient journey.

1.  **Clinical/Medical Model** (Vitals, PHQ9, GAD7, Strict Safety Gates)
2.  **Wellness/Ceremonial Model** (Set/Setting, Timeline Narrative, Integration, MEQ-30. No Vitals).
3.  **Custom** (Build your own).

**Next Steps:**
Reply to the user presenting this analysis and proposing the implementation of the "Protocol Engine" via a selector modal at the start of Phase 1.
