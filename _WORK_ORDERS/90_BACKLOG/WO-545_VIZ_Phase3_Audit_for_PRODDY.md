==== VIZ ====
---
owner: PRODDY
status: 00_INBOX
authored_by: VIZ
---

# 🔍 UX/UI & VISUALIZATION STRATEGY REPORT (For PRODDY Review)

**Target:** Phase 3 Wellness Journey (Clinician Dashboard) & Patient Compass Concepts (A & B)
**Auditor:** VIZ (Lead Data Visualization Architect)
**Strategic Priority:** Mobile & Tablet Responsive UI Scaling

Hey **PRODDY**: Please review my forensic visualization audit below to help formulate our upcoming Phase 3 PRDs. I have evaluated the mockups against my 5 Master Data Viz Rules, the Cockpit Mode mandate, and heavily focused on the **mobile and tablet view experience**, which I know is a priority.

Here is my strategic evaluation and the visualization requirements we need to build for.

---

### PART 1: The Patient Compass (Concept A vs. Concept B)

We are looking at two distinct approaches for the patient-facing "Integration Compass":
*   **Concept A:** The "Text & Sliders" approach. Minimalist, segmented into accordions.
*   **Concept B:** The "Quantitative Storyteller" approach. Heavy on radar charts, waveforms, and node-link visualizations.

**VIZ Verdict: We must merge them into a "Progressive Disclosure" hybrid.**
Concept A is too passive and lacks the data storytelling required to demonstrate the clinical value of the platform. Concept B is visually stunning but has an overwhelmingly high cognitive load and violates several accessibility rules, especially on mobile.

**🔴 Critical Violations & Mobile Risks in Concept B:**
1.  **The 14px Typography Rule (Mobile Killer):** The axis labels on the Spider/Radar chart, the text under the "Brain" network diagram, and the timeline labels on the Emotonal Waveform are microscopic. They fail the 14px minimum absolute requirement. **On a mobile device footprint (375px width), these charts will be completely illegible.**
2.  **Explainable AI Mandate:** The "Your Brain During the Session" node-link diagram is too abstract. Without interactive, human-readable "Smart Tooltips" explaining what those nodes mean, it induces anxiety rather than insight. On a tablet, these tooltips must use massive touch targets, not small hover states.
3.  **Horizontal Squish on Mobile:** Waveform charts (longitudinal data) cannot just be responsive by "squishing" horizontally on mobile. The aspect ratio breaks.

**🟢 VIZ Recommendations for the Final Patient Compass:**
*   **Adopt the Spider Graph & Waveform from Concept B:** These are powerful for subjective storytelling. However, we must thicken the `strokeWidth` on the radar chart to `2px` or `2.5px` and boost the SVG font sizes to pass WCAG AAA contrast against the Deep Slate background.
*   **Mobile-First Chart Containers:** For longitudinal data (like the Emotional Terrain waveform), we must enforce a fixed aspect ratio or allow horizontal swiping/scrolling on mobile to maintain chart integrity, rather than squishing the X-axis points together.
*   **Keep the Sliders from Concept A:** The slider interaction for the "Neuroplastic Window" (Mood, Sleep, Connection, Anxiety) is highly accessible and tactile. The slider "thumb" must be a minimum of **48px by 48px** to satisfy the "drunk thumb" mobile touch-target rule.
*   **Use Progressive Disclosure:** Start with the clean layout of Concept A on a tablet/mobile screen. Embed the beautiful charts from Concept B *inside* the accordions (or reveal them gradually as the user scrolls), accompanied by clear, 9th-grade reading level text explaining the data.

---

### PART 2: Phase 3 Clinician Dashboard ("The Cockpit")

This dashboard handles the Integration Phase for the practitioner. It features post-session step tracking, longitudinal charts (Symptom Decay, Trajectory), and Daily Pulse compliance.

**🟡 Friction Points & Mobile Visualization Opportunities:**
1.  **Empty States are Wasted Space:** The "Symptom Decay Curve" and "Trajectory vs. Reference Cohort" widgets currently just show placeholder text ("Data will appear here"). 
    *   **VIZ Fix:** We must inject `<ChartSkeleton />` components here. Displaying faint, dotted ghost-lines (e.g., `stroke="rgba(255,255,255,0.05)"` with `strokeDasharray="3 3"`) gives the clinician immediate spatial intuition about what *will* be tracked.
2.  **Daily Pulse Check / Emojis:** The yellow emoji faces are visually distinct, but relying purely on facial expression for data capture can introduce ambiguity.
    *   **VIZ Fix:** Ensure these click-targets have explicit `aria-label` tags and consider rendering the exact numerical/text value (e.g., "1 - Very Poor") directly underneath the emoji at a minimum 14px font size. On mobile screens, these must wrap into a 2x3 grid rather than a horizontal line if they don't fit securely within 48px margins.

**🔴 Critical Accessibility Violations:**
1.  **Color-Only Differentiation Risk:** When the "Trajectory vs. Reference Cohort" chart is populated with live data, it is highly likely going to use two solid colored lines (e.g., Blue for Patient, Gray for Cohort).
    *   **VIZ Fix:** I will mandate that the Reference Cohort line uses a dashed stroke (`strokeDasharray="5 5"`) and the Patient line uses a solid stroke with distinct reference dots (`<ReferenceDot />`), guaranteeing readability for our color-blind Lead Designer, and making it much easier to distinguish on small, high-glare tablet screens in a clinical setting.
2.  **Low Contrast Sub-text:** The helper text under the "Post-Session Steps" checkboxes and inside the compliance cards is very dim against the dark background. 
    *   **VIZ Fix:** Elevate all secondary `text-slate-500` or `text-slate-600` typography to `text-slate-400` (`#94a3b8`) to ensure it clears the contrast ratio floor.

### Summary of My Requirements for the PRD Definition:
1. Revise the Patient Compass data strategy to merge Concept A (interaction model/sliders) with Concept B (rich visualizations hidden behind progressive disclosure).
2. Mandate mobile touch targets at 48px min height (specifically for sliders and tooltips).
3. Mandate horizontal scroll for tight longitudinal charts on mobile frames (no squishing).
4. Scale up all SVG `<text>` elements on Radar Charts to `14px`.
5. Require explicit dashed/solid contrast in Clinician-side multiline charts.

**PRODDY:** Please use these rules to construct your execution PRDs. Let me know if you need clarification on my chart architectures.

==== VIZ ====
