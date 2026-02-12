# 📊 SUBA TASK: CUSTOMER JOURNEY ANALYTICS INFRASTRUCTURE
## Database Schema, Calculations & Visualizations

**Assigned To:** SUBA (Database & Backend Specialist)  
**Reviewed By:** INSPECTOR (QA & Validation)  
**Managed By:** LEAD  
**Date:** 2026-02-12 02:30 PST  
**Priority:** HIGH

---

## 🎯 OBJECTIVE

Build the database infrastructure and calculation logic to support customer journey tracking, use case analytics, and practitioner performance metrics.

**What You're Building:**
1. **Journey Tracking Tables** - Track practitioner progression through journey stages
2. **Use Case Analytics** - Measure ROI for each use case
3. **Calculation Functions** - Safety scores, benchmarks, conversion rates
4. **Visualization Queries** - Power Dashboard and Analytics charts

---

## 📋 DATABASE SCHEMA REQUIREMENTS

### **New Table 1: journey_events**
**Purpose:** Track practitioner progression through customer journey stages

```sql
CREATE TABLE journey_events (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  site_id BIGINT NOT NULL REFERENCES sites(site_id),
  
  -- Journey tracking
  stage TEXT NOT NULL CHECK (stage IN (
    'awareness',
    'consideration', 
    'trial',
    'activation',
    'retention',
    'advocacy'
  )),
  
  event_type TEXT NOT NULL, -- e.g., 'page_view', 'demo_request', 'first_protocol', 'referral'
  event_metadata JSONB, -- Additional context (e.g., source, campaign, use_case)
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Indexes
  CONSTRAINT unique_stage_transition UNIQUE (user_id, stage, created_at)
);

-- Indexes for performance
CREATE INDEX idx_journey_events_user ON journey_events(user_id);
CREATE INDEX idx_journey_events_stage ON journey_events(stage);
CREATE INDEX idx_journey_events_created ON journey_events(created_at);

-- RLS
ALTER TABLE journey_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own journey events"
  ON journey_events FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "System can insert journey events"
  ON journey_events FOR INSERT
  WITH CHECK (true); -- Allow system to track events

CREATE POLICY "Network admins can view all journey events"
  ON journey_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_sites
      WHERE user_sites.user_id = auth.uid()
      AND user_sites.role = 'network_admin'
    )
  );
```

---

### **New Table 2: use_case_tracking**
**Purpose:** Track which use cases practitioners are solving

```sql
CREATE TABLE use_case_tracking (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  site_id BIGINT NOT NULL REFERENCES sites(site_id),
  
  -- Use case identification
  use_case TEXT NOT NULL CHECK (use_case IN (
    'prove_not_reckless',
    'reduce_malpractice',
    'get_reimbursement',
    'scale_quality',
    'comply_regulations'
  )),
  
  -- ROI tracking
  roi_metrics JSONB, -- e.g., {"time_saved_hours": 15, "revenue_increase": 120000}
  
  -- Status
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN (
    'in_progress',
    'achieved',
    'abandoned'
  )),
  
  -- Timestamps
  started_at TIMESTAMPTZ DEFAULT NOW(),
  achieved_at TIMESTAMPTZ,
  
  CONSTRAINT unique_user_use_case UNIQUE (user_id, use_case)
);

-- Indexes
CREATE INDEX idx_use_case_tracking_user ON use_case_tracking(user_id);
CREATE INDEX idx_use_case_tracking_status ON use_case_tracking(status);

-- RLS
ALTER TABLE use_case_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own use case tracking"
  ON use_case_tracking FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own use case tracking"
  ON use_case_tracking FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Network admins can view all use case tracking"
  ON use_case_tracking FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_sites
      WHERE user_sites.user_id = auth.uid()
      AND user_sites.role = 'network_admin'
    )
  );
```

---

### **New Table 3: practitioner_metrics_cache**
**Purpose:** Cache expensive calculations (safety scores, benchmarks, etc.)

