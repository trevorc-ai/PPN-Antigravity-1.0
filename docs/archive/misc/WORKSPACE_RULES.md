# PPN Research Portal - Workspace Rules

This file documents critical rules and constraints for working within the PPN Research Portal codebase, based on project history and explicit user directives.

## 1. Zero-Deletion Policy (CRITICAL)
- **NEVER** delete or remove any visual elements, components, sections, containers, or functionality without **EXPLICIT, DOUBLE CONFIRMATION** from the user.
- If a request is ambiguous (e.g., "Add a login modal"), treat it as an **ADDITION** or an **OPTION**, never a replacement, unless the user explicitly says "replace" or "remove".
- **Proposal Requirement:** Always propose a change that involves removing or hiding existing code *before* executing it.

## 2. Literal Instruction Interpretation
- Follow instructions **literally**. Do not infer unstated goals.
- If the instruction is "Add X", simply add X. Do not modify Y.
- **Strict Scope Control:** Maintain strict focus on the requested feature. Do not refactor, clean up, or reorganize unrelated code unless specifically asked.

## 3. Visual & Styling Standards (Non-Negotiable)
- **Background Integrity:**
    - Maintain the "Night Sky.png" background image with **subtle parallax** (e.g., 0.08x scroll speed) on the Landing page.
    - Do not revert to CSS-generated stars unless explicitly requested.
- **Layering & Visibility:**
    - Ensure all content sections (Hero, Features, Footer, etc.) have `relative z-10` (or higher) to appear above fixed backgrounds (`z-0`).
    - Verify z-index stacking context whenever modifying fixed or absolute positioned elements.
- **Color System:** Use the defined palette strictly:
    - **Primary:** Blue (`#2b74f3`)
    - **Actions:** Use `bg-primary` for main CTAs.
    - **Backgrounds:** Deep black (`#05070a`, `#07090d`), Slate-900 overlays.
    - **Text:** White/Slate hierarchy (`text-white`, `text-slate-400`).
- **Typography:**
    - **Headings:** `Manrope` (font-black, uppercase, tight tracking).
    - **Body:** `Inter` (font-medium).
    - **Mono:** `JetBrains Mono` (font-mono).

## 4. Feature Implementation Guidelines
- **Authentication:**
    - Use Supabase for auth/backend.
    - Maintain the "Development Bypass" feature (`dev@test.com`) for local testing efficiency.
- **Layout Integrity:**
    - Do not alter container sizing (e.g., the 4-stat grid on Landing) or layout grids without explicit instruction.
    - Ensure responsive behavior is tested or maintained (mobile first, `sm:`, `md:`, `lg:` breakpoints).

## 5. Verification Process
- **Before stating something is "missing":** Check the code structure (e.g., z-index, visibility, opacity) to ensure content isn't just hidden behind a background layer.
- **Before committing changes:** Review the diff to ensure no unintended deletions occurred.
