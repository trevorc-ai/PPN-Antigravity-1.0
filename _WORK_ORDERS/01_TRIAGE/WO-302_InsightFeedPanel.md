---
id: WO-302
title: "InsightFeedPanel — Rule-Based Actionable Clinical Intelligence Cards"
status: 01_TRIAGE
owner: LEAD
created: 2026-02-21
created_by: PRODDY
failure_count: 0
priority: P1
tags: [analytics, insights, clinical-intelligence, actionable, rule-engine, dashboard]
parent: null
blocks: [WO-303, WO-304]
user_prompt: |
  "Create them all, and then we'll start with the first one."
  PRODDY identified that the analytics layer stops one step short of clinical decision support.
  The practitioner sees data but the system doesn't tell them what to do about it.
  InsightFeedPanel converts PPN from a passive dashboard into an active clinical intelligence system.
---

# WO-302: InsightFeedPanel — Rule-Based Actionable Clinical Intelligence Cards

**Owner: LEAD → DESIGNER → BUILDER**
**Priority: P1 — Highest product differentiation move available**
**Blocks: Must be built before Network Intelligence page can be meaningfully used**

---

## PRODDY STRATEGIC BRIEF

### Problem Statement
Every dashboard shows you a number. PPN must tell you what to do with it.

Currently the Analytics page surfaces metrics and benchmark comparisons — but leaves the practitioner to draw their own clinical conclusions. This is passive intelligence. It is what every other platform does.

The `InsightFeedPanel` moves PPN from **passive dashboard** to **active clinical intelligence system** — the platform's single biggest product differentiation opportunity.

### The Core Insight
The practitioner's workflow question is never "what is my response rate?" — it is always "what should I do differently?" If PPN cannot answer the second question, it is a report viewer, not an intelligence platform.

### Value Proposition
> *"3 of your 7 non-responders had incomplete integration sessions. Clinics averaging ≥4 post-session integration meetings show 71% response rates in published literature. Suggested: Review integration protocol for the patients listed below."*

This is the insight no EMR, no Excel export, and no competitor platform can generate. It requires knowing the practitioner's data, the published literature, and the causal relationship between protocol adherence and outcomes simultaneously.

---

## PRODUCT SPECIFICATION

### Component: `InsightFeedPanel`
**Location:** Right column panel on Analytics page (collapsible on mobile), or dedicated "Intelligence" tab

### Insight Card Structure
Each card has:
```
[SEVERITY BADGE] Category Label
Headline (specific number + comparison)
Body (2–3 sentences with causal hypothesis)
[TAKE ACTION] button → routes to relevant page/workflow
[DISMISS] link
Source annotation: "Based on N={X} patients, {Y} sessions · {cite if applicable}"
```

### Severity Levels (text labels — no color-only status)
| Badge | Trigger Condition | Examples |
|-------|-------------------|---------|
| `[SAFETY]` | PHQ-9 item 9 ≥ 2; CAPS-5 increase > 15 pts; >30 days no follow-up post-session | Patient safety flags |
| `[SIGNAL]` | Statistically meaningful pattern detected (N ≥ 5, p-equivalent threshold) | Outcome trend changes |
| `[OPPORTUNITY]` | Performance above/below benchmark by meaningful margin | Protocol optimization |
| `[REVIEW]` | Data completeness below 60%; attrition spike detected | Documentation gaps |

### Rule Library — Phase 1 (Launch with these 8 rules)

#### Rule 1: Integration Dropout Correlation
- **Trigger:** Response rate < benchmark AND avg integration sessions < 3 per patient
- **Insight:** "Your response rate is {X}% vs. {benchmark}% in published literature. {N} of your {Y} non-responders completed fewer than 3 integration sessions. Clinics achieving ≥4 integration sessions show {Z}% response rates in real-world data."
- **Action:** → Open Integration Sessions view filtered to non-responders
- **k-anon guard:** N ≥ 5 patients required

