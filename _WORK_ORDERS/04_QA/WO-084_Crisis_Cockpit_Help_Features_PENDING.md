---
id: WO-084
title: "Enhanced Help Features — Crisis Logger & Cockpit Mode (User Manual + Mini Guided Tours)"
status: 00_INBOX
owner: PENDING
failure_count: 0
created: 2026-02-17T22:32:48-08:00
priority: high
tags: [help, user-manual, guided-tour, crisis-logger, cockpit-mode, proddy, onboarding]
---

# WO-084: Enhanced Help Features — Crisis Logger & Cockpit Mode

## USER REQUEST (VERBATIM)
"Create enhanced help features (user manual, and mini-guided tour) for 'Crisis logger' and 'Cockpit Mode'"

---

## SCOPE DEFINITION

### Primary Objective
Define the **content strategy, information architecture, and tour flow** for enhanced help features covering two specific high-stakes features:

1. **Crisis Logger** — Rapid adverse event documentation during active sessions
2. **Cockpit Mode** — Streamlined real-time session monitoring UI

For each feature, PRODDY will define:
- **User Manual Section** — Written documentation content outline
- **Mini Guided Tour** — Step-by-step interactive walkthrough spec

This is a **PRODDY strategy task**. DESIGNER and BUILDER will implement later.

---

## BACKGROUND & CONTEXT

### Why These Two Features?
Crisis Logger and Cockpit Mode are:
- **High-stakes** — Used during active dosing sessions where errors have real consequences
- **Time-sensitive** — Users need to act quickly; no time to search for help
- **Complex** — Non-obvious workflows that require specific knowledge to use correctly
- **Underserved** — Currently lack dedicated help documentation or guided onboarding

### What is Crisis Logger?
A rapid-entry tool for documenting adverse events, unexpected reactions, or safety incidents during a psychedelic therapy session. Key characteristics:
- Activated during active session monitoring
- Requires fast, accurate data entry under stress
- Documents: event type, severity, timestamp, interventions taken, outcome
- May trigger safety protocols or escalation workflows

### What is Cockpit Mode?
A streamlined, distraction-free UI mode for real-time session monitoring. Key characteristics:
- Consolidates critical session data into a single view
- Optimized for use during active dosing sessions
- May include: vitals display, timeline, dosing protocol, quick-entry fields
- Designed for practitioners who need eyes-on-patient, not eyes-on-screen

---

## REQUIREMENTS

### FEATURE 1: Crisis Logger

#### 1A. User Manual Section
Define content outline for a dedicated Crisis Logger section in the User Guide (WO-081):

- **What is Crisis Logger?** — Purpose and when to use it
- **When to Activate** — Triggers and decision criteria
- **Step-by-Step Workflow** — How to log a crisis event
- **Field Definitions** — What each data field means and how to fill it
- **Severity Levels** — How to assess and categorize severity
- **Intervention Documentation** — How to record actions taken
- **Post-Session Review** — How to access and review logged events
- **Data Privacy** — How crisis data is stored and protected
- **Troubleshooting** — Common issues and solutions

#### 1B. Mini Guided Tour — Crisis Logger
Define the interactive tour flow:

- **Entry Point** — How/when does the tour trigger? (First use? Help button? Manual launch?)
- **Tour Steps** (define each step):
  - Step title
  - Target element (what gets highlighted)
  - Tooltip content (what the user reads)
  - Action required (click, observe, etc.)
- **Tone** — Calm, clear, confidence-building (user may be stressed)
- **Length** — Recommend max steps for a crisis-context tool
- **Skip/Exit** — How users can dismiss the tour
- **Re-launch** — How users can replay the tour later

#### 1C. Special Considerations for Crisis Logger
- **Stress Context** — Help content must be readable under pressure
- **Speed** — Tour must be completable in under 2 minutes
- **Accessibility** — Large tap targets, high contrast, no color-only meaning
- **Practice Mode** — Should there be a "dry run" or simulation mode?

---

### FEATURE 2: Cockpit Mode

#### 2A. User Manual Section
Define content outline for a dedicated Cockpit Mode section in the User Guide (WO-081):

- **What is Cockpit Mode?** — Purpose and design philosophy
- **When to Use** — Recommended use cases and session types
- **Activating Cockpit Mode** — How to enter and exit
- **Interface Overview** — What's on screen and why
- **Panel Breakdown** — Each section of the Cockpit UI explained
- **Quick Entry Features** — How to log data without leaving Cockpit Mode
- **Integration with Other Features** — How Cockpit connects to Crisis Logger, Vitals, Timeline
- **Customization** — Any user-configurable options
- **Exiting Cockpit Mode** — How to return to standard view
- **Troubleshooting** — Common issues and solutions

