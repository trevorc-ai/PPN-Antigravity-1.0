# 🔨 BUILDER: Connect Analytics to Database - Implementation Plan

**Started:** 2026-02-11 21:57 PST  
**Estimated Time:** 1 hour  
**Status:** 🔴 IN PROGRESS

---

## 🎯 OBJECTIVE

Replace mock/hardcoded data in Analytics page with real data from `log_clinical_records` table.

---

## 📊 CURRENT STATE ANALYSIS

### **Analytics.tsx (Main Page)**
**Hardcoded Data:**
- Line 69: Active Protocols: '124'
- Line 70: Patient Alerts: '3'
- Line 71: Network Efficiency: '94.2%'
- Line 72: Risk Score: 'Low'

**Chart Components (Separate Files):**
- `ClinicPerformanceRadar` - Performance metrics
- `PatientConstellation` - Outcomes clustering
- `MolecularPharmacology` - Receptor affinity
- `MetabolicRiskGauge` - CYP450 risk
- `ProtocolEfficiency` - Financial ROI

---

## 🗄️ DATABASE SCHEMA AVAILABLE

**Table:** `log_clinical_records`

**Key Columns for Analytics:**
- `practitioner_id` - UUID
- `site_id` - bigint
- `substance_id` - bigint (FK to ref_substances)
- `route_id` - bigint
- `session_number` - int
- `session_date` - date
- `dosage_amount` - numeric
- `patient_age` - text
- `patient_sex` - text
- `patient_smoking_status_id` - bigint
- `indication_id` - bigint
- `baseline_phq9_score` - int
- `psychological_difficulty_score` - int
- `safety_event_id` - bigint (nullable)
- `severity_grade_id` - bigint (nullable)
- `created_at` - timestamp

---

## 📋 IMPLEMENTATION PLAN

### **Phase 1: KPI Ribbon (30 min)** ✅ PRIORITY

**Goal:** Replace 4 hardcoded KPIs with real database queries

**KPI 1: Active Protocols**
```sql
SELECT COUNT(DISTINCT patient_link_code) 
FROM log_clinical_records 
WHERE site_id = :user_site_id
```

**KPI 2: Patient Alerts**
```sql
SELECT COUNT(*) 
FROM log_clinical_records 
WHERE site_id = :user_site_id 
  AND safety_event_id IS NOT NULL
  AND session_date >= CURRENT_DATE - INTERVAL '30 days'
```

**KPI 3: Network Efficiency** (Placeholder for MVP)
```typescript
// Calculate as: (successful sessions / total sessions) * 100
// Successful = no safety events
const efficiency = ((totalSessions - safetyEvents) / totalSessions) * 100
```

**KPI 4: Risk Score** (Placeholder for MVP)
```typescript
// Based on safety event rate
const riskScore = safetyEventRate < 5 ? 'Low' : safetyEventRate < 15 ? 'Medium' : 'High'
```

---

### **Phase 2: Loading States (15 min)**

**Add:**
- Loading spinner while fetching data
- Error states if query fails
- Empty states if no data exists

---

### **Phase 3: Chart Components (15 min)** ⏸️ DEFER TO LATER

**Decision:** Keep charts as visual mockups for MVP demo
**Rationale:**
- Charts are complex visualizations
- Require significant data transformation
- Mock data looks good for demo
- Can connect later after demo

**Alternative:** Pass real aggregate data to charts as props

---

## 🔧 IMPLEMENTATION STEPS

### **Step 1: Create Analytics Hook** (10 min)

Create `src/hooks/useAnalyticsData.ts`:
```typescript
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export interface AnalyticsKPIs {
  activeProtocols: number;
  patientAlerts: number;
  networkEfficiency: number;
  riskScore: string;
  loading: boolean;
  error: string | null;
}

export const useAnalyticsData = (siteId: number | null) => {
  const [data, setData] = useState<AnalyticsKPIs>({
    activeProtocols: 0,
    patientAlerts: 0,
    networkEfficiency: 0,
    riskScore: 'Unknown',
    loading: true,
    error: null
  });

  useEffect(() => {
    if (!siteId) return;

    const fetchAnalytics = async () => {
      try {
        // Query 1: Active Protocols
        const { count: protocolCount } = await supabase
          .from('log_clinical_records')
          .select('patient_link_code', { count: 'exact', head: true })
          .eq('site_id', siteId);

        // Query 2: Recent Safety Events
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const { count: alertCount } = await supabase
          .from('log_clinical_records')
          .select('*', { count: 'exact', head: true })
          .eq('site_id', siteId)
          .not('safety_event_id', 'is', null)
          .gte('session_date', thirtyDaysAgo.toISOString().split('T')[0]);

        // Query 3: Total Sessions for Efficiency
        const { count: totalSessions } = await supabase
          .from('log_clinical_records')
          .select('*', { count: 'exact', head: true })
          .eq('site_id', siteId);

        // Calculate metrics
        const efficiency = totalSessions > 0 
          ? ((totalSessions - (alertCount || 0)) / totalSessions) * 100 
          : 0;

        const safetyRate = totalSessions > 0 
          ? ((alertCount || 0) / totalSessions) * 100 
          : 0;

        const riskScore = safetyRate < 5 ? 'Low' : safetyRate < 15 ? 'Medium' : 'High';

        setData({
          activeProtocols: protocolCount || 0,
          patientAlerts: alertCount || 0,
          networkEfficiency: Math.round(efficiency * 10) / 10,
          riskScore,
          loading: false,
          error: null
        });

      } catch (err: any) {
        setData(prev => ({
          ...prev,
          loading: false,
          error: err.message || 'Failed to load analytics'
        }));
      }
    };

    fetchAnalytics();
  }, [siteId]);

  return data;
};
```

