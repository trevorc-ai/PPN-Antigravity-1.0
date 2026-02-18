---
title: "Regulatory Map Consolidation"
category: "Design / Refactoring"
priority: "P2"
owner: "BUILDER"
assigned_to: "BUILDER"
created_date: "2026-02-15"
status: "03_BUILD"
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

---

## 🎨 DESIGNER DELIVERABLE — DESIGN BRIEF

**Completed:** 2026-02-18T01:15:00-08:00

---

### DESIGN ANALYSIS

**Current state:**
- Regulatory Map lives at `/regulatory` as a standalone page with its own sidebar nav item
- This creates sidebar clutter and a separate mental model for users
- The News page at `/news` covers current events in the psychedelic therapy space
- Regulatory information is contextually related to news — they belong together

**Design rationale for consolidation:**
- Regulatory changes ARE news — they share the same information category
- Combining them reduces cognitive overhead (one destination for "what's happening in the field")
- Removes one sidebar item, reducing navigation complexity
- Regulatory map content is relatively static — doesn't need its own top-level route

---

### LAYOUT SPEC: News Page with Regulatory Tab

**Tab navigation pattern:**
```
┌─────────────────────────────────────────────┐
│  News & Regulatory Intelligence             │
│                                             │
│  [News Articles]  [Regulatory Map]          │
│  ─────────────────────────────────────────  │
│                                             │
│  [Tab content renders here]                 │
│                                             │
└─────────────────────────────────────────────┘
```

**Tab styling:**
- Active tab: `border-b-2 border-primary text-slate-300 font-black`
- Inactive tab: `text-slate-500 hover:text-slate-300 font-bold`
- Tab font: `text-[14px]` minimum ✅
- Tab container: `flex gap-6 border-b border-slate-800 mb-8`
- URL param: `?tab=news` (default) and `?tab=regulatory`

**Page header:**
- Title: "News & Regulatory Intelligence" (updated from just "News")
- Subtitle: "Latest developments in psychedelic therapy research and regulatory landscape"
- Keep existing Clinical Sci-Fi styling

**Tab 1: News Articles (existing content)**
- No changes to existing news article layout
- Just wrap in tab panel

**Tab 2: Regulatory Map**
- Render the existing `RegulatoryMap` component content here
- Add a brief intro: "Current regulatory status of psychedelic-assisted therapy across jurisdictions"
- Keep all existing map functionality (filters, country status, etc.)

---

### SIDEBAR CHANGE

**Remove:** "Regulatory Map" nav item from sidebar
**Update:** "News" nav item label to "News & Regulatory" (or keep as "News" — BUILDER's call)

---

### ROUTING CHANGE

- Old route: `/regulatory` → standalone `RegulatoryMap` page
- New route: `/news?tab=regulatory` → News page with Regulatory tab active
- Add redirect: `<Route path="/regulatory" element={<Navigate to="/news?tab=regulatory" replace />} />`

---

### TRANSITION ANIMATION

- Tab switch: `animate-in fade-in duration-200` on tab content
- Keep existing page entrance animations

---

### ACCESSIBILITY

- Tab elements: `role="tab"` + `aria-selected` + `aria-controls`
- Tab panels: `role="tabpanel"` + `aria-labelledby`
- Keyboard: Arrow keys to switch tabs, Enter to activate
- Tab font: minimum 14px ✅
- No color-only tab state: active tab uses both color AND underline border

---

### HANDOFF NOTES FOR BUILDER

1. **Refactor `RegulatoryMap.tsx`** into a component (remove page wrapper, keep content)
2. **Update `News.tsx`** to add tab state (`?tab=news` | `?tab=regulatory`) and render either news articles or `<RegulatoryMapSection />`
3. **Update `Sidebar.tsx`** to remove Regulatory Map nav item
4. **Update `App.tsx`** to add redirect from `/regulatory` to `/news?tab=regulatory`
5. **Keep all existing regulatory map features** — no functionality changes

**Estimated BUILDER time:** 2-3 hours

---

**DESIGNER SIGN-OFF:** ✅ Design complete. Routing to BUILDER.
