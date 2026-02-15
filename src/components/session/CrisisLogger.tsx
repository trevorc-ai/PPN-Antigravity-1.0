import React, { useState, useEffect } from 'react';
import { TacticalButton } from '../ui/TacticalButton';
import { supabase } from '../../supabaseClient';

interface CrisisLoggerProps {
    sessionId: string;
    sessionStartTime: Date;
}

interface Intervention {
    id: number;
    label: string;
    color: 'green' | 'amber' | 'orange' | 'red';
    requireLongPress?: boolean;
}

const INTERVENTIONS: Intervention[] = [
    { id: 1, label: 'Vital Signs Normal', color: 'green' },
    { id: 2, label: 'Verbal Support', color: 'amber' },
    { id: 3, label: 'Physical Assist', color: 'orange' },
    { id: 4, label: 'Chemical Intervention', color: 'red', requireLongPress: true }
];

export const CrisisLogger: React.FC<CrisisLoggerProps> = ({ sessionId, sessionStartTime }) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [error, setError] = useState<string | null>(null);

    // Update timer every second
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Calculate elapsed time
    const secondsSinceStart = Math.floor((currentTime.getTime() - sessionStartTime.getTime()) / 1000);
    const hours = Math.floor(secondsSinceStart / 3600);
    const minutes = Math.floor((secondsSinceStart % 3600) / 60);
    const seconds = secondsSinceStart % 60;
    const timerDisplay = `T+${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    const handleInterventionLog = async (interventionId: number) => {
        setError(null);

        try {
            const { error: insertError } = await supabase
                .from('log_interventions')
                .insert({
                    session_id: sessionId,
                    intervention_id: interventionId,
                    seconds_since_start: secondsSinceStart
                });

            if (insertError) {
                console.error('Error logging intervention:', insertError);
                setError('Failed to log intervention');
            }
        } catch (err) {
            console.error('Error logging intervention:', err);
            setError('Failed to log intervention');
        }
    };

    return (
        <div style={{
            backgroundColor: '#000000',
            minHeight: '100vh',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Session Timer */}
            <div style={{
                textAlign: 'center',
                marginBottom: '24px'
            }}>
                <div style={{
                    color: '#94a3b8',
                    fontSize: '14px',
                    marginBottom: '4px',
                    letterSpacing: '0.1em'
                }}>
                    SESSION TIME
                </div>
                <div style={{
                    color: '#f1f5f9',
                    fontSize: '32px',
                    fontWeight: 'bold',
                    fontFamily: 'monospace',
                    letterSpacing: '0.05em'
                }}>
                    {timerDisplay}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div style={{
                    backgroundColor: '#7f1d1d',
                    color: '#fecaca',
                    padding: '12px',
                    borderRadius: '4px',
                    marginBottom: '16px',
                    fontSize: '14px',
                    textAlign: 'center'
                }}>
                    {error}
                </div>
            )}

            {/* 2x2 Button Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                flex: 1,
                maxWidth: '800px',
                margin: '0 auto',
                width: '100%'
            }}>
                {INTERVENTIONS.map(intervention => (
                    <TacticalButton
                        key={intervention.id}
                        label={intervention.label}
                        color={intervention.color}
                        requireLongPress={intervention.requireLongPress}
                        longPressDuration={2000}
                        onPress={() => handleInterventionLog(intervention.id)}
                    />
                ))}
            </div>
        </div>
    );
};
