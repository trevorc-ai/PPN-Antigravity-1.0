# 🚀 BATCH 4: DEEP DIVE PAGES
**Time Estimate:** 90 minutes  
**Risk Level:** LOW  
**Files to Modify:** 6 files (1 new, 5 existing)  
**Impact:** HIGH - Consistent layout across all deep dive pages

---

## 📋 **WHAT THIS BATCH DOES**

This batch standardizes all deep dive pages with consistent layout and simplified copy:

✅ Creates reusable DeepDiveLayout component  
✅ Updates 5 deep dive pages to use wide layout  
✅ Increases subheading size and width  
✅ Simplifies all descriptions to 9th grade reading level  

---

## 🎯 **TASK LIST (6 TASKS)**

### **TASK 4.1: Create DeepDiveLayout Component** ⭐ DO FIRST
**File:** `src/components/layouts/DeepDiveLayout.tsx` (NEW FILE)  
**Time:** 20 minutes  
**Complexity:** MEDIUM

**Create this new file with the following code:**

```tsx
import React, { ReactNode } from 'react';
import { PageContainer } from './PageContainer';
import { Section } from './Section';
import ConnectFeedButton from '../ui/ConnectFeedButton';

interface DeepDiveLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  headerAction?: ReactNode;
}

export const DeepDiveLayout: React.FC<DeepDiveLayoutProps> = ({
  title,
  description,
  children,
  headerAction
}) => {
  return (
    <div className="min-h-screen bg-[#05070a] text-white flex flex-col">
      {/* Page Header */}
      <div className="border-b border-slate-900 bg-[#0B0E14] w-full">
        <PageContainer width="wide" className="py-8 sm:py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-5xl sm:text-6xl font-black tracking-tighter text-white mb-2">
                {title}
              </h1>
              <p className="text-slate-300 text-lg sm:text-xl font-medium max-w-5xl leading-relaxed">
                {description}
              </p>
            </div>
            <div>
              {headerAction || <ConnectFeedButton />}
            </div>
          </div>
        </PageContainer>
      </div>

      {/* Content Area */}
      <PageContainer width="wide" className="flex-1 py-10">
        <Section spacing="spacious">
          {children}
        </Section>
      </PageContainer>
    </div>
  );
};
```

**Why:** This component provides consistent layout for all deep dive pages (matches Regulatory Map).

---

### **TASK 4.2: Update Patient Outcomes Map Page**
**File:** `src/pages/deep-dives/PatientOutcomesMapPage.tsx`  
**Time:** 15 minutes  
**Complexity:** MEDIUM

**Replace the entire file with:**

```tsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ClipboardList, ChevronRight } from 'lucide-react';
import { SAMPLE_INTERVENTION_RECORDS } from '../../constants';
import PatientConstellationComponent from '../../components/analytics/PatientConstellation';
import { DeepDiveLayout } from '../../components/layouts/DeepDiveLayout';

const PatientOutcomesMap: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const filteredProtocols = useMemo(() => {
    return SAMPLE_INTERVENTION_RECORDS.filter((p: any) =>
      p.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.protocol?.substance?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.siteId?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <DeepDiveLayout
      title="Patient Outcomes Map"
      description="See how patients respond to treatment. Each dot is one patient. Find patterns in who gets better and why."
    >
      <div className="mt-8">
        <PatientConstellationComponent />
      </div>

      {/* Filterable Table Section */}
      <div className="mt-12 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-white tracking-tight">Active Protocols</h2>
          <div className="relative group w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search protocols, IDs, or substances..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 bg-slate-900/50 border border-slate-800 rounded-xl pl-12 pr-6 text-sm font-bold text-white focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-slate-600"
            />
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-800/50">
                  <th className="px-8 py-6">Protocol Reference</th>
                  <th className="px-8 py-6">Current Status</th>
                  <th className="px-8 py-6">Dosage</th>
                  <th className="px-8 py-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/30">
                {filteredProtocols.map((p) => (
                  <tr key={p.id} className="hover:bg-primary/5 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-base font-black text-white leading-tight">{p.protocol.substance} Protocol</span>
                        <span className="text-[11px] font-mono text-slate-500 font-bold tracking-tight mt-1">{p.id} • {p.siteId}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className={`size-1.5 rounded-full ${p.status === 'Completed' ? 'bg-clinical-green' : p.status === 'Active' ? 'bg-primary' : 'bg-slate-500'}`}></div>
                        <span className={`text-[11px] font-black uppercase tracking-widest ${p.status === 'Completed' ? 'text-clinical-green' : 'text-slate-500'}`}>{p.status}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm font-mono text-slate-400">{p.protocol.dosage} {p.protocol.dosageUnit}</td>
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
          </div>
          {filteredProtocols.length === 0 && (
            <div className="py-20 text-center space-y-4">
              <ClipboardList className="mx-auto text-slate-800" size={48} />
              <p className="text-slate-600 font-black uppercase tracking-widest text-[11px]">Zero Protocol Matches Found</p>
            </div>
          )}
        </div>
      </div>
    </DeepDiveLayout>
  );
};

export default PatientOutcomesMap;
```

