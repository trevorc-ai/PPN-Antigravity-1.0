"""
seed_benchmark_trials.py
========================
WO-231 | BUILDER | ETL script for benchmark_trials table.

Fetches completed and active psychedelic clinical trials from ClinicalTrials.gov
API v2 and upserts them into PPN's benchmark_trials table.

Source:    ClinicalTrials.gov API v2 (U.S. Public Domain — no license restrictions)
Target:    public.benchmark_trials (Supabase)
License:   Federal government works not subject to copyright (17 U.S.C. § 105)

Usage:
  # Prerequisites
  pip install requests

  # Ensure env vars are set (backend/.env already has these):
  export SUPABASE_URL=https://rxwsthatjhnixqsthegf.supabase.co
  export SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

  # Dry run (preview without inserting)
  python backend/scripts/seed_benchmark_trials.py --dry-run

  # Live seed
  python backend/scripts/seed_benchmark_trials.py

Notes:
  - Safe to re-run: uses ON CONFLICT DO NOTHING on nct_id
  - Rate-limited: 0.2s sleep between batches to respect Supabase limits
  - Filters for 9 psychedelic modalities across all relevant conditions
  - Handles missing API fields gracefully (all nullable except nct_id + title)
"""

import os
import sys
import time
import argparse
import requests
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

UPSERT_URL = f"{SUPABASE_URL}/rest/v1/benchmark_trials"
BATCH_SIZE = 50

# ─────────────────────────────────────────────────────────────────────────────
# Modality keyword map
# Key = modality label stored in DB
# Value = search terms sent to ClinicalTrials.gov query.intr parameter
# ─────────────────────────────────────────────────────────────────────────────

MODALITY_SEARCHES = {
    "psilocybin":  ["psilocybin"],
    "mdma":        ["MDMA", "3,4-methylenedioxymethamphetamine"],
    "ketamine":    ["ketamine"],
    "esketamine":  ["esketamine", "Spravato"],
    "lsd":         ["lysergic acid diethylamide", "LSD-25"],
    "ayahuasca":   ["ayahuasca"],
    "dmt":         ["dimethyltryptamine", "DMT"],
    "ibogaine":    ["ibogaine"],
    "mescaline":   ["mescaline"],
}

CT_API = "https://clinicaltrials.gov/api/v2/studies"

# ─────────────────────────────────────────────────────────────────────────────
# ClinicalTrials.gov API fetcher
# ─────────────────────────────────────────────────────────────────────────────

def fetch_page(query_term: str, page_token: str = None) -> dict:
    """Fetch one page of results from ClinicalTrials.gov API v2."""
    params = {
        "query.intr": query_term,
        "filter.overallStatus": "COMPLETED,ACTIVE_NOT_RECRUITING,RECRUITING",
        "fields": ",".join([
            "protocolSection.identificationModule.nctId",
            "protocolSection.identificationModule.briefTitle",
            "protocolSection.designModule.phases",
            "protocolSection.statusModule.overallStatus",
            "protocolSection.conditionsModule.conditions",
            "protocolSection.designModule.enrollmentInfo",
            "protocolSection.statusModule.startDateStruct",
            "protocolSection.statusModule.completionDateStruct",
            "protocolSection.outcomesModule.primaryOutcomes",
            "protocolSection.contactsLocationsModule.locations",
        ]),
        "pageSize": 100,
        "format": "json",
    }
    if page_token:
        params["pageToken"] = page_token

    r = requests.get(CT_API, params=params, timeout=30)
    r.raise_for_status()
    return r.json()


def fetch_all_for_term(query_term: str) -> list[dict]:
    """Paginate through all results for a given search term."""
    studies = []
    page_token = None
    page_num = 1

    while True:
        try:
            data = fetch_page(query_term, page_token)
        except requests.RequestException as e:
            print(f"  [WARN] API error for '{query_term}' page {page_num}: {e}")
            break

        batch = data.get("studies", [])
        studies.extend(batch)

        page_token = data.get("nextPageToken")
        if not page_token or not batch:
            break

        page_num += 1
        time.sleep(0.3)  # Polite pacing

    return studies


# ─────────────────────────────────────────────────────────────────────────────
# Study parser
# ─────────────────────────────────────────────────────────────────────────────

