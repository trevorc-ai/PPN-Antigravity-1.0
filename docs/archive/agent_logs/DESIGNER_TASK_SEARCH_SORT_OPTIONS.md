# Designer Task: Search Portal Sort Options

**Priority:** P2 - Feature Enhancement  
**Type:** UX Feature  
**Estimated Time:** 1 hour  
**Status:** Ready for Implementation

---

## 🎯 **User Request**

Add more sorting options to the Search Portal to help users organize research results.

---

## 📋 **Current State**

**Search Portal** (`SearchPortal.tsx`):
- ✅ Has filters (Setting, Substance, Efficacy)
- ✅ Has category tabs (All, Patients, Safety, Substances, Clinicians)
- ❌ **No sorting options** (results appear in default order)

**My Protocols** (from screenshot):
- Shows table with columns: Protocol Reference, Current Status, Dosage, Action
- Has search box but no visible sort controls

---

## 🎨 **Proposed Sort Options**

### **For Search Portal (Research Results)**

Add a sort dropdown next to "Research Results" header:

```
Research Results                           28 nodes    [Sort by: Relevance ▼]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Ketamine] [MDMA] [Psilocybin] [Patient] [Clinician] →
```

**Sort Options:**
1. **Relevance** (default) - based on search query match
2. **Efficacy (High to Low)** - for substances and patients
3. **Recent First** - newest protocols/records first
4. **Alphabetical (A-Z)** - by name
5. **Most Viewed** - if tracking is available
6. **Safety Events** - show protocols with adverse events first

### **For My Protocols Table**

Add sortable column headers (click to sort):

```
PROTOCOL REFERENCE ↕  CURRENT STATUS ↕  DOSAGE ↕  ACTION
```

**Features:**
- Click header to sort ascending
- Click again to sort descending
- Visual indicator (↑ ↓) showing current sort direction
- Remember last sort preference in localStorage

---

## 🛠️ **Implementation Plan**

### **Step 1: Add Sort State (5 min)**

```typescript
type SortOption = 'relevance' | 'efficacy' | 'recent' | 'alphabetical' | 'safety';

const [sortBy, setSortBy] = useState<SortOption>('relevance');
```

### **Step 2: Create Sort Dropdown Component (15 min)**

```typescript
const SortDropdown: React.FC<{ value: SortOption; onChange: (val: SortOption) => void }> = ({ value, onChange }) => {
  const options = [
    { value: 'relevance', label: 'Relevance', icon: 'auto_awesome' },
    { value: 'efficacy', label: 'Efficacy (High → Low)', icon: 'trending_up' },
    { value: 'recent', label: 'Recent First', icon: 'schedule' },
    { value: 'alphabetical', label: 'A → Z', icon: 'sort_by_alpha' },
    { value: 'safety', label: 'Safety Events', icon: 'warning' }
  ];

  return (
    <div className="relative">
      <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors">
        <span className="text-xs text-slate-400">Sort by:</span>
        <span className="text-xs font-medium text-white">{options.find(o => o.value === value)?.label}</span>
        <span className="material-symbols-outlined text-sm text-slate-500">expand_more</span>
      </button>
      {/* Dropdown menu */}
    </div>
  );
};
```

### **Step 3: Add Sort Logic (20 min)**

