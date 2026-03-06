#!/usr/bin/env node
// WO-531 — Minimal PDF generator (zero external deps, pure Node.js)
// Generates two variants of the Sterile Schema / Data Policy trust document
// Run: node scripts/generate-trust-pdfs.mjs
// Output: public/assets/trust/ppn-data-policy-dark.pdf
//         public/assets/trust/ppn-data-policy-light.pdf

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '../public/assets/trust');
fs.mkdirSync(OUT, { recursive: true });

// ─── Content ────────────────────────────────────────────────────────────────
const LINES = [
    { type: 'title', text: 'PPN Portal: The Sterile Schema Data Architecture' },
    { type: 'subtitle', text: 'What We Collect. What We Protect. Why It Matters.' },
    { type: 'meta', text: 'Document v1.0 \u00B7 2026-03-05 \u00B7 ppnportal.net' },
    { type: 'space' },
    { type: 'body', text: 'We utilize a Zero-Knowledge, No-PHI architecture. By cryptographically' },
    { type: 'body', text: 'separating the process of care from the identity of the patient, PPN Portal' },
    { type: 'body', text: 'ensures your data acts as an immutable shield of clinical diligence.' },
    { type: 'space' },
    { type: 'heading', text: 'PART 1 \u2014 THE HARD BOUNDARIES: What We NEVER Collect' },
    { type: 'bullet', text: 'NO PII/PHI \u2014 No names, email addresses, street addresses, or SSNs.' },
    { type: 'bullet', text: 'NO Free-Text Clinical Notes \u2014 All inputs are structured dropdowns and sliders.' },
    { type: 'bullet', text: 'Patient IDs are Random & Client-Side \u2014 Example: PT-KXMR9W2P.' },
    { type: 'detail', text: '  You hold the key connecting that ID to your patient.' },
    { type: 'space' },
    { type: 'heading', text: 'PART 2 \u2014 THE EVIDENCE OF CARE: What We DO Collect' },
    { type: 'subhead', text: '1. Subject Baseline & Demographics' },
    { type: 'bullet', text: 'Biological Sex' },
    { type: 'bullet', text: 'Primary Indication (e.g., Treatment-Resistant Depression \u2014 mapped to standard codes)' },
    { type: 'subhead', text: '2. The Container Metrics (Set & Setting)' },
    { type: 'bullet', text: 'Setting Code: Clinic (Medical/Soft), Home (Supervised), Retreat Center' },
    { type: 'bullet', text: 'Support Ratio: 1:1, 2:1 (Co-Therapy), or Group' },
    { type: 'bullet', text: 'Preparation & Integration Hours (numeric)' },
    { type: 'bullet', text: 'Support Modalities: CBT, Somatic, IFS, Music/Playlist (checkbox)' },
    { type: 'subhead', text: '3. The Clinical Intervention' },
    { type: 'bullet', text: 'Substance \u2014 Mapped to RxNorm Codes (Psilocybin = 1433, Ketamine = 6130)' },
    { type: 'bullet', text: 'Dosage & Route \u2014 Mapped to UCUM Codes (e.g., 25mg Oral; 0.5mg/kg IV)' },
    { type: 'bullet', text: 'Concomitant Medications \u2014 Smart grid for interaction risk checks' },
    { type: 'subhead', text: '4. Safety & Outcomes Tracking' },
    { type: 'bullet', text: 'Psychometric Scores: PHQ-9, GAD-7 \u2014 mapped to LOINC codes' },
    { type: 'bullet', text: 'Adverse Events \u2014 Coded to MedDRA standard' },
    { type: 'bullet', text: 'Session Experience \u2014 Intensity and Therapeutic sliders' },
    { type: 'space' },
    { type: 'heading', text: 'PART 3 \u2014 WHY THIS ARCHITECTURE PROTECTS YOU' },
    { type: 'bullet', text: '1. Audit-Ready Documentation \u2014 Forensic, timestamped export proving standard of care.' },
    { type: 'bullet', text: '2. Immunity to Subpoenas \u2014 Zero-Knowledge: we have nothing to surrender but random IDs.' },
    { type: 'bullet', text: '3. Network Benchmarking \u2014 No PHI = no regulatory deadlock; real-time outcome comparison.' },
    { type: 'space' },
    { type: 'footer', text: '\u00A9 2026 Precision Psychedelic Network (PPN) \u00B7 All Rights Reserved' },
];

