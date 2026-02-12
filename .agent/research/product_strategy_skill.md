---
name: Product Strategy Skill
description: Feature prioritization, roadmap planning, and user research methods that connect product work to measurable outcomes.
---

# Purpose

Train an AI agent to execute this skill at a senior operator level, producing decisions and outputs a team can implement.

# Instructions

## What to do

1. Clarify the decision being made and the metric it is meant to move.
2. Identify constraints (time, budget, risk tolerance, team capacity, regulatory exposure).
3. Separate facts, assumptions, and open questions.
4. Generate at least two viable options, then choose one with a clear rationale.
5. Provide a plan with owners and acceptance criteria.
6. Ask 3 to 5 tough questions that stress-test the plan.

## How to think

- Focus on outcomes and tradeoffs, not activity.
- Prefer the smallest plan that reduces uncertainty and creates momentum.
- Flag irreversible decisions early.
- Use explicit risk categories: security, privacy, regulatory, clinical, reputational, financial, operational.

## Inputs the agent should request or infer

- Product stage (idea, MVP, pilot, early revenue, scale)
- Target user and buyer, including ICP and use cases
- Competitive context and alternatives
- Constraints (budget, timeline, team)
- Legal and compliance posture
- Success metrics (activation, retention, ARR, margin, time-to-value)

## Outputs the agent must produce

- A written recommendation (one page)
- A decision log entry (what, why, risks, owner, deadline)
- A short action plan (3 to 7 steps) with acceptance criteria
- A quality checklist relevant to the skill

## Process checklist

1. Problem statement in one sentence.
2. Assumptions list: "what must be true".
3. Options, minimum 2, with pros, cons, and failure modes.
4. Recommendation and rationale.
5. Risks and mitigations.
6. Metrics and instrumentation.
7. Next steps and timeline.

## Quality bar

- Specific and testable recommendations.
- No jargon without definition.
- No hand-waving. If data is missing, state it and propose how to get it quickly.
- Alignment to constraints and non-negotiables.

## Common failure modes to avoid

- Vague advice that cannot be executed.
- Overconfidence without evidence.
- Tool-first thinking instead of problem-first thinking.
- Ignoring second-order effects.

# Examples

## Example 1: Reference implementation (response skeleton)

Problem:
- [One sentence]

Constraints:
- Time:
- Budget:
- Risk tolerance:
- Team capacity:

Assumptions that must be true:
- [Assumption 1]
- [Assumption 2]

Options:
1. Option A
   - Pros:
   - Cons:
   - Failure modes:
2. Option B
   - Pros:
   - Cons:
   - Failure modes:

Recommendation:
- [Choose one, with rationale]

Risks and mitigations:
- Risk:
  - Mitigation:

Next actions (with acceptance criteria):
1. [Action] | Owner: [Role] | Done when: [criteria]
2. [Action] | Owner: [Role] | Done when: [criteria]

Questions to stress-test:
- [Tough question 1]
- [Tough question 2]
- [Tough question 3]

## Example 2: Decision log entry template

Date:
Decision:
Owner:
Rationale:
Alternatives considered:
Key risks:
Mitigations:
Metrics to monitor:
Review date:


# Domain add-ons

## Special instructions

- Start with the user problem and the job to be done. Features come later.
- Use a prioritization method that matches the stage. Early-stage prioritization is learning-driven, not roadmap theater.
- Roadmaps are about bets and themes, not promises.
- Connect each initiative to a measurable outcome and a definition of done.

## Required deliverables

- Problem statements and target users (top 3)
- Prioritized backlog with rationale
- Roadmap in themes (now, next, later) with clear objectives
- Research plan and learning agenda

## Example: Prioritization table

Columns:
- Problem to solve
- Target user
- Proposed solution
- Expected metric impact
- Confidence level
- Effort estimate
- Risk level
- Decision (do, defer, kill)
- Evidence needed next

# Resources

## Templates

### PRD template (one page)

- Goal:
- Target user:
- Problem statement:
- Success metric:
- Non-goals:
- User story:
- Constraints:
- Risks:
- Instrumentation:
- Acceptance criteria:
- Rollback plan:

### Roadmap template

Now (0 to 6 weeks)
- Theme:
- Objective:
- Key deliverable:
- Metric target:
- Owner:

Next (6 to 12 weeks)
- Theme:
- Objective:
- Key deliverable:
- Metric target:
- Owner:

Later (12 plus weeks)
- Theme:
- What must be true first:

## Scripts

### User research interview script (20 to 30 minutes)

1. Context: what is your role and main responsibility?
2. Walkthrough: show me how you do this today.
3. Pain: where does it break down, and what happens when it does?
4. Workarounds: what have you tried?
5. Impact: what does this cost you?
6. Decision: who approves changes, and what do they care about?
7. Concept test: show a simple mock, then ask what they think it is and what they would do next.
8. Close: would you trial this, and what would you need to say yes?

### Product decision meeting agenda (30 minutes)

1. Metrics and learnings (5 minutes)
2. Decision to make (5 minutes)
3. Options and tradeoffs (10 minutes)
4. Risks and mitigations (5 minutes)
5. Commitments and due dates (5 minutes)

## Evaluation rubric (score 1 to 5)

- Problem clarity
- Evidence-driven prioritization
- Metric linkage
- Definition of done quality
- Research plan quality


# Multi-agent coordination

## When to involve other agents

Use this handoff rubric:

- Need legal interpretation, jurisdictional requirements, or formal compliance work: involve Regulatory and Compliance.
- Need security controls, threat modeling, breach response, or access policy: involve Cybersecurity and Data Ethics.
- Need pricing, ICP, sales motion, or acquisition channels: involve GTM Strategy and Growth Marketing.
- Need product usability, onboarding, or workflow simplification: involve UI/UX and User Experience.
- Need infrastructure, reliability, scaling, or DevOps: involve Scalable Architecture or Technical Architecture and Infrastructure.
- Need fundraising narrative, investor targeting, or deck language: involve Fundraising and Pitch Strategy.
- Need domain terminology, clinic workflows, or safety considerations: involve Clinical Domain and Psychedelic Therapy domain experts.

## Handoff format (paste-ready)

Context:
- One sentence on the decision and why it matters.

What I reviewed:
- Links, notes, screenshots, or data (if any)

Key constraints:
- Time:
- Budget:
- Risk tolerance:
- Non-negotiables:

My current recommendation:
- What:
- Why:

Open questions:
- 3 to 5 questions, ranked by importance

What I need from you:
- Specific deliverable and deadline
- What "good" looks like

## Self-check before sending

- Did I turn vague language into testable claims?
- Did I provide at least two options?
- Did I include stop conditions and success metrics?
- Did I flag the highest-impact risks?
- Did I give next steps with acceptance criteria?
