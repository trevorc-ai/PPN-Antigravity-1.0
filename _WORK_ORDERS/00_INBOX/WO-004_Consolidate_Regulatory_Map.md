---
id: WO-004
status: 00_INBOX
priority: P2 (High)
category: Design / Architecture
owner: PENDING_LEAD_ASSIGNMENT
failure_count: 0
---

# User Request

**TASK TITLE:** Consolidate Regulatory Map into News Portal

## 1. THE GOAL

Merge the "Regulatory Map" functional component into the "News Feed" page to create a unified Intelligence Hub.

### Specific Tasks:

1. **Component Migration:** Move the `RegulatoryMosaic` (state-by-state status grid) component from its standalone page into a new section on the `News.tsx` page.

2. **Layout Integration:** Update `News.tsx` to a combined layout. Place the Regulatory Grid either above or below the main News Feed, ensuring it maintains its "Glass Panel" styling.

3. **Sidebar Cleanup:** Remove the "Regulatory Map" entry from the `Sidebar.tsx` navigation menu.

4. **Enhanced Filtering:** Ensure the existing News compound/type filters also trigger relevant updates or highlighting in the Regulatory Grid where applicable (e.g., filtering for "Psilocybin" news should highlight Psilocybin status on the map).

5. **Feed Integration:** Add a specific "Regulatory Updates" RSS feed or data stream to the sidebar of the News page to provide live tracking of legislative changes.

### Visual Reference:

User has provided screenshots showing:

**Current Regulatory Map Page:**
- Standalone page with state-by-state grid view
- Status indicators: Legal (green), Decrim (teal), Medical (blue), Pending (yellow)
- States shown: OR, CO, CA, WA, TX, NY, FL, MA, MI, AZ, NV, CT, OREGON (detailed view)
- "DETAILED GRID VIEW" toggle option
- Right sidebar with "SYSTEM STATUS" information

**Current News Feed Page:**
- Hero article with large image
- Filter tags: BREAKTHROUGH, PHASE III, trending topics
- Tabs: MOST RECENT, MOST CITED, COMPOUND TYPE
- Right sidebar with "Weekly Briefing", "PORTAL METRICS", and "SOURCE CONTEXT"
- News cards with article previews

**Target:** Combine both into a unified Intelligence Hub page.

## 2. THE BLAST RADIUS (Authorized Target Area)

You and the swarm are ONLY allowed to modify the following specific files/areas:

- `/frontend/src/pages/News.tsx`
- `/frontend/src/components/navigation/Sidebar.tsx`
- `/frontend/src/components/intelligence/RegulatoryMosaic.tsx` (or equivalent map component file)
- `/frontend/src/routes/AppRoutes.tsx` (to remove the standalone route)

## 3. THE ELECTRIC FENCE (Strict "DO NOT TOUCH" Constraints)

- DO NOT modify the logic or content of the `AuditLogs.tsx` or `SafetySurveillance.tsx`.
- DO NOT change the "Aurora" background global styles or Deep Slate (#020408) theme constants.
- DO NOT delete the `RegulatoryMosaic` component logic; only move its implementation and delete its standalone page file.
- DO NOT touch any PHI/PII data or patient-linked records.
- Ensure the "Source Context" and "Portal Metrics" cards on the News page remain intact.

## 4. MANDATORY COMPLIANCE

### Accessibility:
- Minimum 12px fonts
- Ensure the status indicators in the migrated Regulatory Grid (Legal, Decrim, Medical, Pending) continue to use both color and text/icons for clarity
- Maintain keyboard navigation for all interactive elements

### Security:
- Ensure the integrated RSS feed does not introduce non-sanitized HTML or scripts (XSS protection)
- No PHI/PII in news content or regulatory data
- Sanitize all external feed content before rendering

## 5. INTEGRATION REQUIREMENTS

### Layout Options to Consider:
- **Option A:** Regulatory Grid above News Feed (priority view)
- **Option B:** Regulatory Grid below News Feed (news-first view)
- **Option C:** Tabbed interface (News | Regulatory Map)

### Filter Synchronization:
- When user filters news by compound (e.g., "Psilocybin"), highlight relevant states in Regulatory Grid
- When user clicks a state in Regulatory Grid, filter news to show relevant legislative updates
- Maintain existing filter functionality for both components

### Sidebar Enhancement:
- Add "Regulatory Updates" feed to existing sidebar
- Maintain "Weekly Briefing", "Portal Metrics", and "Source Context" cards
- Ensure responsive layout on smaller screens
