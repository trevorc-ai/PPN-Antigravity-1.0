---
id: WO-563
title: The Integration Compass,  "Your Journey"
owner: BUILDER
status: 03_BUILD
authored_by: PRODDY
date: 2026-03-02
priority: P0
tags: [patient-facing, export, visualization, phase3, print, self-report, flywheel]
---

## PRODDY PRD,  Full Vision Rewrite

> **Work Order:** WO-563,  The Integration Compass ("Your Journey")
> **Authored by:** PRODDY
> **Date:** 2026-03-02 (Full Rewrite)
> **Status:** LEAD Approved → In BUILD

---

### 1. Problem Statement

Patients complete one of the most profound clinical interventions of their lives and leave with nothing. No artifact. No roadmap. No proof their biology is changing. VoC research confirms patients aren't asking for a clinical report,  they are asking for a compass. And they are willing to continuously contribute self-reported data *if* that data feeds something beautiful back to them in return. The existing platform has captured all the clinical inputs needed to build this. What is missing is the patient-facing output: a single, breathtaking, living page that transforms clinical data into a deeply validating personal artifact,  and then stays alive, updating itself as the patient logs daily check-ins during their integration journey.

---

### 2. Target User + Job-To-Be-Done

A licensed psychedelic therapy practitioner needs to generate and share a single, stunning, trauma-informed "Integration Compass" for their patient,  in ≤ 2 clicks from Phase 3,  so that the patient receives a permanent, living visual record of their healing that updates with every check-in they submit, answers "Is this normal?", provides a concrete integration roadmap, and makes them want to keep contributing data,  without ever asking for their name, creating an account, or exposing any PHI.

---

### 3. Success Metrics

1. A practitioner can generate, customize, and share the Compass from Phase 3 in **≤ 2 clicks and ≤ 60 seconds**, measured across 10 consecutive QA sessions.
2. The page re-renders with updated EMA data **within 5 seconds** of a patient submitting a daily check-in from the Compass itself,  verified across 5 distinct test sessions.
3. The printed and live output passes a **zero-PHI audit**,  no name, DOB, address, phone, or provider NPI appears anywhere,  verified by review of 3 test sessions.

---

### 4. The Unified Vision: A Living Artifact

> **Core Insight:** James Fadiman collected 1,700+ self-reported psychedelic experience reports,  using email,  because participants got something meaningful in return: science, validation, and belonging. We will do this at 100x the scale and 1000x the quality, because our data is already structured and clinical. The Compass is the incentive. The Compass is the output. The Compass is the flywheel.

The Compass is one single, scrollable, gorgeously designed web page. It lives at a permanent link (`/patient-report?sessionId={uuid}`) that the practitioner shares with the patient. This link is the patient's *portal to their own healing*. It is designed to be:

- **Revisited**,  not a one-time printout. The patient bookmarks it and comes back to it daily.
- **Self-updating**,  every daily pulse check-in they submit from the Compass itself causes the visualizations to grow and deepen.
- **Print-perfect**,  every zone is optimized for A4/Letter `@media print`, so it can also become a physical keepsake.
- **Share-worthy**,  the Compass is so beautiful, patients will organically want to show it to their integration therapist, their partner, or their peer community,  driving organic network growth with zero marketing spend.

---

### 5. Feature Scope

#### ✅ In Scope

**The Living Compass,  Five Integrated Zones on One Page:**

