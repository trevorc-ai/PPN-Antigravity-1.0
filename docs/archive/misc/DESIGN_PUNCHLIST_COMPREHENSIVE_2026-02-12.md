# COMPREHENSIVE DESIGN PUNCH LIST
**PPN Research Portal - Post-Audit Action Items**

**Date:** 2026-02-12  
**Source:** 3-Viewport Comprehensive Audit (18 pages, 54 screenshots)  
**Overall Site Score:** 8.5/10 (Target: 9.2+)

---

## PRIORITY CLASSIFICATION

**P0 (Critical):** Accessibility violations, compliance blockers (must fix before production)  
**P1 (High):** Significant UX friction, affects >50% of pages (fix in Sprint 1)  
**P2 (Medium):** Improvement opportunities, polish (fix in Sprint 2)  
**P3 (Low):** Nice-to-have enhancements (backlog)

**Effort Scale:**
- **XS:** <1 hour (quick wins)
- **S:** 1-3 hours
- **M:** 3-8 hours
- **L:** 8-16 hours (requires planning)
- **XL:** >16 hours (epic/feature)

---

## P0: CRITICAL (Accessibility & Compliance)

### P0.1 - Font Size Violations
**Priority:** P0 | **Effort:** XS (1 hour) | **Impact:** WCAG 2.1 AA Compliance

**Issue:** 5 instances of text <14px violate Frontend Best Practices minimum.

**Affected Components:**
1. `Dashboard.tsx` line 87 - Network comparison text ("vs last month +12%") at 11px
2. `Analytics.tsx` line 134 - Timestamp at 11px
3. `News.tsx` line 56 - Hashtag text at 12px
4. `ProtocolBuilder.tsx` line 289 - Chart legend at 12px (exception allowed for legends)
5. `TopHeader.tsx` line 78 - Latency indicator at 11px

**Fix:**
```tsx
// BAD
<span className="text-[11px]">vs last month +12%</span>

// GOOD
<span className="text-sm">vs last month +12%</span>
```

**Acceptance Criteria:**
- All UI text ≥14px (except chart legends)
- Run global find for `text-[11px]`, `text-[12px]`, `text-xs` (12px)
- Replace with `text-sm` (14px) minimum

**Files to Edit:**
- `src/components/Dashboard.tsx`
- `src/components/Analytics.tsx`
- `src/components/News.tsx`
- `src/components/TopHeader.tsx`

---

## P1: HIGH PRIORITY (Site-Wide UX Improvements)

### P1.1 - Implement Glassmorphism Card Pattern
**Priority:** P1 | **Effort:** M (6 hours) | **Impact:** +1.0 Visual Design Score Site-Wide

**Issue:** Most cards use flat `bg-[#0f1218]` without depth effects, violating Frontend Best Practices glassmorphism pattern.

**Affected Pages:** 14 of 18 pages (all except Substances Catalog, Advanced Search, Substance Monograph, Protocol Detail)

**Fix:**
```tsx
// BAD - Flat design
<div className="bg-[#0f1218] border border-slate-800">

// GOOD - Glassmorphism
<div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50">
```

**Implementation Plan:**
1. Create reusable `GlassCard` component in `src/components/ui/GlassCard.tsx`
2. Replace all KPI cards, metric cards, info panels
3. Add layered shadow: `shadow-[0_8px_24px_rgba(0,0,0,0.3)]`

**Acceptance Criteria:**
- All cards use `backdrop-filter: blur()` CSS property
- Borders use `/50` opacity pattern
- Background uses `bg-slate-800/50` or similar semi-transparent value

**Files to Edit:**
- `src/components/Dashboard.tsx` (4 KPI cards)
- `src/components/Analytics.tsx` (stat cards)
- `src/components/analytics/PatientConstellation.tsx` (chart container)
- `src/components/analytics/ClinicPerformanceRadar.tsx` (chart container)
- `src/pages/ProtocolBuilder.tsx` (analytics section, modal)
- `src/components/ClinicianDirectory.tsx` (practitioner cards)
- `src/components/DataExport.tsx` (export form panel)

---

### P1.2 - Add Hover & Touch Interaction Feedback
**Priority:** P1 | **Effort:** M (6 hours) | **Impact:** +0.5 to +1.0 Interaction Score Site-Wide

**Issue:** No visual feedback on hover/tap events. Static interaction model feels unpolished.

**Affected Pages:** All 18 pages

**Fix:**
```tsx
// BAD - Static card
<div className="border border-slate-800">

// GOOD - Interactive card
<div className="border border-slate-800 hover:border-slate-600/50 transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)]">
```

