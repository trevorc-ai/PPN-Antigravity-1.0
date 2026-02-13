# 🗄️ SOOP STRATEGIC BRIEF: Database Architecture for VoC-Driven Features
## PPN Research Portal - Schema Design Aligned with UX Needs

**Date:** 2026-02-12 06:03 PST  
**Prepared By:** LEAD  
**For:** SOOP (Database Specialist)  
**Context:** Supporting DESIGNER's VoC-driven UX transformation  
**Purpose:** Ensure database schema supports new use cases and UX patterns

---

## 📊 EXECUTIVE SUMMARY

**Mission:**
Design and maintain a database schema that **enables** the Practice Operating System vision, not **constrains** it. Your database decisions directly impact practitioner workflows and data quality.

**Strategic Shift:**
- **OLD:** "Store clinical data"
- **NEW:** "Enable workflow integration and measurement-based care"

**Why This Matters:**
VoC research shows practitioners are drowning in fragmented tools. Our database must support **integrated workflows**, not create more silos.

---

## 🎯 YOUR ROLE: DATABASE ARCHITECT

You are not just creating tables. You are **enabling practitioner workflows** through thoughtful schema design.

**Your North Star:**
> "The database should make the right thing easy and the wrong thing hard."  
> — Database design principle

**Your Constraints:**
- **Skills:** `master-data-ux` + `frontend-best-practices` (understand UX needs)
- **Lane:** `/migrations/` directory only (never touch `/src/`)
- **Rules:** Additive-only schema (no DROP, no ALTER TYPE, no RENAME)
- **Quality:** Every table must support RLS, have proper indexes, and enable analytics

---

## 📚 REQUIRED READING (Context Documents)

Before creating any migrations, review these documents:

### **1. VoC-Aligned Use Cases** (What Data to Store)
- **File:** `USE_CASES_VOC_ALIGNED_2026.md`
- **Critical Use Cases:**
  - Use Case 6: "Solve the Software/Workflow Failure" (session logger data)
  - Use Case 7: "Find Peer Supervision & Mentorship" (practitioner profiles, matching)
  - Use Case 8: "Standardize Integration Protocols" (homework, neuroplasticity tracking)
- **Takeaway:** New features need new tables/columns

### **2. DESIGNER Strategic Brief** (How Data Will Be Used)
- **File:** `DESIGNER_STRATEGIC_BRIEF_VoC_DRIVEN_UX.md`
- **Key Sections:**
  - Session Logger design (timeline events, auto-generated notes)
  - Supervision Exchange design (practitioner directory, matching algorithm)
  - Integration Hub design (homework tracking, IES/EIS scores)
- **Takeaway:** Schema must support interactive UX patterns

### **3. Design Skills** (UX Patterns You're Supporting)
- **File:** `.agent/skills/master-data-ux/SKILL.md`
- **File:** `.agent/skills/frontend-best-practices/SKILL.md`
- **Takeaway:** Understand how DESIGNER will query and display your data

---

## 🗄️ SCHEMA DESIGN PRINCIPLES

### **Principle 1: Support Interactive UX**

**Bad Schema (Static):**
```sql
CREATE TABLE protocols (
  id BIGINT PRIMARY KEY,
  data JSONB  -- Everything in one blob
);
```

**Good Schema (Queryable):**
```sql
CREATE TABLE protocols (
  id BIGINT PRIMARY KEY,
  substance_id BIGINT REFERENCES ref_substances(substance_id),
  route_id BIGINT REFERENCES ref_routes(route_id),
  indication_id BIGINT REFERENCES ref_indications(indication_id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enables filtering, sorting, aggregation in UX
CREATE INDEX idx_protocols_substance ON protocols(substance_id);
CREATE INDEX idx_protocols_created_at ON protocols(created_at);
```

**Why:** DESIGNER needs to build interactive filters, charts, and search. JSONB blobs make this impossible.

---

### **Principle 2: Enable Measurement-Based Care**

**VoC Requirement:**
> "Practitioners want automated tools that send surveys to patients and visualize the data without provider intervention."

