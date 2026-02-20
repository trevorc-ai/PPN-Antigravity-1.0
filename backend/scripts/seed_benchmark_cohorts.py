"""
seed_benchmark_cohorts.py
==========================
WO-231 | BUILDER + ANALYST | ETL script for benchmark_cohorts table.

Reads ANALYST's curated CSV of aggregate outcomes extracted from
peer-reviewed open-access publications and upserts to benchmark_cohorts.

Source:    backend/data/benchmark_cohorts_seed.csv (ANALYST-curated)
Target:    public.benchmark_cohorts (Supabase)
License:   Aggregate statistics from CC BY 4.0 / Open Access papers.
           Citation stored in source_citation column for full provenance.

Usage:
  # Prerequisites
  pip install requests

  # Ensure env vars are set:
  export SUPABASE_URL=https://rxwsthatjhnixqsthegf.supabase.co
  export SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

  # Dry run (preview without inserting)
  python backend/scripts/seed_benchmark_cohorts.py --dry-run

  # Live seed
  python backend/scripts/seed_benchmark_cohorts.py

Notes:
  - Skips rows with missing source_citation (citation integrity rule)
  - Skips rows with missing n_participants (required field)
  - Handles empty numeric fields as NULL
  - Safe to re-run: uses ON CONFLICT DO NOTHING
"""

import os
import sys
import csv
import time
import argparse
import requests
from pathlib import Path
from datetime import datetime

# ─────────────────────────────────────────────────────────────────────────────
# Environment
# ─────────────────────────────────────────────────────────────────────────────

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("ERROR: Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars.")
    print("  These are in backend/.env — run `source backend/.env` or set them manually.")
    sys.exit(1)

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "resolution=ignore-duplicates",   # ON CONFLICT DO NOTHING
}

UPSERT_URL   = f"{SUPABASE_URL}/rest/v1/benchmark_cohorts"
BATCH_SIZE   = 50
CSV_PATH     = Path(__file__).parent.parent / "data" / "benchmark_cohorts_seed.csv"

# ─────────────────────────────────────────────────────────────────────────────
# Numeric coercion
# ─────────────────────────────────────────────────────────────────────────────

def to_float(value: str) -> float | None:
    """Convert CSV string to float. Empty string → None."""
    if value is None or value.strip() == "":
        return None
    try:
        return float(value.strip())
    except ValueError:
        return None


def to_int(value: str) -> int | None:
    """Convert CSV string to int. Empty string → None."""
    if value is None or value.strip() == "":
        return None
    try:
        return int(float(value.strip()))
    except ValueError:
        return None


def to_bool(value: str) -> bool:
    """Convert string to bool. Defaults to True."""
    return value.strip().lower() not in ("false", "0", "no", "f")


# ─────────────────────────────────────────────────────────────────────────────
# CSV reader
# ─────────────────────────────────────────────────────────────────────────────

def read_csv(path: Path) -> list[dict]:
    """
    Read benchmark_cohorts_seed.csv and coerce all types.
    Returns list of DB-ready dicts. Skips invalid rows with a warning.
    """
    rows = []
    skipped = 0

    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for i, row in enumerate(reader, start=2):  # Row 1 = header, data rows start at 2

            # Citation integrity — must have source
            citation = row.get("source_citation", "").strip()
            if not citation:
                print(f"  [SKIP] Row {i}: missing source_citation — skipping.")
                skipped += 1
                continue

            # n_participants required
            n = to_int(row.get("n_participants", ""))
            if n is None:
                print(f"  [SKIP] Row {i} ('{row.get('cohort_name', '?')}'): missing n_participants — skipping.")
                skipped += 1
                continue

            # Modality + condition required
            modality  = row.get("modality", "").strip().lower()
            condition = row.get("condition", "").strip()
            instrument = row.get("instrument", "").strip()
            if not modality or not condition or not instrument:
                print(f"  [SKIP] Row {i}: missing modality/condition/instrument — skipping.")
                skipped += 1
                continue

            db_row = {
                "cohort_name":            row.get("cohort_name", "").strip(),
                "source_citation":        citation,
                "modality":               modality,
                "condition":              condition,
                "setting":                row.get("setting", "").strip() or None,
                "n_participants":         n,
                "country":                row.get("country", "").strip() or None,
                "instrument":             instrument,
                "baseline_mean":          to_float(row.get("baseline_mean")),
                "baseline_sd":            to_float(row.get("baseline_sd")),
                "endpoint_mean":          to_float(row.get("endpoint_mean")),
                "endpoint_sd":            to_float(row.get("endpoint_sd")),
                "followup_weeks":         to_int(row.get("followup_weeks")),
                "response_rate_pct":      to_float(row.get("response_rate_pct")),
                "remission_rate_pct":     to_float(row.get("remission_rate_pct")),
                "effect_size_hedges_g":   to_float(row.get("effect_size_hedges_g")),
                "adverse_event_rate_pct": to_float(row.get("adverse_event_rate_pct")),
                "data_freely_usable":     to_bool(row.get("data_freely_usable", "true")),
                "license":                row.get("license", "").strip() or None,
                "notes":                  row.get("notes", "").strip() or None,
            }
            rows.append(db_row)

    return rows, skipped


# ─────────────────────────────────────────────────────────────────────────────
# Upsert
# ─────────────────────────────────────────────────────────────────────────────

def upsert_rows(rows: list[dict], dry_run: bool) -> int:
    """Batch upsert rows into benchmark_cohorts. Returns count inserted."""
    inserted = 0
    for i in range(0, len(rows), BATCH_SIZE):
        batch = rows[i:i + BATCH_SIZE]

        if dry_run:
            for row in batch:
                print(
                    f"  [DRY] {row['cohort_name'][:50]:50} | "
                    f"{row['modality']:12} | {row['condition']:10} | "
                    f"n={row['n_participants']} | {row['instrument']}"
                )
            inserted += len(batch)
            continue

        r = requests.post(UPSERT_URL, headers=HEADERS, json=batch, timeout=30)
        if r.status_code not in (200, 201, 204):
            print(f"  [ERROR] Batch {i // BATCH_SIZE + 1}: {r.status_code} — {r.text[:300]}")
        else:
            inserted += len(batch)
            print(f"  Batch {i // BATCH_SIZE + 1}: {len(batch)} rows → Total: {inserted}")

        time.sleep(0.2)

    return inserted


# ─────────────────────────────────────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Seed benchmark_cohorts from ANALYST's CSV."
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Preview without inserting. Prints each row that would be seeded.",
    )
    args = parser.parse_args()

    # Check CSV exists
    if not CSV_PATH.exists():
        print(f"[WARN] CSV not found at {CSV_PATH}")
        print("  ANALYST has not yet created backend/data/benchmark_cohorts_seed.csv.")
        print("  Exiting gracefully — no data was inserted.")
        sys.exit(0)

    print(f"Reading: {CSV_PATH}")
    rows, skipped = read_csv(CSV_PATH)
    print(f"Found {len(rows)} valid rows ({skipped} skipped).\n")

    if args.dry_run:
        print("DRY RUN — No data will be inserted")
        print("=" * 80)

    inserted = upsert_rows(rows, dry_run=args.dry_run)

    print(f"\n{'=' * 60}")
    if args.dry_run:
        print(f"[DRY RUN] Would insert {inserted} benchmark cohorts.")
    else:
        print(f"[STATUS: PASS] Seeded {inserted} benchmark cohorts into benchmark_cohorts.")
    print(f"Skipped {skipped} malformed rows (see warnings above).")
    print(f"Completed at {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')} UTC")


if __name__ == "__main__":
    main()
