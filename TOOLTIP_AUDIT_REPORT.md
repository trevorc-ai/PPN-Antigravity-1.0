# 🔍 TOOLTIP ALIGNMENT & VISIBILITY AUDIT

**Date:** 2026-02-10  
**Auditor:** Builder Agent  
**Scope:** All tooltips across the PPN Research Portal

---

## 📊 EXECUTIVE SUMMARY

**Total Tooltips Found:** 7 AdvancedTooltip instances  
**Issues Fixed:** 1  
**Issues Remaining:** 0  
**Status:** ✅ ALL CLEAR

---

## 🗂️ TOOLTIP INVENTORY

### **ProtocolDetail.tsx** (6 tooltips)

| Line | Location | Content | Side | Status |
|------|----------|---------|------|--------|
| 152 | Receptor Affinity Profile | "Comparative binding affinity logic..." | default (top) | ✅ OK |
| 212 | Therapeutic Envelope | "Environmental setting, support staff ratio..." | default (top) | ✅ OK |
| 269 | Auditory Drive Badge | "Curated music playlist..." | default (top) | ✅ OK |
| 289 | Efficacy Trajectory | "Longitudinal tracking of clinical outcome..." | default (top) | ✅ OK |
| 379 | Protocol Label | "Core pharmacological and identity parameters..." | default (top) | ✅ OK |
| 418 | Safety Monitor | "Real-time monitoring of concomitant medications..." | **bottom** | ✅ **FIXED** |

### **ProtocolBuilder.tsx** (1 tooltip)

| Line | Location | Content | Side | Status |
|------|----------|---------|------|--------|
| 1036 | Support Modality | Rich content with modality definitions | **bottom** | ✅ OK (guide tier) |

---

## 🔧 ISSUES IDENTIFIED & FIXED

### **Issue #1: Safety Monitor Tooltip Hidden** ✅ FIXED

**File:** `ProtocolDetail.tsx`  
**Line:** 418  
**Problem:** Tooltip was positioned at `side="top"` (default) and was being cut off by the container's `overflow-hidden` property.

**Fix Applied:**
```tsx
// BEFORE
<AdvancedTooltip content="Real-time monitoring...">

// AFTER
<AdvancedTooltip 
  content="Real-time monitoring..."
  side="bottom"
>
```

**Impact:** Tooltip now displays below the icon, avoiding container overflow issues.

---

## ✅ BEST PRACTICES OBSERVED

1. **All tooltips use AdvancedTooltip component** - Good standardization
2. **Consistent icon usage** - `<Info>` from lucide-react
3. **Print-hidden class** - Tooltips don't appear in print mode
4. **Accessible hover states** - Color transitions on hover

---

## 📋 RECOMMENDATIONS

### **1. Standardize `side` Prop Usage**

Currently, most tooltips use the default `side="top"`. Consider explicitly setting `side` based on context:

- **Headers near top of containers:** Use `side="bottom"`
- **Mid-section elements:** Use `side="top"` or `side="right"`
- **Right-side panels:** Use `side="left"`

### **2. Add Consistent Width**

Some tooltips may benefit from explicit width control:

```tsx
<AdvancedTooltip 
  content="..."
  width="w-64"  // or w-80 for longer content
  side="bottom"
>
```

### **3. Consider z-index Stacking**

For tooltips in complex layouts, ensure proper z-index:

```tsx
// In AdvancedTooltip.tsx, tooltips already use z-[100]
// This should be sufficient for most cases
```

---

## 🎯 TOOLTIP POSITIONING GUIDELINES

### **When to use each side:**

| Side | Use Case | Example |
|------|----------|---------|
| `top` | Default, mid-page elements | Most tooltips |
| `bottom` | Headers, top-of-container elements | Safety Monitor, Support Modality |
| `left` | Right-aligned elements | Right sidebar items |
| `right` | Left-aligned elements | Left sidebar items |

### **Container Overflow Considerations:**

Elements with these classes may clip tooltips:
- `overflow-hidden`
- `overflow-clip`
- `rounded-[2.5rem]` (large border radius)

**Solution:** Use `side="bottom"` or ensure parent has `overflow-visible` where appropriate.

---

## 🔍 ADDITIONAL FINDINGS

### **SimpleTooltip Usage**

No instances of `SimpleTooltip` found in current codebase (previously replaced in ProtocolDetail.tsx).

### **Raw `title` Attributes**

Found in:
- Line 435: `title="Run Interaction Analysis"` (ProtocolDetail.tsx)

**Recommendation:** Consider replacing with AdvancedTooltip for consistency.

---

## ✅ AUDIT CONCLUSION

**Status:** All tooltips are now properly aligned and visible.  
**Action Required:** None - all issues resolved.  
**Next Review:** After any major UI refactoring or new tooltip additions.

---

**Audit Completed:** 2026-02-10 12:55 PM  
**Builder Agent:** Antigravity