**Implementation Plan:**
1. **Cards:** Add hover lift effect (scale: 1.02, shadow increase)
2. **Buttons:** Add hover state (border color change, subtle scale)
3. **Links:** Add underline on hover for "OPEN PROTOCOL" style links
4. **Mobile:** Add tap feedback (`active:scale-[0.98]`)

**Acceptance Criteria:**
- All interactive elements respond to hover with visual change
- Transitions use `transition-all duration-200` or `duration-300`
- Mobile tap states use `active:` prefix
- No jarring instant state changes

**Files to Edit:**
- `src/components/Dashboard.tsx` (KPI cards)
- `src/pages/ProtocolBuilder.tsx` (table rows, "OPEN PROTOCOL" links)
- `src/components/ClinicianDirectory.tsx` (practitioner cards, Profile/Message buttons)
- `src/components/analytics/*` (all chart containers)

---

### P1.3 - Redesign Analytics Empty State
**Priority:** P1 | **Effort:** S (3 hours) | **Impact:** +1.5 Score for Analytics Page

**Issue:** Empty state is too stark. No visual interest, confusing CTA hierarchy ("Print Report" prominent when no data exists).

**Affected Pages:** Analytics page (`/analytics`)

**Current State:**
- Large "No Clinical Data Yet" text
- "Print Report" button visible (confusing - nothing to print)
- No guidance on next steps

**Proposed Design:**
```tsx
<div className="flex flex-col items-center justify-center h-[400px] text-center">
  {/* Animated SVG Illustration */}
  <div className="mb-6">
    <ChartIllustration animate />
  </div>
  
  {/* Heading */}
  <h3 className="text-2xl font-bold text-slate-200 mb-2">
    Start Building Your Clinical Intelligence
  </h3>
  
  {/* Guidance */}
  <p className="text-slate-400 mb-6 max-w-md">
    Submit your first protocol using the Protocol Builder 
    to see analytics and insights here.
  </p>
  
  {/* CTA */}
  <Link to="/builder" className="btn-primary">
    <Plus className="w-5 h-5 mr-2" />
    Create Your First Protocol
  </Link>
</div>
```

**Implementation:**
1. Create or import animated SVG illustration (chart/graph icon)
2. Add animation using CSS `@keyframes` or Framer Motion
3. Replace "Print Report" button with "Create Your First Protocol" CTA linking to `/builder`
4. Add skeleton loaders for future data states

**Acceptance Criteria:**
- Illustration present and animated (subtle bounce or fade-in)
- Clear next-step guidance ("Submit your first protocol...")
- CTA links to Protocol Builder
- "Print Report" button hidden when no data exists

**Files to Edit:**
- `src/components/Analytics.tsx` (empty state section)

---

## P2: MEDIUM PRIORITY (Page-Specific Improvements)

### P2.1 - Add Adaptive Card Sizing (Dashboard Tablet)
**Priority:** P2 | **Effort:** S (2 hours) | **Impact:** +0.5 Visual Design Score for Dashboard Tablet

**Issue:** All KPI cards equal size despite varying data urgency. "Safety Alerts" (critical) has same visual weight as "Avg Session Time" (informational).

**Affected Pages:** Dashboard page (`/dashboard`) - Tablet viewport (768px) only

**Fix:**
```tsx
// Current: 2×2 grid with equal card sizes
<div className="grid grid-cols-2 gap-4">
  <KPICard title="Protocols Logged" value={23} />
  <KPICard title="Success Rate" value="71%" />
  <KPICard title="Safety Alerts" value={2} />
  <KPICard title="Avg Session Time" value="47 min" />
</div>

// Proposed: Adaptive sizing when Safety Alerts > 0
<div className="grid grid-cols-2 gap-4">
  <KPICard title="Protocols Logged" value={23} />
  <KPICard title="Success Rate" value="71%" />
  <KPICard 
    title="Safety Alerts" 
    value={2} 
    className="col-span-2" // Spans both columns when alerts exist
    variant="urgent"
  />
  <KPICard title="Avg Session Time" value="47 min" />
</div>
```

**Implementation:**
- Add conditional `col-span-2` class when `safetyAlerts > 0`
- Add `variant="urgent"` prop to KPICard to trigger amber border/icon

**Acceptance Criteria:**
- Safety Alerts card spans 2 columns on tablet when count > 0
- Visual urgency indicator (amber border, larger icon)
- Layout gracefully adapts if count = 0 (reverts to 1-column card)

**Files to Edit:**
- `src/components/Dashboard.tsx` (KPI grid layout)
- `src/components/ui/KPICard.tsx` (add variant prop)

---

### P2.2 - Improve Data Export Mobile Table UX
**Priority:** P2 | **Effort:** S (2 hours) | **Impact:** +1.0 Usability Score for Data Export Mobile

