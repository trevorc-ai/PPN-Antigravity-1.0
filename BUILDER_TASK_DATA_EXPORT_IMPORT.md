# 📦 BUILDER TASK: DATA EXPORT/IMPORT SYSTEM
## Bulk Upload/Download for Protocol Data

**Assigned To:** BUILDER  
**Priority:** HIGH  
**Estimated Time:** 6-8 hours  
**Due Date:** This week

---

## 🎯 OBJECTIVE

Build a comprehensive data export/import system that allows practitioners to:
1. **Export** their protocol data (CSV, JSON, PDF)
2. **Import** bulk protocol data (CSV upload)
3. **Download** reports for compliance/audit
4. **Backup** their data (full database export)

---

## 📋 REQUIREMENTS

### **Use Cases:**

**1. Compliance Reporting (Oregon/Colorado)**
- Export all protocols from last quarter
- Format: PDF or CSV
- Required fields: All state-mandated data points
- Use case: Submit to state regulators

**2. Payer Prior Authorization**
- Export outcomes data for specific patient cohort
- Format: PDF with charts
- Required fields: PHQ-9 scores, adverse events, session counts
- Use case: Prove medical necessity to insurance

**3. Data Migration (From Spreadsheets)**
- Import existing protocol data from Excel/CSV
- Format: CSV with template
- Required fields: Substance, indication, dose, date
- Use case: Onboard existing clinics with historical data

**4. Backup & Portability**
- Export complete database (all protocols, all data)
- Format: JSON (machine-readable)
- Required fields: Everything
- Use case: Data ownership, disaster recovery

**5. Research Collaboration**
- Export de-identified data for research
- Format: CSV (anonymized)
- Required fields: Protocols only (no site/practitioner info)
- Use case: Share with research partners

---

## 🛠️ TECHNICAL SPECIFICATIONS

### **Export Formats:**

#### **1. CSV Export**
**Use Case:** Spreadsheet analysis, data migration

**Fields:**
```csv
protocol_id,substance_name,indication_name,dose_mg,route,session_date,session_number,adverse_events,phq9_baseline,phq9_followup,notes
12345,Psilocybin,Depression,25,Oral,2026-01-15,1,0,18,12,""
12346,Ketamine,PTSD,0.5,IV,2026-01-16,3,1,22,15,"Mild nausea"
```

**Implementation:**
```typescript
export async function exportToCSV(siteId: number, filters?: ExportFilters) {
  const { data, error } = await supabase
    .from('log_clinical_records')
    .select(`
      id,
      substance_id,
      indication_id,
      dose_mg,
      route_id,
      session_date,
      session_number,
      ref_substances(substance_name),
      ref_indications(indication_name),
      ref_routes(route_name)
    `)
    .eq('site_id', siteId)
    .gte('created_at', filters?.startDate)
    .lte('created_at', filters?.endDate);

  // Convert to CSV
  const csv = convertToCSV(data);
  downloadFile(csv, 'protocols.csv', 'text/csv');
}
```

---

#### **2. JSON Export**
**Use Case:** Full backup, API integration

**Structure:**
```json
{
  "export_date": "2026-02-12T02:15:00Z",
  "site_id": 42,
  "site_name": "Example Clinic",
  "protocols": [
    {
      "id": 12345,
      "substance": {
        "id": 1,
        "name": "Psilocybin",
        "rxnorm_cui": 12345
      },
      "indication": {
        "id": 3,
        "name": "Depression"
      },
      "dose_mg": 25,
      "route": "Oral",
      "session_date": "2026-01-15",
      "session_number": 1,
      "adverse_events": [],
      "outcomes": {
        "phq9_baseline": 18,
        "phq9_followup": 12
      }
    }
  ],
  "metadata": {
    "total_protocols": 127,
    "date_range": {
      "start": "2025-01-01",
      "end": "2026-02-12"
    }
  }
}
```

**Implementation:**
```typescript
export async function exportToJSON(siteId: number, filters?: ExportFilters) {
  // Fetch all related data
  const protocols = await fetchProtocolsWithRelations(siteId, filters);
  
  const exportData = {
    export_date: new Date().toISOString(),
    site_id: siteId,
    protocols: protocols,
    metadata: {
      total_protocols: protocols.length,
      date_range: filters
    }
  };

  downloadFile(
    JSON.stringify(exportData, null, 2),
    'protocols-backup.json',
    'application/json'
  );
}
```

---

#### **3. PDF Export**
**Use Case:** Compliance reports, payer submissions

