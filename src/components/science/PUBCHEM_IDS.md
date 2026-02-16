# PubChem Compound IDs for Common Psychedelics

For use with the MoleculeViewer component (WO_032).

## Compound IDs

| Substance | PubChem CID | SMILES |
|-----------|-------------|--------|
| **Psilocybin** | 10624 | CN(C)CCc1c[nH]c2ccc(OP(=O)(O)O)cc12 |
| **Psilocin** | 10258 | CN(C)CCc1c[nH]c2ccc(O)cc12 |
| **LSD** | 5761 | CCN(CC)C(=O)[C@H]1CN([C@@H]2Cc3c[nH]c4cccc(c34)C2=C1)C |
| **DMT** | 6089 | CN(C)CCc1c[nH]c2ccccc12 |
| **5-MeO-DMT** | 1832 | CN(C)CCc1c[nH]c2ccc(OC)cc12 |
| **Mescaline** | 4276 | COc1cc(CCN)cc(OC)c1OC |
| **MDMA** | 1615 | CC(NC)Cc1ccc2c(c1)OCO2 |
| **Ketamine** | 3821 | CNC1(CCCCC1=O)c2ccccc2Cl |
| **Ibogaine** | 197101 | CC[C@H]1CN2CCc3c([nH]c4ccccc34)[C@H]2C[C@@H]1C[C@@H]5NCCc6c5[nH]c7ccccc67 |

## Usage

```tsx
<MoleculeViewer
  substanceName="Psilocybin"
  pubchemCid={10624}
  placeholderImage="/molecules/Psilocybin.webp"
  autoRotate={true}
/>
```

## API Endpoint

PubChem 3D SDF: `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/{CID}/record/SDF/?record_type=3d`

Example: https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/10624/record/SDF/?record_type=3d
