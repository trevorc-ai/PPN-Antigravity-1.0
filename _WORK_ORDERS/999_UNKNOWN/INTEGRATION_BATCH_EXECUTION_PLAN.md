# Integration Batch Execution Plan
## WO-060 to WO-066: Arc of Care Component Integration

**Created:** 2026-02-17T12:52:00-08:00  
**Owner:** BUILDER  
**Total Estimated Time:** 10-12 days  
**Priority:** P1 (Critical Path)

---

## 🎯 OBJECTIVE

Integrate 7 existing Arc of Care visualization components into the Wellness Journey workflow. All components are already built - this is **integration work only** (wiring up data, adding to pages, testing).

---

## 📋 EXECUTION SEQUENCE

Execute in **strict order** (1 → 7). Each ticket is a **1-2 day task**. Complete one fully before starting the next.

### **WEEK 1: Quick Wins (Days 1-6)**

#### **Day 1-1.5: WO-064 - Daily Wellness Tracking**
- **File:** `WO-064_Integrate_Daily_Wellness_Tracking.md`
- **Priority:** P2 (High) | **Order:** 1
- **Component:** Daily Pulse Check widget
- **Integration Point:** Wellness Journey dashboard
- **Database:** `log_pulse_checks` table
- **Estimated Time:** 1.5 days
- **Success Criteria:**
  - ✅ Daily Pulse Check widget displays on Wellness Journey
  - ✅ Connects to `log_pulse_checks` data
  - ✅ Mobile-responsive
  - ✅ WCAG AAA compliant

---

#### **Day 2-3.5: WO-061 - Session Timeline Component**
- **File:** `WO-061_Integrate_Session_Timeline_Component.md`
- **Priority:** P1 (Critical) | **Order:** 2
- **Component:** Session Timeline visualization
- **Integration Point:** Dosing session workflow
- **Database:** `log_sessions`, `log_session_events`
- **Estimated Time:** 1.5 days
- **Success Criteria:**
  - ✅ Timeline shows Dose → Onset → Peak → End
  - ✅ Real-time updates during active session
  - ✅ Elapsed time calculations accurate
  - ✅ Mobile swipe navigation works

---

#### **Day 4-5.5: WO-063 - Symptom Trajectory Chart**
- **File:** `WO-063_Integrate_Symptom_Trajectory_Chart.md`
- **Priority:** P2 (High) | **Order:** 3
- **Component:** `SymptomDecayCurve.tsx`
- **Integration Point:** Integration/follow-up workflow
- **Database:** `log_longitudinal_assessments`
- **Estimated Time:** 1.5 days
- **Success Criteria:**
  - ✅ Chart displays PHQ-9, GAD-7, WHOQOL over time
  - ✅ Baseline → post-session → follow-ups visible
  - ✅ Change from baseline calculated
  - ✅ CSV export functional

---

#### **Day 6-7.5: WO-062 - Vital Signs Data Collection**
- **File:** `WO-062_Integrate_Vital_Signs_Data_Collection.md`
- **Priority:** P1 (Critical) | **Order:** 4
- **Component:** Vital signs monitoring widget
- **Integration Point:** Dosing session monitoring
- **Database:** `log_session_vitals`
- **Estimated Time:** 1.5 days
- **Success Criteria:**
  - ✅ HR, HRV, BP, SpO2 display in real-time
  - ✅ Color-coded alerts (green/yellow/red)
  - ✅ "Record Now" button functional
  - ✅ Time-series chart shows trends

---

### **WEEK 2: Heavier Lifts (Days 8-12)**

#### **Day 8-10: WO-060 - Baseline Mental Health Components**
- **File:** `WO-060_Integrate_Baseline_Mental_Health_Components.md`
- **Priority:** P1 (Critical) | **Order:** 5
- **Component:** `SetAndSettingCard.tsx`, severity gauges
- **Integration Point:** Preparation workflow
- **Database:** `log_baseline_assessments`
- **Estimated Time:** 2-3 days
- **Success Criteria:**
  - ✅ All 6 baseline metrics displayed (PHQ-9, GAD-7, ACE, PCL-5, Expectancy, HRV)
  - ✅ Severity gauges color-coded
  - ✅ "Export Baseline Report (PDF)" functional
  - ✅ Population percentile indicators (if data available)