#### Rule 2: Long-Duration Follow-Up Loss
- **Trigger:** Any patient with session logged but no follow-up assessment in > 30 days
- **Insight:** "Patient SBJ-{XXXX} has had no documented follow-up in {N} days since their session. Protocol recommendation: 30-day reassessment."
- **Action:** → Open patient Wellness Journey → schedule follow-up
- **k-anon guard:** Single-patient — no k-anon required (practitioner's own patient)

#### Rule 3: Substance-Condition Mismatch Signal
- **Trigger:** One substance shows ≥1.5× response rate vs. another for same condition, N ≥ 5 per group
- **Insight:** "Your ketamine patients are responding {X}× better for anxiety vs. depression. Your current case mix is {Y}% depression-focused. Based on your clinic's own outcomes, anxiety referrals may yield stronger results."
- **Action:** → View Patient Galaxy filtered by substance + indication
- **k-anon guard:** N ≥ 5 per subgroup

#### Rule 4: Documentation Quality Decay
- **Trigger:** Overall documentation completeness score drops >15 pts over prior 4-week window
- **Insight:** "Your documentation completeness dropped from {X}% to {Y}% in the past 4 weeks. Incomplete records prevent accurate outcome tracking and benchmark comparison."
- **Action:** → View Documentation Quality breakdown
- **k-anon guard:** Aggregate — k-anon applies

#### Rule 5: Benchmark Outperformance
- **Trigger:** Response rate > published benchmark by meaningful margin (Hedges' g > 0.2 above benchmark)
- **Insight:** "Your psilocybin response rate ({X}%) outperforms the MAPS Phase 3 benchmark ({Y}%) by {Z} percentage points. This is a [STRONG SIGNAL] result worth preserving in protocol documentation."
- **Action:** → Export Clinic Performance Summary
- **k-anon guard:** N ≥ 5

#### Rule 6: Safety Event Spike
- **Trigger:** AE rate in past 30 days > 2× prior 30-day baseline
- **Insight:** "Adverse event rate has doubled in the past 30 days ({X} events vs. {Y} prior period). Review safety logs for any protocol or staffing changes that may correlate."
- **Action:** → View Safety Log
- **Severity:** `[SAFETY]`

#### Rule 7: Non-Responder Cluster
- **Trigger:** ≥3 consecutive non-responders with same modality
- **Insight:** "{N} consecutive patients treated with {modality} have not yet achieved clinical response. Consider: protocol review, dosing adjustment consultation, or referral for integrative support."
- **Action:** → View Protocol Efficiency filtered by modality
- **k-anon guard:** N ≥ 5 total patients

#### Rule 8: Baseline Severity Mismatch
- **Trigger:** Practice baseline severity (avg instrument score) > 1.5 SD above published benchmark baseline
- **Insight:** "Your patients start significantly more severe (avg {instrument} = {X}) than the {study} benchmark population (avg = {Y}). Your outcome comparisons should account for this higher baseline severity — your clinic may be achieving better-than-apparent results."
- **Action:** → View Global Benchmark Intelligence with severity-adjusted context
- **k-anon guard:** N ≥ 5

---

## PHASED BUILD PLAN

### Phase 1 — Static Rule Engine (BUILDER)
- Implement rules 1–8 as TypeScript functions in `src/services/insightEngine.ts`
- Each rule function returns: `{ severity, headline, body, actionRoute, sourceNote, n }`
- All rules enforce k-anonymity guard before returning
- Null return = no card generated (don't show the empty container)

### Phase 2 — UI Component (DESIGNER + BUILDER)
- `InsightFeedPanel.tsx` in `src/components/analytics/`
- Cards rendered with animation (fade-in stagger, no bouncing)
- Dismissible (persisted to localStorage, cleared on next data refresh)
- Responsive: right column on xl screens, collapsible accordion on mobile

### Phase 3 — Email Digest Hook (BUILDER — deferred)
- Weekly digest email: top 3 insight cards from the prior week
- Requires email service integration (future sprint)

---

## ACCEPTANCE CRITERIA
- [ ] `src/services/insightEngine.ts` exports all 8 rule functions with TypeScript types
- [ ] Every rule function calls `requireKAnonymity()` for population-level rules
- [ ] Every card has [SEVERITY] text badge — no color-only status indicators
- [ ] Insight cards show source annotation with N count
- [ ] `[TAKE ACTION]` button routes to correct page
- [ ] Dismiss state persists in localStorage
- [ ] No PHI displayed — patient references use Subject_ID only
- [ ] Fonts ≥ 12px throughout
- [ ] Loading skeleton shown while rules evaluate
- [ ] Empty state shown gracefully if no rules trigger (< 5 patients)

## ROUTING
- This ticket → **LEAD** for architecture review and DESIGNER assignment
- Then: **DESIGNER** → UI spec for InsightFeedPanel card design
- Then: **BUILDER** → `insightEngine.ts` + `InsightFeedPanel.tsx` implementation

## STRATEGIC NOTE FROM PRODDY
> This is the feature that separates PPN from every other clinical platform in the space. Every competitor shows you a number. PPN tells you what to do about it. Build this right, and it becomes the primary reason practitioners renew.