**Schema Pattern:**
```sql
-- Store assessment responses (MEQ-30, IES/EIS, PHQ-9)
CREATE TABLE assessment_responses (
  response_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  protocol_id BIGINT REFERENCES log_clinical_records(record_id),
  assessment_id BIGINT REFERENCES ref_assessments(assessment_id),
  score NUMERIC(5,2) NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL,
  
  -- Enable time-series queries for charts
  CONSTRAINT valid_score CHECK (score >= 0 AND score <= 100)
);

CREATE INDEX idx_responses_protocol_time ON assessment_responses(protocol_id, completed_at);
```

**Why:** DESIGNER needs to build line charts showing score trends over time. This schema makes it easy.

---

### **Principle 3: Support Network Benchmarking**

**VoC Requirement:**
> "Practitioners want to compare across providers or sites and identify what improves outcomes and what increases risk."

**Schema Pattern:**
```sql
-- Aggregate-friendly structure
CREATE TABLE outcomes_summary (
  summary_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  site_id BIGINT REFERENCES sites(site_id),
  substance_id BIGINT REFERENCES ref_substances(substance_id),
  month DATE NOT NULL,
  
  -- Pre-aggregated metrics (fast queries)
  total_protocols INT NOT NULL,
  response_rate NUMERIC(5,2),  -- % with positive outcome
  adverse_event_rate NUMERIC(5,2),  -- % with safety events
  
  CONSTRAINT unique_summary UNIQUE(site_id, substance_id, month)
);

-- Enable fast network-wide queries
CREATE INDEX idx_summary_substance_month ON outcomes_summary(substance_id, month);
```

**Why:** DESIGNER needs to build comparison charts. Pre-aggregated data makes queries instant.

---

## 🔴 CRITICAL: NEW TABLES NEEDED FOR VoC USE CASES

### **Use Case 6: Session Logger** (6-8 Hour Session Documentation)

**Required Tables:**

```sql
-- Session events (tap-to-log)
CREATE TABLE session_events (
  event_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  protocol_id BIGINT REFERENCES log_clinical_records(record_id) ON DELETE CASCADE,
  event_type_id BIGINT REFERENCES ref_event_types(event_type_id),
  event_timestamp TIMESTAMPTZ NOT NULL,
  notes TEXT,  -- Structured notes only (not free-text)
  
  -- Metadata for charts
  intensity_level INT CHECK (intensity_level BETWEEN 1 AND 10),
  
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_protocol ON session_events(protocol_id, event_timestamp);

-- Reference table for event types
CREATE TABLE ref_event_types (
  event_type_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  event_name TEXT NOT NULL UNIQUE,  -- 'Distress', 'Breakthrough', 'Music Change', etc.
  color_code TEXT,  -- For UX (e.g., '#f43f5e' for distress)
  icon_name TEXT,   -- For UX (e.g., 'AlertTriangle')
  is_active BOOLEAN DEFAULT TRUE
);
```

**Why:** Supports DESIGNER's interactive timeline chart with color-coded events.

---

### **Use Case 7: Supervision Exchange** (Peer Matching & Mentorship)

**Required Tables:**

```sql
-- Practitioner profiles (for directory)
CREATE TABLE practitioner_profiles (
  profile_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  
  -- Searchable fields
  specialties TEXT[],  -- Array: ['PTSD', 'TRD', 'Integration']
  modalities TEXT[],   -- Array: ['Ketamine', 'Psilocybin', 'MDMA']
  years_experience INT,
  hourly_rate NUMERIC(10,2),
  
  -- Availability
  is_accepting_supervision BOOLEAN DEFAULT TRUE,
  max_supervisees INT DEFAULT 5,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_specialties ON practitioner_profiles USING GIN(specialties);
CREATE INDEX idx_profiles_modalities ON practitioner_profiles USING GIN(modalities);

-- Supervision relationships (dyads)
CREATE TABLE supervision_relationships (
  relationship_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  supervisor_id BIGINT REFERENCES practitioner_profiles(profile_id),
  supervisee_id BIGINT REFERENCES practitioner_profiles(profile_id),
  status TEXT CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
  
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  
  CONSTRAINT no_self_supervision CHECK (supervisor_id != supervisee_id)
);

-- Circles (small group cohorts)
CREATE TABLE supervision_circles (
  circle_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  circle_name TEXT NOT NULL,
  max_members INT DEFAULT 8,
  meeting_frequency TEXT,  -- 'monthly', 'biweekly'
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE circle_members (
  circle_id BIGINT REFERENCES supervision_circles(circle_id) ON DELETE CASCADE,
  profile_id BIGINT REFERENCES practitioner_profiles(profile_id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  
  PRIMARY KEY (circle_id, profile_id)
);
```

