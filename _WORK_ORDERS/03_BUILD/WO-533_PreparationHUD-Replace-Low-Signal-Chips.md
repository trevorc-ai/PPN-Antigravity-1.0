---
id: WO-533
title: "Preparation Summary HUD: Replace Low-Signal Chips with High-Value Clinical Indicators"
owner: BUILDER
status: 02_BUILD
authored_by: PRODDY
reviewed_by: LEAD
priority: P1
created: 2026-03-01
routed: 2026-03-01
---

## PRODDY PRD

> **Work Order:** WO-533 — Preparation Summary HUD: Replace Low-Signal Chips with High-Value Clinical Indicators
> **Authored by:** PRODDY
> **Date:** 2026-03-01
> **Status:** Draft → Pending LEAD review

---

### 1. Problem Statement

The Preparation Summary HUD displays six chips: Consent and Set & Setting are binary completion flags that show only "Complete" or "—" — zero clinical signal. PHQ-9 and GAD-7 show raw integers with no severity label or risk context, requiring the practitioner to perform mental scoring conversion mid-workflow. The result is a HUD that looks clinical but fails to answer the practitioner's real question before dosing begins: *"What are my patient's actual risk markers right now?"*

---

### 2. Target User + Job-To-Be-Done

A licensed facilitator needs to instantly assess a patient's key clinical risk profile from a single HUD strip so that they can proceed to dosing with confidence and without opening any individual form.

---

### 3. Success Metrics

1. In QA testing, a practitioner can correctly identify a patient's risk tier (Green/Amber/Red), depression severity, and age from the HUD without opening any form — verified in ≥5 consecutive simulated sessions
2. The Consent and Set & Setting chips are removed from the Phase1HUD component and replaced with the 4 new chips listed in scope — confirmed via code review
3. Zero regression on gate logic: the 4/4 STEPS counter and Session Readiness gate cards remain unaffected — verified by Inspector in 1 full QA pass

---

### 4. Feature Scope

#### ✅ In Scope
- Remove the **Consent** chip from `Phase1HUD` (already represented by the gate card below)
- Remove the **Set & Setting** chip from `Phase1HUD` (binary completion flag, not a clinical value)
- Replace PHQ-9 raw number chip with **PHQ-9 Severity chip** — display severity label (e.g., "Moderate Depression") in the appropriate color from `getSeverityInfo()`, retaining amber color class
- Replace GAD-7 raw number chip with **GAD-7 Severity chip** — same treatment as PHQ-9
- Add **Risk Level chip** — reads from `contraindicationResult.overallRisk` when available; renders in locked/dim state when gates are not yet complete (LEAD to decide: dim vs. hidden — see Open Questions)
- Add **Patient Age chip** — reads from `journey.demographics?.age`
- SUBSTANCE and DOSAGE chips remain unchanged

#### ❌ Out of Scope
- Any changes to gate logic, gate completion counts, or the "4/4 STEPS" progress pill
- Any changes to the Session Readiness card or WorkflowActionCard components
- Any changes to the Baseline Clinical Profile panel (ACE Score, Expectancy cards)
- Any changes to the RiskEligibilityReport or ContraindicationEngine
- Adding interactivity to any HUD chip (the strip remains read-only)

---

### 5. Priority Tier

**[x] P1** — High value, ship this sprint

**Reason:** The HUD is shown to every practitioner at every session before dosing begins. Displaying "Complete" as clinical data is a UX integrity issue undermining the platform's clinical intelligence brand. Affects every real session from Day 1.

---

### 6. Open Questions for LEAD

1. The `contraindicationResult` is only computed after all 4 gates are complete — should the Risk Level chip render in a locked/dim state before that, or be hidden entirely until gates pass?
2. Should the severity label text for PHQ-9/GAD-7 chips truncate with `truncate` class and rely on tooltip, or should chips be allowed to wrap on mobile?
3. Patient age is pulled from `journey.demographics?.age` — LEAD should confirm this path is reliably populated before Phase 1 is reached, or provide the correct fallback path.

---

### 7. Design Intent — Builder Visual Brief

> PRODDY specifies visual intent here, not code. Builder owns implementation decisions within these constraints.

#### The Problem with the Current Layout (Photo Evidence)
The live screenshot confirms: the HUD is a flat row of 6 equally-weighted chips, 5 of which show a bare dash (`—`). It reads as a half-broken progress tracker glued between the gate cards and the compliance section. It communicates nothing clinical at a glance.

#### Layout: Replace Flat Row with Two Named Groups

Split the 4 chips into two labeled groups, separated by a subtle vertical rule (`border-r border-slate-700/40`):

**Group A — "PROTOCOL"** (left, ~40% width): SUBSTANCE · DOSAGE
- These are safety-critical and the practitioner's most urgent reference
- Give value text one size step larger than Group B chips
- Chips should be wide enough to never truncate a substance name

**Group B — "PATIENT PROFILE"** (right, ~60% width): PHQ-9 SEVERITY · GAD-7 SEVERITY · RISK LEVEL · PATIENT AGE
- Clinical screening readback, same chip shell as Group A
- Chips are narrower and more compact — these are scan-read values, not primary anchors

Add a `ppn-meta uppercase tracking-widest text-slate-600` group label above each group (e.g., `PROTOCOL` and `PATIENT PROFILE`). These labels orient the practitioner before they read the chip values.

#### Chip Anatomy: Three Layers of Signal

Every chip must communicate three things at once — not just a label and value:

1. **Icon** — must match the data type. Do not reuse the same icon for unrelated chips. SUBSTANCE → syringe. DOSAGE → scale or weight icon. PHQ-9 → brain. GAD-7 → heart-pulse. RISK LEVEL → shield. PATIENT AGE → user/person icon.
2. **Meta label** (`ppn-meta uppercase`) — chip identity, always visible
3. **Value** — the largest, most legible text in the chip. This is the one thing the practitioner's eye should land on first.

