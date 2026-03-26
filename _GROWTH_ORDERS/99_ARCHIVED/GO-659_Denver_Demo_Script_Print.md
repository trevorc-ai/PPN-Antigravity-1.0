---
id: GO-659
title: "PsyCon Denver 2026 — Demo Script (Print Leave-Behind)"
owner: MARKETER
authored_by: PRODDY
status: 00_BACKLOG
priority: P0
created: 2026-03-23
epic_type: Print_Asset
target_audience: "Trevor Calton — conference facilitator using the script personally at the PsyCon Denver booth, April 9, 2026"
notebook_source: "N/A"
prototype_reference: "public/internal/admin_uploads/denver-2026/PsyCon_Demo_Script_April9.md"
growth_order_ref: ""
stage_waived_by: ""
print_deadline: 2026-04-05
event_date: 2026-04-09
quantity: 1
---

## Brief

Single-page print demo script for Trevor's personal use at the PsyCon Denver booth (April 9, 2026). The script governs a 5-minute platform walkthrough for qualified prospects after the 60-second booth triage. It is NOT a prospect-facing artifact — it sits on the table for the facilitator's reference only.

A prototype draft exists at `public/internal/admin_uploads/denver-2026/PsyCon_Demo_Script_April9.md` — MARKETER reviews and tightens the copy, DESIGNER validates readability at a glance (14pt minimum, single-sided), BUILDER implements any copy corrections into the final print file, INSPECTOR verifies the ppn-ui-standards print checklist before USER approves.

**Print deadline: April 5, 2026. No extensions.**

---

## MARKETER Task List

1. **Review all copy for the 60-second booth triage protocol:**
   - Three qualifying questions (Q1 Status / Q2 Scale / Q3 Pain Agitator)
   - Per-answer routing instructions (solo vs VIP vs planning)

2. **Review the 5-minute demo arc (Minute 1–5):**
   - Verbatim phrases for each minute
   - Navigation instructions per minute (What screen to be on)
   - Practitioner pivot vs. researcher pivot in Minute 4
   - The close (Minute 5) — confirm the founding partner pitch language is current

3. **Review the objection handling table:**
   - HIPAA question / pricing question / EHR comparison / "not sure yet" / WiFi failure
   - Confirm responses align with current strategy doc (no pricing said on the floor)

4. **Review the morning-of checklist:**
   - Confirm all items are accurate for the April 9 setup
   - Add any items missed (QR code physical test, battery pack, badge scanner, etc.)

5. **No em dashes. No JetBrains Mono. No grey-market or patient language anywhere.**

6. **Produce `CONTENT_MATRIX.md`** and place in `01_DRAFTING/` for USER review.

---

## Reference Assets

- **Prototype script:** `public/internal/admin_uploads/denver-2026/PsyCon_Demo_Script_April9.md`
- **Strategy doc:** `public/internal/admin_uploads/strategy/Landing-Page-and-Denver-Launch-03-22-26.md`
- **Leave-Behind (for tone matching):** GO-658 / `public/internal/admin_uploads/denver-2026/PPN_Leave_Behind_Print.html`

---

## Audience-Specific Exclusions

- This is a facilitator reference, NOT a prospect document — no marketing-style copy
- No soft language ("might", "could", "potentially")
- No grey-market or patient references anywhere
- No pricing on the floor — script must say to send the founding partner packet, not quote the number

---

## Fast-Lane Flag

DESIGNER mockup pass is **required** before BUILDER implements. Key readability constraint: must be legible at arm's length in a conference environment. DESIGNER specifies font size (14pt minimum), line spacing, and column layout. Prototype is markdown — DESIGNER and BUILDER produce a print-ready HTML or PDF, not plain markdown.

---

## INSPECTOR QA Gate (06_QA)

- [ ] Single page — does not paginate to a second page at US Letter, 0.5in margin
- [ ] Font: Inter only. Roboto Mono for code-style labels and platform navigation references
- [ ] No font below 12pt (9pt for footnotes only)
- [ ] No em dashes
- [ ] Contrast passes 4.5:1 on white background (if printed on white)
- [ ] All objection responses are factually consistent with current pricing and strategy
- [ ] Print test: open in Chrome → Print → US Letter → confirm single page

---

## Acceptance Criteria

- [ ] MARKETER `CONTENT_MATRIX.md` filed and USER-approved at `02_USER_REVIEW`
- [ ] DESIGNER specifies layout — single page, readable at arm's length
- [ ] USER approves design at `04_VISUAL_REVIEW`
- [ ] BUILDER produces final print-ready file
- [ ] INSPECTOR completes QA checklist — all items pass
- [ ] USER confirms single-page print in Chrome before order
- [ ] Printed and in Trevor's bag by April 8, 2026
