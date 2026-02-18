---
id: WO-052
status: 03_BUILD
priority: P1 (High)
category: Feature
owner: BUILDER
failure_count: 0
phase: Arc of Care - Phase 3 (Integration)
estimated_hours: 20-25
depends_on: WO-051
---

# Work Order: Phase 3 Forms Redesign (Integration)
## Arc of Care Compliance - Forms Showcase Update

**Created:** 2026-02-17T05:37:00-08:00  
**Designer:** DESIGNER  
**Phase:** 3 of 3 (Integration)  
**Depends On:** WO-051 (Phase 2 must be complete first)

---

## 📋 User Request

Update Forms Showcase Phase 3 (Integration) forms to achieve 100% compliance with Arc of Care Design Guidelines v2.0 using the schema from `arc_of_care_technical_spec.md`.

---

## 🎯 Scope: Phase 3 Forms (Integration)

### Forms Included:

| # | Form Name | Status | Changes Required |
|---|-----------|--------|------------------|
| 15 | Daily Pulse Check | ✅ USE AS-IS | None (gold standard) |
| 16 | Longitudinal Assessment | ✅ USE AS-IS | None |
| 17 | Integration Session Notes | ❌ REPLACE | Replace with structured form |
| 18 | Integration Insights | ❌ REPLACE | Replace with Behavioral Change Tracker |
| 19 | Ongoing Safety Monitoring | ❌ REPLACE | Replace with Structured Safety Check |
| 20 | Progress Notes | ❌ REMOVE | Remove entirely (not in schema) |

**Total:** 6 forms (2 use as-is, 3 replace, 1 remove)

---

## 🔧 LEAD ARCHITECTURE

### Technical Strategy:

Phase 3 forms map to multiple tables:
- `log_pulse_checks` - Daily check-ins
- `log_longitudinal_assessments` - Symptom tracking over time
- `log_integration_sessions` - Integration therapy sessions
- `log_behavioral_changes` - Behavioral change tracking
- `log_red_alerts` - Safety monitoring

**Key Changes:**
1. **Remove Progress Notes** (Form 20) - Not in schema, redundant
2. **Replace Integration Session Notes** (Form 17) - Use structured inputs
3. **Replace Integration Insights** (Form 18) - Use Behavioral Change Tracker
4. **Replace Ongoing Safety Monitoring** (Form 19) - Use structured checkboxes

**Files to Modify:**
1. DELETE: `src/components/forms/ProgressNotes.tsx`
2. REPLACE: `src/components/forms/IntegrationSessionNotes.tsx`
3. REPLACE: `src/components/forms/IntegrationInsights.tsx`
4. REPLACE: `src/components/forms/OngoingSafetyMonitoring.tsx`

**Files to Create:**
1. `src/components/forms/StructuredIntegrationSession.tsx`
2. `src/components/forms/BehavioralChangeTracker.tsx`
3. `src/components/forms/StructuredSafetyCheck.tsx`

---

## 📦 Detailed Implementation Tasks

### Task 1: Remove Progress Notes (BUILDER)

**Action:** DELETE `src/components/forms/ProgressNotes.tsx`

**Rationale:**
- Not in `arc_of_care_technical_spec.md` schema
- SOAP notes are narrative (incompatible with structured data)
- All clinical observations captured via other forms
- Highest PHI risk

**Update Forms Showcase:**
Remove from navigation and routing

---

### Task 2: Create Structured Integration Session (BUILDER)

**File:** `src/components/forms/StructuredIntegrationSession.tsx` (NEW)

**Purpose:** Replace Integration Session Notes with structured form

**Schema Mapping:**
```sql
CREATE TABLE log_integration_sessions (
  id SERIAL PRIMARY KEY,
  patient_id VARCHAR(10) NOT NULL,
  dosing_session_id INTEGER REFERENCES log_sessions(id),
  integration_session_number INTEGER NOT NULL,
  session_date DATE NOT NULL,
  session_duration_minutes INTEGER,
  therapist_user_id UUID REFERENCES auth.users(id),
  session_notes TEXT, -- NOW DROPDOWN (per user clarification)
  attended BOOLEAN DEFAULT true,
  cancellation_reason TEXT, -- NOW DROPDOWN
  created_at TIMESTAMP DEFAULT NOW()
);
```

