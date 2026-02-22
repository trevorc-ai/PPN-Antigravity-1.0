# 🧠 PROTOCOL BUILDER PHASE 1 - STRATEGIC BRIEF
## Clinical Intelligence Platform

**Date:** February 11, 2026  
**Version:** 1.0 - Strategic Planning Document  
**Status:** Ready for Lead Architect & Partner Review  
**Estimated Timeline:** 3 months to MVP  

---

## 🎯 EXECUTIVE SUMMARY

### **What We're Building:**

> **A real-time clinical intelligence platform that augments practitioner decision-making while simultaneously building the world's largest psychedelic therapy evidence base.**

### **The Problem We're Solving:**

From Dr. Shena (Bend Ketamine Clinic):
- "No common data collection framework across clinics"
- "Impossible to compare protocols or outcomes"
- "Research progress hampered by lack of comparable data"
- **"You hit the nail on the head" - need for common denominator**

### **The Opportunity:**

- **Clinical:** Help practitioners make better, data-driven treatment decisions
- **Research:** Create the world's largest psychedelic therapy dataset
- **Legislative:** "That's how you change the rules of the game" - visual data that policymakers can't ignore
- **Commercial:** First-to-market clinical decision support system for psychedelic therapy

### **The Vision:**

Transform Protocol Builder from a "data entry form" into a "clinical intelligence system" that:
1. Makes data entry effortless (60 sec new patient, 16 sec follow-up)
2. Provides real-time clinical insights (receptor impact, interactions, expected outcomes)
3. Enables benchmarking (patient vs clinic vs network vs worldwide)
4. Builds trust with patients (show them the data driving decisions)
5. Accelerates research (every session becomes a data point)

---

## 📊 WHAT CHANGED & WHY

### **Original Plan (Pre-Shena Feedback):**
- Simple 2-screen data entry form
- Focus: Speed and simplicity
- Goal: Collect structured data for research

### **New Plan (Post-Shena Feedback):**
- 3-tab clinical intelligence platform
- Focus: Speed + real-time analytics + decision support
- Goal: Augment practitioner intelligence while collecting data

### **Why We Changed:**

**Key Insight from Shena:**
> "Research progress is hampered by lack of comparable data. Practitioners want standardized tools and data-driven approaches. That's how you change the legislature and the rules of the game."

**The Realization:**
- We're not just collecting data, we're **empowering practitioners**
- Real-time analytics makes the tool **immediately valuable** (not just for future research)
- Showing patients the data **builds trust** and differentiates clinics
- Visual evidence **drives policy change** faster than anecdotes

---

## 🏗️ PHASE 1 ARCHITECTURE

### **3-TAB DESIGN:**

```
┌─────────────────────────────────────────────────────────┐
│ [1. Patient & Protocol] [2. Clinical Insights] [3. Benchmarking] │
└─────────────────────────────────────────────────────────┘
```

---

### **TAB 1: PATIENT & PROTOCOL** (Data Entry)

**Purpose:** Fast, mobile-optimized protocol entry

**Sections:**
1. **Patient Demographics** (Age, Sex, Weight)
   - Button groups (no typing)
   - Auto-generated anonymous Subject ID
   - Optional fields collapsed by default

2. **Medications & Supplements**
   - Grid of 60 most common medications (organized by category)
   - Multi-select (tap, tap, tap, done)
   - Search bar for uncommon medications
   - Real-time interaction alerts (non-blocking, informational)

3. **Protocol Details**
   - Substance, Dosage, Route, Indication
   - Quick-pick buttons for common choices
   - Smart defaults from last patient (optional)
   - Multi-substance support (Psilocybin + LSD, etc.)

4. **Session Experience**
   - Intensity slider (1-10)
   - Therapeutic value slider (1-10)
   - Touch-optimized for iPad/tablet

**User Actions:**
- New patient: 18 taps, 60 seconds
- Follow-up session: 6 taps, 16 seconds

**Key Features:**
- Auto-advance between sections (no "Continue" buttons)
- Smart defaults (learns from user patterns)
- Real-time validation (dosage safety checks)
- Non-blocking interaction alerts (informational, not mandatory)
- Auto-save and export (PDF, CSV, native share)

