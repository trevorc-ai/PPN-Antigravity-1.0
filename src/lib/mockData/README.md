# Mock Data Library for Integration Batch Testing

## Overview

This library provides mock data generators and React hooks for testing Arc of Care components **before** the database schema is deployed. It mimics Supabase query patterns and can be easily swapped with real database queries later.

## 📁 Structure

```
src/lib/mockData/
├── index.ts          # Central export file
├── types.ts          # TypeScript types mirroring database schema
├── generators.ts     # Mock data generators
├── hooks.ts          # React hooks mimicking Supabase queries
└── README.md         # This file
```

## 🎯 Purpose

**Problem:** Integration Batch tickets (WO-060 through WO-064) are blocked by missing database tables.

**Solution:** Use mock data to:
1. ✅ Build and test UI/UX now
2. ✅ Validate integration logic
3. ✅ Unblock development work
4. ✅ Swap to real data later with minimal changes

## 📊 Available Scenarios

The library includes 4 pre-built patient journey scenarios:

### 1. **Success** (Default)
- **Baseline:** PHQ-9: 18, GAD-7: 16, ACE: 3
- **Outcome:** -67% depression, -69% anxiety, +78% QOL
- **Vitals:** Stable throughout session
- **Adherence:** 85% pulse check completion

### 2. **Moderate**
- **Baseline:** PHQ-9: 14, GAD-7: 12, ACE: 5
- **Outcome:** -43% depression, -42% anxiety, +44% QOL
- **Vitals:** Mostly stable
- **Adherence:** 65% pulse check completion

### 3. **Poor**
- **Baseline:** PHQ-9: 22, GAD-7: 19, ACE: 7
- **Outcome:** -9% depression, -5% anxiety, +11% QOL
- **Vitals:** Variable
- **Adherence:** 40% pulse check completion

### 4. **Adverse Event**
- **Baseline:** PHQ-9: 16, GAD-7: 14, ACE: 4
- **Outcome:** -50% depression, -43% anxiety, +56% QOL (good despite event)
- **Vitals:** HR spike to 135 bpm at peak
- **Adherence:** 75% pulse check completion

## 🚀 Usage

### Basic Hook Usage

```tsx
import { usePatientJourney } from '@/lib/mockData';

function WellnessJourneyPage() {
  const { data, loading, error } = usePatientJourney(
    'PT-KXMR9W2P',
    'SESSION-001',
    'success' // or 'moderate', 'poor', 'adverse-event'
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Patient Journey</h1>
      <BaselineMetrics data={data.baseline} />
      <SessionTimeline data={data.timeline} />
      <VitalsChart data={data.vitals} />
      <SymptomTrajectory data={data.longitudinal} />
      <PulseCheckHeatmap data={data.pulseChecks} />
    </div>
  );
}
```

### Individual Data Hooks

```tsx
import {
  useBaselineAssessment,
  useSessionTimeline,
  useSessionVitals,
  useLongitudinalAssessments,
  usePulseChecks
} from '@/lib/mockData';

// WO-060: Baseline Assessment
const { data: baseline } = useBaselineAssessment('SESSION-001');

// WO-061: Session Timeline
const { data: timeline } = useSessionTimeline('SESSION-001');

// WO-062: Session Vitals
const { data: vitals } = useSessionVitals('SESSION-001');

// WO-063: Longitudinal Assessments
const { data: longitudinal } = useLongitudinalAssessments('SESSION-001');

// WO-064: Pulse Checks (last 30 days)
const { data: pulseChecks } = usePulseChecks('SESSION-001', 30);
```

### Mutation Hooks (Saving Data)

```tsx
import { useSaveBaselineAssessment, useSaveVitalSign, useSavePulseCheck } from '@/lib/mockData';

function BaselineForm() {
  const { save, saving, error } = useSaveBaselineAssessment();

  const handleSubmit = async (formData) => {
    const result = await save({
      patient_id: 'PT-001',
      session_id: 'SESSION-001',
      phq9_score: formData.phq9,
      gad7_score: formData.gad7,
      // ... other fields
    });

    if (result.success) {
      console.log('Saved successfully!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={saving}>
        {saving ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
```

### Direct Generator Usage

