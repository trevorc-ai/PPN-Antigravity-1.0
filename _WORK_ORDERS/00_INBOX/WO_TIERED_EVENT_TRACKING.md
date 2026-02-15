---
title: "Tiered Event Tracking & Database Views"
category: "Analytics / Database"
priority: "P1"
assigned_to: "ANALYST"
created_date: "2026-02-15"
status: "PENDING"
failure_count: 0
estimated_effort: "HIGH"
---

# Tiered Event Tracking & Database Views

## 1. THE GOAL

Establish comprehensive event tracking system with materialized database views to support real-time KPI monitoring and tier-based analytics.

### Event ID Definition (ANALYST)
Define and document all trackable events across user tiers:
* Consumer tier events (free features usage)
* Practitioner tier events (pro features, protocol logging)
* Clinic tier events (multi-user collaboration)
* Network tier events (aggregate analytics access)
* System events (authentication, errors, performance)

### Materialized Views Creation (SOOP)
Create optimized database views for real-time analytics:
* User engagement metrics by tier
* Feature adoption rates
* Conversion funnel analytics
* Retention cohort analysis
* Performance and error tracking

---

## 2. THE BLAST RADIUS (Authorized Target Area)

### ANALYST Authorization:
* `/.agent/analytics/` (Event tracking schema documentation)
* `/.agent/handoffs/` (Analytics proposal artifacts)
* `/frontend/src/lib/analytics/` (Event tracking implementation)

### SOOP Authorization:
* `/migrations/` (New migration files for materialized views)
* `/supabase/` (View definitions and refresh policies)
* Documentation of view schemas and refresh schedules

---

## 3. THE ELECTRIC FENCE (Strict "DO NOT TOUCH" Constraints)

* **DO NOT** collect any PHI/PII in event tracking
* **DO NOT** modify existing RLS policies without security review
* **DO NOT** create views that could expose cross-site data
* **DO NOT** track user behavior in a way that violates privacy policies
* **ANALYST and SOOP must coordinate** to ensure materialized views support the specific event IDs defined in the tracking schema

---

## 4. MANDATORY COMPLIANCE

### PRIVACY & SECURITY
* Zero PHI/PII collection in events
* All views must respect RLS policies
* Site isolation must be maintained
* Event data must be anonymized where applicable

### PERFORMANCE
* Materialized views must have defined refresh schedules
* Indexes must be created for common query patterns
* View complexity must not impact application performance

### DATA INTEGRITY
* Event IDs must be controlled values (no free text)
* Foreign key relationships must be maintained
* Additive-only schema changes (no dropping columns)

---

## IMPLEMENTATION WORKFLOW

### Phase 1: ANALYST (Event Schema Definition)
- [ ] Audit existing analytics implementation
- [ ] Define event taxonomy by user tier
- [ ] Create event ID reference table
- [ ] Document event payload schemas
- [ ] Define KPI calculation requirements
- [ ] Specify materialized view requirements for SOOP
- [ ] Create analytics proposal artifact

### Phase 2: SOOP (Database Implementation)
- [ ] Review event schema from ANALYST
- [ ] Design materialized view architecture
- [ ] Create migration files for views
- [ ] Implement refresh policies
- [ ] Add necessary indexes
- [ ] Test view performance with EXPLAIN ANALYZE
- [ ] Document view schemas and usage

### Phase 3: Integration & Testing
- [ ] ANALYST implements frontend event tracking
- [ ] Verify events are captured correctly
- [ ] Test materialized view accuracy
- [ ] Validate RLS policy compliance
- [ ] Confirm zero PHI/PII collection
- [ ] Performance test under load

---

## DELIVERABLES

### ANALYST Deliverables:
1. **Event Tracking Schema** documenting all event IDs and payloads
2. **KPI Definition Document** specifying metrics and calculations
3. **Materialized View Requirements** for SOOP implementation
4. **Frontend Analytics Implementation** with event tracking code
5. **Analytics Dashboard Updates** displaying real-time KPIs

### SOOP Deliverables:
1. **Migration Files** creating materialized views
2. **View Schema Documentation** with refresh schedules
3. **Performance Report** with EXPLAIN ANALYZE results
4. **RLS Compliance Verification** ensuring site isolation
5. **Index Strategy Document** for query optimization

---

## SUCCESS CRITERIA

- [ ] Complete event taxonomy defined for all user tiers
- [ ] Event IDs are controlled values (no free text)
- [ ] Materialized views created with proper refresh schedules
- [ ] Views respect RLS policies and site isolation
- [ ] Zero PHI/PII collected in event tracking
- [ ] Real-time KPIs display correctly in analytics dashboard
- [ ] Performance impact is minimal (verified with EXPLAIN ANALYZE)
- [ ] ANALYST and SOOP coordination documented
- [ ] All changes follow additive-only schema policy