---

### **TAB 2: CLINICAL INSIGHTS** (Real-Time Analytics)

**Purpose:** Provide real-time clinical decision support

**Left Panel (40%):**

1. **Current Protocol Summary**
   ```
   38 yr Male, 75kg, Depression (TRD)
   Medications: Lithium, Sertraline
   Proposed: Psilocybin 25mg Oral
   [Edit]
   ```

2. **Receptor Affinity Visualization**
   ```
   5-HT2A  ████████░░ 80%
   5-HT1A  ██████░░░░ 60%
   5-HT2C  ████░░░░░░ 40%
   D2      ██░░░░░░░░ 20%
   ```
   - Static data from scientific literature
   - Instant lookup (no computation)
   - Cached indefinitely

3. **Interaction Alerts**
   ```
   ⚠️ INTERACTION ALERTS
   
   • Lithium may potentiate serotonin activity
     [View Details]
     
   • Sertraline may reduce effect by 30-50%
     [View Details]
   ```
   - Non-blocking (informational only)
   - Links to scientific references
   - No mandatory acknowledgments

**Right Panel (60%):**

1. **Expected Outcomes**
   ```
   BASED ON 247 SIMILAR PATIENTS
   
   PHQ-9 Reduction:
   Similar patients: -8.2 (±3.1)
   Your clinic:      -7.9
   Network avg:      -8.5
   
   Success Rate: 68%
   ├─ Excellent (>10 point drop): 34%
   ├─ Good (5-10 point drop):     41%
   ├─ Moderate (1-5 point drop):  19%
   └─ No improvement:              6%
   ```
   - Matches on: Age, Sex, Weight, Substance, Dosage, Indication
   - Shows sample size prominently
   - Graceful degradation if sample size < 30

2. **Dosage Optimization**
   ```
   Optimal range: 25-27mg
   Your input: 25mg ✓ Optimal
   
   💡 Consider 30mg for SSRI users
   ```
   - Data-driven recommendations
   - Context-aware (considers medications)
   - Non-prescriptive (suggestions only)

3. **Adverse Events**
   ```
   Nausea:  42% (mild, self-limiting)
   Anxiety: 18% (manageable)
   Serious: <1%
   ```
   - Based on similar patient cohort
   - Helps set patient expectations
   - Informs consent process

**Data Updates:**
- Debounced (500ms after user stops typing)
- Cached results for common combinations
- Loading states for slow queries
- Sample size warnings when data is limited

---

### **TAB 3: BENCHMARKING** (Comparisons)

**Purpose:** Compare patient to various cohorts

**Comparison Views:**

1. **Patient vs Clinic**
   ```
   YOUR CLINIC PERFORMANCE
   
   PHQ-9 Improvement:
   This patient (predicted): -8.2
   Clinic average:          -7.9
   Difference:              +0.3 (better)
   ```

2. **Patient vs Network**
   ```
   NETWORK COMPARISON
   
   Sample size: 3,421 psilocybin protocols
   
   PHQ-9 Improvement:
   This patient: -8.2
   Network avg:  -8.5
   Percentile:   48th (median)
   ```

3. **Patient vs Similar Demographics**
   ```
   SIMILAR PATIENT COHORT
   
   Matching criteria:
   - Male, 35-45 yr
   - Depression (TRD)
   - On SSRI + Mood Stabilizer
   - Psilocybin 25-30mg
   
   Sample size: 89 patients, 312 sessions
   
   Outcomes distribution:
   Excellent: 34%
   Good:      41%
   Moderate:  19%
   None:       6%
   ```

4. **Worldwide Data**
   ```
   GLOBAL BENCHMARKS
   
   All psilocybin protocols: 12,847
   This patient vs global:
   PHQ-9 improvement:  -8.2 vs -7.8 (better)
   Success rate:       68% vs 64% (better)
   ```

**Visualizations:**
- Comparison bar charts
- Percentile indicators
- Distribution curves
- Confidence intervals