```tsx
import { generatePatientJourney, MOCK_JOURNEYS } from '@/lib/mockData';

// Use pre-built scenarios
const successJourney = MOCK_JOURNEYS.success;
const poorJourney = MOCK_JOURNEYS.poor;

// Generate custom journey
const customJourney = generatePatientJourney(
  'PT-CUSTOM-001',
  'SESSION-CUSTOM-001',
  'moderate'
);
```

## 🔄 Swapping to Real Database

When the database is deployed, swap mock data for real queries:

### Step 1: Update `hooks.ts`

```typescript
// Change this line in hooks.ts:
const USE_MOCK_DATA = false; // Was: true
```

### Step 2: Implement Real Queries

```typescript
// Replace TODO comments with real Supabase queries:
export function useBaselineAssessment(sessionId: string) {
  const [data, setData] = useState<BaselineAssessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (USE_MOCK_DATA) {
      // ... mock implementation
    } else {
      // Real implementation:
      const fetchData = async () => {
        const { data, error } = await supabase
          .from('log_baseline_assessments')
          .select('*')
          .eq('session_id', sessionId)
          .single();
        
        if (error) setError(error);
        else setData(data);
        setLoading(false);
      };
      
      fetchData();
    }
  }, [sessionId]);

  return { data, loading, error };
}
```

### Step 3: No Component Changes Required!

Components using the hooks don't need to change at all:

```tsx
// This code works with both mock and real data:
const { data, loading, error } = useBaselineAssessment('SESSION-001');
```

## 📋 Data Schema Reference

### WO-060: Baseline Assessment
```typescript
{
  phq9_score: number;        // 0-27 (depression)
  gad7_score: number;        // 0-21 (anxiety)
  ace_score: number;         // 0-10 (trauma)
  pcl5_score: number;        // 0-80 (PTSD)
  expectancy_scale: number;  // 1-100 (treatment expectancy)
}
```

### WO-061: Session Timeline
```typescript
{
  dose_time: string;
  onset_time: string;        // T+00:45
  peak_time: string;         // T+02:45
  resolution_time: string;   // T+06:45
  expected_duration_hours: number;
  actual_duration_hours: number;
}
```

### WO-062: Session Vitals
```typescript
{
  heart_rate: number;        // bpm
  hrv: number;              // ms
  bp_systolic: number;      // mmHg
  bp_diastolic: number;     // mmHg
  spo2: number;             // %
  session_phase: 'baseline' | 'onset' | 'peak' | 'resolution';
}
```

### WO-063: Longitudinal Assessments
```typescript
{
  phq9_score: number;
  gad7_score: number;
  whoqol_score: number;     // 0-100 (quality of life)
  timepoint: 'baseline' | 'post-session' | '1-week' | '1-month' | '3-month' | '6-month';
  phq9_change_from_baseline: number;
}
```

### WO-064: Pulse Checks
```typescript
{
  connection_rating: number;  // 1-5
  sleep_rating: number;       // 1-5
  mood_rating: number;        // 1-5
  anxiety_rating: number;     // 1-5
  check_date: string;
  days_since_session: number;
}
```

## ✅ Testing Checklist

When using mock data, verify:

- [ ] Components render correctly with mock data
- [ ] Loading states display properly
- [ ] Error states handle gracefully
- [ ] Charts and visualizations work
- [ ] All 4 scenarios render correctly
- [ ] Mutation hooks log to console
- [ ] No console errors or warnings

## 🚨 Important Notes

1. **Mock data is deterministic** - Same scenario always generates same data
2. **Network delays are simulated** - 300-500ms to mimic real queries
3. **Mutations log to console** - Check console for save confirmations
4. **No persistence** - Refreshing page resets all data
5. **TypeScript types match database schema** - Easy to swap later

## 📊 Integration Batch Tickets Supported

- ✅ **WO-060:** Baseline Mental Health Components
- ✅ **WO-061:** Session Timeline Component
- ✅ **WO-062:** Vital Signs Data Collection
- ✅ **WO-063:** Symptom Trajectory Chart
- ✅ **WO-064:** Daily Wellness Tracking

## 🎯 Next Steps

1. Import hooks into Integration Batch components
2. Test UI/UX with all 4 scenarios
3. Validate charts and visualizations
4. Build compliance features (PDF export, etc.)
5. When database is ready, flip `USE_MOCK_DATA` to `false`
6. Implement real Supabase queries
7. Test with real data
8. Ship to production!

---

**BUILDER STATUS:** ✅ Mock data library complete. Ready for Integration Batch implementation.
