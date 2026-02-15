---
id: WO-003
status: 02_DESIGN
priority: P2 (High)
category: Design / Cleanup
owner: DESIGNER
assigned_date: 2026-02-15T05:44:00-08:00
failure_count: 0
---

# User Request

**TASK TITLE:** Global Header Audit and UI Component Cleanup

## 1. THE GOAL

Perform a comprehensive visual and functional audit of the application's Global Header to eliminate "Vibe Coding" placeholders and ensure all remaining elements align with the designated "Clinical Sci-Fi" design system.

### Specific Tasks:

1. **Component Inventory:** Identify every interactive and static element within the Header (e.g., logo, profile dropdown, search bar, and HUD metrics).

2. **Functional Validation:** For each identified element, verify if it has an active route or function. Any element that is purely decorative or leads to a "dead" path must be removed.

3. **Design Alignment:** Standardize remaining components to the system palette:
   - Background: Deep Slate (#020408) with Aurora radial gradients
   - Borders: Subtle "Glassmorphism" frosted effect
   - Typography: Labels must be at least 14px (text-sm)

4. **Neural Copilot Source Audit:** Specifically verify the data source/function of the "Neural Copilot" icon or link if present in the header, as noted in previous scratchpad logs.

### Visual Reference:
User has provided a screenshot showing HUD metrics in the header:
- **LATENCY:** 8.2ms (green indicator)
- **SYNC STATUS:** Synchronized (green text)

These metrics should be validated for functionality or removed if non-functional.

## 2. THE BLAST RADIUS (Authorized Target Area)

You and the swarm are ONLY allowed to modify the following specific files/areas:

- `/frontend/src/components/layout/Header.tsx`
- `/frontend/src/components/navigation/` (only files directly imported by the Header)
- `/frontend/src/styles/Header.module.css` (or equivalent style definitions)

## 3. THE ELECTRIC FENCE (Strict "DO NOT TOUCH" Constraints)

- DO NOT remove the User Profile or Login/Logout logic.
- DO NOT modify the main sidebar navigation logic or the main content area of the Dashboard.
- DO NOT change the "Patient Watchlist" or "Telemetry" card logic outside the header.
- DO NOT introduce new libraries for icons; stick to the existing Lucide React or Material Symbols.

## 4. MANDATORY COMPLIANCE

### Accessibility:
- Maintain minimum 12px fonts (`text-xs`)
- Do not rely on color alone to indicate navigation states (use underlines, icons, or high-contrast highlights)
- Ensure all interactive elements have proper hover states and cursor styling

### Security:
- Ensure no patient counts, clinician license numbers, or internal server names are hardcoded into labels
- No PHI/PII in header elements
- All metrics must be de-identified

## 5. CLEANUP CRITERIA

Elements to evaluate for removal:
- Non-functional decorative icons
- Dead links or placeholder navigation items
- HUD metrics that don't connect to real data sources
- "Vibe coding" placeholders without backend integration
- Any element that doesn't serve a clear user need

Elements to keep and validate:
- User profile/authentication controls
- Active navigation links
- Functional search (if implemented)
- Real-time metrics with actual data sources