---

## 🗄️ BACKEND ARCHITECTURE

### **3-TIER CACHING STRATEGY** (Cost Optimization)

#### **TIER 1: STATIC DATA** (Cache Forever)
- Reference tables: substances, routes, indications, interactions
- Receptor affinity data
- Drug interaction database
- **Queries:** Once per user per 30 days
- **Cost:** ~$0.001 per user per month

#### **TIER 2: AGGREGATED DATA** (Materialized Views)
- Pre-computed analytics (outcomes by patient profile)
- Clinic benchmarks
- Network benchmarks
- **Refresh:** Hourly (outcomes), Daily (benchmarks)
- **Queries:** 1-2 simple lookups per protocol entry
- **Cost:** ~$0.10 per 1,000 users per month

#### **TIER 3: USER-SPECIFIC DATA** (Smart Fetching)
- Patient lists
- Clinic stats
- **Queries:** Once on load, once on submit
- **Cost:** ~$0.05 per user per month

### **Total Cost Optimization:**
- **Without optimization:** ~$200/month for 10,000 users
- **With optimization:** ~$25/month for 10,000 users
- **Savings:** $175/month = $2,100/year

---

## 📊 SQL CHANGES REQUIRED

### **NEW TABLES (Materialized Views):**

1. **mv_outcomes_summary**
   - Pre-computed analytics by patient profile
   - Groups by: substance, dosage, age, sex, weight, indication
   - Metrics: sample size, avg improvement, std dev, success rates
   - Refresh: Hourly
   - Purpose: Fast lookup for "Expected Outcomes"

2. **mv_clinic_benchmarks**
   - Clinic performance by substance and indication
   - Metrics: total protocols, avg improvement, success rate
   - Refresh: Daily
   - Purpose: Clinic vs patient comparison

3. **mv_network_benchmarks**
   - Network-wide performance
   - Metrics: total protocols, avg improvement, percentiles
   - Refresh: Daily
   - Purpose: Network vs patient comparison

### **MODIFIED TABLES:**

1. **log_interventions**
   - Add: `sequence_order INT` (for multi-substance protocols)
   - Add: `timing_minutes INT` (when substance was administered)
   - Add: `administration_notes TEXT` (optional context)
   - Purpose: Support Psilocybin + LSD combinations, etc.

### **NEW INDEXES:**
- On materialized views for fast lookups
- On foreign keys for join performance
- On commonly filtered columns (substance_id, indication_id, etc.)

### **SCHEDULED JOBS (pg_cron):**
- Hourly: Refresh `mv_outcomes_summary`
- Daily: Refresh `mv_clinic_benchmarks`, `mv_network_benchmarks`

---

## 🎯 FEATURE FEASIBILITY ANALYSIS

| Feature | Latency | Sample Size Needed | Phase 1? | Rationale |
|---------|---------|-------------------|----------|-----------|
| **Receptor Affinity** | <10ms | N/A (static) | ✅ Yes | Simple lookup, no computation |
| **Drug Interactions** | <50ms | N/A (static) | ✅ Yes | Simple lookup, batch queries |
| **Expected Outcomes** | <100ms | 50-500 | ✅ Yes | Materialized view, fast lookup |
| **Dosage Optimization** | <100ms | 50-500 | ✅ Yes | Same data as outcomes |
| **Benchmarking** | <200ms | 20-100 | ✅ Yes | Pre-computed aggregates |
| **ML Predictions** | 100-500ms | 1,000+ | ❌ Phase 3 | Need longitudinal data |
| **Patient View** | <50ms | N/A | 🟡 Phase 2 | Easy, but not critical for MVP |
| **Multi-Substance** | 200ms-1s | 10-50 | 🟡 Phase 2 | Entry: Yes, Analytics: Limited |

### **Phase 1 Scope (MVP):**
- ✅ Tab 1: Patient & Protocol (data entry)
- ✅ Tab 2: Clinical Insights (real-time analytics)
- ✅ Tab 3: Benchmarking (comparisons)
- ✅ Multi-substance data entry (analytics show "limited data" warnings)

