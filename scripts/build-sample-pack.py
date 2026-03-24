#!/usr/bin/env python3
"""
scripts/build-sample-pack.py
─────────────────────────────────────────────────────────────────────────────
PPN Sample Pack Builder — WO-645

Renders each React PDF route to a real PDF using Chrome headless, then
merges all PDFs into public/outreach/PPN_Sample_Outputs.pdf using
a pure-Python minimal PDF merger (no external libraries required).

USAGE:
    python3 scripts/build-sample-pack.py

REQUIREMENTS:
    - Dev server running at http://localhost:3000
    - Google Chrome installed at the standard macOS path

OUTPUT:
    public/outreach/PPN_Sample_Outputs.pdf
─────────────────────────────────────────────────────────────────────────────
"""

import subprocess, os, sys, time, struct, re, glob, tempfile, shutil

CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
BASE_URL = "http://localhost:3000/#"
OUTDIR = os.path.join(os.path.dirname(__file__), "..", "public", "outreach", "source-pdfs")
OUTPUT = os.path.join(os.path.dirname(__file__), "..", "public", "outreach", "PPN_Sample_Outputs.pdf")
CHROME_PROFILE = os.path.join(os.path.dirname(__file__), "..", "public", "outreach", ".chrome-headless-profile")


# Each (filename, route, wait_ms) — wait_ms lets the React page fully hydrate
ROUTES = [
    ("adverse-event-report.pdf",         "/ae-report-pdf",           4000),
    ("consent-plan.pdf",                  "/consent-plan-pdf",        4000),
    ("safety-plan.pdf",                   "/safety-plan-pdf",         4000),
    ("session-timeline.pdf",              "/session-timeline-pdf",    4000),
    ("transport-plan.pdf",                "/transport-plan-pdf",      4000),
    ("insurance-letter.pdf",              "/insurance-report-pdf",    4000),
    ("clinical-outcomes-report.pdf",      "/clinical-report-pdf",     6000),
]

def render_pdf(route, out_path, wait_ms=4000):
    """Use Chrome headless to print a route to PDF."""
    url = BASE_URL + route
    print(f"  → rendering {url}")
    result = subprocess.run([
        CHROME,
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        f"--user-data-dir={CHROME_PROFILE}",
        "--run-all-compositor-stages-before-draw",
        f"--virtual-time-budget={wait_ms}",
        f"--print-to-pdf={out_path}",
        "--print-to-pdf-no-header",
        url
    ], capture_output=True, timeout=60)
    if result.returncode != 0 and not os.path.exists(out_path):
        print(f"    ⚠ Chrome stderr: {result.stderr.decode()[:200]}")
        return False
    if os.path.exists(out_path):
        size_kb = os.path.getsize(out_path) // 1024
        print(f"    ✓ {os.path.basename(out_path)} ({size_kb} KB)")
        return True
    return False

# ─── Minimal pure-Python PDF merger ──────────────────────────────────────────
# Merges PDF files by re-writing a combined cross-reference table.
# Works for standard (non-encrypted, non-compressed-xref) PDFs produced by Chrome.

def read_pdf_bytes(path):
    with open(path, "rb") as f:
        return f.read()

def merge_pdfs(input_paths, output_path):
    """
    Minimal PDF merger using only Python stdlib.
    Strategy: use Chrome itself to merge by printing a wrapper HTML
    that loads each PDF via object tags — simpler and more reliable
    than low-level xref manipulation.
    """
    # Build a simple HTML wrapper with all PDFs embedded as pages
    # Then print THAT to PDF via Chrome
    html_parts = ["<!DOCTYPE html><html><head><style>"]
    html_parts.append("body{margin:0;padding:0;background:#fff;}")
    html_parts.append(".page{width:210mm;height:297mm;page-break-after:always;overflow:hidden;}")
    html_parts.append("embed{width:100%;height:100%;border:none;}")
    html_parts.append("@page{size:A4;margin:0;}")
    html_parts.append("</style></head><body>")

    for path in input_paths:
        abs_path = os.path.abspath(path)
        html_parts.append(f'<div class="page"><embed src="file://{abs_path}" type="application/pdf"></div>')

    html_parts.append("</body></html>")
    html = "\n".join(html_parts)

    wrapper_path = os.path.join(os.path.dirname(output_path), "_merge_wrapper.html")
    with open(wrapper_path, "w") as f:
        f.write(html)

    print(f"\n[merge] Rendering combined wrapper → {output_path}")
    result = subprocess.run([
        CHROME,
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        f"--user-data-dir={CHROME_PROFILE}",
        "--run-all-compositor-stages-before-draw",
        "--virtual-time-budget=8000",
        f"--print-to-pdf={output_path}",
        "--print-to-pdf-no-header",
        f"file://{wrapper_path}"
    ], capture_output=True, timeout=120)

    os.remove(wrapper_path)

    if os.path.exists(output_path):
        size_kb = os.path.getsize(output_path) // 1024
        print(f"[merge] ✅ {output_path} ({size_kb} KB)")
        return True
    print(f"[merge] ❌ Failed. Stderr: {result.stderr.decode()[:400]}")
    return False

def main():
    os.makedirs(OUTDIR, exist_ok=True)
    os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)

    print("\n[build-sample-pack] Phase 1: Rendering source PDFs via Chrome headless")
    rendered = []
    for filename, route, wait_ms in ROUTES:
        out_path = os.path.join(OUTDIR, filename)
        ok = render_pdf(route, out_path, wait_ms)
        if ok:
            rendered.append(out_path)
        else:
            print(f"    ✗ SKIPPED {filename} — render failed")

    if not rendered:
        print("[build-sample-pack] ❌ No PDFs rendered — is the dev server running on port 3000?")
        sys.exit(1)

    print(f"\n[build-sample-pack] Phase 2: Merging {len(rendered)} PDFs → PPN_Sample_Outputs.pdf")
    ok = merge_pdfs(rendered, os.path.abspath(OUTPUT))

    if ok:
        size_mb = os.path.getsize(os.path.abspath(OUTPUT)) / (1024 * 1024)
        print(f"\n[build-sample-pack] ✅ Done. {os.path.abspath(OUTPUT)} ({size_mb:.1f} MB)")
        if size_mb > 15:
            print(f"[build-sample-pack] ⚠ File is {size_mb:.1f} MB — exceeds 15 MB email limit")
    else:
        sys.exit(1)

if __name__ == "__main__":
    main()
