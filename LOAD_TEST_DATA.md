# Load Test Data - Quick Start Guide

## 🎯 Goal
Load 30 test patients into the database to activate all visualizations in the Protocol Builder and Analytics Dashboard.

## 📋 What You'll Get
- **10 longitudinal patients** with multiple sessions showing progression
- **20 single-session patients** with varied outcomes
- Mix of all substances: Psilocybin, MDMA, Ketamine, LSD, 5-MeO-DMT, Ibogaine, Mescaline
- Outcome scores from excellent (95) to poor (32)
- Time variety from 132 days ago to 3 days ago

## ⚡ Quick Method (Recommended)

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase project dashboard
2. Click "SQL Editor" in the left sidebar
3. Click "New query"

### Step 2: Copy & Paste SQL
1. Open the file: `migrations/024_load_comprehensive_test_data.sql`
2. Copy the entire contents
3. Paste into the Supabase SQL Editor
4. Click "Run" (or press Cmd/Ctrl + Enter)

### Step 3: Verify Data Loaded
Run this query to verify:
```sql
SELECT COUNT(*) as total_records 
FROM public.log_clinical_records;
```

You should see **~50 records** (10 longitudinal patients × multiple sessions + 20 single-session patients)

## 🔑 Test Login Credentials

Once data is loaded, you can log in as the test user:

- **Email:** `demo@ppn-research.local`
- **Password:** `DemoPassword123!`

## 🎨 What Will Activate

After loading test data, you'll see:

### Protocol Builder
- **Clinical Insights Panel** will show:
  - Receptor affinity radar charts
  - Drug interaction warnings
  - Expected outcome probabilities
  - Similar patient cohort data

### Analytics Dashboard
- **Success Rates** chart populated with real data
- **Safety Scores** showing risk metrics
- **Network Benchmarks** comparing clinic performance
- **Patient trajectory** visualizations

### My Protocols Page
- List of 50 clinical records
- Filter by substance, indication, outcome
- Patient progression timelines

## 🔧 Troubleshooting

**If you get an error about missing tables:**
- Make sure all previous migrations have been run
- Check that `log_clinical_records`, `ref_substances`, `sites`, etc. exist

**If you get an RLS error:**
- The test user will be created automatically
- RLS policies should allow the test user to see their own data

**If data doesn't appear in the UI:**
- Refresh the materialized views:
  ```sql
  REFRESH MATERIALIZED VIEW mv_outcomes_summary;
  REFRESH MATERIALIZED VIEW mv_clinic_benchmarks;
  REFRESH MATERIALIZED VIEW mv_network_benchmarks;
  ```

## 📊 Verification Queries

After loading, run these to see the data:

```sql
-- Count by substance
SELECT 
    s.substance_name,
    COUNT(*) as record_count
FROM public.log_clinical_records lcr
JOIN public.ref_substances s ON lcr.substance_id = s.substance_id
GROUP BY s.substance_name
ORDER BY record_count DESC;

-- Longitudinal patients (multiple sessions)
SELECT 
    subject_id,
    COUNT(*) as session_count,
    MIN(created_at) as first_session,
    MAX(created_at) as last_session
FROM public.log_clinical_records
GROUP BY subject_id
HAVING COUNT(*) > 1
ORDER BY session_count DESC;

-- Outcome distribution
SELECT 
    CASE 
        WHEN outcome_score >= 85 THEN 'Excellent (85-100)'
        WHEN outcome_score >= 70 THEN 'Good (70-84)'
        WHEN outcome_score >= 55 THEN 'Moderate (55-69)'
        WHEN outcome_score >= 40 THEN 'Poor (40-54)'
        ELSE 'Very Poor (<40)'
    END as outcome_category,
    COUNT(*) as count
FROM public.log_clinical_records
GROUP BY outcome_category
ORDER BY MIN(outcome_score) DESC;
```

## ✅ Success Checklist

- [ ] SQL executed without errors
- [ ] ~50 records in `log_clinical_records`
- [ ] Can log in with test credentials
- [ ] Analytics Dashboard shows populated charts
- [ ] Protocol Builder Clinical Insights panel displays data
- [ ] My Protocols page shows list of records

---

**Ready to see your visualizations come alive!** 🚀
