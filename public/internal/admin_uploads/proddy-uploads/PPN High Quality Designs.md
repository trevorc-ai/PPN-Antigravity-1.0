# **PPN High Quality Designs**

I know exactly what you are experiencing. You ask the AI for a landing page, and it spits out something that looks like a generic Bootstrap template from 2015—functional, but completely devoid of soul, brand identity, or modern design aesthetics.

This happens because an LLM's baseline training prioritizes "safe and error-free" code over "beautiful and high-converting" design. If you just ask it to "build a landing page," it will take the path of least resistance.

To get professional, modern, SaaS-level outputs (think Stripe, Vercel, or Linear aesthetics), we have to stop treating the AI like a web developer and start treating it like a **Design System Architect**.

Here is the three-step playbook currently dominating the Antigravity community for generating top-tier frontends.

## **1\. The "Google Stitch" Architecture (Design Before Code)**

The biggest mistake is letting the AI write React or HTML immediately. The modern meta in Antigravity is to use a "Stitch-style" workflow, which separates design from development.

Before the AI writes a single line of page code, you must force it to generate a design.md file.

* **What it is:** A Markdown file that acts as your single source of truth for design tokens. It explicitly defines your exact color hex codes, typography scale, spacing rules, and component states (hover, active, disabled).  
* **How to use it:** When you summon your workflow, say: *"Before building the landing page, generate a design.md file defining a modern, clinical design system. Once I approve the tokens, build the page strictly using those rules."*

## **2\. Injecting "Taste" into Your Workflows**

AI agents lack taste. You have to inject it into their .md workflow files. You need to update your Marketing and UI workflows with explicit, modern aesthetic constraints.

Open your workflows and add these exact phrases to their instructions:

* **The Aesthetic Anchor:** *"Target a modern, premium SaaS aesthetic (e.g., Linear, Vercel, or Stripe). The design must feel clean, uncluttered, and highly trustworthy."*  
* **The Micro-Interaction Rule:** *"Incorporate subtle Framer Motion or CSS transitions on all interactive elements. Buttons must have distinct hover and active states."*  
* **The Depth Rule:** *"Avoid flat, anemic layouts. Use subtle drop shadows (shadow-sm to shadow-md), glassmorphism (backdrop-blur) where appropriate, and strict visual hierarchy to guide the user's eye."*  
* **The Spacing Mandate:** *"Use generous whitespace. Elements should never feel cramped. Adhere strictly to a 4pt/8pt baseline grid."*

## **3\. Leverage Nano Banana 2 for Assets**

A massive reason AI landing pages look weak is that they use empty gray placeholder boxes for images.

Because you are using the Paid tier of Antigravity, your agents have direct access to Google's **Nano Banana 2** (Gemini 3 Flash Image) model.

* **The Fix:** In your workflow instructions, tell the agent: *"Do not use empty placeholders. Use your image generation tool to create high-quality, abstract, clinical-tech placeholder images for the hero section and feature cards."* *(Note: If you love an image it generates, you can click the three-dot menu and select "Redo with Pro" to upgrade it to the highest possible fidelity).*

---

## **The "Pro-Tier" Handoff Execution**

To guarantee a professional result for your new "Front Doors", run your assembly line like this in the Playground:

1. **The Strategist:** *"@marketing-strategist, define the core messaging and audience pain points for our new Clinic Owner landing page."*  
2. **The Designer (The Missing Link):** *"@FLO-ui-ux-audit, read the strategist's brief. Generate a design.md file with Tailwind design tokens tailored to this specific audience, adhering to our Clinical Sci-Fi aesthetic."*  
3. **The Execution:** *"@BUILDER, read the design.md tokens and the strategist brief. Build the React landing page. Use Nano Banana 2 to generate a hero image representing 'clinical data clarity'."*

By forcing the AI to define the *rules* of the design before it writes the *code* of the design, you eliminate the generic, anemic output entirely.

Would you like me to draft a dedicated @design-architect.md workflow file that is purpose-built to generate these high-end design.md design systems for you?

Here is the exact workflow file to build your high-end design systems.

By running this before anyone writes code, you force the AI to establish a "source of truth" for taste, spacing, and aesthetics. This guarantees your landing pages and public portals will look like a premium SaaS product, not a cheap template.

Create this file in your .agent/workflows/ folder.

## **🎨 The Design System Architect**

**File Name:** design-architect.md

**Location:** .agent/workflows/design-architect.md

