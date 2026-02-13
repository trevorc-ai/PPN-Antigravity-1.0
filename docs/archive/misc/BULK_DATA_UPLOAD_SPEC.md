# 📤 **BULK DATA UPLOAD SYSTEM**

**Document Type:** Technical Specification  
**Version:** 1.0  
**Date:** 2026-02-10  
**Status:** Design Complete

---

## 🎯 **OBJECTIVE**

Enable practitioners to bulk upload historical clinical data (CSV/Excel) into the PPN Research Portal, accelerating the "cold start" problem for Wisdom Trust and reducing manual data entry burden.

**Key Requirements:**
- ✅ Support CSV and Excel (.xlsx) formats
- ✅ Validate data against schema before import
- ✅ Map practitioner's column names to PPN fields
- ✅ De-duplicate existing records
- ✅ Maintain data privacy (no PHI/PII)
- ✅ Audit trail for all uploads

---

## 📋 **USER FLOW**

### **Step 1: Upload File**
1. User navigates to `/data-import`
2. Drags & drops CSV/Excel file or clicks "Browse"
3. System validates file format and size (max 50MB)

### **Step 2: Column Mapping**
1. System auto-detects columns
2. User maps their columns to PPN fields:
   - `Patient ID` → `subject_id` (auto-generated if missing)
   - `Date` → `session_date`
   - `Substance` → `substance_id` (lookup from `ref_substances`)
   - `Dosage` → `dosage_amount`
   - etc.
3. System shows preview of first 10 rows

### **Step 3: Validation**
1. System checks for:
   - Required fields present
   - Data types correct (dates, numbers)
   - Foreign key references valid (substance_id exists)
   - No PHI/PII detected (regex scan for SSN, email, phone)
2. Display errors with row numbers

### **Step 4: Import**
1. User clicks "Import X Records"
2. System processes in batches (100 records at a time)
3. Progress bar shows completion %
4. Summary report shows:
   - Records imported: 847
   - Records skipped (duplicates): 12
   - Errors: 3 (with details)

---

## 🗂️ **SUPPORTED FILE FORMATS**

### **CSV (Comma-Separated Values)**
```csv
patient_id,session_date,substance,dosage,route,outcome_phq9
PT-001,2025-01-15,Psilocybin,25,Oral,8
PT-002,2025-01-16,MDMA,125,Oral,12
```

**Requirements:**
- UTF-8 encoding
- First row must be headers
- Commas as delimiters (or auto-detect)
- Dates in ISO 8601 format (YYYY-MM-DD) or US format (MM/DD/YYYY)

### **Excel (.xlsx)**
- Single worksheet (first sheet used)
- Headers in row 1
- Data starts in row 2
- Max 10,000 rows per file

---

## 🔍 **COLUMN MAPPING INTERFACE**

### **Auto-Detection Rules**

The system will attempt to auto-map columns using fuzzy matching:

| User Column Name | Detected PPN Field | Confidence |
|------------------|-------------------|------------|
| `Patient ID`, `Subject`, `ID` | `subject_id` | High |
| `Date`, `Session Date`, `Visit Date` | `session_date` | High |
| `Drug`, `Substance`, `Medication` | `substance_id` | Medium |
| `Dose`, `Dosage`, `Amount` | `dosage_amount` | Medium |
| `PHQ-9`, `Depression Score` | `outcome_phq9` | High |

### **Manual Override**

User can click any column header to change mapping:

