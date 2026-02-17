---
id: WO-063
status: 03_BUILD
priority: P1 (Critical)
category: Database / Schema / Wellness Journey
owner: INSPECTOR
failure_count: 0
created_date: 2026-02-16T16:30:00-08:00
estimated_complexity: 5/10
estimated_timeline: 2-3 days
strategic_alignment: Wellness Journey "Augmented Intelligence" System
---

# User Request

Create database tables and SQL functions to support the 3-phase Wellness Journey (Preparation, Dosing Session, Integration) with longitudinal tracking of integration milestones, behavioral changes, and daily pulse checks.

## Strategic Context

**From Research:** "The goal is to continue to refine what was a simple data entry form into an **'augmented intelligence' tool** - a sophisticated clinical decision support system that provides practitioners with real-time data visualization and comparative benchmarks."

**Impact:** Enables longitudinal tracking of patient outcomes over 6 months, compliance monitoring, and personalized insights based on behavioral patterns.

---

## THE BLAST RADIUS (Authorized Target Area)

### New Files to Create

**Database Migrations:**
- `migrations/044_add_integration_sessions.sql` - Integration session tracking
- `migrations/045_add_behavioral_changes.sql` - Behavioral change logging
- `migrations/046_add_pulse_checks.sql` - Daily pulse check tracking
- `migrations/047_add_wellness_journey_functions.sql` - SQL functions for calculations

### Files to Modify

**None** - This is purely additive (new tables only)

---

## ⚡ THE ELECTRIC FENCE (Strict "DO NOT TOUCH" Constraints)

**DO NOT:**
- Modify existing tables (`log_sessions`, `log_protocols`, etc.)
- Change existing RLS policies
- Collect PHI/PII (no patient names, addresses, identifiers)
- Create UPDATE or DELETE policies (audit trail must be immutable where applicable)

**MUST:**
- Follow `log_` prefix convention for data-storing tables
- Enable RLS on all new tables
- Create indexes for performance
- Use UUID primary keys
- Include `created_at` timestamps

---

## 📋 TECHNICAL SPECIFICATION

### Database Schema

#### **Table 1: `log_integration_sessions`**

**Purpose:** Track integration therapy sessions, assessments, and pulse checks over the 6-month integration period.

```sql
CREATE TABLE log_integration_sessions (
    integration_session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES log_sessions(session_id) ON DELETE CASCADE,
    patient_id UUID NOT NULL,
    practitioner_id UUID REFERENCES auth.users(id),
    
    -- SESSION DETAILS
    session_number INTEGER NOT NULL, -- 1, 2, 3, etc.
    session_date DATE NOT NULL,
    session_type VARCHAR(50) NOT NULL CHECK (session_type IN (
        'PULSE_CHECK',
        'PHQ9_ASSESSMENT',
        'GAD7_ASSESSMENT',
        'WHOQOL_BREF',
        'PSQI_ASSESSMENT',
        'INTEGRATION_THERAPY',
        'FOLLOW_UP_CALL'
    )),
    
    -- COMPLETION STATUS
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- ASSESSMENT SCORES (if applicable)
    phq9_score INTEGER,
    gad7_score INTEGER,
    whoqol_bref_score INTEGER,
    psqi_score INTEGER,
    
    -- NOTES
    session_notes TEXT,
    
    -- METADATA
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_integration_sessions_session_id ON log_integration_sessions(session_id);
CREATE INDEX idx_integration_sessions_patient_id ON log_integration_sessions(patient_id);
CREATE INDEX idx_integration_sessions_date ON log_integration_sessions(session_date);

-- RLS Policies
ALTER TABLE log_integration_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own integration sessions"
    ON log_integration_sessions FOR SELECT
    USING (auth.uid() = practitioner_id);

CREATE POLICY "Users can insert own integration sessions"
    ON log_integration_sessions FOR INSERT
    WITH CHECK (auth.uid() = practitioner_id);

CREATE POLICY "Users can update own integration sessions"
    ON log_integration_sessions FOR UPDATE
    USING (auth.uid() = practitioner_id);
```

---

