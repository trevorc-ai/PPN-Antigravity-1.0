# Goal Description
Implementation plan for the highly optimized and automated Growth/Marketing Work Order Pipeline. This pipeline separates content/marketing creation from core engineering features to prevent context collapse, reduce token consumption, and enforce rigorous quality checks for SEO, AIO (AI Overview), and Conversion Rate Optimization (CRO). 

## User Review Required
> [!IMPORTANT]
> **INSPECTOR / LEAD / USER Review Needed:**
> Please review this structured pipeline checklist before execution. Any adjustments to the specific folder names, required skills, or automation tools (like NotebookLM integration) should be noted now.

## Proposed Changes

### 1. New Directory Structure [NEW]
Separating Growth/Marketing tickets from the core product `_WORK_ORDERS/00_INBOX` to maintain focused backlogs.
- #### [NEW] `_GROWTH_ORDERS/`
- #### [NEW] `_GROWTH_ORDERS/00_BACKLOG/` (Raw ideas, NotebookLM extractions, transcript chunks)
- #### [NEW] `_GROWTH_ORDERS/01_DRAFTING/` (MARKETER active writing phase)
- #### [NEW] `_GROWTH_ORDERS/02_USER_REVIEW/` (Mandatory hard-stop for copy approval)
- #### [NEW] `_GROWTH_ORDERS/03_MOCKUP_SANDBOX/` (Isolated UI component generation for visual preview)
- #### [NEW] `_GROWTH_ORDERS/04_VISUAL_REVIEW/` (Mandatory hard-stop for Founder design approval)
- #### [NEW] `_GROWTH_ORDERS/05_IMPLEMENTATION/` (Wiring the approved mockup into the main React app)
- #### [NEW] `_GROWTH_ORDERS/06_QA/` (Verification against SEO/CRO standards)
- #### [NEW] `_GROWTH_ORDERS/98_HOLD/` (Parked projects: Safely stores partially drafted or built marketing assets during a pivot/pause so no token investment is lost).
- #### [NEW] `_GROWTH_ORDERS/99_PUBLISHED/` (Completed output)
- #### [NEW] `_GROWTH_ORDERS/07_ARCHIVED/` (Deprecated or outdated content)

### 2. Global Context Resolution [NEW]
To prevent fresh agent sessions from hallucinating entire features (like rebuilding the showcase page) or suffering from "amnesia" without blowing out the token context window, we must implement a lightweight "Map of the Territory".

- #### [NEW] `ASSET_LEDGER.md` (or `ROUTER_MAP.md`)
  - A single file placed in the root directory (or `.agent/` config).
  - This is a highly condensed bullet list of *what currently exists* in the product (e.g., `- trevor-showcase.html: Public demo page showcasing practitioner capabilities`).
  - **The Workflow Hook:** When *any* agent (specifically PRODDY or LEAD) starts a new chat, the global system constraints (or `agent.yaml` context files) will instruct them to read this ledger first. By reading a 500-word index, the agent instantly knows every major feature that exists. If one is relevant, it then uses `view_file` to read the specific code, keeping token usage pinpoint and minimal.

### 3. Phase-by-Phase Integration of Existing Workflows and Skills
We don't need to rebuild the entire agent architecture from scratch. We can heavily leverage the existing PPN agent skills and workflows, optimizing them for public-facing assets, while only creating two new critical marketing protocols.

#### Phase 1: Strategy & Definition
- **Skill:** `proddy-protocol` (Already updated with new workflow constraints for grouping Epics and broad searches).
- **Workflow:** `/work-order-triage` (Used by LEAD to prioritize the `_GROWTH_ORDERS/00_BACKLOG`).

#### Phase 2: Copywriting & Conversion Optimization
- **Skill (New):** `marketer-protocol` (Must be implemented. This requires defining the PPN brand voice, SEO/AIO JSON-LD rules, and NotebookLM extraction procedures).
- **Tooling:** NotebookLM MCP integration.

#### Phase 3: UX/UI Mockup Sandbox
- **Action:** CUE/DESIGNER builds an isolated HTML/Vite preview of the component without touching core application routing or logic. This serves as a disposable, low-risk visual prototype.
- **Skill:** `core-ui-engineering`, `ppn-ui-standards`, and `frontend-best-practices` (The PPN design system).
- **Workflow:** `/ui-ux-auditor` (Senior UI/UX Auditor role to review the structural design).

#### Phase 4: Visual Mockup Review
- **Action:** USER inspects the isolated sandbox mockup in the browser. Design is either rejected (back to Phase 3) or approved. This is a mandatory checkpoint.

#### Phase 5: Implementation & Integration
- **Action:** BUILDER takes the approved mockup from the sandbox and wires it into the actual React routing framework, hooking up state, props, and any Supabase API connections required.
- **Skill:** `component_builder`.
- **Skill:** `frontend-surgical-standards` (Strict Tailwind CSS constraints for UI modifications).

