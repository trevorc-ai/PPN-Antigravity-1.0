---
work_order_id: WO_046
title: Pricing Page & Public Drug Checker Design
type: BUILD
category: Marketing
priority: P0 (Week 1)
status: 03_BUILD
created: 2026-02-15T00:00:00-08:00
requested_by: MARKETER
assigned_to: BUILDER
assigned_date: 2026-02-15T10:43:00-08:00
design_completed: 2026-02-15T10:30:00-08:00
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
✅ MARKETER approval on mockups (APPROVED 2026-02-15)

---

## DESIGNER DELIVERABLES (COMPLETED)

**Date Completed:** February 15, 2026  
**Designer:** DESIGNER  
**Status:** Ready for MARKETER Review

### 📦 Design Assets Created

1. **Pricing Page Mockups**
   - Desktop version (1920x1080px)
   - Mobile version (375x812px)
   - 3-tier pricing: Consumer (FREE), Solo ($49/month), Clinic ($149/month)
   - Feature comparison table with sticky header
   - Quality Contributor banner

2. **Public Drug Interaction Checker**
   - Desktop version (1920x1080px)
   - Mobile version (375x812px)
   - Consumer-friendly interface (no medical jargon)
   - Multi-select dropdowns for psychedelics, medications, conditions
   - Color-coded results: 🟢 Safe / 🟡 Caution / 🔴 Dangerous
   - "Find a Practitioner" CTA

3. **Quality Contributor Badges**
   - Bronze Badge (10+ validated protocols/month)
   - Silver Badge (10+ high-quality protocols/month)
   - Gold Badge (5+ exceptional protocols/month → Free Solo tier)
   - Verified Badge (50+ quality protocols lifetime → Featured in directory)

4. **Design Documentation**
   - Complete design specifications
   - Responsive breakpoints
   - User journey mappings
   - Accessibility compliance checklist
   - Badge placement guidelines

### 📄 Documentation Location

**Primary Artifact:** [WO_046_Design_Mockups.md](file:///Users/trevorcalton/.gemini/antigravity/brain/97cd09c0-a0af-4cdf-a8b3-3e451934f180/WO_046_Design_Mockups.md)

This document contains:
- All mockup images embedded
- Complete design system specifications
- Responsive breakpoint guidelines
- User journey documentation
- Accessibility compliance checklist
- Badge tooltip specifications
- Open questions for MARKETER

### ✅ Accessibility Compliance Verified

- [x] All fonts ≥12px (user has color vision deficiency)
- [x] No color-only meaning (icons + text labels used)
- [x] WCAG 2.1 AA contrast ratios (≥4.5:1 for text)
- [x] Touch targets ≥44px (mobile-friendly)
- [x] Keyboard navigation support
- [x] ARIA labels for interactive elements
- [x] Screen reader compatible

### 🔄 Open Questions for MARKETER

1. **Pricing Calculator:** Add calculator for Clinic tier? (e.g., "How many practitioners?")
2. **Email Gate:** Require email for drug checker results? (Pro: lead gen. Con: friction)
3. **"Most Popular" Tag:** Show on Solo tier? (Standard SaaS pattern)
4. **Testimonials:** Add patient + practitioner quotes to pricing page?
5. **Compare Plans Toggle:** Add side-by-side feature comparison?

### 🎯 MARKETER RESPONSE (2026-02-15)

**All questions answered in:** [WO_046_Pricing_Page_Strategy_Recommendations.md](file:///Users/trevorcalton/.gemini/antigravity/brain/86e475ba-7845-45e4-942b-76b154cdc8f7/WO_046_Pricing_Page_Strategy_Recommendations.md)

**Quick Summary:**
1. ✅ **YES** - Add pricing calculator for Clinic tier (Phase 2 - Week 2)
2. ❌ **NO** - Do NOT gate drug checker with email (kills adoption, use soft CTAs instead)
3. ✅ **YES** - Add "Most Popular" tag to Solo tier (Phase 1 - Week 1)
4. ✅ **YES** - Add testimonials (practitioner-focused, strategic placement)
5. ✅ **YES** - Add feature comparison toggle (Phase 1 - Week 1)

**Implementation Priority:**
- **Phase 1 (MVP - Week 1):** Most Popular badge, comparison table, hero testimonial
- **Phase 2 (Week 2):** Pricing calculator, testimonial carousel

**Total Estimated Effort:** 10-12 hours (BUILDER implementation)


---

## Timeline

**Deadline:** Week 1 (by February 22, 2026)  
**Design Completed:** February 15, 2026 ✅  
**Estimated Build Effort:** 2-3 days (BUILDER)

---

## Next Steps After Design

1. ✅ **MARKETER reviews mockups** (APPROVED)
2. ✅ **LEAD approves design direction** (APPROVED)
3. ⏳ **Move to `03_BUILD` for BUILDER implementation** (CURRENT STEP)
4. INSPECTOR verifies accessibility compliance after build

---

**Status:** ✅ Design approved, moving to BUILD  
**Owner:** BUILDER (for implementation)  
**Design Reference:** [WO_046_Design_Mockups.md](file:///Users/trevorcalton/.gemini/antigravity/brain/97cd09c0-a0af-4cdf-a8b3-3e451934f180/WO_046_Design_Mockups.md)