**Issue:** Export table on mobile requires horizontal scroll. No sticky column for File Name.

**Affected Pages:** Data Export Manager (`/data-export`) - Mobile viewport only

**Current Behavior:**
- Full table requires horizontal scroll on 375px viewport
- Users must scroll right to see Actions (Download, Preview)
- File Name disappears when scrolling right

**Proposed Fix:**
```tsx
// Option 1: Sticky first column
<div className="overflow-x-auto">
  <table className="w-full">
    <thead>
      <th className="sticky left-0 bg-slate-900 z-10">File Name</th>
      <th>Filters</th>
      <th>Generated</th>
      <th>Count</th>
      <th>Actions</th>
    </thead>
    {/* ... */}
  </table>
</div>

// Option 2: Card layout on mobile (recommended)
<div className="md:hidden"> {/* Mobile only */}
  {exports.map(exp => (
    <div className="bg-slate-800/50 p-4 rounded-xl mb-4">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold">{exp.fileName}</h4>
        <div className="flex gap-2">
          <button><Eye /></button>
          <button><Download /></button>
        </div>
      </div>
      <p className="text-sm text-slate-400">Filters: {exp.filters}</p>
      <p className="text-sm text-slate-400">Generated: {exp.date}</p>
      <p className="text-sm text-slate-400">Count: {exp.count}</p>
    </div>
  ))}
</div>

<div className="hidden md:block"> {/* Desktop/Tablet */}
  <table>...</table>
</div>
```

**Recommendation:** Use Option 2 (card layout on mobile) - better UX, no horizontal scroll.

**Acceptance Criteria:**
- Mobile: Export history displayed as cards (no horizontal scroll)
- Desktop/Tablet: Table view preserved
- All data fields visible without scrolling
- Actions (Download, Preview) easily accessible on mobile

**Files to Edit:**
- `src/components/DataExport.tsx` (export table/list section)

---

### P2.3 - Add "Copy to Clipboard" for Patient Hash (Protocol Detail)
**Priority:** P2 | **Effort:** XS (1 hour) | **Impact:** +0.5 Polish Score, Improved Clinician UX

**Issue:** Patient hash displayed in monospace font but no easy way to copy for record-keeping.

**Affected Pages:** Protocol Detail page (`/protocol/EX-001`)

**Current State:**
```tsx
<div>
  <span className="text-slate-400">PATIENT HASH</span>
  <code className="block mt-1 font-mono">8f9a2b3c4d5e...</code>
</div>
```

**Proposed Enhancement:**
```tsx
<div className="relative group">
  <span className="text-slate-400">PATIENT HASH</span>
  <div className="flex items-center gap-2">
    <code className="block mt-1 font-mono">8f9a2b3c4d5e...</code>
    <button 
      onClick={() => copyToClipboard(patientHash)}
      className="opacity-0 group-hover:opacity-100 transition-opacity"
      title="Copy to clipboard"
    >
      <Copy className="w-4 h-4 text-slate-400 hover:text-primary" />
    </button>
  </div>
  {copied && <span className="text-xs text-emerald-500">✓ Copied</span>}
</div>
```

**Implementation:**
- Add `Copy` icon from `lucide-react`
- Implement `copyToClipboard` utility function
- Show temporary "✓ Copied" feedback (2 seconds)

**Acceptance Criteria:**
- Copy icon appears on hover
- One-click copy to clipboard
- Visual feedback confirms copy success
- Works on all browsers (use `navigator.clipboard.writeText()`)

**Files to Edit:**
- `src/pages/ProtocolDetail.tsx` (patient hash display)
- `src/utils/clipboard.ts` (create utility function)

---

### P2.4 - Enhance Chart Legend Readability (Protocol Builder)
**Priority:** P2 | **Effort:** XS (1 hour) | **Impact:** +0.5 Accessibility Score

**Issue:** Chart legend text at 12px (acceptable for legends per WCAG) but could be improved for better readability.

**Affected Pages:** Protocol Builder (`/builder`) - Outcome Velocity chart

**Current State:**
- Legend labels: "First Session", "Latest" at 10px (`text-[10px]`)
- Positioned below chart

**Proposed Enhancement:**
```tsx
// Increase legend font size to 12px minimum
<div className="flex justify-between items-center px-2 mt-2">
  <span className="text-xs text-slate-500 font-bold tracking-widest uppercase">
    First Session
  </span>
  <span className="text-xs text-slate-500 font-bold tracking-widest uppercase">
    Latest
  </span>
</div>
```

**Change:** `text-[10px]` → `text-xs` (12px)

**Acceptance Criteria:**
- Legend text ≥12px
- Remains visually distinct from chart data
- Uppercase + letter-spacing preserved

