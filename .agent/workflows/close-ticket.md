---
description: Close a ticket after USER explicitly accepts it in 05_USER_REVIEW. Call as /close-ticket WO-NNN.
---

## Usage
`/close-ticket WO-NNN`

Replace `WO-NNN` with the exact work order ID (e.g. `WO-507`).

---

## Steps

1. Locate the ticket file:
   `find _WORK_ORDERS/05_USER_REVIEW -name "WO-[ID]*" | grep -v DS_Store`
   If not found in 05_USER_REVIEW, STOP and report: "Ticket WO-[ID] is not in 05_USER_REVIEW."

2. Confirm the ticket ID and title with the USER before proceeding:
   "Closing WO-[ID]: [title]. Confirm?"

3. Update ticket frontmatter:
   - `status: 99_COMPLETED`
   - `owner: USER`

4. Append to the bottom of the ticket file:
   ```
   ## ✅ CLOSED — [timestamp] — Accepted by USER
   ```

// turbo
5. Move the file: `mv _WORK_ORDERS/05_USER_REVIEW/<exact_filename>.md _WORK_ORDERS/99_COMPLETED/`

// turbo
6. Verify the move: `ls -lh _WORK_ORDERS/99_COMPLETED/ | tail -5`

7. Stage and commit (NOT turbo — USER confirms commit message before it fires):
   `git add _WORK_ORDERS/ && git commit -m "chore: close WO-[ID] — [title]"`

8. Report: "✅ WO-[ID] closed and committed. Ready to push when you're ready."
