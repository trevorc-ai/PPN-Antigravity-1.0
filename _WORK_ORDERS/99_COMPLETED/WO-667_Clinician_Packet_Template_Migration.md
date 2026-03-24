# WO-667 — Clinician Founding Partner Packet: Migrate to PACKET_TEMPLATE.html

**Status:** 📥 INBOX  
**Priority:** Low  
**Type:** Maintenance / Standards Alignment  
**Assignee:** BUILDER  
**Reference:** GO-651 · Related: WO-659 (Document Packet Template Refinements)  
**Created:** 2026-03-23

---

## Background

The `PACKET_TEMPLATE.html` was created as the canonical standard for all PPN digital document packets. It was first applied to the **HIPAA Legal Packet** (`HIPAA-Packet/index.html`) and then formalized as a reusable template at `public/internal/founding-docs/PACKET_TEMPLATE.html`.

The **Clinician Founding Partner Packet** (`Clinician-Packet/index.html`) predates this template. It is functionally equivalent but was never back-ported to the template standard. It has accumulated several minor divergences from the canonical version.

---

## Objective

Back-port `Clinician-Packet/index.html` to be derived from `PACKET_TEMPLATE.html` — updating only the CSS formatting, commenting, and minor structural alignment. **The `PACKET_CONFIG` sections and all content files must not change.**

---

## Scope of Changes

### File to Modify

#### [MODIFY] `public/internal/founding-docs/Clinician-Packet/index.html`

Apply the following changes to align with `PACKET_TEMPLATE.html`:

1. **Expand minified CSS** — Un-minify all compressed one-liner CSS rules to match the readable, multi-line format used in `PACKET_TEMPLATE.html` and `HIPAA-Packet/index.html`.

2. **Add missing `.action-group` flex properties** — Template has `display: flex; flex-direction: column; gap: 6px;` on `.action-group`. Clinician packet is missing this.

3. **Fix `bottom-nav-item` sizing** — Align to template standard:
   - `min-width: 52px` (currently `48px`)
   - `font-size: 8.5px` (currently `8px`)

4. **Add tablet media query `status-legend` hide rule** — Template hides `.status-legend` in the tablet breakpoint. Add it: `.nav-item-label, .sidebar-section-label, .status-legend, .btn-text { display: none; }`.

5. **Add `<!-- SHELL ENGINE — do not modify below this line -->` comment fence** — Insert the separator comment between the `PACKET_CONFIG` block and `buildShell()` function.

6. **Expand minified JS** — Un-minify all compressed one-liner JS functions (`buildShell`, `switchSection`, `printCurrent`, `printAll`, `copyPacketLink`, `toggleSidebar`, `closeSidebar`) to match the readable, multi-line format in the template.

---

## What Must NOT Change

- The `PACKET_CONFIG` block values (`title`, `reference`, `productionUrl`, `printAllUrl`, `legend`, `sections`)
- Any `src` paths pointing to `clinician_html/` files
- Any content HTML files inside `clinician_html/`
- The `dist/` mirror of this packet

---

## Verification

**BUILDER** self-check before handoff to INSPECTOR:

- [ ] Open `Clinician-Packet/index.html` in browser — all 8 sections load correctly in the sidebar
- [ ] Click each nav item — correct iframe content loads
- [ ] Mobile breakpoint: hamburger appears, bottom nav is visible, sidebar slides in/out
- [ ] Tablet breakpoint: sidebar collapses to icon-only (56px), bottom nav is hidden
- [ ] "Print This Section" and "Save All as PDF" buttons are present and functional
- [ ] "Copy Link" button copies correct production URL
- [ ] Side-by-side diff against `PACKET_TEMPLATE.html` shows only config + `legend: null` differences

**INSPECTOR** QA:

- [ ] Run `/inspector-qa-script` Phase 0 (Pre-Build Review) and Phase 1 (Code QA)
- [ ] Confirm no visual regression vs. current Clinician Packet appearance
- [ ] Confirm CSS and JS match `PACKET_TEMPLATE.html` structure exactly

---

## Out of Scope

- Updating content inside `clinician_html/*.html` files
- Updating the Researcher Packet (separate ticket if needed)
- Updating the `dist/` mirror — this is handled by the standard build/deploy process

---

## Notes

> The `dist/internal/founding_partner_docs/Clinician-Packet/` directory mirrors this packet. The `dist/` copy should be updated after verification passes, following the standard finalize workflow.
