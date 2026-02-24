---
id: WO-306
title: "FacilitatorOutcomeProfile — Private Practitioner Self-Performance Analytics"
status: 01_TRIAGE
owner: LEAD
created: 2026-02-21
created_by: PRODDY
failure_count: 0
priority: P2
tags: [analytics, facilitator, practitioner, performance, private, opt-in, sensitive]
depends_on: [WO-303 OutcomeBenchmarkRibbon, WO-302 InsightFeedPanel]
parent: null
user_prompt: |
  PRODDY: "Facilitator experience level is the highest-signal clinical variable in the 
  entire dataset and it's being treated as optional. In every naturalistic psychedelic 
  therapy study, facilitator training level accounts for as much variance in outcomes 
  as substance type and dosage. This is the single most important quality improvement 
  signal for a clinic director — and for a practitioner who wants to grow."
---

# WO-306: FacilitatorOutcomeProfile — Private Practitioner Self-Performance Analytics

**Owner: LEAD → DESIGNER → BUILDER**  
**Priority: P2 — Creates internal champion/expansion conversations inside practices**  
**Sensitivity: HIGH — This data is deeply personal. Get the framing right or it destroys trust.**

---

## PRODDY STRATEGIC BRIEF

### The Domain Insight
In every published naturalistic psychedelic therapy study that controls for facilitator variables, the facilitator accounts for as much outcome variance as the substance itself. This is not speculative — it's established in the literature (Brennan et al., 2023; Garcia-Romeu et al., 2021).

The implication: a clinic director who can see that their most experienced facilitator achieves 73% response rates vs. their newest facilitator's 44% rate has actionable intelligence worth tens of thousands of dollars in CPD investment, protocol refinement, and supervision hours. No other platform surfaces this.

### The Critical Framing Risk
If this feature reads like a report card, it will trigger defensive reactions and create churn. Facilitators who feel judged will convince their clinic director to cancel PPN.

**Non-negotiable framing rules:**
1. **Always lead with strengths.** Show what the facilitator is doing well before showing gaps.
2. **Never compare to named colleagues.** Compare to anonymized network averages, never to another identified practitioner.
3. **Always attribute gaps to growth opportunity, not failure.** "Patients with high ACE scores appear to follow a longer integration arc — consider CPD in trauma-informed care."
4. **Private by default.** This data is only visible to the individual practitioner. Clinic directors can see aggregate (not individual facilitator) data only.
5. **Supervised sharing is opt-in.** The practitioner can choose to share their profile with a named supervisor. This is the expansion path — clinics adopt PPN's supervision model.

---

## PRODUCT SPECIFICATION

### Access Model
- **Visible to:** Individual practitioner only (viewing their own data)
- **Clinic director access:** Aggregate only — "Clinic average vs. network average" — no individual facilitator breakdown
- **Supervisor sharing:** Opt-in toggle: "Share with [Supervisor Name]" → generates a shareable snapshot (requires target user to be in the same practice)
- **Location:** Analytics page → "My Performance" tab (separate from the clinic-wide analytics)

---

### Section 1: Profile Card Header
```
┌─────────────────────────────────────────────────────────────┐
│ MY FACILITATOR PROFILE                          [PRIVATE]   │
│ Based on 34 sessions · 28 patients · 18 months of data     │
│                                                             │
│ Primary modalities: Psilocybin (62%) · Ketamine (38%)      │
│ Primary conditions: PTSD (44%) · Depression (33%) · Mixed  │
└─────────────────────────────────────────────────────────────┘
```

---

### Section 2: Outcome Signature (Your Strengths)
Radar chart — 6 dimensions, scored vs. clinic average AND network average:
- Response Rate (% patients achieving CMC threshold)
- Remission Rate
- Documentation Completeness
- Integration Session Completion
- Follow-up Retention (% of patients with 30-day data)
- Safety Profile (AE rate — lower is better, normalized)

