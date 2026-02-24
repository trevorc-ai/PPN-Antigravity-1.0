---
name: molecular-visualization
description: Use this skill when asked to create, render, or design 3D molecular structures, protein binding sites, or chemical data visualizations.
triggers: ["render molecule", "3D structure", "protein view", "binding site", "PDB", "SMILES"]
---

# 🧬 Molecular Visualization & Scientific 3D Protocol

## 1. The Tech Stack (React + Science)
**Constraint:** Do NOT attempt to draw molecules from scratch using generic shapes. You must use established cheminformatics libraries to ensure scientific accuracy.
- **Primary Viewer:** Use **`3dmol.js`** (specifically the React wrapper `3dmol`) for standard PDB/MOL rendering.
- **Advanced Effects:** Use **`@react-three/fiber`** (Three.js) only for "glamour shots" or abstract visualizations where interaction logic is custom.
- **Data Source:** Expect molecular data in **SMILES** strings or **PDB** file format from the Python backend (RDKit).

## 2. Visualization Standards (The "Look")
To match the "Clinical Sci-Fi" / Glassmorphism aesthetic:
- **Style:** Default to "Ball and Stick" for small molecules (drugs) and "Cartoon" or "Ribbon" for large proteins.
- **Lighting:** Use high-contrast studio lighting. Molecules should cast soft shadows.
- **Colors:** Use CPK coloring (Carbon=Black/Grey, Oxygen=Red, Nitrogen=Blue) by default, but allow overrides for "Brand Theming" (e.g., Neon Green highlights for binding sites).

## 3. Interaction Protocols
All 3D molecules must be interactive:
- **Auto-Rotate:** Enable slow rotation on load (idle state).
- **Zoom/Pan:** Allow user manipulation.
- **Tooltips:** Hovering over an atom should display its Element and Index.

## 4. Implementation Recipe (React)
When building a component:
1.  **Import:** `import { Molstar } from 'pdbe-molstar/react';` OR `import Molecule3d from '3dmol';`
2.  **Props:** Accept `moleculeData` (PDB/SMILES) and `style` as props.
3.  **Container:** Wrap the canvas in a "Glass Panel" (`bg-slate-900/60 backdrop-blur-md`).
4.  **Error State:** If data is missing, show a fallback 2D SVG structure (using RDKit SVG) instead of a blank canvas.