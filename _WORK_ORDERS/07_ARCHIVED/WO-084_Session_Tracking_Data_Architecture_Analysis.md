---
id: WO-084
status: 03_BUILD
priority: P1 (Critical)
category: Strategic Analysis
audience: Technical Team
implementation_order: 11
owner: ANALYST
failure_count: 0
---

# Session Tracking Data Architecture Analysis

## PRODDY STRATEGIC ANALYSIS (2026-02-17 15:33 PST)

**Context:** User has requested analysis of session tracking requirements based on two key research documents:
1. **SESSIONS 📊📈.md** - Comprehensive academic review of psychedelic therapy protocols from provider perspective
2. **Doctor_Interview.md** - Real-world practitioner interview revealing operational pain points

**Strategic Objective:** Determine if current database schema and application architecture can handle dozens of time-stamped inputs per treatment session, identify gaps, and recommend production-ready solutions.

---

## EXECUTIVE SUMMARY

**Current State:** ✅ **GOOD FOUNDATION** - Our Phase 2 forms already track many required data points  
**Gap Analysis:** ⚠️ **MODERATE GAPS** - Missing minute-by-minute timeline tracking and multi-substance dosing workflows  
**Database Risk:** ✅ **LOW RISK** - Current schema can handle high-frequency inputs with minor additions  
**Recommendation:** **INCREMENTAL ENHANCEMENT** - Build on existing SessionVitalsForm pattern, add 3 new tables

---

## WHAT WE ARE TRACKING (Current Implementation)

### ✅ Phase 1: Preparation (5 Forms - COMPLETE)
1. **MentalHealthScreeningForm** - Psychiatric exclusions, contraindications
2. **BaselinePhysiologyForm** - ECG, labs, cardiovascular screening
3. **SetAndSettingForm** - Intentions, expectations, therapeutic alliance
4. **BaselineObservationsForm** - Psychometric baselines (PHQ-9, GAD-7, CAPS-5, AAQ-II)
5. **ConsentForm** - Informed consent, touch consent, emergency protocols

### ✅ Phase 2: Dosing Session (7 Forms - MOSTLY COMPLETE)
1. **DosingProtocolForm** - Substance, dose, route, administration time
2. **SessionVitalsForm** ⭐ - **REFERENCE IMPLEMENTATION**
   - Heart Rate, HRV, BP (Systolic/Diastolic), SpO2
   - Timestamp, Data Source, Device ID
   - **Repeatable** (add multiple readings)
   - **Auto-save** (500ms debounce)
   - **Color-coded status** (normal/elevated/critical)
3. **SessionObservationsForm** - Behavioral observations, dissociation, psychotomimetic symptoms
4. **SessionTimelineForm** - Key events, phase transitions
5. **MEQ30QuestionnaireForm** - Mystical Experience Questionnaire (post-session)
6. **PostSessionAssessmentsForm** - Immediate outcomes, discharge readiness
7. **AdverseEventForm** - Safety events, rescue interventions
8. **RescueProtocolForm** - Emergency medication administration
9. **SafetyEventObservationsForm** - Critical incidents

### ✅ Phase 3: Integration (4 Forms - COMPLETE)
1. **StructuredIntegrationSessionForm** - Meaning-making, behavioral change planning
2. **LongitudinalAssessmentForm** - Follow-up psychometrics (1 week, 4 weeks, 6 months)
3. **BehavioralChangeTrackerForm** - Integration homework, somatic practices
4. **DailyPulseCheckForm** - Post-session monitoring (72-hour window)

---

## WHAT WE ARE NOT TRACKING (Gaps Identified from Research)

### ⚠️ **GAP 1: Minute-by-Minute Timeline Tracking**

**From Doctor Interview:**
> "We're on the fly... we've got a limited period of time... down to the minute, down to the second, down to the hour"

**Current State:** SessionTimelineForm tracks "key events" but not continuous timeline  
**Required:** Time-stamped log of every clinical action and observation

**Example Use Case (from interview):**
- **T+0:00** - 125mg MDMA oral administration
- **T+0:20** - 20mg test dose administered
- **T+1:30** - No breakthrough, decision point
- **T+1:35** - 125mg MDMA per rectal (total 250mg)
- **T+2:00** - Still no breakthrough, vital check (HR 122, BP elevated)
- **T+2:05** - Clinical decision: add 75mg ketamine IM
- **T+2:10** - Ketamine administered
- **T+2:45** - Breakthrough achieved

