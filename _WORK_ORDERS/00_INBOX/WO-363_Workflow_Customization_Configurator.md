---
status: 00_INBOX
owner: PENDING
failure_count: 0
---

# 1. USER INTENT
I had another idea to simplify the users workflow. We could prompt them at the beginning of a new session to let them select which features they intend to use, and hide the rest. I don't know enough about the common standards across all psychedelic therapy. However, I am speculating that, for example, not everyone is taking vital sign readings (religious users) or using the same metrics. So instead of trying to do a one-size-fits-all, can we allow the user to customize their interface and choose which inputs and outputs they want to see. I'd like the same three perspectives as before, and recommendations.

# LEAD ARCHITECTURE
The user is requesting a dynamic, configuration-driven UI for the Wellness Journey ("Cockpit"). Instead of hardcoding all panels (e.g., Vitals, PHQ-9, AI Insights), we should provide a "Session Setup" or "Protocol Configurator" at the onset (Phase 1 or Global Settings). This config determines which `WorkflowActionCard` components render.

We need three perspectives:
1.  **Analyst:** Product, workflow, cognitive load, user journey.
2.  **Builder:** React state management, context/props passing, component modularity.
3.  **Inspector:** Data integrity, foreign keys, nullable fields vs expected data in reports.
