---
name: accessibility-checker
description: Verify WCAG 2.1 compliance, check contrast ratios, validate ARIA labels, and ensure keyboard navigation works correctly. Essential for accessible UI/UX design.
---

# Accessibility Checker Skill

## 🎯 Purpose

This skill provides a systematic approach to **verify accessibility compliance** for all UI components. The PPN Research Portal must meet WCAG 2.1 Level AA standards (AAA preferred) to ensure usability for all users, including those with visual, motor, or cognitive disabilities.

---

## 📋 Accessibility Requirements

### **WCAG 2.1 Compliance Levels**

- **Level A**: Minimum (not acceptable for production)
- **Level AA**: Target minimum (required)
- **Level AAA**: Preferred (aim for this)

**Our Standard: WCAG 2.1 Level AA minimum, AAA preferred**

---

## 🔍 Accessibility Checklist

### **1. Color Contrast**

**Minimum Ratios (WCAG AA):**
- Normal text (<18pt): 4.5:1
- Large text (≥18pt): 3:1
- UI components: 3:1

**Preferred Ratios (WCAG AAA):**
- Normal text: 7:1
- Large text: 4.5:1

**How to Check:**
1. Open browser DevTools (F12)
2. Inspect element
3. Check "Accessibility" tab for contrast ratio
4. Or use online tool: https://webaim.org/resources/contrastchecker/

**Example:**
```jsx
// ✅ GOOD - 15.52:1 (AAA)
<p className="text-slate-100 bg-slate-900">High contrast text</p>

// ⚠️ ACCEPTABLE - 4.73:1 (AA only)
<p className="text-slate-400 bg-slate-900">Lower contrast</p>

// ❌ FAIL - 2.85:1 (Below AA)
<p className="text-slate-500 bg-slate-900">Too low contrast</p>
```

---

### **2. Color Blindness Support**

**Rule: Never use color alone to convey information**

**Types of Color Blindness:**
- Protanopia (red-blind): ~1% of males
- Deuteranopia (green-blind): ~1% of males
- Tritanopia (blue-blind): Rare
- Achromatopsia (total color blindness): Very rare

**Testing Method:**
Use browser extensions or online simulators:
- Chrome: "Colorblind - Dalton for Google Chrome"
- Firefox: "Colorblindly"
- Online: https://www.color-blindness.com/coblis-color-blindness-simulator/

**Checklist:**
- [ ] Success/error states use icons + text (not just green/red)
- [ ] Charts use patterns or labels (not just color coding)
- [ ] Status indicators have text labels
- [ ] Links are underlined or have icons (not just color)

---

### **3. Keyboard Navigation**

**All interactive elements must be keyboard accessible**

**Required Keys:**
- `Tab`: Move forward through elements
- `Shift + Tab`: Move backward
- `Enter`: Activate buttons/links
- `Space`: Toggle checkboxes, activate buttons
- `Escape`: Close modals/dropdowns
- `Arrow keys`: Navigate within components (dropdowns, tabs)

**Testing Method:**
1. Disconnect mouse
2. Use only keyboard to navigate entire page
3. Verify all actions are possible

**Checklist:**
- [ ] All buttons are reachable via Tab
- [ ] Tab order is logical (top to bottom, left to right)
- [ ] Focus states are clearly visible
- [ ] Modals can be closed with Escape
- [ ] Dropdowns can be navigated with arrows
- [ ] Forms can be submitted with Enter

**Example:**
```jsx
// ✅ GOOD - Keyboard accessible
<button 
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
  className="focus:ring-2 focus:ring-emerald-500"
>
  Submit
</button>

// ❌ BAD - Not keyboard accessible
<div onClick={handleClick}>
  Submit
</div>
```

---

### **4. ARIA Labels**

**When to use ARIA:**
- Icon-only buttons
- Complex widgets (charts, custom controls)
- Dynamic content updates
- Screen reader announcements

**Common ARIA Attributes:**
```jsx
// Button with icon only
<button aria-label="Delete protocol P-2024-001">
  <Trash2 />
</button>

// Loading state
<div role="status" aria-live="polite">
  Loading data...
</div>

// Error message
<div role="alert" aria-live="assertive">
  Error: Unable to save protocol
</div>

// Chart
<div role="img" aria-label="Line chart showing patient outcomes over 12 months">
  <LineChart data={data} />
</div>
```

**Checklist:**
- [ ] All icon-only buttons have `aria-label`
- [ ] Loading states have `role="status"`
- [ ] Error messages have `role="alert"`
- [ ] Charts have descriptive `aria-label`
- [ ] Form inputs have associated labels

---

### **5. Font Size Compliance**

**Minimum Sizes (Project Standard):**
- Body text: 16px (1rem)
- Labels: 14px (0.875rem)
- Tooltips: 14px (0.875rem)
- Chart legends: 12px (0.75rem) only if necessary

**How to Check:**
1. Inspect element in DevTools
2. Check computed font-size
3. Flag any text <14px (except chart legends)

**Violations:**
```jsx
// ❌ VIOLATION - 12px body text
<p className="text-xs">Too small</p>

// ✅ COMPLIANT - 14px minimum
<p className="text-sm">Acceptable</p>

// ✅ PREFERRED - 16px
<p className="text-base">Ideal</p>
```

---

### **6. Focus Indicators**

