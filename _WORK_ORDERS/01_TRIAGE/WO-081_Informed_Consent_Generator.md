---
id: WO-081
status: 01_TRIAGE
priority: P1 (Critical)
category: Feature
audience: Provider-Facing
implementation_order: 8
owner: PRODDY
failure_count: 0
---

# Informed Consent Generator

## LEAD ARCHITECTURE (2026-02-17 15:26 PST)

**Strategic Concern:** This is a **CRITICAL P1 feature** with 7 phases spanning 2-3 weeks (80-120 hours). Before committing engineering resources, we need PRODDY to validate:

1. **Market Demand:** Is this truly the #1 liability pain point? Does VoC data support building this vs. partnering with existing legal tech providers?
2. **External Dependency Risk:** Requires attorney review (blocking). Do we have legal counsel lined up?
3. **Phase Prioritization:** Which of the 7 phases deliver immediate value? Can we ship an MVP in Week 1?
4. **Competitive Landscape:** Do existing solutions exist (e.g., legal template marketplaces)? Build vs. buy decision?

**Technical Constraints (if approved):**
- Database schema: `consent_templates`, `consent_versions`, `subject_consents`
- Template engine: Handlebars or similar for variable substitution
- PDF generation library required
- Multi-language support (English, Spanish)
- WCAG 2.1 AA compliance (12pt minimum font, plain language)

**Routing:** Moving to `01_TRIAGE` for PRODDY strategic review before architecture.

---


## User Request

Build a jurisdiction-specific, substance-specific informed consent template generator to address practitioners' #1 liability anxiety: "No standardized informed consent for touch, ontological shock."

## Context

**From:** VoC Analysis - Liability & Ethics Minefield (CRITICAL Pain Point)  
**VoC Quote:** "Standard medical consent forms are inadequate for the 'ontological shock' of a psychedelic experience. Practitioners struggle to articulate risks in a legally defensible way."

**Strategic Priority:** CRITICAL - Addresses top 2 pain point (Liability & Ethics)

**Market Need:**
- Practitioners are terrified of malpractice suits
- Liability insurance either unavailable or prohibitively expensive
- No standardized templates for PAT-specific risks (touch, ontological risk, emergency protocols)
- Jurisdiction-specific requirements vary (Oregon vs. Colorado vs. Federal clinical trials)

## Acceptance Criteria

### Phase 1: Template Library (Week 1)
- [ ] Build consent template database with jurisdiction-specific templates
- [ ] Oregon: Psilocybin Services (OHA requirements)
- [ ] Colorado: Natural Medicine Program (DORA requirements)
- [ ] Federal: Clinical trial templates (FDA guidance)
- [ ] State-legal ketamine (off-label use)
- [ ] Substance-specific templates:
  - [ ] Psilocybin
  - [ ] MDMA
  - [ ] Ketamine (IV, IM, sublingual, nasal spray)
  - [ ] LSD (research only)

### Phase 2: Consent Generator UI (Week 1-2)
- [ ] Build consent generator wizard
- [ ] Step 1: Select jurisdiction (dropdown)
- [ ] Step 2: Select substance (dropdown)
- [ ] Step 3: Select route of administration (if applicable)
- [ ] Step 4: Customize optional sections:
  - [ ] Touch consent (explicit opt-in)
  - [ ] Video/audio recording consent
  - [ ] Emergency protocol acknowledgment
  - [ ] Ontological risk disclosure
  - [ ] Pregnancy/contraception requirements
- [ ] Step 5: Preview and download (PDF + editable DOCX)

### Phase 3: Touch Consent Module (Week 2)
- [ ] Build explicit touch consent section
- [ ] Define types of touch (hand-holding, shoulder support, grounding pressure)
- [ ] Explicit opt-in checkboxes (not default)
- [ ] Withdrawal of consent protocol
- [ ] Witness signature field (for high-risk scenarios)
- [ ] Language: "I understand that supportive touch may be offered during my session. I consent to the following types of touch: [checkboxes]"

