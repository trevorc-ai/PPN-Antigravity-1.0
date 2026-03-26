---
id: WO-643
title: "Denver Demo Script — 5-Minute Clinical Flow Walkthrough"
owner: PRODDY
authored_by: PRODDY
routed_by: LEAD
status: 02_TRIAGE
priority: P1
created: 2026-03-17
routed_at: 2026-03-17
depends_on: WO-640
skip_approved_by: ""
hold_reason: ""
held_at: ""
failure_count: 0
completed_at: ""
builder_notes: ""
skills: []
---

## Context

PsyCon Denver is April 7, 2026. The USER will be demoing `ppnportal.net` live, likely in
one-on-one or small-group settings at the conference. A scripted, rehearsable 5-minute demo
arc is needed to ensure the story lands consistently regardless of audience type.

This WO produces a printed demo script + a pre-configured demo environment.

---

## Deliverables

### 1. Demo Script Document
A printed single-page script (front only) with:
- Minute-by-minute arc (5 minutes total)
- Exact phrases to use verbatim at key moments
- Pivot points for two audience types (practitioner vs. researcher)
- What to say when the laptop is closed (the network vision)

The approved script arc is documented in `Denver_PsyCon_Prep_Plan.md` (Section: Stream 2).
PRODDY produces the final formatted version as a printable PDF.

### 2. Demo Environment Setup
A pre-configured Supabase test account with:
- One synthetic patient with realistic (non-PHI) baseline data pre-loaded
- One protocol pre-configured (psilocybin, depression indication, standard schedule)
- `NetworkIntelligenceCard` rendering a count > 0 (seed mock count in component if needed)
- Saved login credentials accessible offline

### 3. Two Practice Run-Throughs
USER completes two full timed run-throughs of the demo before departure:
- Run 1: Practitioner audience pivot
- Run 2: Researcher audience pivot
Both timed at < 6 minutes.

---

## Acceptance Criteria

- [ ] Printed demo script produced (single page, large enough to read glancing down)
- [ ] Demo account configured: synthetic patient, pre-built protocol, no blank states
- [ ] NetworkIntelligenceCard shows non-zero count on demo account
- [ ] Local `npm run dev` tested and confirmed working offline (no internet dependency)
- [ ] Two practice run-throughs completed and timed
- [ ] Demo account credentials saved and accessible without internet

---

## Demo Environment — Synthetic Patient Spec

```
Patient link code:  DEMO-2026-001
Age range:          35–44
Sex:                Female
Weight range:       60–70 kg
Indication:         Treatment-resistant depression
Baseline PHQ-9:     18 (moderate-severe)
Baseline GAD-7:     12 (moderate)
Smoking status:     Non-smoker
Concomitant meds:   None
Protocol:           Psilocybin 25mg oral, single session
```

No real patient data. Synthetic only. Safe to show publicly.

---

## Constraints

- Demo account must use a dedicated non-production user (not USER's personal account)
- No real patient data in demo environment
- Demo script is a print artifact — not a slide deck, not a video

---

## LEAD Architecture

**Routing Decision:** PRODDY owns script production. BUILDER configures demo environment
(data seeding only — no code changes required). Target complete: March 31, 2026.
Practice runs scheduled week of March 31.
