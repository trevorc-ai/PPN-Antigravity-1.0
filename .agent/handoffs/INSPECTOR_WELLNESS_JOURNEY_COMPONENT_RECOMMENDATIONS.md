# 🎨 WELLNESS JOURNEY COMPONENT RECOMMENDATIONS
**Based on Original Mockups & Feature Inventory Analysis**

**Date:** 2026-02-16  
**Prepared by:** INSPECTOR  
**Purpose:** Recommend which components should be included in the 3-phase Wellness Journey

---

## 📋 EXECUTIVE SUMMARY

After analyzing your original mockups and cross-referencing with our complete feature inventory, I've identified **which components should be displayed in each of the 3 phases** of the Wellness Journey (Preparation, Dosing Session, Integration).

**Key Finding:** The current Wellness Journey page is missing **90% of the visualizations** shown in your mockups. Most critically, it's missing the **phase-specific context** that makes the data actionable.

---

## 🎯 THE THREE PHASES (From Mockups)

### **PHASE 1: PREPARATION** (2 weeks before session)
**Color:** Red/Coral (#FF6B6B)  
**Duration:** Oct 1-14, 2025  
**Clinical Goal:** Establish baseline, set expectations, screen for contraindications

### **PHASE 2: DOSING SESSION** (8 hours)
**Color:** Gold/Amber (#FFB84D)  
**Duration:** Oct 15, 2025  
**Clinical Goal:** Real-time monitoring, safety interventions, peak experience tracking

### **PHASE 3: INTEGRATION** (6 months post-session)
**Color:** Green/Emerald (#10B981)  
**Duration:** Oct 16, 2025 - Apr 1, 2026  
**Clinical Goal:** Track symptom decay, ensure sustained improvement, prevent relapse

---

## 📊 COMPONENT RECOMMENDATIONS BY PHASE

### **PHASE 1: PREPARATION** 

**What Should Be Displayed:**

#### ✅ **1. Key Baseline Metrics** (CRITICAL)
**From Mockup:** "Key Metrics" card showing PHQ-9, GAD-7, ACE, Expectancy  
**Current Status:** ❌ Missing  
**Why Include:** Establishes baseline for measuring improvement  
**Component:** `BaselineMetricsCard.tsx`

**Display:**
```
┌─────────────────────────────────────┐
│ 📊 BASELINE METRICS                 │
├─────────────────────────────────────┤
│ Depression (PHQ-9): 21 (Severe) 😰  │
│ Anxiety (GAD-7): 12 (Moderate) 😟   │
│ ACE Score: 6 (High trauma) ⚠️       │
│ Expectancy: 88/100 (High) ✨        │
└─────────────────────────────────────┘
```

**Data Source:** `log_sessions.baseline_phq9`, `log_sessions.baseline_gad7`

---

#### ✅ **2. Predictions** (HIGH VALUE)
**From Mockup:** "Predictions" card showing success rate, likelihood of challenging experience  
**Current Status:** ❌ Missing  
**Why Include:** Sets realistic expectations, reduces anxiety  
**Component:** `PredictionsCard.tsx`

**Display:**
```
┌─────────────────────────────────────┐
│ 🔮 PREDICTIONS                      │
├─────────────────────────────────────┤
│ ↗ 72% success rate                  │
│ ⚠ 45% challenging experience        │
│   likelihood                        │
│ 📅 6 integration sessions           │
│   recommended                       │
└─────────────────────────────────────┘
```

**Data Source:** Aggregate benchmarks from similar protocols (substance, dosage, baseline PHQ-9)

---

#### ✅ **3. Contraindication Screening** (SAFETY)
**From Mockup:** Not shown, but critical for preparation phase  
**Current Status:** ❌ Missing  
**Why Include:** Legal defense, patient safety  
**Component:** `ContraindicationChecker.tsx`

**Display:**
```
┌─────────────────────────────────────┐
│ ⚠️ SAFETY SCREENING                 │
├─────────────────────────────────────┤
│ ✅ No cardiac contraindications     │
│ ✅ No psychotic history             │
│ ⚠️ SSRI detected - taper required   │
│ ✅ No MAOI interactions             │
└─────────────────────────────────────┘
```

**Data Source:** `log_medications`, `ref_interactions`

---

#### ❌ **4. Preparation Checklist** (OPTIONAL)
**From Mockup:** Not shown  
**Current Status:** ❌ Missing  
**Why Skip:** Low priority, can be added later  
**Defer to:** Phase 2 implementation

---

### **PHASE 2: DOSING SESSION**

**What Should Be Displayed:**

#### ✅ **1. Session Timeline** (CRITICAL)
**From Mockup:** "Session Timeline" showing dose administration, onset, peak, current state  
**Current Status:** ❌ Missing  
**Why Include:** Real-time monitoring, legal documentation  
**Component:** `SessionTimeline.tsx`

**Display:**
```
┌─────────────────────────────────────┐
│ ⏱️ SESSION TIMELINE                 │
├─────────────────────────────────────┤
│ ⚪ 0:00 - Dose administered (25mg)  │
│ │                                   │
│ 🔵 0:45 - Onset reported            │
│ │                                   │
│ 🟢 1:30 - Peak intensity (HR: 105)  │
│ │                                   │
│ 🟡 ⚠ Anxiety spike (HR: 118)        │
│ │   → Intervention: Verbal          │
│ │   → Patient calmed (HR: 98)       │
│ │                                   │
│ 🟢 Current state: Stable            │
└─────────────────────────────────────┘
```

**Data Source:** `session_interventions` (NEW TABLE - from WO-060)

---

#### ✅ **2. Real-Time Vitals** (HIGH VALUE)
**From Mockup:** "Real-Time Vitals" showing heart rate, HRV, blood pressure  
**Current Status:** ❌ Missing  
**Why Include:** Safety monitoring, early warning system  
**Component:** `RealTimeVitals.tsx`

**Display:**
```
┌─────────────────────────────────────┐
│ 💓 REAL-TIME VITALS                 │
│ Auto-updating from Apple Watch      │
├─────────────────────────────────────┤
│ HEART RATE                          │
│ 98 bpm ~~~∿~~~                      │
│ ✅ Normal Range (60-100 bpm)        │
│                                     │
│ HRV                                 │
│ 45 ms ||||||||||||||||              │
│ ✅ Relaxed State                    │
│                                     │
│ BLOOD PRESSURE                      │
│ 128/82                              │
│ ⚠️ Slightly Elevated                │
│ Schedule next check: 2:45 PM        │
└─────────────────────────────────────┘
```

**Data Source:** Bluetooth integration (future), manual entry (MVP)

---

#### ✅ **3. Safety & Rescue** (CRITICAL)
**From Mockup:** "Safety & Rescue" showing safety events, rescue protocol  
**Current Status:** ❌ Missing (this is the Crisis Logger from WO-060)  
**Why Include:** Legal defense, intervention tracking  
**Component:** `CrisisLogger.tsx` (from WO-060)

**Display:**
```
┌─────────────────────────────────────┐
│ ⚠️ SAFETY & RESCUE                  │
├─────────────────────────────────────┤
│ Safety Events                       │
│ 🟡 2:15 PM - Anxiety (Moderate)     │
│    - RESOLVED                       │
│ 🟡 1:45 PM - Mild nausea            │
│    - RESOLVED                       │
│                                     │
│ 2 events (all resolved) ✅          │
│                                     │
│ Rescue Protocol                     │
│ ☑ Verbal De-escalation (2:15 PM)    │
│ ☐ Breathing Techniques              │
│ ☐ Physical Touch (hand-holding)     │
│ ☐ Chemical Rescue (Lorazepam 1mg)   │
│                                     │
│ All interventions logged ✅         │
└─────────────────────────────────────┘
```

**Data Source:** `session_interventions` (NEW TABLE)

---

#### ✅ **4. Peak Experience Metrics** (HIGH VALUE)
**From Mockup:** "Experience Metrics" showing MEQ-30, EDI, CEQ scores  
**Current Status:** ❌ Missing  
**Why Include:** Predicts therapeutic benefit  
**Component:** `PeakExperienceMetrics.tsx`

**Display:**
```
┌─────────────────────────────────────┐
│ ✨ PEAK EXPERIENCE METRICS          │
├─────────────────────────────────────┤
│ MEQ-30: 25/100                      │
│ ✅ Strong mystical experience       │
│                                     │
│ EDI: 77/100                         │
│ ✅ High Ego Dissolution             │
│                                     │
│ CEQ: 81/100                         │
│ ⚠️ Moderately Challenging           │
└─────────────────────────────────────┘
```

**Data Source:** Post-session assessments (MEQ-30, EDI, CEQ)

---

### **PHASE 3: INTEGRATION**

**What Should Be Displayed:**

#### ✅ **1. Symptom Decay Curve** (CRITICAL)
**From Mockup:** Large chart showing PHQ-9 decline over time with phase annotations  
**Current Status:** ✅ **IMPLEMENTED** (`SymptomDecayCurve.tsx`)  
**Why Include:** Primary outcome measure, shows therapeutic benefit  
**Component:** `SymptomDecayCurve.tsx` (ALREADY EXISTS)

**Display:**
```
┌─────────────────────────────────────────────────────────┐
│ 📉 SYMPTOM DECAY CURVE                                  │
├─────────────────────────────────────────────────────────┤
│ 27 ┃                                                    │
│    ┃ ● Day 0: 21 (Severe Depression)                   │
│ 24 ┃ │                                                  │
│    ┃ │ [Afterglow Period]                              │
│ 21 ┃ ●                                                  │
│    ┃  ╲                                                 │
│ 18 ┃   ╲                                                │
│    ┃    ● Day 7: 14 (Moderate)                         │
│ 15 ┃     ╲                                              │
│    ┃      ● Day 14: 11                                  │
│ 12 ┃       ╲                                            │
│    ┃        ╲ [Sustained Improvement]                   │
│  9 ┃         ● Day 30: 9 (Mild)                         │
│    ┃          ─────                                     │
│  6 ┃               ● Day 45: 7 (Minimal)                │
│    ┃                ✅ Approaching remission            │
│  3 ┃                                                    │
│    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
│      Day 0  Day 7  Day 14  Day 30  Day 60  Day 90      │
└─────────────────────────────────────────────────────────┘
```

**Data Source:** `log_sessions` (PHQ-9 scores over time)

---

#### ✅ **2. Integration Milestones** (HIGH VALUE)
**From Mockup:** Timeline showing pulse checks, assessments, integration sessions  
**Current Status:** ❌ Missing  
**Why Include:** Tracks compliance, predicts relapse  
**Component:** `IntegrationMilestones.tsx`

**Display:**
```
┌─────────────────────────────────────┐
│ 🎯 INTEGRATION MILESTONES           │
├─────────────────────────────────────┤
│ ● Day 1: First pulse check ✅       │
│ ● Day 7: PHQ-9 assessment ✅        │
│ ● Day 14: Integration Session #1 ✅ │
│ ● Day 30: WHOQOL-BREF ✅            │
│ ● Day 60: Integration Session #2 ✅ │
│ ○ Day 80: Integration Session #3    │
│   (scheduled)                       │
│ ○ Day 180: Final assessment         │
│   (scheduled)                       │
└─────────────────────────────────────┘
```

**Data Source:** `log_integration_sessions` (NEW TABLE)

---

#### ✅ **3. Quality of Life Improvements** (HIGH VALUE)
**From Mockup:** "Quality of Life Improvements" showing WHOQOL-BREF, PSQI, behavioral changes  
**Current Status:** ❌ Missing  
**Why Include:** Holistic outcome tracking beyond depression  
**Component:** `QualityOfLifeCard.tsx`

**Display:**
```
┌─────────────────────────────────────┐
│ 🌟 QUALITY OF LIFE IMPROVEMENTS     │
├─────────────────────────────────────┤
│ WHOQOL-BREF: 68 → 82 (+21%)         │
│ Sleep Quality (PSQI): Fair → Good   │
│                                     │
│ Behavioral Changes:                 │
│ ✅ Reconnected with father          │
│ ✅ Started meditation practice      │
│ ✅ Quit smoking (Day 43)            │
│ ✅ New job (Day 130)                │
└─────────────────────────────────────┘
```

**Data Source:** `log_behavioral_changes` (NEW TABLE)

---

#### ✅ **4. Compliance Metrics** (CRITICAL)
**From Mockup:** "Compliance Metrics" showing daily pulse checks, weekly PHQ-9, integration sessions  
**Current Status:** ❌ Missing  
**Why Include:** Predicts relapse, shows engagement  
**Component:** `ComplianceMetrics.tsx`

**Display:**
```
┌─────────────────────────────────────┐
│ ✅ COMPLIANCE METRICS               │
├─────────────────────────────────────┤
│ Daily Pulse Checks: 168/180 (93%)   │
│ ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■  │
│ ✅ Excellent compliance             │
│                                     │
│ Weekly PHQ-9: 28/26 completed (100%)│
│ ✅ All assessments completed        │
│                                     │
│ Integration Sessions: 8/0 (100%)    │
│ ✅ Perfect attendance               │
│                                     │
│ 🏆 500 - Excellent engagement       │
└─────────────────────────────────────┘
```

**Data Source:** `log_pulse_checks`, `log_sessions`

---

#### ✅ **5. Alerts & Next Steps** (CRITICAL)
**From Mockup:** "Alerts" and "Next Steps" cards  
**Current Status:** ❌ Missing  
**Why Include:** Proactive intervention, prevents relapse  
**Component:** `AlertsAndNextSteps.tsx`

**Display:**
```
┌─────────────────────────────────────┐
│ 🚨 ALERTS                           │
├─────────────────────────────────────┤
│ ✅ No active alerts                 │
│ Patient is stable and progressing   │
│                                     │
│ Last alert: None                    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ ➡️ NEXT STEPS                       │
├─────────────────────────────────────┤
│ ☐ Schedule PHQ-9 at Day 60 (Dec 14)│
│ ☐ Integration Session #4 (Nov 30)  │
│ ☐ Consider Session #2 if plateau   │
│ 📅 Set Reminders                    │
└─────────────────────────────────────┘
```

**Data Source:** Business logic (alerts based on PHQ-9 trends, compliance)

---

#### ✅ **6. Personalized Insights** (HIGH VALUE)
**From Mockup:** "Personalized Insight" card showing AI-generated recommendations  
**Current Status:** ❌ Missing  
**Why Include:** Augmented intelligence, actionable recommendations  
**Component:** `PersonalizedInsights.tsx`

**Display:**
```
┌─────────────────────────────────────┐
│ 💡 PERSONALIZED INSIGHT             │
├─────────────────────────────────────┤
│ Your anxiety (GAD-7) drops by 40%   │
│ on weeks where you log at least 3   │
│ 'Nature Walks' in your journal.     │
│ Keep it up! 🌲                      │
└─────────────────────────────────────┘
```

**Data Source:** ML analysis of `log_pulse_checks` + `log_behavioral_changes`

---

#### ❌ **7. Today's Pulse Check** (DEFER)
**From Mockup:** "Today's Pulse Check" with emoji selectors  
**Current Status:** ❌ Missing  
**Why Defer:** This is a **separate page/modal**, not part of the Wellness Journey visualization  
**Recommendation:** Create as standalone feature (`/pulse-check`)

---

## 📋 SUMMARY: WHAT TO INCLUDE IN WELLNESS JOURNEY

### **PHASE 1: PREPARATION** (Before Session)
1. ✅ **Baseline Metrics Card** (PHQ-9, GAD-7, ACE, Expectancy)
2. ✅ **Predictions Card** (Success rate, challenging experience likelihood)
3. ✅ **Contraindication Screening** (Safety checks)

### **PHASE 2: DOSING SESSION** (During Session)
1. ✅ **Session Timeline** (Dose, onset, peak, interventions)
2. ✅ **Real-Time Vitals** (Heart rate, HRV, blood pressure)
3. ✅ **Safety & Rescue** (Crisis Logger - WO-060)
4. ✅ **Peak Experience Metrics** (MEQ-30, EDI, CEQ)

### **PHASE 3: INTEGRATION** (After Session)
1. ✅ **Symptom Decay Curve** (ALREADY IMPLEMENTED)
2. ✅ **Integration Milestones** (Timeline of assessments/sessions)
3. ✅ **Quality of Life Improvements** (WHOQOL-BREF, behavioral changes)
4. ✅ **Compliance Metrics** (Pulse checks, assessments, sessions)
5. ✅ **Alerts & Next Steps** (Proactive intervention)
6. ✅ **Personalized Insights** (AI-generated recommendations)

---

## 🎨 DESIGNER INSTRUCTIONS

### **CRITICAL CONTEXT**

The Wellness Journey is **NOT** just a data visualization page. It is the **"Augmented Intelligence" clinical decision support system** that:
- Displays real-time data during sessions
- Tracks longitudinal outcomes over 6 months
- Provides predictive insights and personalized recommendations
- Serves as legal documentation (audit trail)

### **DESIGN PRINCIPLES**

1. **Progressive Disclosure**
   - Don't show all components at once
   - Display phase-specific components based on where patient is in journey
   - Example: During Preparation phase, hide Session Timeline and Integration Milestones

2. **Visual Hierarchy**
   - **Phase indicator** should be prominent (Red → Gold → Green)
   - **Critical safety data** (vitals, alerts) should be largest
   - **Compliance metrics** should be secondary
   - **Insights** should be tertiary

3. **Color Coding by Phase**
   - **Preparation:** Red/Coral (#FF6B6B) - "Caution, baseline, screening"
   - **Dosing Session:** Gold/Amber (#FFB84D) - "Active monitoring, peak experience"
   - **Integration:** Green/Emerald (#10B981) - "Growth, improvement, remission"

4. **Mobile-First**
   - All components must work on 375px screens
   - Large touch targets (48px minimum)
   - Collapsible sections for long content

5. **Accessibility**
   - **12px minimum fonts** (NO EXCEPTIONS)
   - Color blind accessible (use icons + text, not color alone)
   - Keyboard navigation
   - Screen reader friendly

### **LAYOUT STRUCTURE**

**Recommended Layout:**

```
┌─────────────────────────────────────────────────────────┐
│ 🎯 YOUR HEALING JOURNEY                                 │
│ Session #1: Oct 15, 2025    [Day 45 Post-Session] 🟢   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ PHASE INDICATOR (3-column timeline)                 │ │
│ │ [PREPARATION] → [DOSING SESSION] → [INTEGRATION] ✅ │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                         │
│ [PHASE-SPECIFIC COMPONENTS - Dynamic based on phase]   │
│                                                         │
│ IF Phase 3 (Integration):                              │
│   ┌─────────────────────────────────────────────────┐   │
│   │ 📉 SYMPTOM DECAY CURVE (Large, prominent)       │   │
│   │ [Chart showing PHQ-9 decline over time]         │   │
│   └─────────────────────────────────────────────────┘   │
│                                                         │
│   ┌───────────────────┐  ┌───────────────────┐         │
│   │ 🎯 INTEGRATION    │  │ 🌟 QUALITY OF     │         │
│   │ MILESTONES        │  │ LIFE IMPROVEMENTS │         │
│   └───────────────────┘  └───────────────────┘         │
│                                                         │
│   ┌───────────────────┐  ┌───────────────────┐         │
│   │ ✅ COMPLIANCE     │  │ 🚨 ALERTS &       │         │
│   │ METRICS           │  │ NEXT STEPS        │         │
│   └───────────────────┘  └───────────────────┘         │
│                                                         │
│   ┌─────────────────────────────────────────────────┐   │
│   │ 💡 PERSONALIZED INSIGHT                         │   │
│   │ "Your anxiety drops 40% on weeks with nature..." │   │
│   └─────────────────────────────────────────────────┘   │
│                                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                         │
│ [Export PDF]  [View Full History]                      │
└─────────────────────────────────────────────────────────┘
```

### **COMPONENT PRIORITY**

**Implement in this order:**

**Week 1 (MVP):**
1. Phase indicator (3-column timeline)
2. Symptom Decay Curve (ALREADY EXISTS - just needs integration)
3. Baseline Metrics Card (Preparation phase)
4. Integration Milestones (Integration phase)

**Week 2 (High Value):**
5. Compliance Metrics
6. Alerts & Next Steps
7. Quality of Life Improvements
8. Predictions Card

**Week 3 (Session Monitoring):**
9. Session Timeline (requires WO-060 Crisis Logger)
10. Real-Time Vitals
11. Safety & Rescue (Crisis Logger)
12. Peak Experience Metrics

**Week 4 (AI/ML):**
13. Personalized Insights (requires ML analysis)

### **DATA REQUIREMENTS**

**New Database Tables Needed:**

```sql
-- For Integration Milestones
CREATE TABLE log_integration_sessions (
    integration_session_id UUID PRIMARY KEY,
    session_id UUID REFERENCES log_sessions(session_id),
    session_number INTEGER,
    session_date DATE,
    session_type VARCHAR(50), -- 'pulse_check', 'phq9', 'integration_therapy'
    completed BOOLEAN DEFAULT FALSE
);

-- For Behavioral Changes
CREATE TABLE log_behavioral_changes (
    change_id UUID PRIMARY KEY,
    patient_id UUID,
    change_type VARCHAR(50), -- 'relationship', 'habit', 'employment', 'health'
    change_description TEXT,
    logged_at DATE
);

-- For Pulse Checks
CREATE TABLE log_pulse_checks (
    pulse_check_id UUID PRIMARY KEY,
    patient_id UUID,
    check_date DATE,
    connection_level INTEGER, -- 1-5
    sleep_quality INTEGER, -- 1-5
    mood_level INTEGER, -- 1-5
    notes TEXT
);
```

### **RESPONSIVE BREAKPOINTS**

**Mobile (375px - 767px):**
- Single column layout
- Collapsible sections
- Symptom Decay Curve: Full width, reduced height (300px)
- Cards: Full width, stacked vertically

**Tablet (768px - 1023px):**
- Two-column grid for cards
- Symptom Decay Curve: Full width, medium height (400px)
- Phase indicator: Horizontal timeline

**Desktop (1024px+):**
- Three-column grid for cards
- Symptom Decay Curve: Full width, full height (500px)
- Phase indicator: Horizontal timeline with icons

### **ACCESSIBILITY CHECKLIST**

- [ ] All fonts ≥ 12px
- [ ] Color contrast ≥ 4.5:1
- [ ] Keyboard navigation works
- [ ] Screen reader announces phase changes
- [ ] Icons + text (not color alone)
- [ ] Focus states visible
- [ ] ARIA labels for charts

---

## 🚀 NEXT STEPS

### **For DESIGNER:**

1. **Review this document** and the original mockups
2. **Create wireframes** for each of the 3 phases
3. **Prioritize Week 1 components** (Phase indicator, Symptom Decay Curve, Baseline Metrics, Integration Milestones)
4. **Design component library** (reusable cards, charts, timelines)
5. **Create responsive layouts** for mobile, tablet, desktop
6. **Submit for LEAD review** before implementation

### **For SOOP (Database):**

1. **Create new tables:**
   - `log_integration_sessions`
   - `log_behavioral_changes`
   - `log_pulse_checks`
2. **Add RLS policies** for all new tables
3. **Create SQL functions** for compliance calculations

### **For BUILDER:**

1. **Wait for DESIGNER wireframes** (don't start yet)
2. **Implement Week 1 components** first
3. **Integrate existing SymptomDecayCurve** into new layout
4. **Create phase-switching logic** (show/hide components based on phase)

---

## 📖 STRATEGIC ALIGNMENT

**From Research Documents:**

> "The goal is to continue to refine what was a simple data entry form into an **'augmented intelligence' tool** - a sophisticated clinical decision support system that provides practitioners with real-time data visualization and comparative benchmarks."

**This Wellness Journey redesign achieves:**
- ✅ **Augmented Intelligence:** Personalized insights, predictions, alerts
- ✅ **Real-Time Visualization:** Session monitoring, vitals, symptom tracking
- ✅ **Comparative Benchmarks:** Success rates, compliance metrics
- ✅ **Clinical Decision Support:** Next steps, contraindication screening, relapse prevention

**Impact:**
- Differentiates from Osmind (they don't have longitudinal tracking)
- Builds trust with practitioners (data-driven decisions)
- Increases patient confidence (transparent, real-time progress)
- Creates data flywheel (more tracking = better predictions)

---

**INSPECTOR STATUS:** ✅ Component recommendations complete. Ready for DESIGNER wireframes.
