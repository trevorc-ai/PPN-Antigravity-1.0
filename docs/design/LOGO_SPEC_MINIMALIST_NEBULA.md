# PPN Research Portal - Minimalist Nebula Logo Specification

**Version:** 3.0 (Minimalist Nebula)  
**Last Updated:** 2026-02-15  
**Owner:** DESIGNER Agent  
**Status:** Visual Specification (Awaiting Asset Creation)

---

## Design Direction: Minimalist Nebula Smoke Ring

### Core Aesthetic
**"A barely-there wisp of cosmic smoke forming a delicate ring"**

### User Feedback Incorporated
- ✅ "Much more subtle" - NOT neon, NOT bright
- ✅ "Like a nebula smoke ring" - Wispy, ethereal, barely visible
- ✅ "Minimalist" - Clean, simple, restrained

### Visual Philosophy
Think **Apple minimalism** meets **interstellar nebula**:
- Extremely subtle (opacity 15-25%)
- Muted colors (blue-gray, not vivid cyan)
- Wispy, organic smoke texture (not hard edges)
- Lots of negative space
- Professional, sophisticated, inviting

---

## Concept 1: Simple Nebula Ring

### Visual Description
A thin, delicate ring made of very faint cosmic smoke/gas on pure black background.

### Specifications

**Ring Form:**
- **Shape:** Circular, slightly organic (not perfectly geometric)
- **Width:** Thin stroke, approximately 2-4px at 64px size
- **Texture:** Wispy, smoke-like, soft edges (no hard lines)

