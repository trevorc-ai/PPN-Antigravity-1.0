# Command #015: Protocol Intelligence Implementation (Full Plan)

**Date Issued:** Feb 13, 2026, 6:30 PM PST  
**Issued By:** LEAD (on behalf of User)  
**Assigned To:** SOOP (Database), DESIGNER (UI/UX), BUILDER (Frontend)  
**Priority:** P1 - HIGH  
**Estimated Time:** 3 weeks (Phase 1), 6 weeks (Phase 2)  
**Start After:** Command #008 (RLS Audit) complete

**Reference:** SOOP's original implementation plan from conversation `64b01072-8b80-4b2a-b847-bb7358af4d41`

---

## EXECUTIVE SUMMARY

Implement an **augmented intelligence system** for the Protocol Builder, combining internal clinical data with free external data sources to provide:

1. **Auto-Fill Intelligence** - Learn practitioner preferences (50% time savings)
2. **Adverse Event Risk Prediction** - Real-time safety scoring (10-20% AE reduction)
3. **External Data Integration** - PDSP, PubMed, DrugBank (8 free sources, $0/year)
4. **Patient Trajectory Visualization** - Time-series progress tracking
5. **Real-Time Network Activity Dashboard** - Live protocol feed

**Key Metrics:**
- **Risk Reduction:** 10-20% fewer adverse events
- **Efficiency Gain:** 50% faster protocol creation
- **Cost:** $0 external data, ~100 hours dev time
- **ROI:** High (safety + efficiency + competitive advantage)

---

## USER REVIEW REQUIRED

> [!WARNING]
> **Legal Liability Risk**
> Risk scores are advisory only. We must implement legal disclaimers and override logging to protect against malpractice claims.

> [!IMPORTANT]
> **Data Quality Dependency**
> Risk predictions require N≥10 patients per cohort. New substance/indication combinations will show "Insufficient Data" until threshold is met.

> [!CAUTION]
> **External API Dependencies**
> PubMed, DrugBank, PDSP could change licensing or deprecate APIs. We have fallback strategies but should monitor quarterly.

---

## PHASE 1: CORE INTELLIGENCE (WEEKS 1-3)

### 1.1 Database Infrastructure (SOOP - Week 1)

**File:** `migrations/018_protocol_intelligence_infrastructure.sql`

**Creates:**
- `user_protocol_preferences` - Auto-fill learning
- `mv_adverse_event_rates` - Historical risk baselines
- `ref_medication_risk_weights` - Drug interaction scoring
- `calculate_adverse_event_risk()` - Real-time risk API
- `ref_risk_disclaimers` - Legal protection
- `log_risk_overrides` - Audit trail
- `mv_patient_trajectories` - Longitudinal outcomes
- `mv_network_pulse` - Real-time activity feed

**Risk Mitigation:**
```sql
-- Confidence scoring
ALTER FUNCTION calculate_adverse_event_risk() 
ADD COLUMN confidence_level TEXT,
ADD COLUMN sample_size INTEGER;

-- Data quality monitoring
CREATE TABLE log_data_quality_checks (...);
CREATE FUNCTION check_data_freshness();
```

---

### 1.2 External Data Integration (SOOP - Week 1)

**P0 Free Data Sources:**

#### PDSP Ki Database (2-3 hours)
```sql
CREATE TABLE ref_pdsp_receptor_affinity (
  substance_name TEXT,
  receptor_target TEXT,
  ki_value_nm NUMERIC,
  last_updated DATE
);
```
- **Source:** https://pdsp.unc.edu/databases/kidb.php
- **Update Frequency:** Quarterly
- **Import Script:** `scripts/import_pdsp_data.py`

#### DrugBank Interactions (3-4 hours)
```sql
CREATE TABLE ref_drugbank_interactions (
  drug_a TEXT,
  drug_b TEXT,
  interaction_type TEXT,
  severity TEXT,
  description TEXT
);
```
- **Source:** https://go.drugbank.com/ (free academic license)
- **Update Frequency:** Monthly
- **Import Script:** `scripts/import_drugbank_data.py`

#### PubMed Clinical Trials (2-3 hours)
```sql
CREATE TABLE ref_pubmed_trials (
  pmid TEXT PRIMARY KEY,
  substance_name TEXT,
  indication TEXT,
  sample_size INTEGER,
  efficacy_rate NUMERIC,
  adverse_event_rate NUMERIC
);
```
- **Source:** PubMed API (free)
- **Update Frequency:** Weekly
- **Import Script:** `scripts/import_pubmed_trials.py`

---

### 1.3 Frontend Components (DESIGNER - Week 2, BUILDER - Week 3)

**DESIGNER Deliverables:**
- Mockup: Auto-fill indicator (✨ sparkle icon)
- Mockup: Risk score card (0-100 scale, color-coded)
- Mockup: Confidence badges ("High Confidence, N=47")
- Mockup: Override reason modal for high-risk protocols
- Mockup: Patient trajectory chart (D3.js line chart)
- Mockup: Network pulse widget (live feed)

**BUILDER Implementation:**

**Modified Files:**
- `ProtocolBuilder.tsx` - Add auto-fill
- `ClinicalInsightsPanel.tsx` - Add risk card

**New Files:**
- `src/hooks/useProtocolPreferences.ts` - Auto-fill hook
- `src/hooks/useRiskAssessment.ts` - Risk scoring hook
- `src/components/RiskDisclaimerModal.tsx` - Legal disclaimer
- `src/components/PatientTrajectoryChart.tsx` - D3.js visualization
- `src/components/NetworkPulseWidget.tsx` - Live activity feed

