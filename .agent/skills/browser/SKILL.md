---
name: browser
description: Essential skill for visual UI/UX verification. Use the browser tool to see what you're building, capture screenshots, and verify design implementations in real-time.
---

> ### 🚨 PPN DEV SERVER — ALWAYS PORT 3000
> **Local dev server runs on `http://localhost:3000` — NOT 5173.**
> Every browser navigation in this project MUST use `http://localhost:3000`.
> Using any other port (5173, 3001, etc.) is a mis-step — stop and use 3000.

# Browser Skill

## 🎯 Purpose

The browser skill enables you to **see what you're building** by opening and interacting with the application in a real browser environment. This is **essential** for UI/UX work because you cannot verify visual design, layout, or user experience without actually viewing the rendered interface.

---

## 📋 When to Use This Skill

**ALWAYS use the browser tool when:**
- Starting any UI/UX design work (audit current state)
- Implementing visual changes (verify before/after)
- Testing responsive layouts (check different viewport sizes)
- Verifying accessibility features (test keyboard navigation, contrast)
- Validating data visualizations (ensure charts render correctly)
- Creating walkthroughs (capture screenshots/recordings)

**The browser is your eyes. Use it frequently.**

---

## 🚀 Workflow

### **Step 1: Initial Audit (Before Making Changes)**

Before implementing any design changes, you MUST:

1. **Start the dev server** (if not already running)
2. **Open the browser** to the relevant page
3. **Capture a screenshot** of the current state
4. **Document issues** you observe

**Example:**
```markdown
## Current State Audit

Opening browser to http://localhost:3000/dashboard

[Screenshot: dashboard_before.webp]

**Observed Issues:**
- Font sizes below 10pt in chart legends (violates minimum font size rule)
- Error states use red/green only (not accessible for color-blind users)
- CTA button has low contrast (fails WCAG AA)
- Chart tooltips missing on hover
```

---

### **Step 2: Implement Changes**

After documenting the current state:
1. Make your design/code changes
2. Save files (browser will hot-reload)
3. Return to browser to verify changes

---

### **Step 3: Verification (After Making Changes)**

After implementing changes, you MUST:

1. **Refresh the browser** (or wait for hot reload)
2. **Capture a new screenshot** of the updated state
3. **Test interactions** (hover, click, keyboard navigation)
4. **Compare before/after** screenshots

**Example:**
```markdown
## Verification Results

[Screenshot: dashboard_after.webp]

**Changes Verified:**
✅ Chart legend font increased to 12pt
✅ Error states now use icons + text (accessible)
✅ CTA button contrast improved to WCAG AAA
✅ Tooltips appear on hover with detailed information

**Remaining Issues:**
⚠️ Mobile layout needs adjustment (test at 375px width)
```

---

### **Step 4: Responsive Testing**

For any UI work, test at multiple viewport sizes:

1. **Desktop**: 1920px × 1080px (default)
2. **Tablet**: 768px × 1024px
3. **Mobile**: 375px × 667px

**Browser Tool Pattern:**
```
Task: "Resize browser to 375px width and capture screenshot of mobile layout"
```

---

### **Step 5: Create Before/After Artifacts**

For walkthroughs and documentation:

1. **Capture before screenshot** (saved automatically as .webp)
2. **Capture after screenshot** (saved automatically as .webp)
3. **Embed in walkthrough.md** using carousel format

**Example Walkthrough:**
````markdown
## Dashboard Improvements

````carousel
![Before: Dashboard with accessibility issues](/path/to/dashboard_before.webp)
<!-- slide -->
![After: Dashboard with improved accessibility](/path/to/dashboard_after.webp)
````
````

---

## 🛠️ Browser Tool Usage

### **Basic Navigation**

```
Task: "Navigate to http://localhost:3000/dashboard and capture a screenshot"
```

### **Interaction Testing**

```
Task: "Click on the 'Patient Flow' chart, hover over data points to verify tooltips appear, then capture a screenshot showing the tooltip"
```

### **Responsive Testing**

```
Task: "Resize browser to 768px width, scroll through the entire page to verify mobile layout, and capture screenshots of any layout issues"
```

### **Accessibility Testing**

```
Task: "Use keyboard only (Tab, Enter, Escape) to navigate through the Protocol Builder form. Verify all fields are accessible and capture a screenshot of the focus states"
```

### **Animation Testing**

```
Task: "Click the 'Create Protocol' button and verify the modal opens with smooth animation. Capture a recording of the interaction"
```

---

## ✅ Quality Checklist

Before marking UI/UX work complete, verify in browser:

### **Visual Design**
- [ ] Colors match design system
- [ ] Typography is consistent
- [ ] Spacing follows grid system
- [ ] Glassmorphism/effects render correctly
- [ ] Dark mode looks polished

### **Accessibility**
- [ ] Text contrast meets WCAG AAA (use browser DevTools)
- [ ] All interactive elements have visible focus states
- [ ] Icons are paired with text labels
- [ ] Font sizes meet minimum requirements (≥10pt)
- [ ] Color is not the only indicator of state