**Key Changes:**
- Uses `DeepDiveLayout` component
- Simplified description (9th grade level)
- Wide layout (matches Regulatory Map)

---

### **TASK 4.3: Update Molecular Pharmacology Page**
**File:** `src/pages/deep-dives/MolecularPharmacologyPage.tsx`  
**Time:** 10 minutes  
**Complexity:** LOW

**Replace the entire file with:**

```tsx
import React from 'react';
import MolecularPharmacology from '../../components/analytics/MolecularPharmacology';
import { DeepDiveLayout } from '../../components/layouts/DeepDiveLayout';

const MolecularPharmacologyPage = () => {
  return (
    <DeepDiveLayout
      title="Molecular Pharmacology"
      description="Learn how psychedelic drugs work in the brain. See which receptors they bind to and what effects they cause."
    >
      <div className="mt-8">
        <MolecularPharmacology />
      </div>
    </DeepDiveLayout>
  );
};

export default MolecularPharmacologyPage;
```

---

### **TASK 4.4: Update Protocol Efficiency Page**
**File:** `src/pages/deep-dives/ProtocolEfficiencyPage.tsx`  
**Time:** 10 minutes  
**Complexity:** LOW

**Replace the entire file with:**

```tsx
import React from 'react';
import ProtocolEfficiency from '../../components/analytics/ProtocolEfficiency';
import { DeepDiveLayout } from '../../components/layouts/DeepDiveLayout';

const ProtocolEfficiencyPage = () => {
  return (
    <DeepDiveLayout
      title="Protocol Efficiency"
      description="Compare treatment costs and results. Find which protocols give the best outcomes for your budget."
    >
      <div className="mt-8">
        <ProtocolEfficiency />
      </div>
    </DeepDiveLayout>
  );
};

export default ProtocolEfficiencyPage;
```

---

### **TASK 4.5: Update Clinic Performance Page**
**File:** `src/pages/deep-dives/ClinicPerformancePage.tsx`  
**Time:** 10 minutes  
**Complexity:** LOW

**Replace the entire file with:**

```tsx
import React from 'react';
import ClinicPerformanceRadar from '../../components/analytics/ClinicPerformanceRadar';
import { DeepDiveLayout } from '../../components/layouts/DeepDiveLayout';

const ClinicPerformancePage = () => {
  return (
    <DeepDiveLayout
      title="Clinic Performance"
      description="See how your clinic compares to others. Track patient retention, safety scores, and treatment success."
    >
      <div className="mt-8">
        <ClinicPerformanceRadar />
      </div>
    </DeepDiveLayout>
  );
};

export default ClinicPerformancePage;
```

---

### **TASK 4.6: Update Safety Surveillance Page**
**File:** `src/pages/deep-dives/SafetySurveillancePage.tsx`  
**Time:** 15 minutes  
**Complexity:** MEDIUM

**Find the page header section and update to use DeepDiveLayout.**

**Add import at top:**
```tsx
import { DeepDiveLayout } from '../../components/layouts/DeepDiveLayout';
```

**Wrap the content with DeepDiveLayout:**

**BEFORE (approximate structure):**
```tsx
return (
  <PageContainer className="py-8">
    <Section>
      <div className="border-b border-slate-800 pb-6">
        <h1>Safety Surveillance</h1>
        <p>Description...</p>
      </div>
      {/* Rest of content */}
    </Section>
  </PageContainer>
);
```

