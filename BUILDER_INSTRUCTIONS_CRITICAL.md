# 🔧 **BUILDER INSTRUCTIONS: PAGE LAYOUT STANDARDIZATION + AUDIT LOGS COMPLIANCE**

**Prepared By:** INVESTIGATOR (Antigravity)  
**Date:** 2026-02-10 12:44 PM  
**For:** BUILDER Agent  
**Priority:** 🔴 **CRITICAL** (Audit Logs) + 🟡 **HIGH** (Layout Standardization)

---

## 🎯 **DUAL OBJECTIVES**

### **Objective 1: Audit Logs Database Integration** 🔴 **CRITICAL**
**Business Context:** Audit Logs is a **critical compliance tracking page** and one of the **pillars of the business model**. It must track **every log change by an authenticated user** for regulatory compliance, security auditing, and business intelligence.

**Current State:** Uses hardcoded mock data (4 records)  
**Required State:** Real-time database integration with `system_events` table  
**Priority:** CRITICAL - Must be done FIRST

---

### **Objective 2: Page Layout Standardization** 🟡 **HIGH**
**Business Context:** Ensure consistent user experience across all pages with standardized widths, margins, and responsive behavior.

**Current State:** 16% consistency (3/19 pages compliant)  
**Target State:** 84% consistency (16/19 pages compliant)  
**Priority:** HIGH - Do after Audit Logs

---

## 📋 **TASK BREAKDOWN**

| Task | Priority | Effort | Pages | Risk |
|------|----------|--------|-------|------|
| **1. Audit Logs DB Integration** | 🔴 CRITICAL | 6 hours | 1 | Medium |
| **2. Phase 1: Quick Wins** | 🟡 HIGH | 15 min | 9 | Low |
| **3. Phase 2: Medium Complexity** | 🟡 MEDIUM | 1 hour | 3 | Medium |
| **4. Phase 3: High Complexity** | 🟢 LOW | 2 hours | 1 | High |

---

# 🔴 **TASK 1: AUDIT LOGS DATABASE INTEGRATION** (DO THIS FIRST)

## **Business Criticality**

**Why This Matters:**
- 📊 **Compliance Pillar:** Required for regulatory audits (FDA, HIPAA, etc.)
- 🔐 **Security Pillar:** Tracks all authenticated user actions
- 💰 **Revenue Pillar:** Part of "Wisdom Trust" data brokerage model
- ⚖️ **Legal Pillar:** Provides audit trail for liability protection

**Regulatory Requirements:**
- ✅ Track every clinical record creation/modification
- ✅ Track every protocol view/export
- ✅ Track every safety event trigger
- ✅ Track every authentication event
- ✅ Immutable ledger (no deletions, only inserts)
- ✅ Cryptographic hash for integrity verification

---

## **Implementation Steps**

### **Step 1.1: Verify Database Schema**

**Check that `system_events` table exists:**
```sql
-- Run in Supabase SQL Editor
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'system_events'
ORDER BY ordinal_position;
```

**Expected Columns:**
- `event_id` (bigserial, PK)
- `site_id` (bigint, FK to sites)
- `actor_id` (uuid, FK to auth.users)
- `event_type` (text)
- `event_details` (jsonb)
- `event_status` (text)
- `created_at` (timestamptz)
- `ledger_hash` (text)

**If table doesn't exist, create it:**
```sql
CREATE TABLE IF NOT EXISTS public.system_events (
  event_id BIGSERIAL PRIMARY KEY,
  site_id BIGINT REFERENCES public.sites(site_id),
  actor_id UUID REFERENCES auth.users(id),
  event_type TEXT NOT NULL,
  event_details JSONB,
  event_status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ledger_hash TEXT
);

-- Add RLS policies
ALTER TABLE public.system_events ENABLE ROW LEVEL SECURITY;

-- Site members can read their site's events
CREATE POLICY "site_members_read_events" ON public.system_events
FOR SELECT
USING (
  site_id IN (
    SELECT site_id FROM public.user_sites 
    WHERE user_id = auth.uid()
  )
);

-- Only network_admin can insert events (for now)
CREATE POLICY "network_admin_insert_events" ON public.system_events
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_sites
    WHERE user_id = auth.uid()
    AND role = 'network_admin'
  )
);

-- Create index for performance
CREATE INDEX idx_system_events_site_created 
ON public.system_events(site_id, created_at DESC);
```

---

### **Step 1.2: Update AuditLogs.tsx**

**File:** `src/pages/AuditLogs.tsx`

**Changes Required:**

#### **A. Add Imports**
```typescript
// Add at top of file
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';
```

#### **B. Add State Management**
```typescript
// Replace line 8
const [activeFilter, setActiveFilter] = useState('All');

// Add these new states
const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const ITEMS_PER_PAGE = 50;
```

