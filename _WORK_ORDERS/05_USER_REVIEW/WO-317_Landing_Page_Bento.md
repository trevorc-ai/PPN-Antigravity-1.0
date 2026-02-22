---
status: "02_DESIGN"
owner: "DESIGNER"
failure_count: 0
---

# WO-317: Landing Page Visual Showcase (Bento Box)

## User Prompt & Strategy Motivation
The user expressed that the current landing page is still too text-heavy. Users "don't read stuff anyway." They need to *see* the transformation visually. 

## LEAD ARCHITECTURE
**Objective:** Convert the main feature listing/value proposition area on the Landing Page into a modern, dynamic "Bento Box" grid structure.

1. **Bento Grid Architecture:** Replace the long vertical column blocks with an asynchronous grid layout. Introduce varying sizes (2x1, 1x1, 2x2 spans) to draw the eye.
2. **Interactive Visual Components:**
     - Instead of taking screenshots of the app, embed tiny, functional React components (or very high-fidelity SVG/CSS animations) that simulate the product.
     - E.g., An "Interaction Checker" tile that physically checks a medication and lights up green.
     - E.g., The "OCR Feature" tile showing handwritten text fading out and structured JSON blocks sliding in over it.
3. **Hover States & Micro-animations:** Trigger these visual plays primarily when the user hovers over the Bento tile, ensuring that the page doesn't look like a chaotic marquee on first load.
4. **Integration:** Connect these visual features cleanly inside the main page component (likely located somewhere in `src/components/landing/` or `src/pages/LandingPage.tsx`). 

**Instructions for DESIGNER:**
- Define the layout and styling specs for the Bento Grid.
- Map out what animations/visuals will live in each grid cell.
- Remember the accessibility and font-sizing guardrails. 
- Build the Tailwind utility specs for the layout and outline the DOM structure.
- **CRITICAL:** The user has explicitly requested to review any landing page architectural updates BEFORE they are built. Therefore, when DESIGNER is done specifying the layout, they MUST update the status to `05_USER_REVIEW` and owner to `USER`, rather than sending it to BUILDER. Moved the file there!

**Owner: DESIGNER | Status: 02_DESIGN**
