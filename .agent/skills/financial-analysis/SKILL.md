---
name: financial-analysis
description: ANALYST-owned skill for computing, interpreting, and communicating PPN's financial performance metrics. Covers SaaS unit economics (MRR, ARR, LTV, CAC, churn, NRR), cohort-level revenue analysis, pricing model stress testing, market sizing, and investor-grade KPI dashboards. Use when any financial question, revenue forecast, pricing decision, or business case needs analytical rigor.
---

# 💰 Financial Analysis Skill
**Owner: ANALYST**

> *"A great financial analyst doesn't just report what happened. They tell you exactly why it happened, what's about to happen next, and what one decision would change the outcome."*

---

## 🎯 When to Use This Skill

Activate this skill when:
- Computing MRR, ARR, LTV, CAC, or churn from subscription data
- Evaluating whether a pricing change will increase or decrease total revenue
- Building a market sizing model for investor conversations
- Analyzing which customer cohort generates the most long-term value
- Forecasting revenue under different growth scenarios
- Stress-testing the unit economics of a new tier or add-on feature
- Answering: "Are we pricing correctly?" or "Which customers should we focus on?"

---

## 📐 The PPN SaaS Metrics Stack

### Tier 1 — Revenue Health (Weekly Pulse)

#### 1.1 MRR (Monthly Recurring Revenue)
```
MRR = Σ (active subscriptions × monthly_fee)

MRR Components:
  New MRR      = Revenue from new subscribers this month
  Expansion MRR = Revenue from upgrades (Solo → Clinic → Enterprise)
  Contraction MRR = Revenue lost from downgrades
  Churned MRR  = Revenue lost from cancellations
  Net New MRR  = New + Expansion - Contraction - Churned
```

**PPN MRR Tracking Table (compute monthly):**
| Component | Formula | Target |
|-----------|---------|--------|
| New MRR | new_subs × avg_arpu | Growth engine |
| Expansion MRR | upgrades × delta_price | >15% of New MRR |
| Churn MRR | cancelled_subs × avg_arpu | < 2% of MRR/month |
| Net New MRR | New + Expansion - Contraction - Churn | > 0 always |

---

#### 1.2 ARR (Annual Recurring Revenue)
```
ARR = MRR × 12

NOTE: Only count ARR from committed annual contracts.
      Do not annualize monthly subscribers — that overstates ARR.
```

**PPN ARR Milestones:**
| ARR | Stage | Implication |
|-----|-------|-------------|
| < $100K | Pre-PMF | Prioritize retention, not growth |
| $100K–500K | PMF validation | Prove NRR > 100% |
| $500K–$1M | Growth mode | Hire first AE, build outbound |
| $1M+ | Series A territory | Institutionalize CAC/LTV ratios |

---

#### 1.3 Revenue Recognition by Tier (PPN-Specific)
```
Solo Practitioner: $97/mo or $970/yr (16.7% discount on annual)
Clinic:            $297/mo or $2,970/yr
Enterprise:        Custom — minimum $1,200/mo

Monthly ARPU breakdowns by mix:
  If mix = 70% Solo, 20% Clinic, 10% Enterprise:
  Blended ARPU = (0.70 × $97) + (0.20 × $297) + (0.10 × $1,200)
               = $67.9 + $59.4 + $120 = $247.30

  This is the target ARPU to hit for LTV calculations.
```

---

### Tier 2 — Efficiency Metrics (Monthly Review)

#### 2.1 LTV (Lifetime Value)
```
LTV = ARPU / Churn_Rate_Monthly

Example:
  ARPU = $247, Monthly churn = 2%
  LTV = $247 / 0.02 = $12,350

Gross Margin LTV (preferred for SaaS):
  LTV_GM = (ARPU × Gross_Margin) / Monthly_Churn
         = ($247 × 0.80) / 0.02 = $9,880
```

**PPN LTV Targets by Tier:**
| Tier | Monthly Price | Target Churn | LTV |
|------|--------------|--------------|-----|
| Solo | $97 | 3% | $2,587 |
| Clinic | $297 | 2% | $11,880 |
| Enterprise | $1,200+ | 1% | $96,000+ |

---

#### 2.2 CAC (Customer Acquisition Cost)
```
CAC = Total_Sales_Marketing_Spend / New_Customers_Acquired

Blended CAC = all channels combined
Paid CAC    = only paid channel spend / paid channel customers
Organic CAC = content + SEO cost / organic customers

NOTE: Include fully-loaded costs:
  - Ad spend
  - SDR/AE salaries (prorated to time on acquisition)
  - Marketing tools
  - Event costs
  - NOT: retention, CS, or existing account management
```

**PPN CAC Benchmarks (B2B SaaS, Healthcare vertical):**
| Tier | Typical CAC | Acceptable CAC (3:1 LTV/CAC) |
|------|------------|------------------------------|
| Solo | $150–400 | Up to $862 |
| Clinic | $800–2,500 | Up to $3,960 |
| Enterprise | $5,000–25,000 | Up to $32,000 |

---

