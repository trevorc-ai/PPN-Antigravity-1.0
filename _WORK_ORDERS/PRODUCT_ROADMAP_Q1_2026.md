# PPN Portal Product Roadmap - Q1 2026

**Last Updated:** February 17, 2026  
**Owner:** LEAD  
**North Star Metric:** Benchmark-ready episodes per month

---

## 📊 Strategic Context

### Voice of Customer Research Findings

Practitioners care about (ranked by importance):

1. **Risk & Defensibility** - Legal exposure, malpractice anxiety, audit readiness
2. **Measurement without Bureaucracy** - Outcomes tracking that doesn't slow clinics down
3. **Trust Signals** - Credibility, credentials, governance transparency
4. **Benchmark Readiness** - "Give-to-get" model requires 5/5 requirements met

### Key VoC Quotes

> "If outcomes are inconsistent, I will be blamed, audited, or sued."

> "We need documentation that protects us, not documentation that creates more exposure."

> "We need to prove this works in our real patients, not just in studies."

> "No contribution = No network benchmarks."

---

## 🎯 Roadmap Themes

### NOW (Feb 17 - Feb 28, 2026) - **Benchmark Enablement**

**Theme:** Ship the 5 core requirements for benchmark-ready episodes

**Objective:** Enable practitioners to achieve "5/5 Benchmark-Ready" status

**Key Deliverables:**
- Safety event capture system (WO-078)
- Risk indicator auto-detection (WO-079)
- Benchmark readiness scoring (WO-080)

**Metric Target:** 80% of active episodes achieve 3/5 benchmark requirements

**Owner:** BUILDER

**Success Criteria:**
- ✅ C-SSRS screening integrated with auto-flagging
- ✅ High-risk alerts trigger push notifications
- ✅ Risk indicators auto-detect PHQ-9 ≥ 20, GAD-7 ≥ 15, PCL-5 ≥ 33
- ✅ Benchmark readiness score displays "X/5 Requirements Met"
- ✅ Clear next steps provided for missing requirements

---

### NEXT (Mar 3 - Mar 21, 2026) - **Core Value Delivery**

**Theme:** Ship features practitioners will use daily (Week 1 value)

**Objective:** Reduce admin burden and increase defensibility

**Key Deliverables:**
- Potency normalizer for dosing consistency (WO-059)
- Crisis logger for incident documentation (WO-060)
- Completeness dashboard for data gap visibility (WO-073)
- Phase 1 baseline assessment wizard (WO-074)
- Grey market phantom shield (WO-062)

**Metric Target:** 50% reduction in time-to-complete baseline assessment

**Owner:** BUILDER

**Success Criteria:**
- ✅ Dosing calculations normalize across substance types
- ✅ Crisis events logged with timestamps and actions taken
- ✅ Completeness dashboard shows % complete for each episode
- ✅ Baseline wizard reduces clicks by 40%
- ✅ Legal exposure mitigation features deployed

---

### LATER (Mar 24 - Apr 18, 2026) - **UX Polish & Retention**

**Theme:** Improve experience and reduce friction

**Objective:** Increase practitioner retention and satisfaction

**Key Deliverables:**
- Privacy-first messaging (WO-051)
- Cockpit mode UI for session monitoring (WO-061)
- Arc of Care UX redesign (WO-065)
- Mini guided tours (WO-066)
- Smart pre-fill system (WO-075)
- Auto-generated narratives (WO-076)
- Exportable audit reports (WO-077)

**Metric Target:** 90% practitioner retention (month-over-month)

**Owner:** BUILDER + DESIGNER

**What must be true first:**
- Benchmark enablement features shipped and stable
- Core value features validated with users
- Design specs approved by DESIGNER

---

## 📋 Prioritization Framework

### Tier 1: Benchmark Enablement (P1 - Critical)
**Impact:** Unlocks network benchmarking (North Star Metric)  
**Effort:** 28-40 hours total  
**Risk:** High - These are non-negotiable requirements

| WO # | Feature | Impact | Effort | Status |
|------|---------|--------|--------|--------|
| 078 | Safety Workflow | 🔴 Critical | 12-16h | 03_BUILD |
| 079 | Risk Indicators | 🔴 Critical | 8-12h | 03_BUILD |
| 080 | Benchmark Scoring | 🔴 Critical | 8-12h | 03_BUILD |

---

### Tier 2: Core Value Delivery (P1 - High)
**Impact:** Week 1 value - features practitioners use immediately  
**Effort:** TBD (requires estimation)  
**Risk:** Medium - Important but not blocking benchmark readiness

| WO # | Feature | Impact | VoC Theme |
|------|---------|--------|-----------|
| 059 | Potency Normalizer | 🟡 High | Safety = Liability reduction |
| 060 | Crisis Logger | 🟡 High | Audit-ready documentation |
| 062 | Grey Market Shield | 🟡 High | Legal exposure mitigation |
| 073 | Completeness Dashboard | 🟡 High | Data gap visibility |
| 074 | Baseline Wizard | 🟡 High | Reduces admin burden |

---

### Tier 3: UX Polish & Retention (P2 - Normal)
**Impact:** Improves experience but doesn't block core value  
**Effort:** TBD (requires estimation)  
**Risk:** Low - Can be deferred if needed

| WO # | Feature | Impact | VoC Theme |
|------|---------|--------|-----------|
| 051 | Privacy Messaging | 🟢 Medium | Trust signals |
| 061 | Cockpit Mode | 🟢 Medium | Session efficiency |
| 064 | Deep Blue Background | 🟢 Medium | Visual consistency |
| 065 | Arc UX Redesign | 🟢 Medium | User flow improvement |
| 066 | Mini Guided Tours | 🟢 Medium | Onboarding improvement |
| 075 | Smart PreFill | 🟢 Medium | Reduces admin burden |
| 076 | Auto Narratives | 🟢 Medium | Documentation efficiency |
| 077 | Audit Reports | 🟢 Medium | Audit-ready exports |