**AFTER:**
```tsx
return (
  <DeepDiveLayout
    title="Safety Surveillance"
    description="Monitor adverse events in real-time. Get alerts when safety patterns emerge across the network."
  >
    {/* Rest of content (remove the header div) */}
  </DeepDiveLayout>
);
```

**Note:** Keep all the existing content (charts, filters, etc.), just wrap it with DeepDiveLayout and remove the manual header.

---

## ✅ **TESTING CHECKLIST**

After completing all tasks, test the following:

### **Layout Checks:**
- [ ] All 5 deep dive pages have same width (wide)
- [ ] All pages have consistent header styling
- [ ] All pages have ConnectFeedButton in header
- [ ] No double scrollbars on any page

### **Content Checks:**
- [ ] Patient Outcomes Map:
  - [ ] Title: "Patient Outcomes Map"
  - [ ] Description: "See how patients respond to treatment..."
  - [ ] Chart displays correctly
  - [ ] Table displays correctly
- [ ] Molecular Pharmacology:
  - [ ] Title: "Molecular Pharmacology"
  - [ ] Description: "Learn how psychedelic drugs work..."
  - [ ] Component displays correctly
- [ ] Protocol Efficiency:
  - [ ] Title: "Protocol Efficiency"
  - [ ] Description: "Compare treatment costs and results..."
  - [ ] Component displays correctly
- [ ] Clinic Performance:
  - [ ] Title: "Clinic Performance"
  - [ ] Description: "See how your clinic compares..."
  - [ ] Component displays correctly
- [ ] Safety Surveillance:
  - [ ] Title: "Safety Surveillance"
  - [ ] Description: "Monitor adverse events in real-time..."
  - [ ] All charts and filters work

### **Functional Checks:**
- [ ] All deep dive pages load without errors
- [ ] All components render correctly
- [ ] All interactive elements work
- [ ] No console errors

### **Responsive Checks:**
- [ ] Mobile (375px): Header stacks properly
- [ ] Tablet (768px): Layout looks good
- [ ] Desktop (1920px): Wide layout works
- [ ] Ultra-wide (2560px): Content doesn't over-stretch

---

## 🐛 **COMMON ISSUES & FIXES**

### **Issue 1: "Cannot find module DeepDiveLayout"**
**Fix:** Make sure you created the file at exact path: `src/components/layouts/DeepDiveLayout.tsx`

### **Issue 2: Page content not showing**
**Fix:** Make sure you wrapped content with `<DeepDiveLayout>` tags, not replaced it

### **Issue 3: Double headers showing**
**Fix:** Remove the old manual header div when using DeepDiveLayout

### **Issue 4: ConnectFeedButton not showing**
**Fix:** DeepDiveLayout includes it by default, remove any manual ConnectFeedButton

### **Issue 5: Page too narrow**
**Fix:** Make sure DeepDiveLayout uses `width="wide"` on PageContainer

---

## 📊 **PROGRESS TRACKER**

```
BATCH 4 PROGRESS:

Foundation:
[  ] Task 4.1: Create DeepDiveLayout.tsx

Deep Dive Pages:
[  ] Task 4.2: Update Patient Outcomes Map
[  ] Task 4.3: Update Molecular Pharmacology
[  ] Task 4.4: Update Protocol Efficiency
[  ] Task 4.5: Update Clinic Performance
[  ] Task 4.6: Update Safety Surveillance

TOTAL: 0/6 tasks complete (0%)
```

---

## 🎯 **SUCCESS CRITERIA**

**Batch 4 is complete when:**
1. ✅ DeepDiveLayout component created
2. ✅ All 5 deep dive pages use DeepDiveLayout
3. ✅ All pages have same width (wide)
4. ✅ All subheadings are larger (text-lg sm:text-xl)
5. ✅ All descriptions are simplified (9th grade level)
6. ✅ All pages load without errors
7. ✅ All components render correctly
8. ✅ No console errors
9. ✅ All tests pass

---

**Estimated Time:** 90 minutes  
**When complete, move to Batch 5!**
