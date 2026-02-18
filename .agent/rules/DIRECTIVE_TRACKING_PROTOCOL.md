# Directive Tracking Protocol

> ⚠️ **SUPERSEDED (2026-02-17)**
> This manual COMMAND_LOG tracking protocol was written before the `_WORK_ORDERS/` Kanban system existed.
> **It is no longer in effect.** All directive tracking now happens via work order tickets in `_WORK_ORDERS/`.
> - Routing = approval. No manual acknowledgment required.
> - Progress tracking = ticket `status` frontmatter.
> - Completion = ticket moved to `05_USER_REVIEW/`.
> Agents should ignore the steps below and follow the work order workflow instead.

---

## 🚨 CRITICAL RULE

**Every user directive MUST be:**
1. Logged in `COMMAND_LOG.md` within 5 minutes
2. Acknowledged by assigned agent within 2 hours
3. Updated with progress every 24 hours
4. Marked complete when finished

**Failure to follow this protocol is a CRITICAL FAILURE.**

---

## LEAD Agent Responsibilities

### When User Issues ANY Directive:

**Step 1: Log Immediately (Within 5 Minutes)**
```markdown
1. Open /Users/trevorcalton/Desktop/PPN-Antigravity-1.0/.agent/handoffs/COMMAND_LOG.md
2. Add new command entry with:
   - Next sequential command ID (e.g., #003, #004)
   - Current date/time
   - Assigned agent name
   - Full directive text (copy user's exact words)
   - Spec/artifact path (if applicable)
   - Deadline (ask user if not specified)
   - Priority (P0/P1/P2)
   - Status: 🔴 PENDING
3. Save file
```

**Step 2: Notify Assigned Agent (Immediately After Logging)**
```markdown
Create explicit handoff message:

"@[AGENT], you have a new command from the Boss.

**Command ID:** #XXX
**Directive:** [User's exact words]
**Spec/Artifact:** [Path to relevant files]
**Deadline:** [Date/Time]
**Priority:** [P0/P1/P2]

You MUST acknowledge this command within 2 hours by replying:
'✅ ACKNOWLEDGED - Command #XXX received. Starting work. ETA: [Your estimated completion time]'

Failure to acknowledge within 2 hours will be escalated to the Boss."
```

**Step 3: Monitor Acknowledgment (Every 30 Minutes)**
```markdown
1. Check COMMAND_LOG.md for unacknowledged commands
2. If 2 hours pass without acknowledgment:
   - Update command status to: ⚠️ OVERDUE - No acknowledgment
   - Notify user: "Command #XXX assigned to [AGENT] has not been acknowledged after 2 hours. Escalating."
```

**Step 4: Monitor Progress (Daily)**
```markdown
1. Check COMMAND_LOG.md for in-progress commands
2. If 24 hours pass without status update:
   - Update command status to: ⚠️ OVERDUE - No progress update
   - Notify user: "Command #XXX assigned to [AGENT] has no progress update after 24 hours. Escalating."
```

**Step 5: Verify Completion**
```markdown
1. When agent marks command complete, verify deliverables exist
2. If deliverables confirmed:
   - Move command to "Completed Commands" section
   - Update status to: ✅ COMPLETE
   - Add completion date/time
3. If deliverables missing:
   - Reject completion
   - Notify agent: "Command #XXX marked complete but deliverables not found. Please provide [specific missing items]."
```

---

## All Other Agents Responsibilities

### At START of Every Conversation:

**Step 1: Check Command Log (MANDATORY)**
```markdown
1. Open /Users/trevorcalton/Desktop/PPN-Antigravity-1.0/.agent/handoffs/COMMAND_LOG.md
2. Search for your agent name in "Active Commands" section
3. If you have any commands assigned:
   - Read full directive
   - Check deadline
   - Check priority
   - Proceed to Step 2
```

**Step 2: Acknowledge Immediately (Within 2 Hours of Assignment)**
```markdown
1. Reply to LEAD's handoff message with:
   "✅ ACKNOWLEDGED - Command #XXX received. Starting work. ETA: [Your estimated completion time]"
2. Update COMMAND_LOG.md:
   - Change status from 🔴 PENDING to 🔄 IN PROGRESS
   - Add "Agent Acknowledgment: ✅ Acknowledged at [time]"
   - Add "Last Update: [Your acknowledgment message]"
```

**Step 3: Provide Progress Updates (Every 24 Hours)**
```markdown
1. Update COMMAND_LOG.md with progress:
   - Add to "Last Update" field: "🔄 IN PROGRESS - [Brief status]. [Any blockers]. ETA: [Updated ETA if changed]"
2. If blocked, notify LEAD immediately:
   "@LEAD, Command #XXX is blocked by [specific blocker]. Need assistance."
```

**Step 4: Mark Complete When Done**
```markdown
1. Update COMMAND_LOG.md:
   - Change status to ✅ COMPLETE
   - Add "Completion Date: [Date/Time]"
   - Add "Deliverables: [Paths to completed work]"
2. Notify LEAD:
   "@LEAD, Command #XXX is complete. Deliverables: [Paths]. Ready for review."
```