**Why:** Supports DESIGNER's searchable directory, network graph, and circle management.

---

### **Use Case 8: Integration Hub** (Structured Protocols & Homework)

**Required Tables:**

```sql
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
  
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_homework_protocol ON integration_homework(protocol_id, due_date);

-- Reference table for homework types
CREATE TABLE ref_homework_types (
  homework_type_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  homework_name TEXT NOT NULL UNIQUE,  -- 'Journaling', 'Meditation', 'Therapy Session'
  description TEXT,
  typical_duration_minutes INT,
  is_active BOOLEAN DEFAULT TRUE
);

-- Integration scores (IES/EIS)
CREATE TABLE integration_scores (
  score_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  protocol_id BIGINT REFERENCES log_clinical_records(record_id) ON DELETE CASCADE,
  scale_type TEXT CHECK (scale_type IN ('IES', 'EIS')),
  
  score_value NUMERIC(5,2) NOT NULL,
  measured_at TIMESTAMPTZ NOT NULL,
  
  -- Enable time-series queries
  days_post_dose INT,  -- Calculated: measured_at - protocol.session_date
  
  CONSTRAINT valid_integration_score CHECK (score_value >= 0 AND score_value <= 100)
);

CREATE INDEX idx_integration_scores_protocol ON integration_scores(protocol_id, measured_at);
```

**Why:** Supports DESIGNER's homework tracker, neuroplasticity timeline, and integration score charts.

---

## 🔒 RLS POLICIES (MANDATORY)

Every new table MUST have RLS policies that enforce site isolation.

**Standard Pattern:**

```sql
-- Enable RLS
ALTER TABLE session_events ENABLE ROW LEVEL SECURITY;

-- Read policy: site members can read their site's data
CREATE POLICY session_events_read ON session_events
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_sites
      WHERE user_sites.user_id = auth.uid()
        AND user_sites.site_id = (
          SELECT site_id FROM log_clinical_records
          WHERE record_id = session_events.protocol_id
        )
    )
  );

-- Write policy: clinicians and site_admins can insert
CREATE POLICY session_events_insert ON session_events
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_sites
      WHERE user_sites.user_id = auth.uid()
        AND user_sites.role IN ('clinician', 'site_admin')
        AND user_sites.site_id = (
          SELECT site_id FROM log_clinical_records
          WHERE record_id = session_events.protocol_id
        )
    )
  );
```

---

## 📊 INDEXES FOR PERFORMANCE

**Every table needs indexes for:**
1. **Foreign keys** (for JOINs)
2. **Time fields** (for time-series queries)
3. **Filter fields** (for WHERE clauses)
4. **Array fields** (use GIN indexes)

**Example:**
```sql
-- Foreign key index (for JOINs)
CREATE INDEX idx_events_protocol ON session_events(protocol_id);

-- Time-series index (for charts)
CREATE INDEX idx_events_timestamp ON session_events(event_timestamp);

-- Composite index (for filtered time-series)
CREATE INDEX idx_events_protocol_time ON session_events(protocol_id, event_timestamp);

-- Array index (for filtering)
CREATE INDEX idx_profiles_specialties ON practitioner_profiles USING GIN(specialties);
```

---

## ✅ MIGRATION CHECKLIST

Before creating any migration, verify:

### **Schema Design**
- [ ] Table supports interactive UX (no JSONB blobs for queryable data)
- [ ] Enables measurement-based care (time-series friendly)
- [ ] Supports network benchmarking (aggregation-friendly)
- [ ] Follows naming conventions (snake_case, descriptive names)

