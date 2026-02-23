#!/usr/bin/env node
/**
 * 🤖 PPN SITE ROOMBA — Read-only forensic auditor
 *
 * Crawls src/ and reports:
 *   1. Defined routes in App.tsx
 *   2. Nav links in sidebar components
 *   3. Orphaned routes (defined but never linked)
 *   4. Dead nav links (linked but no matching route)
 *   5. All navigate() / <Link to=> calls across src/
 *   6. Free-text inputs in patient-context forms (PHI risk)
 *   7. External href links
 *
 * NEVER modifies any file. Output only.
 * Run: node scripts/roomba.js
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '..', 'src');
const OUT_DIR = path.join(__dirname, '..', '_WORK_ORDERS');
const NOW = new Date().toISOString().slice(0, 10);
const OUT_FILE = path.join(OUT_DIR, `ROOMBA_AUDIT_${NOW}.md`);

// ── Helpers ──────────────────────────────────────────────────────────────────

function walkDir(dir, exts = ['.tsx', '.ts', '.jsx', '.js']) {
    let files = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.git') {
            files = files.concat(walkDir(full, exts));
        } else if (entry.isFile() && exts.some(e => entry.name.endsWith(e))) {
            files.push(full);
        }
    }
    return files;
}

function readFile(f) {
    try { return fs.readFileSync(f, 'utf8'); } catch { return ''; }
}

function rel(f) {
    return f.replace(path.join(__dirname, '..') + path.sep, '');
}

// ── 1. Extract defined routes from App.tsx ────────────────────────────────────

function extractDefinedRoutes() {
    const appPath = path.join(SRC_DIR, 'App.tsx');
    if (!fs.existsSync(appPath)) {
        const alt = walkDir(SRC_DIR).find(f => f.endsWith('App.tsx') || f.endsWith('router.tsx'));
        if (!alt) return { routes: [], file: 'NOT FOUND' };
        return extractRoutesFromFile(alt);
    }
    return extractRoutesFromFile(appPath);
}

function extractRoutesFromFile(file) {
    const content = readFile(file);
    const routes = [];
    // Match path="..." or path='...'
    const routeRe = /path\s*=\s*["']([^"']+)["']/g;
    let m;
    while ((m = routeRe.exec(content)) !== null) {
        routes.push(m[1]);
    }
    return { routes: [...new Set(routes)], file: rel(file) };
}

// ── 2. Extract nav links from sidebar/nav components ─────────────────────────

function extractNavLinks() {
    const allFiles = walkDir(SRC_DIR);
    const navFiles = allFiles.filter(f => {
        const name = path.basename(f).toLowerCase();
        return name.includes('sidebar') || name.includes('nav') || name.includes('menu') || name.includes('topheader') || name.includes('appshell');
    });

    const links = [];
    for (const file of navFiles) {
        const content = readFile(file);
        // Match to="..." or to='...' (React Router Link)
        const toRe = /\bto\s*=\s*["']([^"']+)["']/g;
        let m;
        while ((m = toRe.exec(content)) !== null) {
            if (m[1].startsWith('/') || m[1].startsWith('#')) {
                links.push({ path: m[1].split('?')[0].split('#')[0], file: rel(file) });
            }
        }
        // Match href="..." pointing to internal paths
        const hrefRe = /href\s*=\s*["'](\/?[^"'http][^"']*?)["']/g;
        while ((m = hrefRe.exec(content)) !== null) {
            links.push({ path: m[1].split('?')[0], file: rel(file) });
        }
    }
    return links;
}

// ── 3. Extract ALL navigate() calls across src/ ───────────────────────────────

function extractNavigateCalls() {
    const allFiles = walkDir(SRC_DIR);
    const calls = [];
    for (const file of allFiles) {
        const content = readFile(file);
        const lines = content.split('\n');
        lines.forEach((line, idx) => {
            // navigate('...') or navigate("...")
            const navRe = /navigate\s*\(\s*["']([^"']+)["']/g;
            let m;
            while ((m = navRe.exec(line)) !== null) {
                if (m[1].startsWith('/')) {
                    calls.push({ path: m[1].split('?')[0], file: rel(file), line: idx + 1 });
                }
            }
            // <Link to="..."> in JSX
            const linkRe = /\bto\s*=\s*["']([^"']+)["']/g;
            while ((m = linkRe.exec(line)) !== null) {
                if (m[1].startsWith('/')) {
                    calls.push({ path: m[1].split('?')[0], file: rel(file), line: idx + 1 });
                }
            }
        });
    }
    return calls;
}

// ── 4. Free-text input in patient-context forms ───────────────────────────────

function auditFreeTextInputs() {
    const PATIENT_DIRS = [
        path.join(SRC_DIR, 'components', 'arc-of-care-forms'),
        path.join(SRC_DIR, 'components', 'wellness-journey'),
    ];
    const PATIENT_PAGES = ['WellnessJourney', 'DosingSession', 'PreparationPhase', 'IntegrationPhase'];

    const violations = [];
    const allFiles = walkDir(SRC_DIR);

    for (const file of allFiles) {
        const isPatientContext = PATIENT_DIRS.some(d => file.startsWith(d)) ||
            PATIENT_PAGES.some(p => path.basename(file).includes(p));

        if (!isPatientContext) continue;

        const content = readFile(file);
        const lines = content.split('\n');
        lines.forEach((line, idx) => {
            const hasTextInput = /<textarea|type=["']text["']|type=["']email["']/.test(line);
            const isNumericSafe = /inputMode.*numeric|pattern.*0-9|search|Search|filter|Filter/.test(line);
            const hasUiOnlyComment = /UI-ONLY/.test(content.slice(Math.max(0, content.indexOf(line) - 200), content.indexOf(line) + 200));

            if (hasTextInput && !isNumericSafe) {
                violations.push({
                    file: rel(file),
                    line: idx + 1,
                    content: line.trim(),
                    uiOnlyCommented: hasUiOnlyComment,
                });
            }
        });
    }
    return violations;
}

// ── 5. External href audit ────────────────────────────────────────────────────

function auditExternalLinks() {
    const allFiles = walkDir(SRC_DIR);
    const external = [];
    for (const file of allFiles) {
        const content = readFile(file);
        const lines = content.split('\n');
        lines.forEach((line, idx) => {
            const hrefRe = /href\s*=\s*["'](https?:\/\/[^"']+)["']/g;
            let m;
            while ((m = hrefRe.exec(line)) !== null) {
                external.push({ url: m[1], file: rel(file), line: idx + 1 });
            }
        });
    }
    return external;
}

// ── Run & Report ─────────────────────────────────────────────────────────────

console.log('🤖 PPN Site Roomba starting...\n');

const { routes: definedRoutes, file: appFile } = extractDefinedRoutes();
const navLinks = extractNavLinks();
const navigateCalls = extractNavigateCalls();
const freeTextViolations = auditFreeTextInputs();
const externalLinks = auditExternalLinks();

// All paths referenced anywhere in the app
const allReferencedPaths = new Set([
    ...navLinks.map(l => l.path),
    ...navigateCalls.map(c => c.path),
]);

// Orphaned: defined in App.tsx but never referenced in nav or navigate()
const orphanedRoutes = definedRoutes.filter(r =>
    !allReferencedPaths.has(r) &&
    r !== '/' &&
    r !== '*' &&
    !r.includes(':')  // skip dynamic routes like /clinician/:id
);

// Dead nav links: referenced in sidebar but not defined in App.tsx
const definedSet = new Set(definedRoutes);
const deadNavLinks = navLinks.filter(l =>
    l.path.startsWith('/') &&
    !definedSet.has(l.path) &&
    !l.path.includes(':')
);

// Navigate calls pointing to undefined routes
const deadNavigateCalls = navigateCalls.filter(c =>
    !definedSet.has(c.path) &&
    !c.path.includes(':')
);

// ── Build report ──────────────────────────────────────────────────────────────

const lines = [];
const ts = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });

lines.push(`# 🤖 PPN Site Roomba — Audit Report`);
lines.push(`**Generated:** ${ts} PST`);
lines.push(`**Router file:** \`${appFile}\``);
lines.push(`**Read-only audit — no files were modified.**`);
lines.push(``);
lines.push(`---`);
lines.push(``);

// Summary
lines.push(`## Summary`);
lines.push(`| Finding | Count |`);
lines.push(`|---------|-------|`);
lines.push(`| Defined routes (App.tsx) | ${definedRoutes.length} |`);
lines.push(`| Orphaned routes (defined, never linked) | ${orphanedRoutes.length} |`);
lines.push(`| Dead nav links (linked, not defined) | ${deadNavLinks.length} |`);
lines.push(`| Dead navigate() calls | ${deadNavigateCalls.length} |`);
lines.push(`| Free-text inputs in patient forms | ${freeTextViolations.length} |`);
lines.push(`| External links | ${externalLinks.length} |`);
lines.push(``);

// 1. All defined routes
lines.push(`## 1. All Defined Routes (App.tsx)`);
if (definedRoutes.length === 0) {
    lines.push(`> ⚠️ No routes found. Check that App.tsx exists at \`${appFile}\`.`);
} else {
    definedRoutes.forEach(r => lines.push(`- \`${r}\``));
}
lines.push(``);

// 2. Orphaned routes
lines.push(`## 2. Orphaned Routes — Defined but Never Linked`);
lines.push(`> These routes exist in App.tsx but have no sidebar link, \`<Link>\`, or \`navigate()\` pointing to them.`);
lines.push(`> They are reachable only by typing the URL directly.`);
lines.push(``);
if (orphanedRoutes.length === 0) {
    lines.push(`✅ None found.`);
} else {
    orphanedRoutes.forEach(r => lines.push(`- \`${r}\` — [ACTION REQUIRED] either add a nav entry or remove the route`));
}
lines.push(``);

// 3. Dead nav links
lines.push(`## 3. Dead Nav Links — Sidebar Points Nowhere`);
lines.push(`> These links appear in navigation but have no matching route in App.tsx.`);
lines.push(``);
if (deadNavLinks.length === 0) {
    lines.push(`✅ None found.`);
} else {
    deadNavLinks.forEach(l => lines.push(`- \`${l.path}\` — referenced in \`${l.file}\``));
}
lines.push(``);

// 4. Dead navigate() calls
lines.push(`## 4. Dead navigate() Calls — Programmatic Navigation to Undefined Routes`);
lines.push(``);
if (deadNavigateCalls.length === 0) {
    lines.push(`✅ None found.`);
} else {
    deadNavigateCalls.forEach(c => lines.push(`- \`${c.path}\` — \`${c.file}\` line ${c.line}`));
}
lines.push(``);

// 5. Free-text input violations
lines.push(`## 5. Free-Text Inputs in Patient-Context Forms — PHI Risk Audit`);
lines.push(`> Any \`<textarea>\` or \`type="text"\` in patient-context forms must be UI-only (never persisted).`);
lines.push(`> Items without a \`{/* UI-ONLY */}\` comment need manual review.`);
lines.push(``);
if (freeTextViolations.length === 0) {
    lines.push(`✅ None found.`);
} else {
    freeTextViolations.forEach(v => {
        const status = v.uiOnlyCommented ? '🟡 Has UI-ONLY comment (verify persistence)' : '🔴 No UI-ONLY comment — needs INSPECTOR review';
        lines.push(`- **${v.file}** line ${v.line}: ${status}`);
        lines.push(`  \`\`\`\n  ${v.content}\n  \`\`\``);
    });
}
lines.push(``);

// 6. External links
lines.push(`## 6. External Links Inventory`);
lines.push(`> All outbound \`href\` links found in source. Verify none point to localhost, staging, or dead domains.`);
lines.push(``);
if (externalLinks.length === 0) {
    lines.push(`✅ None found.`);
} else {
    externalLinks.forEach(l => lines.push(`- \`${l.url}\` — \`${l.file}\` line ${l.line}`));
}
lines.push(``);
lines.push(`---`);
lines.push(`*Roomba complete. No files were modified. Review findings above and create work orders for any items requiring action.*`);

// Write output
fs.writeFileSync(OUT_FILE, lines.join('\n'), 'utf8');
console.log(`✅ Audit complete. Report saved to:\n   ${OUT_FILE}`);
console.log(`\nSummary:`);
console.log(`  Orphaned routes:       ${orphanedRoutes.length}`);
console.log(`  Dead nav links:        ${deadNavLinks.length}`);
console.log(`  Dead navigate() calls: ${deadNavigateCalls.length}`);
console.log(`  Free-text violations:  ${freeTextViolations.length}`);
console.log(`  External links:        ${externalLinks.length}`);