**Always annotate the practitioner's highest-scoring dimension prominently:**
> *"Your follow-up retention (84%) is in the top 20% of the PPN network. This is associated with stronger long-term outcome maintenance in published literature."*

---

### Section 3: Condition-Modality Outcome Matrix
Small heatmap: rows = conditions (PTSD, MDD, AUD, etc.), columns = modalities (Psilocybin, Ketamine, MDMA). Cell value: response rate. Cell color: diverging scale (violet ← low → amber → high). Only show cells with N ≥ 3 (lower k-anon threshold for personal data — practitioner is viewing their own).

Any cell that's ≥10 points below clinic average: shows "Growth Opportunity" label.
Any cell that's ≥10 points above clinic average: shows "Your Strength" label.

---

### Section 4: Growth Intelligence (CPD Recommendations)
Rule-based, not AI-generated. Examples:

**If PTSD response rate < 60% AND modality = MDMA:**
> *"Patients with PTSD treated with MDMA appear to respond well to extended integration windows (8+ sessions). Consider CPD in trauma-informed MDMA-assisted therapy. MAPS offers a 40-hour certification course."*

**If documentation completeness < 70%:**
> *"Complete session documentation is associated with 23% higher follow-up rates in the network. Enabling session note templates could reduce documentation time while improving completeness."*

**If AE rate > network average:**
> *"Your adverse event rate is above the network average. Review your pre-session screening protocol and consider cross-referencing the PPN Interaction Checker for all patients."*

Each recommendation links to a resource (CPD course, PPN feature, published paper).

---

### Section 5: Supervised Sharing (Expansion Path)
Toggle: "Share a snapshot with my supervisor"
- Generates a read-only URL valid for 7 days
- Snapshot includes: Outcome Signature radar + Condition-Modality matrix only
- Does NOT share: individual patient data, Growth Intelligence (GPD recommendations)
- Supervisor sees: practitioner's aggregate profile vs. clinic average

This is the **expansion vector**: once a clinic director sees that PPN supports professional development tracking, they upgrade from Solo to Practice tier to get supervision workflow features.

---

## TECHNICAL IMPLEMENTATION

### New Page/Tab: Analytics → "My Performance" tab
### New Component: `src/components/analytics/FacilitatorOutcomeProfile.tsx`
### RLS Policy: SELECT allowed WHERE user_id = auth.uid() ONLY (practitioner sees only their own sessions)

### Data Scope (all queries scoped to authenticated `user_id`)
```typescript
// All queries must scope to current authenticated user
const { data } = await supabase
  .from('log_clinical_records')
  .select('...')
  .eq('clinician_user_id', currentUserId); // enforced at DB via RLS
```

---

## ACCEPTANCE CRITERIA
- [ ] RLS enforced: practitioner can ONLY see their own session data in this view
- [ ] Clinic director access: aggregate performance only, no individual breakdown
- [ ] "My Performance" tab is separate from the clinic-wide Analytics view
- [ ] Radar chart shows 6 dimensions vs. clinic average AND network average
- [ ] Condition-Modality heatmap shows only cells with N ≥ 3
- [ ] Strength label and Growth Opportunity label shown on matrix
- [ ] CPD recommendations are rule-based (no AI calls), always constructive framing
- [ ] Supervisor sharing generates a time-limited read-only URL
- [ ] No PHI in shared snapshot
- [ ] [PRIVATE] badge visible in profile header
- [ ] k-anon note shown: "Based on N={X} sessions"
- [ ] Fonts ≥ 12px

## CRITICAL DESIGN REVIEW
DESIGNER must submit framing copy for all "Growth Opportunity" and "Strength" labels to PRODDY for review before INSPECTOR pass. The words used here can make or break practitioner trust.

## ROUTING
LEAD → DESIGNER (framing-heavy — must review copy) → BUILDER → INSPECTOR → PRODDY (copy review)