**Note:** This is the longest task - includes building 2 new gauges (PHQ-9, PCL-5)

---

#### **Day 11-12: WO-065 - Session Monitoring Dashboard**
- **File:** `WO-065_Integrate_Session_Monitoring_Dashboard.md`
- **Priority:** P1 (Critical) | **Order:** 6
- **Component:** Real-time session monitoring dashboard
- **Integration Point:** Dosing session active view
- **Database:** `log_sessions`, `log_session_vitals`, `log_session_events`
- **Estimated Time:** 2 days
- **Success Criteria:**
  - ✅ Dashboard shows all active session metrics
  - ✅ Real-time updates (vitals, timeline, observations)
  - ✅ Safety alerts visible
  - ✅ Quick-action buttons functional

---

#### **Day 12-13.5: WO-066 - Safety Event Documentation**
- **File:** `WO-066_Integrate_Safety_Event_Documentation.md`
- **Priority:** P1 (Critical) | **Order:** 7
- **Component:** Safety event logging widget
- **Integration Point:** Ongoing safety monitoring
- **Database:** `log_safety_events`, `log_red_alerts`
- **Estimated Time:** 1.5 days
- **Success Criteria:**
  - ✅ Safety events logged with severity
  - ✅ Red alerts trigger notifications
  - ✅ Event timeline visible
  - ✅ Intervention tracking functional

---

## 🔄 WORKFLOW FOR EACH TICKET

### **Step 1: Read Ticket (15 min)**
- Review full ticket requirements
- Identify component location
- Check database schema

### **Step 2: Integration (4-6 hours)**
- Import existing component
- Wire up database connection
- Add to appropriate page/workflow
- Configure props and state

### **Step 3: Testing (2-3 hours)**
- Functional testing (data loads correctly)
- Accessibility testing (WCAG AAA)
- Mobile responsiveness
- Browser compatibility

### **Step 4: Documentation (30 min)**
- Update component showcase (if applicable)
- Add usage examples
- Document any edge cases

### **Step 5: Move to QA (5 min)**
- Update ticket status
- Move file to `04_QA/`
- Notify INSPECTOR

---

## 📊 PROGRESS TRACKING

### **Completion Checklist:**
- [ ] WO-064 - Daily Wellness Tracking
- [ ] WO-061 - Session Timeline Component
- [ ] WO-063 - Symptom Trajectory Chart
- [ ] WO-062 - Vital Signs Data Collection
- [ ] WO-060 - Baseline Mental Health Components
- [ ] WO-065 - Session Monitoring Dashboard
- [ ] WO-066 - Safety Event Documentation

### **Daily Standup Questions:**
1. Which ticket are you currently working on?
2. Any blockers? (missing data, unclear requirements, etc.)
3. Estimated completion time for current ticket?

---

## 🚨 CRITICAL CONSTRAINTS

### **DO NOT:**
- Change database schema
- Modify existing components (integration only)
- Skip testing steps
- Work on multiple tickets in parallel

### **DO:**
- Follow the exact order (1 → 7)
- Complete each ticket fully before moving to next
- Move completed tickets to QA immediately
- Flag any blockers immediately

---

## 🎯 SUCCESS METRICS

**By End of Week 1:**
- ✅ 4 integrations complete (WO-064, WO-061, WO-063, WO-062)
- ✅ All moved to QA
- ✅ No blockers

**By End of Week 2:**
- ✅ All 7 integrations complete
- ✅ All passed INSPECTOR QA
- ✅ Ready for USER_REVIEW

---

## 📚 REFERENCE DOCUMENTS

- **Components Location:** `/src/components/arc-of-care/`
- **Database Schema:** `/brain/arc_of_care_technical_spec.md`
- **Design Guidelines:** `/brain/arc_of_care_guidelines_v2.md`

---

## 🔗 DEPENDENCIES

**None** - All components already exist. This is pure integration work.

---

**BUILDER:** Start with WO-064 (Daily Wellness Tracking) and work through the list in order. Each ticket should take 1-2 days. Move to QA immediately upon completion.

**LEAD:** Monitor progress daily. Unblock any issues immediately.

---

**Status:** Ready for BUILDER execution  
**Start Date:** TBD  
**Target Completion:** 10-12 business days from start
