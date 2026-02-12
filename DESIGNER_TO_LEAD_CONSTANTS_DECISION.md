# 🎨 DESIGNER → LEAD: Molecular Data Constants Decision

**From:** DESIGNER  
**To:** LEAD  
**Date:** 2026-02-12 05:46 PST  
**Priority:** MEDIUM  
**Type:** Design Decision Request

---

## 🎯 **DECISION NEEDED**

What level of molecular detail should we include in the `constants.tsx` file for the 7 priority substances?

**Context:** I'm creating mobile designs for the Substance Library and need to know how much molecular data to display and store in the frontend.

---

## 📊 **OPTIONS**

### **Option 1: MINIMAL (Quick Win)**
**What to Include:**
```typescript
// src/constants/substances.tsx
export const SUBSTANCES = [
  {
    id: 1,
    name: "Psilocybin",
    formula: "C12H17N2O4P",
    color: "#6366f1" // Indigo
  },
  {
    id: 2,
    name: "MDMA",
    formula: "C11H15NO2",
    color: "#a855f7" // Purple
  },
  // ... 5 more
];
```

**Pros:**
- ✅ Fast to implement (5 minutes)
- ✅ No external dependencies
- ✅ Works immediately

**Cons:**
- ⚠️ Limited educational value
- ⚠️ No molecular visualization

**Use Case:** Basic substance cards, simple UI

---

### **Option 2: MODERATE (Recommended)**
**What to Include:**
```typescript
export const SUBSTANCES = [
  {
    id: 1,
    name: "Psilocybin",
    formula: "C12H17N2O4P",
    molecularWeight: 284.25,
    smiles: "CN(C)CCc1c[nH]c2ccc(OP(=O)(O)O)cc12",
    color: "#6366f1",
    primaryReceptor: "5-HT2A",
    therapeuticClass: "Classic Psychedelic"
  },
  // ... 6 more
];
```

**Pros:**
- ✅ Enables 3D visualization (via SMILES)
- ✅ Educational context
- ✅ Still lightweight

**Cons:**
- ⚠️ Requires SMILES strings from SOOP
- ⚠️ Need to add 3D viewer library

**Use Case:** Interactive substance library, educational content

---

### **Option 3: COMPREHENSIVE (Advanced)**
**What to Include:**
```typescript
export const SUBSTANCES = [
  {
    id: 1,
    name: "Psilocybin",
    formula: "C12H17N2O4P",
    molecularWeight: 284.25,
    smiles: "CN(C)CCc1c[nH]c2ccc(OP(=O)(O)O)cc12",
    color: "#6366f1",
    
    // Pharmacology
    primaryReceptor: "5-HT2A",
    receptorAffinity: {
      "5-HT2A": { ki: 6, unit: "nM", type: "agonist" },
      "5-HT1A": { ki: 190, unit: "nM", type: "agonist" },
      "5-HT2C": { ki: 45, unit: "nM", type: "agonist" }
    },
    
    // Pharmacokinetics
    halfLife: "2-3 hours",
    bioavailability: "50%",
    
    // Clinical
    therapeuticClass: "Classic Psychedelic",
    indications: ["Depression", "Anxiety", "PTSD"],
    
    // External IDs
    pubchemCID: 10624,
    drugbankID: "DB00780"
  },
  // ... 6 more
];
```

**Pros:**
- ✅ Rich educational content
- ✅ Supports advanced features
- ✅ Professional reference quality

**Cons:**
- ⚠️ Large data file
- ⚠️ Requires extensive data collection
- ⚠️ May be overkill for MVP

**Use Case:** Clinical reference platform, research tool

---

## 🤔 **MY RECOMMENDATION**

### **Start with Option 2 (MODERATE)**

**Rationale:**
1. **Enables 3D visualization** - SMILES strings allow us to use 3Dmol.js or similar
2. **Educational value** - Shows molecular weight, primary receptor
3. **Lightweight** - Still fits in a constants file
4. **Scalable** - Can move to database later if needed

**Implementation:**
- DESIGNER creates constants file with Option 2 structure
- SOOP provides SMILES strings (7 substances)
- BUILDER adds 3D viewer component (lazy-loaded)
- Move to database in Phase 2 if we add more substances

---

## 📋 **QUESTIONS FOR LEAD**

1. **Scope:** Are we building a simple substance library or a clinical reference tool?

2. **Data Source:** Should this data live in:
   - Frontend constants (fast, simple)
   - Database (scalable, dynamic)
   - Hybrid (constants for MVP, database later)

3. **3D Visualization:** Do we want interactive 3D molecules?
   - If YES → Need SMILES strings (Option 2 or 3)
   - If NO → Option 1 is sufficient

4. **Timeline:** When do we need this?
   - This week → Option 1
   - Next week → Option 2
   - Month 1 → Option 3

5. **Future Plans:** Will we add more substances beyond these 7?
   - If YES → Use database from start
   - If NO → Constants file is fine

---

## 🎯 **IMMEDIATE ACTIONS BASED ON DECISION**

### **If Option 1 (Minimal):**
- [ ] DESIGNER creates constants file (5 min)
- [ ] BUILDER uses for substance cards
- [ ] Done ✅

### **If Option 2 (Moderate):**
- [ ] SOOP provides SMILES strings
- [ ] DESIGNER creates constants file
- [ ] BUILDER adds 3D viewer component
- [ ] Timeline: 2-3 days

### **If Option 3 (Comprehensive):**
- [ ] SOOP creates database tables
- [ ] SOOP collects pharmacology data
- [ ] BUILDER creates API endpoints
- [ ] DESIGNER creates detailed substance pages
- [ ] Timeline: 1-2 weeks

---

## 💬 **SUGGESTED DECISION FRAMEWORK**

**Choose Option 1 if:**
- We need something working TODAY
- 3D visualization is not important
- We're just showing basic substance info

**Choose Option 2 if:**
- We want to impress users with 3D molecules
- We have 2-3 days to implement
- We want educational value without complexity

**Choose Option 3 if:**
- We're building a clinical reference platform
- We have 1-2 weeks for this feature
- We plan to add many more substances

---

## 🚀 **MY VOTE: Option 2**

**Why:**
- Strikes the right balance for MVP
- Enables "wow factor" with 3D visualization
- Doesn't require extensive data collection
- Can be implemented in a few days
- Easy to migrate to database later

---

## 📝 **NEXT STEPS**

1. **LEAD decides** which option (1, 2, or 3)
2. **LEAD communicates** decision to DESIGNER
3. **DESIGNER executes** based on decision
4. **SOOP provides** data if needed (Option 2 or 3)
5. **BUILDER implements** UI components

---

**Decision Request Submitted:** 2026-02-12 05:46 PST  
**Awaiting:** LEAD's decision  
**Default if no response:** Option 2 (Moderate)  
**Timeline:** Can start immediately upon approval
