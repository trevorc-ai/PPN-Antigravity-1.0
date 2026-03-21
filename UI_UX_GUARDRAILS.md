# PPN Portal — UI/UX Guardrails for Stabilization
**Version:** 1.0 — 2026-03-21  
**Source:** ChatGPT decision memo (full analysis), reconciled by INSPECTOR against live codebase  
**Status:** Active — Reference this document before writing any UI-touching work order  
**Related:** `STABILIZATION_BRIEF.md` (Section 7, Rule 11), `STABILIZATION_BRIEF.md` (Section 11)

---

## North Star

**State clarity under pressure.**

At any point in the workflow, the practitioner should be able to answer five questions immediately — without scrolling, without inferring, without remembering:

1. Which patient am I working on?
2. Which dose cycle am I in?
3. Which phase is currently active?
4. What happened last?
5. What is the next safe action?

If the interface cannot answer all five in under two seconds, it is not safe enough for this product.

---

## The Highest-Value UI Additions (Brutal Priority Order)

Do these first. Do not do anything else until the critical items are done.

| Priority | Change | Why Critical |
|---|---|---|
| 1 | **Persistent patient + cycle context bar** | Primary defense against wrong-patient actions. Currently absent across all pages. |
| 2 | **Explicit phase badge + one-sentence definition** | Practitioners must never guess the phase from the page title or active form. |
| 3 | **Clear separation: "Resume Active Cycle" vs "Begin New Treatment Cycle"** | The current app can resume the wrong session silently. This is Bug A3. |
| 4 | **Safe transition controls with consequence text** | Phase changes are controlled clinical events, not generic button clicks. |
| 5 | **Patient-context navigation between Protocol Detail, Wellness Journey, Analytics** | Currently siloed. Carry `?patientUuid=` explicitly. |
| 6 | **Historical vs. active-cycle visual distinction** | Prior sessions must feel obviously read-only. |
| 7 | **Honest empty, overdue, and not-yet-due states** | Blank panels look like bugs. Silence implies completion. |

---

## Locked UI Principles

### 1. Context Must Always Be Visible
Every patient-specific workflow screen must show a **persistent clinical context header** above the working content — visible without scrolling.

Required minimum:
- Patient display name or de-identified label
- Dose cycle number
- Active phase (with text label, not just color)
- Current session date or session state
- Active warnings: unresolved safety issue, integration open, next cycle pending

### 2. Never Rely on Page Location to Imply Phase
A practitioner must never have to guess the phase based on which page they are on. Display the active phase as a labeled status element.

Required pattern:

| Phase | Label | One-Sentence Definition |
|---|---|---|
| Preparation | `Preparation` | Forward-looking — readiness for the next dose |
| Dosing | `Dosing` | Acute medicine session in progress |
| Integration | `Integration` | Backward-looking — processing the most recent completed dose |

### 3. Do Not Use Color Alone for State
- Every phase indicator must include text
- Every warning state must include text AND iconography/shape
- Disabled, active, complete, overdue, and warning states must remain distinguishable in grayscale

### 4. Transition Actions Are Controlled Clinical Actions, Not Ordinary Buttons
The following are **controlled transitions** — not generic saves:

| Action | Consequential? |
|---|---|
| Open Preparation | ✅ Starts a new dose cycle |
| Start Dosing | ✅ Ends Preparation; begins acute session |
| End Dosing / Discharge | ✅ Opens Integration |
| Close Integration | ✅ Formally ends follow-up for this dose |
| Begin Next Treatment Cycle | ✅ Opens Preparation for a new cycle |

Each transition control must include:
1. A precise action label (see copy standards below)
2. One sentence explaining what will change
3. Patient and cycle context visible nearby
4. A lightweight attestation if it changes phase state
5. A clear success confirmation after completion

### 5. Current-Cycle Actions and Historical Review Must Feel Different
- Prior cycles default to **read-only** mode
- Prior-cycle screens must be visibly labeled "Viewing prior dose cycle"
- Active cycle screens must surface next-step actions prominently
- Corrections to prior cycles must be deliberate and visibly separate from normal workflow

### 6. "Resume Active Cycle" and "Begin New Treatment Cycle" Must Never Look Interchangeable

Required copy pattern:
```
Resume Active Cycle      ← continuing the current open cycle
Begin New Treatment Cycle ← opening Preparation for a new cycle
View Prior Sessions      ← read-only historical access
```

These must not be collapsed into a generic "Continue" or "Start session."

### 7. Navigation Must Carry Patient Context Deliberately
Any route moving between Protocol Detail, Wellness Journey, and Analytics must preserve active patient context via `?patientUuid=`.

Required contextual actions (inside page context, not only sidebar):
- Open in Wellness Journey
- View Protocol
- View Patient Analytics
- Return to Active Cycle

### 8. Workflow UI and Reporting UI Must Not Use the Same Language for Different Truths

