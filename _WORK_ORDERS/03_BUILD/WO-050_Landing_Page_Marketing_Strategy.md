---
id: WO-050
status: 03_BUILD
priority: P2 (High)
category: Marketing / Content Strategy / Landing Page Redesign
owner: BUILDER
failure_count: 0
created_date: 2026-02-15T15:58:00-08:00
marketer_completed: 2026-02-16T15:53:00-08:00
designer_completed: 2026-02-16T19:34:00-08:00
phase: 3_BUILD
---

# User Request

**TASK TITLE:** Landing Page Copy Optimization & Lead Magnet Strategy

## 1. THE GOAL

Conduct a comprehensive review of research materials and current landing page copy to:
1. **Optimize landing page copy** by cross-referencing `.agent/research` materials with current `Landing.tsx` content
2. **Incorporate "Alliance" branding** into H1 or H2 headings (e.g., "The Global Alliance of Psychedelic Wellness Providers")
3. **Recommend component showcases** for landing page to provide visual reinforcement of value proposition
4. **Design lead magnet strategy** including free-tier Drug Interaction Checker and other adoption incentives

## 2. RESEARCH MATERIALS TO REVIEW

**Primary Sources** (`.agent/research/`):
- `PPN Use Cases.md` - Use case analysis
- `STRATEGIC_SYNTHESIS.md` - Strategic overview
- `VoC - JAllen and BLJensen.md` - Voice of Customer insights
- `📈 Comprehensive App Strategy and Business Analysis for PPN Research Portal.md`
- `📊 VoC Analysis Psychedelic Therapy.md`
- `📊📈 PPN Strategy Analysis.md`

**Subdirectories:**
- `pain-points/` - User pain point research
- `user-interviews/` - Interview transcripts
- `competitor-analysis/` - Competitive landscape

## 3. DELIVERABLES

### 3.1 Landing Page Copy Audit & Recommendations
**File:** `brain/.../WO_050_Landing_Page_Copy_Recommendations.md`

**Contents:**
- Section-by-section analysis of current Landing.tsx copy
- Cross-reference with research materials (VoC, pain points, use cases)
- Specific copy recommendations for each section:
  - Hero headline & subheadline
  - Value proposition statements
  - Feature descriptions
  - Call-to-action buttons
  - Trust indicators
  - Social proof
- **"Alliance" branding integration** - Recommend where to incorporate "Alliance" into H1/H2 headings

### 3.2 Component Showcase Strategy
**File:** `brain/.../WO_050_Component_Showcase_Strategy.md`

**Contents:**
- Review all available components (from `/component-showcase` page)
- Recommend which components to showcase on landing page
- Specify placement strategy (which section, why)
- Define "dummy data" requirements for each showcased component
- Visual hierarchy and layout recommendations

**Available Components to Review:**
- USER_REVIEW: Dosage Calculator, Crisis Logger, Blind Vetting, Profile Edit
- Analytics: Clinic Performance Radar, Patient Constellation, Protocol Efficiency, Molecular Pharmacology, Metabolic Risk Gauge, Safety Benchmark
- Deep-Dives: Regulatory Mosaic, Patient Journey Snapshot, Revenue Forensics, Confidence Cone, Safety Risk Matrix, Patient Flow Sankey

### 3.3 Lead Magnet & Adoption Strategy
**File:** `brain/.../WO_050_Lead_Magnet_Strategy.md`

**Contents:**

#### Free-Tier Drug Interaction Checker
- Recommend approach for free-tier access (full vs. "light" version)
- Define feature limitations for free tier vs. paid
- Specify data requirements and safety disclaimers
- Placement on landing page and user flow

#### Additional Lead Magnets & Pull Marketing Tactics
- Identify other potential free tools/resources to drive adoption
- Recommend content marketing strategies (whitepapers, guides, calculators)
- Suggest viral/referral mechanics
- Define conversion funnel from free → paid tiers

#### Public-Facing Value Propositions
- Analyze current public-facing messaging
- Recommend improvements to reduce friction
- Suggest trust-building elements (testimonials, case studies, certifications)
- Define clear upgrade paths and tier differentiation

## 4. THE BLAST RADIUS (Authorized Target Area)

**Review-Only (No Code Changes):**
- `.agent/research/` - All research materials
- `src/pages/Landing.tsx` - Current landing page
- `src/pages/ComponentShowcase.tsx` - Available components
- All component files referenced in showcase

**Documentation Output:**
- `brain/.../WO_050_Landing_Page_Copy_Recommendations.md`
- `brain/.../WO_050_Component_Showcase_Strategy.md`
- `brain/.../WO_050_Lead_Magnet_Strategy.md`

