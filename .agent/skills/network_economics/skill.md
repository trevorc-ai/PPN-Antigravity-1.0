---
name: Network Economics Skill
description: Multi-sided platform dynamics, network effects, and pricing strategy to reach liquidity and capture value without breaking trust.
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

- Define the sides of the network and the value exchange for each side.
- Identify the chicken-and-egg problem and the chosen solution (seeding, single-player mode, partnerships).
- Model liquidity: when does the network become useful for each side?
- Pricing must align with value creation and avoid killing early growth.
- Governance is part of economics: trust, verification, quality, and abuse prevention.

## Required deliverables

- Network map (sides, roles, value flows)
- Liquidity plan (how we reach minimum viable activity)
- Pricing and incentive memo
- Metrics dashboard for network health

## Example: Network map

Side A:
- Who:
- Value they receive:
- Cost or friction:
- What they contribute:

Side B:
- Who:
- Value they receive:
- Cost or friction:
- What they contribute:

Value exchange:
- What flows between sides:
- Why it matters:

# Resources

## Templates

### Liquidity plan template

- Target geography or niche:
- Initial wedge use case:
- Seeding strategy:
- Verification and quality controls:
- Incentives:
- Stop conditions:
- Transition plan from manual to automated:

### Network health metrics template

- Active contributors per week
- Contribution quality rate (approved or useful)
- Match rate or consumption rate
- Time to first value
- Retention by side
- Same-side congestion signals (spam, low-quality)
- Cross-side elasticity indicators (does side A growth pull side B?)

## Scripts

### Pricing strategy working session (45 minutes)

1. Define pricing metric candidates (per seat, per site, per transaction, per report)
2. For each candidate, list:
   - alignment to value
   - risk of gaming
   - procurement fit
   - early-stage friction
3. Choose a primary metric and a simple first offer
4. Define discounting rules and guardrails
5. Define when pricing changes, based on usage and value evidence

## Evaluation rubric (score 1 to 5)

- Clarity of sides and value exchange
- Liquidity realism
- Incentive alignment
- Governance and trust design
- Pricing fit to adoption stage


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
