# WO-659: Document Packet Template Refinements

**Status:** Inbox
**Priority:** High
**Requestor:** Trevor Calton
**Date Created:** 2026-03-23
**Relates to:** GO-651 (HIPAA Legal Packet), Founding Docs

---

## Objective

Refine the HIPAA Legal Packet shell (`index.html`) and all 5 section files into a reusable, fully shareable document packet template. Once approved, this template will be applied to all future document collections (founding docs, research packets, compliance packets, etc.).

---

## Scope of Work

### 1. Shareability — Production URL
- Fix `Copy Link` button in `index.html` and all section files to share a hardcoded production URL (`https://ppnportal.net/internal/founding-docs/HIPAA-Packet/index.html`), not `window.location.href` (which returns `file://` locally).

### 2. Tablet Nav
- Current breakpoints: desktop (sidebar visible), mobile (<768px, hamburger + bottom nav).
- Add tablet breakpoint (768px–1024px): compact icon-only sidebar (48px wide, icons + section numbers only, no labels). Labels appear on hover via tooltip. Sidebar is NOT hidden behind hamburger on tablet.

### 3. Save All as PDF
- Add "Save Complete Packet as PDF" button in `index.html` sidebar.
- Opens a new tab to `hipaa_html/print_all.html`, which is a single HTML file with all 5 sections concatenated in order, each separated by `page-break-after: always`.
- That page auto-triggers `window.print()` on load.
- Document title set to `PPN-HIPAA-Legal-Packet-2026-03` for correct PDF filename.

### 4. Filename Structure
- Update `<title>` tags in all 5 section files for PDF sort order:
  - `00_Cover.html` → `PPN-HIPAA-00-Cover`
  - `01_HIPAA_Posture_Overview.html` → `PPN-HIPAA-01-Posture-Overview`
  - `02_Conflict_Resolution_Audit.html` → `PPN-HIPAA-02-Architecture-Verification`
  - `03_Technical_Proof_Set.html` → `PPN-HIPAA-03-Technical-Proof`
  - `04_Safe_Harbor_Table.html` → `PPN-HIPAA-04-Safe-Harbor`
  - `06_Public_Documentation.html` → `PPN-HIPAA-05-Public-Documentation`

### 5. PPN UI Standards Pass
**Violations found across all files:**

- **index.html L200:** `&mdash;` em dash in topbar ("Confidential &mdash; For Legal Counsel Only") → replace with colon
- **index.html L246-248:** Status legend uses color-only dots → add text labels only (dots are decorative, labels carry meaning — already has labels, verify icon+text pairing)
- **§4 L77:** Summary paragraph still references "active remediation" → rewrite to clean posture statement
- **§4 L46:** "Section 4 of 6" → "Section 4 of 5"
- **All section footers:** Standardize to `© 2026 PPN Portal · ppnportal.net · Confidential and Proprietary`
- **§1 L84:** "Date of Birth: Age stored as range only, not exact date" is accurate and compliant — no change needed
- **Action bar `Copy Link`:** All section files copy `window.location.href` → replace with production URL for that section
- **§3 L127:** Auth section references `log_user_sites` internal table name → replace with clean description
- **Remove `action-bar` from section files** — they are displayed inside iframes inside index.html shell; their own print/copy buttons are redundant and confusing. OR add `?standalone=1` detection. Recommended: hide `action-bar` when inside an iframe.

### 6. New File: `print_all.html`
- Single HTML file concatenating all 5 sections in order.
- Each section separated by `<div class="page-break"></div>`.
- Calls `window.print()` on `DOMContentLoaded`.
- Title: `PPN-HIPAA-Legal-Packet-2026-03`.

---

## Template Generalization (Phase 2, separate WO)

After user review and approval of the HIPAA packet in its refined form, extract `index.html` into a parametric template:
- Section list defined in a `<script>` data block (packet name, sections array)
- Template HTML/CSS is identical across all packets
- Apply to: Founding Partner docs, Research Packets, Compliance Packets

---

## Acceptance Criteria

- [ ] Copy Link copies `https://ppnportal.net/internal/founding-docs/HIPAA-Packet/index.html`
- [ ] Tablet view (768–1024px) shows compact icon-only sidebar, no hamburger
- [ ] "Save Complete Packet as PDF" opens print_all.html and triggers browser print dialog
- [ ] Individual PDFs sort alphabetically (PPN-HIPAA-00 through PPN-HIPAA-05)
- [ ] No em dashes in any rendered text
- [ ] All footers: `© 2026 PPN Portal · ppnportal.net · Confidential and Proprietary`
- [ ] §4 summary paragraph removed or rewritten without remediation language
- [ ] All section counts updated to "X of 5", not "X of 6"
- [ ] Action bars hidden when document is inside an iframe
- [ ] All ppn-ui-standards rules pass (Inspector QA)