### **Responsive Layout**
- [ ] Desktop (1920px): Layout is balanced, no wasted space
- [ ] Tablet (768px): Content reflows appropriately
- [ ] Mobile (375px): Single column, touch-friendly targets
- [ ] No horizontal scrolling at any breakpoint
- [ ] Images and charts scale proportionally

### **Interactivity**
- [ ] Hover states are visible and smooth
- [ ] Click actions provide immediate feedback
- [ ] Loading states display during data fetch
- [ ] Error states are clear and actionable
- [ ] Animations are smooth (60fps)

### **Data Visualization**
- [ ] Charts render without errors
- [ ] Tooltips appear on hover
- [ ] Legend is readable and clickable
- [ ] Zoom/pan interactions work smoothly
- [ ] No data points are cut off

---

## 🎓 Examples

### **Example 1: Audit Landing Page**

```
DESIGNER: "I need to audit the current landing page design"

1. Open browser to http://localhost:3000/
2. Capture full-page screenshot
3. Analyze:
   - Hero section layout
   - CTA button visibility
   - Typography hierarchy
   - Color contrast
   - Responsive behavior
4. Document findings in design_brief.md
```

### **Example 2: Verify Chart Improvements**

```
DESIGNER: "I've updated the Patient Flow chart. Verify the changes."

1. Navigate to http://localhost:3000/analytics/patient-flow
2. Capture "before" screenshot (if not already done)
3. Wait for hot reload after code changes
4. Capture "after" screenshot
5. Test interactions:
   - Hover over data points (verify tooltips)
   - Click legend items (verify filtering)
   - Zoom into data region (verify zoom works)
6. Compare screenshots and document results
```

### **Example 3: Mobile Responsiveness Check**

```
DESIGNER: "Verify the dashboard is mobile-friendly"

1. Open browser to http://localhost:3000/dashboard
2. Resize to 375px width
3. Scroll through entire page
4. Capture screenshots of:
   - Header/navigation
   - Chart cards (should stack vertically)
   - Filter controls (should be touch-friendly)
   - Footer
5. Document any layout issues
```

---

## 🚫 Common Mistakes

### **❌ DON'T: Skip the browser check**

```
// ❌ BAD
"I've updated the button styles. The changes look good in the code."
```

### **✅ DO: Always verify visually**

```
// ✅ GOOD
"I've updated the button styles. Opening browser to verify..."
[Captures screenshot]
"Verified: Button now has proper contrast and hover state."
```

---

### **❌ DON'T: Assume responsive behavior**

```
// ❌ BAD
"I used Tailwind responsive classes, so it should work on mobile."
```

### **✅ DO: Test at actual breakpoints**

```
// ✅ GOOD
"Testing responsive behavior:
- Desktop (1920px): ✅ Layout looks balanced
- Tablet (768px): ✅ Cards reflow to 2 columns
- Mobile (375px): ⚠️ Chart legend text is cut off - needs fix"
```

---

### **❌ DON'T: Forget to capture before/after**

```
// ❌ BAD
"I made the changes. They look better now."
```

### **✅ DO: Document visual changes**

```
// ✅ GOOD
"Before: [screenshot showing old design]
After: [screenshot showing new design]
Changes: Increased contrast, added icons, improved spacing"
```

---

## 🔗 Integration with Other Skills

### **With master-data-ux:**
- Use browser to verify data visualizations render correctly
- Test chart interactions (zoom, pan, hover)
- Verify tooltip positioning and content

### **With accessibility-checker:**
- Use browser DevTools to check color contrast
- Test keyboard navigation in real browser
- Verify screen reader compatibility

### **With frontend-best-practices:**
- Verify no console errors appear
- Check network tab for performance issues
- Validate responsive behavior matches code

---

## 📊 Browser Tool Recordings

All browser interactions are **automatically recorded** and saved as WebP videos to the artifacts directory. These recordings are invaluable for:

- **Walkthroughs**: Show users exactly what changed
- **Bug Reports**: Demonstrate issues visually
- **Training**: Create step-by-step guides
- **Documentation**: Embed in markdown artifacts

**Naming Convention:**
- `audit_landing_page.webp` - Initial audit recording
- `verify_chart_interactions.webp` - Interaction testing
- `mobile_responsive_test.webp` - Responsive testing

---

## 🎯 Success Criteria

You've successfully used the browser skill when:

✅ You have before/after screenshots for every visual change
✅ You've tested at all required breakpoints (desktop, tablet, mobile)
✅ You've verified all interactive elements work as expected
✅ You've documented any remaining issues or edge cases
✅ Your walkthrough.md includes embedded screenshots/recordings

---

**Remember: The browser is your most important tool for UI/UX work. Use it early, use it often, and always verify your changes visually.**

---

**END OF BROWSER SKILL**
