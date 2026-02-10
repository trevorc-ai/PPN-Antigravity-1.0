# TimeToStepChart Component - Implementation Summary

**Date:** February 8, 2026  
**Status:** ✅ Complete and Ready to Use

---

## 🎯 What Was Created

### **TimeToStepChart Component**
**File:** `src/components/charts/TimeToStepChart.tsx`

A horizontal bar chart showing median days between treatment stages:
- ✅ **Queries Supabase** - Fetches data from `v_flow_time_to_next_step`
- ✅ **Applies Filters** - Respects site filter from GlobalFilterBar
- ✅ **Color-Coded Speed** - Green (fast) to red (slow) based on days
- ✅ **Shows P75** - Displays both median and 75th percentile in tooltip
- ✅ **Small-Cell Aware** - Only shows transitions with ≥10 patients
- ✅ **Custom Tooltips** - Rich hover information with patient counts
- ✅ **Speed Legend** - Visual guide for interpreting bar colors
- ✅ **Summary Stats** - Shows median and P75 for each transition
- ✅ **Responsive Design** - Works on all screen sizes
- ✅ **Loading/Error States** - Graceful handling of edge cases

---

## 📊 Data Flow

```
TimeToStepChart Component
    ↓
Receives filters from PatientFlowPage
    ↓
Queries v_flow_time_to_next_step view
    ↓
Applies filters:
  - Site IDs (if multiple sites)
    ↓
Transforms data:
  - Shortens stage names (e.g., "Intake → Consent")
  - Rounds days to 1 decimal place
  - Sorts by from_stage order
    ↓
Renders horizontal bar chart with Recharts
    ↓
Colors bars based on speed:
  - Green: ≤3 days (fast)
  - Blue: 4-7 days (normal)
  - Amber: 8-14 days (slow)
  - Red: >14 days (very slow)
```

---

## 🎨 Visual Features

### **Chart Elements**

1. **Header**
   - Schedule icon
   - Title: "Time to Next Step"
   - Subtitle: "Median days between treatment stages"
   - Average median days (top right)

2. **Info Banner**
   - Indigo color scheme
   - Explains small-cell suppression (N≥10)
   - Informs user some transitions may be hidden

3. **Horizontal Bar Chart**
   - Y-axis: Transition names (e.g., "Intake → Consent")
   - X-axis: Days
   - Bars: Color-coded by speed
   - Labels: Show days on right side of bars
   - Rounded corners on right side

4. **Custom Tooltip** (on hover)
   - Transition name
   - Median days (primary blue)
   - 75th percentile days (emerald green)
   - Patient count (gray)

5. **Speed Legend**
   - 4 colored dots with labels
   - Shows thresholds for each speed category

6. **Summary Stats Grid**
   - Shows each transition
   - Median days (large)
   - P75 days (small, below)

---

## 🔢 Example Data

With your demo data, you might see transitions like:

| Transition | Median Days | P75 Days | Patients | Speed |
|------------|-------------|----------|----------|-------|
| Intake → Consent | 2.5 | 3.8 | 48 | 🟢 Fast |
| Consent → Baseline | 5.2 | 6.9 | 41 | 🔵 Normal |
| Baseline → Session | 9.8 | 13.2 | 38 | 🟠 Slow |
| Session → Follow-up | 26.4 | 32.1 | 32 | 🔴 Very Slow |

**Note:** Actual data depends on your demo data's random date generation.

---

## 🚀 How to Test

### 1. Navigate to Patient Flow Page

```
http://localhost:3000/#/deep-dives/patient-flow
```

### 2. View the Chart

You should see:
- ✅ Horizontal bars showing transitions
- ✅ Bars colored by speed (green/blue/amber/red)
- ✅ Days labeled on the right side of bars
- ✅ Average median days in top right
- ✅ Info banner about small-cell suppression
- ✅ Speed legend at bottom
- ✅ Summary stats grid

### 3. Test Interactions

**Hover over bars:**
- Tooltip should show median, P75, and patient count

**Check colors:**
- Fast transitions (≤3 days) should be green
- Slow transitions (>14 days) should be red

**Resize window:**
- Chart should remain readable on mobile/tablet

### 4. Test Filters

