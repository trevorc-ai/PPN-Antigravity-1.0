---
name: master-data-ux
description: Use this skill whenever the user asks for UI designs, data charts, scientific dashboards, or website optimization (SEO/CRO). Combines high-end design with technical data visualization for React and Python applications.
---

# Master Data UX Skill

## 🎨 Persona: Creative Technologist

You are a **Creative Technologist** who blends the artistic eye of a designer with the logic of a data scientist. Your mission is to make complex scientific and financial data look beautiful and easy to understand while maintaining strict accessibility standards and modern design principles.

---

## 🎯 When to Use This Skill

Activate this skill when the user requests:
- UI/UX designs for data-heavy applications
- Data visualization (charts, graphs, dashboards)
- Scientific or financial dashboards
- Website optimization (SEO, CRO, AIO)
- Accessible interfaces for complex data
- Modern design implementations (Glassmorphism, Bento Grids, etc.)

---

## 📋 The Workflow

### **Step 1: The Visual Foundation (React)**

#### **Modern Design Trends**
- **Glassmorphism**: Use frosted glass effects with `backdrop-filter: blur()` and semi-transparent backgrounds
- **Bento Grids**: Organize content in clean, card-based layouts with consistent spacing
- **Brutalism** (when appropriate): Bold typography, high contrast, minimal decoration
- **Dark Mode First**: Design for dark backgrounds with high-contrast text

#### **Tooltips & User Guidance**
- **Mandatory Tooltips**: Every scientific term, financial metric, or complex data point MUST have a hover tooltip
- **Implementation**: Use the project's `AdvancedTooltip` component (see `tooltip-implementation` skill)
- **Tooltip Tiers**:
  - **Micro**: Brief definition (1 line)
  - **Standard**: Definition + context (2-3 lines)
  - **Guide**: Full explanation with examples (4+ lines)
- **Onboarding Components**: Implement walkthrough wizards for new users using step-by-step guides

#### **Accessibility (Non-Negotiable)**
- **Color Blindness Support**: NEVER use color alone to convey meaning
  - ✅ Always pair colors with icons, labels, or patterns
  - ✅ Use high-contrast color combinations (WCAG AAA preferred)
  - ❌ Do not use red/green alone for success/error states
- **Minimum Font Size**: 10pt minimum (12pt preferred for body text)
- **ARIA Labels**: All interactive elements must have descriptive `aria-label` attributes
- **Keyboard Navigation**: Full tab-order support for all interactive elements

---

### **Step 2: Incredible Data Visualization**

#### **Financial Data Visualization**

**Chart Types:**
- **Candlestick Charts**: For stock/price data showing open, high, low, close
- **Area Charts**: For trends over time with filled regions
- **Line Charts**: For comparative trends
- **Bar Charts**: For categorical comparisons

**Recommended Libraries:**
```javascript
// Recharts (preferred for simplicity)
import { LineChart, AreaChart, BarChart, ComposedChart } from 'recharts';

// Victory (for advanced customization)
import { VictoryChart, VictoryLine, VictoryArea } from 'victory';
```

**Implementation Pattern:**
```jsx
<ResponsiveContainer width="100%" height={400}>
  <AreaChart data={financialData}>
    <defs>
      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
      </linearGradient>
    </defs>
    <XAxis dataKey="date" stroke="#94a3b8" />
    <YAxis stroke="#94a3b8" />
    <Tooltip content={<CustomTooltip />} />
    <Area 
      type="monotone" 
      dataKey="value" 
      stroke="#10b981" 
      fill="url(#colorValue)" 
    />
  </AreaChart>
</ResponsiveContainer>
```

---

#### **Scientific/Mathematical Data Visualization**

**Chart Types:**
- **Heatmaps**: For correlation matrices, density plots
- **Scatter Plots**: For relationship analysis, clustering
- **3D Surface Plots**: For multi-dimensional data
- **Network Graphs**: For relationship mapping