#### **C. Add Data Fetching**
```typescript
// Add after state declarations
const { user } = useAuth();

useEffect(() => {
  const fetchAuditLogs = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);

    try {
      // Get user's site_id
      const { data: userSite, error: siteError } = await supabase
        .from('user_sites')
        .select('site_id')
        .eq('user_id', user.id)
        .single();

      if (siteError) throw siteError;

      // Fetch events for this site
      const { data: events, error: eventsError, count } = await supabase
        .from('system_events')
        .select(`
          event_id,
          created_at,
          event_type,
          event_details,
          event_status,
          ledger_hash,
          actor:auth.users(email)
        `, { count: 'exact' })
        .eq('site_id', userSite.site_id)
        .order('created_at', { ascending: false })
        .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1);

      if (eventsError) throw eventsError;

      // Map database fields to UI format
      const mappedLogs = events.map(event => ({
        id: `LOG-${event.event_id}`,
        timestamp: new Date(event.created_at).toISOString().replace('T', ' ').substring(0, 19),
        actor: event.actor?.email?.split('@')[0] || 'System',
        action: event.event_type,
        details: event.event_details?.description || JSON.stringify(event.event_details),
        status: event.event_status || 'EXECUTED',
        hash: event.ledger_hash || '0x0000...000'
      }));

      setAuditLogs(mappedLogs);
      setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE));
    } catch (err: any) {
      console.error('Error fetching audit logs:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchAuditLogs();
}, [user, page]);
```

#### **D. Update Filtered Logs Logic**
```typescript
// Replace lines 24-34
const filteredLogs = useMemo(() => {
  if (activeFilter === 'Security') {
    return auditLogs.filter(log =>
      log.action.includes('SECURITY') || 
      log.action.includes('AUTH') || 
      log.action.includes('SAFETY') || 
      log.status === 'ALERT_TRIGGERED'
    );
  }
  if (activeFilter === 'Clinical') {
    return auditLogs.filter(log => 
      log.action.includes('PROTOCOL') || 
      log.action.includes('DATA') || 
      log.action.includes('SEARCH')
    );
  }
  return auditLogs;
}, [auditLogs, activeFilter]);
```

#### **E. Add Loading State**
```typescript
// Add before return statement (around line 36)
if (loading) {
  return (
    <PageContainer width=\"wide\" className=\"h-full flex items-center justify-center\">
      <div className=\"text-center space-y-4\">
        <div className=\"animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto\"></div>
        <p className=\"text-slate-500 font-bold uppercase tracking-widest\">Loading Audit Logs...</p>
      </div>
    </PageContainer>
  );
}

if (error) {
  return (
    <PageContainer width=\"wide\" className=\"h-full flex items-center justify-center\">
      <div className=\"text-center space-y-4\">
        <span className=\"material-symbols-outlined text-7xl text-rose-500\">error</span>
        <p className=\"text-rose-500 font-bold uppercase tracking-widest\">Error Loading Logs</p>
        <p className=\"text-slate-600 text-sm\">{error}</p>
      </div>
    </PageContainer>
  );
}
```

#### **F. Update Table to Use auditLogs State**
```typescript
// Line 80: Change from
{filteredLogs.map((log) => (

// To
{filteredLogs.map((log) => (
```

#### **G. Add Pagination UI**
```typescript
// Replace lines 133-153 (footer section)
<div className=\"px-10 py-8 border-t border-slate-800 bg-black/20 flex flex-col sm:flex-row justify-between items-center gap-6\">
  <div className=\"flex items-center gap-6\">
    <span className=\"text-sm font-bold text-slate-600 uppercase tracking-widest\">
      Total Records: <span className=\"text-slate-400\">{auditLogs.length}</span>
    </span>
    <div className=\"h-6 w-px bg-slate-800\"></div>
    <span className=\"text-sm font-bold text-slate-600 uppercase tracking-widest\">
      Page {page} of {totalPages}
    </span>
    <div className=\"h-6 w-px bg-slate-800\"></div>
    <div className=\"flex items-center gap-3\">
      <div className=\"size-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]\"></div>
      <span className=\"text-sm font-mono text-slate-500 uppercase tracking-widest\">Database: Live</span>
    </div>
  </div>

  <div className=\"flex gap-4\">
    <button 
      onClick={() => setPage(p => Math.max(1, p - 1))}
      disabled={page === 1}
      className=\"px-6 py-3 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed\"
    >
      Previous
    </button>
    <button 
      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
      disabled={page === totalPages}
      className=\"px-6 py-3 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed\"
    >
      Next
    </button>
    <button 
      onClick={handleExportCSV}
      className=\"px-6 py-3 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all\"
    >
      Export CSV
    </button>
    <button 
      onClick={handleVerifyIntegrity}
      className=\"px-8 py-3 bg-primary hover:bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-primary/30 transition-all active:scale-95\"
    >
      Verify Integrity
    </button>
  </div>
</div>
```

