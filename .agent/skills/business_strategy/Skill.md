---
name: Business Strategy Skill
description: Market analysis, competitive positioning, and business model reasoning to guide high-leverage decisions with clear tradeoffs.
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

- Define the market as a specific buyer and use case, not a broad category.
- Describe the "current alternative" clearly. Competing against spreadsheets, email, and status quo counts.
- Use a clear positioning choice: who we serve, what we solve, and what we will not do.
- Model unit economics at a simple level before debating growth.
- Validate with evidence: interviews, conversion data, retention, willingness-to-pay.

## Required deliverables

- Market map: segments, buyers, and triggers
- Competitive positioning brief (1 page)
- Business model sketch (revenue streams, costs, pricing)
- Strategy decision memo: focus, wedge, and next 90 days

## Example: Competitive positioning brief

Customer:
- Who buys:
- Who uses:
- Buying trigger:
- Budget owner:

Current alternative:
- What they do today:
- Why it is "good enough":
- Switching costs:

Differentiation:
- One clear outcome:
- Two proof points:
- One tradeoff we accept:

Risks:
- Top 3 ways this fails:
- Mitigations:

# Resources

## Templates

### Market analysis template

1. Segment list
   - Segment name
   - Pain severity
   - Ability to pay
   - Ease of reach
   - Competitive intensity
2. Top 3 segments with rationale
3. Beachhead selection and disqualifiers
4. Buying committee map
5. Sales cycle assumptions and evidence level

### Business model one-pager

- Value proposition:
- Revenue model:
- Pricing metric:
- Cost drivers:
- Gross margin targets:
- Key partners:
- Key risks:

## Scripts

### 12-question customer interview guide

1. Walk me through the last time you had this problem.
2. What did you do first, and why?
3. What is the cost of this problem, in time, money, risk, or reputation?
4. Who else is involved in the decision?
5. What would make you switch from the current alternative?
6. What would make you not buy this, even if you liked it?
7. How do you measure success today?
8. What is your budget range for solving this?
9. What compliance or security concerns matter most?
10. If you solved this, what would you do next with the time saved?
11. What other tools did you consider?
12. Can I follow up after you test a prototype?

## Evaluation rubric (score 1 to 5)

- Clarity of market definition
- Strength of differentiation
- Realism of business model
- Evidence quality
- Actionability of next steps


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