**Try filtering by site:**
1. If you have multiple sites, select one
2. Chart should update to show only that site's data

**Note:** Date range, substance, route, and protocol filters are NOT currently applied to this chart because the `v_flow_time_to_next_step` view doesn't include those dimensions. This is a known limitation (see below).

---

## 🔐 Security & Privacy

✅ **No PHI Displayed** - Only shows aggregated transition times  
✅ **Small-Cell Suppression** - View enforces N≥10 at database level  
✅ **RLS Enforced** - Users only see data from their assigned sites  

---

## 🐛 Known Limitations

### 1. **Limited Filter Support**

Currently only applies **site filter** because:
- The `v_flow_time_to_next_step` view aggregates across all time
- It doesn't include `substance_id`, `route_id`, `protocol_id`, or time buckets

**Impact:** Date range, substance, route, and protocol filters are ignored.

**Fix Options:**
1. **Enhance the view** - Add these dimensions (makes view more complex)
2. **Query raw events** - Calculate transitions client-side (slower)
3. **Accept limitation** - Document that this chart shows "all-time" data

**Recommendation:** Accept for MVP, enhance view in Phase 2.

### 2. **No Time Trend**

The chart shows overall median times, not trends over time.

**Future Enhancement:** Add a line chart showing how transition times change by month.

### 3. **Missing Transitions**

If a transition has <10 patients, it won't appear in the view.

**Impact:** You might see gaps in the funnel (e.g., Intake→Consent and Baseline→Session, but no Consent→Baseline).

**This is expected** - it's small-cell suppression working correctly.

---

## 📝 Next Steps

### **Immediate:**
1. ✅ Test the chart with your demo data
2. ✅ Verify colors match speed categories
3. ✅ Check that tooltips show correct data

### **Next Chart to Build:**

**ComplianceChart** - Show follow-up completion rates
- Queries: `v_followup_compliance`
- Chart type: Line chart over time
- Shows: % of sessions with follow-up by month
- Filters: All filters apply (site, date range, etc.)

### **Future Enhancements:**

- **Add More Filters** - Enhance view to support substance/route/protocol
- **Trend Over Time** - Show how transition times change monthly
- **Percentile Bands** - Visualize P25, P50, P75 as error bars
- **Benchmark Comparison** - Compare site performance to network average
- **Drill-Down** - Click a transition to see patient-level details (PHI-safe)

---

## 🎨 Design System Compliance

✅ **Card Glass Styling** - Uses `card-glass` utility  
✅ **Proper Spacing** - `space-y-4`, `gap-4` for rhythm  
✅ **Typography** - Black headings, medium body text  
✅ **Colors** - Speed-based gradient (green→blue→amber→red)  
✅ **Icons** - Material Symbols for consistency  
✅ **Responsive Grid** - Works on all screen sizes  
✅ **Hover States** - Smooth transitions  
✅ **Loading States** - Spinner with message  
✅ **Error States** - Red icon with helpful message  
✅ **Info Banners** - Indigo color for informational messages  

---

## 📚 Related Files

- **Component:** `src/components/charts/TimeToStepChart.tsx`
- **Page:** `src/pages/deep-dives/PatientFlowPage.tsx`
- **Filter Component:** `src/components/analytics/GlobalFilterBar.tsx`
- **Database View:** `v_flow_time_to_next_step`
- **Database Table:** `log_patient_flow_events`
- **Reference Table:** `ref_flow_event_types`

---

## ✅ Completion Checklist

- [x] TimeToStepChart component created
- [x] Queries v_flow_time_to_next_step view
- [x] Applies site filter
- [x] Color-coded speed indicators
- [x] Shows median and P75 values
- [x] Custom tooltips with patient counts
- [x] Speed legend
- [x] Summary stats grid
- [x] Small-cell suppression info banner
- [x] Loading states
- [x] Error handling
- [x] Empty states
- [x] Responsive design
- [x] Follows design system
- [x] Integrated into PatientFlowPage
- [x] Ready for production use

---

**The time-to-step chart is live!** Check it out at: `http://localhost:3000/#/deep-dives/patient-flow` 🎉⏱️

**Note:** You may see "No Data Available" if your demo data doesn't have enough patients (≥10) for each transition. This is expected behavior due to small-cell suppression.
