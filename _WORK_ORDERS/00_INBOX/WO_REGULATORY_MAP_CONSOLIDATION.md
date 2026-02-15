---
title: "Regulatory Map Consolidation"
category: "Design / Refactoring"
priority: "P2"
assigned_to: "DESIGNER"
created_date: "2026-02-15"
status: "PENDING"
failure_count: 0
estimated_effort: "MEDIUM"
---

# Regulatory Map Consolidation

## 1. THE GOAL

Consolidate the Regulatory Map component into the News section to improve information architecture and reduce sidebar clutter.

### Component Migration
Move the Regulatory Map functionality from its standalone route into the News page as a dedicated tab or section.

### Sidebar Cleanup
Remove the Regulatory Map navigation item from the sidebar to streamline the navigation experience.

### User Experience Enhancement
Ensure the regulatory information remains easily discoverable within the News context while maintaining all existing functionality.

---

## 2. THE BLAST RADIUS (Authorized Target Area)

You are ONLY allowed to modify the following specific files/areas:
* `/frontend/src/pages/News.tsx` (Add Regulatory Map section/tab)
* `/frontend/src/components/Sidebar.tsx` (Remove Regulatory Map nav item)
* `/frontend/src/pages/RegulatoryMap.tsx` (Refactor into component)
* `/frontend/src/components/regulatory/` (Component reorganization)
* `/frontend/src/App.tsx` (Update routing if necessary)

---

## 3. THE ELECTRIC FENCE (Strict "DO NOT TOUCH" Constraints)

* **DO NOT** modify the underlying regulatory data or data sources
* **DO NOT** remove any regulatory map functionality or features
* **DO NOT** alter the database schema or API endpoints
* **DO NOT** change the "Clinical Sci-Fi" brand styling
* **DO NOT** impact accessibility features (maintain WCAG 2.1 AA compliance)
* **DO NOT** modify authentication or tier-based access logic

---

## 4. MANDATORY COMPLIANCE

### ACCESSIBILITY
* Maintain minimum 12px fonts
* Preserve all existing ARIA labels and keyboard navigation
* Ensure tab/section navigation is screen-reader accessible
* Keep dual-mode state indicators (color + icon/text)

### USER EXPERIENCE
* Regulatory information must remain easily discoverable
* No loss of functionality during consolidation
* Smooth transition animations between News and Regulatory content
* Responsive design across all viewport sizes

### CODE QUALITY
* Follow existing component architecture patterns
* Maintain TypeScript type safety
* Update routing configuration cleanly
* Remove unused code after consolidation

---

## IMPLEMENTATION CHECKLIST

### Phase 1: Component Refactoring
- [ ] Refactor RegulatoryMap page into reusable component
- [ ] Create RegulatoryMapSection component for News integration
- [ ] Ensure all regulatory map features are preserved
- [ ] Test component in isolation

### Phase 2: News Page Integration
- [ ] Add Regulatory Map tab/section to News page
- [ ] Implement tab navigation (News Articles | Regulatory Map)
- [ ] Style integration with Clinical Sci-Fi aesthetic
- [ ] Ensure responsive behavior

### Phase 3: Sidebar & Routing Updates
- [ ] Remove Regulatory Map navigation item from Sidebar
- [ ] Update routing configuration in App.tsx
- [ ] Add redirect from old /regulatory route to /news?tab=regulatory
- [ ] Test navigation flow

### Phase 4: Cleanup & Verification
- [ ] Remove unused RegulatoryMap page file
- [ ] Clean up unused imports and dependencies
- [ ] Verify no broken links or navigation issues
- [ ] Test accessibility with screen reader
- [ ] Capture before/after screenshots

---

## DELIVERABLES

1. **Refactored Components** with Regulatory Map integrated into News
2. **Updated Sidebar** with Regulatory Map item removed
3. **Routing Configuration** with proper redirects
4. **Visual Verification Screenshots** showing:
   - News page with Regulatory Map tab
   - Updated sidebar navigation
   - Responsive behavior across viewports
5. **Accessibility Report** confirming WCAG 2.1 AA compliance maintained

---

## SUCCESS CRITERIA

- [ ] Regulatory Map functionality fully integrated into News page
- [ ] All regulatory map features preserved and functional
- [ ] Sidebar navigation item removed cleanly
- [ ] Routing updated with proper redirects
- [ ] No broken links or navigation issues
- [ ] Accessibility standards maintained (WCAG 2.1 AA)
- [ ] Responsive design verified across viewports
- [ ] Clinical Sci-Fi styling preserved
- [ ] Unused code removed and cleaned up
- [ ] User can easily discover regulatory information within News
