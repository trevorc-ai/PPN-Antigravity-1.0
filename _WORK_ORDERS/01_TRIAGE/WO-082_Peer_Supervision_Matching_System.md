---
id: WO-082
status: 01_TRIAGE
priority: P2 (High)
category: Feature
audience: Provider-Facing
implementation_order: 9
owner: PRODDY
failure_count: 0
---

# Peer Supervision Matching System

## LEAD ARCHITECTURE (2026-02-17 15:26 PST)

**Strategic Concern:** This is a **P2 HIGH feature** with 7 phases spanning 3-4 weeks (120-160 hours). Before committing engineering resources, we need PRODDY to validate:

1. **Network Effects Risk:** Matching systems require critical mass. Do we have enough practitioners to make this viable in Month 1?
2. **Infrastructure Dependencies:** Requires video conferencing (Zoom/Google Meet API), payment processing (Stripe), real-time messaging. Do we have these integrations ready?
3. **Phase Prioritization:** Which phases deliver immediate value? Can we ship a simple "practitioner directory" MVP before building the full matching algorithm?
4. **Competitive Landscape:** Do existing peer supervision platforms exist? Build vs. partner decision?

**Technical Constraints (if approved):**
- Database schema: `practitioner_profiles`, `supervision_matches`, `circles`, `circle_members`, `forum_posts`, `elder_directory`
- Matching algorithm: Weighted scoring (experience, skill gaps, modality, timezone)
- Video integration: Zoom/Google Meet API
- Payment processing: Stripe (10% platform fee)
- Messaging: Real-time chat for dyads/circles
- Moderation: PHI detection, content flagging

**Routing:** Moving to `01_TRIAGE` for PRODDY strategic review before architecture.

---


## User Request

Build a peer supervision matching algorithm and private case consultation forums to address practitioners' isolation and "post-certification cliff."

## Context

**From:** VoC Analysis - Supervision & Mentorship Vacuum (HIGH Pain Point)  
**VoC Quote:** "I feel isolated. The unique challenges of PAT require specialized supervision that's hard to find."

**Strategic Priority:** HIGH - Addresses top 3 pain point (Supervision & Mentorship)

**Market Need:**
- Expensive training programs lack experiential component
- Post-certification "cliff" - practitioners feel abandoned
- No centralized marketplace for peer supervision
- Unique challenges (counter-transference, spiritual emergencies, erotic transference) require specialized supervision

## Acceptance Criteria

### Phase 1: Practitioner Profile System (Week 1)
- [ ] Build practitioner profile with supervision preferences
- [ ] Experience level (novice <1 year, intermediate 1-3 years, experienced 3+ years)
- [ ] Modalities (psilocybin, MDMA, ketamine, LSD, ayahuasca)
- [ ] Practice setting (clinical, religious, underground, hybrid)
- [ ] Supervision needs (clinical safety, spiritual/somatic, business/operations, ethics)
- [ ] Availability (weekly, bi-weekly, monthly)
- [ ] Timezone and preferred meeting times

### Phase 2: Matching Algorithm (Week 1-2)
- [ ] Build matching algorithm based on complementary skills
- [ ] Match novice with experienced (mentorship model)
- [ ] Match complementary skill gaps:
  - [ ] Psychiatrist (needs spiritual/somatic help) ↔ Legacy Guide (needs medical safety help)
  - [ ] Clinic Operator (needs clinical help) ↔ Clinical Convert (needs business help)
- [ ] Match by modality (psilocybin-focused practitioners)
- [ ] Match by timezone (reduce scheduling friction)
- [ ] Avoid matching competitors (same city, same clinic)

### Phase 3: Dyad Matching (1-on-1 Supervision) (Week 2)
- [ ] Build dyad matching interface
- [ ] Show 3-5 potential matches with compatibility score
- [ ] Display: Name, credentials, experience level, modalities, supervision focus
- [ ] "Request Match" button sends invitation
- [ ] "Accept/Decline" workflow
- [ ] Once matched, create private chat channel
- [ ] Suggest meeting cadence (weekly, bi-weekly, monthly)

### Phase 4: Circle System (Group Supervision) (Week 2-3)
- [ ] Build "Circle" system for 6-8 practitioner cohorts
- [ ] Monthly video call scheduling (integrated with Zoom/Google Meet)
- [ ] Confidentiality agreement (all participants sign)
- [ ] Case presentation template:
  - [ ] Patient demographics (age, gender, indication)
  - [ ] Substance and dosing protocol
  - [ ] Challenge/question for group
  - [ ] What worked, what didn't
