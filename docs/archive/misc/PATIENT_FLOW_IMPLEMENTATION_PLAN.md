# Patient Flow Deep Dive - Implementation Plan
**Date:** February 8, 2026  
**Version:** 1.0  
**Status:** Strategic Blueprint → Ready for Implementation

---

## Executive Summary

**Decision Locked:** We are building the **Patient Flow Deep Dive** as the template for all 11 Deep Dive pages.

**Why Patient Flow First:**
1. Exposes the event timeline model that all other analytics depend on
2. Forces us to solve PHI-safe patient tracking (hashed identifiers)
3. Requires the full shared UX layer (filters, cohorts, exports)
4. Tests our governance rules (small-cell suppression, metric definitions)
5. Provides immediate clinical value (dropout analysis, follow-up compliance)

**Priority:** Build the reusable foundation, even if it takes longer. A credible demo built on sand will collapse when we add the other 10 pages.

---

## Locked-In Decisions

### 1. What's Missing: **D) All of the Above**
- ✅ Missing shared UX layer (filters, cohorts, saved views, exports)
- ✅ Missing data model and governance plumbing (event timeline, coded inputs, small-cell rules)
- ✅ Missing implied Deep Dives (distribution views, integration compliance, capacity analytics)

### 2. Template Deep Dive: **B) Patient Flow**

### 3. Default Funnel Stage Order: **A) Intake → Consent → Baseline → Session → Follow-up**

**Rationale:**
- Consent is legally required before any clinical activity
- Baseline assessment establishes the starting point for outcomes
- Session is the intervention delivery
- Follow-up validates whether outcomes are sustained

### 4. Patient Tracking: **YES - Use patient_link_code_hash**

**Rules:**
- Store only SHA-256 hash in `log_patient_flow_events`
- Never display the hash in UI
- Apply small-cell suppression (N=10) on all patient-level aggregations
- Original `patient_link_code` stays in `log_clinical_records` for operational use

### 5. Small-Cell Threshold: **N = 10**

**Application:**
- If a chart filter results in < 10 sessions OR < 10 unique patient hashes, show "Insufficient data for display"
- Applies to all Deep Dives, not just Patient Flow

---

## The Platform Layer (Shared Across All 11 Deep Dives)

### A. Global Filter Bar Component

**Location:** `/src/components/analytics/GlobalFilterBar.tsx` (to be created)