#### 2B. Mini Guided Tour — Cockpit Mode
Define the interactive tour flow:

- **Entry Point** — How/when does the tour trigger?
- **Tour Steps** (define each step):
  - Step title
  - Target element (what gets highlighted)
  - Tooltip content (what the user reads)
  - Action required
- **Tone** — Professional, efficient, empowering
- **Length** — Recommend max steps
- **Skip/Exit** — Dismissal options
- **Re-launch** — Replay mechanism

#### 2C. Special Considerations for Cockpit Mode
- **Distraction-Free** — Help content should not interfere with session monitoring
- **Overlay Design** — Tour tooltips must not obscure critical data
- **Quick Reference** — Consider a persistent "cheat sheet" or keyboard shortcut guide
- **First-Time vs. Returning Users** — Different needs for each

---

## DELIVERABLES

### Primary: Strategy Document
Create `CRISIS_COCKPIT_HELP_STRATEGY.md` in `/docs` or append to this ticket with:

**For Each Feature (Crisis Logger & Cockpit Mode):**
1. **User Manual Outline** — Complete section-by-section content plan
2. **Mini Tour Flow** — Step-by-step tour specification
3. **Entry Point Recommendation** — When and how the tour triggers
4. **Tone & Voice Guidelines** — How to write for this context
5. **Accessibility Requirements** — Specific needs for each feature
6. **Handoff Notes for DESIGNER** — Visual and UX requirements
7. **Handoff Notes for BUILDER** — Technical implementation notes

### Supporting Deliverables
- **Content Priority Matrix** — Which help content is most critical to ship first
- **Cross-Reference Map** — How these help sections connect to WO-081 (User Guide) and WO-083 (Enhanced Privacy Tour)

---

## SUCCESS CRITERIA

- [ ] User Manual outline complete for Crisis Logger
- [ ] User Manual outline complete for Cockpit Mode
- [ ] Mini Tour flow defined for Crisis Logger (step count, content, entry point)
- [ ] Mini Tour flow defined for Cockpit Mode (step count, content, entry point)
- [ ] Tone and voice guidelines defined for each feature
- [ ] Accessibility requirements specified
- [ ] Handoff notes ready for DESIGNER and BUILDER
- [ ] Content coordinated with WO-081 (User Guide) scope

---

## ROUTING GUIDANCE FOR LEAD

**Recommended Owner:** PRODDY
**Recommended Status:** 01_TRIAGE

After PRODDY completes strategy:
- → **DESIGNER** for tour UI/UX design, tooltip styling, overlay specs
- → **BUILDER** for mini tour implementation (likely extending existing guided tour system)
- → **MARKETER** for copy review and refinement
- Coordinate with **WO-081** (User Guide) for integrated documentation

---

## DEPENDENCIES

| Ticket | Relationship |
|--------|-------------|
| WO-081 | User Guide — Crisis Logger and Cockpit Mode sections will feed into the master User Guide |
| WO-083 | Enhanced Privacy Tour — Crisis Logger and Cockpit Mode may appear in both tours |
| Existing Guided Tour | Mini tours should use the same technical framework as the existing guided tour system |

---

## NOTES
- Crisis Logger help content must be **stress-tested** — readable and actionable under pressure
- Cockpit Mode tour must be **non-intrusive** — cannot block critical session data
- Both features are part of the Enhanced Privacy / Grey Market feature set (WO-083)
- Consider whether a "Practice Mode" or sandbox environment would help users learn these tools safely
- PRODDY should review existing guided tour implementation before defining new tour flows

---

## LEAD ARCHITECTURE

**Routed:** 2026-02-17T23:10:06-08:00
**Owner:** PRODDY
**Status:** 01_TRIAGE

### Technical Strategy
PRODDY delivers content outlines and tour flow specs for both Crisis Logger and Cockpit Mode. These are high-stakes, time-sensitive features — help content must be stress-tested for readability under pressure. PRODDY must treat these as two separate deliverables within one ticket.

### Constraints
- Crisis Logger help must be completable in under 2 minutes — brevity is a hard requirement
- Cockpit Mode tour must be non-intrusive — tooltips cannot obscure session-critical data
- Both features are part of the Enhanced Privacy feature set — coordinate with WO-083
- Tour implementation will reuse the WO-085 guided tour framework — coordinate with DESIGNER output from WO-085
- Coordinate with WO-081 (User Guide) — these sections feed into the master help center

### Handoff After PRODDY
PRODDY → update `owner: LEAD` and `status: 01_TRIAGE`. LEAD will route to DESIGNER (tooltip/overlay specs) and BUILDER (implementation) after strategy is approved.