#### 2.3 LTV:CAC Ratio (The Core Efficiency Signal)
```
Ratio = LTV / CAC

Interpretation:
  < 1:1   → Destroying value. Emergency stop on paid acquisition.
  1:1–3:1 → Breakeven. Fix before scaling.
  3:1     → Healthy. Standard SaaS benchmark to achieve before Series A.
  5:1+    → Exceptional. Invest more in growth — you're underinvesting.
```

---

#### 2.4 Payback Period (CAC Payback)
```
Payback_Months = CAC / (ARPU × Gross_Margin)

Target: < 12 months for self-serve, < 18 months for enterprise

Example:
  CAC = $800, ARPU = $297, GM = 80%
  Payback = $800 / ($297 × 0.80) = $800 / $237.60 = 3.4 months ← Excellent
```

---

#### 2.5 Churn Analysis (The Single Most Important Metric)

**Churn Types:**
```
Logo Churn    = cancelled accounts / total accounts
Revenue Churn = churned MRR / total MRR (more important)
Net Revenue Retention (NRR) = (MRR_start + Expansion - Contraction - Churn) / MRR_start × 100
```

**NRR Benchmark Targets:**
| NRR | Signal | Action |
|-----|--------|--------|
| < 90% | Leaky bucket — fix product or CS immediately | STOP growing |
| 90–100% | Stable but not compounding | Identify expansion triggers |
| 100–110% | Healthy. Existing customers growing. | Standard growth |
| 110–130% | Strong. Product is creating expansion naturally. | Accelerate |
| > 130% | Elite. Best-in-class (Snowflake, Datadog territory). | Protect moat |

**PPN Churn Risk Signals (flag these weekly):**
```sql
-- Early churn warning: users with declining engagement
SELECT
  user_id,
  site_id,
  subscription_tier,
  last_login,
  sessions_last_30_days,
  sessions_prior_30_days,
  CASE 
    WHEN sessions_last_30_days = 0 AND last_login < NOW() - INTERVAL '14 days' THEN 'CHURN_RISK_HIGH'
    WHEN sessions_last_30_days < sessions_prior_30_days * 0.5 THEN 'CHURN_RISK_MEDIUM'
    ELSE 'HEALTHY'
  END AS churn_risk_label
FROM user_subscriptions
WHERE status = 'active';
```

---

### Tier 3 — Cohort Analysis (The Hidden Truth)

#### 3.1 Revenue Cohort Analysis
Group customers by month they first subscribed. Track their MRR contribution over time. This reveals:
- Whether retention is improving across cohorts (product getting better)
- Which acquisition channel produces the most durable customers
- Whether expansion revenue is emerging naturally

**Cohort table format:**
```
Cohort │ Month 0    │ Month 1   │ Month 3   │ Month 6   │ Month 12
───────┼────────────┼───────────┼───────────┼───────────┼──────────
Jan-25 │ $4,850 (N=23) │ 91% │ 87% │ 82% │ 79%
Feb-25 │ $6,200 (N=31) │ 94% │ 90% │ 85% │ —
Mar-25 │ $5,400 (N=27) │ 93% │ 88% │ — │ —

Reading: Percentage = cohort MRR retained vs. Month 0
```

A healthy SaaS cohort curve flattens — retention stabilizes after Month 3.
A flattening curve → NRR will eventually exceed 100% as expansion accumulates.

---

#### 3.2 Quick-Build Revenue Model (Scenario Planning)

Three scenarios to always run when evaluating a growth lever:

```
CONSERVATIVE CASE:
  Starting MRR: [current]
  Monthly new MRR growth: 5%
  Monthly churn: 3%
  12-month ARR: [compute]

BASE CASE:
  Monthly new MRR growth: 10%
  Monthly churn: 2%
  12-month ARR: [compute]

OPTIMISTIC CASE:
  Monthly new MRR growth: 20%
  Monthly churn: 1.5%
  12-month ARR: [compute]
```

Computing ARR at month T:
```
MRR(T) = MRR(T-1) × (1 + growth_rate) × (1 - churn_rate) + New_MRR
ARR = MRR(12) × 12
```

---

### Tier 4 — Market Sizing (TAM/SAM/SOM)

**For PPN investor presentations:**

#### Bottom-Up Model (Preferred Over Top-Down)

```
Step 1: Count the buyers
  US licensed therapists: ~700,000
  Psychedelic-interested (est. 5%): 35,000
  Currently practicing psychedelic-assisted therapy (est. 20% of interested): 7,000
  
Step 2: Count the dollars
  Solo Practitioner: 7,000 × $97/mo × 12 = $8.1M SAM (addressable today)
  Clinic (est. 15% of 7,000 are group practices): 1,050 × $297/mo × 12 = $3.7M SAM
  
Step 3: Now layer in growth
  MAPS/Lykos MDMA approval pathway: +10,000 therapists to market by 2027
  Oregon psilocybin expansion: +3,000-5,000 facilitators by 2027
  
Step 4: SOM (Serviceable Obtainable via our GTM)
  Year 1 target: 1% of SAM = $118K ARR
  Year 2 target: 5% of SAM = $590K ARR
  Year 3 target: 15% of SAM + expansion = $2M+ ARR
```

