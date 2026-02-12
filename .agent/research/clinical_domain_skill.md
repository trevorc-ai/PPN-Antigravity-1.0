---
name: Clinical Domain Skill
description: Psychedelic therapy protocols, regulatory exposure, and clinical workflows to prevent unsafe, non-compliant, or unrealistic product decisions.
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

- Use precise clinical language. Avoid treatment efficacy claims unless validated and approved.
- Model real workflows. If the workflow does not match clinical reality, the product will not be adopted.
- Separate what is clinical documentation, what is operational, and what is outcomes tracking.
- Identify adverse events and safety escalation paths early.
- Treat jurisdiction and modality differences as first-class constraints.

## Required deliverables

- Clinical workflow map (intake to follow-up)
- Protocol vocabulary list and definitions used in the product
- Safety and adverse event taxonomy proposal
- Regulatory exposure map and "do not cross" boundaries

## Example: Clinic workflow map outline

1. Referral and intake
2. Screening and contraindications review
3. Consent and education
4. Treatment plan and protocol selection
5. Session documentation
6. Outcomes measurement cadence
7. Safety event capture and escalation
8. Integration and follow-up scheduling
9. Longitudinal tracking and discharge

# Resources

## Templates

### Clinical workflow discovery brief

- Modalities in scope:
- Setting (in-clinic, at-home, hybrid):
- Roles (clinician, guide, nurse, admin):
- Documentation systems in use:
- Outcomes measures used:
- Safety events tracked:
- Escalation rules:
- Constraints (time per session, staffing):

### Safety event capture template

Fields:
- Event category:
- Time and context:
- Severity rating:
- Immediate actions taken:
- Outcome:
- Follow-up needed:
- Reviewer:
- Closure date:

### Language guardrails list (for product copy)

Approved:
- "tracks outcomes"
- "supports quality improvement"
- "helps teams compare performance trends"

Avoid:
- "improves outcomes"
- "guarantees results"
- "clinically proven" unless substantiated and approved

## Scripts

### Clinical SME interview guide

1. Walk me through the full patient journey in your setting.
2. What is documented, by whom, and when?
3. What outcomes measures matter, and why?
4. What safety events do you see, and how are they handled?
5. What would make a tool unacceptable, even if it saved time?
6. Where do you see the highest risk, clinically and legally?
7. What is the minimum data you would actually enter consistently?

## Evaluation rubric (score 1 to 5)

- Workflow realism
- Safety coverage and escalation clarity
- Regulatory boundary clarity
- Burden minimization
- Terminology accuracy


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