#### **Table 2: `log_behavioral_changes`**

**Purpose:** Track behavioral changes reported by patients during integration (e.g., "Started meditation practice", "Quit smoking", "New job").

```sql
CREATE TABLE log_behavioral_changes (
    change_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL,
    practitioner_id UUID REFERENCES auth.users(id),
    session_id UUID REFERENCES log_sessions(session_id) ON DELETE CASCADE,
    
    -- CHANGE DETAILS
    change_type VARCHAR(50) NOT NULL CHECK (change_type IN (
        'RELATIONSHIP',      -- "Reconnected with father"
        'HABIT',            -- "Started meditation practice", "Quit smoking"
        'EMPLOYMENT',       -- "New job", "Promotion"
        'HEALTH',           -- "Started exercising", "Improved diet"
        'SOCIAL',           -- "Joined support group", "Made new friends"
        'CREATIVE',         -- "Started painting", "Began journaling"
        'OTHER'
    )),
    change_description TEXT NOT NULL,
    
    -- TIMING
    change_date DATE NOT NULL,
    days_post_session INTEGER, -- Calculated: change_date - session_date
    
    -- SENTIMENT
    change_sentiment VARCHAR(20) CHECK (change_sentiment IN (
        'POSITIVE',
        'NEGATIVE',
        'NEUTRAL'
    )) DEFAULT 'POSITIVE',
    
    -- METADATA
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_behavioral_changes_patient_id ON log_behavioral_changes(patient_id);
CREATE INDEX idx_behavioral_changes_session_id ON log_behavioral_changes(session_id);
CREATE INDEX idx_behavioral_changes_date ON log_behavioral_changes(change_date);

-- RLS Policies
ALTER TABLE log_behavioral_changes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own behavioral changes"
    ON log_behavioral_changes FOR SELECT
    USING (auth.uid() = practitioner_id);

CREATE POLICY "Users can insert own behavioral changes"
    ON log_behavioral_changes FOR INSERT
    WITH CHECK (auth.uid() = practitioner_id);

-- No UPDATE or DELETE - immutable audit trail
```

---

#### **Table 3: `log_pulse_checks`**

**Purpose:** Track daily "pulse checks" (quick mood/sleep/connection assessments) during integration period.

```sql
CREATE TABLE log_pulse_checks (
    pulse_check_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL,
    practitioner_id UUID REFERENCES auth.users(id),
    session_id UUID REFERENCES log_sessions(session_id) ON DELETE CASCADE,
    
    -- CHECK DETAILS
    check_date DATE NOT NULL,
    days_post_session INTEGER, -- Calculated: check_date - session_date
    
    -- PULSE CHECK QUESTIONS (1-5 scale)
    connection_level INTEGER CHECK (connection_level BETWEEN 1 AND 5),
    sleep_quality INTEGER CHECK (sleep_quality BETWEEN 1 AND 5),
    mood_level INTEGER CHECK (mood_level BETWEEN 1 AND 5),
    energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 5),
    
    -- OPTIONAL NOTES
    notes TEXT,
    
    -- METADATA
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_pulse_checks_patient_id ON log_pulse_checks(patient_id);
CREATE INDEX idx_pulse_checks_session_id ON log_pulse_checks(session_id);
CREATE INDEX idx_pulse_checks_date ON log_pulse_checks(check_date);

-- RLS Policies
ALTER TABLE log_pulse_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own pulse checks"
    ON log_pulse_checks FOR SELECT
    USING (auth.uid() = practitioner_id);

CREATE POLICY "Users can insert own pulse checks"
    ON log_pulse_checks FOR INSERT
    WITH CHECK (auth.uid() = practitioner_id);

-- No UPDATE or DELETE - immutable audit trail
```

---

### SQL Functions

#### **Function 1: `calculate_compliance_score()`**

**Purpose:** Calculate compliance score based on pulse checks, assessments, and integration sessions completed.

