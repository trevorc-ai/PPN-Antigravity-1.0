# INSPECTOR TASK ASSIGNMENT
**Date:** 2026-02-12 08:27 PST
**Assigned By:** LEAD + BUILDER
**Priority:** HIGH
**Status:** READY FOR QA

---

## MISSION

Conduct comprehensive Quality Assurance validation of the PPN Research Portal following the site restoration and full audit completion. Focus on verifying the 2 high-priority mobile issues and conducting cross-browser/accessibility testing.

---

## CONTEXT

### Background
- **Critical Blocker:** Site-wide compilation error has been RESOLVED
- **Full Audit:** Comprehensive desktop + mobile audit completed (38 pages tested)
- **Overall Health:** 🟢 95% pass rate (18/19 pages fully functional)
- **Issues Identified:** 2 HIGH, 3 MEDIUM/LOW

### Reference Documents
- **Audit Report:** `CRAWL_COMPREHENSIVE_AUDIT_POST_FIX_2026-02-12.md`
- **Blocker Resolution:** `BUILDER_CRITICAL_BLOCKER_RESOLVED.md`
- **Original Audit:** `CRAWL_COMPREHENSIVE_AUDIT_2026-02-12.md`

---

## PRIORITY TASKS

### Task 1: Verify High Priority Issues (P0)

