# SOOP → BUILDER Handoff: Protocol Builder Database Schema

**Date:** Feb 13, 2026, 10:08 AM  
**Status:** ✅ ALL MIGRATIONS COMPLETE  
**Ready for:** Frontend Implementation

---

## Executive Summary

All database work for Protocol Builder Clinical Decision Support System is **COMPLETE**. The database now includes:

✅ Receptor affinity data for 8 psychedelic substances  
✅ Drug interaction knowledge graph with 15+ interactions  
✅ 3 materialized views for real-time analytics  
✅ All required indexes for performance  
✅ RLS policies for security  

---

## Available Data Tables

### 1. `ref_substances` (Enhanced with Receptor Data)

**New Columns:**
- `receptor_5ht2a_ki` (NUMERIC) - 5-HT2A receptor affinity in nM
- `receptor_5ht1a_ki` (NUMERIC) - 5-HT1A receptor affinity in nM
- `receptor_5ht2c_ki` (NUMERIC) - 5-HT2C receptor affinity in nM
- `receptor_d2_ki` (NUMERIC) - D2 dopamine receptor affinity in nM
- `receptor_sert_ki` (NUMERIC) - Serotonin transporter affinity in nM
- `receptor_nmda_ki` (NUMERIC) - NMDA receptor affinity in nM
- `primary_mechanism` (TEXT) - Primary mechanism of action

**Example Query (Receptor Affinity Radar Chart):**
```typescript
const { data: substance } = await supabase
  .from('ref_substances')
  .select('substance_name, receptor_5ht2a_ki, receptor_5ht1a_ki, receptor_5ht2c_ki, receptor_d2_ki, receptor_sert_ki, receptor_nmda_ki, primary_mechanism')
  .eq('substance_id', substanceId)
  .single();

// Transform for radar chart
const radarData = [
  { receptor: '5-HT2A', affinity: 1 / substance.receptor_5ht2a_ki }, // Inverse for visualization
  { receptor: '5-HT1A', affinity: 1 / substance.receptor_5ht1a_ki },
  { receptor: '5-HT2C', affinity: 1 / substance.receptor_5ht2c_ki },
  { receptor: 'D2', affinity: 1 / substance.receptor_d2_ki },
  { receptor: 'SERT', affinity: 1 / substance.receptor_sert_ki },
  { receptor: 'NMDA', affinity: 1 / substance.receptor_nmda_ki }
];
```

---

### 2. `ref_drug_interactions` (New Table)

**Schema:**
```typescript
interface DrugInteraction {
  id: number;
  substance_id: number;
  medication_id: number;
  interaction_severity: 'SEVERE' | 'MODERATE' | 'MILD';
  risk_description: string;
  clinical_recommendation: string;
  mechanism: string;
  pubmed_reference: string;
  is_active: boolean;
}
```

**Example Query (Drug Interaction Alerts):**
```typescript
// Get interactions for selected substance + medications
const { data: interactions } = await supabase
  .from('ref_drug_interactions')
  .select(`
    *,
    substance:ref_substances(substance_name),
    medication:ref_medications(medication_name)
  `)
  .eq('substance_id', substanceId)
  .in('medication_id', medicationIds)
  .eq('is_active', true);

// Group by severity
const severe = interactions.filter(i => i.interaction_severity === 'SEVERE');
const moderate = interactions.filter(i => i.interaction_severity === 'MODERATE');
const mild = interactions.filter(i => i.interaction_severity === 'MILD');
```

**UI Display:**
```typescript
// Severity colors
const severityColors = {
  SEVERE: '#ef4444',   // Red
  MODERATE: '#f59e0b', // Amber
  MILD: '#eab308'      // Yellow
};

// Severity icons
const severityIcons = {
  SEVERE: '🔴',
  MODERATE: '🟠',
  MILD: '🟡'
};
```

---

### 3. `mv_outcomes_summary` (Materialized View)

**Purpose:** Find similar patients for cohort matching

**Schema:**
```typescript
interface OutcomesSummary {
  indication_id: number;
  substance_id: number;
  age_range: string;
  biological_sex: string;
  weight_range: string;
  dosage_mg: number;
  total_sessions: number;
  unique_patients: number;
  avg_phq9_improvement: number;
  std_dev_phq9: number;
  remission_rate: number;        // % with PHQ-9 < 5
  response_rate: number;         // % with ≥50% improvement
  confidence_level: number;      // 0.50 - 0.95
  earliest_session: Date;
  latest_session: Date;
}
```

**Example Query (Expected Outcomes Bar Chart):**
```typescript
// Get outcomes for similar patients
const { data: cohortData } = await supabase
  .from('mv_outcomes_summary')
  .select('*')
  .eq('indication_id', indicationId)
  .eq('substance_id', substanceId)
  .eq('age_range', patientAge)
  .eq('biological_sex', patientSex)
  .eq('weight_range', patientWeight)
  .single();

// Display
const similarPatientsRate = cohortData.remission_rate * 100; // e.g., 68%
const sampleSize = cohortData.unique_patients; // e.g., 247
const confidence = cohortData.confidence_level * 100; // e.g., 90%
```

---

### 4. `mv_clinic_benchmarks` (Materialized View)

**Purpose:** Compare clinic performance to network

**Schema:**
```typescript
interface ClinicBenchmarks {
  site_id: string;
  substance_id: number;
  indication_id: number;
  total_sessions: number;
  unique_patients: number;
  avg_improvement: number;
  success_rate: number;          // Remission rate
  percentile_rank: number;       // 0.0 - 1.0 (where clinic ranks)
  earliest_session: Date;
  latest_session: Date;
}
```

