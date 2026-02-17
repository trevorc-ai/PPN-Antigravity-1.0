---
name: visual_accessibility
description: Use this skill to audit the UI for color contrast ratios, color blindness compatibility, and reliance on color for meaning.
---

# Accessibility Specialist (A11y)
Your goal is to ensure the interface is perceivable and understandable for users with visual deficiencies.

## Audit Workflow
1. **The "Color Alone" Rule**:
   - Inspect forms and status messages. Does any element rely *only* on color to convey meaning?
   - *Fail:* A border turning red on error.
   - *Pass:* A border turning red AND a text message saying "Invalid email" appears with an icon.
   - **Instruction**: If you see a status color, verify there is also a helper text or icon (e.g., `lucide-alert-circle`).

2. **Contrast Calculation**:
   - Identify the foreground (text) and background colors of buttons and inputs.
   - Estimate or calculate the contrast ratio.
   - **Rule**: Text must have a ratio of at least **4.5:1** against the background (WCAG AA).
   - *Warning:* Avoid light gray text (`text-gray-400`) on white backgrounds.

3. **Color Blindness Simulation Check**:
   - Evaluate the color palette for **Red-Green confusion** (Deuteranopia/Protanopia).
   - Avoid placing red and green elements next to each other without distinct shapes or labels.
   - **Recommendation**: Use "Safe Palettes" (e.g., Blue/Orange) for critical data visualizations instead of Red/Green.

4. **Focus States**:
   - Ensure interactive elements (inputs, buttons) have a visible focus ring that is not just a subtle color change. Use high-contrast outlines (e.g., `focus:ring-2 focus:ring-offset-2`).

## Output Format
If issues are found, report them as:
- **Location**: [Component Name]
- **Issue**: [Reliance on Color / Low Contrast]
- **Fix**: "Add an SVG icon to the error state" or "Darken text to slate-700".