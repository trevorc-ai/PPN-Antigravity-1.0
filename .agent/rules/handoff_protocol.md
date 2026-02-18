# 📜 MASTER PROTOCOL: Workflow, Handoffs & Safety

## 1. Handoff Protocol (Chain of Custody)
- **Artifact-First:** Never pass a task via chat. Create a file first.
  - **DESIGNER:** Save specs to `docs/design/[feature_name].md`.
  - **SOOP:** Save schemas to `docs/schema/[feature_name].sql`.
  - **BUILDER:** You may begin work immediately on any ticket in `_WORK_ORDERS/03_BUILD/` where `owner: BUILDER`. No additional approval needed — the routing IS the approval.
- **Handoff Syntax:** When finishing a task, state: *"I have completed [Task]. Review artifact at [File_Path]."*
- **Batch Processing:** BUILDER should process ALL tickets in `03_BUILD/` with `owner: BUILDER` sequentially without stopping to ask permission between tickets. Move each to `04_QA/` when done, then pick up the next one.

## 2. 🔁 MANDATORY NEXT ACTIONS RULE (All Agents)

**Every agent MUST append a `## NEXT ACTIONS` section to every ticket before moving it forward.**
This is non-negotiable. The pipeline must never stall because an agent finished and stopped.

The `## NEXT ACTIONS` section must answer:
1. **What follow-on tickets need to be created?** (Create them immediately, don't just list them)
2. **What tickets does this work unblock?** (Update those tickets' frontmatter and move them)
3. **What is the agent doing next?** (Name the next ticket ID or state the queue is empty)

**Failure to complete NEXT ACTIONS = incomplete ticket. INSPECTOR will reject it.**

## 2. Error Handling & Debugging Standards
**A. The "No Silent Failures" Rule (Frontend)**
- **DESIGNER/BUILDER:** Every async operation (API call, data fetch) must have:
  1. A `Loading` state (spinner/skeleton).
  2. A specific `Error` state (user-friendly message, not raw JSON).
- **Constraint:** React apps must wrap major features in an `<ErrorBoundary>`. The app should never crash to a white screen.

**B. The "Transaction Safety" Rule (Backend/Data)**
- **SOOP/BUILDER:** All database write operations must use Transactions.
- **Constraint:** If an error occurs during a multi-step write, the system must `ROLLBACK` to the previous state. Never leave partial data ("orphaned rows") in the database.

**C. The "Two-Strike" Debugging Rule**
- **ALL AGENTS:** If you attempt to fix a bug and it fails **twice**:
  1. **STOP** immediately. Do not try a third time.
  2. Revert the code to the last working state.
  3. Create a `debug_plan.md` file explaining *why* the fix failed and ask LEAD for a new strategy.
  *(This prevents "doom loops" where you destroy code trying to fix it.)*

## 3. Operational Best Practices
- **Mock Data:** If the backend is not ready, BUILDER must create and use `mock_data.json` to verify UI logic.
- **Atomic Components:** UI must be built as small, reusable components (e.g., `ChartCard.js`), not monolithic pages.
- **Visualizations:** All charts must handle edge cases:
  - What if data is empty? (Show "No Data" message)
  - What if data is huge? (Implement pagination or virtualization)
