---
work_order_id: WO_047
title: Quality Scoring Database Schema
type: BUILD
category: Database
priority: P0 (Week 2)
status: 03_BUILD
created: 2026-02-15T00:00:00-08:00
requested_by: MARKETER
assigned_to: SOOP
assigned_date: 2026-02-15T05:44:00-08:00
estimated_complexity: 7/10
failure_count: 0
---


**From:** MARKETER  
**To:** SOOP (via LEAD triage)  
**Date:** 2026-02-15  
**Priority:** P0 (Week 2 - Required for quality incentives)

---

## User Request

Implement database schema for quality scoring system to support quality-gated data incentives (Bronze/Silver/Gold contributor tiers).

---

## Context

We're implementing a quality-gated incentive system where practitioners earn discounts/free access by submitting high-quality protocols. This prevents data gaming while incentivizing valuable contributions.

**Critical Requirements:**
- RLS policies on all tables (HIPAA compliance)
- No PHI/PII in quality scoring
- Automated validation + peer review + anomaly detection
- Reversible incentives (can lose status if quality drops)

---

## Deliverables Required

### 1. Database Tables (5 new tables)
- `protocol_quality_scores` - Quality scoring (0-100) with Bronze/Silver/Gold tiers
- `validation_rules` - Automated plausibility checks (dose ranges, completeness)
- `peer_reviews` - Peer review system (prevent self-review)
- `contributor_status` - Monthly contributor tier tracking
- `anomaly_detection_logs` - Flag suspicious patterns

### 2. Database Functions
- `calculate_quality_score(protocol_id)` - Auto-calculate quality score
- `update_contributor_status(user_id, month_year)` - Update monthly contributor tier

### 3. RLS Policies
- All tables must have RLS enabled
- Users can view own quality scores
- Only admins/analysts can view anomaly logs

---

## Database Requirements

**Validation Rules:**
- Psilocybin dose: 5-50mg
- Ketamine dose: 0.5-2mg/kg
- PHQ-9 score: 0-27
- Duplicate protocol detection

**Quality Scoring:**
- Completeness (40 pts): All required + optional fields filled
- Clinical Detail (30 pts): Detailed notes, specific outcomes
- Longitudinal Data (20 pts): Follow-up assessments (7-day, 30-day, 90-day)
- Peer Review (10 pts): Flagged as "exceptional" by peers

**Quality Tiers:**
- Gold (90-100): Exceptional, earns free Solo tier
- Silver (75-89): High quality, earns $20/month discount
- Bronze (60-74): Validated, earns $10/month discount

---

## Reference Documents

- [SOOP_HANDOFF.md](file:///Users/trevorcalton/.gemini/antigravity/brain/c052ff96-e92b-47c1-9ee2-b551ce82ef06/SOOP_HANDOFF.md) - Complete schema, functions, RLS policies
- [FINAL_PRICING_BRIEF.md](file:///Users/trevorcalton/.gemini/antigravity/brain/c052ff96-e92b-47c1-9ee2-b551ce82ef06/FINAL_PRICING_BRIEF.md) - Strategy context
- [data_quality_risk_analysis.md](file:///Users/trevorcalton/.gemini/antigravity/brain/c052ff96-e92b-47c1-9ee2-b551ce82ef06/data_quality_risk_analysis.md) - Risk mitigation approach

---

## Acceptance Criteria

✅ All 5 tables created with RLS policies  
✅ Validation rules seeded (psilocybin, ketamine, PHQ-9, duplicates)  
✅ Database functions implemented (calculate_quality_score, update_contributor_status)  
✅ No PHI/PII in any quality scoring tables  
✅ Migration is additive-only (no DROP or ALTER TYPE)  
✅ LEAD approval on schema

---

## Timeline

**Deadline:** Week 2 (by February 29, 2026)  
**Estimated Effort:** 2-3 days

---

## Next Steps After Database Deployment

1. SOOP creates migration script
2. LEAD reviews schema for security/compliance
3. ANALYST defines anomaly detection rules
4. Move to `03_BUILD` for BUILDER to implement quality scoring UI
5. INSPECTOR verifies RLS policies

---

**Status:** Ready for LEAD triage → SOOP assignment  
**Owner:** [PENDING_LEAD_ASSIGNMENT]
