# Component Categorization by User Scope & Access Tier

**Date:** 2026-02-16  
**Purpose:** Organize all components by data scope, user type, and access tier for proper filtering and tier gating

---

## 📊 DATA SCOPE CATEGORIES

### 🔵 **PATIENT-LEVEL COMPONENTS**
*Single patient data - No aggregation, no filters needed*

| Component | Location | Current Issues | Access Tier |
|-----------|----------|----------------|-------------|
| **MEQ-30 Assessment** | `/meq30` | ✅ Works correctly | Free (Public) |
| **Adaptive Assessment** | `/assessment` | ✅ Works correctly | Free (Public) |
| **Wellness Journey (God View)** | `/wellness-journey` | ✅ Patient-specific | Premium |
| **Session Vitals Monitor** | Arc of Care components | ✅ Patient-specific | Premium |
| **Real-Time Vitals Panel** | Arc of Care components | ✅ Patient-specific | Premium |
| **Red Alert Panel** | Arc of Care components | ✅ Patient-specific | Premium |
| **Pulse Check Widget** | Arc of Care components | ✅ Patient-specific | Premium |
| **Session Outcome Radar** | Arc of Care components | ✅ Patient-specific | Premium |
| **Substance Exposure Timeline** | Arc of Care components | ✅ Patient-specific | Premium |
| **Symptom Heatmap** | Arc of Care components | ✅ Patient-specific | Premium |
| **Therapeutic Alliance Gauge** | Arc of Care components | ✅ Patient-specific | Premium |
| **Timeline Navigator** | Arc of Care components | ✅ Patient-specific | Premium |

**Filter Requirements:** None (patient ID passed as prop)  
**RLS Requirements:** Must filter by `user_id` or `site_id`

---

### 🟢 **CLINIC-LEVEL COMPONENTS**
*Single clinic/site data - Requires site filter*

| Component | Location | Current Issues | Access Tier | Needs Filters |
|-----------|----------|----------------|-------------|---------------|
| **Clinic Performance Radar** | `/analytics` | ⚠️ **No site filter** | Premium | ✅ Site Selector |
| **Safety Benchmark** | `/analytics` | ⚠️ **No site filter** | Premium | ✅ Site Selector |
| **Protocol Efficiency (ROI)** | `/analytics` | ⚠️ **Bleeding over container** | Premium | ✅ Site + Protocol Selector |
| **Patient Flow Sankey** | `/deep-dives/patient-flow` | ⚠️ **No site filter** | Enterprise | ✅ Site + Date Range |
| **Revenue Forensics** | `/deep-dives/revenue-forensics` | ⚠️ **No site filter** | Enterprise | ✅ Site + Date Range |
| **Workflow Chaos** | `/deep-dives/workflow-chaos` | ⚠️ **No site filter** | Enterprise | ✅ Site Selector |

**Filter Requirements:**
- Site/Clinic Selector (dropdown)
- Date Range Picker
- Protocol Type Filter (optional)

**RLS Requirements:** Must filter by `site_id` from `user_sites` table

---

### 🟡 **NETWORK-LEVEL COMPONENTS**
*Multi-clinic aggregation - Requires network + site filters*

| Component | Location | Current Issues | Access Tier | Needs Filters |
|-----------|----------|----------------|-------------|---------------|
| **Patient Constellation** | `/analytics` | ⚠️ **No network filter** | Enterprise | ✅ Network + Site Multi-Select |
| **Molecular Pharmacology** | `/analytics` | ⚠️ **Bleeding over container** | Enterprise | ✅ Substance Selector |
| **Metabolic Risk Gauge** | `/analytics` | ⚠️ **No protocol filter** | Premium | ✅ Protocol + Substance Selector |
| **Safety Risk Matrix** | Component Showcase | ⚠️ **No filters** | Enterprise | ✅ Network + Date Range |
| **Regulatory Mosaic** | `/deep-dives/regulatory-mosaic` | ⚠️ **No jurisdiction filter** | Enterprise | ✅ Jurisdiction Multi-Select |
| **Confidence Cone** | `/deep-dives/confidence-cone` | ⚠️ **No filters** | Enterprise | ✅ Network + Substance |
| **Regulatory Weather** | `/deep-dives/regulatory-weather` | ⚠️ **No filters** | Enterprise | ✅ Jurisdiction Selector |