### **Data Integrity**
- [ ] Foreign keys defined with ON DELETE CASCADE/SET NULL
- [ ] CHECK constraints for valid ranges
- [ ] NOT NULL on required fields
- [ ] UNIQUE constraints where appropriate

### **Performance**
- [ ] Indexes on foreign keys
- [ ] Indexes on time fields
- [ ] Indexes on filter fields
- [ ] GIN indexes on array fields

### **Security**
- [ ] RLS enabled
- [ ] Read policy (site isolation)
- [ ] Write policy (role-based)
- [ ] Delete policy (if needed)

### **Additive-Only**
- [ ] No DROP TABLE
- [ ] No DROP COLUMN
- [ ] No ALTER COLUMN TYPE
- [ ] No RENAME TABLE/COLUMN

---

## 🚀 WORKFLOW: HOW TO EXECUTE

### **Step 1: Read DESIGNER's Brief** (15 minutes)
- Understand what UX patterns DESIGNER is building
- Identify what data needs to be stored
- Determine query patterns (filters, sorts, aggregations)

### **Step 2: Design Schema** (30 minutes)
- Create tables with proper types and constraints
- Add foreign keys and indexes
- Write RLS policies

### **Step 3: Create Migration** (15 minutes)
- Use timestamp-based naming: `YYYYMMDDHHMMSS_description.sql`
- Include rollback instructions (as comments)
- Test locally before committing

### **Step 4: Document Changes** (10 minutes)
- Update schema documentation
- Note any breaking changes (should be none with additive-only)
- Communicate to BUILDER/DESIGNER if new tables affect their work

---

## 🎯 SUCCESS METRICS

### **Demo Readiness (Feb 15, 2026)**
- ✅ All existing tables support Protocol Builder
- ✅ `ref_medications` table exists (fix 404 error)
- ✅ No schema blockers for demo

### **Post-Demo (V1.5 - March 2026)**
- ✅ Session events tables created (Use Case 6)
- ✅ Practitioner profiles tables created (Use Case 7)
- ✅ Integration homework tables created (Use Case 8)

### **Performance (6 Months)**
- **Query speed:** <100ms for all dashboard queries
- **Data integrity:** 0 orphaned records
- **RLS compliance:** 100% of tables have policies

---

## 📞 COMMUNICATION PROTOCOL

### **When to Ask LEAD for Help:**
- UX pattern unclear (how will DESIGNER use this data?)
- Use case priority conflict (which table to build first?)
- Schema design decision (normalize vs. denormalize?)
- Performance concern (index strategy for large datasets)

### **When to Proceed Independently:**
- Standard CRUD tables (follow patterns)
- RLS policies (follow standard pattern)
- Indexes (follow performance rules)
- Reference tables (straightforward)

### **How to Report Progress:**
- Migration summary: What tables/columns added, why
- Performance notes: Index strategy, expected query patterns
- Breaking changes: None (additive-only), but note if new tables affect other agents

---

## 🔥 CRITICAL REMINDERS

1. **VoC is your compass:** Every table should enable practitioner workflows
2. **UX patterns drive schema:** Read DESIGNER's brief before designing tables
3. **Additive-only is law:** No DROP, no ALTER TYPE, no RENAME
4. **RLS is mandatory:** Every table must have site isolation policies
5. **Performance matters:** Index everything that gets queried

---

## 📚 APPENDIX: FILE REFERENCES

### **Context Documents:**
- `USE_CASES_VOC_ALIGNED_2026.md`
- `DESIGNER_STRATEGIC_BRIEF_VoC_DRIVEN_UX.md`
- `.agent/research/📊 VoC Analysis Psychedelic Therapy.md`

### **Skills:**
- `.agent/skills/master-data-ux/SKILL.md` (understand UX needs)
- `.agent/skills/frontend-best-practices/SKILL.md` (understand design system)

### **Current Schema:**
- `/migrations/` directory (all existing migrations)
- Existing tables: `sites`, `user_sites`, `log_clinical_records`, `ref_substances`, etc.

---

**Status:** ✅ READY FOR SOOP  
**Priority:** 🔴 CRITICAL - DESIGNER needs schema support  
**Next:** SOOP creates migrations for new use case tables 🚀
