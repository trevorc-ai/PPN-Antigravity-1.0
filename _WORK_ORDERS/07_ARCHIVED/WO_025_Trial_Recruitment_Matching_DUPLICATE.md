---
work_order_id: WO_025
title: Create Trial Recruitment Matching Logic
type: DATABASE
category: Database
priority: MEDIUM
status: 03_BUILD
created: 2026-02-14T23:41:06-08:00
requested_by: PPN Admin
assigned_to: MARKETER
estimated_complexity: 7/10
failure_count: 0
owner: MARKETER
pending_review_by: MARKETER
review_type: Go-to-Market Strategy Analysis
---

# Work Order: Create Trial Recruitment Matching Logic

## 🎯 THE GOAL

Create the backend logic to match anonymous patient profiles against Clinical Trial criteria.

### PRE-FLIGHT CHECK

- Ensure `log_sessions` has outcome data (PHQ-9, etc.)

### Directives

1. Create `ref_clinical_trials` table (id, inclusion_criteria_json, payout_amount)

2. Create an RPC function `match_trials_for_user(user_id)`:
   - Scans the user's `log_sessions` for specific phenotypes (e.g., "Diagnosis: TRD" + "Prior Meds: SSRI" + "Outcome: Non-Responder")
   - Returns a list of eligible trials

3. This allows the Frontend to show a "Recruitment Opportunity" badge without exposing patient data

---

## 🎯 THE BLAST RADIUS (Authorized Target Area)

- Supabase SQL Editor / RPC Functions

---

## ⚡ THE ELECTRIC FENCE (Strict "DO NOT TOUCH" Constraints)

**DO NOT:**
- Expose patient identities to the trial sponsor
- Automate enrollment

**MUST:**
- Only automate the *notification* to the practitioner

---

## ✅ Acceptance Criteria

### Pre-Flight Verification
- [ ] Verify `log_sessions` has outcome data (PHQ-9, etc.)

### Database Schema
- [ ] `ref_clinical_trials` table created
- [ ] Columns: id, inclusion_criteria_json, payout_amount

### RPC Function
- [ ] `match_trials_for_user(user_id)` function created
- [ ] Scans user's `log_sessions` for phenotypes
- [ ] Matches against trial inclusion criteria
- [ ] Returns list of eligible trials
- [ ] No patient identity exposure

---

## 📝 MANDATORY COMPLIANCE

### SECURITY
- **`SECURITY DEFINER` function** with strict RLS
- No patient identity exposure to trial sponsors
- Only notification automation (no enrollment)

---

## 🚦 Status

**INBOX** - Awaiting LEAD architectural review

---

## 📋 Technical Specifications

### Table Schema
```sql
CREATE TABLE ref_clinical_trials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  inclusion_criteria_json JSONB NOT NULL,
  payout_amount NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### RPC Function
```sql
CREATE OR REPLACE FUNCTION match_trials_for_user(user_id UUID)
RETURNS TABLE (trial_id UUID, title TEXT, match_score NUMERIC)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
-- Match logic here
$$;
```

---

## Dependencies

- `log_sessions` table must have outcome data

## LEAD ARCHITECTURE

**Technical Strategy:**
Create database table and RPC function to match anonymous patient profiles against clinical trial criteria.

**Files to Touch:**
- Supabase SQL Editor - Create `ref_clinical_trials` table
- Supabase SQL Editor - Create `match_trials_for_user()` RPC function

**Constraints:**
- MUST NOT expose patient identities to trial sponsors
- MUST NOT automate enrollment (only notification)
- MUST use `SECURITY DEFINER` with strict RLS
- MUST scan `log_sessions` for phenotype matching

**Recommended Approach:**
1. Create `ref_clinical_trials` table (id, inclusion_criteria_json, payout_amount)
2. Create RPC `match_trials_for_user(user_id)`:
   - Scans user's `log_sessions` for phenotypes
   - Matches against trial inclusion criteria (JSON)
   - Returns eligible trials list
3. Frontend shows "Recruitment Opportunity" badge

**Risk Mitigation:**
- Strict RLS enforcement
- No patient identity exposure
- Only notification automation (no enrollment)
- Verify `log_sessions` has outcome data first