**Filter Requirements:**
- Network Selector (if user has access to multiple networks)
- Site Multi-Select (compare multiple sites)
- Substance/Protocol Filter
- Date Range Picker
- Jurisdiction Selector (for regulatory components)

**RLS Requirements:** Must filter by network access via `user_sites` table

---

### 🔴 **GLOBAL-LEVEL COMPONENTS**
*Cross-network aggregation - Network admin only*

| Component | Location | Current Issues | Access Tier | Needs Filters |
|-----------|----------|----------------|-------------|---------------|
| **Patient Journey Snapshot** | Component Showcase | ⚠️ **No filters** | Enterprise | ✅ Network Multi-Select |
| **Safety Surveillance** | `/deep-dives/safety-surveillance` | ⚠️ **No filters** | Enterprise | ✅ Network + Date Range |

**Filter Requirements:**
- Network Multi-Select
- Date Range Picker
- Substance Filter
- Geographic Region Filter

**RLS Requirements:** Must check `is_network_admin()` RPC function

---

## 🎯 ACCESS TIER BREAKDOWN

### 🟢 **FREE TIER** (Public Access - No Login Required)

**Features:**
1. **Drug Interaction Checker (Light)** - Basic contraindication screening
2. **MEQ-30 Assessment** - Mystical experience questionnaire
3. **Adaptive Assessment Forms** - Self-reporting clinical assessments
4. **Substance Monographs (Read-Only)** - Basic pharmacology information
5. **News & Intelligence Hub (Limited)** - Public regulatory updates

**Characteristics:**
- No authentication required
- No PHI collection
- Read-only access
- Limited to public data
- No data export

**Implementation:**
- Remove authentication guard for these routes
- Add "Sign up for full access" CTAs
- Limit data depth (e.g., basic monograph info only)

---

### 🟡 **PREMIUM TIER** (Individual Practitioners)

**Features:**
- All Free Tier features PLUS:
- **Patient-Level Tracking:**
  - Wellness Journey (God View)
  - Session monitoring and vitals
  - Arc of Care Phase 1-3 tracking
- **Clinic-Level Analytics:**
  - Clinic Performance Radar (single site)
  - Safety Benchmark (single site)
  - Protocol ROI Engine (single site)
- **Clinical Tools:**
  - Full Drug Interaction Checker
  - Protocol Builder
  - Advanced Search Portal
  - Molecular Pharmacology (limited)
  - Metabolic Risk Gauge

**Characteristics:**
- Single practitioner or small clinic
- Single site access
- Patient-level and clinic-level data only
- No cross-site comparisons
- Limited data export

**Filter Requirements:**
- Date Range Picker
- Protocol/Substance Selector
- Patient Selector (for patient-level views)

---

### 🔴 **ENTERPRISE TIER** (Networks & Research Organizations)

**Features:**
- All Premium Tier features PLUS:
- **Network-Level Analytics:**
  - Patient Constellation (multi-site)
  - Safety Risk Matrix
  - Regulatory Mosaic
  - Confidence Cone
  - All 13 Deep Dive pages
- **Global Analytics:**
  - Patient Journey Snapshot
  - Safety Surveillance
  - Revenue Forensics
- **Enterprise Tools:**
  - Data Export (full)
  - Audit Logs
  - Network Intelligence
  - Multi-site management

**Characteristics:**
- Multi-site access
- Network-level aggregation
- Cross-site comparisons
- Full data export
- API access

**Filter Requirements:**
- Network Selector
- Site Multi-Select
- Date Range Picker
- Substance/Protocol Filter
- Jurisdiction Selector
- Geographic Region Filter