**Files to Edit:**
- `src/pages/ProtocolBuilder.tsx` (AreaChart legend section, around line 480)

---

## P3: LOW PRIORITY (Polish & Enhancements)

### P3.1 - Add Parallax Scroll Effect (Dashboard Sidebar)
**Priority:** P3 | **Effort:** S (3 hours) | **Impact:** +0.5 Polish Score, Premium Feel

**Issue:** Dashboard sidebar "Active Protocols LIVE" widget scrolls at same speed as main content. Lacks depth illusion.

**Affected Pages:** Dashboard page (`/dashboard`) - Desktop viewport only

**Proposed Enhancement:**
```tsx
// Use Framer Motion or vanilla JS scroll listener
const [scrollY, setScrollY] = useState(0);

useEffect(() => {
  const handleScroll = () => setScrollY(window.scrollY);
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

return (
  <div 
    className="sidebar-widget"
    style={{ transform: `translateY(${scrollY * 0.3}px)` }}
  >
    {/* Active Protocols LIVE content */}
  </div>
);
```

**Effect:** Sidebar widget scrolls at 0.7x speed (70%) relative to main content, creating depth illusion.

**Acceptance Criteria:**
- Parallax effect smooth (60fps)
- Sidebar widget lags slightly behind main scroll
- No janky behavior or layout shift
- Desktop only (disabled on mobile/tablet)

**Files to Edit:**
- `src/components/Dashboard.tsx` (sidebar widget section)

---

### P3.2 - Implement Spring-Based Sidebar Animation (Mobile)
**Priority:** P3 | **Effort:** S (2 hours) | **Impact:** +0.5 Interaction Score, Smoother UX

**Issue:** Mobile sidebar toggle is instant (no easing, no physics-based animation).

**Affected Pages:** All pages (mobile viewport)

**Current Behavior:**
- Sidebar appears/disappears instantly
- No transition animation

**Proposed Enhancement:**
```tsx
import { motion } from 'framer-motion';

const sidebarVariants = {
  closed: { x: '-100%' },
  open: { 
    x: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  }
};

return (
  <motion.aside
    initial="closed"
    animate={isOpen ? 'open' : 'closed'}
    variants={sidebarVariants}
    className="sidebar"
  >
    {/* Sidebar content */}
  </motion.aside>
);
```

**Implementation:**
- Install Framer Motion (`npm install framer-motion`)
- Replace instant toggle with spring animation
- Add backdrop fade-in (`backdrop-filter: blur(8px)`)

**Acceptance Criteria:**
- Sidebar slides in from left with spring physics
- Backdrop blurs background content
- Animation smooth and natural (no linear easing)
- Mobile/Tablet only (desktop sidebar always visible)

**Files to Edit:**
- `src/components/Sidebar.tsx` (mobile sidebar component)
- `package.json` (add Framer Motion dependency)

---

### P3.3 - Add Magnetic Cursor Effect (TopHeader Icons)
**Priority:** P3 | **Effort:** M (4 hours) | **Impact:** +0.5 Polish Score, Interactive Delight

**Issue:** TopHeader icons (notifications, search, help, profile) are static. No hover interactivity beyond cursor change.

**Affected Pages:** All pages - Desktop viewport only

**Proposed Enhancement:**
```tsx
const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
const iconRef = useRef<HTMLButtonElement>(null);

const handleMouseMove = (e: MouseEvent) => {
  if (!iconRef.current) return;
  
  const rect = iconRef.current.getBoundingClientRect();
  const iconCenterX = rect.left + rect.width / 2;
  const iconCenterY = rect.top + rect.height / 2;
  
  const distance = Math.sqrt(
    Math.pow(e.clientX - iconCenterX, 2) + 
    Math.pow(e.clientY - iconCenterY, 2)
  );
  
  if (distance < 40) { // 40px magnetic radius
    const pullX = (e.clientX - iconCenterX) * 0.2;
    const pullY = (e.clientY - iconCenterY) * 0.2;
    setMousePos({ x: pullX, y: pullY });
  } else {
    setMousePos({ x: 0, y: 0 });
  }
};

return (
  <button
    ref={iconRef}
    style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
    className="transition-transform duration-150"
  >
    <Bell />
  </button>
);
```

**Effect:** Icons "pull toward" mouse when cursor within 40px radius.

**Acceptance Criteria:**
- Magnetic effect on all TopHeader icons
- Smooth spring-based pull (no jarring movement)
- Icons return to center when mouse leaves radius
- Desktop only (disabled on touch devices)

**Files to Edit:**
- `src/components/TopHeader.tsx` (all icon buttons)
- Create `src/hooks/useMagneticEffect.ts` (reusable hook)