---

### Tier 4: Integration Tasks (P3 - Low)
**Impact:** Technical debt - batch after core features  
**Effort:** Low per task  
**Risk:** Low - Can be batched

Multiple WO-060 through WO-066 integration tickets for Arc of Care component wiring.

**Strategy:** Batch these after Tier 1-2 features are complete.

---

### Tier 5: Design Dependencies (Blocked)
**Impact:** Waiting on design specs  
**Effort:** Unknown  
**Risk:** Medium - Blocked until DESIGNER reviews

| WO # | Feature | Blocker |
|------|---------|---------|
| 052 | Phase 3 Forms | Needs design review |
| 057 | Sidebar Fixes | Needs design review |
| 058B | Wellness Journey UI | Needs design review |

---

## 📈 Success Metrics

### North Star Metric
**Benchmark-ready episodes per month**

### Leading Indicators
- % of episodes with all 5 benchmark requirements met
- Average time to achieve 5/5 benchmark status
- % of practitioners using safety event capture

### Lagging Indicators
- Practitioner retention rate (month-over-month)
- Average episodes per practitioner per month
- Network benchmark participation rate

---

## 🚨 Risk Register

### Risk 1: Benchmark features too complex
**Likelihood:** Medium  
**Impact:** High  
**Mitigation:** Start with simplest implementation, iterate based on feedback

### Risk 2: BUILDER capacity constraints
**Likelihood:** High  
**Impact:** Medium  
**Mitigation:** Ruthlessly prioritize Tier 1, defer Tier 3-5 if needed

### Risk 3: Design bottleneck
**Likelihood:** Medium  
**Impact:** Medium  
**Mitigation:** Route design-dependent tickets to 02_DESIGN early, unblock BUILDER

### Risk 4: Scope creep
**Likelihood:** High  
**Impact:** Medium  
**Mitigation:** Enforce "smallest plan that reduces uncertainty" principle

---

## 🔄 Decision Log

### Decision 1: Prioritize Benchmark Enablement over UX Polish
**Date:** Feb 17, 2026  
**Owner:** LEAD  
**Rationale:** VoC research shows practitioners care about risk/defensibility first, experience second. Benchmark readiness unlocks network effects (give-to-get model).  
**Alternatives Considered:** Ship UX polish first to improve retention  
**Key Risks:** Practitioners may churn if experience is poor  
**Mitigations:** Ship minimum viable UX improvements alongside benchmark features  
**Metrics to Monitor:** Practitioner retention rate, time-to-5/5 benchmark status  
**Review Date:** Feb 28, 2026

### Decision 2: Route all Tier 1 tickets to BUILDER immediately
**Date:** Feb 17, 2026  
**Owner:** LEAD  
**Rationale:** These are non-negotiable requirements with clear specs. No design dependencies.  
**Alternatives Considered:** Wait for user feedback on current features  
**Key Risks:** Building wrong thing, wasted effort  
**Mitigations:** Specs based on VoC research, not assumptions  
**Metrics to Monitor:** % of Tier 1 features used by practitioners  
**Review Date:** Feb 28, 2026

---

## 📅 Timeline

### Week of Feb 17-21, 2026
- **BUILDER:** WO-078 (Safety Workflow) - 3-4 days
- **BUILDER:** WO-079 (Risk Indicators) - 2-3 days
- **Goal:** Ship "2/5 Benchmark-Ready" by end of week

### Week of Feb 24-28, 2026
- **BUILDER:** WO-080 (Benchmark Scoring) - 2-3 days
- **BUILDER:** WO-059 (Potency Normalizer) - 2-3 days
- **Goal:** Ship "3/5 Benchmark-Ready" + potency normalizer

### Week of Mar 3-7, 2026
- **BUILDER:** WO-060 (Crisis Logger) - 2-3 days
- **BUILDER:** WO-073 (Completeness Dashboard) - 2-3 days
- **Goal:** Ship "5/5 Benchmark-Ready" + core value features

### Week of Mar 10-14, 2026
- **BUILDER:** WO-074 (Baseline Wizard) - 2-3 days
- **BUILDER:** WO-062 (Grey Market Shield) - 2-3 days
- **Goal:** Complete Tier 2 features

### Week of Mar 17-21, 2026
- **BUILDER + DESIGNER:** Begin Tier 3 UX polish
- **INSPECTOR:** QA review of all Tier 1-2 features
- **Goal:** Prepare for user testing

---

## 🎓 Lessons Learned

### What's Working
- VoC research provides clear prioritization framework
- Work order system creates accountability and traceability
- Tier-based prioritization prevents scope creep

### What Needs Improvement
- Need better effort estimation for new features
- Design dependencies create bottlenecks
- Integration tasks accumulate as technical debt

### Action Items
1. **BUILDER:** Provide effort estimates for all Tier 2 tickets by Feb 21
2. **DESIGNER:** Review blocked tickets (WO-052, 057, 058B) by Feb 24
3. **LEAD:** Schedule roadmap review with user on Feb 28

---

## 📞 Stakeholder Communication

### Weekly Update Format
**To:** User  
**From:** LEAD  
**Frequency:** Every Friday

**Template:**
- **Shipped This Week:** [List completed features]
- **In Progress:** [List active work orders]
- **Blocked:** [List blockers and mitigation plan]
- **Metrics:** [Benchmark readiness %, practitioner retention %]
- **Next Week:** [Planned work orders]

---

**Status:** Active  
**Next Review:** Feb 28, 2026  
**Questions?** Contact LEAD
