#!/usr/bin/env node
/**
 * scripts/assemble-sample-pack.js
 * ──────────────────────────────────────────────────────────────────────────
 * PPN Outreach PDF Assembler — WO-645 + WO-647
 *
 * PURPOSE
 *   Merges a set of pre-rendered PDFs and screenshot-derived exhibit pages
 *   into a single deliverable PDF for outreach materials. Shared script for
 *   both the Clinic Director pack (WO-645) and Researcher portfolio (WO-647).
 *
 * USAGE
 *   node scripts/assemble-sample-pack.js --manifest manifests/clinic-director.json
 *   node scripts/assemble-sample-pack.js --manifest manifests/researcher.json
 *
 * DEPENDENCIES — install before running:
 *   npm install --save-dev pdf-lib sharp
 *
 * MANIFEST FORMAT (see scripts/manifests/*.json for examples):
 *   {
 *     "title":    "PPN Sample Outputs",
 *     "output":   "public/outreach/PPN_Sample_Outputs.pdf",
 *     "fixtures": "public/outreach/fixtures/synthetic_patient_SYN2024042.json",
 *     "pages": [
 *       { "type": "cover",   "template": "scripts/templates/cover-clinic.html" },
 *       { "type": "divider", "title": "Module 1 — The Liability Shield", "subtitle": "..." },
 *       { "type": "pdf",     "path": "public/outreach/source-pdfs/adverse-event.pdf" },
 *       { "type": "exhibit", "image": "public/screenshots/interation_checker.webp",
 *                             "label": "Drug Interaction Checker", "badge": "Platform UI" }
 *     ]
 *   }
 *
 * NOTES
 *   - All images are converted to JPEG at 90% quality before embedding to
 *     ensure compatibility with pdf-lib and stay under 15MB output limit.
 *   - WebP source images are converted via Sharp before embedding.
 *   - Cover and divider pages are rendered from HTML templates using a
 *     headless browser (Puppeteer) — install separately if needed:
 *     npm install --save-dev puppeteer
 * ──────────────────────────────────────────────────────────────────────────
 * ⚠️  STATUS: SCAFFOLD — NOT YET EXECUTABLE
 *
 * This file was created by BUILDER (WO-645) as the shared script foundation.
 * It requires the following before it can produce output:
 *
 *   1. npm install --save-dev pdf-lib sharp puppeteer
 *   2. Source PDFs must be rendered from the platform's React PDF components
 *      and placed in public/outreach/source-pdfs/ (see manifest for list)
 *   3. HTML cover/divider templates must be created in scripts/templates/
 *
 * LEAD approved this scaffold on 2026-03-20. Full implementation requires
 * pre-rendered PDFs from the platform — see WO-645/WO-647 LEAD decisions.
 * ──────────────────────────────────────────────────────────────────────────
 */

'use strict';

const path = require('path');
const fs   = require('fs');

// ── Arg parsing ──────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const manifestFlag = args.indexOf('--manifest');
if (manifestFlag === -1 || !args[manifestFlag + 1]) {
  console.error('[assemble-sample-pack] ERROR: --manifest <path> is required');
  console.error('  Example: node scripts/assemble-sample-pack.js --manifest scripts/manifests/clinic-director.json');
  process.exit(1);
}

const manifestPath = path.resolve(process.cwd(), args[manifestFlag + 1]);
if (!fs.existsSync(manifestPath)) {
  console.error(`[assemble-sample-pack] ERROR: Manifest not found: ${manifestPath}`);
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
console.log(`[assemble-sample-pack] Loaded manifest: ${manifest.title}`);
console.log(`[assemble-sample-pack] Output: ${manifest.output}`);
console.log(`[assemble-sample-pack] Pages: ${manifest.pages.length}`);

// ── Dependency check ─────────────────────────────────────────────────────
let PDFLib, sharp;
try { PDFLib = require('pdf-lib'); } catch (e) {
  console.error('[assemble-sample-pack] ERROR: pdf-lib not installed. Run: npm install --save-dev pdf-lib');
  process.exit(1);
}
try { sharp = require('sharp'); } catch (e) {
  console.warn('[assemble-sample-pack] WARNING: sharp not installed — WebP conversion will be skipped. Run: npm install --save-dev sharp');
}

// ── Main (async) ─────────────────────────────────────────────────────────
async function main() {
  const { PDFDocument, rgb, StandardFonts } = PDFLib;
  const outputDoc = await PDFDocument.create();

  const outputPath = path.resolve(process.cwd(), manifest.output);
  const outputDir  = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  for (const page of manifest.pages) {
    console.log(`[assemble-sample-pack]   Processing: ${page.type} — ${page.label || page.title || page.path || ''}`);

    if (page.type === 'pdf') {
      // Merge existing rendered PDF
      const srcPath = path.resolve(process.cwd(), page.path);
      if (!fs.existsSync(srcPath)) {
        console.warn(`[assemble-sample-pack]   SKIP: Source PDF not found: ${srcPath}`);
        continue;
      }
      const srcBytes = fs.readFileSync(srcPath);
      const srcDoc   = await PDFDocument.load(srcBytes);
      const pages    = await outputDoc.copyPages(srcDoc, srcDoc.getPageIndices());
      pages.forEach(p => outputDoc.addPage(p));

    } else if (page.type === 'exhibit') {
      // Convert screenshot to an exhibit page
      const imgPath = path.resolve(process.cwd(), page.image);
      if (!fs.existsSync(imgPath)) {
        console.warn(`[assemble-sample-pack]   SKIP: Image not found: ${imgPath}`);
        continue;
      }

      // Convert WebP → JPEG via sharp if available
      let imgBytes;
      if (sharp && (imgPath.endsWith('.webp') || imgPath.endsWith('.WebP'))) {
        imgBytes = await sharp(imgPath).jpeg({ quality: 90 }).toBuffer();
      } else {
        imgBytes = fs.readFileSync(imgPath);
      }

      const exhibitPage = outputDoc.addPage([792, 612]); // US Letter landscape
      const img = await outputDoc.embedJpg(imgBytes);
      const { width, height } = img.scale(1);
      const maxW = 680, maxH = 480;
      const scale = Math.min(maxW / width, maxH / height);

      const drawW = width * scale;
      const drawH = height * scale;
      const x = (792 - drawW) / 2;
      const y = (612 - drawH) / 2 + 20; // offset for label at bottom

      exhibitPage.drawImage(img, { x, y, width: drawW, height: drawH });

      // Label at bottom
      const font = await outputDoc.embedFont(StandardFonts.HelveticaBold);
      exhibitPage.drawText(page.label || '', {
        x: 36, y: 28, size: 9, font, color: rgb(0.55, 0.57, 0.66)
      });
      if (page.badge) {
        exhibitPage.drawText(`[${page.badge}]`, {
          x: 720, y: 28, size: 8, font, color: rgb(0.49, 0.44, 0.97)
        });
      }

    } else if (page.type === 'cover' || page.type === 'divider') {
      // TODO: Render HTML template via Puppeteer and append resulting PDF
      console.warn(`[assemble-sample-pack]   TODO: ${page.type} pages require Puppeteer — not implemented yet.`);
    }
  }

  const pdfBytes = await outputDoc.save();
  fs.writeFileSync(outputPath, pdfBytes);
  console.log(`[assemble-sample-pack] ✅ Done. Output: ${outputPath} (${Math.round(pdfBytes.byteLength / 1024)}KB)`);
}

main().catch(err => {
  console.error('[assemble-sample-pack] FATAL:', err.message);
  process.exit(1);
});