Markdown

````
# WORKFLOW: Design System Architect
**Description:** Generates premium, modern SaaS design tokens (colors, typography, spacing, interactions) before code is written.
**Trigger:** `/design-architect`

## EXECUTION STEPS:
You are the Lead Design Systems Architect. Your job is to translate a marketing brief or feature idea into a strict `design.md` file. You do NOT write React code. You define the aesthetic rules that the BUILDER agent must follow.

1. **The Premium SaaS Aesthetic:** The design must feel high-end, trustworthy, and modern (similar to Stripe, Linear, or Vercel). No cluttered layouts. Use generous whitespace (8pt/16pt baseline grid).
2. **Clinical Sci-Fi Palette:**
   - Backgrounds: Never use flat black. Use Deep Slate (`#020408` or `bg-slate-950`).
   - Surfaces: Use Glassmorphism panels (`bg-slate-900/60 backdrop-blur-md border border-white/10`).
   - Accents: Define 1-2 primary brand colors with high contrast.
3. **Typography & Accessibility:**
   - Minimum font size is 14px (`text-sm`). NEVER specify `text-xs`.
   - Define clear H1 -> H2 -> H3 hierarchies. 
4. **Micro-Interactions & Depth:**
   - Specify subtle hover states for all clickable elements (e.g., slight scale up, border glow).
   - Specify drop shadows to create z-index depth.
5. **Asset Generation (Nano Banana 2):**
   - Do NOT use empty gray placeholder boxes. Write 1-2 highly specific prompts for the image generation model (Nano Banana 2) to create abstract, clinical-tech imagery for the hero section or feature cards.
6. **Constraint:** NEVER use the em dash character in your output.

## REQUIRED OUTPUT FORMAT:

**CRITICAL RULE:** If the user did not provide a strategy brief or a page description, 🛑 STOP. Output: "ERROR: No brief provided. Please tell me what page we are designing."

<thinking>
1. [Analyze the target audience and goal of the page]
2. [Determine the psychological mood and required color palette]
3. [Define the spatial grid, typography hierarchy, and glassmorphism layers]
4. [Draft image generation prompts for Nano Banana 2]
5. [Verify NO em dashes are used and the 14px rule is respected]
</thinking>

**🎨 DESIGN SYSTEM REPORT: `[Page/Feature Name]`**
* **Vibe Check:** [1 sentence describing the visual mood]

**✂️ HANDOFF SNIPPET FOR LEAD & BUILDER AGENTS:**
*(User: Copy this block, save it as `design.md` in your project root, and tell BUILDER to read it before coding)*

```markdown
# DESIGN SYSTEM: [Page Name]

## 1. COLOR TOKENS
* **Background:** `bg-slate-950`
* **Surface/Cards:** `bg-slate-900/60 backdrop-blur-md border border-white/10`
* **Primary Text:** `text-slate-50`
* **Secondary Text:** `text-slate-400`
* **Accent:** [Specify Tailwind class]

## 2. TYPOGRAPHY
* **H1:** `text-4xl md:text-5xl font-semibold tracking-tight`
* **H2:** `text-2xl font-medium tracking-tight`
* **Body:** `text-base text-slate-300 leading-relaxed` (Min 14px enforced)

## 3. COMPONENTS & INTERACTIONS
* **Buttons:** `px-6 py-3 rounded-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]`
* **Shadows:** `shadow-xl shadow-black/40`

## 4. IMAGE ASSETS REQUIRED
*(Use Nano Banana 2 to generate these before placing them in the UI)*
* **Asset 1 Prompt:** "[Write the highly specific image generation prompt here]"
````

\==== DESIGN ARCHITECT \====

```

---

### How to use this immediately for your new "Front Door":

1. **Open the Playground** in Antigravity.
2. **Feed it the brief:** Type, *"Please run `/design-architect` based on this goal: We need a public landing page targeting Clinic Owners to join our Beta. It needs to feel highly secure, professional, and invite-only."*
3. **Extract:** Take the Markdown block it generates and save it as a file named `design.md` in your project.
4. **Execute:** Go to your main chat and tell `@LEAD` and `@BUILDER`: *"Read `design.md` and build the new Clinic Owner landing page exactly to those specs. Use Nano Banana 2 to generate the hero image requested in the design file."*

Would you like to run a live test of this prompt right now to see what kind of color palette and image prompts it generates for your Clinic Owner landing page?
```

