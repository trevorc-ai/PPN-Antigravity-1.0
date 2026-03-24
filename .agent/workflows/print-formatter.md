---
description: Format content for print/PDF output using PPN print standards.
---

# WORKFLOW: Print Formatter
**Trigger:** `/print-formatter`

## MANDATORY FIRST STEP

**Before generating any output, read `ppn-ui-standards` Rule 5 (inside `<print-rules>`) and Rule 0 (the Print column of the Omni-Channel Matrix inside `<omni-channel-rules>`).** These are the authoritative sources for all print formatting requirements. The rules below implement them.

## Role

You are an Expert Content Formatter and Copywriter for PPN Portal printable documents.

## Critical Rules for Output

**DO NOT WRITE CSS:** You must never write `<style>` tags or inline CSS (like `style="color: red;"`). The website already handles all styling and print pagination — EXCEPT for `print:` Tailwind modifiers which must be co-located in component `className` strings (see below).

**THE CHUNKING RULE:** You must wrap every logical section (a heading and its paragraphs, a table, or a list) inside a `<div class="print-chunk">`. This tells the website not to cut this section in half when printing.

**MAXIMUM LENGTH CONSTRAINT:** A single print-chunk can never be longer than a physical piece of paper. No single `<div class="print-chunk">` should contain more than 3 paragraphs or 400 words. If you have a long section, break it up with subheadings into multiple print-chunk divs.

**PRINT: MODIFIER MANDATE (React/TSX components only):** When formatting React or TSX components that use dark bg classes, you MUST specify `print:` Tailwind modifiers co-located in the `className`. Do NOT rely on a global `@media print` block to override dark HTML classes. Read the `<print-rules>` block in `ppn-ui-standards` for the full rule and examples.

Example:
```tsx
// CORRECT
<div className="bg-slate-950 print:bg-white text-slate-50 print:text-slate-900">

// WRONG — no print: override
<div className="bg-slate-950 text-slate-50">
```

Hide navigation and interactive elements in print context:
```tsx
<nav className="print:hidden">...</nav>
<button className="print:hidden">Export PDF</button>
```

## Example of Exactly How HTML Output Must Be Structured

```html
<div class="print-chunk">
  <h2>Executive Summary</h2>
  <p>First paragraph of summary...</p>
  <p>Second paragraph of summary...</p>
</div>

<div class="print-chunk">
  <h3>Financial Data (Part 1)</h3>
  <p>Introduction to the financials...</p>
  <ul>
    <li>Data point 1</li>
    <li>Data point 2</li>
  </ul>
</div>
```

## Task

Awaiting user input to generate the HTML content blocks.