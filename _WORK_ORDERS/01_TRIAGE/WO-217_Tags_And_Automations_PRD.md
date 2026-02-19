---
id: WO-217
title: "PRODDY + ANALYST: Tags & Automations PRD"
status: 01_TRIAGE
owner: PRODDY
priority: P2
created: 2026-02-19
failure_count: 0
ref_tables_affected: log_tags (new), ref_tag_types (new), ref_automation_rules (new)
depends_on: WO-215, Turning_Point.md — USER directive
---

## USER DIRECTIVE (from Turning_Point.md)

> "Proddy, marketer, and analyst are all involved in tags and automations; they are very complex, but incredibly valuable if you use them right, so do your research and get organized."

## SCOPE

Tags and automations are the system's intelligence layer. They turn passive data collection into active clinical guidance.

## PRODDY PRD REQUIREMENTS

### 1. Define Entity Types

What entities can be tagged?

| Entity | Table | Use Case |
|--------|-------|----------|
| Patient journey | log_clinical_records | Flag high-risk patients |
| Session | log_clinical_records | Flag sessions needing follow-up |
| Site | log_sites | Tag high-performing sites for case studies |
| Vocabulary request | log_vocabulary_requests | Tag trending concepts |

**PRODDY must define:** Which entity types are in scope for V1?

### 2. Tag Schema

```
log_tags:
  tag_id         UUID PK
  entity_type    TEXT (e.g. 'session', 'patient', 'site')
  entity_id      UUID (references the tagged entity)
  tag_type_id    INTEGER FK → ref_tag_types
  tagged_by      UUID FK auth.users
  site_id        UUID FK log_sites
  created_at     TIMESTAMPTZ
  
ref_tag_types:
  tag_type_id    SERIAL PK
  tag_label      TEXT (e.g. 'High Risk', 'Follow-Up Required', 'Case Study Candidate')
  tag_category   TEXT (e.g. 'safety', 'quality', 'research')
  is_system_tag  BOOLEAN (system-generated vs. manual)
  is_active      BOOLEAN
```

### 3. Automation Rules

What triggers what?

| Trigger | Condition | Action |
|---------|-----------|--------|
| Session logged | Safety event severity = 'critical' | Auto-tag session as 'Immediate Follow-Up' |
| 30 days post session | No longitudinal assessment logged | Auto-tag patient as 'Missing 30-Day Follow-Up' |
| Documentation score | Site score drops below 70% | Alert site admin |
| Vocabulary request | request_count >= 3 sites | Auto-tag as 'Advisory Board Agenda' |

**PRODDY must define:** Which automation rules are in scope for V1?

### 4. ANALYST Input Required

After PRODDY defines the triggers, ANALYST writes:
- The SQL function or Supabase edge function that evaluates trigger conditions
- The k-anonymous aggregation query that powers the site-score automation

### 5. MARKETER Input Required

After PRODDY defines the tag system, MARKETER writes:
- Email automation specifications for practitioners with "Follow-Up Required" tagged patients
- Messaging for the advisory board vocabulary notification email

## DATA MODEL CONSTRAINTS (INSPECTOR pre-approval)

- All tag target IDs must be UUID (no integer row IDs in cross-table references)
- No PHI in tag labels — tags describe the data pattern, not the patient
- RLS: tags are site-scoped (same pattern as all log_ tables)
- `ref_tag_types.is_system_tag = TRUE` rows cannot be modified by practitioners

## HANDOFF CHAIN

1. PRODDY → PRD (this ticket)
2. SOOP → Schema migration (`ref_tag_types`, `log_tags`, `ref_automation_rules`)
3. ANALYST → SQL trigger functions
4. BUILDER → API functions in `analytics.ts` + UI badge components
5. MARKETER → Email notification copy

## Acceptance Criteria

- [ ] V1 scope defined: which entities, which tags, which automations
- [ ] Tag schema validated against no-PHI constraint
- [ ] Automation trigger conditions written as testable SQL
- [ ] Handoff requirements written for SOOP, ANALYST, MARKETER