---

## 🚨 CRITICAL ISSUES TO FIX

### 1. **Container Overflow Issues**

**Components with bleeding:**
- ❌ Protocol ROI Engine (`ProtocolEfficiency`)
- ❌ Molecular Pharmacology (`MolecularPharmacology`)

**Fix Required:**
```tsx
// Add to parent container:
className="overflow-hidden"

// Or add to component wrapper:
<div className="w-full h-full overflow-hidden">
  <ProtocolEfficiency />
</div>
```

---

### 2. **Missing Filter Components**

**Need to create:**
1. **GlobalFilterBar** (already exists but not used everywhere)
2. **SiteSelector** - Dropdown for single site selection
3. **SiteMultiSelect** - Multi-select for comparing sites
4. **NetworkSelector** - For users with multi-network access
5. **SubstanceFilter** - Filter by substance type
6. **DateRangePicker** - Standard date range selector
7. **JurisdictionSelector** - For regulatory components

**Location:** `/src/components/analytics/filters/`

---

### 3. **RLS Policy Verification**

**Required checks for each component:**

```sql
-- Patient-Level: Filter by user's site access
WHERE site_id IN (
  SELECT site_id FROM log_user_sites WHERE user_id = auth.uid()
)

-- Clinic-Level: Filter by selected site (must be user's site)
WHERE site_id = $1 
  AND site_id IN (SELECT site_id FROM log_user_sites WHERE user_id = auth.uid())

-- Network-Level: Filter by network access
WHERE network_id IN (
  SELECT DISTINCT network_id FROM log_sites 
  WHERE site_id IN (SELECT site_id FROM log_user_sites WHERE user_id = auth.uid())
)

-- Global-Level: Network admin only
WHERE is_network_admin(auth.uid()) = true
```

---

## 📋 IMPLEMENTATION PRIORITY

### **Phase 1: Fix Critical Issues** (Immediate)
1. ✅ Fix container overflow on Protocol ROI and Molecular Pharmacology
2. ✅ Add GlobalFilterBar to all network/clinic-level components
3. ✅ Verify RLS policies on all analytics queries

### **Phase 2: Create Filter Components** (Week 1)
1. Build SiteSelector component
2. Build SiteMultiSelect component
3. Build NetworkSelector component
4. Build SubstanceFilter component
5. Build DateRangePicker component

### **Phase 3: Implement Tier Gating** (Week 2)
1. Create tier checking middleware
2. Add tier badges to features
3. Implement "Upgrade" CTAs
4. Create free tier landing pages

### **Phase 4: Update Analytics Page** (Week 3)
1. Reorganize components by data scope
2. Add appropriate filters to each component
3. Test RLS enforcement
4. Verify data isolation

---

## 🎨 RECOMMENDED ANALYTICS PAGE STRUCTURE

```
📊 ANALYTICS PAGE REORGANIZATION

┌─────────────────────────────────────────┐
│  HEADER: Clinical Intelligence          │
│  Global Filters: [Network] [Sites] [Date]│
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  KPI RIBBON (Clinic-Level)              │
│  [Active Protocols] [Alerts] [Efficiency]│
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  CLINIC PERFORMANCE (Requires Site)     │
│  - Performance Radar                    │
│  - Safety Benchmark                     │
│  - Protocol ROI Engine                  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  NETWORK INSIGHTS (Enterprise Only)     │
│  - Patient Constellation                │
│  - Molecular Pharmacology               │
│  - Metabolic Risk Gauge                 │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  DEEP DIVES (Links to dedicated pages)  │
│  [Patient Flow] [Revenue] [Safety]      │
└─────────────────────────────────────────┘
```

---

## 📄 NEXT STEPS

1. **Create Work Order** for filter component development
2. **Audit all analytics queries** for proper RLS enforcement
3. **Design tier gating UI** with upgrade CTAs
4. **Update Feature Inventory** with tier assignments
5. **Test data isolation** across all scopes
