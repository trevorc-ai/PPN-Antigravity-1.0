# Arc of Care System Review & Gap Analysis

**Date:** 2026-02-16T07:46:00-08:00  
**Reviewer:** BUILDER  
**Reference:** `docs/design/PAT_Longitudinal_Journey.md`

---

## 📊 Current Implementation vs. Design Document

### ✅ What We Built Correctly

| Feature | Design Doc | Implementation | Status |
|---------|-----------|----------------|--------|
| **Phase 1: Baseline Assessments** | PHQ-9, GAD-7, ACE, Expectancy | ✅ All 4 implemented | **COMPLETE** |
| **Phase 1: Set & Setting Analysis** | Visual analysis of baseline | ✅ SetAndSettingCard component | **COMPLETE** |
| **Phase 1: Predicted Integration** | AI algorithm for session count | ✅ Risk scoring algorithm | **COMPLETE** |
| **Phase 2: Real-Time Vitals** | HR, HRV, BP from wearables | ✅ RealTimeVitalsPanel | **COMPLETE** |
| **Phase 2: Safety Events** | MedDRA-coded adverse events | ✅ SessionTimeline | **COMPLETE** |
| **Phase 2: Rescue Protocol** | 6 intervention types | ✅ RescueProtocolChecklist | **COMPLETE** |
| **Phase 3: Daily Pulse Check** | 2 questions, <10 seconds | ✅ PulseCheckWidget | **COMPLETE** |
| **Phase 3: Symptom Decay** | PHQ-9 trajectory over 6 months | ✅ SymptomDecayCurveChart | **COMPLETE** |
| **Phase 3: Red Alerts** | C-SSRS spikes, PHQ-9 regression | ✅ RedAlertPanel | **COMPLETE** |

---

## ⚠️ Critical Gaps Identified

### 1. **Post-Session Assessments (The "Bridge")**

**What's Missing:**
- MEQ-30 (Mystical Experience Questionnaire)
- EDI (Ego Dissolution Inventory)
- CEQ (Challenging Experience Questionnaire)

**Why It Matters:**
> "The MEQ-30 is the #1 predictor of long-term success. A 'Complete Mystical Experience' correlates with 80% remission rates."

**Current Problem:**
- We jump from Phase 2 (Session) directly to Phase 3 (Integration)
- We're missing the critical "Did they have a breakthrough?" assessment
- Without MEQ-30/EDI/CEQ, we can't predict who needs more integration support

**Database Status:**
- ✅ Tables exist (`log_clinical_records` has MEQ/EDI/CEQ columns)
- ❌ No UI components to collect this data
- ❌ No API endpoints to submit post-session assessments

---

### 2. **Medication Tapering Tracker**

**What's Missing:**
- SSRI tapering schedule
- Wash-out period tracking
- Current medications list

**Why It Matters:**
> "Many patients are on SSRIs which blunt the effects of psilocybin/MDMA. Tracking the exact tapering schedule and wash-out period is critical."

**Current Problem:**
- We collect baseline assessments but don't track medication status
- Can't correlate "weak experience" with "still on SSRIs"
- Missing a major predictor of efficacy

**Database Status:**
- ❌ No medication tapering tables
- ❌ No medication history tracking
- ❌ No wash-out period calculator

---

### 3. **Longitudinal Assessment Scheduler**

**What's Missing:**
- WHOQOL-BREF (Quality of Life)
- PSQI (Sleep Quality)
- Scheduled C-SSRS checks

**Why It Matters:**
> "Sleep is the first thing to break before a mental health relapse. It is the 'Canary in the Coal Mine.'"

**Current Problem:**
- We have daily pulse checks (great!)
- But we're missing the deeper scheduled assessments
- Can't track quality of life improvements (just symptom reduction)

**Database Status:**
- ✅ Tables exist (`log_longitudinal_assessments`)
- ❌ No UI components
- ❌ No scheduling system

---

### 4. **Behavioral Change Tracker**

**What's Missing:**
- Life changes (reconnected with family, quit smoking, etc.)
- Social connection metrics
- Work/productivity changes

**Why It Matters:**
> "PAT aims for Behavioral Change ('Did you reconnect with your estranged father?'), not just Symptom Reduction ('Are you less sad?')."

**Current Problem:**
- We only track PHQ-9 scores (symptoms)
- Missing the "true indicators of success"
- Can't show insurance companies the full value

**Database Status:**
- ✅ Table exists (`log_behavioral_changes`)
- ❌ No UI components
- ❌ No API endpoints

---

## 🎯 Recommended Architecture Changes

### Current Structure (3 Phases)
```
Phase 1: Protocol Builder (Pre-Session)
  └─ Baseline assessments
  └─ Set & Setting analysis
  └─ Predicted integration needs

Phase 2: Session Logger (During Session)
  └─ Real-time vitals
  └─ Safety events
  └─ Rescue protocol

Phase 3: Integration Tracker (Post-Session)
  └─ Daily pulse checks
  └─ Symptom decay curve
  └─ Red alerts
```

