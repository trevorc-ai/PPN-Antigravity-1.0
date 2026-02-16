---
id: WO-049
status: 04_QA
priority: P1 (Critical)
category: Database
owner: INSPECTOR
failure_count: 0
created: 2026-02-15T15:23:00-08:00
requested_by: Trevor Calton
assigned_by: LEAD
assigned_at: 2026-02-15T15:25:00-08:00
---

# User Request

Conduct a **full database audit** to identify anywhere SQL best practices are not being followed. SOOP made unwanted changes earlier that are causing recurring problems with the application.

## Specific Issues to Investigate

1. **Login/Authentication Issues:** The app is experiencing persistent login problems that may be related to database schema or RLS policies
2. **Naming Conventions:** Verify all tables follow the `log_*` prefix convention for data-storing tables
3. **RLS Policies:** Audit all Row Level Security policies for correctness and security
4. **Schema Violations:** Identify any schema changes that violate the "additive-only" policy (no DROP, no ALTER TYPE)
5. **Data Integrity:** Check for foreign key constraints, proper indexes, and data validation
6. **PHI/PII Compliance:** Verify no personally identifiable information is being collected
7. **🚨 CRITICAL: Database Integrity Policy Violations:**
   - Check ALL migrations for INSERT statements into `log_*` tables (FORBIDDEN)
   - Verify no fake/test clinical data has been seeded into `log_*` tables
   - Confirm only `ref_*` tables contain seed data
   - Identify any violations of the "log tables are sacred" rule

## Expected Deliverables

1. **SQL Best Practices Research:** 
   - **DO NOT rely solely on project documentation**
   - Research industry-standard SQL best practices (PostgreSQL/Supabase)
   - Reference authoritative sources (PostgreSQL docs, Supabase security guides, OWASP)
   - Compare current schema against industry standards
   
2. **Audit Report:** Comprehensive markdown document listing:
   - All SQL best practice violations (based on research + project rules)
   - Tables that don't follow naming conventions
   - RLS policy issues
   - Schema integrity problems
   - Security vulnerabilities
   
3. **Remediation Plan:** For each issue found, provide:
   - Severity level (Critical/High/Medium/Low)
   - Recommended fix (citing best practice source)
   - Migration script (if applicable)

## 🚨 CRITICAL: User Approval Required

**ALL database changes must be reviewed and approved by the user before execution.**

Given recent critical errors (login failures, test data violations), the user must review:
- Every migration script
- Every schema change
- Every RLS policy modification
- Every data seeding strategy

**Deliverable Format:**
Create a comprehensive audit report with proposed fixes, but **DO NOT execute any database changes**. The user will review and approve each change individually.

## Acceptance Criteria

- [ ] All database tables audited
- [ ] All RLS policies reviewed
- [ ] All migrations reviewed for compliance
- [ ] Naming convention violations identified
- [ ] Security vulnerabilities documented
- [ ] Remediation plan provided for each issue

## Context

Recent conversations indicate:
- Login functionality is broken
- Test data migration failed
- Database schema may have been modified in non-compliant ways
- SOOP's previous changes may have introduced problems

## Reference Documents

- `/database-integrity-policy` workflow
- Previous migration files in `supabase/migrations/`
- User rules requiring `log_*` prefix for data tables

---

## LEAD ARCHITECTURE

**Technical Strategy:**
This is a critical audit task to identify and remediate SQL best practice violations that are causing application failures (login issues, test data problems).

**Audit Scope:**
1. **All Migration Files:** Review every file in `supabase/migrations/` for:
   - Violations of additive-only policy (DROP, ALTER TYPE commands)
   - INSERT statements into `log_*` tables (forbidden)
   - Missing RLS policies on new tables
   - Improper naming conventions

2. **Current Schema State:** Analyze deployed database for:
   - Tables not following `log_*` or `ref_*` naming conventions
   - Missing indexes on foreign keys
   - RLS policies that are too permissive or missing
   - Data integrity issues (missing constraints, orphaned records)