**Database Impact:** Need `session_timeline_events` table with millisecond precision timestamps

---

### ⚠️ **GAP 2: Multi-Substance Dosing Workflows**

**From Doctor Interview:**
> "We might introduce another agent to switch directions... 75 milligrams of ketamine intramuscular... am I gonna affect MDMA receptors too much?"

**Current State:** DosingProtocolForm assumes single substance per session  
**Required:** Support for sequential/concurrent multi-substance administration

**Example Scenarios:**
1. **MDMA + Ketamine Augmentation** (interview example)
2. **Psilocybin + Supplemental Dose** (Oregon regulations allow "secondary doses")
3. **Ketamine Infusion + Rescue Benzodiazepine** (safety protocol)

**Database Impact:** Need `multi_substance_sessions` table with drug-drug interaction flags

---

### ⚠️ **GAP 3: Clinical Decision Support / Pharmacodynamic Alerts**

**From Doctor Interview:**
> "I want to plug in... respiratory rate is 16, heart rate is 122, baseline was 84... should we add 75mg ketamine IM right now?"

**Current State:** SessionVitalsForm shows color-coded warnings but no decision tree  
**Required:** Real-time clinical decision support based on vital trends + substance interactions

**Example Decision Trees:**
- **BP > 160/100** → Pause infusion per CANMAT guidelines
- **HR > 120 + MDMA on board** → Consider serotonin syndrome risk
- **SpO2 < 90** → Immediate oxygen, consider rescue medication

**Database Impact:** Need `clinical_decision_rules` table + real-time alert system

---

### ⚠️ **GAP 4: Music Curation Timeline (Wave Model)**

**From SESSIONS.md:**
> "The auditory protocol is typically divided into three distinct phases: Ascent (20-60min), Peak (confrontation), Descent (re-entry)"

**Current State:** Not tracked at all  
**Required:** Music playlist tracking synchronized with pharmacokinetic phases

**Database Impact:** Low priority for MVP, but could add `session_music_log` table

---

### ⚠️ **GAP 5: Touch Consent Dynamic Tracking**

**From SESSIONS.md:**
> "Rather than using directive requests, providers use open-ended inquiries... ensuring the patient maintains autonomy despite vulnerable state"

**Current State:** ConsentForm has static touch consent checkbox  
**Required:** Real-time touch consent log (when touch offered, patient response, type of touch)

**Database Impact:** Add `touch_consent_log` table with timestamps

---

## DATABASE SCHEMA ANALYSIS

### ✅ **CURRENT SCHEMA CAN HANDLE:**

1. **High-Frequency Vital Signs** - SessionVitalsForm already demonstrates repeatable pattern
   - Uses client-side array state
   - Auto-saves with debounce (prevents database overload)
   - Each reading has unique ID + timestamp
   
2. **Relational Data Integrity** - Existing foreign key patterns support session linkage
   - `subject_id` → links to patient
   - `session_id` → links to dosing session
   - `protocol_id` → links to treatment protocol

3. **Audit Trail** - RLS policies + `created_at`/`updated_at` timestamps already in place

### ⚠️ **SCHEMA ADDITIONS REQUIRED:**

