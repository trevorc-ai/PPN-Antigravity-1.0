---
id: WO-583
title: Phase 2 Live Session — Definitive Top-to-Bottom Layout (RECURRING FIX)
owner: LEAD → BUILDER
status: 99_COMPLETED
priority: P1
created: 2026-03-09
source: User escalation — submitted 6+ times, never correctly implemented
file: src/components/wellness-journey/DosingSessionPhase.tsx
---

## ⚠️ ESCALATION NOTICE — READ BEFORE TOUCHING ANY CODE

This work order has been submitted by the user **more than six times**. Every previous attempt returned incorrect output. The most common failure modes are documented in the Anti-Patterns section below. **Do not start building until you have read every line of this document.**

The reference image below is the **single source of truth**. There is no ambiguity. Match it exactly.

---

## Reference Image

![Phase 2 Live Session Layout Reference](./WO-583_reference.png)

---

## Problem Statement

When `isLive === true` in `DosingSessionPhase.tsx`, the page does **not** match the annotated design reference. Two classes of defects:

1. **Step cards do not collapse.** The full 3-card prep grid remains visible at full height when the session is live. It must collapse into a compact completion strip.
2. **Section render order is wrong.** The current order does not match the required top-to-bottom sequence defined below.

---

## The Definitive Render Order — `isLive === true` ONLY

The following is the **exact, sequential, top-to-bottom** order of DOM sections. No section may be moved, merged with another, or omitted. Each section has an ID so QA can `document.querySelector` each one.

```
[ 1 ] COLLAPSED STEP STRIP       id="phase2-collapsed-steps"
[ 2 ] SESSION TIMER / HUD        id="phase2-session-hud"
[ 3 ] CURRENT MEDICATIONS        id="phase2-medications"
[ 4 ] LIVE GRAPH                 id="phase2-vitals-graph"
[ 5 ] SESSION TIMELINE           id="phase2-session-timeline"
[ 6 ] ACTION CHIPS ROW           id="phase2-action-chips"
[ 7 ] LARGE ACTION BUTTONS       id="phase2-action-buttons"
[ 8 ] NOTES INPUT                id="phase2-notes-input"
[ 9 ] QUICK KEYS                 id="phase2-quick-keys"
```

---

## Section-by-Section Specification

### [1] COLLAPSED STEP STRIP — `id="phase2-collapsed-steps"`

- **Trigger:** Renders ONLY when `isLive === true`. When `isLive === false`, render the full 3-card grid as-is (no changes to pre-session cards).
- **Appearance:** A single horizontal row showing all 3 steps as compact completed pills. Each pill shows: step number + label + a `check_circle` icon (amber tint). No full card bodies, no CTA buttons, no description text.  
- **Height:** Max ~48px. This row is purely a collapsed visual indicator, not interactive (no click handlers needed).
- **Reference:** Top section of the annotated image — "When time starts, collapse the cards."

---

### [2] SESSION TIMER / HUD — `id="phase2-session-hud"`

- Currently implemented. **Do not redesign it.**
- Ensure it renders **before** the medications strip when live. (Currently it renders after the step chart block.)
- Shows: `SESSION ACTIVE` label, elapsed time (`00:00:14`), HR, BP, SpO2, LAST LOGGED.
- The sticky `top-2 z-30` class must remain.

---

### [3] CURRENT MEDICATIONS — `id="phase2-medications"`

- Currently implemented as part of the contraindication block. 
- When `isLive === true` AND there are no absolute/relative contraindications, show ONLY the compact medications strip (no "No substance selected" state needed during live session).
- Label: `CURRENT MEDICATIONS` in `ppn-meta` style (uppercase, tracking-widest).
- Right side: "No substance selected" only if substance is truly absent; otherwise omit that tag entirely during a live session.
- **Reference:** Third row in annotated image — "Medications."

---

### [4] LIVE GRAPH — `id="phase2-vitals-graph"`

- Currently implemented as `SessionVitalsTrendChart`. **Do not redesign it.**
- Must render when `isLive === true` and `config.enabledFeatures.includes('session-vitals')`.
- **Position:** Must appear AFTER the medications strip and BEFORE the session timeline.
- Title: `Session Vitals Trend`. Subtitle: `REAL-TIME PHYSIOLOGICAL MONITORING · ELAPSED TIME`.
- Legend chips (HR, BP Sys/Dia, Temp °F, Events) appear inside the graph header row.
- **Reference:** Fourth row — "Live Graph."

---

### [5] SESSION TIMELINE — `id="phase2-session-timeline"`