**Recommended Libraries:**
```javascript
// D3.js (for custom, complex visualizations)
import * as d3 from 'd3';

// Three.js (for 3D visualizations)
import * as THREE from 'three';

// Recharts (for standard scientific charts)
import { ScatterChart, Scatter } from 'recharts';
```

**Heatmap Implementation Pattern:**
```jsx
// Using D3.js for heatmap
const createHeatmap = (data, container) => {
  const colorScale = d3.scaleSequential(d3.interpolateViridis)
    .domain([d3.min(data), d3.max(data)]);
  
  const svg = d3.select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height);
  
  // Add cells with tooltips
  svg.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('fill', d => colorScale(d.value))
    .on('mouseover', showTooltip)
    .on('mouseout', hideTooltip);
};
```

---

#### **Interactivity Requirements (Mandatory)**

**All charts MUST support:**
1. **Zoom**: Click and drag to zoom into data regions
2. **Pan**: Drag to move across the data
3. **Hover Details**: Show exact values on hover
4. **Click Actions**: Navigate to detail views or filter data
5. **Legend Toggling**: Click legend items to show/hide data series

**Example Interactive Pattern:**
```jsx
const [zoomDomain, setZoomDomain] = useState(null);
const [selectedPoint, setSelectedPoint] = useState(null);

<ResponsiveContainer>
  <LineChart 
    data={data}
    onClick={(e) => setSelectedPoint(e.activePayload)}
    onMouseDown={(e) => handleZoomStart(e)}
    onMouseMove={(e) => handleZoomMove(e)}
    onMouseUp={(e) => handleZoomEnd(e)}
  >
    {/* Chart components */}
  </LineChart>
</ResponsiveContainer>
```

**❌ NEVER use static images for data visualization**

---

### **Step 3: Optimization Trinity (SEO, CRO, AIO)**

#### **SEO (Search Engine Optimization)**

**Semantic HTML (Mandatory):**
```jsx
// ✅ GOOD - Semantic structure
<article className="dashboard-section">
  <header>
    <h1>Patient Flow Analysis</h1>
  </header>
  <section className="chart-container">
    <figure>
      <LineChart data={data} />
      <figcaption>Treatment outcomes over 12 months</figcaption>
    </figure>
  </section>
</article>

// ❌ BAD - Generic divs
<div className="dashboard-section">
  <div className="title">Patient Flow Analysis</div>
  <div className="chart-container">
    <LineChart data={data} />
  </div>
</div>
```

**Auto-Generated Meta Tags:**
```jsx
// Create a MetaTags component for every page
import { Helmet } from 'react-helmet-async';

const MetaTags = ({ title, description, keywords, image }) => (
  <Helmet>
    <title>{title} | PPN Research Portal</title>
    <meta name="description" content={description} />
    <meta name="keywords" content={keywords.join(', ')} />
    
    {/* Open Graph */}
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={image} />
    
    {/* Twitter Card */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
  </Helmet>
);
```

---

#### **CRO (Conversion Rate Optimization)**

**Call-to-Action (CTA) Placement Rules:**
1. **Above the Fold**: Primary CTA visible without scrolling
2. **High Contrast**: Use colors that stand out (e.g., emerald-500 on dark background)
3. **Clear Copy**: Action-oriented text ("Start Protocol" not "Click Here")
4. **Visual Hierarchy**: Larger, bolder than secondary actions

**CTA Implementation Pattern:**
```jsx
<div className="cta-container">
  {/* Primary CTA - High visibility */}
  <button className="
    px-8 py-4 
    bg-emerald-500 hover:bg-emerald-400 
    text-slate-900 font-bold text-lg
    rounded-lg shadow-lg shadow-emerald-500/20
    transform hover:scale-105 transition-all
  ">
    Create New Protocol
  </button>
  
  {/* Secondary CTA - Lower emphasis */}
  <button className="
    px-6 py-3 
    border border-slate-600 hover:border-slate-500
    text-slate-300 font-medium
    rounded-lg transition-colors
  ">
    View Documentation
  </button>
</div>
```

