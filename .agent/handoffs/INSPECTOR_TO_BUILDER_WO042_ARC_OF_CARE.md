---
handoff_id: INSPECTOR_TO_BUILDER_WO042
work_order: WO_042_Arc_of_Care_Implementation
from: INSPECTOR
to: BUILDER
created: 2026-02-16T01:00:50-08:00
priority: CRITICAL
status: CLEARED_FOR_IMPLEMENTATION
implementation_weeks: 20
---

# INSPECTOR → BUILDER: Arc of Care System Implementation

## 🎯 MISSION

Implement a comprehensive **Arc of Care** system tracking patient journeys across 3 phases:
1. **Preparation** - Baseline assessments, set & setting analysis
2. **Dosing** - Real-time session monitoring, safety event logging
3. **Integration** - Daily pulse checks, symptom tracking, red alerts

**Timeline:** 20 weeks (5 phases)  
**Complexity:** 10/10 (This is a major feature)  
**Priority:** CRITICAL - "Killer app" feature

---

## ✅ INSPECTOR APPROVAL STATUS

**Database Schema:** ✅ APPROVED (with 5 RLS policies to add)  
**API Design:** ✅ APPROVED  
**Component Architecture:** ✅ APPROVED  
**Accessibility:** ✅ APPROVED (WCAG AAA)  
**Security:** ✅ APPROVED (HIPAA compliant)

**You are cleared to proceed with full implementation.**

---

## 📚 REQUIRED READING

Before you start, **READ THESE DOCUMENTS:**