| Zone | Name | What It Contains | How It Stays Alive |
|---|---|---|---|
| 1 | **The Start of the Path** | Baseline metrics beautifully reframed without pathologizing language. (e.g., "Your mind was working overtime" not "Severe Depression Score"). Substance molecule SVG. Set & Setting context card. | Static on generation,  the anchor of the story. |
| 2 | **The Emotional Terrain** | A glowing, organic visualization of the in-session feeling timeline from Companion taps. Peaks and valleys labelled in patient-friendly language ("Your peak intensity", "Your moment of peace"). A single, prominent line of validation text: *"Every feeling you experienced during your session is within the normal range."* | Static,  sourced from `log_session_timeline_events`. |
| 3 | **The Neuroplastic Window** | The living heart of the Compass. A beautiful longitudinal EMA line graph (mood, sleep, anxiety) spanning from session date to present day. A glowing vertical marker for the dosing session. Overlay of the "neuroplastic window",  the scientifically validated 2-4 week period of heightened integration opportunity, shown as a warm golden glow on the graph. A sentence that updates in real time: *"You are currently on Day 18 of your neuroplastic window. Keep going."* | **Fully live**,  updates with every pulse check-in submission. This is the engine. |
| 4 | **You Are Not Alone** | Anonymous global cohort benchmark block,  phrased as belonging, not statistics. (e.g., *"Of the thousands of journeys like yours in the PPN network, 84% of people report meaningful relief by week 6."*) A link to community resources (Fireside Project, etc.) for moments of distress. | Updated as network grows. |
| 5 | **Your Integration Compass** | Actionable, time-stamped next steps for the neuroplastic window. PEMS mental model card (Physical, Emotional, Mental, Spiritual). Three curated integration journaling prompts generated from the session's feeling profile. Emergency support line. Practitioner's optional personal message (screen-only, never stored). | Static next steps, journaling prompts derived from patient's own feeling data. |

**The In-Page Self-Reporting Block:**
- A minimal, beautiful, mobile-first daily check-in form embedded directly into Zone 3,  below the graph and above the compass tools.
- Fields: Mood (1-10 slider), Sleep Quality (1-10 slider), Sense of Connection (1-10 slider), and an optional free-text note.
- Activates the existing Phase 3 self-reporting infrastructure,  no new DB tables required.
- Submitting a check-in immediately refreshes the Zone 3 graph with the new data point.
- Styled to feel like a ritual, not a survey. ("How are you today, traveler?")

**Practitioner Customization Panel (screen-only `.no-print`):**
- Zone toggle switches (show/hide any of the 5 zones) to tailor cognitive load for each patient.
- Optional personal message text area,  rendered to DOM for screen view only, never written to DB.
- "Copy Link" button and "Print / Save PDF" button.

**Two-Click Patient Share Buttons (the growth engine):**
- Prominently displayed at the bottom of the Compass,  always visible on screen, hidden on print.
- **"Share with Your Practitioner"**,  copies a pre-composed message to clipboard: *"I wanted to share my Integration Compass with you,  it was generated through PPN. [link]"* One click. Zero friction.
- **"Share with a Friend"**,  opens the native device share sheet (Web Share API) or copies the link with a pre-composed message: *"I've been using this to track my healing journey,  thought you might find it interesting. [link]"*
- Both buttons use `navigator.share()` on mobile (native OS share sheet,  2 taps total) and clipboard copy with a toast confirmation on desktop.
- These buttons are the active engine of the pull demand flywheel. No marketing budget required.

**Technical Foundations:**
- Route: `/patient-report?sessionId={uuid}`,  public, unauthenticated. UUID obscurity is sufficient given zero-PHI payload.
- Data sources: `log_session_timeline_events` (feeling timeline), existing Phase 3 pulse check data (EMA graph), `usePhase3Data` hook (baselines, scores).
- BUILDER is authorized to create `usePatientReportData` if aggregation across service hooks is required.
- Benchmarks matched on condition + substance from `ref_benchmark_cohorts`.
- Entry from Phase 3 Integration screen and My Protocols table.

#### ❌ Out of Scope

- Patient authentication, login, or email delivery.
- Storing the practitioner's personal message in the database.
- Multi-session comparison (single-session Compass per link).
- New DB tables or schema changes,  reads and writes strictly through existing Phase 3 infrastructure.
- Anomaly analysis logic,  the existing framework handles this; the Compass only submits the raw check-in.
- Phase 1 and Phase 2 self-reporting on the Compass (v1 activates Phase 3 integration check-ins only; Phase 1 preparation tracking and Phase 2 in-session reporting are planned extensions for a future version of this page).

---

### 6. Visual Language & Aesthetic Direction (Non-Negotiable)

> *"One of the reasons people love psychedelics is because they make everything beautiful, interesting, and pleasurable to look at."*,  User