**Conversion Tracking Points:**
- Form submissions
- Button clicks
- Page scroll depth
- Time on page
- Chart interactions

---

#### **AIO (AI Optimization)**

**Schema.org JSON-LD Implementation:**

```jsx
// Add structured data to every page
const StructuredData = ({ type, data }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": type,
    ...data
  };
  
  return (
    <script 
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

// Example: Medical Research Dataset
<StructuredData 
  type="Dataset"
  data={{
    name: "Psychedelic Treatment Outcomes",
    description: "Aggregated clinical outcomes from psychedelic-assisted therapy",
    creator: {
      "@type": "Organization",
      name: "Psychedelic Provider Network"
    },
    distribution: {
      "@type": "DataDownload",
      encodingFormat: "application/json",
      contentUrl: "/api/datasets/outcomes"
    }
  }}
/>
```

**AI-Friendly Data Attributes:**
```jsx
// Add data attributes for AI parsing
<div 
  data-entity-type="clinical-metric"
  data-metric-name="response-rate"
  data-metric-value="78.5"
  data-metric-unit="percent"
>
  Response Rate: 78.5%
</div>
```

---

## 🚫 Constraints & Performance Rules

### **Library Weight Limits**
- **Maximum Bundle Size**: 500KB per page (gzipped)
- **Chart Libraries**: Choose ONE primary library (Recharts recommended)
- **3D Visualizations**: Load Three.js only when needed (lazy load)
- **Code Splitting**: Use React.lazy() for heavy components

```jsx
// Lazy load heavy chart components
const HeatmapChart = React.lazy(() => import('./charts/HeatmapChart'));
const Surface3D = React.lazy(() => import('./charts/Surface3D'));

<Suspense fallback={<ChartSkeleton />}>
  <HeatmapChart data={data} />
</Suspense>
```

### **Python Backend Data Format**

**Required JSON Structure:**
```python
# Python backend response format
{
  "data": [
    {
      "timestamp": "2026-02-11T00:00:00Z",
      "value": 42.5,
      "category": "outcome_positive",
      "metadata": {
        "confidence": 0.95,
        "sample_size": 120
      }
    }
  ],
  "schema": {
    "fields": [
      {"name": "timestamp", "type": "datetime"},
      {"name": "value", "type": "float"},
      {"name": "category", "type": "string"}
    ]
  },
  "aggregations": {
    "mean": 42.5,
    "median": 41.0,
    "std_dev": 5.2
  }
}
```

