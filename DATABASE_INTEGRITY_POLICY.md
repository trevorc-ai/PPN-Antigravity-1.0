# 🚨 CRITICAL DATABASE POLICY 🚨

## DATA INTEGRITY RULE (NON-NEGOTIABLE)

### ✅ ALLOWED: Reference Table Population ONLY (Admin-Authorized)
**Tables:** `ref_substances`, `ref_indications`, `ref_routes`, `ref_severity_grades`, etc.

**Purpose:** These tables contain controlled vocabularies and reference data.

**Seeding:** ✅ **ALLOWED** - But ONLY when:
1. **Admin (Trevor) explicitly authorizes** the addition
2. **SOOP (Database Architect) executes** the migration
3. **User requests** are submitted via UI request form, then reviewed and approved by admin

**Authorization Flow:**
1. User submits request via UI: "Add new substance to dropdown"
2. Request logged in system for admin review
3. Admin (Trevor) reviews and approves/rejects
4. If approved, SOOP creates migration with approved data
5. Migration executed by admin or SOOP

**Example:**
```sql
-- ✅ CORRECT: Admin-authorized reference data
-- Authorization: Trevor approved request #123 on 2026-02-15
INSERT INTO ref_substances (substance_name, substance_class)
VALUES ('Psilocybin', 'Tryptamine');
```

---

### ❌ FORBIDDEN: ALL Non-Reference Table Seeding
**Tables:** `log_*`, `sites`, `user_sites`, and **ANY table that doesn't start with `ref_`**

**Purpose:** These tables contain **REAL DATA** entered by users through the application.

**Seeding:** ❌ **ABSOLUTELY FORBIDDEN** - These must ONLY contain data entered through the UI by real users.

**This includes:**
- ❌ `log_clinical_records` - Clinical data from Protocol Builder
- ❌ `log_outcomes`, `log_consent`, `log_interventions`, `log_safety_events` - All log tables
- ❌ `sites` - Real clinic/site data
- ❌ `user_sites` - Real user-to-site relationships
- ❌ **ANY table that is not a `ref_` table**

**Why This Matters:**
1. **Data Integrity:** Fake data corrupts analytics and research outcomes
2. **Regulatory Compliance:** Clinical trial data must be authentic
3. **Trust:** Practitioners must trust that all data is real
4. **PHI Compliance:** Even fake data can create compliance risks

**Example:**
```sql
-- ❌ WRONG: DO NOT DO THIS
INSERT INTO log_clinical_records (subject_id, substance_id, outcome_score)
VALUES (1001, 1, 85); -- This is FAKE DATA - NEVER DO THIS

-- ✅ CORRECT: Let practitioners enter data via UI
-- No direct INSERT statements for log_* tables
```

---

## TESTING & VISUALIZATION

### ❌ Wrong Approach
"Let me create fake clinical records so you can see the visualizations work"

### ✅ Correct Approach
1. Ensure reference tables are populated
2. Guide user to log their first real protocol via Protocol Builder UI
3. Visualizations populate with real data
4. If visualizations are empty, that's expected and correct until real data exists

---

## FOR FUTURE AGENTS

**Before creating ANY migration that touches `log_*` tables, ask yourself:**

1. **Is this real data entered by a practitioner?** 
   - If NO → STOP, do not proceed
   
2. **Am I trying to "help" by creating test data?**
   - If YES → STOP, this violates data integrity
   
3. **Are visualizations empty and I want to populate them?**
   - If YES → STOP, empty visualizations are correct until real data exists

**The ONLY acceptable INSERT statements for `log_*` tables are:**
- ✅ Data entered through the Protocol Builder UI
- ✅ Data imported from verified clinical trial sources
- ✅ Data migrated from a previous system with full audit trail

**NEVER acceptable:**
- ❌ "Test data" for development
- ❌ "Sample data" to show features
- ❌ "Demo data" for presentations
- ❌ Any synthetic or fabricated clinical records

---

## ENFORCEMENT

**All agents (SOOP, BUILDER, DESIGNER, LEAD) must:**
1. Read this policy before working on database migrations
2. Never create migrations that INSERT into non-`ref_*` tables
3. **Never INSERT into `ref_*` tables without explicit admin authorization**
4. Challenge any work order that requests unauthorized data changes
5. Escalate to LEAD if unsure

**Admin Authorization Required:**
- **ALL writes to ANY table** (including `ref_*`) require admin (Trevor) approval
- User requests for dropdown additions must go through request → review → approval flow
- SOOP executes migrations only after admin authorization

**Violation Consequences:**
- Migration must be rolled back immediately
- Work order marked as FAILED
- Database audit required to verify no unauthorized data exists

---

## SUMMARY

**Golden Rule:**
> **ONLY `ref_*` tables = Seed with admin-authorized controlled vocabulary data ✅**
> **ALL other tables = ZERO seeding, EVER ❌**
> **ALL writes require admin (Trevor) authorization ✅**

**When in doubt:**
> If it doesn't start with `ref_`, don't INSERT ANY data in migrations. Period.
> If it does start with `ref_`, get admin authorization first.

---

**Last Updated:** 2026-02-15  
**Policy Owner:** SOOP (Database Architect)  
**Enforcement:** ALL AGENTS