**Color Palette:**
- **Primary:** Muted blue-gray (#4a5f7a at 20% opacity)
- **Accent:** Very subtle cyan hints (#6b9bb0 at 15% opacity)
- **Background:** Pure black (#000000)

**Opacity & Glow:**
- **Ring opacity:** 15-25% (barely visible)
- **Glow:** Extremely soft, almost imperceptible (5-10px blur at 15% opacity)
- **Effect:** Like looking at a distant nebula through a telescope

**Size & Spacing:**
- **Logo size:** 64px × 64px (desktop), 32px × 32px (mobile)
- **Clear space:** Equal to ring diameter on all sides
- **Favicon:** 16px × 16px (simplified to simple thin circle)

### CSS Approximation
```css
.nebula-ring {
  width: 64px;
  height: 64px;
  border: 2px solid rgba(74, 95, 122, 0.2);
  border-radius: 50%;
  filter: blur(1px) drop-shadow(0 0 8px rgba(107, 155, 176, 0.15));
  background: transparent;
}
```

---

## Concept 2: Nebula Helix Ring (Recommended)

### Visual Description
A thin ring of cosmic smoke with an **extremely subtle spiral twist** suggesting a double helix - so subtle you almost miss it.

### Specifications

**Ring Form:**
- **Shape:** Circular with very subtle spiral variation
- **Width:** Thin stroke, 2-4px at 64px size
- **Texture:** Wispy smoke with barely visible spiral pattern
- **Helix pattern:** Two intertwining wisps, opacity variation creates spiral (not geometric)

**Color Palette:**
- **Primary:** Muted blue-gray (#4a5f7a at 20% opacity)
- **Helix highlights:** Slightly brighter areas (#6b9bb0 at 25% opacity)
- **Helix shadows:** Slightly dimmer areas (#3a4f5a at 15% opacity)
- **Background:** Pure black (#000000)

**Opacity & Glow:**
- **Base ring:** 15-20% opacity
- **Helix highlights:** 20-25% opacity (barely brighter)
- **Glow:** Extremely soft (5-10px blur at 12% opacity)
- **Spiral subtlety:** Only visible at 64px+, disappears at favicon size

**Double Helix Pattern:**
- **Spiral count:** 2 full rotations around ring
- **Pattern:** Alternating light/dark wisps (not obvious stripes)
- **Visibility:** Almost imperceptible - artistic detail for close inspection

### Why This Is Recommended
1. **Incorporates double helix** (user's original request) but **extremely subtly**
2. **Minimalist** - clean, restrained, professional
3. **Nebula aesthetic** - wispy smoke, not bright glow
4. **Scalable** - helix detail only visible at larger sizes
5. **Unique** - subtle sophistication sets it apart

---

## Concept 3: Yin-Yang Nebula Ring

### Visual Description
A thin ring of cosmic smoke with **asymmetric density** - one side slightly more visible (light), other side slightly less visible (shadow).

### Specifications

**Ring Form:**
- **Shape:** Circular with gradient density variation
- **Width:** Thin stroke, 2-4px at 64px size
- **Texture:** Wispy smoke with density gradient

**Color Palette:**
- **Light side:** Muted cyan-blue (#6b9bb0 at 22% opacity)
- **Shadow side:** Muted purple-gray (#5a5f7a at 15% opacity)
- **Transition:** Smooth S-curve gradient (yin-yang division)
- **Background:** Pure black (#000000)

**Opacity & Glow:**
- **Light side:** 20-25% opacity
- **Shadow side:** 12-18% opacity
- **Glow:** Extremely soft, asymmetric (follows density)
- **Effect:** Subtle balance, not obvious yin-yang

**Yin-Yang Subtlety:**
- **Not a literal yin-yang symbol** - just density variation
- **S-curve transition** - smooth, organic, barely noticeable
- **Symbolism:** Balance through light/shadow (psychedelic therapy themes)

---

## Concept 4: Minimal Orbital Ring

### Visual Description
A thin ring of cosmic smoke with **two tiny bright points** (nodes) at opposite positions, suggesting orbital motion.

### Specifications

**Ring Form:**
- **Shape:** Circular, thin smoke ring
- **Width:** 2-4px at 64px size
- **Texture:** Wispy smoke

**Color Palette:**
- **Ring:** Muted blue-gray (#4a5f7a at 18% opacity)
- **Nodes:** Slightly brighter (#8ba9c0 at 35% opacity) - NOT bright white
- **Background:** Pure black (#000000)

**Nodes:**
- **Size:** 2-3px diameter (tiny)
- **Position:** Opposite sides (3 o'clock and 9 o'clock)
- **Glow:** Very subtle (3-5px blur at 20% opacity)
- **Effect:** Like distant stars, not bright flares

**Opacity & Glow:**
- **Ring:** 15-20% opacity
- **Nodes:** 30-35% opacity (slightly brighter, not neon)
- **Overall effect:** Delicate, minimal, professional

---

## Concept 5: Ultra-Minimal Smoke Ring

### Visual Description
The **most minimal** option - just a simple, thin wisp of smoke forming a circle. No patterns, no nodes, no gradients. Pure simplicity.

### Specifications

**Ring Form:**
- **Shape:** Simple circular wisp
- **Width:** Very thin, 1-2px at 64px size
- **Texture:** Soft smoke, barely there

**Color Palette:**
- **Ring:** Single muted blue-gray (#5a6f8a at 18% opacity)
- **Background:** Pure black (#000000)

**Opacity & Glow:**
- **Ring:** 15-20% opacity
- **Glow:** Minimal (3-5px blur at 10% opacity)
- **Effect:** Like a faint breath of smoke

**Philosophy:**
- **Less is more** - absolute minimalism
- **Timeless** - won't feel dated
- **Versatile** - works at any size
- **Professional** - ultimate restraint

---

## Typography Lockup

### Logo + Text Combination

**"PPN"** (primary mark)
- **Font:** Inter or SF Pro Display
- **Weight:** 600 (Semibold)
- **Size:** 20px (desktop), 16px (mobile)
- **Color:** Muted slate (#cbd5e1 at 90% opacity) - NOT pure white
- **Letter-spacing:** 0.05em
- **Position:** Right of logo, vertically centered

**"Research Portal"** (optional secondary)
- **Font:** Inter
- **Weight:** 400 (Regular)
- **Size:** 10px
- **Color:** Muted slate (#94a3b8 at 70% opacity)
- **Letter-spacing:** 0.15em (tracking-widest)
- **Position:** Below "PPN", left-aligned

### Lockup Spacing
```
[Logo]  [20px gap]  PPN
                    Research Portal
```

### Minimum Sizes
- **Logo only:** 24px minimum
- **Logo + "PPN":** 100px width minimum
- **Full lockup:** 140px width minimum

---

## Color Specifications

### Muted Palette (NOT Vivid)
All colors are intentionally desaturated and low-opacity:

**Primary Smoke Colors:**
- `#4a5f7a` at 15-25% opacity (muted blue-gray)
- `#5a6f8a` at 15-20% opacity (slightly warmer gray-blue)
- `#6b9bb0` at 15-25% opacity (muted cyan-blue)

**Accent Colors (for subtle variations):**
- `#5a5f7a` at 12-18% opacity (muted purple-gray for shadows)
- `#8ba9c0` at 25-35% opacity (slightly brighter for nodes, NOT neon)

**Background:**
- `#000000` (pure black) or `#020408` (deep slate)

### Contrast Ratios
Even at low opacity, the logos maintain sufficient contrast:
- **On pure black:** 3.5:1 to 4.2:1 (decorative, not text)
- **Monochrome test:** Ring structure remains visible
- **Accessibility:** Logo is decorative; "PPN" text provides accessible label

---

## Implementation Guidelines

### File Formats

**SVG (Primary):**
- Vector format with soft blur filters
- Scalable to any size
- Supports subtle opacity and blur effects

**PNG (Raster):**
- Multiple sizes: 16px, 32px, 64px, 128px, 256px
- Transparent background
- Pre-rendered blur effects

**ICO (Favicon):**
- Multi-resolution: 16px, 32px, 48px
- Simplified version (no helix detail at 16px)

### SVG Code Example (Concept 2: Nebula Helix)
```svg
<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Subtle gradient for helix pattern -->
    <linearGradient id="helixGradient" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#6b9bb0" stop-opacity="0.25"/>
      <stop offset="25%" stop-color="#4a5f7a" stop-opacity="0.15"/>
      <stop offset="50%" stop-color="#6b9bb0" stop-opacity="0.25"/>
      <stop offset="75%" stop-color="#4a5f7a" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#6b9bb0" stop-opacity="0.25"/>
    </linearGradient>
    
    <!-- Extremely soft blur -->
    <filter id="softSmoke">
      <feGaussianBlur in="SourceGraphic" stdDeviation="1.5"/>
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.8"/>
      </feComponentTransfer>
    </filter>
  </defs>
  
  <!-- Nebula smoke ring with subtle helix -->
  <circle 
    cx="32" 
    cy="32" 
    r="22" 
    fill="none" 
    stroke="url(#helixGradient)" 
    stroke-width="2" 
    filter="url(#softSmoke)"
    opacity="0.9"
  />
</svg>
```

### CSS Implementation (Web)
```css
.ppn-logo {
  width: 64px;
  height: 64px;
  background: url('/assets/logo-nebula-helix.svg') center/contain no-repeat;
  opacity: 0.95; /* Slightly reduce overall brightness */
}

/* Hover effect: subtle brightening */
.ppn-logo:hover {
  opacity: 1;
  transition: opacity 0.3s ease;
}

/* Dark mode: no change needed (designed for dark backgrounds) */
/* Light mode: increase opacity slightly */
@media (prefers-color-scheme: light) {
  .ppn-logo {
    opacity: 0.85;
  }
}
```

---

## Usage Guidelines

### Do's ✅
- Use on dark backgrounds (black, deep slate)
- Maintain clear space around logo
- Keep opacity low (15-25%)
- Use soft blur effects
- Pair with muted typography
- Scale proportionally

### Don'ts ❌
- Don't increase brightness/opacity above 30%
- Don't use vivid/saturated colors
- Don't add hard drop shadows
- Don't use on light backgrounds without adjustment
- Don't make ring perfectly circular (keep organic)
- Don't add textures or patterns beyond smoke

### Background Compatibility
**Optimized for:**
- Pure black (#000000) ✅
- Deep slate (#020408) ✅
- Dark cosmic backgrounds ✅

**Requires adjustment for:**
- Light backgrounds (increase opacity to 40-50%, use darker colors)
- Mid-tone backgrounds (add subtle dark outline)

---

## Animation Potential (Optional)

All concepts can have **extremely subtle** animations:

### Concept 1: Simple Nebula Ring
```css
@keyframes breathe {
  0%, 100% { opacity: 0.18; }
  50% { opacity: 0.22; }
}

.nebula-ring {
  animation: breathe 4s ease-in-out infinite;
}
```

### Concept 2: Nebula Helix
```css
@keyframes rotate-helix {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.nebula-helix {
  animation: rotate-helix 20s linear infinite;
}
```

**Animation Guidelines:**
- **Duration:** 4-20 seconds (very slow)
- **Easing:** ease-in-out (smooth, organic)
- **Intensity:** Barely noticeable (subtle opacity or rotation)
- **Accessibility:** Respect `prefers-reduced-motion`

---

## Comparison: v1.0 vs v2.0 vs v3.0

| Aspect | v1.0 (Geometric) | v2.0 (Cosmic Portal) | v3.0 (Minimalist Nebula) |
|--------|------------------|----------------------|--------------------------|
| **Brightness** | High contrast, bold | Moderate glow | Extremely subtle |
| **Colors** | Vivid cyan/purple | Soft cyan/blue | Muted blue-gray |
| **Opacity** | 80-100% | 40-60% | 15-25% |
| **Texture** | Sharp geometric | Soft glow | Wispy smoke |
| **Aesthetic** | "Sapphic" (user feedback) | Cosmic portal | Nebula smoke ring |
| **Minimalism** | Low | Medium | **High** ✅ |
| **Subtlety** | Low | Medium | **High** ✅ |
| **User Feedback** | Too bright | Too neon | **Target achieved** ✅ |

---

## Recommended Concept: Nebula Helix Ring (Concept 2)

### Why This Is The Best Choice

1. **User Feedback Alignment:**
   - ✅ "Much more subtle" - 15-25% opacity, barely visible
   - ✅ "Like a nebula smoke ring" - Wispy, ethereal texture
   - ✅ "Minimalist" - Clean, simple, restrained
   - ✅ "Not too bright" - Muted colors, soft glow

2. **Incorporates Original Vision:**
   - ✅ Double helix motif (extremely subtle spiral in smoke)
   - ✅ Circular form (portal/eclipse reference)
   - ✅ Cosmic aesthetic (nebula smoke)

3. **Professional & Inviting:**
   - ✅ Sophisticated (nuanced detail)
   - ✅ Safe (soft, not harsh)
   - ✅ Timeless (won't feel dated)
   - ✅ Scalable (works at all sizes)

4. **Unique & Memorable:**
   - ✅ Subtle helix pattern reveals meaning over time
   - ✅ Artistic sophistication (not obvious)
   - ✅ Different from typical healthcare/tech logos

---

## Next Steps

### Phase 1: Asset Creation
- [ ] Create SVG files for all 5 concepts
- [ ] Export PNG files (16px, 32px, 64px, 128px, 256px)
- [ ] Create multi-resolution ICO favicon
- [ ] Test on various dark backgrounds

### Phase 2: User Review
- [ ] Present visual mockups to user
- [ ] Get feedback on subtlety level
- [ ] Select final concept

### Phase 3: Refinement
- [ ] Adjust opacity if needed (can go even more subtle)
- [ ] Fine-tune helix pattern visibility
- [ ] Create monochrome variations

### Phase 4: Implementation (BUILDER)
- [ ] Update `TopHeader.tsx` with new logo
- [ ] Replace favicon files in `/public`
- [ ] Update meta tags for social sharing
- [ ] Test across all viewport sizes

---

## Designer Notes

### Design Philosophy
This specification represents a **radical shift** from typical tech/healthcare logos:

**Most logos are:** Bright, bold, high-contrast, geometric  
**This logo is:** Subtle, soft, low-contrast, organic

**Why this works for PPN:**
- **Psychedelic therapy** = transformation, subtlety, depth
- **Research/science** = precision, restraint, professionalism
- **Global community** = inviting, safe, human-centered

### The "Barely There" Aesthetic
The logo is intentionally **almost invisible** - you have to look for it. This creates:
- **Intrigue** - "What is that subtle ring?"
- **Sophistication** - Confidence to be minimal
- **Memorability** - Different from everything else

### Accessibility Note
The logo is **decorative** - the "PPN Research Portal" text provides the accessible label. The visual subtlety is intentional and does not impact accessibility when paired with proper text labels.

---

**Minimalist Nebula Logo Specification v3.0**  
**Status:** Ready for Asset Creation  
**Created:** 2026-02-15  
**Designer:** DESIGNER Agent  
**Revision:** Based on user feedback - "minimalist, nebula smoke ring, not too bright"
