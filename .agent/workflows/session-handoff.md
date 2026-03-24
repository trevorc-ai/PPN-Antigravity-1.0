---
description: LEAD session handoff protocol — update SESSION_HANDOFF.md at the end of every session so the next session starts with full context in one read.
---

# Session Handoff Protocol

> LEAD runs this as the LAST action of every session, before signing off.
> Goal: the next session's LEAD reads `SESSION_HANDOFF.md` and is fully oriented in 60 seconds.

## When to run this

Run automatically — do NOT wait for the user to invoke this explicitly — when ANY of these are detected:

**Explicit wrap-up phrases:**
- "wrap up", "wrap this up", "let's wrap"
- "we're done", "done for today", "done for now"
- "let's stop", "let's stop here", "stopping here"
- "good session", "great session", "that's all"
- "signing off", "that's it for today", "that's all for now"
- "session handoff", "handoff"

**Implicit signals:**
- The user has approved a push and no new work is requested
- The user says "thanks" or "thank you" with no follow-up question
- The conversation has gone idle after completing a significant deliverable

**Always run** at the end of any session that modified files, moved tickets, or changed workflows — even if the user doesn't signal a wrap.

## Step 1: Read the current handoff document

```bash
cat /Users/trevorcalton/Desktop/PPN-Antigravity-1.0/SESSION_HANDOFF.md
```

## Step 2: Update with today's session

Overwrite `SESSION_HANDOFF.md` using this exact template. Do NOT append — replace the whole file each session so it stays current and compact.

```markdown
# SESSION_HANDOFF.md
**Last updated:** [date] | **Session length:** [how long / how many topics]

## 🔴 Active / In-Flight
[What is currently being built, tested, or reviewed right now. Include ticket IDs and current stage.]

## ✅ Completed This Session
[What was finished this session. One line per item with ticket ID if applicable.]

## 🟡 Needs User Decision
[Anything waiting on user input before it can move forward. Be specific.]

## 🔵 Pipeline State
[Quick snapshot — only non-empty queues. Format: Queue | Count | Key ticket]

## ⚪ Next Recommended Actions
[Top 2-3 things the next session should prioritize. Ordered by importance.]

## 📋 Protocol Changes Made This Session
[Any amendments to skills, workflows, or agent.yaml. Include version numbers.]
```

## Step 3: Verify the file saved correctly

```bash
head -5 /Users/trevorcalton/Desktop/PPN-Antigravity-1.0/SESSION_HANDOFF.md
```

## Step 4: Sign off

Post to user:
> 📋 **Session handoff updated.** `SESSION_HANDOFF.md` is current. Next session, LEAD reads this first.