1. **Technical Specification (CRITICAL):**  
   [arc_of_care_technical_spec.md](file:///Users/trevorcalton/.gemini/antigravity/brain/0d9d76bd-a21c-4309-b42b-0fa0be629b41/arc_of_care_technical_spec.md)
   - Complete database schema with SQL
   - All API endpoint specifications (TypeScript interfaces)
   - Component specifications with props/state
   - Tooltip text for every UI element
   - Validation rules for all forms
   - Error handling specifications
   - 20-week implementation checklist

2. **INSPECTOR Review:**  
   [INSPECTOR_PRELIMINARY_REVIEW_ARC_OF_CARE.md](file:///Users/trevorcalton/Desktop/PPN-Antigravity-1.0/.agent/handoffs/INSPECTOR_PRELIMINARY_REVIEW_ARC_OF_CARE.md)
   - Critical gaps identified (5 missing RLS policies)
   - Performance optimization recommendations
   - Implementation timeline assessment

3. **Work Order:**  
   [WO_042_Arc_of_Care_Implementation.md](file:///Users/trevorcalton/Desktop/PPN-Antigravity-1.0/_WORK_ORDERS/03_BUILD/WO_042_Arc_of_Care_Implementation.md)
   - Executive summary
   - Acceptance criteria
   - Next steps

---

## 🗄️ WEEK 1: DATABASE SETUP (Your First Task)

### Step 1: Create Migration File

Create: `migrations/050_arc_of_care_schema.sql`

**Copy the SQL from the technical spec for these 11 ref_ tables:**
1. `ref_assessment_scales` (lines 30-56 in spec)
2. `ref_intervention_types` (lines 61-79)
3. `ref_meddra_codes` (lines 84-101)

**Copy the SQL for these 9 log_ tables:**
4. `log_baseline_assessments` (lines 110-149)
5. `log_sessions` (lines 154-202)
6. `log_session_events` (lines 207-229)
7. `log_session_vitals` (lines 234-255)
8. `log_pulse_checks` (lines 260-280)
9. `log_longitudinal_assessments` (lines 285-311)
10. `log_behavioral_changes` (lines 316-331)
11. `log_integration_sessions` (lines 336-356)
12. `log_red_alerts` (lines 361-385)

### Step 2: Add 5 Missing RLS Policies

The spec only includes RLS for `log_baseline_assessments` and `log_sessions`. You MUST add RLS to these 5 tables:

**Add to migration file:**

```sql
-- RLS for log_pulse_checks
ALTER TABLE log_pulse_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their site's pulse checks"
  ON log_pulse_checks
  FOR SELECT
  USING (
    patient_id IN (
      SELECT patient_id FROM log_baseline_assessments
      WHERE site_id IN (
        SELECT site_id FROM user_sites WHERE user_id = auth.uid()
      )
    )
  );

-- RLS for log_longitudinal_assessments
ALTER TABLE log_longitudinal_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their site's longitudinal assessments"
  ON log_longitudinal_assessments
  FOR SELECT
  USING (
    patient_id IN (
      SELECT patient_id FROM log_baseline_assessments
      WHERE site_id IN (
        SELECT site_id FROM user_sites WHERE user_id = auth.uid()
      )
    )
  );

-- RLS for log_behavioral_changes
ALTER TABLE log_behavioral_changes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their site's behavioral changes"
  ON log_behavioral_changes
  FOR SELECT
  USING (
    patient_id IN (
      SELECT patient_id FROM log_baseline_assessments
      WHERE site_id IN (
        SELECT site_id FROM user_sites WHERE user_id = auth.uid()
      )
    )
  );

-- RLS for log_integration_sessions
ALTER TABLE log_integration_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their site's integration sessions"
  ON log_integration_sessions
  FOR SELECT
  USING (
    patient_id IN (
      SELECT patient_id FROM log_baseline_assessments
      WHERE site_id IN (
        SELECT site_id FROM user_sites WHERE user_id = auth.uid()
      )
    )
  );

-- RLS for log_red_alerts
ALTER TABLE log_red_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their site's red alerts"
  ON log_red_alerts
  FOR SELECT
  USING (
    patient_id IN (
      SELECT patient_id FROM log_baseline_assessments
      WHERE site_id IN (
        SELECT site_id FROM user_sites WHERE user_id = auth.uid()
      )
    )
  );
```

### Step 3: Add Recommended Indexes

Add these indexes for better performance:

```sql
-- Additional indexes recommended by INSPECTOR
CREATE INDEX idx_baseline_assessments_patient_site ON log_baseline_assessments(patient_id, site_id);
CREATE INDEX idx_sessions_patient_site_date ON log_sessions(patient_id, site_id, session_date);
CREATE INDEX idx_baseline_assessments_created ON log_baseline_assessments(created_at);
CREATE INDEX idx_sessions_created ON log_sessions(created_at);
CREATE INDEX idx_longitudinal_assessments_date ON log_longitudinal_assessments(assessment_date);
CREATE INDEX idx_pulse_checks_date ON log_pulse_checks(check_date);
CREATE INDEX idx_red_alerts_triggered ON log_red_alerts(alert_triggered_at);
```

### Step 4: Test Migration Locally

```bash
# Run migration
supabase db reset

# Verify tables exist
supabase db diff

# Test RLS policies
# (Create test queries to ensure users can only see their site's data)
```

### Step 5: Move to Week 2

Once database is set up and tested, proceed to Week 2 (API endpoints).

---

## 🚨 CRITICAL REQUIREMENTS (DO NOT SKIP)

### Security & Privacy

- ✅ **NO PHI/PII** - Only anonymized patient IDs (`VARCHAR(10)`)
- ✅ **RLS on ALL log_ tables** - Site isolation enforced (you're adding 5 missing policies)
- ✅ **No free-text patient data** - Only controlled values
- ⚠️ **Free-text fields require UI warnings:**
  - `psycho_spiritual_history` in `log_baseline_assessments`
  - `session_notes` in `log_sessions`
  - `session_notes` in `log_integration_sessions`
  - Add label: "DO NOT include patient names or identifying information"

### Accessibility (WCAG AAA)

- ✅ **Minimum 14px fonts** (body text)
- ✅ **Never use color alone** - Always pair with text labels + icons
- ✅ **Focus indicators:** 2px emerald-500 ring with 2px offset
- ✅ **Keyboard navigation:** All interactive elements
- ✅ **Screen reader support:** ARIA labels, descriptions, live regions

### Data Integrity

- ✅ **All scores validated** - CHECK constraints already in schema
- ✅ **Foreign key constraints** - Already in schema
- ✅ **Unique constraints** - Already in schema (prevent duplicate submissions)

---

## 📅 20-WEEK IMPLEMENTATION ROADMAP

### Phase 1: Protocol Builder (Weeks 1-4)

**Week 1: Database Setup** ⬅️ **START HERE**
- [ ] Create `migrations/050_arc_of_care_schema.sql`
- [ ] Copy SQL for 20 tables from technical spec
- [ ] Add 5 missing RLS policies (see Step 2 above)
- [ ] Add recommended indexes (see Step 3 above)
- [ ] Test migration locally
- [ ] Verify RLS policies work (users can only see their site's data)

**Week 2: API Endpoints**
- [ ] Implement `POST /api/phase1/baseline-assessment`
- [ ] Implement `GET /api/phase1/augmented-intelligence/:patientId`
- [ ] Write API validation middleware
- [ ] Write API error handling middleware
- [ ] Write API unit tests (Jest)

**Week 3: Frontend Components**
- [ ] Build `SetAndSettingCard.tsx`
- [ ] Build `PredictedIntegrationNeeds.tsx`
- [ ] Build `ExpectancyScaleGauge.tsx`
- [ ] Build `ACEScoreBarChart.tsx`
- [ ] Build `GAD7SeverityZones.tsx`
- [ ] Implement all tooltips (use `AdvancedTooltip` component)

**Week 4: Integration & Testing**
- [ ] Integrate components into Protocol Builder
- [ ] Connect to API endpoints
- [ ] Implement loading states
- [ ] Implement error states
- [ ] Write component tests (React Testing Library)
- [ ] Accessibility audit (WCAG AAA)
- [ ] **Move ticket to `04_QA` for INSPECTOR review**

---

### Phase 2: Session Logger (Weeks 5-8)

**Week 5: Database & API**
- [ ] Verify `log_sessions`, `log_session_events`, `log_session_vitals` tables
- [ ] Implement `POST /api/phase2/session/start`
- [ ] Implement `POST /api/phase2/session/log-event`
- [ ] Implement `POST /api/phase2/session/log-vitals`
- [ ] Implement `POST /api/phase2/session/post-assessment`

**Week 6: Real-Time Monitoring**
- [ ] Build `SessionMonitoringDashboard.tsx`
- [ ] Build `SessionTimeline.tsx`
- [ ] Build `RealTimeVitalsPanel.tsx`
- [ ] Research wearable APIs (Apple Watch, Fitbit, Whoop)
- [ ] Implement wearable data sync (30-second intervals)

**Week 7: Event Logging & Rescue Protocol**
- [ ] Build `SafetyEventLogger.tsx`
- [ ] Build `RescueProtocolChecklist.tsx`
- [ ] Build `PostSessionAssessmentForm.tsx` (MEQ-30, EDI, CEQ)
- [ ] Implement time-stamped event correlation

**Week 8: Integration & Testing**
- [ ] Integrate all components
- [ ] Test wearable data sync
- [ ] Test event logging workflow
- [ ] Accessibility audit
- [ ] **Move ticket to `04_QA` for INSPECTOR review**

---

### Phase 3: Integration Tracker (Weeks 9-12)

**Week 9: Database & API**
- [ ] Verify `log_pulse_checks`, `log_longitudinal_assessments`, `log_red_alerts` tables
- [ ] Implement `POST /api/phase3/pulse-check`
- [ ] Implement `POST /api/phase3/longitudinal-assessment`
- [ ] Implement `GET /api/phase3/patient-dashboard/:patientId/:sessionId`
- [ ] Implement `GET /api/phase3/provider-dashboard/:patientId/:sessionId`

**Week 10: Patient App ("The Mirror")**
- [ ] Build `PulseCheckWidget.tsx` (mobile)
- [ ] Build `PatientProgressCards.tsx`
- [ ] Build `PersonalizedInsights.tsx`
- [ ] Implement daily pulse check reminders (push notifications)
- [ ] Implement streak tracking & gamification

**Week 11: Provider Dashboard**
- [ ] Build `SymptomDecayCurveChart.tsx`
- [ ] Build `ComplianceMetrics.tsx`
- [ ] Build `RedAlertPanel.tsx`
- [ ] Build `NextStepsChecklist.tsx`
- [ ] Implement red alert triggers & notifications

**Week 12: Integration & Testing**
- [ ] Integrate patient app & provider dashboard
- [ ] Test red alert system
- [ ] Test automated PHQ-9 scheduling
- [ ] Accessibility audit
- [ ] **Move ticket to `04_QA` for INSPECTOR review**

---

### Phase 4: Cross-Phase Analytics (Weeks 13-16)

**Week 13: Unified Journey API**
- [ ] Implement `GET /api/analytics/complete-journey/:patientId`
- [ ] Implement `GET /api/analytics/symptom-decay-curve/:patientId`
- [ ] Implement `GET /api/analytics/meq-correlation`
- [ ] Implement `GET /api/analytics/relapse-prediction/:patientId`

**Week 14: Journey Visualization**
- [ ] Build `CompleteJourneyTimeline.tsx`
- [ ] Build `MEQCorrelationChart.tsx`
- [ ] Build `AfterglowVsSustainedChart.tsx`
- [ ] Build `QualityOfLifeVsSymptoms.tsx`

**Week 15: Predictive Analytics**
- [ ] Implement relapse prediction algorithm
- [ ] Implement phenotype-specific protocol recommendations
- [ ] Build `PredictiveInsightsPanel.tsx`

**Week 16: Integration & Testing**
- [ ] Integrate all analytics components
- [ ] Test prediction algorithms
- [ ] Accessibility audit
- [ ] **Move ticket to `04_QA` for INSPECTOR review**

---

### Phase 5: Admin Dashboard & Deployment (Weeks 17-20)

**Week 17: Admin Dashboard**
- [ ] Build `CohortOutcomeAnalysis.tsx`
- [ ] Build `ValueBasedCareReporting.tsx`
- [ ] Build `CrossClinicComparison.tsx`
- [ ] Build `SafetyEventTracking.tsx` (FDA reporting)

**Week 18: PDF Export & Reporting**
- [ ] Implement PDF export for patient journey
- [ ] Implement PDF export for insurance reporting
- [ ] Implement CSV export for data analysis
- [ ] Build `ReportGenerator.tsx`

**Week 19: Final Testing & QA**
- [ ] End-to-end testing (all three phases)
- [ ] Performance testing (load testing)
- [ ] Security audit (penetration testing)
- [ ] HIPAA compliance audit
- [ ] Accessibility audit (final)

**Week 20: Deployment & Training**
- [ ] Deploy to staging environment
- [ ] User training (clinicians, guides, admins)
- [ ] Create user documentation
- [ ] Deploy to production
- [ ] Monitor for issues (first week)
- [ ] **Move ticket to `05_USER_REVIEW` for final approval**

---

## 🧩 COMPONENT SPECIFICATIONS

All component specifications are in the technical spec (lines 774-1003). Key components:

### Phase 1: Preparation
- `SetAndSettingCard.tsx` - Expectancy gauge, ACE bar chart, GAD-7 zones
- `PredictedIntegrationNeeds.tsx` - Algorithm-based session recommendations

### Phase 2: Dosing
- `SessionMonitoringDashboard.tsx` - Real-time vitals, event timeline
- `RescueProtocolChecklist.tsx` - Intervention tracking

### Phase 3: Integration
- `PulseCheckWidget.tsx` - 2-question daily check-in (mobile)
- `SymptomDecayCurveChart.tsx` - PHQ-9 trajectory visualization
- `RedAlertPanel.tsx` - Automated safety alerts

**All components MUST use the `AdvancedTooltip` component** with the tooltip text specified in the technical spec.

---

## 🎯 SUCCESS CRITERIA

### Technical Success
- [ ] All API endpoints <200ms response time (95th percentile)
- [ ] All components meet WCAG AAA accessibility standards
- [ ] All database queries use proper indexes
- [ ] All RLS policies prevent cross-site data leakage
- [ ] All forms have proper validation & error handling
- [ ] All real-time features update within 30 seconds

### User Experience Success
- [ ] Baseline assessment completion time <5 minutes
- [ ] Pulse check completion time <10 seconds
- [ ] Session monitoring dashboard loads in <2 seconds
- [ ] Provider dashboard shows complete patient journey in <3 seconds
- [ ] Red alerts trigger within 1 minute of threshold breach
- [ ] Mobile app works offline (pulse checks cached)

### Clinical Success
- [ ] >80% patient compliance with daily pulse checks
- [ ] >90% patient compliance with scheduled PHQ-9 assessments
- [ ] <10% patient drop-off during integration period
- [ ] Red alert response time <24 hours (clinician acknowledgment)
- [ ] >70% sustained remission rate at 6 months (PHQ-9 <5)

---

## 🚦 HANDOFF PROTOCOL

**After each phase (Weeks 4, 8, 12, 16, 20):**
1. Move ticket to `04_QA` folder
2. Tag INSPECTOR for review
3. Wait for INSPECTOR approval before proceeding to next phase

**If INSPECTOR finds issues:**
- Increment `failure_count` in frontmatter
- If `failure_count` reaches 2, STOP and escalate to LEAD

---

## 📞 QUESTIONS?

If you have questions during implementation:
1. Check the technical spec first (it's very comprehensive)
2. Check the INSPECTOR review for clarifications
3. If still unclear, ask the user for guidance

---

**BUILDER: You are cleared for immediate start. Begin with Week 1 (Database Setup).**

**Good luck! This is a critical feature that will transform the platform.** 🚀

---

**END OF HANDOFF**
