import React, { useEffect } from 'react';

export interface ZoneVisibility {
    z1: boolean; z2: boolean; z3: boolean; z4: boolean; z5: boolean;
}

const DEFAULT_ZONES: ZoneVisibility = { z1: true, z2: true, z3: true, z4: true, z5: true };

const ZONE_LABELS: Record<keyof ZoneVisibility, string> = {
    z1: 'Zone 1 — Your Experience Map',
    z2: 'Zone 2 — Your Session Journey',
    z3: 'Zone 3 — Neuroplastic Window',
    z4: 'Zone 4 — You Are Not Alone',
    z5: 'Zone 5 — Your Path Forward',
};

function storageKey(sessionId: string) {
    return `ppn_compass_zones_${sessionId}`;
}

function loadZones(sessionId: string): ZoneVisibility {
    try {
        const raw = localStorage.getItem(storageKey(sessionId));
        if (raw) return { ...DEFAULT_ZONES, ...JSON.parse(raw) };
    } catch { }
    return DEFAULT_ZONES;
}

function saveZones(sessionId: string, zones: ZoneVisibility) {
    try {
        localStorage.setItem(storageKey(sessionId), JSON.stringify(zones));
    } catch { }
}

export interface CompassCustomizePanelProps {
    sessionId: string;
    zones: ZoneVisibility;
    onZonesChange: (z: ZoneVisibility) => void;
    personalMessage: string;
    onPersonalMessageChange: (msg: string) => void;
}

export { loadZones };

export const CompassCustomizePanel: React.FC<CompassCustomizePanelProps> = ({
    sessionId,
    zones,
    onZonesChange,
    personalMessage,
    onPersonalMessageChange,
}) => {
    // Persist zone changes
    useEffect(() => {
        saveZones(sessionId, zones);
    }, [sessionId, zones]);

    const patientUrl = typeof window !== 'undefined'
        ? `${window.location.origin}${window.location.pathname}?sessionId=${sessionId}`
        : '';

    const copyPatientLink = async () => {
        try {
            await navigator.clipboard.writeText(patientUrl);
        } catch { }
    };

    return (
        <div
            className="no-print"
            aria-label="Practitioner customization panel"
            style={{
                background: 'rgba(13,25,48,0.85)',
                border: '1px solid rgba(45,212,191,0.20)',
                borderRadius: 16,
                padding: '20px 24px',
                marginBottom: 20,
            }}
        >
            <p style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.10em', marginBottom: 14 }}>
                ⚙ Practitioner View — Customize This Compass
            </p>

            {/* Zone toggles */}
            <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 10 }}>
                Toggle zones to tailor the experience for your patient.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
                {(Object.entries(ZONE_LABELS) as [keyof ZoneVisibility, string][]).map(([key, label]) => (
                    <label
                        key={key}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            fontSize: 13, color: zones[key] ? '#2dd4bf' : '#475569',
                            cursor: 'pointer',
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={zones[key]}
                            onChange={e => onZonesChange({ ...zones, [key]: e.target.checked })}
                            style={{ accentColor: '#2dd4bf', width: 15, height: 15 }}
                            aria-label={`Toggle ${label}`}
                        />
                        {label}
                    </label>
                ))}
            </div>

            {/* Personal message */}
            <label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                Personal message to patient (screen-only, never stored)
            </label>
            <textarea
                value={personalMessage}
                onChange={e => onPersonalMessageChange(e.target.value)}
                placeholder="Write a personal note that will appear at the bottom of your patient's Compass..."
                rows={3}
                aria-label="Personal message to patient"
                style={{
                    width: '100%', background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(45,212,191,0.18)',
                    borderRadius: 10, padding: '10px 14px',
                    color: '#e2e8f0', fontSize: 13, resize: 'none',
                    boxSizing: 'border-box', marginBottom: 14,
                    fontFamily: 'inherit',
                }}
            />

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button
                    onClick={copyPatientLink}
                    aria-label="Copy patient link to clipboard"
                    style={{
                        padding: '9px 18px', borderRadius: 10, fontSize: 12, fontWeight: 700,
                        background: 'rgba(45,212,191,0.12)',
                        border: '1px solid rgba(45,212,191,0.30)',
                        color: '#2dd4bf', cursor: 'pointer',
                    }}
                >
                    Copy Patient Link
                </button>
                <button
                    onClick={() => {
                        const pvUrl = `${patientUrl}&pv=1`;
                        void navigator.clipboard.writeText(pvUrl);
                    }}
                    aria-label="Copy practitioner preview link"
                    style={{
                        padding: '9px 18px', borderRadius: 10, fontSize: 12, fontWeight: 700,
                        background: 'rgba(100,116,139,0.12)',
                        border: '1px solid rgba(100,116,139,0.25)',
                        color: '#94a3b8', cursor: 'pointer',
                    }}
                >
                    Copy Preview Link
                </button>
                <button
                    onClick={() => window.print()}
                    aria-label="Print integration compass as PDF"
                    style={{
                        padding: '9px 18px', borderRadius: 10, fontSize: 12, fontWeight: 700,
                        background: 'linear-gradient(135deg, #1e3a5f, #1e40af)',
                        border: 'none', color: '#e2e8f0', cursor: 'pointer',
                    }}
                >
                    Print PDF
                </button>
            </div>
        </div>
    );
};

export default CompassCustomizePanel;
