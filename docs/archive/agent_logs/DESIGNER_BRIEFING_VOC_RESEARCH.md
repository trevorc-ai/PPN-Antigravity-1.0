# 🎨 DESIGNER BRIEFING: VOC RESEARCH & COMPONENT STRATEGY
## Voice-of-Customer Insights for UI/UX & Landing Page Copy

**To:** DESIGNER  
**From:** LEAD  
**Date:** 2026-02-12 01:30 PST  
**Priority:** HIGH  
**Context:** VoC research for demo prospects (JAllen & BLJensen)

---

## 📋 EXECUTIVE SUMMARY

**What This Is:**
Voice-of-Customer research for two practitioners who will see our demo. Their pain points and language should inform our UI/UX decisions and landing page copy.

**Why This Matters:**
- These are real prospects (not hypothetical personas)
- Their language reveals what resonates vs. what confuses
- Their pain points show which features to emphasize
- Their objections show which trust signals we need

**Action Required:**
- Review VoC research (`.agent/research/VoC - JAllen and BLJensen.md`)
- Audit landing page copy against VoC language
- Identify component gaps (what's missing to address their needs)
- Propose new components if needed

---

## 🎯 TARGET PRACTITIONERS

### **Bridger Lee Jensen**
**Role:** Entheogenic religion operator (psilocybin ceremonies)  
**Location:** Utah  
**Context:** Legal conflict with law enforcement (raid, seizure, criminal charges)

**Top Pain Points:**
1. Law enforcement intrusion risk (seizure of substances and records)
2. Legitimacy and trust gap (licensed vs. unlicensed debate)
3. Safety and screening standards ("what does 'safe' actually mean?")
4. Documentation that protects, not exposes

**Language He Uses:**
- "Religious freedom," "sacrament," "entheogenic"
- "Controlled environment," "screening," "integration"
- "Safe supervised experience"
- "Seizure of scriptures" (his records were seized)

**What He Needs to See:**
- ✅ No PHI architecture (can't be seized)
- ✅ Safety documentation (proves he's not reckless)
- ✅ Legitimacy signals (not hype, not loopholes)

---

### **Dr. Jason Allen**
**Role:** Evidence-based supplements + clinical research  
**Location:** Reasonable Remedies  
**Background:** Epidemiology, public health, clinical research

**Top Pain Points:**
1. Consumer mistrust and misinformation fatigue
2. Quality and substantiation problems
3. Need to translate research into operational decisions

**Language He Uses:**
- "Evidence-based," "epidemiology," "clinical research"
- "Public health," "substantiation"
- "Quality control," "formulation"

**What He Needs to See:**
- ✅ Evidence-based decision support (not anecdotes)
- ✅ Network data (real-world evidence)
- ✅ Quality metrics (not marketing hype)

---

## 🔥 CROSS-CUTTING THEMES (Both Practitioners)

### **Theme 1: Risk and Defensibility**
**VoC Quote:**
> "What is my malpractice exposure if something goes wrong?"

**Implication for UI/UX:**
- Emphasize **audit-ready documentation**
- Show **proactive risk assessment** (not reactive)
- Highlight **no PHI architecture** (zero seizure risk)

**Component Needs:**
- ✅ SafetyRiskMatrix (already built) - shows proactive assessment
- ✅ SafetyBenchmark (already built) - proves defensibility
- 🟡 **NEW:** "Audit Trail" component showing documentation history
- 🟡 **NEW:** "Compliance Dashboard" showing regulatory alignment

---

### **Theme 2: Measurement Without Bureaucracy**
**VoC Quote:**
> "How do we measure progress without burdening staff and patients?"

**Implication for UI/UX:**
- Emphasize **automatic calculations** (zero extra work)
- Show **real-time insights** (not manual reporting)
- Highlight **structured data** (no free-text burden)

**Component Needs:**
- ✅ Protocol Builder (already built) - structured data capture
- ✅ SafetySurveillance (already built) - automatic alerts
- 🟢 **GOOD:** Current design minimizes manual entry
- 🟡 **CONSIDER:** "Time Saved" metric on Dashboard

---

### **Theme 3: Trust Signals**
**VoC Quote:**
> "The Bridger-related backlash shows how quickly credibility collapses when the public senses ambiguity about credentials or intent."

**Implication for UI/UX:**
- Emphasize **transparency** (no black boxes)
- Show **governance** (clear boundaries)
- Highlight **standards** (not hype)

**Component Needs:**
- 🟡 **NEW:** "Data Governance" explainer component
- 🟡 **NEW:** "How We Calculate Safety Scores" tooltip
- 🟡 **NEW:** "Network Standards" reference panel
- 🟡 **CONSIDER:** "Trust Center" page (like Stripe's)

---

### **Theme 4: Evidence-Based Practice**
**VoC Quote:**
> "We need to prove this works in our real patients, not just in studies."

**Implication for UI/UX:**
- Emphasize **real-world evidence** (not lab studies)
- Show **network benchmarks** (not single-site anecdotes)
- Highlight **outcomes data** (not process metrics)

**Component Needs:**
- ✅ SafetyBenchmark (already built) - network comparison
- ✅ ComparativeEfficacyPage (already built) - outcomes data
- 🟢 **GOOD:** Current analytics focus on outcomes
- 🟡 **CONSIDER:** "Evidence Base" tooltip on each metric

---

## 📝 LANDING PAGE COPY AUDIT

### **Current Copy Issues (Based on VoC):**

**❌ AVOID:**
- "Alternatives to CoStar" → Wrong analogy (real estate data)
- "Revolutionary" → Triggers hype skepticism
- "Unlock insights" → Vague, not specific
- "Transform your practice" → Overused, not credible

**✅ USE INSTEAD:**
- "Defensible documentation" → Addresses legal anxiety
- "Evidence-based practice support" → Matches their language
- "Audit-ready safety metrics" → Specific, credible
- "Network benchmarking" → Unique value proposition

---

### **Recommended Copy Framework:**

**Hero Section:**
```
OLD: "Transform Your Psychedelic Practice"
NEW: "Defensible Documentation for Psychedelic Practitioners"

OLD: "Unlock insights from your clinical data"
NEW: "Prove safety. Reduce risk. Benchmark performance."
```

**Value Propositions:**
```
1. "No PHI, No Seizure Risk"
   → Addresses Bridger's law enforcement anxiety

2. "Evidence-Based Decision Support"
   → Addresses Dr. Allen's misinformation fatigue

3. "Automatic Safety Monitoring"
   → Addresses both practitioners' measurement burden

4. "Network Benchmarking"
   → Unique competitive advantage
```

**Social Proof:**
```
OLD: "Join hundreds of practitioners"
NEW: "14 sites. 10,247 protocols. Zero HIPAA breaches."
```

---

## 🎨 COMPONENT RECOMMENDATIONS

### **Priority 1: CRITICAL (Build Now)**

#### **1. "No PHI Explainer" Component**
**Why:** Both practitioners obsess over legal exposure  
**Where:** Landing page hero, Dashboard onboarding  
**Content:**
- "What is No PHI architecture?"
- "Why it protects you from seizure risk"
- "How we ensure data privacy"

**Design:**
- Glassmorphic card with shield icon
- Expandable accordion (don't overwhelm)
- Link to full "Data Governance" page

**Copy:**
> "Your documentation protects you, it doesn't expose you. We use aggregated, de-identified data only. No patient names, no DOB, no addresses. If law enforcement seizes your records, they get statistics—not patient identities."

---

#### **2. "Audit Trail" Component**
**Why:** Practitioners need defensible documentation  
**Where:** Protocol Builder, Safety pages  
**Content:**
- Who logged what, when
- What safety assessments were run
- What alerts were triggered and resolved

**Design:**
- Timeline view (vertical)
- Color-coded by event type (log, alert, resolution)
- Exportable to PDF for legal defense

**Copy:**
> "Every action is documented. Every assessment is timestamped. Every alert is tracked. If you're ever questioned, you can prove you monitored safety proactively."

---

#### **3. "Evidence Base" Tooltips**
**Why:** Dr. Allen needs substantiation, not claims  
**Where:** Every metric on Dashboard and Analytics  
**Content:**
- How the metric is calculated
- What data sources are used
- What the benchmark represents

**Design:**
- Hover tooltip (don't clutter UI)
- "Learn more" link to methodology page
- Icon: info circle or question mark

**Example:**
> **Safety Score: 92/100**  
> ℹ️ *Calculated from adverse event rate (2.3%) vs. network average (3.1%). Based on 127 protocols across 14 sites with N ≥ 10.*

---

### **Priority 2: HIGH (Build This Week)**

#### **4. "Time Saved" Metric**
**Why:** Addresses "measurement without bureaucracy" pain  
**Where:** Dashboard, Analytics  
**Content:**
- "You've saved X hours vs. manual tracking"
- "Automatic calculations: X metrics updated"
- "Zero manual reports generated"

**Design:**
- Small stat card (like existing KPI cards)
- Clock icon
- Subtle animation on update

**Copy:**
> "You've saved 12 hours this month. We calculated 47 safety metrics automatically from your protocol logs. Zero manual reports required."

---

#### **5. "Network Standards" Reference Panel**
**Why:** Proves they're operating within community norms  
**Where:** Safety pages, Analytics  
**Content:**
- What the network average is
- What "good" performance looks like
- What "needs improvement" means

**Design:**
- Sidebar panel (collapsible)
- Color-coded ranges (green/yellow/red)
- Link to full methodology

**Copy:**
> **Network Standards (N=14 sites)**  
> Excellent: < 1.5% adverse event rate  
> Good: 1.5% - 2.5%  
> Average: 2.5% - 3.5%  
> Needs Improvement: > 3.5%

---

#### **6. "Compliance Dashboard" Widget**
**Why:** Shows regulatory alignment (especially for Oregon programs)  
**Where:** Dashboard  
**Content:**
- Required documentation: ✅ Complete
- Safety reporting: ✅ Up to date
- Adverse event tracking: ✅ Active

**Design:**
- Checklist style (visual progress)
- Green checkmarks for complete items
- Yellow warnings for missing items

**Copy:**
> **Regulatory Compliance**  
> ✅ Adverse event reporting (last 7 days)  
> ✅ Safety screening documentation  
> ✅ Session logs up to date  
> ⚠️ Quarterly review due in 14 days

---

### **Priority 3: MEDIUM (Build Next Week)**

#### **7. "Trust Center" Page**
**Why:** Addresses credibility and transparency concerns  
**Where:** Footer link, About page  
**Content:**
- How we protect data
- How we calculate metrics
- How we ensure quality
- Who we are (team, credentials)

**Design:**
- Full page (like Stripe's Trust Center)
- Sections: Security, Privacy, Methodology, Team
- Downloadable PDFs for each section

**Copy:**
> **Our Commitment to Your Safety**  
> We built PPN Research Portal to solve a problem we experienced firsthand: how do you prove safety and quality without creating legal exposure? Here's how we do it.

---

#### **8. "How This Helps You" Contextual Hints**
**Why:** Practitioners need to understand "why this matters"  
**Where:** Every major feature  
**Content:**
- One-sentence explanation of benefit
- Link to use case or case study

**Design:**
- Subtle hint text (gray, small font)
- Icon: lightbulb or target
- Dismissible (don't annoy power users)

**Example:**
> **SafetyRiskMatrix**  
> 💡 *This shows which protocols are high-risk before you run the session. Proactive risk assessment reduces malpractice exposure.*

---

## 🚨 ANTI-PATTERNS TO AVOID

Based on VoC research, these patterns will **HURT** credibility:

### **❌ DON'T:**

1. **Hype Language**
   - "Revolutionary," "game-changing," "transform"
   - **Why:** Triggers misinformation fatigue (Dr. Allen)
   - **Use Instead:** "Evidence-based," "audit-ready," "defensible"

2. **Vague Claims**
   - "Unlock insights," "empower your practice"
   - **Why:** Doesn't address specific pain points
   - **Use Instead:** "Reduce malpractice risk," "prove safety"

3. **Feature-First Messaging**
   - "We have 47 analytics dashboards!"
   - **Why:** Practitioners care about outcomes, not features
   - **Use Instead:** "Catch safety issues before they become catastrophes"

4. **Spiritual/Mystical Framing**
   - "Journey," "transformation," "awakening"
   - **Why:** Triggers legitimacy skepticism (Bridger's backlash)
   - **Use Instead:** "Clinical," "evidence-based," "standardized"

5. **Black Box Metrics**
   - "Your safety score is 92" (with no explanation)
   - **Why:** Erodes trust (Dr. Allen needs substantiation)
   - **Use Instead:** "Your safety score is 92 (calculated from...)"

---

## 📊 COPY TESTING FRAMEWORK

### **Test Every Claim Against VoC:**

**Before Publishing:**
1. Does this address a specific pain point from VoC?
2. Does this use language they actually use?
3. Does this provide proof, not just claims?
4. Does this reduce anxiety or increase it?

**Example:**

**❌ BAD:**
> "Transform your practice with AI-powered insights!"

**VoC Test:**
- Pain point? ❌ No (they don't want "transformation")
- Their language? ❌ No (they don't say "AI-powered")
- Proof? ❌ No (vague claim)
- Reduces anxiety? ❌ No (increases skepticism)

**✅ GOOD:**
> "Prove safety with network-benchmarked adverse event tracking. No PHI, no seizure risk."

**VoC Test:**
- Pain point? ✅ Yes (legal exposure, safety documentation)
- Their language? ✅ Yes ("prove safety," "adverse events")
- Proof? ✅ Yes (specific feature: network benchmarking)
- Reduces anxiety? ✅ Yes (addresses seizure risk)

---

## 🎯 ACTIONABLE NEXT STEPS FOR DESIGNER

### **Immediate (This Session):**
1. [ ] Read full VoC research (`.agent/research/VoC - JAllen and BLJensen.md`)
2. [ ] Audit landing page hero copy against VoC language
3. [ ] Identify top 3 copy changes for landing page

### **This Week:**
4. [ ] Design "No PHI Explainer" component
5. [ ] Design "Evidence Base" tooltip pattern
6. [ ] Design "Audit Trail" component
7. [ ] Update landing page copy (hero, value props, social proof)

### **Next Week:**
8. [ ] Design "Time Saved" metric widget
9. [ ] Design "Network Standards" reference panel
10. [ ] Design "Compliance Dashboard" widget
11. [ ] Create "Trust Center" page wireframe

### **Ongoing:**
12. [ ] Test all copy against VoC framework (before publishing)
13. [ ] Collect practitioner feedback on new components
14. [ ] Iterate based on demo responses

---

## 📁 REFERENCE MATERIALS

### **VoC Research:**
- **File:** `.agent/research/VoC - JAllen and BLJensen.md`
- **Key Sections:**
  - Person-by-person VoC (lines 32-113)
  - Cross-cutting themes (lines 115-154)
  - Outcome and transformation map (lines 201-346)

### **Demo Strategy:**
- **File:** `DEMO_STRATEGY_PHASE1_VOC_ALIGNED.md`
- **Key Sections:**
  - Segment alignment (shows what features solve which pains)
  - Demo script (shows effective messaging)
  - Objection handling (shows trust signals needed)

### **Existing Components to Leverage:**
- `SafetyRiskMatrix` - Already addresses proactive risk assessment
- `SafetyBenchmark` - Already addresses defensibility
- `SafetySurveillance` - Already addresses real-time monitoring
- `GlassmorphicCard` - Good for "No PHI Explainer"
- `AdvancedTooltip` - Good for "Evidence Base" tooltips

---

## 🎨 DESIGN PRINCIPLES FROM VOC

### **1. Transparency Over Mystery**
**VoC Insight:** Practitioners distrust black boxes  
**Design Implication:** Show how metrics are calculated  
**Pattern:** Tooltips, methodology links, "Learn more" expandables

### **2. Proof Over Claims**
**VoC Insight:** Misinformation fatigue is real  
**Design Implication:** Every claim needs evidence  
**Pattern:** "Based on X protocols across Y sites" subtext

### **3. Defensibility Over Convenience**
**VoC Insight:** Legal anxiety trumps ease-of-use  
**Design Implication:** Emphasize audit trails and documentation  
**Pattern:** Timestamps, user attribution, export buttons

### **4. Proactive Over Reactive**
**VoC Insight:** Practitioners want to prevent problems, not just respond  
**Design Implication:** Show risk assessment before sessions  
**Pattern:** Warning badges, risk scores, "Review before session" CTAs

### **5. Standards Over Opinions**
**VoC Insight:** Practitioners need to prove they're within community norms  
**Design Implication:** Show network benchmarks prominently  
**Pattern:** Percentile rankings, "vs. network average" comparisons

---

## ✅ SUCCESS METRICS

### **How to Know This Is Working:**

**Short-Term (During Demo):**
- [ ] Practitioners say "this solves my problem" (not "cool feature")
- [ ] Zero confusion about "no PHI" architecture
- [ ] At least one asks "how is this calculated?" (shows trust in transparency)

**Medium-Term (After Demo):**
- [ ] Both practitioners agree to pilot
- [ ] Both use safety features weekly
- [ ] Both provide testimonials using VoC language

**Long-Term (After Launch):**
- [ ] Landing page conversion rate > 5% (practitioner signups)
- [ ] Zero objections about data privacy in sales calls
- [ ] Practitioners refer other practitioners (trust signal)

---

## 🚀 FINAL NOTES

**Key Insight:**
Phase 1 Safety Features are a **perfect product-market fit** for these practitioners. Our job is to make that obvious through UI/UX and copy.

**Design Philosophy:**
- Lead with their pain (not our features)
- Use their language (not marketing speak)
- Prove claims (not just state them)
- Reduce anxiety (not increase it)

**Remember:**
Every component, every tooltip, every piece of copy should answer:
> "How does this help me avoid legal exposure, prove safety, and operate within community standards?"

If it doesn't answer that question, it's not aligned with VoC.

---

**Status:** ✅ Ready for DESIGNER review  
**Priority:** 🔴 HIGH - Demo prospects are real  
**Next:** DESIGNER acknowledges and begins component design 🎨