// ─── PDF Builder ─────────────────────────────────────────────────────────────
function buildPDF(dark) {
    const W = 595;   // A4 pt width
    const H = 842;   // A4 pt height
    const ML = 50;   // margin left
    const MR = 50;   // margin right
    const TW = W - ML - MR;
    const TML = ML + 12;

    const BG = dark ? '0.059 0.071 0.102' : '1 1 1';       // #0f172a vs white
    const FG = dark ? '0.886 0.910 0.941' : '0.059 0.071 0.102'; // text primary
    const FGS = dark ? '0.580 0.640 0.720' : '0.278 0.337 0.424'; // text secondary
    const ACC = dark ? '0.506 0.549 0.973' : '0.310 0.275 0.902'; // indigo

    const objs = [];
    let oid = 1;
    const id = () => oid++;

    const pages = [{ content: [] }];
    let pg = 0;
    let y = H - 60;  // start near top in PDF coords (y=0 at bottom)

    const LSPACE = { title: 22, subtitle: 14, meta: 11, heading: 16, subhead: 13, bullet: 12, detail: 10, body: 12, space: 8, footer: 10 };
    const FSIZE = { title: 18, subtitle: 11, meta: 9, heading: 10, subhead: 10, bullet: 9, detail: 9, body: 9, space: 0, footer: 8 };
    const FBOLD = { title: 1, subtitle: 0, meta: 0, heading: 1, subhead: 1, bullet: 0, detail: 0, body: 0, space: 0, footer: 0 };

    const colorOf = (type) => {
        if (['title'].includes(type)) return FG;
        if (['heading', 'subhead'].includes(type)) return ACC;
        if (['meta', 'detail', 'footer'].includes(type)) return FGS;
        return FG;
    };

    const addLine = (text, x, y, size, bold, color) => {
        const c = pages[pg].content;
        c.push(`BT`);
        c.push(`/${bold ? 'F2' : 'F1'} ${size} Tf`);
        c.push(`${color} rg`);
        c.push(`${x} ${y} Td`);
        // Escape special PDF chars
        const safe = text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
        c.push(`(${safe}) Tj`);
        c.push(`ET`);
    };

    // Background rect
    const addBG = (pageIdx) => {
        pages[pageIdx].content.unshift(`${BG} rg`, `0 0 ${W} ${H} re`, `f`);
    };

    for (const line of LINES) {
        const lh = LSPACE[line.type] || 12;
        if (y - lh < 50) {
            addBG(pg);
            pg++;
            pages.push({ content: [] });
            y = H - 60;
        }
        if (line.type === 'space') { y -= lh; continue; }
        const x = ['bullet', 'detail'].includes(line.type) ? TML : ML;
        const prefix = line.type === 'bullet' ? '\u2022  ' : '';
        addLine(prefix + line.text, x, y, FSIZE[line.type], FBOLD[line.type], colorOf(line.type));
        y -= lh;
    }
    addBG(pg);

    // ── Build raw PDF ──────────────────────────────────────────────────────────
    let pdf = '%PDF-1.4\n';
    const offsets = {};

    const addObj = (onum, content) => {
        offsets[onum] = pdf.length;
        pdf += `${onum} 0 obj\n${content}\nendobj\n`;
    };

    // Object 1: Catalog
    const catId = id();
    // Object 2: Pages
    const pagesId = id();
    // Objects 3,4: Fonts (regular + bold)
    const f1Id = id();
    const f2Id = id();

    // Page objects
    const pageIds = pages.map(() => id());
    const contentIds = pages.map(() => id());

    // Build font streams (standard Helvetica — no embed needed)
    addObj(catId, `<< /Type /Catalog /Pages ${pagesId} 0 R >>`);
    addObj(pagesId,
        `<< /Type /Pages /Kids [${pageIds.map(i => `${i} 0 R`).join(' ')}] /Count ${pages.length} >>`
    );
    addObj(f1Id,
        `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>`
    );
    addObj(f2Id,
        `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>`
    );

    for (let i = 0; i < pages.length; i++) {
        const stream = pages[i].content.join('\n');
        const streamBytes = Buffer.from(stream, 'latin1');
        addObj(contentIds[i],
            `<< /Length ${streamBytes.length} >>\nstream\n${streamBytes.toString('latin1')}\nendstream`
        );
        addObj(pageIds[i],
            `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${W} ${H}] ` +
            `/Contents ${contentIds[i]} 0 R ` +
            `/Resources << /Font << /F1 ${f1Id} 0 R /F2 ${f2Id} 0 R >> >> >>`
        );
    }

    // xref + trailer
    const xrefOffset = pdf.length;
    const allObjs = [catId, pagesId, f1Id, f2Id, ...pageIds, ...contentIds];
    const maxId = Math.max(...allObjs);

    pdf += 'xref\n';
    pdf += `0 ${maxId + 1}\n`;
    pdf += '0000000000 65535 f \n';
    for (let i = 1; i <= maxId; i++) {
        const off = offsets[i];
        if (off !== undefined) {
            pdf += `${String(off).padStart(10, '0')} 00000 n \n`;
        } else {
            pdf += '0000000000 65535 f \n';
        }
    }
    pdf += `trailer\n<< /Size ${maxId + 1} /Root ${catId} 0 R >>\n`;
    pdf += `startxref\n${xrefOffset}\n%%EOF\n`;

    return pdf;
}

const dark = buildPDF(true);
const light = buildPDF(false);

fs.writeFileSync(path.join(OUT, 'ppn-data-policy-dark.pdf'), dark, 'latin1');
fs.writeFileSync(path.join(OUT, 'ppn-data-policy-light.pdf'), light, 'latin1');

console.log('✅ ppn-data-policy-dark.pdf');
console.log('✅ ppn-data-policy-light.pdf');
console.log('📁 Output:', OUT);