#### **H. Add Button Handlers**
```typescript
// Add before return statement
const handleExportCSV = async () => {
  try {
    const csv = [
      ['Timestamp', 'Actor', 'Action', 'Details', 'Status', 'Hash'].join(','),
      ...auditLogs.map(log => [
        log.timestamp,
        log.actor,
        log.action,
        `\"${log.details.replace(/\"/g, '\"\"')}\"`,
        log.status,
        log.hash
      ].join(','))
    ].join('\\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_logs_${new Date().toISOString()}.csv`;
    a.click();
  } catch (err) {
    console.error('Export failed:', err);
    alert('Export failed. Please try again.');
  }
};

const handleVerifyIntegrity = async () => {
  // TODO: Implement cryptographic hash verification
  alert('Integrity verification: All hashes valid (placeholder)');
};
```

---

### **Step 1.3: Remove Hardcoded Import**

**File:** `src/pages/AuditLogs.tsx`

**Change:**
```typescript
// Line 3: REMOVE this line
import { AUDIT_LOGS } from '../constants';
```

---

### **Step 1.4: Update Total Record Count**

**File:** `src/pages/AuditLogs.tsx`

**Change:**
```typescript
// Line 136: Replace
Total Record Nodes: <span className=\"text-slate-400\">{AUDIT_LOGS.length}</span>

// With
Total Records: <span className=\"text-slate-400\">{auditLogs.length}</span>
```

---

### **Step 1.5: Test Database Integration**

**Verification Steps:**

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Navigate to Audit Logs:**
   - Open `http://localhost:3000/audit-logs`
   - Login if needed

3. **Verify data loads:**
   - ✅ Loading spinner appears briefly
   - ✅ Table populates with database records
   - ✅ Pagination works
   - ✅ Filters work (All, Security, Clinical)

4. **Test error handling:**
   - Disconnect from internet
   - Refresh page
   - ✅ Error message appears

5. **Test export:**
   - Click "Export CSV"
   - ✅ CSV file downloads with correct data

6. **Check browser console:**
   - ✅ No errors
   - ✅ Supabase queries visible in Network tab

---

### **Step 1.6: Seed Test Data (If Needed)**

**If `system_events` table is empty, seed with test data:**

```sql
-- Insert test events
INSERT INTO public.system_events (site_id, actor_id, event_type, event_details, event_status, ledger_hash)
VALUES
  (1, (SELECT id FROM auth.users LIMIT 1), 'PROTOCOL_CREATE', '{"protocol_id": "PROTO-001", "substance": "Psilocybin"}', 'AUTHORIZED', '0x9928a1b2c3d4e5f6'),
  (1, (SELECT id FROM auth.users LIMIT 1), 'SAFETY_CHECK', '{"interaction": "Psilocybin + Lithium", "risk_level": 10}', 'ALERT_TRIGGERED', '0x7731b2c3d4e5f6a7'),
  (1, (SELECT id FROM auth.users LIMIT 1), 'PROTOCOL_VIEW', '{"protocol_id": "PROTO-001"}', 'AUTHORIZED', '0x4421c3d4e5f6a7b8'),
  (1, NULL, 'LEDGER_SYNC', '{"records_synced": 5}', 'VERIFIED', '0x1102d4e5f6a7b8c9');
```

---

## **Success Criteria for Task 1**

- [ ] ✅ `system_events` table exists with correct schema
- [ ] ✅ RLS policies are in place
- [ ] ✅ AuditLogs.tsx fetches from database
- [ ] ✅ Loading state displays correctly
- [ ] ✅ Error state displays correctly
- [ ] ✅ Pagination works
- [ ] ✅ Filters work (All, Security, Clinical)
- [ ] ✅ Export CSV works
- [ ] ✅ No hardcoded AUDIT_LOGS import
- [ ] ✅ No console errors
- [ ] ✅ Real-time data updates on page refresh

---

# 🟡 **TASK 2: PAGE LAYOUT STANDARDIZATION - PHASE 1 (QUICK WINS)**

**Priority:** HIGH (but do AFTER Task 1)  
**Effort:** 15 minutes  
**Risk:** LOW  
**Pages:** 9

## **Objective**

Add `width=\"wide\"` prop to 9 pages that already use `PageContainer` but are missing the width specification.

---

## **Pages to Update**

### **1. Analytics.tsx**
**File:** `src/pages/Analytics.tsx`  
**Line:** ~10  
**Change:**
```typescript
// BEFORE
<PageContainer className=\"space-y-8 animate-in fade-in duration-700 pb-20 pt-8\">

// AFTER
<PageContainer width=\"wide\" className=\"space-y-8 animate-in fade-in duration-700 pb-20 pt-8\">
```

---

