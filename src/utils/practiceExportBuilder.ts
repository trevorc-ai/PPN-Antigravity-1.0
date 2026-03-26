/**
 * practiceExportBuilder.ts — WO-677
 *
 * Generates a two-sheet .xlsx workbook for the practitioner's patient panel.
 *
 * Sheet 1 — "PPN Data" (visible, PPN-generated, header locked):
 *   De-identified clinical data only. No PHI ever enters this file.
 *   Subject ID is the only identifier — it matches the practitioner's own
 *   physical chart labels.
 *
 * Sheet 2 — "My Practice" (visible, practitioner-editable):
 *   Blank columns for the practitioner to add their own contact info.
 *   VLOOKUP formulas auto-populate clinical data from Sheet 1 when a
 *   Subject ID is entered in column A.
 *
 * Implementation: pure Office Open XML (OOXML) generated as a Blob.
 * No external library required — zero npm install needed.
 *
 * Zero PHI guarantee: ExportRow contains only de-identified clinical fields.
 * Names, phone numbers, emails, and DOB are NEVER present in this file.
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ExportRow {
    subjectId: string;              // De-identified patient identifier (link code hash or generated ID)
    phase: string;                  // Current arc-of-care phase
    substance: string;              // Primary substance (e.g. "Ibogaine HCL", "Psilocybin")
    sessionsCompleted: number;      // Total sessions logged
    lastSessionDate: string;        // YYYY-MM-DD or 'Unknown'
    meq30Score: string;             // Most recent MEQ-30 score or '-'
    phq9Score: string;              // Most recent PHQ-9 score or '-'
    gad7Score: string;              // Most recent GAD-7 score or '-'
    contraindicationFlags: string;  // Comma-separated flag IDs or '-'
    integrationSessions: number;    // Count of Phase 3 integration session records
}

// ── XML Escaping ──────────────────────────────────────────────────────────────

function esc(s: string | number): string {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

// ── Cell address helpers ──────────────────────────────────────────────────────

function colLetter(n: number): string {
    // n is 1-indexed
    let result = '';
    while (n > 0) {
        const rem = (n - 1) % 26;
        result = String.fromCharCode(65 + rem) + result;
        n = Math.floor((n - 1) / 26);
    }
    return result;
}

// ── XLSX Parts ────────────────────────────────────────────────────────────────

const S1_HEADERS = [
    'Subject ID',
    'Phase',
    'Primary Substance',
    'Sessions Completed',
    'Last Session Date',
    'MEQ-30 Score',
    'PHQ-9 Score',
    'GAD-7 Score',
    'Contraindication Flags',
    'Integration Sessions',
];

const S2_HEADERS = [
    'Subject ID',           // A — practitioner fills in
    'Real Name',            // B — blank
    'Phone',                // C — blank
    'Email',                // D — blank
    'Notes',                // E — blank
    'Phase',                // F — VLOOKUP
    'Substance',            // G — VLOOKUP
    'Sessions',             // H — VLOOKUP
    'Last Session',         // I — VLOOKUP
    'MEQ-30',               // J — VLOOKUP
    'PHQ-9',                // K — VLOOKUP
    'GAD-7',                // L — VLOOKUP
];

// Column indices in Sheet 1 (1-based) for VLOOKUP col_index_num
// Subject ID = col 1, Phase = 2, Substance = 3, Sessions = 4, LastSession = 5,
// MEQ = 6, PHQ = 7, GAD = 8, Flags = 9, IntegrationSessions = 10

function buildSheet1Xml(rows: ExportRow[]): string {
    const headerRow = S1_HEADERS.map((h, i) =>
        `<c r="${colLetter(i + 1)}1" t="inlineStr"><is><t>${esc(h)}</t></is></c>`
    ).join('');

    const dataRows = rows.map((r, ri) => {
        const rowNum = ri + 2;
        const cells = [
            r.subjectId,
            r.phase,
            r.substance,
            String(r.sessionsCompleted),
            r.lastSessionDate,
            r.meq30Score,
            r.phq9Score,
            r.gad7Score,
            r.contraindicationFlags,
            String(r.integrationSessions),
        ].map((val, ci) =>
            `<c r="${colLetter(ci + 1)}${rowNum}" t="inlineStr"><is><t>${esc(val)}</t></is></c>`
        ).join('');
        return `<row r="${rowNum}">${cells}</row>`;
    }).join('');

    const lastRow = rows.length + 1;
    const lastCol = colLetter(S1_HEADERS.length);
    const tableRef = `A1:${lastCol}${lastRow}`;

    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheetData>
    <row r="1">${headerRow}</row>
    ${dataRows}
  </sheetData>
  <tableParts count="1"><tablePart r:id="rId1"/></tableParts>
  <sheetFormatPr defaultRowHeight="15"/>
</worksheet>`;
}

function buildSheet2Xml(rowCount: number): string {
    const headerRow = S2_HEADERS.map((h, i) =>
        `<c r="${colLetter(i + 1)}1" t="inlineStr"><is><t>${esc(h)}</t></is></c>`
    ).join('');

    // Generate 50 blank practitioner rows with VLOOKUP formulas in cols F–L
    const lookupCols = [
        { col: 'F', srcCol: 2 },  // Phase
        { col: 'G', srcCol: 3 },  // Substance
        { col: 'H', srcCol: 4 },  // Sessions
        { col: 'I', srcCol: 5 },  // Last Session
        { col: 'J', srcCol: 6 },  // MEQ-30
        { col: 'K', srcCol: 7 },  // PHQ-9
        { col: 'L', srcCol: 8 },  // GAD-7
    ];

    // Sheet 1 table range — accommodate up to 500 rows
    const s1Ref = `'PPN Data'!$A$1:$J${Math.max(rowCount + 1, 500)}`;

    const dataRows = Array.from({ length: 50 }, (_, i) => {
        const rowNum = i + 2;
        const lookupCells = lookupCols.map(({ col, srcCol }) =>
            `<c r="${col}${rowNum}"><f>IF(A${rowNum}="","",IFERROR(VLOOKUP(A${rowNum},${s1Ref},${srcCol},FALSE),"-"))</f></c>`
        ).join('');
        return `<row r="${rowNum}">${lookupCells}</row>`;
    }).join('');

    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheetData>
    <row r="1">${headerRow}</row>
    ${dataRows}
  </sheetData>
  <sheetFormatPr defaultRowHeight="15"/>
</worksheet>`;
}

function buildTableXml(rowCount: number): string {
    const lastRow = Math.max(rowCount + 1, 2);
    const lastCol = colLetter(S1_HEADERS.length);
    const ref = `A1:${lastCol}${lastRow}`;
    const cols = S1_HEADERS.map((h, i) =>
        `<tableColumn id="${i + 1}" name="${esc(h)}"/>`
    ).join('');
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<table xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
  id="1" name="PPN_Data" displayName="PPN_Data" ref="${ref}" totalsRowShown="0">
  <tableColumns count="${S1_HEADERS.length}">${cols}</tableColumns>
  <tableStyleInfo name="TableStyleMedium9" showFirstColumn="0" showLastColumn="0" showRowStripes="1" showColumnStripes="0"/>
</table>`;
}

// ── ZIP Builder (pure JS, no library) ────────────────────────────────────────
// Minimal OOXML ZIP — stores parts uncompressed (method 0) for simplicity.

function crc32(data: Uint8Array): number {
    const table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
        let c = i;
        for (let j = 0; j < 8; j++) c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        table[i] = c;
    }
    let crc = 0xffffffff;
    for (const b of data) crc = table[(crc ^ b) & 0xff] ^ (crc >>> 8);
    return (crc ^ 0xffffffff) >>> 0;
}

function toUint8(s: string): Uint8Array {
    return new TextEncoder().encode(s);
}

function uint32LE(n: number): Uint8Array {
    const b = new Uint8Array(4);
    new DataView(b.buffer).setUint32(0, n >>> 0, true);
    return b;
}
function uint16LE(n: number): Uint8Array {
    const b = new Uint8Array(2);
    new DataView(b.buffer).setUint16(0, n & 0xffff, true);
    return b;
}

interface ZipEntry { name: string; data: Uint8Array; offset: number; }

function buildZip(files: { name: string; content: string }[]): Uint8Array {
    const entries: ZipEntry[] = [];
    const parts: Uint8Array[] = [];
    let offset = 0;

    for (const f of files) {
        const nameBytes = toUint8(f.name);
        const data = toUint8(f.content);
        const crc = crc32(data);
        const header = Uint8Array.of(
            0x50, 0x4b, 0x03, 0x04, // local file header signature
            0x14, 0x00,             // version needed: 2.0
            0x00, 0x00,             // general purpose bit flag
            0x00, 0x00,             // compression method: stored
            0x00, 0x00, 0x00, 0x00, // last mod time/date (zeroed)
            ...uint32LE(crc),
            ...uint32LE(data.byteLength),
            ...uint32LE(data.byteLength),
            ...uint16LE(nameBytes.byteLength),
            0x00, 0x00,             // extra field length
        );
        const localRecord = concat(header, nameBytes, data);
        parts.push(localRecord);
        entries.push({ name: f.name, data, offset });
        offset += localRecord.byteLength;
    }

    // Central directory
    const cdParts: Uint8Array[] = [];
    for (const e of entries) {
        const nameBytes = toUint8(e.name);
        const crc = crc32(e.data);
        const cd = Uint8Array.of(
            0x50, 0x4b, 0x01, 0x02, // central directory signature
            0x14, 0x00,             // version made by
            0x14, 0x00,             // version needed
            0x00, 0x00,             // general purpose bit flag
            0x00, 0x00,             // compression method: stored
            0x00, 0x00, 0x00, 0x00, // last mod
            ...uint32LE(crc),
            ...uint32LE(e.data.byteLength),
            ...uint32LE(e.data.byteLength),
            ...uint16LE(nameBytes.byteLength),
            0x00, 0x00,             // extra field length
            0x00, 0x00,             // file comment length
            0x00, 0x00,             // disk number start
            0x00, 0x00,             // internal attributes
            0x00, 0x00, 0x00, 0x00, // external attributes
            ...uint32LE(e.offset),
        );
        cdParts.push(concat(cd, nameBytes));
    }

    const cdData = concat(...cdParts);
    const cdOffset = offset;
    const eocd = Uint8Array.of(
        0x50, 0x4b, 0x05, 0x06, // end of central directory signature
        0x00, 0x00,             // disk number
        0x00, 0x00,             // disk with start of CD
        ...uint16LE(entries.length),
        ...uint16LE(entries.length),
        ...uint32LE(cdData.byteLength),
        ...uint32LE(cdOffset),
        0x00, 0x00,             // comment length
    );

    return concat(...parts, cdData, eocd);
}

function concat(...arrays: Uint8Array[]): Uint8Array {
    const total = arrays.reduce((s, a) => s + a.byteLength, 0);
    const out = new Uint8Array(total);
    let pos = 0;
    for (const a of arrays) { out.set(a, pos); pos += a.byteLength; }
    return out;
}

// ── OOXML Boilerplate ─────────────────────────────────────────────────────────

const CONTENT_TYPES_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/tables/table1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml"/>
</Types>`;

const ROOT_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;

const WORKBOOK_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="PPN Data" sheetId="1" r:id="rId1"/>
    <sheet name="My Practice" sheetId="2" r:id="rId2"/>
  </sheets>
</workbook>`;

const WORKBOOK_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/>
</Relationships>`;

const SHEET1_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/table" Target="../tables/table1.xml"/>
</Relationships>`;

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Builds a two-sheet .xlsx workbook as a Blob.
 * - Sheet 1: "PPN Data" — de-identified clinical table
 * - Sheet 2: "My Practice" — blank + VLOOKUP formulas
 *
 * ZERO PHI: ExportRow fields are all de-identified. No name/phone/email ever written.
 */
