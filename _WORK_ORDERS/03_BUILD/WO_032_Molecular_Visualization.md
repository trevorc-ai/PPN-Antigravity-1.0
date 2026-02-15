---
work_order_id: WO_032
title: Implement High-Performance Molecular Visualization
type: FEATURE
category: Feature
priority: HIGH
status: INBOX
created: 2026-02-15T00:31:20-08:00
requested_by: Trevor Calton
assigned_to: DESIGNER
estimated_complexity: 7/10
failure_count: 0
owner: BUILDER
status: 03_BUILD
---

# Work Order: Implement High-Performance Molecular Visualization

## 🎯 THE GOAL

Upgrade the molecular visualization components to meet "Scientific Authority" standards with zero performance penalty.

### PRE-FLIGHT CHECK

- Check `src/components/science/` for existing viewers
- Confirm `3dmol` or `3dmol.js` is available in `package.json`

### Directives

1. **Lazy-Load Architecture:** Create a `MoleculeViewer` component that loads a static 2D PNG/SVG placeholder *first*. Only initialize the heavy WebGL context when the user hovers (desktop) or taps "Interact" (mobile).

2. **Scientific Styling:** Configure the 3D renderer to use "Ball and Stick" representation by default (not just lines).
   - Atoms: CPK coloring (standard scientific accuracy)
   - Material: "Shiny" or "Plastic" to match the PPN glassmorphism aesthetic

3. **Data Handling:**
   - Accept `smiles` string or `pdb` file URL as props
   - Fail gracefully: If the structure data is missing or malformed, stay on the static image fallback without crashing

4. **Interaction:** Allow users to:
   - Auto-rotate on load (slow spin)
   - Click-and-drag to rotate
   - Scroll to zoom

---

## 🎯 THE BLAST RADIUS (Authorized Target Area)

- `src/components/science/MoleculeViewer.tsx` (New Reusable Component)
- `src/pages/SubstanceDetail.tsx` (Integration point)
- `src/types/substance.ts` (Add `smilesString` field if missing)

---

## ⚡ THE ELECTRIC FENCE (Strict "DO NOT TOUCH" Constraints)

**DO NOT:**
- Instantiate WebGL contexts for items that are off-screen (Use Intersection Observer)
- Use "Artistic" shaders that obscure the molecular structure
- Block the main thread during parsing

**MUST:**
- Lazy-load WebGL contexts
- Use scientific-grade rendering
- Fail gracefully with fallback

---

## ✅ Acceptance Criteria

### Pre-Flight Verification
- [ ] Check for existing viewers in `src/components/science/`
- [ ] Verify `3dmol.js` in `package.json`

### Lazy-Load Architecture
- [ ] Static 2D placeholder loads first
- [ ] WebGL context initializes on hover (desktop)
- [ ] WebGL context initializes on "Interact" tap (mobile)
- [ ] Intersection Observer prevents off-screen rendering

### Scientific Styling
- [ ] "Ball and Stick" representation
- [ ] CPK coloring for atoms
- [ ] "Shiny" or "Plastic" material
- [ ] Matches glassmorphism aesthetic

### Data Handling
- [ ] Accepts `smiles` string prop
- [ ] Accepts `pdb` file URL prop
- [ ] Graceful fallback for missing data
- [ ] Graceful fallback for malformed data
- [ ] No crashes on parse errors

### Interaction
- [ ] Auto-rotate on load (slow spin)
- [ ] Click-and-drag to rotate
- [ ] Scroll to zoom
- [ ] Smooth performance (60fps)

---

## 📝 MANDATORY COMPLIANCE

### ACCESSIBILITY
- **Container must have `aria-label="3D structure of [Substance Name]"`**
- Keyboard focus support
- Screen reader compatible

### SECURITY
- **No external script loading from untrusted CDNs**
- All dependencies from package.json

---

## 🚦 Status

**INBOX** - Awaiting LEAD architectural review

---

## 📋 Performance Strategy

### The "Lazy-Load" Rule
**Problem:** Loading 10 WebGL canvases on a search results page drops frame rate to 10fps  
**Solution:** Placeholder-first strategy. 3D engine only boots on user intent (hover/click)

### The "Ball & Stick" Authority
**Problem:** Default wireframe rendering looks like 1990s software  
**Solution:** "Ball and Stick" with "Shiny" materials for lab-instrument quality

### The "Graceful Fail" Resilience
**Problem:** Typo in SMILES string can crash parser  
**Solution:** Fallback to static image, hide errors from user

### The "ARIA" Accessibility
**Problem:** Canvas elements are invisible to screen readers  
**Solution:** `aria-label` with substance name for WCAG 2.1 compliance

---

## 📋 Technical Specifications

### Component Interface
```typescript
interface MoleculeViewerProps {
  substanceName: string;
  smiles?: string;
  pdbUrl?: string;
  placeholderImage: string;
  autoRotate?: boolean;
}
```

### Lazy Loading Pattern
```typescript
const [is3DActive, setIs3DActive] = useState(false);

// Desktop: hover
onMouseEnter={() => setIs3DActive(true)}

// Mobile: tap "Interact" button
onClick={() => setIs3DActive(true)}
```

---

## Dependencies

- `3dmol.js` library
- Intersection Observer API

## LEAD ARCHITECTURE

**Technical Strategy:**
Create high-performance MoleculeViewer component with lazy-loading WebGL and scientific-grade rendering.

**Files to Touch:**
- `src/components/science/MoleculeViewer.tsx` - NEW: Lazy-load 3D viewer
- `src/pages/SubstanceDetail.tsx` - Integration point
- `src/types/substance.ts` - Add `smilesString` field
- `package.json` - Add 3dmol.js dependency

**Constraints:**
- MUST lazy-load WebGL contexts (Intersection Observer)
- MUST use "Ball and Stick" scientific rendering
- MUST fail gracefully with static fallback
- MUST NOT block main thread during parsing
- MUST ensure accessibility (aria-label)

**Recommended Approach:**
1. Install 3dmol.js: `npm install 3dmol`
2. Create MoleculeViewer with placeholder-first strategy
3. Initialize WebGL on hover (desktop) or tap (mobile)
4. Use Intersection Observer to prevent off-screen rendering
5. Configure "Ball and Stick" with CPK coloring
6. Add auto-rotate, click-drag, scroll-zoom interactions
7. Graceful fallback for missing/malformed data

**Risk Mitigation:**
- INSPECTOR should review performance implications
- Test with multiple molecules on same page
- Verify 60fps performance
- Ensure no external CDN loading (security)

**Routing Decision:** → BUILDER (with INSPECTOR review for performance/security)
