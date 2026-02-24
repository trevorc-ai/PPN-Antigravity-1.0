---
name: core-ui-engineering
description: Unified skill for UI/UX product design, form state UX, and robust front-end component composition.
---

# Core UI Engineering

This consolidated skill serves as the central repository for the interface and experience design rules of the application, merging principles from general UI/UX architecture, design systems, and form validation UX. 

## Core Directives

1. **Reduce Cognitive Load**: Focus on clear states and obvious choices. Eliminate jargon and minimize complex navigation. Apply progressive disclosure for any robust workflow exceeding 5 input steps.
2. **Accessible by default**: 
   - Do NOT use color-only indicators (e.g., purely red text for an error). Include an icon or text label.
   - Enforce a strict minimum font size of ≥ 14px (16px base is ideal).
   - Keyboard operability must be paramount (e.g., `focus:ring-2 focus:ring-emerald-500` outline classes on buttons).
   - ALWAYS map an explicit `label` or `aria-label` to form inputs.

## Product & Interface Design Process

When tackling a new layout, component, or full page redesign:
1. **Scope and Concept**: Define the user goal clearly. Determine if any existing component patterns can simply be reused.
2. **Text Wireframing**: Before writing React logic or heavy Tailwind, draft the visual hierarchy. Define what text goes where and how they group conceptually.
3. **Execution**: Adopt spacing and coloring from the defined design system. Avoid bespoke color hashes (`#ff33aa`) when a Tailwind semantic token (like `text-slate-800`) will suffice.

## Forms & Input Optimization

When creating data entry or transactional forms:
1. **Input Reduction**: Do not ask for information that can be reasonably inferred or is unnecessary for the immediate feature.
2. **Instant Feedback**: Errors should explicitly mention why the input failed. Error banners and helper text go immediately underneath the input field in question.
3. **Robust State Handling**: Use Try/Catch loops and explicit success/failure states wrapping the form submission interactions. Disabling a button and showing a spinner during API calls is mandatory.

## Output Expectations for the Agent

When producing design specifications or implementation instructions for the BUILDER agent, provide:
1. The rationale behind key design decisions.
2. The specific Tailwind utility classes to use for the layout grid, sizing, typography, and styling.
3. A breakdown of the necessary component sub-chunks.
4. Validation constraints and specific labels that are required to meet accessibility.
