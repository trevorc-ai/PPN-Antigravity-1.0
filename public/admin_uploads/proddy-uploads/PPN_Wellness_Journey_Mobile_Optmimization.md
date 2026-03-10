PPN Wellness Journey Mobile Optmimization

To elevate this from a static layout fix to a truly seamless, kinetic experience, we need to add the **Frictionless UI Pillars** to the workflow.  
A layout that simply fits on a phone screen is "responsive." A layout that feels effortless, intuitive, and premium is "seamless." To achieve that Apple-level polish in 2026, the AI must evaluate the component for motion, perceived speed, and error prevention.

Here are the three elements we must inject into the workflow's brain to get that result:

## **1\. Kinetic Architecture (Motion over Snapping)**

In a seamless app, nothing instantly "snaps" or disappears; elements glide, fade, or expand. If a user opens a clinical protocol, the transition must guide their eye. We will force the agent to inject Tailwind transition utilities (transition-all duration-300 ease-in-out) or Framer Motion suggestions for every state change.

## **2\. Perceived Performance (Skeleton States)**

Mobile users perceive wait times differently than desktop users. A spinning circle on a blank white screen feels broken. A "Skeleton UI" (a pulsing gray outline of the data) makes the app feel lightning-fast because the layout loads instantly before the data arrives.

## **3\. Gesture & Empty State Empathy**

Clinicians using your app on the go will make mistakes. The UI must be forgiving. This means suggesting swipe-to-dismiss for bottom sheets and designing elegant "Empty States" (e.g., "No patients logged today" with an illustration) instead of just showing a blank grid.

---

Here is the **Ultimate 2026 Mobile UX Optimizer**. Replace your current file with this upgraded version.

## **📱 The Seamless Mobile Optimizer (v2.0)**

**File Name:** optimize-mobile.md

**Location:** .agent/workflows/optimize-mobile.md

Markdown

```
# WORKFLOW: 2026 Seamless Mobile UX Optimizer
**Description:** Upgrades components to frictionless, modern mobile standards (Thumb-Zone, Spatial UI, Kinetic Transitions, and Perceived Performance).
**Trigger:** `/optimize-mobile`

## EXECUTION STEPS:
You are the Lead Mobile UX Architect for PPN. Your job is to transform desktop-first code into a frictionless, premium mobile experience. DO NOT rewrite the entire file; provide surgical Tailwind/React upgrades.

Evaluate and optimize the code against the **Seamless Mobile Paradigms**:

1. **The "Thumb Zone" & Bottom-Sheet Architecture:** - Flag top-screen primary actions or center-screen modals. 
   - **Fix:** Move primary actions to a sticky bottom bar (`fixed bottom-0 w-full pb-safe`). Convert modals to sliding bottom sheets (`md:inset-0 mobile:bottom-0 mobile:rounded-t-3xl`).
2. **Kinetic Transitions (The "No Snap" Rule):**
   - Flag any hover, active, or conditional rendering states that snap instantly.
   - **Fix:** Inject Tailwind smooth transitions (`transition-all duration-300 ease-in-out` or `active:scale-95` for button presses) so the UI feels fluid and tactile.
3. **Perceived Performance (Skeleton UI):**
   - Flag any heavy data components (charts, lists) that lack a loading state.
   - **Fix:** Formulate a surgical plan to add a Tailwind pulse skeleton (`animate-pulse bg-slate-800 rounded-xl`) for the loading state.
4. **Spatial Depth & Card Conversion:**
   - Flag dense HTML `<table>` elements or flat background elements.
   - **Fix:** Stack table rows into flex cards. Apply the PPN Glass Panel (`bg-slate-900/60 backdrop-blur-md`) to active foreground elements, and push inactive elements to the background (`text-slate-400`).
5. **Fat-Finger Compliance & Empty States:**
   - Verify minimum touch targets of 44x44px (`min-h-[44px]`). 
   - If rendering a list, ensure an elegant empty state exists if the array is `length === 0`.

## REQUIRED OUTPUT FORMAT:

**CRITICAL RULE:** If the user did not explicitly tag a file using the `@filename` syntax, 🛑 STOP. Output: "ERROR: Target file not specified."

<thinking>
1. [Analyze layout for Thumb-Zone and touch target violations]
2. [Identify missing kinetic transitions, loading states, or empty states]
3. [Formulate the surgical Tailwind/React injection required to make the flow seamless]
4. [Verify NO em dashes are used and the 14px accessibility rule remains intact]
</thinking>

**📱 SEAMLESS MOBILE OPTIMIZATION REPORT: `[Target File]`**
* **UX Friction Detected:** [1-2 sentences on why the current layout is static or hostile]
* **The Seamless Strategy:** [Brief explanation of how the new classes add motion, spatial depth, or perceived speed]

**✂️ HANDOFF SNIPPET FOR LEAD AGENT:**
*(User: Copy this block and give it to LEAD to generate the SURGICAL_PLAN.md)*

**Target File:** `[File Path]`
**Target Lines:** `[e.g., Lines 42-60]`
**Action:** `[Exact replacement code featuring the new responsive, kinetic, and spatial Tailwind classes. Must perfectly match surrounding architecture.]`

==== MOBILE UX ARCHITECT ====
```

