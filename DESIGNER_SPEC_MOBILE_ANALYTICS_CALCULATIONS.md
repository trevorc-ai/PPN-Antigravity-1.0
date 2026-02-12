# 📱 DESIGNER SPEC: MOBILE ANALYTICS CALCULATIONS
## Data Formulas & Visual Expectations for Mobile Dashboards

**For:** DESIGNER  
**From:** LEAD  
**Date:** 2026-02-12 04:17 PST  
**Purpose:** Complete calculation specs for mobile visual design

---

## 🎯 OVERVIEW

DESIGNER needs to build mobile visuals for:
1. **Safety Score Gauge** (0-100 speedometer)
2. **Network Benchmarking** (percentile rank, comparison)
3. **Adverse Event Rate** (percentage calculation)
4. **Trend Charts** (protocols over time, adverse events)
5. **Compliance Metrics** (session counts, safety scores)

This document provides **exact formulas** and **expected data ranges** so DESIGNER can build accurate mobile mockups.

---

## 📊 1. SAFETY SCORE CALCULATION

### **Formula:**
```
Safety Score = 100 - (Adverse Event Rate × 10)

Where:
Adverse Event Rate = (Total Adverse Events / Total Protocols) × 100
```

### **Example Calculation:**
```
Total Protocols: 127
Total Adverse Events: 3

Adverse Event Rate = (3 / 127) × 100 = 2.36%
Safety Score = 100 - (2.36 × 10) = 100 - 23.6 = 76.4

Rounded: 76/100
```

### **Expected Ranges:**
- **Excellent:** 90-100 (0-1% adverse events)
- **Good:** 75-89 (1.1-2.5% adverse events)
- **Fair:** 60-74 (2.6-4% adverse events)
- **Poor:** <60 (>4% adverse events)

### **Visual Design (Mobile):**
```
┌─────────────────────────────────┐
│  Your Safety Score              │
│                                 │
│      ╭─────────────╮            │
│     ╱       92      ╲           │
│    │   ───────────   │          │
│    │  ▓▓▓▓▓▓▓▓▓░░░  │          │
│     ╲               ╱           │
│      ╰─────────────╯            │
│                                 │
│  Excellent (90-100)             │
│  2.3% adverse event rate        │
└─────────────────────────────────┘

Color zones:
- 0-60: Red (#ef4444)
- 60-75: Yellow (#f59e0b)
- 75-90: Blue (#3b82f6)
- 90-100: Green (#10b981)
```

### **Data DESIGNER Should Expect:**
```javascript
{
  safetyScore: 92,           // Integer 0-100
  adverseEventRate: 2.3,     // Float (percentage)
  totalProtocols: 127,       // Integer
  totalAdverseEvents: 3,     // Integer
  scoreCategory: "Excellent" // String: Excellent, Good, Fair, Poor
}
```

---

## 📈 2. NETWORK BENCHMARKING CALCULATION

### **Formula:**
```
Percentile Rank = (Number of sites with worse score / Total sites) × 100

Your Rank = "Better than X% of network"
```

### **Example Calculation:**
```
Your adverse event rate: 2.3%
Network data (14 sites):
- Site A: 1.8% (better than you)
- Site B: 2.1% (better than you)
- Site C: 2.3% (same as you)
- Site D: 2.7% (worse than you)
- Site E: 3.1% (worse than you)
- ... (9 more sites, all worse)

Sites worse than you: 11
Total sites: 14

Percentile = (11 / 14) × 100 = 78.6%
Rounded: 79th percentile

Message: "Better than 79% of network"
```

### **Visual Design (Mobile):**
```
┌─────────────────────────────────┐
│  Network Benchmarking           │
│                                 │
│  Your Rate: 2.3%                │
│  ▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░        │
│                                 │
│  Network Avg: 3.1%              │
│  ▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░        │
│                                 │
│  ┌─────────────────────┐        │
│  │  79th Percentile    │        │
│  │  Better than 79%    │        │
│  │  of network         │        │
│  └─────────────────────┘        │
│                                 │
│  🟢 Performing well             │
└─────────────────────────────────┘

Color coding:
- Your rate < Network avg: Green (good)
- Your rate = Network avg: Blue (average)
- Your rate > Network avg: Yellow (needs attention)
- Your rate > 2× Network avg: Red (critical)
```

### **Data DESIGNER Should Expect:**
```javascript
{
  yourRate: 2.3,              // Float (percentage)
  networkAverage: 3.1,        // Float (percentage)
  percentileRank: 79,         // Integer 0-100
  totalSites: 14,             // Integer
  sitesWorseThanYou: 11,      // Integer
  sitesBetterThanYou: 2,      // Integer
  status: "performing_well"   // String: performing_well, average, needs_attention, critical
}
```

---

## 📉 3. ADVERSE EVENT RATE CALCULATION

### **Formula:**
```
Adverse Event Rate = (Total Adverse Events / Total Protocols) × 100
```

### **Example Calculation:**
```
Total Protocols: 127
Total Adverse Events: 3

Adverse Event Rate = (3 / 127) × 100 = 2.36%
Rounded: 2.4%
```

