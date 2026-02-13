# 💰 **PPN MONETIZATION STRATEGY**

**Document Type:** Business Architecture  
**Version:** 1.0  
**Date:** 2026-02-10  
**Status:** Implementation Ready

---

## 🎯 **EXECUTIVE SUMMARY**

PPN Research Portal is a **for-profit venture** with three distinct revenue streams designed to create a sustainable, high-growth business model. The strategy balances immediate cash flow (Clinic Commander), high retention (Risk Management Engine), and long-term unicorn potential (Wisdom Trust).

**Target ARR (Year 1):** $2.4M–$6M  
**Target ARR (Year 3):** $15M–$50M  
**Unicorn Trigger:** Wisdom Trust dataset sales (Year 4+)

---

## 💳 **REVENUE STREAM 1: CLINIC COMMANDER**

### **Product Description**
A white-labeled B2B SaaS dashboard for clinic owners to:
- Track unit economics (revenue per session, cost per patient)
- Monitor clinical outcomes (remission rates, safety events)
- Benchmark against global network averages
- Generate compliance reports for audits

### **Pricing Tiers**

| Tier | Monthly Price | Annual Price | Features |
|------|--------------|--------------|----------|
| **Starter** | $500/mo | $5,000/yr (2 months free) | 1 location, 5 clinicians, basic analytics |
| **Professional** | $1,200/mo | $12,000/yr | 3 locations, 15 clinicians, advanced analytics, API access |
| **Enterprise** | $2,000/mo | $20,000/yr | Unlimited locations, white-label branding, dedicated support |

### **Revenue Projections**

**Year 1 (Conservative):**
- 20 Starter clinics × $500 = $10,000/mo
- 10 Professional clinics × $1,200 = $12,000/mo
- 2 Enterprise clinics × $2,000 = $4,000/mo
- **Total MRR:** $26,000/mo
- **Total ARR:** $312,000

**Year 3 (Growth):**
- 100 Starter × $500 = $50,000/mo
- 50 Professional × $1,200 = $60,000/mo
- 10 Enterprise × $2,000 = $20,000/mo
- **Total MRR:** $130,000/mo
- **Total ARR:** $1.56M

### **Key Metrics to Display**
- Revenue per clinical hour
- Patient acquisition cost (PAC)
- Lifetime value (LTV)
- Remission rate vs. network average
- Safety event rate (per 1,000 sessions)
- Insurance claim denial rate

### **Technical Implementation**

**Database Schema:**
```sql
-- Subscription management
CREATE TABLE subscriptions (
  subscription_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id BIGINT REFERENCES sites(site_id),
  tier TEXT CHECK (tier IN ('starter', 'professional', 'enterprise')),
  status TEXT CHECK (status IN ('active', 'past_due', 'canceled', 'trialing')),
  mrr DECIMAL(10,2), -- Monthly recurring revenue
  billing_cycle TEXT CHECK (billing_cycle IN ('monthly', 'annual')),
  stripe_subscription_id TEXT UNIQUE,
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Usage tracking for metered billing
CREATE TABLE usage_metrics (
  metric_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES subscriptions(subscription_id),
  metric_type TEXT, -- 'clinicians', 'locations', 'api_calls'
  value INTEGER,
  recorded_at TIMESTAMP DEFAULT NOW()
);
```

**RLS Policies:**
- Site admins can view their own subscription
- Network admins can view all subscriptions
- Only network admins can modify subscriptions

---

## 🛡️ **REVENUE STREAM 2: RISK MANAGEMENT ENGINE**

### **Product Description**
Exclusive group malpractice insurance for PPN members who use the safety protocol builder. This creates a **retention lock** via high switching costs and addresses the #1 practitioner fear: liability.

### **Pricing Model**

| Coverage Level | Monthly Premium | Annual Premium | Coverage Limit |
|----------------|----------------|----------------|----------------|
| **Basic** | $200/mo | $2,000/yr | $1M per occurrence |
| **Standard** | $350/mo | $3,500/yr | $2M per occurrence |
| **Premium** | $500/mo | $5,000/yr | $5M per occurrence + legal defense |

**Requirements:**
- Must use PPN Protocol Builder for all sessions
- Must log all adverse events within 24 hours
- Must complete quarterly safety training

### **Revenue Projections**

**Year 1:**
- 50 practitioners × $200 = $10,000/mo
- **Total ARR:** $120,000

