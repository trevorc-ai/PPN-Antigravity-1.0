# Arc of Care: Missing Components - Requirements for INSPECTOR

**Date:** 2026-02-16T07:53:00-08:00  
**From:** BUILDER  
**To:** INSPECTOR  
**Subject:** Database Schema Requirements for Arc of Care Completion

---

## 🎯 Executive Summary

Based on the design document (`docs/design/PAT_Longitudinal_Journey.md`), we need to add **7 critical components** to complete the Arc of Care system. This document outlines all database schema requirements, reference data needs, and clinical considerations.

**Current Completion:** 61% (11/18 components)  
**Target:** 100% (18/18 components)

---

## 📊 Missing Components Overview

| Priority | Component | Questions | Scoring | Database Impact |
|----------|-----------|-----------|---------|-----------------|
| **P1** | MEQ-30 (Mystical Experience) | 30 | 0-5 scale, 4 dimensions | New ref + log tables |
| **P1** | EDI (Ego Dissolution) | 8 | 0-100 scale | New ref + log tables |
| **P1** | CEQ (Challenging Experience) | 26 | 7 subscales | New ref + log tables |
| **P2** | Medication Tapering | N/A | Timeline-based | New ref + log tables |
| **P3** | WHOQOL-BREF (Quality of Life) | 26 | 4 domains | New ref + log tables |
| **P3** | PSQI (Sleep Quality) | 19 | 0-21 score | New ref + log tables |
| **P4** | Behavioral Changes | N/A | Checkbox-based | Existing table needs UI |

---

## 🔬 Priority 1: Post-Session Assessments

### **1. MEQ-30 (Mystical Experience Questionnaire)**

**Clinical Purpose:**
> "The #1 predictor of long-term success. A 'Complete Mystical Experience' correlates with 80% remission rates."

**Assessment Details:**
- **Questions:** 30 items
- **Scale:** 0-5 (None, Slight, Moderate, Strong, Extreme, Most extreme)
- **Dimensions:** 4 subscales
  1. Mystical (15 items)
  2. Positive Mood (6 items)
  3. Transcendence of Time/Space (6 items)
  4. Ineffability (3 items)

**Scoring Algorithm:**
- Each dimension score = average of items in that dimension
- "Complete Mystical Experience" = All 4 dimensions ≥ 60% of maximum

**Database Requirements:**

```sql
-- Reference table for questions
CREATE TABLE ref_meq_questions (
    meq_question_id SERIAL PRIMARY KEY,
    question_number INTEGER NOT NULL, -- 1-30
    question_text TEXT NOT NULL,
    dimension TEXT NOT NULL, -- 'mystical', 'positive_mood', 'transcendence', 'ineffability'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Logging table for responses
CREATE TABLE log_meq_responses (
    meq_response_id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL REFERENCES log_clinical_records(clinical_record_id),
    subject_id TEXT NOT NULL,
    site_id INTEGER NOT NULL REFERENCES ref_sites(site_id),
    
    -- Individual question responses (1-30)
    q1_response INTEGER CHECK (q1_response BETWEEN 0 AND 5),
    q2_response INTEGER CHECK (q2_response BETWEEN 0 AND 5),
    -- ... q3-q30
    
    -- Calculated dimension scores
    mystical_score DECIMAL(5,2), -- 0-100
    positive_mood_score DECIMAL(5,2), -- 0-100
    transcendence_score DECIMAL(5,2), -- 0-100
    ineffability_score DECIMAL(5,2), -- 0-100
    
    -- Overall result
    complete_mystical_experience BOOLEAN, -- All 4 dimensions ≥ 60
    total_score DECIMAL(5,2), -- Average of 4 dimensions
    
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policy
CREATE POLICY "Users can only access their site's MEQ data"
    ON log_meq_responses
    FOR SELECT
    USING (site_id IN (SELECT site_id FROM user_sites WHERE user_id = auth.uid()));
```

