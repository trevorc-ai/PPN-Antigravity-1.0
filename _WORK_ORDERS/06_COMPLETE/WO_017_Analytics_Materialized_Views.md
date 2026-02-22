---
work_order_id: WO_017
title: Connect Analytics to Real-Time Materialized Views
type: FEATURE
category: Feature
priority: MEDIUM
status: COMPLETE
created: 2026-02-14T22:07:24-08:00
reviewed_by: LEAD
reviewed_at: 2026-02-14T22:41:56-08:00
completed_by: SOOP
completed_at: 2026-02-15T02:53:00-08:00
requested_by: PPN Admin
assigned_to: BUILDER
estimated_complexity: 5/10
failure_count: 0
---

# Work Order: Connect Analytics to Real-Time Materialized Views

## 🎯 THE GOAL

Upgrade the Analytics Dashboard to use the high-performance Materialized Views created by SOOP.

### PRE-FLIGHT CHECK

1. Identify the 3 views in Supabase (likely named `mv_protocol_stats` or similar)
2. Verify the current Analytics page is fetching from raw tables (slow) vs views (fast)

### Directives

1. Update the data fetching hooks in `src/pages/Analytics.tsx` to query the Materialized Views
2. Implement a "Refresh Data" button that triggers a view refresh (if permissions allow) or explains data latency
3. Visualize the specific "Protocol Intelligence" metrics (Success Rates, Safety Scores) provided by these views

---

## 🎯 THE BLAST RADIUS (Authorized Target Area)

- `src/hooks/useAnalytics.ts` (Update query targets)
- `src/pages/Analytics.tsx`

---

## ⚡ THE ELECTRIC FENCE (Strict "DO NOT TOUCH" Constraints)

**DO NOT:**
- Modify the views themselves
- Change the chart library (Recharts); just feed it the new data source
- Touch any other components or pages

**MUST:**
- Only update data source queries
- Preserve existing chart configurations

---

## ✅ Acceptance Criteria

### Pre-Flight Verification
- [ ] Identify all materialized views in Supabase
- [ ] Document current data fetching approach
- [ ] Verify views have necessary data

### Data Source Migration
- [ ] Analytics queries updated to use materialized views
- [ ] Performance improvement verified (faster load times)
- [ ] All existing charts still render correctly
- [ ] Data accuracy maintained

### Refresh Functionality
- [ ] "Refresh Data" button implemented
- [ ] Button triggers view refresh (if permitted)
- [ ] Or displays data latency explanation
- [ ] Loading state during refresh

### Metrics Visualization
- [ ] Success Rates metric displayed
- [ ] Safety Scores metric displayed
- [ ] Other Protocol Intelligence metrics shown
- [ ] Charts use new data source

---

## 🧪 Testing Requirements

- [ ] Test Analytics page loads faster with views
- [ ] Verify all charts display correct data
- [ ] Test "Refresh Data" button functionality
- [ ] Compare data accuracy (views vs raw tables)
- [ ] Test with different user roles
- [ ] Verify loading states are announced

---

## 📝 MANDATORY COMPLIANCE

### ACCESSIBILITY
- **Loading states must be announced** to screen readers
- ARIA live regions for data updates
- Refresh button keyboard accessible

### SECURITY
- **RLS checks on the Views**
- Users see only authorized data
- No cross-user data leakage

---

## 🚦 Status

**INBOX** - Ready for BUILDER assignment

---

## 📋 Technical Notes

### Expected Materialized Views
```sql
-- Example view names (verify with SOOP)
mv_protocol_stats
mv_safety_metrics
mv_success_rates
```

### Query Update Example
```typescript
// BEFORE (slow)
const { data } = await supabase
  .from('protocols')
  .select('*, sessions(*), outcomes(*)')
  .eq('user_id', userId);

// AFTER (fast)
const { data } = await supabase
  .from('mv_protocol_stats')
  .select('*')
  .eq('user_id', userId);
```

### Refresh Function
```typescript
const refreshViews = async () => {
  // If permissions allow
  await supabase.rpc('refresh_materialized_view', { 
    view_name: 'mv_protocol_stats' 
  });
  
  // Or display message
  addToast({ 
    title: 'Data Latency', 
    message: 'Data refreshes every 5 minutes' 
  });
};
```

---

## Dependencies

**Prerequisite:** SOOP's materialized views must be created and populated.
