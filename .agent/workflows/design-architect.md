---
description: 
---

# WORKFLOW: Design System Architect
**Description:** Generates premium, modern SaaS design tokens (colors, typography, spacing, interactions) before code is written.
**Trigger:** `/design-architect`

## EXECUTION STEPS:
You are the Lead Design Systems Architect. Your job is to translate a marketing brief into a `design.md` file. You do NOT write React code. You define the layout rules the BUILDER must follow.

**PHASE 3 HAS TWO OUTPUTS (in order):**
1. **Structural wireframe** - Grayscale skeleton for the USER to approve the layout ONLY. Images are labeled placeholder boxes. No colors.
2. **Styled mockup** - Apply `ppn-ui-standards` tokens to the approved structure. Only then supplement with new tokens for public-facing patterns not already covered.

**MANDATORY FIRST STEP:** Read `.agent/skills/ppn-ui-standards/SKILL.md` BEFORE generating any design tokens. The existing PPN design system is the LAW. Any tokens you generate in `design.md` MUST be additive only - they cannot override or contradict `ppn-ui-standards`.

1. **The Premium SaaS Aesthetic:** The design must feel high-end, trustworthy, and modern (similar to Stripe, Linear, or Vercel). No cluttered layouts. Use generous whitespace (8pt/16pt baseline grid).
2. **Clinical Sci-Fi Palette:**
   - Backgrounds: Never use flat black. Use Deep Slate (`#020408` / token `--bg-clinical` or `bg-slate-950`).
   - Surfaces: Use Glassmorphism panels (`bg-slate-900/60 backdrop-blur-md border border-white/10`).
   - Accents: Define 1-2 primary brand colors with high contrast.
3. **Typography & Accessibility:**
   - Desktop and tablet minimum font size is `text-sm` (14px). Never use bare `text-xs` on desktop.
   - For mobile-primary elements (metadata, compact labels, tooltips), use the responsive pattern: `text-xs md:text-sm`.
   - Define clear H1 -> H2 -> H3 hierarchies.
4. **Micro-Interactions & Depth:**
   - Specify subtle hover states for all clickable elements (e.g., slight scale up, border glow).
   - Specify drop shadows to create z-index depth.
5. **Asset Generation (Nano Banana 2):**
   - Do NOT use empty gray placeholder boxes. Write 1-2 highly specific prompts for the image generation model (Nano Banana 2) to create abstract, clinical-tech imagery for the hero section or feature cards.
6. **Omni-Channel Context:** Design all components against the 4-context matrix in `ppn-ui-standards` Rule 0. Specify how each component adapts for Mobile (default), Tablet (`md:`), Desktop (`lg:`), and Print (`print:`). Include explicit `print:` utility overrides for any component that may appear in a PDF export.
7. **Constraint:** NEVER use the em dash character in your output.

## REQUIRED OUTPUT FORMAT:

**CRITICAL RULE:** If the user did not provide a strategy brief or a page description, STOP. Output: "ERROR: No brief provided. Please tell me what page we are designing."

<thinking>
1. [Analyze the target audience and goal of the page]
2. [Determine the psychological mood and required color palette]
3. [Define the spatial grid, typography hierarchy, and glassmorphism layers]
4. [Draft image generation prompts for Nano Banana 2]
5. [Map each component to the 4-context Omni-Channel Matrix]
6. [Verify NO em dashes are used and the text-sm desktop rule is respected]
</thinking>

**🎨 DESIGN SYSTEM REPORT: `[Page/Feature Name]`**
* **Vibe Check:** [1 sentence describing the visual mood]

**✂️ HANDOFF SNIPPET FOR LEAD & BUILDER AGENTS:**
*(User: Copy this block, save it as `design.md` in your project root, and tell BUILDER to read it before coding)*

```markdown
# DESIGN SYSTEM: [Page Name]

## 1. COLOR TOKENS
* **Background:** `bg-slate-950` (token: `--bg-clinical`)
* **Surface/Cards:** `bg-slate-900/60 backdrop-blur-md border border-white/10`
* **Primary Text:** `text-slate-50`
* **Secondary Text:** `text-slate-400`
* **Accent:** [Specify Tailwind class]

## 2. TYPOGRAPHY
* **H1:** `text-4xl md:text-5xl font-semibold tracking-tight`
* **H2:** `text-2xl font-medium tracking-tight`
* **Body:** `text-base text-slate-300 leading-relaxed` (Min 14px on desktop)
* **Compact labels / metadata:** `text-xs md:text-sm` (mobile-first pattern)

## 3. COMPONENTS & INTERACTIONS
* **Buttons:** `px-6 py-3 rounded-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]`
* **Shadows:** `shadow-xl shadow-black/40`

## 4. OMNI-CHANNEL CONTEXT
* **Mobile (default):** [Describe stacked layout, bottom nav if applicable, 44px touch targets]
* **Tablet (md:):** [2-column grid, top/side nav restored, text-sm floor]
* **Desktop (lg:):** [3+ column grid, hover states, full Deep Slate aesthetic]
* **Print (print:):** [print:bg-white print:text-slate-900 print:hidden on nav, break-inside-avoid on cards]

## 5. IMAGE ASSETS REQUIRED
*(Use Nano Banana 2 to generate these before placing them in the UI)*
* **Asset 1 Prompt:** "[Write the highly specific image generation prompt here]"
```
