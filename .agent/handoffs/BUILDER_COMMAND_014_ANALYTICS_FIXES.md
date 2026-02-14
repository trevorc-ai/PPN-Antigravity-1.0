# Command #014: Fix Analytics Page Filters and Layout

**Date Issued:** Feb 13, 2026, 6:10 PM PST  
**Issued By:** LEAD (on behalf of User)  
**Assigned To:** BUILDER  
**Priority:** P1 - HIGH  
**Estimated Time:** 2-3 hours  
**Start After:** Command #013 (GuidedTour) complete

---

## DIRECTIVE

Fix filters and layout issues on Analytics page and deep-dive component pages.

**User Feedback:** "There are a number of other deep-dive components that are all fully functional; it just needs filters and layout repair. I think these are highly valuable to the practitioners."

---

## CURRENT STATE

**Working Analytics Components:**
1. ✅ Analytics.tsx - Main analytics dashboard with 5 visualizations
2. ✅ ClinicPerformanceRadar - Performance metrics
3. ✅ PatientConstellation - Outcomes clustering
4. ✅ MolecularPharmacology - Receptor affinity
5. ✅ MetabolicRiskGauge - CYP450 risk
6. ✅ ProtocolEfficiency - Financial ROI
7. ✅ SafetyBenchmark - Adverse event benchmarking

**Working Deep-Dive Pages:**
1. ✅ RegulatoryMapPage.tsx
2. ✅ ClinicPerformancePage.tsx
3. ✅ PatientConstellationPage.tsx
4. ✅ MolecularPharmacologyPage.tsx
5. ✅ PatientFlowPage.tsx
6. ✅ SafetySurveillancePage.tsx
7. ✅ ComparativeEfficacyPage.tsx
8. ✅ ProtocolEfficiencyPage.tsx
9. ✅ RiskMatrixPage.tsx
10. ✅ RevenueAuditPage.tsx
11. ✅ WorkflowChaosPage.tsx
12. ✅ PatientJourneyPage.tsx
13. ✅ PatientRetentionPage.tsx

---

## ISSUES TO FIX

### 1. Analytics.tsx Filters (Lines 238-249)
**Problem:** Filters are non-functional (no onChange handlers)

**Current Code:**
```typescript
<select className="...">
  <option>All Molecules</option>
  <option>Psilocybin</option>
  <option>MDMA</option>
  <option>Ketamine</option>
</select>
```

**Fix Required:**
- Add state for selected substance and date range
- Add onChange handlers
- Filter analytics data based on selections
- Update all visualizations to respect filters

### 2. Layout Issues
**Problem:** User reports layout issues on deep-dive pages

**Tasks:**
- Audit all 13 deep-dive pages for layout problems
- Fix spacing, alignment, responsive breakpoints
- Ensure consistent card styling
- Verify WCAG AAA contrast compliance

### 3. Missing Tooltips
**Problem:** Data visualizations lack explanatory tooltips

**Tasks:**
- Add tooltips to all chart elements
- Use AdvancedTooltip component (see /create_tooltips workflow)
- Provide clinical context for each metric

---

## IMPLEMENTATION PLAN

**Phase 1: Analytics.tsx Filters (1 hour)**
1. Add filter state management
2. Wire up onChange handlers
3. Filter data before passing to components
4. Test all filter combinations

**Phase 2: Deep-Dive Page Audit (1 hour)**
1. Test each of the 13 pages
2. Document layout issues
3. Create fix list

**Phase 3: Layout Fixes (1 hour)**
1. Fix identified issues
2. Standardize styling
3. Add missing tooltips
4. Verify responsive design

---

## VERIFICATION

1. Test Analytics page filters with real data
2. Verify all 13 deep-dive pages render correctly
3. Check mobile responsiveness
4. Confirm tooltips work on all charts

---

## DELIVERABLE

- ✅ Functional filters on Analytics.tsx
- ✅ All 13 deep-dive pages layout-fixed
- ✅ Tooltips added to visualizations
- ✅ Screenshot showing working filters

---

**START AFTER GUIDEDTOUR UPDATE COMPLETE**