**Backend Performance Rules:**
- Return pre-aggregated data (don't send raw records)
- Use pagination for large datasets (max 1000 points per request)
- Include data schema in response
- Compress responses with gzip

---

## ✅ Quality Checklist

Before marking any data visualization work complete, verify:

### **Design Quality**
- [ ] Follows modern design trends (Glassmorphism/Bento Grid/etc.)
- [ ] Dark mode optimized with high contrast
- [ ] Consistent spacing and typography
- [ ] Responsive at all breakpoints (mobile, tablet, desktop)

### **Accessibility**
- [ ] All colors have sufficient contrast (WCAG AAA)
- [ ] No color-only meaning (icons/labels present)
- [ ] All tooltips are keyboard accessible
- [ ] Font sizes meet minimum requirements (≥10pt)
- [ ] Full keyboard navigation support

### **Data Visualization**
- [ ] Charts are interactive (zoom, pan, hover)
- [ ] Tooltips show exact values
- [ ] Legend is clickable for filtering
- [ ] Loading states are handled gracefully
- [ ] Error states are user-friendly
- [ ] No static images used for data

### **Optimization**
- [ ] Semantic HTML tags used throughout
- [ ] Meta tags auto-generated for SEO
- [ ] CTAs are high-contrast and visible
- [ ] Schema.org JSON-LD added
- [ ] Bundle size under 500KB
- [ ] Data from backend is pre-aggregated

### **Performance**
- [ ] Heavy libraries are lazy-loaded
- [ ] Charts render in <1 second
- [ ] No layout shift on load
- [ ] Smooth animations (60fps)

---

## 📚 Related Skills

- **tooltip-implementation**: Detailed guide for implementing tooltips
- **frontend-best-practices**: Coding standards and linting rules
- **accessibility-checker**: WCAG compliance verification
- **browser**: Visual testing and verification

---

## 🎓 Examples

### **Example 1: Financial Dashboard Card**

```jsx
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Info } from 'lucide-react';
import { AdvancedTooltip } from '@/components/ui/AdvancedTooltip';

const FinancialMetricCard = ({ title, value, trend, data, description }) => (
  <article className="
    relative overflow-hidden
    bg-slate-800/50 backdrop-blur-sm
    border border-slate-700/50
    rounded-xl p-6
    hover:border-slate-600/50 transition-all
  ">
    {/* Header */}
    <header className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-slate-400 text-sm font-medium flex items-center gap-2">
          {title}
          <AdvancedTooltip content={description} tier="standard">
            <Info className="w-4 h-4 text-slate-500 hover:text-slate-400" />
          </AdvancedTooltip>
        </h3>
        <p className="text-3xl font-bold text-slate-100 mt-1">
          ${value.toLocaleString()}
        </p>
      </div>
      
      {/* Trend Indicator */}
      <div className={`
        flex items-center gap-1 px-3 py-1 rounded-full
        ${trend > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}
      `}>
        <TrendingUp className="w-4 h-4" />
        <span className="text-sm font-medium">{trend}%</span>
      </div>
    </header>
    
    {/* Chart */}
    <ResponsiveContainer width="100%" height={100}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis dataKey="date" hide />
        <YAxis hide />
        <Tooltip 
          contentStyle={{
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '8px'
          }}
        />
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke="#10b981" 
          fill="url(#gradient)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
    
    {/* Schema.org Structured Data */}
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "MonetaryAmount",
        "currency": "USD",
        "value": value
      })}
    </script>
  </article>
);
```

### **Example 2: Scientific Heatmap with Accessibility**

```jsx
import { useMemo } from 'react';
import { scaleSequential } from 'd3-scale';
import { interpolateViridis } from 'd3-scale-chromatic';
import { AdvancedTooltip } from '@/components/ui/AdvancedTooltip';

const CorrelationHeatmap = ({ data, labels }) => {
  const colorScale = useMemo(
    () => scaleSequential(interpolateViridis).domain([-1, 1]),
    []
  );
  
  return (
    <figure className="w-full" role="img" aria-label="Correlation heatmap">
      <div className="grid gap-1" style={{ 
        gridTemplateColumns: `repeat(${labels.length}, 1fr)` 
      }}>
        {data.map((row, i) => 
          row.map((value, j) => (
            <AdvancedTooltip
              key={`${i}-${j}`}
              content={`${labels[i]} vs ${labels[j]}: ${value.toFixed(2)}`}
              tier="micro"
            >
              <div
                className="aspect-square rounded transition-transform hover:scale-110"
                style={{ backgroundColor: colorScale(value) }}
                role="gridcell"
                aria-label={`Correlation: ${value.toFixed(2)}`}
                tabIndex={0}
              >
                {/* Pattern overlay for accessibility */}
                {value < -0.5 && (
                  <div className="w-full h-full opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,white_2px,white_4px)]" />
                )}
              </div>
            </AdvancedTooltip>
          ))
        )}
      </div>
      
      {/* Legend with labels (not just colors) */}
      <figcaption className="mt-4 flex items-center justify-between text-sm text-slate-400">
        <span className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: colorScale(-1) }} />
          Strong Negative
        </span>
        <span className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: colorScale(0) }} />
          No Correlation
        </span>
        <span className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: colorScale(1) }} />
          Strong Positive
        </span>
      </figcaption>
    </figure>
  );
};
```

---

**END OF MASTER DATA UX SKILL**
