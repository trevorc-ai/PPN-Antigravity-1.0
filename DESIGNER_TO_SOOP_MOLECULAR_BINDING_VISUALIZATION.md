# 🧬 3D Molecule-Receptor Binding Visualization Requirements

**From:** DESIGNER  
**To:** SOOP (Data Subagent)  
**Date:** 2026-02-12 05:44 PST  
**Priority:** HIGH - ADVANCED FEATURE  
**Context:** Molecular pharmacology visualization for clinical intelligence

---

## 🎯 **VISION**

Create **scientifically accurate, interactive 3D visualizations** showing:
1. **Ligand structure** (psychedelic molecules)
2. **Receptor structure** (5-HT2A, D2, NMDA, etc.)
3. **Binding interactions** (hydrogen bonds, hydrophobic pockets, electrostatic)
4. **Conformational changes** (active vs inactive states)
5. **Binding affinity predictions** (docking scores, Ki values)

This goes **far beyond** simple molecular structures - we're visualizing the **mechanism of action**.

---

## 📊 **DATA REQUIREMENTS FROM SOOP**

### **1. Ligand (Substance) Data**

#### **Basic Molecular Data**
```sql
CREATE TABLE ref_substance_molecular_data (
  substance_id BIGINT PRIMARY KEY REFERENCES ref_substances,
  
  -- 2D Structure
  smiles_string TEXT NOT NULL,
  -- Example: "CN(C)CCc1c[nH]c2ccc(OP(=O)(O)O)cc12" (Psilocybin)
  
  inchi_key VARCHAR(27),
  -- Example: "LQXVFWRQNMEDEE-UHFFFAOYSA-N"
  
  -- 3D Structure
  mol_file_3d TEXT,
  -- MDL MOL format with 3D coordinates
  
  pdb_coordinates TEXT,
  -- Protein Data Bank format
  
  sdf_file TEXT,
  -- Structure-Data File format
  
  -- Molecular Properties
  molecular_weight DECIMAL(10,4),
  logp DECIMAL(5,2),  -- Lipophilicity
  tpsa DECIMAL(6,2),  -- Topological polar surface area
  hbd_count INT,      -- Hydrogen bond donors
  hba_count INT,      -- Hydrogen bond acceptors
  rotatable_bonds INT,
  
  -- Pharmacokinetics
  bioavailability_percent DECIMAL(5,2),
  half_life_hours DECIMAL(6,2),
  protein_binding_percent DECIMAL(5,2),
  
  -- Data sources
  pubchem_cid BIGINT,
  chemspider_id BIGINT,
  drugbank_id VARCHAR(20),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);
```

---

### **2. Receptor Data**