---

### P3.4 - Staggered Table Row Reveal (Protocol Builder)
**Priority:** P3 | **Effort:** S (2 hours) | **Impact:** +0.5 Polish Score, Visual Interest

**Issue:** Protocol table rows appear instantly. No entrance animation.

**Affected Pages:** Protocol Builder (`/builder`)

**Proposed Enhancement:**
```tsx
import { motion } from 'framer-motion';

const tableRowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.3 }
  })
};

return (
  <tbody>
    {protocols.map((protocol, index) => (
      <motion.tr
        key={protocol.id}
        custom={index}
        initial="hidden"
        animate="visible"
        variants={tableRowVariants}
      >
        <td>{protocol.reference}</td>
        {/* ... */}
      </motion.tr>
    ))}
  </tbody>
);
```

**Effect:** Rows fade in sequentially from top to bottom (50ms delay between each).

**Acceptance Criteria:**
- Rows appear one after another (staggered)
- Subtle fade + slide-up animation
- Only on initial page load (not on every re-render)
- No performance impact (test with 20+ rows)

**Files to Edit:**
- `src/pages/ProtocolBuilder.tsx` (protocol table rows)

---

## GRAPHIC VISUALIZATION IMPROVEMENTS

### V1 - Enhance Empty State Illustrations (Site-Wide)
**Priority:** P2 | **Effort:** M (6 hours) | **Impact:** +0.5 to +1.0 Visual Design Score

**Issue:** Multiple pages use text-only empty states with no visual interest.

**Affected Pages:**
1. Analytics (`/analytics`) - "No Clinical Data Yet"
2. Simple Search (`/search`) - Empty search page
3. News (if no news items)
4. Protocol Builder (if no protocols)

**Proposed Solution:**
Create a library of SVG illustrations for common empty states:

```tsx
// src/components/illustrations/EmptyStateChart.tsx
export const EmptyStateChart = ({ animate = true }) => (
  <svg width="120" height="120" viewBox="0 0 120 120">
    <g className={animate ? 'animate-pulse' : ''}>
      {/* Chart bars */}
      <rect x="20" y="60" width="15" height="40" rx="2" fill="url(#gradient1)" opacity="0.3" />
      <rect x="45" y="40" width="15" height="60" rx="2" fill="url(#gradient1)" opacity="0.5" />
      <rect x="70" y="50" width="15" height="50" rx="2" fill="url(#gradient1)" opacity="0.4" />
      <rect x="95" y="30" width="15" height="70" rx="2" fill="url(#gradient1)" opacity="0.6" />
    </g>
    <defs>
      <linearGradient id="gradient1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
      </linearGradient>
    </defs>
  </svg>
);
```

**Illustration Types Needed:**
1. `EmptyStateChart` - Bar chart with gradient (for Analytics)
2. `EmptyStateSearch` - Magnifying glass with sparkles (for Search)
3. `EmptyStateDocument` - Document/file icon (for Protocol Builder)
4. `EmptyStateNews` - Newspaper icon (for News)

**Implementation:**
- Create illustrations in Figma or hand-code as SVG
- Add subtle animations (pulse, fade, float)
- Use gradient fills matching brand colors (blue, emerald)
- Ensure SVGs are accessible (add `<title>` and `aria-label`)

**Acceptance Criteria:**
- All empty states have visual illustration
- Illustrations use brand colors
- Subtle animation present (pulse or fade)
- SVGs optimized (<5KB each)

**Files to Create:**
- `src/components/illustrations/EmptyStateChart.tsx`
- `src/components/illustrations/EmptyStateSearch.tsx`
- `src/components/illustrations/EmptyStateDocument.tsx`
- `src/components/illustrations/EmptyStateNews.tsx`

**Files to Edit:**
- `src/components/Analytics.tsx` (use EmptyStateChart)
- `src/pages/SimpleSearch.tsx` (use EmptyStateSearch)
- `src/pages/ProtocolBuilder.tsx` (use EmptyStateDocument)

---

### V2 - Improve Radar Chart Mobile Responsiveness
**Priority:** P2 | **Effort:** XS (1 hour) | **Impact:** +0.5 Visual Design Score

**Issue:** Clinic Performance Radar Chart `outerRadius` reduced to 65% to prevent label clipping. Could be optimized further for mobile.

**Affected Pages:** Clinic Performance (`/deep-dives/clinic-performance`)

**Current State:**
- Desktop: `outerRadius="65%"` (works well)
- Mobile: Same 65% but feels cramped

