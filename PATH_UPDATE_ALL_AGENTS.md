# 🔧 FILE PATH UPDATE - ALL AGENTS READ THIS

**Date:** 2026-02-11  
**Priority:** CRITICAL  
**Status:** ACTIVE

---

## 📍 **CORRECT PROJECT LOCATION**

**✅ CURRENT (CORRECT) PATH:**
```
/Users/trevorcalton/Desktop/PPN-Antigravity-1.0
```

**❌ OLD (INVALID) PATHS - DO NOT USE:**
```
/Users/trevorcalton/.gemini/antigravity/...
/Users/trevorcalton/Documents/...
Any other location
```

---

## 🎯 **MANDATORY RULES FOR ALL AGENTS**

### **Rule 1: Always Use Absolute Paths**
When referencing ANY file in this project, use the full absolute path starting with:
```
/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/
```

### **Rule 2: Project Root Directory**
```
PROJECT_ROOT = /Users/trevorcalton/Desktop/PPN-Antigravity-1.0
```

### **Rule 3: Verify Before Operating**
Before modifying any file, verify you're in the correct location:
```bash
pwd
# Expected output: /Users/trevorcalton/Desktop/PPN-Antigravity-1.0
```

---

## 📁 **CRITICAL FILE PATHS - QUICK REFERENCE**

### **Agent Configuration**
```
/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/agent.yaml
```

### **Source Code**
```
/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/src/
/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/src/pages/
/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/src/components/
```

### **Database Migrations**
```
/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/migrations/
```

### **Documentation**
```
/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/*.md
```

### **Configuration Files**
```
/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/package.json
/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/tsconfig.json
/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/vite.config.ts
/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/.env
```

---

## 🤖 **AGENT-SPECIFIC PATHS**

### **DESIGNER**
**Owns:**
- `/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/src/components/`
- `/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/src/pages/`
- `/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/src/styles/`

**Key Files:**
- Protocol Builder: `/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/src/pages/ProtocolBuilder.tsx`
- ButtonGroup: `/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/src/components/forms/ButtonGroup.tsx`

### **BUILDER**
**Owns:**
- `/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/src/`

**Task Files:**
- `/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/BUILDER_TASK_*.md`
- `/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/BUILDER_HANDOFF.md`

### **SUBA**
**Owns:**
- `/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/migrations/`

**Key Files:**
- Latest migration: `/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/migrations/010_future_proof_schema.sql`
- Governance: `/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/DATABASE_GOVERNANCE_RULES.md`

### **INSPECTOR**
**Reference Files:**
- Design System: `/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/DESIGN_SYSTEM.md`
- Style Guide: `/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/STYLE_GUIDE.md`

### **CRAWL**
**Browser Target:**
- Local dev server: `http://localhost:5173` (or port specified in terminal)

---

## 🔍 **VERIFICATION CHECKLIST**

Before starting ANY task, verify:

- [ ] Current working directory is `/Users/trevorcalton/Desktop/PPN-Antigravity-1.0`
- [ ] All file paths use absolute paths starting with `/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/`
- [ ] No references to `.gemini` directory
- [ ] No references to old locations

---

## 🚨 **COMMON MISTAKES TO AVOID**

### ❌ **WRONG:**
```
cd ~/antigravity
vim src/pages/ProtocolBuilder.tsx
/Users/trevorcalton/.gemini/antigravity/brain/...
```

### ✅ **CORRECT:**
```
cd /Users/trevorcalton/Desktop/PPN-Antigravity-1.0
vim /Users/trevorcalton/Desktop/PPN-Antigravity-1.0/src/pages/ProtocolBuilder.tsx
/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/PROTOCOLBUILDER_COMPLETE_REDESIGN_SPEC.md
```

---

## 📋 **PROTOCOL BUILDER REDESIGN - UPDATED PATHS**

### **Phase 1 UX Task:**
```
/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/DESIGNER_TASK_PROTOCOLBUILDER_PHASE1.md
```

### **Complete Redesign Spec:**
```
/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/PROTOCOLBUILDER_COMPLETE_REDESIGN_SPEC.md
/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/PROTOCOLBUILDER_REDESIGN_EXECUTIVE_SUMMARY.md
/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/PROTOCOLBUILDER_FIELD_MAPPING.md
/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/PROTOCOLBUILDER_VISUAL_DESIGN.md
```

### **Implementation Target:**
```
/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/src/pages/ProtocolBuilder.tsx
```

---

## 🎯 **ACTION ITEMS FOR EACH AGENT**

### **LEAD**
- ✅ Distribute this document to all subagents
- ✅ Verify all task files use correct paths
- ✅ Update agent.yaml if needed

### **DESIGNER**
- ✅ Read DESIGNER_TASK_PROTOCOLBUILDER_PHASE1.md (paths updated)
- ✅ Create ButtonGroup at correct path
- ✅ Modify ProtocolBuilder.tsx at correct path

### **BUILDER**
- ✅ Check for BUILDER_TASK_*.md files in project root
- ✅ Use correct src/ path for all modifications

### **SUBA**
- ✅ All migrations in /Users/trevorcalton/Desktop/PPN-Antigravity-1.0/migrations/
- ✅ Check DATABASE_GOVERNANCE_RULES.md before schema changes

### **INSPECTOR**
- ✅ Reference DESIGN_SYSTEM.md at correct path
- ✅ Use browser tool to inspect localhost

### **CRAWL**
- ✅ Navigate to localhost dev server
- ✅ Generate reports in project root

---

## ✅ **CONFIRMATION**

**All agents must acknowledge:**
1. I understand the project is located at `/Users/trevorcalton/Desktop/PPN-Antigravity-1.0`
2. I will use absolute paths for all file operations
3. I will verify my working directory before making changes
4. I will not reference old `.gemini` paths

---

**STATUS:** All paths updated and verified ✅  
**Last Updated:** 2026-02-11 10:42 PST  
**Updated By:** LEAD

---

**This document supersedes all previous path references. If you find any outdated paths in other documents, flag them immediately.**
