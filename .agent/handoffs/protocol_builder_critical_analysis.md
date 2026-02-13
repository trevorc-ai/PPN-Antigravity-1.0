# Protocol Builder - Critical Analysis & Redesign Requirements

**Date:** Feb 13, 2026, 10:34 AM  
**Analyst:** LEAD  
**Status:** 🚨 **MAJOR FAILURES IDENTIFIED - REQUIRES COMPLETE REDESIGN**

---

## Executive Summary

The current Protocol Builder implementation has **7 critical failures** that violate core product principles and user requirements. A complete redesign is required.

**Severity:** HIGH - Does not meet Feb 15 demo requirements

---

## Critical Failures

### 1. 🚨 **WRONG PAGE STRUCTURE**

**Current:** Patient Selection screen is the landing page  
**Required:** Protocols list table should be the landing page

**User's Vision:**
> "When the user lands on the page, they should already see all of their most recent protocols along the table sort/search function to find an existing patient"

**Fix:**
- `/protocols` = Protocols list table (with search/filter)
- Patient lookup integrated INTO the table page (not a separate modal)
- "New Patient" button navigates to builder
- "Existing Patient" = select from table → auto-populate form

---

### 2. 🚨 **MEDICATION SCREEN VIOLATES ZERO-TEXT-ENTRY POLICY**

**Current:** Free-text search input "Search medications..."  
**Screenshot Evidence:** Text input field visible

**Policy Violation:**
> "We are a zero text entry application"

**Why This is Critical:**
- Text entry = PHI/PII risk
- Inconsistent with app-wide design system
- Violates HIPAA compliance strategy

**Fix:**
- **Button grid** of common medications (60 most common)
- **Multi-select checkboxes** organized by category
- NO search input
- NO free text

---

### 3. 🚨 **SESSION DATE FIELD SHOULD NOT EXIST**

**Current:** Session date picker in Protocol tab  
**User Directive:**
> "That session date section should not be in there; Have it removed, not changed"