**Proposed Enhancement:**
```tsx
// Responsive outer radius based on viewport
const isMobile = window.innerWidth < 640;
const outerRadius = isMobile ? "55%" : "65%";

<RadarChart cx="50%" cy="50%" outerRadius={outerRadius} data={currentData}>
  <PolarAngleAxis
    dataKey="subject"
    tick={{ 
      fill: '#94a3b8', 
      fontSize: isMobile ? 10 : 11, // Smaller font on mobile
      fontWeight: 700 
    }}
  />
  {/* ... */}
</RadarChart>
```

**Changes:**
- Mobile: `outerRadius="55%"` + `fontSize: 10px`
- Desktop: `outerRadius="65%"` + `fontSize: 11px`

**Acceptance Criteria:**
- Radar chart fully visible on 375px viewport
- Axis labels readable without clipping
- Chart maintains clarity and visual balance

**Files to Edit:**
- `src/components/analytics/ClinicPerformanceRadar.tsx` (RadarChart config)

---

### V3 - Add Data Point Hover Tooltips (All Charts)
**Priority:** P2 | **Effort:** S (3 hours) | **Impact:** +0.5 Interaction Score for Deep Dive Pages

**Issue:** Some charts lack hover tooltips showing exact values.

**Affected Pages:**
- Patient Flow (Sankey chart)
- Patient Constellation (Scatter plot)
- Molecular Pharmacology (Bar charts)
- Protocol Efficiency (Scatter ROI chart)

**Current State:**
- Some charts have tooltips (Protocol Builder AreaChart ✓)
- Others lack interactive hover feedback

**Proposed Enhancement:**
```tsx
// Ensure all Recharts components have Tooltip
<AreaChart data={data}>
  <Tooltip
    contentStyle={{ 
      backgroundColor: '#0f172a', 
      borderColor: '#334155', 
      borderRadius: '12px',
      fontSize: '12px'
    }}
    itemStyle={{ color: '#fff', fontWeight: 'bold' }}
    labelStyle={{ color: '#94a3b8' }}
    cursor={{ stroke: '#3b82f6', strokeWidth: 2 }}
  />
  {/* ... */}
</AreaChart>
```

**Implementation:**
- Audit all chart components for `<Tooltip />` presence
- Add consistent tooltip styling (dark background, emerald accent)
- Ensure cursor highlight on hover
- Test on mobile (tooltips should work on tap)

**Acceptance Criteria:**
- All charts have hover tooltips
- Tooltips show exact values + labels
- Styling consistent across all charts
- Mobile-friendly (tap to show tooltip)

**Files to Edit:**
- `src/components/analytics/PatientConstellation.tsx`
- `src/components/analytics/MolecularPharmacology.tsx`
- `src/components/analytics/ProtocolEfficiency.tsx`
- `src/components/analytics/PatientFlow.tsx`

---

### V4 - Implement Chart Loading Skeletons
**Priority:** P3 | **Effort:** S (3 hours) | **Impact:** +0.5 Polish Score, Perceived Performance

**Issue:** Charts render instantly or show "Loading..." text. No skeleton state.

**Affected Pages:** All Deep Dive pages with charts

**Proposed Enhancement:**
```tsx
const ChartSkeleton = () => (
  <div className="h-[400px] flex items-center justify-center">
    <div className="animate-pulse space-y-4 w-full">
      {/* Skeleton bars */}
      <div className="flex items-end justify-around h-[300px]">
        <div className="w-12 bg-slate-700 rounded-t" style={{ height: '60%' }} />
        <div className="w-12 bg-slate-700 rounded-t" style={{ height: '80%' }} />
        <div className="w-12 bg-slate-700 rounded-t" style={{ height: '40%' }} />
        <div className="w-12 bg-slate-700 rounded-t" style={{ height: '90%' }} />
        <div className="w-12 bg-slate-700 rounded-t" style={{ height: '50%' }} />
      </div>
      {/* Skeleton axis */}
      <div className="h-2 bg-slate-700 rounded w-full" />
    </div>
  </div>
);

// In chart component
{isLoading ? <ChartSkeleton /> : <AreaChart data={data}>...</AreaChart>}
```

**Skeleton Types Needed:**
1. Bar chart skeleton (for Molecular Pharmacology)
2. Line/Area chart skeleton (for Protocol Builder)
3. Scatter plot skeleton (for Patient Constellation)
4. Radar chart skeleton (for Clinic Performance)

**Acceptance Criteria:**
- Skeleton appears during data fetch (0.5-2 seconds typically)
- Skeleton shape roughly matches final chart type
- Pulse animation indicates loading state
- Graceful transition from skeleton → chart

**Files to Create:**
- `src/components/skeletons/ChartSkeleton.tsx`

**Files to Edit:**
- All chart components in `src/components/analytics/*`

---

