# 🎨 DESIGNER STRATEGIC BRIEF: VoC-Driven UX Transformation
## PPN Research Portal - Demo Readiness & Future Vision

**Date:** 2026-02-12 06:02 PST  
**Prepared By:** LEAD  
**For:** DESIGNER  
**Context:** Demo in 2.5 days (Feb 15, 2026) + Long-term product vision  
**Temperature:** 2 (focused, deterministic execution)

---

## 📊 EXECUTIVE SUMMARY

**Mission:**
Transform the PPN Research Portal from a "feature platform" into a **Practice Operating System** that solves the #1 pain point identified in comprehensive Voice of Customer research: **workflow chaos and administrative burnout**.

**Strategic Shift:**
- **OLD:** "Defensible Documentation for Psychedelic Practitioners"
- **NEW:** "The Practice Operating System for Psychedelic Therapy"

**Why This Matters:**
Practitioners don't need more tools—they need **fewer, better-integrated tools**. VoC research shows they're using 4-5 disconnected systems (IntakeQ, Spruce, Spotify, Excel, SimplePractice), leading to burnout and data silos.

---

## 🎯 YOUR ROLE: STRATEGIC DESIGNER

You are not just implementing features. You are **solving practitioner pain** through thoughtful, evidence-based design.

**Your North Star:**
> "Help me feel safe, help me get paid, and help me do this work without burning out."  
> — VoC synthesis from 250+ practitioner data points

**Your Constraints:**
- **Skills:** `master-data-ux` + `frontend-best-practices` + `browser`
- **Temperature:** 2 (precise, consistent, VoC-aligned)
- **Timeline:** Demo in 2.5 days (critical path items first)
- **Quality Bar:** Every design must pass accessibility, performance, and VoC alignment checks

---

## 📚 REQUIRED READING (Context Documents)

Before starting any design work, review these documents in order:

### **1. Voice of Customer Research** (Foundation)
- **File:** `.agent/research/📊 VoC Analysis Psychedelic Therapy.md`
- **Key Sections:**
  - Section 4.1: "The Software and Workflow Failure" (PRIMARY PAIN POINT)
  - Section 4.2: "The Supervision and Mentorship Vacuum"
  - Section 4.4: "Client Retention and Integration Failure"
- **Takeaway:** Practitioners are drowning in fragmented tools and need integrated workflows

### **2. VoC-Aligned Use Cases** (What to Build)
- **File:** `USE_CASES_VOC_ALIGNED_2026.md`
- **Critical Use Cases:**
  - Use Case 6: "Solve the Software/Workflow Failure" (NEW - Priority 1)
  - Use Case 7: "Find Peer Supervision & Mentorship" (NEW - Priority 2)
  - Use Case 8: "Standardize Integration Protocols" (NEW - Priority 3)
- **Takeaway:** We identified 3 missing use cases that are HIGH VoC demand

### **3. Design Skills** (How to Execute)
- **File:** `.agent/skills/master-data-ux/SKILL.md`
- **File:** `.agent/skills/frontend-best-practices/SKILL.md`
- **Takeaway:** Your execution framework (modern design + data viz + accessibility)

### **4. Current State** (What's Broken)
- **Protocol Builder Investigation:** Accordions not rendering, broken Tailwind classes
- **Missing Features:** Session logger, supervision exchange, integration hub
- **Takeaway:** Fix existing + build new

---

## 🔴 CRITICAL PATH: DEMO READINESS (2.5 Days)

### **Priority 1: Fix Protocol Builder** (CRITICAL - 4 hours)

**Problem:**
- Accordions not rendering (display: none)
- Broken Tailwind classes (`w - full` instead of `w-full`)
- Network 404 error (`ref_medications` table)
- **Impact:** Core data entry tool is unusable

**Your Task:**
1. **Fix Tailwind class names** (global regex replace)
   - Find: `(\w+)\s+-\s+(\w+)`
   - Replace: `$1-$2`
2. **Fix accordion state management**
   - Ensure `activeSection` defaults to `'demographics'`
   - Verify toggle handlers work
3. **Add missing tooltips** (VoC: practitioners need guidance)
   - Every scientific term needs a tooltip
   - Use `AdvancedTooltip` component (see `/create_tooltips` workflow)
