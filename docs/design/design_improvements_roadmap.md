# PPN Research Portal - Design Improvements Roadmap

**Created:** 2026-02-15  
**Owner:** DESIGNER Agent  
**Source:** WO_041 Accessibility Audit  
**Status:** Ready for Implementation

---

## Quick Wins (<1 Day)

### 1. Color Contrast Fixes (4 hours)
**Impact:** 🔴 CRITICAL - Affects all users with visual impairments

**Changes:**
- Replace `text-slate-400` (#94a3b8) with `text-slate-300` (#cbd5e1) globally
- Replace `text-slate-500` (#64748b) with `text-slate-200` (#e2e8f0) globally
- Increase glassmorphism borders from `border-white/5` to `border-white/10`
- Audit footer and hero blue-on-dark text for 4.5:1 contrast

**Files to Touch:**
- Global find/replace in all `.tsx` files
- Update Tailwind config if using custom colors

**Verification:**
- Run WebAIM Contrast Checker on all text
- Lighthouse accessibility score should increase to 85+

---

### 2. Add "Skip to Main Content" Link (1 hour)
**Impact:** 🟡 HIGH - Improves keyboard navigation efficiency

**Changes:**
- Add skip link at top of `App.tsx` or `TopHeader.tsx`
- Style to be visible on focus only
- Link to `id="main-content"` on main content area

**Implementation:**
```tsx
<a 
  href="#main-content" 
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg"
>
  Skip to main content
</a>
```

---

### 3. Add ARIA Labels to Icon-Only Buttons (2 hours)
**Impact:** 🔴 CRITICAL - Screen reader users cannot identify button purpose

**Changes:**
- Add `aria-label` to all NavIconButton instances
- Add `aria-label` to mobile menu button
- Add `aria-label` to all icon-only actions

**Example:**
```tsx
<button aria-label="Open notifications">
  <span className="material-symbols-outlined">notifications</span>
</button>
```

**Files to Touch:**
- `TopHeader.tsx`
- `Sidebar.tsx`
- `MobileSidebar.tsx`
- All analytics chart components

---

### 4. Fix Footer Semantic HTML (1 hour)
**Impact:** 🟡 HIGH - Affects keyboard navigation and screen readers

**Changes:**
- Ensure all footer links are wrapped in `<a href="">` tags
- Add proper `<nav>` wrapper for footer navigation
- Add `aria-label="Footer navigation"` to footer nav

**File to Touch:**
- `Footer.tsx`

---

## Short-Term Improvements (1-3 Days)

### 5. ButtonGroup Accessibility (3 hours)
**Impact:** 🟡 HIGH - Improves form accessibility

**Changes:**
- Add `role="radiogroup"` to container
- Add `aria-label` to group
- Add `role="radio"` and `aria-checked` to each button
- Implement arrow key navigation

**Implementation:**
```tsx
<div role="radiogroup" aria-label={label} className="flex gap-2">
  {options.map((option) => (
    <button
      role="radio"
      aria-checked={value === option.value}
      onClick={() => onChange(option.value)}
      onKeyDown={(e) => handleArrowKeys(e)}
    >
      {option.label}
    </button>
  ))}
</div>
```

**File to Touch:**
- `components/forms/ButtonGroup.tsx`

---

### 6. Form Input Accessibility (4 hours)
**Impact:** 🟡 HIGH - Improves form usability for all users

**Changes:**
- Add explicit `id` and `for` attributes to all label/input pairs
- Add `aria-invalid="true"` to fields with errors
- Add `aria-describedby` to inputs with helper text
- Add `aria-live="polite"` to error message containers

**Example:**
```tsx
<label htmlFor="email-input">Email Address</label>
<input 
  id="email-input"
  type="email"
  aria-invalid={hasError}
  aria-describedby="email-error email-hint"
/>
<span id="email-hint">We'll never share your email</span>
{hasError && <span id="email-error" role="alert">Invalid email format</span>}
```

**Files to Touch:**
- All form components in `components/forms/`
- `Login.tsx`, `SignUp.tsx`, `Settings.tsx`

---

### 7. Image Alt Text Audit (3 hours)
**Impact:** 🔴 CRITICAL - Screen reader users miss visual content

**Changes:**
- Add descriptive `alt` text to all meaningful images
- Add `aria-hidden="true"` to decorative graphics
- Add `alt=""` to spacer images
- Document alt text guidelines in design system

**Files to Touch:**
- `Landing.tsx` (hero molecular graphic, workflow icons)
- All pages with images
- Create `docs/design/alt_text_guidelines.md`

---

### 8. Typography Improvements (2 hours)
**Impact:** 🟢 MEDIUM - Improves readability for users with dyslexia

**Changes:**
- Limit `tracking-widest` to headings only
- Replace `tracking-widest` with `tracking-normal` in body text
- Replace `tracking-wide` with `tracking-normal` in paragraphs
- Update design system documentation

**Global Find/Replace:**
- Review all instances of `tracking-widest` and `tracking-wide`
- Keep for headings, remove from body text

---

## Medium-Term Enhancements (1-2 Weeks)

### 9. Chart Accessibility Overhaul (16 hours)
**Impact:** 🔴 CRITICAL - Data visualizations inaccessible to screen readers

**Phase 1: Text Alternatives (8 hours)**
- Add data tables as alternatives for all charts
- Implement toggle between chart and table view
- Add `<desc>` elements to SVG charts
- Add `aria-label` to chart containers

**Phase 2: Color Independence (4 hours)**
- Add patterns/hatching to chart series
- Use distinct shapes in addition to colors
- Add text labels to all data points
- Implement colorblind-friendly palettes

**Phase 3: Keyboard Navigation (4 hours)**
- Implement arrow key navigation for chart elements
- Add focus indicators to chart data points
- Add `tabindex="0"` to interactive chart elements

**Files to Touch:**
- All components in `components/analytics/`
- All components in `components/charts/`
- Create `components/charts/ChartDataTable.tsx`

**Example:**
```tsx
<div className="chart-container">
  <button onClick={() => setViewMode(viewMode === 'chart' ? 'table' : 'chart')}>
    {viewMode === 'chart' ? 'View as Table' : 'View as Chart'}
  </button>
  {viewMode === 'chart' ? (
    <ResponsiveContainer aria-label="Patient flow over time">
      <LineChart data={data}>
        <desc>Line chart showing patient enrollment from Jan to Dec 2025</desc>
        {/* chart content */}
      </LineChart>
    </ResponsiveContainer>
  ) : (
    <ChartDataTable data={data} />
  )}
</div>
```

---

### 10. Protocol Builder Accessibility (6 hours)
**Impact:** 🟡 HIGH - Core user workflow must be accessible

**Changes:**
- Add `aria-current="step"` to active step indicator
- Add `role="progressbar"` with `aria-valuenow` to progress bar
- Implement focus management between steps
- Add `aria-live="polite"` to step transition announcements

**Implementation:**
```tsx
<div role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={3}>
  {steps.map((step, index) => (
    <div 
      key={step.id}
      aria-current={currentStep === index + 1 ? 'step' : undefined}
    >
      {step.label}
    </div>
  ))}
</div>

<div aria-live="polite" aria-atomic="true" className="sr-only">
  {`Step ${currentStep} of 3: ${steps[currentStep - 1].label}`}
</div>
```

**Files to Touch:**
- `components/ProtocolBuilder/ProgressBar.tsx`
- `components/ProtocolBuilder/TabNavigation.tsx`
- `pages/ProtocolBuilder.tsx`

---

### 11. Modal and Dropdown Accessibility (4 hours)
**Impact:** 🟡 HIGH - Common UI patterns must be accessible

**Changes:**
- Implement focus trap in all modals
- Add Escape key handling to close modals
- Add `aria-expanded` to dropdown triggers
- Add `aria-haspopup="true"` to dropdown buttons
- Return focus to trigger element on close

**Implementation:**
```tsx
// Modal focus trap
useEffect(() => {
  if (isOpen) {
    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements?.[0];
    const lastElement = focusableElements?.[focusableElements.length - 1];
    
    firstElement?.focus();
    
    const handleTab = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };
    
    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }
}, [isOpen]);
```

**Files to Touch:**
- All modal components
- `TopHeader.tsx` (user dropdown)
- Any custom dropdown components

---

### 12. Data Table Semantics (3 hours)
**Impact:** 🟡 HIGH - Tables must be navigable by screen readers

**Changes:**
- Add `<thead>`, `<tbody>`, `<tfoot>` to all tables
- Add `<th scope="col">` to column headers
- Add `<th scope="row">` to row headers
- Add `<caption>` to describe table purpose
- Add `aria-sort` to sortable columns

**Example:**
```tsx
<table>
  <caption>Protocol submission history for 2025</caption>
  <thead>
    <tr>
      <th scope="col" aria-sort="ascending">Date</th>
      <th scope="col">Protocol Name</th>
      <th scope="col">Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">2025-01-15</th>
      <td>MDMA-Assisted Therapy</td>
      <td>Approved</td>
    </tr>
  </tbody>
</table>
```

**Files to Touch:**
- All pages with data tables
- `AuditLogs.tsx`
- `MyProtocols.tsx`
- `DataExport.tsx`

---

### 13. Heading Hierarchy Audit (2 hours)
**Impact:** 🟢 MEDIUM - Improves navigation for screen reader users

**Changes:**
- Audit all pages for proper H1 → H2 → H3 nesting
- Ensure only one H1 per page
- Fix any skipped heading levels
- Document heading hierarchy in design system

**Process:**
1. Use browser extension to visualize heading structure
2. Fix any violations (e.g., H1 → H3 without H2)
3. Update component documentation

**Files to Touch:**
- All page components
- Update `docs/design/design_system_v2.md`

---

## Long-Term Vision (Future Releases)

### 14. Comprehensive Screen Reader Testing (8 hours)
**Impact:** 🔴 CRITICAL - Validate all accessibility improvements

**Activities:**
- Test entire application with NVDA (Windows)
- Test entire application with VoiceOver (Mac)
- Test entire application with JAWS (Windows)
- Document screen reader-specific issues
- Create screen reader testing checklist

---

### 15. User Testing with Accessibility Community (16 hours)
**Impact:** 🔴 CRITICAL - Real-world validation

**Activities:**
- Recruit users with visual impairments
- Recruit users with motor impairments
- Recruit users with cognitive impairments
- Conduct moderated usability testing
- Document findings and create work orders

---

### 16. Automated Accessibility Testing Pipeline (8 hours)
**Impact:** 🟢 MEDIUM - Prevent regressions

**Implementation:**
- Integrate axe-core into CI/CD pipeline
- Add Lighthouse accessibility checks to PR process
- Set minimum accessibility score threshold (90+)
- Add pre-commit hooks for common violations

---

### 17. Accessibility Component Library (12 hours)
**Impact:** 🟢 MEDIUM - Prevent future violations

**Deliverables:**
- Create reusable accessible components
- Document ARIA patterns and best practices
- Create Storybook with accessibility examples
- Add accessibility testing to component development

---

### 18. Dark/Light Mode Toggle (8 hours)
**Impact:** 🟢 MEDIUM - Improves usability for users with light sensitivity

**Implementation:**
- Add theme toggle to Settings
- Ensure all colors meet contrast in both modes
- Persist theme preference to localStorage
- Add `prefers-color-scheme` media query support

---

## Implementation Priority Matrix

| Priority | Effort | Impact | Items |
|----------|--------|--------|-------|
| 🔴 P0 | <1 day | CRITICAL | 1, 2, 3, 4 |
| 🔴 P1 | 1-3 days | CRITICAL/HIGH | 5, 6, 7, 9 |
| 🟡 P2 | 1-2 weeks | HIGH/MEDIUM | 8, 10, 11, 12, 13 |
| 🟢 P3 | Future | MEDIUM/LOW | 14, 15, 16, 17, 18 |

---

## Estimated Total Effort

| Phase | Hours | Days (8hr) |
|-------|-------|------------|
| Quick Wins | 8 | 1 |
| Short-Term | 16 | 2 |
| Medium-Term | 35 | 4.5 |
| Long-Term | 52 | 6.5 |
| **TOTAL** | **111** | **14** |

---

## Success Metrics

### Quantitative
- Lighthouse Accessibility Score: 90+ (currently ~65)
- WAVE Errors: 0 (currently ~25)
- Color Contrast Violations: 0 (currently ~15)
- Missing Alt Text: 0 (currently ~10)

### Qualitative
- Screen reader users can complete core workflows
- Keyboard-only users can access all features
- Users with color vision deficiency can interpret all data
- Users with low vision can read all text at 200% zoom

---

## Next Steps

1. **Review with INSPECTOR** - Validate audit findings
2. **Create Work Orders** - Break down roadmap into actionable tickets
3. **Prioritize P0 Items** - Fix critical issues before launch
4. **Schedule User Testing** - Validate improvements with real users

---

**Roadmap Created:** 2026-02-15  
**Owner:** DESIGNER Agent  
**Status:** Ready for Implementation