**Seed Data Needed:**
- 30 MEQ question texts
- Dimension mappings

---

### **2. EDI (Ego Dissolution Inventory)**

**Clinical Purpose:**
> "Measures 'breakthrough' potential. Did they dissociate enough to rewire neural pathways?"

**Assessment Details:**
- **Questions:** 8 items
- **Scale:** 0-100 (visual analog scale)
- **Threshold:** Score ≥ 60 indicates ego dissolution achieved

**Example Questions:**
1. "I experienced a disintegration of my 'self' or ego"
2. "I felt at one with the universe"
3. "I experienced a dissolution of my sense of self"

**Database Requirements:**

```sql
-- Reference table
CREATE TABLE ref_edi_questions (
    edi_question_id SERIAL PRIMARY KEY,
    question_number INTEGER NOT NULL, -- 1-8
    question_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Logging table
CREATE TABLE log_edi_responses (
    edi_response_id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL REFERENCES log_clinical_records(clinical_record_id),
    subject_id TEXT NOT NULL,
    site_id INTEGER NOT NULL REFERENCES ref_sites(site_id),
    
    -- Individual responses (0-100 each)
    q1_response INTEGER CHECK (q1_response BETWEEN 0 AND 100),
    q2_response INTEGER CHECK (q2_response BETWEEN 0 AND 100),
    -- ... q3-q8
    
    -- Calculated score
    total_score DECIMAL(5,2), -- Average of 8 items
    ego_dissolution_achieved BOOLEAN, -- total_score ≥ 60
    
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policy
CREATE POLICY "Users can only access their site's EDI data"
    ON log_edi_responses
    FOR SELECT
    USING (site_id IN (SELECT site_id FROM user_sites WHERE user_id = auth.uid()));
```

**Seed Data Needed:**
- 8 EDI question texts

---

### **3. CEQ (Challenging Experience Questionnaire)**

**Clinical Purpose:**
> "Measures fear, grief, and physical distress. High CEQ isn't 'bad,' but it requires more integration support."

**Assessment Details:**
- **Questions:** 26 items
- **Scale:** 0-5 (None, Slight, Moderate, Strong, Extreme, Most extreme)
- **Subscales:** 7 dimensions
  1. Fear (7 items)
  2. Grief (3 items)
  3. Physical Distress (4 items)
  4. Insanity (3 items)
  5. Isolation (3 items)
  6. Death (3 items)
  7. Paranoia (3 items)

**Scoring Algorithm:**
- Each subscale = average of items in that dimension
- High scores in Fear/Grief/Death → Recommend more integration sessions

**Database Requirements:**

```sql
-- Reference table
CREATE TABLE ref_ceq_questions (
    ceq_question_id SERIAL PRIMARY KEY,
    question_number INTEGER NOT NULL, -- 1-26
    question_text TEXT NOT NULL,
    subscale TEXT NOT NULL, -- 'fear', 'grief', 'physical_distress', etc.
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Logging table
CREATE TABLE log_ceq_responses (
    ceq_response_id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL REFERENCES log_clinical_records(clinical_record_id),
    subject_id TEXT NOT NULL,
    site_id INTEGER NOT NULL REFERENCES ref_sites(site_id),
    
    -- Individual responses (1-26)
    q1_response INTEGER CHECK (q1_response BETWEEN 0 AND 5),
    q2_response INTEGER CHECK (q2_response BETWEEN 0 AND 5),
    -- ... q3-q26
    
    -- Calculated subscale scores
    fear_score DECIMAL(5,2), -- 0-100
    grief_score DECIMAL(5,2),
    physical_distress_score DECIMAL(5,2),
    insanity_score DECIMAL(5,2),
    isolation_score DECIMAL(5,2),
    death_score DECIMAL(5,2),
    paranoia_score DECIMAL(5,2),
    
    -- Overall result
    total_score DECIMAL(5,2), -- Average of 7 subscales
    challenging_experience_level TEXT, -- 'low', 'moderate', 'high', 'severe'
    
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policy
CREATE POLICY "Users can only access their site's CEQ data"
    ON log_ceq_responses
    FOR SELECT
    USING (site_id IN (SELECT site_id FROM user_sites WHERE user_id = auth.uid()));
```