4. **Verify accessibility**
   - Keyboard navigation works
   - Color + icon + text for all states
   - Min 14px font sizes

**Success Criteria:**
- ✅ All accordions render and expand/collapse
- ✅ All form fields visible and functional
- ✅ Tooltips on complex fields (substance, route, indication)
- ✅ Passes keyboard navigation test
- ✅ No console errors

**VoC Alignment:**
This fixes Use Case 1 ("Prove You're Not Reckless") and Use Case 2 ("Reduce Malpractice Exposure") by enabling standardized protocol documentation.

---

### **Priority 2: Enhance Protocol Builder UX** (MEDIUM - 2 hours)

**Problem:**
VoC shows practitioners want "measurement-based care without bureaucracy" but current Protocol Builder lacks:
- Visual progress indicator (exists but needs enhancement)
- Real-time validation feedback
- Contextual help for complex fields

**Your Task:**
1. **Enhance progress indicator**
   - Show section completion (e.g., "Demographics: 4/5 fields complete")
   - Use color + icon + text (not just color)
   - Make it sticky (always visible)
2. **Add inline validation**
   - Real-time feedback on required fields
   - Clear error messages (not just red borders)
   - Success states (green checkmark when complete)
3. **Add contextual help**
   - "Why we ask this" tooltips for sensitive fields
   - Examples for complex inputs (e.g., "Indication: PTSD, TRD, Anxiety")

**Success Criteria:**
- ✅ Practitioners know exactly what's required at all times
- ✅ Validation feedback is immediate and clear
- ✅ Help text reduces confusion and errors

**VoC Alignment:**
Addresses "administrative burnout" by making data entry faster and less error-prone.

---

## 🟡 MEDIUM PRIORITY: NEW USE CASE UIs (Post-Demo)

### **Use Case 6: Session Logger** (6-8 Hour Session Documentation)

**VoC Context:**
> "A typical practitioner describes a workflow that is a patchwork of disconnected tools... This fragmentation leads to 'administrative burnout' and data silos."

**Problem:**
Standard EHRs are built for 15-minute med checks, not 6-8 hour psychedelic sessions. Practitioners need a **tap-to-log** interface that generates narrative charts automatically.

**Your Design Challenge:**
Create a **Digital Clinical Container** that:
1. **Session Timeline** (Interactive)
   - Horizontal timeline (0-8 hours)
   - Tap-to-log events (e.g., "14:00 - Distress", "14:15 - Booster", "14:30 - Music Change")
   - Color-coded event types (distress = rose-500, breakthrough = emerald-500)
   - Zoom/pan for detailed view
2. **Event Logger** (Quick Input)
   - Pre-defined event buttons (Distress, Breakthrough, Music Change, Vital Signs)
   - Custom event option (structured, not free-text)
   - Timestamp auto-captured
3. **Auto-Generated Chart Note**
   - Real-time narrative generation from logged events
   - Copy-to-clipboard for EHR
   - PDF export option

**Design Requirements:**
- **master-data-ux:** Interactive timeline chart (Recharts or D3.js)
- **frontend-best-practices:** Glassmorphism cards, emerald-500 CTAs, min 14px fonts
- **Accessibility:** Keyboard shortcuts for common events, ARIA labels, color + icon + text

**Success Metrics:**
- Time to log 8-hour session: <10 minutes (vs. 30+ minutes manual)
- Practitioner satisfaction: "This saves my life" feedback
- Adoption: >80% of practitioners use it weekly

**VoC Alignment:**
Directly solves VoC Priority #1: "The Software and Workflow Failure"

---

### **Use Case 7: Supervision Exchange** (Peer Matching & Mentorship)

**VoC Context:**
> "The transition from 'trainee' to 'practitioner' is described as a perilous cliff. Once in practice, clinicians feel isolated."

**Problem:**
Practitioners need peer supervision for complex cases (transference, spiritual emergencies, adverse events) but have no centralized marketplace. They're stuck in informal, inadequate networks.

**Your Design Challenge:**
Create a **Supervision Exchange** that:
1. **Practitioner Directory** (Searchable)
   - Filter by: Specialty, Experience (years), Modality, Availability
   - Card layout (Bento grid)
   - Each card shows: Name, Credentials, Specialties, Hourly Rate, Availability
   - "Request Supervision" CTA (emerald-500)