**UI Design:**
```
Session Number: [3]  Session Date: [2026-02-15] [Today]

Session Duration: ○ 30 min  ● 45 min  ○ 60 min  ○ 90 min

Attendance: ● Attended  ○ Cancelled  ○ No-Show

Session Focus Areas (select all):
☑ Processing Dosing Experience
☑ Relationship Insights
☐ Career/Purpose Exploration
☐ Grief/Loss Processing

Patient Progress Indicators:
Insight Integration: ★★★★☆ (4/5)
Emotional Processing: ★★★★★ (5/5)
Behavioral Application: ★★★☆☆ (3/5)
Engagement Level: ★★★★☆ (4/5)

Homework Assigned (select all):
☑ Daily Journaling (10 min/day)
☑ Meditation Practice (10 min/day)
☐ Gratitude List (3 items/day)

Next Session Scheduled: [2026-02-22] (1 week)
```

**Touch Count:** 10-15 touches
**Time to Complete:** <30 seconds

---

### Task 3: Create Behavioral Change Tracker (BUILDER)

**File:** `src/components/forms/BehavioralChangeTracker.tsx` (NEW)

**Purpose:** Replace Integration Insights with structured change tracking

**Schema Mapping:**
```sql
CREATE TABLE log_behavioral_changes (
  id SERIAL PRIMARY KEY,
  patient_id VARCHAR(10) NOT NULL,
  session_id INTEGER REFERENCES log_sessions(id),
  change_date DATE NOT NULL,
  change_type VARCHAR(50) NOT NULL,
  change_description TEXT, -- NOW DROPDOWN
  is_positive BOOLEAN NOT NULL,
  logged_at TIMESTAMP DEFAULT NOW()
);
```

**UI Design:**
```
Change Date: [2026-02-15] [Today]

Change Type:
● Relationship  ○ Substance Use  ○ Exercise
○ Work/Career   ○ Hobby/Creative ○ Self-Care

What Changed? (select all):
☑ Set new boundaries
☑ Started new practice/habit
☐ Ended unhealthy pattern
☐ Reached out to someone

Impact on Well-Being:
○ Highly Positive  ● Moderately Positive  ○ Neutral

Confidence in Sustaining Change:
★★★★☆ (4/5)

Related to Dosing Session:
● Yes - Direct insight from session
○ Yes - Indirectly influenced
○ No - Unrelated to treatment
```

**Touch Count:** 5-8 touches
**Time to Complete:** <20 seconds

---

### Task 4: Create Structured Safety Check (BUILDER)

**File:** `src/components/forms/StructuredSafetyCheck.tsx` (NEW)

**Purpose:** Replace Ongoing Safety Monitoring with structured form

**Schema Mapping:**
```sql
CREATE TABLE log_red_alerts (
  id SERIAL PRIMARY KEY,
  patient_id VARCHAR(10) NOT NULL,
  alert_type VARCHAR(50) NOT NULL,
  alert_severity VARCHAR(20) NOT NULL,
  alert_triggered_at TIMESTAMP NOT NULL DEFAULT NOW(),
  trigger_value JSONB,
  alert_message TEXT, -- NOW DROPDOWN
  is_acknowledged BOOLEAN DEFAULT false,
  acknowledged_by_user_id UUID REFERENCES auth.users(id),
  acknowledged_at TIMESTAMP,
  response_notes TEXT, -- NOW DROPDOWN
  is_resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**UI Design:**
```
Monitoring Date: [2026-02-15] [Today]

C-SSRS Score: [2] (0-5)
⚠️ Score ≥3 triggers automatic alert

Safety Concerns (select all):
☐ Suicidal ideation increase
☐ Self-harm behavior
☑ Substance use relapse
☐ Medication non-compliance
☑ Social isolation increase

New Adverse Events Since Last Check:
● No  ○ Yes (if yes, complete Adverse Event Report)

