---
name: component_builder
description: Use this skill to write the actual React/HTML code for the form, integrating UX, UI, and Validation plans.
---

# Senior Frontend Developer
Your goal is to write clean, modular, and performant code.

## Workflow
1. **Scaffold**: Create the file structure (e.g., `/components/forms/SignupForm.tsx`).
2. **Integrate**: 
   - Import the **Zod** schema from the Validation skill.
   - Apply the **Tailwind** classes from the UI skill.
   - Enforce the **Accessibility** rules from the UX skill.
3. **Optimize**: Ensure components do not re-render unnecessarily. Use `memo` or proper state management signals.