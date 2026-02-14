#!/usr/bin/env python3
"""
Molecular Structure Generator for PPN Research Portal
Generates scientifically accurate 2D molecular structures from canonical SMILES strings

Requirements:
    pip install rdkit requests pillow

Usage:
    python3 generate_molecules.py

Output:
    Saves SVG files to ../public/molecules/
"""

import requests
import json
from pathlib import Path

# Try to import RDKit (will fail if not installed)
try:
    from rdkit import Chem
    from rdkit.Chem import Draw
    from rdkit.Chem import AllChem
    RDKIT_AVAILABLE = True
except ImportError:
    print("⚠️  RDKit not installed. Please install with:")
    print("    conda install -c conda-forge rdkit")
    print("    or")
    print("    pip install rdkit")
    RDKIT_AVAILABLE = False

# Substance definitions
SUBSTANCES = {
    "psilocybin": {
        "pubchem_name": "psilocybin",
        "display_name": "Psilocybin"
    },
    "mdma": {
        "pubchem_name": "mdma",
        "display_name": "MDMA"
    },
    "ketamine": {
        "pubchem_name": "ketamine",
        "display_name": "Ketamine"
    },
    "lsd": {
        "pubchem_name": "lsd",
        "display_name": "LSD-25"
    },
    "5-meo-dmt": {
        "pubchem_name": "5-methoxy-n,n-dimethyltryptamine",
        "display_name": "5-MeO-DMT"
    },
    "ibogaine": {
        "pubchem_name": "ibogaine",
        "display_name": "Ibogaine"
    },
    "mescaline": {
        "pubchem_name": "mescaline",
        "display_name": "Mescaline"
    },
    "dmt": {
        "pubchem_name": "n,n-dimethyltryptamine",
        "display_name": "DMT"
    }
}

def fetch_smiles_from_pubchem(substance_name):
    """
    Fetch canonical SMILES string from PubChem API
    
    Args:
        substance_name: PubChem compound name
        
    Returns:
        tuple: (SMILES string, PubChem CID) or (None, None) if not found
    """
    url = f"https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/{substance_name}/property/CanonicalSMILES/JSON"
    
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        properties = data['PropertyTable']['Properties'][0]
        smiles = properties['CanonicalSMILES']
        cid = properties['CID']
        
        print(f"✅ Fetched SMILES for {substance_name}: {smiles[:50]}...")
        return smiles, cid
        
    except Exception as e:
        print(f"❌ Error fetching SMILES for {substance_name}: {e}")
        return None, None

def generate_2d_structure(smiles, output_path, size=(800, 800)):
    """
    Generate 2D molecular structure SVG from SMILES string using RDKit
    
    Args:
        smiles: Canonical SMILES string
        output_path: Path to save SVG file
        size: Image size in pixels (width, height)
        
    Returns:
        bool: True if successful, False otherwise
    """
    if not RDKIT_AVAILABLE:
        print("❌ RDKit not available. Cannot generate structure.")
        return False
    
    try:
        # Create molecule from SMILES
        mol = Chem.MolFromSmiles(smiles)
        
        if mol is None:
            print(f"❌ Invalid SMILES string: {smiles}")
            return False
        
        # Generate 2D coordinates
        AllChem.Compute2DCoords(mol)
        
        # Drawing options for professional appearance
        drawer = Draw.MolDraw2DSVG(size[0], size[1])
        
        # Set drawing options
        opts = drawer.drawOptions()
        opts.bondLineWidth = 2  # Professional bond thickness
        opts.atomLabelFontSize = 24  # Readable atom labels
        opts.clearBackground = False  # Transparent background
        
        # Draw molecule
        drawer.DrawMolecule(mol)
        drawer.FinishDrawing()
        
        # Get SVG content
        svg = drawer.GetDrawingText()
        
        # Save to file
        with open(output_path, 'w') as f:
            f.write(svg)
        
        print(f"✅ Generated 2D structure: {output_path}")
        return True
        
    except Exception as e:
        print(f"❌ Error generating structure: {e}")
        return False

def main():
    """Main execution function"""
    
    print("=" * 60)
    print("PPN Research Portal - Molecular Structure Generator")
    print("=" * 60)
    print()
    
    # Check RDKit availability
    if not RDKIT_AVAILABLE:
        print("⚠️  RDKit is required to generate molecular structures.")
        print("    Please install it first, then run this script again.")
        return
    
    # Create output directory
    output_dir = Path("../public/molecules")
    output_dir.mkdir(parents=True, exist_ok=True)
    print(f"📁 Output directory: {output_dir.absolute()}")
    print()
    
    # Generate structures for all substances
    results = {}
    
    for substance_id, info in SUBSTANCES.items():
        print(f"Processing: {info['display_name']}")
        print("-" * 40)
        
        # Fetch SMILES from PubChem
        smiles, cid = fetch_smiles_from_pubchem(info['pubchem_name'])
        
        if smiles is None:
            results[substance_id] = {"status": "failed", "reason": "SMILES fetch failed"}
            print()
            continue
        
        # Generate 2D structure
        output_path = output_dir / f"{substance_id}_rdkit.svg"
        success = generate_2d_structure(smiles, output_path)
        
        if success:
            results[substance_id] = {
                "status": "success",
                "smiles": smiles,
                "cid": cid,
                "file": str(output_path)
            }
        else:
            results[substance_id] = {"status": "failed", "reason": "Structure generation failed"}
        
        print()
    
    # Summary
    print("=" * 60)
    print("SUMMARY")
    print("=" * 60)
    
    successful = sum(1 for r in results.values() if r['status'] == 'success')
    failed = len(results) - successful
    
    print(f"✅ Successful: {successful}/{len(results)}")
    print(f"❌ Failed: {failed}/{len(results)}")
    print()
    
    if successful > 0:
        print("Generated files:")
        for substance_id, result in results.items():
            if result['status'] == 'success':
                print(f"  - {substance_id}_rdkit.svg (CID: {result['cid']})")
    
    print()
    print("🎉 Done! Molecular structures are ready for integration.")

if __name__ == "__main__":
    main()
