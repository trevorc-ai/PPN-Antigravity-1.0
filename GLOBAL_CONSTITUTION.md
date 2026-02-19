# 🌍 THE GLOBAL CONSTITUTION (Universal Project Rules)
**STATUS: IMMUTABLE** | **AUTHORITY: SYSTEM OVERRIDE**

This document supersedes all other instructions. All agents MUST abide by these protocols to ensure a secure, scalable, and accessible environment.

## 1. 🚨 ACCESSIBILITY & IDENTITY PROTOCOLS (MANDATORY)
[CONTEXT: The CEO has a color vision deficiency. You must format your output to be universally accessible.]
*   **Identify Yourself:** Begin and end EVERY response with `==== [YOUR AGENT NAME] ====`.
*   **Task Headers:** The first line of a new workflow must be: `TITLE: [AGENT NAME]: [Task Name]`.
*   **Text-Based Status:** Never use color (like "red" or "green") as the sole indicator of status. You must use explicit text labels: `[STATUS: PASS]`, `[STATUS: FAIL]`, `[ACTION REQUIRED]`, ✅, or ❌.
*   **Visual Design (DESIGNER/BUILDER):** Enforce WCAG 2.2 AA standards. Minimum font size must be 12px. Use visual textures, patterns, and icons alongside colors in all UI components.

## 2. 🗄️ DATABASE & DATA ARCHITECTURE (SOOP & BUILDER)
[CONTEXT: Security and Data Integrity are non-negotiable.]
*   **Zero PHI / PII:** Use synthetic, system-generated `Subject_ID`s for all records. Do not log free-text user inputs in primary tables. Store dropdown selections as foreign keys (e.g., `substance_id`).
*   **Additive Migrations Only:** Write schema changes using `CREATE TABLE IF NOT EXISTS` and `ALTER TABLE ADD COLUMN`. Do not use DROP or DELETE commands on columns or tables. 
*   **Supabase Security:** All tables must reside in the `public` schema. Row Level Security (RLS) MUST be enabled on every table. Isolate user data strictly via a `user_sites` mapping table.
*   **SQL Hygiene:** Enforce 3rd Normal Form (3NF). Use `snake_case` for all tables and columns. Explicitly name columns in queries (Never use `SELECT *`).

## 3. ⚙️ THE SILENT CONVEYOR BELT WORKFLOW (ALL AGENTS)
[CONTEXT: We operate on a silent, file-based Kanban system.]
*   **Artifact-First:** Write code only after a `.md` plan or `.sql` schema is documented and approved.
*   **Silent Handoffs:** Do not tag other agents in the chat. When your task is complete, update the `owner` and `status` in the ticket's YAML frontmatter.
*   **Execute the Handoff Script:** Run `./handoff.sh [filepath] [next_folder] [next_agent]` in the terminal to move the file and log your status. Silently terminate your turn immediately after.
*   **The Two-Strike Debugging Rule:** If you attempt to fix a bug and fail twice, you must STOP. Revert to the last working state via `git restore .` and request a new Tree-of-Thoughts strategy from LEAD.
## 4. ✍️ BRAND VOICE & WRITING GUIDELINES (ALL AGENTS)
[CONTEXT: The USER has a specific voice for all written output. This applies to website copy, marketing materials, internal memos, work order narratives, UI microcopy, and any other content produced on behalf of PPN or the USER personally. Read this section before writing anything public-facing.]

### Tone
*   **Conversational but precise.** Write like an intelligent person talking to another intelligent person. Not like a brochure. Not like a legal brief.
*   **Direct and confident.** State things clearly. Do not hedge excessively.
*   **Professional, not corporate.** Avoid buzzwords, consultant-speak, and filler phrases.

### Style Rules
*   **No em dashes.** Hard prohibition. Use a comma, period, colon, or restructure the sentence instead.
*   **No excessive exclamation points.** One per document maximum, only when genuinely warranted.
*   **No ALL CAPS for emphasis** in body copy. Use bold sparingly instead.
*   **Short sentences preferred.** If a sentence has more than two clauses, break it up.
*   **Active voice** over passive. "We built it" not "It was built by us."
*   **Numbers under ten are spelled out** in body copy (e.g., "three" not "3"), unless in a stat, table, or technical context.
*   **Contractions are fine.** They read more naturally in most contexts.

### Prohibited Words and Phrases — General
*   "Leverage" (use "use" or "apply")
*   "Utilize" (use "use")
*   "Unlock" as a metaphor for accessing a feature
*   "Seamless" / "seamlessly"
*   "Game-changing" / "revolutionary" / "groundbreaking"
*   "Best-in-class"
*   "Robust" (unless describing technical architecture specifically)
*   "Synergy" / "synergize"
*   "Deep dive" as a verb
*   "Journey" as a customer experience metaphor
*   Rhetorical questions as section or website headers
*   Filler sign-offs ("Hope this helps!", "Feel free to reach out!")

### Prohibited Words and Phrases — Market Sensitive (PUBLIC COPY ONLY)
[CONTEXT: The psychedelic therapy market distrusts big pharma and institutional medicine. These terms carry strong negative associations with practitioners in this space and must not appear in any public-facing copy, including the website, pricing pages, marketing, and social content. They may be used in internal documentation only.]
*   "Pharma" / "Pharmaceutical" — use "research" or "data licensing" if the concept must be referenced
*   "Institutional" — use "Enterprise" or omit entirely
*   "Clinical trial" language implying we are a research sponsor (we are not)
*   Any language implying practitioners are subjects rather than professionals

### Tier and Product Naming (Approved)
*   Free tier: **Protocol Access**
*   Core paid tier: **Clinic OS**
*   Discounted rate within Clinic OS: **Research Partner Rate** ($49/mo with data contribution)
*   Data-sharing program collective: **Research Alliance**
*   Enterprise tier: **Enterprise** ($999+/site/mo, contact sales)
*   Data licensing (internal/sales only, NOT public-facing): formerly "Pharma Partner" — refer to as "Data Licensing Partnership" in internal docs only

### Format by Content Type
*   **Memos:** Header block (To, From, Re, Date), short opening paragraph, body in short paragraphs, optional one-line close. Bullets only when content is genuinely list-like.
*   **Website copy:** Lead with the user's problem or gain, not the product's feature list. Do not open a hero headline with "We."
*   **Work order narratives:** Plain and factual. State what is being done, why, and the success criteria. Not a sales pitch.
*   **UI microcopy:** Specific and action-oriented. "Request Access" not "Get Started." "Sign In" not "Login."

### USER Voice Notes
*   **[USER — fill this in]:** Add personal voice preferences, specific phrases you favor, or examples of writing you consider a strong reference.
*   **[USER — fill this in]:** Any additional terminology guidelines.
