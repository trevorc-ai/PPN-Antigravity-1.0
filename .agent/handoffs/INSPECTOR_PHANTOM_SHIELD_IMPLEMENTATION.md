# 🎯 GREY MARKET "PHANTOM SHIELD" IMPLEMENTATION PLAN

**Date:** 2026-02-16  
**Prepared by:** INSPECTOR  
**Status:** Ready for LEAD triage

---

## EXECUTIVE SUMMARY

I've created **4 new P1 Critical work orders** to implement the Grey Market "Phantom Shield" strategy identified in the research documents as the foundation for the Data Trust moat.

**Total Estimated Timeline:** 7-11 days (sequential) or 3-5 days (parallel with 2-3 developers)

---

## 📋 WORK ORDERS CREATED

### **WO-059: Potency Normalizer** ⭐ HIGHEST PRIORITY
- **File:** `_WORK_ORDERS/00_INBOX/WO-059_Potency_Normalizer.md`
- **Complexity:** 4/10
- **Timeline:** 2-3 days
- **Impact:** Prevents 911 calls (keeps ambulance away = keeps police away)
- **Strategic Value:** #1 cause of adverse events in grey market

**What it does:**
- Calculates effective dosages based on batch potency testing
- Prevents accidental overdoses from high-potency strains (Penis Envy = 2x standard)
- Provides real-time safety warnings
- Tracks reagent test results

**Deliverables:**
- `src/components/safety/PotencyNormalizer.tsx`
- `migrations/040_add_substance_batches.sql`
- `migrations/041_add_potency_functions.sql`
- Strain database (Golden Teacher, Penis Envy, Azurescens, etc.)

---

### **WO-060: Crisis Logger** ⭐ LEGAL DEFENSE
- **File:** `_WORK_ORDERS/00_INBOX/WO-060_Crisis_Logger.md`
- **Complexity:** 5/10
- **Timeline:** 2-3 days
- **Impact:** Legal defense tool proving "Duty of Care" during adverse events
- **Strategic Value:** Difference between "reckless endangerment" and "authorized practice"

**What it does:**
- One-tap emergency documentation (no typing required)
- Creates immutable audit trail with timestamps
- Calculates relative time (T+2h 14m into session)
- Logs interventions (verbal de-escalation, benzo administration, etc.)

**Deliverables:**
- `src/components/session/CrisisLogger.tsx`
- `src/components/session/InterventionTimeline.tsx`
- `migrations/042_add_session_interventions.sql`
- PDF export for legal documentation

---

### **WO-061: Cockpit Mode UI** ⭐ USABILITY
- **File:** `_WORK_ORDERS/00_INBOX/WO-061_Cockpit_Mode_UI.md`
- **Complexity:** 3/10
- **Timeline:** 1-2 days
- **Impact:** Makes app usable in low-light ceremony environments
- **Strategic Value:** Current UI is unusable for grey market practitioners

