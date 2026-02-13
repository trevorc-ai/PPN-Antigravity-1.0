# Patient Flow Implementation - Quick Start Guide

**Date:** February 8, 2026  
**Status:** Ready to Execute

---

## 📋 What We Just Created

### 1. Strategic Documents
- **`PATIENT_FLOW_IMPLEMENTATION_PLAN.md`** - Complete blueprint with architecture, components, and phased checklist
- **`migrations/001_patient_flow_foundation.sql`** - Production-ready database migration (copy-paste into Supabase)
- **`migrations/002_seed_demo_data.sql`** - Demo data generator (60 patients, 200+ events)
- **`QUICK_START.md`** - This file

### 2. What Gets Created in Supabase

#### Core Tables (7)
- `sites` - Clinical sites in the network
- `user_sites` - User-to-site role mapping
- `ref_flow_event_types` - Standard event vocabulary (9 event types seeded)
- `ref_substances` - Substance catalog (5 demo substances)
- `ref_routes` - Administration routes (5 routes seeded)
- `ref_support_modality` - Support modalities (5 modalities seeded)
- `log_patient_flow_events` - **THE CORE TABLE** - Event timeline for patient flow

#### Chart-Ready Views (3)
- `v_flow_stage_counts` - Funnel chart data
- `v_flow_time_to_next_step` - Median days between stages
- `v_followup_compliance` - Follow-up completion rates

#### Supporting Tables (2)
- `user_saved_views` - Save filter configurations
- `system_events` - Audit log

#### Helper Functions (2)
- `hash_patient_link_code()` - SHA-256 hashing for PHI safety
- `is_network_admin()` - Role check helper

---

## 🚀 How to Execute (Step-by-Step)

### Step 1: Run the Foundation Migration

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy the **entire contents** of `migrations/001_patient_flow_foundation.sql`
5. Paste into the SQL Editor
6. Click **Run**
7. Wait for success message: `✅ Migration 001_patient_flow_foundation completed successfully`

**Expected Duration:** 10-15 seconds

**What This Does:**
- Creates all 7 core tables
- Creates 3 chart-ready views
- Applies RLS policies (site isolation + role-based access)
- Creates indexes for performance
- Seeds reference data (event types, routes, modalities)

### Step 2: Run the Demo Data Seed

1. In Supabase SQL Editor, create another new query
2. Copy the **entire contents** of `migrations/002_seed_demo_data.sql`
3. Paste and click **Run**
4. Wait for success message: `✅ Demo data seed completed successfully`

**Expected Duration:** 5-10 seconds

**What This Does:**
- Creates 2 demo sites (Portland, Seattle)
- Generates 60 demo patients (DEMO_PATIENT_0001 through DEMO_PATIENT_0060)
- Creates 200+ flow events with realistic dropout patterns:
  - 60 intakes (100%)
  - ~48 consents (80%)
  - ~43 baselines (90% of consented)
  - ~41 sessions (95% of baseline)
  - ~29 follow-ups (70% of sessions)

### Step 3: Verify the Data

Run these queries in Supabase SQL Editor to confirm:

```sql
-- Count events by stage
SELECT 
    et.event_type_label,
    COUNT(*) as count,
    COUNT(DISTINCT e.patient_link_code_hash) as unique_patients
FROM public.log_patient_flow_events e
JOIN public.ref_flow_event_types et ON e.event_type_id = et.id
WHERE e.patient_link_code_hash LIKE 'DEMO_%'
GROUP BY et.event_type_label, et.stage_order
ORDER BY et.stage_order;
```

**Expected Output:**
```
Intake Completed: 60 events, 60 patients
Consent Verified: ~48 events, ~48 patients
Baseline Assessment Completed: ~43 events, ~43 patients
Session Completed: ~41 events, ~41 patients
Follow-up Assessment Completed: ~29 events, ~29 patients
```

```sql
-- Test the funnel view
SELECT 
    event_type_label,
    stage_order,
    SUM(count_events) as total_events,
    SUM(count_unique_patients) as total_patients
FROM public.v_flow_stage_counts
GROUP BY event_type_label, stage_order
ORDER BY stage_order;
```

```sql
-- Test the time-to-next-step view
SELECT 
    from_event_label,
    to_event_label,
    median_days,
    n_patients
FROM public.v_flow_time_to_next_step
ORDER BY from_stage;
```

---

## 🔐 Security Verification

### Test RLS Policies

The migration includes Row-Level Security policies. Here's what they enforce:

#### Site Isolation
- Users can only see data from sites they belong to (via `user_sites` table)
- `network_admin` can see all sites

#### Role-Based Access
- **network_admin**: Full access, can delete test data
- **site_admin**: Manage own site
- **clinician**: Create/edit clinical records for own site
- **analyst**: Read-only access to site data
- **auditor**: Read-only access to site data

#### Reference Tables
- **Read**: All authenticated users
- **Write**: `network_admin` only

### To Test (After Creating a User)

```sql
-- Create a test user mapping (replace with real auth.users ID)
INSERT INTO public.user_sites (user_id, site_id, role) VALUES
('YOUR_AUTH_USER_ID', '11111111-1111-1111-1111-111111111111', 'clinician');

-- Now when that user queries, they'll only see Portland site data
SELECT * FROM public.log_patient_flow_events; -- Only Portland events visible
```

---

## 🧹 Cleanup Demo Data (When Ready)

When you're ready to remove demo data and start with real data:

