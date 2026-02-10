# Event Type Code Pattern - Implementation Guide

**Date:** February 8, 2026  
**Status:** 🎯 Best Practice Pattern

---

## 🎯 **The Core Principle**

**IDs are for the database. Codes are for humans and UI logic.**

---

## 📋 **The Pattern**

### **Database Layer:**
- Use `event_type_id` (bigint) for foreign keys
- Optimized for performance and referential integrity
- Auto-incrementing, database-managed

### **Application Layer:**
- Use `event_type_code` (text) for all user-facing logic
- Stable across environments (dev, staging, prod)
- Human-readable and self-documenting
- Safe for saved views, filters, and configuration

### **Display Layer:**
- Show `event_type_label` to users
- Labels can be edited for clarity
- Labels can be localized (i18n ready)

---

## ✅ **Why This Matters**

### **1. Stability Across Environments**

**Problem:**
```sql
-- Dev database
INSERT INTO ref_flow_event_types (id, event_type_code, event_type_label)
VALUES (1, 'intake_completed', 'Intake Completed');

-- Prod database (different ID!)
INSERT INTO ref_flow_event_types (id, event_type_code, event_type_label)
VALUES (42, 'intake_completed', 'Intake Completed');
```

**If you use IDs in saved views:**
```json
{
  "filters": {
    "event_type_ids": [1]  // ❌ Breaks in prod!
  }
}
```

**If you use codes:**
```json
{
  "filters": {
    "event_type_codes": ["intake_completed"]  // ✅ Works everywhere!
  }
}
```

---

### **2. Safer Refactoring**

**Scenario:** You want to improve label clarity

**Bad (using labels as keys):**
```typescript
// Before
if (eventLabel === 'Intake Completed') { ... }

// After label change
// ❌ Code breaks silently!
```

**Good (using codes):**
```typescript
// Before
if (eventCode === 'intake_completed') { ... }

// After label change to "Initial Intake Completed"
// ✅ Code still works!
```

---

### **3. Global Readiness (i18n)**

**Codes are language-neutral:**

```typescript
// English
{ code: 'session_completed', label: 'Session Completed' }

// Spanish
{ code: 'session_completed', label: 'Sesión Completada' }

// French
{ code: 'session_completed', label: 'Session Terminée' }

// Your analytics logic never changes!
if (event.code === 'session_completed') { ... }
```

---

### **4. Cleaner Debugging**

**In logs and exports:**

```
❌ event_type_id: 7
   (What does 7 mean? Need to look it up...)

✅ event_type_code: session_completed
   (Immediately clear!)
```

---

## 🔒 **The Rules**

### **Rule 1: Codes are Immutable**

Once a code exists, **never change it**.

```sql
-- ❌ NEVER DO THIS
UPDATE ref_flow_event_types 
SET event_type_code = 'session_complete'  -- Changed!
WHERE event_type_code = 'session_completed';

-- ✅ If you need a new meaning, create a new code
INSERT INTO ref_flow_event_types (event_type_code, event_type_label)
VALUES ('session_complete_v2', 'Session Completed (New Definition)');
```

---

### **Rule 2: Labels are Editable**

You can revise labels any time for clarity.

```sql
-- ✅ SAFE - only changes display text
UPDATE ref_flow_event_types 
SET event_type_label = 'Initial Intake Completed'
WHERE event_type_code = 'intake_completed';
```

---

### **Rule 3: Codes are Unique**

Enforced by database constraint.

```sql
-- ✅ Constraint added in migration 003
ALTER TABLE ref_flow_event_types 
ADD CONSTRAINT ref_flow_event_types_event_type_code_key 
UNIQUE (event_type_code);
```

---

## 🛠️ **Implementation**

### **Database Changes (Migration 003)**

1. **Uniqueness Constraints:**
   ```sql
   -- Codes must be unique
   ALTER TABLE ref_flow_event_types 
   ADD CONSTRAINT ref_flow_event_types_event_type_code_key 
   UNIQUE (event_type_code);
   
   -- Stage orders must be unique (for funnel integrity)
   ALTER TABLE ref_flow_event_types 
   ADD CONSTRAINT ref_flow_event_types_stage_order_key 
   UNIQUE (stage_order);
   ```

2. **Views Expose Codes:**
   ```sql
   -- v_flow_stage_counts now includes event_type_code
   SELECT
       et.event_type_code,  -- ✅ Added
       et.event_type_label,
       et.stage_order,
       ...
   ```

3. **Helper Function:**
   ```sql
   -- Convert code to ID when needed
   SELECT get_event_type_id_by_code('session_completed');
   ```

4. **Index for Performance:**
   ```sql
   CREATE INDEX idx_ref_flow_event_types_code 
   ON ref_flow_event_types(event_type_code) 
   WHERE is_active = TRUE;
   ```

---

### **Frontend Changes (To Be Implemented)**

#### **Before (using IDs):**

```typescript
// ❌ Old pattern - fragile
interface Filters {
  event_type_ids: number[];
}

const filters = {
  event_type_ids: [1, 2, 3]  // What do these mean?
};
```

#### **After (using codes):**

```typescript
// ✅ New pattern - stable
interface Filters {
  event_type_codes: string[];
}

const filters = {
  event_type_codes: [
    'intake_completed',
    'consent_verified',
    'baseline_completed'
  ]  // Self-documenting!
};
```

---

### **Chart Component Pattern**