**What it does:**
- OLED black background (#000000) for low-light environments
- Amber/red text (#FFB300) for night vision preservation
- Large touch targets (80px minimum) for impaired motor skills
- Haptic feedback only (no audio)
- Theme toggle with keyboard shortcut (Cmd+Shift+D)

**Deliverables:**
- `src/contexts/ThemeContext.tsx`
- `src/components/ui/ThemeToggle.tsx`
- `src/styles/cockpit-theme.css`
- Theme persists in localStorage

---

### **WO-062: Pricing Data Bounty** ⭐ MONETIZATION
- **File:** `_WORK_ORDERS/00_INBOX/WO-062_Pricing_Data_Bounty.md`
- **Complexity:** 6/10
- **Timeline:** 2-3 days
- **Impact:** Core monetization strategy enabling Data Trust
- **Strategic Value:** 75% discount for data contribution = data liquidity

**What it does:**
- Transparent 3-tier pricing (Free, $199/mo, Custom)
- "Data Bounty" discount ($199 → $49 with data sharing)
- Data Contribution Agreement (legal framework)
- Feature comparison table
- FAQ addressing conversion barriers

**Deliverables:**
- `src/components/pricing/PricingTiers.tsx`
- `src/components/pricing/DataContributionAgreement.tsx`
- `migrations/044_add_subscription_tiers.sql`
- Updated Pricing page

---

## 🎨 COCKPIT MODE DESIGN SPEC

### Visual Comparison

**Clinical Sci-Fi (Current):**
```css
Background: #0e1117 (dark blue-grey)
Text: #cbd5e1 (light slate)
Primary: #3b82f6 (blue)
Feel: Professional, medical, institutional
```

**Cockpit Mode (New):**
```css
Background: #000000 (OLED black)
Text: #FFB300 (amber)
Primary: #FF8F00 (dark amber)
Feel: Tactical, low-light, night-vision
```

### CSS Variables (Ready to Implement)

```css
[data-theme="cockpit"] {
  --background-dark: #000000;
  --text-primary: #FFB300;
  --text-secondary: #FF8F00;
  --text-danger: #FF5252;
  --border-color: #333333;
  --primary: #FF8F00;
}
```

### Theme Toggle Component

```tsx
<button onClick={toggleTheme}>
  {theme === 'clinical' ? '🌙 Cockpit Mode' : '☀️ Clinical Mode'}
</button>
```

---

## 🔧 POTENCY NORMALIZER TECHNICAL SPEC

### Database Schema

**`substance_batches` table:**
```sql
CREATE TABLE substance_batches (
    batch_id UUID PRIMARY KEY,
    practitioner_id UUID REFERENCES auth.users(id),
    substance_type VARCHAR(50),
    strain_name VARCHAR(50),
    potency_coefficient DECIMAL(3, 2) DEFAULT 1.0,
    reagent_test_image_url TEXT,
    has_fentanyl_strip_test BOOLEAN
);
```

**`ref_substance_strains` table (seeded):**
```sql
INSERT INTO ref_substance_strains VALUES
('Psilocybe Cubensis', 'Golden Teacher', 1.0),
('Psilocybe Cubensis', 'Penis Envy', 2.0),
('Psilocybe Azurescens', 'Wild Azurescens', 3.0);
```

### SQL Function

```sql
CREATE FUNCTION calculate_effective_dose_mg(
    p_weight_grams DECIMAL,
    p_batch_id UUID
) RETURNS DECIMAL AS $$
    -- Returns: Weight * 10mg/g * Potency_Coefficient
$$;
```

### Component UI

```
┌─────────────────────────────────────────┐
│  🧪 Potency Normalizer                  │
│                                         │
│  Strain: Penis Envy (2.0x potency) ▼    │
│  Potency Coefficient: 2.0               │
│                                         │
│  Target Dose: 30 mg psilocybin          │
│                                         │
│  ⚠️ RECOMMENDED WEIGHT: 1.5 grams       │
│  ℹ️ This is equivalent to 3.0g standard │
│                                         │
│  [Save Batch]  [Calculate]              │
└─────────────────────────────────────────┘
```

---

## 📊 IMPLEMENTATION PRIORITY

### Phase 1 (Week 1) - Foundation
1. **WO-061: Cockpit Mode UI** (1-2 days)
   - Enables usability for all other features
   - Lowest complexity, highest immediate impact
   - No database changes required

2. **WO-059: Potency Normalizer** (2-3 days)
   - Highest safety ROI
   - Prevents 911 calls
   - Relatively straightforward implementation

### Phase 2 (Week 2) - Legal Defense
3. **WO-060: Crisis Logger** (2-3 days)
   - Legal defense tool
   - Builds on Cockpit Mode UI
   - Requires session tracking

4. **WO-062: Pricing Data Bounty** (2-3 days)
   - Core monetization strategy
   - Requires legal review
   - Enables "Give-to-Get" model

---

## ✅ SUCCESS METRICS

### Technical Metrics
- [ ] All 4 work orders moved to 99_COMPLETED
- [ ] Zero console errors
- [ ] WCAG 2.1 AA compliance maintained
- [ ] RLS policies tested and working
- [ ] Mobile responsive at all breakpoints

### Business Metrics
- [ ] Grey market practitioners can use app in ceremony environments
- [ ] Potency calculator prevents overdoses
- [ ] Crisis logger creates legal defense documentation
- [ ] Pricing page shows Data Bounty discount
- [ ] Data Contribution Agreement signed by users

### Strategic Metrics
- [ ] Grey market features enable data flywheel
- [ ] Data contribution rate ≥ 60% of users
- [ ] Conversion rate improves (pricing transparency)
- [ ] Path to Data Trust moat established

---

## 🚨 CRITICAL DEPENDENCIES

### Legal Review Required
- **WO-062:** Data Contribution Agreement must be reviewed by legal counsel before launch
- **Timeline:** 1-2 weeks for legal review
- **Blocker:** Cannot launch pricing without legal approval

### Security Audit Required
- **All features:** Zero-Knowledge architecture needs security audit
- **Timeline:** 2-3 weeks for external audit
- **Blocker:** Grey market features handle sensitive data

---

## 📖 NEXT STEPS

### Immediate Actions
1. **LEAD:** Triage all 4 work orders in `00_INBOX`
2. **LEAD:** Assign to BUILDER/DESIGNER based on complexity
3. **USER:** Engage legal counsel for Data Contribution Agreement review
4. **USER:** Schedule security audit for ZK architecture

### Recommended Sequence
1. Start with **WO-061 (Cockpit Mode)** - enables all other features
2. Parallel track **WO-059 (Potency Normalizer)** and **WO-062 (Pricing)**
3. Complete **WO-060 (Crisis Logger)** last (builds on others)

---

## 💰 ESTIMATED COSTS

### Development Time
- **Total:** 7-11 days (sequential) or 3-5 days (parallel)
- **Cost:** $5,000-$10,000 (assuming $100/hr contractor rate)

### Legal Review
- **Data Contribution Agreement:** $2,000-$5,000
- **Privacy policy updates:** $1,000-$2,000

### Security Audit
- **Zero-Knowledge architecture:** $10,000-$20,000
- **Penetration testing:** $5,000-$10,000

**Total Estimated Cost:** $23,000-$47,000

---

## 🎯 STRATEGIC ALIGNMENT

These 4 work orders directly address the **critical gap** identified in the Strategic Gap Analysis:

**Without these features:**
- ❌ Grey market practitioners cannot use the app
- ❌ Insufficient data volume for pharma licensing
- ❌ No competitive moat
- ❌ Just "another EHR" competing with Osmind

**With these features:**
- ✅ 50,000+ potential grey market users
- ✅ Highest session volume (data flywheel)
- ✅ Unique value proposition
- ✅ Path to $49.2M valuation by Year 3

---

**INSPECTOR STATUS:** ✅ All work orders created. Awaiting LEAD triage and user decision on prioritization.