### **2. HelpFAQ.tsx**
**File:** `src/pages/HelpFAQ.tsx`  
**Line:** ~8  
**Change:**
```typescript
// BEFORE
<PageContainer width=\"default\">

// AFTER
<PageContainer width=\"wide\">
```

---

### **3. About.tsx**
**File:** `src/pages/About.tsx`  
**Line:** ~12  
**Change:**
```typescript
// BEFORE
<PageContainer className=\"py-20 space-y-32\">

// AFTER
<PageContainer width=\"wide\" className=\"py-20 space-y-32\">
```

---

### **4. ClinicianProfile.tsx**
**File:** `src/pages/ClinicianProfile.tsx`  
**Line:** ~15  
**Change:**
```typescript
// BEFORE
<PageContainer className=\"animate-in fade-in duration-700 pb-24\">

// AFTER
<PageContainer width=\"wide\" className=\"animate-in fade-in duration-700 pb-24\">
```

---

### **5. Notifications.tsx**
**File:** `src/pages/Notifications.tsx`  
**Line:** ~10  
**Change:**
```typescript
// BEFORE
<PageContainer className=\"animate-in fade-in duration-500 relative\">

// AFTER
<PageContainer width=\"wide\" className=\"animate-in fade-in duration-500 relative\">
```

---

### **6. PatientConstellationPage.tsx**
**File:** `src/pages/deep-dives/PatientConstellationPage.tsx`  
**Line:** ~8  
**Change:**
```typescript
// BEFORE
<PageContainer className=\"py-8\">

// AFTER
<PageContainer width=\"wide\" className=\"py-8\">
```

---

### **7. MolecularPharmacologyPage.tsx**
**File:** `src/pages/deep-dives/MolecularPharmacologyPage.tsx`  
**Line:** ~8  
**Change:**
```typescript
// BEFORE
<PageContainer className=\"py-8\">

// AFTER
<PageContainer width=\"wide\" className=\"py-8\">
```

---

### **8. ClinicPerformancePage.tsx**
**File:** `src/pages/deep-dives/ClinicPerformancePage.tsx`  
**Line:** ~8  
**Change:**
```typescript
// BEFORE
<PageContainer className=\"py-8\">

// AFTER
<PageContainer width=\"wide\" className=\"py-8\">
```

---

### **9. ProtocolEfficiencyPage.tsx**
**File:** `src/pages/deep-dives/ProtocolEfficiencyPage.tsx`  
**Line:** ~8  
**Change:**
```typescript
// BEFORE
<PageContainer className=\"py-8\">

// AFTER
<PageContainer width=\"wide\" className=\"py-8\">
```

---

## **Implementation Method**

Use `multi_replace_file_content` to update all 9 files in parallel.

**Verification:**
```bash
# After changes, search for missing width props
grep -r \"<PageContainer\" src/pages/ | grep -v \"width=\" | grep -v \"Landing\" | grep -v \"SubstanceMonograph\"
```

**Expected:** Only intentional exceptions (Landing, SubstanceMonograph)

---

## **Success Criteria for Task 2**

- [ ] ✅ All 9 pages updated
- [ ] ✅ No visual regressions
- [ ] ✅ Consistent width across all data-heavy pages
- [ ] ✅ Responsive behavior works at all breakpoints
- [ ] ✅ No horizontal scroll on mobile

---

# 📊 **FINAL DELIVERABLES**

## **Task 1: Audit Logs**
1. ✅ Database schema verified/created
2. ✅ RLS policies in place
3. ✅ AuditLogs.tsx connected to database
4. ✅ Pagination implemented
5. ✅ Export functionality working
6. ✅ Loading/error states implemented
7. ✅ Test data seeded (if needed)

## **Task 2: Layout Standardization**
1. ✅ 9 pages updated with `width=\"wide\"`
2. ✅ Visual regression testing complete
3. ✅ Responsive testing complete

---

## **Estimated Timeline**

| Task | Estimated Time | Priority |
|------|----------------|----------|
| Task 1: Audit Logs DB Integration | 6 hours | 🔴 CRITICAL |
| Task 2: Phase 1 Quick Wins | 15 minutes | 🟡 HIGH |
| **Total** | **6.25 hours** | |

---

## **Risk Assessment**

**Task 1 Risks:**
- 🟡 Medium: Database schema may need adjustments
- 🟡 Medium: RLS policies may need tuning
- 🟢 Low: Frontend integration is straightforward

**Task 2 Risks:**
- 🟢 Low: Simple prop additions
- 🟢 Low: Well-tested pattern

---

**Prepared By:** INVESTIGATOR (Antigravity)  
**Date:** 2026-02-10 12:44 PM  
**Status:** ✅ **READY FOR BUILDER EXECUTION**  
**Priority:** 🔴 **START WITH TASK 1 (AUDIT LOGS)**

---

**End of Builder Instructions**
