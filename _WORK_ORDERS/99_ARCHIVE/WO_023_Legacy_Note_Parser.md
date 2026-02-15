---
work_order_id: WO_023
title: Implement Legacy Note Parser (NLP Ingest)
type: FEATURE
category: Feature
priority: MEDIUM
status: INBOX
created: 2026-02-14T23:39:41-08:00
requested_by: Trevor Calton
assigned_to: BUILDER
estimated_complexity: 6/10
failure_count: 0
owner: BUILDER
status: 03_BUILD---

# Work Order: Implement Legacy Note Parser (NLP Ingest)

## 🎯 THE GOAL

Create a "Bulk Import" tool that structures unstructured session notes into the `log_sessions` format.

### PRE-FLIGHT CHECK

- Check for existing text-parsing utilities in `src/utils`

### Directives

1. **UI:** Create a "Paste Legacy Notes" text area in the Profile/Settings area

2. **Logic (Client-Side NLP):**
   - Use simple Regex/Keyword matching initially (MVP) to extract:
     - Date (e.g., "2023-01-12")
     - Substance (e.g., "Mushrooms", "MDMA")
     - Dosage (e.g., "3g", "120mg")
   - *Stretch Goal:* If an on-device LLM API is available, use it for sentiment analysis

3. **Output:** A "Review Import" table where the user confirms the parsed data before it commits to the DB

---

## 🎯 THE BLAST RADIUS (Authorized Target Area)

- `src/pages/ImportLegacy.tsx` (New)
- `src/utils/noteParser.ts` (New Logic)

---

## ⚡ THE ELECTRIC FENCE (Strict "DO NOT TOUCH" Constraints)

**DO NOT:**
- Send the raw text to any cloud LLM (Privacy Violation)
- Auto-commit; user verification is mandatory

**MUST:**
- Processing must happen locally or via strict "Zero-Knowledge" pattern
- Require user confirmation before database commit

---

## ✅ Acceptance Criteria

### Pre-Flight Verification
- [ ] Check for existing text-parsing utilities in `src/utils`

### UI Implementation
- [ ] `ImportLegacy.tsx` page created
- [ ] "Paste Legacy Notes" text area implemented
- [ ] Located in Profile/Settings area

### Parser Logic
- [ ] `noteParser.ts` utility created
- [ ] Regex/keyword matching for Date extraction
- [ ] Regex/keyword matching for Substance extraction
- [ ] Regex/keyword matching for Dosage extraction
- [ ] Client-side processing only (no cloud LLM)

### Review & Confirmation
- [ ] "Review Import" table displays parsed data
- [ ] User can edit parsed fields
- [ ] User must confirm before commit
- [ ] No auto-commit functionality

### Stretch Goal
- [ ] On-device LLM sentiment analysis (if available)

---

## 📝 MANDATORY COMPLIANCE

### SECURITY
- **Sanitize all inputs** to prevent injection attacks
- No cloud LLM processing (privacy violation)
- Zero-Knowledge pattern enforced

---

## 🚦 Status

**INBOX** - Awaiting LEAD architectural review

---

## 📋 Technical Specifications

### Parser Patterns
```typescript
const datePattern = /\b\d{4}-\d{2}-\d{2}\b/;
const substancePattern = /\b(psilocybin|mushrooms|mdma|lsd|ketamine)\b/i;
const dosagePattern = /\b(\d+\.?\d*)\s?(mg|g|mcg)\b/i;
```

### Review Table Interface
```tsx
interface ParsedSession {
  date: string;
  substance: string;
  dosage: string;
  rawText: string;
  confidence: 'high' | 'medium' | 'low';
}
```

---

## Dependencies

None - This is a standalone feature.

## LEAD ARCHITECTURE

**Technical Strategy:**
Create client-side NLP tool using Regex to parse unstructured session notes into structured `log_sessions` format.

**Files to Touch:**
- `src/pages/ImportLegacy.tsx` - NEW: Import UI page
- `src/utils/noteParser.ts` - NEW: Regex parsing logic
- `src/components/import/ReviewTable.tsx` - NEW: Confirmation table

**Constraints:**
- MUST NOT send data to cloud LLM (Privacy Violation)
- MUST require user confirmation before DB commit
- MUST sanitize all inputs (injection prevention)
- Client-side processing ONLY

**Recommended Approach:**
1. Create text area for pasting legacy notes
2. Use Regex to extract: Date, Substance, Dosage
3. Display parsed data in Review Table
4. Allow user to edit before commit
5. Stretch: On-device LLM for sentiment analysis

**Risk Mitigation:**
- Input sanitization to prevent injection
- Clear privacy messaging (no cloud processing)
- Mandatory user review step
