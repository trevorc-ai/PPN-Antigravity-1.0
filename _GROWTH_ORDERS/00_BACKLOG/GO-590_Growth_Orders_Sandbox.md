---
id: GO-590
title: Growth Orders Visual Sandbox (Mobile Review Hub)
owner: LEAD
status: 00_BACKLOG
authored_by: PRODDY
priority: P1
created: 2026-03-09
type: TOOLING
---

## PRODDY PRD

### 1. Problem Statement
Trevor cannot efficiently review growth order assets — wireframes, content matrices, and mockup HTML files — from his phone because they are buried in deeply nested filesystem folders with no central review surface. Visual review is a required step in the `_GROWTH_ORDERS` pipeline for stages `02_USER_REVIEW`, `04_VISUAL_REVIEW`, and `06_QA`, but currently requires desktop VS Code access. Items stall waiting for review, blocking the pipeline at every user-gate stage.

### 2. Target User + Job-To-Be-Done
Trevor (pipeline owner) needs to review and approve growth order assets from his phone so that the `_GROWTH_ORDERS` Kanban can advance without requiring desktop access.

### 3. Success Metrics
1. All items in `02_USER_REVIEW`, `04_VISUAL_REVIEW`, and `06_QA` are accessible via a single URL within one tap from the sandbox index page.
2. The sandbox page renders correctly on iOS Safari at 390px viewport width with no horizontal scroll.
3. New items added to any `_GROWTH_ORDERS` stage are reflected in the sandbox page within the same build session they are created.

### 4. Feature Scope

#### In Scope:
- A single static HTML page: `public/admin/growth-sandbox.html`
- A pipeline summary bar at the top showing item count per stage, with amber highlight on any stage containing items awaiting user review (`02_USER_REVIEW`, `04_VISUAL_REVIEW`, `06_QA`)
- Cards for every growth order item currently in the pipeline, grouped by stage
- Each card shows: GO/WO ID, title, current stage badge, content type (matrix/wireframe/design/mockup), and a direct link to preview the asset
- For `.html` assets: an `<iframe>` preview with link to open full-screen
- For `.md` assets: a rendered text preview (first 200 chars of content) with a note that this is a content document, not a visual asset
- Mobile-first layout: single column on mobile, 2-col grid on tablet+
- PPN dark aesthetic (consistent with `trevor-showcase.html` visual language)
- Manually updated — MARKETER or BUILDER adds new cards when items enter the pipeline

#### Out of Scope:
- Live dynamic filesystem scanning or build-time automation
- Authentication or access control (this is a local/hosted dev tool for Trevor's review, not a public page)
- Editing or approving items directly within the sandbox (review only — Trevor communicates decisions verbally or via chat)
- Embedding the main React app in an iframe (causes auth/routing issues)

### 5. Priority Tier
**P1** — The visual review gap is a pipeline blocker today. Three stages currently have items waiting for Trevor's approval with no accessible review path. Every sprint that passes without this tool costs compounding pipeline delay.

### 6. Open Questions for LEAD
1. Should `growth-sandbox.html` live in `/public/` alongside `trevor-showcase.html` and `phantom-shield.html`, or in a separate `/public/admin/` directory to distinguish it as an internal tool?
2. Should the iframe preview be sandboxed (`sandbox="allow-scripts allow-same-origin"`) or fully unrestricted for wireframe HTML files?
3. Is there a preferred card ordering — newest first by created date, or by stage order (pipeline flow)?

---

## PRODDY Sign-Off Checklist
- [x] Problem Statement ≤ 100 words
- [x] Success Metrics are measurable with specific numbers or events
- [x] Out of Scope section is complete and meaningful
- [x] PRD total is under 600 words
- [x] Open Questions ≤ 5
- [x] No code, SQL, or schema authored in this document
- [x] Filed in `_GROWTH_ORDERS/00_BACKLOG/` per GROWTH pipeline convention

✅ GO-590 placed in `_GROWTH_ORDERS/00_BACKLOG/`. LEAD action needed: review Open Questions and route.
