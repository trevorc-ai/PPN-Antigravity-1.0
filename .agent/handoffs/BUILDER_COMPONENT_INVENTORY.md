# BUILDER Component Inventory
**Date:** 2026-02-17  
**Purpose:** Complete inventory of prebuilt components available for reuse

---

## 📍 Showcase Pages

### 1. Component Showcase
**Location:** `src/pages/ComponentShowcase.tsx`  
**URL:** `http://localhost:3000/#/component-showcase`  
**Purpose:** Visual testing playground for all major components

### 2. Forms Showcase
**Location:** `src/pages/FormsShowcase.tsx`  
**URL:** `http://localhost:3000/#/forms-showcase`  
**Purpose:** Testing and review page for all 19 Arc of Care forms

---

## 🎨 UI Components (`src/components/ui/`)

### Core UI Components
1. **AdvancedTooltip** - `AdvancedTooltip.tsx` (13.5KB)
   - Advanced tooltip system with rich formatting
   - See workflow: `/create_tooltips`

2. **Button** - `Button.tsx` (4.1KB)
   - Standard button component

3. **TacticalButton** - `TacticalButton.tsx` (5.1KB)
   - Specialized tactical/crisis mode button

4. **GlassmorphicCard** - `GlassmorphicCard.tsx` (1.1KB)
   - Glassmorphic card container

5. **SearchableDropdown** - `SearchableDropdown.tsx` (4.8KB)
   - Searchable dropdown component

6. **Toast** - `Toast.tsx` (2.6KB)
   - Toast notification system

7. **ConnectFeedButton** - `ConnectFeedButton.tsx` (1.4KB)
   - Connect feed button component

---

## 📋 Arc of Care Forms (`src/components/arc-of-care-forms/`)

### Shared Form Components
**Location:** `src/components/arc-of-care-forms/shared/`

1. **FormField** - Reusable form field wrapper
2. **NumberInput** - Number input with validation
3. **StarRating** - Star rating component
4. **SegmentedControl** - Segmented control selector
5. **UserPicker** - User selection component
6. **NowButton** - Current time button
7. **RelativeTimeDisplay** - Relative time display
8. **VitalPresetsBar** - Vital signs preset selector
9. **BatchRegistrationModal** - Batch registration modal
10. **DeviceRegistrationModal** - Device registration modal
11. **VisualTimeline** - Visual timeline component

### Phase 1: Preparation (5 forms)
1. **MentalHealthScreeningForm** - PHQ-9, GAD-7, ACE screening
2. **SetAndSettingForm** - Session setting configuration
3. **BaselinePhysiologyForm** - Baseline vital signs
4. **BaselineObservationsForm** - Pre-session observations
5. **ConsentForm** - Informed consent

### Phase 2: Dosing Session (9 forms)
1. **DosingProtocolForm** - Substance, dose, route
2. **SessionVitalsForm** - Real-time vital monitoring
3. **SessionTimelineForm** - Session event timeline
4. **SessionObservationsForm** - Clinician observations
5. **PostSessionAssessmentsForm** - Post-session evaluation
6. **MEQ30QuestionnaireForm** - Mystical Experience Questionnaire
7. **AdverseEventForm** - Adverse event reporting
8. **SafetyEventObservationsForm** - Safety event documentation
9. **RescueProtocolForm** - Rescue medication protocol

### Phase 3: Integration (4 forms - 100% PHI-Safe)
1. **DailyPulseCheckForm** - Daily wellness check
2. **LongitudinalAssessmentForm** - Long-term outcomes
3. **StructuredIntegrationSessionForm** - Integration session notes
4. **BehavioralChangeTrackerForm** - Behavior change tracking

### Ongoing Safety (1 form - 100% PHI-Safe)
1. **StructuredSafetyCheckForm** - Ongoing safety monitoring

---

## 🔬 Analytics Components (`src/components/analytics/`)

### From ComponentShowcase.tsx

**Clinic Performance:**
1. **ClinicPerformanceRadar** - Clinic metrics vs network average
2. **SafetyBenchmark** - Adverse event rate benchmarking

**Patient Analytics:**
3. **PatientConstellation** - Outcomes clustering analysis
4. **PatientJourneySnapshot** - Patient journey visualization
5. **PatientFlowSankey** - Patient flow/retention analysis

**Protocol Analytics:**
6. **ProtocolEfficiency** - Financial efficiency modeling
7. **MolecularPharmacology** - Receptor affinity profiles
8. **MetabolicRiskGauge** - CYP450 metabolic risk analysis

**Deep-Dive Components:**
9. **RegulatoryMosaic** - Regulatory landscape visualization
10. **RevenueForensics** - Revenue analysis
11. **ConfidenceCone** - Confidence interval visualization
12. **SafetyRiskMatrix** - Risk matrix visualization

---

## 🚨 Session Components (`src/components/session/`)

### From ComponentShowcase.tsx

1. **DosageCalculator** - Potency normalizer calculator (WO_003)
2. **CrisisLogger** - Tactical incident logging interface (WO_004)

---

## 🔒 Security Components (`src/components/security/`)

### From ComponentShowcase.tsx

1. **BlindVetting** - Client security check terminal (WO_005)

---

## 📄 Layout Components (`src/components/layouts/`)

1. **PageContainer** - Standard page wrapper
2. **Section** - Section container with spacing

---

## 🎯 Usage Recommendations

### For Pricing Page (WO-062):
**Recommended Components:**
- ✅ `GlassmorphicCard` - For pricing tier cards
- ✅ `Button` - For CTAs
- ✅ `AdvancedTooltip` - For feature explanations
- ✅ `PageContainer` + `Section` - For layout structure

### For Forms:
**Recommended Components:**
- ✅ All shared form components from `arc-of-care-forms/shared/`
- ✅ `FormField` - Standard field wrapper
- ✅ `SegmentedControl` - For tier selection
- ✅ `Toast` - For save confirmations

### For Modals:
**Recommended Components:**
- ✅ `BatchRegistrationModal` - Reference for modal patterns
- ✅ `DeviceRegistrationModal` - Reference for modal patterns

---

## 📊 Component Statistics

**Total Components Available:**
- UI Components: 7
- Arc of Care Forms: 19
- Shared Form Components: 11
- Analytics Components: 12
- Session Components: 2
- Security Components: 1
- Layout Components: 2

**Total:** 54+ reusable components

---

## 🔗 Quick Links

**Showcase Pages:**
- Component Showcase: `http://localhost:3000/#/component-showcase`
- Forms Showcase: `http://localhost:3000/#/forms-showcase`

**Source Directories:**
- UI: `src/components/ui/`
- Forms: `src/components/arc-of-care-forms/`
- Analytics: `src/components/analytics/`
- Session: `src/components/session/`
- Security: `src/components/security/`
- Layouts: `src/components/layouts/`

---

## ✅ Status

**BUILDER STATUS:** ✅ Component inventory complete. Ready for WO-062 implementation.

**Next Steps:**
1. Review pricing page requirements in WO-062
2. Select appropriate components from this inventory
3. Build new pricing-specific components as needed
4. Integrate with existing design system