**All interactive elements must have visible focus states**

**Standard Focus Style:**
```jsx
<button className="
  focus:outline-none 
  focus:ring-2 
  focus:ring-emerald-500 
  focus:ring-offset-2 
  focus:ring-offset-slate-900
">
  Click me
</button>
```

**Checklist:**
- [ ] Focus ring is visible (2px minimum)
- [ ] Focus ring has sufficient contrast (3:1)
- [ ] Focus ring has offset for clarity
- [ ] Custom focus states are consistent

---

## 🛠️ Testing Tools

### **Browser DevTools**

**Chrome/Edge:**
1. F12 → Elements tab
2. Select element
3. Check "Accessibility" panel
4. Review contrast ratio, ARIA attributes, role

**Firefox:**
1. F12 → Accessibility tab
2. Enable accessibility inspector
3. Review element properties

---

### **Automated Testing**

**Lighthouse (Built into Chrome):**
1. F12 → Lighthouse tab
2. Select "Accessibility" category
3. Run audit
4. Review issues and recommendations

**axe DevTools (Browser Extension):**
1. Install axe DevTools extension
2. F12 → axe DevTools tab
3. Click "Scan ALL of my page"
4. Review violations

---

### **Manual Testing**

**Keyboard Navigation Test:**
```
1. Disconnect mouse
2. Start at top of page
3. Press Tab repeatedly
4. Verify:
   - All interactive elements are reachable
   - Tab order is logical
   - Focus indicators are visible
   - Actions work with Enter/Space
```

**Screen Reader Test:**
```
1. Enable screen reader:
   - Mac: VoiceOver (Cmd + F5)
   - Windows: NVDA (free) or JAWS
2. Navigate page with screen reader
3. Verify:
   - All content is announced
   - Headings are properly structured
   - Form labels are associated
   - ARIA labels are descriptive
```

---

## ✅ Accessibility Audit Template

Use this template when auditing a page:

```markdown
## Accessibility Audit: [Page Name]

**Date:** 2026-02-11
**Auditor:** [Your Name]
**WCAG Target:** Level AA (AAA preferred)

### 1. Color Contrast
- [ ] All text meets 4.5:1 minimum (7:1 preferred)
- [ ] UI components meet 3:1 minimum
- [ ] Issues found: [List any violations]

### 2. Color Blindness
- [ ] No color-only indicators
- [ ] Success/error states use icons + text
- [ ] Charts use patterns or labels
- [ ] Issues found: [List any violations]

### 3. Keyboard Navigation
- [ ] All interactive elements are keyboard accessible
- [ ] Tab order is logical
- [ ] Focus states are visible
- [ ] Modals close with Escape
- [ ] Issues found: [List any violations]

### 4. ARIA Labels
- [ ] Icon-only buttons have aria-label
- [ ] Loading states have role="status"
- [ ] Error messages have role="alert"
- [ ] Charts have descriptive labels
- [ ] Issues found: [List any violations]

### 5. Font Sizes
- [ ] All text ≥14px (except chart legends)
- [ ] Body text ≥16px preferred
- [ ] Issues found: [List any violations]

### 6. Focus Indicators
- [ ] All interactive elements have visible focus
- [ ] Focus ring has sufficient contrast
- [ ] Issues found: [List any violations]

### 7. Automated Testing
- [ ] Lighthouse accessibility score: [Score]/100
- [ ] axe DevTools violations: [Count]
- [ ] Issues found: [List any violations]

### Summary
**Total Issues:** [Count]
**Critical:** [Count]
**Moderate:** [Count]
**Minor:** [Count]

**Recommendations:**
1. [Priority fix]
2. [Priority fix]
3. [Priority fix]
```

---

## 🎓 Common Violations & Fixes

### **Violation 1: Low Contrast Text**

**Problem:**
```jsx
<p className="text-slate-500 bg-slate-900">Low contrast</p>
// Contrast: 2.85:1 (FAIL)
```

**Fix:**
```jsx
<p className="text-slate-300 bg-slate-900">Better contrast</p>
// Contrast: 8.59:1 (AAA)
```

---

### **Violation 2: Color-Only Indicators**

**Problem:**
```jsx
<div className="text-rose-500">Error</div>
<div className="text-emerald-500">Success</div>
```

**Fix:**
```jsx
<div className="flex items-center gap-2 text-rose-500">
  <AlertTriangle className="w-5 h-5" />
  <span>Error: Unable to save</span>
</div>
```

---

### **Violation 3: Missing Focus States**

**Problem:**
```jsx
<button className="focus:outline-none">Submit</button>
```

**Fix:**
```jsx
<button className="
  focus:outline-none 
  focus:ring-2 
  focus:ring-emerald-500
">
  Submit
</button>
```

---

### **Violation 4: Non-Keyboard Accessible**

**Problem:**
```jsx
<div onClick={handleClick}>Click me</div>
```

**Fix:**
```jsx
<button onClick={handleClick}>Click me</button>
```

---

### **Violation 5: Missing ARIA Labels**

**Problem:**
```jsx
<button onClick={handleDelete}>
  <Trash2 />
</button>
```

**Fix:**
```jsx
<button 
  onClick={handleDelete}
  aria-label="Delete protocol P-2024-001"
>
  <Trash2 />
</button>
```

---

**END OF ACCESSIBILITY CHECKER SKILL**
