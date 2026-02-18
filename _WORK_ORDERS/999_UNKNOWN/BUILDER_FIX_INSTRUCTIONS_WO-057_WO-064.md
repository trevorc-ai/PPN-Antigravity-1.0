# 🔧 BUILDER FIX INSTRUCTIONS: WO-057 & WO-064

**Date:** 2026-02-17T11:03:00-08:00  
**Priority:** P1 (Critical)  
**Assigned To:** BUILDER  
**Estimated Time:** 30 minutes total

---

## 🎯 TWO SIMPLE FIXES REQUIRED

### FIX #1: WO-057 - Sidebar Overlap and Navigation Fixes

**Issue:** "Wellness Journey" link still present in Sidebar.tsx (Line 32)  
**Failure Count:** 1/2 (one strike remaining)

**File:** `src/components/Sidebar.tsx`

**Action:** DELETE Line 32

**Current Code (Line 32):**
```typescript
{ label: 'Wellness Journey', icon: 'psychology', path: '/arc-of-care-god-view' },
```

**Fix:**
```bash
# Open file and delete line 32
# OR use sed:
sed -i '' '32d' src/components/Sidebar.tsx
```

**Verification:**
```bash
grep "Wellness Journey" src/components/Sidebar.tsx
# Should return: No matches
```

---

### FIX #2: WO-064 - Global Deep Blue Background

**Issue:** 6 black backgrounds not updated + Dashboard using solid color instead of gradient  
**Failure Count:** 1/2 (one strike remaining)

**Detailed rejection report:** `_WORK_ORDERS/04_QA/INSPECTOR_REJECTION_WO-064.md`

---

#### Fix 2.1: Dashboard.tsx (Line 150)

**File:** `src/pages/Dashboard.tsx`

**Current:**
```tsx
<PageContainer className="min-h-screen bg-[#0a1628] text-slate-300 flex flex-col gap-8">
```

**Change To:**
```tsx
<PageContainer className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d1b2a] to-[#05070a] text-slate-300 flex flex-col gap-8">
```

---

#### Fix 2.2: SubstanceMonograph.tsx (Line 140)

**File:** `src/pages/SubstanceMonograph.tsx`

**Current:**
```tsx
<div className="min-h-full bg-[#080a0f] animate-in fade-in duration-700 pb-20 overflow-x-hidden">
```

**Change To:**
```tsx
<div className="min-h-full bg-gradient-to-b from-[#0a1628] via-[#0d1b2a] to-[#05070a] animate-in fade-in duration-700 pb-20 overflow-x-hidden">
```

---

#### Fix 2.3: ComponentShowcase.tsx (Line 112)

**File:** `src/pages/ComponentShowcase.tsx`

**Current:**
```tsx
<div className="bg-[#0e1117] border border-slate-800 rounded-2xl overflow-hidden">
```

**Change To:**
```tsx
<div className="bg-gradient-to-b from-[#0a1628] via-[#0d1b2a] to-[#05070a] border border-slate-800 rounded-2xl overflow-hidden">
```

---

#### Fix 2.4: SecureGate.tsx (Lines 267, 332, 411, 481)

**File:** `src/pages/SecureGate.tsx`

**Find and Replace ALL 4 instances:**

**Current:**
```tsx
bg-[#080a0f]
```

**Change To:**
```tsx
bg-gradient-to-b from-[#0a1628] via-[#0d1b2a] to-[#05070a]
```

**Specific Lines:**
- Line 267: `<div id="institutional-identity" className="relative py-24 bg-[#080a0f] border-b border-white/5">`
- Line 332: `<div id="security-compliance" className="py-24 bg-[#080a0f]/50 border-y border-white/5">`
- Line 411: `<div id="membership-tiers" className="py-24 bg-[#080a0f] border-t border-white/5 relative overflow-hidden">`
- Line 481: `<div className="py-24 bg-[#080a0f] border-t border-white/5 relative overflow-hidden">`

**Note:** Line 332 has `/50` opacity - change to:
```tsx
bg-gradient-to-b from-[#0a1628]/50 via-[#0d1b2a]/50 to-[#05070a]/50
```

---

## ✅ VERIFICATION COMMANDS

### After Fix #1 (WO-057):
```bash
# Verify "Wellness Journey" link is removed
grep "Wellness Journey" src/components/Sidebar.tsx
# Expected: No matches

# Verify sidebar still has other links
grep "Dashboard\|My Protocols\|Interaction Checker" src/components/Sidebar.tsx
# Expected: Should find these links
```

### After Fix #2 (WO-064):
```bash
# Verify no black backgrounds remain
grep -r "bg-\[#0e1117\]\|bg-\[#080a0f\]" src/pages --include="*.tsx"
# Expected: No matches

# Verify deep blue gradient is present
grep -r "from-\[#0a1628\] via-\[#0d1b2a\] to-\[#05070a\]" src/pages --include="*.tsx" | wc -l
# Expected: 6+ instances (Dashboard, SubstanceMonograph, ComponentShowcase, SecureGate x4)
```

---

## 📋 COMPLETION CHECKLIST

### WO-057:
- [ ] Line 32 deleted from Sidebar.tsx
- [ ] No "Wellness Journey" references remain
- [ ] Sidebar still renders correctly
- [ ] No console errors
- [ ] Move WO-057 to `04_QA`

### WO-064:
- [ ] Dashboard.tsx updated (Line 150)
- [ ] SubstanceMonograph.tsx updated (Line 140)
- [ ] ComponentShowcase.tsx updated (Line 112)
- [ ] SecureGate.tsx updated (Lines 267, 332, 411, 481)
- [ ] All black backgrounds replaced with deep blue gradient
- [ ] Verification commands pass
- [ ] No console errors
- [ ] Move WO-064 to `04_QA`

---

## 🚦 NEXT STEPS

1. **BUILDER:** Execute both fixes
2. **BUILDER:** Run verification commands
3. **BUILDER:** Move both tickets to `04_QA`
4. **INSPECTOR:** Final QA review (should be quick approval)

---

**Estimated Time:**
- WO-057: 5 minutes (delete 1 line)
- WO-064: 25 minutes (update 7 instances across 4 files)
- **Total:** 30 minutes

**Priority:** P1 - These are simple fixes with clear instructions

---

**BUILDER:** Please execute these fixes and report back when complete.
