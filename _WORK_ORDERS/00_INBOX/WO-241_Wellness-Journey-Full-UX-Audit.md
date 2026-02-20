---
id: WO-241
status: 00_INBOX
owner: LEAD
failure_count: 0
created: 2026-02-20
priority: HIGH
---

# WO-241 — Wellness Journey: Full UX Audit & Refinement Plan

## User Prompt (verbatim)
> "Deep dive into the total wellness journey, focusing on tablet and mobile 
> experiences. Count clicks and taps, time the experience, assess its quality, 
> and propose specific refinements. No exit. The entire experience, from 
> beginning to end. We CANNOT break anything. It must work flawlessly."

---

## Context: What the Podcast Transcripts Tell Us About Real Users

Eight internal podcast transcripts were reviewed. Key VoC quotes:

| User quote | UX implication |
|---|---|
| *"Administrative burnout from fragmented tools is killing us"* | Zero context-switching. One tab, zero re-keying. |
| *"An iPad on the therapist's lap. Dark mode. Big simple buttons."* | Phase 2 must be thumb-operable. No keyboard mid-session. |
| *"The click-clack of a keyboard pulls a patient out of a deep state"* | Phase 2 must be silent + gestural. Tap only. |
| *"Tap to log: distress, breakthrough, vital check"* | Session Timeline is the #1 missing Phase 2 feature. |
| *"Integration collides without patient economics"* | Phase 3 must feel urgent and motivating. |

---

## P0 — Already Shipped by BUILDER (2026-02-20)

| Fix | File(s) | Status |
|---|---|---|
| MEQ-30: Added sticky Save & Done footer — was unreachable after 30 questions | `MEQ30QuestionnaireForm.tsx` | ✅ DONE |
| MEQ-30: Wired `onComplete` prop in router | `WellnessFormRouter.tsx` | ✅ DONE |
| **Universal "Close Panel" footer on ALL forms** — any long form now has an exit at the bottom without scrolling back to top | `SlideOutPanel.tsx` | ✅ DONE |
| SlideOutPanel X button: 24px → 44px touch target (WCAG 2.1 AA) | `SlideOutPanel.tsx` | ✅ DONE |
| Phase1StepGuide hero card: `flex-row` → `flex-col sm:flex-row` — CTA no longer squashed on mobile | `Phase1StepGuide.tsx` | ✅ DONE |
| Phase1StepGuide step rail: `grid-cols-5` → `grid-cols-3 sm:grid-cols-5` — labels no longer overflow on 390px | `Phase1StepGuide.tsx` | ✅ DONE |

---

## P1 — Queue for DESIGNER + BUILDER (next sprint)

### P1.1 — Phase 2 Session Cockpit (HIGH VALUE)
The transcripts demand a "tap-to-log" session cockpit. Currently Phase 2 has no 
ambient session toolbar — the "Record Vitals" button is buried in the patient header.

**Proposed fix:**
Add a sticky amber `SessionActiveBanner` component in Phase 2 that shows:
- Session clock (elapsed time)
- `Record Vitals` (primary CTA)
- `Log Event` (opens session-timeline)
- `Emergency` (opens rescue-protocol, red)

### P1.2 — Step Time Estimates on Phase 1 Guide
Clinicians need to know if a form takes 2 minutes or 20. Add `~3 min` badge 
to each PHASE1_STEPS entry.

**Proposed fix:** Add `estimatedMinutes` field to the `Phase1Step` interface, 
render as `~N min` badge in the hero card and step rail.

### P1.3 — "Mark Phase Complete" Bypass Warning
Currently a clinician can mark Phase 1 complete with 0 forms filled. From a 
liability standpoint this is dangerous. The transcripts explicitly mention 
"timestamped logs protect you."

**Proposed fix:** If `completedForms.size < PHASE1_STEPS.filter(s => s.required).length`,
show a confirmation dialog: *"X required forms are incomplete. Advance anyway?"*

### P1.4 — Consent Form Patient ID Block Dominates Screen
The anonymous patient ID card in the Consent form takes ~60% of visible area, 
pushing the actual consent content below the fold on tablet.

**Proposed fix:** Collapse to a compact pill: `🛡 PT-UD79JM9KXG [copy]`.
Recovers ~250px of vertical space.

### P1.5 — Phase 3 Neuroplasticity Window Indicator (HIGH VoC ALIGNMENT)
The podcasts are explicit: *"We want to track the neuroplasticity window — 
typically 2–3 weeks post-session where the brain is most malleable."*
This concept is entirely absent from the Phase 3 UI.

**Proposed fix:** Add a `NeuroplasticityWindowBadge` component to the 
IntegrationPhase header showing: 
`🧠 12 days remaining in neuroplasticity window`
Color: amber (14+ days), emerald (7–14), red (<7).

---

## P2 — Polish (backlog)

| Issue | Proposed Fix |
|---|---|
| FAB (`+` button) visible behind Patient Modal | Hide when modal is open |
| Swipe-to-dismiss threshold 100px — too sensitive for 6hr session | Increase to 200px |
| No keyboard shortcut on Patient Modal | `KeyN` → New Patient, `KeyE` → Existing |
| Phase 3 C-SSRS grid needs WCAG verification at 390px | Verify ≥44px per button |

---

## Click Count Analysis (Documented)

| Journey | Clicks | Scrolls | Est. Time |
|---|---|---|---|
| Page load → Consent saved (new patient) | 4 | 1 | ~90 sec |
| All 5 Phase 1 steps complete | 18–22 | 5+ | 12–18 min |
| Phase 2: Record Vitals (using preset) | 3 | 0 | ~30 sec |

---

## LEAD Architecture Notes
_(to be filled by LEAD)_

---

## Routing Recommendation

- P1.1 (Session Cockpit) → DESIGNER wireframe → BUILDER implement
- P1.2 + P1.3 (Step estimates + bypass warning) → BUILDER (low design risk)
- P1.4 (Consent ID block) → BUILDER (CSS only)
- P1.5 (Neuroplasticity window) → DESIGNER + BUILDER
- P2 items → BUILDER batch