### **Severity Breakdown:**
```
Total Adverse Events: 3
- Mild (Grade 1): 1 event (33%)
- Moderate (Grade 2): 2 events (67%)
- Severe (Grade 3): 0 events (0%)
- Life-threatening (Grade 4): 0 events (0%)
```

### **Visual Design (Mobile):**
```
┌─────────────────────────────────┐
│  Adverse Events                 │
│                                 │
│  Total: 3 (2.4% of protocols)   │
│                                 │
│  Severity Breakdown:            │
│  ┌───────────────────────────┐  │
│  │ Mild       ▓▓░░░░  1 (33%)│  │
│  │ Moderate   ▓▓▓▓░░  2 (67%)│  │
│  │ Severe     ░░░░░░  0 (0%) │  │
│  │ Critical   ░░░░░░  0 (0%) │  │
│  └───────────────────────────┘  │
│                                 │
│  Last 30 days: 1 event          │
│  Last 90 days: 3 events         │
└─────────────────────────────────┘

Color coding:
- Mild: Blue (#3b82f6)
- Moderate: Yellow (#f59e0b)
- Severe: Orange (#f97316)
- Critical: Red (#ef4444)
```

### **Data DESIGNER Should Expect:**
```javascript
{
  totalAdverseEvents: 3,
  totalProtocols: 127,
  adverseEventRate: 2.4,      // Float (percentage)
  severityBreakdown: {
    mild: { count: 1, percentage: 33 },
    moderate: { count: 2, percentage: 67 },
    severe: { count: 0, percentage: 0 },
    critical: { count: 0, percentage: 0 }
  },
  recentEvents: {
    last30Days: 1,
    last90Days: 3
  }
}
```

---

## 📅 4. TREND CHART CALCULATIONS

### **Protocols Over Time:**
```
Data points (last 12 weeks):
Week 1: 5 protocols
Week 2: 8 protocols
Week 3: 12 protocols
Week 4: 15 protocols
Week 5: 18 protocols
Week 6: 22 protocols
Week 7: 25 protocols
Week 8: 28 protocols
Week 9: 30 protocols
Week 10: 32 protocols
Week 11: 35 protocols
Week 12: 38 protocols

Trend: ↗ Increasing (good)
Growth rate: +660% (Week 1 to Week 12)
```

### **Adverse Events Over Time:**
```
Data points (last 12 weeks):
Week 1: 0 events (0%)
Week 2: 0 events (0%)
Week 3: 1 event (8.3%)
Week 4: 0 events (0%)
Week 5: 0 events (0%)
Week 6: 1 event (4.5%)
Week 7: 0 events (0%)
Week 8: 0 events (0%)
Week 9: 0 events (0%)
Week 10: 0 events (0%)
Week 11: 0 events (0%)
Week 12: 1 event (2.6%)

Trend: → Stable (good)
Average rate: 2.4%
```

### **Visual Design (Mobile):**
```
┌─────────────────────────────────┐
│  Protocol Trends (12 weeks)     │
│                                 │
│  38 ┤                        ●  │
│  30 ┤                    ●       │
│  22 ┤              ●             │
│  15 ┤        ●                   │
│   8 ┤    ●                       │
│   0 └─────────────────────────  │
│     W1  W4  W7  W10 W12         │
│                                 │
│  ↗ +660% growth                 │
│  Current: 38 protocols/week     │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  Adverse Event Rate (12 weeks)  │
│                                 │
│  10%┤                            │
│   8%┤    ●                       │
│   5%┤          ●                 │
│   3%┤                        ●   │
│   0%└─────────────────────────  │
│     W1  W4  W7  W10 W12         │
│                                 │
│  → Stable at 2.4%               │
│  Network avg: 3.1%              │
└─────────────────────────────────┘
```

### **Data DESIGNER Should Expect:**
```javascript
{
  protocolTrends: [
    { week: 1, count: 5 },
    { week: 2, count: 8 },
    { week: 3, count: 12 },
    // ... 12 data points
  ],
  adverseEventTrends: [
    { week: 1, count: 0, rate: 0 },
    { week: 2, count: 0, rate: 0 },
    { week: 3, count: 1, rate: 8.3 },
    // ... 12 data points
  ],
  growthRate: 660,           // Integer (percentage)
  trendDirection: "increasing" // String: increasing, stable, decreasing
}
```

---

## 📋 5. COMPLIANCE METRICS

### **Quarterly Report Data:**
```
Reporting Period: Q1 2026 (Jan 1 - Mar 31)
Total Sessions: 127
Total Adverse Events: 3
Adverse Event Rate: 2.4%
Safety Score: 97.6/100

Compliance Status: ✅ COMPLIANT
```

### **Breakdown by Month:**
```
January:
- Sessions: 35
- Adverse Events: 1
- Rate: 2.9%
- Score: 97.1/100

February:
- Sessions: 42
- Adverse Events: 1
- Rate: 2.4%
- Score: 97.6/100

March:
- Sessions: 50
- Adverse Events: 1
- Rate: 2.0%
- Score: 98.0/100

Trend: ↗ Improving (rate decreasing, score increasing)
```

