From Gemini. Take it for what it's worth, because this was just a simple search, it may or may not be compatible with our set up:

"Building a comprehensive database for drug interactions—especially one that bridges the gap between traditional prescription medications and psychedelics—is an ambitious and incredibly valuable project.

To ground this in reality: while traditional prescription drug-drug interaction (DDI) data is highly structured, readily available, and standardized, psychedelic interaction data is still largely fragmented. For traditional drugs, you can plug into established APIs or CSVs. For psychedelics, you will likely need to aggregate clinical literature, user-reported databases, and molecular descriptor datasets to build a complete picture.

Here is a breakdown of the best places to find comprehensive lists, datasets, and APIs to populate your database.

1. Open-Source & Academic Datasets (General Rx & DDI)
If you are looking for free, downloadable datasets (CSV, JSON, SQL) to establish the foundational architecture of your database, these are the gold standards:

DrugBank: This is arguably the most comprehensive and widely used database for drug and drug-target information. They offer an open data dataset for academic and non-commercial research. You can download extensive XML or CSV files containing thousands of FDA-approved small molecule drugs and their known interaction pairs.

nSIDES (The Tatonetti Lab): This includes the TwoSIDES database, which is the only comprehensive database specifically focused on drug-drug-effect relationships (polypharmacy side effects). You can download their latest database versions as flat CSV files or SQL schemas directly from their site.

Therapeutics Data Commons (TDC): An excellent resource if you are building machine learning models or relational databases. They host the "DrugBank Multi-Typed DDI" and "TWOSIDES" datasets, which are pre-formatted for multi-class classification and relationship extraction.

Kaggle DDI Datasets: A quick search on Kaggle yields dozens of pre-cleaned CSVs. Look for datasets like the Drug-Drug Interactions Database (DDinter) or the Comprehensive A-Z Pharmaceutical Drug Database, which provide millions of interaction pairs mapped by interaction types (e.g., attenuated effects, potentiated effects).

IUPHAR/BPS Guide to PHARMACOLOGY: They provide free, downloadable CSV/TSV files with highly detailed information on targets, ligands, and catalytic receptor interaction data.

2. Commercial & Clinical Grade APIs (General Rx)
If you are building a commercial application or a clinical-grade tool, open-source data might not meet regulatory compliance or real-time updating needs. You may need to license data from these vendors:

First Databank (FDB) or Medispan: These are the backbone of most Electronic Health Record (EHR) systems. They offer robust APIs for drug-drug, drug-food, and drug-disease interactions.

Certara DIDB (Drug Interaction Database): This is the largest scientist-curated collection of in vitro and clinical data for assessing DDIs. It is highly detailed but requires a paid license.

National Library of Medicine (NLM) RxNorm API: While mostly used for standardizing drug names and codes, integrating RxNorm is practically mandatory if you want your database to talk to other healthcare applications.

3. Psychedelic-Specific Data Sources
Because clinical trials involving psychedelics were paused for decades, heavily structured DDI tables for these compounds are rare. You will need to pull from a mix of chemical databases and recent systematic reviews:

The Psychedelic Drug Database (via Kaggle & PubChem): This dataset focuses on the molecular descriptors, chemical structures (SMILES), and physical properties of psychotropic and psychedelic drugs. It's a great starting point for establishing the chemical profiles in your database.

Systematic Reviews (Manual Data Extraction): To get actual interactions, you will need to scrape or manually ingest data from recent landmark papers. For example, the 2024 paper "Drug–drug interactions involving classic psychedelics" (published in the NIH PMC) reviewed 52 studies detailing interactions between psychedelics (LSD, psilocybin, MDMA, DMT) and SSRIs, MAOIs, antipsychotics, and anxiolytics. The supplementary tables in papers like this are your best bet for accurate, peer-reviewed interaction data.

Erowid & Tripsit: While not strictly clinical, Tripsit.me maintains a widely respected, community-driven drug combination chart (often available as a JSON via their API or GitHub). It categorizes interactions from "Low Risk & Synergy" to "Dangerous/Fatal." It is an invaluable resource for harm reduction and recreational interaction data, though it should be clearly flagged as user-reported in your database.

