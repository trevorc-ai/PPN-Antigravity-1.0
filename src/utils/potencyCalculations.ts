/**
 * Potency calculation utilities
 * WO-059: Potency Normalizer
 * 
 * Pure functions — no side effects, fully testable.
 * BASE_MG_PER_GRAM assumes 10mg psilocybin per 1g dried standard cubensis.
 */

export const BASE_MG_PER_GRAM = 10.0;

export function calculateTargetWeight(targetMg: number, potencyCoeff: number): number {
    if (potencyCoeff <= 0) return 0;
    return targetMg / (BASE_MG_PER_GRAM * potencyCoeff);
}

export function calculateEffectiveDose(weightGrams: number, potencyCoeff: number): number {
    return weightGrams * BASE_MG_PER_GRAM * potencyCoeff;
}

export function getWarningLevel(potencyCoeff: number, doseMg: number): 'none' | 'moderate' | 'high' {
    if (doseMg > 50 || potencyCoeff >= 2.0) return 'high';
    if (potencyCoeff >= 1.2) return 'moderate';
    return 'none';
}

export function getPotencyLabel(coeff: number): string {
    if (coeff >= 2.0) return 'High Potency';
    if (coeff >= 1.2) return 'Moderate Potency';
    return 'Standard Potency';
}

export interface StrainOption {
    strain_id: string;
    substance_type: string;
    strain_name: string;
    default_potency_coefficient: number;
    description: string;
}

// Static strain database — mirrors ref_substance_strains seed data
export const STRAIN_DATABASE: StrainOption[] = [
    { strain_id: '1', substance_type: 'Psilocybe Cubensis', strain_name: 'Golden Teacher', default_potency_coefficient: 1.0, description: 'Standard potency cubensis strain, widely cultivated' },
    { strain_id: '2', substance_type: 'Psilocybe Cubensis', strain_name: 'B+', default_potency_coefficient: 0.9, description: 'Slightly lower potency, beginner-friendly' },
    { strain_id: '3', substance_type: 'Psilocybe Cubensis', strain_name: 'Albino A+', default_potency_coefficient: 1.2, description: 'Moderate-high potency albino variant' },
    { strain_id: '4', substance_type: 'Psilocybe Cubensis', strain_name: 'Penis Envy', default_potency_coefficient: 2.0, description: 'High potency strain, approximately 2x standard cubensis' },
    { strain_id: '5', substance_type: 'Psilocybe Azurescens', strain_name: 'Wild Azurescens', default_potency_coefficient: 3.0, description: 'Extremely potent species, 3x standard cubensis' },
    { strain_id: '6', substance_type: 'Psilocybe Cyanescens', strain_name: 'Wavy Caps', default_potency_coefficient: 2.5, description: 'Very potent species, 2.5x standard cubensis' },
    { strain_id: '7', substance_type: 'MDMA', strain_name: 'Unknown', default_potency_coefficient: 1.0, description: 'Standard MDMA — verify with reagent test' },
    { strain_id: '8', substance_type: 'LSD', strain_name: 'Unknown', default_potency_coefficient: 1.0, description: 'Standard LSD — verify with reagent test' },
];