```sql
-- GAP 1: Minute-by-Minute Timeline
CREATE TABLE session_timeline_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES dosing_sessions(id) ON DELETE CASCADE,
    event_timestamp TIMESTAMPTZ NOT NULL,
    event_type TEXT NOT NULL, -- 'dose_admin', 'vital_check', 'clinical_decision', 'patient_observation', 'music_change'
    event_description TEXT,
    performed_by UUID REFERENCES auth.users(id),
    metadata JSONB, -- Flexible storage for event-specific data
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_timeline_session ON session_timeline_events(session_id, event_timestamp);

-- GAP 2: Multi-Substance Dosing
CREATE TABLE multi_substance_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES dosing_sessions(id) ON DELETE CASCADE,
    substance_id UUID REFERENCES substances(id),
    dose_mg DECIMAL(10,2) NOT NULL,
    route_id UUID REFERENCES routes(id),
    administered_at TIMESTAMPTZ NOT NULL,
    sequence_order INTEGER, -- 1st dose, 2nd dose, etc.
    reason_for_addition TEXT, -- "No breakthrough", "Rescue intervention", etc.
    interaction_risk_level TEXT CHECK (interaction_risk_level IN ('low', 'moderate', 'high')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- GAP 3: Clinical Decision Rules
CREATE TABLE clinical_decision_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rule_name TEXT NOT NULL,
    trigger_condition JSONB NOT NULL, -- e.g., {"bp_systolic": {">": 160}, "substance": "ketamine"}
    recommended_action TEXT NOT NULL,
    severity TEXT CHECK (severity IN ('info', 'warning', 'critical')),
    evidence_source TEXT, -- "CANMAT 2023", "MAPS Protocol", etc.
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE session_clinical_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES dosing_sessions(id) ON DELETE CASCADE,
    rule_id UUID REFERENCES clinical_decision_rules(id),
    triggered_at TIMESTAMPTZ NOT NULL,
    vital_snapshot JSONB, -- Snapshot of vitals that triggered alert
    action_taken TEXT,
    acknowledged_by UUID REFERENCES auth.users(id),
    acknowledged_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## APPLICATION ARCHITECTURE ANALYSIS

### ✅ **CURRENT PATTERNS SUPPORT SCALE:**

1. **Repeatable Form Pattern** (SessionVitalsForm)
   - ✅ Client-side state management (React useState)
   - ✅ Debounced auto-save (prevents excessive DB writes)
   - ✅ Optimistic UI updates (feels instant to user)
   - ✅ Accessible (WCAG AAA compliant)

2. **Component Reusability**
   - ✅ FormField shared component
   - ✅ AdvancedTooltip for contextual help
   - ✅ VitalPresetsBar for quick-entry

3. **Mobile Responsiveness**
   - ✅ Grid layouts (1 col mobile → 3 col desktop)
   - ✅ Touch-friendly buttons (min 44px tap targets)

### ⚠️ **ENHANCEMENTS NEEDED:**

1. **Real-Time Collaboration** (if multiple providers monitoring same session)
   - Add Supabase Realtime subscriptions
   - Show "Dr. Smith is viewing this session" indicator
   - Conflict resolution for simultaneous edits

2. **Offline Support** (for facilities with unreliable internet)
   - IndexedDB caching
   - Queue writes, sync when connection restored
   - Visual indicator of sync status

3. **Performance Optimization** (for sessions with 100+ timeline events)
   - Virtual scrolling for long timelines
   - Pagination for historical data
   - Lazy loading of non-critical data

---

## RISK ASSESSMENT

### 🟢 **LOW RISK:**
- **Database Performance:** PostgreSQL can easily handle 1000+ inserts/session
- **Data Integrity:** Foreign keys + RLS policies already robust
- **Accessibility:** Existing forms meet WCAG AAA standards

### 🟡 **MODERATE RISK:**
- **UI Complexity:** Minute-by-minute timeline UI could overwhelm users
  - **Mitigation:** Collapsible sections, summary view + detail view
- **Data Entry Speed:** Typing timestamps manually is slow
  - **Mitigation:** "Record Now" buttons, voice-to-text, preset templates

### 🔴 **HIGH RISK:**
- **Clinical Decision Support Liability:** Automated alerts could create legal exposure if wrong
  - **Mitigation:** All alerts must show evidence source, require provider acknowledgment, never auto-execute interventions
- **PHI Security:** High-frequency data = more attack surface
  - **Mitigation:** Encrypt JSONB metadata fields, audit all access

---

## RECOMMENDATIONS

### **PHASE 1: MVP (Week 1-2) - Build on SessionVitalsForm Pattern**

1. **Create SessionTimelineForm** (new component)
   - Clone SessionVitalsForm structure
   - Replace vital fields with: `event_type`, `event_description`, `timestamp`
   - Add quick-entry buttons: "Dose Administered", "Vital Check", "Patient Spoke", "Music Changed"
   - Auto-timestamp with "Record Now" button

2. **Extend DosingProtocolForm** for multi-substance
   - Add "Add Another Substance" button (same pattern as SessionVitalsForm "Add Another Reading")
   - Show interaction warnings (static for MVP, pull from `clinical_decision_rules` in Phase 2)

3. **Database Migrations**
   - Add 3 tables: `session_timeline_events`, `multi_substance_sessions`, `clinical_decision_rules`
   - Seed `clinical_decision_rules` with CANMAT/MAPS guidelines

### **PHASE 2: Clinical Decision Support (Week 3-4)**

1. **Real-Time Alert System**
   - Subscribe to SessionVitalsForm changes via Supabase Realtime
   - Evaluate against `clinical_decision_rules`
   - Show toast notifications for warnings/critical alerts
   - Log all alerts to `session_clinical_alerts`

2. **Provider Dashboard**
   - Live session monitoring view (all active sessions)
   - Color-coded status indicators
   - One-click drill-down to session timeline

### **PHASE 3: Advanced Features (Future)**

1. **Offline Support** - IndexedDB + sync queue
2. **Voice-to-Text** - Hands-free timeline logging
3. **Music Wave Model** - Spotify/Apple Music integration
4. **Touch Consent Log** - Real-time consent tracking

---

## SUCCESS METRICS

1. **Data Completeness:** 95%+ of sessions have complete timeline (no missing timestamps)
2. **Provider Satisfaction:** "Timeline tracking saves me 15+ minutes per session" (survey)
3. **Safety:** 100% of critical vital alerts acknowledged within 2 minutes
4. **Performance:** Timeline form loads in <500ms even with 200+ events

---

## NEXT STEPS

1. **ANALYST:** Review this analysis, validate against VoC research
2. **SOOP:** Review proposed database schema, optimize indexes
3. **DESIGNER:** Create UI mockups for SessionTimelineForm (follow SessionVitalsForm visual language)
4. **BUILDER:** Implement Phase 1 MVP (SessionTimelineForm + multi-substance DosingProtocolForm)
5. **INSPECTOR:** QA audit - verify no PHI leakage in timeline logs, test performance with 500+ events

---

## APPENDIX A: Key Quotes from Research

### From Doctor Interview:
> "We're on the fly... we've got a week, we've got sunset, we've got singing, dancing... we're in a clinical setting with limited time"

**Translation:** Providers need FAST data entry, not complex forms.

> "Respiratory rate is 16, heart rate is 122, baseline was 84... should we add 75mg ketamine IM?"

**Translation:** Need real-time decision support based on vital trends.

### From SESSIONS.md:
> "Blood pressure and heart rate are recorded at predetermined intervals (e.g., prior to dosing, every 30 minutes for the first two hours, and hourly thereafter)"

**Translation:** Our SessionVitalsForm already supports this with repeatable readings.

> "If a patient exhibits a sustained systolic blood pressure over 200 mmHg... emergency medical transfer protocols are initiated"

**Translation:** Need automated critical alerts (Phase 2 feature).

---

## APPENDIX B: Comparison to Existing Forms

| Feature | SessionVitalsForm (Current) | SessionTimelineForm (Proposed) |
|---------|----------------------------|-------------------------------|
| **Repeatable** | ✅ Yes (add multiple readings) | ✅ Yes (add multiple events) |
| **Auto-save** | ✅ Yes (500ms debounce) | ✅ Yes (same pattern) |
| **Timestamp** | ✅ datetime-local input + "Now" button | ✅ Same pattern |
| **Color-coded status** | ✅ Yes (normal/elevated/critical) | ⚠️ Event type badges instead |
| **Quick-entry** | ✅ VitalPresetsBar | ✅ Event type buttons |
| **Mobile responsive** | ✅ Yes (1→3 col grid) | ✅ Yes (same grid) |
| **Accessibility** | ✅ WCAG AAA | ✅ WCAG AAA |

**Conclusion:** SessionTimelineForm is a **straightforward adaptation** of proven SessionVitalsForm pattern. Low implementation risk.

---

**PRODDY SIGN-OFF:** This analysis demonstrates that our current architecture is **production-ready** for high-frequency session tracking with **minor enhancements**. The SessionVitalsForm pattern provides a proven blueprint. Recommend proceeding with Phase 1 MVP immediately.

**Routing:** Moving to ANALYST for validation, then to SOOP for schema review, then to DESIGNER for UI mockups.