#### Issue #1: Help Page Mobile Redirect
**File:** `CRAWL_COMPREHENSIVE_AUDIT_POST_FIX_2026-02-12.md` (Issue #1)
**Description:** Help page redirects to Landing on mobile viewport

**QA Steps:**
1. Open http://localhost:3000/#/help on mobile device (or 375px viewport)
2. Verify current behavior:
   - [ ] Does it redirect to Landing page?
   - [ ] Is Help content visible?
   - [ ] Does URL change?
3. Test on real mobile devices (iOS Safari, Android Chrome)
4. Document actual behavior vs expected behavior
5. After BUILDER fix, re-test and confirm resolution

**Expected Result:** Help/FAQ content should display on mobile without redirect

---

#### Issue #2: Search Button Misalignment (Mobile)
**File:** `CRAWL_COMPREHENSIVE_AUDIT_POST_FIX_2026-02-12.md` (Issue #2)
**Description:** Search button floats below input field on mobile

**QA Steps:**
1. Navigate to http://localhost:3000/#/advanced-search on mobile (375px)
2. Verify current button position:
   - [ ] Is button aligned with input?
   - [ ] Is button overlapping any borders?
   - [ ] Is button hittable (tap target ≥ 44px)?
3. Test on multiple mobile browsers
4. After BUILDER fix, verify alignment is correct
5. Test touch interaction

**Expected Result:** Search button should be properly aligned within or adjacent to search input, with adequate touch target size

---

### Task 2: Cross-Browser Testing (P1)

Test the following critical pages across browsers:

**Pages to Test:**
1. Landing (`/`)
2. Dashboard (`/#/dashboard`)
3. My Protocols (`/#/builder`)
4. Advanced Search (`/#/advanced-search`)
5. Help (`/#/help`)

**Browsers to Test:**
- **Desktop:** Chrome, Firefox, Safari, Edge
- **Mobile:** iOS Safari, Android Chrome, Samsung Internet

**Checklist Per Browser:**
- [ ] Page loads without errors
- [ ] All interactive elements work (buttons, dropdowns, forms)
- [ ] Charts render correctly
- [ ] Sidebar/navigation functions
- [ ] No console errors (except expected Recharts warnings)
- [ ] Fonts and colors display correctly

---

### Task 3: Accessibility Audit (P1)

**Scope:** Landing, Dashboard, My Protocols, Help pages

**Checklist:**
- [ ] **Keyboard Navigation:** All interactive elements accessible via Tab key
- [ ] **Screen Reader:** Test with VoiceOver (Mac) or NVDA (Windows)
- [ ] **Color Contrast:** Verify text meets WCAG AA standards (4.5:1 for normal text)
- [ ] **Focus Indicators:** Visible focus rings on all interactive elements
- [ ] **ARIA Labels:** Proper labeling on buttons, form inputs, and charts
- [ ] **Heading Hierarchy:** Logical H1 → H2 → H3 structure
- [ ] **Alt Text:** Images have descriptive alt attributes
- [ ] **Font Size:** No text smaller than 12px (per user requirement)

**Tool:** Use browser DevTools Accessibility Inspector or axe DevTools extension

---

### Task 4: Performance Testing (P2)

**Metrics to Measure:**
- [ ] **Page Load Time:** < 3 seconds on desktop, < 5 seconds on mobile
- [ ] **Time to Interactive (TTI):** < 5 seconds
- [ ] **Chart Render Time:** < 1 second for initial render
- [ ] **Bundle Size:** Check main.js size (should be < 2MB)

**Tool:** Chrome DevTools Lighthouse or WebPageTest

**Critical Pages:**
- Dashboard (heaviest with multiple charts)
- Patient Galaxy (scatter plot)
- Clinical Radar (radar chart)

---

### Task 5: Data Validation (P2)

**Scope:** Verify mock data displays correctly

**Pages to Check:**
1. **Dashboard:**
   - [ ] "Protocols Logged" shows number
   - [ ] "Success Rate" shows percentage
   - [ ] "Safety Alerts" shows count
   - [ ] "Avg Session Time" shows hours
   - [ ] Charts display data points

2. **My Protocols:**
   - [ ] Protocol list populates
   - [ ] "Outcome Velocity" chart displays (if data available)
   - [ ] Search/filter works

3. **Deep Dives:**
   - [ ] Safety Surveillance: Alerts display
   - [ ] Clinical Radar: Radar chart has data
   - [ ] Patient Galaxy: Scatter plot shows points
   - [ ] Molecular DB: Bar charts populated

**Validation:**
- [ ] No "undefined" or "NaN" values displayed
- [ ] Charts have legends and axis labels
- [ ] Data is realistic (not all zeros or random noise)

---

### Task 6: Recharts Warning Investigation (P2)

**Issue:** Console warnings: `The width(-1) and height(-1) of chart should be greater than 0`

**Investigation Steps:**
1. Identify all pages with Recharts components
2. For each page, note:
   - [ ] Does chart eventually render correctly?
   - [ ] Is there visible flickering or layout shift?
   - [ ] What is the parent container structure?
3. Recommend fix (e.g., add `min-height`, use skeleton loader)
4. Test fix on one page as proof of concept

**Reference:** Issue #3 in audit report

---

## DELIVERABLES

### Required Artifacts

1. **QA Report:** `INSPECTOR_QA_REPORT_2026-02-12.md`
   - Summary of findings
   - Pass/fail status for each task
   - Screenshots of any new issues found
   - Cross-browser compatibility matrix
   - Accessibility violations documented
   - Performance metrics

2. **Issue Tracker Update:**
   - Update status of Issue #1 (Help redirect)
   - Update status of Issue #2 (Search button)
   - Log any new issues found during QA

3. **Video Recording:** (Optional but recommended)
   - Screen recording of mobile testing
   - Accessibility testing demo
   - Cross-browser comparison

---

## SUCCESS CRITERIA

- [ ] All P0 tasks completed
- [ ] Issues #1 and #2 verified (before and after fix)
- [ ] Cross-browser testing on minimum 4 browsers (Chrome, Safari, Firefox, Mobile)
- [ ] Accessibility audit shows no CRITICAL violations
- [ ] QA Report delivered

---

## TIMELINE

- **Start:** Immediate
- **P0 Tasks:** Complete within 2 hours
- **Full QA:** Complete within 4 hours
- **Report Due:** End of day (2026-02-12)

---

## NOTES

### Known Non-Issues (Do Not Report)
- `No authenticated user` console warnings (expected in dev mode)
- Recharts warnings (already documented, P2 priority)
- TypeScript warning on ProtocolBuilder.tsx line 276 (non-blocking)

### If You Find New Issues
1. Take screenshot
2. Capture console log
3. Identify severity (CRITICAL / HIGH / MEDIUM / LOW)
4. Suggest root cause if obvious
5. Add to QA report immediately

---

**Assignment Created:** 2026-02-12 08:27 PST
**Assigned To:** INSPECTOR
**Priority:** HIGH
**Blocked By:** None (site is operational)
**Blocking:** Demo readiness, public launch
