---
id: WO-579
title: PatientReport.tsx Full Overhaul — Layout, Charts, Interactivity, CSS Violations
owner: LEAD
status: 00_INBOX
priority: P1
created: 2026-03-09
source: Jason-Trevor Meeting 2026-03-09
---

## PRODDY PRD

> **Work Order:** WO-579 — PatientReport.tsx Full Overhaul  
> **Authored by:** INSPECTOR (expedited from meeting action items)  
> **Date:** 2026-03-09  
> **Status:** Draft → Pending LEAD review  

---

### 1. Problem Statement

The Patient Report page (`PatientReport.tsx`) has multiple simultaneous defects:  
• **Layout:** Section sequence is not temporally ordered — shows future content before present.  
• **Zone 2 chips:** "Emotional Terrain" chips are ghost pills, not interactive.  
• **Zone 3 sliders:** "Neuroplastic Window" sliders are permanently disabled after first submission; can't be updated.  
• **Zone 5 chart:** Pharmacokinetic Flight Plan graph is too short, has no data points plotted, and has axis labels at 7px (below the 14px minimum).  
• **CSS violations:** Font and layout violations throughout the page.  
• **Sharing:** No native device share capability; falls back to clipboard without feedback.

---

### 2. Target User + Job-To-Be-Done

The patient (and practitioner) needs the Integration Compass to present at session-end in a clear temporal sequence with all interactive elements functioning so the patient can complete self-reflection tasks and share their journey with their care circle.

---

### 3. Success Metrics

1. Page sections render in temporal order: "What Just Happened" → "Next 1–3 Days" → "Beyond 3 Days" — verified by visual audit.
2. Zone 2 chips are interactive (selectable/deselectable) and Zone 3 sliders are re-editable after the initial submission.
3. The Pharmacokinetic Flight Plan chart height ≥ 300px, shows at least 1 plotted data point per drug administered, and all axis labels ≥ 14px font size.

---

### 4. Feature Scope

#### ✅ In Scope

- **Reorder layout** to: Zone 1 (Session Summary) → Zone 2 (Emotional Terrain) → Zone 3 (Neuroplastic Window) → Zone 5 (Practical Planning) → Zone 4 (Safety & Support) → Zone 6 (Journey Map / Flight Plan)
- **Zone 2 chips:** Make emotional terrain chips selectable with local state; persist selections to the patient report record.
- **Zone 3 sliders:** Remove `readOnly` lock after first submission; allow edits until the patient explicitly locks ("Finalize my responses").
- **Zone 5 chart:** Increase chart height to ≥ 300px; plot concentration curve data points; fix axis label font sizes to ≥ 14px; add X-axis (hours post-dose) and Y-axis (relative concentration) labels.
- **Multi-substance spider chart:** If multiple substances were administered, render a toggle to switch between them on Zone 6 spider chart (default: experiential mode, already fixed in Track 1).
- **CSS/font violations sweep:** Identify and correct all font-size violations (< 14px), replace any hardcoded `px` values with design-system tokens.

#### ❌ Out of Scope

- Full redesign of the Patient Report visual identity
- Actual pharmacokinetic drug concentration calculations (use the existing curve model; just fix the rendering height and labels)
- Backend scoring changes for Zone 3

---

### 5. Priority Tier

**[x] P1** — High value, ship this sprint  

**Reason:** This page is the patient-facing output of every session. It will be seen in every demo. The interactive defects (chips, sliders) and the chart height/label violations make it feel broken.

---

### 6. Open Questions for LEAD

1. What is the canonical temporal ordering of zones per the clinical team? The current ordering appears to have been set before the temporal UX decision.
2. Should Zone 3 slider responses lock automatically at a defined time (e.g., 72 hours post-session), or only on explicit patient action?
3. Does the multi-substance toggle on Zone 6 need to persist the selected substance between page visits?

---

### PRODDY Sign-Off Checklist

- [x] Problem Statement is ≤100 words and contains no solution ideas
- [x] Job-To-Be-Done is a single sentence in the correct format
- [x] All 3 success metrics contain a measurable number or specific observable event
- [x] Out of Scope is populated
- [x] Priority tier has a named reason
- [x] Open Questions list is ≤5 items
- [x] No code, SQL, or schema written anywhere in this document
