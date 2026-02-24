---
status: 01_TRIAGE
owner: LEAD
failure_count: 0
---

# User Intent
"I also want a marketing campaign for veterans and PTSD"

# Requirements Analyst Notes (CUE)
- User wants a targeted marketing campaign.
- Target audience: Veterans.
- Target condition/focus: PTSD.
- Requires strategy and copy. Likely needs routing to PRODDY for initial campaign strategy/messaging matrix, or directly to MARKETER.

# Action
Ticket created for LEAD to triage and assign appropriately.

## LEAD ARCHITECTURE
**Technical Constraints & Approach:**
1. **Routing:** This needs strategic definition first. Routed to PRODDY to define the campaign objectives, personas (Veterans with PTSD), and value propositions.
2. **Next Steps after Strategy:** Once PRODDY defines the PRD, it should be routed back to LEAD or directly to MARKETER for copywriting and DESIGNER for landing page assets. Let's send to PRODDY for roadmap alignment.

## PRODDY STRATEGY (PRD): Veterans, PTSD, & Free Suite Access

### Campaign Objectives & Scope
- **Target Audience:** Service members (active/veterans), Students, and those experiencing homelessness (in partnership with outreach organizations). Focus distinctly on Veterans suffering from PTSD.
- **The Anchor Offer:** PPN provides a fully free, professional-grade suite to these cohorts. Uncompromised clinical intelligence at zero cost.
- **Primary Domain:** `ppnportal.net` is live and serves as the primary gateway, with `.com` and `.org` secured and routing to the same hub.

### Strategic Execution Plan
1. **The "Free Suite" Verification Flow:** 
   - A seamless, rapid verification portal on `ppnportal.net/veterans` (or `/servicemembers`, `/students`).
   - Using frictionless identity verification (like `.mil` / `.edu` email checks or ID.me) to instantly provision access to the free PPN tier.
   - For homeless populations, a "Clinic Partner Portal" where partnered outreach clinics/social workers can instantly provision anonymous, fully-funded seats.

2. **Marketing Angles & Persona Pain Points (PTSD Focus):**
   - *Pain Point:* Treatment-Resistant Depression (TRD) and severe PTSD often leave veterans feeling frustrated by traditional VA treatment pathways and SSRI side effects.
   - *Messaging:* "Advanced psychedelics-assisted therapy tracking. Take control of your healing journey with uncompromising clarity, securely and privately."
   - *Tone:* Respectful, resilient, authoritative, and direct. Grounded in data and neuroscience.

3. **Landing Page Requirements (for DESIGNER & MARKETER):**
   - Hero section clearly stating: *"100% Free Network Access for Veterans, Students, and Active Service Members."*
   - A clear "Verify & Start Free" Call to Action.
   - A dedicated section speaking structurally to PTSD and how the platform tracks outcome metrics (PHQ-9, PCL-5).

### Handoff Instructions for LEAD
Strategy defined. I have updated the `owner` back to `LEAD` so you can architect the verification flow for the "Free Suite" and establish the routing from `ppnportal.net` to the dedicated landing pages.