3. **Industry Standards Comparison:** Research and apply:
   - PostgreSQL security best practices
   - Supabase RLS pattern recommendations
   - OWASP database security guidelines
   - HIPAA-compliant data handling

**Files to Review:**
- `supabase/migrations/*.sql` - ALL migration files
- Current database schema (via Supabase dashboard or SQL introspection)
- `.agent/workflows/database-integrity-policy.md`

**Deliverable Format:**
Create `brain/.../WO_049_Database_Audit_Report.md` with:
- Executive Summary (critical issues first)
- Detailed findings by category (with severity levels)
- Remediation plan with migration scripts
- Citations to authoritative sources

**Constraints:**
- DO NOT make any database changes during audit
- DO NOT create migration scripts yet (only recommend them)
- MUST research external best practices, not just project docs
- MUST identify root cause of login failures

**Risk Mitigation:**
- This is review-only, no code execution
- User will approve remediation plan before any fixes
- Critical issues must be flagged for immediate attention

**Routing Decision:** → INSPECTOR (04_QA)

---

## ✅ AUDIT COMPLETE

**Completed By:** INSPECTOR  
**Date:** 2026-02-15T16:09:26-08:00

### Audit Scope Completed:

✅ **All Migration Files Reviewed:**
- 3 files in `supabase/migrations/`
- 50+ files in `migrations/` directory
- All schema definition files analyzed

✅ **Industry Best Practices Researched:**
- PostgreSQL RLS security standards
- Supabase authentication best practices
- OWASP database security guidelines
- Principle of least privilege enforcement

✅ **Root Cause Identified:**
Login failures caused by direct manipulation of `auth.users` table with:
- Duplicate `email_confirmed_at` column in INSERT statement
- Incorrect schema structure
- Improper password hashing approach

### Critical Findings Summary:

**🚨 CRITICAL (18 Total Violations):**
1. Direct `auth.users` manipulation in 2 migration files
2. 5 tables missing `log_*` prefix (quality scoring system)
3. Overly permissive RLS policies (public read access)
4. Incorrect service_role checks in RLS policies
5. Missing indexes on RLS policy columns

**⚠️ HIGH:**
- 11 tables with naming convention violations
- Duplicate `profiles` table
- Missing `FORCE ROW LEVEL SECURITY` on sensitive tables

**📊 MEDIUM:**
- Inconsistent RLS policy patterns
- Seed data embedded in schema migrations

### Deliverables Created:

📄 **[WO_049_Database_Audit_Report.md](file:///Users/trevorcalton/.gemini/antigravity/brain/57cc050d-151a-4c46-b40a-2557c37289a1/WO_049_Database_Audit_Report.md)**
- Executive summary with severity ratings
- 18 detailed findings with evidence
- Root cause analysis of login failures
- 3-phase remediation plan with migration scripts
- Industry best practice citations

### Remediation Plan Overview:

**Phase 1 (Immediate):**
- Delete dangerous auth.users migration files
- Fix service_role RLS policies
- Add missing indexes

**Phase 2 (48 Hours):**
- Rename quality scoring tables to `log_*` prefix
- Tighten RLS policies
- Add FORCE ROW LEVEL SECURITY

**Phase 3 (1 Week):**
- Standardize all naming conventions
- Delete duplicate tables
- Comprehensive testing

### ⚠️ CRITICAL REMINDER:

**NO DATABASE CHANGES HAVE BEEN EXECUTED.**

All findings require user review and approval. The auth.users manipulation is causing active login failures and should be addressed immediately.

### Next Steps:

1. User reviews audit report
2. User approves Phase 1 critical fixes
3. Create migration scripts for approved changes
4. Test in development environment
5. Deploy to production after validation

---

**AUDIT STATUS:** ✅ COMPLETE - AWAITING USER REVIEW

