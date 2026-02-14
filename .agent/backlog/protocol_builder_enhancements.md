# Protocol Builder - Backlog Items

**Last Updated:** February 13, 2026

---

## P1 - Post-Launch Enhancements

### 1. Dosage Warning/Guidance System (Research Data Framing)

**Status:** Deferred  
**Priority:** P1 (Important, not urgent)  
**Estimated Time:** 2-3 hours

**Background:**
Previously had a patient-specific dosage recommendation that said:
> "Recommendation: Based on patient weight (71-80kg), suggested starting dose is 20-25mg."

This was **hidden** on Feb 13, 2026 due to legal liability concerns (crosses line from research data to medical advice).

**Future Implementation:**
Re-implement with proper research data framing:

**Example:**
```typescript
{patientWeight && (
    <div className="text-sm text-[#94a3b8] bg-[#0f1218] border border-[#1e293b] rounded-lg p-3">
        <span className="font-medium text-[#f8fafc]">Network Data:</span> For patients in the {patientWeight} weight range, historical protocols show a dosage range of 20-25{unit} (n=247 protocols, network average).
        <div className="text-xs text-[#64748b] mt-1">
            ⚖️ This is research data only. All dosing decisions remain the sole responsibility of the treating practitioner.
        </div>
    </div>
)}
```

**Key Changes Needed:**
- ❌ Remove: "Recommendation", "suggested starting dose"
- ✅ Add: "Network Data", "historical protocols show", "network average"
- ✅ Add: Legal disclaimer
- ✅ Add: Sample size (n=247) for credibility

**Reference:**
- Implementation plan: `/Users/trevorcalton/.gemini/antigravity/brain/ec364aaf-2cd2-4f3f-9b70-fcc3645108de/implementation_plan.md`
- Strategic guidance: `docs/archive/audits/SITE_REFINED_VISION.md`

**Acceptance Criteria:**
- [ ] Dosage guidance uses research data framing only
- [ ] Legal disclaimer present
- [ ] Sample size included
- [ ] No prescriptive language ("should", "recommended", "suggested")
- [ ] User approval on language

---

### 2. Maximum Dosage Safety Warnings

**Status:** Deferred  
**Priority:** P1 (Important, not urgent)  
**Estimated Time:** 1-2 hours

**Background:**
Previously had warnings that popped up if dosage exceeded maximum recommendations from reference tables.

**Future Implementation:**
Re-implement with research data framing:

**Example:**
```typescript
{dosage > maxSafeDose && (
    <div className="text-sm text-[#fbbf24] bg-[#0f1218] border border-[#f59e0b] rounded-lg p-3">
        <span className="font-medium text-[#f8fafc]">⚠️ Safety Alert:</span> This dosage ({dosage}{unit}) exceeds the maximum observed in network protocols ({maxSafeDose}{unit}). Historical data shows increased adverse event rates above this threshold (n=1,247 protocols).
        <div className="text-xs text-[#64748b] mt-1">
            ⚖️ This is research data only. All dosing decisions remain the sole responsibility of the treating practitioner.
        </div>
    </div>
)}
```

**Key Changes Needed:**
- ❌ Remove: "Do not exceed", "Reduce dose"
- ✅ Add: "exceeds maximum observed", "increased adverse event rates"
- ✅ Add: Legal disclaimer
- ✅ Add: Sample size

**Acceptance Criteria:**
- [ ] Safety warnings use research data framing only
- [ ] Legal disclaimer present
- [ ] No prescriptive language
- [ ] User approval on language

---

## P2 - Future Enhancements

### 3. Protocol Builder Complete Redesign

**Status:** Deferred to Week 2 (post-launch)  
**Priority:** P2  
**Estimated Time:** 10-15 hours (DESIGNER) + implementation

**Reference:**
- `docs/archive/audits/designer_outstanding_tasks.md`

---

### 4. Protocol Intelligence Features

**Status:** Deferred to Week 2 (post-launch)  
**Priority:** P2  
**Estimated Time:** 3-6 weeks (Phase 1-2)

**Reference:**
- Implementation plan: `/Users/trevorcalton/.gemini/antigravity/brain/64b01072-8b80-4b2a-b847-bb7358af4d41/implementation_plan.md`

---

**Note:** All deferred items must maintain legal compliance and use research data framing, not medical advice language.