### Phase 4: Ontological Risk Disclosure (Week 2)
- [ ] Build ontological risk section
- [ ] Disclose: Personality change, metaphysical distress, spiritual emergency
- [ ] Disclose: Challenging experiences (fear, paranoia, ego dissolution)
- [ ] Disclose: Integration challenges (difficulty returning to baseline worldview)
- [ ] Language: "I understand that this experience may fundamentally change my beliefs, values, and sense of self. I acknowledge that this change may be distressing."

### Phase 5: Emergency Protocol Section (Week 2)
- [ ] Build emergency protocol section
- [ ] Disclose: When 911 will be called
- [ ] Disclose: When rescue medication will be administered
- [ ] Disclose: When session will be terminated early
- [ ] Emergency contact fields (name, phone, relationship)
- [ ] Language: "I understand that if I experience [specific symptoms], emergency services may be contacted."

### Phase 6: Version Control & Audit Trail (Week 3)
- [ ] Track consent version (date generated, template version)
- [ ] Store consent in database (encrypted, linked to subject_id)
- [ ] Audit trail: Who generated, when signed, any amendments
- [ ] Re-consent workflow (if protocol changes mid-treatment)

### Phase 7: Legal Review Integration (Week 3)
- [ ] Add legal disclaimer: "This template is for informational purposes only. Consult with a licensed attorney."
- [ ] Add field for attorney review (checkbox: "Reviewed by legal counsel")
- [ ] Add field for malpractice carrier review (checkbox: "Approved by malpractice carrier")

## Technical Notes

**Database Schema:**
- Tables: `consent_templates`, `consent_versions`, `subject_consents`
- Foreign keys: `jurisdiction_id`, `substance_id`, `subject_id`, `created_by`

**Template Storage:**
- Store templates as JSON with variable placeholders
- Use template engine (Handlebars or similar) for variable substitution
- Support multi-language templates (English, Spanish)

**Language Rules (No Medical Advice):**
- ✅ "This consent form describes the risks and benefits of [substance] therapy"
- ✅ "You may experience [specific symptoms]. If this occurs, [specific protocol]"
- ❌ "This treatment is safe and effective" (overpromising)
- ❌ "You should do this treatment" (medical advice)

**Accessibility:**
- Minimum font size: 12pt
- Plain language (8th grade reading level)
- Available in Spanish and English

## Estimated Effort

**Total:** 2-3 weeks (80-120 hours)
- Phase 1 (Template Library): 16-24 hours
- Phase 2 (Generator UI): 16-24 hours
- Phase 3 (Touch Consent): 8-12 hours
- Phase 4 (Ontological Risk): 8-12 hours
- Phase 5 (Emergency Protocol): 8-12 hours
- Phase 6 (Version Control): 12-16 hours
- Phase 7 (Legal Review): 8-12 hours

## Dependencies

- Legal review of template language (external attorney)
- Jurisdiction-specific regulatory guidance (Oregon OHA, Colorado DORA)
- Database schema for consent storage
- PDF generation library

## Success Metrics

- [ ] 100% of practitioners using consent generator within 30 days
- [ ] 0 malpractice claims related to consent issues
- [ ] Average time to generate consent: <5 minutes
- [ ] 90% of consents include touch consent section
- [ ] 100% of consents include ontological risk disclosure

## VoC Validation

**User Quote:**
> "The need for clear 'informed consent for touch' is critical. Practitioners are searching for templates that protect them while allowing for human connection."

**User Quote:**
> "Practitioners struggle to articulate the risks of 'personality change' or 'metaphysical distress' in a legally defensible way."

**Strategic Alignment:**
- Addresses Pain Point #2: Liability & Ethics Minefield (CRITICAL)
- Supports Practitioner Archetype #1: Clinical Convert (60% of market)
- Enables "audit-ready documentation" (North Star Metric requirement)

## Risk Mitigation

