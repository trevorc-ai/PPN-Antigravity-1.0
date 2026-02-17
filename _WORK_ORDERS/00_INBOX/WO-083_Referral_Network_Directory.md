---
id: WO-083
status: 00_INBOX
priority: P3 (Normal)
category: Feature
audience: Provider-Facing
implementation_order: 10
owner: PENDING_LEAD_ASSIGNMENT
failure_count: 0
---

# Referral Network Directory

## User Request

Build a verified directory of prescribers, integration specialists, and support providers to enable cross-referrals and collaborative care.

## Context

**From:** VoC Analysis - Integration Specialist Archetype  
**VoC Quote:** "Integration specialists need frameworks and referral networks. They want tools to track client progress between sessions and connections to prescribers who can handle the medical side of care."

**Strategic Priority:** MEDIUM - Supports Integration Specialist archetype (10% of market) and enables collaborative care model

**Market Need:**
- Integration specialists (bodyworkers, coaches) need prescriber referrals
- Prescribers need integration specialist referrals (to reduce churn)
- No centralized directory for PAT providers
- Scope of practice boundaries require clear role delineation

## Acceptance Criteria

### Phase 1: Provider Directory Schema (Week 1)
- [ ] Build provider directory with verified profiles
- [ ] Provider types:
  - [ ] Prescribers (MD, DO, NP, PA with prescribing authority)
  - [ ] Integration Specialists (LCSW, LMFT, coaches, bodyworkers)
  - [ ] Facilitators (Oregon/Colorado licensed)
  - [ ] Sitters (trained support, non-clinical)
  - [ ] Harm Reduction Specialists (underground, peer support)
- [ ] Profile fields:
  - [ ] Name, credentials, license number (verified)
  - [ ] Practice location (city, state, zip)
  - [ ] Modalities (psilocybin, MDMA, ketamine, etc.)
  - [ ] Services offered (preparation, dosing, integration, harm reduction)
  - [ ] Insurance accepted (if applicable)
  - [ ] Availability (accepting new clients: yes/no)
  - [ ] Contact info (email, phone, website)

### Phase 2: Verification System (Week 1-2)
- [ ] Build verification workflow
- [ ] Verify credentials:
  - [ ] MD/DO: NPI lookup, state medical board
  - [ ] NP/PA: State board verification
  - [ ] LCSW/LMFT: State licensure board
  - [ ] Oregon/Colorado facilitators: State program verification
- [ ] Verification badge (green checkmark)
- [ ] Re-verification annually (license renewal)
- [ ] Unverified providers: "Not yet verified" badge (yellow)

### Phase 3: Search & Filter Interface (Week 2)
- [ ] Build search interface
- [ ] Filter by:
  - [ ] Provider type (prescriber, integration specialist, etc.)
  - [ ] Location (city, state, zip, radius)
  - [ ] Modality (psilocybin, MDMA, ketamine, etc.)
  - [ ] Service type (preparation, dosing, integration)
  - [ ] Insurance accepted (yes/no, specific carriers)
  - [ ] Availability (accepting new clients)
- [ ] Sort by:
  - [ ] Distance (nearest first)
  - [ ] Rating (highest first)
  - [ ] Verified status (verified first)

### Phase 4: Referral Workflow (Week 2-3)
- [ ] Build referral workflow
- [ ] "Refer Patient" button on provider profile
- [ ] Referral form:
  - [ ] Patient demographics (age, gender, indication)
  - [ ] Reason for referral (e.g., "Needs medical clearance," "Needs integration support")
  - [ ] Urgency (routine, urgent, emergency)
  - [ ] Referring provider contact info
- [ ] Referral sent via secure message (HIPAA-compliant)
- [ ] Receiving provider: Accept/Decline referral
- [ ] Track referral status (pending, accepted, declined, completed)

### Phase 5: Collaborative Care Notes (Week 3)
- [ ] Build shared care notes (optional, patient consent required)
- [ ] Patient consents to information sharing between providers
- [ ] Shared notes visible to all providers on care team
- [ ] Notes include:
  - [ ] Session dates and outcomes
  - [ ] Current medications
  - [ ] Safety concerns
  - [ ] Integration progress
