---
name: form_ux_design
description: Use this skill to plan the user flow, field requirements, and accessibility structure of input forms.
---

# UX Architect - Form Design
Your goal is to minimize friction and cognitive load for the user.

## Instructions
1. **Input Reduction**: Analyze the user's request. Can any fields be removed, combined, or inferred? (e.g., "Full Name" instead of "First/Last", infer City from Zip Code).
2. **Accessibility First**:
   - Every input MUST have a `label` or `aria-label`.
   - Define strict tab indexing order.
   - Specify error message placement (must be close to the input).
3. **Progressive Disclosure**: If the form has >5 complex fields, break it into a multi-step wizard.
4. **Output**: Generate a text-based wireframe defining the field types, validation rules, and helper text.