**Seed Data Needed:**
- 26 CEQ question texts
- Subscale mappings

---

## 💊 Priority 2: Medication Tapering Tracker

**Clinical Purpose:**
> "SSRIs blunt the effects of psilocybin/MDMA. Tracking the exact tapering schedule and wash-out period is critical."

**Requirements:**
- Track current medications
- Create tapering schedules
- Calculate wash-out periods
- Alert if patient still on contraindicated meds

**Database Requirements:**

```sql
-- Reference table for medications
CREATE TABLE ref_medications (
    medication_id SERIAL PRIMARY KEY,
    medication_name TEXT NOT NULL,
    medication_class TEXT NOT NULL, -- 'SSRI', 'SNRI', 'Benzodiazepine', etc.
    half_life_hours INTEGER, -- For wash-out calculation
    contraindicated_for_pat BOOLEAN DEFAULT FALSE,
    tapering_protocol TEXT, -- Standard tapering guidance
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Patient's current medications
CREATE TABLE log_medication_history (
    medication_history_id SERIAL PRIMARY KEY,
    subject_id TEXT NOT NULL,
    site_id INTEGER NOT NULL REFERENCES ref_sites(site_id),
    medication_id INTEGER NOT NULL REFERENCES ref_medications(medication_id),
    
    dosage TEXT NOT NULL, -- '20mg', '50mg', etc.
    frequency TEXT NOT NULL, -- 'daily', 'twice daily', etc.
    start_date DATE NOT NULL,
    end_date DATE, -- NULL if still taking
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tapering schedule
CREATE TABLE log_tapering_schedule (
    tapering_schedule_id SERIAL PRIMARY KEY,
    subject_id TEXT NOT NULL,
    site_id INTEGER NOT NULL REFERENCES ref_sites(site_id),
    medication_history_id INTEGER NOT NULL REFERENCES log_medication_history(medication_history_id),
    
    target_session_date DATE NOT NULL, -- When they want to dose
    tapering_start_date DATE NOT NULL,
    tapering_end_date DATE NOT NULL,
    wash_out_complete_date DATE NOT NULL, -- 5x half-life
    
    -- Weekly tapering steps
    week_1_dosage TEXT,
    week_2_dosage TEXT,
    week_3_dosage TEXT,
    week_4_dosage TEXT,
    
    status TEXT DEFAULT 'planned', -- 'planned', 'in_progress', 'complete', 'abandoned'
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
CREATE POLICY "Users can only access their site's medication data"
    ON log_medication_history
    FOR SELECT
    USING (site_id IN (SELECT site_id FROM user_sites WHERE user_id = auth.uid()));

CREATE POLICY "Users can only access their site's tapering data"
    ON log_tapering_schedule
    FOR SELECT
    USING (site_id IN (SELECT site_id FROM user_sites WHERE user_id = auth.uid()));
```

**Seed Data Needed:**
- Common SSRIs (Prozac, Zoloft, Lexapro, etc.)
- Common SNRIs (Effexor, Cymbalta, etc.)
- Common Benzodiazepines (Xanax, Klonopin, Ativan, etc.)
- Half-life data for each
- Standard tapering protocols

---

## 🌍 Priority 3: Longitudinal Assessments

### **4. WHOQOL-BREF (Quality of Life)**

**Clinical Purpose:**
> "Are they just 'less sad' (symptom reduction), or are they living better (social connection, work)?"

**Assessment Details:**
- **Questions:** 26 items
- **Scale:** 1-5
- **Domains:** 4 subscales
  1. Physical Health (7 items)
  2. Psychological (6 items)
  3. Social Relationships (3 items)
  4. Environment (8 items)

