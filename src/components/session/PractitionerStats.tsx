import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { StatCard } from '../analytics/StatCard';
import { jsPDF } from 'jspdf';
import { Clock, Shield, FileText, Download } from 'lucide-react';

interface Session {
    id: string;
    created_at: string;
    protocol_id: string;
    interventions: Array<{ intervention_id: number }>;
}

interface MonthlyData {
    month: string;
    hours: number;
}

export const PractitionerStats: React.FC = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { data, error: fetchError } = await supabase
                .from('log_sessions')
                .select(`
          id,
          created_at,
          protocol_id,
          interventions:log_interventions(intervention_id)
        `)
                .eq('user_id', user.id);

            if (fetchError) throw fetchError;
            setSessions(data || []);
        } catch (err) {
            console.error('Error fetching sessions:', err);
            setError('Failed to load session data');
        } finally {
            setLoading(false);
        }
    };

    // Calculate metrics
    const calculateMetrics = () => {
        if (sessions.length === 0) {
            return {
                verifiedHours: 0,
                safetyScore: 0,
                uniqueProtocols: 0,
                monthlyData: []
            };
        }

        // Verified Hours (assuming 4 hours per session average)
        const verifiedHours = sessions.length * 4;

        // Safety Score (percentage without Chemical Intervention - ID 4)
        const sessionsWithoutChemical = sessions.filter(session =>
            !session.interventions?.some(i => i.intervention_id === 4)
        );
        const safetyScore = Math.round((sessionsWithoutChemical.length / sessions.length) * 100);

        // Unique Protocols
        const uniqueProtocols = new Set(sessions.map(s => s.protocol_id)).size;

        // Monthly Data for chart
        const monthlyMap = new Map<string, number>();
        sessions.forEach(session => {
            const date = new Date(session.created_at);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + 4); // 4 hours per session
        });

        const monthlyData: MonthlyData[] = Array.from(monthlyMap.entries())
            .map(([month, hours]) => ({ month, hours }))
            .sort((a, b) => a.month.localeCompare(b.month))
            .slice(-6); // Last 6 months

        return { verifiedHours, safetyScore, uniqueProtocols, monthlyData };
    };

    const { verifiedHours, safetyScore, uniqueProtocols, monthlyData } = calculateMetrics();

    // Generate PDF
    const exportPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.text('Practitioner Stats Summary', 20, 20);

        doc.setFontSize(12);
        doc.text(`Verified Hours: ${verifiedHours}`, 20, 40);
        doc.text(`Safety Score: ${safetyScore}%`, 20, 50);
        doc.text(`Unique Protocols: ${uniqueProtocols}`, 20, 60);

        doc.setFontSize(10);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 80);

        doc.save('practitioner-stats.pdf');
    };

    // SVG Chart
    const renderChart = () => {
        if (monthlyData.length === 0) return null;

        const maxHours = Math.max(...monthlyData.map(d => d.hours), 10);
        const width = 800;
        const height = 300;
        const padding = 40;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;

        const points = monthlyData.map((d, i) => {
            const x = padding + (i / (monthlyData.length - 1 || 1)) * chartWidth;
            const y = height - padding - (d.hours / maxHours) * chartHeight;
            return { x, y, ...d };
        });

        const pathData = points.map((p, i) =>
            `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
        ).join(' ');

        return (
            <svg width="100%" height="300" viewBox={`0 0 ${width} ${height}`} style={{ maxWidth: '100%' }}>
                {/* Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
                    <line
                        key={i}
                        x1={padding}
                        y1={height - padding - ratio * chartHeight}
                        x2={width - padding}
                        y2={height - padding - ratio * chartHeight}
                        stroke="#2a2a2a"
                        strokeWidth="1"
                    />
                ))}

                {/* Line chart */}
                <path
                    d={pathData}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Data points */}
                {points.map((p, i) => (
                    <circle
                        key={i}
                        cx={p.x}
                        cy={p.y}
                        r="5"
                        fill="#3b82f6"
                    />
                ))}

                {/* X-axis labels */}
                {points.map((p, i) => (
                    <text
                        key={i}
                        x={p.x}
                        y={height - padding + 20}
                        textAnchor="middle"
                        fill="#94a3b8"
                        fontSize="12"
                    >
                        {p.month.split('-')[1]}
                    </text>
                ))}

                {/* Y-axis labels */}
                {[0, 0.5, 1].map((ratio, i) => (
                    <text
                        key={i}
                        x={padding - 10}
                        y={height - padding - ratio * chartHeight + 5}
                        textAnchor="end"
                        fill="#94a3b8"
                        fontSize="12"
                    >
                        {Math.round(maxHours * ratio)}h
                    </text>
                ))}

                {/* Axes */}
                <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#2a2a2a" strokeWidth="2" />
                <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#2a2a2a" strokeWidth="2" />
            </svg>
        );
    };

    if (loading) {
        return (
            <div style={{
                backgroundColor: '#0a0a0a',
                padding: '48px',
                textAlign: 'center',
                borderRadius: '8px'
            }}>
                <div style={{ color: '#94a3b8' }}>Loading practitioner stats...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                backgroundColor: '#7f1d1d',
                color: '#fecaca',
                padding: '24px',
                borderRadius: '8px'
            }}>
                {error}
            </div>
        );
    }

    if (sessions.length === 0) {
        return (
            <div style={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #2a2a2a',
                borderRadius: '8px',
                padding: '48px',
                textAlign: 'center'
            }}>
                <div style={{ color: '#94a3b8', fontSize: '16px', marginBottom: '8px' }}>
                    No Sessions Recorded
                </div>
                <div style={{ color: '#64748b', fontSize: '14px' }}>
                    Start logging sessions to see your practitioner stats
                </div>
            </div>
        );
    }

    return (
        <div style={{
            backgroundColor: '#0a0a0a',
            padding: '32px',
            borderRadius: '8px',
            border: '1px solid #1a1a1a'
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '32px',
                paddingBottom: '16px',
                borderBottom: '2px solid #2a2a2a'
            }}>
                <h2 style={{
                    color: '#f1f5f9',
                    fontSize: '28px',
                    fontWeight: 'bold',
                    margin: 0
                }}>
                    Practitioner Stats
                </h2>
                <button
                    onClick={exportPDF}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 24px',
                        backgroundColor: '#3b82f6',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                    }}
                    aria-label="Export stats as PDF"
                >
                    <Download size={16} />
                    Export PDF
                </button>
            </div>

            {/* Metrics Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '16px',
                marginBottom: '32px'
            }}>
                <StatCard
                    label="Verified Hours"
                    value={verifiedHours}
                    icon={<Clock />}
                />
                <StatCard
                    label="Safety Score"
                    value={`${safetyScore}%`}
                    icon={<Shield />}
                    trend={safetyScore >= 80 ? 'up' : safetyScore >= 60 ? 'neutral' : 'down'}
                />
                <StatCard
                    label="Unique Protocols"
                    value={uniqueProtocols}
                    icon={<FileText />}
                />
            </div>

            {/* Chart Section */}
            <div style={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #2a2a2a',
                borderRadius: '8px',
                padding: '24px'
            }}>
                <h3 style={{
                    color: '#f1f5f9',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    marginBottom: '16px'
                }}>
                    Hours per Month
                </h3>
                <div role="img" aria-label={`Chart showing ${monthlyData.length} months of session hours`}>
                    {renderChart()}
                </div>
                {/* Accessible data table */}
                <details style={{ marginTop: '16px' }}>
                    <summary style={{
                        color: '#94a3b8',
                        fontSize: '12px',
                        cursor: 'pointer',
                        userSelect: 'none'
                    }}>
                        View data table
                    </summary>
                    <table style={{
                        width: '100%',
                        marginTop: '12px',
                        color: '#94a3b8',
                        fontSize: '12px'
                    }}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'left', padding: '8px' }}>Month</th>
                                <th style={{ textAlign: 'right', padding: '8px' }}>Hours</th>
                            </tr>
                        </thead>
                        <tbody>
                            {monthlyData.map((d, i) => (
                                <tr key={i}>
                                    <td style={{ padding: '8px' }}>{d.month}</td>
                                    <td style={{ textAlign: 'right', padding: '8px' }}>{d.hours}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </details>
            </div>
        </div>
    );
};
