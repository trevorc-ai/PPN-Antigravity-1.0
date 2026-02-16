---
id: WO-051
status: 00_INBOX
priority: P1 (Critical)
category: Feature / Legal / Marketing / Design
owner: PENDING_LEAD_ASSIGNMENT
failure_count: 0
created_date: 2026-02-15T17:22:10-08:00
requires_coordination: true
coordinating_agents: [LEAD, MARKETER, DESIGNER, SOOP, INSPECTOR, BUILDER]
---

# User Request

Implement comprehensive privacy-first messaging and optional anonymity system across the entire application.

## Core Requirements

### 1. User Privacy Options
- **All users** must have the choice between:
  - **Publicly visible** in provider directory
  - **100% anonymous** (no public profile)

### 2. Privacy Statements (Site-Wide)
- **Robust privacy statements** visible on every page
- **Primary placement:** Footer (site-wide)
- **Critical pages:** Landing page, login pages, registration
- **Message emphasis:** Safety, security, and anonymity

### 3. Data Collection Policy
- **Patients:** Zero personal information collected (ever)
- **Providers:** Personal information ONLY if they opt-in to public directory
- **Core message:** "We can't share personal data because we don't even collect it"

### 4. Geographic Context
- **Current focus:** Oregon and Colorado
- **Future expansion:** Other states will follow
- **Messaging:** Respect for state-specific privacy regulations

## Key Messaging Points

### Privacy Statement Content
1. **Zero patient data collection** - No names, emails, DOB, or identifiable information
2. **Optional provider visibility** - Providers choose public directory listing
3. **Data security** - 100% secure, encrypted, HIPAA-compliant
4. **Anonymity guarantee** - Complete anonymity is the default
5. **No data sharing** - We don't collect it, so we can't share it
6. **Privacy respect** - User privacy is paramount

---

## THE BLAST RADIUS (Authorized Target Area)

### MARKETER
- Draft privacy statement copy
- Create messaging framework for "Privacy First" positioning
- Define tone and voice for legal/privacy content
- Research Oregon/Colorado privacy requirements
- Plan future state expansion messaging

### DESIGNER
- Design footer component with privacy statement
- Create privacy policy page layout
- Design "Privacy First" badge/icon for landing page
- Design user profile privacy toggle UI
- Ensure privacy messaging is visually prominent

### SOOP
- Audit current database schema for PHI/PII compliance
- Verify zero patient data collection
- Design provider directory opt-in system
- Create privacy flags in user profiles table
- Ensure RLS policies enforce privacy settings

### INSPECTOR
- Review privacy statement for legal compliance
- Verify HIPAA compliance claims
- Audit data collection practices
- Review provider directory opt-in mechanism
- Ensure no PHI/PII leakage

### BUILDER
- Implement footer component with privacy statement
- Create privacy policy page
- Build provider directory opt-in toggle
- Add privacy statements to landing/login pages
- Implement user profile visibility controls

---

## ⚡ THE ELECTRIC FENCE (Strict "DO NOT TOUCH" Constraints)

**DO NOT:**
- Make unsubstantiated privacy claims
- Implement auto-enrollment in public directory
- Collect any patient PII without explicit user request
- Hide privacy settings in obscure locations
- Use legal jargon without plain-language explanations

**MUST:**
- Make privacy opt-in (not opt-out)
- Use clear, simple language
- Make privacy controls easily accessible
- Verify all claims with INSPECTOR before publishing
- Follow HIPAA guidelines strictly

---

## ✅ Acceptance Criteria

### MARKETER Deliverables
- [ ] Privacy statement copy (footer version)
- [ ] Extended privacy policy content
- [ ] "Privacy First" messaging framework
- [ ] Oregon/Colorado compliance research
- [ ] State expansion messaging strategy

### DESIGNER Deliverables
- [ ] Footer component design with privacy statement
- [ ] Privacy policy page mockup
- [ ] Provider directory opt-in UI design
- [ ] "Privacy First" visual identity elements
- [ ] Mobile-responsive privacy messaging

### SOOP Deliverables
- [ ] Database audit report (PHI/PII compliance)
- [ ] Provider directory opt-in schema
- [ ] Privacy flags in user profiles
- [ ] RLS policies for directory visibility
- [ ] Migration script for privacy features

### INSPECTOR Deliverables
- [ ] Legal compliance review
- [ ] HIPAA compliance verification
- [ ] Privacy statement approval
- [ ] Data collection audit sign-off
- [ ] Security review of opt-in mechanism

### BUILDER Deliverables
- [ ] Footer component with privacy statement
- [ ] Privacy policy page
- [ ] Provider directory opt-in toggle
- [ ] Privacy statements on landing/login pages
- [ ] User profile visibility controls
- [ ] All privacy features tested and accessible

---

## 📝 MANDATORY COMPLIANCE

### ACCESSIBILITY
- Privacy controls must be keyboard accessible
- Privacy statements must be screen-reader friendly
- Minimum 12px font size for all legal text
- High contrast for readability
- ARIA labels for all privacy toggles

### SECURITY
- Privacy settings must be user-controlled
- No default public visibility
- RLS enforcement on directory queries
- Audit trail for privacy setting changes
- Secure opt-in/opt-out mechanism

### LEGAL
- HIPAA-compliant messaging
- No false or misleading claims
- Clear data retention policies
- User rights clearly stated
- Compliance with Oregon/Colorado regulations

---

## 🚦 Workflow Sequence

This is a **coordinated multi-agent work order** requiring sequential handoffs:

### Step 1: LEAD Architectural Review
- Define technical strategy
- Assign coordination sequence
- Identify dependencies
- Create routing plan

### Step 2: MARKETER Content Strategy
- Draft privacy messaging
- Research state regulations
- Create messaging framework
- Hand off to DESIGNER

### Step 3: DESIGNER UI/UX Design
- Design privacy components
- Create visual identity
- Design opt-in controls
- Hand off to SOOP

### Step 4: SOOP Database Architecture
- Audit current schema
- Design privacy features
- Create migration scripts
- Hand off to INSPECTOR

### Step 5: INSPECTOR Compliance Review
- Review all deliverables
- Verify legal compliance
- Approve privacy claims
- Hand off to BUILDER

### Step 6: BUILDER Implementation
- Build all components
- Implement privacy features
- Test accessibility
- Return to INSPECTOR for final QA

---

## 📋 Technical Notes

### Current State Analysis Needed
- Review existing privacy policy (if any)
- Audit current data collection practices
- Identify all pages needing privacy statements
- Review user profile schema

### Provider Directory Requirements
- Opt-in only (no default public listing)
- User-controlled visibility toggle
- Clear explanation of what's shared
- Easy opt-out mechanism
- RLS enforcement on directory queries

### Footer Privacy Statement
- Concise (2-3 sentences)
- Links to full privacy policy
- Visible on every page
- Mobile-responsive
- Accessible

---

## Dependencies

**Prerequisite Work:**
- None - this is foundational privacy work

**Synergy With:**
- WO-050 (Landing Page Marketing) - privacy messaging integration
- WO_042 (Database Security Audit) - privacy compliance verification
- WO_041 (UX Accessibility Audit) - accessible privacy controls

---

## Notes

This work order requires **tight coordination** across all agents. LEAD must define the handoff sequence and ensure each agent completes their deliverables before the next agent begins.

**User's Core Message:**
"We can't share personal data because we don't even collect it. We respect privacy."

This should be the foundation of all privacy messaging.