**Standard Filters (in order):**
1. **Site** - Dropdown from `user_sites` (filtered by user's access)
2. **Date Range** - Preset + custom range picker
   - Presets: Last 30 days, Last 90 days, This quarter, Last 6 months, Last year, Custom
3. **Substance** - Multi-select from `ref_substances`
4. **Protocol** - Multi-select from protocol definitions
5. **Route** - Multi-select from `ref_routes`
6. **Condition** - Multi-select from condition reference (when added)
7. **Support Modality** - Multi-select from `ref_support_modality`
8. **Session Type** - Single select (individual, group)

**Behavior:**
- Filters persist in URL query params (shareable links)
- "Clear All" button resets to defaults
- Filter state managed via React Context (`FilterContext`)
- All Deep Dives subscribe to the same filter state

### B. Cohort Selector Component

**Location:** `/src/components/analytics/CohortSelector.tsx` (to be created)

**Preset Cohorts:**
1. **All Sessions** - No patient-level filtering
2. **New Patients** - First session within date range (no prior sessions)
3. **Returning Patients** - Has prior session before date range
4. **First Session Only** - Only the first session per patient
5. **Multi-Session Cohort** - Patients with 2+ sessions in range

**Custom Cohort Builder (Phase 2):**
- Allow users to define cohorts by combining filters
- Save custom cohorts to `user_saved_cohorts` table

### C. Saved Views

**Database Table:** `user_saved_views`

```sql
CREATE TABLE public.user_saved_views (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    view_name TEXT NOT NULL,
    deep_dive_page TEXT NOT NULL, -- 'patient_flow', 'safety_surveillance', etc.
    filter_state JSONB NOT NULL, -- Serialized filter + cohort state
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Features:**
- Save current filter + cohort + chart configuration
- Set one view as default per Deep Dive page
- Share views with other users at the same site (Phase 2)

### D. Metric Definitions Panel

**Component:** `MetricTooltip.tsx`

**Required Fields:**
- **Metric Name** - Plain language label
- **Definition** - What it measures in 1-2 sentences
- **Calculation** - Formula or aggregation method
- **Data Source** - Which tables/views are used
- **Exclusions** - What data is filtered out
- **Interpretation** - What "good" looks like

**Storage:** `ref_metric_definitions` table

### E. Export Functionality

**Patient Flow Exports:**
1. **CSV: Stage Counts** - Funnel data with counts per stage
2. **CSV: Time-to-Next-Step** - Median days between stages
3. **CSV: Follow-up Compliance** - Percent completed by timepoint
4. **PDF: Full Report** - All charts + filters + timestamp (Phase 2)

**Implementation:**
- Use `papaparse` for CSV generation
- Include filter state in export header
- Add "Exported by [user] on [date]" footer
- Respect small-cell suppression in exports

### F. Data Completeness Indicator

**Component:** `DataQualityBadge.tsx`

**Metrics to Display:**
- Baseline captured: X% of sessions have baseline assessment
- Follow-up captured: X% of sessions have follow-up at expected interval
- Missing critical fields: Count of records with null required fields

**Visual:**
- Green badge: ≥90% complete
- Yellow badge: 70-89% complete
- Red badge: <70% complete

---

## Database Schema: Patient Flow Foundation

### Core Tables (Add-Only, No Deletions)

#### 1. `sites` (if not exists)

```sql
CREATE TABLE IF NOT EXISTS public.sites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    site_name TEXT NOT NULL,
    site_code TEXT UNIQUE NOT NULL, -- e.g., 'SITE001'
    region TEXT, -- State/province
    site_type TEXT CHECK (site_type IN ('clinic', 'research', 'hospital')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 2. `user_sites` (if not exists)

```sql
CREATE TABLE IF NOT EXISTS public.user_sites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('network_admin', 'site_admin', 'clinician', 'analyst', 'auditor')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, site_id)
);
```

#### 3. `ref_flow_event_types`

```sql
CREATE TABLE public.ref_flow_event_types (
    id BIGSERIAL PRIMARY KEY,
    event_type_code TEXT UNIQUE NOT NULL, -- 'intake_started', 'session_completed'
    event_type_label TEXT NOT NULL, -- 'Intake Started', 'Session Completed'
    event_category TEXT CHECK (event_category IN ('intake', 'consent', 'assessment', 'session', 'integration', 'administrative')),
    stage_order INTEGER, -- For funnel ordering (1=first, 5=last)
    is_active BOOLEAN DEFAULT TRUE,
    description TEXT
);
```

**Seed Data:**
```sql
INSERT INTO public.ref_flow_event_types (event_type_code, event_type_label, event_category, stage_order) VALUES
('intake_started', 'Intake Started', 'intake', 1),
('intake_completed', 'Intake Completed', 'intake', 1),
('consent_verified', 'Consent Verified', 'consent', 2),
('baseline_assessment_completed', 'Baseline Assessment Completed', 'assessment', 3),
('session_completed', 'Session Completed', 'session', 4),
('followup_assessment_completed', 'Follow-up Assessment Completed', 'assessment', 5),
('integration_visit_completed', 'Integration Visit Completed', 'integration', 5),
('treatment_paused', 'Treatment Paused', 'administrative', NULL),
('treatment_discontinued', 'Treatment Discontinued', 'administrative', NULL);
```

#### 4. `log_patient_flow_events` (THE CRITICAL TABLE)

```sql
CREATE TABLE public.log_patient_flow_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    site_id UUID REFERENCES public.sites(id) NOT NULL,
    practitioner_id UUID REFERENCES auth.users(id), -- Optional, who recorded the event
    patient_link_code_hash TEXT NOT NULL, -- SHA-256 hash, never displayed
    event_type_id BIGINT REFERENCES public.ref_flow_event_types(id) NOT NULL,
    event_at TIMESTAMPTZ NOT NULL, -- When the event occurred
    
    -- Context (optional, for filtering)
    protocol_id UUID, -- FK to protocol definitions when that table exists
    substance_id BIGINT, -- FK to ref_substances
    route_id BIGINT, -- FK to ref_routes
    support_modality_ids BIGINT[], -- Array of modality IDs
    
    -- Traceability (optional)
    source_table TEXT, -- 'log_clinical_records', 'log_outcomes', etc.
    source_id UUID, -- ID of the originating record
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Indexes for performance
CREATE INDEX idx_flow_events_site_event_at ON public.log_patient_flow_events(site_id, event_at);
CREATE INDEX idx_flow_events_site_event_type ON public.log_patient_flow_events(site_id, event_type_id, event_at);
CREATE INDEX idx_flow_events_patient_hash ON public.log_patient_flow_events(site_id, patient_link_code_hash);
CREATE INDEX idx_flow_events_substance ON public.log_patient_flow_events(substance_id) WHERE substance_id IS NOT NULL;
```

#### 5. Add Timestamp Columns to Existing Tables (Non-Breaking)

```sql
-- Add timestamptz columns alongside existing text date fields
ALTER TABLE public.log_outcomes 
ADD COLUMN IF NOT EXISTS observed_at TIMESTAMPTZ;

ALTER TABLE public.log_consent 
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ;

-- Backfill from text dates if possible (manual data migration)
-- UPDATE public.log_outcomes SET observed_at = date::timestamptz WHERE date IS NOT NULL;
```

---

## Chart-Ready Views (RLS-Enforced)

### View 1: `v_flow_stage_counts`

**Purpose:** Funnel chart data - how many events at each stage

```sql
CREATE OR REPLACE VIEW public.v_flow_stage_counts AS
SELECT 
    e.site_id,
    et.event_type_code,
    et.event_type_label,
    et.stage_order,
    DATE_TRUNC('week', e.event_at) AS week_bucket,
    DATE_TRUNC('month', e.event_at) AS month_bucket,
    COUNT(e.id) AS count_events,
    COUNT(DISTINCT e.patient_link_code_hash) AS count_unique_patients
FROM public.log_patient_flow_events e
JOIN public.ref_flow_event_types et ON e.event_type_id = et.id
WHERE et.stage_order IS NOT NULL -- Exclude administrative events
GROUP BY e.site_id, et.event_type_code, et.event_type_label, et.stage_order, week_bucket, month_bucket;
```

**Frontend Usage:**
```typescript
const { data } = await supabase
  .from('v_flow_stage_counts')
  .select('*')
  .eq('site_id', userSiteId)
  .gte('week_bucket', startDate)
  .lte('week_bucket', endDate)
  .order('stage_order');
```

### View 2: `v_flow_time_to_next_step`

**Purpose:** Median days between consecutive stages

```sql
CREATE OR REPLACE VIEW public.v_flow_time_to_next_step AS
WITH event_pairs AS (
    SELECT 
        e1.site_id,
        e1.patient_link_code_hash,
        et1.event_type_code AS from_event,
        et1.event_type_label AS from_event_label,
        et2.event_type_code AS to_event,
        et2.event_type_label AS to_event_label,
        EXTRACT(EPOCH FROM (e2.event_at - e1.event_at)) / 86400 AS days_between
    FROM public.log_patient_flow_events e1
    JOIN public.log_patient_flow_events e2 
        ON e1.patient_link_code_hash = e2.patient_link_code_hash 
        AND e1.site_id = e2.site_id
        AND e2.event_at > e1.event_at
    JOIN public.ref_flow_event_types et1 ON e1.event_type_id = et1.id
    JOIN public.ref_flow_event_types et2 ON e2.event_type_id = et2.id
    WHERE et1.stage_order IS NOT NULL 
      AND et2.stage_order IS NOT NULL
      AND et2.stage_order = et1.stage_order + 1 -- Only consecutive stages
)
SELECT 
    site_id,
    from_event,
    from_event_label,
    to_event,
    to_event_label,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY days_between) AS median_days,
    PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY days_between) AS p75_days,
    COUNT(DISTINCT patient_link_code_hash) AS n_patients
FROM event_pairs
GROUP BY site_id, from_event, from_event_label, to_event, to_event_label
HAVING COUNT(DISTINCT patient_link_code_hash) >= 10; -- Small-cell suppression
```

### View 3: `v_followup_compliance`

**Purpose:** Percent of sessions with follow-up assessments completed

```sql
CREATE OR REPLACE VIEW public.v_followup_compliance AS
WITH sessions AS (
    SELECT 
        site_id,
        patient_link_code_hash,
        event_at AS session_date
    FROM public.log_patient_flow_events
    WHERE event_type_id = (SELECT id FROM public.ref_flow_event_types WHERE event_type_code = 'session_completed')
),
followups AS (
    SELECT 
        site_id,
        patient_link_code_hash,
        event_at AS followup_date
    FROM public.log_patient_flow_events
    WHERE event_type_id = (SELECT id FROM public.ref_flow_event_types WHERE event_type_code = 'followup_assessment_completed')
)
SELECT 
    s.site_id,
    DATE_TRUNC('month', s.session_date) AS month_bucket,
    COUNT(DISTINCT s.patient_link_code_hash) AS total_sessions,
    COUNT(DISTINCT f.patient_link_code_hash) AS sessions_with_followup,
    ROUND(100.0 * COUNT(DISTINCT f.patient_link_code_hash) / NULLIF(COUNT(DISTINCT s.patient_link_code_hash), 0), 1) AS pct_completed
FROM sessions s
LEFT JOIN followups f 
    ON s.site_id = f.site_id 
    AND s.patient_link_code_hash = f.patient_link_code_hash
    AND f.followup_date > s.session_date
    AND f.followup_date <= s.session_date + INTERVAL '45 days' -- Define "timely" follow-up
GROUP BY s.site_id, month_bucket
HAVING COUNT(DISTINCT s.patient_link_code_hash) >= 10; -- Small-cell suppression
```

---

## Row-Level Security (RLS) Policies

### Enable RLS on New Tables

```sql
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ref_flow_event_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.log_patient_flow_events ENABLE ROW LEVEL SECURITY;
```

### Policies for `sites`

```sql
-- Read: Users can see sites they belong to
CREATE POLICY "Users can view their sites"
ON public.sites FOR SELECT
USING (
    id IN (
        SELECT site_id FROM public.user_sites 
        WHERE user_id = auth.uid() AND is_active = TRUE
    )
    OR
    EXISTS (
        SELECT 1 FROM public.user_sites 
        WHERE user_id = auth.uid() AND role = 'network_admin'
    )
);

-- Write: Only network_admin
CREATE POLICY "Network admin can manage sites"
ON public.sites FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.user_sites 
        WHERE user_id = auth.uid() AND role = 'network_admin'
    )
);
```

### Policies for `user_sites`

```sql
-- Read: Users can see their own site memberships
CREATE POLICY "Users can view their site memberships"
ON public.user_sites FOR SELECT
USING (
    user_id = auth.uid()
    OR
    EXISTS (
        SELECT 1 FROM public.user_sites 
        WHERE user_id = auth.uid() AND role IN ('network_admin', 'site_admin')
    )
);

-- Write: Only network_admin (centralized user management)
CREATE POLICY "Network admin can manage user sites"
ON public.user_sites FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.user_sites 
        WHERE user_id = auth.uid() AND role = 'network_admin'
    )
);
```

### Policies for `ref_flow_event_types`

```sql
-- Read: All authenticated users
CREATE POLICY "Authenticated users can view event types"
ON public.ref_flow_event_types FOR SELECT
USING (auth.role() = 'authenticated');

-- Write: Only network_admin
CREATE POLICY "Network admin can manage event types"
ON public.ref_flow_event_types FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.user_sites 
        WHERE user_id = auth.uid() AND role = 'network_admin'
    )
);
```

### Policies for `log_patient_flow_events`

```sql
-- Read: Users can see events from their sites
CREATE POLICY "Users can view events from their sites"
ON public.log_patient_flow_events FOR SELECT
USING (
    site_id IN (
        SELECT site_id FROM public.user_sites 
        WHERE user_id = auth.uid() AND is_active = TRUE
    )
);

-- Insert: Clinicians and site_admins can create events for their sites
CREATE POLICY "Clinicians can create events for their sites"
ON public.log_patient_flow_events FOR INSERT
WITH CHECK (
    site_id IN (
        SELECT site_id FROM public.user_sites 
        WHERE user_id = auth.uid() 
        AND role IN ('clinician', 'site_admin', 'network_admin')
        AND is_active = TRUE
    )
);

-- Update: Clinicians can update events they created
CREATE POLICY "Clinicians can update their own events"
ON public.log_patient_flow_events FOR UPDATE
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

-- Delete: Only network_admin (for test data cleanup)
CREATE POLICY "Network admin can delete events"
ON public.log_patient_flow_events FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM public.user_sites 
        WHERE user_id = auth.uid() AND role = 'network_admin'
    )
);
```

---

## Frontend Components (React + TypeScript)

### 1. Patient Flow Page Structure

**File:** `/src/pages/deep-dives/PatientFlowPage.tsx`

```typescript
import React, { useState, useEffect } from 'react';
import { GlobalFilterBar } from '../../components/analytics/GlobalFilterBar';
import { CohortSelector } from '../../components/analytics/CohortSelector';
import { DataQualityBadge } from '../../components/analytics/DataQualityBadge';
import { MetricCard } from '../../components/analytics/MetricCard';
import { FunnelChart } from '../../components/charts/FunnelChart';
import { TimeToStepChart } from '../../components/charts/TimeToStepChart';
import { ComplianceChart } from '../../components/charts/ComplianceChart';
import { ExportButton } from '../../components/analytics/ExportButton';

export default function PatientFlowPage() {
  const [filterState, setFilterState] = useState({});
  const [cohort, setCohort] = useState('all_sessions');
  
  return (
    <div className="min-h-screen bg-[#05070a] p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Patient Flow Analysis</h1>
            <p className="text-gray-400 mt-1">Track patient progression through treatment stages</p>
          </div>
          <ExportButton page="patient_flow" filters={filterState} />
        </div>

        {/* Data Quality Indicator */}
        <DataQualityBadge />

        {/* Filter Bar */}
        <GlobalFilterBar onChange={setFilterState} />

        {/* Cohort Selector */}
        <CohortSelector value={cohort} onChange={setCohort} />

        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard 
            title="Total Sessions" 
            value="1,247" 
            change="+12%" 
            metric="total_sessions"
          />
          <MetricCard 
            title="Completion Rate" 
            value="78%" 
            change="+5%" 
            metric="completion_rate"
          />
          <MetricCard 
            title="Avg. Time to Follow-up" 
            value="14 days" 
            change="-2 days" 
            metric="avg_followup_time"
          />
          <MetricCard 
            title="Follow-up Compliance" 
            value="82%" 
            change="+3%" 
            metric="followup_compliance"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FunnelChart filters={filterState} cohort={cohort} />
          <TimeToStepChart filters={filterState} cohort={cohort} />
        </div>

        <ComplianceChart filters={filterState} cohort={cohort} />

      </div>
    </div>
  );
}
```

### 2. Small-Cell Suppression Utility

**File:** `/src/utils/smallCellSuppression.ts`

```typescript
const SMALL_CELL_THRESHOLD = 10;

export function applySmallCellSuppression<T>(
  data: T[],
  countField: keyof T
): T[] | null {
  const totalCount = data.reduce((sum, row) => sum + (row[countField] as number), 0);
  
  if (totalCount < SMALL_CELL_THRESHOLD) {
    return null; // Suppress entire dataset
  }
  
  return data.filter(row => (row[countField] as number) >= SMALL_CELL_THRESHOLD);
}

export function InsufficientDataMessage() {
  return (
    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6 text-center">
      <p className="text-yellow-400 font-medium">Insufficient Data</p>
      <p className="text-gray-400 text-sm mt-2">
        This view requires at least {SMALL_CELL_THRESHOLD} sessions to display results.
      </p>
    </div>
  );
}
```

---

## Seed Data for Demo

**File:** `/seed_patient_flow_demo.sql`

```sql
-- Seed 2 sites
INSERT INTO public.sites (id, site_name, site_code, region, site_type) VALUES
('11111111-1111-1111-1111-111111111111', 'DEMO_Portland Psychedelic Clinic', 'DEMO_PPC', 'Oregon', 'clinic'),
('22222222-2222-2222-2222-222222222222', 'DEMO_Seattle Research Center', 'DEMO_SRC', 'Washington', 'research');

-- Seed 200 flow events across 60 patients
-- (Use DEMO_ prefix so we can delete later)
DO $$
DECLARE
    site_ids UUID[] := ARRAY[
        '11111111-1111-1111-1111-111111111111'::UUID,
        '22222222-2222-2222-2222-222222222222'::UUID
    ];
    patient_num INTEGER;
    site_id UUID;
    base_date TIMESTAMPTZ;
BEGIN
    FOR patient_num IN 1..60 LOOP
        site_id := site_ids[(patient_num % 2) + 1];
        base_date := NOW() - (random() * INTERVAL '90 days');
        
        -- Intake
        INSERT INTO public.log_patient_flow_events (
            site_id, patient_link_code_hash, event_type_id, event_at
        ) VALUES (
            site_id,
            'DEMO_PATIENT_' || LPAD(patient_num::TEXT, 4, '0'),
            (SELECT id FROM public.ref_flow_event_types WHERE event_type_code = 'intake_completed'),
            base_date
        );
        
        -- Consent (80% complete this step)
        IF random() > 0.2 THEN
            INSERT INTO public.log_patient_flow_events (
                site_id, patient_link_code_hash, event_type_id, event_at
            ) VALUES (
                site_id,
                'DEMO_PATIENT_' || LPAD(patient_num::TEXT, 4, '0'),
                (SELECT id FROM public.ref_flow_event_types WHERE event_type_code = 'consent_verified'),
                base_date + INTERVAL '2 days'
            );
            
            -- Baseline (90% of those who consented)
            IF random() > 0.1 THEN
                INSERT INTO public.log_patient_flow_events (
                    site_id, patient_link_code_hash, event_type_id, event_at
                ) VALUES (
                    site_id,
                    'DEMO_PATIENT_' || LPAD(patient_num::TEXT, 4, '0'),
                    (SELECT id FROM public.ref_flow_event_types WHERE event_type_code = 'baseline_assessment_completed'),
                    base_date + INTERVAL '5 days'
                );
                
                -- Session (95% of those with baseline)
                IF random() > 0.05 THEN
                    INSERT INTO public.log_patient_flow_events (
                        site_id, patient_link_code_hash, event_type_id, event_at
                    ) VALUES (
                        site_id,
                        'DEMO_PATIENT_' || LPAD(patient_num::TEXT, 4, '0'),
                        (SELECT id FROM public.ref_flow_event_types WHERE event_type_code = 'session_completed'),
                        base_date + INTERVAL '10 days'
                    );
                    
                    -- Follow-up (70% complete)
                    IF random() > 0.3 THEN
                        INSERT INTO public.log_patient_flow_events (
                            site_id, patient_link_code_hash, event_type_id, event_at
                        ) VALUES (
                            site_id,
                            'DEMO_PATIENT_' || LPAD(patient_num::TEXT, 4, '0'),
                            (SELECT id FROM public.ref_flow_event_types WHERE event_type_code = 'followup_assessment_completed'),
                            base_date + INTERVAL '24 days'
                        );
                    END IF;
                END IF;
            END IF;
        END IF;
    END LOOP;
END $$;
```

---

## Implementation Checklist

### Phase 1: Database Foundation (Week 1)
- [ ] Create `sites` table
- [ ] Create `user_sites` table
- [ ] Create `ref_flow_event_types` table + seed data
- [ ] Create `log_patient_flow_events` table + indexes
- [ ] Add timestamp columns to `log_outcomes` and `log_consent`
- [ ] Apply RLS policies to all new tables
- [ ] Run seed data script for demo

### Phase 2: Chart Views (Week 1-2)
- [ ] Create `v_flow_stage_counts` view
- [ ] Create `v_flow_time_to_next_step` view
- [ ] Create `v_followup_compliance` view
- [ ] Test views with seed data
- [ ] Verify small-cell suppression works

### Phase 3: Shared UX Components (Week 2-3)
- [ ] Build `GlobalFilterBar` component
- [ ] Build `CohortSelector` component
- [ ] Build `DataQualityBadge` component
- [ ] Build `MetricCard` component
- [ ] Build `MetricTooltip` component
- [ ] Build `ExportButton` component
- [ ] Create `FilterContext` for state management

### Phase 4: Charts (Week 3-4)
- [ ] Build `FunnelChart` component (Recharts)
- [ ] Build `TimeToStepChart` component (Recharts)
- [ ] Build `ComplianceChart` component (Recharts)
- [ ] Implement small-cell suppression in all charts
- [ ] Add loading states and error handling

### Phase 5: Patient Flow Page (Week 4)
- [ ] Build `PatientFlowPage.tsx`
- [ ] Integrate all components
- [ ] Wire up Supabase queries to views
- [ ] Test with demo data
- [ ] Verify RLS enforcement

### Phase 6: Saved Views (Week 5)
- [ ] Create `user_saved_views` table
- [ ] Build save/load functionality
- [ ] Add "Set as Default" feature
- [ ] Test persistence across sessions

### Phase 7: Export (Week 5)
- [ ] Implement CSV export for all 3 charts
- [ ] Add filter metadata to export headers
- [ ] Test export with suppressed data

### Phase 8: Documentation (Week 6)
- [ ] Document metric definitions
- [ ] Create user guide for Patient Flow
- [ ] Document filter behavior
- [ ] Create template for other Deep Dives

---

## Success Criteria

**Patient Flow is complete when:**

1. ✅ A clinician can view a funnel showing dropout at each stage
2. ✅ A clinic lead can see median time between stages
3. ✅ An analyst can filter by substance, route, and date range
4. ✅ Small-cell suppression prevents display of <10 patients
5. ✅ Users can save their filter configuration
6. ✅ Data quality indicators show completeness
7. ✅ All charts export to CSV
8. ✅ RLS prevents cross-site data leakage
9. ✅ The same filter bar works on other Deep Dive pages
10. ✅ Metric tooltips explain what each number means

---

## Template for Other Deep Dives

Once Patient Flow is complete, we replicate this pattern for:

1. **Safety Surveillance** - Uses same filter bar + event timeline
2. **Comparative Efficacy** - Uses same cohort selector + metric definitions
3. **Integration Compliance** - Uses same data quality badge + export
4. **Capacity & Utilization** - Uses same saved views + small-cell rules

**Estimated Time Savings:** 40-50% faster per Deep Dive after the first one is complete.

---

**Next Step:** Review and approve this plan, then I'll generate the complete SQL migration script.
