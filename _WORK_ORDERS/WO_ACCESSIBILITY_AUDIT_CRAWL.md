---
title: "Full Site-Wide Accessibility Audit and Component Crawl"
category: "Design / QA"
priority: "P1"
owner: "DESIGNER"
assigned_to: "DESIGNER"
created_date: "2026-02-15"
status: "02_DESIGN"
failure_count: 0
estimated_effort: "HIGH"
---

# Full Site-Wide Accessibility Audit and Component Crawl

## 1. THE GOAL

Execute a comprehensive "crawl" and inspection of every page and component currently rendered in the application to ensure 100% adherence to the PPN Research Portal standards.

### Accessibility Scan
Audit every element for WCAG 2.1 AA compliance. Specifically:
* Verify all fonts are ≥12px (`text-xs`).
* Ensure no state (success, error, warning) is communicated via color alone; every status must have a corresponding icon (⚠️, ✅, ❌) or explicit text label.
* Check contrast ratios on all "Glassmorphism" components against the Aurora/Deep Slate backgrounds.

### Component 'Crawl'
Inspect all routes (Landing, Dashboard, News, etc.) for "Vibe Coding" placeholders, broken buttons, or non-functional HUD elements.

### Hierarchy & Logic Check
Ensure all components are in their correct architectural folders and that "Patient/Consumer" tier features (Drug Interaction, Safety Matrix) are accessible while restricted "Pro" features (Aggregate Analytics) are correctly locked with a visual 🔒 indicator.

### Report Generation
Create an `accessibility_audit_report.md` artifact detailing every violation found and the remediation applied.

---

## 2. THE BLAST RADIUS (Authorized Target Area)

You and the swarm are ONLY allowed to modify the following specific files/areas:
* `/frontend/src/` (All components and pages for styling/markup fixes)
* `/frontend/src/styles/` (Global and component-specific CSS/Tailwind configs)
* `_WORK_ORDERS/01_TRIAGE/` (To document any logic failures that require ARCHITECT intervention)

---

## 3. THE ELECTRIC FENCE (Strict "DO NOT TOUCH" Constraints)

* **DO NOT** modify the backend database schema, Supabase RLS policies, or API controllers.
* **DO NOT** remove functional clinical logic or scientific data structures.
* **DO NOT** alter the "Clinical Sci-Fi" brand identity (Deep Slate #020408 background and Aurora gradients).
* **DO NOT** collect or display any PHI/PII during the audit.
* Follow the **"Two-Strike Rule"**: if a styling fix fails to resolve an accessibility contrast issue twice, STOP and revert.

---

## 4. MANDATORY COMPLIANCE

### ACCESSIBILITY
This is the primary mission. Minimum 12px fonts and dual-mode state indicators (color + icon/text) are non-negotiable.

### SECURITY
Ensure the audit process does not expose any internal environment variables or configuration metadata.

---

## DELIVERABLES

1. **Accessibility Audit Report** (`accessibility_audit_report.md`) documenting:
   - All violations found (font sizes, color-only states, contrast issues)
   - Remediation actions taken
   - Before/after screenshots where applicable
   - Any issues escalated to TRIAGE

2. **Component Inventory** listing all pages/components audited with their compliance status

3. **Code Changes** to fix accessibility violations within the authorized blast radius

---

## SUCCESS CRITERIA

- [ ] All fonts meet minimum 12px requirement
- [ ] All status indicators use dual-mode communication (color + icon/text)
- [ ] All glassmorphism components pass contrast ratio requirements
- [ ] No "vibe coding" placeholders remain
- [ ] All components are in correct architectural folders
- [ ] Consumer vs Pro tier features are correctly gated with visual indicators
- [ ] Comprehensive audit report generated
- [ ] Zero PHI/PII exposure during audit process