```sql
CREATE TABLE practitioner_metrics_cache (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  site_id BIGINT NOT NULL REFERENCES sites(site_id),
  
  -- Metric type
  metric_type TEXT NOT NULL CHECK (metric_type IN (
    'safety_score',
    'adverse_event_rate',
    'network_percentile',
    'protocols_logged',
    'time_saved'
  )),
  
  -- Metric value
  metric_value NUMERIC NOT NULL,
  metric_metadata JSONB, -- Additional context (e.g., sample_size, date_range)
  
  -- Cache management
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  
  CONSTRAINT unique_user_metric UNIQUE (user_id, metric_type, calculated_at)
);

-- Indexes
CREATE INDEX idx_metrics_cache_user ON practitioner_metrics_cache(user_id);
CREATE INDEX idx_metrics_cache_type ON practitioner_metrics_cache(metric_type);
CREATE INDEX idx_metrics_cache_expires ON practitioner_metrics_cache(expires_at);

-- RLS
ALTER TABLE practitioner_metrics_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own metrics"
  ON practitioner_metrics_cache FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "System can insert/update metrics"
  ON practitioner_metrics_cache FOR ALL
  USING (true); -- Allow system to cache metrics
```

---

## 🧮 CALCULATION FUNCTIONS

### **Function 1: Calculate Safety Score**
**Purpose:** Calculate practitioner's safety score (0-100)

**Formula:**
```
Safety Score = 100 - (Adverse Event Rate × 10)

Where:
- Adverse Event Rate = (Total Adverse Events / Total Protocols) × 100
- Minimum score: 0
- Maximum score: 100
```

**SQL Implementation:**
```sql
CREATE OR REPLACE FUNCTION calculate_safety_score(
  p_site_id BIGINT,
  p_start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '90 days',
  p_end_date TIMESTAMPTZ DEFAULT NOW()
)
RETURNS TABLE (
  safety_score NUMERIC,
  adverse_event_rate NUMERIC,
  total_protocols BIGINT,
  total_adverse_events BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH protocol_stats AS (
    SELECT
      COUNT(*) AS protocol_count,
      COALESCE(SUM(
        CASE 
          WHEN EXISTS (
            SELECT 1 FROM log_safety_events lse
            WHERE lse.clinical_record_id = lcr.id
          ) THEN 1
          ELSE 0
        END
      ), 0) AS adverse_event_count
    FROM log_clinical_records lcr
    WHERE lcr.site_id = p_site_id
      AND lcr.created_at >= p_start_date
      AND lcr.created_at <= p_end_date
  )
  SELECT
    CASE 
      WHEN protocol_count = 0 THEN NULL
      ELSE GREATEST(0, 100 - ((adverse_event_count::NUMERIC / protocol_count::NUMERIC) * 1000))
    END AS safety_score,
    CASE
      WHEN protocol_count = 0 THEN NULL
      ELSE (adverse_event_count::NUMERIC / protocol_count::NUMERIC) * 100
    END AS adverse_event_rate,
    protocol_count AS total_protocols,
    adverse_event_count AS total_adverse_events
  FROM protocol_stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**INSPECTOR VALIDATION:**
- [ ] Test with 0 protocols (should return NULL)
- [ ] Test with 100 protocols, 0 adverse events (should return 100)
- [ ] Test with 100 protocols, 10 adverse events (should return 0)
- [ ] Test with 100 protocols, 2 adverse events (should return 80)
- [ ] Verify RLS: users can only see their own site's scores

---

### **Function 2: Calculate Network Benchmark**
**Purpose:** Calculate network-wide average for comparison

**Formula:**
```
Network Average = SUM(Adverse Events) / SUM(Protocols) × 100