```typescript
const sortedResults = useMemo(() => {
  const allResults = [
    ...substanceResults.map(s => ({ ...s, type: 'substance' })),
    ...patientResults.map(p => ({ ...p, type: 'patient' })),
    ...clinicianResults.map(c => ({ ...c, type: 'clinician' }))
  ];

  switch (sortBy) {
    case 'efficacy':
      return allResults.sort((a, b) => {
        const aEff = a.type === 'substance' ? a.efficacy : (a.outcomes?.[0]?.score || 0);
        const bEff = b.type === 'substance' ? b.efficacy : (b.outcomes?.[0]?.score || 0);
        return bEff - aEff;
      });
    
    case 'recent':
      return allResults.sort((a, b) => {
        const aDate = new Date(a.created_at || a.protocol?.date || 0);
        const bDate = new Date(b.created_at || b.protocol?.date || 0);
        return bDate.getTime() - aDate.getTime();
      });
    
    case 'alphabetical':
      return allResults.sort((a, b) => {
        const aName = a.name || a.protocol?.substance || '';
        const bName = b.name || b.protocol?.substance || '';
        return aName.localeCompare(bName);
      });
    
    case 'safety':
      return allResults.sort((a, b) => {
        const aSafety = a.safetyEvents?.length || 0;
        const bSafety = b.safetyEvents?.length || 0;
        return bSafety - aSafety;
      });
    
    default: // relevance
      return allResults;
  }
}, [substanceResults, patientResults, clinicianResults, sortBy]);
```

### **Step 4: Update UI (10 min)**

Add sort dropdown to header:

```typescript
<div className="flex items-center justify-between mb-6">
  <h3 className="text-sm font-bold text-slate-400">Research Results</h3>
  <div className="flex items-center gap-4">
    <span className="text-xs text-slate-500">
      {substanceResults.length + patientResults.length + clinicianResults.length} nodes
    </span>
    <SortDropdown value={sortBy} onChange={setSortBy} />
  </div>
</div>
```

### **Step 5: Add Table Sorting (My Protocols) (15 min)**

```typescript
const [tableSortColumn, setTableSortColumn] = useState<'reference' | 'status' | 'dosage'>('reference');
const [tableSortDirection, setTableSortDirection] = useState<'asc' | 'desc'>('asc');

const handleHeaderClick = (column: string) => {
  if (tableSortColumn === column) {
    setTableSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  } else {
    setTableSortColumn(column);
    setTableSortDirection('asc');
  }
};

// Sortable header component
<th onClick={() => handleHeaderClick('reference')} className="cursor-pointer hover:bg-slate-800/50">
  <div className="flex items-center gap-2">
    Protocol Reference
    {tableSortColumn === 'reference' && (
      <span className="material-symbols-outlined text-xs">
        {tableSortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward'}
      </span>
    )}
  </div>
</th>
```

---

## 🎨 **Visual Design**

### **Sort Dropdown Styling:**
- Subtle background: `bg-slate-900/50`
- Border: `border-slate-800`
- Hover state: `hover:border-slate-700`
- Icon: Material Symbols `expand_more`
- Font size: `text-xs` for compact appearance

### **Table Sort Indicators:**
- Arrow icons: `arrow_upward` / `arrow_downward`
- Active column: slightly brighter text
- Hover state: `hover:bg-slate-800/50`

---

## 📊 **Expected Impact**

**User Benefits:**
- Faster discovery of relevant protocols
- Ability to prioritize by efficacy or safety
- Better organization of large result sets
- Improved research workflow

**UX Improvements:**
- More control over data presentation
- Reduced cognitive load (users can organize by preference)
- Professional research tool feel

---

## 🧪 **Testing Checklist**

- [ ] Sort dropdown appears next to "Research Results"
- [ ] All 5 sort options work correctly
- [ ] Sort persists during filter changes
- [ ] Table headers are clickable and show sort direction
- [ ] Sort direction toggles on repeated clicks
- [ ] Performance is acceptable with large datasets
- [ ] Mobile responsive (dropdown doesn't overflow)

---

## 📝 **Notes**

- **Keep it simple**: Don't add too many sort options (5 is good)
- **Visual consistency**: Use same styling as existing filters
- **Performance**: Use `useMemo` to avoid re-sorting on every render
- **Accessibility**: Ensure keyboard navigation works

---

**Status:** Ready for Designer  
**Blocked By:** None  
**Estimated Time:** 1 hour  
**Last Updated:** 2026-02-12 03:26 PST