```typescript
// FunnelChart.tsx (updated pattern)

// Query the view (includes both code and label)
const { data } = await supabase
  .from('v_flow_stage_counts')
  .select('event_type_code, event_type_label, stage_order, count_unique_patients');

// Group by code (stable)
const stageMap = new Map<string, StageData>();
data.forEach(row => {
  const key = row.event_type_code;  // ✅ Use code as key
  if (!stageMap.has(key)) {
    stageMap.set(key, {
      code: row.event_type_code,
      label: row.event_type_label,  // Display this to user
      patients: 0
    });
  }
  // ... aggregate
});

// Display label to user
<p>{stage.label}</p>

// But use code for logic
if (stage.code === 'session_completed') {
  // ... special handling
}
```

---

### **Saved Views Pattern**

```typescript
// user_saved_views table structure
interface SavedView {
  view_id: string;
  user_id: string;
  view_name: string;
  filter_config: {
    event_type_codes: string[];  // ✅ Store codes, not IDs
    site_ids: string[];
    date_range: { start: string; end: string };
    // ... other filters
  };
}

// Saving a view
const saveView = async (viewName: string, filters: GlobalFilters) => {
  await supabase.from('user_saved_views').insert({
    view_name: viewName,
    filter_config: {
      event_type_codes: filters.event_type_codes,  // ✅ Codes
      site_ids: filters.siteIds,
      date_range: filters.dateRange
    }
  });
};

// Loading a view
const loadView = async (viewId: string) => {
  const { data } = await supabase
    .from('user_saved_views')
    .select('filter_config')
    .eq('view_id', viewId)
    .single();
  
  // Codes are stable - this will work even if:
  // - Database was reseeded
  // - Labels were changed
  // - IDs are different
  setFilters({
    event_type_codes: data.filter_config.event_type_codes,
    // ...
  });
};
```

---

## 📊 **Migration Path**

### **Phase 1: Database (✅ Complete)**
- [x] Run migration 003
- [x] Add uniqueness constraints
- [x] Update views to expose codes
- [x] Create helper function
- [x] Add indexes

### **Phase 2: Frontend (🔄 Next)**
- [ ] Update GlobalFilters interface to use codes
- [ ] Update FunnelChart to use codes
- [ ] Update TimeToStepChart to use codes
- [ ] Update ComplianceChart (no event types, skip)
- [ ] Update saved views schema

### **Phase 3: Testing (🔄 After Phase 2)**
- [ ] Test filter functionality with codes
- [ ] Test saved views with codes
- [ ] Verify stability across environments
- [ ] Test label changes don't break logic

---

## 🧪 **Testing the Pattern**

### **Test 1: Code Stability**

```sql
-- Change a label
UPDATE ref_flow_event_types 
SET event_type_label = 'Initial Intake Completed'
WHERE event_type_code = 'intake_completed';

-- ✅ Frontend should still work (uses code, displays new label)
```

### **Test 2: Saved View Portability**

```sql
-- Export saved view from dev
SELECT filter_config FROM user_saved_views WHERE view_id = 'abc123';
-- Result: {"event_type_codes": ["intake_completed", "session_completed"]}

-- Import to prod (different IDs)
-- ✅ Should work because codes are stable
```

### **Test 3: i18n Readiness**

```typescript
// Change user language to Spanish
const getLabel = (code: string, lang: string) => {
  const labels = {
    'intake_completed': {
      'en': 'Intake Completed',
      'es': 'Admisión Completada'
    }
  };
  return labels[code][lang];
};

// ✅ Logic uses code, display uses localized label
```

---

## 📝 **Code Review Checklist**

When reviewing code, check:

- [ ] **Saved data uses codes, not IDs or labels**
- [ ] **Filters use codes for logic**
- [ ] **Labels are only used for display**
- [ ] **No hardcoded IDs in application code**
- [ ] **Helper function used to convert codes to IDs when needed**

---

## 🚨 **Common Mistakes to Avoid**

### **❌ Mistake 1: Storing IDs in saved views**
```typescript
// BAD
const savedView = {
  event_type_ids: [1, 2, 3]  // Breaks across environments
};
```

### **❌ Mistake 2: Using labels as keys**
```typescript
// BAD
if (event.label === 'Session Completed') {  // Breaks if label changes
  // ...
}
```

### **❌ Mistake 3: Changing codes**
```sql
-- BAD
UPDATE ref_flow_event_types 
SET event_type_code = 'new_code'  -- Breaks saved views!
WHERE event_type_code = 'old_code';
```

### **✅ Correct Patterns:**

```typescript
// GOOD - Use codes for logic
if (event.code === 'session_completed') {
  // ...
}

// GOOD - Display labels to users
<p>{event.label}</p>

// GOOD - Store codes in saved views
const savedView = {
  event_type_codes: ['intake_completed', 'session_completed']
};
```

---

## 🎯 **Summary**

**The Golden Rule:**
> **IDs are for the database. Codes are for humans and UI logic. Labels are for display.**

**Benefits:**
- ✅ Stable across environments
- ✅ Safe refactoring
- ✅ i18n ready
- ✅ Self-documenting
- ✅ Portable saved views

**Implementation:**
1. Database uses `event_type_id` for FKs
2. Views expose `event_type_code` + `event_type_label`
3. Frontend uses codes for logic, labels for display
4. Saved views store codes, not IDs

---

**Next Step:** Update frontend components to use codes instead of IDs/labels.