**Layout:**
- Header: Clinic name, date range, report type
- Summary: Total protocols, adverse event rate, outcomes
- Table: Protocol list with key fields
- Charts: Outcomes over time, substance distribution
- Footer: Page numbers, export date

**Implementation:**
```typescript
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export async function exportToPDF(siteId: number, filters?: ExportFilters) {
  const protocols = await fetchProtocolsWithRelations(siteId, filters);
  
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('Clinical Protocol Report', 20, 20);
  doc.setFontSize(12);
  doc.text(`Date Range: ${filters.startDate} to ${filters.endDate}`, 20, 30);
  
  // Summary
  doc.text(`Total Protocols: ${protocols.length}`, 20, 40);
  doc.text(`Adverse Event Rate: ${calculateAERate(protocols)}%`, 20, 50);
  
  // Table
  autoTable(doc, {
    startY: 60,
    head: [['Date', 'Substance', 'Indication', 'Dose', 'Outcome']],
    body: protocols.map(p => [
      p.session_date,
      p.substance.name,
      p.indication.name,
      `${p.dose_mg} mg`,
      p.outcomes.phq9_reduction
    ])
  });
  
  doc.save('protocol-report.pdf');
}
```

---

### **Import Formats:**

#### **1. CSV Import**
**Use Case:** Bulk data upload, migration from spreadsheets

**Template:**
```csv
substance_name,indication_name,dose_mg,route_name,session_date,session_number,adverse_events,phq9_baseline,phq9_followup
Psilocybin,Depression,25,Oral,2026-01-15,1,0,18,12
Ketamine,PTSD,0.5,IV,2026-01-16,3,1,22,15
```

**Validation Rules:**
- substance_name: Must exist in ref_substances
- indication_name: Must exist in ref_indications
- dose_mg: Numeric, > 0
- route_name: Must exist in ref_routes
- session_date: Valid date, not future
- session_number: Integer, > 0
- adverse_events: Integer, >= 0
- phq9_*: Integer, 0-27

**Implementation:**
```typescript
export async function importFromCSV(file: File, siteId: number) {
  // Parse CSV
  const csvData = await parseCSV(file);
  
  // Validate each row
  const validationResults = await validateCSVData(csvData);
  
  if (validationResults.errors.length > 0) {
    return {
      success: false,
      errors: validationResults.errors,
      validRows: validationResults.validRows,
      invalidRows: validationResults.invalidRows
    };
  }
  
  // Convert to database format
  const protocols = await convertCSVToProtocols(csvData, siteId);
  
  // Bulk insert
  const { data, error } = await supabase
    .from('log_clinical_records')
    .insert(protocols);
  
  if (error) throw error;
  
  return {
    success: true,
    imported: data.length,
    errors: []
  };
}
```

---

## 🎨 UI COMPONENTS

### **1. Export Modal**

**Location:** Dashboard, Analytics pages  
**Trigger:** "Export Data" button

**Design:**
```tsx
<Modal title="Export Protocol Data">
  {/* Format Selection */}
  <RadioGroup label="Export Format">
    <Radio value="csv">CSV (Spreadsheet)</Radio>
    <Radio value="json">JSON (Backup)</Radio>
    <Radio value="pdf">PDF (Report)</Radio>
  </RadioGroup>
  
  {/* Date Range */}
  <DateRangePicker
    label="Date Range"
    startDate={startDate}
    endDate={endDate}
  />
  
  {/* Filters */}
  <Select label="Substance" options={substances} />
  <Select label="Indication" options={indications} />
  
  {/* Options */}
  <Checkbox>Include adverse events</Checkbox>
  <Checkbox>Include outcomes data</Checkbox>
  <Checkbox>De-identify (remove site info)</Checkbox>
  
  {/* Actions */}
  <Button onClick={handleExport}>Export</Button>
  <Button variant="ghost" onClick={onClose}>Cancel</Button>
</Modal>
```

---

### **2. Import Modal**

**Location:** Dashboard, Protocol Builder  
**Trigger:** "Import Data" button

**Design:**
```tsx
<Modal title="Import Protocol Data">
  {/* Template Download */}
  <Alert variant="info">
    <p>Download our CSV template to ensure correct formatting</p>
    <Button variant="link" onClick={downloadTemplate}>
      Download Template
    </Button>
  </Alert>
  
  {/* File Upload */}
  <FileUpload
    accept=".csv"
    onUpload={handleFileUpload}
    maxSize={10 * 1024 * 1024} // 10MB
  />
  
  {/* Validation Results */}
  {validationResults && (
    <div>
      <p>✅ Valid rows: {validationResults.validRows}</p>
      <p>❌ Invalid rows: {validationResults.invalidRows}</p>
      
      {validationResults.errors.length > 0 && (
        <ErrorList errors={validationResults.errors} />
      )}
    </div>
  )}
  
  {/* Actions */}
  <Button
    onClick={handleImport}
    disabled={!validationResults || validationResults.invalidRows > 0}
  >
    Import {validationResults?.validRows} Protocols
  </Button>
  <Button variant="ghost" onClick={onClose}>Cancel</Button>
</Modal>
```