**Database Requirements:**

```sql
CREATE TABLE ref_whoqol_questions (
    whoqol_question_id SERIAL PRIMARY KEY,
    question_number INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    domain TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE log_whoqol_responses (
    whoqol_response_id SERIAL PRIMARY KEY,
    subject_id TEXT NOT NULL,
    site_id INTEGER NOT NULL REFERENCES ref_sites(site_id),
    assessment_date DATE NOT NULL,
    
    -- Individual responses
    -- ... q1-q26
    
    -- Domain scores
    physical_health_score DECIMAL(5,2),
    psychological_score DECIMAL(5,2),
    social_relationships_score DECIMAL(5,2),
    environment_score DECIMAL(5,2),
    
    overall_qol_score DECIMAL(5,2),
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### **5. PSQI (Pittsburgh Sleep Quality Index)**

**Clinical Purpose:**
> "Sleep is the first thing to break before a mental health relapse. It is the 'Canary in the Coal Mine.'"

**Assessment Details:**
- **Questions:** 19 items
- **Scale:** 0-3
- **Score Range:** 0-21
- **Threshold:** Score > 5 indicates poor sleep quality

**Database Requirements:**

```sql
CREATE TABLE ref_psqi_questions (
    psqi_question_id SERIAL PRIMARY KEY,
    question_number INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    component TEXT NOT NULL, -- 'duration', 'disturbance', 'latency', etc.
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE log_psqi_responses (
    psqi_response_id SERIAL PRIMARY KEY,
    subject_id TEXT NOT NULL,
    site_id INTEGER NOT NULL REFERENCES ref_sites(site_id),
    assessment_date DATE NOT NULL,
    
    -- Individual responses
    -- ... q1-q19
    
    -- Component scores
    sleep_quality_score INTEGER,
    sleep_latency_score INTEGER,
    sleep_duration_score INTEGER,
    sleep_efficiency_score INTEGER,
    sleep_disturbance_score INTEGER,
    sleep_medication_score INTEGER,
    daytime_dysfunction_score INTEGER,
    
    total_score INTEGER CHECK (total_score BETWEEN 0 AND 21),
    poor_sleep_quality BOOLEAN, -- total_score > 5
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔄 Priority 4: Behavioral Changes

**Clinical Purpose:**
> "True indicators of success beyond symptom reduction."

**Database Status:**
- ✅ Table already exists: `log_behavioral_changes`
- ❌ No UI components
- ❌ No reference data for change types

**Additional Reference Data Needed:**

```sql
CREATE TABLE ref_behavioral_change_types (
    change_type_id SERIAL PRIMARY KEY,
    change_category TEXT NOT NULL, -- 'social', 'work', 'health', 'spiritual'
    change_description TEXT NOT NULL,
    examples TEXT[], -- Array of example changes
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed data examples:
-- Social: "Reconnected with estranged family member"
-- Work: "Returned to work after disability leave"
-- Health: "Quit smoking"
-- Spiritual: "Started daily meditation practice"
```

---

## 🏗️ Proposed 4-Stage Architecture

### **Stage 1: Preparation (Pre-Session)**
- Baseline assessments (PHQ-9, GAD-7, ACE, Expectancy) ✅
- **Medication tapering tracker** ⚠️ NEW
- Set & Setting analysis ✅
- Predicted integration needs ✅

### **Stage 2: Dosing Session (Acute)**
- Real-time vitals monitoring ✅
- Safety event logging ✅
- Rescue protocol ✅
- Session timeline ✅

### **Stage 3: Post-Session Assessment (Within 24 hours)**
- **MEQ-30 (Mystical Experience)** ⚠️ NEW
- **EDI (Ego Dissolution)** ⚠️ NEW
- **CEQ (Challenging Experience)** ⚠️ NEW
- Determines integration support level

### **Stage 4: Integration (Weeks/months)**
- Daily pulse checks ✅
- Symptom decay curve (PHQ-9) ✅
- **WHOQOL (Quality of Life)** ⚠️ NEW
- **PSQI (Sleep Quality)** ⚠️ NEW
- **Behavioral changes tracker** ⚠️ NEW
- Red alerts ✅

---

## 📋 Implementation Checklist

### **Database Schema (INSPECTOR + SOOP)**
- [ ] Research actual MEQ-30 questions (30 items)
- [ ] Research actual EDI questions (8 items)
- [ ] Research actual CEQ questions (26 items)
- [ ] Research actual WHOQOL questions (26 items)
- [ ] Research actual PSQI questions (19 items)
- [ ] Create all ref_* tables with seed data
- [ ] Create all log_* tables with RLS policies
- [ ] Create medication reference data
- [ ] Test scoring algorithms

### **API Endpoints (BUILDER)**
- [ ] POST /api/post-session/meq - Submit MEQ-30
- [ ] POST /api/post-session/edi - Submit EDI
- [ ] POST /api/post-session/ceq - Submit CEQ
- [ ] GET /api/post-session/summary/:sessionId - Get all 3 scores
- [ ] POST /api/medications/tapering-schedule - Create tapering plan
- [ ] GET /api/medications/wash-out-status/:subjectId - Check wash-out
- [ ] POST /api/longitudinal/whoqol - Submit WHOQOL
- [ ] POST /api/longitudinal/psqi - Submit PSQI
- [ ] POST /api/behavioral-changes - Log behavioral change

### **UI Components (BUILDER)**
- [ ] MEQAssessment.tsx (30 questions)
- [ ] EDIAssessment.tsx (8 questions)
- [ ] CEQAssessment.tsx (26 questions)
- [ ] PostSessionSummary.tsx (shows all 3 scores)
- [ ] MedicationList.tsx
- [ ] TaperingSchedule.tsx
- [ ] WashoutCalculator.tsx
- [ ] WHOQOLAssessment.tsx (26 questions)
- [ ] PSQIAssessment.tsx (19 questions)
- [ ] BehavioralChangeTracker.tsx

### **Dashboard Restructure (BUILDER)**
- [ ] Update ArcOfCareDashboard to 4 stages
- [ ] Add Stage 3 (Post-Session) view
- [ ] Add medication tapering to Stage 1
- [ ] Add longitudinal assessments to Stage 4
- [ ] Update navigation/timeline UI

---

## 🚨 Critical Considerations

### **PHI Compliance**
- ✅ All assessments use controlled scales (no free text)
- ✅ All responses are numeric or checkbox-based
- ✅ Medication names from reference table only
- ✅ Behavioral changes from predefined list

### **Clinical Accuracy**
- ⚠️ Need actual question texts from validated scales
- ⚠️ Need proper scoring algorithms
- ⚠️ Need clinical interpretation thresholds

### **User Experience**
- 30-question MEQ may cause survey fatigue
- Consider breaking into multiple pages
- Show progress indicators
- Allow save/resume

---

## 📊 Summary

**Total New Tables:** 12
- 5 ref_* tables (questions)
- 7 log_* tables (responses)

**Total New Components:** 9
- 3 post-session assessments
- 3 medication tracking
- 3 longitudinal assessments

**Estimated Effort:**
- Database schema: 1-2 weeks (research + implementation)
- API endpoints: 1 week
- UI components: 2-3 weeks
- Dashboard restructure: 1 week

**Total: 5-7 weeks for complete implementation**

---

## ❓ Questions for INSPECTOR

1. **Do we have access to validated MEQ/EDI/CEQ question sets?**
2. **Should we store individual question responses or just calculated scores?**
3. **Do we need versioning for assessment scales (in case they update)?**
4. **Should medication tapering be automated or manual?**
5. **Do we want to trigger red alerts based on PSQI/WHOQOL scores?**

---

**BUILDER is ready to proceed once database schema is finalized.**

==== BUILDER → INSPECTOR ====
