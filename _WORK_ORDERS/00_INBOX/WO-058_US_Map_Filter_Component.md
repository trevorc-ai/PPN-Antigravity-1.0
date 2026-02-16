---
id: WO-058
status: 00_INBOX
priority: P2 (High)
category: Feature / UI Component
owner: PENDING_LEAD_ASSIGNMENT
failure_count: 0
created_date: 2026-02-16T13:33:34-08:00
estimated_complexity: 4/10
estimated_timeline: 1-2 days
---

# User Request

Create an interactive, clickable US map component that can act as a filter for state-based data selection across the application.

## Project Goal

Implement a reusable US map filter component using `react-simple-maps` that allows users to:
- Click on states to select/deselect them
- Visually see which states are selected
- Use the map as a filter for data (e.g., news articles, clinical trials, regulatory information)
- Integrate seamlessly with the Clinical Sci-Fi aesthetic

---

## THE BLAST RADIUS (Authorized Target Area)

### New Files to Create

**Frontend Components:**
- `src/components/filters/USMapFilter.tsx` - Main interactive map component
- `src/types/map.ts` - TypeScript types for map data

### Files to Modify

**Dependencies:**
- `package.json` - Add `react-simple-maps` dependency

**Potential Integration Points:**
- `src/pages/News.tsx` - Could replace or enhance Regulatory Mosaic
- `src/pages/Analytics.tsx` - For geographic filtering
- Any page that needs state-based filtering

---

## ⚡ THE ELECTRIC FENCE (Strict "DO NOT TOUCH" Constraints)

**DO NOT:**
- Modify existing Regulatory Mosaic component (unless explicitly replacing it)
- Change routing or navigation logic
- Alter database schema or API endpoints
- Collect PHI/PII data
- Use color alone to indicate state selection (accessibility requirement)

**MUST:**
- Maintain WCAG 2.1 AA compliance
- Use Clinical Sci-Fi styling (slate colors, primary blue, glassmorphism)
- Support keyboard navigation
- Provide clear visual feedback for selected states
- Include proper ARIA labels

---

## 📋 TECHNICAL SPECIFICATION

### Library Selection

**Package:** `react-simple-maps`
**Map Data:** CDN-hosted US Atlas (https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json)

**Why this choice:**
- Lightweight and performant
- SVG-based (easy to style)
- Simple click handlers
- Works seamlessly with React and Tailwind
- Minimal bundle size impact

### Component API

```typescript
interface USMapFilterProps {
  selectedStates?: string[];           // Array of state codes (e.g., ["CA", "NY", "OR"])
  onStateClick: (stateCode: string, stateName: string) => void;
  multiSelect?: boolean;               // Allow multiple state selection (default: true)
  className?: string;                  // Additional Tailwind classes
  showSelectedBadges?: boolean;        // Show selected states as badges below map
  disabled?: boolean;                  // Disable interaction
}
```

### Visual Design Requirements

**Color Scheme (Clinical Sci-Fi):**
- Default state: `fill-slate-700/50` with `stroke-slate-800/50`
- Hover state: `fill-slate-600` with `stroke-slate-700`
- Selected state: `fill-primary/80` with `stroke-primary`
- Disabled state: `fill-slate-800/30` with reduced opacity

**Container Styling:**
- Glassmorphism card: `bg-[#1c222d]/40 border border-slate-800 rounded-[2.5rem] p-8 backdrop-blur-md`
- Header with icon and title
- Responsive sizing (scales with container)

**Accessibility:**
- Keyboard navigation support (Tab, Enter, Space)
- ARIA labels for each state
- Visual indicators beyond color (border styles, icons)
- Screen reader announcements for state selection

### State Management

**Selected States Display:**
```tsx
{selectedStates.length > 0 && (
  <div className="mt-6 flex flex-wrap gap-2">
    {selectedStates.map(state => (
      <span 
        key={state}
        className="px-3 py-1 bg-primary/20 border border-primary/30 rounded-full text-xs font-bold text-primary"
      >
        {state}
        <button 
          onClick={() => onStateClick(state)}
          className="ml-2 text-slate-400 hover:text-slate-200"
        >
          ×
        </button>
      </span>
    ))}
  </div>
)}
```

---

## 🎨 IMPLEMENTATION PLAN

### Step 1: Install Dependencies

```bash
npm install react-simple-maps
```

**Optional (for TypeScript):**
```bash
npm install --save-dev @types/react-simple-maps
```

### Step 2: Create Type Definitions

**File:** `src/types/map.ts`

```typescript
export interface USMapFilterProps {
  selectedStates?: string[];
  onStateClick: (stateCode: string, stateName: string) => void;
  multiSelect?: boolean;
  className?: string;
  showSelectedBadges?: boolean;
  disabled?: boolean;
}

export interface StateGeography {
  id: string;              // State FIPS code
  properties: {
    name: string;          // Full state name
  };
}
```

### Step 3: Create USMapFilter Component

**File:** `src/components/filters/USMapFilter.tsx`

**Core Features:**
- Import `ComposableMap`, `Geographies`, `Geography` from `react-simple-maps`
- Use CDN map data: `https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json`
- Implement click handlers for state selection
- Apply Clinical Sci-Fi styling
- Support multi-select and single-select modes
- Show selected states as removable badges

**Styling Requirements:**
- Use `geoAlbersUsa` projection (optimized for US)
- Apply smooth transitions (300ms duration)
- Implement hover effects
- Use glassmorphism container
- Add header with map icon and title

### Step 4: Create Example Integration

**Example usage in News page:**