```
┌─────────────────────────────────────┐
│ Your Column: "Drug Name"            │
│ ┌─────────────────────────────────┐ │
│ │ Map to PPN Field:               │ │
│ │ ▼ substance_id (Substance)      │ │
│ │   dosage_amount (Dosage)        │ │
│ │   route_id (Route)              │ │
│ │   --- Skip this column ---      │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## ✅ **VALIDATION RULES**

### **Required Fields**
- `session_date` (Date)
- `substance_id` (Foreign key to `ref_substances`)
- `site_id` (Auto-filled from user's site)

### **Data Type Validation**

| Field | Type | Validation |
|-------|------|------------|
| `session_date` | Date | Must be valid date, not in future |
| `dosage_amount` | Decimal | Must be > 0, < 10,000 |
| `outcome_phq9` | Integer | Must be 0-27 |
| `substance_id` | Bigint | Must exist in `ref_substances` |
| `route_id` | Bigint | Must exist in `ref_routes` |

### **PHI/PII Detection**

System will **reject** files containing:
- Email addresses (regex: `\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b`)
- Phone numbers (regex: `\b\d{3}[-.]?\d{3}[-.]?\d{4}\b`)
- Social Security Numbers (regex: `\b\d{3}-\d{2}-\d{4}\b`)
- Full names (heuristic: two capitalized words in a row)

**Error Message:**
```
⚠️ PHI/PII Detected
Row 47, Column "Patient Name": Contains potential PHI.
Please remove identifying information before uploading.
```

---

## 🔄 **DUPLICATE DETECTION**

### **Matching Logic**

A record is considered a duplicate if:
```sql
SELECT * FROM log_clinical_records
WHERE site_id = :site_id
  AND subject_id = :subject_id
  AND session_date = :session_date
  AND substance_id = :substance_id;