- Currently implemented as `LiveSessionTimeline`. **Do not redesign it.**
- **Position:** Must appear AFTER the graph and BEFORE the chip row.
- **Default state when live:** Show only the **most recent single event** (collapsed). A "show all" chevron expands to full timeline.
- Header displays: `LIVE SESSION TIMELINE` + `● SYNCING LIVE` badge on the left. `Report Log` button on the right.
- **Reference:** Fifth row — "Session Timeline (collapsible; display only the most recent event.)"

---

### [6] ACTION CHIPS ROW — `id="phase2-action-chips"`

- A single horizontal scrollable row containing two types of elements:
  1. **Tag chips** — e.g., `P. Spoke`, `Music`, `Decision` (existing chip set, no changes).
  2. **Navigation buttons** (in the same row, right-aligned): `Companion` button + `End Dosing Session` button.
- The `Companion` and `End Dosing Session` buttons **must live in this chips row**, NOT in the Session HUD header.
- **Reference:** Sixth row — "Chips INCLUDING 'Companion' & 'End Session'."

> ⛔ ANTI-PATTERN: Do NOT put Companion/End Session in the HUD. Do NOT put them in a separate row below the chips. They belong in the SAME flex row as the tag chips, right-aligned.

---

### [7] LARGE ACTION BUTTONS — `id="phase2-action-buttons"`

- A 2-column, 2-row grid of 4 large buttons.
- **Grid order (left-to-right, top-to-bottom):**

```
[ Session Update   ] [ Additional Dose ]
[ Rescue Protocol  ] [ Adverse Event   ]
```

- Colors per existing design: Session Update = emerald, Additional Dose = orange/amber, Rescue Protocol = purple/violet, Adverse Event = red/crimson.
- All buttons must be disabled when `!isLive` (existing behavior — preserve it).
- **Reference:** Seventh row — "Large Buttons."

> ⛔ ANTI-PATTERN: Do NOT render these buttons as a single column. Do NOT change button colors. Do NOT remove any of the 4 buttons.

---

### [8] NOTES INPUT — `id="phase2-notes-input"`

- A full-width plain text `<textarea>` or styled input. Placeholder: `Caption note…`
- Renders below the large buttons, above Quick Keys.
- **Reference:** Eighth row — "Notes."

---

### [9] QUICK KEYS — `id="phase2-quick-keys"`

- Existing keyboard shortcut hint strip. No changes to content.
- Renders at the very bottom, below the notes input.
- **Reference:** Bottom row — "Quick Keys."

---

## Pre-Session Render Order — `isLive === false`

**DO NOT CHANGE ANYTHING about the pre-session layout.** Only the `isLive === true` branch is being changed by this work order. The full card grid, progress header, and existing button flow for pre-session must remain 100% unchanged.

---

## Anti-Patterns — Why Previous Attempts Failed

The following mistakes have been made in every prior submission. **Each one is a QA failure condition.**

| # | Anti-Pattern | Correct Behavior |
|---|---|---|
| 1 | Cards stay at full height when session is live | Collapse to compact single-row pill strip |
| 2 | Companion + End Session placed inside the HUD header row | They go in the chips row (section 6), right-aligned |
| 3 | Contraindication block renders during live session (even if no flags) | Only the medications strip shows during live mode |
| 4 | Timeline renders above the graph | Timeline is BELOW the graph |
| 5 | Large buttons rendered as 1-column stack | Must be a 2×2 grid |
| 6 | Notes input omitted entirely | Notes input is a required section |
| 7 | Section order changed for pre-session view | Pre-session is NOT touched by this WO |

---

## Success Metrics (QA Checklist)

INSPECTOR must verify all items before marking DONE.

- [ ] `isLive === true`: `document.querySelector('#phase2-collapsed-steps')` exists and is ≤ 48px tall
- [ ] `isLive === true`: `document.querySelector('#phase2-session-hud')` is the **second** child of the outer `space-y-4` div
- [ ] `isLive === true`: `document.querySelector('#phase2-medications')` renders between HUD and the vitals graph
- [ ] `isLive === true`: `document.querySelector('#phase2-vitals-graph')` is below medications
- [ ] `isLive === true`: `document.querySelector('#phase2-session-timeline')` is below the graph and above the chip row
- [ ] `isLive === true`: Companion button and End Session button are inside `#phase2-action-chips`
- [ ] `isLive === true`: `#phase2-action-buttons` is a CSS grid with `grid-cols-2` and contains exactly 4 buttons
- [ ] `isLive === true`: `#phase2-notes-input` renders below the action buttons
- [ ] `isLive === true`: `#phase2-quick-keys` is the last rendered child
- [ ] `isLive === false`: Visual diff confirms zero changes to pre-session layout

---

## File Scope

**Only one file is in scope:**

- `src/components/wellness-journey/DosingSessionPhase.tsx`

No other files may be modified by this work order.

---
## INSPECTOR QA Sign-off
**Date:** 2026-03-11
**Verdict:** APPROVED. Code fixes verified on main branch.