```sql
CREATE OR REPLACE FUNCTION calculate_compliance_score(
    p_session_id UUID,
    p_days_post_session INTEGER DEFAULT 180
)
RETURNS TABLE (
    pulse_check_count INTEGER,
    pulse_check_percentage DECIMAL(5, 2),
    assessment_count INTEGER,
    assessment_percentage DECIMAL(5, 2),
    integration_session_count INTEGER,
    integration_session_percentage DECIMAL(5, 2),
    overall_compliance_score INTEGER
) AS $$
DECLARE
    v_expected_pulse_checks INTEGER := p_days_post_session;
    v_expected_assessments INTEGER := CEIL(p_days_post_session / 7.0); -- Weekly
    v_expected_integration_sessions INTEGER := CEIL(p_days_post_session / 30.0); -- Monthly
BEGIN
    RETURN QUERY
    SELECT 
        -- Pulse checks
        (SELECT COUNT(*)::INTEGER FROM log_pulse_checks WHERE session_id = p_session_id),
        (SELECT COUNT(*)::DECIMAL / v_expected_pulse_checks * 100 FROM log_pulse_checks WHERE session_id = p_session_id),
        
        -- Assessments (PHQ-9, GAD-7, etc.)
        (SELECT COUNT(*)::INTEGER FROM log_integration_sessions 
         WHERE session_id = p_session_id 
         AND session_type IN ('PHQ9_ASSESSMENT', 'GAD7_ASSESSMENT', 'WHOQOL_BREF', 'PSQI_ASSESSMENT')),
        (SELECT COUNT(*)::DECIMAL / v_expected_assessments * 100 FROM log_integration_sessions 
         WHERE session_id = p_session_id 
         AND session_type IN ('PHQ9_ASSESSMENT', 'GAD7_ASSESSMENT', 'WHOQOL_BREF', 'PSQI_ASSESSMENT')),
        
        -- Integration therapy sessions
        (SELECT COUNT(*)::INTEGER FROM log_integration_sessions 
         WHERE session_id = p_session_id 
         AND session_type = 'INTEGRATION_THERAPY'),
        (SELECT COUNT(*)::DECIMAL / v_expected_integration_sessions * 100 FROM log_integration_sessions 
         WHERE session_id = p_session_id 
         AND session_type = 'INTEGRATION_THERAPY'),
        
        -- Overall compliance score (weighted average)
        (
            (SELECT COUNT(*)::DECIMAL / v_expected_pulse_checks * 100 FROM log_pulse_checks WHERE session_id = p_session_id) * 0.4 +
            (SELECT COUNT(*)::DECIMAL / v_expected_assessments * 100 FROM log_integration_sessions 
             WHERE session_id = p_session_id 
             AND session_type IN ('PHQ9_ASSESSMENT', 'GAD7_ASSESSMENT', 'WHOQOL_BREF', 'PSQI_ASSESSMENT')) * 0.4 +
            (SELECT COUNT(*)::DECIMAL / v_expected_integration_sessions * 100 FROM log_integration_sessions 
             WHERE session_id = p_session_id 
             AND session_type = 'INTEGRATION_THERAPY') * 0.2
        )::INTEGER;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

#### **Function 2: `get_integration_milestones()`**

**Purpose:** Get timeline of integration milestones (pulse checks, assessments, therapy sessions) for display.

```sql
CREATE OR REPLACE FUNCTION get_integration_milestones(p_session_id UUID)
RETURNS TABLE (
    milestone_date DATE,
    milestone_type VARCHAR,
    milestone_description VARCHAR,
    completed BOOLEAN,
    days_post_session INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        session_date AS milestone_date,
        session_type AS milestone_type,
        CASE 
            WHEN session_type = 'PULSE_CHECK' THEN 'Daily Pulse Check'
            WHEN session_type = 'PHQ9_ASSESSMENT' THEN 'PHQ-9 Assessment'
            WHEN session_type = 'GAD7_ASSESSMENT' THEN 'GAD-7 Assessment'
            WHEN session_type = 'WHOQOL_BREF' THEN 'Quality of Life Assessment'
            WHEN session_type = 'PSQI_ASSESSMENT' THEN 'Sleep Quality Assessment'
            WHEN session_type = 'INTEGRATION_THERAPY' THEN 'Integration Therapy Session'
            WHEN session_type = 'FOLLOW_UP_CALL' THEN 'Follow-up Call'
            ELSE session_type
        END AS milestone_description,
        completed,
        EXTRACT(DAY FROM (session_date - (SELECT session_date FROM log_sessions WHERE session_id = p_session_id)))::INTEGER AS days_post_session
    FROM log_integration_sessions
    WHERE session_id = p_session_id
    ORDER BY session_date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

#### **Function 3: `get_behavioral_changes_summary()`**

**Purpose:** Get summary of behavioral changes by type for Quality of Life card.

```sql
CREATE OR REPLACE FUNCTION get_behavioral_changes_summary(p_session_id UUID)
RETURNS TABLE (
    change_type VARCHAR,
    change_count INTEGER,
    recent_changes TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        bc.change_type,
        COUNT(*)::INTEGER AS change_count,
        ARRAY_AGG(bc.change_description ORDER BY bc.change_date DESC)::TEXT[] AS recent_changes
    FROM log_behavioral_changes bc
    WHERE bc.session_id = p_session_id
    AND bc.change_sentiment = 'POSITIVE'
    GROUP BY bc.change_type
    ORDER BY change_count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## ✅ ACCEPTANCE CRITERIA

### Database Tables
- [ ] `log_integration_sessions` table created
- [ ] `log_behavioral_changes` table created
- [ ] `log_pulse_checks` table created
- [ ] All tables use `log_` prefix
- [ ] All tables have UUID primary keys
- [ ] All tables have `created_at` timestamps
- [ ] Indexes created for performance

### RLS Policies
- [ ] RLS enabled on all 3 tables
- [ ] SELECT policies allow users to view own data
- [ ] INSERT policies allow users to insert own data
- [ ] UPDATE policies only on `log_integration_sessions` (others immutable)
- [ ] No DELETE policies (audit trail)

### SQL Functions
- [ ] `calculate_compliance_score()` function works
- [ ] `get_integration_milestones()` function works
- [ ] `get_behavioral_changes_summary()` function works
- [ ] All functions use SECURITY DEFINER
- [ ] All functions return correct data types

### Data Integrity
- [ ] Foreign keys reference correct tables
- [ ] CHECK constraints enforce valid values
- [ ] No PHI/PII collected
- [ ] Immutable audit trail (no UPDATE/DELETE where applicable)

---

## 📝 MANDATORY COMPLIANCE

### SECURITY & PRIVACY
- No PHI/PII collection
- RLS policies enforced
- Immutable audit trail for behavioral changes and pulse checks
- SECURITY DEFINER on all functions

### NAMING CONVENTIONS
- `log_` prefix for data-storing tables
- `ref_` prefix for reference tables (none in this WO)
- Snake_case for all identifiers
- Descriptive column names

### PERFORMANCE
- Indexes on foreign keys
- Indexes on date columns
- Indexes on frequently queried columns

---

## 🚦 Status

**INBOX** - Awaiting LEAD architectural review and assignment

---

## 📖 NOTES

**Strategic Importance:**
These tables enable the **longitudinal tracking** that differentiates PPN from competitors like Osmind. The Wellness Journey becomes a true "augmented intelligence" tool by tracking:
- **Compliance:** Are patients completing pulse checks and assessments?
- **Behavioral Changes:** What life improvements are happening?
- **Integration Milestones:** Are patients on track for sustained improvement?

**Implementation Priority:**
1. `log_pulse_checks` (highest frequency data)
2. `log_integration_sessions` (assessment tracking)
3. `log_behavioral_changes` (qualitative insights)
4. SQL functions (calculations for frontend)

**Future Enhancements:**
- ML analysis of pulse check patterns
- Predictive alerts for relapse risk
- Personalized insights ("Your anxiety drops 40% on weeks with nature walks")

---

## Dependencies

**Prerequisites:**
- `log_sessions` table exists
- `auth.users` table exists

**Related Features:**
- Wellness Journey page (DESIGNER implementing UI)
- Compliance Metrics component
- Integration Milestones component
- Quality of Life Improvements component

---

## Estimated Timeline

- **Table creation:** 2-3 hours
- **RLS policies:** 1-2 hours
- **SQL functions:** 3-4 hours
- **Testing:** 2 hours
- **Documentation:** 1 hour

**Total:** 9-12 hours (1-2 days)

---

**INSPECTOR STATUS:** ✅ Work order created. Awaiting LEAD triage and assignment to SOOP.

---

## 🏗️ LEAD ARCHITECTURE

### Strategic Assessment

This database schema is **critical infrastructure** for the Wellness Journey "augmented intelligence" system. The three tables (`log_integration_sessions`, `log_behavioral_changes`, `log_pulse_checks`) enable longitudinal tracking that differentiates PPN from competitors.

### Technical Strategy

**Implementation Approach:**
1. **Create migrations in sequence** (044 → 045 → 046 → 047)
2. **Test each migration independently** in Supabase SQL Editor before committing
3. **Verify RLS policies** using test queries
4. **Validate SQL functions** with sample data

**Migration File Structure:**
```
migrations/
├── 044_add_integration_sessions.sql
├── 045_add_behavioral_changes.sql
├── 046_add_pulse_checks.sql
└── 047_add_wellness_journey_functions.sql
```

### Key Architectural Decisions

**1. Immutability Strategy**
- `log_behavioral_changes`: NO UPDATE/DELETE policies (immutable audit trail)
- `log_pulse_checks`: NO UPDATE/DELETE policies (immutable audit trail)
- `log_integration_sessions`: UPDATE allowed (sessions can be marked complete)

**2. Foreign Key Cascade**
- All tables use `ON DELETE CASCADE` for `session_id` reference
- If a dosing session is deleted, all integration data is deleted
- This maintains referential integrity

**3. Performance Optimization**
- Indexes on `patient_id`, `session_id`, and date columns
- SECURITY DEFINER on functions for RLS bypass (safe for aggregations)
- Calculated fields (`days_post_session`) for efficient querying

**4. Data Validation**
- CHECK constraints on enum fields (session_type, change_type, etc.)
- CHECK constraints on score ranges (1-5 for pulse checks)
- NOT NULL on critical fields

### Risk Mitigation

**Potential Issues:**
1. **Missing `log_sessions` table** - Verify it exists before running migrations
2. **RLS policy conflicts** - Test with actual user auth tokens
3. **Function performance** - Monitor query execution time on large datasets
4. **Data type mismatches** - Ensure INTEGER vs DECIMAL consistency

**Testing Protocol:**
```sql
-- Test 1: Insert integration session
INSERT INTO log_integration_sessions (session_id, patient_id, practitioner_id, session_number, session_date, session_type)
VALUES ('[test_session_id]', '[test_patient_id]', auth.uid(), 1, CURRENT_DATE, 'PULSE_CHECK');

-- Test 2: Verify RLS
SELECT * FROM log_integration_sessions WHERE practitioner_id = auth.uid();

-- Test 3: Test compliance function
SELECT * FROM calculate_compliance_score('[test_session_id]', 30);
```

### Files to Create

**Exact file paths:**
- `/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/migrations/044_add_integration_sessions.sql`
- `/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/migrations/045_add_behavioral_changes.sql`
- `/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/migrations/046_add_pulse_checks.sql`
- `/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/migrations/047_add_wellness_journey_functions.sql`

### Success Criteria

**Before moving to QA:**
- [ ] All 4 migration files created
- [ ] Migrations run successfully in Supabase
- [ ] RLS policies tested with `auth.uid()`
- [ ] SQL functions return expected results
- [ ] No console errors or warnings
- [ ] Documentation updated

### Dependencies

**Prerequisites (VERIFY FIRST):**
- `log_sessions` table exists with `session_id` UUID primary key
- `auth.users` table exists (Supabase default)

**Downstream Impact:**
- WO-056 (Wellness Journey UI) will consume these tables
- Frontend components will call SQL functions via Supabase client

---

**LEAD APPROVAL:** ✅ Routed to INSPECTOR for database implementation.
