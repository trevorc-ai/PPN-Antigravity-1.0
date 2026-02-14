# Command #015: Implement SOOP's P0 Analytics Features

**Date Issued:** Feb 13, 2026, 6:10 PM PST  
**Issued By:** LEAD (on behalf of User)  
**Assigned To:** SOOP (Database), then BUILDER (Frontend)  
**Priority:** P1 - HIGH  
**Estimated Time:** 1-2 weeks  
**Start After:** Command #008 (RLS Audit) complete

---

## DIRECTIVE

Implement SOOP's P0 (Priority 0) analytics recommendations from the Data Opportunities Analysis.

**Reference:** `/Users/trevorcalton/.gemini/antigravity/brain/64b01072-8b80-4b2a-b847-bb7358af4d41/data_opportunities_analysis.md`

---

## P0 FEATURES (Immediate Implementation)

### 1. Patient Trajectory Visualization
**Impact:** High | **Effort:** Medium | **Data Readiness:** 80%

**What:** Time-series visualization of individual patient progress over multiple sessions

**Database Work (SOOP):**
- Create `mv_patient_trajectories` materialized view
- Track PHQ-9 scores over time
- Calculate cohort averages for comparison

**Frontend Work (BUILDER):**
- Build D3.js line chart component
- Add to Protocol Detail page
- Show patient progress vs. cohort average

---

### 2. Real-Time Network Activity Dashboard
**Impact:** High | **Effort:** Low | **Data Readiness:** 90%

**What:** Live feed of anonymized network events

**Database Work (SOOP):**
- Create `mv_network_pulse` materialized view (refresh every 5 min)
- Track last 24 hours of protocol submissions
- Geographic distribution (country-level, no PHI)

**Frontend Work (BUILDER):**
- Build Network Pulse widget
- Add to Dashboard
- Show "Site 7 logged Psilocybin for Depression" style updates

---

### 3. Adverse Event Prediction Model
**Impact:** Critical | **Effort:** High | **Data Readiness:** 60%

**What:** Predictive model for adverse event risk

**Database Work (SOOP):**
- Create `log_adverse_event_risk_scores` table
- Create `mv_adverse_event_rates` materialized view
- Implement baseline risk scoring function

**Frontend Work (BUILDER):**
- Add risk score display to Protocol Builder
- Show risk factors and mitigation strategies
- Color-code risk levels (Low/Moderate/High/Very High)

---

### 4. Protocol Builder Auto-Fill Intelligence
**Impact:** High | **Effort:** Low | **Data Readiness:** 95%

**What:** Smart defaults based on practitioner's history

**Database Work (SOOP):**
- Create `user_protocol_preferences` table
- Add trigger to learn from submissions
- Implement preference lookup function

**Frontend Work (BUILDER):**
- Update Protocol Builder to fetch preferences
- Pre-fill common values
- Show "Based on your last 10 protocols" hint

---

## IMPLEMENTATION SEQUENCE

**Week 1: SOOP Database Work**
1. Create all materialized views
2. Create new tables
3. Implement triggers and functions
4. Test data accuracy

**Week 2: BUILDER Frontend Work**
1. Build Patient Trajectory component
2. Build Network Pulse widget
3. Add risk scoring to Protocol Builder
4. Implement auto-fill logic

---

## SUCCESS METRICS

- Reduce protocol creation time by 50% (auto-fill)
- Increase practitioner engagement by 30% (network activity feed)
- Reduce adverse events by 20% (prediction model)
- Improve remission rates by 10% (trajectory monitoring)

---

## DELIVERABLES

**SOOP:**
- ✅ 4 new materialized views created
- ✅ 2 new tables created
- ✅ Triggers and functions implemented
- ✅ Migration files created

**BUILDER:**
- ✅ Patient Trajectory visualization
- ✅ Network Pulse widget
- ✅ Risk scoring in Protocol Builder
- ✅ Auto-fill functionality
- ✅ Screenshots of all 4 features

---

**START AFTER RLS AUDIT COMPLETE**
