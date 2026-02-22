---
work_order_id: WO_018
title: Protocol Builder Help Documentation (Text Only)
type: CONTENT
category: Content
priority: LOW
status: COMPLETE
created: 2026-02-14T22:08:29-08:00
reviewed_by: LEAD
reviewed_at: 2026-02-14T22:41:56-08:00
completed_by: LEAD
completed_at: 2026-02-14T22:42:00-08:00
requested_by: PPN Admin
assigned_to: LEAD
estimated_complexity: 4/10
failure_count: 0
---

# Work Order: Protocol Builder Help Documentation (Text Only)

## 🎯 THE GOAL

Create the written "Help Center" documentation for the Protocol Builder.

### PRE-FLIGHT CHECK

1. Check `src/content/help/` or `docs/user_guide/` for existing drafts
2. If a "Video Script" exists, adapt it into a text guide

### Directives

1. Write a **Step-by-Step Guide:** "How to Build a Safe Protocol"
2. Document the "Safety Checks" (Interactions, Dosage) so users trust the tool
3. Create a JSON or Markdown file that the Frontend can load into a "Help Sidebar" or Tooltips
4. Exclude the Video production for now; focus purely on the text content to unblock the launch

---

## 🎯 THE BLAST RADIUS (Authorized Target Area)

- `src/content/help/protocol-builder-guide.md` (New Content)
- `public/docs/`

---

## ⚡ THE ELECTRIC FENCE (Strict "DO NOT TOUCH" Constraints)

**DO NOT:**
- Record video/audio yet
- Embed placeholders for features that don't exist yet
- Include internal dev jargon

**MUST:**
- Focus on text-only documentation
- Document only existing features

---

## ✅ Acceptance Criteria

### Pre-Flight Verification
- [ ] Check for existing help documentation
- [ ] Review any video scripts for adaptation

### Documentation Content
- [ ] Step-by-step guide created: "How to Build a Safe Protocol"
- [ ] Safety checks documented (Interactions, Dosage)
- [ ] Clear headings and structure
- [ ] Grade 8 reading level (simple language)
- [ ] No internal dev jargon

### File Format
- [ ] Markdown or JSON format
- [ ] Frontend can load into Help Sidebar
- [ ] Can be used for tooltips
- [ ] Well-structured and scannable

---

## 🧪 Testing Requirements

- [ ] Verify reading level (Grade 8)
- [ ] Test file can be loaded by frontend
- [ ] Verify all documented features exist
- [ ] Review for clarity and accuracy

---

## 📝 MANDATORY COMPLIANCE

### ACCESSIBILITY
- **Use clear headings** and simple language
- **Grade 8 reading level**
- Scannable structure
- No jargon

### SECURITY
- **No internal dev jargon** in user-facing docs
- No sensitive information
- No placeholder features

---

## 🚦 Status

**INBOX** - Ready for LEAD assignment

---

## 📋 Content Structure

### Suggested Outline

1. **Introduction**
   - What is the Protocol Builder?
   - Why use it?

2. **Getting Started**
   - Step 1: Select Substance
   - Step 2: Set Dosage
   - Step 3: Add Medications
   - Step 4: Review Safety Checks

3. **Safety Features**
   - Drug Interaction Warnings
   - Dosage Validation
   - Contraindication Alerts

4. **Best Practices**
   - How to interpret warnings
   - When to consult additional resources

5. **FAQ**
   - Common questions and answers

---

## Dependencies

None - This is a standalone content creation task.