#### Color as Clinical Signal (Not Decoration)

- PHQ-9 / GAD-7 severity label: inherit the **exact color** from `getSeverityInfo()` — emerald for minimal, yellow for mild, amber for moderate, orange for moderately severe, red for severe. The color IS the diagnosis at a glance.
- Risk Level chip: the **only** chip where a background tint change is appropriate. Green tint (`indigo-700/20` → `emerald-900/30`) for CLEAR, amber tint for flagged, red tint for contraindicated. Locked state: dim slate background, shield icon with lock overlay or muted color.
- SUBSTANCE and DOSAGE: `text-indigo-200` as today — no change.
- PATIENT AGE: `text-slate-300` — neutral, demographic, not a clinical alert.

#### Empty State: Pending, Not Broken

When a chip value is null/undefined, do NOT render a bare `—`. Render:
- Icon: dimmed (`text-slate-600`)
- Label: dimmed (`text-slate-600`)
- Value line: `ppn-meta text-slate-600` — text: `Not recorded`

This communicates "field is known and pending entry" not "something is missing or errored."

#### Read-Only Contract

The strip has zero interactivity. No `cursor-pointer`, no hover state that implies clicking. Chips are display surfaces only.

#### Strip Container

`p-5` (not the current cramped `p-4`), `rounded-2xl`, `border border-indigo-700/30`, `bg-indigo-950/15`. The section heading "PREPARATION SUMMARY" stays. The "4/4 STEPS" pill moves to the right of the group label row, not the header — it is a progress indicator, not the strip's primary identity.

---

### 8. LEAD Architecture Brief — Open Questions Resolved

> All decisions below are verified against the live codebase before routing to Builder.

---

#### OQ #1 — Risk Level chip before gates are complete
**LEAD Decision: Render the chip in a dim/locked state, do NOT hide it.**

**Rationale:** Hiding the chip makes the HUD width and layout shift when the last gate completes — a jarring layout pop. The chip slot must always be visible. When `contraindicationResult` is `null` (i.e., pre-gates), Builder should render the Risk Level chip as:
- Icon: `Shield` with `text-slate-600`
- Label: `RISK LEVEL` dimmed
- Value: `ppn-meta text-slate-500` — text: `Pending gates`
- Background: `bg-slate-800/20 border-slate-700/30` (no colored tint until result is available)

Once `contraindicationResult` is available, the chip switches to colored tint based on `verdict`:
- `CLEAR` → `bg-emerald-900/20 border-emerald-700/30`, value: `Clear` in `text-emerald-400`
- `PROCEED_WITH_CAUTION` → `bg-amber-900/20 border-amber-700/30`, value: `Caution` in `text-amber-400`
- `DO_NOT_PROCEED` → `bg-red-900/20 border-red-700/30`, value: `Do Not Proceed` in `text-red-400`

The field is `verdict` on `ContraindicationResult` — confirmed in `contraindicationEngine.ts` line 31.

---

#### OQ #2 — PHQ-9 / GAD-7 severity label truncation
**LEAD Decision: Truncate with `truncate` class. Do NOT wrap.**

**Rationale:** The longest label is "Moderately Severe Depression" (28 chars). Wrapping would make chips inconsistent heights, breaking the row's visual rhythm. Truncation is the right call. However, Builder must pair this with an `AdvancedTooltip` on the chip showing the full label + raw score (e.g., "Moderately Severe Depression (PHQ-9: 17)"). The tooltip component is already imported in `PreparationPhase.tsx` — no new dependencies.

---

#### OQ #3 — `journey.demographics?.age` reliability
**LEAD Decision: Use `journey.demographics?.age` as specified. It is reliably populated.**

**Rationale:** Age is set from `ProtocolConfiguratorModal` via `intake.age` → `parseInt(intake.age, 10)` → stored on `journey.demographics.age`. Confirmed in `WellnessJourney.tsx` lines 605–610. The existing Patient Context bar already reads `journey.demographics?.age` (line 690) and renders `— yrs` as empty state — proof the path is production-tested. For the HUD chip, format as: `journey.demographics?.age ? \`${journey.demographics.age} yrs\` : null` and use the standard "Not recorded" empty state per Section 7.

---

#### LEAD Additional Constraint: `Phase1HUD` props need updating
The `Phase1HUD` component currently receives only `{ journey, gates }`. To render the Risk Level chip, it needs `contraindicationResult` which is computed in the parent `PreparationPhase`. Builder must add `contraindicationResult?: ContraindicationResult | null` to `Phase1HUDProps` and thread it down from `PreparationPhase`. The type is already imported via `runContraindicationEngine` — just add `type ContraindicationResult` to the import.

**No other component changes or new imports needed.** `getSeverityInfo` already lives in `PreparationPhase.tsx` — Builder should move it above `Phase1HUD` or pass the computed severity objects down as props. LEAD preference: pass computed severity strings down (cleaner — `Phase1HUD` stays dumb).

---

### PRODDY Sign-Off Checklist


- [x] Problem Statement is ≤100 words and contains no solution ideas
- [x] Job-To-Be-Done is a single sentence in the correct format
- [x] All 3 success metrics contain a measurable number or specific observable event
- [x] Out of Scope is populated (not empty)
- [x] Priority tier has a named reason (not just "seems important")
- [x] Open Questions list is ≤5 items
- [x] Design Intent (Section 7) is populated with specific, actionable visual direction for Builder
- [x] No code, SQL, or schema written anywhere in this document
- [x] Frontmatter updated: `owner: LEAD`, `status: 00_INBOX`
- [x] Response wrapped in `==== PRODDY ====`
