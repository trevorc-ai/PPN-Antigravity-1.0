---
work_order_id: WO_046
title: Pricing Page & Public Drug Checker Design
type: DESIGN
category: Marketing
priority: P0 (Week 1)
status: 02_DESIGN
created: 2026-02-15T00:00:00-08:00
requested_by: MARKETER
assigned_to: DESIGNER
assigned_date: 2026-02-15T05:44:00-08:00
estimated_complexity: 6/10
failure_count: 0
depends_on: WO-001
---


**From:** MARKETER  
**To:** DESIGNER (via LEAD triage)  
**Date:** 2026-02-15  
**Priority:** P0 (Week 1 - Critical for MVP launch)

---

## User Request

Design the pricing page and public drug interaction checker for the B2B2C pricing model with consumer freemium and practitioner paid tiers.

---

## Context

We've finalized a B2B2C pricing strategy where:
- **Consumers** get free safety tools (drug checker, playlists, directory) → marketing channel
- **Practitioners** pay for analytics/compliance ($49-$149/month) → revenue source
- **Quality Contributors** earn discounts through quality data submission

This is **critical for MVP launch** (Week 1) and creates the foundation for our bottom-up adoption strategy.

---

## Deliverables Required

### 1. Pricing Page Redesign
- Hero section with 3-tier pricing (Consumer Free, Solo $49, Clinic $149)
- Feature comparison table (sticky header)
- Quality Contributor section (Bronze/Silver/Gold badges)
- FAQ accordion
- Mobile-responsive layout

### 2. Public Drug Interaction Checker
- Consumer-friendly interface (no medical jargon)
- Dropdown selectors (psychedelic, medications, conditions)
- Results display (🟢 Safe / 🟡 Caution / 🔴 Dangerous)
- Educational content + "Find a Practitioner" CTA
- Social sharing buttons

### 3. Quality Contributor Badges
- 4 badge designs (Bronze, Silver, Gold, Verified)
- Tooltip specs for each badge
- Placement guidelines (profile, directory, protocol submission)

---

## Design Requirements

**Design System:** Glassmorphism (existing)  
**Colors:** Primary #6366f1, Accent #f59e0b, Success #10b981, Warning #f59e0b, Danger #ef4444  
**Typography:** Inter, minimum 12px (CRITICAL: user has color vision deficiency)  
**Accessibility:** WCAG 2.1 AA, no color-only meaning, keyboard navigation

---

## Reference Documents

- [DESIGNER_HANDOFF.md](file:///Users/trevorcalton/.gemini/antigravity/brain/c052ff96-e92b-47c1-9ee2-b551ce82ef06/DESIGNER_HANDOFF.md) - Complete wireframes, user journeys, specs
- [FINAL_PRICING_BRIEF.md](file:///Users/trevorcalton/.gemini/antigravity/brain/c052ff96-e92b-47c1-9ee2-b551ce82ef06/FINAL_PRICING_BRIEF.md) - Strategy context
- [Pricing.tsx](file:///Users/trevorcalton/Desktop/PPN-Antigravity-1.0/src/pages/Pricing.tsx) - Current implementation (needs redesign)

---

## Acceptance Criteria

✅ Pricing page mockups (desktop + mobile)  
✅ Public drug checker mockups (desktop + mobile)  
✅ Quality contributor badge designs (all 4 variants)  
✅ All fonts ≥12px  
✅ No color-only meaning (text labels + icons)  
✅ Glassmorphism design system applied  
✅ MARKETER approval on mockups

---

## Timeline

**Deadline:** Week 1 (by February 22, 2026)  
**Estimated Effort:** 2-3 days

---

## Next Steps After Design

1. MARKETER reviews mockups
2. LEAD approves design direction
3. Move to `03_BUILD` for BUILDER implementation
4. INSPECTOR verifies accessibility compliance

---

**Status:** Ready for LEAD triage → DESIGNER assignment  
**Owner:** [PENDING_LEAD_ASSIGNMENT]
