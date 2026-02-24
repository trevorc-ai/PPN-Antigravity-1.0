# DATABASE SCHEMA VERSION

**Version:** 1.0.1  
**Locked Date:** 2026-02-24  
**Locked By:** INSPECTOR

---

## ⚠️ SCHEMA IS LOCKED - NO MODIFICATIONS ALLOWED

This schema has been stabilized after critical remediation work. Any changes require:
1. Written approval from project lead
2. Full migration plan review
3. Rollback strategy documented

---

## Current Table Names (CANONICAL)

### Log Tables (Data Storage)
- `log_clinical_records`
- `log_consent`
- `log_feature_flags`
- `log_interventions`
- `log_outcomes`
- `log_patient_flow_events`
- `log_patient_site_links`
- `log_protocols`
- `log_waitlist` (Added in v1.0.1)
- `log_safety_events`
- `log_sites`
- `log_subscriptions`
- `log_system_events`
- `log_usage_metrics`
- `log_user_profiles`
- `log_user_saved_views`
- `log_user_sites`
- `log_user_subscriptions`

### Reference Tables (Controlled Values)
- `ref_*` (all reference tables)

---

## Schema Rules (IMMUTABLE)

1. **All data tables MUST have `log_` prefix**
2. **All reference tables MUST have `ref_` prefix**
3. **Primary keys:**
   - `log_sites.site_id` (UUID)
   - `log_user_sites.id` (BIGSERIAL)
   - `log_user_profiles.user_id` (UUID)
4. **NO free-text patient data**
5. **RLS enabled on ALL tables**

---

## Last Schema Change

**Commit:** `3bde8f7`
**Date:** 2026-02-24  
**Changes:** Replaced MVP `academy_waitlist` with `log_waitlist`. Added strict `uuid` columns for patients to deprecate free text across 6 `log_` tables. Added `bigint` columns for justification constraints.

---

## Pending Work

### TODO: RLS Policies for User Registration

> [!IMPORTANT]
> **Blocked by:** Provider registration strategy decision
> 
> **Action Required:** After deciding on provider registration flow, revisit RLS policies for:
> - `log_user_profiles` - How do new users create their profile?
> - `log_user_sites` - How do users get assigned to sites?
> - Registration flow security model
> 
> **Current State:** Basic RLS policies applied, but may need adjustment based on registration strategy

---

**DO NOT MODIFY THIS SCHEMA WITHOUT EXPLICIT APPROVAL**
