---
id: WO-083
title: "Enhanced Privacy Guided Tour — Strategy & Naming"
status: 00_INBOX
owner: PENDING
failure_count: 0
created: 2026-02-17T22:32:48-08:00
priority: high
tags: [grey-market, privacy, guided-tour, onboarding, proddy, naming, strategy]
---

# WO-083: Enhanced Privacy Guided Tour — Strategy & Naming

## USER REQUEST (VERBATIM)
"Create separate guided tour for Grey Market features, but we will call it something else like 'Enhanced Privacy' or other TBD"

---

## SCOPE DEFINITION

### Primary Objective
Define the **product strategy, naming, and content architecture** for a separate guided tour that introduces users to the Grey Market / Enhanced Privacy feature set — without using the term "Grey Market" in any user-facing copy.

This is a **PRODDY strategy task**. PRODDY will define the concept; DESIGNER and BUILDER will implement later.

---

## BACKGROUND & CONTEXT

### What Are "Grey Market Features"?
The PPN Research Portal includes a set of features designed for practitioners operating outside formal clinical trial frameworks — sometimes called "grey market" practitioners. These features include:
- **Potency Normalizer** — Adjusts dosing calculations for unverified substance potency
- **Crisis Logger** — Rapid adverse event documentation during active sessions
- **Cockpit Mode** — Streamlined real-time session monitoring UI
- **Shadow Market Schema** — Privacy-preserving data structures
- Additional privacy-first data handling features

### Why a Separate Tour?
The existing guided tour covers standard clinical workflows. Grey Market / Enhanced Privacy features require:
- A **different framing** (privacy-first, harm-reduction, practitioner autonomy)
- **Separate onboarding** so as not to confuse standard clinical users
- **Careful language** that avoids legal exposure while still communicating value
- A **distinct entry point** (not auto-triggered; user-initiated or role-gated)

---

## REQUIREMENTS

### 1. Naming Strategy (PRIMARY DELIVERABLE)
PRODDY must recommend a final name for this tour. Options to evaluate:
- "Enhanced Privacy Mode"
- "Advanced Practitioner Tools"
- "Privacy-First Workflow"
- "Independent Practice Mode"
- "Harm Reduction Toolkit"
- Other — PRODDY should propose alternatives

**Evaluation Criteria:**
- Does NOT reference "grey market" or illegal activity
- Resonates with privacy-conscious practitioners
- Sounds professional and clinical
- Avoids triggering legal/regulatory concern
- Consistent with existing PPN Portal brand voice

### 2. Tour Content Architecture
Define the **structure and flow** of the tour:
- How many steps?
- What features are covered and in what order?
- What is the narrative arc? (e.g., "Here's how to protect your practice and your clients")
- What is the entry point? (Button in sidebar? Settings? First-time modal?)
- Is it role-gated or available to all users?

### 3. Messaging Framework
Define the **voice and tone** for this tour:
- What pain points does it address?
- What value propositions does it communicate?
- What legal disclaimers or caveats are needed?
- How does it differ in tone from the standard onboarding tour?

### 4. Feature Inventory for Tour
Confirm and finalize the **complete list of features** to be covered:
- Which features belong in this tour?
- Are any features currently missing that should be built?
- Are any features better suited to the standard tour?

### 5. Entry Point & Trigger Strategy
Recommend how users discover and launch this tour:
- Auto-triggered on first access to a privacy feature?
- Manual launch from Help menu?
- Gated behind a "practitioner type" selection?
- Persistent re-launch option?

---

## DELIVERABLES

### Primary: Strategy Document
Create `ENHANCED_PRIVACY_TOUR_STRATEGY.md` in `/docs` or append to this ticket with:

1. **Recommended Tour Name** (with rationale and alternatives)
2. **Target User Persona** (who is this for?)
3. **Feature Inventory** (complete list of covered features)
4. **Tour Flow Outline** (step-by-step narrative structure)
5. **Messaging Framework** (tone, value props, disclaimers)
6. **Entry Point Recommendation** (how users access the tour)
7. **Differentiation from Standard Tour** (what's different and why)
8. **Handoff Notes for DESIGNER** (visual and UX requirements)

---

## SUCCESS CRITERIA

- [ ] Final tour name recommended with clear rationale
- [ ] Complete feature inventory for the tour
- [ ] Tour flow outlined (step count, narrative arc)
- [ ] Messaging framework defined (tone, value props, disclaimers)
- [ ] Entry point strategy recommended
- [ ] Handoff notes ready for DESIGNER and BUILDER
- [ ] No user-facing language references "grey market" or illegal activity

---

## ROUTING GUIDANCE FOR LEAD

**Recommended Owner:** PRODDY
**Recommended Status:** 01_TRIAGE

After PRODDY completes strategy:
- → **DESIGNER** for tour UI/UX design and visual specs
- → **MARKETER** for copy refinement and legal disclaimer review
- → **BUILDER** for implementation

---

## NOTES
- This tour should feel like a **premium unlock** — not a workaround
- Language must be carefully reviewed for legal exposure
- Consider whether this tour should be visible in the Component Showcase or kept separate
- Coordinate with WO-081 (User Guide) — this tour should have a corresponding section in the User Guide

---

## LEAD ARCHITECTURE

**Routed:** 2026-02-17T23:10:06-08:00
**Owner:** PRODDY
**Status:** 01_TRIAGE

### Technical Strategy
PRODDY owns naming strategy and content architecture only. This is a strategy-first ticket — no UI or code work at this stage. The tour will reuse the same technical framework as the main guided tour (WO-085), so PRODDY must wait for WO-085 DESIGNER output before defining step-level UX details.

### Constraints
- Final tour name must be approved by USER before any implementation begins
- Must coordinate with WO-081 (User Guide) — the Enhanced Privacy features need a corresponding help section
- Must coordinate with WO-084 — Crisis Logger and Cockpit Mode may appear in both tours
- Must coordinate with WO-085 — the fixed main tour is the technical foundation for this tour

### Handoff After PRODDY
PRODDY → update `owner: LEAD` and `status: 01_TRIAGE`. LEAD will then route to MARKETER (copy/legal review) and DESIGNER (visual spec) in parallel.
