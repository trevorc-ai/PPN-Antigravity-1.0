import React, { useState, useCallback } from 'react';
import { supabase } from '../../supabaseClient';
import { CompassSlider } from './CompassSlider';
import { CompassInsightLine } from './CompassInsightLine';
import { CompassEMAPoint } from '../../hooks/useCompassEMA';

export interface DailyCheckInCardProps {
    sessionId: string;
    patientUuid: string | null;
    emaPoints: CompassEMAPoint[];
    streak: number;
    onSubmitted?: () => void;
}

const SAFETY_QUESTION = 'I am having thoughts of harming myself or others.';

export const DailyCheckInCard: React.FC<DailyCheckInCardProps> = ({
    sessionId,
    patientUuid,
    emaPoints,
    streak,
    onSubmitted,
}) => {
    const [values, setValues] = useState({ mood: 5, sleep: 5, connection: 5, anxiety: 5 });
    const [safetyFlag, setSafetyFlag] = useState<boolean | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Check if already submitted today
    const today = new Date().toISOString().slice(0, 10);
    const alreadyToday = emaPoints.some(p => p.date === today);

    const handleSubmit = useCallback(async () => {
        if (!sessionId) return;
        setSubmitting(true);
        setError(null);

        try {
            // Safety gate: log red alert if triggered
            if (safetyFlag === true) {
                await supabase.from('log_red_alerts').insert({
                    session_id: sessionId,
                    patient_uuid: patientUuid,
                    alert_type: 'safety_gate',
                    message: 'Patient indicated potential safety concern on integration compass.',
                    triggered_at: new Date().toISOString(),
                });
            }

            const { error: insertError } = await supabase.from('log_pulse_checks').insert({
                session_id: sessionId,
                patient_uuid: patientUuid,
                mood_level: values.mood,
                sleep_quality: values.sleep,
                connection_level: values.connection,
                anxiety_level: values.anxiety,
                check_date: today,
                completed_at: new Date().toISOString(),
            });

            if (insertError) throw insertError;

            setSubmitted(true);
            onSubmitted?.();
        } catch (err: any) {
            setError('Unable to save right now. Please try again shortly.');
        } finally {
            setSubmitting(false);
        }
    }, [sessionId, patientUuid, values, safetyFlag, today, onSubmitted]);

    // Already submitted today, show confirmation
    if (alreadyToday && !submitted) {
        return (
            <div style={{
                background: 'rgba(45,212,191,0.06)',
                border: '1px solid rgba(45,212,191,0.20)',
                borderRadius: 16,
                padding: '20px 24px',
                textAlign: 'center',
            }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>✓</div>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#2dd4bf', margin: '0 0 4px' }}>
                    You showed up today.
                </p>
                <p className="ppn-body" style={{ margin: 0 }}>
                    Your check-in has been recorded. See you tomorrow.
                </p>
                {streak >= 2 && (
                    <CompassInsightLine emaPoints={emaPoints} streak={streak} />
                )}
            </div>
        );
    }

    if (submitted) {
        return (
            <div style={{
                background: 'rgba(45,212,191,0.06)',
                border: '1px solid rgba(45,212,191,0.20)',
                borderRadius: 16,
                padding: '24px',
                textAlign: 'center',
            }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>✦</div>
                <p style={{ fontSize: 16, fontWeight: 800, color: '#2dd4bf', margin: '0 0 8px' }}>
                    Thank you for showing up.
                </p>
                <p className="ppn-body" style={{ margin: 0 }}>
                    Your check-in has been logged. Your practitioner can see your progress.
                </p>
                <CompassInsightLine emaPoints={emaPoints} streak={streak + 1} />
                {safetyFlag === true && (
                    <div style={{
                        marginTop: 20,
                        background: 'rgba(251,113,133,0.10)',
                        border: '1px solid rgba(251,113,133,0.30)',
                        borderRadius: 12,
                        padding: '14px 18px',
                    }}>
                        <p className="ppn-body" style={{ fontWeight: 700, color: '#fb7185', marginBottom: 6 }}>
                            We see you, and we care.
                        </p>
                        <p className="ppn-body" style={{ margin: 0 }}>
                            If you need immediate support, please call or text the Fireside Project:{' '}
                            <a
                                href="tel:6234737433"
                                style={{ color: '#fb7185', fontWeight: 800, textDecoration: 'none' }}
                                aria-label="Call Fireside Project at 623-473-7433"
                            >
                                623-473-7433
                            </a>
                        </p>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div style={{
            background: 'rgba(10,20,42,0.90)',
            border: '1px solid rgba(45,212,191,0.15)',
            borderRadius: 16,
            padding: '24px 28px',
        }}>
            <p className="ppn-body" style={{ marginBottom: 20 }}>
                A few quick questions about today. Your answers update your journey map instantly.
            </p>

            <CompassSlider
                id="checkin-mood"
                emoji="🌤"
                label="Mood"
                value={values.mood}
                onChange={v => setValues(s => ({ ...s, mood: v }))}
                minLabel="Heavy"
                maxLabel="Light"
            />
            <CompassSlider
                id="checkin-sleep"
                emoji="🌙"
                label="Sleep quality"
                value={values.sleep}
                onChange={v => setValues(s => ({ ...s, sleep: v }))}
                minLabel="Restless"
                maxLabel="Restful"
            />
            <CompassSlider
                id="checkin-connection"
                emoji="🤝"
                label="Connection to self"
                value={values.connection}
                onChange={v => setValues(s => ({ ...s, connection: v }))}
                minLabel="Distant"
                maxLabel="Present"
            />
            <CompassSlider
                id="checkin-anxiety"
                emoji="🧘"
                label="Ease of mind"
                value={values.anxiety}
                onChange={v => setValues(s => ({ ...s, anxiety: v }))}
                minLabel="Unsettled"
                maxLabel="At ease"
            />

            {/* Safety gate, always last */}
            <div style={{
                marginTop: 4,
                padding: '14px 18px',
                background: 'rgba(251,113,133,0.06)',
                border: '1px solid rgba(251,113,133,0.18)',
                borderRadius: 12,
                marginBottom: 20,
            }}>
                <p className="ppn-body" style={{ color: '#A8B5D1', marginBottom: 12 }}>
                    {SAFETY_QUESTION}
                </p>
                <div style={{ display: 'flex', gap: 12 }}>
                    {[{ val: false, label: 'No' }, { val: true, label: 'Yes, I need support' }].map(({ val, label }) => (
                        <button
                            key={String(val)}
                            onClick={() => setSafetyFlag(val)}
                            aria-pressed={safetyFlag === val}
                            style={{
                                padding: '8px 18px', borderRadius: 9999, fontSize: 14, fontWeight: 700,
                                cursor: 'pointer', transition: 'all 0.2s',
                                background: safetyFlag === val
                                    ? (val ? 'rgba(251,113,133,0.25)' : 'rgba(45,212,191,0.15)')
                                    : 'rgba(255,255,255,0.04)',
                                border: safetyFlag === val
                                    ? `1px solid ${val ? 'rgba(251,113,133,0.50)' : 'rgba(45,212,191,0.40)'}`
                                    : '1px solid rgba(255,255,255,0.10)',
                                color: safetyFlag === val ? (val ? '#fb7185' : '#2dd4bf') : '#64748b',
                            }}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {error && (
                <p className="ppn-meta" style={{ color: '#fb7185', marginBottom: 12 }}>{error}</p>
            )}

            <button
                onClick={handleSubmit}
                disabled={submitting || safetyFlag === null}
                aria-label="Submit daily check-in"
                style={{
                    width: '100%', padding: '13px', borderRadius: 12,
                    fontSize: 14, fontWeight: 800, letterSpacing: '0.06em',
                    cursor: safetyFlag === null ? 'not-allowed' : 'pointer',
                    opacity: safetyFlag === null ? 0.5 : 1,
                    background: 'linear-gradient(135deg, rgba(45,212,191,0.25), rgba(45,212,191,0.15))',
                    border: '1px solid rgba(45,212,191,0.40)',
                    color: '#2dd4bf',
                    transition: 'all 0.2s',
                }}
            >
                {submitting ? 'Saving…' : 'Log Today\'s Check-In'}
            </button>
        </div>
    );
};

export default DailyCheckInCard;