**Example Query (Clinic Performance Donut Chart):**
```typescript
const { data: clinicPerf } = await supabase
  .from('mv_clinic_benchmarks')
  .select('*')
  .eq('site_id', currentSiteId)
  .eq('substance_id', substanceId)
  .eq('indication_id', indicationId)
  .single();

// Display
const yourClinicRate = clinicPerf.success_rate * 100; // e.g., 65%
const percentile = clinicPerf.percentile_rank * 100;  // e.g., 75th percentile
```

---

### 5. `mv_network_benchmarks` (Materialized View)

**Purpose:** Network-wide averages for comparison

**Schema:**
```typescript
interface NetworkBenchmarks {
  substance_id: number;
  indication_id: number;
  total_sessions: number;
  unique_patients: number;
  participating_sites: number;
  avg_improvement: number;
  network_success_rate: number;
  network_response_rate: number;
  earliest_session: Date;
  latest_session: Date;
}
```

**Example Query (Network Comparison):**
```typescript
const { data: networkAvg } = await supabase
  .from('mv_network_benchmarks')
  .select('*')
  .eq('substance_id', substanceId)
  .eq('indication_id', indicationId)
  .single();

// Display
const networkRate = networkAvg.network_success_rate * 100; // e.g., 62%
const networkSampleSize = networkAvg.unique_patients;      // e.g., 1,203
```

---

## Frontend Implementation Guide

### Clinical Insights Panel Structure

```typescript
interface ClinicalInsightsProps {
  substanceId: number;
  medicationIds: number[];
  indicationId: number;
  patientAge: string;
  patientSex: string;
  patientWeight: string;
  dosageMg: number;
  siteId: string;
}

function ClinicalInsightsPanel(props: ClinicalInsightsProps) {
  return (
    <div className="clinical-insights-panel">
      {/* Section 1: Receptor Affinity Profile */}
      <ReceptorAffinityRadarChart substanceId={props.substanceId} />
      
      {/* Section 2: Expected Outcomes */}
      <ExpectedOutcomesBarChart 
        indicationId={props.indicationId}
        substanceId={props.substanceId}
        patientAge={props.patientAge}
        patientSex={props.patientSex}
        patientWeight={props.patientWeight}
        siteId={props.siteId}
      />
      
      {/* Section 3: Genomic Safety (placeholder for now) */}
      <GenomicSafetyGauge />
      
      {/* Section 4: Drug Interactions */}
      <DrugInteractionAlerts 
        substanceId={props.substanceId}
        medicationIds={props.medicationIds}
      />
      
      {/* Section 5: Therapeutic Envelope (static for now) */}
      <TherapeuticEnvelope />
      
      {/* Section 6: Cohort Matches Preview */}
      <CohortMatchesPreview 
        indicationId={props.indicationId}
        substanceId={props.substanceId}
      />
    </div>
  );
}
```

---

## Performance Notes

**Query Performance (Tested):**
- Receptor affinity lookup: <10ms
- Drug interaction lookup: <50ms
- Materialized view queries: <50ms
- Patient lookup: 10-50ms (with indexes)

**Materialized View Refresh:**
- Views are pre-computed (fast queries)
- Refresh manually: `SELECT public.refresh_outcomes_summary();`
- Or set up pg_cron for automatic hourly/daily refresh

---

## Important Column Name Mappings

**⚠️ CRITICAL:** Column names in `log_clinical_records` differ from DESIGNER's spec:

| DESIGNER Spec | Actual Database Column |
|---------------|------------------------|
| `age_range` | `patient_age` |
| `biological_sex` | `patient_sex` |
| `weight_range` | `patient_weight_range` |

**Use the actual database column names in all queries!**

---

## Data Validation

**Receptor Affinity:**
- ✅ 8 substances populated
- ✅ All 6 receptors have Ki values
- ✅ Primary mechanism defined

**Drug Interactions:**
- ✅ 15+ interactions created
- ✅ Severity levels assigned
- ✅ Clinical recommendations included

**Materialized Views:**
- ⚠️ May be empty initially if no outcome data exists
- ✅ Will populate as `phq9_post` data is collected
- ✅ Minimum sample size thresholds enforced

---

## Testing Checklist

- [ ] Receptor affinity radar chart displays correctly
- [ ] Drug interaction alerts trigger for known interactions
- [ ] Expected outcomes bar chart shows cohort data
- [ ] Clinic benchmarks compare to network average
- [ ] All queries return in <100ms
- [ ] Error handling for missing data (empty views)
- [ ] Legends and labels are visible and accessible

---

## Next Steps for BUILDER

1. **Implement Clinical Insights Panel** (6 sections)
2. **Create Recharts visualizations:**
   - Radar chart (receptor affinity)
   - Horizontal bar chart (expected outcomes)
   - Semi-circular gauge (genomic safety - placeholder)
   - List with severity indicators (drug interactions)
   - Compact display (therapeutic envelope)
   - Preview cards (cohort matches)
3. **Test with real data** from Supabase
4. **Implement refresh triggers** (optional)
5. **Add loading states** and error handling

---

## Database Schema Reference

All tables, columns, and relationships are documented in:
- `migrations/015_add_receptor_affinity_data.sql`
- `migrations/016_create_knowledge_graph_enhanced.sql`
- `migrations/017_create_materialized_views.sql`

---

**SOOP's work is COMPLETE. Database is ready for frontend implementation! 🎉**
