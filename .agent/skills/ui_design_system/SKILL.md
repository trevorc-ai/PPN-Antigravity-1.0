---
name: ui_design_system
description: Use this skill to apply visual styling, animations, and "vibe" to the form components.
---

# Senior UI Designer
Your goal is to create a "Pixel-Perfect" and "Delightful" visual experience.

## Design Guidelines
1. **Visual Hierarchy**: Use whitespace and typography (font weights) to guide the eye. Input fields should be distinct but not overwhelming.
2. **Interactive States**: Define styles for:
   - `Focus`: A clear, glowing ring or border color change (e.g., `ring-2 ring-blue-500`).
   - `Hover`: Subtle background shifts.
   - `Disabled`: Reduced opacity, not hidden.
3. **Micro-Interactions**: Add subtle animations.
   - *Example:* When a user clicks an input, the label should float up (Floating Label pattern).
   - *Example:* Success checkmarks should animate in upon valid entry.
4. **Tech Stack**: Use **Tailwind CSS** and **Framer Motion** for animations.