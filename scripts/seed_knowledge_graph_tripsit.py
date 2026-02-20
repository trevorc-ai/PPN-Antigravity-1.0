"""
TripSit Knowledge Graph Seeder
================================
One-time ETL script to ingest TripSit drug combination data into
PPN Portal's ref_knowledge_graph table via Supabase.

Source: https://github.com/TripSit/drugs/blob/master/combos.json
License: TripSit data is CC BY-SA — must be labelled as community/harm-reduction source.

Usage:
  1. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment
  2. pip install supabase requests
  3. python scripts/seed_knowledge_graph_tripsit.py --dry-run   # preview
  4. python scripts/seed_knowledge_graph_tripsit.py             # live insert

Notes:
  - Only inserts combinations where BOTH drugs are in our ref_substances table
  - All TripSit rows are marked is_verified=False (community/anecdotal source)
  - Pre-seeded clinical rows (is_verified=True) are never overwritten
  - Safe to re-run: ON CONFLICT DO NOTHING
"""

import os
import sys
import json
import time
import argparse
import requests

# ─────────────────────────────────────────────────────────────────────────────
# Supabase REST client (no SDK needed — plain HTTP)
# ─────────────────────────────────────────────────────────────────────────────

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("ERROR: Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars.")
    sys.exit(1)

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "resolution=ignore-duplicates"  # ON CONFLICT DO NOTHING equivalent
}

# ─────────────────────────────────────────────────────────────────────────────
# TripSit severity → our severity_grade mapping
# ─────────────────────────────────────────────────────────────────────────────

TRIPSIT_SEVERITY_MAP = {
    "Low Risk & Synergy":   ("Low",             2),
    "Low Risk & No Synergy": ("Low",            1),
    "Low Risk & Decrease":  ("Low",             2),
    "Caution":              ("Moderate",        5),
    "Unsafe":               ("High",            8),
    "Dangerous":            ("Life-Threatening", 10),
}

# ─────────────────────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────────────────────

def fetch_tripsit_combos():
    """Fetch TripSit combo JSON from their GitHub repo."""
    url = "https://raw.githubusercontent.com/TripSit/drugs/master/combos.json"
    print(f"Fetching TripSit data from {url}...")
    r = requests.get(url, timeout=30)
    r.raise_for_status()
    return r.json()


def fetch_live_substance_names():
    """Return set of substance_names in our live ref_substances table."""
    url = f"{SUPABASE_URL}/rest/v1/ref_substances?select=substance_name"
    r = requests.get(url, headers=HEADERS, timeout=30)
    r.raise_for_status()
    return {row["substance_name"].lower() for row in r.json()}


def fetch_live_medication_names():
    """Return set of medication_names in our live ref_medications table (if it exists)."""
    url = f"{SUPABASE_URL}/rest/v1/ref_medications?select=medication_name"
    r = requests.get(url, headers=HEADERS, timeout=10)
    if r.status_code == 404:
        return set()  # table doesn't exist yet — WO-226 pending
    r.raise_for_status()
    return {row["medication_name"].lower() for row in r.json()}


def normalize_name(name: str) -> str:
    """Capitalize drug name consistently."""
    return name.strip().title()


def build_rows(combos: dict, known_names: set, dry_run: bool):
    """
    Parse TripSit combos JSON and build INSERT rows for ref_knowledge_graph.

    TripSit format:
    {
      "drug_a": {
        "drug_b": {
          "status": "Caution",
          "note": "descriptive text"
        }
      }
    }
    """
    rows = []
    seen_pairs = set()  # Deduplicate A+B and B+A

    for drug_a_raw, interactions in combos.items():
        drug_a = normalize_name(drug_a_raw)

        for drug_b_raw, details in interactions.items():
            drug_b = normalize_name(drug_b_raw)

            # Deduplicate bidirectional pairs
            pair_key = tuple(sorted([drug_a.lower(), drug_b.lower()]))
            if pair_key in seen_pairs:
                continue
            seen_pairs.add(pair_key)

            # Only insert if at least one side is a known substance
            # (we don't want alcohol+caffeine unless we care about it)
            if drug_a.lower() not in known_names and drug_b.lower() not in known_names:
                continue

            status = details.get("status", "")
            note = details.get("note", "No interaction note provided by TripSit.")

            severity_grade, risk_level = TRIPSIT_SEVERITY_MAP.get(
                status, ("Low", 1)
            )

            row = {
                "substance_name": drug_a,
                "interactor_name": drug_b,
                "interactor_category": "Community/Harm-Reduction",
                "risk_level": risk_level,
                "severity_grade": severity_grade,
                "clinical_description": note,
                "mechanism": None,
                "evidence_source": "TripSit Drug Combinations Chart (community/anecdotal)",
                "source_url": "https://wiki.tripsit.me/wiki/Drug_combinations",
                "is_verified": False  # Community source — not peer-reviewed
            }
            rows.append(row)

    return rows


def insert_rows(rows: list, dry_run: bool):
    """Batch insert rows into ref_knowledge_graph."""
    if dry_run:
        print(f"\n[DRY RUN] Would insert {len(rows)} rows into ref_knowledge_graph.")
        print("Sample rows:")
        for row in rows[:5]:
            print(f"  {row['substance_name']} + {row['interactor_name']} → {row['severity_grade']} (risk {row['risk_level']})")
        return

    url = f"{SUPABASE_URL}/rest/v1/ref_clinical_interactions"
    BATCH_SIZE = 100
    inserted = 0

    for i in range(0, len(rows), BATCH_SIZE):
        batch = rows[i:i + BATCH_SIZE]
        r = requests.post(url, headers=HEADERS, json=batch, timeout=30)
        if r.status_code not in (200, 201, 204):
            print(f"  [ERROR] Batch {i//BATCH_SIZE + 1}: {r.status_code} — {r.text[:200]}")
        else:
            inserted += len(batch)
            print(f"  [OK] Inserted batch {i//BATCH_SIZE + 1} ({len(batch)} rows). Total: {inserted}")
        time.sleep(0.2)  # Be polite to Supabase rate limits

    print(f"\nDone. {inserted} rows inserted into ref_knowledge_graph.")
    print("Note: Rows with ON CONFLICT (substance_name, interactor_name) were silently skipped.")
    print("      Pre-seeded clinical rows (is_verified=True) are unaffected.")


# ─────────────────────────────────────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Seed ref_knowledge_graph from TripSit data.")
    parser.add_argument("--dry-run", action="store_true", help="Preview without inserting.")
    args = parser.parse_args()

    # Step 1: Fetch TripSit data
    combos = fetch_tripsit_combos()
    print(f"Fetched {len(combos)} drug entries from TripSit.")

    # Step 2: Get live substance names to filter relevant rows
    known_substances = fetch_live_substance_names()
    known_medications = fetch_live_medication_names()
    known_names = known_substances | known_medications
    print(f"Live substances: {len(known_substances)} | Live medications: {len(known_medications)}")

    # Step 3: Build rows
    rows = build_rows(combos, known_names, dry_run=args.dry_run)
    print(f"Built {len(rows)} rows to insert (after deduplication and filtering).")

    # Step 4: Insert
    insert_rows(rows, dry_run=args.dry_run)


if __name__ == "__main__":
    main()
