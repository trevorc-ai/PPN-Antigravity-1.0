# Command #008: Row Level Security (RLS) Audit

**Date Issued:** Feb 13, 2026, 5:50 PM PST  
**Issued By:** LEAD (on behalf of User)  
**Assigned To:** SOOP  
**Priority:** P1 - CRITICAL FOR SECURITY  
**Estimated Time:** 2-3 hours  
**Start After:** Command #007 complete

---

## DIRECTIVE

Audit ALL database tables for proper Row Level Security (RLS) policies. This is CRITICAL for launch security.

---

## REQUIREMENTS

### 1. Identify All Tables
- Query `information_schema.tables` for all public schema tables
- List every table that contains user or site data

### 2. Verify RLS Status
For each table, check:
- ✅ RLS enabled (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`)
- ✅ Policies exist for SELECT, INSERT, UPDATE, DELETE
- ✅ Policies enforce site isolation via `user_sites` table
- ✅ No data leakage across sites

### 3. Critical Tables (Must Have RLS)
- `protocols`
- `patients`
- `protocol_outcomes`
- `adverse_events`
- `user_profiles`
- `user_sites`
- Any other table with patient/practitioner data

### 4. Reference Tables (May Skip RLS)
- `ref_substances`
- `ref_indications`
- `ref_dosage_units`
- Other lookup tables (read-only, no sensitive data)

---

## DELIVERABLE

Create audit report: `.agent/handoffs/RLS_AUDIT_REPORT.md`

**Format:**
```markdown
# RLS Audit Report

## Summary
- Total tables audited: X
- Tables with RLS: X
- Tables missing RLS: X
- Critical issues: X

## Tables with RLS ✅
| Table | RLS Enabled | Policies | Site Isolation | Status |
|-------|-------------|----------|----------------|--------|
| protocols | ✅ | 4 | ✅ | PASS |

## Tables Missing RLS ❌
| Table | Contains Sensitive Data | Recommended Action |
|-------|------------------------|-------------------|
| example | Yes | ADD RLS IMMEDIATELY |

## Recommended Fixes
1. [SQL to add RLS to table X]
2. [SQL to add policies to table Y]
```

---

## NEXT TASK (QUEUED)

After completion, report status to LEAD. BUILDER will be working on TopHeader fix next.

**EXECUTE IMMEDIATELY AFTER COMMAND #007**