---

### **3. Data Export Page**

**Location:** `/data-export` (new page)

**Layout:**
```tsx
<PageContainer>
  <Section>
    <h1>Data Export & Import</h1>
    <p>Export your protocol data for compliance, backup, or analysis.</p>
  </Section>
  
  {/* Quick Exports */}
  <Section>
    <h2>Quick Exports</h2>
    <Grid cols={3}>
      <Card>
        <h3>Last Quarter</h3>
        <p>All protocols from last 3 months</p>
        <Button onClick={() => exportQuarter('csv')}>
          Export CSV
        </Button>
      </Card>
      
      <Card>
        <h3>Full Backup</h3>
        <p>Complete database export (JSON)</p>
        <Button onClick={() => exportFullBackup()}>
          Export JSON
        </Button>
      </Card>
      
      <Card>
        <h3>Compliance Report</h3>
        <p>PDF report for state regulators</p>
        <Button onClick={() => exportComplianceReport()}>
          Export PDF
        </Button>
      </Card>
    </Grid>
  </Section>
  
  {/* Custom Export */}
  <Section>
    <h2>Custom Export</h2>
    <Button onClick={() => setShowExportModal(true)}>
      Configure Custom Export
    </Button>
  </Section>
  
  {/* Import */}
  <Section>
    <h2>Import Data</h2>
    <Button onClick={() => setShowImportModal(true)}>
      Import from CSV
    </Button>
  </Section>
  
  {/* Export History */}
  <Section>
    <h2>Export History</h2>
    <Table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Format</th>
          <th>Records</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {exportHistory.map(exp => (
          <tr key={exp.id}>
            <td>{exp.created_at}</td>
            <td>{exp.format}</td>
            <td>{exp.record_count}</td>
            <td>
              <Button size="sm" onClick={() => downloadExport(exp.id)}>
                Download
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  </Section>
</PageContainer>
```

---

## 🔒 SECURITY & PRIVACY

### **Data Protection:**