### **Visual Design (Mobile):**
```
┌─────────────────────────────────┐
│  Q1 2026 Compliance Report      │
│                                 │
│  ✅ COMPLIANT                   │
│                                 │
│  Sessions: 127                  │
│  Adverse Events: 3 (2.4%)       │
│  Safety Score: 97.6/100         │
│                                 │
│  Monthly Breakdown:             │
│  ┌───────────────────────────┐  │
│  │ Jan  35 sessions  97.1    │  │
│  │ Feb  42 sessions  97.6    │  │
│  │ Mar  50 sessions  98.0 ↗  │  │
│  └───────────────────────────┘  │
│                                 │
│  [Export PDF] [Email Report]    │
└─────────────────────────────────┘
```

### **Data DESIGNER Should Expect:**
```javascript
{
  reportingPeriod: "Q1 2026",
  dateRange: {
    start: "2026-01-01",
    end: "2026-03-31"
  },
  totalSessions: 127,
  totalAdverseEvents: 3,
  adverseEventRate: 2.4,
  safetyScore: 97.6,
  complianceStatus: "compliant", // String: compliant, non_compliant
  monthlyBreakdown: [
    { month: "January", sessions: 35, events: 1, rate: 2.9, score: 97.1 },
    { month: "February", sessions: 42, events: 1, rate: 2.4, score: 97.6 },
    { month: "March", sessions: 50, events: 1, rate: 2.0, score: 98.0 }
  ],
  trend: "improving" // String: improving, stable, declining
}
```

---

## 🎨 MOBILE DESIGN CONSTRAINTS

### **Screen Sizes:**
- **Mobile:** 375px × 667px (iPhone SE)
- **Mobile Large:** 414px × 896px (iPhone 11)
- **Tablet:** 768px × 1024px (iPad)

### **Touch Targets:**
- Minimum: 44px × 44px (Apple HIG)
- Recommended: 48px × 48px (Material Design)

### **Font Sizes (Mobile):**
- **Heading 1:** 24px (1.5rem)
- **Heading 2:** 20px (1.25rem)
- **Heading 3:** 18px (1.125rem)
- **Body:** 16px (1rem)
- **Small:** 14px (0.875rem)
- **Minimum:** 12px (0.75rem) - use sparingly

### **Spacing (Mobile):**
- **Card padding:** 16px
- **Section spacing:** 24px
- **Element spacing:** 8px
- **Tight spacing:** 4px

### **Colors (Consistent with Desktop):**
- **Primary:** Indigo (#6366f1)
- **Success:** Green (#10b981)
- **Warning:** Yellow (#f59e0b)
- **Error:** Red (#ef4444)
- **Info:** Blue (#3b82f6)
- **Background:** Dark navy (#0f172a)
- **Card:** Slate (#1e293b)

---

## 📊 EXAMPLE DATA SETS FOR MOCKUPS

### **Scenario 1: Excellent Performance**
```javascript
{
  safetyScore: 95,
  adverseEventRate: 1.2,
  totalProtocols: 250,
  totalAdverseEvents: 3,
  percentileRank: 92,
  networkAverage: 3.1,
  status: "performing_well"
}
```

### **Scenario 2: Average Performance**
```javascript
{
  safetyScore: 78,
  adverseEventRate: 3.2,
  totalProtocols: 127,
  totalAdverseEvents: 4,
  percentileRank: 48,
  networkAverage: 3.1,
  status: "average"
}
```

### **Scenario 3: Needs Attention**
```javascript
{
  safetyScore: 62,
  adverseEventRate: 4.8,
  totalProtocols: 85,
  totalAdverseEvents: 4,
  percentileRank: 22,
  networkAverage: 3.1,
  status: "needs_attention"
}
```

### **Scenario 4: Critical**
```javascript
{
  safetyScore: 45,
  adverseEventRate: 7.2,
  totalProtocols: 50,
  totalAdverseEvents: 4,
  percentileRank: 8,
  networkAverage: 3.1,
  status: "critical"
}
```

---

## ✅ DESIGNER CHECKLIST

### **Before Starting Design:**
- [ ] Understand all formulas (safety score, percentile, adverse event rate)
- [ ] Know expected data ranges (0-100 for scores, 0-10% for rates)
- [ ] Review color coding (green = good, red = bad)
- [ ] Check mobile constraints (375px width, 44px touch targets)

### **While Designing:**
- [ ] Use exact formulas provided (don't invent new calculations)
- [ ] Show realistic data (use example scenarios)
- [ ] Include all data points (score, rate, percentile, network avg)
- [ ] Add status indicators (✅ compliant, ⚠️ needs attention, 🔴 critical)
- [ ] Test readability on mobile (fonts ≥12px)

### **After Design:**
- [ ] Verify calculations match formulas
- [ ] Check color accessibility (contrast ratios)
- [ ] Test touch targets (≥44px)
- [ ] Review with BUILDER (ensure data structure matches)

---

**Status:** ✅ Calculation specs complete  
**Next:** DESIGNER builds mobile mockups  
**Priority:** 🔴 CRITICAL - Needed for Safety Surveillance + Benchmarking features