Actions Taken (select all):
☑ Increased check-in frequency
☐ Emergency contact notified
☑ Additional therapy session scheduled

Follow-Up Required:
● Yes - Schedule within: ○ 24 hrs  ● 3 days  ○ 1 week
○ No - Continue standard monitoring
```

**Touch Count:** 5-10 touches
**Time to Complete:** <30 seconds

---

## 🧪 Testing Requirements

### Functional Tests:
- [ ] Structured Integration Session saves to `log_integration_sessions`
- [ ] Behavioral Change Tracker saves to `log_behavioral_changes`
- [ ] Structured Safety Check saves to `log_red_alerts`
- [ ] Progress Notes removed from navigation
- [ ] All dropdowns populate from ref_ tables

### Data Migration:
- [ ] Existing free-text data migrated to structured format (if any)
- [ ] No data loss during migration

### Accessibility Tests:
- [ ] All new forms meet WCAG AAA
- [ ] Star ratings are keyboard accessible
- [ ] Checkboxes have proper labels

---

## 📊 Success Criteria

**Phase 3 forms achieve:**
- ✅ 100% elimination of free-text inputs (from 45% to 0%)
- ✅ 60% reduction in time (from 5-7 minutes to 2-3 minutes)
- ✅ 100% schema compliance
- ✅ Zero PHI risk
- ✅ WCAG AAA accessibility

---

## 📚 Reference Documents

- **Design Guidelines:** `/brain/arc_of_care_guidelines_v2.md`
- **Forms Audit:** `/brain/arc_of_care_forms_audit.md`
- **Redesign Proposal:** `/brain/forms_redesign_proposal.md` (Forms 15-20)

---

**Estimated Effort:** 20-25 hours  
**Dependencies:** WO-051 (Phase 2 complete)  
**Blocks:** None (final phase)

---

## BUILDER STATUS UPDATE (2026-02-17T15:06:00-08:00)

### Current Situation:

This work order requests creating Phase 3 forms in `src/components/forms/`, but the current architecture organizes components differently:

**Current Architecture:**
- `src/components/safety/` - Safety-related components
- `src/components/benchmark/` - Benchmark readiness components
- `src/components/risk/` - Risk detection components
- `src/components/wellness-journey/` - Journey phase components
- `src/components/forms/` - Only has utility components (ButtonGroup, DateInput)

**Already Implemented:**
1. ✅ **StructuredSafetyCheck.tsx** - Already exists in `src/components/safety/`
   - C-SSRS screening
   - Safety concerns checklist
   - Actions taken tracking
   - Implemented in WO-078

**Still Needed:**
1. ❌ **StructuredIntegrationSession.tsx** - Integration therapy session form
2. ❌ **BehavioralChangeTracker.tsx** - Behavioral change tracking form
3. ❌ **Remove ProgressNotes.tsx** - (doesn't exist, so nothing to remove)

### Questions for LEAD:

1. **Architecture Decision:** Should Phase 3 forms go in:
   - `src/components/forms/` (as specified in WO-052)?
   - `src/components/integration/` (following current pattern)?
   - `src/components/wellness-journey/` (with other phase components)?

2. **Dependency Check:** WO-052 depends on WO-051 (Phase 2). Is WO-051 complete?

3. **Forms Showcase:** Where is the Forms Showcase page that needs updating?

### LEAD ARCHITECTURAL DECISION (2026-02-17 22:21 PST)

**Q1: Component Location** → Use `src/components/wellness-journey/` (follow existing pattern). Do NOT create a new `forms/` subdirectory for these.

**Q2: WO-051 Dependency** → WO-051 (Phase 2 forms) is considered complete based on prior audit. Proceed with Phase 3.

**Q3: Forms Showcase** → The Forms Showcase is `src/pages/ComponentShowcase.tsx`. Add Phase 3 forms to the Integration section there.

**Status:** ✅ UNBLOCKED — BUILDER proceed with Tasks 2 and 3 (StructuredIntegrationSession + BehavioralChangeTracker). StructuredSafetyCheck already exists in `src/components/safety/` — reference it, do not duplicate.