**1. No PHI in Exports (Unless Explicitly Requested)**
- Default: De-identified exports (no site name, no practitioner name)
- Option: Include site info (for compliance reports)
- Never: Include patient identifiers (we don't collect them anyway)

**2. Access Control**
- Only authenticated users can export
- Users can only export their own site's data
- network_admin can export aggregated network data

**3. Audit Trail**
- Log all exports (who, what, when)
- Store in system_events table
- Retention: 90 days minimum

**Implementation:**
```typescript
async function logExport(userId: string, siteId: number, format: string, recordCount: number) {
  await supabase.from('system_events').insert({
    event_type: 'data_export',
    actor_id: userId,
    target_id: siteId,
    metadata: {
      format,
      record_count: recordCount,
      timestamp: new Date().toISOString()
    }
  });
}
```

---

### **Import Validation:**

**1. Schema Validation**
- Check column headers match template
- Validate data types (numeric, date, etc.)
- Check required fields are present

**2. Business Logic Validation**
- Substance/indication/route exist in ref tables
- Dates are valid (not future, not before clinic opened)
- Numeric values in valid ranges

**3. Duplicate Detection**
- Check for duplicate protocols (same substance + date + session_number)
- Warn user, allow override

**Implementation:**
```typescript
async function validateCSVRow(row: any, rowNumber: number) {
  const errors: string[] = [];
  
  // Check substance exists
  const { data: substance } = await supabase
    .from('ref_substances')
    .select('substance_id')
    .eq('substance_name', row.substance_name)
    .single();
  
  if (!substance) {
    errors.push(`Row ${rowNumber}: Substance "${row.substance_name}" not found`);
  }
  
  // Check date is valid
  if (isNaN(Date.parse(row.session_date))) {
    errors.push(`Row ${rowNumber}: Invalid date "${row.session_date}"`);
  }
  
  // Check dose is numeric
  if (isNaN(parseFloat(row.dose_mg))) {
    errors.push(`Row ${rowNumber}: Dose must be numeric`);
  }
  
  return errors;
}
```

---

## 📊 DATABASE SCHEMA

### **New Table: export_history**

```sql
CREATE TABLE export_history (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  site_id BIGINT NOT NULL REFERENCES sites(site_id),
  export_format TEXT NOT NULL CHECK (export_format IN ('csv', 'json', 'pdf')),
  record_count INTEGER NOT NULL,
  filters JSONB,
  file_url TEXT, -- S3 URL if we store exports
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE export_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own exports"
  ON export_history FOR SELECT
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_sites
      WHERE user_sites.site_id = export_history.site_id
      AND user_sites.user_id = auth.uid()
      AND user_sites.role IN ('site_admin', 'network_admin')
    )
  );
```

---

## ✅ ACCEPTANCE CRITERIA

### **Export Functionality:**
- [ ] CSV export works (all protocols, filtered)
- [ ] JSON export works (full backup)
- [ ] PDF export works (compliance report)
- [ ] Date range filtering works
- [ ] Substance/indication filtering works
- [ ] De-identification option works
- [ ] Export history is logged

### **Import Functionality:**
- [ ] CSV template download works
- [ ] File upload works (< 10MB)
- [ ] Validation catches errors (invalid substance, date, etc.)
- [ ] Validation shows clear error messages
- [ ] Valid rows can be imported
- [ ] Duplicate detection works
- [ ] Import is logged in system_events

### **UI/UX:**
- [ ] Export modal is intuitive
- [ ] Import modal shows validation results
- [ ] Data Export page is accessible from Dashboard
- [ ] Export history table shows recent exports
- [ ] Loading states during export/import
- [ ] Error states with clear messages

### **Security:**
- [ ] Only authenticated users can export
- [ ] Users can only export their own site's data
- [ ] All exports are logged
- [ ] No PHI in default exports
- [ ] RLS policies enforced

---

## 📋 IMPLEMENTATION PLAN

### **Phase 1: Export (4 hours)**

**Step 1: Backend Functions** (2 hours)
- [ ] Create `exportToCSV()` function
- [ ] Create `exportToJSON()` function
- [ ] Create `exportToPDF()` function
- [ ] Add filtering logic (date range, substance, indication)
- [ ] Add de-identification logic

**Step 2: UI Components** (2 hours)
- [ ] Create ExportModal component
- [ ] Add "Export Data" button to Dashboard
- [ ] Create Data Export page (`/data-export`)
- [ ] Add export history table
- [ ] Test all export formats

---

### **Phase 2: Import (4 hours)**

**Step 3: Backend Functions** (2 hours)
- [ ] Create CSV template generator
- [ ] Create `parseCSV()` function
- [ ] Create `validateCSVData()` function
- [ ] Create `importFromCSV()` function
- [ ] Add duplicate detection

**Step 4: UI Components** (2 hours)
- [ ] Create ImportModal component
- [ ] Add file upload component
- [ ] Add validation results display
- [ ] Add "Import Data" button to Dashboard
- [ ] Test import with valid/invalid data

---

### **Phase 3: Polish (1-2 hours)**

**Step 5: Testing & Documentation**
- [ ] Test all export formats (CSV, JSON, PDF)
- [ ] Test import with various CSV files
- [ ] Test error handling (invalid data, network errors)
- [ ] Write user documentation (how to export/import)
- [ ] Add tooltips/help text

---

## 🎯 STRATEGIC CONTEXT

### **Why This Matters:**

**From VoC Research:**
- Oregon/Colorado programs require compliance reporting
- Payers require outcomes data for prior authorization
- Practitioners want data ownership (not locked in)

**Competitive Advantage:**
- Osmind: Locked-in data (hard to export)
- PPN: Full data portability (you own your data)

**Use Cases:**
- Compliance reporting (Oregon/Colorado)
- Payer submissions (prior auth)
- Research collaboration (de-identified data)
- Data migration (onboard existing clinics)
- Backup & disaster recovery

---

## 📊 SUCCESS METRICS

### **Adoption:**
- [ ] >50% of users export data within first month
- [ ] >20% of users import historical data
- [ ] >10% of users use compliance report export

### **Quality:**
- [ ] Zero data loss during export/import
- [ ] <1% error rate on CSV imports
- [ ] All exports complete in <30 seconds

### **Business Impact:**
- [ ] Enables onboarding of clinics with historical data
- [ ] Reduces compliance burden (automated reports)
- [ ] Increases trust (data portability)

---

**Status:** 🟡 ASSIGNED - Awaiting BUILDER acknowledgment  
**Priority:** 🔴 HIGH - Enables compliance and data migration  
**Next:** BUILDER confirms approach and timeline 🛠️