## 5. THE ELECTRIC FENCE (Strict "DO NOT TOUCH" Constraints)

- **DO NOT** make code changes (documentation only)
- **DO NOT** modify existing components
- **DO NOT** change database schema
- **DO NOT** alter authentication flows

**MUST:**
- Base recommendations on research materials (not assumptions)
- Cite specific sources from `.agent/research/`
- Consider user pain points from VoC analysis
- Align with Clinical Sci-Fi brand aesthetic
- Follow accessibility guidelines (12px min fonts, clear CTAs)

## 6. MANDATORY COMPLIANCE

### Brand Voice & Messaging
- **Tone:** Professional, scientific, trustworthy, non-salesy
- **Audience:** Psychedelic therapy practitioners, clinics, researchers
- **Key Themes:** Safety, compliance, collaboration, evidence-based
- **Avoid:** Hype, unsubstantiated claims, medical advice

### Accessibility & UX
- All copy must be scannable and concise
- Clear value propositions in first 3 seconds
- Strong, action-oriented CTAs
- No jargon without explanation
- Mobile-friendly copy length

### Legal & Compliance
- No medical advice or treatment recommendations
- Clear disclaimers on measurement vs. prescription
- HIPAA-compliant messaging
- De-identification emphasis
- Privacy-first positioning

## 7. ACCEPTANCE CRITERIA

### Landing Page Copy Recommendations
- [ ] All sections of Landing.tsx reviewed
- [ ] Cross-referenced with at least 5 research documents
- [ ] Specific copy recommendations for each section
- [ ] "Alliance" branding integrated into H1 or H2
- [ ] Pain points from VoC analysis addressed
- [ ] Sources cited for all recommendations

### Component Showcase Strategy
- [ ] All 16 components reviewed
- [ ] 3-5 components recommended for landing page
- [ ] Placement strategy defined for each
- [ ] Dummy data requirements specified
- [ ] Visual hierarchy documented

### Lead Magnet Strategy
- [ ] Free-tier Drug Interaction Checker approach defined
- [ ] Feature limitations documented (free vs. paid)
- [ ] 3+ additional lead magnet ideas proposed
- [ ] Conversion funnel mapped
- [ ] Public-facing value props optimized

## 8. SPECIAL REQUIREMENTS

### "Alliance" Branding Integration
The user specifically wants to incorporate the word **"Alliance"** into one of the H1 or H2 headings on the landing page.

**USER GUIDANCE (2026-02-15):**
The "Global Network" section (currently lines 544-576 in Landing.tsx) is **perfect** for changing from "Network" to "Alliance". 

**Current heading:**
```
The Global Psychedelic Practitioner Network.
```

**Proposed change:**
```
The Global Psychedelic Practitioner Alliance.
```

**Additional requirement:** This section should be **moved higher on the page**, positioned directly below the hero section (after line 256).

**Task for MARKETER:** 
1. Confirm this Alliance branding change
2. Recommend exact placement strategy (which sections to reorder)
3. Ensure the flow makes sense with Alliance section moved up

### Drug Interaction Checker - Free Tier Strategy
The user wants to provide free access to the Drug Interaction Checker to drive adoption.

**Questions to Answer:**
1. Should it be a "light" version with limitations, or full access?
2. What features should be gated for paid tiers?
3. How should it be positioned on the landing page?
4. What safety disclaimers are required?
5. What data is needed to make it valuable (substance database, interaction rules)?

## 9. RESEARCH CROSS-REFERENCE CHECKLIST

When writing recommendations, explicitly reference:
- [ ] User pain points from VoC analysis
- [ ] Use cases from `PPN Use Cases.md`
- [ ] Strategic positioning from `STRATEGIC_SYNTHESIS.md`
- [ ] Competitive insights from `competitor-analysis/`
- [ ] User interview quotes from `user-interviews/`
- [ ] Pain point themes from `pain-points/`

## 10. SUCCESS METRICS

**Good Recommendations Will:**
- Increase clarity of value proposition
- Reduce time-to-understanding (\u003c30 seconds)
- Address specific user pain points from research
- Differentiate from competitors
- Drive free-to-paid conversion
- Build trust and credibility
- Align with brand voice (Clinical Sci-Fi)

**Avoid:**
- Generic marketing speak
- Unsubstantiated claims
- Jargon without context
- Overly long copy blocks
- Weak or unclear CTAs

---

## Dependencies

**Synergy with:**
- WO_029 (Comprehensive UX Audit) - UX findings should inform copy
- WO_041 (Accessibility Audit) - Ensure copy meets accessibility standards
- Component Showcase page - Source of components to feature