### **Deferred to Phase 2:**
- Patient-facing simplified view (Tab 5)
- Advanced multi-substance analytics (need more data)

### **Deferred to Phase 3-4:**
- ML-powered trajectory predictions (need 1,000+ patients with longitudinal data)

---

## 💰 BUSINESS MODEL & VALUE PROPOSITION

### **Value Propositions:**

**For Practitioners:**
- ⚡ Save time (60 sec → 16 sec follow-ups)
- 🎯 Better outcomes (data-driven decisions)
- 🛡️ Reduced liability (documented evidence-based care)
- 🤝 Patient trust (show them the data)
- 🏆 Competitive advantage (best-in-class care)

**For Clinics:**
- 📊 Benchmarking vs competitors
- 📈 Quality improvement metrics
- 👨‍🏫 Staff training tool
- 🎤 Marketing differentiator
- 📝 Research participation (publications)

**For Researchers:**
- 🗄️ Largest psychedelic therapy dataset
- 🌍 Real-world effectiveness data
- 💡 Hypothesis generation
- 📄 Publication opportunities
- 💰 Grant applications

**For Policymakers:**
- ⚖️ Evidence for legalization
- 🛡️ Safety data
- ✅ Efficacy data
- 💵 Economic impact
- 🏥 Public health outcomes

### **Pricing Tiers (Proposed):**

| Tier | Price | Features | Target |
|------|-------|----------|--------|
| **Free** | $0 | Basic entry, clinic benchmarking, 50 protocols/month | Solo practitioners |
| **Professional** | $99/mo | Full analytics, network benchmarking, unlimited | Individual practitioners |
| **Clinic** | $499/mo | Multi-practitioner, custom reports, API access | Clinics (5-20 practitioners) |
| **Research** | $2,499/mo | Full dataset access, custom queries, export | Research institutions |

---

## 📈 SUCCESS METRICS

### **User Adoption:**
- Year 1: 1,000 practitioners
- Year 3: 10,000 practitioners
- Year 5: 50% of legal psychedelic clinics

### **Data Collection:**
- Year 1: 10,000 protocols
- Year 3: 100,000 protocols
- Year 5: 1,000,000 protocols

### **Clinical Impact:**
- 10% improvement in outcomes (vs baseline)
- 20% reduction in adverse events
- 30% faster time to improvement

### **Legislative Impact:**
- Year 1: Data cited in 10 policy papers
- Year 3: 3 states use data for legalization
- Year 5: Federal rescheduling influenced

---

## 🚀 IMPLEMENTATION ROADMAP

### **PHASE 1: MVP (3 months)**

**Month 1: Backend Foundation**
- Create materialized views
- Set up scheduled refresh jobs
- Modify log_interventions table
- Create indexes
- Test query performance
- **Deliverable:** Backend ready for frontend

**Month 2: Frontend Development**
- Tab 1: Patient & Protocol (data entry)
- Tab 2: Clinical Insights (analytics)
- Tab 3: Benchmarking (comparisons)
- Mobile optimization (iPad/tablet)
- **Deliverable:** Functional UI

**Month 3: Integration & Testing**
- Connect frontend to backend
- Performance optimization
- User testing with beta practitioners
- Bug fixes and refinements
- **Deliverable:** Production-ready MVP

### **PHASE 2: Enhanced Features (3 months)**
- Patient-facing view (Tab 5)
- Barcode medication scanning
- Voice input
- Advanced multi-substance analytics
- **Deliverable:** Enhanced platform

### **PHASE 3: ML & Predictions (6 months)**
- Collect longitudinal data
- Train ML models
- Outcome trajectory predictions
- Optimal dosing algorithms
- **Deliverable:** Predictive intelligence

### **PHASE 4: Scale & Integrate (6 months)**
- EHR integration (Epic, Cerner)
- Mobile apps (iOS, Android)
- Multi-language support
- API for third-party tools
- **Deliverable:** Enterprise platform

---

## ⚠️ RISKS & MITIGATION

### **RISK 1: Insufficient Sample Size**

