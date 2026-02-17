import { useState, useEffect, useMemo } from 'react';
import {
    calculateBaselineRisks,
    calculateVitalAnomalies,
    calculateProgressRisks,
    getOverallRiskLevel,
    type BaselineRisk,
    type VitalSigns,
    type ProgressTrend,
    type RiskFlag,
    type RiskLevel
} from '../utils/riskCalculator';

export interface RiskDetectionData {
    baseline?: BaselineRisk;
    vitals?: VitalSigns;
    progressTrends?: ProgressTrend[];
}

export interface RiskDetectionResult {
    allFlags: RiskFlag[];
    baselineFlags: RiskFlag[];
    vitalFlags: RiskFlag[];
    progressFlags: RiskFlag[];
    overallRiskLevel: RiskLevel;
    hasHighRisk: boolean;
    hasModerateRisk: boolean;
}

/**
 * Hook for detecting and managing patient risk indicators
 * 
 * Automatically recalculates when patient data changes
 */
export const useRiskDetection = (data: RiskDetectionData): RiskDetectionResult => {
    const [result, setResult] = useState<RiskDetectionResult>({
        allFlags: [],
        baselineFlags: [],
        vitalFlags: [],
        progressFlags: [],
        overallRiskLevel: 'low',
        hasHighRisk: false,
        hasModerateRisk: false
    });

    // Calculate risks whenever data changes
    useEffect(() => {
        const baselineFlags = data.baseline ? calculateBaselineRisks(data.baseline) : [];
        const vitalFlags = data.vitals ? calculateVitalAnomalies(data.vitals) : [];
        const progressFlags = data.progressTrends
            ? data.progressTrends.flatMap(trend => calculateProgressRisks(trend))
            : [];

        const allFlags = [...baselineFlags, ...vitalFlags, ...progressFlags];
        const overallRiskLevel = getOverallRiskLevel(allFlags);

        setResult({
            allFlags,
            baselineFlags,
            vitalFlags,
            progressFlags,
            overallRiskLevel,
            hasHighRisk: allFlags.some(f => f.severity === 'high'),
            hasModerateRisk: allFlags.some(f => f.severity === 'moderate')
        });
    }, [
        data.baseline?.phq9,
        data.baseline?.gad7,
        data.baseline?.pcl5,
        data.baseline?.ace,
        data.vitals?.heartRate,
        data.vitals?.bloodPressureSystolic,
        data.vitals?.bloodPressureDiastolic,
        data.vitals?.spo2,
        data.vitals?.temperature,
        data.progressTrends
    ]);

    return result;
};
