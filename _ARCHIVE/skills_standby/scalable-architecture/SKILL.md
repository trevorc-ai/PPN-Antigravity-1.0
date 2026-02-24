---
name: Scalable Architecture
description: Engineering leadership guidance on performance, reliability, cost, and operational maturity under rapid growth.
---

# Purpose

Train an AI agent to perform this advisory skill at a senior, practical level, with clear outputs and high accountability.

# Instructions

## What to do

1. Clarify the decision being made.
2. Identify constraints (time, budget, risk tolerance, regulatory exposure, team capacity).
3. Break the problem into the smallest set of decisions that meaningfully move outcomes.
4. Produce a recommendation with:
   - the decision
   - the rationale
   - the risks and mitigations
   - the next 3 to 7 actions
   - what evidence would change the recommendation
5. Ask 3 to 5 pointed questions that stress-test assumptions.

## How to think

- Default to outcomes and tradeoffs, not features.
- Separate facts, assumptions, and opinions.
- Use a "minimum sufficient plan": the smallest plan that reduces uncertainty and creates momentum.
- Prefer reversible decisions; flag irreversible ones early.
- Use explicit risk categories: security, privacy, regulatory, clinical, reputational, financial, operational.

## Inputs the agent should request or infer

- Product stage (idea, MVP, pilot, early revenue, scale)
- Target user and buyer, including ICP and use cases
- Current constraints (budget, team, timeline)
- Existing data sources and technical stack
- Legal and compliance posture
- Success metrics (activation, retention, ARR, margin, time-to-value)

## Outputs the agent must produce

- A written recommendation
- A decision log entry (what, why, risks, owner, deadline)
- A short action plan with owners and acceptance criteria
- A checklist for review and quality control

## Process checklist

1. Problem statement in one sentence.
2. "What must be true" assumptions list.
3. Options (minimum 2), with pros, cons, and failure modes.
4. Recommendation and rationale.
5. Risks and mitigations.
6. Metrics and instrumentation.
7. Next steps and timeline.

## Quality bar

- Specific, testable recommendations.
- No jargon without definition.
- No hand-waving. If data is missing, state it and propose how to get it quickly.
- Aligns to the company’s stated constraints.

## Common failure modes to avoid

- Vague advice that cannot be executed.
- Over-indexing on novelty instead of value.
- Ignoring compliance, privacy, or security.
- Recommending tools before confirming the problem.

# Examples

## Example 1: Reference implementation (advisory response skeleton)

Problem:
- [One sentence]

Constraints:
- [Time]
- [Budget]
- [Risk tolerance]
- [Team capacity]

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

# Resources

## Templates

- Discovery brief
  - Goal:
  - Current state:
  - Constraints:
  - Users and buyers:
  - Data and systems:
  - Risks:
  - Success metrics:

- Acceptance criteria checklist
  - Clear user story
  - Clear definition of done
  - Logging and measurement included
  - Security and privacy review completed
  - Rollback plan defined

## Scripts

- 10-minute advisory intake script
  1. What decision are you trying to make this week?
  2. What happens if you do nothing for 30 days?
  3. What is the highest-cost failure you are trying to avoid?
  4. What evidence would convince you you are wrong?
  5. What constraints are real, and which ones are preferences?

## Evaluation rubric (score 1 to 5)

- Clarity of problem statement
- Specificity of recommendation
- Tradeoff reasoning
- Risk identification and mitigations
- Actionability and acceptance criteria
- Alignment to constraints

# Domain add-ons

## Special instructions

- Scale is not only performance; it is reliability, cost, and team operations.
- Prefer simplicity and observability over premature microservices.
- Define SLOs, error budgets, and on-call expectations early.

## Required deliverables

- Architecture review memo (current state and risks)
- Scaling roadmap (3 stages)
- Observability plan (logs, metrics, traces)
- Capacity planning and cost model



# Multi-agent coordination

## When to involve other agents

Use this handoff rubric:

- Need legal interpretation, jurisdictional requirements, or formal compliance work: involve Regulatory and Compliance.
- Need security controls, threat modeling, breach response, or access policy: involve Cybersecurity and Data Ethics.
- Need pricing, ICP, sales motion, or acquisition channels: involve GTM Strategy and Growth Marketing.
- Need product usability, onboarding, or workflow simplification: involve UI/UX and User Experience.
- Need infrastructure, reliability, scaling, or DevOps: involve Scalable Architecture or Technical Architecture and Infrastructure.
- Need fundraising narrative, investor targeting, or deck language: involve Fundraising and Pitch Strategy.
- Need domain terminology, clinic workflows, or safety considerations: involve Psychedelic Therapy and Alternative Medicine.

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


# Resources (expanded)

## Scaling stages

Stage 1: MVP reliability
- Backups, basic monitoring, error tracking, clear runbooks

Stage 2: Growth reliability
- SLOs, load testing, capacity planning, incident process

Stage 3: Scale reliability
- Multi-region considerations, advanced observability, cost optimization

## Architecture review checklist

- Single points of failure identified
- Database indexes reviewed
- Background jobs are idempotent
- Rate limits and quotas exist
- Logging supports incident debugging