**Why:**
- Session date = auto-generated (today's date)
- No need for user input
- Adds unnecessary complexity

**Fix:**
- Remove session date field entirely
- Auto-set to `NOW()` on submission
- Display in read-only format after submission

---

### 4. 🚨 **EXCESSIVE DEAD SPACE**

**Current:** >50% of screen is empty  
**User Observation:**
> "Over half the screen is dead space"

**Visual Analysis:**
- Clinical Insights panel: Empty placeholder
- Large padding/margins
- Sparse form layouts
- Wasted vertical space

**Impact:**
- Looks unfinished
- Poor information density
- Requires excessive scrolling

**Fix:**
- Condense form layouts
- Reduce padding/margins
- Add visual elements (icons, micro-animations)
- Implement Clinical Insights analytics (not Phase 2)

---

### 5. 🚨 **DRAB VISUAL DESIGN**

**User Feedback:**
> "And this whole thing looks very drab"

**Issues:**
- Monochromatic color scheme (all dark grays)
- No visual hierarchy
- Minimal use of accent colors
- No micro-animations or visual feedback
- Feels lifeless

**Fix:**
- Add vibrant accent colors (teal, emerald, amber)
- Use gradients and glows
- Add micro-animations (button hovers, transitions)
- Improve visual hierarchy with color coding
- Add icons and visual indicators

---

### 6. 🚨 **"PHASE 2" DEFERRALS UNACCEPTABLE**

**Current:** Clinical Insights panel deferred to Phase 2  
**User Directive:**
> "There should be no 'waiting for phase 2' I want the full build done and ready ASAP"

**Deferred Features:**
- Receptor Affinity Profile
- Expected Outcomes
- Drug Interaction Alerts
- Cohort Matching
- Genomic Safety
- Therapeutic Envelope

**Impact:**
- Right side of screen is empty
- Missing core value proposition
- Not demo-ready

**Fix:**
- Implement ALL Clinical Insights analytics NOW
- SOOP must complete materialized views
- SOOP must populate receptor affinity data
- SOOP must populate drug interaction data

---

### 7. 🚨 **UNNECESSARY 3-TAB SPLIT**

**User Feedback:**
> "With that much wasted space, I don't think we need to have it on three different tabs"

**Current:** Patient | Medications | Protocol (3 tabs)

**Why This Fails:**
- Creates artificial workflow steps
- Increases time to completion
- Dead space makes tabs unnecessary
- Forces excessive clicking

**Fix:**
- **Single-page layout** with all fields visible
- Logical grouping with section headers
- Scroll-based navigation (not tabs)
- Denser information architecture

---

## Strategic Analysis

### What DESIGNER Got Wrong

1. **Misunderstood page hierarchy**
   - Made Protocol Builder the main page
   - Should be protocols LIST as main page

2. **Ignored zero-text-entry policy**
   - Added free-text medication search
   - Violates core product principle

3. **Over-engineered workflow**
   - 3-tab split unnecessary
   - Patient selection screen redundant

4. **Deferred critical features**
   - Clinical Insights = core value prop
   - Should not be Phase 2

5. **Poor space utilization**
   - >50% dead space
   - Sparse layouts

6. **Weak visual design**
   - Drab, monochromatic
   - No visual richness

---

## Recommended Redesign Approach

### Page Structure

**My Protocols Page (`/protocols`)**
```
┌─────────────────────────────────────────────────────────────┐
│  My Protocols                          [+ New Protocol]      │
├─────────────────────────────────────────────────────────────┤
│  [Search: Subject ID...]  [Filter: Substance ▼] [Date ▼]    │
├─────────────────────────────────────────────────────────────┤
│  Subject ID  │ Session │ Substance  │ Date       │ Status   │
├──────────────┼─────────┼────────────┼────────────┼──────────┤
│  PT-ABC123   │    3    │ Psilocybin │ Feb 10     │ Complete │ ← Click to edit
│  PT-XYZ789   │    1    │ MDMA       │ Feb 8      │ Complete │
│  PT-DEF456   │    2    │ Ketamine   │ Feb 5      │ Draft    │
└─────────────────────────────────────────────────────────────┘
```

**Protocol Builder Page (`/protocol-builder`)**
- **Single-page layout** (no tabs)
- **70/30 split** (form left, insights right)
- **Dense, compact design**
- **All fields visible** without scrolling

### Form Layout (Single Page)

**Left Side (70%):**
1. **Patient Information** (button groups)
   - Age, Sex, Weight, Smoking, Prior Experience
2. **Medications** (button grid, NO text input)
   - 60 common medications as checkboxes
   - Organized by category
3. **Protocol Details** (dropdowns, steppers)
   - Indication, Substance, Dosage, Route
   - NO session date field
4. **Consent** (checkbox)
5. **Submit Button**

**Right Side (30%):**
1. **Receptor Affinity Profile** (radar chart)
2. **Expected Outcomes** (bar chart)
3. **Drug Interaction Alerts** (list)
4. **Genomic Safety** (gauge)
5. **Therapeutic Envelope** (compact)
6. **Cohort Matches** (preview)

---

## Handoff Requirements

### For DESIGNER

**Deliverables:**
1. **My Protocols page mockup** - Table with search/filter
2. **Protocol Builder redesign** - Single-page, dense layout
3. **Medication selection** - Button grid (60 medications, NO text input)
4. **Clinical Insights panel** - All 6 analytics sections with real data
5. **Visual richness** - Vibrant colors, gradients, micro-animations

**Critical Rules:**
- ✅ **Zero text entry** - Button groups, dropdowns, checkboxes ONLY
- ✅ **No Phase 2 deferrals** - Everything implemented NOW
- ✅ **Dense layouts** - Minimize dead space
- ✅ **Visual richness** - Not drab, use vibrant colors
- ✅ **Single-page form** - No tabs (unless absolutely necessary)
- ✅ **No session date field** - Auto-generated

---

### For SOOP

**Deliverables:**
1. **Materialized views** - Outcomes, clinic benchmarks, network averages
2. **Receptor affinity data** - All 8 substances, 7 receptors
3. **Drug interaction data** - 480 combinations (8 substances × 60 medications)
4. **Performance optimization** - All queries <100ms

**Timeline:** ASAP (no Phase 2)

---

### For BUILDER

**Wait for DESIGNER's redesign** before implementing

---

## Success Criteria (Revised)

✅ My Protocols page shows protocols table as landing page  
✅ Patient lookup integrated into table (not separate screen)  
✅ Protocol Builder = single-page dense layout  
✅ Zero text entry (medications = button grid)  
✅ NO session date field  
✅ Clinical Insights panel fully implemented (all 6 sections)  
✅ Vibrant visual design (not drab)  
✅ <20% dead space (not >50%)  
✅ All features implemented (no Phase 2 deferrals)  

---

## Timeline

**Immediate:**
1. DESIGNER: Complete redesign (8-12 hours)
2. SOOP: Complete database work (8-12 hours)

**After Redesign Approved:**
3. BUILDER: Implement redesign (6-8 hours)

**Target:** Feb 14, 11:59 PM (allows 12 hours for testing before demo)

---

## My Take

**DESIGNER fundamentally misunderstood the requirements:**

1. **Page hierarchy wrong** - Made builder the main page instead of protocols list
2. **Violated core policy** - Added text entry (medications search)
3. **Ignored user directive** - Included session date field
4. **Poor space utilization** - >50% dead space
5. **Weak visual design** - Drab, monochromatic
6. **Deferred critical features** - Clinical Insights should be NOW, not Phase 2
7. **Over-engineered** - 3 tabs unnecessary with so much dead space

**This needs a complete redesign, not incremental fixes.**

**Recommendation:** Send back to DESIGNER with clear requirements document emphasizing:
- Zero text entry policy
- Dense, visually rich layouts
- No Phase 2 deferrals
- Single-page form design
- Protocols list as main page
