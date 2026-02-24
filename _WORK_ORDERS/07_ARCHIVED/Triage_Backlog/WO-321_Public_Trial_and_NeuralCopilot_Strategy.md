---
status: "01_TRIAGE"
owner: "LEAD"
failure_count: 0
---

# WO-321: Pre-Seeded Trial Flow & Public NeuralCopilot Lead Magnet

## User Prompt & Strategy Motivation
"I need everyone who signs up on the site to have a test set to play with... This may change in the future, but for right now everybody who sees the Site is invited and when we decide we're gonna turn the testing off, just let people know... "

*(Note: "neurosurgeon" refers to NeuralCopilot).*

## PRODDY STRATEGY: "Interactive Validation"
We are moving away from passive landing pages and into interactive product validation. If a user signs up and sees an empty dashboard with no data, they won't understand the value of the analytics. If they land on the homepage and just read copy, they won't feel the power of the platform.

### Phase 1: Pre-Seeded Anonymous Cohorts (The "Zero Empty States" Onboarding)
When a user signs up, their workspace should immediately be populated with a rich, anonymized baseline dataset.
1. **The Data Injection:** Instead of a complex "Test Data" label that feels fake, we simply label it **"Global Baseline Cohort (N=200)"**.
2. **The Experience:** The moment they log in, the Analytics Dashboard, Safety Matrices, and My Protocols list are alive. They see real-looking (but synthetic) Subject IDs, outcomes trajectories, and contraindication flags.
3. **The Pivot to Activation:** When they try to edit a baseline protocol or add their own patient, a modal appears: *"You are exploring the Global Baseline Cohort. To start logging your own patients and securely comparing them against the network, activate your clinic's Phantom Shield node."*
4. **Execution for BUILDER/SOOP:** Create a Supabase user trigger or frontend script that associates new sign-ups with a read-only 'Demo Dataset' ID alongside their empty live workspace, cleanly separating the data so their metrics are immediately populated.

### Phase 2: NeuralCopilot as a Public Lead Magnet (The "Listening Matrix")
We will expose the `NeuralCopilot` component to the public, unrestricted, on a dedicated landing page route (e.g., `/intelligence` or `ppnportal.com/copilot`).
1. **The Hook:** "Query the Psychedelic Clinical Intelligence Edge. Ask a protocol question, check an interaction, or explore the research."
2. **The Predictive Value (Gold):** Every single query typed into that public box by a practitioner is a raw signal of market anxiety and intent. *"Is Ketamine safe with Lithium?"*, *"What's the best dose for PTSD?"*. We will silently log these anonymized query strings to a Supabase table (`public_queries`). This becomes our roadmap for future Deep Dives and SEO-optimized content marketing.
3. **The Viral Gate:** The user asks a question, NeuralCopilot provides a high-value answer with its terminal HUD UI. After 3 queries, the HUD locks: *"Query limit reached. Create your free clinic node to access unlimited Clinical Intelligence."*
4. **Execution for LEAD:** Architect a public route that houses the `NeuralCopilot` component. We must wrap the Gemini API call securely so it's not abused, rate-limit it by IP, and hook it up to a new analytics table for PRODDY/MARKETER to mine later.

## HANDOFF
Strategy complete. Handing off to LEAD to architect the database implementation for the pre-seeded cohort and the secure public route for the NeuralCopilot.