With small-cell suppression:
- Only include sites with N ≥ 10 protocols
- Return NULL if total network protocols < 100
```

**SQL Implementation:**
```sql
CREATE OR REPLACE FUNCTION calculate_network_benchmark(
  p_start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '90 days',
  p_end_date TIMESTAMPTZ DEFAULT NOW()
)
RETURNS TABLE (
  network_adverse_event_rate NUMERIC,
  network_safety_score NUMERIC,
  total_sites BIGINT,
  total_protocols BIGINT,
  total_adverse_events BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH site_stats AS (
    SELECT
      lcr.site_id,
      COUNT(*) AS protocol_count,
      COALESCE(SUM(
        CASE 
          WHEN EXISTS (
            SELECT 1 FROM log_safety_events lse
            WHERE lse.clinical_record_id = lcr.id
          ) THEN 1
          ELSE 0
        END
      ), 0) AS adverse_event_count
    FROM log_clinical_records lcr
    WHERE lcr.created_at >= p_start_date
      AND lcr.created_at <= p_end_date
    GROUP BY lcr.site_id
    HAVING COUNT(*) >= 10 -- Small-cell suppression
  ),
  network_stats AS (
    SELECT
      COUNT(DISTINCT site_id) AS site_count,
      SUM(protocol_count) AS total_protocol_count,
      SUM(adverse_event_count) AS total_adverse_event_count
    FROM site_stats
  )
  SELECT
    CASE
      WHEN total_protocol_count < 100 THEN NULL -- Not enough data
      ELSE (total_adverse_event_count::NUMERIC / total_protocol_count::NUMERIC) * 100
    END AS network_adverse_event_rate,
    CASE
      WHEN total_protocol_count < 100 THEN NULL
      ELSE GREATEST(0, 100 - ((total_adverse_event_count::NUMERIC / total_protocol_count::NUMERIC) * 1000))
    END AS network_safety_score,
    site_count AS total_sites,
    total_protocol_count AS total_protocols,
    total_adverse_event_count AS total_adverse_events
  FROM network_stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**INSPECTOR VALIDATION:**
- [ ] Test with < 100 total protocols (should return NULL)
- [ ] Test with sites having < 10 protocols (should exclude them)
- [ ] Test with 1000 protocols, 23 adverse events (should return 2.3%)
- [ ] Verify small-cell suppression works
- [ ] Verify performance (should run in < 1 second)

---

### **Function 3: Calculate Percentile Ranking**
**Purpose:** Show where practitioner ranks vs. network

**Formula:**
```
Percentile = (Number of sites with worse score / Total sites) × 100

Where:
- 0th percentile = worst performer
- 50th percentile = median
- 100th percentile = best performer
```

**SQL Implementation:**
```sql
CREATE OR REPLACE FUNCTION calculate_percentile_ranking(
  p_site_id BIGINT,
  p_start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '90 days',
  p_end_date TIMESTAMPTZ DEFAULT NOW()
)
RETURNS TABLE (
  percentile_rank NUMERIC,
  practitioner_score NUMERIC,
  network_average NUMERIC,
  total_sites BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH site_scores AS (
    SELECT
      lcr.site_id,
      COUNT(*) AS protocol_count,
      COALESCE(SUM(
        CASE 
          WHEN EXISTS (
            SELECT 1 FROM log_safety_events lse
            WHERE lse.clinical_record_id = lcr.id
          ) THEN 1
          ELSE 0
        END
      ), 0) AS adverse_event_count,
      GREATEST(0, 100 - ((
        COALESCE(SUM(
          CASE 
            WHEN EXISTS (
              SELECT 1 FROM log_safety_events lse
              WHERE lse.clinical_record_id = lcr.id
            ) THEN 1
            ELSE 0
          END
        ), 0)::NUMERIC / COUNT(*)::NUMERIC
      ) * 1000)) AS safety_score
    FROM log_clinical_records lcr
    WHERE lcr.created_at >= p_start_date
      AND lcr.created_at <= p_end_date
    GROUP BY lcr.site_id
    HAVING COUNT(*) >= 10 -- Small-cell suppression
  ),
  practitioner_data AS (
    SELECT safety_score
    FROM site_scores
    WHERE site_id = p_site_id
  ),
  ranking AS (
    SELECT
      COUNT(CASE WHEN ss.safety_score < pd.safety_score THEN 1 END)::NUMERIC / 
        NULLIF(COUNT(*)::NUMERIC, 0) * 100 AS percentile,
      pd.safety_score AS pract_score,
      AVG(ss.safety_score) AS network_avg,
      COUNT(*) AS site_count
    FROM site_scores ss
    CROSS JOIN practitioner_data pd
  )
  SELECT
    percentile AS percentile_rank,
    pract_score AS practitioner_score,
    network_avg AS network_average,
    site_count AS total_sites
  FROM ranking;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**INSPECTOR VALIDATION:**
- [ ] Test with practitioner at 50th percentile (median)
- [ ] Test with best performer (should return ~100)
- [ ] Test with worst performer (should return ~0)
- [ ] Verify small-cell suppression (N ≥ 10)
- [ ] Test with practitioner not in dataset (should return NULL)

---

### **Function 4: Calculate Time Saved**
**Purpose:** Estimate time saved vs. manual tracking

**Formula:**
```
Time Saved = Protocols Logged × 5 minutes

Where:
- 5 minutes = estimated time saved per protocol
  (vs. 7-8 minutes for manual spreadsheet entry)
- Convert to hours for display
```

**SQL Implementation:**
```sql
CREATE OR REPLACE FUNCTION calculate_time_saved(
  p_site_id BIGINT,
  p_start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days',
  p_end_date TIMESTAMPTZ DEFAULT NOW()
)
RETURNS TABLE (
  time_saved_hours NUMERIC,
  protocols_logged BIGINT,
  time_saved_per_protocol_minutes INTEGER
) AS $$
DECLARE
  v_time_per_protocol CONSTANT INTEGER := 5; -- minutes saved per protocol
BEGIN
  RETURN QUERY
  SELECT
    (COUNT(*) * v_time_per_protocol / 60.0)::NUMERIC(10,1) AS time_saved_hours,
    COUNT(*) AS protocols_logged,
    v_time_per_protocol AS time_saved_per_protocol_minutes
  FROM log_clinical_records
  WHERE site_id = p_site_id
    AND created_at >= p_start_date
    AND created_at <= p_end_date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**INSPECTOR VALIDATION:**
- [ ] Test with 60 protocols (should return 5 hours)
- [ ] Test with 0 protocols (should return 0 hours)
- [ ] Test with 120 protocols (should return 10 hours)
- [ ] Verify calculation: protocols × 5 / 60 = hours

---

## 📊 VISUALIZATION QUERIES

### **Query 1: Journey Stage Funnel**
**Purpose:** Show conversion rates through journey stages

**Visualization:** Funnel chart (wide at top, narrow at bottom)

```sql
CREATE OR REPLACE VIEW v_journey_funnel AS
WITH stage_counts AS (
  SELECT
    stage,
    COUNT(DISTINCT user_id) AS user_count,
    CASE stage
      WHEN 'awareness' THEN 1
      WHEN 'consideration' THEN 2
      WHEN 'trial' THEN 3
      WHEN 'activation' THEN 4
      WHEN 'retention' THEN 5
      WHEN 'advocacy' THEN 6
    END AS stage_order
  FROM journey_events
  WHERE created_at >= NOW() - INTERVAL '90 days'
  GROUP BY stage
),
stage_conversions AS (
  SELECT
    stage,
    user_count,
    stage_order,
    LAG(user_count) OVER (ORDER BY stage_order) AS previous_count,
    CASE
      WHEN LAG(user_count) OVER (ORDER BY stage_order) IS NULL THEN NULL
      ELSE (user_count::NUMERIC / LAG(user_count) OVER (ORDER BY stage_order)::NUMERIC * 100)
    END AS conversion_rate
  FROM stage_counts
)
SELECT
  stage,
  user_count,
  previous_count,
  ROUND(conversion_rate, 1) AS conversion_rate_pct,
  stage_order
FROM stage_conversions
ORDER BY stage_order;
```

**Chart Specifications:**
- **Type:** Funnel chart
- **X-axis:** Stage name
- **Y-axis:** User count
- **Labels:** Conversion rate between stages
- **Colors:** Gradient from blue (awareness) to green (advocacy)

**INSPECTOR VALIDATION:**
- [ ] Verify conversion rates are between 0-100%
- [ ] Verify stage order is correct (1-6)
- [ ] Test with empty data (should return 0 users per stage)
- [ ] Verify RLS: users see only their site's funnel

---

### **Query 2: Use Case ROI Dashboard**
**Purpose:** Show ROI metrics for each use case

**Visualization:** Bar chart (horizontal bars, sorted by ROI)

```sql
CREATE OR REPLACE VIEW v_use_case_roi AS
WITH use_case_stats AS (
  SELECT
    use_case,
    COUNT(*) AS total_users,
    COUNT(CASE WHEN status = 'achieved' THEN 1 END) AS achieved_users,
    AVG(
      CASE 
        WHEN status = 'achieved' AND roi_metrics->>'time_saved_hours' IS NOT NULL
        THEN (roi_metrics->>'time_saved_hours')::NUMERIC
      END
    ) AS avg_time_saved,
    AVG(
      CASE 
        WHEN status = 'achieved' AND roi_metrics->>'revenue_increase' IS NOT NULL
        THEN (roi_metrics->>'revenue_increase')::NUMERIC
      END
    ) AS avg_revenue_increase
  FROM use_case_tracking
  GROUP BY use_case
)
SELECT
  use_case,
  total_users,
  achieved_users,
  ROUND((achieved_users::NUMERIC / NULLIF(total_users, 0)::NUMERIC * 100), 1) AS achievement_rate_pct,
  ROUND(COALESCE(avg_time_saved, 0), 1) AS avg_time_saved_hours,
  ROUND(COALESCE(avg_revenue_increase, 0), 0) AS avg_revenue_increase_usd,
  -- Calculate composite ROI score
  ROUND(
    (COALESCE(avg_time_saved, 0) * 50) + -- $50/hour value
    COALESCE(avg_revenue_increase, 0),
    0
  ) AS total_roi_usd
FROM use_case_stats
ORDER BY total_roi_usd DESC;
```

**Chart Specifications:**
- **Type:** Horizontal bar chart
- **X-axis:** Total ROI (USD)
- **Y-axis:** Use case name
- **Colors:** Green gradient (darker = higher ROI)
- **Labels:** Achievement rate percentage

**INSPECTOR VALIDATION:**
- [ ] Verify ROI calculation: (time_saved × $50) + revenue_increase
- [ ] Verify achievement rate is between 0-100%
- [ ] Test with no achieved use cases (should show 0% achievement)
- [ ] Verify sorting (highest ROI first)

---

### **Query 3: Safety Score Trend**
**Purpose:** Show practitioner's safety score over time

**Visualization:** Line chart (time series)

```sql
CREATE OR REPLACE VIEW v_safety_score_trend AS
WITH monthly_scores AS (
  SELECT
    site_id,
    DATE_TRUNC('month', created_at) AS month,
    COUNT(*) AS protocol_count,
    COALESCE(SUM(
      CASE 
        WHEN EXISTS (
          SELECT 1 FROM log_safety_events lse
          WHERE lse.clinical_record_id = lcr.id
        ) THEN 1
        ELSE 0
      END
    ), 0) AS adverse_event_count
  FROM log_clinical_records lcr
  WHERE created_at >= NOW() - INTERVAL '12 months'
  GROUP BY site_id, DATE_TRUNC('month', created_at)
  HAVING COUNT(*) >= 5 -- Minimum for monthly calculation
)
SELECT
  site_id,
  month,
  protocol_count,
  adverse_event_count,
  (adverse_event_count::NUMERIC / protocol_count::NUMERIC * 100) AS adverse_event_rate,
  GREATEST(0, 100 - ((adverse_event_count::NUMERIC / protocol_count::NUMERIC) * 1000)) AS safety_score
FROM monthly_scores
ORDER BY site_id, month;
```

**Chart Specifications:**
- **Type:** Line chart
- **X-axis:** Month (Jan, Feb, Mar, ...)
- **Y-axis:** Safety score (0-100)
- **Line color:** Blue (practitioner), Gray (network average)
- **Shaded area:** Show improvement/decline

**INSPECTOR VALIDATION:**
- [ ] Verify scores are between 0-100
- [ ] Verify chronological order (oldest to newest)
- [ ] Test with < 5 protocols in a month (should exclude)
- [ ] Verify RLS: users see only their site's trend

---

### **Query 4: Network Benchmark Comparison**
**Purpose:** Compare practitioner to network average

**Visualization:** Gauge chart (speedometer style)

```sql
CREATE OR REPLACE VIEW v_network_comparison AS
WITH practitioner_score AS (
  SELECT * FROM calculate_safety_score(
    (SELECT site_id FROM user_sites WHERE user_id = auth.uid() LIMIT 1),
    NOW() - INTERVAL '90 days',
    NOW()
  )
),
network_score AS (
  SELECT * FROM calculate_network_benchmark(
    NOW() - INTERVAL '90 days',
    NOW()
  )
),
percentile_data AS (
  SELECT * FROM calculate_percentile_ranking(
    (SELECT site_id FROM user_sites WHERE user_id = auth.uid() LIMIT 1),
    NOW() - INTERVAL '90 days',
    NOW()
  )
)
SELECT
  ps.safety_score AS practitioner_safety_score,
  ps.adverse_event_rate AS practitioner_adverse_event_rate,
  ps.total_protocols AS practitioner_protocol_count,
  ns.network_safety_score,
  ns.network_adverse_event_rate,
  ns.total_sites AS network_site_count,
  pd.percentile_rank,
  CASE
    WHEN pd.percentile_rank >= 75 THEN 'excellent'
    WHEN pd.percentile_rank >= 50 THEN 'good'
    WHEN pd.percentile_rank >= 25 THEN 'average'
    ELSE 'needs_improvement'
  END AS performance_category
FROM practitioner_score ps
CROSS JOIN network_score ns
CROSS JOIN percentile_data pd;
```

**Chart Specifications:**
- **Type:** Gauge chart (semicircle)
- **Range:** 0-100
- **Zones:**
  - 0-25: Red (needs improvement)
  - 25-50: Yellow (average)
  - 50-75: Blue (good)
  - 75-100: Green (excellent)
- **Needle:** Practitioner's percentile rank
- **Label:** "You're in the 62nd percentile"

**INSPECTOR VALIDATION:**
- [ ] Verify percentile matches performance category
- [ ] Verify all scores are 0-100
- [ ] Test with practitioner at each performance level
- [ ] Verify RLS: users see only their own comparison

---

## 📝 HEADING & COPY MANAGEMENT

### **Dashboard Headings:**

**Safety Performance Section:**
```
Heading: "Safety Performance"
Subheading: "Your adverse event rate vs. network average"
Empty State: "Log at least 10 protocols to see your safety score"
```

**Network Benchmark Section:**
```
Heading: "Network Benchmark"
Subheading: "How you compare to 14 sites across the network"
Tooltip: "Based on last 90 days. Sites with <10 protocols excluded."
```

**Time Saved Section:**
```
Heading: "Time Saved"
Subheading: "Estimated time saved vs. manual tracking"
Calculation: "{protocols} protocols × 5 minutes = {hours} hours saved"
```

---

### **Analytics Page Headings:**

**Journey Funnel:**
```
Heading: "Customer Journey Funnel"
Subheading: "Conversion rates through each stage"
X-axis Label: "Journey Stage"
Y-axis Label: "Number of Practitioners"
```

**Use Case ROI:**
```
Heading: "Use Case ROI"
Subheading: "Return on investment for each use case"
X-axis Label: "Total ROI (USD)"
Y-axis Label: "Use Case"
```

**Safety Score Trend:**
```
Heading: "Safety Score Trend"
Subheading: "Your performance over the last 12 months"
X-axis Label: "Month"
Y-axis Label: "Safety Score (0-100)"
Legend: ["Your Score", "Network Average"]
```

---

## ✅ SUBA IMPLEMENTATION CHECKLIST

### **Phase 1: Database Schema (4 hours)**
- [ ] Create `journey_events` table
- [ ] Create `use_case_tracking` table
- [ ] Create `practitioner_metrics_cache` table
- [ ] Add RLS policies to all tables
- [ ] Create indexes for performance
- [ ] Test with sample data

### **Phase 2: Calculation Functions (6 hours)**
- [ ] Implement `calculate_safety_score()`
- [ ] Implement `calculate_network_benchmark()`
- [ ] Implement `calculate_percentile_ranking()`
- [ ] Implement `calculate_time_saved()`
- [ ] Test all functions with edge cases
- [ ] Optimize for performance (<1 second)

### **Phase 3: Visualization Queries (4 hours)**
- [ ] Create `v_journey_funnel` view
- [ ] Create `v_use_case_roi` view
- [ ] Create `v_safety_score_trend` view
- [ ] Create `v_network_comparison` view
- [ ] Test all views with sample data
- [ ] Verify RLS works correctly

### **Phase 4: Integration (2 hours)**
- [ ] Create API endpoints for each view
- [ ] Add caching layer (practitioner_metrics_cache)
- [ ] Test end-to-end (database → API → frontend)
- [ ] Document all functions and views

**Total Estimated Time:** 16 hours

---

## 🔍 INSPECTOR VALIDATION CHECKLIST

### **Data Integrity:**
- [ ] All calculations match formulas exactly
- [ ] No division by zero errors
- [ ] NULL handling is correct
- [ ] Small-cell suppression works (N ≥ 10)

### **Performance:**
- [ ] All queries run in < 1 second
- [ ] Indexes are used (check EXPLAIN ANALYZE)
- [ ] No full table scans on large tables
- [ ] Caching reduces redundant calculations

### **Security:**
- [ ] RLS policies prevent cross-site data access
- [ ] Users can only see their own metrics
- [ ] Network admins can see aggregated data
- [ ] No PHI exposed in any query

### **Accuracy:**
- [ ] Safety scores match manual calculations
- [ ] Percentile rankings are correct
- [ ] Conversion rates add up to 100%
- [ ] ROI calculations are accurate

### **Edge Cases:**
- [ ] 0 protocols (should return NULL or 0)
- [ ] 1 protocol (should handle gracefully)
- [ ] 10,000+ protocols (should perform well)
- [ ] Missing data (should not crash)

---

## 📊 SUCCESS METRICS

**Performance:**
- All queries < 1 second
- Dashboard loads in < 2 seconds
- Cache hit rate > 80%

**Accuracy:**
- 0 calculation errors
- 100% match with manual verification
- 0 RLS policy violations

**Adoption:**
- 100% of practitioners see safety score within 7 days
- 80% of practitioners check dashboard weekly
- 50% of practitioners export reports monthly

---

**Status:** 🟡 ASSIGNED - Awaiting SUBA acknowledgment  
**Priority:** 🔴 HIGH - Enables customer journey tracking  
**Next:** SUBA implements schema, INSPECTOR validates 🔍
