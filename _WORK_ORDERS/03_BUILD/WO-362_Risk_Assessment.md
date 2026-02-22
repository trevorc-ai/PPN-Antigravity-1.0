---
title: "Risk Assessment & Synthesis: WO-362 Button Categorization"
status: 03_BUILD
owner: LEAD
date: "2026-02-22"
---

# 📊 360° Risk Assessment & Workflow Synthesis (WO-362)

## 1. ANALYST: Workflow & Customer Journey Perspective
**Overall Assessment:** The proposed color-coded progression (Blue -> Fuchsia -> Emerald) is highly effective for reducing cognitive load. By explicitly separating 'Inputs' (data gathering actions) from 'Outputs' (reports, dashboards), the clinician's eyes are naturally drawn only to the actions required to advance the patient's state.
**Identified Risks:**
- Cognitive dissonance if warning/alert buttons (which are usually amber/red) clash with the Phase 2 'Fuchsia' theme.
- A sudden layout reshuffle could disorient existing users if the muscle memory for critical actions (like "Export Report") is broken.
**Recommendations:** 
- Maintain a strict "Slate/Neutral" standard for all Export/Output actions across all phases to build deep muscle memory. 
- Ensure 'Locked' future phases have a distinct disabled state (e.g., desaturated slate) so they don't compete for attention with the active phase.

---

## 2. BUILDER: Front-End & Code Architecture Perspective
**Overall Assessment:** Visually grouping and coloring buttons is structurally straightforward using our Tailwind stack. However, the sheer volume of buttons spread across `PreparationPhase.tsx`, `DosingSessionPhase.tsx`, and `IntegrationPhase.tsx` presents a maintenance challenge.
**Identified Risks:**
- **Inconsistent Implementation:** Hardcoding `bg-blue-500 hover:bg-blue-600` on 15 separate buttons across 4 files guarantees that they will eventually drift out of sync visually.
- **Component Bloat:** Reordering the layout might require significant DOM refactoring in the `SlideOutPanel` and phase containers.
**Recommendations:**
- **Standardization before Execution:** Before we change a single button, we must create a centralized `<PhaseActionButton>` component. This component will take props like `phase={1|2|3}`, `role="input" | "output"`, and `status="active" | "locked"`, and handle all complex Tailwind hover/focus/color logic internally.
- This protects the codebase from "Tailwind spaghetti" and makes future global design tweaks trivial.

---

## 3. INSPECTOR / SOOP: Database & Data Integrity Perspective
**Overall Assessment:** UI restyling and grouping poses zero direct threat to the Supabase database schema (`log_clinical_records`, `log_baseline_assessments`, etc.). 
**Identified Risks:**
- **Temporal State Breakage:** If the frontend layout is reorganized such that a Phase 2 action (like logging a live timeline event) becomes accessible before the Phase 1 Session Initialization is complete, it will result in `foreign_key_violation` errors (e.g., trying to log a timeline event to a `session_id` that doesn't exist yet).
**Recommendations:**
- The visual reshuffle must **strictly respect the existing React state gates**. The `<DosingSessionPhase>` must remain tightly coupled to the `journey.session` active state. We are changing *where* and *how* buttons look, not *when* they are rendered in the DOM.

---

## 📈 LEAD SYNTHESIS & RISK SCORE

**Overall Risk Score:** 🟢 **LOW RISK (2.5 / 10)**

**Summary Reading:** 
Your intuition to pause and assess before a major UI refactor is excellent, but from an engineering perspective, **this is a safe operation**. Because we are strictly modifying the presentation layer (CSS, React component structure) and not the underlying data mutations or API calls, our data integrity is secure.

However, the risk of creating a *messy* codebase is high if we don't do this methodically. 

**The Streamlined Execution Plan (To prevent breaking things):**
1. **Abstract First:** BUILDER will create a master `<WorkflowActionCard>` and `<WorkflowOutputCard>` component in a shared UI file.
2. **Implement Phase-by-Phase:** We will inject these new components into Phase 1, test it, then Phase 2, test it, etc. We will not gut the entire app at once.
3. **Preserve Logic Gates:** We will wrap the new UI layouts in the exact same `if (!allGatesPassed)` lockouts that currently exist, ensuring no database operations fire out of order.

We are ready to proceed with building the abstracted components. No core architecture changes are required.