## DATA DISPLAY IMPROVEMENTS

### D1 - Implement Sticky Table Headers (Data Export)
**Priority:** P2 | **Effort:** XS (1 hour) | **Impact:** +0.5 Usability Score

**Issue:** Export history table headers scroll out of view when scrolling down (desktop).

**Affected Pages:** Data Export Manager (`/data-export`)

**Fix:**
```tsx
<div className="overflow-y-auto max-h-[600px]">
  <table className="w-full">
    <thead className="sticky top-0 bg-slate-900 z-10 shadow-md">
      <tr>
        <th>File Name</th>
        <th>Filters</th>
        <th>Generated</th>
        <th>Count</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {/* ... */}
    </tbody>
  </table>
</div>
```

**Changes:**
- Add `sticky top-0` to `<thead>`
- Add `bg-slate-900` background (prevents content showing through)
- Add `z-10` to ensure header stays above tbody
- Add subtle `shadow-md` for visual separation

**Acceptance Criteria:**
- Table headers remain visible during vertical scroll
- Headers have clear visual separation from rows
- Shadow indicates "stickiness"
- Works on all major browsers

**Files to Edit:**
- `src/components/DataExport.tsx` (export history table)

---

### D2 - Add Row Zebra Striping (All Tables)
**Priority:** P3 | **Effort:** XS (1 hour) | **Impact:** +0.3 Visual Design Score

**Issue:** Table rows have uniform background. Difficult to scan horizontally across many columns.

**Affected Pages:**
- Protocol Builder (protocol list table)
- Data Export Manager (export history table)
- Clinician Directory (if table view exists)

**Fix:**
```tsx
<tbody>
  {rows.map((row, index) => (
    <tr 
      key={row.id}
      className={index % 2 === 0 ? 'bg-slate-900/20' : 'bg-transparent'}
    >
      <td>{row.data}</td>
    </tr>
  ))}
</tbody>
```

**Alternative (CSS-only):**
```css
tbody tr:nth-child(even) {
  background-color: rgba(15, 23, 42, 0.2); /* bg-slate-900/20 */
}
```

**Acceptance Criteria:**
- Even rows have subtle background tint
- Odd rows remain transparent
- Hover state still visible over zebra striping
- Improves horizontal scannability

**Files to Edit:**
- `src/pages/ProtocolBuilder.tsx` (protocol table)
- `src/components/DataExport.tsx` (export table)

---

### D3 - Add Sort Indicators (Protocol Builder Table)
**Priority:** P2 | **Effort:** S (2 hours) | **Impact:** +0.5 Usability Score

**Issue:** Protocol table columns appear sortable but lack visual indicators (arrows).

**Affected Pages:** Protocol Builder (`/builder`)

**Current State:**
- Table has columns: Protocol Reference, Current Status, Dosage, Action
- No indication which column is sorted or sortable

**Proposed Enhancement:**
```tsx
<table>
  <thead>
    <tr>
      <th 
        className="cursor-pointer hover:text-white transition-colors"
        onClick={() => handleSort('reference')}
      >
        <div className="flex items-center gap-2">
          Protocol Reference
          {sortColumn === 'reference' && (
            sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
          )}
        </div>
      </th>
      {/* Repeat for other sortable columns */}
    </tr>
  </thead>
</table>
```

**Implementation:**
- Add `sortColumn` and `sortDirection` state
- Implement `handleSort` function
- Add ChevronUp/ChevronDown icons from `lucide-react`
- Add hover state to indicate clickability

**Acceptance Criteria:**
- All sortable columns show cursor pointer on hover
- Active sort column shows arrow indicator (up/down)
- Clicking column header toggles sort direction
- Default sort: Protocol Reference ascending

**Files to Edit:**
- `src/pages/ProtocolBuilder.tsx` (table header)

---

### D4 - Improve Timestamp Formatting (All Pages)
**Priority:** P3 | **Effort:** XS (1 hour) | **Impact:** +0.3 Usability Score

**Issue:** Timestamps inconsistent across pages. Some show full date, some relative ("2 days ago").

**Affected Pages:** All pages with timestamps (Data Export, Protocol Builder, News)

**Current State:**
- Data Export: "Oct 24, 2023 at 14:30:25 by You"
- Protocol Builder: Implicit (session date)
- News: Varies

**Proposed Standardization:**
```tsx
// Create utility function
// src/utils/formatDate.ts
export const formatTimestamp = (date: Date, format: 'relative' | 'absolute' = 'relative') => {
  if (format === 'relative') {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
  }
  
  // Absolute format for older dates
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Usage
<span>{formatTimestamp(exportDate, 'relative')}</span>
```