2. **Dyad Matching Algorithm** (Visual)
   - Network graph showing complementary skills
   - Example: Psychiatrist (needs somatic help) ↔ Legacy Guide (needs medical help)
   - "Suggest Match" feature
3. **Circle System** (Small Group Cohorts)
   - 6-8 practitioner cohorts
   - Monthly case consultation
   - Scheduling integration
   - Confidentiality agreements

**Design Requirements:**
- **master-data-ux:** Network graph (D3.js), Bento grid layout, interactive filtering
- **frontend-best-practices:** Card glassmorphism, accessible filters, keyboard nav
- **Accessibility:** Screen reader support for network graph, high-contrast mode

**Success Metrics:**
- Practitioner matches: >50% find supervision partner in first month
- Circle participation: >40% join a circle
- Retention: <5% monthly churn (vs. 15% industry average)

**VoC Alignment:**
Directly solves VoC Priority #2: "The Supervision and Mentorship Vacuum"

---

### **Use Case 8: Integration Hub** (Structured Protocols & Homework)

**VoC Context:**
> "Integration is the most common 'bridge concept' between practitioner intent and client outcomes. It is described as necessary, but also expensive and time-consuming."

**Problem:**
Practitioners know integration is critical but lack structured tools. Clients drop off without psychological scaffolding, leading to high churn and poor outcomes.

**Your Design Challenge:**
Create an **Integration Hub** that:
1. **Neuroplasticity Window Tracker** (Visual Timeline)
   - Area chart showing optimal integration window (0-7 days post-dose)
   - Color-coded phases: Peak (emerald), Declining (amber), Closed (slate)
   - Homework assignments mapped to timeline
2. **Homework Assignment Tool** (Structured)
   - Pre-defined homework templates (journaling, meditation, therapy sessions)
   - Custom homework builder (structured, not free-text)
   - Progress tracking (checkboxes, completion %)
3. **Integration Measurement** (Automated)
   - IES/EIS scale auto-sent at intervals (24h, 1 week, 1 month)
   - Line chart showing integration scores over time
   - Alerts for declining scores

**Design Requirements:**
- **master-data-ux:** Area chart (neuroplasticity), line chart (IES/EIS), interactive timeline
- **frontend-best-practices:** Progress bars with color + icon + text, accessible forms
- **Accessibility:** Keyboard-navigable homework checklist, screen reader support

**Success Metrics:**
- Client churn: 30% reduction (from 40% to 28%)
- Integration completion: >60% complete all homework
- Practitioner satisfaction: "This keeps clients engaged" feedback

**VoC Alignment:**
Directly solves VoC Priority #3: "Client Retention and Integration Failure"

---

## 🎨 DESIGN SYSTEM REFERENCE

### **Color Palette (Strict - No Deviations)**

```css
/* Primary Brand */
--emerald-500: #10b981  /* CTAs, success, active states */
--emerald-400: #34d399  /* Hover states */

/* Backgrounds */
--slate-900: #0f172a    /* Page background */
--slate-800: #1e293b    /* Card background */
--slate-700: #334155    /* Borders */

/* Text */
--slate-300: #cbd5e1    /* Body text */
--slate-400: #94a3b8    /* Secondary text */
--slate-100: #f1f5f9    /* Headings */

/* Semantic */
--rose-500: #f43f5e     /* Error, distress, danger */
--amber-500: #f59e0b    /* Warning, caution */
--blue-500: #3b82f6     /* Info, neutral */
```

### **Typography (Minimum Enforced)**

```css
/* Body */
font-size: 16px;  /* text-base */

/* Labels */
font-size: 14px;  /* text-sm */

/* Headings */
font-size: 24px+; /* text-2xl */

/* ❌ NEVER use text-xs (12px) except chart legends */
```

### **Spacing (Consistent)**

```css
/* Card Padding */
padding: 1.5rem; /* p-6 */
padding: 2rem;   /* p-8 */

/* Section Spacing */
gap: 2rem; /* space-y-8 */

/* Grid Gaps */
gap: 1.5rem; /* gap-6 */
```

### **Component Patterns**

**Glassmorphism Card:**
```tsx
<div className="
  bg-slate-800/50 backdrop-blur-sm
  border border-slate-700/50
  rounded-xl p-6
  hover:border-slate-600/50 
  transition-all
">
  {/* Content */}
</div>
```

