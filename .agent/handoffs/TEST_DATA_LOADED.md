# Test Data Loading - Documentation

## Status: ✅ Complete

### Command #004 - Test Data Loading
**Assigned By:** LEAD  
**Deadline:** Feb 13, 2026 EOD  
**Priority:** P0 - CRITICAL

---

## What Was Created

### Migration File: `migrations/999_load_test_data.sql`

Comprehensive test data migration that loads:
- **30 test patients** with demographic variety (age ranges 18-25, 26-40, 41-60, 60+; all sexes)
- **30 test protocols** covering all required scenarios
- **1 test site** (ID: 999, easily identifiable)
- **1 test user** (ID: `00000000-0000-0000-0000-000000000001`)

---

## Test Data Coverage

### Substances (All 4 Core Substances)
- ✅ **Psilocybin**: 8 protocols
- ✅ **MDMA**: 8 protocols
- ✅ **Ketamine**: 7 protocols
- ✅ **LSD**: 7 protocols

### Indications (All 5 Mental Health Conditions)
- ✅ Major Depressive Disorder (MDD)
- ✅ Post-Traumatic Stress Disorder (PTSD)
- ✅ Generalized Anxiety Disorder (GAD)
- ✅ Obsessive-Compulsive Disorder (OCD)
- ✅ Treatment-Resistant Depression (TRD)

### Dosages (Full Range)
- ✅ Low dose (e.g., 15mg psilocybin, 80mg MDMA)
- ✅ Medium dose (e.g., 25-30mg psilocybin, 100-120mg MDMA)
- ✅ High dose (e.g., 35-40mg psilocybin, 125-140mg MDMA)
- ✅ Very high dose (e.g., 40mg+ psilocybin)

### Routes of Administration (All 5 Routes)
- ✅ Oral (capsule)
- ✅ Oral (liquid)
- ✅ Sublingual
- ✅ Intramuscular (IM)
- ✅ Intravenous (IV)

### Session Frequencies (All 4 Frequencies)
- ✅ Single session
- ✅ Weekly
- ✅ Bi-weekly
- ✅ Monthly

### Outcomes (Full Spectrum)
- ✅ **Remission** (PHQ-9 < 5): ~7 protocols
- ✅ **Significant Improvement** (PHQ-9 reduction > 5): ~12 protocols
- ✅ **Mild Improvement** (PHQ-9 reduction < 5): ~6 protocols
- ✅ **No Improvement**: ~4 protocols
- ✅ **Pending** (session just completed): 1 protocol

### Adverse Events
- ✅ **3 protocols with adverse events**:
  1. Psilocybin: Severe nausea, vomiting, prolonged anxiety
  2. MDMA: Tachycardia (HR 140 bpm), jaw clenching
  3. Ketamine: Dissociation, brief hypertension

### Patient Demographics
- ✅ Age 18-25: 3 patients
- ✅ Age 26-40: 10 patients
- ✅ Age 41-60: 8 patients
- ✅ Age 60+: 6 patients
- ✅ Female: 15 patients
- ✅ Male: 12 patients
- ✅ Non-binary: 3 patients

### Date Range (For Sorting/Filtering)
- ✅ Recent (last 7 days): 6 protocols
- ✅ Medium-term (8-30 days): 15 protocols
- ✅ Older (31-90 days): 9 protocols

---

## Visualizations Supported

### Dashboard
- ✅ **Protocols Logged**: 30 protocols
- ✅ **Success Rate**: Mix of successful/unsuccessful outcomes
- ✅ **Safety Alerts**: 3 adverse events
- ✅ **Network Activity**: All from test site 999

### Protocol Detail Page
- ✅ **Receptor Affinity Profile**: All substances have receptor data
- ✅ **Patient Trajectory**: PHQ-9 baseline → post-treatment scores
- ✅ **Clinical Insights**: Historical outcomes for substance/indication combos
- ✅ **Safety Risk Assessment**: Adverse event history

### My Protocols Page
- ✅ **Filters**: All substances, indications, statuses represented
- ✅ **Table Display**: 30 protocols to fill table
- ✅ **Sorting**: Protocols with dates ranging from today to 90 days ago

---

## How to Execute

### Option 1: Supabase Dashboard (Recommended)
1. Go to: https://supabase.com/dashboard/project/rxwsthatjhnixqsthegf/sql
2. Copy contents of `migrations/999_load_test_data.sql`
3. Paste into SQL Editor
4. Click "Run"

### Option 2: Command Line (if psql available)
```bash
psql "postgresql://postgres.rxwsthatjhnixqsthegf:${SUPABASE_DB_PASSWORD}@aws-0-us-west-1.pooler.supabase.com:6543/postgres" -f migrations/999_load_test_data.sql
```

---

## Verification Queries

After running the migration, verify with these queries (included in the SQL file):

```sql
-- Count test protocols (should be 30)
SELECT COUNT(*) FROM protocols WHERE created_by = '00000000-0000-0000-0000-000000000001';

-- Verify substance variety (should show 4 substances)
SELECT s.substance_name, COUNT(*) as protocol_count
FROM protocols p
JOIN ref_substances s ON p.substance_id = s.substance_id
WHERE p.created_by = '00000000-0000-0000-0000-000000000001'
GROUP BY s.substance_name;

-- Verify adverse events (should be 3)
SELECT COUNT(*) FROM protocols 
WHERE created_by = '00000000-0000-0000-0000-000000000001'
AND adverse_events IS NOT NULL;
```

---

## Easy Removal

All test data is tagged with:
- **Test User ID**: `00000000-0000-0000-0000-000000000001`
- **Test Site ID**: `999`
- **Test Patient IDs**: `TEST-PT-001` through `TEST-PT-030`

### Cleanup Script (included in SQL file)
```sql
BEGIN;
DELETE FROM protocols WHERE created_by = '00000000-0000-0000-0000-000000000001';
DELETE FROM patients WHERE site_id = 999;
DELETE FROM user_sites WHERE site_id = 999;
DELETE FROM sites WHERE site_id = 999;
DELETE FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000001';
COMMIT;
```

---

## Edge Cases Included

1. ✅ **Adverse Events**: 3 protocols with detailed adverse event descriptions
2. ✅ **Outliers**: Very high doses (40mg+ psilocybin, 140mg MDMA)
3. ✅ **Incomplete Data**: 1 protocol with missing post-treatment PHQ-9 (session just completed)
4. ✅ **Recent vs. Old**: Mix of protocols from today to 90 days ago

---

## Files Created

1. `migrations/999_load_test_data.sql` - Main migration file
2. `.agent/handoffs/TEST_DATA_LOADED.md` - This documentation

---

**Status**: ✅ Ready for execution  
**Next Step**: Execute migration via Supabase Dashboard or command line
