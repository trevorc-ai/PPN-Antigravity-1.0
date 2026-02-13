# 🤝 TEAM HANDOFF PROTOCOLS & BEST PRACTICES

**Version:** 1.0  
**Effective Date:** 2026-02-12  
**Status:** ACTIVE

---

## 📜 THE HANDOFF PROTOCOL

### **Rule #1: Artifact-First Communication**

**NEVER** pass tasks via chat alone. **ALWAYS** create a structured artifact first.

#### **Agent-Specific Artifact Requirements:**

| Agent | Artifact Type | Location | Required Contents |
|-------|---------------|----------|-------------------|
| **DESIGNER** | Design Spec (`.md`) | `docs/design/` | Layout specs, color codes, component hierarchy, library choices |
| **SOOP** | Schema (`.sql` or `.py`) | `docs/schema/` | Table definitions, relationships, indexes, sample queries |
| **LEAD** | Approval | Append to artifact | `✅ APPROVED` comment line |
| **BUILDER** | Confirmation | In chat | "I have read [File_Name] and understand the requirements." |

#### **Examples:**

**DESIGNER Artifact:**
```
docs/design/feature_login_ui.md
```

**SOOP Artifact:**
```
docs/schema/user_authentication_schema.sql
```

---

### **Rule #2: Chain of Custody**

**Standard Handoff Syntax:**
```
@[Next_Agent_Name], I have completed the [Task]. 
Please review the artifact at [File_Path] and proceed with [Next_Action].
```

#### **Examples:**

**DESIGNER → LEAD:**
```
@LEAD, I have completed the Login Page design. 
Please review the artifact at docs/design/feature_login_ui.md and approve for implementation.
```

**LEAD → BUILDER:**
```
@BUILDER, I have approved the Login Page design. 
Please review the artifact at docs/design/feature_login_ui.md and implement the component.
```

**SOOP → LEAD:**
```
@LEAD, I have completed the User Authentication schema. 
Please review the artifact at docs/schema/user_authentication_schema.sql and approve for migration.
```

---

### **Rule #3: The Builder's Gate**

**BUILDER** is **FORBIDDEN** from writing code until:

1. ✅ A specific design artifact exists (`docs/design/*.md`)
2. ✅ A specific data schema artifact exists (if data-related) (`docs/schema/*.sql` or `*.py`)
3. ✅ BUILDER has explicitly stated: **"I have read [File_Name] and understand the requirements."**

**No exceptions. No shortcuts. No assumptions.**

---

## 🚀 OPERATIONAL BEST PRACTICES

### **1. The "Mock-Data" Rule**

**Problem:** SOOP hasn't finished the real database yet  
**Solution:** BUILDER creates `mock_data.json` to test UI

**Example:**
```json
// mock_data.json
{
  "users": [
    {"id": 1, "name": "Dr. Sarah Jenkins", "role": "Practitioner"},
    {"id": 2, "name": "Dr. Michael Chen", "role": "Researcher"}
  ]
}
```

**Rule:** Do NOT wait for backend to be perfect. Mock and iterate.

---

### **2. The "Component Atomic" Rule**

**Bad Practice:**
```
LoginPage.js (500 lines)
```

**Good Practice:**
```
components/
  ├── Button.js (20 lines)
  ├── InputField.js (30 lines)
  ├── FormCard.js (40 lines)
  └── LoginPage.js (60 lines, imports above)
```

**DESIGNER and BUILDER must break UI into small, reusable components.**

---

### **3. Visualization Check**

When creating data visualizations, **DESIGNER** must specify:

1. **Library** (e.g., D3.js, Recharts, Plotly, Chart.js)
2. **Data Structure** required by that library

**Example Design Artifact:**
```markdown
## Data Visualization: Protocol Success Rate Chart

**Library:** Recharts  
**Chart Type:** BarChart  
**Data Structure:**
```json
[
  { "substance": "Psilocybin", "successRate": 71, "total": 127 },
  { "substance": "Ketamine", "successRate": 68, "total": 89 },
  { "substance": "MDMA", "successRate": 74, "total": 56 }
]
```

**Props:**
- `data`: Array of objects
- `xKey`: "substance"
- `yKey`: "successRate"
- `color`: "#3b82f6"
```

---

## 📁 DIRECTORY STRUCTURE

