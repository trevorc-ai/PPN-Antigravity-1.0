# 🔨 BUILDER: Protocol Table Columns Implementation
**Task:** Add Priority 1 columns to My Protocols table  
**File:** `src/pages/ProtocolBuilder.tsx`  
**Estimated Time:** 45 minutes

---

## Implementation Checklist

### **Step 1: Add Table Headers (5 minutes)**

**Location:** Line ~288-292 (table `<thead>`)

**Current:**
```tsx
<tr className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-800/50">
  <th className="px-8 py-6">Protocol Reference</th>
  <th className="px-8 py-6">Current Status</th>
  <th className="px-8 py-6">Dosage</th>
  <th className="px-8 py-6 text-right">Action</th>
</tr>
```

**Change to:**
```tsx
<tr className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-800/50">
  <th className="px-8 py-6">Protocol Reference</th>
  <th className="px-8 py-6">Subject</th>
  <th className="px-8 py-6">Created</th>
  <th className="px-8 py-6">Current Status</th>
  <th className="px-8 py-6">Outcome</th>
  <th className="px-8 py-6">Dosage</th>
  <th className="px-8 py-6 text-right">Action</th>
</tr>
```

---

### **Step 2: Add Table Data Cells (30 minutes)**

**Location:** Line ~296-320 (table `<tbody>` row)

**Current structure:**
```tsx
<tr key={p.id} className="hover:bg-primary/5 transition-colors group">
  <td className="px-8 py-6">{/* Protocol Reference */}</td>
  <td className="px-8 py-6">{/* Current Status */}</td>
  <td className="px-8 py-6">{/* Dosage */}</td>
  <td className="px-8 py-6">{/* Action */}</td>
</tr>
```

**Add these new `<td>` cells:**

#### **A. Subject Cell (after Protocol Reference)**
```tsx
{/* Subject (Age/Sex) */}
<td className="px-8 py-6">
  <span className="text-sm font-mono font-black text-slate-400">
    {p.subject_age || '?'}{p.subject_sex?.charAt(0) || '?'}
  </span>
</td>
```

#### **B. Created Date Cell (after Subject)**
```tsx
{/* Created Date */}
<td className="px-8 py-6">
  <div className="flex flex-col">
    <span className="text-sm font-bold text-slate-300">
      {p.created_at ? new Date(p.created_at).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }) : 'N/A'}
    </span>
    <span className="text-[10px] text-slate-600 font-mono">
      {p.created_at ? formatRelativeTime(p.created_at) : ''}
    </span>
  </div>
</td>
```

#### **C. Outcome Score Cell (after Current Status)**
```tsx
{/* Outcome Score */}
<td className="px-8 py-6">
  {p.outcome_score !== undefined && p.outcome_score !== null ? (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${
        p.outcome_score >= 7 ? 'bg-clinical-green shadow-[0_0_4px_#53d22d]' :
        p.outcome_score >= 4 ? 'bg-amber-500 shadow-[0_0_4px_#f59e0b]' :
        'bg-red-500 shadow-[0_0_4px_#ef4444]'
      }`}></div>
      <span className={`text-sm font-bold ${
        p.outcome_score >= 7 ? 'text-clinical-green' :
        p.outcome_score >= 4 ? 'text-amber-400' :
        'text-red-400'
      }`}>
        {p.outcome_score}/10
      </span>
    </div>
  ) : (
    <span className="text-[11px] text-slate-700 font-mono">—</span>
  )}
</td>
```

---

### **Step 3: Add Helper Function (5 minutes)**

**Location:** Add near top of component (after imports, before ProtocolBuilder component)

```tsx
// Helper function to format relative time
const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
};
```

---

### **Step 4: Update Data Adapter (5 minutes)**

**Location:** Line ~162-171 (fetchProtocols function)

**Current:**
```tsx
const adapted = (data || []).map((r: any) => ({
  id: r.patient_link_code || r.clinical_record_id,
  siteId: r.site_id || 'Remote',
  status: 'Active',
  protocol: {
    substance: r.ref_substances?.substance_name || 'Unknown',
    dosage: 'Standard',
    dosageUnit: ''
  }
}));
```

**Change to:**
```tsx
const adapted = (data || []).map((r: any) => ({
  id: r.patient_link_code || r.clinical_record_id,
  siteId: r.site_id || 'Remote',
  status: 'Active',
  protocol: {
    substance: r.ref_substances?.substance_name || 'Unknown',
    dosage: 'Standard',
    dosageUnit: ''
  },
  // NEW FIELDS
  subject_age: r.subject_age || null,
  subject_sex: r.subject_sex || null,
  created_at: r.created_at || null,
  outcome_score: r.outcome_score || null
}));
```

---

### **Step 5: Update Supabase Query (Optional - if data missing)**

**Location:** Line ~153-157

**Current:**
```tsx
const { data, error } = await supabase
  .from('log_clinical_records')
  .select('*, ref_substances ( substance_name )')
  .eq('created_by', user.id)
  .order('created_at', { ascending: false });
```

**If needed, ensure these columns are selected:**
```tsx
const { data, error } = await supabase
  .from('log_clinical_records')
  .select(`
    *,
    ref_substances ( substance_name ),
    subject_age,
    subject_sex,
    created_at,
    outcome_score
  `)
  .eq('created_by', user.id)
  .order('created_at', { ascending: false });
