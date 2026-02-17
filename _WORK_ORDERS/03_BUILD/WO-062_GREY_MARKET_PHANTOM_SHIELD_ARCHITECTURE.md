# 🛡️ GREY MARKET "PHANTOM SHIELD" ARCHITECTURE
**Date:** 2026-02-16  
**LEAD:** Strategic Architecture for WO-059, WO-060, WO-061, WO-062

---

## 🎯 STRATEGIC OVERVIEW

These 4 work orders form the **core Grey Market "Phantom Shield" business model (Model #2)**. They are not independent features—they are an interconnected system that:

1. **Prevents adverse events** (Potency Normalizer)
2. **Provides legal defense** (Crisis Logger)
3. **Enables actual usage** (Cockpit Mode UI)
4. **Monetizes via data** (Pricing Data Bounty)

**This is the entire business model in 4 tickets.**

---

## 📊 TICKET DEPENDENCIES

```
WO-062 (Pricing) ──┐
                   ├──> MARKETER (Strategy & Messaging)
WO-061 (Cockpit) ──┤
                   │
WO-059 (Potency) ──┤
                   │
WO-060 (Crisis) ───┘
                   │
                   ├──> DESIGNER (UX & Visual Design)
                   │
                   ├──> SOOP (Database Schema)
                   │
                   └──> BUILDER (Implementation)
```

**All 4 tickets must go through MARKETER first for strategic positioning.**

---

## 🚨 WHY MARKETER FIRST?

From research documents:
> "We are not trying to maximize SaaS revenue; we are trying to maximize Data Volume. The software is The Wedge. The data is The Asset."

**MARKETER must define:**
1. **Value Propositions** - How do we position each feature?
2. **Messaging** - What language resonates with grey market practitioners?
3. **Conversion Barriers** - What objections must we address?
4. **Pricing Strategy** - How do we communicate the "Data Bounty" discount?
5. **Legal Positioning** - How do we frame these as "safety tools" not "medical devices"?

**Without clear messaging, DESIGNER and BUILDER will build the wrong thing.**

---

## 📋 MARKETER DELIVERABLES (Phase 1)

For each ticket, MARKETER must create:

### 1. Value Proposition Document
- **Target Audience:** Grey market practitioners (underground therapists, facilitators)
- **Pain Points:** What specific problems does this feature solve?
- **Value Metrics:** How do we quantify the benefit? (e.g., "Prevents 80% of accidental overdoses")
- **Competitive Differentiation:** Why can't they get this elsewhere?

### 2. Messaging Framework
- **Hero Copy:** Main headline for the feature
- **Supporting Copy:** 2-3 sentences explaining the benefit
- **Call-to-Action:** What do we want users to do?
- **Objection Handling:** What concerns will users have?

### 3. Legal/Compliance Positioning
- **Disclaimers:** Required legal language
- **Framing:** How do we position this to avoid regulatory scrutiny?
- **Risk Mitigation:** What language protects us legally?

### 4. Conversion Strategy
- **Onboarding Flow:** How do we introduce this feature?
- **Activation Triggers:** When/how do users first encounter it?
- **Retention Hooks:** What keeps them using it?

---

## 🎨 DESIGN PRINCIPLES (For DESIGNER - Phase 2)

Once MARKETER defines positioning, DESIGNER must create UX that embodies:

### 1. "Tactical, Not Clinical"
- **Aesthetic:** Submarine control room, not doctor's office
- **Colors:** OLED black + amber/red (night vision)
- **Typography:** Bold, high-contrast, readable in low light
- **Interactions:** Large touch targets (80px minimum)

### 2. "Effortless Documentation"
- **One-Tap Actions:** No typing during crisis
- **Automatic Timestamps:** No manual entry
- **Visual Feedback:** Haptic, not audio
- **Immutable Audit Trail:** Can't be edited/deleted

### 3. "Transparent Data Exchange"
- **Clear Value Prop:** "Save $1,800/year by sharing data"
- **Explicit Consent:** Checkbox, not pre-checked
- **Opt-Out Mechanism:** Easy to find, no dark patterns
- **Privacy Guarantees:** Zero-Knowledge architecture

---

## 🗄️ DATABASE ARCHITECTURE (For SOOP - Phase 3)

### New Tables Required:
1. **`substance_batches`** (WO-059) - Potency tracking
2. **`ref_substance_strains`** (WO-059) - Strain database
3. **`session_interventions`** (WO-060) - Crisis event logging
4. **`subscription_tiers`** (WO-062) - Pricing tiers
5. **`data_contribution_metrics`** (WO-062) - Contribution tracking

### Critical Constraints:
- ✅ **RLS Policies:** Users see only own data
- ✅ **Encryption:** Source names, reagent test images
- ✅ **Immutability:** Crisis logs cannot be edited/deleted
- ✅ **No PHI/PII:** Zero patient identifiers
- ✅ **Audit Trail:** All data changes logged

---

## 🔨 IMPLEMENTATION STRATEGY (For BUILDER - Phase 4)

### Phased Rollout:

**Phase 1: Foundation (Week 1)**
- WO-061 (Cockpit Mode) - Enables all other features
- WO-062 (Pricing Page) - Communicates value prop

**Phase 2: Safety Tools (Week 2-3)**
- WO-059 (Potency Normalizer) - Prevents overdoses
- WO-060 (Crisis Logger) - Legal defense

**Phase 3: Integration & Testing (Week 4)**
- Integrate all features
- End-to-end testing
- User acceptance testing

---

## ⚖️ LEGAL & COMPLIANCE

### Critical Legal Positioning:

**These are "Safety Tools" NOT "Medical Devices"**

**Disclaimers Required:**
- "For harm reduction purposes only. Not medical advice."
- "Receptor binding does not predict outcomes for an individual."
- "This is for documentation purposes only."
- "Not a substitute for professional medical judgment."

**Data Collection:**
- ✅ De-identified outcomes data
- ✅ Substance type, dosage, protocol details
- ❌ Patient names, addresses, identifiers
- ❌ Practitioner identity linked to data
- ❌ GPS coordinates or location data

---

## 💰 MONETIZATION STRATEGY

### "Data Bounty" Pricing Model:

**Clinic OS Tier:**
- **Full Price:** $199/month
- **With Data Contribution:** $49/month (75% discount)
- **Savings:** $1,800/year

**Value Proposition:**
> "You're effectively paid to use the software via insurance savings. The data you contribute is worth $150/year to us, so we discount the software by $150/month."

**Conversion Barriers to Address:**
1. "Why should I share my data?" → "Better benchmarks, insurance savings"
2. "Is my data safe?" → "Zero-Knowledge architecture, encrypted"
3. "Can I opt out?" → "Yes, anytime. You'll pay full price."
4. "What if I don't contribute enough?" → "Minimum 5 protocols/month"

---

## 🎯 SUCCESS METRICS

### For MARKETER:
- [ ] Value props defined for all 4 features
- [ ] Messaging framework created
- [ ] Legal disclaimers drafted
- [ ] Conversion strategy documented

### For DESIGNER:
- [ ] Cockpit Mode theme designed
- [ ] Crisis Logger UX designed
- [ ] Potency Normalizer UX designed
- [ ] Pricing page redesigned

### For SOOP:
- [ ] Database schema designed
- [ ] RLS policies defined
- [ ] SQL functions created
- [ ] Migration scripts ready

### For BUILDER:
- [ ] All 4 features implemented
- [ ] End-to-end testing complete
- [ ] User acceptance testing passed
- [ ] Production deployment ready

---

## 🚦 ROUTING DECISION

**All 4 tickets → MARKETER (Phase 1: Strategy & Messaging)**

**MARKETER's Task:**
1. Read all 4 tickets thoroughly
2. Create value prop documents for each
3. Define messaging frameworks
4. Draft legal disclaimers
5. Create conversion strategies
6. Document in each ticket under `## MARKETER DELIVERABLES`

**When MARKETER completes Phase 1:**
- Move tickets to `04_QA` for LEAD review
- LEAD will then route to DESIGNER for Phase 2

**Estimated Time for MARKETER:** 3-5 days (this is strategic work, not tactical)

---

**LEAD STATUS:** ✅ Strategic architecture complete. All 4 tickets routed to MARKETER for Phase 1 (Strategy & Messaging).