---

By adding motion, skeletons, and robust state handling to the workflow's brain, the code it generates will naturally feel like a premium, top-tier application.

Would you like to run a simulated test of this upgraded workflow right now? Give me the name of a complex data component in your app (like a table or a chart view), and I will show you exactly how this new workflow will rewrite it for a seamless mobile experience.

*The "Wellness Journey", it is a 3 phase longitudinal tracking of a practitioner's (the user) psychedelic therapy treatments for a patient over time. It tracks the preparation of pre-treatment assessments, forms, and vital signs in phase (1), the dosing session and all events & interventions that happen therein (phase 2), and the post-treatment integration, analysis of responses and outcome trends and patient insights and action items (phase 3\)*

This is the absolute heartbeat of your application. If the "Wellness Journey" feels clunky, practitioners will abandon the software and go back to pen and paper.

Because this is a longitudinal tracker (spanning days or weeks) with three wildly different user contexts, we cannot just slap a generic mobile layout on it. We must design it as a **Kinetic Timeline**.

Here is exactly how to apply the 2026 Seamless Mobile Paradigms to each specific phase of the Wellness Journey, and the exact Antigravity prompt to execute it.

## **The Overarching Architecture: The Kinetic Timeline**

The user should never feel lost in the three phases.

* **The UI Strategy:** Use a vertical "stepper" or timeline.  
* **The Kinetic Element:** Completed phases (Phase 1\) collapse into summary cards. The active phase (Phase 2\) is expanded and elevated using the Glass Panel (backdrop-blur-md). Future phases (Phase 3\) are dimmed (text-slate-500) to reduce cognitive load.

---

## **Phase 1: Preparation (The Data Diet)**

* **The Context:** The clinician is gathering baseline data, filling out assessments, and logging vitals.  
* **The Mobile Friction:** Long, scrolling forms on a phone are exhausting.  
* **The 2026 Solution (Progressive Disclosure):** Do not show a 20-field form. Break assessments into swipeable "Cards." Use massive, fat-finger-friendly sliders for vitals (e.g., Blood Pressure, Heart Rate) instead of tiny text inputs.  
* **The Antigravity Prompt (For Playground):** \> *"Run /optimize-mobile on @src/components/PhaseOnePrep.tsx. Convert the long assessment form into a swipeable card interface (Progressive Disclosure). Replace any number inputs with large touch-target sliders or plus/minus toggle buttons."*

## **Phase 2: The Dosing Session (Cockpit Mode)**

* **The Context:** The clinician is in the room with the patient. The lights are likely dim. The clinician's attention must be 95% on the patient and 5% on the app.  
* **The Mobile Friction:** Searching for a tiny "Add Intervention" button breaks clinical focus.  
* **The 2026 Solution (Thumb-Zone & FABs):** This screen must be pure "Cockpit Mode." Deep Slate background. The entire bottom of the screen should be a Sticky Action Bar with massive Floating Action Buttons (FABs) for one-tap event logging (e.g., "Protocol Adjusted", "Vitals Checked").  
* **The Antigravity Prompt (For Playground):**  
  *"Run /optimize-mobile on @src/components/DosingSession.tsx. This is 'Cockpit Mode'. Move all intervention logging actions into a sticky bottom bar (fixed bottom-0). Ensure every button is a massive touch target (min 60px height) so it can be tapped without looking closely."*

## **Phase 3: Integration & Outcomes (Swipeable Insights)**

* **The Context:** The session is over. The clinician is reviewing how the patient responded compared to their baseline.  
* **The Mobile Friction:** Trying to read a dense scatter plot or complex outcome table on a 6-inch screen.  
* **The 2026 Solution (Skeleton UI & Carousel Charts):** This is where you use Vizzy's charts. Because crunching outcome trends takes a second, use a Skeleton UI pulse while it loads. Then, display the charts in a horizontal, swipeable carousel so the user only focuses on one insight at a time.  
* **The Antigravity Prompt (For Playground):**  
  *"Run /optimize-mobile on @src/components/IntegrationOutcomes.tsx. Implement a Skeleton UI loading state for the data visualizations. Then, wrap the Recharts components in a horizontal overflow container (flex overflow-x-auto snap-x) so the user can swipe through the insights one by one."*

---

## **How to Build This Without Breaking Your App**

Because this is your core feature, do not let BUILDER try to redesign all three phases at once.

**Your Next Step:** Pick the phase that currently looks or feels the worst on mobile. Is it the data entry of Phase 1, the live-logging of Phase 2, or the charts of Phase 3?

Tell me which one, and run it through the newly upgraded /optimize-mobile workflow right now to generate the exact Tailwind classes needed for LEAD.