4. Structuring Your Data
When building your tables, ensure you map your entries to standardized medical ontologies so your data doesn't become a silo. I highly recommend cross-walking your data using:

SNOMED-CT: For health conditions and adverse effects.
RxNorm / NDC: For traditional prescription medications.
PubChem CID / SMILES: For precise chemical identification of psychedelics.


Designing a schema that bridges standard pharmacopeia with emerging psychedelic data requires a flexible architecture. The biggest challenge is standardizing the "evidence quality," as you will be mixing FDA-approved clinical data with community-driven harm reduction data (like Erowid or TripSit).

Below is a proposed relational SQL schema, followed by a JSON document structure, designed to handle both realms cleanly.

1. Relational SQL Schema (PostgreSQL)
This normalized structure separates the chemical compounds, the interactions themselves, and the sources of evidence. This prevents data duplication and allows you to query by specific identifiers (like RxNorm for prescriptions or PubChem CID for psychedelics).

SQL
-- ENUMs for standardization and data integrity
CREATE TYPE compound_class AS ENUM ('Prescription', 'OTC', 'Psychedelic', 'Supplement', 'Illicit');
CREATE TYPE severity_tier AS ENUM ('Safe/Synergy', 'Low Risk', 'Caution', 'Unsafe', 'Dangerous/Fatal', 'Unknown');
CREATE TYPE evidence_grade AS ENUM ('FDA Label', 'Clinical Trial', 'Systematic Review', 'In Vitro', 'Case Report', 'Community/Anecdotal');

