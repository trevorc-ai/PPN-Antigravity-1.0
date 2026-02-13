# PPN Research Portal - Master Plan

**Version:** 1.0  
**Last Updated:** February 13, 2026  
**Status:** MVP Development Phase  
**Location:** `/MASTER_PLAN.md` (Project Root)

> **⚠️ SINGLE SOURCE OF TRUTH**: All agents must reference this document for context, priorities, and coordination.

---

## 🎯 Mission

Build the Practice Operating System for Psychedelic Therapy - unifying safety, outcomes, and compliance into a single secure platform trusted by practitioners worldwide.

---

## 📊 Current Status

**Phase:** MVP → Product-Market Fit  
**North Star Metric:** Monthly Active Practitioners (MAP) - Target 100 by Q2 2026  
**Team:** 6 agents (LEAD, DESIGNER, SOOP, BUILDER, MARKETER, ANALYST)  
**Sprint:** Sprint 1 - Foundation (Week 1-2 of 16-week roadmap)

---

## 👥 Team Structure

1. **LEAD** - Strategy, architecture, approvals (Temperature: 0)
2. **DESIGNER** - UI/UX, visual design, accessibility (Temperature: 3)
3. **SOOP** - Database, schema, data integrity (Temperature: 0)
4. **BUILDER** - Implementation, code, testing (Temperature: 0)
5. **MARKETER** - Acquisition, content, growth (Temperature: 1) ✨ NEW
6. **ANALYST** - Retention, metrics, insights (Temperature: 0) ✨ NEW

---

## 📋 Strategic Documents

All strategic planning documents are located in the brain directory:
`/Users/trevorcalton/.gemini/antigravity/brain/2e1f5871-bb94-43c4-bd75-775f905e85ec/`

### Core Planning Documents
- **[Customer Journey Map](file:///Users/trevorcalton/.gemini/antigravity/brain/2e1f5871-bb94-43c4-bd75-775f905e85ec/customer_journey_map.md)** - 7-stage user journey analysis
- **[Implementation Roadmap](file:///Users/trevorcalton/.gemini/antigravity/brain/2e1f5871-bb94-43c4-bd75-775f905e85ec/implementation_roadmap.md)** - 16-week sprint plan (✅ APPROVED)
- **[Agent Status Report](file:///Users/trevorcalton/.gemini/antigravity/brain/2e1f5871-bb94-43c4-bd75-775f905e85ec/agent_status_report.md)** - Current work and handoffs

### Agent Specifications
- **[MARKETER Spec](file:///Users/trevorcalton/.gemini/antigravity/brain/2e1f5871-bb94-43c4-bd75-775f905e85ec/MARKETER_agent_spec.md)** - Marketing strategy & execution
- **[ANALYST Spec](file:///Users/trevorcalton/.gemini/antigravity/brain/2e1f5871-bb94-43c4-bd75-775f905e85ec/ANALYST_agent_spec.md)** - Retention & KPI monitoring

---

## 🚀 Current Sprint: Sprint 1 (Feb 13-27)

**Theme:** Foundation - Remove conversion barriers

### Active Priorities

#### P0 - Critical Path (This Week)
1. **Pricing Page** - MARKETER → DESIGNER → BUILDER (3-5 days)
2. **Analytics Setup** - ANALYST → BUILDER (3-5 days)
3. **Video Script** - MARKETER (2 days)
4. **Legal Attorney** - External (start search)

#### Next Week
5. **Email Notifications** - MARKETER → BUILDER (1 week)
6. **Case Studies** - MARKETER → DESIGNER → BUILDER (1-2 weeks)
7. **Baseline Metrics** - ANALYST (3-5 days)

---

## 🔄 Standard Workflow

### Artifact-First Process
1. **LEAD** defines strategy, creates brief
2. **Specialist Agent** (MARKETER/DESIGNER/SOOP) creates detailed spec
3. **LEAD** reviews and approves ("✅ APPROVED")
4. **BUILDER** implements
5. **ANALYST** monitors performance
6. **LEAD** reviews results, iterates

### Communication Protocol
- All plans start as `.md` artifacts in brain directory
- Use `@AGENT` syntax for handoffs
- Get LEAD approval before BUILDER implements
- Reference this MASTER_PLAN.md for context

---

## 📊 Success Metrics

### North Star
**Monthly Active Practitioners (MAP)** - Users who log ≥1 protocol/month
- Current: TBD (ANALYST establishing baseline)
- Q2 2026: 100
- Q4 2026: 500

### Key Metrics by Owner
**MARKETER Owns:**
- Signup conversion: 2% → 5%
- CAC: <$200

**ANALYST Owns:**
- First protocol (24h): 30% → 60%
- Day 7 retention: 40% → 60%
- Churn rate: Monitor and reduce

---

## 🚨 Critical Rules (ALL AGENTS)

1. **Accessibility First** - Font ≥12px, WCAG 2.1 AA, no color-only meaning
2. **No PHI/PII** - De-identified data only, HIPAA compliant
3. **Artifact-First** - All plans as `.md` files before implementation
4. **Get Approval** - LEAD must approve before BUILDER implements
5. **Two-Strike Rule** - If fix fails twice, revert and request new strategy

---

## 🚧 Current Blockers

1. ⚠️ Legal foundation missing (attorney needed, $5-10k)
2. ⚠️ No payment processing (Stripe integration needed)
3. ✅ MARKETER & ANALYST added to team (RESOLVED)

---

## 🔗 Quick Reference

### Product URLs (Local Dev)
- Landing: http://localhost:5173/#/landing
- Dashboard: http://localhost:5173/#/dashboard
- Protocol Builder: http://localhost:5173/#/protocol-builder

### Key Files
- Agent Config: [agent.yaml](file:///Users/trevorcalton/Desktop/PPN-Antigravity-1.0/agent.yaml)
- Handoff Protocols: [docs/TEAM_HANDOFF_PROTOCOLS.md](file:///Users/trevorcalton/Desktop/PPN-Antigravity-1.0/docs/TEAM_HANDOFF_PROTOCOLS.md)
- Frontend Best Practices: [.agent/skills/frontend-best-practices/SKILL.md](file:///Users/trevorcalton/Desktop/PPN-Antigravity-1.0/.agent/skills/frontend-best-practices/SKILL.md)

### External
- GitHub: https://github.com/trevorc-ai/PPN-Antigravity-1.0
- Branch: feature/voc-pivot

---

## 📝 For New Agent Conversations

**When starting a new conversation with any agent, they should:**
1. Read this MASTER_PLAN.md first
2. Check their agent specification (if MARKETER/ANALYST)
3. Review current sprint priorities
4. Check agent status report for active handoffs
5. Follow standard workflow (artifact-first)

**This document is automatically referenced via agent.yaml context_files.**

---

**Last Updated:** February 13, 2026, 12:15 PM PST  
**Next Review:** Weekly (every Monday)