def parse_study(study: dict, modality: str) -> dict | None:
    """
    Extract relevant fields from a ClinicalTrials.gov API v2 study object.
    Returns None for malformed records missing the NCT ID.
    All fields except nct_id and title are nullable.
    """
    try:
        proto = study.get("protocolSection", {})
        id_mod      = proto.get("identificationModule", {})
        status_mod  = proto.get("statusModule", {})
        design_mod  = proto.get("designModule", {})
        cond_mod    = proto.get("conditionsModule", {})
        outcomes_mod = proto.get("outcomesModule", {})
        locations_mod = proto.get("contactsLocationsModule", {})

        nct_id = id_mod.get("nctId")
        title  = id_mod.get("briefTitle", "")

        if not nct_id or not title:
            return None

        # Phase: array like ["PHASE2"] or ["PHASE2", "PHASE3"] — take first
        phases = design_mod.get("phases", [])
        phase  = phases[0] if phases else None

        # Country: first location's country
        locations = locations_mod.get("locations", [])
        country   = locations[0].get("country") if locations else None

        # Enrollment
        enroll_info = design_mod.get("enrollmentInfo", {})
        enrollment  = enroll_info.get("count")

        # Dates — stored as "YYYY-MM-DD" or "YYYY-MM"
        start_struct = status_mod.get("startDateStruct", {})
        start_date   = start_struct.get("date")
        if start_date and len(start_date) == 7:
            start_date = start_date + "-01"  # pad month-only dates

        comp_struct    = status_mod.get("completionDateStruct", {})
        completion_date = comp_struct.get("date")
        if completion_date and len(completion_date) == 7:
            completion_date = completion_date + "-01"

        # Primary outcome
        primary_outcomes = outcomes_mod.get("primaryOutcomes", [])
        primary_outcome  = primary_outcomes[0].get("measure") if primary_outcomes else None

        # Conditions
        conditions = cond_mod.get("conditions", [])

        return {
            "nct_id":                  nct_id,
            "title":                   title[:500],      # Truncate very long titles
            "phase":                   phase,
            "status":                  status_mod.get("overallStatus"),
            "modality":                modality,
            "conditions":              conditions,
            "country":                 country,
            "enrollment_actual":       enrollment,
            "start_date":              start_date,
            "completion_date":         completion_date,
            "primary_outcome_measure": primary_outcome,
            "source":                  "clinicaltrials.gov",
        }

    except Exception as e:
        print(f"  [WARN] Parse error for study: {e}")
        return None


# ─────────────────────────────────────────────────────────────────────────────
# Upsert
# ─────────────────────────────────────────────────────────────────────────────

def upsert_batch(rows: list[dict], dry_run: bool) -> int:
    """Upsert a batch of rows. Returns count of rows attempted."""
    if dry_run:
        return len(rows)

    r = requests.post(UPSERT_URL, headers=HEADERS, json=rows, timeout=30)
    if r.status_code not in (200, 201, 204):
        print(f"  [ERROR] Upsert failed: {r.status_code} — {r.text[:300]}")
        return 0
    return len(rows)


# ─────────────────────────────────────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Seed benchmark_trials from ClinicalTrials.gov API v2."
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Preview without inserting. Shows record count and sample rows.",
    )
    args = parser.parse_args()

    if args.dry_run:
        print("=" * 60)
        print("DRY RUN MODE — No data will be inserted")
        print("=" * 60)

    all_records: dict[str, dict] = {}  # nct_id → record (deduplication)
    modality_counts: dict[str, int] = {}

    for modality, search_terms in MODALITY_SEARCHES.items():
        modality_count = 0
        for term in search_terms:
            print(f"\n[{modality.upper()}] Fetching: '{term}'")
            studies = fetch_all_for_term(term)
            print(f"  → {len(studies)} studies returned from API")

            for study in studies:
                record = parse_study(study, modality)
                if record is None:
                    continue
                nct_id = record["nct_id"]
                if nct_id not in all_records:
                    all_records[nct_id] = record
                    modality_count += 1

        modality_counts[modality] = modality_count
        print(f"  [{modality.upper()}] {modality_count} unique trials collected")

    unique_records = list(all_records.values())
    total = len(unique_records)
    print(f"\n{'─'*60}")
    print(f"Total unique records after deduplication: {total}")

    if args.dry_run:
        print("\nSample records (first 5):")
        for r in unique_records[:5]:
            print(f"  {r['nct_id']} | {r['modality']:12} | {r['status']:30} | {r['title'][:50]}")
        print(f"\n[DRY RUN] Would insert {total} records into benchmark_trials.")
        print("[DRY RUN] Modality breakdown:")
        for m, c in modality_counts.items():
            print(f"  {m:15}: {c} trials")
        return

    # Live upsert in batches
    inserted = 0
    for i in range(0, total, BATCH_SIZE):
        batch = unique_records[i:i + BATCH_SIZE]
        count = upsert_batch(batch, dry_run=False)
        inserted += count
        print(f"  Batch {i // BATCH_SIZE + 1}: {count} rows → Total: {inserted}/{total}")
        time.sleep(0.2)

    print(f"\n{'=' * 60}")
    print(f"[STATUS: PASS] Seeded {inserted} benchmark trials into benchmark_trials.")
    print("\nBreakdown by modality:")
    for m, c in sorted(modality_counts.items(), key=lambda x: -x[1]):
        print(f"  {m:15}: {c} trials")
    print(f"\nCompleted at {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')} UTC")


if __name__ == "__main__":
    main()
