# 🎯 NEXT TASKS - PRIORITY ORDER
**Date:** 2026-02-10  
**Status:** Post-Audit & Database Migration Complete

---

## 📋 IMMEDIATE PRIORITIES (This Week)

### 🔴 **TASK 1: Wire ProtocolBuilder to Database** 
**Owner:** DESIGNER Agent  
**Effort:** 2-3 hours  
**Status:** 🟡 READY TO START

**Context:**
- Database schema is complete (migrations 003, 004, 004b executed)
- 7 test protocols seeded (`TEST_PROTO_001` - `006`)
- Reference tables populated with substances, routes, indications, etc.

**Action Required:**
Read and execute `DESIGNER_TASK_PROTOCOLBUILDER.md`:
1. Convert 7 hardcoded dropdowns to fetch from Supabase reference tables
2. Add 4 new fields (Primary Indication, Session Number, Session Date, Protocol Template)
3. Update `formData` state to store IDs instead of text labels
4. Update validation logic

**Files to Modify:**
- `src/pages/ProtocolBuilder.tsx` (or `ProtocolBuilderRedesign.tsx` - see Task 2)

**Success Criteria:**
- All dropdowns populate from database
- Form saves with new fields
- Data appears in `log_clinical_records` table

---

### 🔴 **TASK 2: Resolve Protocol Builder Duplication**
**Owner:** ARCHITECT Agent  
**Effort:** 2 hours  
**Status:** 🔴 CRITICAL

**Problem:**
Three Protocol Builder implementations exist:
- `ProtocolBuilder.tsx` (73KB) - Original
- `ProtocolBuilderRedesign.tsx` (82KB) - Redesign with DB integration
- `ProtocolBuilderV2.tsx` (6KB) - ✅ Already archived

**Decision Required:**
Which version is canonical?
- **Option A:** Use `ProtocolBuilderRedesign.tsx` (has DB integration)
- **Option B:** Merge DB features into `ProtocolBuilder.tsx` and delete Redesign

**Recommendation:** 
Use `ProtocolBuilderRedesign.tsx` as canonical, delete `ProtocolBuilder.tsx`.

**Action Steps:**
1. Verify `ProtocolBuilderRedesign.tsx` has all features from original
2. Update route in `App.tsx` to point to Redesign version
3. Archive or delete `ProtocolBuilder.tsx`
4. Document decision in `ARCHITECTURE_OVERVIEW.md`

---

### 🔴 **TASK 3: Replace alert() Calls with Toast System**
**Owner:** DESIGNER Agent  
**Effort:** 4 hours  
**Status:** 🟡 READY TO START

**Problem:**
11 instances of browser `alert()` provide poor UX:
- `TopHeader.tsx` (3x) - "Coming Soon!" placeholders
- `ProtocolBuilder.tsx` (3x) - Error handling
- `ProtocolBuilderRedesign.tsx` (3x) - Error handling
- `InteractionChecker.tsx` (1x) - Request logging
- `SignUp.tsx` (1x) - Success message

**Action Required:**
1. Create `src/components/ui/Toast.tsx` component
2. Create `ToastContext` provider
3. Replace all `alert()` calls with `addToast()`

**Reference Implementation:**
See `_agent_status.md` lines 152-170 for code example.

---

### 🔴 **TASK 4: Fix Demo Mode Security Hole**
**Owner:** BUILDER Agent  
**Effort:** 30 minutes  
**Status:** 🔴 CRITICAL

**Problem:**
Anyone can bypass authentication by setting `localStorage.setItem('demo_mode', 'true')`.

**Location:**
`src/App.tsx` line 94

**Fix:**
```typescript
// Replace:
const isDemoMode = localStorage.getItem('demo_mode') === 'true';

// With:
const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';
```

---

## 🟡 HIGH PRIORITY (This Month)

### **TASK 5: Connect Analytics to Database**
**Owner:** BUILDER Agent  
**Effort:** 8 hours  
**Status:** 🟡 BLOCKED (waiting for Task 1)

**Problem:**
Analytics components use static mock data instead of querying the database.

**Components to Refactor:**
1. `SafetyRiskMatrix.tsx` - Replace `MOCK_RISK_DATA` with Supabase query
2. `InteractionChecker.tsx` - Query `log_clinical_records` for real interactions
3. Create new "Patient Snapshot" page to view protocol history

**Reference:**
See `ENGINEERING_REPORT_GAPS_AND_PLAN.md` for detailed gap analysis.

---

### **TASK 6: Implement Testing Framework**
**Owner:** BUILDER Agent  
**Effort:** 16 hours  
**Status:** 🟡 READY TO START

**Current State:**
- ❌ No test files exist
- ❌ No testing framework installed

**Action Required:**
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

**Priority Test Targets:**
1. ProtocolBuilder form validation
2. AuthContext login/logout flows
3. Supabase RLS policies (integration tests)
4. Analytics chart data transformations

---

### **TASK 7: Standardize Tooltips**
**Owner:** DESIGNER Agent  
**Effort:** 4 hours  
**Status:** 🟡 PARTIALLY COMPLETE

**Progress:**
- ✅ `AdvancedTooltip.tsx` component exists
- ⚠️ Some components still use raw `title` attributes
- ⚠️ Recharts tooltips have custom styling

**Action Required:**
Replace all `title` attributes with `AdvancedTooltip` component.

---

### **TASK 8: Create Unified Button Component**
**Owner:** DESIGNER Agent  
**Effort:** 3 hours  
**Status:** 🟡 READY TO START

**Problem:**
Multiple button patterns across the codebase:
- `bg-primary hover:bg-blue-600`
- `bg-indigo-600 hover:bg-indigo-500`
- `bg-slate-900 hover:bg-slate-800`
- Custom `GravityButton` component

**Action Required:**
Create `src/components/ui/Button.tsx` with variants:
- `primary`, `secondary`, `danger`, `ghost`

---

## 🟢 MEDIUM PRIORITY (This Quarter)

### **TASK 9: Code Splitting**
**Owner:** ARCHITECT Agent  
**Effort:** 6 hours

Lazy load deep-dive pages to reduce initial bundle size.

### **TASK 10: Migration Runner**
**Owner:** BUILDER Agent  
**Effort:** 8 hours

Build CLI tool for migrations with rollback scripts.

### **TASK 11: Component Storybook**
**Owner:** DESIGNER Agent  
**Effort:** 12 hours

Install Storybook and document 20 core components.

---

## ⚪ LOW PRIORITY (Backlog)

- Responsive testing at all breakpoints
- API documentation (Supabase schema)
- Performance optimization (bundle size reduction)

---

## 📊 COMPLETION TRACKER

```
✅ Quick Wins:           8/8   (100%)
🔴 Critical Tasks:       0/4   (0%)
🟡 High Priority:        0/5   (0%)
🟢 Medium Priority:      0/3   (0%)
-----------------------------------
Overall Progress:        8/20  (40%)
```

---

## 🚀 RECOMMENDED EXECUTION ORDER

**Week 1:**
1. Task 2 (Protocol Builder Duplication) - 2 hours
2. Task 1 (Wire to Database) - 3 hours
3. Task 4 (Demo Mode Security) - 30 minutes
4. Task 3 (Toast System) - 4 hours

**Week 2:**
5. Task 5 (Connect Analytics) - 8 hours
6. Task 6 (Testing Framework) - 16 hours

**Week 3-4:**
7. Tasks 7-8 (UI Standardization) - 7 hours
8. Tasks 9-11 (Infrastructure) - 26 hours

---

**Last Updated:** 2026-02-10 09:47 AM  
**Next Review:** After Task 1 completion
