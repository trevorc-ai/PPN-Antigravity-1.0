---
id: WO-005
status: 03_BUILD
priority: P1 (Critical)
category: Design / QA
owner: INSPECTOR
assigned_date: 2026-02-15T11:13:00-08:00
failure_count: 0
---

# User Request

**TASK TITLE:** Full Site-Wide Accessibility Audit and Component Crawl

## 1. THE GOAL

Execute a comprehensive "crawl" and inspection of every page and component currently rendered in the application to ensure 100% adherence to the PPN Research Portal standards.

### Specific Tasks:

1. **Accessibility Scan:** Audit every element for WCAG 2.1 AA compliance. Specifically:
   - Verify all fonts are ≥12px (`text-xs`)
   - Ensure no state (success, error, warning) is communicated via color alone; every status must have a corresponding icon (⚠️, ✅, ❌) or explicit text label
   - Check contrast ratios on all "Glassmorphism" components against the Aurora/Deep Slate backgrounds

2. **Component 'Crawl':** Inspect all routes (Landing, Dashboard, News, etc.) for "Vibe Coding" placeholders, broken buttons, or non-functional HUD elements.

3. **Hierarchy & Logic Check:** Ensure all components are in their correct architectural folders and that "Patient/Consumer" tier features (Drug Interaction, Safety Matrix) are accessible while restricted "Pro" features (Aggregate Analytics) are correctly locked with a visual 🔒 indicator.

4. **Report Generation:** Create an `accessibility_audit_report.md` artifact detailing every violation found and the remediation applied.

## 2. THE BLAST RADIUS (Authorized Target Area)

You and the swarm are ONLY allowed to modify the following specific files/areas:

- `/frontend/src/` (All components and pages for styling/markup fixes)
- `/frontend/src/styles/` (Global and component-specific CSS/Tailwind configs)
- `_WORK_ORDERS/01_TRIAGE/` (To document any logic failures that require ARCHITECT intervention)

## 3. THE ELECTRIC FENCE (Strict "DO NOT TOUCH" Constraints)

- DO NOT modify the backend database schema, Supabase RLS policies, or API controllers.
- DO NOT remove functional clinical logic or scientific data structures.
- DO NOT alter the "Clinical Sci-Fi" brand identity (Deep Slate #020408 background and Aurora gradients).
- DO NOT collect or display any PHI/PII during the audit.
- Follow the "Two-Strike Rule": if a styling fix fails to resolve an accessibility contrast issue twice, STOP and revert.

## 4. MANDATORY COMPLIANCE

### Accessibility:
- This is the primary mission
- Minimum 12px fonts and dual-mode state indicators (color + icon/text) are non-negotiable
- WCAG 2.1 AA compliance required for all interactive elements
- Contrast ratio minimum: 4.5:1 for normal text, 3:1 for large text

### Security:
- Ensure the audit process does not expose any internal environment variables or configuration metadata
- No PHI/PII in audit reports or logs
- Sanitize all error messages and debugging output

## 5. AUDIT SCOPE

### Pages to Audit:
- Landing Page
- Dashboard / Active Practice
- News Feed
- Regulatory Map (if not yet consolidated)
- Clinical Intelligence / Analytics
- Protocol Builder
- Drug Interaction Graph
- Safety Matrix
- Patient Longitudinal Tracking
- All authentication pages (Login, Signup, Profile Setup)

### Components to Audit:
- Global Header
- Sidebar Navigation
- Quick Actions buttons
- All data visualization charts
- Modal dialogs
- Form inputs and validation messages
- Tooltips and help text
- Status indicators and badges
- Filter dropdowns and controls

### Deliverable:
- `accessibility_audit_report.md` artifact with:
  - Complete inventory of violations
  - Severity ratings (Critical, High, Medium, Low)
  - Remediation actions taken
  - Before/after screenshots where applicable
  - Remaining issues requiring ARCHITECT review

---

## LEAD ARCHITECTURE

### Technical Strategy

This is a **comprehensive QA audit** requiring systematic crawl of all pages and components. INSPECTOR will lead this effort using the `accessibility-checker` skill to verify WCAG 2.1 AA compliance.

### Audit Execution Plan

**Phase 1: Automated Scanning**
1. Use `accessibility-checker` skill on all pages listed in scope
2. Generate automated compliance report with:
   - Font size violations (< 12px)
   - Color contrast failures
   - Missing ARIA labels
   - Keyboard navigation issues
3. Prioritize violations by severity (Critical → Low)

**Phase 2: Manual Component Review**
1. Inspect glassmorphism components for contrast against Aurora backgrounds
2. Verify all status indicators use both color AND icons/text
3. Check all interactive elements for hover/focus states
4. Validate form inputs and error messages

**Phase 3: Browser Testing**
1. Use browser tool to visually verify each page
2. Test keyboard navigation flow
3. Capture screenshots of violations
4. Document "vibe coding" placeholders for removal

**Phase 4: Remediation**
- **Minor fixes** (font sizes, missing icons): INSPECTOR can fix directly
- **Major issues** (component redesigns, logic changes): Create new work orders for DESIGNER/BUILDER
- **Architectural issues** (navigation structure, routing): Escalate to LEAD

### Compliance Checklist

**Font Sizes:**
- [ ] All text ≥ 12px (preferably 14px for body text)
- [ ] No `text-[10px]` or smaller in production components
- [ ] Chart labels and tooltips meet minimum size

**Color Accessibility:**
- [ ] No color-only status indicators
- [ ] All success/error/warning states have icons (✅ ❌ ⚠️)
- [ ] Contrast ratio ≥ 4.5:1 for normal text
- [ ] Contrast ratio ≥ 3:1 for large text (18px+)

**Glassmorphism Components:**
- [ ] Text readable against Aurora gradient backgrounds
- [ ] Border visibility on Deep Slate (#020408)
- [ ] Hover states clearly visible

**Interactive Elements:**
- [ ] All buttons have cursor-pointer
- [ ] Keyboard focus indicators visible
- [ ] Tab order logical and complete
- [ ] No keyboard traps

### Deliverable Structure

**Artifact:** `accessibility_audit_report.md`

```markdown
# Accessibility Audit Report
**Date:** 2026-02-15
**Auditor:** INSPECTOR
**Standard:** WCAG 2.1 AA

## Executive Summary
- Total violations found: [X]
- Critical: [X]
- High: [X]
- Medium: [X]
- Low: [X]

## Violations by Page

### Landing Page
- [List violations with severity, location, remediation]

### Dashboard
- [List violations]

[... for each page in scope ...]

## Violations by Component

### TopHeader
- [List violations]

### Sidebar
- [List violations]

[... for each component ...]

## Remediation Summary

### Fixed by INSPECTOR
- [List of fixes applied]

### Requires DESIGNER
- [List of issues needing design work]

### Requires BUILDER
- [List of issues needing code changes]

### Requires LEAD
- [List of architectural issues]

## Screenshots
[Before/after screenshots of fixes]

## Remaining Issues
[Issues that couldn't be resolved during audit]
```

### Assignment

**Owner:** INSPECTOR  
**Status:** 03_BUILD (INSPECTOR executes audits in BUILD phase)  
**Priority:** P1 (Critical)

INSPECTOR should use the `accessibility-checker` skill and browser tool to complete this audit systematically.
