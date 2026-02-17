---
work_order_id: WO_048
title: Metrics Tracking & Attribution Plan
type: BUILD
category: Analytics
priority: P0 (Week 2)
status: 03_BUILD
created: 2026-02-15T00:00:00-08:00
requested_by: MARKETER
assigned_to: ANALYST
assigned_date: 2026-02-15T05:44:00-08:00
estimated_complexity: 6/10
failure_count: 0
---


**From:** MARKETER  
**To:** ANALYST (via LEAD triage)  
**Date:** 2026-02-15  
**Priority:** P0 (Week 2 - Required for launch analytics)

---

## User Request

Implement comprehensive metrics tracking for consumer drug checks, practitioner signups, quality scores, and attribution to validate B2B2C pricing strategy.

---

## Context

We're launching a B2B2C pricing model with bottom-up adoption (patients → practitioners). We need data-driven validation of our assumptions:
- Will consumers use the free drug checker?
- Will patients ask practitioners about PPN?
- Will practitioners convert from free to paid?
- Does quality scoring prevent data gaming?

**North Star Metric:** Monthly Active Practitioners (MAP) - Target 100 by Q2 2026

---

## Deliverables Required

### 1. Event Tracking Schema
- Consumer events (drug_check_started, drug_check_completed, drug_check_shared, find_practitioner_clicked)
- Practitioner events (pricing_page_viewed, trial_started, trial_converted, subscription_cancelled)
- Quality events (protocol_submitted, quality_badge_earned, anomaly_detected)

### 2. Attribution Tracking
- UTM parameters (source, medium, campaign)
- Attribution survey on signup ("How did you hear about PPN?")
- Database fields for attribution_source and attribution_details

### 3. Dashboards (4 dashboards)
- Executive Dashboard (MAP, MRR, signups, churn, NPS)
- Marketing Dashboard (drug checks by source, signups by attribution, social shares)
- Quality Dashboard (average quality score, Bronze/Silver/Gold distribution, anomaly flags)
- Funnel Dashboard (consumer → practitioner, trial → paid, protocol → badge)

---

## Key Metrics to Track

**Consumer Metrics:**
- Drug checks completed (daily/weekly/monthly)
- Social shares (Twitter, Reddit)
- "Find a Practitioner" clicks
- Newsletter signups

**Practitioner Metrics:**
- Signups (Solo, Clinic, Enterprise)
- Trial-to-paid conversion rate
- MRR (Monthly Recurring Revenue)
- Churn rate

**Attribution Metrics (CRITICAL):**
- % of practitioners who cite "patient asked me"
- Channel attribution (SEO, Reddit, festivals, MAPS, conferences)

**Quality Metrics:**
- Average quality score (0-100)
- Bronze/Silver/Gold protocol distribution
- Anomaly detection flags (% of submissions)

---

## Reference Documents

- [ANALYST_HANDOFF.md](file:///Users/trevorcalton/.gemini/antigravity/brain/c052ff96-e92b-47c1-9ee2-b551ce82ef06/ANALYST_HANDOFF.md) - Complete event schemas, dashboard specs
- [FINAL_PRICING_BRIEF.md](file:///Users/trevorcalton/.gemini/antigravity/brain/c052ff96-e92b-47c1-9ee2-b551ce82ef06/FINAL_PRICING_BRIEF.md) - Strategy context, success metrics

---

## Acceptance Criteria

✅ Event tracking schema defined for all consumer, practitioner, and quality events  
✅ UTM parameters tracked in database for all signups  
✅ Attribution survey added to signup flow  
✅ 4 dashboards created (Executive, Marketing, Quality, Funnel)  
✅ Weekly automated reports sent to LEAD and MARKETER  
✅ LEAD approval on metrics plan

---

## Timeline

**Deadline:** Week 2 (by February 29, 2026)  
**Estimated Effort:** 2-3 days

---

## Next Steps After Metrics Implementation

1. ANALYST defines event tracking schema
2. Move to `03_BUILD` for BUILDER to implement tracking code
3. ANALYST creates dashboards in Mixpanel/GA4
4. LEAD reviews metrics plan
5. Launch with pricing page

---

**Status:** Ready for LEAD triage → ANALYST assignment  
**Owner:** [PENDING_LEAD_ASSIGNMENT]
