/**
 * Risk Calculator
 * 
 * Calculates risk levels based on baseline scores, vital sign anomalies, and progress trends
 */

export type RiskLevel = 'low' | 'moderate' | 'high';

export interface BaselineRisk {
    phq9?: number;
    gad7?: number;
    pcl5?: number;
    ace?: number;
}

export interface VitalSigns {
    heartRate: number;
    baselineHeartRate?: number;
    bloodPressureSystolic: number;
    bloodPressureDiastolic: number;
    spo2?: number;
    temperature?: number;
}

export interface ProgressTrend {
    metric: string;
    values: number[]; // Chronological order (oldest to newest)
    baseline: number;
}

export interface RiskFlag {
    type: 'baseline' | 'vitals' | 'progress';
    severity: RiskLevel;
    metric: string;
    value: number | string;
    threshold?: number;
    message: string;
    recommendation: string;
}

/**
 * Calculate baseline risk flags from assessment scores
 */
export const calculateBaselineRisks = (baseline: BaselineRisk): RiskFlag[] => {
    const flags: RiskFlag[] = [];

    // PHQ-9 (Depression)
    if (baseline.phq9 !== undefined) {
        if (baseline.phq9 >= 20) {
            flags.push({
                type: 'baseline',
                severity: 'high',
                metric: 'PHQ-9 (Depression)',
                value: baseline.phq9,
                threshold: 20,
                message: 'Severe Depression',
                recommendation: 'Trauma-informed approach required. Close monitoring during session.'
            });
        } else if (baseline.phq9 >= 15) {
            flags.push({
                type: 'baseline',
                severity: 'moderate',
                metric: 'PHQ-9 (Depression)',
                value: baseline.phq9,
                threshold: 15,
                message: 'Moderately Severe Depression',
                recommendation: 'Monitor closely during session.'
            });
        }
    }

    // GAD-7 (Anxiety)
    if (baseline.gad7 !== undefined) {
        if (baseline.gad7 >= 15) {
            flags.push({
                type: 'baseline',
                severity: 'high',
                metric: 'GAD-7 (Anxiety)',
                value: baseline.gad7,
                threshold: 15,
                message: 'Severe Anxiety',
                recommendation: 'Have rescue medication available. Ensure experienced practitioner present.'
            });
        } else if (baseline.gad7 >= 10) {
            flags.push({
                type: 'baseline',
                severity: 'moderate',
                metric: 'GAD-7 (Anxiety)',
                value: baseline.gad7,
                threshold: 10,
                message: 'Moderate Anxiety',
                recommendation: 'Monitor for anxiety escalation during session.'
            });
        }
    }

    // PCL-5 (PTSD)
    if (baseline.pcl5 !== undefined) {
        if (baseline.pcl5 >= 33) {
            flags.push({
                type: 'baseline',
                severity: 'high',
                metric: 'PCL-5 (PTSD)',
                value: baseline.pcl5,
                threshold: 33,
                message: 'Significant PTSD Symptoms',
                recommendation: 'Trauma-informed approach required. Have rescue medication available.'
            });
        }
    }

    // ACE (Childhood Adversity)
    if (baseline.ace !== undefined) {
        if (baseline.ace >= 6) {
            flags.push({
                type: 'baseline',
                severity: 'high',
                metric: 'ACE (Childhood Trauma)',
                value: baseline.ace,
                threshold: 6,
                message: 'High Childhood Adversity',
                recommendation: 'Trauma-informed approach required. Close monitoring during session.'
            });
        } else if (baseline.ace >= 4) {
            flags.push({
                type: 'baseline',
                severity: 'moderate',
                metric: 'ACE (Childhood Trauma)',
                value: baseline.ace,
                threshold: 4,
                message: 'Moderate Childhood Adversity',
                recommendation: 'Be aware of potential trauma responses during session.'
            });
        }
    }

    return flags;
};

/**
 * Calculate vital sign anomaly flags
 */