```sql
-- Remove demo flow events
DELETE FROM public.log_patient_flow_events 
WHERE patient_link_code_hash LIKE 'DEMO_%';

-- Remove demo sites
DELETE FROM public.sites 
WHERE site_code LIKE 'DEMO_%';

-- Verify cleanup
SELECT COUNT(*) FROM public.log_patient_flow_events; -- Should be 0
```

---

## 📊 Next Steps: Frontend Implementation

### Phase 1: Shared Components (Week 2-3)

Create these reusable components in `/src/components/analytics/`:

1. **`GlobalFilterBar.tsx`**
   - Date range picker
   - Site selector
   - Substance multi-select
   - Route multi-select
   - Protocol selector
   - Uses `FilterContext` for state management

2. **`CohortSelector.tsx`**
   - Preset cohorts: All, New Patients, Returning, etc.
   - Custom cohort builder (Phase 2)

3. **`DataQualityBadge.tsx`**
   - Shows baseline capture %
   - Shows follow-up capture %
   - Color-coded: green (≥90%), yellow (70-89%), red (<70%)

4. **`MetricCard.tsx`**
   - Displays single metric with trend
   - Includes tooltip with definition

5. **`ExportButton.tsx`**
   - CSV export functionality
   - Includes filter state in export

### Phase 2: Chart Components (Week 3-4)

Create these in `/src/components/charts/`:

1. **`FunnelChart.tsx`**
   - Uses Recharts
   - Queries `v_flow_stage_counts`
   - Shows dropout at each stage
   - Implements small-cell suppression

2. **`TimeToStepChart.tsx`**
   - Bar chart showing median days between stages
   - Queries `v_flow_time_to_next_step`
   - Shows P25, median, P75

3. **`ComplianceChart.tsx`**
   - Line chart showing follow-up % over time
   - Queries `v_followup_compliance`

### Phase 3: Patient Flow Page (Week 4)

Update `/src/pages/deep-dives/PatientFlowPage.tsx`:

```typescript
import { GlobalFilterBar } from '../../components/analytics/GlobalFilterBar';
import { CohortSelector } from '../../components/analytics/CohortSelector';
import { FunnelChart } from '../../components/charts/FunnelChart';
// ... etc

export default function PatientFlowPage() {
  const [filters, setFilters] = useState({});
  const [cohort, setCohort] = useState('all_sessions');
  
  return (
    <div className="min-h-screen bg-[#05070a] p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <GlobalFilterBar onChange={setFilters} />
        <CohortSelector value={cohort} onChange={setCohort} />
        <FunnelChart filters={filters} cohort={cohort} />
        {/* ... other charts */}
      </div>
    </div>
  );
}
```

---

## 🎯 Success Criteria Checklist

Patient Flow is complete when:

- [ ] Funnel chart displays with demo data
- [ ] Time-to-next-step chart shows median days
- [ ] Follow-up compliance chart shows trends
- [ ] Filters work and update all charts
- [ ] Small-cell suppression prevents <10 patient display
- [ ] Users can save filter configurations
- [ ] Data quality badge shows completeness
- [ ] CSV export works for all charts
- [ ] RLS prevents cross-site data access
- [ ] Metric tooltips explain each number

---

## 📚 Reference: Key Decisions Locked In

### Funnel Stage Order
**A) Intake → Consent → Baseline → Session → Follow-up**

### Patient Tracking
**YES - Use `patient_link_code_hash`**
- Store SHA-256 hash only
- Never display in UI
- Apply small-cell suppression (N=10)

### Small-Cell Threshold
**N = 10**
- If < 10 sessions OR < 10 unique patients, show "Insufficient data"

### Priority
**Build reusable foundation** (not quick demo)
- This becomes the template for all 11 Deep Dives
- Shared components save 40-50% time on subsequent pages

---

## 🆘 Troubleshooting

### Migration Fails

**Error: "relation already exists"**
- Safe to ignore - script uses `IF NOT EXISTS`
- Or drop the table first: `DROP TABLE IF EXISTS public.table_name CASCADE;`

**Error: "permission denied"**
- Make sure you're running as database owner
- Check Supabase project permissions

### No Data in Views

**v_flow_stage_counts is empty**
- Run seed script (002_seed_demo_data.sql)
- Verify events exist: `SELECT COUNT(*) FROM public.log_patient_flow_events;`

**v_flow_time_to_next_step is empty**
- This view requires consecutive stage events
- Small-cell suppression may be hiding data (need ≥10 patients)

### RLS Blocking Queries

**Error: "new row violates row-level security policy"**
- Make sure user has entry in `user_sites` table
- Check role is correct: `SELECT * FROM public.user_sites WHERE user_id = auth.uid();`

---

## 📞 Next Actions

1. ✅ **Run migration 001** in Supabase SQL Editor
2. ✅ **Run seed script 002** in Supabase SQL Editor
3. ✅ **Verify data** with test queries above
4. 📋 **Review implementation plan** (PATIENT_FLOW_IMPLEMENTATION_PLAN.md)
5. 🎨 **Start building frontend components** (GlobalFilterBar first)

---

**Questions or Issues?**
- Check the full implementation plan: `PATIENT_FLOW_IMPLEMENTATION_PLAN.md`
- Review the migration SQL: `migrations/001_patient_flow_foundation.sql`
- Examine seed data logic: `migrations/002_seed_demo_data.sql`

**Ready to build the future of psychedelic medicine analytics! 🚀**