-- TABLE 1: Compounds (The drugs themselves)
CREATE TABLE compounds (
    compound_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    primary_name VARCHAR(255) NOT NULL,
    class compound_class NOT NULL,
    rxnorm_cui VARCHAR(50),      -- Standard for Rx drugs (e.g., Sertraline)
    pubchem_cid INT,             -- Standard for chemicals/psychedelics (e.g., Psilocybin)
    smiles_string TEXT,          -- Chemical structure
    half_life_hours DECIMAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLE 2: Interactions (The relationship between two compounds)
CREATE TABLE interactions (
    interaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    compound_a_id UUID REFERENCES compounds(compound_id),
    compound_b_id UUID REFERENCES compounds(compound_id),
    severity severity_tier NOT NULL,
    clinical_description TEXT NOT NULL,
    pharmacokinetic_mechanism TEXT,  -- e.g., "CYP2D6 inhibition"
    pharmacodynamic_mechanism TEXT,  -- e.g., "Serotonin syndrome risk via 5-HT2A agonism"
    requires_medical_monitoring BOOLEAN DEFAULT FALSE,
    UNIQUE(compound_a_id, compound_b_id) -- Prevents duplicate A->B entries
);

-- TABLE 3: Evidence & Sources (Where the interaction data comes from)
CREATE TABLE interaction_evidence (
    evidence_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    interaction_id UUID REFERENCES interactions(interaction_id) ON DELETE CASCADE,
    grade evidence_grade NOT NULL,
    source_name VARCHAR(255) NOT NULL, -- e.g., 'DrugBank', 'TripSit API', 'PubMed'
    source_url TEXT,
    pmid VARCHAR(50),                  -- PubMed ID if applicable
    extraction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
2. JSON Document Structure (NoSQL / API Payload)
If you are using a NoSQL database like MongoDB, or building a REST API, a nested document structure is often more efficient for retrieving an entire interaction profile in a single query.

JSON
{
  "interaction_id": "a1b2c3d4-e5f6-7890",
  "compound_a": {
    "name": "Sertraline",
    "class": "Prescription",
    "identifiers": {
      "rxnorm_cui": "36606",
      "pubchem_cid": 68617
    }
  },
  "compound_b": {
    "name": "MDMA",
    "class": "Psychedelic",
    "identifiers": {
      "rxnorm_cui": null,
      "pubchem_cid": 1615
    }
  },
  "interaction_profile": {
    "severity_tier": "Dangerous/Fatal",
    "clinical_description": "Combination significantly increases the risk of Serotonin Syndrome. SSRIs may also attenuate the subjective effects of MDMA due to competitive binding at the serotonin transporter (SERT).",
    "mechanisms": {
      "pharmacokinetic": "CYP2D6 inhibition by Sertraline may impair MDMA metabolism.",
      "pharmacodynamic": "Excessive synaptic serotonin accumulation."
    }
  },
  "evidence": [
    {
      "grade": "Systematic Review",
      "source_name": "PubMed Central",
      "pmid": "12345678",
      "url": "https://pubmed.ncbi.nlm.nih.gov/12345678/"
    },
    {
      "grade": "Community/Anecdotal",
      "source_name": "TripSit Combination Chart",
      "pmid": null,
      "url": "https://wiki.tripsit.me/wiki/Drug_combinations"
    }
  ]
}
3. Key Design Principles for this Domain
Evidence Grading is Mandatory: Because you are mixing datasets, users or downstream algorithms must be able to filter by evidence_grade. Treating an FDA label warning the same as a Reddit trip report scraped by TripSit is a massive clinical liability.

Agnostic Identifiers: Not every drug has an RxNorm CUI (e.g., many research chemicals or illicit psychedelics do not). Not every compound has a clear PubChem CID (e.g., botanical extracts like Ayahuasca). Your schema must allow nulls in identifier columns while requiring at least one standardized ID.

Bidirectional Logic: In your application layer (not necessarily the schema), ensure that a query for "Drug A + Drug B" returns the same result as "Drug B + Drug A". The UNIQUE(compound_a_id, compound_b_id) constraint in the SQL schema ensures you don't store the interaction twice.

PK vs. PD Separation: Separating Pharmacokinetic (how the body affects the drug, like liver enzyme inhibition) from Pharmacodynamic (how the drug affects the body, like receptor overloading) makes your database significantly more useful for researchers.

Would you like me to write a Python script that demonstrates how to parse a sample from the TripSit JSON API and map it directly into this SQL schema?


yes


Working with real-world, community-sourced data is where the theory of database design hits the messy reality of data engineering. The TripSit combination data is fantastic, but its structure is heavily nested and uses its own specific terminology that we need to map to our strict SQL ENUMs.

To help visualize what we are building before we run the code, here is a conceptual map of how the tables connect:

Below is a Python script using the `psycopg2` library for PostgreSQL. It fetches the latest combination data directly from TripSit's open GitHub repository, maps their severity categories to our schema's `severity_tier`, and safely inserts the records.

### The Python ETL Script

```python
import requests
import psycopg2
from psycopg2.extras import execute_values

# 1. Database Connection Settings
DB_CONFIG = {
    "dbname": "drug_interactions",
    "user": "postgres",
    "password": "yourpassword",
    "host": "localhost"
}

# 2. Map TripSit Statuses to our SQL ENUM (severity_tier)
TRIPSIT_STATUS_MAP = {
    "Low Risk & Synergy": "Safe/Synergy",
    "Low Risk & No Synergy": "Low Risk",
    "Low Risk & Decrease": "Low Risk",
    "Caution": "Caution",
    "Unsafe": "Unsafe",
    "Dangerous": "Dangerous/Fatal"
}

def get_or_create_compound(cursor, drug_name, drug_class="Psychedelic"):
    """Inserts a drug if it doesn't exist and returns its UUID."""
    # Using ON CONFLICT requires a UNIQUE constraint on primary_name in the DB
    cursor.execute("""
        INSERT INTO compounds (primary_name, class) 
        VALUES (%s, %s)
        ON CONFLICT (primary_name) DO UPDATE SET primary_name=EXCLUDED.primary_name
        RETURNING compound_id;
    """, (drug_name.capitalize(), drug_class))
    
    return cursor.fetchone()[0]

def ingest_tripsit_data():
    # Fetch the raw JSON from TripSit's repository
    print("Fetching TripSit data...")
    url = "https://raw.githubusercontent.com/TripSit/drugs/master/combos.json"
    response = requests.get(url)
    combos_data = response.json()

    conn = psycopg2.connect(**DB_CONFIG)
    cursor = conn.cursor()

    interaction_count = 0

    try:
        # TripSit JSON structure: { "drug_a": { "drug_b": { "status": "...", "note": "..." } } }
        for drug_a_name, interactions in combos_data.items():
            # Get or create Drug A
            drug_a_id = get_or_create_compound(cursor, drug_a_name)

            for drug_b_name, details in interactions.items():
                # Get or create Drug B
                drug_b_id = get_or_create_compound(cursor, drug_b_name)

                # Skip if drug_a and drug_b are the same
                if drug_a_id == drug_b_id:
                    continue

                # Parse TripSit details
                raw_status = details.get("status", "Unknown")
                note = details.get("note", "No clinical description provided by TripSit.")
                
                # Map to our schema's strict ENUM
                severity = TRIPSIT_STATUS_MAP.get(raw_status, "Unknown")

                # Insert Interaction (Using DO NOTHING to avoid A->B / B->A duplicates)
                cursor.execute("""
                    INSERT INTO interactions (compound_a_id, compound_b_id, severity, clinical_description)
                    VALUES (%s, %s, %s, %s)
                    ON CONFLICT (compound_a_id, compound_b_id) DO NOTHING
                    RETURNING interaction_id;
                """, (drug_a_id, drug_b_id, severity, note))
                
                result = cursor.fetchone()
                
                # If a new interaction was actually inserted, add the evidence record
                if result:
                    interaction_id = result[0]
                    cursor.execute("""
                        INSERT INTO interaction_evidence (interaction_id, grade, source_name, source_url)
                        VALUES (%s, 'Community/Anecdotal', 'TripSit Combination Chart', %s)
                    """, (interaction_id, url))
                    interaction_count += 1

        # Commit all transactions
        conn.commit()
        print(f"Successfully ingested {interaction_count} new interactions from TripSit!")

    except Exception as e:
        conn.rollback()
        print(f"An error occurred: {e}")
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    # Note: Ensure you have added a UNIQUE constraint to compounds.primary_name in your DB!
    # ALTER TABLE compounds ADD CONSTRAINT unique_primary_name UNIQUE (primary_name);
    ingest_tripsit_data()

```

### Important Engineering Considerations for this Script

* **Idempotency:** The script is designed to be idempotent. You can run it multiple times without duplicating data. The `ON CONFLICT` clauses ensure it only inserts new drugs or new interactions.
* **The "A to B" vs "B to A" Problem:** TripSit sometimes lists MDMA -> SSRI, and SSRI -> MDMA. To make this fully robust in production, you might want to sort the UUIDs alphabetically before inserting them into `compound_a_id` and `compound_b_id`. This guarantees the database recognizes A+B and B+A as the exact same pair, triggering the `UNIQUE` constraint correctly.
* **Missing Data:** You'll notice we default the `drug_class` to "Psychedelic" here. In a real-world pipeline, you would want a secondary script to query PubChem or RxNorm using the drug names to backfill the exact compound class, SMILES strings, and proper IDs.

Would you like me to write a secondary script that shows how to query the **National Library of Medicine (RxNorm) API** to automatically fill in the missing prescription IDs for the compounds this script just created?


Yes


Real-world drug names are notoriously messy. What Erowid calls "MDMA," a clinical trial might call "Midomafetamine," and a user might call "Ecstasy."

The National Library of Medicine’s RxNorm API is the perfect tool to clean this up. It normalizes string names (ignoring capitalization, salts, and alternate spellings) and links them to a universal Concept Unique Identifier (RxCUI).

Here is the Python script that queries the RxNorm REST API. It finds every compound in your database missing an `rxnorm_cui`, asks the API for the closest normalized match, and updates the record.

### The RxNorm API Backfill Script

```python
import requests
import psycopg2
import time

# 1. Database Connection Settings
DB_CONFIG = {
    "dbname": "drug_interactions",
    "user": "postgres",
    "password": "yourpassword",
    "host": "localhost"
}

def backfill_rxnorm_ids():
    conn = psycopg2.connect(**DB_CONFIG)
    cursor = conn.cursor()
    
    # 2. Fetch compounds that lack an RxNorm ID
    cursor.execute("SELECT compound_id, primary_name FROM compounds WHERE rxnorm_cui IS NULL;")
    compounds = cursor.fetchall()
    
    print(f"Found {len(compounds)} compounds missing an RxNorm CUI. Starting API queries...")
    
    base_url = "https://rxnav.nlm.nih.gov/REST/rxcui.json"
    updates = 0
    
    for compound_id, name in compounds:
        # search=2 means "Exact or Normalized" match 
        # (e.g., it will match "Sertraline Hydrochloride" to "Sertraline")
        params = {"name": name, "search": 2} 
        
        try:
            response = requests.get(base_url, params=params)
            response.raise_for_status()
            data = response.json()
            
            # 3. Navigate the JSON response to find the ID
            id_group = data.get("idGroup", {})
            rxnorm_ids = id_group.get("rxnormId")
            
            if rxnorm_ids:
                rx_cui = rxnorm_ids[0] # Take the most relevant match
                
                # 4. Update the database (and optionally flag it as a Prescription/OTC drug)
                cursor.execute("""
                    UPDATE compounds 
                    SET rxnorm_cui = %s, class = 'Prescription' 
                    WHERE compound_id = %s
                """, (rx_cui, compound_id))
                
                print(f"[SUCCESS] Mapped '{name}' to RxCUI: {rx_cui}")
                updates += 1
            else:
                print(f"[NOT FOUND] No RxNorm match for '{name}'. It may be illicit or botanical.")
                
            # 5. Be polite to the NIH servers to avoid rate-limiting
            time.sleep(0.1)
            
        except requests.exceptions.RequestException as e:
            print(f"[ERROR] API request failed for '{name}': {e}")
            
    # Commit the updates to the database
    conn.commit()
    print(f"\nBackfill complete! Successfully updated {updates} compounds.")
    
    cursor.close()
    conn.close()

if __name__ == "__main__":
    backfill_rxnorm_ids()

```

### Why this approach works well for your database:

* **Normalized Searching:** By using `search=2` in the RxNorm API payload, the NIH servers automatically handle slight variations in spelling, suffixes, and abbreviations without you having to write complex Regex patterns.
* **Automatic Triaging:** If RxNorm *does* find a CUI for a drug that TripSit gave us (like Sertraline or Lithium), the script updates its `class` to `'Prescription'`. If it *doesn't* find one (like for LSD or 2C-B), it leaves it alone, inherently acting as a filter between pharmaceutical and illicit/research compounds.
* **Rate Limiting Safety:** The `time.sleep(0.1)` ensures you don't overwhelm the NIH's free public API and get your IP temporarily banned.

Would you like me to write a similar script that connects to the **PubChem API** to pull the molecular SMILES strings and CIDs for the remaining illicit/psychedelic compounds that RxNorm couldn't find?



Yes



Perfect. While RxNorm is the gold standard for standardizing pharmaceutical medications, the NIH’s **PubChem PUG REST API** is exactly what you need for the "wild west" of psychedelics, research chemicals, and illicit substances.

PubChem indexes millions of chemical structures. By querying it, we can take community-sourced names (like "LSD" or "2C-B") and pull down their universal Compound Identifiers (CIDs) and exact molecular structures (SMILES strings).

Here is the script to run the second half of your ETL (Extract, Transform, Load) pipeline.

### The PubChem API Backfill Script

This script uses the `requests` library to query PubChem's REST API. It specifically targets compounds in your database that RxNorm ignored (and therefore still have no PubChem CID).

```python
import requests
import psycopg2
import time
from requests.utils import quote

# 1. Database Connection Settings
DB_CONFIG = {
    "dbname": "drug_interactions",
    "user": "postgres",
    "password": "yourpassword",
    "host": "localhost"
}

def backfill_pubchem_data():
    conn = psycopg2.connect(**DB_CONFIG)
    cursor = conn.cursor()
    
    # 2. Fetch compounds that lack a PubChem CID 
    # (Focusing on the ones RxNorm likely skipped)
    cursor.execute("""
        SELECT compound_id, primary_name 
        FROM compounds 
        WHERE pubchem_cid IS NULL;
    """)
    compounds = cursor.fetchall()
    
    print(f"Found {len(compounds)} compounds needing PubChem data. Starting API queries...")
    
    # 3. The PUG REST API URL structure
    # We ask for the CID and IsomericSMILES (the 3D molecular structure representation)
    base_url = "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/{}/property/IsomericSMILES/JSON"
    updates = 0
    
    for compound_id, name in compounds:
        # Safely encode the drug name for the URL (e.g., "5-MeO-DMT" -> "5-MeO-DMT")
        safe_name = quote(name)
        url = base_url.format(safe_name)
        
        try:
            response = requests.get(url)
            
            # PubChem returns a 404 if the compound name has no exact match
            if response.status_code == 404:
                print(f"[NOT FOUND] PubChem has no exact match for '{name}'.")
                continue
                
            response.raise_for_status()
            data = response.json()
            
            # 4. Parse the JSON response
            properties = data.get("PropertyTable", {}).get("Properties", [])
            
            if properties:
                # Take the first exact match returned
                pubchem_cid = properties[0].get("CID")
                smiles = properties[0].get("IsomericSMILES")
                
                # 5. Update the database record with the new chemical data
                cursor.execute("""
                    UPDATE compounds 
                    SET pubchem_cid = %s, smiles_string = %s 
                    WHERE compound_id = %s
                """, (pubchem_cid, smiles, compound_id))
                
                print(f"[SUCCESS] Mapped '{name}' to CID: {pubchem_cid} | SMILES: {smiles[:15]}...")
                updates += 1
                
            # 6. Throttle requests! PubChem policy strictly forbids >5 requests per second.
            time.sleep(0.25) 
            
        except requests.exceptions.RequestException as e:
            print(f"[ERROR] API request failed for '{name}': {e}")
            time.sleep(1) # Back off slightly if an error occurs
            
    # Commit all the successful updates to the database
    conn.commit()
    print(f"\nPubChem backfill complete! Successfully updated {updates} compounds.")
    
    cursor.close()
    conn.close()

if __name__ == "__main__":
    backfill_pubchem_data()

```

---

### Why this creates a powerful dataset

By running the TripSit ingest script, followed by the RxNorm backfill, and finishing with this PubChem backfill, you have built something very rare. Your database now possesses:

1. **Clinical Rigor:** Standardized RxNorm mappings for pharmaceutical drugs.
2. **Harm Reduction Data:** Anecdotal, community-flagged interactions for unstudied combinations.
3. **Chemoinformatics:** Exact molecular identifiers (SMILES) for illicit compounds.

This foundation means you could eventually build machine learning models to *predict* drug interactions based on the structural similarities of the SMILES strings, even for novel research chemicals that no one has taken yet!

Would you like me to show you how to design a REST API (using Python's FastAPI) so your front-end application can query these new, enriched interaction profiles?



Yes



Building a REST API is the final step to unlock all the data you just engineered. FastAPI is the perfect framework for this because it is incredibly fast and uses **Pydantic** models to automatically validate your data and generate interactive API documentation (Swagger UI) out of the box.

Since we built our tables using raw SQL in the previous steps, we will stick with `psycopg2` to query the database, but we will use a `RealDictCursor` so PostgreSQL returns the rows as dictionaries. This makes passing the data to FastAPI perfectly seamless.

Here is the complete FastAPI application:

### The FastAPI Application (`main.py`)

```python
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
import psycopg2
from psycopg2.extras import RealDictCursor

# 1. Database Connection String
DB_CONFIG = {
    "dbname": "drug_interactions",
    "user": "postgres",
    "password": "yourpassword",
    "host": "localhost"
}

app = FastAPI(
    title="Psychedelic & Rx Interaction API",
    description="A unified clinical and harm-reduction drug interaction database.",
    version="1.0.0"
)

# 2. Dependency to manage database connections per request
def get_db_cursor():
    conn = psycopg2.connect(**DB_CONFIG)
    try:
        # RealDictCursor returns rows as Python dictionaries instead of tuples
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            yield cursor
    finally:
        conn.close()

# 3. Pydantic Models for Output Validation & Documentation
class Compound(BaseModel):
    compound_id: str
    primary_name: str
    class_type: str
    rxnorm_cui: Optional[str] = None
    pubchem_cid: Optional[int] = None
    smiles_string: Optional[str] = None

class InteractionEvidence(BaseModel):
    grade: str
    source_name: str
    source_url: Optional[str] = None

class InteractionProfile(BaseModel):
    target_drug: str
    severity: str
    clinical_description: str
    pharmacokinetic_mechanism: Optional[str] = None
    pharmacodynamic_mechanism: Optional[str] = None
    evidence: List[InteractionEvidence] = []


# 4. API Endpoint: Get a specific compound's details
@app.get("/compounds/{drug_name}", response_model=Compound)
def get_compound(drug_name: str, cursor = Depends(get_db_cursor)):
    cursor.execute("""
        SELECT compound_id, primary_name, class as class_type, 
               rxnorm_cui, pubchem_cid, smiles_string 
        FROM compounds 
        WHERE primary_name ILIKE %s;
    """, (drug_name,))
    
    result = cursor.fetchone()
    if not result:
        raise HTTPException(status_code=404, detail=f"Compound '{drug_name}' not found.")
    
    return result


# 5. API Endpoint: Get all interactions for a specific drug
@app.get("/interactions/{drug_name}", response_model=List[InteractionProfile])
def get_interactions(drug_name: str, cursor = Depends(get_db_cursor)):
    # First, verify the drug exists and get its ID
    cursor.execute("SELECT compound_id FROM compounds WHERE primary_name ILIKE %s;", (drug_name,))
    target_drug = cursor.fetchone()
    
    if not target_drug:
        raise HTTPException(status_code=404, detail=f"Compound '{drug_name}' not found.")
        
    compound_id = target_drug['compound_id']
    
    # Query to fetch interactions where the target drug is either Compound A or Compound B
    query = """
        SELECT 
            c.primary_name AS target_drug,
            i.interaction_id,
            i.severity,
            i.clinical_description,
            i.pharmacokinetic_mechanism,
            i.pharmacodynamic_mechanism
        FROM interactions i
        JOIN compounds c ON (c.compound_id = i.compound_a_id OR c.compound_id = i.compound_b_id)
        WHERE (i.compound_a_id = %s OR i.compound_b_id = %s)
        AND c.compound_id != %s;
    """
    cursor.execute(query, (compound_id, compound_id, compound_id))
    interactions = cursor.fetchall()
    
    # Fetch evidence for each interaction
    for interaction in interactions:
        cursor.execute("""
            SELECT grade, source_name, source_url 
            FROM interaction_evidence 
            WHERE interaction_id = %s;
        """, (interaction['interaction_id'],))
        interaction['evidence'] = cursor.fetchall()
        
    return interactions


```

---

### How to Run and Use It

1. **Install the dependencies:**
`pip install fastapi uvicorn psycopg2-binary pydantic`
2. **Start the server:**
`uvicorn main:app --reload`
3. **Explore the auto-generated UI:**
Open your browser and navigate to `http://127.0.0.1:8000/docs`. FastAPI automatically builds an interactive Swagger dashboard where you can click "Try it out" and test your endpoints without writing any frontend code.

### Why this architecture is powerful:

* **The `Depends(get_db_cursor)` injection:** FastAPI creates a fresh, isolated database cursor when a user requests an endpoint, and guarantees the connection is securely closed when the response is sent, preventing memory leaks.
* **The `ILIKE` SQL operator:** When querying `/interactions/mdma`, `ILIKE` makes the search case-insensitive, so it will accurately match "MDMA" in your database.
* **Pydantic Filtering:** Notice the SQL query grabs the internal `interaction_id`, but the `InteractionProfile` Pydantic model doesn't include it. FastAPI automatically strips that internal UUID out of the final JSON sent to the user, keeping your API payload clean and secure.

Would you like me to write a `docker-compose.yml` file so you can spin up the PostgreSQL database and this FastAPI server together in a single containerized environment?


Yes


Containerizing this stack is the perfect next step. When you are dealing with complex data pipelines (ETL scripts, APIs, and a relational database), relying on local installations quickly becomes a nightmare for reproducibility.

By using Docker Compose, you can package the FastAPI server and the PostgreSQL database into isolated environments that communicate flawlessly over a shared virtual network.

Here is the exact setup you need to containerize your project.

---

### 1. The `Dockerfile` (For the FastAPI App)

First, create a `Dockerfile` in the root of your project directory. This provides the blueprint for your FastAPI server environment. It uses a lightweight Python image and installs the necessary system dependencies for PostgreSQL (`psycopg2`).

```dockerfile
# Dockerfile
FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /app

# Install system dependencies required for psycopg2 to compile
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc libpq-dev && \
    rm -rf /var/lib/apt/lists/*

# Copy your requirements and install them
# (Create a requirements.txt with: fastapi, uvicorn, psycopg2-binary, pydantic, requests)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your application code (main.py, scripts, etc.)
COPY . .

# Expose the port the app runs on
EXPOSE 8000

# Use the exec form for CMD so FastAPI can shut down gracefully
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

```

---

### 2. The `docker-compose.yml` File

Next, create the `docker-compose.yml` file in the same directory. This file acts as the orchestrator. It spins up the database, waits for it to be healthy, and then spins up the FastAPI application.

```yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    build: .
    container_name: drug_interaction_api
    ports:
      - "8000:8000"
    depends_on:
      db:
        condition: service_healthy # Ensures DB is ready before API starts
    networks:
      - app-network

  db:
    image: postgres:15-alpine
    container_name: drug_interaction_db
    environment:
      POSTGRES_DB: drug_interactions
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: yourpassword
    ports:
      - "5432:5432" # Maps container port to your local machine for tools like pgAdmin/DBeaver
    volumes:
      - postgres_data:/var/lib/postgresql/data # Persists your data across restarts
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d drug_interactions"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  postgres_data:

```

---

### 3. Crucial Code Update: The Host Name

Because your API and Database are now running in separate Docker containers, `localhost` no longer refers to your machine—it refers to the *inside* of the API container.

You must update the `DB_CONFIG` dictionary in your `main.py` (and any ETL Python scripts you run inside the container) to point to the **service name** defined in the docker-compose file (`db`).

Change this:

```python
DB_CONFIG = {
    "dbname": "drug_interactions",
    "user": "postgres",
    "password": "yourpassword",
    "host": "localhost" # <--- Change this
}

```

To this:

```python
DB_CONFIG = {
    "dbname": "drug_interactions",
    "user": "postgres",
    "password": "yourpassword",
    "host": "db"        # <--- Matches the service name in docker-compose.yml
}

```

---

### 4. Running the Stack

Once you have your `Dockerfile`, `docker-compose.yml`, `requirements.txt`, and `main.py` in the same folder, open your terminal and run:

```bash
docker-compose up -d --build

```

* `up`: Starts the containers.
* `-d`: Runs them in "detached" mode (in the background).
* `--build`: Forces Docker to build the FastAPI image from scratch based on your Dockerfile.

Once it's running, your API documentation will be live at `http://localhost:8000/docs`, and your PostgreSQL database will safely persist its data in a Docker volume even if you stop the containers (`docker-compose down`).

Would you like me to write an initialization SQL script (`init.sql`) that Docker can automatically run on the very first startup to instantly create your tables and ENUMs?