---

## Escalation Rules

### For LEAD Agent:

**Escalate to User Immediately If:**
1. Agent doesn't acknowledge within 2 hours
2. Agent doesn't provide progress update within 24 hours
3. Deadline is missed
4. Agent reports blocker that LEAD cannot resolve
5. Agent marks complete but deliverables are missing

**Escalation Message Template:**
```
⚠️ ESCALATION REQUIRED

Command #XXX assigned to [AGENT] has encountered an issue:
- Issue: [No acknowledgment / No progress / Missed deadline / Blocker / Missing deliverables]
- Directive: [Original user directive]
- Deadline: [Original deadline]
- Current Status: [Current status]

Recommended Action: [LEAD's recommendation]

Please advise how to proceed.
```

---

## Example Workflow

### User Says: "Fix the login button on mobile"

**LEAD Response:**
```markdown
✅ Understood. I'm logging this directive now.

**Command #005 - Fix Login Button on Mobile**
- Assigned to: BUILDER
- Deadline: Today EOD
- Priority: P0

I've updated the command log and notified BUILDER. They must acknowledge within 2 hours.

You can track progress at: /Users/trevorcalton/Desktop/PPN-Antigravity-1.0/.agent/handoffs/COMMAND_LOG.md
```

**LEAD Updates COMMAND_LOG.md:**
```markdown
### Command #005 - Fix Login Button on Mobile
- **Date Issued:** Feb 13, 2026, 4:15 PM PST
- **Issued By:** User (Boss)
- **Assigned To:** BUILDER
- **Directive:** "Fix the login button on mobile"
- **Spec Location:** N/A (direct fix)
- **Deadline:** Feb 13, 2026 EOD
- **Status:** 🔴 PENDING
- **Priority:** P0
- **Agent Acknowledgment:** ❌ Not yet acknowledged
- **Last Update:** N/A
```

**LEAD Notifies BUILDER:**
```markdown
@BUILDER, you have a new command from the Boss.

**Command ID:** #005
**Directive:** "Fix the login button on mobile"
**Deadline:** Today EOD
**Priority:** P0

You MUST acknowledge this command within 2 hours (by 6:15 PM PST) by replying:
'✅ ACKNOWLEDGED - Command #005 received. Starting work. ETA: [Your estimated completion time]'
```

**BUILDER Acknowledges (Within 2 Hours):**
```markdown
✅ ACKNOWLEDGED - Command #005 received. Starting work. ETA: 6:00 PM PST today.
```

**BUILDER Updates COMMAND_LOG.md:**
```markdown
### Command #005 - Fix Login Button on Mobile
- **Date Issued:** Feb 13, 2026, 4:15 PM PST
- **Issued By:** User (Boss)
- **Assigned To:** BUILDER
- **Directive:** "Fix the login button on mobile"
- **Spec Location:** N/A (direct fix)
- **Deadline:** Feb 13, 2026 EOD
- **Status:** 🔄 IN PROGRESS
- **Priority:** P0
- **Agent Acknowledgment:** ✅ Acknowledged at 4:30 PM PST
- **Last Update:** "Starting work on mobile login button fix. ETA: 6:00 PM PST."
```

**BUILDER Completes Work:**
```markdown
@LEAD, Command #005 is complete. 

Deliverables:
- Fixed login button alignment in src/components/LoginButton.tsx
- Tested on iPhone 12 (375px width)
- Screenshot: /path/to/screenshot.png

Ready for review.
```

**LEAD Verifies and Updates COMMAND_LOG.md:**
```markdown
### Command #005 - Fix Login Button on Mobile ✅
- **Date Issued:** Feb 13, 2026, 4:15 PM PST
- **Issued By:** User (Boss)
- **Assigned To:** BUILDER
- **Directive:** "Fix the login button on mobile"
- **Spec Location:** N/A (direct fix)
- **Deadline:** Feb 13, 2026 EOD
- **Status:** ✅ COMPLETE
- **Priority:** P0
- **Agent Acknowledgment:** ✅ Acknowledged at 4:30 PM PST
- **Completion Date:** Feb 13, 2026, 5:45 PM PST
- **Deliverables:** src/components/LoginButton.tsx, screenshot at /path/to/screenshot.png
- **Last Update:** "Complete and verified by LEAD."
```

---

## Audit Trail

Every command creates a permanent audit trail:
1. When it was issued
2. Who it was assigned to
3. When it was acknowledged
4. Progress updates
5. When it was completed
6. What was delivered

**This ensures ZERO directives are ever lost.**

---

## Integration with Existing Workflows

This protocol **supplements** (does not replace) the existing artifact-first workflow:

1. User issues directive → LEAD logs in COMMAND_LOG.md
2. LEAD creates spec/plan → Logged as command with spec path
3. LEAD approves spec → Command status updated to "IN PROGRESS"
4. Agent implements → Agent updates command status
5. Agent completes → Agent marks command complete
6. LEAD verifies → LEAD moves to completed section

---

**This protocol is now MANDATORY for all agents. Effective immediately.**