**Primary CTA:**
```tsx
<button className="
  px-6 py-3
  bg-emerald-500 hover:bg-emerald-400
  text-slate-900 font-semibold
  rounded-lg shadow-lg
  focus:ring-2 focus:ring-emerald-500
">
  Create Protocol
</button>
```

**Secondary Button:**
```tsx
<button className="
  px-6 py-3
  border border-slate-600 hover:border-slate-500
  text-slate-300
  rounded-lg
  focus:ring-2 focus:ring-slate-500
">
  Cancel
</button>
```

---

## ♿ ACCESSIBILITY (NON-NEGOTIABLE)

### **Color Blindness Support**

**❌ NEVER use color alone:**
```tsx
<div className="text-rose-500">Error</div>
```

**✅ ALWAYS use color + icon + text:**
```tsx
<div className="flex items-center gap-2 text-rose-500">
  <AlertTriangle className="w-5 h-5" />
  <span>Error: Unable to save protocol</span>
</div>
```

### **Keyboard Navigation**

**All interactive elements MUST:**
- Be reachable via Tab
- Have visible focus states (`focus:ring-2`)
- Work with Enter/Space

**Example:**
```tsx
<button className="
  focus:outline-none 
  focus:ring-2 
  focus:ring-emerald-500
  focus:ring-offset-2
  focus:ring-offset-slate-900
">
  Submit
</button>
```

### **Contrast Requirements**

- **Normal text:** 7:1 (AAA) or 4.5:1 (AA minimum)
- **Large text:** 4.5:1 (AAA) or 3:1 (AA minimum)

**Check:** Use browser DevTools Accessibility panel

---

## 📊 DATA VISUALIZATION REQUIREMENTS

### **Chart Interactivity (Mandatory)**

All charts MUST support:
1. **Zoom:** Click and drag to zoom into data regions
2. **Pan:** Drag to move across the data
3. **Hover Details:** Show exact values on hover
4. **Click Actions:** Navigate to detail views or filter data
5. **Legend Toggling:** Click legend items to show/hide data series

### **Tooltip Requirements**

**Every data point MUST have a tooltip with:**
- Exact value
- Context (what it means)
- Timestamp (when applicable)

**Example:**
```tsx
<Tooltip 
  content={({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg">
          <p className="text-sm font-bold text-slate-100">
            {payload[0].payload.label}
          </p>
          <p className="text-xs text-emerald-400">
            Value: {payload[0].value}
          </p>
          <p className="text-xs text-slate-400">
            {payload[0].payload.timestamp}
          </p>
        </div>
      );
    }
    return null;
  }}
/>
```

### **Performance Constraints**

- **Max bundle size:** 500KB per page (gzipped)
- **Chart render time:** <1 second
- **Lazy load heavy components:** Use React.lazy()

```tsx
const HeatmapChart = React.lazy(() => import('./charts/HeatmapChart'));

<Suspense fallback={<ChartSkeleton />}>
  <HeatmapChart data={data} />
</Suspense>
```

---

## 🚀 WORKFLOW: HOW TO EXECUTE

### **Step 1: Read Context Documents** (30 minutes)
- VoC research (understand practitioner pain)
- Use cases (understand what to build)
- Skills (understand how to execute)

### **Step 2: Create Design Mockups** (Browser Skill)
- Use browser skill to view current state
- Take screenshots of broken/missing features
- Create visual mockups (can use generate_image if needed)

### **Step 3: Implement Designs** (Code)
- Follow frontend-best-practices (design system)
- Apply master-data-ux patterns (data viz)
- Test accessibility (keyboard nav, contrast, tooltips)

### **Step 4: Verify in Browser** (Browser Skill)
- Load page in browser
- Test all interactions (click, hover, keyboard)
- Verify tooltips render correctly
- Check console for errors

### **Step 5: Document Changes**
- Update relevant docs (if new patterns introduced)
- Create screenshots for demo
- Note any deviations from plan (with justification)

---

## ✅ QUALITY CHECKLIST

Before marking any work complete, verify:

### **Design Quality**
- [ ] Follows design system (colors, spacing, typography)
- [ ] Glassmorphism applied to cards
- [ ] Dark mode optimized with high contrast
- [ ] Responsive at all breakpoints (mobile, tablet, desktop)