**Risk:** Templates may not be legally sufficient in all jurisdictions  
**Mitigation:** Add legal disclaimer, require attorney review checkbox

**Risk:** Practitioners may skip touch consent section  
**Mitigation:** Make touch consent mandatory field (cannot skip)

**Risk:** Templates become outdated as regulations change  
**Mitigation:** Version control system, quarterly review process

## Next Steps

1. **LEAD:** Review and approve work order
2. **SOOP:** Design database schema for consent storage
3. **BUILDER:** Build consent generator UI
4. **MARKETER:** Source legal review (external attorney)
5. **INSPECTOR:** QA review of all templates

---

## 📣 PRODDY STRATEGIC ASSESSMENT — COMPLETE (2026-02-17T23:12 PST)

### VERDICT: ✅ APPROVED — HIGH PRIORITY, PHASED BUILD

**Rationale:** This is the single highest cross-segment value feature in the backlog. Both grey market practitioners AND licensed clinics have the same pain: no legally defensible consent templates for psychedelic-specific risks (touch, ontological shock, emergency protocols). This directly addresses Pain Point #2 from VoC research.

### Build vs. Partner Decision: BUILD (Phase 1 MVP only)
- No existing solution covers PAT-specific risks (touch consent, ontological shock, spiritual emergency)
- Legal template marketplaces (LegalZoom, Rocket Lawyer) are generic — no psychedelic context
- **Build an MVP template library first** — do NOT build the full 7-phase system yet

### Phase Prioritization (Revised):
| Phase | Priority | Timeline | Rationale |
|-------|----------|----------|-----------|
| Phase 1: Template Library (OR, CO, Ketamine) | ✅ Ship NOW | Week 1 | Immediate legal defense value |
| Phase 2: Generator UI (Wizard) | ✅ Ship NOW | Week 1-2 | Core UX |
| Phase 3: Touch Consent Module | ✅ Ship NOW | Week 2 | Top VoC pain point |
| Phase 4: Ontological Risk Disclosure | ✅ Ship NOW | Week 2 | Differentiator |
| Phase 5: Emergency Protocol Section | ✅ Ship NOW | Week 2 | Safety requirement |
| Phase 6: Version Control & Audit Trail | ⚠️ Phase 2 | Week 3+ | Important but not blocking |
| Phase 7: Legal Review Integration | ⚠️ Phase 2 | Week 3+ | Nice-to-have at launch |

### External Dependency: Attorney Review
- **Do NOT block the build on attorney review** — ship with clear disclaimer: "Template for documentation purposes only. Consult qualified legal counsel."
- Attorney review can be added as a Phase 2 enhancement

### Routing Decision: → SOOP (schema) then BUILDER
**Update frontmatter:** `owner: SOOP`, `status: 03_BUILD`


---

## 🔍 INSPECTOR PRE-SCREEN BRIEF (2026-02-17T23:15 PST)

**Type:** Pre-build feasibility audit — NOT a post-build QA review.

**INSPECTOR: Review this spec and confirm before BUILDER begins:**

1. **Legal language risk** — Does any template language constitute medical advice? Flag any phrasing that could create liability for PPN.
2. **Schema completeness** — Are `consent_templates`, `consent_versions`, `subject_consents` tables fully specified with correct FK references to existing tables? Verify against live schema.
3. **PDF generation** — Is a PDF library already in the stack? If not, flag as a dependency that needs LEAD decision before build starts.
4. **PHI risk** — Consent forms may contain patient names. Confirm the storage model uses `Subject_ID` only, no free-text PII in database fields.
5. **Scope check** — PRODDY approved Phases 1–5 only. Flag if BUILDER spec includes Phase 6 or 7 (version control, legal review) — those are deferred.

**Output:** Append `## INSPECTOR PRE-SCREEN: [PASS/FAIL]` with specific notes. If PASS → move to `03_BUILD` for BUILDER. If FAIL → move back to `01_TRIAGE` for LEAD.