**Problem:** Not enough data for meaningful analytics initially

**Mitigation:**
- Show sample size prominently
- Graceful degradation ("Limited data: Only 12 similar protocols")
- Broaden matching criteria if no exact matches
- Start with clinic benchmarking (smaller sample needed)
- Network effects: More users = more data = better analytics

**Timeline:** 
- Month 1-3: Limited analytics (small sample)
- Month 6-12: Decent analytics (100-500 protocols)
- Year 2+: Robust analytics (1,000+ protocols)

---

### **RISK 2: Query Performance / Latency**

**Problem:** Real-time analytics might be too slow

**Mitigation:**
- Materialized views (pre-computed aggregates)
- Debouncing (500ms delay after user input)
- Caching (browser + server-side)
- Selective field selection (only fetch needed columns)
- Batch queries (reduce round trips)

**Performance Targets:**
- Tab switch: <200ms
- Data update: <300ms
- Chart render: <100ms

**Fallback:** If still too slow, show "Calculating..." spinner

---

### **RISK 3: Data Quality**

**Problem:** Garbage in, garbage out

**Mitigation:**
- Structured inputs only (no free text)
- Real-time validation (dosage ranges, etc.)
- Required fields enforced
- Outlier detection (flag unusual values)
- Audit trails (track data changes)

