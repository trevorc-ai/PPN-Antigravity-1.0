---
status: "03_BUILD"
owner: "BUILDER"
failure_count: 0
---

# WO-318: Help Center Shell

## User Prompt & Strategy Motivation
Now that core forms are wired up and nearly complete, the user requested an update on the user manuals and help guides. The user has prepared screenshots to drop in. PRODDY recommended creating a robust Help Center shell first to accept those assets cleanly.

## LEAD ARCHITECTURE
**Objective:** Construct a fully operational placeholder Help Center / User Manual layout, integrating navigation, sidebar, and placeholder image spots.

1. **Routing and Page Setup:** Ensure a dedicated route (like `/help` or `/docs`) exists and routes correctly. 
2. **Help Center Layout Component:** Build a `HelpCenterLayout.tsx` that includes a left-hand navigation specific to the documentation sections (e.g., Getting Started, Wellness Journey, Interaction Checker, Integrations, Billing).
3. **MDX/Markdown Support or React Views:** Depending on complexity, either implement a simple React-based routing tree with placeholder text/cards, or load markdown files from a raw fetch. For speed and direct integration, React components per section might be safer and prettier. 
4. **Placeholder Image Blocks:** Incorporate generously proportioned, styled image skeleton boxes. The styling should include subtle depth, rounded corners, and a caption underneath. Wait until the user provides the PNGs before placing permanent tags.

**Instructions for BUILDER:**
- Build the `HelpCenterLayout.tsx` shell.
- Mock up the first 3 sub-pages (e.g., Guide: Interaction Checker).
- Introduce a visual search bar mock at the top.
- Make it accessible and fluidly responsive.
- **Image Styling Note:** All `<img>` tags or wrappers containing the user's screenshots must automatically apply `rounded-xl` (or similar) and a subtle drop shadow (`shadow-lg border border-slate-700/50`) via Tailwind. Do NOT rely on the source images to have rounded corners.

**Owner: BUILDER | Status: 03_BUILD**