**Structure the output for investors:**
```
TAM (Total Addressable Market):
  US behavioral health SaaS: $4.2B (growing 18% YoY)
  
SAM (Serviceable Addressable Market):
  Psychedelic therapy practitioners + clinics today: ~$12M ARR opportunity
  
SOM (Serviceable Obtainable Market):
  Year 1-3 realistic capture: $350K → $2M ARR (PPN-specific)
  
Moat: First-mover with structured outcomes database — replication cost for a competitor
  is 3-5 years of real-world data accumulation. Cannot be bought.
```

---

## 📊 PPN Financial Dashboard KPIs (Required Metrics)

Every financial report must include these in this order:

| # | KPI | How Computed | Frequency | Target |
|---|-----|-------------|-----------|--------|
| 1 | MRR | Sum of active subscription fees | Weekly | Growing |
| 2 | Net New MRR | New + Expansion - Churn | Weekly | > $0 |
| 3 | Churn Rate | Cancelled MRR / Total MRR | Monthly | < 2% |
| 4 | NRR | See formula above | Monthly | > 100% |
| 5 | ARPU | MRR / Active accounts | Monthly | Growing |
| 6 | LTV | ARPU / Churn | Monthly | > 3× CAC |
| 7 | CAC | Marketing spend / New customers | Monthly | < LTV/3 |
| 8 | Payback Period | CAC / (ARPU × GM) | Monthly | < 12 months |
| 9 | Active Users | DAU/MAU ratio | Weekly | > 40% |
| 10 | Trial Conversion Rate | Trials → Paid | Monthly | > 20% |

---

## 🔮 Pricing Analysis Framework

Use when evaluating a pricing change:

### The Revenue Impact Matrix
```
Scenario: Increase Solo Practitioner from $97 → $127/mo

Current:
  100 subscribers × $97 = $9,700 MRR

Price Elasticity Scenarios:
  -5% volume loss:  95 × $127 = $12,065 MRR  (+24.4%) ← Likely
  -10% volume loss: 90 × $127 = $11,430 MRR  (+17.8%)
  -20% volume loss: 80 × $127 = $10,160 MRR  (+4.7%)
  -30% volume loss: 70 × $127 = $8,890 MRR   (-8.4%) ← Break-even threshold

Break-even volume loss = 1 - (Old_Price / New_Price)
                       = 1 - (97/127) = 23.6%

Conclusion: Price increase is revenue-positive unless we lose >23.6% of customers.
For a product with high switching costs and no clear alternative: loss < 10% is realistic.
```

### Van Westendorp Price Sensitivity Meter
Four questions to ask in user research:
1. At what price does [PPN] seem **too expensive**?
2. At what price does [PPN] seem **expensive but worth it**?
3. At what price does [PPN] seem **a good deal**?
4. At what price does [PPN] seem **too cheap to be trustworthy**?

Acceptable Price Range = above "too cheap" and below "too expensive" intersection.

---

## 📋 Financial Analysis Report Template

```
💰 PPN FINANCIAL ANALYSIS | [PERIOD] | Prepared by: ANALYST

REVENUE SNAPSHOT
  MRR:           $[X]  ([+/-X%] vs. prior period)
  ARR (run-rate): $[X]
  ARPU:          $[X]  ([+/-] vs. prior)

GROWTH
  New MRR:        $[X]  ([N] new accounts)
  Expansion MRR:  $[X]  ([N] upgrades)
  Churn MRR:      -$[X] ([N] cancellations, [N] downgrades)
  Net New MRR:    $[X]  TARGET: Positive

RETENTION
  Logo Churn:     [X%]  TARGET: < 2%/mo
  Revenue Churn:  [X%]  TARGET: < 1%/mo
  NRR:            [X%]  TARGET: > 100%

EFFICIENCY
  Blended ARPU:   $[X]
  LTV:            $[X]
  Blended CAC:    $[X]
  LTV:CAC Ratio:  [X]:1  TARGET: > 3:1
  Payback Period: [X] months  TARGET: < 12

SIGNALS
  [STRONG SIGNAL] / [MODERATE SIGNAL] / [WEAK SIGNAL] / [NO SIGNAL]
  [Specific finding + recommended action]

12-MONTH ARR FORECAST
  Conservative: $[X]
  Base Case:    $[X]
  Optimistic:   $[X]
```

---

## 🚫 Financial Analysis Integrity Rules

1. **Never mix cash and accrual without labeling.** State clearly: "These figures are cash-based" or "These figures use revenue recognition."

2. **Never annualize monthly customers.** Annual contract value ≠ MRR × 12 for churn-prone customers.

3. **Never hide churn in blended metrics.** Report gross churn AND net churn separately.

4. **Never state LTV without stating assumptions.** LTV is meaningless without: assumed churn rate, discount rate, and whether it's gross or net of COGS.

5. **Always run the bear case.** If you only present the optimistic scenario, you are not doing financial analysis — you are writing marketing copy.

6. **Never confuse a leading indicator with a lagging one.** Active users and feature engagement are leading indicators. Revenue and churn are lagging. Optimize leading, report lagging.

---

**END OF FINANCIAL ANALYSIS SKILL**
