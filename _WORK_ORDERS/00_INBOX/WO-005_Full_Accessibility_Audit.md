---
id: WO-005
status: 00_INBOX
priority: P1 (Critical)
category: Design / QA
owner: PENDING_LEAD_ASSIGNMENT
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
