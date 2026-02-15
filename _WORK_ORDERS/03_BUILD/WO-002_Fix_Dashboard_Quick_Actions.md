---
id: WO-002
status: 03_BUILD
priority: P2 (High)
category: Bug / Design
owner: LEAD
assigned_date: 2026-02-15T05:49:00-08:00
failure_count: 0
---

# User Request

**TASK TITLE:** Fix Dashboard Quick Action Button Navigation

## 1. THE GOAL

Fix the "Quick Actions" dashboard buttons shown in the provided screenshot. Currently, the following buttons are non-functional and must be wired to their correct routes or state handlers:

1. **LOG PROTOCOL:** Link to the Protocol Builder modal or page (`/protocol-builder`).
2. **ANALYTICS:** Route to the Clinical Intelligence/Analytics page (`/analytics` or `ClinicalIntelligence.tsx`).
3. **CHECK INTERACTIONS:** Route to the Drug Interaction knowledge graph section.
4. **EXPORT DATA:** Implement a CSV export function for the current user's protocols or link to the Data Management section.
5. **BENCHMARKS:** Route to the peer-benchmarking/cohort matches section.

### Additional Requirements:
- Ensure each button has a hover state and appropriate `cursor-pointer` styling.
- If a feature is locked behind a specific tier (as per the new Tiered Access model), implement a "Locked" visual state with a 🔒 icon and a tooltip indicating the required upgrade.

## 2. THE BLAST RADIUS (Authorized Target Area)

You and the swarm are ONLY allowed to modify the following specific files/areas:

- `/frontend/src/pages/ActivePractice.tsx` (or the Dashboard component where "Quick Actions" live)
- `/frontend/src/components/dashboard/QuickActions.tsx` (if componentized)
- `/frontend/src/routes/` (to verify route paths)

## 3. THE ELECTRIC FENCE (Strict "DO NOT TOUCH" Constraints)

- DO NOT change the "Clinical Sci-Fi" visual design system: keep the Deep Slate (#020408) background and specific button border colors.
- DO NOT modify the backend API or database schema.
- DO NOT add any free-text input fields to these buttons to maintain HIPAA compliance (No PHI/PII).
- Ensure font sizes remain at least 14px (text-sm) for accessibility.
- **CRITICAL:** If you believe you must touch a navigation file outside the Blast Radius to add a missing route, you must FAIL the task and return it to the Inbox.

## 4. MANDATORY COMPLIANCE

### Accessibility:
- Minimum 12px fonts (preferably 14px/text-sm for buttons)
- Ensure icons and text labels are clearly legible against the dark background
- Use both icons and text labels (not color-only meaning)

### Security:
- Ensure data export functionality does not include any identifying timestamps or patient-linked names
- No PHI/PII in exported data
- Export should be de-identified and anonymous

## 5. VISUAL REFERENCE

User has provided a screenshot showing the current Quick Actions buttons:
- LOG PROTOCOL (blue/slate border)
- ANALYTICS (blue/slate border)
- CHECK INTERACTIONS (yellow/gold border - highlighted)
- EXPORT DATA (green/teal border)
- BENCHMARKS (purple border)

All buttons should maintain their current visual styling while adding proper navigation functionality.
