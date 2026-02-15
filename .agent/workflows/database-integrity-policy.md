---
description: CRITICAL - Database data integrity policy
---

# 🚨 DATABASE INTEGRITY POLICY 🚨

## GOLDEN RULE

**Reference tables (`ref_*`):** ✅ Seed with real data  
**Log tables (`log_*`):** ❌ NEVER seed with fake data

## WHY THIS MATTERS

Log tables contain REAL CLINICAL DATA entered by practitioners. Fake data:
- Corrupts analytics and research outcomes
- Violates regulatory compliance
- Breaks practitioner trust
- Creates PHI compliance risks

## FOR ALL AGENTS

Before creating ANY migration that touches `log_*` tables:

**Ask yourself:**
1. Is this real data entered by a practitioner? If NO → STOP
2. Am I trying to "help" by creating test data? If YES → STOP
3. Are visualizations empty and I want to populate them? If YES → STOP

**Empty visualizations are CORRECT until real data exists.**

## ENFORCEMENT

- All agents must read `DATABASE_INTEGRITY_POLICY.md` before database work
- Never create migrations that INSERT into `log_*` tables
- Challenge any work order requesting fake clinical data
- Escalate to LEAD if unsure

**Violations = immediate rollback + database audit**

---

See full policy: `/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/DATABASE_INTEGRITY_POLICY.md`