#### **Receptor Structures**
```sql
CREATE TABLE ref_receptors (
  receptor_id BIGSERIAL PRIMARY KEY,
  
  -- Receptor identification
  receptor_name VARCHAR(100) NOT NULL,
  -- Examples: "5-HT2A", "D2", "NMDA", "CB1", "κ-opioid"
  
  receptor_class VARCHAR(50),
  -- "GPCR", "Ion Channel", "Nuclear Receptor"
  
  receptor_family VARCHAR(100),
  -- "Serotonin Receptor", "Dopamine Receptor", etc.
  
  -- Structural data
  pdb_id VARCHAR(10),
  -- Protein Data Bank ID (e.g., "6A93" for 5-HT2A)
  
  pdb_file TEXT,
  -- Full PDB structure file
  
  uniprot_id VARCHAR(20),
  -- UniProt protein ID
  
  -- Binding site information
  binding_site_residues TEXT[],
  -- Array of residue IDs: ["TRP336", "PHE340", "SER242"]
  
  binding_pocket_coordinates JSONB,
  -- 3D coordinates of binding pocket center
  /*
  {
    "center": {"x": 12.5, "y": -8.3, "z": 15.7},
    "radius": 10.0,
    "volume": 450.2
  }
  */
  
  -- Transmembrane helices (for GPCRs)
  tm_helices JSONB,
  /*
  {
    "TM1": {"start": 45, "end": 68},
    "TM2": {"start": 75, "end": 98},
    ...
    "TM7": {"start": 310, "end": 333}
  }
  */
  
  -- Metadata
  description TEXT,
  function TEXT,
  tissue_distribution TEXT[],
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

### **3. Ligand-Receptor Binding Data**

#### **Binding Affinity & Interactions**
```sql
CREATE TABLE ref_ligand_receptor_binding (
  binding_id BIGSERIAL PRIMARY KEY,
  substance_id BIGINT REFERENCES ref_substances,
  receptor_id BIGINT REFERENCES ref_receptors,
  
  -- Binding affinity
  binding_type VARCHAR(20),  -- 'agonist', 'antagonist', 'partial_agonist', 'inverse_agonist'
  
  ki_value DECIMAL(10,4),  -- Inhibition constant (nM)
  kd_value DECIMAL(10,4),  -- Dissociation constant (nM)
  ic50_value DECIMAL(10,4), -- Half-maximal inhibitory concentration (nM)
  ec50_value DECIMAL(10,4), -- Half-maximal effective concentration (nM)
  
  -- Binding pose (docking results)
  docking_score DECIMAL(8,2),
  binding_energy_kcal DECIMAL(8,2),
  
  binding_pose_pdb TEXT,
  -- PDB file of ligand in binding pocket
  
  -- Key interactions
  hydrogen_bonds JSONB,
  /*
  [
    {
      "ligand_atom": "N1",
      "receptor_residue": "ASP155",
      "receptor_atom": "OD2",
      "distance_angstrom": 2.8,
      "angle_degrees": 165
    }
  ]
  */
  
  hydrophobic_interactions JSONB,
  /*
  [
    {
      "ligand_atoms": ["C5", "C6", "C7"],
      "receptor_residues": ["PHE340", "TRP336"],
      "type": "pi-pi_stacking"
    }
  ]
  */
  
  electrostatic_interactions JSONB,
  /*
  [
    {
      "ligand_atom": "N+",
      "receptor_residue": "ASP155",
      "type": "salt_bridge",
      "distance_angstrom": 3.2
    }
  ]
  */
  
  -- Conformational changes
  receptor_conformation VARCHAR(20),  -- 'active', 'inactive', 'intermediate'
  
  tm_helix_movements JSONB,
  /*
  {
    "TM6": {
      "rotation_degrees": 14.5,
      "translation_angstrom": 6.2,
      "direction": "outward"
    }
  }
  */
  
  -- Evidence & sources
  evidence_type VARCHAR(50),  -- 'X-ray', 'Cryo-EM', 'Docking', 'MD_simulation'
  resolution_angstrom DECIMAL(4,2),
  reference_doi TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

### **4. Computational Docking Results**

#### **Predicted Binding Poses**
```sql
CREATE TABLE ml_docking_predictions (
  prediction_id BIGSERIAL PRIMARY KEY,
  substance_id BIGINT REFERENCES ref_substances,
  receptor_id BIGINT REFERENCES ref_receptors,
  
  -- Docking method
  docking_software VARCHAR(50),  -- 'AutoDock', 'Glide', 'GOLD', 'DeepDock'
  model_version VARCHAR(50),
  
  -- Top binding poses (usually top 10)
  binding_poses JSONB,
  /*
  [
    {
      "rank": 1,
      "score": -8.5,
      "rmsd_angstrom": 0.0,
      "coordinates": [...],  // 3D coords of ligand atoms
      "interactions": {
        "h_bonds": 3,
        "hydrophobic": 5,
        "electrostatic": 1
      }
    }
  ]
  */
  
  -- Binding site residues involved
  key_residues TEXT[],
  -- ["TRP336", "PHE340", "SER242", "ASP155", "VAL156"]
  
  -- Predicted affinity
  predicted_ki_nm DECIMAL(10,4),
  confidence_score DECIMAL(5,2),
  
  -- Visualization data
  visualization_pdb TEXT,
  -- PDB file ready for 3D viewer
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🎨 **VISUALIZATION REQUIREMENTS**

### **Level 1: Individual Molecules (Basic)**
**What to Show:**
- 3D ball-and-stick model
- CPK coloring (C=gray, N=blue, O=red, etc.)
- Rotatable, zoomable

**Data Needed:**
- SMILES string OR MOL file
- Molecular formula
- Molecular weight

**Implementation:** Three.js + 3Dmol.js

---

### **Level 2: Receptor Structure (Intermediate)**
**What to Show:**
- Protein backbone (ribbon diagram)
- Transmembrane helices (for GPCRs)
- Binding pocket highlighted
- Key residues labeled

**Data Needed:**
- PDB file of receptor
- Binding site residue list
- TM helix boundaries

**Implementation:** Mol* Viewer or NGL Viewer

---

### **Level 3: Ligand-Receptor Complex (Advanced)**
**What to Show:**
- Receptor structure (ribbon)
- Ligand in binding pocket (ball-and-stick)
- Hydrogen bonds (dashed lines)
- Hydrophobic interactions (surfaces)
- Distance labels
- Interactive: click residue to see details

**Data Needed:**
- Receptor PDB
- Ligand-receptor complex PDB
- Interaction data (H-bonds, hydrophobic, etc.)

**Implementation:** Mol* Viewer with custom styling

---

### **Level 4: Mechanism of Action (Expert)**
**What to Show:**
- Side-by-side: inactive vs active receptor
- Animation of conformational change
- TM helix movement vectors
- G-protein coupling site
- Signaling pathway diagram

**Data Needed:**
- Inactive state PDB
- Active state PDB
- TM helix movement data
- Downstream signaling info

**Implementation:** Mol* + custom animation

---

## 🛠️ **RECOMMENDED TOOLS & LIBRARIES**

### **For 3D Molecular Visualization:**

#### **1. Mol* (Molstar) Viewer** ⭐ RECOMMENDED
**Pros:**
- ✅ Industry standard (used by PDB, UniProt)
- ✅ Handles proteins + ligands
- ✅ Excellent performance
- ✅ Rich interaction display
- ✅ Free, open-source

**Implementation:**
```jsx
import { createPluginUI } from 'molstar/lib/mol-plugin-ui';

const MoleculeReceptorViewer = ({ pdbId, ligandSmiles }) => {
  useEffect(() => {
    const viewer = createPluginUI(containerRef.current);
    
    // Load receptor from PDB
    await viewer.loadStructureFromUrl(`https://files.rcsb.org/download/${pdbId}.pdb`);
    
    // Add ligand
    await viewer.loadStructureFromData(ligandSmiles, 'smi');
    
    // Style receptor as ribbon
    viewer.managers.structure.component.setRepresentation('cartoon');
    
    // Style ligand as ball-and-stick
    viewer.managers.structure.component.setRepresentation('ball-and-stick', {
      selector: { residueName: 'LIG' }
    });
    
    // Highlight binding site
    viewer.managers.structure.component.setRepresentation('ball-and-stick', {
      selector: { residueIds: ['TRP336', 'PHE340', 'SER242'] }
    });
  }, [pdbId]);
};
```

---

#### **2. 3Dmol.js**
**Pros:**
- ✅ Lightweight (~200KB)
- ✅ Easy to use
- ✅ Good for simple molecules

**Cons:**
- ⚠️ Less powerful for complex proteins
- ⚠️ Limited interaction display

---

#### **3. NGL Viewer**
**Pros:**
- ✅ Beautiful rendering
- ✅ Good performance
- ✅ Molecular dynamics support

**Cons:**
- ⚠️ Larger bundle size
- ⚠️ Steeper learning curve

---

### **For Computational Analysis:**

#### **Python Backend (SOOP's Domain)**

**RDKit** - Molecular manipulation
```python
from rdkit import Chem
from rdkit.Chem import AllChem, Descriptors

# Generate 3D coordinates from SMILES
mol = Chem.MolFromSmiles("CN(C)CCc1c[nH]c2ccc(OP(=O)(O)O)cc12")
AllChem.EmbedMolecule(mol)
AllChem.MMFFOptimizeMolecule(mol)

# Calculate properties
logp = Descriptors.MolLogP(mol)
tpsa = Descriptors.TPSA(mol)
```

**BioPython** - Protein structure manipulation
```python
from Bio.PDB import PDBParser, PDBIO

# Load receptor structure
parser = PDBParser()
structure = parser.get_structure('5HT2A', '6a93.pdb')

# Extract binding site residues
binding_site = [residue for residue in structure.get_residues() 
                if residue.id[1] in [155, 242, 336, 340]]
```

**AutoDock Vina** - Molecular docking
```python
from vina import Vina

v = Vina(sf_name='vina')
v.set_receptor('receptor.pdbqt')
v.set_ligand_from_file('ligand.pdbqt')
v.compute_vina_maps(center=[15, 25, 78], box_size=[20, 20, 20])
v.dock(exhaustiveness=32, n_poses=10)
```

---

## 📋 **IMPLEMENTATION PHASES**

### **Phase 1: Basic Molecules (This Week)**
**SOOP Provides:**
- [ ] SMILES strings for all 7 substances
- [ ] Basic molecular properties (MW, LogP, TPSA)
- [ ] PubChem CIDs

**DESIGNER Creates:**
- [ ] 2D structure diagrams (fallback)
- [ ] Simple 3D viewers (3Dmol.js)

**BUILDER Implements:**
- [ ] Substance detail page with 3D viewer
- [ ] Lazy-loaded viewer component

---

### **Phase 2: Receptor Structures (Next Week)**
**SOOP Provides:**
- [ ] PDB IDs for key receptors (5-HT2A, D2, NMDA, CB1)
- [ ] Binding site residue lists
- [ ] TM helix boundaries (for GPCRs)

**DESIGNER Creates:**
- [ ] Receptor visualization mockups
- [ ] Binding pocket highlighting designs

**BUILDER Implements:**
- [ ] Mol* viewer integration
- [ ] Receptor structure pages

---

### **Phase 3: Binding Interactions (Month 1)**
**SOOP Provides:**
- [ ] Ligand-receptor complex PDBs
- [ ] Hydrogen bond data
- [ ] Hydrophobic interaction data
- [ ] Binding affinity values (Ki, Kd)

**DESIGNER Creates:**
- [ ] Interaction visualization designs
- [ ] Annotation and labeling system

**BUILDER Implements:**
- [ ] Interactive binding site viewer
- [ ] Click-to-explore interactions
- [ ] Distance measurements

---

### **Phase 4: Mechanism of Action (Month 2)**
**SOOP Provides:**
- [ ] Inactive vs active state PDBs
- [ ] TM helix movement data
- [ ] Conformational change animations

**DESIGNER Creates:**
- [ ] Animation storyboards
- [ ] Side-by-side comparison designs

**BUILDER Implements:**
- [ ] Animated conformational changes
- [ ] Interactive mechanism explorer

---

## 🎯 **IMMEDIATE NEXT STEPS**

### **For SOOP (Priority Order):**

1. **CRITICAL - SMILES Strings** (Today)
   ```sql
   INSERT INTO ref_substance_molecular_data (substance_id, smiles_string) VALUES
   (1, 'CN(C)CCc1c[nH]c2ccc(OP(=O)(O)O)cc12'),  -- Psilocybin
   (2, 'CC(CC1=CC2=C(C=C1)OCO2)NC'),            -- MDMA
   (3, 'CNC1(CCCCC1=O)C2=CC=CC=C2Cl'),         -- Ketamine
   (4, 'CCN(CC)C(=O)C1CN(C)C2CC3=CNC4=CC=CC(=C34)C2=C1'), -- LSD
   (5, 'CN(C)CCC1=CNC2=C1C=C(C=C2)'),          -- DMT
   (6, 'COC1=CC(=CC(=C1OC)OC)CCN'),            -- Mescaline
   (7, 'CCC1CN2CCC3=C(C2CC1CC4=C3NC5=CC=CC=C45)OC'); -- Ibogaine
   ```

2. **HIGH - PDB IDs for Receptors** (This Week)
   ```sql
   INSERT INTO ref_receptors (receptor_name, pdb_id) VALUES
   ('5-HT2A', '6A93'),  -- Serotonin receptor 2A
   ('D2', '6CM4'),      -- Dopamine receptor D2
   ('NMDA', '5UN1'),    -- NMDA receptor
   ('CB1', '5TGZ'),     -- Cannabinoid receptor 1
   ('μ-opioid', '5C1M'); -- Mu-opioid receptor
   ```

3. **MEDIUM - Binding Affinity Data** (Next Week)
   - Ki values from literature
   - Binding type (agonist/antagonist)
   - References

---

## 💡 **DESIGN VISION**

### **Substance Detail Page Layout:**

```
┌─────────────────────────────────────────────┐
│  PSILOCYBIN                                 │
│  C12H17N2O4P  •  MW: 284.25 g/mol          │
├─────────────────────────────────────────────┤
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │                                       │ │
│  │     [3D Molecule Viewer]              │ │
│  │     Interactive, rotatable            │ │
│  │                                       │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  Molecular Properties                       │
│  • LogP: 1.2  • TPSA: 86.2 Ų               │
│  • H-bond donors: 2  • H-bond acceptors: 5 │
│                                             │
├─────────────────────────────────────────────┤
│  RECEPTOR BINDING PROFILE                   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ 5-HT2A  ████████████░░  Ki: 6 nM   │   │
│  │ 5-HT1A  ██████░░░░░░░░  Ki: 190 nM │   │
│  │ 5-HT2C  ████████░░░░░░  Ki: 45 nM  │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [View 3D Binding] → Opens binding viewer  │
└─────────────────────────────────────────────┘
```

---

## 🚀 **SUCCESS METRICS**

### **Scientific Accuracy:**
- ✅ All structures from validated sources (PDB, PubChem)
- ✅ Binding data from peer-reviewed literature
- ✅ Proper stereochemistry representation

### **User Engagement:**
- 🎯 >80% of users interact with 3D viewer
- 🎯 Average time on substance page >2 minutes
- 🎯 "Wow factor" in user testing

### **Performance:**
- ✅ 3D viewer loads in <2 seconds
- ✅ Smooth 60fps rotation
- ✅ Works on mobile devices

---

**Request Submitted:** 2026-02-12 05:44 PST  
**Priority:** HIGH  
**Complexity:** ADVANCED  
**Impact:** Differentiating feature - no other platform has this