export const calculateVitalAnomalies = (vitals: VitalSigns): RiskFlag[] => {
    const flags: RiskFlag[] = [];

    // Heart Rate Anomaly (>30% change from baseline)
    if (vitals.baselineHeartRate) {
        const percentChange = ((vitals.heartRate - vitals.baselineHeartRate) / vitals.baselineHeartRate) * 100;
        if (Math.abs(percentChange) > 30) {
            flags.push({
                type: 'vitals',
                severity: percentChange > 50 ? 'high' : 'moderate',
                metric: 'Heart Rate',
                value: `${vitals.heartRate} bpm (${percentChange > 0 ? '+' : ''}${percentChange.toFixed(0)}% from baseline)`,
                threshold: 30,
                message: 'Heart Rate Anomaly Detected',
                recommendation: 'Monitor closely. Consider reducing stimulation. Have rescue medication ready.'
            });
        }
    }

    // Blood Pressure
    if (vitals.bloodPressureSystolic > 130 || vitals.bloodPressureDiastolic > 85) {
        flags.push({
            type: 'vitals',
            severity: vitals.bloodPressureSystolic > 140 ? 'high' : 'moderate',
            metric: 'Blood Pressure',
            value: `${vitals.bloodPressureSystolic}/${vitals.bloodPressureDiastolic} mmHg`,
            message: 'Elevated Blood Pressure',
            recommendation: 'Monitor closely. Consider reducing stimulation.'
        });
    }

    // SpO2 (Oxygen Saturation)
    if (vitals.spo2 !== undefined && vitals.spo2 < 95) {
        flags.push({
            type: 'vitals',
            severity: vitals.spo2 < 90 ? 'high' : 'moderate',
            metric: 'SpO2',
            value: `${vitals.spo2}%`,
            threshold: 95,
            message: 'Low Oxygen Saturation',
            recommendation: 'Check breathing. Consider supplemental oxygen if <90%.'
        });
    }

    // Temperature
    if (vitals.temperature !== undefined) {
        if (vitals.temperature > 99.5 || vitals.temperature < 97.0) {
            flags.push({
                type: 'vitals',
                severity: vitals.temperature > 100.5 || vitals.temperature < 96.0 ? 'high' : 'moderate',
                metric: 'Temperature',
                value: `${vitals.temperature}°F`,
                message: vitals.temperature > 99.5 ? 'Elevated Temperature' : 'Low Temperature',
                recommendation: 'Monitor closely. Document in session notes.'
            });
        }
    }

    return flags;
};

/**
 * Calculate progress trend flags (declining trends)
 */
export const calculateProgressRisks = (trend: ProgressTrend): RiskFlag[] => {
    const flags: RiskFlag[] = [];

    if (trend.values.length < 2) {
        return flags; // Need at least 2 data points
    }

    // Check for consecutive increases (declining progress)
    let consecutiveIncreases = 0;
    for (let i = 1; i < trend.values.length; i++) {
        if (trend.values[i] > trend.values[i - 1]) {
            consecutiveIncreases++;
        } else {
            consecutiveIncreases = 0;
        }
    }

    if (consecutiveIncreases >= 2) {
        const latestValue = trend.values[trend.values.length - 1];
        const previousValue = trend.values[trend.values.length - 2];
        const increase = latestValue - previousValue;

        flags.push({
            type: 'progress',
            severity: consecutiveIncreases >= 3 ? 'high' : 'moderate',
            metric: trend.metric,
            value: `${latestValue} (↑${increase} from previous)`,
            message: 'Declining Progress Detected',
            recommendation: 'Schedule additional integration session. Assess for external stressors. Consider booster session.'
        });
    }

    // Check if returning to baseline (within 10%)
    const latestValue = trend.values[trend.values.length - 1];
    const percentFromBaseline = ((latestValue - trend.baseline) / trend.baseline) * 100;
    if (Math.abs(percentFromBaseline) < 10) {
        flags.push({
            type: 'progress',
            severity: 'moderate',
            metric: trend.metric,
            value: `${latestValue} (${percentFromBaseline.toFixed(0)}% from baseline)`,
            message: 'Returning to Baseline',
            recommendation: 'Review treatment plan. Consider booster session.'
        });
    }

    return flags;
};

/**
 * Get overall risk level from all flags
 */
export const getOverallRiskLevel = (flags: RiskFlag[]): RiskLevel => {
    if (flags.some(f => f.severity === 'high')) {
        return 'high';
    }
    if (flags.some(f => f.severity === 'moderate')) {
        return 'moderate';
    }
    return 'low';
};

/**
 * Get risk level color
 */
export const getRiskColor = (level: RiskLevel): string => {
    switch (level) {
        case 'high':
            return 'text-red-400';
        case 'moderate':
            return 'text-yellow-400';
        case 'low':
            return 'text-emerald-400';
    }
};

/**
 * Get risk level icon
 */
export const getRiskIcon = (level: RiskLevel): string => {
    switch (level) {
        case 'high':
            return '🔴';
        case 'moderate':
            return '🟡';
        case 'low':
            return '🟢';
    }
};