Forbidden ambiguity:
- ❌ "Integration incomplete" — when you mean "month-1 follow-up overdue"
- ❌ "Inactive" — when you mean "between cycles"
- ❌ "Complete" — when you only mean "required form submitted"

### 9. Empty States Must Explain the Absence of Data

Required patterns:
- "No integration sessions recorded yet for this dose."
- "No follow-up assessments are due yet."
- "No next cycle has been opened for this patient."
- "No vitals have been loaded for this session yet."
- "This chart will populate after a new treatment cycle is created."

Blank charts and empty panels make users assume the app is broken.

### 10. Missing, Unknown, Overdue, and Complete Are Separate States

UI components must distinguish at minimum:
- `not_started`
- `in_progress`
- `completed`
- `overdue`
- `not_yet_due`
- `intentionally_closed`
- `unresolved`
- `insufficient_data`

### 11. Mixed-Purpose Encounters Need Explicit Structure
When an encounter includes both integration (prior dose) and prep (next dose):
1. Ask for **primary purpose** (required)
2. Allow optional secondary purpose
3. Never let a hybrid encounter silently redefine the cycle boundary

### 12. The Interface Should Recommend the Next Safe Action

| Current State | Highlight |
|---|---|
| Preparation active | "Start Dosing" (only if readiness requirements met) |
| Dosing active | "End Dosing / Discharge" |
| Integration open | "Close Integration" or "Begin Next Cycle" |
| No active cycle | "Begin New Treatment Cycle" |

### 13. Pre-Action Warnings Are Surfaced Before the Action, Not After
Before a major transition, surface unresolved blockers:
- Contraindication review incomplete
- Consent missing
- Unresolved safety event
- Missing discharge action
- Next cycle being opened while integration is still open

One clean pre-action summary near the transition control. Not a wall of popups.

### 14. Audit-Sensitive Actions Leave Visible Traces
If integration is closed, a cycle is opened, or a prior record is corrected:
- "Integration closed by [role] on [date/time]"
- "Next cycle opened on [date/time]"
- "This record contains a correction"

### 15. Layout Freeze — No Redesign During Stabilization

**Allowed during stabilization:**
- Add persistent context header
- Improve action labels
- Add consequence text to phase transitions
- Add contextual links between pages
- Improve empty states
- Separate historical from active views
- Clarify status labeling

**Not allowed without a separate approved plan:**
- Major layout refactor
- Broad Tailwind restyling
- Spacing or overflow experiments across multiple screens
- New navigation framework
- Large component redesign

---

## Recommended UI Copy Standards

Use direct, literal labels. Avoid vague labels.

| ✅ Preferred | ❌ Avoid |
|---|---|
| Begin New Treatment Cycle | Continue |
| Resume Active Cycle | Next |
| View Prior Sessions | Complete |
| Start Dosing | Done |
| End Dosing and Discharge | Submit |
| Close Integration | Finish session |
| View Patient Analytics | — |
| Return to Active Cycle | — |

---

## Page-Level Requirements

### Protocol Detail
**Must show:**
- Patient context
- Current cycle and phase
- Entry points to Wellness Journey and Analytics with patient context preserved
- Prior cycle summary access if relevant

**Must not:**
- Show patient-level info without specifying current vs. prior cycle
- Link to another patient-specific screen without carrying patient context

### Wellness Journey
**Must show:**
- Persistent patient and cycle context
- Active phase
- Last completed action
- Next recommended action
- Whether practitioner is in active or historical mode

**Must not:**
- Auto-resume the most recent session without explicit validation
- Blur active-cycle controls with prior-cycle review

### Analytics
**Must show:**
- Whether analytics are filtered to patient, session, cycle, protocol, or site
- Whether view is current-cycle, historical-cycle, or network benchmark
- Whether missing data means not-yet-due, not-captured, or not-applicable

**Must not:**
- Imply that a reporting gap is a clinical failure
- Label reporting windows as phase status

### Sidebar and Top Navigation
**Must:**
- Preserve patient context when moving between patient-specific areas
- Show when user is in patient-specific mode vs. general mode
- Offer a visible route back to current patient workflow

**Must not:**
- Drop patient context silently
- Force unnecessary patient re-selection on every navigation move

---

## Acceptance Criteria for Any UI Plan

A UI implementation plan must not be approved unless it answers YES to all of these:

1. Does the screen make patient identity obvious?
2. Does it make current dose cycle obvious?
3. Does it make current phase obvious?
4. Does it separate active workflow from historical review?
5. Does it preserve patient context across navigation?
6. Does it avoid using color alone for state?
7. Does it avoid redefining clinical state based on reporting logic?
8. Does it keep layout risk low and localized?
9. Does it match the locked phase definitions in `STABILIZATION_BRIEF.md` Section 3?
10. Does it reduce the chance of acting on the wrong record?

---

*This document was last updated: 2026-03-21T07:31:14-07:00*  
*Reference: ChatGPT UI/UX Guardrails decision memo, March 2026*
