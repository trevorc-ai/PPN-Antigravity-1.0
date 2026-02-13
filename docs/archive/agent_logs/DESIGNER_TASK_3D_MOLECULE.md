# 🧬 DESIGNER TASK: 3D MOLECULE REDESIGN
## Custom Psilocybin Molecule for Landing Page

**Assigned To:** DESIGNER  
**Priority:** HIGH  
**Estimated Time:** 2-3 hours  
**Due Date:** This week

---

## 🎯 OBJECTIVE

Replace the current landing page molecule with a custom-designed, scientifically accurate 3D psilocybin molecule that:
1. Is visually stunning (premium, modern aesthetic)
2. Is scientifically accurate (correct molecular structure)
3. Reinforces our evidence-based positioning
4. Animates smoothly (subtle rotation, no distraction)

---

## 🧪 SCIENTIFIC SPECIFICATIONS

### **Molecule: Psilocybin (4-phosphoryloxy-N,N-dimethyltryptamine)**

**Chemical Formula:** C₁₂H₁₇N₂O₄P

**Molecular Structure:**
- Indole ring system (bicyclic structure)
- Dimethylamine group (-N(CH₃)₂)
- Phosphate ester group (-OPO₃H₂)
- Ethylamine side chain

**Reference Images:**
- PubChem CID: 10624
- ChemSpider ID: 10182
- 3D structure available at: https://pubchem.ncbi.nlm.nih.gov/compound/Psilocybin

**Key Visual Features:**
- 5-membered pyrrole ring fused to 6-membered benzene ring (indole)
- Phosphate group at position 4 (distinguishes from psilocin)
- Two methyl groups on terminal nitrogen

---

## 🎨 DESIGN REQUIREMENTS

### **Visual Style:**

**Aesthetic:**
- Modern, clean, scientific (not psychedelic/trippy)
- Glass/crystal material (aligns with glassmorphic design system)
- Subtle glow/emission (indigo/blue spectrum)
- Premium feel (not stock/generic)

