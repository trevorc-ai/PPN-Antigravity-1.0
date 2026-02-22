import { useState, useEffect, useMemo } from 'react';
import {
    calculateBenchmarkReadiness,
    getNextSteps,
    type PatientBenchmarkData,
    type BenchmarkReadinessResult
} from '../utils/benchmarkReadinessCalculator';

/**
 * Hook for managing benchmark readiness state
 * 
 * Automatically recalculates when patient data changes
 */
export const useBenchmarkReadiness = (patientData: PatientBenchmarkData, enabledFeatures?: string[]) => {
    const [result, setResult] = useState<BenchmarkReadinessResult | null>(null);

    // Calculate readiness whenever patient data or features change
    useEffect(() => {
        const calculated = calculateBenchmarkReadiness(patientData, enabledFeatures);
        setResult(calculated);
    }, [
        patientData.hasBaselineAssessment,
        patientData.hasFollowUpAssessment,
        patientData.hasDosingProtocol,
        patientData.hasSetAndSetting,
        patientData.hasSafetyCheck,
        enabledFeatures?.join(',')
    ]);

    // Memoize next steps to avoid recalculation
    const nextSteps = useMemo(() => {
        return result ? getNextSteps(result) : [];
    }, [result]);

    return {
        result,
        nextSteps,
        isLoading: result === null
    };
};