```
PPN-Antigravity-1.0/
├── docs/
│   ├── design/              # DESIGNER artifacts
│   │   ├── feature_login_ui.md
│   │   ├── component_button.md
│   │   └── chart_protocol_success.md
│   ├── schema/              # SOOP artifacts
│   │   ├── user_authentication.sql
│   │   ├── protocol_logging.sql
│   │   └── models.py
│   └── architecture/        # LEAD artifacts
│       ├── feature_roadmap.md
│       ├── tech_stack.md
│       └── component_hierarchy.md
├── src/
│   ├── components/          # BUILDER implementation
│   ├── pages/
│   └── utils/
└── mock_data/               # BUILDER test data
    ├── users.json
    ├── protocols.json
    └── analytics.json
```

---

## ✅ APPROVAL PROCESS

### **Step 1: Creation**
- DESIGNER or SOOP creates artifact in `docs/design/` or `docs/schema/`

### **Step 2: Review**
- LEAD reviews artifact for:
  - Completeness
  - Alignment with project goals
  - Technical feasibility
  - Clarity for BUILDER

### **Step 3: Approval**
- LEAD appends to artifact file:
  ```
  ---
  ## ✅ APPROVAL
  
  **Reviewed by:** LEAD  
  **Date:** 2026-02-12  
  **Status:** APPROVED  
  **Notes:** Ready for implementation. BUILDER may proceed.
  ```

### **Step 4: Implementation**
- BUILDER reads artifact
- BUILDER states: "I have read [File_Name] and understand the requirements."
- BUILDER implements code

### **Step 5: Handoff**
- BUILDER uses Chain of Custody syntax to notify completion

---

## 🚨 VIOLATIONS & CONSEQUENCES

**Violation:** BUILDER codes without artifact  
**Consequence:** Code is **rejected**, BUILDER must wait for proper handoff

**Violation:** DESIGNER/SOOP handoff via chat only  
**Consequence:** Task is **returned**, artifact must be created

**Violation:** Missing "Chain of Custody" syntax  
**Consequence:** Handoff is **invalid**, must use proper syntax

---

## 📊 WORKFLOW EXAMPLE

### **Feature: Login Page**

1. **LEAD** creates architecture doc:
   - `docs/architecture/feature_login_authentication.md`

2. **DESIGNER** creates design spec:
   - `docs/design/feature_login_ui.md`
   - Handoff: "@LEAD, please review docs/design/feature_login_ui.md"

3. **LEAD** reviews and approves:
   - Appends `✅ APPROVED` to `docs/design/feature_login_ui.md`
   - Handoff: "@SOOP, please create auth schema"

4. **SOOP** creates schema:
   - `docs/schema/user_authentication.sql`
   - Handoff: "@LEAD, please review docs/schema/user_authentication.sql"

5. **LEAD** reviews and approves:
   - Appends `✅ APPROVED` to `docs/schema/user_authentication.sql`
   - Handoff: "@BUILDER, you may now implement. Review both artifacts."

6. **BUILDER** confirms:
   - States: "I have read feature_login_ui.md and user_authentication.sql and understand the requirements."
   - Creates `mock_data/users.json` (if needed)
   - Implements code
   - Handoff: "@LEAD, Login feature implementation complete. Please review."

---

## 🎯 SUCCESS METRICS

**Good Handoff:**
- ✅ Artifact exists before handoff
- ✅ Proper syntax used
- ✅ BUILDER confirms understanding
- ✅ Code matches spec

**Bad Handoff:**
- ❌ Verbal/chat instructions only
- ❌ No artifact
- ❌ BUILDER codes before approval
- ❌ Spec incomplete

---

**Protocol Status:** ✅ ACTIVE  
**Last Updated:** 2026-02-12  
**Next Review:** As needed

---

## 5. ACCESSIBILITY & IDENTITY STANDARDS (MANDATORY)

### **Rule: Explicit Identification**
To accommodate visual accessibility requirements, EVERY response from an Agent must begin with a standardized text header. Do not rely on color or avatars.

**Required Header Format:**
You must start your message with a header block exactly like this:
`==== [AGENT NAME] ====`
*(Example: `==== LEAD ====` or `==== BUILDER ====`)`*

### **Rule: Sidebar Naming Convention**
When starting a NEW task or conversation thread, the first line of your plan must be a "Chat Title Suggestion" in this format:
`TITLE: [AGENT]: [Task Name]`
*(Example: `TITLE: DESIGNER: Mobile View Fixes`)*

**Why?** This helps the Mission Control user (who has color vision deficiency) instantly recognize who is speaking and what the chat is about.