---

### **Step 2: Update Analytics.tsx** (15 min)

**Changes:**
1. Import the hook
2. Fetch user's site_id
3. Use hook to get real data
4. Replace hardcoded values
5. Add loading/error states

```typescript
import { useAnalyticsData } from '../hooks/useAnalyticsData';
import { supabase } from '../supabaseClient';
import { useState, useEffect } from 'react';

const Analytics = () => {
  const [siteId, setSiteId] = useState<number | null>(null);
  const analytics = useAnalyticsData(siteId);

  useEffect(() => {
    const fetchUserSite = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userSite } = await supabase
        .from('user_sites')
        .select('site_id')
        .eq('user_id', user.id)
        .limit(1)
        .single();

      if (userSite) setSiteId(userSite.site_id);
    };

    fetchUserSite();
  }, []);

  // ... rest of component

  // Replace hardcoded KPI data with:
  const kpis = [
    { 
      label: 'Active Protocols', 
      value: analytics.loading ? '...' : analytics.activeProtocols.toString(), 
      trend: '+12%', 
      icon: Activity, 
      color: 'text-blue-400' 
    },
    { 
      label: 'Patient Alerts', 
      value: analytics.loading ? '...' : analytics.patientAlerts.toString(), 
      trend: '-2', 
      icon: AlertTriangle, 
      color: 'text-amber-400' 
    },
    { 
      label: 'Network Efficiency', 
      value: analytics.loading ? '...' : `${analytics.networkEfficiency}%`, 
      trend: '+0.8%', 
      icon: TrendingUp, 
      color: 'text-emerald-400' 
    },
    { 
      label: 'Risk Score', 
      value: analytics.loading ? '...' : analytics.riskScore, 
      trend: 'Stable', 
      icon: ShieldCheck, 
      color: 'text-slate-400' 
    }
  ];
```

---

### **Step 3: Add Empty State** (5 min)

```typescript
{analytics.error && (
  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
    <p className="text-red-400">{analytics.error}</p>
  </div>
)}

{!analytics.loading && analytics.activeProtocols === 0 && (
  <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 text-center">
    <p className="text-slate-400">No clinical records yet. Submit your first protocol to see analytics.</p>
  </div>
)}
```

---

## ✅ ACCEPTANCE CRITERIA

- [ ] KPIs show real data from database
- [ ] Loading states work (shows "..." while loading)
- [ ] Error states work (shows error message if query fails)
- [ ] Empty states work (shows message if no data)
- [ ] Data updates when new protocols submitted
- [ ] No console errors
- [ ] Performance is acceptable (< 2 second load)

---

## 🧪 TESTING PLAN

**Test 1: With Data**
- Submit a protocol via Protocol Builder
- Navigate to Analytics
- Should see count increment

**Test 2: With Safety Event**
- Submit a protocol with safety event
- Navigate to Analytics
- Should see patient alerts increment

**Test 3: Empty State**
- Fresh database (no records)
- Navigate to Analytics
- Should see empty state message

**Test 4: Error Handling**
- Disconnect from internet
- Navigate to Analytics
- Should see error message

---

## ⏱️ TIME BREAKDOWN

- Step 1: Create hook (10 min)
- Step 2: Update Analytics.tsx (15 min)
- Step 3: Add empty/error states (5 min)
- Testing (15 min)
- Documentation (5 min)
- **Total: 50 minutes**

---

## 🎯 DECISION: Chart Components

**Keep charts as visual mockups for MVP demo**

**Rationale:**
- Charts look impressive as-is
- Connecting requires complex data transformations
- Demo is in 4 days - focus on critical path
- Can enhance post-demo

**Post-Demo Enhancement:**
- Connect ClinicPerformanceRadar to real metrics
- Connect PatientConstellation to real outcomes
- Keep MolecularPharmacology as reference (not data-driven)
- Keep MetabolicRiskGauge as reference (not data-driven)
- Connect ProtocolEfficiency to real ROI calculations

---

**Plan Created:** 2026-02-11 21:57 PST  
**Status:** Ready to implement  
**Next:** Create useAnalyticsData hook