**Color Palette:**
- Carbon atoms: Dark slate (#1e293b) with subtle glow
- Nitrogen atoms: Indigo (#6366f1) with brighter glow
- Oxygen atoms: Cyan (#06b6d4) 
- Phosphorus atom: Amber (#f59e0b) - highlight this (unique to psilocybin)
- Hydrogen atoms: White/light gray (#e2e8f0) - subtle, don't overwhelm

**Material Properties:**
- Atoms: Glass/crystal with internal glow
- Bonds: Thin cylinders with gradient (darker at edges, lighter in center)
- Overall: Translucent, not opaque
- Lighting: Rim lighting to emphasize 3D depth

---

### **Animation:**

**Primary Animation:**
- Slow, continuous rotation (Y-axis)
- Speed: 20-30 seconds per full rotation
- Easing: Linear (constant speed, meditative)

**Secondary Animation (Optional):**
- Subtle floating motion (up/down, 5-10px range)
- Breathing effect (scale 0.98 to 1.02)
- Glow pulse (opacity 0.7 to 1.0, 3-second cycle)

**Interaction (Optional):**
- Mouse hover: Pause rotation, allow manual rotation
- Click: Highlight specific atom groups with labels
- Scroll: Parallax effect (molecule moves slower than page)

---

## 📐 TECHNICAL SPECIFICATIONS

### **Format:**

**Preferred:** React Three Fiber (R3F) component
- Allows full control over materials, lighting, animation
- Integrates seamlessly with React
- Performance optimized for web

**Alternative:** Animated SVG or Lottie
- If 3D is too heavy for landing page performance
- Must maintain depth illusion (isometric view)

**Fallback:** Static SVG with CSS animation
- For browsers that don't support WebGL
- Simple rotation only

---

### **Performance:**

**File Size:**
- Target: < 100KB total (model + textures)
- Maximum: < 200KB

**Frame Rate:**
- Target: 60 FPS on desktop
- Minimum: 30 FPS on mobile

**Loading:**
- Lazy load (below fold, load on scroll)
- Show placeholder (simple wireframe) while loading
- Graceful degradation if WebGL unavailable

---

### **Dimensions:**

**Desktop:**
- Width: 400-600px
- Height: 400-600px
- Aspect ratio: 1:1 (square container)

**Mobile:**
- Width: 280-320px
- Height: 280-320px
- Scales proportionally

**Placement:**
- Landing page hero section (right side)
- Centered vertically with hero text
- Responsive: moves below text on mobile

---

## 🛠️ IMPLEMENTATION OPTIONS

### **Option 1: React Three Fiber (Recommended)**

**Pros:**
- Full 3D control
- Best visual quality
- Interactive potential
- Aligns with modern tech stack

**Cons:**
- Larger bundle size
- Requires WebGL support
- More complex implementation

**Libraries:**
```bash
npm install three @react-three/fiber @react-three/drei
```

**Example Structure:**
```tsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'

export function PsilocybinMolecule() {
  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      
      {/* Atoms */}
      <Atom position={[0, 0, 0]} element="carbon" />
      <Atom position={[1.5, 0, 0]} element="nitrogen" />
      {/* ... more atoms ... */}
      
      {/* Bonds */}
      <Bond start={[0, 0, 0]} end={[1.5, 0, 0]} />
      {/* ... more bonds ... */}
      
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
  )
}
```

---

### **Option 2: Spline (No-Code 3D)**

**Pros:**
- Visual editor (no coding 3D models)
- Export to React component
- High-quality renders
- Fast iteration

**Cons:**
- Proprietary format
- Less control over optimization
- Requires Spline account

**Process:**
1. Create molecule in Spline (https://spline.design)
2. Export as React component
3. Integrate into landing page
4. Optimize file size

---

### **Option 3: Blender + glTF Export**

**Pros:**
- Industry-standard 3D tool
- Full control over model
- Optimized glTF format
- Can use existing molecule models

**Cons:**
- Requires Blender knowledge
- Manual export process
- Needs glTF loader in React

**Process:**
1. Model psilocybin in Blender (or import from PubChem)
2. Apply materials (glass, glow)
3. Export as glTF (.glb)
4. Load in React Three Fiber with `useGLTF`

---

## 🎨 DESIGN INSPIRATION

### **Reference Examples:**

**Scientific Visualization:**
- PubChem 3D viewer (accurate structure)
- Protein Data Bank visualizations (material quality)
- Molecular dynamics simulations (animation style)

**Premium 3D Web:**
- Apple product pages (glass materials)
- Stripe homepage (subtle animations)
- Linear app (modern, clean 3D)

**Color/Lighting:**
- Our existing glassmorphic design system
- Indigo/cyan color scheme (brand colors)
- Subtle glow (not neon/psychedelic)

---

## ✅ ACCEPTANCE CRITERIA

### **Visual Quality:**
- [ ] Scientifically accurate molecular structure (verified against PubChem)
- [ ] Premium glass/crystal material (not flat/cartoon)
- [ ] Subtle glow effect (indigo/cyan spectrum)
- [ ] Smooth animation (no jank, 60 FPS target)

### **Technical Quality:**
- [ ] File size < 200KB
- [ ] Loads in < 2 seconds on 3G
- [ ] Works on mobile (responsive, performant)
- [ ] Graceful degradation (fallback for no WebGL)

### **Brand Alignment:**
- [ ] Matches glassmorphic design system
- [ ] Uses brand colors (indigo, cyan, slate)
- [ ] Reinforces "evidence-based" positioning (not trippy)
- [ ] Feels premium (not stock/generic)

### **Integration:**
- [ ] React component (easy to import)
- [ ] Lazy loaded (doesn't block page load)
- [ ] Accessible (alt text, reduced motion support)
- [ ] Documented (props, usage examples)

---

## 📋 DELIVERABLES

### **Required:**
1. **3D Molecule Component** (`PsilocybinMolecule.tsx`)
   - React component (R3F or alternative)
   - Fully animated
   - Responsive

2. **Integration Code** (update `Landing.tsx`)
   - Import and place molecule
   - Lazy loading setup
   - Fallback handling

3. **Documentation** (`MOLECULE_COMPONENT_DOCS.md`)
   - How to use component
   - Props/configuration options
   - Performance notes

### **Optional (Nice to Have):**
4. **Interactive Features**
   - Hover to pause rotation
   - Click to highlight atom groups
   - Labels for key structural features

5. **Alternative Molecules**
   - Psilocin (dephosphorylated version)
   - MDMA, Ketamine, LSD (for substance pages)
   - Reusable `Molecule` component with props

---

## 🚀 IMPLEMENTATION PLAN

### **Phase 1: Research & Design (30 min)**
- [ ] Review PubChem 3D structure
- [ ] Sketch molecule layout (atom positions)
- [ ] Choose color palette (from brand colors)
- [ ] Select implementation approach (R3F vs Spline vs Blender)

### **Phase 2: Build (1-2 hours)**
- [ ] Create 3D model (atoms + bonds)
- [ ] Apply materials (glass, glow)
- [ ] Add animation (rotation, optional floating)
- [ ] Optimize file size

### **Phase 3: Integration (30 min)**
- [ ] Create React component
- [ ] Add to landing page
- [ ] Test performance (desktop + mobile)
- [ ] Add fallback for no WebGL

### **Phase 4: Polish (30 min)**
- [ ] Fine-tune colors/lighting
- [ ] Adjust animation speed
- [ ] Test accessibility (reduced motion)
- [ ] Document usage

---

## 🎯 STRATEGIC CONTEXT

### **Why This Matters:**

**From VoC Research:**
- Dr. Jason Allen emphasizes "evidence-based" positioning
- Scientific accuracy builds credibility
- Premium visuals signal quality

**Brand Positioning:**
- We're clinical intelligence, not psychedelic hype
- 3D molecule reinforces scientific rigor
- Glass aesthetic aligns with design system

**Competitive Differentiation:**
- Osmind: Generic medical UI (no visual identity)
- PPN: Premium, science-forward, modern

---

## 📊 SUCCESS METRICS

### **Qualitative:**
- [ ] USER approves visual quality
- [ ] Practitioners say "this looks professional"
- [ ] No confusion about what molecule it is

### **Quantitative:**
- [ ] Landing page load time < 3 seconds
- [ ] Molecule renders at 60 FPS on desktop
- [ ] Molecule renders at 30+ FPS on mobile
- [ ] File size < 200KB

---

## 🔗 RESOURCES

### **Molecular Data:**
- PubChem: https://pubchem.ncbi.nlm.nih.gov/compound/Psilocybin
- ChemSpider: https://www.chemspider.com/Chemical-Structure.10182.html
- Wikipedia (structure diagram): https://en.wikipedia.org/wiki/Psilocybin

### **Tools:**
- React Three Fiber: https://docs.pmnd.rs/react-three-fiber
- Spline: https://spline.design
- Blender: https://www.blender.org

### **Inspiration:**
- Apple product pages (glass materials)
- Stripe homepage (subtle 3D)
- Linear app (modern 3D web)

---

**Status:** 🟡 ASSIGNED - Awaiting DESIGNER acknowledgment  
**Priority:** 🔴 HIGH - Landing page is first impression  
**Next:** DESIGNER confirms approach and timeline 🎨