- [ ] Rotating facilitator (each member facilitates once per cycle)
- [ ] Circle lifecycle: 6-month commitment, option to renew

### Phase 5: Private Case Consultation Forums (Week 3)
- [ ] Build private, verified forums for case consultation
- [ ] Categories:
  - [ ] Clinical Safety (adverse events, contraindications)
  - [ ] Ethics & Boundaries (touch, transference, dual relationships)
  - [ ] Spiritual Emergencies (psychosis, dissociation, ego death)
  - [ ] Business & Operations (pricing, insurance, legal)
- [ ] Anonymized case posting (no PHI)
- [ ] Upvote/downvote system for helpful responses
- [ ] "Verified Expert" badges for experienced practitioners
- [ ] Moderation: Flag inappropriate content, remove PHI

### Phase 6: Verified "Elder" Directory (Week 3-4)
- [ ] Build directory of highly experienced practitioners (20+ years)
- [ ] Verification via "Lineage/Experience" (not just degrees)
- [ ] Offer paid consultation hours ($150-$300/hour)
- [ ] Booking system (calendar integration)
- [ ] Payment processing (platform takes 10% fee)
- [ ] Reviews and ratings (post-consultation feedback)

### Phase 7: Confidentiality & Trust Mechanisms (Week 4)
- [ ] All participants sign confidentiality agreement
- [ ] Pseudonymity option (use alias, not real name)
- [ ] No PHI allowed (auto-detect and flag)
- [ ] Grievance procedure (report violations)
- [ ] Termination policy (remove violators)

## Technical Notes

**Database Schema:**
- Tables: `practitioner_profiles`, `supervision_matches`, `circles`, `circle_members`, `forum_posts`, `elder_directory`
- Foreign keys: `practitioner_id`, `circle_id`, `match_id`

**Matching Algorithm:**
- Use weighted scoring system:
  - Experience level complementarity: 30%
  - Skill gap complementarity: 30%
  - Modality overlap: 20%
  - Timezone compatibility: 10%
  - Availability overlap: 10%
- Avoid matching:
  - Same clinic (conflict of interest)
  - Same city (competition)
  - Incompatible practice settings (clinical vs. underground)

**Privacy:**
- No PHI in case presentations
- Pseudonymity option for underground practitioners
- Encrypted messaging for dyad/circle communications

## Estimated Effort

**Total:** 3-4 weeks (120-160 hours)
- Phase 1 (Practitioner Profiles): 16-24 hours
- Phase 2 (Matching Algorithm): 24-32 hours
- Phase 3 (Dyad Matching): 16-24 hours
- Phase 4 (Circle System): 24-32 hours
- Phase 5 (Case Consultation Forums): 20-28 hours
- Phase 6 (Elder Directory): 12-16 hours
- Phase 7 (Confidentiality): 8-12 hours

## Dependencies

- Video conferencing integration (Zoom/Google Meet API)
- Payment processing (Stripe for Elder consultations)
- Messaging system (real-time chat for dyads/circles)
- Moderation tools (flag/remove inappropriate content)

## Success Metrics

- [ ] 50% of practitioners create supervision profile within 60 days
- [ ] 30% of practitioners matched with peer supervisor within 90 days
- [ ] 10% of practitioners join a Circle within 90 days
- [ ] Average case consultation response time: <24 hours
- [ ] 90% satisfaction rating for peer supervision matches

## VoC Validation

**User Quote:**
> "There is a strong demand for 'peer supervision' groups where practitioners can speak candidly. The current landscape forces them to rely on informal, often inadequate networks."

**User Quote:**
> "New entrants are desperate for mentorship from 'elders,' but the underground nature of the field's history makes these connections difficult to establish openly."

**Strategic Alignment:**
- Addresses Pain Point #3: Supervision & Mentorship Vacuum (HIGH)
- Supports all 4 Practitioner Archetypes (cross-archetype matching)
- Builds community and reduces practitioner isolation

## Risk Mitigation

**Risk:** PHI leakage in case presentations  
**Mitigation:** Auto-detect PHI, require anonymization, strict moderation

**Risk:** Low adoption (practitioners don't trust platform)  
**Mitigation:** Pseudonymity option, confidentiality agreements, verified badges

**Risk:** Poor matches (algorithm doesn't work)  
**Mitigation:** Allow manual search, user feedback on match quality, iterate algorithm

## Next Steps

1. **LEAD:** Review and approve work order
2. **SOOP:** Design database schema for matching system
3. **BUILDER:** Build matching algorithm and UI
4. **DESIGNER:** Design Circle and forum interfaces
5. **INSPECTOR:** QA review of confidentiality mechanisms