**Standard:**
- **Recent** (<7 days): Relative format ("2h ago", "3d ago")
- **Older** (≥7 days): Absolute format ("Oct 24, 2023, 14:30")
- **Hover**: Show absolute timestamp in tooltip

**Acceptance Criteria:**
- Consistent timestamp format site-wide
- Relative format for recent activity
- Tooltip shows exact absolute time on hover
- Uses user's locale for formatting

**Files to Create:**
- `src/utils/formatDate.ts`

**Files to Edit:**
- `src/components/DataExport.tsx`
- `src/pages/ProtocolBuilder.tsx`
- `src/components/News.tsx`

---

## IMPLEMENTATION WORKFLOW

### Sprint 1 (Week 1) - Critical & High Priority
**Goal:** Fix compliance issues + implement site-wide UX improvements

**Day 1-2:**
- ✅ P0.1: Fix font size violations (1 hour)
- ✅ P1.1: Implement glassmorphism (6 hours)
- ✅ P1.2: Add hover/touch feedback (6 hours)

**Day 3-4:**
- ✅ P1.3: Redesign Analytics empty state (3 hours)
- ✅ P2.1: Add adaptive card sizing (2 hours)
- ✅ V2: Improve radar chart mobile (1 hour)
- ✅ V3: Add chart tooltips (3 hours)

**Day 5:**
- Testing & QA across all viewports
- Screenshot comparison (before/after)
- Update audit report with new scores

**Estimated Sprint 1 Effort:** 22 hours  
**Expected Score Increase:** 8.5 → 9.2+ (+0.7 points)

---

### Sprint 2 (Week 2) - Medium Priority Polish
**Goal:** Page-specific improvements + data display enhancements

**Day 1:**
- ✅ P2.2: Improve Data Export mobile UX (2 hours)
- ✅ P2.3: Add clipboard copy (1 hour)
- ✅ P2.4: Chart legend readability (1 hour)
- ✅ D1: Sticky table headers (1 hour)
- ✅ D2: Zebra striping (1 hour)

**Day 2:**
- ✅ D3: Sort indicators (2 hours)
- ✅ D4: Timestamp formatting (1 hour)
- ✅ V1: Empty state illustrations (6 hours)

**Day 3-4:**
- ✅ V4: Chart loading skeletons (3 hours)
- Testing & refinement

**Estimated Sprint 2 Effort:** 18 hours  
**Expected Score Increase:** 9.2 → 9.4+ (+0.2 points)

---

### Sprint 3 (Backlog) - Low Priority Enhancements
**Goal:** Advanced interactions & premium polish

**Items:**
- P3.1: Parallax scroll effect (3 hours)
- P3.2: Spring-based sidebar (2 hours)
- P3.3: Magnetic cursor effect (4 hours)
- P3.4: Staggered table row reveal (2 hours)

**Estimated Sprint 3 Effort:** 11 hours  
**Expected Score Increase:** 9.4 → 9.6+ (+0.2 points)

---

## SUCCESS METRICS

**Pre-Implementation:**
- Overall Site Score: 8.5/10
- Desktop Average: 9.1/10
- Mobile Average: 7.8/10
- Tablet Average: 8.6/10

**Post-Sprint 1 Target:**
- Overall Site Score: 9.2/10 (+0.7)
- Desktop Average: 9.5/10 (+0.4)
- Mobile Average: 8.5/10 (+0.7)
- Tablet Average: 9.2/10 (+0.6)

**Post-Sprint 2 Target:**
- Overall Site Score: 9.4/10 (+0.2)
- All viewports: 9.2-9.6 range

**Post-Sprint 3 Target:**
- Overall Site Score: 9.6/10 (+0.2)
- Multiple pages achieving 10.0 perfect scores
- "Site of the Day" submission-ready

---

## ACCEPTANCE CRITERIA (OVERALL)

**Before Marking Any Task Complete:**
1. ✅ Visual regression testing across 3 viewports
2. ✅ Accessibility audit (WCAG 2.1 AA)
3. ✅ Performance check (no jank, 60fps animations)
4. ✅ Browser testing (Chrome, Firefox, Safari)
5. ✅ Mobile device testing (real iOS/Android)
6. ✅ Screenshot documentation (before/after)
7. ✅ Update audit scores in tracking sheet

**Definition of Done:**
- Feature implemented per specification
- Code reviewed (self or peer)
- No console errors or warnings
- Passes Lighthouse audit (90+ score)
- Works on all specified viewports
- Documentation updated if needed

---

**END OF PUNCH LIST**

**Next Steps:**
1. Review and prioritize with LEAD
2. Assign tasks to BUILDER agent
3. Track progress in project management tool
4. Schedule Sprint 1 kickoff