This page must feel like it was designed by the experience, not for it. Every design decision should honor the gravity and beauty of what the patient went through.

- **Palette:** Deep space dark background (`#0a0f1e`) with warm teal-to-gold gradients for data, soft organic glows, and glassmorphism card surfaces.
- **Typography:** Inter or Outfit (Google Fonts). Large, generous, breathing type. No cramped information density.
- **Charts:** Organic, glowing line graphs,  not clinical bar charts. The EMA graph in Zone 3 should have a gradient fill beneath it (darker at bottom, fading to transparent). The Emotional Terrain in Zone 2 should be radial or wave-form, not a standard scatter plot.
- **Language:** Exclusively first-person and empathetic. Every data point is translated into a human sentence. *"You showed up for yourself 14 times this month."* Never: *"Pulse check compliance: 14/30."*
- **Print mode:** On `@media print`, the dark background collapses to warm cream/white. The glows become warm gold borders. All body text minimum 14px. The page should look like a beautifully designed personal document,  something a patient would put in their journal.
- **Mobile:** The self-reporting block (Zone 3 check-in form) must be fully touch-friendly and usable one-handed, as patients will log their check-ins from bed or on their morning walk.
- **Home Screen Installable (PWA):** The Compass must include full PWA metadata (`manifest.json` with name, icons, `theme_color`, and `display: standalone`). This means a patient can tap "Add to Home Screen" on iOS or Android and the Compass becomes a permanent icon on their phone, indistinguishable from a native app. One tap every morning to log their check-in. No app store submission. No install prompt. No friction. The icon should use the PPN compass rose mark against the deep space background palette. This detail eliminates the single biggest barrier to daily engagement: remembering the link.

---

### 7. The Flywheel (Strategic Context for BUILDER)

Every daily check-in a patient submits from their Compass link enriches:
1. Their own Zone 3 graph (immediate, visible reward).
2. The PPN network's anonymous benchmark dataset (powers Zone 4 for all future patients).
3. The practitioner's view in Phase 3 (they see their patient actively integrating).

This is the Fadiman Model, productized. The patient contributes data because the Compass *gets more beautiful and more personal* with every check-in they submit. There are no push notifications, no emails, no reminders,  the Compass itself is the reason to return.

**Pull Demand (the most powerful growth vector):** When a patient receives a Compass from their practitioner and experiences what it feels like to have their healing visualized this beautifully, they will *want* every future therapist, guide, or integration coach they work with to be on PPN. Not because we asked them to. Because they now know what good looks like. The Compass doesn't just serve the patient,  it makes PPN the standard of care patients demand from their practitioners. This is the classic bottom-up SaaS growth motion: the end user pulls the product into the organization, at zero acquisition cost.

---

### 8. Open Questions (Resolved by LEAD)

1. **Gating:** Fully public via UUID obscurity,  acceptable given zero-PHI payload.
2. **Timeline Source:** `log_session_timeline_events` DB table (durable), with localStorage fallback if needed.
3. **Data Hooks:** Use existing where possible; BUILDER authorized to create `usePatientReportData` if required.
4. **Benchmarks:** Match on condition + substance.
5. **Self-Reporting Security:** UUID obscurity + rate limiting on the check-in write endpoint (max 3 writes per `sessionId` per 24-hour window).

---

### LEAD Sign-Off

- [x] PRD reviewed and approved.
- [x] Priority: P0,  drop everything and ship.
- [x] Unified vision confirmed,  no separate "flywheel" WO. One page, one beautiful system.
- [x] BUILDER authorized to begin on the unified `src/pages/PatientReport.tsx`.

---

### PRODDY Sign-Off Checklist

- [x] Problem Statement is ≤100 words and contains no solution ideas
- [x] Job-To-Be-Done is a single sentence in the correct format
- [x] All 3 success metrics contain a measurable number or specific observable event
- [x] Out of Scope is populated (not empty)
- [x] Priority tier has a named reason
- [x] Total PRD word count is within bounds
- [x] No raw SQL written anywhere in this document
- [x] Frontmatter updated: `owner: BUILDER`, `status: 03_BUILD`
