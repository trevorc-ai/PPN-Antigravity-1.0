# Work Order System Protocol

**Version:** 1.0  
**Last Updated:** 2026-02-13  
**Mandatory Reading:** ALL agents must read this on EVERY new chat session

---

## 🎯 Purpose

This protocol ensures **chain of custody** for all tasks. No work happens without a ticket. No tickets get lost. Context is preserved across chat sessions.

---

## 📋 Status Values

Every work order MUST have a status header as the first line:

| Status | Meaning | Who Acts |
|--------|---------|----------|
| `STATUS: LEAD_PLANNING` | LEAD is creating the work order | LEAD |
| `STATUS: DESIGNER_PENDING` | Waiting for DESIGNER to pick up | DESIGNER |
| `STATUS: DESIGNER_WORKING` | DESIGNER is actively working | DESIGNER |
| `STATUS: LEAD_REVIEW` | LEAD is reviewing design/plan | LEAD |
| `STATUS: BUILDER_READY` | Approved, ready for implementation | BUILDER |
| `STATUS: BUILDER_WORKING` | BUILDER is actively implementing | BUILDER |
| `STATUS: SOOP_PENDING` | Waiting for database work | SOOP |
| `STATUS: SOOP_WORKING` | SOOP is working on schema/queries | SOOP |
| `STATUS: COMPLETED_NOTIFY_USER` | Work complete, awaiting user review | LEAD |
| `STATUS: USER_APPROVED` | User has approved, can be archived | LEAD |
| `STATUS: ARCHIVED` | Completed and archived | N/A |

---

## 🔄 Workflow Chain

```
USER → LEAD → DESIGNER → LEAD (QA) → BUILDER → USER
                ↓
              SOOP (parallel, as needed)
```

---

## 📝 Agent Responsibilities

### LEAD (Project Manager)
- **Create tickets** for all new features/fixes
- **Review** DESIGNER and SOOP work
- **Approve** work orders before BUILDER starts
- **Monitor** for `COMPLETED_NOTIFY_USER` status
- **Notify user** when work is complete

### DESIGNER (UI/UX)
- **Check** for `STATUS: DESIGNER_PENDING` on startup
- **Create** mockups, specs, and design artifacts
- **Update** to `STATUS: LEAD_REVIEW` when done
- **Document** design decisions in the ticket

### SOOP (Database)
- **Check** for `STATUS: SOOP_PENDING` on startup
- **Create** migration files and schema updates
- **Update** to `STATUS: LEAD_REVIEW` when done
- **Document** schema decisions in the ticket

### BUILDER (Implementation)
- **Check** for `STATUS: BUILDER_READY` on startup
- **Implement** code based on approved specs
- **Update** to `STATUS: COMPLETED_NOTIFY_USER` when done
- **Document** files modified and testing results

---

## 🚀 Startup Checklist (MANDATORY)

Run this checklist on **EVERY new chat session**:

1. ✅ Read this file: `.antigravity/work_orders/PROTOCOL.md`
2. ✅ List all work orders: `ls -lt .antigravity/work_orders/WO-*.md`
3. ✅ Check for tickets assigned to you:
   ```bash
   grep -l "STATUS: [YOUR_NAME]_PENDING" .antigravity/work_orders/WO-*.md
   ```
4. ✅ If found, read the ticket and continue the work
5. ✅ If none, wait for user instructions or LEAD assignment

---

## 📄 Work Order Template

**File naming:** `WO-{NUMBER}_{FEATURE_NAME}.md`

**Example:** `WO-001_Chart_Legends.md`

**Minimum required sections:**
```markdown
STATUS: [CURRENT_STATUS]

---

# Work Order: [Feature Name]

**WO Number:** WO-XXX  
**Created:** YYYY-MM-DD  
**Priority:** P0/P1/P2  
**Assigned To:** [Agent Name]

## Requirements
[Clear requirements from LEAD]

## Design Phase (if applicable)
[DESIGNER notes and links to mockups]

## Implementation Phase
[BUILDER notes and files modified]

## Completion
[Verification evidence and user approval]
```

---

## 🚫 Forbidden Actions

1. **NO VERBAL HANDOFFS** - Never say "I'm done, BUILDER can start now" in chat
2. **NO SKIPPING TICKETS** - Every task needs a work order
3. **NO STATUS GUESSING** - Only work on tickets explicitly assigned to you
4. **NO INCOMPLETE TICKETS** - Always document your work before changing status

---

## ✅ Best Practices

1. **Update status immediately** when you start working
2. **Document everything** in the ticket (decisions, blockers, questions)
3. **Link to artifacts** (mockups, screenshots, recordings)
4. **Add timestamps** when updating sections
5. **Ask questions in the ticket** if requirements are unclear

---

## 🔍 Example Workflow

### Step 1: LEAD Creates Ticket
```markdown
STATUS: DESIGNER_PENDING

# Work Order: Add Chart Legends

**WO Number:** WO-016  
**Created:** 2026-02-13  
**Priority:** P1  

## Requirements
- Add legends to all analytics charts
- Use colorblind-safe palette
- Interactive tooltips on hover
```

### Step 2: DESIGNER Picks Up
```bash
# On startup, DESIGNER runs:
grep -l "STATUS: DESIGNER_PENDING" .antigravity/work_orders/WO-*.md
# Finds: WO-016_Chart_Legends.md
```

DESIGNER updates ticket:
```markdown
STATUS: DESIGNER_WORKING
```

### Step 3: DESIGNER Completes
DESIGNER adds notes and updates:
```markdown
STATUS: LEAD_REVIEW

## Design Phase
Created mockups: /brain/chart_legend_mockup.png
Used Viridis palette (colorblind-safe)
Completed: 2026-02-13 23:00
```

### Step 4: LEAD Reviews
LEAD checks ticket, approves, updates:
```markdown
STATUS: BUILDER_READY

## LEAD Review
✅ Approved - Design meets requirements
Proceed with implementation
```

### Step 5: BUILDER Implements
BUILDER finds ticket, implements, updates:
```markdown
STATUS: COMPLETED_NOTIFY_USER

## Implementation
Files modified:
- src/components/charts/BarChart.tsx
- src/components/charts/LineChart.tsx

Testing: ✅ All charts render correctly
Browser: ✅ No console errors
```

### Step 6: LEAD Notifies User
LEAD sees `COMPLETED_NOTIFY_USER`, notifies user, updates:
```markdown
STATUS: USER_APPROVED

## Completion
User approved: 2026-02-13 23:30
Ready to archive
```

---

## 🆘 Troubleshooting

**Q: I started a new chat and don't know what to work on**  
A: Run the startup checklist. Check for tickets with your name.

**Q: The ticket requirements are unclear**  
A: Add a question in the ticket and set status to `STATUS: LEAD_REVIEW`

**Q: I found a bug while working**  
A: Document it in the ticket. If critical, create a new P0 work order.

**Q: Multiple agents need to work on this**  
A: LEAD creates separate work orders or adds parallel sections to one ticket.

---

**This protocol is MANDATORY. No exceptions.**
