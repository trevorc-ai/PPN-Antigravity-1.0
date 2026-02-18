---
id: WO-075
status: 03_BUILD
priority: P2 (High)
category: Feature
owner: INSPECTOR
failure_count: 0
---

# Smart Pre-Fill System for Forms

## User Request
Implement intelligent auto-fill for form fields based on typical ranges, patient demographics, and practitioner patterns to reduce input time by 40%.

## LEAD ARCHITECTURE

### Technical Strategy
Build a smart pre-fill system that suggests values for form fields based on:
1. Patient demographics (age, gender, baseline data)
2. Typical ranges for measurements
3. Practitioner's previous entries
4. Time-based patterns (morning vs. evening sessions)

### Files to Touch
- `src/services/smartPreFill.ts` (NEW)
- `src/hooks/useSmartPreFill.ts` (NEW)
- `src/components/forms/SmartInput.tsx` (NEW)
- `src/utils/typicalRanges.ts` (NEW)

### Constraints
- Must be opt-in (practitioners can clear/override)
- Must show source of suggestion ("Typical range", "Last entered")
- Must not auto-submit (requires confirmation)
- Must respect privacy (no cross-patient data leakage)

## Proposed Changes

### Feature 1: Typical Range Suggestions

**Example:**
```tsx
<SmartInput
  label="Resting HRV (ms)"
  value={hrvValue}
  onChange={setHrvValue}
  suggestion={{
    value: 50.00,
    source: "Typical range for age 35-45: 40-60ms",
    confidence: "high"
  }}
/>
```

**UI:**
```
Resting HRV (ms): [50.00] ← Pre-filled
[ⓘ] Typical: 40-60ms for this age group
[✓ Use this] [✗ Clear]
```

---

### Feature 2: Last Entered Value

**Example:**
```
Blood Pressure (Systolic): [120] ← Pre-filled
[ⓘ] Last entered: 120 mmHg (5 patients ago)
[✓ Use this] [✗ Clear]
```

---

### Feature 3: Time-Based Patterns

**Example:**
```
Session Start Time: [10:30 AM] ← Pre-filled
[ⓘ] You usually start sessions at 10:30 AM
[✓ Use this] [✗ Clear]
```

---

### Feature 4: Patient-Specific Defaults

**Example:**
```
PHQ-9 Score: [21] ← Pre-filled from baseline
[ⓘ] Baseline score: 21 (2 weeks ago)
[✓ Use this] [✗ Update]
```

---

## Data Sources

### 1. Typical Ranges Database
```typescript
const typicalRanges = {
  hrv: {
    '18-25': { min: 55, max: 105, typical: 80 },
    '26-35': { min: 50, max: 95, typical: 72 },
    '36-45': { min: 40, max: 60, typical: 50 },
    '46-55': { min: 25, max: 45, typical: 35 },
    '56+': { min: 20, max: 35, typical: 28 }
  },
  bp_systolic: {
    normal: { min: 90, max: 120, typical: 110 },
    elevated: { min: 120, max: 129, typical: 125 },
    high: { min: 130, max: 180, typical: 140 }
  }
};
```

### 2. Practitioner Patterns
- Last 10 entries for this field
- Most common value
- Average value
- Time-of-day patterns

### 3. Patient Baseline
- Phase 1 baseline values
- Previous session values
- Trend direction (improving/declining)

---

## Verification Plan

### Automated Tests
```bash
npm run test -- smartPreFill.test.ts
npm run test -- SmartInput.test.tsx
```

### Manual Verification
1. **Typical Ranges:** Verify age-appropriate ranges suggested
2. **Last Entered:** Verify shows last 5 patients' average
3. **Time Patterns:** Verify suggests practitioner's usual time
4. **Patient Baseline:** Verify shows patient's baseline values
5. **Override:** Verify can clear and enter custom value
6. **Privacy:** Verify no cross-patient data leakage

### Accessibility
- Screen reader announces suggestion
- Keyboard shortcuts (Alt+A = Accept, Alt+C = Clear)
- Visual distinction between pre-filled and manual entry

---

## Dependencies
- Patient demographics data
- Practitioner usage analytics
- Baseline assessment data

## Estimated Effort
**16-20 hours** (4-5 days)

## Success Criteria
- ✅ Typical ranges suggested for all numeric fields
- ✅ Last entered values shown when available
- ✅ Time-based patterns detected and suggested
- ✅ Patient baseline values pre-filled
- ✅ Can accept or clear suggestions
- ✅ Input time reduced by 40%
- ✅ No privacy violations

---

**Status:** Ready for LEAD assignment