#### Phase 6: Technical QA & Durability Audit
- **Skill:** `inspector-qa-script` (The baseline testing and validation checklist for all commits).
- **Skill:** `browser` (Mandatory for visual UI/UX verification—loading the fully integrated marketing pages).
- **Workflow:** `/accessibility-checker` (To perform a comprehensive accessibility audit).
- **Skill (New):** `marketing-qa-checklist` (Specifically checks Lighthouse metrics, CRO hooks, and SEO JSON-LD tagging).

### 3. New Agent Protocols to Create
- #### [NEW] `.agent/skills/marketer-protocol/SKILL.md`
  - Defines tone and brand voice.
  - Generates minimum SEO requirements (Title, Meta Description, internal links).
  - Drafts AIO (AI Overview) optimization standards (Schema.org JSON-LD generation).
  - Prohibition on writing executable code (content generation only).
  - NotebookLM integration logic for extracting insights from transcripts/podcasts.
- #### [NEW] `.agent/skills/marketing-qa-checklist/SKILL.md`
  - Automated checklist for INSPECTOR to run alongside `inspector-qa-script`.
  - Verification of Lighthouse performance limits (< 2s TTI).
  - Verification of `<h1>` hierarchy and semantic HTML structure.
  - Review of CRO metrics (Single primary CTA per viewport).

### 4. Work Order Templates
- #### [NEW] `_WORK_ORDERS/TEMPLATES/WO_GROWTH_EPIC.md`
  - Template forcing the consolidation of multi-part marketing requests (e.g., 5 variations of a landing page) into a single Epic.
  - Fields for Target Keyword, Audience Segment, NotebookLM Source File (if applicable), and Conversion Goal.

### 5. Implementation Commands & Tooling Hook-ins
- Script/instructions connecting the NotebookLM MCP to populate `00_BACKLOG` tickets automatically given a source document.

---

## ⚠️ Known Risks & Necessary Guardrails

To prevent this pipeline from failing at scale, we must implement these mandatory constraints:

#### Risk 1: Ledger Drift (Stale State)
- **The Risk:** The `ASSET_LEDGER.md` is only valuable if it is 100% accurate. If a builder creates a new page or renames a component but forgets to update the ledger, the map no longer matches the territory. Future agents will hallucinate or overwrite existing code out of ignorance.
- **The Guardrail:** Updating `ASSET_LEDGER.md` must be a mandatory, hard-coded step in the `/finalize_feature` script and `inspector-qa-script`. No PR can be merged or ticket moved to `99_COMPLETED` without a ledger synchronization check.

#### Risk 2: Pipeline Bypass (Cowboy Coding)
- **The Risk:** A user or agent bypasses the `02_USER_REVIEW` step and directly creates frontend React code from a raw idea in `00_BACKLOG`. This burns tokens, creates unapproved UX, and skips the SEO/AIO optimization steps.
- **The Guardrail:** A hard rule must be added to `GLOBAL_CONSTITUTION.md` / `agent.yaml`: *"No direct code generation (TSX, CSS, HTML) is permitted for any ticket residing in `01_DRAFTING`. All growth work orders MUST physically pass through `02_USER_REVIEW`, be converted into prototypes in `03_MOCKUP_SANDBOX`, and pass `04_VISUAL_REVIEW` before the Builder agent is authorized to write integration code in `05_IMPLEMENTATION`."*

#### Risk 3: Marketing Scope Creep
- **The Risk:** While drafting copy for a landing page, the `MARKETER` agent hallucinates new core application features (e.g., "To increase conversions, let's build an entirely new AI chatbot widget on the dashboard") instead of positioning what currently exists.
- **The Guardrail:** A strict prohibition in `marketer-protocol/SKILL.md`: *"MARKETER is strictly forbidden from proposing new application logic, database schema changes, or novel UI widgets. MARKETER only manipulates text, tracking events, and existing design system components."*

#### Risk 4: Token Bloat within Epics (The "Variation" Problem)
- **The Risk:** For core application features, breaking work into distinct, tiny tickets is correct. However, for marketing variations (e.g., the same layout but 5 different landing pages for 5 audiences), creating 5 distinct tickets pollutes the backlog and causes builders to rebuild the same component 5 times. Grouping them into one `WO_GROWTH_EPIC.md` prevents duplicate react building, but asking the `MARKETER` agent to write the copy for all 5 audiences simultaneously will blow out the token context window.
- **The Guardrail:** The user manually breaking up complex engineering tickets remains the absolute best practice. But for Growth Epics containing variations, the `marketer-protocol` must enforce a rigid "Serial Processing Loop". MARKETER must generate the `CONTENT_MATRIX.md` for *only one* variation/audience, output the file, stop, and explicitly request permission to process the *next* bullet point in the Epic.

---

## Verification Plan

### Automated Tests
- Run the new INSPECTOR checklist (`marketing-qa-checklist`) manually against a dummy marketing `CONTENT_MATRIX.md` to ensure it flags missing SEO metadata correctly.
- Ensure the agent swarm correctly recognizes the `_GROWTH_ORDERS/` folder path and treats it with the appropriate protocols.

### Manual Verification
- Execute a complete test-run of the pipeline: Extract an insight via NotebookLM, have `MARKETER` draft the MD, pause in `02_USER_REVIEW`, have `BUILDER` format it using existing components, and have `INSPECTOR` clear it.
