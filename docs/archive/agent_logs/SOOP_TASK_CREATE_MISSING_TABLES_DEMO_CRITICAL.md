# 🗄️ SOOP TASK: Create Missing Tables for Demo & New Use Cases
## CRITICAL: Fix Protocol Builder 404 + Enable Future Features

**Assigned To:** SOOP  
**Created By:** LEAD  
**Date:** 2026-02-12 06:15 PST  
**Priority:** 🔴 CRITICAL (Demo blocker) + 🟡 HIGH (Future features)  
**Estimated Time:** 3-4 hours  
**Demo Date:** Feb 15, 2026 (2 days away)

---

## 📊 CONTEXT

**Problem:**
1. **CRITICAL:** Protocol Builder has 404 error fetching `ref_medications` (table doesn't exist)
2. **HIGH:** New VoC-aligned use cases need database tables (Session Logger, Supervision Exchange, Integration Hub)

**Impact:**
- Protocol Builder "Therapeutic Context" section fails to load
- Cannot implement new features without schema support

**Strategic Context:**
Read these documents FIRST:
- `SOOP_STRATEGIC_BRIEF_DATABASE_FOR_UX.md` (your strategic brief)
- `USE_CASES_VOC_ALIGNED_2026.md` (what features need what data)
- `DESIGNER_STRATEGIC_BRIEF_VoC_DRIVEN_UX.md` (how DESIGNER will use your tables)

---

## 🎯 OBJECTIVES

### **Phase 1: CRITICAL - Fix Protocol Builder (Demo Blocker)**
Create `ref_medications` table to fix 404 error

### **Phase 2: HIGH - Enable New Use Cases (Post-Demo)**
Create tables for:
1. Session Logger (Use Case 6)
2. Supervision Exchange (Use Case 7)
3. Integration Hub (Use Case 8)

---

## 🔴 PHASE 1: CRITICAL - Create `ref_medications` Table

### **Requirements:**

**Table Purpose:**
Store medication reference data for Protocol Builder dropdown (concomitant medications field)

**Schema Design:**
```sql
CREATE TABLE ref_medications (
  medication_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  medication_name TEXT NOT NULL UNIQUE,
  
  -- Drug classification
  drug_class TEXT,  -- 'SSRI', 'SNRI', 'Benzodiazepine', 'Antipsychotic', etc.
  
  -- RxNorm integration (for standardization)
  rxnorm_cui BIGINT,  -- RxNorm Concept Unique Identifier
  
  -- Interaction warnings
  has_contraindication BOOLEAN DEFAULT FALSE,
  contraindication_notes TEXT,
  
  -- Metadata
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_medications_name ON ref_medications(medication_name);
CREATE INDEX idx_medications_class ON ref_medications(drug_class);
CREATE INDEX idx_medications_active ON ref_medications(is_active) WHERE is_active = TRUE;
```

### **RLS Policies:**

```sql
-- Enable RLS
ALTER TABLE ref_medications ENABLE ROW LEVEL SECURITY;

-- Read policy: all authenticated users can read
CREATE POLICY ref_medications_read ON ref_medications
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Write policy: only network_admin can modify
CREATE POLICY ref_medications_write ON ref_medications
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_sites
      WHERE user_sites.user_id = auth.uid()
        AND user_sites.role = 'network_admin'
    )
  );
```

### **Seed Data:**

Populate with common psychiatric medications:

```sql
INSERT INTO ref_medications (medication_name, drug_class, has_contraindication, contraindication_notes) VALUES
  -- SSRIs
  ('Fluoxetine (Prozac)', 'SSRI', FALSE, NULL),
  ('Sertraline (Zoloft)', 'SSRI', FALSE, NULL),
  ('Escitalopram (Lexapro)', 'SSRI', FALSE, NULL),
  ('Paroxetine (Paxil)', 'SSRI', FALSE, NULL),
  ('Citalopram (Celexa)', 'SSRI', FALSE, NULL),
  
  -- SNRIs
  ('Venlafaxine (Effexor)', 'SNRI', FALSE, NULL),
  ('Duloxetine (Cymbalta)', 'SNRI', FALSE, NULL),
  
  -- Benzodiazepines (potential contraindication)
  ('Alprazolam (Xanax)', 'Benzodiazepine', TRUE, 'May reduce efficacy of psychedelic therapy'),
  ('Lorazepam (Ativan)', 'Benzodiazepine', TRUE, 'May reduce efficacy of psychedelic therapy'),
  ('Clonazepam (Klonopin)', 'Benzodiazepine', TRUE, 'May reduce efficacy of psychedelic therapy'),
  ('Diazepam (Valium)', 'Benzodiazepine', TRUE, 'May reduce efficacy of psychedelic therapy'),
  
  -- Antipsychotics (contraindication)
  ('Quetiapine (Seroquel)', 'Antipsychotic', TRUE, 'May block psychedelic effects'),
  ('Olanzapine (Zyprexa)', 'Antipsychotic', TRUE, 'May block psychedelic effects'),
  ('Risperidone (Risperdal)', 'Antipsychotic', TRUE, 'May block psychedelic effects'),
  ('Aripiprazole (Abilify)', 'Antipsychotic', TRUE, 'May block psychedelic effects'),
  
  -- Mood Stabilizers
  ('Lithium', 'Mood Stabilizer', FALSE, NULL),
  ('Lamotrigine (Lamictal)', 'Mood Stabilizer', FALSE, NULL),
  ('Valproate (Depakote)', 'Mood Stabilizer', FALSE, NULL),
  
  -- Stimulants
  ('Methylphenidate (Ritalin)', 'Stimulant', FALSE, NULL),
  ('Amphetamine (Adderall)', 'Stimulant', FALSE, NULL),
  ('Lisdexamfetamine (Vyvanse)', 'Stimulant', FALSE, NULL),
  
  -- Other
  ('Bupropion (Wellbutrin)', 'NDRI', FALSE, NULL),
  ('Mirtazapine (Remeron)', 'Tetracyclic', FALSE, NULL),
  ('Trazodone (Desyrel)', 'SARI', FALSE, NULL);
```

### **Migration File:**

**Filename:** `20260212141500_create_ref_medications.sql`

**Location:** `/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/migrations/`

**Contents:**
```sql
-- Migration: Create ref_medications table
-- Date: 2026-02-12
-- Author: SOOP
-- Purpose: Fix Protocol Builder 404 error, enable medication tracking

-- Create table
CREATE TABLE ref_medications (
  medication_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  medication_name TEXT NOT NULL UNIQUE,
  drug_class TEXT,
  rxnorm_cui BIGINT,
  has_contraindication BOOLEAN DEFAULT FALSE,
  contraindication_notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_medications_name ON ref_medications(medication_name);
CREATE INDEX idx_medications_class ON ref_medications(drug_class);
CREATE INDEX idx_medications_active ON ref_medications(is_active) WHERE is_active = TRUE;

-- Enable RLS
ALTER TABLE ref_medications ENABLE ROW LEVEL SECURITY;

-- Read policy: all authenticated users
CREATE POLICY ref_medications_read ON ref_medications
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Write policy: network_admin only
CREATE POLICY ref_medications_write ON ref_medications
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_sites
      WHERE user_sites.user_id = auth.uid()
        AND user_sites.role = 'network_admin'
    )
  );

-- Seed data
INSERT INTO ref_medications (medication_name, drug_class, has_contraindication, contraindication_notes) VALUES
  ('Fluoxetine (Prozac)', 'SSRI', FALSE, NULL),
  ('Sertraline (Zoloft)', 'SSRI', FALSE, NULL),
  ('Escitalopram (Lexapro)', 'SSRI', FALSE, NULL),
  ('Paroxetine (Paxil)', 'SSRI', FALSE, NULL),
  ('Citalopram (Celexa)', 'SSRI', FALSE, NULL),
  ('Venlafaxine (Effexor)', 'SNRI', FALSE, NULL),
  ('Duloxetine (Cymbalta)', 'SNRI', FALSE, NULL),
  ('Alprazolam (Xanax)', 'Benzodiazepine', TRUE, 'May reduce efficacy of psychedelic therapy'),
  ('Lorazepam (Ativan)', 'Benzodiazepine', TRUE, 'May reduce efficacy of psychedelic therapy'),
  ('Clonazepam (Klonopin)', 'Benzodiazepine', TRUE, 'May reduce efficacy of psychedelic therapy'),
  ('Diazepam (Valium)', 'Benzodiazepine', TRUE, 'May reduce efficacy of psychedelic therapy'),
  ('Quetiapine (Seroquel)', 'Antipsychotic', TRUE, 'May block psychedelic effects'),
  ('Olanzapine (Zyprexa)', 'Antipsychotic', TRUE, 'May block psychedelic effects'),
  ('Risperidone (Risperdal)', 'Antipsychotic', TRUE, 'May block psychedelic effects'),
  ('Aripiprazole (Abilify)', 'Antipsychotic', TRUE, 'May block psychedelic effects'),
  ('Lithium', 'Mood Stabilizer', FALSE, NULL),
  ('Lamotrigine (Lamictal)', 'Mood Stabilizer', FALSE, NULL),
  ('Valproate (Depakote)', 'Mood Stabilizer', FALSE, NULL),
  ('Methylphenidate (Ritalin)', 'Stimulant', FALSE, NULL),
  ('Amphetamine (Adderall)', 'Stimulant', FALSE, NULL),
  ('Lisdexamfetamine (Vyvanse)', 'Stimulant', FALSE, NULL),
  ('Bupropion (Wellbutrin)', 'NDRI', FALSE, NULL),
  ('Mirtazapine (Remeron)', 'Tetracyclic', FALSE, NULL),
  ('Trazodone (Desyrel)', 'SARI', FALSE, NULL);

-- Rollback instructions (as comment)
-- To rollback: DROP TABLE ref_medications CASCADE;
```

### **Testing:**

After migration, verify:
```sql
-- Check table exists
SELECT COUNT(*) FROM ref_medications;
-- Expected: 24 rows

-- Check RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'ref_medications';
-- Expected: rowsecurity = true

-- Check policies exist
SELECT policyname FROM pg_policies WHERE tablename = 'ref_medications';
-- Expected: ref_medications_read, ref_medications_write

-- Test query (as authenticated user)
SELECT medication_name, drug_class, has_contraindication 
FROM ref_medications 
WHERE is_active = TRUE 
ORDER BY medication_name;
-- Expected: 24 rows returned
```

---

## 🟡 PHASE 2: HIGH PRIORITY - New Use Case Tables

### **Use Case 6: Session Logger Tables**

**Tables Needed:**
1. `session_events` - Individual logged events during 6-8 hour sessions
2. `ref_event_types` - Reference table for event types (Distress, Breakthrough, etc.)

**Migration File:** `20260212142000_create_session_logger_tables.sql`

**Schema:**
```sql
-- Reference table for event types
CREATE TABLE ref_event_types (
  event_type_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  event_name TEXT NOT NULL UNIQUE,
  color_code TEXT,  -- Hex color for UX (e.g., '#f43f5e')
  icon_name TEXT,   -- Icon name for UX (e.g., 'AlertTriangle')
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Session events table
CREATE TABLE session_events (
  event_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  protocol_id BIGINT REFERENCES log_clinical_records(record_id) ON DELETE CASCADE,
  event_type_id BIGINT REFERENCES ref_event_types(event_type_id),
  
  -- Event details
  event_timestamp TIMESTAMPTZ NOT NULL,
  intensity_level INT CHECK (intensity_level BETWEEN 1 AND 10),
  notes TEXT,  -- Structured notes only
  
  -- Metadata
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_events_protocol ON session_events(protocol_id, event_timestamp);
CREATE INDEX idx_events_type ON session_events(event_type_id);
CREATE INDEX idx_events_timestamp ON session_events(event_timestamp);

-- RLS
ALTER TABLE session_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ref_event_types ENABLE ROW LEVEL SECURITY;

-- Read policy: site members can read their site's events
CREATE POLICY session_events_read ON session_events
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_sites us
      JOIN log_clinical_records lcr ON lcr.site_id = us.site_id
      WHERE us.user_id = auth.uid()
        AND lcr.record_id = session_events.protocol_id
    )
  );

-- Write policy: clinicians can insert events for their site
CREATE POLICY session_events_insert ON session_events
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_sites us
      JOIN log_clinical_records lcr ON lcr.site_id = us.site_id
      WHERE us.user_id = auth.uid()
        AND us.role IN ('clinician', 'site_admin')
        AND lcr.record_id = session_events.protocol_id
    )
  );

-- Ref table policies
CREATE POLICY ref_event_types_read ON ref_event_types
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY ref_event_types_write ON ref_event_types
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_sites
      WHERE user_sites.user_id = auth.uid()
        AND user_sites.role = 'network_admin'
    )
  );

-- Seed event types
INSERT INTO ref_event_types (event_name, color_code, icon_name) VALUES
  ('Distress', '#f43f5e', 'AlertTriangle'),
  ('Breakthrough', '#10b981', 'Sparkles'),
  ('Music Change', '#3b82f6', 'Music'),
  ('Vital Signs Check', '#f59e0b', 'Activity'),
  ('Booster Dose', '#8b5cf6', 'Pill'),
  ('Bathroom Break', '#64748b', 'User'),
  ('Integration Moment', '#06b6d4', 'Lightbulb'),
  ('Peak Experience', '#ec4899', 'Star');
```

---

### **Use Case 7: Supervision Exchange Tables**

**Tables Needed:**
1. `practitioner_profiles` - Searchable directory of practitioners
2. `supervision_relationships` - Dyad matching (supervisor ↔ supervisee)
3. `supervision_circles` - Small group cohorts
4. `circle_members` - Junction table for circle membership

**Migration File:** `20260212142500_create_supervision_exchange_tables.sql`

**Schema:**
```sql
-- Practitioner profiles
CREATE TABLE practitioner_profiles (
  profile_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  
  -- Searchable fields
  specialties TEXT[],  -- Array: ['PTSD', 'TRD', 'Integration']
  modalities TEXT[],   -- Array: ['Ketamine', 'Psilocybin', 'MDMA']
  years_experience INT CHECK (years_experience >= 0),
  hourly_rate NUMERIC(10,2) CHECK (hourly_rate >= 0),
  
  -- Availability
  is_accepting_supervision BOOLEAN DEFAULT TRUE,
  max_supervisees INT DEFAULT 5,
  bio TEXT,  -- Short bio (max 500 chars)
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Supervision relationships (dyads)
CREATE TABLE supervision_relationships (
  relationship_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  supervisor_id BIGINT REFERENCES practitioner_profiles(profile_id) ON DELETE CASCADE,
  supervisee_id BIGINT REFERENCES practitioner_profiles(profile_id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
  
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT no_self_supervision CHECK (supervisor_id != supervisee_id)
);

-- Supervision circles
CREATE TABLE supervision_circles (
  circle_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  circle_name TEXT NOT NULL,
  max_members INT DEFAULT 8,
  meeting_frequency TEXT,  -- 'monthly', 'biweekly', 'weekly'
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Circle members (junction table)
CREATE TABLE circle_members (
  circle_id BIGINT REFERENCES supervision_circles(circle_id) ON DELETE CASCADE,
  profile_id BIGINT REFERENCES practitioner_profiles(profile_id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  
  PRIMARY KEY (circle_id, profile_id)
);

-- Indexes
CREATE INDEX idx_profiles_specialties ON practitioner_profiles USING GIN(specialties);
CREATE INDEX idx_profiles_modalities ON practitioner_profiles USING GIN(modalities);
CREATE INDEX idx_profiles_accepting ON practitioner_profiles(is_accepting_supervision) WHERE is_accepting_supervision = TRUE;
CREATE INDEX idx_relationships_supervisor ON supervision_relationships(supervisor_id);
CREATE INDEX idx_relationships_supervisee ON supervision_relationships(supervisee_id);
CREATE INDEX idx_relationships_status ON supervision_relationships(status);

-- RLS
ALTER TABLE practitioner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE supervision_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE supervision_circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_members ENABLE ROW LEVEL SECURITY;

-- Profiles: all authenticated users can read, own profile can update
CREATE POLICY profiles_read ON practitioner_profiles
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY profiles_update ON practitioner_profiles
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY profiles_insert ON practitioner_profiles
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Relationships: participants can read, supervisee can create
CREATE POLICY relationships_read ON supervision_relationships
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM practitioner_profiles
      WHERE (profile_id = supervision_relationships.supervisor_id OR profile_id = supervision_relationships.supervisee_id)
        AND user_id = auth.uid()
    )
  );

CREATE POLICY relationships_insert ON supervision_relationships
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM practitioner_profiles
      WHERE profile_id = supervision_relationships.supervisee_id
        AND user_id = auth.uid()
    )
  );

-- Circles: all authenticated can read, members can update
CREATE POLICY circles_read ON supervision_circles
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY circle_members_read ON circle_members
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY circle_members_insert ON circle_members
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM practitioner_profiles
      WHERE profile_id = circle_members.profile_id
        AND user_id = auth.uid()
    )
  );
```

---

### **Use Case 8: Integration Hub Tables**

**Tables Needed:**
1. `integration_homework` - Homework assignments
2. `ref_homework_types` - Reference table for homework types
3. `integration_scores` - IES/EIS scores over time

**Migration File:** `20260212143000_create_integration_hub_tables.sql`

**Schema:**
```sql
-- Reference table for homework types
CREATE TABLE ref_homework_types (
  homework_type_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  homework_name TEXT NOT NULL UNIQUE,
  description TEXT,
  typical_duration_minutes INT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Homework assignments
CREATE TABLE integration_homework (
  homework_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  protocol_id BIGINT REFERENCES log_clinical_records(record_id) ON DELETE CASCADE,
  homework_type_id BIGINT REFERENCES ref_homework_types(homework_type_id),
  
  -- Scheduling
  assigned_date DATE NOT NULL,
  due_date DATE NOT NULL,
  completed_date DATE,
  
  -- Tracking
  is_completed BOOLEAN DEFAULT FALSE,
  completion_notes TEXT,
  
  -- Metadata
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_dates CHECK (due_date >= assigned_date)
);

-- Integration scores (IES/EIS)
CREATE TABLE integration_scores (
  score_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  protocol_id BIGINT REFERENCES log_clinical_records(record_id) ON DELETE CASCADE,
  scale_type TEXT CHECK (scale_type IN ('IES', 'EIS')),
  
  score_value NUMERIC(5,2) NOT NULL,
  measured_at TIMESTAMPTZ NOT NULL,
  days_post_dose INT,  -- Calculated field
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_integration_score CHECK (score_value >= 0 AND score_value <= 100)
);

-- Indexes
CREATE INDEX idx_homework_protocol ON integration_homework(protocol_id, due_date);
CREATE INDEX idx_homework_type ON integration_homework(homework_type_id);
CREATE INDEX idx_homework_completed ON integration_homework(is_completed);
CREATE INDEX idx_scores_protocol ON integration_scores(protocol_id, measured_at);
CREATE INDEX idx_scores_type ON integration_scores(scale_type);

-- RLS
ALTER TABLE integration_homework ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE ref_homework_types ENABLE ROW LEVEL SECURITY;

-- Homework: site members can read, clinicians can write
CREATE POLICY homework_read ON integration_homework
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_sites us
      JOIN log_clinical_records lcr ON lcr.site_id = us.site_id
      WHERE us.user_id = auth.uid()
        AND lcr.record_id = integration_homework.protocol_id
    )
  );

CREATE POLICY homework_write ON integration_homework
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_sites us
      JOIN log_clinical_records lcr ON lcr.site_id = us.site_id
      WHERE us.user_id = auth.uid()
        AND us.role IN ('clinician', 'site_admin')
        AND lcr.record_id = integration_homework.protocol_id
    )
  );

-- Scores: same pattern
CREATE POLICY scores_read ON integration_scores
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_sites us
      JOIN log_clinical_records lcr ON lcr.site_id = us.site_id
      WHERE us.user_id = auth.uid()
        AND lcr.record_id = integration_scores.protocol_id
    )
  );

CREATE POLICY scores_write ON integration_scores
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_sites us
      JOIN log_clinical_records lcr ON lcr.site_id = us.site_id
      WHERE us.user_id = auth.uid()
        AND us.role IN ('clinician', 'site_admin')
        AND lcr.record_id = integration_scores.protocol_id
    )
  );

-- Ref table policies
CREATE POLICY ref_homework_types_read ON ref_homework_types
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY ref_homework_types_write ON ref_homework_types
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_sites
      WHERE user_sites.user_id = auth.uid()
        AND user_sites.role = 'network_admin'
    )
  );

-- Seed homework types
INSERT INTO ref_homework_types (homework_name, description, typical_duration_minutes) VALUES
  ('Journaling', 'Reflective writing about session insights', 30),
  ('Meditation', 'Mindfulness or breathwork practice', 20),
  ('Therapy Session', 'Follow-up session with therapist', 60),
  ('Body Work', 'Somatic therapy, massage, or movement', 60),
  ('Creative Expression', 'Art, music, or other creative practice', 45),
  ('Nature Connection', 'Time in nature for grounding', 60),
  ('Social Connection', 'Meaningful conversation with trusted person', 30),
  ('Integration Reading', 'Reading integration-focused materials', 30);
```

---

## ✅ ACCEPTANCE CRITERIA

### **Phase 1: CRITICAL**
- [ ] `ref_medications` table created
- [ ] 24+ medications seeded
- [ ] RLS policies enabled and tested
- [ ] Indexes created
- [ ] Protocol Builder 404 error resolved
- [ ] Migration file created and documented

### **Phase 2: HIGH**
- [ ] Session logger tables created (`session_events`, `ref_event_types`)
- [ ] Supervision exchange tables created (4 tables)
- [ ] Integration hub tables created (3 tables)
- [ ] All tables have RLS policies
- [ ] All tables have appropriate indexes
- [ ] Seed data populated for reference tables
- [ ] Migration files created and documented

### **Quality Checks:**
- [ ] All foreign keys have ON DELETE CASCADE or SET NULL
- [ ] All CHECK constraints are valid
- [ ] All indexes follow naming convention (`idx_tablename_column`)
- [ ] All RLS policies follow site isolation pattern
- [ ] No JSONB blobs for queryable data
- [ ] All timestamps use TIMESTAMPTZ (not TIMESTAMP)

---

## 🚀 EXECUTION STEPS

### **Step 1: Read Strategic Brief** (15 minutes)
- Read `SOOP_STRATEGIC_BRIEF_DATABASE_FOR_UX.md`
- Understand how DESIGNER will use these tables
- Review VoC use cases

### **Step 2: Create Phase 1 Migration** (30 minutes)
- Create `20260212141500_create_ref_medications.sql`
- Test locally (if possible)
- Verify RLS policies work

### **Step 3: Execute Phase 1 Migration** (15 minutes)
- Run migration in Supabase
- Verify table exists
- Test Protocol Builder (404 should be gone)

### **Step 4: Create Phase 2 Migrations** (90 minutes)
- Create session logger migration
- Create supervision exchange migration
- Create integration hub migration
- Test locally (if possible)

### **Step 5: Document** (15 minutes)
- Update schema documentation
- Note any deviations from plan
- Communicate to LEAD/DESIGNER

---

## 📞 COMMUNICATION

### **Report to LEAD when:**
- Phase 1 complete (ref_medications created)
- Any blockers encountered
- Phase 2 complete (all new tables created)

### **Coordinate with DESIGNER:**
- Confirm table structures match UX needs
- Verify column names are clear
- Ensure indexes support expected queries

---

## 🔥 CRITICAL REMINDERS

1. **Demo is in 2 days:** Phase 1 is CRITICAL PATH
2. **Additive-only:** No DROP, no ALTER TYPE, no RENAME
3. **RLS is mandatory:** Every table must have policies
4. **Test before committing:** Verify tables work as expected
5. **Document everything:** Migration files must be clear and complete

---

**Status:** 🔴 READY TO START  
**Priority:** CRITICAL (Phase 1), HIGH (Phase 2)  
**Next:** SOOP reads strategic brief, then creates migrations 🚀
