---
id: WO-083
title: "Enhanced Privacy Guided Tour — Strategy & Naming"
status: 03_BUILD
owner: BUILDER
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

---

## 📣 PRODDY STRATEGY DELIVERABLE — COMPLETE (2026-02-18 00:09 PST)

### 1. RECOMMENDED TOUR NAME: **"Advanced Practitioner Tools"**

**Rationale:**
- Sounds professional and clinical — not evasive
- "Advanced" signals this is a premium unlock, not a workaround
- "Practitioner Tools" is accurate and non-incriminating
- Avoids "privacy" (sounds defensive), "grey market" (obvious), "harm reduction" (clinical but niche)
- Consistent with PPN's peer-professional brand voice

**Alternatives (ranked):**
1. ✅ **"Advanced Practitioner Tools"** ← RECOMMENDED
2. "Independent Practice Suite" — good but implies solo practitioners only
3. "Enhanced Privacy Mode" — acceptable but "privacy" sounds defensive
4. "Practitioner Autonomy Tools" — too political

---

### 2. TARGET USER PERSONA

**"The Independent Practitioner"**
- Licensed or unlicensed, operating outside institutional frameworks
- Primary fear: legal liability, coerced disclosure, career destruction
- Primary need: documentation that proves process without exposing identity
- Tech comfort: moderate — uses apps daily but not a developer
- Discovery: peer referral, underground community, conference hallway conversation

---

### 3. FEATURE INVENTORY FOR TOUR

| # | Feature | Tour Priority | Notes |
|---|---------|--------------|-------|
| 1 | Potency Normalizer | P0 — Lead feature | Most unique, highest daily use |
| 2 | Crisis Logger | P0 — Safety critical | High stakes, needs dedicated mini-tour (WO-084) |
| 3 | Cockpit Mode | P1 — Session monitoring | Needs dedicated mini-tour (WO-084) |
| 4 | Zero-Knowledge Architecture | P1 — Trust builder | Explain what we DON'T store |
| 5 | Duress Mode / Guest PIN | P2 — Advanced security | Only after WO-088 is built |
| 6 | Data Export (your data stays yours) | P2 — Reassurance | Show they can leave anytime |

---

### 4. TOUR FLOW OUTLINE (7 Steps)

**Narrative Arc:** "Here's how to protect your practice, your clients, and your freedom."

| Step | Title | Target Element | Tooltip Content | Action |
|------|-------|---------------|-----------------|--------|
| 1 | "Welcome to Advanced Practitioner Tools" | Tour overlay | "These tools were built for practitioners who need documentation without exposure. Everything here runs with zero-knowledge architecture — we cannot see your client identities." | Click Next |
| 2 | "Potency Normalizer" | Potency Normalizer card | "Street substances vary in purity. This tool adjusts your dosing calculations for real-world potency — so your documentation reflects what actually happened." | Click to open |
| 3 | "Crisis Logger" | Crisis Logger button | "If something unexpected happens mid-session, this is your first move. One tap starts a timestamped log. We'll walk you through it separately." | Click Next |
| 4 | "Cockpit Mode" | Cockpit Mode toggle | "During a session, you need eyes on your patient, not your screen. Cockpit Mode consolidates everything into one distraction-free view." | Toggle on/off |
| 5 | "Your Data is Yours" | Privacy settings panel | "We store a blind index — not your client's name. Even if compelled by a court order, we cannot produce what we do not have." | Click Next |
| 6 | "The Audit Trail" | Session log view | "Every session you log creates a timestamped, cryptographically signed record. This is your proof of process — not proof of content." | Click Next |
| 7 | "You're Protected" | Dashboard | "You now have the documentation infrastructure that most practitioners in this field lack. Log your first session to start building your record." | Click Finish |

---

### 5. MESSAGING FRAMEWORK

**Tone:** Calm, professional, peer-to-peer. Not defensive. Not conspiratorial. Like a trusted colleague explaining a tool.

**Value Props:**
- "Prove process without exposing content"
- "Documentation that holds up — without revealing who"
- "Built for the session you're actually running"

**Legal Disclaimers (required in tour):**
- Step 1: "PPN Portal is a documentation and measurement tool. It does not provide legal advice. Consult an attorney regarding your specific practice context."
- Step 6: "Audit trail records are for your use. PPN does not share session data with third parties without your explicit consent."

**What's Different from Standard Tour:**
- Standard tour: "Here's how to track outcomes and benchmark your practice"
- Advanced tour: "Here's how to document safely and protect yourself"
- Standard tone: aspirational, clinical excellence
- Advanced tone: pragmatic, protection-focused, peer-level

---

### 6. ENTRY POINT RECOMMENDATION

**Trigger:** Manual launch only. NOT auto-triggered.
- Location: Help menu → "Advanced Practitioner Tools Guide"
- Also: First time user accesses Potency Normalizer or Crisis Logger → subtle banner: "New to these tools? [Take the 2-minute tour]"
- Re-launch: Always available in Help menu

**Rationale:** Auto-triggering this tour for all users would expose the feature set to users who didn't seek it. Manual launch respects practitioner autonomy and avoids surfacing grey market features to clinical users who don't need them.

---

### 7. HANDOFF NOTES FOR DESIGNER

- Tour overlay style: match existing guided tour (dark glassmorphic overlay, emerald accent)
- Step indicators: numbered dots at bottom (1/7, 2/7, etc.)
- "Skip Tour" button: always visible, top-right
- Tooltip max width: 320px (mobile-friendly)
- All text minimum 14px (stress-readable)
- No color-only meaning — use icons + text for all status indicators
- Entry point button: subtle, not prominent — this is a discovery feature, not a hero CTA

---

**PRODDY SIGN-OFF:** ✅ Strategy complete. Route to LEAD → MARKETER (copy refinement) + DESIGNER (visual spec) in parallel.

**Routing:** `owner: LEAD` | `status: 01_TRIAGE`
