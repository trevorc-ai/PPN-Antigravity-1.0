// src/constants/substances.tsx
/**
 * Substance Constants
 * 
 * Purpose: Support substance selection dropdowns, substance cards, and basic UI display
 * Scope: 7 priority psychedelic substances for PPN Research Portal
 * 
 * Data is intentionally minimal - only what's needed for UI/UX
 * Clinical/pharmacological data lives in the database (ref_substances table)
 */

export interface Substance {
    id: number;
    name: string;
    formula: string;
    color: string; // For UI theming (charts, cards, badges)
}

export const SUBSTANCES: Substance[] = [
    {
        id: 1,
        name: "Psilocybin",
        formula: "C₁₂H₁₇N₂O₄P",
        color: "#6366f1" // Indigo
    },
    {
        id: 2,
        name: "MDMA",
        formula: "C₁₁H₁₅NO₂",
        color: "#a855f7" // Purple
    },
    {
        id: 3,
        name: "Ketamine",
        formula: "C₁₃H₁₆ClNO",
        color: "#06b6d4" // Cyan
    },
    {
        id: 4,
        name: "LSD",
        formula: "C₂₀H₂₅N₃O",
        color: "#ec4899" // Pink
    },
    {
        id: 5,
        name: "DMT",
        formula: "C₁₂H₁₆N₂",
        color: "#8b5cf6" // Violet
    },
    {
        id: 6,
        name: "Mescaline",
        formula: "C₁₁H₁₇NO₃",
        color: "#f59e0b" // Amber
    },
    {
        id: 7,
        name: "Ibogaine",
        formula: "C₂₀H₂₆N₂O",
        color: "#10b981" // Emerald
    }
];

/**
 * Helper functions
 */

export const getSubstanceById = (id: number): Substance | undefined => {
    return SUBSTANCES.find(s => s.id === id);
};

export const getSubstanceByName = (name: string): Substance | undefined => {
    return SUBSTANCES.find(s => s.name.toLowerCase() === name.toLowerCase());
};

export const getSubstanceColor = (id: number): string => {
    return getSubstanceById(id)?.color || "#6b7280"; // Default gray
};

/**
 * Usage Examples:
 * 
 * 1. Substance dropdown:
 *    <select>
 *      {SUBSTANCES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
 *    </select>
 * 
 * 2. Substance card:
 *    <div style={{ borderColor: substance.color }}>
 *      <h3>{substance.name}</h3>
 *      <p>{substance.formula}</p>
 *    </div>
 * 
 * 3. Chart legend:
 *    data.map(item => ({
 *      ...item,
 *      color: getSubstanceColor(item.substance_id)
 *    }))
 */