### Proposed Structure (4 Stages)
```
Stage 1: Preparation (Weeks before session)
  └─ Baseline assessments ✅
  └─ Medication tapering tracker ⚠️ ADD
  └─ Set & Setting analysis ✅
  └─ Predicted integration needs ✅

Stage 2: Dosing Session (4-8 hours)
  └─ Real-time vitals ✅
  └─ Safety events ✅
  └─ Rescue protocol ✅
  └─ Session timeline ✅

Stage 3: Post-Session Assessment (Within 24 hours)
  └─ MEQ-30 (Mystical Experience) ⚠️ ADD
  └─ EDI (Ego Dissolution) ⚠️ ADD
  └─ CEQ (Challenging Experience) ⚠️ ADD
  └─ Determines integration support level

Stage 4: Integration (Weeks/months after)
  └─ Daily pulse checks ✅
  └─ Symptom decay curve ✅
  └─ Longitudinal assessments ⚠️ ADD UI
  └─ Behavioral changes ⚠️ ADD
  └─ Red alerts ✅
```

---

## 📋 Implementation Options

### **Option A: Minimal (Keep 3 Phases, Add Missing Components)**

**Pros:**
- Less refactoring
- Faster to implement
- Current demos still work

**Cons:**
- Doesn't match the natural care flow
- Post-session assessments feel "tacked on"
- Harder to explain to users

**Effort:** 2-3 weeks

---

### **Option B: Optimal (Restructure to 4 Stages)**

**Pros:**
- Matches the actual PAT journey
- Clearer user flow
- Better aligns with design document
- Easier to explain to clinicians

**Cons:**
- More refactoring required
- Need to update all 3 demo pages
- Longer implementation time

**Effort:** 4-5 weeks

---

### **Option C: Hybrid (Keep 3 Phases, Add "Post-Session" Step)**

**Pros:**
- Minimal refactoring
- Adds the critical MEQ/EDI/CEQ assessments
- Keeps current structure mostly intact

**Cons:**
- Still missing medication tapering
- Still missing longitudinal assessment UI

**Effort:** 1-2 weeks

---

## 🚨 Critical Missing Components (Priority Order)

### **Priority 1: Post-Session Assessments** (CRITICAL)
- MEQ-30 component
- EDI component
- CEQ component
- API endpoints for submission

**Why:** This is the #1 predictor of success. Without it, we can't determine who needs more support.

---

### **Priority 2: Medication Tapering Tracker** (HIGH)
- Medication list component
- Tapering schedule component
- Wash-out period calculator

**Why:** Directly impacts efficacy. Can't correlate outcomes without this data.

---

### **Priority 3: Longitudinal Assessment UI** (MEDIUM)
- WHOQOL component
- PSQI component
- Scheduled C-SSRS component

**Why:** Database tables exist, just need UI. Important for long-term tracking.

---

### **Priority 4: Behavioral Change Tracker** (MEDIUM)
- Life changes component
- Social connection metrics
- Work/productivity tracker

**Why:** Shows true value to insurance companies. Database table exists.

---

## 💡 Recommended Next Steps

### **Immediate (This Week):**
1. **Decide on architecture:** 3 phases vs. 4 stages
2. **Build Priority 1:** Post-session assessment components (MEQ/EDI/CEQ)
3. **Update unified dashboard** to include post-session step

### **Short-Term (Next 2 Weeks):**
4. **Build Priority 2:** Medication tapering tracker
5. **Build Priority 3:** Longitudinal assessment UI
6. **Connect all components** to existing database tables

### **Medium-Term (Next Month):**
7. **Build Priority 4:** Behavioral change tracker
8. **Add scheduling system** for longitudinal assessments
9. **Create "Patient App" view** (mobile-optimized)
10. **Create "Provider Dashboard"** (aggregated analytics)

---

## 📊 Gap Analysis Summary

| Category | Implemented | Missing | Completion % |
|----------|-------------|---------|--------------|
| **Phase 1: Preparation** | 4/5 components | Medication tapering | **80%** |
| **Phase 2: Dosing** | 4/4 components | None | **100%** |
| **Phase 3: Post-Session** | 0/3 components | MEQ/EDI/CEQ | **0%** |
| **Phase 4: Integration** | 3/6 components | WHOQOL, PSQI, Behavioral | **50%** |
| **Overall** | 11/18 components | 7 components | **61%** |

---

## 🎯 Questions for Review

1. **Architecture:** Do we restructure to 4 stages or keep 3 phases?
2. **Priority:** Should we build post-session assessments (MEQ/EDI/CEQ) first?
3. **Scope:** Do we want all 18 components or focus on the critical path?
4. **Timeline:** What's the deadline for a "complete" Arc of Care system?

---

**BUILDER is ready to proceed once we align on the approach.**

==== BUILDER ====