export function buildPracticeExportXlsx(rows: ExportRow[]): Blob {
    const files = [
        { name: '[Content_Types].xml', content: CONTENT_TYPES_XML },
        { name: '_rels/.rels', content: ROOT_RELS },
        { name: 'xl/workbook.xml', content: WORKBOOK_XML },
        { name: 'xl/_rels/workbook.xml.rels', content: WORKBOOK_RELS },
        { name: 'xl/worksheets/sheet1.xml', content: buildSheet1Xml(rows) },
        { name: 'xl/worksheets/sheet2.xml', content: buildSheet2Xml(rows.length) },
        { name: 'xl/tables/table1.xml', content: buildTableXml(rows.length) },
        { name: 'xl/worksheets/_rels/sheet1.xml.rels', content: SHEET1_RELS },
    ];
    const bytes = buildZip(files);
    return new Blob([bytes.buffer as ArrayBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
}

/**
 * Builds a plain CSV Blob from export rows (Sheet 1 data only).
 * For paste-in to "Refresh PPN Data" in an existing workbook.
 */
export function buildPracticeExportCsv(rows: ExportRow[]): Blob {
    const headers = S1_HEADERS.join(',');
    const dataLines = rows.map(r => [
        r.subjectId,
        r.phase,
        r.substance,
        r.sessionsCompleted,
        r.lastSessionDate,
        r.meq30Score,
        r.phq9Score,
        r.gad7Score,
        `"${r.contraindicationFlags}"`,
        r.integrationSessions,
    ].join(','));
    return new Blob([[headers, ...dataLines].join('\n')], { type: 'text/csv' });
}

/**
 * Derives ExportRow[] from PatientSelectModal's LivePatient[] shape.
 * Clinical scores not yet available in the modal query — returns '-' placeholders
 * until a richer query is wired in PatientListPage.
 */
export interface LivePatientShape {
    id: string;
    phase: string;
    substance?: string;
    sessionCount: number;
    lastSession: string;
    sessionType?: string;
}

export function fromLivePatients(patients: LivePatientShape[]): ExportRow[] {
    return patients.map(p => ({
        subjectId: p.id,
        phase: p.phase,
        substance: p.substance ?? p.sessionType ?? '-',
        sessionsCompleted: p.sessionCount,
        lastSessionDate: p.lastSession,
        meq30Score: '-',
        phq9Score: '-',
        gad7Score: '-',
        contraindicationFlags: '-',
        integrationSessions: 0,
    }));
}

/** Triggers a browser file download from a Blob. */
export function triggerDownload(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