- [ ] Audit trail: Who viewed, when, what was shared

### Phase 6: Ratings & Reviews (Week 3-4)
- [ ] Build rating system for providers
- [ ] Only verified providers can leave reviews (prevent fake reviews)
- [ ] Rating categories:
  - [ ] Responsiveness (1-5 stars)
  - [ ] Clinical competence (1-5 stars)
  - [ ] Collaborative care (1-5 stars)
  - [ ] Overall (1-5 stars)
- [ ] Written review (optional, 500 char max)
- [ ] Reviews moderated (remove inappropriate content)

### Phase 7: Insurance & Billing Integration (Week 4)
- [ ] Build insurance directory
- [ ] Providers list accepted insurance carriers
- [ ] Patients search by insurance accepted
- [ ] Display: "In-network" vs. "Out-of-network"
- [ ] Link to insurance verification tools (external)

## Technical Notes

**Database Schema:**
- Tables: `provider_directory`, `provider_verifications`, `referrals`, `shared_care_notes`, `provider_reviews`
- Foreign keys: `provider_id`, `referring_provider_id`, `patient_id` (hashed)

**Verification:**
- Use NPI Registry API for MD/DO/NP/PA verification
- Use state licensure board APIs (where available)
- Manual verification for states without APIs

**Privacy:**
- Referrals contain minimal PHI (age, gender, indication only)
- Shared care notes require explicit patient consent
- Audit trail for all data access

**Scope of Practice:**
- Clear labels: "Prescriber" vs. "Integration Specialist" vs. "Sitter"
- Disclaimers: "Integration specialists cannot prescribe medication"

## Estimated Effort

**Total:** 3-4 weeks (120-160 hours)
- Phase 1 (Directory Schema): 16-24 hours
- Phase 2 (Verification System): 24-32 hours
- Phase 3 (Search & Filter): 16-24 hours
- Phase 4 (Referral Workflow): 20-28 hours
- Phase 5 (Collaborative Care Notes): 20-28 hours
- Phase 6 (Ratings & Reviews): 12-16 hours
- Phase 7 (Insurance Integration): 12-16 hours

## Dependencies

- NPI Registry API (for MD/DO/NP/PA verification)
- State licensure board APIs (for LCSW/LMFT verification)
- Oregon/Colorado state program APIs (for facilitator verification)
- HIPAA-compliant messaging system (for referrals)
- Patient consent management (for shared care notes)

## Success Metrics

- [ ] 200+ verified providers in directory within 90 days
- [ ] 50+ referrals sent within 90 days
- [ ] 80% referral acceptance rate
- [ ] 4.5+ average provider rating
- [ ] 30% of practitioners use directory for referrals

## VoC Validation

**User Quote:**
> "Integration specialists want tools to track client progress between sessions and connections to prescribers who can handle the medical side of care."

**User Quote:**
> "Practitioners need frameworks and referral networks to navigate scope of practice boundaries."

**Strategic Alignment:**
- Supports Practitioner Archetype #3: Integration Specialist (10% of market)
- Supports Practitioner Archetype #1: Clinical Convert (needs integration referrals)
- Reduces patient churn by enabling collaborative care

## Risk Mitigation

**Risk:** Unverified providers pose safety risk  
**Mitigation:** Strict verification process, annual re-verification, user reporting

**Risk:** PHI leakage in referrals  
**Mitigation:** Minimal PHI in referral form, HIPAA-compliant messaging

**Risk:** Low adoption (providers don't list themselves)  
**Mitigation:** Free listing, SEO benefits, referral revenue potential

## Next Steps

1. **LEAD:** Review and approve work order
2. **SOOP:** Design database schema for provider directory
3. **BUILDER:** Build verification system and search interface
4. **MARKETER:** Recruit initial providers for directory
5. **INSPECTOR:** QA review of verification and privacy mechanisms