**Key Features:**
- Auto-fill with ✨ indicator
- Risk score card (0-100 scale, color-coded: Green <30, Yellow 30-60, Red >60)
- Confidence badges (High/Medium/Low Confidence, N=XX)
- Override reason modal for high-risk protocols (>60 score)
- Graceful degradation if API fails
- Patient trajectory visualization on Protocol Detail page
- Network pulse widget on Dashboard

---

## PHASE 2: ADVANCED FEATURES (WEEKS 4-6)

### 2.1 Additional External Data Sources

**P1 Sources:**
- **FDA Adverse Event Reporting System (FAERS)** - Real-world safety data
- **ClinicalTrials.gov** - Ongoing trial data
- **MAPS Protocol Library** - Psychedelic-specific protocols
- **Erowid Experience Vaults** - Qualitative safety signals
- **NIH RePORTER** - Research funding trends

**Import Scripts:** `scripts/import_p1_data_sources.py`

---

### 2.2 Machine Learning Risk Model

**Upgrade from Rule-Based to ML:**
- Train gradient boosting model on historical data
- Features: substance, dosage, indication, medications, demographics
- Target: adverse event occurrence (binary classification)
- Validation: 80/20 train/test split, AUC-ROC >0.75

**File:** `src/ml/adverse_event_model.py`

---

### 2.3 Predictive Analytics Dashboard

**New Page:** `src/pages/PredictiveAnalytics.tsx`

**Features:**
- Remission rate forecasting
- TRD cohort analysis
- Efficacy heatmap by substance/indication
- Protocol template recommendations

---

## VERIFICATION PLAN

### Automated Tests
```bash
# Database tests
npm run test:db -- migrations/018_protocol_intelligence_infrastructure.sql

# Frontend tests
npm run test -- src/hooks/useRiskAssessment.test.ts
npm run test -- src/components/RiskDisclaimerModal.test.tsx

# Integration tests
npm run test:e2e -- protocol-builder-intelligence.spec.ts
```

### Manual Verification
1. Create protocol with high-risk combination (e.g., SSRI + MDMA)
2. Verify risk score displays correctly
3. Verify override modal appears
4. Verify auto-fill suggests previous values
5. Verify patient trajectory chart renders
6. Verify network pulse widget updates in real-time

---

## ROLLOUT STRATEGY

**Week 1-3: Internal Beta**
- Enable for `network_admin` users only
- Collect feedback, fix bugs
- Monitor data quality

**Week 4-6: Staged Rollout**
- Enable for 25% of practitioners
- Monitor adoption metrics
- A/B test auto-fill vs. manual entry

**Week 7+: Full Release**
- Enable for all users
- Announce via email/in-app notification
- Publish blog post: "AI-Powered Clinical Decision Support"

---

## SUCCESS METRICS

**Safety:**
- 10-20% reduction in adverse events
- 100% of high-risk protocols logged with override reasons

**Efficiency:**
- 50% reduction in protocol creation time
- 80% auto-fill acceptance rate

**Adoption:**
- 70% of practitioners use auto-fill within 30 days
- 90% view risk scores before submission

**Data Quality:**
- External data sources updated on schedule
- <5% API failure rate

---

## DELIVERABLES

**SOOP:**
- ✅ Migration 018 created and tested
- ✅ PDSP, DrugBank, PubMed data imported
- ✅ Risk calculation function validated
- ✅ Data quality monitoring dashboard

**DESIGNER:**
- ✅ Mockups for all 6 new components
- ✅ Risk score color palette (WCAG AAA compliant)
- ✅ Auto-fill indicator design
- ✅ Legal disclaimer copy approved

**BUILDER:**
- ✅ 5 new React components implemented
- ✅ 2 new hooks implemented
- ✅ Integration tests passing
- ✅ E2E tests passing
- ✅ Screenshots of all features

---

## NEXT STEPS

1. **LEAD:** Review and approve this plan ✅ (User approved)
2. **SOOP:** Run migration 018, import PDSP data (Week 1)
3. **DESIGNER:** Create mockups for risk card + auto-fill indicator (Week 2)
4. **BUILDER:** Implement React hooks after DESIGNER approval (Week 3)
5. **ALL:** Weekly sync meetings during Phase 1

---

## APPENDIX: RELATED DOCUMENTS

- [Data Opportunities Analysis](file:///Users/trevorcalton/.gemini/antigravity/brain/64b01072-8b80-4b2a-b847-bb7358af4d41/data_opportunities_analysis.md) - Original 12 opportunities
- [SOOP → DESIGNER Handoff](file:///Users/trevorcalton/.gemini/antigravity/brain/64b01072-8b80-4b2a-b847-bb7358af4d41/SOOP_TO_DESIGNER_HANDOFF.md) - UI/UX requirements
- [SOOP → BUILDER Handoff](file:///Users/trevorcalton/.gemini/antigravity/brain/64b01072-8b80-4b2a-b847-bb7358af4d41/SOOP_TO_BUILDER_HANDOFF.md) - API integration specs
- [External Data Opportunities](file:///Users/trevorcalton/.gemini/antigravity/brain/64b01072-8b80-4b2a-b847-bb7358af4d41/EXTERNAL_DATA_OPPORTUNITIES.md) - 8 free data sources
- [Migration 018](file:///Users/trevorcalton/Desktop/PPN-Antigravity-1.0/migrations/018_protocol_intelligence_infrastructure.sql) - Database schema

---

**Recommendation:** ✅ **APPROVED - PROCEED WITH PHASE 1**

This plan balances **high value** (safety + efficiency) with **manageable risk** (legal disclaimers, confidence scoring, graceful degradation). The phased approach allows us to validate assumptions before scaling.

**START AFTER RLS AUDIT COMPLETE**
