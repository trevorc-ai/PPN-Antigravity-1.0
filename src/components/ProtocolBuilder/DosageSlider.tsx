import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';

interface DosageSliderProps {
    min: number;
    max: number;
    value: number;
    onChange: (value: number) => void;
    unit: string;
    substanceName?: string;
    patientWeight?: string;
}

interface DosageZone {
    label: string;
    range: [number, number];
    color: string;
    bgColor: string;
}

export const DosageSlider: React.FC<DosageSliderProps> = ({
    min,
    max,
    value,
    onChange,
    unit,
    substanceName,
    patientWeight,
}) => {
    const [isDragging, setIsDragging] = useState(false);

    // Define color zones based on substance
    const getZones = (): DosageZone[] => {
        // Default zones (can be customized per substance)
        return [
            {
                label: 'Therapeutic',
                range: [min, 30],
                color: '#10b981',
                bgColor: 'bg-emerald-500/20',
            },
            {
                label: 'High',
                range: [31, 50],
                color: '#f59e0b',
                bgColor: 'bg-amber-500/20',
            },
            {
                label: 'Dangerous',
                range: [51, max],
                color: '#ef4444',
                bgColor: 'bg-red-500/20',
            },
        ];
    };

    const zones = getZones();

    // Determine current zone
    const getCurrentZone = (): DosageZone => {
        return zones.find(zone => value >= zone.range[0] && value <= zone.range[1]) || zones[0];
    };

    const currentZone = getCurrentZone();

    // Calculate percentage for slider fill
    const percentage = ((value - min) / (max - min)) * 100;

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
            e.preventDefault();
            onChange(Math.min(value + 1, max));
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
            e.preventDefault();
            onChange(Math.max(value - 1, min));
        }
    };

    return (
        <div className="space-y-4">
            {/* Value Display */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="text-4xl font-bold text-[#f8fafc]">
                        {value}
                        <span className="text-2xl text-[#94a3b8] ml-1">{unit}</span>
                    </div>
                    <div
                        className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${currentZone.bgColor}`}
                        style={{ backgroundColor: currentZone.color }}
                    >
                        {currentZone.label}
                    </div>
                </div>

                {/* Info Tooltip */}
                <div className="flex items-center gap-2 text-sm text-[#94a3b8]">
                    <Info className="w-4 h-4" />
                    <span>
                        {substanceName && `${substanceName}: `}
                        Therapeutic: {zones[0].range[0]}-{zones[0].range[1]}{unit}
                    </span>
                </div>
            </div>

            {/* Slider Track */}
            <div className="relative">
                {/* Zone Background */}
                <div className="h-3 rounded-full bg-[#1e293b] overflow-hidden flex">
                    {zones.map((zone, index) => {
                        const zoneWidth = ((zone.range[1] - zone.range[0]) / (max - min)) * 100;
                        return (
                            <div
                                key={index}
                                className={zone.bgColor}
                                style={{
                                    width: `${zoneWidth}%`,
                                    backgroundColor: `${zone.color}20`,
                                }}
                            />
                        );
                    })}
                </div>

                {/* Fill */}
                <div
                    className="absolute top-0 left-0 h-3 rounded-full transition-all"
                    style={{
                        width: `${percentage}%`,
                        backgroundColor: currentZone.color,
                    }}
                />

                {/* Slider Input */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    onKeyDown={handleKeyDown}
                    onMouseDown={() => setIsDragging(true)}
                    onMouseUp={() => setIsDragging(false)}
                    onTouchStart={() => setIsDragging(true)}
                    onTouchEnd={() => setIsDragging(false)}
                    className="absolute top-0 left-0 w-full h-3 opacity-0 cursor-pointer"
                    aria-label={`Dosage slider, current value ${value} ${unit}`}
                    aria-valuemin={min}
                    aria-valuemax={max}
                    aria-valuenow={value}
                    aria-valuetext={`${value} ${unit} - ${currentZone.label} range`}
                />

                {/* Thumb */}
                <div
                    className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 border-white shadow-lg transition-all ${isDragging ? 'scale-125' : 'scale-100'
                        }`}
                    style={{
                        left: `calc(${percentage}% - 12px)`,
                        backgroundColor: currentZone.color,
                    }}
                />
            </div>

            {/* Zone Labels */}
            <div className="flex justify-between text-xs text-[#64748b]">
                {zones.map((zone, index) => (
                    <div key={index} className="flex items-center gap-1">
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: zone.color }}
                        />
                        <span>
                            {zone.label}: {zone.range[0]}-{zone.range[1]}{unit}
                        </span>
                    </div>
                ))}
            </div>

            {/* Patient-Specific Recommendation - HIDDEN FOR NOW */}
            {/* TODO: Re-implement with research data framing (not medical advice) */}
            {/* See: /Users/trevorcalton/.gemini/antigravity/brain/ec364aaf-2cd2-4f3f-9b70-fcc3645108de/implementation_plan.md */}
            {/* {patientWeight && (
                <div className="text-sm text-[#94a3b8] bg-[#0f1218] border border-[#1e293b] rounded-lg p-3">
                    <span className="font-medium text-[#f8fafc]">Recommendation:</span> Based on patient weight ({patientWeight}), suggested starting dose is 20-25{unit}.
                </div>
            )} */}
        </div>
    );
};