**Year 3:**
- 200 Basic × $200 = $40,000/mo
- 100 Standard × $350 = $35,000/mo
- 50 Premium × $500 = $25,000/mo
- **Total MRR:** $100,000/mo
- **Total ARR:** $1.2M

### **Retention Lock Mechanism**
- **Switching Cost:** Losing insurance coverage mid-year
- **Data Lock-In:** Historical safety records stored in PPN
- **Compliance Requirement:** Insurance requires PPN usage
- **Network Effect:** Larger network = lower premiums (group rate)

### **Technical Implementation**

**Database Schema:**
```sql
CREATE TABLE insurance_policies (
  policy_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  coverage_level TEXT CHECK (coverage_level IN ('basic', 'standard', 'premium')),
  status TEXT CHECK (status IN ('active', 'lapsed', 'pending', 'canceled')),
  premium_amount DECIMAL(10,2),
  coverage_limit BIGINT, -- in dollars
  policy_start_date DATE,
  policy_end_date DATE,
  underwriter TEXT, -- Partner insurance company
  policy_number TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Claims tracking
CREATE TABLE insurance_claims (
  claim_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id UUID REFERENCES insurance_policies(policy_id),
  incident_date DATE,
  claim_amount DECIMAL(12,2),
  status TEXT CHECK (status IN ('filed', 'under_review', 'approved', 'denied', 'settled')),
  resolution_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Integration Points:**
- Link to `log_safety_events` table
- Automatic claim filing from adverse event logs
- Compliance dashboard showing protocol builder usage %

---

## 🧠 **REVENUE STREAM 3: WISDOM TRUST**

### **Product Description**
De-identified, aggregated Real-World Evidence (RWE) datasets sold to:
- Pharmaceutical companies (clinical trial design)
- Regulatory agencies (FDA, EMA)
- Academic researchers (publications)
- Insurance companies (actuarial modeling)

### **Pricing Model**

| Dataset Type | Price Range | Minimum Records |
|--------------|-------------|-----------------|
| **Snapshot** (single indication) | $50K–$100K | 1,000 records |
| **Longitudinal** (multi-year outcomes) | $200K–$500K | 5,000 records |
| **Custom Query** (bespoke analysis) | $100K–$1M | Varies |
| **Annual License** (ongoing access) | $500K–$2M/yr | 10,000+ records |

### **Revenue Projections**

**Year 1:** $0 (cold start, data accumulation phase)

**Year 3:**
- 2 Snapshot datasets × $75K = $150K
- 1 Longitudinal dataset × $300K = $300K
- **Total:** $450K (one-time)

**Year 5 (Unicorn Phase):**
- 10 Snapshot datasets × $100K = $1M
- 5 Longitudinal datasets × $400K = $2M
- 3 Annual Licenses × $1M = $3M
- **Total:** $6M/year

### **Data Privacy & Compliance**

**De-identification Process:**
1. Remove all PHI/PII (names, DOB, addresses)
2. Replace Subject IDs with randomized tokens
3. Aggregate to minimum cell size (n ≥ 10)
4. Apply differential privacy techniques
5. HIPAA Expert Determination review

**Legal Framework:**
- Data Use Agreements (DUAs) with buyers
- IRB approval for research use
- GDPR compliance (for EU data)
- FDA 21 CFR Part 11 compliance (electronic records)

### **Technical Implementation**

**Database Schema:**
```sql
CREATE TABLE data_export_requests (
  request_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_organization TEXT,
  dataset_type TEXT,
  indication_filter TEXT[], -- e.g., ['Depression', 'PTSD']
  date_range_start DATE,
  date_range_end DATE,
  min_record_count INTEGER,
  price DECIMAL(12,2),
  status TEXT CHECK (status IN ('pending', 'approved', 'delivered', 'canceled')),
  dua_signed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Audit trail for data exports
CREATE TABLE data_export_audit (
  audit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES data_export_requests(request_id),
  records_exported INTEGER,
  export_date TIMESTAMP,
  exported_by UUID REFERENCES auth.users(id),
  file_hash TEXT, -- SHA-256 of exported file
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Export API:**
```typescript
// POST /api/v1/wisdom-trust/export
{
  "indication": "Depression",
  "substance": "Psilocybin",
  "date_range": {
    "start": "2024-01-01",
    "end": "2025-12-31"
  },
  "fields": ["age", "sex", "dosage", "outcome_phq9", "adverse_events"],
  "aggregation": "individual" | "cohort",
  "format": "csv" | "json" | "parquet"
}
```

---

## 📊 **COMBINED REVENUE PROJECTIONS**

### **Year 1 (Launch)**
| Stream | ARR | % of Total |
|--------|-----|------------|
| Clinic Commander | $312K | 72% |
| Risk Management | $120K | 28% |
| Wisdom Trust | $0 | 0% |
| **TOTAL** | **$432K** | 100% |

### **Year 3 (Growth)**
| Stream | ARR | % of Total |
|--------|-----|------------|
| Clinic Commander | $1.56M | 52% |
| Risk Management | $1.2M | 40% |
| Wisdom Trust | $450K (one-time) | 8% |
| **TOTAL** | **$3.21M** | 100% |

### **Year 5 (Unicorn Phase)**
| Stream | ARR | % of Total |
|--------|-----|------------|
| Clinic Commander | $5M | 45% |
| Risk Management | $3M | 27% |
| Wisdom Trust | $6M | 28% |
| **TOTAL** | **$14M** | 100% |

---

## 🚀 **GO-TO-MARKET STRATEGY**

### **Phase 1: Clinic Commander (Months 1-6)**
1. **Beta Launch:** 10 pilot clinics (free for 3 months)
2. **Case Studies:** Document ROI (time saved, revenue increase)
3. **Sales Funnel:** Webinars, demos, free trials
4. **Target:** 20 paying customers by Month 6

### **Phase 2: Risk Management (Months 7-12)**
1. **Partner with Underwriter:** Negotiate group rates
2. **Compliance Dashboard:** Build insurance requirement tracker
3. **Launch:** Offer to existing Clinic Commander customers first
4. **Target:** 50 policies by Month 12

### **Phase 3: Wisdom Trust (Months 13-24)**
1. **Data Accumulation:** Reach 10,000 de-identified records
2. **Regulatory Approval:** IRB, HIPAA Expert Determination
3. **Pilot Sale:** First dataset to academic institution
4. **Target:** $100K in dataset sales by Month 24

---

## 💻 **TECHNICAL REQUIREMENTS**

### **Payment Integration**
- **Provider:** Stripe (recommended) or Paddle
- **Features Needed:**
  - Subscription management
  - Metered billing (for API calls)
  - Dunning management (failed payments)
  - Invoice generation
  - Tax calculation (Stripe Tax)

### **Billing Dashboard**
- View current subscription tier
- Upgrade/downgrade options
- Usage metrics (clinicians, locations, API calls)
- Invoice history
- Payment method management

### **Admin Tools**
- Subscription override (for custom deals)
- Refund processing
- Churn analysis dashboard
- MRR/ARR tracking
- Cohort retention analysis

---

## 📈 **SUCCESS METRICS**

### **Clinic Commander**
- **MRR Growth Rate:** 15% month-over-month
- **Churn Rate:** < 5% monthly
- **Customer Acquisition Cost (CAC):** < $2,000
- **LTV:CAC Ratio:** > 3:1
- **Net Revenue Retention:** > 110%

### **Risk Management**
- **Policy Activation Rate:** > 30% of Clinic Commander customers
- **Claims Ratio:** < 10% (low claims = profitable)
- **Retention Rate:** > 95% annually
- **Premium Growth:** 20% year-over-year

### **Wisdom Trust**
- **Records Accumulated:** 10,000 by Year 2
- **Dataset Sales:** 2 per year by Year 3
- **Average Sale Price:** $200K+
- **Buyer Retention:** 50% annual license renewal

---

## 🎯 **NEXT STEPS**

### **Immediate (This Week)**
1. ✅ Create pricing page redesign
2. ✅ Build subscription database schema
3. ✅ Design bulk data upload system
4. ⏳ Integrate Stripe API

### **Short-Term (This Month)**
1. Build billing dashboard
2. Create upgrade/downgrade flows
3. Implement usage tracking
4. Design insurance policy management UI

### **Medium-Term (This Quarter)**
1. Launch Clinic Commander beta
2. Partner with insurance underwriter
3. Build data export API for Wisdom Trust
4. Create sales collateral (decks, case studies)

---

**End of Monetization Strategy Document**