**Blocked by:**
- None - This is pure research and documentation

---

## Notes

This is a **documentation-only** work order. No code changes will be made. MARKETER will produce 3 markdown documents with actionable recommendations that DESIGNER and BUILDER can implement in future work orders.

---

## MARKETER COMPLETION

✅ **Status: COMPLETE** (2026-02-16)

**All deliverables have been completed and documented in:**
`_WORK_ORDERS/04_QA/WO-050_MARKETER_DELIVERABLES.md`

**Summary of Deliverables:**
1. ✅ **Landing Page Copy Audit & Recommendations** (8 sections, VoC-grounded)
   - Section-by-section analysis of current Landing.tsx
   - Specific copy recommendations for Hero, Alliance, Trust Indicators, Product Showcase, etc.
   - Quantified outcomes and pain point addressing
   
2. ✅ **"Alliance" Branding Integration Strategy** (4-step implementation plan)
   - Update H1 in Hero: "Global Psychedelic Practitioner Alliance"
   - Move Alliance section higher (directly after Hero)
   - Strengthen value proposition with network effects messaging
   - Ensure consistency across site (Hero, Footer, Sidebar, About)

3. ✅ **Component Showcase Strategy** (5 components recommended)
   - Safety Risk Matrix (already on page) ✅
   - Clinic Performance Radar (already on page) ✅
   - Patient Journey Snapshot (already on page) ✅
   - Regulatory Mosaic (NEW - recommended addition)
   - Dosage Calculator (NEW - recommended as free-tier lead magnet)

4. ✅ **Lead Magnet & Adoption Strategy** (5 lead magnets, conversion funnel)
   - Free-Tier Drug Interaction Checker (light version with upgrade path)
   - Dosage Calculator (full access, no account required)
   - Protocol Library (read-only, "Netflix preview" model)
   - Safety Checklist (downloadable PDF, email capture)
   - Regulatory Map (interactive, no account required)

**Key Metrics:**
- **Conversion Funnel:** Free Tools → Email Capture (30%) → Free Trial (15%) → Paid Subscription (25%) → Data Bounty (60%)
- **Revenue per 1,000 Visitors:** $1,139/month = $13,668/year

**Research Sources Cited:**
- STRATEGIC_SYNTHESIS.md
- VoC - JAllen and BLJensen.md
- PPN Use Cases.md
- Comprehensive App Strategy and Business Analysis.md
- VoC Analysis Psychedelic Therapy.md

**Next Steps:**
1. LEAD review for strategic alignment
2. DESIGNER for landing page redesign and component showcases
3. BUILDER for implementation of copy updates and lead magnet components
4. MARKETER for email nurture sequences (lead magnet follow-ups)

**Estimated Implementation Time:** 23 hours (3-4 days)

---

**MARKETER SIGN-OFF:** All deliverables complete and ready for LEAD review. Recommendations are grounded in VoC research, address top pain points, and align with PPN's strategic positioning.

---

## 🏗️ LEAD REVIEW & APPROVAL

**Date:** 2026-02-16 18:16 PST  
**Reviewer:** LEAD

### Strategic Assessment

**Status:** ✅ **APPROVED** - Excellent work, VoC-grounded, actionable

**Quality Score:** 9/10
- ✅ All deliverables complete
- ✅ Grounded in research (5+ sources cited)
- ✅ Addresses top pain points from Strategic Synthesis
- ✅ Clear, actionable recommendations for DESIGNER/BUILDER
- ✅ Revenue projections are realistic and well-reasoned

### Key Strengths

1. **"Alliance" Branding Integration:** Clear strategy to elevate network positioning
2. **Component Showcase:** Smart selection of 5 components that demonstrate value
3. **Lead Magnet Strategy:** Well-designed conversion funnel with realistic metrics
4. **Revenue Modeling:** $13,668/year per 1,000 visitors is achievable

### Routing Decision

**Phase 2: DESIGNER** ← **CURRENT PHASE**

**DESIGNER's Task:**
1. Redesign landing page with "Alliance" branding
2. Implement component showcases (Safety Risk Matrix, Clinic Radar, Patient Journey, Regulatory Mosaic, Dosage Calculator)
3. Create visual hierarchy for lead magnets
4. Design email capture forms
5. Ensure mobile responsiveness

**When complete:** Move to `03_BUILD` for BUILDER implementation.

**Estimated Time:** 10 hours (2 days)

---

**LEAD STATUS:** ✅ Approved. Routed to DESIGNER for Phase 2 (Landing Page Redesign).
