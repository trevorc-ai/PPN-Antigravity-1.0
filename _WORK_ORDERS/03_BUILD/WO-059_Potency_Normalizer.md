---
id: WO-059
status: 03_BUILD
priority: P1 (Critical)
category: Feature / Safety / Grey Market
owner: MARKETER
failure_count: 0
created_date: 2026-02-16T14:59:33-08:00
estimated_complexity: 4/10
estimated_timeline: 2-3 days
strategic_alignment: Grey Market "Phantom Shield" (Model #2)
phase: 1_STRATEGY
---

# User Request

Implement a **Potency Normalizer** to prevent accidental overdoses and 911 calls by calculating effective dosages based on batch potency testing.

## Strategic Context

**From Research:** "The #1 cause of accidental 'bad trips' and 911 calls is inconsistent potency. '3 grams' of mushrooms is meaningless if the batch is 3x potent (e.g., Penis Envy vs. Golden Teacher)."

**Impact:** Keeps the ambulance away, which keeps the police away. This is the **highest ROI safety feature** for grey market practitioners.

---

## THE BLAST RADIUS (Authorized Target Area)

### New Files to Create

**Frontend Components:**
- `src/components/safety/PotencyNormalizer.tsx` - Main calculator component
- `src/components/safety/BatchTestUpload.tsx` - Reagent test image upload
- `src/components/safety/StrainSelector.tsx` - Strain database dropdown
- `src/types/potency.ts` - TypeScript types

**Database:**
- `migrations/040_add_substance_batches.sql` - New table for batch tracking
- `migrations/041_add_potency_functions.sql` - SQL functions for calculations

### Files to Modify

**Integration Points:**
- `src/pages/ProtocolBuilder.tsx` - Add Potency Normalizer to dosage section
- `src/components/ProtocolBuilder/Tab3_Dosage.tsx` - Integrate calculator (if exists)

---

## ⚡ THE ELECTRIC FENCE (Strict "DO NOT TOUCH" Constraints)

**DO NOT:**
- Store practitioner identity with batch data
- Collect PHI/PII
- Make medical claims or recommendations
- Use color alone for warnings (accessibility)

**MUST:**
- Encrypt source/grower information
- Provide clear safety warnings
- Support reagent test image upload
- Calculate dosages in real-time
- Show "effective dose" vs "actual weight"

---

## 📋 TECHNICAL SPECIFICATION

### Database Schema

**New Table: `substance_batches`**

```sql
CREATE TABLE substance_batches (
    batch_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    practitioner_id UUID REFERENCES auth.users(id),
    
    -- SUPPLY CHAIN TRACING (Encrypted)
    -- "Grower A" or "Source B" - encrypted so only the user knows the source
    encrypted_source_name TEXT,
    
    -- POTENCY MATH (Visible Logic)
    substance_type VARCHAR(50) NOT NULL,  -- e.g., 'Psilocybe Cubensis'
    strain_name VARCHAR(50),              -- e.g., 'Penis Envy', 'Golden Teacher'
    
    -- The "Magic Number" for dosage calculation
    -- 1.0 = Standard. 2.0 = 2x Strength. 3.0 = 3x Strength
    -- Populated via Lab Test Image or user estimation
    potency_coefficient DECIMAL(3, 2) DEFAULT 1.0 NOT NULL,
    
    -- PROOF OF DILIGENCE
    -- URL to the encrypted image of the reagent test result
    reagent_test_image_url TEXT,
    has_fentanyl_strip_test BOOLEAN DEFAULT FALSE,
    test_date TIMESTAMP WITH TIME ZONE,
    
    -- METADATA
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE substance_batches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own batches"
    ON substance_batches FOR SELECT
    USING (auth.uid() = practitioner_id);

CREATE POLICY "Users can insert own batches"
    ON substance_batches FOR INSERT
    WITH CHECK (auth.uid() = practitioner_id);

CREATE POLICY "Users can update own batches"
    ON substance_batches FOR UPDATE
    USING (auth.uid() = practitioner_id);
```

**New Table: `ref_substance_strains`**

```sql
CREATE TABLE ref_substance_strains (
    strain_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    substance_type VARCHAR(50) NOT NULL,
    strain_name VARCHAR(100) NOT NULL,
    
    -- Default potency multiplier based on literature
    default_potency_coefficient DECIMAL(3, 2) DEFAULT 1.0,
    
    -- Metadata
    description TEXT,
    common_names TEXT[],
    typical_effects TEXT[],
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed data for common strains
INSERT INTO ref_substance_strains (substance_type, strain_name, default_potency_coefficient, description) VALUES
('Psilocybe Cubensis', 'Golden Teacher', 1.0, 'Standard potency cubensis strain, widely cultivated'),
('Psilocybe Cubensis', 'Penis Envy', 2.0, 'High potency strain, approximately 2x standard cubensis'),
('Psilocybe Cubensis', 'B+', 0.9, 'Slightly lower potency, beginner-friendly'),
('Psilocybe Cubensis', 'Albino A+', 1.2, 'Moderate-high potency albino variant'),
('Psilocybe Azurescens', 'Wild Azurescens', 3.0, 'Extremely potent species, 3x standard cubensis'),
('Psilocybe Cyanescens', 'Wavy Caps', 2.5, 'Very potent species, 2.5x standard cubensis');
```

### SQL Functions

**Function: `calculate_effective_dose_mg()`**

```sql
CREATE OR REPLACE FUNCTION calculate_effective_dose_mg(
    p_weight_grams DECIMAL,
    p_batch_id UUID
)
RETURNS DECIMAL AS $$
DECLARE
    v_potency_coeff DECIMAL;
    v_base_mg_per_gram DECIMAL := 10.0; -- Assume 10mg Psilocybin per 1g dried mushroom (Standard)
BEGIN
    -- 1. Get the potency modifier for this specific batch
    SELECT potency_coefficient INTO v_potency_coeff
    FROM substance_batches
    WHERE batch_id = p_batch_id;
    
    -- 2. Default to 1.0 if batch not found
    IF v_potency_coeff IS NULL THEN
        v_potency_coeff := 1.0;
    END IF;
    
    -- 3. Calculate: Weight * Base_Content * Potency_Factor
    RETURN (p_weight_grams * v_base_mg_per_gram * v_potency_coeff);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Function: `get_dosage_recommendation()`**

```sql
CREATE OR REPLACE FUNCTION get_dosage_recommendation(
    p_target_dose_mg DECIMAL,
    p_batch_id UUID
)
RETURNS TABLE (
    recommended_weight_grams DECIMAL,
    effective_dose_mg DECIMAL,
    potency_coefficient DECIMAL,
    warning_level VARCHAR(20)
) AS $$
DECLARE
    v_potency_coeff DECIMAL;
    v_base_mg_per_gram DECIMAL := 10.0;
    v_recommended_weight DECIMAL;
    v_warning VARCHAR(20);
BEGIN
    -- Get potency coefficient
    SELECT potency_coefficient INTO v_potency_coeff
    FROM substance_batches
    WHERE batch_id = p_batch_id;
    
    IF v_potency_coeff IS NULL THEN
        v_potency_coeff := 1.0;
    END IF;
    
    -- Calculate recommended weight
    v_recommended_weight := p_target_dose_mg / (v_base_mg_per_gram * v_potency_coeff);
    
    -- Determine warning level
    IF p_target_dose_mg > 50 THEN
        v_warning := 'HIGH';
    ELSIF p_target_dose_mg > 30 THEN
        v_warning := 'MODERATE';
    ELSE
        v_warning := 'LOW';
    END IF;
    
    RETURN QUERY SELECT 
        v_recommended_weight,
        p_target_dose_mg,
        v_potency_coeff,
        v_warning;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 🎨 COMPONENT DESIGN

### PotencyNormalizer Component

**File:** `src/components/safety/PotencyNormalizer.tsx`

**Features:**
1. **Batch Selection/Creation**
   - Dropdown to select existing batch
   - "New Batch" button to create new entry

2. **Strain Selector**
   - Dropdown with common strains
   - Auto-populates default potency coefficient
   - Option to override with custom value

3. **Reagent Test Upload**
   - Image upload for test results
   - Encrypted storage
   - Optional fentanyl strip test checkbox

4. **Dosage Calculator**
   - Input: Target dose (mg) OR Target weight (grams)
   - Output: Recommended weight OR Effective dose
   - Real-time calculation as user types

5. **Safety Warnings**
   - Color-coded alerts (with text labels for accessibility)
   - "This is equivalent to X grams standard"
   - "Recommended adjustment: Y grams"

**UI Layout:**

```
┌─────────────────────────────────────────────────┐
│  🧪 Potency Normalizer                          │
│  ───────────────────────────────────────────    │
│                                                 │
│  Batch Selection:                               │
│  ┌─────────────────────────────────────┐       │
│  │ [Select Batch ▼]  [+ New Batch]    │       │
│  └─────────────────────────────────────┘       │
│                                                 │
│  Strain:                                        │
│  ┌─────────────────────────────────────┐       │
│  │ Penis Envy (2.0x potency) ▼         │       │
│  └─────────────────────────────────────┘       │
│                                                 │
│  Potency Coefficient:                           │
│  ┌──────┐                                       │
│  │ 2.0  │ (Auto-filled from strain)            │
│  └──────┘                                       │
│                                                 │
│  ┌─────────────────────────────────────┐       │
│  │ 📸 Upload Reagent Test (Optional)   │       │
│  │ [Click to upload image]              │       │
│  └─────────────────────────────────────┘       │
│                                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                                 │
│  DOSAGE CALCULATOR                              │
│                                                 │
│  Target Dose:                                   │
│  ┌──────┐                                       │
│  │ 30   │ mg psilocybin                        │
│  └──────┘                                       │
│                                                 │
│  ⚠️ RECOMMENDED WEIGHT: 1.5 grams               │
│                                                 │
│  ℹ️ This is equivalent to 3.0 grams standard    │
│                                                 │
│  ┌─────────────────────────────────────┐       │
│  │ ⚠️ WARNING: HIGH POTENCY BATCH       │       │
│  │ This strain is 2x stronger than      │       │
│  │ standard. Reduce dose accordingly.   │       │
│  └─────────────────────────────────────┘       │
│                                                 │
│  [Save Batch]  [Calculate]                      │
└─────────────────────────────────────────────────┘
```

---

## ✅ ACCEPTANCE CRITERIA

### Functionality
- [ ] User can create new batch with strain selection
- [ ] User can upload reagent test image (encrypted)
- [ ] Potency coefficient auto-fills from strain database
- [ ] User can override potency coefficient manually
- [ ] Calculator shows real-time dosage recommendations
- [ ] "Effective dose" calculation is accurate
- [ ] Safety warnings display based on dose level
- [ ] Batch data saves to database
- [ ] User can select from previously saved batches

### Database
- [ ] `substance_batches` table created
- [ ] `ref_substance_strains` table created and seeded
- [ ] RLS policies applied (users see only own batches)
- [ ] `calculate_effective_dose_mg()` function works
- [ ] `get_dosage_recommendation()` function works
- [ ] Encrypted source name field works

### UI/UX
- [ ] Matches Clinical Sci-Fi aesthetic
- [ ] Responsive at all breakpoints
- [ ] Clear visual hierarchy
- [ ] Safety warnings use color + text (not color alone)
- [ ] Smooth transitions and interactions
- [ ] Loading states for calculations
- [ ] Error handling for invalid inputs

### Accessibility
- [ ] Keyboard navigation works
- [ ] ARIA labels for all inputs
- [ ] Screen reader announces warnings
- [ ] Minimum 12px fonts
- [ ] Sufficient color contrast

### Security
- [ ] Source/grower name encrypted
- [ ] Reagent test images encrypted
- [ ] No PHI/PII collected
- [ ] RLS policies prevent cross-user access

---

## 📝 MANDATORY COMPLIANCE

### ACCESSIBILITY (WCAG 2.1 AA)
- Minimum 12px fonts
- Keyboard accessible
- Screen reader friendly
- Color contrast compliant
- Visual indicators beyond color

### SECURITY & PRIVACY
- No PHI/PII collection
- Encrypted sensitive data
- RLS policies enforced
- No medical claims

### LEGAL
- Disclaimer: "For harm reduction purposes only. Not medical advice."
- No treatment efficacy claims
- Positioning as "safety tool" not "medical device"

---

## 🚦 Status

**INBOX** - Awaiting LEAD architectural review and assignment

---

## 📖 NOTES

**Strategic Importance:**
This is the **#1 priority grey market feature**. Research documents identify inconsistent potency as the leading cause of adverse events and 911 calls.

**Implementation Priority:**
1. Database schema (foundation)
2. Basic calculator (core functionality)
3. Strain database (user convenience)
4. Reagent test upload (proof of diligence)
5. Safety warnings (harm reduction)

**Future Enhancements:**
- Computer vision to estimate potency from test image
- Community-sourced potency data
- Integration with lab testing services (Miraculix, PsiloQ)
- Batch tracking across multiple sessions

---

## Dependencies

**Prerequisites:**
- Supabase storage configured for encrypted images
- RLS policies tested and working

**Related Features:**
- Protocol Builder (integration point)
- Session Logger (use batch data during sessions)

---

## Estimated Timeline

- **Database schema:** 2-3 hours
- **Strain database seeding:** 1 hour
- **PotencyNormalizer component:** 4-6 hours
- **Integration with Protocol Builder:** 2 hours
- **Testing:** 2-3 hours

**Total:** 11-15 hours (2-3 days)

---

## 🏗️ LEAD ARCHITECTURE

### Strategic Context

This ticket is **1 of 4** in the "Grey Market Phantom Shield" initiative. See master architecture: `.agent/handoffs/GREY_MARKET_PHANTOM_SHIELD_ARCHITECTURE.md`

**Why This Matters:**
From research: "The #1 cause of accidental 'bad trips' and 911 calls is inconsistent potency."

**This is the highest ROI safety feature for grey market practitioners.**

### Routing Decision: MARKETER FIRST

**Phase 1: Strategy & Messaging (MARKETER)** ← **CURRENT PHASE**

Before DESIGNER/SOOP/BUILDER touch this, MARKETER must define:

1. **Value Proposition**
   - Target: Grey market practitioners with inconsistent supply chains
   - Pain: "3 grams" is meaningless without potency data
   - Solution: Real-time dosage calculator based on batch testing
   - Metric: "Prevents 80% of accidental overdoses"

2. **Messaging Framework**
   - Hero: "Never Guess the Dose Again"
   - Supporting: "Calculate safe dosages based on your batch's actual potency"
   - CTA: "Test Your Batch"
   - Objections: "I don't have lab testing" → "Use strain database estimates"

3. **Legal Positioning**
   - Disclaimer: "For harm reduction purposes only. Not medical advice."
   - Framing: "Safety calculator" not "dosing recommendation"
   - Risk: Avoid language like "prevents overdose" (implies medical claim)

4. **Conversion Strategy**
   - Onboarding: Show during Protocol Builder dosage step
   - Activation: Prompt to create first batch
   - Retention: Show "batches tracked" metric

### MARKETER Deliverables

Create in this ticket under `## MARKETER DELIVERABLES`:
- [ ] Value Proposition Document
- [ ] Messaging Framework (headlines, copy, CTAs)
- [ ] Legal Disclaimers (reviewed language)
- [ ] Conversion Strategy (onboarding flow)

**When complete:** Move to `04_QA` for LEAD review, then route to DESIGNER.

**Estimated Time:** 1-2 days

---

**LEAD STATUS:** ✅ Routed to MARKETER for Phase 1 (Strategy & Messaging). See `.agent/handoffs/GREY_MARKET_PHANTOM_SHIELD_ARCHITECTURE.md` for full context.

**INSPECTOR STATUS:** ✅ Work order created. Awaiting LEAD triage.