```

**Note:** The `*` should already include these fields, but this makes it explicit.

---

## Final Table Structure

```tsx
<table className="w-full text-left">
  <thead>
    <tr className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-800/50">
      <th className="px-8 py-6">Protocol Reference</th>
      <th className="px-8 py-6">Subject</th>
      <th className="px-8 py-6">Created</th>
      <th className="px-8 py-6">Current Status</th>
      <th className="px-8 py-6">Outcome</th>
      <th className="px-8 py-6">Dosage</th>
      <th className="px-8 py-6 text-right">Action</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-slate-800/30">
    {filteredProtocols.map((p) => (
      <tr key={p.id} className="hover:bg-primary/5 transition-colors group">
        {/* 1. Protocol Reference */}
        <td className="px-8 py-6">
          <div className="flex flex-col">
            <span className="text-base font-black text-slate-200 leading-tight">
              {p.protocol.substance} Protocol
            </span>
            <span className="text-[11px] font-mono text-slate-500 font-bold tracking-tight mt-1">
              {p.id} • {p.siteId}
            </span>
          </div>
        </td>

        {/* 2. Subject (NEW) */}
        <td className="px-8 py-6">
          <span className="text-sm font-mono font-black text-slate-400">
            {p.subject_age || '?'}{p.subject_sex?.charAt(0) || '?'}
          </span>
        </td>

        {/* 3. Created Date (NEW) */}
        <td className="px-8 py-6">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-300">
              {p.created_at ? new Date(p.created_at).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              }) : 'N/A'}
            </span>
            <span className="text-[10px] text-slate-600 font-mono">
              {p.created_at ? formatRelativeTime(p.created_at) : ''}
            </span>
          </div>
        </td>

        {/* 4. Current Status */}
        <td className="px-8 py-6">
          <div className="flex items-center gap-2">
            <div className={`size-1.5 rounded-full ${
              p.status === 'Completed' ? 'bg-clinical-green' : 
              p.status === 'Active' ? 'bg-primary' : 
              'bg-slate-500'
            }`}></div>
            <span className={`text-[11px] font-black uppercase tracking-widest ${
              p.status === 'Completed' ? 'text-clinical-green' : 'text-slate-500'
            }`}>
              {p.status}
            </span>
          </div>
        </td>

        {/* 5. Outcome Score (NEW) */}
        <td className="px-8 py-6">
          {p.outcome_score !== undefined && p.outcome_score !== null ? (
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                p.outcome_score >= 7 ? 'bg-clinical-green shadow-[0_0_4px_#53d22d]' :
                p.outcome_score >= 4 ? 'bg-amber-500 shadow-[0_0_4px_#f59e0b]' :
                'bg-red-500 shadow-[0_0_4px_#ef4444]'
              }`}></div>
              <span className={`text-sm font-bold ${
                p.outcome_score >= 7 ? 'text-clinical-green' :
                p.outcome_score >= 4 ? 'text-amber-400' :
                'text-red-400'
              }`}>
                {p.outcome_score}/10
              </span>
            </div>
          ) : (
            <span className="text-[11px] text-slate-700 font-mono">—</span>
          )}
        </td>

        {/* 6. Dosage */}
        <td className="px-8 py-6 text-sm font-mono text-slate-400">
          {p.protocol.dosage} {p.protocol.dosageUnit}
        </td>

        {/* 7. Action */}
        <td className="px-8 py-6 text-right">
          <button
            onClick={() => navigate(`/protocol/${p.id}`)}
            className="text-[11px] font-black text-primary hover:text-white uppercase tracking-widest transition-colors flex items-center justify-end gap-2 ml-auto"
          >
            Open Protocol
            <ChevronRight className="size-4" />
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
```

---

## Testing Checklist

After implementation, verify:

- [ ] **Table renders** without errors
- [ ] **All 7 columns** display correctly
- [ ] **Subject column** shows age + sex (e.g., "42M")
- [ ] **Created date** shows formatted date + relative time
- [ ] **Outcome score** shows color-coded dot + score
- [ ] **Outcome colors** are correct:
  - Green (7-10)
  - Yellow (4-6)
  - Red (0-3)
- [ ] **Relative time** updates correctly ("2h ago", "Yesterday", etc.)
- [ ] **Missing data** shows gracefully (?, N/A, —)
- [ ] **Hover states** work on table rows
- [ ] **"Open Protocol" button** still functions

---

## Potential Issues & Solutions

### **Issue 1: Missing Data Fields**
**Symptom:** Columns show "?" or "N/A" for all rows  
**Solution:** Check if `log_clinical_records` table has these columns:
- `subject_age`
- `subject_sex`
- `created_at`
- `outcome_score`

If missing, add them via migration or update seed data.

---

### **Issue 2: Date Formatting Error**
**Symptom:** "Invalid Date" or blank dates  
**Solution:** Add null check:
```tsx
{p.created_at ? new Date(p.created_at).toLocaleDateString(...) : 'N/A'}
```

---

### **Issue 3: Table Too Wide**
**Symptom:** Horizontal scroll on smaller screens  
**Solution:** Add responsive classes to hide columns on mobile:
```tsx
<th className="px-8 py-6 hidden md:table-cell">Subject</th>
<th className="px-8 py-6 hidden lg:table-cell">Created</th>
```

---

## Files to Modify

1. **`src/pages/ProtocolBuilder.tsx`** (primary file)
   - Add `formatRelativeTime` helper function
   - Update table headers
   - Add new table cells
   - Update data adapter

---

## Estimated Time Breakdown

- Step 1 (Headers): 5 minutes
- Step 2 (Data cells): 30 minutes
- Step 3 (Helper function): 5 minutes
- Step 4 (Data adapter): 5 minutes
- Step 5 (Query - optional): 5 minutes
- **Total:** 45-50 minutes

---

**Ready to implement. No other changes required.**
