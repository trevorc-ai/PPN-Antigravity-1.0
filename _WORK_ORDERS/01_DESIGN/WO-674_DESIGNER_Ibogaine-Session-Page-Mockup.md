---
owner: DESIGNER
status: 04_BUILD
authored_by: PRODDY
active_sprint: true
priority: P1
created: 2026-03-24
files: []
---

# WO-674 — DESIGNER: Ibogaine Session Page Mockup
**Assigned to:** DESIGNER
**Reviewer:** USER + Dr. Allen (external)
**Status:** 04_BUILD — Active

---

## Brief

Produce a high-fidelity mockup of the **Ibogaine Pre-Session Panel** — a new standalone page accessible at `/session/:id/ibogaine-prep`. This mockup will be reviewed by the user and then sent directly to Dr. Allen for clinical validation before any code is written.

**This is a clinical tool for an active medical session. Every design decision must prioritize glanceability, speed, and zero-friction data entry over aesthetics.**

---

## Required: Two Panels

### Panel A — Pre-Session Checklist (Left side / top on mobile)

A sequential pre-session workflow. Each section is a **collapsible card** that shows status + score at collapsed state. Practitioner works top-to-bottom.

| Order | Section | Inputs |
|---|---|---|
| 1 | Patient & Weight | Subject ID (read-only), Weight (lbs + kg toggle), auto-converts |
| 2 | Vitals Baseline | BP (systolic/diastolic), HR, RR — custom numpad modal |
| 3 | Baseline ECG | QTc (ms), Device (Schiller / Philips / Wearlinq dropdown), Formula (Bazett / Fridericia) — **GATE: if QTc > 500ms, hard-block "Proceed" button in red** |
| 4 | IV Pre-Medications | Substance + Dose + Route per row; add-row pattern (MgCl₂, Metoclopramide, etc.) |
| 5 | Concomitant Medications | Pull from Phase 1 (read-only reference) |
| 6 | COWS | 11-item collapsible; auto-total 0–55; scored severity label (Mild/Moderate/Severe) |
| 7 | BAWS | Collapsible; auto-total |
| 8 | SARA / FTN / HKS | 8-item SARA (0–40 auto-total) + FTN (Pass/Fail) + HKS (Pass/Fail) — collapsible |
| 9 | Cognitive Baseline (SLUMS) | 11-item collapsible; auto-total 0–30 |
| 10 | Dosing Sequence Setup | Test Dose → Dose #2 → Dose #3 — substance type (TPA / HCl), mg per dose |

**Proceed to Session button:** Locked (gray, disabled) until ECG Baseline is completed. If QTc > 500ms, button shows red "Session Blocked — QTc Threshold Exceeded". If QTc 450–500ms, button shows amber "Proceed with Heightened Monitoring".

---

### Panel B — Intra-Session Timeline (Right side / bottom on mobile)

A live-entry session log. **Newest event always at top.** Columns: Time | Event Type | Details | QTc at time of entry.

**Action buttons (fat-finger, minimum 96px tall each):**
- `+ Log Vitals` → modal with custom numpad + morphology checkboxes
- `+ Administer Dose` → modal: Substance (dropdown: TPA / Ibogaine HCl / Ketamine / Other) + mg + Route; **swipe-to-confirm** if dose > 500mg
- `+ Secondary Substance` → same dose modal, labeled differently in timeline
- `+ Clinical Note` → structured dropdown categories only (no free text)

**Persistent pharmacology bar (pinned to bottom of timeline panel):**
`Total: 0 mg | 0.0 mg/kg | Last dose: — min ago | Session: 0:00:00`

**QTc trend indicator (pinned above action buttons):**
120px font showing current QTc. Color: green (<450ms), amber (450–500ms), red (>500ms). Trend arrow (↑↓) + delta from baseline.

---

## UX Constraints (Non-Negotiable)

Per Dr. Vega's clinical UX brief:

1. **Dark mode mandatory** — `#121212` background. Clinical sessions are conducted in low-light rooms. A white screen disrupts the environment and patient.
2. **Tablet-landscape primary** — layout is designed at 1024px+ landscape. Single-column on mobile (Panel A top, Panel B below), both scrollable.
3. **Fat-finger targets** — minimum 48px touch targets everywhere. Primary action buttons 96px tall.
4. **No iOS native keyboard** — all numeric inputs open a custom modal numpad.
5. **Accordion rule** — pre-session assessment cards may collapse. Intra-session vitals and dose events must always be visible.
6. **Slide-over interaction rail** — a persistent 30%-width slide-over drawer (accessible via floating icon) surfaces the Interaction Checker for CYP2D6 queries without navigating away.
7. **PPN design system** — use existing color tokens, typography scale, and component patterns (rounded cards, border-primary glow, etc.)

---

## Reference Materials

| Document | Location |
|---|---|
| Dr. Vega UX Brief (full layout spec) | `public/internal/admin_uploads/research/ibogaine/Ibogaine_SaaS_Layout.md` |
| Dr. Vega Clinical FRD (JSON contracts, device specs) | `public/internal/admin_uploads/research/ibogaine/Ibogaine_Research_SaaS.md` |
| Multi-agent analysis (all agent perspectives) | `brain/.../ibogaine_multiagent_deep_dive.md` |
| Research synthesis (cardiac thresholds, drug lists) | `brain/.../ibogaine_research_synthesis.md` |
| Dr. Allen's paper form | `brain/.../media__*.jpg` (4 images) |

---

## Deliverables

1. **Desktop/tablet mockup** — two-panel landscape layout at 1280×900
2. **Mobile mockup** — single-column stacked layout at 390×844
3. **QTc gate state variants** — show the Proceed button in all three states (locked/amber/red-blocked)
4. **"Log Vitals" modal** — showing custom numpad + morphology toggle chips
5. **"Administer Dose" modal** — showing swipe-to-confirm pattern

---

## After Mockup Is Complete

Do NOT move to BUILD. The completed mockup goes to USER for review, then USER sends to Dr. Allen for clinical feedback. BUILDER does not start until Dr. Allen's input is received and incorporated.

---

## Sign-Off Checklist

- [ ] DESIGNER: Mockup complete — all 5 deliverables above
- [ ] USER: Visual review passed
- [ ] Dr. Allen: Clinical layout review — confirms sequencing, instruments, and form flow
- [ ] PRODDY: Any PRD amendments triggered by Dr. Allen's feedback
- [ ] LEAD: Amended PRDs approved → tickets move to BUILD