**Quality Checks:**
- Sample size thresholds (don't show if N < 5)
- Confidence intervals (show uncertainty)
- Data review by network admins

---

### **RISK 4: Legal / Regulatory**

**Problem:** Collecting data on federally illegal substances

**Mitigation:**
- No PHI/PII collection (anonymous subject IDs)
- No patient names, emails, addresses, DOB
- Aggregated data only for cross-site analytics
- Small-cell suppression (N ≥ 10 rule)
- Legal review before launch

**Compliance:**
- HIPAA-compliant (no identifiers)
- State-legal substances prioritized (ketamine, legal psilocybin)
- Research exemptions for Schedule I data

---

### **RISK 5: Practitioner Adoption**

**Problem:** Practitioners might not use it

**Mitigation:**
- Immediate value (real-time analytics, not just future research)
- Fast data entry (60 sec new, 16 sec follow-up)
- Mobile-optimized (iPad/tablet primary device)
- Training & support (onboarding videos, live demos)
- Incentives (free tier, research credit, publications)

**User Testing:**
- Beta with 10-20 practitioners
- Iterate based on feedback
- Shena demo on Feb 15th (first validation)

---

## 🎯 CRITICAL SUCCESS FACTORS

### **1. Speed**
- Data entry must be <60 seconds (new patient)
- Follow-up must be <20 seconds
- Analytics must load <300ms
- **If it's slow, practitioners won't use it**

### **2. Value**
- Must provide immediate value (not just future research)
- Real-time insights must be actionable
- Benchmarking must be meaningful
- **If it's not useful, practitioners won't use it**

### **3. Simplicity**
- Must be intuitive (no training required)
- Mobile-optimized (iPad/tablet primary)
- No unnecessary complexity
- **If it's confusing, practitioners won't use it**

### **4. Trust**
- Data must be accurate
- Sample sizes must be transparent
- No overpromising ("limited data" warnings)
- **If it's not trustworthy, practitioners won't use it**

### **5. Network Effects**
- More users = more data = better analytics
- Better analytics = more value = more users
- **Must reach critical mass (100+ practitioners) quickly**

---

## 📋 OPEN QUESTIONS & DECISIONS NEEDED

### **1. Multi-Substance Protocols**

**Question:** How do we handle Psilocybin + LSD combinations?

**Current Plan:**
- Allow data entry (multiple rows in log_interventions)
- Show "limited data" warnings (small sample size)
- Build evidence base over time

**Decision Needed:** 
- Do we support this in Phase 1? (Yes, for data entry)
- Do we show analytics? (Yes, with warnings)

---

### **2. Medication Matching Logic**

**Question:** How "similar" is "similar" for medication matching?

**Options:**
1. **Exact match:** Same medications, same dosages (too restrictive)
2. **Class match:** Same drug classes (SSRI vs SSRI) (reasonable)
3. **Any overlap:** At least one medication in common (too broad)

**Current Plan:** Start with class matching, iterate based on data

**Decision Needed:** Confirm this approach

---

### **3. Sample Size Thresholds**

**Question:** What's the minimum sample size to show analytics?

**Options:**
- N ≥ 5 (very permissive, but noisy)
- N ≥ 10 (reasonable for trends)
- N ≥ 30 (statistically significant)

**Current Plan:** 
- Show if N ≥ 5, but with prominent "Limited data" warning
- Highlight when N ≥ 30 ("Statistically significant")

**Decision Needed:** Confirm thresholds

---

### **4. Refresh Frequency**

**Question:** How often do we refresh materialized views?

**Options:**
- Real-time (expensive, unnecessary)
- Hourly (good for outcomes)
- Daily (good for benchmarks)
- Weekly (too stale)

**Current Plan:**
- Outcomes: Hourly
- Benchmarks: Daily

**Decision Needed:** Confirm schedule

---

### **5. Patient-Facing View**

**Question:** Do we include simplified patient view in Phase 1?

**Pros:**
- High value (builds trust)
- Differentiates clinics
- Easy to implement (same data, different UI)

**Cons:**
- Not critical for MVP
- Adds scope to Phase 1

**Current Plan:** Defer to Phase 2

**Decision Needed:** Confirm or override

---

## 🎬 NEXT STEPS

### **Immediate (This Week):**
1. ✅ **DESIGNER:** Complete this strategic brief
2. ⏳ **LEAD:** Review and approve plan
3. ⏳ **PARTNERS:** Strategic review and sign-off
4. ⏳ **LEAD ARCHITECT:** Review SQL requirements
5. ⏳ **DEMO:** Show Shena on Feb 15th (validation)

### **Week 2-4 (Backend Foundation):**
1. Create materialized views
2. Set up scheduled refresh jobs
3. Modify log_interventions table
4. Create indexes
5. Performance testing

### **Month 2 (Frontend Development):**
1. Build Tab 1 (Patient & Protocol)
2. Build Tab 2 (Clinical Insights)
3. Build Tab 3 (Benchmarking)
4. Mobile optimization

### **Month 3 (Integration & Launch):**
1. Connect frontend to backend
2. Beta testing with practitioners
3. Bug fixes and refinements
4. Production launch

---

## 📊 APPENDIX: TECHNICAL SPECIFICATIONS

### **Frontend Stack:**
- React + TypeScript
- Recharts (data visualization)
- TailwindCSS (styling)
- React Query (data fetching & caching)
- Vite (build tool)

### **Backend Stack:**
- Supabase (PostgreSQL)
- PostgREST (auto-generated API)
- pg_cron (scheduled jobs)
- Row Level Security (RLS)

### **Performance Targets:**
- Initial load: <500ms
- Tab switch: <200ms
- Data update: <300ms
- Chart render: <100ms

### **Browser Support:**
- Chrome/Edge (latest 2 versions)
- Safari (latest 2 versions)
- Firefox (latest 2 versions)
- Mobile Safari (iOS 15+)
- Chrome Mobile (Android 10+)

### **Device Support:**
- iPad (primary)
- Android tablets
- Desktop (secondary)
- iPhone (tertiary)

---

## ✅ SIGN-OFF

**This strategic brief represents our complete understanding of Phase 1 scope, technical requirements, risks, and timeline.**

**Approval Required From:**
- [ ] Admin (Product Owner)
- [ ] Lead Architect (Technical Feasibility)
- [ ] Partners (Strategic Alignment)

**Once approved, we proceed to:**
1. SQL migration scripts
2. Frontend development
3. Beta testing
4. Production launch

---

**Document Version:** 1.0  
**Last Updated:** February 11, 2026, 3:21 PM PST  
**Next Review:** After Shena demo (Feb 15, 2026)  

**Questions?** Contact Designer (Antigravity) or Lead Architect

---

**"This is how we change psychedelic therapy forever."** 🧠✨
