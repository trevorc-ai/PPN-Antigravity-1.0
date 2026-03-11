# PPN Detailed UI/UX Audit & Refactoring Guide

## Overview
This document provides a highly detailed, component-level breakdown of the Psychedelic Practitioner Network (PPN) Portal. As a Senior UI/UX SaaS Designer, I have audited the sitemap to provide the **Why** (rationale) and **How** (implementation details aligned with PPN UI Standards) for every core page archetype and critical component. 

*Note: Due to the strict ban on em dashes, hyphens and colons are used exclusively.*

---

## 1. The Marketing "Front Door" Archetype (`/landing`, `/for-clinicians`)

**The Why (Rationale):**
Public-facing pages must establish immediate clinical trust and scientific validity. The goal is conversion (signing up practitioners) while explaining a complex value proposition. The UI must feel like a "Clinical Sci-Fi" tool - advanced, yet sterile and safe.

**The How (Implementation Details):**
*   **Typography:** Use `.ppn-page-title` for the main hero headline. Do not use generic Tailwind text sizes.
*   **Backgrounds:** The page background must be Deep Slate (`#020408` or `bg-slate-950`).
*   **Containers:** Feature highlights should use the PPN Glass effect: `bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-[2rem] p-6`.
*   **Actionable Advice:** The page must aggressively lazy-load React components (like 3D animations) to prevent performance drops on mobile devices, which hurts SEO and perceived quality.

![Marketing Landing Page Mockup](/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/internal/images/landing_page_mockup.webp)

---

## 2. The Clinical Command Center (`/dashboard`, `/search`)

**The Why (Rationale):**
Once authenticated, the practitioner's cognitive load increases dramatically. The Dashboard must act as an operational command center. It needs to surface critical alerts (e.g., patient adverse events) immediately without burying them in menus.

**The How (Implementation Details):**
*   **Layout:** A Bento Grid format is ideal. On mobile, this grid must gracefully stack into a single column.
*   **Typography:** Card titles must use `.ppn-card-title`.
*   **Color & Accessibility:** If a patient has an adverse event alert, it must not rely solely on `text-red-500` or a red border. It MUST include a warning icon `<AlertTriangle className="text-red-500 w-4 h-4" />` accompanied by descriptive text (e.g., "Safety Alert").
*   **Interactive Elements:** Global search (`/search`) should be accessible via a `Cmd+K` palette on desktop, and a fixed bottom-sheet on mobile for easy thumb reach.

![Dashboard Command Center Mockup](/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/internal/images/dashboard_mockup.webp)

---

## 3. The Clinical Workflow - Phase Forms (`/wellness-journey`)

**The Why (Rationale):**
The Arc of Care forms (Preparation, Dosing, Integration) are where practitioners spend the most time. Data entry must feel effortless and safe. Fear of data loss is the biggest UX friction point in medical SaaS.

**The How (Implementation Details):**
*   **Phase Colors:** Visuals must strictly adhere to the phase palette to provide subconscious context:
    *   Phase 1 (Preparation): Indigo (`--phase1-primary`)
    *   Phase 2 (Dosing): Amber (`--phase2-primary`)
    *   Phase 3 (Integration): Teal (`--phase3-primary`)
*   **Typography:** Form labels must use `.ppn-label`. Body text uses `.ppn-body`. `text-xs` is strictly forbidden per PPN UI Standards.
*   **Inputs:** Avoid free-text `<textarea>` inputs to ensure data remains structured for the global benchmark.
*   **Form Footer:** All Phase 1 forms must utilize the standard 3-button footer layout: 
    *   Left: "Back" (Slate)
    *   Right Middle: "Save & Exit" (Slate)
    *   Right End: "Save & Continue" (Indigo Phase color)
*   **Prevention:** Use `react-hook-form` to prevent unnecessary re-renders on keystrokes, keeping the UI snappy.

![Clinical Form Mockup](/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/internal/images/clinical_form_mockup.webp)

---

## 4. Benchmark Data Visualizations (`/analytics`, Deep Dives)

**The Why (Rationale):**
Data visualizations provide the "aha" moment for the user, showing how their clinic performs against the global network. However, raw charts are often inaccessible on mobile and impenetrable to non-analysts.

**The How (Implementation Details):**
*   **Summary First:** A `<Card>` containing a natural language summary must sit *above* every complex chart. This serves as the primary insight delivery mechanism for mobile screens where charts are hard to read.
*   **Typography:** Chart legends are the ONLY place `.ppn-caption` (11px) is permitted.
*   **Color Check:** Lines and bars must use the Phase colors if representing phase data, or high-contrast semantic colors that pass WCAG AA standards. Ensure tooltips on charts have dark backgrounds (`bg-slate-900`) and clear text.

![Data Visualization Mockup](/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/internal/images/dataviz_mockup.webp)

---

## 5. Core Atomic Components (`GravityButton`, `AdvancedTooltip`)

**The Why (Rationale):**
Consistency at the atomic level dictates the quality of the macro experience. Buttons must feel tactile, and tooltips must provide crucial medical definitions without navigating away from the form.

**The How (Implementation Details):**
*   **GravityButton:** Must have a minimum tap area of 44x44 CSS pixels. Do not rely on margin for spacing; use padding to increase the clickable area. Never use solid bright green backgrounds (`bg-emerald-500`); rely on phase color gradients and borders to maintain the dark, clinical sci-fi aesthetic.
*   **AdvancedTooltip:** Required for all `?` or `i` informational triggers. Tooltips must open toward the center of the viewport to avoid being clipped by screen edges, particularly on mobile.

![Component UI Mockup](/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/internal/images/component_mockup.webp)

---

## Strategic Refactoring Prompts for AI Agents

When deploying AI agents for refactoring, use the follow directives:

1.  **Enforce Typography Extrication:** "Audit this component. Strip out all explicit Tailwind text size classes (e.g., `text-xl`, `text-sm`) and replace them with the corresponding semantic `.ppn-*` class from `src/index.css`."
2.  **Enforce The Color-Blindness Mandate:** "Scan for standalone color indicators (like `text-red-500` or a colored border serving as a status). Inject a standard Lucide React icon alongside the text to ensure WCAG compliance."
3.  **Enforce Mobile Sheets:** "Locate all centered Modals in this file. Refactor them to utilize `vaul` (or equivalent) bottom sheets for viewports under 768px, ensuring the sheet handles touch-swipe gestures for dismissal."
4.  **Enforce Structured Inputs:** "Identify any `<textarea>` elements used for clinical data capture. Replace them with standardized `<Select>` or radio group components mapped to the global ontology."