```

### **User Options**

When duplicates are detected:
1. **Skip duplicates** (default)
2. **Update existing records** (overwrite with new data)
3. **Import as new** (create duplicate entries)

---

## 📊 **DATABASE SCHEMA**

### **Import Jobs Table**

```sql
CREATE TABLE data_import_jobs (
  job_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  site_id BIGINT REFERENCES sites(site_id),
  filename TEXT,
  file_size_bytes BIGINT,
  total_rows INTEGER,
  rows_imported INTEGER,
  rows_skipped INTEGER,
  rows_errored INTEGER,
  status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  error_log JSONB, -- Array of {row: number, error: string}
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **Column Mappings (for reuse)**

```sql
CREATE TABLE import_column_mappings (
  mapping_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  mapping_name TEXT, -- e.g., "My EHR Export Format"
  column_map JSONB, -- {"Patient ID": "subject_id", "Drug": "substance_id"}
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Benefit:** Users can save mappings and reuse for future imports.

---

## 🎨 **UI MOCKUP**

### **Page: `/data-import`**

```
┌──────────────────────────────────────────────────────────────┐
│  📤 Bulk Data Upload                                         │
│  ─────────────────────────────────────────────────────────   │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                                                        │ │
│  │         📁 Drag & drop your CSV or Excel file here    │ │
│  │                                                        │ │
│  │                  or click to browse                    │ │
│  │                                                        │ │
│  │  Supported formats: .csv, .xlsx                       │ │
│  │  Max file size: 50MB                                  │ │
│  │                                                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ✅ Your data is encrypted and never leaves our servers     │
│  ✅ We automatically detect and reject PHI/PII              │
│  ✅ All imports are logged for audit compliance             │
│                                                              │
│  ────────────────────────────────────────────────────────   │
│                                                              │
│  📋 Recent Imports                                           │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 2026-02-09  clinical_data_jan.csv  ✅ 847 records   │   │
│  │ 2026-02-08  patient_outcomes.xlsx  ✅ 1,203 records │   │
│  │ 2026-02-07  safety_events.csv      ⚠️  12 errors    │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### **Step 2: Column Mapping**

```
┌──────────────────────────────────────────────────────────────┐
│  📤 Map Your Columns                                         │
│  ─────────────────────────────────────────────────────────   │
│                                                              │
│  File: clinical_data_jan.csv (847 rows)                     │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Your Column       →  PPN Field                       │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ Patient ID        →  subject_id ✅                   │   │
│  │ Date              →  session_date ✅                 │   │
│  │ Drug              →  substance_id ⚠️ (needs lookup) │   │
│  │ Dose              →  dosage_amount ✅                │   │
│  │ Route             →  route_id ⚠️ (needs lookup)     │   │
│  │ PHQ-9 Score       →  outcome_phq9 ✅                 │   │
│  │ Notes             →  --- Skip ---                    │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ⚠️ 2 columns need attention (click to fix)                 │
│                                                              │
│  [< Back]                          [Preview Data >]         │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### **Step 3: Preview & Validate**

```
┌──────────────────────────────────────────────────────────────┐
│  📤 Preview & Validate                                       │
│  ─────────────────────────────────────────────────────────   │
│                                                              │
│  Showing first 10 of 847 rows:                              │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Row │ Subject ID │ Date       │ Substance  │ PHQ-9  │   │
│  ├─────┼────────────┼────────────┼────────────┼────────┤   │
│  │ 1   │ PT-001     │ 2025-01-15 │ Psilocybin │ 8  ✅  │   │
│  │ 2   │ PT-002     │ 2025-01-16 │ MDMA       │ 12 ✅  │   │
│  │ 3   │ PT-003     │ 2025-01-17 │ Ketamine   │ 15 ✅  │   │
│  │ 4   │ PT-004     │ Invalid    │ Psilocybin │ 8  ❌  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ✅ 843 rows valid                                           │
│  ❌ 4 rows have errors (click to view)                       │
│                                                              │
│  [< Back]                    [Import 843 Records >]         │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔧 **TECHNICAL IMPLEMENTATION**

### **Backend API**

```typescript
// POST /api/v1/data-import/upload
// Multipart form data with file

interface UploadResponse {
  job_id: string;
  filename: string;
  total_rows: number;
  detected_columns: string[];
  suggested_mappings: Record<string, string>;
}

// POST /api/v1/data-import/validate
// Body: { job_id, column_mappings }

interface ValidationResponse {
  valid_rows: number;
  invalid_rows: number;
  errors: Array<{
    row: number;
    column: string;
    error: string;
  }>;
  duplicates: number;
}

// POST /api/v1/data-import/execute
// Body: { job_id, duplicate_strategy: 'skip' | 'update' | 'import' }

interface ImportResponse {
  job_id: string;
  status: 'processing';
  progress_url: string; // WebSocket or polling endpoint
}
```

### **Processing Pipeline**

```typescript
async function processImport(jobId: string) {
  const job = await getJob(jobId);
  const file = await downloadFile(job.filename);
  const rows = await parseFile(file); // CSV or Excel
  
  const batchSize = 100;
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    
    // Transform rows using column mappings
    const transformed = batch.map(row => transformRow(row, job.column_map));
    
    // Validate each row
    const validated = transformed.map(row => validateRow(row));
    
    // Insert into database
    const { data, error } = await supabase
      .from('log_clinical_records')
      .insert(validated.filter(r => r.valid));
    
    // Update job progress
    await updateJobProgress(jobId, i + batch.length);
  }
  
  await markJobComplete(jobId);
}
```

### **PHI/PII Scanner**

```typescript
const PHI_PATTERNS = {
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,
  phone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/,
  ssn: /\b\d{3}-\d{2}-\d{4}\b/,
  // Add more patterns
};

function detectPHI(value: string): boolean {
  for (const [type, pattern] of Object.entries(PHI_PATTERNS)) {
    if (pattern.test(value)) {
      return true;
    }
  }
  return false;
}
```

---

## 🚀 **ROLLOUT PLAN**

### **Phase 1: MVP (Month 1)**
- ✅ CSV upload only
- ✅ Manual column mapping
- ✅ Basic validation (required fields, data types)
- ✅ Skip duplicates only

### **Phase 2: Enhanced (Month 2)**
- ✅ Excel (.xlsx) support
- ✅ Auto-detection of column mappings
- ✅ PHI/PII scanner
- ✅ Save/reuse column mappings

### **Phase 3: Advanced (Month 3)**
- ✅ Duplicate update/merge options
- ✅ Batch processing with progress tracking
- ✅ Error correction UI (fix invalid rows inline)
- ✅ API for programmatic uploads

---

## 📊 **SUCCESS METRICS**

- **Adoption Rate:** 30% of users upload bulk data within first 3 months
- **Data Volume:** 10,000+ records imported via bulk upload by Month 6
- **Error Rate:** < 5% of uploaded rows have validation errors
- **Time Savings:** 90% reduction in manual data entry time

---

## ❓ **FAQ**

### **Q: What if my column names don't match PPN fields?**
A: The system will attempt to auto-detect, but you can manually map any column to any PPN field.

### **Q: Can I upload data from multiple patients in one file?**
A: Yes! Each row represents a single session. You can have hundreds of patients in one file.

### **Q: What happens if I upload duplicate records?**
A: By default, duplicates are skipped. You can choose to update existing records or import as new.

### **Q: Is my data secure during upload?**
A: Yes. Files are encrypted in transit (HTTPS) and at rest. They are deleted after processing.

### **Q: Can I undo an import?**
A: Not automatically, but you can contact support to request a rollback within 24 hours.

---

**End of Bulk Data Upload Specification**