```tsx
import USMapFilter from '../components/filters/USMapFilter';

const News = () => {
  const [selectedStates, setSelectedStates] = useState<string[]>([]);

  const handleStateClick = (stateCode: string, stateName: string) => {
    setSelectedStates(prev => 
      prev.includes(stateCode)
        ? prev.filter(s => s !== stateCode)
        : [...prev, stateCode]
    );
    // Apply filter logic here
  };

  return (
    <PageContainer>
      <USMapFilter
        selectedStates={selectedStates}
        onStateClick={handleStateClick}
        showSelectedBadges={true}
      />
      {/* Filtered content */}
    </PageContainer>
  );
};
```

### Step 5: Testing & Verification

**Test Cases:**
- [ ] Map renders correctly with all 50 states
- [ ] Click on state selects it (visual feedback)
- [ ] Click on selected state deselects it
- [ ] Multi-select mode works (multiple states selected)
- [ ] Single-select mode works (only one state at a time)
- [ ] Keyboard navigation works (Tab, Enter, Space)
- [ ] Hover effects work smoothly
- [ ] Selected state badges display correctly
- [ ] Badge remove buttons work
- [ ] Responsive at all breakpoints (375px, 768px, 1024px, 1440px)
- [ ] Accessibility: screen reader announces state selection
- [ ] No console errors or warnings

---

## ✅ ACCEPTANCE CRITERIA

### Functionality
- [ ] Map renders all US states correctly
- [ ] States are clickable and selectable
- [ ] Visual feedback for selected states (color + border)
- [ ] Multi-select and single-select modes work
- [ ] onStateClick callback fires with correct state code and name
- [ ] Selected states display as removable badges (if enabled)
- [ ] Badge remove buttons deselect states

### Visual Design
- [ ] Matches Clinical Sci-Fi aesthetic
- [ ] Uses correct color scheme (slate + primary blue)
- [ ] Glassmorphism container styling applied
- [ ] Smooth transitions and hover effects
- [ ] Responsive sizing (scales with container)
- [ ] Clean, professional appearance

### Accessibility
- [ ] Keyboard navigation works (Tab, Enter, Space)
- [ ] ARIA labels present for all states
- [ ] Screen reader announces state selection
- [ ] Visual indicators beyond color (borders, icons)
- [ ] Minimum 12px font size for all text
- [ ] Sufficient color contrast (WCAG 2.1 AA)

### Integration
- [ ] Component is reusable across pages
- [ ] Easy to integrate with existing filter logic
- [ ] TypeScript types defined
- [ ] Props API is clear and flexible
- [ ] No breaking changes to existing components

### Performance
- [ ] Map loads quickly from CDN
- [ ] No lag when clicking states
- [ ] Smooth transitions and animations
- [ ] Minimal bundle size impact

---

## 📝 MANDATORY COMPLIANCE

### ACCESSIBILITY (WCAG 2.1 AA)
- Minimum 12px fonts
- Keyboard accessible
- Screen reader friendly
- Sufficient color contrast
- ARIA labels where needed
- Readable without color alone

### SECURITY & PRIVACY
- No PHI/PII collection
- No external data tracking
- CDN map data only (no user data sent)

---

## 🚦 Status

**INBOX** - Awaiting LEAD architectural review and assignment

---

## 📋 DELIVERABLES

1. **USMapFilter Component** (`src/components/filters/USMapFilter.tsx`)
   - Interactive US map with state selection
   - Clinical Sci-Fi styling
   - Keyboard and mouse support
   - Selected state badges

2. **Type Definitions** (`src/types/map.ts`)
   - USMapFilterProps interface
   - StateGeography interface

3. **Updated package.json**
   - `react-simple-maps` dependency added

4. **Documentation**
   - Component usage examples
   - Props API documentation
   - Integration guide

5. **Example Integration** (optional)
   - Demonstrate usage in News page or Analytics page

---

## 🔧 TECHNICAL STACK

**Frontend:**
- React 18+
- TypeScript
- Tailwind CSS
- react-simple-maps (new dependency)

**Map Data:**
- US Atlas TopoJSON (CDN-hosted)
- No additional backend required

---

## 📖 NOTES

This is a **straightforward feature addition** that enhances filtering capabilities across the application. The component should be:

1. **Reusable** - Works on any page that needs state filtering
2. **Flexible** - Supports multi-select and single-select modes
3. **Accessible** - Full keyboard and screen reader support
4. **Performant** - Lightweight, fast rendering
5. **Styled** - Matches Clinical Sci-Fi aesthetic perfectly

**Key Design Principle:**
The map should feel like a natural extension of the existing UI, not a jarring addition. Use consistent spacing, colors, and interaction patterns.

---

## Dependencies

**Prerequisites:**
- None - This is a new standalone component

**Future Integration:**
- Could replace Regulatory Mosaic in News page
- Could be used in Analytics for geographic filtering
- Could be used in any page requiring state-based data filtering

---

## Estimated Timeline

- **Step 1 (Install):** 5 minutes
- **Step 2 (Types):** 15 minutes
- **Step 3 (Component):** 2-3 hours
- **Step 4 (Integration):** 1 hour
- **Step 5 (Testing):** 1-2 hours

**Total:** 4-6 hours (1 day for focused work)

---

## Risk Mitigation

**Risk:** CDN map data fails to load
**Mitigation:** Add error handling and fallback message

**Risk:** Performance issues with SVG rendering
**Mitigation:** Use optimized 10m (medium detail) map data, not high-resolution

**Risk:** Accessibility issues
**Mitigation:** Test with keyboard and screen reader before completion

**Risk:** Styling conflicts with existing components
**Mitigation:** Use scoped Tailwind classes, test on multiple pages