### **Accessibility**
- [ ] All colors have sufficient contrast (WCAG AAA)
- [ ] No color-only meaning (icons + labels present)
- [ ] All tooltips are keyboard accessible
- [ ] Font sizes meet minimum requirements (≥14px)
- [ ] Full keyboard navigation support
- [ ] Focus states visible on all interactive elements

### **Data Visualization**
- [ ] Charts are interactive (zoom, pan, hover)
- [ ] Tooltips show exact values + context
- [ ] Legend is clickable for filtering
- [ ] Loading states are handled gracefully
- [ ] Error states are user-friendly
- [ ] No static images used for data

### **VoC Alignment**
- [ ] Solves a specific practitioner pain point
- [ ] Reduces administrative burden (saves time)
- [ ] Improves data quality (reduces errors)
- [ ] Enhances safety (better documentation)

### **Performance**
- [ ] Heavy libraries are lazy-loaded
- [ ] Charts render in <1 second
- [ ] No layout shift on load
- [ ] Smooth animations (60fps)
- [ ] Bundle size under 500KB

---

## 🎯 SUCCESS METRICS

### **Demo Readiness (Feb 15, 2026)**
- ✅ Protocol Builder fully functional (accordions render, forms work)
- ✅ All tooltips implemented (guidance on complex fields)
- ✅ Keyboard navigation works (full accessibility)
- ✅ No console errors (clean demo)

### **Post-Demo (V1.5 - March 2026)**
- ✅ Session Logger implemented (Use Case 6)
- ✅ Supervision Exchange implemented (Use Case 7)
- ✅ Integration Hub implemented (Use Case 8)

### **Business Impact (6 Months)**
- **Time saved:** 5-10 hours/week per practitioner (workflow integration)
- **Reduced isolation:** 50% reduction in "lone wolf" sentiment
- **Better retention:** 30% reduction in client churn
- **NPS score:** >50 (practitioners love it)

---

## 📞 COMMUNICATION PROTOCOL

### **When to Ask LEAD for Help:**
- VoC interpretation unclear (what does this pain point mean?)
- Use case priority conflict (which to build first?)
- Design system deviation needed (can I use a different color?)
- Technical blocker (API doesn't support this interaction)

### **When to Proceed Independently:**
- Design system application (you know the rules)
- Component implementation (follow patterns)
- Accessibility fixes (follow WCAG guidelines)
- Performance optimization (lazy loading, code splitting)

### **How to Report Progress:**
- Daily summary: What you built, what's blocked, what's next
- Screenshots: Show before/after for all changes
- Metrics: Report time saved, errors reduced, etc.

---

## 🔥 CRITICAL REMINDERS

1. **VoC is your compass:** Every design decision should trace back to practitioner pain
2. **Accessibility is non-negotiable:** Color + icon + text, keyboard nav, contrast
3. **Design system is law:** No deviations without LEAD approval
4. **Demo is in 2.5 days:** Protocol Builder fix is CRITICAL PATH
5. **Temperature is 2:** Focus on precise, consistent execution (not creative exploration)

---

## 📚 APPENDIX: FILE REFERENCES

### **Context Documents:**
- `.agent/research/📊 VoC Analysis Psychedelic Therapy.md`
- `.agent/research/VoC - JAllen and BLJensen.md`
- `.agent/research/📈 Voc Analysis for Psychedelic Therapy Practitioners and Clinicians copy.md`
- `USE_CASES_VOC_ALIGNED_2026.md`
- `MARKETING_PLAN_USE_CASE_DRIVEN.md`

### **Skills:**
- `.agent/skills/master-data-ux/SKILL.md`
- `.agent/skills/frontend-best-practices/SKILL.md`
- `.agent/skills/browser/SKILL.md`
- `.agent/skills/accessibility-checker/SKILL.md`

### **Workflows:**
- `.agent/workflows/create_tooltips.md`

### **Current Codebase:**
- `/src/pages/ProtocolBuilder.tsx` (BROKEN - needs fix)
- `/src/components/forms/ButtonGroup.tsx` (working)
- `/src/components/ui/AdvancedTooltip.tsx` (working)

---

**Status:** ✅ READY FOR DESIGNER  
**Priority:** 🔴 CRITICAL - Demo depends on this  
**Next:** DESIGNER reads this brief, then executes Protocol Builder fix 🚀
